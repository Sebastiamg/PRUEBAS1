<template>
  <div class="vx-row mb-6">
    <div class="vx-col w-full mt-2" v-if="usuario.id_group == 10 && aplica_matricula != 1">
      <vx-card slot="no-body" class="text-white text-center greet-user fondo-director" style="min-height: 130px;">
        <h1 class="mb-6 text-white">Bienvenido {{ usuario.nombres }} {{ usuario.apellidos }}</h1>
        <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto"><strong>DIRECTOR</strong></p>
      </vx-card>
    </div>

    <div class="vx-col w-2/3 mt-2" v-if="usuario.id_group == 10 && aplica_matricula == 1">
      <vx-card slot="no-body" class="text-white text-center greet-user fondo-director" style="min-height: 130px;">
        <h1 class="mb-6 text-white">Bienvenido {{ usuario.nombres }} {{ usuario.apellidos }}</h1>
        <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto"><strong>DIRECTOR</strong></p>
      </vx-card>
    </div>

    <div class="vx-col w-1/3 mt-2" v-if="usuario.id_group == 10 && aplica_matricula == 1">
      <vx-card
        @click="$router.push('/matricula/listado_matriculas')"
        slot="no-body"
        class="text-center greet-user"
        style="cursor: pointer; min-height: 130px; border: 1px solid #0094F3;"
      >
        <h1 class="mb-6" style="color: gray;"> Matriculación </h1>
        <p class="w-full" style="font-size: 20px;"><strong>Ver módulo</strong></p>
      </vx-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeDirectorWelcome',
  props: {
    usuario: {
      type: [Object, Array],
      required: true
    },
    aplica_matricula: {
      type: Number,
      default: 0
    }
  }
}
</script>
