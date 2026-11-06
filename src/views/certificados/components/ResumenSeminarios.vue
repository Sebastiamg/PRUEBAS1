<template>
<div>
<vs-card>
    <div class="header">

        <div v-if="webinars.length >0 " style="margin-top:40px;">
          <vs-table max-items="10" striped search pagination :data="webinars" style="margin-top:-40px" class="mb-base">
              <template slot="header">
                  <v-select class="w-full mr-3" :options="periodos" :reduce="periodos => periodos" label="descripcion" v-model="periodo_seminarios" @input="getWebinars()"></v-select>
              </template>
              <template slot="thead">
                  <vs-th>Webinar</vs-th>
                  <vs-th>Registrados</vs-th>
                  <vs-th>Asistentes</vs-th>
                  <vs-th>Enc llenadas</vs-th>
                  <vs-th>Preg 7</vs-th>
              </template>
              <template slot-scope="{data}">
                  <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td>
                          <p style="font-weight: bold;color:#37B3E5;">{{data[indextr].seminario}}</p>
                          <p style="font-weight: 300;">{{tr.descripcion}}</p>
                      </vs-td>
                      <vs-td> {{data[indextr].registrados}}<br> </vs-td>
                      <vs-td> {{data[indextr].asistentes}}<br> </vs-td>
                      <vs-td> {{tr.encuestas_llenadas}}<br> </vs-td>
                      <vs-td>
                        <div class="flex text-center">
                          <div class="px-1" style="border-right: 1px solid #D8D8D8;" :key="index_op" v-for="(item_op, index_op) in tr.cant_op_preg_7">
                            <b>Op{{index_op}} </b><br>
                            {{item_op}}
                          </div>
                        </div>
                      </vs-td>
                  </vs-tr>
              </template>
          </vs-table>


          <div class="w-full" align="center">
            <h5>Gráfico estadístico de los resultados de la pregunta 7</h5>
            <vue-apex-charts type="bar" height="350" :options="barChart.chartOptions" :series="barChart.series"></vue-apex-charts>
          </div>

          <div class="p-5 w-full" align="right">
            <!-- <div :key="index_val" v-for="(item_val, index_val) in val_preg7">
              <div style="width: 180px; display: inline-block;" v-if="index_val>0">
                <b style="font-size: 15px;">OPCIÓN {{index_val}}: </b>
              </div>
              <div style="width: 80px; display: inline-block;" v-if="index_val>0">
                  <b style="font-size: 18px; color: #40C19F;">{{item_val}}</b>
              </div>
            </div> -->

            <div style="display: inline-block;">
              <b style="font-size: 15px;">PROMEDIO PREGUNTA 7 : </b>
            </div>
            <div style="width: 80px; display: inline-block;">
              <b style="font-size: 18px; color: #40C19F;">{{total_p7.toFixed(2)}}</b>
            </div>
          </div>
        </div>
        <div v-else class="p-3" style="min-height: 500px;">
            <v-select class="w-full mb-6" :options="periodos" :reduce="periodos => periodos" label="descripcion" v-model="periodo_seminarios" @input="getWebinars()"></v-select>
            <p> No existe resumen de webinars para el periodo seleccionado. </p>
        </div>
    </div>
</vs-card>
</div>
</template>

<script>
import vSelect from 'vue-select'
import VueApexCharts from 'vue-apexcharts'

export default {
    components: {
        'v-select': vSelect,
        VueApexCharts
    },
    data() {
        return{
            webinars:[],
            total_p7: 0,
            periodos: [],
            periodo_seminarios: {},
            val_preg7: [0,0,0,0,0,0],

            barChart: {
              series: [{
                  data: [0, 0, 0, 0, 0]
              }],
              chartOptions: {
                colors: ['#28C76F', '#EA5455', '#FF9F43', '#1E1E1E', '#7367F0'],
                plotOptions: {
                  bar: { horizontal: false, }
                },
                dataLabels: { enabled: false },
                xaxis: {
                  categories: ['Opción 1','Opción 2','Opción 3','Opción 4','Opción 5'],
                }
              }
            }

        }
    },
    created(){
        let me = this;
        me.getPeriodos()
    },
    methods:{
        randomize() {
          return [0, 0, 0].map(v => {
            return Math.round(300 + Math.random() * 700) / 10
          })
        },
        getPeriodos(){
          let me = this;
          this.$http.get(this.$server_url+'get_periodos_seminarios')
          .then(function (res) {
              me.periodos = res.data
              me.periodo_seminarios = me.periodos[0]
              me.getWebinars()
          })
        },
        getWebinars() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'resumenWebinar/'+me.periodo_seminarios.idperiodoescolar)
                .then(function (res) {
                    me.webinars = res.data.seminarios
                    let acumpreg = 0
                    $.each(me.webinars,function(key, value){
                        if(typeof value.val_preg_7 == 'number'){
                          acumpreg = acumpreg + parseFloat(value.val_preg_7)
                        }
                    });
                    me.total_p7 = (acumpreg / parseInt(res.data.seminarios.length))
                    me.val_preg7 = [0,0,0,0,0,0]
                    me.reporteWebinar7()

                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        reporteWebinar7(){
          let me = this
          $.each(me.webinars,function(key, value){
            $.each(value.cant_op_preg_7,function(key1, value1){
              me.val_preg7[key1] += value1
              me.barChart.series[0].data[key1-1] += value1
            })
          })
        }
    }
}
</script>
