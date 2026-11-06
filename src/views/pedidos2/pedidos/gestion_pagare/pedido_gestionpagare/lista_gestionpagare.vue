<template>
<vx-card class="pagare-list-card" :class="{ 'theme-dark': themeMode }">

    <!-- Info Alert if cannot generate pagare (MODERN EMPTY STATE) -->
    <div v-if="!puedeGenerarPagare" class="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border border-gray-100 mt-4 mx-2">

        <!-- Animated / Colored Icon Container -->
        <div class="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <feather-icon icon="InfoIcon" svgClasses="w-10 h-10" />
        </div>

        <h2 class="text-2xl font-extrabold text-gray-800 mb-2 tracking-tight">Requisitos Pendientes</h2>
        <p class="text-gray-500 text-center max-w-lg mb-8 text-base">Para habilitar la gestión de pagarés, este pedido debe cumplir primero con las siguientes condiciones.</p>

        <!-- Requisitos List -->
        <div class="w-full max-w-lg bg-gray-50 p-6 border border-solid border-gray-300 rounded-lg shadow-sm">
            <ul class="space-y-5">
                <!-- CONTRATO -->
                <li class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                        <feather-icon v-if="condicionesGenerarPagare.contrato" icon="CheckCircleIcon" svgClasses="w-6 h-6" style="color: #28C76F;" />
                        <feather-icon v-else icon="XCircleIcon" svgClasses="w-6 h-6" style="color: #EA5455;" />
                    </div>
                    <div class="ml-4">
                        <span class="block font-bold text-lg" style="color: #2d3748;">Contrato Generado</span>
                        <span class="text-sm" style="color: #718096;">El pedido debe contar con su respectivo contrato.</span>
                    </div>
                </li>
                <!-- ANTICIPO / CONVENIO -->
                <li class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                        <feather-icon v-if="condicionesGenerarPagare.anticipo" icon="CheckCircleIcon" svgClasses="w-6 h-6" style="color: #28C76F;" />
                        <feather-icon v-else icon="XCircleIcon" svgClasses="w-6 h-6" style="color: #EA5455;" />
                    </div>
                    <div class="ml-4">
                        <span class="block font-bold text-lg" style="color: #2d3748;">Anticipo o Convenio</span>
                        <span class="text-sm" style="color: #718096;">Es obligatorio tener un anticipo aprobado mayor a $0 o registrar un convenio.</span>
                    </div>
                </li>
                <!-- ESTADO ACTIVO -->
                <li class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                        <feather-icon v-if="condicionesGenerarPagare.estado" icon="CheckCircleIcon" svgClasses="w-6 h-6" style="color: #28C76F;" />
                        <feather-icon v-else icon="XCircleIcon" svgClasses="w-6 h-6" style="color: #EA5455;" />
                    </div>
                    <div class="ml-4">
                        <span class="block font-bold text-lg" style="color: #2d3748;">Estado Activo</span>
                        <span class="text-sm" style="color: #718096;">El estado del pedido debe encontrarse activo.</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <!-- Main Content (only if requirements are met) -->
    <div v-else>
        <!-- Header banner in soft gray -->
        <div class="pagare-header-banner mb-6">
            <div class="flex items-center justify-between flex-wrap">
                <div>
                    <h3 class="title font-bold flex items-center">
                        <feather-icon icon="FileTextIcon" svgClasses="h-6 w-6 mr-2" style="color: #3182ce;" />
                        Listado de Pagarés
                    </h3>
                    <p class="subtitle text-gray-500 mt-1">Gestione y visualice el historial de pagarés generados para este pedido.</p>
                    <!-- Botón Inteligente de Ayuda -->
                    <div class="mt-4">
                        <vx-tooltip
                            style="display: inline-block;"
                            text="Conoce los tipos de pagaré, estados y flujo de evidencias."
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
                <vs-button v-if="(userFacturador || userAdminFacturador || userRoot)" type="filled" color="#3182ce" class="btn-add mt-2 sm:mt-0 shadow" icon-pack="feather" icon="icon-plus" @click="getNuevoPagare">
                    Generar Nuevo Pagaré
                </vs-button>
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
                            Guía rápida de Gestión de Pagarés
                        </h4>
                        <p class="premium-help-panel__subtitle" :class="themeMode ? 'text-white' : 'text-gray-500'">
                            Comprende los tipos de pagaré, el flujo de evidencias y sus estados.
                        </p>
                    </div>
                </div>
                <!-- Tarjetas Informativas -->
                <div class="premium-help-panel__grid">
                    <!-- Tarjeta 1: Tipos de Pagaré -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-1">
                            <i class="feather icon-list"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Tipos de Pagaré
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Los pagarés se clasifican por:<br>
                                • <b>Convenio Global</b><br>
                                • <b>Pago Convenio</b><br>
                                • <b>Anticipo Pedido</b>
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
                                Al generarse, el pagaré inicia en estado <b>Sin evidencia</b>. 
                                Desde el menú de acciones seleccione <b>Subir Evidencia</b> y cargue uno o varios archivos 
                                en formato <b>PDF</b> o <b>imagen</b>, con un máximo total de <b>5 MB</b> por pagaré. 
                                Al completar la carga, el estado cambiará automáticamente a <b>Con Evidencia</b>.
                            </p>
                        </div>
                    </div>
                    <!-- Tarjeta 3: Estados y Anulación -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-2">
                            <i class="feather icon-slash"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Anulaciones y Control
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Si necesita invalidar un pagaré, desde el menú de acciones 
                                seleccione <b>Anular</b> e ingrese una justificación obligatoria para invalidar el pagaré.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Loading indicator -->
        <div v-if="cargando" class="flex justify-center items-center py-10">
            <div class="loader-ring"></div>
            <span class="ml-3 text-gray-500">Cargando pagarés...</span>
        </div>

        <!-- Table Listing -->
        <vs-table v-else max-items="10" pagination search :data="Array_Pagares" no-data-text="No hay registros de pagarés generados al momento" class="custom-table">
            <template slot="header">
                <vs-chip v-if="Array_Pagares" color="primary">Cantidad: <b> {{ Array_Pagares.length }}</b></vs-chip>
            </template>

            <template slot="thead">
                <!-- <vs-th sort-key="pgc_id" width="80">ID</vs-th> -->
                <vs-th width="60">#</vs-th>
                <vs-th width="250">Código / Detalle del Pagaré</vs-th>
                <vs-th width="250">Beneficiario / Empresa</vs-th>
                <vs-th sort-key="pgc_estado" width="150">Estado</vs-th>
                <vs-th width="190">Seguimiento</vs-th>
                <vs-th width="100">Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <!-- ID Comentado y reemplazado por Contador -->
                    <!-- <vs-td>
                        <span class="font-bold text-gray-600">#{{ tr.pgc_id }}</span>
                    </vs-td> -->
                    <vs-td>
                        <span class="font-bold text-gray-600">{{ Array_Pagares.length - Array_Pagares.indexOf(tr) }}</span>
                    </vs-td>
                    <!-- Código / Detalle del Pagaré -->
                    <vs-td>
                        <div class="flex flex-col gap-1.5 items-start">
                            <div>
                                <span class="font-semibold text-primary codigo-badge">{{ tr.pgc_codigo }}</span>
                            </div>
                            <div>
                                <div :style="styleTipoPagare(tr.pgc_tipo_pagare)">
                                    {{ labelTipoPagare(tr.pgc_tipo_pagare) }}
                                </div>
                            </div>
                            <div class="text-xs text-gray-700"><b>Monto:</b> <span class="text-success font-bold">${{ formatMonto(tr.pgc_monto) }}</span></div>
                            <div class="text-xs text-gray-500"><b>Año Final:</b> {{ tr.pgc_anio }}</div>
                        </div>
                    </vs-td>
                    <!-- Beneficiario / Empresa -->
                    <vs-td>
                        <div><b>Benef.:</b> {{ tr.nombre_beneficiario || '—' }}</div>
                        <div class="text-xs text-gray-500 mt-1"><b>Empresa:</b> {{ tr.nombre_empresa || '—' }}</div>
                    </vs-td>
                    <!-- Estado -->
                    <vs-td>
                        <div class="flex flex-col items-start gap-2">
                            <!-- Sin evidencia -->
                            <div v-if="tr.pgc_estado == '0'" class="status-badge status-sin-evidencia">
                                <span class="status-dot"></span>
                                Sin evidencia
                            </div>
                            <!-- Con evidencia -->
                            <div v-else-if="tr.pgc_estado == '1'" class="flex flex-wrap items-center gap-2">
                                <div class="status-badge status-con-evidencia">
                                    <span class="status-dot"></span>
                                    Con Evidencia
                                </div>
                                <button @click="abrirVerEvidencias(tr)" class="btn-ver-evidencias" title="Visualizar evidencias de pagaré">
                                    <feather-icon icon="EyeIcon" svgClasses="w-5 h-5" />
                                    <span>Ver Evidencia/s ({{ tr.cantidad_evidencias }})</span>
                                </button>
                            </div>
                            <!-- Anulado -->
                            <div v-else-if="tr.pgc_estado == '2'" class="flex flex-col items-start gap-1.5 w-full">
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
                                <button v-if="tr.cantidad_evidencias > 0" @click="abrirVerEvidencias(tr)" class="btn-ver-evidencias btn-ver-evidencias--anulado" title="Ver evidencias del pagaré anulado">
                                    <feather-icon icon="EyeIcon" svgClasses="w-4 h-4" />
                                    <span>Ver Evidencia/s ({{ tr.cantidad_evidencias }})</span>
                                </button>
                            </div>
                        </div>
                    </vs-td>
                    <!-- Seguimiento -->
                    <vs-td>
                        <div class="flex flex-col text-xs leading-normal">
                            <span class="text-gray-700">
                                <b>Creación:</b> {{ tr.creador_nombre || '—' }} ({{ formatFecha(tr.created_at) }})
                            </span>
                            <span v-if="tr.subidaevidencia_at" class="text-gray-700 mt-1">
                                <b>Subida de Evidencia:</b> {{ tr.subida_nombre || '—' }} ({{ formatFecha(tr.subidaevidencia_at) }})
                            </span>
                            <span v-if="tr.pgc_estado == '2' && tr.info_anulacion" class="mt-1" style="color:#EA5455;">
                                <b>Anulación:</b> {{ tr.anulador_nombre || '—' }} ({{ formatFecha(parseInfoAnulacion(tr.info_anulacion).fecha_anular) }})
                            </span>
                        </div>
                    </vs-td>
                    <!-- Acciones -->
                    <vs-td>
                        <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 230px;" class="cursor informacionformhijo2">
                                <vs-dropdown-item>
                                    <!-- Imprimir -->
                                    <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-printer" class="w-full text-left" @click="imprimirPagare(tr)">
                                        Imprimir
                                    </vs-button>
                                    <!-- Subir Evidencia -->
                                    <vs-button v-if="(tr.pgc_estado != '1' && tr.pgc_estado != '2') && (userFacturador || userAdminFacturador || userRoot)" color="#28C76F" type="line" icon-pack="feather" icon="icon-upload-cloud" class="w-full text-left" @click="abrirSubirEvidencia(tr)">
                                        Subir Evidencia
                                    </vs-button>
                                    <!-- Anular -->
                                    <vs-button v-if="tr.pgc_estado != '2' && (userFacturador || userAdminFacturador || userRoot)" color="#FF9F43" type="line" icon-pack="feather" icon="icon-slash" class="w-full text-left" @click="confirmarAnular(tr)">
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

    <!-- POPUP REGISTRO/GENERACION DE PAGARE -->
    <vs-popup class="informacionformhijo" title="Generar e Imprimir Pagaré" :active.sync="popupGuardarEditar_Pagare" fullscreen>
        <registro_edicion_gestionpagare v-if="popupGuardarEditar_Pagare" :pedido="pedido" :datosInstitucion="datosInstitucion" @change="changeHandlePagare" />
    </vs-popup>

    <!-- POPUP REPORTE / REIMPRESION DE PAGARE -->
    <vs-popup class="informacionformhijo" title="Imprimir Pagaré" :active.sync="popupReporte" fullscreen>
        <reporte_gestionpagare v-if="popupReporte && pagareAImprimir" :pgc_id="pagareAImprimir.pgc_id" :aniosAnteriorSelect="String(pagareAImprimir.pgc_anio)" @change="changeHandleReporte" />
    </vs-popup>

    <!-- POPUP SUBIR EVIDENCIA -->
    <vs-popup class="informacionformhijo" title="Subir Evidencia del Pagaré" :active.sync="popupSubirEvidencia" fullscreen>
        <subir_evidencia_gestionpagare v-if="popupSubirEvidencia && pagareSeleccionado" :pgc_id="pagareSeleccionado.pgc_id" :pgc_codigo="pagareSeleccionado.pgc_codigo" @change="changeHandleSubirEvidencia" />
    </vs-popup>

    <!-- POPUP VER EVIDENCIAS -->
    <vs-popup class="informacionformhijo" title="Evidencias del Pagaré" :active.sync="popupVerEvidencias" fullscreen>
        <ver_evidencias_gestionpagare v-if="popupVerEvidencias && pagareSeleccionado" :pgc_id="pagareSeleccionado.pgc_id" :pgc_codigo="pagareSeleccionado.pgc_codigo" :pgc_estado="pagareSeleccionado.pgc_estado" @change="changeHandleVerEvidencias" />
    </vs-popup>

    <!-- POPUP CONFIRMAR ELIMINAR -->
    <vs-popup title="Eliminar Pagaré" :active.sync="popupEliminar">
        <eliminar_gestionpagare v-if="popupEliminar && pagareAEliminar" :pagare="pagareAEliminar" @change="changeHandleEliminar" />
    </vs-popup>

    <!-- POPUP CONFIRMAR ANULAR -->
    <vs-popup title="Confirmar Anulación" :active.sync="popupAnular">
        <anular_gestionpagare v-if="popupAnular && pagareAAnular" :pagare="pagareAAnular" @change="changeHandleAnular" />
    </vs-popup>

</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";

const registro_edicion_gestionpagare = () => import("@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/registro_edicion_gestionpagare.vue");
const reporte_gestionpagare = () => import("@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/reporte_gestionpagare.vue");
const subir_evidencia_gestionpagare = () => import("@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/subir_evidencia_gestionpagare.vue");
const ver_evidencias_gestionpagare = () => import("@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/ver_evidencias_gestionpagare.vue");
const anular_gestionpagare = () => import("@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/anular_gestionpagare.vue");
const eliminar_gestionpagare = () => import("@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/eliminar_gestionpagare.vue");

export default {
    data() {
        return {
            expandirInfo: false,
            Array_Pagares: [],
            popupGuardarEditar_Pagare: false,
            popupEliminar: false,
            pagareAEliminar: null,
            popupReporte: false,
            pagareAImprimir: null,
            cargando: false,
            // Evidencia
            popupSubirEvidencia: false,
            popupVerEvidencias: false,
            pagareSeleccionado: null,
            // Anular
            popupAnular: false,
            pagareAAnular: null,
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
    },
    components: {
        registro_edicion_gestionpagare,
        reporte_gestionpagare,
        subir_evidencia_gestionpagare,
        ver_evidencias_gestionpagare,
        anular_gestionpagare,
        eliminar_gestionpagare,
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'userFacturador', 'userAdminFacturador']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        condicionesGenerarPagare() {
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
        puedeGenerarPagare() {
            let cond = this.condicionesGenerarPagare;
            return cond.contrato && cond.anticipo && cond.estado;
        }
    },
    mounted() {
        if (this.puedeGenerarPagare) {
            this.cargarPagares();
        }
    },
    methods: {
        // ─── Carga el listado de pagarés del pedido ───────────────────
        cargarPagares() {
            let me = this;
            if (!me.pedido || !me.pedido.id_pedido) return;

            me.cargando = true;
            me.$http.get(me.$server_url + `VerifcarMetodosGet_Pagare_Pedido?action=Get_Pagares_xPedido&id_pedido=${me.pedido.id_pedido}`)
                .then(res => {
                    me.Array_Pagares = res.data || [];
                })
                .catch(err => {
                    console.error('Error al cargar pagarés:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudieron cargar los pagarés del pedido.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                })
                .finally(() => {
                    me.cargando = false;
                });
        },

        // ─── Abre el popup para generar un nuevo pagaré ───────────────
        getNuevoPagare() {
            this.popupGuardarEditar_Pagare = true;
        },

        // ─── Callback cuando el componente hijo emite change ──────────
        changeHandlePagare(e) {
            let me = this;
            me.popupGuardarEditar_Pagare = false;
            // Si fue exitoso (verificacionemitsaveandedit = 1), recargar el listado
            if (e.verificacionemitsaveandedit === 1) {
                me.cargarPagares();
                me.$vs.notify({
                    title: '¡Listo!',
                    text: 'El pagaré fue generado y registrado correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000
                });

                // Si viene un pagaré recién guardado, abrir automáticamente el reporte desde el padre
                if (e.pgc_id) {
                    me.pagareAImprimir = {
                        pgc_id: e.pgc_id,
                        pgc_anio: e.pgc_anio
                    };
                    me.$nextTick(() => {
                        me.popupReporte = true;
                    });
                }
            }
        },

        // ─── Abre popup de confirmación de eliminación ────────────────
        confirmarEliminar(tr) {
            this.pagareAEliminar = tr;
            this.popupEliminar = true;
        },

        // ─── Callback del componente eliminar_gestionpagare ───────────
        changeHandleEliminar(e) {
            this.popupEliminar = false;
            this.pagareAEliminar = null;
            if (e && e.verificacionemiteliminar === 1) {
                this.cargarPagares();
            }
        },

        confirmarAnular(tr) {
            this.pagareAAnular = tr;
            this.popupAnular = true;
        },

        changeHandleAnular(e) {
            this.popupAnular = false;
            this.pagareAAnular = null;
            if (e && e.verificacionemitanular === 1) {
                this.cargarPagares();
            }
        },

        // ─── Abre popup de reimpresión del pagaré ────────────────────
        imprimirPagare(tr) {
            this.pagareAImprimir = tr;
            this.popupReporte = true;
        },

        // ─── Callback del popup de reporte ────────────────────────────
        changeHandleReporte(e) {
            this.popupReporte = false;
            this.pagareAImprimir = null;
        },

        // ─── Abre popup Subir Evidencia ───────────────────────────────
        abrirSubirEvidencia(tr) {
            this.pagareSeleccionado = tr;
            this.popupSubirEvidencia = true;
        },

        // ─── Callback del popup Subir Evidencia ───────────────────────
        changeHandleSubirEvidencia(e) {
            this.popupSubirEvidencia = false;
            this.pagareSeleccionado = null;
            if (e.verificacionemit === 1) {
                this.cargarPagares();
                this.$vs.notify({
                    title: '¡Evidencia subida!',
                    text: 'Los archivos de evidencia se guardaron y el estado del pagaré fue actualizado.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000
                });
            }
        },

        // ─── Abre popup Ver Evidencias ────────────────────────────────
        abrirVerEvidencias(tr) {
            this.pagareSeleccionado = tr;
            this.popupVerEvidencias = true;
        },

        // ─── Callback del popup Ver Evidencias ────────────────────────
        changeHandleVerEvidencias(e) {
            this.popupVerEvidencias = false;
            this.pagareSeleccionado = null;
            if (e && e.verificacionemit === 1) {
                this.cargarPagares();
                this.$vs.notify({
                    title: '¡Evidencias actualizadas!',
                    text: 'Los archivos de evidencia se guardaron y el estado del pagaré fue actualizado.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000
                });
            }
        },

        // ─── Helpers de formato ───────────────────────────────────────
        labelTipoPagare(tipo) {
            const map = {
                '0': 'Convenio Global',
                '1': 'Pago Convenio',
                '2': 'Anticipo Pedido'
            };
            return map[String(tipo)] || 'Desconocido';
        },

        colorTipoPagare(tipo) {
            const map = {
                '0': '#3182ce',
                '1': '#28C76F',
                '2': '#FF9F43'
            };
            return map[String(tipo)] || 'dark';
        },

        styleTipoPagare(tipo) {
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
.pagare-list-card {
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.pagare-header-banner {
    background: #f8f9fa;
    border: 1px solid #edf2f7;
    padding: 1.2rem 1.8rem;
    border-radius: 12px;
}

.pagare-header-banner .title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2d3748;
}

.pagare-header-banner .subtitle {
    font-size: 0.9rem;
    color: #718096;
}

.btn-add {
    border-radius: 8px !important;
    padding: 0.65rem 1.5rem !important;
    font-weight: 600;
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

/* Variante para pagaré anulado */
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
.pagare-list-card.theme-dark {
    background: #1e293b !important;
    color: #cbd5e1 !important;
}

.theme-dark .pagare-header-banner {
    background: rgba(15, 23, 42, 0.4) !important;
    border-color: #334155;
}

.theme-dark .pagare-header-banner .title {
    color: #f1f5f9;
}

.theme-dark .pagare-header-banner .subtitle {
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


</style>

<style>
.informacionformhijo2 {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
