<template>
    <vx-card>
      <vs-tabs v-model="ifBodega">
        <vs-tab label="Guias - Escuelas">
          <div  class="mt-4">
            <b>Periodo: {{periodoSelect.periodoescolar}}</b>
            <ReportePedidoGuiasVue :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)"/>
          </div>
        </vs-tab>
        <vs-tab label="Códigos bodega">
          <div class="mt-4">
            <b>Periodo: {{periodoSelect.periodoescolar}}</b>
            <ReportePedidoBodegaVue :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)"/>
          </div>
        </vs-tab>
        <vs-tab label="Despacho bodega">
          <div class="mt-4">
            <ReporteBodegaDespachosVue :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)"/>
          </div>
        </vs-tab>
      </vs-tabs>
      <!--components-->

    </vx-card>
  </template>
  <script>
  const ReportePedidoBodegaVue      = () => import('@/views/pedidos2/pedidos/reportes/ReportePedidoBodega.vue');
  const ReportePedidoGuiasVue       = () => import('@/views/pedidos2/pedidos/reportes/components/ReportePedidoGuias.vue');
  const ReporteBodegaDespachosVue      = () => import('@/views/pedidos2/pedidos/reportes/bodega/ReporteBodegaDespachos.vue');
  // import ReporteBodegaDespachos from '../bodega/ReporteBodegaDespachos.vue';
  import vSelect from 'vue-select'
  export default {
    components:{
      ReportePedidoBodegaVue,
      ReportePedidoGuiasVue,
      ReporteBodegaDespachosVue,
      vSelect,
    },
    data() {
      return{
        ifBodega:0,
        usuario:[],
      }
    },
    props:{
      periodo_id:{
        type:Number,
        default:0
      },
      nombrePeriodo:{
        type:String,
        default:""
      },
      periodoSelect:{
        type:Object,
        default:{}
      },
    },
    created(){
      let me = this
      me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted(){
      let me = this
    },
    methods:{
     
    }
  }
  </script>
  