<template>
  <div class="mt-3">
    <vs-tabs>
        <!-- <vs-tab label="Listado Proformas" @click="menu = 0;">
        </vs-tab> -->
        <vs-tab label="Pedidos Perseo" @click="menu = 1">

        </vs-tab>
    </vs-tabs>
    <!--components-->
    <div v-if="menu == 0">
      <listadoProfVue />
    </div>
    <div v-if="menu == 1">
      <listadoPerseoVue :periodoSelect="periodoSelect"/>
    </div>
  </div>
</template>
<script>
const listadoProfVue = () => import('@/views/pedidos2/pedidos/proforma/ListadoProf.vue');
const listadoPerseoVue = () => import('@/views/pedidos2/pedidos/proforma/ListadoPerseo.vue');
export default {
  components:{
    listadoProfVue,
    listadoPerseoVue
  },
  data() {
    return{
      menu:1,
    }
  },
  props: {
    periodoSelect: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
