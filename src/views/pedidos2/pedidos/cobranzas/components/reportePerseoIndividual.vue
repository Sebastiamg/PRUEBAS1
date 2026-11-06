<template>
<div>
    <div v-if="datosFormatoPlataforma.length > 0 || datosFormatoPerseo.length > 0">
        <!-- SECCIÓN A IMPRIMIR -->
        <vs-tabs>
            <vs-tab label="Reportes Individuales">
                <div align="center" class="mb-4 mt-4">
                    <vs-button @click="imprimirPDF" type="relief" color="danger">Imprimir PDF</vs-button>
                    <vs-button @click="generateExcel" color="success" class="mx-5">Descargar Excel</vs-button>
                </div>
        <div id="seccionImprimir2">
            <!-- TABLA 1: CARTERA DE LA PLATAFORMA -->
            <table style="width: 100%;border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                    <td colspan="10" style="text-align: center;"><b>REPORTE DE CARTERA POR COBRAR - PLATAFORMA</b></td>
                    <td colspan="1" rowspan="4">
                        <img v-if="datosEmpresa.id ==3" style="float: right;" src='https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png' width="110">
                        <img v-if="datosEmpresa.id ==1" style="float: right;" src='https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png' width="150">
                    </td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: center;"><b>TEMPORADA: {{ periodoSelect.periodoescolar }}</b></td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: center; font-size: 12px; color: #666;">Datos del sistema de facturación</td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10"></td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: left;">
                        <b>CLIENTE: {{ nombreCliente }}</b>
                    </td>
                    <td colspan="1"></td>
                </tr>

                <tr style="text-align: left;">
                    <td style="border: 1px solid black;"><b>TIPO</b></td>
                    <td style="border: 1px solid black;"><b>SECUENCIAL</b></td>
                    <td style="border: 1px solid black;"><b>EMISION</b></td>
                    <td style="border: 1px solid black;"><b>VENCE</b></td>
                    <td style="border: 1px solid black;"><b>DIAS VEN</b></td>
                    <td style="border: 1px solid black;"><b>OBSERVACION</b></td>
                    <td style="border: 1px solid black;"><b>VALOR CXC</b></td>
                    <td style="border: 1px solid black;"><b>ABONO</b></td>
                    <td style="border: 1px solid black;"><b>SALDO</b></td>
                </tr>

                <tr v-for="(item, index) in datosFormatoPlataforma" :key="'plat-'+index" style="text-align: right;">
                    <td style="border: 1px solid black;">{{ item.tipo }}</td>
                    <td style="border: 1px solid black;">{{ item.secuencial }}</td>
                    <td style="border: 1px solid black;">{{ item.emision }}</td>
                    <td style="border: 1px solid black;">{{ item.vence }}</td>
                    <td style="border: 1px solid black;">{{ item.diasVen }}</td>
                    <td style="border: 1px solid black;">{{ item.observacion }}</td>
                    <td style="border: 1px solid black;">{{ item.valorCXC }}</td>
                    <td style="border: 1px solid black;">{{ item.abono > 0 ? item.abono : '0.00' }}</td>
                    <td style="border: 1px solid black;">{{ item.saldo }}</td>
                </tr>

                <tr style="text-align: right;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="border: 1px solid black;"><b>TOTAL</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosFormatoPlataforma.reduce((sum, item) => sum + parseFloat(item.valorCXC || 0), 0).toFixed(2) }}</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosFormatoPlataforma.reduce((sum, item) => sum + parseFloat(item.abono || 0), 0).toFixed(2) }}</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosFormatoPlataforma.reduce((sum, item) => sum + parseFloat(item.saldo || 0), 0).toFixed(2) }}</b></td>
                </tr>
            </table>

            <!-- TABLA 2: CARTERA DE PERSEO -->
            <table style="width: 100%;border-collapse: collapse;">
                <tr>
                    <td colspan="10" style="text-align: center;"><b>REPORTE DE CARTERA POR COBRAR - PERSEO</b></td>
                    <td colspan="1" rowspan="3">
                        <img v-if="datosEmpresa.id ==3" style="float: right;" src='https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png' width="110">
                        <img v-if="datosEmpresa.id ==1" style="float: right;" src='https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png' width="150">
                    </td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: center; font-size: 12px; color: #666;">Datos del sistema Perseo</td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10"></td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: left;">
                        <b>CLIENTE: {{ nombreCliente }}</b>
                    </td>
                    <td colspan="1"></td>
                </tr>

                <tr style="text-align: left;">
                    <td style="border: 1px solid black;"><b>TIPO</b></td>
                    <td style="border: 1px solid black;"><b>SECUENCIAL</b></td>
                    <td style="border: 1px solid black;"><b>EMISION</b></td>
                    <td style="border: 1px solid black;"><b>VENCE</b></td>
                    <td style="border: 1px solid black;"><b>OBSERVACION</b></td>
                    <td style="border: 1px solid black;"><b>SALDO</b></td>
                </tr>

                <tr v-for="(item, index) in datosFormatoPerseo" :key="'perseo-'+index" style="text-align: right;">
                    <td style="border: 1px solid black;">{{ item.tipo }}</td>
                    <td style="border: 1px solid black;">{{ item.secuencial }}</td>
                    <td style="border: 1px solid black;">{{ item.emision }}</td>
                    <td style="border: 1px solid black;">{{ item.vence }}</td>
                    <td style="border: 1px solid black;">{{ item.observacion }}</td>
                    <td style="border: 1px solid black;">{{ item.saldo }}</td>
                </tr>

                <tr style="text-align: right;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="border: 1px solid black;"><b>TOTAL</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosFormatoPerseo.reduce((sum, item) => sum + parseFloat(item.saldo || 0), 0).toFixed(2) }}</b></td>
                </tr>
            </table>
        </div>
        </vs-tab>
        <vs-tab label="Comparación Total">
            <div align="center" class="mb-4 mt-4">
                <vs-button @click="generateExcelComparacion" color="success" class="mx-5">Descargar Excel Comparación</vs-button>
            </div>
            <div style="overflow-x: auto; margin-top: 15px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">
                    <tr>
                        <th colspan="4" style="border: 1px solid black; background-color: #f3e5f5; padding: 5px;">PLATAFORMA</th>
                        <th colspan="2" style="border: 1px solid black; background-color: #e3f2fd; padding: 5px;">PERSEO</th>
                    </tr>
                    <tr>
                        <!-- Plataforma -->
                        <td style="border: 1px solid black; background-color: #f3e5f5; padding: 5px;"><b>TIPO</b></td>
                        <td style="border: 1px solid black; background-color: #f3e5f5; padding: 5px;"><b>CÓDIGO VENTA</b></td>
                        <td style="border: 1px solid black; background-color: #f3e5f5; padding: 5px;"><b>FACT. PERSEO</b></td>
                        <td style="border: 1px solid black; background-color: #f3e5f5; padding: 5px;"><b>VALOR</b></td>
                        
                        <!-- Perseo -->
                        <td style="border: 1px solid black; background-color: #e3f2fd; padding: 5px;"><b>SECUENCIAL</b></td>
                        <td style="border: 1px solid black; background-color: #e3f2fd; padding: 5px;"><b>SALDO</b></td>
                    </tr>
                    <tr v-for="(item, index) in datosComparacionTotal" :key="'comp-'+index">
                        <!-- Plataforma -->
                        <td style="border: 1px solid black; padding: 4px;">{{ item.plat_tipo }}</td>
                        <td style="border: 1px solid black; padding: 4px;">{{ item.plat_codigo }}</td>
                        <td style="border: 1px solid black; padding: 4px;">{{ item.plat_factura_perseo }}</td>
                        <td style="border: 1px solid black; padding: 4px; text-align: right;">{{ item.plat_valor ? '$' + item.plat_valor : '' }}</td>
                        
                        <!-- Perseo -->
                        <td style="border: 1px solid black; padding: 4px;">{{ item.pers_secuencia }}</td>
                        <td style="border: 1px solid black; padding: 4px; text-align: right;">{{ item.pers_saldo ? '$' + item.pers_saldo : '' }}</td>
                    </tr>
                    <tr style="text-align: right; background-color: #f1f1f1;">
                        <td colspan="3" style="border: 1px solid black; padding: 4px;"><b>TOTAL</b></td>
                        <td style="border: 1px solid black; padding: 4px;"><b>{{ datosComparacionTotal.reduce((sum, item) => sum + parseFloat(item.plat_valor || 0), 0).toFixed(2) }}</b></td>
                        <td style="border: 1px solid black; padding: 4px;"><b>TOTAL PERSEO</b></td>
                        <td style="border: 1px solid black; padding: 4px;"><b>{{ datosComparacionTotal.reduce((sum, item) => sum + parseFloat(item.pers_saldo || 0), 0).toFixed(2) }}</b></td>
                    </tr>
                </table>
            </div>
        </vs-tab>
        </vs-tabs>
        <!-- FIN SECCIÓN A IMPRIMIR -->
    </div>
    <div v-else class="text-center py-4">
        <vs-loading></vs-loading>
        <p>Cargando datos...</p>
    </div>
</div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import imprimirMixin from "@/mixins/Pedidosmix";
import * as XLSX from 'xlsx';

export default {
    mixins: [imprimirMixin],
    components: {
        VueHtml2pdf,
        imprimirMixin
    },
    name: 'reportePerseoIndividual',
    props: {
        datosCliente: {
            type: Array,
            default: function () {
                return []
            }
        },
        clientesidPerseo: {
            type: [String, Number],
            default: null
        },
        empresaCobranza: {
            type: Object,
            default: function () {
                return {}
            }
        },
        datosFacturasNotas: {
            type: Array,
            default: () => []
        },
        datosAbonos: {
            type: Array,
            default: () => []
        },
        periodoPuntosOInstitucion: {
            type: Number,
            default: 0
        },
        periodoSelect: {
            type: Object,
            default: () => ({})
        },
        devoluciones_all: {
            type: Array,
            default: () => []
        },
        tiposDocumento: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            cargando: false,
            datosEstadoCuenta: [],
            // datosCobros: [], // comentado — el saldo viene directo del API de Perseo
            nombreCliente: '',
            datosEmpresa: {}
        }
    },
    mounted() {
        let me = this;
        if (me.datosCliente && me.datosCliente.length > 0) {
            me.nombreCliente = me.datosCliente[0].razonsocial || '';
        }
        
        me.datosEmpresa = me.empresaCobranza;
        
        if (me.clientesidPerseo) {
            me.cargarDatosPerseo();
        }
    },
    computed: {
        datosFormatoPlataforma() {
            // Transformar datos de la plataforma (igual a reporteIndividualCobranzaNuevo)
            const calcularDiasVencimiento = (fecha) => {
                if (!fecha) return 0;
                const fechaVenta = new Date(fecha);
                const fechaActual = new Date();
                const diferencia = fechaActual - fechaVenta;
                const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                return dias >= 0 ? dias : 0;
            };

            return this.datosFacturasNotas.map(venta => {
                const abono = this.datosAbonos.find(a => 
                    (a.abono_notas && a.abono_documento === venta.ven_codigo) ||
                    (a.abono_facturas && a.abono_documento === venta.ven_codigo)
                ) || {};

                const valorAbono = parseFloat(abono.abono_notas > 0 ? abono.abono_notas : 
                                             abono.abono_facturas > 0 ? abono.abono_facturas : 0) || 0;
                const valorCXC = parseFloat(venta.ven_valor) || 0;
                const saldo = (valorCXC - valorAbono).toFixed(2);

                return {
                    tipo: this.tiposDocumento[venta.idtipodoc] || '',
                    secuencial: venta.ven_codigo || '',
                    emision: venta.ven_fecha || '',
                    vence: venta.ven_fecha || '',
                    diasVen: calcularDiasVencimiento(venta.ven_fecha),
                    observacion: venta.ven_observacion || '',
                    valorCXC: valorCXC.toFixed(2),
                    abono: valorAbono.toFixed(2),
                    saldo: saldo,
                };
            });
        },
        datosFormatoPerseo() {
            // Usar saldo directo del API — se muestra tal como llega (puede ser negativo)
            return this.datosEstadoCuenta.map(documento => {
                const saldo = parseFloat(documento.saldo || 0);

                return {
                    tipo: documento.tipo || '',
                    secuencial: documento.secuencia || '',
                    emision: documento.emision || '',
                    vence: documento.vence || '',
                    observacion: documento.observacion || '',
                    saldo: saldo.toFixed(2)
                };
            });
        },
        datosComparacionTotal() {
            let me = this;
            let resultados = [];
            let cxcProcesados = new Set();
            
            const getSecuencia = (factura_perseo) => {
                if (!factura_perseo) return '';
                let parts = factura_perseo.split('-');
                return parts[parts.length - 1];
            };

            // Loop Plataforma
            me.datosFacturasNotas.forEach(factura => {
                let secuenciaPlat = getSecuencia(factura.factura_perseo);
                let cxcMatch = null;
                
                if (secuenciaPlat) {
                    cxcMatch = me.datosEstadoCuenta.find(c => c.secuencia === secuenciaPlat);
                }
                
                let tipoPlat = 'PF';
                if (factura.idtipodoc === 3) tipoPlat = 'BC';
                if (factura.idtipodoc === 4) tipoPlat = 'AI';
                if (factura.idtipodoc === 20) tipoPlat = 'FO';
                if (factura.idtipodoc === 1) tipoPlat = 'PF';
                
                let row = {
                    plat_tipo: tipoPlat,
                    plat_codigo: factura.ven_codigo || '',
                    plat_factura_perseo: factura.factura_perseo || '',
                    plat_valor: (parseFloat(factura.ven_valor) || 0).toFixed(2),
                    pers_secuencia: '',
                    pers_saldo: ''
                };
                
                if (cxcMatch) {
                    cxcProcesados.add(cxcMatch.secuencia);
                    row.pers_secuencia = cxcMatch.secuencia || '';
                    // Usar saldo directo del API
                    row.pers_saldo = parseFloat(cxcMatch.saldo || 0).toFixed(2);
                }
                
                resultados.push(row);
            });
            
            // Loop Perseo restantes (sin match en plataforma)
            me.datosEstadoCuenta.forEach(cxc => {
                if (!cxcProcesados.has(cxc.secuencia)) {
                    resultados.push({
                        plat_tipo: '',
                        plat_codigo: '',
                        plat_factura_perseo: '',
                        plat_valor: '',
                        pers_secuencia: cxc.secuencia || '',
                        pers_saldo: parseFloat(cxc.saldo || 0).toFixed(2)
                    });
                }
            });
            
            return resultados;
        }
    },
    methods: {
        cargarDatosPerseo() {
            let me = this;
            me.cargando = true;

            const empresaId = me.empresaCobranza && me.empresaCobranza.id ? me.empresaCobranza.id : 1;

            // Cargar estado de cuenta — el saldo ya viene calculado desde Perseo
            this.$http.get(`${this.$server_url}api/consulta_cliente_estadocuenta?clientesid=${me.clientesidPerseo}&empresa=${empresaId}`)
                .then((res) => {
                    me.datosEstadoCuenta = res.data.cxc || [];
                    me.cargando = false;

                    // Cobros comentados — ya no se necesitan, el saldo viene directo del API
                    // return me.$http.get(`${me.$server_url}api/consulta_cobros?clientesid=${me.clientesidPerseo}&empresa=${empresaId}`);
                })
                // .then((res) => {
                //     me.datosCobros = res.data.cobros || [];
                //     me.cargando = false;
                // })
                .catch((error) => {
                    console.error('Error al cargar datos de Perseo:', error);
                    me.cargando = false;
                    me.$vs.notification({
                        color: 'danger',
                        title: 'Error',
                        text: 'No se pudieron cargar los datos de Perseo'
                    });
                });
        },
        calcularDiasVencimiento(fecha) {
            if (!fecha) return 0;
            
            // Convertir formato YYYYMMDD a Date
            const year = parseInt(fecha.substring(0, 4));
            const month = parseInt(fecha.substring(4, 6)) - 1;
            const day = parseInt(fecha.substring(6, 8));
            
            const fechaVenta = new Date(year, month, day);
            const fechaActual = new Date();
            const diferencia = fechaActual - fechaVenta;
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            
            return dias >= 0 ? dias : 0;
        },
        imprimirPDF() {
            let me = this;
            me.m_imprimirTodos('12px', 'ReporteCartera_' + me.nombreCliente, '0px', '', 'landscape');
        },
        generateExcelComparacion() {
            let me = this;
            let exportData = [];

            // Headers
            exportData.push({
                "TIPO PLATAFORMA": "TIPO PLATAFORMA",
                "CÓDIGO VENTA PLATAFORMA": "CÓDIGO VENTA PLATAFORMA",
                "FACTURA PERSEO PLATAFORMA": "FACTURA PERSEO PLATAFORMA",
                "VALOR PLATAFORMA": "VALOR PLATAFORMA",
                "SECUENCIAL PERSEO": "SECUENCIAL PERSEO",
                "SALDO PERSEO": "SALDO PERSEO"
            });

            me.datosComparacionTotal.forEach(item => {
                exportData.push({
                    "TIPO PLATAFORMA": item.plat_tipo,
                    "CÓDIGO VENTA PLATAFORMA": item.plat_codigo,
                    "FACTURA PERSEO PLATAFORMA": item.plat_factura_perseo,
                    "VALOR PLATAFORMA": item.plat_valor ? parseFloat(item.plat_valor) : "",
                    "SECUENCIAL PERSEO": item.pers_secuencia,
                    "SALDO PERSEO": item.pers_saldo ? parseFloat(item.pers_saldo) : ""
                });
            });

            // Totals
            exportData.push({
                "TIPO PLATAFORMA": "TOTAL",
                "CÓDIGO VENTA PLATAFORMA": "",
                "FACTURA PERSEO PLATAFORMA": "",
                "VALOR PLATAFORMA": parseFloat(me.datosComparacionTotal.reduce((sum, item) => sum + parseFloat(item.plat_valor || 0), 0).toFixed(2)),
                "SECUENCIAL PERSEO": "TOTAL PERSEO",
                "SALDO PERSEO": parseFloat(me.datosComparacionTotal.reduce((sum, item) => sum + parseFloat(item.pers_saldo || 0), 0).toFixed(2))
            });

            const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Comparacion");
            XLSX.writeFile(wb, `Comparacion_Cobranza_${me.nombreCliente}.xlsx`);
        },
        generateExcel() {
            let me = this;

            // Crear el título del reporte
            const reportTitle = 'REPORTE - CARTERA POR COBRAR - ' + me.nombreCliente;
            const fechaActual = new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Preparar los datos de la tabla
            const data = [];
            
            // SECCIÓN PLATAFORMA
            data.push([reportTitle, '', '', '', '', '', '', '', '', '', me.datosEmpresa.descripcion_corta]);
            data.push(['Fecha: ' + fechaActual, '', '', '', '', '', '', '', '', '']);
            data.push(['CLIENTE: ' + this.nombreCliente, '', '', '', '', '', '', '', '', '']);
            data.push([]); 
            data.push(['CARTERA DE LA PLATAFORMA']);
            data.push(["TIPO", "SECUENCIAL", "EMISION", "VENCE", "DIAS VEN", "OBSERVACION", "VALOR CXC", "ABONO", "SALDO"]);

            // Agregar datos plataforma
            this.datosFormatoPlataforma.forEach(item => {
                data.push([
                    item.tipo,
                    item.secuencial,
                    item.emision,
                    item.vence,
                    item.diasVen,
                    item.observacion,
                    item.valorCXC*1,
                    item.abono > 0 ? item.abono*1 : "",
                    item.saldo*1
                ]);
            });

            // Totales plataforma
            const totalValorCXCPlat = this.datosFormatoPlataforma.reduce((sum, item) => sum + parseFloat(item.valorCXC || 0), 0).toFixed(2);
            const totalAbonoPlat = this.datosFormatoPlataforma.reduce((sum, item) => sum + parseFloat(item.abono || 0), 0).toFixed(2);
            const totalSaldoPlat = this.datosFormatoPlataforma.reduce((sum, item) => sum + parseFloat(item.saldo || 0), 0).toFixed(2);

            data.push(["", "", "", "", "", "TOTAL", totalValorCXCPlat*1, totalAbonoPlat*1, totalSaldoPlat*1]);
            data.push([]); // Espaciador

            // SECCIÓN PERSEO
            data.push(['CARTERA DE PERSEO']);
            data.push(["TIPO", "SECUENCIAL", "EMISION", "VENCE", "OBSERVACION", "SALDO"]);

            // Agregar datos Perseo
            this.datosFormatoPerseo.forEach(item => {
                data.push([
                    item.tipo,
                    item.secuencial,
                    item.emision,
                    item.vence,
                    item.observacion,
                    item.saldo*1
                ]);
            });

            // Totales Perseo
            const totalSaldoPers = this.datosFormatoPerseo.reduce((sum, item) => sum + parseFloat(item.saldo || 0), 0).toFixed(2);

            data.push(["", "", "", "", "TOTAL", totalSaldoPers*1]);

            // Crear la hoja de trabajo de Excel
            const ws = XLSX.utils.aoa_to_sheet(data);
            ws['!merges'] = [{
                    s: { r: 0, c: 0 },
                    e: { r: 0, c: 9 }
                },
                {
                    s: { r: 1, c: 0 },
                    e: { r: 1, c: 9 }
                },
                {
                    s: { r: 2, c: 0 },
                    e: { r: 2, c: 9 }
                },
                {
                    s: { r: 3, c: 0 },
                    e: { r: 3, c: 9 }
                }
            ];

            // Crear un libro de trabajo de Excel
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Cartera Combinada");

            // Descargar el archivo Excel
            XLSX.writeFile(wb, "reporte_cartera_" + (me.nombreCliente).trim() + '.xlsx');
        }
    }
}
</script>

<style scoped>
table {
    margin-top: 10px;
}

table td {
    padding: 8px;
    text-align: center;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mx-5 {
    margin-left: 1.25rem;
    margin-right: 1.25rem;
}
</style>
