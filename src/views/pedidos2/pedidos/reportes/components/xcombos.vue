<template>
  <div>
    <div v-if="arrayReporte.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      <!-- Card Pedido -->
      <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h3 class="text-gray-600 font-semibold">Total Pedido</h3>
        <p class="text-2xl font-bold text-blue-600">
          {{ currency.format(totalPedidoValor) }}
        </p>
        <p class="text-sm text-gray-500">Cantidad: {{ totalPedido }}</p>
      </div>
      <!-- Card Documentos Venta -->
      <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h3 class="text-gray-600 font-semibold">Total Documentos Venta</h3>
        <p class="text-2xl font-bold text-green-600">
          {{ currency.format(totalDocumentosVentaValor) }}
        </p>
        <p class="text-sm text-gray-500">Cantidad: {{ totalDocumentosVenta }}</p>
      </div>
      <!-- Card Despacho Bodega -->
      <div class="bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h3 class="text-gray-600 font-semibold">Total Despacho Bodega</h3>
        <p class="text-2xl font-bold text-red-600">
          {{ currency.format(totalDespachoBodegaValor) }}
        </p>
        <p class="text-sm text-gray-500">Cantidad: {{ totalDespachoBodega }}</p>
      </div>
    </div>
    <vs-alert>
      <p>Reporte de combos de libros despachados por bodega (liquidados, por liquidarse y regalados)</p>
    </vs-alert>
    <!--botones buscar-->
    <div class="flex items-center mt-5 mb-2">
      <!-- Switch para mostrar/ocultar filtros de tipos de institución -->
      <div class="switch-container ml-4">
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
      <vs-button @click="getReporte" class="p-2 mr-2 ml-5"><i class="fa-solid fa-magnifying-glass"></i> Buscar</vs-button>
      <vs-button v-if="arrayReporte.length > 0" color="success" @click="exportar" class="p-2 mr-2 ml-5"><i class="fa-solid fa-file-excel"></i> Exportar</vs-button>
    </div>

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

    <!-- Filtros de combos -->
    <div v-if="arrayReporte.length > 0" class="flex items-center mb-2 mt-5">
      <vs-radio v-model="filtroCombo" vs-value="100" class="mr-4" @input="filtrarReporte">Todos <b class="ml-1">{{ cantidadTodos }}</b></vs-radio>
      <vs-radio v-model="filtroCombo" vs-value="0" class="mr-4" @input="filtrarReporte">Completos <b class="ml-1">{{ cantidadCompletos }}</b></vs-radio>
      <vs-radio v-model="filtroCombo" vs-value="1" @input="filtrarReporte">Incompletos <b class="ml-1">{{ cantidadIncompletos }}</b></vs-radio>
    </div>
  <vs-table max-items="10" stripe search pagination :data="arrayReporte">
          <template slot="header">
            <vs-chip color="primary" class="mb-2 mr-2">Cantidad: <b> {{ arrayReporte.length }}</b></vs-chip>
            <!-- Total de combos -->
            <div v-if="arrayReporte.length > 0" class="mb-2">
              <vs-chip color="success">Total de combos: <b> {{ totalCombos }}</b></vs-chip>
            </div>
          </template>
          <template slot="thead">
              <vs-th>Código</vs-th>
              <vs-th>Nombre</vs-th>
              <vs-th>Precio</vs-th>
              <vs-th>Pedido</vs-th>
              <vs-th>Documentos Venta</vs-th>
              <vs-th>Despacho Bodega</vs-th>
              <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    {{data[indextr].codigo_liquidacion}}<br>
                    <b>Libros del combo:</b>
                    <p>{{ tr.codigos_combos }}</p>
                    <b>Versión:</b>
                    <p>{{ tr.version }}</p>
                    <b>Nivel:</b>
                    <p>{{ tr.year }}</p>
                  </vs-td>
                  <vs-td>
                    {{data[indextr].nombrelibro}}<br>
                  </vs-td>
                  <vs-td>
                    {{ tr.precio }}<br>
                  </vs-td>
                  <vs-td>
                    {{data[indextr].pedido}}<br>
                  </vs-td>
                  <vs-td>
                    {{data[indextr].documentoVenta}}<br>
                  </vs-td>
                  <vs-td>
                    {{ tr.cantidad }}
                    <div v-if="tr.ifErrorCombo == 1">
                      <p><b class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Faltan códigos en el combo</b></p>
                    </div>
                  </vs-td>
                  <vs-td>
                    <!--Ver combos etiquetas-->
                    <vs-button @click="ObjectSelected=tr;verCombosEtiquetas(tr)" color="#6ec1e4" class="p-2"><i class="fa-solid fa-tags"></i> Ver combo etiquetas</vs-button>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>
      <!--MODALES-->
      <vs-popup fullscreen classContent="popup-example" title="Mostrar combos etiquetas" :active.sync="popupMostarDetalle">
        <div v-if="popupMostarDetalle">
          <xcombosDetalle :periodo_id="periodo_id" :comboLibro="ObjectSelected.codigo_liquidacion" :codigos_combos="ObjectSelected.codigos_combos" :codigosPorCombo="ObjectSelected.codigosPorCombo"/>
        </div>
      </vs-popup>
  </div>
</template>
<script>
import Codigosmix from "@/mixins/Codigosmix";
import Generalmix from '../../../../../mixins/Generalmix';
const xcombosDetalle = () => import("./xcombosDetalle.vue");
export default {
  mixins: [Generalmix,Codigosmix],
  components: {
    xcombosDetalle
  },
  data(){
    return {
      arrayOriginal: [],
      arrayReporte: [],
      filtroCombo: 100,
      ObjectSelected: {},
      popupMostarDetalle: false,
      arrayTipoInstituciones: [],
      tiposInstitucionIncluir: [], // Array para almacenar los IDs de instituciones a incluir (checkeadas)
      showFilters: false, // Controla si se muestran los filtros
    }
  },
  props: {
    periodo_id: {
      type: Number,
      default: 0,
    },
    nombrePeriodo: {
      type: String,
      default: '',
    },
    periodoSelect: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  mounted() {
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
    cantidadTodos() {
      return this.arrayOriginal.length;
    },
    cantidadCompletos() {
      return this.arrayOriginal.filter(item => item.ifErrorCombo != 1).length;
    },
    cantidadIncompletos() {
      return this.arrayOriginal.filter(item => item.ifErrorCombo == 1).length;
    },
    totalCombos() {
      // Suma la columna cantidad de los combos
      return this.arrayReporte.reduce((acc, item) => acc + (parseInt(item.cantidad) || 0), 0);
      },
      totalPedido() {
        return this.arrayReporte.reduce((acc, item) => acc + parseFloat(item.pedido || 0), 0);
      },
      totalDocumentosVenta() {
        return this.arrayReporte.reduce((acc, item) => acc + parseFloat(item.documentoVenta || 0), 0);
      },
      totalDespachoBodega() {
        return this.arrayReporte.reduce((acc, item) => acc + parseFloat(item.cantidad || 0), 0);
      },
      totalPedidoValor() {
        return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.pedido || 0) * parseFloat(item.precio || 0)), 0);
      },
      totalDocumentosVentaValor() {
        return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.documentoVenta || 0) * parseFloat(item.precio || 0)), 0);
      },
      totalDespachoBodegaValor() {
        return this.arrayReporte.reduce((acc, item) => acc + (parseFloat(item.cantidad || 0) * parseFloat(item.precio || 0)), 0);
      },
      currency() {
        return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
    }
  },
  methods: {
    filtrarReporte() {
      if (this.filtroCombo == 100) {
        this.arrayReporte = this.arrayOriginal;
      } else if (this.filtroCombo == 0) {
        this.arrayReporte = this.arrayOriginal.filter(item => item.ifErrorCombo != 1);
      } else if (this.filtroCombo == 1) {
        this.arrayReporte = this.arrayOriginal.filter(item => item.ifErrorCombo == 1);
      } else {
        this.arrayReporte = this.arrayOriginal;
      }
    },
    verCombosEtiquetas(){
      this.popupMostarDetalle = true;
    },
    getReporte() {
      let me = this;

      // Validar que al menos un tipo de institución esté seleccionado
      if (me.tiposInstitucionIncluir.length === 0) {
        me.$vs.notify({
          title: 'Error de Validación',
          text: 'Debe seleccionar al menos un tipo de institución para generar el reporte',
          color: 'danger',
          icon: 'warning'
        });
        return;
      }

      me.totalDespachadosBodega = 0;
      me.$vs.loading();

      // Construir URL base
      let baseUrl = `metodosGetCodigos?getReporteCombosDespachados=1&periodo=${me.periodo_id}`;

      // Agregar filtro de tipos de institución
      let tiposIncluir = me.tiposInstitucionIncluir;
      baseUrl += `&tipoInstitucionIncluir=${tiposIncluir.join(',')}`;

      this.$http.get(this.$server_url + baseUrl)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayOriginal = res.data;
          if(me.arrayOriginal.length == 0){
            me.$vs.notify({
              title: 'Sin resultados',
              text: 'No se encontraron combos despachados para los filtros seleccionados.',
              color: 'warning',
              icon: 'warning'
            });
            return;
          }
          me.filtrarReporte();
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close();
        });
    },
    exportar() {
      let me = this;
      // Copia profunda de arrayReporte y agrega estado combo
      let codeExport = JSON.parse(JSON.stringify(me.arrayReporte)).map(item => {
        return {
          codigo_liquidacion: item.codigo_liquidacion,
          nombrelibro: item.nombrelibro,
          precio: item.precio,
          pedido: item.pedido,
          documentoVenta: item.documentoVenta,
          cantidad: item.cantidad,
          codigos_combos: item.codigos_combos,
          version: item.version,
          year: item.year,
          estado_combo: item.ifErrorCombo == 1 ? 'Faltan códigos en el combo' : ''
        };
      });
      let nameFile = 'Reporte_Combos_' + (me.nombrePeriodo || 'Periodo');
      let headers = ['Código','Nombre','Precio','Pedido','Documentos Venta','Despacho Bodega','Libros del combo','Versión','Nivel','Estado Combo'];
      let fieldKeys = ['codigo_liquidacion','nombrelibro','precio','pedido','documentoVenta','cantidad','codigos_combos','version','year','estado_combo'];
      if (typeof me.m_exportTodo === 'function') {
        me.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else {
        me.m_message('Función de exportación no disponible', 'danger', 'icon-alert-triangle');
      }
    },
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
    selectAllInstitutions() {
      // Seleccionar todas las instituciones para incluir
      this.tiposInstitucionIncluir = this.arrayTipoInstituciones.map(inst => inst.id);
      // Limpiar resultados para evitar confusión
      this.clearResults();
      // Ejecutar búsqueda automáticamente después de seleccionar todo
      this.getReporte();
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
      this.arrayOriginal = [];
      this.arrayReporte = [];

      // Mostrar mensaje informativo
      this.$vs.notify({
        title: 'Filtros Modificados',
        text: 'Presiona "Buscar" para actualizar los resultados con los nuevos filtros',
        color: 'primary',
        icon: 'info'
      });
    },
    getIncludedInstitutionsNames() {
      // Obtener los nombres de las instituciones incluidas (marcadas)
      return this.arrayTipoInstituciones
        .filter(inst => this.tiposInstitucionIncluir.includes(inst.id))
        .map(inst => inst.descripcion)
        .join(', ');
    },
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
