<template>
<div>
    <!-- Vista normal (todos excepto grupo 26) -->
    <vx-card class="mt-5" v-if="usuario.id_group != 26">
        <vs-tabs>
            <vs-tab label="Exports Cobranza" v-if="userRoot || groupFacturador">
                <vs-divider class="mt-4">Reportes Ventas y Cobranza</vs-divider>
                <div class="flex flex-wrap mt-3 mb-2" style="gap: 12px; justify-content: center;">
                    <vs-button color="warning" type="filled" icon-pack="feather" icon="icon-file" @click="abonoExcel('L')">
                        EXPORTAR EXCEL V.LISTA
                    </vs-button>
                    <vs-button color="warning" type="filled" icon-pack="feather" icon="icon-file" @click="abonoExcel('V')">
                        EXPORTAR EXCEL V.DIRECTA
                    </vs-button>
                    <vs-button color="danger" type="filled" icon-pack="feather" icon="icon-layers" @click="abonoExcel('All')">
                        EXPORTAR EXCEL GENERAL
                    </vs-button>
                    <!-- <vs-button color="danger" type="filled" icon-pack="feather" icon="icon-list" @click="exportarExcelDetallado" v-if="userRoot">
                        EXPORTAR EXCEL GENERAL DETALLADO
                    </vs-button> -->
                </div>

                <vs-divider class="mt-4">Reportes Variaciones Venta y Abono</vs-divider>
                <div class="flex flex-wrap mt-3 mb-2" style="gap: 12px; justify-content: center;">
                    <vs-button color="success" type="filled" icon-pack="feather" icon="icon-activity" @click="mostrarReporteVariaciones()">
                        Reporte Variaciones Ventas
                    </vs-button>
                    <vs-button color="success" type="filled" icon-pack="feather" icon="icon-alert-circle" @click="mostrarClientesAbonoNoDocumentos()">
                        Abonos sin Documentos
                    </vs-button>
                </div>

                <vs-divider class="mt-4">Reportes Cheques</vs-divider>
                <div class="flex flex-wrap mt-3 mb-3" style="gap: 12px; justify-content: center;">
                    <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-calendar" @click="exportarChequesXPeriodo()">
                        EXPORTAR CHEQUES PERÍODO
                    </vs-button>
                    <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-archive" @click="exportarChequesTodos()">
                        EXPORTAR TODOS LOS CHEQUES
                    </vs-button>
                </div>
            </vs-tab>

            <vs-tab label="Seguimiento General" v-if="userRoot">
                <seguimientoCuentasGeneral :predioSeleccionado="predioSeleccionado" />
            </vs-tab>

            <vs-tab label="Reporte General" v-if="userRoot || groupFacturador" @click="handleTabChange(0)">
                <vs-tabs>
                    <vs-tab label="Prolipa" @click="handleTabChange(0)">
                        <div v-if="cargarProlipa">
                            <reportGeneral :predioSeleccionado="predioSeleccionado" :iluminar="false" :periodoCodigoContrato="periodoCodigoContrato" />
                        </div>
                    </vs-tab>
                    <vs-tab label="Iluminar" @click="handleTabChange(1)">
                        <div v-if="cargarIluminar">
                            <reportGeneral :predioSeleccionado="predioSeleccionado" :iluminar="true" :periodoCodigoContrato="periodoCodigoContrato" />
                        </div>
                    </vs-tab>
                </vs-tabs>
            </vs-tab>
        </vs-tabs>
    </vx-card>

    <!-- Vista para grupo 26 (acceso reducido) -->
    <vx-card class="mt-5" v-else>
        <vs-divider class="mt-2">Reportes Ventas y Cobranza</vs-divider>
        <div class="flex flex-wrap mt-3 mb-2" style="gap: 12px; justify-content: center;">
            <vs-button color="warning" type="filled" icon-pack="feather" icon="icon-file" @click="abonoExcel('L')">
                EXPORTAR EXCEL V.LISTA
            </vs-button>
            <vs-button color="warning" type="filled" icon-pack="feather" icon="icon-file" @click="abonoExcel('V')">
                EXPORTAR EXCEL V.DIRECTA
            </vs-button>
            <vs-button color="danger" type="filled" icon-pack="feather" icon="icon-layers" @click="abonoExcel('All')">
                EXPORTAR EXCEL GENERAL
            </vs-button>
            <vs-button color="danger" type="filled" icon-pack="feather" icon="icon-list" @click="exportarExcelDetallado">
                EXPORTAR EXCEL GENERAL DETALLADO
            </vs-button>
        </div>

        <vs-divider class="mt-4">Reportes Variaciones Venta y Abono</vs-divider>
        <div class="flex flex-wrap mt-3 mb-2" style="gap: 12px; justify-content: center;">
            <vs-button color="success" type="filled" icon-pack="feather" icon="icon-activity" @click="mostrarReporteVariaciones()">
                Reporte Variaciones Ventas
            </vs-button>
            <vs-button color="success" type="filled" icon-pack="feather" icon="icon-alert-circle" @click="mostrarClientesAbonoNoDocumentos()">
                Abonos sin Documentos
            </vs-button>
        </div>

        <vs-divider class="mt-4">Reportes Cheques</vs-divider>
        <div class="flex flex-wrap mt-3 mb-3" style="gap: 12px; justify-content: center;">
            <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-calendar" @click="exportarChequesXPeriodo()">
                EXPORTAR CHEQUES PERÍODO
            </vs-button>
            <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-archive" @click="exportarChequesTodos()">
                EXPORTAR TODOS LOS CHEQUES
            </vs-button>
        </div>
    </vx-card>

    <!-- Popup Reporte Progresivo General -->
    <reporteProgresivoPopup
        :active.sync="mostrarPopupProgresivo"
        :periodoSelect="periodoSelect"
    />
</div>
</template>

<script>
import * as XLSX from 'xlsx';
import vSelect from "vue-select";
import seguimientoCuentasGeneral from "@/views/pedidos2/pedidos/cobranzas/seguimientoCuentasGeneral.vue"
import reportGeneral from "@/views/pedidos2/pedidos/cobranzas/reportGeneral.vue"
import reporteProgresivoPopup from "@/views/pedidos2/pedidos/cobranzas/reporteProgresivoPopup.vue"

import {
    mapState
} from "vuex";

export default {
    components: {
        "v-select": vSelect,
        seguimientoCuentasGeneral,
        reportGeneral,
        reporteProgresivoPopup,
    },
    data() {
        return {
            predioSeleccionado: 0,
            arregloAbonoVentas: [],
            arregloVariacionVentas: [],
            arregloAbonoNoDocumentos: [],
            ventasData: [],
            cargarIluminar: false,
            cargarProlipa: false,
            periodoCodigoContrato: null,
            mostrarPopupProgresivo: false,
        };
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador', 'empresaPlataforma']),
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted() {
        let me = this;
        me.predioSeleccionado = parseInt(me.periodoSelect.idperiodoescolar);
        me.periodoCodigoContrato = me.periodoSelect.codigo_contrato;
    },
    methods: {
        handleTabChange(index) {
            if (index === 0) {
                setTimeout(() => { this.cargarProlipa = true; }, 500);
            } else if (index === 1) {
                setTimeout(() => { this.cargarIluminar = true; }, 500);
            }
        },

        async obtenerDatos() {
            try {
                const response = await this.$http.get(`${this.$server_url}obtenerVentas?periodo=${this.periodoSelect.idperiodoescolar}`);
                this.ventasData = response.data;
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        },

        async exportarExcelDetallado() {
            if (this.ventasData.length === 0) {
                await this.obtenerDatos();
            }
            if (this.ventasData.length === 0) {
                this.$vs.notify({ text: 'No hay datos para exportar.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle' });
                return;
            }
            const ws = XLSX.utils.json_to_sheet(this.ventasData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
            XLSX.writeFile(wb, 'ventas.xlsx');
        },

        mostrarClientesAbonoNoDocumentos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'clientesAbonoNoDocumentos?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    me.arregloAbonoNoDocumentos = res.data;
                    me.exportarAbonoExcel(me.arregloAbonoNoDocumentos);
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener datos:', error);
                    me.$vs.loading.close();
                });
        },

        exportarAbonoExcel(datos) {
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(datos), 'Clientes Abono Sin Documentos');
            XLSX.writeFile(workbook, 'clientes_abono_sin_documentos.xlsx');
        },

        mostrarReporteVariaciones() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'reporteVariacionVentas?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    const institucionCliente = {};
                    datos.forEach(item => {
                        item.variaciones = [];
                        const key = `${item.ruc_cliente}-${item.institucion_id}`;
                        if (institucionCliente[item.ruc_cliente]) {
                            if (!institucionCliente[item.ruc_cliente].includes(item.institucion_id)) {
                                item.variaciones.push(`Diferente Institución, mismo cliente: ${item.ruc_cliente}.`);
                            }
                        } else {
                            institucionCliente[item.ruc_cliente] = [item.institucion_id];
                        }
                        const institucionKey = item.institucion_id;
                        if (!institucionCliente[institucionKey]) {
                            institucionCliente[institucionKey] = [item.ruc_cliente];
                        } else {
                            if (!institucionCliente[institucionKey].includes(item.ruc_cliente)) {
                                item.variaciones.push(`Diferente Cliente, misma institución: ${item.nombre}.`);
                            }
                        }
                        if (institucionCliente[key]) {
                            if (institucionCliente[key].ven_tipo_inst !== item.ven_tipo_inst) {
                                item.variaciones.push(`Diferente tipo de venta para cliente: ${item.ruc_cliente}, institución: ${item.nombre}.`);
                            }
                        } else {
                            institucionCliente[key] = { ven_tipo_inst: item.ven_tipo_inst };
                        }
                    });
                    me.arregloVariacionVentas = datos;
                    me.exportarAExcel(me.arregloVariacionVentas);
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener datos:', error);
                    me.$vs.loading.close();
                });
        },

        exportarAExcel(datos) {
            const datosExportar = datos.map(item => ({ ...item, variaciones: item.variaciones.join('; ') }));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(datosExportar), 'Reporte Variaciones');
            XLSX.writeFile(workbook, 'reporte_variaciones.xlsx');
        },

        abonoExcel(tipo) {
            // Para General usar el popup progresivo (igual que cobranzas.vue)
            if (tipo === 'All') {
                this.mostrarPopupProgresivo = true;
                return;
            }
            this.reporteAbonoVentas(tipo);
        },

        reporteAbonoVentas(tipo) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'reporteAbonoVentasXD?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    if (tipo === 'L') {
                        me.arregloAbonoVentas = datos.filter(d => d.punto_venta == '1');
                    }
                    if (tipo === 'V') {
                        me.arregloAbonoVentas = datos.filter(d => d.punto_venta == '0');
                    }
                    setTimeout(() => { me.downloadReport(tipo); }, 300);
                    me.$vs.loading.close();
                })
                .catch(() => {
                    me.$vs.loading.close();
                });
        },

        async downloadReport(tipo) {
            let me = this;
            const titulos = {
                'L': 'Reporte Ventas, Abonos, Saldos - Librerias',
                'V': 'Reporte Ventas, Abonos, Saldos - Establecimientos',
                'All': 'Reporte Ventas, Abonos, Saldos - General',
            };
            const reportTitle = titulos[tipo];
            const fechaFormateada = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            const wsData = this.prepareData(reportTitle, fechaFormateada, tipo, me.periodoSelect.descripcion);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            const maxCol = tipo === 'All' ? 9 : 10;
            ws['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: maxCol } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: maxCol } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: maxCol } },
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

            // Si es reporte general (All), agregar segunda hoja con detalles de abonos
            if (tipo === 'All') {
                me.$vs.loading();
                try {
                    const abonos = await me.obtenerAbonosParaReporte();
                    if (abonos && abonos.length > 0) {
                        const wsAbonosData = me.prepareAbonosData(abonos);
                        const wsAbonos = XLSX.utils.aoa_to_sheet(wsAbonosData);
                        
                        // Combinar celdas para el título de la hoja de abonos
                        wsAbonos['!merges'] = [
                            { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } } // Título en primera fila
                        ];
                        
                        XLSX.utils.book_append_sheet(wb, wsAbonos, 'Detalles Abonos');
                    }
                } catch (error) {
                    console.error('Error al obtener abonos:', error);
                } finally {
                    me.$vs.loading.close();
                }
            }

            XLSX.writeFile(wb, `${reportTitle}.xlsx`);
        },

        // Método para obtener abonos desde el backend
        async obtenerAbonosParaReporte() {
            let me = this;
            try {
                const response = await me.$http.get(me.$server_url + 'obtenerAbonosCuentas', {
                    params: {
                        fecha_inicio: null,
                        fecha_final: null,
                        cuenta: 'todas',
                        busqueda: 'Todo',
                        temporada: me.periodoSelect.idperiodoescolar
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
        },

        prepareData(reportTitle, fecha, tipo, temporada) {
            const wsData = [];
            let totalSaldos = 0, totalDevolucion = 0, totalAbono = 0, totalven_valor = 0;
            let totalsubtotal = 0, totalRetencion = 0, totalLiquidaciones = 0, totalCruces = 0;
            let totalNotasCredito = 0, totalDevolucionBruta = 0, totalFacturaOperativa = 0;

            wsData.push([reportTitle]);
            wsData.push(['TEMPORADA ' + temporada]);
            wsData.push([fecha]);
            wsData.push([]);

            if (tipo === 'L') {
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'LIBRERIA', 'CLIENTE', 'ASESOR', 'COMPRAS', 'PAGOS', 'DEVOLUCIONES', 'RETENCIONES', 'OTROS', 'SALDO', 'PERIODO', 'SERIE']);
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = parseFloat(item.valor_total) || 0;
                    const abono_total = parseFloat(item.abono_total) || 0;
                    const retencion_total = parseFloat(item.retencion_total) || 0;
                    const devolucion = parseFloat(item.devolucion) || 0;
                    const subtotal = parseFloat(item.subtotal_total) || 0;
                    const saldo = item.tdo_nombre === 'DEVOLUCION SIN EMPRESA' ? devolucion * -1
                        : ['ABONO SIN VENTAS', 'ABONO SIN PRE-FACTURAS', 'ABONO SIN NOTAS'].includes(item.tdo_nombre) ? abono_total * -1
                        : parseFloat((ven_valor - abono_total - devolucion - retencion_total).toFixed(2));

                    wsData.push([
                        item.empresa, item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion, item.cliente_facturado, item.asesor,
                        ven_valor.toFixed(2) * 1, abono_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1, retencion_total.toFixed(2) * 1,
                        0, saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? (this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre) : 'N/A'
                    ]);
                    totalven_valor += ven_valor; totalAbono += abono_total;
                    totalRetencion += retencion_total; totalDevolucion += devolucion; totalSaldos += saldo;
                });
                wsData.push(['', '', '', '', 'TOTAL:', totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, 0, totalSaldos.toFixed(2) * 1]);
                wsData.push(['']);
                return wsData;
            }

            if (tipo === 'V') {
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'INSTITUCION', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS', 'RETENCIÓN', 'DEVOLUCIÓN', 'SALDO', 'PERIODO', 'SERIE']);
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = parseFloat(item.valor_total) || 0;
                    const abono_total = parseFloat(item.abono_total) || 0;
                    const retencion_total = parseFloat(item.retencion_total) || 0;
                    const subtotal = parseFloat(item.subtotal_total) || 0;
                    const devolucion = parseFloat(item.devolucion) || 0;
                    const saldo = item.tdo_nombre === 'DEVOLUCION SIN EMPRESA' ? devolucion * -1
                        : ['ABONO SIN VENTAS', 'ABONO SIN PRE-FACTURAS', 'ABONO SIN NOTAS'].includes(item.tdo_nombre) ? abono_total * -1
                        : parseFloat((ven_valor - abono_total - devolucion - retencion_total).toFixed(2));

                    wsData.push([
                        item.empresa, item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion, item.cliente_facturado, item.asesor,
                        subtotal.toFixed(2) * 1, ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1, retencion_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1, saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? (this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre) : 'N/A'
                    ]);
                    totalsubtotal += subtotal; totalven_valor += ven_valor; totalAbono += abono_total;
                    totalDevolucion += devolucion; totalSaldos += saldo; totalRetencion += retencion_total;
                });
                wsData.push(['', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);
                wsData.push(['']);
                return wsData;
            }

            if (tipo === 'All') {
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'P.VENTA/INST', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS', 'DEV. BRUTA', 'DEVOLUCIONES', 'LIQUIDACIONES', 'RETENCIONES', 'CRUCES', 'NOTA DE CREDITO', 'FACT.OPERATIVA', 'SALDO', 'PERIODO', 'SERIE']);
                this.arregloAbonoVentas.forEach(item => {
                    const esNotaCredito = item.tdo_nombre === 'NOTA DE CREDITO';
                    const ven_valor = esNotaCredito ? 0 : (parseFloat(item.valor_total) || 0);
                    const subtotal = esNotaCredito ? 0 : (parseFloat(item.subtotal_total) || 0);
                    const abono_total = parseFloat(item.abono_total) || 0;
                    const devolucion = parseFloat(item.devolucion) || 0;
                    const devolucion_bruta = parseFloat(item.devolucion_bruta) || 0;
                    const retencion_total = parseFloat(item.retencion_total) || 0;
                    const liquidaciones = parseFloat(item.abono_liquidacion) || 0;
                    const cruces = parseFloat(item.abono_cruce) || 0;
                    const notasCredito = esNotaCredito ? (parseFloat(item.valor_total) || 0) : 0;
                    const factura_operativa = parseFloat(item.factura_operativa) || 0;

                    // Fórmula idéntica a cobranzas.vue
                    const saldo = item.tdo_nombre === 'DEVOLUCION SIN EMPRESA' ? devolucion * -1
                        : ['ABONO SIN VENTAS', 'ABONO SIN PRE-FACTURAS', 'ABONO SIN NOTAS'].includes(item.tdo_nombre) ? abono_total * -1
                        : parseFloat((factura_operativa - (ven_valor - (abono_total + devolucion + retencion_total + cruces + notasCredito))).toFixed(2));

                    wsData.push([
                        item.empresa, item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion, item.cliente_facturado, item.asesor,
                        subtotal.toFixed(2) * 1, ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1, devolucion_bruta.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1, liquidaciones.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1, cruces.toFixed(2) * 1,
                        notasCredito.toFixed(2) * 1, factura_operativa.toFixed(2) * 1,
                        saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? (this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre) : 'N/A'
                    ]);

                    totalsubtotal += subtotal; totalven_valor += ven_valor; totalAbono += abono_total;
                    totalDevolucion += devolucion; totalDevolucionBruta += devolucion_bruta;
                    totalSaldos += saldo; totalRetencion += retencion_total;
                    totalLiquidaciones += liquidaciones; totalCruces += cruces;
                    totalNotasCredito += notasCredito; totalFacturaOperativa += factura_operativa;
                });
                wsData.push(['', '', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucionBruta.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalLiquidaciones.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalCruces.toFixed(2) * 1, totalNotasCredito.toFixed(2) * 1, totalFacturaOperativa.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);
                wsData.push(['']);
                return wsData;
            }
        },

        exportarChequesXPeriodo() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerCheques?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    if (datos.length === 0) {
                        me.$vs.notify({ text: 'No hay cheques para este período', color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle' });
                        me.$vs.loading.close();
                        return;
                    }
                    me.exportarChequesExcel(datos, 'Cheques - ' + me.periodoSelect.descripcion);
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener cheques:', error);
                    me.$vs.notify({ text: 'Error al obtener los cheques', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
                    me.$vs.loading.close();
                });
        },

        exportarChequesTodos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerCheques')
                .then(res => {
                    let datos = res.data;
                    if (datos.length === 0) {
                        me.$vs.notify({ text: 'No hay cheques registrados', color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle' });
                        me.$vs.loading.close();
                        return;
                    }
                    me.exportarChequesExcel(datos, 'Cheques - Todos');
                    me.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener cheques:', error);
                    me.$vs.notify({ text: 'Error al obtener los cheques', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
                    me.$vs.loading.close();
                });
        },

        exportarChequesExcel(datos, nombreArchivo) {
            const datosFormato = datos.map(item => ({
                'Nombre Cliente': item.nombre_cliente,
                'RUC/CI': item.ruc_ci,
                'Período': item.periodo || 'N/A',
                'Empresa': item.empresa || 'N/A',
                'Banco': item.banco,
                'Tipo Cheque': item.tipo_cheque,
                'Fecha Cobro': item.fecha_cobro,
                'Valor': item.valor,
                'Tiene Abono': item.tiene_abono,
                'Número Cheque': item.chq_numero,
                'Fecha Creación': item.fecha_creacion
            }));
            const sumaTotal = datos.reduce((s, i) => s + (parseFloat(i.valor) || 0), 0);
            datosFormato.push({ 'Nombre Cliente': 'TOTAL', 'Valor': sumaTotal.toFixed(2) * 1 });
            const worksheet = XLSX.utils.json_to_sheet(datosFormato);
            worksheet['!cols'] = [
                { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
                { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
                { wch: 12 }, { wch: 15 }, { wch: 20 }
            ];
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Cheques');
            XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
        },
    }
}
</script>
