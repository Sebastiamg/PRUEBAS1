// router.js

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default [
  {
      path: "/salle/s_uper",
      name: "salle-s_uper",
      component: () =>
        import ("@/views/salle/super/ScreenSalleSuper.vue"),
  },

];
