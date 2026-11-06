<template>
<div class="panel-admin-bodega">
    <vx-card>
        <div class="panel-header">
            <div>
                <h3 class="panel-title">Panel Administrativo de Bodega</h3>
                <p class="panel-subtitle">Cola operativa de despacho por agenda diaria (estados 2 y 4)</p>
            </div>
            <div class="panel-header-actions">
                <vs-button color="primary" type="border" size="small" @click="cargarPanel()">
                    <i class="fa-solid fa-rotate mr-1"></i> Recargar
                </vs-button>
                <vs-button color="success" type="filled" size="small" @click="abrirModuloDespachos()">
                    <i class="fa-solid fa-truck mr-1"></i> Ir a Despachos
                </vs-button>
            </div>
        </div>

        <div class="panel-rangos mt-3 flex flex-wrap gap-4 items-center mb-4">
            <div class="flex gap-2">
                <button
                    :class="['rango-btn', rangoActivo === 'hoy' ? 'rango-btn-active' : '']"
                    @click="cambiarRango('hoy')"
                >Hoy</button>
                <button
                    :class="['rango-btn', rangoActivo === 'semana' ? 'rango-btn-active' : '']"
                    @click="cambiarRango('semana')"
                >Semanal</button>
                <button
                    :class="['rango-btn', rangoActivo === 'mes' ? 'rango-btn-active' : '']"
                    @click="cambiarRango('mes')"
                >Mensual</button>
            </div>
            
            <div class="flex gap-2 items-center text-sm border-l border-gray-300 pl-4 ml-2">
                <span class="font-bold text-gray-600">Personalizado:</span>
                <input type="date" v-model="rangoManual.desde" class="p-1 border rounded" />
                <span>a</span>
                <input type="date" v-model="rangoManual.hasta" class="p-1 border rounded" />
                <vs-button size="small" type="border" color="primary" @click="aplicarRangoManual()">Buscar</vs-button>
            </div>

            <div class="rango-detalle ml-auto">
                {{ tituloRango }}: <b>{{ rangoConsultado.desde }}</b> a <b>{{ rangoConsultado.hasta }}</b>
            </div>
        </div>

        <div class="panel-kpis mt-4">
            <div class="kpi-card kpi-total">
                <span class="kpi-label">Total en panel</span>
                <span class="kpi-value">{{ resumen.total }}</span>
            </div>
            <div class="kpi-card kpi-pendiente">
                <span class="kpi-label">Pendientes</span>
                <span class="kpi-value">{{ resumen.pendiente }}</span>
            </div>
            <div class="kpi-card kpi-proceso">
                <span class="kpi-label">En proceso</span>
                <span class="kpi-value">{{ resumen.enProceso }}</span>
            </div>
            <div class="kpi-card kpi-despachado">
                <span class="kpi-label">Despachados</span>
                <span class="kpi-value">{{ resumen.despachado }}</span>
            </div>
            <div class="kpi-card kpi-activo">
                <span class="kpi-label">Tareas activas</span>
                <span class="kpi-value">{{ resumen.tareasActivas }}</span>
            </div>
        </div>

        <div class="panel-tabs mt-4">
            <div class="tabs-header">
                <button
                    :class="['tab-btn', tabActivo === 'calendario' ? 'tab-btn-active' : '']"
                    @click="tabActivo = 'calendario'"
                >
                    <i class="fa-solid fa-calendar-days"></i> Calendario
                </button>
                <!-- <button
                    :class="['tab-btn', tabActivo === 'kanban' ? 'tab-btn-active' : '']"
                    @click="tabActivo = 'kanban'"
                >
                    <i class="fa-solid fa-columns"></i> Panel
                </button> -->
                <button
                    :class="['tab-btn', tabActivo === 'trazabilidad' ? 'tab-btn-active' : '']"
                    @click="tabActivo = 'trazabilidad'"
                >
                    <i class="fa-solid fa-list-check"></i> Registro de Trazabilidad
                </button>
            </div>

            <div class="tabs-content">
                <!-- TAB: PANEL KANBAN -->
                <div v-show="tabActivo === 'kanban'" class="tab-panel">
                    <div class="kanban-board-full">
                        <div class="kanban-columna-full kanban-columna-pendiente">
                            <div class="kanban-header-full">
                                <div class="kanban-header-title">
                                    <i class="fa-solid fa-clock"></i>
                                    <span>Pendientes</span>
                                </div>
                                <div class="kanban-header-count">{{ kanbanPendiente.length }}</div>
                            </div>
                            <div class="kanban-lista-full">
                                <div v-if="kanbanPendiente.length === 0" class="kanban-vacio">Sin documentos pendientes</div>
                                <div
                                    v-for="venta in kanbanPendiente"
                                    :key="'p-' + venta.ven_codigo"
                                    class="kanban-card-full"
                                >
                                    <div class="kanban-card-header">
                                        <span class="kanban-card-codigo">{{ venta.ven_codigo }}</span>
                                        <vs-chip color="warning" size="small">Pendiente</vs-chip>
                                    </div>
                                    <div class="kanban-card-body">
                                        <div class="kanban-card-info">
                                            <i class="fa-solid fa-user"></i>
                                            {{ venta.nombre_cliente || venta.ven_cliente || 'Sin cliente' }}
                                        </div>
                                        <div class="kanban-card-info">
                                            <i class="fa-solid fa-calendar"></i>
                                            Creado: {{ normalizarFechaVenta(venta.ven_fecha) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="kanban-columna-full kanban-columna-proceso">
                            <div class="kanban-header-full">
                                <div class="kanban-header-title">
                                    <i class="fa-solid fa-box-open"></i>
                                    <span>En Proceso</span>
                                </div>
                                <div class="kanban-header-count">{{ kanbanEnProceso.length }}</div>
                            </div>
                            <div class="kanban-lista-full">
                                <div v-if="kanbanEnProceso.length === 0" class="kanban-vacio">Sin documentos en proceso</div>
                                <div
                                    v-for="venta in kanbanEnProceso"
                                    :key="'e-' + venta.ven_codigo"
                                    class="kanban-card-full"
                                >
                                    <div class="kanban-card-header">
                                        <span class="kanban-card-codigo">{{ venta.ven_codigo }}</span>
                                        <vs-chip color="primary" size="small">En proceso</vs-chip>
                                    </div>
                                    <div class="kanban-card-body">
                                        <div class="kanban-card-info">
                                            <i class="fa-solid fa-user"></i>
                                            {{ venta.nombre_cliente || venta.ven_cliente || 'Sin cliente' }}
                                        </div>
                                        <div class="kanban-card-info">
                                            <i class="fa-solid fa-calendar"></i>
                                            Creado: {{ normalizarFechaVenta(venta.ven_fecha) }}
                                        </div>
                                        <div v-if="venta.fecha_en_proceso_bodega" class="kanban-card-info kanban-card-info-highlight">
                                            <i class="fa-solid fa-clock"></i>
                                            En proceso: {{ formatearFechaHoraVista(venta.fecha_en_proceso_bodega) }}
                                        </div>
                                        <div v-if="venta.fecha_impreso_bodega && venta.impresion == 1" class="kanban-card-info kanban-card-info-success">
                                            <i class="fa-solid fa-print"></i>
                                            Impreso: {{ formatearFechaHoraVista(venta.fecha_impreso_bodega) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="kanban-columna-full kanban-columna-despachado">
                            <div class="kanban-header-full">
                                <div class="kanban-header-title">
                                    <i class="fa-solid fa-truck"></i>
                                    <span>Despachados</span>
                                </div>
                                <div class="kanban-header-count">{{ kanbanDespachado.length }}</div>
                            </div>
                            <div class="kanban-lista-full">
                                <div v-if="kanbanDespachado.length === 0" class="kanban-vacio">Sin documentos despachados</div>
                                <div
                                    v-for="venta in kanbanDespachado"
                                    :key="'d-' + venta.ven_codigo"
                                    class="kanban-card-full"
                                >
                                    <div class="kanban-card-header">
                                        <span class="kanban-card-codigo">{{ venta.ven_codigo }}</span>
                                        <vs-chip color="success" size="small">Despachado</vs-chip>
                                    </div>
                                    <div class="kanban-card-body">
                                        <div class="kanban-card-info">
                                            <i class="fa-solid fa-user"></i>
                                            {{ venta.nombre_cliente || venta.ven_cliente || 'Sin cliente' }}
                                        </div>
                                        <div class="kanban-card-info">
                                            <i class="fa-solid fa-calendar"></i>
                                            Creado: {{ normalizarFechaVenta(venta.ven_fecha) }}
                                        </div>
                                        <div v-if="venta.fecha_proceso_despacho" class="kanban-card-info kanban-card-info-success">
                                            <i class="fa-solid fa-check-circle"></i>
                                            Despachado: {{ formatearFechaHoraVista(venta.fecha_proceso_despacho) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: CALENDARIO -->
                <div v-show="tabActivo === 'calendario'" class="tab-panel">
                    <div class="calendario-container">
                        <div class="calendario-header-ux">
                            <div>
                                <h4 class="seccion-title mb-1">Calendario de Gestión de Bodega</h4>
                                <p class="calendario-subtitle">Cronograma visual de documentos con todas las fechas de control del proceso.</p>
                            </div>
                            <div class="calendario-leyenda">
                                <span class="leyenda-item"><span class="leyenda-dot leyenda-creado"></span> Creado</span>
                                <span class="leyenda-item"><span class="leyenda-dot leyenda-subida"></span> Subida códigos</span>
                                <span class="leyenda-item"><span class="leyenda-dot leyenda-proceso"></span> En proceso</span>
                                <span class="leyenda-item"><span class="leyenda-dot leyenda-empacado"></span> Empacado</span>
                                <span class="leyenda-item"><span class="leyenda-dot leyenda-impreso"></span> Impreso</span>
                                <span class="leyenda-item"><span class="leyenda-dot leyenda-despachado"></span> Despachado</span>
                            </div>
                        </div>
                        <div :class="['calendario-grid', 'rango-' + rangoActivo]">
                            <!-- Ya no hay cabeceras duras, las mapearemos dinámicamente si es mes -->
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Lun</div>
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Mar</div>
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Mie</div>
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Jue</div>
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Vie</div>
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Sab</div>
                            <div class="calendario-head" v-if="rangoActivo === 'mes'">Dom</div>

                            <div
                                v-for="(dia, index) in calendarioDias"
                                :key="'cal-' + index"
                                :class="['calendario-dia', dia.esHoy ? 'calendario-dia-hoy' : '', dia.tieneActividad ? 'calendario-dia-activo' : '']"
                            >
                                <div class="calendario-dia-nombre" v-if="rangoActivo !== 'mes'">
                                    {{ dia.nombreDia }}
                                </div>
                                <div class="calendario-dia-fecha">
                                    <span>{{ dia.etiqueta }}</span>
                                    <span class="calendario-dia-fecha-iso">{{ dia.fecha }}</span>
                                </div>
                                <div class="calendario-dia-contenido">
                                    <vx-tooltip v-if="dia.creados > 0" class="calendario-evento-tooltip" text="Documentos creados" position="top">
                                        <div class="calendario-evento calendario-evento-creado">
                                            <i class="fa-solid fa-file-invoice"></i> {{ dia.creados }}
                                        </div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="dia.subidaCodigos > 0" class="calendario-evento-tooltip" text="Subida de codigos" position="top">
                                        <div class="calendario-evento calendario-evento-subida">
                                            <i class="fa-solid fa-upload"></i> {{ dia.subidaCodigos }}
                                        </div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="dia.enProceso > 0" class="calendario-evento-tooltip" text="Documentos en proceso" position="top">
                                        <div class="calendario-evento calendario-evento-proceso">
                                            <i class="fa-solid fa-box-open"></i> {{ dia.enProceso }}
                                        </div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="dia.empacados > 0" class="calendario-evento-tooltip" text="Documentos empacados" position="top">
                                        <div class="calendario-evento calendario-evento-empacado">
                                            <i class="fa-solid fa-boxes-stacked"></i> {{ dia.empacados }}
                                        </div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="dia.impresos > 0" class="calendario-evento-tooltip" text="Documentos impresos" position="top">
                                        <div class="calendario-evento calendario-evento-impreso">
                                            <i class="fa-solid fa-print"></i> {{ dia.impresos }}
                                        </div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="dia.despachados > 0" class="calendario-evento-tooltip" text="Documentos despachados" position="top">
                                        <div class="calendario-evento calendario-evento-despachado">
                                            <i class="fa-solid fa-truck"></i> {{ dia.despachados }}
                                        </div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="dia.escaneos > 0" class="calendario-evento-tooltip" text="Escaneos registrados" position="top">
                                        <div class="calendario-evento calendario-evento-escaneo">
                                            <i class="fa-solid fa-barcode"></i> {{ dia.escaneos }}
                                        </div>
                                    </vx-tooltip>
                                </div>
                                <div v-if="dia.documentos.length > 0" class="calendario-documentos-lista">
                                    <div
                                        v-for="doc in dia.documentos.slice(0, getLimiteDocumentosVisibles())"
                                        :key="'doc-' + doc.ven_codigo"
                                        :class="['calendario-doc-chip', 'calendario-doc-' + doc.tipoEvento]"
                                        @click="verDetalleDocumento(doc)"
                                    >
                                        <span class="doc-chip-codigo">{{ doc.ven_codigo }}</span>
                                        <span class="doc-chip-evento">{{ doc.eventoTexto }}</span>
                                    </div>
                                    <div v-if="dia.documentos.length > getLimiteDocumentosVisibles()" class="calendario-doc-extra" @click="verDocumentosDia(dia)">
                                        +{{ dia.documentos.length - getLimiteDocumentosVisibles() }} más
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: TRAZABILIDAD -->
                <div v-show="tabActivo === 'trazabilidad'" class="tab-panel">
                    <div class="trazabilidad-container">
                        <div class="trazabilidad-header">
                            <div>
                                <h4 class="seccion-title mb-1">Registro de Trazabilidad Despachos </h4>
                                <!-- <p class="calendario-subtitle">Seguimiento detallado del flujo completo de cada documento con todas las fechas de control.</p> -->
                            </div>
                        </div>
                        <!-- Métricas de Rendimiento -->
                        <div class="metricas-rendimiento mb-4">
                            <div class="metrica-card metrica-excelente">
                                <div class="metrica-icon">
                                    <i class="fa-solid fa-bolt"></i>
                                </div>
                                <div class="metrica-content">
                                    <span class="metrica-label">Despacho Rápido</span>
                                    <span class="metrica-value">{{ metricas.rapidos }}</span>
                                    <span class="metrica-desc">≤ 3 días</span>
                                </div>
                            </div>
                            <div class="metrica-card metrica-aceptable">
                                <div class="metrica-icon">
                                    <i class="fa-solid fa-clock"></i>
                                </div>
                                <div class="metrica-content">
                                    <span class="metrica-label">Despacho Normal</span>
                                    <span class="metrica-value">{{ metricas.normales }}</span>
                                    <span class="metrica-desc">4-7 días</span>
                                </div>
                            </div>
                            <div class="metrica-card metrica-lento">
                                <div class="metrica-icon">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <div class="metrica-content">
                                    <span class="metrica-label">Despacho Lento</span>
                                    <span class="metrica-value">{{ metricas.lentos }}</span>
                                    <span class="metrica-desc">> 7 días</span>
                                </div>
                            </div>
                            <div class="metrica-card metrica-promedio">
                                <div class="metrica-icon">
                                    <i class="fa-solid fa-chart-line"></i>
                                </div>
                                <div class="metrica-content">
                                    <span class="metrica-label">Promedio General</span>
                                    <span class="metrica-value">{{ metricas.promedio }}</span>
                                    <span class="metrica-desc">días</span>
                                </div>
                            </div>
                        </div>

                        <!-- Gráficos de Trazabilidad -->
                        <div class="graficos-trazabilidad-grid mb-4">
                            <!-- Gráfico de Distribución de Tiempos -->
                            <div class="grafico-rendimiento-compacto">
                                <div class="grafico-header-compacto">
                                    <h5 class="grafico-title-compacto">Distribución de Tiempos</h5>
                                    <span class="grafico-total">{{ metricas.total }} docs</span>
                                </div>
                                <div class="grafico-barras-compacto">
                                    <div class="barra-item-compacto">
                                        <div class="barra-info-compacto">
                                            <span class="barra-label-compacto">≤ 3 días</span>
                                            <span class="barra-count-compacto">{{ metricas.rapidos }} ({{ calcularPorcentajeDistribucion(metricas.rapidos) }}%)</span>
                                        </div>
                                        <div class="barra-track-compacto">
                                            <div 
                                                class="barra-fill-compacto barra-fill-excelente" 
                                                :style="{ width: calcularPorcentajeDistribucion(metricas.rapidos) + '%' }"
                                            ></div>
                                        </div>
                                    </div>
                                    <div class="barra-item-compacto">
                                        <div class="barra-info-compacto">
                                            <span class="barra-label-compacto">4-7 días</span>
                                            <span class="barra-count-compacto">{{ metricas.normales }} ({{ calcularPorcentajeDistribucion(metricas.normales) }}%)</span>
                                        </div>
                                        <div class="barra-track-compacto">
                                            <div 
                                                class="barra-fill-compacto barra-fill-aceptable" 
                                                :style="{ width: calcularPorcentajeDistribucion(metricas.normales) + '%' }"
                                            ></div>
                                        </div>
                                    </div>
                                    <div class="barra-item-compacto">
                                        <div class="barra-info-compacto">
                                            <span class="barra-label-compacto">> 7 días</span>
                                            <span class="barra-count-compacto">{{ metricas.lentos }} ({{ calcularPorcentajeDistribucion(metricas.lentos) }}%)</span>
                                        </div>
                                        <div class="barra-track-compacto">
                                            <div 
                                                class="barra-fill-compacto barra-fill-lento" 
                                                :style="{ width: calcularPorcentajeDistribucion(metricas.lentos) + '%' }"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Gráfico de Flujo de Proceso -->
                            <div class="grafico-flujo-proceso">
                                <div class="grafico-header-compacto">
                                    <h5 class="grafico-title-compacto">Flujo del Proceso</h5>
                                    <span class="grafico-total">Etapas del ciclo</span>
                                </div>
                                <div class="flujo-timeline">
                                    <div class="flujo-etapa">
                                        <div class="flujo-icono flujo-icono-creado">
                                            <i class="fa-solid fa-file-invoice"></i>
                                        </div>
                                        <div class="flujo-info">
                                            <span class="flujo-label">Creado</span>
                                            <span class="flujo-count">{{ resumen.total }}</span>
                                        </div>
                                    </div>
                                    <div class="flujo-flecha">
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </div>
                                    <div class="flujo-etapa">
                                        <div class="flujo-icono flujo-icono-proceso">
                                            <i class="fa-solid fa-box-open"></i>
                                        </div>
                                        <div class="flujo-info">
                                            <span class="flujo-label">En Proceso</span>
                                            <span class="flujo-count">{{ resumen.enProceso }}</span>
                                        </div>
                                    </div>
                                    <div class="flujo-flecha">
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </div>
                                    <!-- <div class="flujo-etapa">
                                        <div class="flujo-icono flujo-icono-impreso">
                                            <i class="fa-solid fa-print"></i>
                                        </div>
                                        <div class="flujo-info">
                                            <span class="flujo-label">Impreso</span>
                                            <span class="flujo-count">{{ contarImpresos() }}</span>
                                        </div>
                                    </div>
                                    <div class="flujo-flecha">
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </div> -->
                                    <div class="flujo-etapa">
                                        <div class="flujo-icono flujo-icono-despachado">
                                            <i class="fa-solid fa-truck"></i>
                                        </div>
                                        <div class="flujo-info">
                                            <span class="flujo-label">Despachado</span>
                                            <span class="flujo-count">{{ metricas.total }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gráfico de Tendencia Temporal -->
                        <div class="grafico-tendencia-temporal mb-4">
                            <div class="grafico-header-compacto">
                                <h5 class="grafico-title-compacto">Análisis de Tiempos de Despacho</h5>
                                <span class="grafico-total">Últimos documentos despachados</span>
                            </div>
                            <div class="tendencia-visual">
                                <div class="tendencia-eje-y">
                                    <span class="eje-label">14d</span>
                                    <span class="eje-label">10d</span>
                                    <span class="eje-label">7d</span>
                                    <span class="eje-label">3d</span>
                                    <span class="eje-label">0d</span>
                                </div>
                                <div class="tendencia-grafico">
                                    <div class="tendencia-linea tendencia-linea-critica"></div>
                                    <div class="tendencia-linea tendencia-linea-normal"></div>
                                    <div class="tendencia-puntos">
                                        <div 
                                            v-for="(item, index) in obtenerUltimosDespachados()" 
                                            :key="'punto-' + index"
                                            :class="['tendencia-punto', getTendenciaClase(item.leadTimeDias)]"
                                            :style="{ left: calcularPosicionX(index, obtenerUltimosDespachados().length) + '%', bottom: calcularPosicionY(item.leadTimeDias) + '%' }"
                                            :title="item.ven_codigo + ' - ' + item.leadTimeDias + ' días'"
                                        >
                                            <span class="punto-tooltip">{{ item.ven_codigo }}<br>{{ item.leadTimeDias }}d</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tendencia-leyenda">
                                <div class="leyenda-item-tendencia">
                                    <span class="leyenda-linea leyenda-linea-critica-mini"></span>
                                    <span>Límite crítico (7 días)</span>
                                </div>
                                <div class="leyenda-item-tendencia">
                                    <span class="leyenda-linea leyenda-linea-normal-mini"></span>
                                    <span>Límite óptimo (3 días)</span>
                                </div>
                            </div>
                        </div>
                        

                        <!-- <div class="kpi-trazabilidad-grid mb-4">
                            <div
                                :class="['kpi-trazabilidad-card', filtroKpiTrazabilidad === 'todos' ? 'kpi-trazabilidad-card-activo' : '']"
                                @click="filtroKpiTrazabilidad = 'todos'"
                            >
                                <span class="kpi-trazabilidad-label">Documentos</span>
                                <span class="kpi-trazabilidad-value">{{ kpisTrazabilidad.totalDocumentos }}</span>
                                <span class="kpi-trazabilidad-meta">Todas las fases</span>
                            </div>
                            <div
                                :class="['kpi-trazabilidad-card', filtroKpiTrazabilidad === 'impreso' ? 'kpi-trazabilidad-card-activo' : '']"
                                @click="filtroKpiTrazabilidad = 'impreso'"
                            >
                                <span class="kpi-trazabilidad-label">Creado a impresión</span>
                                <span class="kpi-trazabilidad-value">{{ kpisTrazabilidad.promedioCreadoImpreso }}</span>
                                <span class="kpi-trazabilidad-meta">días promedio</span>
                            </div>
                            <div
                                :class="['kpi-trazabilidad-card', filtroKpiTrazabilidad === 'subida' ? 'kpi-trazabilidad-card-activo' : '']"
                                @click="filtroKpiTrazabilidad = 'subida'"
                            >
                                <span class="kpi-trazabilidad-label">Impresión a subida</span>
                                <span class="kpi-trazabilidad-value">{{ kpisTrazabilidad.promedioImpresionSubida }}</span>
                                <span class="kpi-trazabilidad-meta">días promedio</span>
                            </div>
                            <div
                                :class="['kpi-trazabilidad-card', filtroKpiTrazabilidad === 'empacado' ? 'kpi-trazabilidad-card-activo' : '']"
                                @click="filtroKpiTrazabilidad = 'empacado'"
                            >
                                <span class="kpi-trazabilidad-label">Subida a empacado</span>
                                <span class="kpi-trazabilidad-value">{{ kpisTrazabilidad.promedioSubidaEmpacado }}</span>
                                <span class="kpi-trazabilidad-meta">días promedio</span>
                            </div>
                            <div
                                :class="['kpi-trazabilidad-card', filtroKpiTrazabilidad === 'despachado' ? 'kpi-trazabilidad-card-activo' : '']"
                                @click="filtroKpiTrazabilidad = 'despachado'"
                            >
                                <span class="kpi-trazabilidad-label">Empacado a despacho</span>
                                <span class="kpi-trazabilidad-value">{{ kpisTrazabilidad.promedioEmpacadoDespacho }}</span>
                                <span class="kpi-trazabilidad-meta">días promedio</span>
                            </div>
                        </div> -->

                        <!-- Tabla de Trazabilidad -->
                        <div class="trazabilidad-toolbar mb-3">
                            <div class="trazabilidad-busqueda">
                                <vs-input
                                    v-model="busquedaTrazabilidad"
                                    icon-pack="feather"
                                    icon="icon-search"
                                    class="busqueda-trazabilidad-input"
                                    placeholder="Buscar documento o estado"
                                    size="small"
                                />
                            </div>

                            <div class="trazabilidad-filtros-color">
                                <span class="trazabilidad-filtro-label">Filtrar por color:</span>
                                <vs-button
                                    size="small"
                                    type="border"
                                    :class="['filtro-color-btn', esFiltroColorActivo('todos') ? 'filtro-color-activo filtro-color-primary' : 'filtro-color-inactivo filtro-color-primary']"
                                    color="primary"
                                    @click="filtroColorTrazabilidad = 'todos'"
                                >Todos</vs-button>
                                <vs-button
                                    size="small"
                                    type="border"
                                    :class="['filtro-color-btn', esFiltroColorActivo('amarillo') ? 'filtro-color-activo filtro-color-warning' : 'filtro-color-inactivo filtro-color-warning']"
                                    color="warning"
                                    @click="filtroColorTrazabilidad = 'amarillo'"
                                >Amarillos</vs-button>
                                <vs-button
                                    size="small"
                                    type="border"
                                    :class="['filtro-color-btn', esFiltroColorActivo('verde') ? 'filtro-color-activo filtro-color-success' : 'filtro-color-inactivo filtro-color-success']"
                                    color="success"
                                    @click="filtroColorTrazabilidad = 'verde'"
                                >Verdes</vs-button>
                                <vs-button
                                    size="small"
                                    type="border"
                                    :class="['filtro-color-btn', esFiltroColorActivo('rojo') ? 'filtro-color-activo filtro-color-danger' : 'filtro-color-inactivo filtro-color-danger']"
                                    color="danger"
                                    @click="filtroColorTrazabilidad = 'rojo'"
                                >Rojos</vs-button>
                            </div>

                            <div class="trazabilidad-comparacion-lista">
                                <div class="trazabilidad-comparacion-selectores">
                                    <div class="trazabilidad-comparacion-campo">
                                        <span class="trazabilidad-comparacion-label">Desde</span>
                                        <select v-model="faseComparacionOrigen" class="trazabilidad-comparacion-input">
                                            <option v-for="fase in fasesTrazabilidadOpciones" :key="'tb-origen-' + fase.valor" :value="fase.valor">
                                                {{ fase.texto }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="trazabilidad-comparacion-campo">
                                        <span class="trazabilidad-comparacion-label">Hasta</span>
                                        <select v-model="faseComparacionDestino" class="trazabilidad-comparacion-input">
                                            <option v-for="fase in fasesTrazabilidadOpciones" :key="'tb-destino-' + fase.valor" :value="fase.valor">
                                                {{ fase.texto }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="trazabilidad-comparacion-kpis">
                                    <vs-chip color="primary">Comparables: {{ comparacionFasesTrazabilidad.conAmbasFechas }}</vs-chip>
                                    <vs-chip color="warning">Sin fechas: {{ comparacionFasesTrazabilidad.sinAmbasFechas }}</vs-chip>
                                    <vs-chip color="success">Promedio: {{ comparacionFasesTrazabilidad.promedioDias }} días</vs-chip>
                                </div>
                                <div class="trazabilidad-comparacion-acciones">
                                    <vs-button size="small" color="primary" type="border" @click="intercambiarFasesComparacion">Invertir</vs-button>
                                    <vs-button size="small" color="success" type="filled" @click="filtroKpiTrazabilidad = 'comparacion'">Solo comparables</vs-button>
                                    <vs-button size="small" color="dark" type="border" @click="filtroKpiTrazabilidad = 'todos'">Todos</vs-button>
                                </div>
                            </div>
                        </div>

                        <div class="tabla-trazabilidad-wrap">
                            <table class="tabla-trazabilidad">
                                <thead>
                                    <tr>
                                        <th>Documento</th>
                                        <th>Estado</th>
                                        <th>Fechas</th>
                                        <th>Comparación</th>
                                        <th>Lead time</th>
                                        <th width="150">Rendimiento</th>
                                        <th width="180">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="trazabilidadItemsFiltrados.length === 0">
                                        <td colspan="7" class="tabla-vacia">No hay documentos operativos para trazabilidad</td>
                                    </tr>
                                    <tr v-for="item in trazabilidadItemsFiltrados" :key="'t-' + item.ven_codigo" :class="['trazabilidad-row', getClaseComparacionFila(item)]">
                                        <td>{{ item.ven_codigo }}</td>
                                        <td>
                                            <vs-chip :color="getColorEstadoChip(item.estadoCodigo)" size="small">
                                                {{ item.estadoTexto }}
                                            </vs-chip>
                                        </td>
                                        <td>
                                            <div class="fechas-consolidadas">
                                                <!-- 1. CREADO (siempre debe existir) -->
                                                <div :class="['fecha-item', item.fechaCreado === '-' ? 'fecha-item-error' : '']">
                                                    <span class="fecha-label">Creado:</span>
                                                    <span class="fecha-valor">{{ formatearFechaResponsable(item.fechaCreado, item.usuarioCreado) }}</span>
                                                </div>
                                                
                                                <!-- 2. IMPRESO (debe existir si hay escaneo o fases posteriores) -->
                                                <div :class="['fecha-item', validarFechaImpreso(item) ? 'fecha-item-error' : '']">
                                                    <span class="fecha-label">Impreso:</span>
                                                    <span class="fecha-valor">
                                                        {{ item.fechaImpreso !== '-' ? formatearFechaResponsable(item.fechaImpreso, item.usuarioImpreso) : '❌ FALTA' }}
                                                    </span>
                                                </div>
                                                
                                                <!-- 3. ESCANEO (debe existir si hay subida de códigos, empacado o despacho) -->
                                                <div :class="['fecha-item', validarFechaEscaneo(item) ? 'fecha-item-error' : '']">
                                                    <span class="fecha-label">Escaneo rango:</span>
                                                    <span class="fecha-valor">
                                                        <template v-if="item.fechaEscaneoInicio !== '-' || item.fechaEscaneoFin !== '-'">
                                                            {{ item.fechaEscaneoInicio !== '-' ? item.fechaEscaneoInicio : 'Sin inicio' }}
                                                            a
                                                            {{ item.fechaEscaneoFin !== '-' ? item.fechaEscaneoFin : 'Sin fin' }}
                                                            <span v-if="item.duracionEscaneoDias !== null">({{ item.duracionEscaneoDias }} días)</span>
                                                        </template>
                                                        <template v-else>
                                                            ❌ FALTA
                                                        </template>
                                                    </span>
                                                </div>
                                                
                                                <!-- <div v-if="item.responsablesEscaneo !== '-'" class="fecha-item">
                                                    <span class="fecha-label">Resp. escaneo:</span>
                                                    <span class="fecha-valor">{{ item.responsablesEscaneo }}</span>
                                                </div> -->
                                                
                                                <div v-if="item.fechasEscaneo && item.fechasEscaneo.length > 0" class="fecha-item">
                                                    <span class="fecha-label">Escaneo(s):</span>
                                                    <div class="fechas-escaneo-grupo">
                                                        <button
                                                            v-for="(fechaEscaneo, idx) in item.fechasEscaneo"
                                                            :key="'escaneo-' + idx"
                                                            class="fecha-escaneo"
                                                            type="button"
                                                            @click="abrirDetalleEscaneo(item, idx)"
                                                        >
                                                            {{ fechaEscaneo.fechaInicio }} | {{ fechaEscaneo.nombreUsuario }}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <!-- 4. SUBIDA CÓDIGOS (debe existir si hay empacado o despacho) -->
                                                <div :class="['fecha-item', validarFechaSubidaCodigos(item) ? 'fecha-item-error' : '']">
                                                    <span class="fecha-label">Subida códigos:</span>
                                                    <span class="fecha-valor">
                                                        {{ item.fechaSubidaCodigos !== '-' ? item.fechaSubidaCodigos : '❌ FALTA' }}
                                                    </span>
                                                </div>
                                                
                                                <!-- 5. EMPACADO (debe existir si hay despacho) -->
                                                <div :class="['fecha-item', validarFechaEmpacado(item) ? 'fecha-item-error' : '']">
                                                    <span class="fecha-label">Empacado:</span>
                                                    <span class="fecha-valor">
                                                        {{ item.fechaEmpacado !== '-' ? formatearFechaResponsable(item.fechaEmpacado, item.usuarioEmpacado) : '❌ FALTA' }}
                                                    </span>
                                                </div>
                                                
                                                <!-- 6. EN PROCESO -->
                                                <div v-if="item.fechaEnProceso !== '-'" class="fecha-item">
                                                    <span class="fecha-label">En proceso:</span>
                                                    <span class="fecha-valor">{{ item.fechaEnProceso }}</span>
                                                </div>
                                                
                                                <!-- 7. DESPACHADO (debe tener todas las anteriores) -->
                                                <div v-if="item.fechaDespachado !== '-'" class="fecha-item">
                                                    <span class="fecha-label">Despachado:</span>
                                                    <span class="fecha-valor">{{ formatearFechaResponsable(item.fechaDespachado, item.usuarioDespachado) }}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div v-if="item.tieneComparacion" class="comparacion-columna-ok">
                                                <div class="comparacion-columna-head">
                                                    <div class="comparacion-columna-dias">{{ item.diasComparacion }} días</div>
                                                    <vs-chip :color="getColorComparacionChip(item.diasComparacion)" size="small">{{ getTextoSemaforoComparacion(item.diasComparacion) }}</vs-chip>
                                                </div>
                                                <div class="comparacion-columna-rango">{{ comparacionFasesTrazabilidad.etiquetaOrigen }} → {{ comparacionFasesTrazabilidad.etiquetaDestino }}</div>
                                                <div class="comparacion-columna-fechas">{{ item.fechaComparacionOrigen }} | {{ item.fechaComparacionDestino }}</div>
                                                <div class="comparacion-columna-barra-bg">
                                                    <div :class="['comparacion-columna-barra-fill', getClaseBarraComparacion(item.diasComparacion)]" :style="{ width: calcularPorcentajeSemaforoComparacion(item.diasComparacion) + '%' }"></div>
                                                </div>
                                            </div>
                                            <div v-else class="comparacion-columna-vacia">
                                                Sin ambas fechas
                                            </div>
                                        </td>
                                        <td>
                                            <span :class="['lead-time-badge', getClaseLeadTime(item.leadTimeDias)]">
                                                {{ item.leadTimeDias }} días
                                            </span>
                                        </td>
                                        <td>
                                            <div class="rendimiento-visual">
                                                <div class="rendimiento-barra-bg">
                                                    <div 
                                                        :class="['rendimiento-barra-fill', getClaseRendimiento(item.leadTimeDias)]"
                                                        :style="{ width: calcularPorcentajeRendimiento(item.leadTimeDias) + '%' }"
                                                    ></div>
                                                </div>
                                                <div>
                                                    <span :class="['rendimiento-texto', getClaseRendimiento(item.leadTimeDias)]">
                                                        {{ getTextoRendimiento(item.leadTimeDias) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="acciones-trazabilidad">
                                                <vs-button
                                                    icon-pack="feather"
                                                    icon="icon-eye"
                                                    color="primary"
                                                    type="border"
                                                    size="small"
                                                    @click="abrirDetalleDocumento(item)"
                                                >
                                                    Detalle
                                                </vs-button>
                                                <vs-button
                                                    icon-pack="feather"
                                                    icon="icon-file-text"
                                                    color="danger"
                                                    type="border"
                                                    size="small"
                                                    @click="verPDFDocumento(item)"
                                                >
                                                    PDF
                                                </vs-button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </vx-card>

    <!-- POPUP VER DOCUMENTOS DEL DIA -->
    <vs-popup v-if="diaDocumentosSeleccionado" class="popup-documentos-dia" :title="`Documentos del día ${diaDocumentosSeleccionado.etiqueta}`" :active.sync="popupAperturaDocumentos">
        <div class="p-2" style="max-height: 60vh; overflow-y: auto;">
            <div v-if="diaDocumentosSeleccionado.documentos && diaDocumentosSeleccionado.documentos.length > 0" class="flex flex-col gap-2">
                <div
                    v-for="(doc, index) in obtenerDocumentosUnicos(diaDocumentosSeleccionado.documentos)"
                    :key="'doc-popup-' + doc.ven_codigo"
                    class="docs-dia-item"
                >
                    <div class="docs-dia-info">
                        <span class="font-bold text-gray-500">{{ index + 1 }}.</span>
                        <span class="font-bold text-primary">{{ doc.ven_codigo }}</span>
                    </div>
                    <div class="docs-dia-actions">
                        <vs-chip :color="getColorChipEvento(doc.tipoEvento)">
                            {{ doc.eventoTexto }}
                        </vs-chip>
                        <vs-button size="small" type="border" color="primary" @click.stop="abrirDetalleDocumentoDesdeLista(doc)">Ver detalle</vs-button>
                        <vs-button size="small" type="filled" color="success" @click.stop="abrirPdfDesdeLista(doc)">Ver PDF</vs-button>
                    </div>
                </div>
            </div>
        </div>
    </vs-popup>

    <vs-popup v-if="popupDetalleEscaneo && escaneoDetalleSeleccionado" :title="`Detalle de Escaneo ${documentoEscaneoSeleccionado ? documentoEscaneoSeleccionado : ''}`" :active.sync="popupDetalleEscaneo">
        <div class="escaneo-detalle-popup">
            <div class="escaneo-detalle-grid">
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Documento</span>
                    <span class="escaneo-detalle-value">{{ documentoEscaneoSeleccionado ? documentoEscaneoSeleccionado : '-' }}</span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">ID Escaneo</span>
                    <span class="escaneo-detalle-value">{{ escaneoDetalleSeleccionado.id != null ? escaneoDetalleSeleccionado.id : '-' }}</span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Usuario</span>
                    <span class="escaneo-detalle-value">{{ escaneoDetalleSeleccionado.nombreUsuario ? escaneoDetalleSeleccionado.nombreUsuario : '-' }}</span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Estado</span>
                    <span class="escaneo-detalle-value">
                        <vs-chip :color="getColorEstadoEscaneo(escaneoDetalleSeleccionado.estado)">
                            {{ getTextoEstadoEscaneo(escaneoDetalleSeleccionado.estado) }}
                        </vs-chip>
                    </span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Fecha inicio</span>
                    <span class="escaneo-detalle-value">{{ escaneoDetalleSeleccionado.fechaInicio ? escaneoDetalleSeleccionado.fechaInicio : '-' }}</span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Fecha fin</span>
                    <span class="escaneo-detalle-value">{{ escaneoDetalleSeleccionado.fechaFin ? escaneoDetalleSeleccionado.fechaFin : '-' }}</span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Códigos subidos</span>
                    <span class="escaneo-detalle-value">{{ escaneoDetalleSeleccionado.codigosSubidos != null ? escaneoDetalleSeleccionado.codigosSubidos : 0 }}</span>
                </div>
                <div class="escaneo-detalle-campo">
                    <span class="escaneo-detalle-label">Observaciones</span>
                    <span class="escaneo-detalle-value">{{ escaneoDetalleSeleccionado.observaciones ? escaneoDetalleSeleccionado.observaciones : '-' }}</span>
                </div>
            </div>
            <div class="flex justify-end mt-2">
                <vs-button color="primary" type="filled" @click="cerrarDetalleEscaneo">Cerrar</vs-button>
            </div>
        </div>
    </vs-popup>

    <vs-popup
        v-if="popupDetalleDocumento"
        class="popup-detalle-documento"
        :title="detalleDocumentoTitulo"
        :active.sync="popupDetalleDocumento"
        fullscreen
    >
        <div class="detalle-documento-wrap">
            <div v-if="detalleDocumentoCargando" class="detalle-documento-estado">
                Cargando detalle del documento...
            </div>
            <div v-else-if="detalleDocumentoError" class="detalle-documento-estado detalle-documento-error">
                {{ detalleDocumentoError }}
            </div>
            <div v-else>
                <div class="detalle-documento-resumen">
                    <div class="detalle-resumen-card">
                        <span class="detalle-resumen-label">Creado</span>
                        <span class="detalle-resumen-value">{{ detalleDocumentoResumen.fechaCreado }}</span>
                    </div>
                    <div class="detalle-resumen-card">
                        <span class="detalle-resumen-label">Impreso</span>
                        <span class="detalle-resumen-value">{{ detalleDocumentoResumen.fechaImpreso }}</span>
                    </div>
                    <div class="detalle-resumen-card">
                        <span class="detalle-resumen-label">Subida códigos</span>
                        <span class="detalle-resumen-value">{{ detalleDocumentoResumen.fechaSubidaCodigos }}</span>
                    </div>
                    <div class="detalle-resumen-card">
                        <span class="detalle-resumen-label">Empacado</span>
                        <span class="detalle-resumen-value">{{ detalleDocumentoResumen.fechaEmpacado }}</span>
                    </div>
                    <div class="detalle-resumen-card">
                        <span class="detalle-resumen-label">En proceso</span>
                        <span class="detalle-resumen-value">{{ detalleDocumentoResumen.fechaEnProceso }}</span>
                    </div>
                    <div class="detalle-resumen-card">
                        <span class="detalle-resumen-label">Despachado</span>
                        <span class="detalle-resumen-value">{{ detalleDocumentoResumen.fechaDespachado }}</span>
                    </div>
                </div>

                <div class="tabs-header detalle-tabs-header mt-3">
                    <button
                        :class="['tab-btn', tabDetalleDocumento === 'ventas' ? 'tab-btn-active' : '']"
                        @click="tabDetalleDocumento = 'ventas'"
                    >
                        Ventas vs despacho
                    </button>
                    <!-- <button
                        :class="['tab-btn', tabDetalleDocumento === 'codigos' ? 'tab-btn-active' : '']"
                        @click="tabDetalleDocumento = 'codigos'"
                    >
                        Códigos bodega
                    </button> -->
                </div>

                <div v-show="tabDetalleDocumento === 'ventas'" class="detalle-documento-tab mt-3">
                    <div class="detalle-resumen-metricas">
                        <div class="detalle-metrica-card detalle-metrica-primary">
                            <span class="detalle-metrica-label">Vendidos</span>
                            <span class="detalle-metrica-value">{{ detalleDocumentoData.totales.vendido }}</span>
                        </div>
                        <div class="detalle-metrica-card detalle-metrica-success">
                            <span class="detalle-metrica-label">Despachados</span>
                            <span class="detalle-metrica-value">{{ detalleDocumentoData.totales.despachado }}</span>
                        </div>
                        <div class="detalle-metrica-card detalle-metrica-warning">
                            <span class="detalle-metrica-label">Devueltos</span>
                            <span class="detalle-metrica-value">{{ detalleDocumentoData.totales.devuelto }}</span>
                        </div>
                        <div class="detalle-metrica-card detalle-metrica-danger">
                            <span class="detalle-metrica-label">Saldo</span>
                            <span class="detalle-metrica-value">{{ detalleDocumentoData.totales.saldo }}</span>
                        </div>
                    </div>

                    <div class="tabla-detalle-wrap mt-3">
                        <table class="tabla-detalle-documento">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Libro</th>
                                    <th>Vendido</th>
                                    <th>Despachado</th>
                                    <th>Devuelto</th>
                                    <th>Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="detalleDocumentoData.detalle_venta.length === 0">
                                    <td colspan="6" class="tabla-vacia">No hay detalle de venta para este documento</td>
                                </tr>
                                <tr v-for="detalle in detalleDocumentoData.detalle_venta" :key="'det-' + detalle.pro_codigo">
                                    <td>{{ detalle.pro_codigo }}</td>
                                    <td>{{ detalle.pro_nombre }}</td>
                                    <td>{{ detalle.det_ven_cantidad }}</td>
                                    <td>{{ detalle.det_ven_cantidad_despacho }}</td>
                                    <td>{{ detalle.det_ven_dev }}</td>
                                    <td>{{ detalle.saldo_pendiente }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-show="tabDetalleDocumento === 'codigos'" class="detalle-documento-tab mt-3">
                    <div class="detalle-codigos-vacio" v-if="detalleDocumentoData.codigos_agrupados.length === 0">
                        No hay códigos de bodega registrados para este documento.
                    </div>
                    <div v-else class="detalle-codigos-grid">
                        <div v-for="(grupo, idxGrupo) in detalleDocumentoData.codigos_agrupados" :key="(grupo.clave || idxGrupo)" class="detalle-codigo-card">
                            <!-- Card header with title and count badge -->
                            <div class="detalle-codigo-card-header">
                                <div class="detalle-codigo-card-title">
                                    <template v-if="grupo.codigo_combo && grupo.codigo_combo !== ''">
                                        <strong style="display:block; font-size:14px;">Combo: {{ grupo.codigo_combo }}</strong>
                                    </template>
                                    <template v-else-if="grupo.combo && grupo.combo !== ''">
                                        <strong style="display:block; font-size:14px;">Grupo: {{ grupo.combo }}</strong>
                                    </template>
                                    <template v-else>
                                        <strong style="display:block; font-size:14px;">{{ grupo.codigo_liquidacion || '-' }}</strong>
                                    </template>
                                    <small style="color:#64748b; display:block; margin-top:4px;">{{ grupo.nombre_libro || '-' }}</small>
                                </div>
                                <div class="detalle-codigo-card-badge">{{ grupo.cantidad_items || 0 }}</div>
                            </div>
                            <!-- Card content with codes list -->
                            <div class="detalle-codigo-card-items">
                                <div v-if="!grupo.items || grupo.items.length === 0" style="padding:12px; text-align:center; color:#94a3b8; font-size:12px;">
                                    Sin códigos en este grupo
                                </div>
                                <div v-else v-for="(codigo, idxCodigo) in grupo.items" :key="codigo.codigo + '-' + idxCodigo" class="detalle-codigo-card-item">
                                    <div class="detalle-codigo-card-code">{{ codigo.codigo || codigo.codigo_union || codigo.codigo_proforma || '?' }}</div>
                                    <div class="detalle-codigo-card-meta">{{ codigo.codigo_liquidacion || grupo.codigo_liquidacion || '-' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- DEBUG: show raw JSON to verify data arrival -->
                    <!-- <div class="detalle-codigos-debug" v-if="detalleDocumentoData.codigos_agrupados && detalleDocumentoData.codigos_agrupados.length > 0">
                        <pre style="white-space:pre-wrap; max-height:160px; overflow:auto; background:#f1f5f9; padding:8px; border-radius:6px;">{{ JSON.stringify(detalleDocumentoData.codigos_agrupados.slice(0,3), null, 2) }}</pre>
                    </div> -->
                </div>
            </div>
        </div>
    </vs-popup>

    <!-- POPUP VER PDF -->
    <vs-popup-history
        v-if="popupPDF"
        fullscreen
        class="popup-pdf-hijo"
        :title="`Documento ${ventaSeleccionada ? ventaSeleccionada.ven_codigo : ''}`"
        :active.sync="popupPDF"
    >
        <ReporteVentasPDF
            v-if="ventaSeleccionada"
            :venta="ventaSeleccionada"
        />
    </vs-popup-history>
</div>
</template>

<script>
const ReporteVentasPDF = () => import('../../pedidos/facturacion/imprimir/ReporteVentasPDF.vue');

export default {
    name: 'PanelAdministrativoBodega',
    components: {
        ReporteVentasPDF
    },
    data() {
        return {
            rangoActivo: 'hoy',
            rangoConsultado: {
                desde: '',
                hasta: ''
            },
            rangoManual: {
                desde: '',
                hasta: ''
            },
            ventas: [],
            arrastreVenta: null,
            diaAgendaActivo: '',
            popupAgendaBodega: false,
            ventaAgendaSeleccionada: null,
            fechaHoraAgenda: '',
            esZonaProcesoActiva: false,
            usuario: null,
            tabActivo: 'calendario',
            resumen: {
                total: 0,
                pendiente: 0,
                enProceso: 0,
                despachado: 0,
                tareasActivas: 0
            },
            resumenPorDia: [],
            diaDocumentosSeleccionado: null,
            popupAperturaDocumentos: false,
            filtroColorTrazabilidad: 'todos',
            filtroKpiTrazabilidad: 'todos',
            faseComparacionOrigen: 'creado',
            faseComparacionDestino: 'despachado',
            busquedaTrazabilidad: '',
            popupPDF: false,
            ventaSeleccionada: null,
            popupDetalleDocumento: false,
            tabDetalleDocumento: 'ventas',
            detalleDocumentoCargando: false,
            detalleDocumentoError: '',
            detalleDocumentoData: {
                venta: null,
                venta_empacado: null,
                detalle_venta: [],
                codigos_agrupados: [],
                totales: {
                    vendido: 0,
                    despachado: 0,
                    devuelto: 0,
                    saldo: 0
                }
            },
            detalleDocumentoResumen: {
                fechaCreado: '-',
                fechaImpreso: '-',
                fechaSubidaCodigos: '-',
                fechaEmpacado: '-',
                fechaEnProceso: '-',
                fechaDespachado: '-'
            },
            popupDetalleEscaneo: false,
            escaneoDetalleSeleccionado: null,
            documentoEscaneoSeleccionado: '',
        };
    },
    computed: {
        tituloRango() {
            if (this.rangoActivo === 'hoy') return 'Rango diario';
            if (this.rangoActivo === 'semana') return 'Rango semanal';
            if (this.rangoActivo === 'mes') return 'Rango mensual';
            if (this.rangoActivo === 'manual') return 'Rango personalizado';
            return 'Rango mensual';
        },
        detalleDocumentoTitulo() {
            if (this.detalleDocumentoData && this.detalleDocumentoData.venta && this.detalleDocumentoData.venta.ven_codigo) {
                return 'Documento ' + this.detalleDocumentoData.venta.ven_codigo;
            }

            return 'Detalle del documento';
        },
        fasesTrazabilidadOpciones() {
            return [
                { valor: 'creado', texto: 'Creado' },
                { valor: 'impreso', texto: 'Impresión' },
                { valor: 'subidaCodigos', texto: 'Subida códigos' },
                { valor: 'escaneoInicio', texto: 'Escaneo inicio (primera fecha)' },
                { valor: 'escaneoFin', texto: 'Escaneo fin (última fecha)' },
                { valor: 'empacado', texto: 'Empacado' },
                { valor: 'enProceso', texto: 'En proceso' },
                { valor: 'despachado', texto: 'Despachado' }
            ];
        },
        kpisTrazabilidad() {
            let totalDocumentos = 0;
            let creadoImpreso = 0;
            let impresionSubida = 0;
            let subidaEmpacado = 0;
            let empacadoDespacho = 0;

            let sumaCreadoImpreso = 0;
            let sumaImpresionSubida = 0;
            let sumaSubidaEmpacado = 0;
            let sumaEmpacadoDespacho = 0;

            const documentos = this.ventasNoAnuladas && Array.isArray(this.ventasNoAnuladas) ? this.ventasNoAnuladas : [];

            documentos.forEach((venta) => {
                totalDocumentos += 1;

                const fechaCreado = this.extraerFechaAgenda(venta.ven_fecha);
                const fechaImpreso = this.extraerFechaAgenda(venta.fecha_impreso_bodega);
                const fechaSubida = this.obtenerFechaSubidaCodigos(venta);
                const fechaEmpacado = this.extraerFechaAgenda(venta.fecha_empaca);
                const fechaDespacho = this.extraerFechaAgenda(venta.fecha_proceso_despacho);

                const diasCreadoImpreso = this.calcularDiasEntreFechas(fechaCreado, fechaImpreso);
                if (diasCreadoImpreso !== null) {
                    sumaCreadoImpreso += diasCreadoImpreso;
                    creadoImpreso += 1;
                }

                const diasImpresionSubida = this.calcularDiasEntreFechas(fechaImpreso, fechaSubida);
                if (diasImpresionSubida !== null) {
                    sumaImpresionSubida += diasImpresionSubida;
                    impresionSubida += 1;
                }

                const diasSubidaEmpacado = this.calcularDiasEntreFechas(fechaSubida, fechaEmpacado);
                if (diasSubidaEmpacado !== null) {
                    sumaSubidaEmpacado += diasSubidaEmpacado;
                    subidaEmpacado += 1;
                }

                const diasEmpacadoDespacho = this.calcularDiasEntreFechas(fechaEmpacado, fechaDespacho);
                if (diasEmpacadoDespacho !== null) {
                    sumaEmpacadoDespacho += diasEmpacadoDespacho;
                    empacadoDespacho += 1;
                }
            });

            const promedioCreadoImpreso = creadoImpreso > 0 ? (sumaCreadoImpreso / creadoImpreso).toFixed(1) : '0.0';
            const promedioImpresionSubida = impresionSubida > 0 ? (sumaImpresionSubida / impresionSubida).toFixed(1) : '0.0';
            const promedioSubidaEmpacado = subidaEmpacado > 0 ? (sumaSubidaEmpacado / subidaEmpacado).toFixed(1) : '0.0';
            const promedioEmpacadoDespacho = empacadoDespacho > 0 ? (sumaEmpacadoDespacho / empacadoDespacho).toFixed(1) : '0.0';

            return {
                totalDocumentos: totalDocumentos,
                promedioCreadoImpreso: promedioCreadoImpreso,
                promedioImpresionSubida: promedioImpresionSubida,
                promedioSubidaEmpacado: promedioSubidaEmpacado,
                promedioEmpacadoDespacho: promedioEmpacadoDespacho
            };
        },
        comparacionFasesTrazabilidad() {
            const documentos = this.ventasNoAnuladas && Array.isArray(this.ventasNoAnuladas) ? this.ventasNoAnuladas : [];
            const faseOrigen = this.faseComparacionOrigen;
            const faseDestino = this.faseComparacionDestino;

            let suma = 0;
            let conAmbasFechas = 0;
            let sinAmbasFechas = 0;

            documentos.forEach((venta) => {
                const fechaOrigen = this.obtenerFechaFaseTrazabilidad(venta, faseOrigen);
                const fechaDestino = this.obtenerFechaFaseTrazabilidad(venta, faseDestino);
                const dias = this.calcularDiasEntreFechas(fechaOrigen, fechaDestino);

                if (dias !== null) {
                    suma += dias;
                    conAmbasFechas += 1;
                } else {
                    sinAmbasFechas += 1;
                }
            });

            const promedio = conAmbasFechas > 0 ? (suma / conAmbasFechas).toFixed(1) : '0.0';

            return {
                totalDocumentos: documentos.length,
                conAmbasFechas: conAmbasFechas,
                sinAmbasFechas: sinAmbasFechas,
                promedioDias: promedio,
                promedioDiasInvertido: promedio,
                etiquetaOrigen: this.obtenerEtiquetaFaseTrazabilidad(faseOrigen),
                etiquetaDestino: this.obtenerEtiquetaFaseTrazabilidad(faseDestino)
            };
        },
        documentosComparacionFases() {
            const documentos = this.trazabilidadItems && Array.isArray(this.trazabilidadItems) ? this.trazabilidadItems : [];

            return documentos
                .filter((item) => item.tieneComparacion && item.fechaComparacionOrigen !== '-' && item.fechaComparacionDestino !== '-')
                .map((item) => {
                    return {
                        ...item,
                        diferenciaComparacion: item.diasComparacion != null ? item.diasComparacion : 0
                    };
                })
                .sort((a, b) => {
                    if (a.diferenciaComparacion > b.diferenciaComparacion) return -1;
                    if (a.diferenciaComparacion < b.diferenciaComparacion) return 1;
                    return 0;
                });
        },
        maximoSemaforoComparacion() {
            const documentos = this.documentosComparacionFases && Array.isArray(this.documentosComparacionFases) ? this.documentosComparacionFases : [];
            let maximo = 1;

            documentos.forEach((item) => {
                const valor = item && item.diferenciaComparacion != null ? parseFloat(item.diferenciaComparacion) : 0;
                if (!isNaN(valor) && valor > maximo) {
                    maximo = valor;
                }
            });

            return maximo > 0 ? maximo : 1;
        },
        maximoKpiTrazabilidad() {
            const valores = [
                parseFloat(this.kpisTrazabilidad.promedioCreadoImpreso),
                parseFloat(this.kpisTrazabilidad.promedioImpresionSubida),
                parseFloat(this.kpisTrazabilidad.promedioSubidaEmpacado),
                parseFloat(this.kpisTrazabilidad.promedioEmpacadoDespacho)
            ];

            let maximo = 0;
            valores.forEach((valor) => {
                if (!isNaN(valor) && valor > maximo) {
                    maximo = valor;
                }
            });

            return maximo > 0 ? maximo : 1;
        },
        ventasNoAnuladas() {
            if (!this.ventas || !Array.isArray(this.ventas)) return [];
            return this.ventas.filter((venta) => {
                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                return estado !== 3;
            });
        },
        ventasOperativas() {
            return this.ventasNoAnuladas.filter((venta) => {
                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                return estado === 2 || estado === 4;
            });
        },
        kanbanPendiente() {
            return this.ventasOperativas.filter((venta) => {
                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                return estado === 2;
            });
        },
        kanbanEnProceso() {
            return this.ventasOperativas.filter((venta) => {
                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                return estado === 4;
            });
        },
        kanbanDespachado() {
            return this.ventasNoAnuladas.filter((venta) => {
                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                return estado === 1;
            });
        },
        calendarioDias() {
            const mapaDias = {};
            
            this.ventasNoAnuladas.forEach((venta) => {
                const eventos = this.obtenerEventosTrazabilidad(venta);

                eventos.forEach((evento) => {
                    if (!evento.fecha) {
                        return;
                    }

                    if (!mapaDias[evento.fecha]) {
                        mapaDias[evento.fecha] = {
                            documentos: {}
                        };
                    }

                    const docEntry = {
                        ven_codigo: venta.ven_codigo,
                        tipoEvento: evento.tipo,
                        eventoTexto: evento.eventoTexto,
                        venta: venta
                    };

                    mapaDias[evento.fecha].documentos[venta.ven_codigo] = docEntry;
                });
            });

            const fechas = this.listarFechasDelRango();
            const hoy = this.formatearFechaISO(new Date());

            return fechas.map((fecha) => {
                const datosDia = mapaDias[fecha] || {
                    documentos: {}
                };

                const documentosDia = [];
                let creados = 0;
                let enProceso = 0;
                let impresos = 0;
                let despachados = 0;
                let subidaCodigos = 0;
                let empacados = 0;
                let escaneos = 0;

                Object.keys(datosDia.documentos).forEach((claveDocumento) => {
                    const documento = datosDia.documentos[claveDocumento];
                    if (!documento) {
                        return;
                    }

                    documentosDia.push(documento);

                    if (documento.tipoEvento === 'creado') creados += 1;
                    if (documento.tipoEvento === 'enProceso') enProceso += 1;
                    if (documento.tipoEvento === 'impreso') impresos += 1;
                    if (documento.tipoEvento === 'despachado') despachados += 1;
                    if (documento.tipoEvento === 'subidaCodigos') subidaCodigos += 1;
                    if (documento.tipoEvento === 'empacado') empacados += 1;
                    if (documento.tipoEvento === 'escaneo') escaneos += 1;
                });

                const tieneActividad = creados > 0 || enProceso > 0 || impresos > 0 || despachados > 0 || subidaCodigos > 0 || empacados > 0 || escaneos > 0;
                
                // Obtener nombre del día
                const d = new Date(fecha + 'T12:00:00');
                const diasSemana = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
                const nombreDia = diasSemana[d.getDay()];

                return {
                    fecha: fecha,
                    etiqueta: this.formatearEtiquetaDia(fecha),
                    nombreDia: nombreDia,
                    creados: creados,
                    enProceso: enProceso,
                    impresos: impresos,
                    despachados: despachados,
                    subidaCodigos: subidaCodigos,
                    empacados: empacados,
                    escaneos: escaneos,
                    documentos: documentosDia,
                    tieneActividad: tieneActividad,
                    esHoy: fecha === hoy
                };
            });
        },
        trazabilidadItems() {
            return this.ventasNoAnuladas
                .map((venta) => {
                    const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                    const fechaCreado = this.normalizarFechaVenta(venta ? venta.ven_fecha : '');
                    const fechaEnProceso = venta && venta.fecha_en_proceso_bodega ? this.formatearFechaHoraVista(venta.fecha_en_proceso_bodega) : '-';
                    const fechaImpreso = venta && venta.fecha_impreso_bodega ? this.formatearFechaHoraVista(venta.fecha_impreso_bodega) : '-';
                    const fechaEmpacado = venta && venta.fecha_empaca ? this.formatearFechaHoraVista(venta.fecha_empaca) : '-';
                    const fechaSubidaCodigos = this.obtenerFechaSubidaCodigos(venta);
                    const fechaDespachado = venta && venta.fecha_proceso_despacho ? this.formatearFechaHoraVista(venta.fecha_proceso_despacho) : '-';
                    const usuarioCreado = venta && venta.usuario_creacion_nombre ? String(venta.usuario_creacion_nombre).trim() : '-';
                    const usuarioImpreso = venta && venta.usuario_impresion_nombre ? String(venta.usuario_impresion_nombre).trim() : '-';
                    const usuarioEmpacado = venta && venta.usuario_empaque_nombre ? String(venta.usuario_empaque_nombre).trim() : '-';
                    const usuarioDespachado = venta && venta.usuario_despacho_nombre ? String(venta.usuario_despacho_nombre).trim() : '-';
                    const rangoEscaneo = this.obtenerRangoEscaneoBodega(venta);
                    const fechaEscaneoInicio = rangoEscaneo.inicio;
                    const fechaEscaneoFin = rangoEscaneo.fin;
                    const duracionEscaneoDias = this.calcularDiasEntreFechas(fechaEscaneoInicio, fechaEscaneoFin);
                    const fechaComparacionOrigen = this.obtenerFechaFaseTrazabilidad(venta, this.faseComparacionOrigen);
                    const fechaComparacionDestino = this.obtenerFechaFaseTrazabilidad(venta, this.faseComparacionDestino);
                    const diasComparacion = this.calcularDiasEntreFechas(fechaComparacionOrigen, fechaComparacionDestino);

                    let fechasEscaneo = [];
                    const escaneos = this.obtenerEscaneosBodega(venta);
                    if (Array.isArray(escaneos) && escaneos.length > 0) {
                        fechasEscaneo = escaneos.map((e) => {
                            const fechaInicio = e && e.fecha_inicio ? this.formatearFechaHoraVista(e.fecha_inicio) : null;
                            if (!fechaInicio) {
                                return null;
                            }

                            return {
                                id: e && e.id != null ? e.id : null,
                                fechaInicio: fechaInicio,
                                fechaFin: e && e.fecha_fin ? this.formatearFechaHoraVista(e.fecha_fin) : '-',
                                nombreUsuario: e && e.nombre_usuario ? e.nombre_usuario : '-',
                                usuarioId: e && e.usuario_id != null ? e.usuario_id : null,
                                estado: e && e.estado != null ? e.estado : null,
                                codigosSubidos: e && e.codigos_subidos != null ? e.codigos_subidos : 0,
                                observaciones: e && e.observaciones ? e.observaciones : '-',
                            };
                        }).filter((f) => f != null);
                    }

                    const responsablesEscaneo = fechasEscaneo
                        .map((e) => (e && e.nombreUsuario ? String(e.nombreUsuario).trim() : ''))
                        .filter((nombre) => nombre && nombre !== '-')
                        .filter((nombre, index, arr) => arr.indexOf(nombre) === index)
                        .join(', ');

                    return {
                        ven_codigo: venta.ven_codigo,
                        id_empresa: venta.id_empresa,
                        empresa: venta.id_empresa,
                        venta: venta,
                        estadoCodigo: estado,
                        estadoTexto: this.obtenerTextoEstado(estado),
                        fechaCreado: fechaCreado ? fechaCreado : '-',
                        fechaEnProceso: fechaEnProceso,
                        fechaImpreso: fechaImpreso,
                        fechaEmpacado: fechaEmpacado,
                        fechaSubidaCodigos: fechaSubidaCodigos,
                        fechaDespachado: fechaDespachado,
                        usuarioCreado: usuarioCreado && usuarioCreado.length > 0 ? usuarioCreado : '-',
                        usuarioImpreso: usuarioImpreso && usuarioImpreso.length > 0 ? usuarioImpreso : '-',
                        usuarioEmpacado: usuarioEmpacado && usuarioEmpacado.length > 0 ? usuarioEmpacado : '-',
                        usuarioDespachado: usuarioDespachado && usuarioDespachado.length > 0 ? usuarioDespachado : '-',
                        responsablesEscaneo: responsablesEscaneo && responsablesEscaneo.length > 0 ? responsablesEscaneo : '-',
                        fechaEscaneoInicio: fechaEscaneoInicio,
                        fechaEscaneoFin: fechaEscaneoFin,
                        duracionEscaneoDias: duracionEscaneoDias,
                        fechaComparacionOrigen: fechaComparacionOrigen,
                        fechaComparacionDestino: fechaComparacionDestino,
                        diasComparacion: diasComparacion,
                        tieneComparacion: diasComparacion !== null,
                        fechasEscaneo: fechasEscaneo,
                        leadTimeDias: this.calcularLeadTimeDias(venta)
                    };
                })
                .sort((a, b) => {
                    if (a.ven_codigo > b.ven_codigo) return -1;
                    if (a.ven_codigo < b.ven_codigo) return 1;
                    return 0;
                });
        },
        trazabilidadItemsFiltrados() {
            const textoBusqueda = this.busquedaTrazabilidad && this.busquedaTrazabilidad.trim().length > 0 ? this.busquedaTrazabilidad.trim().toLowerCase() : '';

            return this.trazabilidadItems.filter((item) => {
                if (this.filtroKpiTrazabilidad === 'impreso' && item.fechaImpreso === '-') {
                    return false;
                }
                if (this.filtroKpiTrazabilidad === 'subida' && item.fechaSubidaCodigos === '-') {
                    return false;
                }
                if (this.filtroKpiTrazabilidad === 'empacado' && item.fechaEmpacado === '-') {
                    return false;
                }
                if (this.filtroKpiTrazabilidad === 'despachado' && item.fechaDespachado === '-') {
                    return false;
                }
                if (this.filtroKpiTrazabilidad === 'comparacion' && !item.tieneComparacion) {
                    return false;
                }

                if (!this.cumpleFiltroColor(item)) {
                    return false;
                }

                if (!textoBusqueda) {
                    return true;
                }

                const codigo = item && item.ven_codigo != null ? String(item.ven_codigo).toLowerCase() : '';
                const estado = item && item.estadoTexto != null ? String(item.estadoTexto).toLowerCase() : '';
                return codigo.indexOf(textoBusqueda) > -1 || estado.indexOf(textoBusqueda) > -1;
            });
        },
        metricas() {
            let rapidos = 0;
            let normales = 0;
            let lentos = 0;
            let totalDias = 0;
            let contadorDespachados = 0;

            this.ventasNoAnuladas.forEach((venta) => {
                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                if (estado !== 1) return;

                const dias = this.calcularLeadTimeDiasNumerico(venta);
                if (dias === null) return;

                totalDias += dias;
                contadorDespachados += 1;

                if (dias <= 3) {
                    rapidos += 1;
                } else if (dias <= 7) {
                    normales += 1;
                } else {
                    lentos += 1;
                }
            });

            const promedio = contadorDespachados > 0 ? (totalDias / contadorDespachados).toFixed(1) : '0.0';

            return {
                rapidos: rapidos,
                normales: normales,
                lentos: lentos,
                promedio: promedio,
                total: contadorDespachados
            };
        }
    },
    mounted() {
        if (!this.filtroColorTrazabilidad) {
            this.filtroColorTrazabilidad = 'todos';
        }
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.cargarPanel();
    },
    methods: {
        esFiltroColorActivo(tipo) {
            const filtroActual = this.filtroColorTrazabilidad && this.filtroColorTrazabilidad.length > 0 ? this.filtroColorTrazabilidad : 'todos';
            return filtroActual === tipo;
        },
        cambiarRango(rango) {
            this.rangoActivo = rango;
            this.cargarPanel();
        },
        aplicarRangoManual() {
            if (!this.rangoManual.desde || !this.rangoManual.hasta) {
                this.$vs.notify({
                    title: 'Rango incompleto',
                    text: 'Seleccione fecha desde y hasta.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }
            this.rangoActivo = 'manual';
            this.cargarPanel();
        },
        abrirModuloDespachos() {
            localStorage.setItem('bodegaSelectedTab', 'PerseoDespachos');
            this.$router.push('/home/bodega');
        },
        verPDFDocumento(item) {
            const ventaBase = item && item.venta ? item.venta : item;
            let ventaCompleta = ventaBase;

            if (this.ventas && Array.isArray(this.ventas) && ventaBase && ventaBase.ven_codigo) {
                const encontrada = this.ventas.find((v) => {
                    if (!v || v.ven_codigo !== ventaBase.ven_codigo) {
                        return false;
                    }
                    if (ventaBase.id_empresa != null) {
                        return String(v.id_empresa) === String(ventaBase.id_empresa);
                    }
                    return true;
                });

                if (encontrada) {
                    ventaCompleta = encontrada;
                }
            }

            this.ventaSeleccionada = {
                ...ventaCompleta,
                id_empresa: ventaCompleta && ventaCompleta.id_empresa != null ? ventaCompleta.id_empresa : (item && item.id_empresa != null ? item.id_empresa : null),
                empresa: ventaCompleta && ventaCompleta.id_empresa != null ? ventaCompleta.id_empresa : (item && item.id_empresa != null ? item.id_empresa : null)
            };
            this.popupPDF = true;
        },
        obtenerRangoFechas() {
            const hoy = new Date();
            const fechaInicio = new Date(hoy);
            const fechaFin = new Date(hoy);

            if (this.rangoActivo === 'semana') {
                const dia = hoy.getDay();
                const ajuste = dia === 0 ? 6 : dia - 1;
                fechaInicio.setDate(hoy.getDate() - ajuste);
                fechaFin.setDate(fechaInicio.getDate() + 6);
            }

            if (this.rangoActivo === 'mes') {
                fechaInicio.setDate(1);
                fechaFin.setMonth(fechaInicio.getMonth() + 1);
                fechaFin.setDate(0);
            }

            if (this.rangoActivo === 'manual' && this.rangoManual.desde && this.rangoManual.hasta) {
                return {
                    desde: this.rangoManual.desde,
                    hasta: this.rangoManual.hasta
                };
            }

            return {
                desde: this.formatearFechaISO(fechaInicio),
                hasta: this.formatearFechaISO(fechaFin)
            };
        },
        formatearFechaISO(fecha) {
            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            return anio + '-' + mes + '-' + dia;
        },
        formatearFechaHoraLocal(fecha) {
            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const hora = String(fecha.getHours()).padStart(2, '0');
            const minuto = String(fecha.getMinutes()).padStart(2, '0');
            return anio + '-' + mes + '-' + dia + 'T' + hora + ':' + minuto;
        },
        formatearFechaHoraVista(valor) {
            if (!valor) return '';
            const texto = String(valor).replace('T', ' ');
            return texto.substring(0, 16);
        },
        formatearFechaResponsable(fecha, responsable) {
            const fechaTexto = fecha && fecha !== '-' ? String(fecha).trim() : '-';
            const responsableTexto = responsable ? String(responsable).trim() : '';

            if (fechaTexto === '-' || responsableTexto === '' || responsableTexto === '-') {
                return fechaTexto;
            }

            return fechaTexto + ' | ' + responsableTexto;
        },
        normalizarFechaVenta(fechaVenta) {
            if (!fechaVenta) return '';

            const texto = String(fechaVenta);
            if (texto.length >= 10 && texto.indexOf('-') > -1) {
                return texto.substring(0, 10);
            }
            if (texto.length === 8) {
                const anio = texto.substring(0, 4);
                const mes = texto.substring(4, 6);
                const dia = texto.substring(6, 8);
                return anio + '-' + mes + '-' + dia;
            }
            return texto;
        },
        formatearEtiquetaDia(fechaISO) {
            if (!fechaISO || fechaISO.length < 10) return fechaISO;
            const dia = fechaISO.substring(8, 10);
            const mes = fechaISO.substring(5, 7);
            return dia + '/' + mes;
        },
        getLimiteDocumentosVisibles() {
            if (this.rangoActivo === 'hoy') {
                return 14;
            }
            if (this.rangoActivo === 'semana') {
                return 10;
            }
            if (this.rangoActivo === 'manual') {
                return 10;
            }
            return 8;
        },
        listarFechasDelRango() {
            if (!this.rangoConsultado.desde || !this.rangoConsultado.hasta) return [];

            const lista = [];
            const inicio = new Date(this.rangoConsultado.desde + 'T00:00:00');
            const fin = new Date(this.rangoConsultado.hasta + 'T00:00:00');

            let cursor = new Date(inicio);
            while (cursor <= fin) {
                lista.push(this.formatearFechaISO(cursor));
                cursor.setDate(cursor.getDate() + 1);
            }
            return lista;
        },
        extraerFechaAgenda(valor) {
            if (!valor) return '';
            const texto = String(valor);
            if (texto.length >= 10) {
                return texto.substring(0, 10);
            }
            return '';
        },
        extraerHoraAgenda(valor) {
            if (!valor) return '';
            const texto = String(valor).replace('T', ' ');
            if (texto.length >= 16) {
                return texto.substring(11, 16);
            }
            return '';
        },
        cargarPanel() {
            let me = this;
            const rango = me.obtenerRangoFechas();
            me.rangoConsultado = rango;

            me.$vs.loading();

            const url = me.$server_url + 'api/perseo/ventas/por-despachar?fecha_desde=' + rango.desde + '&fecha_hasta=' + rango.hasta + '&solo_enviado_perseo=1';
            me.$http.get(url)
                .then(function(res) {
                    me.$vs.loading.close();
                    if (res.data && res.data.status === 200) {
                        me.ventas = res.data.data && Array.isArray(res.data.data) ? res.data.data : [];
                        me.generarResumen();
                    } else {
                        me.ventas = [];
                        me.generarResumen();
                        me.$f_notificacion('No se pudieron cargar datos del panel', 'warning', 'icon-alert-triangle');
                    }
                })
                .catch(function() {
                    me.$vs.loading.close();
                    me.ventas = [];
                    me.generarResumen();
                    me.$f_notificacion('Error al cargar datos del panel', 'danger', 'icon-x');
                });
        },
        iniciarArrastreVenta(venta) {
            const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;

            if (estado !== 2) {
                this.arrastreVenta = null;
                return;
            }

            this.arrastreVenta = venta;
        },
        finalizarArrastreVenta() {
            this.arrastreVenta = null;
            this.diaAgendaActivo = '';
            this.esZonaProcesoActiva = false;
        },
        marcarDiaAgenda(fecha, activo) {
            if (this.arrastreVenta) {
                this.diaAgendaActivo = activo ? fecha : '';
            }
        },
        soltarEnDiaAgenda(dia) {
            const venta = this.arrastreVenta;
            this.finalizarArrastreVenta();

            if (!venta) {
                return;
            }

            this.programarVentaEnAgenda(venta, dia.fecha + 'T08:00');
        },
        marcarZonaProceso(activo) {
            if (this.arrastreVenta) {
                this.esZonaProcesoActiva = activo;
            }
        },
        soltarEnProceso() {
            const venta = this.arrastreVenta;
            this.finalizarArrastreVenta();

            if (!venta) {
                return;
            }

            const hoy = this.formatearFechaISO(new Date());
            this.programarVentaEnAgenda(venta, hoy + 'T08:00');
        },
        abrirAgendaBodega(venta, fechaAgenda) {
            this.ventaAgendaSeleccionada = venta;
            this.popupAgendaBodega = true;
            this.fechaHoraAgenda = fechaAgenda + 'T08:00';
        },
        cerrarAgendaBodega() {
            this.popupAgendaBodega = false;
            this.ventaAgendaSeleccionada = null;
            this.fechaHoraAgenda = '';
            this.diaAgendaActivo = '';
        },
        confirmarAgendaBodega() {
            if (!this.ventaAgendaSeleccionada) {
                this.$f_notificacion('Seleccione una venta para agendar', 'warning', 'icon-alert-triangle');
                return;
            }

            if (!this.fechaHoraAgenda) {
                this.$f_notificacion('Debe elegir fecha y hora de agenda', 'warning', 'icon-alert-triangle');
                return;
            }

            this.programarVentaEnAgenda(this.ventaAgendaSeleccionada, this.fechaHoraAgenda);
        },
        programarVentaEnAgenda(venta, fechaHoraAgenda) {
            let me = this;
            const fechaAgendaBodega = String(fechaHoraAgenda).replace('T', ' ') + ':00';

            if (!me.usuario || !me.usuario.idusuario) {
                me.$f_notificacion('No se pudo identificar el usuario de bodega', 'warning', 'icon-alert-triangle');
                return;
            }

            let datos = {
                ven_codigo: venta.ven_codigo,
                est_ven_codigo: 4,
                id_empresa: venta.id_empresa,
                empresa: venta.id_empresa,
                user_despacha: me.usuario.idusuario,
                fecha_agenda_bodega: fechaAgendaBodega
            };

            me.$vs.loading();
            this.$http.post(this.$server_url + 'Desactivar_venta', datos)
                .then(function(res) {
                    me.$vs.loading.close();

                    if (res.data && res.data.status == 0) {
                        me.$f_notificacion(res.data.message ? res.data.message : 'No se pudo agendar la venta', 'danger', 'icon-x');
                        return;
                    }

                    me.$f_notificacion('Venta agendada para proceso de bodega', 'success', 'icon-check', 3000);
                    me.cerrarAgendaBodega();
                    me.cargarPanel();
                })
                .catch(function(err) {
                    me.$vs.loading.close();
                    let mensaje = 'Error al agendar la venta';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }
                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
        generarResumen() {
            this.resumen = {
                total: 0,
                pendiente: 0,
                enProceso: 0,
                despachado: 0,
                tareasActivas: 0
            };

            const agrupado = {};

            if (this.ventasNoAnuladas && Array.isArray(this.ventasNoAnuladas)) {
                this.resumen.total = this.ventasNoAnuladas.length;

                this.ventasNoAnuladas.forEach((venta) => {
                    const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                    const fechaAgenda = this.extraerFechaAgenda(venta ? venta.fecha_agenda_bodega : '');

                    if (estado === 2) {
                        this.resumen.pendiente += 1;
                    } else if (estado === 4) {
                        this.resumen.enProceso += 1;
                    } else if (estado === 1) {
                        this.resumen.despachado += 1;
                    }
                });
            }

            this.resumen.tareasActivas = this.resumen.pendiente + this.resumen.enProceso;

            this.resumenPorDia = Object.keys(agrupado)
                .map((clave) => {
                    agrupado[clave].tareasActivas = agrupado[clave].enProceso;
                    return agrupado[clave];
                })
                .sort((a, b) => {
                    if (a.fecha > b.fecha) return -1;
                    if (a.fecha < b.fecha) return 1;
                    return 0;
                });
        },
        calcularLeadTimeDias(venta) {
            const fechaInicioTexto = this.normalizarFechaVenta(venta ? venta.ven_fecha : '');
            if (!fechaInicioTexto) {
                return '-';
            }

            const fechaInicio = new Date(fechaInicioTexto + 'T00:00:00');
            let fechaFin = null;

            if (venta && venta.fecha_proceso_despacho) {
                const fechaProcesoTexto = this.extraerFechaAgenda(venta.fecha_proceso_despacho);
                if (fechaProcesoTexto) {
                    fechaFin = new Date(fechaProcesoTexto + 'T00:00:00');
                }
            }

            if (!fechaFin && venta && venta.fecha_agenda_bodega) {
                const fechaAgendaTexto = this.extraerFechaAgenda(venta.fecha_agenda_bodega);
                if (fechaAgendaTexto) {
                    fechaFin = new Date(fechaAgendaTexto + 'T00:00:00');
                }
            }

            if (!fechaFin) {
                fechaFin = new Date();
            }

            const milisegundos = fechaFin.getTime() - fechaInicio.getTime();
            if (isNaN(milisegundos)) {
                return '-';
            }

            const dias = Math.floor(milisegundos / 86400000);
            return dias >= 0 ? dias : 0;
        },
        verDetalleDocumento(doc) {
            const venta = doc && doc.venta ? doc.venta : doc;
            this.abrirDetalleDocumento(venta);
        },
        abrirDetalleDocumentoDesdeLista(doc) {
            const venta = doc && doc.venta ? doc.venta : doc;
            this.popupAperturaDocumentos = false;
            this.$nextTick(() => {
                this.abrirDetalleDocumento(venta);
            });
        },
        abrirPdfDesdeLista(doc) {
            const venta = doc && doc.venta ? doc.venta : doc;
            this.popupAperturaDocumentos = false;
            this.$nextTick(() => {
                this.verPDFDocumento(venta);
            });
        },
        abrirDetalleDocumento(venta) {
            if (!venta || !venta.ven_codigo) {
                return;
            }

            this.popupDetalleDocumento = true;
            this.tabDetalleDocumento = 'ventas';
            this.detalleDocumentoCargando = true;
            this.detalleDocumentoError = '';
            this.detalleDocumentoData = {
                venta: venta,
                venta_empacado: null,
                detalle_venta: [],
                codigos_agrupados: [],
                totales: {
                    vendido: 0,
                    despachado: 0,
                    devuelto: 0,
                    saldo: 0
                }
            };
            this.detalleDocumentoResumen = {
                fechaCreado: this.normalizarFechaVenta(venta.ven_fecha) ? this.normalizarFechaVenta(venta.ven_fecha) : '-',
                fechaImpreso: venta.fecha_impreso_bodega ? this.formatearFechaHoraVista(venta.fecha_impreso_bodega) : '-',
                fechaSubidaCodigos: this.obtenerFechaSubidaCodigos(venta),
                fechaEmpacado: venta.fecha_empaca ? this.formatearFechaHoraVista(venta.fecha_empaca) : '-',
                fechaEnProceso: venta.fecha_en_proceso_bodega ? this.formatearFechaHoraVista(venta.fecha_en_proceso_bodega) : '-',
                fechaDespachado: venta.fecha_proceso_despacho ? this.formatearFechaHoraVista(venta.fecha_proceso_despacho) : '-'
            };

            this.$http.get(this.$server_url + 'api/perseo/ventas-lista/detalle-venta?ven_codigo=' + encodeURIComponent(venta.ven_codigo))
                .then((res) => {
                    this.detalleDocumentoCargando = false;

                    if (!res.data || res.data.status !== 'success') {
                        this.detalleDocumentoError = res.data && res.data.message ? res.data.message : 'No se pudo cargar el detalle del documento';
                        return;
                    }

                    const detalleVenta = res.data.detalle_venta && Array.isArray(res.data.detalle_venta) ? res.data.detalle_venta : (res.data.data && Array.isArray(res.data.data) ? res.data.data : []);
                    const codigosAgrupados = res.data.codigos_agrupados && Array.isArray(res.data.codigos_agrupados) ? res.data.codigos_agrupados : [];
                    const totales = res.data.totales ? res.data.totales : { vendido: 0, despachado: 0, devuelto: 0, saldo: 0 };
                    const ventaDetalle = res.data.venta ? res.data.venta : venta;
                    const ventaEmpacado = res.data.venta_empacado ? res.data.venta_empacado : null;

                    this.detalleDocumentoData = {
                        venta: ventaDetalle,
                        venta_empacado: ventaEmpacado,
                        detalle_venta: detalleVenta,
                        codigos_agrupados: codigosAgrupados,
                        totales: totales
                    };

                    this.detalleDocumentoResumen = {
                        fechaCreado: this.normalizarFechaVenta(ventaDetalle && ventaDetalle.ven_fecha ? ventaDetalle.ven_fecha : venta.ven_fecha) ? this.normalizarFechaVenta(ventaDetalle && ventaDetalle.ven_fecha ? ventaDetalle.ven_fecha : venta.ven_fecha) : '-',
                        fechaImpreso: ventaDetalle && ventaDetalle.fecha_impreso_bodega ? this.formatearFechaHoraVista(ventaDetalle.fecha_impreso_bodega) : '-',
                        fechaSubidaCodigos: this.obtenerFechaSubidaCodigos(ventaDetalle),
                        fechaEmpacado: ventaEmpacado && ventaEmpacado.fecha_empaca ? this.formatearFechaHoraVista(ventaEmpacado.fecha_empaca) : (ventaDetalle && ventaDetalle.fecha_empaca ? this.formatearFechaHoraVista(ventaDetalle.fecha_empaca) : '-'),
                        fechaEnProceso: ventaDetalle && ventaDetalle.fecha_en_proceso_bodega ? this.formatearFechaHoraVista(ventaDetalle.fecha_en_proceso_bodega) : '-',
                        fechaDespachado: ventaDetalle && ventaDetalle.fecha_proceso_despacho ? this.formatearFechaHoraVista(ventaDetalle.fecha_proceso_despacho) : '-'
                    };
                })
                .catch((err) => {
                    this.detalleDocumentoCargando = false;
                    this.detalleDocumentoError = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Error al cargar el detalle del documento';
                });
        },
        verDocumentosDia(dia) {
            this.diaDocumentosSeleccionado = dia;
            this.popupAperturaDocumentos = true;
        },
        obtenerDocumentosUnicos(documentos) {
            if (!documentos || !Array.isArray(documentos)) {
                return [];
            }
            const mapaCodigos = {};
            documentos.forEach((doc) => {
                const codigo = doc && doc.ven_codigo ? doc.ven_codigo : '';
                if (codigo) {
                    mapaCodigos[codigo] = doc;
                }
            });
            return Object.keys(mapaCodigos).map((codigo) => mapaCodigos[codigo]);
        },
        abrirDetalleEscaneo(item, indexEscaneo) {
            if (!item || !item.fechasEscaneo || !Array.isArray(item.fechasEscaneo)) {
                return;
            }

            if (indexEscaneo == null || indexEscaneo < 0 || indexEscaneo >= item.fechasEscaneo.length) {
                return;
            }

            this.escaneoDetalleSeleccionado = item.fechasEscaneo[indexEscaneo];
            this.documentoEscaneoSeleccionado = item && item.ven_codigo ? item.ven_codigo : '';
            this.popupDetalleEscaneo = true;
        },
        cerrarDetalleEscaneo() {
            this.popupDetalleEscaneo = false;
            this.escaneoDetalleSeleccionado = null;
            this.documentoEscaneoSeleccionado = '';
        },
        getColorChipEvento(tipoEvento) {
            if (tipoEvento === 'creado') return 'primary';
            if (tipoEvento === 'subidaCodigos') return 'dark';
            if (tipoEvento === 'enProceso') return 'warning';
            if (tipoEvento === 'empacado') return 'dark';
            if (tipoEvento === 'impreso') return 'danger';
            if (tipoEvento === 'despachado') return 'success';
            return 'dark';
        },
        getColorEstadoEscaneo(estado) {
            const valor = estado != null ? parseInt(estado, 10) : 0;
            if (valor === 1) return 'warning';
            if (valor === 2) return 'success';
            return 'primary';
        },
        getTextoEstadoEscaneo(estado) {
            const valor = estado != null ? parseInt(estado, 10) : 0;
            if (valor === 1) return 'En proceso';
            if (valor === 2) return 'Finalizado';
            return 'Registrado';
        },
        obtenerTextoEstado(codigo) {
            const estado = parseInt(codigo, 10);
            if (estado === 1) return 'Despachado';
            if (estado === 2) return 'Pendiente';
            if (estado === 3) return 'Anulado';
            if (estado === 4) return 'En proceso';
            return 'Desconocido';
        },
        obtenerEscaneosBodega(venta) {
            if (!venta || !venta.escaneos_bodega) {
                return [];
            }

            let escaneos = venta.escaneos_bodega;
            if (typeof escaneos === 'string') {
                try {
                    escaneos = JSON.parse(escaneos);
                } catch (e) {
                    escaneos = [];
                }
            }

            if (!Array.isArray(escaneos)) {
                return [];
            }

            return escaneos;
        },
        obtenerFechaSubidaCodigos(venta) {
            if (venta && venta.fecha_subida_codigos) {
                return this.formatearFechaHoraVista(venta.fecha_subida_codigos);
            }

            const escaneos = this.obtenerEscaneosBodega(venta);
            if (!escaneos || escaneos.length === 0) {
                return '-';
            }

            let fechaMinima = '';
            escaneos.forEach((escaneo) => {
                if (escaneo && escaneo.fecha_inicio) {
                    const fecha = this.formatearFechaHoraVista(escaneo.fecha_inicio);
                    if (fecha && (fechaMinima === '' || fecha < fechaMinima)) {
                        fechaMinima = fecha;
                    }
                }
            });

            return fechaMinima !== '' ? fechaMinima : '-';
        },
        obtenerRangoEscaneoBodega(venta) {
            const escaneos = this.obtenerEscaneosBodega(venta);
            if (!escaneos || !Array.isArray(escaneos) || escaneos.length === 0) {
                return {
                    inicio: '-',
                    fin: '-'
                };
            }

            let inicio = '';
            let fin = '';

            escaneos.forEach((escaneo) => {
                const fechaInicio = escaneo && escaneo.fecha_inicio ? this.formatearFechaHoraVista(escaneo.fecha_inicio) : '';
                const fechaFin = escaneo && escaneo.fecha_fin ? this.formatearFechaHoraVista(escaneo.fecha_fin) : '';

                if (fechaInicio && (inicio === '' || fechaInicio < inicio)) {
                    inicio = fechaInicio;
                }

                if (fechaFin && (fin === '' || fechaFin > fin)) {
                    fin = fechaFin;
                }

                if (!fechaFin && fechaInicio && (fin === '' || fechaInicio > fin)) {
                    fin = fechaInicio;
                }
            });

            return {
                inicio: inicio !== '' ? inicio : '-',
                fin: fin !== '' ? fin : '-'
            };
        },
        obtenerEtiquetaFaseTrazabilidad(fase) {
            if (fase === 'creado') return 'Creado';
            if (fase === 'impreso') return 'Impresión';
            if (fase === 'subidaCodigos') return 'Subida códigos';
            if (fase === 'escaneoInicio') return 'Escaneo inicio';
            if (fase === 'escaneoFin') return 'Escaneo fin';
            if (fase === 'empacado') return 'Empacado';
            if (fase === 'enProceso') return 'En proceso';
            if (fase === 'despachado') return 'Despachado';
            return 'Fase';
        },
        obtenerFechaFaseTrazabilidad(venta, fase) {
            if (!venta) {
                return '';
            }

            if (fase === 'creado') {
                return this.extraerFechaAgenda(venta.ven_fecha);
            }

            if (fase === 'impreso') {
                return this.extraerFechaAgenda(venta.fecha_impreso_bodega);
            }

            if (fase === 'subidaCodigos') {
                return this.obtenerFechaSubidaCodigos(venta);
            }

            if (fase === 'escaneoInicio') {
                const rangoEscaneo = this.obtenerRangoEscaneoBodega(venta);
                return rangoEscaneo && rangoEscaneo.inicio ? rangoEscaneo.inicio : '-';
            }

            if (fase === 'escaneoFin') {
                const rangoEscaneo = this.obtenerRangoEscaneoBodega(venta);
                return rangoEscaneo && rangoEscaneo.fin ? rangoEscaneo.fin : '-';
            }

            if (fase === 'empacado') {
                return this.extraerFechaAgenda(venta.fecha_empaca);
            }

            if (fase === 'enProceso') {
                return this.extraerFechaAgenda(venta.fecha_en_proceso_bodega);
            }

            if (fase === 'despachado') {
                return this.extraerFechaAgenda(venta.fecha_proceso_despacho);
            }

            return '';
        },
        intercambiarFasesComparacion() {
            const origen = this.faseComparacionOrigen;
            this.faseComparacionOrigen = this.faseComparacionDestino;
            this.faseComparacionDestino = origen;
        },
        aplicarComparacionFases() {
            this.filtroKpiTrazabilidad = 'todos';
        },
        obtenerEventosTrazabilidad(venta) {
            const eventos = [];
            const fechaCreado = this.extraerFechaAgenda(venta.ven_fecha);
            if (fechaCreado) {
                eventos.push({ fecha: fechaCreado, tipo: 'creado', eventoTexto: 'Creado' });
            }

            const fechaImpreso = this.extraerFechaAgenda(venta.fecha_impreso_bodega);
            if (fechaImpreso) {
                eventos.push({ fecha: fechaImpreso, tipo: 'impreso', eventoTexto: 'Impreso' });
            }

            const fechaSubidaCodigos = this.obtenerFechaSubidaCodigos(venta);
            if (fechaSubidaCodigos && fechaSubidaCodigos !== '-') {
                eventos.push({ fecha: fechaSubidaCodigos.substring(0, 10), tipo: 'subidaCodigos', eventoTexto: 'Subida códigos' });
            }

            const fechaEmpacado = this.extraerFechaAgenda(venta.fecha_empaca);
            if (fechaEmpacado) {
                eventos.push({ fecha: fechaEmpacado, tipo: 'empacado', eventoTexto: 'Empacado' });
            }

            const fechaEnProceso = this.extraerFechaAgenda(venta.fecha_en_proceso_bodega);
            if (fechaEnProceso) {
                eventos.push({ fecha: fechaEnProceso, tipo: 'enProceso', eventoTexto: 'En proceso' });
            }

            const fechaDespachado = this.extraerFechaAgenda(venta.fecha_proceso_despacho);
            if (fechaDespachado && venta.est_ven_codigo == 1) {
                eventos.push({ fecha: fechaDespachado, tipo: 'despachado', eventoTexto: 'Despachado' });
            }

            const escaneos = this.obtenerEscaneosBodega(venta);
            if (Array.isArray(escaneos) && escaneos.length > 0) {
                escaneos.forEach((escaneo) => {
                    if (escaneo && escaneo.fecha_inicio) {
                        const fechaEscaneo = this.extraerFechaAgenda(escaneo.fecha_inicio);
                        if (fechaEscaneo) {
                            eventos.push({ fecha: fechaEscaneo, tipo: 'escaneo', eventoTexto: 'Escaneo' });
                        }
                    }
                });
            }

            return eventos;
        },
        getColorEstadoChip(codigo) {
            const estado = parseInt(codigo, 10);
            if (estado === 1) return 'success';
            if (estado === 2) return 'warning';
            if (estado === 3) return 'danger';
            if (estado === 4) return 'primary';
            return 'dark';
        },
        calcularLeadTimeDiasNumerico(venta) {
            const fechaInicioTexto = this.normalizarFechaVenta(venta ? venta.ven_fecha : '');
            if (!fechaInicioTexto) {
                return null;
            }

            const fechaInicio = new Date(fechaInicioTexto + 'T00:00:00');
            let fechaFin = null;

            if (venta && venta.fecha_proceso_despacho) {
                const fechaProcesoTexto = this.extraerFechaAgenda(venta.fecha_proceso_despacho);
                if (fechaProcesoTexto) {
                    fechaFin = new Date(fechaProcesoTexto + 'T00:00:00');
                }
            }

            if (!fechaFin) {
                return null;
            }

            const milisegundos = fechaFin.getTime() - fechaInicio.getTime();
            if (isNaN(milisegundos)) {
                return null;
            }

            const dias = Math.floor(milisegundos / 86400000);
            return dias >= 0 ? dias : 0;
        },
        getClaseLeadTime(dias) {
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                if (!match) return '';
                dias = parseInt(match[0], 10);
            }
            if (dias <= 3) return 'lead-time-excelente';
            if (dias <= 7) return 'lead-time-aceptable';
            return 'lead-time-lento';
        },
        getClaseRendimiento(dias) {
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                if (!match) return 'rendimiento-neutral';
                dias = parseInt(match[0], 10);
            }
            if (dias <= 3) return 'rendimiento-excelente';
            if (dias <= 7) return 'rendimiento-aceptable';
            return 'rendimiento-lento';
        },
        getTextoRendimiento(dias) {
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                if (!match) return '-';
                dias = parseInt(match[0], 10);
            }
            if (dias <= 3) return 'Excelente';
            if (dias <= 7) return 'Normal';
            return 'Lento';
        },
        calcularPorcentajeRendimiento(dias) {
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                if (!match) return 0;
                dias = parseInt(match[0], 10);
            }
            if (dias <= 3) return 100;
            if (dias <= 7) return 60;
            return 30;
        },
        calcularAlturaBarra(valor) {
            const max = Math.max(this.metricas.rapidos, this.metricas.normales, this.metricas.lentos, 1);
            return (valor / max) * 100;
        },
        calcularDiasEntreFechas(fechaInicioTexto, fechaFinTexto) {
            if (!fechaInicioTexto || !fechaFinTexto) {
                return null;
            }

            const inicioTexto = this.extraerFechaAgenda(fechaInicioTexto);
            const finTexto = this.extraerFechaAgenda(fechaFinTexto);
            if (!inicioTexto || !finTexto) {
                return null;
            }

            const inicio = new Date(inicioTexto + 'T00:00:00');
            const fin = new Date(finTexto + 'T00:00:00');

            if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
                return null;
            }

            const milisegundos = fin.getTime() - inicio.getTime();
            if (isNaN(milisegundos)) {
                return null;
            }

            const dias = Math.floor(milisegundos / 86400000);
            return dias >= 0 ? dias : 0;
        },
        calcularPorcentajeDistribucion(valor) {
            if (this.metricas.total === 0) return 0;
            return Math.round((valor / this.metricas.total) * 100);
        },
        calcularPorcentajeKpiTrazabilidad(valor) {
            const numero = parseFloat(valor);
            if (isNaN(numero) || numero <= 0) {
                return 0;
            }

            const maximo = this.maximoKpiTrazabilidad;
            return Math.min(100, Math.round((numero / maximo) * 100));
        },
        calcularPorcentajeComparacion(valor, total) {
            const cantidad = parseFloat(valor);
            const base = parseFloat(total);

            if (isNaN(cantidad) || isNaN(base) || base <= 0) {
                return 0;
            }

            return Math.min(100, Math.round((cantidad / base) * 100));
        },
        getNivelSemaforoComparacion(dias) {
            let valor = dias;
            if (typeof valor === 'string') {
                const match = valor.match(/\d+/);
                valor = match ? parseInt(match[0], 10) : null;
            }

            if (valor == null || isNaN(valor)) {
                return 'sin-dato';
            }

            if (valor <= 1) return 'verde';
            if (valor <= 3) return 'amarillo';
            return 'rojo';
        },
        getTextoSemaforoComparacion(dias) {
            const nivel = this.getNivelSemaforoComparacion(dias);
            if (nivel === 'verde') return 'Optimo';
            if (nivel === 'amarillo') return 'Atencion';
            if (nivel === 'rojo') return 'Critico';
            return 'Sin dato';
        },
        getColorComparacionChip(dias) {
            const nivel = this.getNivelSemaforoComparacion(dias);
            if (nivel === 'verde') return 'success';
            if (nivel === 'amarillo') return 'warning';
            if (nivel === 'rojo') return 'danger';
            return 'dark';
        },
        getClaseBarraComparacion(dias) {
            const nivel = this.getNivelSemaforoComparacion(dias);
            if (nivel === 'verde') return 'comparacion-columna-barra-verde';
            if (nivel === 'amarillo') return 'comparacion-columna-barra-amarillo';
            if (nivel === 'rojo') return 'comparacion-columna-barra-rojo';
            return 'comparacion-columna-barra-gris';
        },
        calcularPorcentajeSemaforoComparacion(dias) {
            const valor = parseFloat(dias);
            if (isNaN(valor) || valor < 0) {
                return 0;
            }

            const maximo = this.maximoSemaforoComparacion;
            return Math.min(100, Math.round((valor / maximo) * 100));
        },
        getClaseComparacionFila(item) {
            if (!item || !item.tieneComparacion) {
                return 'trazabilidad-row-sin-dato';
            }

            const nivel = this.getNivelSemaforoComparacion(item.diasComparacion);
            if (nivel === 'verde') return 'trazabilidad-row-verde';
            if (nivel === 'amarillo') return 'trazabilidad-row-amarillo';
            if (nivel === 'rojo') return 'trazabilidad-row-rojo';
            return 'trazabilidad-row-sin-dato';
        },
        cumpleFiltroColor(item) {
            if (!this.filtroColorTrazabilidad || this.filtroColorTrazabilidad === 'todos') {
                return true;
            }

            let dias = item && item.leadTimeDias != null ? item.leadTimeDias : null;
            if (typeof dias === 'string') {
                const match = dias.match(/\d+/);
                dias = match ? parseInt(match[0], 10) : null;
            }

            if (typeof dias !== 'number' || isNaN(dias)) {
                return false;
            }

            if (this.filtroColorTrazabilidad === 'verde') {
                return dias <= 3;
            }
            if (this.filtroColorTrazabilidad === 'amarillo') {
                return dias > 3 && dias <= 7;
            }
            if (this.filtroColorTrazabilidad === 'rojo') {
                return dias > 7;
            }

            return true;
        },
        contarImpresos() {
            let contador = 0;
            this.ventasNoAnuladas.forEach((venta) => {
                if (venta && venta.impresion == 1 && venta.fecha_impreso_bodega) {
                    contador += 1;
                }
            });
            return contador;
        },
        obtenerUltimosDespachados() {
            return this.trazabilidadItems
                .filter((item) => {
                    return typeof item.leadTimeDias === 'number' && this.cumpleFiltroColor(item);
                })
                .reverse();
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

            const lista = this.obtenerUltimosDespachados();
            let maxDias = 14;

            lista.forEach((item) => {
                const valor = item && item.leadTimeDias != null ? item.leadTimeDias : null;
                if (typeof valor === 'number' && valor > maxDias) {
                    maxDias = valor;
                }
            });

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
            if (dias <= 3) return 'punto-excelente';
            if (dias <= 7) return 'punto-aceptable';
            return 'punto-lento';
        },
        
        // ==========================================
        // VALIDACIONES DE ANOMALÍAS EN FECHAS
        // ==========================================
        validarFechaImpreso(item) {
            // Si tiene escaneo, subida de códigos, empacado o despacho, DEBE tener impreso
            const tieneFasesPosteriores = 
                (item.fechaEscaneoInicio && item.fechaEscaneoInicio !== '-') ||
                (item.fechaSubidaCodigos && item.fechaSubidaCodigos !== '-') ||
                (item.fechaEmpacado && item.fechaEmpacado !== '-') ||
                (item.fechaDespachado && item.fechaDespachado !== '-');
            
            return tieneFasesPosteriores && (!item.fechaImpreso || item.fechaImpreso === '-');
        },
        
        validarFechaEscaneo(item) {
            // Si tiene subida de códigos, empacado o despacho, DEBE tener escaneo
            const tieneFasesPosteriores = 
                (item.fechaSubidaCodigos && item.fechaSubidaCodigos !== '-') ||
                (item.fechaEmpacado && item.fechaEmpacado !== '-') ||
                (item.fechaDespachado && item.fechaDespachado !== '-');
            
            const tieneEscaneo = 
                (item.fechaEscaneoInicio && item.fechaEscaneoInicio !== '-') ||
                (item.fechaEscaneoFin && item.fechaEscaneoFin !== '-');
            
            return tieneFasesPosteriores && !tieneEscaneo;
        },
        
        validarFechaSubidaCodigos(item) {
            // Si tiene empacado o despacho, DEBE tener subida de códigos
            const tieneFasesPosteriores = 
                (item.fechaEmpacado && item.fechaEmpacado !== '-') ||
                (item.fechaDespachado && item.fechaDespachado !== '-');
            
            return tieneFasesPosteriores && (!item.fechaSubidaCodigos || item.fechaSubidaCodigos === '-');
        },
        
        validarFechaEmpacado(item) {
            // Si tiene despacho, DEBE tener empacado
            const tieneDespacho = item.fechaDespachado && item.fechaDespachado !== '-';
            
            return tieneDespacho && (!item.fechaEmpacado || item.fechaEmpacado === '-');
        }
    }
};
</script>

<style scoped>
.panel-admin-bodega {
    padding: 12px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.panel-title {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.panel-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
}

.panel-header-actions {
    display: flex;
    gap: 8px;
}

.panel-rangos {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    border: 1px solid #dbeafe;
    background: #f8fbff;
    border-radius: 8px;
    padding: 10px;
}

.rango-btn {
    background: #e2e8f0;
    color: #334155;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.rango-btn-active {
    background: #046AE7;
    color: #ffffff;
    border-color: #046AE7;
}

.rango-detalle {
    margin-left: auto;
    font-size: 12px;
    color: #1e293b;
    font-weight: 600;
}

.panel-kpis {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
}

.kpi-card {
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.kpi-label {
    font-size: 12px;
    color: #475569;
    font-weight: 600;
}

.kpi-value {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
}

.kpi-total {
    background: #eff6ff;
    border-color: #bfdbfe;
}

.kpi-total .kpi-value {
    color: #046AE7;
}

.kpi-pendiente {
    background: #fffbeb;
    border-color: #fde68a;
}

.kpi-pendiente .kpi-value {
    color: #FF9F43;
}

.kpi-proceso {
    background: #eff6ff;
    border-color: #93c5fd;
}

.kpi-proceso .kpi-value {
    color: #046AE7;
}

.kpi-despachado {
    background: #ecfdf5;
    border-color: #a7f3d0;
}

.kpi-despachado .kpi-value {
    color: #28C76F;
}

.kpi-activo {
    background: #eef2ff;
    border-color: #c7d2fe;
}

.kpi-activo .kpi-value {
    color: #4338ca;
}

.panel-tabs {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    overflow: hidden;
}

.tabs-header {
    display: flex;
    border-bottom: 2px solid #e2e8f0;
    background: #f8fafc;
}

.tab-btn {
    flex: 1;
    padding: 14px 20px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tab-btn:hover {
    color: #334155;
    background: #f1f5f9;
}

.tab-btn-active {
    color: #046AE7;
    background: #ffffff;
    border-bottom-color: #046AE7;
}

.tab-btn i {
    font-size: 14px;
}

.tabs-content {
    padding: 20px;
}

.tab-panel {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.kanban-board-full {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.kanban-columna-full {
    border-radius: 10px;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    min-height: 500px;
}

.kanban-columna-pendiente {
    border: 2px solid #fde68a;
}

.kanban-columna-proceso {
    border: 2px solid #93c5fd;
}

.kanban-columna-despachado {
    border: 2px solid #a7f3d0;
}

.kanban-header-full {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.kanban-columna-pendiente .kanban-header-full {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.kanban-columna-proceso .kanban-header-full {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.kanban-columna-despachado .kanban-header-full {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.kanban-header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
}

.kanban-header-title i {
    font-size: 16px;
}

.kanban-columna-pendiente .kanban-header-title {
    color: #92400e;
}

.kanban-columna-proceso .kanban-header-title {
    color: #1e40af;
}

.kanban-columna-despachado .kanban-header-title {
    color: #065f46;
}

.kanban-header-count {
    background: #ffffff;
    color: #1e293b;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kanban-lista-full {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    max-height: 600px;
}

.kanban-card-full {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.kanban-card-full:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.kanban-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.kanban-card-codigo {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
}

.kanban-card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.kanban-card-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #64748b;
}

.kanban-card-info i {
    font-size: 10px;
    width: 14px;
}

.kanban-card-info-highlight {
    color: #1e40af;
    font-weight: 600;
}

.kanban-card-info-success {
    color: #065f46;
    font-weight: 600;
}

.calendario-container,
.trazabilidad-container {
    min-height: 400px;
}

.trazabilidad-header {
    margin-bottom: 16px;
}

.lead-time-badge {
    display: inline-block;
    background: #eff6ff;
    color: #1e40af;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
}

.lead-time-excelente {
    background: #d1fae5;
    color: #065f46;
}

.lead-time-aceptable {
    background: #fef3c7;
    color: #92400e;
}

.lead-time-lento {
    background: #fee2e2;
    color: #991b1b;
}

.metricas-rendimiento {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.metrica-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 10px;
    border: 2px solid;
    background: #ffffff;
}

.metrica-excelente {
    border-color: #86efac;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.metrica-aceptable {
    border-color: #fde68a;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.metrica-lento {
    border-color: #fca5a5;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.metrica-promedio {
    border-color: #93c5fd;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.metrica-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 20px;
}

.metrica-excelente .metrica-icon {
    background: #10b981;
    color: #ffffff;
}

.metrica-aceptable .metrica-icon {
    background: #f59e0b;
    color: #ffffff;
}

.metrica-lento .metrica-icon {
    background: #ef4444;
    color: #ffffff;
}

.metrica-promedio .metrica-icon {
    background: #3b82f6;
    color: #ffffff;
}

.metrica-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.metrica-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
}

.metrica-value {
    font-size: 28px;
    font-weight: 800;
    line-height: 1;
}

.metrica-excelente .metrica-value {
    color: #065f46;
}

.metrica-aceptable .metrica-value {
    color: #92400e;
}

.metrica-lento .metrica-value {
    color: #991b1b;
}

.metrica-promedio .metrica-value {
    color: #1e40af;
}

.metrica-desc {
    font-size: 10px;
    color: #64748b;
    font-weight: 600;
}

.grafico-rendimiento-compacto {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
}

.grafico-header-compacto {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.grafico-title-compacto {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin: 0;
}

.grafico-total {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
}

.grafico-barras-compacto {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.barra-item-compacto {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.barra-info-compacto {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.barra-label-compacto {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
}

.barra-count-compacto {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
}

.barra-track-compacto {
    width: 100%;
    height: 24px;
    background: #f1f5f9;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
}

.barra-fill-compacto {
    height: 100%;
    border-radius: 6px;
    transition: width 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    font-size: 10px;
    font-weight: 700;
    color: #ffffff;
}

.barra-fill-excelente {
    background: linear-gradient(90deg, #28C76F 0%, #22a55e 100%);
}

.barra-fill-aceptable {
    background: linear-gradient(90deg, #FF9F43 0%, #e88d2f 100%);
}

.barra-fill-lento {
    background: linear-gradient(90deg, #EA5455 0%, #d43f40 100%);
}

.graficos-trazabilidad-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.grafico-flujo-proceso {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
}

.flujo-timeline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 0;
}

.flujo-etapa {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.flujo-icono {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.flujo-icono-creado {
    background: linear-gradient(135deg, #046AE7 0%, #0356c4 100%);
}

.flujo-icono-proceso {
    background: linear-gradient(135deg, #FF9F43 0%, #e88d2f 100%);
}

.flujo-icono-impreso {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.flujo-icono-despachado {
    background: linear-gradient(135deg, #28C76F 0%, #22a55e 100%);
}

.flujo-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.flujo-label {
    font-size: 10px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
}

.flujo-count {
    font-size: 18px;
    font-weight: 800;
    color: #334155;
}

.flujo-flecha {
    color: #cbd5e1;
    font-size: 16px;
    flex-shrink: 0;
}

.grafico-tendencia-temporal {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
}

.tendencia-visual {
    display: flex;
    gap: 12px;
    margin-top: 12px;
}

.tendencia-eje-y {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 0;
}

.eje-label {
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
}

.tendencia-grafico {
    flex: 1;
    height: 230px;
    background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    position: relative;
    overflow: visible;
}

.tendencia-linea {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    border-top: 2px dashed;
}

.tendencia-linea-critica {
    bottom: 50%;
    border-color: #EA5455;
    opacity: 0.4;
}

.tendencia-linea-normal {
    bottom: 21.4%;
    border-color: #FF9F43;
    opacity: 0.4;
}

.tendencia-puntos {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.tendencia-punto {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #ffffff;
    cursor: pointer;
    transform: translate(-50%, 50%);
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.tendencia-punto:hover {
    transform: translate(-50%, 50%) scale(1.4);
    z-index: 10;
}

.tendencia-punto:hover .punto-tooltip {
    opacity: 1;
    visibility: visible;
}

.punto-excelente {
    background: #28C76F;
}

.punto-aceptable {
    background: #FF9F43;
}

.punto-lento {
    background: #EA5455;
}

.punto-neutral {
    background: #94a3b8;
}

.punto-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1e293b;
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
    margin-bottom: 8px;
    text-align: center;
    line-height: 1.4;
    z-index: 30;
}

.punto-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1e293b;
}

.tendencia-leyenda {
    display: flex;
    gap: 20px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
}

.leyenda-item-tendencia {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
}

.leyenda-linea {
    width: 24px;
    height: 2px;
    border-top: 2px dashed;
}

.leyenda-linea-critica-mini {
    border-color: #EA5455;
}

.leyenda-linea-normal-mini {
    border-color: #FF9F43;
}

@media (max-width: 1200px) {
    .graficos-trazabilidad-grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

.rendimiento-visual {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 140px;
}

.rendimiento-barra-bg {
    flex: 1;
    height: 10px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
}

.rendimiento-barra-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s ease;
}

.rendimiento-barra-fill.rendimiento-excelente {
    background: #28C76F;
}

.rendimiento-barra-fill.rendimiento-aceptable {
    background: #FF9F43;
}

.rendimiento-barra-fill.rendimiento-lento {
    background: #EA5455;
}

.rendimiento-barra-fill.rendimiento-neutral {
    background: #94a3b8;
}

.rendimiento-texto {
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
}

.rendimiento-texto.rendimiento-excelente {
    color: #28C76F;
}

.rendimiento-texto.rendimiento-aceptable {
    color: #FF9F43;
}

.rendimiento-texto.rendimiento-lento {
    color: #EA5455;
}

.rendimiento-texto.rendimiento-neutral {
    color: #64748b;
}

@media (max-width: 1200px) {
    .metricas-rendimiento {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .metricas-rendimiento {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

@media (max-width: 1200px) {
    .kanban-board-full {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

.seccion-title {
    font-size: 16px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 10px;
}

.panel-calendario {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
}

.calendario-grid {
    display: grid;
    gap: 12px;
}

.calendario-grid.rango-mes {
    grid-template-columns: repeat(7, minmax(0, 1fr));
}

.calendario-grid.rango-semana {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.calendario-grid.rango-hoy {
    grid-template-columns: repeat(auto-fit, minmax(360px, 400px));
    justify-content: center;
}

.calendario-dia-nombre {
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
}

.calendario-head {
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    padding: 6px 0;
}

.calendario-dia {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    min-height: 250px;
    padding: 8px;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.2s ease;
}

.calendario-dia:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.calendario-dia-hoy {
    border-color: #046AE7;
    box-shadow: inset 0 0 0 1px rgba(4, 106, 231, 0.2);
    background: #eff6ff;
}

.calendario-dia-activo {
    background: #ffffff;
}

.calendario-dia-fecha {
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.calendario-dia-fecha-iso {
    font-size: 9px;
    color: #94a3b8;
    font-weight: 500;
}

.calendario-dia-contenido {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
    margin-bottom: 8px;
}

.calendario-evento-tooltip {
    display: block;
    width: 100%;
}

.calendario-evento {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 4px;
    border-radius: 0;
    min-height: 24px;
    font-size: 10px;
    font-weight: 600;
}

.calendario-evento i {
    font-size: 9px;
}

.calendario-evento-creado {
    background: #dbeafe;
    color: #1e40af;
}

.calendario-evento-subida {
    background: #e0f2fe;
    color: #0369a1;
}

.calendario-evento-proceso {
    background: #fef3c7;
    color: #92400e;
}

.calendario-evento-empacado {
    background: #ede9fe;
    color: #6d28d9;
}

.calendario-evento-impreso {
    background: #e0e7ff;
    color: #4338ca;
}

.calendario-evento-despachado {
    background: #d1fae5;
    color: #065f46;
}

.calendario-evento-escaneo {
    background: #fed7aa;
    color: #92400e;
}

.calendario-documentos-lista {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-height: 180px;
    overflow-x: hidden;
    overflow-y: auto;
}

.docs-dia-item {
    padding: 10px;
    border: 1px solid #dbe7f3;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: #ffffff;
}

.docs-dia-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.docs-dia-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.calendario-doc-chip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    width: 100%;
    max-width: 100%;
    min-width: 0;
}

.calendario-doc-chip:hover {
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendario-doc-creado {
    background: #dbeafe;
    color: #1e40af;
    border-left: 3px solid #3b82f6;
}

.calendario-doc-enProceso {
    background: #fef3c7;
    color: #92400e;
    border-left: 3px solid #f59e0b;
}

.calendario-doc-impreso {
    background: #e0e7ff;
    color: #4338ca;
    border-left: 3px solid #6366f1;
}

.calendario-doc-despachado {
    background: #d1fae5;
    color: #065f46;
    border-left: 3px solid #10b981;
}

.calendario-doc-escaneo {
    background: #fed7aa;
    color: #92400e;
    border-left: 3px solid #f97316;
}

.doc-chip-codigo {
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 78%;
}

.doc-chip-evento {
    font-size: 8px;
    opacity: 0.8;
    flex-shrink: 0;
}

.acciones-trazabilidad {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.kpi-trazabilidad-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
}

.kpi-trazabilidad-card {
    border: 1px solid #dbeafe;
    border-radius: 12px;
    padding: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    transition: all 0.18s ease;
}

.kpi-trazabilidad-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.kpi-trazabilidad-card-activo {
    border-color: #046AE7;
    box-shadow: 0 0 0 2px rgba(4, 106, 231, 0.12);
}

.kpi-trazabilidad-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    font-weight: 700;
}

.kpi-trazabilidad-value {
    font-size: 24px;
    line-height: 1;
    font-weight: 800;
    color: #1e293b;
}

.kpi-trazabilidad-meta {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
}

.kpi-fases-resumen {
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.kpi-fases-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.kpi-fases-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.kpi-fases-subtitle {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
}

.kpi-fases-selector {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: flex-end;
    padding: 12px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.kpi-fases-selector-campo {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 180px;
    flex: 1 1 180px;
}

.kpi-fases-selector-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
}

.kpi-fases-selector-input {
    width: 100%;
    min-height: 38px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #1e293b;
    font-size: 13px;
    padding: 0 12px;
    outline: none;
}

.kpi-fases-selector-input:focus {
    border-color: #046AE7;
    box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.12);
}

.kpi-fases-selector-acciones {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.kpi-fases-lista {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.kpi-fase-item {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
}

.kpi-fase-info {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 8px;
}

.kpi-fase-label {
    font-size: 12px;
    color: #475569;
    font-weight: 700;
}

.kpi-fase-value {
    font-size: 12px;
    color: #1e293b;
    font-weight: 800;
}

.kpi-fase-barra {
    height: 10px;
    border-radius: 999px;
    background: #e2e8f0;
    overflow: hidden;
}

.kpi-fase-barra-fill {
    height: 100%;
    border-radius: 999px;
}

.kpi-fase-barra-primary {
    background: linear-gradient(90deg, #046AE7 0%, #60a5fa 100%);
}

.kpi-fase-barra-warning {
    background: linear-gradient(90deg, #f59e0b 0%, #fcd34d 100%);
}

.kpi-fase-barra-success {
    background: linear-gradient(90deg, #28C76F 0%, #86efac 100%);
}

.kpi-fase-barra-danger {
    background: linear-gradient(90deg, #ea5455 0%, #fda4af 100%);
}

.comparacion-ejecutiva {
    border: 1px solid #dbe3ef;
    border-radius: 14px;
    padding: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
}

.comparacion-ejecutiva-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}

.comparacion-ejecutiva-title {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
}

.comparacion-ejecutiva-subtitle {
    margin-top: 4px;
    font-size: 12px;
    color: #64748b;
}

.comparacion-ejecutiva-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.comparacion-vacia {
    padding: 14px;
    border-radius: 12px;
    background: #f8fafc;
    color: #64748b;
    font-size: 13px;
    border: 1px dashed #cbd5e1;
}

.comparacion-lista {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.comparacion-item {
    border: 1px solid #dbe3ef;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
}

.comparacion-item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
}

.comparacion-codigo {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
}

.comparacion-estado {
    margin-top: 2px;
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
}

.comparacion-item-body {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.comparacion-fecha {
    padding: 10px;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.comparacion-fecha span {
    font-size: 11px;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
}

.comparacion-fecha strong {
    font-size: 13px;
    color: #0f172a;
}

.fecha-item-destacada {
    padding: 8px 10px;
    border-radius: 10px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
}

.comparacion-tabla-resumen {
    border: 1px solid #dbe3ef;
    border-radius: 12px;
    background: #f8fbff;
    padding: 12px;
}

.comparacion-tabla-resumen-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    flex-wrap: wrap;
}

.comparacion-tabla-resumen-title {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
}

.comparacion-tabla-resumen-subtitle {
    margin-top: 3px;
    margin-bottom: 0;
    font-size: 12px;
    color: #64748b;
}

.comparacion-tabla-resumen-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.comparacion-tabla-resumen-actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.comparacion-columna-ok {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.comparacion-columna-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.comparacion-columna-dias {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
}

.comparacion-columna-rango {
    font-size: 11px;
    color: #0369a1;
    font-weight: 700;
}

.comparacion-columna-fechas {
    font-size: 11px;
    color: #64748b;
}

.comparacion-columna-vacia {
    font-size: 12px;
    font-weight: 700;
    color: #9ca3af;
}

.comparacion-columna-barra-bg {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: #e2e8f0;
    overflow: hidden;
    margin-top: 3px;
}

.comparacion-columna-barra-fill {
    height: 100%;
    border-radius: 999px;
}

.comparacion-columna-barra-verde {
    background: linear-gradient(90deg, #28C76F 0%, #86efac 100%);
}

.comparacion-columna-barra-amarillo {
    background: linear-gradient(90deg, #FF9F43 0%, #fcd34d 100%);
}

.comparacion-columna-barra-rojo {
    background: linear-gradient(90deg, #EA5455 0%, #fda4af 100%);
}

.comparacion-columna-barra-gris {
    background: #94a3b8;
}

.trazabilidad-comparacion-lista {
    width: 100%;
    border: 1px solid #dbe3ef;
    border-radius: 12px;
    padding: 10px;
    background: #f8fbff;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: flex-end;
}

.trazabilidad-comparacion-selectores {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: flex-end;
    flex: 1 1 320px;
}

.trazabilidad-comparacion-campo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 150px;
}

.trazabilidad-comparacion-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
}

.trazabilidad-comparacion-input {
    min-height: 34px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #1e293b;
    font-size: 12px;
    padding: 0 10px;
}

.trazabilidad-comparacion-kpis {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}

.trazabilidad-comparacion-acciones {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-left: auto;
}

.trazabilidad-row-verde {
    border-left: 3px solid #28C76F;
}

.trazabilidad-row-amarillo {
    border-left: 3px solid #FF9F43;
}

.trazabilidad-row-rojo {
    border-left: 3px solid #EA5455;
}

.trazabilidad-row-sin-dato {
    border-left: 3px solid #cbd5e1;
}

.detalle-documento-wrap {
    padding: 4px 2px 6px 2px;
}

.detalle-documento-estado {
    padding: 16px;
    border-radius: 10px;
    background: #f8fafc;
    color: #334155;
    font-weight: 600;
}

.detalle-documento-error {
    background: #fef2f2;
    color: #991b1b;
}

.detalle-documento-resumen {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.detalle-resumen-card {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detalle-resumen-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.detalle-resumen-value {
    font-size: 13px;
    color: #1e293b;
    font-weight: 600;
}

.detalle-tabs-header {
    border-radius: 10px;
    overflow: hidden;
}

.detalle-resumen-metricas {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
}

.detalle-metrica-card {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detalle-metrica-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #64748b;
}

.detalle-metrica-value {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
}

.detalle-metrica-primary {
    border-color: #bfdbfe;
    background: #eff6ff;
}

.detalle-metrica-primary .detalle-metrica-value {
    color: #046AE7;
}

.detalle-metrica-success {
    border-color: #bbf7d0;
    background: #f0fdf4;
}

.detalle-metrica-success .detalle-metrica-value {
    color: #15803d;
}

.detalle-metrica-warning {
    border-color: #fde68a;
    background: #fffbeb;
}

.detalle-metrica-warning .detalle-metrica-value {
    color: #b45309;
}

.detalle-metrica-danger {
    border-color: #fecaca;
    background: #fef2f2;
}

.detalle-metrica-danger .detalle-metrica-value {
    color: #b91c1c;
}

.tabla-detalle-wrap {
    overflow-x: auto;
}

.tabla-detalle-documento {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

.tabla-detalle-documento th,
.tabla-detalle-documento td {
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 8px;
    text-align: left;
    vertical-align: top;
}

.tabla-detalle-documento th {
    background: #f8fafc;
    color: #334155;
    font-weight: 700;
}

/* Card grid layout */
.detalle-codigos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    max-height: 65vh;
    overflow-y: auto;
    padding: 4px;
}

/* Individual card styles */
.detalle-codigo-card {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s ease;
}

.detalle-codigo-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Card header with title and badge */
.detalle-codigo-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid #e2e8f0;
}

.detalle-codigo-card-title {
    flex: 1;
    font-size: 13px;
}

.detalle-codigo-card-title strong {
    color: #1e293b;
    font-weight: 700;
}

.detalle-codigo-card-title small {
    color: #64748b;
    font-size: 11px;
}

/* Badge showing item count */
.detalle-codigo-card-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 28px;
    padding: 0 8px;
    background: #046AE7;
    color: #ffffff;
    font-weight: 700;
    font-size: 12px;
    border-radius: 6px;
    white-space: nowrap;
}

/* Items container */
.detalle-codigo-card-items {
    display: flex;
    flex-direction: column;
    max-height: 280px;
    overflow-y: auto;
}

/* Individual code item in card */
.detalle-codigo-card-item {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.detalle-codigo-card-item:last-child {
    border-bottom: none;
}

.detalle-codigo-card-code {
    flex: 1;
    font-size: 12px;
    font-weight: 600;
    color: #0b1220;
    word-break: break-word;
}

.detalle-codigo-card-meta {
    font-size: 11px;
    color: #046AE7;
    white-space: nowrap;
}

/* Legacy item styles for fallback */
.detalle-codigo-item {
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
}

.detalle-codigo-item:last-child {
    border-bottom: none;
}

.detalle-codigo-item-principal {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
}

.detalle-codigo-item-liquidacion {
    color: #046AE7;
}

/* Force readable colors in case global theme overrides them */
.detalle-codigo-item-codigo,
.detalle-codigo-item-liquidacion,
.detalle-codigo-grupo-titulo,
.detalle-codigo-grupo-subtitulo {
    color: #1e293b !important;
}

/* Make sure codes and titles render as blocks and are readable */
.detalle-codigo-item-codigo {
    display: block !important;
    font-size: 13px !important;
    line-height: 1.2 !important;
    color: #0b1220 !important;
}
.detalle-codigo-item-liquidacion {
    display: block !important;
    font-size: 12px !important;
    color: #046AE7 !important;
}
.detalle-codigo-item {
    background: #ffffff !important;
}

.detalle-codigo-item-secundario {
    margin-top: 4px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    font-size: 11px;
    color: #64748b;
}

.detalle-codigos-vacio {
    padding: 16px;
    border-radius: 10px;
    background: #f8fafc;
    color: #64748b;
    font-weight: 600;
}

.calendario-doc-extra {
    text-align: center;
    padding: 4px;
    font-size: 9px;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    border-radius: 4px;
    background: #f1f5f9;
}

.calendario-doc-extra:hover {
    background: #e2e8f0;
    color: #334155;
}

.calendario-header-ux {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 12px;
    flex-wrap: wrap;
}

.calendario-leyenda {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.leyenda-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
}

.leyenda-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.leyenda-creado {
    background: #3b82f6;
}

.leyenda-subida {
    background: #0ea5e9;
}

.leyenda-proceso {
    background: #f59e0b;
}

.leyenda-empacado {
    background: #8b5cf6;
}

.leyenda-impreso {
    background: #6366f1;
}

.leyenda-despachado {
    background: #10b981;
}

.meta-pill {
    display: inline-block;
    width: fit-content;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 700;
}

.meta-pendiente {
    background: #ffedd5;
    color: #c2410c;
}

.meta-proceso {
    background: #dbeafe;
    color: #1d4ed8;
}

.meta-despachado {
    background: #dcfce7;
    color: #15803d;
}

.panel-kanban {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
}

.panel-kanban-header {
    margin-bottom: 12px;
}

.kanban-board {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.kanban-columna {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    min-height: 280px;
}

.kanban-columna-drop {
    border-color: #046AE7;
    box-shadow: 0 0 0 2px rgba(4, 106, 231, 0.12);
}

.kanban-header {
    font-size: 12px;
    font-weight: 700;
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
}

.kanban-header-pendiente {
    color: #c2410c;
    background: #fff7ed;
}

.kanban-header-proceso {
    color: #1d4ed8;
    background: #eff6ff;
}

.kanban-header-despachado {
    color: #15803d;
    background: #f0fdf4;
}

.kanban-info-trace {
    color: #0f766e;
    font-weight: 600;
}

.kanban-lista {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 440px;
    overflow-y: auto;
}

.kanban-card {
    border: 1px solid #dbe3ee;
    border-radius: 8px;
    background: #ffffff;
    padding: 8px;
}

.kanban-card-draggable {
    cursor: grab;
}

.kanban-card-draggable:active {
    cursor: grabbing;
}

.kanban-codigo {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
}

.kanban-info {
    font-size: 11px;
    color: #64748b;
    line-height: 1.4;
}

.kanban-vacio {
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
    padding: 24px 8px;
}

.panel-trazabilidad {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
}

.trazabilidad-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.trazabilidad-filtros-color {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.trazabilidad-busqueda {
    display: flex;
    align-items: center;
}

.busqueda-trazabilidad-input {
    width: 360px;
    max-width: 100%;
}

.trazabilidad-filtro-label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
}

.filtro-color-btn {
    min-width: 72px;
    transition: all 0.2s ease;
}

.filtro-color-inactivo {
    background: transparent !important;
    box-shadow: none !important;
}

.filtro-color-activo {
    color: #ffffff !important;
}

.filtro-color-primary {
    border-color: #046AE7 !important;
    color: #046AE7 !important;
}

.filtro-color-primary.filtro-color-activo {
    background: #046AE7 !important;
}

.filtro-color-warning {
    border-color: #FF9F43 !important;
    color: #FF9F43 !important;
}

.filtro-color-warning.filtro-color-activo {
    background: #FF9F43 !important;
}

.filtro-color-success {
    border-color: #28C76F !important;
    color: #28C76F !important;
}

.filtro-color-success.filtro-color-activo {
    background: #28C76F !important;
}

.filtro-color-danger {
    border-color: #EA5455 !important;
    color: #EA5455 !important;
}

.filtro-color-danger.filtro-color-activo {
    background: #EA5455 !important;
}

.filtro-color-primary.filtro-color-activo,
.filtro-color-warning.filtro-color-activo,
.filtro-color-success.filtro-color-activo,
.filtro-color-danger.filtro-color-activo {
    color: #ffffff !important;
}

.tabla-trazabilidad-wrap {
    overflow-x: auto;
}

.tabla-trazabilidad {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

.tabla-trazabilidad th,
.tabla-trazabilidad td {
    border-bottom: 1px solid #e2e8f0;
    padding: 10px;
    text-align: left;
}

.tabla-trazabilidad th {
    color: #334155;
    font-weight: 700;
    background: #f8fafc;
    white-space: nowrap;
}

.tabla-vacia {
    text-align: center !important;
    color: #94a3b8;
    font-weight: 600;
    padding: 18px !important;
}

.fechas-consolidadas {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 200px;
}

.fecha-item {
    display: flex;
    gap: 6px;
    font-size: 11px;
}

.fecha-item-error {
    background: #fee2e2;
    border: 1px solid #fca5a5;
    border-radius: 4px;
    padding: 4px 6px;
    margin: 2px 0;
}

.fecha-item-error .fecha-label {
    color: #991b1b;
    font-weight: 700;
}

.fecha-item-error .fecha-valor {
    color: #dc2626;
    font-weight: 700;
}

.fecha-label {
    font-weight: 600;
    color: #64748b;
    min-width: 80px;
}

.fecha-valor {
    color: #334155;
    font-weight: 500;
}

.fechas-escaneo-grupo {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
}

.fecha-escaneo {
    background: #fed7aa;
    color: #92400e;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 500;
    display: inline-flex;
    width: fit-content;
    border: 1px solid #fdba74;
    cursor: pointer;
    transition: all 0.15s ease;
}

.fecha-escaneo:hover {
    background: #ffedd5;
    color: #7c2d12;
}

.escaneo-detalle-popup {
    padding: 4px;
}

.escaneo-detalle-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.escaneo-detalle-campo {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.escaneo-detalle-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
}

.escaneo-detalle-value {
    font-size: 12px;
    font-weight: 600;
    color: #334155;
}

@media (max-width: 768px) {
    .escaneo-detalle-grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

@media (max-width: 1100px) {
    .panel-kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .kanban-board {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .panel-kpis {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .rango-detalle {
        margin-left: 0;
        width: 100%;
    }

    .calendario-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.theme-dark .panel-title {
    color: #c2c6dc;
}

.theme-dark .panel-subtitle {
    color: #9fa6c3;
}

.theme-dark .rango-detalle {
    color: #c2c6dc;
}
</style>
