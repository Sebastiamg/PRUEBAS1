<template>
    <div>
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
                        <p style="color:white;font-size:25px;text-align:center;letter-spacing: 3px;">Registro de docentes y libros</p>
                    </div>
                </div>
            </vx-card>
            <vx-card class="mt-3">
                <p class="font-bold text-3xl text-warning">¿Qué libros desea impartir este año Lectivo?</p>
                <br>
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
            <!--REGISTRO LIBROS DE AREAS BASICAS-->
            <vx-card class="mt-3" v-if="arregloManantial.length > 0  || arregloRuta.length > 0">
                <p class="text-2xl font-medium">Áreas básicas</p>
                <small>Puede ser seleccionar uno más libros</small>
                <vs-divider></vs-divider>
                <div class="flex" v-if="arregloManantial.length > 0 ">
                    <div style="width:50%">
                        <p class="text-primary text-2xl font-light">Seleccione los libros de la serie <code>MANANTIAL</code></p>
                    </div>
                    <div style="width:50%" class="flex">
                        <v-select multiple  :closeOnSelect="false" :options="arregloManantial" :reduce="arregloManantial => arregloManantial" label="nombre" class="w-full" v-model="serie.manantial" />
                    </div>
                </div>
                <div class="flex mt-5" v-if="arregloRuta.length > 0">
                    <div style="width:50%">
                        <p class="text-primary text-2xl font-light">Seleccione los libros de la serie <code>RUTA</code></p>
                    </div>
                    <div style="width:50%" class="flex">
                        <v-select multiple :closeOnSelect="false" :options="arregloRuta" :reduce="arregloRuta => arregloRuta" label="nombre" class="w-full" v-model="serie.ruta" />
                    </div>
                </div>
            </vx-card>
            <!--FIN REGISTRO LIBROS DE AREAS BASICAS-->
            <!--REGISTRO LIBROS DE AREAS COMPLEMENTARIAS-->
            <vx-card class="mt-3" v-if="arregloComplementarias.length > 0 || arregloManantial.length > 0  || arregloRuta.length > 0">
                <p  v-if="arregloComplementarias.length > 0" class="text-2xl font-medium">Áreas Complementarias</p>
                <small v-if="arregloComplementarias.length > 0">Puede ser seleccionar uno más libros</small>
                <vs-divider></vs-divider>
                <div class="flex" v-if="arregloComplementarias.length > 0">
                    <div style="width:50%">
                        <p class="text-primary text-2xl font-light">Seleccione los libros de áreas   <code>COMPLEMENTARIAS</code> </p>
                    </div>
                    <div style="width:50%" class="flex">
                        <v-select multiple :closeOnSelect="false" :options="arregloComplementarias" :reduce="arregloComplementarias => arregloComplementarias" label="nombre" class="w-full" v-model="serie.complementarias" />
                    </div>
                </div>
                <div v-if="librosAsignados" class="vx-col w-full" style="margin-top:30px;">
                    <vs-divider color="primary">Usted tiene asignado estos libros:</vs-divider>
                    <div class="vx-col w-full" align="left">
                        <vs-list>
                            <vs-list-item class="ml-6" icon-pack="feather" icon="icon-check" v-for="(item,index) in librosAsignados" :key="index" :subtitle="item.nombrelibro">
                                  <vs-chip color="warning" v-if="item.estado == 0">
                                   Pendiente aprobación
                                  </vs-chip>
                                  <vs-chip color="success" v-if="item.estado == 1">
                                    Aprobado
                                  </vs-chip>
                                  <vx-tooltip v-if="item.estado == 0" style="display: inline-block;" text="Cancelar este libro" position="top" color="danger">
                                     <vs-button class="mr-6" size="small" @click="confirmCancelarLibro(item)" color="danger" icon-pack="feather" icon="icon-trash"></vs-button>
                                  </vx-tooltip>
                            </vs-list-item>
                        </vs-list>
                    </div>
                </div>
                <div class="flex mt-5">
                    <vs-button color="success" v-if="getError == false" icon="save" class="mr-3 mb-2" @click="openConfirm()">Solicitar Libros</vs-button>
                </div>
            </vx-card>
            <vs-card class="mt-3" v-else>
                <vs-alert title="MENSAJE" active="true" color="danger">
                    ! Su institución no tiene libros asignados, favor solicite a su asesor la asignación de libros.
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
      },
      niveles:[],
      arregloManantial:[],
      arregloRuta:[],
      arregloComplementarias:[],
      librosAsignados:[],
      serie:{
        //manatial
        manantial:'',
        ruta:'',
        complementarias:'',
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
        me.getNiveles()
        me.getSeries();
    },
    methods: {
        //validate Form
        validateForm(){
            let me = this;
            this.$http.get(this.$server_url+'formularioDocente?validar=yes&institucion_id='+me.parametros.institucion+'&id='+me.parametros.id)
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
        //para obtener los niveles
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
        llenarCampos(){
            let me = this;
            me.librosAsignados = []
            this.$http.get(this.$server_url+'verInfoCedula?cedula='+me.user.cedula+'&institucion_id='+me.parametros.institucion+'&periodo_id='+me.user.periodo_id)
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
                        me.getError       = false
                        me.nuevoUser      = "si"
                        me.user.cedula    = ""
                        me.getError       = true;
                        me.id             = 0
                        return
                   }
                   if(res.data.status == 1){
                      me.user.idusuario = res.data.info[0].idusuario
                      me.user.nombres   = res.data.info[0].nombres
                      me.user.apellidos = res.data.info[0].apellidos
                      me.user.email     = res.data.info[0].email
                      me.user.telefono  = res.data.info[0].telefono
                      me.getError       = false
                      me.nuevoUser      = "no"
                      me.librosAsignados = res.data.libros
                      if(res.data.formularioDocente.length > 0){
                        me.id             = res.data.formularioDocente[0].id 
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
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        openConfirm() {
            let me = this;
            let repetida = false;
            let repe_asign = '';
             //validacion de campos
            if(me.user.cedula.trim() == "" || me.user.nombres.trim() == "" || me.user.apellidos.trim() == "" || me.user.email.trim() == "" || me.user.telefono.trim() == ""){
                me.$vs.notify({
                text:"Debe llenar todos los campos",
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            //validar que almenos un libro sea seleccionado
            if((me.serie.manantial == "" || me.serie.manantial == null) &&  (me.serie.ruta == "" || me.serie.ruta == null) && (me.serie.complementarias == "" || me.serie.complementarias == null)){
                me.$vs.notify({
                text:"Debe seleccionar al menos un libro",
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            //VALIDACION DE LIBROS MANANTIAL
            if (me.serie.manantial !== "" && me.librosAsignados != undefined) { //libros ya asignadas
                for (let index = 0; index < me.serie.manantial.length; index++) {
                    for (let j = 0; j < me.librosAsignados.length; j++) {
                        if (me.serie.manantial[index].idLibro == me.librosAsignados[j].libro_id) {
                            repetida = true;
                            repe_asign +=me.serie.manantial[index].nombre + ' , ';
                        }
                    }
                }
            }
            if (repetida) {
                me.$vs.notify({
                    time: 5000,
                    text: 'Estos libros de MANANTIAL ' + repe_asign + ' ya se encuentra asignados, verifique antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            //VALIDACION DE LIBROS RUTA
            if (me.serie.ruta !== ""  && me.librosAsignados != undefined) { //libros ya asignadas
                for (let index = 0; index < me.serie.ruta.length; index++) {
                    for (let j = 0; j < me.librosAsignados.length; j++) {
                        if (me.serie.ruta[index].idLibro == me.librosAsignados[j].libro_id) {
                            repetida = true;
                            repe_asign +=me.serie.ruta[index].nombre + ' , ';
                        }
                    }
                }
            }
            if (repetida) {
                me.$vs.notify({
                    time: 5000,
                    text: 'Estos libros de RUTA ' + repe_asign + ' ya se encuentra asignados, verifique antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            //VALIDACION DE AREAS COMPLEMENTARIAS
            if (me.serie.complementarias != '') { //libros ya asignadas
                for (let index = 0; index < me.serie.complementarias.length; index++) {
                    for (let j = 0; j < me.librosAsignados.length; j++) {
                        if (me.serie.complementarias[index].idLibro == me.librosAsignados[j].libro_id) {
                            repetida = true;
                            repe_asign +=me.serie.complementarias[index].nombre + ' , ';
                        }
                    }
                }
            }
            if (repetida) {
                me.$vs.notify({
                    time: 5000,
                    text: 'Estos libros de áreas COMPLEMENTARIAS ' + repe_asign + ' ya se encuentra asignados, verifique antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText:'Aceptar',
                CancelText:'Cancelar',
                text: 'Esta seguro de solicitar estos libros.',
                accept: this.guardarFormulario
            })
        },
        guardarFormulario(){
            let me = this;
            let formData = new FormData();
            formData.append('formulario_id',    me.parametros.id)
            formData.append('id',               me.id)
            formData.append('institucion_id',   me.parametros.institucion)
            formData.append('periodo_id',       me.user.periodo_id)
            formData.append('nuevoUser',        me.nuevoUser)
            formData.append('idmaestro',        me.user.idusuario)
            //Datos personales
            formData.append('cedula',           me.user.cedula)
            formData.append('nombres',          me.user.nombres)
            formData.append('apellidos',        me.user.apellidos)
            formData.append('email',            me.user.email)
            formData.append('telefono',         me.user.telefono)
            //Libros
            formData.append('manantial',        JSON.stringify(me.serie.manantial))
            formData.append('ruta',             JSON.stringify(me.serie.ruta))
            formData.append('complementarias',  JSON.stringify(me.serie.complementarias))
            this.$http.post(this.$server_url+'formularioDocente',formData)
                .then(function (res) {
                  if(res.data.status == 3){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check',
                    time:8000
                    })   
                    return
                  }
                  me.$vs.notify({
                  text:res.data.message,
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check',
                  time:8000
                  })
                  //send to notificatios
                  let tipo  = "Solicitud libros"
                  let descripcion = "Solicitud a docente de "+me.user.nombreInstitucion
                  let datos = res.data.datos
                  me.saveNotifications(datos.idusuario,datos.id,tipo,descripcion)
                  me.limpiar();
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
            me.serie.manantial              = ""
            me.serie.ruta                   = ""
            me.serie.complementarias        = ""
            me.librosAsignados              = []
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
