<template>
  <div>
    <h1 class="mt-5">Reporte de pedidos de asesores por fechas </h1>
    <br>

    <br>

    <!-- Botón ojito -->
    <vs-button
      type="flat"
      class="p-2"
      icon-pack="fa"
      :icon="showTable ? 'fa-eye-slash' : 'fa-eye'"
      @click="showTable = !showTable"
      color="primary"
      title="Mostrar/Ocultar tabla"
    />
    <br>
    <div>
      <!-- Selección de región y período -->
      <div class="vx-row">
        <div class="vx-col w-1/2 sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
        <span>Seleccione la región</span>
        <ul class="flex mt-2" style="flex-wrap: wrap;">
          <li class="mr-3">
            <vs-radio v-model="region" @input="arrayReporte=[];arrayPeriodos=[];periodoSelected='';filtrarPeriodos();" vs-name="radios1tipoFiltro" vs-value="1">Sierra</vs-radio>
          </li>
          <li class="mr-3">
            <vs-radio v-model="region" @input="arrayReporte=[];arrayPeriodos=[];periodoSelected='';filtrarPeriodos();" vs-name="radios1tipoFiltro" vs-value="2">Costa</vs-radio>
          </li>
        </ul>
        </div>
        <div class="vx-col w-1/2 sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
          <span>Seleccione el período</span>
          <div class="flex">
            <v-select
              :options="arrayPeriodos"
              :reduce="periodo => periodo"
              label="periodoescolar"
              class="w-full mt-2"
              v-model="periodoSelected"
              @input="arrayReporte=[];f_getReporte()"
            />
          </div>
        </div>
      </div>
      <br>
      <!-- Campos de fecha y botones - Responsive -->
      <div class="mb-4">
        <!-- Fechas en una fila en desktop, columnas en móvil -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Fecha inicio -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📅 Fecha inicio (AAAA-MM-DD):
            </label>
            <input
              type="date"
              v-model="fromDate"
              class="w-full p-4 text-lg border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style="min-height: 50px;"
              placeholder="AAAA-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              title="Seleccione la fecha de inicio en formato Año-Mes-Día"
              @input="arrayReporte=[];"
            />
          </div>

          <!-- Fecha fin -->
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📅 Fecha fin (AAAA-MM-DD):
            </label>
            <input
              type="date"
              v-model="toDate"
              class="w-full p-4 text-lg border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style="min-height: 50px;"
              placeholder="AAAA-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              title="Seleccione la fecha fin en formato Año-Mes-Día"
              @input="arrayReporte=[];"
            />
          </div>
        </div>
        <br>
        <!-- Botones centrados -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-3">
          <vs-button
            @click="f_getReporte"
            class="w-full sm:w-auto p-3 shadow-lg hover:shadow-xl transition-all duration-300"
            color="primary"
            icon="refresh"
            type="filled"
            size="large"
          >
            Cargar Reporte
          </vs-button>
          <vs-button
            class="w-full sm:w-auto p-3 shadow-lg hover:shadow-xl transition-all duration-300"
            color="success"
            @click="f_exportar()"
            :disabled="arrayReporte.length === 0"
            icon-pack="fa"
            icon="fa-file-excel"
            type="filled"
            size="large"
          >
             Exportar
          </vs-button>
        </div>
      </div>

      <!-- Cards Totales -->
      <div v-if="arrayReporte.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 mb-5">
        <!-- Total Cantidad -->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">📦 Total Cantidad</h3>
          <p class="text-4xl font-bold text-blue-600 mt-2">
            {{ totalCantidad | filtrarDecimal }}
          </p>
        </div>

        <!-- Total General (suma de todos los totales) -->
        <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
          <h3 class="text-sm text-gray-500">💰 Total General</h3>
          <p class="text-4xl font-bold text-green-600 mt-2">
            ${{ totalGeneral | filtrarDecimal }}
          </p>
        </div>

      </div>

      <div v-if="showTable">
        <vs-table max-items="10" stripe search pagination :data="arrayReporte">
          <template slot="header">
              <vs-chip color="primary">Cantidad: <b> {{ arrayReporte.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Codigo</vs-th>
              <vs-th>Nombre</vs-th>
              <vs-th>Precio</vs-th>
              <vs-th>Cantidad</vs-th>
              <vs-th>Total</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                      {{data[indextr].pro_codigo}}<br>

                  </vs-td>
                  <vs-td>
                      {{data[indextr].nombre_libro}}<br>
                  </vs-td>
                  <vs-td>
                      ${{data[indextr].precio}}<br>
                  </vs-td>
                  <vs-td>
                      {{data[indextr].cantidad}}<br>
                  </vs-td>
                  <vs-td>
                    ${{ tr.total }}
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>

    </div>
  </div>
</template>
<script>
import Generalmix from '../../../../../mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
// Removido flat-pickr, usando input nativo type="date"
import vSelect from 'vue-select'
import * as XLSX from 'xlsx';
import PeriodoRepository from '@/repositories/PeriodoRepository';
export default {
  mixins: [Generalmix],
  components: {
    TableReutilizableVue,
    'v-select': vSelect,
  },
  data() {
    return {
      from:null,
      to:null,
      fromDate: null,
      toDate: null,
      showTable: false,
      arrayReporte: [],
      // Configuración removida, usando input nativo type="date"
      arrayPeriodosOriginal: [],
      arrayPeriodos: [],
      periodoSelected: '',
      region: 1,
    }
  },
  props: {
    periodo_id: {
      type: Number,
      default: null
    },
    nombrePeriodo: {
      type: String,
      default: null
    }
  },
  computed: {
    totalCantidad() {
      return this.arrayReporte.reduce((acc, item) => acc + parseFloat(item.cantidad || 0), 0)
    },
    totalGeneral() {
      return this.arrayReporte.reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
    },
  },
  mounted() {
    this.setDefaultDates();
    this.f_traerPeriodos();
  },
  methods:{
    f_traerPeriodos(){
       PeriodoRepository.getPeriodos().then(response => {
        this.arrayPeriodosOriginal = response.data;
        console.log("arrayPeriodosOriginal cargado:", this.arrayPeriodosOriginal);

        // Ahora que tenemos los períodos, configuramos el período seleccionado si viene como prop
        if(this.periodo_id){
          console.log("Buscando periodo_id:", this.periodo_id);
          this.periodoSelected = this.arrayPeriodosOriginal.find(p => p.idperiodoescolar == this.periodo_id) || '';
          console.log("periodoSelected encontrado:", this.periodoSelected);

          // Si encontramos el período, configuramos la región
          if(this.periodoSelected){
            this.region = this.periodoSelected.region_idregion;
            console.log("región configurada:", this.region);
          }
        }else{
          // si no esta activo el periodo_id activo el showTable a true
          this.showTable = true;
        }

        this.filtrarPeriodos();
       }).catch(error => {
         console.error("Error al cargar períodos:", error);
         this.m_message('Error al cargar los periodos','danger');
       });
    },
    filtrarPeriodos() {
      this.arrayPeriodos = this.arrayPeriodosOriginal.filter(p => p.region_idregion == this.region);
    },
    setDefaultDates() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Primer día del mes actual
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      this.fromDate = this.formatDate(firstDayOfMonth);

      // Fecha actual
      this.toDate = this.formatDate(now);
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    f_getReporte(){
      const fechaInicio = this.fromDate || '';
      const fechaFin = this.toDate || '';
      if(this.periodoSelected === '' || this.periodoSelected === null || this.periodoSelected === undefined){
        this.m_message('Debe seleccionar un período escolar para generar el reporte.','warning')
        return;
      }
      if(fechaInicio === '' || fechaFin === ''){
        this.m_message('Debe seleccionar ambas fechas para generar el reporte.','warning')
        return;
      }
      // la fecha inicio no puede ser mayor a la fecha fin
      if(new Date(fechaInicio) > new Date(fechaFin)){
        this.m_message('La fecha de inicio no puede ser mayor a la fecha fin.','warning')
        return;
      }
      // la fecha final no puede menor a la fecha inicio
      if(new Date(fechaFin) < new Date(fechaInicio)){
        this.m_message('La fecha fin no puede ser menor a la fecha inicio.','warning')
        return;
      }
      this.$vs.loading();
      var url = `metodosGetVentas?getReportePedidoPorFechas=1&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&periodo=${this.periodoSelected.idperiodoescolar}`
      this.$http.get(this.$server_url + url)
      .then((response) => {
        this.$vs.loading.close();
        this.arrayReporte = response.data;
        if(this.arrayReporte.length == 0){
          this.m_message('No se encontraron datos para el período y fechas seleccionados.','warning')
        }
      })
      .catch((error) => {
        this.$vs.loading.close();
        console.error("Error al obtener el reporte:", error);
        this.$vs.notify({
          title: 'Error',
          text: 'No se pudo cargar el reporte. Intente nuevamente.',
          color: 'danger',
          icon: 'error'
        });
      });
    },
    f_exportar() {
      if (this.arrayReporte.length === 0) {
        this.m_message('No hay datos para exportar', 'warning');
        return;
      }

      try {
        // Crear la hoja de Excel con los datos del reporte
        const ws = XLSX.utils.json_to_sheet(this.arrayReporte.map(item => ({
          'Código': item.pro_codigo,
          'Nombre del Libro': item.nombre_libro,
          'Precio': parseFloat(item.precio || 0).toFixed(2),
          'Cantidad': parseInt(item.cantidad || 0),
          'Total': parseFloat(item.total || 0).toFixed(2)
        })));

        // Crear el libro de trabajo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Pedidos por Fechas');

        // Generar el nombre del archivo
        const fechaInicioFormatted = this.fromDate ? this.fromDate.replace(/-/g, '_') : 'sin_fecha';
        const fechaFinFormatted = this.toDate ? this.toDate.replace(/-/g, '_') : 'sin_fecha';
        const nombrePeriodoFormatted = this.periodoSelected.periodoescolar ? this.periodoSelected.periodoescolar.replace(/ /g, '_') : 'Periodo';
        const nombreArchivo = `Pedidos_${fechaInicioFormatted}_a_${fechaFinFormatted}_${nombrePeriodoFormatted}.xlsx`;

        // Descargar el archivo
        XLSX.writeFile(wb, nombreArchivo);

        this.$vs.notify({
          title: 'Éxito',
          text: 'Reporte exportado correctamente',
          color: 'success',
          icon: 'check'
        });
      } catch (error) {
        console.error('Error al exportar:', error);
        this.$vs.notify({
          title: 'Error',
          text: 'Error al exportar el reporte',
          color: 'danger',
          icon: 'error'
        });
      }
    }
  }
}
</script>
