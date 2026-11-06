<template>
    <div class="">
    <vs-tabs>
      <vs-tab label="Archivos">
        <div class="con-tab-ejemplo">
          <archivos></archivos>
        </div>
      </vs-tab>
      <!-- <vs-tab label="Unidades">
        <div class="con-tab-ejemplo">
          <unidades></unidades>
        </div>
      </vs-tab> -->
      <vs-tab label="Temas">
        <div class="con-tab-ejemplo">
          <temas></temas>
        </div>
      </vs-tab>
    
    </vs-tabs>
  </div>
</template>

<script>
import archivos from './material_archivos.vue'
import unidades from './material_unidades.vue'
import temas from './material_temas.vue'

export default {
  data(){
    return{

    }
  },
  components:{
      archivos,
      unidades,
      temas
  }
}
</script>