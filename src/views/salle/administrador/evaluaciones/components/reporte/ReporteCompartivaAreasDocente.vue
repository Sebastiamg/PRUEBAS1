<template>
  <div class="docente-report-container">
    <!-- Estado vacío -->
    <div v-if="data_docentes_areas.length == 0" class="empty-state-docentes">
      <div class="empty-icon-docentes">
        <i class="feather icon-users"></i>
      </div>
      <p class="empty-text-docentes">No hay evaluaciones disponibles</p>
      <p class="empty-subtext-docentes">Seleccione una institución para visualizar los datos de docentes</p>
    </div>

    <!-- Contenido con datos -->
    <div v-else class="reports-grid">
      <!-- Botón de exportación -->
      <!-- <div class="export-section">
        <vs-button 
          @click="exportDataXAreas();" 
          color="success" 
          type="filled" 
          class="export-button"
          icon-pack="feather" 
          icon="icon-download"
        >
          Exportar Excel por Áreas
        </vs-button>
      </div> -->

      <!-- TOP DOCENTES POR AREAS -->
      <div class="report-card areas-card">
        <div class="card-header-docentes">
          <div class="header-info-docentes">
            <h5 class="card-title-docentes">Top Docentes por Áreas</h5>
            <p class="card-subtitle-docentes">Ranking de docentes mejor puntuados por área de evaluación</p>
          </div>
          <div class="header-actions">
            <vs-button 
              size="small" 
              icon-pack="feather" 
              icon="icon-download" 
              color="primary" 
              type="border"
              @click="fileName='reporte_docentes_areas'; activePromptExcel=true"
              class="action-button"
            >
              Exportar
            </vs-button>
          </div>
        </div>
        <div class="filter-docente-container">
          <div class="search-input-wrapper">
            <vs-input 
              v-model="filtroDocenteArea"
              placeholder="Buscar docente por nombre..."
              icon="search"
              class="search-docente w-full"
            />
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

      <!-- REPORTE MEJORES DOCENTES -->
      <div class="report-card chart-card">
        <div class="card-header-docentes">
          <div class="header-info-docentes">
            <h5 class="card-title-docentes">Ranking General de Docentes</h5>
            <p class="card-subtitle-docentes">Clasificación por puntaje final de evaluación</p>
          </div>
          <div class="header-controls-right">
            <div class="top-selector-compact">
              <label class="top-label-compact">Mostrar:</label>
              <select v-model="topDocentesLimit" @change="graficoTopDocAreas" class="top-select-compact">
                <option :value="10">Top 10</option>
                <option :value="15">Top 15</option>
                <option :value="20">Top 20</option>
                <option :value="30">Top 30</option>
                <option :value="data_docentes_areas.length">Todos ({{data_docentes_areas.length}})</option>
              </select>
            </div>
            <div class="stat-badge">
              <span class="stat-number">{{ data_docentes_areas.length }}</span>
              <span class="stat-label">Docentes</span>
            </div>
          </div>
        </div>
        
        <div class="chart-container-scrollable" id="div_top_1">
          <vue-apex-charts 
            type="bar" 
            :options="barChartTopDoc.chartOptions" 
            :series="barChartTopDoc.series"
          />
        </div>
      </div>
    </div>
    
    <!-- MODALES -->
    <vs-prompt 
      title="Exportar a Excel" 
      class="export-modal" 
      @cancle="clearFields" 
      @accept="exportToExcel" 
      accept-text="Exportar" 
      :active.sync="activePromptExcel"
    >
      <div class="modal-content">
        <vs-input 
          v-model="fileName" 
          placeholder="Ingrese el nombre del archivo" 
          class="w-full modal-input" 
        />
        <v-select 
          v-model="selectedFormat" 
          :options="formats" 
          class="modal-select" 
          placeholder="Seleccione formato"
        />
      </div>
    </vs-prompt>
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
  import theme from '../../theme.json'
  import VueApexCharts from 'vue-apexcharts'
  ECharts.registerTheme('ovilia-green', theme)
export default{
  data(){
    return{
      //variables areas
      data_docentes_areas:[],
      columnChart: {},
      key_areas:[],
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
      tmpArrayReporte:[],
      //fin variables para exportar a excel
      //variable para filtro de docentes por área
      filtroDocenteArea: '',
      //fin variable para filtro de docentes por área
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
    }
  },
  components:{
    'v-select': vSelect,
    flatPickr,
    ECharts,
    VueApexCharts,
    ReporteAsignaturaSalleVue,
  },
  props:{
    institucion_selected:{
      type:String,
      default:''
    },
    periodoSelect:{
      type:String,
      default:''
    },
    searchReporte:{
      type:Boolean,
      default:false,
    }
  },
  watch:{
    institucion_selected(results){
      let me = this;
      me.data_docentes_areas = []
      me.columnChart         = {}
      me.key_areas           = []
      me.barChartTopDoc      = {}
      me.filtroDocenteArea   = ''
      if(results && me.periodoSelect){
        me.getPromedioAreas()
      }
    },
    periodoSelect(results){
      let me = this;
      me.data_docentes_areas = []
      me.columnChart         = {}
      me.key_areas           = []
      me.barChartTopDoc      = {}
      me.filtroDocenteArea   = ''
      if(results && me.institucion_selected){
        me.getPromedioAreas()
      }
    },
    searchReporte(results){
      let me = this
      me.data_docentes_areas = []
      me.columnChart         = {}
      me.key_areas           = []
      me.barChartTopDoc      = {}
      if(me.periodoSelect && me.institucion_selected){
        me.getPromedioAreas()
      }
    }
  },
  mounted(){
    let me = this;
  },
  methods: {
    getPromedioAreas(){
      let me = this
      me.data_docentes_areas = []
      me.columnChart         = []
      me.$vs.loading()
      this.$http.get(this.$server_url+'salle_promedio_areas/'+me.periodoSelect+'/'+me.institucion_selected.idInstitucion)
      .then(res => {
        if(res.data.length == 0){
          me.$vs.loading.close()
          this.$vs.notify({
          text:'No se encontro datos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
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
        $.each(res.data.items,function(key, value){
          $.each(value.areas,function(keyA, valueA){
            areas.push({ nombre_area: valueA.nombre_area, puntaje: valueA.puntaje, id_area: valueA.id_area })
          });
        });
        // console.log("ar",areas)
        let areas_agrupadas = []
        areas_agrupadas = me.groupArrayOfObjects(areas, "nombre_area")
        // console.log("or",areas_agrupadas)
        me.key_areas = []
        let key_areas_1 = []
        $.each(areas_agrupadas,function(key, value){
          key_areas_1.push(key)
          me.key_areas.push(value[0])
        });
        // console.log("uno",key_areas_1)
        // console.log("dos",me.key_areas)
        let puntajes_areas = []
        let nombre_areas = []
        for( let i=0; i<key_areas_1.length; i++){
          let acum_puntaje = 0
          $.each(areas_agrupadas[key_areas_1[i]],function(key, value){
            acum_puntaje += value.puntaje
          });
          let porcentaje_area = ((acum_puntaje * 100) / ((areas_agrupadas[key_areas_1[i]].length) * 100) ).toFixed(2)
          puntajes_areas.push(porcentaje_area)
          nombre_areas.push(key_areas_1[i])
        }
        console.log("fi1",puntajes_areas)
        console.log("fi2",nombre_areas)
        me.columnChart = {
          series: [{
            name: 'Promedio',
            data: puntajes_areas
          }],
          chartOptions: {
            colors: ['#E6AD4A','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0'],
            plotOptions: { bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%', }, },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: { categories: nombre_areas },
            yaxis: { title: { text: '(Promedio)' } },
            fill: { opacity: 1 },
          tooltip: { y: { formatter: function(val) { return val + "%" } } }
          }
        }
        me.f_reporteporAreas()
        me.$vs.loading.close()
      })
      .catch(function (error) {
        console.log(error);
        me.$vs.loading.close()
      })
    },
    f_reporteporAreas(){
      let me = this
      me.tmpArrayReporte = []
      const todasLasAreas = Array.from(new Set(
        me.data_docentes_areas.flatMap(d => d.areas.map(a => a.nombre_area))
      ));

      // Paso 2: transformar la data a formato tabla
      me.tmpArrayReporte = me.data_docentes_areas.map(docente => {
        const fila = {
          docente: docente.nombre_docente.trim()
        };

        // Inicializar todas las columnas de áreas en blanco
        todasLasAreas.forEach(area => {
          fila[area] = '';
        });

        // Rellenar con los puntajes
        docente.areas.forEach(area => {
          fila[area.nombre_area] = area.puntaje;
        });

        return fila;
      });

      console.log("dataParaExcel",me.tmpArrayReporte)
    },
    groupArrayOfObjects(list, key) {
      return list.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    graficoTopDocAreas(){
      let me = this
      let puntaje_evaluaciones  = []
      let nombre_docentes       = []
      
      // Limitar a los top N docentes
      let docentesLimitados = me.data_docentes_areas.slice(0, me.topDocentesLimit)
      
      $.each(docentesLimitados,function(key, value){
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
            formatter: function(val, opts) { 
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
    },
    //METODOS PARA EXPORTAR A EXCEL
    exportToExcel() {
      let me = this
      let excel_areas = []
      $.each(me.data_docentes_areas,function(key, value){
        $.each(value.areas,function(keyA, valueA){
            excel_areas.push({ nombre_docente: value.nombre_docente, nombre_area: valueA.nombre_area, puntaje: valueA.puntaje})
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
    
    //EXPORTAR POR AREAS
    exportDataXAreas() {
      let me = this
      try {
        let arrayData = this.tmpArrayReporte;
        let excluir = arrayData
        // let excluir = arrayData.map(p => {
        //   let { id_pedido, id_asesor, ...rest } = p;
        //   return rest;
        // });
        let data = excluir[0]
        let valores_headerTitle = Object.keys(data)
        let valores_headerVal   = Object.keys(data)
        me.exportTodo(valores_headerTitle,valores_headerVal,excluir,'ReporteDocentesPorAreas_'+me.institucion_selected.institucion_ciudad)
      
      } catch (error) {
        console.error('Error exporting to Excel:', error);
      }
    },
    exportTodo(valores_headerTitle,valores_headerVal,arrayDatos,nombreArchivo){
      let headerTitle = [...valores_headerTitle];
      let headerVal   = [...valores_headerVal ];
      import('@/vendor/Export2Excel').then(excel => {
        let datos = []
        datos = arrayDatos
        const data = this.formatJson(headerVal, datos)
        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: nombreArchivo,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat
        })
        this.clearFields()
      })
    },
  },
}
</script>
<style scoped>
/* Container principal */
.docente-report-container {
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
}

/* Estado vacío */
.empty-state-docentes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  min-height: 300px;
}

.empty-icon-docentes {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.empty-icon-docentes i {
  font-size: 28px;
  color: #a0aec0;
}

.empty-text-docentes {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.empty-subtext-docentes {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
  max-width: 400px;
}

/* Sección de exportación */
.export-section {
  padding: 1rem 0;
  text-align: right;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.export-button {
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8125rem;
  letter-spacing: 0.3px;
}

/* Grid de reportes */
.reports-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Cards de reporte */
.report-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

/* Header de cards */
.card-header-docentes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.header-info-docentes {
  flex: 1;
}

.card-title-docentes {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.card-subtitle-docentes {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  color: #718096;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
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

.action-button {
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.chart-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #4299e1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 70px;
}

.stat-number {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.stat-label {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

/* Contenido de cards */
.card-content-docentes {
  padding: 1rem;
  background: #ffffff;
  max-height: 450px;
  overflow-y: auto;
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

.search-input-wrapper {
  max-width: 100%;
}

.search-docente >>> .vs__input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  background: #ffffff;
  transition: all 0.2s ease;
}

.search-docente >>> .vs__input:focus {
  border-color: #4299e1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.search-docente >>> .vs__input::placeholder {
  color: #718096;
  font-style: italic;
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

/* Contenedor del gráfico */
.chart-container {
  padding-top: 30px;
  padding: 1rem;
  background: #ffffff;
  max-height: 450px;
  overflow-y: auto;
}

.chart-container-scrollable {
  padding: 1rem;
  background: #ffffff;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.chart-container-scrollable::-webkit-scrollbar {
  width: 8px;
}

.chart-container-scrollable::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.chart-container-scrollable::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.chart-container-scrollable::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Modal de exportación */
.export-modal {
  border-radius: 8px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.modal-input {
  border-radius: 6px;
}

.modal-select {
  border-radius: 6px;
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

/* Responsive */
@media (max-width: 768px) {
  .reports-grid {
    gap: 1.5rem;
  }

  .card-header-docentes {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .header-actions,
  .header-controls-right {
    width: 100%;
    justify-content: flex-end;
  }
  
  .top-selector-compact {
    flex: 1;
    justify-content: flex-start;
  }

  .export-section {
    text-align: center;
  }

  .docente-name-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .area-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .area-cell {
    padding: 0.5rem 1rem;
    justify-content: center;
    text-align: center;
  }

  .header-row .area-cell {
    background: #e2e8f0;
    font-weight: 700;
  }
}

@media (max-width: 640px) {
  .card-title-docentes {
    font-size: 0.875rem;
  }

  .card-subtitle-docentes {
    font-size: 0.75rem;
  }

  .docente-name {
    font-size: 0.8125rem;
  }

  .docente-score-badge {
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
  }

  .area-cell {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .empty-state-docentes {
    padding: 2rem 1rem;
  }
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
</style>

