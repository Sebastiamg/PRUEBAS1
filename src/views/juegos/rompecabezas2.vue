<template>
  <div class="puzzle-game-wrapper">
    <!-- Pantalla de juego principal -->
    <div v-if="!juegoTerminado" class="game-screen" :style="gameBackground">
      <!-- Header del juego -->
      <div class="game-header" :style="headerGradient">
        <div class="header-content">
          <div class="game-title">
            <div class="title-icon">
              <i class="feather icon-grid"></i>
            </div>
            <h2 class="elegant-title">{{ titulo }}</h2>
          </div>
          <div class="game-stats">
            <div class="timer-display" :class="{ 'timer-critical': tiempoCritico }">
              <i class="feather icon-clock"></i>
              <span class="timer-value">{{ tiempoRestante }}</span>
            </div>
            <div class="score-display">
              <span class="score-label">Movimientos</span>
              <span class="score-value">{{ movimientos }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de control superiores -->
      <div class="top-controls">
        <button class="ficha-button" @click="modalFicha = true">
          <i class="feather icon-file-text"></i>
          <span>Ficha técnica</span>
        </button>
        <button class="reset-button-small" @click="reiniciarTodo">
          <i class="feather icon-rotate-cw"></i>
        </button>
      </div>

      <!-- Contenido del juego -->
      <div class="game-content">
        <!-- Selector de imagen -->
        <div v-if="!juegoIniciado" class="setup-section">
          <h3 class="section-title">
            <i class="feather icon-image"></i>
            Elige una imagen
          </h3>

          <div class="image-selector">
            <div v-for="(img, index) in imagenesDisponibles" :key="index"
                 class="image-option"
                 :class="{ 'selected': imagenSeleccionada === img.imagen }"
                 @click="seleccionarImagen(img.imagen, img.descripcion)">
              <img :src="getImageUrl(img.imagen)" :alt="img.descripcion" loading="lazy">
              <div class="image-overlay">
                <i class="feather icon-check"></i>
              </div>
              <figcaption class="image-caption">{{ img.descripcion }}</figcaption>
            </div>
          </div>

          <h3 class="section-title mt-4">
            <i class="feather icon-layers"></i>
            Nivel de dificultad
          </h3>

          <div class="difficulty-selector">
            <button v-for="(opt, idx) in opcionesDificultad" :key="idx"
                    class="difficulty-btn"
                    :class="{
                      'selected': piezasSeleccionadas === opt.piezas,
                      'easy': opt.nivel === 'Fácil',
                      'medium': opt.nivel === 'Medio',
                      'hard': opt.nivel === 'Difícil'
                    }"
                    @click="seleccionarDificultad(opt)">
              <span class="difficulty-name">{{ opt.nivel }}</span>
              <span class="difficulty-pieces">{{ opt.piezas }} piezas</span>
            </button>
          </div>

          <button class="start-button" @click="iniciarJuego" :disabled="!imagenSeleccionada || !piezasSeleccionadas">
            <i class="feather icon-play"></i>
            ¡Comenzar!
          </button>
        </div>

        <!-- Área del puzzle -->
        <div v-else class="puzzle-section">
          <div class="puzzle-container">
            <!-- Área del puzzle a armar -->
            <div class="puzzle-board">
              <h4 class="board-title">
                <i class="feather icon-target"></i>
                Arma el puzzle
              </h4>
              <div class="board-grid" :style="boardGridStyle">
                <div v-for="(pieza, index) in tablero" :key="index"
                     class="board-cell"
                     :class="{ 'empty': !pieza, 'correct': piezaCorrecta(index) }"
                     :id="'pos_' + (index + 1)"
                     :style="pieza ? pieza.style : {}"
                     @click="colocarPieza(index)">
                  <span v-if="!pieza" class="empty-number">{{ index + 1 }}</span>
                </div>
              </div>
            </div>

            <!-- Área de piezas disponibles -->
            <div class="pieces-area">
              <h4 class="pieces-title">
                <i class="feather icon-layers"></i>
                Piezas para armar
              </h4>
              <div class="pieces-info">
                <p>Selecciona una pieza y luego su posición</p>
              </div>
            </div>
          </div>

          <!-- Estadísticas del juego -->
          <div class="puzzle-stats">
            <div class="stat-card">
              <i class="feather icon-move"></i>
              <span class="stat-label">Movimientos</span>
              <span class="stat-value">{{ movimientos }}</span>
            </div>
            <div class="stat-card">
              <i class="feather icon-check-circle"></i>
              <span class="stat-label">Progreso</span>
              <span class="stat-value">{{ progreso }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback visual -->
      <transition name="pop">
        <div v-if="mostrarFeedback" class="feedback-message" :class="feedbackTipo">
          <i :class="feedbackIcono"></i>
          <span>{{ feedbackTexto }}</span>
        </div>
      </transition>
    </div>

    <!-- Pantalla de resultados -->
    <div v-else class="results-screen">
      <div class="results-card">
        <div class="results-icon victory">
          <i class="feather icon-award"></i>
        </div>
        <h2 class="results-title">¡Puzzle completado!</h2>

        <div class="results-stats">
          <div class="stat-item">
            <span class="stat-label">Tiempo utilizado</span>
            <span class="stat-value">{{ tiempoUtilizado }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Movimientos</span>
            <span class="stat-value">{{ movimientos }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Puntaje final</span>
            <span class="stat-value final">{{ calcularPuntaje() }}</span>
          </div>
        </div>

        <div class="results-actions">
          <button class="action-button primary" @click="guardarResultado">
            <i class="feather icon-save"></i>
            Guardar
          </button>
          <button class="action-button secondary" @click="reiniciarTodo">
            <i class="feather icon-rotate-cw"></i>
            Jugar de nuevo
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <vs-popup title="Ficha técnica" :active.sync="modalFicha" class="ficha-modal">
      <div class="ficha-content" v-if="infoJuego">
        <div class="ficha-section" v-if="infoJuego.bloque_curricular">
          <span class="ficha-label">Bloque curricular</span>
          <p class="ficha-value">{{ infoJuego.bloque_curricular }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego.grado">
          <span class="ficha-label">Grado</span>
          <p class="ficha-value">{{ infoJuego.grado }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego.destrezas">
          <span class="ficha-label">Destrezas</span>
          <p class="ficha-value">{{ infoJuego.destrezas }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego.habilidades">
          <span class="ficha-label">Habilidades</span>
          <p class="ficha-value">{{ infoJuego.habilidades }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego.elaborado_por">
          <span class="ficha-label">Elaborado por</span>
          <p class="ficha-value">{{ infoJuego.elaborado_por }}</p>
        </div>
      </div>
    </vs-popup>

    <vs-popup title="Guardar resultado" :active.sync="modalGuardar" class="guardar-modal">
      <div class="guardar-content">
        <i class="feather icon-award"></i>
        <h3>¿Guardar tu puntaje?</h3>
        <p>Tu progreso será registrado</p>
        <div class="guardar-actions">
          <button class="btn-confirm" @click="confirmarGuardado">
            <i class="feather icon-check"></i>
            Sí, guardar
          </button>
          <button class="btn-cancel" @click="modalGuardar = false">
            <i class="feather icon-x"></i>
            Cancelar
          </button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  components: {
    'v-select': vSelect
  },
  data() {
    return {
      // Datos del juego
      id_juego: '',
      infoJuego: {},
      titulo: 'Rompecabezas Infantil',

      // Imágenes disponibles
      imagenesDisponibles: [],
      imagenSeleccionada: '',
      descripcionImagen: '',

      // Opciones de dificultad
      opcionesDificultad: [
        { nivel: 'Fácil', piezas: 9, tamano: 3 },
        { nivel: 'Medio', piezas: 16, tamano: 4 },
        { nivel: 'Difícil', piezas: 25, tamano: 5 }
      ],
      piezasSeleccionadas: 0,
      tamanoGrid: 0,

      // Estado del juego
      juegoIniciado: false,
      juegoTerminado: false,

      // Datos del puzzle
      arrPosicionesOriginales: [],
      arrPosicionesActuales: [],
      tablero: [],
      piezaSeleccionada: null,
      idSeleccionado: '',
      posSeleccionada: '',

      // Estadísticas
      movimientos: 0,

      // Tiempo
      tiempoRestante: '00:00',
      tiempoTotal: 300,
      temporizador: null,
      tiempoCritico: false,
      tiempoInicio: null,

      // Feedback
      mostrarFeedback: false,
      feedbackTipo: '',
      feedbackIcono: '',
      feedbackTexto: '',

      // Modales
      modalFicha: false,
      modalGuardar: false,

      // Usuario
      usuario: {},
      codigo_curso: '',
      previsualizar: ''
    }
  },
  computed: {
    gameBackground() {
      return {
        background: 'linear-gradient(135deg, #FF6B4A 0%, #FF8A5C 50%, #FF6B4A 100%)'
      }
    },
    headerGradient() {
      return {
        background: 'linear-gradient(90deg, #5E2A7C, #8A4FFF, #5E2A7C)',
        borderBottom: '4px solid #FFD93D'
      }
    },
    boardGridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.tamanoGrid}, 1fr)`,
        gridTemplateRows: `repeat(${this.tamanoGrid}, 1fr)`
      }
    },
    progreso() {
      if (!this.arrPosicionesOriginales.length) return 0;
      let correctas = 0;
      for (let i = 0; i < this.arrPosicionesOriginales.length; i++) {
        if (this.arrPosicionesOriginales[i] === this.arrPosicionesActuales[i]) {
          correctas++;
        }
      }
      return Math.round((correctas / this.arrPosicionesOriginales.length) * 100);
    },
    tiempoUtilizado() {
      if (!this.tiempoInicio) return '00:00';
      const segundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);
      const mins = Math.floor(segundos / 60);
      const secs = segundos % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  },
  created() {
    let me = this;
    me.id_juego = me.$route.params.id;
    me.previsualizar = me.$route.params.codigo;

    let data_juego = JSON.parse(localStorage.getItem('curso_juego'));
    if (data_juego) {
      me.codigo_curso = data_juego.codigo;
    }

    me.usuario = JSON.parse(localStorage.getItem('usuario'));
    me.obtenerImagenes();
  },
  beforeDestroy() {
    if (this.temporizador) {
      clearInterval(this.temporizador);
    }
  },
  methods: {
    getImageUrl(imageName) {
      return `${this.$data_url}archivos/images/imagenes_juegos/rompecabezas/${imageName}`;
    },

    obtenerImagenes() {
      let me = this;
      me.$vs.loading();

      this.$http.get(this.$server_url + 'get_rompecabezas/' + me.id_juego)
        .then(res => {
          console.log('Datos recibidos:', res.data);
          me.imagenesDisponibles = res.data;
          me.infoJuego = res.data[0] || {};
          me.titulo = me.infoJuego.nombre_juego || 'Rompecabezas Infantil';
          me.$vs.loading.close();
        })
        .catch(error => {
          console.log(error);
          me.$vs.notify({
            text: 'Error al cargar las imágenes',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
          me.$vs.loading.close();
        });
    },

    seleccionarImagen(imagen, descripcion) {
      this.imagenSeleccionada = imagen;
      this.descripcionImagen = descripcion;
    },

    seleccionarDificultad(opcion) {
      this.piezasSeleccionadas = opcion.piezas;
      this.tamanoGrid = opcion.tamano;
    },

    iniciarJuego() {
      this.generarPuzzle();
      this.juegoIniciado = true;
      this.tiempoInicio = Date.now();
      this.iniciarTemporizador();

      this.$vs.notify({
        text: '¡A armar el rompecabezas!',
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-play'
      });
    },

    generarPuzzle() {
      this.arrPosicionesOriginales = [];
      this.arrPosicionesActuales = [];
      this.tablero = [];
      this.movimientos = 0;

      const tamanoImg = 600;
      const posImg = tamanoImg / this.tamanoGrid;

      // Generar posiciones originales
      for (let fila = 0; fila < this.tamanoGrid; fila++) {
        for (let col = 0; col < this.tamanoGrid; col++) {
          const posX = Math.round((col * posImg) * -1);
          const posY = Math.round((fila * posImg) * -1);
          const posicion = `${posX}px ${posY}px`;
          this.arrPosicionesOriginales.push(posicion);
        }
      }

      // Crear tablero con posiciones mezcladas
      this.arrPosicionesActuales = this.mezclarArray([...this.arrPosicionesOriginales]);

      for (let i = 0; i < this.piezasSeleccionadas; i++) {
        this.tablero.push({
          posicionOriginal: this.arrPosicionesOriginales[i],
          posicionActual: this.arrPosicionesActuales[i],
          style: {
            background: `url(${this.getImageUrl(this.imagenSeleccionada)})`,
            backgroundPosition: this.arrPosicionesActuales[i],
            backgroundSize: `${tamanoImg}px ${tamanoImg}px`
          }
        });
      }
    },

    mezclarArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    colocarPieza(index) {
      if (!this.piezaSeleccionada) {
        // Seleccionar pieza
        this.piezaSeleccionada = {
          posicion: this.tablero[index].posicionActual,
          index: index
        };
        this.idSeleccionado = 'pos_' + (index + 1);

        // Resaltar visualmente
        this.$nextTick(() => {
          const elemento = document.getElementById(this.idSeleccionado);
          if (elemento) {
            elemento.style.boxShadow = '0 0 20px #FFD93D';
          }
        });

        this.mostrarFeedbackTemporal('info', 'feather icon-hand', 'Pieza seleccionada');
      } else {
        // Intercambiar piezas
        if (this.piezaSeleccionada.index !== index) {
          // Intercambiar posiciones
          const tempPos = this.tablero[this.piezaSeleccionada.index].posicionActual;
          this.tablero[this.piezaSeleccionada.index].posicionActual = this.tablero[index].posicionActual;
          this.tablero[index].posicionActual = tempPos;

          // Actualizar estilos
          this.tablero[this.piezaSeleccionada.index].style.backgroundPosition = this.tablero[this.piezaSeleccionada.index].posicionActual;
          this.tablero[index].style.backgroundPosition = this.tablero[index].posicionActual;

          this.movimientos++;

          // Quitar resaltado
          const elemento = document.getElementById(this.idSeleccionado);
          if (elemento) {
            elemento.style.boxShadow = '';
          }

          this.piezaSeleccionada = null;
          this.idSeleccionado = '';

          // Verificar si completó el puzzle
          this.verificarCompletado();
        } else {
          // Misma pieza, deseleccionar
          const elemento = document.getElementById(this.idSeleccionado);
          if (elemento) {
            elemento.style.boxShadow = '';
          }
          this.piezaSeleccionada = null;
          this.idSeleccionado = '';
        }
      }
    },

    verificarCompletado() {
      let completado = true;
      for (let i = 0; i < this.tablero.length; i++) {
        if (this.tablero[i].posicionActual !== this.arrPosicionesOriginales[i]) {
          completado = false;
          break;
        }
      }

      if (completado) {
        setTimeout(() => {
          this.finalizarJuego();
        }, 500);
      }
    },

    piezaCorrecta(index) {
      return this.tablero[index] && this.tablero[index].posicionActual === this.arrPosicionesOriginales[index];
    },

    mostrarFeedbackTemporal(tipo, icono, texto) {
      this.feedbackTipo = tipo;
      this.feedbackIcono = icono;
      this.feedbackTexto = texto;
      this.mostrarFeedback = true;

      setTimeout(() => {
        this.mostrarFeedback = false;
      }, 1500);
    },

    iniciarTemporizador() {
      let me = this;
      let segundos = me.tiempoTotal;

      me.temporizador = setInterval(() => {
        if (segundos > 0) {
          segundos--;
          let mins = Math.floor(segundos / 60);
          let secs = segundos % 60;
          me.tiempoRestante = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          me.tiempoCritico = segundos < 30;

          if (segundos <= 0) {
            clearInterval(me.temporizador);
            me.finalizarJuego();
          }
        }
      }, 1000);
    },

    finalizarJuego() {
      if (this.temporizador) {
        clearInterval(this.temporizador);
      }
      this.juegoTerminado = true;
    },

    reiniciarTodo() {
      this.juegoTerminado = false;
      this.juegoIniciado = false;
      this.imagenSeleccionada = '';
      this.piezasSeleccionadas = 0;
      this.movimientos = 0;
      this.tiempoCritico = false;
      this.tiempoRestante = '00:00';
      this.piezaSeleccionada = null;
      this.idSeleccionado = '';

      if (this.temporizador) {
        clearInterval(this.temporizador);
      }
    },

    calcularPuntaje() {
      const piezas = this.piezasSeleccionadas || 9;
      const puntajeBase = piezas * 10;
      const bonusTiempo = this.tiempoCritico ? 0 : 50;
      const penalizacionMovimientos = Math.max(0, this.movimientos - piezas);
      return Math.max(0, puntajeBase + bonusTiempo - penalizacionMovimientos);
    },

    guardarResultado() {
      this.modalGuardar = true;
    },

    confirmarGuardado() {
      let me = this;

      if (!me.usuario || !me.usuario.idusuario) {
        me.$vs.notify({
          text: 'Error: No se pudo identificar al usuario',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return;
      }

      me.modalGuardar = false;
      me.$vs.loading();

      const puntaje = me.calcularPuntaje();
      const calificacion = parseFloat(me.piezasSeleccionadas + '.' + me.movimientos);

      let formData = new FormData();
      formData.append('id_juego', me.id_juego || '');
      formData.append('codigo_curso', me.codigo_curso || '');
      formData.append('id_usuario', me.usuario.idusuario);
      formData.append('calificacion', calificacion);

      this.$http.post(this.$server_url + 'j_guardar_calificacion', formData)
        .then(res => {
          me.$vs.notify({
            text: 'Resultado guardado correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
          me.$vs.loading.close();
        })
        .catch(error => {
          console.log(error);
          me.$vs.notify({
            text: 'Error al guardar el resultado',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
          me.$vs.loading.close();
        });
    }
  }
}
</script>

<style scoped>
/* Importar fuentes */
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Quicksand:wght@400;600;700&display=swap');

.puzzle-game-wrapper {
  min-height: 100vh;
  position: relative;
  font-family: 'Quicksand', sans-serif;
}

/* Tipografía infantil */
.elegant-title {
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
  color: white;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
}

/* Pantalla de juego */
.game-screen {
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

/* Header */
.game-header {
  border-radius: 30px;
  padding: 15px 25px;
  margin-bottom: 15px;
  box-shadow: 0 10px 0 #3A1F4F, 0 15px 30px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.title-icon i {
  color: white;
  font-size: 1.5rem;
}

.game-title h2 {
  font-size: 1.8rem;
  margin: 0;
  color: white;
}

.game-stats {
  display: flex;
  gap: 15px;
}

.timer-display,
.score-display {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 50px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.timer-display i {
  color: #FFD93D;
  font-size: 1.2rem;
}

.timer-value {
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
}

.timer-critical {
  background: #FF6B6B !important;
  animation: pulse 1s infinite;
}

.score-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
}

.score-value {
  color: #FFD93D;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Top controles */
.top-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ficha-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 40px;
  padding: 10px 25px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.ficha-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.25);
}

.reset-button-small {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.reset-button-small:hover {
  transform: rotate(180deg) translateY(-3px);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2);
}

/* Sección de configuración */
.setup-section {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  padding: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.section-title {
  color: white;
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Comic Neue', cursive;
}

.section-title i {
  color: #FFD93D;
}

.image-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.image-option {
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 4px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  background: rgba(255, 255, 255, 0.1);
}

.image-option img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-option:hover img {
  transform: scale(1.1);
}

.image-option:hover {
  border-color: #FFD93D;
}

.image-option.selected {
  border-color: #FFD93D;
  box-shadow: 0 0 30px #FFD93D;
}

.image-caption {
  color: white;
  text-align: center;
  padding: 10px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-option.selected .image-overlay {
  opacity: 1;
}

.image-overlay i {
  color: #FFD93D;
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.difficulty-selector {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.difficulty-btn {
  flex: 1;
  min-width: 150px;
  padding: 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2);
}

.difficulty-btn.easy {
  background: linear-gradient(135deg, #6BFF6B, #4CAF50);
}

.difficulty-btn.medium {
  background: linear-gradient(135deg, #FFD93D, #FFA500);
}

.difficulty-btn.hard {
  background: linear-gradient(135deg, #FF6B6B, #FF4757);
}

.difficulty-btn.selected {
  transform: translateY(-4px);
  box-shadow: 0 12px 0 rgba(0, 0, 0, 0.2);
  border: 3px solid white;
}

.difficulty-name {
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.difficulty-pieces {
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.start-button {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #FFD93D, #FFA500);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 0 #B87C00;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.start-button:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 15px 0 #B87C00;
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Área del puzzle */
.puzzle-section {
  max-width: 800px;
  margin: 0 auto;
}

.puzzle-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.puzzle-board {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.board-title {
  color: white;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.board-grid {
  display: grid;
  gap: 4px;
  aspect-ratio: 1;
}

.board-cell {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 1;
  position: relative;
  background-size: 600px 600px !important;
  background-repeat: no-repeat !important;
}

.board-cell:hover:not(.empty) {
  transform: scale(0.98);
  border-color: #FFD93D;
}

.board-cell.correct {
  border: 3px solid #4CAF50;
  box-shadow: 0 0 20px #4CAF50;
}

.empty-number {
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.2rem;
  font-weight: 700;
}

.pieces-area {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.pieces-title {
  color: white;
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pieces-info {
  color: #FFD93D;
  font-size: 1rem;
}

.pieces-info p {
  margin: 5px 0;
}

.puzzle-stats {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.stat-card i {
  font-size: 1.3rem;
  color: #FFD93D;
}

.stat-label {
  color: white;
  font-size: 1rem;
  font-weight: 500;
}

.stat-value {
  color: #FFD93D;
  font-size: 1.3rem;
  font-weight: 700;
}

/* Feedback visual */
.feedback-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1000;
  font-size: 1.3rem;
  font-weight: 600;
  animation: slideIn 0.3s ease;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.feedback-message.success {
  background: linear-gradient(135deg, #4CAF50, #45A049);
  color: white;
  border: 3px solid #FFD93D;
}

.feedback-message.error {
  background: linear-gradient(135deg, #FF6B6B, #FF4757);
  color: white;
  border: 3px solid #FFD93D;
}

.feedback-message.info {
  background: linear-gradient(135deg, #FFD93D, #FFA500);
  color: #5E2A7C;
  border: 3px solid white;
}

/* Resultados */
.results-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #5E2A7C, #8A4FFF);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.results-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
}

.results-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  font-size: 3.5rem;
  background: linear-gradient(135deg, #4CAF50, #45A049);
  color: white;
  animation: victoryPulse 2s infinite;
}

@keyframes victoryPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 50px #4CAF50; }
  50% { transform: scale(1.1); box-shadow: 0 0 80px #4CAF50; }
}

.results-title {
  color: white;
  font-size: 2rem;
  margin-bottom: 30px;
  font-family: 'Comic Neue', cursive;
}

.results-stats {
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.stat-value {
  color: #FFD93D;
  font-size: 1.3rem;
  font-weight: 700;
}

.stat-value.final {
  font-size: 2rem;
}

.results-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 12px 30px;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.action-button.primary {
  background: linear-gradient(135deg, #FFD93D, #FFA500);
  color: #5E2A7C;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2);
}

/* Modales */
.ficha-modal :deep(.vs-popup),
.guardar-modal :deep(.vs-popup) {
  background: linear-gradient(135deg, #5E2A7C, #8A4FFF) !important;
  border-radius: 30px !important;
  border: 3px solid #FFD93D !important;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5) !important;
}

.ficha-modal :deep(.vs-popup--header),
.guardar-modal :deep(.vs-popup--header) {
  background: transparent !important;
  border-bottom: 2px solid rgba(255, 217, 61, 0.3) !important;
}

.ficha-modal :deep(.vs-popup--title),
.guardar-modal :deep(.vs-popup--title) {
  color: white !important;
  font-family: 'Comic Neue', cursive !important;
}

.ficha-content {
  padding: 25px;
}

.ficha-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 217, 61, 0.2);
}

.ficha-section:last-child {
  border-bottom: none;
}

.ficha-label {
  display: block;
  color: #FFD93D;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.ficha-value {
  color: white;
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
}

.guardar-content {
  text-align: center;
  padding: 30px;
}

.guardar-content i {
  font-size: 4rem;
  color: #FFD93D;
  margin-bottom: 15px;
  animation: starTwinkle 2s infinite;
}

@keyframes starTwinkle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.guardar-content h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-family: 'Comic Neue', cursive;
}

.guardar-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
}

.guardar-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 10px 25px;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

.btn-confirm {
  background: linear-gradient(135deg, #4CAF50, #45A049);
  color: white;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-confirm:hover,
.btn-cancel:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.2);
}

/* Animaciones */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

@keyframes slideIn {
  from {
    transform: translate(-50%, -30%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.pop-enter-active {
  animation: popIn 0.3s ease;
}

.pop-leave-active {
  animation: popIn 0.3s ease reverse;
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    padding: 12px 15px;
  }

  .game-title h2 {
    font-size: 1.3rem;
  }

  .game-stats {
    flex-direction: column;
    gap: 8px;
  }

  .timer-display,
  .score-display {
    padding: 5px 15px;
  }

  .setup-section {
    padding: 20px;
  }

  .image-selector {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .difficulty-selector {
    flex-direction: column;
  }

  .difficulty-btn {
    width: 100%;
  }

  .puzzle-stats {
    flex-direction: column;
  }

  .stat-card {
    width: 100%;
    justify-content: center;
  }

  .results-card {
    padding: 30px 20px;
  }

  .results-title {
    font-size: 1.5rem;
  }
}

/* Utilidades */
.mt-4 {
  margin-top: 1.5rem;
}
</style>
