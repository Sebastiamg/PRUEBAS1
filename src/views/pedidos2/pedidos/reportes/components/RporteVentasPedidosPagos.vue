<template>
<div>
    <h1 class="mt-5">Reporte de adopciones y pagos</h1>
    <br>

    <!-- Botón ojito -->
    <vs-button type="flat" class="p-2" icon-pack="fa" :icon="showTable ? 'fa-eye-slash' : 'fa-eye'" @click="showTable = !showTable" color="primary" title="Mostrar/Ocultar tabla" />

    <!-- Controles -->
    <div class="mt-3 flex flex-wrap items-center gap-3 md:gap-4">
        <!-- Botón cargar -->
        <vs-button @click="f_getReporte" class="p-2">
            <i class="fa-solid fa-rotate-right"></i> Cargar reporte
        </vs-button>

        <!-- Botón exportar -->
        <vs-button @click="f_exportar" color="success" class="p-2">
            <i class="fa-solid fa-file-arrow-down"></i> Exportar
        </vs-button>

        <!-- Select filtro distribuidor -->
        <div class="flex flex-col min-w-[220px] md:min-w-[250px]">
            <span>Filtrar por distribuidor:</span>
            <v-select :options="opcionesDistribuidor" :reduce="opt => opt.value" label="label" placeholder="--Seleccione--" v-model="filtroDistribuidor" class="w-full" />
            <span v-if="filtroDistribuidor !== 'todos'" class="text-xs text-orange-600 mt-1">
                Filtro activo: {{ arrayFiltrado.length }} de {{ arrayReporte.length }} contratos
            </span>
        </div>
        <div>
            <ul class="leftx">
                <li class="flex">
                    Tipo de venta
                </li>
                <li>
                    <vs-radio v-model="tipoVenta" vs-name="radios1tipoVenta" vs-value="3">Todos</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="tipoVenta" vs-name="radios1tipoVenta" vs-value="1">Directa</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="tipoVenta" vs-name="radios1tipoVenta" vs-value="2">Lista</vs-radio>
                </li>

            </ul>
        </div>
    </div>

    <!-- Cards de Totales -->
    <div v-if="arrayFiltrado.length > 0" class="mt-6">
        <div class="kpi-scroll-wrapper">
            <div class="kpi-grid">

                <!-- 1. Adopciones (Venta Bruta) -->
                <div class="kpi-card kpi-card--centered">
                    <div class="kpi-card__top">
                        <span class="kpi-card__label">
                            <vx-tooltip text="Total de ventas brutas del período según pedidos registrados (antes de descontar comisión)" position="top">
                                Adopciones <i class="fa-solid fa-circle-info kpi-card__info-ico"></i>
                            </vx-tooltip>
                        </span>
                        <i class="fa-solid fa-chart-line kpi-card__ico"></i>
                    </div>
                    <p class="kpi-card__val">{{ totalVentaBruta | filtrarDecimal }}</p>
                    <p class="kpi-card__sub">Venta Bruta</p>
                    <div class="kpi-card__breakdown kpi-card__breakdown--venta">
                        <div class="kpi-breakdown-item">
                            <span class="kpi-breakdown-item__label">
                                <i class="fa-solid fa-file-invoice"></i> Pedidos
                            </span>
                            <span class="kpi-breakdown-item__val">{{ totalVentaPedido | filtrarDecimal }}</span>
                        </div>
                        <div class="kpi-breakdown-item">
                            <span class="kpi-breakdown-item__label">
                                <i class="fa-solid fa-layer-group"></i> Alcance
                            </span>
                            <span class="kpi-breakdown-item__val">{{ totalVentaAlcance | filtrarDecimal }}</span>
                        </div>
                    </div>
                    <div class="kpi-card__breakdown">
                        <div class="kpi-breakdown-item">
                            <span class="kpi-breakdown-item__label">
                                <i class="fa-solid fa-store"></i> Venta Directa
                            </span>
                            <span class="kpi-breakdown-item__val">{{ totalVentaBrutaDirecta | filtrarDecimal }}</span>
                        </div>
                        <div class="kpi-breakdown-item">
                            <span class="kpi-breakdown-item__label">
                                <i class="fa-solid fa-list-check"></i> Venta Lista
                            </span>
                            <span class="kpi-breakdown-item__val">{{ totalVentaBrutaLista | filtrarDecimal }}</span>
                        </div>
                    </div>
                </div>

                <!-- 2. Adop. − Comisión (Venta Neta) -->
                <div class="kpi-card kpi-card--centered">
                    <div class="kpi-card__top">
                        <span class="kpi-card__label">
                            <vx-tooltip text="Venta Bruta menos la comisión del asesor. Es lo que efectivamente recibe la empresa." position="top">
                                Venta Neta <i class="fa-solid fa-circle-info kpi-card__info-ico"></i>
                            </vx-tooltip>
                        </span>
                        <i class="fa-solid fa-tags kpi-card__ico"></i>
                    </div>
                    <p class="kpi-card__val">{{ totalVentaNeta | filtrarDecimal }}</p>
                    <p class="kpi-card__sub">Adopciones − Comisión</p>
                    <div class="kpi-card__breakdown">
                        <div class="kpi-breakdown-item">
                            <span class="kpi-breakdown-item__label">
                                <i class="fa-solid fa-store"></i> Venta Directa
                            </span>
                            <span class="kpi-breakdown-item__val">{{ totalVentaNetaDirecta | filtrarDecimal }}</span>
                        </div>
                        <div class="kpi-breakdown-item">
                            <span class="kpi-breakdown-item__label">
                                <i class="fa-solid fa-list-check"></i> Venta Lista
                            </span>
                            <span class="kpi-breakdown-item__val">{{ totalVentaNetaLista | filtrarDecimal }}</span>
                        </div>
                    </div>
                </div>

                <!-- 3. Comisión y Pagos — card ancho unificado -->
                <div class="kpi-card kpi-card--wide">
                    <div class="kpi-card__top">
                        <span class="kpi-card__label">
                            <vx-tooltip text="Seguimiento completo de la comisión del asesor: cuánto se generó, cuánto se ha pagado (cerrado), cuánto está pendiente de aprobar y cuánto falta por pagar." position="top">
                                Comisión y Pagos <i class="fa-solid fa-circle-info kpi-card__info-ico"></i>
                            </vx-tooltip>
                        </span>
                        <i class="fa-solid fa-coins kpi-card__ico"></i>
                    </div>

                    <!-- Ecuación principal -->
                    <div class="kpi-eq">
                        <div class="kpi-eq__item">
                            <vx-tooltip text="Comisión total calculada: Venta Bruta × % comisión del asesor" position="top">
                                <p class="kpi-card__sub kpi-card__sub--link">Total comisión <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></p>
                            </vx-tooltip>
                            <p class="kpi-card__val">{{ totalValorComision | filtrarDecimal }}</p>
                            <div class="kpi-eq__breakdown">
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-store"></i> Directa</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalValorComisionDirecta | filtrarDecimal }}</span>
                                </div>
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-list-check"></i> Lista</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalValorComisionLista | filtrarDecimal }}</span>
                                </div>
                            </div>
                        </div>
                        <span class="kpi-eq__op">−</span>
                        <div class="kpi-eq__item">
                            <vx-tooltip text="Pagos ya aprobados y cerrados (anticipos, liquidaciones, convenios). Cada vez que se cierra un documento, este valor sube." position="top">
                                <p class="kpi-card__sub kpi-card__sub--link">Pagos cerrados <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></p>
                            </vx-tooltip>
                            <p class="kpi-card__val kpi-card__val--green">{{ totalPagado | filtrarDecimal }}</p>
                            <div class="kpi-eq__breakdown">
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-store"></i> Directa</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalPagadoDirecta | filtrarDecimal }}</span>
                                </div>
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-list-check"></i> Lista</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalPagadoLista | filtrarDecimal }}</span>
                                </div>
                            </div>
                        </div>
                        <span class="kpi-eq__op">=</span>
                        <div class="kpi-eq__item">
                            <vx-tooltip text="Lo que aún falta de la comisión sin contar los documentos pendientes. Llega a 0 cuando todos los pagos están cerrados." position="top">
                                <p class="kpi-card__sub kpi-card__sub--link">Por liquidar <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></p>
                            </vx-tooltip>
                            <p class="kpi-card__val" :class="totalValorPendientePagarComision > 0 ? 'kpi-card__val--orange' : 'kpi-card__val--green'">
                                {{ totalValorPendientePagarComision | filtrarDecimal }}
                            </p>
                            <div class="kpi-eq__breakdown">
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-store"></i> Directa</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalValorPendientePagarComisionDirecta | filtrarDecimal }}</span>
                                </div>
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-list-check"></i> Lista</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalValorPendientePagarComisionLista | filtrarDecimal }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Barra de progreso -->
                    <div class="kpi-progress">
                        <div class="kpi-progress__track">
                            <div class="kpi-progress__fill" :style="{ width: totalPagadoPercentage + '%' }"></div>
                        </div>
                        <span class="kpi-progress__pct">
                            {{ totalPagadoPercentage }}% pagado
                        </span>
                    </div>

                    <!-- Separador + fila de docs por cerrar -->
                    <div class="kpi-divider"></div>
                    <div class="kpi-pending-row" :class="{ 'kpi-pending-row--clickable': totalPorPagar > 0 }" @click="totalPorPagar > 0 && f_abrirPorPagarGlobal()" :title="totalPorPagar > 0 ? 'Clic para ver desglose por contrato' : ''">
                        <div class="kpi-pending-row__left">
                            <i class="fa-solid fa-hourglass-half kpi-pending-row__ico"></i>
                            <div>
                                <vx-tooltip text="Documentos registrados (anticipos, liquidaciones, convenios) que aún NO han sido cerrados o falta completar los pagos. Clic para ver el desglose por contrato." position="top">
                                    <span class="kpi-pending-row__label">Pagos Pendientes de Cerrar <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></span>
                                </vx-tooltip>
                                <p class="kpi-pending-row__hint">
                                    Al cerrarse o registrarse → pasan a Pagos cerrados
                                    <span v-if="totalPorPagar > 0" class="kpi-pending-row__action"> · Ver por contrato →</span>
                                </p>
                            </div>
                        </div>
                        <div class="kpi-pending-row__right">
                            <span class="kpi-pending-row__val" :class="totalPorPagar > 0 ? 'kpi-card__val--red' : ''">
                                {{ totalPorPagar | filtrarDecimal }}
                            </span>
                            <div class="kpi-eq__breakdown kpi-pending-row__breakdown">
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-store"></i> Directa</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalPorPagarDirecta | filtrarDecimal }}</span>
                                </div>
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-list-check"></i> Lista</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalPorPagarLista | filtrarDecimal }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. Deudas Anteriores — solo tipo 6, sin mezclar con comisión -->
                <div class="kpi-card kpi-card--wide kpi-card--deuda-anterior">
                    <div class="kpi-card__top">
                        <span class="kpi-card__label">
                            <vx-tooltip text="Pagos tipo deuda anterior (tipo_pago_id = 6). Separado del card Comisión y Pagos." position="top">
                                Deudas Anteriores <i class="fa-solid fa-circle-info kpi-card__info-ico"></i>
                            </vx-tooltip>
                        </span>
                        <i class="fa-solid fa-clock-rotate-left kpi-card__ico"></i>
                    </div>

                    <div class="kpi-deuda-anterior-block">
                        <vx-tooltip text="Suma de pedidos_pagos_detalles cerrados (estado=1) en documentos tipo 6 del periodo." position="top">
                            <p class="kpi-card__sub kpi-card__sub--link">Pagos cerrados <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></p>
                        </vx-tooltip>
                        <p class="kpi-card__val kpi-card__val--green">{{ totalDeudaAnteriorCerrada | filtrarDecimal }}</p>
                        <div class="kpi-eq__breakdown">
                            <div class="kpi-eq__breakdown-row">
                                <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-store"></i> Directa</span>
                                <span class="kpi-eq__breakdown-val">{{ totalDeudaAnteriorCerradaDirecta | filtrarDecimal }}</span>
                            </div>
                            <div class="kpi-eq__breakdown-row">
                                <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-list-check"></i> Lista</span>
                                <span class="kpi-eq__breakdown-val">{{ totalDeudaAnteriorCerradaLista | filtrarDecimal }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="kpi-divider"></div>

                    <div class="kpi-pending-row" :class="{ 'kpi-pending-row--clickable': totalDeudaAnteriorPendienteCerrar > 0 }" @click="totalDeudaAnteriorPendienteCerrar > 0 && f_abrirDeudaAnteriorGlobal()" :title="totalDeudaAnteriorPendienteCerrar > 0 ? 'Clic para ver contratos con deuda anterior pendiente' : ''">
                        <div class="kpi-pending-row__left">
                            <i class="fa-solid fa-hourglass-half kpi-pending-row__ico"></i>
                            <div>
                                <vx-tooltip text="Pagos de deuda anterior (tipo 6) sin cerrar o por registrar en el periodo." position="top">
                                    <span class="kpi-pending-row__label">Pagos Pendientes de Cerrar <i class="fa-solid fa-circle-info kpi-card__info-ico"></i></span>
                                </vx-tooltip>
                                <p class="kpi-pending-row__hint">
                                    Al cerrarse → pasan a Pagos cerrados
                                    <span v-if="totalDeudaAnteriorPendienteCerrar > 0" class="kpi-pending-row__action"> · Ver por contrato →</span>
                                </p>
                            </div>
                        </div>
                        <div class="kpi-pending-row__right">
                            <span class="kpi-pending-row__val" :class="totalDeudaAnteriorPendienteCerrar > 0 ? 'kpi-card__val--red' : ''">
                                {{ totalDeudaAnteriorPendienteCerrar | filtrarDecimal }}
                            </span>
                            <div class="kpi-eq__breakdown kpi-pending-row__breakdown">
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-store"></i> Directa</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalDeudaAnteriorPendienteCerrarDirecta | filtrarDecimal }}</span>
                                </div>
                                <div class="kpi-eq__breakdown-row">
                                    <span class="kpi-eq__breakdown-label"><i class="fa-solid fa-list-check"></i> Lista</span>
                                    <span class="kpi-eq__breakdown-val">{{ totalDeudaAnteriorPendienteCerrarLista | filtrarDecimal }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 5. Venta Liquidada -->
                <div class="kpi-card">
                    <div class="kpi-card__top">
                        <span class="kpi-card__label">
                            <vx-tooltip text="Ventas que ya fueron liquidadas: con códigos entregados o marcadas como liquidadas sin códigos. Es el monto real cobrado/cerrado del ciclo de ventas." position="top">
                                Venta Liquidada <i class="fa-solid fa-circle-info kpi-card__info-ico"></i>
                            </vx-tooltip>
                        </span>
                        <i class="fa-solid fa-file-invoice-dollar kpi-card__ico"></i>
                    </div>
                    <p class="kpi-card__val">{{ totalVentaBrutaLiquidado | filtrarDecimal }}</p>
                    <p class="kpi-card__sub">Liquidado y sin códigos</p>
                </div>

            </div>
        </div>
    </div>

    <!-- Tabla -->
    <vs-table v-if="showTable" max-items="10" search pagination :data="arrayFiltrado" class="mt-6" stripe>
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b>{{ arrayFiltrado.length }}</b></vs-chip>
        </template>

        <template slot="thead">
            <vs-th width="250" sort-key="nombreInstitucion">Institución</vs-th>
            <vs-th width="120" sort-key="ventaBruta">Pedidos Venta Bruta</vs-th>
            <vs-th width="100" sort-key="comision">Comisión (%)</vs-th>
            <vs-th width="120" sort-key="valorComision">Valor comisión</vs-th>
            <vs-th width="120" sort-key="ven_neta">Pedidos Venta Neta</vs-th>
            <vs-th width="130" sort-key="venta_bruta_liquidado">Venta Bruta Liquidado</vs-th>
            <vs-th width="150" sort-key="venta_bruta_documentos_devolucion">
                <vx-tooltip text="Venta bruta original − devoluciones (docs. venta directa)" position="top" color="primary">
                    <span class="cursor-help">Venta Documentos (bruta - devolución) <i class="fa-solid fa-circle-info text-blue-400"></i></span>
                </vx-tooltip>
            </vs-th>
            <vs-th width="150" sort-key="venta_neta_documentos_devolucion">
                <vx-tooltip text="Venta neta original − devoluciones (docs. venta directa)" position="top" color="success">
                    <span class="cursor-help">Venta Documentos (neta - devolución) <i class="fa-solid fa-circle-info text-emerald-500"></i></span>
                </vx-tooltip>
            </vs-th>
            <vs-th width="150" sort-key="valor_pendiente_pagar_comision">
                <vx-tooltip text="Total Comisión - Pagos" position="top" color="warning">
                    <span class="cursor-help">Por liquidar <i class="fa-solid fa-circle-info text-orange-400"></i></span>
                </vx-tooltip>
            </vs-th>
            <vs-th width="120" sort-key="total_pagado_comision">
                <vx-tooltip text="Pagos cerrados de comisión (anticipos, liquidaciones, convenio). Sin deuda anterior." position="top" color="primary">
                    <span class="cursor-help">Pagos <i class="fa-solid fa-circle-info text-blue-400"></i></span>
                </vx-tooltip>
            </vs-th>
            <vs-th width="120" sort-key="totalDeudaAnterior">
                <vx-tooltip text="Pagos cerrados tipo deuda anterior (tipo_pago_id = 6)." position="top" color="primary">
                    <span class="cursor-help">Deuda Anterior <i class="fa-solid fa-circle-info text-violet-500"></i></span>
                </vx-tooltip>
            </vs-th>
            <vs-th width="120" sort-key="total_x_pagar_comision">Por Pagar/ Por registrarse</vs-th>
        </template>

        <template slot-scope="{ data }">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    # {{ tr.id_institucion }} <br>
                    {{ tr.nombreInstitucion }} <br>
                    <b>Ruc:</b>
                    <p>{{ tr.ruc }}</p>
                    <b>Contrato:</b>
                    <p>{{ tr.contrato_generado }}</p>
                    <b>Asesor:</b>
                    <p>{{ tr.asesor }}</p>
                    <b>Tipo venta:</b>
                    <p>{{ tr.tipo_venta_descr }}</p>
                    <b>Es Distribuidor:</b>
                    <p>{{ tr.EsDistribuidor }}</p>
                    <b>Convenio global:</b>
                    <p>{{ tr.convenio_global | filtrarDecimal }}</p>
                    <b>Años convenio:</b>
                    <p>{{ tr.convenio_anios != null && tr.convenio_anios !== '' ? tr.convenio_anios : '—' }}</p>
                    <b>Periodo inicio convenio:</b>
                    <p>{{ tr.convenio_periodo_inicio || '—' }}</p>
                    <b>Estado liquidación:</b>
                    <p>
                        <span :class="claseEstadoLiquidacion(tr.estado_liquidacion)">
                            {{ tr.estado_liquidacion || 'N/A' }}
                        </span>
                    </p>
                </vs-td>
                <vs-td>
                    <vx-tooltip :text="`Total Pedidos: ${tr.ventaPedido.toFixed(2)} | Total Alcance: ${tr.ventaAlcance.toFixed(2)}`" position="top" color="primary">
                        {{ tr.ventaBruta | filtrarDecimal }}
                    </vx-tooltip>
                </vs-td>
                <vs-td>{{ tr.comision }}%</vs-td>
                <vs-td>
                    {{ tr.valorComision | filtrarDecimal }}
                </vs-td>
                <vs-td>{{ tr.ven_neta.toFixed(2) }}</vs-td>
                <vs-td>
                    <vx-tooltip :text="Number(tr.total_verificaciones) > 0 ? `Liquidado con verificaciones (${tr.total_verificaciones})` : 'Sin verificaciones, usa venta bruta del pedido'" position="top" color="primary">
                        {{ tr.venta_bruta_liquidado | filtrarDecimal }}
                    </vx-tooltip>
                </vs-td>
                <vs-td>
                    <div class="doc-col">
                        <vx-tooltip :text="f_tooltipDocumentosBruta(tr)" position="top" color="primary">
                            <span class="cursor-help">{{ tr.venta_bruta_documentos_devolucion | filtrarDecimal }}</span>
                        </vx-tooltip>
                        <vs-button v-if="parseInt(tr.cantidad_documentos_venta || 0) > 0" type="flat" size="small" color="primary" icon="visibility" class="doc-col__btn" title="Ver detalle documentos (bruta)" @click="f_verDocumentosVenta(tr, 'bruta')" />
                    </div>
                </vs-td>
                <vs-td>
                    <div class="doc-col">
                        <vx-tooltip :text="f_tooltipDocumentosNeta(tr)" position="top" color="success">
                            <span class="cursor-help">{{ tr.venta_neta_documentos_devolucion | filtrarDecimal }}</span>
                        </vx-tooltip>
                        <vs-button v-if="parseInt(tr.cantidad_documentos_venta || 0) > 0" type="flat" size="small" color="success" icon="visibility" class="doc-col__btn" title="Ver detalle documentos (neta)" @click="f_verDocumentosVenta(tr, 'neta')" />
                    </div>
                </vs-td>
                <vs-td>
                    <vx-tooltip :text="`Total Comisión: ${parseFloat(tr.valorComision||0).toFixed(2)} - Pagos: ${f_totalPagadoComision(tr).toFixed(2)}`" position="top" color="warning">
                        <span :class="parseFloat(tr.valor_pendiente_pagar_comision||0) > 0 ? 'text-orange-600 font-semibold' : 'text-emerald-600 font-semibold'">
                            {{ tr.valor_pendiente_pagar_comision | filtrarDecimal }}
                        </span>
                    </vx-tooltip>
                </vs-td>
                <vs-td>
                    <vx-tooltip :text="f_tooltipPagosComision(tr)" position="top" color="primary">
                        {{ f_totalPagadoComision(tr) | filtrarDecimal }}
                    </vx-tooltip>
                </vs-td>
                <vs-td>
                    <div class="doc-col">
                        <vx-tooltip :text="f_tooltipDeudaAnterior(tr)" position="top" color="primary">
                            <span :class="parseFloat(tr.totalDeudaAnterior || 0) > 0 ? 'text-violet-700 font-semibold' : ''">
                                {{ parseFloat(tr.totalDeudaAnterior || 0) | filtrarDecimal }}
                            </span>
                        </vx-tooltip>
                        <vs-button
                            v-if="f_deudaAnteriorPendienteCerrar(tr) > 0"
                            type="flat"
                            size="small"
                            color="warning"
                            icon="visibility"
                            class="doc-col__btn"
                            title="Ver deuda anterior pendiente"
                            @click="f_abrirDeudaAnteriorContrato(tr)" />
                    </div>
                </vs-td>
                <vs-td>
                    <div class="doc-col">
                        <vx-tooltip :text="`Conv. por pagar: ${parseFloat(tr.convenio_x_pagar || 0).toFixed(2)} | Anticipos/Liquidaciones por pagar: ${f_pagosXPagarComision(tr).toFixed(2)}`" position="top" color="primary">
                            <span>{{ f_totalXPagarComision(tr) | filtrarDecimal }}</span>
                        </vx-tooltip>
                        <vs-button v-if="f_totalXPagarComision(tr) > 0" type="flat" size="small" color="warning" icon="visibility" class="doc-col__btn" title="Ver detalle por pagar" @click="f_verDetallePorPagar(tr)" />
                    </div>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>

    <vs-popup class="popup-documentos-venta" :title="tituloPopupDocumentos" fullscreen :active.sync="popupDocumentos">
        <div v-if="pedidoDocumentosSeleccionado">
            <p class="doc-popup__meta">
                <b>Contrato:</b> {{ pedidoDocumentosSeleccionado.contrato_generado }} |
                <b>Pedido tipo:</b> {{ pedidoDocumentosSeleccionado.tipo_venta_descr }} |
                <b>Documentos:</b> {{ cargandoDocumentosPopup ? '...' : documentosPopup.length }}
            </p>

            <p v-if="cargandoDocumentosPopup" class="doc-detalle-panel__loading">Cargando documentos...</p>

            <template v-else>
            <div class="doc-resumen-grid">
                <div class="doc-resumen-card" :class="tipoDetalleDocumentos === 'bruta' ? 'doc-resumen-card--active' : ''">
                    <span class="doc-resumen-card__label">Bruta original</span>
                    <b>{{ totalDocumentosPopupBrutaOriginal | filtrarDecimal }}</b>
                </div>
                <div class="doc-resumen-card doc-resumen-card--dev">
                    <span class="doc-resumen-card__label">Devolución bruta</span>
                    <b>{{ f_formatearDevolucion(totalDocumentosPopupDevueltoBruto) }}</b>
                </div>
                <div class="doc-resumen-card" :class="tipoDetalleDocumentos === 'bruta' ? 'doc-resumen-card--active' : ''">
                    <span class="doc-resumen-card__label">Bruta − devolución</span>
                    <b>{{ totalDocumentosPopupBruta | filtrarDecimal }}</b>
                </div>
                <div class="doc-resumen-card" :class="tipoDetalleDocumentos === 'neta' ? 'doc-resumen-card--active' : ''">
                    <span class="doc-resumen-card__label">Neta original</span>
                    <b>{{ totalDocumentosPopupNetaOriginal | filtrarDecimal }}</b>
                </div>
                <div class="doc-resumen-card doc-resumen-card--dev">
                    <span class="doc-resumen-card__label">Devolución neta</span>
                    <b>{{ f_formatearDevolucion(totalDocumentosPopupDevueltoNeta) }}</b>
                </div>
                <div class="doc-resumen-card" :class="tipoDetalleDocumentos === 'neta' ? 'doc-resumen-card--active' : ''">
                    <span class="doc-resumen-card__label">Neta − devolución</span>
                    <b>{{ totalDocumentosPopupNeta | filtrarDecimal }}</b>
                </div>
            </div>

            <p class="doc-popup__hint">
                Descuento neta: formato nuevo usa <b>f_detalle_venta.descuento</b> por línea;
                formato anterior usa <b>f_venta.ven_desc_por</b> de cabecera.
            </p>

            <vs-table :data="documentosPopup" stripe class="mt-3">
                <template slot="thead">
                    <vs-th width="40"></vs-th>
                    <vs-th>Documento</vs-th>
                    <vs-th>Empresa</vs-th>
                    <vs-th>Tipo doc.</vs-th>
                    <vs-th>Tipo venta doc.</vs-th>
                    <vs-th>Fecha</vs-th>
                    <vs-th>Bruta orig.</vs-th>
                    <vs-th>Dev. bruta</vs-th>
                    <vs-th :class="tipoDetalleDocumentos === 'bruta' ? 'doc-col--highlight' : ''">Bruta − dev.</vs-th>
                    <vs-th>Neta orig.</vs-th>
                    <vs-th>Dev. neta</vs-th>
                    <vs-th :class="tipoDetalleDocumentos === 'neta' ? 'doc-col--highlight' : ''">Neta − dev.</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <template v-for="(doc, idx) in data">
                        <vs-tr :key="'doc-' + idx">
                            <vs-td>
                                <vs-button
                                    type="flat"
                                    size="small"
                                    :icon="documentoDetalleExpandido === f_docKey(doc) ? 'expand_less' : 'expand_more'"
                                    class="doc-col__btn"
                                    title="Ver f_detalle_venta"
                                    @click="f_toggleDetalleDocumento(doc)" />
                            </vs-td>
                            <vs-td>{{ doc.ven_codigo }}</vs-td>
                            <vs-td>{{ doc.empresa || doc.id_empresa }}</vs-td>
                            <vs-td>{{ doc.tipo_documento || doc.idtipodoc }}</vs-td>
                            <vs-td>
                                <span :class="doc.tip_ven_codigo === 2 ? 'doc-tipo-lista' : ''">
                                    {{ doc.tipo_venta_documento }}
                                </span>
                            </vs-td>
                            <vs-td>{{ doc.ven_fecha || '—' }}</vs-td>
                            <vs-td>{{ parseFloat(doc.venta_bruta_original || 0).toFixed(2) }}</vs-td>
                            <vs-td>
                                <span v-if="parseFloat(doc.valor_devuelto_bruto || 0) > 0" class="doc-devolucion">
                                    {{ parseFloat(doc.cantidad_devuelta || 0).toFixed(0) }} u / {{ parseFloat(doc.valor_devuelto_bruto || 0).toFixed(2) }}
                                </span>
                                <span v-else class="text-muted">—</span>
                            </vs-td>
                            <vs-td :class="tipoDetalleDocumentos === 'bruta' ? 'doc-col--highlight' : ''">
                                {{ parseFloat(doc.venta_bruta || 0).toFixed(2) }}
                            </vs-td>
                            <vs-td>{{ parseFloat(doc.venta_neta_original || 0).toFixed(2) }}</vs-td>
                            <vs-td>
                                <span v-if="parseFloat(doc.valor_devuelto_neta || 0) > 0" class="doc-devolucion">
                                    {{ parseFloat(doc.valor_devuelto_neta || 0).toFixed(2) }}
                                </span>
                                <span v-else class="text-muted">—</span>
                            </vs-td>
                            <vs-td :class="tipoDetalleDocumentos === 'neta' ? 'doc-col--highlight' : ''">
                                {{ parseFloat(doc.venta_neta || 0).toFixed(2) }}
                            </vs-td>
                        </vs-tr>
                        <vs-tr v-if="documentoDetalleExpandido === f_docKey(doc)" :key="'det-' + idx" class="doc-detalle-row">
                            <vs-td colspan="12">
                                <div class="doc-detalle-panel">
                                    <p class="doc-detalle-panel__title">
                                        Detalle f_detalle_venta — {{ doc.ven_codigo }}
                                    </p>
                                    <p v-if="cargandoDetalleDocumento === f_docKey(doc)" class="doc-detalle-panel__loading">
                                        Cargando detalle...
                                    </p>
                                    <vs-table v-else :data="f_getDetalleDocumento(doc)" stripe>
                                        <template slot="thead">
                                            <vs-th>Código</vs-th>
                                            <vs-th>Producto</vs-th>
                                            <vs-th>Facturado</vs-th>
                                            <vs-th>Devuelto</vs-th>
                                            <vs-th>Cant. neta</vs-th>
                                            <vs-th>Precio u.</vs-th>
                                            <vs-th>Desc. %</vs-th>
                                            <vs-th>Bruta original</vs-th>
                                            <vs-th>Neta original</vs-th>
                                            <vs-th :class="tipoDetalleDocumentos === 'bruta' ? 'doc-col--highlight' : ''">Bruta − devolución</vs-th>
                                            <vs-th :class="tipoDetalleDocumentos === 'neta' ? 'doc-col--highlight' : ''">Neta − devolución</vs-th>
                                        </template>
                                        <template slot-scope="{ data: lineas }">
                                            <vs-tr
                                                v-for="(linea, lineaIdx) in lineas"
                                                :key="lineaIdx"
                                                :class="parseFloat(linea.cantidad_devuelta || 0) > 0 ? 'doc-detalle-row--dev' : ''">
                                                <vs-td>{{ linea.pro_codigo }}</vs-td>
                                                <vs-td>{{ linea.producto || linea.descripcionlibro || '—' }}</vs-td>
                                                <vs-td>{{ parseFloat(linea.det_ven_cantidad || 0).toFixed(0) }}</vs-td>
                                                <vs-td>{{ parseFloat(linea.cantidad_devuelta || 0).toFixed(0) }}</vs-td>
                                                <vs-td>{{ parseFloat(linea.cantidad_neta || 0).toFixed(0) }}</vs-td>
                                                <vs-td>{{ parseFloat(linea.det_ven_valor_u || 0).toFixed(2) }}</vs-td>
                                                <vs-td>{{ parseFloat(linea.descuento_aplicado || 0).toFixed(2) }}%</vs-td>
                                                <vs-td>{{ parseFloat(linea.venta_bruta_original || 0).toFixed(2) }}</vs-td>
                                                <vs-td>{{ parseFloat(linea.venta_neta_original || 0).toFixed(2) }}</vs-td>
                                                <vs-td :class="tipoDetalleDocumentos === 'bruta' ? 'doc-col--highlight' : ''">
                                                    {{ parseFloat(linea.venta_bruta || 0).toFixed(2) }}
                                                </vs-td>
                                                <vs-td :class="tipoDetalleDocumentos === 'neta' ? 'doc-col--highlight' : ''">
                                                    {{ parseFloat(linea.venta_neta || 0).toFixed(2) }}
                                                </vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </template>
            </vs-table>

            <div v-if="itemsDevueltosPopupData.length || cargandoItemsDevueltos" class="doc-devueltos-section">
                <p class="doc-detalle-panel__title">
                    Ítems devueltos ({{ itemsDevueltosPopupData.length }})
                </p>
                <p v-if="cargandoItemsDevueltos" class="doc-detalle-panel__loading">Cargando ítems devueltos...</p>
                <vs-table v-else :data="itemsDevueltosPopupData" stripe>
                    <template slot="thead">
                        <vs-th>Documento</vs-th>
                        <vs-th>Producto</vs-th>
                        <vs-th>Código</vs-th>
                        <vs-th>Facturado</vs-th>
                        <vs-th>Devuelto</vs-th>
                        <vs-th>Precio u.</vs-th>
                        <vs-th>Desc. %</vs-th>
                        <vs-th>Dev. bruta</vs-th>
                        <vs-th>Dev. neta</vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr v-for="(item, itemIdx) in data" :key="itemIdx" class="doc-detalle-row--dev">
                            <vs-td>{{ item.ven_codigo }}</vs-td>
                            <vs-td>{{ item.producto || item.descripcionlibro || '—' }}</vs-td>
                            <vs-td>{{ item.pro_codigo }}</vs-td>
                            <vs-td>{{ parseFloat(item.det_ven_cantidad || 0).toFixed(0) }}</vs-td>
                            <vs-td>{{ parseFloat(item.cantidad_devuelta || 0).toFixed(0) }}</vs-td>
                            <vs-td>{{ parseFloat(item.det_ven_valor_u || 0).toFixed(2) }}</vs-td>
                            <vs-td>{{ parseFloat(item.descuento_aplicado || 0).toFixed(2) }}%</vs-td>
                            <vs-td class="doc-devolucion">{{ parseFloat(item.valor_devuelto_bruto || 0).toFixed(2) }}</vs-td>
                            <vs-td class="doc-devolucion">{{ parseFloat(item.valor_devuelto_neta || 0).toFixed(2) }}</vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>

            <div class="doc-popup__totales">
                <span v-if="tipoDetalleDocumentos === 'bruta'">
                    Cabecera (solo venta directa):
                    <b>{{ f_formulaCabeceraDocumentos(
                        pedidoDocumentosSeleccionado.venta_bruta_documentos_original,
                        pedidoDocumentosSeleccionado.valor_devuelto_bruto_documentos,
                        pedidoDocumentosSeleccionado.venta_bruta_documentos_devolucion
                    ) }}</b>
                </span>
                <span v-else>
                    Cabecera (solo venta directa):
                    <b>{{ f_formulaCabeceraDocumentos(
                        pedidoDocumentosSeleccionado.venta_neta_documentos_original,
                        pedidoDocumentosSeleccionado.valor_devuelto_neta_documentos,
                        pedidoDocumentosSeleccionado.venta_neta_documentos_devolucion
                    ) }}</b>
                </span>
            </div>
            </template>
        </div>
    </vs-popup>

    <vs-popup class="popup-por-pagar informacionformhijo" :title="tituloPopupPorPagar" :active.sync="popupPorPagar" fullscreen>
        <!-- Vista global: resumen por contrato -->
        <div v-if="popupPorPagarModo === 'global'">
            <div class="pp-dashboard-hero" :class="{ 'pp-dashboard-hero--dark': themeMode }">
                <!-- Main Total Section -->
                <div class="pp-dashboard-hero__main">
                    <div class="pp-hero-badge-wrap">
                        <span class="pp-dashboard-hero__label">
                            {{ esPopupDeudaAnterior ? 'Total Deuda Anterior Pendiente' : 'Total Saldos Pendientes' }}
                        </span>
                        <span class="pp-dashboard-hero__hint">
                            <template v-if="esPopupDeudaAnterior">
                                {{ contratosConDeudaAnteriorPendiente.length }} contrato{{ contratosConDeudaAnteriorPendiente.length !== 1 ? 's' : '' }} con deuda anterior sin cerrar
                            </template>
                            <template v-else>
                                {{ contratosPorPagarComision.length }} contrato{{ contratosPorPagarComision.length !== 1 ? 's' : '' }} con pendientes
                            </template>
                        </span>
                    </div>
                    <div class="pp-dashboard-hero__val-wrap">
                        <span class="pp-dashboard-hero__val">
                            $ {{ (esPopupDeudaAnterior ? totalDeudaAnteriorPendienteCerrar : totalPorPagar) | filtrarDecimal }}
                        </span>
                    </div>
                </div>

                <!-- Breakdown Divider -->
                <div v-if="esPopupComision" class="pp-dashboard-hero__divider"></div>

                <!-- Breakdown Section -->
                <div v-if="esPopupComision" class="pp-dashboard-hero__breakdown">
                    <div class="pp-breakdown-item pp-breakdown-item--pagos">
                        <div class="pp-breakdown-item__icon">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <div class="pp-breakdown-item__content">
                            <span class="pp-breakdown-item__label">Total Saldos pendientes de Anticipos/Liquidaciones</span>
                            <span class="pp-breakdown-item__val">$ {{ totalPagosXPagarGlobal | filtrarDecimal }}</span>
                        </div>
                    </div>
                    <div class="pp-breakdown-item pp-breakdown-item--convenio">
                        <div class="pp-breakdown-item__icon">
                            <i class="fa-solid fa-handshake"></i>
                        </div>
                        <div class="pp-breakdown-item__content">
                            <span class="pp-breakdown-item__label">Total Saldos pendientes del convenio</span>
                            <span class="pp-breakdown-item__val">$ {{ totalConvenioXPagarGlobal | filtrarDecimal }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p class="por-pagar-global-guide">
                <i class="fa-solid fa-lightbulb"></i>
                Haga clic en <b>Ver Detalle</b> en la columna correspondiente del contrato para ver su desglose específico.
            </p>

            <!-- Filtro tipo saldo — solo comisión y pagos -->
            <div v-if="esPopupComision" class="pp-filtro-saldo">
                <span class="pp-filtro-saldo__label">Filtrar por:</span>
                <div class="pp-filtro-saldo__btns">
                    <button class="pp-filtro-btn" :class="{ 'pp-filtro-btn--active': filtroTipoSaldo === 'todos' }" @click="filtroTipoSaldo = 'todos'">Todos</button>
                    <button class="pp-filtro-btn" :class="{ 'pp-filtro-btn--active': filtroTipoSaldo === 'pagos' }" @click="filtroTipoSaldo = 'pagos'">Anticipos / Liquidaciones</button>
                    <button class="pp-filtro-btn" :class="{ 'pp-filtro-btn--active': filtroTipoSaldo === 'convenio' }" @click="filtroTipoSaldo = 'convenio'">Saldo Convenio</button>
                </div>
            </div>

            <vs-table :data="contratosPorPagarFiltrados" stripe search max-items="8" pagination>
                <template slot="thead">
                    <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                    <vs-th sort-key="contrato_generado">Contrato</vs-th>
                    <vs-th v-if="esPopupComision" sort-key="convenio_periodo_inicio">Datos convenio</vs-th>
                    <vs-th v-if="esPopupComision" sort-key="pagos_x_pagar" class="pp-th-saldo pp-th-saldo--first">
                        Saldo Anticipos / Liquidaciones
                    </vs-th>
                    <vs-th v-if="esPopupComision" sort-key="convenio_x_pagar" class="pp-th-saldo">
                        Saldo Convenio
                    </vs-th>
                    <vs-th v-if="esPopupDeudaAnterior" sort-key="deuda_anterior_pendiente_cerrar" class="pp-th-saldo">
                        Deuda Anterior Pendiente
                    </vs-th>
                    <vs-th sort-key="total_x_pagar" class="pp-th-saldo pp-th-saldo--last">
                        {{ esPopupDeudaAnterior ? 'Total Pendiente' : 'Total Saldos Pendientes' }}
                    </vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="por-pagar-global-row" :class="{ 'por-pagar-global-row--dark': themeMode }">
                        <vs-td>
                            <span class="por-pagar-global-row__inst">{{ tr.nombreInstitucion }}</span>
                        </vs-td>
                        <vs-td>
                            <div class="pp-convenio-info">
                                <span class="pp-convenio-info__global">Contrato:</span>
                                <span class="pp-convenio-info__anios">{{ tr.contrato_generado }}</span>
                                <span class="pp-convenio-info__global">Asesor:</span>
                                <span class="pp-convenio-info__anios">{{ tr.asesor }}</span>
                            </div>
                        </vs-td>
                        <vs-td v-if="esPopupComision">
                            <div v-if="parseFloat(tr.convenio_x_pagar || 0) > 0" class="pp-convenio-info">
                                <span class="pp-convenio-info__global">Convenio Global:</span>
                                <span class="pp-convenio-info__anios">{{ tr.convenio_global | filtrarDecimal }}</span>
                                <span class="pp-convenio-info__global">Período que comenzo:</span>
                                <span v-if="tr.convenio_periodo_inicio" class="pp-convenio-info__anios">{{ tr.convenio_periodo_inicio }}</span>
                                <span v-else class="pp-convenio-info__periodo pp-convenio-info__periodo--empty">—</span>
                                <template v-if="tr.convenio_anios != null && tr.convenio_anios !== ''">
                                    <span class="pp-convenio-info__global">Duración:</span>
                                    <span class="pp-convenio-info__anios">{{ tr.convenio_anios }} {{ tr.convenio_anios == 1 ? 'año' : 'años' }}</span>
                                </template>
                            </div>
                            <span v-else class="pp-na-badge">N/A</span>
                        </vs-td>
                        <vs-td v-if="esPopupComision">
                            <div class="pp-cell-stack">
                                <span v-if="f_pagosXPagarComision(tr) > 0" class="monto-pagos font-bold">
                                    {{ f_pagosXPagarComision(tr) | filtrarDecimal }}
                                </span>
                                <span v-else class="status-sin-valores">
                                    Sin valores pendientes
                                </span>
                                <vs-button 
                                    v-if="f_pagosXPagarComision(tr) > 0"
                                    size="small" 
                                    color="primary" 
                                    type="border" 
                                    icon="visibility" 
                                    class="pp-cell-btn"
                                    @click.stop="f_abrirDetalleColumna(tr, 'pagos')">
                                    Ver Detalle
                                </vs-button>
                            </div>
                        </vs-td>
                        <vs-td v-if="esPopupComision">
                            <div class="pp-cell-stack">
                                <span v-if="parseFloat(tr.convenio_x_pagar || 0) > 0" class="monto-convenio font-bold">
                                    {{ tr.convenio_x_pagar | filtrarDecimal }}
                                </span>
                                <span v-else class="status-sin-valores">
                                    Sin valores pendientes
                                </span>
                                <vs-button 
                                    v-if="parseFloat(tr.convenio_x_pagar || 0) > 0"
                                    size="small" 
                                    color="primary" 
                                    type="border" 
                                    icon="visibility" 
                                    class="pp-cell-btn"
                                    @click.stop="f_abrirDetalleColumna(tr, 'convenio')">
                                    Ver Detalle
                                </vs-button>
                            </div>
                        </vs-td>
                        <vs-td v-if="esPopupDeudaAnterior">
                            <div class="pp-cell-stack">
                                <span v-if="f_deudaAnteriorPendienteCerrar(tr) > 0" class="monto-pagos font-bold">
                                    {{ f_deudaAnteriorPendienteCerrar(tr) | filtrarDecimal }}
                                </span>
                                <span v-else class="status-sin-valores">Sin deuda pendiente</span>
                                <vs-button
                                    v-if="f_deudaAnteriorPendienteCerrar(tr) > 0"
                                    size="small"
                                    color="primary"
                                    type="border"
                                    icon="visibility"
                                    class="pp-cell-btn"
                                    @click.stop="f_verDetallePorPagar(tr, true)">
                                    Ver Detalle
                                </vs-button>
                            </div>
                        </vs-td>
                        <vs-td>
                            <b class="monto-total">
                                {{ (esPopupDeudaAnterior ? f_deudaAnteriorPendienteCerrar(tr) : f_totalXPagarComision(tr)) | filtrarDecimal }}
                            </b>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vs-popup>

    <!-- Popup de Desglose de Detalle de Sección Específica -->
    <vs-popup fullscreen class="popup-por-pagar-detalle-seccion informacionformhijo2" :title="tituloDetalleSeccion" :active.sync="popupDetalleSeccion" style="padding: 5px;">
        <div v-if="pedidoPorPagarSeleccionado && detallePorPagar" class="pp-popup-seccion-body">
            <!-- Cabecera del contrato -->
            <div class="pp-detail-hero" style="margin-top: 0; margin-bottom: 20px;">
                <div class="pp-detail-hero__info">
                    <span class="pp-detail-hero__inst">{{ pedidoPorPagarSeleccionado.nombreInstitucion }}</span>
                    <span class="pp-detail-hero__badge">{{ pedidoPorPagarSeleccionado.contrato_generado }}</span>
                    <span class="pp-detail-hero__asesor">
                        <i class="fa-solid fa-user-tie"></i> Asesor: {{ pedidoPorPagarSeleccionado.asesor }}
                    </span>
                </div>
                <div class="pp-detail-hero__total">
                    <span>Pendiente en esta sección</span>
                    <b v-if="seccionDetalleSeleccionada === 'pagos'">
                        $ {{ parseFloat(detallePorPagar.resumen.pagos_x_pagar || 0).toFixed(2) }}
                    </b>
                    <b v-else>
                        $ {{ parseFloat(detallePorPagar.resumen.convenio_x_pagar || 0).toFixed(2) }}
                    </b>
                </div>
            </div>

            <!-- Sección Pagos -->
            <div v-if="seccionDetalleSeleccionada === 'pagos'">
                <div v-if="detallePorPagar.pagos && detallePorPagar.pagos.length" class="por-pagar-card-list" style="margin-top: 0;">
                    <div v-for="(pago, pagoIdx) in detallePorPagar.pagos" :key="'pago-' + pago.doc_codigo" class="por-pagar-card" style="margin-bottom: 16px;">
                        <div class="por-pagar-card__head">
                            <div class="por-pagar-card__title">
                                <span class="por-pagar-card__index">Pago {{ pagoIdx + 1 }}</span>
                                <span class="por-pagar-card__codigo">#{{ pago.doc_codigo }}</span>
                                <span class="por-pagar-card__tipo">{{ pago.tipo_pago_texto }}</span>
                                <span v-if="pago.doc_observacion" class="por-pagar-card__obs">{{ pago.doc_observacion }}</span>
                            </div>
                            <div class="por-pagar-card__valor-wrap">
                                <span class="por-pagar-card__valor-label">Valor documento</span>
                                <span class="por-pagar-card__valor">{{ parseFloat(pago.doc_valor).toFixed(2) }}</span>
                            </div>
                        </div>

                        <div class="por-pagar-card__body">
                            <!-- Barra de Avance de Pago -->
                            <div class="pp-progress-section">
                                <div class="pp-progress-header">
                                    <span class="pp-progress-title">Estado de Recaudación / Pago</span>
                                    <span class="pp-progress-percentage">{{ f_getClosedPercent(pago) }}% completado</span>
                                </div>
                                <div class="pp-progress-bar-container">
                                    <vx-tooltip v-if="f_getClosedPercent(pago) > 0" :style="{ width: f_getClosedPercent(pago) + '%', minWidth: '5px', height: '100%' }" text="Pagos Cerrados / Recaudados" position="top" color="success">
                                        <div class="pp-progress-bar-segment pp-progress-bar-segment--closed" 
                                             :class="{'pp-progress-bar-segment--dimmed': activeHover.key === pago.doc_codigo && activeHover.type !== 'closed' && activeHover.type !== null}"
                                             @mouseenter="activeHover = { key: pago.doc_codigo, type: 'closed' }"
                                             @mouseleave="activeHover = { key: null, type: null }"
                                             style="width: 100%; min-width: 5px; height: 100%;"></div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="f_getOpenPercent(pago) > 0" :style="{ width: f_getOpenPercent(pago) + '%', minWidth: '5px', height: '100%' }" text="Pagos Abiertos (En Proceso)" position="top" color="warning">
                                        <div class="pp-progress-bar-segment pp-progress-bar-segment--open" 
                                             :class="{'pp-progress-bar-segment--dimmed': activeHover.key === pago.doc_codigo && activeHover.type !== 'open' && activeHover.type !== null}"
                                             @mouseenter="activeHover = { key: pago.doc_codigo, type: 'open' }"
                                             @mouseleave="activeHover = { key: null, type: null }"
                                             style="width: 100%; min-width: 5px; height: 100%;"></div>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="f_getPendingPercent(pago) > 0" :style="{ width: f_getPendingPercent(pago) + '%', minWidth: '5px', height: '100%' }" text="Saldo Pendiente por Registrar" position="top" color="danger">
                                        <div class="pp-progress-bar-segment pp-progress-bar-segment--pending" 
                                             :class="{'pp-progress-bar-segment--dimmed': activeHover.key === pago.doc_codigo && activeHover.type !== 'pending' && activeHover.type !== null}"
                                             @mouseenter="activeHover = { key: pago.doc_codigo, type: 'pending' }"
                                             @mouseleave="activeHover = { key: null, type: null }"
                                             style="width: 100%; min-width: 5px; height: 100%;"></div>
                                    </vx-tooltip>
                                </div>
                                <div class="pp-progress-legend">
                                    <span class="pp-progress-legend-item" 
                                          :class="{'text-bold': activeHover.key === pago.doc_codigo && activeHover.type === 'closed'}"
                                          @mouseenter="activeHover = { key: pago.doc_codigo, type: 'closed' }"
                                          @mouseleave="activeHover = { key: null, type: null }">
                                        <span class="dot dot--closed"></span> Cerrado: {{ f_getClosedPercent(pago) }}%
                                    </span>
                                    <span v-if="parseFloat(pago.total_abierto || 0) > 0" class="pp-progress-legend-item" 
                                          :class="{'text-bold': activeHover.key === pago.doc_codigo && activeHover.type === 'open'}"
                                          @mouseenter="activeHover = { key: pago.doc_codigo, type: 'open' }"
                                          @mouseleave="activeHover = { key: null, type: null }">
                                        <span class="dot dot--open"></span> Abierto (En Proceso): {{ f_getOpenPercent(pago) }}%
                                    </span>
                                    <span v-if="parseFloat(pago.falta_registrar || 0) > 0" class="pp-progress-legend-item" 
                                          :class="{'text-bold': activeHover.key === pago.doc_codigo && activeHover.type === 'pending'}"
                                          @mouseenter="activeHover = { key: pago.doc_codigo, type: 'pending' }"
                                          @mouseleave="activeHover = { key: null, type: null }">
                                        <span class="dot dot--pending"></span> Saldo Pendiente: {{ f_getPendingPercent(pago) }}%
                                    </span>
                                </div>
                            </div>

                            <div class="pp-stats">
                                <div class="pp-stat" 
                                     :class="{'pp-stat--highlight-closed': activeHover.key === pago.doc_codigo && activeHover.type === 'closed'}"
                                     @mouseenter="activeHover = { key: pago.doc_codigo, type: 'closed' }"
                                     @mouseleave="activeHover = { key: null, type: null }">
                                    <span class="pp-stat__label">Total Pago/s Cerrado/s</span>
                                    <span class="pp-stat__val">{{ parseFloat(pago.total_cerrado).toFixed(2) }}</span>
                                </div>
                                <div class="pp-stat" 
                                     :class="{'pp-stat--highlight-open': activeHover.key === pago.doc_codigo && activeHover.type === 'open'}"
                                     @mouseenter="activeHover = { key: pago.doc_codigo, type: 'open' }"
                                     @mouseleave="activeHover = { key: null, type: null }">
                                    <span class="pp-stat__label">Total Pago/s abierto/s</span>
                                    <span class="pp-stat__val">{{ parseFloat(pago.total_abierto).toFixed(2) }}</span>
                                </div>
                                <div class="pp-stat" 
                                     :class="{'pp-stat--highlight-pending': activeHover.key === pago.doc_codigo && activeHover.type === 'pending'}"
                                     @mouseenter="activeHover = { key: pago.doc_codigo, type: 'pending' }"
                                     @mouseleave="activeHover = { key: null, type: null }">
                                    <span class="pp-stat__label">Saldo Pendiente</span>
                                    <span class="pp-stat__val">{{ parseFloat(pago.doc_valor - pago.total_cerrado).toFixed(2) }}</span>
                                    <vx-tooltip v-if="parseFloat(pago.total_abierto || 0) > 0" text="Existen pagos abiertos registrados. Una vez aprobados y cerrados, se descontarán del saldo pendiente." position="top" color="warning">
                                        <div class="pp-stat__pending-alert">
                                            <i class="fa-solid fa-circle-exclamation"></i>
                                            <span>Pagos abiertos en proceso: <b>{{ parseFloat(pago.total_abierto).toFixed(2) }}</b></span>
                                        </div>
                                    </vx-tooltip>
                                </div>
                            </div>

                            <div v-if="pago.detalles_abiertos && pago.detalles_abiertos.length" class="pp-subtable">
                                <p class="pp-subtable__label">Pagos abiertos ({{ pago.detalles_abiertos.length }})</p>
                                <vs-table :data="pago.detalles_abiertos" stripe>
                                    <template slot="thead">
                                        <vs-th>Beneficiario</vs-th>
                                        <vs-th>Descripción</vs-th>
                                        <vs-th>Forma pago</vs-th>
                                        <vs-th>Total</vs-th>
                                    </template>
                                    <template slot-scope="{ data }">
                                        <vs-tr :key="idx" v-for="(det, idx) in data">
                                            <vs-td>{{ det.nombre_completo }}</vs-td>
                                            <vs-td>{{ det.descripcion || '—' }}</vs-td>
                                            <vs-td>{{ det.forma_pago_nombre || '—' }}</vs-td>
                                            <vs-td>{{ parseFloat(det.total).toFixed(2) }}</vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sección Convenios -->
            <div v-else-if="seccionDetalleSeleccionada === 'convenio'">
                <div v-if="detallePorPagar.convenio" class="por-pagar-card por-pagar-card--convenio" style="margin-top: 0;">
                    <div class="por-pagar-card__head">
                        <div class="por-pagar-card__title">
                            <span class="por-pagar-card__index por-pagar-card__index--convenio">Convenio</span>
                            <span class="por-pagar-card__codigo">#{{ detallePorPagar.convenio.id }}</span>
                        </div>
                        <div class="por-pagar-card__valor-wrap">
                            <span class="por-pagar-card__valor-label">Valor global</span>
                            <span class="por-pagar-card__valor">{{ parseFloat(detallePorPagar.convenio.anticipo_global).toFixed(2) }}</span>
                        </div>
                    </div>

                    <div class="por-pagar-card__body">
                        <!-- Barra de Avance de Convenio -->
                        <div class="pp-progress-section">
                            <div class="pp-progress-header">
                                <span class="pp-progress-title">Estado de Recaudación / Convenio</span>
                                <span class="pp-progress-percentage">{{ f_getClosedPercentConvenio(detallePorPagar.convenio) }}% completado</span>
                            </div>
                            <div class="pp-progress-bar-container">
                                <vx-tooltip v-if="f_getClosedPercentConvenio(detallePorPagar.convenio) > 0" :style="{ width: f_getClosedPercentConvenio(detallePorPagar.convenio) + '%', minWidth: '5px', height: '100%' }" text="Convenios Cerrados / Recaudados" position="top" color="success">
                                    <div class="pp-progress-bar-segment pp-progress-bar-segment--closed" 
                                         :class="{'pp-progress-bar-segment--dimmed': activeHover.key === 'convenio' && activeHover.type !== 'closed' && activeHover.type !== null}"
                                         @mouseenter="activeHover = { key: 'convenio', type: 'closed' }"
                                         @mouseleave="activeHover = { key: null, type: null }"
                                         style="width: 100%; min-width: 5px; height: 100%;"></div>
                                </vx-tooltip>
                                <vx-tooltip v-if="f_getOpenPercentConvenio(detallePorPagar.convenio) > 0" :style="{ width: f_getOpenPercentConvenio(detallePorPagar.convenio) + '%', minWidth: '5px', height: '100%' }" text="Convenios Abiertos (En Proceso)" position="top" color="warning">
                                    <div class="pp-progress-bar-segment pp-progress-bar-segment--open" 
                                         :class="{'pp-progress-bar-segment--dimmed': activeHover.key === 'convenio' && activeHover.type !== 'open' && activeHover.type !== null}"
                                         @mouseenter="activeHover = { key: 'convenio', type: 'open' }"
                                         @mouseleave="activeHover = { key: null, type: null }"
                                         style="width: 100%; min-width: 5px; height: 100%;"></div>
                                </vx-tooltip>
                                <vx-tooltip v-if="f_getPendingPercentConvenio(detallePorPagar.convenio) > 0" :style="{ width: f_getPendingPercentConvenio(detallePorPagar.convenio) + '%', minWidth: '5px', height: '100%' }" text="Saldo Pendiente por Registrar" position="top" color="danger">
                                    <div class="pp-progress-bar-segment pp-progress-bar-segment--pending" 
                                         :class="{'pp-progress-bar-segment--dimmed': activeHover.key === 'convenio' && activeHover.type !== 'pending' && activeHover.type !== null}"
                                         @mouseenter="activeHover = { key: 'convenio', type: 'pending' }"
                                         @mouseleave="activeHover = { key: null, type: null }"
                                         style="width: 100%; min-width: 5px; height: 100%;"></div>
                                </vx-tooltip>
                            </div>
                            <div class="pp-progress-legend">
                                <span class="pp-progress-legend-item" 
                                      :class="{'text-bold': activeHover.key === 'convenio' && activeHover.type === 'closed'}"
                                      @mouseenter="activeHover = { key: 'convenio', type: 'closed' }"
                                      @mouseleave="activeHover = { key: null, type: null }">
                                    <span class="dot dot--closed"></span> Cerrado: {{ f_getClosedPercentConvenio(detallePorPagar.convenio) }}%
                                </span>
                                <span v-if="parseFloat(detallePorPagar.convenio.total_abierto || 0) > 0" class="pp-progress-legend-item" 
                                      :class="{'text-bold': activeHover.key === 'convenio' && activeHover.type === 'open'}"
                                      @mouseenter="activeHover = { key: 'convenio', type: 'open' }"
                                      @mouseleave="activeHover = { key: null, type: null }">
                                    <span class="dot dot--open"></span> Abierto (En Proceso): {{ f_getOpenPercentConvenio(detallePorPagar.convenio) }}%
                                </span>
                                <span v-if="parseFloat(detallePorPagar.convenio.falta_registrar || 0) > 0" class="pp-progress-legend-item" 
                                      :class="{'text-bold': activeHover.key === 'convenio' && activeHover.type === 'pending'}"
                                      @mouseenter="activeHover = { key: 'convenio', type: 'pending' }"
                                      @mouseleave="activeHover = { key: null, type: null }">
                                    <span class="dot dot--pending"></span> Saldo Pendiente: {{ f_getPendingPercentConvenio(detallePorPagar.convenio) }}%
                                </span>
                            </div>
                        </div>

                        <div class="pp-stats">
                            <div class="pp-stat" 
                                 :class="{'pp-stat--highlight-closed': activeHover.key === 'convenio' && activeHover.type === 'closed'}"
                                 @mouseenter="activeHover = { key: 'convenio', type: 'closed' }"
                                 @mouseleave="activeHover = { key: null, type: null }">
                                <span class="pp-stat__label">Total Pago/s Cerrado/s</span>
                                <span class="pp-stat__val">{{ parseFloat(detallePorPagar.convenio.total_cerrado).toFixed(2) }}</span>
                            </div>
                            <div class="pp-stat" 
                                 :class="{'pp-stat--highlight-open': activeHover.key === 'convenio' && activeHover.type === 'open'}"
                                 @mouseenter="activeHover = { key: 'convenio', type: 'open' }"
                                 @mouseleave="activeHover = { key: null, type: null }">
                                <span class="pp-stat__label">Total Pago/s abierto/s</span>
                                <span class="pp-stat__val">{{ parseFloat(detallePorPagar.convenio.total_abierto).toFixed(2) }}</span>
                            </div>
                            <div class="pp-stat" 
                                 :class="{'pp-stat--highlight-pending': activeHover.key === 'convenio' && activeHover.type === 'pending'}"
                                 @mouseenter="activeHover = { key: 'convenio', type: 'pending' }"
                                 @mouseleave="activeHover = { key: null, type: null }">
                                <span class="pp-stat__label">Saldo Pendiente Convenio</span>
                                <span class="pp-stat__val">{{ parseFloat(detallePorPagar.convenio.anticipo_global - detallePorPagar.convenio.total_cerrado).toFixed(2) }}</span>
                                <vx-tooltip v-if="parseFloat(detallePorPagar.convenio.total_abierto || 0) > 0" text="Existen pagos abiertos del convenio registrados. Una vez aprobados y cerrados, se descontarán del saldo pendiente." position="top" color="warning">
                                    <div class="pp-stat__pending-alert">
                                        <i class="fa-solid fa-circle-exclamation"></i>
                                        <span>Pagos abiertos en proceso: <b>{{ parseFloat(detallePorPagar.convenio.total_abierto).toFixed(2) }}</b></span>
                                    </div>
                                </vx-tooltip>
                            </div>
                        </div>

                        <div v-if="detallePorPagar.convenio.detalles_abiertos && detallePorPagar.convenio.detalles_abiertos.length" class="pp-subtable">
                            <p class="pp-subtable__label">Pagos abiertos ({{ detallePorPagar.convenio.detalles_abiertos.length }})</p>
                            <vs-table :data="detallePorPagar.convenio.detalles_abiertos" stripe>
                                <template slot="thead">
                                    <vs-th>Beneficiario</vs-th>
                                    <vs-th>Descripción</vs-th>
                                    <vs-th>Forma pago</vs-th>
                                    <vs-th>Total</vs-th>
                                </template>
                                <template slot-scope="{ data }">
                                    <vs-tr :key="idx" v-for="(det, idx) in data">
                                        <vs-td>{{ det.nombre_completo }}</vs-td>
                                        <vs-td>{{ det.descripcion || '—' }}</vs-td>
                                        <vs-td>{{ det.forma_pago_nombre || '—' }}</vs-td>
                                        <vs-td>{{ parseFloat(det.total).toFixed(2) }}</vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </vs-popup>
</div>
</template>

<script>
import Generalmix from '../../../../../mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";
import vSelect from 'vue-select'
export default {
    mixins: [Generalmix, Codigosmix],
    components: {
        vSelect
    },
    data() {
        return {
            arrayReporte: [],
            showTable: true,
            filtroDistribuidor: 'todos',
            opcionesDistribuidor: [{
                    label: 'Todos',
                    value: 'todos'
                },
                {
                    label: 'Solo distribuidores',
                    value: 'si'
                },
                {
                    label: 'Sin distribuidores',
                    value: 'no'
                },
            ],
            tipoVenta: 3,
            popupDocumentos: false,
            pedidoDocumentosSeleccionado: null,
            documentosPopupData: [],
            cargandoDocumentosPopup: false,
            documentoDetalleExpandido: null,
            detalleVentaCache: {},
            cargandoDetalleDocumento: null,
            itemsDevueltosPopupData: [],
            cargandoItemsDevueltos: false,
            tipoDetalleDocumentos: 'bruta',
            popupPorPagar: false,
            popupPorPagarModo: 'global',
            popupPorPagarContext: 'comision',
            filtroTipoSaldo: 'todos',
            mostrarVolverResumen: false,
            pedidoPorPagarSeleccionado: null,
            detallePorPagar: null,
            activeHover: {
                key: null,
                type: null
            },
            openSections: {
                pagos: false,
                convenio: false
            },
            popupDetalleSeccion: false,
            seccionDetalleSeleccionada: 'pagos',
            tituloDetalleSeccion: '',
        }
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        esPopupDeudaAnterior() {
            return this.popupPorPagarContext === 'deuda_anterior';
        },
        esPopupComision() {
            return this.popupPorPagarContext === 'comision';
        },
        arrayFiltrado() {
            if (this.filtroDistribuidor === 'no') return this.arrayReporte.filter(i => i.EsDistribuidor != 'SI');
            if (this.filtroDistribuidor === 'si') return this.arrayReporte.filter(i => i.EsDistribuidor == 'SI');
            return this.arrayReporte; // "todos"
        },
        totalVentaBruta() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.ventaBruta) || 0), 0) * 100) / 100;
        },
        totalVentaPedido() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.ventaPedido) || 0), 0) * 100) / 100;
        },
        totalVentaAlcance() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.ventaAlcance) || 0), 0) * 100) / 100;
        },
        totalVentaBrutaDirecta() {
            return this.f_sumarPorTipoVenta('ventaBruta', 1);
        },
        totalVentaBrutaLista() {
            return this.f_sumarPorTipoVenta('ventaBruta', 2);
        },
        totalVentaNeta() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.ven_neta) || 0), 0) * 100) / 100;
        },
        totalVentaNetaDirecta() {
            return this.f_sumarPorTipoVenta('ven_neta', 1);
        },
        totalVentaNetaLista() {
            return this.f_sumarPorTipoVenta('ven_neta', 2);
        },
        totalPagado() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.total_pagado_comision != null ? i.total_pagado_comision : i.total_pagado) || 0), 0) * 100) / 100;
        },
        totalPagadoDirecta() {
            return this.f_sumarPorTipoVentaFn(this.f_totalPagadoComision, 1);
        },
        totalPagadoLista() {
            return this.f_sumarPorTipoVentaFn(this.f_totalPagadoComision, 2);
        },
        totalPagadoPercentage() {
            if (this.totalValorComision <= 0) return '0.00';
            const percent = (this.totalPagado / this.totalValorComision) * 100;
            if (this.totalValorPendientePagarComision >= 0.005 && percent > 99.99) {
                return '99.99';
            }
            return (Math.floor(percent * 100) / 100).toFixed(2);
        },
        totalPorPagar() {
            return Math.round(this.contratosPorPagarComision.reduce((acc, i) => acc + this.f_totalXPagarComision(i), 0) * 100) / 100;
        },
        totalPorPagarDirecta() {
            return this.f_sumarPorTipoVentaFn(this.f_totalXPagarComision, 1, this.contratosPorPagarComision);
        },
        totalPorPagarLista() {
            return this.f_sumarPorTipoVentaFn(this.f_totalXPagarComision, 2, this.contratosPorPagarComision);
        },
        totalPagosXPagarGlobal() {
            return Math.round(this.contratosPorPagarComision.reduce((acc, i) => acc + this.f_pagosXPagarComision(i), 0) * 100) / 100;
        },
        totalConvenioXPagarGlobal() {
            return this.f_sumarCampoMoneda(this.contratosPorPagar, 'convenio_x_pagar');
        },
        contratosPorPagar() {
            return this.arrayFiltrado
                .filter(i => parseFloat(i.total_x_pagar || 0) > 0)
                .sort((a, b) => parseFloat(b.total_x_pagar || 0) - parseFloat(a.total_x_pagar || 0));
        },
        contratosPorPagarComision() {
            return this.arrayFiltrado
                .filter(i => this.f_totalXPagarComision(i) > 0)
                .sort((a, b) => this.f_totalXPagarComision(b) - this.f_totalXPagarComision(a));
        },
        contratosPorPagarFiltrados() {
            if (this.esPopupDeudaAnterior) {
                return this.contratosConDeudaAnteriorPendiente;
            }
            if (this.filtroTipoSaldo === 'pagos') {
                return this.contratosPorPagarComision.filter(i => this.f_pagosXPagarComision(i) > 0);
            }
            if (this.filtroTipoSaldo === 'convenio') {
                return this.contratosPorPagar.filter(i => parseFloat(i.convenio_x_pagar || 0) > 0);
            }
            return this.contratosPorPagarComision;
        },
        totalValorComision() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.valorComision) || 0), 0) * 100) / 100;
        },
        totalValorComisionDirecta() {
            return this.f_sumarPorTipoVenta('valorComision', 1);
        },
        totalValorComisionLista() {
            return this.f_sumarPorTipoVenta('valorComision', 2);
        },
        totalVentaBrutaLiquidado() {
            return Math.round(this.arrayFiltrado.reduce((acc, item) => {
                if (!this.esEstadoLiquidado(item.estado_liquidacion)) return acc;
                return acc + (parseFloat(item.venta_bruta_liquidado) || 0);
            }, 0) * 100) / 100;
        },
        totalValorPendientePagarComision() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.valor_pendiente_pagar_comision) || 0), 0) * 100) / 100;
        },
        totalValorPendientePagarComisionDirecta() {
            return this.f_sumarPorTipoVenta('valor_pendiente_pagar_comision', 1);
        },
        totalValorPendientePagarComisionLista() {
            return this.f_sumarPorTipoVenta('valor_pendiente_pagar_comision', 2);
        },
        totalDeudaAnteriorCerrada() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + (parseFloat(i.totalDeudaAnterior || 0) || 0), 0) * 100) / 100;
        },
        totalDeudaAnteriorCerradaDirecta() {
            return this.f_sumarPorTipoVenta('totalDeudaAnterior', 1);
        },
        totalDeudaAnteriorCerradaLista() {
            return this.f_sumarPorTipoVenta('totalDeudaAnterior', 2);
        },
        totalDeudaAnteriorPendienteCerrar() {
            return Math.round(this.arrayFiltrado.reduce((acc, i) => acc + this.f_deudaAnteriorPendienteCerrar(i), 0) * 100) / 100;
        },
        totalDeudaAnteriorPendienteCerrarDirecta() {
            return this.f_sumarPorTipoVentaFn(this.f_deudaAnteriorPendienteCerrar, 1);
        },
        totalDeudaAnteriorPendienteCerrarLista() {
            return this.f_sumarPorTipoVentaFn(this.f_deudaAnteriorPendienteCerrar, 2);
        },
        contratosConDeudaAnteriorPendiente() {
            return this.arrayFiltrado
                .filter(i => this.f_deudaAnteriorPendienteCerrar(i) > 0)
                .sort((a, b) => this.f_deudaAnteriorPendienteCerrar(b) - this.f_deudaAnteriorPendienteCerrar(a));
        },
        documentosPopup() {
            return this.documentosPopupData;
        },
        totalDocumentosPopupBruta() {
            return Math.round(this.documentosPopup.reduce((acc, d) => acc + (parseFloat(d.venta_bruta) || 0), 0) * 100) / 100;
        },
        totalDocumentosPopupNeta() {
            return Math.round(this.documentosPopup.reduce((acc, d) => acc + (parseFloat(d.venta_neta) || 0), 0) * 100) / 100;
        },
        totalDocumentosPopupBrutaOriginal() {
            return Math.round(this.documentosPopup.reduce((acc, d) => acc + (parseFloat(d.venta_bruta_original) || 0), 0) * 100) / 100;
        },
        totalDocumentosPopupNetaOriginal() {
            return Math.round(this.documentosPopup.reduce((acc, d) => acc + (parseFloat(d.venta_neta_original) || 0), 0) * 100) / 100;
        },
        totalDocumentosPopupDevueltoBruto() {
            return Math.round(this.documentosPopup.reduce((acc, d) => acc + (parseFloat(d.valor_devuelto_bruto) || 0), 0) * 100) / 100;
        },
        totalDocumentosPopupDevueltoNeta() {
            return Math.round(this.documentosPopup.reduce((acc, d) => acc + (parseFloat(d.valor_devuelto_neta) || 0), 0) * 100) / 100;
        },
        tituloPopupDocumentos() {
            const tipo = this.tipoDetalleDocumentos === 'bruta' ? 'Venta Bruta' : 'Venta Neta';
            const contrato = this.pedidoDocumentosSeleccionado ?
                this.pedidoDocumentosSeleccionado.contrato_generado :
                '';
            return `Documentos de venta — ${tipo}${contrato ? ' — ' + contrato : ''}`;
        },
        tituloPopupPorPagar() {
            if (this.popupPorPagarModo === 'global') {
                const periodo = this.nombrePeriodo ? ` — ${this.nombrePeriodo}` : '';
                if (this.esPopupDeudaAnterior) {
                    return `Deuda Anterior — Pendientes de cerrar${periodo}`;
                }
                return `Pagos Pendientes de cerrar${periodo}`;
            }
            const contrato = this.pedidoPorPagarSeleccionado ?
                this.pedidoPorPagarSeleccionado.contrato_generado :
                '';
            return `Detalle por contrato${contrato ? ' — ' + contrato : ''}`;
        },
    },
    watch: {
        popupPorPagar(val) {
            if (!val) {
                this.popupPorPagarModo = 'global';
                this.popupPorPagarContext = 'comision';
                this.filtroTipoSaldo = 'todos';
                this.mostrarVolverResumen = false;
                this.detallePorPagar = null;
                this.pedidoPorPagarSeleccionado = null;
            }
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
        }
    },
    methods: {
        f_sumarCampoMoneda(items, field) {
            return items.reduce((acc, item) => {
                const valor = parseFloat(parseFloat(item[field] || 0).toFixed(2));
                return Math.round((acc + valor) * 100) / 100;
            }, 0);
        },
        f_sumarPorTipoVenta(field, tipoVenta, items = null) {
            const source = items || this.arrayFiltrado;
            return Math.round(source.reduce((acc, item) => {
                if (String(item.tipo_venta) !== String(tipoVenta)) return acc;
                return acc + (parseFloat(item[field]) || 0);
            }, 0) * 100) / 100;
        },
        f_getClosedPercent(pago) {
            const docValor = parseFloat(pago.doc_valor || 0);
            if (docValor <= 0) return 0;
            const cerrado = parseFloat(pago.total_cerrado || 0);
            const abierto = parseFloat(pago.total_abierto || 0);
            const total = Math.max(docValor, cerrado + abierto);
            const percent = (cerrado / total) * 100;
            if (cerrado < docValor && percent >= 99.99) {
                return 99.99;
            }
            return parseFloat((Math.floor(percent * 100) / 100).toFixed(2));
        },
        f_getOpenPercent(pago) {
            const docValor = parseFloat(pago.doc_valor || 0);
            if (docValor <= 0) return 0;
            const cerrado = parseFloat(pago.total_cerrado || 0);
            const abierto = parseFloat(pago.total_abierto || 0);
            const total = Math.max(docValor, cerrado + abierto);
            const percent = (abierto / total) * 100;
            if (abierto > 0 && percent < 0.01) {
                return 0.01;
            }
            return parseFloat((Math.ceil(percent * 100) / 100).toFixed(2));
        },
        f_getClosedPercentConvenio(convenio) {
            const anticipo = parseFloat(convenio.anticipo_global || 0);
            if (anticipo <= 0) return 0;
            const cerrado = parseFloat(convenio.total_cerrado || 0);
            const abierto = parseFloat(convenio.total_abierto || 0);
            const total = Math.max(anticipo, cerrado + abierto);
            const percent = (cerrado / total) * 100;
            if (cerrado < anticipo && percent >= 99.99) {
                return 99.99;
            }
            return parseFloat((Math.floor(percent * 100) / 100).toFixed(2));
        },
        f_getOpenPercentConvenio(convenio) {
            const anticipo = parseFloat(convenio.anticipo_global || 0);
            if (anticipo <= 0) return 0;
            const cerrado = parseFloat(convenio.total_cerrado || 0);
            const abierto = parseFloat(convenio.total_abierto || 0);
            const total = Math.max(anticipo, cerrado + abierto);
            const percent = (abierto / total) * 100;
            if (abierto > 0 && percent < 0.01) {
                return 0.01;
            }
            return parseFloat((Math.ceil(percent * 100) / 100).toFixed(2));
        },
        f_getPendingPercent(pago) {
            const docValor = parseFloat(pago.doc_valor || 0);
            if (docValor <= 0) return 0;
            const cerrado = parseFloat(pago.total_cerrado || 0);
            const abierto = parseFloat(pago.total_abierto || 0);
            const falta = parseFloat(pago.falta_registrar || 0);
            const total = Math.max(docValor, cerrado + abierto);
            const percent = (falta / total) * 100;
            if (falta > 0 && percent < 0.01) {
                return 0.01;
            }
            return parseFloat((Math.ceil(percent * 100) / 100).toFixed(2));
        },
        f_getPendingPercentConvenio(convenio) {
            const anticipo = parseFloat(convenio.anticipo_global || 0);
            if (anticipo <= 0) return 0;
            const cerrado = parseFloat(convenio.total_cerrado || 0);
            const abierto = parseFloat(convenio.total_abierto || 0);
            const falta = parseFloat(convenio.falta_registrar || 0);
            const total = Math.max(anticipo, cerrado + abierto);
            const percent = (falta / total) * 100;
            if (falta > 0 && percent < 0.01) {
                return 0.01;
            }
            return parseFloat((Math.ceil(percent * 100) / 100).toFixed(2));
        },
        esEstadoLiquidado(estado) {
            return estado === 'LIQUIDADO' || estado === 'LIQUIDADO SIN CÓDIGOS';
        },
        claseEstadoLiquidacion(estado) {
            if (estado === 'LIQUIDADO') return 'estado-liq estado-liq--liquidado';
            if (estado === 'LIQUIDADO SIN CÓDIGOS') return 'estado-liq estado-liq--sin-codigos';
            if (estado === 'SIN LIQUIDAR') return 'estado-liq estado-liq--sin-liquidar';
            return 'estado-liq estado-liq--na';
        },
        f_formatearDevolucion(valor) {
            const n = parseFloat(valor || 0);
            if (n <= 0) return '0.00';
            return '− ' + n.toFixed(2);
        },
        f_formulaCabeceraDocumentos(original, devolucion, neto) {
            const o = parseFloat(original || 0).toFixed(2);
            const d = parseFloat(devolucion || 0);
            const n = parseFloat(neto || 0).toFixed(2);
            if (d <= 0) return `${o} = ${n} (sin devoluciones)`;
            return `${o} − ${d.toFixed(2)} = ${n}`;
        },
        f_tooltipDocumentosBruta(tr) {
            const original = parseFloat(tr.venta_bruta_documentos_original || 0).toFixed(2);
            const devolucion = parseFloat(tr.valor_devuelto_bruto_documentos || 0).toFixed(2);
            const neto = parseFloat(tr.venta_bruta_documentos_devolucion || 0).toFixed(2);
            return `Bruta original: ${original} − Devolución: ${devolucion} = Bruta − dev.: ${neto}`;
        },
        f_tooltipDocumentosNeta(tr) {
            const original = parseFloat(tr.venta_neta_documentos_original || 0).toFixed(2);
            const devolucion = parseFloat(tr.valor_devuelto_neta_documentos || 0).toFixed(2);
            const neto = parseFloat(tr.venta_neta_documentos_devolucion || 0).toFixed(2);
            return `Neta original: ${original} − Devolución: ${devolucion} = Neta − dev.: ${neto}`;
        },
        f_docKey(doc) {
            return `${doc.ven_codigo}|${doc.id_empresa}`;
        },
        f_getDetalleDocumento(doc) {
            return this.detalleVentaCache[this.f_docKey(doc)] || [];
        },
        f_cargarDocumentosPopup(tr) {
            const me = this;
            me.cargandoDocumentosPopup = true;
            me.documentosPopupData = [];
            me.$http.get(
                me.$server_url +
                `metodosGetVentas?GetDocumentosVentaPedidoPedidosPagos=1&periodo=${me.periodo_id}&id_pedido=${tr.id_pedido}`
            ).then(res => {
                me.cargandoDocumentosPopup = false;
                if (res.data.status == 0 || res.data.status === '0') {
                    me.m_message(res.data.message || 'No se pudieron cargar los documentos', 'danger');
                    return;
                }
                me.documentosPopupData = res.data.documentos_venta || [];
            }).catch(err => {
                me.cargandoDocumentosPopup = false;
                console.log(err);
                me.m_message('Error al cargar los documentos de venta', 'danger');
            });
        },
        f_cargarItemsDevueltosPopup(tr) {
            const me = this;
            me.cargandoItemsDevueltos = true;
            me.itemsDevueltosPopupData = [];
            me.$http.get(
                me.$server_url +
                `metodosGetVentas?GetItemsDevueltosDocumentosPedidosPagos=1&periodo=${me.periodo_id}&id_pedido=${tr.id_pedido}`
            ).then(res => {
                me.cargandoItemsDevueltos = false;
                if (res.data.status == 0 || res.data.status === '0') {
                    return;
                }
                me.itemsDevueltosPopupData = res.data.items_devueltos || [];
            }).catch(err => {
                me.cargandoItemsDevueltos = false;
                console.log(err);
            });
        },
        f_toggleDetalleDocumento(doc) {
            const key = this.f_docKey(doc);
            if (this.documentoDetalleExpandido === key) {
                this.documentoDetalleExpandido = null;
                return;
            }

            this.documentoDetalleExpandido = key;

            if (this.detalleVentaCache[key]) {
                return;
            }

            const me = this;
            me.cargandoDetalleDocumento = key;
            me.$http.get(
                me.$server_url +
                `metodosGetVentas?GetDetalleVentaDocumentoPedidosPagos=1&periodo=${me.periodo_id}` +
                `&ven_codigo=${encodeURIComponent(doc.ven_codigo)}&id_empresa=${doc.id_empresa}`
            ).then(res => {
                me.cargandoDetalleDocumento = null;
                if (res.data.status == 0 || res.data.status === '0') {
                    me.m_message(res.data.message || 'No se pudo cargar el detalle', 'danger');
                    return;
                }
                me.$set(me.detalleVentaCache, key, res.data.detalle_venta || []);
            }).catch(err => {
                me.cargandoDetalleDocumento = null;
                console.log(err);
                me.m_message('Error al cargar el detalle del documento', 'danger');
            });
        },
        f_verDocumentosVenta(tr, tipo) {
            this.pedidoDocumentosSeleccionado = tr;
            this.documentoDetalleExpandido = null;
            this.detalleVentaCache = {};
            this.documentosPopupData = [];
            this.itemsDevueltosPopupData = [];
            this.tipoDetalleDocumentos = tipo === 'neta' ? 'neta' : 'bruta';
            this.popupDocumentos = true;
            this.f_cargarDocumentosPopup(tr);
            this.f_cargarItemsDevueltosPopup(tr);
        },
        f_tooltipDeudaAnterior(row) {
            const cerrada = parseFloat(row.totalDeudaAnterior || 0) || 0;
            const sinCerrar = parseFloat(row.totalDeudaAnteriorSinCerrar || 0) || 0;
            const faltaRegistrar = parseFloat(row.totalDeudaAnteriorFaltaRegistrar || 0) || 0;
            const pendiente = this.f_deudaAnteriorPendienteCerrar(row);
            return `Cerrada: ${cerrada.toFixed(2)} | Sin cerrar: ${sinCerrar.toFixed(2)} | Por registrar: ${faltaRegistrar.toFixed(2)} | Pendiente total: ${pendiente.toFixed(2)}`;
        },
        f_abrirDeudaAnteriorContrato(tr) {
            this.popupPorPagarContext = 'deuda_anterior';
            this.filtroTipoSaldo = 'deuda_anterior';
            this.popupPorPagarModo = 'global';
            this.mostrarVolverResumen = false;
            this.pedidoPorPagarSeleccionado = null;
            this.detallePorPagar = null;
            this.popupPorPagar = true;
        },
        f_deudaAnteriorPendienteCerrar(row) {
            if (row.deuda_anterior_pendiente_cerrar != null && row.deuda_anterior_pendiente_cerrar !== '') {
                return parseFloat(row.deuda_anterior_pendiente_cerrar) || 0;
            }
            const sinCerrar = parseFloat(row.totalDeudaAnteriorSinCerrar || 0) || 0;
            const faltaRegistrar = parseFloat(row.totalDeudaAnteriorFaltaRegistrar || 0) || 0;
            return Math.round((sinCerrar + faltaRegistrar) * 100) / 100;
        },
        f_totalXPagarComision(row) {
            if (row.total_x_pagar_comision != null && row.total_x_pagar_comision !== '') {
                return parseFloat(row.total_x_pagar_comision) || 0;
            }
            const totalXPagar = parseFloat(row.total_x_pagar || 0) || 0;
            return Math.max(0, Math.round((totalXPagar - this.f_deudaAnteriorPendienteCerrar(row)) * 100) / 100);
        },
        f_pagosXPagarComision(row) {
            if (row.pagos_x_pagar_comision != null && row.pagos_x_pagar_comision !== '') {
                return parseFloat(row.pagos_x_pagar_comision) || 0;
            }
            const pagosXPagar = parseFloat(row.pagos_x_pagar || 0) || 0;
            return Math.max(0, Math.round((pagosXPagar - this.f_deudaAnteriorPendienteCerrar(row)) * 100) / 100);
        },
        f_totalPagadoComision(row) {
            if (row.total_pagado_comision != null && row.total_pagado_comision !== '') {
                return parseFloat(row.total_pagado_comision) || 0;
            }
            const totalPagado = parseFloat(row.total_pagado || 0) || 0;
            const deudaCerrada = parseFloat(row.totalDeudaAnterior || 0) || 0;
            return Math.round((totalPagado - deudaCerrada) * 100) / 100;
        },
        f_pagosLiquidacionesComision(row) {
            if (row.pagosLiquidacionesComision != null && row.pagosLiquidacionesComision !== '') {
                return parseFloat(row.pagosLiquidacionesComision) || 0;
            }
            const anticipos = parseFloat(row.totalAnticipos || 0) || 0;
            const anticipoAprobado = parseFloat(row.totalAnticipoAprobado || 0) || 0;
            const liquidaciones = parseFloat(row.totalLiquidaciones || 0) || 0;
            const otros = parseFloat(row.totalOtrosValores || 0) || 0;
            return Math.round((anticipos + anticipoAprobado + liquidaciones + otros) * 100) / 100;
        },
        f_tooltipPagosComision(row) {
            const convPag = parseFloat(row.valor_convenio_pagado || 0) || 0;
            const pagPag = this.f_pagosLiquidacionesComision(row);
            return `Conv. pag: ${convPag.toFixed(2)} | Pag. pag.: ${pagPag.toFixed(2)}`;
        },
        f_sumarPorTipoVentaFn(fn, tipoVenta, items = null) {
            const source = items || this.arrayFiltrado;
            return Math.round(source.reduce((acc, item) => {
                if (String(item.tipo_venta) !== String(tipoVenta)) return acc;
                return acc + fn(item);
            }, 0) * 100) / 100;
        },
        f_abrirDeudaAnteriorGlobal() {
            this.popupPorPagarContext = 'deuda_anterior';
            this.filtroTipoSaldo = 'deuda_anterior';
            this.popupPorPagarModo = 'global';
            this.mostrarVolverResumen = false;
            this.pedidoPorPagarSeleccionado = null;
            this.detallePorPagar = null;
            this.popupPorPagar = true;
        },
        f_abrirPorPagarGlobal(filtroSaldo = 'todos') {
            this.popupPorPagarContext = 'comision';
            this.filtroTipoSaldo = filtroSaldo;
            this.popupPorPagarModo = 'global';
            this.mostrarVolverResumen = false;
            this.pedidoPorPagarSeleccionado = null;
            this.detallePorPagar = null;
            this.popupPorPagar = true;
        },
        f_convenioTienePendiente(conv) {
            if (!conv) return false;
            return parseFloat(conv.por_pagar || 0) > 0 ||
                parseFloat(conv.total_abierto || 0) > 0 ||
                parseFloat(conv.falta_registrar || 0) > 0;
        },
        f_volverPorPagarGlobal() {
            this.popupPorPagarModo = 'global';
            this.mostrarVolverResumen = false;
            this.pedidoPorPagarSeleccionado = null;
            this.detallePorPagar = null;
        },
        f_verDetallePorPagar(tr, desdeGlobal = false) {
            const me = this;
            if (!desdeGlobal) {
                me.popupPorPagarContext = 'comision';
            }
            me.pedidoPorPagarSeleccionado = tr;
            me.detallePorPagar = null;
            me.mostrarVolverResumen = desdeGlobal;
            me.$vs.loading();
            const convenioParam = tr.convenio_id ? `&convenio_id=${tr.convenio_id}` : '';
            this.$http.get(
                this.$server_url + `metodosGetVentas?GetDetallePorPagarPedidosPagos=1&id_pedido=${tr.id_pedido}${convenioParam}`
            ).then(res => {
                me.$vs.loading.close();
                if (res.data.status == 0 || res.data.status === '0') {
                    me.m_message(res.data.message || 'No se pudo cargar el detalle', 'danger');
                    return;
                }
                me.detallePorPagar = res.data;
                me.openSections = {
                    pagos: false,
                    convenio: false
                };
                me.popupPorPagarModo = 'detalle';
                me.popupPorPagar = true;
            }).catch(err => {
                me.$vs.loading.close();
                console.log(err);
                me.m_message('Error al obtener el detalle por pagar', 'danger');
            });
        },
        f_abrirDetalleColumna(tr, tipo) {
            const me = this;
            me.pedidoPorPagarSeleccionado = tr;
            me.seccionDetalleSeleccionada = tipo;
            me.detallePorPagar = null;
            if (tipo === 'pagos') {
                me.tituloDetalleSeccion = `Desglose de Anticipos/Liquidaciones - Contrato: ${tr.contrato_generado}`;
            } else {
                me.tituloDetalleSeccion = `Desglose de Convenio - Contrato: ${tr.contrato_generado}`;
            }
            me.$vs.loading();
            const convenioParam = tr.convenio_id ? `&convenio_id=${tr.convenio_id}` : '';
            this.$http.get(
                this.$server_url + `metodosGetVentas?GetDetallePorPagarPedidosPagos=1&id_pedido=${tr.id_pedido}${convenioParam}`
            ).then(res => {
                me.$vs.loading.close();
                if (res.data.status == 0 || res.data.status === '0') {
                    me.m_message(res.data.message || 'No se pudo cargar el detalle', 'danger');
                    return;
                }
                me.detallePorPagar = res.data;
                me.popupDetalleSeccion = true;
            }).catch(err => {
                me.$vs.loading.close();
                console.log(err);
                me.m_message('Error al obtener el desglose', 'danger');
            });
        },
        f_getReporte() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + `metodosGetVentas?GetReportePedidosPagos=1&periodo=${this.periodo_id}&tipoVenta=${this.tipoVenta}`)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 0) this.m_message(res.data.message, 'danger');
                    else this.arrayReporte = res.data;
                }).catch(err => {
                    me.$vs.loading.close();
                    console.log(err);
                    me.m_message('Error al obtener el reporte', 'danger');
                });
        },
        f_exportar() {
            // Determinar el número máximo de beneficiarios
            let maxBeneficiarios = 0;
            this.arrayFiltrado.forEach(item => {
                if (item.beneficiarios && Array.isArray(item.beneficiarios)) {
                    maxBeneficiarios = Math.max(maxBeneficiarios, item.beneficiarios.length);
                }
            });

            // Headers base
            let headers = ['Asesor', 'Institución', 'Ruc', 'Contrato', 'Tipo venta', 'Estado liquidación', 'Venta Bruta', 'Comisión (%)', 'Valor comision', 'Pedidos Venta Neta', 'Venta Bruta Liquidado', 'Venta Bruta Documentos', 'Venta Neta Documentos', 'Por liquidar', 'Pagos', 'Deuda Anterior (cerrada)', 'Deuda Anterior (pendiente)', 'Por Pagar', 'Conv. pag.', 'Pag. pag.', 'Conv. x pag.', 'Pag. x pag.', 'Punto de venta', 'Es Distribuidor', 'Convenio Global', 'Años convenio', 'Periodo inicio convenio'];
            let fieldKeys = ['asesor', 'nombreInstitucion', 'ruc', 'contrato_generado', 'tipo_venta_descr', 'estado_liquidacion', 'ventaBruta', 'comision', 'valorComision', 'ven_neta', 'venta_bruta_liquidado', 'venta_bruta_documentos_devolucion', 'venta_neta_documentos_devolucion', 'valor_pendiente_pagar_comision', 'total_pagado_comision', 'totalDeudaAnterior', 'deuda_anterior_pendiente_cerrar', 'total_x_pagar_comision', 'valor_convenio_pagado', 'pagosLiquidacionesComision', 'convenio_x_pagar', 'pagos_x_pagar_comision', 'punto_venta', 'EsDistribuidor', 'convenio_global', 'convenio_anios', 'convenio_periodo_inicio'];

            // Agregar headers dinámicos para beneficiarios
            for (let i = 1; i <= maxBeneficiarios; i++) {
                headers.push(`Beneficiario ${i}`, `Cédula Beneficiario ${i}`);
                fieldKeys.push(`beneficiario_${i}`, `cedula_beneficiario_${i}`);
            }

            // Preparar datos con beneficiarios expandidos
            const datosExpandidos = this.arrayFiltrado.map(item => {
                const itemExpandido = {
                    ...item
                };

                // Agregar beneficiarios como propiedades individuales
                if (item.beneficiarios && Array.isArray(item.beneficiarios)) {
                    item.beneficiarios.forEach((beneficiario, index) => {
                        const num = index + 1;
                        itemExpandido[`beneficiario_${num}`] = beneficiario.beneficiario || '';
                        itemExpandido[`cedula_beneficiario_${num}`] = beneficiario.cedula || '';
                    });
                }

                // Llenar campos vacíos para beneficiarios que no existen
                for (let i = 1; i <= maxBeneficiarios; i++) {
                    if (!itemExpandido[`beneficiario_${i}`]) {
                        itemExpandido[`beneficiario_${i}`] = '';
                        itemExpandido[`cedula_beneficiario_${i}`] = '';
                    }
                }

                return itemExpandido;
            });

            const nombreArchivo = `Reporte_ContratosPagos_${this.nombrePeriodo||'Periodo'}.xlsx`;
            this.m_exportTodo(headers, fieldKeys, datosExpandidos, nombreArchivo);
        }
    }
}
</script>

<style scoped>
/* ── Grid de KPI cards ───────────────────────────────── */
.kpi-scroll-wrapper {
    width: 100%;
    overflow-x: hidden;
    /* evita que el contenido rompa el margen */
}

.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    align-items: stretch;
}

.kpi-card--wide {
    grid-column: span 2;
}

.kpi-card--deuda-anterior {
    border-color: #ddd6fe;
    background: linear-gradient(180deg, #faf5ff 0%, #f9fafb 40%);
}

.kpi-card--deuda-anterior .kpi-card__ico {
    color: #7c3aed;
}

.kpi-deuda-anterior-block {
    padding: 4px 0 2px;
}

.kpi-deuda-anterior-block .kpi-card__val {
    margin-bottom: 4px;
}
.informacionformhijo {
    z-index: 51001;
    /* Valor mayor que el del popup del padre */
}

.informacionformhijo2 {
    z-index: 51002;
    /* Valor mayor que el del popup del padre */
}

/* móvil: todo a 1 columna, sin span */
@media (max-width: 480px) {
    .kpi-grid {
        grid-template-columns: 1fr;
    }

    .kpi-card--wide {
        grid-column: span 1;
    }
}

/* ── Card base ───────────────────────────────────────── */
.kpi-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    /* impide que flexbox/grid expanda el card */
    overflow: hidden;
    /* contiene desbordamientos internos */
    transition: box-shadow 0.2s, transform 0.2s;
}

.kpi-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
    transform: translateY(-2px);
}

/* centrado vertical para cards simples — ya no necesario con align-items: start */
.kpi-card--centered {
    justify-content: space-between;
}

/* ── Header: label + ícono ───────────────────────────── */
.kpi-card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
}

.kpi-card__label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: #6b7280;
    cursor: default;
}

.kpi-card__info-ico {
    font-size: 9px;
    color: #9ca3af;
    margin-left: 2px;
}

.kpi-card__sub--link {
    cursor: help;
}

.kpi-card__ico {
    font-size: 13px;
    color: #9ca3af;
}

/* ── Valor principal ─────────────────────────────────── */
.kpi-card__val {
    font-size: clamp(1.15rem, 1.6vw, 1.5rem);
    font-weight: 800;
    color: #111827;
    letter-spacing: -.02em;
    line-height: 1.2;
    word-break: break-all;
    /* rompe números largos si no caben */
    overflow-wrap: anywhere;
    min-width: 0;
}

.kpi-card__val--green {
    color: #059669;
}

.kpi-card__val--orange {
    color: #d97706;
}

.kpi-card__val--red {
    color: #dc2626;
}

/* ── Subtítulo ───────────────────────────────────────── */
.kpi-card__sub {
    font-size: 10px;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: .05em;
    margin: 0;
}

/* ── Desglose venta directa / lista ──────────────────── */
.kpi-card__breakdown {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.kpi-card__breakdown--venta {
    margin-top: 6px;
    padding-top: 8px;
    border-top-style: dashed;
}

.kpi-breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 6px 10px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #eef2f4;
}

.kpi-breakdown-item__label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 9px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: .04em;
    flex: 1 1 auto;
    min-width: 0;
    padding-right: 6px;
}

.kpi-breakdown-item__label i {
    font-size: 10px;
    color: #6366f1;
    flex-shrink: 0;
}

.kpi-breakdown-item__val {
    font-size: 11px;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
    flex: 0 0 auto;
    margin-left: auto;
    text-align: right;
}

/* ── Ecuación (card Comisión y Pagos) ────────────────── */
.kpi-eq {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;
    /* permite salto de línea cuando no caben */
}

.kpi-eq__item {
    flex: 1 1 130px;
    /* mínimo 130px, crece y encoge */
    min-width: 0;
}

.kpi-eq__item .kpi-card__sub {
    white-space: nowrap;
}

.kpi-eq__item .kpi-card__val {
    font-size: clamp(0.9rem, 1.2vw, 1.3rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.kpi-eq__breakdown {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.kpi-eq__breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 5px 8px;
    background: #ffffff;
    border: 1px solid #eef2f4;
    border-radius: 6px;
}

.kpi-eq__breakdown-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 8px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: .03em;
    flex: 1 1 auto;
    min-width: 0;
    padding-right: 6px;
    white-space: nowrap;
}

.kpi-eq__breakdown-label i {
    font-size: 9px;
    color: #6366f1;
    flex-shrink: 0;
}

.kpi-eq__breakdown-val {
    font-size: 10px;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
    flex: 0 0 auto;
    margin-left: auto;
    text-align: right;
}

.kpi-eq__op {
    font-size: 18px;
    font-weight: 700;
    color: #d1d5db;
    flex-shrink: 0;
    padding-top: 26px;
    align-self: flex-start;
    white-space: nowrap;
}

/* ── Barra de progreso ───────────────────────────────── */
.kpi-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.kpi-progress__track {
    flex: 1;
    height: 5px;
    background: #e5e7eb;
    border-radius: 99px;
    overflow: hidden;
}

.kpi-progress__fill {
    height: 100%;
    background: #6366f1;
    border-radius: 99px;
    transition: width 0.6s ease;
}

.kpi-progress__pct {
    font-size: 10px;
    color: #6b7280;
    white-space: nowrap;
    font-weight: 600;
}

/* ── Separador y fila docs por cerrar ────────────────── */
.kpi-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 10px 0 8px;
}

.kpi-pending-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    background: #fafafa;
    border: 1px dashed #e5e7eb;
    border-radius: 8px;
    padding: 7px 10px;
}

.kpi-pending-row--clickable {
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.kpi-pending-row--clickable:hover {
    background: #fff7ed;
    border-color: #fdba74;
    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.12);
}

.kpi-pending-row__action {
    color: #ea580c;
    font-weight: 600;
    font-style: normal;
}

.kpi-pending-row__left {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 1 1 auto;
    min-width: 0;
}

.kpi-pending-row__ico {
    color: #9ca3af;
    font-size: 13px;
    margin-top: 2px;
    flex-shrink: 0;
}

.kpi-pending-row__label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #6b7280;
    cursor: help;
    /* sin white-space: nowrap — puede envolver en móvil */
}

.kpi-pending-row__hint {
    font-size: 9px;
    color: #9ca3af;
    margin-top: 1px;
    font-style: italic;
}

.kpi-pending-row__val {
    font-size: clamp(1rem, 1.3vw, 1.25rem);
    font-weight: 800;
    color: #111827;
    letter-spacing: -.01em;
    text-align: right;
    flex-shrink: 0;
    white-space: nowrap;
}

.kpi-pending-row__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
    min-width: 140px;
}

.kpi-pending-row__breakdown {
    width: 100%;
    min-width: 140px;
    margin-top: 0;
    padding-top: 0;
    border-top: none;
}

/* ── Badges estado liquidación ───────────────────────── */
.estado-liq {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

.estado-liq--liquidado {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
}

.estado-liq--sin-codigos {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
}

.estado-liq--sin-liquidar {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
}

.estado-liq--na {
    background: #f3f4f6;
    color: #4b5563;
    border: 1px solid #d1d5db;
}

.doc-col {
    display: flex;
    align-items: center;
    gap: 4px;
}

.doc-col__btn {
    min-width: 28px !important;
    width: 28px !important;
    height: 28px !important;
    padding: 0 !important;
}

.doc-col--highlight {
    background: #eff6ff !important;
    color: #1d4ed8 !important;
    font-weight: 700;
}

.doc-col--highlight-text {
    color: #1d4ed8;
}

.doc-tipo-lista {
    color: #b45309;
    font-weight: 600;
}

.doc-popup__meta {
    font-size: 13px;
    color: #4b5563;
    margin: 0 0 8px;
}

.doc-popup__hint {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 8px;
}

.doc-resumen-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin: 12px 0;
}

.doc-resumen-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.doc-resumen-card--active {
    border-color: #93c5fd;
    background: #eff6ff;
}

.doc-resumen-card--dev {
    background: #fff7ed;
    border-color: #fed7aa;
}

.doc-resumen-card__label {
    font-size: 11px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.doc-devueltos-section {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px dashed #d1d5db;
}

.doc-devolucion {
    color: #b45309;
    font-weight: 600;
}

.doc-detalle-row {
    background: #f9fafb !important;
}

.doc-detalle-row--dev {
    background: #fff7ed !important;
}

.doc-detalle-panel {
    padding: 8px 4px 12px;
}

.doc-detalle-panel__title {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px;
}

.doc-detalle-panel__loading {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 8px;
}

.doc-popup__totales {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
    font-size: 13px;
}

.doc-popup__totales small {
    color: #9ca3af;
    margin-left: 4px;
}

.por-pagar-resumen {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
}

.por-pagar-resumen__item {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.por-pagar-section__title {
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.por-pagar-card-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.por-pagar-card {
    border: 2px solid #475569;
    border-left: 6px solid #4338ca;
    border-radius: 10px;
    padding: 0;
    margin-bottom: 0;
    background: #fff;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.1);
    overflow: hidden;
}

.por-pagar-card--convenio {
    border-color: #475569;
    border-left-color: #7c3aed;
    margin-top: 4px;
}

.por-pagar-card__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 0;
    padding: 12px 14px;
    background: #f1f5f9;
    border-bottom: 1px solid #cbd5e1;
}

.por-pagar-card__body {
    padding: 14px;
}

.por-pagar-card__title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.por-pagar-card__index {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #4338ca;
    background: #e0e7ff;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #a5b4fc;
}

.por-pagar-card__index--convenio {
    color: #6d28d9;
    background: #ede9fe;
    border-color: #c4b5fd;
}

.por-pagar-card__codigo {
    font-weight: 800;
    font-size: 14px;
    color: #111827;
    font-family: monospace;
}

.por-pagar-card__tipo {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
}

.por-pagar-card__obs {
    color: #6b7280;
    font-size: 12px;
    font-style: italic;
}

.por-pagar-card__valor-wrap {
    text-align: right;
}

.por-pagar-card__valor-label {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    font-weight: 600;
}

.por-pagar-card__valor {
    font-weight: 800;
    font-size: 1.15rem;
    color: #111827;
    white-space: nowrap;
}

.por-pagar-card__totales {
    display: none;
}

.por-pagar-empty {
    font-size: 13px;
    color: #9ca3af;
    font-style: italic;
    margin: 0 0 12px;
}

.estado-abierto {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    background: #fef3c7;
    color: #92400e;
}

.por-pagar-global-hero {
    background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 14px;
}

.por-pagar-global-hero__main {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.por-pagar-global-hero__label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #9a3412;
}

.por-pagar-global-hero__val {
    font-size: 2rem;
    font-weight: 800;
    color: #c2410c;
    letter-spacing: -0.02em;
}

.por-pagar-global-hero__hint {
    margin: 6px 0 0;
    font-size: 12px;
    color: #78716c;
}

.por-pagar-resumen--global {
    margin-bottom: 12px;
}

.por-pagar-resumen__item small {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 2px;
}

.por-pagar-resumen__item--pagos {
    border-left: 3px solid #6366f1;
}

.por-pagar-resumen__item--convenio {
    border-left: 3px solid #8b5cf6;
}

.por-pagar-global-guide {
    font-size: 12px;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 8px;
    padding: 8px 12px;
    margin: 0 0 12px;
}

.por-pagar-global-row {
    cursor: pointer;
}

.por-pagar-global-row:hover td {
    background: #fffbeb !important;
}

.por-pagar-global-row__inst {
    font-weight: 600;
    color: #111827;
}

.por-pagar-global-row__contrato {
    font-family: monospace;
    font-size: 12px;
    color: #4b5563;
}

.monto-pagos {
    color: #4f46e5;
    font-weight: 600;
}

.monto-convenio {
    color: #7c3aed;
    font-weight: 600;
}

.monto-cero {
    color: #d1d5db;
}

.monto-total {
    color: #c2410c;
}

.por-pagar-back-bar {
    margin-bottom: 10px;
}

/* ── Detalle por contrato ─────────────────────────────── */
.pp-detail-hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 12px;
}

.pp-detail-hero__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.pp-detail-hero__inst {
    font-weight: 700;
    font-size: 14px;
    color: #0f172a;
}

.pp-detail-hero__badge {
    font-family: monospace;
    font-size: 12px;
    color: #475569;
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 6px;
    width: fit-content;
}

.pp-detail-hero__asesor {
    font-size: 12px;
    color: #64748b;
}

.pp-detail-hero__total {
    text-align: right;
    flex-shrink: 0;
}

.pp-detail-hero__total span {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    font-weight: 700;
}

.pp-detail-hero__total b {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
}

.pp-detail-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
}

.pp-detail-split__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.pp-detail-split__item i {
    font-size: 16px;
    color: #94a3b8;
}

.pp-detail-split__item span {
    display: block;
    color: #64748b;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
}

.pp-detail-split__item b {
    font-size: 1.1rem;
    color: #0f172a;
}

.pp-detail-split__item--pagos,
.pp-detail-split__item--convenio {
    background: #f8fafc;
    border-color: #e2e8f0;
    color: inherit;
}

.pp-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.pp-section-count {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 9999px;
}

.pp-section-header .por-pagar-section__title {
    margin: 0;
    flex: 1;
}

.pp-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #e5e7eb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
}

.pp-stat {
    background: #f9fafb;
    padding: 10px 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    border: 2px solid transparent;
}

.pp-stat__pending-alert {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background-color: #fef3c7;
    color: #d97706;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 9999px;
    margin-top: 6px;
    border: 1px solid #fde68a;
    line-height: 1.2;
}

.pp-stat__pending-alert i {
    font-size: 10px;
    color: #d97706;
}

.pp-stat__label {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #6b7280;
    font-weight: 600;
    margin-bottom: 4px;
    line-height: 1.3;
}

.pp-stat__val {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
}

.pp-subtable {
    margin-top: 4px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
}

.pp-subtable__label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px;
}

.pp-bar-labels {
    display: flex;
    gap: 20px;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 12px;
}

.pp-bar-labels b {
    color: #111827;
}

.pp-progress-section {
    margin-bottom: 14px;
    padding: 8px 12px;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px solid #f1f5f9;
}

.pp-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.pp-progress-title {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.pp-progress-percentage {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
}

.pp-progress-bar-container {
    height: 10px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    display: flex;
}

.pp-progress-bar-segment {
    height: 100%;
    transition: width 0.3s ease;
}

.pp-progress-bar-segment--closed {
    background: linear-gradient(90deg, #10b981, #059669);
}

.pp-progress-bar-segment--open {
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.pp-progress-legend {
    display: flex;
    gap: 12px;
    margin-top: 6px;
    font-size: 10px;
    color: #64748b;
}

.pp-progress-legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
}

.dot--closed {
    background-color: #10b981;
}

.dot--open {
    background-color: #fbbf24;
}

.pp-progress-bar-segment--pending {
    background: linear-gradient(90deg, #f87171, #ef4444);
}

.dot--pending {
    background-color: #ef4444;
}

/* Hover highlights for stats and segments */
.pp-stat--highlight-closed {
    border: 2px solid #10b981 !important;
    background-color: #f0fdf4 !important;
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.pp-stat--highlight-open {
    border: 2px solid #fbbf24 !important;
    background-color: #fffbeb !important;
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);
}

.pp-stat--highlight-pending {
    border: 2px solid #ef4444 !important;
    background-color: #fef2f2 !important;
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.pp-progress-bar-segment {
    cursor: pointer;
    transition: all 0.25s ease;
}

.pp-progress-bar-segment--dimmed {
    opacity: 0.35;
    filter: grayscale(40%);
}

.text-bold, .font-bold {
    font-weight: 700 !important;
}

.pp-cell-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 4px 0;
}

.pp-cell-btn {
    font-size: 10px !important;
    padding: 4px 8px !important;
    height: auto !important;
    border-radius: 6px !important;
}

.por-pagar-global-row {
    transition: all 0.2s ease !important;
}

.por-pagar-global-row:hover td {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
}

.por-pagar-global-row--dark:hover td {
    background-color: #1e293b !important;
    color: #ffffff !important;
}

.status-sin-valores {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #10b981;
    font-size: 11px;
    font-weight: 600;
    background-color: #f0fdf4;
    padding: 3px 10px;
    border-radius: 9999px;
    border: 1px solid #bbf7d0;
}

/* ── Datos convenio unificados ───────────────────────── */
.pp-convenio-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.pp-convenio-info__global {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
}
.pp-convenio-info__periodo {
    font-size: 12px;
    font-weight: 600;
    color: #0f172a;
}
.pp-convenio-info__periodo--empty {
    color: #94a3b8;
}
.pp-convenio-info__anios {
    font-size: 11px;
    color: #64748b;
}

/* ── N/A badge ───────────────────────────────────────── */
.pp-na-badge {
    font-size: 11px;
    color: #94a3b8;
    font-style: italic;
    font-weight: 500;
}

/* ── Headers de saldo: enmarcados con borde superior ─── */
.pp-th-saldo th {
    border-top: 3px solid #64748b !important;
    background-color: #f8fafc !important;
    font-weight: 700 !important;
}
.pp-th-saldo--first th {
    border-left: 2px solid #94a3b8 !important;
}
.pp-th-saldo--last th {
    border-right: 2px solid #94a3b8 !important;
}

/* ── Filtro tipo saldo ───────────────────────────────── */
.pp-filtro-saldo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}
.pp-filtro-saldo__label {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
    white-space: nowrap;
}
.pp-filtro-saldo__btns {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}
.pp-filtro-btn {
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.15s;
}
.pp-filtro-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
}
.pp-filtro-btn--active {
    background: #1e293b;
    color: #ffffff;
    border-color: #1e293b;
    font-weight: 600;
}

/* Accordion system styling */
.pp-accordion {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 14px;
}

.pp-accordion__item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pp-accordion__item--open {
    border-color: #cbd5e1;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.pp-accordion__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    background: #f8fafc;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s ease;
}

.pp-accordion__header:hover {
    background: #f1f5f9;
}

.pp-accordion__title-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

.pp-accordion__header-icon {
    font-size: 1.1rem;
}

.pp-accordion__title {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
}

.pp-accordion__arrow {
    font-size: 0.95rem;
    color: #64748b;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pp-accordion__item--open .pp-accordion__arrow {
    transform: rotate(180deg);
}

.pp-accordion__body {
    padding: 16px;
    border-top: 1px solid #f1f5f9;
    background: #ffffff;
}

/* Override card-list margin inside body */
.pp-accordion__body .por-pagar-card-list {
    margin-top: 0;
}

/* Unified Dashboard Hero Styling - Default (Light Mode) */
.pp-dashboard-hero {
    display: grid;
    grid-template-columns: 1fr 1px 1.2fr;
    background: linear-gradient(135deg, #ffffff, #f8fafc);
    color: #1e293b;
    border-radius: 14px;
    padding: 24px 30px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    border: 1px solid #e2e8f0;
    align-items: center;
    gap: 24px;
}

.pp-dashboard-hero__main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.pp-hero-badge-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.pp-dashboard-hero__label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.pp-dashboard-hero__hint {
    font-size: 11px;
    color: #0284c7;
    font-weight: 650;
}

.pp-dashboard-hero__val {
    font-size: 30px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
}

.pp-dashboard-hero__divider {
    background-color: #e2e8f0;
    height: 60px;
    width: 1px;
}

.pp-dashboard-hero__breakdown {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.pp-breakdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #f1f5f9;
    transition: all 0.2s ease;
}

.pp-breakdown-item:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
}

.pp-breakdown-item__icon {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
}

.pp-breakdown-item--pagos .pp-breakdown-item__icon {
    color: #0284c7;
    background: #e0f2fe;
}

.pp-breakdown-item--convenio .pp-breakdown-item__icon {
    color: #059669;
    background: #d1fae5;
}

.pp-breakdown-item__content {
    display: flex;
    flex-direction: column;
}

.pp-breakdown-item__label {
    font-size: 10px;
    color: #64748b;
    font-weight: 500;
}

.pp-breakdown-item__val {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
}

/* Dark Mode Variations */
.pp-dashboard-hero--dark {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: #ffffff;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.15);
    border: 1px solid #334155;
}

.pp-dashboard-hero--dark .pp-dashboard-hero__label {
    color: #94a3b8;
}

.pp-dashboard-hero--dark .pp-dashboard-hero__hint {
    color: #38bdf8;
}

.pp-dashboard-hero--dark .pp-dashboard-hero__val {
    color: #ffffff;
}

.pp-dashboard-hero--dark .pp-dashboard-hero__divider {
    background-color: #334155;
}

.pp-dashboard-hero--dark .pp-breakdown-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.pp-dashboard-hero--dark .pp-breakdown-item:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
}

.pp-dashboard-hero--dark .pp-breakdown-item--pagos .pp-breakdown-item__icon {
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
}

.pp-dashboard-hero--dark .pp-breakdown-item--convenio .pp-breakdown-item__icon {
    color: #34d399;
    background: rgba(52, 211, 153, 0.1);
}

.pp-dashboard-hero--dark .pp-breakdown-item__label {
    color: #94a3b8;
}

.pp-dashboard-hero--dark .pp-breakdown-item__val {
    color: #ffffff;
}

/* Guide box under dashboard */
.por-pagar-global-guide {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #eff6ff;
    border: 1px solid #dbeafe;
    color: #1e40af;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 12px;
    margin-bottom: 20px;
    font-weight: 500;
    width: fit-content;
}

.por-pagar-global-guide i {
    font-size: 14px;
    color: #3b82f6;
}

@media (max-width: 900px) {
    .pp-dashboard-hero {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    .pp-dashboard-hero__divider {
        display: none;
    }
}
</style>
