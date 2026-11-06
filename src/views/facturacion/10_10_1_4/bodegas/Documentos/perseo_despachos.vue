<template>
<div class="vx-row">
    <div class="vx-col w-full">
        <vx-card fixed-height="true">
            <div v-if="menu == 0">
                <!-- FILA 1: Filtro principal (backend) -->
                <div class="despachos-filtros-panel">
                    <div class="filtros-row">
                        <vs-button
                            color="primary"
                            type="filled"
                            icon="refresh"
                            size="small"
                            @click="cargarVentasPerseo()"
                        >
                            <i class="fa-solid fa-sync-alt mr-1"></i> Recargar
                        </vs-button>

                        <vs-button
                            color="success"
                            type="border"
                            size="small"
                            @click="irPanelAdministrativo()"
                        >
                            <i class="fa-solid fa-chart-column mr-1"></i> Ir a Panel
                        </vs-button>

                        <div class="filtros-separador"></div>

                        <div class="filtros-grupo">
                            <span class="filtros-etiqueta">Estado:</span>
                            <div class="filtros-estado-btns">
                                <button
                                    :class="['estado-btn', filtroEstado === 'todos' ? 'estado-btn-activo estado-btn-todos' : '']"
                                    @click="filtroEstado = 'todos'; cargarVentasPerseo()"
                                >Todos</button>
                                <button
                                    :class="['estado-btn', filtroEstado === '2' ? 'estado-btn-activo estado-btn-pendiente' : '']"
                                    @click="filtroEstado = '2'; cargarVentasPerseo()"
                                >Pendientes</button>
                                <button
                                    :class="['estado-btn', filtroEstado === '4' ? 'estado-btn-activo estado-btn-proceso' : '']"
                                    @click="filtroEstado = '4'; cargarVentasPerseo()"
                                >En proceso</button>
                                <button
                                    :class="['estado-btn', filtroEstado === '1' ? 'estado-btn-activo estado-btn-despachado' : '']"
                                    @click="filtroEstado = '1'; cargarVentasPerseo()"
                                >Despachadas</button>
                                <button
                                    :class="['estado-btn', filtroEstado === '3' ? 'estado-btn-activo estado-btn-anulado' : '']"
                                    @click="filtroEstado = '3'; cargarVentasPerseo()"
                                >Anuladas</button>
                            </div>
                        </div>

                        <!-- Resumen inline -->
                        <template v-if="resumenVentas">
                            <div class="filtros-separador"></div>
                            <div class="resumen-item resumen-total">
                                <i class="fa-solid fa-list-ol"></i>
                                <span>Total: <b>{{ resumenVentas.total }}</b></span>
                            </div>
                            <div class="resumen-item resumen-pendientes">
                                <i class="fa-solid fa-clock"></i>
                                <span>Pendientes: <b>{{ resumenVentas.pendientes }}</b></span>
                            </div>
                            <div class="resumen-item resumen-proceso">
                                <i class="fa-solid fa-box-open"></i>
                                <span>En proceso: <b>{{ resumenVentas.en_proceso }}</b></span>
                            </div>
                            <div class="resumen-item resumen-despachadas">
                                <i class="fa-solid fa-check-circle"></i>
                                <span>Despachadas: <b>{{ resumenVentas.despachadas }}</b></span>
                            </div>
                            <div class="resumen-item resumen-anuladas">
                                <i class="fa-solid fa-ban"></i>
                                <span>Anuladas: <b>{{ resumenVentas.anuladas }}</b></span>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- FILA 1.5: ALERTA DE DOCUMENTOS PENDIENTES DE PERSEO -->
                <div v-if="contadorPendientesPerseo > 0 && !filtroActivoPendientesPerseo" class="alerta-pendientes-perseo">
                    <div class="alerta-icono">
                        <i class="fa-solid fa-exclamation-triangle"></i>
                    </div>
                    <div class="alerta-contenido">
                        <div class="alerta-titulo">Documentos pendientes anclar de Perseo</div>
                        <div class="alerta-descripcion">
                            Hay <b>{{ contadorPendientesPerseo }}</b> documento(s) que aún no han sido verificados en Perseo
                        </div>
                    </div>
                    <div class="alerta-accion">
                        <vs-button
                            color="warning"
                            type="filled"
                            size="small"
                            @click="filtrarPendientesPerseo()"
                        >
                            <i class="fa-solid fa-filter mr-1"></i> Ver documentos
                        </vs-button>
                        <vs-button
                            v-if="userRoot"
                            color="primary"
                            type="filled"
                            size="small"
                            class="ml-2"
                            @click="abrirVerificacionMasiva()"
                        >
                            <i class="fa-solid fa-bolt mr-1"></i> Verificar masivo
                        </vs-button>
                    </div>
                </div>

                <!-- FILA 1.6: INDICADOR DE FILTRO ACTIVO -->
                <div v-if="filtroActivoPendientesPerseo" class="filtro-activo-perseo">
                    <div class="filtro-activo-icono">
                        <i class="fa-solid fa-filter-circle-xmark"></i>
                    </div>
                    <div class="filtro-activo-contenido">
                        <div class="filtro-activo-titulo">Filtro Activo: Pendientes de Perseo</div>
                        <div class="filtro-activo-descripcion">
                            Mostrando solo documentos con más de 1 día pendientes de facturar en Perseo
                        </div>
                    </div>
                    <div class="filtro-activo-accion">
                        <vs-button
                            v-if="userRoot"
                            color="primary"
                            type="filled"
                            size="small"
                            class="mr-2"
                            @click="abrirVerificacionMasiva()"
                        >
                            <i class="fa-solid fa-bolt mr-1"></i> Verificar masivo
                        </vs-button>
                        <vs-button
                            color="danger"
                            type="flat"
                            size="small"
                            @click="quitarFiltroPendientesPerseo()"
                        >
                            <i class="fa-solid fa-times mr-1"></i> Quitar filtro
                        </vs-button>
                    </div>
                </div>

                <!-- FILA 2: Filtro de fechas (backend) -->
                <div class="despachos-filtros-fechas">
                    <div class="filtros-row">
                        <button
                            :class="['filtros-fechas-toggle', filtroFechasActivo ? 'filtros-fechas-toggle-activo' : '']"
                            @click="filtroFechasActivo = !filtroFechasActivo"
                        >
                            <i class="fa-solid fa-calendar-days mr-1"></i>
                            {{ filtroFechasActivo ? 'Filtro por Fecha ✓' : 'Filtrar por Fechas' }}
                        </button>

                        <template v-if="filtroFechasActivo">
                            <div class="filtros-separador"></div>

                            <div class="filtros-grupo">
                                <span class="filtros-etiqueta">Desde:</span>
                                <input type="date" v-model="fechaDesde" class="filtros-input-fecha">
                            </div>
                            <div class="filtros-grupo">
                                <span class="filtros-etiqueta">Hasta:</span>
                                <input type="date" v-model="fechaHasta" class="filtros-input-fecha">
                            </div>

                            <div class="filtros-separador"></div>

                            <div class="filtros-grupo" v-if="userRoot || userFacturador || userAdminFacturador">
                                <span class="filtros-etiqueta">Origen:</span>
                                <div class="filtros-radio-group">
                                    <label class="filtros-radio-label">
                                        <input type="radio" v-model="soloEnviadoPerseo" :value="1" class="filtros-radio" @change="cargarVentasPerseo()">
                                        <span>Solo Perseo</span>
                                    </label>
                                    <label class="filtros-radio-label">
                                        <input type="radio" v-model="soloEnviadoPerseo" :value="0" class="filtros-radio" @change="cargarVentasPerseo()">
                                        <span>Todos</span>
                                    </label>
                                </div>
                            </div>

                            <vs-button
                                color="primary"
                                type="border"
                                size="small"
                                @click="filtrarPorFecha()"
                                title="Consultar al servidor con las fechas seleccionadas"
                            >
                                <i class="fa-solid fa-search mr-1"></i> Consultar
                            </vs-button>
                            <vs-button
                                color="danger"
                                type="flat"
                                size="small"
                                @click="limpiarFiltroFechas()"
                                title="Quitar filtro de fechas y recargar todo"
                            >
                                <i class="fa-solid fa-times mr-1"></i> Quitar filtro
                            </vs-button>
                        </template>
                    </div>
                </div>
                <perseo-tabla-avanzada
                    :datos="ventasFiltradas"
                    :columnas="columnasTabla"
                    :mostrar-acciones="true"
                    :items-por-pagina-inicial="25"
                >
                    <template #column-ven_codigo="{ row }">
                        <div class="py-2">
                            <div class="font-bold text-primary">{{ row.ven_codigo }}</div>
                            <div class="text-xs text-gray-600 mt-1">
                                <vx-tooltip :text="`Empresa: ${row.empresa || 'N/A'}`" position="left">
                                    <i class="fa-solid fa-building"></i> {{ row.empresa || 'N/A' }}
                                </vx-tooltip>
                            </div>
                            <div v-if="row.contrato" class="text-xs text-gray-600 mt-1">
                                <vx-tooltip :text="`Contrato: ${row.contrato}`" position="left">
                                     <i class="fa-solid fa-file-contract"></i> {{ row.contrato }}
                                </vx-tooltip>
                            </div>
                            <div v-if="row.nombre_facturador" class="text-xs text-gray-600 mt-1">
                                <vx-tooltip :text="`Facturador: ${row.nombre_facturador}`" position="left">
                                     <i class="fa-solid fa-user"></i> {{ row.nombre_facturador }}
                                </vx-tooltip>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">
                                <vx-tooltip :text="`Fecha de venta: ${fechaCorta(row.ven_fecha)}`" position="left">
                                     <i class="fa-solid fa-calendar-days"></i> {{ fechaCorta(row.ven_fecha) }}
                                </vx-tooltip>
                            </div>
                            <div v-if="row. idtipodoc == 12" class="text-xs text-gray-600 mt-1 text-danger">
                                <vx-tooltip :text="`GUIA DOCENTE`" position="left">
                                     <i class="fa-solid fa-file"></i> DOCUMENTO GUIA
                                </vx-tooltip>
                            </div>
                           
                        </div>
                    </template>

                    <template #column-ven_cliente="{ row }">
                        <div class="py-2">
                            <div class="font-semibold">{{ row.nombre_cliente || 'Sin cliente' }}</div>
                            <div v-if="row.asesor_guia" class="text-xs text-gray-600 mt-1">
                              <vx-tooltip text="Asesor de guía" position="left">
                                <i class="fa-solid fa-user"></i> Asesor: {{ row.asesor_guia }}
                              </vx-tooltip>
                            </div>
                            <div v-if="row.nombreInstitucion" class="text-xs text-gray-600 mt-1">
                                <vx-tooltip text="Lugar de despacho" position="left">
                                    <i class="fa-solid fa-school"></i> {{ row.nombreInstitucion }}
                                </vx-tooltip>
                            </div>
                            <div v-if="row.periodoescolar" class="text-xs text-gray-600 mt-1">
                                <vx-tooltip text="Periodo escolar" position="left">
                                    <i class="fa-solid fa-calendar-days"></i> {{ row.periodoescolar }}
                                </vx-tooltip>
                            </div>
                        </div>
                    </template>

                    <template #column-estado_nombre="{ row }">
                        <div class="py-2" style="display:flex; flex-direction:column; align-items:flex-start; gap:4px;">
                            <vs-chip :color="getColorEstadoVenta(row.est_ven_codigo)">
                                {{ getTextoEstadoVenta(row) }}
                            </vs-chip>
                            <div v-if="row.proceso_empacar != 0">
                                <vx-tooltip :text="row.proceso_empacar == 2 ? 'Ver detalle del empaque' : 'Ver empaque en proceso'" position="left">
                                    <vs-chip
                                        :color="row.proceso_empacar == 1 ? 'warning' : 'success'"
                                        class="cursor-pointer"
                                        @click.native="ObjectedSelected = row; popupEmpacar = true"
                                    >
                                        <i class="fa-solid fa-box-open mr-1"></i>
                                        {{ row.proceso_empacar == 1 ? 'Por empacarse' : 'Empacado' }}
                                    </vs-chip>
                                </vx-tooltip>
                            </div>
                            <!-- Info de anulación debajo del estado -->
                            <template v-if="row.est_ven_codigo == 3">
                                <div v-if="row.usuario_anulacion_nombre" class="text-xs" style="color:#ef4444;">
                                    <i class="fa-solid fa-user-slash"></i> {{ row.usuario_anulacion_nombre }}
                                </div>
                                <div v-if="row.fecha_anulacion" class="text-xs" style="color:#ef4444;">
                                    <i class="fa-solid fa-calendar-xmark"></i> {{ fechaCorta(row.fecha_anulacion) }}
                                </div>
                                <div v-if="row.observacionAnulacion" class="text-xs" style="color:#ef4444; max-width:160px; word-break:break-word;">
                                    <i class="fa-solid fa-comment-slash"></i> {{ row.observacionAnulacion }}
                                </div>
                            </template>
                        </div>
                    </template>

                    <!-- <template #column-ven_fecha="{ row }">
                        <div class="py-2">
                            <div class="text-sm">
                                <i class="fa-solid fa-calendar"></i>
                                {{ fechaCorta(row.ven_fecha) }}
                            </div>
                        </div>
                    </template> -->

                    <template #column-factura_perseo="{ row }">
                        <div class="py-2">
                            <div v-if="row.pedido_codigo" class="text-xs text-gray-600 mt-1">
                                <vx-tooltip text="Pedido Perseo" position="left">
                                    <i class="fa-regular fa-file"></i> {{ row.pedido_codigo }}
                                </vx-tooltip>
                            </div>
                            <div v-if="row.factura_perseo">
                                <vs-chip color="success" class="font-semibold">
                                    <i class="fa-solid fa-file-invoice"></i>
                                    {{ row.factura_perseo }}
                                </vs-chip>
                                <!-- <div v-if="row.id_factura_perseo" class="text-xs text-gray-600 mt-1">
                                    ID: {{ row.id_factura_perseo }}
                                </div> -->
                            </div>
                            <div v-else-if="row.estadoPerseo == 1">
                                <vs-chip color="warning">
                                    <i class="fa-solid fa-clock"></i>
                                    Pendiente
                                </vs-chip>
                            </div>
                            <div v-else>
                                <span class="text-xs text-gray-500">-</span>
                            </div>
                        </div>
                    </template>

                    <template #acciones="{ row }">
                        <button
                            class="menu-trigger-btn"
                            :class="{ active: selectedRow && selectedRow.ven_codigo === row.ven_codigo }"
                            @click.stop="toggleMenu(row, $event)"
                            title="Acciones"
                        >⋮</button>
                    </template>
                </perseo-tabla-avanzada>

                <!-- ═══ PANEL FLOTANTE — fuera de tabla para no afectar columnas ═══ -->
                <transition name="menu-slide">
                    <div
                        v-if="selectedRow"
                        class="menu-flotante"
                        :style="menuStyle"
                        @click.stop
                    >
                        <div class="menu-header">
                            <span class="menu-titulo">Acciones</span>
                            <button class="menu-cerrar" @click="cerrarMenu">✕</button>
                        </div>

                        <div class="menu-codigo">{{ selectedRow.ven_codigo }}</div>

                        <div class="menu-items">

                            <!-- Ver Detalles -->
                            <button
                                class="menu-item menu-item--detalles"
                                @click="f_cantidadDespachado(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-eye"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Ver Detalles</strong>
                                    <small>Información del documento</small>
                                </span>
                            </button>

                            <!-- Imprimir PDF -->
                            <button
                                class="menu-item menu-item--pdf"
                                @click="ObjectedSelected = selectedRow; verPDFVenta(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-print"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Imprimir PDF</strong>
                                    <small>Descargar documento de venta</small>
                                </span>
                            </button>

                            <!-- Verificar en Perseo -->
                            <button
                                v-if="((selectedRow.est_ven_codigo == 2 || selectedRow.est_ven_codigo == 4 || selectedRow.est_ven_codigo == 1) && selectedRow.estadoPerseo == 1 && !selectedRow.factura_perseo) && !userFacturador && !userAdminFacturador"
                                class="menu-item menu-item--verificar"
                                @click="ObjectedSelected = selectedRow; verificarPedidoPerseo(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-search"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Verificar en Perseo</strong>
                                    <small>Consultar estado en Perseo</small>
                                </span>
                            </button>

                            <!-- Marcar En Proceso -->
                            <button
                                v-if="selectedRow.est_ven_codigo == 2 && !userFacturador && !userAdminFacturador"
                                class="menu-item menu-item--proceso"
                                @click="ObjectedSelected = selectedRow; marcarEnProcesoDespacho(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-box-open"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Marcar En Proceso</strong>
                                    <small>Cambiar estado a en proceso</small>
                                </span>
                            </button>

                            <!-- Despachar -->
                            <button
                                v-if="selectedRow.est_ven_codigo == 4 && !userFacturador && !userAdminFacturador && (selectedRow.proceso_empacar == 0 || selectedRow.proceso_empacar == 2)"
                                class="menu-item menu-item--despachar"
                                @click="ObjectedSelected = selectedRow; marcarComoDespachadoPerseo(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-truck"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Despachar</strong>
                                    <small>Marcar como despachado</small>
                                </span>
                            </button>

                            <!-- Empacar -->
                            <button
                                v-if="selectedRow.est_ven_codigo == 4 && !userFacturador && !userAdminFacturador && (selectedRow.proceso_empacar == 1 || selectedRow.proceso_empacar == 0)"
                                class="menu-item menu-item--empacar"
                                @click="ObjectedSelected = selectedRow; popupEmpacar = true; cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-box-open"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Empacar</strong>
                                    <small>Gestionar empaque</small>
                                </span>
                            </button>

                            <!-- Cambiar Estado -->
                            <button
                                v-if="puedeMostrarBotonCambioEstado(selectedRow)"
                                class="menu-item menu-item--cambiar-estado"
                                @click="abrirPopupCambioEstado(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-repeat"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Cambiar Estado</strong>
                                    <small>Cambio manual de estado</small>
                                </span>
                            </button>

                            <!-- Ver Escaneos -->
                            <button
                                v-if="tieneEscaneosBodega(selectedRow)"
                                class="menu-item menu-item--escaneos"
                                @click="abrirPopupEscaneos(selectedRow); cerrarMenu()"
                            >
                                <span class="menu-item-icono"><i class="fa-solid fa-barcode"></i></span>
                                <span class="menu-item-texto">
                                    <strong>Ver Escaneos</strong>
                                    <small>Detalle de escaneos de bodega</small>
                                </span>
                            </button>

                        </div>
                    </div>
                </transition>
            </div>
            <!--CREAR EMPAQUE-->
            <div v-if="menu == 1">
                <vs-button type="line" class="mt-2" @click="menu = 0;">← Regresar</vs-button>
                <EmpacarCrearVue :opcion="opcion" :ObjectedDocument="ObjectedSelected" :id="id" @changen="changen" />
            </div>
            <!--modales-->
            <!-- DOCUMENTO IMPRESION PDF -->
            <vs-popup-history
                v-if="popupPDFVenta"
                fullscreen
                class="popup-pdf-venta"
                :title="`Documento ${ventaSeleccionadaPDF.ven_codigo || ''}`"
                :active.sync="popupPDFVenta"
            >
                <ReporteVentasPDF
                    v-if="ventaSeleccionadaPDF"
                    :venta="ventaSeleccionadaPDF"
                    @estadoCambiado="recargarListadoDespuesDeEstadoCambiado"
                />
            </vs-popup-history>
        </vx-card>

        <vs-popup class="despachar" :title="`Cambiar Estado de Venta`" :active.sync="popupCambioEstado">
            <div v-if="popupCambioEstado && ventaCambioEstado">
                <div class="cambio-estado-hero">
                    <div>
                        <div class="cambio-estado-kicker">Cambio manual de estado</div>
                        <div class="cambio-estado-documento">Documento {{ ventaCambioEstado.ven_codigo }}</div>
                    </div>
                    <vs-chip :color="getColorEstadoVenta(ventaCambioEstado.est_ven_codigo)">
                        {{ getTextoEstadoVenta(ventaCambioEstado) }}
                    </vs-chip>
                </div>

                <div class="cambio-estado-resumen">
                    <div class="cambio-estado-resumen-item">
                        <span class="cambio-estado-resumen-label">Estado actual</span>
                        <span class="cambio-estado-resumen-value">{{ getTextoEstadoVenta(ventaCambioEstado) }}</span>
                    </div>
                    <div class="cambio-estado-resumen-item">
                        <span class="cambio-estado-resumen-label">Nuevo estado</span>
                        <span class="cambio-estado-resumen-value cambio-estado-resumen-value-destino">
                            {{ getTextoEstadoDestinoSeleccionado() }}
                        </span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="font-semibold mb-2 block">Selecciona el nuevo estado</label>
                    <div class="estado-opciones-grid">
                        <button
                            v-for="op in opcionesCambioEstado"
                            :key="'op-' + op.value"
                            type="button"
                            :class="['estado-opcion-card', estadoDestinoCambio == op.value ? 'estado-opcion-card-activa' : '']"
                            @click="seleccionarEstadoDestino(op.value)"
                        >
                            <div class="estado-opcion-top">
                                <vs-chip :color="op.color" class="m-0">{{ op.shortLabel }}</vs-chip>
                                <i class="fa-solid fa-circle-check estado-opcion-check" v-if="estadoDestinoCambio == op.value"></i>
                            </div>
                            <div class="estado-opcion-label">{{ op.label }}</div>
                            <div class="estado-opcion-desc">{{ op.descripcion }}</div>
                        </button>
                        <button
                            v-if="ventaCambioEstado.proceso_empacar ==2"
                            type="button"
                            :class="['estado-opcion-card', estadoDestinoCambio == 'empaque' ? 'estado-opcion-card-activa' : '']"
                            @click="seleccionarEstadoDestino('empaque')"
                        >
                          <div class="estado-opcion-top">
                              <vs-chip color="dark" class="m-0">EMPAC</vs-chip>
                              <i class="fa-solid fa-circle-check estado-opcion-check" v-if="estadoDestinoCambio == 'empaque'"></i>
                          </div>
                          <div class="estado-opcion-label">Por Empacarse</div>
                          <div class="estado-opcion-desc">Marcar el documento como por empacarse y poder editar</div>
                        </button>
                    </div>
                </div>

                <!-- ⭐ SECCIÓN DE LIMPIEZA: Aparece cuando se selecciona Pendiente -->
                <div v-if="estadoDestinoCambio == '2'" class="seccion-limpiar-pendiente">
                    <div v-if="ventaCambioEstado.proceso_empacar == 2" class="mensaje-no-limpiar">
                        <vs-alert color="dark">
                            <template #icon>
                                <i class="fa-solid fa-info-circle"></i>
                            </template>
                            <strong>No se puede limpiar items de subida de códigos</strong>
                            <p>El documento ya fue empacado y no se pueden limpiar items del documento de venta.</p>
                        </vs-alert>
                    </div>

                    <div v-else-if="ventaCambioEstado.est_ven_codigo == 1" class="mensaje-no-limpiar">
                        <vs-alert color="dark">
                            <template #icon>
                                <i class="fa-solid fa-info-circle"></i>
                            </template>
                            <strong>No se puede limpiar items de subida de códigos</strong>
                            <p>El documento ya está despachado.</p>
                        </vs-alert>
                    </div>

                    <div v-else-if="itemsParaLimpiar.length > 0">
                        <div class="header-limpiar">
                            <h3 class="titulo-limpiar">
                                <i class="fa-solid fa-broom mr-2"></i>
                                Limpiar Items Despachados
                            </h3>

                            <div class="descripcion-limpiar">
                                Selecciona los items que colocar <b>en cero</b> <br>
                                <p>* Si no seleccionas ninguno, solo se cambiará el estado a Pendiente.</p>
                                <p>* Si selecciona un item deberá volver a iniciar empaque nuevamente.</p>
                            </div>

                        </div>

                        <div class="controles-limpiar">
                            <div class="buscador-items">
                                <i class="fa-solid fa-search"></i>
                                <input
                                    type="text"
                                    v-model="busquedaItemsLimpiar"
                                    placeholder="Buscar por código o nombre..."
                                    class="input-buscar-items"
                                />
                            </div>

                            <div v-if="hayItemsConDespacho" class="filtros-items">
                                <vs-checkbox
                                    v-model="seleccionarTodosLimpiar"
                                    @change="toggleSeleccionTodosLimpiar"
                                >
                                    Seleccionar todos
                                </vs-checkbox>

                                <vs-checkbox
                                    v-model="mostrarSoloSeleccionados"
                                >
                                    Solo seleccionados
                                </vs-checkbox>
                            </div>
                        </div>

                        <div class="tabla-items-limpiar">
                            <table class="w-full">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;">
                                            <i class="fa-solid fa-check-square"></i>
                                        </th>
                                        <th>Código</th>
                                        <th>Libro</th>
                                        <th class="text-center">Despachado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="item in itemsParaLimpiarFiltrados"
                                        :key="'limpiar-' + item.pro_codigo"
                                        :class="{'fila-deshabilitada': item.det_ven_cantidad_despacho === 0}"
                                    >
                                        <td>
                                            <vs-checkbox
                                                v-model="item.seleccionado"
                                                :disabled="item.det_ven_cantidad_despacho === 0"
                                            />
                                        </td>
                                        <td>
                                            <span class="codigo-producto">{{ item.pro_codigo }}</span>
                                        </td>
                                        <td>
                                            <span class="nombre-producto">{{ item.nombre_libro }}</span>
                                        </td>
                                        <td class="text-center">
                                            <vs-chip
                                                :color="item.det_ven_cantidad_despacho > 0 ? 'success' : 'dark'"
                                                size="small"
                                            >
                                                {{ item.det_ven_cantidad_despacho }}
                                            </vs-chip>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div v-if="itemsParaLimpiarFiltrados.length === 0" class="sin-resultados">
                                <i class="fa-solid fa-search"></i>
                                <p>No se encontraron items con ese criterio</p>
                            </div>
                        </div>

                        <div v-if="itemsSeleccionadosLimpiar.length > 0" class="alerta-seleccion">
                            <vs-alert color="warning">
                                <template #icon>
                                    <i class="fa-solid fa-exclamation-triangle"></i>
                                </template>
                                <strong>{{ itemsSeleccionadosLimpiar.length }}</strong> item(s) seleccionado(s) para limpiar
                            </vs-alert>
                        </div>
                    </div>

                    <div v-else class="mensaje-no-limpiar">
                        <vs-alert color="dark">
                            <template #icon>
                                <i class="fa-solid fa-info-circle"></i>
                            </template>
                            <strong>No se puede limpiar items de subida de códigos</strong>
                            <p>El documento ya está despachado y no tiene items para limpiar.</p>
                        </vs-alert>
                    </div>
                </div>

                <div class="cambio-estado-nota">
                    Este cambio solo actualiza el estado operativo del documento. La trazabilidad queda registrada en el listado.
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <vs-button color="warning" type="flat" @click="cerrarPopupCambioEstado">
                        Cancelar
                    </vs-button>
                    <vs-button
                        color="primary"
                        type="filled"
                        :disabled="!estadoDestinoCambio"
                        @click="confirmarCambioEstadoManual"
                    >
                        {{ estadoDestinoCambio == '2' && itemsSeleccionadosLimpiar.length > 0 ? 'Limpiar y Guardar' : 'Guardar cambio' }}
                    </vs-button>
                </div>
            </div>
        </vs-popup>
        <vs-popup class="despachar" :title="`Escaneos de ${ventaEscaneos && ventaEscaneos.ven_codigo ? ventaEscaneos.ven_codigo : ''}`" :active.sync="popupEscaneos">
            <div v-if="popupEscaneos">
                <div v-if="escaneosVentaDetalle.length === 0" class="text-center p-2">
                    No hay escaneos registrados para este documento.
                </div>
                <div v-else class="escaneos-lista">
                    <div v-for="(escaneo, idx) in escaneosVentaDetalle" :key="'escaneo-detalle-' + idx" class="escaneo-item">
                        <div class="escaneo-item-header">
                            <div class="escaneo-item-title">Escaneo #{{ idx+1 }}</div>
                            <vs-chip :color="getColorEstadoEscaneo(escaneo.estado)">
                                {{ getTextoEstadoEscaneo(escaneo.estado) }}
                            </vs-chip>
                        </div>
                        <div class="escaneo-item-grid">
                            <div class="escaneo-item-campo">
                                <span class="escaneo-item-label">Usuario</span>
                                <span class="escaneo-item-value">{{ escaneo.nombre_usuario ? escaneo.nombre_usuario : '-' }}</span>
                            </div>
                            <div class="escaneo-item-campo">
                                <span class="escaneo-item-label">Fecha inicio</span>
                                <span class="escaneo-item-value">{{ formatearFechaHoraEscaneo(escaneo.fecha_inicio) }}</span>
                            </div>
                            <div class="escaneo-item-campo">
                                <span class="escaneo-item-label">Fecha fin</span>
                                <span class="escaneo-item-value">{{ formatearFechaHoraEscaneo(escaneo.fecha_fin) }}</span>
                            </div>
                            <div class="escaneo-item-campo">
                                <span class="escaneo-item-label">Códigos subidos</span>
                                <span class="escaneo-item-value">{{ escaneo.codigos_subidos != null ? escaneo.codigos_subidos : 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end mt-2">
                    <vs-button color="primary" type="filled" @click="popupEscaneos = false">Cerrar</vs-button>
                </div>
            </div>
        </vs-popup>
        <!--modal para mover a pendiente-->
        <vs-popup class="informacionformhijo" :title="`Regresar a Pendiente`" :active.sync="popupRegresarAPendiente">
            <div v-if="popupRegresarAPendiente">
                <p class="text-center">Regresar a pendiente documento: <b>{{ ObjectedSelected.ven_codigo }}</b></p>
                <br>
                <RegresarAPendiente :datadocumento="ObjectedSelected" @change="changePendiente" />
            </div>
        </vs-popup>
        <!--MODAL PARA EDITAR EMPACADO-->
        <vs-popup fullscreen  :active.sync="popupAbrirEmpacadoEditar" title="Editar" class="popopPadre">
            <div v-if="popupAbrirEmpacadoEditar">
                <EmpacarEditVue :ObjectedDocument="ObjectedDocument" :id="ObjectedSelected.ven_codigo" @cerrar="change" />
            </div>
        </vs-popup>
        <!--MODAL PARA INGRESAR GUIA-->
        <vs-popup
            :active.sync="popupAbrirIngresarGuia"
            title="Ingresar Guía"
            class="popopPadre"
            :fullscreen="Number(onlyVisualizar) === 1"
            >
            <p v-if="ObjectedSelected.remi_guia_remision"><b>Guia de remision</b>: {{ ObjectedSelected.remi_guia_remision }}</p>
            <div v-if="popupAbrirIngresarGuia">
                <EmpacadoIngresoGuiaVue
                :ObjectedSelected="ObjectedSelected"
                @changeGuia="changeGuia"
                :onlyVisualizar="onlyVisualizar"
                />
            </div>
        </vs-popup>
        <!--MODAL PARA MOSTRAR HOJA DIARIA-->
        <vs-popup fullscreen v-if="popupReporteDespachoCALMED" :active.sync="popupReporteDespachoCALMED" class="popopPadre" title="Reporte">
            <div v-if="popupReporteDespachoCALMED">
                <vs-row class=" border rounded-md">
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <div class="flex justify-center">
                            <b class="mr-3">Reporte con guias de remision </b>
                            <vs-switch color="success" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="conguia">
                                <span slot="on">SI</span>
                                <span slot="off">NO</span>
                            </vs-switch>
                        </div>
                    </vs-col>
                </vs-row>
                <br>
                <div align="center" class="mb-3">
                    <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
                    <vs-button @click="m_imprimirTodos('12px',`reporte_${ObjectedDocument.remi_num_factura}_diarioDespacho'}`,'0px','')">Imprimir</vs-button>
                </div>
                <br>
                <vx-card id="seccionImprimir2">
                    <exportDespachoCALMEDVue :datos="ObjectedDocument" :conguia="conguia" />
                </vx-card>
            </div>
        </vs-popup>
        <!--MODAL PARA VERIFICAR PEDIDO EN PERSEO-->
        <vs-popup fullscreen :title="'Verificar Pedido en Perseo: ' + (ObjectedSelected.ven_codigo || '')" :active.sync="popupVerificarPerseo" class="popopPadre">
            <div v-if="popupVerificarPerseo">
                <div class="mb-4">
                    <vs-button @click="cerrarVerificacionPerseo" color="danger" type="border">
                        <i class="fa-solid fa-times"></i> Cerrar
                    </vs-button>
                </div>

                <!-- Loading Pedido -->
                <div v-if="loadingPerseo" class="text-center p-4">
                    <vs-progress indeterminate color="primary"></vs-progress>
                    <p class="mt-3">Consultando pedido en Perseo...</p>
                </div>

                <!-- Contenido cuando hay datos -->
                <div v-else-if="dataPerseo">
                    <!-- Información de la Venta -->
                    <vx-card class="mb-4">
                        <h4 class="mb-3"><i class="fa-solid fa-info-circle"></i> Información de la Venta</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Código de Venta:</strong> {{ dataPerseo.venta_info.ven_codigo }}
                            </div>
                            <div>
                                <strong>ID Pedido Perseo:</strong> {{ dataPerseo.venta_info.id_pedido_perseo }}
                            </div>
                            <div>
                                <strong>Código Pedido:</strong> {{ dataPerseo.venta_info.pedido_codigo }}
                            </div>
                            <!-- <div>
                                <strong>Fecha Envío:</strong> {{ fechaLarga(dataPerseo.venta_info.fecha_envio_perseo) }}
                            </div> -->
                            <div v-if="dataPerseo.venta_info.id_factura_perseo">
                                <strong>ID Factura Perseo:</strong>
                                <vs-chip color="success">{{ dataPerseo.venta_info.id_factura_perseo }}</vs-chip>
                            </div>
                            <div v-if="dataPerseo.venta_info.factura_perseo">
                                <strong>Factura:</strong>
                                <vs-chip color="success">{{ dataPerseo.venta_info.factura_perseo }}</vs-chip>
                            </div>
                        </div>
                    </vx-card>

                    <!-- Información del Pedido -->
                    <vx-card v-if="dataPerseo.data && dataPerseo.data.pedidos && dataPerseo.data.pedidos.length > 0" class="mb-4">
                        <h4 class="mb-3"><i class="fa-solid fa-receipt"></i> Información del Pedido</h4>
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <strong>Cliente:</strong> {{ dataPerseo.data.pedidos[0].cliente }}
                            </div>
                            <div>
                                <strong>Estado:</strong>
                                <vs-chip :color="getEstadoPedidoColor(dataPerseo.data.pedidos[0].estado)">
                                    {{ getEstadoPedidoTexto(dataPerseo.data.pedidos[0].estado) }}
                                </vs-chip>
                            </div>
                            <div>
                                <strong>Total:</strong> ${{ Number(dataPerseo.data.pedidos[0].total || 0).toFixed(2) }}
                            </div>
                            <div>
                                <strong>Emisión:</strong> {{ formatearFecha(dataPerseo.data.pedidos[0].emision) }}
                            </div>
                            <div>
                                <strong>Almacén:</strong> {{ dataPerseo.data.pedidos[0].almacen }}
                            </div>
                            <div>
                                <strong>Forma de Pago:</strong> {{ dataPerseo.data.pedidos[0].forma_pago }}
                            </div>
                        </div>

                        <!-- Banner: Pedido aún no facturado -->
                        <div v-if="dataPerseo.data.pedidos[0].estado != 3" class="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                            <i class="fa-solid fa-clock text-warning"></i>
                            <strong class="text-warning ml-2">Pedido aún no facturado</strong>
                            <p class="text-sm mt-2">Este pedido se encuentra en estado: <b>{{ getEstadoPedidoTexto(dataPerseo.data.pedidos[0].estado) }}</b></p>
                        </div>

                        <!-- Detalles del Pedido (tabla de productos - colapsable) -->
                        <div v-if="dataPerseo.data.pedidos[0].detalles && dataPerseo.data.pedidos[0].detalles.length > 0" class="mt-4">
                            <vs-collapse accordion>
                                <vs-collapse-item>
                                    <div slot="header" class="flex items-center gap-2">
                                        <i class="fa-solid fa-list"></i>
                                        <strong>Detalles del Pedido ({{ dataPerseo.data.pedidos[0].detalles.length }} productos)</strong>
                                    </div>
                                    <div class="overflow-auto" style="max-height: 400px;">
                                        <table class="w-full border">
                                            <thead class="bg-gray-200 sticky top-0">
                                                <tr>
                                                    <th class="p-2 border text-left">Código</th>
                                                    <th class="p-2 border text-left">Producto</th>
                                                    <th class="p-2 border text-center">Cantidad</th>
                                                    <th class="p-2 border text-right">Precio</th>
                                                    <th class="p-2 border text-right">Descuento</th>
                                                    <th class="p-2 border text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(detalle, index) in dataPerseo.data.pedidos[0].detalles" :key="index">
                                                    <td class="p-2 border">{{ detalle.productocodigo }}</td>
                                                    <td class="p-2 border">{{ detalle.nombreproducto }}</td>
                                                    <td class="p-2 border text-center">{{ detalle.cantidad }}</td>
                                                    <td class="p-2 border text-right">${{ Number(detalle.precio || 0).toFixed(2) }}</td>
                                                    <td class="p-2 border text-right">{{ detalle.descuento }}%</td>
                                                    <td class="p-2 border text-right font-bold">
                                                        ${{ ((detalle.cantidad * detalle.precio) - ((detalle.cantidad * detalle.precio * detalle.descuento) / 100)).toFixed(2) }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </vs-collapse-item>
                            </vs-collapse>
                        </div>
                    </vx-card>

                    <!-- Loading Factura -->
                    <vx-card v-if="loadingFactura" class="mb-4">
                        <div class="text-center p-4">
                            <vs-progress indeterminate color="success"></vs-progress>
                            <p class="mt-3">Verificando factura en Perseo...</p>
                        </div>
                    </vx-card>

                    <!-- Información de la Factura cuando se encuentra -->
                    <vx-card v-else-if="dataFactura && dataFactura.factura_encontrada" class="mb-4">
                        <div class="p-3 bg-green-100 border border-green-300 rounded mb-4">
                            <i class="fa-solid fa-check-circle text-success"></i>
                            <strong class="text-success ml-2">Factura vinculada exitosamente</strong>
                            <p class="text-sm mt-2">El pedido está facturado y se ha guardado la información en el sistema.</p>
                        </div>

                        <h4 class="mb-3"><i class="fa-solid fa-file-invoice"></i> Información de la Factura</h4>
                        <div class="grid grid-cols-3 gap-4" v-if="dataFactura.factura_info && dataFactura.factura_info.factura_completa">
                            <div>
                                <strong>Número:</strong> {{ dataFactura.factura_info.factura_perseo }}
                            </div>
                            <div>
                                <strong>Emisión:</strong> {{ formatearFecha(dataFactura.factura_info.factura_completa.emision) }}
                            </div>
                            <div>
                                <strong>Total:</strong> ${{ Number(dataFactura.factura_info.factura_completa.total || 0).toFixed(2) }}
                            </div>
                            <div>
                                <strong>Cliente:</strong> {{ dataFactura.factura_info.factura_completa.cliente }}
                            </div>
                            <div>
                                <strong>RUC/CI:</strong> {{ dataFactura.factura_info.factura_completa.ci_ruc }}
                            </div>
                            <div>
                                <strong>Forma de Pago:</strong> {{ dataFactura.factura_info.factura_completa.forma_pago }}
                            </div>
                            <div class="col-span-3" v-if="dataFactura.factura_info.factura_completa.claveacceso">
                                <strong>Clave Acceso:</strong>
                                <code class="bg-gray-100 p-1 rounded text-xs">{{ dataFactura.factura_info.factura_completa.claveacceso }}</code>
                            </div>
                        </div>

                        <!-- Detalles de la Factura (tabla de productos - colapsable) -->
                        <div v-if="dataFactura.factura_info.factura_completa.facturasd && dataFactura.factura_info.factura_completa.facturasd.detalles && dataFactura.factura_info.factura_completa.facturasd.detalles.length > 0" class="mt-4">
                            <vs-collapse accordion>
                                <vs-collapse-item>
                                    <div slot="header" class="flex items-center gap-2">
                                        <i class="fa-solid fa-list"></i>
                                        <strong>Detalles de la Factura ({{ dataFactura.factura_info.factura_completa.facturasd.detalles.length }} productos)</strong>
                                    </div>
                                    <div class="overflow-auto" style="max-height: 400px;">
                                        <table class="w-full border">
                                            <thead class="bg-gray-200 sticky top-0">
                                                <tr>
                                                    <th class="p-2 border text-left">Código</th>
                                                    <th class="p-2 border text-left">Producto</th>
                                                    <th class="p-2 border text-center">Cantidad</th>
                                                    <th class="p-2 border text-right">Precio</th>
                                                    <th class="p-2 border text-right">Descuento</th>
                                                    <th class="p-2 border text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(detalle, index) in dataFactura.factura_info.factura_completa.facturasd.detalles" :key="index">
                                                    <td class="p-2 border">{{ detalle.productocodigo }}</td>
                                                    <td class="p-2 border">{{ detalle.nombreproducto }}</td>
                                                    <td class="p-2 border text-center">{{ detalle.cantidad }}</td>
                                                    <td class="p-2 border text-right">${{ Number(detalle.precio || 0).toFixed(2) }}</td>
                                                    <td class="p-2 border text-right">{{ detalle.descuento }}%</td>
                                                    <td class="p-2 border text-right font-bold">
                                                        ${{ ((detalle.cantidad * detalle.precio) - ((detalle.cantidad * detalle.precio * detalle.descuento) / 100)).toFixed(2) }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </vs-collapse-item>
                            </vs-collapse>
                        </div>
                    </vx-card>

                    <!-- Banner: No se encontró coincidencia en factura -->
                    <vx-card v-else-if="dataFactura && !dataFactura.factura_encontrada" class="mb-4">
                        <div class="p-3 bg-yellow-100 border border-yellow-300 rounded">
                            <i class="fa-solid fa-exclamation-triangle text-warning"></i>
                            <strong class="text-warning ml-2">No se encontró una factura que coincida</strong>
                            <p class="text-sm mt-2">{{ dataFactura.message || 'El pedido está facturado pero no se encontró una factura con los mismos productos y cantidades.' }}</p>
                        </div>

                        <!-- Mostrar facturas disponibles para vinculación manual (solo root y bodega) -->
                        <div v-if="(userRoot || AdminBodega || groupBodega) && dataFactura.facturas_disponibles && dataFactura.facturas_disponibles.facturas && dataFactura.facturas_disponibles.facturas.length > 0" class="mt-4">
                            <h5 class="mb-3">
                                <i class="fa-solid fa-list"></i> Facturas disponibles para vinculación manual
                            </h5>
                            <p class="text-sm text-gray-600 mb-3">
                                Seleccione una factura de la lista para vincularla manualmente con este pedido:
                            </p>

                            <div class="mb-4">
                                <vs-input
                                    icon="search"
                                    placeholder="Buscar por número, cliente, monto o fecha..."
                                    v-model="busquedaFacturaManual"
                                    class="w-full"
                                />
                            </div>

                            <div class="facturas-disponibles-lista">
                                <div
                                    v-for="(factura, index) in facturasDisponiblesFiltradas"
                                    :key="'factura-' + index"
                                    :class="['factura-disponible-card', facturaSeleccionadaManual && facturaSeleccionadaManual.facturasid === factura.facturasid ? 'factura-disponible-card-seleccionada' : '']"
                                    @click="seleccionarFacturaManual(factura)"
                                >
                                    <div class="factura-disponible-header">
                                        <div class="factura-disponible-numero">
                                            <i class="fa-solid fa-file-invoice"></i>
                                            {{ factura.establecimiento }}-{{ factura.puntoemision }}-{{ factura.secuencial }}
                                        </div>
                                        <div class="flex gap-1">
                                            <vs-chip :color="factura.clientesid === dataFactura.pedido_info.clientesid ? 'success' : 'warning'" size="small">
                                                {{ factura.clientesid === dataFactura.pedido_info.clientesid ? 'Cliente coincide' : 'Cliente diferente' }}
                                            </vs-chip>
                                            <vs-chip :color="resumenItemsFactura(factura).coincide ? 'success' : 'warning'" size="small">
                                                {{ resumenItemsFactura(factura).coincide ? 'Ítems coinciden' : 'Ítems diferentes' }}
                                            </vs-chip>
                                        </div>
                                    </div>
                                    <div class="factura-disponible-info">
                                        <div class="factura-disponible-info-item">
                                            <strong>Cliente:</strong> {{ factura.razonsocial || factura.cliente }}
                                        </div>
                                        <div class="factura-disponible-info-item">
                                            <strong>Emisión:</strong> {{ formatearFecha(factura.emision) }}
                                        </div>
                                        <div class="factura-disponible-info-item">
                                            <strong>Total:</strong> ${{ Number(factura.total || 0).toFixed(2) }}
                                        </div>
                                        <div class="factura-disponible-info-item">
                                            <strong>Productos:</strong> {{ resumenItemsFactura(factura).texto }}
                                        </div>
                                    </div>
                                    <div v-if="facturaSeleccionadaManual && facturaSeleccionadaManual.facturasid === factura.facturasid" class="factura-disponible-check">
                                        <i class="fa-solid fa-check-circle"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end gap-2 mt-4">
                                <vs-button
                                    color="success"
                                    type="filled"
                                    :disabled="!facturaSeleccionadaManual"
                                    @click="vincularFacturaManual"
                                >
                                    <i class="fa-solid fa-link"></i> Vincular factura seleccionada
                                </vs-button>
                            </div>
                        </div>
                    </vx-card>

                    <!-- JSON Pedido (solo visible para admin: id_group = 1) -->
                    <vx-card v-if="dataPerseo.data && usuario.id_group == 1" class="mb-4">
                        <div class="flex justify-between items-center mb-3">
                            <h4><i class="fa-solid fa-code"></i> Datos del Pedido (JSON)</h4>
                            <vs-button
                                size="small"
                                :icon="mostrarJSON ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                @click="mostrarJSON = !mostrarJSON"
                                type="border"
                            >
                                {{ mostrarJSON ? 'Ocultar' : 'Mostrar' }}
                            </vs-button>
                        </div>
                        <div v-show="mostrarJSON">
                            <pre class="bg-gray-100 p-4 rounded overflow-auto" style="max-height: 400px;">{{ JSON.stringify(dataPerseo.data, null, 2) }}</pre>
                        </div>
                    </vx-card>

                    <!-- JSON Factura (solo visible para admin: id_group = 1) -->
                    <vx-card v-if="dataFactura && (dataFactura.factura_encontrada || dataFactura.facturas_completo) && usuario.id_group == 1" class="mb-4">
                        <div class="flex justify-between items-center mb-3">
                            <h4><i class="fa-solid fa-code"></i> Datos de la Factura (JSON)</h4>
                            <vs-button
                                size="small"
                                :icon="mostrarJSONFactura ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                @click="mostrarJSONFactura = !mostrarJSONFactura"
                                type="border"
                            >
                                {{ mostrarJSONFactura ? 'Ocultar' : 'Mostrar' }}
                            </vs-button>
                        </div>
                        <div v-show="mostrarJSONFactura">
                            <pre class="bg-gray-100 p-4 rounded overflow-auto" style="max-height: 400px;">{{ JSON.stringify(dataFactura, null, 2) }}</pre>
                        </div>
                    </vx-card>
                </div>

                <!-- Mensaje cuando no hay datos -->
                <div v-else class="text-center p-4">
                    <i class="fa-solid fa-exclamation-triangle text-warning" style="font-size: 48px;"></i>
                    <p class="mt-3">No hay datos para mostrar</p>
                </div>
            </div>
        </vs-popup>
        <!--MODAL PARA VERIFICACIÓN MASIVA EN PERSEO (solo root)-->
        <vs-popup fullscreen title="Verificación masiva en Perseo" :active.sync="popupVerificarMasivo" class="popopPadre">
            <div v-if="popupVerificarMasivo" class="masivo-wrapper">

                <!-- CONFIGURACIÓN DEL PROCESO -->
                <vx-card class="mb-4">
                    <div class="masivo-config">
                        <div class="masivo-config-item">
                            <label class="masivo-label">Documentos por lote</label>
                            <v-select v-model="masivoTamanoLote" :disabled="masivoProcesando" class="w-full" :clearable="false"
                                      :options="opcionesLoteMasivo" :reduce="item => item.value" label="text" />
                        </div>
                        <div class="masivo-config-item">
                            <label class="masivo-label">Rango de facturas a consultar</label>
                            <v-select v-model="masivoDias" :disabled="masivoProcesando" class="w-full" :clearable="false"
                                      :options="opcionesDiasMasivo" :reduce="item => item.value" label="text" />
                        </div>
                        <div class="masivo-config-item">
                            <label class="masivo-label">Antigüedad mínima del pedido</label>
                            <v-select v-model="masivoDiasMinimos" :disabled="masivoProcesando || masivoCargando" class="w-full" :clearable="false"
                                      :options="opcionesDiasMinimosMasivo" :reduce="item => item.value" label="text" />
                        </div>
                        <div class="masivo-config-item masivo-config-accion">
                            <vs-button
                                color="primary"
                                type="border"
                                :disabled="masivoProcesando || masivoCargando"
                                @click="cargarPendientesMasivo()"
                            >
                                <i class="fa-solid fa-rotate mr-1"></i>
                                {{ masivoCargando ? 'Cargando...' : 'Cargar pendientes' }}
                            </vs-button>
                        </div>
                    </div>

                    <div class="masivo-ayuda">
                        <i class="fa-solid fa-circle-info mr-1"></i>
                        El sistema consulta <b>una sola vez</b> el listado de facturas de Perseo por empresa y lo reutiliza
                        para todo el lote; por cada documento solo se consulta su pedido. Puede pausar o detener el proceso en
                        cualquier momento entre lotes.
                    </div>
                </vx-card>

                <!-- RESUMEN Y PROGRESO -->
                <vx-card class="mb-4" v-if="masivoDocumentos.length > 0">
                    <div class="masivo-resumen">
                        <div class="masivo-contadores">
                            <vs-chip color="primary" class="font-semibold">
                                Seleccionados: {{ masivoSeleccionados.length }}
                            </vs-chip>
                            <vs-chip color="success" class="font-semibold">
                                Ancladas: {{ masivoResumen.vinculadas }}
                            </vs-chip>
                            <vs-chip color="dark" class="font-semibold">
                                Ya ancladas: {{ masivoResumen.ya_vinculadas }}
                            </vs-chip>
                            <vs-chip color="warning" class="font-semibold">
                                Sin facturar: {{ masivoResumen.no_facturado }}
                            </vs-chip>
                            <vs-chip color="warning" class="font-semibold">
                                Sin coincidencia: {{ masivoResumen.sin_coincidencia }}
                            </vs-chip>
                            <vs-chip color="danger" class="font-semibold">
                                Errores: {{ masivoResumen.error }}
                            </vs-chip>
                        </div>

                        <div class="masivo-botonera">
                            <vs-button
                                color="success"
                                type="filled"
                                :disabled="masivoProcesando || masivoSeleccionados.length === 0"
                                @click="confirmarVerificacionMasiva()"
                            >
                                <i class="fa-solid fa-bolt mr-1"></i>
                                {{ masivoPrecalentando ? 'Precalentando caché...' : 'Iniciar verificación' }}
                            </vs-button>
                            <vs-button
                                v-if="masivoProcesando && !masivoPausado"
                                color="warning"
                                type="border"
                                @click="masivoPausado = true"
                            >
                                <i class="fa-solid fa-pause mr-1"></i> Pausar
                            </vs-button>
                            <vs-button
                                v-if="masivoProcesando && masivoPausado"
                                color="primary"
                                type="border"
                                @click="masivoPausado = false"
                            >
                                <i class="fa-solid fa-play mr-1"></i> Reanudar
                            </vs-button>
                            <vs-button
                                v-if="masivoProcesando"
                                color="danger"
                                type="border"
                                @click="masivoCancelar = true; masivoPausado = false"
                            >
                                <i class="fa-solid fa-stop mr-1"></i> Detener
                            </vs-button>
                        </div>
                    </div>

                    <div class="masivo-progreso" v-if="masivoProcesando || masivoProcesados > 0">
                        <div class="masivo-progreso-texto">
                            Procesados <b>{{ masivoProcesados }}</b> de <b>{{ masivoTotalProceso }}</b>
                            <span v-if="masivoPausado" class="masivo-pausa"> — proceso en pausa</span>
                            <span v-else-if="masivoProcesando"> — lote {{ masivoLoteActual }} de {{ masivoTotalLotes }}</span>
                        </div>
                        <vs-progress :percent="masivoPorcentaje" :color="masivoProcesando ? 'primary' : 'success'"></vs-progress>
                    </div>
                </vx-card>

                <!-- LISTADO DE DOCUMENTOS -->
                <vx-card v-if="masivoDocumentos.length > 0">
                    <div class="masivo-tabla-cabecera">
                        <div class="flex items-center">
                            <vs-checkbox
                                v-model="masivoTodos"
                                :disabled="masivoProcesando"
                            >
                                Seleccionar todos ({{ masivoDocumentos.length }})
                            </vs-checkbox>
                        </div>
                        <div class="masivo-filtro-resultado">
                            <vs-select v-model="masivoFiltroResultado" class="w-full">
                                <vs-select-item value="todos" text="Todos los resultados" />
                                <vs-select-item value="pendiente" text="Sin procesar" />
                                <vs-select-item value="vinculada" text="Ancladas" />
                                <vs-select-item value="no_facturado" text="Sin facturar en Perseo" />
                                <vs-select-item value="sin_coincidencia" text="Sin coincidencia" />
                                <vs-select-item value="error" text="Con error" />
                            </vs-select>
                        </div>
                    </div>

                    <vs-table :data="masivoDocumentosFiltrados" pagination :max-items="masivoDocumentosFiltrados.length" search
                              no-data-text="No hay documentos pendientes con los filtros seleccionados">
                        <template slot="thead">
                            <vs-th></vs-th>
                            <vs-th sort-key="ven_codigo">Documento</vs-th>
                            <vs-th sort-key="empresa">Empresa</vs-th>
                            <vs-th sort-key="cliente_nombre">Cliente / Institución</vs-th>
                            <vs-th sort-key="fecha_envio_perseo">Envío a Perseo</vs-th>
                            <vs-th sort-key="dias_pendiente">Días</vs-th>
                            <vs-th>Resultado</vs-th>
                        </template>

                        <template slot-scope="{ data }">
                            <vs-tr v-for="(row, i) in data" :key="row.ven_codigo + '-' + i">
                                <vs-td>
                                    <vs-checkbox v-model="row._sel" :disabled="masivoProcesando" />
                                </vs-td>
                                <vs-td :data="row.ven_codigo">
                                    <b>{{ row.ven_codigo }}</b>
                                    <div class="masivo-subtexto">{{ row.pedido_codigo }}</div>
                                </vs-td>
                                <vs-td :data="row.empresa">{{ row.empresa }}</vs-td>
                                <vs-td :data="row.cliente_nombre">
                                    {{ row.cliente_nombre }}
                                    <div class="masivo-subtexto">{{ row.institucion_nombre }}</div>
                                </vs-td>
                                <vs-td :data="row.fecha_envio_perseo">{{ row.fecha_envio_perseo }}</vs-td>
                                <vs-td :data="row.dias_pendiente">
                                    <vs-chip :color="row.dias_pendiente > 15 ? 'danger' : (row.dias_pendiente > 5 ? 'warning' : 'primary')">
                                        {{ row.dias_pendiente }}
                                    </vs-chip>
                                </vs-td>
                                <vs-td>
                                    <div v-if="row._resultado">
                                        <vs-chip :color="colorResultadoMasivo(row._resultado)" class="font-semibold">
                                            {{ textoResultadoMasivo(row._resultado) }}
                                        </vs-chip>
                                        <div class="masivo-subtexto">
                                            <b v-if="row._factura">{{ row._factura }}</b>
                                            <span v-else>{{ row._mensaje }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="masivo-subtexto">Sin procesar</span>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vx-card>

                <!-- SIN DOCUMENTOS -->
                <vx-card v-else-if="!masivoCargando">
                    <div class="text-center p-6">
                        <i class="fa-solid fa-circle-check text-success" style="font-size: 48px;"></i>
                        <p class="mt-3">No hay documentos pendientes de anclar con los criterios seleccionados.</p>
                    </div>
                </vx-card>
            </div>
        </vs-popup>
        <!--popup EMPACAR-->
        <vs-popup title="Empacar Información" :active.sync="popupEmpacar" fullscreen class="popup-empacar-padre">
            <div v-if="popupEmpacar">
              <perseo_despacho_empacarVue
                :ObjectedSelected="ObjectedSelected"
                :soloVer="ObjectedSelected.proceso_empacar == 2"
                @guardado="popupEmpacar=false; cargarVentasPerseo()"
                @emit_despachar="confirmarDespachadoPerseo"
              />
            </div>
        </vs-popup>
        <!--popup EMPACAR-->
        <!-- componente listar codigos despachdos en bodega -->
        <vs-popup
            title="Detalles documento de venta"
            :active.sync="popupDespachados"
            fullscreen
            @close="cerrarPopup"
            >
            <div v-if="cantidadDespachados && documentoActual">
                <cantidad-codigos-despachados
                :documento-venta="documentoActual"
                @datos-cargados="manejarDatosCargados"
                @error="manejarError"
                @close="cerrarPopup"
                />
            </div>

            <!-- ⭐ SECCIÓN NUEVA: Limpiar Items Despachados -->
            <div v-if="modoLimpiarPendiente" class="seccion-limpiar-pendiente">
                <div class="header-limpiar">
                    <h3 class="titulo-limpiar">
                        <i class="fa-solid fa-broom mr-2"></i>
                        Limpiar Items Despachados
                    </h3>
                    <p class="descripcion-limpiar">
                        Selecciona los items que deseas quitar del despacho antes de cambiar a Pendiente.
                        Si no seleccionas ninguno, solo se cambiará el estado.
                    </p>
                </div>

                <div class="checkbox-todos mb-3">
                    <vs-checkbox
                        v-model="seleccionarTodosLimpiar"
                        @change="toggleSeleccionTodosLimpiar"
                    >
                        Seleccionar todos los items despachados
                    </vs-checkbox>
                </div>

                <div class="tabla-items-limpiar">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th style="width: 50px;">
                                    <i class="fa-solid fa-check-square"></i>
                                </th>
                                <th>Código</th>
                                <th>Libro</th>
                                <th class="text-center">Despachado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in itemsParaLimpiar"
                                :key="'limpiar-' + item.pro_codigo"
                                :class="{'fila-deshabilitada': item.det_ven_cantidad_despacho === 0}"
                            >
                                <td>
                                    <vs-checkbox
                                        v-model="item.seleccionado"
                                        :disabled="item.det_ven_cantidad_despacho === 0"
                                    />
                                </td>
                                <td>
                                    <span class="codigo-producto">{{ item.pro_codigo }}</span>
                                </td>
                                <td>
                                    <span class="nombre-producto">{{ item.nombre_libro }}</span>
                                </td>
                                <td class="text-center">
                                    <vs-chip
                                        :color="item.det_ven_cantidad_despacho > 0 ? 'success' : 'dark'"
                                        size="small"
                                    >
                                        {{ item.det_ven_cantidad_despacho }}
                                    </vs-chip>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="itemsSeleccionadosLimpiar.length > 0" class="alerta-seleccion">
                    <vs-alert color="warning">
                        <template #icon>
                            <i class="fa-solid fa-exclamation-triangle"></i>
                        </template>
                        <strong>{{ itemsSeleccionadosLimpiar.length }}</strong> item(s) seleccionado(s) para limpiar
                    </vs-alert>
                </div>

                <div class="botones-accion">
                    <vs-button color="dark" type="flat" @click="cancelarModoLimpiar">
                        Cancelar
                    </vs-button>
                    <vs-button color="warning" type="filled" @click="confirmarCambioAPendienteConLimpieza">
                        <i class="fa-solid fa-arrow-left mr-2"></i>
                        {{ itemsSeleccionadosLimpiar.length > 0 ? 'Limpiar y Cambiar a Pendiente' : 'Solo Cambiar a Pendiente' }}
                    </vs-button>
                </div>
            </div>
        </vs-popup>
        <!-- FIN componente listar codigos despachdos en bodega -->
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Generalmix from "../../../../../mixins/Generalmix";
import imprimirMixin from "@/mixins/Pedidosmix";
const EmpacarCrearVue       = () => import('@/views/home/bodega/components/Empacar/EmpacarCrear.vue');
const RegresarAPendiente    = () => import("@/views/bodega/codigos/components/Regresar_A_Pendiente.vue");
const EmpacarEditVue        = () => import('@/views/home/bodega/components/Empacar/Empacaredit.vue');
const EmpacadoIngresoGuiaVue = () => import("./EmpacadoIngresoGuia.vue");
const exportDespachoCALMEDVue = () => import('@/views/facturacion/10_10_1_4/bodegas/Reportes/exportDespachoCALMED');
const PerseoTablaAvanzada = () => import('@/views/perseo/components/perseo_tabla_avanzada.vue');
const ReporteVentasPDF = () => import('@/views/pedidos/facturacion/imprimir/ReporteVentasPDF.vue');
const perseo_despacho_empacarVue = () => import('./perseo_despachos_empacar.vue')
const cantidadCodigosDespachados = () => import('@/views/bodega/buscarDocumento/index.vue')

export default {
    mixins: [Generalmix,imprimirMixin],
    components: {
        "v-select": vSelect,
        EmpacarCrearVue,
        RegresarAPendiente,
        EmpacarEditVue,
        EmpacadoIngresoGuiaVue,
        exportDespachoCALMEDVue,
        PerseoTablaAvanzada,
        ReporteVentasPDF,
        perseo_despacho_empacarVue,
        cantidadCodigosDespachados
    },
    data() {
        return {
            usuario:[],
            Ventas: [],
            ventasFiltradas: [],
            DetalleVenta: [],
            userVentas: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabVentas: {
                ven_codigo: "",
                bod_responsable: "",
                bod_nombre: "",
                bod_ubicacion: "",
                bod_estado: "",
                created_at: "",
                opcion: '',
            },
            ven_codigo: 0,
            valorBusqueda: "0",
            Bodega_inactivos: [],
            busquedaxcodigo: "",
            checkBox_mostrarinactivos: false,
            contadorpendientes: 0,
            menu: 0,
            datos: [],
            ObjectedSelected:'',
            popupRegresarAPendiente:false,
            popupAbrirEmpacadoEditar:false,
            ObjectedDocument:'',
            contadorExcluidos:0,
            // Menú flotante
            selectedRow: null,
            menuPos: { top: 0, left: 0 },
            months: [
                { name: 'Enero', value: 1 },
                { name: 'Febrero', value: 2 },
                { name: 'Marzo', value: 3 },
                { name: 'Abril', value: 4 },
                { name: 'Mayo', value: 5 },
                { name: 'Junio', value: 6 },
                { name: 'Julio', value: 7 },
                { name: 'Agosto', value: 8 },
                { name: 'Septiembre', value: 9 },
                { name: 'Octubre', value: 10 },
                { name: 'Noviembre', value: 11 },
                { name: 'Diciembre', value: 12 }
            ],
            years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
            yearSelect: new Date().getFullYear(),
            mesSelect: new Date().getMonth() + 1,
            popupAbrirIngresarGuia:false,
            popupReporteDespachoCALMED:false,
            onlyVisualizar:0,
            conguia: false,
            sinFecha:true,
            fechaDesde: '',
            fechaHasta: '',
            filtroEstado: '2',
            filtroFechasActivo: false,
            soloEnviadoPerseo: 1,
            opcionesEstado: [
                { label: 'Todos', value: 'todos' },
                { label: 'Pendientes', value: '2' },
                { label: 'En proceso', value: '4' },
                { label: 'Despachadas', value: '1' },
                { label: 'Anuladas', value: '3' }
            ],
            resumenVentas: null,
            columnasTabla: [
                {
                    label: 'Código',
                    field: 'ven_codigo',
                    width: '250px',
                    sortable: true,
                    filtrable: true
                },
                {
                    label: 'Cliente Perseo',
                    field: 'ven_cliente',
                    sortable: true,
                    filtrable: true
                },
                {
                    label: 'Estado Venta',
                    field: 'estado_nombre',
                    width: '140px',
                    sortable: true,
                    filtrable: true
                },
                {
                    label: 'Factura Perseo',
                    field: 'factura_perseo',
                    width: '180px',
                    sortable: true,
                    filtrable: true
                }
            ],
            popupVerificarPerseo: false,
            dataPerseo: null,
            loadingPerseo: false,
            mostrarJSON: false,
            dataFactura: null,
            loadingFactura: false,
            mostrarJSONFactura: false,
            facturaVinculada: false,
            popupPDFVenta: false,
            ventaSeleccionadaPDF: null,
            id: '',
            opcion: 0,
            popupCambioEstado: false,
            ventaCambioEstado: null,
            estadoDestinoCambio: '',
            opcionesCambioEstado: [],
            facturaSeleccionadaManual: null,
            busquedaFacturaManual: '',
            popupEscaneos: false,
            ventaEscaneos: null,
            escaneosVentaDetalle: [],
            popupEmpacar: false,
            documentoActual: null,
            popupDespachados: false,
            cantidadDespachados: false,
            // Propiedades para limpiar items al cambiar a Pendiente
            modoLimpiarPendiente: false,
            itemsParaLimpiar: [],
            seleccionarTodosLimpiar: false,
            busquedaItemsLimpiar: '',
            mostrarSoloSeleccionados: false,
            // Contador de pendientes de Perseo
            contadorPendientesPerseo: 0,
            loadingContadorPerseo: false,
            // Estado del filtro activo
            filtroActivoPendientesPerseo: false,
            // ⭐ Verificación masiva en Perseo (root)
            popupVerificarMasivo: false,
            masivoDocumentos: [],
            masivoTamanoLote: 10,
            masivoDias: 100,
            masivoDiasMinimos: 1,
            opcionesLoteMasivo: [5, 10, 20, 30, 50].map(n => ({ value: n, text: n + ' por lote' })),
            opcionesDiasMasivo: [30, 60, 100, 180, 365].map(d => ({ value: d, text: 'Últimos ' + d + ' días' })),
            opcionesDiasMinimosMasivo: [0, 1, 3, 7, 15].map(d => ({ value: d, text: d === 0 ? 'Todos' : 'Más de ' + d + ' día(s)' })),
            masivoCargando: false,
            masivoPrecalentando: false,
            masivoProcesando: false,
            masivoPausado: false,
            masivoCancelar: false,
            masivoTodos: true,
            masivoFiltroResultado: 'todos',
            masivoProcesados: 0,
            masivoTotalProceso: 0,
            masivoLoteActual: 0,
            masivoResumen: {
                vinculadas: 0,
                ya_vinculadas: 0,
                no_facturado: 0,
                sin_coincidencia: 0,
                error: 0
            }
        };
    },
    mounted() {
        let me = this
        this.menu = 0;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.inicializarFechas();
        this.cargarVentasPerseo();
        this.cargarContadorPendientesPerseo(); // Cargar contador al iniciar
        // Event listeners para el menú flotante
        window.addEventListener('keydown', this.onKeydown);
        window.addEventListener('click', this.onClickFuera);
        window.addEventListener('scroll', this.onScroll, true);
        window.addEventListener('resize', this.cerrarMenu);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.onKeydown);
        window.removeEventListener('click', this.onClickFuera);
        window.removeEventListener('scroll', this.onScroll, true);
        window.removeEventListener('resize', this.cerrarMenu);
    },
    computed: {
            ...mapState(['userRoot','userFacturador','userAdminFacturador','AdminBodega','groupBodega']),
            // ⭐ Verificación masiva en Perseo
            masivoSeleccionados() {
                return this.masivoDocumentos.filter(doc => doc._sel);
            },
            masivoDocumentosFiltrados() {
                if (this.masivoFiltroResultado === 'todos') {
                    return this.masivoDocumentos;
                }
                if (this.masivoFiltroResultado === 'pendiente') {
                    return this.masivoDocumentos.filter(doc => !doc._procesado);
                }
                return this.masivoDocumentos.filter(doc => doc._resultado === this.masivoFiltroResultado);
            },
            masivoTotalLotes() {
                if (!this.masivoTotalProceso || !this.masivoTamanoLote) {
                    return 0;
                }
                return Math.ceil(this.masivoTotalProceso / this.masivoTamanoLote);
            },
            masivoPorcentaje() {
                if (!this.masivoTotalProceso) {
                    return 0;
                }
                return Math.round((this.masivoProcesados / this.masivoTotalProceso) * 100);
            },
            menuStyle() {
                return {
                    position: 'fixed',
                    top: this.menuPos.top + 'px',
                    left: this.menuPos.left + 'px',
                    zIndex: 99999,
                };
            },
            hayItemsConDespacho() {
                return this.itemsParaLimpiar.some(item => item.det_ven_cantidad_despacho > 0);
            },
            itemsSeleccionadosLimpiar() {
                return this.itemsParaLimpiar.filter(item => item.seleccionado === true);
            },
            itemsParaLimpiarFiltrados() {
                let items = this.itemsParaLimpiar;

                // Filtrar por búsqueda
                if (this.busquedaItemsLimpiar && this.busquedaItemsLimpiar.trim() !== '') {
                    const busqueda = this.busquedaItemsLimpiar.toLowerCase().trim();
                    items = items.filter(item => {
                        const codigo = (item.pro_codigo || '').toLowerCase();
                        const nombre = (item.nombre_libro || '').toLowerCase();
                        return codigo.includes(busqueda) || nombre.includes(busqueda);
                    });
                }

                // Filtrar solo seleccionados
                if (this.mostrarSoloSeleccionados) {
                    items = items.filter(item => item.seleccionado === true);
                }

                return items;
            },
            facturasDisponiblesFiltradas() {
                if (!this.dataFactura || !this.dataFactura.facturas_disponibles || !this.dataFactura.facturas_disponibles.facturas) {
                    return [];
                }

                let facturas = this.dataFactura.facturas_disponibles.facturas;
                const ventaActual = this.ObjectedSelected;

                if (ventaActual && ventaActual.id_factura_perseo) {
                    facturas = facturas.filter(f => f.facturasid != ventaActual.id_factura_perseo);
                }

                if (this.busquedaFacturaManual && this.busquedaFacturaManual.trim() !== '') {
                    const search = this.busquedaFacturaManual.toLowerCase().trim();
                    facturas = facturas.filter(f => {
                        const numFactura = `${f.establecimiento || ''}-${f.puntoemision || ''}-${f.secuencial || ''}`.toLowerCase();
                        const cliente = (f.razonsocial || f.cliente || '').toLowerCase();
                        const monto = Number(f.total || 0).toFixed(2);
                        const fecha = this.formatearFecha(f.emision).toLowerCase();
                        const fechaCruda = (f.emision || '').toLowerCase(); // as it might be YY-MM-DD string

                        return numFactura.includes(search) ||
                               cliente.includes(search) ||
                               monto.includes(search) ||
                               fecha.includes(search) ||
                               fechaCruda.includes(search);
                    });
                }

                return facturas;
            }
    },
    watch: {
        // ⭐ Seleccionar / deseleccionar todos los documentos de la verificación masiva
        masivoTodos(nuevoValor) {
            this.alternarSeleccionMasiva(nuevoValor);
        },
        popupVerificarPerseo(newVal, oldVal) {
            // Cuando el popup se cierra (de cualquier forma)
            if (oldVal === true && newVal === false) {
                // Si se vinculó una factura, recargar el listado
                if (this.facturaVinculada) {
                    this.$f_notificacion('Actualizando listado...', 'primary', 'icon-refresh-cw', 1000);
                    setTimeout(() => {
                        this.cargarVentasPerseo();
                    }, 500);
                }
            }
        }
    },
    methods: {
        // ── Métodos del menú flotante ──────────────────────────────────────────────
        toggleMenu(row, event) {
            if (this.selectedRow && this.selectedRow.ven_codigo === row.ven_codigo) {
                this.cerrarMenu();
                return;
            }
            const btn = event.currentTarget;
            const rect = btn.getBoundingClientRect();
            const menuW = 244;
            const menuH = 400; // altura máxima aproximada del menú
            const pad = 8;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Calcular posición horizontal
            let left = rect.right - menuW;
            if (left < pad) left = pad;
            if (left + menuW > vw - pad) left = vw - menuW - pad;

            // Calcular posición vertical (arriba o abajo del botón)
            let top;
            const spaceBelow = vh - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow >= menuH || spaceBelow >= spaceAbove) {
                // Hay espacio abajo o más espacio abajo que arriba
                top = rect.bottom + pad;
            } else {
                // Más espacio arriba, posicionar hacia arriba
                top = rect.top - menuH - pad;
                if (top < pad) top = pad; // No salir del viewport
            }

            this.menuPos = { top, left };
            this.selectedRow = row;
        },

        cerrarMenu() {
            this.selectedRow = null;
        },

        onKeydown(e) {
            if (e.key === 'Escape') this.cerrarMenu();
        },

        onClickFuera(e) {
            if (!e.target.closest('.menu-trigger-btn') && !e.target.closest('.menu-flotante')) {
                this.cerrarMenu();
            }
        },

        onScroll(e) {
            // Solo cerrar si el scroll NO es dentro del menú flotante
            if (!e.target.closest('.menu-flotante')) {
                this.cerrarMenu();
            }
        },

        irPanelAdministrativo() {
            this.$router.push('/panel-administrativo');
        },
        inicializarFechas() {
            const hoy = new Date();
            const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            this.fechaDesde = primerDiaMes.toISOString().split('T')[0];
            this.fechaHasta = hoy.toISOString().split('T')[0];
        },
        cargarVentasPerseo() {
            let me = this;
            me.$vs.loading();

            let params = [];
            
            // Si está activo el filtro de pendientes de Perseo, usarlo
            if (me.filtroActivoPendientesPerseo) {
                params.push('solo_pendientes_perseo=1');
            } else {
                // Filtros normales
                if (me.filtroEstado && me.filtroEstado !== 'todos') {
                    params.push('estado=' + me.filtroEstado);
                }
                if (me.filtroFechasActivo && me.fechaDesde) {
                    params.push('fecha_desde=' + me.fechaDesde);
                }
                if (me.filtroFechasActivo && me.fechaHasta) {
                    params.push('fecha_hasta=' + me.fechaHasta);
                }
                if(me.filtroEstado!=4){
                    params.push('solo_enviado_perseo=' + me.soloEnviadoPerseo);
                }
            }

            let url = 'api/perseo/ventas/por-despachar';
            if (params.length > 0) {
                url += '?' + params.join('&');
            }

            this.$http.get(this.$server_url + url)
                .then(res => {
                    if (res.data.status === 200) {
                        me.Ventas = res.data.data || [];
                        me.ventasFiltradas = [...me.Ventas];
                        me.resumenVentas = me.generarResumenLocal(me.Ventas, res.data.resumen);
                        me.$vs.loading.close();

                        if (me.Ventas.length === 0) {
                            me.$f_notificacion('No hay ventas para mostrar', 'warning', 'icon-alert-triangle');
                        } else {
                            me.$f_notificacion(`${me.Ventas.length} ventas cargadas correctamente`, 'success', 'icon-check');
                        }
                    } else {
                        me.$vs.loading.close();
                        me.$f_notificacion('Error al cargar ventas', 'danger', 'icon-x');
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    me.$f_notificacion('Error al conectar con el servidor', 'danger', 'icon-x');
                });
        },
        generarResumenLocal(ventas, resumenBackend) {
            let base = {
                total: 0,
                pendientes: 0,
                en_proceso: 0,
                despachadas: 0,
                anuladas: 0
            };

            if (resumenBackend) {
                base.total = resumenBackend.total ? parseInt(resumenBackend.total, 10) : 0;
                base.pendientes = resumenBackend.pendientes ? parseInt(resumenBackend.pendientes, 10) : 0;
                base.despachadas = resumenBackend.despachadas ? parseInt(resumenBackend.despachadas, 10) : 0;
                base.anuladas = resumenBackend.anuladas ? parseInt(resumenBackend.anuladas, 10) : 0;
            }

            let enProcesoCalculado = 0;
            let totalCalculado = 0;
            if (ventas && Array.isArray(ventas)) {
                totalCalculado = ventas.length;
                enProcesoCalculado = ventas.filter(function(v) {
                    return parseInt(v.est_ven_codigo, 10) === 4;
                }).length;
            }

            base.en_proceso = enProcesoCalculado;
            if (!base.total || base.total < totalCalculado) {
                base.total = totalCalculado;
            }

            return base;
        },
        getColorEstadoVenta(estado) {
            if (parseInt(estado, 10) === 1) return 'success';
            if (parseInt(estado, 10) === 2) return 'warning';
            if (parseInt(estado, 10) === 4) return 'primary';
            if (parseInt(estado, 10) === 3) return 'danger';
            return 'dark';
        },
        getTextoEstadoVenta(row) {
            if (row && parseInt(row.est_ven_codigo, 10) === 4) {
                return 'En proceso';
            }
            if (row && row.estado_nombre) {
                return row.estado_nombre;
            }
            return 'Desconocido';
        },
        filtrarPorFecha() {
            let me = this;
            if (!me.fechaDesde || !me.fechaHasta) {
                me.$f_notificacion('Debe seleccionar ambas fechas', 'warning', 'icon-alert-triangle');
                return;
            }
            const desde = new Date(me.fechaDesde);
            const hasta = new Date(me.fechaHasta);
            if (desde > hasta) {
                me.$f_notificacion('La fecha desde no puede ser mayor a la fecha hasta', 'warning', 'icon-alert-triangle');
                return;
            }
            // Consulta al backend con las fechas
            me.cargarVentasPerseo();
        },
        limpiarFiltroFechas() {
            this.filtroFechasActivo = false;
            this.fechaDesde = '';
            this.fechaHasta = '';
            // Recarga sin filtro de fechas
            this.cargarVentasPerseo();
            this.$f_notificacion('Filtro de fechas eliminado', 'primary', 'icon-check');
        },
        limpiarFiltros() {
            this.inicializarFechas();
            this.ventasFiltradas = [...this.Ventas];
            this.$f_notificacion('Filtros limpiados', 'primary', 'icon-check');
        },
        verPDFVenta(venta) {
            this.ventaSeleccionadaPDF = venta;
            this.popupPDFVenta = true;

            // if (this.AdminBodega || this.groupBodega) {
            //     if (!venta.impresion || venta.impresion == 0) {
            //         this.marcarComoImpreso(venta);
            //     }
            // }
        },
        marcarComoImpreso(venta) {
            let me = this;

            const datos = {
                ven_codigo: venta.ven_codigo,
                empresa: venta.id_empresa,
                usuario_id: me.usuario.idusuario
            };

            this.$http.post(this.$server_url + 'api/perseo/ventas/marcar-impreso', datos)
                .then(res => {
                    if (res.data.status === 200) {
                        const index = me.ventasFiltradas.findIndex(v => v.ven_codigo === venta.ven_codigo);
                        if (index !== -1) {
                            me.$set(me.ventasFiltradas[index], 'impresion', 1);
                            me.$set(me.ventasFiltradas[index], 'fecha_impreso_bodega', res.data.data.fecha_impreso_bodega);
                        }
                    }
                })
                .catch(err => {
                    console.error('Error al marcar como impreso:', err);
                });
        },
        changePendiente(e){
            let me = this
            if (e.verificacionemitsaveandedit == 1) {
                me.popupRegresarAPendiente = false;
                this.verificarseleccion();
            } else if (e.verificacionemitsaveandedit == 2) {
                me.popupRegresarAPendiente = false;
            } else {
            }
        },
        change(e) {
            this.popupAbrirEmpacadoEditar = false;
            if (e == true) {
                this.cargarVentasPerseo();
            }
        },
        changen(e) {
            if (e == true) {
                this.menu = 0;
                this.verificarseleccion();
            }
        },
        verificarseleccion() {
            let me = this;
            this.Ventas = [];
            this.popupRegresarAPendiente = false;
            this.contadorExcluidos = 0;
            this.Ventas = [];
            if(!this.sinFecha){
              //validacion mes
              if(me.mesSelect == "" || me.mesSelect == "" || me.mesSelect == undefined){
                  me.m_message("Debe seleccionar un mes","warning","icon-alert-triangle")
                  return
              }
              //validacion mes
              if(me.mesSelect < 1 || me.mesSelect > 12){
                  me.m_message("Ingrese un mes valido","warning","icon-alert-triangle")
                  return
              }
              //validacion año
              if(me.yearSelect < 1900 || me.yearSelect > new Date().getFullYear()){
                  me.m_message("Ingrese un año valido","warning","icon-alert-triangle")
                  return
              }
              //validacion año
              if(me.yearSelect == "" || me.yearSelect == "" || me.yearSelect == undefined){
                  me.m_message("Debe seleccionar un año","warning","icon-alert-triangle")
                  return
              }
            }

                //pendientes
            if (this.valorBusqueda === '0') {
                this.getVentasPendientes(0);
                //excluidos
            } else if (this.valorBusqueda === '1') {
                this.getVentasPendientes(1);
            } else if (this.valorBusqueda === '2') {
                this.getVentasPendientes(2);
            } else if (this.valorBusqueda === '3') {
                this.getVentasPendientes(3);
            }
            //despachados
            else if (this.valorBusqueda === '4') {
                this.getVentasPendientes(4);
            }
            //excluidos contador
            this.getContadorExcluidos()
        },
        getContadorExcluidos(){
            let me = this;
            this.contadorExcluidos = 0;
            this.$http.get(this.$server_url + `GetVentasPendientes?op=1&contarArray=1&anio=${me.yearSelect}&mes=${me.mesSelect}`)
            .then(res => {
                this.contadorExcluidos = res.data;
            })
            .catch(err => {
                console.log(err)
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'No se pudo obtener el contador de excluidos',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getVentasPendientes(op) {
            let me = this;
            this.contadorpendientes = 1;
            this.busquedaxcodigo    = '';
            let url = ''
            if(me.sinFecha == false){
              url = `GetVentasPendientes?op=${op}&anio=${me.yearSelect}&mes=${me.mesSelect}`
            }
            if(me.sinFecha){
              url = `GetVentasPendientes?op=${op}&sinfecha=1`
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + url)
                .then(res => {
                    this.Ventas = res.data;
                    me.$vs.loading.close()
                    if (me.Ventas.length == 0) {
                        me.$vs.notify({
                            text: 'No hay ventas pendientes por despachar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'No se pudo obtener los documentos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getVentaDespachadasxParametro() {
            let me = this;
            if (me.busquedaxcodigo.length < 2) {
                me.$vs.notify({
                    text: "Minimo 2 caracteres de busqueda",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return false;
            }
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetVentasDespachadasxParametro?opcion=0&parte_documento=" + me.busquedaxcodigo)
                .then(function (res) {
                    me.Ventas = res.data;
                    if (me.Ventas.length === 0) {
                        me.$vs.notify({
                            text: "No hay Ventas para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ventas = [];
                        me.getUserBodega();
                        me.$vs.loading.close();
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: "No hay Ventas para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ventas = [];
                        me.$vs.loading.close();
                    } else {
                        console.log(error + " error");
                        me.$vs.loading.close();
                    }
                });
        },
        //METODOS PARA EL EMPACADO
        openConfirmAnularEmpacado() {
            let me = this;
            let datoEmpacado = me.ObjectedSelected.empacado
            if(datoEmpacado.length == 0){
                me.m_message("No hay documentos empacados","warning","icon-alert-triangle")
                return
            }
            console.log("datoEmpacado",me.ObjectedSelected)
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Anular Empaque`,
                text: '¿Está seguro de anular el empaque #' + datoEmpacado[0].remi_codigo + '?'+' Al hacerlo se regresara a pendientes de despacho',
                accept: this.f_anularEmpacado,
                acceptText: 'Si, deseo anular el empacado',
                cancelText: 'Cancelar',
            })
        },
        f_anularEmpacado() {
            let me = this;
            let datoEmpacado                    = me.ObjectedSelected.empacado
            let formData = new FormData();
            formData.append('id',               datoEmpacado[0].id_remision);
            formData.append('remi_idempresa',   me.ObjectedSelected.id_empresa);
            formData.append('anulaEmpaque',     '1');
            formData.append('factura',          me.ObjectedSelected.ven_codigo);
            formData.append('user_created',     me.usuario.idusuario);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'empaqueBodega', formData)
            .then(res => {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                    return
                }
                me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                this.verificarseleccion();
            })
            .catch(e => {
                console.log("error",e)
                me.$vs.loading.close();
                me.$vs.notify({
                    text: 'No se pudo anular el empaque',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            });
        },
        changeGuia(e){
            let me = this
            if(e == false){
                me.popupAbrirIngresarGuia = false
            }else{
                me.popupAbrirIngresarGuia = false
                //ejecutar despues de 1 segundo
                setTimeout(function(){
                    me.verificarseleccion();
                },1000)
            }
        },
        realizarReporteHojaDiaria(){
            let me = this;
            this.$http.get(this.$server_url+`GetRemisionCALMED_FECHA?op=1&individual=${this.ObjectedSelected.ven_codigo}`)
            .then(function (res) {
               if(res.data.length == 0){
                   me.m_message("No se encontraron empaques pendientes excluidos para este documento","warning","icon-alert-triangle")
                   return
               }
               me.ObjectedDocument = res.data
               me.popupReporteDespachoCALMED = true;
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        verificarPedidoPerseo(venta) {
            let me = this;

            if (!venta.estadoPerseo || venta.estadoPerseo != 1) {
                me.$f_notificacion('Esta venta no ha sido enviada a Perseo', 'warning', 'icon-alert-triangle');
                return;
            }

            me.popupVerificarPerseo = true;
            me.loadingPerseo = true;
            me.dataPerseo = null;
            me.dataFactura = null;
            me.busquedaFacturaManual = '';
            me.mostrarJSON = false;
            me.mostrarJSONFactura = false;
            me.facturaVinculada = false;
            me.facturaSeleccionadaManual = null;

            let datos = {
                ven_codigo: venta.ven_codigo,
                empresa: venta.id_empresa
            };

            this.$http.post(this.$server_url + 'api/perseo/ventas/pedidos-consulta', datos)
                .then(res => {
                    me.loadingPerseo = false;

                    if (res.data.status === 200) {
                        me.dataPerseo = res.data;
                        me.$f_notificacion('Pedido consultado exitosamente', 'success', 'icon-check', 2000);

                        if (res.data.data && res.data.data.pedidos && res.data.data.pedidos.length > 0) {
                            const pedido = res.data.data.pedidos[0];
                            if (pedido.estado == 3) {
                                me.verificarFactura(venta);
                            }
                        }
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al consultar pedido', 'danger', 'icon-x');
                        me.popupVerificarPerseo = false;
                    }
                })
                .catch(err => {
                    me.loadingPerseo = false;

                    let mensaje = 'Error al conectar con Perseo';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }

                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                    me.popupVerificarPerseo = false;
                });
        },
        verificarFactura(venta) {
            let me = this;

            me.loadingFactura = true;

            let datos = {
                ven_codigo: venta.ven_codigo,
                empresa: venta.id_empresa
            };

            // Segunda llamada: verificar y enlazar factura (más lenta)
            this.$http.post(this.$server_url + 'api/perseo/ventas/facturas-verificar', datos)
                .then(res => {
                    me.loadingFactura = false;

                    if (res.data.status === 200) {
                        me.dataFactura = res.data;

                        if (res.data.factura_encontrada) {
                            me.facturaVinculada = true;
                            me.$f_notificacion('Factura vinculada exitosamente', 'success', 'icon-check', 3000);

                            // Actualizar el registro en el listado
                            const index = me.ventasFiltradas.findIndex(v => v.ven_codigo === venta.ven_codigo);
                            if (index !== -1) {
                                me.$set(me.ventasFiltradas[index], 'factura_perseo', res.data.factura_info.factura_perseo);
                                me.$set(me.ventasFiltradas[index], 'id_factura_perseo', res.data.factura_info.id_factura_perseo);
                            }
                        } else {
                            me.$f_notificacion('No se encontró una factura que coincida con el pedido', 'warning', 'icon-alert-triangle', 4000);
                        }
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al verificar factura', 'warning', 'icon-alert-triangle');
                    }
                })
                .catch(err => {
                    me.loadingFactura = false;
                    console.error('Error al verificar factura:', err);

                    let mensaje = 'Error al verificar factura';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }

                    me.$f_notificacion(mensaje, 'warning', 'icon-alert-triangle');
                });
        },
        cerrarVerificacionPerseo() {
            let me = this;
            me.popupVerificarPerseo = false;
            me.busquedaFacturaManual = '';

            // Si se vinculó una factura, recargar el listado
            if (me.facturaVinculada) {
                me.$f_notificacion('Actualizando listado...', 'primary', 'icon-refresh-cw', 1000);
                setTimeout(() => {
                    me.cargarVentasPerseo();
                }, 500);
            }
        },
        recargarListadoDespuesDeEstadoCambiado() {
            // Recargar el listado después de que se cambie el estado desde el PDF
            this.cargarVentasPerseo();
            this.cargarContadorPendientesPerseo(); // ⭐ Recargar contador
        },
        marcarEnProcesoDespacho(venta) {
            let me = this;

            if (venta.est_ven_codigo != 2) {
                me.$f_notificacion('Solo se puede pasar a En proceso desde Pendiente', 'warning', 'icon-alert-triangle');
                return;
            }

            me.$vs.dialog({
                type: 'confirm',
                color: 'primary',
                title: 'Marcar como En Proceso',
                text: `¿Está seguro de marcar la venta ${venta.ven_codigo} como en proceso de despacho?`,
                accept: () => me.confirmarEnProcesoDespacho(venta),
                acceptText: 'Sí, marcar en proceso',
                cancelText: 'Cancelar'
            });
        },
        confirmarEnProcesoDespacho(venta) {
            let me = this;

            let datos = {
                ven_codigo: venta.ven_codigo,
                est_ven_codigo: 4,
                id_empresa: venta.id_empresa,
                user_despacha: me.usuario.idusuario
            };

            me.$vs.loading();

            this.$http.post(this.$server_url + 'Desactivar_venta', datos)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data && res.data.status == 0) {
                        me.$f_notificacion(res.data.message ? res.data.message : 'No se pudo cambiar a En proceso', 'danger', 'icon-x');
                        return;
                    }

                    me.$f_notificacion('Venta marcada en proceso de despacho', 'success', 'icon-check', 3000);
                    me.cargarVentasPerseo();
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    let mensaje = 'Error al cambiar a En proceso';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }
                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
        marcarComoDespachadoPerseo(venta) {
            let me = this;

            if (venta.est_ven_codigo != 4) {
                me.$f_notificacion('La venta debe estar en En proceso de despacho antes de marcarla como despachada', 'warning', 'icon-alert-triangle');
                return;
            }

            const textoConfirmacion = venta.estadoPerseo == 1 && venta.factura_perseo
                ? `¿Está seguro de marcar la venta ${venta.ven_codigo} como despachada?\n\nFactura Perseo: ${venta.factura_perseo}`
                : `¿Está seguro de marcar el documento ${venta.ven_codigo} como despachado?`;

            me.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: 'Marcar como Despachado',
                text: textoConfirmacion,
                accept: () => me.confirmarDespachadoPerseo(venta),
                acceptText: 'Sí, marcar como despachado',
                cancelText: 'Cancelar'
            });
        },
        confirmarDespachadoPerseo(venta) {
            let me = this;

            let datos = {
                ven_codigo: venta.ven_codigo,
                empresa: venta.id_empresa,
                usuario_id: me.usuario.idusuario
            };

            me.$vs.loading({ text: 'Despachando documento...' });

            this.$http.post(this.$server_url + 'api/perseo/ventas/marcar-despachado', datos)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data.status === 200) {
                        me.$f_notificacion('Venta marcada como despachada exitosamente', 'success', 'icon-check', 3000);

                        // Actualizar el registro en el listado
                        const index = me.ventasFiltradas.findIndex(v => v.ven_codigo === venta.ven_codigo);
                        if (index !== -1) {
                            me.$set(me.ventasFiltradas[index], 'est_ven_codigo', 1);
                            me.$set(me.ventasFiltradas[index], 'estado_nombre', 'Despachado');
                        }

                        // Recargar listado después de 1 segundo
                        setTimeout(() => {
                            me.cargarVentasPerseo();
                            me.cargarContadorPendientesPerseo(); // ⭐ Recargar contador
                        }, 1000);
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al marcar como despachado', 'danger', 'icon-x');
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();

                    let mensaje = 'Error al marcar como despachado';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }

                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
        getEstadoPedidoColor(estado) {
            if (estado == 0) return 'primary';
            if (estado == 1) return 'warning';
            if (estado == 2) return 'success';
            if (estado == 3) return 'success';
            return 'danger';
        },
        getEstadoPedidoTexto(estado) {
            if (estado == 0) return 'Pendiente';
            if (estado == 1) return 'En Proceso';
            if (estado == 2) return 'Despachado';
            if (estado == 3) return 'Facturado';
            return 'Desconocido';
        },
        formatearFecha(fecha) {
            if (!fecha) return '';
            if (fecha.length === 8) {
                const year = fecha.substring(0, 4);
                const month = fecha.substring(4, 6);
                const day = fecha.substring(6, 8);
                return `${day}/${month}/${year}`;
            }
            return fecha;
        },
        puedeGestionarCambioEstado() {
            return this.userRoot || this.AdminBodega || this.groupBodega;
        },
        puedeMostrarBotonCambioEstado(row) {
            if (!this.puedeGestionarCambioEstado()) {
                return false;
            }

            const estado = row && row.est_ven_codigo != null ? parseInt(row.est_ven_codigo, 10) : 0;
            return estado === 4 || estado === 1;
        },
        abrirPopupCambioEstado(row) {
            if (!this.puedeMostrarBotonCambioEstado(row)) {
                this.$f_notificacion('No tiene permisos para cambiar este estado', 'warning', 'icon-alert-triangle');
                return;
            }

            const estadoActual = row && row.est_ven_codigo != null ? parseInt(row.est_ven_codigo, 10) : 0;
            let opciones = [];

            if (estadoActual === 1) {
                opciones = [
                    { value: '2', label: 'Pendiente', shortLabel: 'PEND', color: 'warning', descripcion: 'Regresa el documento a la cola inicial.' },
                    { value: '4', label: 'En proceso', shortLabel: 'PROC', color: 'primary', descripcion: 'Lo coloca nuevamente en agenda de bodega.' }
                ];
            } else if (estadoActual === 4) {
                opciones = [
                    { value: '2', label: 'Pendiente', shortLabel: 'PEND', color: 'warning', descripcion: 'Devuelve el documento a la cola inicial.' },
                    { value: '1', label: 'Despachado', shortLabel: 'DESP', color: 'success', descripcion: 'Marca el documento como despachado.' }
                ];
            }

            if (!opciones || opciones.length === 0) {
                this.$f_notificacion('No hay cambios disponibles para este estado', 'warning', 'icon-alert-triangle');
                return;
            }

            this.ventaCambioEstado = row;
            this.opcionesCambioEstado = opciones;
            this.estadoDestinoCambio = opciones[0].value;
            this.popupCambioEstado = true;

            // Si la primera opción es Pendiente, cargar items automáticamente
            if (opciones[0].value === '2') {
                this.cargarItemsParaLimpiar(row);
            }
        },

        // ⭐ NUEVO: Método para seleccionar estado destino y cargar items si es Pendiente
        seleccionarEstadoDestino(valor) {
            this.estadoDestinoCambio = valor;

            // Si selecciona Pendiente (2), cargar los items
            if (valor === '2' && this.ventaCambioEstado) {
                this.cargarItemsParaLimpiar(this.ventaCambioEstado);
            } else {
                // Si selecciona otro estado, limpiar items
                this.itemsParaLimpiar = [];
                this.seleccionarTodosLimpiar = false;
            }
        },

        // ⭐ NUEVO: Cargar items para limpiar
        cargarItemsParaLimpiar(row) {
            let me = this;

            me.$vs.loading();

            this.$http.get(
                this.$server_url + `api/perseo/ventas/items-despachados/${row.ven_codigo}?empresa=${row.id_empresa}`
            )
            .then(res => {
                me.$vs.loading.close();

                if (res.data.status === 200) {
                    // Agregar propiedad seleccionado a cada item
                    me.itemsParaLimpiar = res.data.data.map(item => ({
                        ...item,
                        seleccionado: false
                    }));
                }
            })
            .catch(err => {
                me.$vs.loading.close();
                console.error('Error al obtener items:', err);
                me.$f_notificacion('Error al cargar items para limpiar', 'danger', 'icon-x');
            });
        },
        getTextoEstadoDestinoSeleccionado() {
            if (!this.estadoDestinoCambio) {
                return '-';
            }

            // Si es el estado especial de empaque
            if (this.estadoDestinoCambio === 'empaque') {
                return 'Por Empacarse';
            }

            if (!this.opcionesCambioEstado || this.opcionesCambioEstado.length === 0) {
                return '-';
            }

            for (let i = 0; i < this.opcionesCambioEstado.length; i++) {
                if (String(this.opcionesCambioEstado[i].value) === String(this.estadoDestinoCambio)) {
                    return this.opcionesCambioEstado[i].label;
                }
            }

            return '-';
        },
        cerrarPopupCambioEstado() {
            this.popupCambioEstado = false;
            this.ventaCambioEstado = null;
            this.estadoDestinoCambio = '';
            this.opcionesCambioEstado = [];
            this.itemsParaLimpiar = [];
            this.seleccionarTodosLimpiar = false;
            this.busquedaItemsLimpiar = '';
            this.mostrarSoloSeleccionados = false;
        },
        regresarAEmpaque() {
            if (!this.ventaCambioEstado) {
                this.$f_notificacion('No hay una venta seleccionada', 'warning', 'icon-alert-triangle');
                return;
            }

            let datos = {
                ven_codigo: this.ventaCambioEstado.ven_codigo,
                id_empresa: this.ventaCambioEstado.id_empresa
            };

            this.$vs.loading();
            this.$http.post(this.$server_url + 'api/empaque-venta/regresar-a-empaque', datos)
                .then((res) => {
                    this.$vs.loading.close();

                    if (res.data && res.data.status != 200) {
                        this.$f_notificacion(res.data.message ? res.data.message : 'No se pudo regresar a empaque', 'danger', 'icon-x');
                        return;
                    }

                    this.$f_notificacion('Documento regresado a estado de empaque correctamente', 'success', 'icon-check', 3000);
                    this.cerrarPopupCambioEstado();
                    this.cargarVentasPerseo();
                })
                .catch((err) => {
                    this.$vs.loading.close();
                    let mensaje = 'Error al regresar a empaque';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }
                    this.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
        confirmarCambioEstadoManual() {
            if (!this.ventaCambioEstado) {
                this.$f_notificacion('No hay una venta seleccionada', 'warning', 'icon-alert-triangle');
                return;
            }

            // Si seleccionó "Por Empacarse", llamar a la API de regresar a empaque
            if (this.estadoDestinoCambio === 'empaque') {
                this.regresarAEmpaque();
                return;
            }

            const destino = this.estadoDestinoCambio ? parseInt(this.estadoDestinoCambio, 10) : 0;
            if (destino !== 1 && destino !== 2 && destino !== 4) {
                this.$f_notificacion('Seleccione un estado válido', 'warning', 'icon-alert-triangle');
                return;
            }

            const estadoActual = this.ventaCambioEstado.est_ven_codigo != null
                ? parseInt(this.ventaCambioEstado.est_ven_codigo, 10)
                : 0;

            if (estadoActual === destino) {
                this.$f_notificacion('La venta ya se encuentra en ese estado', 'warning', 'icon-alert-triangle');
                return;
            }

            // ⭐ Si el destino es Pendiente (2), usar el endpoint con limpieza
            if (destino === 2) {
                this.confirmarCambioAPendienteConLimpieza();
                return;
            }

            // Para otros estados, usar el endpoint normal
            let datos = {
                ven_codigo: this.ventaCambioEstado.ven_codigo,
                empresa: this.ventaCambioEstado.id_empresa,
                estado_destino: destino,
                usuario_id: this.usuario.idusuario
            };

            this.$vs.loading();
            this.$http.post(this.$server_url + 'api/perseo/ventas/cambiar-estado-manual', datos)
                .then((res) => {
                    this.$vs.loading.close();

                    if (res.data && res.data.status != 200) {
                        this.$f_notificacion(res.data.message ? res.data.message : 'No se pudo cambiar el estado', 'danger', 'icon-x');
                        return;
                    }

                    this.$f_notificacion('Estado actualizado correctamente', 'success', 'icon-check', 3000);
                    this.cerrarPopupCambioEstado();
                    this.cargarVentasPerseo();
                    this.cargarContadorPendientesPerseo(); // ⭐ Recargar contador
                })
                .catch((err) => {
                    this.$vs.loading.close();
                    let mensaje = 'Error al cambiar estado';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }
                    this.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
        seleccionarFacturaManual(factura) {
            this.facturaSeleccionadaManual = factura;
        },
        // Compara los items (producto + cantidad) del pedido contra los de una factura candidata,
        // con la misma regla que usa el backend para el anclaje automático (compararDetalles).
        resumenItemsFactura(factura) {
            const detallesPedido = (this.dataFactura && this.dataFactura.pedido_info && this.dataFactura.pedido_info.detalles) || [];
            const detallesFactura = (factura && factura.facturasd && factura.facturasd.detalles) || [];

            if (detallesPedido.length === 0 || detallesFactura.length === 0) {
                return { coincide: false, texto: 'Sin detalle de productos para comparar' };
            }

            const mapaPedido = {};
            detallesPedido.forEach(d => { mapaPedido[d.productocodigo] = Number(d.cantidad); });

            const coincidencias = detallesFactura.filter(d =>
                mapaPedido[d.productocodigo] !== undefined && mapaPedido[d.productocodigo] === Number(d.cantidad)
            ).length;

            const mismaCantidadItems = detallesFactura.length === detallesPedido.length;

            return {
                coincide: mismaCantidadItems && coincidencias === detallesPedido.length,
                texto: `${coincidencias} de ${detallesPedido.length} coinciden` + (mismaCantidadItems ? '' : ` (factura tiene ${detallesFactura.length})`)
            };
        },
        vincularFacturaManual() {
            let me = this;

            if (!me.facturaSeleccionadaManual) {
                me.$f_notificacion('Debe seleccionar una factura', 'warning', 'icon-alert-triangle');
                return;
            }

            const venta = me.ObjectedSelected;
            const factura = me.facturaSeleccionadaManual;

            me.$vs.dialog({
                type: 'confirm',
                color: 'primary',
                title: 'Vincular Factura Manualmente',
                text: `¿Está seguro de vincular la factura ${factura.establecimiento}-${factura.puntoemision}-${factura.secuencial} con la venta ${venta.ven_codigo}?`,
                accept: () => me.confirmarVinculacionManual(),
                acceptText: 'Sí, vincular',
                cancelText: 'Cancelar'
            });
        },
        confirmarVinculacionManual() {
            let me = this;

            const datos = {
                ven_codigo: me.ObjectedSelected.ven_codigo,
                empresa: me.ObjectedSelected.id_empresa,
                facturasid: me.facturaSeleccionadaManual.facturasid
            };

            me.$vs.loading();

            this.$http.post(this.$server_url + 'api/perseo/ventas/vincular-factura-manual', datos)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data.status === 200) {
                        me.$f_notificacion('Factura vinculada manualmente exitosamente', 'success', 'icon-check', 3000);

                        me.dataFactura = {
                            status: 200,
                            factura_encontrada: true,
                            factura_info: res.data.factura_info,
                            message: 'Factura vinculada manualmente'
                        };

                        me.facturaVinculada = true;
                        me.facturaSeleccionadaManual = null;

                        const index = me.ventasFiltradas.findIndex(v => v.ven_codigo === me.ObjectedSelected.ven_codigo);
                        if (index !== -1) {
                            me.$set(me.ventasFiltradas[index], 'factura_perseo', res.data.factura_info.factura_perseo);
                            me.$set(me.ventasFiltradas[index], 'id_factura_perseo', res.data.factura_info.id_factura_perseo);
                        }
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al vincular factura', 'danger', 'icon-x');
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();

                    let mensaje = 'Error al vincular factura';
                    if (err.response && err.response.data && err.response.data.message) {
                        mensaje = err.response.data.message;
                    }

                    me.$f_notificacion(mensaje, 'danger', 'icon-x');
                });
        },
        normalizarEscaneosBodega(row) {
            let escaneos = row && row.escaneos_bodega ? row.escaneos_bodega : [];

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
        tieneEscaneosBodega(row) {
            return this.normalizarEscaneosBodega(row).length > 0;
        },
        abrirPopupEscaneos(row) {
            this.ventaEscaneos = row;
            this.escaneosVentaDetalle = this.normalizarEscaneosBodega(row);
            this.popupEscaneos = true;
        },
        formatearFechaHoraEscaneo(valor) {
            if (!valor) {
                return '-';
            }
            const texto = String(valor).replace('T', ' ');
            return texto.length >= 16 ? texto.substring(0, 16) : texto;
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
        f_cantidadDespachado(venta) {
      console.log('Documento seleccionado:', venta)
      this.documentoActual = venta.ven_codigo
      this.cantidadDespachados = true
      this.popupDespachados = true
    },

    manejarDatosCargados(data) {
      console.log('Datos cargados del documento:', data)
      // Aquí puedes manejar los datos si necesitas
      this.$vs.notify({
        title: 'Éxito',
        text: `Documento ${data.documento} cargado correctamente`,
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check-circle'
      })
    },

    manejarError(error) {
      console.error('Error al cargar datos:', error)
      this.$vs.notify({
        title: 'Error',
        text: error,
        color: 'danger',
        iconPack: 'feather',
        icon: 'icon-alert-circle'
      })
      // Cerrar popup si hay error
      setTimeout(() => {
        this.cerrarPopup()
      }, 2000)
    },

    cerrarPopup() {
      this.popupDespachados = false
      this.modoLimpiarPendiente = false
      this.itemsParaLimpiar = []
      this.seleccionarTodosLimpiar = false
      // Limpiar después de cerrar
      setTimeout(() => {
        if (!this.popupDespachados) {
          this.cantidadDespachados = false
          this.documentoActual = null
        }
      }, 300)
    },

    // ⭐ NUEVO: Abrir detalles para cambiar a pendiente
    abrirDetallesParaCambiarAPendiente(row) {
        let me = this;

        // Primero abrir el modal de detalles normal
        me.f_cantidadDespachado(row);

        // Guardar referencia del documento
        me.ObjectedSelected = row;

        // Luego cargar los items para limpiar
        me.$vs.loading();

        this.$http.get(
            this.$server_url + `api/perseo/ventas/items-despachados/${row.ven_codigo}?empresa=${row.id_empresa}`
        )
        .then(res => {
            me.$vs.loading.close();

            if (res.data.status === 200) {
                // Agregar propiedad seleccionado a cada item
                me.itemsParaLimpiar = res.data.data.map(item => ({
                    ...item,
                    seleccionado: false
                }));

                // Activar el modo limpiar
                me.modoLimpiarPendiente = true;
            }
        })
        .catch(err => {
            me.$vs.loading.close();
            console.error('Error al obtener items:', err);
            me.$f_notificacion('Error al cargar items para limpiar', 'danger', 'icon-x');
        });
    },

    // ⭐ NUEVO: Toggle seleccionar todos
    toggleSeleccionTodosLimpiar() {
        const seleccionar = this.seleccionarTodosLimpiar;
        this.itemsParaLimpiar.forEach(item => {
            if (item.det_ven_cantidad_despacho > 0) {
                item.seleccionado = seleccionar;
            }
        });
    },

    // ⭐ NUEVO: Cancelar modo limpiar
    cancelarModoLimpiar() {
        this.modoLimpiarPendiente = false;
        this.itemsParaLimpiar = [];
        this.seleccionarTodosLimpiar = false;
    },

    // ⭐ NUEVO: Confirmar cambio a pendiente con limpieza
    confirmarCambioAPendienteConLimpieza() {
        let me = this;

        if (!me.ventaCambioEstado) {
            me.$f_notificacion('No hay documento seleccionado', 'warning', 'icon-alert-triangle');
            return;
        }

        // Obtener los pro_codigo de los items seleccionados
        const itemsLimpiar = me.itemsParaLimpiar
            .filter(item => item.seleccionado === true)
            .map(item => item.pro_codigo);

        const datos = {
            ven_codigo: me.ventaCambioEstado.ven_codigo,
            empresa: me.ventaCambioEstado.id_empresa,
            estado_destino: 2, // Pendiente
            usuario_id: me.usuario.idusuario,
            items_limpiar: itemsLimpiar
        };

        me.$vs.loading();

        this.$http.post(this.$server_url + 'api/perseo/ventas/cambiar-estado-manual', datos)
            .then(res => {
                me.$vs.loading.close();

                if (res.data.status === 200) {
                    const mensaje = itemsLimpiar.length > 0
                        ? `Documento cambiado a Pendiente. Se limpiaron ${itemsLimpiar.length} item(s)`
                        : 'Documento cambiado a Pendiente exitosamente';

                    me.$f_notificacion(mensaje, 'success', 'icon-check', 3000);

                    // Cerrar modal y limpiar
                    me.cerrarPopupCambioEstado();

                    // Recargar listado
                    me.cargarVentasPerseo();
                    me.cargarContadorPendientesPerseo(); // ⭐ Recargar contador
                } else {
                    me.$f_notificacion(
                        res.data.message || 'Error al cambiar a Pendiente',
                        'danger',
                        'icon-x'
                    );
                }
            })
            .catch(err => {
                me.$vs.loading.close();

                let mensaje = 'Error al cambiar a Pendiente';
                if (err.response && err.response.data && err.response.data.message) {
                    mensaje = err.response.data.message;
                }

                me.$f_notificacion(mensaje, 'danger', 'icon-x');
            });
    },

    // ⭐ NUEVO: Cargar contador de documentos pendientes de Perseo
    cargarContadorPendientesPerseo() {
        let me = this;

        me.loadingContadorPerseo = true;

        this.$http.get(this.$server_url + 'api/perseo/ventas/contador-pendientes')
            .then(res => {
                me.loadingContadorPerseo = false;

                if (res.data.status === 200) {
                    me.contadorPendientesPerseo = res.data.data.total || 0;
                } else {
                    console.warn('No se pudo cargar el contador de pendientes de Perseo');
                }
            })
            .catch(err => {
                me.loadingContadorPerseo = false;
                console.error('Error al cargar contador de pendientes:', err);
            });
    },

    // ⭐ VERIFICACIÓN MASIVA EN PERSEO (solo root)
    abrirVerificacionMasiva() {
        let me = this;

        if (!me.userRoot) {
            me.$f_notificacion('Solo el usuario root puede ejecutar la verificación masiva', 'warning', 'icon-lock');
            return;
        }

        me.popupVerificarMasivo = true;
        me.reiniciarResumenMasivo();
        me.cargarPendientesMasivo();
    },

    reiniciarResumenMasivo() {
        this.masivoResumen = {
            vinculadas: 0,
            ya_vinculadas: 0,
            no_facturado: 0,
            sin_coincidencia: 0,
            error: 0
        };
        this.masivoProcesados = 0;
        this.masivoTotalProceso = 0;
        this.masivoLoteActual = 0;
        this.masivoPausado = false;
        this.masivoCancelar = false;
    },

    cargarPendientesMasivo() {
        let me = this;

        me.masivoCargando = true;
        me.masivoDocumentos = [];
        me.masivoTodos = true;
        me.masivoFiltroResultado = 'todos';
        me.reiniciarResumenMasivo();

        let url = 'api/perseo/ventas/pendientes-perseo-lista?dias_minimos=' + me.masivoDiasMinimos;

        this.$http.get(this.$server_url + url)
            .then(res => {
                me.masivoCargando = false;

                if (res.data.status === 200) {
                    me.masivoDocumentos = (res.data.data || []).map(doc => Object.assign({}, doc, {
                        _sel: true,
                        _procesado: false,
                        _resultado: '',
                        _mensaje: '',
                        _factura: ''
                    }));

                    if (me.masivoDocumentos.length === 0) {
                        me.$f_notificacion('No hay documentos pendientes de anclar', 'success', 'icon-check');
                    } else {
                        me.$f_notificacion(`${me.masivoDocumentos.length} documento(s) pendientes de anclar`, 'primary', 'icon-list');
                    }
                } else {
                    me.$f_notificacion(res.data.message || 'Error al cargar pendientes', 'danger', 'icon-x');
                }
            })
            .catch(() => {
                me.masivoCargando = false;
                me.$f_notificacion('Error al conectar con el servidor', 'danger', 'icon-x');
            });
    },

    alternarSeleccionMasiva(seleccionar) {
        this.masivoDocumentos.forEach(doc => { doc._sel = seleccionar; });
    },

    confirmarVerificacionMasiva() {
        let me = this;
        let total = me.masivoSeleccionados.length;
        let lotes = Math.ceil(total / me.masivoTamanoLote);

        me.$vs.dialog({
            type: 'confirm',
            color: 'primary',
            title: 'Verificación masiva en Perseo',
            text: `Se procesarán ${total} documento(s) en ${lotes} lote(s) de ${me.masivoTamanoLote}, consultando facturas de los últimos ${me.masivoDias} días. ¿Desea continuar?`,
            accept: () => me.iniciarVerificacionMasiva(),
            acceptText: 'Sí, iniciar',
            cancelText: 'Cancelar'
        });
    },

    async iniciarVerificacionMasiva() {
        let me = this;

        let pendientes = me.masivoSeleccionados.filter(doc => !doc._procesado);

        if (pendientes.length === 0) {
            me.$f_notificacion('No hay documentos seleccionados por procesar', 'warning', 'icon-alert-triangle');
            return;
        }

        me.masivoProcesando = true;
        me.masivoPausado = false;
        me.masivoCancelar = false;
        me.masivoProcesados = 0;
        me.masivoTotalProceso = pendientes.length;
        me.masivoLoteActual = 0;

        // Precalentar (empresa por empresa) la caché de facturas de Perseo ANTES de procesar
        // documentos: el servidor corta la petición si intenta hacer más de una llamada externa
        // a Perseo seguida, así que esta consulta pesada se aísla en su propia petición.
        let empresasUnicas = [...new Set(pendientes.map(doc => doc.id_empresa))];
        me.masivoPrecalentando = true;
        await me.precalentarCacheFacturas(empresasUnicas);
        me.masivoPrecalentando = false;

        let tamano = me.masivoTamanoLote;

        for (let i = 0; i < pendientes.length && !me.masivoCancelar; i += tamano) {
            if (me.masivoCancelar) break;

            // Pausa cooperativa entre lotes
            while (me.masivoPausado && !me.masivoCancelar) {
                await me.esperarMasivo(400);
            }
            if (me.masivoCancelar) break;

            me.masivoLoteActual++;
            await me.procesarLoteMasivo(pendientes.slice(i, i + tamano));
        }

        me.masivoProcesando = false;
        me.masivoPausado = false;

        if (me.masivoCancelar) {
            me.$f_notificacion(`Proceso detenido: ${me.masivoProcesados} de ${me.masivoTotalProceso} documentos procesados`, 'warning', 'icon-alert-triangle', 4000);
        } else {
            me.$f_notificacion(`Proceso finalizado: ${me.masivoResumen.vinculadas} factura(s) anclada(s)`, 'success', 'icon-check', 4000);
        }

        me.cargarContadorPendientesPerseo();
    },

    // El servidor corta la petición si hace más de una llamada externa a Perseo seguida,
    // así que cada documento se envía en SU PROPIA petición (no todo el lote junto); "lote"
    // ahora solo agrupa cuántos documentos se procesan en paralelo por ronda.
    procesarLoteMasivo(lote) {
        let me = this;

        let promesas = lote.map(doc => me.procesarDocumentoMasivo(doc));

        return Promise.all(promesas);
    },

    procesarDocumentoMasivo(doc) {
        let me = this;

        let datos = {
            dias: me.masivoDias,
            documentos: [{
                ven_codigo: doc.ven_codigo,
                id_empresa: doc.id_empresa
            }]
        };

        return this.$http.post(this.$server_url + 'api/perseo/ventas/facturas-verificar-masivo', datos)
            .then(res => {
                if (res.data.status === 200) {
                    let resultado = (res.data.data || [])[0];
                    if (!resultado) return;

                    doc._procesado = true;
                    doc._resultado = resultado.resultado;
                    doc._mensaje = resultado.mensaje;
                    doc._factura = resultado.factura_perseo || '';

                    let claveResumen = me.claveResumenMasivo(resultado.resultado);
                    if (me.masivoResumen[claveResumen] !== undefined) {
                        me.masivoResumen[claveResumen]++;
                    }

                    // Reflejar la factura anclada en el listado principal
                    if (resultado.resultado === 'vinculada') {
                        const index = me.ventasFiltradas.findIndex(v => v.ven_codigo === resultado.ven_codigo);
                        if (index !== -1) {
                            me.$set(me.ventasFiltradas[index], 'factura_perseo', resultado.factura_perseo);
                            me.$set(me.ventasFiltradas[index], 'id_factura_perseo', resultado.id_factura_perseo);
                        }
                    }

                    me.masivoProcesados += 1;
                } else {
                    me.marcarLoteConErrorMasivo([doc], res.data.message || 'Error al procesar el documento');
                }
            })
            .catch(err => {
                let mensaje = 'Error al conectar con el servidor';
                if (err.response && err.response.data && err.response.data.message) {
                    mensaje = err.response.data.message;
                }
                me.marcarLoteConErrorMasivo([doc], mensaje);
            });
    },

    // Precalienta, de a una empresa por petición, la caché de facturas de Perseo para que el
    // bucle principal (que sí corre documento por documento) nunca tenga que hacer la consulta
    // pesada de "facturas_consulta" y así no se sume a su tiempo de ejecución.
    async precalentarCacheFacturas(empresas) {
        let me = this;

        for (const empresa of empresas) {
            if (me.masivoCancelar) break;

            try {
                await me.$http.post(me.$server_url + 'api/perseo/ventas/precalentar-facturas-cache', {
                    empresa: empresa,
                    dias: me.masivoDias
                });
            } catch (err) {
                // No se detiene el proceso: si la precarga falla, el error real se reportará
                // igual al procesar los documentos de esa empresa.
            }
        }
    },

    marcarLoteConErrorMasivo(lote, mensaje) {
        let me = this;

        lote.forEach(doc => {
            doc._procesado = true;
            doc._resultado = 'error';
            doc._mensaje = mensaje;
            me.masivoResumen.error++;
        });

        me.masivoProcesados += lote.length;
        me.$f_notificacion(mensaje, 'danger', 'icon-x');
    },

    claveResumenMasivo(resultado) {
        switch (resultado) {
            case 'vinculada': return 'vinculadas';
            case 'ya_vinculada': return 'ya_vinculadas';
            case 'no_facturado': return 'no_facturado';
            case 'sin_coincidencia': return 'sin_coincidencia';
            default: return 'error';
        }
    },

    esperarMasivo(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    colorResultadoMasivo(resultado) {
        switch (resultado) {
            case 'vinculada': return 'success';
            case 'ya_vinculada': return 'dark';
            case 'no_facturado': return 'warning';
            case 'sin_coincidencia': return 'warning';
            default: return 'danger';
        }
    },

    textoResultadoMasivo(resultado) {
        switch (resultado) {
            case 'vinculada': return 'Anclada';
            case 'ya_vinculada': return 'Ya anclada';
            case 'no_facturado': return 'Sin facturar';
            case 'sin_coincidencia': return 'Sin coincidencia';
            default: return 'Error';
        }
    },

    // ⭐ NUEVO: Filtrar y mostrar solo los pendientes de Perseo
    filtrarPendientesPerseo() {
        let me = this;

        // Marcar que el filtro de pendientes está activo
        me.filtroActivoPendientesPerseo = true;

        // Limpiar filtros actuales
        me.filtroEstado = 'todos';
        me.filtroFechasActivo = false;
        me.fechaDesde = '';
        me.fechaHasta = '';

        me.$vs.loading();

        // Llamar endpoint sin filtros pero con lógica de "pendientes de Perseo"
        let url = 'api/perseo/ventas/por-despachar?solo_pendientes_perseo=1';

        this.$http.get(this.$server_url + url)
            .then(res => {
                me.$vs.loading.close();

                if (res.data.status === 200) {
                    me.Ventas = res.data.data || [];
                    me.ventasFiltradas = [...me.Ventas];
                    me.resumenVentas = me.generarResumenLocal(me.Ventas, res.data.resumen);

                    if (me.Ventas.length === 0) {
                        me.$f_notificacion('No hay documentos pendientes de Perseo', 'primary', 'icon-info');
                    } else {
                        me.$f_notificacion(`${me.Ventas.length} documentos pendientes de Perseo`, 'warning', 'icon-alert-triangle');
                    }
                } else {
                    me.$f_notificacion('Error al cargar documentos pendientes', 'danger', 'icon-x');
                }
            })
            .catch(err => {
                me.$vs.loading.close();
                me.$f_notificacion('Error al conectar con el servidor', 'danger', 'icon-x');
            });
    },

    // ⭐ NUEVO: Quitar filtro de pendientes de Perseo
    quitarFiltroPendientesPerseo() {
        this.filtroActivoPendientesPerseo = false;
        this.cargarVentasPerseo(); // Recargar con filtros normales
        this.$f_notificacion('Filtro removido', 'primary', 'icon-check');
    }
    },
};
</script>
<style scoped>
.text {
  z-index: 9;
  background: var(--bg);
  color: var(--color);
  font-size:11px;
  padding: 1.5px;
  border-radius: 1px;
  height: fit-content;
  cursor: pointer;
  box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.15);
}
.popopPadre {
    z-index: 51008;
    position: fixed;
}
.popup-pdf-venta {
    z-index: 51010 !important;
}
.popup-empacar-padre {
    z-index: 51005 !important;
}
input[type="date"] {
    padding: 0.5rem 1rem;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s;
    background: white;
}
input[type="date"]:focus {
    outline: none;
    border-color: #1e3c72;
    box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}
.text-primary {
    color: #1e3c72;
}
.text-success {
    color: #28C76F;
}
.text-gray-600 {
    color: #6c757d;
}
.font-semibold {
    font-weight: 600;
}
.gap-4 {
    gap: 1rem;
}
.gap-2 {
    gap: 0.5rem;
}
.v-select {
    min-width: 150px;
}
.vs-chip {
    display: inline-flex;
    align-items: center;
}
.vs-chip i {
    margin-right: 0.25rem;
}
.grid {
    display: grid;
}
.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}
.col-span-3 {
    grid-column: span 3 / span 3;
}
.bg-green-100 {
    background-color: #d1fae5;
}
.border-green-300 {
    border-color: #86efac;
}
.bg-yellow-100 {
    background-color: #fef3c7;
}
.border-yellow-300 {
    border-color: #fcd34d;
}
.text-warning {
    color: #FF9F43;
}
.bg-gray-100 {
    background-color: #f3f4f6;
}
.bg-gray-200 {
    background-color: #e5e7eb;
}
.overflow-auto {
    overflow: auto;
}
.sticky {
    position: sticky;
}
.top-0 {
    top: 0;
}
code {
    font-family: monospace;
    font-size: 0.875rem;
}
.flex {
    display: flex;
}
.justify-between {
    justify-content: space-between;
}
.items-center {
    align-items: center;
}
table {
    border-collapse: collapse;
}
table thead tr {
    background-color: #f3f4f6;
}
table th, table td {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
}
/* ===== PANEL DE FILTROS DESPACHOS ===== */
.despachos-filtros-panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.filtros-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.filtros-separador {
    width: 1px;
    height: 24px;
    background: #cbd5e1;
    flex-shrink: 0;
}

.filtros-grupo {
    display: flex;
    align-items: center;
    gap: 6px;
}

.filtros-etiqueta {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
}

.filtros-input-fecha {
    padding: 4px 8px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-size: 12px;
    color: #334155;
    background: #f8fafc;
    outline: none;
    transition: border-color 0.2s;
}

.filtros-input-fecha:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
}

/* Estado Botones */
.filtros-estado-btns {
    display: flex;
    gap: 0;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #cbd5e1;
}

.estado-btn {
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    background: #f8fafc;
    color: #64748b;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    border-right: 1px solid #e2e8f0;
}

.estado-btn:last-child {
    border-right: none;
}

.estado-btn:hover {
    background: #e2e8f0;
    color: #334155;
}

.estado-btn-activo {
    color: #fff !important;
}

.estado-btn-todos.estado-btn-activo {
    background: #6366f1;
}

.estado-btn-pendiente.estado-btn-activo {
    background: #f59e0b;
}

.estado-btn-proceso.estado-btn-activo {
    background: #046AE7;
}

.estado-btn-despachado.estado-btn-activo {
    background: #10b981;
}

.estado-btn-anulado.estado-btn-activo {
    background: #ef4444;
}

/* Barra resumen (inline en fila 1) */
.resumen-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    margin-left: 4px;
}

.resumen-item i {
    font-size: 10px;
}

.resumen-item b {
    font-weight: 700;
}

.resumen-total i { color: #6366f1; }
.resumen-total b { color: #4338ca; }

.resumen-pendientes i { color: #f59e0b; }
.resumen-pendientes b { color: #d97706; }

.resumen-proceso i { color: #046AE7; }
.resumen-proceso b { color: #046AE7; }

.resumen-despachadas i { color: #10b981; }
.resumen-despachadas b { color: #059669; }

.resumen-anuladas i { color: #ef4444; }
.resumen-anuladas b { color: #dc2626; }

/* ===== FILA 2: FILTRO FECHAS (FRONTEND) ===== */
.despachos-filtros-fechas {
    background: #fafbfd;
    border: 1px dashed #d1d5db;
    border-radius: 6px;
    padding: 7px 14px;
    margin-bottom: 12px;
}

/* ===== VERIFICACIÓN MASIVA EN PERSEO ===== */
.masivo-wrapper {
    padding: 4px;
}

.masivo-config {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    align-items: end;
}

.masivo-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #626262;
    margin-bottom: 4px;
}

.masivo-config-accion {
    display: flex;
    align-items: flex-end;
}

.masivo-ayuda {
    margin-top: 14px;
    font-size: 12px;
    color: #626262;
    background: #f8f8f8;
    border-left: 3px solid #7367f0;
    padding: 8px 12px;
    border-radius: 4px;
}

.masivo-resumen {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.masivo-contadores {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.masivo-botonera {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.masivo-progreso {
    margin-top: 16px;
}

.masivo-progreso-texto {
    font-size: 12px;
    color: #626262;
    margin-bottom: 6px;
}

.masivo-pausa {
    color: #ff9f43;
    font-weight: 600;
}

.masivo-tabla-cabecera {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
}

.masivo-filtro-resultado {
    width: 240px;
}

.masivo-subtexto {
    font-size: 11px;
    color: #8a8a8a;
}

@media (max-width: 768px) {
    .masivo-resumen {
        flex-direction: column;
        align-items: stretch;
    }

    .masivo-filtro-resultado {
        width: 100%;
    }
}

/* ===== ALERTA DE PENDIENTES DE PERSEO ===== */
.alerta-pendientes-perseo {
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #fff9e6 0%, #fff5d6 100%);
    border: 2px solid #ff9f43;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(255, 159, 67, 0.15);
}

.alerta-icono {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ff9f43;
    color: white;
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 18px;
}

.alerta-contenido {
    flex: 1;
}

.alerta-titulo {
    font-size: 14px;
    font-weight: 700;
    color: #c77424;
    margin-bottom: 4px;
}

.alerta-descripcion {
    font-size: 13px;
    color: #7a5f3c;
}

.alerta-descripcion b {
    font-weight: 800;
    color: #c77424;
}

.alerta-accion {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
}

@media (max-width: 768px) {
    .alerta-pendientes-perseo {
        flex-direction: column;
        align-items: flex-start;
    }

    .alerta-accion {
        width: 100%;
    }

    .alerta-accion button {
        width: 100%;
    }
}

/* ===== INDICADOR DE FILTRO ACTIVO ===== */
.filtro-activo-perseo {
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, #e8f4fd 0%, #d6ebf7 100%);
    border: 2px solid #046AE7;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(4, 106, 231, 0.15);
}

.filtro-activo-icono {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #046AE7;
    color: white;
    border-radius: 50%;
    flex-shrink: 0;
    font-size: 18px;
}

.filtro-activo-contenido {
    flex: 1;
}

.filtro-activo-titulo {
    font-size: 14px;
    font-weight: 700;
    color: #046AE7;
    margin-bottom: 4px;
}

.filtro-activo-descripcion {
    font-size: 13px;
    color: #1e3a8a;
}

.filtro-activo-accion {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
}

@media (max-width: 768px) {
    .filtro-activo-perseo {
        flex-direction: column;
        align-items: flex-start;
    }

    .filtro-activo-accion {
        width: 100%;
    }

    .filtro-activo-accion button {
        width: 100%;
    }
}

/* ===== FILA 2: FILTRO FECHAS (FRONTEND) ===== */
.despachos-filtros-fechas {
    background: #fafbfd;
    border: 1px dashed #d1d5db;
    border-radius: 6px;
    padding: 7px 14px;
    margin-bottom: 12px;
}

.filtros-fechas-toggle {
    font-size: 11px;
    font-weight: 600;
    color: #7c3aed;
    background: #ede9fe;
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid #c4b5fd;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
}

.filtros-fechas-toggle:hover {
    background: #ddd6fe;
    border-color: #a78bfa;
}

.filtros-fechas-toggle-activo {
    background: #7c3aed;
    color: #fff;
    border-color: #6d28d9;
}

.filtros-fechas-toggle-activo:hover {
    background: #6d28d9;
}

.filtros-fechas-resultado {
    font-size: 11px;
    color: #6366f1;
    font-weight: 500;
    margin-left: auto;
    white-space: nowrap;
}

.filtros-fechas-resultado b {
    font-weight: 700;
    color: #4338ca;
}

/* ===== RADIO ORIGEN ===== */
.filtros-radio-group {
    display: flex;
    gap: 10px;
}

.filtros-radio-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
    user-select: none;
}

.filtros-radio {
    accent-color: #7c3aed;
    cursor: pointer;
}

.cambio-estado-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 10px;
    background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    border: 1px solid #bfdbfe;
    margin-bottom: 14px;
}

.cambio-estado-kicker {
    font-size: 11px;
    font-weight: 700;
    color: #046AE7;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.cambio-estado-documento {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
}

.cambio-estado-resumen {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 14px;
}

.cambio-estado-resumen-item {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
}

.cambio-estado-resumen-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.cambio-estado-resumen-value {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
}

.cambio-estado-resumen-value-destino {
    color: #046AE7;
}

.estado-opciones-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.estado-opcion-card {
    text-align: left;
    border: 1px solid #dbe3ee;
    border-radius: 12px;
    background: #ffffff;
    padding: 12px;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    min-height: 118px;
}

.estado-opcion-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    border-color: #93c5fd;
}

.estado-opcion-card-activa {
    border-color: #046AE7;
    background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
    box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.12);
}

.estado-opcion-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.estado-opcion-check {
    color: #046AE7;
    font-size: 14px;
}

.estado-opcion-label {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 6px;
}

.estado-opcion-desc {
    font-size: 12px;
    line-height: 1.45;
    color: #64748b;
}

.cambio-estado-nota {
    padding: 10px 12px;
    border-left: 4px solid #046AE7;
    background: #eff6ff;
    border-radius: 8px;
    font-size: 12px;
    color: #1e3a8a;
}

@media (max-width: 768px) {
    .cambio-estado-hero {
        flex-direction: column;
        align-items: flex-start;
    }

    .cambio-estado-resumen,
    .estado-opciones-grid {
        grid-template-columns: 1fr;
    }
}

.facturas-disponibles-lista {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding: 4px;
}

.factura-disponible-card {
    position: relative;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px;
    background: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
}

.factura-disponible-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.factura-disponible-card-seleccionada {
    border-color: #046AE7;
    background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
    box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.1);
}

.factura-disponible-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.factura-disponible-numero {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
}

.factura-disponible-numero i {
    color: #046AE7;
    margin-right: 6px;
}

.factura-disponible-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.factura-disponible-info-item {
    font-size: 12px;
    color: #64748b;
}

.factura-disponible-info-item strong {
    color: #334155;
    font-weight: 600;
}

.factura-disponible-check {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    color: #046AE7;
}

.escaneos-lista {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 55vh;
    overflow-y: auto;
    padding-right: 4px;
}

.escaneo-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    padding: 10px;
}

.escaneo-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.escaneo-item-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
}

.escaneo-item-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.escaneo-item-campo {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.escaneo-item-label {
    font-size: 10px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 700;
}

.escaneo-item-value {
    font-size: 12px;
    color: #1e293b;
    font-weight: 600;
}

@media (max-width: 768px) {
    .escaneo-item-grid {
        grid-template-columns: 1fr;
    }
}

/* ═══════════════════════════════════════════════════
   BOTÓN DISPARADOR MENÚ FLOTANTE ⋮
═══════════════════════════════════════════════════ */
.menu-trigger-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #dde1e7;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  line-height: 1;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  user-select: none;
  flex-shrink: 0;
}
.menu-trigger-btn:hover,
.menu-trigger-btn.active {
  border-color: #6c63ff;
  background: #f3f1ff;
  box-shadow: 0 2px 10px rgba(108, 99, 255, 0.2);
  color: #6c63ff;
}

/* ═══════════════════════════════════════════════════
   PANEL FLOTANTE (position:fixed via :style)
═══════════════════════════════════════════════════ */
.menu-flotante {
  width: 244px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10);
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.07);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
}
.menu-titulo {
  font-weight: 700;
  font-size: 12px;
  color: #1a1a2e;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}
.menu-cerrar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #999;
  padding: 2px 6px;
  border-radius: 50%;
  transition: background 0.15s, color 0.15s;
}
.menu-cerrar:hover { background: #f0f0f0; color: #333; }

.menu-codigo {
  font-size: 10px;
  color: #888;
  padding: 4px 16px 10px;
  font-family: monospace;
  letter-spacing: 0.5px;
}

.menu-items {
  padding: 4px 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scroll sutil y elegante */
.menu-items::-webkit-scrollbar {
  width: 6px;
}

.menu-items::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0;
}

.menu-items::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
  transition: background 0.2s;
}

.menu-items::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Para Firefox */
.menu-items {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  text-align: left;
  transition: background 0.15s, transform 0.1s;
}
.menu-item:hover  { transform: translateX(2px); }
.menu-item:active { transform: scale(0.98); }

.menu-item-icono {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}
.menu-item-texto {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.menu-item-texto strong { font-size: 13px; font-weight: 600; line-height: 1.2; }
.menu-item-texto small  { font-size: 10.5px; opacity: 0.7; }

/* Detalles — gris oscuro */
.menu-item--detalles:hover                   { background: #f3f4f6; }
.menu-item--detalles .menu-item-icono        { background: #e5e7eb; color: #374151; }
.menu-item--detalles .menu-item-texto strong { color: #1f2937; }
.menu-item--detalles .menu-item-texto small  { color: #6b7280; }

/* PDF — verde */
.menu-item--pdf:hover                   { background: #e8f8f0; }
.menu-item--pdf .menu-item-icono        { background: #e0f5ea; color: #1a8a50; }
.menu-item--pdf .menu-item-texto strong { color: #1a7a45; }
.menu-item--pdf .menu-item-texto small  { color: #2ecc71; }

/* Verificar — amarillo/warning */
.menu-item--verificar:hover                   { background: #fef3c7; }
.menu-item--verificar .menu-item-icono        { background: #fde68a; color: #d97706; }
.menu-item--verificar .menu-item-texto strong { color: #b45309; }
.menu-item--verificar .menu-item-texto small  { color: #f59e0b; }

/* En Proceso — azul */
.menu-item--proceso:hover                   { background: #dbeafe; }
.menu-item--proceso .menu-item-icono        { background: #bfdbfe; color: #046AE7; }
.menu-item--proceso .menu-item-texto strong { color: #1e40af; }
.menu-item--proceso .menu-item-texto small  { color: #3b82f6; }

/* Despachar — verde éxito */
.menu-item--despachar:hover                   { background: #d1fae5; }
.menu-item--despachar .menu-item-icono        { background: #a7f3d0; color: #059669; }
.menu-item--despachar .menu-item-texto strong { color: #047857; }
.menu-item--despachar .menu-item-texto small  { color: #10b981; }

/* Empacar — morado */
.menu-item--empacar:hover                   { background: #ede9fe; }
.menu-item--empacar .menu-item-icono        { background: #ddd6fe; color: #7c3aed; }
.menu-item--empacar .menu-item-texto strong { color: #6d28d9; }
.menu-item--empacar .menu-item-texto small  { color: #8b5cf6; }

/* Cambiar Estado — gris */
.menu-item--cambiar-estado:hover                   { background: #f3f4f6; }
.menu-item--cambiar-estado .menu-item-icono        { background: #e5e7eb; color: #4b5563; }
.menu-item--cambiar-estado .menu-item-texto strong { color: #374151; }
.menu-item--cambiar-estado .menu-item-texto small  { color: #6b7280; }

/* Escaneos — naranja */
.menu-item--escaneos:hover                   { background: #ffedd5; }
.menu-item--escaneos .menu-item-icono        { background: #fed7aa; color: #ea580c; }
.menu-item--escaneos .menu-item-texto strong { color: #c2410c; }
.menu-item--escaneos .menu-item-texto small  { color: #f97316; }

/* ═══════════════════════════════════════════════════
   TRANSITION: menu-slide (Vue 2)
═══════════════════════════════════════════════════ */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.menu-slide-enter,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

/* ═══════════════════════════════════════════════════
   ESTILOS: Sección Limpiar Pendiente
═══════════════════════════════════════════════════ */
.seccion-limpiar-pendiente {
    margin-top: 2rem;
    padding: 1.5rem;
    border-top: 3px solid #ff9f43;
    background: #fff9f0;
    border-radius: 8px;
}

.header-limpiar {
    margin-bottom: 1.5rem;
}

.titulo-limpiar {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ff9f43;
    margin-bottom: 0.5rem;
}

.descripcion-limpiar {
    font-size: 0.9rem;
    color: #6c757d;
    margin: 0;
}

.controles-limpiar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
    flex-wrap: wrap;
}

.buscador-items {
    flex: 1;
    min-width: 250px;
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 0 0.75rem;
}

.buscador-items i {
    color: #6c757d;
    margin-right: 0.5rem;
}

.input-buscar-items {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.75rem 0;
    font-size: 0.9rem;
}

.filtros-items {
    display: flex;
    gap: 1.5rem;
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.checkbox-todos {
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.tabla-items-limpiar {
    max-height: 300px;
    overflow-y: auto;
    background: white;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.tabla-items-limpiar table {
    width: 100%;
    border-collapse: collapse;
}

.tabla-items-limpiar thead {
    position: sticky;
    top: 0;
    background: #f8f9fa;
    z-index: 1;
}

.tabla-items-limpiar th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.85rem;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
}

.tabla-items-limpiar td {
    padding: 0.75rem;
    border-bottom: 1px solid #f1f3f5;
}

.fila-deshabilitada {
    background: #f8f9fa;
    opacity: 0.6;
}

.codigo-producto {
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    font-weight: 600;
}

.nombre-producto {
    font-size: 0.9rem;
}

.alerta-seleccion {
    margin-top: 1rem;
}

.botones-accion {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.sin-resultados {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}

.sin-resultados i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
}

.sin-resultados p {
    margin: 0;
    font-size: 0.9rem;
}

.mensaje-no-limpiar {
    margin-top: 1rem;
}

.mensaje-no-limpiar p {
    margin: 0.5rem 0 0 0;
    font-size: 0.9rem;
}

</style>
