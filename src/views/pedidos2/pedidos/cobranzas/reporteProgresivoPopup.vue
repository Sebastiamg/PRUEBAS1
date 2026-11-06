<template>
<vs-popup class="popup-reporte-progresivo" title="Generando Reporte de Cobranzas" :active.sync="popupActive" fullscreen>
    <div class="contenedor-reporte">
        <!-- 🔄 Sección de Progreso -->
        <div v-if="!reporteCompleto" class="seccion-progreso">
            <div class="header-progreso">
                <h2 class="titulo-progreso">📊 Generando Reporte Cobranza Completo</h2>
                <p class="subtitulo-progreso">Por favor espere mientras procesamos la información...</p>
            </div>

            <!-- Barra de Progreso Principal -->
            <div class="barra-progreso-contenedor">
                <div class="barra-progreso">
                    <div class="barra-progreso-fill" :style="{width: progresoTotal + '%'}"></div>
                </div>
                <span class="texto-progreso">{{ progresoTotal.toFixed(0) }}% Completado</span>
            </div>

            <!-- Lista de Procesos -->
            <div class="lista-procesos">
                <div v-for="(proceso, index) in procesos" :key="index" class="proceso-item" :class="proceso.estado">
                    <div class="proceso-icono">
                        <i v-if="proceso.estado === 'completado'" class="feather icon-check-circle text-success"></i>
                        <i v-else-if="proceso.estado === 'procesando'" class="feather icon-loader icon-spin text-warning"></i>
                        <i v-else class="feather icon-circle text-grey"></i>
                    </div>
                    <div class="proceso-info">
                        <h4>{{ proceso.nombre }}</h4>
                        <p v-if="proceso.descripcion">{{ proceso.descripcion }}</p>
                        <p v-if="proceso.resultado" class="proceso-resultado">{{ proceso.resultado }}</p>
                    </div>
                    <div class="proceso-tiempo" v-if="proceso.tiempo">
                        <span>{{ proceso.tiempo }}s</span>
                    </div>
                </div>
            </div>

            <!-- Información Adicional -->
            <div class="info-adicional" v-if="estadisticas.totalRegistros > 0">
                <div class="stat-card">
                    <div class="stat-icon">📄</div>
                    <div class="stat-info">
                        <h5>Total Registros</h5>
                        <p>{{ estadisticas.totalRegistros }}</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-info">
                        <h5>Tiempo Transcurrido</h5>
                        <p>{{ tiempoTranscurrido }}s</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <h5>Total Ventas</h5>
                        <p>${{ formatNumber(estadisticas.totalVentas) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ✅ Sección de Resultados -->
        <div v-else class="seccion-resultados">
            <div class="header-resultados">
                <h2 class="titulo-resultados">✅ Reporte Cobranza Generado Exitosamente</h2>
                <div class="botones-accion">
                    <vs-button color="success" type="filled" @click="exportarExcel" icon-pack="feather" icon="icon-download">
                        Exportar Excel
                    </vs-button>
                    <vs-button color="primary" type="border" @click="cerrarPopup" icon-pack="feather" icon="icon-x">
                        Cerrar
                    </vs-button>
                </div>
            </div>

            <!-- Filtros y Búsqueda -->
            <div class="filtros-contenedor">
                <vs-input v-model="busquedaTabla" placeholder="Buscar en tabla..." class="input-busqueda" icon-pack="feather" icon="icon-search" />
                <vs-select v-model="filtroEmpresa" placeholder="Filtrar por Empresa" class="select-filtro">
                    <vs-select-item value="" text="Todas las Empresas" />
                    <vs-select-item value="PROLIPA" text="PROLIPA" />
                    <vs-select-item value="GRUPOCALMED CIA.LTDA." text="GRUPOCALMED" />
                </vs-select>
            </div>

            <!-- Resumen de Totales -->
            <div class="resumen-totales">
                <div class="total-card" v-for="(total, key) in totalesCalculados" :key="key">
                    <h5>{{ total.label }}</h5>
                    <p :class="total.clase">${{ formatNumber(total.valor) }}</p>
                </div>
            </div>

            <!-- Tabla de Datos -->
            <div class="tabla-contenedor">
                <vs-table :data="datosFiltrados" pagination max-items="20" >
                    <template slot="thead">
                        <vs-th sort-key="empresa">Empresa</vs-th>
                        <vs-th sort-key="tdo_nombre">Documento</vs-th>
                        <vs-th sort-key="punto_venta">Venta</vs-th>
                        <vs-th sort-key="nombreInstitucion">P.Venta/Inst</vs-th>
                        <vs-th sort-key="cliente_facturado">Cliente</vs-th>
                        <vs-th sort-key="asesor">Asesor</vs-th>
                        <vs-th sort-key="subtotal_total">V.Bruta</vs-th>
                        <vs-th sort-key="valor_total">V.Neta</vs-th>
                        <vs-th sort-key="abono_total">Abonos</vs-th>
                        <vs-th sort-key="devolucion_bruta">Dev.Bruta</vs-th>
                        <vs-th sort-key="devolucion">Devoluciones</vs-th>
                        <vs-th sort-key="abono_liquidacion">Liquidaciones</vs-th>
                        <vs-th sort-key="retencion_total">Retenciones</vs-th>
                        <vs-th sort-key="abono_cruce">Cruces</vs-th>
                        <vs-th>Saldo</vs-th>
                        <vs-th>Serie</vs-th>
                        <vs-th>Temporada</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" :class="getRowClass(tr)">
                            <vs-td>{{ tr.empresa }}</vs-td>
                            <vs-td>{{ tr.tdo_nombre }}</vs-td>
                            <vs-td>{{ tr.punto_venta == 1 ? 'Directa' : 'Lista' }}</vs-td>
                            <vs-td>
                                <div class="scroll-cell">
                                    {{ tr.nombreInstitucion }}
                                </div>
                            </vs-td>
                            <vs-td>{{ tr.cliente_facturado }}</vs-td>
                            <vs-td>{{ tr.asesor }}</vs-td>
                            <vs-td>{{ formatNumber(tr.subtotal_total) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.valor_total) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.abono_total) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.devolucion_bruta) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.devolucion) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.abono_liquidacion) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.retencion_total) }}</vs-td>
                            <vs-td>{{ formatNumber(tr.abono_cruce) }}</vs-td>
                            <vs-td :class="getSaldoClass(calcularSaldo(tr))">
                                <b>{{ formatNumber(calcularSaldo(tr)) }}</b>
                                <vs-button 
                                    v-if="Math.abs(calcularSaldo(tr)) > 0" 
                                    size="small" 
                                    color="primary" 
                                    type="flat" 
                                    icon-pack="feather" 
                                    icon="icon-eye"
                                    @click="verDetalleCalculo(tr)"
                                    style="margin-left: 5px;"
                                />
                            </vs-td>
                            <vs-td>
                                {{empresaPlataforma ? empresaPlataforma.descripcion_corta || empresaPlataforma.nombre : 'N/A'}}
                            </vs-td>
                            <vs-td>
                                {{periodoSelect.descripcion}}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>

        <!-- 🔍 Popup Detalle de Cálculo (Hijo) -->
        <vs-popup class="popup-detalle-calculo" title="Detalle del Cálculo de Saldo" :active.sync="mostrarDetalleCalculo">
            <div class="detalle-calculo-contenedor" v-if="registroSeleccionado">
                <div class="header-detalle">
                    <h3>{{ registroSeleccionado.nombreInstitucion }}</h3>
                    <p><strong>Cliente:</strong> {{ registroSeleccionado.cliente_facturado }}</p>
                    <p><strong>RUC:</strong> {{ registroSeleccionado.ruc_cliente }}</p>
                    <p><strong>Empresa:</strong> {{ registroSeleccionado.empresa }}</p>
                    <p><strong>Tipo:</strong> {{ registroSeleccionado.tdo_nombre }}</p>
                </div>

                <vs-divider />

                <div class="calculo-detallado">
                    <h4>📊 Desglose del Cálculo</h4>
                    
                    <!-- VENTAS -->
                    <vs-collapse>
                        <vs-collapse-item :open="true">
                            <div slot="header" class="collapse-header positivo">
                                <span class="label">💰 Ventas Netas (+)</span>
                                <span class="valor">${{ formatNumber(parseFloat(registroSeleccionado.valor_total) || 0) }}</span>
                            </div>
                            <div class="collapse-content">
                                <div class="subitem">
                                    <span>Venta Bruta:</span>
                                    <span>${{ formatNumber(parseFloat(registroSeleccionado.subtotal_total) || 0) }}</span>
                                </div>
                                <div class="subitem">
                                    <span>Descuentos:</span>
                                    <span>${{ formatNumber((parseFloat(registroSeleccionado.subtotal_total) || 0) - (parseFloat(registroSeleccionado.valor_total) || 0)) }}</span>
                                </div>
                                <vs-divider />
                                <div class="subitem total">
                                    <span><strong>Venta Neta:</strong></span>
                                    <span><strong>${{ formatNumber(parseFloat(registroSeleccionado.valor_total) || 0) }}</strong></span>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>

                    <!-- ABONOS -->
                    <vs-collapse v-if="parseFloat(registroSeleccionado.abono_total) > 0">
                        <vs-collapse-item @click="cargarDetalleAbonos(registroSeleccionado)">
                            <div slot="header" class="collapse-header negativo">
                                <span class="label">💳 Abonos (-)</span>
                                <span class="valor">${{ formatNumber(parseFloat(registroSeleccionado.abono_total) || 0) }}</span>
                            </div>
                            <div class="collapse-content">
                                <!-- Detalle de Abonos Individuales -->
                                <div v-if="detalleTransacciones.abonos && detalleTransacciones.abonos.length > 0" class="detalle-transacciones">
                                    <p class="subtitulo-detalle"><strong>📋 Documentos de Abono:</strong></p>
                                    <div v-for="(abono, index) in detalleTransacciones.abonos" :key="'abono-' + index" class="transaccion-item">
                                        <div class="transaccion-info">
                                            <span class="transaccion-codigo">{{ abono.codigo || 'N/A' }} - {{ abono.tipo_abono }}</span>
                                            <span class="transaccion-fecha">{{ abono.fecha || '' }}</span>
                                        </div>
                                        <span class="transaccion-monto">${{ formatNumber(parseFloat(abono.monto_factura || abono.monto_nota || 0)) }}</span>
                                    </div>
                                    <vs-divider />
                                </div>
                                <div v-else-if="cargandoDetalle" class="text-center p-3">
                                    <i class="feather icon-loader icon-spin"></i> Cargando detalle...
                                </div>
                                
                                <!-- Resumen -->
                                <div class="subitem" v-if="parseFloat(registroSeleccionado.abono_liquidacion) > 0">
                                    <span>Liquidaciones:</span>
                                    <span>${{ formatNumber(parseFloat(registroSeleccionado.abono_liquidacion) || 0) }}</span>
                                </div>
                                <div class="subitem" v-if="parseFloat(registroSeleccionado.abono_cruce) > 0">
                                    <span>Cruces:</span>
                                    <span>${{ formatNumber(parseFloat(registroSeleccionado.abono_cruce) || 0) }}</span>
                                </div>
                                <div class="subitem">
                                    <span>Otros abonos:</span>
                                    <span>${{ formatNumber((parseFloat(registroSeleccionado.abono_total) || 0) - (parseFloat(registroSeleccionado.abono_liquidacion) || 0) - (parseFloat(registroSeleccionado.abono_cruce) || 0)) }}</span>
                                </div>
                                <vs-divider />
                                <div class="subitem total">
                                    <span><strong>Total Abonos:</strong></span>
                                    <span><strong>${{ formatNumber(parseFloat(registroSeleccionado.abono_total) || 0) }}</strong></span>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>

                    <!-- DEVOLUCIONES -->
                    <vs-collapse v-if="parseFloat(registroSeleccionado.devolucion) > 0">
                        <vs-collapse-item>
                            <div slot="header" class="collapse-header negativo">
                                <span class="label">📦 Devoluciones (-)</span>
                                <span class="valor">${{ formatNumber(parseFloat(registroSeleccionado.devolucion) || 0) }}</span>
                            </div>
                            <div class="collapse-content">
                                <!-- Detalle de Devoluciones Agrupadas por Código -->
                                <div v-if="devolucionesAgrupadas && Object.keys(devolucionesAgrupadas).length > 0" class="detalle-transacciones">
                                    <p class="subtitulo-detalle"><strong>📋 Documentos de Devolución ({{ Object.keys(devolucionesAgrupadas).length }}):</strong></p>
                                    
                                    <!-- Grupo por Código de Devolución -->
                                    <div v-for="(grupo, codigoDevolucion) in devolucionesAgrupadas" :key="codigoDevolucion" class="grupo-devolucion">
                                        <div class="encabezado-devolucion">
                                            <strong>📦 {{ codigoDevolucion }}</strong>
                                            <span class="total-grupo">${{ formatNumber(grupo.total) }}</span>
                                        </div>
                                        
                                        <!-- Ventas dentro de este documento de devolución -->
                                        <div class="ventas-devolucion">
                                            <div v-for="(venta, vIndex) in grupo.ventas" :key="'venta-' + vIndex" class="venta-item">
                                                <div class="venta-info">
                                                    <span class="venta-documento">
                                                        📄 {{ venta.documento || 'N/A' }}
                                                        <span v-if="venta.descuento > 0" class="badge-descuento">-{{ venta.descuento }}%</span>
                                                    </span>
                                                </div>
                                                <div class="venta-valores">
                                                    <span class="valor-bruto" v-if="parseFloat(venta.total_precio || 0) !== parseFloat(venta.ValorConDescuento || 0)">
                                                        <small>Bruto: ${{ formatNumber(parseFloat(venta.total_precio || 0)) }}</small>
                                                    </span>
                                                    <span class="venta-monto">
                                                        ${{ formatNumber(parseFloat(venta.ValorConDescuento || 0)) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <vs-divider />
                                </div>
                                <div v-else class="text-center p-3 text-muted">
                                    <i class="feather icon-info"></i> No hay detalle de documentos individuales
                                </div>
                                
                                <!-- Resumen -->
                                <div class="subitem">
                                    <span>Devolución Bruta:</span>
                                    <span>${{ formatNumber(parseFloat(registroSeleccionado.devolucion_bruta) || 0) }}</span>
                                </div>
                                <div class="subitem">
                                    <span>Ajuste devolución:</span>
                                    <span>${{ formatNumber((parseFloat(registroSeleccionado.devolucion_bruta) || 0) - (parseFloat(registroSeleccionado.devolucion) || 0)) }}</span>
                                </div>
                                <vs-divider />
                                <div class="subitem total">
                                    <span><strong>Devolución Neta:</strong></span>
                                    <span><strong>${{ formatNumber(parseFloat(registroSeleccionado.devolucion) || 0) }}</strong></span>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>

                    <!-- RETENCIONES -->
                    <vs-collapse v-if="parseFloat(registroSeleccionado.retencion_total) > 0">
                        <vs-collapse-item>
                            <div slot="header" class="collapse-header negativo">
                                <span class="label">📄 Retenciones (-)</span>
                                <span class="valor">${{ formatNumber(parseFloat(registroSeleccionado.retencion_total) || 0) }}</span>
                            </div>
                            <div class="collapse-content">
                                <div class="subitem total">
                                    <span><strong>Total Retenciones:</strong></span>
                                    <span><strong>${{ formatNumber(parseFloat(registroSeleccionado.retencion_total) || 0) }}</strong></span>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>

                    <!-- CRUCES -->
                    <vs-collapse v-if="parseFloat(registroSeleccionado.abono_cruce) > 0">
                        <vs-collapse-item>
                            <div slot="header" class="collapse-header negativo">
                                <span class="label">🔄 Cruces (-)</span>
                                <span class="valor">${{ formatNumber(parseFloat(registroSeleccionado.abono_cruce) || 0) }}</span>
                            </div>
                            <div class="collapse-content">
                                <div class="subitem total">
                                    <span><strong>Total Cruces:</strong></span>
                                    <span><strong>${{ formatNumber(parseFloat(registroSeleccionado.abono_cruce) || 0) }}</strong></span>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>

                    <!-- FACTURA OPERATIVA -->
                    <vs-collapse v-if="parseFloat(registroSeleccionado.factura_operativa) > 0">
                        <vs-collapse-item>
                            <div slot="header" class="collapse-header positivo">
                                <span class="label">📋 Factura Operativa (+)</span>
                                <span class="valor">${{ formatNumber(parseFloat(registroSeleccionado.factura_operativa) || 0) }}</span>
                            </div>
                            <div class="collapse-content">
                                <div class="subitem total">
                                    <span><strong>Total Fact. Operativa:</strong></span>
                                    <span><strong>${{ formatNumber(parseFloat(registroSeleccionado.factura_operativa) || 0) }}</strong></span>
                                </div>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>

                    <vs-divider />

                    <div class="formula-calculo">
                        <p><strong>📐 Fórmula aplicada:</strong></p>
                        <div class="formula-box" v-if="registroSeleccionado.tdo_nombre === 'DEVOLUCION SIN EMPRESA'">
                            <code>Saldo = Devolución × (-1)</code>
                            <p class="resultado">= {{ formatNumber(calcularSaldo(registroSeleccionado)) }}</p>
                        </div>
                        <div class="formula-box" v-else-if="registroSeleccionado.tdo_nombre === 'ABONO SIN VENTAS' || 
                                                            registroSeleccionado.tdo_nombre === 'ABONO SIN PRE-FACTURAS' || 
                                                            registroSeleccionado.tdo_nombre === 'ABONO SIN NOTAS'">
                            <code>Saldo = Abono × (-1)</code>
                            <p class="resultado">= {{ formatNumber(calcularSaldo(registroSeleccionado)) }}</p>
                        </div>
                        <div class="formula-box" v-else-if="registroSeleccionado.tdo_nombre === 'FACTURA OP'">
                            <code>Saldo = Factura Operativa</code>
                            <p class="resultado">= {{ formatNumber(calcularSaldo(registroSeleccionado)) }}</p>
                        </div>
                        <div class="formula-box" v-else>
                            <code>Saldo = Ventas - (Abonos + Devoluciones + Retenciones + Cruces)</code>
                            <p class="detalle-formula">
                                = ${{ formatNumber(parseFloat(registroSeleccionado.valor_total) || 0) }}
                                - (${{ formatNumber(parseFloat(registroSeleccionado.abono_total) || 0) }}
                                + ${{ formatNumber(parseFloat(registroSeleccionado.devolucion) || 0) }}
                                + ${{ formatNumber(parseFloat(registroSeleccionado.retencion_total) || 0) }}
                                + ${{ formatNumber(parseFloat(registroSeleccionado.abono_cruce) || 0) }})
                            </p>
                            <p class="resultado">= ${{ formatNumber(calcularSaldo(registroSeleccionado)) }}</p>
                        </div>
                    </div>

                    <vs-divider />

                    <div class="saldo-final" :class="getSaldoClass(calcularSaldo(registroSeleccionado))">
                        <h3>💵 Saldo Final</h3>
                        <h2>${{ formatNumber(calcularSaldo(registroSeleccionado)) }}</h2>
                        <p v-if="calcularSaldo(registroSeleccionado) > 0" class="estado-saldo">
                            ⚠️ Cliente debe: ${{ formatNumber(calcularSaldo(registroSeleccionado)) }}
                        </p>
                        <p v-else-if="calcularSaldo(registroSeleccionado) < 0" class="estado-saldo">
                            ✅ Saldo a favor del cliente: ${{ formatNumber(Math.abs(calcularSaldo(registroSeleccionado))) }}
                        </p>
                        <p v-else class="estado-saldo">
                            ✔️ Cliente sin saldo pendiente
                        </p>
                    </div>
                </div>

                <div class="botones-detalle">
                    <vs-button color="primary" @click="mostrarDetalleCalculo = false">Cerrar</vs-button>
                </div>
            </div>
        </vs-popup>
    </div>
</vs-popup>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
    name: 'ReporteProgresivoPopup',
    props: {
        active: {
            type: Boolean,
            required: true
        },
        periodoSelect: {
            type: Object,
            required: true
        }
    },
    data() {
        const empresa = localStorage.getItem('empresaPlataforma');
        return {
            popupActive: false,
            reporteCompleto: false,
            progresoTotal: 0,
            tiempoInicio: null,
            tiempoTranscurrido: 0,
            intervalTiempo: null,
            
            procesos: [
                { id: 1, nombre: '📄 Obteniendo Ventas', descripcion: 'Consultando facturas y notas...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 2, nombre: '💰 Calculando Abonos', descripcion: 'Procesando pagos y retenciones...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 3, nombre: '📦 Procesando Devoluciones', descripcion: 'Analizando devoluciones de productos...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 4, nombre: '🔄 Devoluciones Sin Empresa', descripcion: 'Verificando devoluciones especiales...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 5, nombre: '💳 Abonos Sin Documentos', descripcion: 'Identificando abonos sin vinculación...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 6, nombre: '🧾 Retenciones Sin Documentos', descripcion: 'Identificando retenciones sin pre-factura...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 7, nombre: '🏢 Facturas Operativas', descripcion: 'Procesando facturas operativas...', estado: 'pendiente', tiempo: null, resultado: null },
                { id: 8, nombre: '✅ Consolidando Resultados', descripcion: 'Agrupando y validando datos finales...', estado: 'pendiente', tiempo: null, resultado: null }
            ],

            datosReporte: [],
            busquedaTabla: '',
            filtroEmpresa: '',

            estadisticas: {
                totalRegistros: 0,
                totalVentas: 0,
                totalAbonos: 0,
                totalSaldos: 0
            },

            mostrarDetalleCalculo: false,
            registroSeleccionado: null,
            detalleTransacciones: {
                abonos: [],
                devoluciones: [],
                facturas_operativas: []
            },
            cargandoDetalle: false,
            empresaPlataforma: empresa ? JSON.parse(empresa) : null
        };
    },
    computed: {
        devolucionesAgrupadas() {
            if (!this.registroSeleccionado || !this.registroSeleccionado.devolucion_todas || this.registroSeleccionado.devolucion_todas.length === 0) {
                return {};
            }
            
            const grupos = {};
            this.registroSeleccionado.devolucion_todas.forEach(dev => {
                const codigo = dev.codigo_devolucion || 'SIN-CODIGO';
                if (!grupos[codigo]) {
                    grupos[codigo] = {
                        ventas: [],
                        total: 0
                    };
                }
                grupos[codigo].ventas.push(dev);
                grupos[codigo].total += parseFloat(dev.ValorConDescuento || 0);
            });
            
            return grupos;
        },
        datosFiltrados() {
            let datos = this.datosReporte;

            if (this.busquedaTabla) {
                const busqueda = this.busquedaTabla.toLowerCase();
                datos = datos.filter(item => 
                    (item.nombreInstitucion && item.nombreInstitucion.toLowerCase().includes(busqueda)) ||
                    (item.cliente_facturado && item.cliente_facturado.toLowerCase().includes(busqueda)) ||
                    (item.ruc_cliente && item.ruc_cliente.toLowerCase().includes(busqueda)) ||
                    (item.asesor && item.asesor.toLowerCase().includes(busqueda))
                );
            }

            if (this.filtroEmpresa) {
                datos = datos.filter(item => item.empresa === this.filtroEmpresa);
            }

            return datos;
        },

        totalesCalculados() {
            const datos = this.datosFiltrados;
            
            return {
                ventas: {
                    label: 'Total Ventas',
                    valor: datos.reduce((sum, item) => sum + (parseFloat(item.valor_total) || 0), 0),
                    clase: 'text-primary'
                },
                abonos: {
                    label: 'Total Abonos',
                    valor: datos.reduce((sum, item) => sum + (parseFloat(item.abono_total) || 0), 0),
                    clase: 'text-success'
                },
                devoluciones: {
                    label: 'Total Devoluciones',
                    valor: datos.reduce((sum, item) => sum + (parseFloat(item.devolucion) || 0), 0),
                    clase: 'text-warning'
                },
                retenciones: {
                    label: 'Total Retenciones',
                    valor: datos.reduce((sum, item) => sum + (parseFloat(item.retencion_total) || 0), 0),
                    clase: 'text-primary'
                },
                saldos: {
                    label: 'Total Saldos',
                    valor: datos.reduce((sum, item) => sum + this.calcularSaldo(item), 0),
                    clase: 'text-danger'
                }
            };
        }
    },
    watch: {
        active(val) {
            this.popupActive = val;
            if (val) {
                this.iniciarProceso();
            }
        },
        popupActive(val) {
            if (!val) {
                this.$emit('update:active', false);
                this.resetearPopup();
            }
        }
    },
    methods: {
        async iniciarProceso() {
            this.tiempoInicio = Date.now();
            this.iniciarTemporizador();
            this.reporteCompleto = false;
            this.progresoTotal = 0;
            this.datosReporte = [];

            try {
                // Paso 1: Obtener Ventas
                await this.ejecutarPaso(0, async () => {
                    const res = await this.$http.get(this.$server_url + 'obtenerVentasProgresivo?periodo=' + this.periodoSelect.idperiodoescolar);
                    this.datosReporte = res.data.data;
                    this.estadisticas.totalRegistros = res.data.total;
                    this.estadisticas.totalVentas = this.datosReporte.reduce((sum, item) => sum + (parseFloat(item.valor_total) || 0), 0);
                    return `${res.data.total} registros obtenidos`;
                });

                // Paso 2: Obtener Abonos
                await this.ejecutarPaso(1, async () => {
                    const res = await this.$http.post(this.$server_url + 'obtenerAbonosProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    this.datosReporte = res.data.data;
                    const totalAbonos = this.datosReporte.reduce((sum, item) => sum + (parseFloat(item.abono_total) || 0), 0);
                    return `$${this.formatNumber(totalAbonos)} en abonos`;
                });

                // Paso 3: Obtener Devoluciones
                await this.ejecutarPaso(2, async () => {
                    const res = await this.$http.post(this.$server_url + 'obtenerDevolucionesProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    this.datosReporte = res.data.data;
                    const totalDev = this.datosReporte.reduce((sum, item) => sum + (parseFloat(item.devolucion) || 0), 0);
                    return `$${this.formatNumber(totalDev)} en devoluciones`;
                });

                // Paso 4: Devoluciones Sin Empresa
                await this.ejecutarPaso(3, async () => {
                    const res = await this.$http.post(this.$server_url + 'obtenerDevolucionesSinEmpresaProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    if (res.data.data.length > 0) {
                        this.datosReporte = [...this.datosReporte, ...res.data.data];
                    }
                    return `${res.data.data.length} devoluciones sin empresa`;
                });

                // Paso 5: Abonos Sin Documentos
                await this.ejecutarPaso(4, async () => {
                    const res = await this.$http.post(this.$server_url + 'obtenerAbonosSinDocumentosProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    if (res.data.data.length > 0) {
                        this.datosReporte = [...this.datosReporte, ...res.data.data];
                    }
                    return `${res.data.data.length} abonos sin documentos`;
                });

                // Paso 6: Retenciones Sin Documentos
                await this.ejecutarPaso(5, async () => {
                    const res = await this.$http.post(this.$server_url + 'obtenerRetencionesSinDocumentosProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    if (res.data.data.length > 0) {
                        this.datosReporte = [...this.datosReporte, ...res.data.data];
                    }
                    return `${res.data.data.length} retenciones sin pre-facturas`;
                });

                // Paso 7: Facturas Operativas (crea filas separadas)
                await this.ejecutarPaso(6, async () => {
                    const res = await this.$http.post(this.$server_url + 'obtenerFacturasOperativasProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    this.datosReporte = res.data.data;
                    const totalFactOp = this.datosReporte.filter(item => item.tdo_nombre === 'FACTURA OP').reduce((sum, item) => sum + (parseFloat(item.factura_operativa) || 0), 0);
                    return `$${this.formatNumber(totalFactOp)} en facturas operativas`;
                });

                // Paso 8: Agrupar Resultados
                await this.ejecutarPaso(7, async () => {
                    const res = await this.$http.post(this.$server_url + 'agruparResultadosFinalesProgresivo', {
                        periodo: this.periodoSelect.idperiodoescolar,
                        registros: JSON.stringify(this.datosReporte)
                    });
                    this.datosReporte = res.data.data;
                    return `${res.data.total} registros consolidados`;
                });

                this.reporteCompleto = true;
                this.progresoTotal = 100;
                this.detenerTemporizador();

                // Debug: Ver todos los saldos calculados
                console.log('💰 Análisis de saldos:', {
                    total_registros: this.datosReporte.length,
                    saldos_positivos: this.datosReporte.filter(item => this.calcularSaldo(item) > 0).length,
                    saldos_negativos: this.datosReporte.filter(item => this.calcularSaldo(item) < 0).length,
                    saldos_cero: this.datosReporte.filter(item => this.calcularSaldo(item) === 0).length,
                    ejemplos_negativos: this.datosReporte.filter(item => this.calcularSaldo(item) < 0).slice(0, 3).map(item => ({
                        cliente: item.cliente_facturado,
                        documento: item.tdo_nombre,
                        saldo: this.calcularSaldo(item)
                    }))
                });

                this.$vs.notify({
                    title: 'Éxito',
                    text: 'Reporte generado correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });

            } catch (error) {
                console.error('Error al generar reporte:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'Error al generar el reporte: ' + (error.message || 'Error desconocido'),
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
                this.detenerTemporizador();
            }
        },

        async ejecutarPaso(indice, funcion) {
            const tiempoInicioPaso = Date.now();
            this.procesos[indice].estado = 'procesando';
            
            try {
                const resultado = await funcion();
                const tiempoFin = ((Date.now() - tiempoInicioPaso) / 1000).toFixed(2);
                
                this.procesos[indice].estado = 'completado';
                this.procesos[indice].tiempo = tiempoFin;
                this.procesos[indice].resultado = resultado;
                this.progresoTotal = ((indice + 1) / this.procesos.length) * 100;
                
                // Pequeña pausa para que se vea el cambio
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                this.procesos[indice].estado = 'error';
                this.procesos[indice].resultado = 'Error: ' + error.message;
                throw error;
            }
        },

        iniciarTemporizador() {
            this.intervalTiempo = setInterval(() => {
                this.tiempoTranscurrido = ((Date.now() - this.tiempoInicio) / 1000).toFixed(1);
            }, 100);
        },

        detenerTemporizador() {
            if (this.intervalTiempo) {
                clearInterval(this.intervalTiempo);
            }
        },

        calcularSaldo(registro) {
            const ven_valor = parseFloat(registro.valor_total) || 0;
            const abono_total = parseFloat(registro.abono_total) || 0;
            const devolucion = parseFloat(registro.devolucion) || 0;
            const retencion_total = parseFloat(registro.retencion_total) || 0;
            const cruces = parseFloat(registro.abono_cruce) || 0;
            const factura_operativa = parseFloat(registro.factura_operativa) || 0;

            // Casos especiales
            if (registro.tdo_nombre === 'DEVOLUCION SIN EMPRESA') {
                return devolucion * -1;
            }
            if (registro.tdo_nombre === 'ABONO SIN VENTAS' || 
                registro.tdo_nombre === 'ABONO SIN PRE-FACTURAS' || 
                registro.tdo_nombre === 'ABONO SIN NOTAS') {
                return abono_total * -1;
            }
            if (registro.tdo_nombre === 'RETENCION SIN PRE-FACTURAS') {
                return retencion_total * -1;
            }
            if (registro.tdo_nombre === 'FACTURA OP') {
                return factura_operativa;
            }

            // Fórmula: Ventas - (Abonos + Devoluciones + Retenciones + Cruces)
            return parseFloat((ven_valor - (abono_total + devolucion + retencion_total + cruces)).toFixed(2));
        },

        getSaldoClass(saldo) {
            if (saldo > 0) return 'text-danger';
            if (saldo < 0) return 'text-success';
            return '';
        },

        verDetalleCalculo(registro) {
            this.registroSeleccionado = registro;
            this.mostrarDetalleCalculo = true;
            this.detalleTransacciones = {
                abonos: [],
                devoluciones: registro.devolucion_todas || [],
                facturas_operativas: []
            };
            
            // Debug: ver qué datos vienen
            console.log('📦 Registro Seleccionado:', registro);
            console.log('📋 Devoluciones Todas:', registro.devolucion_todas);
            if (registro.devolucion_todas && registro.devolucion_todas.length > 0) {
                console.log('📄 Primera Devolución:', registro.devolucion_todas[0]);
                console.log('🔑 Campos disponibles:', Object.keys(registro.devolucion_todas[0]));
            }
        },

        async cargarDetalleAbonos(registro) {
            if (this.detalleTransacciones.abonos.length > 0) return; // Ya cargado
            
            this.cargandoDetalle = true;
            try {
                const response = await this.$http.get(this.$server_url + 'obtenerDetalleTransacciones', {
                    params: {
                        ruc_cliente: registro.ruc_cliente,
                        periodo: this.periodoSelect.idperiodoescolar,
                        id_empresa: registro.id_empresa,
                        id_institucion: registro.idInstitucion,
                        todos_los_documentos: registro.todos_los_documentos || ''
                    }
                });
                
                if (response.data.success) {
                    this.detalleTransacciones.abonos = response.data.data.abonos || [];
                    this.detalleTransacciones.facturas_operativas = response.data.data.facturas_operativas || [];
                }
            } catch (error) {
                console.error('Error al cargar detalle de transacciones:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudo cargar el detalle',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            } finally {
                this.cargandoDetalle = false;
            }
        },

        getRowClass(registro) {
            if (registro.tdo_nombre === 'DEVOLUCION SIN EMPRESA') return 'row-devolucion-sin-empresa';
            if (registro.tdo_nombre === 'ABONO SIN VENTAS' || 
                registro.tdo_nombre === 'ABONO SIN PRE-FACTURAS' || 
                registro.tdo_nombre === 'ABONO SIN NOTAS') return 'row-abono-sin-doc';
            if (registro.tdo_nombre === 'FACTURA OP') return 'row-factura-operativa';
            return '';
        },

        formatNumber(num) {
            return parseFloat(num || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },

        async exportarExcel() {
            const fecha = new Date();
            const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            
            // Primera hoja: Reporte General
            const wsData = this.prepararDatosExcel('Reporte Ventas, Abonos, Saldos - General', fechaFormateada);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 15 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 15 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } }
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

            // Segunda hoja: Detalles Abonos
            this.$vs.loading();
            try {
                const abonos = await this.obtenerAbonosParaReporte();
                if (abonos && abonos.length > 0) {
                    const wsAbonosData = this.prepareAbonosData(abonos);
                    const wsAbonos = XLSX.utils.aoa_to_sheet(wsAbonosData);
                    
                    // Combinar celdas para el título de la hoja de abonos
                    wsAbonos['!merges'] = [
                        { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } } // Título en primera fila
                    ];
                    
                    XLSX.utils.book_append_sheet(wb, wsAbonos, 'Detalles Abonos');
                }
            } catch (error) {
                console.error('Error al obtener abonos:', error);
                this.$vs.notify({
                    title: 'Advertencia',
                    text: 'No se pudo agregar la hoja de detalles de abonos',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            } finally {
                this.$vs.loading.close();
            }

            XLSX.writeFile(wb, `Reporte_Cobranzas_${this.periodoSelect.descripcion}.xlsx`);
        },

        prepararDatosExcel(titulo, fecha) {
            const wsData = [];
            wsData.push([titulo]);
            wsData.push(['TEMPORADA ' + this.periodoSelect.descripcion]);
            wsData.push([fecha]);
            wsData.push([]);

            wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'P.VENTA/INST', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 
                         'ABONOS', 'DEV.BRUTA', 'DEVOLUCIONES', 'LIQUIDACIONES', 'RETENCIONES', 'CRUCES', 'SALDO', 'SERIE', 'TEMPORADA']);

            this.datosFiltrados.forEach(item => {
                wsData.push([
                    item.empresa,
                    item.tdo_nombre,
                    item.punto_venta == 1 ? 'directa' : 'lista',
                    item.nombreInstitucion,
                    item.cliente_facturado,
                    item.asesor,
                    parseFloat(item.subtotal_total || 0).toFixed(2) * 1,
                    parseFloat(item.valor_total || 0).toFixed(2) * 1,
                    parseFloat(item.abono_total || 0).toFixed(2) * 1,
                    parseFloat(item.devolucion_bruta || 0).toFixed(2) * 1,
                    parseFloat(item.devolucion || 0).toFixed(2) * 1,
                    parseFloat(item.abono_liquidacion || 0).toFixed(2) * 1,
                    parseFloat(item.retencion_total || 0).toFixed(2) * 1,
                    parseFloat(item.abono_cruce || 0).toFixed(2) * 1,
                    this.calcularSaldo(item),
                    this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A',
                    this.periodoSelect.descripcion
                ]);
            });

            return wsData;
        },

        cerrarPopup() {
            this.popupActive = false;
        },

        resetearPopup() {
            this.reporteCompleto = false;
            this.progresoTotal = 0;
            this.datosReporte = [];
            this.busquedaTabla = '';
            this.filtroEmpresa = '';
            this.procesos.forEach(p => {
                p.estado = 'pendiente';
                p.tiempo = null;
                p.resultado = null;
            });
            this.detenerTemporizador();
        },

        // Método para obtener abonos desde el backend
        async obtenerAbonosParaReporte() {
            try {
                const response = await this.$http.get(this.$server_url + 'obtenerAbonosCuentas', {
                    params: {
                        fecha_inicio: null,
                        fecha_final: null,
                        cuenta: 'todas',
                        busqueda: 'Todo',
                        temporada: this.periodoSelect.idperiodoescolar
                    }
                });
                return response.data || [];
            } catch (error) {
                console.error('Error al obtener abonos:', error);
                return [];
            }
        },

        // Método para preparar datos de abonos con 15 columnas (alineado con backend)
        prepareAbonosData(abonos) {
            const wsData = [];
            let totalAbono = 0;

            wsData.push(['Detalles Abonos']);
            wsData.push([]);

            // Columnas alineadas con el backend (reporteAbonosGlobal)
            wsData.push([
                'N° ABONO/RETENCIÓN',
                'AÑO',
                'FECHA ABONO/RETENCIÓN',
                'PERIODO',
                'CUENTA DE PAGO',
                'NÚMERO CUENTA',
                'DOCUMENTO ABONO/RETENCIÓN',
                'VALOR ABONO/RETENCIÓN',
                'EMPRESA',
                'CLIENTE',
                'RUC CLIENTE',
                'LUGAR DESPACHO',
                'CONCEPTO',
                'ESTADO',
                'FECHA CREACIÓN'
            ]);

            abonos.forEach(item => {
                // Lógica de valor igual al backend
                const valorAbono = item.cue_pag_codigo == 8 
                    ? item.abono_valor_retencion * 1 
                    : (item.abono_facturas > 0 ? item.abono_facturas * 1 : item.abono_notas * 1);
                
                const abonoFecha = item.abono_fecha ? item.abono_fecha : 'No disponible';
                const abonoDocumento = item.abono_documento ? item.abono_documento : '';
                
                // Mapeo de empresas igual al backend
                const empresaNombre = item.abono_empresa == 1 ? 'PROLIPA' 
                    : item.abono_empresa == 3 ? 'CALMED S.A'
                    : item.abono_empresa == 5 ? 'PROLIPA 2026'
                    : item.abono_empresa == 4 ? 'CALMED 2026'
                    : 'OTRA';
                
                // Estado igual al backend
                const estadoNombre = item.abono_estado == 0 ? 'Pendiente' 
                    : item.abono_estado == 2 ? 'Verificado' 
                    : 'Otro';
                
                // Extraer año de la fecha
                const year = item.abono_fecha ? new Date(item.abono_fecha).getFullYear() : '';

                totalAbono += valorAbono;

                wsData.push([
                    item.abono_id,
                    year,
                    abonoFecha,
                    this.periodoSelect.descripcion || item.periodo_nombre || '', // Usar periodo del reporte
                    item.cue_pag_nombre,
                    item.cue_pag_numero || '',
                    abonoDocumento,
                    valorAbono.toFixed(2) * 1,
                    empresaNombre,
                    item.cliente || '',
                    item.ruc_cliente || '',
                    item.institucion || '',
                    item.abono_concepto || '',
                    estadoNombre,
                    item.created_at || ''
                ]);
            });

            wsData.push(['', '', '', '', '', '', 'Total Abono:', totalAbono.toFixed(2) * 1, '', '', '', '', '', '', '']);
            wsData.push([]);

            return wsData;
        }
    },

    beforeDestroy() {
        this.detenerTemporizador();
    }
};
</script>

<style scoped>
.popup-reporte-progresivo >>> .vs-popup {
    background: #f5f7fa;
}

.contenedor-reporte {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
}

/* Sección de Progreso */
.seccion-progreso {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
}

.header-progreso {
    text-align: center;
    margin-bottom: 40px;
}

.titulo-progreso {
    font-size: 32px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
}

.subtitulo-progreso {
    font-size: 16px;
    color: #7f8c8d;
}

.barra-progreso-contenedor {
    margin-bottom: 40px;
}

.barra-progreso {
    width: 100%;
    height: 30px;
    background: #e0e6ed;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.barra-progreso-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.5s ease;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.5);
}

.texto-progreso {
    display: block;
    text-align: center;
    margin-top: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #667eea;
}

.lista-procesos {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.proceso-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e6ed;
    transition: all 0.3s ease;
}

.proceso-item:last-child {
    border-bottom: none;
}

.proceso-item.procesando {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
}

.proceso-item.completado {
    background: #d4edda;
    border-left: 4px solid #28a745;
}

.proceso-icono {
    font-size: 28px;
    margin-right: 20px;
}

.icon-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    100% { transform: rotate(360deg); }
}

.proceso-info {
    flex: 1;
}

.proceso-info h4 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
}

.proceso-info p {
    font-size: 14px;
    color: #7f8c8d;
    margin: 0;
}

.proceso-resultado {
    color: #667eea !important;
    font-weight: 500;
    margin-top: 5px !important;
}

.proceso-tiempo {
    font-size: 14px;
    color: #667eea;
    font-weight: 600;
    background: #e8ecff;
    padding: 5px 15px;
    border-radius: 20px;
}

.info-adicional {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    gap: 20px;
}

.stat-card {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.stat-icon {
    font-size: 40px;
    margin-right: 15px;
}

.stat-info h5 {
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 5px;
}

.stat-info p {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
}

/* Sección de Resultados */
.seccion-resultados {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.header-resultados {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e0e6ed;
}

.titulo-resultados {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
}

.botones-accion {
    display: flex;
    gap: 10px;
}

.filtros-contenedor {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
}

.input-busqueda {
    flex: 2;
}

.select-filtro {
    flex: 1;
}

.resumen-totales {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.total-card {
    background: #ffffff;
    border: 2px solid #e0e6ed;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.total-card:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
}

.total-card h5 {
    font-size: 14px;
    margin-bottom: 10px;
    color: #7f8c8d;
    font-weight: 600;
}

.total-card p {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.tabla-contenedor {
    overflow-x: auto;
}

.row-devolucion-sin-empresa {
    background-color: #fff3cd !important;
}

.row-abono-sin-doc {
    background-color: #d1ecf1 !important;
}

.row-factura-operativa {
    background-color: #d4edda !important;
}

.text-success {
    color: #28a745 !important;
}

.text-danger {
    color: #dc3545 !important;
}

.text-warning {
    color: #ffc107 !important;
}

.text-primary {
    color: #007bff !important;
}

/* Estilos del Popup de Detalle de Cálculo */
.popup-detalle-calculo >>> .vs-popup {
    max-width: 700px !important;
}

.detalle-calculo-contenedor {
    padding: 20px;
}

.header-detalle {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.header-detalle h3 {
    font-size: 22px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
}

.header-detalle p {
    margin: 5px 0;
    color: #7f8c8d;
}

.calculo-detallado h4 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
}

/* Collapse Headers */
.collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.collapse-header:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.collapse-header.positivo {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border-left: 4px solid #28a745;
}

.collapse-header.negativo {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    border-left: 4px solid #dc3545;
}

.collapse-header .label {
    font-size: 16px;
}

.collapse-header .valor {
    font-size: 18px;
    font-weight: 700;
}

/* Collapse Content */
.collapse-content {
    padding: 15px 20px;
    background: #f8f9fa;
    margin-top: 5px;
    border-radius: 0 0 8px 8px;
}

.subitem {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 15px;
    color: #495057;
}

.subitem.total {
    margin-top: 10px;
    padding-top: 15px;
    color: #2c3e50;
    font-size: 16px;
}

.subitem span:first-child {
    color: #6c757d;
}

.subitem span:last-child {
    font-weight: 600;
    color: #2c3e50;
}

/* Ajustes para el vs-collapse */
.calculo-detallado >>> .con-vs-collapse {
    margin-bottom: 10px;
}

.calculo-detallado >>> .vs-collapse-item {
    border: none !important;
    box-shadow: none !important;
}

.calculo-detallado >>> .vs-collapse-item--header {
    padding: 0 !important;
    background: transparent !important;
}

.calculo-detallado >>> .vs-collapse-item--content {
    padding: 0 !important;
}

/* Detalle de Transacciones */
.detalle-transacciones {
    margin-bottom: 15px;
}

.subtitulo-detalle {
    font-size: 14px;
    color: #495057;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #dee2e6;
}

.transaccion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    margin-bottom: 5px;
    background: #ffffff;
    border-left: 3px solid #667eea;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.transaccion-item:hover {
    background: #f0f4ff;
    transform: translateX(3px);
}

.transaccion-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.transaccion-codigo {
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
}

.transaccion-fecha {
    font-size: 12px;
    color: #6c757d;
    margin-top: 2px;
}

.transaccion-monto {
    font-size: 15px;
    font-weight: 700;
    color: #dc3545;
}

.transaccion-valores {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.valor-bruto {
    color: #6c757d;
    text-decoration: line-through;
    font-size: 11px;
    margin-bottom: 2px;
}

.badge-descuento {
    display: inline-block;
    background: #ffc107;
    color: #000;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
    margin-left: 5px;
}

/* Estilos para agrupación de devoluciones */
.grupo-devolucion {
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.encabezado-devolucion {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
}

.total-grupo {
    font-size: 16px;
    font-weight: 700;
}

.ventas-devolucion {
    background: #f8f9fa;
    padding: 10px;
}

.venta-item {
    background: white;
    padding: 10px 15px;
    margin-bottom: 8px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 3px solid #667eea;
}

.venta-item:last-child {
    margin-bottom: 0;
}

.venta-info {
    flex: 1;
}

.venta-documento {
    font-size: 13px;
    color: #495057;
}

.venta-valores {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.venta-monto {
    font-size: 14px;
    font-weight: 700;
    color: #dc3545;
}

.item-calculo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    font-size: 16px;
}

.item-calculo.positivo {
    background: #d4edda;
    border-left: 4px solid #28a745;
}

.item-calculo.negativo {
    background: #f8d7da;
    border-left: 4px solid #dc3545;
}

.item-calculo .label {
    font-weight: 500;
    color: #2c3e50;
}

.item-calculo .valor {
    font-weight: 700;
    font-size: 18px;
    color: #2c3e50;
}

.formula-calculo {
    background: #e8ecff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
}

.formula-calculo strong {
    font-size: 16px;
    color: #2c3e50;
}

.formula-box {
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin-top: 10px;
    border: 2px solid #667eea;
}

.formula-box code {
    display: block;
    font-size: 14px;
    color: #667eea;
    font-weight: 600;
    margin-bottom: 10px;
    font-family: 'Courier New', monospace;
}

.detalle-formula {
    font-size: 13px;
    color: #7f8c8d;
    margin: 10px 0;
    line-height: 1.8;
}

.formula-box .resultado {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    margin: 10px 0 0 0;
    text-align: right;
}

.saldo-final {
    text-align: center;
    padding: 30px;
    border-radius: 12px;
    margin-top: 20px;
}

.saldo-final.text-danger {
    background: #fff5f5;
    border: 2px solid #dc3545;
}

.saldo-final.text-success {
    background: #f0fdf4;
    border: 2px solid #28a745;
}

.saldo-final h3 {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 10px;
}

.saldo-final h2 {
    font-size: 36px;
    font-weight: 700;
    margin: 10px 0;
}

.saldo-final .estado-saldo {
    font-size: 16px;
    margin-top: 10px;
    font-weight: 600;
}

.botones-detalle {
    text-align: center;
    margin-top: 30px;
}


.scroll-cell {
  max-height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-word;
}
</style>
