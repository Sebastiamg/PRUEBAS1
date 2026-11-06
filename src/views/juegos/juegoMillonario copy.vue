<template>
  <div class="game-wrapper">
    <div class="game-container" :class="{ 'container-md': !isMobile, 'container-sm': isMobile }">

      <!-- HEADER KAHOOT STYLE -->
      <div class="game-header">
        <vs-button class="icon-btn" @click="modalFicha = true" >
         <i class="feather icon-reload"></i>
        </vs-button>

        <div class="game-brand">
          <div class="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </div>
          <span class="brand-text">{{ getNombreJuego() }}</span>
        </div>

        <div class="header-actions">
          <div class="question-pill">
            <span class="pill-number">{{ !resultados ? turno + 1 : t_preguntas }}</span>
            <span class="pill-total">/{{ t_preguntas }}</span>
          </div>


<vs-button
  icon="icon-reload"
  @click="reiniciarJuego"
  title="Reiniciar juego"
  type="flat"
  circle>
</vs-button>
        </div>
      </div>

      <!-- PROGRESS BAR ANIMADA -->
      <div class="progress-section">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: ((turno + 1) / t_preguntas * 100) + '%' }"
            :class="{ 'progress-pulse': !resultados && juega }">
          </div>
        </div>

        <div class="points-badge" :class="{ 'points-pop': numero > 0 }">
          <span class="points-icon">⚡</span>
          <span class="points-value">{{ numero }}</span>
        </div>
      </div>

      <!-- TARJETA PRINCIPAL -->
      <div v-if="!resultados" class="game-card" :class="{ 'card-shake': icono_ok && !resp_ok }">

        <!-- DECORACIÓN SUPERIOR -->
        <div class="card-strip"></div>

        <!-- DESCRIPCIÓN DEL JUEGO -->
        <div class="game-description-card">
          <div class="desc-icon">🎮</div>
          <p class="game-desc-text">{{ getDescripcionJuego() }}</p>
        </div>

        <!-- CONTENEDOR CON OVERLAY PARA LOADER -->
        <div class="content-container" :class="{ 'loading': isChangingQuestion }">

          <!-- LOADER OVERLAY -->
          <div v-if="isChangingQuestion" class="loader-overlay">
            <div class="loader-spinner"></div>
            <p>Cargando siguiente pregunta...</p>
          </div>

          <!-- PREGUNTA CON ANIMACIÓN -->
          <transition name="bounce-in">
            <div class="question-container" :key="'question-' + turno">
              <div class="question-badge">
                <span class="badge-icon">❓</span>
                <span>Pregunta {{ turno + 1 }}</span>
              </div>
              <h2 class="question-text" v-html="getPreguntaActual()"></h2>
            </div>
          </transition>

          <!-- OPCIONES -->
          <transition-group name="options-stagger" tag="div" class="options-grid" :key="'options-' + turno">
            <div v-for="(item, index) in getOpcionesActuales()" :key="item.id_opcion_contenido" @click="getOpcion(item)"
              :class="['option-card-sober',
                {
                  'option-selected': isSelected(item.id_opcion_contenido),
                  'option-selected-highlight': isSelected(item.id_opcion_contenido),
                  'option-correct-sober': isSelected(item.id_opcion_contenido) && item.tipo_opcion == respuesta_correcta,
                  'option-wrong-sober': isSelected(item.id_opcion_contenido) && item.tipo_opcion != respuesta_correcta
                }]"
              :style="{ animationDelay: index * 0.1 + 's' }">

              <div class="option-content-sober">
                <span class="option-letter-sober">{{ letras[index] }}</span>
                <div class="option-main-sober">
                  <vs-avatar v-if="item.imagen_opcion" size="35" :src="getImageUrl(item.imagen_opcion)" />
                  <span class="option-text-sober">{{ item.nombre_opcion }}</span>
                </div>
              </div>

              <div v-if="isSelected(item.id_opcion_contenido)" class="option-check-sober">
                <svg v-if="item.tipo_opcion == respuesta_correcta" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="#10b981" stroke-width="3">
                  <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3">
                  <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round" />
                </svg>
              </div>
            </div>
          </transition-group>

          <!-- IMAGEN DE LA PREGUNTA (SI EXISTE) -->
          <div v-if="tieneImagenPregunta()" class="question-image-wrapper" @click="mostrarImagen(getImagenPregunta())">
            <img :src="getImageUrl(getImagenPregunta())" alt="Imagen de pregunta">
            <div class="image-overlay">
              <div class="zoom-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTÓN COMODÍN ANIMADO (SOLO SI HAY UNA RESPUESTA CORRECTA) -->
        <button v-if="t_ctrl_comodin < t_comodin && tieneUnaRespuestaCorrecta()" class="comodin-button"
          @click="f_comodin">
          <span class="comodin-icon">🎲</span>
          <span class="comodin-text">50/50</span>
          <span class="comodin-glow"></span>
        </button>
      </div>

      <!-- VISTA DE RESULTADOS -->
      <div v-else class="results-card">
        <div class="confetti">🎉</div>

        <h3 class="results-title">¡Resultados!</h3>

        <div class="results-score-circle">
          <div class="score-animated">
            <span class="score-number">{{ (total_calificacion).toFixed(1) }}</span>
            <span class="score-max">/10</span>
          </div>
        </div>

        <div v-if="arr_resultados.length > 0" class="results-list">
          <div v-for="(item, index) in arr_resultados" :key="index" class="result-item">
            <div class="result-icon" :class="item.respuesta == 1 ? 'result-correct' : 'result-incorrect'">
              {{ item.respuesta == 1 ? '✓' : '✗' }}
            </div>
            <div class="result-content">
              <div class="result-question">{{ item.pregunta }}</div>
              <div class="result-answer">{{ item.descripcion }}</div>
            </div>
          </div>
        </div>
        <div v-else class="no-results">
          <p>No hay resultados para mostrar</p>
        </div>

        <div class="results-actions">
          <button class="btn-kahoot" @click="modalCalificacion = true">
            <span>Guardar calificación</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              <path d="M14 2v4H6V2" />
              <path d="M8 10h4" />
              <path d="M10 8v4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- NOTIFICACIÓN -->
      <transition name="explode">
        <div v-if="icono_ok" class="kahoot-toast" :class="resp_ok ? 'toast-correct' : 'toast-incorrect'">
          <div class="toast-content">
            <span class="toast-icon">{{ resp_ok ? '🎉' : '😢' }}</span>
            <span class="toast-text">{{ resp_ok ? '¡Correcto!' : 'Incorrecto' }}</span>
          </div>
          <div class="toast-progress"
            :class="{ 'toast-progress-correct': resp_ok, 'toast-progress-incorrect': !resp_ok }"></div>
        </div>
      </transition>

      <!-- MODALES -->
      <vs-popup title="Ficha técnica" :active.sync="modalFicha">
        <div class="modal-content-plain">
          <div v-for="(value, key) in fichaData" :key="key" class="modal-row-plain">
            <strong>{{ key }}:</strong>
            <span v-html="value"></span>
          </div>
        </div>
      </vs-popup>

      <vs-popup title="Guardar calificación" :active.sync="modalCalificacion">
        <div class="modal-content text-center">
          <p>¿Deseas enviar esta calificación a tu docente?</p>
          <div class="modal-actions">
            <button class="btn-kahoot" @click="guardarCalificacion">Sí, enviar</button>
            <button class="btn-kahoot-secondary" @click="recargar">Reintentar</button>
          </div>
        </div>
      </vs-popup>

      <vs-popup title="Imagen" :active.sync="modalImagen">
        <div class="modal-content text-center">
          <img v-if="imagen_a_mostrar" :src="getImageUrl(imagen_a_mostrar)" class="modal-image">
        </div>
      </vs-popup>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      op_cl_game: 0,
      numero: 0,
      turno: 0,
      t_preguntas: 0,
      show: true,
      juega: true,
      resultados: false,
      preguntas: [],
      arr_resultados: [],
      selectedOptions: new Set(),
      icono_ok: false,
      resp_ok: false,
      resp_no: false,
      modalFicha: false,
      modalCalificacion: false,
      modalImagen: false,
      imagen_a_mostrar: '',
      t_comodin: 1,
      t_ctrl_comodin: 0,
      respuesta_correcta: '1',
      puntaje_total: 1000,
      num_incremento: 1,
      total_opciones: 0,
      contar_click: 0,
      total_calificacion: 0,
      codigo_curso: '',
      usuario: {},
      id_juego: '',
      letras: ['A', 'B', 'C', 'D'],
      ruta_images: 'archivos/images/imagenes_juegos/seleccionSimple/',
      msj_final: '',
      isMobile: window.innerWidth <= 768,
      isChangingQuestion: false
    }
  },

  computed: {
    fichaData() {
      const p = this.preguntas.length > 0 && this.preguntas[0] ? this.preguntas[0].pregunta || {} : {}
      return {
        'Bloque curricular': p.bloque_curricular || '',
        'Grado': p.grado || '',
        'Destrezas': p.destrezas || '',
        'Habilidades': p.habilidades || '',
        'Elaborado por': p.elaborado_por || '',
        'Intención didáctica': p.intencion_didactica || '',
        'Consigna': p.consigna || '',
        'Consideraciones': p.consideraciones || ''
      }
    }
  },

  created() {
    this.initGame()
    window.addEventListener('resize', this.handleResize)
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 768
    },

    reiniciarJuego() {
      window.location.reload()
    },

    tieneUnaRespuestaCorrecta() {
      const opciones = this.getOpcionesActuales()
      const correctas = opciones.filter(o => o.tipo_opcion == this.respuesta_correcta)
      return correctas.length === 1
    },

    initGame() {
      const usuarioStorage = localStorage.getItem('usuario')
      this.usuario = usuarioStorage ? JSON.parse(usuarioStorage) : {}

      const cursoData = localStorage.getItem('curso_juego')
      const curso = cursoData ? JSON.parse(cursoData) : {}
      this.codigo_curso = curso.codigo || '_'

      this.id_juego = this.$route.params.id
      this.getPreguntas()
    },

    getNombreJuego() {
      if (this.preguntas.length > 0 && this.preguntas[0] && this.preguntas[0].pregunta) {
        return this.preguntas[0].pregunta.nombre_juego || ''
      }
      return ''
    },

    getDescripcionJuego() {
      if (this.preguntas.length > this.turno &&
        this.preguntas[this.turno] &&
        this.preguntas[this.turno].pregunta) {
        return this.preguntas[this.turno].pregunta.descripcion_juego || ''
      }
      return ''
    },

    getPreguntaActual() {
      if (this.preguntas.length > this.turno &&
        this.preguntas[this.turno] &&
        this.preguntas[this.turno].pregunta) {
        return this.preguntas[this.turno].pregunta.pregunta || ''
      }
      return ''
    },

    getOpcionesActuales() {
      if (this.preguntas.length > this.turno && this.preguntas[this.turno]) {
        return this.preguntas[this.turno].opciones || []
      }
      return []
    },

    tieneImagenPregunta() {
      if (this.preguntas.length > this.turno &&
        this.preguntas[this.turno] &&
        this.preguntas[this.turno].pregunta) {
        return this.preguntas[this.turno].pregunta.imagen != null
      }
      return false
    },

    getImagenPregunta() {
      if (this.preguntas.length > this.turno &&
        this.preguntas[this.turno] &&
        this.preguntas[this.turno].pregunta) {
        return this.preguntas[this.turno].pregunta.imagen
      }
      return null
    },

    async getPreguntas() {
      this.$vs.loading()
      try {
        const res = await this.$http.get(this.$server_url + 'pregunta_opciones/' + this.id_juego)
        if (res.data && res.data.items) {
          this.preguntas = this.shuffleArray(res.data.items)
          this.t_preguntas = this.preguntas.length
          this.$nextTick(() => {
            this.contarOpciones()
          })
        }
        this.$vs.loading.close()
      } catch (error) {
        this.$vs.loading.close()
        console.error('Error cargando preguntas:', error)
      }
    },

    shuffleArray(array) {
      if (!array || !Array.isArray(array)) return []
      return [...array].sort(() => Math.random() - 0.5)
    },

    contarOpciones() {
      const opciones = this.getOpcionesActuales()
      this.total_opciones = opciones.filter(o => o.tipo_opcion == 1).length
      this.contar_click = 0
      this.selectedOptions.clear()

      if (this.preguntas.length > this.turno && this.preguntas[this.turno]) {
        this.preguntas[this.turno].opciones = this.shuffleArray(opciones)
      }
    },

    isSelected(id) {
      return this.selectedOptions.has(id)
    },

    getOpcion(item) {
      if (!this.juega || !item) return

      const isCorrect = item.tipo_opcion == this.respuesta_correcta
      const wasSelected = this.selectedOptions.has(item.id_opcion_contenido)

      if (!wasSelected) {
        this.selectedOptions.add(item.id_opcion_contenido)
        this.contar_click++

        this.icono_ok = true
        this.resp_ok = isCorrect
        this.resp_no = !isCorrect

        if (isCorrect) {
          this.incrementarPuntaje()
        }

        setTimeout(() => {
          this.icono_ok = false
        }, 1000)

        const preguntaActual = this.getPreguntaActual()
        this.arr_resultados.push({
          pregunta: preguntaActual,
          descripcion: item.nombre_opcion || '',
          respuesta: item.tipo_opcion
        })
      }

      if (this.contar_click === this.total_opciones && this.total_opciones > 0) {
        this.juega = false
        this.avanzarSiguiente()
      }
    },

    incrementarPuntaje() {
      const valorPregunta = this.puntaje_total / Math.max(this.t_preguntas, 1)
      const valorOpcion = this.total_opciones > 1 ? valorPregunta / this.total_opciones : valorPregunta

      let inc = 0
      const incrementar = () => {
        inc++
        if (inc < valorOpcion + this.num_incremento) {
          this.numero = Math.min(this.numero + 1, 1000)
          setTimeout(incrementar, 2)
        } else {
          this.total_calificacion = this.numero / 100
        }
      }
      incrementar()
    },

    avanzarSiguiente() {
      // Mostrar overlay de carga
      this.isChangingQuestion = true

      setTimeout(() => {
        this.show = false
        setTimeout(() => {
          this.turno++
          if (this.turno < this.t_preguntas) {
            this.$nextTick(() => {
              this.contarOpciones()
              this.show = true
              this.juega = true
              // Ocultar loader después de preparar los datos
              setTimeout(() => {
                this.isChangingQuestion = false
              }, 100)
            })
          } else {
            this.resultados = true
            this.modalCalificacion = true
            this.isChangingQuestion = false
          }
        }, 300)
      }, 1300)
    },

    f_comodin() {
      if (this.t_ctrl_comodin >= this.t_comodin) {
        this.$vs.notify({
          text: 'Ya has usado el comodín en este juego',
          color: 'warning'
        })
        return
      }

      const opcionesActuales = this.getOpcionesActuales()
      if (opcionesActuales.length <= 2) {
        this.$vs.notify({
          text: 'No hay suficientes opciones para usar el comodín',
          color: 'warning'
        })
        return
      }

      this.$vs.dialog({
        color: 'primary',
        title: 'Comodín 50/50',
        text: '¿Usar el comodín para reducir las opciones?',
        accept: this.ejecutarComodin
      })
    },

    ejecutarComodin() {
      this.t_ctrl_comodin++
      const opcionesActuales = this.getOpcionesActuales()
      const correcta = opcionesActuales.find(o => o.tipo_opcion == 1)
      const incorrectas = opcionesActuales.filter(o => o.tipo_opcion == 0)

      if (correcta && incorrectas.length > 0) {
        const nuevasOpciones = [
          correcta,
          ...this.shuffleArray(incorrectas).slice(0, 1)
        ]

        if (this.preguntas.length > this.turno && this.preguntas[this.turno]) {
          this.preguntas[this.turno].opciones = nuevasOpciones
        }
      }
    },

    mostrarImagen(imagen) {
      if (imagen) {
        this.imagen_a_mostrar = imagen
        this.modalImagen = true
      }
    },

    async guardarCalificacion() {
      this.modalCalificacion = false
      this.$vs.loading()

      try {
        const formData = new FormData()
        formData.append('id_juego', this.id_juego || '')
        formData.append('codigo_curso', this.codigo_curso || '')
        formData.append('id_usuario', this.usuario.idusuario || '')
        formData.append('calificacion', Math.min(this.total_calificacion, 10).toString())

        await this.$http.post(this.$server_url + 'j_guardar_calificacion', formData)

        this.$vs.notify({
          text: 'Calificación enviada correctamente',
          color: 'success'
        })
        this.msj_final = 'Calificación enviada a tu docente'
      } catch (error) {
        console.error('Error guardando calificación:', error)
        this.$vs.notify({
          text: 'Error al enviar la calificación',
          color: 'danger'
        })
      }

      this.$vs.loading.close()
    },

    toggleTheme() {
      this.op_cl_game = this.op_cl_game === 0 ? 1 : 0
    },

    getImageUrl(image) {
      if (!image) return ''
      return this.$data_url + this.ruta_images + image
    },

    recargar() {
      window.location.reload()
    }
  }
}
</script>

<style scoped>
/* =====================================================
   OVERRIDE VUEXY - FUERZA ESTILOS CON !IMPORTANT
===================================================== */
.game-wrapper *,
.game-container *,
.game-header *,
.game-card *,
.results-card * {
  all: revert;
}

/* Forzar que nuestros estilos tengan prioridad */
.game-wrapper {
  min-height: 100vh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: linear-gradient(145deg, #46178f 0%, #2c0e5c 100%) !important;
  font-family: 'Poppins', -apple-system, sans-serif !important;
  padding: 16px !important;
  position: relative !important;
  overflow: hidden !important;
}

.game-wrapper::before {
  content: '' !important;
  position: absolute !important;
  width: 200% !important;
  height: 200% !important;
  background: repeating-linear-gradient(45deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 20px,
      rgba(255, 255, 255, 0.05) 20px,
      rgba(255, 255, 255, 0.05) 40px) !important;
  animation: bgMove 20s linear infinite !important;
}

@keyframes bgMove {
  0% {
    transform: translate(-10%, -10%) rotate(0deg);
  }

  100% {
    transform: translate(10%, 10%) rotate(5deg);
  }
}

/* =====================================================
   CONTAINER SIZES
===================================================== */
.game-container {
  width: 100% !important;
  transition: all 0.3s ease !important;
  z-index: 10 !important;
  position: relative !important;
}

.container-sm {
  max-width: 100% !important;
}

.container-md {
  max-width: 900px !important;
  margin: 0 auto !important;
}

/* =====================================================
   HEADER
===================================================== */
.game-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 20px !important;
  position: relative !important;
  z-index: 10 !important;
}

/* .icon-btn {
  width: 48px !important;
  height: 48px !important;
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.icon-btn:hover {
  transform: scale(1.1) rotate(5deg) !important;
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: white !important;
}

.icon-btn svg {
  width: 24px !important;
  height: 24px !important;
  stroke: white !important;
} */

.game-brand {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px) !important;
  padding: 8px 20px 8px 12px !important;
  border-radius: 40px !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  animation: brandFloat 3s ease-in-out infinite !important;
}

@keyframes brandFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

.brand-logo {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #ffb700, #f15a23) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3) !important;
}

.brand-logo svg {
  width: 28px !important;
  height: 28px !important;
  stroke: white !important;
}

.brand-text {
  font-weight: 800 !important;
  color: white !important;
  font-size: 1.2rem !important;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2) !important;
  letter-spacing: -0.5px !important;
}

.header-actions {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.question-pill {
  background: #ffb700 !important;
  padding: 8px 16px !important;
  border-radius: 40px !important;
  color: #2c0e5c !important;
  font-weight: 800 !important;
  border: 3px solid white !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2) !important;
}

.pill-number {
  font-size: 1.3rem !important;
}

.pill-total {
  font-size: 0.9rem !important;
  opacity: 0.8 !important;
}

/* =====================================================
   PROGRESS BAR
===================================================== */
.progress-section {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  margin-bottom: 25px !important;
  position: relative !important;
  z-index: 10 !important;
}

.progress-track {
  flex: 1 !important;
  height: 20px !important;
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 30px !important;
  border: 3px solid white !important;
  overflow: hidden !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2) !important;
}

.progress-fill {
  height: 100% !important;
  background: linear-gradient(90deg, #26890c, #ffb700) !important;
  border-radius: 30px !important;
  transition: width 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  position: relative !important;
  overflow: hidden !important;
}

.progress-pulse {
  animation: progressPulse 1s ease infinite !important;
}

@keyframes progressPulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

.progress-fill::after {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%) !important;
  animation: shine 2s infinite !important;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.points-badge {
  background: linear-gradient(135deg, #ffb700, #f15a23) !important;
  padding: 10px 20px !important;
  border-radius: 40px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  color: #2c0e5c !important;
  font-weight: 800 !important;
  border: 3px solid white !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2) !important;
  transition: all 0.2s ease !important;
}

.points-pop {
  animation: pointsPop 0.3s ease !important;
}

@keyframes pointsPop {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.points-icon {
  font-size: 1.3rem !important;
}

.points-value {
  font-size: 1.3rem !important;
}

/* =====================================================
   TARJETA PRINCIPAL
===================================================== */
.game-card {
  background: white !important;
  border-radius: 40px 40px 40px 40px !important;
  padding: 30px !important;
  position: relative !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
  border: 4px solid white !important;
  animation: cardAppear 0.5s ease !important;
  z-index: 20 !important;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-shake {
  animation: shake 0.3s ease !important;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-10px);
  }

  40% {
    transform: translateX(10px);
  }

  60% {
    transform: translateX(-5px);
  }

  80% {
    transform: translateX(5px);
  }
}

.card-strip {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 15px !important;
  background: linear-gradient(90deg,
      #e21b3c 0%,
      #1368ce 25%,
      #ffb700 50%,
      #26890c 75%,
      #7e3c9c 100%) !important;
  border-radius: 40px 40px 0 0 !important;
}

/* DESCRIPCIÓN */
.game-description-card {
  background: linear-gradient(135deg, #7e3c9c, #1368ce) !important;
  border-radius: 30px !important;
  padding: 18px 25px !important;
  margin-bottom: 25px !important;
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  border: 3px solid white !important;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-5px) !important;
}

.desc-icon {
  font-size: 2rem !important;
  animation: iconWiggle 2s infinite !important;
}

@keyframes iconWiggle {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(10deg);
  }

  75% {
    transform: rotate(-10deg);
  }
}

.game-desc-text {
  margin: 0 !important;
  color: white !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2) !important;
}

/* CONTENEDOR CON OVERLAY */
.content-container {
  position: relative !important;
  min-height: 300px !important;
}

.content-container.loading {
  opacity: 0.7 !important;
}

.loader-overlay {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(3px) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 30 !important;
  border-radius: 20px !important;
}

.loader-spinner {
  width: 50px !important;
  height: 50px !important;
  border: 5px solid #f3f3f3 !important;
  border-top: 5px solid #7e3c9c !important;
  border-radius: 50% !important;
  animation: spin 1s linear infinite !important;
  margin-bottom: 20px !important;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* PREGUNTA */
.question-container {
  margin-bottom: 25px !important;
}

.question-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: #e21b3c !important;
  color: white !important;
  padding: 8px 20px !important;
  border-radius: 40px !important;
  font-weight: 800 !important;
  margin-bottom: 15px !important;
  border: 3px solid white !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2) !important;
}

.badge-icon {
  font-size: 1.2rem !important;
}

.question-text {
  font-size: 1.6rem !important;
  font-weight: 800 !important;
  color: #2c0e5c !important;
  margin: 0 !important;
  line-height: 1.4 !important;
  text-shadow: 2px 2px 0 rgba(255, 255, 255, 0.5) !important;
}

/* OPCIONES SOBRIAS */
.options-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 15px !important;
  margin-bottom: 25px !important;
}

.option-card-sober {
  background: white !important;
  border-radius: 20px !important;
  padding: 20px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  border: 2px solid #e5e7eb !important;
  box-shadow: 0 8px 0 #d1d5db, 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  position: relative !important;
  overflow: hidden !important;
  animation: optionAppear 0.3s ease !important;
}

@keyframes optionAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-card-sober:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 13px 0 #d1d5db, 0 15px 30px rgba(0, 0, 0, 0.15) !important;
  border-color: #9ca3af !important;
}

.option-card-sober:active {
  transform: translateY(3px) !important;
  box-shadow: 0 5px 0 #d1d5db, 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

.option-selected {
  transform: scale(0.98) !important;
}

.option-selected-highlight {
  border: 3px solid #7e3c9c !important;
  box-shadow: 0 0 0 4px rgba(126, 60, 156, 0.3), 0 5px 0 #d1d5db !important;
  background: #faf5ff !important;
}

.option-correct-sober {
  border: 3px solid #10b981 !important;
  background: #f0fdf4 !important;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2), 0 5px 0 #d1d5db !important;
}

.option-wrong-sober {
  border: 3px solid #ef4444 !important;
  background: #fef2f2 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2), 0 5px 0 #d1d5db !important;
}

.option-content-sober {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  color: #1f2937 !important;
}

.option-letter-sober {
  width: 45px !important;
  height: 45px !important;
  border-radius: 15px !important;
  background: #f3f4f6 !important;
  border: 2px solid #e5e7eb !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 900 !important;
  font-size: 1.5rem !important;
  color: #4b5563 !important;
}

.option-main-sober {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  flex: 1 !important;
}

.option-text-sober {
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  color: #1f2937 !important;
}

.option-check-sober {
  width: 40px !important;
  height: 40px !important;
  border-radius: 20px !important;
  background: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 4px 0 #d1d5db !important;
}

/* ANIMACIONES PARA LAS OPCIONES */
.options-stagger-enter-active {
  animation: optionsEnter 0.5s ease;
}

.options-stagger-leave-active {
  animation: optionsLeave 0.5s ease;
}

@keyframes optionsEnter {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes optionsLeave {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-30px);
  }
}

/* IMAGEN */
.question-image-wrapper {
  position: relative !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  cursor: pointer !important;
  border: 2px solid #e5e7eb !important;
  box-shadow: 0 8px 0 #d1d5db, 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  margin-top: 10px !important;
}

.question-image-wrapper img {
  width: 100% !important;
  height: 200px !important;
  object-fit: cover !important;
  transition: transform 0.3s ease !important;
  display: block !important;
}

.image-overlay {
  position: absolute !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
}

.zoom-icon {
  width: 60px !important;
  height: 60px !important;
  border-radius: 30px !important;
  background: rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(5px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transform: scale(0) !important;
  transition: transform 0.3s ease !important;
}

.question-image-wrapper:hover .image-overlay {
  opacity: 1 !important;
}

.question-image-wrapper:hover .zoom-icon {
  transform: scale(1) !important;
}

.question-image-wrapper:hover img {
  transform: scale(1.1) !important;
}

/* COMODÍN */
.comodin-button {
  position: fixed !important;
  bottom: 30px !important;
  right: 30px !important;
  background: linear-gradient(135deg, #7e3c9c, #da1c5c) !important;
  color: white !important;
  border: none !important;
  padding: 15px 30px !important;
  border-radius: 50px !important;
  font-weight: 800 !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  border: 4px solid white !important;
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.3) !important;
  z-index: 100 !important;
  overflow: hidden !important;
}

.comodin-button:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 15px 0 rgba(0, 0, 0, 0.3) !important;
}

.comodin-button:active {
  transform: translateY(5px) !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.3) !important;
}

.comodin-icon {
  font-size: 1.5rem !important;
  animation: diceRoll 2s infinite !important;
}

@keyframes diceRoll {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }
}

.comodin-text {
  font-size: 1.1rem !important;
  position: relative !important;
  z-index: 2 !important;
}

.comodin-glow {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
  animation: glowMove 2s infinite !important;
}

@keyframes glowMove {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* RESULTADOS */
.results-card {
  background: white !important;
  border-radius: 40px !important;
  padding: 35px !important;
  border: 4px solid white !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
  position: relative !important;
  overflow: hidden !important;
  animation: resultsAppear 0.5s ease !important;
}

@keyframes resultsAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.confetti {
  position: absolute !important;
  top: -20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  font-size: 4rem !important;
  animation: confettiFall 2s ease infinite !important;
}

@keyframes confettiFall {

  0%,
  100% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }

  50% {
    transform: translateX(-50%) translateY(20px) rotate(10deg);
  }
}

.results-title {
  font-size: 2.5rem !important;
  font-weight: 900 !important;
  text-align: center !important;
  margin: 0 0 25px 0 !important;
  background: linear-gradient(135deg, #e21b3c, #7e3c9c) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8) !important;
}

.results-score-circle {
  display: flex !important;
  justify-content: center !important;
  margin-bottom: 35px !important;
}

.score-animated {
  width: 150px !important;
  height: 150px !important;
  border-radius: 75px !important;
  background: linear-gradient(135deg, #ffb700, #f15a23) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  border: 6px solid white !important;
  box-shadow: 0 15px 0 rgba(0, 0, 0, 0.2) !important;
  animation: scorePop 1s ease !important;
}

@keyframes scorePop {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.score-number {
  font-size: 3.5rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
}

.score-max {
  font-size: 1.3rem !important;
  opacity: 0.9 !important;
}

.results-list {
  max-height: 350px !important;
  overflow-y: auto !important;
  margin-bottom: 30px !important;
  padding-right: 10px !important;
}

.result-item {
  display: flex !important;
  gap: 15px !important;
  padding: 15px !important;
  background: red !important;
  border-radius: 20px !important;
  margin-bottom: 10px !important;
  border: 3px solid white !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.1) !important;
  animation: slideInRight 0.3s ease forwards !important;
  opacity: 0 !important;
  transform: translateX(20px) !important;
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.result-icon {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 900 !important;
  font-size: 1.3rem !important;
  color: white !important;
  border: 2px solid white !important;
}

.result-correct {
  background: #10b981 !important;
}

.result-incorrect {
  background: #ef4444 !important;
}

.result-content {
  flex: 1 !important;
}

.result-question {
  font-weight: 700 !important;
  color: #2c0e5c !important;
  margin-bottom: 5px !important;
  font-size: 0.95rem !important;
}

.result-answer {
  color: #666 !important;
  font-size: 0.9rem !important;
}

.no-results {
  text-align: center !important;
  padding: 30px !important;
  color: #666 !important;
  font-style: italic !important;
}

/* BOTONES */
.btn-kahoot {
  background: linear-gradient(135deg, #7e3c9c, #1368ce) !important;
  color: white !important;
  border: none !important;
  padding: 18px 35px !important;
  border-radius: 50px !important;
  font-size: 1.2rem !important;
  font-weight: 800 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 12px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  width: 100% !important;
  border: 4px solid white !important;
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.2) !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
}

.btn-kahoot:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 15px 0 rgba(0, 0, 0, 0.2) !important;
}

.btn-kahoot:active {
  transform: translateY(5px) !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2) !important;
}

.btn-kahoot-secondary {
  background: linear-gradient(135deg, #e21b3c, #f15a23) !important;
  color: white !important;
  border: none !important;
  padding: 18px 35px !important;
  border-radius: 50px !important;
  font-size: 1.2rem !important;
  font-weight: 800 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 12px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  border: 4px solid white !important;
  box-shadow: 0 10px 0 rgba(0, 0, 0, 0.2) !important;
}

.btn-kahoot-secondary:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 15px 0 rgba(0, 0, 0, 0.2) !important;
}

.btn-kahoot-secondary:active {
  transform: translateY(5px) !important;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2) !important;
}

/* TOAST NOTIFICATION */
.kahoot-toast {
  position: fixed !important;
  top: 30% !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  border-radius: 60px !important;
  overflow: hidden !important;
  z-index: 1000 !important;
  border: 4px solid white !important;
  box-shadow: 0 15px 0 rgba(0, 0, 0, 0.3) !important;
  animation: toastAppear 0.3s ease !important;
}

@keyframes toastAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-correct {
  background: linear-gradient(135deg, #10b981, #059669) !important;
}

.toast-incorrect {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
}

.toast-content {
  padding: 20px 50px !important;
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  color: white !important;
}

.toast-icon {
  font-size: 2rem !important;
}

.toast-text {
  font-size: 1.5rem !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 2px !important;
}

.toast-progress {
  height: 6px !important;
  width: 100% !important;
  animation: progressShrink 1s linear !important;
}

.toast-progress-correct {
  background: #059669 !important;
}

.toast-progress-incorrect {
  background: #dc2626 !important;
}

@keyframes progressShrink {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

/* MODALES - VERSIÓN PLANA */
.modal-content-plain {
  padding: 25px !important;
}

.modal-row-plain {
  margin-bottom: 15px !important;
  padding: 10px 0 !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.modal-row-plain strong {
  display: block !important;
  color: #7e3c9c !important;
  margin-bottom: 5px !important;
  font-size: 0.9rem !important;
  text-transform: uppercase !important;
}

.modal-row-plain span {
  color: #333 !important;
  line-height: 1.5 !important;
}

.modal-actions {
  display: flex !important;
  gap: 15px !important;
  margin-top: 25px !important;
}

.modal-actions button {
  flex: 1 !important;
  padding: 15px !important;
}

.modal-image {
  max-width: 100% !important;
  max-height: 70vh !important;
  border-radius: 20px !important;
  border: 2px solid #e5e7eb !important;
  box-shadow: 0 8px 0 #d1d5db, 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.text-center {
  text-align: center !important;
}

/* ANIMACIONES */
.bounce-in-enter-active {
  animation: bounceIn 0.5s !important;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.explode-enter-active {
  animation: explodeIn 0.3s !important;
}

.explode-leave-active {
  animation: explodeOut 0.3s !important;
}

@keyframes explodeIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.1);
  }

  50% {
    transform: translateX(-50%) scale(1.2);
  }

  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

@keyframes explodeOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) scale(0.1);
  }
}

/* =====================================================
   RESPONSIVE
===================================================== */
@media (max-width: 768px) {
  .game-wrapper {
    padding: 10px !important;
  }

  .options-grid {
    grid-template-columns: 1fr !important;
  }

  .question-text {
    font-size: 1.3rem !important;
  }

  .option-card-sober {
    padding: 15px !important;
  }

  .comodin-button {
    bottom: 20px !important;
    right: 20px !important;
    padding: 12px 25px !important;
  }

  .comodin-text {
    font-size: 1rem !important;
  }

  .results-title {
    font-size: 2rem !important;
  }

  .score-animated {
    width: 120px !important;
    height: 120px !important;
  }

  .score-number {
    font-size: 2.8rem !important;
  }
}

@media (max-width: 480px) {
  .game-header {
    margin-bottom: 15px !important;
  }

  .brand-text {
    font-size: 1rem !important;
  }

  .question-pill {
    padding: 5px 12px !important;
  }

  .points-badge {
    padding: 8px 15px !important;
  }

  .game-card {
    padding: 20px !important;
  }

  .toast-content {
    padding: 15px 30px !important;
  }

  .toast-text {
    font-size: 1.2rem !important;
  }

  .btn-kahoot,
  .btn-kahoot-secondary {
    padding: 15px 25px !important;
    font-size: 1rem !important;
  }
}
</style>
