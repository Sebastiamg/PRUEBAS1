<template>
  <div class="ver-capacitacion">
    <div class="capacitacion-header">
      <button @click="$emit('volver')" class="btn-volver">
        ← Volver a Mis Capacitaciones
      </button>
    </div>

    <div v-if="cargando" class="loading-container">
      <p>⏳ Cargando capacitación...</p>
    </div>

    <div v-else-if="capacitacion" class="capacitacion-content">
      <!-- CABECERA -->
      <div class="info-header">
        <h1>{{ capacitacion.tema }}</h1>
        <span class="badge-disponible">✅ Disponible</span>
      </div>

      <p class="descripcion">{{ capacitacion.descripcion }}</p>

      <!-- PROGRESS BAR SI YA TIENE INTENTOS -->
      <div v-if="intentoActual" class="intento-actual-card">
        <div class="intento-header">
          <h3>📊 Tu Progreso</h3>
          <span class="intento-numero">Intento {{ intentoActual.numero_intento }} de {{ capacitacion.intentos_permitidos || '∞' }}</span>
        </div>

        <div v-if="intentoActual.estado === 'completado'" class="resultado-box" :class="intentoActual.aprobado ? 'aprobado' : 'reprobado'">
          <div class="resultado-icon">{{ intentoActual.aprobado ? '✅' : '❌' }}</div>
          <div class="resultado-info">
            <h4>{{ intentoActual.aprobado ? '¡Aprobado!' : 'No Aprobado' }}</h4>
            <p>Puntaje: {{ intentoActual.puntaje_obtenido }}% (Mínimo: {{ capacitacion.puntaje_minimo_aprobacion }}%)</p>
          </div>
        </div>

        <div v-else-if="intentoActual.estado === 'en_progreso'" class="progress-box">
          <p>⏱️ Tienes una evaluación en progreso. Puedes continuar donde lo dejaste.</p>
          <button @click="continuarEvaluacion" class="btn-continuar">
            ▶️ Continuar Evaluación
          </button>
        </div>
      </div>

      <!-- TABS: MATERIAL DE ESTUDIO | EVALUACIÓN -->
      <div class="tabs-container">
        <button 
          class="tab-btn" 
          :class="{ active: tabActual === 'material' }"
          @click="cambiarTab('material')"
        >
          📚 Material de Estudio
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: tabActual === 'evaluacion' }"
          @click="cambiarTab('evaluacion')"
        >
          📝 Evaluación
        </button>
      </div>

      <!-- TAB: MATERIAL DE ESTUDIO -->
      <div v-if="tabActual === 'material'" class="tab-content">
        <div class="recursos-lista">
          <div v-for="recurso in capacitacion.recursos" :key="recurso.id" class="recurso-card" :class="{ 'recurso-video': recurso.tipo_recurso === 'video' }">
            <div class="recurso-header">
              <div class="recurso-icon">
                {{ tipoRecursoIcon(recurso.tipo_recurso) }}
              </div>
              <div class="recurso-info">
                <h4>{{ recurso.nombre_recurso }}</h4>
                <p v-if="recurso.descripcion">{{ recurso.descripcion }}</p>
                <span class="recurso-tipo">{{ tipoRecursoLabel(recurso.tipo_recurso) }}</span>
              </div>
            </div>

            <!-- Reproductor de Video Embebido -->
            <div v-if="recurso.tipo_recurso === 'video'" class="recurso-contenido">
              <VideoPlayer :url="recurso.url_recurso" />
            </div>

            <!-- Enlace para PDFs y otros -->
            <div v-else class="recurso-accion">
              <a :href="recurso.url_recurso" target="_blank" class="btn-ver-recurso">
                <Icon name="external-link" /> Ver Recurso
              </a>
            </div>
          </div>

          <div v-if="!capacitacion.recursos || capacitacion.recursos.length === 0" class="empty-recursos">
            <Icon name="alert" size="3rem" color="#94a3b8" />
            <p>No hay material de apoyo disponible</p>
          </div>
        </div>
      </div>

      <!-- TAB: EVALUACIÓN -->
      <div v-if="tabActual === 'evaluacion'" class="tab-content">
        <div class="evaluacion-info">
          <div class="info-item">
            <span class="info-label">📝 Total de Preguntas:</span>
            <span class="info-value">{{ capacitacion.preguntas ? capacitacion.preguntas.length : 0 }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎯 Puntaje Mínimo:</span>
            <span class="info-value">{{ capacitacion.puntaje_minimo_aprobacion }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">🔄 Intentos Permitidos:</span>
            <span class="info-value">{{ capacitacion.intentos_permitidos || 'Ilimitados' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🔄 Intentos Restantes:</span>
            <span class="info-value">{{ intentosRestantes }}</span>
          </div>
        </div>

        <div v-if="intentoActual && intentoActual.estado === 'en_progreso'" class="intento-progreso">
          <div class="alert-info">
            ℹ️ Tienes una evaluación en progreso
          </div>
          <div class="progreso-info">
            <p>Progreso actual: <strong>{{ intentoActual.porcentaje_progreso }}%</strong></p>
            <div class="progreso-barra">
              <div class="progreso-fill" :style="`width: ${intentoActual.porcentaje_progreso}%`"></div>
            </div>
          </div>
          <button @click="continuarEvaluacion" class="btn-continuar-eval">
            ▶️ Continuar Evaluación
          </button>
        </div>

        <div v-else-if="puedeIniciarEvaluacion" class="accion-evaluacion">
          <button @click="iniciarEvaluacion" class="btn-iniciar" :disabled="iniciando">
            {{ iniciando ? '⏳ Iniciando...' : '🚀 Iniciar Evaluación' }}
          </button>
          <p class="nota-importante">
            ⚠️ <strong>Importante:</strong> Una vez iniciada, debes completar todas las preguntas. 
            Puedes salir y regresar mientras la capacitación esté vigente.
          </p>
        </div>

        <div v-else-if="!puedeIniciarEvaluacion && intentosRestantes === 0" class="sin-intentos">
          <p>😔 Has agotado todos los intentos disponibles para esta evaluación.</p>
          <p>Contacta al administrador si necesitas más oportunidades.</p>
        </div>

        <!-- HISTORIAL DE INTENTOS -->
        <div v-if="misIntentos.length > 0" class="historial-intentos">
          <h3>📊 Historial de Intentos</h3>
          <div class="intento-item" v-for="intento in misIntentos" :key="intento.id">
            <div class="intento-numero-badge">
              #{{ intento.numero_intento }}
            </div>
            <div class="intento-detalles">
              <div class="intento-estado" :class="intento.estado">
                {{ estadoLabel(intento.estado) }}
              </div>
              <div v-if="intento.estado === 'completado'" class="intento-resultado">
                <span :class="intento.aprobado ? 'aprobado' : 'reprobado'">
                  {{ intento.aprobado ? '✅ Aprobado' : '❌ Reprobado' }}
                </span>
                <span class="puntaje">{{ intento.puntaje_obtenido }}%</span>
              </div>
              <div class="intento-fecha">
                {{ formatearFecha(intento.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';
import VideoPlayer from '../components/VideoPlayer.vue';

export default {
  name: 'VerCapacitacion',
  components: {
    Icon,
    VideoPlayer
  },
  props: {
    capacitacionId: {
      type: Number,
      required: true
    },
    idusuario: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      cargando: true,
      iniciando: false,
      capacitacion: null,
      intentoActual: null,
      misIntentos: [],
      tabActual: 'material'
    };
  },
  computed: {
    intentosRestantes() {
      if (!this.capacitacion) return 0;
      if (this.capacitacion.intentos_permitidos === 0) return '∞';
      
      const usados = this.misIntentos.length;
      const restantes = this.capacitacion.intentos_permitidos - usados;
      return Math.max(0, restantes);
    },
    puedeIniciarEvaluacion() {
      if (!this.capacitacion) return false;
      
      // Si tiene intento en progreso, no puede iniciar uno nuevo
      if (this.intentoActual && this.intentoActual.estado === 'en_progreso') return false;
      
      // Si tiene intentos restantes
      return this.intentosRestantes === '∞' || this.intentosRestantes > 0;
    }
  },
  mounted() {
    this.cargarCapacitacion();
  },
  methods: {
    async cargarCapacitacion() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/capacitaciones/${this.capacitacionId}`,
          { params: { idusuario: this.idusuario } }
        );
        
        if (response.data.success) {
          const data = response.data.data;
          this.capacitacion = data.capacitacion;
          this.intentoActual = data.tiene_intento_en_progreso ? data.intento_en_progreso : null;
          
          // Cargar intentos
          await this.cargarIntentos();
        }
      } catch (error) {
        alert('Error al cargar la capacitación');
      } finally {
        this.cargando = false;
      }
    },

    async cargarIntentos() {
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/mis-intentos`,
          {
            params: {
              idusuario: this.idusuario,
              capacitacion_id: this.capacitacionId
            }
          }
        );
        
        if (response.data.success) {
          this.misIntentos = response.data.data;
        }
      } catch (error) {
      }
    },

    async iniciarEvaluacion() {
      this.iniciando = true;
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/usuario/capacitaciones/${this.capacitacionId}/iniciar-evaluacion`,
          { idusuario: this.idusuario }
        );
        
        if (response.data.success) {
          const intento = response.data.data.intento;
          this.$emit('iniciar-evaluacion', intento.id);
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al iniciar la evaluación';
        alert(mensaje);
      } finally {
        this.iniciando = false;
      }
    },

    continuarEvaluacion() {
      if (this.intentoActual) {
        this.$emit('iniciar-evaluacion', this.intentoActual.id);
      }
    },

    cambiarTab(tab) {
      this.tabActual = tab;
      // Scroll suave hacia arriba cuando se cambia de tab
      this.$nextTick(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    },

    tipoRecursoIcon(tipo) {
      const icons = {
        video: '🎥',
        pdf: '📄',
        documento: '📝',
        enlace: '🔗',
        imagen: '🖼️'
      };
      return icons[tipo] || '📎';
    },

    tipoRecursoLabel(tipo) {
      const labels = {
        video: 'Video',
        pdf: 'Documento PDF',
        documento: 'Documento',
        enlace: 'Enlace Web',
        imagen: 'Imagen'
      };
      return labels[tipo] || 'Recurso';
    },

    estadoLabel(estado) {
      const labels = {
        en_progreso: 'En Progreso',
        completado: 'Completado',
        abandonado: 'Abandonado',
        expirado: 'Expirado'
      };
      return labels[estado] || estado;
    },

    formatearFecha(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.ver-capacitacion {
  background-color: #0f172a;
  min-height: 100vh;
  padding: 24px;
  color: #f8fafc;
}

.capacitacion-header {
  margin-bottom: 24px;
}

.btn-volver {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-volver:hover {
  background: rgba(59, 130, 246, 0.2);
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 1.1rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.info-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #ffffff;
  flex: 1;
}

.badge-disponible {
  background-color: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.descripcion {
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.intento-actual-card {
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.intento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.intento-header h3 {
  margin: 0;
  color: #ffffff;
}

.intento-numero {
  color: #94a3b8;
  font-size: 0.9rem;
}

.resultado-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
}

.resultado-box.aprobado {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.resultado-box.reprobado {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.resultado-icon {
  font-size: 2.5rem;
}

.resultado-info h4 {
  margin: 0 0 4px 0;
  color: #ffffff;
}

.resultado-info p {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.progress-box {
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.progress-box p {
  margin: 0 0 12px 0;
  color: #cbd5e1;
}

.btn-continuar {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.tabs-container {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

.recursos-lista {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recurso-card {
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.recurso-card.recurso-video {
  padding: 0;
  overflow: hidden;
}

.recurso-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.recurso-card.recurso-video .recurso-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.recurso-contenido {
  padding: 0 20px 20px 20px;
}

.recurso-accion {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 20px 20px;
}

.recurso-card:not(.recurso-video) .recurso-header {
  padding-bottom: 0;
}

.empty-recursos {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-recursos p {
  margin-top: 12px;
  font-size: 1.1rem;
}

.recurso-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.recurso-info {
  flex: 1;
}

.recurso-info h4 {
  margin: 0 0 4px 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.recurso-info p {
  margin: 0 0 8px 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.recurso-tipo {
  display: inline-block;
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-ver-recurso {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-ver-recurso:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.evaluacion-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.info-item {
  background-color: rgba(30, 41, 59, 0.5);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
}

.info-value {
  color: #3b82f6;
  font-size: 1.5rem;
  font-weight: bold;
}

.accion-evaluacion {
  text-align: center;
  padding: 32px;
  background-color: rgba(30, 41, 59, 0.3);
  border-radius: 12px;
}

.intento-progreso {
  margin-top: 24px;
  padding: 20px;
  background-color: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
}

.alert-info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 600;
}

.progreso-info {
  margin-bottom: 16px;
}

.progreso-info p {
  margin: 0 0 8px 0;
  color: #94a3b8;
}

.progreso-barra {
  width: 100%;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  overflow: hidden;
}

.progreso-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s;
  border-radius: 6px;
}

.btn-continuar-eval {
  width: 100%;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-continuar-eval:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.accion-evaluacion {
  text-align: center;
  padding: 32px;
  background-color: rgba(30, 41, 59, 0.3);
  border-radius: 12px;
}

.btn-iniciar {
  background-color: #22c55e;
  color: white;
  border: none;
  padding: 16px 48px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.btn-iniciar:hover:not(:disabled) {
  background-color: #16a34a;
  transform: translateY(-2px);
}

.btn-iniciar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nota-importante {
  color: #f59e0b;
  font-size: 0.9rem;
  max-width: 500px;
  margin: 0 auto;
}

.sin-intentos {
  text-align: center;
  padding: 32px;
  color: #94a3b8;
}

.historial-intentos {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.historial-intentos h3 {
  margin: 0 0 16px 0;
  color: #ffffff;
}

.intento-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: rgba(30, 41, 59, 0.3);
  border-radius: 8px;
  margin-bottom: 12px;
}

.intento-numero-badge {
  background-color: #3b82f6;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.intento-detalles {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.intento-estado {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.intento-estado.completado {
  background-color: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.intento-estado.en_progreso {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.intento-resultado .aprobado {
  color: #4ade80;
  font-weight: 600;
}

.intento-resultado .reprobado {
  color: #f87171;
  font-weight: 600;
}

.intento-resultado .puntaje {
  margin-left: 12px;
  color: #3b82f6;
  font-weight: bold;
  font-size: 1.1rem;
}

.intento-fecha {
  color: #64748b;
  font-size: 0.85rem;
  margin-left: auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .info-header {
    flex-direction: column;
  }

  .info-header h1 {
    font-size: 1.5rem;
  }

  .evaluacion-info {
    grid-template-columns: 1fr;
  }

  .intento-detalles {
    flex-direction: column;
    align-items: flex-start;
  }

  .intento-fecha {
    margin-left: 0;
  }
}
</style>
