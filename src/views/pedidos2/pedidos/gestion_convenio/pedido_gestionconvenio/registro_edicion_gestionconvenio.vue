<template>
<div class="convenio-form-container" :class="{ 'theme-dark': themeMode }">
    <!-- Header unificado -->
    <div class="convenio-header-banner mb-6">
        <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- Izquierda: título + institución + guía -->
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                    <div class="header-icon-box">
                        <feather-icon icon="FileTextIcon" svgClasses="h-5 w-5" />
                    </div>
                    <div class="min-w-0">
                        <h2 class="title">Configuración del Reporte de Convenio</h2>
                        <p class="institution-line" :title="pedido.nombreInstitucion">
                            <feather-icon icon="MapPinIcon" svgClasses="h-3.5 w-3.5 mr-1 flex-shrink-0" style="display:inline-block; vertical-align:middle;" />
                            <span>{{ pedido.nombreInstitucion || 'Sin institución' }}</span>
                        </p>
                    </div>
                </div>
                <!-- <p class="subtitle mt-2">Seleccione el <strong>Beneficiario</strong> para generar y descargar el reporte del convenio.</p> -->
                <!-- Botón guía rápida -->
                <div class="mt-3">
                    <vx-tooltip
                        style="display: inline-block;"
                        text="Entiende cómo se generan los reportes y cómo se calculan los años."
                        position="right"
                    >
                        <button class="smart-help-btn" :class="{'active': expandirInfoRegistro, 'dark': themeMode}" @click="expandirInfoRegistro = !expandirInfoRegistro">
                            <i class="feather smart-help-btn__icon" :class="expandirInfoRegistro ? 'icon-x' : 'icon-book-open'"></i>
                            <span class="smart-help-btn__text">{{ expandirInfoRegistro ? 'Ocultar guía' : 'Ver guía rápida' }}</span>
                        </button>
                    </vx-tooltip>
                </div>
            </div>
            <!-- Derecha: botón regresar -->
            <!-- <vs-button color="danger" type="filled" icon-pack="feather" icon="icon-x" @click="getCancelar">
                Regresar
            </vs-button> -->
        </div>
    </div>

    <!-- Panel guía rápida del registro -->
    <transition name="accordion-slide">
        <div v-if="expandirInfoRegistro" class="premium-help-panel mb-6" :class="{'dark': themeMode}">
            <div class="premium-help-panel__header" :class="{'dark': themeMode}">
                <div class="premium-help-panel__header-icon">
                    <i class="feather icon-zap"></i>
                </div>
                <div>
                    <h4 class="premium-help-panel__title" :class="themeMode ? 'text-white' : 'text-gray-800'">
                        Guía rápida — Generación de Reporte
                    </h4>
                    <p class="premium-help-panel__subtitle" :class="themeMode ? 'text-white' : 'text-gray-500'">
                        Cómo funciona este formulario y de dónde vienen los años del convenio.
                    </p>
                </div>
            </div>
            <div class="premium-help-panel__grid">
                <!-- Tarjeta 1: Beneficiario -->
                <div class="premium-help-card" :class="{'dark': themeMode}">
                    <div class="premium-help-card__icon-box color-1">
                        <i class="feather icon-user"></i>
                    </div>
                    <div class="premium-help-card__content">
                        <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                            Selección de Beneficiario
                        </span>
                        <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                            Elija el beneficiario vinculado al pedido. Este dato es <b>obligatorio</b> para poder generar el reporte. El listado muestra solo los beneficiarios registrados para este pedido.
                        </p>
                    </div>
                </div>
                <!-- Tarjeta 2: Años del convenio -->
                <div class="premium-help-card highlight" :class="{'dark': themeMode}">
                    <div class="premium-help-card__icon-box color-3">
                        <i class="feather icon-calendar"></i>
                    </div>
                    <div class="premium-help-card__content">
                        <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                            Años del Convenio
                        </span>
                        <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                            Los años se calculan <b>automáticamente</b>:<br>
                            • <b>Año inicio</b>: corresponde al año del período escolar del convenio.<br>
                            • <b>Año fin</b>: año inicio + cantidad de años del convenio.<br>
                            No es necesario ingresarlos manualmente.
                        </p>
                    </div>
                </div>
                <!-- Tarjeta 3: Qué pasa al guardar -->
                <div class="premium-help-card" :class="{'dark': themeMode}">
                    <div class="premium-help-card__icon-box color-2">
                        <i class="feather icon-save"></i>
                    </div>
                    <div class="premium-help-card__content">
                        <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                            Al Guardar y Generar
                        </span>
                        <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                            Al confirmar, el reporte queda registrado en estado <b>Sin evidencia</b> y se abre automáticamente para impresión. Desde el listado podrá luego <b>subir evidencia</b> o <b>anularlo</b> si es necesario.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    <!-- Main Logic -->
    <div class="vx-row">
        <!-- Input Form Section -->
        <div class="vx-col w-full lg:w-8/12 mb-6">
            <vx-card title="Detalles del Documento" title-color="primary">
                <div class="vx-row mb-6">
                    <!-- Beneficiario -->
                    <div class="vx-col w-full mb-4">
                        <label class="form-label font-semibold">Beneficiario <span class="text-danger">*</span></label>
                        <v-select :options="arregloBeneficiarios" :reduce="arregloBeneficiarios => arregloBeneficiarios" label="beneficiarioComision" class="w-full mt-2 custom-select" placeholder="-- Seleccione el Beneficiario --" v-model="beneficiario" />
                    </div>
                </div>

                <!-- Años informativos del convenio -->
                <div class="vx-row mb-4">
                    <div class="vx-col w-full">
                        <div v-if="cargandoAnios" class="anios-info-banner anios-loading">
                            <i class="feather icon-loader mr-2" style="animation: spin 1s linear infinite;"></i>
                            Calculando años del convenio...
                        </div>
                        <div v-else-if="infoAnios" class="anios-info-banner">
                            <div class="anios-info-item">
                                <span class="anios-info-label">Año inicio convenio</span>
                                <span class="anios-info-value">{{ infoAnios.cdp_anio_comienza }}</span>
                            </div>
                            <div class="anios-info-divider"></div>
                            <div class="anios-info-item">
                                <span class="anios-info-label">Año fin convenio</span>
                                <span class="anios-info-value">{{ infoAnios.cdp_anio_termina }}</span>
                            </div>
                            <!-- <div class="anios-info-divider"></div>
                            <div class="anios-info-item">
                                <span class="anios-info-label">Duración</span>
                                <span class="anios-info-value">{{ infoAnios.convenio_anios }} {{ infoAnios.convenio_anios == 1 ? 'año' : 'años' }}</span>
                            </div> -->
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 flex justify-end">
                    <vs-button color="danger" type="filled" class="mr-4" @click="getCancelar">
                        Cancelar
                    </vs-button>
                    <vs-button class="btn-emit" color="#3182ce" type="filled" icon-pack="feather" icon="icon-save" @click="guardarYGenerarConvenio" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar y Generar Reporte' }}
                    </vs-button>
                </div>
            </vx-card>
        </div>

        <!-- Right Side Information Card -->
        <div class="vx-col w-full lg:w-4/12">
            <vx-card title="Requisitos de Emisión" title-color="warning">
                <p class="text-sm mb-4">Para emitir el convenio del pedido, se requiere configurar todos los campos obligatorios del formulario.</p>

                <div class="checklist mt-4">
                    <div class="check-item flex items-center mb-3">
                        <vs-icon
                            :key="'formato-aprobado-' + formatoAprobado + '-' + cargandoFormato"
                            :icon="cargandoFormato ? 'hourglass_empty' : 'check_circle'"
                            :color="formatoAprobado ? 'success' : 'grey'"
                            class="mr-2"
                            size="20px"
                        ></vs-icon>
                        <span :class="{'text-success font-semibold': formatoAprobado}">
                            <template v-if="cargandoFormato">Verificando formato...</template>
                            <template v-else-if="formatoAprobado">Formato de Convenio Aprobado <span class="text-xs text-gray-500 font-normal" v-if="nombrePeriodo">({{ nombrePeriodo }})</span></template>
                            <template v-else>Formato de Convenio Aprobado</template>
                        </span>
                        <vs-chip v-if="!cargandoFormato && formatoAprobado === false" color="danger" class="ml-2" style="font-size:0.7rem;">Sin formato <span v-if="nombrePeriodo">({{ nombrePeriodo }})</span></vs-chip>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="pedido.estado == 1 ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': pedido.estado == 1}">
                            Pedido Activo
                        </span>
                        <vs-chip v-if="pedido.estado != 1" color="danger" class="ml-2" style="font-size:0.7rem;">Inactivo</vs-chip>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="pedido.contrato_generado ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': pedido.contrato_generado}">
                            Contrato Generado
                            <span v-if="pedido.contrato_generado" class="text-xs text-gray-500 font-normal">({{ pedido.contrato_generado }})</span>
                        </span>
                        <vs-chip v-if="!pedido.contrato_generado" color="danger" class="ml-2" style="font-size:0.7rem;">Sin contrato</vs-chip>
                    </div>
                    <div class="check-item flex items-center mb-3">
                        <vs-icon icon="check_circle" :color="beneficiario ? 'success' : 'grey'" class="mr-2" size="20px"></vs-icon>
                        <span :class="{'text-success font-semibold': beneficiario}">Beneficiario Seleccionado</span>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>

    <!-- Loader Modal -->
    <vs-popup class="custom-loader-popup informacionformhijo2" title="Generando Documento" :active.sync="popupCarga">
        <div class="text-center p-6">
            <p class="text-warning text-2xl font-bold bg-dark py-3 px-4 rounded flex items-center justify-center">
                <vs-icon icon="cloud_download" class="mr-2" size="28px"></vs-icon>
                <span>Espere mientras se descarga el archivo...</span>
            </p>
            <img class="mt-6 mx-auto animate-bounce" style="max-width: 150px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" alt="Cargando" />
        </div>
    </vs-popup>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';

const reporte_gestionconvenio = () => import('@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/reporte_gestionconvenio.vue');

export default {
    data() {
        return {
            expandirInfoRegistro: false,
            id_beneficiario_pedido: 0,
            beneficiario: '',
            arregloBeneficiarios: [],
            popupCarga: false,
            contrato: '',
            guardando: false,
            tipo: 4, // Convenio
            // Años calculados desde el backend (solo informativo)
            infoAnios: null,       // { cdp_anio_comienza, cdp_anio_termina, convenio_anios }
            cargandoAnios: false,
            // Verificación de formato aprobado
            formatoAprobado: null,  // null = sin verificar, true = existe, false = no existe
            cargandoFormato: false,
            nombrePeriodo: '',
        }
    },
    props: {
        datosInstitucion: {
            type: Object,
            default: function () {
                return {}
            }
        },
        pedido: {
            type: Object,
            default: function () {
                return {}
            }
        },
        id_pedido_convenio: {
            type: [Number, String, null],
            default: null
        },
    },
    components: {
        'v-select': vSelect,
        reporte_gestionconvenio
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        }
    },
    mounted() {
        let me = this;
        me.contrato = me.pedido.contrato_generado || me.pedido.contrato || '';

        me.$vs.loading();
        me.getBeneficiarios(me.pedido.id_pedido)
            .finally(() => {
                me.$vs.loading.close();
            });

        // Verificar formato aprobado de forma independiente
        me.verificarFormatoAprobado();

        // Cargar años informativos del convenio
        if (me.id_pedido_convenio) {
            me.cargarAniosConvenio();
        }
    },
    methods: {
        // ─── Obtiene el idusuario desde localStorage ──────────────────
        getIdUsuarioLocal() {
            try {
                const raw = localStorage.getItem('usuario');
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return parsed.idusuario || null;
            } catch (e) {
                return null;
            }
        },

        getBeneficiarios(pedido) {
            let me = this;
            me.arregloBeneficiarios = [];
            me.beneficiario = '';
            return this.$http.get(this.$server_url + 'get_beneficiarios_pedidos/' + pedido)
                .then(res => {
                    me.arregloBeneficiarios = res.data;
                });
        },

        // ─── Carga los años de inicio y fin desde el backend (solo informativo) ───
        cargarAniosConvenio() {
            let me = this;
            me.cargandoAnios = true;
            me.$http.get(me.$server_url + 'VerifcarMetodosGet_Convenio_Documento_Pedido', {
                params: {
                    action: 'Get_AniosConvenio_xPedidoConvenio',
                    id_pedido_convenio: me.id_pedido_convenio
                }
            })
            .then(res => {
                me.infoAnios = res.data;
            })
            .catch(() => {
                me.infoAnios = null;
            })
            .finally(() => {
                me.cargandoAnios = false;
            });
        },



        // ─── Verifica formato aprobado para el periodo del pedido ─────
        verificarFormatoAprobado() {
            let me = this;
            me.cargandoFormato = true;
            me.formatoAprobado = null;
            me.nombrePeriodo = '';

            me.$http.get(me.$server_url + 'VerifcarMetodosGet_Convenio_Documento_Pedido', {
                params: {
                    action: 'Get_VerificarFormatoAprobado',
                    id_pedido: me.pedido.id_pedido
                }
            })
            .then(res => {
                me.formatoAprobado = res.data.formato_aprobado === true;
                me.nombrePeriodo = res.data.periodoescolar || '';
            })
            .catch(() => {
                me.formatoAprobado = false;
                me.nombrePeriodo = '';
            })
            .finally(() => {
                me.cargandoFormato = false;
            });
        },

        // ─── Validaciones del formulario ──────────────────────────────
        validarFormulario() {
            let me = this;
            if (Number(me.pedido.estado) !== 1) {
                me.$vs.notify({
                    text: 'El pedido debe encontrarse en estado activo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (!me.pedido.contrato_generado || String(me.pedido.contrato_generado).trim() === '') {
                me.$vs.notify({
                    text: 'El pedido no tiene un contrato generado.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (me.formatoAprobado === false) {
                me.$vs.notify({
                    text: 'No existe un Formato de Convenio aprobado para el período ' + (me.nombrePeriodo ? '\'' + me.nombrePeriodo + '\'' : 'de este pedido') + '.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            if (!me.beneficiario) {
                me.$vs.notify({
                    text: 'Seleccione un beneficiario por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            return true;
        },

        // ─── Guarda en BD y luego genera el PDF ──────────────────────
        guardarYGenerarConvenio() {
            let me = this;
            if (!me.validarFormulario()) return;

            me.guardando = true;
            me.$vs.loading();

            const idusuario = me.getIdUsuarioLocal();

            const payload = {
                action: 'Post_Registrar_Convenio_Pedido',
                id_beneficiario_pedido: me.beneficiario.id_beneficiario_pedido,
                id_pedido: me.pedido.id_pedido,
                id_pedido_convenio: me.id_pedido_convenio || null,
                idusuario: idusuario,
                id_institucion: me.pedido.id_institucion || null,
                contrato_generado: me.pedido.contrato_generado || null,
            };

            me.$http.post(me.$server_url + 'VerifcarMetodosPost_Convenio_Documento_Pedido', payload)
                .then(res => {
                    const data = res.data;
                    if (data.status === 1) {
                        // Éxito: actualizar variable de numero de convenio y lanzar PDF
                        me.numeroConvenio = data.cdp_codigo || '';
                        me.id_beneficiario_pedido = me.beneficiario.id_beneficiario_pedido;

                        // Notifica al padre del guardado exitoso y pasa el id para abrir reporte inmediatamente en el padre
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1,
                            cdp_id: data.cdp_id,
                            pgc_anio: me.cdp_anio_termina
                        });
                    } else {
                        me.$vs.notify({
                            title: 'Error al registrar',
                            text: data.message || 'No se pudo guardar el convenio.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 6000
                        });
                    }
                })
                .catch(err => {
                    const msg = (err.response && err.response.data && err.response.data.message) ?
                        err.response.data.message :
                        'Error de conexión al guardar el convenio.';
                    me.$vs.notify({
                        title: 'Error',
                        text: msg,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000
                    });
                })
                .finally(() => {
                    me.$vs.loading.close();
                    me.guardando = false;
                });
        },

        changeHandle(e) {
            let me = this;
            me.popupReporteConvenio = false;
            me.pgc_id_guardado = null;
            // Notify parent: guardado + impreso exitosamente
            me.$emit('change', {
                verificacionemitsaveandedit: 1
            });
        },

        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        }
    }
}
</script>

<style scoped>
.convenio-form-container {
    padding: 1.5rem;
    font-family: 'Outfit', 'Inter', sans-serif;
    background-color: #f3f4f6;
    border-radius: 16px;
    min-height: 100%;
}

.convenio-header-banner {
    background: #ffffff !important;
    border: 1px solid #e2e8f0;
    padding: 1.25rem 1.75rem;
    border-radius: 14px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.header-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(49, 130, 206, 0.1);
    color: #3182ce;
    flex-shrink: 0;
}

.convenio-header-banner .title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
    line-height: 1.3;
}

.institution-line {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: #3182ce;
    font-weight: 600;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 480px;
}

.convenio-header-banner .subtitle {
    font-size: 0.85rem;
    color: #718096;
}

.theme-dark .convenio-header-banner {
    background: rgba(15, 23, 42, 0.5) !important;
    border-color: #334155;
}
.theme-dark .header-icon-box {
    background: rgba(49, 130, 206, 0.15);
    color: #63b3ed;
}
.theme-dark .convenio-header-banner .title {
    color: #f1f5f9;
}
.theme-dark .institution-line {
    color: #63b3ed;
}
.theme-dark .convenio-header-banner .subtitle {
    color: #94a3b8;
}

.badge-contrato {
    border: 1px solid #e2e8f0;
    background: #fff;
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    text-align: right;
}

.badge-contrato .label {
    display: block;
    font-size: 0.65rem;
    color: #718096;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.badge-contrato .value {
    display: block;
    font-size: 0.95rem;
    color: #2d3748;
    font-weight: 700;
}

.detail-card {
    background: #ffffff !important;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.detail-item {
    border-right: 1px solid #f3f3f3;
    padding-left: 1.5rem;
}

.detail-item:last-child {
    border-right: none;
}

.detail-label {
    font-size: 0.8rem;
    color: #a0aec0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 0.25rem;
}

.detail-value {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
}

.form-label {
    color: #4a5568;
    font-size: 0.9rem;
}

.custom-select>>>.vs__dropdown-toggle {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 2px 0;
    transition: all 0.3s ease;
}

.custom-select>>>.vs__dropdown-toggle:hover {
    border-color: #cbd5e0;
}

.custom-select>>>.vs__selected {
    color: #2d3748;
    font-weight: 500;
}

.convenio-type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.convenio-type-card {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    background: #fff;
}

.convenio-type-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e0;
}

.convenio-type-card.active {
    border-color: #3182ce;
    background: rgba(49, 130, 206, 0.03);
    box-shadow: 0 4px 15px rgba(49, 130, 206, 0.1);
}

.card-radio-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #cbd5e0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.convenio-type-card.active .card-radio-circle {
    border-color: #3182ce;
    background: #3182ce;
}

.convenio-type-card.active .card-radio-circle::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
}

.card-content {
    display: flex;
    flex-direction: column;
}

.card-label {
    font-size: 0.8rem;
    color: #718096;
    font-weight: 500;
}

.card-value {
    font-size: 1.3rem;
    font-weight: 700;
    margin-top: 2px;
}

.checklist .check-item {
    font-size: 0.95rem;
    color: #4a5568;
}

.btn-emit {
    padding: 0.75rem 2rem !important;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-radius: 8px !important;
    transition: all 0.3s ease;
}

.btn-emit:hover {
    box-shadow: 0 6px 20px rgba(49, 130, 206, 0.3) !important;
    transform: translateY(-1px);
}

.bg-danger-light {
    background-color: rgba(234, 84, 85, 0.05);
}

.border-danger {
    border: 1px solid rgba(234, 84, 85, 0.2) !important;
    border-radius: 12px;
}

.custom-loader-popup>>>.vs-popup {
    border-radius: 16px;
    max-width: 450px;
}

.bg-dark {
    background-color: #2d3748;
}

/* Dark mode styles for register/edit */
.convenio-form-container.theme-dark {
    background-color: transparent;
    color: #cbd5e1;
}

.theme-dark .detail-card {
    background: #1e293b !important;
    border-color: #334155;
}

.theme-dark .detail-item {
    border-right-color: #334155;
}

.theme-dark .detail-label {
    color: #94a3b8;
}

.theme-dark .detail-value.text-dark {
    color: #cbd5e1 !important;
}

.theme-dark .form-label {
    color: #cbd5e1;
}

/* v-select in dark mode */
.theme-dark .custom-select >>> .vs__dropdown-toggle {
    border-color: #334155 !important;
    background-color: rgba(15, 23, 42, 0.6) !important;
}
.theme-dark .custom-select >>> .vs__selected {
    color: #f1f5f9 !important;
}
.theme-dark .custom-select >>> .vs__search {
    color: #f1f5f9 !important;
}
.theme-dark .custom-select >>> .vs__dropdown-menu {
    background-color: #1e293b !important;
    color: #cbd5e1 !important;
    border-color: #334155 !important;
}
.theme-dark .custom-select >>> .vs__dropdown-option {
    color: #cbd5e1 !important;
}
.theme-dark .custom-select >>> .vs__dropdown-option--highlight {
    background: #7367f0 !important;
    color: #fff !important;
}

/* Convenio type card in dark mode */
.theme-dark .convenio-type-card {
    background: #1e293b;
    border-color: #334155;
}
.theme-dark .convenio-type-card:hover {
    border-color: #4a5568;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.theme-dark .convenio-type-card.active {
    border-color: #7367f0;
    background: rgba(115, 103, 240, 0.05);
    box-shadow: 0 4px 15px rgba(115, 103, 240, 0.15);
}
.theme-dark .card-radio-circle {
    border-color: #4a5568;
}
.theme-dark .convenio-type-card.active .card-radio-circle {
    border-color: #7367f0;
    background: #7367f0;
}
.theme-dark .card-label {
    color: #94a3b8;
}
.theme-dark .checklist .check-item {
    color: #cbd5e1;
}

/* Preview monto */
.preview-monto-container {
    background: #f0fff4;
    border: 1px solid #c6f6d5;
}
.theme-dark .preview-monto-container {
    background: rgba(40, 199, 111, 0.08);
    border-color: rgba(40, 199, 111, 0.2);
}

/* White bg panel inside callout in dark mode */
.theme-dark .bg-white {
    background-color: rgba(15, 23, 42, 0.5) !important;
}
.theme-dark .text-dark {
    color: #cbd5e1 !important;
}
.theme-dark .vx-card {
    background-color: #1e293b !important;
    color: #cbd5e1 !important;
}
.theme-dark .vx-card >>> .vx-card__title h4 {
    color: #f1f5f9 !important;
}

/* ── Años informativos ────────────────────────────────────── */
.anios-info-banner {
    display: flex;
    align-items: center;
    gap: 0;
    background: #ebf8ff;
    border: 1px solid #bee3f8;
    border-radius: 10px;
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
}

.anios-info-banner.anios-loading {
    color: #718096;
    background: #f7fafc;
    border-color: #e2e8f0;
    justify-content: center;
}

.anios-info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    text-align: center;
}

.anios-info-label {
    font-size: 0.7rem;
    color: #4299e1;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}

.anios-info-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #2b6cb0;
}

.anios-info-divider {
    width: 1px;
    height: 36px;
    background: #bee3f8;
    margin: 0 0.5rem;
}

.theme-dark .anios-info-banner {
    background: rgba(49, 130, 206, 0.1);
    border-color: rgba(49, 130, 206, 0.25);
}
.theme-dark .anios-info-label {
    color: #63b3ed;
}
.theme-dark .anios-info-value {
    color: #90cdf4;
}
.theme-dark .anios-info-divider {
    background: rgba(49, 130, 206, 0.25);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ── Guía rápida (mismo estilo que lista) ─────────────────── */
.smart-help-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid rgba(115, 103, 240, 0.18);
    background: #ffffff;
    color: #7367F0;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(115,103,240,0.04);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    user-select: none;
    animation: breathingGlow 7s ease-in-out infinite;
}
.smart-help-btn.dark {
    background: #1e293b;
    border-color: rgba(115, 103, 240, 0.22);
    color: #a5b4fc;
}
.smart-help-btn:hover {
    transform: translateY(-1px);
    border-color: rgba(115, 103, 240, 0.38);
    color: #5b4de0;
    background: #fafafa;
}
.smart-help-btn.dark:hover {
    border-color: rgba(115, 103, 240, 0.45);
    color: #c7d2fe;
    background: #263148;
}
.smart-help-btn.active {
    background: #7367F0;
    border-color: #7367F0;
    color: #ffffff;
}
.smart-help-btn.active.dark {
    background: #5b4de0;
    border-color: #5b4de0;
    color: #ffffff;
}
.smart-help-btn__icon { font-size: 14px; transition: transform 0.22s ease; }
.smart-help-btn:hover .smart-help-btn__icon { transform: rotate(-8deg) scale(1.1); }
.smart-help-btn.active .smart-help-btn__icon { transform: rotate(90deg); }
.smart-help-btn__text { letter-spacing: 0.01em; }

@keyframes breathingGlow {
    0%, 100% { box-shadow: 0 4px 12px rgba(115,103,240,0.04); }
    50% { box-shadow: 0 4px 16px rgba(115,103,240,0.08), 0 0 0 1px rgba(115,103,240,0.04); }
}

.premium-help-panel {
    background: linear-gradient(135deg, #fafbfe 0%, #f4f6fc 100%);
    border: 1px solid rgba(115, 103, 240, 0.1);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(115,103,240,0.03), inset 0 1px 1px rgba(255,255,255,0.8);
}
.premium-help-panel.dark {
    background: linear-gradient(135deg, #1c213d 0%, #15182e 100%);
    border-color: rgba(115, 103, 240, 0.18);
    box-shadow: 0 12px 48px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.05);
}
.premium-help-panel__header {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(115, 103, 240, 0.08);
    padding-bottom: 14px;
    margin-bottom: 16px;
}
.premium-help-panel__header.dark { border-bottom-color: rgba(115,103,240,0.15); }
.premium-help-panel__header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(115, 103, 240, 0.1);
    color: #7367F0;
    font-size: 16px;
}
.premium-help-panel__title { margin: 0; font-size: 15px; font-weight: 750; letter-spacing: -0.01em; }
.premium-help-panel__subtitle { margin: 2px 0 0; font-size: 11.5px; }
.premium-help-panel__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
.premium-help-card {
    background: #ffffff;
    border: 1px solid #eef0f6;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.premium-help-card.dark { background: #191c35; border-color: #24294a; }
.premium-help-card:hover {
    transform: translateY(-2px);
    border-color: rgba(115,103,240,0.25);
    box-shadow: 0 8px 20px rgba(115,103,240,0.08);
}
.premium-help-card.highlight { background: #fcfbfe; border-color: rgba(115,103,240,0.15); }
.premium-help-card.highlight.dark { background: #1b1c3c; border-color: rgba(115,103,240,0.25); }
.premium-help-card__icon-box {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 10px; font-size: 15px; flex-shrink: 0;
    transition: all 0.3s ease;
}
.premium-help-card:hover .premium-help-card__icon-box { transform: scale(1.08); }
.premium-help-card__icon-box.color-1 { background: #e6fcf5; color: #0ca678; }
.premium-help-card.dark .premium-help-card__icon-box.color-1 { background: rgba(12,166,120,0.15); }
.premium-help-card__icon-box.color-2 { background: #edf2ff; color: #4c6ef5; }
.premium-help-card.dark .premium-help-card__icon-box.color-2 { background: rgba(76,110,245,0.15); }
.premium-help-card__icon-box.color-3 { background: #f3f0ff; color: #7048e8; }
.premium-help-card.dark .premium-help-card__icon-box.color-3 { background: rgba(112,72,232,0.15); }
.premium-help-card__content { display: flex; flex-direction: column; gap: 4px; }
.premium-help-card__label { font-size: 12.5px; font-weight: 700; }
.premium-help-card__desc { margin: 0; font-size: 11.5px; line-height: 1.45; }

.accordion-slide-enter-active {
    transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease-out, transform 0.4s cubic-bezier(0.16,1,0.3,1);
    max-height: 600px; overflow: hidden;
}
.accordion-slide-leave-active {
    transition: max-height 0.35s cubic-bezier(0.7,0,0.84,0), opacity 0.25s ease-in, transform 0.35s cubic-bezier(0.7,0,0.84,0);
    max-height: 600px; overflow: hidden;
}
.accordion-slide-enter { max-height: 0 !important; opacity: 0; transform: translateY(-12px); }
.accordion-slide-leave-to { max-height: 0 !important; opacity: 0; transform: translateY(-12px); }

@media (max-width: 900px) {
    .premium-help-panel__grid { grid-template-columns: 1fr; gap: 12px; }
}
@media (max-width: 600px) {
    .smart-help-btn { width: 100%; justify-content: center; }
}

</style>
