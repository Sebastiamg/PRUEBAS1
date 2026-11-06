<template>
  <div>
    <div>
      <vs-table stripe :data="arregloPagos" class="mt-3" max-items="5" search pagination>
        <template slot="header">
          <div class="flex">
              <vs-chip>Cantidad: {{ arregloPagos.length }}</vs-chip>
          </div>
          <br>
        </template>
        <template slot="thead">
            <vs-th width="35%">Documento</vs-th>
            <vs-th width="15%">Contrato</vs-th>
            <vs-th width="30%">Detalle</vs-th>
            <vs-th width="30%">Acción</vs-th>
        </template>
        <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-td>#{{ tr.doc_codigo }}</vs-td>
              <div class="flex" v-if="tr.ifAntAprobado == 0">
                <p class="justify-center"><vs-alert v-if="tr.estado == 0" color="danger">⚠️ Pendiente de cerrar</vs-alert></p>
                <p class=""><vs-chip v-if="tr.estado == 1 && (!tr.cantidad_detalles_abiertos || tr.cantidad_detalles_abiertos == 0)" color="success">Aprobado</vs-chip></p>
                <p class=""><vs-chip v-if="tr.estado == 1 && tr.cantidad_detalles_abiertos > 0" color="warning">Pendiente cerrar pagos</vs-chip></p>
                <p class=""><vs-chip v-if="tr.estado == 2" color="danger">Anulado</vs-chip></p>
              </div>
              <div class="flex" v-if="tr.ifAntAprobado == 1">
                 <p class="justify-center"><vs-alert v-if="tr.estado == 0" color="danger">⚠️ Pendiente de cerrar</vs-alert></p>
                 <p class=""><vs-chip v-if="tr.estado == 1 && tr.cantidad_detalles_abiertos > 0" color="warning">Pendiente cerrar pagos</vs-chip></p>
              </div>
              <div :class="sendPedido.ifagregado_anticipo_aprobado == 0 || sendPedido.ifagregado_anticipo_aprobado == 2  ?  'mt-2 bg-warning' :  'mt-2 bg-success'" v-if="tr.ifAntAprobado == 1"  style="color:white;padding:5px;border-radius: 10px;">
                <p class="font-bold mt-2">Anticipo Pedido:</p>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 0">Sin aprobar</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 1 && sendPedido.anticipo_aprobado > 0">Anticipo aprobado por admin facturador</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 2" class="font-bold">!Anticipo solicitado a gerencia ${{ sendPedido.anticipo_solicitud_for_gerencia }}</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 3"><b>ANTICIPO APROBADO POR GERENCIA <span class="text-success">$ {{ sendPedido.anticipo_aprobado_gerencia }}</span></b></small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 4" class="text-danger">Anticipo solicitado: rechazado</small>
                <small v-if="sendPedido.ifagregado_anticipo_aprobado == 5" class="text-success">Gerencia aprueba anticipo sugerido</small>
              </div>
              <p  class="mt-3" style="font-weight:bold;">Doc valor:  <span  class="text-success font-bold">{{ data[indextr].doc_valor | filtrarDecimal }}</span></p>
              <p style="font-weight:bold;">Tipo de pago:</p>
              <span>{{ tr.tipo_pagos.nombre }} <b v-if="tr.mostrar_reporte == 1" class="text-warning"> (Se muestra en el reporte )</b></span>
              <p style="font-weight:bold;">Forma de pago:</p>
              <p>{{ tr.forma_pagos.tip_pag_nombre }}</p>
              <div v-if="tr.unicoEvidencia == 0 && tr.tipo_pago_id!=4">
                <p style="font-weight:bold;" >Doc. Número:</p>
                <span>{{ data[indextr].doc_numero }}</span>
              </div>
              <p style="font-weight:bold;" v-if="tr.doc_nombre">Doc. Nombre:</p>
              <span v-if="tr.doc_nombre">{{ data[indextr].doc_nombre }}</span>
              <p style="font-weight:bold;" v-if="tr.doc_nombre">Doc. Apellidos:</p>
              <span v-if="tr.doc_nombre">{{ data[indextr].doc_apellidos }}</span>
              <!-- <p style="font-weight:bold;">Doc. Ci:</p>
              <span>{{ data[indextr].doc_ci }}</span> -->
              <!-- <p style="font-weight:bold;" v-if="tr.tipo_pago_id!=4">Doc. Institución:</p>
              <span v-if="tr.tipo_pago_id!=4">{{ data[indextr].doc_institucion }}</span> -->
              <!-- <p v-if="tr.tipo_pago_id!=4" style="font-weight:bold;">Doc. Tipo:</p>
              <span v-if="tr.tipo_pago_id!=4">{{ data[indextr].doc_tipo }}</span> -->
              <p style="font-weight:bold;">Doc. Fecha:</p>
              <span>{{ data[indextr].doc_fecha }}</span>
              <!-- <div v-if="tr.unicoEvidencia == 0 && tr.tipo_pago_id!=4">
                <p v-if="!tr.archivo">
                  <b class="text-danger"> Solicitud de evidencias: No subida </b>
                  </p>
                  <p v-else class="imagen" @click="openDocument(tr)">
                      <b> Evidencia:
                          <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                          <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                      </b>
                  </p>
              </div> -->
          </vs-td>
          <vs-td>
            <b>Observación:</b>
            <p> {{ tr.doc_observacion }}</p>
            <b>Contrato:</b>
            {{ tr.ven_codigo }}
            <!-- <div v-if="tr.pedido_pagos_hijo.length">
              <vs-collapse accordion >
                <vs-collapse-item  style="position:relative;left:-50px;">
                  <div slot="header">
                    <p class="font-bold"> Ver varias Evidencias </p>
                  </div>
                  <vs-row>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
                      <vs-card>
                        <div class="header">
                          <p style="font-weight: bold;">Varias Documentos </p>
                          <table class="tabla">
                              <tr>
                                <th class="th1">Valor</th>
                                <th class="th1">Num. Documento</th>
                                <th class="th1">Evidencia</th>
                              </tr>
                              <tr v-for="(item,key) in tr.pedido_pagos_hijo" :key="key">
                                <td class="td1">{{  item.valor }}</td>
                                <td class="td1">{{ item.codigo }}</td>
                                <td class="td1">
                                  <p v-if="!item.archivo">
                                    <b class="text-danger"> Solicitud de evidencias: No subida </b>
                                    </p>
                                    <p v-else class="imagen" @click="openDocument(item)">
                                        <b> Evidencia:
                                            <ion-icon v-if="item.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                            <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                                        </b>
                                    </p>
                                </td>
                              </tr>
                          </table>
                        </div>
                      </vs-card>
                    </vs-col>
                  </vs-row>
                </vs-collapse-item>
                </vs-collapse>
            </div> -->
          </vs-td>
          <vs-td>
            <div v-if="tr.detalle_pago.length > 0">
              <!-- <div v-if="tr.tipo_pago_id == 4">
                <p class="text-danger">Estos detalles de pagos de tipo <b>convenio</b> no serán tomados en cuenta en el reporte solo los del módulo <b>Configuracion Convenios</b> boton <b>Detalle pagos</b></p>
              </div> -->
              <p class="text-center"><b>Detalles de pago:</b></p>
              <div class="mt-2">
                <p><span class="font-medium">Total detalles cerrados: </span> <span class="text-success font-bold">{{ tr.totalDetallePago }}</span></p>

                <!-- Alerta cuando el total de detalles excede el valor del documento -->
                <div v-if="tr.totalDetallePago > tr.doc_valor && tr.tipo_pago_id !=4" class="alert-box alert-box--danger">
                  <span class="alert-box__icon">⚠️</span>
                  <span class="alert-box__text">El monto pagado excede el valor de lo registrado</span>
                </div>

                <!-- Alerta cuando el total de detalles es menor al valor del documento -->
                <div v-if="tr.totalDetallePago < tr.doc_valor" class="alert-box alert-box--warning">
                  <span class="alert-box__icon">ℹ️</span>
                  <span class="alert-box__text">Aún falta completar el pago para igualar el valor registrado</span>
                </div>

                <!-- Información de detalles abiertos -->
                <!-- <div v-if="tr.cantidad_detalles_abiertos > 0" class="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                  <b class="text-primary">Pendiente cerrar pagos:</b>
                  <p>{{ tr.cantidad_detalles_abiertos }} {{ tr.cantidad_detalles_abiertos == 1 ? 'detalle' : 'detalles' }}</p>
                </div> -->

                <!-- Alertas de validación -->
                <!-- <p class="text-danger mt-2" v-if="tr.totalDetallePago > tr.doc_valor">
                  <i class="fa-solid fa-triangle-exclamation"></i> Está superando el valor principal
                </p> -->
                <!-- <p class="text-danger mt-2" v-if="tr.totalDetallePago < tr.doc_valor">
                  <i class="fa-solid fa-triangle-exclamation"></i> Es menor que el valor principal
                </p> -->
              </div>
              <div class="overflow-y-auto h-40 bg-white border rounded p-4 shadow-sm mt-3">
                <ul v-for="(item, key) in tr.detalle_pago" :key="key" class="mb-3 last:mb-0 border-b pb-2 last:border-b-0">
                  <li><span class="font-semibold text-gray-700">Total:</span> <span class="text-gray-900"> {{ item.total }}</span></li>
                  <li><span class="font-semibold text-gray-700">Descripción:</span> <span class="text-gray-900"> {{ item.descripcion }}</span></li>
                  <li v-if="item.estado">
                    <span class="font-semibold text-gray-700">Estado:</span>
                    <span :class="item.estado == 1 ? 'text-success' : 'text-danger'">
                      {{ item.estado == 1 ? 'Cerrado' : 'Abierto' }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else-if="tr.estado == 1">
              <!-- <p class="text-center"><vs-chip color="success">Aprobado</vs-chip></p> -->
              <p class="text-center mt-2 text-gray-600">No hay detalles de pagos</p>
            </div>
          </vs-td>
          <vs-td align="center">
            <!-- Solo mostrar botones de acción si el estado es Activo (1) -->
            <vs-dropdown vs-custom-content vs-trigger-click v-if="Number(estadoPagos) === 1 && (userAdminFacturador || userRoot || (userFacturador && tr.estado == 0) && tr.tipo_pago_id!=4)">
              <vs-button class="a-icons" href.prevent icon="more_vert" type="border" v-if="tr.tipo_pago_id!=4"></vs-button>
              <vs-dropdown-menu style="width: 320px;" class="cursor">

                <!--ABIERTO-->
                <!-- <div v-if="tr.estado == 0"> -->
                <div>
                  <!--Ver Detalles de Pago-->
                  <vs-dropdown-item>
                    <vs-button color="primary" type="line" @click="abrirDetallesPago(tr)" icon-pack="feather" icon="icon-list" class="w-full">📋 Ver Detalles de Pago</vs-button>
                  </vs-dropdown-item>
                  <!--Aprobar anticipo solicitado-->
                  <vs-dropdown-item v-if="(userAdminFacturador || userRoot) && tr.ifAntAprobado == 1">
                    <vs-button color="primary" type="line" @click="id=tr.doc_codigo;ObjectSelect=tr;popupConfirmAnticipoAprobado=true;" icon-pack="feather" icon="icon-info" class="w-full">{{ sendPedido.ifagregado_anticipo_aprobado == 0 ? 'Aprobar Anticipo solicitado' : 'Cambiar Anticipo solicitado' }} </vs-button>
                  </vs-dropdown-item>
                  <vs-dropdown-item v-if="tr.estado == 0">
                    <vs-button color="success" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago(tr);" type="line" icon-pack="feather" icon="icon-check"  class="w-full" >Cerrar Pago</vs-button>
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    <vs-button color="warning" type="line" @click="id=tr.doc_codigo;ObjectSelect=tr;$emit('showCreate',1,tr);" icon-pack="feather" icon="icon-edit"  class="w-full" >Editar Pago</vs-button>
                  </vs-dropdown-item>
                    <!--Eliminar Pago-->
                  <vs-dropdown-item v-if="tr.estado == 0 || groupFacturador">
                    <vs-button color="danger"  type="line" icon-pack="feather" icon="icon-x" class="w-full" @click="ObjectSelect=tr;openConfirmEliminarPago(tr)">Eliminar Pago</vs-button>
                  </vs-dropdown-item>
                </div>
                <!--CERRADO-->
                <!--Reabrir pago-->
                <!-- <div v-if="tr.estado == 1">
                  <vs-dropdown-item>
                    <vs-button color="primary" v-if="userAdminFacturador || userRoot"  icon-pack="feather" icon="icon-settings" type="line" class="w-full"  @click="ObjectSelect=tr;confirmReAbriPago(tr)">Reabrir Pago</vs-button>
                  </vs-dropdown-item>
                </div> -->

              </vs-dropdown-menu>
            </vs-dropdown>

            <!-- Mensaje informativo para pagos inactivos -->
            <!-- <div v-if="Number(estadoPagos) === 2" class="text-center text-gray-500 italic">
              <p class="font-bold text-danger">Pago Eliminado</p>
            </div> -->

            <p class="mt-3"></p>
            <div v-if="tr.fecha_cierre">
              <b>Fecha último cierre:</b>
              <p>{{ tr.fecha_cierre }}</p>
            </div>
            <div v-if="tr.user_cierre">
              <b>Responsable cierre:</b>
              <p>{{ tr.user_cierre.nombres }} {{ tr.user_cierre.apellidos}}</p>
            </div>

            <!-- Mostrar información de eliminación para pagos inactivos -->
            <div v-if="Number(estadoPagos) === 2">
              <div v-if="tr.fecha_eliminar" class="mt-2">
                <b class="text-danger">Fecha eliminación:</b>
                <p>{{ tr.fecha_eliminar }}</p>
              </div>
              <div v-if="tr.user_eliminar" class="mt-2">
                <b class="text-danger">Eliminado por:</b>
                <p>{{ tr.user_eliminar.nombres }} {{ tr.user_eliminar.apellidos}}</p>
              </div>
            </div>
          </vs-td>
        </vs-tr>
        </template>
      </vs-table>
    </div>
    <!---MODALES-->
    <!--MODAL PARA APROBAR EL ANTICIPO APROBADO-->
    <vs-popup classContent="popup-example" title="Aprobar Anticipo del pedido" :active.sync="popupConfirmAnticipoAprobado">
      <AprobarAnticipoAprobadoVue v-if="popupConfirmAnticipoAprobado" :sendPedido="sendPedido" :usuario="usuario" :userRoot="Boolean(userRoot)" @changeHandle="changeHandle"/>
    </vs-popup>

    <!--MODAL PARA VER DETALLES DE PAGO-->
    <vs-popup
      fullscreen
      :title="'Detalles de Pago '+sendPedido.contrato_generado "
      :active.sync="popupDetallesPago"
      classContent="popupDetallesPagoListado"
      class="informacionformhijo"
    >
      <div v-if="popupDetallesPago && id_pago_detalle > 0">
        <Pagos2DetallesPagoVue :id_pago="Number(id_pago_detalle)" @actualizarListadoPagos="actualizarListadoPagos" />
      </div>
    </vs-popup>
  </div>
</template>
<script>
import axios from 'axios'
const AprobarAnticipoAprobadoVue = () => import('./components/AprobarAnticipoAprobado.vue')
const Pagos2DetallesPagoVue      = () => import('./components/Pagos2DetallesPago.vue')
import {
    mapState
} from "vuex";
export default {
  components:{
    AprobarAnticipoAprobadoVue,
    Pagos2DetallesPagoVue,
  },
  data() {
    return{
      ObjectSelect:'',
      popupConfirmAnticipoAprobado:false,
      popupDetallesPago:false,
      id_pago_detalle:0,
    }
  },
  // inject: ['getSendPedido'],
  // computed: {
  //   sendPedido(){ return this.getSendPedido(); }
  // },
  computed: {
    ...mapState(['userRoot', 'userAsesor', 'userFacturador', 'userAdminFacturador','groupFacturador']),
  },
  props:{
    arregloPagos:{
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
    usuario:{
      type:Object,
      default:function(){
        return{}
      }
    },
    estadoPagos:{
      type:Number,
      default:1
    }
  },
  watch:{
    arregloPagos(results){
      this.arregloPagos = results
    },
    sendPedido(results){
      this.sendPedido = results
    },
    estadoPagos(newVal){
      console.log('Estado pagos cambió a:', newVal)
    }
  },
  mounted(){
    let me  = this
  },
  methods:{
    rechargePedido(e){
      let me = this
      me.$emit('rechargePedido',e)
    },
    changeHandle(e){
      let me = this
      if(e == 0) { me.popupConfirmAnticipoAprobado = false; }
      if(e == 1) { me.popupConfirmAnticipoAprobado = false; me.rechargePedido();   me.$emit('rechargeValores',true) }
    },
    openDocument(tr){
      let me = this;
      let ruta = me.$data_url+'archivos/pedidos/pagos/'+tr.url
      window.open(ruta,'_blank')
    },
    openConfirmAprobarPago(tr){
      let me = this;
      //si es anticipo del pedido verificar que este aprobado por el facturador
      if(tr.ifAntAprobado == 1){
        if(me.sendPedido.ifagregado_anticipo_aprobado == 0){
          me.$vs.notify({
            text: 'El anticipo del pedido no esta aprobado por el facturador No puede cerrar el pago',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time:6000,
          })
          return
        }
      }
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirmar`,
        acceptText:'Si, deseo aprobar el pago',
        cancelText:'Cancelar',
        text: 'Estás seguro de aprobar el pago?',
        accept:this.aprobarPago
      })
    },
    aprobarPago(){
      let me = this;
      let formData = new FormData();
      formData.append('aprobarPagoVerificacion',  'yes')
      formData.append('doc_codigo',               me.ObjectSelect.doc_codigo);
      formData.append('contrato',                 me.sendPedido.contrato_generado)
      formData.append('user_created',             me.usuario.idusuario);
      formData.append('periodo_id',               me.sendPedido.id_periodo)
      formData.append('institucion_id',           me.sendPedido.id_institucion)
      formData.append('id_pedido',                me.sendPedido.id_pedido)
      formData.append('valor',                    me.ObjectSelect.doc_valor)
      formData.append('tipo_pago_id',             me.ObjectSelect.tipo_pago_id)
      formData.append('doc_observacion',          me.ObjectSelect.doc_observacion)
      me.$vs.loading()
      this.$http.post(this.$server_url+'pedigo_Pagos', formData)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
            text: res.data.message,
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time:5000,
          })
          return
        }
        me.$vs.notify({
          text: res.data.message,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.$emit('rechargeValores',true)
      })
      .catch(function (error) {
        me.$vs.loading.close()
      })
    },
    openConfirmEliminarPago(){
        let me = this;
        if(me.ObjectSelect.ifAntAprobado == 1){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo eliminar el registro del pago',
            cancelText:'Cancelar',
            text: 'Estás seguro de eliminar el registro del pago?',
            accept:this.eliminarPagoAnticipo
          })
          return
        }
        const { doc_observacion ,tipo_pago_id } = me.ObjectSelect
        if((tipo_pago_id == 1 && doc_observacion &&  doc_observacion.toLowerCase().includes("deuda")) || tipo_pago_id == 6){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo eliminar el registro del pago',
            cancelText:'Cancelar',
            text: 'Estás seguro de eliminar el registro del pago?',
            accept:this.eliminarValorPagoDeuda
          })
          return
        }

        else{
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo eliminar el registro del pago',
            cancelText:'Cancelar',
            text: 'Estás seguro de eliminar el registro del pago?',
            accept:this.eliminarValorPago
          })
        }
      },
      eliminarValorPago(){
        let me = this;
        let formData = new FormData()
        formData.append('eliminarPagoRegistro',         "yes")
        formData.append('doc_codigo',                   me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                    me.sendPedido.id_pedido)
        formData.append('user_created',                 me.usuario.idusuario)
        me.$vs.loading()
        me.$http.post(me.$server_url + 'pedigo_Pagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se eliminó correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.setHistoricoPagoEliminado()
        })
        .catch(function (error) {
            me.$vs.loading.close()
        })
      },
      setHistoricoPagoEliminado(){
        let me = this
        let formData = new FormData()
        formData.append('eliminarPagoNormal',       "yes")
        formData.append('doc_codigo',                me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                 me.sendPedido.id_pedido)
        formData.append('user_created',              me.usuario.idusuario)
        formData.append('old_values',                JSON.stringify(me.ObjectSelect))
        formData.append('ven_codigo',                me.ObjectSelect.ven_codigo)
        formData.append('periodo_id',                me.ObjectSelect.periodo_id)
        formData.append('institucion_id',            me.ObjectSelect.institucion_id)
        formData.append('id_pedido',                 me.ObjectSelect.id_pedido)
        formData.append('tipo_pago_id',              me.ObjectSelect.tipo_pago_id)
        formData.append('forma_pago_id',             me.ObjectSelect.forma_pago_id)
        formData.append('doc_observacion',           me.ObjectSelect.doc_observacion)
        this.$http.post(this.$server_url+'eliminarPagos', formData)
        .then(function (res) {
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      },
      eliminarPagoAnticipo(){
        let me = this
        let formData = new FormData()
        formData.append('eliminarPagoAnticipo',      "yes")
        formData.append('doc_codigo',                me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                 me.sendPedido.id_pedido)
        formData.append('user_created',              me.usuario.idusuario)
        me.$vs.loading()
        this.$http.post(this.$server_url+'eliminarPagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      },
      eliminarValorPagoDeuda(){
        let me = this
        let formData = new FormData()
        formData.append('eliminarPagoDeuda',         "yes")
        formData.append('doc_codigo',                me.ObjectSelect.doc_codigo)
        formData.append('id_pedido',                 me.sendPedido.id_pedido)
        formData.append('doc_valor',                 me.ObjectSelect.doc_valor)
        formData.append('user_created',              me.usuario.idusuario)
        me.$vs.loading()
        this.$http.post(this.$server_url+'eliminarPagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      },
      confirmReAbriPago(){
        let me = this
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          acceptText:'Si, deseo reabrir el pago',
          cancelText:'Cancelar',
          text: 'Estás seguro de reabrir el pago?',
          accept:this.reAbriPago
        })
      },
      abrirDetallesPago(tr){
        let me = this
        me.id_pago_detalle = tr.doc_codigo
        me.popupDetallesPago = true
      },
      actualizarListadoPagos(){
        let me = this
        // Emitir evento al componente padre para actualizar el listado
        me.$emit('rechargeValores', true)
      },
      reAbriPago(){
        let me = this
        let formData = new FormData()
        formData.append('reabrirPagos',        "yes")
        formData.append('id_pedido',           me.sendPedido.id_pedido)
        formData.append('doc_codigo',          me.ObjectSelect.doc_codigo)
        formData.append('user_created',        me.usuario.idusuario)
        formData.append('tipo_pago_id',        me.ObjectSelect.tipo_pago_id)
        formData.append('forma_pago_id',       me.ObjectSelect.forma_pago_id)
        formData.append('doc_observacion',     me.ObjectSelect.doc_observacion)
        me.$vs.loading()
        this.$http.post(this.$server_url+'pedigo_Pagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se reabrio correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {})
      }
  }
}
</script>


<style scoped>
.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

/* Estilos para el indicador de detalles abiertos */
.bg-blue-50 {
  background-color: #eff6ff;
}

.border-blue-500 {
  border-color: #3b82f6;
}

.text-primary {
  color: #3b82f6;
  font-weight: 600;
}

.text-success {
  color: #10b981;
  font-weight: 600;
}

.text-danger {
  color: #ef4444;
  font-weight: 600;
}

/* Estilos para las alertas de validación */
.alert-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.alert-box--danger {
  background-color: #dc2626;
  border-color: #b91c1c;
  color: #ffffff;
}

.alert-box--warning {
  background-color: #f59e0b;
  border-color: #d97706;
  color: #ffffff;
}

.alert-box__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.alert-box__text {
  flex: 1;
  line-height: 1.4;
}
</style>
