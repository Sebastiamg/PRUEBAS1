<template>
    <div>
        <vs-tabs>
            <vs-tab label="Gestión de visitas">
                <vx-card class="con-tab-ejemplo">
                    <VisitasAdmin/>
                </vx-card>
            </vs-tab>
            <!-- <vs-tab label="Gestión de visitas" @click="menu =0;">
                <div class="con-tab-ejemplo">
                <gestionVisitasVue/>
                </div>
            </vs-tab> -->
            <vs-tab label="Reporteria" @click="menu=1;">
                <vs-prompt title="Exportar a Excel" class="export-options" @accept="exportToExcel" accept-text="Exportar"  :active.sync="dialogExportar">
                    <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
                </vs-prompt>
                <vx-card title="Información de agendas de asesores" subtitle="Por defecto se muestran resultados de hasta 30 días previos.">
                <div class="w-full mb-6">
                    <v-select :options="periodos" :reduce="periodos => periodos" label="periodoescolar" v-model="periodo_selected" class="m-2" @input="getAgendas(0)" style="width: 210px; display: inline-block; vertical-align: bottom;" />
                    <flat-pickr :config="configdateTimePicker" v-model="fecha_inicio" style="width: 210px; display: inline-block;" placeholder="Fecha inicio" class="m-2" />
                    <flat-pickr :config="configdateTimePicker" v-model="fecha_fin" style="width: 210px; display: inline-block;" placeholder="Fecha fin" class="m-2" />
                    <vs-button color="dark" size="small" style="font-size: 14px;" @click="getAgendas(1)">Buscar por fechas</vs-button>
                </div>
                <vs-alert active="true" color="warning">
                    <p style="text-align:center;">Cantidad de instituciones pertenecientes prolipa</p>
                </vs-alert>
                    <vs-tabs alignment="fixed" class="mt-5">
                    <vs-tab label="Tabla de registros" class="pt-6">
                        <vs-table max-items="10"  search pagination :data="agendas">
                            <template slot="header">

                                <vs-button color="warning" class="ml-2" size="small" style="font-size: 14px;" @click="dialogExportar=true;exportarR= 1;">Exportar</vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th>ASESOR</vs-th>
                                <vs-th>INSTITUCIÓN</vs-th>
                                <vs-th>VISITA</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td> {{tr.asesor}}</vs-td>
                                    <vs-td>
                                    {{tr.nombreInstitucion}} <br>
                                    <small>{{tr.region}}</small>
                                    </vs-td>
                                    <vs-td> {{tr.contador}} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <vs-tab label="Gráficos estadísticos" class="pt-6">
                        <vue-apex-charts type="bar" height="450" :options="barChart.chartOptions" :series="[barChart.series[0]]"></vue-apex-charts>
                    </vs-tab>
                    </vs-tabs>
                <vs-alert active="true" color="warning">
                    <p style="text-align:center;">Cantidad de instituciones temporales</p>
                </vs-alert>
                <vs-tabs alignment="fixed" class="mt-5">
                    <vs-tab label="Tabla de registros" class="pt-6">
                        <vs-table max-items="10"  search pagination :data="agendasTemporales">
                            <template slot="header">
                            <!-- Cantidad de instituciones: {{agendasTemporales.length}} -->
                                <vs-button color="warning" class="ml-2" size="small" style="font-size: 14px;" @click="dialogExportar=true;exportarR= 2;">Exportar</vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th>ASESOR</vs-th>
                                <vs-th>INSTITUCIÓN</vs-th>
                                <vs-th>VISITA</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td> {{tr.asesor}}</vs-td>
                                    <vs-td>
                                    {{tr.nombreInstitucion}} <br>
                                    <small>{{tr.region}}</small>
                                    </vs-td>
                                    <vs-td> {{tr.contador}} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <vs-tab label="Gráficos estadísticos" class="pt-6">
                        <vue-apex-charts type="bar" height="450" :options="barChart2.chartOptions" :series="[barChart2.series[0]]"></vue-apex-charts>
                    </vs-tab>
                    </vs-tabs>
                </vx-card>
            </vs-tab>
            <vs-tab label="Reporte general de la agenda" @click="menu=2;">
                <div class="con-tab-ejemplo">
                <reporteAgendaGeneral/>
                </div>
            </vs-tab>
            <vs-tab label="Reporte visitas" @click="menu=3;">
              <vx-card class="con-tab-ejemplo">
              <ReporteVisitasVue/>
              </vx-card>
          </vs-tab>
        </vs-tabs>
    </div>
</template>
<script>
// import gestionVisitasVue from '../../../asesor/admin/gestionVisitas.vue'
import reporteAgendaGeneral from '../components/reporteAgendaGeneral.vue'
const ReporteVisitasVue   = () => import('./visitas/ReporteVisitas.vue')
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import VueApexCharts from 'vue-apexcharts';
import moment from 'moment'
import VisitasAdmin from '../../../asesor/admin/visitasAdmin.vue';
export default{
    components:{
      flatPickr,
      'v-select': vSelect,
      // gestionVisitasVue,
      reporteAgendaGeneral,
      ReporteVisitasVue,
      VisitasAdmin,
    },
    mounted(){
      let me = this;
      this.getAgendas(0)
      this.getPeriodos()
      const date = new Date()
      const primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
      const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      me.fecha_inicio = primerDia
      me.fecha_fin    = ultimoDia
    },
    data(){
        return{
            agendas: [],
            agendasTemporales:[],
            periodos: [],
            periodo_selected: {},
            fecha_inicio: '',
            fecha_fin: '',
            configdateTimePicker: {
              enableTime: true,
              dateFormat: 'Y-m-d'
            },
            dialogExportar: false,
            fileName: '',

            barChart: {
              series: [{ name: "Visitas", data: [] }],
              chartOptions: {
                colors: ['#28C76F', '#EA5455', '#7367F0', '#FF9F43', '#1E1E1E'],
                plotOptions: { bar: { horizontal: false, } },
                dataLabels: { enabled: false },
                xaxis: {
                  categories: [],
                }
              }
            },
              barChart2: {
              series: [{ name: "Visitas", data: [] }],
              chartOptions: {
                colors: ['#28C76F', '#EA5455', '#7367F0', '#FF9F43', '#1E1E1E'],
                plotOptions: { bar: { horizontal: false, } },
                dataLabels: { enabled: false },
                xaxis: {
                  categories: [],
                }
              }
            },
            estadisticas: [],
            estadisticasTemporales:[],
            exportarR:1,
            list:[],
            menu:0,
        }
    },
    methods:{
      getPeriodos(){
        let me = this
        this.$http.get(this.$server_url+'get_periodos_activos')
        .then(res => {
            me.periodos = res.data
        })
      },
      getAgendas(tipo_filtro){
        let me = this
        me.agendas = []
        me.agendasTemporales = []
        let periodo = 'null'
        if( me.periodo_selected.idperiodoescolar ){
          periodo = me.periodo_selected.idperiodoescolar
        }
        switch (tipo_filtro) {
          case 1: //por fechas
            periodo = 'null'
            me.periodo_selected = ""
            if( me.fecha_inicio == '' || me.fecha_fin == '' ){
              me.$vs.notify({ text: 'Ingrese la fecha de inicio y fin para realizar la búsqueda.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
              return
            }
            break;
          default:
            me.fecha_inicio = 'null'
            me.fecha_fin = 'null'
            break;
        }
        const from = moment(me.fecha_inicio).format('YYYY-MM-DD')
        const to = moment(me.fecha_fin).format('YYYY-MM-DD')
        me.$vs.loading();
        this.$http.get(this.$server_url + 'reporte_asesores_view/'+ from+'/'+ to+'/'+periodo)
        .then(function (res) {
            me.agendas = res.data.visitasInstitucion
            me.agendasTemporales = res.data.visitasInstitucionTemporal
            me.$vs.loading.close()
            me.getEstadisticasInst(periodo, me.fecha_inicio, me.fecha_fin)
        })
        .catch(function (error){ me.$vs.loading.close() })
      },
      getEstadisticasInst(periodo, fecha_inicio, fecha_fin){
        let me = this
        me.barChart.series[0].data = []
        me.barChart2.series[0].data = []
        me.barChart.chartOptions.xaxis.categories = []
        me.barChart2.chartOptions.xaxis.categories = []
        const from = moment(me.fecha_inicio).format('YYYY-MM-DD')
        const to = moment(me.fecha_fin).format('YYYY-MM-DD')
        me.$vs.loading()
        this.$http.get(this.$server_url + 'reporte_asesores_view/'+ from+'/'+ to+'/'+periodo)
        .then(res => {
            me.estadisticas = res.data.visitasInstitucion
            me.estadisticasTemporales = res.data.visitasInstitucionTemporal
            $.each(me.estadisticas, function(key, value){
                me.barChart.series[0].data[key] = value.contador
                me.barChart.chartOptions.xaxis.categories[key] = value.nombreInstitucion
            });
            $.each(me.estadisticasTemporales, function(key, value){
                me.barChart2.series[0].data[key] = value.contador
                me.barChart2.chartOptions.xaxis.categories[key] = value.nombreInstitucion
            });
            me.$vs.loading.close()
        })
      },
      exportToExcel() {
          let me = this
          let headerVal = [ 'asesor','nombreInstitucion', 'contador'];
          let headerTitle = [ 'asesor', 'Institucion', 'Visitas'];
          import('@/vendor/Export2Excel').then(excel => {
            const list = me.agendasTemporales
            if(me.exportarR == 2){
              me.list = me.agendasTemporales
            }else{
              me.list = me.agendas
            }
              const data = this.formatJson(headerVal, me.list)
              excel.export_json_to_excel({
                  header: headerTitle,
                  data,
                  filename: this.fileName,
                  autoWidth: true,
                  bookType: 'xls'
              })
          })
      },
      formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
              return v[j]
          }))
      },
    }
}
</script>
