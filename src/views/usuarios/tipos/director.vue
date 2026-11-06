<template>
    <vs-card>
        <div v-if="user.id_group == 1 || user.id_group == 11">
            <small  v-if="user.id_group == 1" align="left">Ruta: u_usuarios/directores</small>
            <vs-tabs>
                <vs-tab label="Institucion Director">
                    <vs-row vs-justify="center" style="heigth:500px;">
                        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                            <div>
                                <div slot="header" class="mt-5">
                                    <vs-alert color="warning" class="font-bold" style="min-height: 40px;">
                                        <p class="text-center">
                                            <i class="fa-solid fa-user"></i>
                                            <b class="ml-1">Asignación de instituciones a directores</b>
                                        </p>
                                    </vs-alert>
                                </div>
                                <tableFiltroUsuarioVue @changeDirector="changeHandleDirector"/>
                                <TableSelectInstitucionVue @change="changeHandle" style="margin-top: -25px;"/>
                            </div>
                        </vs-col>
                    </vs-row>
                    <div class="w-full p-2 bg-gray-400 text-center" style="margin-top: -25px;">
                        <vs-button type="gradient" icon="save" @click="cambiarADirector()" class="w-full">Asignar</vs-button>
                    </div>
                </vs-tab>
                <vs-tab label="Director" @click="getDirectoresAsignacion()">
                    <div v-if="directoresAsignacion.length >0">
                        <vs-table max-items="10" search pagination :data="directoresAsignacion">
                            <template slot="header">
                                <vs-chip color="primary">Cantidad: {{ directoresAsignacion.length }}</vs-chip>
                            </template>
                            <template slot="thead">
                                <vs-th>
                                    Nombres
                                </vs-th>
                                <vs-th>
                                    Usuario
                                </vs-th>

                                <vs-th>
                                    T. instituciones
                                </vs-th>
                                <vs-th>
                                    Accion
                                </vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                                    <vs-td :data="data[indextr].idusuario">
                                        <p class="font-bold"> {{data[indextr].idusuario}}</p>
                                        <span>Nombres:</span>
                                        <p class="font-bold"> {{data[indextr].director}}</p>
                                        <span>Email:</span>
                                        <p class="font-bold">{{data[indextr].email}}</p>
                                    </vs-td>
                                    <vs-td :data="data[indextr].cedula">
                                        <span>Usuario:</span>
                                        <p class="font-bold">{{data[indextr].name_usuario}}</p>
                                        <span>Cédula:</span>
                                        <p class="font-bold">{{data[indextr].cedula}}</p>
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.contador }}
                                    </vs-td>
                                    <vs-td>
                                        <div style="display:flex;">
                                            <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                                                <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="success" @click="popupActivo=true;getEdit(tr)"></vs-button>
                                            </vx-tooltip>
                                            <vx-tooltip style="display: inline-block;" text="Ver asignacion" position="top" color="warning">
                                                <vs-button type="border" size="small" class="ml-2" icon-pack="feather" icon="icon-eye" color="primary" @click="verAsignacion(tr)"></vs-button>
                                            </vx-tooltip>
                                        </div>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <h1>No hay datos que mostrar</h1>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
        <!--Modal para ver la asignacion -->
        <vs-popup class="holamundo"  title="Asignacion" :active.sync="popupVerAsignacion">
            <vs-card>
                <vs-table max-items="3" pagination :data="verAsignacionArreglo">
                    <template slot="header">
                        <p>
                        Asignacion del director: {{nombres}} {{apellidos}}
                        </p>
                        <br>
                    </template>
                    <template slot="thead">
                        <vs-th>
                        Institución
                        </vs-th>
                        <vs-th>
                        Ciudad
                        </vs-th>
                        <vs-th>
                        Acción
                        </vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                        <vs-td :data="data[indextr].nombreInstitucion">
                            {{data[indextr].nombreInstitucion}}
                        </vs-td>
                        <vs-td :data="data[indextr].ciudad">
                            {{data[indextr].ciudad}}
                        </vs-td>
                        <vs-td>
                            <vx-tooltip style="display: inline-block;" text="Quitar asignacion" position="top" color="warning">
                                <vs-button type="border" size="small" icon-pack="feather" @click="openConfirm(tr)" icon="icon-x" color="danger"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-card>
        </vs-popup>
        <!--Modal de Editar-->
        <vs-popup class="editpop"  fullscreen="true" title="Editar" :active.sync="popupActivo">
          <div v-if="popupActivo">
            <editarUsuarioVue @saveChange="changeHandleEditar" :usuarios="usuarios" :instituciones="instituciones"/>
          </div>
        </vs-popup>
    </vs-card>
</template>
<script>
import tableFiltroUsuarioVue from './components/tableFiltroUsuario.vue'
import TableSelectInstitucionVue from '../GestionEstudiantes/components/TableSelectInstitucion.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
const editarUsuarioVue = () => import('./components/editarUsuario.vue')
Vue.use(axios)
export default {
      components: {
        tableFiltroUsuarioVue,
        TableSelectInstitucionVue,
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview,
        editarUsuarioVue
    },
    data(){
        return{
           desabilitar_boton:false,
           directores:[],
           arregloCiudad:[],
           ciudadSelect:"",
           users:[],
            director:{
                institucion:"",
                user:"",
            },
            arregloTraeInstitucion:[],
            directoresAsignacion:[],
            popupVerAsignacion:false,
            verAsignacionArreglo:[],
            id:'',
            nombres:"",
            apellidos:"",
            //para abrir el modal
            popupActivo:false,
              usuarios:{
            idusuario:"",
            cedula:"",
            nombres:"",
            apellidos:"",
            email:"",
            name_usuario:"",
            telefono:"",
            estado_idEstado:"",
            institucion_idInstitucion:"",
            id_group:"",
            },
            instituciones:[],
            user:[],
            institucion_id:0,
            director_id:0,
            nombreDirector:'',
        }
    },
    methods:{
        changeHandleEditar(e){
            let me = this
            me.getDirectoresAsignacion();
            me.popupActivo = false;
        },
        changeHandle(e){
            let me = this
            let valor = e.change
            if(valor == 'institucion')  me.institucion_id   = e.value
        },
        changeHandleDirector(e){
            let me = this
            me.director_id = e.idusuario
            me.nombreDirector = e.nombres
        },
        //editar
        getEdit(data={}){
            let me = this;
            me.usuarios = data
            // me.usuarios.idusuario = data.idusuario
            // me.usuarios.cedula = data.cedula
            // me.usuarios.nombres = data.nombres
            // me.usuarios.apellidos = data.apellidos
            // me.usuarios.email = data.email
            // me.usuarios.name_usuario = data.name_usuario
            // me.usuarios.telefono = data.telefono
            // me.usuarios.estado_idEstado = data.estado_idEstado
            // me.usuarios.id_group = data.id_group
            // me.usuarios.institucion_idInstitucion = data.institucion_idInstitucion
        },
        //ASIGNAR DIRECTOR
        cambiarADirector(){
            let me = this;
            if(me.institucion_id <= 0){
                me.$vs.notify({
                text:'Seleccione una institución por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            if(me.director_id <= 0){
                me.$vs.notify({
                text:'Seleccione una director por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            this.$http.get(this.$server_url + 'cambiarDirector/' + me.director_id)
            .then(function (response) {
                me.guardarAsignacion();
                me.$vs.loading.close();
            })
            .catch(function (error) {
                me.$vs.loading.close();
            })
        },
        guardarAsignacion(){
            let me = this
            let formData = new FormData();
            formData.append('director_id',      me.director_id)
            formData.append('institucion_id',   me.institucion_id)
            formData.append('user_created',     me.user.idusuario)
            me.$vs.loading();
            this.$http.post(this.$server_url + 'guardarAsignacionDirector',formData)
            .then(function (res) {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    me.$vs.notify({
                        time: 3000,
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.$vs.notify({
                    time: 8000,
                    text: 'Se asigno la institución al director ' + me.nombreDirector,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
            })
            .catch(function (error) {
                me.$vs.loading.close();
            })
        },
        getDirectoresAsignacion(){
            let me = this;
            me.$vs.loading();
               this.$http.get(this.$server_url+`getDirectores`)
                .then(res => {
                    console.log(res.data)
                    this.directoresAsignacion = res.data
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        //para ver la asignacion
        verAsignacion(data={}){
            let me = this;
            me.nombres = data.nombres;
            me.apellidos = data.apellidos;
            me.popupVerAsignacion = true;
            me.$vs.loading()
            this.$http.get(this.$server_url+'verInstitucionDirector?idusuario='+data.idusuario)
            .then(res => {
                me.verAsignacionArreglo = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error)
                me.$vs.loading.close()
            })
        },
        openConfirm(data={}){
            let me = this;
            me.popupVerAsignacion = false
            me.id = data.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Esta seguro de quitar la asignacion de esta institucion al director',
                accept:this.quitarAsignacion,
                cancel:this.cancelar,
                acceptText:'Aceptar'
            })
        },
        cancelar(){
            let me = this;
            me.popupVerAsignacion = true
        },
        //para eliminar la asignacion de la institucion al director
        quitarAsignacion() {
            let me = this;
            let formData = new FormData()
            formData.append('id', me.id)
            this.$http.post(this.$server_url+'quitarAsignacion',formData)
            .then(res => {
                me.$vs.notify({
                    time: 7000,
                    text: 'Institucion ya no asignada a director se realizo correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                me.getDirectoresAsignacion();
                me.verAsignacion();
                me.popupVerAsignacion=false
                me.nombres = "";
                me.apellidos = "";
                me.id ="";
                me.verAsignacionArreglo = []
            })
            .catch(function (error) {
                console.log(error)
                me.$vs.loading.close()
            })
        },
    },
    created(){
        let me = this;
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
        me.user = JSON.parse(localStorage.getItem('usuario'))
    }
}
</script>
