<template>
    <vs-card id="data-list-list-view" class="data-list-container">
        <div class="mt-5 ml-2">
            <h3>
                {{institucion.nombreInstitucion}}
            </h3>
            <vs-tabs alignment="fixed">
                <vs-tab label="Librerias">
                    <div>
                        <vs-card class="p-3">
                            <vs-row>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <b>Asignación librerias</b>
                                    <!-- {{ tabAsesorInstitucion.asin_idusuario }} -->
                                    <v-select :options="listaLibrerias" class="ml-3" style="width:60%" :reduce="listaLibrerias => listaLibrerias.idusuario" label="NombreApellidoAsesor" v-model="tabAsesorInstitucion.asin_idusuario"></v-select>
                                </vs-col>
                            </vs-row>    
                           <vs-row class="mt-5"> 
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                     <vs-button class="mr-3 mb-2" @click="guardarLibrerias()">Guardar</vs-button>
                                </vs-col>
                            </vs-row>
                            Cantidad de librerias asignadas: <b> &nbsp; {{libreriasL.length}}</b>
                        </vs-card>
                        <vs-table max-items="10" pagination search :data="libreriasL">
                            <template slot="header">
                                        <vs-chip  color="primary">Cantidad: <b> {{ libreriasL.length }}</b></vs-chip>
                                    </template>
                            <!-- {{cliCi}} -->
                            <template slot="thead">
                                <vs-th width="200">
                                    Código
                                </vs-th>
                                <vs-th width="500">
                                    Información Asignación
                                </vs-th>
                                <vs-th width="100">
                                    Acciones
                                </vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].asin_id">
                                        {{ data[indextr].asin_id }}
                                    </vs-td>
                                    <vs-td>
                                        <small ><b>Libreria:</b> {{tr.nombres}} {{tr.apellidos}}</small>
                                    </vs-td>
                                    <vs-td :data="data[indextr].asin_id">
                                        <vs-button size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="eliminar(tr.asin_id)"></vs-button>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-tab>               
            </vs-tabs>
        </div>
    </vs-card>
</template>    
    
<script>
    import Vue from 'vue'
    import axios from 'axios'
    import "vue-select/dist/vue-select.css";
    import vSelect from "vue-select";
    import DataViewSidebar from './addlibro'
    Vue.use(axios)
    Vue.component("v-select", vSelect);
    export default {
        components: {
            DataViewSidebar,
        },
        data() {
            return {
                niveles:[],
                setniveles: {},
                nivel:'',
                institucion: [],
                libreriasL: [],
                planlector: [],
                listaLibrerias: [],
                listaplanlector: [],
                tabAsesorInstitucion: {
                    asin_id: '',
                    asin_idInstitucion: '',
                    asin_idusuario: '',
                    asin_estado: '',
                    updated_at: ''
                },
                idplanlector: '',
                id: '',
                sidebarData: {},
                addNewDataSidebar: false,
            }
        },
        created(){
            let me = this;
            me.selectLibrerias()
        },
        mounted() {
            this.getInstitucion();        
            this.getListalibrerias();
        },
        methods: {
            getInstitucion() {
                let me = this;
                this.$http.get(this.$server_url+'institucion/' + localStorage.idinstitucion)
                    .then(function (response) {
                        me.institucion = response.data;
                    })
                    .catch(function (error) {})
            },
            selectLibrerias() {
                let me = this;
                 this.$http.get(this.$server_url+'GetAsesor')
                    .then(function (response) {
                        me.listaLibrerias = response.data
                    })
                    .catch(function (error) {})
            },
            getListalibrerias() {
                let me = this;
                me.$vs.loading();     
                this.$http.get(this.$server_url+"GetAserorInstitucion?institucion_id="+localStorage.idinstitucion)
                    .then(function (response) {
                        me.$vs.loading.close();
                        me.libreriasL = response.data
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                    })
            }, 
            guardarLibrerias() {
                let me = this;
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                
                // Verifica que el campo no este vacio o nulo
                if (this.tabAsesorInstitucion.asin_idusuario === '' || this.tabAsesorInstitucion.asin_idusuario === null) {
                    me.$vs.notify({
                        text: 'Seleccione antes de guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                // Verificar si ya existe un registro con el mismo código de asesor-institución
                let resultado = me.libreriasL.find(v => v.asin_idusuario == this.tabAsesorInstitucion.asin_idusuario );
                if (resultado) {
                    me.$vs.notify({
                        text: 'Ya existe un registro de esta Asignación',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                let datos  = {
                "asin_idInstitucion": localStorage.idinstitucion,
                "asin_idusuario": this.tabAsesorInstitucion.asin_idusuario,
                "asin_estado": this.tabAsesorInstitucion.asin_idusuario,
                "user_created": usuarioObjeto.idusuario,
                }                            
                this.$http.post(this.$server_url+'PostRegistrar_modificar_asesor_institucion', datos)
                    .then(function (response) {
                        me.getListalibrerias();
                        me.$vs.notify({
                            color: 'success',
                            title: 'Aceptado',
                            text: 'Libro Guardado'
                        })
                    })
                    .catch(function (error) {})
            },
            eliminar(id) {
                this.id = id
                this.$vs.dialog({
                    color: 'danger',
                    title: `Eliminar Asignación Libreria ( `+ this.id +` )`,
                    text: 'Seguro desea eliminar?',
                    acceptText: 'Aceptar',
                    accept: this.acceptAlert,
                })
            },
            acceptAlert() {
                let me = this;
                this.$http.post(this.$server_url+"Eliminar_asignacion?asin_id="+ me.id)
                    .then(function (response) {
                        me.$vs.notify({
                            color: 'success',
                            title: 'Aceptado',
                            text: 'Asignación libreria eliminada'
                        })
                        me.getListalibrerias();
                    })
                    .catch(function (error) {
                        me.$vs.notify({
                            color: 'danger',
                            title: 'Error',
                            text: error
                        })
                    })
            },           
        },
    }
</script>
    