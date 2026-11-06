<template>
  <vx-card>
    <!--menu-->
    <div class="w-full max-w-2xl mx-auto mt-5">
      <div class="flex flex-auto justify-evenly border rounded-md w-full">
        <button :class="
          [
            { 'colorActivo': isActive === 1 },
            'px-2 py-1 rounded-md w-full boton'
          ]
        "
        @click="isActive = 1">
          <i class="fa-solid fa-paperclip"></i> Generador de links
        </button>

        <button
          :class="
          [
            { 'colorActivo': isActive === 2 },
            'px-2 py-1 rounded-md w-full boton'
          ]
        "
        @click="isActive = 2">
        Listado de links acortados
        </button>
      </div>
    </div>
    <!--componentes-->
    <div v-if="isActive === 1">
      <AcortadorCrearVue class="mt-2"/>
    </div>
    <div v-if="isActive === 2">
      <listadoAcortadorVue class="mt-4" />
    </div>
  </vx-card>
</template>
<script>
const AcortadorCrearVue = () => import('./AcortadorCrear.vue');
const listadoAcortadorVue = () => import('./listadoAcortador.vue');
export default {
  components: {
    AcortadorCrearVue,
    listadoAcortadorVue
  },
  data() {
    return{
      isActive: 1
    }
  },
}
</script>
<style scoped>
.boton {
  border: none;
  padding: 15px!important;
  cursor: pointer;
  transition: all 0.3s;
}
.colorActivo{
  background-color: #3c9111;
  color: #fff;
}
</style>
