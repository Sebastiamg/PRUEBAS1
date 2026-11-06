<template>
    <div class="p-4 space-y-4">
        <!-- Título -->
        <h2 class="text-2xl font-semibold text-gray-700">Reporte General Despacho, cobranzas y facturación</h2>

        <!-- Botón para ejecutar el proceso -->
        <vs-button @click="validarYEjecutarProcesos" color="primary" class="mb-3">Ejecutar Busqueda</vs-button>

        <!-- Botón para exportar a Excel -->
        <div class="flex space-x-4 mt-4" v-if="arregloDatosCLiente.length > 0">
            <vs-checkbox v-model="filtrarPuntoVenta" @change="filtrarDatos"><b>FILTRAR SOLO PUNTO DE
                    VENTA</b></vs-checkbox>
            <vs-checkbox v-model="filtrarNoPuntoVenta" @change="filtrarDatos"><b>FILTRAR SOLO
                    ESTABLECIMIENTOS</b></vs-checkbox>
        </div>

        <!-- Tabla con los datos de clientes -->
        <vs-table :data="arregloDatosCLiente" search pagination max-items="10" no-data-text="No hay datos disponibles">
            <template slot="header">
                <vs-chip color="#49218a">Cantidad: <b> {{ arregloDatosCLiente.length }}</b></vs-chip>
                <vs-button class="mx-5" v-if="arregloDatosCLiente.length > 0" @click="exportarAExcel"
                    color="success">Exportar a Excel</vs-button>
            </template>
            <template slot="thead">
                <vs-th sort-key="cliente">Cliente</vs-th>
                <vs-th sort-key="institucion">Institución</vs-th>
                <vs-th sort-key="total_prefacturas">Total Prefacturas</vs-th>
                <vs-th sort-key="total_notas">Total Notas</vs-th>
                <vs-th sort-key="total_despachado">Total Despachado</vs-th>
                <vs-th sort-key="total_notas_credito">Total Notas Crédito</vs-th>
                <vs-th sort-key="total_facturas">Total Facturas</vs-th>
                <vs-th sort-key="total_abono_facturas">Total Abonos</vs-th>
                <vs-th sort-key="total_liquidaciones">Total Liquidaciones</vs-th>
                <vs-th sort-key="retenciones">Total Retenciones</vs-th>
                <vs-th sort-key="total_cruces">Total Cruces</vs-th>
                <vs-th sort-key="valor_con_descuento_devoluciones">Total Devolución</vs-th>
                <vs-th>Total Pendiente</vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{ tr.cliente }}<br>
                        {{ tr.ruc_cliente }}
                    </vs-td>
                    <vs-td>{{ tr.institucion }}</vs-td>
                    <vs-td>{{ tr.total_prefacturas | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_notas | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_despachado | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_notas_credito | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_facturas | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_abono_facturas | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_liquidaciones | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.retenciones | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.total_cruces | filtrarDecimal }}</vs-td>
                    <vs-td>{{ tr.valor_con_descuento_devoluciones | filtrarDecimal }}</vs-td>
                    <vs-td>{{ (((tr.total_prefacturas + tr.total_notas) - tr.valor_con_descuento_devoluciones) -
                        (tr.total_abono_facturas + tr.total_liquidaciones + tr.retenciones + tr.total_cruces)) |
                        filtrarDecimal }}</vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>
    import {
        utils,
        writeFile
    } from 'xlsx';
    import moment from 'moment';
    import vSelect from "vue-select";
    import flatPickr from 'vue-flatpickr-component';

    export default {
        components: {
            "v-select": vSelect,
            flatPickr,
        },
        data() {
            return {
                usuario: JSON.parse(localStorage.getItem("usuario")),
                arregloDatosCLiente: [],
                arregloDatosCLienteOriginal: [],
                datosPuntoVenta: [],
                datosNoPuntoVenta: [],
                filtrarPuntoVenta: false,
                filtrarNoPuntoVenta: false,
                periodoSelect: null,
                periodosIluminar: [],
            };
        },
        props: {
            predioSeleccionado: {
                type: Number,
                default: 0,
            },
            iluminar: {
                type: Boolean,
                default: false,
                // required: true,
            },
            periodoCodigoContrato: {
                type: String,
                default: null,
            },
        },
        mounted() {
            this.$vs.loading.close();

        },
        methods: {
            async validarYEjecutarProcesos() {
                if (!this.iluminar) {
                    this.periodoSelect = this.predioSeleccionado;
                    this.ejecutarProcesos();
                } else {
                    this.iluminarfunciones();
                }
            },
            // Método para obtener los datos de los clientes
            mostrarDatosCliente() {
                return new Promise((resolve, reject) => {
                    this.$http.get((this.iluminar ? this.$apiIluminar : this.$server_url) + 'obtenerDatosClientes?periodo=' + this.periodoSelect)
                        .then(res => {
                            this.arregloDatosCLiente = res.data;
                            // this.arregloDatosCLienteOriginal = res.data;
                            resolve(res.data); // Resolvemos la promesa con los datos
                        })
                        .catch(error => {
                            console.error('Error al obtener datos:', error);
                            this.$vs.loading.close();
                            reject(error); // Rechazamos la promesa en caso de error
                        });
                });
            },

            // Método que maneja el flujo de procesos
            async ejecutarProcesos() {
                try {
                    this.$vs.loading();
                    // Primero obtenemos los datos de los clientes
                    let datosClientes = await this.mostrarDatosCliente(); F
                    this.arregloDatosCLiente = datosClientes;
                    this.arregloDatosCLiente = this.arregloDatosCLiente.map(cliente => {
                        return {
                            ...cliente,
                            total_abono_facturas: cliente.abono_facturas + cliente.abono_notas,
                            total_liquidaciones: cliente.liquidaciones_facturas + cliente.liquidaciones_notas,
                            total_despachado: cliente.total_prefacturas + cliente.total_notas,
                            total_cruces: cliente.cruces + cliente.crucesNotas,
                        };
                    });
                    this.arregloDatosCLienteOriginal = this.arregloDatosCLiente;

                    console.log('Todos los procesos se completaron correctamente.');

                } catch (error) {
                    console.error('Hubo un error en el proceso:', error);
                    this.$vs.loading.close();
                } finally {
                    // Finalmente, podemos mostrar la tabla actualizada
                    this.$vs.loading.close();
                }
            },

            exportarAExcel() {
                // Preparar los datos para exportar
                const datosParaExportar = this.arregloDatosCLiente.map(cliente => {
                    const pendiente = (
                        (cliente.total_prefacturas + cliente.total_notas) -
                        cliente.valor_con_descuento_devoluciones -
                        (cliente.total_abono_facturas + cliente.total_liquidaciones + cliente.retenciones + cliente.total_cruces)
                    );

                    const redondeado = Math.round((pendiente + Number.EPSILON) * 100) / 100;

                    return {
                        'Cliente': cliente.cliente,
                        'RUC/CI': cliente.ruc_cliente,
                        'Asesor': cliente.asesor,
                        'Institución': cliente.institucion,
                        'Total Prefacturas': cliente.total_prefacturas,
                        'Total Notas': cliente.total_notas,
                        'Total Despachado': cliente.total_despachado,
                        'Total Notas Crédito': cliente.total_notas_credito,
                        'Total Facturas': cliente.total_facturas,
                        'Total Abonos': cliente.total_abono_facturas,
                        'Total Liquidaciones': cliente.total_liquidaciones,
                        'Total Devolucion': cliente.valor_con_descuento_devoluciones,
                        'Total Retenciones': cliente.retenciones,
                        'Total Cruces': cliente.total_cruces,
                        'Total Devolucion': cliente.valor_con_descuento_devoluciones,
                        'Total Pendiente': pendiente.toFixed(2) * 1,
                    };
                });

                // Crear la hoja de Excel con los datos
                const ws = XLSX.utils.json_to_sheet(datosParaExportar);

                // Crear un libro de trabajo
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Clientes');

                // Exportar el archivo Excel
                XLSX.writeFile(wb, 'reporte_clientes.xlsx');
            },
            iluminarfunciones() {
                this.$http.get(this.$apiIluminar + 'periodo')
                    .then(res => {
                        this.periodosIluminar = res.data;

                        // Validación 1: Si la respuesta está vacía
                        if (!this.periodosIluminar || this.periodosIluminar.length === 0) {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se encontraron periodos disponibles.',
                                color: 'danger'
                            });
                            return; // Detener ejecución
                        }

                        // Filtramos los periodos
                        this.periodosIluminar = this.periodosIluminar.filter(periodo => periodo.codigo_contrato == this.periodoCodigoContrato);

                        // Validación 2: Si el filtro no encontró coincidencias
                        if (this.periodosIluminar.length === 0) {
                            this.$vs.notify({
                                title: 'Error',
                                text: `No hay periodos disponibles en Iluminar con el código: ${this.periodoCodigoContrato}.`,
                                color: 'danger'
                            });
                            return; // Detener ejecución
                        }

                        // Si pasó todas las validaciones, ejecutamos el proceso
                        this.periodoSelect = this.periodosIluminar[0].idperiodoescolar;
                        setTimeout(() => {
                            this.ejecutarProcesos();
                        }, 500);
                    })
                    .catch(error => {
                        console.error('Error al obtener datos:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Ocurrió un error al obtener los periodos.',
                            color: 'danger'
                        });
                        this.$vs.loading.close();
                    });
            },
            filtrarDatos() {
                if (this.filtrarPuntoVenta && this.filtrarNoPuntoVenta) {

                    // No debería ser posible que ambos sean true, pero por si acaso
                    this.arregloDatosCLiente = this.arregloDatosCLienteOriginal;

                } else if (this.filtrarPuntoVenta) {

                    this.arregloDatosCLiente = this.arregloDatosCLienteOriginal.filter(cliente => cliente.punto_venta === 1);
                    if (this.arregloDatosCLiente.length === 0) {
                        this.arregloDatosCLiente = this.arregloDatosCLienteOriginal;
                        this.filtrarPuntoVenta = false;
                        this.$vs.notify({
                            title: 'Aviso',
                            text: 'No se pudo filtrar por Punto de Venta no hay clientes con Punto de Venta.',
                            color: 'warning'
                        });
                    }

                } else if (this.filtrarNoPuntoVenta) {

                    this.arregloDatosCLiente = this.arregloDatosCLienteOriginal.filter(cliente => cliente.punto_venta === 0);

                    if (this.arregloDatosCLiente.length == 0) {
                        this.arregloDatosCLiente = this.arregloDatosCLienteOriginal;
                        this.$vs.notify({
                            title: 'Aviso',
                            text: 'No se pudo filtrar por Punto de Venta no hay clientes con Establecimientos.',
                            color: 'warning'
                        });
                        this.filtrarNoPuntoVenta = false;
                    }

                } else {
                    this.arregloDatosCLiente = [...this.arregloDatosCLienteOriginal]; // Restaurar lista completa
                }
            }

        }
    };
</script>