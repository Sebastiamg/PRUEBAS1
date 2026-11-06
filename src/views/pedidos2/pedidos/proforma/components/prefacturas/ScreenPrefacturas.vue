<template>
  <div>
    <div>
      <DocumentosVentaVue :desdePendientes="Number(1)" :periodoSelect="periodoSelect"/>
    </div>
  </div>
</template>
<script>
const DocumentosVentaVue = () => import('../../DocumentosVenta.vue')
export default {
  components:{
    DocumentosVentaVue
  },
  data() {
    return{
    }
  },
  props:{
    periodoSelect:{
      type:Object,
      default:function(){
        return{}
      }
    }
  },
}
</script>
