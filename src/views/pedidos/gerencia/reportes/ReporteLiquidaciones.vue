<template>
<div class="container mx-auto px-4">
    <div class="mb-4 mt-5">
        <div v-if="ifExterno==0" class="mt-5">
            <h4>Seleccione el período para el reporte</h4>
            <small class="block mb-2">Buscar periodo:</small>
            <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos" @input="selectedAsesor=null;verLiquidaciones();" label="periodoescolar" class="w-full" v-model="periodoSelect" />
        </div>
        <div v-if="periodoSelect" class="mt-5">

            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card kpi-blue">
                    <div class="kpi-label">Venta Bruta</div>
                    <div class="kpi-value">{{ totalVenta * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-orange">
                    <div class="kpi-label">Comisiones</div>
                    <div class="kpi-value">{{ totalVentaDescuento * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-green">
                    <div class="kpi-label">Venta Neta</div>
                    <div class="kpi-value">{{ totalVentaNeta * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-purple">
                    <div class="kpi-label">Convenios Pagados</div>
                    <div class="kpi-value">{{ totalConveniosPagadosComp * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-teal">
                    <div class="kpi-label">Conv. Global</div>
                    <div class="kpi-value">{{ totalConvenioGlobalComp * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-indigo">
                    <div class="kpi-label">Anticipos</div>
                    <div class="kpi-value">{{ totalAnticipos * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-cyan">
                    <div class="kpi-label">Liquidaciones</div>
                    <div class="kpi-value">{{ totalLiquidaciones * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-yellow">
                    <div class="kpi-label">Pagos</div>
                    <div class="kpi-value">{{ totalAnticiposConvenio * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card" :class="totalSaldoPendiente * 1 > 0 ? 'kpi-red' : 'kpi-green'">
                    <div class="kpi-label">Saldo Pendiente</div>
                    <div class="kpi-value">{{ totalSaldoPendiente * 1 | filtrarDecimal }}</div>
                </div>
                <div class="kpi-card kpi-gray">
                    <div class="kpi-label">Total Pedidos</div>
                    <div class="kpi-value">{{ filteredLiquidaciones.length }}</div>
                </div>
            </div>

            <!-- Filtros -->
            <div class="filtros-section">
                <div class="filtros-header">
                    <span class="filtros-title"><i class="fa-solid fa-sliders"></i> Filtros</span>
                    <button class="btn-limpiar" @click="limpiarFiltros()">
                        <i class="fa-solid fa-rotate-left"></i> Limpiar
                    </button>
                </div>
                <div class="filtros-grid">
                    <div class="filtro-item">
                        <label class="filtro-label">Asesor</label>
                        <v-select
                            :options="asesores"
                            :reduce="a => a.id_asesor"
                            label="vendedor"
                            v-model="selectedAsesor"
                            placeholder="Todos"
                            @input="applyFilters()"
                        />
                    </div>
                    <div class="filtro-item">
                        <label class="filtro-label">Estado</label>
                        <v-select
                            :options="opcionesEstado"
                            :reduce="e => e.value"
                            label="label"
                            v-model="filtroEstado"
                            placeholder="Todos"
                            @input="applyFilters()"
                        />
                    </div>
                    <div class="filtro-item">
                        <label class="filtro-label">Convenio</label>
                        <v-select
                            :options="opcionesConvenio"
                            :reduce="e => e.value"
                            label="label"
                            v-model="filtroConvenio"
                            placeholder="Todos"
                            @input="applyFilters()"
                        />
                    </div>
                    <div class="filtro-item">
                        <label class="filtro-label">Anticipos</label>
                        <v-select
                            :options="opcionesAnticipos"
                            :reduce="e => e.value"
                            label="label"
                            v-model="filtroAnticipos"
                            placeholder="Todos"
                            @input="applyFilters()"
                        />
                    </div>
                    <div class="filtro-item">
                        <label class="filtro-label">Saldo Pendiente</label>
                        <v-select
                            :options="opcionesSaldo"
                            :reduce="e => e.value"
                            label="label"
                            v-model="filtroSaldo"
                            placeholder="Todos"
                            @input="applyFilters()"
                        />
                    </div>
                </div>
            </div>

            <!-- Modal Fórmula Saldo Pendiente -->
            <div v-if="showFormulaModal" class="formula-overlay" @click.self="showFormulaModal=false">
                <div class="formula-modal">
                    <div class="formula-modal-header">
                        <span><i class="fa-solid fa-function"></i> Fórmula — Saldo Pendiente</span>
                        <button class="formula-close" @click="showFormulaModal=false"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="formula-modal-body">
                        <div class="formula-actual">
                            <div class="formula-tag">Fórmula actual</div>
                            <div class="formula-display">
                                Saldo Pendiente = <span class="f-var">Comisión</span> − <span class="f-var">Pagos</span> − <span class="f-var">Deuda Anterior</span>
                            </div>
                            <div class="formula-desc">
                                <b>Comisión</b> = Venta Bruta × (Descuento / 100)<br>
                                <b>Pagos</b> = Convenio + Anticipos + Liquidaciones + Otros<br>
                                <b>Deuda Anterior</b> = deuda arrastrada de períodos previos
                            </div>
                        </div>

                        <div class="formula-divider">Probar fórmula personalizada</div>

                        <div class="formula-custom">
                            <div class="formula-options">
                                <label class="formula-option" v-for="f in formulasDisponibles" :key="f.id">
                                    <input type="radio" :value="f.id" v-model="formulaSeleccionada" @change="recalcularConFormula()" />
                                    <div class="formula-option-content">
                                        <div class="formula-option-name">{{ f.nombre }}</div>
                                        <div class="formula-option-expr">{{ f.expresion }}</div>
                                    </div>
                                </label>
                            </div>

                            <div v-if="formulaSeleccionada !== 'default'" class="formula-preview">
                                <div class="formula-preview-title">Vista previa (primeros 5 registros)</div>
                                <table class="formula-table">
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Saldo Original</th>
                                            <th>Saldo Nuevo</th>
                                            <th>Diferencia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in previewFormula" :key="row.id">
                                            <td>{{ row.id }}</td>
                                            <td>{{ row.original }}</td>
                                            <td :class="row.nuevo * 1 > 0 ? 'text-red' : 'text-green'">{{ row.nuevo }}</td>
                                            <td :class="row.diff * 1 > 0 ? 'text-red' : 'text-green'">{{ row.diff }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabla de Liquidaciones -->
            <vs-table max-items="10" pagination search :data="filteredLiquidaciones" class="mt-4">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b>{{ filteredLiquidaciones.length }}</b></vs-chip>
                    <button class="btn-formula" @click="showFormulaModal=true">
                        <i class="fa-solid fa-function"></i> Ver fórmula
                    </button>
                    <vs-button color="success" class="mb-2 p-3 ml-3" @click="ExportarLiquidaciones"><i class="fa-solid fa-download"></i> Exportar</vs-button>
                </template>

                <template slot="thead">
                    <vs-th width="280">Información</vs-th>
                    <vs-th>Venta Bruta</vs-th>
                    <vs-th>Descuento</vs-th>
                    <vs-th>Comisión</vs-th>
                    <vs-th>Venta Neta</vs-th>
                    <vs-th sort-key="valor_deudaAnterior">Deuda Anterior</vs-th>
                    <vs-th sort-key="convenio_global">Conv. Global</vs-th>
                    <vs-th sort-key="valor_convenio">Convenio Pagado</vs-th>
                    <vs-th>X Pagar</vs-th>
                    <vs-th sort-key="convenio_anios">Conv. Años</vs-th>
                    <vs-th sort-key="valor_anticipos">Anticipos</vs-th>
                    <vs-th sort-key="valor_liquidacion">Liquidaciones</vs-th>
                    <vs-th>Pagos</vs-th>
                    <vs-th>Saldo Pendiente</vs-th>
                    <vs-th v-for="n in maxVerificaciones" :key="'header-verif-' + n">Verificación {{ n }}</vs-th>
                </template>

                <template slot-scope="{ data }">
                    <vs-tr :key="indextr" v-for="(item, indextr) in data">
                        <vs-td>
                            <b># Pedido: </b>{{ item.id_pedido }}<br>
                            <b>Contrato:</b> {{ item.contrato_generado }}<br>
                            <b>Institución:</b> {{ item.nombreInstitucion }}<br>
                            <b>Vendedor:</b> {{ item.vendedor }}<br>
                            <span class="estado-badge" :class="{
                                'estado-liquidado': item.estadoPedido_Pagos != 4 && item.verificaciones > 0,
                                'estado-sin-liquidar': item.estadoPedido_Pagos != 4 && item.verificaciones == 0,
                                'estado-sin-codigos': item.estadoPedido_Pagos == 4
                            }">
                                {{ item.estadoPedido_Pagos == 4 ? 'SIN CÓDIGOS' : (item.verificaciones == 0 ? 'SIN LIQUIDAR' : 'LIQUIDADO') }}
                            </span>
                        </vs-td>
                        <vs-td>{{ getVenta(item) }}</vs-td>
                        <vs-td>{{ item.descuento }} %</vs-td>
                        <vs-td>{{ getDescuento(item) }}</vs-td>
                        <vs-td>{{ getVentaNeta(item) }}</vs-td>
                        <vs-td>{{ getDeudaAnterior(item) }}</vs-td>
                        <vs-td>{{ item.convenio_global > 0 ? item.convenio_global : '-' }}</vs-td>
                        <vs-td>
                            <template v-if="item.convenio_global > 0">
                                <div class="convenio-pagado-total">
                                    {{ item.totalConveniosPagados > 0 ? item.totalConveniosPagados : getConvenio(item) }}
                                </div>
                                <div v-if="item.pagosConvenios && item.pagosConvenios.length > 1" class="pagos-detalle">
                                    <div class="pagos-detalle-header">Detalles de pago:</div>
                                    <div v-for="(pago, i) in item.pagosConvenios.filter(p => p.doc_valor > 0)" :key="i" class="pago-item">
                                        <span class="pago-contrato">{{ pago.doc_numero || 'Sin doc.' }}</span>
                                        <span class="pago-valor">${{ pago.doc_valor | filtrarDecimal }}</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else>-</template>
                        </vs-td>
                        <vs-td>{{ getConvenioXPagar(item) }}</vs-td>
                        <vs-td>{{ item.convenio_global > 0 ? item.convenio_anios + ' años' : '-' }}</vs-td>
                        <vs-td>{{ getAnticipo(item) }}</vs-td>
                        <vs-td>{{ getLiquidaciones(item) }}</vs-td>
                        <vs-td>{{ getAnticiposConvenio(item) }}</vs-td>
                        <vs-td>{{ getSaldoPendiente(item) }}</vs-td>
                        <vs-td v-for="n in maxVerificaciones" :key="'verif-' + n + '-' + indextr">{{ getVerificacionFecha(item, n) }}</vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</div>
</template>

<script>
import PeriodoRepository from '@/repositories/PeriodoRepository'
import vSelect from 'vue-select'
import Generalmix from '@/mixins/Generalmix';

export default {
    mixins: [Generalmix],
    components: {
        vSelect,
    },
    data() {
        return {
            arrayPeriodos: [],
            ifpuntoVenta: 0,
            periodo_id: 0,
            nombrePeriodo: '',
            periodoSelect: '',
            mostrar: false,
            liquidaciones: [],
            selectedAsesor: null,
            filteredLiquidaciones: [],
            asesores: [],
            popupLiquidaciones: false,
            periodoDatos: [],
            filtroEstado: null,
            filtroConvenio: null,
            filtroAnticipos: null,
            filtroSaldo: null,
            showFormulaModal: false,
            formulaSeleccionada: 'default',
            formulasDisponibles: [
                {
                    id: 'default',
                    nombre: 'Fórmula actual',
                    expresion: 'Comisión − Pagos − Deuda Anterior',
                },
                {
                    id: 'sin_deuda',
                    nombre: 'Sin descontar deuda anterior',
                    expresion: 'Comisión − Pagos',
                },
                {
                    id: 'venta_neta',
                    nombre: 'Basado en Venta Neta',
                    expresion: 'Venta Neta − Pagos − Deuda Anterior',
                },
                {
                    id: 'solo_convenio',
                    nombre: 'Solo Convenio como pago',
                    expresion: 'Comisión − Convenio − Deuda Anterior',
                },
            ],
            previewFormula: [],
            opcionesEstado: [
                { label: 'Todos', value: null },
                { label: 'Liquidado', value: 'LIQUIDADO' },
                { label: 'Sin Liquidar', value: 'SIN LIQUIDAR' },
                { label: 'Liquidado sin Códigos', value: 'LIQUIDADO SIN CÓDIGOS' },
            ],
            opcionesConvenio: [
                { label: 'Todos', value: null },
                { label: 'Con Convenio', value: 'con' },
                { label: 'Sin Convenio', value: 'sin' },
                { label: 'Con Convenio Global', value: 'global' },
            ],
            opcionesAnticipos: [
                { label: 'Todos', value: null },
                { label: 'Con Anticipos', value: 'con' },
                { label: 'Sin Anticipos', value: 'sin' },
            ],
            opcionesSaldo: [
                { label: 'Todos', value: null },
                { label: 'Con Saldo Pendiente', value: 'con' },
                { label: 'Sin Saldo Pendiente', value: 'sin' },
            ],
        }
    },
    props: {
        periodo: {
            type: [Array, Object],
            default: () => []
        },
        ifExterno: {
            type: Number,
            default: 0
        }
    },
    mounted() {
        let me = this
        if (me.ifExterno != 0) {
            me.periodoDatos = me.periodo;
            me.periodoSelect = me.periodoDatos;
            me.selectedAsesor = null;
            me.verLiquidaciones();

        } else {
            me.obtenerPeriodos()
            console.log("me.periodo", me.periodo);

        }
        // me.obtenerPeriodos()
    },

    computed: {
        totalVenta() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getVenta(item));
            }, 0).toFixed(2);
        },

        totalVentaDescuento() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getDescuento(item));
            }, 0).toFixed(2);
        },

        totalAnticiposConvenio() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getAnticiposConvenio(item)) || 0;
            }, 0).toFixed(2);
        },

        totalSaldoPendiente() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getSaldoPendiente(item));
            }, 0).toFixed(2);
        },

        totalConvenio() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getConvenio(item));
            }, 0).toFixed(2);
        },

        totalAnticipos() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getAnticipo(item));
            }, 0).toFixed(2);
        },
        totalLiquidaciones() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getLiquidaciones(item));
            }, 0).toFixed(2);
        },
        totalVentaNeta() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getVentaNeta(item));
            }, 0).toFixed(2);
        },
        totalConvenioGlobalComp() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + (Number(item.convenio_global) || 0);
            }, 0).toFixed(2);
        },
        totalConveniosPagadosComp() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + (Number(item.totalConveniosPagados) || 0);
            }, 0).toFixed(2);
        },
        totalItems() {
            return [{
                    concept: "Total Venta Bruta",
                    amount: this.totalVenta * 1
                },
                {
                    concept: "Total Comisiones",
                    amount: this.totalVentaDescuento * 1
                },
                {
                    concept: "Total Venta Neta",
                    amount: this.totalVentaNeta * 1
                },
                {
                    concept: "Total Convenios",
                    amount: this.totalConvenio * 1
                },
                {
                    concept: "Total Anticipos",
                    amount: this.totalAnticipos * 1
                },
                {
                    concept: "Total Liquidaciones",
                    amount: this.totalLiquidaciones * 1
                },
                {
                    concept: "Total Pagos",
                    amount: this.totalAnticiposConvenio * 1
                },
                {
                    concept: "Saldo Pendiente",
                    amount: this.totalSaldoPendiente * 1
                }
            ];
        },
        maxVerificaciones() {
            if (!this.filteredLiquidaciones || this.filteredLiquidaciones.length === 0) {
                return 0;
            }
            return Math.max(...this.filteredLiquidaciones.map(item => {
                if (item.arrayVerificaciones && Array.isArray(item.arrayVerificaciones)) {
                    return item.arrayVerificaciones.length;
                }
                return 0;
            }));
        },
    },
    methods: {
        obtenerPeriodos() {
            let me = this;
            PeriodoRepository.getPeriodos().then(p => {
                me.arrayPeriodos = p.data.filter(p => p.reporte_gerencia == 1)
            });
        },
        f_selectPeriodo() {
            let me = this
            me.mostrar = false
            me.$vs.loading()
            setTimeout(() => {
                if (me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined) {
                    me.m_message("Seleccione un periodo por favor", "warning")
                    me.$vs.loading.close()
                    return
                }
                me.periodo_id = me.periodoSelect.idperiodoescolar
                me.nombrePeriodo = me.periodoSelect.periodoescolar
                me.mostrar = true
                me.$vs.loading.close()
            }, 1000)
        },
        //metodo para exportar los registros de liquidaciones
        // Calcula la venta total
        getVenta(item) {
            // Verifica si 'verificaciones' es mayor a 0
            if (item.verificaciones > 0) {
                return item.TotalVentaReal.toFixed(2); // Si está liquidado, devuelve el valor real
            } else {
                // Si no está liquidado, suma 'total_venta' y los alcances (si existen)
                const ventaTotal = item.total_venta + (item.alcances ? item.alcances * 1 : 0);
                return ventaTotal.toFixed(2); // Devuelve el total con 2 decimales
            }
        },
        // Calcula la venta con el descuento aplicado
        getVentaDescuento(item) {
            const venta = this.getVenta(item);
            return (venta - (venta * item.descuento) / 100).toFixed(2);
        },
        getDescuento(item) {
            const venta = this.getVenta(item);
            return ((venta * item.descuento) / 100).toFixed(2);
        },
        getDeudaAnterior(item) {
            return (item.valor_deudaAnterior * 1).toFixed(2);
        },
        getConvenio(item) {
            return (item.valor_convenio * 1).toFixed(2);
        },
        getConvenioXPagar(item) {
            const global = Number(item.convenio_global) || 0;
            const pagado = Number(item.totalConveniosPagados) || Number(item.valor_convenio) || 0;
            if (global <= 0) return '-';
            return (global - pagado).toFixed(2);
        },
        getAnticipo(item) {
            return (item.valor_anticipos * 1).toFixed(2);
        },
        getLiquidaciones(item) {
            return (item.valor_liquidacion * 1).toFixed(2);
        },
        getVentaNeta(item) {
            const venta = this.getVenta(item);
            const convenio = this.getDescuento(item);
            return (venta * 1 - convenio * 1).toFixed(2);
        },
        // Calcula los anticipos o el convenio
        getAnticiposConvenio(item) {
            // Función auxiliar para asegurar que se redondeen y se devuelvan solo dos decimales
            function roundToTwoDecimalPlaces(value) {
                return parseFloat(value.toFixed(2));
            }

            // Convertimos los valores a números con dos decimales
            const valorConvenio = item.valor_convenio ? roundToTwoDecimalPlaces(item.valor_convenio) : 0;
            const valorAnticipos = item.valor_anticipos ? roundToTwoDecimalPlaces(item.valor_anticipos) : 0;
            const valorLiquidacion = item.valor_liquidacion ? roundToTwoDecimalPlaces(item.valor_liquidacion) : 0;
            const valortotalAnticiposLiquidacionOtrosValores = item.valortotalAnticiposLiquidacionOtrosValores ? roundToTwoDecimalPlaces(item.valortotalAnticiposLiquidacionOtrosValores) : 0;

            // Caso cuando los cuatro valores existen
            if (valorConvenio && valorAnticipos && valorLiquidacion) {
                // Comprobamos si hay variaciones entre los valores
                if (valorConvenio !== valorAnticipos || valorConvenio !== valorLiquidacion ||
                    valorAnticipos !== valorLiquidacion) {
                    return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valortotalAnticiposLiquidacionOtrosValores); // Sumar si hay variación
                }
                return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valortotalAnticiposLiquidacionOtrosValores); // Caso sin variaciones
            }

            // Caso cuando existen tres valores
            if ((valorConvenio && valorAnticipos && valorLiquidacion) ||
                (valorConvenio && valorAnticipos ) ||
                (valorConvenio && valorLiquidacion) ||
                (valorAnticipos && valorLiquidacion)) {
                return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valortotalAnticiposLiquidacionOtrosValores);
            }

            // Caso cuando existen dos valores y hay variación entre ellos
            if ((valorConvenio && valorAnticipos) ||
                (valorConvenio && valorLiquidacion) ||
                (valorConvenio) ||
                (valorAnticipos && valorLiquidacion) ||
                (valorAnticipos) ||
                (valorLiquidacion )) {
                return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valortotalAnticiposLiquidacionOtrosValores);
            }

            // Caso cuando solo existe un valor
            if (valorConvenio) return roundToTwoDecimalPlaces(valorConvenio);
            if (valorAnticipos) return roundToTwoDecimalPlaces(valorAnticipos);
            if (valorLiquidacion) return roundToTwoDecimalPlaces(valorLiquidacion);

            // Caso por defecto cuando ninguno de los valores existe
            return '0';
        },
        // Calcula el saldo pendiente
        getSaldoPendiente(item) {
            const ventaDescuento = this.getDescuento(item);
            const anticiposConvenio = this.getAnticiposConvenio(item);
            let preSaldoPendiente = (ventaDescuento - parseFloat(anticiposConvenio)).toFixed(2);
            // RESTAR preSaldoPendiente - DEUDA ANTERIOR
            item.valor_deudaAnterior = item.valor_deudaAnterior ? item.valor_deudaAnterior : 0;
            let saldoPendienteFinal = (preSaldoPendiente - parseFloat(item.valor_deudaAnterior)).toFixed(2);
            return saldoPendienteFinal;
        },
        // Obtiene la fecha de verificación según el número
        getVerificacionFecha(item, numVerificacion) {
            if (!item.arrayVerificaciones || !Array.isArray(item.arrayVerificaciones) || item.arrayVerificaciones.length === 0) {
                return '-';
            }
            const verificacion = item.arrayVerificaciones.find(v => v.num_verificacion === numVerificacion);
            if (verificacion && verificacion.fecha_fin) {
                return this.formatearFecha(verificacion.fecha_fin);
            }
            return '-';
        },
        // Formatea la fecha de YYYY-MM-DD a YYYY-MM-DD (mantiene formato original)
        formatearFecha(fecha) {
            if (!fecha) return '-';
            return fecha; // Retorna en formato YYYY-MM-DD
        },
        recalcularConFormula() {
            const muestra = this.filteredLiquidaciones.slice(0, 5);
            this.previewFormula = muestra.map(item => {
                const original = parseFloat(this.getSaldoPendiente(item));
                const comision = parseFloat(this.getDescuento(item));
                const pagos = parseFloat(this.getAnticiposConvenio(item));
                const deuda = parseFloat(item.valor_deudaAnterior) || 0;
                const ventaNeta = parseFloat(this.getVentaNeta(item));
                const convenio = parseFloat(this.getConvenio(item));

                let nuevo = original;
                if (this.formulaSeleccionada === 'sin_deuda') {
                    nuevo = comision - pagos;
                } else if (this.formulaSeleccionada === 'venta_neta') {
                    nuevo = ventaNeta - pagos - deuda;
                } else if (this.formulaSeleccionada === 'solo_convenio') {
                    nuevo = comision - convenio - deuda;
                }

                return {
                    id: item.id_pedido,
                    original: original.toFixed(2),
                    nuevo: nuevo.toFixed(2),
                    diff: (nuevo - original).toFixed(2),
                };
            });
        },
        limpiarFiltros() {
            this.selectedAsesor = null;
            this.filtroEstado = null;
            this.filtroConvenio = null;
            this.filtroAnticipos = null;
            this.filtroSaldo = null;
            this.filteredLiquidaciones = this.liquidaciones;
        },
        // Método para filtrar las liquidaciones por asesor
        filterByAsesor() {
            this.applyFilters();
        },
        applyFilters() {
            let result = this.liquidaciones;

            if (this.selectedAsesor) {
                result = result.filter(item => item.id_asesor === this.selectedAsesor);
            }
            if (this.filtroEstado) {
                result = result.filter(item => {
                    const estado = item.estadoPedido_Pagos == 4 ? 'LIQUIDADO SIN CÓDIGOS' : (item.verificaciones > 0 ? 'LIQUIDADO' : 'SIN LIQUIDAR');
                    return estado === this.filtroEstado;
                });
            }
            if (this.filtroConvenio === 'con') {
                result = result.filter(item => item.valor_convenio > 0);
            } else if (this.filtroConvenio === 'sin') {
                result = result.filter(item => !item.valor_convenio || item.valor_convenio == 0);
            } else if (this.filtroConvenio === 'global') {
                result = result.filter(item => item.convenio_global > 0);
            }
            if (this.filtroAnticipos === 'con') {
                result = result.filter(item => item.valor_anticipos > 0);
            } else if (this.filtroAnticipos === 'sin') {
                result = result.filter(item => !item.valor_anticipos || item.valor_anticipos == 0);
            }
            if (this.filtroSaldo === 'con') {
                result = result.filter(item => parseFloat(this.getSaldoPendiente(item)) > 0);
            } else if (this.filtroSaldo === 'sin') {
                result = result.filter(item => parseFloat(this.getSaldoPendiente(item)) <= 0);
            }

            this.filteredLiquidaciones = result;
        },
        // Método para obtener las liquidaciones y extraer la lista de asesores
        async verLiquidaciones() {
            try {
                if (this.ifExterno == 0) {
                    console.log("this.periodoSelect", this.periodoSelect);
                    if (this.periodoSelect == undefined || this.periodoSelect == null || this.periodoSelect == "") {
                        this.$vs.notify({
                            text: 'Debe seleccionar un período',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        })
                        return
                    }
                }

                this.$vs.loading();

                // Hacer la solicitud GET para obtener las liquidaciones
                const response = await this.$http.get(`${this.$server_url}get_liquidaciones?periodo=${this.periodoSelect.idperiodoescolar}&tipoVenta=2`);

                this.liquidaciones = response.data;
                this.filteredLiquidaciones = this.liquidaciones;

                // Extraer los asesores únicos de las liquidaciones
                this.asesores = [...new Set(this.liquidaciones.map(item => item.id_asesor))].map(id => {
                    const asesor = this.liquidaciones.find(item => item.id_asesor === id);
                    return {
                        id_asesor: asesor.id_asesor,
                        vendedor: asesor.vendedor
                    };
                });

                this.$vs.loading.close();
                this.popupLiquidaciones = true;
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al obtener las liquidaciones:', error);
            }
        },
        async ExportarLiquidaciones() {
            try {
                this.$vs.loading();
                let me = this;
                const periodo = this.periodoSelect.periodoescolar; // Obtener el periodo

                // Hacer la solicitud GET al backend para obtener los datos
                const response = await this.$http.get(this.$server_url + 'get_liquidaciones?periodo=' + me.periodoSelect.idperiodoescolar+'&tipoVenta=2');
                const liquidaciones = response.data; // Los datos de liquidaciones

                // Crear un libro de trabajo de Excel
                const wb = XLSX.utils.book_new();

                // Preparar los datos del reporte de liquidaciones
                const wsData = [];

                // Calcular el número máximo de verificaciones
                const maxVerif = Math.max(...liquidaciones.map(item => {
                    if (item.arrayVerificaciones && Array.isArray(item.arrayVerificaciones)) {
                        return item.arrayVerificaciones.length;
                    }
                    return 0;
                }), 0);

                // Crear encabezados dinámicos para verificaciones
                const verificacionHeaders = [];
                for (let i = 1; i <= maxVerif; i++) {
                    verificacionHeaders.push(`Verificación ${i}`);
                }

                // Agregar título y encabezados al reporte
                wsData.push(["Reporte de Liquidaciones"]); // Título
                wsData.push([`Periodo: ${periodo}`]); // Información adicional del periodo
                wsData.push([]); // Espacio vacío
                wsData.push([
                    '# Pedido', 'Contrato Generado', 'Institución', 'Vendedor',
                    'Venta Bruta', 'Estado', 'Descuento', 'Comisión', 'Venta Neta',
                    'Deuda Anterior', 'Convenio Global', 'Convenio Pagado', 'X Pagar', 'Conv. Años', 'Anticipos',
                    'Liquidaciones', 'Pagos', 'Saldo Pendiente', ...verificacionHeaders
                ]); // Encabezado de la tabla

                // Agregar los datos de liquidaciones
                let totalVentaTotal = 0;
                let totalVentaReal = 0;
                let totalComision = 0;
                let totalAnticiposConvenio = 0;
                let totalSaldoPendiente = 0;
                let totalDeuda = 0;
                let totalConvenio = 0;
                let totalConvenioGlobal = 0;
                let totalConvenioPagado = 0;
                let totalAnticipos = 0;
                let totalLiquidaciones = 0;
                let totalVentaNeta = 0;
                liquidaciones.forEach(item => {
                    const ventaTotal = Number(this.getVenta(item)) || 0; // Convertir a número
                    const descuento = item.descuento || 0;
                    const comision = Number(this.getDescuento(item)) || 0; // Convertir a número
                    const anticiposConvenio = Number(this.getAnticiposConvenio(item)) || 0; // Convertir a número
                    const saldoPendiente = Number(this.getSaldoPendiente(item)) || 0; // Convertir a número
                    const deuda = Number(this.getDeudaAnterior(item)) || 0; // Convertir a número
                    const estado = item.estadoPedido_Pagos == 4 ? 'LIQUIDADO SIN CÓDIGOS' : (item.verificaciones > 0 ? 'LIQUIDADO' : 'SIN LIQUIDAR');
                    const convenio = Number(this.getConvenio(item)) || 0; // Convertir a número
                    const anticipos = Number(this.getAnticipo(item)) || 0; // Convertir a número
                    const liquidaciones = Number(this.getLiquidaciones(item)) || 0; // Convertir a número
                    const ventaNeta = Number(this.getVentaNeta(item)) || 0;

                    const ventaReal = Number(item.TotalVentaReal) || 0; // Accediendo directamente a TotalVentaReal

                    // Generar las fechas de verificación dinámicamente
                    const verificacionesFechas = [];
                    for (let i = 1; i <= maxVerif; i++) {
                        verificacionesFechas.push(this.getVerificacionFecha(item, i));
                    }

                    // Agregar los valores a la hoja de Excel
                    const convenioPagado = Number(item.totalConveniosPagados) || convenio;
                    const xPagar = item.convenio_global > 0 ? (Number(item.convenio_global) - convenioPagado) : 0;
                    wsData.push([
                        item.id_pedido,                                          // 1
                        item.contrato_generado,                                  // 2
                        item.nombreInstitucion,                                  // 3
                        item.vendedor,                                           // 4
                        ventaTotal.toFixed(2) * 1,                               // 5 Venta Bruta
                        estado,                                                  // 6 Estado
                        `${descuento} %`,                                        // 7 Descuento
                        comision.toFixed(2) * 1,                                 // 8 Comisión
                        ventaNeta.toFixed(2) * 1,                                // 9 Venta Neta
                        deuda.toFixed(2) * 1,                                    // 10 Deuda Anterior
                        item.convenio_global > 0 ? item.convenio_global : '',    // 11 Convenio Global
                        convenioPagado > 0 ? convenioPagado : '',                // 12 Convenio Pagado
                        item.convenio_global > 0 ? xPagar.toFixed(2) * 1 : '',  // 13 X Pagar
                        item.convenio_global > 0 ? item.convenio_anios : '',     // 14 Conv. Años
                        anticipos.toFixed(2) * 1,                                // 15 Anticipos
                        liquidaciones.toFixed(2) * 1,                            // 16 Liquidaciones
                        anticiposConvenio.toFixed(2) * 1,                        // 17 Pagos
                        saldoPendiente.toFixed(2) * 1,                           // 18 Saldo Pendiente
                        ...verificacionesFechas
                    ]);

                    // Sumar los totales
                    totalVentaTotal += ventaTotal;
                    totalVentaReal += ventaReal;
                    totalComision += comision;
                    totalAnticiposConvenio += anticiposConvenio;
                    totalSaldoPendiente += saldoPendiente;
                    totalDeuda += deuda;
                    totalConvenio += convenio;
                    totalConvenioGlobal += Number(item.convenio_global) || 0;
                    totalConvenioPagado += convenioPagado;
                    totalAnticipos += anticipos;
                    totalLiquidaciones += liquidaciones;
                    totalVentaNeta += ventaNeta;
                });
                // Agregar los totales al final de la hoja de liquidaciones
                // Columnas: #Pedido(1) Contrato(2) Institución(3) Vendedor(4) VentaBruta(5) Estado(6) Descuento(7) Comisión(8) VentaNeta(9) DeudaAnterior(10) ConvenioGlobal(11) ConvenioPagado(12) XPagar(13) ConvAnios(14) Anticipos(15) Liquidaciones(16) Pagos(17) SaldoPendiente(18)
                wsData.push([
                    '', '', '', 'Totales:',
                    totalVentaTotal.toFixed(2),         // 5  Venta Bruta
                    '', '',                             // 6,7 Estado, Descuento
                    totalComision.toFixed(2),           // 8  Comisión
                    totalVentaNeta.toFixed(2),          // 9  Venta Neta
                    totalDeuda.toFixed(2),              // 10 Deuda Anterior
                    totalConvenioGlobal.toFixed(2),     // 11 Convenio Global
                    totalConvenioPagado.toFixed(2),     // 12 Convenio Pagado
                    '',                                 // 13 X Pagar
                    '',                                 // 14 Conv. Años
                    totalAnticipos.toFixed(2),          // 15 Anticipos
                    totalLiquidaciones.toFixed(2),      // 16 Liquidaciones
                    totalAnticiposConvenio.toFixed(2),  // 17 Pagos
                    totalSaldoPendiente.toFixed(2)      // 18 Saldo Pendiente
                ]);

                // Crear la hoja de liquidaciones
                const ws = XLSX.utils.aoa_to_sheet(wsData);

                // Agregar la hoja de liquidaciones al libro de trabajo
                XLSX.utils.book_append_sheet(wb, ws, 'Liquidaciones');

                // Crear la hoja de liquidaciones por asesor
                const wsAsesoresData = [];
                wsAsesoresData.push(["Liquidaciones por Asesor"]); // Título de la nueva hoja
                wsAsesoresData.push([`Periodo: ${periodo}`]); // Información adicional del periodo
                wsAsesoresData.push([]); // Espacio vacío

                // Agregar el encabezado para la hoja de asesores
                wsAsesoresData.push([
                    'Asesor', 'Venta Total', 'Comisión Total', 'Deuda Anterior Total', 'Convenio Total', 'Anticipos Total',
                    'Total Liquidaciones', 'Pagos Total', 'Saldo Pendiente Total'
                ]);

                // Crear un objeto para almacenar las sumas por asesor
                const resumenAsesores = {};

                liquidaciones.forEach(item => {
                    const asesor = item.vendedor;
                    const ventaTotal = Number(this.getVenta(item)) || 0; // Convertir a número
                    const comision = Number(this.getDescuento(item)) || 0; // Comisión
                    const anticiposConvenio = Number(this.getAnticiposConvenio(item)) || 0; // Anticipos/Convenio
                    const deuda = Number(this.getDeudaAnterior(item)) || 0; // Deuda anterior
                    const convenio = Number(this.getConvenio(item)) || 0; // Convenio
                    const anticipo = Number(this.getAnticipo(item)) || 0; // Anticipo
                    const liquidaciones = Number(this.getLiquidaciones(item)) || 0; // Liquidaciones
                    const saldoPendiente = Number(this.getSaldoPendiente(item)) || 0; // Saldo Pendiente

                    // Inicializar el objeto del asesor si no existe
                    if (!resumenAsesores[asesor]) {
                        resumenAsesores[asesor] = {
                            ventaTotal: 0,
                            comisionTotal: 0,
                            anticiposConvenioTotal: 0,
                            deudaAnteriorTotal: 0,
                            convenioTotal: 0,
                            anticipoTotal: 0,
                            liquidacionesTotal: 0,
                            saldoPendienteTotal: 0,
                        };
                    }

                    // Sumar los valores (sin importar el estado de liquidación)
                    resumenAsesores[asesor].ventaTotal += ventaTotal;
                    resumenAsesores[asesor].comisionTotal += comision;
                    resumenAsesores[asesor].deudaAnteriorTotal += deuda;
                    resumenAsesores[asesor].convenioTotal += convenio;
                    resumenAsesores[asesor].anticipoTotal += anticipo;
                    resumenAsesores[asesor].liquidacionesTotal += liquidaciones;
                    resumenAsesores[asesor].anticiposConvenioTotal += anticiposConvenio;
                    resumenAsesores[asesor].saldoPendienteTotal += saldoPendiente;
                });

                // Agregar las filas por asesor (todo sumado en un solo total)
                Object.keys(resumenAsesores).forEach(asesorId => {
                    const asesor = resumenAsesores[asesorId];

                    wsAsesoresData.push([
                        asesorId,
                        asesor.ventaTotal.toFixed(2), // Venta total
                        asesor.comisionTotal.toFixed(2), // Comisión total (si no es 0)
                        asesor.deudaAnteriorTotal.toFixed(2), // Deuda anterior total (si no es 0)
                        asesor.convenioTotal.toFixed(2), // Anticipos/Convenio total (si no es 0)
                        asesor.anticipoTotal.toFixed(2), // Anticipos total (si no es 0)
                        asesor.liquidacionesTotal.toFixed(2), // Liquidaciones total (si no es 0)
                        asesor.anticiposConvenioTotal.toFixed(2), // Saldo pendiente total (si no es 0)
                        asesor.saldoPendienteTotal.toFixed(2), // Saldo pendiente total
                    ]);
                });

                // Crear la hoja del libro con los datos de los asesores
                const wsAsesores = XLSX.utils.aoa_to_sheet(wsAsesoresData);

                // Agregar la hoja de liquidaciones por asesor al libro de trabajo
                XLSX.utils.book_append_sheet(wb, wsAsesores, 'Liquidaciones por Asesor');

                // Exportar el archivo Excel
                XLSX.writeFile(wb, `Liquidaciones_${periodo}.xlsx`);
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al exportar liquidaciones:', error);
            }
        },
    }
}
</script>

<style scoped>
/* ── KPI Grid ── */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    margin-top: 16px;
}
.kpi-card {
    border-radius: 8px;
    padding: 14px 16px;
    border-left: 4px solid transparent;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.kpi-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 5px; }
.kpi-value { font-size: 17px; font-weight: 700; color: #1e293b; }

.kpi-blue   { border-color: #93c5fd; background: #eff6ff; } .kpi-blue .kpi-value   { color: #1d4ed8; }
.kpi-orange { border-color: #fdba74; background: #fff7ed; } .kpi-orange .kpi-value { color: #c2410c; }
.kpi-green  { border-color: #86efac; background: #f0fdf4; } .kpi-green .kpi-value  { color: #15803d; }
.kpi-purple { border-color: #c4b5fd; background: #f5f3ff; } .kpi-purple .kpi-value { color: #6d28d9; }
.kpi-teal   { border-color: #5eead4; background: #f0fdfa; } .kpi-teal .kpi-value   { color: #0f766e; }
.kpi-indigo { border-color: #a5b4fc; background: #eef2ff; } .kpi-indigo .kpi-value { color: #4338ca; }
.kpi-cyan   { border-color: #67e8f9; background: #ecfeff; } .kpi-cyan .kpi-value   { color: #0e7490; }
.kpi-yellow { border-color: #fde68a; background: #fffbeb; } .kpi-yellow .kpi-value { color: #b45309; }
.kpi-red    { border-color: #fca5a5; background: #fef2f2; } .kpi-red .kpi-value    { color: #b91c1c; }
.kpi-gray   { border-color: #cbd5e1; background: #f8fafc; } .kpi-gray .kpi-value   { color: #334155; }

/* ── Filtros ── */
.filtros-section {
    margin-top: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 14px 18px;
}
.filtros-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.filtros-title {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.filtros-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
}
.filtro-item { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.filtro-label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }

/* ── Botones ── */
.btn-limpiar {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.btn-limpiar:hover { color: #ef4444; border-color: #fca5a5; background: #fef2f2; }

.btn-formula {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #4338ca;
    background: #eef2ff;
    border: 1px solid #a5b4fc;
    border-radius: 6px;
    padding: 6px 14px;
    cursor: pointer;
    margin-left: 8px;
    transition: all 0.15s;
}
.btn-formula:hover { background: #e0e7ff; }

/* ── Modal Fórmula ── */
.formula-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.35);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
}
.formula-modal {
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 580px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    overflow: hidden;
}
.formula-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
}
.formula-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    font-size: 16px;
    padding: 2px 6px;
    border-radius: 4px;
}
.formula-close:hover { color: #ef4444; background: #fef2f2; }
.formula-modal-body { padding: 20px; }

.formula-actual {
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 8px;
    padding: 14px 16px;
    margin-bottom: 16px;
}
.formula-tag {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #15803d;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}
.formula-display {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 10px;
}
.f-var { color: #4338ca; background: #eef2ff; padding: 1px 6px; border-radius: 4px; font-size: 13px; }
.formula-desc { font-size: 12px; color: #475569; line-height: 1.7; }

.formula-divider {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #94a3b8;
    letter-spacing: 0.5px;
    margin: 16px 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.formula-divider::before, .formula-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
}

.formula-options { display: flex; flex-direction: column; gap: 8px; }
.formula-option {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
}
.formula-option:has(input:checked) { border-color: #a5b4fc; background: #eef2ff; }
.formula-option input { margin-top: 2px; accent-color: #4338ca; }
.formula-option-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.formula-option-expr { font-size: 11px; color: #64748b; margin-top: 2px; font-family: monospace; }

.formula-preview { margin-top: 14px; }
.formula-preview-title { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
.formula-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.formula-table th { background: #f8fafc; padding: 6px 10px; text-align: left; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
.formula-table td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; }
.text-red { color: #b91c1c; font-weight: 600; }
.text-green { color: #15803d; font-weight: 600; }

.estado-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 4px; }
.estado-liquidado   { background: #dcfce7; color: #15803d; }
.estado-sin-liquidar { background: #fef9c3; color: #854d0e; }
.estado-sin-codigos  { background: #fee2e2; color: #b91c1c; }

.pagos-detalle { 
  margin-top: 8px; 
  display: flex; 
  flex-direction: column; 
  gap: 5px; 
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}
.pagos-detalle-header {
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
}
.convenio-pagado-total {
  font-size: 14px;
  font-weight: 700;
  color: #0f766e;
}
.pago-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  gap: 10px; 
  font-size: 11px; 
  background: #f0fdf4; 
  border-left: 3px solid #10b981;
  border-radius: 4px; 
  padding: 4px 8px;
  transition: all 0.2s ease;
}
.pago-item:hover {
  background: #dcfce7;
  transform: translateX(2px);
}
.pago-contrato { 
  color: #0f766e; 
  font-weight: 600;
  flex: 1;
}
.pago-valor { 
  color: #15803d; 
  font-weight: 700; 
  white-space: nowrap;
  font-size: 12px;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
    .filtros-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .filtros-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .filtros-grid { grid-template-columns: 1fr; }
}
</style>
