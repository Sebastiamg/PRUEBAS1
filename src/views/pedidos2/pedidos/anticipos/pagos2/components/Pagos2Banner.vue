<template>
  <div>
    <br>
    <div class="flex" style="flex-wrap:wrap;">
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Valor Comisión: </span>
        <span class="font-bold text-primary" style="opacity:0.6;">{{ totalValorComision | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Total Pagado: </span>
        <span class="text-success font-bold">{{ totalPagadoClientes | filtrarDecimal }}</span>
      </div>
      <div v-if="totalDevolucionEscuela > 0" style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <vx-tooltip style="display: inline-block;" text="
        En este pago se va a sumar con el valor de la comisión en el reporte
        •	Este pago aparecer en el reporte
        " position="top" color="primary">
          <span class="font-light">( + ) Devolución Escuela: </span>
        </vx-tooltip>
        <span class="font-bold text-primary" style="opacity:0.6;">{{ totalDevolucionEscuela | filtrarDecimal }}</span>
      </div>
      <div v-if="totalPagadoOtrosValores > 0" style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <vx-tooltip style="display: inline-block;" text="
          En este pago se va a sumar con el valor de la comisión en el reporte
          •	Este pago aparecer en el reporte
          " position="top" color="primary">
          <span class="font-light">( + ) Otros valores por cancelar: </span>
        </vx-tooltip>
        <span class="text-success font-bold">{{ totalPagadoOtrosValores | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Pendiente por Liquidar: </span>
        <span class="font-bold" v-if="totalPendienteLiquidar > 0">{{ totalPendienteLiquidar | filtrarDecimal }}</span>
        <span class="font-bold text-danger" v-else>{{ totalPendienteLiquidar | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Total Deudas Anteriores: </span>
        <span class="text-warning">{{ totalDeudaAnterior | filtrarDecimal }}</span>
      </div>
      <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
        <span class="font-light">Total Deuda Próxima Temporada: </span>
        <span class="text-warning">{{ totalDeuda | filtrarDecimal }}</span>
      </div>
    </div>
    <div v-if="totalHijosDocentes > 0" style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
      <span class="font-light">Total Hijos Docentes: </span>
      <span class="text-warning">{{ totalHijosDocentes | filtrarDecimal }}</span>
    </div>
    <br>
  </div>
</template>
<script>
export default {
  data() {
    return {
      totalValorComision:0,
      totalPagadoClientes:0,
      totalPendienteLiquidar:0,
      totalDeudaAnterior:0,
      totalDeuda:0,
      totalHijosDocentes:0,
      totalDevolucionEscuela:0,
      totalPagadoOtrosValores:0,
    }
  },
  props:{
    arregloPagos:{
      type:Array,
      default:function(){
        return []
      }
    },
    sendPedido:{
      type:Array,
      default:function(){
        return []
      }
    },
    ifGlobal:{
      type:Number,
      default:0
    },
  },
  mounted(){
    let me = this
    me.sumarPagos()
  },
  watch:{
    arregloPagos(){
      let me = this
      me.sumarPagos()
    }
  },
  methods:{
    sumarPagos(){
      let me = this
      me.totalPagadoClientes      = 0
      me.totalValorComision       = 0
      me.totalPendienteLiquidar   = 0
      me.totalDevolucionEscuela   = 0
      me.totalPagadoOtrosValores  = 0
      me.totalHijosDocentes       = 0
      //DIFERENTE A DEUDA
      let datos = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id != 3 && p.tipo_pago_id != 5 && p.tipo_pago_id != 7)
      if(datos.length > 0){
        let total = 0
        datos.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalPagadoClientes = total
      }
      //DEUDAS SE SUMAN APARTE ANTERIORES
      let datos3 = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id == 6)
      if(datos3.length > 0){
        let total = 0
        datos3.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalDeudaAnterior = total
      }
      //DEVOLUCION DE LA ESCUELA
      let datos4 = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id == 5)
      if(datos4.length > 0){
        let total = 0
        datos4.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalDevolucionEscuela = total
      }
      //Otros valores por cancelar
      let datos5 = me.arregloPagos.filter(p => p.estado == 1 && p.tipo_pago_id == 7)
      if(datos5.length > 0){
        let total = 0
        datos5.forEach(element => {
          total += parseFloat(element.doc_valor)
        });
        me.totalPagadoOtrosValores += total
      }
      //PROCESO
      const { contrato_generado } = me.sendPedido
      if( contrato_generado == "" || contrato_generado == null ){
        me.totalPendienteLiquidar = ( me.totalValorComision - me.totalPagadoClientes ) + me.totalDevolucionEscuela + me.totalPagadoOtrosValores
        //actualizar values
        me.updatePedido(3,'totalValorComision',me.totalValorComision,'totalPagado',me.totalPagadoClientes,'totalPendienteLiquidar',me.totalPendienteLiquidar)
        //actualizar deuda anterior
        me.updateDeudaProxima()
      }
      else { me.getVerificaciones() }
    },
    getVerificaciones(){
      let me = this;
      me.totalValorComision     = 0
      me.totalHijosDocentes     = 0
      this.$http.get(this.$server_url + "n_verificacion?getVerificacionXcontrato=yes&contrato="+me.sendPedido.contrato_generado)
      .then((res)=>{
        let datos = res.data.filter(p => p.estado == 0)
        if(datos.length > 0){
          me.totalValorComision     = 0
          datos.forEach(element => {
            me.totalValorComision += parseFloat(element.valor_comision)
            me.totalHijosDocentes += parseFloat(element.deuda_hijos_docentes || 0)
          });
          me.totalPendienteLiquidar = (me.totalValorComision - me.totalPagadoClientes) + ( me.totalDevolucionEscuela + me.totalPagadoOtrosValores )
          //actualizar values
          me.updatePedido(3,'totalValorComision',me.totalValorComision,'totalPagado',me.totalPagadoClientes,'totalPendienteLiquidar',me.totalPendienteLiquidar)
          //actualizar deuda anterior
          me.updateDeudaProxima()
        }else{
          me.totalValorComision     = 0
          me.totalPendienteLiquidar = (me.totalValorComision - me.totalPagadoClientes) + ( me.totalDevolucionEscuela + me.totalPagadoOtrosValores )
          //actualizar values
          me.updatePedido(3,'totalValorComision',me.totalValorComision,'totalPagado',me.totalPagadoClientes,'totalPendienteLiquidar',me.totalPendienteLiquidar)
          //actualizar deuda anterior
          me.updateDeudaProxima()
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    updatePedido(numero,campo1,valor1,campo2,valor2,campo3,valor3){
      let me = this
      let formData = new FormData();
      if(numero == 1) { formData.append('unCampo', 'yes'); }
      if(numero == 2) { formData.append('actualizarDosCampo', 'yes'); }
      if(numero == 3) { formData.append('actualizarTresCampo', 'yes'); }
      formData.append('id_pedido',                  me.sendPedido.id_pedido);
      formData.append('campo',                      campo1)
      formData.append('campo2',                     campo2)
      formData.append('campo3',                     campo3)
      formData.append('valor',                      valor1.toFixed(2))
      formData.append('valor2',                     valor2.toFixed(2))
      formData.append('valor3',                     valor3.toFixed(2))
      this.$http.post(this.$server_url+'updateThePedido', formData)
      .then(res => {
        if(me.ifGlobal == 1){
          me.$emit('f_terminarActualizacionPagos',true)
        }
      })
      .catch((e)=>{
        me.$vs.notify({title:'Error',text:'Error al actualizar el pedido',color:'danger',position:'top-right'})
      })
    },
    updateDeudaProxima(){
      let me = this
      me.totalDeuda = 0
      let sendEnviarDeuda = 0
      if(me.totalPendienteLiquidar > 0) { sendEnviarDeuda = 0 }
      else{ sendEnviarDeuda = me.totalPendienteLiquidar }
      let formData = new FormData();
      formData.append('RegistroDeudaAutomatica'     ,1)
      formData.append('id_pedido',                  me.sendPedido.id_pedido);
      formData.append('contrato',                   me.sendPedido.contrato_generado)
      formData.append('institucion_id',             me.sendPedido.id_institucion)
      formData.append('periodo_id',                 me.sendPedido.id_periodo)
      formData.append('doc_valor',                  sendEnviarDeuda)
      this.$http.post(this.$server_url+'pedigo_Pagos', formData)
      .then(res => {
        //absoluto
        me.totalDeuda = res.data
      })
      .catch((e)=>{
        me.$vs.notify({title:'Error',text:'Error al actualizar la deuda',color:'danger',position:'top-right'})
      })

    },
  },
}
</script>
<style scoped>
  span{
    font-size: 19px;
  }
</style>
