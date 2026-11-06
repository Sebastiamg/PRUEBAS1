<template>
    <div class="flex flex-col mt-5">
        <div class="flex justify-center items-center mb-4">
            <vs-switch color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash" v-model="validacionConfiguracion" @change="arrayDatosFacturado=[];isDateRange=false;isDifferentDate=false;selectedYear='';dateRange=[]">
                <span slot="on">SI</span>
                <span slot="off">NO</span>
            </vs-switch>
            <b>Configurar busqueda del Reporte</b>
        </div>
        <div class="flex flex-col md:flex-row mb-5" v-if="!validacionConfiguracion">
            <div class="flex items-center w-full md:w-1/3 mb-2 md:mb-0">
                <p>
                    <ion-icon name="contract-outline"></ion-icon> Busqueda por Año
                </p>
            </div>
            <div class="w-full md:w-2/3 mb-5">
                <div>
                    <label class="block">
                        Año:
                        <v-select :options="arrayYear" :reduce="year => year.valor" label="year" class="w-full" v-model="selectedYear" @input="busquedaXYear();" placeholder="Selecciona un año" />
                        <span v-if="!selectedYear" style="color: red;">Seleccione el año.</span>
                    </label>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row mb-5" v-else>
            <div class="flex items-center w-full md:w-1/3 mb-2 md:mb-0 my-5">
                <p>
                    <ion-icon name="contract-outline"></ion-icon> Busqueda por Año
                </p>
            </div>
    
            <!-- Selector para tipo de búsqueda (Año o Rango de Fechas) -->
            <div class="w-full md:w-2/3 mb-5">
                <div class="my-3">
                    <vs-checkbox v-model="isDifferentDate" @change="selectedDateType=null">Buscar por fecha diferente</vs-checkbox>
                </div>
    
                <!-- Mostrar opciones de fecha -->
                <div v-if="isDifferentDate" class="my-3">
                    <v-select :options="opcionesFechas" :reduce="fecha => fecha.valor" label="label" class="w-full" v-model="selectedDateType" placeholder="Selecciona el tipo de fecha" />
                    <span v-if="!selectedDateType" style="color: red;">Seleccione el tipo de fecha.</span>
                </div>
    
                <!-- Si no, buscar por un solo año -->
                <div class="my-3">
                    <v-select :options="arrayYear" :reduce="year => year.valor" label="year" class="w-full" v-model="selectedYear" placeholder="Selecciona un año" />
                    <span v-if="!selectedYear" style="color: red;">Seleccione el año.</span>
                </div>
            </div>
        </div>
    
        <div v-if="validacionConfiguracion" class="flex justify-center items-center mt-1">
            <vs-button color="warning" v-if="validacionConfiguracion" class="mx-2" @click="busquedaXYear()" icon="search">BUSCAR</vs-button>
        </div>
    
        <div>
            <div v-if="(arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].length > 0) || 
                            (arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].length > 0)">
                <div class="w-full flex">
                    <!-- Sección Prolipa -->
                    <div class="libros-prolipa" v-if="arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].length > 0" :class="{ 'w-full': !(arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].length), 'w-1/2': arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].length > 0 }">
                        <vs-divider>Prolipa</vs-divider>
                        <span class="mr-3"><b>Total facturado:</b> {{ ValorTotalProlipaFacturado | filtrarDecimal }}</span>
                        <span class="mr-3"><b>Total cobrado:</b> {{ ValorTotalProlipaCobrado | filtrarDecimal }}</span>
                        <span class="mr-3"><b>Total pendiente:</b> {{ ValorTotalProlipaPendiente | filtrarDecimal }}</span>
                        <vs-divider></vs-divider>
                        <!-- Tabla Prolipa -->
                        <vs-table :data="arrayDatosFacturado['datosProlipa']" stripe pagination :max-items="10" search no-data-text="No hay datos disponibles">
                            <template slot="header">
                                <vs-chip color="primary" class="mr-2">Cantidad {{ arrayDatosFacturado['datosProlipa'].length }}</vs-chip>
                                <vs-button color="success" v-if="ifExportar" class="mb-2 p-3 ml-3" @click="exportarExcel('Prolipa')">
                                    <i class="fa-solid fa-download"></i> Exportar
                                </vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th>Detalles</vs-th>
                                <vs-th>Punto de despacho</vs-th>
                                <vs-th sort-key="totalFacturado">Total Facturado</vs-th>
                                <vs-th sort-key="totalCobrado">Total Cobrado</vs-th>
                                <vs-th sort-key="totalNotasCredito">Total Nota de Credito</vs-th>
                                <vs-th >Total Pendiente</vs-th>
                            </template>
                            <template slot-scope="{ data }">
                                <vs-tr v-for="item in data" :key="item.cedula">
                                    <vs-td>
                                        <b>CEDULA/RUC: </b>{{ item.cedula }} <br>
                                        <b>Cliente: </b>{{ item.cliente }} <br>
                                        <b>Empresa: </b>{{ item.empresa }}
                                    </vs-td>
                                    <vs-td>{{ item.nombreInstitucion }}</vs-td>
                                    <vs-td>{{ item.totalFacturado }}</vs-td>
                                    <vs-td>{{ item.totalCobrado }}</vs-td>
                                    <vs-td>{{ item.totalNotasCredito }}</vs-td>
                                    <vs-td>{{ item.valorPendiente }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
    
                    <!-- Sección Calmed -->
                    <div class="libros-calmed" v-if="arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].length > 0" :class="{ 'w-full': !(arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].length), 'w-1/2': arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].length > 0 }">
                        <vs-divider>Calmed</vs-divider>
                        <span class="mr-3"><b>Total facturado:</b> {{ ValorTotalCalmedFacturado | filtrarDecimal }}</span>
                        <span class="mr-3"><b>Total cobrado:</b> {{ ValorTotalCalmedCobrado| filtrarDecimal }}</span>
                        <span class="mr-3"><b>Total pendiente:</b> {{ ValorTotalCalmedPendiente | filtrarDecimal }}</span>
                        <vs-divider></vs-divider>
                        <!-- Tabla Calmed -->
                        <vs-table :data="arrayDatosFacturado['datosCalmed']" stripe pagination :max-items="10" search no-data-text="No hay datos disponibles">
                            <template slot="header">
                                <vs-chip color="primary" class="mr-2">Cantidad {{ arrayDatosFacturado['datosCalmed'].length }}</vs-chip>
                                <vs-button color="success" v-if="ifExportar" class="mb-2 p-3 ml-3" @click="exportarExcel('Calmed')">
                                    <i class="fa-solid fa-download"></i> Exportar
                                </vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th>Detalles</vs-th>
                                <vs-th>Punto de despacho</vs-th>
                                <vs-th>Total Facturado</vs-th>
                                <vs-th sort-key="totalCobrado">Total Cobrado</vs-th>
                                <vs-th sort-key="totalNotasCredito">Total Nota de Credito</vs-th>
                                <vs-th>Total Pendiente</vs-th>
                            </template>
                            <template slot-scope="{ data }">
                                <vs-tr v-for="item in data" :key="item.cedula">
                                    <vs-td>
                                        <b>CEDULA/RUC: </b>{{ item.cedula }} <br>
                                        <b>Cliente: </b>{{ item.cliente }} <br>
                                        <b>Empresa: </b>{{ item.empresa }}
                                    </vs-td>
                                    <vs-td>{{ item.nombreInstitucion }}</vs-td>
                                    <vs-td>{{ item.totalFacturado }}</vs-td>
                                    <vs-td>{{ item.totalCobrado }}</vs-td>
                                    <vs-td>{{ item.totalNotasCredito }}</vs-td>
                                    <vs-td>{{ item.valorPendiente }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </template>
    
    <script>
    import XLSX from 'xlsx';
    import VSelect from 'vue-select';
    import Generalmix from '@/mixins/Generalmix';
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    
    export default {
        mixins: [Generalmix],
        components: {
            VSelect,
            flatPickr,
        },
        data() {
            return {
                arrayYear: [],
                arrayDatosFacturado: [],
                selectedYear: '',
                dateRange: [], // Almacenará las fechas seleccionadas del rango
                isDifferentDate: false, // Variable para verificar si la búsqueda es por fecha diferente
                ValorTotalProlipaFacturado: 0,
                ValorTotalProlipaCobrado: 0,
                ValorTotalProlipaPendiente: 0,
                ValorTotalCalmedFacturado: 0,
                ValorTotalCalmedCobrado: 0,
                ValorTotalCalmedPendiente: 0,
                ifExportar: 1, // Controla si el botón de exportar está habilitado
                configDateRange: {
                    mode: 'range', // Modo de rango para flatpickr
                    dateFormat: 'Y-m-d',
                },
                headers: ['Cedula/Ruc', 'Cliente', 'Empresa', 'Punto de despacho', 'Total Facturado', 'Total Cobrado', 'Total Pendiente'],
                fieldKeys: ['cedula', 'cliente', 'empresa', 'nombreInstitucion', 'totalFacturado', 'totalCobrado', 'valorPendiente'],
                validacionConfiguracion: false,
                selectedDateType: null, // Aquí se almacena el tipo de fecha seleccionado
                opcionesFechas: [{
                        valor: '1',
                        label: 'Fecha Nota de Credito Registrada'
                    },
                    {
                        valor: '2',
                        label: 'Fecha Nota de Credito SRI'
                    },
                    {
                        valor: '3',
                        label: 'Fecha Nota de Credito Creación'
                    }
                ],
            };
        },
        created() {
            this.arrayYear = this.generateYears();
        },
        methods: {
            generateYears() {
                const currentYear = new Date().getFullYear();
                const startYear = 2024;
                return Array.from({
                    length: currentYear + 1 - startYear + 1
                }, (v, i) => ({
                    year: startYear + i,
                    valor: (startYear + i).toString()
                }));
            },
            busquedaXYear() {
                let me = this;
                // Verificar si la validación está activada
                if (me.validacionConfiguracion) {
                    // Primero validamos el caso más específico (condición 3, 4, 5)
                    if (me.isDifferentDate) {
                        // Si no se ha seleccionado un tipo de fecha y no se ha seleccionado un rango de fechas
                        if (!me.selectedDateType) {
                            me.$vs.notify({
                                type: 'error',
                                text: 'Seleccione un tipo o desactive la opción de buscar por fecha diferente y por tipo de fecha.',
                            });
                        } else  if (me.selectedDateType && !me.selectedYear) {
                            me.$vs.notify({
                                type: 'error',
                                text: 'Seleccione un año para buscar por fecha diferente.',
                            });
                        } else {
                            // Si pasa todas las validaciones, ejecutamos la búsqueda con los datos correctos.
                            me.buscarCuentasXCobrar({
                                dateRange: me.dateRange,
                                fechaTipo: me.selectedDateType,
                                year: me.selectedYear
                            });
                        }
                    }
                    // Validamos el caso del año y tipo de fecha (condición 1)
                    else if (me.selectedYear && !me.selectedDateType) {
                        me.$vs.notify({
                            type: 'error',
                            text: 'Seleccionó el año pero no un tipo de fecha diferente. El reporte no variará.',
                        });
                    }else {
                        // Si pasa todas las validaciones, ejecutamos la búsqueda con los datos correctos según lo seleccionado.
                        // Validamos si es necesario pasar cada parámetro
                        let params = {};
    
                        // Si se seleccionó un año
                        if (me.selectedYear) {
                            params.year = me.selectedYear;
                        }
    
                        // Si se seleccionó un tipo de fecha
                        if (me.selectedDateType) {
                            params.fechaTipo = me.selectedDateType;
                        }
    
                        // Ejecutamos la búsqueda con los parámetros correctos
                        me.buscarCuentasXCobrar(params);
                    }
                } else {
                    // Si la validación está desactivada, la búsqueda es solo por año
                    if (me.selectedYear) {
                        // Llamar a la función con solo el año seleccionado
                        me.buscarCuentasXCobrar({
                            year: me.selectedYear
                        });
                    } else {
                        // Si no se selecciona un año, mostrar error
                        me.$vs.notify({
                            type: 'error',
                            text: 'Seleccione un año.',
                        });
                        me.arrayDatosFacturado=[];
                    }
                }
            },
    
            getCuentasXCobrarXyear(year) {
                let me = this;
                me.arrayDatosFacturado = [];
                me.ValorTotalProlipaFacturado = 0;
                me.ValorTotalCalmedFacturado = 0;
                me.ValorTotalCalmedCobrado = 0;
                me.ValorTotalProlipaCobrado = 0;
                me.ValorTotalProlipaPendiente = 0; // Asegurarse de inicializar este valor.
                me.ValorTotalCalmedPendiente = 0; // Asegurarse de inicializar este valor.
                me.$vs.loading();
    
                this.$http.get(this.$server_url + `obtenerCuentasXCobrar?year=${year}`)
                    .then((res) => {
                        let datos = res.data;
                        me.arrayDatosFacturado = {
                            datosProlipa: datos.prolipa || [],
                            datosCalmed: datos.calmed || []
                        };
    
                        // Calcular el valor pendiente en Prolipa
                        me.arrayDatosFacturado.datosProlipa.forEach(item => {
                            // Asegurarse de que totalFacturado y totalCobrado sean números
                            const totalFacturado = parseFloat(item.totalFacturado) || 0;
                            const totalCobrado = parseFloat(item.totalCobrado) || 0;
    
                            // Calcular el valor pendiente y asegurarse de que es un número
                            item.valorPendiente = (totalFacturado - totalCobrado).toFixed(2);
    
                            // Acumular los totales
                            me.ValorTotalProlipaFacturado += totalFacturado;
                            me.ValorTotalProlipaCobrado += totalCobrado;
                            me.ValorTotalProlipaPendiente += parseFloat(item.valorPendiente);
    
                            // Mostrar con dos decimales
                            item.totalFacturado = totalFacturado.toFixed(2);
                            item.totalCobrado = totalCobrado.toFixed(2);
                        });
    
                        // Calcular el valor pendiente en Calmed
                        me.arrayDatosFacturado.datosCalmed.forEach(item => {
                            // Asegurarse de que totalFacturado y totalCobrado sean números
                            const totalFacturado = parseFloat(item.totalFacturado) || 0;
                            const totalCobrado = parseFloat(item.totalCobrado) || 0;
    
                            // Calcular el valor pendiente y asegurarse de que es un número
                            item.valorPendiente = (totalFacturado - totalCobrado).toFixed(2);
    
                            // Acumular los totales
                            me.ValorTotalCalmedFacturado += totalFacturado;
                            me.ValorTotalCalmedCobrado += totalCobrado;
                            me.ValorTotalCalmedPendiente += parseFloat(item.valorPendiente);
    
                            // Mostrar con dos decimales
                            item.totalFacturado = totalFacturado.toFixed(2);
                            item.totalCobrado = totalCobrado.toFixed(2);
                        });
    
                        const noDatosProlipa = me.arrayDatosFacturado['datosProlipa'].length === 0;
                        const noDatosCalmed = me.arrayDatosFacturado['datosCalmed'].length === 0;
    
                        if (noDatosProlipa && noDatosCalmed) {
                            this.$vs.notify({
                                title: 'SIN DATOS',
                                text: 'No hay datos para el año seleccionado.',
                                type: 'error',
                                color: 'danger',
                            });
                        }
    
                        me.$vs.loading.close();
                    })
                    .catch((err) => {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Hubo un problema al cargar los datos.',
                            type: 'error',
                        });
                        me.$vs.loading.close();
                    });
            },
            exportarExcel(empresa) {
                // Obtener los datos correspondientes según la empresa
                const data = empresa === 'Prolipa' ? this.arrayDatosFacturado['datosProlipa'] : this.arrayDatosFacturado['datosCalmed'];
    
                // Definir los encabezados (headers) para la exportación
                const headers = ['Cedula/Ruc', 'Cliente', 'Empresa', 'Punto de despacho', 'Total Facturado', 'Total Cobrado', 'Total Nota de Credito', 'Total Pendiente'];
    
                // Crear un array para los datos que se exportarán
                const exportData = [];
    
                // Iterar sobre los datos y formar las filas
                data.forEach(item => {
                    const row = [
                        item.cedula || '', // Cedula/Ruc
                        item.cliente || '', // Cliente
                        item.empresa || '', // Empresa
                        item.nombreInstitucion || '', // Punto de despacho
                        item.totalFacturado || 0, // Total Facturado
                        item.totalCobrado || 0, // Total Cobrado
                        item.totalNotasCredito || 0, // Total Nota de Credito
                        (item.totalFacturado - item.totalCobrado).toFixed(2) || 0 // Total Pendiente
                    ];
                    exportData.push(row);
                });
    
                // Crear una hoja de trabajo a partir de los datos y los encabezados
                const ws = XLSX.utils.aoa_to_sheet([headers, ...exportData]);
    
                // Crear un libro de trabajo
                const wb = XLSX.utils.book_new();
    
                // Añadir la hoja al libro de trabajo
                XLSX.utils.book_append_sheet(wb, ws, `${empresa}-${this.selectedYear}`);
    
                // Escribir el archivo Excel
                XLSX.writeFile(wb, `Reporte_${empresa}_${this.selectedYear}.xlsx`);
            },
    
            buscarCuentasXCobrar({
                startDate,
                endDate,
                fechaTipo,
                year
            }) {
                let me = this;
                me.arrayDatosFacturado = [];
                me.$vs.loading();
    
                // Verificar si fechaTipo está presente sin un año o rango de fechas
                if (fechaTipo && !year && (!startDate || !endDate)) {
                    me.$vs.notify({
                        type: 'error',
                        text: 'El tipo de fecha debe ir acompañado de un año o un rango de fechas.',
                    });
                    me.$vs.loading.close();
                    return;
                }
    
                // Construir la URL de la solicitud dependiendo de los parámetros recibidos
                let url = `${this.$server_url}obtenerCuentasXCobrar?`;
    
                // Si se pasa un año, lo añadimos a la URL
                if (year) {
                    url += `year=${year}`;
                    // Si hay fechaTipo, lo añadimos a la URL
                    if (fechaTipo) {
                        url += `&tipoFecha=${fechaTipo}`;
                    }
                }
                // Si hay un rango de fechas, lo añadimos
                else if (startDate && endDate) {
                    url += `rangoInicio=${startDate}&rangoFin=${endDate}`;
    
                    // Si hay fechaTipo, lo añadimos a la URL
                    if (fechaTipo) {
                        url += `&tipoFecha=${fechaTipo}`;
                    }
    
                }
                // Si no se pasa ni año ni rango de fechas, mostramos un error
                else {
                    me.$vs.notify({
                        type: 'error',
                        text: 'Seleccione un año o un rango de fechas.',
                    });
                    me.$vs.loading.close();
                    return;
                }
    
                // Hacer la solicitud HTTP
                this.$http.get(url)
                    .then((res) => {
                        let datos = res.data;
                        me.arrayDatosFacturado = {
                            datosProlipa: datos.prolipa || [],
                            datosCalmed: datos.calmed || []
                        };
    
                        // Lógica de cálculo para Prolipa
                        me.arrayDatosFacturado.datosProlipa.forEach(item => {
                            const totalFacturado = parseFloat(item.totalFacturado);
                            const totalCobrado = parseFloat(item.totalCobrado);
                            const totalNotasCredito = parseFloat(item.totalNotasCredito);
                            item.valorPendiente = (totalFacturado - totalCobrado - totalNotasCredito).toFixed(2);
    
                            me.ValorTotalProlipaFacturado += totalFacturado;
                            me.ValorTotalProlipaCobrado += totalCobrado;
                            me.ValorTotalProlipaPendiente += parseFloat(item.valorPendiente);
    
                            item.totalFacturado = totalFacturado.toFixed(2);
                            item.totalCobrado = totalCobrado.toFixed(2);
                            item.totalNotasCredito = totalNotasCredito.toFixed(2);
                        });
    
                        // Lógica de cálculo para Calmed
                        me.arrayDatosFacturado.datosCalmed.forEach(item => {
                            const totalFacturado = parseFloat(item.totalFacturado);
                            const totalCobrado = parseFloat(item.totalCobrado);
                            const totalNotasCredito = parseFloat(item.totalNotasCredito);
                            item.valorPendiente = (totalFacturado - totalCobrado - totalNotasCredito).toFixed(2);
    
                            me.ValorTotalCalmedFacturado += totalFacturado;
                            me.ValorTotalCalmedCobrado += totalCobrado;
                            me.ValorTotalCalmedPendiente += parseFloat(item.valorPendiente);
    
                            item.totalFacturado = totalFacturado.toFixed(2);
                            item.totalCobrado = totalCobrado.toFixed(2);
                            item.totalNotasCredito = totalNotasCredito.toFixed(2);
                        });
    
                        // Verificar si no hay datos
                        const noDatosProlipa = me.arrayDatosFacturado['datosProlipa'].length === 0;
                        const noDatosCalmed = me.arrayDatosFacturado['datosCalmed'].length === 0;
    
                        if (noDatosProlipa && noDatosCalmed) {
                            this.$vs.notify({
                                title: 'SIN DATOS',
                                text: 'No hay datos para la búsqueda realizada.',
                                type: 'error',
                                color: 'danger',
                            });
                        }
    
                        me.$vs.loading.close();
                    })
                    .catch((err) => {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Hubo un problema al cargar los datos.',
                            type: 'error',
                        });
                        me.$vs.loading.close();
                    });
            },
    
        }
    };
    </script>
    
    <style scoped>
    .libros-prolipa,
    .libros-calmed {
        flex: 1;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin: 10px;
    }
    </style>
    