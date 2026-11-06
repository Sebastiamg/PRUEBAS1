<template>
  <div>
    <div class="con-tab-ejemplo">
      <!-- Botón de recarga -->
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Reporte de Contratos de códigos sueltos diferente de devueltos</h2>
        <div class="flex gap-2">
          <vs-button
            color="success"
            type="filled"
            icon-pack="feather"
            icon="icon-download"
            @click="exportar()"
            :disabled="!arrayReporte.asesores || arrayReporte.asesores.length === 0">
            Exportar
          </vs-button>
          <vs-button
            color="primary"
            type="filled"
            icon-pack="feather"
            icon="icon-refresh-cw"
            @click="f_getReporte()"
            :disabled="!periodoSelect">
            Recargar Reporte
          </vs-button>
        </div>
      </div>

      <!-- Descripción del reporte -->
      <div class="mb-4">
        <p class="text-gray-600">Este reporte es de la tabla códigos libros unión con los pedidos para saber qué contratos están liquidados y cuáles no.</p>
      </div>

      <!-- Resumen Ejecutivo Total -->
      <div v-if="arrayReporte.sin_contrato || (arrayReporte.asesores && arrayReporte.asesores.length > 0)" class="mb-4">
        <vs-card class="executive-summary-compact">
          <div slot="header">
            <h3 class="text-lg font-bold text-center text-gray-800">
              <feather-icon icon="BarChart3Icon" class="mr-2"></feather-icon>
              Resumen Reporte
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="compact-metric">
              <div class="compact-header">
                <feather-icon icon="PackageIcon" class="compact-icon"></feather-icon>
                <span class="compact-title">Cantidad Total códigos</span>
              </div>
              <div class="compact-value">{{ formatNumber(totalCantidadEjecutiva) }}</div>
              <div class="compact-details">
                <span class="compact-detail">Con contratos: <b>{{ formatNumber(totalCantidadGeneral) }}</b></span>
                <span class="compact-detail">Sin contratos: <b>{{ formatNumber(arrayReporte.sin_contrato ? arrayReporte.sin_contrato.cantidad : 0) }}</b></span>
              </div>
            </div>

            <div class="compact-metric">
              <div class="compact-header">
                <feather-icon icon="DollarSignIcon" class="compact-icon"></feather-icon>
                <span class="compact-title">Venta Bruta</span>
              </div>
              <div class="compact-value">${{ formatCurrency(totalMontoEjecutivo) }}</div>
              <div class="compact-details">
                <span class="compact-detail">Con contratos: <b>${{ formatCurrency(totalMontoGeneral) }}</b></span>
                <span class="compact-detail">Sin contratos: <b>${{ formatCurrency(arrayReporte.sin_contrato ? parseFloat(arrayReporte.sin_contrato.total) : 0) }}</b></span>
              </div>
            </div>

            <div class="compact-metric">
              <div class="compact-header">
                <feather-icon icon="TrendingUpIcon" class="compact-icon"></feather-icon>
                <span class="compact-title">Métricas</span>
              </div>
              <div class="compact-metrics-grid">
                <span class="compact-metric-item">Asesores: <strong>{{ arrayReporte.asesores ? arrayReporte.asesores.length : 0 }}</strong></span>
                <span class="compact-metric-item">Contratos: <strong>{{ totalContratosGeneral }}</strong></span>
                <span class="compact-metric-item">Contratos Liquidados: <strong class="text-green">{{ totalContratosLiquidados }}</strong></span>
                <span class="compact-metric-item">Contratos No Liquidados: <strong class="text-red">{{ totalContratosNoLiquidados }}</strong></span>
              </div>
            </div>
          </div>
        </vs-card>
      </div>

      <!-- Filtros de tabla -->
      <div class="mb-4 flex flex-wrap gap-4 items-center" v-if="arrayReporte.asesores && arrayReporte.asesores.length > 0">
        <div class="filter-option">
          <vs-checkbox v-model="filtrarSoloConPendientes" color="warning">
            Mostrar solo asesores con contratos pendientes de liquidar
          </vs-checkbox>
        </div>
        <div v-if="filtrarSoloConPendientes" class="filter-info">
          <vs-chip color="warning" text-color="rgb(255,255,255)">
            <feather-icon icon="AlertTriangleIcon" class="mr-1" style="width: 14px; height: 14px;"></feather-icon>
            {{ asesoresConPendientes.length }} asesores con pendientes
          </vs-chip>
        </div>
      </div>

      <!-- Tabla de Asesores -->
      <div v-if="asesoresParaMostrar.length > 0">
        <vs-table max-items="10" search pagination :data="asesoresParaMostrar">
          <template slot="header">
            <vs-chip color="primary">
              Asesores mostrados: <b>{{ asesoresParaMostrar.length }}</b>
              <span v-if="filtrarSoloConPendientes"> (con pendientes)</span>
              <span v-else> (total: {{ arrayReporte.asesores.length }})</span>
            </vs-chip>
          </template>
          <template slot="thead">
            <vs-th width="180">Asesor</vs-th>
            <vs-th width="120">Total Contratos</vs-th>
            <vs-th width="140">Contratos Liquidados</vs-th>
            <vs-th width="130">Cantidad códigos</vs-th>
            <vs-th width="130">Venta bruta</vs-th>
            <vs-th width="100">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <div class="flex items-center">
                  <div>
                    #{{ tr.id_asesor }}
                    <p class="font-semibold">{{ tr.nombre }}</p>
                  </div>
                </div>
              </vs-td>
              <vs-td>
                <vs-chip color="success">{{ tr.contratos.length }}</vs-chip>
              </vs-td>
              <vs-td>
                <div class="contract-status">
                  <span class="status-liquidado">
                    <feather-icon icon="CheckCircleIcon" class="status-icon"></feather-icon>
                    {{ getContratosLiquidados(tr.contratos) }}
                  </span>
                  <span class="status-no-liquidado">
                    <feather-icon icon="XCircleIcon" class="status-icon"></feather-icon>
                    {{ getContratosNoLiquidados(tr.contratos) }}
                  </span>
                </div>
              </vs-td>
              <vs-td>
                <p class="font-semibold">{{ formatNumber(getTotalCantidad(tr.contratos)) }}</p>
              </vs-td>
              <vs-td>
                <p class="font-semibold text-green-600">${{ formatCurrency(getTotalMonto(tr.contratos)) }}</p>
              </vs-td>
              <vs-td>
                <vx-tooltip text="Ver contratos" position="top" color="primary">
                  <vs-button
                    class="modal-default-button"
                    size="small"
                    color="primary"
                    @click="openContractsModal(tr)"
                    type="filled"
                    icon-pack="feather"
                    icon="icon-eye">
                  </vs-button>
                </vx-tooltip>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <div v-else-if="arrayReporte.asesores && arrayReporte.asesores.length === 0" class="p-3">
        <p>No existen asesores con contratos para el período seleccionado.</p>
      </div>

      <div v-else-if="filtrarSoloConPendientes && asesoresParaMostrar.length === 0" class="p-3">
        <div class="text-center">
          <feather-icon icon="CheckCircleIcon" class="mx-auto mb-2 text-green-500" style="width: 48px; height: 48px;"></feather-icon>
          <p class="text-lg font-semibold text-green-600">¡Excelente!</p>
          <p class="text-gray-600">Todos los asesores tienen sus contratos liquidados.</p>
        </div>
      </div>

      <div v-else class="p-3">
        <p>Cargando datos del reporte...</p>
      </div>
    </div>

    <!-- Modal para mostrar contratos del asesor -->
    <vs-popup classContent="popup-example" title="Contratos del Asesor" :active.sync="popupContracts">
      <div v-if="selectedAsesor">
        <h4 class="mb-4 text-lg font-semibold">{{ selectedAsesor.nombre }} (ID: {{ selectedAsesor.id_asesor }})</h4>

        <!-- Filtro para contratos del modal -->
        <div class="mb-4 flex flex-wrap gap-4 items-center">
          <div class="filter-option">
            <vs-checkbox v-model="filtrarContratosNoLiquidados" color="warning">
              Mostrar solo contratos no liquidados
            </vs-checkbox>
          </div>
          <div v-if="filtrarContratosNoLiquidados" class="filter-info">
            <vs-chip color="warning" text-color="rgb(255,255,255)">
              <feather-icon icon="XCircleIcon" class="mr-1" style="width: 14px; height: 14px;"></feather-icon>
              {{ contratosParaMostrarModal.length }} contratos no liquidados
            </vs-chip>
          </div>
        </div>

        <vs-table stripe search :data="contratosParaMostrarModal" max-items="15">
          <template slot="header">
            <div class="flex justify-between items-center w-full">
              <vs-chip color="primary">
                Contratos mostrados: <b>{{ contratosParaMostrarModal.length }}</b>
                <span v-if="filtrarContratosNoLiquidados"> (no liquidados)</span>
                <span v-else> (total: {{ selectedAsesor.contratos.length }})</span>
              </vs-chip>
              <vs-button
                color="success"
                size="small"
                type="filled"
                icon-pack="feather"
                icon="icon-download"
                @click="exportarContratosAsesor()">
                Exportar
              </vs-button>
            </div>
          </template>
          <template slot="thead">
            <vs-th>Contrato</vs-th>
            <vs-th>Cantidad</vs-th>
            <vs-th>Total</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="contract" :key="index" v-for="(contract, index) in data">
              <vs-td>
                <div class="contract-cell">
                  <vs-chip color="dark">{{ contract.contrato }}</vs-chip>
                  <p> <b>Tipo de venta:</b> {{ contract.tipo_venta_descr }}</p>
                  <b>Institución:</b>
                  <p>{{ contract.nombreInstitucion }}</p>
                  <div class="status-container">
                    <span v-if="parseInt(contract.cantidad || 0) > 0" class="contract-status-badge liquidado">
                      <b>Liquidado</b>
                    </span>
                    <span v-else class="contract-status-badge no-liquidado">
                      <b>No Liquidado</b>
                    </span>

                  </div>
                </div>
              </vs-td>
              <vs-td>
                {{ formatNumber(contract.cantidad) }}
              </vs-td>
              <vs-td>
                <span class="font-semibold text-green-600">${{ formatCurrency(contract.total) }}</span>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>

        <div class="mt-4 p-4 bg-gray-100 rounded-lg">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Total Contratos:</p>
              <p class="text-lg font-bold">{{ selectedAsesor.contratos.length }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Cantidad Total códigos:</p>
              <p class="text-lg font-bold">{{ formatNumber(getTotalCantidad(selectedAsesor.contratos)) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Monto Total:</p>
              <p class="text-lg font-bold text-green-600">${{ formatCurrency(getTotalMonto(selectedAsesor.contratos)) }}</p>
            </div>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import FeatherIcon from '@/components/FeatherIcon.vue'
import Generalmix from '@/mixins/Generalmix'
import Codigosmix from "@/mixins/Codigosmix";

export default {
  mixins: [Generalmix, Codigosmix],
  components: {
    FeatherIcon
  },
  data() {
    return {
      arrayReporte: {
        asesores: [],
        sin_contrato: null
      },
      popupContracts: false,
      selectedAsesor: null,
      filtrarSoloConPendientes: false,
      filtrarContratosNoLiquidados: false
    }
  },
  props: {
    periodoSelect: {
      type: Number,
      required: true
    }
  },
  methods: {
    f_getReporte() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + `metodosGetVerificaciones?getReporteSueltosContratosLiquidadoYNoLiquidados=1&id_periodo=${this.periodoSelect}`)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayReporte = res.data;
        })
        .catch(function (error) {
          me.$vs.loading.close();
          console.log(error + ' error');
        })
    },

    openContractsModal(asesor) {
      this.selectedAsesor = asesor;
      this.filtrarContratosNoLiquidados = false; // Reset filter when opening modal
      this.popupContracts = true;
    },

    getTotalCantidad(contratos) {
      return contratos.reduce((total, contrato) => {
        return total + parseInt(contrato.cantidad || 0);
      }, 0);
    },

    getTotalMonto(contratos) {
      return contratos.reduce((total, contrato) => {
        return total + parseFloat(contrato.total || 0);
      }, 0);
    },

    getContratosLiquidados(contratos) {
      return contratos.filter(contrato => {
        return parseInt(contrato.cantidad || 0) > 0;
      }).length;
    },

    getContratosNoLiquidados(contratos) {
      return contratos.filter(contrato => {
        return parseInt(contrato.cantidad || 0) === 0;
      }).length;
    },

    formatNumber(number) {
      return new Intl.NumberFormat('es-ES').format(number);
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },

    exportar() {
      let me = this;

      if (!me.arrayReporte.asesores || me.arrayReporte.asesores.length === 0) {
        me.$vs.notify({
          text: 'No hay datos para exportar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      // Preparar datos para exportación
      let datosExport = [];

      // Agregar datos de "Sin Contrato" si existe
      if (me.arrayReporte.sin_contrato) {
        datosExport.push({
          asesor: 'SIN CONTRATO',
          id_asesor: '-',
          contrato: me.arrayReporte.sin_contrato.contrato,
          cantidad: me.arrayReporte.sin_contrato.cantidad,
          total: parseFloat(me.arrayReporte.sin_contrato.total)
        });
      }

      // Agregar todos los contratos de todos los asesores
      me.arrayReporte.asesores.forEach(asesor => {
        asesor.contratos.forEach(contrato => {
          datosExport.push({
            asesor: asesor.nombre,
            id_asesor: asesor.id_asesor,
            contrato: contrato.contrato,
            cantidad: parseInt(contrato.cantidad),
            total: parseFloat(contrato.total),
            estado_liquidacion: parseInt(contrato.cantidad) > 0 ? 'Liquidado' : 'No Liquidado'
          });
        });
      });

      // Definir headers y field keys para la exportación
      const headers = ['Asesor', 'ID Asesor', 'Contrato', 'Cantidad', 'Total', 'Estado Liquidación'];
      const fieldKeys = ['asesor', 'id_asesor', 'contrato', 'cantidad', 'total', 'estado_liquidacion'];

      // Generar nombre de archivo
      const fechaActual = new Date();
      const nombreArchivo = `Reporte_Contratos_${fechaActual.getFullYear()}_${String(fechaActual.getMonth() + 1).padStart(2, '0')}_${String(fechaActual.getDate()).padStart(2, '0')}`;

      // Exportar usando el mixin
      me.m_exportTodo(headers, fieldKeys, datosExport, nombreArchivo);
    },

    exportarContratosAsesor() {
      let me = this;

      if (!me.selectedAsesor || !me.selectedAsesor.contratos || me.selectedAsesor.contratos.length === 0) {
        me.$vs.notify({
          text: 'No hay contratos para exportar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      // Preparar datos para exportación
      let datosExport = [];

      me.selectedAsesor.contratos.forEach(contrato => {
        datosExport.push({
          asesor: me.selectedAsesor.nombre,
          id_asesor: me.selectedAsesor.id_asesor,
          contrato: contrato.contrato,
          cantidad: parseInt(contrato.cantidad),
          total: parseFloat(contrato.total),
          estado_liquidacion: parseInt(contrato.cantidad) > 0 ? 'Liquidado' : 'No Liquidado'
        });
      });

      // Definir headers y field keys para la exportación
      const headers = ['Asesor', 'ID Asesor', 'Contrato', 'Cantidad', 'Total', 'Estado Liquidación'];
      const fieldKeys = ['asesor', 'id_asesor', 'contrato', 'cantidad', 'total', 'estado_liquidacion'];

      // Generar nombre de archivo
      const fechaActual = new Date();
      const nombreArchivo = `Contratos_${me.selectedAsesor.nombre.replace(/\s+/g, '_')}_${fechaActual.getFullYear()}_${String(fechaActual.getMonth() + 1).padStart(2, '0')}_${String(fechaActual.getDate()).padStart(2, '0')}`;

      // Exportar usando el mixin
      me.m_exportTodo(headers, fieldKeys, datosExport, nombreArchivo);
    }
  },

  computed: {
    totalContratosGeneral() {
      if (!this.arrayReporte.asesores) return 0;
      return this.arrayReporte.asesores.reduce((total, asesor) => {
        return total + (asesor.contratos ? asesor.contratos.length : 0);
      }, 0);
    },

    totalCantidadGeneral() {
      if (!this.arrayReporte.asesores) return 0;
      return this.arrayReporte.asesores.reduce((total, asesor) => {
        if (asesor.contratos) {
          return total + this.getTotalCantidad(asesor.contratos);
        }
        return total;
      }, 0);
    },

    totalMontoGeneral() {
      if (!this.arrayReporte.asesores) return 0;
      return this.arrayReporte.asesores.reduce((total, asesor) => {
        if (asesor.contratos) {
          return total + this.getTotalMonto(asesor.contratos);
        }
        return total;
      }, 0);
    },

    // Totales ejecutivos que incluyen sin contrato + con contrato
    totalCantidadEjecutiva() {
      const cantidadConContrato = this.totalCantidadGeneral;
      const cantidadSinContrato = this.arrayReporte.sin_contrato ? parseInt(this.arrayReporte.sin_contrato.cantidad || 0) : 0;
      return cantidadConContrato + cantidadSinContrato;
    },

    totalMontoEjecutivo() {
      const montoConContrato = this.totalMontoGeneral;
      const montoSinContrato = this.arrayReporte.sin_contrato ? parseFloat(this.arrayReporte.sin_contrato.total || 0) : 0;
      return montoConContrato + montoSinContrato;
    },

    promedioMontoAsesor() {
      if (!this.arrayReporte.asesores || this.arrayReporte.asesores.length === 0) return 0;
      return this.totalMontoGeneral / this.arrayReporte.asesores.length;
    },

    totalContratosLiquidados() {
      if (!this.arrayReporte.asesores) return 0;
      return this.arrayReporte.asesores.reduce((total, asesor) => {
        if (asesor.contratos) {
          return total + this.getContratosLiquidados(asesor.contratos);
        }
        return total;
      }, 0);
    },

    totalContratosNoLiquidados() {
      if (!this.arrayReporte.asesores) return 0;
      return this.arrayReporte.asesores.reduce((total, asesor) => {
        if (asesor.contratos) {
          return total + this.getContratosNoLiquidados(asesor.contratos);
        }
        return total;
      }, 0);
    },

    // Computed para filtrar asesores
    asesoresParaMostrar() {
      if (!this.arrayReporte.asesores) return [];

      if (this.filtrarSoloConPendientes) {
        return this.arrayReporte.asesores.filter(asesor => {
          return asesor.contratos && this.getContratosNoLiquidados(asesor.contratos) > 0;
        });
      }

      return this.arrayReporte.asesores;
    },

    asesoresConPendientes() {
      if (!this.arrayReporte.asesores) return [];
      return this.arrayReporte.asesores.filter(asesor => {
        return asesor.contratos && this.getContratosNoLiquidados(asesor.contratos) > 0;
      });
    },

    // Computed para filtrar contratos en el modal
    contratosParaMostrarModal() {
      if (!this.selectedAsesor || !this.selectedAsesor.contratos) return [];

      if (this.filtrarContratosNoLiquidados) {
        return this.selectedAsesor.contratos.filter(contrato => {
          return parseInt(contrato.cantidad || 0) === 0;
        });
      }

      return this.selectedAsesor.contratos;
    }
  },

  watch: {
    periodoSelect: {
      handler(newVal) {
        if (newVal) {
          this.f_getReporte();
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.con-tab-ejemplo {
  padding: 20px;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-6 {
  gap: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.bg-gray-100 {
  background-color: #f5f5f5;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-gray-600 {
  color: #6b7280;
}

.text-gray-800 {
  color: #1f2937;
}

.text-green-600 {
  color: #16a34a;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-gray-800 {
  color: #1f2937;
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Estilos personalizados para la tabla */
.vs-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Modal styles */
.popup-example {
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

/* Executive Summary Styles - Compact */
.executive-summary-compact {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.compact-metric {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}

.compact-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dee2e6;
}

.compact-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  color: #6c757d;
}

.compact-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
}

.compact-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #212529;
  margin-bottom: 8px;
  line-height: 1;
}

.compact-details {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.compact-detail {
  font-size: 0.85rem;
  color: #6c757d;
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 3px;
  flex: 1;
  text-align: center;
}

.compact-metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compact-metric-item {
  font-size: 0.75rem;
  color: #6c757d;
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 3px;
  text-align: center;
}

.compact-metric-item strong {
  color: #212529;
}

/* Contract Status Styles */
.contract-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.status-liquidado,
.status-no-liquidado {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-liquidado {
  color: #16a34a;
  background-color: #dcfce7;
}

.status-no-liquidado {
  color: #dc2626;
  background-color: #fee2e2;
}

.status-icon {
  width: 14px;
  height: 14px;
}

.text-green {
  color: #16a34a !important;
}

.text-red {
  color: #dc2626 !important;
}

/* Filter Styles */
.filter-option {
  display: flex;
  align-items: center;
}

.filter-info {
  display: flex;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.text-center {
  text-align: center;
}

.text-green-500 {
  color: #10b981;
}

/* Contract Status Badges in Modal */
.contract-status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contract-status-badge.liquidado {
  background-color: #dcfce7;
  color: #16a34a;
  border: 1px solid #16a34a;
}

.contract-status-badge.no-liquidado {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.mt-2 {
  margin-top: 0.5rem;
}

/* Contract Cell Styling */
.contract-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.status-container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

/* Stripe effect for modal table */
.popup-example .vs-table tbody tr:nth-child(odd) {
  background-color: #f8f9fa;
}

.popup-example .vs-table tbody tr:nth-child(even) {
  background-color: #ffffff;
}

.popup-example .vs-table tbody tr:hover {
  background-color: #e3f2fd !important;
  transition: background-color 0.2s ease;
}
</style>
