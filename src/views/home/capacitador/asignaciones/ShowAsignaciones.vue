<template>
  <div>
    <div>
        <div v-if="menu == 0">
          <reporteVue/>
        </div>
    </div>
  </div>
</template>
<script>
const reporteVue = () => import('../../../capacitaciones/reporte.vue')
export default{
  components:{
    reporteVue,
  },
  data() {
    return{
      menu:0
    }
  },
}
</script>

