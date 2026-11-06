<template>
<div class="p-4 space-y-4">
    <!-- Título -->
    <h2 class="text-2xl font-semibold text-gray-700">Consultar Abonos Notas - Cuentas de notas</h2>

    <!-- Select de Cuentas de Pago -->
    <div>
        <label class="block text-sm font-medium text-gray-600">Selecciona una Cuenta de Pago</label>
        <v-select v-model="cuePagSeleccionado" :options="cuentasPago" label="cue_pag_nombre" :reduce="item => item.cue_pag_codigo" placeholder="Seleccionar cuenta" class="mt-2 w-full" @input="limpiarDatos" />
    </div>

    <!-- Fechas de Inicio y Fin -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label class="block text-sm font-medium text-gray-600">Fecha de Inicio</label>
            <flat-pickr :config="configdateTimePicker" v-model="fechaInicio" placeholder="Fecha de inicio" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md" @input="limpiarDatos" />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-600">Fecha de Fin</label>
            <flat-pickr :config="configdateTimePicker" v-model="fechaFin" placeholder="Fecha de fin" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md" @input="limpiarDatos" />
        </div>
    </div>

    <!-- Botón para enviar la consulta -->
    <vs-button @click="obtenerAbonos" color="primary" class="w-full sm:w-auto mt-4">
        Obtener Abonos
    </vs-button>

    <!-- Mostrar los resultados -->
    <div v-if="abonos.length > 0" class="mt-6">
        <vs-table max-items="10" pagination search :data="abonos">
            <template slot="header">
                <div class="flex items-center">
                    <h5><b>Total Abono:</b> {{ totalDescuento | filtrarDecimal }}</h5>
                    <vs-button @click="downloadReportAbonos" color="success" class="w-full sm:w-auto mx-4" icon-pack="feather" icon="icon-file-text">
                        Exportar a Excel 
                    </vs-button>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="abono_id">N° ABONO</vs-th>
                <vs-th sort-key="cue_pag_nombre">NOM. CUENTA</vs-th>
                <vs-th sort-key="abono_documento">DOCUMENTO ABONO</vs-th>
                <vs-th sort-key="abono_notas">VALOR ABONO</vs-th>
                <vs-th sort-key="abono_fecha">FECHA ABONO</vs-th>
                <vs-th sort-key="abono_empresa">EMPRESA</vs-th>          
                <vs-th sort-key="abono_empresa">CLIENTE</vs-th>          
                <vs-th sort-key="abono_empresa">LUGAR DESPACHO</vs-th>          
            </template>
            <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>{{ tr.abono_id }} <br><b>Creado el: </b> {{ tr.created_at }}</vs-td>
                    <vs-td>{{ tr.cue_pag_nombre}}</vs-td>
                    <vs-td>{{ tr.abono_documento }}</vs-td>
                    <vs-td>{{ tr.abono_notas }}</vs-td>
                    <vs-td>{{ tr.abono_fecha }}</vs-td>
                    <vs-td>{{ tr.abono_empresa == 1 ? 'PROLIPA' : 'CALMED S.A' }}</vs-td>
                    <vs-td>{{ tr.cliente }}</vs-td>
                    <vs-td>{{ tr.institucion }}</vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
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
            cuentasPago: [],
            cuePagSeleccionado: null,
            fechaInicio: null,
            fechaFin: null,
            abonos: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            totalDescuento: 0,
            hasFetchedDocuments: false,

        };
    },
    created() {
        this.obtenerCuentasPago();
    },
    mounted(){
        if (!this.hasFetchedDocuments) {
            //con moment
            this.fromDate               = moment().startOf('month').format('YYYY-MM-DD');
            this.toDate                 = moment().endOf('month').format('YYYY-MM-DD');
            this.hasFetchedDocuments    = true; // Marca como ya ejecutado
        }
    },
    methods: {
        obtenerCuentasPago() {
            let me = this;

            me.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerCuentasPago')
                .then(res => {
                    this.cuentasPago = res.data.filter(cuenta => cuenta.cue_pag_tipo_cuenta == 1);
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener cuentas de pago:', error);
                    me.$vs.loading.close();
                });
        },

        obtenerAbonos() {
            let me = this;
            if (!this.cuePagSeleccionado || !this.fechaInicio || !this.fechaFin) {
                me.$vs.notify({
                    title: 'Error',
                    text: "Debe seleccionar todos los campos.",
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                return
            }

            const params = {
                fecha_inicio: this.fechaInicio,
                fecha_final: this.fechaFin,
                cuenta: this.cuePagSeleccionado
            };

            me.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerAbonosCuentasNotas', {
                    params
                })
                .then(res => {
                    this.abonos = res.data;
                    let total = 0;
                    this.abonos.forEach((item) => {
                        total += item.abono_notas * 1;
                    });
                    me.totalDescuento = total;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener abonos:', error);
                    me.$vs.loading.close();
                });
        },

        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },

        limpiarDatos() {
            this.abonos = [];
            this.totalDescuento = 0;
        },

        downloadReportAbonos() {
            let me = this;
            const reportTitle = `Reporte de Seguimiento-Desde ${this.fechaInicio} hasta ${this.fechaFin}`;
            const fecha = new Date();
            const opciones = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            const wsData = this.prepareAbonoData(reportTitle, fechaFormateada);

            const wb = utils.book_new();
            const ws = utils.aoa_to_sheet(wsData);

            // Combinar celdas para el título y cabecera
            ws['!merges'] = [{
                    s: {
                        r: 0,
                        c: 0
                    },
                    e: {
                        r: 0,
                        c: 7
                    }
                }, // Combina el título en la primera fila
                {
                    s: {
                        r: 1,
                        c: 0
                    },
                    e: {
                        r: 1,
                        c: 7
                    }
                },
                {
                    s: {
                        r: 2,
                        c: 0
                    },
                    e: {
                        r: 2,
                        c: 7
                    }
                },
            ];

            // Agregar la hoja al libro
            utils.book_append_sheet(wb, ws, 'Seguimiento de Abonos');

            // Exportar el archivo
            writeFile(wb, `${reportTitle}.xlsx`);
        },

        prepareAbonoData(reportTitle, fecha) {
            const wsData = [];

            let totalAbono = 0;

            wsData.push([reportTitle]);
            wsData.push(['Fecha: ' + fecha]);
            wsData.push([`Desde: ${this.fechaInicio} Hasta: ${this.fechaFin}`]);
            wsData.push([]);

            wsData.push(['N° ABONO', 'CUENTA', 'DOCUMENTO ABONO', 'VALOR ABONO', 'FECHA ABONO', 'EMPRESA', 'CLIENTE', 'LUGAR DESPACHO']);

            this.abonos.forEach(item => {
                const valorAbono = item.abono_notas ? parseFloat(item.abono_notas) : 0;
                const abonoFecha = item.abono_fecha ? item.abono_fecha : 'No disponible';
                const abonoDocumento= item.abono_documento ? item.abono_documento : 'No disponible';
                const abonoEmpresa= item.abono_empresa == 1 ? 'PROLIPA' : 'CALMED S.A';
                
                totalAbono += valorAbono;

                wsData.push([
                    item.abono_id,
                    item.cue_pag_nombre,
                    abonoDocumento,
                    valorAbono.toFixed(2) * 1,
                    abonoFecha,
                    abonoEmpresa,
                    item.cliente,
                    item.institucion
                ]);
            });

            wsData.push(['', '', 'Total Abono:', totalAbono.toFixed(2)*1, '']);

            wsData.push(['']);

            return wsData;
        }
    },
    computed: {},
};
</script>
