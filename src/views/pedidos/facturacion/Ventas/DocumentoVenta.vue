<template>
    <div class="documento-venta-container">
        <!-- Loading inicial -->
        <div v-if="!datosListos" class="text-center py-12">
            <vs-progress indeterminate color="primary"></vs-progress>
            <p class="text-gray-600 mt-4 text-lg">Cargando información de la proforma...</p>
            <p class="text-gray-500 mt-2 text-sm">Por favor espere...</p>
        </div>

        <!-- Contenido principal (solo cuando datos estén listos) -->
        <div v-else>
            <!-- Información de la Proforma -->
            <vx-card class="mb-4">
                <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="font-bold mb-1 block text-xs">
                        <feather-icon icon="BuildingIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                        Empresa
                    </label>
                    <p class="font-semibold">{{ proforma.empresa_nombre }}</p>
                </div>
                <div>
                    <label class="font-bold mb-1 block text-xs">
                        <feather-icon icon="UserIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                        Cliente
                    </label>
                    <p class="font-semibold">{{ proforma.cliente_nombre }}</p>
                    <p class="text-xs text-gray-500 font-mono">RUC: {{ proforma.cliente_ruc }}</p>
                </div>
                <div>
                    <label class="font-bold mb-1 block text-xs">
                        <feather-icon icon="MapPinIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                        Despacho
                    </label>
                    <p class="font-semibold">{{ proforma.despacho_nombre }}</p>
                    <p class="text-xs text-gray-500">{{ proforma.despacho_direccion }}</p>
                </div>
            </div>
        </vx-card>

        <!-- Configuración del Documento -->
        <vx-card class="mb-4">
            <template slot="header">
                <h4>Configuración del Documento de Venta</h4>
            </template>

            <div class="vx-row">
                <!-- Tipo de Documento -->
                <div class="vx-col md:w-1/2 w-full mb-3">
                    <label class="font-bold mb-2 block text-sm">
                        <feather-icon icon="FileTextIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                        Tipo de Documento <span class="text-red-500">*</span>
                    </label>
                    <v-select 
                        :options="tiposDocumento" 
                        :reduce="(tipo) => tipo.tdo_id" 
                        label="tdo_nombre" 
                        v-model="factura.tipo"
                        placeholder="Seleccione tipo de documento..."
                        class="w-full"
                    ></v-select>
                </div>

                <!-- Observación -->
                <div class="vx-col md:w-1/2 w-full mb-3">
                    <label class="font-bold mb-2 block text-sm">
                        <feather-icon icon="MessageSquareIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                        Observación
                    </label>
                    <vs-textarea 
                        v-model="factura.observacion" 
                        rows="2"
                        placeholder="Observaciones (opcional)"
                        class="w-full"
                    />
                </div>

                <!-- Checkbox: Activar todo el stock -->
                <div v-if="verificarStockInsuficiente && factura.tipo" class="vx-col w-full mb-3">
                    <div class="flex items-center p-3 bg-orange-50 rounded border border-orange-200">
                        <vs-switch 
                            v-model="activarTodoStock"
                            color="warning"
                        >
                            <span slot="on">SÍ</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                        <label class="ml-3 font-bold text-sm cursor-pointer" @click="activarTodoStock = !activarTodoStock">
                            <feather-icon icon="PackageIcon" svgClasses="h-4 w-4" class="inline mr-1"></feather-icon>
                            ¿Activar todo el stock disponible?
                        </label>
                    </div>
                </div>
            </div>
        </vx-card>

        <!-- Detalles de la Proforma (Solo si hay tipo de documento seleccionado) -->
        <vx-card v-if="factura.tipo" class="mb-4">
            <template slot="header">
                <div class="flex justify-between items-center">
                    <h4>Detalle de Libros</h4>
                    <vs-chip color="primary">{{ detalles.length }} ítems</vs-chip>
                </div>
            </template>

            <div v-if="loadingDetalles" class="text-center py-8">
                <vs-progress indeterminate color="primary"></vs-progress>
                <p class="text-gray-600 mt-2">Cargando detalles...</p>
            </div>

            <vs-table v-else :data="detalles" class="tabla-detalles">
                <template slot="thead">
                    <vs-th width="50">N°</vs-th>
                    <vs-th width="120">Código</vs-th>
                    <vs-th>Libro</vs-th>
                    <vs-th width="90">Stock</vs-th>
                    <vs-th width="90">Cant. Proforma</vs-th>
                    <vs-th width="90" class="bg-orange-100">Ya Vendido</vs-th>
                    <vs-th width="90" class="bg-blue-100">Pendiente</vs-th>
                    <vs-th width="90">Cant. a Vender</vs-th>
                    <vs-th width="90">Precio Unit.</vs-th>
                    <vs-th width="100">Subtotal</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="index" v-for="(item, index) in data" :class="{'row-error': item.error, 'row-warning': item.warning && !item.error}">
                        <vs-td>
                            <b>{{ index + 1 }}</b>
                        </vs-td>
                        <vs-td>
                            <span class="font-mono text-sm font-bold">{{ item.pro_codigo }}</span>
                        </vs-td>
                        <vs-td>
                            <div>
                                <span class="font-semibold text-sm">{{ item.pro_nombre }}</span>
                                
                                <!-- Advertencia de sin pendientes -->
                                <div v-if="item.cantidad_pendiente === 0" 
                                     class="text-xs bg-green-100 text-green-600 p-2 rounded mt-1">
                                    <feather-icon icon="CheckCircleIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                                    ✅ Todo vendido - Sin cantidades pendientes
                                </div>
                                
                                <!-- Advertencia de stock insuficiente -->
                                <div v-else-if="item.cantidad_pendiente > item.stock_disponible" 
                                     class="text-xs bg-red-100 text-red-600 p-2 rounded mt-1">
                                    <feather-icon icon="AlertTriangleIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon>
                                    Stock insuficiente para pendiente. Disponible: {{ item.stock_disponible }}
                                </div>
                            </div>
                        </vs-td>
                        <vs-td>
                            <vs-chip :color="item.stock_disponible > 0 ? 'success' : 'danger'" size="small">
                                <b>{{ item.stock_disponible }}</b>
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                            <b>{{ item.cantidad_proforma }}</b>
                        </vs-td>
                        <vs-td class="bg-orange-50">
                            <vs-chip color="warning" size="small">
                                <b>{{ item.cantidad_ya_vendida || 0 }}</b>
                            </vs-chip>
                        </vs-td>
                        <vs-td class="bg-blue-50">
                            <vs-chip :color="item.cantidad_pendiente > 0 ? 'primary' : 'success'" size="small">
                                <b>{{ item.cantidad_pendiente || 0 }}</b>
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                            <div>
                                <b :class="item.cantidad_venta > 0 ? 'text-success' : 'text-gray-400'">{{ item.cantidad_venta }}</b>
                            </div>
                        </vs-td>
                        <vs-td>
                            <span class="font-bold">${{ parseFloat(item.det_prof_valor_u).toFixed(2) }}</span>
                        </vs-td>
                        <vs-td>
                            <div v-if="item.cantidad_venta">
                                <span class="font-bold text-success">
                                    ${{ item.subtotal = (item.cantidad_venta * item.det_prof_valor_u).toFixed(2) }}
                                </span>
                            </div>
                            <div v-else>
                                <span>{{ item.subtotal = 0 }}</span>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>

        <!-- Resumen de Totales -->
        <vx-card v-if="factura.tipo" class="mb-4">
            <template slot="header">
                <h4>Resumen de Totales</h4>
            </template>
            
            <div class="bg-gray-50 p-4 rounded">
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-right font-semibold">Subtotal:</div>
                    <div class="text-right">${{ calcularSubtotal() }}</div>
                    
                    <div class="text-right font-semibold">IVA ({{ proformaCompleta && proformaCompleta.prof_iva_por || 0 }}%):</div>
                    <div class="text-right">${{ calcularIVA() }}</div>
                    
                    <div class="text-right font-semibold">Descuento ({{ proformaCompleta && proformaCompleta.pro_des_por || 0 }}%):</div>
                    <div class="text-right">-${{ calcularDescuento() }}</div>
                    
                    <div class="text-right text-lg font-bold">Total:</div>
                    <div class="text-right text-lg font-bold text-success">${{ calcularTotal() }}</div>
                </div>
            </div>
        </vx-card>

        <!-- Botones de Acción -->
        <div class="flex justify-end gap-3">
            <vs-button 
                color="danger" 
                type="border"
                @click="cerrar"
            >
                Cancelar
            </vs-button>
            <vs-button 
                color="success" 
                type="gradient"
                icon="shopping_cart"
                @click="guardarDocumentoVenta"
                :disabled="!validarFormulario() || tieneErrores()"
            >
                Generar Documento de Venta
            </vs-button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <p class="text-white text-lg mt-4">Generando documento de venta...</p>
        </div>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
    components: {
        'v-select': vSelect
    },
    props: {
        proforma: {
            type: Object,
            required: true
        },
        contrato: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            loadingDetalles: false,
            datosListos: false,
            proformaCompleta: null, // Guardar la proforma completa aquí
            cantidadesVendidas: {}, // Cantidades ya vendidas de esta proforma
            listaEmpresas: [],
            tiposDocumento: [],
            puntosVenta: [],
            detalles: [],
            tiposVenta: [
                { label: 'Factura', value: 'F' },
                { label: 'Nota de Venta', value: 'N' }
            ],
            factura: {
                empresa: null,
                tipo: null,
                observacion: ''
            },
            // Control de stock
            verificarStockInsuficiente: false,
            activarTodoStock: false
        }
    },
    mounted() {
        this.cargarDatosProforma();
        this.getTiposDocumento();
    },
    watch: {
        async 'factura.tipo'(newVal) {
            let me = this;
            if (newVal) {
                // Cargar stocks cuando se selecciona el tipo de documento
                console.log('📊 Tipo de documento seleccionado - Cargando stocks...');
                me.loadingDetalles = true;
                
                try {
                    await me.cargarStocksProductos();
                    
                    // Si cambia el tipo y NO está activado "todo el stock", validar por tipo
                    if (!me.activarTodoStock) {
                        me.validarStockPorTipoDocumento();
                    }
                } catch (err) {
                    console.error('❌ Error al cargar stocks:', err);
                } finally {
                    me.loadingDetalles = false;
                }
            }
        },
        async activarTodoStock(newVal) {
            // Cuando se activa/desactiva, recargar stocks en tiempo real por concurrencia
            let me = this;
            
            console.log(`${newVal ? '✅ Activando' : '❌ Desactivando'} todo el stock - Recargando stocks en tiempo real...`);
            
            me.loadingDetalles = true;
            
            try {
                // Recargar stocks frescos del backend (por concurrencia de usuarios)
                await me.cargarStocksProductos();
                
                // Aplicar lógica de stock según el estado del switch
                me.aplicarTodoStockDisponible();
                
                me.$vs.notify({
                    title: 'Stock Disponible',
                    text: `Stock cargado exitosamente - ${newVal ? 'Modo: Todo el stock' : 'Modo: Stock específico'}`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-refresh-cw',
                    position: 'top-right'
                });
            } catch (err) {
                console.error('❌ Error al recargar stocks:', err);
                me.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron actualizar los stocks',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            } finally {
                me.loadingDetalles = false;
            }
        }
    },
    methods: {
        async cargarDatosProforma() {
            let me = this;
            me.loadingDetalles = true;
            
            console.log('📦 Cargando proforma completa:', me.proforma.id);
            
            try {
                // Cargar la proforma completa con sus detalles (igual que en editar)
                const res = await me.$http.get(`${me.$server_url}get_proforma_para_editar/${me.proforma.id}`);
                
                if (!res.data.data || !res.data.data.proforma) {
                    throw new Error('No se pudo cargar la proforma');
                }
                
                const proformaCompleta = res.data.data.proforma;
                const detallesOriginales = res.data.data.detalles || [];
                
                console.log('✅ Proforma cargada:', proformaCompleta);
                console.log('✅ Detalles cargados:', detallesOriginales.length, 'items');
                
                // Guardar la proforma completa
                me.proformaCompleta = proformaCompleta;
                
                // Actualizar datos de empresa
                me.factura.empresa = proformaCompleta.emp_id;
                me.factura.observacion = proformaCompleta.prof_observacion || '';
                
                // Mapear detalles para el documento de venta
                me.detalles = detallesOriginales.map(item => ({
                    ...item,
                    det_prof_id: item.det_prof_id,
                    pro_codigo: item.pro_codigo,
                    pro_nombre: item.pro_nombre,
                    det_prof_cantidad: parseInt(item.det_prof_cantidad) || 0,
                    det_prof_valor_u: parseFloat(item.det_prof_valor_u) || 0,
                    cantidad_proforma: parseInt(item.det_prof_cantidad) || 0,
                    cantidad_ya_vendida: 0, // Se cargará después
                    cantidad_pendiente: parseInt(item.det_prof_cantidad) || 0, // Se calculará después
                    cantidad_venta: 0, // Se calculará según pendiente y stock
                    // Los 4 stocks (se cargarán después)
                    pro_stock: 0,
                    pro_deposito: 0,
                    pro_stockCalmed: 0,
                    pro_depositoCalmed: 0,
                    stock_disponible: 0,
                    subtotal: 0,
                    error: null,
                    warning: null
                }));
                
                // NO cargar stocks aquí - se cargarán cuando seleccione el tipo de documento
                
                // Cargar las cantidades ya vendidas de esta proforma
                await me.cargarCantidadesVendidas();
                
                me.loadingDetalles = false;
                me.datosListos = true;
                
            } catch (err) {
                me.loadingDetalles = false;
                console.error('❌ Error al cargar proforma:', err);
                me.$vs.notify({
                    title: 'Error',
                    text: 'No se pudo cargar la información de la proforma',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                me.$emit('cerrar');
            }
        },

        async cargarStocksProductos() {
            let me = this;
            
            try {
                console.log('📊 Cargando stocks de productos...');
                
                // Obtener los códigos de productos
                const codigosProductos = me.detalles.map(item => item.pro_codigo);
                
                // Llamar al backend para obtener stocks
                const res = await me.$http.post(`${me.$server_url}Get_Stocks_Productos`, {
                    codigos: codigosProductos
                });
                
                if (res.data && Array.isArray(res.data)) {
                    // Actualizar stocks en cada detalle
                    res.data.forEach(producto => {
                        const detalle = me.detalles.find(d => d.pro_codigo === producto.pro_codigo);
                        if (detalle) {
                            detalle.pro_stock = parseInt(producto.pro_stock) || 0;
                            detalle.pro_deposito = parseInt(producto.pro_deposito) || 0;
                            detalle.pro_stockCalmed = parseInt(producto.pro_stockCalmed) || 0;
                            detalle.pro_depositoCalmed = parseInt(producto.pro_depositoCalmed) || 0;
                            
                            console.log(`   ${producto.pro_codigo}: stock=${producto.pro_stock}, deposito=${producto.pro_deposito}, stockCalmed=${producto.pro_stockCalmed}, depositoCalmed=${producto.pro_depositoCalmed}`);
                        }
                    });
                    
                    console.log('✅ Stocks cargados correctamente');
                } else {
                    console.warn('⚠️ No se recibieron datos de stocks');
                }
            } catch (err) {
                console.error('❌ Error al cargar stocks:', err);
                me.$vs.notify({
                    title: 'Advertencia',
                    text: 'No se pudieron cargar los stocks de productos',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
        },

        async cargarCantidadesVendidas() {
            let me = this;
            
            try {
                console.log('🔍 Consultando cantidades ya vendidas de la proforma...');
                
                const res = await me.$http.get(`${me.$server_url}get_cantidades_vendidas_proforma`, {
                    params: {
                        proforma_id: me.proforma.id
                    }
                });
                
                if (res.data && res.data.status === 200) {
                    me.cantidadesVendidas = res.data.data || {};
                    
                    // Actualizar cada detalle con la información de cantidades vendidas
                    me.detalles.forEach(item => {
                        const vendido = me.cantidadesVendidas[item.pro_codigo];
                        item.cantidad_ya_vendida = vendido ? vendido.cantidad_vendida : 0;
                        item.cantidad_pendiente = item.cantidad_proforma - item.cantidad_ya_vendida;
                        
                        console.log(`   ${item.pro_codigo}: proforma=${item.cantidad_proforma}, vendido=${item.cantidad_ya_vendida}, pendiente=${item.cantidad_pendiente}`);
                    });
                    
                    console.log('✅ Cantidades vendidas cargadas correctamente');
                } else {
                    console.warn('⚠️ No se recibieron cantidades vendidas');
                    // Inicializar en 0 si no hay datos
                    me.detalles.forEach(item => {
                        item.cantidad_ya_vendida = 0;
                        item.cantidad_pendiente = item.cantidad_proforma;
                    });
                }
            } catch (err) {
                console.error('❌ Error al cargar cantidades vendidas:', err);
                // Inicializar en 0 en caso de error
                me.detalles.forEach(item => {
                    item.cantidad_ya_vendida = 0;
                    item.cantidad_pendiente = item.cantidad_proforma;
                });
            }
        },

        validarCantidad(item) {
            item.error = null;
            item.warning = null;
            
            const cantidadVenta = parseInt(item.cantidad_venta) || 0;
            const cantidadPendiente = parseInt(item.cantidad_pendiente) || 0;
            const stockDisponible = parseInt(item.stock_disponible) || 0;
            
            if (cantidadVenta < 0) {
                item.error = 'La cantidad no puede ser negativa';
                item.cantidad_venta = 0;
                return;
            }
            
            // Si no hay cantidad pendiente, no se puede vender más
            if (cantidadPendiente === 0) {
                item.warning = 'No hay cantidades pendientes por vender';
                return;
            }
            
            if (cantidadVenta === 0) {
                item.error = 'La cantidad debe ser mayor a 0';
                return;
            }

            // Validar contra stock disponible
            if (cantidadVenta > stockDisponible) {
                item.error = `Stock insuficiente. Disponible: ${stockDisponible}`;
                item.warning = 'Ajustar a la cantidad disponible en stock.';
                return;
            }
            
            // Validar contra cantidad pendiente
            if (cantidadVenta > cantidadPendiente) {
                item.error = `Cantidad excede lo pendiente (${cantidadPendiente})`;
                return;
            }
        },
            
        tieneErrores() {
            return this.detalles.some(item => item.error !== null);
        },

        // Validar stock por tipo de documento
        validarStockPorTipoDocumento() {
            let me = this;
            
            if (!me.factura.tipo) return;

            const empresaId = me.factura.empresa;
            const tipoDocId = me.factura.tipo;

            console.log('🔍 Validando stock:', { empresaId, tipoDocId });

            me.detalles.forEach(item => {
                // Asignar stock según tipo de documento y empresa
                if (tipoDocId === 1) {
                    // FACTURA
                    if (empresaId === 1) {
                        item.stock_disponible = item.pro_stock; // Factura Prolipa
                    } else if (empresaId === 3) {
                        item.stock_disponible = item.pro_stockCalmed; // Factura Calmed
                    }
                } else if (tipoDocId === 3 || tipoDocId === 4) {
                    // NOTA DE VENTA
                    if (empresaId === 1) {
                        item.stock_disponible = item.pro_deposito; // Nota Prolipa
                    } else if (empresaId === 3) {
                        item.stock_disponible = item.pro_depositoCalmed; // Nota Calmed
                    }
                } else {
                    item.stock_disponible = 0;
                }
                
                console.log(`   ${item.pro_codigo}: stock_disponible = ${item.stock_disponible}`);
            });

            me.recalcularCantidades();
            me.verificarStockInsuficiente = me.detalles.some(item => 
                item.cantidad_proforma > item.stock_disponible
            );
        },

        // Recalcular cantidades según cantidades pendientes y stock disponible
        recalcularCantidades() {
            let me = this;
            
            me.detalles.forEach(item => {
                const cantidadPendiente = item.cantidad_pendiente || 0;
                const stockDisponible = item.stock_disponible || 0;
                
                // Solo se puede vender lo que está PENDIENTE y hay en STOCK
                // Tomar el mínimo entre pendiente y stock disponible
                const maximoAVender = Math.min(cantidadPendiente, stockDisponible);
                
                item.cantidad_venta = maximoAVender > 0 ? maximoAVender : 0;
                
                console.log(`   Recalcular ${item.pro_codigo}: pendiente=${cantidadPendiente}, stock=${stockDisponible}, a_vender=${item.cantidad_venta}`);
                
                me.validarCantidad(item);
            });
        },

        // Aplicar todo el stock disponible
        aplicarTodoStockDisponible() {
            let me = this;
            
            if (me.activarTodoStock) {
                // Cuando se activa: sumar TODOS los stocks disponibles
                console.log('✅ Activando todo el stock disponible');
                me.detalles.forEach(item => {
                    // Sumar los 4 stocks como en ScreenFactura.vue
                    const stockTotal = (item.pro_stock || 0) + 
                                      (item.pro_deposito || 0) + 
                                      (item.pro_stockCalmed || 0) + 
                                      (item.pro_depositoCalmed || 0);
                    
                    item.stock_disponible = stockTotal;
                    item.cantidad_venta = stockTotal > 0 ? stockTotal : 0;
                    
                    console.log(`   ${item.pro_codigo}: stock total = ${stockTotal}`);
                });
            } else {
                // Cuando se desactiva: volver a validar según tipo documento
                console.log('❌ Desactivando todo el stock - volviendo a stock por tipo');
                me.validarStockPorTipoDocumento();
            }
            
            me.recalcularCantidades();
        },

        getTiposDocumento() {
            let me = this;
            me.$http.get(me.$server_url + 'Get_tdocu')
                .then(res => {
                    if (res.data && Array.isArray(res.data)) {
                        me.tiposDocumento = res.data;
                    }
                })
                .catch(err => {
                    console.error('Error al cargar tipos de documento:', err);
                });
        },

        calcularSubtotal() {
            let subtotal = 0;
            this.detalles.forEach(item => {
                subtotal += (item.cantidad_venta || 0) * parseFloat(item.det_prof_valor_u || 0);
            });
            return subtotal.toFixed(2);
        },

        calcularDescuento() {
            const subtotal = parseFloat(this.calcularSubtotal());
            const porcentaje = this.proformaCompleta && this.proformaCompleta.pro_des_por ? parseFloat(this.proformaCompleta.pro_des_por) : 0;
            return (subtotal * porcentaje / 100).toFixed(2);
        },

        calcularIVA() {
            const subtotal = parseFloat(this.calcularSubtotal());
            const descuento = parseFloat(this.calcularDescuento());
            const base = subtotal - descuento;
            const porcentaje = this.proformaCompleta && this.proformaCompleta.prof_iva_por ? parseFloat(this.proformaCompleta.prof_iva_por) : 0;
            return (base * porcentaje / 100).toFixed(2);
        },

        calcularTotal() {
            const subtotal = parseFloat(this.calcularSubtotal());
            const descuento = parseFloat(this.calcularDescuento());
            const iva = parseFloat(this.calcularIVA());
            return (subtotal - descuento + iva).toFixed(2);
        },

        validarFormulario() {
            return this.factura.tipo && 
                   this.detalles.length > 0;
        },

        guardarDocumentoVenta() {
            let me = this;

            if (!me.validarFormulario()) {
                me.$vs.notify({
                    title: 'Campos Requeridos',
                    text: 'Por favor complete todos los campos obligatorios',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // Validar que haya al menos un item con cantidad > 0
            const itemsConCantidad = me.detalles.filter(item => item.cantidad_venta > 0);
            if (itemsConCantidad.length === 0) {
                me.$vs.notify({
                    title: 'Sin Items para Facturar',
                    text: 'Debe tener al menos un item con cantidad mayor a 0',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            if (me.tieneErrores()) {
                me.$vs.notify({
                    title: 'Errores en Cantidades',
                    text: 'Por favor corrija los errores en las cantidades antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // Calcular si quedan pendientes
            const totalItems = itemsConCantidad.length;
            const totalCantidad = itemsConCantidad.reduce((sum, item) => sum + item.cantidad_venta, 0);
            const totalProforma = me.detalles.reduce((sum, item) => sum + item.cantidad_proforma, 0);
            const totalPendiente = me.detalles.reduce((sum, item) => sum + (item.cantidad_pendiente - item.cantidad_venta), 0);
            
            const hayPendientes = totalPendiente > 0;
            
            let mensajeConfirmacion = `¿Generar documento de venta con ${totalItems} item(s) (${totalCantidad} unidades)?`;
            
            if (hayPendientes) {
                mensajeConfirmacion += `\n\n⚠️ ATENCIÓN: Quedarán ${totalPendiente} unidad(es) pendiente(s) por vender de un total de ${totalProforma} proformadas.`;
            }
            
            me.$vs.dialog({
                type: 'confirm',
                color: hayPendientes ? 'warning' : 'success',
                title: hayPendientes ? '⚠️ Venta Parcial' : 'Confirmar Generación',
                text: mensajeConfirmacion,
                accept: me.confirmarCrearVenta,
                acceptText: 'Sí, Generar',
                cancelText: 'Cancelar'
            });
        },

        confirmarCrearVenta() {
            let me = this;
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            
            me.loading = true;

            // Preparar detalles para enviar al backend
            const detallesParaGuardar = me.detalles
                .filter(item => item.cantidad_venta > 0)
                .map(item => ({
                    pro_codigo: item.pro_codigo,
                    pro_nombre: item.pro_nombre,
                    det_prof_cantidad: parseInt(item.cantidad_venta),
                    det_prof_valor_u: parseFloat(item.det_prof_valor_u),
                    cantidad_proforma: parseInt(item.cantidad_proforma),
                    stock_disponible: parseInt(item.stock_disponible || 0),
                    // Los 4 stocks individuales para control inteligente
                    pro_stock: parseInt(item.pro_stock || 0),
                    pro_deposito: parseInt(item.pro_deposito || 0),
                    pro_stockCalmed: parseInt(item.pro_stockCalmed || 0),
                    pro_depositoCalmed: parseInt(item.pro_depositoCalmed || 0)
                }));

            // Validación adicional antes de enviar
            if (!detallesParaGuardar || detallesParaGuardar.length === 0) {
                me.loading = false;
                me.$vs.notify({
                    title: 'Error de Validación',
                    text: 'No hay detalles válidos para enviar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // Preparar datos para enviar
            const datosVenta = {
                prof_id: parseInt(me.proforma.id),
                prof_codigo: me.proforma.prof_id,
                empresa: parseInt(me.factura.empresa),
                tipo_documento: parseInt(me.factura.tipo),
                observacion: me.factura.observacion || '',
                contrato_codigo: me.contrato,
                subtotal: parseFloat(me.calcularSubtotal()),
                descuento_porcentaje: parseFloat(me.proformaCompleta && me.proformaCompleta.pro_des_por || 0),
                descuento_valor: parseFloat(me.calcularDescuento()),
                iva_porcentaje: parseFloat(me.proformaCompleta && me.proformaCompleta.prof_iva_por || 0),
                iva_valor: parseFloat(me.calcularIVA()),
                total: parseFloat(me.calcularTotal()),
                detalles_venta: JSON.stringify(detallesParaGuardar), // Backend espera string JSON con este nombre
                usuario_id: usuario.idusuario,
                usuario_iniciales: usuario.iniciales,
                // Control de stock inteligente
                activar_todo_stock: me.activarTodoStock, // Indica si se activó la opción de usar todo el stock
                // Información adicional de la proforma completa
                cliente_ruc: me.proforma.cliente_ruc || '',
                cliente_nombre: me.proforma.cliente_nombre || '',
                despacho_id: me.proformaCompleta && me.proformaCompleta.id_ins_depacho ? parseInt(me.proformaCompleta.id_ins_depacho) : null,
                periodo_id: me.proformaCompleta && me.proforma.id_periodo ? parseInt(me.proforma.id_periodo) : null,
                // Información del pedido (necesaria para el backend)
                pedido_id: me.proformaCompleta && me.proformaCompleta.pedido_id ? parseInt(me.proformaCompleta.pedido_id) : null,
                punto_venta: me.proformaCompleta && me.proformaCompleta.idPuntoventa ? me.proformaCompleta.idPuntoventa : null,
                // Información del cliente Perseo
                ven_cliente: me.proformaCompleta && me.proformaCompleta.ven_cliente ? parseInt(me.proformaCompleta.ven_cliente) : null,
                clientesidPerseo: me.proformaCompleta && me.proformaCompleta.clientesidPerseo ? parseInt(me.proformaCompleta.clientesidPerseo) : null,
                // Usuario que crea el documento
                idusuario: usuario.idusuario,
                // Tipo de venta: V = Venta Directa (1), L = Venta por Listas (otro valor)
                tipo_venta: me.proformaCompleta && me.proformaCompleta.tipo_venta == 1 ? 'V' : 'L'
            };

            console.log('📤 Enviando documento de venta:', datosVenta);
            console.log('📦 Total de detalles:', detallesParaGuardar.length);
            console.log('📋 Primer detalle:', detallesParaGuardar[0]);
            console.log('📋 Proforma completa:', me.proformaCompleta);

            me.$http.post(me.$server_url + 'Post_Crear_Venta_Proforma', datosVenta, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    me.loading = false;
                    
                    console.log('📥 Respuesta del servidor:', res.data);
                    
                    if (res.data.status === 200 || res.data.success) {
                        // Determinar tipo de notificación según el estado de la proforma
                        const todoVendido = res.data.todo_vendido !== false; // Por defecto true si no viene
                        const estadoProforma = res.data.estado_proforma;
                        
                        let titulo = '✅ Documento Generado';
                        let mensaje = 'Documento de venta generado exitosamente';
                        let color = 'success';
                        let icono = 'icon-check-circle';
                        
                        // Si quedaron pendientes (estado 6), mostrar advertencia
                        if (estadoProforma === 6 || !todoVendido) {
                            titulo = '⚠️ Documento Generado con Pendientes';
                            mensaje = `Se generó el documento de venta exitosamente.\n\n⚠️ ATENCIÓN: La proforma tiene cantidades pendientes por vender.\n\nPodrá generar nuevos documentos de venta hasta completar todas las cantidades proformadas.`;
                            color = 'warning';
                            icono = 'icon-alert-triangle';
                        }
                        
                        me.$vs.notify({
                            title: titulo,
                            text: mensaje,
                            color: color,
                            iconPack: 'feather',
                            icon: icono,
                            time: 8000 // Mostrar más tiempo si hay pendientes
                        });
                        
                        me.$emit('actualizar');
                        me.$emit('cerrar');
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message || 'No se pudo generar el documento de venta',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.loading = false;
                    console.error('❌ Error al crear documento de venta:', err);
                    
                    // Verificar si es error de STOCK_INSUFICIENTE
                    if (err.response && err.response.data && err.response.data.error === 'STOCK_INSUFICIENTE') {
                        const productosInvalidos = err.response.data.productos_invalidos || [];
                        
                        // Construir mensaje detallado
                        let detalleProductos = '<div class="text-left">';
                        detalleProductos += '<p class="font-bold mb-2">⚠️ Los siguientes productos no tienen stock suficiente:</p>';
                        detalleProductos += '<ul class="list-disc ml-4">';
                        
                        productosInvalidos.forEach(prod => {
                            detalleProductos += `<li class="mb-1">`;
                            detalleProductos += `<strong>${prod.pro_codigo}</strong> - ${prod.pro_nombre}<br>`;
                            detalleProductos += `<span class="text-xs text-gray-600">Stock: ${prod.stock_disponible} | Necesita: ${prod.cantidad_requerida} | Falta: ${prod.faltante}</span>`;
                            detalleProductos += `</li>`;
                        });
                        
                        detalleProductos += '</ul>';
                        detalleProductos += '<p class="mt-3 text-sm text-orange-600">💡 Actualice el stock en tiempo real para continuar.</p>';
                        detalleProductos += '</div>';
                        
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'warning',
                            title: '⚠️ Stock Insuficiente',
                            text: detalleProductos,
                            accept: async () => {
                                // Recargar stocks actualizados
                                me.loadingDetalles = true;
                                await me.cargarStocksProductos();
                                await me.cargarCantidadesVendidas();
                                me.validarStockPorTipoDocumento();
                                me.loadingDetalles = false;
                                
                                me.$vs.notify({
                                    title: 'Stock Actualizado',
                                    text: 'Se han recargado los stocks en tiempo real',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            },
                            acceptText: '🔄 Actualizar Stock',
                            cancelText: 'Cerrar',
                            cancel: () => {}
                        });
                    } else {
                        // Error genérico
                        const errorMsg = err.response && err.response.data && err.response.data.message 
                            ? err.response.data.message 
                            : 'Error al generar el documento de venta';
                        me.$vs.notify({
                            title: 'Error',
                            text: errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                });
        },

        getEstadoColor(estado) {
            const colores = {
                0: 'danger',
                1: 'warning',
                2: 'success',
                3: 'dark'
            };
            return colores[estado] || 'dark';
        },

        getEstadoTexto(estado) {
            const textos = {
                0: 'Anulada',
                1: 'Pendiente',
                2: 'Aprobada',
                3: 'Rechazada'
            };
            return textos[estado] || 'Desconocido';
        },

        cerrar() {
            this.$emit('cerrar');
        }
    }
}
</script>

<style scoped>
.documento-venta-container {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
}

.label_inputs {
    font-size: 12px;
    color: black;
    margin-bottom: 5px;
    display: block;
}

.tabla-detalles {
    width: 100%;
}

.input-cantidad {
    max-width: 100px;
}

.input-cantidad >>> input {
    text-align: center;
    font-weight: bold;
}

.row-error {
    background-color: #fff5f5 !important;
}

.row-warning {
    background-color: #fffbeb !important;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999999;
}

/* Estilos para badges de stock */
.vs-chip--success {
    font-weight: bold;
}

.vs-chip--danger {
    font-weight: bold;
}
</style>
