<template>
  <div class="responder-encuesta">
    <div class="encuesta-header">
      <button @click="confirmarSalir" class="btn-volver">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon-back"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Volver
      </button>
      <div class="progreso-wrap" v-if="paginas.length">
        <div class="progreso-bar">
          <div class="progreso-fill" :style="`width: ${progreso}%`"></div>
        </div>
        <span class="progreso-texto">{{ indicePagina + 1 }} / {{ paginas.length }}</span>
      </div>
    </div>

    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando encuesta...</p>
    </div>

    <div v-else-if="errorAcceso" class="error-container">
      <p>{{ errorAcceso }}</p>
      <button @click="$emit('volver')" class="btn-confirmar">Volver</button>
    </div>

    <div v-else-if="paginaActual" class="pagina-container">
      <div class="contenido-centrado">
        <!-- Página de introducción: tema + descripción -->
        <div v-if="paginaActual.tipo === 'intro'" class="pagina-intro animate-page">
        <div class="intro-icono">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h1>{{ encuesta.tema }}</h1>
        <div class="intro-linea"></div>
        <p v-if="encuesta.descripcion">{{ encuesta.descripcion }}</p>
      </div>

      <!-- Página de sección: título + descripción -->
      <div v-else-if="paginaActual.tipo === 'seccion'" class="pagina-seccion animate-page">
        <span class="seccion-etiqueta">Sección</span>
        <h2 v-if="paginaActual.seccion.titulo">{{ paginaActual.seccion.titulo }}</h2>
        <p v-if="paginaActual.seccion.descripcion">{{ paginaActual.seccion.descripcion }}</p>
      </div>

      <!-- Página de pregunta -->
      <div v-else-if="paginaActual.tipo === 'pregunta'" class="pagina-pregunta animate-page">
        <div class="pregunta-enunciado">
          {{ paginaActual.pregunta.enunciado }}
          <span v-if="paginaActual.pregunta.es_obligatoria" class="requerido">*</span>
        </div>

        <div v-if="paginaActual.pregunta.tipo_pregunta === 'simple'" class="opciones-simple">
          <label
            v-for="opcion in paginaActual.pregunta.opciones"
            :key="opcion.id"
            class="opcion-item"
            :class="{ selected: respuestas[paginaActual.pregunta.id] === opcion.id }"
          >
            <input type="radio" :name="'pregunta-' + paginaActual.pregunta.id" :value="opcion.id" v-model="respuestas[paginaActual.pregunta.id]" />
            <span class="opcion-texto">{{ opcion.texto_opcion }}</span>
            <span class="checkmark"></span>
          </label>
        </div>

        <div v-else-if="paginaActual.pregunta.tipo_pregunta === 'multiple'" class="opciones-multiple">
          <label
            v-for="opcion in paginaActual.pregunta.opciones"
            :key="opcion.id"
            class="opcion-item"
            :class="{ selected: (respuestasMultiples[paginaActual.pregunta.id] || []).includes(opcion.id) }"
          >
            <input type="checkbox" :value="opcion.id" v-model="respuestasMultiples[paginaActual.pregunta.id]" />
            <span class="opcion-texto">{{ opcion.texto_opcion }}</span>
            <span class="checkmark"></span>
          </label>
        </div>

        <div v-else-if="paginaActual.pregunta.tipo_pregunta === 'escala'" class="escala-container">
          <div class="escala-etiquetas">
            <span>{{ paginaActual.pregunta.escala_etiqueta_min || paginaActual.pregunta.escala_min }}</span>
            <span>{{ paginaActual.pregunta.escala_etiqueta_max || paginaActual.pregunta.escala_max }}</span>
          </div>
          <div class="escala-opciones">
            <label
              v-for="valor in escalaValores(paginaActual.pregunta)"
              :key="'valor-' + paginaActual.pregunta.id + '-' + valor"
              class="escala-opcion"
              :class="{ selected: respuestas[paginaActual.pregunta.id] == valor }"
            >
              <input type="radio" :name="'escala-' + paginaActual.pregunta.id" :value="Number(valor)" v-model.number="respuestas[paginaActual.pregunta.id]" />
              <span>{{ valor }}</span>
            </label>
          </div>
        </div>

        <div v-else-if="paginaActual.pregunta.tipo_pregunta === 'texto_corto'" class="texto-container">
          <input type="text" v-model="respuestas[paginaActual.pregunta.id]" placeholder="Tu respuesta..." maxlength="255" />
        </div>

        <div v-else-if="paginaActual.pregunta.tipo_pregunta === 'texto_largo'" class="texto-container">
          <textarea v-model="respuestas[paginaActual.pregunta.id]" placeholder="Tu respuesta..." rows="5"></textarea>
        </div>
      </div>
      </div>

      <!-- Navegación -->
      <div class="nav-container">
        <button v-if="indicePagina > 0" @click="anterior" class="btn-nav btn-anterior">← Anterior</button>
        <div v-else></div>

        <button v-if="!esUltimaPagina" @click="siguiente" class="btn-nav btn-siguiente" :disabled="!puedeAvanzar">
          Siguiente →
        </button>
        <button v-else @click="confirmarEnviar" class="btn-enviar" :disabled="!puedeAvanzar || enviando">
          {{ enviando ? 'Enviando...' : 'Enviar Encuesta' }}
        </button>
      </div>
    </div>

    <div v-if="mostrarConfirmacionSalida" class="modal-overlay" @click="cancelarSalir">
      <div class="modal-content" @click.stop>
        <h3>¿Salir de la encuesta?</h3>
        <p>Tus respuestas no se guardarán si sales ahora.</p>
        <div class="modal-buttons">
          <button @click="cancelarSalir" class="btn-cancelar">Cancelar</button>
          <button @click="salir" class="btn-confirmar">Salir</button>
        </div>
      </div>
    </div>

    <div v-if="mostrarConfirmacionEnvio" class="modal-overlay" @click="cancelarEnvio">
      <div class="modal-content" @click.stop>
        <h3>¿Enviar respuestas?</h3>
        <p>Una vez enviada, no podrás modificar tus respuestas.</p>
        <div class="modal-buttons">
          <button @click="cancelarEnvio" class="btn-cancelar">Cancelar</button>
          <button @click="enviarRespuestas" class="btn-confirmar" :disabled="enviando">
            {{ enviando ? 'Enviando...' : 'Confirmar Envío' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponderEncuesta',
  props: {
    encuestaId: {
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
      enviando: false,
      encuesta: null,
      errorAcceso: null,
      respuestas: {},
      respuestasMultiples: {},
      paginas: [],
      indicePagina: 0,
      mostrarConfirmacionSalida: false,
      mostrarConfirmacionEnvio: false
    };
  },
  computed: {
    paginaActual() {
      return this.paginas[this.indicePagina] || null;
    },
    esUltimaPagina() {
      return this.indicePagina === this.paginas.length - 1;
    },
    progreso() {
      if (!this.paginas.length) return 0;
      return Math.round(((this.indicePagina + 1) / this.paginas.length) * 100);
    },
    puedeAvanzar() {
      const pagina = this.paginaActual;
      if (!pagina || pagina.tipo !== 'pregunta') return true;

      const pregunta = pagina.pregunta;
      if (!pregunta.es_obligatoria) return true;

      if (pregunta.tipo_pregunta === 'multiple') {
        return (this.respuestasMultiples[pregunta.id] || []).length > 0;
      }
      if (pregunta.tipo_pregunta === 'texto_corto' || pregunta.tipo_pregunta === 'texto_largo') {
        return !!(this.respuestas[pregunta.id] && this.respuestas[pregunta.id].trim());
      }
      return this.respuestas[pregunta.id] !== null && this.respuestas[pregunta.id] !== undefined;
    }
  },
  mounted() {
    this.cargarEncuesta();
  },
  methods: {
    async cargarEncuesta() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/encuestas/${this.encuestaId}`,
          { params: { idusuario: this.idusuario } }
        );

        if (response.data.success) {
          this.encuesta = response.data.data;
          this.construirPaginas();

          // Construir los objetos completos y asignarlos de una sola vez.
          // Si se asignan claves una por una sobre el objeto ya reactivo
          // (this.respuestas[id] = ...) Vue 2 no detecta esas propiedades
          // nuevas como reactivas, y la vista no se actualiza al marcar
          // una opción (solo se refresca al cambiar de página por otro
          // motivo). Reasignar el objeto completo sí dispara reactividad.
          const respuestas = {};
          const respuestasMultiples = {};

          this.todasLasPreguntas().forEach(pregunta => {
            if (pregunta.tipo_pregunta === 'multiple') {
              respuestasMultiples[pregunta.id] = [];
            } else {
              respuestas[pregunta.id] = null;
            }
          });

          this.respuestas = respuestas;
          this.respuestasMultiples = respuestasMultiples;
        } else {
          this.errorAcceso = response.data.message || 'No se pudo cargar la encuesta';
        }
      } catch (error) {
        this.errorAcceso = (error.response && error.response.data && error.response.data.message) || 'Error al cargar la encuesta';
      } finally {
        this.cargando = false;
      }
    },

    construirPaginas() {
      const paginas = [{ tipo: 'intro' }];

      (this.encuesta.secciones || []).forEach(seccion => {
        if (seccion.titulo || seccion.descripcion) {
          paginas.push({ tipo: 'seccion', seccion });
        }
        (seccion.preguntas || []).forEach(pregunta => {
          paginas.push({ tipo: 'pregunta', pregunta });
        });
      });

      this.paginas = paginas;
    },

    escalaValores(pregunta) {
      const min = pregunta.escala_min || 1;
      const max = pregunta.escala_max || 5;
      const valores = [];
      for (let i = min; i <= max; i++) valores.push(i);
      return valores;
    },

    todasLasPreguntas() {
      if (!this.encuesta) return [];
      return this.encuesta.secciones.flatMap(seccion => seccion.preguntas);
    },

    siguiente() {
      if (this.indicePagina < this.paginas.length - 1) {
        this.indicePagina++;
      }
    },
    anterior() {
      if (this.indicePagina > 0) {
        this.indicePagina--;
      }
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

    confirmarEnviar() {
      this.mostrarConfirmacionEnvio = true;
    },
    cancelarEnvio() {
      this.mostrarConfirmacionEnvio = false;
    },

    async enviarRespuestas() {
      this.enviando = true;

      const payloadRespuestas = this.todasLasPreguntas().map(pregunta => {
        if (pregunta.tipo_pregunta === 'multiple') {
          return { pregunta_id: pregunta.id, opciones_ids: this.respuestasMultiples[pregunta.id] || [] };
        }
        if (pregunta.tipo_pregunta === 'simple') {
          return { pregunta_id: pregunta.id, opcion_id: this.respuestas[pregunta.id] || null };
        }
        if (pregunta.tipo_pregunta === 'escala') {
          return { pregunta_id: pregunta.id, respuesta_escala: this.respuestas[pregunta.id] || null };
        }
        return { pregunta_id: pregunta.id, respuesta_texto: this.respuestas[pregunta.id] || null };
      }).filter(r => {
        if (r.opcion_id !== undefined) return r.opcion_id !== null;
        if (r.opciones_ids !== undefined) return r.opciones_ids.length > 0;
        if (r.respuesta_escala !== undefined) return r.respuesta_escala !== null;
        return !!(r.respuesta_texto && r.respuesta_texto.trim());
      });

      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/usuario/encuestas/${this.encuestaId}/responder`,
          { idusuario: this.idusuario, respuestas: payloadRespuestas }
        );

        if (response.data.success) {
          this.$emit('encuesta-respondida');
        } else {
          this.$emit('show-toast', { mensaje: response.data.message || 'Error al enviar la encuesta', tipo: 'error' });
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al enviar la encuesta';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      } finally {
        this.enviando = false;
        this.mostrarConfirmacionEnvio = false;
      }
    }
  }
};
</script>

<style scoped>
.responder-encuesta {
  background-color: #0b0f19;
  min-height: 100vh;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.encuesta-header {
  background-color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.icon-back {
  width: 16px;
  height: 16px;
}

.btn-volver:hover {
  background: rgba(139, 92, 246, 0.2);
}

.progreso-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.progreso-bar {
  flex: 1;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

.progreso-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.35s ease;
  border-radius: 4px;
}

.progreso-texto {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  white-space: nowrap;
  min-width: 44px;
  text-align: right;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #94a3b8;
  gap: 16px;
  flex: 1;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(96, 165, 250, 0.1);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pagina-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 0 140px 0;
  width: 100%;
  min-height: calc(100vh - 60px);
}

.contenido-centrado {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 24px 20px;
  min-height: 300px;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-page {
  animation: pageIn 0.3s ease-out;
}

.pagina-intro,
.pagina-seccion {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.intro-icono {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(96, 165, 250, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
}

.intro-icono svg {
  width: 32px;
  height: 32px;
}

.pagina-intro h1 {
  font-size: 2.1rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
  line-height: 1.3;
}

.intro-linea {
  width: 56px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 2px;
  margin: 20px auto;
}

.pagina-intro p {
  color: #94a3b8;
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
  white-space: pre-line;
}

.seccion-etiqueta {
  display: inline-block;
  background-color: rgba(96, 165, 250, 0.12);
  color: #60a5fa;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.pagina-seccion h2 {
  font-size: 1.7rem;
  color: #ffffff;
  margin: 0 0 14px 0;
  font-weight: 700;
}

.pagina-seccion p {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.7;
  max-width: 480px;
  margin: 0 auto;
  white-space: pre-line;
}

.pagina-pregunta {
  background-color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 36px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.pregunta-enunciado {
  font-size: 1.25rem;
  line-height: 1.55;
  margin-bottom: 26px;
  color: #ffffff;
  font-weight: 600;
  white-space: pre-line;
}

.requerido {
  color: #ef4444;
  margin-left: 4px;
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
  border-color: rgba(139, 92, 246, 0.3);
}

.opcion-item.selected {
  background-color: rgba(96, 165, 250, 0.1);
  border-color: #60a5fa;
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
  background-color: #60a5fa;
  border-color: #60a5fa;
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

.escala-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.escala-etiquetas {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #94a3b8;
}

.escala-opciones {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.escala-opcion {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  background-color: rgba(30, 41, 59, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 700;
}

.escala-opcion input {
  position: absolute;
  opacity: 0;
}

.escala-opcion:hover {
  border-color: rgba(96, 165, 250, 0.3);
}

.escala-opcion.selected {
  background-color: #60a5fa;
  border-color: #60a5fa;
  color: white;
}

.texto-container input,
.texto-container textarea {
  width: 100%;
  padding: 14px 16px;
  background-color: rgba(30, 41, 59, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.texto-container input:focus,
.texto-container textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 28px;
  flex-shrink: 0;
  background: #0b0f19;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;
  min-height: 90px;
}

.btn-nav,
.btn-enviar {
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-anterior,
.btn-siguiente {
  background-color: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.btn-anterior:hover:not(:disabled),
.btn-siguiente:hover:not(:disabled) {
  background-color: rgba(96, 165, 250, 0.2);
}

.btn-siguiente {
  margin-left: auto;
}

.btn-enviar {
  background-color: #10b981;
  color: white;
  margin-left: auto;
}

.btn-enviar:hover:not(:disabled) {
  background-color: #059669;
}

.btn-nav:disabled,
.btn-enviar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

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
  background-color: #8b5cf6;
  color: white;
}

.btn-confirmar:hover:not(:disabled) {
  background-color: #7c3aed;
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .encuesta-header {
    padding: 12px 16px;
    gap: 12px;
  }

  .btn-volver {
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .icon-back {
    width: 16px;
    height: 16px;
  }

  .progreso-texto {
    font-size: 0.75rem;
  }

  .pagina-container {
    padding: 0 0 20px 0;
    min-height: auto;
    gap: 0;
  }

  .contenido-centrado {
    max-width: 100%;
    padding: 40px 16px 40px;
    min-height: auto;
    justify-content: flex-start;
    padding-top: 60px;
  }

  .intro-icono {
    width: 56px;
    height: 56px;
    margin-bottom: 20px;
  }

  .intro-icono svg {
    width: 28px;
    height: 28px;
  }

  .pagina-intro h1 {
    font-size: 1.4rem;
    line-height: 1.35;
    margin-bottom: 4px;
  }

  .intro-linea {
    margin: 16px auto;
    width: 48px;
  }

  .pagina-intro p {
    font-size: 0.9rem;
    line-height: 1.65;
    max-width: 100%;
    padding: 0 8px;
  }

  .seccion-etiqueta {
    font-size: 0.7rem;
    padding: 4px 12px;
    margin-bottom: 12px;
  }

  .pagina-seccion h2 {
    font-size: 1.3rem;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .pagina-seccion p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .pagina-pregunta {
    padding: 20px 16px;
    max-width: 100%;
  }

  .pregunta-enunciado {
    font-size: 1.05rem;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .opciones-simple,
  .opciones-multiple {
    gap: 10px;
  }

  .opcion-item {
    padding: 14px 16px;
    font-size: 0.9rem;
  }

  .checkmark {
    width: 20px;
    height: 20px;
  }

  .escala-container {
    padding: 20px 12px;
  }

  .escala-etiquetas {
    font-size: 0.8rem;
    margin-bottom: 20px;
    gap: 12px;
  }

  .escala-opciones {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  .escala-opcion {
    min-width: 48px;
    width: 48px;
    height: 48px;
    font-size: 0.95rem;
  }

  .texto-container input,
  .texto-container textarea {
    font-size: 0.95rem;
    padding: 12px 14px;
  }

  .nav-container {
    padding: 20px 16px 24px;
    gap: 10px;
    flex-direction: column-reverse;
    background: #0b0f19;
    min-height: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: 40px;
  }

  .btn-navegacion,
  .btn-nav,
  .btn-enviar {
    width: 100%;
    padding: 12px;
    font-size: 0.9rem;
  }

  .btn-navegacion svg {
    width: 18px;
    height: 18px;
  }

  .completado-container {
    padding: 24px 16px;
  }

  .completado-container h2 {
    font-size: 1.35rem;
  }

  .completado-container p {
    font-size: 0.9rem;
  }

  .completado-icono {
    width: 72px;
    height: 72px;
  }

  .completado-icono svg {
    width: 36px;
    height: 36px;
  }

  .btn-confirmar {
    width: 100%;
    padding: 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .pagina-container {
    padding: 16px 12px;
    gap: 20px;
  }

  .intro-icono {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }

  .intro-icono svg {
    width: 24px;
    height: 24px;
  }

  .pagina-intro h1 {
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .intro-linea {
    margin: 12px auto;
    width: 40px;
    height: 2px;
  }

  .pagina-intro p {
    font-size: 0.85rem;
    line-height: 1.6;
  }

  .pagina-seccion h2 {
    font-size: 1.15rem;
  }

  .pagina-seccion p {
    font-size: 0.85rem;
  }

  .pregunta-enunciado {
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  .opcion-item {
    padding: 12px 14px;
    font-size: 0.85rem;
  }

  .checkmark {
    width: 18px;
    height: 18px;
  }

  .escala-opciones {
    gap: 8px;
  }

  .escala-opcion {
    min-width: 42px;
    width: 42px;
    height: 42px;
    font-size: 0.9rem;
  }

  .escala-etiquetas {
    font-size: 0.75rem;
  }

  .texto-container input,
  .texto-container textarea {
    font-size: 0.9rem;
  }

  .btn-navegacion {
    padding: 11px;
    font-size: 0.85rem;
  }

  .completado-container h2 {
    font-size: 1.2rem;
  }

  .completado-container p {
    font-size: 0.85rem;
  }

  .completado-icono {
    width: 60px;
    height: 60px;
  }

  .completado-icono svg {
    width: 30px;
    height: 30px;
  }
}
</style>
