<template>
    <div class="comparativo-ventas-facturas">
        <div v-if="isLoading" class="text-center py-8">
            <vs-progress indeterminate color="primary"></vs-progress>
            <p class="mt-4 text-gray-600">Cargando datos del comparativo...</p>
        </div>

        <div v-else>
            <!-- Totales Generales al Principio -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">Resumen General</h2>
                    <vs-button 
                        color="success" 
                        type="filled" 
                        icon-pack="feather" 
                        icon="icon-download"
                        @click="descargarExcel"
                    >
                        Descargar Excel
                    </vs-button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
                        <h3 class="text-sm font-semibold text-blue-700 uppercase mb-2">Total Prefacturas</h3>
                        <p class="text-3xl font-bold text-blue-900">{{ totalPrefacturas }}</p>
                        <p class="text-xs text-gray-600 mt-1">Bruto: <b>${{ totalesGenerales.prefacturas.bruto.toFixed(2) }}</b></p>
                        <p class="text-xs text-gray-600 mt-1">Neto: ${{ totalesGenerales.prefacturas.neto.toFixed(2) }}</p>
                    </div>
                    <div class="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
                        <h3 class="text-sm font-semibold text-red-700 uppercase mb-2">Total Devoluciones</h3>
                        <p class="text-xs text-gray-600 mt-1">Bruto: <b>${{ totalesGenerales.devoluciones.bruto.toFixed(2) }}</b></p>
                        <p class="text-xs text-gray-600 mt-1">Neto: <b>${{ totalesGenerales.devoluciones.neto.toFixed(2) }}</b></p>
                    </div>
                    <div class="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                        <h3 class="text-sm font-semibold text-green-700 uppercase mb-2">Total Facturas Reales</h3>
                        <p class="text-3xl font-bold text-green-900">{{ totalFacturas }}</p>
                        <p class="text-xs text-gray-600 mt-1">Bruto: <b>${{ totalesGenerales.facturas.bruto.toFixed(2) }}</b></p>
                        <p class="text-xs text-gray-600 mt-1">Neto: <b>${{ totalesGenerales.facturas.neto.toFixed(2) }}</b></p>
                    </div>
                    <div class="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
                        <h3 class="text-sm font-semibold text-orange-700 uppercase mb-2">Diferencia Total</h3>
                        <p class="text-xs text-gray-600 mt-1">Bruto: <b>${{ totalesGenerales.diferencia.bruto.toFixed(2) }}</b></p>
                        <p class="text-xs text-gray-600 mt-1" :class="totalesGenerales.diferencia.neto >= 0 ? 'text-orange-600' : 'text-red-600'">
                            Neto: <b>${{ totalesGenerales.diferencia.neto.toFixed(2) }}</b>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Comparativo por Empresa con Collapse -->
            <div v-for="(empresaData, empresaNombre) in datosComparativosPorEmpresa" :key="empresaNombre" class="mb-6">
                <vx-card>
                    <!-- Totales por Empresa - Siempre Visible -->
                    <div class="bg-white rounded-lg p-4 border-2 mb-2" :class="empresaNombre === 'PROLIPA' ? 'border-blue-300' : 'border-green-300'">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3">
                            <span :class="empresaNombre === 'PROLIPA' ? 'text-blue-700' : 'text-green-700'">
                                {{ empresaNombre }}
                            </span> - Totales Financieros
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <h5 class="text-xs font-semibold text-blue-700 uppercase mb-2">Totales Prefacturas</h5>
                                <div class="space-y-1">
                                    <p class="text-xs">Bruto: <b>${{ empresaData.totales_financieros.prefacturas.bruto.toFixed(2) }}</b></p>
                                    <p class="text-xs">Descuento: <b>${{ empresaData.totales_financieros.prefacturas.descuento.toFixed(2) }}</b></p>
                                    <p class="text-base font-bold text-primary">Neto: ${{ empresaData.totales_financieros.prefacturas.neto.toFixed(2) }}</p>
                                </div>
                            </div>
                            
                            <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                                <h5 class="text-xs font-semibold text-red-700 uppercase mb-2">Devoluciones</h5>
                                <div class="space-y-1">
                                    <p class="text-xs">Bruto: <b>-${{ empresaData.totales_financieros.devoluciones.bruto.toFixed(2) }}</b></p>
                                    <p class="text-base font-bold text-danger">Neto: -${{ empresaData.totales_financieros.devoluciones.neto.toFixed(2) }}</p>
                                </div>
                            </div>
                            
                            <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                                <h5 class="text-xs font-semibold text-green-700 uppercase mb-2">Totales Facturas Reales</h5>
                                <div class="space-y-1">
                                    <p class="text-xs">Bruto: <b>${{ empresaData.totales_financieros.facturas.bruto.toFixed(2) }}</b></p>
                                    <p class="text-xs">Descuento: <b>${{ empresaData.totales_financieros.facturas.descuento.toFixed(2) }}</b></p>
                                    <p class="text-base font-bold text-success">Neto: ${{ empresaData.totales_financieros.facturas.neto.toFixed(2) }}</p>
                                </div>
                            </div>
                            
                            <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                <h5 class="text-xs font-semibold text-orange-700 uppercase mb-2">Diferencia</h5>
                                <div class="space-y-1">
                                    <p class="text-xs">Bruto: <b>${{ (empresaData.totales_financieros.prefacturas.bruto - empresaData.totales_financieros.devoluciones.bruto - empresaData.totales_financieros.facturas.bruto).toFixed(2) }}</b></p>
                                    <p class="text-base font-bold" :class="empresaData.totales.diferencia_neto >= 0 ? 'text-warning' : 'text-danger'">
                                        Neto: ${{ empresaData.totales.diferencia_neto.toFixed(2) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Collapse para la Tabla -->
                    <vs-collapse type="border">
                        <vs-collapse-item>
                            <div slot="header" class="flex justify-between items-center w-full py-2">
                                <div class="flex items-center">
                                    <span class="font-bold text-lg mr-3" :class="empresaNombre === 'PROLIPA' ? 'text-blue-700' : 'text-green-700'">
                                        {{ empresaNombre }}
                                    </span>
                                    <vs-chip :color="empresaNombre === 'PROLIPA' ? 'primary' : 'success'" class="mr-2">
                                        {{ empresaData.productos.length }} Productos
                                    </vs-chip>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <span class="mr-4">
                                        Diferencia Neto: 
                                        <span class="font-bold" :class="empresaData.totales.diferencia_neto >= 0 ? 'text-orange-600' : 'text-red-600'">
                                            ${{ empresaData.totales.diferencia_neto.toFixed(2) }}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <!-- Tabla comparativa por empresa -->
                            <vs-table 
                                :data="empresaData.productos" 
                                search 
                                no-data-text="No hay datos disponibles"
                                class="mt-3 tabla-scroll"
                            >
                                <template slot="header">
                                    <div class="flex justify-between items-center w-full">
                                        <vs-chip :color="empresaNombre === 'PROLIPA' ? 'primary' : 'success'">
                                            Total Productos: <b>{{ empresaData.productos.length }}</b>
                                        </vs-chip>
                                        <div class="text-sm">
                                            <span class="mr-4">Prefacturas Neto: <b>${{ empresaData.totales_financieros.prefacturas.neto.toFixed(2) }}</b></span>
                                            <span class="mr-4 text-danger">Devoluciones Neto: <b>-${{ empresaData.totales_financieros.devoluciones.neto.toFixed(2) }}</b></span>
                                            <span>Facturas Neto: <b>${{ empresaData.totales_financieros.facturas.neto.toFixed(2) }}</b></span>
                                        </div>
                                    </div>
                                </template>

                                <template slot="thead">
                                    <vs-th sort-key="pro_codigo">Código</vs-th>
                                    <vs-th sort-key="nombre">Producto</vs-th>
                                    <vs-th sort-key="cant_prefacturas">Cant. Vendido</vs-th>
                                    <vs-th sort-key="valor_u_prefacturas">Precio</vs-th>
                                    <vs-th sort-key="descuento_devolucion">Desc. %</vs-th>
                                    <vs-th sort-key="devoluciones">Cant. Devuelto</vs-th>
                                    <vs-th sort-key="cant_facturas">Cant. Facturado</vs-th>
                                    <vs-th sort-key="descuento_factura">Desc. Fact. %</vs-th>
                                    <vs-th sort-key="diferencia_cant">Disponible</vs-th>
                                </template>

                                <template slot-scope="{ data }">
                                    <vs-tr 
                                        v-for="(item, index) in data" 
                                        :key="index"
                                    >
                                        <!-- :state="item.diferencia_cant !== 0 ? 'warning' : null" -->
                                        <vs-td><b>{{ item.pro_codigo }}</b></vs-td>
                                        <vs-td><b>{{ item.nombre }}</b></vs-td>
                                        <vs-td>
                                            <vs-chip color="primary">
                                                {{ item.cant_prefacturas }}
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td>${{ item.valor_u_prefacturas.toFixed(2) }}</vs-td>
                                        <vs-td>
                                            <vs-chip :color="item.descuento_devolucion > 0 ? 'warning' : 'dark'">
                                                {{ item.descuento_devolucion }}%
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip :color="item.devoluciones > 0 ? 'danger' : 'dark'">
                                                {{ item.devoluciones }}
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip color="success">
                                                {{ item.cant_facturas }}
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip :color="item.descuento_factura > 0 ? 'warning' : 'dark'">
                                                {{ item.descuento_factura }}%
                                            </vs-chip>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip 
                                                :color="item.diferencia_cant === 0 ? 'success' : item.diferencia_cant > 0 ? 'warning' : 'danger'"
                                            >
                                                {{ item.diferencia_cant }}
                                            </vs-chip>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </vs-collapse-item>
                    </vs-collapse>
                </vx-card>
            </div>

            <!-- Totales Consolidados al Final -->
            <!-- <div class="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Totales Consolidados (Todas las Empresas)</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600 mb-2">Totales Prefacturas</h4>
                        <div class="space-y-1">
                            <p class="text-sm">Subtotal: <b>${{ totalesPrefacturas.subtotal.toFixed(2) }}</b></p>
                            <p class="text-sm">Descuento: <b>${{ totalesPrefacturas.descuento.toFixed(2) }}</b></p>
                            <p class="text-lg font-bold text-primary">Total: ${{ totalesPrefacturas.total.toFixed(2) }}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600 mb-2">Totales Facturas Reales</h4>
                        <div class="space-y-1">
                            <p class="text-sm">Subtotal: <b>${{ totalesFacturas.subtotal.toFixed(2) }}</b></p>
                            <p class="text-sm">Descuento: <b>${{ totalesFacturas.descuento.toFixed(2) }}</b></p>
                            <p class="text-lg font-bold text-success">Total: ${{ totalesFacturas.total.toFixed(2) }}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600 mb-2">Diferencia</h4>
                        <div class="space-y-1">
                            <p class="text-sm">Subtotal: <b>${{ (totalesPrefacturas.subtotal - totalesFacturas.subtotal).toFixed(2) }}</b></p>
                            <p class="text-sm">Descuento: <b>${{ (totalesPrefacturas.descuento - totalesFacturas.descuento).toFixed(2) }}</b></p>
                            <p class="text-lg font-bold" :class="diferenciaTotales >= 0 ? 'text-warning' : 'text-danger'">
                                Diferencia: ${{ diferenciaTotales.toFixed(2) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
    name: 'ComparativoVentasFacturas',
    props: {
        prefacturas: {
            type: Array,
            required: true,
            default: () => []
        },
        facturas: {
            type: Array,
            required: true,
            default: () => []
        },
        cliente: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isLoading: false,
            datosComparativosPorEmpresa: {},
            detallesPrefacturas: [],
            detallesFacturas: [],
            devolucionesPrefacturas: [],
            totalesGenerales: {
                prefacturas: 0,
                facturas: 0,
                diferencia: 0
            },
            totalesPrefacturas: {
                subtotal: 0,
                descuento: 0,
                total: 0
            },
            totalesFacturas: {
                subtotal: 0,
                descuento: 0,
                total: 0
            }
        }
    },
    computed: {
        totalPrefacturas() {
            return this.prefacturas.length
        },
        totalFacturas() {
            return this.facturas.length
        },
        totalProductosUnicos() {
            let productos = new Set()
            Object.values(this.datosComparativosPorEmpresa).forEach(empresaData => {
                empresaData.productos.forEach(producto => {
                    productos.add(producto.pro_codigo)
                })
            })
            return productos.size
        },
        diferenciaTotales() {
            return this.totalesPrefacturas.total - this.totalesFacturas.total
        }
    },
    watch: {
        prefacturas: {
            handler() {
                this.cargarDatosComparativos()
            },
            deep: true
        },
        facturas: {
            handler() {
                this.cargarDatosComparativos()
            },
            deep: true
        }
    },
    mounted() {
        this.cargarDatosComparativos()
    },
    methods: {
        async cargarDatosComparativos() {
            if (this.prefacturas.length === 0 && this.facturas.length === 0) {
                return
            }

            this.isLoading = true

            try {
                // Obtener detalles de prefacturas
                await this.obtenerDetallesPrefacturas()
                
                // Obtener devoluciones de prefacturas
                await this.obtenerDevolucionesPrefacturas()
                
                // Obtener detalles de facturas
                await this.obtenerDetallesFacturas()
                
                // Comparar y crear datos comparativos
                this.generarComparativo()
                
                // Calcular totales
                this.calcularTotales()
                
            } catch (error) {
                console.error('Error al cargar datos comparativos:', error)
                this.$vs.notify({
                    title: 'Error',
                    text: 'Error al cargar los datos comparativos',
                    color: 'danger',
                    icon: 'error'
                })
            } finally {
                this.isLoading = false
            }
        },
        
        async obtenerDetallesPrefacturas() {
            if (this.prefacturas.length === 0) {
                this.detallesPrefacturas = []
                return
            }

            // Extraer ven_codigo y id_empresa de cada prefactura
            const ventasCodigos = this.prefacturas.map(p => ({
                ven_codigo: p.ven_codigo,
                id_empresa: p.id_empresa
            }))

            let formData = new FormData()
            formData.append('ventas', JSON.stringify(ventasCodigos))

            const response = await this.$http.post(
                this.$server_url + 'pedidosSecuencia/comparativo/detalles-prefacturas',
                formData
            )

            this.detallesPrefacturas = response.data.detalles || []
        },
        
        async obtenerDevolucionesPrefacturas() {
            if (this.prefacturas.length === 0) {
                this.devolucionesPrefacturas = []
                return
            }

            // Obtener devoluciones para cada prefactura
            const promesas = this.prefacturas.map(prefactura => {
                return this.$http.get(
                    this.$server_url + 'Get_PREFactura',
                    {
                        params: {
                            ven_codigo: prefactura.ven_codigo,
                            idemp: prefactura.id_empresa
                        }
                    }
                ).then(response => {
                    return {
                        ven_codigo: prefactura.ven_codigo,
                        id_empresa: prefactura.id_empresa,
                        detalles: response.data || []
                    }
                }).catch(error => {
                    console.error('Error al obtener devoluciones:', error)
                    return {
                        ven_codigo: prefactura.ven_codigo,
                        id_empresa: prefactura.id_empresa,
                        detalles: []
                    }
                })
            })

            const resultados = await Promise.all(promesas)
            
            // Aplanar los resultados en un solo array
            this.devolucionesPrefacturas = []
            resultados.forEach(resultado => {
                resultado.detalles.forEach(detalle => {
                    this.devolucionesPrefacturas.push({
                        ...detalle,
                        ven_codigo: resultado.ven_codigo,
                        id_empresa: resultado.id_empresa
                    })
                })
            })
        },
        
        async obtenerDetallesFacturas() {
            if (this.facturas.length === 0) {
                this.detallesFacturas = []
                return
            }

            // Extraer id_factura y id_empresa de cada factura
            const facturasIds = this.facturas.map(f => ({
                id_factura: f.id_factura,
                id_empresa: f.id_empresa
            }))

            let formData = new FormData()
            formData.append('facturas', JSON.stringify(facturasIds))

            const response = await this.$http.post(
                this.$server_url + 'pedidosSecuencia/comparativo/detalles-facturas',
                formData
            )

            this.detallesFacturas = response.data.detalles || []
        },
        
        generarComparativo() {
            // Agrupar detalles de prefacturas por empresa y producto
            const prefacturasPorEmpresa = {}
            this.detallesPrefacturas.forEach(detalle => {
                const empresaKey = detalle.id_empresa
                if (!prefacturasPorEmpresa[empresaKey]) {
                    prefacturasPorEmpresa[empresaKey] = {}
                }
                
                if (!prefacturasPorEmpresa[empresaKey][detalle.pro_codigo]) {
                    prefacturasPorEmpresa[empresaKey][detalle.pro_codigo] = {
                        pro_codigo: detalle.pro_codigo,
                        nombre: detalle.nombre || 'Sin nombre',
                        cantidad: 0,
                        valor_unitario: detalle.det_ven_valor_u || 0,
                        total: 0
                    }
                }
                prefacturasPorEmpresa[empresaKey][detalle.pro_codigo].cantidad += parseInt(detalle.det_ven_cantidad || 0)
                prefacturasPorEmpresa[empresaKey][detalle.pro_codigo].total += 
                    parseFloat(detalle.det_ven_valor_u || 0) * parseInt(detalle.det_ven_cantidad || 0)
            })

            // Agrupar devoluciones de prefacturas por empresa y producto
            const devolucionesPorEmpresa = {}
            this.devolucionesPrefacturas.forEach(detalle => {
                const empresaKey = detalle.id_empresa
                if (!devolucionesPorEmpresa[empresaKey]) {
                    devolucionesPorEmpresa[empresaKey] = {}
                }
                
                if (!devolucionesPorEmpresa[empresaKey][detalle.pro_codigo]) {
                    devolucionesPorEmpresa[empresaKey][detalle.pro_codigo] = {
                        cantidad: 0,
                        valor_bruto: 0,
                        valor_neto: 0,
                        descuento_por: detalle.ven_desc_por || 0
                    }
                }
                
                const cantidadDev = parseInt(detalle.det_ven_dev || 0)
                const precio = parseFloat(detalle.precio || detalle.det_ven_valor_u || 0)
                const descuentoPor = parseFloat(detalle.ven_desc_por || 0)
                
                // Valor bruto de la devolución
                const valorBrutoDev = cantidadDev * precio
                // Valor neto de la devolución (aplicando descuento)
                const valorNetoDev = valorBrutoDev - (valorBrutoDev * descuentoPor / 100)
                
                devolucionesPorEmpresa[empresaKey][detalle.pro_codigo].cantidad += cantidadDev
                devolucionesPorEmpresa[empresaKey][detalle.pro_codigo].valor_bruto += valorBrutoDev
                devolucionesPorEmpresa[empresaKey][detalle.pro_codigo].valor_neto += valorNetoDev
            })

            // Agrupar detalles de facturas por empresa y producto
            // IMPORTANTE: Aplicar lógica de facturación cruzada
            const facturasPorEmpresa = {}
            this.detallesFacturas.forEach(detalle => {
                // Si factura_cruzada = 1, usar empresa_cruzada; sino, usar id_empresa
                let empresaKey = detalle.id_empresa
                if (detalle.factura_cruzada == 1 && detalle.empresa_cruzada) {
                    empresaKey = detalle.empresa_cruzada
                }
                
                if (!facturasPorEmpresa[empresaKey]) {
                    facturasPorEmpresa[empresaKey] = {}
                }
                
                if (!facturasPorEmpresa[empresaKey][detalle.pro_codigo]) {
                    facturasPorEmpresa[empresaKey][detalle.pro_codigo] = {
                        pro_codigo: detalle.pro_codigo,
                        nombre: detalle.nombre || 'Sin nombre',
                        cantidad: 0,
                        valor_unitario: detalle.det_ven_valor_u || 0,
                        total: 0,
                        descuento_por: detalle.ven_desc_por || 0
                    }
                }
                facturasPorEmpresa[empresaKey][detalle.pro_codigo].cantidad += parseInt(detalle.det_ven_cantidad || 0)
                facturasPorEmpresa[empresaKey][detalle.pro_codigo].total += 
                    parseFloat(detalle.det_ven_valor_u || 0) * parseInt(detalle.det_ven_cantidad || 0)
                // Mantener el descuento (en caso de que haya múltiples detalles, se mantiene el último)
                if (detalle.ven_desc_por) {
                    facturasPorEmpresa[empresaKey][detalle.pro_codigo].descuento_por = parseFloat(detalle.ven_desc_por)
                }
            })

            // Obtener todas las empresas únicas
            const todasEmpresas = new Set([
                ...Object.keys(prefacturasPorEmpresa),
                ...Object.keys(facturasPorEmpresa)
            ])

            // Generar comparativo por empresa
            this.datosComparativosPorEmpresa = {}
            
            todasEmpresas.forEach(empresaId => {
                const empresaNombre = empresaId == 1 ? 'PROLIPA' : 'CALMED'
                
                const productosPrefacturas = prefacturasPorEmpresa[empresaId] || {}
                const productosFacturas = facturasPorEmpresa[empresaId] || {}
                
                // Obtener todos los códigos de producto de esta empresa
                const todosCodigos = new Set([
                    ...Object.keys(productosPrefacturas),
                    ...Object.keys(productosFacturas)
                ])

                const productosEmpresa = []
                let totalPrefacturas = 0
                let totalFacturas = 0
                let totalDevolucionesBruto = 0
                let totalDevolucionesNeto = 0
                
                todosCodigos.forEach(codigo => {
                    const prefac = productosPrefacturas[codigo] || { 
                        cantidad: 0, 
                        valor_unitario: 0, 
                        total: 0,
                        nombre: 'Sin nombre'
                    }
                    const fact = productosFacturas[codigo] || { 
                        cantidad: 0, 
                        valor_unitario: 0, 
                        total: 0,
                        nombre: 'Sin nombre'
                    }
                    
                    // Obtener devoluciones para este producto
                    const devolucionData = devolucionesPorEmpresa[empresaId] && devolucionesPorEmpresa[empresaId][codigo] 
                        ? devolucionesPorEmpresa[empresaId][codigo]
                        : { cantidad: 0, valor_bruto: 0, valor_neto: 0, descuento_por: 0 }

                    totalPrefacturas += prefac.total
                    totalFacturas += fact.total
                    totalDevolucionesBruto += devolucionData.valor_bruto
                    totalDevolucionesNeto += devolucionData.valor_neto

                    productosEmpresa.push({
                        pro_codigo: codigo,
                        nombre: prefac.nombre || fact.nombre,
                        cant_prefacturas: prefac.cantidad,
                        devoluciones: devolucionData.cantidad,
                        descuento_devolucion: devolucionData.descuento_por || 0,
                        valor_devolucion_bruto: devolucionData.valor_bruto,
                        valor_devolucion_neto: devolucionData.valor_neto,
                        valor_u_prefacturas: prefac.valor_unitario,
                        total_prefacturas: prefac.total,
                        cant_facturas: fact.cantidad,
                        descuento_factura: fact.descuento_por || 0,
                        valor_u_facturas: fact.valor_unitario,
                        total_facturas: fact.total,
                        diferencia_cant: prefac.cantidad - devolucionData.cantidad - fact.cantidad,
                        diferencia_valor: prefac.total - devolucionData.valor_neto - fact.total
                    })
                })

                // Ordenar por diferencia (primero los que tienen diferencia)
                productosEmpresa.sort((a, b) => {
                    if (Math.abs(b.diferencia_cant) !== Math.abs(a.diferencia_cant)) {
                        return Math.abs(b.diferencia_cant) - Math.abs(a.diferencia_cant)
                    }
                    return a.pro_codigo.localeCompare(b.pro_codigo)
                })

                // Calcular totales financieros por empresa
                const prefacturasEmpresa = this.prefacturas.filter(p => p.id_empresa == empresaId)
                
                // Para facturas: considerar facturación cruzada
                const facturasEmpresa = this.facturas.filter(f => {
                    // Si la factura está cruzada, verificar si empresa_cruzada coincide
                    if (f.factura_cruzada == 1 && f.empresa_cruzada) {
                        return f.empresa_cruzada == empresaId
                    }
                    // Si no está cruzada, verificar id_empresa normal
                    return f.id_empresa == empresaId
                })

                this.datosComparativosPorEmpresa[empresaNombre] = {
                    id_empresa: empresaId,
                    productos: productosEmpresa,
                    totales: {
                        total_prefacturas_neto: totalPrefacturas,
                        total_devoluciones_bruto: totalDevolucionesBruto,
                        total_devoluciones_neto: totalDevolucionesNeto,
                        total_facturas_neto: totalFacturas,
                        diferencia_neto: totalPrefacturas - totalDevolucionesNeto - totalFacturas
                    },
                    totales_financieros: {
                        prefacturas: {
                            bruto: prefacturasEmpresa.reduce((sum, p) => sum + parseFloat(p.ven_subtotal || 0), 0),
                            descuento: prefacturasEmpresa.reduce((sum, p) => sum + parseFloat(p.ven_descuento || 0), 0),
                            neto: prefacturasEmpresa.reduce((sum, p) => sum + parseFloat(p.ven_valor || 0), 0)
                        },
                        devoluciones: {
                            bruto: totalDevolucionesBruto,
                            neto: totalDevolucionesNeto
                        },
                        facturas: {
                            bruto: facturasEmpresa.reduce((sum, f) => sum + parseFloat(f.ven_subtotal || 0), 0),
                            descuento: facturasEmpresa.reduce((sum, f) => sum + parseFloat(f.ven_descuento || 0), 0),
                            neto: facturasEmpresa.reduce((sum, f) => sum + parseFloat(f.ven_valor || 0), 0)
                        }
                    }
                }
            })

            // Calcular totales generales
            let totalGeneralPrefacturasBruto = 0
            let totalGeneralPrefacturasNeto = 0
            let totalGeneralFacturasBruto = 0
            let totalGeneralFacturasNeto = 0
            let totalGeneralDevolucionesBruto = 0
            let totalGeneralDevolucionesNeto = 0
            
            Object.values(this.datosComparativosPorEmpresa).forEach(empresaData => {
                totalGeneralPrefacturasBruto += empresaData.totales_financieros.prefacturas.bruto
                totalGeneralPrefacturasNeto += empresaData.totales_financieros.prefacturas.neto
                totalGeneralFacturasBruto += empresaData.totales_financieros.facturas.bruto
                totalGeneralFacturasNeto += empresaData.totales_financieros.facturas.neto
                totalGeneralDevolucionesBruto += empresaData.totales_financieros.devoluciones.bruto
                totalGeneralDevolucionesNeto += empresaData.totales_financieros.devoluciones.neto
            })

            this.totalesGenerales = {
                prefacturas: {
                    bruto: totalGeneralPrefacturasBruto,
                    neto: totalGeneralPrefacturasNeto
                },
                facturas: {
                    bruto: totalGeneralFacturasBruto,
                    neto: totalGeneralFacturasNeto
                },
                devoluciones: {
                    bruto: totalGeneralDevolucionesBruto,
                    neto: totalGeneralDevolucionesNeto
                },
                diferencia: {
                    bruto: totalGeneralPrefacturasBruto - totalGeneralDevolucionesBruto - totalGeneralFacturasBruto,
                    neto: totalGeneralPrefacturasNeto - totalGeneralDevolucionesNeto - totalGeneralFacturasNeto
                }
            }
        },
        
        calcularTotales() {
            // Calcular totales de prefacturas
            this.totalesPrefacturas = {
                subtotal: this.prefacturas.reduce((sum, p) => sum + parseFloat(p.ven_subtotal || 0), 0),
                descuento: this.prefacturas.reduce((sum, p) => sum + parseFloat(p.ven_descuento || 0), 0),
                total: this.prefacturas.reduce((sum, p) => sum + parseFloat(p.ven_valor || 0), 0)
            }

            // Calcular totales de facturas
            this.totalesFacturas = {
                subtotal: this.facturas.reduce((sum, f) => sum + parseFloat(f.ven_subtotal || 0), 0),
                descuento: this.facturas.reduce((sum, f) => sum + parseFloat(f.ven_descuento || 0), 0),
                total: this.facturas.reduce((sum, f) => sum + parseFloat(f.ven_valor || 0), 0)
            }
        },

        descargarExcel() {
            
            // Crear un nuevo libro de trabajo
            const wb = XLSX.utils.book_new()
            
            // Generar nombre del archivo
            const nombreCliente = this.cliente && this.cliente.nombres ? this.cliente.nombres : 'Cliente'
            const nombreArchivo = `Comparativo ${nombreCliente}.xlsx`
            
            // Por cada empresa, crear una hoja
            Object.keys(this.datosComparativosPorEmpresa).forEach(empresaNombre => {
                const empresaData = this.datosComparativosPorEmpresa[empresaNombre]
                
                // Crear los datos para la hoja
                const datosHoja = []
                
                // Título de la empresa
                datosHoja.push([empresaNombre])
                datosHoja.push([]) // Línea vacía
                
                // Totales Financieros
                datosHoja.push(['TOTALES FINANCIEROS'])
                datosHoja.push([]) // Línea vacía
                
                // Prefacturas
                datosHoja.push(['Totales Prefacturas'])
                datosHoja.push(['Valor Bruto', `$${empresaData.totales_financieros.prefacturas.bruto.toFixed(2)}`])
                datosHoja.push(['Descuento', `$${empresaData.totales_financieros.prefacturas.descuento.toFixed(2)}`])
                datosHoja.push(['Valor Neto', `$${empresaData.totales_financieros.prefacturas.neto.toFixed(2)}`])
                datosHoja.push([]) // Línea vacía
                
                // Devoluciones
                datosHoja.push(['Devoluciones'])
                datosHoja.push(['Valor Bruto', `-$${empresaData.totales_financieros.devoluciones.bruto.toFixed(2)}`])
                datosHoja.push(['Valor Neto', `-$${empresaData.totales_financieros.devoluciones.neto.toFixed(2)}`])
                datosHoja.push([]) // Línea vacía
                
                // Facturas
                datosHoja.push(['Totales Facturas Reales'])
                datosHoja.push(['Valor Bruto', `$${empresaData.totales_financieros.facturas.bruto.toFixed(2)}`])
                datosHoja.push(['Descuento', `$${empresaData.totales_financieros.facturas.descuento.toFixed(2)}`])
                datosHoja.push(['Valor Neto', `$${empresaData.totales_financieros.facturas.neto.toFixed(2)}`])
                datosHoja.push([]) // Línea vacía
                
                // Diferencia
                datosHoja.push(['Diferencia'])
                const difBruto = empresaData.totales_financieros.prefacturas.bruto - empresaData.totales_financieros.devoluciones.bruto - empresaData.totales_financieros.facturas.bruto
                datosHoja.push(['Valor Bruto', `$${difBruto.toFixed(2)}`])
                datosHoja.push(['Valor Neto', `$${empresaData.totales.diferencia_neto.toFixed(2)}`])
                datosHoja.push([]) // Línea vacía
                datosHoja.push([]) // Línea vacía
                
                // Tabla de productos
                datosHoja.push(['DETALLE DE PRODUCTOS'])
                datosHoja.push([]) // Línea vacía
                
                // Encabezados de la tabla
                datosHoja.push([
                    'Código',
                    'Producto',
                    'Cant. Vendido',
                    'Precio',
                    'Desc. %',
                    'Cant. Devuelto',
                    'Cant. Facturado',
                    'Desc. Fact. %',
                    'Disponible'
                ])
                
                // Datos de productos
                empresaData.productos.forEach(producto => {
                    datosHoja.push([
                        producto.pro_codigo,
                        producto.nombre,
                        producto.cant_prefacturas,
                        `$${producto.valor_u_prefacturas.toFixed(2)}`,
                        `${producto.descuento_devolucion || 0}%`,
                        producto.devoluciones || 0,
                        producto.cant_facturas,
                        `${producto.descuento_factura || 0}%`,
                        producto.diferencia_cant
                    ])
                })
                
                // Crear la hoja
                const ws = XLSX.utils.aoa_to_sheet(datosHoja)
                
                // Ajustar ancho de columnas
                const columnWidths = [
                    { wch: 15 },  // Código
                    { wch: 40 },  // Producto
                    { wch: 15 },  // Cant. Vendido
                    { wch: 12 },  // Precio
                    { wch: 12 },  // Desc. %
                    { wch: 15 },  // Cant. Devuelto
                    { wch: 16 },  // Cant. Facturado
                    { wch: 14 },  // Desc. Fact. %
                    { wch: 12 }   // Disponible
                ]
                ws['!cols'] = columnWidths
                
                // Agregar la hoja al libro con el nombre de la empresa
                XLSX.utils.book_append_sheet(wb, ws, empresaNombre)
            })
            
            // Descargar el archivo
            XLSX.writeFile(wb, nombreArchivo)
            
            this.$vs.notify({
                title: 'Éxito',
                text: 'Excel descargado correctamente',
                color: 'success',
                icon: 'check_circle'
            })
        }
    }
}
</script>

<style scoped>
.comparativo-ventas-facturas {
    padding: 1rem;
}

/* Tabla con scroll interno - header y search fijos */
.tabla-scroll >>> .vs-table--content {
    max-height: 500px;
    overflow-y: auto;
    display: block;
}

.tabla-scroll >>> .vs-table--thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
}

.tabla-scroll >>> .vs-table--search {
    position: sticky;
    top: 0;
    z-index: 11;
    background: white;
    padding-bottom: 10px;
}
</style>
