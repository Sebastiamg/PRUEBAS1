<template>
<div class="game-wrapper">
    <!-- Modal Calificación -->
    <vs-popup title="Guardar calificación" :active.sync="modalCalificacion">
        <div v-if="previsualizar === 'previsualizar'">
            <h5 class="text-center p-4">Este juego está en modo previsualización, no se permite calificar.</h5>
        </div>
        <div v-else class="text-center p-4">
            <h5 class="mb-4">¿Desea enviar esta calificación para que la registre su docente?</h5>
            <div class="flex flex-wrap justify-center gap-2">
                <vs-button size="small" type="relief" color="primary" @click="guardarCalificacion()">
                    Sí, enviar calificación
                </vs-button>
                <vs-button size="small" type="relief" color="danger" @click="recargar()">
                    No, intentar nuevamente
                </vs-button>
            </div>
        </div>
    </vs-popup>

    <!-- Modal Ficha Técnica Mejorado -->
    <vs-popup title="📋 Ficha técnica del juego" :active.sync="popUpFicha" class="ficha-popup-moderno">
        <div v-for="(itemF, $indexF) in infoJuego" :key="$indexF" class="ficha-grid">
            <div class="ficha-seccion">
                <h4 class="ficha-seccion-titulo">
                    <i class="feather icon-info"></i>
                    Información General
                </h4>
                <div class="ficha-item">
                    <span class="ficha-label">🎮 Nombre:</span>
                    <span class="ficha-value">{{itemF.nombre_juego}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">📚 Asignatura:</span>
                    <span class="ficha-value">{{itemF.temas[0].nombreasignatura}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">📖 Bloque curricular:</span>
                    <span class="ficha-value">{{itemF.bloque_curricular}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">🎯 Grado:</span>
                    <span class="ficha-value">{{itemF.grado}}</span>
                </div>
            </div>

            <div class="ficha-seccion">
                <h4 class="ficha-seccion-titulo">
                    <i class="feather icon-book-open"></i>
                    Contenido Académico
                </h4>
                <div class="ficha-item">
                    <span class="ficha-label">📌 Tema:</span>
                    <span class="ficha-value">
                        <div v-for="(itemT, $indexT) in itemF.temas" :key="$indexT" class="tema-item">
                            • Unidad {{itemT.unidad}}: {{itemT.nombre_tema}}
                        </div>
                    </span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">⚡ Destrezas:</span>
                    <span class="ficha-value">{{itemF.destrezas}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">💡 Habilidades:</span>
                    <span class="ficha-value">{{itemF.habilidades}}</span>
                </div>
            </div>

            <div class="ficha-seccion">
                <h4 class="ficha-seccion-titulo">
                    <i class="feather icon-target"></i>
                    Metodología
                </h4>
                <div class="ficha-item">
                    <span class="ficha-label">🎯 Intención didáctica:</span>
                    <span class="ficha-value">{{itemF.intencion_didactica}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">💭 Consigna:</span>
                    <span class="ficha-value">{{itemF.consigna}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">⚠️ Consideraciones:</span>
                    <span class="ficha-value">{{itemF.consideraciones}}</span>
                </div>
                <div class="ficha-item">
                    <span class="ficha-label">✍️ Elaborado por:</span>
                    <span class="ficha-value">{{itemF.elaborado_por}}</span>
                </div>
            </div>
        </div>
    </vs-popup>

    <!-- Juego -->
    <div v-for="(item, $index) in infoJuego" :key="$index" class="game-content">
        <!-- Header tipo Kahoot -->
        <div class="kahoot-header">
            <div class="header-content">
                <div class="game-title-section">
                    <h1 class="game-title">{{item.nombre_juego}}</h1>
                </div>
                <div class="header-actions">
                    <!-- Timer con diseño Kahoot -->
                    <div class="kahoot-timer" :class="{'timer-critical': colorTexto === 'rojo'}">
                        <div class="timer-circle">
                            <svg viewBox="0 0 100 100" class="timer-svg">
                                <circle cx="50" cy="50" r="45" class="timer-bg" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    class="timer-progress"
                                    :style="{strokeDashoffset: 283 - (283 * timerProgress / 100)}"
                                />
                            </svg>
                            <span class="timer-text">{{reloj}}</span>
                        </div>
                    </div>

                    <vs-button
                        class="ficha-btn-moderno"
                        color="white"
                        type="flat"
                        @click="popUpFicha=true"
                        icon-pack="feather"
                        icon="icon-file-text"
                    >
                        Ficha técnica
                    </vs-button>
                </div>
            </div>
        </div>

        <!-- Juego activo -->
        <section v-if="inicio_fin" class="game-active-section">
            <!-- Barra de progreso superior -->
            <div class="game-progress-bar">
                <div class="progress-track">
                    <div class="progress-fill" :style="{width: (encontradas_total.length / total_jugar * 100) + '%'}"></div>
                </div>
                <div class="progress-stats">
                    <span class="stat-item">
                        <i class="feather icon-check-circle"></i>
                        {{encontradas_total.length}}/{{total_jugar}} palabras
                    </span>
                </div>
            </div>

            <!-- Fila de información: Vidas y palabras restantes -->
            <div class="info-row">
                <!-- Sistema de vidas más pequeño -->
                <div class="lives-container-moderno">
                    <span class="lives-label">Vidas</span>
                    <div class="lives-display">
                        <div
                            v-for="n in errores"
                            :key="n"
                            class="life-icon"
                            :class="{
                                'life-lost': n > (errores - contador_errores),
                                'life-shake': n === (errores - contador_errores + 1) && contadorFlag === 0
                            }"
                        >
                            <i class="feather icon-heart"></i>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Palabra a adivinar -->
            <div class="word-section-moderno">
                <div class="word-description-card-sobrio">
                    <i class="feather icon-help-circle"></i>
                    <p class="word-description">{{palabra_descripcion}}</p>
                </div>

                <div class="word-display-moderno">
                    <span v-for="(p, index) in palabra_escrita" :key="index" class="word-tile">
                        <span v-if="p !== '*'" class="tile-content filled">{{p}}</span>
                        <span v-else class="tile-content empty">
                            <i class="feather icon-minus"></i>
                        </span>
                    </span>
                </div>
            </div>

            <!-- Teclado mejorado con secciones separadas -->
            <div class="keyboard-section-moderno">
                <div class="keyboard-container">
                    <!-- Sección Letras A-M -->
                    <!-- <div class="keyboard-section-title">Letras</div> -->
                    <div class="keyboard-row primary-letters">
                        <button
                            v-for="letra in letras.slice(0, 13)"
                            :key="letra"
                            class="keyboard-btn-moderno"
                            :class="getButtonClass(letra)"
                            @click="comparar(letra, letras.indexOf(letra))"
                            :disabled="botones[letras.indexOf(letra)]"
                        >
                            {{letra}}
                        </button>
                    </div>

                    <!-- Sección Letras N-Z -->
                    <div class="keyboard-row primary-letters">
                        <button
                            v-for="letra in letras.slice(13, 27)"
                            :key="letra"
                            class="keyboard-btn-moderno"
                            :class="getButtonClass(letra)"
                            @click="comparar(letra, letras.indexOf(letra))"
                            :disabled="botones[letras.indexOf(letra)]"
                        >
                            {{letra}}
                        </button>
                    </div>

                    <!-- Separador visual -->
                    <div class="keyboard-divider"></div>

                    <!-- Sección Vocales con Tilde -->
                    <!-- <div class="keyboard-section-title">Vocales acentuadas</div> -->
                    <div class="keyboard-row accented-vowels">
                        <button
                            v-for="letra in letras.slice(27, 32)"
                            :key="letra"
                            class="keyboard-btn-moderno accented"
                            :class="getButtonClass(letra)"
                            @click="comparar(letra, letras.indexOf(letra))"
                            :disabled="botones[letras.indexOf(letra)]"
                        >
                            {{letra}}
                        </button>
                    </div>

                    <!-- Separador visual -->
                    <div class="keyboard-divider"></div>

                    <!-- Sección Números -->
                    <!-- <div class="keyboard-section-title">Números</div> -->
                    <div class="keyboard-row numbers">
                        <button
                            v-for="letra in letras.slice(32)"
                            :key="letra"
                            class="keyboard-btn-moderno number"
                            :class="getButtonClass(letra)"
                            @click="comparar(letra, letras.indexOf(letra))"
                            :disabled="botones[letras.indexOf(letra)]"
                        >
                            {{letra}}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Botón siguiente flotante -->
            <transition name="float">
                <div v-if="boton_siguiente" class="next-btn-flotante" @click="f_siguiente">
                    <div class="next-btn-content">
                        <span class="next-text">Siguiente palabra</span>
                        <span class="next-hint">Presiona Enter ↵</span>
                        <i class="feather icon-arrow-right"></i>
                    </div>
                </div>
            </transition>

            <!-- Mensaje de victoria/derrota -->
            <transition name="bounce">
                <div v-if="!game && win" class="game-message success">
                    <i class="feather icon-award"></i>
                    <span>¡Excelente! Palabra completada</span>
                </div>
                <div v-if="!game && lost" class="game-message danger">
                    <i class="feather icon-frown"></i>
                    <span>¡Oh no! Se acabaron las vidas</span>
                </div>
            </transition>
        </section>

        <!-- Resultados mejorados estilo Kahoot -->
        <section v-else class="results-section-moderno">
            <div class="results-container">
                <div class="results-header-moderno">
                    <h2 class="results-title">
                        <i class="feather icon-award"></i>
                        Resultados finales
                    </h2>
                    <div class="final-score-moderno">
                        <span class="score-badge">{{total_calificacion}}</span>
                        <span class="score-label">puntos</span>
                    </div>
                </div>

                <div class="results-grid">
                    <div class="results-card" v-for="(item, index) in encontradas_total" :key="index">
                        <div class="result-item">
                            <div class="result-word">{{item.palabra}}</div>
                            <div class="result-points">{{item.calificacion}} pts</div>
                        </div>
                    </div>
                </div>

                <div class="results-footer">
                    <div class="summary-stats">
                        <div class="stat-circle">
                            <span class="stat-number">{{encontradas_total.length}}</span>
                            <span class="stat-label">completadas</span>
                        </div>
                        <div class="stat-circle">
                            <span class="stat-number">{{total_jugar}}</span>
                            <span class="stat-label">totales</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
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
            popUpFicha: false,
            infoJuego: [],
            total_jugar: 0,
            a_jugar: 5,
            letras: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Á", "É", "Í", "Ó", "Ú", '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            reloj: '00:00',
            timerProgress: 100,
            x: null,
            game: true,
            win: false,
            lost: false,
            contador_aciertos: 0,
            errores: 7,
            contador_errores: 0,
            aleatorio: 0,
            palabra_escrita: [],
            botones: [],
            color_botones: [],
            grupo_palabras_total: [],
            grupo_descripcion: [],
            grupo_palabras: [],
            contadorFlag: 0,
            palabra_descripcion: '',
            palabra_longitud: 0,
            encontradas_total: [],
            inicio_fin: true,
            boton_siguiente: false,
            porcentaje_aciertos: 0,
            porcentaje_errores: 0,
            calificacion_tmp: 0,
            total_calificacion: 0,
            colorTexto: 'negro',
            usuario: [],
            calificaciones: [],
            id_juego: '',
            juego_realizado: false,
            modalCalificacion: false,
            codigo_curso: '',
            previsualizar: '',
        }
    },
    mounted() {
        this.getDatos();
        window.addEventListener('keydown', this.handleKeyPress);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeyPress);
    },
    created() {
        let me = this;
        me.id_juego = me.$route.params.id;
        me.previsualizar = me.$route.params.codigo;
        me.codigo_curso = JSON.parse(localStorage.getItem('curso_juego'));
        me.usuario = JSON.parse(localStorage.getItem('usuario'));

        let formData = new FormData();
        formData.append('id_juego', me.id_juego);
        formData.append('idusuario', me.usuario.idusuario);

        this.$http.post(this.$server_url + 'calificacion_estudiante', formData)
            .then(res => {
                me.calificaciones = res.data;
                if (me.calificaciones.length > 0) {
                    me.juego_realizado = true;
                    me.$vs.notify({
                        text: 'Nuevo intento',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    methods: {
        getButtonClass(letra) {
            const index = this.letras.indexOf(letra);
            if (this.color_botones[index]) return 'btn-success';
            if (this.botones[index]) return 'btn-disabled';
            return 'btn-default';
        },

        handleKeyPress(event) {
            if (event.keyCode === 13 || event.key === 'Enter') {
                event.preventDefault();
                if (this.boton_siguiente && this.inicio_fin) {
                    this.f_siguiente();
                }
            }
        },

        getDatos() {
            let me = this;
            me.inicio_fin = true;
            me.porcentaje_aciertos = 0;
            me.porcentaje_errores = 0;
            me.boton_siguiente = false;
            me.game = true;
            me.win = false;
            me.lost = false;
            me.palabra_escrita = [];
            me.botones = [];
            me.color_botones = [];
            me.contador_aciertos = 0;
            me.contador_errores = 0;
            me.palabra_longitud = 0;
            me.$vs.loading();

            this.$http.get(this.$server_url + 'juego_y_contenido/' + me.id_juego)
                .then(res => {
                    me.infoJuego = res.data.items;
                    me.grupo_palabras_total = me.infoJuego[0].preguntas;
                    me.calificacion_tmp = me.infoJuego[0].puntos;

                    for (let i = 0; i < me.grupo_palabras_total.length; i++) {
                        me.grupo_palabras.push(me.grupo_palabras_total[i].respuesta);
                        me.grupo_descripcion.push(me.grupo_palabras_total[i].pregunta);
                    }

                    me.$vs.loading.close();

                    if (this.a_jugar > this.grupo_palabras_total.length) {
                        this.a_jugar = this.grupo_palabras_total.length;
                    }

                    this.total_jugar = this.a_jugar;
                    this.f_tiempo(this.infoJuego[0].duracion);
                    this.generarAleatorio();
                })
                .catch(error => {
                    console.log(error);
                    me.$vs.loading.close();
                });
        },

        generarAleatorio() {
            if (this.a_jugar === 0) {
                clearInterval(this.x);
                this.modalCalificacion = true;
                this.inicio_fin = false;
                return;
            }

            this.porcentaje_aciertos = 0;
            this.porcentaje_errores = 0;
            this.boton_siguiente = false;
            this.game = true;
            this.win = false;
            this.lost = false;
            this.palabra_escrita = [];
            this.botones = [];
            this.color_botones = [];
            this.contador_aciertos = 0;
            this.contador_errores = 0;
            this.palabra_longitud = 0;

            this.aleatorio = Math.floor(Math.random() * this.grupo_palabras.length);

            for (let i = 0; i < this.grupo_palabras[this.aleatorio].length; i++) {
                if (this.grupo_palabras[this.aleatorio][i] !== " ") {
                    this.palabra_longitud++;
                }

                if (this.grupo_palabras[this.aleatorio][i] === " ") {
                    this.palabra_escrita.push('*');
                } else {
                    this.palabra_escrita.push('');
                }
            }

            this.palabra_buscar = this.mayusculas(this.grupo_palabras[this.aleatorio]);
            this.palabra_descripcion = this.grupo_descripcion[this.aleatorio];
        },

        comparar(caracter, posicion) {
            if (!this.game) return;

            this.contadorFlag = 0;
            this.botones[posicion] = true;

            for (let i = 0; i < this.palabra_buscar.length; i++) {
                if (caracter === this.palabra_buscar[i]) {
                    this.palabra_escrita[i] = caracter;
                    this.contador_aciertos++;
                    this.porcentaje_aciertos = (this.contador_aciertos * 100) / this.palabra_longitud;
                    this.contadorFlag++;
                    this.color_botones[posicion] = true;
                }
            }

            if (this.contadorFlag === 0) {
                this.contador_errores++;
                this.porcentaje_errores = (this.contador_errores * 100) / this.errores;
            }

            if (this.contador_aciertos === this.palabra_longitud) {
                this.win = true;
                this.game = false;
                this.$vs.notify({
                    text: '¡Lo conseguiste! Continúa así',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 3000
                });
            }

            if (this.contador_errores === this.errores) {
                this.lost = true;
                this.game = false;
            }

            if (!this.game) {
                this.encontradas_total.push({
                    palabra: this.palabra_buscar,
                    presionadas: this.palabra_escrita.join(""),
                    calificacion: ((this.contador_aciertos * this.calificacion_tmp) / this.palabra_longitud).toFixed(2)
                });

                this.grupo_palabras.splice(this.aleatorio, 1);
                this.grupo_descripcion.splice(this.aleatorio, 1);
                this.boton_siguiente = true;

                this.total_calificacion = 0;
                for (let index = 0; index < this.encontradas_total.length; index++) {
                    this.total_calificacion += parseFloat(this.encontradas_total[index].calificacion);
                }
                this.total_calificacion = (this.total_calificacion / this.encontradas_total.length).toFixed(2);
            }
        },

        f_siguiente() {
            this.a_jugar--;
            this.generarAleatorio();
        },

        mayusculas(value) {
            if (value >= 0 && value <= 9) {
                return value.toString();
            }
            return value.toUpperCase();
        },

        f_tiempo(numero) {
            let me = this;
            let totalSeconds = numero * 60;
            let conteoSegundos = 1000;

            me.x = setInterval(function() {
                totalSeconds--;

                let minutes = Math.floor(totalSeconds / 60);
                let seconds = totalSeconds % 60;

                me.reloj = minutes.toString().padStart(2, '0') + ':' +
                          seconds.toString().padStart(2, '0');

                me.timerProgress = (totalSeconds / (numero * 60)) * 100;

                if (totalSeconds < 1) {
                    clearInterval(me.x);
                    me.colorTexto = 'rojo';
                    me.modalCalificacion = true;
                    me.boton_siguiente = false;
                    me.$vs.notify({
                        text: '¡Tiempo agotado!',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-clock'
                    });
                    me.inicio_fin = false;
                }
            }, conteoSegundos);
        },

        guardarCalificacion() {
            let me = this;
            me.modalCalificacion = false;
            me.boton_siguiente = false;
            me.$vs.loading();

            let formData1 = new FormData();
            formData1.append('id_juego', me.id_juego);
            formData1.append('codigo_curso', me.codigo_curso.codigo);
            formData1.append('id_usuario', me.usuario.idusuario);
            formData1.append('calificacion', me.total_calificacion);

            this.$http.post(this.$server_url + 'j_guardar_calificacion', formData1)
                .then(res => {
                    me.$vs.notify({
                        text: 'Calificación enviada a su docente correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    me.$vs.loading.close();
                })
                .catch(function(error) {
                    me.$vs.loading.close();
                    console.log(error);
                });
        },

        recargar() {
            window.location.reload();
        }
    }
}
</script>

<style scoped>
.game-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #461a42 0%, #1e2b5e 100%);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
}

.game-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
}

/* Header tipo Kahoot */
.kahoot-header {
    background: linear-gradient(135deg, #6b46c1 0%, #3b2b8c 100%);
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    flex-wrap: wrap;
    gap: 20px;
}

.game-title-section h1 {
    color: white;
    font-size: 2rem;
    margin: 0;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

/* Timer circular estilo Kahoot */
.kahoot-timer {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 60px;
    padding: 10px 20px;
    backdrop-filter: blur(10px);
}

.timer-circle {
    position: relative;
    width: 70px;
    height: 70px;
}

.timer-svg {
    width: 70px;
    height: 70px;
    transform: rotate(-90deg);
}

.timer-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 8;
}

.timer-progress {
    fill: none;
    stroke: #ffd966;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 283;
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.3s ease;
}

.timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
    font-family: monospace;
}

.timer-critical .timer-progress {
    stroke: #ff6b6b;
    animation: pulse 1s infinite;
}

.ficha-btn-moderno {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    font-weight: 600;
    padding: 10px 20px !important;
    border-radius: 30px !important;
    transition: all 0.3s ease;
}

.ficha-btn-moderno:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: translateY(-2px);
}

/* Barra de progreso */
.game-progress-bar {
    margin-bottom: 20px;
}

.progress-track {
    height: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 10px;
    transition: width 0.5s ease;
}

.progress-stats {
    display: flex;
    justify-content: flex-end;
}

.stat-item {
    color: white;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(255, 255, 255, 0.1);
    padding: 5px 15px;
    border-radius: 20px;
}

/* Info row - vidas y palabras restantes */
.info-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

/* Vidas más pequeñas */
.lives-container-moderno {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    padding: 8px 15px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.lives-label {
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.lives-display {
    display: flex;
    gap: 5px;
}

.life-icon {
    color: #ff6b6b;
    font-size: 1.3rem;
    transition: all 0.3s ease;
    animation: heartBeat 1s ease infinite;
}

.life-icon.life-lost {
    opacity: 0.2;
    filter: grayscale(1);
    animation: none;
}

.life-icon.life-shake {
    animation: heartBreak 0.5s ease;
}

@keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

@keyframes heartBreak {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.3) rotate(10deg); }
    50% { transform: scale(0.8) rotate(-10deg); }
    75% { transform: scale(1.1) rotate(5deg); }
}

/* Word description card - estilo sobrio */
.word-description-card-sobrio {
    /* background: linear-gradient(135deg, #2c3e50, #34495e); */
    border-radius: 20px;
    padding: 20px;
    display: inline-flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.word-description-card-sobrio i {
    color: #ecf0f1;
    font-size: 2rem;
    opacity: 0.9;
}

.word-description-card-sobrio .word-description {
    font-size: 1.5rem;
    color: #ecf0f1;
    margin: 0;
    font-weight: 600;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Palabra sección */
.word-section-moderno {
    margin: 40px auto;
    text-align: center;
}

.word-display-moderno {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
}

.word-tile {
    perspective: 1000px;
}

.tile-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    border-radius: 16px;
    font-size: 2rem;
    font-weight: 700;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.tile-content.filled {
    background: linear-gradient(135deg, #ffd966, #ffb347);
    color: #333;
    transform: scale(1);
}

.tile-content.empty {
    background: rgba(255, 255, 255, 0.1);
    border: 3px dashed rgba(255, 255, 255, 0.3);
    color: white;
}

.tile-content:hover {
    transform: translateY(-5px);
}

/* Teclado estilo teclado real con secciones */
.keyboard-section-moderno {
    margin: 30px 0;
    padding: 25px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 30px;
    box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.3), 0 15px 25px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.keyboard-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 900px;
    margin: 0 auto;
}

.keyboard-section-title {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
    padding-left: 10px;
    border-left: 3px solid #4facfe;
}

.keyboard-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 5px;
}

.keyboard-divider {
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    margin: 10px 0;
}

.keyboard-btn-moderno {
    width: 55px;
    height: 55px;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 5px 0 #4a4a4a, 0 8px 15px rgba(0, 0, 0, 0.3);
    background: linear-gradient(145deg, #ffffff, #e8e8e8);
    color: #333;
    border: 1px solid #ddd;
    position: relative;
    top: 0;
}

.keyboard-btn-moderno.accented {
    background: linear-gradient(145deg, #ffe66d, #f0c45a);
    color: #333;
    border: 1px solid #e0b84d;
    box-shadow: 0 5px 0 #c29b3f, 0 8px 15px rgba(255, 230, 109, 0.2);
}

.keyboard-btn-moderno.number {
    background: linear-gradient(145deg, #a8e6cf, #7cc4a8);
    color: #1a3b2f;
    border: 1px solid #6baa92;
    box-shadow: 0 5px 0 #4f806e, 0 8px 15px rgba(168, 230, 207, 0.2);
}

.keyboard-btn-moderno:active:not(:disabled) {
    top: 4px;
    box-shadow: 0 1px 0 #666, 0 5px 10px rgba(0, 0, 0, 0.3);
}

.keyboard-btn-moderno.btn-default {
    background: linear-gradient(145deg, #ffffff, #e8e8e8);
    color: #333;
    border: 1px solid #ddd;
}

.keyboard-btn-moderno.btn-success {
    background: linear-gradient(145deg, #4caf50, #3d8b40);
    color: white;
    box-shadow: 0 5px 0 #2d6a2f, 0 8px 15px rgba(76, 175, 80, 0.4);
    border: 1px solid #45a049;
}

.keyboard-btn-moderno.btn-disabled {
    background: linear-gradient(145deg, #a0a0a0, #8a8a8a);
    color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 5px 0 #666, 0 8px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid #999;
    cursor: not-allowed;
    top: 4px;
    opacity: 0.7;
}

.keyboard-btn-moderno:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #666, 0 12px 20px rgba(0, 0, 0, 0.3);
}

.keyboard-btn-moderno:not(:disabled) {
    animation: keyGlow 2s infinite;
}

@keyframes keyGlow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.05); }
}

/* Botón siguiente flotante */
.next-btn-flotante {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
    cursor: pointer;
    animation: floatIn 0.5s ease;
}

@keyframes floatIn {
    0% {
        transform: translateY(100px) scale(0);
        opacity: 0;
    }
    70% {
        transform: translateY(-10px) scale(1.1);
        opacity: 0.9;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.next-btn-content {
    background: linear-gradient(135deg, #4caf50, #45a049);
    padding: 15px 30px;
    border-radius: 60px;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.next-btn-content:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 20px 40px rgba(76, 175, 80, 0.6);
}

.next-text {
    font-size: 1.2rem;
    white-space: nowrap;
}

.next-hint {
    font-size: 0.8rem;
    opacity: 0.8;
    padding: 3px 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    white-space: nowrap;
}

.next-btn-content i {
    font-size: 1.5rem;
    animation: arrowMove 1s ease infinite;
}

@keyframes arrowMove {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
}

.float-enter-active {
    animation: floatIn 0.5s ease;
}

.float-leave-active {
    animation: floatOut 0.5s ease;
}

@keyframes floatOut {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    30% {
        transform: translateY(-10px) scale(1.1);
        opacity: 0.9;
    }
    100% {
        transform: translateY(100px) scale(0);
        opacity: 0;
    }
}

/* Mensajes del juego */
.game-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 50px;
    border-radius: 20px;
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 1000;
}

.bounce-enter-active {
    animation: messagePop 0.5s ease;
}

.bounce-leave-active {
    animation: messagePop 0.5s ease reverse;
}

@keyframes messagePop {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    80% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.9;
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

.game-message.success {
    background: linear-gradient(135deg, #4caf50, #45a049);
    color: white;
    box-shadow: 0 20px 40px rgba(76, 175, 80, 0.3);
}

.game-message.danger {
    background: linear-gradient(135deg, #ff6b6b, #ff4757);
    color: white;
    box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
}

/* Resultados estilo Kahoot */
.results-section-moderno {
    padding: 40px 0;
}

.results-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    padding: 40px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.results-header-moderno {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
}

.results-title {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    font-size: 2rem;
    margin: 0;
}

.final-score-moderno {
    background: linear-gradient(135deg, #ffd966, #ffb347);
    padding: 20px 40px;
    border-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.score-badge {
    font-size: 3rem;
    font-weight: 700;
    color: #333;
    line-height: 1;
}

.score-label {
    color: #333;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.results-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 20px;
    transition: all 0.3s ease;
}

.results-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.result-word {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
}

.result-points {
    background: linear-gradient(135deg, #6b46c1, #3b2b8c);
    color: white;
    padding: 5px 15px;
    border-radius: 30px;
    font-weight: 600;
}

.results-footer {
    margin-top: 40px;
}

.summary-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
}

.stat-circle {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 3rem;
    font-weight: 700;
    color: white;
    line-height: 1;
}

.stat-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Ficha técnica moderna */
.ficha-popup-moderno :deep(.vs-popup) {
    max-width: 1000px !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border-radius: 30px !important;
}

.ficha-popup-moderno :deep(.vs-popup--header) {
    background: transparent !important;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2) !important;
}

.ficha-popup-moderno :deep(.vs-popup--title) {
    color: white !important;
    font-size: 1.5rem !important;
}

.ficha-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px;
}

.ficha-seccion {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.ficha-seccion-titulo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #6b46c1;
    font-size: 1.2rem;
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #e9ecef;
}

.ficha-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e9ecef;
}

.ficha-label {
    font-weight: 600;
    color: #6b46c1;
    font-size: 0.9rem;
    margin-bottom: 5px;
}

.ficha-value {
    color: #333;
    line-height: 1.5;
}

.tema-item {
    margin-bottom: 5px;
}

/* Responsive */
@media (max-width: 768px) {
    .game-wrapper {
        padding: 10px;
    }

    .header-content {
        flex-direction: column;
        text-align: center;
    }

    .game-title-section h1 {
        font-size: 1.5rem;
    }

    .header-actions {
        flex-direction: column;
        width: 100%;
    }

    .timer-circle {
        width: 50px;
        height: 50px;
    }

    .timer-svg {
        width: 50px;
        height: 50px;
    }

    .timer-text {
        font-size: 0.9rem;
    }

    .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .tile-content {
        width: 45px;
        height: 45px;
        font-size: 1.3rem;
    }

    .keyboard-btn-moderno {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }

    .results-header-moderno {
        flex-direction: column;
    }

    .game-message {
        font-size: 1.2rem;
        padding: 20px 30px;
    }

    .ficha-grid {
        grid-template-columns: 1fr;
    }

    .next-btn-flotante {
        bottom: 20px;
        right: 20px;
        left: 20px;
    }

    .next-btn-content {
        padding: 12px 20px;
        justify-content: center;
    }

    .next-text {
        font-size: 1rem;
    }

    .next-hint {
        display: none;
    }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
</style>
