<template>
  <div class="realizar-evaluacion">
    <!-- Header -->
    <div class="evaluacion-header">
      <button @click="confirmarSalir" class="btn-volver">
        ← Volver
      </button>
      <div class="header-info">
        <h2>📝 {{ capacitacion ? capacitacion.tema : 'Evaluación' }}</h2>
        <div class="header-stats">
          <span class="stat-item">
            <span class="icono">❓</span>
            Pregunta {{ preguntaActualIndex + 1 }} de {{ totalPreguntas }}
          </span>
          <span class="stat-item">
            <span class="icono">📊</span>
            Progreso: {{ progresoGeneral }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando evaluación...</p>
    </div>

    <!-- Evaluación -->
    <div v-else-if="preguntas.length > 0" class="evaluacion-content">
      <!-- Barra de progreso -->
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="`width: ${progresoGeneral}%`"></div>
        </div>
      </div>

      <!-- Pregunta actual -->
      <div class="pregunta-card">
        <div class="pregunta-numero">
          Pregunta {{ preguntaActualIndex + 1 }}
        </div>

        <div class="pregunta-enunciado">
          {{ preguntaActual.enunciado }}
        </div>

        <!-- Imagen de la pregunta (si existe) -->
        <div v-if="preguntaActual.imagen_url" class="pregunta-imagen">
          <img 
            :src="preguntaActual.imagen_url" 
            :alt="preguntaActual.enunciado"
            @error="imagenError"
          />
        </div>

        <!-- Tipo de pregunta -->
        <div class="tipo-pregunta-badge">
          {{ tipoPreguntaLabel(preguntaActual.tipo_pregunta) }}
        </div>

        <!-- Opciones de respuesta -->
        <div class="opciones-container">
          <!-- Pregunta Simple o Verdadero/Falso -->
          <div 
            v-if="preguntaActual.tipo_pregunta === 'simple' || preguntaActual.tipo_pregunta === 'vf'"
            class="opciones-simple"
          >
            <label 
              v-for="opcion in preguntaActual.opciones" 
              :key="opcion.id"
              class="opcion-item"
              :class="{ 'selected': respuestaActual === opcion.id }"
            >
              <input 
                type="radio" 
                :name="'pregunta-' + preguntaActual.id"
                :value="opcion.id"
                v-model="respuestaActual"
              />
              <span class="opcion-texto">{{ opcion.texto_opcion }}</span>
              <span class="checkmark"></span>
            </label>
          </div>

          <!-- Pregunta Múltiple -->
          <div 
            v-else-if="preguntaActual.tipo_pregunta === 'multiple'"
            class="opciones-multiple"
          >
            <p class="nota-multiple">
              ℹ️ Selecciona todas las respuestas correctas
            </p>
            <label 
              v-for="opcion in preguntaActual.opciones" 
              :key="opcion.id"
              class="opcion-item"
              :class="{ 'selected': respuestasMultiples.includes(opcion.id) }"
            >
              <input 
                type="checkbox" 
                :value="opcion.id"
                v-model="respuestasMultiples"
              />
              <span class="opcion-texto">{{ opcion.texto_opcion }}</span>
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Navegación -->
      <div class="navegacion-buttons">
        <button 
          @click="preguntaAnterior" 
          :disabled="preguntaActualIndex === 0"
          class="btn-nav btn-anterior"
        >
          ← Anterior
        </button>

        <button 
          v-if="preguntaActualIndex < totalPreguntas - 1"
          @click="siguientePregunta" 
          :disabled="!tieneRespuesta"
          class="btn-nav btn-siguiente"
        >
          Siguiente →
        </button>

        <button 
          v-else
          @click="confirmarFinalizarEvaluacion" 
          :disabled="!todasRespondidas"
          class="btn-finalizar"
        >
          ✅ Finalizar Evaluación
        </button>
      </div>

      <!-- Indicadores de preguntas -->
      <div class="preguntas-indicadores">
        <div 
          v-for="(pregunta, index) in preguntas" 
          :key="pregunta.id"
          class="indicador-item"
          :class="{
            'actual': index === preguntaActualIndex,
            'respondida': respuestas[pregunta.id] !== undefined
          }"
          @click="irAPregunta(index)"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>

    <!-- Confirmación de salida -->
    <div v-if="mostrarConfirmacionSalida" class="modal-overlay" @click="cancelarSalir">
      <div class="modal-content" @click.stop>
        <h3>⚠️ ¿Salir de la evaluación?</h3>
        <p>Tu progreso se guardará automáticamente y podrás continuar más tarde.</p>
        <div class="modal-buttons">
          <button @click="cancelarSalir" class="btn-cancelar">Cancelar</button>
          <button @click="salir" class="btn-confirmar">Salir</button>
        </div>
      </div>
    </div>

    <!-- Confirmación de finalizar -->
    <div v-if="mostrarConfirmacionFinalizar" class="modal-overlay" @click="cancelarFinalizar">
      <div class="modal-content" @click.stop>
        <h3>✅ ¿Finalizar evaluación?</h3>
        <p>Has respondido {{ preguntasRespondidas }} de {{ totalPreguntas }} preguntas.</p>
        <p v-if="!todasRespondidas" class="advertencia">
          ⚠️ Aún hay preguntas sin responder. ¿Estás seguro de finalizar?
        </p>
        <div class="modal-buttons">
          <button @click="cancelarFinalizar" class="btn-cancelar">Cancelar</button>
          <button @click="finalizarEvaluacion" class="btn-confirmar" :disabled="finalizando">
            {{ finalizando ? '⏳ Finalizando...' : 'Finalizar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RealizarEvaluacion',
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
      finalizando: false,
      capacitacion: null,
      preguntas: [],
      respuestas: {}, // { pregunta_id: respuesta }
      preguntaActualIndex: 0,
      respuestaActual: null,
      respuestasMultiples: [],
      mostrarConfirmacionSalida: false,
      mostrarConfirmacionFinalizar: false
    };
  },
  computed: {
    totalPreguntas() {
      return this.preguntas.length;
    },
    preguntaActual() {
      return this.preguntas[this.preguntaActualIndex] || {};
    },
    tieneRespuesta() {
      if (this.preguntaActual.tipo_pregunta === 'multiple') {
        return this.respuestasMultiples.length > 0;
      }
      return this.respuestaActual !== null;
    },
    preguntasRespondidas() {
      const respondidas = Object.keys(this.respuestas).length;
      return respondidas;
    },
    todasRespondidas() {
      const todas = this.preguntasRespondidas === this.totalPreguntas;
      return todas;
    },
    progresoGeneral() {
      if (this.totalPreguntas === 0) return 0;
      return Math.round((this.preguntasRespondidas / this.totalPreguntas) * 100);
    }
  },
  watch: {
    preguntaActualIndex(newIndex) {
      this.cargarRespuestaActual();
    },
    respuestaActual(newVal, oldVal) {
      // Solo guardar si cambió y no es múltiple
      if (newVal !== null && newVal !== oldVal && this.preguntaActual.tipo_pregunta !== 'multiple') {
        this.guardarRespuesta();
      }
    },
    respuestasMultiples: {
      handler(newVal, oldVal) {
        // Solo guardar si es múltiple y tiene valores
        if (this.preguntaActual.tipo_pregunta === 'multiple' && newVal.length > 0) {
          // Verificar que realmente cambió
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.guardarRespuesta();
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.cargarEvaluacion();
  },
  methods: {
    async cargarEvaluacion() {
      this.cargando = true;
      try {
        // Obtener datos del intento y preguntas
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/evaluacion/${this.intentoId}/datos`
        );
        
        if (response.data.success) {
          const data = response.data.data;
          this.capacitacion = data.capacitacion;
          this.preguntas = data.preguntas;
          
          // Cargar respuestas existentes si las hay
          if (data.respuestas_guardadas) {
            // Usar $set para asegurar reactividad
            this.respuestas = {};
            Object.keys(data.respuestas_guardadas).forEach(preguntaId => {
              this.$set(this.respuestas, preguntaId, data.respuestas_guardadas[preguntaId]);
            });
          } else {
            this.respuestas = {};
          }
          
          this.cargarRespuestaActual();
        }
      } catch (error) {
        alert('Error al cargar la evaluación');
        this.$emit('volver');
      } finally {
        this.cargando = false;
      }
    },

    cargarRespuestaActual() {
      const preguntaId = this.preguntaActual.id;
      const respuestaGuardada = this.respuestas[preguntaId];
      
      if (this.preguntaActual.tipo_pregunta === 'multiple') {
        // Para respuestas múltiples, debe ser un array
        if (Array.isArray(respuestaGuardada)) {
          this.respuestasMultiples = [...respuestaGuardada];
        } else {
          this.respuestasMultiples = [];
        }
        this.respuestaActual = null;
      } else {
        // Para respuestas simples, un valor único
        if (respuestaGuardada !== undefined && respuestaGuardada !== null) {
          this.respuestaActual = respuestaGuardada;
        } else {
          this.respuestaActual = null;
        }
        this.respuestasMultiples = [];
      }
    },

    async guardarRespuesta() {
      const preguntaId = this.preguntaActual.id;
      let respuesta;
      
      if (this.preguntaActual.tipo_pregunta === 'multiple') {
        respuesta = [...this.respuestasMultiples]; // Clonar array
        
        // Validar que haya al menos una opción seleccionada
        if (respuesta.length === 0) {
          return;
        }
      } else {
        respuesta = this.respuestaActual;
        
        // Validar que haya respuesta
        if (respuesta === null) {
          return;
        }
      }
      
      // Guardar localmente primero (actualizar el objeto reactivo)
      this.$set(this.respuestas, preguntaId, respuesta);
      
      // Guardar en el servidor
      try {
        const payload = {
          intento_id: this.intentoId,
          pregunta_id: preguntaId,
          respuesta: respuesta
        };
        
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/usuario/evaluacion/guardar-respuesta`,
          payload
        );
        
        // Verificar que se guardó correctamente
        if (!response.data.success) {
          // Silenciosamente manejar el error
        }
      } catch (error) {
        // No mostrar error al usuario para no interrumpir el flujo
        // Pero mantener el guardado local
      }
    },

    siguientePregunta() {
      if (this.preguntaActualIndex < this.totalPreguntas - 1) {
        this.preguntaActualIndex++;
      }
    },

    preguntaAnterior() {
      if (this.preguntaActualIndex > 0) {
        this.preguntaActualIndex--;
      }
    },

    irAPregunta(index) {
      this.preguntaActualIndex = index;
    },

    confirmarSalir() {
      this.mostrarConfirmacionSalida = true;
    },

    cancelarSalir() {
      this.mostrarConfirmacionSalida = false;
    },

    salir() {
      this.$emit('volver');
    },

    confirmarFinalizarEvaluacion() {
      this.mostrarConfirmacionFinalizar = true;
    },

    cancelarFinalizar() {
      this.mostrarConfirmacionFinalizar = false;
    },

    async finalizarEvaluacion() {
      this.finalizando = true;
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/usuario/evaluacion/${this.intentoId}/finalizar`
        );
        
        if (response.data.success) {
          this.$emit('evaluacion-finalizada', response.data.data);
        }
      } catch (error) {
        alert('Error al finalizar la evaluación');
      } finally {
        this.finalizando = false;
        this.mostrarConfirmacionFinalizar = false;
      }
    },

    tipoPreguntaLabel(tipo) {
      const labels = {
        simple: '⚪ Selección Simple',
        multiple: '☑️ Selección Múltiple',
        vf: '✓✗ Verdadero o Falso'
      };
      return labels[tipo] || tipo;
    },

    imagenError(event) {
      event.target.style.display = 'none';
    }
  }
};
</script>

<style scoped>
.realizar-evaluacion {
  background-color: #0b0f19;
  min-height: 100vh;
  color: #f8fafc;
}

.evaluacion-header {
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

.header-info {
  flex: 1;
}

.header-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: #60a5fa;
}

.header-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.stat-item .icono {
  font-size: 1.1rem;
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

.evaluacion-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.progress-bar-container {
  margin-bottom: 32px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s;
  border-radius: 6px;
}

.pregunta-card {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.pregunta-numero {
  display: inline-block;
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.pregunta-enunciado {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #ffffff;
}

.pregunta-imagen {
  margin: 20px 0;
  text-align: center;
}

.pregunta-imagen img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tipo-pregunta-badge {
  display: inline-block;
  background-color: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.opciones-container {
  margin-top: 24px;
}

.nota-multiple {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 16px;
  padding: 12px;
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
}

.opciones-simple,
.opciones-multiple {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opcion-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: rgba(30, 41, 59, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.opcion-item:hover {
  background-color: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
}

.opcion-item.selected {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.opcion-item input[type="radio"],
.opcion-item input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.opcion-texto {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
  padding-left: 36px;
}

.checkmark {
  position: absolute;
  left: 20px;
  width: 20px;
  height: 20px;
  border: 2px solid #64748b;
  border-radius: 50%;
  transition: all 0.2s;
}

.opcion-item input[type="checkbox"] ~ .checkmark {
  border-radius: 4px;
}

.opcion-item.selected .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.opcion-item.selected .checkmark::after {
  content: '';
  position: absolute;
  display: block;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.navegacion-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.btn-nav,
.btn-finalizar {
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-anterior,
.btn-siguiente {
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-anterior:hover:not(:disabled),
.btn-siguiente:hover:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.2);
}

.btn-finalizar {
  background-color: #10b981;
  color: white;
}

.btn-finalizar:hover:not(:disabled) {
  background-color: #059669;
}

.btn-nav:disabled,
.btn-finalizar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.preguntas-indicadores {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 20px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.indicador-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
}

.indicador-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.indicador-item.actual {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.indicador-item.respondida {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #10b981;
}

.indicador-item.respondida.actual {
  background-color: #10b981;
  color: white;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
}

.modal-content h3 {
  margin: 0 0 16px 0;
  font-size: 1.5rem;
  color: #ffffff;
}

.modal-content p {
  margin: 0 0 12px 0;
  color: #94a3b8;
  line-height: 1.6;
}

.modal-content .advertencia {
  color: #fbbf24;
  font-weight: 600;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancelar,
.btn-confirmar {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancelar {
  background-color: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-cancelar:hover {
  background-color: rgba(148, 163, 184, 0.2);
}

.btn-confirmar {
  background-color: #3b82f6;
  color: white;
}

.btn-confirmar:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .evaluacion-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-stats {
    flex-direction: column;
    gap: 8px;
  }

  .evaluacion-content {
    padding: 24px 16px;
  }

  .pregunta-card {
    padding: 24px 20px;
  }

  .navegacion-buttons {
    flex-direction: column;
  }

  .btn-nav,
  .btn-finalizar {
    width: 100%;
  }

  .preguntas-indicadores {
    gap: 8px;
  }

  .indicador-item {
    width: 36px;
    height: 36px;
  }
}
</style>
