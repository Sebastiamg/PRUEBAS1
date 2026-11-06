<template>
    <div v-if="permisoRoot">
        <vs-card>
            <vs-button color="primary" class="mt-2" fullscreen type="line" @click="popupAddPermiso = true" style="border-radius: 7px;" icon="event_note">Añadir</vs-button>
           <div v-if="permisos.length >0 ">

                <vs-table max-items="10"  search stripe pagination :data="permisos" style="margin-top:-40px">
                    <template slot="thead">

                        <vs-th>Usuario</vs-th>
                        <vs-th>Cédula</vs-th>
                        <vs-th>Rol</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                            <vs-td>
                                {{data[indextr].usuario}}<br>

                            </vs-td>
                            <vs-td>
                                {{data[indextr].cedula}}<br>
                            </vs-td>

                            <vs-td>
                                {{data[indextr].rol}}<br>
                            </vs-td>

                            <vs-td>

                                <vx-tooltip style="display: inline-block;" text="Eliminar permiso" position="top" color="primary">
                                   <vs-button radius color="danger" @click="openConfirmEliminar(tr)" type="line" icon="restore_from_trash"></vs-button>
                                </vx-tooltip> &nbsp;

                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>
            </div>
              <div v-else class="p-3">
                <p> No existe permisos aun. </p>
            </div>
        </vs-card>

        <!--PARA LOS MODALES -->
          <!-- Modal Agregar-->

        <vs-popup
            title="Agregar permisos" fullscreen :active.sync="popupAddPermiso">

               <vs-card>
                    <div style="">

                        <vs-input class="w-full" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;"  icon="search" placeholder="Ingrese el criterio de busqueda"  v-model="permiso.razonBusqueda"/>
                    </div>

                    <div style="">

                        <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                            <li class="modelx">

                            </li>
                            <li style="margin:10px 20px 0px 0px;">

                            <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='email'">Email</vs-radio>
                            </li>
                            <li style="margin:10px 10px 0px 0px;">
                            <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda"  @input="busqueda='cedula'">Cedula</vs-radio>
                            </li>

                            <li style="margin:10px 10px 0px 0px;">
                            <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda"  @input="busqueda='usuario'">Usuario</vs-radio>
                            </li>

                            <li>
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="busquedaFiltroEstudiante();" icon="search"></vs-button>
                            </li>

                        </ul>
                    </div>

             </vs-card>

             <!--TABLA DE USUARIOS-->
             <vs-card>
                <vs-row>
                    <vs-col  type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">

                        <vs-table max-items="3"  pagination :data="estudiantesCursos">

                        <template slot="thead">

                            <vs-th style="width:40%;">Datos Personales</vs-th>
                            <vs-th style="width:10%;">Perfil</vs-th>
                            <vs-th style="width:20%;">Acciones</vs-th>


                        </template>


                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" >


                                <vs-td>
                                    {{ tr.idusuario }}
                                    <br/>
                                    Nombres:
                                    <br>
                                    <span style="font-weight:600;  " >
                                    {{ tr.nombres }} {{ tr.apellidos }}<br>
                                    </span>

                                    Email:
                                    <br>
                                    <span style=" font-weight:600; " >
                                    {{ tr.email }}<br>
                                    </span>

                                    Cedula:
                                    <br>
                                    <span style="font-weight:600;  " >
                                    {{ tr.cedula }}<br>
                                    </span>

                                    usuario:
                                    <br>
                                    <span style="font-weight:600;  " >
                                    {{ tr.name_usuario }}<br>
                                    </span>

                                    Institucion:
                                    <br>
                                    <span  style="font-weight:600; ">
                                    {{ tr.nombreInstitucion }}<br>
                                    </span>
                                    <template>
                                        <div v-if="tr.estado_idEstado == 1">
                                            <vs-chip color="primary">
                                                <p>Activo</p>
                                            </vs-chip>
                                        </div>

                                        <div v-else>
                                            <vs-chip color="danger">
                                                <p>Desactivado</p>
                                            </vs-chip>
                                        </div>
                                    </template>

                                </vs-td>

                                <vs-td>
                                    {{ tr.perfil }}
                                </vs-td>

                                <vs-td>

                                    <vx-tooltip style="display: inline-block;" text="Agregar permiso" position="top" color="primary">
                                        <vs-button  color="success" style="border-radius: 5px;" @click="openConfirm(tr)" type="line" icon="person_add">
                                            Añadir Permiso
                                        </vs-button>
                                    </vx-tooltip> &nbsp;
                                </vs-td>

                            </vs-tr>
                        </template>
                        </vs-table>
                    </vs-col>

                </vs-row>

             </vs-card>
        </vs-popup>


    </div>
</template>


<script>
export default {
  watch: {
  },
    data() {
     return{
         permisos:[],
         popupAddPermiso:false,
         permiso:{
             razonBusqueda:'',
             usuario_id:'',
             id_group:'',
             id:0,

         },
         valorBusqueda:'0',
         user:[],
         busqueda:"email",
         estudiantesCursos:[],
         delete:false,
     }
    },
    props:{
      permisoRoot:{
        type:Boolean,
        default:false
      },
    },
    created(){
        let me = this;
        me.user = JSON.parse(localStorage.getItem('usuario'))
        me.getUserRoot();
    },
    methods:{
     //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'permisos')
                .then(function (res) {
                    me.permisos = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
         openConfirm(tr){
             let me = this;
            me.delete = false
            me.permiso.usuario_id = tr.idusuario
            me.permiso.id_group  = tr.id_group
             me.popupAddPermiso = false
            this.$vs.dialog({
                type:'confirm',
                color: 'warning',
                title: `Advertencia`,
                text: 'Estas seguro de añadir el permiso a este usuario',
                accept:this.agregarPermiso,
                cancel:this.cancelar,
                acceptText:'Aceptar'
            })
        },

         openConfirmEliminar(tr){
             let me = this;
             me.permiso.id = tr.id
             me.delete = true

            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Advertencia`,
                text: 'Estas seguro de eliminar el permiso a este usuario',
                accept:this.agregarPermiso,
                acceptText:'Aceptar'
            })
        },


        cancelar(){
            let me = this;
            me.popupAddPermiso = true
        },

        agregarPermiso(){
            let me = this;
            let formData = new FormData();
            if(me.delete == true){
                formData.append('id',     me.permiso.id);
                formData.append('eliminar', "yes");
            }else{
                formData.append('usuario_id', me.permiso.usuario_id);
                formData.append('id_group',   me.permiso.id_group);
            }

            me.$vs.loading()
            this.$http.post(this.$server_url+'permisos', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getUserRoot()
                    me.limpiar()
                     me.delete = false

                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })

        },

        limpiar(){
            let me = this;
            me.permiso.usuario_id = "";
            me.permiso.id_group = "";
            me.permiso.id = 0

        },

          busquedaFiltroEstudiante(){
            let me = this;

            me.estudiantesCursos = [];

            if(me.permiso.razonBusqueda.length < 5){


                me.$vs.notify({
                text:'Minimo 5 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;

            }
            me.$vs.loading();


                //para los administradores
                this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.busqueda+'&razonBusqueda='+me.permiso.razonBusqueda)
                .then(function (res) {


                     me.$vs.loading.close()
                     if(res.data.status == '0'){
                        me.$vs.notify({
                        text: res.data.message,
                        color:'primary',
                        iconPack: 'feather',
                        icon:'icon-check'})

                        return false;
                    }else{

                          me.estudiantesCursos = res.data
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })




        },
    }
}
</script>
