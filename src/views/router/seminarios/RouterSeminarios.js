// router.js

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default [
  {
      path: "/marketing/encuestas/",
      name: "marketing-encuestas",
      component: () =>
        import ("@/views/asesor/encuestas/EncuestasProlipa.vue"),
  },
  {
      path: "/asesor/gestion-visitas/",
      name: "asesor-gestion-visitas",
      component: () =>
        import ("@/views/asesor/admin/gestionVisitas.vue"),
  },
  {
      path: "/certificados/gestion/",
      name: "certificados-gestion",
      component: () => import('@/views/asesor/encuestas/EncuestaMostrarPerfil.vue'),
  },
   {
      path: "/capacitadores/gestion/",
      name: "capacitadores-gestion",
      component: () =>
        import ("@/views/capacitaciones/CapacitacionesListado.vue"),
  },
];
