<template>
  <div class="dashboard-stats">
    <div class="dashboard-header">
      <h2><Icon name="chart" /> Dashboard de Capacitaciones</h2>
      <button @click="cargarEstadisticas" class="btn-refresh" :disabled="cargando">
        <span v-if="!cargando"><Icon name="refresh" /> Actualizar</span>
        <span v-else><Icon name="hourglass" /> Cargando...</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <div v-else-if="estadisticas" class="dashboard-content">
      <!-- Resumen General -->
      <div class="stats-cards">
        <div class="stat-card card-blue">
          <div class="stat-icon"><Icon name="book" size="2.5rem" color="#3b82f6" /></div>
          <div class="stat-content">
            <div class="stat-value">{{ estadisticas.resumen.total_capacitaciones }}</div>
            <div class="stat-label">Total Capacitaciones</div>
            <div class="stat-sub">{{ estadisticas.resumen.capacitaciones_activas }} activas</div>
          </div>
        </div>

        <div class="stat-card card-blue">
          <div class="stat-icon"><Icon name="users" size="2.5rem" color="#60a5fa" /></div>
          <div class="stat-content">
            <div class="stat-value">{{ estadisticas.resumen.total_usuarios_participantes }}</div>
            <div class="stat-label">Usuarios Participantes</div>
          </div>
        </div>

        <div class="stat-card card-purple">
          <div class="stat-icon"><Icon name="trophy" size="2.5rem" color="#a855f7" /></div>
          <div class="stat-content">
            <div class="stat-value">{{ estadisticas.resumen.total_certificados_emitidos }}</div>
            <div class="stat-label">Certificados Emitidos</div>
          </div>
        </div>

        <div class="stat-card card-yellow">
          <div class="stat-icon"><Icon name="analytics" size="2.5rem" color="#fbbf24" /></div>
          <div class="stat-content">
            <div class="stat-value">{{ estadisticas.resumen.tasa_aprobacion_global }}%</div>
            <div class="stat-label">Tasa de Aprobación</div>
            <div class="stat-sub">Promedio: {{ estadisticas.resumen.puntaje_promedio_global }}%</div>
          </div>
        </div>
      </div>

      <!-- Gráficos y Tablas -->
      <div class="dashboard-grid">
        <!-- Top Capacitaciones -->
        <div class="dashboard-panel">
          <h3><Icon name="star" color="#fbbf24" /> Top 5 Capacitaciones Más Populares</h3>
          <div v-if="topCapacitacionesChartData" class="chart-wrapper-small">
            <TopCapacitacionesChart 
              :chart-data="topCapacitacionesChartData"
              :height="280"
            />
          </div>
          <div v-else class="no-data-small">
            <p>No hay datos disponibles</p>
          </div>
        </div>

        <!-- Distribución de Puntajes -->
        <div class="dashboard-panel">
          <h3><Icon name="chart-pie" /> Distribución de Puntajes</h3>
          <div v-if="distribucionPuntajesChartData" class="chart-wrapper-small">
            <DistribucionPuntajesChart 
              :chart-data="distribucionPuntajesChartData"
              :height="280"
            />
          </div>
          <div v-else class="no-data-small">
            <p>No hay datos disponibles</p>
          </div>
        </div>

        <!-- Top Usuarios con Mejores Notas -->
        <div class="dashboard-panel full-width">
          <h3>🏆 Top 10 Colaboradores con Mejores Notas</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Colaborador</th>
                  <th>Promedio</th>
                  <th>Capacitaciones</th>
                  <th>Aprobadas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(usuario, index) in estadisticas.top_usuarios" :key="usuario.idusuario">
                  <td>
                    <span class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</span>
                  </td>
                  <td>{{ usuario.nombres }} {{ usuario.apellidos }}</td>
                  <td><span class="badge-score-large">{{ parseFloat(usuario.promedio_puntaje).toFixed(2) }}%</span></td>
                  <td><span class="badge-info">{{ usuario.total_capacitaciones }}</span></td>
                  <td><span class="badge-success">{{ usuario.total_certificados }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Estadísticas por Departamento -->
        <div class="dashboard-panel full-width">
          <h3><Icon name="building" /> Estadísticas por Departamento</h3>
          <div v-if="departamentosChartData" class="chart-wrapper-radar">
            <DepartamentosChart 
              :chart-data="departamentosChartData"
              :height="450"
            />
          </div>
          <div v-else class="no-data">
            <Icon name="alert" size="3rem" color="#94a3b8" />
            <p>No hay datos de departamentos disponibles</p>
          </div>
        </div>

        <!-- Actividad Reciente -->
        <div class="dashboard-panel full-width">
          <h3><Icon name="calendar" /> Actividad de los Últimos 7 Días</h3>
          
          <div v-if="actividadChartData" class="chart-wrapper">
            <ActividadChart 
              :chart-data="actividadChartData"
              :height="350"
            />
          </div>
          <div v-else class="no-data">
            <Icon name="alert" size="3rem" color="#94a3b8" />
            <p>No hay datos de actividad disponibles</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';
import ActividadChart from '../components/ActividadChart.vue';
import DistribucionPuntajesChart from '../components/DistribucionPuntajesChart.vue';
import TopCapacitacionesChart from '../components/TopCapacitacionesChart.vue';
import DepartamentosChart from '../components/DepartamentosChart.vue';

export default {
  name: 'Dashboard',
  components: {
    Icon,
    ActividadChart,
    DistribucionPuntajesChart,
    TopCapacitacionesChart,
    DepartamentosChart
  },
  data() {
    return {
      cargando: true,
      estadisticas: null
    };
  },
  computed: {
    maxIntentos() {
      if (!this.estadisticas || !this.estadisticas.actividad_reciente || this.estadisticas.actividad_reciente.length === 0) {
        return 1;
      }
      
      // Encontrar el valor máximo entre intentos, completados y aprobados
      const maxValues = this.estadisticas.actividad_reciente.map(d => {
        return Math.max(
          d.total_intentos || 0,
          d.completados || 0,
          d.aprobados || 0
        );
      });
      
      const max = Math.max(...maxValues);
      return max > 0 ? max : 1; // Si todos son 0, retornar 1 para evitar divisiones por 0
    },

    actividadChartData() {
      if (!this.estadisticas || !this.estadisticas.actividad_reciente) {
        return null;
      }

      const labels = this.estadisticas.actividad_reciente.map(dia => 
        this.formatearFecha(dia.fecha)
      );

      const intentos = this.estadisticas.actividad_reciente.map(dia => 
        dia.total_intentos || 0
      );

      const completados = this.estadisticas.actividad_reciente.map(dia => 
        dia.completados || 0
      );

      const aprobados = this.estadisticas.actividad_reciente.map(dia => 
        dia.aprobados || 0
      );

      return {
        labels: labels,
        datasets: [
          {
            label: 'Intentos',
            backgroundColor: 'rgba(96, 165, 250, 0.8)',
            borderColor: '#60a5fa',
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(96, 165, 250, 1)',
            data: intentos
          },
          {
            label: 'Completados',
            backgroundColor: 'rgba(52, 211, 153, 0.8)',
            borderColor: '#34d399',
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(52, 211, 153, 1)',
            data: completados
          },
          {
            label: 'Aprobados',
            backgroundColor: 'rgba(192, 132, 252, 0.8)',
            borderColor: '#c084fc',
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(192, 132, 252, 1)',
            data: aprobados
          }
        ]
      };
    },

    topCapacitacionesChartData() {
      if (!this.estadisticas || !this.estadisticas.top_capacitaciones || this.estadisticas.top_capacitaciones.length === 0) {
        return null;
      }

      const labels = this.estadisticas.top_capacitaciones.map(cap => {
        // Truncar tema si es muy largo
        return cap.tema.length > 30 ? cap.tema.substr(0, 30) + '...' : cap.tema;
      });

      const data = this.estadisticas.top_capacitaciones.map(cap => cap.intentos_count || 0);

      // Generar colores degradados de azul a morado
      const colors = [
        'rgba(139, 92, 246, 0.8)',   // Morado
        'rgba(96, 165, 250, 0.8)',   // Azul
        'rgba(52, 211, 153, 0.8)',   // Verde
        'rgba(251, 191, 36, 0.8)',   // Amarillo
        'rgba(251, 146, 60, 0.8)'    // Naranja
      ];

      return {
        labels: labels,
        datasets: [{
          label: 'Intentos',
          backgroundColor: colors.slice(0, data.length),
          borderColor: colors.slice(0, data.length).map(c => c.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colors.slice(0, data.length).map(c => c.replace('0.8', '1')),
          data: data
        }]
      };
    },

    distribucionPuntajesChartData() {
      if (!this.estadisticas || !this.estadisticas.distribucion_puntajes || this.estadisticas.distribucion_puntajes.length === 0) {
        return null;
      }

      const labels = this.estadisticas.distribucion_puntajes.map(rango => rango.rango + '%');
      const data = this.estadisticas.distribucion_puntajes.map(rango => rango.cantidad || 0);

      // Colores según el rango
      const colores = this.estadisticas.distribucion_puntajes.map(rango => {
        const rangoKey = rango.rango;
        const colorMap = {
          '90-100': 'rgba(16, 185, 129, 0.8)',   // Verde
          '80-89': 'rgba(96, 165, 250, 0.8)',    // Azul
          '70-79': 'rgba(251, 191, 36, 0.8)',    // Amarillo
          '60-69': 'rgba(251, 146, 60, 0.8)',    // Naranja
          '0-59': 'rgba(239, 68, 68, 0.8)'       // Rojo
        };
        return colorMap[rangoKey] || 'rgba(148, 163, 184, 0.8)';
      });

      return {
        labels: labels,
        datasets: [{
          label: 'Cantidad',
          backgroundColor: colores,
          borderColor: colores.map(c => c.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colores.map(c => c.replace('0.8', '1')),
          data: data
        }]
      };
    },

    departamentosChartData() {
      if (!this.estadisticas || !this.estadisticas.estadisticas_departamentos || this.estadisticas.estadisticas_departamentos.length === 0) {
        return null;
      }

      // Filtrar solo departamentos con actividad (al menos un valor > 0)
      const departamentosActivos = this.estadisticas.estadisticas_departamentos.filter(dept => {
        return dept.total_capacitaciones > 0 || 
               dept.total_usuarios_activos > 0 || 
               dept.total_intentos > 0 || 
               dept.total_aprobados > 0;
      });

      if (departamentosActivos.length === 0) {
        return null;
      }

      // En Radar Chart: labels son las métricas (ejes), datasets son los departamentos
      const labels = ['Capacitaciones', 'Usuarios Activos', 'Intentos', 'Aprobados'];

      // Colores variados para cada departamento
      const colores = [
        { bg: 'rgba(139, 92, 246, 0.3)', border: '#8b5cf6' },   // Morado
        { bg: 'rgba(96, 165, 250, 0.3)', border: '#60a5fa' },   // Azul
        { bg: 'rgba(52, 211, 153, 0.3)', border: '#34d399' },   // Verde
        { bg: 'rgba(251, 191, 36, 0.3)', border: '#fbbf24' },   // Amarillo
        { bg: 'rgba(251, 146, 60, 0.3)', border: '#fb923c' },   // Naranja
        { bg: 'rgba(239, 68, 68, 0.3)', border: '#ef4444' },    // Rojo
        { bg: 'rgba(168, 85, 247, 0.3)', border: '#a855f7' },   // Morado claro
        { bg: 'rgba(34, 211, 238, 0.3)', border: '#22d3ee' }    // Cyan
      ];

      // Crear un dataset por cada departamento
      const datasets = departamentosActivos.slice(0, 8).map((dept, index) => {
        const color = colores[index % colores.length];
        return {
          label: dept.tdp_nombre,
          backgroundColor: color.bg,
          borderColor: color.border,
          borderWidth: 2,
          pointBackgroundColor: color.border,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: color.border,
          pointRadius: 4,
          pointHoverRadius: 6,
          data: [
            dept.total_capacitaciones || 0,
            dept.total_usuarios_activos || 0,
            dept.total_intentos || 0,
            dept.total_aprobados || 0
          ]
        };
      });

      const chartData = {
        labels: labels,
        datasets: datasets
      };

      return chartData;
    }
  },
  mounted() {
    this.cargarEstadisticas();
  },
  methods: {
    async cargarEstadisticas() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/estadisticas`
        );
        
        if (response.data.success) {
          this.estadisticas = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar las estadísticas', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    calcularPorcentaje(cantidad) {
      if (!this.estadisticas || !this.estadisticas.distribucion_puntajes) return 0;
      const total = this.estadisticas.distribucion_puntajes.reduce((sum, r) => sum + r.cantidad, 0);
      return total > 0 ? (cantidad / total) * 100 : 0;
    },

    calcularTasaAprobacion(dept) {
      return dept.total_intentos > 0 
        ? Math.round((dept.total_aprobados / dept.total_intentos) * 100) 
        : 0;
    },

    getBarClass(rango) {
      const ranges = {
        '90-100': 'bar-excellent',
        '80-89': 'bar-good',
        '70-79': 'bar-average',
        '60-69': 'bar-below',
        '0-59': 'bar-fail'
      };
      return ranges[rango] || '';
    },

    getPercentageClass(percentage) {
      if (percentage >= 80) return 'high';
      if (percentage >= 60) return 'medium';
      return 'low';
    },

    formatearFecha(fecha) {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  }
};
</script>

<style scoped>
.dashboard-stats {
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
  overflow-x: hidden; /* Prevenir scroll horizontal en desktop */
  width: 100%;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h2 {
  font-size: 2rem;
  color: #1e293b;
}

.btn-refresh {
  background: #ffffff;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #475569;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.stat-icon {
  font-size: 3rem;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 4px;
}

.stat-sub {
  font-size: 0.85rem;
  color: #64748b;
}

.card-blue .stat-value { color: #60a5fa; }
.card-purple .stat-value { color: #a78bfa; }
.card-yellow .stat-value { color: #fbbf24; }

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-panel {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  overflow: hidden; /* Prevenir desbordamiento */
  box-sizing: border-box;
}

.dashboard-panel.full-width {
  grid-column: 1 / -1;
}

.dashboard-panel h3 {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

/* Tables */
.table-responsive {
  width: 100%;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px;
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

/* Badges */
.badge-count,
.badge-success,
.badge-info,
.badge-primary,
.badge-score,
.badge-score-large {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
}

.badge-count { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.badge-success { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.badge-info { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
.badge-primary { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.badge-score { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.badge-score-large { 
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(245, 158, 11, 0.25));
  color: #fbbf24;
  font-size: 1rem;
  font-weight: 700;
  padding: 6px 16px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.badge-percentage {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
}

.badge-percentage.high { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.badge-percentage.medium { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.badge-percentage.low { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
}

.rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; }
.rank-2 { background: linear-gradient(135deg, #C0C0C0, #A8A8A8); color: #000; }
.rank-3 { background: linear-gradient(135deg, #CD7F32, #B8860B); color: #fff; }

/* Chart Container */
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.bar-item:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.bar-label {
  min-width: 80px;
  font-weight: 600;
  color: #94a3b8;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 4px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.bar-fill {
  height: 32px;
  border-radius: 8px;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;
  padding: 0 8px;
  min-width: 40px;
  position: relative;
  overflow: hidden;
}

.bar-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 8px;
}

.bar-fill:hover {
  transform: scaleY(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.bar-excellent { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.bar-good { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.bar-average { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.bar-below { background: linear-gradient(90deg, #fb923c, #f97316); }
.bar-fail { background: linear-gradient(90deg, #ef4444, #dc2626); }

.bar-value {
  font-weight: 600;
  color: #ffffff;
  min-width: 30px;
  text-align: right;
  font-size: 0.95rem;
}

.chart-wrapper {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 350px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.chart-wrapper-small {
  padding: 15px;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 280px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.chart-wrapper-radar {
  padding: 30px 20px;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 450px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #475569;
  gap: 16px;
}

.no-data p {
  font-size: 1.1rem;
  margin: 0;
}

.no-data-small {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #475569;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-stats {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }

  .dashboard-header h2 {
    font-size: 1.5rem;
  }

  .btn-refresh {
    width: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Stats Cards - Scroll horizontal suave */
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 16px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
    /* Ocultar scrollbar pero mantener funcionalidad */
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
  }

  .stats-cards::-webkit-scrollbar {
    height: 4px;
  }

  .stats-cards::-webkit-scrollbar-track {
    background: transparent;
  }

  .stats-cards::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 4px;
  }

  .stats-cards::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }

  .stat-card {
    scroll-snap-align: start;
    min-width: 280px;
  }

  /* Dashboard Panels - Scroll horizontal suave */
  .dashboard-panel {
    padding: 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
  }

  .dashboard-panel::-webkit-scrollbar {
    height: 4px;
  }

  .dashboard-panel::-webkit-scrollbar-track {
    background: transparent;
    margin: 0 16px;
  }

  .dashboard-panel::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 4px;
  }

  .dashboard-panel::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }

  .dashboard-panel h3 {
    font-size: 1.1rem;
    white-space: nowrap;
  }

  /* Tablas - Mantener ancho con scroll */
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: -16px;
    padding: 16px;
  }

  .data-table {
    min-width: 600px; /* Mantener ancho mínimo */
  }

  .data-table th,
  .data-table td {
    padding: 8px;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  /* Gráficos - Scroll horizontal suave */
  .chart-wrapper,
  .chart-wrapper-small,
  .chart-wrapper-radar {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
  }

  .chart-wrapper::-webkit-scrollbar,
  .chart-wrapper-small::-webkit-scrollbar,
  .chart-wrapper-radar::-webkit-scrollbar {
    height: 4px;
  }

  .chart-wrapper::-webkit-scrollbar-track,
  .chart-wrapper-small::-webkit-scrollbar-track,
  .chart-wrapper-radar::-webkit-scrollbar-track {
    background: transparent;
  }

  .chart-wrapper::-webkit-scrollbar-thumb,
  .chart-wrapper-small::-webkit-scrollbar-thumb,
  .chart-wrapper-radar::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 4px;
  }

  /* Ajustar tamaños de gráficos */
  .chart-wrapper {
    min-width: 500px;
    padding: 12px;
  }

  .chart-wrapper-small {
    min-width: 400px;
    padding: 12px;
  }

  .chart-wrapper-radar {
    min-width: 450px;
    padding: 20px 12px;
  }

  /* Stat values más pequeños en móvil */
  .stat-value {
    font-size: 2rem;
  }

  .stat-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-stats {
    padding: 12px;
  }

  .dashboard-header h2 {
    font-size: 1.25rem;
  }

  .stat-card {
    min-width: 260px;
    padding: 16px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .dashboard-panel {
    padding: 12px;
  }

  .dashboard-panel h3 {
    font-size: 1rem;
    margin-bottom: 12px;
  }
}
</style>
