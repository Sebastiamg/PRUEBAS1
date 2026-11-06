<template>
<vs-card id="data-list-list-view" class="data-list-container">
    <div class="mt-5 ml-2">
        <h3>
            {{institucion.nombreInstitucion}}
        </h3>
        <vs-tabs alignment="fixed">
            <vs-tab label="Libros">
                <div>
                    <vs-card class="p-3">
                        <vs-row>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <b>Agregar libro gratis</b>
                                
                                <v-select :options="listalibros" class="ml-3" style="width:60%" :reduce="listalibros => listalibros" label="nombrelibro" v-model="idlibro"></v-select>
                            </vs-col>
                        </vs-row>

                        <vs-row class="mt-5">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <b>Seleccione el nivel</b>
                               <v-select :options="niveles" class="ml-3" style="width:60%" :reduce="niveles => niveles.idnivel" label="nombrenivel" v-model="nivel">
                                </v-select>
                            </vs-col>
                        </vs-row>

                       <vs-row class="mt-5"> 
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                 <vs-button class="mr-3 mb-2" @click="guardarFree()">Guardar</vs-button>
                            </vs-col>
                        </vs-row>

                      
                        

                    
                        Cantidad de libros asignados: <b> &nbsp; {{libros.length}}</b>
                    </vs-card>
                    <div class="flex mb-4 mt-4">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12"><b>Libro</b></vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12"><b>Nivel</b></vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12"><b>Serie</b></vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12"><b>Acciones</b></vs-col>
                    </div>
                    <vs-card :key="indextr" v-for="(tr, indextr) in libros">
                        <div class="flex mb-4">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                                {{tr.nombrelibro}}
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                                {{tr.nombrenivel}}
                            </vs-col>
                              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                                {{tr.nombre_serie}}
                            </vs-col>
                          
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-sm="4" vs-xs="12">
                                <vs-button size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="eliminar(tr.id)"></vs-button>
                            </vs-col>
                        </div>
                    </vs-card>
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
            libros: [],
            planlector: [],
            listalibros: [],
            listaplanlector: [],
            idlibro: '',
            idplanlector: '',
            id: '',
            sidebarData: {},
            addNewDataSidebar: false,
           
            periodo:'',
        }
    },
    created(){
        let me = this;
        me.getPeriodoInstitucion();
        me.selectLibros()
    },
    mounted() {
        this.getInstitucion();
        // this.selectLibros();
        // this.selectPlanlector();
      
        // this.getListaFreePlanlector();
        this.getNiveles();
    
        this.getListaFree();
    },
    methods: {

        getNiveles() {
            let me = this;
            this.$http.get(this.$server_url+'getNiveles')
                .then(function (res) { 
                    me.niveles = res.data
                    
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },

             //para obtener el perido atual
        getPeriodoInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'institucionTraerPeriodo?institucion_id='+localStorage.idinstitucion)
                .then(function (res) { 
                    me.periodo = res.data[0].periodo
                    localStorage.setItem('Free_periodo_id',res.data[0].periodo)  
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },

        addNewData() {
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        getInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'institucion/' + localStorage.idinstitucion)
                .then(function (response) {
                    me.institucion = response.data;
                })
                .catch(function (error) {})
        },
        selectLibros() {
            let me = this;
            // this.$http.get(this.$server_url+'selectlibro?idgrupo=' + JSON.parse(localStorage.usuario)['id_group'] + '&idinstitucion=' + JSON.parse(localStorage.usuario)['institucion_idInstitucion'])
             this.$http.get(this.$server_url+'selectlibro')
                .then(function (response) {
                    me.listalibros = response.data
                })
                .catch(function (error) {})
        },
        
        guardarFree() {
            let me = this;
         
            let formData = new FormData();
            formData.append('institucion_id', localStorage.idinstitucion);
            formData.append('periodo_id', me.periodo);
            formData.append('idlibro', me.idlibro.idlibro);
            formData.append('serie_id', me.idlibro.id_serie);
            formData.append('nivel_id', me.nivel);
            this.$http.post(this.$server_url+'guardarLibroFree', formData)
                .then(function (response) {
                    me.idlibro = '';
                    me.getListaFree();
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Libro Guardado'
                    })
                })
                .catch(function (error) {})
        },
        
        getListaFree() {
            let me = this;
            me.$vs.loading();
 
            this.$http.get(this.$server_url+"listaFree?institucion_id=" + localStorage.idinstitucion+'&periodo_id='+localStorage.getItem("free_periodo_id"))
                .then(function (response) {
                    me.$vs.loading.close();
                    me.libros = response.data
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
   
        // getNiveles() {
        //     let me = this;
        //     this.$http.get(this.$server_url+"nivel")
        //         .then(function (response) {
        //             me.niveles = response.data
        //         })
        //         .catch(function (error) {})
        // },
        guardarniveles(id, niveles) {
            let me = this;
            let formData = new FormData();
            formData.append('id', id);
            formData.append('niveles', niveles);
            this.$http.post(this.$server_url+"setNivelFree", formData)
                .then(function (response) {})
                .catch(function (error) {})

        },
        eliminar(id) {
            this.id = id
            this.$vs.dialog({
                color: 'danger',
                title: `Eliminar Libro`,
                text: 'Seguro desea eliminar?',
                acceptText: 'Aceptar',
                accept: this.acceptAlert,
            })
        },
        acceptAlert() {
            let me = this;
            this.$http.get(this.$server_url+"eliminarLibroGratis?id=" + me.id)
                .then(function (response) {
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Libro eliminado'
                    })
                    me.getListaFree();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        color: 'danger',
                        title: 'Error',
                        text: error
                    })
                })
        },
        peliminar(id) {
            this.id = id
            this.$vs.dialog({
                color: 'danger',
                title: `Eliminar Libro`,
                text: 'Seguro desea eliminar?',
                acceptText: 'Aceptar',
                accept: this.pacceptAlert,
            })
        },
        pacceptAlert() {
            let me = this;
            this.$http.get(this.$server_url+"eliminarPlanlectorFree?id=" + me.id)
                .then(function (response) {
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Libro eliminado'
                    })
                    me.getListaFreePlanlector();
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
