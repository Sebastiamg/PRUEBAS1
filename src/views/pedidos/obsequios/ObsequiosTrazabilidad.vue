<template>
    <div class="trazabilidad-container">
        <div class="trazabilidad-header">
            <div>
                <h4 class="seccion-title mb-1">Registro de Trazabilidad de Obsequios</h4>
                <p class="trazabilidad-subtitle">Seguimiento de tiempos entre cada fase del proceso de obsequios.</p>
            </div>
            <vs-button size="small" color="primary" type="border" icon-pack="feather" icon="icon-refresh-cw" @click="cargarDatos">
                Actualizar
            </vs-button>
        </div>

        <div class="alert-dias-habiles mb-4">
            <i class="fa-solid fa-circle-info alert-dias-habiles-icon"></i>
            <p class="alert-dias-habiles-text">
                <strong>Cálculo en días hábiles:</strong> los tiempos entre cada etapa (flechas en la tabla), el lead time total y los promedios excluyen <strong>sábados y domingos</strong>. Solo se cuentan días laborables de lunes a viernes.
            </p>
        </div>

        <!-- Gráfico de Tendencia Temporal -->
        <div class="grafico-tendencia-temporal mb-4">
            <div class="grafico-header-compacto">
                <h5 class="grafico-title-compacto">Análisis de Tiempos de Obsequios</h5>
                <span class="grafico-total">Últimos pedidos entregados ({{ ultimosEntregados.length }})</span>
            </div>
            <div v-if="ultimosEntregados.length === 0" class="tendencia-vacia">
                No hay pedidos entregados con lead time calculable para mostrar en el gráfico.
            </div>
            <template v-else>
                <div class="tendencia-visual">
                    <div class="tendencia-eje-y">
                        <span class="eje-label">{{ maxDiasEje }}d</span>
                        <span class="eje-label">{{ Math.round(maxDiasEje * 0.75) }}d</span>
                        <span class="eje-label">15d</span>
                        <span class="eje-label">7d</span>
                        <span class="eje-label">0d</span>
                    </div>
                    <div class="tendencia-grafico">
                        <div class="tendencia-linea tendencia-linea-critica"></div>
                        <div class="tendencia-linea tendencia-linea-normal"></div>
                        <div class="tendencia-puntos">
                            <div
                                v-for="(item, index) in ultimosEntregados"
                                :key="'punto-' + item.id"
                                :class="['tendencia-punto', getTendenciaClase(item.leadTimeDias)]"
                                :style="{ left: calcularPosicionX(index, ultimosEntregados.length) + '%', bottom: calcularPosicionY(item.leadTimeDias) + '%' }"
                                @mouseenter="mostrarTooltipGrafico($event, item)"
                                @mouseleave="ocultarTooltipGrafico"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="tendencia-leyenda">
                    <div class="leyenda-item-tendencia">
                        <span class="leyenda-linea leyenda-linea-critica-mini"></span>
                        <span>Límite crítico (15 días hábiles)</span>
                    </div>
                    <div class="leyenda-item-tendencia">
                        <span class="leyenda-linea leyenda-linea-normal-mini"></span>
                        <span>Límite óptimo (7 días hábiles)</span>
                    </div>
                    <div class="leyenda-item-tendencia">
                        <span class="leyenda-punto leyenda-punto-verde"></span>
                        <span>Rápido ≤ 7d</span>
                    </div>
                    <div class="leyenda-item-tendencia">
                        <span class="leyenda-punto leyenda-punto-amarillo"></span>
                        <span>Normal 8-15d</span>
                    </div>
                    <div class="leyenda-item-tendencia">
                        <span class="leyenda-punto leyenda-punto-rojo"></span>
                        <span>Lento > 15d</span>
                    </div>
                </div>
            </template>
        </div>

        <div
            v-if="tooltipGrafico.visible && tooltipGrafico.item"
            class="punto-tooltip-flotante"
            :style="tooltipGrafico.estilo"
        >
            <span class="punto-tooltip-id">#{{ tooltipGrafico.item.id }}</span>
            <span class="punto-tooltip-institucion">{{ tooltipGrafico.item.nombreInstitucion }}</span>
            <span class="punto-tooltip-dias">{{ tooltipGrafico.item.leadTimeDias }} días háb.</span>
        </div>

        <!-- Toolbar -->
        <div class="trazabilidad-toolbar mb-3">
            <div class="trazabilidad-busqueda">
                <vs-input
                    v-model="busquedaTrazabilidad"
                    icon-pack="feather"
                    icon="icon-search"
                    class="busqueda-trazabilidad-input"
                    placeholder="Buscar pedido, institución o asesor"
                    size="small"
                />
            </div>
        </div>

        <!-- Filtros encima de la tabla -->
        <div class="filtros-tabla-wrap mb-3">
            <div class="filtros-tabla-header">
                <div class="filtros-tabla-header-izq">
                    <h5 class="filtros-tabla-title">Filtrar tabla</h5>
                    <div class="filtro-tipo-switch">
                        <button
                            type="button"
                            :class="['filtro-tipo-btn', tipoFiltroTabla === 'estado' ? 'filtro-tipo-btn-activo' : '']"
                            @click="cambiarTipoFiltroTabla('estado')"
                        >
                            <i class="fa-solid fa-layer-group"></i> Por estado
                        </button>
                        <button
                            type="button"
                            :class="['filtro-tipo-btn', tipoFiltroTabla === 'rendimiento' ? 'filtro-tipo-btn-activo' : '']"
                            @click="cambiarTipoFiltroTabla('rendimiento')"
                        >
                            <i class="fa-solid fa-gauge-high"></i> Por rendimiento
                        </button>
                    </div>
                </div>
                <span v-if="tipoFiltroTabla === 'estado'" class="grafico-total">{{ resumenEstados.total }}</span>
                <div v-else class="promedio-inline">
                    <i class="fa-solid fa-chart-line"></i>
                    Promedio general: <strong>{{ metricas.promedio }}</strong> días hábiles (entregados)
                </div>
            </div>

            <template v-if="tipoFiltroTabla === 'estado'">
                <p class="flujo-nota mb-2">Clic en un estado para filtrar. Cada pedido cuenta <strong>solo en su estado actual</strong>.</p>
                <div class="estados-grid estados-grid-filtro">
                    <div
                        :class="['flujo-etapa', 'flujo-etapa-click', filtroEstado === null ? 'flujo-etapa-seleccionada' : '']"
                        @click="filtroEstado = null"
                    >
                        <div class="flujo-icono flujo-icono-todos"><i class="fa-solid fa-list"></i></div>
                        <div class="flujo-info">
                            <span class="flujo-label">Todos</span>
                            <span class="flujo-count">{{ resumenEstados.total }}</span>
                        </div>
                    </div>
                    <div
                        v-for="etapa in resumenEstados.etapas"
                        :key="'estado-' + etapa.estado"
                        :class="['flujo-etapa', 'flujo-etapa-click', etapa.count > 0 ? 'flujo-etapa-activa' : '', filtroEstado === etapa.estado ? 'flujo-etapa-seleccionada' : '']"
                        @click="toggleFiltroEstado(etapa.estado)"
                    >
                        <div :class="['flujo-icono', etapa.claseIcono]"><i :class="etapa.icono"></i></div>
                        <div class="flujo-info">
                            <span class="flujo-label">{{ etapa.label }}</span>
                            <span class="flujo-count">{{ etapa.count }}</span>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <p class="flujo-nota mb-2">Clic en un nivel de rendimiento según el lead time total en días hábiles.</p>
                <div class="metricas-rendimiento metricas-tabla">
                    <div
                        :class="['metrica-card', 'metrica-todos', 'metrica-card-filtro', filtroColorTrazabilidad === 'todos' ? 'metrica-card-activo' : '']"
                        @click="filtroColorTrazabilidad = 'todos'"
                    >
                        <div class="metrica-icon metrica-icon-todos"><i class="fa-solid fa-list"></i></div>
                        <div class="metrica-content">
                            <span class="metrica-label">Todos</span>
                            <span class="metrica-value">{{ resumenEstados.total }}</span>
                            <span class="metrica-desc"></span>
                        </div>
                    </div>
                    <div
                        :class="['metrica-card', 'metrica-excelente', 'metrica-card-filtro', filtroColorTrazabilidad === 'verde' ? 'metrica-card-activo' : '']"
                        @click="toggleFiltroRendimiento('verde')"
                    >
                        <div class="metrica-icon"><i class="fa-solid fa-bolt"></i></div>
                        <div class="metrica-content">
                            <span class="metrica-label">Verdes · Rápido</span>
                            <span class="metrica-value">{{ metricas.rapidos }}</span>
                            <span class="metrica-desc">≤ 7 días hábiles</span>
                        </div>
                    </div>
                    <div
                        :class="['metrica-card', 'metrica-aceptable', 'metrica-card-filtro', filtroColorTrazabilidad === 'amarillo' ? 'metrica-card-activo' : '']"
                        @click="toggleFiltroRendimiento('amarillo')"
                    >
                        <div class="metrica-icon"><i class="fa-solid fa-clock"></i></div>
                        <div class="metrica-content">
                            <span class="metrica-label">Amarillos · Normal</span>
                            <span class="metrica-value">{{ metricas.normales }}</span>
                            <span class="metrica-desc">8-15 días hábiles</span>
                        </div>
                    </div>
                    <div
                        :class="['metrica-card', 'metrica-lento', 'metrica-card-filtro', filtroColorTrazabilidad === 'rojo' ? 'metrica-card-activo' : '']"
                        @click="toggleFiltroRendimiento('rojo')"
                    >
                        <div class="metrica-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div class="metrica-content">
                            <span class="metrica-label">Rojos · Lento</span>
                            <span class="metrica-value">{{ metricas.lentos }}</span>
                            <span class="metrica-desc">> 15 días hábiles</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Tabla -->
        <div class="tabla-trazabilidad-wrap">
            <table class="tabla-trazabilidad">
                <thead>
                    <tr>
                        <th>Pedido</th>
                        <th>Institución / Asesor</th>
                        <th>Estado</th>
                        <th>Fechas del proceso</th>
                        <th>Lead time total (hábiles)</th>
                        <th>Rendimiento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="itemsFiltrados.length === 0">
                        <td colspan="6" class="tabla-vacia">No hay pedidos para mostrar en trazabilidad</td>
                    </tr>
                    <tr
                        v-for="item in itemsPaginados"
                        :key="'obs-t-' + item.id"
                        :class="['trazabilidad-row', getClaseRendimientoFila(item)]"
                    >
                        <td>
                            <strong>#{{ item.id }}</strong>
                            <div class="text-muted">{{ item.periodo }}</div>
                        </td>
                        <td>
                            <div><strong>{{ item.nombreInstitucion }}</strong></div>
                            <div>{{ item.ciudad }}</div>
                            <div class="text-muted">{{ item.asesor }}</div>
                        </td>
                        <td>
                            <vs-chip :color="getColorEstado(item.estadoCodigo)" size="small">{{ item.estadoTexto }}</vs-chip>
                        </td>
                        <td>
                            <div class="fechas-consolidadas">
                                <div
                                    v-for="(paso, idx) in item.transicionesFases"
                                    :key="'paso-' + item.id + '-' + paso.key"
                                    class="fecha-paso-grupo"
                                >
                                    <div
                                        :class="['fecha-item', paso.pendiente ? 'fecha-item-pendiente' : '', paso.error ? 'fecha-item-error' : '']"
                                    >
                                        <span class="fecha-label">{{ paso.label }}:</span>
                                        <span class="fecha-valor">{{ paso.fecha }}</span>
                                    </div>
                                    <div
                                        v-if="idx < item.transicionesFases.length - 1"
                                        class="fecha-transicion"
                                    >
                                        <span class="fecha-transicion-flecha"><i class="fa-solid fa-arrow-down"></i></span>
                                        <span
                                            v-if="paso.diasHastaSiguiente !== null"
                                            :class="['fecha-transicion-dias', getClaseLeadTime(paso.diasHastaSiguiente)]"
                                            :title="paso.label + ' → ' + paso.siguienteLabel"
                                        >
                                            {{ paso.diasHastaSiguiente }} días hábiles
                                        </span>
                                        <span v-else class="fecha-transicion-pendiente">Pendiente</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span v-if="item.leadTimeDias !== null" :class="['lead-time-badge', getClaseLeadTime(item.leadTimeDias)]">
                                {{ item.leadTimeDias }} días hábiles
                            </span>
                            <span v-else class="text-muted">En proceso</span>
                        </td>
                        <td>
                            <span v-if="item.leadTimeDias !== null" :class="['rendimiento-badge', getClaseRendimiento(item.leadTimeDias)]">
                                {{ getTextoRendimiento(item.leadTimeDias) }}
                            </span>
                            <span v-else class="text-muted">-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="itemsFiltrados.length > itemsPorPagina" class="tabla-trazabilidad-paginacion">
                <span class="tabla-paginacion-info">
                    Mostrando {{ rangoPaginacion.desde }}-{{ rangoPaginacion.hasta }} de {{ itemsFiltrados.length }} pedidos
                </span>
                <vs-pagination
                    v-model="paginaActual"
                    :total="totalPaginas"
                    :max="7"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ObsequiosTrazabilidad',
    props: {
        periodo_id: {
            type: [Number, String],
            default: 0
        },
        obsequiosData: {
            type: Array,
            default: null
        },
        userAdmin: {
            type: Boolean,
            default: false
        },
        userAsesor: {
            type: Boolean,
            default: false
        },
        usuario: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            obsequios: [],
            busquedaTrazabilidad: '',
            filtroColorTrazabilidad: 'todos',
            filtroEstado: null,
            tipoFiltroTabla: 'rendimiento',
            tooltipGrafico: {
                visible: false,
                item: null,
                estilo: {}
            },
            paginaActual: 1,
            itemsPorPagina: 10
        };
    },
    computed: {
        obsequiosOperativos() {
            if (!Array.isArray(this.obsequios)) return [];
            return this.obsequios.filter((o) => parseInt(o.estado, 10) !== 2);
        },
        trazabilidadItems() {
            return this.obsequiosOperativos.map((obs) => {
                return {
                    id: obs.id,
                    raw: obs,
                    asesor: obs.asesor || '-',
                    nombreInstitucion: obs.nombreInstitucion || '-',
                    ciudad: obs.ciudad || '-',
                    periodo: obs.periodo || '-',
                    estadoCodigo: parseInt(obs.estado, 10),
                    estadoTexto: this.obtenerTextoEstado(obs.estado),
                    transicionesFases: this.construirTransicionesFases(obs),
                    leadTimeDias: this.calcularLeadTime(obs)
                };
            }).sort((a, b) => b.id - a.id);
        },
        itemsFiltrados() {
            const texto = this.busquedaTrazabilidad ? this.busquedaTrazabilidad.trim().toLowerCase() : '';

            return this.trazabilidadItems.filter((item) => {
                if (this.tipoFiltroTabla === 'estado') {
                    if (this.filtroEstado !== null && item.estadoCodigo !== this.filtroEstado) return false;
                } else if (!this.cumpleFiltroColor(item)) {
                    return false;
                }

                if (!texto) return true;

                const id = String(item.id).toLowerCase();
                const institucion = String(item.nombreInstitucion).toLowerCase();
                const asesor = String(item.asesor).toLowerCase();
                const estado = String(item.estadoTexto).toLowerCase();

                return id.indexOf(texto) > -1
                    || institucion.indexOf(texto) > -1
                    || asesor.indexOf(texto) > -1
                    || estado.indexOf(texto) > -1;
            });
        },
        totalPaginas() {
            return Math.max(1, Math.ceil(this.itemsFiltrados.length / this.itemsPorPagina));
        },
        itemsPaginados() {
            if (this.itemsFiltrados.length <= this.itemsPorPagina) {
                return this.itemsFiltrados;
            }
            const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
            return this.itemsFiltrados.slice(inicio, inicio + this.itemsPorPagina);
        },
        rangoPaginacion() {
            if (this.itemsFiltrados.length === 0) {
                return { desde: 0, hasta: 0 };
            }
            const desde = ((this.paginaActual - 1) * this.itemsPorPagina) + 1;
            const hasta = Math.min(this.paginaActual * this.itemsPorPagina, this.itemsFiltrados.length);
            return { desde, hasta };
        },
        metricas() {
            let rapidos = 0;
            let normales = 0;
            let lentos = 0;
            let totalDias = 0;
            let contador = 0;

            this.obsequiosOperativos.forEach((obs) => {
                if (parseInt(obs.estado, 10) !== 6) return;
                const dias = this.calcularLeadTime(obs);
                if (dias === null) return;

                totalDias += dias;
                contador += 1;

                if (dias <= 7) rapidos += 1;
                else if (dias <= 15) normales += 1;
                else lentos += 1;
            });

            return {
                rapidos,
                normales,
                lentos,
                promedio: contador > 0 ? (totalDias / contador).toFixed(1) : '0.0',
                total: contador,
                totalEntregados: contador
            };
        },
        resumenEstados() {
            const definicionEtapas = [
                { estado: 0, label: 'Pedido incompleto', icono: 'fa-solid fa-file', claseIcono: 'flujo-icono-incompleto' },
                { estado: 1, label: 'Pendiente', icono: 'fa-solid fa-clock', claseIcono: 'flujo-icono-pendiente' },
                { estado: 3, label: 'Aprobado facturación', icono: 'fa-solid fa-file-invoice-dollar', claseIcono: 'flujo-icono-proceso' },
                { estado: 4, label: 'Cotización subida', icono: 'fa-solid fa-camera', claseIcono: 'flujo-icono-cotizacion' },
                { estado: 5, label: 'Autorizado gerencia', icono: 'fa-solid fa-check-double', claseIcono: 'flujo-icono-gerencia' },
                { estado: 6, label: 'Entregado', icono: 'fa-solid fa-gift', claseIcono: 'flujo-icono-entrega' }
            ];

            const conteos = {};
            definicionEtapas.forEach((etapa) => {
                conteos[etapa.estado] = 0;
            });

            this.obsequiosOperativos.forEach((obs) => {
                const estado = parseInt(obs.estado, 10);
                if (Object.prototype.hasOwnProperty.call(conteos, estado)) {
                    conteos[estado] += 1;
                }
            });

            const etapas = definicionEtapas.map((etapa) => ({
                ...etapa,
                count: conteos[etapa.estado]
            }));

            return {
                total: this.obsequiosOperativos.length,
                etapas
            };
        },
        ultimosEntregados() {
            return this.trazabilidadItems
                .filter((item) => typeof item.leadTimeDias === 'number' && this.cumpleFiltroColor(item))
                .slice(0, 30)
                .reverse();
        },
        maxDiasEje() {
            let maxDias = 30;
            this.ultimosEntregados.forEach((item) => {
                if (typeof item.leadTimeDias === 'number' && item.leadTimeDias > maxDias) {
                    maxDias = item.leadTimeDias;
                }
            });
            return maxDias;
        }
    },
    mounted() {
        this.cargarDatos();
    },
    watch: {
        obsequiosData: {
            handler() {
                if (this.obsequiosData && Array.isArray(this.obsequiosData)) {
                    this.obsequios = this.normalizarObsequios(this.obsequiosData);
                }
            },
            deep: true
        },
        periodo_id() {
            if (!this.obsequiosData) {
                this.cargarDatos();
            }
        },
        busquedaTrazabilidad() {
            this.paginaActual = 1;
        },
        filtroEstado() {
            this.paginaActual = 1;
        },
        filtroColorTrazabilidad() {
            this.paginaActual = 1;
        },
        tipoFiltroTabla() {
            this.paginaActual = 1;
        },
        itemsFiltrados() {
            if (this.paginaActual > this.totalPaginas) {
                this.paginaActual = this.totalPaginas;
            }
        }
    },
    methods: {
        normalizarObsequios(datos) {
            return (datos || []).map((item) => {
                const copia = { ...item };
                if (!copia.fecha_creacion_efectiva) {
                    copia.fecha_creacion_efectiva = copia.fecha_creacion_pedido || copia.created_at;
                }
                return copia;
            });
        },
        cargarDatos() {
            if (this.obsequiosData && Array.isArray(this.obsequiosData)) {
                this.obsequios = this.normalizarObsequios(this.obsequiosData);
                return;
            }

            if (!this.periodo_id) {
                this.obsequios = [];
                return;
            }

            const me = this;
            me.$vs.loading();
            me.$http.get(me.$server_url + 'obsequio?trazabilidadObsequios=yes&periodo_id=' + me.periodo_id)
                .then(function(res) {
                    let datos = res.data || [];
                    if (me.userAsesor && me.usuario && me.usuario.idusuario) {
                        datos = datos.filter((p) => p.asesor_id == me.usuario.idusuario);
                    } else if (!me.userAdmin && me.usuario && me.usuario.idusuario) {
                        datos = datos.filter((p) => p.asesor_id == me.usuario.idusuario);
                    }
                    me.obsequios = me.normalizarObsequios(datos);
                    me.$vs.loading.close();
                })
                .catch(function(error) {
                    console.log(error);
                    me.obsequios = [];
                    me.$vs.loading.close();
                });
        },
        obtenerFechaFase(obs, fase) {
            if (!obs) return '';
            if (fase === 'creado') return obs.fecha_creacion_efectiva || obs.fecha_creacion_pedido || obs.created_at;
            if (fase === 'facturacion') return obs.fecha_facturador_aprueba;
            if (fase === 'cotizacion') return obs.fecha_administrador_sube_cotizacion;
            if (fase === 'gerencia') return obs.fecha_gerencia_aprueba;
            if (fase === 'entrega') return obs.fecha_asesor_sube_evidencia_entrega;
            return '';
        },
        construirTransicionesFases(obs) {
            const definicion = [
                { key: 'creado', label: 'Solicitud' },
                { key: 'facturacion', label: 'Facturación' },
                { key: 'cotizacion', label: 'Cotización' },
                { key: 'gerencia', label: 'Gerencia' },
                { key: 'entrega', label: 'Entrega' }
            ];

            const pasos = definicion.map((def) => {
                const raw = this.obtenerFechaFase(obs, def.key);
                const fecha = this.formatearFechaHora(raw);
                return {
                    key: def.key,
                    label: def.label,
                    fecha,
                    raw,
                    pendiente: !raw || fecha === '-',
                    error: def.key === 'creado' && (!raw || fecha === '-')
                };
            });

            for (let i = 0; i < pasos.length - 1; i += 1) {
                const actual = pasos[i];
                const siguiente = pasos[i + 1];
                if (!actual.raw || !siguiente.raw) {
                    actual.diasHastaSiguiente = null;
                    actual.siguienteLabel = siguiente.label;
                } else {
                    actual.diasHastaSiguiente = this.calcularDiasEntreFechas(actual.raw, siguiente.raw);
                    actual.siguienteLabel = siguiente.label;
                }
            }

            return pasos;
        },
        calcularLeadTime(obs) {
            const inicio = this.obtenerFechaFase(obs, 'creado');
            const fin = this.obtenerFechaFase(obs, 'entrega');
            return this.calcularDiasEntreFechas(inicio, fin);
        },
        extraerFecha(texto) {
            if (!texto || texto === '-') return '';
            const valor = String(texto).trim();
            if (valor.length >= 10) return valor.substring(0, 10);
            return valor;
        },
        formatearFecha(texto) {
            const fecha = this.extraerFecha(texto);
            return fecha ? fecha : '-';
        },
        formatearFechaHora(texto) {
            if (!texto || texto === '-') return '-';
            const valor = String(texto).trim();
            const match = valor.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}):(\d{2})/);
            if (match) {
                return match[1] + ' ' + match[2] + ':' + match[3];
            }
            return this.formatearFecha(valor);
        },
        calcularDiasEntreFechas(fechaInicioTexto, fechaFinTexto) {
            const inicioTexto = this.extraerFecha(fechaInicioTexto);
            const finTexto = this.extraerFecha(fechaFinTexto);
            if (!inicioTexto || !finTexto) return null;

            const inicio = new Date(inicioTexto + 'T00:00:00');
            const fin = new Date(finTexto + 'T00:00:00');
            if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return null;

            if (fin < inicio) return 0;

            let diasHabiles = 0;
            const cursor = new Date(inicio);

            while (cursor < fin) {
                cursor.setDate(cursor.getDate() + 1);
                const diaSemana = cursor.getDay();
                if (diaSemana !== 0 && diaSemana !== 6) {
                    diasHabiles += 1;
                }
            }

            return diasHabiles;
        },
        obtenerTextoEstado(estado) {
            const mapa = {
                0: 'Pedido incompleto',
                1: 'Pendiente',
                2: 'Rechazado',
                3: 'Aprobado facturación',
                4: 'Cotización subida',
                5: 'Autorizado gerencia',
                6: 'Entregado'
            };
            return mapa[parseInt(estado, 10)] || 'Desconocido';
        },
        getColorEstado(estado) {
            if (estado === 0 || estado === 2) return 'danger';
            if (estado === 1) return 'warning';
            if (estado === 3) return 'primary';
            if (estado === 4) return 'dark';
            if (estado === 5 || estado === 6) return 'success';
            return 'dark';
        },
        getNivelRendimiento(dias) {
            if (dias == null || isNaN(dias)) return 'sin-dato';
            if (dias <= 7) return 'verde';
            if (dias <= 15) return 'amarillo';
            return 'rojo';
        },
        getClaseRendimientoFila(item) {
            if (!item) return 'trazabilidad-row-sin-dato';
            const nivel = this.getNivelRendimiento(item.leadTimeDias);
            if (nivel === 'verde') return 'trazabilidad-row-verde';
            if (nivel === 'amarillo') return 'trazabilidad-row-amarillo';
            if (nivel === 'rojo') return 'trazabilidad-row-rojo';
            return 'trazabilidad-row-sin-dato';
        },
        getClaseLeadTime(dias) {
            if (dias <= 7) return 'lead-time-excelente';
            if (dias <= 15) return 'lead-time-aceptable';
            return 'lead-time-lento';
        },
        getClaseRendimiento(dias) {
            if (dias <= 7) return 'rendimiento-excelente';
            if (dias <= 15) return 'rendimiento-aceptable';
            return 'rendimiento-lento';
        },
        getTextoRendimiento(dias) {
            if (dias <= 7) return 'Rápido';
            if (dias <= 15) return 'Normal';
            return 'Lento';
        },
        cumpleFiltroColor(item) {
            if (!this.filtroColorTrazabilidad || this.filtroColorTrazabilidad === 'todos') return true;
            const nivel = this.getNivelRendimiento(item.leadTimeDias);
            if (nivel === 'sin-dato') return false;
            if (this.filtroColorTrazabilidad === 'verde') return nivel === 'verde';
            if (this.filtroColorTrazabilidad === 'amarillo') return nivel === 'amarillo';
            if (this.filtroColorTrazabilidad === 'rojo') return nivel === 'rojo';
            return true;
        },
        toggleFiltroRendimiento(filtro) {
            this.filtroColorTrazabilidad = this.filtroColorTrazabilidad === filtro ? 'todos' : filtro;
        },
        toggleFiltroEstado(estado) {
            this.filtroEstado = this.filtroEstado === estado ? null : estado;
        },
        cambiarTipoFiltroTabla(tipo) {
            if (this.tipoFiltroTabla === tipo) return;
            this.tipoFiltroTabla = tipo;
            this.filtroEstado = null;
            this.filtroColorTrazabilidad = 'todos';
        },
        calcularPosicionX(index, total) {
            if (total <= 1) return 50;
            return (index / (total - 1)) * 100;
        },
        calcularPosicionY(dias) {
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                if (!match) return 0;
                dias = parseInt(match[0], 10);
            }

            const maxDias = this.maxDiasEje > 0 ? this.maxDiasEje : 30;
            const porcentaje = Math.min((dias / maxDias) * 100, 100);
            if (porcentaje < 3) return 3;
            if (porcentaje > 95) return 95;
            return porcentaje;
        },
        getTendenciaClase(dias) {
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                if (!match) return 'punto-neutral';
                dias = parseInt(match[0], 10);
            }
            if (dias <= 7) return 'punto-excelente';
            if (dias <= 15) return 'punto-aceptable';
            return 'punto-lento';
        },
        mostrarTooltipGrafico(event, item) {
            const punto = event.currentTarget.getBoundingClientRect();
            const anchoTooltip = 260;
            const altoTooltip = 88;
            const margen = 12;

            let left = punto.left + (punto.width / 2) - (anchoTooltip / 2);
            left = Math.max(margen, Math.min(left, window.innerWidth - anchoTooltip - margen));

            let top = punto.top - altoTooltip - margen;
            if (top < margen) {
                top = punto.bottom + margen;
            }

            this.tooltipGrafico = {
                visible: true,
                item,
                estilo: {
                    left: left + 'px',
                    top: top + 'px',
                    width: anchoTooltip + 'px'
                }
            };
        },
        ocultarTooltipGrafico() {
            this.tooltipGrafico.visible = false;
            this.tooltipGrafico.item = null;
        }
    }
};
</script>

<style scoped>
.trazabilidad-container { min-height: 400px; max-width: 100%; overflow-x: hidden; }
.trazabilidad-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 12px; flex-wrap: wrap; }
.seccion-title { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; }
.trazabilidad-subtitle { font-size: 13px; color: #64748b; margin: 0; }
.alert-dias-habiles { display: flex; align-items: flex-start; gap: 10px; width: 100%; max-width: 100%; box-sizing: border-box; padding: 12px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; color: #1e3a8a; overflow-wrap: anywhere; word-wrap: break-word; }
.alert-dias-habiles-icon { flex-shrink: 0; margin-top: 2px; font-size: 16px; color: #046AE7; line-height: 1.4; }
.alert-dias-habiles-text { margin: 0; flex: 1; min-width: 0; font-size: 13px; line-height: 1.5; }
.text-muted { color: #94a3b8; font-size: 11px; }

.metricas-rendimiento { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.metrica-card { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 10px; border: 2px solid; background: #fff; }
.metrica-card-filtro { cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
.metrica-card-filtro:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
.metrica-card-activo { box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.25); transform: translateY(-2px); }
.metrica-excelente.metrica-card-activo { border-color: #059669; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3); }
.metrica-aceptable.metrica-card-activo { border-color: #d97706; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3); }
.metrica-lento.metrica-card-activo { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); }
.metrica-card-info { cursor: default; }
.metrica-todos { border-color: #cbd5e1; background: #f8fafc; }
.metrica-icon-todos { background: #64748b; }
.metrica-todos.metrica-card-activo { border-color: #046AE7; box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.25); }

.filtros-tabla-wrap { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
.filtros-tabla-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.filtros-tabla-header-izq { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filtros-tabla-title { font-size: 14px; font-weight: 700; color: #334155; margin: 0; }
.filtro-tipo-switch { display: inline-flex; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 3px; gap: 2px; }
.filtro-tipo-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: none; border-radius: 6px; background: transparent; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease; white-space: nowrap; }
.filtro-tipo-btn:hover { color: #334155; }
.filtro-tipo-btn-activo { background: #fff; color: #046AE7; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
.promedio-inline { font-size: 12px; color: #64748b; font-weight: 600; }
.promedio-inline i { margin-right: 4px; color: #3b82f6; }
.promedio-inline strong { color: #1e40af; }
.metricas-tabla { margin-bottom: 0; }
.metricas-tabla .metrica-card { padding: 12px; }
.metricas-tabla .metrica-value { font-size: 24px; }
.metricas-tabla .metrica-icon { width: 40px; height: 40px; font-size: 16px; }

.filtro-activo-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 13px; color: #1e40af; }
.metrica-excelente { border-color: #86efac; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); }
.metrica-aceptable { border-color: #fde68a; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }
.metrica-lento { border-color: #fca5a5; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }
.metrica-promedio { border-color: #93c5fd; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
.metrica-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 20px; color: #fff; }
.metrica-excelente .metrica-icon { background: #10b981; }
.metrica-aceptable .metrica-icon { background: #f59e0b; }
.metrica-lento .metrica-icon { background: #ef4444; }
.metrica-promedio .metrica-icon { background: #3b82f6; }
.metrica-content { display: flex; flex-direction: column; gap: 2px; }
.metrica-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; }
.metrica-value { font-size: 28px; font-weight: 800; line-height: 1; color: #1e293b; }
.metrica-desc { font-size: 10px; color: #64748b; font-weight: 600; }

.grafico-flujo-proceso { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
.flujo-nota { font-size: 12px; color: #64748b; margin: 0 0 12px 0; }
.flujo-nota code { background: #f1f5f9; padding: 1px 4px; border-radius: 4px; font-size: 11px; }
.estados-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; }
.flujo-etapa { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; min-width: 0; }
.flujo-etapa-click { cursor: pointer; transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease; }
.flujo-etapa-click:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
.flujo-etapa-activa { border-color: #93c5fd; background: #eff6ff; }
.flujo-etapa-seleccionada { border-color: #046AE7 !important; box-shadow: 0 0 0 2px rgba(4, 106, 231, 0.25); background: #eff6ff !important; }
.flujo-icono-todos { background: #64748b; }
.estados-grid-filtro { margin-bottom: 0; }
.grafico-header-compacto { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
.grafico-title-compacto { font-size: 14px; font-weight: 700; color: #334155; margin: 0; }
.grafico-total { font-size: 11px; color: #64748b; font-weight: 600; }
.flujo-icono { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; flex-shrink: 0; }
.flujo-icono-incompleto { background: #94a3b8; }
.flujo-icono-pendiente { background: #6366f1; }
.flujo-icono-creado { background: #6366f1; }
.flujo-icono-proceso { background: #3b82f6; }
.flujo-icono-cotizacion { background: #8b5cf6; }
.flujo-icono-gerencia { background: #10b981; }
.flujo-icono-entrega { background: #f59e0b; }
.flujo-info { display: flex; flex-direction: column; min-width: 0; }
.flujo-label { font-size: 11px; color: #334155; font-weight: 700; line-height: 1.2; }
.flujo-count { font-size: 20px; font-weight: 800; color: #1e293b; line-height: 1.1; }

.grafico-tendencia-temporal { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; overflow: visible; }
.tendencia-vacia { text-align: center; color: #94a3b8; font-size: 13px; padding: 32px 16px; background: #f8fafc; border-radius: 6px; margin-top: 12px; }
.tendencia-visual { display: flex; gap: 12px; margin-top: 12px; overflow: visible; }
.tendencia-eje-y { display: flex; flex-direction: column; justify-content: space-between; padding: 8px 0; min-height: 230px; }
.eje-label { font-size: 10px; font-weight: 600; color: #94a3b8; }
.tendencia-grafico { flex: 1; height: 230px; background: linear-gradient(to bottom, #f8fafc 0%, #fff 100%); border: 1px solid #e2e8f0; border-radius: 6px; position: relative; overflow: visible; }
.tendencia-linea { position: absolute; left: 0; right: 0; height: 2px; border-top: 2px dashed; }
.tendencia-linea-critica { bottom: 50%; border-color: #EA5455; opacity: 0.4; }
.tendencia-linea-normal { bottom: 23.3%; border-color: #FF9F43; opacity: 0.4; }
.tendencia-puntos { position: relative; width: 100%; height: 100%; overflow: visible; }
.tendencia-punto { position: absolute; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; transform: translate(-50%, 50%); transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.15); z-index: 1; }
.tendencia-punto:hover { transform: translate(-50%, 50%) scale(1.4); z-index: 20; }
.punto-excelente { background: #28C76F; }
.punto-aceptable { background: #FF9F43; }
.punto-lento { background: #EA5455; }
.punto-neutral { background: #94a3b8; }
.punto-tooltip-flotante { position: fixed; z-index: 99999; background: #1e293b; color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; text-align: left; line-height: 1.35; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25); pointer-events: none; }
.punto-tooltip-id { display: block; font-size: 12px; font-weight: 700; margin-bottom: 4px; }
.punto-tooltip-institucion { display: block; font-size: 11px; font-weight: 500; line-height: 1.4; color: #e2e8f0; word-wrap: break-word; overflow-wrap: break-word; }
.punto-tooltip-dias { display: block; margin-top: 8px; font-size: 11px; font-weight: 700; color: #fff; text-align: center; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.15); }
.tendencia-leyenda { display: flex; gap: 20px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
.leyenda-item-tendencia { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #64748b; font-weight: 600; }
.leyenda-linea { width: 24px; height: 2px; border-top: 2px dashed; }
.leyenda-linea-critica-mini { border-color: #EA5455; }
.leyenda-linea-normal-mini { border-color: #FF9F43; }
.leyenda-punto { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.leyenda-punto-verde { background: #28C76F; }
.leyenda-punto-amarillo { background: #FF9F43; }
.leyenda-punto-rojo { background: #EA5455; }

.trazabilidad-toolbar { display: flex; flex-direction: column; gap: 12px; }
.trazabilidad-busqueda { width: 100%; margin-top: 4px; }
.busqueda-trazabilidad-input { width: 100%; max-width: 100%; }

.trazabilidad-comparacion-lista { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
.trazabilidad-comparacion-selectores { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.trazabilidad-comparacion-campo { display: flex; flex-direction: column; gap: 4px; }
.trazabilidad-comparacion-label { font-size: 11px; font-weight: 700; color: #64748b; }
.trazabilidad-comparacion-input { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; min-width: 180px; }
.trazabilidad-comparacion-kpis { display: flex; gap: 8px; flex-wrap: wrap; }

.tabla-trazabilidad-wrap { overflow-x: auto; }
.tabla-trazabilidad-paginacion { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 14px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
.tabla-paginacion-info { font-size: 12px; color: #64748b; font-weight: 600; }
.tabla-trazabilidad { width: 100%; border-collapse: collapse; font-size: 12px; }
.tabla-trazabilidad th, .tabla-trazabilidad td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; vertical-align: top; }
.tabla-trazabilidad th { color: #334155; font-weight: 700; background: #f8fafc; }
.tabla-vacia { text-align: center; color: #94a3b8; padding: 24px !important; }

.fechas-consolidadas { display: flex; flex-direction: column; gap: 0; }
.fecha-paso-grupo { display: flex; flex-direction: column; }
.fecha-item { display: flex; gap: 6px; font-size: 11px; flex-wrap: wrap; }
.fecha-transicion { display: flex; align-items: center; gap: 8px; padding: 3px 0 3px 10px; margin: 1px 0 1px 6px; border-left: 2px dashed #cbd5e1; }
.fecha-transicion-flecha { color: #64748b; font-size: 10px; width: 14px; text-align: center; flex-shrink: 0; }
.fecha-transicion-dias { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; white-space: nowrap; }
.fecha-transicion-pendiente { font-size: 10px; color: #94a3b8; font-style: italic; }
.fecha-label { font-weight: 700; color: #64748b; min-width: 80px; flex-shrink: 0; }
.fecha-valor { color: #334155; white-space: nowrap; }
.fecha-item-error .fecha-valor { color: #ef4444; }
.fecha-item-pendiente .fecha-valor { color: #94a3b8; font-style: italic; }

.comparacion-columna-rango { font-size: 10px; color: #64748b; margin-bottom: 4px; }

.lead-time-badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
.lead-time-excelente { background: #d1fae5; color: #065f46; }
.lead-time-aceptable { background: #fef3c7; color: #92400e; }
.lead-time-lento { background: #fee2e2; color: #991b1b; }

.rendimiento-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.rendimiento-excelente { background: #d1fae5; color: #065f46; }
.rendimiento-aceptable { background: #fef3c7; color: #92400e; }
.rendimiento-lento { background: #fee2e2; color: #991b1b; }

.trazabilidad-row-verde { background: #f0fdf4; }
.trazabilidad-row-amarillo { background: #fffbeb; }
.trazabilidad-row-rojo { background: #fef2f2; }
.trazabilidad-row-sin-dato { background: #fff; }

@media (max-width: 992px) {
    .metricas-rendimiento, .metricas-tabla { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .estados-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 576px) {
    .metricas-rendimiento, .metricas-tabla { grid-template-columns: 1fr; }
    .estados-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .seccion-title { font-size: 16px; }
    .alert-dias-habiles { padding: 10px 12px; }
    .alert-dias-habiles-text { font-size: 12px; }
    .tabla-trazabilidad-paginacion { flex-direction: column; align-items: stretch; }
    .tabla-paginacion-info { text-align: center; }
}
</style>
