<template>
<div class="p-2">
    <!-- Header with Breadcrumb, Button and Collapsible Info Panel -->
    <div class="mb-5 p-5 rounded-lg shadow-sm border" :class="{ 'bg-white border-gray-100': !themeMode, 'night-bg-card': themeMode }">
        <!-- Header main row -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center">
                <vs-avatar color="primary" icon="description" size="large" class="mr-4 shadow-md" />
                <div>
                    <h3 class="text-xl font-bold" :class="{ 'text-gray-800': !themeMode, 'night-text': themeMode }">Formatos de Pagaré</h3>
                    <p class="text-sm mt-1" :class="{ 'text-gray-500': !themeMode, 'night-text-muted': themeMode }">
                        Gestione los formatos de pagaré para el período seleccionado.
                    </p>
                    <!-- Botón Inteligente de Ayuda -->
                    <div class="mt-4">
                        <vx-tooltip style="display: inline-block;" text="Aprende cómo funcionan los estados y aprobaciones." position="right">
                            <button class="smart-help-btn" :class="{'active': expandirInfo, 'dark': themeMode}" @click="expandirInfo = !expandirInfo" >
                                <i class="feather smart-help-btn__icon" :class="expandirInfo ? 'icon-x' : 'icon-book-open'"></i>
                                <span class="smart-help-btn__text">
                                    {{ expandirInfo ? 'Ocultar guía' : 'Ver guía rápida' }}
                                </span>
                            </button>
                        </vx-tooltip>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <vs-button class="shadow-lg" color="success" type="gradient" icon="add" @click="popupFormasCreacion = true">Nuevo Formato</vs-button>
            </div>
        </div>
        <!-- Panel de Onboarding Contextual Premium -->
        <transition name="accordion-slide">
            <div v-if="expandirInfo" class="premium-help-panel mt-5" :class="{'dark': themeMode}">
                <!-- Encabezado del Panel -->
                <div class="premium-help-panel__header" :class="{'dark': themeMode}">
                    <div class="premium-help-panel__header-icon">
                        <i class="feather icon-zap"></i>
                    </div>
                    <div>
                        <h4 class="premium-help-panel__title" :class="themeMode ? 'text-white' : 'text-gray-800'">
                            Guía rápida del módulo
                        </h4>
                        <p class="premium-help-panel__subtitle" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                            Entiende cómo funcionan los formatos y aprobaciones de pagarés.
                        </p>
                    </div>
                </div>
                <!-- Tarjetas Informativas -->
                <div class="premium-help-panel__grid">
                    <!-- Tarjeta 1 -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-1">
                            <i class="feather icon-check-circle"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Un Solo Formato Aprobado
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Puede crear varios formatos, pero <b>solo el que esté Aprobado</b> será utilizado para generar nuevos pagarés en los pedidos.
                            </p>
                        </div>
                    </div>
                    <!-- Tarjeta 2 -->
                    <div class="premium-help-card" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-2">
                            <i class="feather icon-sliders"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Estados de Formato
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Los formatos en estado <b>Inactivo</b> o <b>Pendiente de aprobación</b> no se utilizarán al momento de generar nuevos pagarés.
                            </p>
                        </div>
                    </div>
                    <!-- Tarjeta 3 -->
                    <div class="premium-help-card highlight" :class="{'dark': themeMode}">
                        <div class="premium-help-card__icon-box color-3">
                            <i class="feather icon-refresh-cw"></i>
                        </div>
                        <div class="premium-help-card__content">
                            <span class="premium-help-card__label" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                Modificación sin Alterar Historial
                            </span>
                            <p class="premium-help-card__desc" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                                Para usar un nuevo formato sin alterar los pagarés que ya fueron emitidos, debe <b>inactivar el formato aprobado actual</b> y aprobar el nuevo formato.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

    <!-- Table -->
    <vs-table max-items="10" search pagination :data="listaPagares" class="shadow-lg rounded-lg" no-data-text="No hay datos disponibles">
        <template slot="header">
            <div class="flex items-center flex-wrap p-4 gap-4">
                <h4 class="font-bold" :class="{ 'text-gray-700': !themeMode, 'night-text': themeMode }">
                    Listado de Formatos ({{periodoSelect.periodoescolar}})
                </h4>
                <vs-chip v-if="listaPagares" color="primary" class="m-0">
                    Cantidad: <b class="ml-1">{{ listaPagares.length }}</b>
                </vs-chip>
            </div>
        </template>
        <template slot="thead">
            <vs-th sort-key="paf_id">#</vs-th>
            <vs-th sort-key="paf_nombre">Nombre</vs-th>
            <vs-th sort-key="paf_descripcion">Descripción</vs-th>
            <vs-th sort-key="paf_estado">Estado</vs-th>
            <vs-th>Seguimiento</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="transition duration-150" :class="{ 'hover:bg-gray-50': !themeMode }">
                <vs-td>{{ tr.paf_id }}</vs-td>
                <vs-td><b>{{ tr.paf_nombre }}</b></vs-td>
                <vs-td>{{ tr.paf_descripcion }}</vs-td>
                <vs-td>
                    <vs-chip v-if="tr.paf_estado == '2'" color="success" class="font-semibold">Aprobado</vs-chip>
                    <vs-chip v-else-if="tr.paf_estado == '1'" color="warning" class="font-semibold">Pendiente de aprobación</vs-chip>
                    <vs-chip v-else color="danger" class="font-semibold">Inactivo</vs-chip>
                </vs-td>
                <!-- Seguimiento -->
                <vs-td>
                    <div v-if="tr.creador_nombre" class="mb-1 text-xs">
                        <span class="font-bold text-gray-700">Creador:</span>
                        <div class="ml-1 text-gray-600 font-semibold">{{ tr.creador_nombre }}</div>
                        <div class="ml-1 text-gray-500 text-[10px]" v-if="tr.creador_fecha">{{ tr.creador_fecha }}</div>
                    </div>
                    
                    <!-- Estado = '1' -> Pendiente -->
                    <div v-if="tr.paf_estado == '1' && tr.activador_nombre" class="text-xs">
                        <span class="font-bold text-warning">Activado a Pendiente por:</span>
                        <div class="ml-1 text-gray-600 font-semibold">{{ tr.activador_nombre }}</div>
                        <div class="ml-1 text-gray-500 text-[10px]" v-if="tr.activador_fecha">{{ tr.activador_fecha }}</div>
                    </div>
                    
                    <!-- Estado = '2' -> Aprobado -->
                    <div v-if="tr.paf_estado == '2' && tr.aprobador_nombre" class="text-xs">
                        <span class="font-bold text-success">Aprobado por:</span>
                        <div class="ml-1 text-gray-600 font-semibold">{{ tr.aprobador_nombre }}</div>
                        <div class="ml-1 text-gray-500 text-[10px]" v-if="tr.aprobador_fecha">{{ tr.aprobador_fecha }}</div>
                    </div>
                    
                    <!-- Estado = '0' -> Inactivo -->
                    <div v-if="tr.paf_estado == '0' && tr.anulador_nombre" class="text-xs">
                        <span class="font-bold text-danger">Inactivado por:</span>
                        <div class="ml-1 text-gray-600 font-semibold">{{ tr.anulador_nombre }}</div>
                        <div class="ml-1 text-gray-500 text-[10px]" v-if="tr.anulador_fecha">{{ tr.anulador_fecha }}</div>
                    </div>

                    <div v-if="!tr.creador_nombre && !tr.aprobador_nombre && !tr.activador_nombre && !tr.anulador_nombre" class="text-xs text-gray-400 italic">
                        Sin información de seguimiento
                    </div>
                </vs-td>
                <vs-td :data="data[indextr].paf_id">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 220px;" class="cursor informacionformhijo2">
                            <vs-dropdown-item>
                                <!-- Visualizar -->
                                <vs-button color="#7367F0" type="line" icon-pack="feather" icon="icon-eye" class="w-full text-left" @click="openModalVisualizar(tr)">
                                    Visualizar
                                </vs-button>
                                <!-- Editar (solo si no está inactivo) -->
                                <vs-button v-if="tr.paf_estado == '1'" color="#28C76F" type="line" icon-pack="feather" icon="icon-edit" class="w-full text-left" @click="openModalEditar(tr)">Editar</vs-button>
                                <!-- Aprobar (solo si estado es 1 = pendiente) -->
                                <vs-button v-if="tr.paf_estado == '1'" color="#FF9F43" type="line" icon-pack="feather" icon="icon-check-circle" class="w-full text-left" @click="cambiarEstadoDesdeListado(tr, 2)">
                                    Aprobar
                                </vs-button>
                                <!-- Inactivar (solo si no está ya inactivo) -->
                                <vs-button v-if="tr.paf_estado != '0'" color="#EA5455" type="line" icon-pack="feather" icon="icon-slash" class="w-full text-left" @click="cambiarEstadoDesdeListado(tr, 0)">
                                    Inactivar
                                </vs-button>
                                <!-- Activar a Pendiente (solo si está inactivo) -->
                                <vs-button v-if="tr.paf_estado == '0' && userRoot" color="#00B8D9" type="line" icon-pack="feather" icon="icon-rotate-cw" class="w-full text-left" @click="cambiarEstadoDesdeListado(tr, 1)">
                                    Pasar a Pendiente
                                </vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>

    <!-- POPUP VISUALIZAR -->
    <vs-popup title="Visualizar Formato Pagaré" :active.sync="popupVisualizar" class="informacionformhijodehijo" fullscreen style="padding: 5px;">
        <visualizar-formato v-if="popupVisualizar" :formatoDatos="formatoToView" :periodoSelect="periodoSelect" @change="changeHandle_Visualizar" />
    </vs-popup>

    <!-- POPUP EDITAR / NUEVO -->
    <vs-popup :title="verificar_creacion_edicion === 2 ? 'Editar Formato Pagaré' : 'Nuevo Formato Pagaré'" :active.sync="popupEditar" class="informacionformhijodehijo" fullscreen style="padding: 5px;">
        <registro-edicion-formato v-if="popupEditar" :formatoDatos="formatoToEdit" :periodoSelect="periodoSelect" :verificar_creacion_edicion="verificar_creacion_edicion" @change="changeHandle_Editar" />
    </vs-popup>

    <!-- POPUP SELECCIÓN MÉTODO DE CREACIÓN -->
    <vs-popup title="Nuevo Formato — ¿Cómo deseas empezar?" :active.sync="popupFormasCreacion" class="informacionformhijodehijo" style="padding: 5px;">
        <formas-creacion-formato v-if="popupFormasCreacion" :periodoSelect="periodoSelect" @change="changeHandle_FormasCreacion" />
    </vs-popup>

    <!-- POPUP COPIAR DE OTRO PERIODO -->
    <vs-popup title="Copiar Formatos de Otro Periodo" :active.sync="popupCopiarPeriodo" class="informacionformhijodehijo" fullscreen style="padding: 5px;">
        <copiar-formato-otroperiodo v-if="popupCopiarPeriodo" :periodoSelect="periodoSelect" @change="changeHandle_CopiarPeriodo" />
    </vs-popup>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
const VisualizarFormato = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/visualizar_formato.vue');
const RegistroEdicionFormato = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/registro_edicion_formato.vue');
const FormasCreacionFormato = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/Formas_Creacion_Formato.vue');
const CopiarFormatoOtroPeriodo = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/Copiar_Formato_OtroPeriodo_Formato.vue');

import PopupHistoryMixin from '@/mixins/PopupHistoryMixin';

export default {
    mixins: [PopupHistoryMixin],
    components: {
        VisualizarFormato,
        RegistroEdicionFormato,
        FormasCreacionFormato,
        'copiar-formato-otroperiodo': CopiarFormatoOtroPeriodo,
    },
    props: {
        periodoSelect: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            listaPagares: [],
            // Popup Visualizar
            popupVisualizar: false,
            formatoToView: null,
            // Popup Editar / Nuevo
            popupEditar: false,
            formatoToEdit: null,
            verificar_creacion_edicion: 0, // 1 = Nuevo, 2 = Editar
            // Popup selección método de creación
            popupFormasCreacion: false,
            // Popup copiar de otro periodo
            popupCopiarPeriodo: false,
            // Acordeón de información
            expandirInfo: false,
        };
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'userFacturador', 'userAdminFacturador']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        }
    },
    created() {
        this.registerPopupHistory('popupVisualizar');
        this.registerPopupHistory('popupEditar');
        this.registerPopupHistory('popupFormasCreacion');
        this.registerPopupHistory('popupCopiarPeriodo');
    },
    mounted() {
        this.getListaPagares();
    },
    methods: {
        getListaPagares() {
            let me = this;
            me.$vs.loading();
            const datos = {
                action: 'TodosPagare_x_periodo_Back',
                idperiodoescolar: me.periodoSelect.idperiodoescolar,
            };
            me.$http.get(me.$server_url + 'Procesar_MetodosGet_Pagare_FormatoController', {
                    params: datos
                })
                .then(res => {
                    me.listaPagares = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },

        // ── Nuevo (abre selector de método de creación) ────────────────────────
        openModalNuevo() {
            this.popupFormasCreacion = true;
        },

        // ── Handler del selector de método de creación ─────────────────────────
        changeHandle_FormasCreacion(e) {
            this.popupFormasCreacion = false;
            if (e.tipo === 'crear_vacio') {
                // Flujo original: abrir formulario en blanco con delay para estabilizar historial
                setTimeout(() => {
                    this.formatoToEdit = null;
                    this.verificar_creacion_edicion = 1;
                    this.popupEditar = true;
                }, 300);
            } else if (e.tipo === 'copiar_periodo') {
                // Abrir componente copiar de otro periodo con delay para estabilizar historial
                setTimeout(() => {
                    this.popupCopiarPeriodo = true;
                }, 300);
            }
        },

        // ── Handler copiar de otro periodo ────────────────────────────────────
        changeHandle_CopiarPeriodo(e) {
            this.popupCopiarPeriodo = false;
            if (e.tipo === 'formatos_copiados') {
                // Refrescar la lista con los nuevos formatos copiados
                this.getListaPagares();
            }
        },

        // ── Visualizar ─────────────────────────────────────────────────────────
        openModalVisualizar(tr) {
            this.formatoToView = {
                ...tr
            };
            this.popupVisualizar = true;
        },

        // ── Editar ─────────────────────────────────────────────────────────────
        openModalEditar(tr) {
            this.formatoToEdit = {
                ...tr
            };
            this.verificar_creacion_edicion = 2;
            this.popupEditar = true;
        },

        // ── Cambiar estado directo desde el listado (Aprobar / Inactivar / Activar) ───────
        cambiarEstadoDesdeListado(tr, nuevoEstado) {
            let me = this;
            let color, titulo, texto, action, confirmText;

            if (nuevoEstado === 2) {
                color = 'warning';
                titulo = 'Aprobar Formato';
                texto = `¿Desea aprobar el formato "${tr.paf_nombre}"? Estará disponible en los pedidos.`;
                action = 'Aprobar_Pagare_Formato_Back';
                confirmText = 'Sí, Aprobar';
            } else if (nuevoEstado === 1) {
                color = 'primary';
                titulo = 'Pasar a Pendiente';
                texto = `¿Desea cambiar el estado del formato "${tr.paf_nombre}" a Pendiente de aprobación?`;
                action = 'Activar_Pagare_Formato_Back';
                confirmText = 'Sí, Pasar a Pendiente';
            } else {
                color = 'danger';
                titulo = 'Inactivar Formato';
                texto = `¿Desea inactivar el formato "${tr.paf_nombre}"? Dejará de estar disponible en los pedidos.`;
                action = 'Inactivar_Pagare_Formato_Back';
                confirmText = 'Sí, Inactivar';
            }

            me.$vs.dialog({
                type: 'confirm',
                color,
                title: titulo,
                text: texto,
                acceptText: confirmText,
                cancelText: 'Cancelar',
                accept: () => {
                    const userPlatform = JSON.parse(localStorage.getItem('usuario')) || {};
                    const idusuario = userPlatform.idusuario || null;

                    me.$vs.loading();
                    const formData = new FormData();
                    formData.append('action', action);
                    formData.append('paf_id', tr.paf_id);
                    formData.append('idusuario', idusuario);

                    me.$http.post(me.$server_url + 'Procesar_MetodosPost_Pagare_FormatoController', formData)
                        .then(res => {
                            me.$vs.loading.close();
                            if (res.data.status == 1) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                                me.getListaPagares();
                            } else {
                                // El backend rechazó la operación (estado ya cambió por otro usuario)
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-triangle',
                                    time: 5000
                                });
                                me.getListaPagares(); // Refrescar para mostrar el estado real
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            me.$vs.loading.close();
                            me.$vs.notify({
                                text: 'Error de conexión',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 5000
                            });
                        });
                }
            });
        },

        // ── Handlers de eventos de hijos ───────────────────────────────────────
        changeHandle_Visualizar(e) {
            // verificaremit_regsitro_edicion: 1 = acción guardada, 2 = cerrar
            if (e.verificaremit_regsitro_edicion === 1) {
                this.popupVisualizar = false;
                this.getListaPagares();
            } else {
                this.popupVisualizar = false;
            }
        },

        changeHandle_Editar(e) {
            // verificaremit_regsitro_edicion: 1 = guardado, 2 = cancelar
            if (e.verificaremit_regsitro_edicion === 1) {
                this.popupEditar = false;
                this.getListaPagares();
            } else {
                this.popupEditar = false;
            }
        },
    },
};
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51003;
}

/* Dark Mode Overrides */
.night-bg-card {
    background-color: #262c49 !important;
    border-color: #414561 !important;
}

.night-text {
    color: #e0e0e0 !important;
}

.night-text-muted {
    color: #b0b4cc !important;
}

.informacionformhijo2 {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
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

/* Spacing Helpers */
.gap-2\.5 {
    gap: 0.625rem;
}
.cursor-pointer {
    cursor: pointer;
}
.select-none {
    user-select: none;
}

/* Responsive Stacked Layout */
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
