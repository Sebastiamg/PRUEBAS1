import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default [
  //====BODEGA====
  {
    path: '/codigos/bodega',
    name: 'codigos-bodega',
    component: () =>
      import ('@/views/bodega/codigos/ScreenMenuCodigosBodega.vue'),
  },
  {
    path: '/bodega/reporte_s',
    name: 'bodega-reporte_s',
    component: () =>
      import ('@/views/codigos/reportes/ScreenBodegaReportes.vue'),
  },
];
