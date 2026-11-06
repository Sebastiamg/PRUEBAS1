<template>
  <div>
    <div>
      <!-- Título -->
      <h1 class="mt-5">Reporte codigos individuales de {{ nombrePeriodo }}</h1>
      <small>(sin liquidar, liquidados, regalados)</small>
      <br />

      <!-- Botón Mostrar/Ocultar tabla -->
      <vs-button
        type="flat"
        class="p-2"
        icon-pack="fa"
        :icon="showTable ? 'fa-eye-slash' : 'fa-eye'"
        @click="showTable = !showTable"
        color="primary"
        title="Mostrar/Ocultar tabla"
      ></vs-button>
      <div>
        <!-- Switch para mostrar/ocultar filtros de tipos de institución -->
        <div class="switch-container mt-4">
          <label class="switch-label">
            <input
              type="checkbox"
              v-model="showFilters"
              class="switch-input"
            >
            <span class="switch-slider"></span>
            <span class="switch-text">{{ showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros de Institución' }}</span>
          </label>
        </div>
        <br>
      </div>
      <!--FILTRO TIPO INSTITUCION-->
      <!-- Panel de selección de tipos de institución -->
      <div v-if="showFilters" class="filter-panel">
        <div class="filter-header">
          <div class="filter-title-section">
            <div class="filter-icon-wrapper">
              <i class="fas fa-filter"></i>
            </div>
            <div>
              <h3 class="filter-title">Configuración de Filtros</h3>
              <p class="filter-subtitle">Tipos de Institución</p>
            </div>
          </div>
          <div class="filter-actions">
            <button
              @click="selectAllInstitutions()"
              class="btn-action btn-select"
            >
              <i class="fas fa-check-double"></i>
              <span>Seleccionar Todo</span>
            </button>
            <button
              @click="unselectAllInstitutions()"
              class="btn-action btn-unselect"
            >
              <i class="fas fa-times-circle"></i>
              <span>Deseleccionar Todo</span>
            </button>
          </div>
        </div>
        <!-- Contenido del panel -->
        <div class="filter-content">
          <div class="filter-info">
            <div class="info-icon">
              <i class="fas fa-info-circle"></i>
            </div>
            <div class="info-text">
              <p><strong>Instrucciones:</strong> Marca los tipos de instituciones que deseas <strong>incluir</strong> en el reporte.</p>
              <p class="info-note">Por defecto todas están marcadas (incluidas). <strong>Debes seleccionar al menos una institución.</strong> Estos filtros afectarán únicamente a los combos despachados.</p>
            </div>
          </div>

          <div class="institutions-grid">
            <div
              v-for="institucion in arrayTipoInstituciones"
              :key="institucion.id"
              class="institution-card"
            >
              <label :for="`institucion_${institucion.id}`" class="institution-label">
                <input
                  type="checkbox"
                  :id="`institucion_${institucion.id}`"
                  :value="institucion.id"
                  v-model="tiposInstitucionIncluir"
                  class="institution-checkbox"
                >
                <div class="checkbox-custom">
                  <i class="fas fa-check checkbox-icon"></i>
                </div>
                <span class="institution-name">{{ institucion.descripcion }}</span>
              </label>
            </div>
          </div>

          <div v-if="tiposInstitucionIncluir.length > 0" class="exclusions-summary">
            <p class="exclusions-text">
              <i class="fas fa-check-circle exclusions-icon" style="color: #10b981;"></i>
              <strong>Incluidos en el reporte:</strong> {{ getIncludedInstitutionsNames() }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
          <div>
            <p>Seleccione la serie </p>
            <v-select
              :options="arraySeries"
              :reduce="arraySeries => arraySeries.id_serie"
              label="nombre_serie"
              placeholder="--Seleccione--"
              class="w-full"
              v-model="serieSelected"
              @input="arrayReporte=[];"
            />
          </div>
          <div class="flex gap-3 items-end">
            <vs-button class="p-2" @click="f_getReporte()">Generar Reporte</vs-button>
            <vs-button class="p-2" color="success" @click="f_exportar()" :disabled="arrayReporte.length === 0">
              <i class="fa-solid fa-file-arrow-down"></i> Exportar
            </vs-button>
          </div>
        </div>
        <!--totales-->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          <!--total cantidad codigos-->
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total Cantidad Códigos</h3>
            <p class="text-4xl font-bold text-blue-600 mt-2">
              {{ totalCantidadCodigos | filtrarDecimal }}
            </p>
          </div>

          <!--total en dolares-->
          <div class="flex flex-col items-center justify-center bg-white border rounded-lg shadow p-6">
            <h3 class="text-sm text-gray-500">Total</h3>
            <p class="text-4xl font-bold text-green-600 mt-2">
              ${{ totalDolares | filtrarDecimal }}
            </p>
          </div>
        </div>

        <!--tabla-->
        <div v-if="arrayReporte.length > 0 && showTable" class="mt-5">
          <vs-table max-items="10" search pagination :data="arrayReporte">
            <template slot="header">
              <vs-chip color="primary">
                Libros: <b>{{ arrayReporte.length }}</b> &nbsp;
              </vs-chip>
            </template>

            <template slot="thead">
              <vs-th>Código</vs-th>
              <vs-th>Nombre del libro</vs-th>
              <vs-th>Serie</vs-th>
              <vs-th sort-key="cantidad_despachada">cantidad</vs-th>
              <vs-th sort-key="precio">precio</vs-th>
              <vs-th sort-key="despachoBodega">total</vs-th>
              <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  #{{ tr.libro_idReal }} <br>
                  {{ data[indextr].codigo_liquidacion }}
                </vs-td>
                <vs-td>{{ data[indextr].nombrelibro }}</vs-td>
                <vs-td>{{ data[indextr].serie }}</vs-td>
                <vs-td>
                  {{ tr.cantidad_despachada }}
                </vs-td>
                <vs-td>
                  {{ tr.precio }}
                </vs-td>
                <vs-td>
                  ${{ tr.despachoBodega | filtrarDecimal }}
                </vs-td>
                <vs-td>
                  <vs-button
                    type="filled"
                    icon-pack="fa"
                    icon="fa-eye"
                    class="p-2"
                    color="primary"
                    title="Ver códigos regalados"
                    @click="ObjectSelected=tr;f_mostrarDetalles(data[indextr])"
                  >Ver detalles</vs-button>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
        <vs-popup classContent="popup-example" fullscreen class="informacionformHijo"
            title="Mostrar detalle" :active.sync="popupMostrarCodigos">

            <!-- Tabla reutilizable dentro del popup -->
            <div v-if="arrayCodigosDetalle.length > 0">

              <TableReutilizableVue
                :title="'Códigos individuales' + ' del libro: ' + (ObjectSelected.nombrelibro || '')"
                :headers="['Código','Código Liquidación','Libro','Documento de venta','Empresa documento','Factura','Tipo de venta','Institucion bc institucion','Institucion venta lista ','Quitado del reporte','Combo','Combo etiqueta']"
                :fieldKeys="['codigo_libro','codigo_liquidacion','nombrelibro','codigo_proforma','proforma_empresa','factura','venta_estado','institucionBcInstitucion','institucionVentaListaInstitucion','quitar_de_reporte','combo','codigo_combo']"
                :ifexportar="1"
                :tableData="arrayCodigosDetalle"
                :nombrearchivo="'Codigos_Individuales_' + (ObjectSelected.institucion || '') + '_' + (nombrePeriodo || 'Periodo').replace(/ /g,'_')"
              />
            </div>
        </vs-popup>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import Generalmix from '../../../../../mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
import * as XLSX from 'xlsx';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
  mixins: [Generalmix, Codigosmix],
  name: "ReporteVentasGlobalLibros",
  components: {
    vSelect,
    TableReutilizableVue
  },
  props: {
    periodo_id: {
      type: Number,
      required: true,
    },
    nombrePeriodo: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showTable: false, // Estado para mostrar/ocultar la tabla
      arrayReporte: [], // Datos del reporte
      ObjectSelected: '',
      arrayCodigosDetalle: [],
      popupMostrarCodigos: false,
      serieSelected: '',
      arraySeries: [],
      showFilters: false, // Controla si se muestran los filtros
      opcionesDistribuidor: [
        { label: 'Todos', value: 'todos' },
        { label: 'Solo distribuidores', value: 'si' },
        { label: 'Sin distribuidores', value: 'no' },
      ],
      tiposInstitucionIncluir: [], // Tipos de institución seleccionados para incluir
      arrayTipoInstituciones: [], // Lista completa de tipos de institución
    };
  },
  mounted() {
    this.getSeries()
    this.getTipoInstitucion();
  },
  watch: {
    // Detectar cambios en las instituciones a incluir y limpiar resultados
    tiposInstitucionIncluir: {
      handler(newVal, oldVal) {
        // Solo limpiar si ya hay resultados y hay un cambio real
        if (this.arrayReporte.length > 0 && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.clearResults();
        }
      },
      deep: true
    }
  },
  computed: {
    totalCantidadCodigos() {
      return this.arrayReporte.reduce((total, item) => {
        return total + (parseInt(item.cantidad_despachada) || 0);
      }, 0);
    },
    totalDolares() {
      return this.arrayReporte.reduce((total, item) => {
        return total + (parseFloat(item.despachoBodega) || 0);
      }, 0);
    },
    totalNormales() {
      return this.arrayReporte.reduce((total, item) => {
        return total + (parseInt(item.cantidad_normales) || 0);
      }, 0);
    },
    totalQuitados() {
      return this.arrayReporte.reduce((total, item) => {
        return total + (parseInt(item.cantidad_quitados) || 0);
      }, 0);
    }
  },
  methods:{

    getSeries() {
      let me = this;
      // me.$vs.loading();
      this.$http.get(this.$server_url+'series')
      .then(function (res) {
          // me.$vs.loading.close()
          me.arraySeries = res.data.filter(item => item.ser_estado === 1)
          //agregar opcion todos
          me.arraySeries.unshift({ id_serie: 'todos', nombre_serie: 'Todos' })
      })
      .catch(function (error) {
          console.log(error + ' error');
          // me.$vs.loading.close()
      })
    },
    f_getReporte(){
      let me = this
      if(me.serieSelected == '' || me.serieSelected == null || me.serieSelected === undefined){
        this.$vs.notify({
          title: 'Atención',
          text: 'Debe seleccionar una serie',
          color: 'danger',
        })
        return
      }
      me.$vs.loading();
      // Construir URL base
      let baseUrl = `metodosGetCodigos?getReporteCodigosTodosXSerie=1&periodo_id=${me.periodo_id}&id_serie=${me.serieSelected}&todosCodigos=1`;
      // Agregar filtro de tipos de institución
      let tiposIncluir = me.tiposInstitucionIncluir;
      baseUrl += `&tipoInstitucionIncluir=${tiposIncluir.join(',')}`;
      this.$http.get(this.$server_url + baseUrl)
      .then(function (res) {
        me.$vs.loading.close()
        me.arrayReporte = res.data;
        if(me.arrayReporte.length===0){
          me.$vs.notify({
            title: 'Información',
            text: 'No se encontraron datos para el periodo y serie seleccionados',
            color: 'warning',
          })
        }else{
          me.arrayReporte.forEach(item => {
            item.despachoBodega = parseFloat(item.despachoBodega) || 0;
            item.precio = parseFloat(item.precio) || 0;
          });
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
     // Selecciona todas las instituciones
    getTipoInstitucion() {
      let me = this;
      this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
      .then(function (res) {
         me.arrayTipoInstituciones = res.data.data;
         // Marcar todos los checkboxes por defecto
         me.tiposInstitucionIncluir = me.arrayTipoInstituciones.map(inst => inst.id);
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_mostrarDetalles(item) {
      let me = this;
      me.arrayCodigosDetalle = [];
      me.$vs.loading();
      let baseUrl = `metodosGetCodigos?getReporteCodigosTodosXSerieCodigos=1&periodo_id=${me.periodo_id}&libro_idReal=${item.libro_idReal}`;
      let tiposIncluir = me.tiposInstitucionIncluir;
      baseUrl += `&tipoInstitucionIncluir=${tiposIncluir.join(',')}`;
      this.$http.get(this.$server_url + baseUrl)
      .then(function (res) {
        me.$vs.loading.close()
        me.arrayCodigosDetalle = res.data;
        if(me.arrayCodigosDetalle.length===0){
          me.m_message('No se encontraron códigos para este libro', 'warning')
          return
        }
        me.popupMostrarCodigos = true;
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
        me.m_message('Error al cargar los códigos', 'danger')
      })
    },
    selectAllInstitutions() {
      // Seleccionar todas las instituciones para incluir
      this.tiposInstitucionIncluir = this.arrayTipoInstituciones.map(inst => inst.id);
      // Limpiar resultados para evitar confusión
      this.clearResults();
      // Ejecutar búsqueda automáticamente después de seleccionar todo
      this.f_getReporte();
    },
    unselectAllInstitutions() {
      // Deseleccionar todas las instituciones
      this.tiposInstitucionIncluir = [];
      // Limpiar resultados para evitar confusión
      this.clearResults();

      // Mostrar advertencia sobre la necesidad de seleccionar al menos una institución
      this.$vs.notify({
        title: 'Advertencia',
        text: 'Recuerda seleccionar al menos un tipo de institución antes de buscar',
        color: 'warning',
        icon: 'info'
      });
    },
    clearResults() {
      // Limpiar resultados cuando cambian los filtros
      this.arrayReporte = [];

      // Mostrar mensaje informativo
      this.$vs.notify({
        title: 'Filtros Modificados',
        text: 'Presiona "Buscar" para actualizar los resultados con los nuevos filtros',
        color: 'primary',
        icon: 'info'
      });
    },
    // METODOS PARA EL FILTRO DE INSTITUCIONES
    getIncludedInstitutionsNames() {
      // Obtener los nombres de las instituciones incluidas (marcadas)
      return this.arrayTipoInstituciones
        .filter(inst => this.tiposInstitucionIncluir.includes(inst.id))
        .map(inst => inst.descripcion)
        .join(', ');
    },
    f_exportar() {
      let nombreSerie = this.arraySeries.find(serie => serie.id_serie === this.serieSelected).nombre_serie;
      // Exportar ambas tablas en un solo archivo Excel con dos hojas
      const ws1 = XLSX.utils.json_to_sheet(this.arrayReporte.map(item => ({
        'Nombre del libro': item.nombrelibro,
        'Serie': item.serie,
        'Cantidad': item.cantidad_despachada,
        'Precio': item.precio,
        'Total': item.despachoBodega
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'Codigos Individuales');
      const nombreArchivo = `Reporte_codigos_Individuales_${nombreSerie}_${this.nombrePeriodo || 'Periodo'}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    }
  }
};
</script>
<style scoped>
/* Estilos para el switch de filtros */
.switch-container {
  display: flex;
  align-items: center;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
  font-size: 14px;
}

.switch-input {
  display: none;
}

.switch-slider {
  position: relative;
  width: 50px;
  height: 24px;
  background-color: #cbd5e0;
  border-radius: 24px;
  transition: background-color 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-input:checked + .switch-slider {
  background-color: #3b82f6;
}

.switch-input:checked + .switch-slider::before {
  transform: translateX(26px);
}

.switch-text {
  font-size: 14px;
  user-select: none;
  transition: color 0.3s ease;
}

.switch-label:hover .switch-text {
  color: #3b82f6;
}

.switch-input:checked + .switch-slider + .switch-text {
  color: #3b82f6;
}

/* Estilos para el panel de filtros */
.filter-panel {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-top: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.filter-header {
  background: linear-gradient(135deg, #475569 0%, #64748b 100%);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.filter-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-icon-wrapper {
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-icon-wrapper i {
  font-size: 16px;
  color: #3b82f6;
}

.filter-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 2px 0;
  letter-spacing: -0.025em;
}

.filter-subtitle {
  font-size: 13px;
  color: #cbd5e1;
  margin: 0;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-action:hover::before {
  left: 100%;
}

.btn-select {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: #2563eb;
}

.btn-select:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.btn-unselect {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border-color: #ea580c;
}

.btn-unselect:hover {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(234, 88, 12, 0.3);
}

.filter-content {
  padding: 20px;
}

.filter-info {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.info-icon {
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.info-text p {
  margin: 0 0 8px 0;
  color: #1e40af;
  font-size: 14px;
  line-height: 1.5;
}

.info-note {
  font-size: 13px !important;
  color: #64748b !important;
  font-style: italic;
}

.institutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 20px;
}

.institution-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.institution-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.institution-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.institution-checkbox {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-icon {
  color: white;
  font-size: 10px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

.institution-checkbox:checked + .checkbox-custom {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #059669;
}

.institution-checkbox:checked + .checkbox-custom .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}

.institution-card:has(.institution-checkbox:checked) {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #10b981;
}

.institution-name {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
  transition: color 0.3s ease;
  line-height: 1.3;
}

.institution-card:has(.institution-checkbox:checked) .institution-name {
  color: #059669;
}

.exclusions-summary {
  margin-top: 12px;
}

.exclusions-text {
  background: #f0fdf4;
  border: 1px solid #10b981;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 0;
  font-size: 13px;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 8px;
}

.exclusions-icon {
  color: #10b981;
  flex-shrink: 0;
}

/* Iconos Font Awesome para compatibilidad */
.fas {
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .filter-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 12px 16px;
  }

  .filter-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .filter-content {
    padding: 16px;
  }

  .institutions-grid {
    grid-template-columns: 1fr;
  }

  .filter-info {
    flex-direction: column;
    text-align: center;
  }

  .switch-label {
    font-size: 12px;
  }

  .switch-text {
    font-size: 12px;
  }
}
</style>

