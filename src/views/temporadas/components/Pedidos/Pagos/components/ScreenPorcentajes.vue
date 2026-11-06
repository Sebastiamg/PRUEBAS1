<template>
  <div>
      <div class="oculto-impresion">
        <vs-button color="warning" class="ml-6" style="display: inline-block;" @click="imprimirEval()">Generar reporte</vs-button>
      </div>
      <div>
        <vs-divider><b>PORCENTAJES TODA LA VENTA</b></vs-divider>
        <div v-if="sendPedido.id_pedido != undefined">
          <BeneficiariosPorcentajeVue class="mt-3" :ventaBruta="sendPedido.total_venta" :comision="sendPedido.descuento" :id_pedido="sendPedido.id_pedido" :contrato_generado="sendPedido.contrato_generado"/>
          <registrar_beneficiariosVue class="mt-3" :pedido="sendPedido" :desdeVerificacion="2"/>
        </div>
        <br><br>
        <div v-for="(item,key) in arregloVerificaciones" :key="key">
          <vs-divider><b class="text-warning">PORCENTAJES VERIFICACIÓN #{{ item.num_verificacion }}</b></vs-divider>
          <BeneficiariosPorcentajeVue
          :ventaBruta="sendPedido.total_venta"
          :comision="sendPedido.descuento"
          :id_pedido="sendPedido.id_pedido"
          :contrato_generado="sendPedido.contrato_generado"
          :desdeVerificacion="1"
          :VerificacionSelect="item"
           />
          <registrar_beneficiariosVue
          :pedido="sendPedido"
          :desdeVerificacion="1"
          :VerificacionSelect="item"
          />
        </div>
      </div>
  </div>
</template>
<script>
import BeneficiariosPorcentajeVue from '@/views/pedidos/components/beneficiarios/BeneficiariosPorcentaje'
import registrar_beneficiariosVue from '@/views/pedidos/registrar_beneficiarios'
export default{
  components:{
    BeneficiariosPorcentajeVue,
    registrar_beneficiariosVue,
  },
  data(){
    return{

    }
  },
  props:{
    sendPedido:{
      type:Array,
      default:function(){
        return []
      }
    },
    arregloVerificaciones:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  methods:{
    imprimirEval(){
      let me = this;
      document.title = "Porcentajes Beneficiarios - " +me.sendPedido.contrato_generado
        //var ficha = document.getElementById('seccionImprimir');
        window.print();
        /*var ficha = document.getElementById('seccionImprimir');
        var ventimp = window.open(' ', 'popimpr');
        ventimp.document.write( ficha.innerHTML );
        ventimp.document.close();
        ventimp.print( );
        ventimp.close();*/
    }
  }
}
</script>
<style scoped>
@media print{
  .oculto-impresion *{
      display: none !important;
  }
}
</style>
