<template>
  <div class="kahoot-game-wrapper">
    <!-- Pantalla de juego principal -->
    <div v-if="!resultados" class="game-screen" :style="gameBackground">
      <!-- Header del juego con diseño minimalista -->
      <div class="game-header" :style="headerGradient">
        <div class="header-content">
          <div class="game-title">
            <div class="title-icon">
              <i class="feather icon-book-open"></i>
            </div>
            <h2 v-if="preguntas.length > 0 && preguntas[0] && preguntas[0].pregunta" class="elegant-title">
              {{ preguntas[0].pregunta.nombre_juego }}</h2>
          </div>
          <div class="game-stats">
            <div class="question-counter">
              <span class="counter-label">Pregunta</span>
              <span class="counter-value">{{ turno + 1 }}/{{ t_preguntas }}</span>
            </div>
            <div class="score-display">
              <span class="score-label">Puntos</span>
              <span class="score-value" :class="{ 'score-pop': puntajeAnimado }">{{ numero }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón ficha técnica minimalista -->
      <div class="ficha-button-container">
        <button class="ficha-button" @click="modalFicha = true">
          <i class="feather icon-file-text"></i>
          <span>Ficha técnica</span>
        </button>
      </div>

      <!-- Contenido del juego -->
      <div class="game-content" v-if="!resultados">
        <!-- Pregunta con diseño limpio -->
        <transition name="fade-slide">
          <div v-if="show" class="question-container">
            <div class="question-card" :style="questionCardStyle">
              <h2 class="question-text elegant-text" v-html="preguntas[turno].pregunta.pregunta"></h2>
              <div v-if="preguntas[turno].pregunta.imagen" class="question-image">
                <img @click="mostrarImagen(preguntas[turno].pregunta.imagen)"
                  :src="getImageUrl(preguntas[turno].pregunta.imagen)" alt="Imagen de la pregunta">
              </div>
            </div>
            <!-- Separador minimalista -->
            <div class="minimal-divider">
              <span class="divider-dot"></span>
              <span class="divider-dot"></span>
              <span class="divider-dot"></span>
            </div>
          </div>
        </transition>

        <!-- Opciones de respuesta con diseño elegante -->
        <!-- <transition name="fade-slide">
          <div v-if="show" class="options-container">
            <div v-if="total_opciones > 1" class="options-hint">
              <i class="feather icon-info"></i>
              <span>Selecciona <strong>{{ msj_opciones_seleccion }}</strong></span>
            </div>

            <div class="options-grid">
              <div v-for="(item, index) in preguntas[turno].opciones" :key="item.id_opcion_contenido"
                class="option-card" :class="{
                  'option-selected': opcionesSeleccionadas.includes(item.id_opcion_contenido),
                  'option-correct': item.tipo_opcion == respuesta_correcta && mostrarFeedback,
                  'option-incorrect': item.tipo_opcion != respuesta_correcta && opcionesSeleccionadas.includes(item.id_opcion_contenido) && mostrarFeedback
                }" :style="optionCardStyle(index)" @click="seleccionarOpcion(item)">
                <div class="option-content">
                  <span class="option-letter">{{ letras[index] }}</span>
                  <div class="option-text">{{ item.nombre_opcion }}</div>
                  <div v-if="item.imagen_opcion" class="option-image">
                    <img :src="getImageUrl(item.imagen_opcion)" :alt="item.nombre_opcion">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition> -->

        <!-- Opciones de respuesta con diseño elegante y adaptativo -->
<transition name="fade-slide">
  <div v-if="show" class="options-container">
    <div v-if="total_opciones > 1" class="options-hint">
      <i class="feather icon-info"></i>
      <span>Selecciona <strong>{{ msj_opciones_seleccion }}</strong></span>
    </div>

    <div class="options-grid">
      <div v-for="(item, index) in preguntas[turno].opciones" :key="item.id_opcion_contenido"
        class="option-card"
        :class="{
          'option-selected': opcionesSeleccionadas.includes(item.id_opcion_contenido),
          'option-correct': item.tipo_opcion == respuesta_correcta && mostrarFeedback,
          'option-incorrect': item.tipo_opcion != respuesta_correcta && opcionesSeleccionadas.includes(item.id_opcion_contenido) && mostrarFeedback,
          'option-only-image': item.imagen_opcion && (!item.nombre_opcion || item.nombre_opcion === ''),
          'option-with-image': item.imagen_opcion && item.nombre_opcion && item.nombre_opcion !== ''
        }"
        :style="optionCardStyle(index)"
        @click="seleccionarOpcion(item)">

        <div class="option-content">
          <!-- <span class="option-letter">{{ letras[index] }}</span> -->

          <!-- Caso 1: Solo imagen (sin texto) -->
          <div v-if="item.imagen_opcion && (!item.nombre_opcion || item.nombre_opcion === '')" class="option-only-image-container">
            <img :src="getImageUrl(item.imagen_opcion)" :alt="'Opción ' + letras[index]" class="option-image-large">
          </div>

          <!-- Caso 2: Imagen con texto -->
          <div v-else-if="item.imagen_opcion && item.nombre_opcion && item.nombre_opcion !== ''" class="option-with-image-container">
            <img :src="getImageUrl(item.imagen_opcion)" :alt="item.nombre_opcion" class="option-image-medium">
            <div class="option-text-below">{{ item.nombre_opcion }}</div>
          </div>

          <!-- Caso 3: Solo texto -->
          <div v-else class="option-text-only">
            <div class="option-text-large">{{ item.nombre_opcion }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>

      </div>

      <!-- Feedback visual elegante -->
      <transition name="pop">
        <div v-if="mostrarFeedbackIcono" class="feedback-icon" :class="feedbackClass">
          <i :class="feedbackIcon"></i>
        </div>
      </transition>
    </div>

    <!-- Pantalla de resultados con diseño limpio -->
    <div v-else class="results-screen">
      <div class="results-header">
        <h2 class="elegant-title"><i class="feather icon-award"></i> Resultados finales</h2>
        <div class="final-score">
          <span class="score">{{ total_calificacion }}</span>
          <span class="label">puntos</span>
        </div>
      </div>

      <div class="results-table-container">
        <vs-table stripe :data="arr_resultados">
          <template slot="thead">
            <vs-th>Pregunta</vs-th>
            <vs-th>Tu respuesta</vs-th>
            <vs-th>Resultado</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr v-for="(item, index) in data" :key="index">
              <vs-td>
                <div class="result-question" v-html="item.pregunta"></div>
              </vs-td>
              <vs-td>
                <div class="result-answer">{{ item.descripcion }}</div>
                <vs-avatar v-if="item.rutaImagen" size="30px" :src="getImageUrl(item.rutaImagen)" class="mt-1" />
              </vs-td>
              <vs-td>
                <div class="result-badge" :class="item.respuesta == 1 ? 'correct' : 'incorrect'">
                  <i :class="item.respuesta == 1 ? 'feather icon-check' : 'feather icon-x'"></i>
                  <span>{{ item.respuesta == 1 ? 'Correcto' : 'Incorrecto' }}</span>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>

      <div class="results-actions">
        <button class="btn-save" @click="modalCalificacion = true">
          <i class="feather icon-save"></i>
          Guardar calificación
        </button>
      </div>
    </div>

    <!-- Modales con diseño elegante -->
    <vs-popup title="Ficha técnica" :active.sync="modalFicha" class="ficha-modal">
      <div class="ficha-content" v-if="preguntas[0]">
        <div class="ficha-section" v-if="preguntas[0].pregunta.bloque_curricular">
          <span class="ficha-label">Bloque curricular</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.bloque_curricular"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.grado">
          <span class="ficha-label">Grado</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.grado"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.destrezas">
          <span class="ficha-label">Destrezas</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.destrezas"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.habilidades">
          <span class="ficha-label">Habilidades</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.habilidades"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.elaborado_por">
          <span class="ficha-label">Elaborado por</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.elaborado_por"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.intencion_didactica">
          <span class="ficha-label">Intención didáctica</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.intencion_didactica"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.consigna">
          <span class="ficha-label">Consigna</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.consigna"></p>
        </div>
        <div class="ficha-section" v-if="preguntas[0].pregunta.consideraciones">
          <span class="ficha-label">Consideraciones</span>
          <p class="ficha-value" v-html="preguntas[0].pregunta.consideraciones"></p>
        </div>
      </div>
    </vs-popup>

    <vs-popup title="Guardar calificación" :active.sync="modalCalificacion" class="calificacion-modal">
      <div class="calificacion-content">
        <i class="feather icon-alert-circle"></i>
        <h3>¿Deseas enviar esta calificación?</h3>
        <p>Tu docente podrá ver tus resultados</p>
        <div class="calificacion-actions">
          <button class="btn-confirm" @click="guardarCalificacion()">
            <i class="feather icon-check"></i>
            Sí, enviar
          </button>
          <button class="btn-cancel" @click="recargar()">
            <i class="feather icon-rotate-cw"></i>
            Intentar de nuevo
          </button>
        </div>
      </div>
    </vs-popup>

    <vs-popup title="Imagen" :active.sync="modalImagen" class="imagen-modal">
      <div class="imagen-content">
        <img :src="getImageUrl(imagen_a_mostrar)" alt="Imagen ampliada">
      </div>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  components: {
    'v-select': vSelect,
  },
  data() {
    return {
      letras: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      numero: 0,
      juega: true,
      t_preguntas: 0,
      puntaje_total: 1000,
      show: true,
      respuesta_correcta: '1',
      num_incremento: 1,
      turno: 0,
      resultados: false,
      arr_resultados: [],
      id_juego: '',
      preguntas: [],
      modalImagen: false,
      modalFicha: false,
      imagen_a_mostrar: '',
      modalCalificacion: false,
      total_calificacion: 0,
      total_opciones: 0,
      msj_opciones_seleccion: '',
      contar_click: 0,
      codigo_curso: '',
      usuario: {},
      previsualizar: '',
      opcionesSeleccionadas: [],
      mostrarFeedback: false,
      mostrarFeedbackIcono: false,
      feedbackIcon: '',
      feedbackClass: '',
      puntajeAnimado: false,

      // Paleta de colores elegante y moderna
      colores: [
        { primary: '#0057B7', secondary: '#004494', light: '#E3F0FF' }, // Azul profundo
        { primary: '#00A86B', secondary: '#00875A', light: '#E3F9EE' }, // Verde esmeralda
        { primary: '#722F37', secondary: '#5A252B', light: '#F9E9EB' }, // Burdeos
        { primary: '#9370DB', secondary: '#7B5FB0', light: '#F3EEFF' }, // Lavanda
        { primary: '#008080', secondary: '#006666', light: '#E0F0F0' }, // Teal
        { primary: '#B76E79', secondary: '#9E5A64', light: '#FDF0F2' }, // Rosa palo
        { primary: '#5D9B9B', secondary: '#4A7C7C', light: '#E8F3F3' }, // Verde azulado
        { primary: '#A67B5B', secondary: '#8B5E45', light: '#F8F0E8' }  // Marrón cálido
      ]
    }
  },
  computed: {
    gameBackground() {
      return {
        background: 'linear-gradient(135deg, #1A1F2C 0%, #2C3A5E 100%)'
      }
    },
    headerGradient() {
      return {
        background: 'linear-gradient(90deg, #1A1F2C, #2C3A5E, #1A1F2C)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
      }
    },
    questionCardStyle() {
      return {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
      }
    }
  },
  created() {
    let me = this;
    me.previsualizar = me.$route.params.codigo;
    let data_juego = JSON.parse(localStorage.getItem('curso_juego'));
    me.id_juego = me.$route.params.id;

    if (data_juego !== null) {
      me.codigo = data_juego.codigo;
      me.codigo_curso = data_juego.codigo;
    } else {
      me.codigo = '_';
      me.codigo_curso = '_';
    }

    me.usuario = JSON.parse(localStorage.getItem('usuario')) || {};
    me.getPreguntas();
  },
  methods: {
    getImageUrl(imageName) {
      return `${this.$data_url}archivos/images/imagenes_juegos/seleccionSimple/${imageName}`;
    },

    optionCardStyle(index) {
      const color = this.colores[index % this.colores.length];
      return {
        background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`,
        boxShadow: `0 15px 25px -8px rgba(0, 0, 0, 0.5)`,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      };
    },

    randomSort(a, b) {
      return Math.random() < 0.5 ? -1 : 1;
    },

    getPreguntas() {
      let me = this;
      me.$vs.loading();

      this.$http.get(this.$server_url + 'pregunta_opciones/' + me.id_juego)
        .then(res => {
          if (res.data.items) {
            me.preguntas = res.data.items;
            me.t_preguntas = me.preguntas.length;
            me.preguntas.sort(me.randomSort);

            me.preguntas.forEach(pregunta => {
              if (pregunta.opciones) {
                pregunta.opciones.sort(me.randomSort);
              }
            });

            me.contarOpciones();
          }
          me.$vs.loading.close();
        })
        .catch(error => {
          console.log(error);
          me.$vs.loading.close();
        });
    },

    contarOpciones() {
      let me = this;
      me.total_opciones = 0;
      me.contar_click = 0;
      me.opcionesSeleccionadas = [];

      if (me.preguntas[me.turno] && me.preguntas[me.turno].opciones) {
        me.preguntas[me.turno].opciones.forEach(opcion => {
          if (opcion.tipo_opcion == 1) {
            me.total_opciones++;
          }
        });

        me.msj_opciones_seleccion = me.total_opciones > 1
          ? me.total_opciones + ' opciones'
          : '1 opción';
      }
    },

    seleccionarOpcion(item) {
      let me = this;

      if (!me.juega) return;
      if (me.opcionesSeleccionadas.includes(item.id_opcion_contenido)) return;

      me.opcionesSeleccionadas.push(item.id_opcion_contenido);
      me.contar_click++;

      // Mostrar feedback visual
      me.mostrarFeedbackIcono = true;
      if (item.tipo_opcion == me.respuesta_correcta) {
        me.feedbackIcon = 'feather icon-check-circle';
        me.feedbackClass = 'feedback-correct';
        me.calcularPuntaje();
      } else {
        me.feedbackIcon = 'feather icon-x-circle';
        me.feedbackClass = 'feedback-incorrect';
      }

      setTimeout(() => {
        me.mostrarFeedbackIcono = false;
      }, 800);

      // Guardar resultado
      me.arr_resultados.push({
        pregunta: me.preguntas[me.turno].pregunta.pregunta,
        id: item.id_opcion_contenido,
        descripcion: item.nombre_opcion,
        respuesta: item.tipo_opcion,
        rutaImagen: item.imagen_opcion
      });

      // Avanzar si ya seleccionó todas las opciones necesarias
      if (me.contar_click >= me.total_opciones) {
        me.juega = false;
        setTimeout(() => {
          me.avanzarPregunta();
        }, 1500);
      }
    },

    calcularPuntaje() {
      let me = this;
      let valorPregunta = me.puntaje_total / me.t_preguntas;

      if (me.total_opciones > 1) {
        valorPregunta = valorPregunta / me.total_opciones;
      }

      me.numero += Math.round(valorPregunta);
      me.total_calificacion = me.numero / 100;

      // Animación del puntaje
      me.puntajeAnimado = true;
      setTimeout(() => {
        me.puntajeAnimado = false;
      }, 500);
    },

    avanzarPregunta() {
      let me = this;
      me.show = false;

      setTimeout(() => {
        me.turno++;

        if (me.turno < me.t_preguntas) {
          me.contarOpciones();
          me.juega = true;
          me.show = true;

          if (me.preguntas[me.turno].opciones) {
            me.preguntas[me.turno].opciones.sort(me.randomSort);
          }
        } else {
          me.resultados = true;
          me.modalCalificacion = true;
        }
      }, 500);
    },

    mostrarImagen(item) {
      this.imagen_a_mostrar = item;
      this.modalImagen = true;
    },

    guardarCalificacion() {
      let me = this;
      me.modalCalificacion = false;
      // Validar que el usuario existe y tiene idusuario
      // console.log(me.usuario,'usuarioooooooooooooooo')
      if (!me.usuario || !me.usuario.idusuario) {
        me.$vs.loading.close();
        me.$vs.notify({
          text: 'Debe iniciar sesión, no se pudo identificar al usuario',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return;
      }

      me.$vs.loading();

      let formData = new FormData();
      formData.append('id_juego', me.id_juego);
      formData.append('codigo_curso', me.codigo_curso);
      formData.append('id_usuario', me.usuario.idusuario);
      formData.append('calificacion', me.total_calificacion);

      this.$http.post(this.$server_url + 'j_guardar_calificacion', formData)
        .then(res => {
          me.$vs.notify({
            text: 'Calificación enviada correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
          me.$vs.loading.close();
        })
        .catch(error => {
          console.log(error);
          me.$vs.loading.close();
        });
    },

    recargar() {
      window.location.reload();
    }
  }
}
</script>

<style scoped>
/* Importar fuentes elegantes */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

.kahoot-game-wrapper {
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

.elegant-text {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

/* Pantalla de juego */
.game-screen {
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

/* Header minimalista */
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

.question-counter,
.score-display {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.counter-label,
.score-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.counter-value,
.score-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: 'Playfair Display', serif;
}

.score-value {
  color: #FFD700;
  transition: all 0.3s ease;
}

.score-pop {
  animation: scorePop 0.5s ease;
}

@keyframes scorePop {

  0%,
  100% {
    transform: scale(1);
    color: #FFD700;
  }

  50% {
    transform: scale(1.3);
    color: #FFA500;
  }
}

/* Botón ficha técnica minimalista */
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
  font-size: 1rem;
}

/* Pregunta */
.question-container {
  max-width: 900px;
  margin: 0 auto 20px;
}

.question-card {
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
}

.question-text {
  font-size: 2rem;
  margin-bottom: 30px;
  line-height: 1.4;
}

.question-image img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.question-image img:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

/* Separador minimalista */
.minimal-divider {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 20px;
}

.divider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.3);
  animation: dotPulse 2s infinite;
}

.divider-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.divider-dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes dotPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
    background: #FFD700;
  }
}

/* Opciones */
.options-container {
  max-width: 1000px;
  margin: 0 auto;
}

.options-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
}

.options-hint i {
  color: #FFD700;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 10px;
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}

.option-card {
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: auto;
  display: flex;
  align-items: center;
}

.option-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.option-card:hover:not(.option-selected) {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.6) !important;
}

.option-card:hover::after {
  opacity: 1;
}

.option-card.option-selected {
  filter: brightness(0.95);
  transform: scale(0.98);
  border: 2px solid #FFD700 !important;
}

.option-card.option-correct {
  animation: correctPulse 0.5s ease;
  border: 2px solid #4CAF50 !important;
}

.option-card.option-incorrect {
  animation: incorrectShake 0.5s ease;
  border: 2px solid #f44336 !important;
}
/* Ajusta el padding para diferentes tipos */
.option-card.option-only-image {
  padding: 15px;
}

.option-card.option-with-image {
  padding: 20px;
}

.option-card:not(.option-only-image):not(.option-with-image) {
  min-height: 140px;
}
.option-content {
  position: relative;
  z-index: 1;
  text-align: center;
  width: 100%;
}

.option-letter {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 40px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

.option-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.option-image img {
  max-width: 100%;
  max-height: 70px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Feedback icon */
.feedback-icon {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  z-index: 1000;
  animation: popIn 0.3s ease;
}

.feedback-correct {
  color: #4CAF50;
  text-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
}

.feedback-incorrect {
  color: #f44336;
  text-shadow: 0 0 30px rgba(244, 67, 54, 0.5);
}

/* Resultados */
.results-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #1A1F2C, #2C3A5E);
  padding: 40px 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.results-header h2 {
  color: white;
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.results-header h2 i {
  color: #FFD700;
}

.final-score {
  background: linear-gradient(135deg, #1A1F2C, #2C3A5E);
  padding: 15px 35px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #FFD700;
}

.final-score .score {
  font-size: 2.5rem;
  font-weight: 600;
  color: #FFD700;
  line-height: 1;
  font-family: 'Playfair Display', serif;
}

.final-score .label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.results-table-container {
  max-width: 1200px;
  margin: 0 auto 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.result-question {
  color: rgb(28, 24, 24);
  font-size: 0.95rem;
}

.result-answer {
  color: rgb(28, 24, 24);
  margin-bottom: 5px;
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.result-badge.correct {
  background: rgba(76, 175, 80, 0.1);
  color: #81C784;
  border: 1px solid #4CAF50;
}

.result-badge.incorrect {
  background: rgba(244, 67, 54, 0.1);
  color: #E57373;
  border: 1px solid #f44336;
}

.results-actions {
  display: flex;
  justify-content: center;
}

.btn-save {
  background: linear-gradient(135deg, #1A1F2C, #2C3A5E);
  border: 1px solid #FFD700;
  border-radius: 8px;
  padding: 14px 40px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
}

.btn-save i {
  color: #FFD700;
}

/* Modales */
.ficha-modal :deep(.vs-popup) {
  background: linear-gradient(135deg, #1A1F2C, #2C3A5E) !important;
  border-radius: 16px !important;
  border: 1px solid rgba(255, 215, 0, 0.2) !important;
}

.ficha-modal :deep(.vs-popup--header) {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1) !important;
  padding: 16px 20px !important;
}

.ficha-modal :deep(.vs-popup--title) {
  color: white !important;
  font-size: 1.3rem !important;
  font-family: 'Playfair Display', serif !important;
}

.ficha-content {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
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
  font-size: 0.95rem;
}

.calificacion-modal :deep(.vs-popup) {
  background: linear-gradient(135deg, #1A1F2C, #2C3A5E) !important;
  border-radius: 16px !important;
  border: 1px solid rgba(255, 215, 0, 0.2) !important;
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
  flex-wrap: wrap;
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
  background: #1A1F2C;
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

.btn-confirm:hover {
  box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.imagen-modal :deep(.vs-popup) {
  background: transparent !important;
  box-shadow: none !important;
}

.imagen-content {
  text-align: center;
}

.imagen-content img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.2);
}
/* Estilos mejorados para opciones con imágenes */

/* Opción que solo contiene imagen */
.option-only-image {
  padding: 12px !important;
}

.option-only-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 180px;
  margin-top: 5px;
}

.option-image-large {
  max-width: 100%;
  max-height: 180px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.option-card:hover .option-image-large {
  transform: scale(1.05);
}

/* Opción con imagen y texto */
.option-with-image {
  padding: 16px !important;
}

.option-with-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.option-image-medium {
  max-width: 100%;
  max-height: 120px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.option-card:hover .option-image-medium {
  transform: scale(1.05);
}

.option-text-below {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  width: 100%;
  padding: 8px 5px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Opción solo texto */
.option-text-only {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  width: 100%;
}

.option-text-large {
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
  padding: 15px 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* Ajustes responsive */
@media (max-width: 768px) {
  .option-only-image-container {
    height: 140px;
  }

  .option-image-large {
    max-height: 140px;
  }

  .option-image-medium {
    max-height: 100px;
  }

  .option-text-large {
    font-size: 1.2rem;
    min-height: 80px;
  }

  .option-text-below {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .option-only-image-container {
    height: 120px;
  }

  .option-image-large {
    max-height: 120px;
  }

  .option-image-medium {
    max-height: 80px;
  }

  .option-text-large {
    font-size: 1.1rem;
    min-height: 70px;
  }
}

/* Animaciones */
@keyframes correctPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
    box-shadow: 0 0 30px rgba(76, 175, 80, 0.3) !important;
  }
}

@keyframes incorrectShake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-6px);
  }

  75% {
    transform: translateX(6px);
  }
}

@keyframes popIn {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }

  80% {
    transform: translate(-50%, -50%) scale(1.1);
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
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

/* Scroll personalizado */
.ficha-content::-webkit-scrollbar {
  width: 6px;
}

.ficha-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.ficha-content::-webkit-scrollbar-thumb {
  background: #FFD700;
  border-radius: 10px;
}

.ficha-content::-webkit-scrollbar-thumb:hover {
  background: #FFA500;
}

/* Responsive */
@media (max-width: 768px) {
  .game-header {
    padding: 15px;
  }

  .game-title h2 {
    font-size: 1.3rem;
  }

  .game-stats {
    flex-direction: column;
    gap: 8px;
  }

  .question-text {
    font-size: 1.5rem;
  }

  .results-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .results-header h2 {
    font-size: 1.5rem;
  }

  .final-score {
    padding: 12px 25px;
  }

  .final-score .score {
    font-size: 2rem;
  }
}

</style>
