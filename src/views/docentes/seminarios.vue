<template>
<div>

<vs-popup title="Recursos del seminario" :active.sync="popupRecursos">
  <div class="p-3" align="center">
    <b>Link: </b> <h5><a :href="link_recurso" target="_blank">{{link_recurso}}</a></h5>
    <br>
    <b>Clave: </b> <h5>{{clave_recurso}}</h5>
  </div>
</vs-popup>


<vx-card class="w-full">

        <div>
                <vs-button @click="getSeminarios();tematica='seminarios'" size="small" style="font-size: 14px;" color="dark" class="m-1" type="filled">Seminarios</vs-button>

                <vs-button @click="getSeminariosWebinar();tematica='webinars'" size="small" style="font-size: 14px;" color="primary" class="m-1" type="filled">Webinars</vs-button>

                <vs-button @click="getWebinarProximos();tematica='proximo'" size="small" style="font-size: 14px;" color="success" class="m-1" type="filled">Próximo Webinars</vs-button>

        </div>

        <div v-if="tematica == 'proximo'">
               <vs-table stripe pagination max-items="25" search :data="seminariosProximo">



                <template slot="thead">
                    <vs-th style="width: 60px;">#</vs-th>
                    <vs-th sort-key="nombre">Webinar</vs-th>
                    <vs-th>Fecha</vs-th>
                    <vs-th>Link reunión</vs-th>

                    <vs-th style="width: 200px;">Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{indextr+1}} </vs-td>
                    <vs-td> {{tr.nombre}} <br> {{tr.descripcion}} </vs-td>
                    <vs-td> {{tr.fecha_inicio}} <br> {{tr.fecha_fin}} </vs-td>
                    <vs-td> <a :href="tr.link_reunion" target="_blank"> {{tr.link_reunion}} </a></vs-td>

                    <vs-td>

                       <vs-button icon="done"  @click="OpenConfirmarRegistro(tr)"  type="relief">Registrarse</vs-button>

                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
        </div>

        <div v-else>

            <vs-table stripe pagination max-items="25" search :data="seminarios">
                <template slot="thead">
                    <vs-th style="width: 60px;">#</vs-th>

                    <div v-if="tematica == 'seminarios'">
                          <vs-th sort-key="nombre">Seminario</vs-th>
                    </div>
                    <div v-if="tematica == 'webinars'">
                          <vs-th sort-key="nombre">Webinar</vs-th>
                    </div>
                    <vs-th>Fecha</vs-th>
                    <vs-th>Link reunión</vs-th>
                    <vs-th>Asistencia</vs-th>
                    <vs-th style="width: 200px;">Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> {{indextr+1}} </vs-td>
                    <vs-td> {{tr.nombre}} <br> {{tr.descripcion}} </vs-td>
                    <vs-td> {{tr.fecha_inicio}} <br> {{tr.fecha_fin}} </vs-td>
                    <vs-td> <a :href="tr.link_reunion" target="_blank"> {{tr.link_reunion}} </a></vs-td>
                    <vs-td>
                        <div v-if="tr.asistencia == '1'">
                            <vs-chip color="success">
                                asistió
                            </vs-chip>

                        </div>
                        <div v-else>
                            <vs-chip color="danger">
                                No asistió
                            </vs-chip>
                        </div>
                    </vs-td>
                    <vs-td>


                        <div style="display:flex;">

                            <div v-if="tr.asistencia == '0'">
                                    <div v-if="tr.asistencia_activa == '1'">
                                        <vx-tooltip v-if="tr.respuestas == '0' || tr.respuestas == null || tr.respuestas == 'null'" style="display: inline-block;"  text="Registrar asistencia" position="top" color="primary">
                                            <vs-button size="large" radius icon-pack="feather" icon="icon-thumbs-up"  @click="openConfirm(tr)" color="success" type="line"></vs-button>
                                        </vx-tooltip>
                                    </div>

                                </div>


                            <div v-if="tr.asistencia == '1'">

                                <vx-tooltip v-if="tr.respuestas == '0' || tr.respuestas == null || tr.respuestas == 'null'" style="display: inline-block;" text="Responder encuesta" position="top" color="primary">
                                    <vs-button size="large" radius icon-pack="feather" icon="icon-file-text" @click="irEncuesta(tr)" color="primary" type="line"></vs-button>
                                </vx-tooltip>

                                <vx-tooltip v-if="tr.respuestas == '0' || tr.respuestas == null || tr.respuestas == 'null'" style="display: inline-block;" text="Recursos del seminario" position="top" color="dark">
                                    <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verRecursos(tr)" color="dark" type="line"></vs-button>
                                </vx-tooltip>
                            </div>



                            <vx-tooltip v-if="tr.respuestas == '0' || tr.respuestas == null || tr.respuestas == 'null'" style="display: inline-block;" text="Ir al seminario." position="top" color="success">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-video" @click="irSeminario(tr)" color="success" type="line"></vs-button>
                            </vx-tooltip>

                            <div v-if="tr.asistencia == '1'">
                                <div v-if="tr.respuestas == '0' || tr.respuestas == null || tr.respuestas == 'null'">

                                </div>
                                <div v-else>
                                    <vx-tooltip style="display: inline-block;" text="Descargar certificado" position="top" color="warning">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-printer" @click="descargarCertificado(tr)" color="warning" type="line"></vs-button>
                                    </vx-tooltip>
                                </div>

                            </div>

                        </div>

                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
        </div>



</vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            tematica:'seminarios',
            usuario:[],
            seminarios: [],
            id_seminario: '',
            seminario:{
                usuario_id:'',
                cedula:'',
                seminario_id:'',
                institucion_id:'',
            },
            seminariosProximo:[],
            link_recurso: '',
            clave_recurso: '',
            popupRecursos: false,
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if(localStorage.getItem("tematica")){
            this.tematica = localStorage.getItem("tematica")

            if(this.tematica == 'seminarios'){
                this.getSeminarios()
            }else{
                this.getSeminariosWebinar()
            }
        }else{
            this.getSeminarios()
        }


    },
    methods: {

         OpenConfirmarRegistro(tr){
              let me = this;


                me.seminario.usuario_id = me.usuario.idusuario
                me.seminario.cedula = me.usuario.cedula
                me.seminario.seminario_id  = tr.id_seminario
                me.institucion_id =  me.usuario.institucion_idInstitucion
                this.$vs.dialog({
                    acceptText:'Si, deseo registrarme',
                    cancelText:'Cancelar',
                    type:'confirm',
                    color: 'warning',
                    title: `Registro Webinar`,
                    text: 'Estás seguro de registrarme al webinar?',
                    accept:this.guardarWebinar
                })
            },

          guardarWebinar() {

            let me = this
            let formData = new FormData();
            formData.append('cedula', me.seminario.cedula)
            formData.append('cedulaExiste', "1")
            formData.append('seminario', me.seminario.seminario_id)

            me.$vs.loading();
            this.$http.post(this.$server_url+"register", formData)
                .then(function (response) {
                     me.$vs.loading.close()
                    if(response.data.message){
                            me.$vs.notify({
                            text: response.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                        return false;
                    }
                    else{
                            me.$vs.notify({
                            text: 'Webinar  asignado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })

                        me.tematica = 'webinars'
                        me.getSeminariosWebinar();
                        localStorage.setItem('tematica','webinars')

                    }
                })
                .catch(function (error) {
                    console.log(error)
                     me.$vs.loading.close()
                })

        },


        //para que el docente pueda confirmar la asistencia
         openConfirm(tr){
              let me = this;
              me.seminario.usuario_id = me.usuario.idusuario,
              me.seminario.cedula = me.usuario.cedula
              me.seminario.seminario_id = tr.id_seminario
              me.seminario.institucion_id = me.usuario.institucion_idInstitucion

                this.$vs.dialog({
                    acceptText:'Si, asistí a este seminario',
                    cancelText:'Cancelar',
                    type:'confirm',
                    color: 'warning',
                    title: `Tomar Asistencia`,
                    text: 'Estas seguro de registrar la asistencia?',
                    accept:this.RegistrarAsistencia
                })
        },
        //para que los docentes puedan registrar su asistencia al seminario
        RegistrarAsistencia(){

            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'SeminarioAsistencia?usuario_id='+me.seminario.usuario_id+'&cedula='+me.seminario.cedula+'&seminario_id='+me.seminario.seminario_id+'&institucion_id='+me.seminario.institucion_id)
                .then(function (res) {


                    me.$vs.loading.close()
                     if(res.data.message){
                            me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }

                    if(me.tematica == 'seminarios'){
                        me.getSeminarios();
                    }else{
                        me.getSeminariosWebinar();
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getSeminarios() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'obtener_seminarios_docente?idusuario='+me.usuario.idusuario+'&institucion_id='+me.usuario.institucion_idInstitucion)
            .then(function (res) {
                me.seminarios = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        getSeminariosWebinar() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'get_webinars?idusuario='+me.usuario.idusuario)
            .then(function (res) {
                me.seminarios = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },

          getWebinarProximos() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'obtenerWebinars')
            .then(function (res) {
                me.seminariosProximo = res.data
                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        irEncuesta(item){
            let me = this

            if(item.tipo_webinar == 1){
                localStorage.setItem('tematica','webinars')
            }else{
                localStorage.setItem('tematica','seminarios')
            }
            localStorage.data_seminario = JSON.stringify(item);
            me.$router.push('/docente/encuesta')
        },
        irSeminario(item){
            let me = this
            // validar horario permitido con js, href _blank
            window.open(item.link_reunion, '_blank');

        },
        descargarCertificado(item){
            let me = this

             me.ContarCertificados(item.id_seminario,item.usuario_id)
            if(item.tipo_webinar == 1){
                localStorage.setItem('tematica','webinars')
            }else{
                localStorage.setItem('tematica','seminarios')
            }
            localStorage.data_seminario = JSON.stringify(item);
            window.open('/docente/descargar_certificado', '_blank');
            // validar respuestas en respuestas_seminairos y permitir descarga con datos del docente y seminario seleccionado
        },

         ContarCertificados(webinar,usuario) {
            let me = this;
            me.$vs.loading();


            this.$http.get(this.$server_url+'sumarEncuestasDescargadas?seminario_id='+webinar+'&usuario_id='+usuario)
                .then(function (res) {
                  me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        verRecursos(item){
          let me = this
          me.popupRecursos = true

          me.link_recurso = item.link_recurso
          me.clave_recurso = item.clave_recurso
          console.log({item})

        }
    },
}
</script>
