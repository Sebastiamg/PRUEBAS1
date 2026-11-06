<template>
    <vx-card>
        <div class="con-tab-ejemplo" v-if="permisoRoot">
            <small  v-if="usuario.id_group == 1" align="left">Ruta: /u_usuarios/administradores</small>
            <vs-table max-items="10" search pagination :data="Arrayusuarios">
                <template slot="header">
                    <vs-chip color="primary">Cantidad administradores {{Arrayusuarios.length}}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Nombre</vs-th>
                    <vs-th>Cedula</vs-th>
                    <vs-th>Usuario</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Accion</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombres}} {{data[indextr].apellidos}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cedula}}<br>
                        </vs-td>
                        <vs-td>
                            {{tr.name_usuario}}
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.estado_idEstado == 1" color="success">Activo</vs-chip>
                            <vs-chip v-else color="danger">Desactivado</vs-chip>
                        </vs-td>
                        <vs-td>
                            <div class="flex">
                                <vx-tooltip style="display: inline-block;margin-left:10px;" text="editar" position="top" color="warning">
                                    <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" color="warning" @click="popupActivo=true;getEdit(tr)"></vs-button>
                                </vx-tooltip>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>  
        </div>
        <!--MODALES-->
          <!--Modal de Editar-->
          <vs-popup class="editpop"  fullscreen="true" title="Editar" :active.sync="popupActivo">
            <editarUsuarioVue @saveChange="changeHandleEditar" :usuarios="usuarios" :instituciones="instituciones"/>
        </vs-popup>
    </vx-card>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import editarUsuarioVue from './components/editarUsuario.vue';
export default {
    data() {
        return{
            Arrayusuarios:[],
            popupActivo:false,
            permisoRoot:false,
            usuario:[],
            instituciones:[],
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
                fecha_nacimiento:'',
                cargo_id:'',
                iniciales:'',
                foto_user:'',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            permisoRoot:false,
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr,  
        editarUsuarioVue,            
    },
    methods:{
        changeHandleEditar(){
            let me = this;
            me.popupActivo = false
            me.getUsuarios()
        },
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
         //para obtener el listado de los usuarios root
        getUsuarios() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'getAdsUser')
                .then(function (res) {
                    me.$vs.loading.close()
                    me.Arrayusuarios = res.data
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        openConfirm(id,estado){
            this.id = id;
            this.estado = estado
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Estas seguro de cambiar de estado.',
                accept:this.changeEstado
            })
        },
        //editar
        getEdit(data={}){
            let me = this;
            me.usuarios = data   
        },  
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.getUsuarios();
    },
    mounted(){
        let me = this;
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
        me.getUserRoot()
    },
}
</script>