<template>
  <div>
        <vs-tabs alignment="fixed" >
        <vs-tab label="Crear documentos devolución Sueltos" @click="menu = 0">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Busqueda de documentos de devolución Sueltos" @click="menu = 1">
          <div>

          </div>

        </vs-tab>
      </vs-tabs>
      <!--COMPONENTS-->
      <devolucionBodegaVue v-if="menu == 0" class="mt-2"></devolucionBodegaVue>
      <devolucionBodegaHistorialVue v-if="menu == 1" class="mt-2"></devolucionBodegaHistorialVue>

  </div>
</template>
<script>
const devolucionBodegaVue = () => import('../../devolucionBodega.vue');
const devolucionBodegaHistorialVue = () => import('../../devolucionBodegaHistorial.vue');
export default {
  components: {
    devolucionBodegaVue,
    devolucionBodegaHistorialVue,
  },
  data() {
    return {
      menu: 0,
    }
  }
}
</script>
