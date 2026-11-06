<template>
  <div class="p-4">
    <vs-button type="border" color="primary" @click="$router.go(-1)">
      Regresar
    </vs-button>
    <form onsubmit="handleSubmit" class="w-full flex flex-col">
      <div class="flex flex-col md:flex-row md:justify-between md:space-x-2">
        <div class="w-full">
          <v-select class="w-full" label="nombrelibro" :options="libros" v-model="libro">
            <template #header>Libro</template>
          </v-select>
          <button v-if="libro && libro.pdfconguia" class="outline-none border-none hover:underline bg-none cursor-pointer"
            @click="datopdfconguia(libro.pdfconguia)">
            Ver libro
          </button>
        </div>
        <div class="w-full">
          <v-select class="w-full" label="unidad" :options="unidades" v-model="unidad">
            <template #header>Unidad</template>
          </v-select>
        </div>
      </div>
      <span class="mt-4 mb-2 text-md font-bold">
        Contenido:
      </span>
      <div v-for="(contenido, index) in contenidos" :key="index">
        <vs-input v-if="contenido.tipo === 'texto corto'" class="w-full my-2" :label-placeholder="contenido.label"
          v-model="contenido.valor" />
        <v-select v-else-if="contenido.tipo === 'menu de opciones'" class="w-full my-2" :options="contenido.opciones"
          v-model="contenido.valor">
          <template #header>{{ contenido.label }}</template>
        </v-select>
        <div v-else>
          <span>{{ contenido.label }}</span>
          <quill-editor :content="contenido.valor" @change="onEditorChange($event, contenido)" />
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <vs-button type="border" color="primary" @click="handleSubmit">
          Guardar
        </vs-button>
      </div>
    </form>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import { quillEditor } from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

export default ({
  components: {
    vSelect,
    quillEditor,
  },
  data() {
    return {
      area: null,
      contenidoId: null,
      libros: [],
      libro: null,
      unidades: [],
      unidad: null,
      contenidos: [],
      contentData: null,
      cUser: null,
    };
  },
  created() {
    this.area = JSON.parse(localStorage.getItem('area')); // Obtiene el área seleccionada
    this.contenidoId = this.$route.params.id; // Obtiene el id del contenido
    this.cUser = JSON.parse(localStorage.getItem('usuario')); // Obtiene el usuario actual
  },
  async mounted() {
    await this.obtenerLibros(); // Obtiene los libros
    await this.obtenerUnidades(); // Obtiene las unidades
    await this.obtenerFormato(); // Obtiene el formato del contenido
  },
  methods: {
    async obtenerFormato() {
      const me = this; // Variable para almacenar el contexto actual

      me.$vs.loading(); // Muestra el spinner de carga

      // Obtiene el formato del contenido
      me.$http.get(`${me.$server_url}biblioteca/contenido/formato?areaId=${me.area.idarea}${me.contenidoId ? `&contenidoId=${me.contenidoId}` : ''}`).then((res) => {
        me.libro = me.libros.find((libro) => libro.idlibro === res.data.data.id_libro) || null; // Asigna el libro del contenido
        me.contentData = res.data.data; // Asigna los datos del contenido

        // Si el contenido tiene un formato, lo asigna a la variable 'contenidos'
        if (res.data.data.contenidoformato) {
          me.contenidos = JSON.parse(res.data.data.contenidoformato); // Parsea la cadena JSON a un objeto
        } else {
          me.contenidos = JSON.parse(res.data.data.contenido); // Parsea la cadena JSON a un objeto
        }
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close();
      });
    },
    async obtenerLibros() {
      const me = this;

      me.$vs.loading();

      // Obtiene los libros del área seleccionada
      me.$http.get(`${me.$server_url}biblioteca/libros?idArea=${me.area.idarea}`).then((res) => {
        me.libros = res.data.data; // Asigna los libros obtenidos a la variable 'libros'
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close(); // Cierra el spinner de carga
      });
    },
    async obtenerUnidades() {
      const me = this;

      if (me.libro) {
        me.$vs.loading(); // Muestra el spinner de carga

        // Obtiene las unidades del libro seleccionado
        me.$http.get(`${me.$server_url}biblioteca/libros/${me.libro.idlibro}/unidades`).then((res) => {
          me.unidades = res.data.data; // Asigna las unidades obtenidas a la variable 'unidades'

          // Si el contenido tiene un id de unidad, asigna la unidad del contenido a la variable 'unidad'
          if (me.libro) {
            me.unidad = me.unidades.find((u) => u.id_unidad_libro === me.contentData.id_unidad_libro) || null; // Asigna la unidad del contenido
          }
        }).catch((err) => {
          me.$vs.notify({
            title: 'Error',
            text: err.message,
            color: 'danger',
            position: 'top-right',
          });
        }).finally(() => {
          me.$vs.loading.close(); // Cierra el spinner de carga
        });
      }
    },
    datopdfconguia(url) {
      let me = this

      event.preventDefault(); // Evita que se recargue la página

      // Si el contenido no tiene un PDF con guía, muestra una notificación
      if (url === null || url === 'null') {
        me.$vs.notify({
          text: 'El PDF con guía aun no está disponible',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      localStorage.url_guia = url; // Almacena la URL del PDF con guía en el almacenamiento local
      let route = this.$router.resolve({ path: '/docente/libro/pdfconguia' }); // Obtiene la ruta de la página de visualización del PDF con guía
      window.open(route.href, '_blank'); // Abre la página de visualización del PDF con guía en una nueva pestaña
    },
    handleSubmit() {
      const me = this;
      const formData = new FormData(); // Crea un objeto FormData

      if (!me.area) {
        me.$vs.notify({
          title: 'Error',
          text: 'Ha ocurrido un error al obtener el área',
          color: 'danger',
          position: 'top-right',
        });
        return;
      }

      if (!me.libro) {
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar un libro',
          color: 'danger',
          position: 'top-right',
        });
        return;
      }

      if (!me.unidad) {
        me.$vs.notify({
          title: 'Error',
          text: 'Debe seleccionar una unidad',
          color: 'danger',
          position: 'top-right',
        });
        return;
      }


      formData.append('idArea', me.area.idarea); // Agrega el id del área al objeto FormData
      formData.append('idLibro', me.libro.idlibro); // Agrega el id del libro al objeto FormData
      formData.append('idUnidad', me.unidad.id_unidad_libro); // Agrega el id de la unidad al objeto FormData
      formData.append('contenido', JSON.stringify(me.contenidos)); // Agrega el contenido al objeto FormData
      formData.append('idUsuario', me.cUser.idusuario); // Agrega el id del usuario al objeto FormData

      // Si el contenido tiene un id, agrega el id del contenido al objeto FormData
      if (me.contenidoId) {
        formData.append('idContenido', me.contenidoId); // Agrega el id del contenido al objeto FormData
      }

      me.$vs.loading(); // Muestra el spinner de carga

      // Realiza una petición para guardar el contenido
      me.$http.post(`${me.$server_url}biblioteca/contenido`, formData).then((res) => {
        me.$vs.notify({
          title: 'Éxito',
          text: res.data.message,
          color: 'success',
          position: 'top-right',
        });
        me.$emit('close'); // Emite un evento para cerrar el modal
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
          position: 'top-right',
        });
      }).finally(() => {
        me.$vs.loading.close(); // Cierra el spinner de carga
        me.$router.push({ name: 'biblioteca', query: { id: me.area.idarea } }); // Redirecciona a la ruta de biblioteca
      });
    },
    onEditorChange(event, contenido) {
      contenido.valor = event.html;
    },
  },
  watch: {
    // Si el libro cambia, obtiene las unidades
    libro: function (val) {
      this.obtenerUnidades(); // Obtiene las unidades
    },
  },

});
</script>
