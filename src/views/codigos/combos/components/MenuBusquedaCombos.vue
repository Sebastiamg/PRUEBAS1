<template>
  <div class="mt-3">
    <vs-tabs alignment="fixed">
      <vs-tab label="Búsqueda individual">
        <div>
          <ComboBusquedaIndividualVue/>
        </div>
      </vs-tab>
      <!-- <vs-tab label="Búsqueda por importación">
        <div>

        </div>
      </vs-tab> -->
    </vs-tabs>
  </div>
</template>
<script>
import ComboBusquedaIndividualVue from './ComboBusquedaIndividual.vue';
export default{
  data(){
    return{

    }
  },
  components:{
    ComboBusquedaIndividualVue,
  }
}
</script>
