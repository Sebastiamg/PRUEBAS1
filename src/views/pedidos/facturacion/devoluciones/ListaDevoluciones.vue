<template>
    <div>
        <!-- Popup Detalle NC Perseo -->
        <vs-popup
            title="Detalle Nota de Crédito Perseo"
            :active.sync="showModalNCPerseo"
        >
            <div class="p-4" v-if="ncPerseoData">
                <div class="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500">
                    <p class="text-sm"><strong>NC:</strong> {{ ncPerseoData.establecimiento }}-{{ ncPerseoData.puntoemision }}-{{ ncPerseoData.secuencial }}</p>
                    <p class="text-sm"><strong>Emisión:</strong> {{ ncPerseoData.emision }}</p>
                    <p class="text-sm"><strong>Cliente:</strong> {{ ncPerseoData.razonsocial }} ({{ ncPerseoData.identificacion }})</p>
                </div>

                <table class="w-full table-auto mb-4">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-3 py-2 text-left text-xs">Producto</th>
                            <th class="px-3 py-2 text-center text-xs">Cant.</th>
                            <th class="px-3 py-2 text-right text-xs">Precio</th>
                            <th class="px-3 py-2 text-right text-xs">Desc.</th>
                            <th class="px-3 py-2 text-right text-xs">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(det, idx) in (ncPerseoData.facturasd && ncPerseoData.facturasd.detalles ? ncPerseoData.facturasd.detalles : [])" :key="idx" class="border-b">
                            <td class="px-3 py-2 text-xs">
                                {{ det.nombreproducto }}<br>
                                <span class="text-gray-500">{{ det.productocodigo }}</span>
                            </td>
                            <td class="px-3 py-2 text-center text-xs">{{ parseFloat(det.cantidad || 0).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right text-xs">${{ parseFloat(det.precio || 0).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right text-xs">{{ parseFloat(det.descuento || 0).toFixed(2) }}%</td>
                            <td class="px-3 py-2 text-right text-xs font-bold">${{ ((parseFloat(det.cantidad || 0) * parseFloat(det.precio || 0)) * (1 - parseFloat(det.descuento || 0) / 100)).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="p-3 bg-gray-50 rounded">
                    <div class="flex justify-between mb-2 text-sm">
                        <span>Subtotal:</span>
                        <strong>${{ parseFloat(ncPerseoData.subtotal || 0).toFixed(2) }}</strong>
                    </div>
                    <div class="flex justify-between mb-2 text-sm">
                        <span>Descuento:</span>
                        <strong>${{ parseFloat(ncPerseoData.total_descuento || 0).toFixed(2) }}</strong>
                    </div>
                    <div class="flex justify-between mb-2 text-sm">
                        <span>IVA:</span>
                        <strong>${{ parseFloat(ncPerseoData.total_iva || 0).toFixed(2) }}</strong>
                    </div>
                    <div class="flex justify-between pt-2 border-t-2 border-gray-300 text-base">
                        <span class="font-bold">Total:</span>
                        <strong class="text-green-600">${{ parseFloat(ncPerseoData.total || 0).toFixed(2) }}</strong>
                    </div>
                </div>
            </div>
        </vs-popup>

        <!-- Popup Detalle Devolución -->
        <vs-popup
            title="Detalle Devolución"
            :active.sync="showModalDevolucion"
            fullscreen
        >
            <div class="p-4">
                <div v-if="devolucionSeleccionada" class="mb-4">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h4 class="font-bold text-primary mb-1">{{ devolucionSeleccionada.ven_codigo }}</h4>
                            <p class="text-sm text-gray-600">Contrato: {{ devolucionSeleccionada.contrato || devolucionSeleccionada.contrato_generado || '—' }}</p>
                            <p class="text-sm text-gray-600">Factura Perseo: {{ devolucionSeleccionada.factura_perseo || '—' }}</p>
                            <p class="text-sm text-gray-600">Nota Crédito: {{ devolucionSeleccionada.nota_credito || '—' }}</p>
                            <p v-if="devolucionSeleccionada.nota_credito" :class="estadoNCClase">
                                Estado NC: {{ estadoNC }}
                            </p>
                            <div v-if="devolucionSeleccionada && !devolucionSeleccionada.fecha_envio_perseo" class="mt-2 px-3 py-2 bg-blue-50 border-l-4 border-blue-500 text-sm text-blue-700">
                                <strong>ℹ️ Devolución solo en plataforma</strong> - Esta devolución aún no ha sido enviada a Perseo.
                            </div>
                        </div>

                        <!-- Resumen enviado/pendiente -->
                        <div v-if="detallesDevolucion && detallesDevolucion.length > 0 && devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo" class="flex gap-3 flex-wrap">
                            <div class="text-center px-3 py-2 bg-gray-50 rounded border">
                                <div class="text-xs text-gray-500">Total dev.</div>
                                <div class="font-bold text-lg">{{ totalDevolucionModal }}</div>
                            </div>
                            <div class="text-center px-3 py-2 bg-green-50 rounded border border-green-200">
                                <div class="text-xs text-gray-500">Enviado NC</div>
                                <div class="font-bold text-lg text-success">{{ totalEnviadoNCModal }}</div>
                            </div>
                            <div class="text-center px-3 py-2 rounded border" :class="totalPendienteModal > 0 ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-200'">
                                <div class="text-xs text-gray-500">Pendiente</div>
                                <div class="font-bold text-lg" :class="totalPendienteModal > 0 ? 'text-warning' : 'text-success'">
                                    {{ totalPendienteModal }}
                                </div>
                            </div>
                        </div>
                        <div v-if="devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo" class="flex gap-2 flex-wrap justify-end">
                            <vs-button
                                v-if="userRoot && hayItemsPendientes"
                                color="warning"
                                :disabled="loadingGenerarNC"
                                @click="previsualizarNotaCreditoDevolucion"
                            >
                                {{ loadingGenerarNC ? 'Procesando...' : 'Vista previa NC' }}
                            </vs-button>
                            <vs-button
                                color="success"
                                :disabled="loadingGenerarNC || !hayItemsPendientes"
                                @click="generarNotaCreditoDevolucion"
                            >
                                {{ loadingGenerarNC ? 'Generando...' : 'Generar Nota de Crédito' }}
                            </vs-button>
                        </div>
                    </div>
                </div>

                <!-- Estado de NC(s) generadas — no bloquea, permite seguir generando más -->
                <div v-if="ncYaGenerada && devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo" class="bg-green-50 border-2 border-green-300 rounded p-4 mb-4">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="text-green-700 font-bold mb-2">✓ {{ listaNCsGeneradas.length > 1 ? listaNCsGeneradas.length + ' Notas de Crédito generadas' : 'Nota de Crédito generada' }}</p>
                            <div v-for="(nc, idx) in listaNCsGeneradas" :key="idx" class="mb-1">
                                <span class="text-green-600 text-sm">NC {{ idx + 1 }}: <span class="font-mono font-bold">{{ nc }}</span></span>
                            </div>
                        </div>
                        <vs-button
                            v-if="listaNCsGeneradas.length > 0"
                            color="warning"
                            @click="mostrarDetallesNCGenerada(listaIdsNCPerseo[listaIdsNCPerseo.length - 1])"
                        >
                            Ver última NC
                        </vs-button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4" v-if="userRoot && devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo && hayItemsPendientes">
                    <div class="bg-gray-50 p-3 rounded border border-gray-200">
                        <label class="block text-xs text-gray-600 mb-1">Empresa para Nota de Crédito</label>
                        <input
                            type="number"
                            class="w-full border rounded px-3 py-2 text-sm"
                            v-model.number="empresaPruebaNC"
                        >
                        <p class="text-xs text-gray-500 mt-2">Seleccione la empresa para esta NC.</p>
                    </div>
                </div>

                <div v-if="detallesDevolucionEdicion && detallesDevolucionEdicion.length > 0 && devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo">
                    <!-- Vista Root: tabla editable completa -->
                    <table v-if="userRoot" class="w-full table-auto">
                        <thead>
                            <tr class="text-left">
                                <th class="px-2 py-1">Incluir</th>
                                <th class="px-2 py-1">Código</th>
                                <th class="px-2 py-1">Nombre</th>
                                <th class="px-2 py-1">Total Dev.</th>
                                <th class="px-2 py-1">Ya en NC</th>
                                <th class="px-2 py-1">Pendiente</th>
                                <th class="px-2 py-1">Código NC</th>
                                <th class="px-2 py-1">Cant. NC</th>
                                <th class="px-2 py-1">Precio</th>
                                <th class="px-2 py-1">Desc. %</th>
                                <th class="px-2 py-1">Total NC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in detallesDevolucionEdicion" :key="item.id || item.pro_codigo" :class="{'bg-red-100': item._mismatch}">
                                <td class="px-2 py-1">
                                    <vs-checkbox color="success" v-model="item.incluir_nc"></vs-checkbox>
                                </td>
                                <td class="px-2 py-1">{{ item.pro_codigo }}</td>
                                <td class="px-2 py-1">{{ item.pro_nombre || item.nombre_libro || '—' }}</td>
                                <td class="px-2 py-1 text-gray-500">{{ parseFloat(item.cantidad_devolucion || 0).toFixed(2) }}</td>
                                <td class="px-2 py-1 text-orange-600">{{ parseFloat(item.cantidad_ya_en_nc || 0).toFixed(2) }}</td>
                                <td class="px-2 py-1 font-bold text-primary">{{ parseFloat(item.cantidad_pendiente || item.cantidad_nc || 0).toFixed(2) }}</td>
                                <td class="px-2 py-1" style="max-width: 160px;">
                                    <input type="text" class="w-full border rounded px-2 py-1 text-sm" v-model.trim="item.pro_codigo_nc">
                                </td>
                                <td class="px-2 py-1" style="max-width: 120px;">
                                    <input type="number" step="0.01" min="0" class="w-full border rounded px-2 py-1 text-sm" v-model.number="item.cantidad_nc">
                                </td>
                                <td class="px-2 py-1">${{ parseFloat(item.precio || item.det_ven_valor_u || 0).toFixed(2) }}</td>
                                <td class="px-2 py-1">{{ parseFloat(item.descuento || 0).toFixed(2) }}%</td>
                                <td class="px-2 py-1">${{ ((parseFloat(item.cantidad_nc || 0) * parseFloat(item.precio || item.det_ven_valor_u || 0)) * (1 - parseFloat(item.descuento || 0) / 100)).toFixed(2) }}</td>
                            </tr>
                            <tr class="font-bold bg-gray-100 text-right">
                                <td colspan="5" class="px-2 py-2">TOTALES</td>
                                <td class="px-2 py-2">{{ totalesNotaCreditoPrueba.total_items || 0 }}</td>
                                <td class="px-2 py-2"></td>
                                <td class="px-2 py-2">{{ parseFloat(totalesNotaCreditoPrueba.total_cantidad || 0).toFixed(2) }}</td>
                                <td class="px-2 py-2"></td>
                                <td class="px-2 py-2"></td>
                                <td class="px-2 py-2">${{ resumenDocumentoFacturador.totalNC }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Vista Facturador: tabla limpia de solo lectura + resumen final -->
                    <div v-else>
                        <table class="w-full table-auto text-sm">
                            <thead>
                                <tr class="bg-gray-100 text-left">
                                    <th class="px-3 py-2">Código</th>
                                    <th class="px-3 py-2">Nombre</th>
                                    <th class="px-3 py-2 text-center">Cant.</th>
                                    <th class="px-3 py-2 text-right">Precio</th>
                                    <th class="px-3 py-2 text-right">Desc. %</th>
                                    <th class="px-3 py-2 text-right">Subtotal</th>
                                    <th class="px-3 py-2 text-right">Total NC</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in detallesDevolucionEdicion" :key="item.id || item.pro_codigo" class="border-b border-gray-100">
                                    <td class="px-3 py-2 font-mono text-xs text-gray-500">{{ item.pro_codigo }}</td>
                                    <td class="px-3 py-2 font-semibold text-gray-800">{{ item.pro_nombre || item.nombre_libro || '—' }}</td>
                                    <td class="px-3 py-2 text-center font-bold text-primary">{{ parseFloat(item.cantidad_nc || 0).toFixed(2) }}</td>
                                    <td class="px-3 py-2 text-right">${{ parseFloat(item.precio || item.det_ven_valor_u || 0).toFixed(2) }}</td>
                                    <td class="px-3 py-2 text-right text-orange-600">{{ parseFloat(item.descuento || 0).toFixed(2) }}%</td>
                                    <td class="px-3 py-2 text-right text-gray-600">${{ (parseFloat(item.cantidad_nc || 0) * parseFloat(item.precio || item.det_ven_valor_u || 0)).toFixed(2) }}</td>
                                    <td class="px-3 py-2 text-right font-bold text-success">${{ ((parseFloat(item.cantidad_nc || 0) * parseFloat(item.precio || item.det_ven_valor_u || 0)) * (1 - parseFloat(item.descuento || 0) / 100)).toFixed(2) }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Resumen del documento -->
                        <div class="mt-4 flex justify-end">
                            <div class="w-full md:w-80">
                                <div class="flex justify-between py-2 border-b border-gray-200 text-sm">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="font-semibold text-gray-800">${{ resumenDocumentoFacturador.subtotal }}</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-gray-200 text-sm">
                                    <span class="text-gray-600">Descuentos</span>
                                    <span class="font-semibold text-orange-600">- ${{ resumenDocumentoFacturador.totalDescuentos }}</span>
                                </div>
                                <div class="flex justify-between py-3 text-base">
                                    <span class="font-bold text-gray-800">Total Nota de Crédito</span>
                                    <span class="font-bold text-success">${{ resumenDocumentoFacturador.totalNC }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabla de solo lectura para devoluciones sin fecha_envio_perseo -->
                <div v-if="devolucionSeleccionada && !devolucionSeleccionada.fecha_envio_perseo && detallesDevolucion && detallesDevolucion.length > 0">
                    <table class="w-full table-auto text-sm">
                        <thead>
                            <tr class="bg-gray-100 text-left">
                                <th class="px-3 py-2">Código</th>
                                <th class="px-3 py-2">Nombre</th>
                                <th class="px-3 py-2 text-center">Cantidad</th>
                                <th class="px-3 py-2 text-right">Precio</th>
                                <th class="px-3 py-2 text-right">Desc. %</th>
                                <th class="px-3 py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in detallesDevolucion" :key="item.id || item.pro_codigo" class="border-b border-gray-100">
                                <td class="px-3 py-2 font-mono text-xs text-gray-500">{{ item.pro_codigo }}</td>
                                <td class="px-3 py-2 font-semibold text-gray-800">{{ item.pro_nombre || item.nombre_libro || '—' }}</td>
                                <td class="px-3 py-2 text-center font-bold text-primary">{{ parseFloat(item.cantidad_devolucion || item.cantidad || 0).toFixed(2) }}</td>
                                <td class="px-3 py-2 text-right">${{ parseFloat(item.precio || item.det_ven_valor_u || 0).toFixed(2) }}</td>
                                <td class="px-3 py-2 text-right text-orange-600">{{ parseFloat(item.descuento || 0).toFixed(2) }}%</td>
                                <td class="px-3 py-2 text-right font-bold text-gray-800">${{ ((parseFloat(item.cantidad_devolucion || item.cantidad || 0) * parseFloat(item.precio || item.det_ven_valor_u || 0)) * (1 - parseFloat(item.descuento || 0) / 100)).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="detallesDevolucionEdicion && detallesDevolucionEdicion.length === 0 && devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo" class="text-center py-8 text-gray-600">
                    <span v-if="ncYaGenerada && totalPendienteModal <= 0">✓ Todos los ítems de devolución ya fueron procesados en notas de crédito anteriores.</span>
                    <span v-else>No hay detalles para esta devolución</span>
                </div>

                <div v-if="previewNotaCreditoNC && devolucionSeleccionada && devolucionSeleccionada.fecha_envio_perseo" class="mt-4 bg-gray-900 text-gray-100 rounded p-4">
                    <div class="flex items-center justify-between mb-2">
                        <h5 class="font-bold">Vista previa del payload</h5>
                        <span class="text-xs text-gray-300">Revise antes de enviar</span>
                    </div>
                    <pre class="text-xs overflow-auto whitespace-pre-wrap">{{ JSON.stringify(previewNotaCreditoNC, null, 2) }}</pre>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
export default {
    name: 'ListaDevoluciones',
    props: {
        devolucionesFiltradas: {
            type: Array,
            default: () => []
        },
        devolucionesTotales: {
            type: Object,
            default: () => ({})
        },
        userRoot: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            devolucionSeleccionada: null,
            detallesDevolucion: [],
            detallesDevolucionEdicion: [],
            detallesDevolucionGenerada: [],
            showModalDevolucion: false,
            showModalNCPerseo: false,
            ncPerseoData: null,
            loadingGenerarNC: false,
            previewNotaCreditoNC: null,
            empresaPruebaNC: null,
            totalesDetalleDevolucion: {
                total_items: 0,
                total_cantidad: 0,
                total_valor: 0,
                total_mismatches: 0,
            },
            totalesNotaCreditoGenerada: {
                total_items: 0,
                total_cantidad: 0,
                total_valor: 0,
            },
        };
    },
    computed: {
        // Totales del header del modal
        totalDevolucionModal() {
            return (this.detallesDevolucion || []).reduce(function(sum, d) {
                return sum + parseFloat(d.cantidad_devolucion || d.cantidad || 0);
            }, 0);
        },
        totalEnviadoNCModal() {
            return (this.detallesDevolucion || []).reduce(function(sum, d) {
                return sum + parseFloat(d.cantidad_ya_en_nc || d.cantidad_nc_enviada || 0);
            }, 0);
        },
        totalPendienteModal() {
            return Math.max(0, this.totalDevolucionModal - this.totalEnviadoNCModal);
        },

        ncYaGenerada() {
            // Hay al menos una NC generada
            return this.devolucionSeleccionada && this.devolucionSeleccionada.nota_credito
                ? true : false;
        },

        // Lista de NCs ya generadas (puede ser más de una, separadas por coma)
        listaNCsGeneradas() {
            if (!this.devolucionSeleccionada || !this.devolucionSeleccionada.nota_credito) return [];
            return String(this.devolucionSeleccionada.nota_credito).split(',').map(s => s.trim()).filter(Boolean);
        },

        listaIdsNCPerseo() {
            if (!this.devolucionSeleccionada || !this.devolucionSeleccionada.id_nota_credito_perseo) return [];
            return String(this.devolucionSeleccionada.id_nota_credito_perseo).split(',').map(s => s.trim()).filter(Boolean);
        },

        // Hay al menos un ítem con cantidad pendiente > 0
        hayItemsPendientes() {
            // Usa el total calculado desde detallesDevolucion (fuente del backend)
            // más confiable que detallesDevolucionEdicion que depende del filtrado
            if (this.totalPendienteModal > 0) return true;
            return (this.detallesDevolucionEdicion || []).some(function(item) {
                return parseFloat(item.cantidad_pendiente || item.cantidad_nc || 0) > 0;
            });
        },

        estadoNC() {
            if (!this.ncYaGenerada) return 'Sin generar';
            return 'Generada en Perseo';
        },

        estadoNCClase() {
            if (!this.ncYaGenerada) return 'text-gray-600';
            return 'text-green-600 font-bold';
        },

        totalesNotaCreditoPrueba() {
            let me = this;
            let totalItems = 0;
            let totalCantidad = 0;
            let totalValor = 0;
            let totalIncluidos = 0;

            (me.detallesDevolucionEdicion || []).forEach(function(item) {
                if (item.incluir_nc) {
                    totalItems++;
                    totalCantidad += parseFloat(item.cantidad_nc) || 0;
                    totalValor += (parseFloat(item.cantidad_nc) * parseFloat(item.precio || item.det_ven_valor_u || 0)) || 0;
                    totalIncluidos++;
                }
            });

            return {
                total_items: totalItems,
                total_cantidad: totalCantidad,
                total_valor: totalValor.toFixed(2),
                total_incluidos: totalIncluidos,
            };
        },

        resumenDocumentoFacturador() {
            let me = this;
            let subtotal = 0;
            let totalNC = 0;

            (me.detallesDevolucionEdicion || []).forEach(function(item) {
                if (item.incluir_nc) {
                    const cant = parseFloat(item.cantidad_nc) || 0;
                    const precio = parseFloat(item.precio || item.det_ven_valor_u || 0);
                    const desc = parseFloat(item.descuento || 0);
                    const itemSubtotal = cant * precio;
                    subtotal += itemSubtotal;
                    totalNC += itemSubtotal * (1 - desc / 100);
                }
            });

            const totalDescuentos = subtotal - totalNC;

            return {
                subtotal: subtotal.toFixed(2),
                totalDescuentos: totalDescuentos.toFixed(2),
                totalNC: totalNC.toFixed(2),
            };
        }
    },
    methods: {
        abrirDevolucion(ven_codigo) {
            let me = this;
            me.loadingGenerarNC = true;
            me.previewNotaCreditoNC = null;
            me.detallesDevolucionEdicion = [];
            me.detallesDevolucionGenerada = [];

            const url = `${me.$server_url}api/perseo/ventas-lista/devolucion-detalle?ven_codigo=${ven_codigo}`;

            me.$http.get(url)
                .then(res => {
                    if (res.data.status === 'success') {
                        me.devolucionSeleccionada = res.data.data.devolucion_base;
                        me.detallesDevolucion = res.data.data.detalles || [];
                        me.empresaPruebaNC = res.data.data.devolucion_base.empresa_id || null;

                        var totales = res.data.data.totales || {};
                        me.totalesDetalleDevolucion = {
                            total_items: (totales.total_items || 0),
                            total_cantidad: (totales.total_cantidad || 0),
                            total_valor: (totales.total_valor || 0),
                            total_mismatches: (totales.total_mismatches || 0),
                        };

                        // Si ya existe NC, cargar sus detalles (solo informativo)
                        if (me.ncYaGenerada && res.data.data.detalles_nc) {
                            me.detallesDevolucionGenerada = res.data.data.detalles_nc;
                            var totalesNC = res.data.data.totales_nc || {};
                            me.totalesNotaCreditoGenerada = {
                                total_items: (totalesNC.total_items || 0),
                                total_cantidad: (totalesNC.total_cantidad || 0),
                                total_valor: (totalesNC.total_valor || 0),
                            };
                        }
                        // Siempre inicializar la edición para mostrar los ítems pendientes,
                        // incluso si ya hay una NC generada (puede haber más pendientes)
                        me.inicializarEdicionNotaCredito();

                        me.showModalDevolucion = true;
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message,
                            color: 'danger'
                        });
                    }
                })
                .catch(e => {
                    console.error('Error al cargar devolución:', e);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al cargar la devolución',
                        color: 'danger'
                    });
                })
                .finally(() => {
                    me.loadingGenerarNC = false;
                });
        },

        inicializarEdicionNotaCredito() {
            let me = this;

            // Filtrar ítems con cantidad pendiente > 0
            // Si cantidad_pendiente no viene del backend (campo nuevo, columna null), 
            // usar la cantidad_devolucion completa como pendiente
            me.detallesDevolucionEdicion = (me.detallesDevolucion || [])
                .map(function(detalle) {
                    const cantidadTotal   = parseFloat(detalle.cantidad_devolucion || detalle.cantidad || 0);
                    const yaEnNC          = parseFloat(detalle.cantidad_ya_en_nc || 0);
                    // Si el backend devuelve cantidad_pendiente úsala; si no, calcular aquí
                    const cantidadPend    = detalle.cantidad_pendiente !== undefined && detalle.cantidad_pendiente !== null
                        ? parseFloat(detalle.cantidad_pendiente)
                        : Math.max(0, cantidadTotal - yaEnNC);
                    const precio          = parseFloat(detalle.precio || detalle.det_ven_valor_u || detalle.precio_venta || 0);
                    const descuento       = parseFloat(detalle.descuento || 0);

                    return {
                        ...detalle,
                        incluir_nc:          cantidadPend > 0,
                        pro_codigo_nc:       detalle.pro_codigo,
                        cantidad_nc:         cantidadPend,
                        precio:              precio,
                        descuento:           descuento,
                        subtotal_nc:         cantidadPend * precio,
                        cantidad_ya_en_nc:   yaEnNC,
                        cantidad_devolucion: cantidadTotal,
                        cantidad_pendiente:  cantidadPend,
                        _sin_pendiente:      cantidadPend <= 0,
                    };
                })
                // Solo mostrar ítems que tienen algo pendiente
                .filter(function(item) { return item.cantidad_pendiente > 0; });
        },

        construirDetallesOverrideNC() {
            let me = this;
            return (me.detallesDevolucionEdicion || []).filter(d => d.incluir_nc).map(d => ({
                pro_codigo: d.pro_codigo_nc,
                cantidad: d.cantidad_nc,
                precio_unitario: d.precio,
                descuento: d.descuento || 0
            }));
        },

        ejecutarNotaCreditoDevolucion(enviar) {
            let me = this;
            me.loadingGenerarNC = true;

            // Solo root puede enviar detalles_override (cantidades y productos editados).
            // El no-root solo dispara la generación sin modificar nada — el backend
            // toma los detalles directamente de la tabla de devoluciones.
            const detallesNC = me.userRoot ? me.construirDetallesOverrideNC() : [];

            if (me.userRoot && detallesNC.length === 0 && enviar) {
                me.$vs.notify({
                    title: 'Advertencia',
                    text: 'Debes seleccionar al menos un detalle para la NC',
                    color: 'warning'
                });
                me.loadingGenerarNC = false;
                return;
            }

            const payload = {
                ven_codigo: me.devolucionSeleccionada.ven_codigo,
                empresa: me.empresaPruebaNC || me.devolucionSeleccionada.empresa_id,
                enviar: enviar,
                usuario_id: me.$store.state.usuario ? me.$store.state.usuario.idusuario : 0
            };

            // Solo agregar detalles_override si es root y hay detalles seleccionados
            if (me.userRoot && detallesNC.length > 0) {
                payload.detalles_override = detallesNC;
            }

            const url = `${me.$server_url}api/perseo/ventas-lista/devolucion-nota-credito`;

            me.$http.post(url, payload)
                .then(res => {
                    if (enviar) {
                        const status = res.data.status;
                        const resumen = res.data.resumen || {};
                        const procesadosOk = resumen.procesados_ok || 0;
                        const procesadosError = resumen.procesados_error || 0;
                        
                        // Caso 1: Éxito total
                        if (status === 'success' && procesadosOk > 0 && procesadosError === 0) {
                            me.$vs.notify({
                                title: 'Éxito',
                                text: res.data.message || 'Nota de crédito generada exitosamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            me.$emit('nc-generada');
                            // Recargar datos para mostrar NC generada
                            setTimeout(() => {
                                me.abrirDevolucion(me.devolucionSeleccionada.ven_codigo);
                            }, 500);
                        }
                        // Caso 2: Éxito parcial
                        else if (status === 'partial_success' && procesadosOk > 0) {
                            me.$vs.notify({
                                title: 'Advertencia',
                                text: res.data.message || `Se procesaron ${procesadosOk} documentos, pero ${procesadosError} fallaron`,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle',
                                time: 8000
                            });
                            me.$emit('nc-generada');
                            setTimeout(() => {
                                me.abrirDevolucion(me.devolucionSeleccionada.ven_codigo);
                            }, 500);
                        }
                        // Caso 3: Error total
                        else {
                            let msg = res.data.message || 'Error al generar la NC';
                            
                            // Intentar obtener mensaje de error más específico
                            if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                                const primerError = res.data.data.find(r => r.status === 0);
                                if (primerError && primerError.message) {
                                    msg = primerError.message;
                                    
                                    // Detectar error específico de Perseo
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
                    } else {
                        me.previewNotaCreditoNC = res.data;
                    }
                })
                .catch(e => {
                    console.error('Error:', e);
                    const errorMsg = e.response && e.response.data && e.response.data.message 
                        ? e.response.data.message 
                        : 'Error de conexión al procesar la NC';
                    me.$vs.notify({
                        title: 'Error',
                        text: errorMsg,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle'
                    });
                })
                .finally(() => {
                    me.loadingGenerarNC = false;
                });
        },

        previsualizarNotaCreditoDevolucion() {
            this.ejecutarNotaCreditoDevolucion(false);
        },

        generarNotaCreditoDevolucion() {
            this.ejecutarNotaCreditoDevolucion(true);
        },

        mostrarDetallesNCGenerada(idNCPerseo) {
            let me = this;
            const id = idNCPerseo || (me.devolucionSeleccionada ? me.devolucionSeleccionada.id_nota_credito_perseo : null);
            if (!id) {
                me.$vs.notify({ title: 'Error', text: 'No hay ID de NC para consultar', color: 'danger' });
                return;
            }
            me.loadingGenerarNC = true;

            const url = `${me.$server_url}api/perseo/ventas-lista/consultar-nc-perseo?id_nota_credito_perseo=${id}&empresa=${me.devolucionSeleccionada.empresa_id}`;

            me.$http.get(url)
                .then(res => {
                    if (res.data.status === 'success' && res.data.data) {
                        me.ncPerseoData = res.data.data;
                        me.showModalNCPerseo = true;
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message || 'No se pudo consultar la NC en Perseo',
                            color: 'danger'
                        });
                    }
                })
                .catch(e => {
                    console.error('Error:', e);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al consultar NC en Perseo',
                        color: 'danger'
                    });
                })
                .finally(() => {
                    me.loadingGenerarNC = false;
                });
        }
    }
};
</script>

<style scoped>
.w-full { width: 100%; }
.table-auto { width: 100%; border-collapse: collapse; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.flex-start { justify-content: flex-start; }
.items-start { align-items: flex-start; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.border { border: 1px solid #e5e7eb; }
.border-2 { border-width: 2px; }
.rounded { border-radius: 0.375rem; }
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.font-bold { font-weight: bold; }
.font-mono { font-family: monospace; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-100 { color: #f3f4f6; }
.text-gray-200 { color: #e5e7eb; }
.text-green-600 { color: #059669; }
.text-green-700 { color: #047857; }
.text-blue-600 { color: #2563eb; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-200 { background-color: #e5e7eb; }
.bg-gray-900 { background-color: #111827; }
.bg-blue-50 { background-color: #eff6ff; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-green-100 { background-color: #dcfce7; }
.bg-orange-50 { background-color: #fffbeb; }
.bg-red-50 { background-color: #fef2f2; }
.bg-red-100 { background-color: #fee2e2; }
.bg-slate-50 { background-color: #f8fafc; }
.border-gray-200 { border-color: #e5e7eb; }
.border-green-300 { border-color: #86efac; }
.border-slate-200 { border-color: #e2e8f0; }
.text-primary { color: #0066cc; }
.text-success { color: #198754; }
.text-warning { color: #ffc107; }
.text-danger { color: #dc3545; }
.text-dark { color: #212529; }
.text-info { color: #0dcaf0; }
.whitespace-pre-wrap { white-space: pre-wrap; }
.overflow-auto { overflow: auto; }

@media (min-width: 768px) {
    .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
</style>
