<template>
  <div class="w-full" :class="[selectedArea ? 'flex justify-between' : '']">
    <vs-input v-if="!selectedArea" class="w-full" @input="searchAreas(search)" icon-after="true"
      label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar area / asignatura"
      v-model="search" />
    <vs-button v-if="selectedArea" @click="clear" class="flex justify-center" color="dark">
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#fff" viewBox="0 0 576 512">
        <path
          d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z" />
      </svg>
      &nbsp;
      &nbsp;
      Seleccionar area
    </vs-button>
    <div v-if="areas.length === 0" class="w-full p-4 rounded-md flex flex-col justify-center items-center">
      <img src="@/assets/icons/empty-folder.png" alt="empty icon" class="h-48 w-48">
      <h3 class="text-xl font-bold">No se ha encontrado resultados</h3>
    </div>
    <div class=""
      :class="[selectedArea ? 'w-min h-12 flex space-x-2' : 'grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 w-full']">
      <span v-if="selectedArea" class="font-bold inline-block">Area seleccionada</span>
      <AreaCard v-for="area in areas" :key="area.id" :area="area" :set-area="setArea" />
    </div>
  </div>
</template>

<script>
import AreaCard from '../../components/AreaCard';

export default ({
  components: {
    AreaCard,
  },
  props: {
    selectedArea: {
      type: Object,
      required: false
    },
    areas: {
      type: Array,
      required: false
    },
    searchAreas: {
      type: Function,
      required: false
    },
    clear: {
      type: Function,
      required: false
    },
    setArea: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      search: ''
    };
  },
  methods: {},
  mounted() { },
});
</script>
