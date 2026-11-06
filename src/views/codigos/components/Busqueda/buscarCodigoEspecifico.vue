<template>
    <div class="codigo-libro-info">
        <!-- Estado de carga -->
        <div v-if="cargando" class="text-center p-4">
            <p class="mt-3">Buscando información del código...</p>
        </div>

        <!-- Contenido de la información -->
        <div v-else-if="informacionCodigo">
            <vs-row>
                <vs-col vs-w="12" class="mb-3">
                    <vs-card class="info-card">
                        <div slot="header" class="card-header">
                            <div class="header-left">
                                <div class="codigo-con-union">
                                    <div class="codigo-principal">
                                        <vs-icon icon="code" size="medium" color="primary" />
                                        <h3 class="card-title">Código: {{ informacionCodigo.codigo }}</h3>
                                    </div>
                                    <div class="codigo-union" v-if="informacionCodigo.codigo_union">
                                        <span class="info-label">Unión:</span>
                                        <span class="info-value code-value">{{ informacionCodigo.codigo_union }}</span>
                                    </div>
                                </div>
                            </div>

                            <vs-chip :color="informacionCodigo.tipo_venta === 'Directa' ? 'success' : 'primary'"
                                class="tipo-venta-chip">
                                <vs-icon :icon="informacionCodigo.tipo_venta === 'Directa' ? 'shopping_cart' : 'list'"
                                    size="small" />
                                {{ informacionCodigo.tipo_venta }}
                            </vs-chip>
                        </div>
                        <!-- Sección: Datos del Estudiante -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="person" size="small" color="primary" />
                                <h4>Datos del Estudiante</h4>
                            </div>
                            <vs-row>
                                <vs-col vs-w="12" class="info-item">
                                    <div class="info-label">Nombre Completo</div>
                                    <div class="info-value highlight">{{ informacionCodigo.estudiante || 'N/A' }}</div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Cédula</div>
                                    <div class="info-value">{{ informacionCodigo.cedula || 'N/A' }}</div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Correo Electrónico</div>
                                    <div class="info-value">{{ informacionCodigo.email || 'N/A' }}</div>
                                </vs-col>
                            </vs-row>
                        </div>

                        <!-- Sección: Información General -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="info" size="small" color="primary" />
                                <h4>Información General</h4>
                            </div>
                            <vs-row>
                                <vs-col vs-w="12" vs-sm="6" vs-md="4" class="info-item">
                                    <div class="info-label">Serie</div>
                                    <div class="info-value">{{ informacionCodigo.serie || 'N/A' }}</div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" vs-md="4" class="info-item">
                                    <div class="info-label">Libro</div>
                                    <div class="info-value">{{ informacionCodigo.libro || 'N/A' }}</div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" vs-md="4" class="info-item">
                                    <div class="info-label">Período Escolar</div>
                                    <div class="info-value">{{ informacionCodigo.periodoescolar || 'N/A' }}</div>
                                </vs-col>
                            </vs-row>
                        </div>

                        <!-- Sección: Estados y Liquidación -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="assignment" size="small" color="primary" />
                                <h4>Estados y Liquidación</h4>
                            </div>
                            <div class="estados-container">
                                <!-- BC Estado -->
                                <div class="estado-item">
                                    <div class="info-label">Estado BC</div>
                                    <div class="info-value">
                                        <vs-chip
                                            :color="informacionCodigo.bc_estado_valor === 2 ? 'success' : 'warning'"
                                            size="small">
                                            {{ informacionCodigo.bc_estado_texto || 'N/A' }}
                                        </vs-chip>
                                        <span class="valor-numerico">({{ informacionCodigo.bc_estado_valor }})</span>
                                    </div>
                                </div>

                                <!-- Liquidado Regalado -->
                                <div class="estado-item">
                                    <div class="info-label">Liquidado Regalado</div>
                                    <div class="info-value">
                                        <vs-chip
                                            :color="informacionCodigo.liquidado_regalado_valor === 1 ? 'success' : 'warning'"
                                            size="small">
                                            {{ informacionCodigo.liquidado_regalado_texto || 'N/A' }}
                                        </vs-chip>
                                        <span class="valor-numerico">({{ informacionCodigo.liquidado_regalado_valor
                                            }})</span>
                                    </div>
                                </div>

                                <!-- Plus -->
                                <div class="estado-item">
                                    <div class="info-label">Plus</div>
                                    <div class="info-value">
                                        <vs-chip :color="informacionCodigo.plus_valor === 1 ? 'success' : 'danger'"
                                            size="small">
                                            {{ informacionCodigo.plus_texto || 'N/A' }}
                                        </vs-chip>
                                        <span class="valor-numerico">({{ informacionCodigo.plus_valor }})</span>
                                    </div>
                                </div>

                                <!-- Estado Liquidación -->
                                <div class="estado-item">
                                    <div class="info-label">Estado Liquidación</div>
                                    <div class="info-value">
                                        <vs-chip
                                            :color="getEstadoLiquidacionColor(informacionCodigo.estado_liquidacion_valor)"
                                            size="small">
                                            {{ informacionCodigo.estado_liquidacion_texto || 'N/A' }}
                                        </vs-chip>
                                        <span class="valor-numerico">({{ informacionCodigo.estado_liquidacion_valor
                                            }})</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sección: Verificaciones -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="verified" size="small" color="primary" />
                                <h4>Verificaciones</h4>
                            </div>
                            <vs-row>
                                <vs-col vs-w="12" vs-sm="6" vs-md="4" v-for="(value, key) in verificacionesExistentes"
                                    :key="key" class="info-item">
                                    <div class="info-label">Verificación {{ key.replace('verif', '') }}</div>
                                    <div class="info-value">
                                        <vs-chip color="success" size="small">
                                            <vs-icon icon="check_circle" size="small" />
                                            ID: {{ value }}
                                        </vs-chip>
                                    </div>
                                </vs-col>

                                <vs-col vs-w="12" v-if="!tieneVerificaciones" class="info-item">
                                    <div class="info-value text-muted">
                                        <vs-icon icon="info" size="small" />
                                        No hay verificaciones registradas
                                    </div>
                                </vs-col>
                            </vs-row>
                        </div>

                        <!-- Sección: Códigos Relacionados -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="link" size="small" color="primary" />
                                <h4>Códigos Relacionados</h4>
                            </div>
                            <vs-row>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Código Proforma</div>
                                    <div class="info-value code-value">{{ informacionCodigo.codigo_proforma || 'N/A' }}
                                    </div>
                                </vs-col>
                                <!-- <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Código Unión</div>
                                    <div class="info-value code-value">{{ informacionCodigo.codigo_union || 'N/A' }}</div>
                                </vs-col> -->
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Código Paquete</div>
                                    <div class="info-value code-value">{{ informacionCodigo.codigo_paquete || 'N/A' }}
                                    </div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Código Combo</div>
                                    <div class="info-value code-value">{{ informacionCodigo.codigo_combo || 'N/A' }}
                                    </div>
                                </vs-col>
                            </vs-row>
                        </div>

                        <!-- Sección: Instituciones -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="business" size="small" color="primary" />
                                <h4>Instituciones</h4>
                            </div>
                            <vs-row>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Institución Venta Directa</div>
                                    <div class="info-value">{{ informacionCodigo.institucion_venta_directa || 'N/A' }}
                                    </div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Institución Venta Lista</div>
                                    <div class="info-value">{{ informacionCodigo.institucion_venta_lista || 'N/A' }}
                                    </div>
                                </vs-col>
                            </vs-row>
                        </div>

                        <!-- Sección: Fechas -->
                        <div class="section">
                            <div class="section-title">
                                <vs-icon icon="date_range" size="small" color="primary" />
                                <h4>Fechas</h4>
                            </div>
                            <vs-row>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Fecha de Creación</div>
                                    <div class="info-value">{{ formatFecha(informacionCodigo.fecha_creacion) || 'N/A' }}
                                    </div>
                                </vs-col>
                                <vs-col vs-w="12" vs-sm="6" class="info-item">
                                    <div class="info-label">Fecha de Actualización</div>
                                    <div class="info-value">{{ formatFecha(informacionCodigo.fecha_actualizacion) ||
                                        'N/A' }}</div>
                                </vs-col>
                            </vs-row>
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
        </div>

        <!-- Sin información -->
        <div v-else-if="!cargando && codigoRecibido && !informacionCodigo" class="text-center p-4">
            <vs-icon icon="warning" color="warning" size="large" />
            <p class="mt-3">No se encontró información para el código: {{ codigoRecibido }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CodigoLibroInfo',
    props: {
        codigo: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            cargando: false,
            informacionCodigo: null
        }
    },
    computed: {
        codigoRecibido() {
            return this.codigo
        },
        verificacionesExistentes() {
            if (!this.informacionCodigo || !this.informacionCodigo.verificaciones) {
                return {};
            }

            const existentes = {};
            const verifs = this.informacionCodigo.verificaciones;

            for (let i = 1; i <= 5; i++) {
                const key = 'verif' + i;
                const value = verifs[key];
                if (value !== null && value !== undefined && value !== '') {
                    existentes[key] = value;
                }
            }

            return existentes;
        },
        tieneVerificaciones() {
            return Object.keys(this.verificacionesExistentes).length > 0;
        }
    },
    watch: {
        codigo: {
            handler(newCodigo) {
                if (newCodigo) {
                    this.buscarInformacion()
                } else {
                    this.limpiarInformacion()
                }
            },
            immediate: true
        }
    },
    methods: {
        async buscarInformacion() {
            if (!this.codigo) {
                return
            }

            this.cargando = true
            this.informacionCodigo = null

            try {
                const url = `${this.$server_url}codigoLibroEspecifico/${this.codigo}`
                const response = await this.$http.get(url)

                if (response.data.status === 1) {
                    this.informacionCodigo = response.data.data
                } else {
                    this.$f_notificacion(response.data.message || 'Código no encontrado', 'warning')
                    this.informacionCodigo = null
                }
            } catch (error) {
                console.error('Error al buscar código:', error)
                this.$f_notificacion('Error al buscar la información del código', 'danger', 'icon-alert-triangle');
                this.informacionCodigo = null
            } finally {
                this.cargando = false
            }
        },
        limpiarInformacion() {
            this.informacionCodigo = null
            this.cargando = false
        },
        getEstadoLiquidacionColor(valor) {
            const colores = {
                0: 'success',
                1: 'warning',
                2: 'primary',
                3: 'danger',
                4: 'info'
            };
            return colores[valor] || 'default';
        },
        formatFecha(fecha) {
            if (!fecha) return null;
            try {
                const date = new Date(fecha);
                return date.toLocaleString('es-EC', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            } catch (error) {
                return fecha;
            }
        }
    }
}
</script>

<style scoped>
/* Estilos base */
.info-card {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin: 20px 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 2px solid #f0f0f0;
    flex-wrap: wrap;
    gap: 10px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.card-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
}

.tipo-venta-chip {
    font-weight: 500;
    padding: 6px 14px;
}

/* Secciones */
.section {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
    border-bottom: none;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.section-title h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #34495e;
}

/* Items de información */
.info-item {
    padding: 6px 0;
}

.info-label {
    font-size: 0.75rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    margin-bottom: 2px;
}

.info-value {
    font-size: 0.95rem;
    color: #2c3e50;
    font-weight: 500;
}

.info-value.highlight {
    font-size: 1.1rem;
    color: #2c3e50;
    font-weight: 600;
}

/* Códigos */
.code-value {
    /* font-family: 'Courier New', monospace; */
    background: #f8f9fa;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    font-size: 0.85rem;
}

/* Estados */
.estados-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px 40px;
    padding: 4px 0;
}

.estado-item {
    display: inline-block;
    min-width: 180px;
    flex: 0 1 auto;
}

.valor-numerico {
    font-size: 0.7rem;
    color: #95a5a6;
    margin-left: 4px;
}

.text-muted {
    color: #95a5a6;
    font-style: italic;
}

.vs-chip {
    margin-right: 4px;
}

/* Responsive */
@media (max-width: 768px) {
    .info-card {
        margin: 10px;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .estados-container {
        gap: 12px 20px;
    }

    .estado-item {
        min-width: 150px;
        width: 100%;
    }
}

.codigo-con-union {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.codigo-principal {
    display: flex;
    align-items: center;
    gap: 12px;
}

.codigo-union {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-left: 40px;
}

.codigo-union .info-label {
    font-size: 0.7rem;
    color: #7f8c8d;
    text-transform: uppercase;
    font-weight: 600;
}
</style>