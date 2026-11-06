<template>
<div>
    <!-- Popup de NC Perseo (ver detalle de una NC ya generada) -->
    <vs-popup title="Detalle Nota de Crédito Perseo" :active.sync="showModalNCPerseo">
        <div class="p-4" v-if="ncPerseoData">
            <div class="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500">
                <p class="text-sm"><strong>NC:</strong> {{ ncPerseoData.establecimiento }}-{{ ncPerseoData.puntoemision }}-{{ ncPerseoData.secuencial }}</p>
                <p class="text-sm"><strong>Emisión:</strong> {{ ncPerseoData.emision }}</p>
                <p class="text-sm"><strong>Cliente:</strong> {{ ncPerseoData.razonsocial }} ({{ ncPerseoData.identificacion }})</p>
            </div>
            <vs-table :data="(ncPerseoData.facturasd && ncPerseoData.facturasd.detalles) ? ncPerseoData.facturasd.detalles : []" stripe>
                <template slot="thead">
                    <vs-th>Producto</vs-th>
                    <vs-th>Cant.</vs-th>
                    <vs-th>Precio</vs-th>
                    <vs-th>Desc.</vs-th>
                    <vs-th>Total</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="i" v-for="(det, i) in data">
                        <vs-td>{{ det.nombreproducto }}<br><small class="text-gray-500">{{ det.productocodigo }}</small></vs-td>
                        <vs-td>{{ parseFloat(det.cantidad || 0).toFixed(2) }}</vs-td>
                        <vs-td>${{ parseFloat(det.precio || 0).toFixed(2) }}</vs-td>
                        <vs-td>{{ parseFloat(det.descuento || 0).toFixed(2) }}%</vs-td>
                        <vs-td class="font-bold">${{ ((parseFloat(det.cantidad || 0) * parseFloat(det.precio || 0)) * (1 - parseFloat(det.descuento || 0) / 100)).toFixed(2) }}</vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <vs-divider />
            <div class="flex justify-between text-sm mt-2">
                <span>Subtotal:</span><strong>${{ parseFloat(ncPerseoData.subtotal || 0).toFixed(2) }}</strong>
            </div>
            <div class="flex justify-between text-sm">
                <span>Descuento:</span><strong>${{ parseFloat(ncPerseoData.total_descuento || 0).toFixed(2) }}</strong>
            </div>
            <div class="flex justify-between text-sm">
                <span>IVA:</span><strong>${{ parseFloat(ncPerseoData.total_iva || 0).toFixed(2) }}</strong>
            </div>
            <div class="flex justify-between font-bold text-base mt-2 pt-2" style="border-top:2px solid #ddd;">
                <span>Total:</span><span class="text-success">${{ parseFloat(ncPerseoData.total || 0).toFixed(2) }}</span>
            </div>
        </div>
    </vs-popup>

    <!-- Popup confirmación generar NC (evita que quede detrás del popup padre) -->
    <vs-popup title="Confirmar Generación" :active.sync="showConfirmNC">
        <div class="p-4 text-center">
            <p class="mb-4 text-base">¿Generar Nota de Crédito para el documento</p>
            <p class="font-bold text-primary mb-5">DOC. VEN: {{ grupoActivo ? grupoActivo.documento_venta : '' }}</p>
            <p class="font-bold text-danger mb-5">FACT. PERSEO: {{ grupoActivo ? grupoActivo.factura_perseo : '' }}</p>
            <div class="flex justify-center gap-3">
                <vs-button color="danger" type="border" @click="showConfirmNC = false">Cancelar</vs-button>
                <vs-button color="success" @click="showConfirmNC = false; ejecutarGenerarNC()">Confirmar</vs-button>
            </div>
        </div>
    </vs-popup>

    <!-- Vista principal dentro del popup padre (no abre popup nuevo) -->
    <vs-popup
        title="Generación de Notas de Crédito"
        :active.sync="popupActivo"
        fullscreen
    >
        <div class="p-4" v-if="popupActivo">

            <!-- ============================================================
                 VISTA 0: LISTA DE DOCUMENTOS DE VENTA
            ============================================================ -->
            <div v-if="vista === 0">
                <!-- Header del documento de devolución -->
                <div class="mb-4">
                    <h4 class="font-bold text-primary mb-2">{{ ObjectSelected.ven_codigo }}</h4>
                    <p class="text-sm text-gray-600">Cliente: {{ ObjectSelected.nombreInstitucion }}</p>
                    <p class="text-sm text-gray-600">Período: {{ ObjectSelected.periodoescolar }}</p>
                    <p class="text-sm text-gray-600">Doc. Bodega: {{ ObjectSelected.codigo_devolucion }}</p>
                    <p class="text-sm text-gray-600">Empresa: {{ ObjectSelected.empresa }}</p>
                    <p v-if="totalPendienteGlobal > 0" class="text-warning font-bold mt-2">Estado: {{ totalPendienteGlobal }} pendientes</p>
                    <p v-else class="text-success font-bold mt-2">Estado: Todo enviado</p>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="mb-4">
                    <div class="skeleton-container">
                        <div class="skeleton-header mb-4"></div>
                        <div class="skeleton-line mb-3"></div>
                        <div class="skeleton-line mb-3"></div>
                        <div class="skeleton-line-short"></div>
                    </div>
                </div>

                <div v-else-if="grupos.length === 0" class="text-center py-8 text-gray-600">
                    <p>No hay documentos de venta con factura Perseo vinculados a esta devolución.</p>
                </div>

                <!-- Tabla de grupos -->
                <vs-table v-else :data="grupos" stripe pagination max-items="10">
                    <template slot="header">
                        <span class="table-badge badge-primary">
                            <i class="feather icon-list mr-1"></i>
                            Documentos: <b>{{ grupos.length }}</b>
                        </span>
                        <span class="table-badge badge-success ml-2" v-if="totalPendienteGlobal === 0">
                            <i class="feather icon-check-circle mr-1"></i>
                            Todo enviado
                        </span>
                        <span class="table-badge badge-warning ml-2" v-else>
                            <i class="feather icon-alert-circle mr-1"></i>
                            <b>{{ totalPendienteGlobal }}</b> pendientes
                        </span>
                    </template>
                    <template slot="thead">
                        <vs-th style="width: 30%;">
                            <i class="feather icon-file-text mr-1"></i>
                            Documento
                        </vs-th>
                        <vs-th style="width: 25%;">
                            <i class="feather icon-database mr-1"></i>
                            Estado Perseo
                        </vs-th>
                        <vs-th style="width: 25%;">
                            <i class="feather icon-file-text mr-1"></i>
                            Notas de Crédito
                        </vs-th>
                        <vs-th style="width: 20%;" class="text-center">
                            <i class="feather icon-settings mr-1"></i>
                            Acción
                        </vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="i" v-for="(grupo, i) in data">
                            <!-- COLUMNA 1: DOCUMENTO -->
                            <vs-td>
                                <div class="cell-wrapper">
                                    <!-- Badge número -->
                                    <div class="mb-2">
                                        <span class="inline-badge badge-primary" style="font-size: 10px;">#{{ i + 1 }}</span>
                                    </div>
                                    
                                    <!-- Documento principal -->
                                    <div class="mb-3">
                                        <strong class="font-mono text-primary" style="font-size: 15px;">{{ grupo.documento_venta }}</strong>
                                    </div>
                                    
                                    <!-- Factura Perseo -->
                                    <div class="info-section">
                                        <div class="info-item">
                                            <i class="feather icon-file" style="color: #3b82f6; font-size: 12px;"></i>
                                            <span class="label-text">Factura:</span>
                                            <span v-if="grupo.factura_perseo" class="value-text">{{ grupo.factura_perseo }}</span>
                                            <span v-else class="text-gray-400 italic" style="font-size: 11px;">Sin Factura</span>
                                        </div>
                                        <div class="info-item">
                                            <i class="feather icon-dollar-sign" style="color: #10b981; font-size: 12px;"></i>
                                            <span class="label-text">Valor:</span>
                                            <strong class="text-gray-700">${{ parseFloat(grupo.total || 0).toFixed(2) }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </vs-td>

                            <!-- COLUMNA 2: ESTADO PERSEO -->
                            <vs-td>
                                <div class="cell-wrapper">
                                    <!-- Resumen de cantidades -->
                                    <div class="summary-container">
                                        <div class="summary-line">
                                            <span>TOTAL</span>
                                            <strong>{{ parseFloat(grupo.cantidad || 0).toFixed(0) }}</strong>
                                        </div>
                                        <div class="summary-line" style="color: #16a34a;">
                                            <span>ENVIADA</span>
                                            <strong>{{ parseFloat(grupo.cantidad_nc_enviada || 0).toFixed(0) }}</strong>
                                        </div>
                                        <div class="summary-line" :style="{ color: parseFloat(grupo.cantidad_pendiente || 0) > 0 ? '#f59e0b' : '#16a34a' }">
                                            <span>PENDIENTE</span>
                                            <strong>{{ parseFloat(grupo.cantidad_pendiente || 0).toFixed(0) }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </vs-td>

                            <!-- COLUMNA 3: NOTAS DE CRÉDITO -->
                            <vs-td>
                                <div class="cell-wrapper">
                                    <div v-if="grupo.nota_credito" style="display: flex; flex-direction: column; gap: 4px;">
                                        <span
                                            v-for="(nc, idx) in String(grupo.nota_credito).split(',').map(s=>s.trim()).filter(Boolean).slice(0, 3)"
                                            :key="idx"
                                            class="inline-badge badge-success"
                                            style="font-size: 10px; width: fit-content;"
                                        >
                                            {{ nc }}
                                        </span>
                                        <span 
                                            v-if="String(grupo.nota_credito).split(',').filter(Boolean).length > 3"
                                            class="text-xs text-gray-500 italic"
                                        >
                                            +{{ String(grupo.nota_credito).split(',').filter(Boolean).length - 3 }} más
                                        </span>
                                    </div>
                                    <span v-else class="text-gray-400 text-sm italic">Sin NC generadas</span>
                                </div>
                            </vs-td>

                            <!-- COLUMNA 4: ACCIÓN -->
                            <vs-td class="text-center">
                                <div class="cell-wrapper" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                    <!-- Badge informativo si NO tiene fecha_envio_perseo -->
                                    <div v-if="!grupo.fecha_envio_perseo" class="plataforma-badge-small">
                                        <i class="feather icon-info"></i>
                                        <span>Solo plataforma</span>
                                    </div>
                                    
                                    <!-- Botón Ver -->
                                    <vs-button
                                        size="small"
                                        color="primary"
                                        icon-pack="feather"
                                        icon="icon-eye"
                                        @click="abrirVer(grupo)"
                                        style="width: 100%;">
                                        Ver
                                    </vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>

            <!-- ============================================================
                 VISTA 1: DETALLE DE UN DOCUMENTO DE VENTA (igual a ListaDevoluciones)
            ============================================================ -->
            <div v-else-if="vista === 1 && grupoActivo">

                <!-- Botón volver -->
                <div class="mb-4">
                    <vs-button color="primary" type="border" icon-pack="feather" icon="icon-arrow-left" @click="volverLista">
                        Volver al listado
                    </vs-button>
                </div>

                <!-- Header mejorado -->
                <div class="mb-4">
                    <div class="flex items-start justify-between flex-wrap gap-4">
                        <!-- Información del documento -->
                        <div class="flex-1">
                            <h4 class="font-bold text-primary mb-2">{{ grupoActivo.documento_venta }}</h4>
                            <p class="text-sm text-gray-600">Factura Perseo: {{ grupoActivo.factura_perseo || '—' }}</p>
                            <p class="text-sm text-gray-600">Nota Crédito: {{ grupoActivo.nota_credito || '—' }}</p>
                            <p v-if="grupoActivo.nota_credito" :class="grupoActivo.nc_pendiente ? 'text-warning' : 'text-success'">
                                Estado: {{ grupoActivo.nc_pendiente ? 'Con pendientes' : 'Enviada a Perseo' }}
                            </p>
                            
                            <!-- Badge informativo si NO tiene fecha_envio_perseo -->
                            <div v-if="!grupoActivo.fecha_envio_perseo" class="info-alert-box">
                                <div class="info-alert-icon">
                                    <i class="feather icon-info"></i>
                                </div>
                                <div class="info-alert-content">
                                    <strong class="info-alert-title">Devolución solo en plataforma</strong>
                                    <p class="info-alert-text">Esta devolución aún no ha sido enviada a Perseo. No es posible generar Notas de Crédito hasta que se envíe.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Resumen simple -->
                        <div v-if="grupoActivo.fecha_envio_perseo" class="flex gap-3 flex-wrap">
                            <div class="text-center px-3 py-2 bg-gray-50 rounded border">
                                <div class="text-xs text-gray-500">Total dev.</div>
                                <div class="font-bold text-lg">{{ parseFloat(grupoActivo.cantidad || 0).toFixed(0) }}</div>
                            </div>
                            <div class="text-center px-3 py-2 bg-green-50 rounded border border-green-200">
                                <div class="text-xs text-gray-500">Enviado NC</div>
                                <div class="font-bold text-lg text-success">{{ parseFloat(grupoActivo.cantidad_nc_enviada || 0).toFixed(0) }}</div>
                            </div>
                            <div class="text-center px-3 py-2 rounded border" :class="parseFloat(grupoActivo.cantidad_pendiente || 0) > 0 ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-200'">
                                <div class="text-xs text-gray-500">Pendiente</div>
                                <div class="font-bold text-lg" :class="parseFloat(grupoActivo.cantidad_pendiente || 0) > 0 ? 'text-warning' : 'text-success'">
                                    {{ parseFloat(grupoActivo.cantidad_pendiente || 0).toFixed(0) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div v-if="grupoActivo.fecha_envio_perseo" class="flex gap-2 flex-wrap justify-end mt-3">
                        <vs-button
                            v-if="userRoot && grupoActivo.nc_pendiente"
                            color="warning"
                            type="border"
                            :disabled="loadingNC"
                            @click="previsualizarNC"
                            icon-pack="feather"
                            icon="icon-eye">
                            {{ loadingNC ? 'Procesando...' : 'Vista previa NC' }}
                        </vs-button>

                        <vs-button
                            color="success"
                            :disabled="loadingNC || !grupoActivo.nc_pendiente"
                            @click="confirmarGenerarNC"
                            icon-pack="feather"
                            icon="icon-file-text">
                            {{ loadingNC ? 'Generando...' : 'Generar Nota de Crédito' }}
                        </vs-button>
                    </div>
                </div>

                <!-- NCs ya generadas -->
                <div v-if="grupoActivo.nota_credito" class="bg-green-50 border-2 border-green-300 rounded p-4 mb-4">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-green-700 font-bold mb-2">
                                ✓ {{ String(grupoActivo.nota_credito).split(',').filter(Boolean).length > 1
                                    ? String(grupoActivo.nota_credito).split(',').filter(Boolean).length + ' Notas de Crédito generadas'
                                    : 'Nota de Crédito generada' }}
                            </p>
                            <div v-for="(nc, idx) in String(grupoActivo.nota_credito).split(',').map(s=>s.trim()).filter(Boolean)" :key="idx" class="mb-1">
                                <span class="text-green-600 text-sm font-semibold">NC {{ idx+1 }}: <span class="font-mono font-bold">{{ nc }}</span></span>
                            </div>
                        </div>
                        <vs-button
                            v-if="userRoot && listaIdsNC.length > 0"
                            color="warning"
                            :disabled="loadingVerNC"
                            @click="verNCEnPerseo(listaIdsNC[listaIdsNC.length - 1])"
                            icon-pack="feather"
                            :icon="loadingVerNC ? 'icon-loader' : 'icon-eye'"
                        >
                            {{ loadingVerNC ? 'Cargando...' : 'Ver última NC' }}
                        </vs-button>
                    </div>
                </div>

                <!-- Empresa (solo root con pendientes y si tiene fecha_envio_perseo) -->
                <div class="mb-4" v-if="userRoot && grupoActivo.nc_pendiente && grupoActivo.fecha_envio_perseo">
                    <label class="block text-xs text-gray-600 mb-1">Empresa para esta NC (ID)</label>
                    <input type="number" v-model.number="empresaNC" class="border rounded px-3 py-2 text-sm" style="width: 160px;" />
                    <p class="text-xs text-gray-500 mt-1">Por defecto se usa la empresa del documento</p>
                </div>

                <!-- Tabla ítems pendientes -->
                <div v-if="detallesEdicion.length > 0 || (grupoActivo.arrayCodigos && grupoActivo.arrayCodigos.length > 0)">
                    <!-- Root: editable (solo si tiene fecha_envio_perseo) -->
                    <vs-table v-if="userRoot && grupoActivo.fecha_envio_perseo" :data="detallesEdicion" stripe>
                        <template slot="thead">
                            <vs-th>Incluir</vs-th>
                            <vs-th>Código</vs-th>
                            <vs-th>Nombre</vs-th>
                            <vs-th>Total Dev.</vs-th>
                            <vs-th>Ya en NC</vs-th>
                            <vs-th>Pendiente</vs-th>
                            <vs-th>Cód. NC</vs-th>
                            <vs-th>Cant. NC</vs-th>
                            <vs-th>Precio</vs-th>
                            <vs-th>Desc. %</vs-th>
                            <vs-th>Total NC</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="i" v-for="(item, i) in data">
                                <vs-td><vs-checkbox color="success" v-model="item.incluir_nc" /></vs-td>
                                <vs-td>{{ item.pro_codigo }}</vs-td>
                                <vs-td>{{ item.nombrelibro || item.pro_nombre || '—' }}</vs-td>
                                <vs-td class="text-gray-500">{{ parseFloat(item.cantidad_devolucion || 0).toFixed(0) }}</vs-td>
                                <vs-td class="text-orange-600">{{ parseFloat(item.cantidad_ya_en_nc || 0).toFixed(0) }}</vs-td>
                                <vs-td class="font-bold text-primary">{{ parseFloat(item.cantidad_pendiente || 0).toFixed(0) }}</vs-td>
                                <vs-td>
                                    <input type="text" class="border rounded px-2 py-1 text-sm" style="width:120px" v-model.trim="item.pro_codigo_nc" />
                                </vs-td>
                                <vs-td>
                                    <input type="number" step="0.01" min="0" class="border rounded px-2 py-1 text-sm" style="width:80px" v-model.number="item.cantidad_nc" />
                                </vs-td>
                                <vs-td>${{ parseFloat(item.precio || 0).toFixed(2) }}</vs-td>
                                <vs-td class="text-orange-600">{{ parseFloat(item.descuento || 0).toFixed(2) }}%</vs-td>
                                <vs-td class="font-bold text-success">
                                    ${{ ((parseFloat(item.cantidad_nc || 0) * parseFloat(item.precio || 0)) * (1 - parseFloat(item.descuento || 0) / 100)).toFixed(2) }}
                                </vs-td>
                            </vs-tr>
                            <vs-tr class="font-bold" style="background:#f5f5f5;">
                                <vs-td colspan="9">TOTAL NC</vs-td>
                                <vs-td></vs-td>
                                <vs-td class="font-bold text-success">${{ resumenNC.totalNC }}</vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>

                    <!-- No root o sin fecha_envio_perseo: solo lectura -->
                    <div v-else>
                        <vs-table :data="grupoActivo.fecha_envio_perseo ? detallesEdicion : grupoActivo.arrayCodigos" stripe>
                            <template slot="thead">
                                <vs-th>Código</vs-th>
                                <vs-th>Nombre</vs-th>
                                <vs-th>Cantidad</vs-th>
                                <vs-th>Precio</vs-th>
                                <vs-th>Desc. %</vs-th>
                                <vs-th>Subtotal</vs-th>
                                <vs-th>Total</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="i" v-for="(item, i) in data">
                                    <vs-td class="font-mono text-xs text-gray-500">{{ item.pro_codigo }}</vs-td>
                                    <vs-td class="font-semibold">{{ item.nombrelibro || item.pro_nombre || '—' }}</vs-td>
                                    <vs-td class="text-center font-bold text-primary">{{ parseFloat(grupoActivo.fecha_envio_perseo ? item.cantidad_nc : item.cantidad || 0).toFixed(0) }}</vs-td>
                                    <vs-td>${{ parseFloat(item.precio || 0).toFixed(2) }}</vs-td>
                                    <vs-td class="text-orange-600">{{ parseFloat(item.descuento || 0).toFixed(2) }}%</vs-td>
                                    <vs-td>${{ (parseFloat(grupoActivo.fecha_envio_perseo ? item.cantidad_nc : item.cantidad || 0) * parseFloat(item.precio || 0)).toFixed(2) }}</vs-td>
                                    <vs-td class="font-bold text-success">
                                        ${{ ((parseFloat(grupoActivo.fecha_envio_perseo ? item.cantidad_nc : item.cantidad || 0) * parseFloat(item.precio || 0)) * (1 - parseFloat(item.descuento || 0) / 100)).toFixed(2) }}
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                        <!-- Resumen (solo si tiene fecha_envio_perseo) -->
                        <div v-if="grupoActivo.fecha_envio_perseo" class="mt-4 flex justify-end">
                            <div style="width:280px">
                                <div class="flex justify-between py-2 border-b text-sm">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="font-semibold">${{ resumenNC.subtotal }}</span>
                                </div>
                                <div class="flex justify-between py-2 border-b text-sm">
                                    <span class="text-gray-600">Descuentos</span>
                                    <span class="font-semibold text-orange-600">- ${{ resumenNC.descuentos }}</span>
                                </div>
                                <div class="flex justify-between py-3 font-bold text-base">
                                    <span>Total Nota de Crédito</span>
                                    <span class="text-success">${{ resumenNC.totalNC }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Resumen simple cuando NO tiene fecha_envio_perseo -->
                        <div v-else class="mt-4 flex justify-end">
                            <div style="width:280px">
                                <div class="flex justify-between py-2 border-b text-sm">
                                    <span class="text-gray-600">Total artículos</span>
                                    <span class="font-semibold">{{ parseFloat(grupoActivo.cantidad || 0).toFixed(0) }}</span>
                                </div>
                                <div class="flex justify-between py-3 font-bold text-base">
                                    <span>Valor total</span>
                                    <span class="text-primary">${{ parseFloat(grupoActivo.total || 0).toFixed(2) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-8 text-gray-500">
                    <span v-if="grupoActivo.nota_credito && !grupoActivo.nc_pendiente">✓ Todos los ítems ya fueron procesados en NCs anteriores.</span>
                    <span v-else>No hay ítems para este documento.</span>
                </div>

                <!-- Preview payload (solo root) -->
                <div v-if="userRoot && previewPayload" class="mt-4 bg-gray-900 text-gray-100 rounded p-3">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold">Vista previa del payload</span>
                        <vs-button size="small" color="dark" type="flat" @click="previewPayload = null">✕</vs-button>
                    </div>
                    <pre class="text-xs overflow-auto whitespace-pre-wrap" style="max-height:280px;">{{ JSON.stringify(previewPayload, null, 2) }}</pre>
                </div>
            </div>

        </div>
    </vs-popup>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'DevolucionGenerarNC',
    props: {
        ObjectSelected: { type: Object, default: () => ({}) },
        arrayDetallesAgrupados: { type: Array, default: () => [] }
    },
    data() {
        return {
            popupActivo:      false,
            vista:            0,      // 0 = lista, 1 = detalle
            loading:          false,
            loadingNC:        false,
            loadingVerNC:     false,  // Loading para botón Ver NC
            grupos:           [],
            grupoActivo:      null,
            detallesEdicion:  [],
            empresaNC:        null,
            previewPayload:   null,
            // popup NC Perseo
            showModalNCPerseo: false,
            ncPerseoData:     null,
            // popup confirmación (evita quedar detrás del popup padre)
            showConfirmNC:    false,
        };
    },
    computed: {
        ...mapState(['userRoot']),

        totalPendienteGlobal() {
            return this.grupos.reduce((s, g) => s + parseFloat(g.cantidad_pendiente || 0), 0);
        },

        listaIdsNC() {
            if (!this.grupoActivo || !this.grupoActivo.id_nota_credito_perseo) return [];
            return String(this.grupoActivo.id_nota_credito_perseo).split(',').map(s => s.trim()).filter(Boolean);
        },

        resumenNC() {
            let subtotal = 0, totalNC = 0;
            (this.detallesEdicion || []).forEach(item => {
                if (!item.incluir_nc) return;
                const cant   = parseFloat(item.cantidad_nc || 0);
                const precio = parseFloat(item.precio || 0);
                const desc   = parseFloat(item.descuento || 0);
                const s = cant * precio;
                subtotal += s;
                totalNC  += s * (1 - desc / 100);
            });
            return {
                subtotal:   subtotal.toFixed(2),
                descuentos: (subtotal - totalNC).toFixed(2),
                totalNC:    totalNC.toFixed(2),
            };
        },
    },
    watch: {
        popupActivo(val) {
            if (val) this.inicializar();
            else this.limpiar();
        }
    },
    methods: {
        abrir() {
            this.popupActivo = true;
        },

        limpiar() {
            this.vista       = 0;
            this.grupos      = [];
            this.grupoActivo = null;
            this.detallesEdicion = [];
            this.previewPayload  = null;
        },

        async inicializar() {
            let me = this;
            me.loading = true;
            me.vista   = 0;
            me.grupos  = [];

            const gruposBase = (me.arrayDetallesAgrupados || [])
                .filter(g => g.documento_venta && g.documento_venta !== 'Sin Documento');

            if (gruposBase.length === 0) {
                me.loading = false;
                return;
            }

            const promesas = gruposBase.map(g => me.consultarEstadoGrupo(g));
            me.grupos  = await Promise.all(promesas);
            me.loading = false;
        },

        async consultarEstadoGrupo(grupo) {
            let me = this;
            try {
                const res = await me.$http.get(
                    me.$server_url + 'api/perseo/ventas-lista/devolucion-detalle?ven_codigo=' + grupo.documento_venta
                );
                if (res.data && res.data.status === 'success') {
                    const base     = res.data.data.devolucion_base || {};
                    const detalles = res.data.data.detalles || [];
                    let enviada = 0, pendiente = 0;
                    const mapEnviado = {};
                    detalles.forEach(d => {
                        const ya  = parseFloat(d.cantidad_ya_en_nc || 0);
                        const pnd = parseFloat(d.cantidad_pendiente !== undefined ? d.cantidad_pendiente : Math.max(0, parseFloat(d.cantidad_devolucion || d.cantidad || 0) - ya));
                        enviada   += ya;
                        pendiente += pnd;
                        mapEnviado[d.pro_codigo] = ya;
                    });
                    // enriquecer arrayCodigos con cantidad_nc_enviada
                    const codigosEnriquecidos = (grupo.arrayCodigos || []).map(item => ({
                        ...item,
                        cantidad_nc_enviada: mapEnviado[item.pro_codigo] || 0,
                    }));
                    return {
                        ...grupo,
                        fecha_envio_perseo:         base.fecha_envio_perseo || null,
                        arrayCodigos:         codigosEnriquecidos,
                        nota_credito:         base.nota_credito || null,
                        id_nota_credito_perseo: base.id_nota_credito_perseo || null,
                        empresa_id:           base.empresa_id || null,
                        nc_pendiente:         res.data.data.hay_pendientes !== undefined ? res.data.data.hay_pendientes : pendiente > 0,
                        cantidad_nc_enviada:  enviada,
                        cantidad_pendiente:   pendiente,
                    };
                }
            } catch (_) {}
            // fallback
            return {
                ...grupo,
                nota_credito:        null,
                id_nota_credito_perseo: null,
                empresa_id:          null,
                nc_pendiente:        true,
                cantidad_nc_enviada: 0,
                cantidad_pendiente:  grupo.cantidad || 0,
            };
        },

        abrirVer(grupo) {
            let me = this;
            me.grupoActivo    = grupo;
            me.empresaNC      = grupo.empresa_id;
            me.previewPayload = null;
            me.detallesEdicion = me.construirDetallesEdicion(grupo);
            me.vista = 1;
        },

        construirDetallesEdicion(grupo) {
            return (grupo.arrayCodigos || []).map(item => {
                const cantTotal = parseFloat(item.cantidad || 0);
                const yaEnNC    = parseFloat(item.cantidad_nc_enviada || 0);
                const pendiente = Math.max(0, cantTotal - yaEnNC);
                return {
                    ...item,
                    incluir_nc:          pendiente > 0,
                    pro_codigo_nc:       item.pro_codigo,
                    cantidad_nc:         pendiente,
                    precio:              parseFloat(item.precio || 0),
                    descuento:           parseFloat(item.descuento || 0),
                    cantidad_devolucion: cantTotal,
                    cantidad_ya_en_nc:   yaEnNC,
                    cantidad_pendiente:  pendiente,
                };
            }).filter(item => item.cantidad_pendiente > 0);
        },

        volverLista() {
            this.vista        = 0;
            this.grupoActivo  = null;
            this.detallesEdicion = [];
            this.previewPayload  = null;
        },

        buildPayload(enviar) {
            let me = this;
            const payload = {
                ven_codigo:  me.grupoActivo.documento_venta,
                empresa:     me.empresaNC || me.grupoActivo.empresa_id,
                enviar:      enviar,
                usuario_id:  me.$store.state.usuario ? me.$store.state.usuario.idusuario : 0,
            };
            if (me.userRoot) {
                const detalles = (me.detallesEdicion || []).filter(d => d.incluir_nc && d.cantidad_nc > 0).map(d => ({
                    pro_codigo:    d.pro_codigo_nc || d.pro_codigo,
                    cantidad:      d.cantidad_nc,
                    descuento:     d.descuento || 0,
                }));
                if (detalles.length > 0) payload.detalles_override = detalles;
            }
            return payload;
        },

        async previsualizarNC() {
            let me = this;
            me.loadingNC      = true;
            me.previewPayload = null;
            try {
                const res = await me.$http.post(
                    me.$server_url + 'api/perseo/ventas-lista/devolucion-nota-credito',
                    me.buildPayload(0)
                );
                me.previewPayload = res.data;
            } catch (e) {
                me.$vs.notify({ title: 'Error', text: 'Error al generar vista previa', color: 'danger' });
            } finally {
                me.loadingNC = false;
            }
        },

        confirmarGenerarNC() {
            // Usar vs-popup propio en lugar de $vs.dialog que queda detrás de los popups padre
            this.showConfirmNC = true;
        },

        async ejecutarGenerarNC() {
            let me = this;
            me.loadingNC = true;
            me.$vs.loading();
            try {
                const res = await me.$http.post(
                    me.$server_url + 'api/perseo/ventas-lista/devolucion-nota-credito',
                    me.buildPayload(1)
                );
                me.$vs.loading.close();
                
                const status = res.data.status;
                const ok = res.data.resumen ? res.data.resumen.procesados_ok || 0 : 0;
                const errores = res.data.resumen ? res.data.resumen.procesados_error || 0 : 0;
                
                // Caso 1: Éxito total
                if (status === 'success' && ok > 0 && errores === 0) {
                    me.$vs.notify({ 
                        title: 'Éxito', 
                        text: res.data.message || 'Nota de crédito generada correctamente', 
                        color: 'success', 
                        iconPack: 'feather', 
                        icon: 'icon-check' 
                    });
                    
                    // Recargar estado del grupo activo y la lista
                    const grupoActualizado = await me.consultarEstadoGrupo(me.grupoActivo);
                    me.grupoActivo = grupoActualizado;
                    me.detallesEdicion = me.construirDetallesEdicion(grupoActualizado);
                    me.previewPayload  = null;
                    
                    // Actualizar también en la lista
                    const idx = me.grupos.findIndex(g => g.documento_venta === grupoActualizado.documento_venta);
                    if (idx >= 0) me.$set(me.grupos, idx, grupoActualizado);
                }
                // Caso 2: Éxito parcial
                else if (status === 'partial_success' && ok > 0) {
                    me.$vs.notify({ 
                        title: 'Advertencia', 
                        text: res.data.message || `Se procesaron ${ok} documentos correctamente, pero ${errores} fallaron`, 
                        color: 'warning',
                        iconPack: 'feather', 
                        icon: 'icon-alert-triangle',
                        time: 8000
                    });
                    
                    // Mostrar detalles de errores si hay
                    if (res.data.data && Array.isArray(res.data.data)) {
                        const erroresDetallados = res.data.data.filter(r => r.status === 0);
                        if (erroresDetallados.length > 0) {
                            const mensajesError = erroresDetallados.map(e => 
                                `${e.ven_codigo}: ${e.message}`
                            ).join('\n');
                            console.error('Errores en NC:', mensajesError);
                        }
                    }
                    
                    // Recargar estado
                    const grupoActualizado = await me.consultarEstadoGrupo(me.grupoActivo);
                    me.grupoActivo = grupoActualizado;
                    me.detallesEdicion = me.construirDetallesEdicion(grupoActualizado);
                    me.previewPayload  = null;
                    
                    const idx = me.grupos.findIndex(g => g.documento_venta === grupoActualizado.documento_venta);
                    if (idx >= 0) me.$set(me.grupos, idx, grupoActualizado);
                }
                // Caso 3: Error total
                else {
                    let msg = res.data.message || 'Error al generar la NC';
                    
                    // Intentar obtener mensaje de error más específico del primer documento que falló
                    if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                        const primerError = res.data.data.find(r => r.status === 0);
                        if (primerError && primerError.message) {
                            msg = primerError.message;
                            
                            // Detectar error específico de Perseo y mostrar mensaje más claro
                            if (primerError.respuesta_perseo && primerError.respuesta_perseo.message) {
                                const perseoMsg = primerError.respuesta_perseo.message;
                                if (perseoMsg.includes('Error HTTP') || perseoMsg.includes('foreign key constraint fails')) {
                                    msg = 'Error al enviar a Perseo: El sistema Perseo rechazó la nota de crédito. Verifique la configuración de forma de pago y datos de la factura base.';
                                } else {
                                    msg = `Error en Perseo: ${perseoMsg}`;
                                }
                            }
                        }
                    }
                    
                    me.$vs.notify({ 
                        title: 'Error al procesar NC', 
                        text: msg, 
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 10000
                    });
                }
            } catch (e) {
                me.$vs.loading.close();
                const errorMsg = e.response && e.response.data && e.response.data.message 
                    ? e.response.data.message 
                    : 'Error de conexión al generar NC';
                me.$vs.notify({ 
                    title: 'Error', 
                    text: errorMsg, 
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle'
                });
            } finally {
                me.loadingNC = false;
            }
        },

        async verNCEnPerseo(idNC) {
            let me = this;
            if (!idNC) return;
            
            me.loadingVerNC = true;
            me.$vs.loading();
            
            try {
                const empresaId = me.grupoActivo.empresa_id || me.empresaNC;
                const res = await me.$http.get(
                    me.$server_url + 'api/perseo/ventas-lista/consultar-nc-perseo?id_nota_credito_perseo=' + idNC + '&empresa=' + empresaId
                );
                me.$vs.loading.close();
                
                if (res.data.status === 'success' && res.data.data) {
                    me.ncPerseoData    = res.data.data;
                    me.showModalNCPerseo = true;
                } else {
                    me.$vs.notify({ title: 'Error', text: res.data.message || 'No se pudo consultar la NC', color: 'danger' });
                }
            } catch (e) {
                me.$vs.loading.close();
                me.$vs.notify({ title: 'Error', text: 'Error al consultar NC', color: 'danger' });
            } finally {
                me.loadingVerNC = false;
            }
        },
    }
};
</script>

<style scoped>
/* Skeleton Loader */
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

.badge-success {
    background-color: rgba(40, 199, 111, 0.15);
    color: rgb(40, 199, 111);
}

.badge-success-small {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    background-color: rgba(40, 199, 111, 0.15);
    color: rgb(40, 199, 111);
}

.badge-warning {
    background-color: rgba(255, 159, 67, 0.15);
    color: rgb(255, 159, 67);
}

.badge-dark {
    background-color: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.7);
}

.inline-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

/* Badge pequeño para "Solo plataforma" en la tabla */
.plataforma-badge-small {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background-color: #dbeafe;
    color: #1e40af;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 600;
    text-align: center;
    border: 1px solid #93c5fd;
    line-height: 1.2;
    width: 100%;
    white-space: nowrap;
}

.plataforma-badge-small i {
    font-size: 10px;
    flex-shrink: 0;
}

/* Cell wrapper para mejor estructura */
.cell-wrapper {
    padding: 4px 0;
}

/* Estilos para info items */
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
    font-size: 11px;
}

.value-text {
    color: #1e293b;
    font-weight: 500;
    font-size: 12px;
}

/* Resumen de cantidades (similar a TabDevoluciones) */
.summary-container {
    background-color: #f8fafc;
    border-radius: 6px;
    padding: 8px 10px;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: #64748b;
    margin-bottom: 6px;
}

.summary-line:last-child {
    margin-bottom: 0;
}

.summary-line strong {
    font-weight: 600;
}

/* Stat Cards */
.stat-card {
    text-align: center;
    padding: 12px 16px;
    border-radius: 8px;
    min-width: 100px;
    border: 2px solid;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-card-neutral {
    background-color: #f7fafc;
    border-color: #e2e8f0;
}

.stat-card-success {
    background-color: rgba(40, 199, 111, 0.1);
    border-color: rgba(40, 199, 111, 0.3);
}

.stat-card-warning {
    background-color: rgba(255, 159, 67, 0.1);
    border-color: rgba(255, 159, 67, 0.3);
}

.stat-label {
    font-size: 11px;
    color: #718096;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
}

.stat-card-success .stat-value {
    color: rgb(40, 199, 111);
}

.stat-card-warning .stat-value {
    color: rgb(255, 159, 67);
}

/* Colors */
.text-primary {
    color: rgba(var(--vs-primary), 1);
}

.text-success {
    color: rgb(40, 199, 111);
}

.text-warning {
    color: rgb(255, 159, 67);
}

.text-gray-400 {
    color: #cbd5e0;
}

.text-gray-500 {
    color: #a0aec0;
}

.text-gray-600 {
    color: #718096;
}

.text-gray-700 {
    color: #4a5568;
}

/* Green alert box colors */
.bg-green-50 {
    background-color: #f0fdf4;
}

.border-green-300 {
    border-color: #86efac;
}

.text-green-600 {
    color: #16a34a;
}

.text-green-700 {
    color: #15803d;
}

/* Loading icon animation */
.icon-loader {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Alert box mejorado para "Devolución solo en plataforma" */
.info-alert-box {
    display: flex;
    align-items: start;
    gap: 12px;
    background-color: #dbeafe;
    border: 2px solid #93c5fd;
    border-radius: 8px;
    padding: 16px;
    margin-top: 12px;
    margin-bottom: 16px;
}

.info-alert-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background-color: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.info-alert-content {
    flex: 1;
}

.info-alert-title {
    display: block;
    color: #1e40af;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 4px;
}

.info-alert-text {
    color: #1e3a8a;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
}
</style>
