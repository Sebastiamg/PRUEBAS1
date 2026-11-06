<template>
  <div class="reporte-container">
    <!-- Estado vacío -->
    <div v-if="columnInstituciones.length == 0" class="empty-state">
      <div class="empty-icon">
        <i class="feather icon-inbox"></i>
      </div>
      <p class="empty-text">No hay datos disponibles</p>
      <p class="empty-subtext">Seleccione un período de evaluación para visualizar los resultados</p>
    </div>

    <!-- Gráfico -->
    <div v-else class="chart-wrapper">
      <div class="chart-header">
        <div class="chart-info">
          <h5 class="chart-title">Promedios por Institución</h5>
          <p class="chart-subtitle">Ranking de instituciones ordenadas por puntaje promedio</p>
        </div>
        <div class="header-controls-right">
          <div class="top-selector-compact">
            <label class="top-label-compact">Mostrar:</label>
            <select v-model="topInstitucionesLimit" @change="getReporteInstituciones" class="top-select-compact">
              <option :value="10">Top 10</option>
              <option :value="15">Top 15</option>
              <option :value="20">Top 20</option>
              <option :value="30">Top 30</option>
              <option :value="promedio_instituciones_full.length" v-if="promedio_instituciones_full.length > 0">Todas ({{promedio_instituciones_full.length}})</option>
            </select>
          </div>
          <div class="chart-badge">
            <span class="badge-text">{{ promedio_instituciones_full.length }}</span>
            <span class="badge-label">Instituciones</span>
          </div>
        </div>
      </div>

      <div class="chart-content-scrollable">
        <apexchart
          type="bar"
          :options="columnInstituciones.chartOptions"
          :series="columnInstituciones.series"
        />
      </div>
    </div>
  </div>
</template>

<script>
import chart from "vue-apexcharts";
import moment from 'moment'

export default {
  components: {
    apexchart: chart
  },
  data() {
    return {
      columnInstituciones: [],
      promedio_instituciones_full: [],
      topInstitucionesLimit: 15,
    }
  },
  props: {
    n_evaluacion: {
      type: Number,
      default: 0
    },
  },
  watch: {
    n_evaluacion(results) {
      let me = this;
      if (results == null || results == "null" || results == "" || results == undefined) {
        me.promedio_instituciones = []
        me.columnInstituciones = []
        return
      }
      me.getReporteInstituciones()
    }
  },
  created() {
    let me = this;
  },
  mounted() {
    let me = this
  },
  methods: {
    getReporteInstituciones() {
      let me = this
      me.promedio_instituciones = []
      me.columnInstituciones = []
      me.$vs.loading()

      this.$http.get(this.$server_url + 'reporte_evaluaciones_institucion/' + me.n_evaluacion+ '/' + localStorage.Salletipo_institucion_id)
        .then(res => {
          // Ordenar por puntaje de mayor a menor
          me.promedio_instituciones_full = res.data.items.sort((a, b) => {
            return b.puntaje - a.puntaje;
          });

          // Limitar a las top N instituciones
          me.promedio_instituciones = me.promedio_instituciones_full.slice(0, me.topInstitucionesLimit)

          let promedios = []
          let instituciones = []

          $.each(me.promedio_instituciones, function(key, value) {
            promedios.push(value.puntaje)
            instituciones.push(value.nombreInstitucion)
          });

          // Calcular altura dinámica: mínimo 360px, 35px por institución
          let alturaGrafico = Math.max(360, me.promedio_instituciones.length * 35)

          me.columnInstituciones = {
            series: [{
              name: 'Promedio',
              data: promedios
            }],
            chartOptions: {
              colors: ['#4299e1'],
              chart: {
                type: 'bar',                height: alturaGrafico,                toolbar: {
                  show: true,
                  tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                  }
                },
                fontFamily: 'Inter, sans-serif',
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  borderRadius: 4,
                  barHeight: '70%',
                  dataLabels: {
                    position: 'top',
                  },
                },
              },
              dataLabels: {
                enabled: true,
                formatter: function(val, opts) {
                  return val + "%"
                },
                style: {
                  fontSize: '11px',
                  fontWeight: 600,
                  colors: ['#2d3748']
                },
                offsetX: 25,
              },
              stroke: {
                show: true,
                width: 1,
                colors: ['transparent']
              },
              xaxis: {
                categories: instituciones,
                labels: {
                  style: {
                    fontSize: '11px',
                    fontWeight: 500,
                    colors: '#718096'
                  },
                  formatter: function(val) {
                    return val + '%'
                  }
                },
                axisBorder: {
                  show: true,
                  color: '#e2e8f0',
                },
                axisTicks: {
                  show: true,
                  color: '#e2e8f0',
                }
              },
              yaxis: {
                labels: {
                  maxWidth: 280,
                  style: {
                    fontSize: '10px',
                    fontWeight: 500,
                    colors: '#2d3748'
                  },
                  trim: true,
                  hideOverlappingLabels: false,
                },
              },
              grid: {
                borderColor: '#e2e8f0',
                strokeDashArray: 3,
                xaxis: {
                  lines: {
                    show: true
                  }
                },
                yaxis: {
                  lines: {
                    show: false
                  }
                }
              },
              fill: {
                opacity: 1,
                type: 'solid',
              },
              tooltip: {
                theme: 'light',
                style: {
                  fontSize: '12px',
                },
                y: {
                  formatter: function(val) {
                    return val + "%"
                  },
                  title: {
                    formatter: function(seriesName) {
                      return 'Puntaje:'
                    }
                  }
                }
              }
            }
          }
          me.$vs.loading.close()
        })
        .catch(function(error) {
          me.$vs.loading.close()
          console.log(error);
        })
    },
  }
}
</script>

<style scoped>
.reporte-container {
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
}

/* Estado vacío */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  min-height: 300px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-icon i {
  font-size: 28px;
  color: #a0aec0;
}

.empty-text {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
  max-width: 400px;
}

/* Header del gráfico */
.chart-wrapper {
  padding: 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.chart-info {
  flex: 1;
}

.header-controls-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.top-selector-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.top-label-compact {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  white-space: nowrap;
}

.top-select-compact {
  padding: 0.375rem 0.625rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2d3748;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.top-select-compact:hover {
  border-color: #4299e1;
  background: #f7fafc;
}

.top-select-compact:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.chart-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.chart-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  color: #718096;
  font-weight: 500;
}

.chart-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #4299e1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 70px;
}

.badge-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.badge-label {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

/* Contenido del gráfico */
.chart-content {
  padding: 1.25rem;
  background: #ffffff;
}
.chart-content-scrollable {
  padding: 1rem;
  background: #ffffff;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.chart-content-scrollable::-webkit-scrollbar {
  width: 8px;
}

.chart-content-scrollable::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.chart-content-scrollable::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.chart-content-scrollable::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
/* Responsive */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-controls-right {
    width: 100%;
    justify-content: space-between;
  }

  .top-selector-compact {
    flex: 1;
  }

  .chart-badge {
    flex-shrink: 0;
  }

  .empty-state {
    padding: 2rem 1rem;
    min-height: 250px;
  }

  .chart-content,
  .chart-content-scrollable {
    padding: 0.75rem;
  }
}

@media (max-width: 640px) {
  .chart-title {
    font-size: 0.875rem;
  }

  .chart-subtitle {
    font-size: 0.75rem;
  }

  .top-label-compact {
    display: none;
  }

  .top-select-compact {
    width: 100%;
  }

  .chart-badge {
    width: auto;
  }
}
</style>
