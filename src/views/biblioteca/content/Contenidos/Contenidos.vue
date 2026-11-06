<template>
  <div class="w-full flex flex-col mt-2">
    <LoadingIndicator :loading="isSearching" />

    <div v-if="currentUser.id_group === 30" class="w-full flex flex-col space-y-2 items-start">
      <vs-input class="w-full" icon-after="true" label-placeholder="icon-after" icon="search"
        placeholder="Buscar contenidos" v-model="search" />
      <!-- Check box -->
      <div class="flex items-center">
        <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600" v-model="filterContent">
        <span class="ml-2 text-gray-700">Buscar en contenido</span>
      </div>
    </div>
    <span v-if="filterContent" class="text-sm text-gray-700 mb-2">La búsqueda se realizará en el contenido de los
      libros, por lo que puede tardar un poco más.</span>

    <div
      class="w-full flex flex-col-reverse sm:flex-row sm:justify-between space-y-2 md:space-y-0 items-start sm:items-center">
      <v-select class="w-48" label="Tipo de campo" :options="series" :reduce="series => series" v-model="serie">
        <template #header>Series</template>
      </v-select>
      <div v-if="currentUser.id_group !== 30" class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <vs-button v-if="isRoot" class="mb-0 h-16 m-0" color="dark" type="border" @click="openModal('formato')">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="#000" viewBox="0 0 384 512">
            <path
              d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
          </svg>
          &nbsp;
          &nbsp;
          Administrar formato
        </vs-button>
        <vs-button v-if="hasFormat" class="mb-0 h-16 m-0" color="dark" type="border" @click="openForm">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path
              d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z" />
          </svg>
          &nbsp;
          &nbsp;
          Agregar contenido
        </vs-button>
      </div>
    </div>
    <div v-if="!hasFormat && !isRoot" class="flex flex-col items-center">
      <h3 class="text-xl font-bold">No se ha creado un formato de contenido para ésta área. Contacte con soporte</h3>
    </div>
    <div v-if="currentUser.id_group === 30">
      <Libros v-if="serie !== ''" :libros="librosFiltrados" :seleccionar-libro="seleccionarLibro"
        :libro-seleccionado="libroSeleccionado" />
      <div v-if="lastData.length > 0" class="flex justify-between items-end mt-2">
        <span class="text-2xl font-bold text-gray-900">Última consulta</span>
        <vs-button type="border" color="dark" @click="clear">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path
              d="M566.6 9.4c12.5 12.5 12.5 32.8 0 45.3l-192 192 34.7 34.7c4.2 4.2 6.6 10 6.6 16c0 12.5-10.1 22.6-22.6 22.6H364.3L256 211.7V182.6c0-12.5 10.1-22.6 22.6-22.6c6 0 11.8 2.4 16 6.6l34.7 34.7 192-192c12.5-12.5 32.8-12.5 45.3 0zm-344 225.5L341.1 353.4c3.7 42.7-11.7 85.2-42.3 115.8C271.4 496.6 234.2 512 195.5 512L22.1 512C9.9 512 0 502.1 0 489.9c0-6.3 2.7-12.3 7.3-16.5L133.7 359.7c4.2-3.7-.4-10.4-5.4-7.9L77.2 377.4c-6.1 3-13.2-1.4-13.2-8.2c0-31.5 12.5-61.7 34.8-84l8-8c30.6-30.6 73.1-45.9 115.8-42.3zM464 352a80 80 0 1 1 0 160 80 80 0 1 1 0-160z" />
          </svg>
          Limpiar registros</vs-button>
      </div>
      <div v-if="lastData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <ContenidoCard v-for="contenido, index of contenidos" :key="index" :contenido="contenido" />
      </div>
      <div v-if="lastData.length === 0" class="flex flex-col items-center">
        <img src="@/assets/icons/empty-folder.png" alt="empty icon" class="h-48 w-48">
        <h3 class="text-xl font-bold">Sin datos para mostrar</h3>
      </div>
    </div>
    <div v-if="currentUser !== 30" class="mt-4 flex flex-col space-y-1">
      <v-select :options="arregloLibros" v-model="libroSeleccionado">
        <template #header>
          <span class="font-bold">Filtrar por libros</span>
        </template>
      </v-select>
      <v-select :options="unidades" v-model="unidadSeleccionada">
        <template #header>
          <span class="font-bold">Filtrar por unidades</span>
        </template>
      </v-select>
      <TablaContenido :contenidos="contenidos" :selected-serie="serie" :selected-libro="libroSeleccionado"
        :selected-unidad="unidadSeleccionada" @update="getContenidos" />
    </div>

    <vs-popup :title="modalTitle" :active.sync="popupActivo">
      <FormatForm v-if="modalContent === 'formato'" :area="area" />
      <ContenidoForm v-if="modalContent === 'form'" :area="area" />
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import Libros from './Libros.vue';
import FormatForm from '../FormFormat/Form.vue';
import ContenidoCard from '../../components/ContenidoCard.vue';
import TablaContenido from './TablaContenido.vue';
import LoadingIndicator from '../../components/LoadingIndicator.vue';

import LibroModel from '@/models/LibroModel'

export default ({
  components: {
    vSelect,
    Libros,
    FormatForm,
    ContenidoCard,
    TablaContenido,
    LoadingIndicator,
  },
  props: {
    area: {
      type: Object,
      required: false,
    },
  },
  created() {
    // Lógica que se ejecuta cuando se crea el componente
    // Recuperación de datos del almacenamiento local (localStorage)
    this.currentUser = JSON.parse(localStorage.getItem('usuario'));
    this.serie = localStorage.getItem('serie') || 'todas';
    this.search = localStorage.getItem('lastSearch') || '';
    this.libroSeleccionado = JSON.parse(localStorage.getItem('libroSeleccionado')) || null;
    this.unidadSeleccionada = JSON.parse(localStorage.getItem('unidadSeleccionada')) || null;
    const filterContentFromLocalStorage = localStorage.getItem('filterContent');
    this.filterContent = filterContentFromLocalStorage !== null ? filterContentFromLocalStorage === 'true' : true;
    this.lastData = JSON.parse(localStorage.getItem('lastData')) || [];
    this.lastQueryUrl = localStorage.getItem('lastQueryUrl') || '';
    this.buildGetContentUrl();
  },
  data() {
    // Definición de datos del componente (estado)
    return {
      serie: '',
      series: ['todas'],
      libros: [],
      librosFiltrados: [],
      arregloLibros: [],
      libroSeleccionado: null,
      unidades: [],
      unidadSeleccionada: null,
      contenidos: [],
      popupActivo: false,
      modalContent: '',
      modalTitle: '',
      search: '',
      currentUser: null,
      lastFilter: true,
      isRoot: false,
      hasFormat: true,
      isSearching: false,
      filterContent: null,
      getContentUrl: '',
      timeout: null,
      lastData: [],
      lastQueryUrl: '',
    };
  },
  methods: {
    buildGetContentUrl() {
      const me = this;
      let propList = [];
      me.getContentUrl = `${me.$server_url}biblioteca/contenidos?`

      if (me.$props.area.idarea) propList.push(`idArea=${me.$props.area.idarea}`);
      if (me.serie != 'todas') propList.push(`serie=${me.serie}`);
      if (me.libroSeleccionado) propList.push(`idLibro=${me.libroSeleccionado.id}`);
      if (me.search != '') propList.push(`param=${me.search}`);
      if (me.filterContent) propList.push(`filterContent=${me.filterContent}`);
      if (me.unidadSeleccionada) propList.push(`idUnidad=${me.unidadSeleccionada.id_unidad_libro}`);

      propList.map((prop, index) => {
        me.getContentUrl += `${prop}${index < propList.length - 1 ? '&' : ''}`
      });
    },
    // Métodos y funciones utilizados en el componente
    seleccionarLibro(libro) {
      // Comprueba si ya hay un libro seleccionado y si es el mismo libro que se hace clic
      this.libroSeleccionado && this.libroSeleccionado.id === libro.id
        ? this.libroSeleccionado = null // Si el libro seleccionado es el mismo que se hizo clic nuevamente,se de-selecciona
        : this.libroSeleccionado = libro; // Si el libro seleccionado no es el mismo que se hizo clic, establece el nuevo libro como seleccionado

      // Después de seleccionar o de-seleccionar el libro, llama a las siguientes dos funciones
      this.getUnidades();    // Obtiene las unidades relacionadas con el libro seleccionado
      this.getContenidos();  // Obtiene los contenidos relacionados con el libro seleccionado
    },
    getContenidos() {
      const me = this;

      me.buildGetContentUrl();

      if (me.getContentUrl === me.lastQueryUrl) {
        me.contenidos = me.lastData;
        return;
      }

      me.isSearching = true; // Indica que se está realizando una búsqueda
      if (me.search != localStorage.getItem('lastSearch')) me.lastFilter = false; // Comprueba si la búsqueda ha cambiado desde la última vez

      // Realiza una solicitud HTTP para obtener contenidos
      me.$http
        .get(me.getContentUrl)
        .then((res) => {
          me.hasFormat = res.data.state ? false : true;// Establece la variable 'hasFormat' según el estado de los datos de respuesta
          me.contenidos = res.data.data; // Asigna los contenidos obtenidos a la variable 'contenidos'
          me.lastData = res.data.data; // Almacena los contenidos en la variable 'lastData'

          // Asignar valores a las variables de almacenamiento local
          localStorage.setItem('lastSearch', me.search); // Almacena la búsqueda actual en el almacenamiento local
          localStorage.setItem('libroSeleccionado', me.libroSeleccionado ? JSON.stringify(me.libroSeleccionado) : null); // Almacena el libro seleccionado en el almacenamiento local
          localStorage.setItem('unidadSeleccionada', me.unidadSeleccionada ? JSON.stringify(me.unidadSeleccionada) : null); // Almacena la unidad seleccionada en el almacenamiento local
          localStorage.setItem('filterContent', me.filterContent); // Almacena el estado de 'filterContent' en el almacenamiento local
          localStorage.setItem('lastData', JSON.stringify(me.lastData)); // Almacena los contenidos en el almacenamiento local
          localStorage.setItem('lastQueryUrl', me.getContentUrl); // Almacena la URL de la última consulta en el almacenamiento local

          me.isSearching = false; // Indica que la búsqueda ha finalizado
        })
        .catch((err) => {
          // En caso de error, muestra una notificación de error
          me.$vs.notify({
            title: 'Error',
            text: err.message,
            color: 'danger',
            position: 'top-right',
          });
          me.isSearching = false; // Indica que la búsqueda ha finalizado debido a un error
        })
        .finally(() => {
          me.$vs.loading.close(); // Cierra el indicador de carga después de que la búsqueda haya terminado
        });
    },
    getLibros() {
      this.$vs.loading(); // Muestra un indicador de carga
      const area = this.$props.area;// Obtiene el área actual desde las propiedades del componente

      // Realiza una solicitud HTTP para obtener la lista de libros
      this.$http
        .get(`${this.$server_url}biblioteca/libros?idArea=${area.idarea}`)
        .then((res) => {
          this.libros = res.data.data.map((l) => new LibroModel(l)); // Transforma los datos de respuesta en objetos LibroModel y los almacena en 'libros'

          this.series = [...new Set(this.libros.map((l) => l.serie))]; // Crea una lista de series únicas a partir de los libros y la almacena en 'series'

          this.serie = this.serie || this.series[0]; // Si 'serie' no está definida, asigna la primera serie de la lista 'series'

          this.librosFiltrados = this.libros; // Establece 'librosFiltrados' como la lista completa de libros

          // Crea un nuevo arreglo 'arregloLibros' con formato especial
          this.arregloLibros = this.librosFiltrados.map((item) => {
            return { ...item, label: `${item.serie.toUpperCase().trim()} - ${item.nombre.toUpperCase().trim()}` }
          });

          // Verifica si 'libroSeleccionado' sigue siendo válido
          if (this.libroSeleccionado) {
            const libro = this.arregloLibros.find((l) => l.id === this.libroSeleccionado.id);
            if (!libro) {
              this.libroSeleccionado = null;
            } else {
              this.getUnidades(); // Si el libro seleccionado sigue siendo válido, obtiene las unidades relacionadas con el libro
            }
          }
        })
        .catch((err) => {
          // En caso de error, muestra una notificación de error
          this.$vs.notify({
            title: 'Error',
            text: err.message,
            color: 'danger',
            position: 'top-right',
          });
        })
        .finally(() => {
          this.filtrar(); // Ejecuta la función 'filtrar' al finalizar la solicitud
          this.$vs.loading.close(); // Cierra el indicador de carga
        });
    },
    getUnidades() {
      const me = this; // Guarda una referencia al componente en una variable local

      // Verifica si se ha seleccionado un libro
      if (me.libroSeleccionado) {
        me.$vs.loading(); // Muestra un indicador de carga

        // Realiza una solicitud HTTP para obtener las unidades relacionadas con el libro seleccionado
        me.$http.get(`${me.$server_url}biblioteca/libros/${me.libroSeleccionado.id}/unidades`).then((res) => {
          me.unidades = res.data.data; // Almacena los datos de unidades en la variable 'unidades'

          // Transforma los datos de unidades en un formato especial
          me.unidades = res.data.data.map((u) => {
            return { ...u, label: `${u.unidad.toUpperCase().trim()}` }
          });

          // Verifica si 'unidadSeleccionada' sigue siendo válida
          if (me.unidadSeleccionada) {
            const unidad = me.unidades.find((u) => u.id === me.unidadSeleccionada.id);
            if (!unidad) {
              me.unidadSeleccionada = null; // Si 'unidadSeleccionada' ya no es válida, se establece en 'null'
            }
          }
        }).catch((err) => {
          // En caso de error, muestra una notificación de error
          me.$vs.notify({
            title: 'Error',
            text: err.message,
            color: 'danger',
            position: 'top-right',
          });
        }).finally(() => {
          me.$vs.loading.close(); // Cierra el indicador de carga
        });
      }
    },
    filtrar() {
      localStorage.setItem('serie', this.serie); // Almacena la serie seleccionada en el almacenamiento local

      // Filtra los libros en función de la serie seleccionada o selecciona todos ('todas')
      if (this.serie === 'todas') {
        this.librosFiltrados = this.libros; // Si se selecciona 'todas', muestra todos los libros
      } else {
        this.librosFiltrados = this.libros.filter((l) => l.serie === this.serie); // Si se selecciona una serie específica, filtra los libros por esa serie
      }

      // Crea un nuevo arreglo 'arregloLibros' con formato especial
      this.arregloLibros = this.librosFiltrados.map((item) => {
        return { ...item, label: `${item.serie.toUpperCase().trim()} - ${item.nombre.toUpperCase().trim()}` }
      });

      this.getContenidos(); // Llama a la función 'getContenidos' para obtener los contenidos actualizados
    },
    openModal(content) {
      this.modalContent = content;
      this.popupActivo = true;
      switch (content) {
        case 'formato':
          this.modalTitle = 'Administrar formato';
          break;
        case 'form':
          this.modalTitle = 'Agregar contenido';
          break;
        default:
          break;
      }
    },
    checkRole() {
      const me = this; // Almacena una referencia al componente en una variable local

      me.$vs.loading(); // Muestra un indicador de carga

      // Realiza una solicitud HTTP para verificar los permisos del usuario actual
      me.$http
        .get(`${this.$server_url}permisos/${this.currentUser.idusuario}`)
        .then((res) => {
          // Comprueba si la respuesta contiene datos (permisos)
          res.data.length !== 0
            ? me.isRoot = true // Si el usuario tiene permisos, establece 'isRoot' en 'true'
            : me.isRoot = false; // Si el usuario no tiene permisos, establece 'isRoot' en 'false'
        })
        .catch((err) => {
          // En caso de error, muestra una notificación de error
          me.$vs.notify({
            title: 'Error',
            text: err.message,
            color: 'danger',
            position: 'top-right',
          });

          // Establece 'isRoot' en 'false' y redirige al usuario a la página de inicio
          me.isRoot = false;
          me.$router.push('/');
        })
        .finally(() => {
          me.$vs.loading.close(); // Cierra el indicador de carga
        });
    },
    clear() {
      this.lastData = [];
      localStorage.removeItem('lastData');
    },
    openForm() {
      this.$router.push({ name: 'biblioteca-form' });
    }
  },
  mounted() {
    this.$vs.loading();
    this.getLibros();
    this.checkRole();


  },
  watch: {
    serie() {
      // Verifica si 'serie' está vacío, si es así, establece 'serie' en 'todas' y realiza otras acciones
      if (!this.serie) {
        this.serie = 'todas';
        this.lastFilter = false;
        this.libroSeleccionado = null;
        this.unidadSeleccionada = null;
      }

      const ls = localStorage.getItem('serie'); // Obtiene el valor de 'serie' almacenado en el almacenamiento local (localStorage)

      // Compara 'serie' con el valor almacenado en el almacenamiento local y toma acciones si son diferentes
      if (this.serie !== ls) {
        this.lastFilter = false;
        this.libroSeleccionado = null;
        this.unidadSeleccionada = null;
      }
      this.filtrar(); // Llama a la función 'filtrar' para actualizar la lista de libros según los cambios en 'serie'
    },
    search() {
      // Wait 500ms before calling the function once the user has stopped typing
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getContenidos();
      }, 500);
    },
    lastFilter() {
      this.lastFilter = true; // Establece 'lastFilter' en 'true' cuando cambia esta propiedad
    },
    libroSeleccionado() {
      const ls = JSON.parse(localStorage.getItem('libroSeleccionado')); // Obtiene el valor de 'libroSeleccionado' almacenado en el almacenamiento local (localStorage)

      // Comprueba si 'libroSeleccionado' no existe o si ha cambiado en comparación con el valor almacenado
      if (!this.libroSeleccionado || (ls && this.libroSeleccionado.id !== ls.id)) {
        this.unidadSeleccionada = null; // Si no existe o ha cambiado, establece 'unidadSeleccionada' en 'null'
      }

      // Llama a las funciones 'getUnidades' y 'getContenidos' para actualizar los datos relacionados con el libro seleccionado
      this.getUnidades();
      this.getContenidos();
    },
    unidadSeleccionada() {
      this.getContenidos(); // Llama a la función 'getContenidos' para actualizar los contenidos relacionados con la unidad seleccionada
    },
    filterContent() {
      this.getContenidos(); // Llama a la función 'getContenidos' para actualizar los contenidos según los cambios en 'filterContent'
    }
  },
});
</script>
