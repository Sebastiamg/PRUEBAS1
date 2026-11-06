<template>
  <div class="vx-row" v-if="usuario.id_group == 12">
    <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
      <div class="p-5 vx-card alto">
        <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-user" color="primary"></vs-button>
        <h5 style="display: inline-block;" class="text-primary ml-6"><b>Usuarios</b></h5>
        <div class="vx-row">
          <p class="vx-col w-1/2 md:w-1/2 text-right color1">Administradores: </p>
          <p class="vx-col w-1/2 md:w-1/2 text-center numero2 color1"><b> {{ listaUsuariosSalle.contarAdmin }} </b></p>
        </div>
        <div class="vx-row">
          <p class="vx-col w-1/2 md:w-1/2 text-right color1">Docentes: </p>
          <p class="vx-col w-1/2 md:w-1/2 text-center numero2 color1"><b> {{ listaUsuariosSalle.contarDocentes }} </b></p>
        </div>
      </div>
    </div>

    <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
      <div class="p-5 vx-card alto">
        <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-home" color="primary"></vs-button>
        <h5 style="display: inline-block;" class="text-primary ml-6"><b>Instituciones</b></h5>
        <div class="vx-row">
          <p class="vx-col mx-auto numero1 color1"><b> {{ listaUsuariosSalle.contarInstituciones}} </b></p>
        </div>
      </div>
    </div>

    <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
      <div class="p-5 vx-card alto">
        <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-bookmark" color="primary"></vs-button>
        <h5 style="display: inline-block;" class="text-primary ml-6"><b>Areas</b></h5>
        <div class="vx-row">
          <p class="vx-col mx-auto numero1 color1"><b> {{ listaUsuariosSalle.contarAreas }} </b></p>
        </div>
      </div>
    </div>

    <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
      <div class="p-5 vx-card alto">
        <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-type" color="primary"></vs-button>
        <h5 style="display: inline-block;" class="text-primary ml-6"><b>Asignaturas</b></h5>
        <div class="vx-row">
          <p class="vx-col mx-auto numero1 color1"><b> {{ listaUsuariosSalle.contarAsignaturas }} </b></p>
        </div>
      </div>
    </div>

    <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
      <div class="p-5 vx-card alto">
        <vs-button class="mb-2" style="display: inline-block;" radius icon-pack="feather" icon="icon-layers" color="primary"></vs-button>
        <h5 style="display: inline-block;" class="text-primary ml-6"><b>Evaluaciones</b></h5>
        <div class="vx-row">
          <p class="vx-col mx-auto numero1 color1"><b> {{ evaluaciones_salle }} </b></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSalleAdmin',
  props: {
    usuario: {
      type: [Object, Array],
      required: true
    },
    listaUsuariosSalle: {
      type: [Object, String],
      default: function() {
        return {}
      }
    },
    evaluaciones_salle: {
      type: Number,
      default: 0
    }
  }
}
</script>
