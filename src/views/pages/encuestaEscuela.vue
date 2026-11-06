<template>
    <div>
        <vx-card
            v-if="validate == false"
            title="Estimado padre de familia"
            title-color="primary"
            subtitle-color="warning"
            :subtitle="msgError">
            <p class="mb-3">!Comuniquese a soporte@prolipa.com.ec para solventar el incoveniente</p>
        </vx-card>
        <div v-else style="padding:0px 40px;">
            <vx-card slot="no-body" class="banner">
                <div style="display: flex;justify-content:center;">   
                    <div>
                        <p style="color:white;font-size:25px;text-align:center;letter-spacing: 3px;">Encuesta</p>
                    </div>
                </div>
            </vx-card>
            <vx-card class="mt-3">
                <p class="font-bold text-3xl text-warning">Instrucciones:</p>
                <span class="mt-1">Conteste segun su criterio colocando si o no la respuesta de su elección</span>
                <vs-divider></vs-divider>
                <div class="vx-row mb-6 mt-5">
                    <div class="vx-col sm:w-1/2 w-full">
                        <vx-input-group class="mb-base">
                            <template slot="prepend">
                            <div class="prepend-text bg-primary">
                                <span>Ingrese su cédula</span>
                            </div>
                            </template>
                            <vs-input v-model="user.cedula" @blur="llenarCampos();" />
                        </vx-input-group>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2" style="margin-top:-15px;">
                        <vs-list>
                            <vs-list-item title="Institución"   :subtitle="user.nombreInstitucion"></vs-list-item>
                            <vs-list-item title="Período"       :subtitle="user.periodoDescripcion"></vs-list-item>
                        </vs-list>
                    </div>
                </div>
                <vs-divider>Ingrese sus datos</vs-divider>
                <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="user.nombres" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="user.apellidos" />
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Email" v-model="user.email" />
                    </div>
                    <div class="vx-col sm:w-1/2 w-full mb-2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Telefono" v-model="user.telefono" />
                    </div>
                </div>
            </vx-card>
            <vx-card class="mt-3" v-if="id == 0">
                <p  class="text-2xl font-medium">Preguntas</p>
                <small v-if="arregloPreguntas.length > 0 ">Lea detenidamente y complete toda la encuesta</small>
                <small v-else class="text-warning font-bold">Ingrese su cedula para validar su encuesta</small>
                <vs-divider></vs-divider>
                <div class="flex" v-for="(tr,key) in arregloPreguntas" :key="key">
                    <div style="width:50%" class="mt-3">
                        <p class="text-primary text-2xl font-light">{{key + 1}}. {{tr.pregunta}}</p>
                    </div>
                    <div style="width: 50%;" class="mt-3">
                        <span>Si </span>  <input style="margin-top: -20px;" class="ml-2" type="radio" id="html" v-model="tr.valor" :name="key" value="1">
                        <span class="ml-5">No </span> <input class="ml-2" style="margin-top: -20px;" type="radio" id="html" v-model="tr.valor" :name="key" value="0">
                    </div>
                </div>
                <div class="flex mt-5">
                    <vs-button color="success" v-if="getError == false" icon="save" class="mr-3 mb-2" @click="openConfirm()">Enviar encuesta</vs-button>
                </div>
            </vx-card>
            <vs-card class="mt-3" v-else>
                <vs-alert title="MENSAJE" active="true" color="danger">
                    ! Usted ya ha llenado esta encuesta
                </vs-alert>
            </vs-card>
            <!--FIN REGISTRO LIBROS DE AREAS BASICAS-->
        </div>
    </div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
import vSelect from 'vue-select'
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
Vue.use(axios)
Vue.component("v-select", vSelect);
import $ from 'jquery'
export default {
  data() {
    return {
      id:0,
      arregloPreguntas:[],
      validate:false,
      msgError:'',
      getError:false,
      nuevoUser:"si",
      parametros:{
        id:'',
        institucion:'',
      },
      user:{
        idusuario:0,
        cedula:'',
        nombres:'',
        apellidos:'',
        email:'',
        telefono:'',
        periodoDescripcion:'',
        nombreInstitucion:'',
        periodo_id:'',
        encuesta_id:'',
      },
      libro_docente_id:0,
    }
  },
    mixins: [historicoMixin],
  created(){
    let me                      = this;
    me.parametros.id            = this.$route.params.id;
    me.parametros.institucion   = this.$route.params.institucion;
    me.validateForm();
  },
  mounted() {
        let me = this;
        if (localStorage.tk != null) {
            this.$router.push('/home');
        } else {}
        me.getSeries();
    },
    methods: {
        //validate Form
        validateForm(){
            let me = this;
            this.$http.get(this.$server_url+'encuesta?validarEncuesta=yes&institucion_id='+me.parametros.institucion+'&id='+me.parametros.id)
            .then(function (res) {
                if(res.data.status == 0){
                    me.validate = false;
                    me.msgError = res.data.message
                    return
                }else{
                    me.validate = true;
                    me.user.periodoDescripcion = res.data.periodoDescripcion
                    me.user.nombreInstitucion  = res.data.nombreInstitucion[0].nombreInstitucion
                    me.user.periodo_id         = res.data.periodo_id
                    me.user.encuesta_id        = res.data.encuesta_id
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        //para obtener  la series
        getSeries() {
            let me = this;
            this.$http.get(this.$server_url+'traerSeries?docentes=yes&formulario_id='+me.parametros.id )
                .then(function (res) {
                    me.arregloManantial         = res.data.filter(p => p.id_serie == 1 || p.id_serie == 2)
                    me.arregloRuta              = res.data.filter(p => p.id_serie == 3 || p.id_serie == 4)
                    me.arregloComplementarias   = res.data.filter(p => p.id_serie == 5 || p.id_serie == 6 || p.id_serie == 7 || p.id_serie == 8 || p.id_serie == 9)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        llenarCampos(){
            let me = this;
            this.$http.get(this.$server_url+'verInfoCedulaEncuesta?cedula='+me.user.cedula+'&institucion_id='+me.parametros.institucion+'&periodo_id='+me.user.periodo_id+'&encuesta_id='+me.user.encuesta_id)
                .then(function (res) {
                   if(res.data.status == 3){
                        me.$vs.notify({
                        text:res.data.message,
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check',
                        time:10000
                        })
                        me.user.nombres   = ""
                        me.user.apellidos = ""
                        me.user.email     = ""
                        me.user.telefono  = ""
                        me.getError       = true
                        me.nuevoUser      = "si"
                        me.user.cedula    = ""
                        me.id             = 0
                        return
                   }
                   if(res.data.status == 1){
                      me.user.idusuario = res.data.infoUsuario[0].idusuario
                      me.user.nombres   = res.data.infoUsuario[0].nombres
                      me.user.apellidos = res.data.infoUsuario[0].apellidos
                      me.user.email     = res.data.infoUsuario[0].email
                      me.user.telefono  = res.data.infoUsuario[0].telefono
                      me.getError       = false
                      me.nuevoUser      = "no"
                      if(res.data.encuestaDocente.length > 0){
                        me.id             = res.data.encuestaDocente[0].id 
                      }else{
                        me.id             = 0
                      }
                   }else{
                      me.user.nombres   = ""
                      me.user.apellidos = ""
                      me.user.email     = ""
                      me.user.telefono  = ""
                      me.getError       = false
                      me.nuevoUser      = "si"
                      me.id             = 0
                   }
                   me.arregloPreguntas = res.data.preguntas
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        openConfirm() {
            let me = this;
             //validacion de campos
            if(me.user.cedula.trim() == "" || me.user.nombres.trim() == "" || me.user.apellidos.trim() == "" || me.user.email.trim() == "" || me.user.telefono.trim() == ""){
                me.$vs.notify({
                text:"Debe llenar todos los campos",
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            let datos = me.arregloPreguntas;
            let validaNulos = []
            validaNulos = datos.filter(p => (p.valor == null) || (p.valor == ""))
            if(validaNulos.length > 0){
                me.$vs.notify({
                text:"Debe marcar todas las preguntas por favor",
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText:'Aceptar',
                CancelText:'Cancelar',
                text: 'Esta seguro de guardar la encuesta.',
                accept: this.guardarFormulario
            })
        },
        guardarFormulario(){
            let me = this;
            let formData = new FormData();
            formData.append('respuestas',           JSON.stringify(me.arregloPreguntas))
            formData.append('institucion_id',       me.parametros.institucion)
            formData.append('encuestas_escuela_id', me.parametros.id)
            formData.append('periodo_id',           me.user.periodo_id)
            formData.append('nuevoUser',            me.nuevoUser)
            formData.append('idusuario',            me.user.idusuario)
            formData.append('encuesta_id',          me.user.encuesta_id)
            //Datos personales
            formData.append('cedula',               me.user.cedula)
            formData.append('nombres',              me.user.nombres)
            formData.append('apellidos',            me.user.apellidos)
            formData.append('email',                me.user.email)
            formData.append('telefono',             me.user.telefono)
            this.$http.post(this.$server_url+'guardarRespuestaEncuesta',formData)
                .then(function (res) {
                  if(res.data.status == 0){
                    me.$vs.notify({
                        text:res.data.message,
                        color:'danger',
                        iconPack: 'feather',
                        icon:'icon-check',
                        time:6000
                    })
                    return
                  }
                  me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:6000
                  })
                  me.limpiar();
                me.arregloPreguntas = [ ]
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        //cancelar libro
        confirmCancelarLibro(tr){
            let me = this;
            me.libro_docente_id = tr.id
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText:'Aceptar',
                CancelText:'Cancelar',
                text: 'Esta seguro de cancelar este libro?.',
                accept: this.CancelarLibro
            })
        },
        CancelarLibro(){
            let me = this;
            this.$http.get(this.$server_url+'formularioDocente?cancelarLibro=yes&id='+me.libro_docente_id)
                .then(function (res) {
                   me.$vs.notify({
                    text:"Se elimino correctamente",
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check',
                    })  
                    me.llenarCampos() 
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        limpiar(){
            let me                          = this;
            me.user.idusuario               = 0
            me.user.cedula                  = ""
            me.user.nombres                 = ""
            me.user.apellidos               = ""
            me.user.email                   = ""
            me.user.telefono                = ""
            me.id                           = 0
        },
        formSubmitted() {
            alert("Form submitted!");
        },
    },
    components: {
        FormWizard,
        TabContent,
        vSelect
    }
}
</script>

<style lang="scss">
.banner{
    background: #00B4DB;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #0083B0, #00B4DB);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #0083B0, #00B4DB); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
box-shadow: 5px 6px 5px #0083B0;
}
</style>
