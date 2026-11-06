<template>
<div class="flex flex-col mt-5">
    <!-- Solo mostrar búsqueda interna si NO viene yearExterno del padre -->
    <div v-if="!yearExterno" class="flex flex-col md:flex-row mb-5">
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
    <vs-table :data="arrayDatosNotasCredito" stripe pagination :max-items="10" search no-data-text="No hay datos disponibles">
        <template slot="header">
            <vs-chip color="primary" class="mr-2">Cantidad {{ arrayDatosNotasCredito.length }}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Detalles</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{ data }">
            <vs-tr v-for="item in data" :key="item.ven_codigo">
                <vs-td>
                    <b>DOCUMENTO: </b>{{ item.ven_codigo }} <br>
                    <b>CEDULA/RUC: </b>{{ item.ruc_cliente }} <br>
                    <b>CLIENTE: </b>{{ item.cliente }} <br>
                    <b>EMPRESA: </b>{{ item.id_empresa == 1 || item.id_empresa == 6 ? 'Prolipa' : 'Calmed' }} <br>
                    <b>LUGAR DE DESPACHO: </b>{{ item.nombreInstitucion }}<br>

                    <b style="color: red;">FECHA NOTA DE CREDITO: {{ item.fecha_notaCredito }}</b><br>

                    <!-- Solo muestra FECHA SRI si existe, sin agregar <br> si no hay valor -->
                    <template v-if="item.fecha_sri">
                        <b class="text-success">FECHA SRI: {{ item.fecha_sri }}</b><br>
                    </template>

                    <!-- Solo muestra DOCUMENTO SRI si existe, sin agregar <br> si no hay valor -->
                    <template v-if="item.documento_sri">
                        <b class="text-success">DOCUMENTO SRI: {{ item.documento_sri }}</b><br>
                    </template>
                </vs-td>
                <vs-td>
                    <div justify="center" align="center">
                        <div justify="center" align="center">
                            <b style="color: red;" v-if="!item.fecha_sri && !item.documento_sri">
                                SIN DOCUMENTO Y FECHA SRI
                            </b>
                            <b style="color: red;" v-else-if="!item.fecha_sri">
                                SIN FECHA SRI
                            </b>
                            <b style="color: red;" v-else-if="!item.documento_sri">
                                SIN DOCUMENTO SRI
                            </b>
                        </div>
                        <div>
                            <b>Fecha creacion: {{ item.ven_fecha }}</b>
                        </div>
                        <vs-button color="primary" @click="abrirNotaCredito(item)">
                            <ion-icon name="document-text-outline"></ion-icon>
                            Ver Nota de Crédito
                        </vs-button>
                        <vs-button color="success" class="items-center mt-4" @click="popupSRI = true; itemSeleccionado = item;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                <path d="M13.5 6.5l4 4" />
                                <path d="M19 16l-2 3h4l-2 3" />
                            </svg>
                            Añadir datos SRI Nota de Crédito
                        </vs-button>
                    </div>

                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <vs-popup fullscreen :active.sync="popupDocumento" v-if="popupDocumento" title="Detalle:">
        <documentoVenta v-if="popupDocumento" :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta" />
    </vs-popup>
    <vs-popup :active.sync="popupSRI" v-if="popupSRI" title="Asociar datos:">
        <DatosSRINotasCredito v-if="popupSRI" :ItemSeleccionado="itemSeleccionado" @documento-no-seleccionado="documentoNoSeleccionado" @actualizado-datos="documentoActualizado" />
    </vs-popup>
</div>
</template>

<script>
import XLSX from 'xlsx';
import vSelect from "vue-select";
import Generalmix from '@/mixins/Generalmix';
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
const DatosSRINotasCredito = () => import('@/views/pedidos2/pedidos/reportes/DatosSRINotasCredito.vue');
import flatPickr from 'vue-flatpickr-component';

export default {
    mixins: [Generalmix],
    components: {
        "v-select": vSelect,
        flatPickr,
        documentoVenta,
        DatosSRINotasCredito
    },
    data() {
        return {
            arrayYear: [],
            selectedYear: '',
            arrayDatosNotasCredito: [],
            DocumentoDetalleVenta: [],
            DocumentoVenta: [],
            popupDocumento: false,
            popupSRI: false,
            itemSeleccionado: {},
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
        };
    },
    created() {
        this.arrayYear = this.generateYears();
    },
    props: {
        empresa: {
            type: Number,
            default: 0
        },
        yearExterno: {
            type: String,
            default: null
        }
    },
    mounted() {
        this.$vs.loading.close();
        // Si viene yearExterno del padre, cargar datos automáticamente
        if (this.yearExterno) {
            this.getNotasCreditoXyear(this.yearExterno);
        }
    },
    watch: {
        // Observar cambios en yearExterno para recargar datos
        yearExterno(newYear) {
            if (newYear) {
                this.getNotasCreditoXyear(newYear);
            }
        }
    },
    methods: {
        documentoNoSeleccionado() {
            this.popupSRI = false;
        },
        documentoActualizado() {
            this.popupSRI = false;
            this.busquedaXYear();
        },
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
            if (!me.selectedYear) {
                me.$vs.notify({
                    type: 'error',
                    text: 'Seleccione el año.'
                });
                me.selectedYear = '';
                me.arrayDatosNotasCredito = [];
                return;
            }
            me.$vs.loading();
            setTimeout(() => {
                me.getNotasCreditoXyear(me.selectedYear);
                me.$vs.loading.close();
            }, 1000);
        },
        getNotasCreditoXyear(year) {
            let me = this;
            console.log(year);
            me.arrayDatosNotasCredito = [];
            me.$vs.loading();

            this.$http.get(this.$server_url + `obtenerNotasCredito?year=${year}&empresa=${this.empresa}`)
                .then((res) => {
                    let datos = res.data;
                    me.arrayDatosNotasCredito = datos;

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
        abrirNotaCredito(item) {
            let me = this;
            console.log(item.ven_codigo);
            this.getDocumentos(item.ven_codigo);
        },
        getDocumentos(documentos) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos + '&empresa=' + this.empresa)
                .then((res) => {
                    me.DocumentoVenta = res.data;
                    if (me.DocumentoVenta.length > 0) {
                        let codigo = me.DocumentoVenta[0].ven_codigo;
                        let empresa = me.DocumentoVenta[0].empresa_id;
                        this.getDocumentosDetalles(codigo, empresa);
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Documento no encontrado.',
                            type: 'error',
                        });
                    }

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        getDocumentosDetalles(codigo, empresa) {
            let me = this;
            // console.log(codigo, empresa,'dsdsadsaddsa');
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
                .then((res) => {
                    this.DocumentoDetalleVenta = res.data;
                    if (this.DocumentoDetalleVenta.length > 0) {
                        this.popupDocumento = true;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Detalle Documento no encontrado.',
                            type: 'error',
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los detalles de los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },

    }
};
</script>
