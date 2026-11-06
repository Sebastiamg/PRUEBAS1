<template>
<div>
    <vx-card class="mt-5">
        <vs-divider class="mt-5">Reportes Ventas, Cobranza</vs-divider>
        <div class="flex" style="justify-content: space-around;">
            <div class="mt-4">
                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="abonoExcel('L')" icon-pack="feather" icon="icon-file">EXPORTAR EXCEL V.LISTA</vs-button>
            </div>
            <div class="mt-4">
                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="abonoExcel('V')" icon-pack="feather" icon="icon-file">EXPORTAR EXCEL V.DIRECTA</vs-button>
            </div>
        </div>
        <div class="flex" style="justify-content: center;">
            <div class="mt-5">
                <vs-button color="danger" type="filled" style="margin-left:10px;" @click="abonoExcel('All')" icon-pack="feather" icon="icon-file">EXPORTAR EXCEL GENERAL</vs-button>
            </div>
            <div class="mt-5">
                <vs-button color="danger" type="filled" style="margin-left:10px;" @click="exportarExcelDetallado" icon-pack="feather" icon="icon-file">
                    EXPORTAR EXCEL GENERAL DETALLADO
                </vs-button>
            </div>
        </div>
        <vs-divider class="mt-5">Reportes Variaciones Venta y abono</vs-divider>
        <div>
            <div class="flex" style="justify-content: space-around;">
                <div class="mt-5">
                    <vs-button color="success" type="filled" style="margin-left:10px;" @click="mostrarReporteVariaciones()" icon-pack="feather" icon="icon-file">Reporte Variaciones Ventas</vs-button>
                </div>
                <div class="mt-5">
                    <vs-button color="success" type="filled" style="margin-left:10px;" @click="mostrarClientesAbonoNoDocumentos()" icon-pack="feather" icon="icon-file">Abonos sin Documentos</vs-button>
                </div>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import * as XLSX from 'xlsx';
import vSelect from "vue-select";
import {
    mapState
} from "vuex";
export default {
    components: {
        "v-select": vSelect,
    },
    data() {
        return {
            menu: 0,
            Instituciones: [],
            puntos: [],
            InsticionCobranza: [],
            puntosCobranza: [],
            datosCliente: {},
            predioSeleccionado: 0,
            exiteDatos: false,
            datoEnviar: null,
            busquedaCliente: '',
            empresaCobranza: [],
            listaEmpresas: [],
            mostrarInstituciones: false,
            busquedaClienteTouched: true,
            empresaCobranzaSelected: false,
            valorSeleccion: 'Seleccion Empresa',
            busquedaClienteLocal: '',
            datosClienteLocal: [],
            busqueda: {
                puntoVenta: '',
            },
            datosSeleccionado: {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
                idusuario: '',
                nombre: '',
                cedula: '',
                email: '',
                datosInstitucion: [],
                clientesidPerseo: 0,
            },
            arrayPuntoVenta: [],
            claseLibreria: 'w-full',
            listaUsuarios: [],
            datosClienteLocal: [],
            datosCliente: [],
            arregloAbonoVentas: [],
            arregloVariacionVentas: [],
            arregloAbonoNoDocumentos: [],
            datoNoExistente: false,
            ventasData: [],
        };
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador', 'empresaPlataforma']),
    },
    watch: {
        busquedaCliente(value) {
            this.busquedaClienteTouched = true;
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.predioSeleccionado = parseInt(me.periodoSelect.idperiodoescolar);
    },
    methods: {
        async obtenerDatos() {
            const periodo = this.periodoSelect.idperiodoescolar;

            try {
                // Realiza la solicitud GET para obtener las ventas
                const response = await this.$http.get(`${this.$apiIluminar}obtenerVentas?periodo=${periodo}`);
                this.ventasData = response.data;
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        },

        // Método para exportar los datos a Excel
        async exportarExcelDetallado() {
            // Obtener los datos si no se han cargado previamente
            if (this.ventasData.length === 0) {
                // Esperar a que se carguen los datos antes de exportar
                await this.obtenerDatos();
            }

            // Verificar que hay datos disponibles antes de exportar
            if (this.ventasData.length === 0) {
                alert('No hay datos para exportar.');
                return;
            }

            // Crear una nueva hoja de trabajo con los datos obtenidos
            const ws = XLSX.utils.json_to_sheet(this.ventasData);

            // Crear un libro de trabajo
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Ventas');

            // Exportar el libro a un archivo Excel
            XLSX.writeFile(wb, 'ventas.xlsx');
        },
        mostrarClientesAbonoNoDocumentos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$apiIluminar + 'clientesAbonoNoDocumentos?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    me.arregloAbonoNoDocumentos = datos;

                    // Exportar a Excel
                    me.exportarAbonoExcel(me.arregloAbonoNoDocumentos);

                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener datos:', error);
                    me.$vs.loading.close();
                });
        },

        exportarAbonoExcel(datos) {
            // Crea una nueva hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(datos);

            // Crea un libro de trabajo y agrega la hoja
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes Abono Sin Documentos');

            // Exporta el archivo
            XLSX.writeFile(workbook, 'clientes_abono_sin_documentos.xlsx');
        },
        mostrarReporteVariaciones() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$apiIluminar + 'reporteVariacionVentas?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;

                    const institucionCliente = {};

                    datos.forEach(item => {
                        item.variaciones = []; // Inicializar el campo de variaciones

                        const key = `${item.ruc_cliente}-${item.institucion_id}`;

                        // Validar diferente institución, mismo cliente
                        if (institucionCliente[item.ruc_cliente]) {
                            if (!institucionCliente[item.ruc_cliente].includes(item.institucion_id)) {
                                item.variaciones.push(`Diferente Institución, mismo cliente: ${item.ruc_cliente}.`);
                            }
                        } else {
                            institucionCliente[item.ruc_cliente] = [item.institucion_id];
                        }

                        // Validar diferente cliente, misma institución
                        const institucionKey = item.institucion_id;
                        if (!institucionCliente[institucionKey]) {
                            institucionCliente[institucionKey] = [item.ruc_cliente];
                        } else {
                            if (!institucionCliente[institucionKey].includes(item.ruc_cliente)) {
                                item.variaciones.push(`Diferente Cliente, misma institución: ${item.nombre}.`);
                            }
                        }

                        // Validar diferencia en tipo de venta
                        if (institucionCliente[key]) {
                            if (institucionCliente[key].ven_tipo_inst !== item.ven_tipo_inst) {
                                item.variaciones.push(`Diferente tipo de venta para cliente: ${item.ruc_cliente}, institución: ${item.nombre}.`);
                            }
                        } else {
                            institucionCliente[key] = {
                                ven_tipo_inst: item.ven_tipo_inst
                            };
                        }
                    });
                    me.arregloVariacionVentas = datos;

                    // Filtrar para quedarnos solo con los que tienen variaciones
                    // me.arregloVariacionVentas = datos.filter(item => item.variaciones.length > 0);
                    // console.log('Datos con variaciones:', me.arregloVariacionVentas);

                    // Exportar a Excel
                    me.exportarAExcel(me.arregloVariacionVentas);

                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener datos:', error);
                    me.$vs.loading.close();
                });
        },

        exportarAExcel(datos) {
            // Cambiar 'errores' a 'variaciones' en los datos
            const datosExportar = datos.map(item => ({
                ...item,
                variaciones: item.variaciones.join('; ') // Unir variaciones en un solo string
            }));

            // Crea una nueva hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(datosExportar);

            // Crea un libro de trabajo y agrega la hoja
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Variaciones');

            // Exporta el archivo
            XLSX.writeFile(workbook, 'reporte_variaciones.xlsx');
        },

        abonoExcel(tipo) {
            let me = this;
            me.reporteAbonoVentas(tipo);
        },
        reporteAbonoVentas(tipo) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$apiIluminar + 'reporteAbonoVentasXD?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    if (tipo == 'L') {
                        me.arregloAbonoVentas = datos.filter(datos => datos.punto_venta == '1');
                        console.log(me.arregloAbonoVentas);
                        setTimeout(() => {
                            me.downloadReport(tipo);
                        }, 500);
                    }
                    if (tipo == 'V') {
                        me.arregloAbonoVentas = datos.filter(datos => datos.punto_venta == '0');
                        console.log(me.arregloAbonoVentas);
                        setTimeout(() => {
                            me.downloadReport(tipo);
                        }, 500);
                    }
                    if (tipo == 'All') {
                        me.arregloAbonoVentas = datos;
                        console.log(me.arregloAbonoVentas);
                        setTimeout(() => {
                            me.downloadReport(tipo);
                        }, 500);
                    }
                    me.$vs.loading.close();

                })
                .catch(function (error) {
                    me.$vs.loading.close();
                });
        },
        downloadReport(tipo) {
            let me = this;
            let reportTitle;
            if (tipo == 'L') {
                reportTitle = 'Reporte Ventas, Abonos, Saldos - Librerias';
            }
            if (tipo == 'V') {
                reportTitle = 'Reporte Ventas, Abonos, Saldos - Establecimientos';
            }
            if (tipo == 'All') {
                reportTitle = 'Reporte Ventas, Abonos, Saldos - General';
            }
            const fecha = new Date();
            const opciones = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            const wsData = this.prepareData(reportTitle, fechaFormateada, tipo, me.periodoSelect.descripcion);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            if (tipo == 'L') {
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 10
                        }
                    }, // Combina el título en la primera fila
                    {
                        s: {
                            r: 1,
                            c: 0
                        },
                        e: {
                            r: 1,
                            c: 10
                        }
                    },
                    {
                        s: {
                            r: 2,
                            c: 0
                        },
                        e: {
                            r: 2,
                            c: 10
                        }
                    },
                ];
            }
            if (tipo == 'V') {
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 10
                        }
                    }, // Combina el título en la primera fila
                    {
                        s: {
                            r: 1,
                            c: 0
                        },
                        e: {
                            r: 1,
                            c: 10
                        }
                    },
                    {
                        s: {
                            r: 2,
                            c: 0
                        },
                        e: {
                            r: 2,
                            c: 10
                        }
                    },
                ];
            }
            if (tipo == 'All') {
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 9
                        }
                    }, // Combina el título en la primera fila
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
                ];
            }

            // Agregar la hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

            // Exportar el archivo
            XLSX.writeFile(wb, `${reportTitle}.xlsx`);
        },

        prepareData(reportTitle, fecha, tipo, temporada) {
            const wsData = [];

            // Inicializar variables de totales
            let totalSaldos = 0;
            let totalDevolucion = 0;
            let totalAbono = 0;
            let totalven_valor = 0;
            let totalsubtotal = 0; // Solo usado en tipo 'V'
            let totalRetencion = 0;
            let totalLiquidaciones = 0;
            let totalCruces = 0;
            let totalNotasCredito = 0;
            let totalDevolucionBruta = 0;
            let totalFacturaOperativa = 0;

            // Agregar título (primera fila)
            wsData.push([reportTitle]); // Aquí se establece el texto del título
            wsData.push(['TEMPORADA ' + temporada]); // Espacio vacío
            wsData.push([fecha]); // Espacio vacío
            wsData.push([]); // Espacio vacío

            if (tipo == 'L') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'LIBRERIA', 'CLIENTE', 'ASESOR', 'COMPRAS', 'PAGOS', 'DEVOLUCIONES', 'RETENCIONES', 'OTROS', 'SALDO','PERIODO','SERIE']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;
                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS' || item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:(ven_valor - abono_total - devolucion - retencion_total).toFixed(2) * 1; // Convertir a número
                    const subtotal = item.subtotal_total ? parseFloat(item.subtotal_total) : 0;

                    const porcentajeSaldo = subtotal !== 0 ? (saldo / subtotal) : 0;
                    const devNeta = devolucion - (devolucion * porcentajeSaldo);

                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        ven_valor.toFixed(2) * 1, // Convertir a número
                        abono_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        // devNeta.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        (0).toFixed(2) * 1,
                        saldo, // Ya es un número
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A'
                    ]);

                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalRetencion += retencion_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                });

                // Agregar totales
                wsData.push(['', '', '', '', 'TOTAL:', totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, (0).toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }

            if (tipo == 'V') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'INSTITUCION', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS', 'RETENCIÓN', 'DEVOlUCION', 'SALDO','PERIODO','SERIE']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const descuento_total = item.descuento_total ? parseFloat(item.descuento_total) : 0;
                    const subtotal = item.subtotal_total ? parseFloat(item.subtotal_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;

                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS'|| item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:(ven_valor - abono_total - devolucion - retencion_total).toFixed(2) * 1; // Convertir a número
                    const porcentajeSaldo = subtotal !== 0 ? (saldo / subtotal) : 0;
                    const devNeta = devolucion - (devolucion * porcentajeSaldo);

                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        subtotal.toFixed(2) * 1, // Convertir a número
                        ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        // devNeta.toFixed(2) * 1,
                        saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A'
                    ]);

                    totalsubtotal += subtotal;
                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                    totalRetencion += retencion_total;
                });

                // Agregar totales
                wsData.push(['', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }

            if (tipo == 'All') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'P.VENTA/INST', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS','DEV. BRUTA', 'DEVOLUCIONES', 'LIQUIDACIONES', 'RETENCIONES', 'CRUCES','NOTA DE CREDITO','FACT.OPERATIVA', 'SALDO','PERIODO','SERIE']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.tdo_nombre == 'NOTA DE CREDITO'?0:item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const descuento_total = item.descuento_total ? parseFloat(item.descuento_total) : 0;
                    const subtotal = item.tdo_nombre == 'NOTA DE CREDITO'?0:item.subtotal_total ? parseFloat(item.subtotal_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;
                    const devolucion_bruta = item.devolucion_bruta ? parseFloat(item.devolucion_bruta) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const liquidaciones = item.abono_liquidacion ? parseFloat(item.abono_liquidacion) : 0;
                    const cruces = item.abono_cruce ? parseFloat(item.abono_cruce) : 0;
                    const notasCredito = item.valor_total ? parseFloat(item.valor_total) : 0;
                     const factura_operativa = item.factura_operativa ? parseFloat(item.factura_operativa) : 0;
                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS' || item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:(ven_valor - abono_total - devolucion - retencion_total + factura_operativa).toFixed(2) * 1; // Convertir a número
                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        // item.idInstitucion || item.institucion_id,
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        subtotal.toFixed(2) * 1, // Convertir a número
                        ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1,
                        devolucion_bruta.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        liquidaciones.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        cruces.toFixed(2) * 1,
                        item.tdo_nombre == 'NOTA DE CREDITO'?notasCredito.toFixed(2) * 1:0,
                        factura_operativa.toFixed(2) * 1,
                        saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A'
                    ]);

                    totalsubtotal += subtotal;
                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalDevolucion += devolucion;
                    totalDevolucionBruta += devolucion_bruta;
                    totalSaldos += saldo;
                    totalRetencion += retencion_total;
                    totalLiquidaciones += liquidaciones;
                    totalCruces += cruces;
                    totalNotasCredito += notasCredito;
                    totalFacturaOperativa += factura_operativa;
                });

                // Agregar totales
                wsData.push(['', '', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucionBruta.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalLiquidaciones.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalCruces.toFixed(2) * 1, totalNotasCredito.toFixed(2) * 1, totalFacturaOperativa.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);
                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }
        },

        getInformacionClienteCobranza(dato) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$apiIluminar + 'getClienteCobranzaxInstitucion?institucion=' + dato + '&periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    me.listaUsuarios = res.data;
                    me.$vs.loading.close();

                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        InstitucionesXCobranzas(datoIdCliente) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$apiIluminar + 'InstitucionesXCobranzas?periodo=' + me.periodoSelect.idperiodoescolar + '&cliente=' + datoIdCliente + '&empresa=' + me.empresaCobranza.id)
                .then(function (res) {
                    // let datosPuntos = res.data.filter(punto => punto.punto_venta === 1);
                    // let datosInstitucion = res.data.filter(punto => punto.punto_venta === 0);
                    // me.Instituciones = [...new Map(datosInstitucion.map(item => [item.idInstitucion, item])).values()];
                    let datosInstitucion = res.data;
                    me.Instituciones = [...new Map(datosInstitucion.map(item => [item.idInstitucion, item])).values()];
                    if (datosInstitucion.length > 0) {
                        me.mostrarInstituciones = true;
                        me.$vs.notify({
                            text: 'Cliente con instituciones/puntos de venta.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    } else {
                        me.mostrarInstituciones = false;
                        me.exiteDatos = false;
                        me.$vs.notify({
                            text: 'Cliente sin instituciones/puntos de venta.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }

                    // me.puntos = [...new Map(datosPuntos.map(item => [item.idInstitucion, item])).values()];
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                    }
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Cliente sin instituciones/puntos de veta.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    console.log(error + ' error');
                    me.$vs.notify({
                        text: 'Ocurrió un error al obtener los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.mostrarInstituciones = false;
                    me.exiteDatos = false;
                    me.$vs.loading.close()
                })
        },
    }
}
</script>

<style>
.box p {
    color: hsl(229, 6%, 66%);
}

.box {
    border-radius: 5px;
    box-shadow: 0px 30px 40px -20px hsl(229, 6%, 66%);
    padding: 30px;
    margin: 20px;
    background-color: white;
    cursor: pointer;
    transition: 1s ease;
}

.box:hover {
    box-shadow: 15px 10px 15px #0000;
}

@media (max-width: 912px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 820px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 450px) {
    .box {
        height: 200px;
    }

    .img {
        margin-top: -40px;
    }
}

@media (max-width: 400px) {
    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 414px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 375px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 280px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 950px) and (min-width: 450px) {
    .box {
        text-align: center;
        height: 180px;
    }
}

.purple {
    border-top: 3px solid hsl(261, 81%, 61%);
}

.orange {
    border-top: 3px solid hsl(34, 97%, 64%);
}

@media (min-width: 950px) {
    .row1-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .row2-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box-down {
        position: relative;
        top: 150px;
    }

    .box {
        width: 28%;

    }

    .header p {
        width: 30%;
    }

}

.facturas {
    background: #c018b8;
    color: #fff;
    min-width: 20px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 25px;
}

.text-purple {
    color: hsl(261, 81%, 61%);
    ;
}

.text-orange {
    color: hsl(34, 97%, 64%);
}
</style>
