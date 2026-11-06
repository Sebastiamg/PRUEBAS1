<template>
  <button
    class="w-full flex flex-col space-y-2 rounded-lg p-4 bg-grey-light hover:bg-white shadow cursor-pointer hover:shadow-lg hover:p-2 border-none"
    @click="ver(contenido.contenido_libro_id)">
    <div class="w-full flex justify-between">
      <span class="text-lg font-bold uppercase">
        {{ contenido.nombrearea }}
      </span>
      <span class="font-medium">
        {{ contenido.nombrelibro }}
      </span>
    </div>
    <span class="font-bold">
      {{ contenido.texto_unidad }}
    </span>
    <span class="font-bold text-lg">
      Tema: <span class="font-semibold">{{ getTema(contenido.contenido) }}</span>
    </span>
    <div class="w-full flex flex-row justify-between items-end">
      <div class="flex flex-col items-start">
        <span class="text-sm font-bold">
          Creado por: <span class="font-normal">{{ contenido.nombre_completo }}</span>
        </span>
        <span class="text-sm font-bold">
          Fecha: <span class="font-normal">{{ contenido.created_at }}</span>
        </span>
      </div>
      <span class="font-bold text-sm">Página: <span class="font-light">{{ getPagina(contenido.contenido) }}</span></span>
    </div>
  </button>
</template>


<script>
export default {
  props: {
    contenido: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
    }
  },
  methods: {
    goToDetails() {
      console.log('goToDetails');
      /* this.$router.push({ name: 'biblioteca/contenido', params: { id: this.$props.contenido.id } }); */
    },
    getTema(content) {
      let data = JSON.parse(content); // Parsea la cadena JSON 'strData' a un objeto

      const titulo = data.find((item) => item.label.toLowerCase().replace('á', 'a') === 'titulo'); // Busca un elemento en 'data' donde la etiqueta (label) sea 'titulo' (en minúsculas y sin acentos reemplazados)

      // Si se encuentra un elemento con etiqueta 'titulo', asigna su valor a la variable 'tema'
      if (titulo) {
        return titulo.valor; // Devuelve el valor del tema encontrado
      } else {
        const temaData = data.find((item) => item.label.toLowerCase().replace('á', 'a') === 'tema'); // Si no se encuentra un elemento con etiqueta 'titulo', busca un elemento con etiqueta 'tema'
        if (temaData) {
          return temaData.valor; // Devuelve el valor del tema encontrado
        }
      }
    },
    getPagina(content) {
      let data = JSON.parse(content); // Parsea la cadena JSON 'strData' a un objeto

      const paginaData = data.find((item) => item.label.toLowerCase().replace('á', 'a') === 'pagina'); // Busca un elemento en 'data' donde la etiqueta (label) sea 'pagina' (en minúsculas y sin acentos reemplazados)

      // Si se encuentra un elemento con etiqueta 'pagina', asigna su valor a la variable 'pagina'
      if (paginaData) {
        return paginaData.valor || 'No definido.'; // Devuelve el valor de la página encontrada
      } else {
        return 'No definido.'; // Si no se encuentra un elemento con etiqueta 'pagina', asigna 'No definido.' a la variable 'pagina'
      }
    },
    ver(id) {
      this.$router.push(`/biblioteca/contenido/${id}`); // Redirecciona a la ruta de visualización de contenido
    }
  },
}
</script>

<style scoped></style>
