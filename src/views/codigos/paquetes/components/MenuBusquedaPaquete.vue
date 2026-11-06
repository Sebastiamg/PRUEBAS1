<template>
  <div class="mt-3">
    <vs-tabs alignment="fixed">
      <vs-tab label="Búsqueda individual">
        <div>
          <PaqueteBusquedaIndividualVue/>
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
import PaqueteBusquedaIndividualVue from './PaqueteBusquedaIndividual.vue';
export default{
  data(){
    return{

    }
  },
  components:{
    PaqueteBusquedaIndividualVue,
  }
}
</script>
