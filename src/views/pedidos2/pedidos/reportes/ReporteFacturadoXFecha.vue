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
                <!-- <div class="mb-2">
                    <label class="block">
                        Empresa:
                        <v-select :options="listaEmpresas" :reduce="(listaEmpresas) => listaEmpresas.id" density="comfortable" label="nombre" class="w-full" value="id" @input="selectedYear=''" placeholder="--Seleccione--" v-model="empresa" />
                        <span v-if="!empresa" style="color: red;">Seleccione la empresa.</span>
                    </label>
                </div> -->
                <div>
                    <label class="block">
                        Año:
                        <v-select :options="arrayYear" :reduce="year => year.valor" label="year" class="w-full" v-model="selectedYear" @input="busquedaXYear();"  placeholder="Selecciona un año" />
                        <span v-if="!selectedYear" style="color: red;">Seleccione el año.</span>
                    </label>
                </div>
            </div>
        </div>
        <div>
            <div class="row flex justify-center w-full">
                <div class="w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                    <div class="card card-statistics">
                        <div class="card-body flex flex-col justify-center items-center">
                            <b class="card-title">Valor Facturado en Prolipa</b>
                            <b class="text-primary font-weight-bold">{{ ValorTotalProlipa | filtrarDecimal }}</b>
                        </div>
                    </div>
                </div>
                <div class="w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                    <div class="card card-statistics">
                        <div class="card-body flex flex-col justify-center items-center">
                            <b class="card-title">Valor Facturado en Calmed</b>
                            <b class="text-warning font-weight-bold">{{ ValorTotalCalmed | filtrarDecimal }}</b>
                        </div>
                    </div>
                </div>
                <div class="w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
                    <div class="card card-statistics">
                        <div class="card-body flex flex-col justify-center items-center">
                            <b class="card-title">Total General Facturado</b>
                            <b class="text-success font-weight-bold">{{ (ValorTotalProlipa + ValorTotalCalmed) | filtrarDecimal }}</b>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="(arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].detalles && arrayDatosFacturado['datosProlipa'].detalles.length > 0) || 
                        (arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].detalles && arrayDatosFacturado['datosCalmed'].detalles.length > 0)">
                <div class="w-full flex">
                    <div class="libros-prolipa" v-if="arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].detalles && arrayDatosFacturado['datosProlipa'].detalles.length > 0" 
                        :class="{ 'w-full': !(arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].detalles && arrayDatosFacturado['datosCalmed'].detalles.length), 'w-1/2': arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].detalles && arrayDatosFacturado['datosCalmed'].detalles.length > 0 }">
                        <vs-divider>Prolipa</vs-divider>
                        <span class="mr-3"><b>Cantidad libros:</b> {{ arrayDatosFacturado['datosProlipa'].detalles.length }}</span>
                        <span><b>Total valor:</b> {{ ValorTotalProlipa | filtrarDecimal }}</span>
                        <TableReutilizableVue
                            :ifexportar="Number(1)"
                            :nombrearchivo="'Facturado' + '-Prolipa-' + selectedYear"
                            :title="''"
                            :headers="['Libro', 'Código', 'Cantidad', 'Precio unitario', 'Precio total']"
                            :fieldKeys="['libro', 'pro_codigo', 'cantidad', 'precio_unitario', 'total']"
                            :tableData="arrayDatosFacturado['datosProlipa'].detalles"
                        />
                    </div>

                    <div class="libros-calmed" v-if="arrayDatosFacturado['datosCalmed'] && arrayDatosFacturado['datosCalmed'].detalles && arrayDatosFacturado['datosCalmed'].detalles.length > 0" 
                        :class="{ 'w-full': !(arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].detalles && arrayDatosFacturado['datosProlipa'].detalles.length), 'w-1/2': arrayDatosFacturado['datosProlipa'] && arrayDatosFacturado['datosProlipa'].detalles && arrayDatosFacturado['datosProlipa'].detalles.length > 0 }">
                        <vs-divider>Calmed</vs-divider>
                        <span class="mr-3"><b>Cantidad libros:</b> {{ arrayDatosFacturado['datosCalmed'].detalles.length }}</span>
                        <span><b>Total valor:</b> {{ ValorTotalCalmed | filtrarDecimal }}</span>
                        <TableReutilizableVue
                            :ifexportar="Number(1)"
                            :nombrearchivo="'Facturado' + '-Calmed-' + selectedYear"
                            :title="''"
                            :headers="['Libro', 'Código', 'Cantidad', 'Precio unitario', 'Precio total']"
                            :fieldKeys="['libro', 'pro_codigo', 'cantidad', 'precio_unitario', 'total']"
                            :tableData="arrayDatosFacturado['datosCalmed'].detalles"
                        />
                    </div>
                </div>
            </div>

            
        </div>
    </div>
</template>
<script>
import VSelect from 'vue-select';
import Generalmix from '@/mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
    mixins: [Generalmix],
    components: {
        VSelect,
        TableReutilizableVue
    },
    data() {
        return {
            arrayYear: [],
            arrayDatosFacturado: [],
            selectedYear: '',
            empresa:'',
            listaEmpresas: [],
            ValorTotalProlipa: 0,
            ValorTotalCalmed: 0,
        }
    },
    created() { // Llama a generateYears en created
        this.arrayYear = this.generateYears();
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0
        },
        nombrePeriodo: {
            type: String,
            default: ''
        },
        yearExterno: {
            type: String,
            default: null
        }
    },
    mounted() {
        let me = this;
        me.getEmpresas();
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
            let me = this;
            me.listaEmpresas = [];
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data;
                    me.listaEmpresas = me.listaEmpresas.filter(empresa => empresa.id !== 2);
                })
                .catch(err => {
                    console.error(err);
                });
        },      
        generateYears() {
            const currentYear = new Date().getFullYear();
            const startYear = 2023;
            return Array.from({ length: currentYear + 1 - startYear + 1 }, (v, i) => ({
                year: startYear + i,
                valor: (startYear + i).toString()
            }));
        },
        busquedaXYear(){
            let me = this
            if (!me.selectedYear) {
                me.$vs.notify({
                    type: 'error',
                    text: 'Seleccione el año.'
                });
                me.selectedYear='';
                me.arrayDatosFacturado=[];
                return;
            }
            // if (!me.empresa) {
            //     me.$vs.notify({
            //         type: 'error',
            //         text: 'Debe seleccionar una empresa.'
            //     });
            //     me.empresa='';
            //     me.selectedYear='';
            //     return;
            // }
            // if (!me.selectedYear) {
            //     me.$vs.notify({
            //         type: 'error',
            //         text: 'Seleccione la empresa y el año.'
            //     });
            //     me.empresa='';
            //     me.selectedYear='';
            //     return;
            // }
           
            me.$vs.loading()
            setTimeout(()=>{
                // console.log("cambio de year",me.selectedYear);
                me.getInfoFacturadoXyear(me.selectedYear,me.empresa);
                me.$vs.loading.close()
            },1000)
        },
        getInfoFacturadoXyear(year, empresa) {
            let me = this;
            me.arrayDatosFacturado = [];
            me.ValorTotalProlipa = 0;
            me.ValorTotalCalmed = 0;
            me.$vs.loading();

            this.$http.get(this.$server_url + `pedidos2/pedidos?getInfoFacturadoXyear=1&year=${year}`)
                .then((res) => {
                    let datos = res.data;
                    me.arrayDatosFacturado = {
                        datosProlipa: datos.datosProlipa || { detalles: [] },
                        datosCalmed: datos.datosCalmed || { detalles: [] }
                    };

                    const noDatosProlipa = me.arrayDatosFacturado['datosProlipa'].detalles.length === 0;
                    const noDatosCalmed = me.arrayDatosFacturado['datosCalmed'].detalles.length === 0;

                    if (noDatosProlipa && noDatosCalmed) {
                        this.$vs.notify({
                            title: 'SIN DATOS',
                            text: 'No hay datos para el año seleccionado.',
                            type: 'error',
                            color: 'danger',
                        });
                    } else if (!noDatosProlipa && noDatosCalmed) {
                        this.$vs.notify({
                            title: 'Información',
                            text: 'Hay datos disponibles en Prolipa, pero no en Calmed.',
                            type: 'info',
                        });
                    } else if (noDatosProlipa && !noDatosCalmed) {
                        this.$vs.notify({
                            title: 'Información',
                            text: 'Hay datos disponibles en Prolipa, pero no en Calmed.',
                            type: 'info',
                        });
                    }
                    
                    me.ValorTotalProlipa = me.arrayDatosFacturado['datosProlipa'].ventaBruta?me.arrayDatosFacturado['datosProlipa'].ventaBruta:0;
                    me.ValorTotalCalmed = me.arrayDatosFacturado['datosCalmed'].ventaBruta?me.arrayDatosFacturado['datosCalmed'].ventaBruta:0;

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los datos.',
                        type: 'error',
                    });
                });
        },
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
