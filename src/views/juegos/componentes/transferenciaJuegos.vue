<template>
<div class="tj-container" :class="themeMode ? 'tj-dark' : 'tj-light'">
    <div class="tj-inner">
        <!-- Encabezado -->
        <div class="tj-header">
            <h2 class="tj-title" :class="themeMode ? 'tj-title-dark' : 'tj-title-light'">
                Transferencia de Juego
            </h2>
            <p class="tj-subtitle" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                Seleccione la asignatura, unidad y tema de destino al que desea transferir este juego.
            </p>
        </div>
        <!-- {{ Data_Enviar }} -->
        <!-- Cards principales: Origen + Flecha + Destino -->
        <div class="tj-grid">

            <!-- TARJETA: ORIGEN -->
            <div class="tj-card tj-card-origen" :class="themeMode ? 'tj-card-dark' : 'tj-card-light'">
                <!-- Glow de fondo -->
                <div class="tj-card-glow tj-glow-blue"></div>

                <div class="tj-card-body">
                    <!-- Header tarjeta -->
                    <div class="tj-card-header-row">
                        <div class="tj-icon-badge tj-badge-blue">
                            <i class="feather icon-upload-cloud"></i>
                        </div>
                        <div>
                            <h3 class="tj-card-title" :class="themeMode ? 'text-white' : 'text-gray-800'">Origen</h3>
                            <span class="tj-card-label" :class="themeMode ? 'text-blue-400' : 'text-blue-500'">Juego actual</span>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="tj-info-list">
                        <div class="tj-info-card" :class="themeMode ? 'tj-info-dark' : 'tj-info-light'">
                            <span class="tj-info-label" :class="themeMode ? 'text-gray-500' : 'text-gray-400'">
                                <i class="feather icon-play-circle mr-1"></i> Nombre del Juego
                            </span>
                            <span class="tj-info-value" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                {{ Data_Enviar.nombre_juego || 'Nombre no disponible' }}
                            </span>
                        </div>

                        <div class="tj-info-card" :class="themeMode ? 'tj-info-dark' : 'tj-info-light'">
                            <span class="tj-info-label" :class="themeMode ? 'text-gray-500' : 'text-gray-400'">
                                <i class="feather icon-book mr-1"></i> Asignatura Actual
                            </span>
                            <div class="tj-info-value" :class="themeMode ? 'text-gray-200' : 'text-gray-700'">
                                <span class="tj-dot" :class="themeMode ? 'text-indigo-400' : 'text-indigo-500'">•</span>
                                {{ Data_Enviar.temas && Data_Enviar.temas[0] ? Data_Enviar.temas[0].nombreasignatura : 'Desconocida' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FLECHA CENTRAL -->
            <div class="tj-arrow-col">
                <div class="tj-arrow-circle" :class="themeMode ? 'tj-arrow-dark' : 'tj-arrow-light'">
                    <i class="feather icon-arrow-right tj-arrow-icon"></i>
                </div>
            </div>

            <!-- TARJETA: DESTINO -->
            <div class="tj-card tj-card-destino" :class="themeMode ? 'tj-card-dark' : 'tj-card-light'">
                <!-- Glow de fondo -->
                <div class="tj-card-glow tj-glow-purple"></div>

                <div class="tj-card-body">
                    <!-- Header tarjeta -->
                    <div class="tj-card-header-row">
                        <div class="tj-icon-badge tj-badge-purple">
                            <i class="feather icon-download-cloud"></i>
                        </div>
                        <div>
                            <h3 class="tj-card-title" :class="themeMode ? 'text-white' : 'text-gray-800'">Destino</h3>
                            <span class="tj-card-label" :class="themeMode ? 'text-purple-400' : 'text-purple-500'">Ruta de transferencia</span>
                        </div>
                    </div>

                    <!-- Selectores -->
                    <div class="tj-selectors">
                        <!-- 1. Asignatura -->
                        <div class="tj-selector-group">
                            <label class="tj-selector-label" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">
                                <span class="tj-step-badge tj-step-purple">1</span>
                                Asignatura
                            </label>
                            <div class="tj-select-wrapper" :class="themeMode ? 'tj-select-dark' : 'tj-select-light'">
                                <v-select v-model="Destino_asignaturaSelect" :options="Asignaturas_para_Transferencia" label="nombreasignatura" placeholder="🔍  Buscar asignatura..." :filter="customFilter" @input="get_Buscar_Unidades_x_Asignatura_Destino" @open="isDropdownOpen = true" @close="isDropdownOpen = false" />
                            </div>
                        </div>

                        <!-- 2. Unidad (aparece si hay asignatura) -->
                        <transition name="tj-fade-down">
                            <div v-if="Destino_asignaturaSelect" class="tj-selector-group">
                                <label class="tj-selector-label" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">
                                    <span class="tj-step-badge tj-step-pink">2</span>
                                    Unidad
                                </label>
                                <div class="tj-select-wrapper" :class="themeMode ? 'tj-select-dark' : 'tj-select-light'">
                                    <v-select v-model="Destino_unidadSelect" :options="Unidades_para_Transferencia" label="nombre_unidad" placeholder="🔍  Buscar unidad..." :filter="customFilter" @input="get_Buscar_Temas_x_Unidad_Destino" @open="isDropdownOpen = true" @close="isDropdownOpen = false">
                                        <template slot="option" slot-scope="option">
                                            <div class="tj-select-option">
                                                <span class="tj-unit-badge" :class="themeMode ? 'tj-unit-badge-dark' : 'tj-unit-badge-light'">U{{ option.unidad }}</span>
                                                <span :class="themeMode ? 'text-gray-200' : 'text-gray-700'">{{ option.nombre_unidad }}</span>
                                            </div>
                                        </template>
                                        <template slot="selected-option" slot-scope="option">
                                            <div class="tj-select-option">
                                                <span class="tj-unit-badge" :class="themeMode ? 'tj-unit-badge-dark' : 'tj-unit-badge-light'">U{{ option.unidad }}</span>
                                                <span :class="themeMode ? 'text-gray-200' : 'text-gray-700'">{{ option.nombre_unidad }}</span>
                                            </div>
                                        </template>
                                    </v-select>
                                </div>
                            </div>
                        </transition>

                        <!-- 3. Tema (aparece si hay unidad) -->
                        <transition name="tj-fade-down">
                            <div v-if="Destino_unidadSelect" class="tj-selector-group tj-selector-divider" :class="themeMode ? 'tj-divider-dark' : 'tj-divider-light'">
                                <label class="tj-selector-label" :class="themeMode ? 'text-gray-400' : 'text-gray-600'">
                                    <span class="tj-step-badge tj-step-indigo">3</span>
                                    Tema
                                </label>
                                <div class="tj-select-wrapper" :class="themeMode ? 'tj-select-dark' : 'tj-select-light'">
                                    <v-select multiple v-model="Destino_temaSelect" :options="Temas_para_Transferencia" label="nombre_tema" placeholder="🎯  Seleccione uno o más temas..." :filter="customFilter" @open="isDropdownOpen = true" @close="isDropdownOpen = false" />
                                </div>
                            </div>
                        </transition>
                    </div>
                    <!-- Espaciador dinámico para el dropdown -->
                    <div class="tj-spacer" :style="{ height: isDropdownOpen ? '280px' : '0px', transition: 'height 0.3s ease' }"></div>
                </div>
            </div>
        </div>

        <!-- Banner de estado -->
        <transition name="tj-fade-down">
            <div v-if="isTransferFormValid" class="tj-banner tj-banner-success" :class="themeMode ? 'tj-banner-success-dark' : 'tj-banner-success-light'">
                <div class="tj-banner-icon tj-banner-icon-success">
                    <i class="feather icon-check-circle"></i>
                </div>
                <div>
                    <h4 class="tj-banner-title" :class="themeMode ? 'text-emerald-300' : 'text-emerald-800'">¡Listo para transferir!</h4>
                    <p class="tj-banner-text" :class="themeMode ? 'text-emerald-200' : 'text-emerald-700'">
                        El juego se copiará y estará disponible en la plataforma de la asignatura seleccionada.
                    </p>
                </div>
            </div>
            <div v-else class="tj-banner tj-banner-info" :class="themeMode ? 'tj-banner-info-dark' : 'tj-banner-info-light'">
                <div class="tj-banner-icon tj-banner-icon-info">
                    <i class="feather icon-info"></i>
                </div>
                <div>
                    <h4 class="tj-banner-title" :class="themeMode ? 'text-yellow-300' : 'text-yellow-800'">Información</h4>
                    <p class="tj-banner-text" :class="themeMode ? 'text-yellow-200' : 'text-yellow-700'">
                        Complete la secuencia (Asignatura ➜ Unidad ➜ Tema) para habilitar el botón de transferencia.
                    </p>
                </div>
            </div>
        </transition>

        <!-- Botón de acción -->
        <div class="tj-action">
            <vs-button color="success" type="gradient" size="large" class="tj-btn-transferir" :disabled="!isTransferFormValid" icon-pack="feather" icon="icon-save" @click="CompletarTransferencia">
                <span>Confirmar Transferencia</span>
            </vs-button>
        </div>
    </div>
</div>
</template>

<script>
import vSelect from "vue-select";
export default {
    components: {
        "v-select": vSelect,
    },
    props: {
        Data_Enviar: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            Destino_asignaturaSelect: null,
            Destino_unidadSelect: null,
            Destino_temaSelect: [],
            Asignaturas_para_Transferencia: [],
            Unidades_para_Transferencia: [],
            Temas_para_Transferencia: [],
            isDropdownOpen: false,
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        isTransferFormValid() {
            return (
                this.Destino_asignaturaSelect != null &&
                this.Destino_unidadSelect != null &&
                this.Destino_temaSelect &&
                this.Destino_temaSelect.length > 0
            );
        }
    },
    mounted() {
        this.Consultar_Asignaturas();
    },
    methods: {
        async Consultar_Asignaturas() {
            try {
                this.$vs.loading();
                let enviardata = {
                    action: 'Consulta_Asignatura_Juegos_Transferencia',
                    id_asignatura: (this.Data_Enviar.temas && this.Data_Enviar.temas.length > 0) ? this.Data_Enviar.temas[0].idasignatura : 0,
                };
                let response = await this.$http.get(this.$server_url + 'Procesar_MetodosGet_JuegosController', {
                    params: enviardata
                });
                if (response.data && response.data.length > 0) {
                    this.Asignaturas_para_Transferencia = response.data;
                }
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al cargar asignaturas:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'Error al cargar las asignaturas disponibles.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        async get_Buscar_Unidades_x_Asignatura_Destino() {
            this.Destino_unidadSelect = null;
            this.Destino_temaSelect = [];
            this.Unidades_para_Transferencia = [];
            this.Temas_para_Transferencia = [];

            if (!this.Destino_asignaturaSelect) return;

            try {
                this.$vs.loading();
                let enviardata = {
                    action: 'Consulta_Unidades_Juegos_Transferencia',
                    id_asignatura: this.Destino_asignaturaSelect.idasignatura,
                };
                let response = await this.$http.get(this.$server_url + 'Procesar_MetodosGet_JuegosController', {
                    params: enviardata
                });
                if (response.data && response.data.length > 0) {
                    this.Unidades_para_Transferencia = response.data;
                }
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al cargar unidades:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron cargar las unidades.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        async get_Buscar_Temas_x_Unidad_Destino() {
            this.Destino_temaSelect = [];
            this.Temas_para_Transferencia = [];

            if (!this.Destino_unidadSelect) return;

            try {
                this.$vs.loading();
                let enviardata = {
                    action: 'Consulta_Temas_Juegos_Transferencia',
                    id_unidad: this.Destino_unidadSelect.id_unidad_libro,
                };
                let response = await this.$http.get(this.$server_url + 'Procesar_MetodosGet_JuegosController', {
                    params: enviardata
                });
                if (response.data && response.data.length > 0) {
                    this.Temas_para_Transferencia = response.data;
                }
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al cargar temas:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron cargar los temas',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        async CompletarTransferencia() {
            if (!this.isTransferFormValid) return;
            let usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
            let user_created = usuarioLocal.idusuario;
            let datos = {
                "action": "Transferencia_Juegos_Asignatura",
                "id_juego": this.Data_Enviar.id_juego,
                "asignatura_recibir_transferencia": this.Destino_asignaturaSelect,
                "unidad_recibir_transferencia": this.Destino_unidadSelect,
                "temas_recibir_transferencia": this.Destino_temaSelect,
                "id_tipo_juego": this.Data_Enviar.id_tipo_juego,
                "user_created": user_created
            };

            try {
                this.$vs.loading();

                // PASO 1: Llamar al server para copiar registros en BD
                const resServer = await this.$http.post(this.$server_url + 'Procesar_MetodosPost_JuegosController', datos);

                if (!resServer.data || resServer.data.status !== 1) {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: resServer.data.message || 'Error al copiar el juego en base de datos.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 10000
                    });
                    return;
                }

                const imagenesContenido = resServer.data.imagenes_contenido || [];
                const imagenesOpciones  = resServer.data.imagenes_opciones  || [];
                const idTipoJuego       = resServer.data.id_tipo_juego;
                const totalImagenes     = imagenesContenido.length + imagenesOpciones.length;

                let imagenesExitosas = 0;
                let imagenesFallidas = 0;
                let imagenesProcesadas = 0;

                if (totalImagenes > 0) {
                    this.$vs.loading.close();
                    this.showOverlay(`Iniciando copia de ${totalImagenes} imágenes... No cierre la ventana.`);
                }

                // PASO 2 y 3: Por cada imagen de contenido → copiar en files-server → actualizar nombre en BD
                for (const item of imagenesContenido) {
                    try {
                        const resCopia = await this.$http.post(this.$data_url + 'api/copiarImagenJuego', {
                            nombre_imagen:  item.imagen_origen,
                            id_tipo_juego:  idTipoJuego
                        });
                        if (resCopia.data && resCopia.data.status === 1) {
                            imagenesExitosas++;
                            // Actualizar el nombre de la imagen en la BD del server
                            await this.$http.post(this.$server_url + 'Procesar_MetodosPost_JuegosController', {
                                action: 'Actualizar_Imagen_Contenido_Juego',
                                id_contenido_juego: item.id_contenido_nuevo,
                                nuevo_nombre: resCopia.data.nuevo_nombre
                            });
                        } else {
                            imagenesFallidas++;
                        }
                    } catch (errImg) {
                        imagenesFallidas++;
                        console.warn('No se pudo copiar imagen de contenido:', item.imagen_origen, errImg);
                    }
                    imagenesProcesadas++;
                    this.updateOverlayProgress(imagenesProcesadas, totalImagenes, "imágenes de contenido");
                }

                // PASO 2 y 3: Por cada imagen de opción → copiar en files-server → actualizar nombre en BD
                for (const item of imagenesOpciones) {
                    try {
                        const resCopia = await this.$http.post(this.$data_url + 'api/copiarImagenJuego', {
                            nombre_imagen:  item.imagen_opcion_origen,
                            id_tipo_juego:  idTipoJuego
                        });
                        if (resCopia.data && resCopia.data.status === 1) {
                            imagenesExitosas++;
                            await this.$http.post(this.$server_url + 'Procesar_MetodosPost_JuegosController', {
                                action: 'Actualizar_Imagen_Opcion_Juego',
                                id_opcion_contenido: item.id_opcion_nuevo,
                                nuevo_nombre: resCopia.data.nuevo_nombre
                            });
                        } else {
                            imagenesFallidas++;
                        }
                    } catch (errImg) {
                        imagenesFallidas++;
                        console.warn('No se pudo copiar imagen de opción:', item.imagen_opcion_origen, errImg);
                    }
                    imagenesProcesadas++;
                    this.updateOverlayProgress(imagenesProcesadas, totalImagenes, "imágenes de opciones");
                }

                if (totalImagenes > 0) {
                    this.hideOverlay();
                } else {
                    this.$vs.loading.close();
                }

                let title = 'Completado';
                let text = 'El juego ha sido transferido con éxito.';
                let color = 'success';
                let icon = 'icon-check-circle';

                if (totalImagenes > 0) {
                    if (imagenesFallidas === 0) {
                        text = `Juego transferido con éxito. Se copiaron ${imagenesExitosas} imagen(es) correctamente.`;
                    } else if (imagenesExitosas > 0) {
                        title = 'Completado con advertencias';
                        text = `Juego transferido. Se copiaron ${imagenesExitosas} imagen(es), pero fallaron ${imagenesFallidas} (es posible que el archivo origen no exista).`;
                        color = 'warning';
                        icon = 'icon-alert-triangle';
                    } else {
                        title = 'Completado con errores en imágenes';
                        text = `Juego transferido, pero falló la copia de las ${imagenesFallidas} imagen(es).`;
                        color = 'warning';
                        icon = 'icon-alert-triangle';
                    }
                } else {
                    text = 'Juego transferido con éxito (no contenía imágenes).';
                }

                this.$vs.notify({
                    title: title,
                    text: text,
                    color: color,
                    iconPack: 'feather',
                    icon: icon,
                    time: imagenesFallidas > 0 ? 8000 : 4000
                });
                
                this.limpiarFormulario();
                // this.$emit('change', {
                //     verificacionemittransferenciaJuegos: 1
                // });

            } catch (err) {
                this.hideOverlay();
                this.$vs.loading.close();

                let errorMsg = 'Ocurrió un error en el servidor al transferir.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMsg = err.response.data.message;
                }

                this.$vs.notify({
                    title: 'Error',
                    text: errorMsg,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x',
                    time: 10000
                });
                console.error("Error al transferir Juego", err);
            }
        },
        limpiarFormulario() {
            this.Destino_asignaturaSelect = null;
            this.Destino_unidadSelect = null;
            this.Destino_temaSelect = [];
            this.Unidades_para_Transferencia = [];
            this.Temas_para_Transferencia = [];
        },
        // ===== HELPERS OVERLAY =====
        showOverlay(mensaje) {
            let overlay = document.getElementById('global-overlay-blocker');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'global-overlay-blocker';
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.85); z-index: 99999;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; font-family: sans-serif; backdrop-filter: blur(5px);
                `;
                document.body.appendChild(overlay);
            }
            overlay.innerHTML = `
                <div style="font-size: 50px; margin-bottom: 20px;" class="animate-spin">🔄</div>
                <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Tranfiriendo Imágenes...</h2>
                <p id="overlay-msg" style="margin-top: 10px; font-size: 16px; color: #ccc;">${mensaje}</p>
                <div style="width: 300px; height: 8px; background: #333; border-radius: 4px; margin-top: 20px; overflow: hidden;">
                    <div id="overlay-bar" style="width: 0%; height: 100%; background: #4CAF50; transition: width 0.3s;"></div>
                </div>
            `;
        },
        updateOverlayProgress(actual, total, submensaje) {
            const overlayMsg = document.getElementById('overlay-msg');
            const overlayBar = document.getElementById('overlay-bar');
            if (overlayMsg) {
                overlayMsg.innerText = `Copiando ${actual} de ${total} (${submensaje})...`;
            }
            if (overlayBar && total > 0) {
                const porcentaje = Math.round((actual / total) * 100);
                overlayBar.style.width = `${porcentaje}%`;
            }
        },
        hideOverlay() {
            const overlay = document.getElementById('global-overlay-blocker');
            if (overlay) overlay.remove();
        },
        customFilter(options, search) {
            if (!search) return options;
            const searchTerms = search.toLowerCase().split(/\s+/).filter(t => t);

            return options.filter(option => {
                const label1 = (option.nombreasignatura || "").toLowerCase();
                const label2 = (option.nombre_unidad || "").toLowerCase();
                const label3 = (option.nombre_tema || "").toLowerCase();
                const fullLabel = `${label1} ${label2} ${label3}`;

                return searchTerms.every(term => fullLabel.includes(term));
            });
        }
    },
};
</script>

<style scoped>
/* =====================
   CONTENEDOR BASE
===================== */
.tj-container {
    min-height: 400px;
    padding: 1.5rem;
    transition: background 0.3s ease, color 0.3s ease;
}

.tj-light {
    background: transparent;
    color: #1e293b;
}

.tj-dark {
    background: transparent;
    color: #f1f5f9;
}

.tj-inner {
    max-width: 1100px;
    margin: 0 auto;
}

/* =====================
   ENCABEZADO
===================== */
.tj-header {
    text-align: center;
    margin-bottom: 2.5rem;
    margin-top: 1rem;
}

.tj-title {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
}

.tj-title-light {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tj-title-dark {
    background: linear-gradient(135deg, #60a5fa, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tj-subtitle {
    font-size: 1rem;
    line-height: 1.6;
}

/* =====================
   GRID 2 COLUMNAS + FLECHA
===================== */
.tj-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.5rem;
    align-items: stretch;
    margin-bottom: 1.75rem;
}

@media (max-width: 768px) {
    .tj-grid {
        grid-template-columns: 1fr;
    }

    .tj-arrow-col {
        display: none !important;
    }
}

/* =====================
   TARJETAS
===================== */
.tj-card {
    position: relative;
    border-radius: 1.5rem;
    overflow: visible;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.tj-card-light {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.tj-card-dark {
    background: #1e293b;
    border: 1px solid #334155;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.tj-card:hover {
    transform: translateY(-3px);
}

.tj-card-glow {
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    border-radius: 1.5rem;
}

.tj-card:hover .tj-card-glow {
    opacity: 1;
}

.tj-glow-blue {
    background: radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.12), transparent 70%);
}

.tj-glow-purple {
    background: radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.12), transparent 70%);
}

.tj-card-body {
    position: relative;
    z-index: 1;
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow: visible;
}

/* =====================
   HEADER FILA TARJETA
===================== */
.tj-card-header-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.tj-icon-badge {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.tj-badge-blue {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #2563eb;
}

.tj-badge-purple {
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    color: #7c3aed;
}

.tj-dark .tj-badge-blue {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(59, 130, 246, 0.2));
    color: #93c5fd;
}

.tj-dark .tj-badge-purple {
    background: linear-gradient(135deg, rgba(109, 40, 217, 0.3), rgba(139, 92, 246, 0.2));
    color: #c4b5fd;
}

.tj-card-title {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
}

.tj-card-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

/* =====================
   INFO CARDS (origen)
===================== */
.tj-info-list {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
}

.tj-info-card {
    padding: 1rem 1.25rem;
    border-radius: 0.875rem;
    border: 1px solid transparent;
    transition: box-shadow 0.2s;
}

.tj-info-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tj-info-light {
    background: #f8fafc;
    border-color: #f1f5f9;
}

.tj-info-dark {
    background: rgba(15, 23, 42, 0.5);
    border-color: #334155;
}

.tj-info-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 0.4rem;
}

.tj-info-value {
    font-size: 1.05rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.tj-dot {
    font-size: 1.5rem;
    line-height: 1;
}

/* =====================
   FLECHA CENTRAL
===================== */
.tj-arrow-col {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.tj-arrow-circle {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
}

.tj-arrow-circle:hover {
    transform: scale(1.12);
}

.tj-arrow-light {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    color: #6366f1;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
}

.tj-arrow-dark {
    background: #1e293b;
    border: 2px solid #334155;
    color: #a5b4fc;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
}

.tj-arrow-icon {
    font-size: 1.75rem;
    transition: transform 0.3s;
}

.tj-arrow-circle:hover .tj-arrow-icon {
    transform: translateX(4px);
}

/* =====================
   SELECTORES (destino)
===================== */
.tj-selectors {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.tj-selector-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tj-selector-divider {
    padding-top: 1.25rem;
    border-top: 1px dashed;
}

.tj-divider-light {
    border-top-color: #e2e8f0;
}

.tj-divider-dark {
    border-top-color: #334155;
}

.tj-selector-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
}

.tj-step-badge {
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 800;
    flex-shrink: 0;
}

.tj-step-purple {
    background: #ede9fe;
    color: #7c3aed;
}

.tj-step-pink {
    background: #fce7f3;
    color: #be185d;
}

.tj-step-indigo {
    background: #e0e7ff;
    color: #4338ca;
}

.tj-dark .tj-step-purple {
    background: rgba(109, 40, 217, 0.25);
    color: #c4b5fd;
}

.tj-dark .tj-step-pink {
    background: rgba(190, 24, 93, 0.25);
    color: #f9a8d4;
}

.tj-dark .tj-step-indigo {
    background: rgba(67, 56, 202, 0.25);
    color: #a5b4fc;
}

/* Vue-select wrapper */
.tj-select-wrapper>>>.vs__dropdown-toggle {
    border: 2px solid #e2e8f0;
    border-radius: 0.875rem;
    padding: 0.55rem 0.75rem;
    background-color: #f8fafc;
    transition: all 0.25s ease;
}

.tj-select-wrapper>>>.vs__dropdown-toggle:hover,
.tj-select-wrapper>>>.vs__dropdown-toggle:focus-within {
    border-color: rgba(var(--vs-primary), 1);
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(var(--vs-primary), 0.12);
}

.tj-select-wrapper>>>.vs__selected {
    font-weight: 700;
    color: #1e293b;
    font-size: 0.95rem;
}

.tj-select-wrapper>>>.vs__search::placeholder {
    color: #94a3b8;
    font-weight: 500;
}

.tj-select-wrapper>>>.vs__clear,
.tj-select-wrapper>>>.vs__open-indicator {
    fill: #64748b;
}

/* Dark overrides */
.tj-select-dark>>>.vs__dropdown-toggle {
    background-color: rgba(15, 23, 42, 0.6);
    border-color: #334155;
}

.tj-select-dark>>>.vs__dropdown-toggle:hover,
.tj-select-dark>>>.vs__dropdown-toggle:focus-within {
    background-color: rgba(15, 23, 42, 0.9);
    border-color: rgba(var(--vs-primary), 1);
}

.tj-select-dark>>>.vs__selected {
    color: #f1f5f9;
}

.tj-select-dark>>>.vs__search {
    color: #f1f5f9;
}

.tj-select-dark>>>.vs__search::placeholder {
    color: #64748b;
}

.tj-select-dark>>>.vs__clear,
.tj-select-dark>>>.vs__open-indicator {
    fill: #94a3b8;
}

.tj-select-dark>>>.vs__dropdown-menu {
    background-color: #1e293b;
    border-color: #334155;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.tj-select-dark>>>.vs__dropdown-option {
    color: #cbd5e1;
    padding: 0.75rem 1rem;
    font-weight: 500;
}

.tj-select-dark>>>.vs__dropdown-option:hover {
    background-color: rgba(51, 65, 85, 0.7);
}

.tj-select-dark>>>.vs__dropdown-option--highlight {
    background-color: #4f46e5;
    color: #fff;
}

/* Opción de unidad */
.tj-select-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tj-unit-badge {
    font-size: 0.65rem;
    font-weight: 800;
    padding: 0.15rem 0.45rem;
    border-radius: 0.375rem;
    border: 1px solid;
    flex-shrink: 0;
}

.tj-unit-badge-light {
    background: #fce7f3;
    color: #be185d;
    border-color: #fbcfe8;
}

.tj-unit-badge-dark {
    background: rgba(190, 24, 93, 0.2);
    color: #f9a8d4;
    border-color: rgba(190, 24, 93, 0.3);
}

/* =====================
   BANNERS DE ESTADO
===================== */
.tj-banner {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem 1.5rem;
    border-radius: 1rem;
    border: 1px solid;
    margin: 0 auto;
    max-width: 860px;
    margin-bottom: 1.75rem;
    transition: all 0.3s ease;
}

.tj-banner-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.tj-banner-icon-success {
    animation: tj-bounce 1.5s infinite;
}

.tj-banner-success-light {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border-color: #a7f3d0;
}

.tj-banner-success-dark {
    background: rgba(6, 78, 59, 0.3);
    border-color: rgba(16, 185, 129, 0.3);
}

.tj-banner-icon-success.tj-banner-success-light {
    background: #d1fae5;
    color: #065f46;
}

.tj-banner-icon-success {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
}

.tj-banner-info-light {
    background: linear-gradient(135deg, #fefce8, #fef9c3);
    border-color: #fde68a;
}

.tj-banner-info-dark {
    background: rgba(78, 56, 6, 0.25);
    border-color: rgba(202, 138, 4, 0.3);
}

.tj-banner-icon-info {
    background: rgba(234, 179, 8, 0.2);
    color: #facc15;
}

.tj-banner-title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 0.2rem;
}

.tj-banner-text {
    font-size: 0.85rem;
    font-weight: 500;
    margin: 0;
    line-height: 1.5;
    opacity: 0.9;
}

/* =====================
   BOTÓN DE ACCIÓN
===================== */
.tj-action {
    display: flex;
    justify-content: center;
    padding-bottom: 2rem;
}

.tj-btn-transferir {
    border-radius: 9999px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em;
    min-width: 220px;
}

/* =====================
   ANIMACIONES
===================== */
.tj-fade-down-enter-active,
.tj-fade-down-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tj-fade-down-enter,
.tj-fade-down-leave-to {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
}

@keyframes tj-bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}
</style>
