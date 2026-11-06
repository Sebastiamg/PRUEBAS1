<template>
  <div class="report-container">
    <!-- Estado vacío -->
    <div v-if="promedio_instituciones.length == 0" class="empty-state">
      <div class="empty-icon">
        <i class="feather icon-inbox"></i>
      </div>
      <p class="empty-text">No hay datos disponibles</p>
      <p class="empty-subtext">Seleccione un período de evaluación para visualizar las cantidades</p>
    </div>

    <!-- Tabla con datos -->
    <div v-else class="table-wrapper">
      <div class="table-header">
        <div class="header-info">
          <h5 class="table-title">Cantidad de Evaluaciones</h5>
          <p class="table-subtitle">Resumen por institución del total de evaluaciones realizadas</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{{ promedio_instituciones.length }}</span>
            <span class="stat-label">Instituciones</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalEvaluaciones }}</span>
            <span class="stat-label">Total Eval.</span>
          </div>
        </div>
      </div>

      <div class="table-content">
        <table class="professional-table">
          <thead>
            <tr>
              <th class="col-institution">
                <i class="feather icon-home mr-2"></i>
                Institución
              </th>
              <th class="col-evaluations">
                <i class="feather icon-file-text mr-2"></i>
                Total Evaluaciones
              </th>
              <th class="col-average">
                <i class="feather icon-bar-chart-2 mr-2"></i>
                Promedio
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in promedio_instituciones" :key="key" class="table-row">
              <td class="institution-cell">
                <div class="institution-info">
                  <span class="institution-name">{{ item.nombreInstitucion }}</span>
                </div>
              </td>
              <td class="evaluations-cell">
                <div class="evaluation-badge">
                  <span class="evaluation-count">{{ item.cant_evaluaciones }}</span>
                </div>
              </td>
              <td class="average-cell">
                <div class="average-container">
                  <span class="average-value">{{ item.puntaje }}%</span>
                  <div class="average-bar">
                    <div class="average-fill" :style="{width: item.puntaje + '%'}"></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default{
  data(){
    return{
      //VARIABLES NORMALES
      promedio_instituciones: [],
    }
  },
  computed: {
    totalEvaluaciones() {
      return this.promedio_instituciones.reduce((total, item) => total + parseInt(item.cant_evaluaciones), 0);
    }
  },
  props:{
    n_evaluacion:{
      type:Number,
      default:0
    },
  },
  watch:{
    n_evaluacion(results){
      let me = this;
      if(results == null || results == "null" || results == "" || results == undefined ){
        me.promedio_instituciones = []
        return
      }
      me.getReporteInstituciones()
    }
  },
  created(){
      let me = this;
  },
  mounted(){
    let me = this
    // me.getReporteInstituciones()
  },
  methods:{
    getReporteInstituciones(){
      let me = this
      me.promedio_instituciones = []
      me.$vs.loading()
      this.$http.get(this.$server_url+'reporte_evaluaciones_institucion/'+me.n_evaluacion+'/'+localStorage.Salletipo_institucion_id)
      .then(res => {
        me.$vs.loading.close()
        me.promedio_instituciones = res.data.items
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
  }
}
</script>
<style scoped>
.report-container {
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

/* Wrapper de tabla */
.table-wrapper {
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
}

/* Header de tabla */
.table-header {
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

.table-title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.table-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  color: #718096;
  font-weight: 500;
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
}

.professional-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.professional-table thead {
  background: #2d3748;
}

.professional-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.8125rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
}

.professional-table th i {
  color: rgba(255, 255, 255, 0.8);
}

.col-institution {
  width: 45%;
}

.col-evaluations {
  width: 25%;
  text-align: center;
}

.col-average {
  width: 30%;
}

.table-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid #e2e8f0;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.professional-table td {
  padding: 1rem 1.25rem;
  vertical-align: middle;
}

/* Células específicas */
.institution-cell {
  border-left: 3px solid transparent;
}

.table-row:nth-child(odd) .institution-cell {
  border-left-color: #4299e1;
}

.table-row:nth-child(even) .institution-cell {
  border-left-color: #48bb78;
}

.institution-info {
  display: flex;
  align-items: center;
}

.institution-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.evaluations-cell {
  text-align: center;
}

.evaluation-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #4299e1;
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8125rem;
  min-width: 45px;
}

.evaluation-count {
  line-height: 1;
}

.average-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.average-value {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.875rem;
}

.average-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.average-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #4299e1 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-stats {
    width: 100%;
    justify-content: space-around;
  }

  .professional-table th,
  .professional-table td {
    padding: 0.75rem 0.875rem;
  }

  .table-title {
    font-size: 0.875rem;
  }

  .table-subtitle {
    font-size: 0.75rem;
  }

  .empty-state {
    padding: 2rem 1rem;
    min-height: 200px;
  }
}

@media (max-width: 640px) {
  .professional-table {
    font-size: 0.8125rem;
  }

  .professional-table th {
    font-size: 0.75rem;
    padding: 0.75rem 0.625rem;
  }

  .professional-table td {
    padding: 0.75rem 0.625rem;
  }

  .institution-name {
    font-size: 0.8125rem;
  }

  .evaluation-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  .stat-number {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.625rem;
  }
}
</style>
