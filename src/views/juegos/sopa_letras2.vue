<template>
  <div class="wordsearch-game-wrapper">
    <!-- Pantalla de juego principal -->
    <div v-if="!juegoTerminado" class="game-screen" :style="gameBackground">
      <!-- Header del juego -->
      <div class="game-header" :style="headerGradient">
        <div class="header-content">
          <div class="game-title">
            <div class="title-icon">
              <i class="feather icon-grid"></i>
            </div>
            <h2 v-if="infoJuego.length > 0 && infoJuego[0]" class="elegant-title">{{ infoJuego[0].nombre_juego }}</h2>
          </div>
          <div class="game-stats">
            <div class="words-counter">
              <span class="counter-label">Palabras</span>
              <span class="counter-value">{{ palabrasEncontradas }}/{{ totalPalabras }}</span>
            </div>
            <div class="timer-display" :class="{ 'timer-critical': tiempoAgotado }">
              <i class="feather icon-clock"></i>
              <span class="timer-value">{{ tiempoRestante }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón ficha técnica -->
      <div class="ficha-button-container">
        <button class="ficha-button" @click="modalFicha = true">
          <i class="feather icon-file-text"></i>
          <span>Ficha técnica</span>
        </button>
      </div>

      <!-- Contenido del juego -->
      <div class="game-content">
        <!-- Lista de palabras a buscar -->
        <div class="words-list-container">
          <h3 class="list-title">
            <i class="feather icon-search"></i>
            Palabras a encontrar
          </h3>
          <div class="words-grid">
            <div v-for="(palabra, index) in palabrasPendientes" :key="index" class="word-chip"
              :class="{ 'word-found': palabra.encontrada }">
              <span class="word-text">{{ palabra.texto }}</span>
              <i v-if="palabra.encontrada" class="feather icon-check"></i>
            </div>
          </div>
        </div>

        <!-- Sopa de letras -->
        <div class="wordsearch-grid-container">
          <div class="grid" :style="gridStyle">
            <div v-for="(fila, filaIndex) in grid" :key="filaIndex" class="grid-row">
              <div v-for="(celda, colIndex) in fila" :key="colIndex" class="grid-cell" :class="{
                'selected': celdaSeleccionada(filaIndex, colIndex),
                'found': celdaEncontrada(filaIndex, colIndex),
                'highlight': celdaDestacada(filaIndex, colIndex)
              }" @mousedown="iniciarSeleccion(filaIndex, colIndex)"
                @mouseenter="continuarSeleccion(filaIndex, colIndex)" @mouseup="finalizarSeleccion"
                @touchstart="iniciarSeleccion(filaIndex, colIndex)" @touchmove="manejarTouchMove"
                @touchend="finalizarSeleccion">
                {{ celda }}
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de control -->
        <div class="game-controls">
          <button class="control-button reset-button" @click="reiniciarJuego">
            <i class="feather icon-rotate-cw"></i>
            <span>Reiniciar</span>
          </button>
          <button class="control-button hint-button" @click="darPista" :disabled="pistasUsadas >= pistasMaximas">
            <i class="feather icon-help-circle"></i>
            <span>Pista ({{ pistasUsadas }}/{{ pistasMaximas }})</span>
          </button>
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
        <div class="results-icon" :class="resultadoClase">
          <i :class="resultadoIcono"></i>
        </div>
        <h2 class="results-title">{{ resultadoTitulo }}</h2>
        <div class="results-stats">
          <div class="stat-item">
            <span class="stat-label">Palabras encontradas</span>
            <span class="stat-value">{{ palabrasEncontradas }}/{{ totalPalabras }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tiempo utilizado</span>
            <span class="stat-value">{{ tiempoUtilizado }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Puntuación</span>
            <span class="stat-value">{{ puntuacion }}</span>
          </div>
        </div>
        <div class="results-actions">
          <button class="action-button primary" @click="guardarCalificacion">
            <i class="feather icon-save"></i>
            Guardar resultado
          </button>
          <button class="action-button secondary" @click="reiniciarJuego">
            <i class="feather icon-rotate-cw"></i>
            Jugar de nuevo
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <vs-popup title="Ficha técnica" :active.sync="modalFicha" class="ficha-modal">
      <div class="ficha-content" v-if="infoJuego.length > 0 && infoJuego[0]">
        <div class="ficha-section" v-if="infoJuego[0].bloque_curricular">
          <span class="ficha-label">Bloque curricular</span>
          <p class="ficha-value">{{ infoJuego[0].bloque_curricular }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego[0].grado">
          <span class="ficha-label">Grado</span>
          <p class="ficha-value">{{ infoJuego[0].grado }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego[0].destrezas">
          <span class="ficha-label">Destrezas</span>
          <p class="ficha-value">{{ infoJuego[0].destrezas }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego[0].habilidades">
          <span class="ficha-label">Habilidades</span>
          <p class="ficha-value">{{ infoJuego[0].habilidades }}</p>
        </div>
        <div class="ficha-section" v-if="infoJuego[0].elaborado_por">
          <span class="ficha-label">Elaborado por</span>
          <p class="ficha-value">{{ infoJuego[0].elaborado_por }}</p>
        </div>
      </div>
    </vs-popup>

    <vs-popup :active.sync="modalCalificacion" class="calificacion-modal text-white">
      <div v-if="previsualizar === 'previsualizard'">
        <h5 class="text-center p-4 text-white">Este juego está en modo previsualización, no se permite calificar.</h5>
      </div>
      <div v-else class="calificacion-content">
        <i class="feather icon-award"></i>
        <h3>¿Deseas guardar tu resultado?</h3>
        <p>Tu progreso será registrado</p>
        <div class="calificacion-actions">
          <button class="btn-confirm" @click="confirmarGuardado">
            <i class="feather icon-check"></i>
            Sí, guardar
          </button>
          <button class="btn-cancel" @click="modalCalificacion = false">
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
      infoJuego: [],
      titulo: '',
      subtitulo: '',
      words: [],
      puntaje_base: 0,
      temas: [],
      grid: [],
      gridSize: 12,

      // Estado del juego
      juegoTerminado: false,
      palabrasEncontradas: 0,
      totalPalabras: 0,
      palabrasPendientes: [],

      // Selección
      seleccionando: false,
      inicioSeleccion: { fila: -1, col: -1 },
      finSeleccion: { fila: -1, col: -1 },
      celdasSeleccionadas: [],
      palabrasEncontradasCoords: [],

      // Tiempo
      tiempoRestante: '00:00',
      tiempoTotal: 0,
      temporizador: null,
      tiempoAgotado: false,

      // Pistas
      pistasUsadas: 0,
      pistasMaximas: 3,
      pistaActiva: null,

      // Feedback
      mostrarFeedback: false,
      feedbackTipo: '',
      feedbackIcono: '',
      feedbackTexto: '',

      // Modales
      modalFicha: false,
      modalCalificacion: false,

      // Resultados
      puntuacion: 0,
      tiempoUtilizado: '',

      // Usuario
      usuario: {},
      codigo_curso: '',
      previsualizar: '',

      // Touch
      touchActivo: false,
      ultimaPosicionTouch: { fila: -1, col: -1 }
    }
  },
  computed: {
    gameBackground() {
      return {
        background: 'linear-gradient(135deg, #1E2B4F 0%, #2A3F6E 100%)'
      }
    },
    headerGradient() {
      return {
        background: 'linear-gradient(90deg, #1E2B4F, #2A3F6E, #1E2B4F)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.15)'
      }
    },
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.gridSize}, minmax(35px, 1fr))`
      }
    },
    resultadoClase() {
      if (this.palabrasEncontradas === this.totalPalabras) {
        return 'victory'
      } else if (this.tiempoAgotado) {
        return 'timeout'
      } else {
        return 'complete'
      }
    },
    resultadoIcono() {
      if (this.palabrasEncontradas === this.totalPalabras) {
        return 'feather icon-award'
      } else if (this.tiempoAgotado) {
        return 'feather icon-clock'
      } else {
        return 'feather icon-flag'
      }
    },
    resultadoTitulo() {
      if (this.palabrasEncontradas === this.totalPalabras) {
        return '¡Felicidades! Completaste la sopa de letras'
      } else if (this.tiempoAgotado) {
        return '¡Tiempo agotado!'
      } else {
        return 'Juego terminado'
      }
    }
  },
  created() {
    let me = this;
    me.id_juego = me.$route.params.id;
    me.previsualizar = me.$route.params.codigo;

    let data_juego = JSON.parse(localStorage.getItem('curso_juego'));
    // if (data_juego) {
    //   me.codigo_curso = data_juego.codigo;
    // }
    if (data_juego !== null) {
      me.codigo = data_juego.codigo;
      me.codigo_curso = data_juego.codigo;
    } else {
      me.codigo = '_';
      me.codigo_curso = '_';
    }


    me.usuario = JSON.parse(localStorage.getItem('usuario'));
    me.obtenerDatosJuego();
  },
  beforeDestroy() {
    if (this.temporizador) {
      clearInterval(this.temporizador);
    }
  },
  methods: {
    obtenerDatosJuego() {
      let me = this;
      me.$vs.loading();

      this.$http.get(this.$server_url + 'juego_y_contenido/' + me.id_juego)
        .then(res => {
          if (res.data && res.data.items) {
            me.infoJuego = res.data.items;

            if (me.infoJuego.length > 0) {
              let primerItem = me.infoJuego[0];
              // Extraer datos del juego
              me.titulo = primerItem.nombre_juego || '';
              me.subtitulo = primerItem.descripcion_juego || '';
              me.tiempoTotal = (primerItem.duracion || 5) * 60; // convertir minutos a segundos

              // Extraer las palabras de las preguntas
              me.words = [];
              let palabrasEncontradas = [];

              for (let i = 0; i < me.infoJuego.length; i++) {
                let item = me.infoJuego[i];
                console.log(item)

                // Verificar si existe el array de preguntas
                if (item.preguntas && Array.isArray(item.preguntas)) {
                  // Recorrer cada pregunta del array
                  for (let j = 0; j < item.preguntas.length; j++) {
                    let pregunta = item.preguntas[j];

                    // Extraer la palabra de respuesta
                    if (pregunta.respuesta && pregunta.respuesta !== '-') {
                      let palabra = pregunta.respuesta.trim().toUpperCase();
                      if (palabra && !palabrasEncontradas.includes(palabra)) {
                        palabrasEncontradas.push(palabra);
                        me.words.push(palabra);
                      }
                    }
                  }
                }

                console.log('Palabras encontradas:', palabrasEncontradas)

                // También revisar opciones si existen (mantener por si acaso)
                if (item.opciones && item.opciones.length > 0) {
                  for (let j = 0; j < item.opciones.length; j++) {
                    let opcion = item.opciones[j];
                    if (opcion.nombre_opcion) {
                      let palabra = opcion.nombre_opcion.trim().toUpperCase();
                      if (palabra && !palabrasEncontradas.includes(palabra)) {
                        palabrasEncontradas.push(palabra);
                        me.words.push(palabra);
                      }
                    }
                  }
                }
              }

              // Si no se encontraron palabras, usar valores por defecto
              if (me.words.length === 0) {
                // Intentar extraer del título o descripción
                let tituloPalabras = me.titulo.split(' ').filter(p => p.length > 3).map(p => p.toUpperCase());
                if (tituloPalabras.length > 0) {
                  me.words = tituloPalabras.slice(0, 6);
                } else {
                  // Palabras por defecto relacionadas con fotosíntesis
                  me.words = ['PLANTAS', 'ALIMENTO', 'SOL', 'AGUA', 'HOJAS', 'OXIGENO'];
                }
              }

              // Limitar a máximo 8 palabras para la sopa de letras
              if (me.words.length > 8) {
                me.words = me.words.slice(0, 8);
              }

              me.totalPalabras = me.words.length;
              me.puntaje_base = (primerItem.puntos || 100) / me.totalPalabras;

              // Extraer temas si existen
              me.temas = primerItem.temas || [];

              // Inicializar palabras pendientes
              me.palabrasPendientes = [];
              for (let i = 0; i < me.words.length; i++) {
                me.palabrasPendientes.push({
                  texto: me.words[i],
                  encontrada: false
                });
              }

              // Inicializar el grid
              me.generarGrid();

              // Iniciar temporizador
              me.iniciarTemporizador();
            }
          }
          me.$vs.loading.close();
        })
        .catch(error => {
          console.log('Error al obtener datos:', error);
          me.$vs.notify({
            text: 'Error al cargar el juego',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          });
          me.$vs.loading.close();
        });
    },

    generarGrid() {
      // Crear grid vacío
      let grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));

      // Colocar palabras en el grid
      let palabrasColocadas = [];
      for (let i = 0; i < this.palabrasPendientes.length; i++) {
        let palabra = this.palabrasPendientes[i];
        if (!palabra.encontrada && !palabrasColocadas.includes(palabra.texto)) {
          if (this.colocarPalabraEnGrid(grid, palabra.texto)) {
            palabrasColocadas.push(palabra.texto);
          }
        }
      }

      // Llenar espacios vacíos con letras aleatorias
      const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          if (grid[i][j] === '') {
            grid[i][j] = letras[Math.floor(Math.random() * letras.length)];
          }
        }
      }

      this.grid = grid;
    },

    colocarPalabraEnGrid(grid, palabra) {
      const direcciones = [
        [0, 1],   // derecha
        [1, 0],   // abajo
        [1, 1],   // diagonal derecha abajo
        [0, -1],  // izquierda
        [-1, 0],  // arriba
        [-1, -1], // diagonal izquierda arriba
        [1, -1],  // diagonal izquierda abajo
        [-1, 1]   // diagonal derecha arriba
      ];

      let colocada = false;
      let intentos = 0;
      const maxIntentos = 100;

      while (!colocada && intentos < maxIntentos) {
        const direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
        const fila = Math.floor(Math.random() * this.gridSize);
        const col = Math.floor(Math.random() * this.gridSize);

        if (this.puedeColocarPalabra(grid, palabra, fila, col, direccion)) {
          for (let i = 0; i < palabra.length; i++) {
            const nuevaFila = fila + (direccion[0] * i);
            const nuevaCol = col + (direccion[1] * i);
            grid[nuevaFila][nuevaCol] = palabra[i];
          }
          colocada = true;
        }
        intentos++;
      }

      return colocada;
    },

    puedeColocarPalabra(grid, palabra, fila, col, direccion) {
      for (let i = 0; i < palabra.length; i++) {
        const nuevaFila = fila + (direccion[0] * i);
        const nuevaCol = col + (direccion[1] * i);

        if (nuevaFila < 0 || nuevaFila >= this.gridSize ||
          nuevaCol < 0 || nuevaCol >= this.gridSize) {
          return false;
        }

        if (grid[nuevaFila][nuevaCol] !== '' &&
          grid[nuevaFila][nuevaCol] !== palabra[i]) {
          return false;
        }
      }
      return true;
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

          if (segundos <= 0) {
            clearInterval(me.temporizador);
            me.tiempoAgotado = true;
            me.finalizarJuego();
          }
        }
      }, 1000);
    },

    iniciarSeleccion(fila, col) {
      this.seleccionando = true;
      this.inicioSeleccion = { fila, col };
      this.finSeleccion = { fila, col };
      this.celdasSeleccionadas = [[fila, col]];
    },

    continuarSeleccion(fila, col) {
      if (!this.seleccionando) return;

      this.finSeleccion = { fila, col };
      this.calcularCeldasSeleccionadas();
    },

    manejarTouchMove(event) {
      if (!this.seleccionando) return;

      const touch = event.touches[0];
      const elemento = document.elementFromPoint(touch.clientX, touch.clientY);

      if (elemento && elemento.classList && elemento.classList.contains('grid-cell')) {
        // Buscar los atributos data-fila y data-col
        let fila = -1;
        let col = -1;

        // Intentar obtener del dataset
        if (elemento.dataset) {
          fila = parseInt(elemento.dataset.fila) || -1;
          col = parseInt(elemento.dataset.col) || -1;
        }

        // Si no tiene dataset, buscar por índice en el DOM
        if (fila === -1 || col === -1) {
          const celdas = Array.from(document.querySelectorAll('.grid-cell'));
          const index = celdas.indexOf(elemento);
          if (index !== -1) {
            fila = Math.floor(index / this.gridSize);
            col = index % this.gridSize;
          }
        }

        if (fila !== -1 && col !== -1 &&
          (fila !== this.ultimaPosicionTouch.fila || col !== this.ultimaPosicionTouch.col)) {
          this.ultimaPosicionTouch = { fila, col };
          this.continuarSeleccion(fila, col);
        }
      }
    },

    finalizarSeleccion() {
      if (!this.seleccionando) return;

      this.seleccionando = false;
      this.ultimaPosicionTouch = { fila: -1, col: -1 };
      this.verificarPalabraSeleccionada();
      this.celdasSeleccionadas = [];
    },

    calcularCeldasSeleccionadas() {
      let celdas = [];
      let filaInicio = Math.min(this.inicioSeleccion.fila, this.finSeleccion.fila);
      let filaFin = Math.max(this.inicioSeleccion.fila, this.finSeleccion.fila);
      let colInicio = Math.min(this.inicioSeleccion.col, this.finSeleccion.col);
      let colFin = Math.max(this.inicioSeleccion.col, this.finSeleccion.col);

      let direccionFila = this.inicioSeleccion.fila === this.finSeleccion.fila ? 0 :
        (this.inicioSeleccion.fila < this.finSeleccion.fila ? 1 : -1);
      let direccionCol = this.inicioSeleccion.col === this.finSeleccion.col ? 0 :
        (this.inicioSeleccion.col < this.finSeleccion.col ? 1 : -1);

      if (direccionFila === 0 || direccionCol === 0 ||
        Math.abs(filaFin - filaInicio) === Math.abs(colFin - colInicio)) {

        let fila = this.inicioSeleccion.fila;
        let col = this.inicioSeleccion.col;

        while (fila >= 0 && fila < this.gridSize &&
          col >= 0 && col < this.gridSize &&
          Math.abs(fila - this.inicioSeleccion.fila) <= Math.abs(this.finSeleccion.fila - this.inicioSeleccion.fila) &&
          Math.abs(col - this.inicioSeleccion.col) <= Math.abs(this.finSeleccion.col - this.inicioSeleccion.col)) {

          celdas.push([fila, col]);
          fila += direccionFila;
          col += direccionCol;
        }
      }

      this.celdasSeleccionadas = celdas;
    },

    celdaSeleccionada(fila, col) {
      return this.celdasSeleccionadas.some(coord => coord[0] === fila && coord[1] === col);
    },

    celdaEncontrada(fila, col) {
      return this.palabrasEncontradasCoords.some(coord => coord[0] === fila && coord[1] === col);
    },

    celdaDestacada(fila, col) {
      if (!this.pistaActiva) return false;

      for (let i = 0; i < this.pistaActiva.coords.length; i++) {
        if (this.pistaActiva.coords[i][0] === fila &&
          this.pistaActiva.coords[i][1] === col) {
          return true;
        }
      }
      return false;
    },

    verificarPalabraSeleccionada() {
      if (this.celdasSeleccionadas.length < 2) return;

      let palabraSeleccionada = '';
      for (let coord of this.celdasSeleccionadas) {
        palabraSeleccionada += this.grid[coord[0]][coord[1]];
      }

      let palabraReversa = palabraSeleccionada.split('').reverse().join('');

      for (let i = 0; i < this.palabrasPendientes.length; i++) {
        let palabra = this.palabrasPendientes[i];
        if (!palabra.encontrada &&
          (palabra.texto === palabraSeleccionada || palabra.texto === palabraReversa)) {

          palabra.encontrada = true;
          this.palabrasEncontradas++;

          for (let coord of this.celdasSeleccionadas) {
            this.palabrasEncontradasCoords.push(coord);
          }

          this.mostrarFeedbackExito(palabra.texto);

          if (this.palabrasEncontradas === this.totalPalabras) {
            this.finalizarJuego();
          }
          break;
        }
      }

      this.pistaActiva = null;
    },

    mostrarFeedbackExito(palabra) {
      this.feedbackTipo = 'success';
      this.feedbackIcono = 'feather icon-check-circle';
      this.feedbackTexto = `¡Encontraste "${palabra}"!`;
      this.mostrarFeedback = true;

      setTimeout(() => {
        this.mostrarFeedback = false;
      }, 2000);
    },

    darPista() {
      if (this.pistasUsadas >= this.pistasMaximas) return;

      let palabrasNoEncontradas = this.palabrasPendientes.filter(p => !p.encontrada);
      if (palabrasNoEncontradas.length === 0) return;

      let palabraAleatoria = palabrasNoEncontradas[Math.floor(Math.random() * palabrasNoEncontradas.length)];
      let coords = this.encontrarCoordenadasPalabra(palabraAleatoria.texto);

      if (coords) {
        this.pistaActiva = {
          palabra: palabraAleatoria.texto,
          coords: coords
        };

        this.pistasUsadas++;

        this.feedbackTipo = 'info';
        this.feedbackIcono = 'feather icon-help-circle';
        this.feedbackTexto = `Busca: ${palabraAleatoria.texto}`;
        this.mostrarFeedback = true;

        setTimeout(() => {
          this.mostrarFeedback = false;
          this.pistaActiva = null;
        }, 3000);
      }
    },

    encontrarCoordenadasPalabra(palabra) {
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          if (this.grid[i][j] === palabra[0]) {
            let resultado = this.buscarPalabraEnDireccion(palabra, i, j);
            if (resultado) return resultado;
          }
        }
      }
      return null;
    },

    buscarPalabraEnDireccion(palabra, fila, col) {
      const direcciones = [
        [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]
      ];

      for (let dir of direcciones) {
        let coords = [];
        let encontrada = true;

        for (let i = 0; i < palabra.length; i++) {
          let nuevaFila = fila + (dir[0] * i);
          let nuevaCol = col + (dir[1] * i);

          if (nuevaFila < 0 || nuevaFila >= this.gridSize ||
            nuevaCol < 0 || nuevaCol >= this.gridSize) {
            encontrada = false;
            break;
          }

          if (this.grid[nuevaFila][nuevaCol] !== palabra[i]) {
            encontrada = false;
            break;
          }

          coords.push([nuevaFila, nuevaCol]);
        }

        if (encontrada) return coords;
      }

      return null;
    },

    finalizarJuego() {
      if (this.temporizador) {
        clearInterval(this.temporizador);
      }

      this.tiempoUtilizado = this.calcularTiempoUtilizado();
      this.puntuacion = this.calcularPuntuacion();
      this.juegoTerminado = true;
    },

    calcularTiempoUtilizado() {
      let segundosUsados = this.tiempoTotal - this.segundosRestantes();
      let mins = Math.floor(segundosUsados / 60);
      let secs = segundosUsados % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    segundosRestantes() {
      let partes = this.tiempoRestante.split(':');
      return parseInt(partes[0]) * 60 + parseInt(partes[1]);
    },

    calcularPuntuacion() {
      let puntajeBase = this.palabrasEncontradas * 100;
      let bonusTiempo = 0;

      if (!this.tiempoAgotado && this.tiempoTotal > 0) {
        let segundosRest = this.segundosRestantes();
        bonusTiempo = Math.floor(segundosRest * 0.5);
      }

      let bonusPistas = Math.max(0, this.pistasMaximas - this.pistasUsadas) * 10;

      return puntajeBase + bonusTiempo + bonusPistas;
    },

    reiniciarJuego() {
      this.juegoTerminado = false;
      this.palabrasEncontradas = 0;
      this.palabrasEncontradasCoords = [];
      this.pistasUsadas = 0;
      this.pistaActiva = null;

      this.palabrasPendientes = this.palabrasPendientes.map(p => ({
        texto: p.texto,
        encontrada: false
      }));

      this.generarGrid();

      if (this.temporizador) {
        clearInterval(this.temporizador);
      }
      this.iniciarTemporizador();
    },

    guardarCalificacion() {
      this.modalCalificacion = true;
    },

    confirmarGuardado() {
      let me = this;
      // console.log('me.usuario',me.usuario)
      if (!me.usuario || !me.usuario.idusuario) {
        me.$vs.notify({
          text: 'Error: No se pudo identificar al usuario',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return;
      }

      me.modalCalificacion = false;
      me.$vs.loading();

      let formData = new FormData();
      formData.append('id_juego', me.id_juego || '');
      formData.append('codigo_curso', me.codigo_curso || '');
      formData.append('id_usuario', me.usuario.idusuario);
      formData.append('calificacion', me.puntuacion || 0);

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
    },

    f_ficha() {
      // Método para mostrar información de la ficha si es necesario
      console.log('Mostrar ficha técnica');
    }
  }
}
</script>
<style scoped>
/* Importar fuentes elegantes */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.wordsearch-game-wrapper {
  min-height: 100vh;
  position: relative;
  font-family: 'Inter', sans-serif;
}

/* Tipografía elegante */
.elegant-title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Pantalla de juego */
.game-screen {
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

/* Header */
.game-header {
  border-radius: 16px;
  padding: 20px 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.title-icon {
  width: 45px;
  height: 45px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.title-icon i {
  color: #FFD700;
  font-size: 1.3rem;
}

.game-title h2 {
  font-size: 1.8rem;
  margin: 0;
}

.game-stats {
  display: flex;
  gap: 15px;
}

.words-counter,
.timer-display {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.timer-display i {
  color: #FFD700;
  font-size: 1.1rem;
}

.counter-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.counter-value,
.timer-value {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.timer-critical {
  background: rgba(244, 67, 54, 0.2);
  border-color: #f44336;
  animation: pulse 1s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

/* Botón ficha técnica */
.ficha-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.ficha-button {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  padding: 10px 24px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ficha-button:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
}

.ficha-button i {
  color: #FFD700;
}

/* Lista de palabras */
.words-list-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.list-title {
  color: white;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-title i {
  color: #FFD700;
}

.words-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.word-chip {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.word-chip.word-found {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.word-text {
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
}

.word-chip i {
  color: #4CAF50;
  font-size: 0.9rem;
}

/* Grid de sopa de letras */
.wordsearch-grid-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  overflow-x: auto;
  padding: 10px;
}

.grid {
  display: inline-grid;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.grid-row {
  display: contents;
}

.grid-cell {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

@media (min-width: 768px) {
  .grid-cell {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
}

.grid-cell:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.05);
}

.grid-cell.selected {
  background: rgba(255, 215, 0, 0.3);
  border-color: #FFD700;
  transform: scale(1.05);
}

.grid-cell.found {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.grid-cell.highlight {
  background: rgba(255, 215, 0, 0.4);
  border-color: #FFD700;
  animation: pulse 1s infinite;
}

/* Botones de control */
.game-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.control-button {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hint-button {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
  border: 1px solid #FFD700;
}

.hint-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.reset-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.hint-button:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.2);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

/* Feedback visual */
.feedback-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.feedback-message.success {
  background: rgba(76, 175, 80, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid #4CAF50;
}

.feedback-message.info {
  background: rgba(255, 215, 0, 0.9);
  backdrop-filter: blur(10px);
  color: #1E2B4F;
  border: 1px solid #FFD700;
}

.feedback-message i {
  font-size: 1.5rem;
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

/* Resultados */
.results-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #1E2B4F, #2A3F6E);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.results-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.results-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
}

.results-icon.victory {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  animation: victoryPulse 2s infinite;
}

.results-icon.timeout {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
}

.results-icon.complete {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1E2B4F;
}

.results-icon i {
  font-size: 3rem;
}

@keyframes victoryPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.results-title {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 30px;
  font-family: 'Playfair Display', serif;
}

.results-stats {
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.stat-value {
  color: #FFD700;
  font-size: 1.2rem;
  font-weight: 600;
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
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: #FFD700;
  color: #1E2B4F;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-button.primary:hover {
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.3);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Modales */
.ficha-modal :deep(.vs-popup),
.calificacion-modal :deep(.vs-popup) {
  background: linear-gradient(135deg, #1E2B4F, #2A3F6E) !important;
  border-radius: 16px !important;
  border: 1px solid rgba(255, 215, 0, 0.2) !important;
}

.ficha-modal :deep(.vs-popup--header),
.calificacion-modal :deep(.vs-popup--header) {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1) !important;
}

.ficha-modal :deep(.vs-popup--title),
.calificacion-modal :deep(.vs-popup--title) {
  color: white !important;
  font-family: 'Playfair Display', serif !important;
}

.ficha-content {
  padding: 20px;
}

.ficha-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.ficha-section:last-child {
  border-bottom: none;
}

.ficha-label {
  display: block;
  color: #FFD700;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.ficha-value {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
}

.calificacion-content {
  text-align: center;
  padding: 30px;
}

.calificacion-content i {
  font-size: 4rem;
  color: #FFD700;
  margin-bottom: 15px;
}

.calificacion-content h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 8px;
  font-family: 'Playfair Display', serif;
}

.calificacion-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 25px;
}

.calificacion-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm {
  background: #1E2B4F;
  color: #FFD700;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-confirm:hover,
.btn-cancel:hover {
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    padding: 15px;
  }

  .game-title h2 {
    font-size: 1.3rem;
  }

  .grid-cell {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .words-grid {
    justify-content: center;
  }

  .results-card {
    padding: 30px 20px;
  }

  .results-title {
    font-size: 1.5rem;
  }
}

/* Animaciones */
@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  80% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pop-enter-active {
  animation: popIn 0.3s ease;
}

.pop-leave-active {
  animation: popIn 0.3s ease reverse;
}
</style>
