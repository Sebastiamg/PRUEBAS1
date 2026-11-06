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
                        <b class="card-title">Valor Cobrado en Prolipa</b>
                        <b class="text-primary font-weight-bold">
                            {{ selectedDocumentType === 'todo' ? ValorTotalProlipa : getFilteredTotalProlipa() | filtrarDecimal }}
                        </b>
                    </div>
                </div>
            </div>
            <div class="w-1/3 p-4">
                <div class="card card-statistics">
                    <div class="card-body flex flex-col justify-center items-center">
                        <b class="card-title">Valor Cobrado en Calmed</b>
                        <b class="text-warning font-weight-bold">
                            {{ selectedDocumentType === 'todo' ? ValorTotalCalmed : getFilteredTotalCalmed() | filtrarDecimal }}
                        </b>
                    </div>
                </div>
            </div>
            <div class="w-1/3 p-4">
                <div class="card card-statistics">
                    <div class="card-body flex flex-col justify-center items-center">
                        <b class="card-title">Total General Cobrado</b>
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
                    <span class="mr-3"><b>Cantidad Abonos:</b> {{ filteredDataProlipa.length }}</span>
                    <span class="mr-3"><b>Total valor:</b> {{ selectedDocumentType === 'todo' ? ValorTotalProlipa : getFilteredTotalProlipa() | filtrarDecimal }}</span>
                    <TableReutilizableVue :title="''" :ifexportar="Number(1)" :nombrearchivo="'Cobrado' + '-Prolipa-' + selectedYear" :headers="['N° Cuenta', 'N° Documento', 'Valor Notas', 'Valor facturas', 'Fecha Abono', 'Ruc', 'Concepto', 'Institucion/Libreria']" :fieldKeys="['cue_pag_numero', 'abono_documento', 'abono_notas', 'abono_facturas','abono_fecha', 'abono_ruc_cliente', 'abono_concepto', 'institucion']" :tableData="filteredDataProlipa" />
                </div>

                <!-- Calmed Section -->
                <div class="libros-calmed" v-if="filteredDataCalmed.length > 0" :class="{ 'w-full': filteredDataProlipa.length === 0, 'w-1/2': filteredDataProlipa.length > 0 }">
                    <vs-divider>Calmed</vs-divider>
                    <span class="mr-3"><b>Cantidad Abonos:</b> {{ filteredDataCalmed.length }}</span>
                    <span class="mr-3"><b>Total valor:</b> {{ selectedDocumentType === 'todo' ? ValorTotalCalmed : getFilteredTotalCalmed() | filtrarDecimal }}</span>
                    <TableReutilizableVue :title="''" :ifexportar="Number(1)" :nombrearchivo="'Cobrado' + '-Calmed-' + selectedYear" :headers="['N° Cuenta', 'N° Documento', 'Valor Notas', 'Valor facturas', 'Fecha Abono', 'Ruc', 'Concepto', 'Institucion/Libreria']" :fieldKeys="['cue_pag_numero', 'abono_documento', 'abono_notas', 'abono_facturas','abono_fecha', 'abono_ruc_cliente', 'abono_concepto', 'institucion']" :tableData="filteredDataCalmed" />
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
            arrayDatosCobrado: {
                datosProlipa: {},
                datosCalmed: {}
            },
            selectedYear: '',
            selectedDocumentType: 'todo',
            filteredDataProlipa: [],
            filteredDataCalmed: [],
            ValorTotalProlipa: 0,
            ValorTotalCalmed: 0,
            totalFacturasProlipa: 0,
            totalNotasProlipa: 0,
            totalFacturasCalmed: 0,
            totalNotasCalmed: 0,
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
                this.selectedDocumentType = 'todo';
                this.$vs.notify({
                    type: 'error',
                    text: 'Seleccione el año.'
                });
                return;
            }

            this.$vs.loading();
            setTimeout(() => {
                this.selectedDocumentType = 'todo';
                this.$nextTick(() => {
                    this.getCobradoXyear(this.selectedYear);
                });
                this.$vs.loading.close();
            }, 1000);
        },
        getCobradoXyear(year) {
            this.arrayDatosCobrado = [];
            this.ValorTotalProlipa = 0;
            this.ValorTotalCalmed = 0;
            this.selectedDocumentType = 'todo';

            this.$vs.loading();

            this.$http.get(this.$apiIluminar + `pedidos2/pedidos?getCobradoXyear=1&year=${year}`)
                .then(res => {
                    this.arrayDatosCobrado = res.data;

                    this.totalFacturasProlipa = this.arrayDatosCobrado.reduce((acc, item) => {
                        if (item.abono_empresa == 1) {
                            return acc + parseFloat(item.abono_facturas || 0);
                        }
                        return acc;
                    }, 0);

                    this.totalNotasProlipa = this.arrayDatosCobrado.reduce((acc, item) => {
                        if (item.abono_empresa == 1) {
                            return acc + parseFloat(item.abono_notas || 0);
                        }
                        return acc;
                    }, 0);

                    this.totalFacturasCalmed = this.arrayDatosCobrado.reduce((acc, item) => {
                        if (item.abono_empresa == 3) {
                            return acc + parseFloat(item.abono_facturas || 0);
                        }
                        return acc;
                    }, 0);

                    this.totalNotasCalmed = this.arrayDatosCobrado.reduce((acc, item) => {
                        if (item.abono_empresa == 3) {
                            return acc + parseFloat(item.abono_notas || 0);
                        }
                        return acc;
                    }, 0);

                    this.ValorTotalProlipa = this.totalFacturasProlipa + this.totalNotasProlipa;
                    this.ValorTotalCalmed = this.totalFacturasCalmed + this.totalNotasCalmed;

                    this.filteredDataProlipa = this.arrayDatosCobrado.filter(item => item.abono_empresa === 1);
                    this.filteredDataCalmed = this.arrayDatosCobrado.filter(item => item.abono_empresa === 2);
                    
                    this.filterData();
                    
                    this.$vs.loading.close();
                })
                .catch(err => {
                    this.$vs.loading.close();
                    console.error(err);
                });
        },
        filterData() {
            if (this.selectedDocumentType === 'todo') {
                this.filteredDataProlipa = this.arrayDatosCobrado.filter(item => item.abono_empresa === 1);
                this.filteredDataCalmed = this.arrayDatosCobrado.filter(item => item.abono_empresa === 3);
            } else if (this.selectedDocumentType === 'notas') {
                this.filteredDataProlipa = this.arrayDatosCobrado.filter(item => item.abono_empresa === 1 && item.abono_notas > 0);
                this.filteredDataCalmed = this.arrayDatosCobrado.filter(item => item.abono_empresa === 3 && item.abono_notas > 0);
            } else if (this.selectedDocumentType === 'facturas') {
                this.filteredDataProlipa = this.arrayDatosCobrado.filter(item => item.abono_empresa === 1 && item.abono_facturas > 0);
                this.filteredDataCalmed = this.arrayDatosCobrado.filter(item => item.abono_empresa === 3 && item.abono_facturas > 0);
            }
        },
        getFilteredTotalProlipa() {
            return this.filteredDataProlipa.reduce((acc, item) => acc + parseFloat(item.abono_notas || 0) + parseFloat(item.abono_facturas || 0), 0);
        },
        getFilteredTotalCalmed() {
            return this.filteredDataCalmed.reduce((acc, item) => acc + parseFloat(item.abono_notas || 0) + parseFloat(item.abono_facturas || 0), 0);
        }
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
