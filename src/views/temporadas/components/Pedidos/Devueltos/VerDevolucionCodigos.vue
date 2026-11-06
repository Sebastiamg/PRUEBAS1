<template>
  <div>
    <b>Libro: {{ objetoProducto.nombre_libro }}</b>
    <div>
      <div v-if="menu == 0">
        <!--MENU-->
        <div class="">
         <nav class="breadcrumbs mt-3">
          <span class="breadcrumbs__item btnMenu activeBtnCodigos menuCodigos0 cursor-pointer" @click="accion = 0;estadoMenu();CodigoSelect = [];filtroTipo = 100;filtroCodigos();">Quitar códigos del reporte</span>
          <span class="breadcrumbs__item btnMenu menuCodigos1 cursor-pointer"                  @click="accion = 1;estadoMenu();CodigoSelect = [];filtroTipo = 0;filtroCodigos();">Cambiar estado de libros</span>
          <span class="breadcrumbs__item btnMenu menuCodigos2 cursor-pointer"                  @click="accion = 2;estadoMenu();CodigoSelect = [];filtroTipo = 2;filtroCodigos();">Cambiar porcentaje de codigos regalados</span>
        </nav>
        </div>
        <!--ACCIONES QUITAR CODIGOS-->
        <div class="flex justify-center mt-5" v-if="accion == 0">
          <vs-button color="danger" v-if="CodigoSelect.length > 0" @click="menu = 1;" type="border" icon-pack="feather" icon="icon-alert-triangle">Quitar <b>{{ CodigoSelect.length }} códigos</b>  de verificación</vs-button>
        </div>
        <!--ACCIONES PARA CAMBIAR DE ESTADO DE LIBROS-->
        <div v-if="accion == 1">
          <div>
            <ul class="flex mt-5">
              <li class="mr-3">
                Filtrar por:
              </li>
              <li class="mr-3">
                <vs-radio v-model="filtroTipo" @input="CodigoSelect=[];filtroCodigos();" vs-name="radios1filtroTipo" vs-value="0"><b>{{ SumarCodigosNormales }}</b> Liquidados Normales </vs-radio>
              </li>
              <li class="mr-2">
                <vs-radio v-model="filtroTipo" @input="CodigoSelect=[];filtroCodigos();" vs-name="radios1filtroTipo" vs-value="2"><b>{{ SumarCodigosRegalados }}</b> Regalados Liquidados </vs-radio>
              </li>
            </ul>
          </div>
          <div class="flex justify-center mt-3">
            <vs-button color="danger" v-if="CodigoSelect.length > 0" @click="menu = 1;" type="border" icon-pack="feather" icon="icon-edit">Cambiar {{ filtroTipo == 0 ? 'a códigos regalados: ' : 'a códigos Normales: ' }} <b>{{ CodigoSelect.length }} códigos</b></vs-button>
          </div>
        </div>
        <!--ACCION CAMBIAR PORCENTAJE CODIGOS REGALADOS-->
        <div v-if="accion == 2">
          <div v-if="CodigoSelect.length > 0">
            <br>
            <p class="text-center font-medium">Aplicar porcentaje a los regalados a <b>{{ CodigoSelect.length }}</b> códigos seleccionados:</p>
            <ul class="flex mt-4">
              <li>
                <vs-radio v-model="porcentaje_personalizado_regalado" vs-name="radios1p" vs-value="0">Porcentaje del documento de venta</vs-radio>
              </li>
              <li>
                <vs-radio v-model="porcentaje_personalizado_regalado" vs-name="radios1p" vs-value="1">Porcentaje del 100%</vs-radio>
              </li>
              <li>
                <vs-radio v-model="porcentaje_personalizado_regalado" vs-name="radios1p" vs-value="2">Porcentaje {{ sendPedido.descuento }}% de la escuela</vs-radio>
              </li>
            </ul>
            <div class="flex justify-center mt-4">
              <vs-button color="success" type="border" @click="menu = 1;" class="mt-4 w-full"><i class="fa-solid fa-percent"></i> Aplicar porcentaje</vs-button>
            </div>
          </div>
        </div>
        <vs-button color="success" @click="exportar();" class="mt-4">Exportar</vs-button>
         <!--TABLA-->
        <vs-table max-items="10" striped class="mt-2" search pagination :data="tmpCodigos" multiple v-model="CodigoSelect">
          <template slot="header">
              <vs-chip  color="primary">Codigo: <b> {{ tmpCodigos.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Código</vs-th>
              <vs-th>Datos</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    {{data[indextr].codigo}}<br>
                    <small v-if="tr.venta_estado == 1" class="font-semibold">Venta directa</small>
                    <small v-if="tr.venta_estado == 2" class="font-semibold">Venta lista</small>
                    <br><br>
                    <vs-chip color="danger" v-if="tr.estado_liquidacion == 0" class="font-semibold">Liquidado</vs-chip>
                    <vs-chip color="warning" v-if="tr.estado_liquidacion == 2" class="font-semibold">Regalado</vs-chip>
                  </vs-td>
                  <vs-td>
                    <b>Factura:</b>
                    <p v-if="tr.factura && tr.factura != 'null'">{{ tr.factura }}</p>
                    <p v-else>No tiene factura</p>
                    <b>Documento de venta:</b>
                    <p>{{  tr.codigo_proforma || 'No tiene Documento de venta' }}</p>
                    <div v-if="tr.estado_liquidacion == 2">
                      <b>Descuento porcentaje:</b>
                      <p v-if="tr.porcentaje_personalizado_regalado == 0">Porcentaje del {{ tr.descuento }}% del documento de venta</p>
                      <p v-if="tr.porcentaje_personalizado_regalado == 1">Porcentaje del 100%</p>
                      <p v-if="tr.porcentaje_personalizado_regalado == 2">Porcentaje de la escuela {{ sendPedido.descuento }} %</p>
                    </div>
                    <div v-if="tr.combo">
                      <b>Combo:</b>
                      <p>{{ tr.combo }}</p>
                    </div>
                    <div v-if="tr.codigo_combo">
                      <b>Combo:</b>
                      <p>{{ tr.codigo_combo }}</p>
                    </div>
                    <div v-if="tr.codigo_paquete">
                      <b>Paquete:</b>
                      <p>{{ tr.codigo_paquete }}</p>
                    </div>
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
      <div v-if="menu == 1">
        <small>Escriba una observación (Obligatorio)</small>
        <vs-input icon="icon-message-square" class="w-full mt-5" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
        <p class="mt-4"></p>
        <!--ACCION CAMBIAR PORCENTAJE CODIGOS REGALADOS-->
        <div v-if="accion == 2">
          <p class="text-center font-medium">Aplicar porcentaje a los regalados a <b>{{ CodigoSelect.length }}</b> código seleccionados:</p>
          <br>
          <ConfirmEliminarVue v-if="porcentaje_personalizado_regalado == 0" class="mt-5" @changeConfirm="f_confirmCambiarPorcentaje" otroValor="1" :title="'Estás seguro de cambiar el porcentaje al de documento de venta de '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo cambiar el porcentaje"/>
          <ConfirmEliminarVue v-if="porcentaje_personalizado_regalado == 1" class="mt-5" @changeConfirm="f_confirmCambiarPorcentaje" otroValor="1" :title="'Estás seguro de cambiar el porcentaje al 100% de '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo cambiar el porcentaje"/>
          <ConfirmEliminarVue v-if="porcentaje_personalizado_regalado == 2" class="mt-5" @changeConfirm="f_confirmCambiarPorcentaje" otroValor="1" :title="'Estás seguro de cambiar el porcentaje al % de la escuela de '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo cambiar el porcentaje"/>
        </div>
        <div v-else>
          <!--100 => codigos a devolver; 0 => cambiar a codigos normales; 1 => cambiar a codigos liquidados-->
          <ConfirmEliminarVue v-if="filtroTipo == 100" class="mt-5" @changeConfirm="eliminarCodigo" otroValor="1" :title="'Estás seguro de quitar '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo quitar"/>
          <ConfirmEliminarVue v-if="filtroTipo == 0" class="mt-5" @changeConfirm="eliminarCodigo" otroValor="1" :title="'Estás seguro de cambiar a codigos regalados '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo cambiar a regalados"/>
          <ConfirmEliminarVue v-if="filtroTipo == 2" class="mt-5" @changeConfirm="eliminarCodigo" otroValor="1" :title="'Estás seguro de cambiar a codigos normales '+CodigoSelect.length + ' códigos ?'" subtitle="Si, deseo cambiar a códigos normales"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Codigosmix from "@/mixins/Codigosmix";
const ConfirmEliminarVue = () => import('../../../../configuracion/Reutilizable/ConfirmEliminar.vue')
export default {
  mixins: [Codigosmix],
  components:{
    ConfirmEliminarVue
  },
  data() {
    return{
      ObjectSelected:'',
      menu:0,
      observacion:'',
      usuario:[],
      CodigoSelect:[],
      colorx: '#8B0000',
      accion:0,
      filtroLibro:'',
      filtroTipo:100,
      tmpCodigos:[],
      objetoProducto:'',
      porcentaje_personalizado_regalado:0,
    }
  },
  props:{
    ArregloVerCodigos:{
      type:Array,
      default:function(){
        return []
      }
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    me.objetoProducto = JSON.parse(localStorage.getItem('objetoProducto'))
  },
  watch:{
    ArregloVerCodigos(results){
      let me = this
      me.tmpCodigos = results
      me.filtroCodigos()
      me.estadoMenu()
    }
  },
  mounted(){
    let me = this
    me.tmpCodigos = me.ArregloVerCodigos
  },
  computed:{
    SumarCodigosNormales(){
      let me = this
      let datos = me.ArregloVerCodigos.filter(p => p.estado_liquidacion == 0)
      return datos.length
    },
    SumarCodigosRegalados(){
      let me = this
      let datos = me.ArregloVerCodigos.filter(p => p.estado_liquidacion == 2)
      return datos.length
    }
  },
  methods:{
    filtroCodigos(){
      let me = this
      me.tmpCodigos = []
      //todo
      if(me.filtroTipo == 100) { me.tmpCodigos = me.ArregloVerCodigos; return; }
      //filtro 0=>liquidados ; 2 => regalados
      me.tmpCodigos = me.ArregloVerCodigos.filter(p => p.estado_liquidacion == me.filtroTipo)
    },
    eliminarCodigo(valor){
      let me = this
      if(valor == 0) { this.menu = 0; return }
      me.MandarToLiquidadoDevuelto()
    },
    MandarToLiquidadoDevuelto(){
      let me = this
      if(me.observacion == '' || me.observacion == null || me.observacion == undefined){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Ingrese un comentario.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.observacion.length < 5){
        me.$vs.loading.close()
        me.$vs.notify({ text:'El comentario debe tener al menos 5 caracteres.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.filtroLibro                                = me.CodigoSelect[0]
      let mensaje                                   = ""
      if(me.filtroTipo == 100)                      { mensaje = "Devolucion Liquidacion_"; }
      if(me.filtroTipo == 0)                        { mensaje = "Cambiaron a códigos regalados_"; }
      if(me.filtroTipo == 2)                        { mensaje = "Cambiaron a códigos normales_"; }
      let formData = new FormData()
      formData.append('arrayCodigos',               JSON.stringify(me.CodigoSelect))
      formData.append('observacion',                mensaje+me.observacion)
      formData.append('id_usuario',                 me.usuario.idusuario)
      formData.append('periodo_id',                 me.sendPedido.id_periodo)
      formData.append('institucion_id',             me.sendPedido.id_institucion)
      formData.append('filtroTipo',                 me.filtroTipo)
      if(me.filtroTipo == 2 || me.filtroTipo == 0) { formData.append('cambiarEstadoCodigos', 1) }
      else                                         { formData.append('mandarDevueltoRegalado', 1) }
      me.$http.post(me.$server_url+'procesosFacturador', formData)
      .then(function (res) {
        let titleMensaje = ""
        if(me.filtroTipo == 100) { titleMensaje = `Se han quitado ${res.data.cambiados} códigos de verificación`; }
        if(me.filtroTipo == 0)   { titleMensaje = `Se han cambiado a códigos regalados ${res.data.cambiados} códigos de verificación`; }
        if(me.filtroTipo == 2)   { titleMensaje = `Se han cambiado a códigos normales ${res.data.cambiados} códigos de verificación`; }
        me.$vs.notify({
          text: titleMensaje,
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.menu         = 0
        me.CodigoSelect = []
        me.tmpCodigos   = []
        me.observacion  = ''
        me.$emit('changeHandleDevolucion', me.filtroLibro)
      })
      .catch(function (error) {
        me.$vs.notify({
          text: 'Error al quitar códigos de verificación',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      })
    },
    f_confirmCambiarPorcentaje(valor){
      let me = this;
      if(valor == 0) { this.menu = 0; return }
      me.f_cambiarPorcentajeCodigoRegalado()
    },
    f_cambiarPorcentajeCodigoRegalado(){
      let me = this;
      if(me.observacion == '' || me.observacion == null || me.observacion == undefined){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Ingrese un comentario.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.observacion.length < 5){
        me.$vs.loading.close()
        me.$vs.notify({ text:'El comentario debe tener al menos 5 caracteres.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.filtroLibro                                = me.CodigoSelect[0]
      let mensaje                                   = ""
      if(me.porcentaje_personalizado_regalado == 0) { mensaje = "Cambio a Porcentaje del documento de venta_"; }
      if(me.porcentaje_personalizado_regalado == 1) { mensaje = "Cambio a Porcentaje del 100_"; }
      if(me.porcentaje_personalizado_regalado == 2) { mensaje = "Cambio a Porcentaje del de la escuela_"; }
      let formData = new FormData()
      formData.append('cambiarPorcentajeCodigoRegalado', 1)
      formData.append('arrayCodigos',               JSON.stringify(me.CodigoSelect))
      formData.append('observacion',                mensaje+me.observacion)
      formData.append('id_usuario',                 me.usuario.idusuario)
      formData.append('periodo_id',                 me.sendPedido.id_periodo)
      formData.append('institucion_id',             me.sendPedido.id_institucion)
      formData.append('porcentaje_personalizado_regalado', me.porcentaje_personalizado_regalado)

      me.$http.post(me.$server_url+'procesosFacturador', formData)
      .then(function (res) {
        let titleMensaje = ""
        if(me.porcentaje_personalizado_regalado == 0) { titleMensaje = `Se cambiaron los porcentajes del documento de venta de ${res.data.cambiados} códigos`; }
        if(me.porcentaje_personalizado_regalado == 1) { titleMensaje = `Se cambiaron los porcentajes del 100% de ${res.data.cambiados} códigos`; }
        if(me.porcentaje_personalizado_regalado == 2) { titleMensaje = `Se cambiaron los porcentajes de la escuela de ${res.data.cambiados} códigos`; }
        // mensaje notification
        me.$vs.notify({
          text: titleMensaje,
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.menu         = 0
        me.CodigoSelect = []
        me.tmpCodigos   = []
        me.observacion  = ''
        me.$emit('changeHandleDevolucion', true)
      })
      .catch(error => {
        if (error.response && error.response.status === 422 && error.response.data.errors) {
          // Unir todos los mensajes en un solo string
          const allErrors = Object.values(error.response.data.errors)
            .flat()
            .join('\n');

          this.$vs.notify({
            text: allErrors,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });

        } else {
          this.$vs.notify({
            text: 'Error al quitar códigos de verificación',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
        }
      });
    },
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelectCodigosQuitar',me.accion)
      var divs = document.querySelectorAll(".btnMenu");
      for (var i = 0; i < divs.length; i++) {
          divs[i].classList.remove("activeBtnCodigos");
      }
      const container = document.querySelector(".menuCodigos"+me.accion);
      container.classList.add("activeBtnCodigos");
    },
    exportar() {
      let me = this;

      // Copia profunda de tmpCodigos
      let codeExport = JSON.parse(JSON.stringify(me.tmpCodigos)).map(item => {
        return {
          codigo: item.codigo,
          factura: item.factura,
          precio:me.objetoProducto.precio,
          tipoVenta: item.venta_estado === 1 ? 'Venta directa' : 'Venta lista',
          estadoLiquidacion: item.estado_liquidacion == 0
            ? 'Liquidado'
            : item.estado_liquidacion == 2
            ? 'Regalado'
            : ''
        };
      });
      let nameFile = 'Reporte_'+me.objetoProducto.nombre_libro
      let headers = ['Código','Tipo venta','Estado de liquidacion','Factura','Precio'];
      let fieldKeys = ['codigo','tipoVenta','estadoLiquidacion','factura','precio'];
      me.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
    },
  },
}
</script>
<style scoped>
  /*MENU*/
  .activeBtnCodigos{
    background-color: #8be9ba;
    color: #126e46!important;
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
color:rgb(31, 179, 95);
font-weight: bold;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #edf1f5;
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
