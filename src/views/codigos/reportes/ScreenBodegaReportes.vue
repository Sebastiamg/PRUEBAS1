<template>
  <div class="container">
    <h3>Reportes</h3>
    <!-- Tabs de reportes -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'despachos' }"
          @click="changeTab('despachos')">
          Despachos por Serie
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'xinstitucion' }"
          @click="changeTab('xinstitucion')">
          Ventas por Institución/Punto de Venta
        </button>
      </div>

      <!-- Contenido de los tabs -->
      <div class="tab-content">
        <div v-if="activeTab === 'despachos'" class="tab-panel">          
          <BodegaReporteCodigosSeriesVue 
            :region="selectedRegion" 
            :periodo="selectedPeriodo" 
          />
        </div>
        <div v-if="activeTab === 'xinstitucion'" class="tab-panel">
          <vs-row vs-type="flex" vs-justify="start" vs-align="start">
            <!-- Región -->
            <vs-col vs-lg="3" vs-md="6" vs-sm="12" vs-xs="12">
              <div style="margin: 10px;" align="center">
                <span>Seleccione la región</span>
                <ul class="mt-2">
                  <li class="mr-3">
                    <vs-radio v-model="selectedRegionXInstitucion" @change="obtenerPeriodosXInstitucion" vs-name="radios2tipoFiltro" vs-value="1">Sierra</vs-radio>
                  </li>
                  <li class="mr-3">
                    <vs-radio v-model="selectedRegionXInstitucion" @change="obtenerPeriodosXInstitucion" vs-name="radios2tipoFiltro" vs-value="2">Costa</vs-radio>
                  </li>
                </ul>
              </div>
            </vs-col>
            <!-- Período -->
            <vs-col vs-lg="4" vs-md="6" vs-sm="12" vs-xs="12">
              <div style="margin: 10px;">
                <span>Seleccione el período</span>
                <v-select 
                  :options="arrayPeriodosXInstitucion" 
                  :reduce="periodo => periodo.idperiodoescolar" 
                  placeholder="-Seleccione-" 
                  label="periodoescolar" 
                  class="w-full mt-2" 
                  v-model="selectedPeriodoXInstitucion" 
                  @input="FiltroGeneralReporteXInstitucion" 
                />
              </div>
            </vs-col>
          </vs-row>
          <XinstitucionVue 
            v-if="selectedPeriodoXInstitucion"
            :key="selectedPeriodoXInstitucion"
            :periodo_id="selectedPeriodoXInstitucion"
            :nombrePeriodo="getNombrePeriodoXInstitucion(selectedPeriodoXInstitucion)" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import PeriodoRepository from '@/repositories/PeriodoRepository';
const BodegaReporteCodigosSeriesVue = () => import('./BodegaReporteCodigosSeries.vue');
const XinstitucionVue = () => import('@/views/pedidos2/pedidos/reportes/components/xinstitucion.vue');

export default {
  components: {
    vSelect,
    BodegaReporteCodigosSeriesVue,
    XinstitucionVue,
  },
  data() {
    return {
      selectedRegion: '1',
      selectedPeriodo: null,
      selectedRegionXInstitucion: '1',
      selectedPeriodoXInstitucion: null,
      activeTab: 'despachos',
      arrayPeriodos: [],
      arrayPeriodosXInstitucion: [],
    };
  },
  methods: {
    async obtenerPeriodos() {
      this.selectedPeriodo = null;
      this.$vs.loading();
      try {
        const response = await PeriodoRepository.getPeriodos();
        this.arrayPeriodos = response.data.filter(p => p.region_idregion == this.selectedRegion);
      } catch (error) {
        this.$vs.notify({
          text: 'Error al cargar los períodos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        console.error(error);
      } finally {
        this.$vs.loading.close();
      }
    },
    async obtenerPeriodosXInstitucion() {
      this.selectedPeriodoXInstitucion = null;
      this.$vs.loading();
      try {
        const response = await PeriodoRepository.getPeriodos();
        this.arrayPeriodosXInstitucion = response.data.filter(p => p.region_idregion == this.selectedRegionXInstitucion);
      } catch (error) {
        this.$vs.notify({
          text: 'Error al cargar los períodos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        console.error(error);
      } finally {
        this.$vs.loading.close();
      }
    },
    getNombrePeriodo(id) {
      const periodo = this.arrayPeriodos.find(p => p.idperiodoescolar === id);
      return periodo ? periodo.periodoescolar : '';
    },
    getNombrePeriodoXInstitucion(id) {
      const periodo = this.arrayPeriodosXInstitucion.find(p => p.idperiodoescolar === id);
      return periodo ? periodo.periodoescolar : '';
    },
    async FiltroGeneralReporte() {
      if (!this.selectedPeriodo) {
        this.$vs.notify({
          text: 'Seleccione un período',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }
      // Trigger child component updates through props
    },
    async FiltroGeneralReporteXInstitucion() {
      if (!this.selectedPeriodoXInstitucion) {
        this.$vs.notify({
          text: 'Seleccione un período',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }
      // Trigger child component updates through props
    },
    changeTab(tab) {
      this.activeTab = tab;
      if (tab === 'despachos') {
        this.selectedRegionXInstitucion = '1';
        this.selectedPeriodoXInstitucion = null;
        this.arrayPeriodosXInstitucion = [];
      } else if (tab === 'xinstitucion') {
        this.selectedRegion = '1';
        this.selectedPeriodo = null;
        this.arrayPeriodos = [];
        this.obtenerPeriodosXInstitucion();
      }
    }
  },
  mounted() {
    this.obtenerPeriodos();
  }
};
</script>

<style scoped>
.container {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: #fff;
}

.w-full {
  width: 100%;
}

.mt-2 {
  margin-top: 0.5rem;
}

.tabs-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background-color: #f1f3f4;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background-color: #e8eaf6;
  color: #333;
}

.tab-btn.active {
  background-color: white;
  color: rgb(83, 116, 179);
  border-bottom-color: rgb(83, 116, 179);
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  padding: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .tabs-header {
    flex-direction: column;
  }
  
  .tab-btn {
    text-align: center;
  }
}
</style>