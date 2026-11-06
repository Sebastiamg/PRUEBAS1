<template>
<div>
  <div>
    <vs-tabs>
      <vs-tab label="Aprobaciones pendientes" @click="menu = 0;">
          <Lista_aprobar />
      </vs-tab>
      <!-- <vs-tab label="Historico % Comisión" @click="menu =1;">
        <div v-if="menu == 1">
          <GerenciaScreenComisionVue/>
        </div>
      </vs-tab> -->
      <!-- <vs-tab label="Valores aprobados" @click="menu = 2;">
          <PedidosPeriodos />
      </vs-tab>
      <vs-tab label="detalles pedidos" @click="menu = 3;">
          <Listado_de_Contratos />
      </vs-tab> -->
      <!-- <vs-tab label="Reportes" @click="menu = 4;">
          <ScreenReporteVue />
      </vs-tab> -->
    </vs-tabs>
  </div>
</div>
</template>

<script>
import Lista_aprobar from './lista_aprobar.vue';
import PedidosPeriodos from './pedidosPeriodos.vue';
import Listado_de_Contratos from '../../pedidos/gerencia/listado_de_Contratos.vue'
import ScreenReporteVue from '../../pedidos/gerencia/reportes/ScreenReporte.vue'
import ScreenObsequiosGerenciaVue from '../../pedidos/obsequios/gerencia/ScreenObsequiosGerencia'
const GerenciaScreenComisionVue = () => import('./pedidos/comision/GerenciaScreenComision.vue');
export default {
  components: {
    Lista_aprobar,
    PedidosPeriodos,
    Listado_de_Contratos,
    ScreenReporteVue,
    ScreenObsequiosGerenciaVue,
    GerenciaScreenComisionVue,
  },
  data() {
    return {
      menu:0,
    };
  },
  mounted() {},
  methods: {},
}
</script>
