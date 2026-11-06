// router.js

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default [
    {
      path: '/c_configuracion/plataformas',
      name: 'c_configuracion-plataformas',
      component: () => import('@/views/configuracion/plataformas/ScreenPlataformas.vue'),
    },

    {
      path: '/otras/plataformas',
      name: 'otras-plataformas',
      component: () => import('@/views/home/estudiante/plataformas/PlataformasEstudiantes.vue'),
    },

    {
      path: '/paquetes',
      name: 'paquetes',
      component: () => import('@/views/codigos/paquetes/version2/paquetes/ImportPaquetes2.vue'),
    },
    {
      path: '/acortador/links',
      name: 'acortador-links',
      component: () => import('@/views/admin/acortador/ScreenAcortador.vue'),
    },
    {
      path: '/solinfa/facturas',
      name: 'solinfa-facturas',
      component: () => import('@/views/solinfa/SolinfaFacturas/ScreenSolinfaFacturas.vue'),
    },
    {
      path: '/ia/chat',
      name: 'ia-chat',
      component: () => import('@/views/docentes/ia/DocenteChatIa.vue'),
    },
    {
        path: '/encuesta/:id/preguntas',
        component: () => import('@/views/asesor/encuestas/EncuestaPreguntasProlipa.vue')
    }
  ];
