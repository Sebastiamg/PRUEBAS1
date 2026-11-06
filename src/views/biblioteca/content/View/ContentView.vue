<template>
  <div class="w-full h-screen p-4 flex flex-col bg-grey-light overflow-y-auto">
    <vs-row>
      <vs-col class="w-full flex justify-between mb-2">
        <vs-button type="border" color="dark" @click="$router.go(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
          &nbsp;
          Regresar
        </vs-button>
        <div class="flex space-x-2">
          <vs-button v-if="cUser.id_group !== 28" @click="eliminar" color="danger">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff">
              <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
            &nbsp;
            Eliminar
          </vs-button>
          <vs-button v-if="cUser.id_group !== 28" @click="editar">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill="#fff">
              <path
                d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
            </svg>
            &nbsp;
            Editar
          </vs-button>
        </div>
      </vs-col>
      <vs-col class="w-full h-full">
        <vs-card>
          <vs-button @click="handleCopy">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill="#fff">
              <path
                d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" />
            </svg>
            &nbsp;
            Copiar todo
          </vs-button>
          <vs-row id="content">
            <vs-col class="w-full flex justify-between items-baseline">
              <span class="font-bold text-lg">
                {{ contenido.nombrearea }}
              </span>
              <span class="font-medium">
                {{ contenido.nombrelibro }}
              </span>
            </vs-col>
            <vs-col class="w-full">
              <span class="font-bold text-lg">
                Unidad: <span class="font-medium">{{ contenido.unidad }} - {{ contenido.nombre_unidad }}</span>
              </span>
            </vs-col>
            <vs-col v-for="(contenido, index) in listaContenidos" :key="index" class="mt-2">
              <span v-if="contenido.tipo !== 'editor de texto'" class="font-bold">
                {{ contenido.label }}: <span class="font-medium">{{ contenido.valor }}</span>
              </span>
              <div v-else-if="contenido.tipo === 'editor de texto' && contenido.valor" class="font-bold">
                {{ contenido.label }}:
                <span class="font-medium" v-html="contenido.valor"></span>
              </div>
            </vs-col>
          </vs-row>
        </vs-card>
        <div class="-mt-4 flex flex-col">
          <span class="text-sm font-bold">
            Creado por: <span class="font-medium">{{ usuarioCrea.nombre ? usuarioCrea.nombre : '' }}</span>
          </span>
          <span class="text-sm font-bold">
            Creado en: <span class="font-medium">{{ usuarioCrea.fecha ? usuarioCrea.fecha : '' }}</span>
          </span>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>

export default {
  name: 'ContentView',
  components: {
  },
  data() {
    return {
      contenido: {},
      listaContenidos: [],
      popupActivo: false,
      cUser: null,
      usuarioCrea: null,
    }
  },
  methods: {
    // Función para copiar el contenido al portapapeles
    handleCopy() {
      const me = this;
      const content = document.getElementById('content'); // Obtiene el elemento con id 'content'

      const range = document.createRange(); // Crea un rango de selección

      range.selectNode(content); // Selecciona el contenido del elemento 'content'

      window.getSelection().removeAllRanges(); // Elimina todas las selecciones existentes

      window.getSelection().addRange(range); // Agrega el rango de selección creado

      document.execCommand('copy'); // Copia el contenido seleccionado

      window.getSelection().removeAllRanges(); // Elimina todas las selecciones existentes

      me.$vs.notify({
        title: 'Copiado',
        text: 'Contenido copiado al portapapeles',
        color: 'success',
        position: 'top-right',
      });
    },
    getContenido() {
      const me = this;

      me.$vs.loading(); // Muestra el indicador de carga

      // Realiza una petición para obtener el contenido
      me.$http.get(`${me.$server_url}biblioteca/contenido?id=${me.$route.params.id}`).then((res) => {
        me.contenido = res.data.data; // Asigna los datos del contenido a la variable 'contenido'

        // Asigna los datos del usuario que creó el contenido a la variable 'usuarioCrea'
        me.usuarioCrea = {
          nombre: res.data.data.apellidos + ' ' + res.data.data.nombres,
          fecha: res.data.data.created_at,
        }

        me.listaContenidos = JSON.parse(res.data.data.contenido); // Parsea la cadena JSON a un objeto
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close(); // Cierra el indicador de carga
      });
    },
    editar() {
      const me = this;
      me.$router.push({ name: 'biblioteca-form', params: { id: me.$route.params.id } }); // Redirecciona a la ruta de edición de contenido
    },
    eliminar() {
      const me = this;
      // Muestra un diálogo de confirmación para eliminar el contenido
      me.$vs.dialog({
        title: 'Eliminar contenido',
        text: '¿Está seguro que desea eliminar este contenido?',
        accept: me.eliminarContenido, // Si el usuario acepta, llama al método para eliminar el contenido
      });
    },
    eliminarContenido() {
      const me = this;

      // Realiza una petición para eliminar el contenido
      me.$http.delete(`${me.$server_url}biblioteca/contenido/${me.$route.params.id}`).then((res) => {
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
      });
    }
  },
  created() {
    this.cUser = JSON.parse(localStorage.getItem('usuario')); // Obtiene el usuario actual
  },
  mounted() {
    this.getContenido(); // Obtiene el contenido
  }
}
</script>
