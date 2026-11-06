<template>
<div>
<vx-card class="w-full mb-4" :title="'Respuestas preguntas de la encuesta de ' + data_seminario.nombre" :subtitle="'Institucion: ' + data_seminario.nombre_institucion + ' - ' + 'Fecha: ' +fechaLarga(data_seminario.fecha_inicio)">
    
    <!-- {{respuestas_tipo4}} <br> -->
    <div>
        <div :key="index" v-for="(item, index) in respuestas_tipo4" class="mb-base">
            <b>{{item.id_pregunta}}) {{item.pregunta}}</b>
            <!-- {{index}}: {{seriesChart_sn[index]}} -->
            <vue-apex-charts type="bar" height="350" :options="columnChart4.chartOptions" :series="[seriesChart_sn[index]]"></vue-apex-charts>
            <vs-divider></vs-divider>
        </div>
    </div>
    <!-- <vue-apex-charts type="bar" height="350" class="mb-base" :options="columnChart4.chartOptions" :series="columnChart4.series"></vue-apex-charts> -->


    <div>
        <div :key="index" v-for="(item, index) in respuestas_tipo1" class="mb-base">
            <b>{{item.id_pregunta}}) {{item.pregunta}}</b>
            <!-- {{index}}: {{seriesChart[index]}} -->
            <vue-apex-charts type="bar" height="350" :options="columnChart.chartOptions" :series="[seriesChart[index]]"></vue-apex-charts>
            <vs-divider></vs-divider>
        </div>
    </div>
    <!-- <vue-apex-charts type="bar" height="350" class="mb-base" :options="columnChart.chartOptions" :series="columnChart.series"></vue-apex-charts> -->




    <!-- {{respuestas_tipo3}} <br> -->
    <div>
        <div :key="index" v-for="(item, index) in respuestas_tipo3" class="mb-base">
        <div :key="indexR" v-for="(itemR, indexR) in item" class="mb-base">
            <div class="w-full mb-base"><b> {{itemR[0].id_pregunta}}) {{itemR[0].nombre_pregunta}}</b></div>
            <div :key="indexO" v-for="(itemO, indexO) in itemR" class="mb-2">
                <vs-textarea :value="itemO.respuesta" readonly />
            </div>
            <vs-divider></vs-divider>
        </div>
    </div>


    </div>
</vx-card>



</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import VueApexCharts from 'vue-apexcharts'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        flatPickr,
        VueApexCharts
    },
    data() {
        return {
            usuario: [],
            data_seminario: [],
            id_seminario: '',
            preguntas_agrup: [],
            respuestas_reporte: [],
            respuestas_tipo1: [],
            respuestas_tipo3: [],
            respuestas_tipo4: [],
            seriesChart: [],
            seriesChart_sn: [],
            columnChart: {
                series: [],
                chartOptions: {
                    colors: ['#28C76F', '#EA5455', '#FF9F43', '#1E1E1E', '#7367F0'],
                    plotOptions: { bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%', }, },
                    dataLabels: { enabled: false },
                    stroke: { show: true, width: 2, colors: ['transparent'] },
                    xaxis: { categories: ['1', '2', '3', '4', '5'], },
                    yaxis: { title: { text: 'Puntuación' } },
                    fill: { opacity: 1 },
                    tooltip: { y: { formatter: function(val) { return "Puntuación: " + val } } }
                }
            },

            columnChart4: {
                series: [],
                chartOptions: {
                    colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
                    plotOptions: { bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%', }, },
                    dataLabels: { enabled: false },
                    stroke: { show: true, width: 2, colors: ['transparent'] },
                    xaxis: { categories: ['SI', 'NO'], },
                    yaxis: { title: { text: 'Puntuación' } },
                    fill: { opacity: 1 },
                    tooltip: { y: { formatter: function(val) { return "Puntuación: " + val } } }
                }
            },



        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.data_seminario = JSON.parse(localStorage.getItem('data_seminario'));
        this.id_seminario = localStorage.getItem("id_seminario")
        this.getSeminarios()
    },
    methods: {
        getSeminarios() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporte_seminario/'+me.id_seminario)
            .then(function (res) {

                me.preguntas_agrup = me.groupArrayOfObjects(res.data.items, "id_pregunta")

                $.each(me.preguntas_agrup,function(key, value){
                    switch(value[0].tipo_pregunta) {
                    case 1: // 1-5
                        let cont_preg_1_5 = []
                        let agrup_resp_tipo5 = me.groupArrayOfObjects(value, "respuesta")
                        
                        $.each(agrup_resp_tipo5,function(key_1, value_1){
                            // console.log('key_1: ' + key_1+'___value_1: ' + value_1.length)
                            cont_preg_1_5[key_1-1] = value_1.length
                        });

                        for( var i=0; i<5; i++){
                            if( !cont_preg_1_5[i] ){ cont_preg_1_5[i] = 0 }
                        }

                        me.respuestas_tipo1.push({
                            id_pregunta: value[0].id_pregunta,
                            pregunta: value[0].nombre_pregunta,
                            respuestas: cont_preg_1_5,
                        })

                        me.seriesChart.push({
                            name: value[0].nombre_pregunta,
                            data: cont_preg_1_5
                        })
                    
                    break;
                    case 3: // escritas

                    let agrup_resp_tipo3 = me.groupArrayOfObjects(value, "nombre_pregunta")
                    me.respuestas_tipo3.push(agrup_resp_tipo3)
                    break;
                    default: // SI-NO
                        let cont_preg_sn = 0
                        $.each(value,function(key_1, value_1){
                            if( value_1.respuesta == 'SI' ){ cont_preg_sn++ }
                        });

                        me.respuestas_tipo4.push({
                            id_pregunta: value[0].id_pregunta,
                            pregunta: value[0].nombre_pregunta,
                            respuestas: {
                                si: cont_preg_sn,
                                no: (value.length-cont_preg_sn)
                            },
                        })

                        me.seriesChart_sn.push({
                            name: value[0].nombre_pregunta,
                            data: [cont_preg_sn,(value.length-cont_preg_sn)]
                        })
                    }
                });

                me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        groupArrayOfObjects(list, key) {
            return list.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        },
    },
}
</script>
