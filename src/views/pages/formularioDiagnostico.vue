<template>
    <div>
      <div v-if="popupRealizarPregunta">
        <vx-card class="mt-3">
          <vs-button color="primary" size="small" style="margin-top:-10px" @click="popupRealizarPregunta = false;" icon="reply" type="border">Regresar</vs-button>
          <p  class="text-2xl font-medium mt-4">Realizar evaluación de <span class="font-bold">{{ user.nombrelibro }}</span></p>
          <br>
          <small v-if="arregloPreguntas.length > 0 ">Instrucción: Lea detenidamente las preguntas y escoga verdadero o falso</small>
          <vs-divider></vs-divider>
          <br><br>
          <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in arregloPreguntas">
            <div class="vx-col sm:w-1/5 w-full" align="center">
              <img v-if="item.imagen" style="border-radius: 5px;" v-bind:src="$data_url+'archivos/diagnostico/img/img_preguntas/'+item.imagen" width="100">
            </div>
            <div class="vx-col sm:w-4/5 w-full" style="display: flex;justify-content: space-between;" >
              <p class="text-primary  font-light">{{indexitem + 1}}. {{item.pregunta}}</p>
              <div class="vx-row" align="center">
                <div class="vx-col  w-full">
                  <span>Verdadero </span>  <input  class="ml-2" type="radio" id="html" v-model="item.formato" :name="key" value="1">
                  <span class="ml-5">Falso </span> <input class="ml-2"  type="radio" id="html" v-model="item.formato" :name="key" value="0">
                </div>
              </div>
            </div>
          </div>
          <div class="flex mt-5">
            <vs-button color="success" v-if="getError == false" icon="save" class="mr-3 mb-2 ml-5" @click="openConfirm()">Enviar evaluación</vs-button>
          </div>
        </vx-card>
      </div>
      <div v-else>
        <vx-card
          v-if="validate == false"
          title="Estimado docente"
          title-color="primary"
          subtitle-color="warning"
          :subtitle="msgError">
          <p class="mb-3">!Comuniquese a soporte@prolipa.com.ec para solventar el incoveniente</p>
        </vx-card>
        <div v-else style="padding:0px 40px;">
          <vx-card slot="no-body" class="banner">
            <div style="display: flex;justify-content:center;">   
              <div>
                  <p style="color:white;font-size:25px;text-align:center;letter-spacing: 3px;">Registro de libros</p>
              </div>
            </div>
          </vx-card>
          <vx-card class="mt-3">
            <p class="font-bold text-3xl text-warning">Una vez ingresado el código de libro se le activara la prueba diagnóstica</p>
            <vs-divider class="mt-3">Datos</vs-divider>
            <br><br>
            <div class="vx-row mb-6">
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
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" disabled icon="icon-user" icon-no-border label="Nombres" v-model="user.nombres" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-2">
                    <vs-input class="w-full" icon-pack="feather" disabled icon="icon-user" icon-no-border label="Apellidos" v-model="user.apellidos" />
                </div>
            </div>
          </vx-card>
          <vx-card class="mt-3" v-if="getError == false">
            <p class="text-2xl font-medium">Ingreso de códigos</p>
            <small>Puede ser seleccionar uno más libros</small>
            <vs-divider></vs-divider>
            <br>
            <div class="flex">
              <div style="width:30%">
                <p class="text-primary text-2xl font-light">Ingrese el <code>Código</code></p>
              </div>
              <div style="width:80%;" class="flex" v-for="(tr,index) in inicioCode">
                <vx-input-group class="mb-base w-full">
                  <vs-input v-model="tr.codigo" @keyup.enter="guadarCodigo(tr.codigo)"/>
                  <template slot="append">
                    <div class="append-text btn-addon">
                      <vs-button icon="save" color="primary" @click="guadarCodigo(tr.codigo)">Guardar</vs-button>
                    </div>
                  </template>
                </vx-input-group>
              </div>
            </div>
            <div>
              <div class="flex" v-for="(item,i) in arregloCodigos">
                <div style="width:30%">
                    <p transparent class="text-success text-2xl font-light">Código Ingresado:</p>
                </div>
                <div style="width:80%;" class="flex">
                    <vx-input-group class="mb-base w-full">
                        <vs-input disabled v-model="item.getlibro" />
                        <template slot="append">
                            <div class="append-text btn-addon">
                            <vs-button icon="check" color="success">Validado</vs-button>
                            </div>
                        </template>
                    </vx-input-group>
                </div>
              </div>
            </div>
          </vx-card>
        </div>
        <vx-card style="width:95%;margin-left:40px;margin-top:20px;" v-if="arreglosEvaluaciones.length > 0"
          title="Evaluaciones Pendientes"
          title-color="primary"
          subtitle="Las evaluaciones son de forma obligaria">
          <main class="main">
            <section class="card-area" v-for="(tr,index) in arreglosEvaluaciones">
              <!-- Card: Ski -->
              <section class="card-section">
                <div class="card">
                  <div class="flip-card">
                    <div class="flip-card__container">
                      <div class="card-front">
                        <div class="card-front__tp card-front__tp--ski">
                          <img width="100" style="margin-top:-15px" src="https://cdn-icons-png.flaticon.com/512/5988/5988191.png"/>
                          <h2 class="card-front__heading">
                            Evaluación pendiente
                          </h2> 
                          <small style="text-align:center;font-size:9px;margin-top:-2px;">({{tr.nombrelibro}})</small>
                        </div>
                        <div class="card-front__bt">
                          <p class="card-front__text-view card-front__text-view--ski">
                            Revisar
                          </p>
                        </div>
                      </div>
                      <div class="card-back">
                        <img width="100%" src="https://blog.peoplenext.com/hubfs/evaluaci%C3%B3n%20de%20desempe%C3%B1o%20constante%20para%20los%20empleados_imgdest.png">
                      </div>
                    </div>
                  </div>
                  <div class="inside-page">
                    <div class="inside-page__container">
                      <h3 class="inside-page__heading inside-page__heading--ski">
                        Obligatorio
                      </h3>
                      <p class="inside-page__text">
                        Realiza la evaluación de <code class="font-bold">{{tr.nombrelibro}}</code> para que tu profesor pueda calificarte
                      </p>
                      <a @click="realizarEvaluacion(tr)" class="cursor-pointer inside-page__btn inside-page__btn--ski">
                        <small style="font-size:10px;">Realizar evaluación</small>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </main>
        </vx-card>
      </div>
      <vs-prompt
        @cancel="idlibro=''"
        title="Abrir Ticket"
        @accept="abrirTicket"
        acceptText="Aceptar"
        cancelText="Cancelar"
        @close="close"
        :active.sync="popupTicket">
          <div class="con-exemple-prompt">
              <vs-alert>Al abrir un ticket se abrirá un chat con una persona de soporte, el cual podra ver en su perfil </vs-alert>
              <br>
              <vs-input class="inputx mb-3 w-full" disabled label="Estudiante" v-model="ticket.estudiante" /> 
              <vs-input class="inputx mb-3 w-full" disabled label="Institucion" v-model="ticket.nombreInstitucion" /> 
              <vs-input class="inputx mb-3 w-full" disabled label="Codigo" v-model="ticket.codigo" /> 
              <vs-input class="inputx mb-3 w-full" disabled label="Motivo" v-model="ticket.descripcion" />
              <vs-textarea counter="500" style="width:100%;" :counter-danger.sync="counterDanger" label="Mensaje (Opcional)" v-model="ticket.observacion" />
          </div>
      </vs-prompt>
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
      validate:false,
      msgError:'',
      getError:true,
      parametros:{
        periodo:'',
        institucion:'',
      },
      user:{
        idusuario:0,
        cedula:'',
        // cedula:'0953190907',
        nombres:'',
        apellidos:'',
        email:'',
        telefono:'',
        periodoDescripcion:'',
        nombreInstitucion:'',
        periodo_id:'',
        diagnostico_libros_id:0,
        nombrelibro:'',
      },
      arregloCodigos:[],
      inicioCode:[
        {
          codigo:''
        }
      ],
      arreglosEvaluaciones:[],
      popupRealizarPregunta:false,
      arregloPreguntas:[],
      //variables para el ticket
      counterDanger: false,
      ticket:{
        nombreInstitucion:'',
        estudiante:'',
        usuario:'',
        institucion:'',
        codigo:'',
        descripcion:'',
        observacion:'',
        cedula:'',
        datos_ticket:0,
      },
      popupTicket:false,
      //fin variables para el ticket
    }
  },
    mixins: [historicoMixin],
  created(){
    let me                      = this;
    me.parametros.periodo       = this.$route.params.periodo;
    me.parametros.institucion   = this.$route.params.institucion;
    me.validateForm();
  },
  mounted() {
      let me = this;
      if (localStorage.tk != null) {
        this.$router.push('/home');
      } else {}
  },
  methods: {
    //validate Form
    validateForm(){
      let me = this;
      this.$http.get(this.$server_url+'diagnostico?validar=yes&institucion_id='+me.parametros.institucion+'&periodo_id='+me.parametros.periodo)
      .then(function (res) {
          if(res.data.status == 0){
            me.validate = false;
            me.msgError = res.data.message
            return
          }else{
            me.validate = true;
            me.user.periodoDescripcion = res.data.periodoDescripcion
            me.user.nombreInstitucion  = res.data.nombreInstitucion
            me.user.periodo_id         = me.parametros.periodo
          }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    llenarCampos(){
    let me = this;
    me.librosAsignados = []
    this.$http.get(this.$server_url+'verInfoCedulaDiagnostico?cedula='+me.user.cedula+'&institucion_id='+me.parametros.institucion+'&periodo_id='+me.user.periodo_id)
      .then(function (res) {
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check',
          time:8000
          })
          me.user.diagnostico_libros_id = 0
          me.user.nombrelibro           = ""
          me.user.idusuario             = 0
          me.user.nombres               = ""
          me.user.apellidos             = ""
          me.user.email                 = ""
          me.user.telefono              = ""
          me.user.cedula                = ""
          me.getError                   = true;
          me.id                         = 0
          me.arreglosEvaluaciones       = []
          me.arregloPreguntas           = []
          return
        }
        if(res.data.status == 1){
          me.user.idusuario = res.data.info[0].idusuario
          me.user.nombres   = res.data.info[0].nombres
          me.user.apellidos = res.data.info[0].apellidos
          me.user.email     = res.data.info[0].email
          me.user.telefono  = res.data.info[0].telefono
          me.arregloCodigos = res.data.codigos
          let datos = res.data.codigos 
          if(datos.length > 0){
            me.arreglosEvaluaciones = datos.filter(p => p.prueba_diagnostica == 0)
          }
          me.getError       = false
          //me.librosAsignados = res.data.libros
        }
      })
      .catch(function (error) {
            console.log(error + ' error');
      })
    },
    guadarCodigo(codigo){
      let me = this;
      //maximo 10 codigo
      let contador = me.arregloCodigos.length
      if(contador >= 10){
        me.$vs.notify({
        text:"Solo se admite un máximo de 10 códigos",
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        time:8000
        })   
        return
      }
      if(codigo.trim() == ""){
        me.$vs.notify({
        text:"Ingrese un código, el campo esta vacio",
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        time:3000
        })   
        return
      }
      let formData = new FormData();
      formData.append('institucion_id',   me.parametros.institucion)
      formData.append('periodo_id',       me.parametros.periodo)
      formData.append('estudiante_id',    me.user.idusuario)
      formData.append('codigo',           codigo)
      this.$http.post(this.$server_url+'diagnostico',formData)
        .then(function (res) {
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:8000
            })   
            return
          }
          if(res.data.status == 1){
            me.inicioCode[0].codigo = ""
            me.arregloCodigos    = res.data.codigos
            me.$vs.notify({
              text:'Se asigno correctamente el código',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check',
              time:3000
            })
            me.llenarCampos()
          }
          if (res.data.status == 2) {
            if(res.data.realizarTicket == 'ok'){        
              //Para abrir un ticket
              me.ticket.codigo            = codigo;
              me.ticket.usuario           = me.user.idusuario;
              me.ticket.institucion       = me.parametros.institucion;
              me.ticket.descripcion       = res.data.message;
              me.ticket.nombreInstitucion = me.user.nombreInstitucion;
              me.ticket.estudiante        = me.user.nombres + " " + me.user.apellidos;
              me.ticket.cedula            = me.user.cedula;
              me.ticket.datos_ticket      = res.data.datos
              me.popupTicket              = true;
            }
            else{
              me.$vs.notify({
              color: 'warning',
              title: 'Mensaje',
              text: 'Tiene abierto 10 tickets.',
              time:6000,
              })
            }
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    realizarEvaluacion(tr){
      let me = this;
      me.user.diagnostico_libros_id = tr.id
      me.user.nombrelibro           = tr.nombrelibro
      this.$http.get(this.$server_url+'diagnostico?getPreguntasOpciones=yes&libro_id='+tr.libro_id)
        .then(function (res) {
            if(res.data.length == 0){
            me.$vs.notify({
              text:'La evaluacion no tiene preguntas, informe a su docente',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check',
              time:8000
            })
            return
            }
            me.popupRealizarPregunta = true
            me.arregloPreguntas      = res.data
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    openConfirm() {
      let me = this;
      let datos = me.arregloPreguntas;
      let validaNulos = []
      validaNulos = datos.filter(p => (p.formato == null) || (p.formato == ""))
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
          text: 'Esta seguro de guardar la evaluación.',
          accept: this.guardarPrueba
      })
    },
    guardarPrueba(){
      let me = this;
      let formData = new FormData();
      formData.append('respuestas',             JSON.stringify(me.arregloPreguntas))
      formData.append('institucion_id',         me.parametros.institucion)
      formData.append('periodo_id',             me.parametros.periodo)
      formData.append('estudiante_id',          me.user.idusuario)
      formData.append('diagnostico_libros_id',  me.user.diagnostico_libros_id)
      formData.append('cantidad_preguntas',     me.arregloPreguntas.length)
      this.$http.post(this.$server_url+'guardarRespuestaDiagnostico',formData)
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
        //me.limpiar();
      me.arregloPreguntas = [ ]
      me.popupRealizarPregunta = false;
      me.llenarCampos();
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    limpiar(){
      let me                          = this;
      me.user.idusuario               = 0
      me.user.cedula                  = ""
      me.arregloCodigos               = []
    },
    //METODOS PARA LOS TICKETS
    async abrirTicket(){
      let me = this;
        if(me.ticket.codigo.length >= 25){
          me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'El codigo no puede superar los 25 caracteres.'
            })
          return false;
      }
      if(me.ticket.observacion.length >= 500){
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'El motivo no puede superar los 500 caracteres.'
          })
        return false;
      }
      let formData = new FormData();
      formData.append('cedula',             me.ticket.cedula);
      formData.append('codigo',             me.ticket.codigo);
      formData.append('institucion_id',     me.ticket.institucion);
      formData.append('usuario_id',         me.ticket.usuario);
      formData.append('group_id',           "4");
      formData.append('descripcion',        me.ticket.descripcion);
      formData.append('observacion',        me.ticket.observacion);
      formData.append('nombreInstitucion',  me.ticket.nombreInstitucion);
      formData.append('ticket_asesor',      1)
      formData.append('datos_ticket',       me.ticket.datos_ticket)
      this.$http.post(this.$server_url+'ticket', formData)
        .then(function (res) {
          me.$vs.notify({
              text: res.data,
              color: 'primary',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
          })
          me.popupTicket=false;
          me.ticket.observacion   = "";
          me.ticket.cedula        = "";
          me.ticket.codigo        = "";
          me.ticket.institucion   = "";
          me.ticket.usuario       = "";
          me.ticket.descripcion   = "";
          me.ticket.datos_ticket  = 0
        })
        .catch(function (error) {})
    },
    close() {
      this.$vs.notify({
          color: 'danger',
          title: '',
          text: 'Datos no guardados!'
      })
    },
    //FIN METODOS PARA LOS TICKETS
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

<style lang="scss" scoped>
  .banner{
    background: #00B4DB;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #0083B0, #00B4DB);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #0083B0, #00B4DB); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  box-shadow: 5px 6px 5px #0083B0;
  }

        /* CSS reset */
          *,
  *::after,
  *::before {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  html { font-size: 62.5%; }

  body {
    box-sizing: border-box;
    font-family: 'Open Sans', sans-serif;
    position: relative;
  }

  /* Typography =======================*/

  /* Headings */

  /* Main heading for card's front cover */
  .card-front__heading {
    font-size: 14px;
    margin-top: .25rem;
    color:white;
  }

  /* Main heading for inside page */
  .inside-page__heading { 
    padding-bottom: 1rem; 
    width: 100%;
  }

  /* Mixed */

  /* For both inside page's main heading and 'view me' text on card front cover */
  .inside-page__heading,
  .card-front__text-view {
    font-size: 1.3rem;
    font-weight: 800;
    margin-top: .2rem;
  }

  .inside-page__heading--city,
  .card-front__text-view--city { color: #ff62b2; }

  .inside-page__heading--ski,
  .card-front__text-view--ski { color: #2aaac1; }

  .inside-page__heading--beach,
  .card-front__text-view--beach { color: #fa7f67; }

  .inside-page__heading--camping,
  .card-front__text-view--camping { color: #00b97c; }

  /* Front cover */

  .card-front__tp { color: #fafbfa; }

  /* For pricing text on card front cover */
  .card-front__text-price {
    font-size: 1.2rem;
    margin-top: -.2rem;
  }

  /* Back cover */

  /* For inside page's body text */
  .inside-page__text {
    color: #333;
  }

  /* Icons ===========================================*/

  .card-front__icon {
    fill: #fafbfa;
    font-size: 3vw;
    height: 3.25rem;
    margin-top: -.5rem;
    width: 3.25rem;
  }

  /* Buttons =================================================*/

  .inside-page__btn {
    background-color: transparent;
    border: 3px solid;
    border-radius: .5rem;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 2rem;
    overflow: hidden;
    // padding: .7rem .75rem;
    position: relative;
    text-decoration: none;
    transition: all .3s ease;
    width: 90%;
    z-index: 10;
  }

  .inside-page__btn::before { 
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: scaleY(0);
    transition: all .3s ease;
    width: 100%;
    z-index: -1;
  }

  .inside-page__btn--city { 
    border-color: #ff40a1;
    color: #ff40a1;
  }

  .inside-page__btn--city::before { 
    background-color: #ff40a1;
  }

  .inside-page__btn--ski { 
    border-color: #279eb2;
    color: #279eb2;
  }

  .inside-page__btn--ski::before { 
    background-color: #279eb2;
  }

  .inside-page__btn--beach { 
    border-color: #fa7f67;
    color: #fa7f67;
  }

  .inside-page__btn--beach::before { 
    background-color: #fa7f67;
  }

  .inside-page__btn--camping { 
    border-color: #00b97d;
    color: #00b97d;
  }

  .inside-page__btn--camping::before { 
    background-color: #00b97d;
  }

  .inside-page__btn:hover { 
    color: #fafbfa;
  }

  .inside-page__btn:hover::before { 
    transform: scaleY(1);
  }

  /* Layout Structure=========================================*/

  .main {
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    justify-content: center;
  //   height: 100vh;
    width: 100%;
  }

  /* Container to hold all cards in one place */
  .card-area {
    align-items: center;
    display: flex;
    flex-wrap: nowrap;
    height: 100%;
    justify-content: space-evenly;
    padding: 1rem;
  }

  /* Card ============================================*/

  /* Area to hold an individual card */
  .card-section {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }

  /* A container to hold the flip card and the inside page */
  .card {
    background-color: rgba(0,0,0, .05);
    box-shadow: -.1rem 1.7rem 6.6rem -3.2rem rgba(0,0,0,0.5);
    height: 15rem;
    position: relative;
    transition: all 1s ease;
    width: 15rem;
  }

  /* Flip card - covering both the front and inside front page */

  /* An outer container to hold the flip card. This excludes the inside page */
  .flip-card {
    height: 15rem;
    perspective: 100rem;
    position: absolute;
    right: 0;
    transition: all 1s ease;
    visibility: hidden;
    width: 15rem;
    z-index: 100;
  }

  /* The outer container's visibility is set to hidden. This is to make everything within the container NOT set to hidden  */
  /* This is done so content in the inside page can be selected */
  .flip-card > * {
    visibility: visible;
  }

  /* An inner container to hold the flip card. This excludes the inside page */
  .flip-card__container {
    height: 100%;
    position: absolute;
    right: 0;
    transform-origin: left;
    transform-style: preserve-3d;
    transition: all 1s ease;
    width: 100%;
  }

  .card-front,
  .card-back {
    backface-visibility: hidden;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  /* Styling for the front side of the flip card */

  /* container for the front side */
  .card-front {
    background-color: #fafbfa;
    height: 15rem;
    width: 15rem;
  }

  /* Front side's top section */
  .card-front__tp {
    align-items: center;
    clip-path: polygon(0 0, 100% 0, 100% 90%, 57% 90%, 50% 100%, 43% 90%, 0 90%);
    display: flex;
    flex-direction: column;
    height: 12rem;
    justify-content: center;
    padding: .75rem;
  }

  .card-front__tp--city {
    background: linear-gradient(
      to bottom,
      #ff73b9,
      #ff40a1
    );
  }

  .card-front__tp--ski {
    background: linear-gradient(
      to bottom,
      #47c2d7,
      #279eb2
    );
  }

  .card-front__tp--beach {
    background: linear-gradient(
      to bottom,
      #fb9b88,
      #f86647
    );
  }

  .card-front__tp--camping {
    background: linear-gradient(
      to bottom,
      #00db93,
      #00b97d
    );
  }

  /* Front card's bottom section */
  .card-front__bt {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  /* Styling for the back side of the flip card */

  .card-back {
    background-color: #fafbfa;
    transform: rotateY(180deg);
  }

  /* Specifically targeting the <video> element */
  .video__container {
    clip-path: polygon(0% 0%, 100% 0%, 90% 50%, 100% 100%, 0% 100%);
    height: auto;
    min-height: 100%;
    object-fit: cover;
    width: 100%;
  }

  /* Inside page */

  .inside-page {
    background-color: #fafbfa;
    box-shadow: inset 20rem 0px 5rem -2.5rem rgba(0,0,0,0.25);
    height: 100%;
    padding: 1rem;
    position: absolute;
    right: 0;
    transition: all 1s ease;
    width: 15rem;
    z-index: 1;
  }

  .inside-page__container {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    text-align: center; 
    width: 100%;
  }

  /* Functionality ====================================*/

  /* This is to keep the card centered (within its container) when opened */
  .card:hover {
    box-shadow:
    -.1rem 1.7rem 6.6rem -3.2rem rgba(0,0,0,0.75);
    width: 30rem;
  }

  /* When the card is hovered, the flip card container will rotate */
  .card:hover .flip-card__container {
    transform: rotateY(-180deg);
  }

  /* When the card is hovered, the shadow on the inside page will shrink to the left */
  .card:hover .inside-page {
    box-shadow: inset 1rem 0px 5rem -2.5rem rgba(0,0,0,0.1);
  }
</style>
