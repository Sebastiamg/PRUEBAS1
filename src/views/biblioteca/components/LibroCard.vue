<template>
  <div class="flex-shrink-0 w-32 flex flex-col justify-center rounded-lg shadow-md hover:shadow-lg cursor-pointer m-2"
    :class="[
      seleccionado ? 'bg-white' : 'bg-grey hover:bg-grey-light'
    ]" @click="seleccionarLibro">
    <div class="w-full h-full rounded-lg filter">
      <div class="inset-0 flex justify-start items-end">
        <div class="w-full font-bold text-left rounded-lg p-4 text-black book-content">
          <span class="font-bold nombre-libro">
            {{ libro.nombre }}
          </span>
          <div class="flex flex-col">
            <span class="text-xs font-medium">
              {{ libro.serie }}
            </span>
            <span class="text-xs font-normal">
              <b class="font-bold">Año:</b> {{ libro.anio }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default ({
  data: () => ({
    anio: '',
  }),
  props: {
    libro: {
      type: Object,
      required: true,
    },
    seleccionado: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    seleccionarLibro() {
      this.$emit('click', this.libro);
    },
  },
});
</script>

<style scoped>
.nombre-libro {
  font-size: 0.8rem;
  line-height: 1.2rem;
  color: #000;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 10px;
  height: auto;
}

::-webkit-scrollbar-thumb {
  background-color: blue;
}

::-webkit-scrollbar-track {
  background-color: green;
}
</style>
