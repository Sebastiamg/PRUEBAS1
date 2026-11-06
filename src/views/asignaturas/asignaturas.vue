<template>
    <div>   
        <vx-card title="Asignaturas">
            <vs-button color="dark" v-if="permisoRoot"  @click="limpiar();popupAddAsignatura=true;"   type="filled">Crear Asignatura</vs-button>
            <vs-table max-items="10" search pagination :data="asignaturas">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ asignaturas.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Asignatura</vs-th>
                    <vs-th>Area</vs-th>
                    <vs-th>Nivel</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombreasignatura">
                    # {{tr.idasignatura}}<br>
                            {{data[indextr].nombreasignatura}}
                        </vs-td>
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].nombrenivel">
                            {{data[indextr].nombrenivel}}
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.estado == 1">
                                Activado
                            </div>
                            <div v-else>
                                Desactivado
                            </div>
                        </vs-td>
                        <vs-td :data="tr">
                            <div class="flex">
                                <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="update=true;openModalEditar(data[indextr])"></vs-button>
                                <vx-tooltip v-if="tr.estado == 1" style="display: inline-block;" text="Desactivar asignatura" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="danger" @click="openConfirm(data[indextr].idasignatura,0)" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                                </vx-tooltip> &nbsp;
                                <vx-tooltip v-if="tr.estado == 0" style="display: inline-block;" text="activar asignatura" position="top" color="primary">
                                        <vs-button class="modal-default-button" size="small" color="primary" @click="openConfirm(data[indextr].idasignatura,1)" type="filled" icon-pack="feather" icon="icon-check"> </vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
        <!--PARA LOS MODALES -->
            <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Asignatura" :active.sync="popupAddAsignatura">
                <vs-input class="inputx mb-3 w-full" label="Nombre Asignatura" v-model="asignatura.nombreasignatura" />
                Area:
                <v-select :options="areas" :reduce="areas => areas" label="nombrearea" class="w-full" v-model="asignatura.area" />
                Nivel:
                <v-select :options="niveles" :reduce="niveles => niveles" label="nombrenivel" class="w-full" v-model="asignatura.nivel" />
                <br>   
                <ul class="leftx">
                    <li class="modelx">
                        Tipo Asignatura:
                    </li>
                    <br>
                    <li>
                        <vs-radio v-model="asignatura.tipo_asignatura" vs-name="radios1" vs-value="1">Asignaturas Prolipa</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="asignatura.tipo_asignatura" vs-name="radios1" vs-value="0">Otras asignaturas</vs-radio>
                    </li>
                </ul>    
                    <br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarAsignatura()" type="gradient" >Guardar</vs-button>
            </vs-popup>
        </div>
        <!-- Modal Editar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Nivel" :active.sync="popupEditAsignatura">
                <vs-input class="inputx mb-3 w-full" label="Nombre Asignatura" v-model="asignatura.nombreasignatura" />
                Area:
                <v-select :options="areas" :reduce="areas => areas" label="nombrearea" class="w-full" v-model="asignatura.area" />
                Nivel:
                <v-select :options="niveles" :reduce="niveles => niveles" label="nombrenivel" class="w-full" v-model="asignatura.nivel" />
                <br>   
                <ul class="leftx">
                    <li class="modelx">
                        Tipo Asignatura:
                    </li>
                    <br>
                    <li>
                        <vs-radio v-model="asignatura.tipo_asignatura" vs-name="radios1" vs-value="1">Asignaturas Prolipa</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="asignatura.tipo_asignatura" vs-name="radios1" vs-value="0">Otras asignaturas</vs-radio>
                    </li>
                </ul>    
                <br>       
                <vs-button color="success" class="w-full mb-3" @click="guardarAsignatura()" type="gradient" >Actualizar</vs-button>
            </vs-popup>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
import vSelect from 'vue-select'

export default {
    data: () => ({
        //para el listado de asignaturas
        asignaturas: [],
        //para los modales
        popupAddAsignatura:false,
        popupEditAsignatura:false,
        asignatura:{
            nombreasignatura:"",
            area:"",
            nivel:"",
            tipo_asignatura:'1'
        },
        //variable para actualizar
        update:false,
        id:0,
        //para llenar el select de areas
        areas:[],
        //para llenar el select de niveles
        niveles:[],
        idasignatura:'',
        estado:'',
        permisoRoot:false,
        usuario:[],
    }),
    components: {
        'v-select': vSelect,
                
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getAdmin();
        this.getAreas();
        this.getNiveles();
        this.getUserRoot();
    },
    methods: {
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
            .then(function (res) {
                if(res.data.status == '1'){
                    me.permisoRoot = true
                }else{
                    me.permisoRoot = false
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        //para el listado de asignaturas
        getAdmin() {
            let me = this;
            this.$http.get(this.$server_url+'asignatura')
                .then(function (response) {
                    me.asignaturas= response.data.asignatura;
                    
                })
                .catch(function (error) {})
        },
         //para obtener el listado de areas
        getAreas() {
            let me = this;
            me.$vs.loading(); 
            this.$http.get(this.$server_url+'asignatura')
                .then(function (res) {
                    me.areas = res.data.area
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
            //para obtener el listado de areas
        getNiveles() {
            let me = this;
            me.$vs.loading(); 
        
            this.$http.get(this.$server_url+'asignatura')
                .then(function (res) {
                    me.niveles = res.data.nivel
               
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        //para guardar la asignatura
        guardarAsignatura(){
            let me = this;
             //datos que se obtienen de los inputs
                if(me.asignatura.nombreasignatura.trim() === ''){
                    this.$vs.notify({
                        text:'Debe completar todos los campos antes de guardar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }
            let formData = new FormData();
            if(me.update){
                formData.append('idasignatura',     me.id);
                formData.append('nombreasignatura', me.asignatura.nombreasignatura);
                formData.append('area_idarea',      me.asignatura.area.idarea);
                formData.append('nivel_idnivel',    me.asignatura.nivel.idnivel);
                 formData.append('tipo_asignatura', me.asignatura.tipo_asignatura);
            }else{
                formData.append('nombreasignatura', me.asignatura.nombreasignatura);
                formData.append('area_idarea',      me.asignatura.area.idarea);
                formData.append('nivel_idnivel',    me.asignatura.nivel.idnivel);
                formData.append('tipo_asignatura',  me.asignatura.tipo_asignatura);
            }
            this.$http.post(this.$server_url+'asignatura', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getAdmin()
                    me.popupAddAsignatura=false,
                    me.popupEditAsignatura=false,
                    me.update = false;
                    me.limpiar()
                  
                })
                .catch(function (error) {})
        },
        //para llenar los campos de asignatura para editar    
        openModalEditar(data={}){
            let me = this;
            me.popupEditAsignatura = true;
            //llenar la data en los campos
             me.id = data.idasignatura;
             me.asignatura.nombreasignatura = data.nombreasignatura;
             me.asignatura.area = {idarea:data.area_idarea, nombrearea:data.nombrearea};
             me.asignatura.nivel = {idnivel:data.nivel_idnivel, nombrenivel:data.nombrenivel};
             me.asignatura.tipo_asignatura = data.tipo_asignatura;
        },
         openConfirm(idasignatura,estado){
            let me = this;
            me.idasignatura = idasignatura;
            me.estado  = estado
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Esta seguro de cambiar de estado',
                accept:this.getEliminar
            })
        },
        getEliminar() {
            let me = this;
            this.$http.get(this.$server_url+"cambiarEstadoAsignatura?asignatura_id=" + me.idasignatura + '&estado='+me.estado)
            .then(function (response) {
                me.getAdmin();
            })
            .catch(function (error) {
                 me.$vs.notify({
                    text: 'No se pudo cambiar de estado',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            })
        },
        limpiar(){
           let me = this;
           me.asignatura.nombreasignatura = "";
           me.asignatura.nivel = "";
           me.asignatura.area = "";
           me.id = 0;
        },
    },
}
</script>
