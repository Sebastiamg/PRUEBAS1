<template>
  <vx-card
  title="Listado Descuentos"
  >
    <div>
      <!--MENU-->
      <nav class="breadcrumbs mt-3">
        <span class="breadcrumbs__item btnMenuDescuentos menuDescuento0 activeBtn   cursor-pointer"   @click="menu=0;limpiarDescuentos();estadoMenu(0);getListadoDescuentos();">← Listado Descuentos</span>
        <span class="breadcrumbs__item btnMenuDescuentos menuDescuento1  cursor-pointer"              @click="openCrearDescuento(0);estadoMenu(1);">Crear Descuentos con libros regalados</span>
        <span class="breadcrumbs__item btnMenuDescuentos menuDescuento2 cursor-pointer"               @click="openCrearDescuento(1);estadoMenu(2);">Crear Descuentos con libros</span>
      </nav>
      <!--COMPONENTS-->
      <div>
        <!--LISTADO DESCUENTO REGALADOS-->
        <div v-if="menu == 0">
          <ListadoDescuentosVue :arregloDescuentos="arregloDescuentos" @changeEditHandle="changeEditHandle" @changeDeleteHandle="changeDeleteHandle"/>
        </div>
        <!--CREAR DESCUENTOS CODIGOS REGALADOS-->
        <div v-if="menu == 1 || menu == 2">
          <CrearDescuentosVue
          :tipo="tipo"
          :contrato="contrato"
          :datosInstitucion="datosInstitucion"
          :usuario="usuario"
          :VerificacionSelect="VerificacionSelect"
          :id="id"
          :descuentoSelect="descuentoSelect"
          :editar="editar"
          :DetalleVerificacion="DetalleVerificacion"
          @updateValuesVerificacion="actualizarValorVerificacion"
          />
        </div>
        <!--CREAR DESCUENTOS DE CODIGOS LIBROS NO REGALADOS-->
        <div v-if="menu == 3">
          <ConfirmEliminarVue @changeConfirm="changeConfirmDelete"/>
        </div>
      </div>
    </div>
  </vx-card>
</template>
<script>
import ConfirmEliminarVue from '@/views/configuracion/Reutilizable/ConfirmEliminar'
import VerificacionRepository from '@/repositories/VerificacionRepository'
import ListadoDescuentosVue from './ListadoDescuentos.vue';
import Vue from 'vue'
const componentNames = ["CrearDescuentos"];
for (const componentName of componentNames) {
  const component = () => import(`./${componentName}`);
  Vue.component(componentName+'Vue', component);
}
export default{
  components:{
    ConfirmEliminarVue,
    ListadoDescuentosVue,
  },
  data(){
    return{
      menu:0,
      usuario:[],
      arregloDescuentos:[],
      id:0,
      descuentoSelect:'',
      editar:0,
      //tipo => 0 => descuento libro regalado; 1 => descuento a libro
      tipo:0,
    }
  },
  props:{
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    DetalleVerificacion:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  created() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted() {
    let me = this
    me.actualizarValorVerificacion()
    me.getListadoDescuentos()
  },
  methods:{
    limpiarDescuentos(){
      let me = this
      this.$http.get(this.$server_url+`verificacionesDescuentos?limpiarDescuentos=yes`)
      .then(function (res) {
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    getListadoDescuentos(){
      let me = this;
      const { contrato }         = me.datosInstitucion
      const { num_verificacion } = me.VerificacionSelect
      this.$http.get(this.$server_url+`verificacionesDescuentos?getListadoDescuentos=yes&contrato=${contrato}&num_verificacion=${num_verificacion}`)
      .then(function (res) {
          me.arregloDescuentos = res.data
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    openCrearDescuento(ttipo){
      let me = this;
      me.descuentoSelect         = ""
      me.id                      = 0
      me.editar                  = 0
      const {idInstitucion, id_periodo, contrato }         = me.datosInstitucion
      const { num_verificacion } = me.VerificacionSelect
      const { idusuario }        = me.usuario
      let formData = new FormData();
      formData.append('institucion_id',         idInstitucion)
      formData.append('periodo_id',             id_periodo)
      formData.append('contrato',               contrato);
      formData.append('num_verificacion',       num_verificacion);
      formData.append('user_created',           idusuario);
      formData.append('verificacion_id',        me.VerificacionSelect.id)
      formData.append('generateCopiaValores',   'yes')
      formData.append('tipo',                   ttipo)
      me.$vs.loading()
      this.$http.post(this.$server_url+'verificacionesDescuentos', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          me.menu = 0
          me.estadoMenu(0)
          return
        }
        me.getListadoDescuentos()
        me.changeEditHandle(res.data)
      })
      .catch((e) =>{
        me.$vs.loading.close()
      })
    },
    changeEditHandle(e){
      let me = this;
      me.id              = e.id
      me.editar          = 1
      me.descuentoSelect = e
      me.tipo            = e.tipo
      me.menu            = 1
    },
    changeDeleteHandle(e){
      let me  = this
      me.id   = e.id
      me.menu = 3
    },
    changeConfirmDelete(e){
      let me = this
      //0 => no eliminar; 1 = eliminar
      if(e == 0) { me.menu = 0; me.id = 0; }
      else{
        let formData = new FormData();
        formData.append('id',                     me.id);
        formData.append('eliminarDescuentos',     'yes')
        me.$vs.loading()
        this.$http.post(this.$server_url+'descuentosEliminar', formData)
        .then(res => {
          me.$vs.loading.close()
          me.getListadoDescuentos()
          me.$vs.notify({
          text:'Se elimino con exito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.menu = 0
          me.id   = 0
          me.actualizarValorVerificacion()
        })
        .catch((e) =>{
          me.$vs.loading.close()
        })
      }
    },
    actualizarValorVerificacion(){
      let me = this
      VerificacionRepository.actualizarValorVerificacion(me.VerificacionSelect.id).then( r => { } )
    },
    estadoMenu(gmenu){
      let me = this;
      localStorage.setItem('menuSelectDescuentos',gmenu)
      var divs = document.querySelectorAll(".btnMenuDescuentos");
      for (var i = 0; i < divs.length; i++) {
          divs[i].classList.remove("activeBtn");
      }
      const container = document.querySelector(".menuDescuento"+gmenu);
      container.classList.add("activeBtn");
    },
  }
}
</script>
<style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #000;
color:white;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
