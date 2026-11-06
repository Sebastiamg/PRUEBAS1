<template lang="html">
  <div>
    <vs-tabs :color="colorx">
      <vs-tab label="Promocion de Contratos" icon="dashboard" @click="colorx = '#8B0000';menu = 0;">
      </vs-tab>
    </vs-tabs>
    <!--componentes-->
    <div v-if="menu == 0">
      <PedidosPromociosContratosVue :periodoSelect="periodoSelect" periodoEspecifico="1"/>
    </div>
  </div>
</template>

<script>
const PedidosPromociosContratosVue = () => import('./PedidosPromociosContratos.vue')
export default {
  components:{
    PedidosPromociosContratosVue,
  },
  data:()=>({
    colorx: '#8B0000',
    menu:0,
  }),
  props:{
    periodoSelect:{
      type:Object,
      default:()=>{},
    },
  },
}
</script>
</template>
