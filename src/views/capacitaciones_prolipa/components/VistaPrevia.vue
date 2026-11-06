<template>
  <div class="vista-previa" ref="modalContainer" v-scroll-top>
    <div class="modal-inner">
      <div class="preview-header">
        <h2><Icon name="eye" /> Vista Previa de la Capacitación</h2>
        <button @click="cerrarModal" class="btn-cerrar">
          <Icon name="close" /> Cerrar
        </button>
      </div>

    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Cargando vista previa...</p>
    </div>

    <div v-else-if="capacitacion" class="preview-content">
      <!-- Información General -->
      <div class="preview-section">
        <div class="section-header">
          <h3>📋 Información General</h3>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Tema:</span>
            <span class="info-value">{{ capacitacion.tema }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Estado:</span>
            <span class="badge-estado" :class="'badge-' + capacitacion.estado">
              {{ capacitacion.estado }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Puntaje Mínimo:</span>
            <span class="info-value">{{ capacitacion.puntaje_minimo_aprobacion }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">Intentos Permitidos:</span>
            <span class="info-value">{{ capacitacion.intentos_permitidos || 'Ilimitados' }}</span>
          </div>
        </div>
        <p class="descripcion">{{ capacitacion.descripcion }}</p>
      </div>

      <!-- Navegación por Tabs -->
      <div class="tabs-navigation">
        <button 
          @click="cambiarTab('material')" 
          class="tab-btn"
          :class="{ active: tabActual === 'material' }"
        >
          <Icon name="book" /> Material de Apoyo
          <span class="tab-count">({{ capacitacion.recursos ? capacitacion.recursos.length : 0 }})</span>
        </button>
        <button 
          @click="cambiarTab('evaluacion')" 
          class="tab-btn"
          :class="{ active: tabActual === 'evaluacion' }"
        >
          <Icon name="question" /> Evaluación
          <span class="tab-count">({{ capacitacion.preguntas ? capacitacion.preguntas.length : 0 }})</span>
        </button>
      </div>

      <!-- TAB: Material de Apoyo -->
      <div v-if="tabActual === 'material'" class="tab-content animate-fade-in">
        <div class="preview-section">
          <h3><Icon name="book" /> Material de Apoyo</h3>
          
          <div v-if="capacitacion.recursos && capacitacion.recursos.length > 0" class="recursos-lista">
            <div v-for="(recurso, index) in capacitacion.recursos" :key="recurso.id || index" class="recurso-preview" :class="{ 'recurso-video': recurso.tipo_recurso === 'video' }">
              <div class="recurso-header">
                <div class="recurso-numero">#{{ index + 1 }}</div>
                <div class="recurso-info">
                  <h4>{{ recurso.nombre_recurso }}</h4>
                  <span class="recurso-tipo">{{ tipoRecursoLabel(recurso.tipo_recurso) }}</span>
                  <p v-if="recurso.descripcion" class="recurso-desc">{{ recurso.descripcion }}</p>
                </div>
              </div>

              <!-- Reproductor de Video -->
              <div v-if="recurso.tipo_recurso === 'video'" class="recurso-contenido">
                <VideoPlayer :url="recurso.url_recurso" />
              </div>

              <!-- Enlace para otros recursos -->
              <div v-else class="recurso-link">
                <a :href="recurso.url_recurso" target="_blank" class="btn-ver">
                  <Icon name="external-link" /> Ver Recurso
                </a>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <Icon name="alert" size="3rem" color="#94a3b8" />
            <p>No hay material de apoyo configurado</p>
          </div>
        </div>
      </div>

      <!-- TAB: Evaluación -->
      <div v-if="tabActual === 'evaluacion'" class="tab-content animate-fade-in">
        <div class="preview-section">
          <h3><Icon name="question" /> Banco de Preguntas</h3>
          
          <div v-if="capacitacion.preguntas && capacitacion.preguntas.length > 0" class="preguntas-lista">
            <div v-for="(pregunta, pIndex) in capacitacion.preguntas" :key="pregunta.id || pIndex" class="pregunta-preview">
              <div class="pregunta-header">
                <span class="pregunta-numero">Pregunta {{ pIndex + 1 }}</span>
                <span class="pregunta-tipo" :class="'tipo-' + pregunta.tipo_pregunta">
                  {{ tipoPreguntaLabel(pregunta.tipo_pregunta) }}
                </span>
              </div>
              
              <div class="pregunta-enunciado">
                <p>{{ pregunta.enunciado }}</p>
                
                <!-- Imagen de apoyo si existe -->
                <div v-if="pregunta.imagen_url" class="pregunta-imagen">
                  <img :src="pregunta.imagen_url" alt="Imagen de apoyo" @error="imagenError($event, pIndex)" />
                </div>
              </div>

              <div class="pregunta-opciones">
                <div v-for="(opcion, oIndex) in pregunta.opciones" :key="opcion.id || oIndex" class="opcion-item" :class="{ correcta: opcion.es_correcta }">
                  <div class="opcion-indicador">
                    <Icon v-if="pregunta.tipo_pregunta === 'multiple'" :name="opcion.es_correcta ? 'check-square' : 'square'" />
                    <Icon v-else :name="opcion.es_correcta ? 'check-circle' : 'circle'" />
                  </div>
                  <span class="opcion-texto">{{ opcion.texto_opcion }}</span>
                  <span v-if="opcion.es_correcta" class="badge-correcta">
                    <Icon name="check" /> Correcta
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <Icon name="alert" size="3rem" color="#94a3b8" />
            <p>No hay preguntas configuradas para la evaluación</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Icon from './Icon.vue';
import VideoPlayer from './VideoPlayer.vue';

export default {
  name: 'VistaPrevia',
  components: {
    Icon,
    VideoPlayer
  },
  directives: {
    scrollTop: {
      inserted(el) {
        // Forzar scroll apenas se inserta el elemento
        el.scrollTop = 0;
        el.scrollTo(0, 0);
      }
    }
  },
  props: {
    capacitacionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cargando: true,
      capacitacion: null,
      tabActual: 'material'
    };
  },
  mounted() {
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    
    // Forzar scroll a 0 en el siguiente frame de animación
    requestAnimationFrame(() => {
      if (this.$refs.modalContainer) {
        this.$refs.modalContainer.scrollTop = 0;
      }
    });
    
    // Cargar datos
    this.cargarCapacitacion();
  },
  beforeDestroy() {
    // Restaurar scroll del body al cerrar
    document.body.style.overflow = '';
  },
  methods: {
    async cargarCapacitacion() {
      this.cargando = true;
      
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}`
        );
        
        if (response.data.success) {
          this.capacitacion = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar la vista previa', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    tipoRecursoLabel(tipo) {
      const labels = {
        video: '🎥 Video',
        pdf: '📄 PDF',
        documento: '📝 Documento',
        enlace: '🔗 Enlace',
        imagen: '🖼️ Imagen'
      };
      return labels[tipo] || '📎 Recurso';
    },

    tipoPreguntaLabel(tipo) {
      const labels = {
        simple: 'Selección Simple',
        multiple: 'Selección Múltiple',
        vf: 'Verdadero/Falso'
      };
      return labels[tipo] || tipo;
    },

    imagenError(event, pIndex) {
      event.target.style.display = 'none';
    },

    cambiarTab(tab) {
      this.tabActual = tab;
      // Scroll suave hacia arriba del modal cuando se cambia de tab
      this.$nextTick(() => {
        if (this.$refs.modalContainer) {
          this.$refs.modalContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    },

    cerrarModal() {
      this.$emit('cerrar');
    }
  }
};
</script>

<style scoped>
.vista-previa {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(11, 15, 25, 0.95);
  z-index: 10000;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  display: block;
}

.modal-inner {
  width: 100%;
  max-width: 1400px;
  padding: 24px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.preview-header h2 {
  color: #60a5fa;
  margin: 0;
  font-size: 1.75rem;
}

.btn-cerrar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cerrar:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preview-content {
  /* Eliminado max-width ya que está en modal-inner */
}

.preview-section {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header h3 {
  color: #ffffff;
  margin: 0 0 16px 0;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

.info-value {
  font-size: 1.1rem;
  color: #60a5fa;
  font-weight: 600;
}

.badge-estado {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
  width: fit-content;
}

.badge-activa {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.badge-inactiva {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.badge-borrador {
  background-color: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.descripcion {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.6;
  margin: 16px 0 0 0;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Tabs */
.tabs-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #ffffff;
}

.tab-btn.active {
  color: #60a5fa;
  border-bottom-color: #3b82f6;
}

.tab-count {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

/* Recursos */
.recursos-lista {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: visible;
}

.recurso-preview {
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.recurso-preview.recurso-video {
  padding-bottom: 0;
}

.recurso-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
}

.recurso-numero {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.recurso-info {
  flex: 1;
}

.recurso-info h4 {
  margin: 0 0 8px 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.recurso-tipo {
  display: inline-block;
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.recurso-desc {
  color: #94a3b8;
  margin: 8px 0 0 0;
  font-size: 0.9rem;
}

.recurso-contenido {
  padding: 0 20px 20px 20px;
}

.recurso-link {
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-ver {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-ver:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

/* Preguntas */
.preguntas-lista {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: visible;
}

.pregunta-preview {
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #3b82f6;
}

.pregunta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pregunta-numero {
  font-weight: 700;
  color: #60a5fa;
  font-size: 1rem;
}

.pregunta-tipo {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pregunta-tipo.tipo-simple {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.pregunta-tipo.tipo-multiple {
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
}

.pregunta-tipo.tipo-vf {
  background-color: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.pregunta-enunciado {
  margin-bottom: 16px;
}

.pregunta-enunciado p {
  color: #ffffff;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.pregunta-imagen {
  margin-top: 12px;
  padding: 12px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  text-align: center;
}

.pregunta-imagen img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  object-fit: contain;
}

.pregunta-opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opcion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: rgba(15, 23, 42, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;
}

.opcion-item.correcta {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.opcion-indicador {
  color: #94a3b8;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.opcion-item.correcta .opcion-indicador {
  color: #60a5fa;
}

.opcion-texto {
  flex: 1;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.opcion-item.correcta .opcion-texto {
  color: #ffffff;
  font-weight: 600;
}

.badge-correcta {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state p {
  margin-top: 12px;
  font-size: 1.1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .vista-previa {
    padding: 16px;
  }

  .preview-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .tabs-navigation {
    overflow-x: auto;
  }
}
</style>
