<template>
    <div>
        <div style="padding:0px 40px;">
            <vx-card class="mt-3">
                <p class="font-bold text-3xl text-warning">Seleccione los libros que podran elegir los docentes</p>
                <br>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/2 w-full mb-2" style="margin-top:-15px;">
                        <vs-list>
                            <vs-list-item title="Institución"   :subtitle="formularioNombreInstitucion"></vs-list-item>
                            <vs-list-item title="Período"       :subtitle="formularioPeriodo"></vs-list-item>
                        </vs-list>
                    </div>
                </div>
            </vx-card>
            <!--REGISTRO LIBROS DE AREAS BASICAS-->
            <vx-card class="mt-3">
                <p class="text-2xl font-medium">Áreas básicas</p>
                <small>Puede ser seleccionar uno más libros</small>
                <vs-divider></vs-divider>
                <div class="flex">
                    <div style="width:50%">
                        <p class="text-primary text-2xl font-light">Seleccione los libros de la serie <code>MANANTIAL</code></p>
                    </div>
                    <div style="width:50%" class="flex">
                        <v-select multiple  :closeOnSelect="false" :options="arregloManantial" :reduce="arregloManantial => arregloManantial" label="nombre" class="w-full" v-model="serie.manantial" />
                    </div>
                </div>
                <div class="flex mt-5">
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
            <vx-card class="mt-3">
                <p class="text-2xl font-medium">Áreas Complementarias</p>
                <small>Puede ser seleccionar uno más libros</small>
                <vs-divider></vs-divider>
                <div class="flex">
                    <div style="width:50%">
                        <p class="text-primary text-2xl font-light">Seleccione los libros de áreas   <code>COMPLEMENTARIAS</code> </p>
                    </div>
                    <div style="width:50%" class="flex">
                        <v-select multiple :closeOnSelect="false" :options="arregloComplementarias" :reduce="arregloComplementarias => arregloComplementarias" label="nombre" class="w-full" v-model="serie.complementarias" />
                    </div>
                </div>
                <div v-if="deleteBook" class="mt-4">
                    <p class="font-bold text-danger text-2xl">Estas seguro de eliminar este libro generado para los docentes?</p>
                    <vs-divider></vs-divider>
                    <div class="flex">
                        <vs-button color="warning" @click="CancelarLibro();" type="filled">Si</vs-button>
                        <vs-button  class="ml-2" color="primary" @click="deleteBook = false;" type="border">Cancelar</vs-button>
                    </div>
                </div>
                <div v-else>
                    <div v-if="librosAsignados" class="vx-col w-full" style="margin-top:30px;">
                        <vs-divider color="primary">Usted tiene asignado estos libros:</vs-divider>
                        <div class="vx-col w-full" align="left">
                            <vs-list>
                                <vs-list-item class="ml-6" icon-pack="feather" icon="icon-check" v-for="(item,index) in librosAsignados" :key="index" :subtitle="item.nombrelibro">
                                    <vx-tooltip  style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                        <vs-button class="mr-6" size="small" @click="confirmDeleteBook(item)" color="danger" icon-pack="feather" icon="icon-trash"></vs-button>
                                    </vx-tooltip>
                                </vs-list-item>
                            </vs-list>
                        </div>
                    </div>
                    <div class="flex mt-5">
                        <vs-button color="success" v-if="getError == false" icon="save" class="mr-3 mb-2" @click="openConfirm()">Guardar Selección</vs-button>
                    </div>
                </div>
              
            </vx-card>
            <!--FIN REGISTRO LIBROS DE AREAS BASICAS-->
        </div>
    </div>
</template>
<script>
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
      msgError:'',
      getError:false,
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
      libro_generado_id:0,
      deleteBook:false,
    }
  },
  props:{
        formularioNombreInstitucion:{
          type:String,
          default:0,
        },
        formularioPeriodo:{
          type:String,
          default:"",
        },
        formulario_id:{
          type:Number,
          default:0,
        }
    },
  created(){
    let me     = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted() {
        let me = this;
        if (localStorage.tk != null) {
            this.$router.push('/home');
        } else {}
        me.getSeries();
        me.getBooksGenerados();
    },
    methods: {
        //para obtener  la series
        getSeries() {
            let me = this;
            this.$http.get(this.$server_url+'traerSeries')
                .then(function (res) {
                    me.arregloManantial         = res.data.filter(p => p.id_serie == 1 || p.id_serie == 2)
                    me.arregloRuta              = res.data.filter(p => p.id_serie == 3 || p.id_serie == 4)
                    me.arregloComplementarias   = res.data.filter(p => p.id_serie == 5 || p.id_serie == 6 || p.id_serie == 7 || p.id_serie == 8 || p.id_serie == 9)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        //para obtener los libros generados
        getBooksGenerados() {
            let me = this;
            this.$http.get(this.$server_url+'getBooksGenerados?formulario_link_id='+me.formulario_id)
                .then(function (res) {
                   me.librosAsignados = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        openConfirm() {
            let me = this;
            let repetida = false;
            let repe_asign = '';
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
            
            this.guardarFormulario()
            
        },
        guardarFormulario(){
            let me = this;
            let formData = new FormData();
            formData.append('formulario_link_id',   me.formulario_id)
            //Libros
            formData.append('manantial',            JSON.stringify(me.serie.manantial))
            formData.append('ruta',                 JSON.stringify(me.serie.ruta))
            formData.append('complementarias',      JSON.stringify(me.serie.complementarias))
            this.$http.post(this.$server_url+'asesorGeneraBook',formData)
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
                  me.limpiar();
                  me.getBooksGenerados();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        //cancelar libro
        confirmDeleteBook(tr){
            let me = this;
            me.deleteBook = true;
            me.libro_generado_id = tr.id
        },
        CancelarLibro(){
            let me = this;
            this.$http.get(this.$server_url+'formularioDocente?cancelarGeneracionBook=yes&id='+me.libro_generado_id)
                .then(function (res) {
                   me.$vs.notify({
                    text:"Se elimino correctamente",
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check',
                    })  
                    me.deleteBook = false;
                    me.getBooksGenerados() 
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
