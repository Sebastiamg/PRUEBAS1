<template>
  <div>
    <vx-card>
      <div v-if="menu != 0">
        <vs-button class="mt-3" color="dark" @click="menu = 0;">◄ Regresar </vs-button>
      </div>
      <div v-if="menu == 0">
        <listado_PuntosVue :periodoSelect="periodoSelect" @showWindow="showWindow"/>
      </div>
      <div v-if="menu == 1">
        <ScreenDetallePuntoVue/>
      </div>
  </vx-card>
  </div>
</template>
<script>
const listado_PuntosVue     = () => import('@/views/pedidos/listado_puntos.vue')
const ScreenDetallePuntoVue = () => import('../pedidos/ScreenDetallePunto.vue')
export default {
  components:{
    listado_PuntosVue,
    ScreenDetallePuntoVue,
  },
  data() {
    return{
      menu:0,
    }
  },
  props:{
    periodoSelect: {
      type: Object,
      default: function(){
        return {}
      },
    },
  },
  methods:{
    showWindow(e){
      let me = this
      me.menu = e
    },
  }
}
</script>
