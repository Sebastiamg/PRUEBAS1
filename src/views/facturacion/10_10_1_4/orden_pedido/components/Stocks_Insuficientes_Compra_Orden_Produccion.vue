<template><vs-row align="center" class="error-stock-container">

    <!-- Encabezado de alerta -->
    <vs-col vs-w="12" class="mb-4">
        <div class="alerta-stock">
            <span class="alerta-icono">⚠️</span>
            <div>
                <strong>No se puede guardar: stock insuficiente</strong>
                <p class="alerta-desc">
                    Los siguientes productos no tienen suficiente stock para aplicar el cambio solicitado.
                    Ajuste las cantidades e intente nuevamente.
                </p>
            </div>
        </div>
    </vs-col>

    <!-- Leyenda de columnas -->
    <vs-col vs-w="12" class="mb-3">
        <div class="leyenda-row">
            <div class="leyenda-item leyenda-solicitado">
                <span class="leyenda-dot">●</span>
                <span><strong>Solicitado:</strong> Cantidad que desea ingresar ahora</span>
            </div>
            <div class="leyenda-item leyenda-anterior">
                <span class="leyenda-dot">●</span>
                <span><strong>Anterior:</strong> Cantidad registrada antes de editar</span>
            </div>
            <div class="leyenda-item leyenda-actual">
                <span class="leyenda-dot">●</span>
                <span><strong>Actual en BD:</strong> Stock disponible actualmente en la base de datos</span>
            </div>
            <div class="leyenda-item leyenda-faltante">
                <span class="leyenda-dot">●</span>
                <span><strong>Faltante:</strong> Unidades que hacen falta para completar el cambio</span>
            </div>
        </div>
    </vs-col>

    <!-- Tabla de productos con error -->
    <vs-col vs-w="12">
        <div
            v-for="(producto, i) in erroresStock_Lista.productos_insuficientes"
            :key="'prod-' + i"
            class="producto-card"
        >
            <!-- Cabecera del producto -->
            <div class="producto-header">
                <span class="producto-icono">📦</span>
                <span>Producto código: <strong>{{ producto.pro_codigo }}</strong></span>
            </div>

            <!-- Filas de detalle -->
            <table class="detalle-tabla">
                <thead>
                    <tr>
                        <th class="col-tipo">Tipo de stock</th>
                        <th class="col-solicitado">Solicitado</th>
                        <th class="col-anterior">Anterior</th>
                        <th class="col-actual">Actual en BD</th>
                        <th class="col-faltante">Faltante</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(detalle, tipo) in producto.detalles" :key="producto.pro_codigo + '-' + tipo">
                        <td>
                            <span class="badge-tipo">
                                <span v-if="tipo == 'stock'">📄 Stock Facturas</span>
                                <span v-else-if="tipo == 'deposito'">🗂️ Stock Notas</span>
                                <span v-else-if="tipo == 'reservar'">📋 Stock General</span>
                            </span>
                        </td>
                        <td>
                            <span class="badge badge-solicitado">{{ detalle.solicitado }}</span>
                        </td>
                        <td>
                            <span class="badge badge-anterior">{{ detalle.antiguo }}</span>
                        </td>
                        <td>
                            <span class="badge badge-actual">{{ detalle.actual }}</span>
                        </td>
                        <td>
                            <span class="badge badge-faltante">-{{ Math.abs(detalle.faltante) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Explicación visual del cálculo -->
            <div class="formula-hint">
                💡 <em>Stock actual en BD − Anterior + Solicitado = resultado. Si el resultado es negativo, no hay suficiente stock.</em>
            </div>
        </div>
    </vs-col>

    <!-- Botón cerrar -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-4">
        <vs-button @click="getAceptarInformacion()" color="primary" type="relief" icon-pack="feather" icon="icon-x-circle">
            Cerrar y corregir
        </vs-button>
    </vs-col>

</vs-row>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {};
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        erroresStock_Lista: {
            type: Object,
            default: function () {
                return {};
            }
        },
    },
    mounted() {},
    methods: {
        getAceptarInformacion() {
            this.$emit('change', {
                verificacionemitdeerrorlistado: 2
            });
        },
    },
};
</script>

<style scoped>
.error-stock-container {
    padding: 16px;
    font-family: 'Segoe UI', sans-serif;
}

/* --- Alerta superior --- */
.alerta-stock {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #fff3cd;
    border-left: 5px solid #f0a500;
    border-radius: 8px;
    padding: 14px 18px;
    color: #7a5800;
}
.alerta-icono {
    font-size: 1.6rem;
    flex-shrink: 0;
}
.alerta-desc {
    margin: 4px 0 0;
    font-size: 0.875rem;
    color: #856404;
}

/* --- Leyenda --- */
.leyenda-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 14px;
}
.leyenda-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: #444;
}
.leyenda-dot { font-size: 1rem; }
.leyenda-solicitado .leyenda-dot { color: #1565c0; }
.leyenda-anterior  .leyenda-dot { color: #6a1b9a; }
.leyenda-actual    .leyenda-dot { color: #2e7d32; }
.leyenda-faltante  .leyenda-dot { color: #c62828; }

/* --- Tarjeta por producto --- */
.producto-card {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    margin-bottom: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.producto-header {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #37474f;
    color: #fff;
    padding: 10px 16px;
    font-size: 0.95rem;
}
.producto-icono { font-size: 1.1rem; }

/* --- Tabla de detalle --- */
.detalle-tabla {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}
.detalle-tabla thead tr {
    background: #eceff1;
}
.detalle-tabla th {
    padding: 8px 12px;
    text-align: center;
    font-weight: 600;
    color: #546e7a;
    border-bottom: 2px solid #cfd8dc;
    white-space: nowrap;
}
.detalle-tabla td {
    padding: 10px 12px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
}
.detalle-tabla tr:last-child td {
    border-bottom: none;
}
.col-tipo { text-align: left !important; min-width: 150px; }

/* --- Badges de valor --- */
.badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
}
.badge-tipo {
    font-weight: 600;
    color: #37474f;
    font-size: 0.875rem;
}
.badge-solicitado { background: #e3f2fd; color: #1565c0; }
.badge-anterior   { background: #f3e5f5; color: #6a1b9a; }
.badge-actual     { background: #e8f5e9; color: #2e7d32; }
.badge-faltante   { background: #ffebee; color: #c62828; }

/* --- Fórmula hint --- */
.formula-hint {
    background: #f5f5f5;
    padding: 8px 16px;
    font-size: 0.78rem;
    color: #666;
    border-top: 1px solid #eeeeee;
}
</style>
