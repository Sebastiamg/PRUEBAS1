<template>
<vx-card class="convenio-list-card" :class="{ 'theme-dark': themeMode }">

    <!-- Main Content -->
    <div>
        <!-- Header banner in soft gray -->
        <div class="convenio-header-banner mb-6">
            <div class="flex items-center justify-between flex-wrap">
                <div>
                    <h3 class="title font-bold flex items-center">
                        <feather-icon icon="FileTextIcon" svgClasses="h-6 w-6 mr-2" style="color: #3182ce;" />
                        Documentos del Convenio
                    </h3>
                    <p class="subtitle text-gray-500 mt-1">Gestione y visualice el historial de documentos del convenio generados para este pedido.</p>
                    <!-- Botón Inteligente de Ayuda -->
                    <div class="mt-4">
                        <vx-tooltip
                            style="display: inline-block;"
                            text="Conoce los tipos de convenio, estados y flujo de evidencias."
                            position="right"
                        >
                            <button class="smart-help-btn" :class="{'active': expandirInfo, 'dark': themeMode}" @click="expandirInfo = !expandirInfo">
                                <i class="feather smart-help-btn__icon" :class="expandirInfo ? 'icon-x' : 'icon-book-open'"></i>
                                <span class="smart-help-btn__text">
                                    {{ expandirInfo ? 'Ocultar guía' : 'Ver guía rápida' }}
                                </span>
                            </button>
                        </vx-tooltip>
                    </div>
                </div>
                <vs-button v-if="(userFacturador || userAdminFacturador || userRoot) && !yaExisteReporteActivo && ![0, 2].includes(Number(estado_convenio))" type="filled" color="#3182ce" class="btn-add mt-2 sm:mt-0 shadow" icon-pack="feather" icon="icon-plus" @click="getNuevoConvenio">
                    Generar Nuevo Documento
                </vs-button>
                <div v-else-if="(userFacturador || userAdminFacturador || userRoot) && yaExisteReporteActivo && ![0, 2].includes(Number(estado_convenio))" class="reporte-activo-badge mt-2 sm:mt-0">
                    <feather-icon icon="CheckCircleIcon" svgClasses="w-4 h-4 mr-1.5" style="color: #28C76F;" />
                    <span>Documento activo generado</span>
                </div>
            </div>
        </div>

        <!-- Panel de Onboarding Contextual Premium -->
        <transition name="accordion-slide">
            <div v-if="expandirInfo" class="premium-help-panel mb-6" :class="{'dark': themeMode}">
                <!-- Encabezado del Panel -->
                <div class="premium-help-panel__header" :class="{'dark': themeMode}">
                    <div class="premium-help-panel__header-icon">
                        <i class="feather icon-zap"></i>
                    </div>
                    <div>
                        <h4 class="premium-help-panel__title" :class="themeMode ? 'text-white' : 'text-gray-800'">
                            Guía rápida de Gestión de Convenios
                        </h4>
                        <p class="premium-help-panel__subtitle" :class="themeMode ? 'text-white' : 'text-gray-500'">
                            Comprende los tipos de convenio, el flujo de evidencias y sus estados.
                        </p>
                    </div>
                </div>
                <!-- Tarjetas Informativas -->
                <div class="premium-help-panel__grid">
                    <!-- Tarjeta 1: Estados del Reporte -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-1">
                            <i class="feather icon-file-text"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Estados del Documento
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Cada documento puede estar en uno de estos estados:<br>
                                • <b>Sin evidencia</b>: generado pero sin archivos adjuntos.<br>
                                • <b>Con evidencia</b>: tiene uno o más archivos cargados.<br>
                                • <b>Anulado</b>: invalidado con justificación obligatoria.<br><br>
                                Solo puede existir <b>un documento activo</b> (Sin evidencia o Con evidencia) a la vez. Puede haber múltiples documentos anulados.
                            </p>
                        </div>
                    </div>
                    <!-- Tarjeta 2: Flujo de Evidencias -->
                    <div class="premium-help-card highlight" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-3">
                            <i class="feather icon-upload-cloud"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Flujo de Evidencias
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Al generarse, el documento inicia en estado <b>Sin evidencia</b>.
                                Desde el menú de acciones seleccione <b>Subir Evidencia</b> para cargar archivos en formato <b>PDF</b> o <b>imagen</b> (máximo <b>5 MB</b> total).
                                El estado cambiará a <b>Con Evidencia</b> automáticamente.<br><br>
                                Si necesita <b>añadir o quitar evidencias</b> después, use el botón <b>Ver Evidencia/s</b> del documento activo.
                            </p>
                        </div>
                    </div>
                    <!-- Tarjeta 3: Anulaciones y Control -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-2">
                            <i class="feather icon-slash"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Anulaciones y Control
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Si necesita invalidar el documento activo, seleccione <b>Anular</b> desde el menú de acciones e ingrese una justificación obligatoria.<br><br>
                                Al anularlo, el registro queda en estado <b>Anulado</b> y podrá generar un <b>nuevo documento</b>. Pueden acumularse múltiples registros anulados como historial.
                            </p>
                        </div>
                    </div>
                    <!-- Tarjeta 4: Control por Estado de Convenio -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-4">
                            <i class="feather icon-shield"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Restricciones del Convenio
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                El flujo de trabajo se adapta según el estado actual del convenio:<br>
                                • <b>En curso</b>: Se permite la gestión total (generación, carga de evidencias y anulación).<br>
                                • <b>Finalizado o Cerrado</b>: Se restringen todas las operaciones de modificación. El usuario únicamente podrá realizar la <b>Impresión del documento</b>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Banner de Estado de Convenio Premium -->
        <div class="estado-convenio-banner mb-6" :class="[estadoConvenioInfo.class, { 'dark': themeMode }]">
            <div class="estado-convenio-flex">
                <!-- Icon Box -->
                <div class="estado-convenio-banner__icon-box" :style="{ backgroundColor: estadoConvenioInfo.color + '15', color: estadoConvenioInfo.color }">
                    <feather-icon :icon="estadoConvenioInfo.icon" svgClasses="w-5 h-5" />
                </div>
                <!-- Content -->
                <div class="estado-convenio-main-info">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">Estado del Convenio:</span>
                        <span class="estado-convenio-badge" :style="{ backgroundColor: estadoConvenioInfo.color + '15', color: estadoConvenioInfo.color, borderColor: estadoConvenioInfo.color + '30' }">
                            {{ estadoConvenioInfo.label }}
                        </span>
                    </div>
                    <p class="estado-convenio-desc mt-1 mb-2" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                        {{ estadoConvenioInfo.desc }}
                    </p>
                    <!-- Permitted Actions Line (Always on a new line, clean break) -->
                    <div class="estado-convenio-acciones-line pt-2">
                        <span class="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2">Acciones Permitidas:</span>
                        <span class="acciones-permitidas-text font-bold text-sm inline-block" :style="{ color: estadoConvenioInfo.color }">
                            {{ estadoConvenioInfo.accionesHabilitadas }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="cargando" class="flex justify-center items-center py-10">
            <div class="loader-ring"></div>
            <span class="ml-3 text-gray-500">Cargando convenios...</span>
        </div>

        <!-- Table Listing -->
        <vs-table v-else max-items="10" pagination search :data="Array_Convenios" no-data-text="No hay registros de documentos del convenio generados al momento" class="custom-table">
            <template slot="header">
                <vs-chip v-if="Array_Convenios" color="primary">Cantidad: <b> {{ Array_Convenios.length }}</b></vs-chip>
            </template>

            <template slot="thead">
                <!-- <vs-th sort-key="cdp_id" width="80">ID</vs-th> -->
                <vs-th width="60">#</vs-th>
                <vs-th width="250">Código / Años del Convenio</vs-th>
                <vs-th width="250">Beneficiario</vs-th>
                <vs-th sort-key="cdp_estado" width="150">Estado</vs-th>
                <vs-th width="190">Seguimiento</vs-th>
                <vs-th width="100">Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <span class="font-bold text-gray-600">{{ Array_Convenios.length - Array_Convenios.indexOf(tr) }}</span>
                    </vs-td>
                    <!-- Código / Detalle del Convenio -->
                    <vs-td>
                        <div class="flex flex-col gap-1.5 items-start">
                            <div>
                                <span class="text-sm font-semibold text-primary codigo-badge">{{ tr.cdp_codigo }}</span>
                            </div>
                            <div class="text-sm text-gray-700"><b>Año Inicio:</b> {{ tr.cdp_anio_comienza }}</div>
                            <div class="text-sm text-gray-500"><b>Año Final:</b> {{ tr.cdp_anio_termina }}</div>
                        </div>
                    </vs-td>
                    <!-- Beneficiario / Empresa -->
                    <vs-td>
                        <div>{{ tr.nombre_beneficiario || '—' }}</div>
                    </vs-td>
                    <!-- Estado -->
                    <vs-td>
                        <div class="flex flex-col items-start gap-2">
                            <!-- Sin evidencia -->
                            <div v-if="tr.cdp_estado == '0'" class="status-badge status-sin-evidencia">
                                <span class="status-dot"></span>
                                Sin evidencia
                            </div>
                            <!-- Con evidencia -->
                            <div v-else-if="tr.cdp_estado == '1'" class="flex flex-wrap items-center gap-2">
                                <div class="status-badge status-con-evidencia">
                                    <span class="status-dot"></span>
                                    Con Evidencia
                                </div>
                                <button @click="abrirVerEvidencias(tr)" class="btn-ver-evidencias" title="Visualizar evidencias de convenio">
                                    <feather-icon icon="EyeIcon" svgClasses="w-5 h-5" />
                                    <span>Ver Evidencia/s ({{ tr.cantidad_evidencias }})</span>
                                </button>
                            </div>
                            <!-- Anulado -->
                            <div v-else-if="tr.cdp_estado == '2'" class="flex flex-col items-start gap-1.5 w-full">
                                <div class="status-badge status-anulado">
                                    <span class="status-dot"></span>
                                    Anulado
                                </div>
                                <div v-if="tr.info_anulacion" class="observation-callout">
                                    <feather-icon icon="AlertCircleIcon" svgClasses="w-6 h-6 text-danger mr-1.5 flex-shrink-0 mt-0.5" />
                                    <span class="observation-text">
                                        <b>Obs: </b>{{ parseInfoAnulacion(tr.info_anulacion).observacion_anular || 'Sin observación' }}
                                    </span>
                                </div>
                                <!-- Evidencias del anulado si las tenía -->
                                <button v-if="tr.cantidad_evidencias > 0" @click="abrirVerEvidencias(tr)" class="btn-ver-evidencias btn-ver-evidencias--anulado" title="Ver evidencias del convenio anulado">
                                    <feather-icon icon="EyeIcon" svgClasses="w-4 h-4" />
                                    <span>Ver Evidencia/s ({{ tr.cantidad_evidencias }})</span>
                                </button>
                            </div>
                        </div>
                    </vs-td>
                    <!-- Seguimiento -->
                    <vs-td>
                        <div class="flex flex-col text-sm leading-normal">
                            <span class="text-gray-700">
                                <b>Creación:</b> {{ tr.creador_nombre || '—' }} ({{ formatFecha(tr.created_at) }})
                            </span>
                            <span v-if="tr.subidaevidencia_at" class="text-gray-700 mt-1">
                                <b>Subida de Evidencia:</b> {{ tr.subida_nombre || '—' }} ({{ formatFecha(tr.subidaevidencia_at) }})
                            </span>
                            <span v-if="tr.cdp_estado == '2' && tr.info_anulacion" class="mt-1" style="color:#EA5455;">
                                <b>Anulación:</b> {{ tr.anulador_nombre || '—' }} ({{ formatFecha(parseInfoAnulacion(tr.info_anulacion).fecha_anular) }})
                            </span>
                        </div>
                    </vs-td>
                    <!-- Acciones -->
                    <vs-td>
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 230px;" class="cursor informacionformhijo3">
                                <vs-dropdown-item>
                                    <!-- Imprimir -->
                                    <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-printer" class="w-full text-left" @click="imprimirConvenio(tr)">
                                        Imprimir
                                    </vs-button>
                                    <!-- Subir Evidencia -->
                                    <vs-button v-if="(tr.cdp_estado != '1' && tr.cdp_estado != '2') && (userFacturador || userAdminFacturador || userRoot) && ![0, 2].includes(Number(estado_convenio))" color="#28C76F" type="line" icon-pack="feather" icon="icon-upload-cloud" class="w-full text-left" @click="abrirSubirEvidencia(tr)">
                                        Subir Evidencia
                                    </vs-button>
                                    <!-- Anular -->
                                    <vs-button v-if="tr.cdp_estado != '2' && (userFacturador || userAdminFacturador || userRoot) && ![0, 2].includes(Number(estado_convenio))" color="#FF9F43" type="line" icon-pack="feather" icon="icon-slash" class="w-full text-left" @click="confirmarAnular(tr)">
                                        Anular
                                    </vs-button>
                                    <!-- Eliminar -->
                                    <vs-button v-if="userRoot" color="#EA5455" type="line" icon-pack="feather" icon="icon-trash-2" class="w-full text-left" @click="confirmarEliminar(tr)">
                                        Eliminar
                                    </vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>

    <!-- POPUP REGISTRO/GENERACION DE CONVENIO -->
    <vs-popup class="informacionformhijo3" title="Generar e Imprimir Convenio" :active.sync="popupGuardarEditar_Convenio" fullscreen style="padding: 5px;">
        <registro_edicion_gestionconvenio v-if="popupGuardarEditar_Convenio" :pedido="pedido" :datosInstitucion="datosInstitucion" :id_pedido_convenio="id_pedido_convenio" @change="changeHandleConvenio" />
    </vs-popup>

    <!-- POPUP REPORTE / REIMPRESION DE CONVENIO -->
    <vs-popup class="informacionformhijo3" title="Imprimir Convenio" :active.sync="popupReporte" fullscreen style="padding: 5px;">
        <reporte_gestionconvenio v-if="popupReporte && convenioAImprimir" :cdp_id="convenioAImprimir.cdp_id" :aniosAnteriorSelect="String(convenioAImprimir.cdp_anio_termina || convenioAImprimir.pgc_anio || '')" @change="changeHandleReporte" />
    </vs-popup>

    <!-- POPUP SUBIR EVIDENCIA -->
    <vs-popup class="informacionformhijo3" title="Subir Evidencia del Convenio" :active.sync="popupSubirEvidencia" fullscreen style="padding: 5px;">
        <subir_evidencia_gestionconvenio v-if="popupSubirEvidencia && convenioSeleccionado" :cdp_id="convenioSeleccionado.cdp_id" :cdp_codigo="convenioSeleccionado.cdp_codigo" @change="changeHandleSubirEvidencia" />
    </vs-popup>

    <!-- POPUP VER EVIDENCIAS -->
    <vs-popup class="informacionformhijo3" title="Evidencias del Convenio" :active.sync="popupVerEvidencias" fullscreen style="padding: 5px;">
        <ver_evidencias_gestionconvenio v-if="popupVerEvidencias && convenioSeleccionado" :cdp_id="convenioSeleccionado.cdp_id" :cdp_codigo="convenioSeleccionado.cdp_codigo" :cdp_estado="convenioSeleccionado.cdp_estado" @change="changeHandleVerEvidencias" />
    </vs-popup>

    <!-- POPUP CONFIRMAR ELIMINAR -->
    <vs-popup title="Eliminar Convenio" :active.sync="popupEliminar" style="padding: 5px;">
        <eliminar_gestionconvenio v-if="popupEliminar && convenioAEliminar" :convenio="convenioAEliminar" @change="changeHandleEliminar" />
    </vs-popup>

    <!-- POPUP CONFIRMAR ANULAR -->
    <vs-popup title="Confirmar Anulación" :active.sync="popupAnular" style="padding: 5px;">
        <anular_gestionconvenio v-if="popupAnular && convenioAAnular" :convenio="convenioAAnular" @change="changeHandleAnular" />
    </vs-popup>

</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";

const registro_edicion_gestionconvenio = () => import("@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/registro_edicion_gestionconvenio.vue");
const reporte_gestionconvenio = () => import("@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/reporte_gestionconvenio.vue");
const subir_evidencia_gestionconvenio = () => import("@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/subir_evidencia_gestionconvenio.vue");
const ver_evidencias_gestionconvenio = () => import("@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/ver_evidencias_gestionconvenio.vue");
const anular_gestionconvenio = () => import("@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/anular_gestionconvenio.vue");
const eliminar_gestionconvenio = () => import("@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/eliminar_gestionconvenio.vue");

export default {
    data() {
        return {
            expandirInfo: false,
            Array_Convenios: [],
            popupGuardarEditar_Convenio: false,
            popupEliminar: false,
            convenioAEliminar: null,
            popupReporte: false,
            convenioAImprimir: null,
            cargando: false,
            // Evidencia
            popupSubirEvidencia: false,
            popupVerEvidencias: false,
            convenioSeleccionado: null,
            // Anular
            popupAnular: false,
            convenioAAnular: null,
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
        estado_convenio: {
            type: [Number, String, null],
            default: null
        },
    },
    components: {
        registro_edicion_gestionconvenio,
        reporte_gestionconvenio,
        subir_evidencia_gestionconvenio,
        ver_evidencias_gestionconvenio,
        anular_gestionconvenio,
        eliminar_gestionconvenio,
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'userFacturador', 'userAdminFacturador']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        estadoConvenioInfo() {
            const estado = this.estado_convenio !== null && this.estado_convenio !== undefined ? Number(this.estado_convenio) : null;
            if (estado === 1) {
                return {
                    label: 'En curso',
                    color: '#28C76F',
                    icon: 'PlayIcon',
                    class: 'estado-en-curso',
                    desc: 'El convenio está en curso. La gestión está habilitada: puede generar nuevos documentos, subir evidencias y realizar anulaciones.',
                    accionesHabilitadas: 'Generación, Carga de evidencia, Anulación e Impresión'
                };
            } else if (estado === 0) {
                return {
                    label: 'Finalizado',
                    color: '#FF9F43',
                    icon: 'CheckSquareIcon',
                    class: 'estado-finalizado',
                    desc: 'El convenio ha finalizado. Las acciones de generación, carga de evidencia y anulación están desactivadas.',
                    accionesHabilitadas: 'Únicamente Impresión de documentos'
                };
            } else if (estado === 2) {
                return {
                    label: 'Cerrado',
                    color: '#EA5455',
                    icon: 'LockIcon',
                    class: 'estado-cerrado',
                    desc: 'El convenio se encuentra cerrado. Las acciones de generación, carga de evidencia y anulación están desactivadas.',
                    accionesHabilitadas: 'Únicamente Impresión de documentos'
                };
            } else {
                return {
                    label: 'No especificado',
                    color: '#718096',
                    icon: 'HelpCircleIcon',
                    class: 'estado-desconocido',
                    desc: 'El convenio no tiene un estado definido.',
                    accionesHabilitadas: 'Impresión'
                };
            }
        },
        condicionesGenerarConvenio() {
            if (!this.pedido || Object.keys(this.pedido).length === 0) {
                return {
                    contrato: false,
                    anticipo: false,
                    estado: false
                };
            }
            return {
                contrato: this.pedido.contrato_generado != null,
                anticipo: (this.pedido.anticipo_aprobado > 0 || this.pedido.convenio_anios > 0),
                estado: this.pedido.estado == 1
            };
        },
        puedeGenerarConvenio() {
            let cond = this.condicionesGenerarConvenio;
            return cond.contrato && cond.anticipo && cond.estado;
        },
        yaExisteReporteActivo() {
            // Retorna true si ya hay un reporte en estado 0 (sin evidencia) o 1 (con evidencia)
            return this.Array_Convenios.some(c => c.cdp_estado === '0' || c.cdp_estado === '1');
        }
    },
    mounted() {
        this.cargarConvenio();
    },
    methods: {
        // ─── Carga el listado de convenios del pedido ───────────────────
        cargarConvenio() {
            let me = this;
            if (!me.pedido || !me.pedido.id_pedido) return;

            me.cargando = true;
            me.$http.get(me.$server_url + `VerifcarMetodosGet_Convenio_Documento_Pedido?action=Get_Convenios_xPedido&id_pedido=${me.pedido.id_pedido}&id_pedido_convenio=${me.id_pedido_convenio}`)
                .then(res => {
                    me.Array_Convenios = res.data || [];
                })
                .catch(err => {
                    console.error('Error al cargar convenios:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudieron cargar los convenios del pedido.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                })
                .finally(() => {
                    me.cargando = false;
                });
        },

        // ─── Abre el popup para generar un nuevo convenio ───────────────
        getNuevoConvenio() {
            this.popupGuardarEditar_Convenio = true;
        },

        // ─── Callback cuando el componente hijo emite change ──────────
        changeHandleConvenio(e) {
            let me = this;
            me.popupGuardarEditar_Convenio = false;
            // Si fue exitoso (verificacionemitsaveandedit = 1), recargar el listado
            if (e.verificacionemitsaveandedit === 1) {
                me.cargarConvenio();
                me.$vs.notify({
                    title: '¡Listo!',
                    text: 'El convenio fue generado y registrado correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000
                });

                // Si viene un convenio recién guardado, abrir automáticamente el reporte desde el padre
                if (e.cdp_id) {
                    me.convenioAImprimir = {
                        cdp_id: e.cdp_id,
                        cdp_anio_termina: e.pgc_anio
                    };
                    me.$nextTick(() => {
                        me.popupReporte = true;
                    });
                }
            }
        },

        // ─── Abre popup de confirmación de eliminación ────────────────
        confirmarEliminar(tr) {
            this.convenioAEliminar = tr;
            this.popupEliminar = true;
        },

        // ─── Callback del componente eliminar_gestionconvenio ───────────
        changeHandleEliminar(e) {
            this.popupEliminar = false;
            this.convenioAEliminar = null;
            if (e && e.verificacionemiteliminar === 1) {
                this.cargarConvenio();
            }
        },

        confirmarAnular(tr) {
            this.convenioAAnular = tr;
            this.popupAnular = true;
        },

        changeHandleAnular(e) {
            this.popupAnular = false;
            this.convenioAAnular = null;
            if (e && e.verificacionemitanular === 1) {
                this.cargarConvenio();
            }
        },

        // ─── Abre popup de reimpresión del convenio ────────────────────
        imprimirConvenio(tr) {
            this.convenioAImprimir = tr;
            this.popupReporte = true;
        },

        // ─── Callback del popup de reporte ────────────────────────────
        changeHandleReporte(e) {
            this.popupReporte = false;
            this.convenioAImprimir = null;
        },

        // ─── Abre popup Subir Evidencia ───────────────────────────────
        abrirSubirEvidencia(tr) {
            this.convenioSeleccionado = tr;
            this.popupSubirEvidencia = true;
        },

        // ─── Callback del popup Subir Evidencia ───────────────────────
        changeHandleSubirEvidencia(e) {
            this.popupSubirEvidencia = false;
            this.convenioSeleccionado = null;
            if (e.verificacionemit === 1) {
                this.cargarConvenio();
                this.$vs.notify({
                    title: '¡Evidencia subida!',
                    text: 'Los archivos de evidencia se guardaron y el estado del convenio fue actualizado.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000
                });
            }
        },

        // ─── Abre popup Ver Evidencias ────────────────────────────────
        abrirVerEvidencias(tr) {
            this.convenioSeleccionado = tr;
            this.popupVerEvidencias = true;
        },

        // ─── Callback del popup Ver Evidencias ────────────────────────
        changeHandleVerEvidencias(e) {
            this.popupVerEvidencias = false;
            this.convenioSeleccionado = null;
            if (e && e.verificacionemit === 1) {
                this.cargarConvenio();
                this.$vs.notify({
                    title: '¡Evidencias actualizadas!',
                    text: 'Los archivos de evidencia se guardaron y el estado del convenio fue actualizado.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000
                });
            }
        },

        // ─── Helpers de formato ───────────────────────────────────────
        labelTipoConvenio(tipo) {
            const map = {
                '0': 'Convenio Global',
                '1': 'Pago Convenio',
                '2': 'Anticipo Pedido'
            };
            return map[String(tipo)] || 'Desconocido';
        },

        colorTipoConvenio(tipo) {
            const map = {
                '0': '#3182ce',
                '1': '#28C76F',
                '2': '#FF9F43'
            };
            return map[String(tipo)] || 'dark';
        },

        styleTipoConvenio(tipo) {
            const maps = {
                '0': { bg: 'rgba(49, 130, 206, 0.08)', text: '#2b6cb0', border: 'rgba(49, 130, 206, 0.2)' },
                '1': { bg: 'rgba(40, 199, 111, 0.08)', text: '#1e7e43', border: 'rgba(40, 199, 111, 0.2)' },
                '2': { bg: 'rgba(255, 159, 67, 0.08)', text: '#b75c00', border: 'rgba(255, 159, 67, 0.2)' },
            };
            const item = maps[String(tipo)] || { bg: '#edf2f7', text: '#4a5568', border: '#e2e8f0' };
            return {
                backgroundColor: item.bg,
                color: item.text,
                border: `1px solid ${item.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                lineHeight: '1',
            };
        },

        formatMonto(valor) {
            if (!valor && valor !== 0) return '0.00';
            return parseFloat(valor).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        formatFecha(fecha) {
            if (!fecha) return '—';
            const d = new Date(fecha);
            const pad = n => String(n).padStart(2, '0');
            return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        },

        parseInfoAnulacion(json) {
            if (!json) return {};
            try {
                return typeof json === 'string' ? JSON.parse(json) : json;
            } catch (e) {
                return {};
            }
        },
    }
}
</script>

<style scoped>
.convenio-list-card {
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.convenio-header-banner {
    background: #f8f9fa;
    border: 1px solid #edf2f7;
    padding: 1.2rem 1.8rem;
    border-radius: 12px;
}

.convenio-header-banner .title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2d3748;
}

.convenio-header-banner .subtitle {
    font-size: 0.9rem;
    color: #718096;
}

.btn-add {
    border-radius: 8px !important;
    padding: 0.65rem 1.5rem !important;
    font-weight: 600;
}

/* Badge "reporte activo" que reemplaza el botón */
.reporte-activo-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(40, 199, 111, 0.08);
    border: 1px solid rgba(40, 199, 111, 0.3);
    color: #1e7e43;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
}
.theme-dark .reporte-activo-badge {
    background: rgba(40, 199, 111, 0.12);
    border-color: rgba(40, 199, 111, 0.3);
    color: #48db87;
}

.custom-table {
    margin-top: 1rem;
}

.custom-table>>>.vs-table--thead th {
    background: #f7fafc;
    color: #4a5568;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 12px 10px;
}

.codigo-badge {
    background: #ebf4ff;
    color: #2b6cb0;
    padding: 0.2rem 0.15rem;
    border-radius: 6px;
    font-size: 0.82rem;
    letter-spacing: 0.4px;
    font-family: monospace;
}

/* Loader ring animation */
.loader-ring {
    width: 36px;
    height: 36px;
    border: 4px solid #e2e8f0;
    border-top-color: #3182ce;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

/* Custom modern badges replacing vs-chips */
.custom-badge-primary {
    display: inline-flex;
    align-items: center;
    background-color: #7367f0;
    color: #fff;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
}

/* Sin evidencia (warning) */
.status-sin-evidencia {
    background-color: rgba(255, 159, 67, 0.08);
    color: #d87a00;
    border: 1px solid rgba(255, 159, 67, 0.25);
}
.status-sin-evidencia .status-dot {
    width: 6px;
    height: 6px;
    background-color: #ff9f43;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 159, 67, 0.6);
}

/* Con evidencia (success) */
.status-con-evidencia {
    background-color: rgba(40, 199, 111, 0.08);
    color: #1e7e43;
    border: 1px solid rgba(40, 199, 111, 0.25);
}
.status-con-evidencia .status-dot {
    width: 6px;
    height: 6px;
    background-color: #28c76f;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(40, 199, 111, 0.6);
}

/* Anulado (danger) */
.status-anulado {
    background-color: rgba(234, 84, 85, 0.08);
    color: #b71c1c;
    border: 1px solid rgba(234, 84, 85, 0.25);
}
.status-anulado .status-dot {
    width: 6px;
    height: 6px;
    background-color: #ea5455;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(234, 84, 85, 0.6);
}

/* Ver evidencias button */
.btn-ver-evidencias {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #ebf8ff;
    color: #2b6cb0;
    border: 1px solid rgba(43, 108, 176, 0.2);
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-ver-evidencias:hover {
    background: #2b6cb0;
    color: #ffffff;
    border-color: #2b6cb0;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(43, 108, 176, 0.2), 0 2px 4px -1px rgba(43, 108, 176, 0.1);
}
.btn-ver-evidencias:active {
    transform: translateY(0);
}

/* Variante para convenio anulado */
.btn-ver-evidencias--anulado {
    background: rgba(234, 84, 85, 0.06);
    color: #c53030;
    border-color: rgba(234, 84, 85, 0.2);
}
.btn-ver-evidencias--anulado:hover {
    background: #e53e3e;
    color: #ffffff;
    border-color: #e53e3e;
    box-shadow: 0 4px 6px -1px rgba(229, 62, 62, 0.2);
}
.theme-dark .btn-ver-evidencias--anulado {
    background: rgba(234, 84, 85, 0.1);
    color: #fc8181;
    border-color: rgba(234, 84, 85, 0.25);
}
.theme-dark .btn-ver-evidencias--anulado:hover {
    background: #ea5455;
    color: #ffffff;
    border-color: #ea5455;
}

/* Observation Callout for Anulado */
.observation-callout {
    display: flex;
    align-items: flex-start;
    background: #fff5f5;
    border-left: 3px solid #f56565;
    padding: 6px 10px;
    border-radius: 4px;
    max-width: 220px;
    font-size: 0.72rem;
    color: #c53030;
    line-height: 1.35;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease;
}
.observation-text {
    word-break: break-word;
    font-weight: 500;
}

/* Dark mode styles for list */
.convenio-list-card.theme-dark {
    background: #1e293b !important;
    color: #cbd5e1 !important;
}

.theme-dark .convenio-header-banner {
    background: rgba(15, 23, 42, 0.4) !important;
    border-color: #334155;
}

.theme-dark .convenio-header-banner .title {
    color: #f1f5f9;
}

.theme-dark .convenio-header-banner .subtitle {
    color: #94a3b8;
}

.theme-dark .codigo-badge {
    background: rgba(115, 103, 240, 0.15);
    color: #a5b4fc;
}

.theme-dark .custom-table>>>.vs-table--thead th {
    background: rgba(15, 23, 42, 0.5);
    color: #cbd5e1;
}

.theme-dark .text-gray-700 {
    color: #cbd5e1 !important;
}

.theme-dark .text-gray-600 {
    color: #cbd5e1 !important;
}

.theme-dark .text-gray-500 {
    color: #94a3b8 !important;
}

/* Custom dark status badges */
.theme-dark .status-sin-evidencia {
    background-color: rgba(255, 159, 67, 0.15);
    color: #ffaf5c;
    border-color: rgba(255, 159, 67, 0.3);
}

.theme-dark .status-con-evidencia {
    background-color: rgba(40, 199, 111, 0.15);
    color: #48db87;
    border-color: rgba(40, 199, 111, 0.3);
}

.theme-dark .status-anulado {
    background-color: rgba(234, 84, 85, 0.15);
    color: #ff7676;
    border-color: rgba(234, 84, 85, 0.3);
}

.theme-dark .btn-ver-evidencias {
    background: rgba(115, 103, 240, 0.15);
    color: #a5b4fc;
    border-color: rgba(115, 103, 240, 0.3);
}
.theme-dark .btn-ver-evidencias:hover {
    background: #7367f0;
    color: #ffffff;
    border-color: #7367f0;
}

.theme-dark .observation-callout {
    background: rgba(234, 84, 85, 0.08);
    border-left-color: #ea5455;
    color: #ff7676;
}

/* ─── Premium Smart Help Button (Notion / Stripe / Linear style) ─── */
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
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.04),
        0 4px 12px rgba(115, 103, 240, 0.04);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    user-select: none;
}

/* Dark mode button */
.smart-help-btn.dark {
    background: #1e293b;
    border-color: rgba(115, 103, 240, 0.22);
    color: #a5b4fc;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.1),
        0 4px 12px rgba(0, 0, 0, 0.06);
}

/* Hover state */
.smart-help-btn:hover {
    transform: translateY(-1px);
    border-color: rgba(115, 103, 240, 0.38);
    color: #5b4de0;
    background: #fafafa;
    box-shadow:
        0 4px 14px rgba(115, 103, 240, 0.1),
        0 0 0 2px rgba(115, 103, 240, 0.06);
}
.smart-help-btn.dark:hover {
    border-color: rgba(115, 103, 240, 0.45);
    color: #c7d2fe;
    background: #263148;
    box-shadow:
        0 4px 14px rgba(115, 103, 240, 0.18),
        0 0 0 2px rgba(115, 103, 240, 0.1);
}

/* Active / Expanded state */
.smart-help-btn.active {
    background: #7367F0;
    border-color: #7367F0;
    color: #ffffff;
    box-shadow:
        0 2px 4px rgba(115, 103, 240, 0.22),
        0 4px 14px rgba(115, 103, 240, 0.14);
}
.smart-help-btn.active.dark {
    background: #5b4de0;
    border-color: #5b4de0;
    color: #ffffff;
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        0 4px 14px rgba(115, 103, 240, 0.22);
}

.smart-help-btn__icon {
    font-size: 14px;
    transition: transform 0.22s ease;
}
.smart-help-btn:hover .smart-help-btn__icon {
    transform: rotate(-8deg) scale(1.1);
}
.smart-help-btn.active .smart-help-btn__icon {
    transform: rotate(90deg);
}

.smart-help-btn__text {
    letter-spacing: 0.01em;
}

/* Micro breathing glow animation */
.smart-help-btn {
    animation: breathingGlow 7s ease-in-out infinite;
}

@keyframes breathingGlow {
    0%, 100% {
        box-shadow: 0 4px 12px rgba(115, 103, 240, 0.04);
    }
    50% {
        box-shadow:
            0 4px 16px rgba(115, 103, 240, 0.08),
            0 0 0 1px rgba(115, 103, 240, 0.04);
    }
}

/* Shine Sweep — ultra subtle */
@keyframes shineSweep {
    0% { left: -150%; }
    40% { left: 150%; }
    100% { left: 150%; }
}
.smart-help-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 40%;
    height: 100%;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.28) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-20deg);
    animation: shineSweep 9s infinite ease-in-out;
}
.smart-help-btn.dark::after {
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%
    );
}
.smart-help-btn.active::after {
    display: none;
}

/* ─── Premium Help Panel ─────────────────────────────────── */
.premium-help-panel {
    background: linear-gradient(135deg, #fafbfe 0%, #f4f6fc 100%);
    border: 1px solid rgba(115, 103, 240, 0.1);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 
        0 8px 32px rgba(115, 103, 240, 0.03),
        inset 0 1px 1px rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
}

.premium-help-panel.dark {
    background: linear-gradient(135deg, #1c213d 0%, #15182e 100%);
    border-color: rgba(115, 103, 240, 0.18);
    box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.25),
        inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

/* Panel Header */
.premium-help-panel__header {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(115, 103, 240, 0.08);
    padding-bottom: 14px;
    margin-bottom: 16px;
}
.premium-help-panel__header.dark {
    border-bottom-color: rgba(115, 103, 240, 0.15);
}

.premium-help-panel__header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(115, 103, 240, 0.1);
    color: #7367F0;
    font-size: 16px;
}

.premium-help-panel__title {
    margin: 0;
    font-size: 15px;
    font-weight: 750;
    letter-spacing: -0.01em;
}

.premium-help-panel__subtitle {
    margin: 2px 0 0;
    font-size: 11.5px;
}

/* Grid & Cards */
.premium-help-panel__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.premium-help-card.dark {
    background: #191c35;
    border-color: #24294a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Hover effects */
.premium-help-card:hover {
    transform: translateY(-2px);
    background: #ffffff;
    border-color: rgba(115, 103, 240, 0.25);
    box-shadow: 
        0 8px 20px rgba(115, 103, 240, 0.08),
        0 0 0 1px rgba(115, 103, 240, 0.03);
}

.premium-help-card.dark:hover {
    background: #1e2240;
    border-color: rgba(115, 103, 240, 0.35);
    box-shadow: 
        0 8px 24px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(115, 103, 240, 0.1);
}

/* Highlight Card */
.premium-help-card.highlight {
    background: #fcfbfe;
    border-color: rgba(115, 103, 240, 0.15);
}
.premium-help-card.highlight.dark {
    background: #1b1c3c;
    border-color: rgba(115, 103, 240, 0.25);
}
.premium-help-card.highlight:hover {
    border-color: rgba(115, 103, 240, 0.4);
    box-shadow: 
        0 8px 20px rgba(115, 103, 240, 0.12),
        0 0 0 1px rgba(115, 103, 240, 0.05);
}

/* Icon Box inside Card */
.premium-help-card__icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 15px;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.premium-help-card__icon-box.color-1 {
    background: #e6fcf5;
    color: #0ca678;
}
.premium-help-card.dark .premium-help-card__icon-box.color-1 {
    background: rgba(12, 166, 120, 0.15);
}

.premium-help-card__icon-box.color-2 {
    background: #edf2ff;
    color: #4c6ef5;
}
.premium-help-card.dark .premium-help-card__icon-box.color-2 {
    background: rgba(76, 110, 245, 0.15);
}

.premium-help-card__icon-box.color-3 {
    background: #f3f0ff;
    color: #7048e8;
}
.premium-help-card.dark .premium-help-card__icon-box.color-3 {
    background: rgba(112, 72, 232, 0.15);
}

.premium-help-card__icon-box.color-4 {
    background: #fff0f6;
    color: #d6336c;
}
.premium-help-card.dark .premium-help-card__icon-box.color-4 {
    background: rgba(214, 51, 108, 0.15);
}

.premium-help-card:hover .premium-help-card__icon-box {
    transform: scale(1.08);
}

.premium-help-card__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.premium-help-card__label {
    font-size: 12.5px;
    font-weight: 700;
}

.premium-help-card__desc {
    margin: 0;
    font-size: 11.5px;
    line-height: 1.45;
}

/* ─── Transición premium para el panel de ayuda ────────────────────────────────────── */
.accordion-slide-enter-active {
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                opacity 0.35s ease-out, 
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 600px;
    overflow: hidden;
}
.accordion-slide-leave-active {
    transition: max-height 0.35s cubic-bezier(0.7, 0, 0.84, 0), 
                opacity 0.25s ease-in, 
                transform 0.35s cubic-bezier(0.7, 0, 0.84, 0);
    max-height: 600px;
    overflow: hidden;
}
.accordion-slide-enter {
    max-height: 0 !important;
    opacity: 0;
    transform: translateY(-12px);
}
.accordion-slide-leave-to {
    max-height: 0 !important;
    opacity: 0;
    transform: translateY(-12px);
}

@media (max-width: 900px) {
    .premium-help-panel__grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}

@media (max-width: 600px) {
    .smart-help-btn {
        width: 100%;
        justify-content: center;
    }
}

/* ─── Premium Estado Convenio Banner ─── */
.estado-convenio-banner {
    border-radius: 12px;
    padding: 1rem 1.5rem;
    border: 1px solid;
    transition: all 0.3s ease;
}

.estado-convenio-banner__icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 10px;
    flex-shrink: 0;
}

.estado-convenio-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.estado-convenio-desc {
    font-size: 0.88rem;
    line-height: 1.45;
}

.acciones-permitidas-text {
    display: block;
    margin-top: 2px;
}

.acciones-permitidas-text.text-success {
    color: #28C76F !important;
}
.acciones-permitidas-text.text-warning {
    color: #FF9F43 !important;
}

/* Light Mode Variants */
.estado-convenio-banner.estado-en-curso {
    background-color: rgba(40, 199, 111, 0.04);
    border-color: rgba(40, 199, 111, 0.18);
}
.estado-convenio-banner.estado-finalizado {
    background-color: rgba(255, 159, 67, 0.04);
    border-color: rgba(255, 159, 67, 0.18);
}
.estado-convenio-banner.estado-cerrado {
    background-color: rgba(234, 84, 85, 0.04);
    border-color: rgba(234, 84, 85, 0.18);
}
.estado-convenio-banner.estado-desconocido {
    background-color: rgba(113, 128, 150, 0.04);
    border-color: rgba(113, 128, 150, 0.18);
}

/* Dark Mode Variants */
.estado-convenio-banner.theme-dark {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.estado-convenio-banner.estado-en-curso.theme-dark {
    background-color: rgba(40, 199, 111, 0.08) !important;
    border-color: rgba(40, 199, 111, 0.25) !important;
}
.estado-convenio-banner.estado-finalizado.theme-dark {
    background-color: rgba(255, 159, 67, 0.08) !important;
    border-color: rgba(255, 159, 67, 0.25) !important;
}
.estado-convenio-banner.estado-cerrado.theme-dark {
    background-color: rgba(234, 84, 85, 0.08) !important;
    border-color: rgba(234, 84, 85, 0.25) !important;
}
.estado-convenio-banner.estado-desconocido.theme-dark {
    background-color: rgba(113, 128, 150, 0.08) !important;
    border-color: rgba(113, 128, 150, 0.25) !important;
}

/* Responsive Flex and Alignments for the banner */
.estado-convenio-flex {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.estado-convenio-main-info {
    flex-grow: 1;
}

.estado-convenio-acciones-line {
    border-top: 1px dashed rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.theme-dark .estado-convenio-acciones-line {
    border-top-color: rgba(255, 255, 255, 0.1);
}

.acciones-permitidas-text {
    font-size: 0.85rem;
}

</style>

<style>
.informacionformhijo3 {
    z-index: 51003;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
