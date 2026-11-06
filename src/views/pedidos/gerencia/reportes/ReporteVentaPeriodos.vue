<template>
    <div>
        <vx-card class="mb-0 report-card-shell">
            <div class="container mx-auto px-4">
                <div class="mb-6 mt-5">
                    <div class="report-hero mb-4">
                        <div class="report-hero__left">
                            <div class="report-hero__copy">
                                <span class="report-hero__eyebrow">📊 Gerencia / Reportes</span>
                                <h2 class="report-hero__title">Reporte de Ventas por Periodo</h2>
                                <p class="report-hero__subtitle">Vista ejecutiva para revisión de resultados y pagos por periodo escolar.</p>
                            </div>
                        </div>
                        <div class="report-hero__actions">
                            <button @click="exportar" class="report-action-btn report-btn-primary">
                                <span class="report-btn-icon">📥</span> Exportar Excel
                            </button>
                            <button @click="recargarPedidos" class="report-action-btn report-btn-secondary">
                                <span class="report-btn-icon">🔄</span> Recargar
                            </button>
                            <button @click="limpiarSeleccion" class="report-action-btn report-btn-danger">
                                <span class="report-btn-icon">✕</span> Limpiar
                            </button>
                        </div>
                    </div>

                    <div class="report-stats-grid">
                        <div v-for="stat in resumenReporte" :key="stat.label" class="report-stat-card" :class="stat.className">
                            <div class="report-stat-icon">{{ stat.icon }}</div>
                            <span class="report-stat-label">{{ stat.label }}</span>
                            <span class="report-stat-value">{{ stat.value }}</span>
                            <span class="report-stat-helper">{{ stat.helper }}</span>
                        </div>
                    </div>

                    <div class="report-toolbar">
                        <div class="report-filter-card">
                            <div class="report-filter-card__label">
                                <span class="report-filter-card__title">Filtros</span>
                                <span class="report-filter-card__subtitle">Selecciona periodos para actualizar el reporte</span>
                            </div>
                            <v-select multiple :options="arrayPeriodos" label="periodoescolar" :reduce="p => p.idperiodoescolar"
                                v-model="periodoSelect" class="w-full multi-select-height report-select" @input="onPeriodoChange"
                                placeholder="Seleccione periodos..." />
                            
                            <!-- Campo de búsqueda dentro del card de filtros -->
                            <div v-if="pedidos.length > 0" class="mt-4">
                                <div class="flex items-center gap-3">
                                    <span class="report-search-icon">Buscar</span>
                                    <input
                                        v-model="searchQuery"
                                        type="text"
                                        placeholder="Buscar por institución, pedido, asesor..."
                                        class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent report-search-input"
                                    />
                                    <span class="report-search-count text-xs">{{ pedidosFiltrados.length }} de {{ pedidos.length }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Nuevo filtro de estado de pagos -->
                        <div class="report-filter-card" v-if="periodoSelect">
                            <div class="report-filter-card__label">
                                <span class="report-filter-card__title">Filtro de Pagos</span>
                                <span class="report-filter-card__subtitle">Filtra los pagos por estado</span>
                            </div>
                            <div class="flex flex-col gap-3">
                                <div class="flex gap-3" style="flex-wrap: wrap;">
                                    <label class="report-radio-label">
                                        <input type="radio" value="todos" v-model="filtroEstado" @change="cambiarFiltroEstado" class="report-radio-input" />
                                        <span class="report-radio-text">Todos</span>
                                    </label>
                                    <label class="report-radio-label">
                                        <input type="radio" value="cerrados" v-model="filtroEstado" @change="cambiarFiltroEstado" class="report-radio-input" />
                                        <span class="report-radio-text">Cerrados</span>
                                    </label>
                                    <label class="report-radio-label">
                                        <input type="radio" value="abiertos" v-model="filtroEstado" @change="cambiarFiltroEstado" class="report-radio-input" />
                                        <span class="report-radio-text">Abiertos</span>
                                    </label>
                                    <label class="report-radio-label">
                                        <input type="radio" value="sin_fecha" v-model="filtroEstado" @change="cambiarFiltroEstado" class="report-radio-input" />
                                        <span class="report-radio-text">Sin rango de fecha</span>
                                    </label>
                                </div>

                                <!-- Indicador cuando se selecciona sin_fecha -->
                                <div v-if="filtroEstado === 'sin_fecha'" class="report-sinFecha-badge">
                                    <span>📅</span>
                                    <span>Mostrando todos los pagos sin filtro de fecha</span>
                                </div>
                                
                                <!-- Campos de fecha: oculto cuando filtroEstado === 'sin_fecha' -->
                                <div v-if="mostrarFechas && filtroEstado !== 'sin_fecha'" class="flex flex-col gap-2">
                                    <div class="flex gap-2">
                                        <div class="flex-1">
                                            <label class="report-date-label">Fecha Inicio</label>
                                            <input 
                                                type="date" 
                                                v-model="fechaInicio" 
                                                :max="fechaFin"
                                                @change="validarFechaInicio"
                                                class="report-date-input" 
                                            />
                                        </div>
                                        <div class="flex-1">
                                            <label class="report-date-label">Fecha Fin</label>
                                            <input 
                                                type="date" 
                                                v-model="fechaFin" 
                                                :min="fechaInicio"
                                                :max="obtenerFechaActual()"
                                                @change="validarFechaFin"
                                                class="report-date-input" 
                                            />
                                        </div>
                                    </div>
                                    <button @click="aplicarFiltroFechas" class="report-action-btn report-btn-primary" style="width: fit-content; align-self: flex-start;">
                                        <span class="report-btn-icon">🔍</span> Filtrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabla de Reportes CORREGIDA -->
                <div class="mt-8 overflow-x-auto report-table-shell">
                    <table class="min-w-full bg-white rounded-2xl overflow-hidden report-table report-table-fixed">
                        <colgroup>
                            <col class="report-col-institution" />
                            <col class="report-col-summary" />
                            <col class="report-col-payments" />
                        </colgroup>
                        <thead>
                            <tr class="report-table-head">
                                <th class="py-2 px-3 text-left font-bold text-[9px] uppercase tracking-[0.12em] text-slate-700 sticky top-0 z-10">
                                    <div class="flex items-center gap-2">
                                        <span class="report-th-index">1</span>
                                        <span>Institución</span>
                                    </div>
                                </th>
                                <th class="py-2 px-3 text-left font-bold text-[9px] uppercase tracking-[0.12em] text-slate-700 sticky top-0 z-10">
                                    <div class="flex items-center gap-2">
                                        <span class="report-th-index">2</span>
                                        <span>Convenio & Resumen</span>
                                    </div>
                                </th>
                                <th class="py-2 px-3 text-left font-bold text-[9px] uppercase tracking-[0.12em] text-slate-700 sticky top-0 z-10">
                                    <div class="flex items-center gap-2">
                                        <span class="report-th-index">3</span>
                                        <span>Detalle de Pagos</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="pedidos.length === 0">
                                <td colspan="3" class="text-center py-10 text-gray-500">
                                    <div class="report-empty-state">
                                        <p class="text-sm font-semibold text-gray-700">No hay pedidos para mostrar</p>
                                        <p class="text-[10px] text-gray-500 mt-1">Selecciona uno o varios periodos para cargar el reporte</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else-if="pedidos.length > 0 && pedidosFiltrados.length === 0">
                                <td colspan="3" class="text-center py-10 text-gray-500">
                                    <div class="report-empty-state">
                                        <p class="text-sm font-semibold text-gray-700">Sin resultados para tu búsqueda</p>
                                        <p class="text-[10px] text-gray-500 mt-1">Prueba con otro término o limpia el filtro</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else v-for="pedido in pedidosFiltrados" :key="pedido.id_pedido" class="report-row-hover transition-all duration-200">
                                <td class="py-2 px-3 report-cell-soft align-top">
                                    <div class="report-panel report-panel--institution">
                                        <span class="report-section-eyebrow">Institución</span>
                                        <h3 class="report-section-title report-title-tight">{{ pedido.nombreInstitucion }}</h3>
                                        <p class="report-section-subtitle">
                                            Estado: {{ pedido.estado_liquidacion || 'N/A' }} · Conv. {{ pedido.pedidos_convenios_id }}
                                        </p>
                                        <div class="report-summary-list report-summary-list--institution">
                                            <div class="report-summary-row">
                                                <span class="report-mini-card__label">Convenio</span>
                                                <span class="report-mini-card__value">{{ pedido.convenio || (Number(pedido.convenio_global) > 0 ? 'si' : 'no') }}</span>
                                            </div>
                                            <div class="report-summary-row">
                                                <span class="report-mini-card__label">Asesor</span>
                                                <span class="report-mini-card__value">{{ pedido.asesor_nombres }} {{ pedido.asesor_apellidos }}</span>
                                            </div>
                                            <div class="report-summary-row">
                                                <span class="report-mini-card__label">Contrato</span>
                                                <span class="report-mini-card__value">{{ pedido.contrato_generado }}</span>
                                            </div>
                                            <div class="report-summary-row">
                                                <span class="report-mini-card__label">Comisión</span>
                                                <span class="report-mini-card__value">{{ pedido.descuento ? pedido.descuento + '%' : '0%' }}</span>
                                            </div>
                                            <div class="report-summary-row">
                                                <span class="report-mini-card__label">Venta Bruta (Liquidado)</span>
                                                <span class="report-mini-card__value">{{ calcularVentaBrutaTotal(pedido) | filtrarDecimal2 }}</span>
                                            </div>
                                            <div class="report-summary-row">
                                                <span class="report-mini-card__label">Estado Liquidación</span>
                                                <span class="report-mini-card__value">{{ pedido.estado_liquidacion || 'N/A' }}</span>
                                            </div>
                                        </div>
                                        <div class="report-mini-badges">
                                            <span class="report-badge report-badge--blue">{{ pedido.tipo_venta_descr }}</span>
                                            <span class="report-badge report-badge--slate">{{ pedido.nombre_periodo }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-2 px-3 report-cell-accent align-top">
                                    <div class="report-panel report-panel--summary">
                                        <div class="report-total-band report-total-band--compact">
                                            <div class="report-total-band__item">
                                                <span class="report-total-band__label">Total Pagado</span>
                                                <span class="report-total-band__value report-total-band__value--positive">
                                                    {{ pedido.total_pagado | filtrarDecimal2 }}
                                                </span>
                                            </div>
                                            <div class="report-total-band__item">
                                                <span class="report-total-band__label">Total x Pagar</span>
                                                <span class="report-total-band__value" 
                                                    :class="calcularTotalXPagar(pedido) < 0 ? 'report-total-band__value--danger' : (calcularTotalXPagar(pedido) > 0 ? 'report-total-band__value--warning' : 'report-total-band__value--positive')">
                                                    {{ calcularTotalXPagar(pedido) | filtrarDecimal2 }}
                                                </span>
                                            </div>
                                        </div>
                                        <div v-if="calcularTotalXPagar(pedido) < 0" 
                                            class="report-alert report-alert--danger">
                                            <span class="report-alert__icon">⚠️</span>
                                            <span class="report-alert__text">El monto pagado excede el valor de lo registrado</span>
                                        </div>
                                        <div v-if="calcularTotalXPagar(pedido) > 0" 
                                            class="report-alert report-alert--warning">
                                            <span class="report-alert__icon">ℹ️</span>
                                            <span class="report-alert__text">Aún falta completar el pago para igualar el valor registrado</span>
                                        </div>
                                        <div class="report-summary-head">
                                            <span class="report-section-eyebrow">Convenio & Resumen</span>
                                            <h3 class="report-section-title report-title-tight">Estado financiero</h3>
                                        </div>
                                        <div class="report-financial-columns">
                                            <div class="report-financial-column">
                                                <div class="report-summary-row report-summary-row--split report-summary-row--financial">
                                                    <span class="report-mini-card__label">Global</span>
                                                    <span class="report-mini-card__value">{{ pedido.convenio_global }}</span>
                                                </div>
                                                <div class="report-summary-row report-summary-row--split report-summary-row--financial">
                                                    <span class="report-mini-card__label">Conv. pag.</span>
                                                    <span class="report-mini-card__value">{{ pedido.valor_convenio_pagado | filtrarDecimal2 }}</span>
                                                </div>
                                                <div class="report-summary-row report-summary-row--split report-summary-row--financial">
                                                    <span class="report-mini-card__label">Conv. x pag.</span>
                                                    <span class="report-mini-card__value">{{ pedido.convenio_x_pagar | filtrarDecimal2 }}</span>
                                                </div>
                                            </div>
                                            <div class="report-financial-column">
                                                <div class="report-summary-row report-summary-row--split report-summary-row--financial">
                                                    <span class="report-mini-card__label">Pend.</span>
                                                    <span class="report-mini-card__value">{{ pedido.pagosPendientes | filtrarDecimal2 }}</span>
                                                </div>
                                                <div class="report-summary-row report-summary-row--split report-summary-row--financial">
                                                    <span class="report-mini-card__label">Pag. pag.</span>
                                                    <span class="report-mini-card__value">{{ pedido.pagosLiquidaciones | filtrarDecimal2 }}</span>
                                                </div>
                                                <div class="report-summary-row report-summary-row--split report-summary-row--financial">
                                                    <span class="report-mini-card__label">Pag. x pag.</span>
                                                    <span class="report-mini-card__value">{{ pedido.pagos_x_pagar | filtrarDecimal2 }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="report-meta-line report-meta-line--compact">
                                            <span>Tiempo: {{ pedido.convenio_anios }} años</span>
                                            <span>Inicio: {{ pedido.inicio_convenio }}</span>
                                            <span>Estado: {{ pedido.estado_convenio }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-2 px-3 report-cell-white align-top">
                                    <div v-if="pedido.cantidad_pagos_total > 0" class="report-panel report-panel--payments">
                                        <div class="report-payment-head">
                                            <span class="report-section-eyebrow">Detalle de Pagos</span>
                                            <h3 class="report-section-title report-title-tight">Movimientos asociados</h3>
                                            <p class="report-payment-total">Total: {{ pedido.cantidad_pagos_total }} pagos</p>
                                        </div>
                                        <div class="report-payment-grid">
                                            <div class="report-payment-metric report-payment-metric--green">
                                                <span class="report-payment-metric__label">Cerr. pago</span>
                                                <span class="report-payment-metric__value">{{ pedido.pagos_cerrados_pago | filtrarDecimal2 }}</span>
                                            </div>
                                            <div class="report-payment-metric report-payment-metric--amber">
                                                <span class="report-payment-metric__label">Ab. pago</span>
                                                <span class="report-payment-metric__value">{{ pedido.pagos_abiertos_pago | filtrarDecimal2 }}</span>
                                            </div>
                                            <div class="report-payment-metric report-payment-metric--teal">
                                                <span class="report-payment-metric__label">Cerr. conv.</span>
                                                <span class="report-payment-metric__value">{{ pedido.pagos_cerrados_convenio | filtrarDecimal2 }}</span>
                                            </div>
                                            <div class="report-payment-metric report-payment-metric--orange">
                                                <span class="report-payment-metric__label">Ab. conv.</span>
                                                <span class="report-payment-metric__value">{{ pedido.pagos_abiertos_convenio | filtrarDecimal2 }}</span>
                                            </div>
                                        </div>

                                        <!-- Desktop: tabla normal -->
                                        <div class="rounded-xl shadow-lg tabla-pagos-interna report-inner-table report-inner-table--desktop">
                                            <table class="report-inner-table__table bg-white">
                                                <colgroup>
                                                    <col class="report-pay-col-id" />
                                                    <col class="report-pay-col-benef" />
                                                    <col class="report-pay-col-subtotal" />
                                                    <col class="report-pay-col-iva" />
                                                    <col class="report-pay-col-ret" />
                                                    <col class="report-pay-col-total" />
                                                    <col class="report-pay-col-type" />
                                                    <col class="report-pay-col-forma" />
                                                    <col class="report-pay-col-estado" />
                                                    <col class="report-pay-col-factura" />
                                                    <col class="report-pay-col-fechas" />
                                                    <col class="report-pay-col-hora" />
                                                </colgroup>
                                                <thead>
                                                    <tr class="report-inner-table-head">
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">ID</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Benef.</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Subtot.</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">IVA</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Ret.</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Total</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Tipo</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Forma</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Estado</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Núm. Fact.</th>
                                                        <th class="py-1 px-1 text-left text-[8px] font-bold uppercase text-slate-700">Fechas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="pago in pedido.todos_los_pagos" :key="pago.id_pedido_pago_detalle" class="report-inner-row">
                                                        <td class="py-1 px-1 text-[8px] font-semibold text-slate-700">{{ pago.id_pedido_pago_detalle }}</td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">
                                                            <div v-if="pago.razon_social">
                                                                <p class="font-semibold">{{ pago.razon_social }}</p>
                                                                <p class="text-gray-500 text-[8px]">{{ pago.documento_dni || 'Sin documento' }}</p>
                                                            </div>
                                                            <div v-else>
                                                                <p>{{ pago.nombre_completo || 'N/A' }}</p>
                                                                <p class="text-gray-500 text-[8px]">{{ pago.documento_dni || 'Sin documento' }}</p>
                                                            </div>
                                                        </td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">{{ pago.subtotal | filtrarDecimal2 }}</td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">{{ pago.iva_valor | filtrarDecimal2 }}</td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">{{ pago.retencion | filtrarDecimal2 }}</td>
                                                        <td class="py-1 px-1 text-[8px] font-bold text-slate-900">{{ pago.total_calculado | filtrarDecimal2 }}</td>
                                                        <td class="py-1 px-1 text-[8px]">
                                                            <vx-tooltip :text="'Tipo de pago: ' + pago.tipo_pago_texto" position="top">
                                                                <span class="report-tag" :class="{
                                                                    'report-tag--blue': pago.tipo_pago_id === 1,
                                                                    'report-tag--purple': pago.tipo_pago_id === 2,
                                                                    'report-tag--indigo': pago.tipo_pago_id === 7,
                                                                    'report-tag--teal': pago.tipo_categoria === 'Convenio'
                                                                }">
                                                                    {{ pago.tipo_pago_texto }}
                                                                </span>
                                                            </vx-tooltip>
                                                        </td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">{{ pago.forma_pago_nombre || 'N/A' }}</td>
                                                        <td class="py-1 px-1 text-[8px]">
                                                            <vx-tooltip :text="pago.estado === 1 ? 'Pago cerrado y aprobado' : 'Pago abierto, pendiente de cierre'" position="top">
                                                                <span class="report-tag" :class="pago.estado === 1 ? 'report-tag--green' : 'report-tag--amber'">
                                                                    {{ pago.estado_texto }}
                                                                </span>
                                                            </vx-tooltip>
                                                        </td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">{{ formatearNumeroFactura(pago.num_factura) || '-' }}</td>
                                                        <td class="py-1 px-1 text-[8px] text-slate-700">
                                                            <div class="report-dates-stack">
                                                                <vx-tooltip v-if="pago.fecha_emision_factura" text="Fecha de emisión de la factura" position="top">
                                                                    <div class="report-date-row">
                                                                        <span class="report-date-label-inline report-date-label--emision">Emi:</span>
                                                                        <span class="report-date-value">{{ pago.fecha_emision_factura }}</span>
                                                                    </div>
                                                                </vx-tooltip>
                                                                <vx-tooltip v-if="pago.fecha_pago_factura" text="Fecha en que se realizó el pago de la factura" position="top">
                                                                    <div class="report-date-row">
                                                                        <span class="report-date-label-inline report-date-label--pago">Pag:</span>
                                                                        <span class="report-date-value">{{ pago.fecha_pago_factura }}</span>
                                                                    </div>
                                                                </vx-tooltip>
                                                                   <vx-tooltip v-if="pago.fecha_proceso" text="Fecha en que se registró el pago en el sistema" position="top">
                                                                    <div class="report-date-row">
                                                                        <span class="report-date-label-inline report-date-label--registro">Reg:</span>
                                                                        <span class="report-date-value">{{ pago.fecha_proceso }}</span>
                                                                    </div>
                                                                </vx-tooltip>
                                                                <vx-tooltip v-if="pago.fecha_proximo_pago" text="Fecha del próximo pago programado" position="top">
                                                                    <div class="report-date-row">
                                                                        <span class="report-date-label-inline report-date-label--proximo">Próx:</span>
                                                                        <span class="report-date-value">{{ pago.fecha_proximo_pago }}</span>
                                                                    </div>
                                                                </vx-tooltip>
                                                                <div v-if="!pago.fecha_proceso && !pago.fecha_emision_factura && !pago.fecha_pago_factura && !pago.fecha_proximo_pago" class="report-date-empty">
                                                                    <span>-</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <!-- Mobile: tarjetas apiladas -->
                                        <div class="report-inner-cards--mobile">
                                            <div v-for="pago in pedido.todos_los_pagos" :key="'m-'+pago.id_pedido_pago_detalle" class="report-pago-card">
                                                <div class="report-pago-card__header">
                                                    <span class="report-pago-card__id">#{{ pago.id_pedido_pago_detalle }}</span>
                                                    <div class="report-pago-card__badges">
                                                        <span class="report-tag" :class="{
                                                            'report-tag--blue': pago.tipo_pago_id === 1,
                                                            'report-tag--purple': pago.tipo_pago_id === 2,
                                                            'report-tag--indigo': pago.tipo_pago_id === 7,
                                                            'report-tag--teal': pago.tipo_categoria === 'Convenio'
                                                        }">
                                                            {{ pago.tipo_pago_texto }}
                                                        </span>
                                                        <span class="report-tag" :class="pago.estado === 1 ? 'report-tag--green' : 'report-tag--amber'">
                                                            {{ pago.estado_texto }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="report-pago-card__benef">
                                                    <span class="report-pago-card__label">Beneficiario</span>
                                                    <span class="report-pago-card__value">{{ pago.razon_social || pago.nombre_completo || 'N/A' }}</span>
                                                    <span class="report-pago-card__sub">{{ pago.documento_dni || 'Sin documento' }}</span>
                                                </div>
                                                <div class="report-pago-card__amounts">
                                                    <div class="report-pago-card__amount">
                                                        <span class="report-pago-card__label">Subtotal</span>
                                                        <span class="report-pago-card__value">{{ pago.subtotal | filtrarDecimal2 }}</span>
                                                    </div>
                                                    <div class="report-pago-card__amount">
                                                        <span class="report-pago-card__label">IVA</span>
                                                        <span class="report-pago-card__value">{{ pago.iva_valor | filtrarDecimal2 }}</span>
                                                    </div>
                                                    <div class="report-pago-card__amount">
                                                        <span class="report-pago-card__label">Ret.</span>
                                                        <span class="report-pago-card__value">{{ pago.retencion | filtrarDecimal2 }}</span>
                                                    </div>
                                                    <div class="report-pago-card__amount report-pago-card__amount--total">
                                                        <span class="report-pago-card__label">Total</span>
                                                        <span class="report-pago-card__value report-pago-card__value--bold">{{ pago.total_calculado | filtrarDecimal2 }}</span>
                                                    </div>
                                                </div>
                                                <div class="report-pago-card__footer">
                                                    <span class="report-pago-card__label">Forma de pago</span>
                                                    <span class="report-pago-card__value">{{ pago.forma_pago_nombre || 'N/A' }}</span>
                                                </div>
                                                <div v-if="pago.num_factura" class="report-pago-card__footer" style="margin-top: 4px;">
                                                    <span class="report-pago-card__label">Núm. Factura</span>
                                                    <span class="report-pago-card__value">{{ formatearNumeroFactura(pago.num_factura) }}</span>
                                                </div>
                                                <div v-if="pago.fecha_registro" class="report-pago-card__footer" style="margin-top: 4px;">
                                                    <span class="report-pago-card__label">Fecha Registro</span>
                                                    <span class="report-pago-card__value">{{ pago.fecha_proceso }}</span>
                                                </div>
                                                <div v-if="pago.fecha_emision_factura" class="report-pago-card__footer" style="margin-top: 4px;">
                                                    <span class="report-pago-card__label">Fecha Emisión</span>
                                                    <span class="report-pago-card__value">{{ pago.fecha_emision_factura }}</span>
                                                </div>
                                                <div v-if="pago.fecha_pago_factura" class="report-pago-card__footer" style="margin-top: 4px;">
                                                    <span class="report-pago-card__label">Fecha Pago</span>
                                                    <span class="report-pago-card__value">{{ pago.fecha_pago_factura }}</span>
                                                </div>
                                                <div v-if="pago.fecha_proximo_pago" class="report-pago-card__footer" style="margin-top: 4px;">
                                                    <span class="report-pago-card__label">Próximo Pago</span>
                                                    <span class="report-pago-card__value">{{ pago.fecha_proximo_pago }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="report-panel report-panel--empty text-center py-8">
                                        <p class="text-gray-500 italic text-sm">Sin pagos registrados</p>
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </vx-card>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import vSelect from 'vue-select'
import Generalmix from '@/mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
export default {
    mixins: [Generalmix,Codigosmix],
    components: {
        vSelect,
    },
    data() {
        return {
            usuario:[],
            arrayPeriodos: [],
            periodoSelect: null,
            totalVenta: 0,
            totalVentaDescuento: 0,
            pedidos: [],
            searchQuery: '',
            // Nuevos filtros para pagos
            filtroEstado: 'todos', // 'todos', 'cerrados', 'abiertos'
            fechaInicio: this.obtenerPrimerDiaMes(),
            fechaFin: this.obtenerFechaActual(),
            mostrarFechas: true, // Siempre mostrar fechas por defecto
        }
    },

    computed: {
        pedidosFiltrados() {
            if (!this.searchQuery) {
                return this.pedidos;
            }
            const query = this.searchQuery.toLowerCase();
            return this.pedidos.filter(pedido => {
                return (
                    (pedido.nombreInstitucion && pedido.nombreInstitucion.toLowerCase().includes(query)) ||
                    (pedido.id_pedido && pedido.id_pedido.toString().includes(query)) ||
                    (pedido.pedido_institucion_id && pedido.pedido_institucion_id.toString().includes(query)) ||
                    (pedido.asesor_nombres && pedido.asesor_nombres.toLowerCase().includes(query)) ||
                    (pedido.asesor_apellidos && pedido.asesor_apellidos.toLowerCase().includes(query)) ||
                    (pedido.contrato_generado && pedido.contrato_generado.toLowerCase().includes(query)) ||
                    (pedido.tipo_venta_descr && pedido.tipo_venta_descr.toLowerCase().includes(query))
                );
            });
        },
        resumenReporte() {
            const pedidos = this.pedidosFiltrados || [];
            const money = new Intl.NumberFormat('es-EC', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            const asNumber = (value) => {
                const num = parseFloat(value);
                return Number.isFinite(num) ? num : 0;
            };

            const instituciones = new Set();
            let pagos = 0;
            let pagado = 0;
            let pendiente = 0;

            pedidos.forEach((pedido) => {
                if (pedido.nombreInstitucion) {
                    instituciones.add(pedido.nombreInstitucion);
                }
                pagos += asNumber(pedido.cantidad_pagos_total);
                pagado += asNumber(pedido.total_pagado);
                pendiente += asNumber(pedido.total_x_pagar);
            });

            // Normalizar pendiente para evitar -0
            const redondeadoPendiente = Math.round(pendiente * 100) / 100;
            const pendienteNormalizado = redondeadoPendiente === 0 ? 0 : pendiente;

            return [
                {
                    label: 'Pedidos visibles',
                    value: pedidos.length,
                    helper: 'Resultados según el filtro actual',
                    className: 'report-stat-card--blue',
                    icon: '📋',
                },
                {
                    label: 'Instituciones',
                    value: instituciones.size,
                    helper: 'Unidades educativas incluidas',
                    className: 'report-stat-card--slate',
                    icon: '🏫',
                },
                {
                    label: 'Pagos totales',
                    value: pagos,
                    helper: 'Suma de pagos cargados',
                    className: 'report-stat-card--emerald',
                    icon: '💳',
                },
                {
                    label: 'Total pagado',
                    value: money.format(pagado),
                    helper: 'Convenio + liquidaciones',
                    className: 'report-stat-card--indigo',
                    icon: '✅',
                },
                {
                    label: 'Total por pagar',
                    value: money.format(pendienteNormalizado),
                    helper: 'Saldo restante estimado',
                    className: 'report-stat-card--amber',
                    icon: '⏳',
                },
            ];
        }
    },

    mounted() {
        this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}')
        this.obtenerPeriodos()
    },

    methods: {
        // Normalizar valores para evitar -0
        normalizarValor(valor) {
            const num = Number(valor || 0);
            // Solo convertir -0 a 0, usando Object.is para detectar -0 exactamente
            // o si el redondeo a 2 decimales da exactamente 0
            const redondeado = Math.round(num * 100) / 100;
            return redondeado === 0 ? 0 : num;
        },
        formatearNumeroFactura(num) {
            if (!num || num === '' || num === null || num === undefined) {
                return '';
            }
            // Convertir a string y rellenar con ceros a la izquierda hasta 9 dígitos
            return String(num).padStart(9, '0');
        },
        calcularTotalXPagar(pedido) {
            if (pedido.total_x_pagar !== undefined && pedido.total_x_pagar !== null) {
                return this.normalizarValor(Number(pedido.total_x_pagar));
            }
            const total = Number(pedido.convenio_x_pagar || 0) + Number(pedido.pagos_x_pagar || 0);
            return this.normalizarValor(total);
        },
        calcularVentaBrutaTotal(pedido) {
            // Si tiene verificaciones (total_verificaciones > 0), usar venta_bruta_liquidado
            // Si no tiene verificaciones, usar venta_bruta_pedido
            const totalVerificaciones = Number(pedido.total_verificaciones || 0);
            if (totalVerificaciones > 0) {
                return Number(pedido.venta_bruta_liquidado || 0);
            } else {
                return Number(pedido.venta_bruta_pedido || 0);
            }
        },
        obtenerPrimerDiaMes() {
            const hoy = new Date();
            const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            return this.formatearFecha(primerDia);
        },
        obtenerFechaActual() {
            const hoy = new Date();
            return this.formatearFecha(hoy);
        },
        formatearFecha(fecha) {
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        validarFechas() {
            if (!this.fechaInicio || !this.fechaFin) {
                return {
                    valido: false,
                    mensaje: 'Debe seleccionar fecha de inicio y fin'
                };
            }

            const inicio = new Date(this.fechaInicio);
            const fin = new Date(this.fechaFin);

            if (inicio > fin) {
                return {
                    valido: false,
                    mensaje: 'La fecha de inicio no puede ser mayor que la fecha fin'
                };
            }

            return { valido: true };
        },
        validarFechaInicio() {
            if (this.fechaInicio && this.fechaFin) {
                const inicio = new Date(this.fechaInicio);
                const fin = new Date(this.fechaFin);
                
                if (inicio > fin) {
                    this.$vs.notify({
                        title: 'Advertencia',
                        text: 'La fecha de inicio no puede ser mayor que la fecha fin',
                        color: 'warning',
                        position: 'top-right'
                    });
                    this.fechaInicio = this.fechaFin;
                }
            }
        },
        validarFechaFin() {
            if (this.fechaInicio && this.fechaFin) {
                const inicio = new Date(this.fechaInicio);
                const fin = new Date(this.fechaFin);
                const hoy = new Date(this.obtenerFechaActual());
                
                if (fin < inicio) {
                    this.$vs.notify({
                        title: 'Advertencia',
                        text: 'La fecha fin no puede ser menor que la fecha de inicio',
                        color: 'warning',
                        position: 'top-right'
                    });
                    this.fechaFin = this.fechaInicio;
                }
                
                if (fin > hoy) {
                    this.$vs.notify({
                        title: 'Advertencia',
                        text: 'La fecha fin no puede ser mayor que la fecha actual',
                        color: 'warning',
                        position: 'top-right'
                    });
                    this.fechaFin = this.obtenerFechaActual();
                }
            }
        },
        obtenerPeriodos() {
            let me = this;
            this.$http.get(this.$server_url + 'periodo_nombre')
                .then(res => {
                    console.log('Periodos obtenidos:', res.data);
                    me.arrayPeriodos = res.data;
                })
        },
        onPeriodoChange() {
            // Si no hay periodos seleccionados o el array está vacío, limpiar los datos
            if (!this.periodoSelect || this.periodoSelect.length === 0) {
                this.pedidos = [];
                console.log('Periodos limpiados, datos borrados');
            } else {
                // Si hay periodos seleccionados, consultar
                this.f_get_pedidos_periodos();
            }
        },
        f_get_pedidos_periodos() {
            console.log('IDs seleccionados:', this.periodoSelect);
            if (!this.periodoSelect || this.periodoSelect.length === 0) {
                console.warn('No hay periodos seleccionados');
                return;
            }

            this.$vs.loading();

            const payload = {
                id_group: this.usuario ? this.usuario.id_group : null,
                periodos: this.periodoSelect,
                // Cuando es sin_fecha se manda 'todos' al backend para que no filtre por estado
                // pero sin fechas, mostrando todos los pagos
                filtro_estado: this.filtroEstado === 'sin_fecha' ? 'todos' : this.filtroEstado,
            };

            // Solo enviar fechas si NO es 'sin_fecha'
            if (this.filtroEstado !== 'sin_fecha' && this.fechaInicio && this.fechaFin) {
                payload.fecha_inicio = this.fechaInicio;
                payload.fecha_fin = this.fechaFin;
            }

            this.$http.post(this.$server_url + 'obtenerPedidosPorPeriodo', payload)
                .then(res => {
                    console.log('Pedidos:', res.data.data);
                    this.pedidos = res.data.data;
                })
                .catch(err => {
                    console.error('Error:', err);
                })
                .finally(() => {
                    this.$vs.loading.close();
                });
        },
        recargarPedidos() {
            if (!this.periodoSelect || this.periodoSelect.length === 0) {
                this.$vs.notify({
                    title: 'Advertencia',
                    text: 'Debe seleccionar al menos un periodo',
                    color: 'warning',
                    position: 'top-right'
                });
                return;
            }
            this.f_get_pedidos_periodos();
        },
        limpiarSeleccion() {
            this.periodoSelect = null;
            this.pedidos = [];
            this.filtroEstado = 'todos';
            this.fechaInicio = this.obtenerPrimerDiaMes();
            this.fechaFin = this.obtenerFechaActual();
            this.mostrarFechas = true;
            this.$vs.notify({
                title: 'Limpiado',
                text: 'Selección de periodos limpiada',
                color: 'success',
                position: 'top-right'
            });
        },
        cambiarFiltroEstado() {
            if (this.filtroEstado === 'sin_fecha') {
                // Sin rango de fecha: ocultar campos de fecha y consultar directo sin fechas
                this.mostrarFechas = false;
                if (this.periodoSelect && this.periodoSelect.length > 0) {
                    this.f_get_pedidos_periodos();
                }
                return;
            }

            // Para los demás filtros: mostrar campos de fecha
            this.mostrarFechas = true;
            
            // Asegurar que existan fechas si no hay ninguna
            if (!this.fechaInicio) {
                this.fechaInicio = this.obtenerPrimerDiaMes();
            }
            if (!this.fechaFin) {
                this.fechaFin = this.obtenerFechaActual();
            }

            // Consultar automáticamente si hay periodos y fechas definidas
            if (this.periodoSelect && this.periodoSelect.length > 0 && this.fechaInicio && this.fechaFin) {
                this.f_get_pedidos_periodos();
            }
        },
        aplicarFiltroFechas() {
            const validacion = this.validarFechas();
            
            if (!validacion.valido) {
                this.$vs.notify({
                    title: 'Advertencia',
                    text: validacion.mensaje,
                    color: 'warning',
                    position: 'top-right'
                });
                return;
            }

            if (!this.fechaInicio || !this.fechaFin) {
                this.$vs.notify({
                    title: 'Advertencia',
                    text: 'Debe seleccionar fecha de inicio y fin',
                    color: 'warning',
                    position: 'top-right'
                });
                return;
            }
            this.f_get_pedidos_periodos();
        },
        exportar() {
            let me = this;

            if (!me.pedidos || me.pedidos.length === 0) {
                me.$vs.notify({
                    title: 'Advertencia',
                    text: 'No hay datos para exportar',
                    color: 'warning',
                    position: 'top-right'
                });
                return;
            }

            const asNumber = (value) => {
                const num = parseFloat(value);
                return Number.isFinite(num) ? num : 0;
            };

            const formatNumber = (value) => {
                const num = asNumber(value);
                return Number(num.toFixed(2));
            };

            const detalleData = [];
            const resumenData = [];

            me.pedidos.forEach((pedido) => {
                const asesor = `${pedido.asesor_nombres || ''} ${pedido.asesor_apellidos || ''}`.trim();
                const pagos = Array.isArray(pedido.todos_los_pagos) ? pedido.todos_los_pagos : [];

                resumenData.push({
                    contrato: pedido.contrato_generado || '',
                    institucion: pedido.nombreInstitucion || '',
                    descuento: asNumber(pedido.descuento),
                    valor_liquidado: me.calcularVentaBrutaTotal(pedido),
                    estado_contrato: pedido.estado_liquidacion || 'N/A',
                    convenio: pedido.convenio || (asNumber(pedido.convenio_global) > 0 ? 'si' : 'no'),
                    asesor: asesor,
                    tipo_venta: pedido.tipo_venta_descr || '',
                    periodo: pedido.nombre_periodo || '',
                    convenio_global: asNumber(pedido.convenio_global),
                    convenio_pagado: formatNumber(pedido.valor_convenio_pagado),
                    convenio_x_pagar: formatNumber(pedido.convenio_x_pagar),
                    pagos_pendientes: formatNumber(pedido.pagosPendientes),
                    pagos_pagados: formatNumber(pedido.pagosLiquidaciones),
                    pagos_x_pagar: formatNumber(pedido.pagos_x_pagar),
                    tiempo_anios: pedido.convenio_anios || '',
                    inicio_convenio: pedido.inicio_convenio === 'Sin convenio' ? '' : pedido.inicio_convenio || '',
                    estado_convenio: pedido.estado_convenio === 'Sin convenio' ? '' : pedido.estado_convenio || '',
                    cantidad_pagos: asNumber(pedido.cantidad_pagos_total),
                    total_pagado: formatNumber(pedido.total_pagado),
                    total_x_pagar: formatNumber(pedido.total_x_pagar),
                });

                pagos.forEach((pago) => {
                    let fechaSolo = '';
                    let horaSolo = '';
                    let fechaEmisionSolo = '';
                    let fechaPagoSolo = '';
                    let fechaProximoPagoSolo = '';
                    
                    if (pago.fecha_registro) {
                        const fechaCompleta = pago.fecha_registro.split(' ');
                        fechaSolo = fechaCompleta[0] || '';
                        horaSolo = fechaCompleta[1] || '';
                    }
                    
                    if (pago.fecha_emision_factura) {
                        const fechaCompleta = pago.fecha_emision_factura.split(' ');
                        fechaEmisionSolo = fechaCompleta[0] || '';
                    }
                    
                    if (pago.fecha_pago_factura) {
                        const fechaCompleta = pago.fecha_pago_factura.split(' ');
                        fechaPagoSolo = fechaCompleta[0] || '';
                    }

                    if (pago.fecha_proximo_pago) {
                        const fechaCompleta = pago.fecha_proximo_pago.split(' ');
                        fechaProximoPagoSolo = fechaCompleta[0] || '';
                    }

                    // Formatear número de factura con ceros a la izquierda
                    let numFacturaFormateado = '';
                    if (pago.num_factura && pago.num_factura !== '' && pago.num_factura !== null) {
                        numFacturaFormateado = String(pago.num_factura).padStart(9, '0');
                    }
                    
                    detalleData.push({
                        contrato: pedido.contrato_generado || '',
                        institucion: pedido.nombreInstitucion || '',
                        descuento: asNumber(pedido.descuento),
                        valor_liquidado: me.calcularVentaBrutaTotal(pedido),
                        convenio: pedido.convenio || (asNumber(pedido.convenio_global) > 0 ? 'si' : 'no'),
                        asesor: asesor,
                        tipo_venta: pedido.tipo_venta_descr || '',
                        periodo: pedido.nombre_periodo || '',
                        beneficiario: pago.razon_social || pago.nombre_completo || 'N/A',
                        documento_dni: pago.documento_dni || '',
                        subtotal: formatNumber(pago.subtotal),
                        iva: formatNumber(pago.iva_valor),
                        retencion: formatNumber(pago.retencion),
                        total: formatNumber(pago.total_calculado),
                        tipo_pago: pago.tipo_pago_texto || '',
                        forma_pago: pago.forma_pago_nombre || 'N/A',
                        estado: pago.estado_texto || '',
                        num_factura: numFacturaFormateado,
                        fecha_emision: fechaEmisionSolo,
                        fecha_pago: fechaPagoSolo,
                        fecha_registro: fechaSolo,
                        fecha_proximo_pago: fechaProximoPagoSolo,
                        hora_registro: horaSolo,
                    });
                });
            });

            const headersDetalle = [
                'Contrato',
                'Institución',
                'Comisión %',
                'Valor Liquidado',
                'Convenio',
                'Asesor',
                'Tipo Venta',
                'Periodo',
                'Beneficiario',
                'CI/RUC',
                'Subtotal',
                'IVA',
                'Retención',
                'Total',
                'Tipo Pago',
                'Forma Pago',
                'Estado de pago',
                'Núm. Factura',
                'Fecha Emisión',
                'Fecha Pago',
                'Fecha Registro',
                'Fecha Próximo Pago',
            ];

            const headersResumen = [
                'Contrato',
                'Institución',
                'Comisión %',
                'Valor Liquidado',
                'Estado Contrato',
                'Convenio',
                'Asesor',
                'Tipo Venta',
                'Periodo',
                'Convenio Global',
                'Convenio Pagado',
                'Convenio x Pagar',
                // 'Pagos Pendientes',
                'Pagos Realizados',
                'Pagos x Pagar',
                'Tiempo Años',
                'Inicio Convenio',
                'Estado Convenio',
                'Cantidad Pagos',
                'Total Pagado',
                'Total x Pagar',
            ];

            const buildSheet = (rows, headerLabels, keys) => {
                const matrix = [headerLabels];
                rows.forEach((row) => {
                    matrix.push(keys.map((key) => row[key] !== undefined && row[key] !== null ? row[key] : ''));
                });
                return XLSX.utils.aoa_to_sheet(matrix);
            };

            const wsDetalle = buildSheet(detalleData, headersDetalle, [
                'contrato',
                'institucion',
                'descuento',
                'valor_liquidado',
                'convenio',
                'asesor',
                'tipo_venta',
                'periodo',
                'beneficiario',
                'documento_dni',
                'subtotal',
                'iva',
                'retencion',
                'total',
                'tipo_pago',
                'forma_pago',
                'estado',
                'num_factura',
                'fecha_emision',
                'fecha_pago',
                'fecha_registro',
                'fecha_proximo_pago',
            ]);

            const wsResumen = buildSheet(resumenData, headersResumen, [
                'contrato',
                'institucion',
                'descuento',
                'valor_liquidado',
                'estado_contrato',
                'convenio',
                'asesor',
                'tipo_venta',
                'periodo',
                'convenio_global',
                'convenio_pagado',
                'convenio_x_pagar',
                // 'pagos_pendientes',
                'pagos_pagados',
                'pagos_x_pagar',
                'tiempo_anios',
                'inicio_convenio',
                'estado_convenio',
                'cantidad_pagos',
                'total_pagado',
                'total_x_pagar',
            ]);
            wsDetalle['!cols'] = [
                { wch: 16 },  // Contrato
                { wch: 34 },  // Institución
                { wch: 12 },  // Comisión %
                { wch: 16 },  // Valor Liquidado
                { wch: 10 },  // Convenio
                { wch: 24 },  // Asesor
                { wch: 16 },  // Tipo Venta
                { wch: 16 },  // Periodo
                { wch: 34 },  // Beneficiario
                { wch: 16 },  // CI/RUC
                { wch: 12 },  // Subtotal
                { wch: 12 },  // IVA
                { wch: 12 },  // Retención
                { wch: 12 },  // Total
                { wch: 16 },  // Tipo Pago
                { wch: 16 },  // Forma Pago
                { wch: 12 },  // Estado de Pago
                { wch: 14 },  // Núm. Factura
                { wch: 14 },  // Fecha Emisión
                { wch: 14 },  // Fecha Pago
                { wch: 14 },  // Fecha Registro
                { wch: 16 },  // Fecha Próximo Pago
            ];

            // Aplicar formato de texto a la columna de número de factura (columna R, índice 17)
            const numFacturaColIndex = 17; // Núm. Factura es la columna 18 (índice 17)
            const range = XLSX.utils.decode_range(wsDetalle['!ref']);
            
            for (let row = range.s.r + 1; row <= range.e.r; row++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: numFacturaColIndex });
                if (wsDetalle[cellAddress]) {
                    wsDetalle[cellAddress].z = '@'; // Formato de texto
                    wsDetalle[cellAddress].t = 's'; // Tipo string
                }
            }
            wsResumen['!cols'] = [
                { wch: 36 },  // Contrato
                { wch: 36 },  // Institución
                { wch: 12 },  // Comisión %
                { wch: 16 },  // Valor Liquidado
                { wch: 18 },  // Estado Contrato
                { wch: 10 },  // Convenio
                { wch: 18 },  // Asesor
                { wch: 16 },  // Tipo Venta
                { wch: 16 },  // Periodo
                { wch: 14 },  // Convenio Global
                { wch: 14 },  // Convenio Pagado
                { wch: 14 },  // Convenio x Pagar
                // { wch: 14 },  // Pagos Pendientes
                { wch: 14 },  // Pagos Realizados
                { wch: 14 },  // Pagos x Pagar
                { wch: 12 },  // Tiempo Años
                { wch: 16 },  // Inicio Convenio
                { wch: 16 },  // Estado Convenio
                { wch: 14 },  // Cantidad Pagos
                { wch: 14 },  // Total Pagado
                { wch: 14 },  // Total x Pagar
            ];

            // ── PESTAÑA 3: Detalle + Resumen (datos del contrato repetidos en cada fila para tablas dinámicas) ──
            const headersCombinado = [
                // — Columnas del Detalle de Pagos —
                'Contrato',
                'Institución',
                'Comisión %',
                'Valor Liquidado',
                'Estado Contrato',
                'Convenio',
                'Asesor',
                'Tipo Venta',
                'Periodo',
                'Beneficiario',
                'CI/RUC',
                'Subtotal',
                'IVA',
                'Retención',
                'Total',
                'Tipo Pago',
                'Forma Pago',
                'Estado de Pago',
                'Núm. Factura',
                'Fecha Emisión Factura',
                'Fecha Pago Factura',
                'Fecha Registro',
                'Fecha Próximo Pago',
                // — Columnas del resumen (repetidas en cada fila del mismo contrato) —
                'Convenio Global',
                'Convenio Pagado',
                'Convenio x Pagar',
                'Pagos Realizados',
                'Pagos x Pagar',
                'Tiempo Años',
                'Inicio Convenio',
                'Estado Convenio',
                'Cantidad Pagos',
                'Total Pagado',
                'Total x Pagar',
            ];

            const combinadoData = [];

            me.pedidos.forEach((pedido) => {
                const asesor = `${pedido.asesor_nombres || ''} ${pedido.asesor_apellidos || ''}`.trim();
                const pagos = Array.isArray(pedido.todos_los_pagos) ? pedido.todos_los_pagos : [];

                // Datos del contrato/pedido — se repiten en cada fila de pago
                const datosContrato = {
                    contrato: pedido.contrato_generado || '',
                    institucion: pedido.nombreInstitucion || '',
                    comision: asNumber(pedido.descuento),
                    valorLiquidado: formatNumber(me.calcularVentaBrutaTotal(pedido)),
                    estadoContrato: pedido.estado_liquidacion || 'N/A',
                    convenio: pedido.convenio || (asNumber(pedido.convenio_global) > 0 ? 'si' : 'no'),
                    asesor,
                    tipoVenta: pedido.tipo_venta_descr || '',
                    periodo: pedido.nombre_periodo || '',
                    convenioGlobal: asNumber(pedido.convenio_global),
                    convenioPagado: formatNumber(pedido.valor_convenio_pagado),
                    convenioXPagar: formatNumber(pedido.convenio_x_pagar),
                    pagosRealizados: formatNumber(pedido.pagosLiquidaciones),
                    pagosXPagar: formatNumber(pedido.pagos_x_pagar),
                    tiempoAnios: pedido.convenio_anios || '',
                    inicioConvenio: pedido.inicio_convenio === 'Sin convenio' ? '' : pedido.inicio_convenio || '',
                    estadoConvenio: pedido.estado_convenio === 'Sin convenio' ? '' : pedido.estado_convenio || '',
                    cantidadPagos: asNumber(pedido.cantidad_pagos_total),
                    totalPagado: formatNumber(pedido.total_pagado),
                    totalXPagar: formatNumber(pedido.total_x_pagar),
                };

                // Si no hay pagos, igual generamos una fila con los datos del resumen
                const filas = pagos.length > 0 ? pagos : [null];

                filas.forEach((pago) => {
                    let fechaSolo = '', horaSolo = '', fechaEmisionSolo = '', fechaPagoSolo = '', fechaProximoPagoSolo = '';
                    let numFacturaFormateado = '';

                    if (pago) {
                        if (pago.fecha_registro) {
                            const partes = pago.fecha_registro.split(' ');
                            fechaSolo = partes[0] || '';
                            horaSolo = partes[1] || '';
                        }
                        if (pago.fecha_emision_factura) {
                            fechaEmisionSolo = (pago.fecha_emision_factura.split(' ')[0]) || '';
                        }
                        if (pago.fecha_pago_factura) {
                            fechaPagoSolo = (pago.fecha_pago_factura.split(' ')[0]) || '';
                        }
                        if (pago.fecha_proximo_pago) {
                            fechaProximoPagoSolo = (pago.fecha_proximo_pago.split(' ')[0]) || '';
                        }
                        if (pago.num_factura && pago.num_factura !== '' && pago.num_factura !== null) {
                            numFacturaFormateado = String(pago.num_factura).padStart(9, '0');
                        }
                    }

                    const fila = [
                        // Contrato / resumen — repetido en cada fila
                        datosContrato.contrato,
                        datosContrato.institucion,
                        datosContrato.comision,
                        datosContrato.valorLiquidado,
                        datosContrato.estadoContrato,
                        datosContrato.convenio,
                        datosContrato.asesor,
                        datosContrato.tipoVenta,
                        datosContrato.periodo,
                        // Detalle del pago
                        pago ? (pago.razon_social || pago.nombre_completo || 'N/A') : '',
                        pago ? (pago.documento_dni || '') : '',
                        pago ? formatNumber(pago.subtotal) : '',
                        pago ? formatNumber(pago.iva_valor) : '',
                        pago ? formatNumber(pago.retencion) : '',
                        pago ? formatNumber(pago.total_calculado) : '',
                        pago ? (pago.tipo_pago_texto || '') : '',
                        pago ? (pago.forma_pago_nombre || 'N/A') : '',
                        pago ? (pago.estado_texto || '') : '',
                        numFacturaFormateado,
                        fechaEmisionSolo,
                        fechaPagoSolo,
                        fechaSolo,
                        pago ? fechaProximoPagoSolo : '',
                        // Resumen — repetido en cada fila
                        datosContrato.convenioGlobal,
                        datosContrato.convenioPagado,
                        datosContrato.convenioXPagar,
                        datosContrato.pagosRealizados,
                        datosContrato.pagosXPagar,
                        datosContrato.tiempoAnios,
                        datosContrato.inicioConvenio,
                        datosContrato.estadoConvenio,
                        datosContrato.cantidadPagos,
                        datosContrato.totalPagado,
                        datosContrato.totalXPagar,
                    ];

                    combinadoData.push(fila);
                });
            });

            const wsCombinado = XLSX.utils.aoa_to_sheet([headersCombinado, ...combinadoData]);

            wsCombinado['!cols'] = [
                { wch: 16 },  // Contrato
                { wch: 34 },  // Institución
                { wch: 12 },  // Comisión %
                { wch: 16 },  // Valor Liquidado
                { wch: 18 },  // Estado Contrato
                { wch: 10 },  // Convenio
                { wch: 24 },  // Asesor
                { wch: 16 },  // Tipo Venta
                { wch: 16 },  // Periodo
                { wch: 34 },  // Beneficiario
                { wch: 16 },  // CI/RUC
                { wch: 12 },  // Subtotal
                { wch: 12 },  // IVA
                { wch: 12 },  // Retención
                { wch: 12 },  // Total
                { wch: 16 },  // Tipo Pago
                { wch: 16 },  // Forma Pago
                { wch: 12 },  // Estado de Pago
                { wch: 14 },  // Núm. Factura
                { wch: 14 },  // Fecha Emisión
                { wch: 14 },  // Fecha Pago
                { wch: 14 },  // Fecha Registro
                { wch: 16 },  // Fecha Próximo Pago
                { wch: 16 },  // Convenio Global
                { wch: 16 },  // Convenio Pagado
                { wch: 16 },  // Convenio x Pagar
                { wch: 16 },  // Pagos Realizados
                { wch: 16 },  // Pagos x Pagar
                { wch: 12 },  // Tiempo Años
                { wch: 16 },  // Inicio Convenio
                { wch: 16 },  // Estado Convenio
                { wch: 14 },  // Cantidad Pagos
                { wch: 14 },  // Total Pagado
                { wch: 14 },  // Total x Pagar
            ];

            // Aplicar formato texto a Núm. Factura en la hoja combinada (col índice 18)
            const rangeComb = XLSX.utils.decode_range(wsCombinado['!ref']);
            for (let row = rangeComb.s.r + 1; row <= rangeComb.e.r; row++) {
                const cellAddr = XLSX.utils.encode_cell({ r: row, c: 18 });
                if (wsCombinado[cellAddr]) {
                    wsCombinado[cellAddr].z = '@';
                    wsCombinado[cellAddr].t = 's';
                }
            }

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Pagos');
            XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Institucion');
            XLSX.utils.book_append_sheet(wb, wsCombinado, 'Detalle + Resumen');
            XLSX.writeFile(wb, 'reporte_detalle_pagos_por_periodo.xlsx');
        }
    }
}
</script>

<style scoped>
.report-card-shell {
    border-radius: 18px;
    overflow: hidden;
}

/* Badge informativo para opción sin_fecha */
.report-sinFecha-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #e0f2fe, #bae6fd);
    border: 1px solid #7dd3fc;
    color: #0369a1;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
}


/* ============================================================
   HERO HEADER — Dark corporate gradient
   ============================================================ */
.report-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    border-radius: 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.22), 0 4px 10px rgba(29, 78, 216, 0.18);
    position: relative;
    overflow: hidden;
}

.report-hero::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%);
    pointer-events: none;
}

.report-hero__left {
    min-width: 0;
    flex: 1;
}

.report-hero__copy {
    min-width: 0;
}

.report-hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    padding: 4px 10px;
    border-radius: 9999px;
    background: rgba(255,255,255,0.12);
    color: #93c5fd;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
    border: 1px solid rgba(147,197,253,0.25);
}

.report-hero__title {
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 6px 0;
}

.report-hero__subtitle {
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    line-height: 1.4;
}

.report-hero__actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
    flex-shrink: 0;
}

/* ============================================================
   ACTION BUTTONS — Premium pill style
   ============================================================ */
.report-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    height: 36px;
    padding: 0 16px;
    font-size: 11px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    letter-spacing: 0.01em;
    white-space: nowrap;
}

.report-action-btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
    box-shadow: 0 6px 18px rgba(0,0,0,0.22);
}

.report-action-btn:active {
    transform: translateY(0);
}

.report-btn-icon {
    font-size: 13px;
    line-height: 1;
}

.report-btn-primary {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
}

.report-btn-secondary {
    background: rgba(255,255,255,0.14);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.22);
    box-shadow: none;
}

.report-btn-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* ============================================================
   KPI STAT CARDS
   ============================================================ */
.report-stats-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 14px;
}

.report-stat-card {
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    padding: 16px 18px 14px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
}

.report-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
}

.report-stat-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 0 0 16px 16px;
}

.report-stat-card--blue::after   { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.report-stat-card--slate::after  { background: linear-gradient(90deg, #64748b, #94a3b8); }
.report-stat-card--emerald::after { background: linear-gradient(90deg, #059669, #34d399); }
.report-stat-card--indigo::after { background: linear-gradient(90deg, #4f46e5, #818cf8); }
.report-stat-card--amber::after  { background: linear-gradient(90deg, #d97706, #f59e0b); }

.report-stat-card--blue   { border-top: 3px solid #3b82f6; }
.report-stat-card--slate  { border-top: 3px solid #64748b; }
.report-stat-card--emerald { border-top: 3px solid #059669; }
.report-stat-card--indigo { border-top: 3px solid #4f46e5; }
.report-stat-card--amber  { border-top: 3px solid #d97706; }

.report-stat-icon {
    font-size: 20px;
    line-height: 1;
    margin-bottom: 6px;
}

.report-stat-label {
    display: block;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
}

.report-stat-value {
    display: block;
    margin-top: 3px;
    font-size: 20px;
    line-height: 1.1;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.01em;
}

.report-stat-helper {
    display: block;
    margin-top: 3px;
    font-size: 9px;
    color: #94a3b8;
}

.report-toolbar {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 12px;
    align-items: start;
}

.report-filter-card,
.report-search-card,
.report-table-shell {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.report-filter-card {
    padding: 16px;
    min-height: 100%;
}

.report-filter-card__label {
    margin-bottom: 8px;
}

.report-filter-card__title {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: #1e293b;
}

.report-filter-card__subtitle {
    display: block;
    margin-top: 1px;
    font-size: 11px;
    color: #64748b;
}

/* Estilos para radio buttons */
.report-radio-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 9999px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.report-radio-label:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}

.report-radio-input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #3b82f6;
}

.report-radio-text {
    font-size: 12px;
    font-weight: 600;
    color: #334155;
}

/* Estilos para inputs de fecha */
.report-date-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    margin-bottom: 4px;
}

.report-date-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 12px;
    color: #0f172a;
    background: #ffffff;
    transition: all 0.2s ease;
}

.report-date-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.report-select {
    border-radius: 14px;
}

.report-search-card {
    padding: 14px;
    min-height: 100%;
    display: flex;
    align-items: center;
}

.report-search-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: linear-gradient(135deg, #eff6ff, #f8fafc);
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    letter-spacing: 0.02em;
    flex: 0 0 auto;
}

.report-search-input {
    background: #ffffff;
    color: #0f172a;
    min-height: 34px;
    font-size: 13px;
}

.report-search-count {
    white-space: nowrap;
    font-size: 11px;
    font-weight: 700;
    color: #334155;
    padding: 6px 8px;
    border-radius: 9999px;
    background: #f8fafc;
    border: 1px solid #dbe4f0;
}

.report-table {
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.report-table-fixed {
    table-layout: fixed;
}

.report-col-institution {
    width: 25%;
}

.report-col-summary {
    width: 29%;
}

.report-col-payments {
    width: 46%;
}

.report-table-head {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    color: #ffffff;
}

.report-table-head th {
    color: #e2e8f0 !important;
    border-bottom: 2px solid rgba(255,255,255,0.08);
    letter-spacing: 0.1em;
}

.report-th-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 20px;
    padding: 0 6px;
    border-radius: 9999px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: #93c5fd;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
}

.report-table tbody tr {
    border-bottom: 1px solid #e8edf3 !important;
    position: relative;
}

.report-row-hover:hover {
    background: linear-gradient(90deg, #f0f7ff 0%, #f8fafc 100%);
    transition: background 0.2s ease;
    z-index: 1;
}

.report-cell-soft {
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
}

.report-cell-accent {
    background: linear-gradient(180deg, #fbfcfd 0%, #f5f7fa 100%);
}

.report-cell-white {
    background: #ffffff;
}

.report-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
}

.report-panel--institution,
.report-panel--summary,
.report-panel--payments,
.report-panel--empty {
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #ffffff;
    padding: 14px 16px;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.03);
}

.report-panel--summary .report-section-title {
    font-size: 12px;
}

.report-panel--summary .report-section-eyebrow {
    font-size: 9px;
}

.report-panel--summary .report-mini-card__label {
    font-size: 9px;
}

.report-panel--summary .report-mini-card__value {
    font-size: 11px;
}

.report-section-header {
    padding-bottom: 8px;
    border-bottom: 1px solid #e8edf3;
}

.report-section-header--compact {
    padding-bottom: 7px;
}

.report-section-eyebrow {
    display: inline-block;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 2px;
}

.report-section-title {
    font-size: 13px;
    line-height: 1.05;
    font-weight: 800;
    color: #0f172a;
}

.report-title-tight {
    margin-top: 0;
}

.report-section-subtitle {
    margin-top: 1px;
    font-size: 10px;
    color: #64748b;
}

.report-summary-head {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.report-summary-list {
    display: grid;
    gap: 4px;
}

.report-summary-list--institution {
    grid-template-columns: 1fr;
}

.report-summary-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 7px 10px;
    border-radius: 10px;
    background: #fbfdff;
    border: 1px solid #e5e7eb;
    min-width: 0;
}

.report-summary-row--split {
    justify-content: space-between;
}

.report-summary-row--financial {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 8px;
    min-height: 32px;
}

.report-summary-row--financial .report-mini-card__label {
    white-space: nowrap;
    flex: 1 1 auto;
    min-width: 0;
}

.report-summary-row--financial .report-mini-card__value {
    text-align: right;
    white-space: nowrap;
    flex: 0 1 auto;
    min-width: 0;
}

.report-financial-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 5px;
}

.report-financial-column {
    display: grid;
    gap: 5px;
    min-width: 0;
}

.report-mini-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border-radius: 14px;
    background: #fbfdff;
    border: 1px solid #e5e7eb;
}

.report-inline-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    padding: 8px;
    border-radius: 12px;
    background: #fbfdff;
    border: 1px solid #e5e7eb;
}

.report-mini-card__row {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.report-mini-card__label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    line-height: 1.05;
}

.report-mini-card__value {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.1;
    word-break: break-word;
}

.report-mini-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.report-badge,
.report-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    padding: 3px 8px;
    border-radius: 9999px;
    font-size: 9px;
    font-weight: 700;
    border: 1px solid transparent;
}

.report-badge--blue,
.report-tag--blue {
    background: #dbeafe;
    color: #1d4ed8;
    border-color: #93c5fd;
    font-weight: 800;
}

.report-badge--slate {
    background: #f1f5f9;
    color: #475569;
    border-color: #cbd5e1;
    font-weight: 700;
}

.report-tag--purple {
    background: #ede9fe;
    color: #6d28d9;
    border-color: #c4b5fd;
    font-weight: 800;
}

.report-tag--indigo {
    background: #e0e7ff;
    color: #3730a3;
    border-color: #a5b4fc;
    font-weight: 800;
}

.report-tag--teal {
    background: #ccfbf1;
    color: #0f766e;
    border-color: #5eead4;
    font-weight: 800;
}

.report-tag--green {
    background: #dcfce7;
    color: #15803d;
    border-color: #86efac;
    font-weight: 800;
}

.report-tag--amber {
    background: #fef3c7;
    color: #92400e;
    border-color: #fcd34d;
    font-weight: 800;
}

.report-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
}

.report-kpi-box {
    padding: 7px 8px;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.report-kpi-label {
    display: block;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #64748b;
}

.report-kpi-value {
    display: block;
    margin-top: 0;
    font-size: 11px;
    font-weight: 800;
    color: #0f172a;
}

.report-info-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    padding: 10px 12px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.report-info-strip--compact {
    margin-top: 2px;
}

.report-meta-line {
    display: flex;
    flex-wrap: wrap;
    gap: 3px 8px;
    padding: 4px 6px;
    border-radius: 10px;
    background: #fbfdff;
    border: 1px solid #e5e7eb;
    font-size: 9px;
    color: #475569;
}

.report-info-label {
    display: block;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
}

.report-info-value {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    font-weight: 700;
    color: #0f172a;
}

.report-total-band {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
    gap: 6px;
}

.report-total-band--compact {
    margin-bottom: 6px;
}

.report-total-band__item {
    padding: 8px 10px;
    border-radius: 12px;
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
    border: 1px solid #a7f3d0;
    min-width: 0;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.08);
}

.report-total-band__label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    line-height: 1.05;
    white-space: nowrap;
}

.report-total-band__value {
    display: block;
    margin-top: 2px;
    font-size: 15px;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
}

.report-total-band__value--positive {
    color: #047857;
    font-size: 16px;
}

.report-total-band__value--warning {
    color: #b45309;
    font-size: 16px;
}

.report-total-band__value--danger {
    color: #dc2626;
    font-size: 16px;
    font-weight: 700;
}

.report-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    margin-top: 8px;
    font-size: 11px;
    font-weight: 600;
}

.report-alert--danger {
    background-color: #dc2626;
    border: 1px solid #b91c1c;
    color: #ffffff;
}

.report-alert--warning {
    background-color: #f59e0b;
    border: 1px solid #d97706;
    color: #ffffff;
}

.report-alert__icon {
    font-size: 14px;
}

.report-alert__text {
    flex: 1;
}

.report-payment-head {
    padding: 0;
}

.report-payment-total {
    font-size: 12px;
    font-weight: 800;
    color: #334155;
}

.report-payment-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
}

.report-payment-metric {
    padding: 10px 12px;
    border-radius: 10px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
}

.report-payment-metric__label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #64748b;
}

.report-payment-metric__value {
    display: block;
    margin-top: 2px;
    font-size: 14px;
    line-height: 1;
    font-weight: 800;
    color: #0f172a;
}

.report-payment-metric--green {
    border-left: 3px solid #10b981;
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
}

.report-payment-metric--amber {
    border-left: 3px solid #f59e0b;
    background: linear-gradient(135deg, #fffbeb, #fef9e7);
}

.report-payment-metric--teal {
    border-left: 3px solid #14b8a6;
    background: linear-gradient(135deg, #f0fdfa, #e8fdf8);
}

.report-payment-metric--orange {
    border-left: 3px solid #f97316;
    background: linear-gradient(135deg, #fff7ed, #fef3e8);
}

.report-inner-table {
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
}

.report-inner-table__table {
    table-layout: fixed;
    font-size: 10px;
    min-width: 800px;
    width: 100%;
}

.report-pay-col-id { width: 36px; }
.report-pay-col-benef { width: 120px; }
.report-pay-col-subtotal { width: 54px; }
.report-pay-col-iva { width: 46px; }
.report-pay-col-ret { width: 46px; }
.report-pay-col-total { width: 58px; }
.report-pay-col-type { width: 74px; }
.report-pay-col-forma { width: 62px; }
.report-pay-col-estado { width: 66px; }
.report-pay-col-factura { width: 62px; }
.report-pay-col-fechas { width: 110px; }
.report-pay-col-hora { width: 65px; }

.report-dates-stack {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.report-date-row {
    display: flex;
    align-items: center;
    gap: 4px;
    line-height: 1.2;
    padding: 2px 0;
    position: relative;
    z-index: 2;
}

.report-date-label-inline {
    font-size: 7px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
    padding: 2px 5px;
    border-radius: 4px;
    min-width: 28px;
    text-align: center;
    position: relative;
    z-index: 2;
}

.report-date-label--registro {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #93c5fd;
}

.report-date-label--emision {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
}

.report-date-label--pago {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #6ee7b7;
}

.report-date-value {
    font-size: 9px;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
}

.report-hora-value {
    font-size: 9px;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
}

.report-date-empty {
    color: #94a3b8;
    font-style: italic;
}

.report-inner-table-head {
    background: linear-gradient(90deg, #1e293b, #334155);
}

.report-inner-table-head th {
    border-bottom: 1px solid rgba(255,255,255,0.1);
    color: #cbd5e1 !important;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    padding-left: 4px !important;
    padding-right: 4px !important;
    font-size: 9px !important;
    font-weight: 800 !important;
    letter-spacing: 0.08em;
    line-height: 1.05;
    white-space: nowrap;
}

.report-inner-row {
    border-bottom: 1px solid #eef2f7;
    position: relative;
}

.report-inner-row:hover {
    background: #f0f7ff;
    z-index: 1;
}

.report-inner-row td {
    padding-top: 6px !important;
    padding-bottom: 6px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    vertical-align: top;
    font-size: 10px;
}

.report-inner-row td:nth-child(2) p {
    line-height: 1.0;
    word-break: break-word;
}

.tabla-pagos-interna {
    border: 1px solid #e2e8f0 !important;
    border-radius: 14px;
}

.kpi-card {
    border-radius: 14px;
    padding: 14px 16px;
    border-left: 4px solid transparent;
    background: #fff;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
}

.report-empty-state {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 18px;
    border-radius: 18px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    color: #475569;
}

@media (max-width: 1024px) {
    .report-stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .report-toolbar {
        grid-template-columns: 1fr;
    }

    .report-hero {
        flex-direction: column;
    }
}

@media (max-width: 1550px) {
    .report-financial-columns {
        grid-template-columns: 1fr;
    }
}

/* ============================================================
   MOBILE PAYMENT CARDS — hidden by default, shown on small screens
   ============================================================ */
.report-inner-cards--mobile {
    display: none;
}

.report-pago-card {
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background: #ffffff;
    padding: 12px;
    margin-bottom: 8px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    transition: box-shadow 0.2s ease;
}

.report-pago-card:last-child {
    margin-bottom: 0;
}

.report-pago-card:hover {
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

.report-pago-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
}

.report-pago-card__id {
    font-size: 13px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.01em;
}

.report-pago-card__badges {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.report-pago-card__benef {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-bottom: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
}

.report-pago-card__label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #64748b;
    line-height: 1.2;
}

.report-pago-card__value {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    word-break: break-word;
}

.report-pago-card__value--bold {
    font-weight: 900;
    font-size: 14px;
    color: #047857;
}

.report-pago-card__sub {
    font-size: 10px;
    color: #94a3b8;
}

.report-pago-card__amounts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 10px;
}

.report-pago-card__amount {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 10px;
    background: #fbfdff;
    border: 1px solid #e5e7eb;
}

.report-pago-card__amount--total {
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
    border-color: #a7f3d0;
}

.report-pago-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
    .report-card-shell .container {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }

    .report-hero {
        padding: 12px;
        gap: 10px;
    }

    .report-hero__title {
        font-size: 14px;
    }

    .report-stats-grid {
        gap: 5px;
        margin-bottom: 6px;
    }

    .report-stats-grid {
        grid-template-columns: 1fr;
    }

    .report-toolbar {
        gap: 8px;
    }

    .report-filter-card,
    .report-search-card,
    .report-table-shell {
        border-radius: 14px;
    }

    .report-filter-card {
        padding: 10px;
    }

    .report-search-card {
        padding: 8px;
    }

    .report-action-btn {
        width: 100%;
    }

    .report-table-shell {
        overflow-x: visible;
    }

    .report-table-fixed {
        table-layout: auto;
    }

    .report-table,
    .report-table thead,
    .report-table tbody,
    .report-table tr,
    .report-table th,
    .report-table td {
        display: block;
        width: 100%;
    }

    .report-table-head {
        display: none;
    }

    .report-table tbody tr {
        margin-bottom: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        background: #ffffff;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
    }

    .report-table tbody td {
        padding: 8px !important;
    }

    .report-panel--institution,
    .report-panel--summary,
    .report-panel--payments,
    .report-panel--empty {
        padding: 8px;
    }

    .report-financial-columns,
    .report-payment-grid {
        grid-template-columns: 1fr;
    }

    /* Hide desktop table, show mobile cards */
    .report-inner-table--desktop {
        display: none !important;
    }

    .report-inner-cards--mobile {
        display: block !important;
    }

    .report-payment-total {
        font-size: 8px;
    }

    .report-mini-badges {
        gap: 3px;
    }
}

.report-card-shell :deep(.vs-inputx),
.report-card-shell :deep(input),
.report-card-shell :deep(select) {
    border-radius: 12px !important;
}

.report-card-shell :deep(.vs-button) {
    border-radius: 9999px !important;
    text-transform: none;
    letter-spacing: 0;
}
</style>
