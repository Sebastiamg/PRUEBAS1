<template>
  <div class="user-capacitaciones">
    <div class="header-section">
      <div>
        <h2><Icon name="book" /> Mis Capacitaciones</h2>
        <p>Capacitaciones disponibles para ti</p>
      </div>
    </div>

    <!-- Tabs de filtros -->
    <div class="filter-tabs">
      <button 
        :class="['filter-tab', { active: filtroActivo === 'disponibles' }]"
        @click="filtroActivo = 'disponibles'"
      >
        <Icon name="rocket" size="1.2em" />
        Disponibles
        <span class="badge">{{ contadores.disponibles }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'en_progreso' }]"
        @click="filtroActivo = 'en_progreso'"
      >
        <Icon name="hourglass" size="1.2em" />
        En Progreso
        <span class="badge">{{ contadores.en_progreso }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'completadas' }]"
        @click="filtroActivo = 'completadas'"
      >
        <Icon name="check-circle" size="1.2em" />
        Completadas
        <span class="badge">{{ contadores.completadas }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'todas' }]"
        @click="filtroActivo = 'todas'"
      >
        <Icon name="list" size="1.2em" />
        Todas
        <span class="badge">{{ contadores.todas }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando capacitaciones...</p>
    </div>

    <!-- Lista de capacitaciones -->
    <div v-else class="capacitaciones-list">
      <div
        v-for="cap in capacitacionesFiltradas"
        :key="cap.id"
        class="capacitacion-item"
        :class="{ 'ya-aprobado': cap.ya_aprobo }"
      >
        <div class="cap-contenido">
          <!-- Izquierda: Info -->
          <div class="cap-info">
            <div class="cap-header">
              <h3>{{ cap.tema }}</h3>
              <span v-if="cap.ya_aprobo" class="badge-aprobado">
                <Icon name="check-circle" color="#10b981" /> Aprobado
              </span>
              <span v-else-if="cap.tiene_intento_en_progreso" class="badge-en-progreso">
                <Icon name="hourglass" color="#fb923c" /> En progreso
              </span>
            </div>

            <p class="cap-descripcion">{{ cap.descripcion }}</p>

            <!-- Métricas rápidas -->
            <div class="cap-metricas">
              <span class="metrica-item">
                <Icon name="book" size="1.1em" />
                {{ cap.recursos_count }} recursos
              </span>
              <span class="metrica-item">
                <Icon name="question" size="1.1em" />
                {{ cap.preguntas_count }} preguntas
              </span>
              <span class="metrica-item" v-if="cap.duracion_estimada">
                <Icon name="clock" size="1.1em" />
                {{ cap.duracion_estimada }} {{ cap.duracion_estimada == 1 ? 'hora' : 'horas' }}
              </span>
              <span class="metrica-item">
                <Icon name="target" size="1.1em" />
                Mínimo: {{ cap.puntaje_minimo_aprobacion }}%
              </span>
            </div>

            <!-- Progreso si hay intento en curso -->
            <div v-if="cap.tiene_intento_en_progreso" class="progreso-container">
              <div class="progreso-label">
                Progreso: {{ cap.intento_en_progreso.porcentaje_progreso }}%
              </div>
              <div class="progreso-barra">
                <div 
                  class="progreso-fill" 
                  :style="`width: ${cap.intento_en_progreso.porcentaje_progreso}%`"
                ></div>
              </div>
            </div>

            <!-- Información de intentos -->
            <div class="cap-intentos">
              <span v-if="cap.intentos_permitidos > 0">
                Intentos restantes: <strong>{{ cap.intentos_restantes }}</strong> de {{ cap.intentos_permitidos }}
              </span>
              <span v-else>
                Intentos ilimitados
              </span>
              
              <span v-if="cap.mejor_puntaje" class="mejor-puntaje">
                Mejor puntaje: <strong>{{ cap.mejor_puntaje }}%</strong>
              </span>
            </div>

            <!-- Vigencia y estado de disponibilidad -->
            <div class="cap-disponibilidad">
              <div v-if="cap.fecha_inicio" class="fecha-info">
                <Icon name="clock" size="1rem" />
                Inicio: {{ formatearFechaConHora(cap.fecha_inicio) }}
              </div>
              <div v-if="cap.fecha_fin" class="fecha-info fecha-fin">
                <Icon name="calendar" size="1rem" color="#f59e0b" />
                Fin: {{ formatearFechaConHora(cap.fecha_fin) }}
              </div>
              
              <!-- Mensaje de no disponible aún -->
              <div v-if="!estaDisponible(cap)" class="alerta-no-disponible">
                <Icon name="hourglass" /> Esta capacitación aún no está disponible. Inicia el {{ formatearFechaConHora(cap.fecha_inicio) }}
              </div>
              
              <!-- Mensaje de expirada -->
              <div v-if="estaExpirada(cap)" class="alerta-expirada">
                <Icon name="error" /> Esta capacitación ha finalizado
              </div>
            </div>
          </div>

          <!-- Derecha: Acciones -->
          <div class="cap-acciones">
            <button 
              v-if="cap.ya_aprobo"
              @click="verCertificado(cap.id)"
              class="btn-accion btn-certificado"
            >
              <Icon name="certificate" /> Ver Certificado
            </button>

            <button 
              v-else-if="cap.tiene_intento_en_progreso && estaDisponible(cap) && !estaExpirada(cap)"
              @click="continuarEvaluacion(cap)"
              class="btn-accion btn-continuar"
            >
              <Icon name="play" /> Continuar Evaluación
            </button>

            <button 
              v-else-if="cap.puede_realizar_intento && estaDisponible(cap) && !estaExpirada(cap)"
              @click="verDetalles(cap)"
              class="btn-accion btn-iniciar"
            >
              <Icon name="rocket" /> Ver Detalles
            </button>

            <button 
              v-else-if="!estaDisponible(cap)"
              disabled
              class="btn-accion btn-disabled"
            >
              <Icon name="hourglass" /> Aún No Disponible
            </button>

            <button 
              v-else-if="estaExpirada(cap)"
              disabled
              class="btn-accion btn-disabled"
            >
              <Icon name="error" /> Finalizada
            </button>

            <button 
              v-else
              disabled
              class="btn-accion btn-disabled"
            >
              <Icon name="cancel" /> Sin Intentos
            </button>

            <button 
              @click="verResultados(cap.id)"
              class="btn-secundario"
              v-if="cap.mejor_puntaje"
            >
              <Icon name="chart" /> Ver Resultados
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="capacitacionesFiltradas.length === 0" class="empty-state">
        <div class="empty-icon"><Icon name="book" size="5rem" /></div>
        <h3>{{ tituloVacio }}</h3>
        <p>{{ mensajeVacio }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'UserListaCapacitaciones',
  components: {
    Icon
  },
  props: {
    idusuario: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      capacitaciones: [],
      cargando: true,
      filtroActivo: 'disponibles'
    };
  },
  computed: {
    capacitacionesFiltradas() {
      if (this.filtroActivo === 'todas') {
        return this.capacitaciones;
      }

      return this.capacitaciones.filter(cap => {
        switch (this.filtroActivo) {
          case 'disponibles':
            // Disponibles: no aprobadas, sin intento en progreso
            return !cap.ya_aprobo && !cap.tiene_intento_en_progreso;
          
          case 'en_progreso':
            // En progreso: tienen un intento en progreso
            return cap.tiene_intento_en_progreso;
          
          case 'completadas':
            // Completadas: ya aprobaron
            return cap.ya_aprobo;
          
          default:
            return true;
        }
      });
    },

    contadores() {
      const disponibles = this.capacitaciones.filter(cap => 
        !cap.ya_aprobo && !cap.tiene_intento_en_progreso
      ).length;

      const en_progreso = this.capacitaciones.filter(cap => 
        cap.tiene_intento_en_progreso
      ).length;

      const completadas = this.capacitaciones.filter(cap => 
        cap.ya_aprobo
      ).length;

      return {
        disponibles,
        en_progreso,
        completadas,
        todas: this.capacitaciones.length
      };
    },

    tituloVacio() {
      switch (this.filtroActivo) {
        case 'disponibles':
          return 'No hay capacitaciones disponibles';
        case 'en_progreso':
          return 'No tienes capacitaciones en progreso';
        case 'completadas':
          return 'No has completado capacitaciones';
        case 'todas':
          return 'No hay capacitaciones';
        default:
          return 'No hay capacitaciones';
      }
    },

    mensajeVacio() {
      switch (this.filtroActivo) {
        case 'disponibles':
          return 'No hay nuevas capacitaciones para iniciar en este momento';
        case 'en_progreso':
          return 'No tienes capacitaciones iniciadas pendientes de completar';
        case 'completadas':
          return 'Aún no has completado ninguna capacitación';
        case 'todas':
          return 'No tienes capacitaciones asignadas';
        default:
          return '';
      }
    }
  },
  mounted() {
    this.cargarCapacitaciones();
  },
  methods: {
    async cargarCapacitaciones() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/capacitaciones`,
          { params: { idusuario: this.idusuario } }
        );

        if (response.data.success) {
          this.capacitaciones = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { 
          mensaje: 'Error al cargar capacitaciones', 
          tipo: 'error' 
        });
      } finally {
        this.cargando = false;
      }
    },

    verDetalles(capacitacion) {
      this.$emit('ver-detalles', capacitacion);
    },

    continuarEvaluacion(capacitacion) {
      this.$emit('continuar-evaluacion', capacitacion);
    },

    verResultados(capacitacionId) {
      // Necesitamos obtener el último intento completado de esta capacitación
      this.$emit('ver-resultados', capacitacionId);
    },

    verCertificado(capacitacionId) {
      this.$emit('ver-certificado', capacitacionId);
    },

    formatearFecha(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },

    formatearFechaConHora(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    estaDisponible(capacitacion) {
      if (!capacitacion.fecha_inicio) return true;
      const ahora = new Date();
      const fechaInicio = new Date(capacitacion.fecha_inicio);
      return ahora >= fechaInicio;
    },

    estaExpirada(capacitacion) {
      if (!capacitacion.fecha_fin) return false;
      const ahora = new Date();
      const fechaFin = new Date(capacitacion.fecha_fin);
      
      return ahora > fechaFin;
    }
  }
};
</script>

<style scoped>
.user-capacitaciones {
  width: 100%;
}

.header-section {
  margin-bottom: 24px;
}

.header-section h2 {
  margin: 0 0 4px 0;
  font-size: 1.8rem;
  color: #60a5fa;
}

.header-section p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #94a3b8;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.filter-tab.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-tab .badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.filter-tab.active .badge {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Lista */
.capacitaciones-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.capacitacion-item {
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.capacitacion-item:hover {
  border-color: #3b82f6;
  transform: translateX(4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.capacitacion-item.ya-aprobado {
  border-left: 4px solid #10b981;
}

.cap-contenido {
  display: flex;
  padding: 20px;
  gap: 24px;
}

.cap-info {
  flex: 1;
}

.cap-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.cap-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #60a5fa;
}

.badge-aprobado,
.badge-en-progreso {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-aprobado {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-en-progreso {
  background-color: rgba(251, 146, 60, 0.1);
  color: #fb923c;
}

.cap-descripcion {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 16px;
}

.cap-metricas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.metrica-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.metrica-item .icono {
  font-size: 1.1rem;
}

.progreso-container {
  margin-bottom: 16px;
}

.progreso-label {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 6px;
  font-weight: 600;
}

.progreso-barra {
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  overflow: hidden;
}

.progreso-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s;
  border-radius: 5px;
}

.cap-intentos {
  display: flex;
  gap: 24px;
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 8px;
}

.mejor-puntaje {
  color: #10b981;
}

.cap-vigencia {
  font-size: 0.85rem;
  color: #f59e0b;
  padding: 8px 12px;
  background-color: rgba(251, 146, 60, 0.05);
  border-radius: 6px;
  display: inline-block;
}

/* Disponibilidad y fechas */
.cap-disponibilidad {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fecha-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
  padding: 6px 10px;
  background-color: rgba(148, 163, 184, 0.05);
  border-radius: 6px;
}

.fecha-info .icono {
  font-size: 1rem;
}

.fecha-fin {
  color: #f59e0b;
  background-color: rgba(251, 146, 60, 0.05);
}

.alerta-no-disponible {
  font-size: 0.85rem;
  color: #fb923c;
  padding: 10px 14px;
  background-color: rgba(251, 146, 60, 0.1);
  border-left: 3px solid #fb923c;
  border-radius: 6px;
  font-weight: 600;
}

.alerta-expirada {
  font-size: 0.85rem;
  color: #ef4444;
  padding: 10px 14px;
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  border-radius: 6px;
  font-weight: 600;
}

/* Acciones */
.cap-acciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-width: 200px;
}

.btn-accion,
.btn-secundario {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-iniciar {
  background-color: #3b82f6;
  color: white;
}

.btn-iniciar:hover {
  background-color: #2563eb;
}

.btn-continuar {
  background-color: #10b981;
  color: white;
}

.btn-continuar:hover {
  background-color: #059669;
}

.btn-certificado {
  background-color: #f59e0b;
  color: white;
}

.btn-certificado:hover {
  background-color: #d97706;
}

.btn-disabled {
  background-color: rgba(148, 163, 184, 0.1);
  color: #64748b;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secundario {
  background-color: transparent;
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.btn-secundario:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #60a5fa;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #94a3b8;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #64748b;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .cap-contenido {
    flex-direction: column;
  }

  .cap-acciones {
    min-width: auto;
    width: 100%;
  }

  .cap-metricas {
    flex-direction: column;
    gap: 8px;
  }

  .cap-intentos {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
