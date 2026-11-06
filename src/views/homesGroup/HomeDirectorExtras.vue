<template>
  <div v-if="usuario.id_group == 10">
    <div class="vx-col w-full mb-6">
      <Agenda />
    </div>

    <div class="vx-row mr-1">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="p-5 vx-card alto">
          <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-home" color="primary"></vs-button>
          <h5 style="display: inline-block;">Instituciones</h5>
          <center>
            <h1><b> {{ instituciones_director.length }} </b></h1>
          </center>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Agenda from '../docentes/agenda_docente.vue'

export default {
  name: 'HomeDirectorExtras',
  components: {
    Agenda
  },
  props: {
    usuario: {
      type: [Object, Array],
      required: true
    },
    instituciones_director: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>
