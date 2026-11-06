<template>
  <vx-card>
    <vs-alert class="mb-3">
      <p class="text-sm sm:text-base">Este modulo es para ver los tareas y archivos asociados a un periodo específico.</p>
    </vs-alert>
    <div class="mt-2">
      <div class="vx-row">
        <div class="vx-col w-full md:w-1/2 mb-4 md:mb-0">
          <span class="font-semibold">Seleccione la región</span>
          <ul class="flex mt-2" style="flex-wrap: wrap;">
            <li class="mr-3">
              <vs-radio v-model="region" @input="limpiarDatosYCambiarRegion();" vs-name="radios1tipoFiltro" vs-value="1">Sierra</vs-radio>
            </li>
            <li class="mr-3">
              <vs-radio v-model="region" @input="limpiarDatosYCambiarRegion();" vs-name="radios1tipoFiltro" vs-value="2">Costa</vs-radio>
            </li>
          </ul>
        </div>
        <div class="vx-col w-full md:w-1/2">
          <span class="font-semibold">Seleccione el período</span>
          <div class="flex flex-col sm:flex-row">
            <v-select
              :options="arrayPeriodos"
              :reduce="periodo => periodo.idperiodoescolar"
              label="periodoescolar"
              class="w-full mt-2"
              v-model="periodoSelected"
              @input="filtrarReporte()"
            />
            <vs-button color="primary" @click="filtrarReporte()" class="sm:ml-2 mb-2 mt-2 w-full sm:w-auto" type="filled">
              Filtrar
            </vs-button>
          </div>
        </div>
      </div>
    </div>
    <vs-divider></vs-divider>
    <div class="mb-4 text-sm">
      <span class="font-semibold">Archivos pendientes de quitar: </span>
      <b class="text-primary">{{ totalItems }}</b>
    </div>
  <div v-if="totalPages && totalPages > 1" class="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gray-100 p-3 rounded gap-3">
      <div class="text-sm lg:text-base">
        <b>Total archivos:</b> {{ totalItems }}
        <span class="ml-2 lg:ml-4"><b>Página:</b> {{ page }} de {{ totalPages }}</span>
        <span class="block sm:inline sm:ml-2 lg:ml-4 mt-1 sm:mt-0"><b>Por página:</b> {{ perPage }}</span>
      </div>
      <div class="flex items-center justify-center lg:justify-end flex-wrap gap-1">
        <span v-if="page > 1" @click="cambiarPagina(1)" class="px-2 py-1 rounded cursor-pointer bg-white border text-xs sm:text-sm hover:bg-gray-50">« Primera</span>
        <span v-if="page > 1" @click="cambiarPagina(page - 1)" class="px-2 py-1 rounded cursor-pointer bg-white border text-xs sm:text-sm hover:bg-gray-50">‹</span>
        <span v-for="n in visiblePages" :key="n" @click="cambiarPagina(n)" :class="['px-2 py-1 rounded cursor-pointer text-xs sm:text-sm', n === page ? 'bg-primary text-white font-bold' : 'bg-white border hover:bg-gray-50']">
          {{ n }}
        </span>
        <span v-if="page < totalPages" @click="cambiarPagina(page + 1)" class="px-2 py-1 rounded cursor-pointer bg-white border text-xs sm:text-sm hover:bg-gray-50">›</span>
        <span v-if="page < totalPages" @click="cambiarPagina(totalPages)" class="px-2 py-1 rounded cursor-pointer bg-white border text-xs sm:text-sm hover:bg-gray-50">Última »</span>
      </div>
    </div>
    <div v-if="selectedRows.length > 0" class="mb-3">
      <vs-button color="danger" type="relief" @click="openConfirmQuitarArchivos();" icon="icon-trash" class="w-full sm:w-auto block">
        Quitar {{ selectedRows.length }} archivos seleccionados
      </vs-button>
    </div>
    <div class="overflow-x-auto">
      <vs-table
        :data="currentPageData"
        :pagination="false"
        stripe
        multiple
        v-model="selectedRows"
      >
        <template slot="header">
          <vs-chip color="primary">Total archivos en página: <b>{{ currentPageData.length }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>ID</vs-th>
          <vs-th>Asignatura</vs-th>
          <vs-th>Curso</vs-th>
          <vs-th>Archivo</vs-th>
          <vs-th>Peso</vs-th>
          <vs-th>Fecha</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr v-for="archivo in data" :key="archivo.id" :data="archivo">
            <vs-td>
              <span class="text-xs">{{ archivo.id }}</span>
            </vs-td>
            <vs-td>
              <span class="text-sm">{{ archivo.nombreasignatura }}</span>
            </vs-td>
            <vs-td>
              <div class="text-xs">
                <span class="font-bold"># {{ archivo.curso_idcurso }}</span><br>
                {{ archivo.nombre }}<br>
                <span class="text-gray-600">({{ archivo.codigo }})</span>
              </div>
            </vs-td>
            <vs-td>
              <span
                @click="abrirArchivo(archivo.url)"
                class="text-primary cursor-pointer hover:underline text-xs break-all"
              >
                {{ archivo.url }}
              </span>
            </vs-td>
            <vs-td>
              <span class="text-xs">{{ archivo.peso || 'Calculando...' }}</span>
            </vs-td>
            <vs-td>
              <span class="text-xs">{{ archivo.fecha_tarea || '-' }}</span>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>

    <!-- Modal de resultados -->
    <vs-popup title="Resultados de Eliminación" :active.sync="showResultsModal">
      <div class="p-2 sm:p-4">
        <div class="text-sm mb-3">
          <span class="text-success font-semibold">Eliminados: {{ resultadosResumen.eliminados }}</span>
          <span class="ml-4 text-warning font-semibold">No encontrados: {{ resultadosResumen.noEncontrados }}</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-2 py-1 text-left">ID</th>
                <th class="border px-2 py-1 text-left">Código Curso</th>
                <th class="border px-2 py-1 text-left">Archivo</th>
                <th class="border px-2 py-1 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in resultadosEliminacion" :key="r.id">
                <td class="border px-2 py-1">{{ r.id }}</td>
                <td class="border px-2 py-1">{{ r.codigo }}</td>
                <td class="border px-2 py-1 break-all">{{ r.url }}</td>
                <td class="border px-2 py-1">
                  <span :class="r.estado === 'eliminado' ? 'text-success font-semibold' : 'text-danger font-semibold'">
                    {{ r.estado === 'eliminado' ? '✓ Eliminado' : '✗ No encontrado' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center mt-4">
          <vs-button color="primary" @click="showResultsModal = false" class="w-full sm:w-auto">Cerrar</vs-button>
        </div>
      </div>
    </vs-popup>

    <br><br><br><br><br><br><br><br><br><br>
  </vx-card>
</template>
<script>
import vSelect from 'vue-select'
import PeriodoRepository from '@/repositories/PeriodoRepository';

export default {
  components: {
    'v-select': vSelect,
  },
  data() {
    return {
      arrayReporteOriginal: [],
      periodoSelected : '',
      arrayPeriodos   : [],
      region          : 1,
      totalItems: 0,
      page: 1,
      perPage: 500,
      totalPagesServer: 1,
      selectedRows: [],
      showResultsModal: false,
      resultadosEliminacion: [],
      resultadosResumen: { eliminados: 0, noEncontrados: 0 },
      usuario:[],
      ruta:'tareas',
    }
  },
  methods: {
    limpiarDatosYCambiarRegion() {
      this.arrayReporteOriginal = [];
      this.selectedRows = [];
      this.arrayPeriodos = [];
      this.periodoSelected = '';
      this.totalItems = 0;
      this.totalPagesServer = 1;
      this.page = 1;
      this.obtenerPeriodos();
    },
    openConfirmQuitarArchivos() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirmación',
        text: `¿Está seguro de quitar ${this.totalArchivosSeleccionados} archivos de ${this.selectedRows.length} cursos seleccionados?`,
        acceptText: 'Sí, quitar',
        cancelText: 'Cancelar',
        accept: this.removerSeleccionados
      });
    },
    removerSeleccionados() {
      this.$vs.loading();
      // Ahora selectedRows son filas de usuario_tarea directamente
      const ids = this.selectedRows.map(row => row.id);
      let formData = new FormData();
      formData.append('ids', JSON.stringify(ids));
      formData.append('ruta', this.ruta);
      formData.append('usuario_quita_archivos', this.usuario.idusuario);
      this.$http.post(this.$data_url + 'api/removerArchivosTareas', formData)
        .then(res => {
          this.$vs.loading.close();
          if (res.data.status === 1) {
            this.$vs.notify({ text: 'Archivos removidos correctamente.', color: 'primary' });
            if (res.data.resultados && res.data.resultados.length > 0) {
              this.resultadosEliminacion = res.data.resultados;
              this.resultadosResumen = {
                eliminados: res.data.eliminados || 0,
                noEncontrados: res.data.no_encontrados || 0,
              };
              this.showResultsModal = true;
            }
            this.filtrarReporte();
            this.selectedRows = [];
          } else {
            this.$vs.notify({ text: res.data.message || 'Error al remover archivos.', color: 'danger' });
          }
        })
        .catch(err => {
          this.$vs.loading.close();
          this.$vs.notify({ text: 'Error al remover archivos.', color: 'danger' });
          console.error(err);
        });
    },
    abrirArchivo(nombreArchivo) {
      if (nombreArchivo) {
        const urlArchivo = this.$data_url + this.ruta + '/' + nombreArchivo;
        window.open(urlArchivo, '_blank');
      }
    },
    actualizarPesosEnArchivos(archivosConPesos) {
      const mapa = {};
      archivosConPesos.forEach(a => { mapa[a.url] = a; });
      // arrayReporteOriginal ahora es plano, cada item es un archivo
      this.arrayReporteOriginal.forEach(archivo => {
        if (mapa[archivo.url]) {
          this.$set(archivo, 'peso', mapa[archivo.url].peso);
        }
      });
    },
    obtenerPeriodos() {
      this.$vs.loading();
      PeriodoRepository.getPeriodos()
        .then(p => {
          this.arrayPeriodos = p.data;
          this.filtrarPeriodos(p.data);
          this.$vs.loading.close();
        })
        .catch(() => {
          this.$vs.notify({ text: 'Error al cargar los períodos', color: 'danger' });
          this.$vs.loading.close();
        });
    },
    filtrarPeriodos(datos) {
      this.arrayPeriodos = datos.filter(p => p.region_idregion == this.region);
    },
    filtrarReporte() {
      if (!this.periodoSelected) {
        this.$vs.notify({
          text: 'Seleccione un período válido antes de continuar.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
        });
        return;
      }
      this.getCursosArchivos();
    },
    getCursosArchivos() {
      let me = this;
      me.$vs.loading();
      if (!me.periodoSelected) {
        me.$vs.loading.close();
        this.$vs.notify({ text: 'Seleccione un período válido antes de continuar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
        return;
      }

      let url = `${this.$server_url}estudianteMetodosGet?getCursosXPeriodoArchivos=1&idperiodo=${me.periodoSelected}&page=${me.page}&per_page=${me.perPage}`;
      this.$http.get(url)
        .then(function (res) {
          me.arrayReporteOriginal = res.data.data || [];

          me.totalItems      = parseInt(res.data.total) || 0;
          me.page            = parseInt(res.data.page) || 1;
          me.perPage         = parseInt(res.data.per_page) || 50;
          me.totalPagesServer= parseInt(res.data.total_pages) || 1;

          me.f_getPesoArchivo();
          me.selectedRows = [];
          me.$vs.loading.close();
        })
        .catch(function (error) {
          me.arrayReporteOriginal = [];
          me.totalItems = 0;
          me.totalPagesServer = 1;
          me.$vs.loading.close();
          me.$vs.notify({ text: 'Error al cargar los datos.', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
          console.error(error);
        });
    },
    f_getPesoArchivo(){
      let me = this;
      // arrayReporteOriginal es plano, cada item tiene url directamente
      let archivos = me.arrayReporteOriginal.map(item => ({ url: item.url }));
      if (archivos.length === 0) return;

      let formData = new FormData();
      formData.append('ruta', me.ruta);
      formData.append('archivosTareas', JSON.stringify(archivos));

      me.$http.post(me.$data_url + 'api/getFileSize', formData)
        .then(function(res) {
          if (!res.data || res.data.length === 0) return;
          me.actualizarPesosEnArchivos(res.data);
        })
        .catch(function(err) {
          console.error('Error al obtener pesos de archivos:', err);
        });
    },
    cambiarPagina(nuevaPagina) {
      if (nuevaPagina !== this.page && nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
        this.page = nuevaPagina;
        this.getCursosArchivos(); // Ahora sí llamamos al servidor para la nueva página
      }
    },
  },
  computed: {
    totalPages() {
      return this.totalPagesServer || 1;
    },
    visiblePages() {
      let pages = [];
      let start = Math.max(1, this.page - 2);
      let end = Math.min(this.totalPages, this.page + 2);
      for (let i = start; i <= end; i++) pages.push(i);
      if (start > 1) pages.unshift(1);
      if (end < this.totalPages) pages.push(this.totalPages);
      return pages;
    },
    currentPageData() {
      return this.arrayReporteOriginal;
    },
    totalArchivosSeleccionados() {
      return this.selectedRows.length;
    }
  },
  watch: {},
  // ...existing code...
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.obtenerPeriodos();
  }
}
</script>

