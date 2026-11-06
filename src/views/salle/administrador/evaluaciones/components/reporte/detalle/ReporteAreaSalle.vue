<template>
  <div>
    <div class="vx-row">
      <div class="vx-col sm:w-full mb-base">
        <!-- TABS DE NAVEGACIÓN -->
        <vx-card v-if="data_docentes_areas.length > 0 || data_consolidada.length > 0" class="tabs-card mb-4">
          <template slot="no-body">
            <div class="tabs-container">
              <div class="tabs-header">
                <button 
                  class="tab-button" 
                  :class="{ 'active': activeTab === 'general' }"
                  @click="activeTab = 'general'"
                >
                  <i class="feather icon-users"></i>
                  <span>General</span>
                </button>
                <button 
                  class="tab-button" 
                  :class="{ 'active': activeTab === 'areas' }"
                  @click="activeTab = 'areas'"
                >
                  <i class="feather icon-folder"></i>
                  <span>Áreas</span>
                </button>
                <button 
                  class="tab-button" 
                  :class="{ 'active': activeTab === 'asignaturas' }"
                  @click="activeTab = 'asignaturas'"
                >
                  <i class="feather icon-book-open"></i>
                  <span>Asignaturas</span>
                </button>
              </div>
            </div>
          </template>
        </vx-card>

        <!-- TAB GENERAL -->
        <div v-show="activeTab === 'general'">
          <!-- Loading state -->
          <vx-card v-if="loadingConsolidado" class="loading-card">
            <div class="loading-state">
              <div class="loading-spinner">
                <div class="spinner"></div>
              </div>
              <p class="loading-text">Cargando reporte general...</p>
              <p class="loading-subtext">Por favor espere mientras se procesa la información</p>
            </div>
          </vx-card>

          <!-- Estado vacío cuando no hay datos -->
          <vx-card v-else-if="data_consolidada.length === 0" class="empty-card">
            <div class="empty-state-large">
              <div class="empty-icon-large">
                <i class="feather icon-inbox"></i>
              </div>
              <p class="empty-text-large">No hay datos disponibles</p>
              <p class="empty-subtext-large">Seleccione una institución y período para ver el reporte general</p>
            </div>
          </vx-card>
          
          <vx-card v-else class="top-general-card">
            <template slot="no-body">
              <div class="card-header-professional">
                <div class="table-header-docentes">
                  <div class="header-content">
                    <h4 class="header-title mt-2 ml-3">Top Docentes General</h4>
                    <p class="header-subtitle mt-2 ml-3">Reporte consolidado con docentes, áreas y asignaturas</p>
                  </div>
                  <div class="header-stats">
                    <div class="stat-item">
                      <span class="stat-number">{{ docentesConsolidadosFiltrados.length }}</span>
                      <span class="stat-label">Docentes</span>
                    </div>
                  </div>
                   <div class="header-actions">
                    <vs-button size="small" class="export-btn" icon-pack="feather" icon="icon-download" color="success"
                      type="border" @click="fileName='reporte_general_consolidado'; activePromptExcelConsolidado=true">
                      Exportar
                    </vs-button>
                  </div>
                </div>               
              </div>
              <div class="card-content">
                <!-- Estado vacío -->
                <div v-if="docentesConsolidadosFiltrados.length == 0" class="empty-state">
                  <div class="empty-icon">
                    <i class="feather icon-users"></i>
                  </div>
                  <p class="empty-text">No hay docentes disponibles</p>
                  <p class="empty-subtext">No se encontraron docentes que coincidan con el filtro</p>
                </div>
                <div v-else>
                  <div class="filter-docente-container">
                    <div class="search-input-wrapper">
                      <vs-input v-model="filtroDocenteConsolidado" placeholder="Buscar docente por nombre..." icon="search"
                        class="search-docente w-full" />
                    </div>
                  </div>
                  <div class="card-content-docentes" id="div_top_consolidado">
                    <div class="docentes-table-container">
                      <div v-for="(docente, index) in docentesConsolidadosFiltrados" :key="index" class="docente-card-consolidado">
                        <div class="docente-card-header-consolidado">
                          <div class="docente-name-container">
                            <h6 class="docente-name">{{ docente.nombre_docente.toUpperCase() }}</h6>
                            <div class="docente-score-badge-consolidado">{{ docente.puntaje_evaluacion }}%</div>
                          </div>
                        </div>

                        <!-- Áreas y Asignaturas -->
                        <div class="areas-asignaturas-container">
                          <div v-for="(area, indexA) in docente.areas" :key="indexA" class="area-section">
                            <div class="area-header-row">
                              <div class="area-title">
                                <i class="feather icon-folder"></i>
                                <span class="area-name-text">{{ area.nombre_area }}</span>
                              </div>
                              <div class="area-score-container">
                                <span class="area-score-value">{{ area.puntaje }}%</span>
                                <div class="area-score-bar">
                                  <div class="area-score-fill" :style="{width: area.puntaje + '%'}"></div>
                                </div>
                              </div>
                            </div>

                            <!-- Asignaturas de esta área -->
                            <div class="asignaturas-list">
                              <div v-for="(asignatura, indexAs) in area.asignaturas" :key="indexAs" class="asignatura-item-row">
                                <div class="asignatura-name-col">
                                  <i class="feather icon-book-open"></i>
                                  <span>{{ asignatura.nombre_asignatura }}</span>
                                </div>
                                <div class="asignatura-score-col">
                                  <span class="asignatura-score-text">{{ asignatura.puntaje }}%</span>
                                  <div class="asignatura-score-bar-mini">
                                    <div class="asignatura-score-fill-mini" :style="{width: asignatura.puntaje + '%'}"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </vx-card>
        </div>

        <!-- TAB ÁREAS -->
        <div v-show="activeTab === 'areas'">
        <vx-card v-if="data_docentes_areas.length > 0" class="chart-card">
          <template slot="no-body">
            <div class="card-header-professional">
              <div class="header-content">
                <h4 class="header-title">Promedios por Áreas</h4>
                <p class="header-subtitle">Comparación de promedios de todas las áreas de la institución seleccionada
                </p>
              </div>
              <div class="header-icon">
                <i class="feather icon-bar-chart-2"></i>
              </div>
            </div>
            <div class="card-content">
              <vue-apex-charts type="bar" height="280" :options="columnChart.chartOptions"
                :series="columnChart.series"></vue-apex-charts>
            </div>
          </template>
        </vx-card>
        <div class="vx-row mb-4" v-if="data_docentes_areas.length > 0" style="margin-top: 16px;">
          <!--TOP DOCENTES GENERALES-->
          <div class="vx-col lg:w-1/2 sm:w-1/1 md:w-1/2 mb-3">
            <vx-card class="top-teachers-card">
              <template slot="no-body">
                <div class="card-header-professional">
                  <div class="header-content">
                    <h4 class="header-title">Top Docentes</h4>
                    <p class="header-subtitle">Docentes mejor puntuados en calificación final</p>
                  </div>
                  <div class="header-controls">
                    <div class="top-selector">
                      <label class="top-label">Mostrar:</label>
                      <select v-model="topDocentesLimit" @change="graficoTopDocAreas" class="top-select">
                        <option :value="10">Top 10</option>
                        <option :value="15">Top 15</option>
                        <option :value="20">Top 20</option>
                        <option :value="30">Top 30</option>
                        <option :value="data_docentes_areas.length">Todos ({{data_docentes_areas.length}})</option>
                      </select>
                    </div>
                    <div class="header-icon">
                      <i class="feather icon-award"></i>
                    </div>
                  </div>
                </div>
                <div class="chart-container-scrollable" id="div_top_1">
                  <vue-apex-charts type="bar" :options="barChartTopDoc.chartOptions"
                    :series="barChartTopDoc.series"></vue-apex-charts>
                </div>
              </template>
            </vx-card>
          </div>
          <!--TOP DOCENTES POR ÁREAS-->
          <div class="vx-col lg:w-1/2 sm:w-1/1 md:w-1/2 mb-3">
            <vx-card class="top-areas-card">
              <template slot="no-body">
                <div class="card-header-professional">
                  <div class="header-content">
                    <h4 class="header-title">Top Docentes por Áreas</h4>
                    <p class="header-subtitle">Docentes mejor puntuados por área</p>
                  </div>
                  <div class="table-header-docentes">
                    <div class="header-stats">
                      <div class="stat-item">
                        <span class="stat-number">{{ docentesAreasFiltrados.length }}</span>
                        <span class="stat-label">Docentes</span>
                      </div>
                    </div>
                  </div>
                  <div class="header-actions">
                    <vs-button size="small" class="export-btn" icon-pack="feather" icon="icon-download" color="primary"
                      type="border" @click="fileName='reporte_docentes_areas'; activePromptExcel=true">
                      Exportar
                    </vs-button>
                  </div>
                </div>
                <div class="card-content">
                  <!-- Estado vacío -->
                  <div v-if="docentesAreasFiltrados.length == 0" class="empty-state">
                    <div class="empty-icon">
                      <i class="feather icon-users"></i>
                    </div>
                    <p class="empty-text">No hay docentes disponibles</p>
                    <p class="empty-subtext">No se encontraron docentes que coincidan con el filtro</p>
                  </div>
                  <div v-else>
                    <div class="filter-docente-container">
                      <div class="search-input-wrapper">
                        <vs-input v-model="filtroDocenteArea" placeholder="Buscar docente por nombre..." icon="search"
                          class="search-docente w-full" />
                      </div>
                    </div>
                    <div class="card-content-docentes" id="div_top_area">
                      <div class="docentes-table-container">
                        <div v-for="(evaluacion, index) in docentesAreasFiltrados" :key="index" class="docente-card">
                          <div class="docente-card-header">
                            <div class="docente-name-container">
                              <h6 class="docente-name">{{ evaluacion.nombre_docente.toUpperCase() }}</h6>
                              <div class="docente-score-badge">{{ evaluacion.puntaje_evaluacion }}%</div>
                            </div>
                          </div>

                          <div class="areas-table">
                            <div class="area-row header-row">
                              <div class="area-cell area-header">ÁREA:</div>
                              <div class="area-cell score-header">PUNTAJE:</div>
                            </div>
                            <div v-for="(area, indexA) in evaluacion.areas" :key="indexA" class="area-row data-row">
                              <div class="area-cell area-name">{{ area.nombre_area }}</div>
                              <div class="area-container">
                                <span class="area-value">{{ area.puntaje }}%</span>
                                <div class="area-bar">
                                  <div class="area-fill" :style="{width: area.puntaje + '%'}"></div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                </div>
              </template>
            </vx-card>
          </div>
        </div>
        </div>

        <!-- TAB ASIGNATURAS -->
        <div v-show="activeTab === 'asignaturas'">
        <!--SELECCIONAR AREA PARA REPORTE POR ASIGNATURAS-->
        <div v-if="key_areas.length > 0">
          <ReporteAsignaturaSalleVue :key_areas="key_areas" :institucion_selected="institucion_selected"
            :periodoSelect="periodoSelect" />
        </div>
        </div>

        <!--TOP DOCENTES GENERAL (CONSOLIDADO) - REMOVIDO, AHORA ESTÁ EN TAB-->
        <!--TOP DOCENTES POR ÁREAS - REMOVIDO, AHORA ESTÁ EN TAB-->
        <!--SELECCIONAR AREA PARA REPORTE POR ASIGNATURAS - REMOVIDO, AHORA ESTÁ EN TAB-->
      </div>
    </div>
    <!--MODALES-->
    <!----modal exportar--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
      accept-text="Exportar" :active.sync="activePromptExcel">
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
      </div>
    </vs-prompt>
    <!----fin modal exportar--------->
    <!----modal exportar consolidado--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFieldsConsolidado" @accept="exportToExcelConsolidado"
      accept-text="Exportar" :active.sync="activePromptExcelConsolidado">
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
      </div>
    </vs-prompt>
    <!----fin modal exportar consolidado--------->
  </div>
</template>
<script>
  import ReporteAsignaturaSalleVue from '@/views/salle/administrador/evaluaciones/components/reporte/detalle/ReporteAsignaturaSalle'
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import vSelect from 'vue-select'
  import ECharts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/radar'
  import 'echarts/lib/chart/pie'
  import theme from '../../../theme.json'
  import VueApexCharts from 'vue-apexcharts'
  ECharts.registerTheme('ovilia-green', theme)
  export default {
    data() {
      return {
        //variable para controlar tabs
        activeTab: 'general',
        //fin variable para controlar tabs
        //variable para loading
        loadingConsolidado: false,
        //fin variable para loading
        //variables areas
        data_docentes_areas: [],
        columnChart: {},
        key_areas: [],
        //fin variables areas
        //variables mejores docentes
        barChartTopDoc: {},
        //fin variables mejores docentes
        //variable para controlar cuántos docentes mostrar
        topDocentesLimit: 15,
        //fin variable para controlar cuántos docentes mostrar
        //variables para exportar a excel
        activePromptExcel: false,
        fileName: null,
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        selectedFormat: 'xls',
        fileNameAs: '',
        //fin variables para exportar a excel
        //variable para filtro de docentes por área
        filtroDocenteArea: '',
        //fin variable para filtro de docentes por área
        //variables para reporte consolidado
        data_consolidada: [],
        filtroDocenteConsolidado: '',
        activePromptExcelConsolidado: false,
        //fin variables para reporte consolidado
      }
    },
    computed: {
      docentesAreasFiltrados() {
        let me = this;
        if (!me.filtroDocenteArea || me.filtroDocenteArea.trim() === '') {
          return me.data_docentes_areas;
        }
        return me.data_docentes_areas.filter(docente =>
          docente.nombre_docente.toLowerCase().includes(me.filtroDocenteArea.toLowerCase())
        );
      },
      docentesConsolidadosFiltrados() {
        let me = this;
        if (!me.filtroDocenteConsolidado || me.filtroDocenteConsolidado.trim() === '') {
          return me.data_consolidada;
        }
        return me.data_consolidada.filter(docente =>
          docente.nombre_docente.toLowerCase().includes(me.filtroDocenteConsolidado.toLowerCase())
        );
      },
    },
    components: {
      'v-select': vSelect,
      flatPickr,
      ECharts,
      VueApexCharts,
      ReporteAsignaturaSalleVue,
    },
    props: {
      institucion_selected: {
        type: String,
        default: ''
      },
      periodoSelect: {
        type: String,
        default: ''
      },
      searchReporte: {
        type: Boolean,
        default: false,
      }
    },
    watch: {
      institucion_selected(results) {
        let me = this;
        me.data_docentes_areas = []
        me.columnChart = {}
        me.key_areas = []
        me.barChartTopDoc = {}
        me.filtroDocenteArea = ''
        me.data_consolidada = []
        me.filtroDocenteConsolidado = ''
        me.loadingConsolidado = false
        if (results && me.periodoSelect) {
          me.getPromedioAreas()
          me.getReporteConsolidado()
        }
      },
      periodoSelect(results) {
        let me = this;
        me.data_docentes_areas = []
        me.columnChart = {}
        me.key_areas = []
        me.barChartTopDoc = {}
        me.filtroDocenteArea = ''
        me.data_consolidada = []
        me.filtroDocenteConsolidado = ''
        me.loadingConsolidado = false
        if (results && me.institucion_selected) {
          me.getPromedioAreas()
          me.getReporteConsolidado()
        }
      },
      searchReporte(results) {
        let me = this
        me.data_docentes_areas = []
        me.columnChart = {}
        me.key_areas = []
        me.barChartTopDoc = {}
        me.data_consolidada = []
        me.filtroDocenteConsolidado = ''
        me.loadingConsolidado = false
        if (me.periodoSelect && me.institucion_selected) {
          me.getPromedioAreas()
          me.getReporteConsolidado()
        }
      }
    },
    mounted() {
      let me = this;
      // Cargar datos si ya hay institución y período seleccionados
      if (me.institucion_selected && me.periodoSelect) {
        me.getPromedioAreas()
        me.getReporteConsolidado()
      }
    },
    methods: {
      getPromedioAreas() {
        let me = this
        me.data_docentes_areas = []
        me.columnChart = []
        me.$vs.loading()
        this.$http.get(this.$server_url + 'salle_promedio_areas/' + me.periodoSelect + '/' + me.institucion_selected.idInstitucion)
          .then(res => {
            if (res.data.error) {
              me.$vs.loading.close()
              this.$vs.notify({
                text: res.data.error,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-check'
              })
              return
            }
            me.data_docentes_areas = res.data.items
            me.data_docentes_areas.sort((a, b) => {
              return b.puntaje_evaluacion - a.puntaje_evaluacion;
            });
            //grafico mejores docentes por areas
            me.graficoTopDocAreas()
            let areas = []
            //obtener los puntajes de todas las evaluaciones por area de los docentes
            $.each(res.data.items, function (key, value) {
              $.each(value.areas, function (keyA, valueA) {
                areas.push({ nombre_area: valueA.nombre_area, puntaje: valueA.puntaje, id_area: valueA.id_area })
              });
            });
            let areas_agrupadas = []
            areas_agrupadas = me.groupArrayOfObjects(areas, "nombre_area")
            console.log("areas_agrupadas", areas_agrupadas)
            me.key_areas = []
            let key_areas_1 = []
            $.each(areas_agrupadas, function (key, value) {
              key_areas_1.push(key)
              me.key_areas.push(value[0])
            });
            let puntajes_areas = []
            let nombre_areas = []
            for (let i = 0; i < key_areas_1.length; i++) {
              let acum_puntaje = 0
              $.each(areas_agrupadas[key_areas_1[i]], function (key, value) {
                acum_puntaje += value.puntaje
              });
              let porcentaje_area = ((acum_puntaje * 100) / ((areas_agrupadas[key_areas_1[i]].length) * 100)).toFixed(2)
              puntajes_areas.push(porcentaje_area)
              nombre_areas.push(key_areas_1[i])
            }
            me.columnChart = {
              series: [{
                name: 'Promedio',
                data: puntajes_areas
              }],
              chartOptions: {
                colors: ['#4299e1'],
                chart: {
                  type: 'bar',
                  toolbar: {
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
                    horizontal: false,
                    endingShape: 'rounded',
                    columnWidth: '65%',
                    borderRadius: 4,
                    dataLabels: {
                      position: 'top',
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter: function (val, opts) {
                    return val + "%"
                  },
                  style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    colors: ['#2d3748']
                  },
                  offsetY: -20,
                },
                stroke: {
                  show: true,
                  width: 1,
                  colors: ['transparent']
                },
                xaxis: {
                  categories: nombre_areas,
                  labels: {
                    style: {
                      fontSize: '11px',
                      fontWeight: 500,
                      colors: '#718096'
                    },
                    rotate: -45,
                    rotateAlways: false
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
                  title: {
                    text: 'Promedio (%)',
                    style: {
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#718096'
                    }
                  },
                  labels: {
                    style: {
                      fontSize: '11px',
                      fontWeight: 500,
                      colors: '#718096'
                    },
                    formatter: function (val) {
                      return val + '%'
                    }
                  }
                },
                grid: {
                  borderColor: '#e2e8f0',
                  strokeDashArray: 3,
                  xaxis: {
                    lines: {
                      show: false
                    }
                  },
                  yaxis: {
                    lines: {
                      show: true
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
                    formatter: function (val) {
                      return val + "%"
                    },
                    title: {
                      formatter: function (seriesName) {
                        return 'Promedio:'
                      }
                    }
                  }
                }
              }
            }
            me.$vs.loading.close()
          })
          .catch(function (error) {
            console.log(error);
            me.$vs.loading.close()
          })
      },
      groupArrayOfObjects(list, key) {
        return list.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      },
      graficoTopDocAreas() {
        let me = this
        let puntaje_evaluaciones = []
        let nombre_docentes = []
        
        // Limitar a los top N docentes
        let docentesLimitados = me.data_docentes_areas.slice(0, me.topDocentesLimit)
        
        $.each(docentesLimitados, function (key, value) {
          puntaje_evaluaciones.push(value.puntaje_evaluacion)
          nombre_docentes.push(value.nombre_docente)
        });
        
        // Calcular altura dinámica: mínimo 360px, 35px por docente
        let alturaGrafico = Math.max(360, docentesLimitados.length * 35)
        
        me.barChartTopDoc = {}
        me.barChartTopDoc = {
          series: [{
            name: 'Puntaje',
            data: puntaje_evaluaciones
          }],
          chartOptions: {
            colors: ['#4299e1'],
            chart: {
              type: 'bar',
              height: alturaGrafico,
              toolbar: {
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
                dataLabels: {
                  position: 'top',
                },
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                return val + "%"
              },
              style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#2d3748']
              },
              offsetX: 30,
            },
            stroke: {
              show: true,
              width: 1,
              colors: ['transparent']
            },
            xaxis: {
              categories: nombre_docentes,
              labels: {
                style: {
                  fontSize: '11px',
                  fontWeight: 500,
                  colors: '#718096'
                },
                formatter: function (val) {
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
                maxWidth: 200,
                style: {
                  fontSize: '11px',
                  fontWeight: 500,
                  colors: '#2d3748'
                },
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
                formatter: function (val) {
                  return val + "%"
                },
                title: {
                  formatter: function (seriesName) {
                    return 'Puntaje:'
                  }
                }
              }
            }
          }
        }
      },
      //METODOS PARA EXPORTAR A EXCEL
      exportToExcel() {
        let me = this
        let excel_areas = []
        $.each(me.data_docentes_areas, function (key, value) {
          $.each(value.areas, function (keyA, valueA) {
            excel_areas.push({ nombre_docente: value.nombre_docente, nombre_area: valueA.nombre_area, puntaje: valueA.puntaje })
          });
        });
        let headerTitle = ['Docente', 'Area', 'Puntaje'];
        let headerVal = ['nombre_docente', 'nombre_area', 'puntaje'];
        import('@/vendor/Export2Excel').then(excel => {
          const list = excel_areas
          const data = this.formatJson(headerVal, list)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileName,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
        })
      },
      clearFields() {
        this.fileName = ''
        this.cellAutoWidth = true
        this.selectedFormat = 'xls'
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      //METODO PARA OBTENER REPORTE CONSOLIDADO
      getReporteConsolidado() {
        let me = this
        me.data_consolidada = []
        me.loadingConsolidado = true
        this.$http.get(this.$server_url + 'salle_reporte_general_consolidado/' + me.periodoSelect + '/' + me.institucion_selected.idInstitucion)
          .then(res => {
            me.loadingConsolidado = false
            if (res.data.error) {
              this.$vs.notify({
                text: res.data.error,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              })
              return
            }
            me.data_consolidada = res.data.items
            // Ordenar por puntaje de evaluación descendente
            me.data_consolidada.sort((a, b) => {
              return b.puntaje_evaluacion - a.puntaje_evaluacion;
            });
          })
          .catch(function (error) {
            console.log(error);
            me.loadingConsolidado = false
            me.$vs.notify({
              text: 'Error al cargar el reporte consolidado',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-x-circle'
            })
          })
      },
      //METODO PARA EXPORTAR REPORTE CONSOLIDADO
      exportToExcelConsolidado() {
        let me = this
        let excel_consolidado = []
        $.each(me.data_consolidada, function (key, docente) {
          $.each(docente.areas, function (keyA, area) {
            $.each(area.asignaturas, function (keyAs, asignatura) {
              excel_consolidado.push({
                nombre_docente: docente.nombre_docente,
                //puntaje_general: docente.puntaje_evaluacion,
                nombre_area: area.nombre_area,
                //puntaje_area: area.puntaje,
                nombre_asignatura: asignatura.nombre_asignatura,
                puntaje_asignatura: asignatura.puntaje
              })
            });
          });
        });
        // let headerTitle = ['Docente', 'Puntaje General', 'Área', 'Puntaje Área', 'Asignatura', 'Puntaje Asignatura'];
        let headerTitle = ['Docente', 'Área','Asignatura', 'Puntaje Asignatura'];
        //let headerVal = ['nombre_docente', 'puntaje_general', 'nombre_area', 'puntaje_area', 'nombre_asignatura', 'puntaje_asignatura'];
        let headerVal = ['nombre_docente', 'nombre_area', 'nombre_asignatura', 'puntaje_asignatura'];
        import('@/vendor/Export2Excel').then(excel => {
          const list = excel_consolidado
          const data = this.formatJson(headerVal, list)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileName,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
        })
      },
      clearFieldsConsolidado() {
        this.fileName = ''
        this.cellAutoWidth = true
        this.selectedFormat = 'xls'
      },
    },
  }
</script>
<style scoped>
  /* Estilos para los tabs */
  .tabs-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    background: #ffffff;
  }

  .tabs-container {
    background: #f8f9fa;
  }

  .tabs-header {
    display: flex;
    border-bottom: 2px solid #e2e8f0;
    background: #ffffff;
  }

  .tab-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.9375rem;
    color: #718096;
    position: relative;
  }

  .tab-button i {
    font-size: 1.125rem;
    transition: all 0.3s ease;
  }

  .tab-button:hover {
    background: #f8f9fa;
    color: #4299e1;
  }

  .tab-button:hover i {
    transform: scale(1.1);
  }

  .tab-button.active {
    color: #4299e1;
    border-bottom-color: #4299e1;
    background: #ffffff;
  }

  .tab-button.active i {
    color: #4299e1;
  }

  /* Animación de entrada para el contenido de tabs */
  .tab-content-enter-active {
    animation: fadeIn 0.3s ease;
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

  /* Cards principales - diseño profesional */
  .chart-card,
  .top-teachers-card,
  .top-areas-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    overflow: hidden;
    background: #ffffff;
  }

  /* Altura flexible para cards laterales */
  .top-teachers-card,
  .top-areas-card {
    min-height: 480px;
    max-height: 700px;
    display: flex;
    flex-direction: column;
  }

  .top-teachers-card .vs-card__text,
  .top-areas-card .vs-card__text {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chart-card:hover,
  .top-teachers-card:hover,
  .top-areas-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  /* Headers profesionales */
  .card-header-professional {
    background: #f8f9fa;
    border-bottom: 1px solid #e2e8f0;
    padding: 12px 16px;
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
    font-size: 14px;
    color: #2d3748;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .header-subtitle {
    margin: 2px 0 0 0;
    color: #718096;
    font-size: 12px;
    font-weight: 500;
  }

  .header-icon {
    color: #4299e1;
    font-size: 18px;
    margin-left: 12px;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .top-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  .top-label {
    font-size: 12px;
    font-weight: 600;
    color: #718096;
    white-space: nowrap;
  }

  .top-select {
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #2d3748;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .top-select:hover {
    border-color: #4299e1;
  }

  .top-select:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  .chart-container-scrollable {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 600px;
    padding: 16px;
  }

  .chart-container-scrollable::-webkit-scrollbar {
    width: 6px;
  }

  .chart-container-scrollable::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 6px;
  }

  .chart-container-scrollable::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 6px;
  }

  .chart-container-scrollable::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  .header-actions {
    margin-left: 12px;
  }

  /* Contenido de cards */
  .card-content {
    padding: 16px;
    background: #ffffff;
  }

  /* Contenido específico para charts y tablas */
  .chart-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .top-areas-card .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Contenido scrolleable profesional */
  .scrollable-content {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 600px;
    border-radius: 4px;
  }

  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }

  .scrollable-content::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 6px;
  }

  .scrollable-content::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 6px;
  }

  .scrollable-content::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  /* Estado vacío */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
    min-height: 250px;
  }

  .empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .empty-icon i {
    font-size: 24px;
    color: #a0aec0;
  }

  .empty-text {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
  }

  .empty-subtext {
    font-size: 0.8125rem;
    color: #718096;
    margin: 0;
    max-width: 350px;
  }

  /* Estado vacío grande para tabs */
  .empty-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .empty-state-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    min-height: 400px;
  }

  .empty-icon-large {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    border: 2px solid #e2e8f0;
  }

  .empty-icon-large i {
    font-size: 36px;
    color: #a0aec0;
  }

  .empty-text-large {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 0.75rem 0;
  }

  .empty-subtext-large {
    font-size: 1rem;
    color: #718096;
    margin: 0;
    max-width: 450px;
    line-height: 1.6;
  }

  /* Estado de loading */
  .loading-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    min-height: 400px;
  }

  .loading-spinner {
    margin-bottom: 1.5rem;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
  }

  .loading-subtext {
    font-size: 0.9375rem;
    color: #718096;
    margin: 0;
    max-width: 400px;
  }

  /* Wrapper de tabla */
  .table-wrapper {
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* Header de tabla para docentes */
  .table-header-docentes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e2e8f0;
  }

  .header-info {
    flex: 1;
  }

  .header-stats {
    display: flex;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    min-width: 70px;
  }

  .stat-number {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2d3748;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.6875rem;
    color: #718096;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.25rem;
    font-weight: 600;
  }

  /* Contenido de tabla */
  .table-content {
    overflow-x: auto;
    flex: 1;
    overflow-y: auto;
    min-height: 300px;
  }

  .professional-table-docentes {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .professional-table-docentes thead {
    background: #2d3748;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .professional-table-docentes th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 700;
    font-size: 0.8125rem;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
  }

  .professional-table-docentes th i {
    color: rgba(255, 255, 255, 0.8);
  }

  .col-docente {
    width: 25%;
  }

  .col-areas {
    width: 50%;
  }

  .col-promedio {
    width: 25%;
  }

  .table-row-docente {
    transition: all 0.2s ease;
    border-bottom: 1px solid #e2e8f0;
  }

  .table-row-docente:hover {
    background: #f8f9fa;
  }

  .table-row-docente:last-child {
    border-bottom: none;
  }

  .professional-table-docentes td {
    padding: 1rem 1.25rem;
    vertical-align: middle;
  }

  /* Células específicas */
  .docente-cell {
    border-left: 3px solid transparent;
  }

  .table-row-docente:nth-child(odd) .docente-cell {
    border-left-color: #4299e1;
  }

  .table-row-docente:nth-child(even) .docente-cell {
    border-left-color: #48bb78;
  }

  .docente-info {
    display: flex;
    align-items: center;
  }

  .docente-name {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.875rem;
  }

  /* Contenedor de áreas */
  .areas-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  /* Contenedor scrolleable para áreas */
  .areas-scrollable {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
    padding: 0.25rem 0;
    white-space: nowrap;
    scroll-behavior: smooth;
  }

  /* Scrollbar horizontal profesional para áreas */
  .areas-scrollable::-webkit-scrollbar {
    height: 4px;
  }

  .areas-scrollable::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  .areas-scrollable::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }

  .areas-scrollable::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  /* Ajuste para badges en modo scroll */
  .areas-scrollable .area-badge {
    flex-shrink: 0;
    white-space: normal;
  }

  .area-badge {
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.5rem;
    min-width: 120px;
    transition: all 0.2s ease;
  }

  .area-badge:hover {
    background: #ffffff;
    border-color: #cbd5e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .area-name-badge {
    font-size: 0.75rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.25rem;
  }

  .area-score-badge {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #4299e1;
    text-align: center;
    background: #e6f3ff;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
  }

  /* Promedio */
  .promedio-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .promedio-value {
    font-weight: 700;
    color: #2d3748;
    font-size: 1rem;
  }

  .promedio-bar {
    width: 80px;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .promedio-fill {
    height: 100%;
    background: linear-gradient(90deg, #48bb78 0%, #4299e1 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  /* Filtro de docentes */
  .filter-docente-container {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1rem;
  }

  .search-docente>>>.vs__input {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    background: #ffffff;
    transition: all 0.2s ease;
  }

  .search-docente>>>.vs__input:focus {
    border-color: #4299e1;
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  .search-docente>>>.vs__input::placeholder {
    color: #718096;
    font-style: italic;
  }

  /* Botón de exportar */
  .export-btn {
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.3px;
  }

  /* Scrollbars específicos */
  .table-content::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .table-content::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 6px;
  }

  .table-content::-webkit-scrollbar-thumb {
    background: #4299e1;
    border-radius: 6px;
  }

  .table-content::-webkit-scrollbar-thumb:hover {
    background: #3182ce;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .card-header-professional {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
    }

    .header-title {
      font-size: 16px;
    }

    .header-subtitle {
      font-size: 13px;
    }

    .card-content {
      padding: 16px;
    }

    .table-header-docentes {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-stats {
      width: 100%;
      justify-content: space-around;
    }

    .professional-table-docentes th,
    .professional-table-docentes td {
      padding: 0.75rem 0.875rem;
    }

    .areas-container {
      flex-direction: column;
    }

    .area-badge {
      min-width: 100%;
    }

    .search-docente {
      max-width: 100%;
      min-width: auto;
    }
  }

  @media (max-width: 640px) {
    .professional-table-docentes {
      font-size: 0.8125rem;
    }

    .professional-table-docentes th {
      font-size: 0.75rem;
      padding: 0.75rem 0.625rem;
    }

    .professional-table-docentes td {
      padding: 0.75rem 0.625rem;
    }

    .docente-name {
      font-size: 0.8125rem;
    }

    .stat-number {
      font-size: 1rem;
    }

    .stat-label {
      font-size: 0.625rem;
    }

    .area-name-badge {
      font-size: 0.6875rem;
    }

    .area-score-badge {
      font-size: 0.75rem;
    }

    .promedio-value {
      font-size: 0.875rem;
    }
  }

  /* Scrollbars personalizados */
  .card-content-docentes::-webkit-scrollbar,
  .chart-container::-webkit-scrollbar {
    width: 6px;
  }

  .card-content-docentes::-webkit-scrollbar-track,
  .chart-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .card-content-docentes::-webkit-scrollbar-thumb,
  .chart-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .card-content-docentes::-webkit-scrollbar-thumb:hover,
  .chart-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Contenedor del gráfico */
  .chart-container {
    padding: 1rem;
    background: #ffffff;
    max-height: 450px;
    overflow-y: auto;
  }


  /* Contenido de cards */
  .card-content-docentes {
    padding: 1rem;
    background: #ffffff;
    max-height: 450px;
    overflow-y: auto;
  }

  .search-input-wrapper {
    max-width: 100%;
  }

  /* Container de tabla de docentes */
  .docentes-table-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }


  .docente-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .docente-card:hover {
    border-color: #cbd5e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  /* Header del docente */
  .docente-card-header {
    background: #f8f9fa;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    background: #2d3748;
    text-align: left;
    font-weight: 700;
    font-size: 0.8125rem;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
  }


  .docente-name-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .docente-name {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-align: left;
    font-size: 0.8125rem;
    color: #ffffff;
    text-transform: uppercase;
  }

  .docente-score-badge {
    background: #4299e1;
    color: #ffffff;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  /* Tabla de áreas */
  .areas-table {
    background: #ffffff;
  }

  .area-row {
    display: grid;
    grid-template-columns: 1fr 120px;
    border-bottom: 1px solid #f1f5f9;
  }

  .area-row:last-child {
    border-bottom: none;
  }

  /* Tabla de áreas */
  .areas-table {
    background: #ffffff;
  }

  .area-row {
    display: grid;
    grid-template-columns: 1fr 120px;
    border-bottom: 1px solid #f1f5f9;
  }

  .area-row:last-child {
    border-bottom: none;
  }

  .header-row {
    background: #f8f9fa;
    font-weight: 600;
  }

  .header-row .area-cell {
    color: #718096;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
  }

  .data-row:hover {
    background: #f8f9fa;
  }

  .area-cell {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    font-size: 0.8125rem;
  }

  .area-header,
  .score-header {
    color: #718096;
    font-weight: 600;
  }

  .area-name {
    color: #4299e1;
    font-weight: 600;
  }

  .area-score {
    color: #9f7aea;
    font-weight: 700;
    justify-content: center;
  }

  .area-bar {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .area-fill {
    height: 100%;
    background: linear-gradient(90deg, #48bb78 0%, #4299e1 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .area-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 5px;
  }

  .area-value {
    font-weight: 700;
    color: #2d3748;
    font-size: 0.875rem;
  }

  /* Estilos para el reporte consolidado */
  .top-general-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    overflow: hidden;
    background: #ffffff;
  }

  .top-general-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .docente-card-consolidado {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
  }

  .docente-card-consolidado:hover {
    border-color: #48bb78;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.15);
  }

  .docente-card-header-consolidado {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    padding: 0.875rem 1.25rem;
    border-bottom: 2px solid #38a169;
  }

  .docente-score-badge-consolidado {
    background: rgba(255, 255, 255, 0.95);
    color: #38a169;
    padding: 0.375rem 1rem;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 800;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .areas-asignaturas-container {
    padding: 1rem;
    background: #f8f9fa;
  }

  .area-section {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  .area-section:last-child {
    margin-bottom: 0;
  }

  .area-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    border-bottom: 1px solid #3182ce;
  }

  .area-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ffffff;
  }

  .area-title i {
    font-size: 1rem;
  }

  .area-name-text {
    font-weight: 700;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .area-score-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .area-score-value {
    font-weight: 800;
    font-size: 0.875rem;
    color: #ffffff;
    min-width: 50px;
    text-align: right;
  }

  .area-score-bar {
    width: 80px;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;
  }

  .area-score-fill {
    height: 100%;
    background: #ffffff;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .asignaturas-list {
    background: #ffffff;
  }

  .asignatura-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s ease;
  }

  .asignatura-item-row:last-child {
    border-bottom: none;
  }

  .asignatura-item-row:hover {
    background: #f8f9fa;
  }

  .asignatura-name-col {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .asignatura-name-col i {
    font-size: 0.875rem;
    color: #805ad5;
  }

  .asignatura-name-col span {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #2d3748;
  }

  .asignatura-score-col {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .asignatura-score-text {
    font-weight: 700;
    font-size: 0.8125rem;
    color: #805ad5;
    min-width: 50px;
    text-align: right;
  }

  .asignatura-score-bar-mini {
    width: 60px;
    height: 5px;
    background: #e9d8fd;
    border-radius: 3px;
    overflow: hidden;
  }

  .asignatura-score-fill-mini {
    height: 100%;
    background: linear-gradient(90deg, #805ad5 0%, #6f51b3 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  /* Responsive para consolidado */
  @media (max-width: 768px) {
    /* Tabs responsive */
    .tab-button {
      padding: 0.875rem 1rem;
      font-size: 0.8125rem;
    }

    .tab-button span {
      display: none;
    }

    .tab-button i {
      font-size: 1.25rem;
    }

    .area-header-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .area-score-container {
      width: 100%;
      justify-content: space-between;
    }

    .area-score-bar {
      flex: 1;
      max-width: 120px;
    }

    .asignatura-item-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .asignatura-score-col {
      width: 100%;
      justify-content: space-between;
    }

    .asignatura-score-bar-mini {
      flex: 1;
      max-width: 100px;
    }
  }

  @media (max-width: 640px) {
    .tabs-header {
      flex-direction: row;
    }

    .tab-button {
      padding: 1rem 0.5rem;
    }
  }
</style>