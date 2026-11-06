<template>
<div class="devoluciones-dashboard">
    <!-- Dashboard KPIs Superior -->
    <div class="dashboard-header">
        <div class="kpi-container">
            <div class="kpi-card">
                <div class="kpi-icon-container kpi-primary">
                    <i class="fas fa-undo-alt"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">Total Devoluciones</div>
                    <div class="kpi-value">{{ devolucionesAgrupadas.length }}</div>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-container kpi-danger">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">Valor Subtotal</div>
                    <div class="kpi-value">${{ totalPrecio | filtrarDecimal }}</div>
                </div>
            </div>

            <div class="kpi-card">
                <div class="kpi-icon-container kpi-success">
                    <i class="fa-solid fa-money-bill"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">Valor Total</div>
                    <div class="kpi-value">${{ totalDescuento | filtrarDecimal }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tabla Principal -->
    <div class="tabla-container">
        <vs-table search :data="devolucionesAgrupadas">
            <template slot="header">
                <div class="table-header-simple">
                    <h3>Detalle de Devoluciones de Notas</h3>
                </div>
            </template>
            <template slot="thead">
                <vs-th>Código Devolución</vs-th>
                <vs-th>Documentos</vs-th>
                <vs-th width="250">Destino</vs-th>
                <vs-th>Total Precio</vs-th>
                <vs-th>Total Descuento</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(grupo, indextr) in data">
                    <vs-td>
                        <div class="codigo-devolucion-badge">
                            {{ grupo.codigo_devolucion }}
                        </div>
                    </vs-td>
                    <vs-td>
                        <div class="documentos-lista">
                            <div v-for="(doc, docIndex) in grupo.documentos" :key="docIndex" class="documento-item">
                                <i class="fas fa-file-invoice"></i>
                                <span class="documento-nombre">{{ doc.documento }}</span>
                                <span class="documento-valores">
                                    (Subtotal: ${{ doc.total_precio | filtrarDecimal }} - Total: ${{ doc.total_descuento | filtrarDecimal }})
                                </span>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td>
                        <div class="destino-info">
                            {{ grupo.nombreInstitucion }}
                        </div>
                    </vs-td>
                    <vs-td>
                        <div class="total-precio">
                            ${{ grupo.subtotal_precio | filtrarDecimal }}
                        </div>
                    </vs-td>
                    <vs-td>
                        <div class="total-descuento">
                            ${{ grupo.subtotal_descuento | filtrarDecimal }}
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</div>
</template>

    
<script>
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component';
export default {
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    data() {
        return {
            arregloaFactura: [],
            usuario: [],
            periodo: '',

        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        devolucionesFacturas: {
            type: [Object, Array],
            default: {},
        },
    },
    mounted() {
        let me = this;
    },
    computed: {
        devolucionesAgrupadas() {
            // Agrupar por codigo_devolucion
            const grupos = {};
            
            this.devolucionesFacturas.forEach(item => {
                const codigo = item.codigo_devolucion;
                
                if (!grupos[codigo]) {
                    grupos[codigo] = {
                        codigo_devolucion: codigo,
                        nombreInstitucion: item.nombreInstitucion,
                        documentos: [],
                        subtotal_precio: 0,
                        subtotal_descuento: 0
                    };
                }
                
                // Agregar documento al grupo
                grupos[codigo].documentos.push({
                    documento: item.documento,
                    total_precio: item.total_precio,
                    total_descuento: item.total_descuento
                });
                
                // Sumar subtotales
                grupos[codigo].subtotal_precio += item.total_precio;
                grupos[codigo].subtotal_descuento += item.total_descuento;
            });
            
            // Convertir objeto a array
            return Object.values(grupos);
        },
        devolucionesExpandidas() {
            const expandidas = [];
            
            this.devolucionesAgrupadas.forEach(grupo => {
                grupo.documentos.forEach((doc, index) => {
                    expandidas.push({
                        codigo_devolucion: grupo.codigo_devolucion,
                        documento: doc.documento,
                        total_precio: doc.total_precio,
                        total_descuento: doc.total_descuento,
                        esPrimero: index === 0 // Solo el primer documento del grupo muestra el código
                    });
                });
            });
            
            return expandidas;
        },
        totalPrecio() {
            return this.devolucionesFacturas.reduce((acc, tr) => acc + tr.total_precio, 0);
        },
        totalDescuento() {
            return this.devolucionesFacturas.reduce((acc, tr) => acc + tr.total_descuento, 0);
        }
    },
    methods: {

    }
};
</script>

<style>
/* Estilos globales para la tabla - sin scoped para que se apliquen */
.vs-table {
    border-radius: 8px !important;
    overflow: hidden !important;
    border: 1px solid #dee2e6 !important;
}

/* Header de la tabla */
.vs-table .vs-table--header {
    background: #f8f9fa !important;
    padding: 20px !important;
    border-bottom: 1px solid #dee2e6 !important;
}

.vs-table .vs-table--header h5 {
    color: #495057 !important;
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
}

/* Thead */
.vs-table .vs-table--thead {
    background: #ffffff !important;
    border-bottom: 1px solid #dee2e6 !important;
}

.vs-table .vs-table--thead th {
    font-weight: 600 !important;
    color: #495057 !important;
    font-size: 0.9rem !important;
    padding: 16px 12px !important;
    text-transform: uppercase !important;
    border-bottom: none !important;
    text-align: left !important;
}

/* Filas */
.vs-table .vs-table--tbody tr {
    border-bottom: 1px solid #f1f3f4 !important;
}

.vs-table .vs-table--tbody td {
    padding: 16px 12px !important;
    vertical-align: top !important;
    border-bottom: none !important;
}
</style>

<style scoped>
/* Dashboard Enterprise Styles */
.devoluciones-dashboard {
    padding: 20px;
    background: #f8f9fa;
    min-height: 100vh;
}

.dashboard-header {
    background: #ffffff;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #e9ecef;
}

/* KPI Cards */
.kpi-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.kpi-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.kpi-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 24px;
    color: white;
}

.kpi-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.kpi-success { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); }
.kpi-danger { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); }
.kpi-info { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); }

.kpi-content {
    flex: 1;
}

.kpi-label {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.kpi-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Simple Table Header */
.table-header-simple {
    padding: 20px 25px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.table-header-simple h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #495057;
}

/* ====== ESTILOS PARA TABLA AGRUPADA ====== */

/* Código de devolución badge */
.codigo-devolucion-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    display: inline-block;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Lista de documentos */
.documentos-lista {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
}

.documento-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #28a745;
}

.documento-item i {
    color: #28a745;
    font-size: 0.9rem;
    min-width: 16px;
}

.documento-nombre {
    font-weight: 500;
    color: #495057;
    flex: 1;
}

.documento-valores {
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: #6c757d;
    font-weight: 600;
}

/* Destino/Institución */
.destino-info {
    font-weight: 500;
    color: #495057;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 6px;
    text-align: center;
}

/* Totales */
.total-precio {
    font-weight: 700;
    font-family: 'Courier New', monospace;
    padding: 8px 12px;
    border-radius: 6px;
    text-align: center;
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.total-descuento {
    font-weight: 700;
    font-family: 'Courier New', monospace;
    padding: 8px 12px;
    border-radius: 6px;
    text-align: center;
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Scrollbar para documentos */
.documentos-lista::-webkit-scrollbar {
    width: 6px;
}

.documentos-lista::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.documentos-lista::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.documentos-lista::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .kpi-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .devoluciones-dashboard {
        padding: 15px;
    }
    
    .kpi-container {
        grid-template-columns: 1fr;
    }
    
    .documentos-lista {
        max-height: 150px;
    }
}

/* Loading and Animation States */
.kpi-card, .tabla-container, .dashboard-header {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
