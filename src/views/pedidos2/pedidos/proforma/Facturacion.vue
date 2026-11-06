<template>
    <div class="mt-5">
        <!-- Botón para ejecutar la función de obtener ventas -->
        <vs-button @click="getFacturacion" color="primary">Obtener Datos</vs-button>

        <!-- Tabla de ventas -->
        <vs-table v-model="selected" pagination :max-items="10" search :data="Ventas" no-data-text="No hay datos disponibles">
            <template slot="header">
                <h3 class="mr-3">Saldos {{empresa==1?'Prolipa':empresa==3?'Calmed':''}}</h3>
                <!-- Botón para exportar a Excel -->
                <vs-button v-if="Ventas.length>0" @click="exportToExcel" color="success">Exportar a Excel</vs-button>
            </template>

            <template slot="thead">
                <vs-th sort-key="institucion">Institución</vs-th>
                <vs-th sort-key="detalle_venta">Detalles de Venta</vs-th>
            </template>

            <template slot-scope="{ data }">
                <vs-tr v-for="(venta, index) in data" :key="index">
                    <vs-td>{{ venta.institucion }}<br /> <b>{{ venta.ruc }}</b></vs-td>

                    <!-- Mini tabla con los detalles de la venta -->
                    <vs-td>
                        <vs-table :data="venta.detalle_venta" max-items="5" pagination search>
                            <template slot="thead">
                                <vs-th>Producto</vs-th>
                                <vs-th>Libro</vs-th>
                                <vs-th>Cantidad Despachada</vs-th>
                                <vs-th>Cantidad Devuelta</vs-th>
                                <vs-th>Cantidad Facturada</vs-th>
                                <vs-th>Precio Unitario</vs-th>
                            </template>

                            <template slot-scope="{ data }">
                                <vs-tr v-for="(detalle, index) in data" :key="index">
                                    <vs-td>{{ detalle.pro_codigo }}</vs-td>
                                    <vs-td>{{ detalle.nombre }}</vs-td>
                                    <vs-td>{{ detalle.det_ven_cantidad }}</vs-td>
                                    <vs-td>{{ detalle.det_ven_dev }}</vs-td>
                                    <vs-td>{{ detalle.det_ven_cantidad_facturada }}</vs-td>
                                    <vs-td>{{ detalle.det_ven_valor_u }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

    </div>
    </template>


    <script>
    import Vue from "vue";
    import axios from "axios";
    import vSelect from "vue-select";
    import * as XLSX from "xlsx"; // Librería para exportar a Excel

    export default {
        data() {
            return {
                Ventas: [],
                selected: [], // Para gestionar selección de filas si lo necesitas
            };
        },
        components: {
            "v-select": vSelect,
        },
        props: {
            periodoSelect: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            empresa: {
                type: Number,
                default: 0
            }
        },
        methods: {
            getFacturacion() {
                let me = this;
                me.Ventas = [];
                let id = me.periodoSelect.idperiodoescolar;
                me.$vs.loading();
                this.$http
                    .get(this.$server_url + "clientesVentasALL?periodo=" + id + '&empresa=' + me.empresa)
                    .then(function (res) {
                        me.Ventas = res.data.filter(p => p.detalle_venta.length > 0);
                        if (me.Ventas.length === 0) {
                            me.$vs.notify({
                                text: "No hay Desfases para esta búsqueda",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            me.Ventas = [];
                            me.$vs.loading.close();
                        } else {
                            me.$vs.loading.close();
                            if (res.data.message) {
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: "success",
                                    iconPack: "feather",
                                    icon: "icon-user",
                                });
                            }
                        }
                    })
                    .catch(function (error) {
                        if (error.response && error.response.status === 404) {
                            me.$vs.notify({
                                text: "No hay Desfases para esta búsqueda",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            me.Ventas = [];
                            me.$vs.loading.close();
                        } else {
                            console.log(error + " error");
                            me.Ventas = [];
                            me.$vs.loading.close();
                        }
                    });
            },
            exportToExcel() {
                let me = this;
                // Crear un nuevo libro de Excel
                const wb = XLSX.utils.book_new();

                // Crear una primera hoja con los nombres de los clientes y un secuencial
                const clientsData = this.Ventas.map((cliente, index) => {
                    return {
                        Secuencial: index + 1, // El número secuencial
                        Institucion: cliente.institucion,
                        RUC: cliente.ruc
                    };
                });

                // Crear una hoja con los nombres de los clientes y su secuencial
                const wsClients = XLSX.utils.json_to_sheet(clientsData);

                // Agregar la primera hoja al libro (Hoja1)
                XLSX.utils.book_append_sheet(wb, wsClients, "Clientes");

                // Recorrer cada cliente en la lista de ventas y agregar una hoja con detalles
                this.Ventas.forEach((cliente, index) => {
                    // Crear los datos para la tabla de detalle_venta de cada cliente
                    const dataForExcel = cliente.detalle_venta.map((producto) => {
                        return {
                            Producto: producto.pro_codigo,
                            "Libro": producto.nombre,
                            "Cantidad Despachada": producto.det_ven_cantidad,
                            "Cantidad Devuelta": producto.det_ven_dev,
                            "Cantidad Facturada": producto.det_ven_cantidad_facturada,
                            "Cantidad Desfasada": (producto.det_ven_cantidad - producto.det_ven_dev) - producto.det_ven_cantidad_facturada,
                            "Precio Unitario": producto.det_ven_valor_u,
                        };
                    });

                    // Nombre de la pestaña usando el número secuencial
                    let sheetName = (index + 1).toString(); // Usar el número secuencial como nombre de la pestaña

                    // Recortar el nombre de la hoja a 31 caracteres si es necesario
                    if (sheetName.length > 31) {
                        sheetName = sheetName.substring(0, 31);
                    }

                    // Agregar un encabezado con el nombre del cliente en la pestaña
                    const headerRow = [{
                        v: "Nombre Cliente: " + cliente.institucion,
                        s: {
                            font: {
                                bold: true
                            }
                        }
                    }];

                    // Fila vacía
                    const emptyRow = [];

                    // Encabezado para los datos de detalle de ventas
                    const columnHeaders = [
                        "Producto", "Libro", "Cantidad Despachada", "Cantidad Devuelta",
                        "Cantidad Facturada", "Cantidad Desfasada", "Precio Unitario"
                    ];

                    // Convertir el encabezado en una hoja para agregarla antes del detalle
                    const wsWithHeader = XLSX.utils.aoa_to_sheet([headerRow, emptyRow, columnHeaders]);

                    // Convertir los datos del detalle de venta a una hoja
                    const wsDetail = XLSX.utils.json_to_sheet(dataForExcel, {
                        origin: 'A4'
                    }); // Los datos empiezan en la fila 4

                    // Combinar el encabezado con los detalles
                    XLSX.utils.sheet_add_json(wsWithHeader, dataForExcel, {
                        skipHeader: true,
                        origin: {
                            r: 3,
                            c: 0
                        }
                    });

                    // Crear la hoja para cada cliente con su nombre y los detalles de venta
                    XLSX.utils.book_append_sheet(wb, wsWithHeader, sheetName);
                });

                // Exportar como archivo Excel
                let nombreArchivo = "Facturacion_" + (this.empresa == 1 || this.empresa == 6 ? 'Prolipa' : this.empresa == 3 ? 'Calmed' : '') + ".xlsx";

                // Ahora pasamos la variable al método writeFile
                XLSX.writeFile(wb, nombreArchivo);
            }
        },
    };
    </script>


    <style scoped>
    /* Estilos opcionales para ajustar el tamaño de la tabla interna */
    .vs-table {
        margin-top: 10px;
    }
    </style>
