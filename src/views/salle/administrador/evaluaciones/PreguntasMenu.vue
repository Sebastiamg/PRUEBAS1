<template>
  <div>
    <vs-tabs alignment="fixed">
      <vs-tab label="Preguntas">
        <div>
          <PreguntasComponentVue/>
        </div>
      </vs-tab>
      <vs-tab label="Exportar Preguntas">
        <div>
          <PreguntasExportarVue/>
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>
<script>
import PreguntasComponentVue from './PreguntasComponent.vue';
import PreguntasExportarVue from '@/views/salle/administrador/evaluaciones/PreguntasExportar'
export default{
  components:{
    PreguntasComponentVue,
    PreguntasExportarVue,
  },
  data(){
    return{

    }
  }
}
</script>
