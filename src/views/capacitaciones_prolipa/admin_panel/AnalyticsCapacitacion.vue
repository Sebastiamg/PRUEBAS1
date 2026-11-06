<template>
  <div class="analytics-container">
    <!-- Header -->
    <div class="analytics-header">
      <button @click="$emit('volver')" class="btn-volver">
        <Icon name="arrow-left" /> Volver
      </button>
      <h2 v-if="capacitacion">Estadísticas: {{ capacitacion.tema }}</h2>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <!-- Contenido -->
    <div v-else-if="estadisticas" class="analytics-content">
      <!-- Métricas Generales -->
      <div class="metricas-grid">
        <div class="metrica-card">
          <div class="metrica-icono" style="background: rgba(59, 130, 246, 0.1)">
            <Icon name="users" size="2em" style="color: #3b82f6" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ estadisticas.estadisticas_generales.total_usuarios }}</span>
            <span class="metrica-label">Total Usuarios</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icono" style="background: rgba(59, 130, 246, 0.1)">
            <Icon name="check-circle" size="2em" style="color: #60a5fa" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ estadisticas.estadisticas_generales.usuarios_aprobados }}</span>
            <span class="metrica-label">Usuarios Aprobados</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icono" style="background: rgba(239, 68, 68, 0.1)">
            <Icon name="x-circle" size="2em" style="color: #ef4444" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ estadisticas.estadisticas_generales.usuarios_reprobados }}</span>
            <span class="metrica-label">Usuarios Reprobados</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icono" style="background: rgba(168, 85, 247, 0.1)">
            <Icon name="award" size="2em" style="color: #a855f7" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ estadisticas.estadisticas_generales.tasa_aprobacion }}%</span>
            <span class="metrica-label">Tasa de Aprobación</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icono" style="background: rgba(245, 158, 11, 0.1)">
            <Icon name="trending-up" size="2em" style="color: #f59e0b" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ estadisticas.estadisticas_generales.puntaje_promedio }}%</span>
            <span class="metrica-label">Puntaje Promedio</span>
          </div>
        </div>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="tabla-section">
        <h3>Detalle de Usuarios</h3>
        <div class="tabla-wrapper">
          <table class="tabla-usuarios">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Cédula</th>
                <th>N° Intento</th>
                <th>Puntaje</th>
                <th>Estado</th>
                <th>Certificado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(usuario, index) in estadisticas.detalle_usuarios" :key="index">
                <td>{{ usuario.nombres }} {{ usuario.apellidos }}</td>
                <td>{{ usuario.cedula }}</td>
                <td class="text-center">{{ usuario.numero_intento }}</td>
                <td class="text-center">
                  <span class="badge-puntaje" :class="usuario.aprobado ? 'aprobado' : 'reprobado'">
                    {{ usuario.puntaje_obtenido }}%
                  </span>
                </td>
                <td class="text-center">
                  <span class="badge-estado" :class="usuario.aprobado ? 'badge-success' : 'badge-error'">
                    {{ usuario.aprobado ? 'Aprobado' : 'Reprobado' }}
                  </span>
                </td>
                <td class="text-center">
                  <span v-if="usuario.certificado_codigo" class="certificado-codigo">
                    {{ usuario.certificado_codigo }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>{{ formatearFecha(usuario.tiempo_fin) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estadísticas por Pregunta -->
      <div class="preguntas-section" v-if="estadisticas.estadisticas_preguntas && estadisticas.estadisticas_preguntas.length > 0">
        <h3>Estadísticas por Pregunta</h3>
        <div class="preguntas-grid">
          <div v-for="(pregunta, index) in estadisticas.estadisticas_preguntas" :key="index" class="pregunta-card">
            <div class="pregunta-header">
              <span class="pregunta-numero">Pregunta {{ index + 1 }}</span>
              <span class="pregunta-tipo badge-tipo">{{ formatearTipo(pregunta.tipo) }}</span>
            </div>
            <p class="pregunta-texto">{{ pregunta.enunciado }}</p>
            
            <div class="pregunta-stats">
              <div class="stat-item">
                <span class="stat-label">Respondidas:</span>
                <span class="stat-valor">{{ pregunta.estadisticas.total_respuestas }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Correctas:</span>
                <span class="stat-valor success">{{ pregunta.estadisticas.respuestas_correctas }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Incorrectas:</span>
                <span class="stat-valor error">{{ pregunta.estadisticas.respuestas_incorrectas }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">% Acierto:</span>
                <span class="stat-valor highlight">{{ pregunta.estadisticas.porcentaje_acierto }}%</span>
              </div>
            </div>

            <div class="pregunta-barra">
              <div 
                class="barra-progreso" 
                :style="`width: ${pregunta.estadisticas.porcentaje_acierto}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="error-container">
      <Icon name="alert-circle" size="3em" style="color: #ef4444" />
      <p>Error al cargar las estadísticas</p>
      <button @click="cargarEstadisticas" class="btn-reintentar">Reintentar</button>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'AnalyticsCapacitacion',
  components: {
    Icon
  },
  props: {
    capacitacionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      estadisticas: null,
      capacitacion: null
    };
  },
  mounted() {
    this.cargarEstadisticas();
  },
  methods: {
    async cargarEstadisticas() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}/analytics`
        );

        if (response.data.success) {
          this.estadisticas = response.data.data;
          this.capacitacion = response.data.data.capacitacion;
        } else {
          this.$emit('show-toast', { mensaje: 'Error al cargar estadísticas', tipo: 'error' });
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar estadísticas', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return '—';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatearTipo(tipo) {
      const tipos = {
        'simple': 'Opción Única',
        'multiple': 'Opción Múltiple',
        'vf': 'Verdadero/Falso'
      };
      return tipos[tipo] || tipo;
    }
  }
};
</script>

<style scoped>
.analytics-container {
  width: 100%;
  padding: 20px;
}

.analytics-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-volver:hover {
  background-color: #f8fafc;
  color: #1e293b;
  border-color: #cbd5e1;
}

.analytics-header h2 {
  color: #3b82f6;
  margin: 0;
  font-size: 1.5rem;
}

/* Loading */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #475569;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-reintentar {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reintentar:hover {
  background-color: #2563eb;
}

/* Métricas Grid */
.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.metrica-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.metrica-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metrica-icono {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metrica-info {
  display: flex;
  flex-direction: column;
}

.metrica-valor {
  font-size: 2rem;
  font-weight: 700;
  color: #60a5fa;
  line-height: 1;
  margin-bottom: 4px;
}

.metrica-label {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* Tabla Section */
.tabla-section {
  margin-bottom: 40px;
}

.tabla-section h3 {
  color: #60a5fa;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.tabla-wrapper {
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tabla-usuarios {
  width: 100%;
  border-collapse: collapse;
}

.tabla-usuarios thead {
  background-color: #f8fafc;
}

.tabla-usuarios th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.tabla-usuarios td {
  padding: 12px;
  border-top: 1px solid #f1f5f9;
  color: #1e293b;
  font-size: 0.9rem;
}

.tabla-usuarios tbody tr:hover {
  background-color: #f8fafc;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #64748b;
}

.badge-puntaje {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
}

.badge-puntaje.aprobado {
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.badge-puntaje.reprobado {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.badge-estado {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
}

.badge-success {
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.badge-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.certificado-codigo {
  font-family: monospace;
  font-size: 0.85rem;
  color: #a855f7;
}

/* Preguntas Section */
.preguntas-section {
  margin-top: 40px;
}

.preguntas-section h3 {
  color: #60a5fa;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.preguntas-grid {
  display: grid;
  gap: 20px;
}

.pregunta-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.pregunta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pregunta-numero {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.9rem;
}

.badge-tipo {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  background-color: rgba(168, 85, 247, 0.1);
  color: #7c3aed;
  font-weight: 600;
}

.pregunta-texto {
  color: #475569;
  margin-bottom: 16px;
  line-height: 1.5;
}

.pregunta-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #475569;
}

.stat-valor {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-valor.success {
  color: #60a5fa;
}

.stat-valor.error {
  color: #ef4444;
}

.stat-valor.highlight {
  color: #f59e0b;
}

.pregunta-barra {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.barra-progreso {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s;
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-container {
    padding: 16px;
  }

  .metricas-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .metrica-card {
    padding: 16px;
  }

  .metrica-valor {
    font-size: 1.5rem;
  }

  .tabla-wrapper {
    overflow-x: scroll;
  }

  .tabla-usuarios {
    min-width: 800px;
  }
}
</style>
