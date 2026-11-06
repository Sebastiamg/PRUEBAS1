<template>
<div class="flex flex-col mt-5">
    <!-- Solo mostrar búsqueda interna si NO viene yearExterno del padre -->
    <div v-if="!yearExterno" class="flex flex-col md:flex-row">
        <div class="flex items-center w-full md:w-1/3 mb-2 md:mb-0">
            <p>
                <ion-icon name="contract-outline"></ion-icon> Busqueda por Año
            </p>
        </div>
        <div class="w-full md:w-2/3">
            <div>
                <label class="block">
                    Año:
                    <v-select :options="arrayYear" :reduce="year => year.valor" label="year" class="w-full" v-model="selectedYear" @input="busquedaXYear();" placeholder="Selecciona un año" />
                    <span v-if="!selectedYear" style="color: red;">Seleccione el año.</span>
                </label>
            </div>
        </div>
    </div>

    <div v-if="selectedYear">
        <ul class="centerx my-4 flex align-items-center">
            <li class="mx-2">MOSTRAR :</li>
            <li class="mx-2">
                <vs-radio v-model="selectedDocumentType" vs-value="todo" @change="filterData">
                    <i class="fas fa-list"></i> TODO
                </vs-radio>
            </li>
            <li class="mx-2">
                <vs-radio color="success" v-model="selectedDocumentType" vs-value="notas" @change="filterData">
                    SOLO NOTAS
                </vs-radio>
            </li>
            <li class="mx-2">
                <vs-radio color="danger" v-model="selectedDocumentType" vs-value="actas" @change="filterData">
                    SOLO ACTAS
                </vs-radio>
            </li>
            <li class="mx-2">
                <vs-radio color="warning" v-model="selectedDocumentType" vs-value="facturas" @change="filterData">
                    SOLO PRE-FACTURAS
                </vs-radio>
            </li>
        </ul>
    </div>

    <div>
        <div class="row flex justify-center w-full">
            <div class="w-1/3 p-4">
                <div class="card card-statistics">
                    <div class="card-body flex flex-col justify-center items-center">
                        <b class="card-title">Valor Facturado en Prolipa</b>
                        <b class="text-primary font-weight-bold">
                            {{ selectedDocumentType === 'todo' ? ValorTotalProlipa : getFilteredTotalProlipa() | filtrarDecimal }}
                        </b>
                    </div>
                </div>
            </div>
            <div class="w-1/3 p-4">
                <div class="card card-statistics">
                    <div class="card-body flex flex-col justify-center items-center">
                        <b class="card-title">Valor Facturado en Calmed</b>
                        <b class="text-warning font-weight-bold">
                            {{ selectedDocumentType === 'todo' ? ValorTotalCalmed : getFilteredTotalCalmed() | filtrarDecimal }}
                        </b>
                    </div>
                </div>
            </div>
            <div class="w-1/3 p-4">
                <div class="card card-statistics">
                    <div class="card-body flex flex-col justify-center items-center">
                        <b class="card-title">Total General Facturado</b>
                        <b class="text-success font-weight-bold">
                            {{ (selectedDocumentType === 'todo' ? (ValorTotalProlipa + ValorTotalCalmed) : (getFilteredTotalCalmed() + getFilteredTotalProlipa())) | filtrarDecimal }}
                        </b>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="(filteredDataProlipa.length > 0 || filteredDataCalmed.length > 0)">
            <div class="w-full flex">
                <!-- Prolipa Section -->
                <div class="libros-prolipa" v-if="filteredDataProlipa.length > 0" :class="{ 'w-full': filteredDataCalmed.length === 0, 'w-1/2': filteredDataCalmed.length > 0 }">
                    <vs-divider>Prolipa</vs-divider>
                    <span class="mr-3"><b>Cantidad libros:</b> {{ filteredDataProlipa.length }}</span>
                    <span class="mr-3"><b>Total valor:</b> {{ selectedDocumentType === 'todo' ? ValorTotalProlipa : getFilteredTotalProlipa() | filtrarDecimal }}</span>
                    <span><b>Total pendiente:</b> {{ totalPendienteProlipa | filtrarDecimal }}</span> <!-- Total pendiente -->
                    <TableReutilizableVue :title="''" :ifexportar="Number(1)" :nombrearchivo="'Facturado' + '-Prolipa-' + selectedYear" :headers="['Libro', 'Código', 'Cantidad', 'Precio unitario', 'Precio total', 'Cantidad facturada', 'Total Pendiente']" :fieldKeys="['libro', 'pro_codigo', 'cantidad','precio_unitario', 'total', 'cantidad_facturada', 'total_pendiente']" :tableData="filteredDataProlipa" />
                </div>

                <!-- Calmed Section -->
                <div class="libros-calmed" v-if="filteredDataCalmed.length > 0" :class="{ 'w-full': filteredDataProlipa.length === 0, 'w-1/2': filteredDataProlipa.length > 0 }">
                    <vs-divider>Calmed</vs-divider>
                    <span class="mr-3"><b>Cantidad libros:</b> {{ filteredDataCalmed.length }}</span>
                    <span class="mr-3"><b>Total valor:</b>{{ selectedDocumentType === 'todo' ? ValorTotalCalmed : getFilteredTotalCalmed() | filtrarDecimal }}</span>
                    <span><b>Total pendiente:</b> {{ totalPendienteCalmed | filtrarDecimal }}</span> <!-- Total pendiente -->
                    <TableReutilizableVue :title="''" :ifexportar="Number(1)" :nombrearchivo="'Facturado' + '-Calmed-' + selectedYear" :headers="['Libro', 'Código', 'Cantidad', 'Precio unitario', 'Precio total', 'Cantidad facturada', 'Total Pendiente']" :fieldKeys="['libro', 'pro_codigo', 'cantidad', 'precio_unitario', 'total', 'cantidad_facturada', 'total_pendiente' ]" :tableData="filteredDataCalmed" />
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import VSelect from 'vue-select';
import Generalmix from '@/mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue');

export default {
    mixins: [Generalmix],
    components: {
        VSelect,
        TableReutilizableVue
    },
    data() {
        return {
            arrayYear: [],
            arrayDatosFacturado: {
                datosProlipa: {
                    documentos: {
                        facturas: {
                            detalles: []
                        },
                        actas: {
                            detalles: []
                        },
                        notas: {
                            detalles: []
                        }
                    }
                },
                datosCalmed: {
                    documentos: {
                        facturas: {
                            detalles: []
                        },
                        actas: {
                            detalles: []
                        },
                        notas: {
                            detalles: []
                        }
                    }
                }
            },
            selectedYear: '',
            selectedDocumentType: 'todo',
            filteredDataProlipa: [],
            filteredDataCalmed: [],
            ValorTotalProlipa: 0,
            ValorTotalCalmed: 0,
        };
    },
    created() {
        this.arrayYear = this.generateYears();
    },
    props: {
        yearExterno: {
            type: String,
            default: null
        }
    },
    mounted() {
        this.getEmpresas();
        // Si viene yearExterno del padre, cargar datos automáticamente
        if (this.yearExterno) {
            this.selectedYear = this.yearExterno;
            this.busquedaXYear();
        }
    },
    watch: {
        // Observar cambios en yearExterno para recargar datos
        yearExterno(newYear) {
            if (newYear) {
                this.selectedYear = newYear;
                this.busquedaXYear();
            }
        }
    },
    methods: {
        getEmpresas() {
            this.$http.get(this.$apiIluminar+ 'empresa')
                .then(res => {
                    this.listaEmpresas = res.data.filter(empresa => empresa.id !== 2);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        generateYears() {
            const currentYear = new Date().getFullYear();
            const startYear = 2023;
            return Array.from({
                length: currentYear + 1 - startYear + 1
            }, (v, i) => ({
                year: startYear + i,
                valor: (startYear + i).toString()
            }));
        },
        busquedaXYear() {
            if (!this.selectedYear) {
                this.selectedYear = '';
                this.selectedDocumentType = 'todo'; // Reiniciar a 'todo'
                this.$vs.notify({
                    type: 'error',
                    text: 'Seleccione el año.'
                });
                return;
            }

            this.$vs.loading();
            setTimeout(() => {
                this.selectedDocumentType = 'todo'; // Reiniciar a 'todo' aquí también
                this.$nextTick(() => {
                    this.getInfoFacturadoXyear(this.selectedYear);
                });
                this.$vs.loading.close();
            }, 1000);
        },
        getInfoFacturadoXyear(year) {
            this.arrayDatosFacturado = [];
            this.ValorTotalProlipa = 0;
            this.ValorTotalCalmed = 0;
            this.selectedDocumentType = 'todo';

            this.$vs.loading();

            this.$http.get(this.$apiIluminar+ `pedidos2/pedidos?getInfoVendidoFacturadoXyear=1&year=${year}`)
                .then(res => {
                    this.arrayDatosFacturado = res.data;
                    this.ValorTotalProlipa = this.arrayDatosFacturado['datosProlipa'].ventaBruta || 0;
                    this.ValorTotalCalmed = this.arrayDatosFacturado['datosCalmed'].ventaBruta || 0;

                    this.filterData();
                    this.$vs.loading.close();
                })
                .catch((err) => {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los datos.',
                        type: 'error'
                    });
                });
        },
        filterData() {
            const {
                datosProlipa,
                datosCalmed
            } = this.arrayDatosFacturado;

            let dataToShowProlipa = [];
            let dataToShowCalmed = [];

            let totalPendienteP = 0; // Inicializar el total pendiente para Prolipa
            let totalPendienteC = 0; // Inicializar el total pendiente para Calmed

            if (this.selectedDocumentType === 'todo') {
                if (datosProlipa.documentos) {
                    dataToShowProlipa = [
                    ...(datosProlipa.documentos.facturas && datosProlipa.documentos.facturas.detalles ? datosProlipa.documentos.facturas.detalles : []),
                        ...(datosProlipa.documentos.actas && datosProlipa.documentos.actas.detalles ? datosProlipa.documentos.actas.detalles : []),
                        ...(datosProlipa.documentos.notas && datosProlipa.documentos.notas.detalles ? datosProlipa.documentos.notas.detalles : []),
                    ];
                    // Sumar total pendiente de Prolipa
                    this.totalPendienteProlipa = dataToShowProlipa.reduce((acc, item) => {
                        return acc + parseFloat(item.total_pendiente || 0);
                    }, 0);
                }

                if (datosCalmed.documentos) {
                    dataToShowCalmed = [
                        ...(datosCalmed.documentos.facturas && datosCalmed.documentos.facturas.detalles ? datosCalmed.documentos.facturas.detalles : []),
                        ...(datosCalmed.documentos.actas && datosCalmed.documentos.actas.detalles ? datosCalmed.documentos.actas.detalles : []),
                        ...(datosCalmed.documentos.notas && datosCalmed.documentos.notas.detalles ? datosCalmed.documentos.notas.detalles : []),
                    ];

                    // Sumar total pendiente de Calmed
                    this.totalPendienteCalmed = dataToShowCalmed.reduce((acc, item) => {
                        return acc + parseFloat(item.total_pendiente || 0);
                    }, 0);
                }
            } else if (this.selectedDocumentType === 'facturas') {
                dataToShowProlipa = [...(datosProlipa.documentos[this.selectedDocumentType] && datosProlipa.documentos[this.selectedDocumentType].detalles ? datosProlipa.documentos[this.selectedDocumentType].detalles : [])];
                dataToShowCalmed = [...(datosCalmed.documentos[this.selectedDocumentType] && datosCalmed.documentos[this.selectedDocumentType].detalles ? datosCalmed.documentos[this.selectedDocumentType].detalles : [])];

                this.totalPendienteProlipa = dataToShowProlipa.reduce((acc, item) => {
                        return acc + parseFloat(item.total_pendiente || 0);
                }, 0);// Redondear al final

                // Sumar total pendiente de Calmed
                this.totalPendienteCalmed = dataToShowCalmed.reduce((acc, item) => {
                        return acc + parseFloat(item.total_pendiente || 0);
                    }, 0);

            } else if (this.selectedDocumentType === 'notas' || this.selectedDocumentType === 'actas') {
                // Para notas y actas, no se realiza el cálculo del total pendiente
                dataToShowProlipa = [...(datosProlipa.documentos[this.selectedDocumentType] && datosProlipa.documentos[this.selectedDocumentType].detalles ? datosProlipa.documentos[this.selectedDocumentType].detalles : [])];
                dataToShowCalmed = [...(datosCalmed.documentos[this.selectedDocumentType] && datosCalmed.documentos[this.selectedDocumentType].detalles ? datosCalmed.documentos[this.selectedDocumentType].detalles : [])];

                // // No calcular total pendiente para notas o actas
                // dataToShowProlipa = dataToShowProlipa.map(item => ({
                //     ...item,
                //     total_pendiente: 0
                // }));
                // this.totalPendienteProlipa = 0;

                // dataToShowCalmed = dataToShowCalmed.map(item => ({
                //     ...item,
                //     total_pendiente: 0
                // }));
                // this.totalPendienteCalmed = 0;
                this.totalPendienteProlipa = dataToShowProlipa.reduce((acc, item) => {
                        return acc + parseFloat(item.total_pendiente || 0);
                }, 0);// Redondear al final

                // Sumar total pendiente de Calmed
                this.totalPendienteCalmed = dataToShowCalmed.reduce((acc, item) => {
                        return acc + parseFloat(item.total_pendiente || 0);
                    }, 0);
            }

            // Asignar los datos filtrados a las variables
            this.filteredDataProlipa = dataToShowProlipa;
            this.filteredDataCalmed = dataToShowCalmed;
        },
        getFilteredTotalProlipa() {
            const {
                datosProlipa
            } = this.arrayDatosFacturado;

            if (this.selectedDocumentType === 'actas') {
                return datosProlipa.documentos.actas.ventaBruta || 0;
            } else if (this.selectedDocumentType === 'notas') {
                return datosProlipa.documentos.notas.ventaBruta || 0;
            } else if (this.selectedDocumentType === 'facturas') {
                return datosProlipa.documentos.facturas.ventaBruta || 0;
            }
            return 0;
        },

        getFilteredTotalCalmed() {
            const {
                datosCalmed
            } = this.arrayDatosFacturado;

            if (this.selectedDocumentType === 'actas') {
                return datosCalmed.documentos.actas.ventaBruta || 0;
            } else if (this.selectedDocumentType === 'notas') {
                return datosCalmed.documentos.notas.ventaBruta || 0;
            } else if (this.selectedDocumentType === 'facturas') {
                return datosCalmed.documentos.facturas.ventaBruta || 0;
            }
            return 0;
        }
    }
}
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
