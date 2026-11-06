<template>
  <div>
    <span class="text-xl font-bold">Filtrar por libros</span>
    <div class="flex space-x-2 overflow-x-auto scroll-container">
      <LibroCard v-for="libro, index of libros" :key="index" :libro="libro" @click="seleccionarLibro(libro)"
        :seleccionado="libroSeleccionado && libroSeleccionado.id === libro.id" />
    </div>
  </div>
</template>

<script>
import LibroCard from '../../components/LibroCard.vue';

export default ({
  components: {
    LibroCard,
  },
  props: {
    libros: {
      type: Array,
      required: true,
    },
    seleccionarLibro: {
      type: Function,
      required: true,
    },
    libroSeleccionado: {
      type: Object,
      required: false,
    }
  },
  methods: {
    
  }
});
</script>

<style scoped>
.scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

.scroll-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.scroll-container::-webkit-scrollbar-corner {
  background-color: #f1f1f1;
}
</style>
