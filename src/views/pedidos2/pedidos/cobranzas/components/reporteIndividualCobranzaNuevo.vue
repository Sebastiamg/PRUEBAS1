<template>
<div>
    <!-- <div>
                <div id="botones" align="center" class="mb-4">
                    <vs-button @click="m_imprimirTodos('12px','ReporteAbonos_'+datosCliente[0].razonsocial ,'0px','','landscape')" color="danger">Imprimir PDF</vs-button>
                    <vs-button @click="generateExcel" color="success" class="mx-5">Descargar Excel</vs-button>
                </div>
            </div> -->
    <div>
        <!-- <div>
            <vs-checkbox v-model="verDevolucionesIndependientes" class="mt-2">Listar Devoluciones (Independiente)</vs-checkbox>
        </div> -->
        <div id="seccionImprimir2">
            <table style="width: 100%;border-collapse: collapse;">
                <tr>
                    <td colspan="10" style="text-align: center;"><b>REPORTE DE CARTERA POR COBRAR</b></td>
                    <td colspan="1" rowspan="3">
                        <img v-if="datosEmpresa.id ==3" style="float: right;" src='https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png' width="110">
                        <img v-if="datosEmpresa.id ==1" style="float: right;" src='https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png' width="150">
                    </td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: center;"><b>TEMPORADA: {{ periodoSelect.periodoescolar }}</b></td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10"></td>
                    <td colspan="1"></td>
                </tr>
                <tr>
                    <td colspan="10" style="text-align: left;">
                        <b>CLIENTE: {{ datosClienteReporte.razonsocial }}</b>
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

                <tr v-for="(item, index) in datosNuevoFormato" :key="index" style="text-align: right;">
                    <td style="border: 1px solid black;">{{ item.tipo }}</td>
                    <td style="border: 1px solid black;">{{ item.secuencial }}</td>
                    <td style="border: 1px solid black;">{{ item.emision }}</td>
                    <td style="border: 1px solid black;">{{ item.vence }}</td>
                    <td style="border: 1px solid black;">{{ item.diasVen }}</td>
                    <td style="border: 1px solid black;">{{ item.observacion }}</td>
                    <td style="border: 1px solid black;">{{ item.valorCXC }}</td>
                    <td style="border: 1px solid black;">{{ item.abono > 0 ? item.abono*-1 : '0.00' }}</td>
                    <td style="border: 1px solid black;">{{ item.saldo }}</td>
                    <!-- <td style="border: 1px solid black;">{{ item.cruce_documento }}</td> -->
                    <!-- <td style="border: 1px solid black;">{{ item.notasCredito }}</td>
                    <td style="border: 1px solid black;">{{ item.notasCredito_documento }}</td> -->
                </tr>


                <tr style="text-align: right;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="border: 1px solid black;"><b>TOTAL</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosNuevoFormato.reduce((sum, item) => sum + parseFloat(item.valorCXC || 0), 0).toFixed(2) }}</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosNuevoFormato.reduce((sum, item) => sum + parseFloat(item.abono || 0), 0).toFixed(2) }}</b></td>
                    <td style="border: 1px solid black;"><b>{{ datosNuevoFormato.reduce((sum, item) => sum + parseFloat(item.saldo || 0), 0).toFixed(2) }}</b></td>
                </tr>
            </table>
        </div>

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
    data() {
        return {
            datosClienteReporte: [],
            datosEmpresa: [],
            datosAbonos: [],
            datosFacturasNotas: [],
            datosRetenciones: [],
            datosCruces: [],
            verDevolucionesIndependientes: false,
            totalFacturasOperativas: 0,
            tiposDocumento: {}, // Map para almacenar tipos de documento
            // datosNotasCredito: [],
        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        datosCliente: {
            type: Array,
            default: [],
        },
        empresaCobranza: {
            type: [Object, Array],
            default: () => ({}),
        },
        periodoPuntosOInstitucion: {
            type: Number,
            default: 0,
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
        devoluciones_all: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    mounted() {
        let me = this;
        me.datosClienteReporte = me.datosCliente[0];
        me.datosEmpresa = me.empresaCobranza;
        me.obtenerTiposDocumento();
        me.getFacturaNotaParametro();
        me.obtenerAbonos();
        // me.getNotasCredito();
    },
    methods: {

        getFacturaNotaParametro() {
            let me = this;
            this.$vs.loading();
            this.$http.get(`${this.$server_url}get_facturasNotasxParametro?periodo=${this.periodoPuntosOInstitucion}&empresa=${this.datosEmpresa.id}&cliente=${this.datosClienteReporte.identificacion}&reporte=0`)
                .then((res) => {
                    this.datosFacturasNotas = res.data || [];
                    // Filtrar las Actas (2) y las prefacturas (1) ya que este reporte nuevo es solo para notas
                    this.datosFacturasNotas = this.datosFacturasNotas.filter(p => p.idtipodoc != 2 && p.idtipodoc != 1)
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    console.error(error + ' error');
                    this.$vs.loading.close();
                });
        },
        // getNotasCredito() {
        //     let me = this;
        //     this.$vs.loading();
        //     this.$http.get(`${this.$server_url}get_notasCreditoxParametro?periodo=${this.periodoPuntosOInstitucion}&empresa=${this.datosEmpresa.id}&cliente=${this.datosClienteReporte.identificacion}`)
        //         .then((res) => {
        //             this.datosNotasCredito = res.data || [];
        //             console.log('Datos de datosNotasCredito:', this.datosNotasCredito); // Añade este console.log para depuración
        //             this.$vs.loading.close();
        //         })
        //         .catch((error) => {
        //             console.error(error + ' error');
        //             this.$vs.loading.close();
        //         });
        // },
        obtenerAbonos() {
            let me = this;
            this.$vs.loading();
            this.$http.get(`${this.$server_url}obtenerAbonos?periodo=${this.periodoPuntosOInstitucion}&empresa=${this.datosEmpresa.id}&cliente=${this.datosClienteReporte.identificacion}`)
                .then((res) => {
                    // Asignar los datos recibidos (solo para "notas")
                    const abonos = res.data['abonos_con_notas'] || [];

                    // Filtrar los abonos para las retenciones
                    me.datosRetenciones = abonos.filter(abono => abono.abono_tipo == 3 && abono.abono_estado !== 1 );

                    // Filtrar los abonos para los cruces
                    me.datosCruces = abonos.filter(abono => abono.abono_tipo == 4 && abono.abono_estado !== 1 );

                    // Filtrar los abonos para aquellos con estado diferente a 1, excluyendo las retenciones
                    me.datosAbonos = abonos.filter(abono => abono.abono_estado !== 1 && (abono.abono_tipo !== 3 && abono.abono_tipo !== 4) && abono.abono_cuenta !== 9 );

                    // console.log('Datos de Abonos:', me.datosAbonos); // Añade este console.log para depuración
                    me.$vs.loading.close();
                })
                .catch((error) => {
                    console.error(error + ' error');
                    me.$vs.loading.close();
                });
        },
        obtenerTiposDocumento() {
            let me = this;
            this.$http.get(`${this.$server_url}GetTipoDocumento_todo`)
                .then((res) => {
                    // Crear un mapa: tdo_id => tdo_letra
                    res.data.forEach(tipo => {
                        me.tiposDocumento[tipo.tdo_id] = tipo.tdo_letra || '';
                    });
                    console.log('Tipos de documento cargados:', me.tiposDocumento);
                })
                .catch((error) => {
                    console.error('Error al obtener tipos de documento:', error);
                });
        },
        generateExcel() {
            let me = this;

            // Formatear la fecha actual
            const formatDate = (fecha) => {
                if (!fecha) return '';
                const date = new Date(fecha);
                return date.toISOString().split('T')[0];
            };

            // Crear el título del reporte
            const reportTitle = 'REPORTE - CARTERA POR COBRAR - ' + me.datosClienteReporte.razonsocial;
            const fechaActual = new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Preparar los datos de la tabla
            const data = [];
            data.push([reportTitle, '', '', '', '', '', '', '', '', '', me.datosEmpresa.descripcion_corta]); // Título del reporte con la empresa
            data.push(['Fecha: ' + fechaActual, '', '', '', '', '', '', '', '', '']); // Fecha
            data.push(['CLIENTE: ' + this.datosClienteReporte.razonsocial, '', '', '', '', '', '', '', '', '']); // Cliente
            data.push([]); // Espacio vacío
            data.push(["TIPO", "SECUENCIAL", "EMISION", "VENCE", "DIAS VEN", "OBSERVACION", "VALOR CXC", "ABONO", "SALDO"]); // Encabezados de la tabla

            // Agregar los datos de la tabla dinámica (datosNuevoFormato)
            this.datosNuevoFormato.forEach(item => {
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

            // Agregar las filas de totales
            const totalValorCXC = this.datosNuevoFormato.reduce((sum, item) => sum + parseFloat(item.valorCXC || 0), 0).toFixed(2);
            const totalAbono = this.datosNuevoFormato.reduce((sum, item) => sum + parseFloat(item.abono || 0), 0).toFixed(2);
            const totalSaldo = this.datosNuevoFormato.reduce((sum, item) => sum + parseFloat(item.saldo || 0), 0).toFixed(2);

            data.push([
                "", "", "", "", "", "TOTAL", totalValorCXC*1, totalAbono*1, totalSaldo*1
            ]);

            // Crear la hoja de trabajo de Excel a partir de los datos
            const ws = XLSX.utils.aoa_to_sheet(data);

            // Combinar celdas para los encabezados y el título
            ws['!merges'] = [{
                    s: {
                        r: 0,
                        c: 0
                    },
                    e: {
                        r: 0,
                        c: 9
                    }
                },
                {
                    s: {
                        r: 1,
                        c: 0
                    },
                    e: {
                        r: 1,
                        c: 9
                    }
                },
                {
                    s: {
                        r: 2,
                        c: 0
                    },
                    e: {
                        r: 2,
                        c: 9
                    }
                },
                {
                    s: {
                        r: 3,
                        c: 0
                    },
                    e: {
                        r: 3,
                        c: 9
                    }
                }
            ];

            // Crear un libro de trabajo de Excel
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Cartera");

            // Descargar el archivo Excel
            XLSX.writeFile(wb, "reporte_cartera_" + (me.datosClienteReporte.razonsocial).trim() + '.xlsx');
        }

    },
    computed: {
        // combinedData() {
        //     const formatDate = (fecha) => {
        //         if (!fecha) return ''; // Si no hay fecha, devuelve cadena vacía
        //         const date = new Date(fecha);
        //         return date.toISOString().split('T')[0];
        //     };

        //     // Verifica si datosFacturasNotas está vacío
        //     if (this.datosFacturasNotas.length === 0) {
        //         // Si datosFacturasNotas está vacío, usa datosAbonos para mostrar los datos
        //         return this.datosAbonos.map((abono) => {
        //             return {
        //                 codigo: '',
        //                 tipo: '',
        //                 fecha: '',
        //                 valor: '',
        //                 abono:  (Number((abono.abono_notas > 0 ? abono.abono_notas :
        //                                 abono.abono_facturas > 0 ? abono.abono_facturas :
        //                                 0))).toFixed(2),
        //                 abonoDestino: abono.abono_notas ? 'Notas' : 'PreFactura',
        //                 abonoFecha: abono.abono_fecha || '',
        //                 abonoDepNum: abono.abono_documento || ''
        //             };
        //         });
        //     } else {
        //         return this.datosFacturasNotas.map((factura, index) => {
        //             const abono = this.datosAbonos[index] || {}; // Obtiene el abono correspondiente o un objeto vacío si no hay

        //             // Obtén el valor del abono de manera segura
        //             const abonoValor = (abono.abono_notas > 0 ? abono.abono_notas :
        //                                 abono.abono_facturas > 0 ? abono.abono_facturas :
        //                                 0);

        //             // Convierte a número y formatea a dos decimales
        //             const abonoFormatted = Number(abonoValor).toFixed(2);

        //             return {
        //                 codigo: factura.ven_codigo || '',
        //                 tipo: factura.idtipodoc === 1 ? 'PREFACTURA' :
        //                     factura.idtipodoc === 2 ? 'ACTA' :
        //                     factura.idtipodoc === 4 ? 'NOTA ENTREGA' : 
        //                     factura.idtipodoc === 3 ? 'NOTA ENTREGA' : '',
        //                 fecha: formatDate(factura.ven_fecha),
        //                 valor: (Number(factura.ven_valor) || 0).toFixed(2),
        //                 abono: abonoFormatted,
        //                 abonoDestino: abono.abono_notas > 0 ? 'NOTA' :
        //                             abono.abono_facturas > 0 ? 'PREFACTURA' : '',
        //                 abonoFecha: abono.abono_fecha || '',
        //                 abonoDepNum: abono.abono_documento || ''
        //             };
        //         });
        //     }
        // }
        // combinedData() {
        //     const formatDate = (fecha) => {
        //         if (!fecha) return ''; // Si no hay fecha, devuelve cadena vacía
        //         const date = new Date(fecha);
        //         return date.toISOString().split('T')[0];
        //     };

        //     // Crea un array para almacenar los resultados
        //     const resultados = [];

        //     // Itera sobre datosFacturasNotas
        //     for (let i = 0; i < this.datosFacturasNotas.length; i++) {
        //         const factura = this.datosFacturasNotas[i];

        //         // Obtiene el abono correspondiente o un objeto vacío si no hay
        //         const abono = this.datosAbonos[i] || {};

        //         // Obtén el valor del abono de manera segura
        //         const abonoValor = (abono.abono_notas > 0 ? abono.abono_notas :
        //                             abono.abono_facturas > 0 ? abono.abono_facturas :
        //                             0);

        //         // Convierte a número y formatea a dos decimales
        //         const abonoFormatted = Number(abonoValor).toFixed(2);

        //         resultados.push({
        //             codigo: factura.ven_codigo || '',
        //             tipo: factura.idtipodoc === 1 ? 'PREFACTURA' :
        //                 factura.idtipodoc === 2 ? 'ACTA' :
        //                 factura.idtipodoc === 4 ? 'NOTA ENTREGA' : 
        //                 factura.idtipodoc === 3 ? 'NOTA ENTREGA' : '',
        //             fecha: formatDate(factura.ven_fecha),
        //             valor: (Number(factura.ven_valor) || 0).toFixed(2),
        //             abono: abonoFormatted,
        //             abonoDestino: abono.abono_notas > 0 ? 'NOTA' :
        //                         abono.abono_facturas > 0 ? 'PREFACTURA' : '',
        //             abonoFecha: abono.abono_fecha || '',
        //             abonoDepNum: abono.abono_documento || ''
        //         });
        //     }

        //     // Si quieres agregar elementos de datosAbonos que no tienen factura asociada
        //     for (let j = 0; j < this.datosAbonos.length; j++) {
        //         const abono = this.datosAbonos[j];

        //         // Solo agrega si no hay una factura correspondiente en el índice
        //         if (j >= this.datosFacturasNotas.length) {
        //             resultados.push({
        //                 codigo: '',
        //                 tipo: '',
        //                 fecha: '',
        //                 valor: '',
        //                 abono: (Number((abono.abono_notas > 0 ? abono.abono_notas :
        //                                 abono.abono_facturas > 0 ? abono.abono_facturas :
        //                                 0))).toFixed(2),
        //                 abonoDestino: abono.abono_notas ? 'Notas' : 'PreFactura',
        //                 abonoFecha: abono.abono_fecha || '',
        //                 abonoDepNum: abono.abono_documento || ''
        //             });
        //         }
        //     }

        //     return resultados;
        // }
        combinedData() {
            const formatDate = (fecha) => {
                if (!fecha) return ''; // Si no hay fecha, devuelve cadena vacía
                const date = new Date(fecha);
                return date.toISOString().split('T')[0];
            };

            // Encuentra la longitud máxima entre los cuatro arrays
            const maxLength = Math.max(
                this.datosFacturasNotas.length,
                this.datosAbonos.length,
                this.datosRetenciones.length,
                this.datosRetenciones.length,
                this.datosCruces.length
                // this.datosNotasCredito.length
            );
            // console.log('maximo', maxLength)

            // Crea un array para almacenar los resultados
            const resultados = [];

            if (this.verDevolucionesIndependientes) {
                // MODALIDAD INDEPENDIENTE: Listas paralelas
                
                // 1. Obtener todas las devoluciones relevantes (filtradas por el cliente actual, que ya deberían venir así en this.devoluciones_all si el componente se usa correctamente, 
                //    pero this.devoluciones_all contiene todo. Debemos filtrar?
                //    El componente parece recibir "devoluciones_all" que ya son del scope. Pero en el loop original se filtra por doc.
                //    Asumiremos que this.devoluciones_all contiene TODAS las devoluciones del reporte.
                
                // Preparar lista plana de devoluciones
                // Agrupar por código globalmente para evitar repetidos si es necesario, o listar todo? 
                // Usuario dijo: "quiero sacar una lista q tenga devoluvion tal tal valor". 
                // Asumimos lista de items unicos de devolucion
                const listaDevolucionesGlobal = [];
                // Usamos un mapa para agrupar por codigo de devolucion globalmente
                const devolucionesMap = {};
                
                this.devoluciones_all.forEach(dev => {
                     // Solo incluir devoluciones que estén "dentro" de las facturas listadas? 
                     // O todas las devoluciones disponibles. 
                     // El usuario dijo "independiente de todo".
                     
                     if (!devolucionesMap[dev.codigo_devolucion]) {
                         devolucionesMap[dev.codigo_devolucion] = {
                             codigo: dev.codigo_devolucion,
                             valor: 0,
                             documento_ref: dev.documento // Referencia (aunque pidió independente)
                         };
                     }
                     devolucionesMap[dev.codigo_devolucion].valor += parseFloat(dev.total_descuento || 0);
                });
                
                Object.values(devolucionesMap).forEach(d => {
                    listaDevolucionesGlobal.push({
                        codigo: d.codigo,
                        valor: d.valor
                    });
                });

                // Determinar longitud máxima
                const maxRows = Math.max(this.datosFacturasNotas.length, listaDevolucionesGlobal.length);

                for (let i = 0; i < maxRows; i++) {
                    const factura = this.datosFacturasNotas[i]; // Puede ser undefined
                    const devolucion = listaDevolucionesGlobal[i]; // Puede ser undefined
                    
                    // Datos de Factura (Si existe)
                    let row = {};
                    
                    if (factura) {
                         const abono = this.datosAbonos[i] || {};
                         const retenciones = this.datosRetenciones[i] || {};
                         const cruces = this.datosCruces[i] || {};
                         
                         const abonoValor = (abono.abono_notas > 0 ? abono.abono_notas : abono.abono_facturas > 0 ? abono.abono_facturas : 0);
                         const abonoFormatted = Number(abonoValor).toFixed(2);
                         
                         row = {
                            codigo: factura.ven_codigo || '',
                            tipo: factura.idtipodoc === 4 ? 'NOTA ENTREGA' : factura.idtipodoc === 3 ? 'NOTA ENTREGA': factura.idtipodoc === 20 ? 'FACTURA OPERATIVA': '',
                            idtipodoc: factura.idtipodoc, // Para cálculo de SumaVentas
                            fecha: formatDate(factura.ven_fecha),
                            valor: (factura.ven_valor && !isNaN(factura.ven_valor) ? (factura.ven_valor * 1).toFixed(2) : ''),
                            abono: abonoFormatted,
                            abonoDestino: abono.abono_notas > 0 ? 'NOTA' : '',
                            abonoFecha: abono.abono_fecha || '',
                            abonoDepNum: abono.abono_documento || '',
                            retencion: retenciones.abono_valor_retencion || '',
                            retencion_documento: retenciones.abono_documento || '',
                            cruce: cruces.abono_notas > 0 ? cruces.abono_notas : cruces.abono_facturas > 0 ? cruces.abono_facturas : '',
                            cruce_documento: cruces.abono_documento || '',
                            doc_intercambio: factura.doc_intercambio, 
                         };
                    } else {
                        // Rellenar vacíos si no hay factura en esta fila
                        row = {
                            codigo: '', tipo: '', idtipodoc: null, fecha: '', valor: '', abono: '', abonoDestino: '', abonoFecha: '', abonoDepNum: '',
                            retencion: '', retencion_documento: '', cruce: '', cruce_documento: '', doc_intercambio: ''
                        };
                    }
                    
                    // Datos de Devolución (Si existe)
                    if (devolucion) {
                        row.total_descuento = devolucion.valor.toFixed(2);
                        row.codigo_devolucion = devolucion.codigo;
                    } else {
                        row.total_descuento = '';
                        row.codigo_devolucion = '';
                    }

                    resultados.push(row);
                }

            } else {
                // MODALIDAD NORMAL (Agrupada por documento)
                // Itera sobre datosFacturasNotas y agrega facturas junto con devoluciones
                for (let i = 0; i < maxLength; i++) {
                    const factura = this.datosFacturasNotas[i] || {};

                    // Obtiene el abono correspondiente o un objeto vacío si no hay
                    const abono = this.datosAbonos[i] || {};
                    const retenciones = this.datosRetenciones[i] || {};
                    const cruces = this.datosCruces[i] || {};
                    // const notasCredito = this.datosNotasCredito[i] || {};

                    // Obtén el valor del abono de manera segura
                    const abonoValor = (abono.abono_notas > 0 ? abono.abono_notas :
                        abono.abono_facturas > 0 ? abono.abono_facturas :
                        0);

                    // Convierte a número y formatea a dos decimales
                    const abonoFormatted = Number(abonoValor).toFixed(2);

                    // Buscar todas las devoluciones asociadas al documento de la factura
                    const devoluciones = this.devoluciones_all.filter(d => d.documento === factura.ven_codigo);

                    // Si hay devoluciones, las agrupamos por documento y las concatenamos
                    if (devoluciones.length > 0) {
                        // Agrupar devoluciones por documento
                        const devolucionesAgrupadas = devoluciones.reduce((acumulador, devolucion) => {
                            // Si el documento ya existe en el acumulador, agrega el código de devolución y el descuento
                            if (!acumulador[devolucion.documento]) {
                                acumulador[devolucion.documento] = {
                                    codigosDevolucion: [],
                                    totalDescuento: 0
                                };
                            }
                            acumulador[devolucion.documento].codigosDevolucion.push(devolucion.codigo_devolucion);
                            acumulador[devolucion.documento].totalDescuento += parseFloat(devolucion.total_descuento || 0);
                            return acumulador;
                        }, {});

                        // Ahora, para cada grupo de devoluciones con el mismo documento, agregamos una fila
                        Object.keys(devolucionesAgrupadas).forEach(documento => {
                            const agrupado = devolucionesAgrupadas[documento];

                            resultados.push({
                                codigo: factura.ven_codigo || '',
                                tipo: factura.idtipodoc === 4 ? 'NOTA ENTREGA' : factura.idtipodoc === 3 ? 'NOTA ENTREGA': factura.idtipodoc === 20 ? 'FACTURA OPERATIVA': '',
                                idtipodoc: factura.idtipodoc, // Para cálculo de SumaVentas
                                fecha: formatDate(factura.ven_fecha),
                                valor: (factura.ven_valor && !isNaN(factura.ven_valor) ? (factura.ven_valor * 1).toFixed(2) : ''),
                                abono: abonoFormatted,
                                abonoDestino: abono.abono_notas > 0 ? 'NOTA' : abono.abono_facturas > 0 ? 'PREFACTURA' : '',
                                abonoFecha: abono.abono_fecha || '',
                                abonoDepNum: abono.abono_documento || '',
                                codigo_devolucion: [...new Set(agrupado.codigosDevolucion)].join(', '), // Concatenar los códigos de devolución únicos
                                documento_devolucion: documento, // Mostrar el mismo documento para todas las devoluciones agrupadas
                                total_descuento: agrupado.totalDescuento.toFixed(2) || '', // Sumar todos los descuentos de las devoluciones agrupadas
                                retencion: retenciones.abono_valor_retencion || '',
                                retencion_documento: retenciones.abono_documento || '',
                                cruce: cruces.abono_notas > 0 ? cruces.abono_notas : cruces.abono_facturas > 0 ? cruces.abono_facturas : '',
                                cruce_documento: cruces.abono_documento || '',
                                doc_intercambio: factura.doc_intercambio, // Para validación en la vista
                                // notasCredito: notasCredito.ven_codigo || '',
                                // notasCredito_documento: (notasCredito.ven_valor && !isNaN(notasCredito.ven_valor) ? (notasCredito.ven_valor * 1).toFixed(2) : ''),
                            });
                        });
                    } else {
                        // Si no hay devoluciones, solo agregamos la factura
                        resultados.push({
                            codigo: factura.ven_codigo || '',
                            tipo: factura.idtipodoc === 4 ? 'NOTA ENTREGA' : factura.idtipodoc === 3 ? 'NOTA ENTREGA' : factura.idtipodoc === 20 ? 'FACTURA OPERATIVA': '',
                            idtipodoc: factura.idtipodoc, // Para cálculo de SumaVentas
                            fecha: formatDate(factura.ven_fecha),
                            valor: (factura.ven_valor && !isNaN(factura.ven_valor) ? (factura.ven_valor * 1).toFixed(2) : ''),
                            abono: abonoFormatted,
                            abonoDestino: abono.abono_notas > 0 ? 'NOTA' : '',
                            abonoFecha: abono.abono_fecha || '',
                            abonoDepNum: abono.abono_documento || '',
                            codigo_devolucion: '',
                            documento_devolucion: '',
                            total_descuento: '',
                            retencion: retenciones.abono_valor_retencion || '',
                            retencion_documento: retenciones.abono_documento || '',
                            cruce: cruces.abono_notas > 0 ? cruces.abono_notas : cruces.abono_facturas > 0 ? cruces.abono_facturas : '',
                            cruce_documento: cruces.abono_documento || '',
                            doc_intercambio: factura.doc_intercambio, // Para validación en la vista
                            // notasCredito: notasCredito.ven_codigo || '',
                            // notasCredito_documento: notasCredito.ven_valor*1 || '',
                        });
                    }
                }
            } // Fin IF independiente

            // // Si quieres agregar elementos de datosAbonos que no tienen factura asociada
            // for (let j = 0; j < this.datosAbonos.length; j++) {
            //     const abono = this.datosAbonos[j];

            //     // Solo agrega si no hay una factura correspondiente en el índice
            //     if (j >= this.datosFacturasNotas.length) {
            //         resultados.push({
            //             codigo: '',
            //             tipo: '',
            //             fecha: '',
            //             valor: '',
            //             abono: (Number((abono.abono_notas > 0 ? abono.abono_notas :
            //                 abono.abono_facturas > 0 ? abono.abono_facturas :
            //                 0))).toFixed(2),
            //             abonoDestino: abono.abono_notas ? 'NOTA' : 'PREFACTURA',
            //             abonoFecha: abono.abono_fecha || '',
            //             abonoDepNum: abono.abono_documento || '',
            //             codigo_devolucion: '',
            //             documento_devolucion: '',
            //             total_descuento: '0.00'
            //         });
            //     }
            // }

            return resultados;
        },

        totalDescuentos() {
            // Recorremos los resultados combinados
            return this.combinedData.reduce((total, item) => {
                // Sumamos los descuentos (devoluciones) si existen
                return total + (parseFloat(item.total_descuento) || 0);
            }, 0).toFixed(2); // Retornamos con 2 decimales
        },
        SumaVentas() {
            // ✅ REINICIAR la variable al inicio para evitar acumulación
            this.totalFacturasOperativas = 0;
            
            // Para idtipodoc 20 (Factura Operativa), acumular en variable separada
            return this.combinedData.reduce((total, item) => {
                const valor = parseFloat(item.valor * 1 || 0);
                if (item.idtipodoc === 20) {
                    this.totalFacturasOperativas += valor;
                    console.log(item);
                    console.log(this.totalFacturasOperativas, 'Variable (Facturas Operativas)');
                    // No sumar al total principal
                }
                return total + valor; // Sumar para todos los documentos
            }, 0).toFixed(2);
        },
        SumaAbono() {
            return this.combinedData.reduce((total, item) => total + parseFloat(item.abono*1 || 0), 0).toFixed(2);
        },
        SumaRetencion() {
            return this.combinedData.reduce((total, item) => total + parseFloat(item.retencion*1 || 0), 0).toFixed(2);
        },
        SumaCruces() {
            return this.combinedData.reduce((total, item) => total + parseFloat(item.cruce*1 || 0), 0).toFixed(2);
        },
        // SumaNotasCredito() {
        //     return this.combinedData.reduce((total, item) => total + parseFloat(item.notasCredito_documento*1 || 0), 0).toFixed(2);
        // },
        datosNuevoFormato() {
            // Nuevo formato de tabla con columnas:
            // Tipo | Secuencial | Emisión | Vence | Días Ven | Observación | Valor CXC | Abono | Saldo | Interés
            
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
        }

    },

};
</script>

    
<style>

            </style>
