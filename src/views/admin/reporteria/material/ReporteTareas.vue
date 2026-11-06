<template>
    <vx-card    
    title="Reporte de tareas"
    title-color="primary"
    subtitle="Seleccione el año para ver la estadistica.">
        <vs-table id="tbl_exporttable_to_xls">
            <template slot="header">
                <div class="flex" style="margin-top: -10px;">
                    <vs-chip color="primary">Reporte por año</vs-chip>
                    <vs-button class="ml-3" @click="ExportToExcel('xlsx')" color="success" type="border">Exportar</vs-button>
                </div>
                <br><br>
            </template>
            <template slot="thead">
                <vs-th>Mes</vs-th>
                <vs-th>{{menosDos}}</vs-th>
                <vs-th>{{ menosUno }}</vs-th>
                <vs-th>{{ yactual }}</vs-th>
            </template>
            <template>
                <vs-tr>
                    <vs-td>
                        <b>Enero</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Ene }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Febrero</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Feb }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Marzo</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Mar }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Abril</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Abr }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Mayo</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.May }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Junio</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Jun }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Julio</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Jul }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Agosto</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Ago }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Septiembre</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Sep }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Octubre</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Oct }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Noviembre</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Nov }}
                    </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td>
                        <b>Diciembre</b>
                    </vs-td>
                    <vs-td v-for="(tr,index) in infoAnios.datos" :key="index">
                        {{ tr.Dic }}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>   
        <vs-divider>Estadistica</vs-divider>
        <ul class="leftx">
            <li v-for="(tr,index) in anios" :key="index">
                <vs-radio v-model="anioSelect" @input="getEstastica()" vs-name="radios1" :vs-value="tr.anio">{{ tr.anio }}</vs-radio>
            </li>
        </ul>
        <vs-divider></vs-divider>
        <p style="display: none;">{{ series }}</p>
        <div id="chart">
        <apexchart
          type="bar"
          height="350"
          :options="options"
          :series="[series[0]]"
        ></apexchart>
      </div>
    </vx-card>
</template>
<script>
import chart from "vue-apexcharts";
import moment from 'moment'
import { METHODS } from "http";
export default{
    components: { apexchart: chart },
    data(){
        return{
            anios:[],
            infoAnios:[],
            yactual:null,
            menosUno:null,
            menosDos:null,
            anioSelect:null,
            series: [{
                name: 'Reporte tareas',
                data: []
            }],
            options: {
                chart: {
                height: 350,
                type: 'bar',
                },
                plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                    position: 'top', // top, center, bottom
                    },
                },
                },
                dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + ' env.';
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ['#304758'],
                },
                },

                xaxis: {
                categories: [
                    'Ene',
                    'Feb',
                    'Mar',
                    'Abr',
                    'May',
                    'Jun',
                    'Jul',
                    'Ago',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
                position: 'top',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    },
                    },
                },
                tooltip: {
                    enabled: true,
                },
                },
                yaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                    return val + '%';
                    },
                },
                },
                title: {
                text: '',
                floating: true,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444',
                },
                },
            },
        }
    },
    created(){
        let me = this;
        me.yactual = moment().format('YYYY');
        //restar Anios
        me.menosUno = me.yactual - 1;
        me.menosDos = me.yactual - 2;
        me.anios.push({anio:me.yactual});
        me.anios.push({anio:me.menosUno});
        me.anios.push({anio:me.menosDos});  
        me.anioSelect = this.anios[0].anio
    },
    mounted(){
        let me = this;
        me.getEstastica()
        me.getEstasticaPorAnios()
    },
    methods:{
        getEstastica(){
            let me = this;
            this.series[0].data = []
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporteMesTareas?anio='+me.anioSelect)
                .then(function (res) {
                  
                    me.pasarInfo(res.data[0]) 
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getEstasticaPorAnios(){
            let me = this;
            this.$http.get(this.$server_url+'reporteMesTareasAnios?anioActual='+me.yactual+'&anioMenosUno='+me.menosUno+'&anioMenosDos='+me.menosDos)
                .then(function (res) {
                    me.pasarInfo2(res.data)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        pasarInfo(item){
            let me = this
            let datos = Object.values(item);
            let valores = []
            for(var i = 0; i < datos.length; i++){
                valores[i] = parseInt(datos[i]);
            }
            this.series[0].data = valores;
            setTimeout(function() {me.$vs.loading.close()}, 2000);
        },
        pasarInfo2(item){
            let me = this
            this.infoAnios = item
        },
        //metodo par descargar el excel
        ExportToExcel(type, fn, dl) {
        var elt = document.getElementById('tbl_exporttable_to_xls');
        var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
        return dl ?
            XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
            XLSX.writeFile(wb, fn || ('ReporteTareas.' + (type || 'xlsx')));
        
        }
    }
}
</script>