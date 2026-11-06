<template>
<div>
    <div>
        <!-- Card de Filtros Mejorado -->
        <vx-card class="mb-6">
            <h5 class="mb-4">
                <i class="feather icon-filter mr-2"></i>
                Filtros de Búsqueda
            </h5>
            
            <!-- Grid de filtros -->
            <div class="grid grid-cols-1 gap-4 mb-4">
                <!-- Filtro por Búsqueda -->
                <div>
                    <label class="text-sm font-medium mb-2 block">Búsqueda general:</label>
                    <vs-input 
                        v-model="busqueda" 
                        @keyup.enter="getDocumentosFacturacion" 
                        class="w-full" 
                        icon-pack="feather"
                        icon="icon-search"
                        placeholder="Buscar por: documento, cliente, devolución bodega, factura Perseo, nota crédito...">
                    </vs-input>
                </div>
            </div>

            <!-- Checkbox Solo Pendientes NC -->
            <div class="flex items-center gap-4 mb-4">
                <vs-checkbox v-model="soloPendientesNC" @change="getDocumentosFacturacion">
                    Solo documentos con Notas de Crédito pendientes
                </vs-checkbox>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center gap-2">
                <vs-button @click="getDocumentosFacturacion" color="primary" icon-pack="feather" icon="icon-search">
                    Buscar
                </vs-button>
                <vs-button 
                    v-if="filtrosActivos.length > 0"
                    @click="limpiarTodosFiltros" 
                    color="dark" 
                    type="border"
                    icon-pack="feather" 
                    icon="icon-x">
                    Limpiar Filtros
                </vs-button>
            </div>

            <!-- Badges de filtros activos -->
            <div v-if="filtrosActivos.length > 0" class="mt-4 flex flex-wrap gap-2">
                <span 
                    v-for="(filtro, index) in filtrosActivos" 
                    :key="index"
                    class="filter-badge"
                    @click="limpiarFiltro(filtro.tipo)">
                    {{ filtro.label }}
                    <i class="feather icon-x ml-2"></i>
                </span>
            </div>
        </vx-card>

        <!-- Skeleton Loader mientras carga -->
        <div v-if="loadingDocumentos" class="mb-4">
            <vx-card>
                <div class="skeleton-container">
                    <div class="skeleton-header mb-4"></div>
                    <div class="skeleton-line mb-3"></div>
                    <div class="skeleton-line mb-3"></div>
                    <div class="skeleton-line mb-3"></div>
                    <div class="skeleton-line-short"></div>
                </div>
            </vx-card>
        </div>

        <!-- Tabla de resultados -->
        <vs-table v-if="!loadingDocumentos" max-items="10" stripe search pagination :data="arrayDocumentosFacturacion">
            <template slot="header">
                <span class="table-badge badge-primary">
                    <i class="feather icon-list mr-1"></i>
                    Cantidad: <b>{{ arrayDocumentosFacturacion.length }}</b>
                </span>
                <span class="table-badge badge-warning ml-2">
                    <i class="feather icon-clock mr-1"></i>
                    Últimos: <b>100 registros</b>
                </span>
            </template>
            <template slot="thead">
                <vs-th style="width: 25%;">
                    <i class="feather icon-file-text mr-1"></i>
                    Documento
                </vs-th>
                <vs-th style="width: 18%;">
                    <i class="feather icon-users mr-1"></i>
                    Cliente / Empresa
                </vs-th>
                <vs-th style="width: 17%;">
                    <i class="feather icon-package mr-1"></i>
                    Bodega
                </vs-th>
                <vs-th style="width: 17%;">
                    <i class="feather icon-file-text mr-1"></i>
                    Notas de Crédito
                </vs-th>
                <vs-th style="width: 23%;">
                    <i class="feather icon-settings mr-1"></i>
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <!-- COLUMNA 1: DOCUMENTO -->
                    <vs-td>
                        <div class="cell-wrapper">
                            <!-- Número badge -->
                            <div class="mb-2">
                                <span class="inline-badge badge-primary">#{{ indextr + 1 }}</span>
                            </div>
                            
                            <!-- Código principal -->
                            <div class="mb-4">
                                <strong style="font-size: 16px; color: #1e293b;">{{data[indextr].ven_codigo}}</strong>
                            </div>
                            
                            <!-- Sección: Información -->
                            <div class="info-section">
                                <div class="info-item">
                                    <i class="feather icon-calendar" style="color: #3b82f6;"></i>
                                    <span class="label-text">Periodo:</span>
                                    <span class="value-text">{{ tr.periodoescolar }}</span>
                                </div>
                            </div>

                            <!-- Badge de estado de códigos -->
                            <div class="mt-2">
                                <span v-if="tr.cantidadCodigos == '0'" class="inline-badge badge-warning" style="font-size: 11px;">
                                    <i class="feather icon-alert-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                    Sin códigos
                                </span>
                                <span v-else class="inline-badge badge-success" style="font-size: 11px;">
                                    <i class="feather icon-check-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                    Con códigos
                                </span>
                            </div>
                        </div>
                    </vs-td>

                    <!-- COLUMNA 2: CLIENTE / EMPRESA -->
                    <vs-td>
                        <div class="cell-wrapper">
                            <div class="info-section">
                                <div class="info-item">
                                    <i class="feather icon-home" style="color: #3b82f6;"></i>
                                    <span class="value-text" style="font-weight: 600;">{{data[indextr].nombreInstitucion}}</span>
                                </div>
                                <div class="info-item">
                                    <i class="feather icon-briefcase" style="color: #64748b;"></i>
                                    <span class="label-small">{{ tr.empresa }}</span>
                                </div>
                            </div>
                        </div>
                    </vs-td>

                    <!-- COLUMNA 3: BODEGA -->
                    <vs-td>
                        <div class="cell-wrapper">
                            <!-- Sección: Doc Bodega -->
                            <div class="section-header">
                                <i class="feather icon-package" style="color: #f59e0b; margin-right: 4px;"></i>
                                <span>Doc Bodega</span>
                            </div>
                            <div class="info-section">
                                <div class="info-item" v-if="tr.codigo_devolucion">
                                    <span class="value-text" style="font-weight: 600; color: #f59e0b;">{{ tr.codigo_devolucion }}</span>
                                </div>
                                
                                <!-- Fechas -->
                                <div class="dates-group-compact">
                                    <div class="date-item" v-if="tr.fecha_creacionPadre">
                                        <i class="feather icon-arrow-up" style="color: #10b981; font-size: 12px;"></i>
                                        <span class="label-small">{{ tr.fecha_creacionPadre }}</span>
                                    </div>
                                    <div class="date-item" v-if="tr.fecha_finalizacionPadre">
                                        <i class="feather icon-check" style="color: #3b82f6; font-size: 12px;"></i>
                                        <span class="label-small">{{ tr.fecha_finalizacionPadre }}</span>
                                    </div>
                                </div>

                                <!-- Editor -->
                                <div class="info-item mt-2" v-if="tr.editor">
                                    <i class="feather icon-user" style="color: #64748b; font-size: 12px;"></i>
                                    <span class="label-small">{{ tr.editor }}</span>
                                </div>
                            </div>
                        </div>
                    </vs-td>

                    <!-- COLUMNA 4: NOTAS DE CRÉDITO -->
                    <vs-td>
                        <div class="cell-wrapper">
                            <!-- Solo plataforma (exento de NC) -->
                            <div v-if="tr.tieneFacturaPerseo != '1'" class="inline-badge badge-dark" style="font-size: 11px; width: fit-content;">
                                <i class="feather icon-info" style="font-size: 10px; margin-right: 3px;"></i>
                                Solo plataforma
                            </div>
                            <!-- Tiene factura Perseo pero hay pendientes -->
                            <div v-else-if="tr.tienePendientesNC == '1'" class="inline-badge badge-warning" style="font-size: 11px; width: fit-content;">
                                <i class="feather icon-alert-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                Pendiente
                            </div>
                            <!-- Tiene factura Perseo, sin pendientes, todo enviado -->
                            <div v-else-if="parseFloat(tr.totalCantidadNCEnviada) > 0" class="inline-badge badge-success" style="font-size: 11px; width: fit-content;">
                                <i class="feather icon-check-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                Completado
                            </div>
                            <!-- Tiene factura Perseo pero sin NC enviadas ni pendientes -->
                            <div v-else class="inline-badge badge-dark" style="font-size: 11px; width: fit-content;">
                                <i class="feather icon-minus-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                Sin NC
                            </div>

                            <!-- Progreso numérico (solo si tiene factura Perseo) -->
                            <div v-if="tr.tieneFacturaPerseo == '1' && parseFloat(tr.totalCantidadItems) > 0" class="mt-2 text-xs text-gray-600">
                                {{ tr.totalCantidadNCEnviada }} / {{ tr.totalCantidadItems }} enviados
                            </div>
                            <div v-else class="mt-2 text-xs text-gray-500 italic">
                                Exento de Nota de Crédito
                            </div>
                        </div>
                    </vs-td>

                    <!-- COLUMNA 5: ACCIONES -->
                    <vs-td>
                        <div class="cell-wrapper">
                            <div class="actions-container">
                                <!-- Botón Ver Documento (siempre visible) -->
                                <vs-button 
                                    color="primary" 
                                    @click="ObjectedSelected=tr;f_mostrarDetalles(tr);" 
                                    type="filled"
                                    icon-pack="feather"
                                    icon="icon-file"
                                    size="small"
                                    style="width: 100%;">
                                    Ver Documento
                                </vs-button>

                                <!-- Botón Notas de Crédito (solo si tiene factura Perseo) -->
                                <vs-button 
                                    v-if="tr.periodo_id>=29 && tr.tieneFacturaPerseo == '1'"
                                    color="success"
                                    type="border"
                                    @click="abrirGenerarNC(tr)"
                                    :disabled="tr.cantidadCodigos == '0' || loadingGenerarNC"
                                    icon-pack="feather"
                                    icon="icon-file-text"
                                    size="small"
                                    style="width: 100%;">
                                    {{ loadingGenerarNC ? 'Cargando...' : 'Notas de Crédito' }}
                                </vs-button>
                            </div>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--modales-->
        <!--modal para mostrar los detalles del documento facturación-->
        <vs-popup classContent="popup-example" title="Mostrar detalles" :active.sync="popupMostrarDetalles" fullscreen>
            <div v-if="popupMostrarDetalles">
                <DevolucionDocumentosFacturacionDetallesVue :ObjectSelected="ObjectedSelected" :arrayCodigos="arrayDetalles" :procesoNuevo="procesoNuevo" :arrayDetallesAgrupados="arrayDetallesAgrupados" />
            </div>
        </vs-popup>

        <!-- Modal Generación NCs Perseo -->
        <DevolucionGenerarNC
            ref="generarNC"
            :ObjectSelected="ObjectedSelected"
            :arrayDetallesAgrupados="arrayDetallesAgrupados"
        />
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex';
const DevolucionDocumentosFacturacionDetallesVue = () => import("./DevolucionDocumentosFacturacionDetalles.vue");
const DevolucionGenerarNC = () => import("./DevolucionGenerarNC.vue");
import PeriodoRepository from '@/repositories/PeriodoRepository';
import Generalmix from "../../../../../mixins/Generalmix";
export default {
    mixins: [Generalmix],
    components: {
        DevolucionDocumentosFacturacionDetallesVue,
        DevolucionGenerarNC,
    },
    data() {
        return {
            arrayDocumentosFacturacion: [],
            arrayDetalles: [],
            ObjectedSelected: {},
            popupMostrarDetalles: false,
            procesoNuevo: 0,
            arrayDetallesAgrupados: [],
            busqueda: '', // Campo de búsqueda
            soloPendientesNC: false, // Filtro solo pendientes NC
            periodoSeleccionado: null, // Filtro por periodo
            arrayPeriodos: [], // Listado de periodos
            loadingDocumentos: false, // Estado de carga
            loadingGenerarNC: false, // Loading para botón Generar NC
        }
    },

    computed: {
        ...mapState(['userRoot', 'groupFacturador', 'AdminBodega', 'groupBodega']),
        // Computed para filtros activos
        filtrosActivos() {
            let me = this;
            let filtros = [];
            if (me.busqueda && me.busqueda.trim() !== '') {
                filtros.push({ label: `Búsqueda: ${me.busqueda}`, tipo: 'busqueda' });
            }
            if (me.soloPendientesNC) {
                filtros.push({ label: 'Solo pendientes NC', tipo: 'soloPendientesNC' });
            }
            if (me.periodoSeleccionado) {
                filtros.push({ label: `Periodo: ${me.periodoSeleccionado.label}`, tipo: 'periodo' });
            }
            return filtros;
        }
    },
    mounted() {
        this.getPeriodos();
        this.getDocumentosFacturacion();
    },
    methods: {
        getPeriodos() {
            let me = this;
            
            me.arrayPeriodos = [];
            return PeriodoRepository.getPeriodos().then(res => {
                me.arrayPeriodos = res.data.map(periodo => ({
                        label: periodo.periodoescolar,
                        value: periodo.id
                    }));
            });
        },
        getDocumentosFacturacion() {
            let me = this;
            me.loadingDocumentos = true;
            
            // Construir URL con parámetros
            let url = 'metodosGetDevolucionFacturador?getListadoDocumentosFacturador=1';
            
            // Agregar búsqueda si existe
            if (me.busqueda && me.busqueda.trim() !== '') {
                url += `&busqueda=${encodeURIComponent(me.busqueda.trim())}`;
            }
            
            // Agregar periodo si existe
            if (me.periodoSeleccionado) {
                url += `&periodo_id=${me.periodoSeleccionado.value}`;
            }

            // Agregar filtro solo pendientes NC
            if (me.soloPendientesNC) {
                url += `&soloPendientesNC=1`;
            }
            
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    me.arrayDocumentosFacturacion = res.data;
                    if (me.arrayDocumentosFacturacion.length === 0) {
                        me.$vs.notify({
                            title: 'Sin resultados',
                            text: 'No se encontraron documentos con los filtros aplicados',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al obtener documentos de facturación',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                })
                .finally(function() {
                    me.loadingDocumentos = false;
                });
        },
        limpiarBusqueda() {
            let me = this;
            me.busqueda = '';
            me.getDocumentosFacturacion();
        },
        limpiarFiltro(tipo) {
            let me = this;
            if (tipo === 'busqueda') {
                me.busqueda = '';
            } else if (tipo === 'soloPendientesNC') {
                me.soloPendientesNC = false;
            } else if (tipo === 'periodo') {
                me.periodoSeleccionado = null;
            }
            me.getDocumentosFacturacion();
        },
        limpiarTodosFiltros() {
            let me = this;
            me.busqueda = '';
            me.soloPendientesNC = false;
            me.periodoSeleccionado = null;
            me.getDocumentosFacturacion();
        },
        abrirGenerarNC(tr) {
            let me = this;
            me.loadingGenerarNC = true;
            me.ObjectedSelected = tr;
            me.f_mostrarDetalles(tr, true);
        },
        f_mostrarDetalles(tr, abrirNC = false) {
            let me = this
            var url = `metodosGetDevolucionFacturador?getFacturadorDocumentoDetalles=1&id_documento=${me.ObjectedSelected.id}`
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    me.arrayDetalles = res.data;
                    if (me.arrayDetalles.length == 0) {
                        me.m_message("No se encontro libros en el documento seleccionado", "warning")
                        return;
                    }
                    me.arrayDetalles.forEach((obj) => {
                        obj.subtotal = (obj.cantidad * obj.precio).toFixed(2);
                        obj.total = (obj.subtotal * (1 - obj.descuento / 100)).toFixed(2);
                    });

                    // Detectar proceso nuevo según periodo_id del documento padre
                    const periodoNuevoModulo = 29;
                    const periodo_id = me.ObjectedSelected.periodo_id != null ? me.ObjectedSelected.periodo_id : 0;
                    me.procesoNuevo = periodoNuevoModulo <= periodo_id ? 1 : 0;

                    // Agrupar por documento_venta + factura_perseo si proceso nuevo
                    if (me.procesoNuevo === 1) {
                        let docsMap = new Map();
                        me.arrayDetalles.forEach(item => {
                            const key = `${item.documento_venta || 'Sin Documento'}||${item.factura_perseo || 'Sin Factura'}`;
                            if (!docsMap.has(key)) {
                                docsMap.set(key, {
                                    documento_venta: item.documento_venta || 'Sin Documento',
                                    factura_perseo:  item.factura_perseo  || 'Sin Factura',
                                    items: []
                                });
                            }
                            docsMap.get(key).items.push(item);
                        });
                        me.arrayDetallesAgrupados = Array.from(docsMap.values()).map(grupo => ({
                            documento_venta: grupo.documento_venta,
                            factura_perseo:  grupo.factura_perseo,
                            arrayCodigos:    grupo.items,
                            subtotal: grupo.items.reduce((t, i) => t + parseFloat(i.subtotal || 0), 0),
                            total:    grupo.items.reduce((t, i) => t + parseFloat(i.total    || 0), 0),
                            cantidad: grupo.items.reduce((t, i) => t + parseFloat(i.cantidad || 0), 0),
                        }));
                    } else {
                        me.arrayDetallesAgrupados = [];
                    }

                    if (abrirNC) {
                        // Abrir popup de generación de NCs
                        me.$nextTick(() => {
                            if (me.$refs.generarNC) {
                                me.$refs.generarNC.abrir();
                            }
                            me.loadingGenerarNC = false;
                        });
                    } else {
                        me.popupMostrarDetalles = true;
                        me.loadingGenerarNC = false;
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.loadingGenerarNC = false;
                })
        },
    }
}
</script>

<style scoped>
/* Skeleton Loader Styles */
.skeleton-container {
    padding: 1rem;
}

.skeleton-header {
    height: 24px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
}

.skeleton-line {
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
}

.skeleton-line-short {
    height: 16px;
    width: 60%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 4px;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Custom Badges */
.table-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
}

.badge-primary {
    background-color: rgba(var(--vs-primary), 0.15);
    color: rgba(var(--vs-primary), 1);
}

.badge-warning {
    background-color: rgba(255, 159, 67, 0.15);
    color: rgb(255, 159, 67);
}

.badge-success {
    background-color: rgba(40, 199, 111, 0.15);
    color: rgb(40, 199, 111);
}

.badge-dark {
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.55);
}

.inline-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.filter-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
    background-color: rgba(var(--vs-primary), 0.15);
    color: rgba(var(--vs-primary), 1);
    cursor: pointer;
    transition: all 0.3s;
}

.filter-badge:hover {
    background-color: rgba(var(--vs-primary), 0.25);
    transform: scale(1.05);
}

.filter-badge i {
    font-size: 14px;
}

/* Info Row Styles - Formato horizontal compacto */
.info-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 13px;
}

.info-row i {
    font-size: 14px;
    flex-shrink: 0;
}

.info-label {
    color: #718096;
    font-weight: 500;
}

.info-value {
    color: #2c3e50;
}

.info-row-compact {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
}

/* Mejoras visuales para las celdas */
.document-cell,
.client-cell,
.bodega-cell {
    line-height: 1.6;
    padding: 4px 0;
}

.document-cell strong,
.client-cell strong,
.bodega-cell strong {
    color: #2c3e50;
    font-weight: 600;
}

/* Dates Group - Fechas de bodega agrupadas */
.dates-group {
    background-color: #f7fafc;
    border-left: 3px solid #e2e8f0;
    padding: 6px 8px;
    margin: 8px 0;
    border-radius: 4px;
}

.dates-group-compact {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
}

.date-item {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
}

.date-item:last-child {
    margin-bottom: 0;
}

.date-item i {
    font-size: 12px;
}

/* Nuevos estilos organizados (igual que TabDevoluciones) */
.cell-wrapper {
    padding: 8px 0;
}

.section-header {
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.section-header-small {
    font-size: 10px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.info-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
}

.info-item i {
    font-size: 13px;
    flex-shrink: 0;
}

.label-text {
    color: #64748b;
    font-weight: 500;
    font-size: 12px;
}

.value-text {
    color: #1e293b;
    font-weight: 500;
    font-size: 13px;
}

.label-small {
    color: #64748b;
    font-size: 11px;
}

/* Contenedor de acciones */
.actions-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Badge para devoluciones solo en plataforma */
.plataforma-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: #dbeafe;
    color: #1e40af;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    border: 1px solid #93c5fd;
    line-height: 1.2;
    margin-bottom: 4px;
}

.plataforma-badge i {
    font-size: 12px;
    flex-shrink: 0;
}

.plataforma-badge span {
    flex: 1;
}

/* Color utilities */
.text-gray-600 {
    color: #718096;
}

.text-gray-500 {
    color: #a0aec0;
}

.text-primary {
    color: rgba(var(--vs-primary), 1);
}

.text-success {
    color: rgb(40, 199, 111);
}

.text-warning {
    color: rgb(255, 159, 67);
}

/* Responsive Grid */
@media (max-width: 768px) {
    .grid-cols-1.md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

/* Hover effect para elementos con vs-tooltip */
.date-item:hover,
.info-row-compact:hover,
.info-row:hover {
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    transition: background-color 0.2s;
}
</style>
