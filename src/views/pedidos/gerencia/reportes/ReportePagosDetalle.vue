<template>
  <div>
    <vs-tabs alignment="fixed">
      <vs-tab label="Detalle Pagos" @click="menu=0">
        <div>

        </div>
      </vs-tab>
      <!-- <vs-tab label="Detalle Convenios" @click="menu=1">
        <div>

        </div>
      </vs-tab> -->
    </vs-tabs>
    <!--components-->
    <div v-if="menu==0">
      <ReportePagosDetallePagosVue :periodo_id="periodo_id"/>
    </div>
    <div v-if="menu==1">
      <ReportePagosDetalleConveniosVue :periodo_id="periodo_id"/>
    </div>
  </div>

</template>
<script>
const ReportePagosDetallePagosVue = () => import('./ReportePagosDetallePagos.vue');
const ReportePagosDetalleConveniosVue = () => import('./ReportePagosDetalleConvenios.vue');
export default{
  components:{
    ReportePagosDetallePagosVue,
    ReportePagosDetalleConveniosVue
  },
  data(){
    return {
      menu:0,
    }
  },
  props:{
    periodo_id:{
      type:Number,
      default:0
    },
  },
}
</script>
