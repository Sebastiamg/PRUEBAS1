<template>
  <div>
    <div class="mt-3">
      <div class="vx-row">
        <!--CONTADOR SELECCIONADO-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
          <div>
            <p class="text-success text-2xl font-bold">Total Descuento: <b>{{ filtrarDecimal(sumaSeleccionado) }}</b></p>
          </div>
        </div>
      </div>
      <div class="vx-row">
        <!--GUARDAR-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Palabra personalizada (Ejemplo: Descuento Cupón)" v-model="campoPersonalizado" />
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <span>Estado:</span>
              <ul class="flex mt-2">
                <li>
                  <vs-radio v-model="tipoPersonalizado" class="mr-2" vs-name="radios1tipoPersonalizado" vs-value="1">Activo</vs-radio>
                </li>
                <li>
                  <vs-radio v-model="tipoPersonalizado" vs-name="radios1tipoPersonalizado" vs-value="0">Desactivado</vs-radio>
                </li>
              </ul>
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <span>Restar de:</span>
              <ul class="flex mt-2">
                <li>
                  <vs-radio v-model="restar" class="mr-2" vs-name="radios1restar" vs-value="0">Comisión</vs-radio>
                </li>
                <li>
                  <vs-radio v-model="restar" vs-name="radios1restar" vs-value="1">Venta</vs-radio>
                </li>
              </ul>
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-button class="mr-3 mb-2" @click="guardarDescuento()">Guardar cambios</vs-button>
            </div>
          </div>
        </div>
        <!--PERSONALIZAR VARIOS CAMPOS-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2" v-if="tipo == 0">
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Detalle" v-model="global.detalle" />
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Cantidad" v-model="global.cantidad" />
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Porcentaje Descuento %" v-model="global.porcentaje" />
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-button class="mr-3 mb-2" :disabled="arregloSelect.length > 0 ? false : true" color="warning" @click="setearValoresGlobales()">Afectar a {{ arregloSelect.length }} campos seleccionados</vs-button>
            </div>
          </div>
        </div>
        <!--CREAR DESCUENTO POR LIBRO-->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2" v-if="tipo == 1">
          <div v-if="id == 0">
            <vs-alert color="warning"><p class="text-center">! Guarde primero para registrar libros con descuento</p></vs-alert>
          </div>
          <div v-else>
            <!--agregar libro-->
            <FormatoLibrosCrearVue
              :id="id"
              :datosInstitucion="datosInstitucion"
              :VerificacionSelect="VerificacionSelect"
              :DetalleVerificacion="DetalleVerificacion"
              :usuario="usuario"
              @changeReturn="changeReturn"
              />
          </div>
        </div>
      </div>
      <!--FIN CONFIGURACION PERSONALIZADO-->
      <vs-table max-items="10" v-if="id > 0 && setAction == 0" multiple v-model="arregloSelect" stripe search pagination :data="tmpArregloLibros">
        <template slot="header">
          <vs-chip>Cantidad {{ tmpArregloLibros.length }}</vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Libro</vs-th>
          <vs-th>Detalle (Obligatorio)</vs-th>
          <vs-th>Cantidad</vs-th>
          <vs-th>Val. Unitario</vs-th>
          <vs-th>Calculo</vs-th>
          <vs-th>Porcentaje Descuento %</vs-th>
          <vs-th>Total descontar</vs-th>
          <vs-th v-if="tipo == 1">Accciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{data[indextr].nombre_libro}}<br><br>
                  <b>Código libro:</b>
                  {{data[indextr].codigo_libro}}<br>
                  <b>Código liquidación:</b>
                  {{data[indextr].codigo}}<br>
                </vs-td>
                <vs-td>
                  <vs-input type="text" max="200" label-placeholder="Ingrese el detalle " v-model="tr.descripcion"/>
                </vs-td>
                <vs-td>
                  <vs-input type="number" min="0" @blur="setearValores()" label-placeholder="Ingrese la cantidad " v-model="tr.cantidad_descontar"/>
                </vs-td>
                <vs-td>
                  {{tr.precio}}
                </vs-td>
                <vs-td>
                  <ul class="leftx">
                    <li>
                      <vs-radio v-model="tr.tipo_calculo" @input="setearValores()" class="mr-2" :vs-name="'radio'+tr.detalle_id" vs-value="0">Solo porcentaje</vs-radio>
                    </li>
                    <li>
                      <vs-radio v-model="tr.tipo_calculo" @input="setearValores()" class="mt-1" :vs-name="'radio'+tr.detalle_id" vs-value="1">Porcentaje y resta</vs-radio>
                    </li>
                  </ul>
                </vs-td>
                <vs-td>
                  <vs-input type="number" min="0" @blur="setearValores()" label-placeholder="Ingrese el porcentaje " v-model="tr.porcentaje_descuento"/>
                </vs-td>
                <vs-td>
                  <vs-input disabled v-model="tr.total_descontar" />
                </vs-td>
                <vs-td v-if="tipo == 1">
                  <vs-button class="modal-default-button" size="small" color="danger" @click="descuentoBookSelect=tr;setAction=1;" type="filled" icon-pack="feather" icon="icon-x-square"> Eliminar</vs-button>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <!--CONFIRMAR ELIMINAR-->
      <div v-if="setAction == 1">
        <ConfirmEliminarVue @changeConfirm="changeConfirm"/>
      </div>
      <!--TABLA CONFIGURACION LIBRO-->
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VerificacionRepository from '@/repositories/VerificacionRepository'
const FormatoLibrosCrearVue  = () => import('./components/FormatoLibrosCrear.vue')
const ConfirmEliminarVue     = () => import('../../../../configuracion/Reutilizable/ConfirmEliminar.vue')
//Components
Vue.component("FormatoLibrosCrearVue", FormatoLibrosCrearVue);
Vue.component("ConfirmEliminarVue",    ConfirmEliminarVue);
export default{
  data(){
    return{
      arreglosLibros:[],
      tmpArregloLibros:[],
      arregloSelect:[],
      totalDescuento:0,
      campoPersonalizado:'',
      tipoPersonalizado:0,
      global:{
        detalle:'',
        cantidad:0,
        porcentaje:0
      },
      setAction:0,
      descuentoBookSelect:'',
      restar:'0',
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
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    id:{
      type: Number,
      default:0
    },
    descuentoSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    editar:{
      type:Number,
      default:0,
    },
    //tipo => 0 => descuento libro regalado; 1 => descuento a libro
    tipo:{
      type:Number,
      default:0,
    },
    DetalleVerificacion:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  computed:{
    sumaSeleccionado(){
      let me = this;
      if(me.tmpArregloLibros.length >0){
        let datos = me.tmpArregloLibros.filter(p => p.total_descontar)
        let total = datos.reduce((a, b) => a + parseFloat((b["total_descontar"] || 0)), 0);
        me.totalDescuento = total
        return total
      }
    },
  },
  mounted(){
    let me = this;
    //editar
    if(me.editar == 1){
      me.setEditar()
    }else{
      me.setAgregar()
    }
    me.getDescuentos()
  },
  methods:{
    filtrarDecimal(numero){
      let me = this
      if(numero == 0 || numero == undefined){
        return numero
      }else{
        const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return transformar
      }
    },
    changeReturn(){
      let me = this
      me.getDescuentos()
    },
    setEditar(){
      let me  = this
      me.campoPersonalizado = me.descuentoSelect.nombre_descuento
      me.tipoPersonalizado  = me.descuentoSelect.estado
      me.restar             = me.descuentoSelect.restar
    },
    setAgregar(){
      let me                = this
      me.campoPersonalizado =  ""
      me.tipoPersonalizado  =  0
      me.restar             = 0
    },
    setearValores(){
      let me = this
      me.tmpArregloLibros.map(p => {
        let prevalor = (p.cantidad_descontar * p.precio)
        //tipo_calculo => 0 => solo porcentaje; 1 => porcentaje y resta
        if(p.tipo_calculo == 0) {  p.total_descontar = (((p.cantidad_descontar * p.precio) * p.porcentaje_descuento) / 100).toFixed(2) }
        if(p.tipo_calculo == 1) {  p.total_descontar = ( prevalor - (((p.cantidad_descontar * p.precio) * p.porcentaje_descuento) / 100).toFixed(2) ) }
      })
    },
    setearValoresGlobales(){
      let me = this
      me.tmpArregloLibros.map(p => {
        var getverificacion_id = 0
        getverificacion_id = me.arregloSelect.filter(r => r.detalle_id == p.detalle_id)
        if(getverificacion_id.length > 0){
          p.descripcion           = me.global.detalle
          p.cantidad_descontar    = me.global.cantidad
          p.porcentaje_descuento  = me.global.porcentaje
        }
      })
      me.setearValores()
      me.arregloSelect            = []
    },
    getDescuentos(){
      let me = this;
      me.arreglosLibros   = []
      me.tmpArregloLibros = []
      me.arregloSelect    = []
      const { num_verificacion }                    = me.VerificacionSelect
      const { idInstitucion ,id_periodo, contrato } = me.datosInstitucion
      me.$vs.loading()
      this.$http.get(this.$server_url+`verificacionesDescuentos?getDescuentosVerificacion=yes&verificaciones_descuentos_id=${me.id}&contrato=${contrato}&periodo_id=${id_periodo}`)
        .then(function (res) {
          let datos      = res.data
          if(datos.length == 0){
            me.$vs.loading.close()
            return
          }
          //ordenar
          me.arreglosLibros = datos.sort(function(a, b) {
          var nombreA = a.nombre_libro.toLowerCase();
          var nombreB = b.nombre_libro.toLowerCase();
          var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
          var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
          nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
          nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
          if (nombreA < nombreB) {
              return -1;
          }
          if (nombreA > nombreB) {
              return 1;
          }
          if (numA && !numB) { // si a tiene número y b no, b va primero
              return 1;
          }
          if (!numA && numB) { // si b tiene número y a no, a va primero
              return -1;
          }
          if (numA && numB) { // si ambos tienen número, compararlos
              if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
              return -1;
              }
              if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
              return 1;
              }
              return numA - numB; // comparar los números directamente
          }
          return 0; // si son iguales en todo, no hay diferencia
          });
          me.tmpArregloLibros = me.arreglosLibros
          me.$vs.loading.close()
        })
      .catch(function (error) {
        me.$vs.loading.close()
      })
    },
    guardarDescuento(){
      let me = this;
      if((me.campoPersonalizado == "" || me.campoPersonalizado == null) && me.tipoPersonalizado == 1){
        me.$vs.notify({
        text:'El campo personalizado no puede quedar vacio',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
      }
      //setear valores nulos
      var setValores = []
      setValores = me.tmpArregloLibros.filter(p => p.total_descontar > 0)
      //validar que escribieron el detalle
      var validarDetalle = []
      validarDetalle    = setValores.filter(p => p.descripcion == null ||  p.descripcion == "" || p.descripcion == undefined)
      if(validarDetalle.length > 0){
        me.$vs.notify({
        text:'El campo detalle no puede quedar vacio de los valores que escribio',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
      }
      let formData = new FormData();
      formData.append('verificaciones_descuentos_id', me.id);
      formData.append('totalDescuento',               me.totalDescuento);
      formData.append('campoPersonalizado',           me.campoPersonalizado);
      formData.append('user_created',                 me.usuario.idusuario);
      formData.append('data_detalle',                 JSON.stringify(me.tmpArregloLibros))
      formData.append('personalizado',                me.tipoPersonalizado)
      formData.append('tipo',                         me.tipo)
      formData.append('restar',                       me.restar)
      me.$vs.loading()
      this.$http.post(this.$server_url+'saveDescuentosVerificacion', formData)
      .then(res => {
        me.$vs.loading.close()
        me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'
        })
        VerificacionRepository.actualizarValorVerificacion(me.VerificacionSelect.id).then( r => { } )
        let datos = {
          save:1,
          tipo:6,
          sendValor:me.tipoPersonalizado,
          sendtotalDescuento:me.totalDescuento,
          sendcampoPersonalizado:me.campoPersonalizado
        }
        me.$emit('changeReturnPersonalizado',datos)
      })
      .catch((e) => {
          me.$vs.loading.close()
      })
    },
    changeConfirm(e){
      let me = this
      if(e == 0) { me.setAction = 0 }
      else{ me.eliminaRegistroLibro() }
    },
    eliminaRegistroLibro(){
      let me = this;
      let formData = new FormData();
      formData.append('eliminarRegistroLibro',        'yes');
      formData.append('id',                           me.descuentoBookSelect.detalle_id);
      formData.append('verificaciones_descuentos_id', me.descuentoBookSelect.verificaciones_descuentos_id)
      this.$http.post(this.$server_url+'descuentosEliminar', formData)
      .then(res => {
      me.$vs.notify({
        text:'Se eliminado con exito',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
      me.setAction = 0
      me.getDescuentos()
      VerificacionRepository.actualizarValorVerificacion(me.VerificacionSelect.id).then( r => { } )
    },
  }
}
</script>
<style scoped>
.boton1 {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  width: 250px;
  padding: 12px;
  display: flex;
  background: #509AF8;
  border-radius: 8px;
  box-shadow: 0px 0px 5px -3px #111;
}
.info__icon {
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-right: 2px;
}

.info__icon path {
  fill: #fff;
}

.info__title {
  font-weight: 500;
  font-size: 14px;
  color: #fff;
}

.info__close {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: auto;
}

.info__close path {
  fill: #fff;
}
/***//**BOTON SELECCIONADO */
/* CSS */
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}
</style>
