<template>
    <vx-card
        title="Reporte general de la agenda de los asesores"
        title-color="success"
        subtitle="Filtre por fechas para obtener el reporte.">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" vs-lg="4" vs-sm="6" vs-xs="6">
                <p>Fecha inicio:</p>
                <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" vs-lg="4" vs-sm="6" vs-xs="6">
                <p>Fecha fin:</p>
                <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="6">
                <vs-button radius color="success" @click="getReporteAgenda()" style="margin-left:1px;" type="gradient" icon="search"></vs-button>
            </vs-col>
        </vs-row>
        <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="visitasAgenda">
            <template slot="header">
                <vs-chip color="primary" style="font-size:12px;">
                    Cantidad asesores: <span style="font-weight:bold;"> {{visitasAgenda.length}}</span>
                </vs-chip>
                <vs-button color="warning" size="small" class="ml-2" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
            </template>
            <template slot="thead">
                <vs-th sort-key="asesor">Asesor</vs-th>
                <vs-th sort-key="contador">Cantidad visitas</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].asesor">
                        {{ data[indextr].asesor  }}
                    </vs-td>
                    <vs-td :data="data[indextr].contador">
                        {{ data[indextr].contador }}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
          <!--modal exportar-->
          <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
                <!--<span class="mr-4">Cell Auto Width:</span>
                <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
            </div>
        </vs-prompt>
    </vx-card>
</template>
<script>
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
export default {
    data() {
       return{
        fromDate: null,
        toDate: null,
        configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d',
            minDate: "2022-01-05",
            maxDate: new Date().fp_incr(1)
        },
        visitasAgenda:[],
        //VARIABLES PARA EXPORTAR A EXCEL
        codigoSelected: [],
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        fileName:null,
        selectedFormat: 'xls',
        cellAutoWidth: true,
        activePrompt: false,
        //FIN VARIABLES PARA EXPORTAR A EXCEL
       } 
    },
    mounted(){
        let me = this;
        me.configdateTimePicker.minDate = moment().subtract(30, 'd').format('YYYY-MM-DD');

        //obtener la fecha incio semana y fecha fin semana
        let currentdate = new Date();
        var oneJan = new Date(currentdate.getFullYear(),0,1);
        var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
        let preFechainicioSemana = moment().isoWeek(result - 1).startOf("isoweek");
        let preFechaFinSemana = moment().isoWeek(result - 1).endOf("isoweek");
        //convertir a fecha
        let convertirFrom = moment(preFechainicioSemana, 'DD/MM/YYYY HH:mm:ss').format(
        'YYYY-MM-DD'
        );
        let convertirtoDate = moment(preFechaFinSemana, 'DD/MM/YYYY HH:mm:ss').format(
        'YYYY-MM-DD'
        );
        me.fromDate = convertirFrom
        me.toDate = convertirtoDate
        me.getReporteAgenda();
    },
    components:{
        flatPickr,
    },
    methods:{
        getReporteAgenda(){
            let me = this;
            me.visitasAgenda = []
            me.$vs.loading();
            this.$http.get(this.$server_url+'ReporteVisitaAsesores?fromDate='+me.fromDate+'&toDate='+me.toDate)
                .then(function (res) {
                    me.visitasAgenda = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
          //METODOS PARA EXPORTAR A EXCEL
          exportToExcel() {
            let headerTitle = [ 'Asesor','Cantidad visitas'];
            let headerVal = [ 'asesor','contador'];
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, this.codigoSelected)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
            //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //FIN METODOS PARA EXPORTAR A EXCEL
    },
}
</script>