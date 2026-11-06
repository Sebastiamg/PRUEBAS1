<template>
  <div>
    <vs-tabs alignment="center">
      <vs-tab label="Import Periodo Individual">
        <div>
          <importPeriodoIndividualVue/>
        </div>
      </vs-tab>
      <vs-tab label="Import por varios periodos">
        <div>
            <importPeriodoVariosVue/>
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>
<script>
import importPeriodoIndividualVue from './importPeriodoIndividual.vue'
import importPeriodoVariosVue from './importPeriodoVarios.vue'
export default {
  data() {
    return{

    } 
  },
  components:{
    importPeriodoIndividualVue,
    importPeriodoVariosVue
  }
}
</script>