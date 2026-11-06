<template>
  <div>
    <div v-if="tipoImport == 0">
      <CombosGeneradosImportAsignacionVue :tipoImport="tipoImport"/>
    </div>
    <div v-if="tipoImport == 1">
      <CombosGeneradosImportAsignacionVue :tipoImport="tipoImport"/>
    </div>
  </div>
</template>
<script>
const CombosGeneradosImportAsignacionVue = () => import('./CombosGeneradosImportAsignacion.vue');
export default{
  components:{
    CombosGeneradosImportAsignacionVue,
  },
  data(){
    return{

    }
  },
  props:{
    tipoImport:{
      type:Number,
      default:0
    }
  }
}
</script>
