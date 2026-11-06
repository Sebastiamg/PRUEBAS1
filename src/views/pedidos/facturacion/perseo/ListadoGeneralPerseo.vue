<template>
    <div class="listado-perseo">
        <!-- Loading con Progreso -->
        <div v-if="loading" class="text-center py-12">
            <div class="loading-spinner">
                <div class="spinner"></div>
            </div>
            <p class="text-gray-600 mt-4 font-semibold">Consultando stock de Perseo...</p>
            
            <!-- Barra de Progreso -->
            <div v-if="totalProductos > 0" class="mt-6 max-w-md mx-auto">
                <div class="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                        class="bg-primary h-full transition-all duration-300"
                        :style="{ width: progresoConsulta + '%' }"
                    ></div>
                </div>
                <p class="text-sm text-gray-600 mt-2">
                    {{ productosConsultados }} / {{ totalProductos }} productos
                    <span class="font-bold">({{ Math.round(progresoConsulta) }}%)</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                    Encontrados: <span class="text-success font-semibold">{{ productosEncontrados }}</span> | 
                    No encontrados: <span class="text-danger font-semibold">{{ productosNoEncontrados }}</span>
                </p>
            </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded">
            <p class="text-red-600 font-semibold">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ error }}
            </p>
        </div>

        <!-- Tabla de productos con stock Perseo -->
        <vs-table 
            v-else-if="productosConStock.length > 0"
            stripe 
            search 
            :data="productosConStock"
            :max-items="productosConStock.length"
        >
            <template slot="header">
                <h3 class="font-bold text-lg mb-2">
                    <i class="fas fa-warehouse mr-2 text-primary"></i>
                    Stock Perseo - {{ productosConStock.length }} productos
                </h3>
                <div class="flex items-center gap-4 mb-2">
                    <vs-chip color="success">
                        <i class="fas fa-check-circle mr-1"></i>
                        Stock Positivo: {{ stockPositivo }}
                    </vs-chip>
                    <vs-chip color="danger">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        Stock Negativo: {{ stockNegativo }}
                    </vs-chip>
                    <vs-chip color="warning">
                        <i class="fas fa-minus-circle mr-1"></i>
                        Sin Stock: {{ stockCero }}
                    </vs-chip>
                </div>
            </template>

            <template slot="thead">
                <vs-th class="fixed-column2">CÓDIGO</vs-th>
                <vs-th>DESCRIPCIÓN</vs-th>
                <vs-th>CANTIDAD<br>CONTRATO</vs-th>
                <vs-th>PRECIO</vs-th>
                <vs-th>DESCUENTO</vs-th>
                <vs-th>SUBTOTAL</vs-th>
                <vs-th>TOTAL</vs-th>
                <vs-th>STOCK<br>PERSEO</vs-th>
                <vs-th>ESTADO<br>STOCK</vs-th>
                <vs-th>DETALLES<br>PERSEO</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(libro, indextr) in data">
                    <!-- Código -->
                    <vs-td :data="libro.pro_codigo" class="fixed-column">
                        <span class="font-semibold text-primary">{{ libro.pro_codigo }}</span>
                    </vs-td>

                    <!-- Descripción -->
                    <vs-td :data="libro.pro_nombre">
                        <div class="max-w-xs">
                            <p class="font-medium">{{ libro.pro_nombre }}</p>
                            <p v-if="libro.descripcion_perseo" class="text-xs text-gray-500 mt-1">
                                {{ libro.descripcion_perseo }}
                            </p>
                        </div>
                    </vs-td>

                    <!-- Cantidad Contrato -->
                    <vs-td :data="libro.cantidad">
                        <span class="cantidad-badge">{{ libro.cantidad }}</span>
                    </vs-td>

                    <!-- Precio -->
                    <vs-td :data="libro.precio">
                        <span class="font-semibold">${{ parseFloat(libro.precio).toFixed(2) }}</span>
                    </vs-td>

                    <!-- Descuento -->
                    <vs-td :data="libro.descuento">
                        <span class="descuento-badge">{{ libro.descuento }}%</span>
                    </vs-td>

                    <!-- Subtotal -->
                    <vs-td>
                        <span class="font-semibold text-gray-700">
                            ${{ calcularSubtotalLibro(libro) }}
                        </span>
                    </vs-td>

                    <!-- Total -->
                    <vs-td>
                        <span class="font-bold text-success">
                            ${{ calcularTotalLibro(libro) }}
                        </span>
                    </vs-td>

                    <!-- Stock Perseo -->
                    <vs-td :data="libro.stock_perseo">
                        <div class="text-center">
                            <span 
                                :class="getStockClass(libro.stock_perseo)"
                                class="stock-badge"
                            >
                                {{ libro.stock_perseo !== null ? libro.stock_perseo : 'N/A' }}
                            </span>
                        </div>
                    </vs-td>

                    <!-- Estado Stock -->
                    <vs-td>
                        <div class="text-center">
                            <vs-chip 
                                :color="getEstadoStockColor(libro.stock_perseo, libro.cantidad)"
                                size="small"
                            >
                                <i :class="getEstadoStockIcon(libro.stock_perseo, libro.cantidad)" class="mr-1"></i>
                                {{ getEstadoStockTexto(libro.stock_perseo, libro.cantidad) }}
                            </vs-chip>
                        </div>
                    </vs-td>

                    <!-- Detalles Perseo -->
                    <vs-td>
                        <vs-button 
                            v-if="libro.datos_perseo"
                            color="primary" 
                            type="border" 
                            size="small"
                            @click="verDetallesPerseo(libro)"
                        >
                            <i class="fas fa-info-circle mr-1"></i>
                            Ver Info
                        </vs-button>
                        <span v-else class="text-gray-400 text-xs">Sin datos</span>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <!-- Sin productos -->
        <div v-else class="bg-gray-50 p-8 rounded text-center">
            <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
            <h3 class="text-gray-600 font-semibold mb-2">No hay productos para consultar</h3>
            <p class="text-gray-500">Seleccione un pedido para ver el stock de Perseo</p>
        </div>

        <!-- Modal de Detalles Perseo -->
        <vs-popup 
            title="Detalles del Producto en Perseo" 
            :active.sync="popupDetalles"
            fullscreen
        >
            <div v-if="productoSeleccionado" class="p-6">
                <!-- Header con información básica -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 shadow">
                    <h2 class="text-2xl font-bold text-primary mb-2">
                        {{ productoSeleccionado.pro_nombre }}
                    </h2>
                    <p class="text-sm text-gray-600">Código: <strong>{{ productoSeleccionado.pro_codigo }}</strong></p>
                    <p v-if="productoSeleccionado.descripcion_perseo" class="text-sm text-gray-700 mt-2">
                        {{ productoSeleccionado.descripcion_perseo }}
                    </p>
                </div>

                <!-- Grid de información -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <!-- Stock -->
                    <div class="bg-white p-4 rounded-lg shadow border-l-4 border-primary">
                        <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Stock Perseo</p>
                        <p :class="getStockClass(productoSeleccionado.stock_perseo)" class="text-3xl font-bold">
                            {{ productoSeleccionado.stock_perseo !== null ? productoSeleccionado.stock_perseo : 'N/A' }}
                        </p>
                    </div>

                    <!-- Precio -->
                    <div class="bg-white p-4 rounded-lg shadow border-l-4 border-success">
                        <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Precio Contrato</p>
                        <p class="text-3xl font-bold text-success">
                            ${{ parseFloat(productoSeleccionado.precio).toFixed(2) }}
                        </p>
                    </div>

                    <!-- Cantidad Contrato -->
                    <div class="bg-white p-4 rounded-lg shadow border-l-4 border-warning">
                        <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Cantidad Contrato</p>
                        <p class="text-3xl font-bold text-warning">
                            {{ productoSeleccionado.cantidad }}
                        </p>
                    </div>
                </div>

                <!-- Datos completos de Perseo -->
                <div v-if="productoSeleccionado.datos_perseo" class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i class="fas fa-database mr-2 text-primary"></i>
                        Información Completa de Perseo
                    </h3>
                    
                    <!-- Información General -->
                    <div class="mb-6">
                        <h4 class="font-bold text-primary mb-3 border-b pb-2">Información General</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Producto ID</p>
                                <p class="font-semibold">{{ productoSeleccionado.datos_perseo.productosid }}</p>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Código de Barras</p>
                                <p class="font-semibold">{{ productoSeleccionado.datos_perseo.barras || 'N/A' }}</p>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Estado</p>
                                <vs-chip :color="productoSeleccionado.datos_perseo.estado ? 'success' : 'danger'" size="small">
                                    {{ productoSeleccionado.datos_perseo.estado ? 'Activo' : 'Inactivo' }}
                                </vs-chip>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Disponible para Venta</p>
                                <vs-chip :color="productoSeleccionado.datos_perseo.venta ? 'success' : 'danger'" size="small">
                                    {{ productoSeleccionado.datos_perseo.venta ? 'Sí' : 'No' }}
                                </vs-chip>
                            </div>
                        </div>
                    </div>

                    <!-- Costos -->
                    <div class="mb-6">
                        <h4 class="font-bold text-primary mb-3 border-b pb-2">Costos</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-green-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Costo Actual</p>
                                <p class="font-bold text-success">${{ parseFloat(productoSeleccionado.datos_perseo.costoactual || 0).toFixed(4) }}</p>
                            </div>
                            <div class="bg-blue-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Costo Estándar</p>
                                <p class="font-bold text-primary">${{ parseFloat(productoSeleccionado.datos_perseo.costoestandar || 0).toFixed(4) }}</p>
                            </div>
                            <div class="bg-orange-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Costo Última Compra</p>
                                <p class="font-bold text-warning">${{ parseFloat(productoSeleccionado.datos_perseo.costoultimacompra || 0).toFixed(4) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Control de Inventario -->
                    <div class="mb-6">
                        <h4 class="font-bold text-primary mb-3 border-b pb-2">Control de Inventario</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Control Negativos</p>
                                <vs-chip :color="productoSeleccionado.datos_perseo.controlnegativos ? 'success' : 'danger'" size="small">
                                    {{ productoSeleccionado.datos_perseo.controlnegativos ? 'Permitido' : 'No Permitido' }}
                                </vs-chip>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Control Precios</p>
                                <vs-chip :color="productoSeleccionado.datos_perseo.controlprecios ? 'success' : 'danger'" size="small">
                                    {{ productoSeleccionado.datos_perseo.controlprecios ? 'Activo' : 'Inactivo' }}
                                </vs-chip>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="text-xs text-gray-500 mb-1">Tipo</p>
                                <p class="font-semibold">
                                    {{ getTipoProducto(productoSeleccionado.datos_perseo) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Tarifas -->
                    <div v-if="productoSeleccionado.datos_perseo.tarifas && productoSeleccionado.datos_perseo.tarifas.length > 0">
                        <h4 class="font-bold text-primary mb-3 border-b pb-2">Tarifas de Venta</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div 
                                v-for="(tarifa, index) in productoSeleccionado.datos_perseo.tarifas" 
                                :key="index"
                                class="bg-indigo-50 p-3 rounded border border-indigo-200"
                            >
                                <p class="font-semibold text-indigo-700 mb-2">{{ tarifa.tarifadescripcion }}</p>
                                <p class="text-sm">Precio: <strong>${{ parseFloat(tarifa.precio || 0).toFixed(2) }}</strong></p>
                                <p class="text-sm">Con IVA: <strong>${{ parseFloat(tarifa.precioiva || 0).toFixed(2) }}</strong></p>
                                <p class="text-sm">Descuento: <strong>{{ tarifa.descuento || 0 }}%</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
export default {
    name: 'ListadoGeneralPerseo',
    props: {
        librosPedido: {
            type: Array,
            default: () => []
        },
        idEmpresa: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            productosConStock: [],
            popupDetalles: false,
            productoSeleccionado: null,
            // Variables para progreso
            totalProductos: 0,
            productosConsultados: 0,
            productosEncontrados: 0,
            productosNoEncontrados: 0,
            progresoConsulta: 0
        }
    },
    computed: {
        stockPositivo() {
            return this.productosConStock.filter(p => p.stock_perseo > 0).length;
        },
        stockNegativo() {
            return this.productosConStock.filter(p => p.stock_perseo < 0).length;
        },
        stockCero() {
            return this.productosConStock.filter(p => p.stock_perseo === 0).length;
        }
    },
    watch: {
        librosPedido: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.consultarStockPerseo();
                } else {
                    this.productosConStock = [];
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        async consultarStockPerseo() {
            let me = this;
            
            if (!me.librosPedido || me.librosPedido.length === 0) {
                me.productosConStock = [];
                return;
            }
            
            me.loading = true;
            me.error = null;
            
            // Resetear progreso
            me.totalProductos = me.librosPedido.length;
            me.productosConsultados = 0;
            me.productosEncontrados = 0;
            me.productosNoEncontrados = 0;
            me.progresoConsulta = 0;
            
            try {
                // Extraer todos los códigos de productos
                const codigos = me.librosPedido.map(libro => libro.pro_codigo);
                
                console.log('Consultando stock Perseo para:', codigos.length, 'productos');
                console.log('Modo: PRODUCTO POR PRODUCTO para progreso en tiempo real');
                
                const mapaProductosPerseo = {};
                const url = `${me.$server_url}api/perseo/productos/productos_consulta_x_id`;
                
                // CONSULTA PRODUCTO POR PRODUCTO para progreso REAL
                for (let i = 0; i < codigos.length; i++) {
                    const codigo = codigos[i];
                    
                    try {
                        // Consultar UN producto
                        const response = await me.$http.post(url, {
                            id_empresa: me.idEmpresa,
                            codigos: [codigo] // Array de UN solo código
                        });
                        
                        // Procesar respuesta
                        if (response.data.productos && response.data.productos.length > 0) {
                            const producto = response.data.productos[0];
                            mapaProductosPerseo[producto.productocodigo] = producto;
                            me.productosEncontrados++;
                        } else {
                            me.productosNoEncontrados++;
                        }
                        
                    } catch (error) {
                        console.error(`Error consultando producto ${codigo}:`, error);
                        me.productosNoEncontrados++;
                    }
                    
                    // Actualizar progreso después de CADA producto
                    me.productosConsultados++;
                    me.progresoConsulta = (me.productosConsultados / me.totalProductos) * 100;
                    
                    // Log cada 10 productos
                    if (me.productosConsultados % 10 === 0 || me.productosConsultados === me.totalProductos) {
                        console.log(`Progreso: ${me.productosConsultados}/${me.totalProductos} (${Math.round(me.progresoConsulta)}%) - Encontrados: ${me.productosEncontrados}`);
                    }
                    
                    // Pequeña pausa para no saturar (50ms entre productos)
                    if (i < codigos.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
                
                // Combinar datos del contrato con datos de Perseo
                me.productosConStock = me.librosPedido.map(libro => {
                    const datoPerseo = mapaProductosPerseo[libro.pro_codigo];
                    
                    return {
                        ...libro,
                        stock_perseo: datoPerseo ? datoPerseo.existenciastotales : null,
                        descripcion_perseo: datoPerseo ? datoPerseo.descripcion : null,
                        datos_perseo: datoPerseo || null
                    };
                });
                
                console.log('✅ Consulta completada:', {
                    total: me.totalProductos,
                    encontrados: me.productosEncontrados,
                    no_encontrados: me.productosNoEncontrados
                });
                
                // Mostrar notificación de resumen
                me.$vs.notify({
                    title: 'Consulta Completada',
                    text: `${me.productosEncontrados} productos encontrados, ${me.productosNoEncontrados} no encontrados`,
                    color: me.productosEncontrados > 0 ? 'success' : 'warning',
                    icon: 'icon-check'
                });
                
            } catch (error) {
                console.error('Error al consultar stock Perseo:', error);
                me.error = 'Error al consultar el stock de Perseo. Por favor, intente nuevamente.';
                me.$vs.notify({
                    title: 'Error',
                    text: me.error,
                    color: 'danger',
                    icon: 'icon-alert-circle'
                });
            } finally {
                me.loading = false;
            }
        },
        
        calcularSubtotalLibro(libro) {
            const precio = parseFloat(libro.precio) || 0;
            const cantidad = parseInt(libro.cantidad) || 0;
            const subtotal = precio * cantidad;
            return subtotal.toFixed(2);
        },
        
        calcularTotalLibro(libro) {
            const subtotal = parseFloat(this.calcularSubtotalLibro(libro));
            const descuento = parseFloat(libro.descuento) || 0;
            const montoDescuento = subtotal * (descuento / 100);
            const total = subtotal - montoDescuento;
            return total.toFixed(2);
        },
        
        getStockClass(stock) {
            if (stock === null || stock === undefined) return 'text-gray-400';
            if (stock < 0) return 'text-danger font-bold';
            if (stock === 0) return 'text-warning font-bold';
            return 'text-success font-bold';
        },
        
        getEstadoStockColor(stock, cantidadContrato) {
            if (stock === null || stock === undefined) return 'dark';
            if (stock < 0) return 'danger';
            if (stock === 0) return 'warning';
            if (stock < cantidadContrato) return 'warning';
            return 'success';
        },
        
        getEstadoStockIcon(stock, cantidadContrato) {
            if (stock === null || stock === undefined) return 'fas fa-question-circle';
            if (stock < 0) return 'fas fa-exclamation-triangle';
            if (stock === 0) return 'fas fa-minus-circle';
            if (stock < cantidadContrato) return 'fas fa-exclamation-circle';
            return 'fas fa-check-circle';
        },
        
        getEstadoStockTexto(stock, cantidadContrato) {
            if (stock === null || stock === undefined) return 'Sin Datos';
            if (stock < 0) return 'NEGATIVO';
            if (stock === 0) return 'Sin Stock';
            if (stock < cantidadContrato) return 'Insuficiente';
            return 'Disponible';
        },
        
        verDetallesPerseo(libro) {
            this.productoSeleccionado = libro;
            this.popupDetalles = true;
        },
        
        getTipoProducto(datoPerseo) {
            if (datoPerseo.servicio) return 'Servicio';
            if (datoPerseo.bien) return 'Bien';
            if (datoPerseo.series) return 'Serie';
            if (datoPerseo.vehiculos) return 'Vehículo';
            return 'Producto';
        }
    }
}
</script>

<style scoped>
.listado-perseo {
    padding: 20px;
}

.stock-badge {
    font-size: 18px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 6px;
    display: inline-block;
    min-width: 60px;
}

.cantidad-badge {
    background-color: #dbeafe;
    color: #1e40af;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 4px;
    display: inline-block;
}

.descuento-badge {
    background-color: #fef3c7;
    color: #92400e;
    font-size: 12px;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 4px;
    display: inline-block;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.fixed-column {
    position: sticky;
    left: 0;
    background-color: white;
    z-index: 1;
}

.fixed-column2 {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 2;
}

.grid {
    display: grid;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-4 {
    gap: 1rem;
}

@media (min-width: 768px) {
    .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 1024px) {
    .lg\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
</style>
