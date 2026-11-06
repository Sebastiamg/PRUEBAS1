<template>
  <div>
    <vx-card class="mb-base area-selector-card">
      <template slot="no-body">
        <div class="card-header-professional">
          <div class="header-content">
            <h4 class="header-title">Área Seleccionada: {{area_selected || 'Ninguna'}}</h4>
            <p class="header-subtitle">Seleccione un área para visualizar el análisis detallado por asignaturas</p>
          </div>
          <div class="header-icon">
            <i class="feather icon-target"></i>
          </div>
        </div>
        <div class="card-content">
          <div class="areas-chips-container">
            <div 
              class="area-chip" 
              :key="index" 
              v-for="(chip, index) in key_areas" 
              @click="getPromedioAsignaturas(chip)"
              :class="{ 'active': area_selected === chip.nombre_area }"
            >
              <div class="chip-avatar">{{(chip.nombre_area).substr(0,2).toUpperCase()}}</div>
              <span class="chip-text">{{chip.nombre_area}}</span>
            </div>
          </div>
        </div>
      </template>
    </vx-card>
    <!--SECCIÓN DE REPORTES - LADO A LADO RESPONSIVE-->
    <div class="vx-row mb-6" v-if="area_selected">
      <!--GRÁFICO PROMEDIO POR ASIGNATURAS-->
      <div class="vx-col w-1/2 lg:w-1/2 md:w-full sm:w-full pr-3 mb-3">
        <vx-card class="chart-asignaturas-card h-full">
          <template slot="no-body">
            <div class="card-header-professional">
              <div class="header-content">
                <h4 class="header-title">Promedios por Asignaturas</h4>
                <p class="header-subtitle">Comparación de asignaturas del área: <strong>{{area_selected}}</strong></p>
              </div>
              <div class="header-icon">
                <i class="feather icon-trending-up"></i>
              </div>
            </div>
            <div class="card-content">
              <vue-apex-charts type="bar" height="280" :options="barChart.chartOptions" :series="barChart.series"></vue-apex-charts>
            </div>
          </template>
        </vx-card>
      </div>
      
      <!--TOP DOCENTES POR ASIGNATURA-->
      <div class="vx-col w-1/2 lg:w-1/2 md:w-full sm:w-full pl-3 mb-3">
        <vx-card class="top-asignaturas-card">
          <template slot="no-body">
            <div class="card-header-professional">
              <div class="header-content">
                <h4 class="header-title">Top Docentes por Asignaturas</h4>
                <p class="header-subtitle">Docentes mejor puntuados por asignaturas en área: <strong>{{area_selected}}</strong></p>
              </div>
              <div class="table-header-docentes">
                <div class="header-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ docentesFiltrados.length }}</span>
                    <span class="stat-label">Docentes</span>
                  </div>
                </div>
              </div>
              <div class="header-actions">
                <vs-button 
                  size="small" 
                  class="export-btn" 
                  icon-pack="feather" 
                  icon="icon-download" 
                  color="primary" 
                  type="line"
                  @click="fileNameAs='reporte_docentes_asignaturas'; activePromptExcelAsignaturas=true"
                >
                  Exportar
                </vs-button>
              </div>
            </div>
            <div class="card-content">
              <!-- Estado vacío -->
              <div v-if="docentesFiltrados.length == 0" class="empty-state">
                <div class="empty-icon">
                  <i class="feather icon-users"></i>
                </div>
                <p class="empty-text">No hay docentes disponibles</p>
                <p class="empty-subtext">No se encontraron docentes que coincidan con el filtro o área seleccionada</p>
              </div>

              <!-- Lista con datos -->
              <div v-else >
                <div class="filter-docente-container">
                  <div class="search-input-wrapper">
                    <vs-input v-model="filtroDocente" placeholder="Buscar docente por nombre..." icon="search"
                      class="search-docente w-full" />
                  </div>
                </div>
                <div class="card-content-docentes" id="div_top_asignatura">
                  <div class="docentes-table-container">
                    <div v-for="(evaluacion, index) in docentesFiltrados" :key="index" class="docente-card">
                      <div class="docente-card-header">
                        <div class="docente-name-container">
                          <h6 class="docente-name">{{ evaluacion.nombre_docente.toUpperCase() }}</h6>
                          <div class="docente-score-badge">{{ evaluacion.puntaje_evaluacion }}%</div>
                        </div>
                      </div>

                      <div class="areas-table">
                        <div class="asignatura-row header-row">
                          <div class="asignatura-cell asignatura-header">ÁREA:</div>
                          <div class="asignatura-cell score-header">PUNTAJE:</div>
                        </div>
                        <div v-for="(asignatura, indexA) in evaluacion.asignaturas" :key="indexA" class="asignatura-row data-row">
                          <div class="asignatura-cell asignatura-name">{{ asignatura.nombre_asignatura }}</div>
                          <div class="asignatura-container">
                            <span class="asignatura-value">{{ asignatura.puntaje }}%</span>
                            <div class="asignatura-bar">
                              <div class="asignatura-fill" :style="{width: asignatura.puntaje + '%'}"></div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                
                <!-- <div class="docentes-list" id="div_top_asignatura">
                  <div v-for="(evaluacion, index) in docentesFiltrados" :key="index" class="docente-card">
                    <div class="docente-header">
                      <div class="docente-info">
                        <h4 class="docente-name">{{ evaluacion.nombre_docente.toUpperCase() }}</h4>
                        <div class="docente-score-container">
                          <span class="docente-total-score">{{ evaluacion.puntaje_evaluacion }}%</span>
                          <div class="score-bar">
                            <div class="score-fill" :style="{width: evaluacion.puntaje_evaluacion + '%'}"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="asignaturas-section">
                      <div class="asignaturas-grid">
                        <div v-for="(asignatura, indexA) in evaluacion.asignaturas" :key="indexA" class="asignatura-item">
                          <span class="asignatura-name">{{ asignatura.nombre_asignatura }}</span>
                          <span class="asignatura-score">{{ asignatura.puntaje }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </template>
        </vx-card>
      </div>
    </div>
    <!--MODALES-->
    <!----modal exportar asignaturas--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcelAsignaturas" accept-text="Exportar" :active.sync="activePromptExcelAsignaturas">
      <vs-input v-model="fileNameAs" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
      </div>
    </vs-prompt>
    <!----fin modal exportar--------->
  </div>
</template>
<script>
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
export default{
  data(){
    return{
      colores: ['#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0', '#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F'],
      area_selected:'',
      data_docentes_asignaturas: [],
      key_asignaturas:[],
      barChart: {},
      asignatura_selected:'',
      //variables para exportar a excel
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      selectedFormat: 'xls',
      fileNameAs: '',
      activePromptExcelAsignaturas: false,
      //fin variables para exportar a excel
      //variable para filtro de docentes
      filtroDocente: '',
      //fin variable para filtro de docentes
    }
  },
  watch:{
    institucion_selected(results){
      let me = this;
      me.data_docentes_asignaturas  = []
      me.barChart                   = {}
      me.key_asignaturas            = []
    },
    periodoSelect(results){
      let me = this;
      me.data_docentes_asignaturas  = []
      me.barChart                   = {}
      me.key_asignaturas            = []
      me.filtroDocente              = ''
    }
  },
  computed: {
    docentesFiltrados() {
      let me = this;
      if (!me.filtroDocente || me.filtroDocente.trim() === '') {
        return me.data_docentes_asignaturas;
      }
      return me.data_docentes_asignaturas.filter(docente => 
        docente.nombre_docente.toLowerCase().includes(me.filtroDocente.toLowerCase())
      );
    },
    totalAsignaturas() {
      let totalAsignaturas = 0;
      this.data_docentes_asignaturas.forEach(docente => {
        totalAsignaturas += docente.asignaturas ? docente.asignaturas.length : 0;
      });
      return totalAsignaturas;
    }
  },
  props:{
    key_areas:{
      type:Array,
      default:[]
    },
    institucion_selected:{
      type:String,
      default:''
    },
    periodoSelect:{
      type:String,
      default:''
    },
  },
  components:{
    'v-select': vSelect,
    flatPickr,
    ECharts,
    VueApexCharts,
  },
  methods:{
    getPromedioAsignaturas(area){
      let me = this
      me.data_docentes_asignaturas  = []
      me.barChart                   = {}
      me.area_selected              = area.nombre_area
      me.filtroDocente              = ''
      me.$vs.loading()
      this.$http.get(this.$server_url+'salle_promedio_asignatura/'+me.periodoSelect+'/'+me.institucion_selected.idInstitucion+'/'+area.id_area)
      .then(res => {
        me.data_docentes_asignaturas = res.data.items
        if(me.data_docentes_asignaturas.length == 0){
          return
        }
        me.data_docentes_asignaturas.sort((a, b) => {
          return b.puntaje_evaluacion - a.puntaje_evaluacion;
        });
        let asignaturas = []
        $.each(res.data.items,function(key, value){
          $.each(value.asignaturas,function(keyA, valueA){
              asignaturas.push({nombre_asignatura: valueA.nombre_asignatura, puntaje: valueA.puntaje })
          });
        });
        let asignaturas_agrupadas = []
        asignaturas_agrupadas     = me.groupArrayOfObjects(asignaturas, "nombre_asignatura")
        me.key_asignaturas        = []
        let key_asignaturas_1     = []
        $.each(asignaturas_agrupadas,function(key, value){
          //obtener las asignaturas
          key_asignaturas_1.push(key)
          //obtener las asignaturas pero para recorrer con un bucle
          me.key_asignaturas.push(value[0])
        });
        var puntajes_asignaturas  = []
        var nombre_asignaturas    = []
        for( let i=0; i<key_asignaturas_1.length; i++){
          let acum_puntaje = 0
          $.each(asignaturas_agrupadas[key_asignaturas_1[i]],function(key, value){
            acum_puntaje += value.puntaje
          });
          let porcentaje_asignatura = ((acum_puntaje) / ((asignaturas_agrupadas[key_asignaturas_1[i]].length)) ).toFixed(2)
          puntajes_asignaturas.push(porcentaje_asignatura)
          nombre_asignaturas.push(key_asignaturas_1[i])
        }
        me.barChart = {}
        me.barChart = {
          series: [{
            data: puntajes_asignaturas
          }],
          chartOptions: {
            colors: ['#805ad5', '#38a169', '#4299e1', '#d69e2e', '#e53e3e','#319795', '#3182ce', '#2d3748', '#718096', '#805ad5','#38a169', '#4299e1', '#d69e2e', '#e53e3e', '#319795'],
            plotOptions: { bar: { horizontal: true, } },
            dataLabels: { enabled: true },
            xaxis: { categories: nombre_asignaturas, }
          }
        }
        me.$vs.loading.close()
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error);
      })
    },
    groupArrayOfObjects(list, key) {
      return list.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
      }, {});
    },
    //METODOS PARA EXPORTAR EXCEL
    exportToExcelAsignaturas() {
      let me = this
      let excel_asignaturas = []
      $.each(me.data_docentes_asignaturas, function(key, value){
        $.each(value.asignaturas,function(keyA, valueA){
            excel_asignaturas.push({ nombre_docente: value.nombre_docente, nombre_asignatura: valueA.nombre_asignatura, puntaje: valueA.puntaje})
        });
      });
      let headerTitle = ['Docente', 'Asignatura', 'Puntaje'];
      let headerVal = ['nombre_docente', 'nombre_asignatura', 'puntaje'];
      import('@/vendor/Export2Excel').then(excel => {
        const list = excel_asignaturas
        const data = this.formatJson(headerVal, list)
        excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileNameAs,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
        })
      })
    },
    clearFields() {
      this.fileNameAs = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
  }
}
</script>
<style scoped>
/* Cards principales - diseño profesional */
.area-selector-card, .chart-asignaturas-card, .top-asignaturas-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  overflow: hidden;
  background: #ffffff;
}

.top-asignaturas-card {
  height: 480px;
  display: flex;
  flex-direction: column;
}

.area-selector-card:hover, .chart-asignaturas-card:hover, .top-asignaturas-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

.header-actions {
  margin-left: 12px;
}

/* Contenido de cards */
.card-content {
  padding: 16px;
  background: #ffffff;
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

/* Wrapper para docentes */
.docentes-wrapper {
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header del filtro */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e2e8f0;
}

.stats-info {
  flex-shrink: 0;
}

.stats-text {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
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


/* Lista de docentes */
.docentes-list {
  overflow-y: auto;
  flex: 1;
  padding: 1rem;
  min-height: 300px;
}

/* Card de docente */
.docente-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  overflow: hidden;
}

.docente-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

/* Header del docente */
.docente-header {
  background: #5454dd;
  padding: 1rem 1.25rem;
  color: white;
}

.docente-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.docente-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.docente-score-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.docente-total-score {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.score-bar {
  width: 80px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff54cc 0%, #6a157a 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Sección de asignaturas */
.asignaturas-section {
  padding: 1rem 1.25rem;
  background: #f8f9fa;
}

/* Grid de asignaturas */
.asignaturas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

/* Item de asignatura */
.asignatura-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.asignatura-item:hover {
  border-color: #805ad5;
  box-shadow: 0 2px 4px rgba(128, 90, 213, 0.1);
  transform: translateY(-1px);
}

.asignatura-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  flex: 1;
  margin-right: 0.75rem;
}

.asignatura-score {
  font-size: 0.875rem;
  font-weight: 700;
  color: #805ad5;
  background: #e9d8fd;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  min-width: 50px;
  text-align: center;
}

/* Contenedor de chips profesional */
.areas-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

/* Chips de áreas profesionales */
.area-chip {
  display: flex;
  align-items: center;
  background: #ffffff;
  color: #2d3748;
  padding: 6px 12px 6px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.area-chip:hover {
  border-color: #4299e1;
  box-shadow: 0 1px 4px rgba(66, 153, 225, 0.15);
  transform: translateY(-1px);
}

.area-chip.active {
  background: #4299e1;
  color: white;
  border-color: #3182ce;
  box-shadow: 0 1px 4px rgba(66, 153, 225, 0.3);
}

.chip-avatar {
  background: #f8f9fa;
  color: #2d3748;
  width: 24px;
  height: 24px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  margin-right: 8px;
  border: 1px solid #e2e8f0;
}

.area-chip.active .chip-avatar {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.chip-text {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.2px;
}

/* Scrollbars específicos para lista de docentes */
.docentes-list::-webkit-scrollbar {
  width: 6px;
}

.docentes-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 6px;
}

.docentes-list::-webkit-scrollbar-thumb {
  background: #805ad5;
  border-radius: 6px;
}

.docentes-list::-webkit-scrollbar-thumb:hover {
  background: #6f51b3;
}

/* Botón de exportar */
.export-btn {
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.3px;
}

/* Layout lado a lado responsivo */
.h-full {
  height: 100%;
}

.vx-col.pr-3 {
  padding-right: 12px;
}

.vx-col.pl-3 {
  padding-left: 12px;
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

/* Filtro de docentes */
.filter-docente-container {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
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

/* Contenido de cards */
.card-content-docentes {
  padding: 1rem;
  background: #ffffff;
  max-height: 450px;
  overflow-y: auto;
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

  /* Tabla de asignaturas */
  .asignaturas-table {
    background: #ffffff;
  }

  .asignatura-row {
    display: grid;
    grid-template-columns: 1fr 120px;
    border-bottom: 1px solid #f1f5f9;
  }

  .asignatura-row:last-child {
    border-bottom: none;
  }

  /* Tabla de asignaturas */
  .asignaturas-table {
    background: #ffffff;
  }

  .asignatura-row {
    display: grid;
    grid-template-columns: 1fr 120px;
    border-bottom: 1px solid #f1f5f9;
  }

  .asignatura-row:last-child {
    border-bottom: none;
  }

  .header-row {
    background: #f8f9fa;
    font-weight: 600;
  }

  .header-row .asignatura-cell {
    color: #718096;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
  }

  .data-row:hover {
    background: #f8f9fa;
  }

  .asignatura-cell {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    font-size: 0.8125rem;
  }

  .asignatura-header,
  .score-header {
    color: #718096;
    font-weight: 600;
  }

  .asignatura-name {
    color: #4299e1;
    font-weight: 600;
  }

  .asignatura-score {
    color: #9f7aea;
    font-weight: 700;
    justify-content: center;
  }

  .asignatura-bar {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .asignatura-fill {
    height: 100%;
    background: linear-gradient(90deg, #48bb78 0%, #4299e1 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .asignatura-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 5px;
  }

  .asignatura-value {
    font-weight: 700;
    color: #2d3748;
    font-size: 0.875rem;
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


/* Responsive */
@media (max-width: 1024px) {
  .vx-col.w-1\/2.lg\:w-1\/2.md\:w-full {
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  .table-content {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .areas-chips-container {
    justify-content: center;
  }
  
  .area-chip {
    margin: 4px;
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
  
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-docente {
    max-width: 100%;
    min-width: auto;
  }

  .docente-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .docente-score-container {
    align-items: flex-start;
  }

  .asignaturas-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .docente-name {
    font-size: 0.875rem;
  }

  .docente-total-score {
    font-size: 1.125rem;
  }

  .asignatura-name {
    font-size: 0.8125rem;
  }

  .asignatura-score {
    font-size: 0.8125rem;
    min-width: 45px;
  }

  .stats-text {
    font-size: 0.75rem;
  }

  .docentes-list {
    padding: 0.75rem;
  }

  .docente-header {
    padding: 0.75rem 1rem;
  }

  .asignaturas-section {
    padding: 0.75rem 1rem;
  }
}

.promedio-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #4299e1 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}



</style>