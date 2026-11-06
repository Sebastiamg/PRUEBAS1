<template>
  <div class="resultados-evaluacion">
    <!-- Header -->
    <div class="resultados-header">
      <button @click="volver" class="btn-volver">
        <Icon name="arrow-left" /> Volver
      </button>
      <h2><Icon name="chart" /> Resultados de Evaluación</h2>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando resultados...</p>
    </div>

    <!-- Resultados -->
    <div v-else-if="intento" class="resultados-content">
      <!-- Card de resultado general -->
      <div class="resultado-general" :class="intento.aprobado ? 'aprobado' : 'reprobado'">
        <div class="resultado-icon">
          <Icon :name="intento.aprobado ? 'check-circle' : 'close'" :size="'4rem'" :color="intento.aprobado ? '#10b981' : '#ef4444'" />
        </div>
        <h3 class="resultado-titulo">
          {{ intento.aprobado ? '¡Felicitaciones! Has Aprobado' : 'No Aprobaste Esta Vez' }}
        </h3>
        <div class="resultado-puntaje">
          <span class="puntaje-valor">{{ intento.puntaje_obtenido }}%</span>
          <span class="puntaje-label">Puntaje Obtenido</span>
        </div>
        <div class="resultado-minimo">
          Puntaje mínimo requerido: <strong>{{ capacitacion.puntaje_minimo_aprobacion }}%</strong>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><Icon name="list" size="2rem" /></div>
          <div class="stat-valor">{{ totalPreguntas }}</div>
          <div class="stat-label">Total Preguntas</div>
        </div>

        <div class="stat-card correctas">
          <div class="stat-icon"><Icon name="check" size="2rem" color="#10b981" /></div>
          <div class="stat-valor">{{ respuestasCorrectas }}</div>
          <div class="stat-label">Respuestas Correctas</div>
        </div>

        <div class="stat-card incorrectas">
          <div class="stat-icon"><Icon name="close" size="2rem" color="#ef4444" /></div>
          <div class="stat-valor">{{ respuestasIncorrectas }}</div>
          <div class="stat-label">Respuestas Incorrectas</div>
        </div>

        <div class="stat-card tiempo">
          <div class="stat-icon"><Icon name="clock" size="2rem" /></div>
          <div class="stat-valor">{{ tiempoTranscurrido }}</div>
          <div class="stat-label">Tiempo Total</div>
        </div>
      </div>

      <!-- Certificado (si aprobó) -->
      <div v-if="intento.aprobado && certificado" class="certificado-section">
        <div class="certificado-card">
          <div class="certificado-icon"><Icon name="document" size="3rem" color="#3b82f6" /></div>
          <h3>¡Has obtenido tu certificado!</h3>
          <p>Código de certificado: <strong>{{ certificado.codigo_certificado }}</strong></p>
          <button @click="descargarCertificado" class="btn-certificado">
            <Icon name="download" /> Descargar Certificado
          </button>
        </div>
      </div>

      <!-- Mensaje de ánimo si no aprobó -->
      <div v-else-if="!intento.aprobado && puedeReintentar" class="reintentar-section">
        <div class="reintentar-card">
          <p><Icon name="target" /> ¡No te rindas! Puedes volver a intentarlo.</p>
          <p>Te quedan <strong>{{ intentosRestantes }}</strong> intento(s) disponible(s).</p>
          <button @click="volverACapacitacion" class="btn-reintentar">
            <Icon name="refresh" /> Revisar Material e Intentar Nuevamente
          </button>
        </div>
      </div>

      <!-- Detalle de respuestas -->
      <div class="detalle-respuestas">
        <h3><Icon name="list" /> Detalle de Respuestas</h3>
        
        <div 
          v-for="(respuesta, index) in detalleRespuestas" 
          :key="respuesta.pregunta_id"
          class="respuesta-item"
          :class="{ 'correcta': respuesta.es_correcta, 'incorrecta': !respuesta.es_correcta }"
        >
          <div class="respuesta-numero">
            Pregunta {{ index + 1 }}
          </div>

          <div class="respuesta-enunciado">
            {{ respuesta.enunciado }}
          </div>

          <div class="respuesta-tipo">
            {{ tipoPreguntaLabel(respuesta.tipo) }}
          </div>

          <div class="respuesta-detalles">
            <div class="respuesta-usuario">
              <strong>Tu respuesta:</strong>
              <span v-if="Array.isArray(respuesta.respuesta_usuario)">
                {{ respuesta.respuesta_usuario.join(', ') }}
              </span>
              <span v-else>{{ respuesta.respuesta_usuario }}</span>
            </div>

            <div v-if="!respuesta.es_correcta && mostrarRespuestasCorrectas && respuesta.opciones_correctas" class="respuesta-correcta">
              <strong>Respuesta(s) correcta(s):</strong>
              {{ respuesta.opciones_correctas.join(', ') }}
            </div>

            <div v-if="!respuesta.es_correcta && !mostrarRespuestasCorrectas" class="respuesta-oculta">
              <em>Las respuestas correctas están ocultas por configuración del administrador</em>
            </div>

            <div class="respuesta-puntaje">
              Puntaje: {{ respuesta.puntaje_obtenido }} / {{ respuesta.puntaje_pregunta }}
            </div>
          </div>

          <div class="respuesta-icono">
            <Icon :name="respuesta.es_correcta ? 'check' : 'close'" :size="'2rem'" :color="respuesta.es_correcta ? '#10b981' : '#ef4444'" />
          </div>
        </div>
      </div>

      <!-- Acciones finales -->
      <div class="acciones-finales">
        <button @click="volver" class="btn-volver-lista">
          <Icon name="arrow-left" /> Volver a Mis Capacitaciones
        </button>
        
        <button 
          v-if="intento.aprobado && certificado"
          @click="descargarCertificado" 
          class="btn-descargar"
        >
          <Icon name="download" /> Descargar Certificado
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'ResultadosEvaluacion',
  components: {
    Icon
  },
  props: {
    intentoId: {
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
      intento: null,
      capacitacion: null,
      certificado: null,
      detalleRespuestas: [],
      puedeReintentar: false,
      intentosRestantes: 0,
      mostrarRespuestasCorrectas: true
    };
  },
  computed: {
    totalPreguntas() {
      return this.detalleRespuestas.length;
    },
    respuestasCorrectas() {
      return this.detalleRespuestas.filter(r => r.es_correcta).length;
    },
    respuestasIncorrectas() {
      return this.totalPreguntas - this.respuestasCorrectas;
    },
    tiempoTranscurrido() {
      if (!this.intento) return '0 min';
      const minutos = this.intento.tiempo_transcurrido_minutos || 0;
      if (minutos < 60) return `${minutos} min`;
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return `${horas}h ${mins}min`;
    }
  },
  mounted() {
    this.cargarResultados();
  },
  methods: {
    async cargarResultados() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/evaluacion/${this.intentoId}/resultados`
        );
        
        if (response.data.success) {
          const data = response.data.data;
          this.intento = data.intento;
          this.capacitacion = data.intento.capacitacion;
          this.certificado = data.intento.certificado || null;
          this.detalleRespuestas = data.detalle_respuestas;
          this.puedeReintentar = data.puede_reintentar || false;
          this.intentosRestantes = data.intentos_restantes || 0;
          this.mostrarRespuestasCorrectas = data.mostrar_respuestas_correctas !== undefined ? data.mostrar_respuestas_correctas : true;
        }
      } catch (error) {
        alert('Error al cargar los resultados');
        this.volver();
      } finally {
        this.cargando = false;
      }
    },

    volver() {
      this.$emit('volver');
    },

    volverACapacitacion() {
      this.$emit('volver-a-capacitacion', this.capacitacion.id);
    },

    async descargarCertificado() {
      if (!this.certificado) return;
      
      try {
        // Hacer la solicitud para descargar el PDF
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/certificados/${this.certificado.id}/descargar`,
          {
            responseType: 'blob' // Importante para recibir el PDF como blob
          }
        );
        
        // Crear un objeto URL desde el blob
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Crear un enlace temporal y simular el click para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificado_${this.certificado.codigo_certificado}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert('Error al descargar el certificado. Por favor intenta nuevamente.');
      }
    },

    tipoPreguntaLabel(tipo) {
      const labels = {
        simple: 'Selección Simple',
        multiple: 'Selección Múltiple',
        vf: 'Verdadero o Falso'
      };
      return labels[tipo] || tipo;
    }
  }
};
</script>

<style scoped>
.resultados-evaluacion {
  background-color: #0b0f19;
  min-height: 100vh;
  color: #f8fafc;
}

.resultados-header {
  background-color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
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

.resultados-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #60a5fa;
}

.loading-container {
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
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.resultados-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
}

.resultado-general {
  background-color: #0f172a;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
  border: 2px solid rgba(255, 255, 255, 0.05);
}

.resultado-general.aprobado {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
}

.resultado-general.reprobado {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.02));
}

.resultado-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.resultado-titulo {
  margin: 0 0 24px 0;
  font-size: 1.8rem;
  color: #ffffff;
}

.resultado-puntaje {
  margin-bottom: 16px;
}

.puntaje-valor {
  display: block;
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.resultado-general.aprobado .puntaje-valor {
  color: #10b981;
}

.resultado-general.reprobado .puntaje-valor {
  color: #ef4444;
}

.puntaje-label {
  display: block;
  font-size: 1rem;
  color: #94a3b8;
}

.resultado-minimo {
  color: #94a3b8;
  font-size: 0.95rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-card.correctas {
  border-color: rgba(16, 185, 129, 0.3);
  background-color: rgba(16, 185, 129, 0.05);
}

.stat-card.incorrectas {
  border-color: rgba(239, 68, 68, 0.3);
  background-color: rgba(239, 68, 68, 0.05);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.stat-valor {
  font-size: 2rem;
  font-weight: bold;
  color: #60a5fa;
  margin-bottom: 8px;
}

.stat-card.correctas .stat-valor {
  color: #10b981;
}

.stat-card.incorrectas .stat-valor {
  color: #ef4444;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

.certificado-section,
.reintentar-section {
  margin-bottom: 32px;
}

.certificado-card,
.reintentar-card {
  background-color: #0f172a;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.certificado-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.certificado-card h3 {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  color: #3b82f6;
}

.certificado-card p {
  margin: 0 0 24px 0;
  color: #94a3b8;
}

.btn-certificado,
.btn-reintentar {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-certificado:hover,
.btn-reintentar:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.reintentar-card {
  border-color: rgba(59, 130, 246, 0.3);
}

.reintentar-card p {
  margin: 0 0 12px 0;
  color: #94a3b8;
  line-height: 1.6;
}

.btn-reintentar {
  background-color: #3b82f6;
  color: white;
  margin-top: 12px;
}

.btn-reintentar:hover {
  background-color: #2563eb;
}

.detalle-respuestas {
  margin-bottom: 32px;
}

.detalle-respuestas h3 {
  margin: 0 0 24px 0;
  font-size: 1.3rem;
  color: #ffffff;
}

.respuesta-item {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  position: relative;
}

.respuesta-item.correcta {
  border-left: 4px solid #10b981;
  background-color: rgba(16, 185, 129, 0.02);
}

.respuesta-item.incorrecta {
  border-left: 4px solid #ef4444;
  background-color: rgba(239, 68, 68, 0.02);
}

.respuesta-numero {
  display: inline-block;
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.respuesta-enunciado {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.6;
}

.respuesta-tipo {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 16px;
}

.respuesta-detalles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.respuesta-usuario,
.respuesta-correcta,
.respuesta-puntaje {
  font-size: 0.95rem;
  line-height: 1.5;
}

.respuesta-usuario {
  color: #94a3b8;
}

.respuesta-correcta {
  color: #10b981;
}

.respuesta-oculta {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.9rem;
}

.respuesta-puntaje {
  color: #60a5fa;
  font-weight: 600;
}

.respuesta-icono {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 2rem;
}

.acciones-finales {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-volver-lista,
.btn-descargar {
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-volver-lista {
  background-color: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-volver-lista:hover {
  background-color: rgba(148, 163, 184, 0.2);
}

.btn-descargar {
  background-color: #3b82f6;
  color: #ffffff;
}

.btn-descargar:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .resultados-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .resultados-content {
    padding: 24px 16px;
  }

  .resultado-general {
    padding: 24px;
  }

  .resultado-icon {
    font-size: 3rem;
  }

  .resultado-titulo {
    font-size: 1.4rem;
  }

  .puntaje-valor {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .respuesta-icono {
    position: static;
    margin-top: 16px;
    text-align: right;
  }

  .acciones-finales {
    flex-direction: column;
  }

  .btn-volver-lista,
  .btn-descargar {
    width: 100%;
  }
}
</style>
