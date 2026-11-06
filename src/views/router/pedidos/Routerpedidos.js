// router.js

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default [{
        path: '/p_pedidos',
        name: 'p_pedidos',
        component: () =>
            import ('@/views/pedidos2/PrincipalPedidos.vue'),
    },
    // Otras rutas específicas de pedidos
    {
        path: "/home/libreria",
        name: "home-libreria",
        component: () =>
            import ("@/views/facturacion/10_10_1_4/Reposicion/homelibreria.vue"),
    },
    {
        path: "/pedidos/libreria",
        name: "pedidos-libreria",
        component: () =>
            import ("@/views/facturacion/10_10_1_4/Reposicion/Listadopedido.vue"),
    },
    {
        path: "/pedidos/alcanceListado",
        name: "pedidos-alcance-listado",
        component: () =>
            import ("@/views/facturacion/10_10_1_4/bodegas/alcances.vue"),
    },
    {
      path: '/reporte/comparativo',
      name: 'reporte/comparativo',
      component: () => import('@/views/pedidos2/pedidos/reportes/ReporteComparativo.vue'),
      meta: {
        breadcrumb: [
          { title: "Home", url: "/home" },
          { title: "Listado pedidos", url: "/p_pedidos" },
          { title: "Comparativo de Puntos de ventas", active: true },
        ],
      },
    },
    {
        path: "/reportes/pedidos/xPeriodos",
        name: "pedidos-xperiodos",
        component: () =>
            import ("@/views/pedidos/gerencia/reportes/ReporteVentaPeriodos.vue"),
    },
    /**CONTABILIDAD */
    {
      path: "/facturacion/reportes/contabilidad",
      name: "facturacion-reportes-contabilidad",
      component: () =>
          import ("@/views/contabilidad/reportes/ContabilidadScreenReportes.vue"),
    },
    {
      path: "/test3",
      name: "test3",
      component: () =>
          import ("@/views/pedidos2/pedidos/documentos/ScreenDocumentos.vue"),
    },
    {
      path: "/verificaciones/notificaciones",
      name: "verificaciones-notificaciones",
      component: () =>  import ("@/views/temporadas/verificaciones/asesor/AsesorVerificacionesNotificaciones.vue"),
      meta: {
        breadcrumb: [
          { title: "Home", url: "/home" },
          { title: "Notificaciones de verificaciones", active: true },
        ],
      },
    },
];
