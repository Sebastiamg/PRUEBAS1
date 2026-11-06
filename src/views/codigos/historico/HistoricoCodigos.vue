<template>
    <div>
        <vx-card title="Histórico de Códigos" class="overflow-visible">
            <div class="vx-row">
                <div class="vx-col w-1/2">
                    <span>Fecha inicio:</span>
                    <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1" style="display: inline-block; width: 100%;" />
                </div>
                <div class="vx-col w-1/2">
                    <span>Fecha fin:</span>
                    <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block; width: 100%;" />
                </div>
                <div class="vx-col w-1/2 m-2 mt-5">
                    <vs-button @click="getHistoricoCodigos" class="vx-btn--primary">Buscar</vs-button>
                </div>
            </div>
        </vx-card>
        <vx-card>
            <TableReutilizableVue
                :title="'Resultados'"
                :headers="['Código','Observación','Fecha','Editor','Old Values','Periodo','Institucion']"
                :fieldKeys="['codigo_libro','observacion','created_at','editor','old_values','periodoescolar','nombreInstitucion']"
                :ifexportar="Number(1)"
                :tableData="arrayHistorico"
            />
        </vx-card>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Generalmix from '@/mixins/Generalmix';
import moment from 'moment';
const TableReutilizableVue              = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    mixins: [Generalmix],
    components: {
        flatPickr,
        TableReutilizableVue
    },
    data() {
        return {
            fromDate: null,
            toDate: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            arrayHistorico: [] // Asegúrate de inicializar este array
        };
    },
    props: {
        ObjectedSelected: {
            type: Object,
            default: null
        }
    },
    mounted() {
        // Establecer fromDate al primer día del año actual
        this.fromDate = moment().startOf('year').format('YYYY-MM-DD');
        // También podrías establecer toDate al día actual si lo deseas
        this.toDate = moment().format('YYYY-MM-DD');
    },
    methods: {
    async getHistoricoCodigos() {
        let me = this;
        // Validación de datos
        if (!me.fromDate) {
            me.m_message("Debe seleccionar una fecha inicio", "error");
            return;
        }
        if (!me.toDate) {
            me.m_message("Debe seleccionar una fecha fin", "error");
            return;
        }
        // Validación de fecha
        if (moment(me.fromDate).isAfter(me.toDate)) {
            me.m_message("La fecha de inicio no puede ser mayor a la de fin", "error");
            return;
        }

        try {
            me.$vs.loading(); // Muestra el loading
            const url = `historico?traerHistoricoCodigos=1&nombreInstitucion=${me.ObjectedSelected.nombreInstitucion}&fechaInicio=${me.fromDate}&fechaFin=${me.toDate}&idInstitucion=${me.ObjectedSelected.idInstitucion}`;
            const response = await this.$http.get(this.$server_url + url);
            this.arrayHistorico = response.data; // Guarda los datos obtenidos
            if (this.arrayHistorico.length === 0) {
                me.m_message("No hay datos para mostrar", "warning");
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors; // Guarda los errores
                me.m_message(errors, 'warning');
            } else {
                me.m_message("Ocurrió un error al obtener los datos", "error");
            }
        } finally {
            // Asegúrate de cerrar el loading, sin importar si hay error o no
            me.$vs.loading.close();
        }
        }
    }
};
</script>

<style>
/* Puedes añadir estilos personalizados aquí si es necesario */
</style>
