<template>
  <div class="w-full flex flex-col space-y-2">
    <vs-table search pagination :data="contenidos">
      <template #header>
        <span class="font-bold text-xl">
          {{ selectedSerie === 'todas' ? 'Todos los contenidos' : `Contenidos de la serie ${selectedSerie}` }}{{
            selectedLibro ? ` del libro ${selectedLibro.nombre}` : '' }}{{ selectedUnidad ? ` de la
          ${selectedUnidad.unidad}` : '' }}
        </span>
      </template>
      <template slot="thead">
        <vs-th v-if="selectedSerie === 'todas'">
          Serie
        </vs-th>
        <vs-th>
          Tema
        </vs-th>
        <vs-th>
          Página
        </vs-th>
        <vs-th>
        </vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td v-if="selectedSerie === 'todas'">
            <span class="font-bold">
              {{ tr.nombre_serie.toUpperCase() }}
            </span>
          </vs-td>
          <vs-td>
            {{ getTema(tr.contenido) }}
          </vs-td>
          <vs-td>
            {{ getPagina(tr.contenido) }}
          </vs-td>
          <vs-td>
            <button class="p-2 border border-darken-1 rounded bg-white cursor-pointer mx-1 hover:shadow-md"
              @click="verContenido(tr.contenido_libro_id)">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                <path
                  d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
              <span>
                Ver
              </span>
            </button>
            <button class="p-2 border border-darken-1 rounded bg-white cursor-pointer mx-1 hover:shadow-md"
              @click="editarContenido(tr.contenido_libro_id)">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
              </svg>
              <span>
                Editar
              </span>
            </button>
            <button class="p-2 border border-darken-1 rounded bg-white cursor-pointer mx-1 hover:shadow-md"
              @click="eliminar(tr.contenido_libro_id)">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                <path
                  d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
              </svg>
              <span>
                Eliminar
              </span>
            </button>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import vSelect from 'vue-select';
export default ({
  components: {
    vSelect,
  },
  props: {
    contenidos: {
      type: Array,
      required: true,
    },
    selectedSerie: {
      type: String,
      default: false,
    },
    selectedLibro: {
      type: Object,
      default: false,
    },
    selectedUnidad: {
      type: Object,
      default: false,
    },
  },
  methods: {
    getTema(strData) {
      let tema = ''; // // Variable para almacenar el tema del contenido

      const data = JSON.parse(strData); // Parsea la cadena JSON 'strData' a un objeto

      // Busca un elemento en 'data' donde la etiqueta (label) sea 'titulo' (en minúsculas y sin acentos reemplazados)
      const titulo = data.find((item) => item.label.toLowerCase().replace('á', 'a') === 'titulo');

      if (titulo) {
        // Si se encuentra un elemento con etiqueta 'titulo', asigna su valor a la variable 'tema'
        tema = titulo.valor;
      } else {
        // Si no se encuentra un elemento con etiqueta 'titulo', busca un elemento con etiqueta 'tema'
        const temaData = data.find((item) => item.label.toLowerCase().replace('á', 'a') === 'tema');
        if (temaData) {
          // Si se encuentra un elemento con etiqueta 'tema', asigna su valor a la variable 'tema'
          tema = temaData.valor;
        }
      }

      return tema; // Devuelve el valor del tema encontrado
    },
    getPagina(strData) {
      let pagina = ''; // Variable para almacenar la página del contenido

      const data = JSON.parse(strData); // Parsea la cadena JSON 'strData' a un objeto

      // Busca un elemento en 'data' donde la etiqueta (label) sea 'pagina' (en minúsculas y sin acentos reemplazados)
      const paginaData = data.find((item) => item.label.toLowerCase().replace('á', 'a') === 'pagina');

      // Si se encuentra un elemento con etiqueta 'pagina', asigna su valor a la variable 'pagina'
      if (paginaData) {
        pagina = paginaData.valor || 'No definido.';
      } else {
        // Si no se encuentra un elemento con etiqueta 'pagina', asigna 'No definido.' a la variable 'pagina'
        pagina = 'No definido.';
      }

      return pagina; // Devuelve el valor de la página encontrada
    },
    verContenido(id) {
      this.$router.push(`/biblioteca/contenido/${id}`); // Redirecciona a la ruta de visualización de contenido
    },
    editarContenido(id) {
      this.$router.push({ name: 'biblioteca-form', params: { id: id } }); // Redirecciona a la ruta de edición de contenido
    },
    eliminar(id) {
      const me = this; // Variable para almacenar el contexto actual

      // Muestra un diálogo de confirmación para eliminar el contenido
      me.$vs.dialog({
        title: 'Eliminar contenido',
        text: '¿Está seguro que desea eliminar este contenido?',
        accept: () => {
          me.eliminarContenido(id); // Si el usuario acepta, llama al método para eliminar el contenido
        },
      });
    },
    eliminarContenido(id) {
      const me = this; // Variable para almacenar el contexto actual
      me.$vs.loading(); // Muestra un indicador de carga mientras se elimina el contenido

      // Realiza una petición para eliminar el contenido
      me.$http.delete(`${me.$server_url}biblioteca/contenido/${id}`).then((res) => {
        me.$vs.notify({
          title: 'Éxito',
          text: res.data.message,
          color: 'success',
          position: 'top-right',
        });
        me.$router.push({ name: 'biblioteca' }); // Redirecciona a la ruta de biblioteca
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close(); // Cierra el indicador de carga
        // Emit event to update the list of contents
        me.$emit('update'); // Emite un evento para actualizar la lista de contenidos
      })
    }
  }
});
</script>
