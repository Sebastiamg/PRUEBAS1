<template>
<div>
    <vs-tabs>
      <vs-tab label="Reportes asesores" @click="menu = 0">
        <div class="con-tab-ejemplo">
          <MenuReporteriaAsesorVue/>
        </div>
      </vs-tab>
      <vs-tab label="Redactores">
        <div class="con-tab-ejemplo" @click="menu =1">
          <reportesRedactores/>
        </div>
      </vs-tab>
      <vs-tab label="Reporte material" @click="menu = 2">
        <MenuReporteMateriaVue/>
      </vs-tab>
      <vs-tab label="Reporte Vendedores" @click="menu = 3">
        <ReporteVentaVendedor2Vue v-if="menu == 3"/>
      </vs-tab>
      <!--reportes bodega-->
      <vs-tab label="Reporte Bodega" @click="menu = 4">

      </vs-tab>
      <!--reportes bodega-->
      <vs-tab label="Libros liquidados" @click="menu = 5">

      </vs-tab>
       <!--reportes contabilidad reporte venta agrupados-->
       <vs-tab label="Reporte Ventas - Agrupados" @click="menu = 6">

      </vs-tab>
      <!--Reporte de codigos liquidados por niveles-->
      <vs-tab label="Reporte de codigos liquidados por niveles" @click="menu = 7"></vs-tab>
      <vs-tab label="Plan Lector" @click="menu = 8"></vs-tab>

    </vs-tabs>
    <!--componentes-->
    <vx-card v-if="menu == 4">
      <ScreenBodegaReportesVue/>
    </vx-card>
    <div v-if="menu == 5">
      <BodegaReporteCodigosLiquidadosContratosVue/>
    </div>
    <div v-if="menu == 6">
      <ContabilidadReporteVentasAgrupadosVue/>
    </div>
    <vx-card v-if="menu == 7">
      <BodegaReporteCodigosLiquidadosAniosVue/>
    </vx-card>
    <vx-card v-if="menu==8">
      <codigosPlanLector/>
    </vx-card>
</div>
</template>
<script>
import MenuReporteriaAsesorVue from './asesor/MenuReporteriaAsesor.vue';
import reportesRedactores from '../../asesor/admin/reportesRedactores.vue';
import MenuReporteMateriaVue from './material/MenuReporteMateria.vue';
const ReporteVentaVendedor2Vue                    = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaVendedor2.vue')
const ScreenBodegaReportesVue                     = () => import('../../codigos/reportes/ScreenBodegaReportes.vue')
const BodegaReporteCodigosLiquidadosContratosVue  = () => import('../../codigos/reportes/BodegaReporteCodigosLiquidadosContratos.vue')
const ContabilidadReporteVentasAgrupadosVue       = () => import('../../codigos/reportes/ContabilidadReporteVentasAgrupados.vue')
const BodegaReporteCodigosLiquidadosAniosVue      = () => import('../../codigos/reportes/BodegaReporteCodigosLiquidadosAnios.vue')
const codigosPlanLector                           = () => import('@/views/facturacion/10_10_1_4/bodegas/codigosLR.vue')

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import VueApexCharts from 'vue-apexcharts';
import {
    mapState
} from "vuex";
export default{
    components:{
      flatPickr,
      'v-select': vSelect,
      VueApexCharts,
      reportesRedactores,
      MenuReporteriaAsesorVue,
      MenuReporteMateriaVue,
      ReporteVentaVendedor2Vue,
      ScreenBodegaReportesVue,
      BodegaReporteCodigosLiquidadosContratosVue,
      ContabilidadReporteVentasAgrupadosVue,
      BodegaReporteCodigosLiquidadosAniosVue,
      codigosPlanLector,
    },
    mounted(){
      let me = this;
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    data(){
        return{
          menu:0,
        }
    },
    methods:{
    }
}
</script>
