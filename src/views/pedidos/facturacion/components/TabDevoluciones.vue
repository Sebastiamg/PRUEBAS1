<template>
    <div class="pt-4">
        <!-- Loading con skeleton -->
        <div v-if="loading" class="mb-4">
            <vx-card>
                <div class="skeleton-container">
                    <div class="skeleton-header mb-4"></div>
                    <div class="skeleton-line mb-3"></div>
                    <div class="skeleton-line mb-3"></div>
                    <div class="skeleton-line mb-3"></div>
                    <div class="skeleton-line-short"></div>
                </div>
            </vx-card>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="errorMsg" class="mb-4">
            <vx-card>
                <div style="text-align: center; padding: 24px;">
                    <i class="feather icon-alert-circle" style="font-size: 48px; color: rgb(234, 84, 85); margin-bottom: 16px;"></i>
                    <h4 style="color: rgb(234, 84, 85); margin-bottom: 8px; font-weight: 600;">Error al cargar devoluciones</h4>
                    <p style="color: rgb(113, 128, 150); font-size: 14px; margin-bottom: 16px;">{{ errorMsg }}</p>
                    <vs-button color="primary" @click="$emit('reintentar')">
                        <i class="feather icon-refresh-cw" style="margin-right: 8px;"></i>
                        Reintentar
                    </vs-button>
                </div>
            </vx-card>
        </div>

        <div v-else>
            <!-- Tabla de devoluciones -->
            <vs-table
                :data="devoluciones"
                pagination
                max-items="10"
                search
                stripe
            >
                <template slot="header">
                    <span class="table-badge badge-primary">
                        <i class="feather icon-list mr-1"></i>
                        Cantidad: <b>{{ devoluciones.length }}</b>
                    </span>
                    <span class="table-badge badge-warning ml-2">
                        <i class="feather icon-clock mr-1"></i>
                        Últimos: <b>100 registros</b>
                    </span>
                </template>

                <template slot="thead">
                    <vs-th style="width: 25%;">
                        <i class="feather icon-file-text mr-1"></i>
                        Documento
                    </vs-th>
                    <vs-th style="width: 15%;">
                        <i class="feather icon-users mr-1"></i>
                        Cliente / Empresa
                    </vs-th>
                    <vs-th style="width: 20%;">
                        <i class="feather icon-package mr-1"></i>
                        Bodega
                    </vs-th>
                    <vs-th style="width: 25%;">
                        <i class="feather icon-database mr-1"></i>
                        Perseo
                    </vs-th>
                    <vs-th style="width: 15%;">
                        <i class="feather icon-settings mr-1"></i>
                        Acciones
                    </vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <!-- COLUMNA 1: DOCUMENTO -->
                        <vs-td>
                            <div class="cell-wrapper">
                                <!-- Número badge -->
                                <div class="mb-2">
                                    <span class="inline-badge badge-primary">#{{ indextr + 1 }}</span>
                                </div>
                                
                                <!-- Código principal -->
                                <div class="mb-4">
                                    <strong style="font-size: 16px; color: #1e293b;">{{ tr.ven_codigo }}</strong>
                                </div>
                                
                                <!-- Sección: Información de Venta -->
                                <div class="info-section">
                                    <div class="info-item">
                                        <i class="feather icon-calendar" style="color: #3b82f6;"></i>
                                        <span class="label-text">Venta:</span>
                                        <span class="value-text">{{ fechaCorta(tr.ven_fecha) }}</span>
                                    </div>
                                    <div class="info-item" v-if="tr.factura_perseo">
                                        <i class="feather icon-file-text" style="color: #10b981;"></i>
                                        <span class="label-text">Factura:</span>
                                        <span class="value-text">{{ tr.factura_perseo }}</span>
                                    </div>
                                </div>
                            </div>
                        </vs-td>

                        <!-- COLUMNA 2: CLIENTE / EMPRESA -->
                        <vs-td>
                            <div class="cell-wrapper">
                                <div class="info-section">
                                    <div class="info-item">
                                        <i class="feather icon-file-text" style="color: #3b82f6;"></i>
                                        <span class="value-text" style="font-weight: 600;">{{ tr.contrato || tr.contrato_generado || 'Sin contrato' }}</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="feather icon-briefcase" style="color: #64748b;"></i>
                                        <span class="label-small">PROLIPA</span>
                                    </div>
                                </div>
                            </div>
                        </vs-td>

                        <!-- COLUMNA 3: BODEGA -->
                        <vs-td>
                            <div class="cell-wrapper">
                                <!-- Sección: Doc Bodega -->
                                <div class="section-header">
                                    <i class="feather icon-package" style="color: #f59e0b; margin-right: 4px;"></i>
                                    <span>Doc Bodega</span>
                                </div>
                                <div class="info-section">
                                    <div class="info-item" v-if="tr.codigo_devolucion_facturador">
                                        <span class="value-text" style="font-weight: 600; color: #f59e0b;">{{ tr.codigo_devolucion_facturador }}</span>
                                    </div>
                                    <div class="info-item" v-if="tr.fecha_devolucion">
                                        <i class="feather icon-clock" style="color: #64748b; font-size: 12px;"></i>
                                        <span class="label-small">{{ fechaCorta(tr.fecha_devolucion) }}</span>
                                    </div>
                                    <div class="mt-2">
                                        <span v-if="tr.codigo_devolucion_facturador" class="inline-badge badge-success" style="font-size: 11px;">
                                            <i class="feather icon-check-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                            Con códigos
                                        </span>
                                        <span v-else class="inline-badge badge-warning" style="font-size: 11px;">
                                            <i class="feather icon-alert-circle" style="font-size: 10px; margin-right: 3px;"></i>
                                            Sin códigos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </vs-td>

                        <!-- COLUMNA 4: PERSEO -->
                        <vs-td>
                            <div class="cell-wrapper">
                                <!-- Notas de Crédito (si existen) -->
                                <div v-if="tr.nota_credito" class="notes-section">
                                    <div class="section-header-small">Notas de Crédito</div>
                                    <div style="margin-top: 4px;">
                                        <span 
                                            v-for="(nc, idx) in String(tr.nota_credito).split(',').map(s => s.trim()).filter(Boolean).slice(0, 2)"
                                            :key="idx"
                                            class="inline-badge badge-success"
                                            style="font-size: 10px; margin: 2px 4px 2px 0;">
                                            {{ nc }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Resumen de cantidades -->
                                <div class="summary-container">
                                    <div class="summary-line">
                                        <span>TOTAL</span>
                                        <strong>{{ parseFloat(tr.cantidad_devolucion || 0).toFixed(0) }}</strong>
                                    </div>
                                    <div class="summary-line" style="color: #16a34a;">
                                        <span>ENVIADA</span>
                                        <strong>{{ parseFloat(tr.cantidad_nc_enviada_total || 0).toFixed(0) }}</strong>
                                    </div>
                                    <div class="summary-line" :style="{ color: cantidadPendiente(tr) > 0 ? '#f59e0b' : '#16a34a' }">
                                        <span>PENDIENTE</span>
                                        <strong>{{ cantidadPendiente(tr).toFixed(0) }}</strong>
                                    </div>
                                    <div class="summary-line summary-total">
                                        <span>Valor:</span>
                                        <strong>${{ parseFloat(tr.valor_devolucion_con_descuento || tr.valor_devolucion || 0).toFixed(2) }}</strong>
                                    </div>
                                </div>
                            </div>
                        </vs-td>

                        <!-- COLUMNA 5: ACCIONES -->
                        <vs-td>
                            <div class="cell-wrapper">
                                <!-- Botones de acción -->
                                <div class="actions-container">
                                    <!-- Badge informativo si NO tiene fecha_envio_perseo -->
                                    <div v-if="!tr.fecha_envio_perseo" class="plataforma-badge">
                                        <i class="feather icon-info"></i>
                                        <span>Devolución solo en plataforma</span>
                                    </div>
                                    
                                    <!-- Botón Ver (siempre visible) -->
                                    <vs-button 
                                        color="primary" 
                                        type="filled"
                                        icon-pack="feather"
                                        :icon="loadingRows[tr.ven_codigo] ? 'icon-loader' : 'icon-eye'"
                                        size="small"
                                        style="width: 100%;"
                                        :disabled="loadingVer || loadingRows[tr.ven_codigo]"
                                        @click="verDevolucionConLoading(tr.ven_codigo)">
                                        {{ loadingRows[tr.ven_codigo] ? 'Cargando...' : 'Ver' }}
                                    </vs-button>
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TabDevoluciones',
    props: {
        devoluciones: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingVer: {
            type: Boolean,
            default: false
        },
        errorMsg: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loadingRows: {} // Track loading state per row
        };
    },
    methods: {
        verDevolucionConLoading(ven_codigo) {
            let me = this;
            // Prevenir múltiples clics
            if (me.loadingRows[ven_codigo]) {
                return;
            }
            // Activar loading para esta fila
            me.$set(me.loadingRows, ven_codigo, true);
            
            // Emitir evento
            me.$emit('ver-devolucion', ven_codigo);
            
            // Desactivar loading después de 2 segundos (tiempo suficiente para abrir el modal)
            setTimeout(() => {
                me.$set(me.loadingRows, ven_codigo, false);
            }, 2000);
        },
        fechaCorta(fecha) {
            if (!fecha) return '—';
            try {
                const fechaStr = String(fecha);
                if (fechaStr.includes(' ')) {
                    return fechaStr.split(' ')[0];
                }
                if (fechaStr.includes('T')) {
                    return fechaStr.split('T')[0];
                }
                return fechaStr;
            } catch (e) {
                return fecha;
            }
        },
        cantidadPendiente(documento) {
            const cantidadTotal = parseFloat(documento.cantidad_devolucion || 0);
            const cantidadEnviada = parseFloat(documento.cantidad_nc_enviada || 0);
            return Math.max(0, cantidadTotal - cantidadEnviada);
        }
    }
}
</script>

<style scoped>
/* Skeleton Loader Styles */
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

.badge-warning {
    background-color: rgba(255, 159, 67, 0.15);
    color: rgb(255, 159, 67);
}

.badge-success {
    background-color: rgba(40, 199, 111, 0.15);
    color: rgb(40, 199, 111);
}

.inline-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

/* Info Row Styles - Formato horizontal compacto */
.info-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 13px;
}

.info-row i {
    font-size: 14px;
    flex-shrink: 0;
}

.info-label {
    color: #718096;
    font-weight: 500;
}

.info-value {
    color: #2c3e50;
}

.info-row-compact {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
}

/* Mejoras visuales para las celdas */
.document-cell,
.client-cell,
.bodega-cell {
    line-height: 1.6;
    padding: 4px 0;
}

.document-cell strong,
.client-cell strong,
.bodega-cell strong {
    color: #2c3e50;
    font-weight: 600;
}

/* Dates Group - Fechas de bodega agrupadas */
.dates-group {
    background-color: #f7fafc;
    border-left: 3px solid #e2e8f0;
    padding: 6px 8px;
    margin: 8px 0;
    border-radius: 4px;
}

.date-item {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
}

.date-item:last-child {
    margin-bottom: 0;
}

.date-item i {
    font-size: 12px;
}

/* Nuevos estilos organizados */
.cell-wrapper {
    padding: 8px 0;
}

.section-header {
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.section-header-small {
    font-size: 10px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

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
    font-size: 12px;
}

.value-text {
    color: #1e293b;
    font-weight: 500;
    font-size: 13px;
}

.label-small {
    color: #64748b;
    font-size: 11px;
}

/* Sección de notas */
.notes-section {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e8f0;
}

/* Resumen de cantidades */
.summary-container {
    background-color: #f8fafc;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 12px;
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

.summary-total {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e2e8f0;
}

/* Contenedor de acciones */
.actions-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Badge para devoluciones solo en plataforma */
.plataforma-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: #dbeafe;
    color: #1e40af;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    border: 1px solid #93c5fd;
    line-height: 1.2;
    margin-bottom: 4px;
}

.plataforma-badge i {
    font-size: 12px;
    flex-shrink: 0;
}

.plataforma-badge span {
    flex: 1;
}

/* Loading icon animation */
.icon-loader {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Color utilities */
.text-gray-600 {
    color: #718096;
}

.text-gray-500 {
    color: #a0aec0;
}

.text-primary {
    color: rgba(var(--vs-primary), 1);
}

.text-success {
    color: rgb(40, 199, 111);
}

.text-warning {
    color: rgb(255, 159, 67);
}
</style>
