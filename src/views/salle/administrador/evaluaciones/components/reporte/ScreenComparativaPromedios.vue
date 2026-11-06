<template>
  <div>
    <!-- CARD COMPARATIVA INSTITUCIONES -->
    <vx-card class="comparison-card mb-base mt-2">
      <template slot="no-body">
        <div class="card-header-professional">
          <div class="header-content">
            <h4 class="header-title">Comparativa de Promedios por Período</h4>
            <p class="header-subtitle">Análisis comparativo de instituciones entre diferentes períodos de evaluación</p>
          </div>
          <div class="header-icon">
            <i class="feather icon-bar-chart-2"></i>
          </div>
        </div>
        
        <div class="card-content">
          <!-- SELECTORES DE PERÍODOS -->
          <div class="vx-row">
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6 pr-3">
              <div class="select-wrapper">
                <label class="select-label">
                  <i class="feather icon-calendar mr-2"></i>
                  Primer Período de Evaluación
                </label>
                <v-select 
                  :options="arregloPeriodos" 
                  :reduce="arregloPeriodos => arregloPeriodos.id" 
                  label="nombre" 
                  class="custom-select" 
                  v-model="periodoSelect1"
                  placeholder="Seleccione el primer período"
                />
              </div>
            </div>
            
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6 pl-3">
              <div class="select-wrapper">
                <label class="select-label">
                  <i class="feather icon-calendar mr-2"></i>
                  Segundo Período de Evaluación
                </label>
                <v-select 
                  :options="arregloPeriodos" 
                  :reduce="arregloPeriodos => arregloPeriodos.id" 
                  label="nombre" 
                  class="custom-select" 
                  v-model="periodoSelect2"
                  placeholder="Seleccione el segundo período"
                />
              </div>
            </div>
          </div>

          <!-- COMPARACIÓN LADO A LADO -->
          <div class="comparison-grid">
            <!-- PERÍODO 1 -->
            <div class="comparison-column period-1">
              <div class="period-header">
                <div v-for="(item, key) in arregloPeriodos" :key="key">
                  <div v-if="item.id == periodoSelect1" class="period-title">
                    <i class="feather icon-file-text mr-2"></i>
                    {{ item.nombre }}
                  </div>
                </div>
              </div>
              <div class="period-content">
                <ReporteInstitucionVue :n_evaluacion="periodoSelect1"/>
              </div>
            </div>

            <!-- PERÍODO 2 -->
            <div class="comparison-column period-2">
              <div class="period-header">
                <div v-for="(item, key2) in arregloPeriodos" :key="key2">
                  <div v-if="item.id == periodoSelect2" class="period-title">
                    <i class="feather icon-file-text mr-2"></i>
                    {{ item.nombre }}
                  </div>
                </div>
              </div>
              <div class="period-content">
                <ReporteInstitucionVue :n_evaluacion="periodoSelect2"/>
              </div>
            </div>
          </div>

          <!-- SECCIÓN COLAPSABLE - CANTIDAD DE EVALUACIONES -->
          <div class="collapse-section">
            <vs-collapse accordion>
              <vs-collapse-item>
                <div slot="header" class="collapse-header">
                  <i class="feather icon-pie-chart mr-2"></i>
                  Ver Cantidad de Evaluaciones
                  <i class="feather icon-chevron-down ml-2"></i>
                </div>
                
                <div class="collapse-content">
                  <div class="comparison-grid mt-4">
                    <!-- PERÍODO 1 - CANTIDAD -->
                    <div class="comparison-column period-1">
                      <div class="period-header secondary">
                        <div v-for="(item, key) in arregloPeriodos" :key="key">
                          <div v-if="item.id == periodoSelect1" class="period-title">
                            <i class="feather icon-hash mr-2"></i>
                            {{ item.nombre }}
                          </div>
                        </div>
                      </div>
                      <div class="period-content">
                        <ReportePromediosCantidadVue :n_evaluacion="periodoSelect1"/>
                      </div>
                    </div>

                    <!-- PERÍODO 2 - CANTIDAD -->
                    <div class="comparison-column period-2">
                      <div class="period-header secondary">
                        <div v-for="(item, key2) in arregloPeriodos" :key="key2">
                          <div v-if="item.id == periodoSelect2" class="period-title">
                            <i class="feather icon-hash mr-2"></i>
                            {{ item.nombre }}
                          </div>
                        </div>
                      </div>
                      <div class="period-content">
                        <ReportePromediosCantidadVue :n_evaluacion="periodoSelect2"/>
                      </div>
                    </div>
                  </div>
                </div>
              </vs-collapse-item>
            </vs-collapse>
          </div>
        </div>
      </template>
    </vx-card>

    <!-- CARD COMPARATIVA POR DOCENTES -->
    <vx-card class="comparison-card mb-base mt-2">
      <template slot="no-body">
        <div class="card-header-professional">
          <div class="header-content">
            <h4 class="header-title">Comparativa por Docentes</h4>
            <p class="header-subtitle">Análisis comparativo por áreas de las evaluaciones docentes</p>
          </div>
          <div class="header-icon">
            <i class="feather icon-users"></i>
          </div>
        </div>
        
        <div class="card-content">
          <!-- SELECTOR DE INSTITUCIÓN -->
          <div class="institution-selector">
            <label class="select-label">
              <i class="feather icon-home mr-2"></i>
              Seleccione una Institución
            </label>
            <div class="flex items-center gap-3">
              <v-select 
                class="custom-select flex-1" 
                :options="arregloInstituciones" 
                :reduce="arregloInstituciones => arregloInstituciones" 
                label="institucion_ciudad" 
                v-model="institucion_selected"
                placeholder="Buscar institución..."
              />
              <vs-button 
                radius 
                color="success" 
                @click="buscarReporte()" 
                class="search-button" 
                icon-pack="feather" 
                icon="icon-search"
              >
                Buscar
              </vs-button>
            </div>
          </div>

          <!-- COMPARACIÓN DE ÁREAS POR DOCENTES -->
          <div class="comparison-grid">
            <!-- PERÍODO 1 - DOCENTES -->
            <div class="comparison-column period-1">
              <div class="period-header">
                <div v-for="(item, key) in arregloPeriodos" :key="key">
                  <div v-if="item.id == periodoSelect1" class="period-title">
                    <i class="feather icon-award mr-2"></i>
                    {{ item.nombre }}
                  </div>
                </div>
              </div>
              <div class="period-content">
                <ReporteCompartivaAreasDocenteVue 
                  :institucion_selected="institucion_selected" 
                  :periodoSelect="periodoSelect1" 
                  :searchReporte="searchReporte"
                />
              </div>
            </div>

            <!-- PERÍODO 2 - DOCENTES -->
            <div class="comparison-column period-2">
              <div class="period-header">
                <div v-for="(item, key) in arregloPeriodos" :key="key">
                  <div v-if="item.id == periodoSelect2" class="period-title">
                    <i class="feather icon-award mr-2"></i>
                    {{ item.nombre }}
                  </div>
                </div>
              </div>
              <div class="period-content">
                <ReporteCompartivaAreasDocenteVue 
                  :institucion_selected="institucion_selected" 
                  :periodoSelect="periodoSelect2" 
                  :searchReporte="searchReporte"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </vx-card>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import ReporteInstitucionVue from './ReporteInstitucion.vue';
import ReportePromediosCantidadVue from './ReportePromediosCantidad.vue'
import ReporteCompartivaAreasDocenteVue from './ReporteCompartivaAreasDocente.vue';

export default {
  data() {
    return {
      periodoSelect1: '',
      periodoSelect2: '',
      institucion_selected: '',
      searchReporte: false,
    }
  },
  props: {
    arregloPeriodos: {
      type: Array,
      default: []
    },
    arregloInstituciones: {
      type: Array,
      default: []
    },
  },
  mounted() {
    let me = this;
    setTimeout(function() {
      if (me.arregloPeriodos.length > 0) {
        me.periodoSelect2 = parseInt(localStorage.EvaluacionSelectSalle)
      }
    }, 2000);
  },
  components: {
    vSelect,
    ReporteInstitucionVue,
    ReportePromediosCantidadVue,
    ReporteCompartivaAreasDocenteVue,
  },
  methods: {
    buscarReporte() {
      let me = this;
      if (me.institucion_selected == null || me.institucion_selected == "" || me.institucion_selected == undefined) {
        me.$vs.notify({
          text: 'Seleccione una institución por favor',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        return
      }
      me.searchReporte = !me.searchReporte
    },
  },
}
</script>

<style scoped>
/* Card principal */
.comparison-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.2s ease;
}

.comparison-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Header profesional */
.card-header-professional {
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  flex: 1;
}

.header-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.125rem;
  color: #2d3748;
  letter-spacing: 0.3px;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.header-icon {
  color: #4299e1;
  font-size: 1.5rem;
  margin-left: 1rem;
}

/* Contenido de card */
.card-content {
  padding: 1.5rem;
}

/* Wrapper de selects */
.select-wrapper {
  margin-bottom: 0.5rem;
}

.select-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.custom-select {
  border-radius: 6px;
}

.custom-select >>> .vs__dropdown-toggle {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem;
  background: #ffffff;
  transition: all 0.2s ease;
}

.custom-select >>> .vs__dropdown-toggle:hover {
  border-color: #667eea;
}

.custom-select >>> .vs__dropdown-toggle:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.custom-select >>> .vs__selected {
  color: #2d3748;
  font-weight: 500;
}

/* Grid de comparación */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.comparison-column {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

/* Headers de períodos */
.period-header {
  background: #4299e1;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.period-header.secondary {
  background: #48bb78;
}

.period-2 .period-header {
  background: #ed8936;
}

.period-2 .period-header.secondary {
  background: #9f7aea;
}

.period-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
}

/* Contenido de períodos */
.period-content {
  padding: 0;
  background: #ffffff;
  min-height: 200px;
}

/* Selector de institución */
.institution-selector {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.search-button {
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8125rem;
  letter-spacing: 0.3px;
  padding: 0.625rem 1.25rem;
  white-space: nowrap;
}

/* Sección colapsable */
.collapse-section {
  margin-top: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  background: #ffffff;
}

.collapse-header {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9375rem;
  color: #2d3748;
  padding: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: #f8f9fa;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.collapse-content {
  padding: 1rem;
  background: #ffffff;
}

.collapse-content .period-content {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
}

/* Estilos para vue-select dropdown */
.custom-select >>> .vs__dropdown-menu {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 250px;
}

.custom-select >>> .vs__dropdown-option {
  padding: 0.625rem 1rem;
  transition: all 0.15s ease;
}

.custom-select >>> .vs__dropdown-option--highlight {
  background: #667eea;
  color: #ffffff;
}

/* Responsive */
@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card-header-professional {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-icon {
    margin-left: 0;
  }

  .institution-selector .flex {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-button {
    width: 100%;
  }

  .vx-col.pr-3 {
    padding-right: 0 !important;
  }

  .vx-col.pl-3 {
    padding-left: 0 !important;
  }
}

@media (max-width: 640px) {
  .card-content {
    padding: 1rem;
  }

  .header-title {
    font-size: 1rem;
  }

  .header-subtitle {
    font-size: 0.8125rem;
  }

  .period-title {
    font-size: 0.8125rem;
  }

  .select-label {
    font-size: 0.8125rem;
  }
}
</style>