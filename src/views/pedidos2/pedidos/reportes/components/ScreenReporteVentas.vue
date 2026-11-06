<template>
<div class="reporte-ventas-container">
    <!-- Header con botón y título centrado -->
    <div class="header-container">
        <div class="titulo-centrado">
            <h2 class="titulo-principal">Reporte de Ventas</h2>
            <p class="periodo-info" v-if="nombrePeriodo">{{ nombrePeriodo }}</p>
        </div>
        <vs-button color="primary" @click="irADespachos" class="boton-derecha">
            Reportes base de datos
        </vs-button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
    </div>

    <!-- Cards de ventas -->
    <div v-else-if="arrayDatosDocumentos.length > 0">
        <!-- Botón de recarga unificado -->
        <div class="ventas-header">
            <vs-button color="success" @click="recargarTodo" class="boton-recargar-ventas" title="Recargar todos los datos">
                <i class="fas fa-sync-alt"></i>
            </vs-button>
        </div>

        <!-- ══════════════════════════════════════════════════════════════════════ -->
        <!-- ══ PANEL EJECUTIVO DE BALANCE DE AUDITORÍA & EMBUDO DE CONVERSIÓN ══ -->
        <!-- ══════════════════════════════════════════════════════════════════════ -->
        <div class="executive-audit-dashboard">

            <!-- ── 1. CARDS SUPERIORES DE BALANCE & VARIANZA (RESUMEN AUDITOR) ── -->
            <div class="kpi-balance-row" v-if="!loading">

                <!-- KPI 1: Gestión Comercial -->
                <div class="kpi-balance-card kpi-balance-card--comercial">
                    <div class="kpi-balance-card__header">
                        <div class="kpi-balance-card__icon"><i class="fas fa-clipboard-check"></i></div>
                        <span class="kpi-stage-tag">Fase 1 · Pedidos/Adopciones</span>
                    </div>
                    <!-- Label: solo texto, sin hover -->
                    <div class="kpi-balance-card__label">Intención de Venta Neta</div>
                    <!-- Monto: hover → resalta Venta Neta Proyectada en el embudo -->
                    <div
                        class="kpi-balance-card__amount kpi-kv-hoverable kpi-kv-hoverable--neta"
                        :class="{ 'kpi-kv--active-neta': hoveredZone === 'kpi-comercial-neta' }"
                        @mouseenter="hoveredZone = 'kpi-comercial-neta'"
                        @mouseleave="hoveredZone = null"
                    >{{ formatearMoneda(proyTotalVentaNeta) }}</div>
                    <div class="kpi-balance-card__footer">
                        Intención Venta Bruta:
                        <!-- Solo el valor: hover → resalta Venta Bruta Proyectada en el embudo -->
                        <strong
                            class="kpi-kv-hoverable kpi-kv-hoverable--bruta"
                            :class="{ 'kpi-kv--active-bruta': hoveredZone === 'kpi-comercial-bruta' }"
                            @mouseenter="hoveredZone = 'kpi-comercial-bruta'"
                            @mouseleave="hoveredZone = null"
                        >{{ formatearMoneda(proyTotalVentaBruta) }}</strong>
                    </div>
                </div>

                <!-- Indicador de Flujo -->
                <div class="kpi-flow-arrow" title="Flujo de conversión a facturación">
                    <i class="fas fa-chevron-right"></i>
                </div>

                <!-- KPI 2: Real Devengado Contable -->
                <div class="kpi-balance-card kpi-balance-card--contabilidad">
                    <div class="kpi-balance-card__header">
                        <div class="kpi-balance-card__icon"><i class="fas fa-file-invoice-dollar"></i></div>
                        <span class="kpi-stage-tag kpi-stage-tag--success">Fase 2 · Prefacturas/Notas</span>
                    </div>
                    <!-- Label: solo texto, sin hover -->
                    <div class="kpi-balance-card__label">Facturación Neta</div>
                    <!-- Monto: hover → resalta Facturación Neta en el embudo -->
                    <div
                        class="kpi-balance-card__amount text-emerald-600 kpi-kv-hoverable kpi-kv-hoverable--neta"
                        :class="{ 'kpi-kv--active-neta': hoveredZone === 'kpi-contab-neta' }"
                        @mouseenter="hoveredZone = 'kpi-contab-neta'"
                        @mouseleave="hoveredZone = null"
                    >{{ formatearMoneda(recaudacionNetaReal) }}</div>
                    <div class="kpi-balance-card__footer">
                        Facturación Bruta:
                        <!-- Solo el valor: hover → resalta Facturación Bruta en el embudo -->
                        <strong
                            class="kpi-kv-hoverable kpi-kv-hoverable--bruta"
                            :class="{ 'kpi-kv--active-bruta': hoveredZone === 'kpi-contab-bruta' }"
                            @mouseenter="hoveredZone = 'kpi-contab-bruta'"
                            @mouseleave="hoveredZone = null"
                        >{{ formatearMoneda(facturacionBrutaReal) }}</strong>
                    </div>
                </div>

                <!-- KPI 3: Auditoría · Varianza -->
                <div class="kpi-balance-card kpi-balance-card--varianza">
                    <div class="kpi-balance-card__header">
                        <div class="kpi-balance-card__icon"><i class="fas fa-chart-pie"></i></div>
                        <span class="kpi-stage-tag kpi-stage-tag--warning">Auditoría · Varianza</span>
                    </div>

                    <!-- ── Bloque NETO ── -->
                    <div class="audit-row">
                        <div class="audit-row__label">NETO</div>
                        <div class="audit-row__metrics">
                            <!-- Logrado Neto -->
                            <div
                                class="audit-metric audit-metric--ok kpi-kv-hoverable"
                                :class="{ 'kpi-kv--active-green': hoveredZone === 'logrado-neto' }"
                                @mouseenter="activarZonaConTooltip('logrado-neto')"
                                @mouseleave="desactivarZonaConTooltip('logrado-neto')"
                            >
                                <span class="audit-metric__tag"><i class="fas fa-check-circle"></i> Logrado</span>
                                <span class="audit-metric__pct text-emerald-600">{{ tasaEfectividadContable }}%</span>
                            </div>
                            <!-- Faltante Neto -->
                            <div
                                class="audit-metric audit-metric--pending kpi-kv-hoverable"
                                :class="{ 'kpi-kv--active-amber': hoveredZone === 'falta-neto' }"
                                @mouseenter="activarZonaConTooltip('falta-neto')"
                                @mouseleave="desactivarZonaConTooltip('falta-neto')"
                            >
                                <span class="audit-metric__tag"><i class="fas fa-clock"></i> Falta</span>
                                <span class="audit-metric__pct text-amber-600">{{ porcentajePendienteConversion }}%</span>
                            </div>
                        </div>
                        <!-- Mini barra neta -->
                        <div class="audit-progress-track">
                            <div class="audit-progress-fill audit-progress-fill--neta"
                                :style="{ width: tasaEfectividadContable + '%' }"></div>
                        </div>
                    </div>

                    <div class="audit-row-divider"></div>

                    <!-- ── Bloque BRUTO ── -->
                    <div class="audit-row">
                        <div class="audit-row__label">BRUTO</div>
                        <div class="audit-row__metrics">
                            <!-- Logrado Bruto -->
                            <div
                                class="audit-metric audit-metric--ok kpi-kv-hoverable"
                                :class="{ 'kpi-kv--active-green': hoveredZone === 'logrado-bruto' }"
                                @mouseenter="activarZonaConTooltip('logrado-bruto')"
                                @mouseleave="desactivarZonaConTooltip('logrado-bruto')"
                            >
                                <span class="audit-metric__tag"><i class="fas fa-check-circle"></i> Logrado</span>
                                <span class="audit-metric__pct text-emerald-600">{{ porcentajeEjecutadoBruto }}%</span>
                            </div>
                            <!-- Faltante Bruto -->
                            <div
                                class="audit-metric audit-metric--pending kpi-kv-hoverable"
                                :class="{ 'kpi-kv--active-amber': hoveredZone === 'falta-bruto' }"
                                @mouseenter="activarZonaConTooltip('falta-bruto')"
                                @mouseleave="desactivarZonaConTooltip('falta-bruto')"
                            >
                                <span class="audit-metric__tag"><i class="fas fa-clock"></i> Falta</span>
                                <span class="audit-metric__pct text-amber-600">{{ porcentajePendienteBruto }}%</span>
                            </div>
                        </div>
                        <!-- Mini barra bruta -->
                        <div class="audit-progress-track">
                            <div class="audit-progress-fill audit-progress-fill--bruta"
                                :style="{ width: porcentajeEjecutadoBruto + '%' }"></div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- ── 2. ESTRUCTURA EN EMBUDO ALINEADA NIVEL A NIVEL (BRUTO vs BRUTO / NETO vs NETO) ── -->
            <div class="funnel-pipeline-grid" v-if="!loading">

                <!-- Encabezados de Columna (Eje X) Centrados e Integrados -->
                <div class="funnel-grid-header">
                    <div class="matrix-corner-space"></div>

                    <div class="col-head" :class="{ 'zone--highlighted': hoveredZone === 'col-pedidos', 'zone--dimmed': (hoveredZone && hoveredZone !== 'col-pedidos' && hoveredZone !== 'fila-bruta' && hoveredZone !== 'fila-neta') || hoveredZone === 'kpi-comercial-bruta' || hoveredZone === 'kpi-contab-bruta' || hoveredZone === 'kpi-comercial-neta' || hoveredZone === 'kpi-contab-neta' }" @mouseenter="hoveredZone = 'col-pedidos'" @mouseleave="hoveredZone = null">
                        <div class="col-head-top">
                            <div class="col-badge">
                                <span class="col-step">1</span>
                                <span>Pedidos/Adopciones</span>
                            </div>
                            <span class="col-audit-flag">Por Devengar</span>
                        </div>
                        <!-- <h3 class="col-title">Ventas Solicitadas</h3> -->
                        <p class="col-title">Intención de ventas registrada por asesores</p>
                    </div>

                    <div class="col-head-center">
                        <span class="funnel-vs-badge"><i class="fas fa-exchange-alt"></i> FLUJO DE CONVERSIÓN</span>
                    </div>

                    <div class="col-head" :class="{ 'zone--highlighted': hoveredZone === 'col-facturas', 'zone--dimmed': (hoveredZone && hoveredZone !== 'col-facturas' && hoveredZone !== 'fila-bruta' && hoveredZone !== 'fila-neta') || hoveredZone === 'kpi-comercial-bruta' || hoveredZone === 'kpi-contab-bruta' || hoveredZone === 'kpi-comercial-neta' || hoveredZone === 'kpi-contab-neta' }" @mouseenter="hoveredZone = 'col-facturas'" @mouseleave="hoveredZone = null">
                        <div class="col-head-top">
                            <div class="col-badge">
                                <span class="col-step">2</span>
                                <span>Prefacturas/Notas</span>
                            </div>
                            <span class="col-audit-flag">Ingreso Devengado</span>
                        </div>
                        <!-- <h3 class="col-title">Facturación Efectiva</h3> -->
                        <p class="col-title">Ingreso real devengado por prefacturas y notas</p>
                    </div>
                </div>

                <!-- ── FILA 1: BRUTA vs BRUTA ── -->
                <div class="funnel-row funnel-row--bruta">
                    <!-- Eje Y Izquierdo: NIVEL BRUTO -->
                    <div class="y-axis-tag y-axis-tag--bruto" @mouseenter="hoveredZone = 'fila-bruta'" @mouseleave="hoveredZone = null">
                        <vx-tooltip text="Nivel Bruto: Valores nominales antes de comisiones" position="top">
                            <div class="y-axis-content">
                                <i class="fas fa-layer-group"></i>
                                <span>NIVEL BRUTO</span>
                            </div>
                        </vx-tooltip>
                    </div>

                    <!-- Card Izquierdo: Bruta Solicitada -->
                    <div class="funnel-subcard" :class="{ 'zone--highlighted': hoveredZone === 'col-pedidos' || hoveredZone === 'fila-bruta' || hoveredZone === 'kpi-comercial-bruta', 'zone--highlighted-falta': hoveredZone === 'falta-bruto', 'zone--dimmed': hoveredZone && hoveredZone !== 'col-pedidos' && hoveredZone !== 'fila-bruta' && hoveredZone !== 'logrado-bruto' && hoveredZone !== 'falta-bruto' && hoveredZone !== 'kpi-comercial-bruta' }" @mouseenter="hoveredZone = 'fila-bruta'" @mouseleave="hoveredZone = null">
                        <div class="funnel-subcard__header">
                            <span class="subcard-tag subcard-tag--bruto">
                                <i class="fas fa-file-signature"></i> Venta Bruta Proyectada
                            </span>
                            <span class="subcard-hint-badge">
                                <i class="fas fa-info-circle"></i> Nominal antes de comisiones
                            </span>
                        </div>
                        <div class="funnel-subcard__val" :class="{ 'val-pulse-falta': hoveredZone === 'falta-bruto' }">
                            {{ formatearMoneda(proyTotalVentaBruta) }}
                        </div>
                        <div class="funnel-breakdown-box">
                            <div class="breakdown-row">
                                <span><i class="fas fa-store"></i> Directa:</span>
                                <strong>{{ formatearMoneda(proyTotalVentaBrutaDirecta) }}</strong>
                            </div>
                            <div class="breakdown-row">
                                <span><i class="fas fa-list-check"></i> Lista:</span>
                                <strong>{{ formatearMoneda(proyTotalVentaBrutaLista) }}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Conector Central Fila 1: Avance Bruto Real -->
                    <div class="funnel-row-connector">
                        <div class="connector-arrow-line" :class="{ 'zone--highlighted': hoveredZone === 'fila-bruta' || hoveredZone === 'logrado-bruto', 'zone--highlighted-falta': hoveredZone === 'falta-bruto', 'zone--dimmed': hoveredZone === 'kpi-comercial-bruta' || hoveredZone === 'kpi-contab-bruta' || hoveredZone === 'kpi-comercial-neta' || hoveredZone === 'kpi-contab-neta' }">
                            <div class="falta-diff-badge-sleek" v-if="hoveredZone === 'falta-bruto'">
                                <i class="fas fa-minus-circle"></i>
                                <span>Diferencia: <strong>{{ formatearMoneda(varianzaBrutaMonto) }}</strong></span>
                            </div>
                            <i class="fas fa-long-arrow-alt-right" v-else></i>
                        </div>
                        <div class="connector-badge-card connector-badge-card--bruto" :class="{ 'zone--highlighted': hoveredZone === 'logrado-bruto' || hoveredZone === 'fila-bruta', 'zone--highlighted-falta': hoveredZone === 'falta-bruto', 'zone--dimmed': (hoveredZone && hoveredZone !== 'logrado-bruto' && hoveredZone !== 'falta-bruto' && hoveredZone !== 'fila-bruta' && hoveredZone !== 'col-pedidos' && hoveredZone !== 'col-facturas') || hoveredZone === 'kpi-comercial-bruta' || hoveredZone === 'kpi-contab-bruta' || hoveredZone === 'kpi-comercial-neta' || hoveredZone === 'kpi-contab-neta' }">
                            <div class="conn-label">Avance Bruto Real</div>

                            <div class="conn-dual-metrics">
                                <div class="conn-metric-item conn-metric-item--ok" :class="{ 'zone--highlighted': hoveredZone === 'logrado-bruto' }" @mouseenter="hoveredZone = 'logrado-bruto'" @mouseleave="hoveredZone = null">
                                    <vx-tooltip ref="tooltip-logrado-bruto" :text="'Monto bruto logrado: ' + formatearMoneda(facturacionBrutaReal)" position="bottom">
                                        <span class="conn-metric-label"><i class="fas fa-check-circle"></i> Logrado</span>
                                        <div class="conn-metric-val text-emerald-600">{{ porcentajeEjecutadoBruto }}%</div>
                                    </vx-tooltip>
                                </div>
                                <div class="conn-metric-divider"></div>
                                <div class="conn-metric-item conn-metric-item--pending" :class="{ 'zone--highlighted-falta': hoveredZone === 'falta-bruto' }" @mouseenter="hoveredZone = 'falta-bruto'" @mouseleave="hoveredZone = null">
                                    <vx-tooltip ref="tooltip-falta-bruto" :text="'Monto bruto pendiente (Venta Bruta − Facturación Bruta): ' + formatearMoneda(varianzaBrutaMonto)" position="bottom">
                                        <span class="conn-metric-label"><i class="fas fa-clock"></i> Falta</span>
                                        <div class="conn-metric-val text-amber-600">{{ porcentajePendienteBruto }}%</div>
                                    </vx-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card Derecho: Facturación Bruta Emitida -->
                    <div class="funnel-subcard" :class="{ 'zone--highlighted': hoveredZone === 'col-facturas' || hoveredZone === 'fila-bruta' || hoveredZone === 'logrado-bruto' || hoveredZone === 'kpi-contab-bruta', 'zone--highlighted-falta': hoveredZone === 'falta-bruto', 'zone--dimmed': hoveredZone && hoveredZone !== 'col-facturas' && hoveredZone !== 'fila-bruta' && hoveredZone !== 'logrado-bruto' && hoveredZone !== 'falta-bruto' && hoveredZone !== 'kpi-contab-bruta' }" @mouseenter="hoveredZone = 'fila-bruta'" @mouseleave="hoveredZone = null">
                        <div class="funnel-subcard__header">
                            <span class="subcard-tag subcard-tag--bruto">
                                <i class="fa-solid fa-tags"></i> Facturación Bruta
                            </span>
                            <span class="subcard-hint-badge">
                                <i class="fas fa-info-circle"></i> Prefacturas y notas menos devoluciones
                            </span>
                        </div>
                        <div class="funnel-subcard__val" :class="{ 'val-pulse-ok': hoveredZone === 'logrado-bruto', 'val-pulse-falta': hoveredZone === 'falta-bruto' }">
                            {{ formatearMoneda(facturacionBrutaReal) }}
                        </div>
                        <div class="funnel-breakdown-box">
                            <div class="breakdown-row">
                                <span><i class="fas fa-file-invoice"></i> Prefacturas:</span>
                                <strong>{{ formatearMoneda(arrayDatosDocumentos[0].total_prefacturas_bruto_devoluciones || 0) }}</strong>
                            </div>
                            <div class="breakdown-row">
                                <span><i class="fas fa-sticky-note"></i> Notas:</span>
                                <strong>{{ formatearMoneda(arrayDatosDocumentos[0].total_notas_bruto_devoluciones || 0) }}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── FILA 2: NETA vs NETA ── -->
                <div class="funnel-row funnel-row--neta">
                    <!-- Eje Y Izquierdo: NIVEL NETO -->
                    <div class="y-axis-tag y-axis-tag--neto" @mouseenter="hoveredZone = 'fila-neta'" @mouseleave="hoveredZone = null">
                        <vx-tooltip text="Nivel Neto: Valores reales descontando comisiones y devoluciones" position="bottom">
                            <div class="y-axis-content">
                                <i class="fas fa-filter"></i>
                                <span>NIVEL NETO</span>
                            </div>
                        </vx-tooltip>
                    </div>
                    <!-- Card Izquierdo: Neta Proyectada -->
                    <div class="funnel-subcard funnel-subcard--highlight-pedidos" :class="{ 'zone--highlighted': hoveredZone === 'col-pedidos' || hoveredZone === 'fila-neta' || hoveredZone === 'kpi-comercial-neta', 'zone--highlighted-falta': hoveredZone === 'falta-neto', 'zone--dimmed': hoveredZone && hoveredZone !== 'col-pedidos' && hoveredZone !== 'fila-neta' && hoveredZone !== 'logrado-neto' && hoveredZone !== 'falta-neto' && hoveredZone !== 'kpi-comercial-neta' }" @mouseenter="hoveredZone = 'fila-neta'" @mouseleave="hoveredZone = null">
                        <div class="funnel-subcard__header">
                            <span class="subcard-tag subcard-tag--neto">
                                <i class="fas fa-tags"></i> Venta Neta Proyectada
                            </span>
                            <span class="subcard-deduction-badge">
                                <i class="fas fa-minus-circle"></i> Menos comisiones
                            </span>
                        </div>
                        <div class="subcard-formula-caption">
                            <i class="fas fa-calculator"></i> Venta Bruta descontando comisiones
                        </div>
                        <div class="funnel-subcard__val text-emerald-700" :class="{ 'val-pulse-falta': hoveredZone === 'falta-neto' }">
                            {{ formatearMoneda(proyTotalVentaNeta) }}
                        </div>
                        <div class="funnel-breakdown-box">
                            <div class="breakdown-row">
                                <span><i class="fas fa-store"></i> Directa:</span>
                                <strong>{{ formatearMoneda(proyTotalVentaNetaDirecta) }}</strong>
                            </div>
                            <div class="breakdown-row">
                                <span><i class="fas fa-list-check"></i> Lista:</span>
                                <strong>{{ formatearMoneda(proyTotalVentaNetaLista) }}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Conector Central Fila 2: Avance Neto Real -->
                    <div class="funnel-row-connector">
                        <div class="connector-arrow-line connector-arrow-line--neto" :class="{ 'zone--highlighted': hoveredZone === 'fila-neta' || hoveredZone === 'logrado-neto', 'zone--highlighted-falta': hoveredZone === 'falta-neto', 'zone--dimmed': hoveredZone === 'kpi-comercial-bruta' || hoveredZone === 'kpi-contab-bruta' || hoveredZone === 'kpi-comercial-neta' || hoveredZone === 'kpi-contab-neta' }">
                            <div class="falta-diff-badge-sleek" v-if="hoveredZone === 'falta-neto'">
                                <i class="fas fa-minus-circle"></i>
                                <span>Diferencia: <strong>{{ formatearMoneda(varianzaMontoPendiente) }}</strong></span>
                            </div>
                            <i class="fas fa-long-arrow-alt-right" v-else></i>
                        </div>
                        <div class="connector-badge-card connector-badge-card--neto" :class="{ 'zone--highlighted': hoveredZone === 'logrado-neto' || hoveredZone === 'fila-neta', 'zone--highlighted-falta': hoveredZone === 'falta-neto', 'zone--dimmed': (hoveredZone && hoveredZone !== 'logrado-neto' && hoveredZone !== 'falta-neto' && hoveredZone !== 'fila-neta' && hoveredZone !== 'col-pedidos' && hoveredZone !== 'col-facturas') || hoveredZone === 'kpi-comercial-bruta' || hoveredZone === 'kpi-contab-bruta' || hoveredZone === 'kpi-comercial-neta' || hoveredZone === 'kpi-contab-neta' }">
                            <div class="conn-label">Avance Neto Real</div>

                            <div class="conn-dual-metrics">
                                <div class="conn-metric-item conn-metric-item--ok" :class="{ 'zone--highlighted': hoveredZone === 'logrado-neto' }" @mouseenter="hoveredZone = 'logrado-neto'" @mouseleave="hoveredZone = null">
                                    <vx-tooltip ref="tooltip-logrado-neto" :text="'Monto neto logrado: ' + formatearMoneda(recaudacionNetaReal)" position="bottom">
                                        <span class="conn-metric-label"><i class="fas fa-check-circle"></i> Logrado</span>
                                        <div class="conn-metric-val text-emerald-600">{{ tasaEfectividadContable }}%</div>
                                    </vx-tooltip>
                                </div>
                                <div class="conn-metric-divider"></div>
                                <div class="conn-metric-item conn-metric-item--pending" :class="{ 'zone--highlighted-falta': hoveredZone === 'falta-neto' }" @mouseenter="hoveredZone = 'falta-neto'" @mouseleave="hoveredZone = null">
                                    <vx-tooltip ref="tooltip-falta-neto" :text="'Monto neto pendiente (Venta Neta − Facturación Neta): ' + formatearMoneda(varianzaMontoPendiente)" position="bottom">
                                        <span class="conn-metric-label"><i class="fas fa-clock"></i> Falta</span>
                                        <div class="conn-metric-val text-amber-600">{{ porcentajePendienteConversion }}%</div>
                                    </vx-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card Derecho: Recaudación Neta Real -->
                    <div class="funnel-subcard funnel-subcard--highlight-facturas" :class="{ 'zone--highlighted': hoveredZone === 'col-facturas' || hoveredZone === 'fila-neta' || hoveredZone === 'logrado-neto' || hoveredZone === 'kpi-contab-neta', 'zone--highlighted-falta': hoveredZone === 'falta-neto', 'zone--dimmed': hoveredZone && hoveredZone !== 'col-facturas' && hoveredZone !== 'fila-neta' && hoveredZone !== 'logrado-neto' && hoveredZone !== 'falta-neto' && hoveredZone !== 'kpi-contab-neta' }" @mouseenter="hoveredZone = 'fila-neta'" @mouseleave="hoveredZone = null">
                        <div class="funnel-subcard__header">
                            <span class="subcard-tag subcard-tag--success">
                                <i class="fa-solid fa-tag"></i> Facturación Neta
                            </span>
                            <span class="subcard-deduction-badge subcard-deduction-badge--success">
                                <i class="fas fa-minus-circle"></i> Menos descuentos y devoluciones
                            </span>
                        </div>
                        <div class="subcard-formula-caption subcard-formula-caption--success">
                            <i class="fas fa-calculator"></i> Facturación Bruta descontando descuentos y devoluciones netas
                        </div>
                        <div class="funnel-subcard__val text-emerald-700" :class="{ 'val-pulse-ok': hoveredZone === 'logrado-neto', 'val-pulse-falta': hoveredZone === 'falta-neto' }">
                            {{ formatearMoneda(recaudacionNetaReal) }}
                        </div>
                        <div class="funnel-breakdown-box">
                            <div class="breakdown-row">
                                <span><i class="fas fa-file-invoice"></i> Prefacturas:</span>
                                <strong>{{ formatearMoneda(arrayDatosDocumentos[0].total_prefacturas_neta_devoluciones || 0) }}</strong>
                            </div>
                            <div class="breakdown-row">
                                <span><i class="fas fa-sticky-note"></i> Notas:</span>
                                <strong>{{ formatearMoneda(arrayDatosDocumentos[0].total_notas_neta_devoluciones || 0) }}</strong>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>

    <!-- Estado sin datos -->
    <div v-else class="no-data-container">
        <div class="no-data-icon">
            <i class="fas fa-chart-bar"></i>
        </div>
        <h3>No hay datos disponibles</h3>
        <p>No se encontraron registros para el período seleccionado</p>
    </div>

    <br>

    <!-- Reporte Contabilidad -->
    <vx-card class="mb-5">
        <div class="reporte-contabilidad-header">
            <h3 class="reporte-titulo">
                <i class="fas fa-calculator"></i>
                Reporte Contabilidad
            </h3>
            <div class="botones-reporte">
                <vs-button color="primary" @click="toggleReporteAnual">
                    <i class="fas fa-chart-line"></i>
                    {{ mostrarReporteAnual ? 'Ocultar Reporte' : 'Cargar Reporte' }}
                </vs-button>

                <vs-button v-if="mostrarReporteAnual" color="success" @click="recargarReporte" class="ml-2">
                    <i class="fas fa-sync-alt"></i>
                </vs-button>
            </div>
        </div>

        <!-- Componente del reporte -->
        <div v-if="mostrarReporteAnual" class="reporte-anual-container">
            <ReporteGeneralAnualVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :key="reporteAnualKey" />
        </div>
    </vx-card>
    <!--REPORTE DE PEDIDOS -->
    <vx-card>
        <ReporteVentasPedidosPagosVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
    </vx-card><br>
    <br>
    <!--REPORTE DE DESPACHOS-->
    <!-- <vx-card>
      <ReporteVentasDespachosPagosVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
    </vx-card>
    <br> -->
    <!--RESUMENT DE PAGOS-->
    <vx-card>
        <ReportePagosVue :periodo_id="periodo_id" />
    </vx-card>
    <br>
    <!--REPORTE LIQUIDACIONES-->
    <!-- <vx-card>
      <ReporteVentasContratosPagosVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
    </vx-card>
    <br> -->
    <!---REPORTE ASESORES LIQUIDACIONES-->
    <vx-card>
        <!-- Título -->
        <h1 class="mt-5">Reporte Asesores verificaciones</h1>
        <br>
        <ReporteVentasPorAsesorLiquidadosVue />
    </vx-card>
    <!-- <vx-card>
      <ReporteVentasPorLibroVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
    </vx-card> -->
    <!--REPORTE POR COBRANZA-->
    <vx-card>
        <!-- <h3 class="reporte-titulo">
        <i
          :class="mostrarReporteCobranzas ? 'fas fa-eye' : 'fas fa-eye-slash'"
          class="icon-toggle"
          @click="toggleReporteCobranzas"
        ></i>
        Reporte Cobranzas
      </h3> -->

        <!-- Componente del reporte -->
        <!-- <div v-if="mostrarReporteCobranzas" class="reporte-anual-container"> -->
        <div>
            <ReporteCobradoCobranza :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
        </div>
    </vx-card>
    <br>
    <!--REPORTE GLOBAL DE VENTAS POR LIBROS-->
    <vx-card>
        <h3 class="reporte-titulo">
            <i :class="mostrarReporteLibros ? 'fas fa-eye' : 'fas fa-eye-slash'" class="icon-toggle" @click="toggleReporteLibros"></i>
            Reporte libros despachados
        </h3>

        <div v-if="mostrarReporteLibros" class="reporte-anual-container">
            <xlibroTodosVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect" :key="reporteLibrosKey" />
        </div>
    </vx-card>
    <!-- <vx-card>
      <ReporteVentasGlobalLibrosVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
    </vx-card> -->
    <!--REPORTE REGALADOS-->
    <br>
    <vx-card>
        <ReporteVentasRegaladosVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
    </vx-card>
    <!--REPORTE DEVOLUCIONES-->
    <br>
    <vx-card>
        <ReporteVentasDevolucionesVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
    </vx-card>
    <!--REPORTE PEDIDOS X FECHA-->
    <br>
    <vx-card>
        <ReporteVentasPedidosPorFechaVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
    </vx-card>
</div>
</template>

<script>
import Generalmix from '../../../../../mixins/Generalmix'
const ReportePagosVue = () => import('../../../../pedidos/gerencia/reportes/ReportePagos.vue')
const ReporteContratosLiquidadosNoLiquidadosVue = () => import('../../../../pedidos/gerencia/reportes/ReporteContratosLiquidadosNoLiquidados.vue')
const ReporteVentasPedidosPagosVue = () => import('./RporteVentasPedidosPagos.vue')
// const ReporteVentasContratosPagosVue            = () => import('./ReporteVentasContratosPagos.vue')
const ReporteVentasPorAsesorLiquidadosVue = () => import('./ReporteVentasPorAsesorLiquidados.vue')
const ReporteVentasGlobalLibrosVue = () => import('./ReporteVentasGlobalLibros.vue')
const ReporteVentasRegaladosVue = () => import('./ReporteVentasRegalados.vue')
const ReporteVentasDevolucionesVue = () => import('./ReporteVentasDevoluciones.vue')
const ReporteGeneralAnualVue = () => import('./ReporteGeneralAnual.vue')
const ReporteVentasPorLibroVue = () => import('./ReporteVentasPorLibro.vue')
const ReporteVentasPedidosPorFechaVue = () => import('./ReporteVentasPedidosPorFecha.vue')
const ReporteVentasDespachosPagosVue = () => import('./ReporteVentasDespachosPagos.vue')
const ReporteCobradoCobranza = () => import('@/views/pedidos2/pedidos/reportes/components/ReporteCobradoCobranza.vue');
const xlibroTodosVue = () => import('@/views/pedidos2/pedidos/reportes/components/xlibroTodos.vue');
export default {
    mixins: [Generalmix],
    components: {
        ReporteContratosLiquidadosNoLiquidadosVue,
        // ReporteVentasContratosPagosVue,
        ReportePagosVue,
        ReporteVentasPedidosPagosVue,
        ReporteVentasPorAsesorLiquidadosVue,
        ReporteVentasGlobalLibrosVue,
        ReporteVentasRegaladosVue,
        ReporteVentasDevolucionesVue,
        ReporteGeneralAnualVue,
        ReporteVentasPorLibroVue,
        ReporteVentasPedidosPorFechaVue,
        ReporteVentasDespachosPagosVue,
        ReporteCobradoCobranza,
        xlibroTodosVue
    },
    data() {
        return {
            arrayDatosDocumentos: [],
            loading: true,
            mostrarReporteAnual: false,
            loadingReporteAnual: false,
            reporteAnualKey: 0,
            mostrarReporteLibros: false,
            reporteLibrosKey: 0,
            mostrarReporteCobranzas: false,
            reporteCobranzasKey: 0,
            periodoSelect: null,
            // ── Proyección de adopciones ──────────────────────
            arrayProyeccion: [],
            // ── Hover de zona de la matriz ────────────────────
            hoveredZone: null,
        }
    },
    computed: {
        proyTotalVentaBruta() {
            return Math.round(this.arrayProyeccion.reduce((acc, i) => acc + (parseFloat(i.ventaBruta) || 0), 0) * 100) / 100;
        },
        proyTotalVentaBrutaDirecta() {
            return Math.round(this.arrayProyeccion.filter(i => String(i.tipo_venta) === '1').reduce((acc, i) => acc + (parseFloat(i.ventaBruta) || 0), 0) * 100) / 100;
        },
        proyTotalVentaBrutaLista() {
            return Math.round(this.arrayProyeccion.filter(i => String(i.tipo_venta) === '2').reduce((acc, i) => acc + (parseFloat(i.ventaBruta) || 0), 0) * 100) / 100;
        },
        proyTotalVentaNeta() {
            return Math.round(this.arrayProyeccion.reduce((acc, i) => acc + (parseFloat(i.ven_neta) || 0), 0) * 100) / 100;
        },
        proyTotalVentaNetaDirecta() {
            return Math.round(this.arrayProyeccion.filter(i => String(i.tipo_venta) === '1').reduce((acc, i) => acc + (parseFloat(i.ven_neta) || 0), 0) * 100) / 100;
        },
        proyTotalVentaNetaLista() {
            return Math.round(this.arrayProyeccion.filter(i => String(i.tipo_venta) === '2').reduce((acc, i) => acc + (parseFloat(i.ven_neta) || 0), 0) * 100) / 100;
        },
        recaudacionNetaReal() {
            if (this.arrayDatosDocumentos && this.arrayDatosDocumentos.length > 0) {
                return Math.round(parseFloat(this.arrayDatosDocumentos[0].total_con_descuento_neta_con_devoluciones || 0) * 100) / 100;
            }
            return 0;
        },
        facturacionBrutaReal() {
            if (this.arrayDatosDocumentos && this.arrayDatosDocumentos.length > 0) {
                return Math.round(parseFloat(this.arrayDatosDocumentos[0].total_general_bruto_devoluciones || 0) * 100) / 100;
            }
            return 0;
        },
        varianzaMontoPendiente() {
            const varianza = this.proyTotalVentaNeta - this.recaudacionNetaReal;
            return Math.max(0, Math.round(varianza * 100) / 100);
        },
        varianzaBrutaMonto() {
            const varianza = this.proyTotalVentaBruta - this.facturacionBrutaReal;
            return Math.max(0, Math.round(varianza * 100) / 100);
        },
        porcentajeEjecutadoBruto() {
            if (!this.proyTotalVentaBruta || this.proyTotalVentaBruta <= 0) return '0.00';
            const pct = (this.facturacionBrutaReal / this.proyTotalVentaBruta) * 100;
            return (Math.round(pct * 100) / 100).toFixed(2);
        },
        porcentajePendienteBruto() {
            const pct = 100 - parseFloat(this.porcentajeEjecutadoBruto || 0);
            return Math.max(0, Math.round(pct * 100) / 100).toFixed(2);
        },
        porcentajePendienteConversion() {
            const tasa = parseFloat(this.tasaEfectividadContable || 0);
            const pct = 100 - tasa;
            return Math.max(0, Math.round(pct * 100) / 100).toFixed(2);
        },
        /**
         * Tasa de Efectividad Contable
         * (Recaudación Neta Real / Venta Neta Proyectada de Pedidos) × 100
         */
        tasaEfectividadContable() {
            const ventaNetaProyectada = this.proyTotalVentaNeta;
            if (!ventaNetaProyectada || ventaNetaProyectada <= 0) return '0.00';
            const recaudacionNetaReal = this.recaudacionNetaReal;
            const tasa = (recaudacionNetaReal / ventaNetaProyectada) * 100;
            return (Math.round(tasa * 100) / 100).toFixed(2);
        },
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0
        },
        nombrePeriodo: {
            type: String,
            default: ''
        },
    },
    watch: {
        periodo_id(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.recargarTodo();
            }
        }
    },
    mounted() {
        this.recargarTodo();
        this.f_dataPeriodo();
    },
    methods: {
        // ── Carga unificada: Ventas + Facturación juntas ─────────────────────
        recargarTodo() {
            this.loading = true;
            const promVentas = this.$http.get(this.$server_url + `metodosGetVentas?reporteDocumentosVentaGeneral=1&periodo=${this.periodo_id}`)
                .then((res) => {
                    if (res.data.status == 0) {
                        this.m_message(res.data.message, 'danger');
                    } else {
                        this.arrayDatosDocumentos = res.data;
                        if (this.arrayDatosDocumentos.length == 0) {
                            this.m_message('No hay datos para mostrar', 'warning');
                        }
                    }
                })
                .catch((err) => {
                    console.error('Error cargando documentos:', err);
                });

            const promProyeccion = this.$http.get(this.$server_url + `metodosGetVentas?GetReportePedidosPagos=1&periodo=${this.periodo_id}&tipoVenta=3`)
                .then((res) => {
                    if (res.data.status == 0) {
                        this.m_message(res.data.message, 'danger');
                    } else {
                        this.arrayProyeccion = Array.isArray(res.data) ? res.data : [];
                    }
                })
                .catch((err) => {
                    console.error('Error cargando proyección de pedidos:', err);
                });

            Promise.all([promVentas, promProyeccion]).finally(() => {
                this.loading = false;
            });
        },
        f_dataPeriodo() {
            this.$http.get(this.$server_url + `periodo/${this.periodo_id}`)
                .then((res) => {
                    if (res.data.status == 0) {
                        this.m_message(res.data.message, 'danger')
                    } else {
                        this.periodoSelect = res.data
                    }
                })
                .catch((error) => {
                    console.log(error + ' error')
                })
        },
        formatearMoneda(valor) {
            return new Intl.NumberFormat('es-EC', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(valor)
        },
        abrirReporteAnual() {
            this.mostrarReporteAnual = true
        },
        toggleReporteAnual() {
            if (this.mostrarReporteAnual) {
                // Si está visible, lo ocultamos
                this.mostrarReporteAnual = false
            } else {
                // Si está oculto, lo mostramos
                this.mostrarReporteAnual = true
                // Incrementamos la key para forzar la recarga del componente
                this.reporteAnualKey += 1
            }
        },
        recargarReporte() {
            // Función específica para recargar el reporte
            // Incrementamos la key para forzar la recarga del componente
            this.reporteAnualKey += 1

            this.$vs.notify({
                title: 'Reporte Actualizado',
                text: 'El reporte se ha actualizado correctamente',
                color: 'success'
            })
        },
        toggleReporteLibros() {
            if (this.mostrarReporteLibros) {
                // Si está visible, lo ocultamos
                this.mostrarReporteLibros = false
            } else {
                // Si está oculto, lo mostramos
                this.mostrarReporteLibros = true
                // Incrementamos la key para forzar la recarga del componente
                this.reporteLibrosKey += 1
            }
        },
        recargarReporteLibros() {
            // Función específica para recargar el reporte de libros
            // Incrementamos la key para forzar la recarga del componente
            this.reporteLibrosKey += 1

            this.$vs.notify({
                title: 'Reporte Actualizado',
                text: 'El reporte de libros se ha actualizado correctamente',
                color: 'success'
            })
        },
        toggleReporteCobranzas() {
            if (this.mostrarReporteCobranzas) {
                this.mostrarReporteCobranzas = false
            } else {
                this.mostrarReporteCobranzas = true
                this.reporteCobranzasKey += 1
            }
        },
        recargarVentas() {
            // Mantener compatibilidad — redirige al nuevo método unificado
            this.recargarTodo();
        },
        irADespachos() {
            window.open(this.$server_url + 'admin/despachados/vista', '_blank');
        },
        activarZonaConTooltip(zona) {
            this.hoveredZone = zona;
            this.$nextTick(() => {
                const ref = this.$refs[`tooltip-${zona}`];
                if (ref && ref.$el) {
                    ref.$el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                }
            });
        },
        desactivarZonaConTooltip(zona) {
            this.hoveredZone = null;
            const ref = this.$refs[`tooltip-${zona}`];
            if (ref && ref.$el) {
                ref.$el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            }
        },
    }
}
</script>

<style scoped>
.reporte-ventas-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 30px;
    min-height: 80px;
}

.titulo-centrado {
    text-align: center;
    flex: 1;
}

.boton-derecha {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.header-section {
    text-align: center;
    margin-bottom: 30px;
}

.titulo-principal {
    color: #2c3e50;
    font-size: 2.2rem;
    /* más pequeño */
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.periodo-info {
    color: #7f8c8d;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
}

.botones-reportes {
    margin-top: 20px;
    text-align: center;
}

.categorias-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    /* más pequeño */
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 10px;
}

.categoria-item {
    text-align: center;
    padding: 12px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 10px;
    border: 1px solid #dee2e6;
}

.categoria-titulo {
    color: #2c3e50;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 4px 0;
}

.categoria-subtitulo {
    color: #6c757d;
    font-size: 0.85rem;
    margin: 0;
    font-weight: 500;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 250px;
    color: #7f8c8d;
}

.spinner {
    width: 35px;
    height: 35px;
    border: 4px solid #ecf0f1;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    /* cards más pequeños */
    gap: 15px;
    margin-bottom: 20px;
}

.card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
    padding: 8px;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.venta-bruta {
    border-left: 5px solid #e74c3c;
}

.venta-neta {
    border-left: 5px solid #27ae60;
}

.card-header {
    padding: 10px;
    text-align: center;
}

.icon-container {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: white;
}

.icon-container.bruta {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.icon-container.neta {
    background: linear-gradient(135deg, #27ae60, #229954);
}

.card-body {
    padding: 10px;
    text-align: center;
}

.amount {
    font-size: 1.4rem;
    /* más pequeño */
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
}

.label {
    color: #95a5a6;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 5px 0;
    opacity: 0.8;
}

.card-footer {
    padding: 8px;
    text-align: center;
}

.card-breakdown {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ecf0f1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: #f8fafb;
    border-radius: 8px;
    border: 1px solid #eef2f4;
}

.breakdown-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #5d6d7e;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.breakdown-label i {
    font-size: 0.85rem;
}

.venta-bruta .breakdown-label i {
    color: #e74c3c;
}

.venta-neta .breakdown-label i {
    color: #27ae60;
}

.breakdown-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: #2c3e50;
}

.no-data-container {
    text-align: center;
    padding: 50px 15px;
    color: #7f8c8d;
}

.no-data-icon {
    font-size: 3rem;
    color: #bdc3c7;
    margin-bottom: 15px;
}

.no-data-container h3 {
    color: #2c3e50;
    margin-bottom: 8px;
}

.resumen-container {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.resumen-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    text-align: center;
    min-width: 200px;
}

.resumen-card h4 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1rem;
    font-weight: 600;
}

/* Responsive */
@media (max-width: 950px) and (min-width: 769px) {
    .header-container {
        flex-direction: column;
        gap: 20px;
        min-height: auto;
        text-align: center;
    }

    .boton-derecha {
        position: static;
        transform: none;
        align-self: center;
    }

    .titulo-centrado {
        margin-bottom: 0;
    }
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        gap: 15px;
        min-height: auto;
    }

    .boton-derecha {
        position: static;
        transform: none;
    }

    .cards-container {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .categorias-header {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .titulo-principal {
        font-size: 1.8rem;
    }

    .amount {
        font-size: 1.3rem;
    }

    .card {
        margin: 0 8px;
    }
}

@media (max-width: 480px) {
    .reporte-ventas-container {
        padding: 15px 10px;
    }

    .titulo-principal {
        font-size: 1.5rem;
    }

    .amount {
        font-size: 1.2rem;
    }
}

.reporte-anual-section {
    text-align: center;
    padding: 20px;
}

.reporte-anual-section h1 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.reporte-anual-section p {
    color: #7f8c8d;
    font-size: 1rem;
}

.reporte-contabilidad-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 20px;
}

.botones-reporte {
    display: flex;
    align-items: center;
    gap: 10px;
}

.reporte-titulo {
    color: #2c3e50;
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.reporte-titulo i {
    color: #3498db;
}

.icon-toggle {
    margin-right: 10px;
    cursor: pointer;
    color: #3498db !important;
    transition: opacity 0.3s ease;
}

.icon-toggle:hover {
    opacity: 0.7;
}

.reporte-anual-container {
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 15px;
    position: relative;
}

/* Responsive para el header del reporte */
@media (max-width: 768px) {
    .reporte-contabilidad-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }

    .reporte-titulo {
        justify-content: center;
    }

    .botones-reporte {
        flex-direction: column;
        width: 100%;
    }

    .botones-reporte .vs-button {
        width: 100%;
        margin: 5px 0;
    }
}

/* Estilos para el header de ventas */
.ventas-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
    padding: 0 10px;
}

.boton-recargar-ventas {
    display: flex;
    align-items: center;
    gap: 8px;
}

.boton-recargar-ventas i {
    font-size: 14px;
}

@media (max-width: 768px) {
    .ventas-header {
        justify-content: center;
    }

    .boton-recargar-ventas {
        width: 100%;
        justify-content: center;
    }
}
</style><style scoped>
/* ─────────────────────────────────────────────────────────────────────────
   ESTILOS HOVER INTERACTIVO: KPI CARDS SUPERIORES → EMBUDO INFERIOR
   ───────────────────────────────────────────────────────────────────────── */

/* Elemento dentro del KPI card que actúa como disparador de hover */
.kpi-kv-hoverable {
    cursor: pointer;
    position: relative;
    border-radius: 5px;
    transition: background 0.15s ease;
    padding: 2px 4px;
    margin: -2px -4px;
    display: inline-block;
}

/* Fondo tintado al hover según destino: verde=neto, azul=bruto */
.kpi-kv-hoverable--neta:hover {
    background: rgba(16, 185, 129, 0.10);
}

.kpi-kv-hoverable--bruta:hover {
    background: rgba(59, 130, 246, 0.10);
}

/* Ícono de link discreto que aparece al hover */
.kpi-link-hint {
    display: inline-block;
    font-size: 0.58rem;
    color: #a5b4fc;
    margin-left: 4px;
    opacity: 0;
    transform: translateY(-1px);
    transition: opacity 0.15s ease;
    vertical-align: middle;
}

.kpi-kv-hoverable:hover .kpi-link-hint {
    opacity: 1;
}

/* Valor activo: color del card destino */
.kpi-kv--active-neta {
    color: #047857 !important;
    text-shadow: 0 0 12px rgba(16, 185, 129, 0.45) !important;
}

.kpi-kv--active-bruta {
    color: #1d4ed8 !important;
    text-shadow: 0 0 12px rgba(59, 130, 246, 0.45) !important;
}

.kpi-kv--active-amber {
    color: #d97706 !important;
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.35) !important;
}

.kpi-kv--active-green {
    color: #047857 !important;
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.35) !important;
}

.kpi-balance-card--contabilidad .kpi-link-hint {
    color: #6ee7b7;
}

/* ─────────────────────────────────────────────────────────────────────────
   KPI 3 AUDITORÍA: LAYOUT DE DOS BLOQUES (NETA / BRUTA)
   ───────────────────────────────────────────────────────────────────────── */
.audit-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 3px 0;
}

.audit-row__label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #515a66ff;
}

.audit-row__metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
}

.audit-metric {
    display: flex;
    flex-direction: column;
    gap: 0px;
    border-radius: 6px;
    padding: 4px 6px;
    border: 1px solid transparent;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.audit-metric--ok {
    background: #f0fdf4;
    border-color: #d1fae5;
}

.audit-metric--ok:hover {
    background: #dcfce7;
    border-color: #6ee7b7;
}

.audit-metric--pending {
    background: #fffbeb;
    border-color: #fde68a;
}

.audit-metric--pending:hover {
    background: #fef3c7;
    border-color: #fcd34d;
}

.audit-metric__tag {
    font-size: 0.58rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 3px;
}

.audit-metric--ok .audit-metric__tag i    { color: #10b981; }
.audit-metric--pending .audit-metric__tag i { color: #f59e0b; }

.audit-metric__pct {
    font-size: 1.05rem;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.3px;
}

.audit-row-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 2px 0;
}

.audit-progress-track {
    height: 3px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 4px;
}

.audit-progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.audit-progress-fill--neta  { background: linear-gradient(90deg, #10b981, #059669); }
.audit-progress-fill--bruta { background: linear-gradient(90deg, #3b82f6, #2563eb); }
</style><style scoped>
/* ─────────────────────────────────────────────────────────────────────────
   DASHBOARD FINANCIERO EJECUTIVO CON NAVEGACIÓN Y SIGNIFICADO SEMÁNTICO
   Color con propósito:
   - Verde (#10b981 / #047857): Ingreso Real Devengado / Recaudación Neta Real
   - Ámbar (#f59e0b / #d97706): Varianza / Brecha por Facturar Pendiente
   - Índigo (#6366f1 / #3730a3): Gestión Comercial / Venta Neta Proyectada
   - Gris (#64748b / #475569): Valores Brutos Nominales
   ───────────────────────────────────────────────────────────────────────── */

.executive-audit-dashboard {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
    font-family: inherit;
}

/* ══════════════════════════════════════════════════
   1. FILA DE BALANCE KPI SUPERIOR
   ══════════════════════════════════════════════════ */
.kpi-balance-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr 1.2fr;
    align-items: stretch;
    gap: 12px;
}

.kpi-balance-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.kpi-balance-card:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
}

/* Bordes laterales significativos (4px) */
.kpi-balance-card--comercial {
    border-left: 4px solid #6366f1;
}

.kpi-balance-card--contabilidad {
    border-left: 4px solid #10b981;
}

.kpi-balance-card--varianza {
    border-left: 4px solid #f59e0b;
    padding: 10px 14px;
}

/* Los cards 1 y 2 no usan space-between, el header queda arriba y el footer abajo naturalmente */
.kpi-balance-card--comercial,
.kpi-balance-card--contabilidad {
    justify-content: flex-start;
    gap: 4px;
}

.kpi-balance-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.kpi-balance-card__icon {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: #f1f5f9;
    color: #475569;
    flex-shrink: 0;
}

.kpi-balance-card--comercial .kpi-balance-card__icon {
    background: #e0e7ff;
    color: #4338ca;
}

.kpi-balance-card--contabilidad .kpi-balance-card__icon {
    background: #d1fae5;
    color: #047857;
}

.kpi-balance-card--varianza .kpi-balance-card__icon {
    background: #fef3c7;
    color: #b45309;
}

.kpi-stage-tag {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #64748b;
}

.kpi-stage-tag--success {
    color: #047857;
}

.kpi-stage-tag--warning {
    color: #b45309;
}

.kpi-balance-card__label {
    font-size: 0.85rem;
    color: #475569;
    margin-bottom: 4px;
    font-weight: 600;
}

.kpi-balance-card__amount {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    line-height: 1.15;
    margin-bottom: auto;
}

/* Colores semánticos directos en los montos principales */
.text-emerald-600 {
    color: #059669 !important;
}

.text-amber-600 {
    color: #d97706 !important;
}

.text-indigo-700 {
    color: #3730a3 !important;
}

.text-emerald-700 {
    color: #047857 !important;
}

.kpi-balance-card__footer {
    margin-top: auto;
    padding-top: 6px;
    border-top: 1px solid #f1f5f9;
    font-size: 0.95rem;
    color: #64748b;
}

.kpi-balance-card__footer strong {
    color: #1e293b;
}

.kpi-flow-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    font-size: 12px;
}

/* Barra de progreso de conversión */
.kpi-conversion-progress-wrap {
    margin-top: 8px;
}

.kpi-conversion-track {
    height: 6px;
    background: #fef3c7;
    border-radius: 6px;
    overflow: hidden;
}

.kpi-conversion-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 6px;
    transition: width 0.5s ease;
}

.kpi-conversion-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.68rem;
    font-weight: 700;
    margin-top: 5px;
}

.conversion-pct-ok {
    color: #059669;
}

.conversion-pct-pending {
    color: #d97706;
}

.kpi-balance-skeleton {
    padding: 20px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    text-align: center;
    color: #64748b;
}

/* ══════════════════════════════════════════════════
   2. GRID DEL EMBUDO (FILAS PARALELAS NIVEL A NIVEL)
   ══════════════════════════════════════════════════ */
.funnel-pipeline-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

/* ── Zona de Hover Interactivo (resaltado / atenuado) ── */
.zone--highlighted {
    transition: box-shadow 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
    box-shadow: 0 0 0 2px #3b82f680, 0 4px 16px rgba(59, 130, 246, 0.12) !important;
    opacity: 1 !important;
    transform: translateY(-1px);
    z-index: 2;
    position: relative;
}

.zone--highlighted-falta {
    transition: box-shadow 0.22s ease, opacity 0.22s ease, transform 0.22s ease;
    box-shadow: 0 0 0 2.5px #f59e0b, 0 4px 18px rgba(245, 158, 11, 0.22) !important;
    opacity: 1 !important;
    transform: translateY(-2px);
    z-index: 3;
    position: relative;
}

/* Cápsula Sobria de Diferencia en la Flecha Central con Pulse Suave */
.falta-diff-badge-sleek {
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fffbeb;
    color: #92400e;
    border: 1.5px solid #f59e0b;
    font-size: 0.74rem;
    font-weight: 800;
    padding: 3px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
    white-space: nowrap;
    animation: diffBadgePulse 3.5s infinite ease-in-out !important;
}

.falta-diff-badge-sleek strong {
    color: #b45309;
    font-weight: 900;
}

@keyframes diffBadgePulse {
    0% {
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.12), 0 0 0px rgba(245, 158, 11, 0);
    }

    50% {
        box-shadow: 0 4px 18px rgba(245, 158, 11, 0.38), 0 0 12px rgba(245, 158, 11, 0.18);
    }

    100% {
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.12), 0 0 0px rgba(245, 158, 11, 0);
    }
}

/* Resaltado con text-shadow elegante — sin movimiento físico, solo resplandor suave */
.val-pulse-ok {
    display: inline-block;
    color: #059669 !important;
    animation: valPulseOk 3.5s infinite ease-in-out !important;
}

@keyframes valPulseOk {
    0% {
        text-shadow: 0 0 0px rgba(16, 185, 129, 0);
        transform: scale(1);
    }

    50% {
        text-shadow: 0 0 8px rgba(16, 185, 129, 0.55), 0 0 16px rgba(16, 185, 129, 0.25);
        transform: scale(1.015);
    }

    100% {
        text-shadow: 0 0 0px rgba(16, 185, 129, 0);
        transform: scale(1);
    }
}

.val-pulse-falta {
    display: inline-block;
    color: #d97706 !important;
    animation: valPulseFalta 3.5s infinite ease-in-out !important;
}

@keyframes valPulseFalta {
    0% {
        text-shadow: 0 0 0px rgba(245, 158, 11, 0);
        transform: scale(1);
    }

    50% {
        text-shadow: 0 0 8px rgba(245, 158, 11, 0.55), 0 0 16px rgba(245, 158, 11, 0.25);
        transform: scale(1.015);
    }

    100% {
        text-shadow: 0 0 0px rgba(245, 158, 11, 0);
        transform: scale(1);
    }
}

.falta-minus-badge {
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #d97706;
    color: #ffffff;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(217, 119, 6, 0.3);
    animation: pulseBadge 1.2s infinite ease-in-out;
}

@keyframes slideDownFade {
    from {
        opacity: 0;
        transform: translate(-50%, -6px);
    }

    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes pulseBadge {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

.zone--dimmed {
    transition: opacity 0.18s ease;
    opacity: 0.42;
}

.funnel-row--neta .zone--highlighted {
    box-shadow: 0 0 0 2px #10b98180, 0 4px 16px rgba(16, 185, 129, 0.12) !important;
}

/* Resaltado específico desde KPI Comercial → Venta Neta Proyectada (verde-índigo) */
.funnel-row--neta .zone--highlighted.kpi-origin--comercial,
.funnel-row--bruta .zone--highlighted.kpi-origin--comercial {
    box-shadow: 0 0 0 2.5px #6366f1, 0 4px 18px rgba(99, 102, 241, 0.18) !important;
}

.funnel-grid-header {
    display: grid;
    grid-template-columns: 36px 1fr auto 1fr;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 6px;
}

.matrix-corner-space {
    width: 36px;
}

/* Eje Y: Badges Verticales al extremo izquierdo (Fila 1 y Fila 2) */
.y-axis-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 6px 2px;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    cursor: help;
    user-select: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.y-axis-tag--bruto {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-right: 4px solid #3b82f6;
}

.y-axis-tag--neto {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    border-right: 4px solid #10b981;
}

.y-axis-content {
    display: flex;
    align-items: center;
    gap: 6px;
}

.y-axis-content i {
    font-size: 0.72rem;
}

.col-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: 3px solid #475569;
    border-radius: 10px;
    padding: 12px 14px;
}

.col-head-top {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 6px;
    width: 100%;
}

.col-head-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.col-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #334155;
}

.col-step {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #334155;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    flex-shrink: 0;
}

.col-title {
    font-size: 0.98rem;
    font-weight: 800;
    color: #0f172a;
    margin: 2px 0 3px 0;
    text-align: center;
}

.col-subtitle {
    font-size: 0.84rem;
    color: #64748b;
    margin: 0;
    text-align: center;
}

.col-audit-flag {
    font-size: 0.64rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 6px;
    background: #ffffff;
    color: #475569;
    border: 1px solid #cbd5e1;
}

.funnel-vs-badge {
    font-size: 0.65rem;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 6px;
    background: #f1f5f9;
    color: #334155;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    border: 1px solid #e2e8f0;
}

/* ══════════════════════════════════════════════════
   FILAS Y TARJETAS DEL EMBUDO CON PISTAS CONTINUAS DE COLOR
   - Fila 1 (Bruto): Azul Elegante de izquierda a derecha
   - Fila 2 (Neto): Verde Esmeralda de izquierda a derecha
   ══════════════════════════════════════════════════ */
.funnel-row {
    display: grid;
    grid-template-columns: 36px 1fr 200px 1fr;
    align-items: stretch;
    gap: 12px;
}

.funnel-subcard {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
    border-left: 4px solid #3b82f6;
    /* Fila 1 (Bruto): Azul continuo */
}

.funnel-subcard--highlight-pedidos {
    border-left: 4px solid #10b981;
    /* Fila 2 (Neta Proyectada): Verde continuo */
    background: #ffffff;
}

.funnel-subcard--highlight-facturas {
    border-left: 4px solid #10b981;
    /* Fila 2 (Recaudación Neta Real): Verde continuo */
    background: #ffffff;
}

.funnel-subcard__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 6px;
}

.subcard-tag {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #334155;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.subcard-tag--bruto i {
    color: #2563eb;
}

.subcard-tag--neto i {
    color: #059669;
}

.subcard-tag--success i {
    color: #059669;
}

.subcard-hint-badge {
    font-size: 0.80rem;
    color: #64748b;
    font-style: italic;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.subcard-deduction-badge {
    font-size: 0.80rem;
    color: #059669;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.subcard-deduction-badge--success {
    color: #059669;
}

.subcard-formula-caption {
    font-size: 0.75rem;
    color: #64748b;
    padding: 3px 0 0 8px;
    margin: 2px 0 6px 0;
    display: flex;
    align-items: center;
    gap: 5px;
    border-left: 2px solid #e2e8f0;
}

.subcard-formula-caption--success {
    border-left-color: #a7f3d0;
    color: #047857;
}

.funnel-subcard__val {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
    margin: 6px 0 10px 0;
    letter-spacing: -0.4px;
}

.funnel-breakdown-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
}

.breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.90rem;
    color: #475569;
    padding: 2px 0;
}

.breakdown-row span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.breakdown-row span i {
    color: #94a3b8;
    font-size: 0.72rem;
}

.breakdown-row strong {
    color: #0f172a;
    font-weight: 700;
}

/* ── Conector Central por Fila (Coherente por Pista de Color) ── */
.funnel-row-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.connector-arrow-line {
    font-size: 1.1rem;
    color: #3b82f6;
    margin-bottom: 4px;
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.connector-arrow-line--neto {
    color: #10b981;
}

.connector-badge-card {
    position: relative;
    text-align: center;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 8px;
    width: 100%;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);
}

.connector-badge-card--bruto {
    border-top: 3px solid #3b82f6;
    background: #f8fafc;
}

.connector-badge-card--neto {
    border-top: 3px solid #10b981;
    background: #f0fdf4;
}

.conn-label {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #334155;
    margin-bottom: 6px;
}

.conn-dual-metrics {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #ffffff;
    border-radius: 8px;
    padding: 8px 4px;
    border: 1px solid #e2e8f0;
}

.conn-metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.conn-metric-item--ok {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 6px;
    transition: transform 0.15s ease, background-color 0.15s ease;
}

.conn-metric-item--ok:hover {
    background-color: #ecfdf5;
}

.conn-metric-item--pending {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 6px;
    transition: transform 0.15s ease, background-color 0.15s ease;
}

.conn-metric-item--pending:hover {
    background-color: #fffbeb;
}

.conn-metric-label {
    font-size: 0.64rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 3px;
}

.conn-metric-val {
    font-size: 1.25rem;
    font-weight: 900;
    line-height: 1;
}

.conn-metric-divider {
    width: 1px;
    height: 26px;
    background: #e2e8f0;
}

/* ══════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════ */
@media (max-width: 1024px) {
    .kpi-balance-row {
        grid-template-columns: 1fr 1fr;
    }

    .kpi-flow-arrow {
        display: none;
    }

    .funnel-grid-header {
        display: none;
    }

    .matrix-corner-space {
        display: none;
    }

    .funnel-row {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .y-axis-tag {
        writing-mode: horizontal-tb;
        transform: none;
        padding: 6px 12px;
        border-right: 1px solid;
        border-left: 4px solid;
        justify-content: flex-start;
    }

    .funnel-row-connector {
        margin: 6px 0;
    }

    .connector-arrow-line {
        transform: rotate(90deg);
    }
}

@media (max-width: 640px) {
    .kpi-balance-row {
        grid-template-columns: 1fr;
    }

    .kpi-balance-card__amount {
        font-size: 1.25rem;
    }

    .funnel-subcard__val {
        font-size: 1.15rem;
    }
}
</style>
