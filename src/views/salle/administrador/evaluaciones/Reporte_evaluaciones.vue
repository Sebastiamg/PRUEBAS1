<template>
<div>

    <!----modal exportar--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" :active.sync="activePromptExcel">

        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
        </div>
    </vs-prompt>
    <!----fin modal exportar--------->

    <!----modal exportar asignaturas--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcelAsignaturas" accept-text="Exportar" :active.sync="activePromptExcelAsignaturas">

        <vs-input v-model="fileNameAs" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
        </div>
    </vs-prompt>
    <!----fin modal exportar--------->


    <div class="w-full mb-3">
        <h5 style="display: inline-block;">Filtros</h5>
        <v-select style="display: inline-block; width: 20%; min-width: 120px;" class="ml-3" :options="['2021','2022','2023','2024','2025']" v-model="anio_reporte" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

        <v-select style="display: inline-block; width: 70%; min-width: 300px;" class="ml-3" :options="instituciones" :reduce="instituciones => instituciones" label="institucion_ciudad" v-model="institucion_selected" @input="getPromedioAreas()"></v-select>

    </div>

    <div class="vx-row">
      <div class="vx-col w-full mb-base">
          <vx-card title="Instituciones" subtitle="Comparación de promedios con las demás instituciones">
              <!-- <e-charts autoresize :options="pie" ref="pie" auto-resize /> -->

              <vue-apex-charts type="bar" height="350" :options="columnInstituciones.chartOptions" :series="columnInstituciones.series"></vue-apex-charts>
          </vx-card>
      </div>

      <div class="vx-col sm:w-full mb-base">
            <vx-card title="Promedios por áreas" subtitle="Comparación de promedios de todas las áreas de la institución seleccionada">
                <vue-apex-charts type="bar" height="350" :options="columnChart.chartOptions" :series="columnChart.series"></vue-apex-charts>
                <br>
            </vx-card>
      </div>
    </div>

    <vx-card class="mb-base" :title="'Área: ' + area_selected" subtitle="Seleccione una área para visualizar sus información">
        <div class="chips_selects" :style="'cursor: pointer; color: white; margin: 3px; padding: 3px 6px 3px 2px; border-radius: 20px; display: inline-block; background-color: '+colores[index]" :key="index" v-for="(chip, index) in key_areas" @click="getPromedioAsignaturas(chip)">
            <div style="font-size: 12px; display: inline-block; background-color: #d5d5d5; border-radius: 100%; width: 27px; padding-top: 5px; padding-bottom: 5px; text-align: center; margin-right: 2px;"> {{(chip.nombre_area).substr(0,2).toUpperCase()}} </div>
            {{chip.nombre_area}}
        </div>
    </vx-card>

    <vx-card title="Promedios por asignaturas" subtitle="Comparación de asignaturas del área seleccionada" class="mb-base">
        <vue-apex-charts type="bar" height="350" :options="barChart.chartOptions" :series="barChart.series"></vue-apex-charts>
    </vx-card>


    <vx-card class="mb-base" :title="'Asignatura: ' + asignatura_selected" subtitle="Seleccione una asignatura para visualizar sus información">
        <div class="chips_selects" :style="'cursor: pointer; color: white; margin: 3px; padding: 3px 6px 3px 2px; border-radius: 20px; display: inline-block; background-color: '+colores[index]" :key="index" v-for="(chip, index) in key_asignaturas" @click="getPromedioPreguntas(chip)">
            <div style="font-size: 12px; display: inline-block; background-color: #d5d5d5; border-radius: 100%; width: 27px; padding-top: 5px; padding-bottom: 5px; text-align: center; margin-right: 2px;"> {{(chip.nombre_asignatura).substr(0,2).toUpperCase()}} </div>
            {{chip.nombre_asignatura}}
        </div>
    </vx-card>


    <div class="vx-row mb-6">
    <div style="min-width: 400px;" class="vx-col sm:w-1/2 w-1/2 md:w-1/2 mb-3">
        <vx-card title="Top docentes" subtitle="Docentes mejor puntuados en calificacion final">
            <div  style="overflow-y: scroll; overflow-x: hidden; height:450px;" id="div_top_1">
            <vue-apex-charts type="bar" height="3000" :options="barChartTopDoc.chartOptions" :series="barChartTopDoc.series"></vue-apex-charts>
            </div>
        </vx-card>
    </div>

    <div style="min-width: 400px;" class="vx-col sm:w-1/2 w-1/2 md:w-1/2 mb-3">
        <vx-card title="Top docentes áreas" subtitle="Docentes mejor puntuados por area">
            <div  style="overflow-y: scroll; overflow-x: hidden; height:450px;" id="div_top_area">

                <vs-button size="small" style="padding: 7px; font-size: 12px; float: right; margin-right: 10px;" icon-pack="feather" icon="icon-download" color="#0CBFBD" @click="fileName='reporte_docentes_areas'; activePromptExcel=true">Exportar</vs-button>
                <br><br>

                <div :key="index" v-for="(evaluacion, index) in data_docentes_areas" class="mb-base">
                    <b style="color: #0CBFBD;">{{evaluacion.nombre_docente.toUpperCase()}} </b> <b>{{evaluacion.puntaje_evaluacion}}%</b> <br>
                    <div :key="indexA" v-for="(area, indexA) in evaluacion.areas">
                        <div style="width: 60%; display: inline-block;"><b>Área: </b> <span style="color: #3477E7;"> {{area.nombre_area}} </span></div>
                        <div style="width: 40%; display: inline-block;"><b>Puntaje: </b> <span style="color: #8B34E7;"> {{area.puntaje}}% </span> </div>
                    </div>
                </div>

            </div>
        </vx-card>
    </div>
    </div>


    <div class="vx-row mb-6">
    <div style="min-width: 400px;" class="vx-col sm:w-1/2 w-1/2 md:w-1/2 mb-3">
        <vx-card title="Top docentes asignaturas" subtitle="Docentes mejor puntuados por asignatura del área seleccionada">
            <div  style="overflow-y: scroll; overflow-x: hidden; height:450px;" id="div_top_asignatura">
                <vs-button size="small" style="padding: 7px; font-size: 12px; float: right; margin-right: 10px;" icon-pack="feather" icon="icon-download" color="#0CBFBD" @click="fileNameAs='reporte_docentes_asignaturas'; activePromptExcelAsignaturas=true">Exportar</vs-button>
                <br><br>
                <div :key="index" v-for="(evaluacion, index) in data_docentes_asignaturas" class="mb-base">
                    <b style="color: #E75AE3;">{{evaluacion.nombre_docente.toUpperCase()}} </b> <b>{{evaluacion.puntaje_evaluacion}}%</b> <br>
                    <div :key="indexA" v-for="(area, indexA) in evaluacion.asignaturas">
                        <div style="width: 60%; display: inline-block;"><b>Asignatura: </b> <span style="color: #AC5AE7;"> {{area.nombre_asignatura}} </span></div>
                        <div style="width: 40%; display: inline-block;"><b>Puntaje: </b> <span style="color: #3B76F7;"> {{area.puntaje}}% </span></div>
                    </div>
                </div>

            </div>
        </vx-card>
    </div>
    <div class="vx-col sm:w-1/2 w-1/2 md:w-1/2 mb-3" style="min-width: 400px; height:450px;">
        <!-- <vx-card title="Promedios por tipo de pregunta" subtitle="Comparación por tipos de pregunta de la asignatura seleccionada">
            <e-charts autoresize :options="radar" ref="radar" auto-resize />
        </vx-card> -->
    </div>
    </div>


    <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <h5>Docentes</h5>
    <div class="w-full mb-6 img-responsive">
        <vs-chip transparent color="success"> <vs-avatar text="EL"/> Juan Perez </vs-chip>
        <vs-chip transparent color="primary"> <vs-avatar text="BA"/> Pedro Lopez </vs-chip>
        <vs-chip transparent color="warning"> <vs-avatar text="BG"/> Jorge Reyes </vs-chip>
        <vs-chip transparent color="danger"> <vs-avatar text="BG"/> Alejandro Llano </vs-chip>
        <vs-chip transparent color="primary"> <vs-avatar text="BG"/> Fernando Casame</vs-chip>
        <br>
    </div> -->


    <!-- <vx-card title="Orden de respuesta" subtitle="Indica el orden en la que la evaluacion del docente seleccionado fue resuelta" class="mb-base">
        <vue-apex-charts type="area" height="350" :options="lineAreaChartSpline.chartOptions" :series="lineAreaChartSpline.series"></vue-apex-charts>
    </vx-card> -->

</div>
</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import vSelect from 'vue-select'

    import ECharts from 'vue-echarts/components/ECharts'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/radar'
    import 'echarts/lib/chart/pie'
    import theme from './theme.json'

    import VueApexCharts from 'vue-apexcharts'

    import graficoAreas from './Reporte_barras.vue'

    ECharts.registerTheme('ovilia-green', theme)

    export default {
        data(){
            return {
                colores: ['#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0', '#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F'],
                data_areas: [],
                institucion_selected: [],
                instituciones: [],
                usuario: [],
                anio_reporte: '2021',
                promedio_instituciones: [],
                instituciones_pie: [],
                key_areas: [],
                key_asignaturas: [],
                area_selected: '',
                asignatura_selected: '',
                data_docentes_areas: [],
                data_docentes_asignaturas: [],
                activePromptExcel: false,
                fileName: null,
                formats: ['xls', 'xlsx', 'csv', 'txt'],
                selectedFormat: 'xls',
                fileNameAs: '',
                activePromptExcelAsignaturas: false,
                pie:{
                    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
                    legend: { orient: 'vertical', left: 'left', data: [], },
                    series: [
                    { name: 'Promedio', type: 'pie', radius: '55%', center: ['50%', '60%'], color: ['#FF9F43','#28C76F','#15BCE3','#83E315','#FE4D11','#1194FE','#9E11FE','#FE11DD', '#F24365'], data: [], itemStyle: { emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }
                    ]
                },

                columnInstituciones: {},
                columnChart: {},

                bar: {
                    legend: {},
                    tooltip: {},
                    dataset: {
                    // Provide data.
                    source: [
                        ['Product', '2015', '2016', '2017'],
                        ['Matcha Latte', ...this.randomize()],
                        ['Milk Tea', ...this.randomize()],
                        ['Cheese Cocoa', ...this.randomize()],
                        ['Walnut Brownie', ...this.randomize()]
                    ]
                    },
                    // Declare X axis, which is a category axis, mapping
                    // to the first column by default.
                    xAxis: { type: 'category' },
                    // Declare Y axis, which is a value axis.
                    yAxis: {},
                    // Declare several series, each of them mapped to a
                    // column of the dataset by default.
                    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]

                },

                radar:{},

                barChart: {},
                barChartTopDoc: {},

                lineAreaChartSpline: {
                    series: [{
                        name: 'Pregunta',
                        data: [1, 2, 3, 4, 5, 6, 7]
                    }],
                    chartOptions: {
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
                    xaxis: {
                        type: 'datetime',
                        categories: [
                            "2018-09-19T00:00:00",
                            "2018-09-19T06:30:00",
                            "2018-09-19T04:30:00",
                            "2018-09-19T02:30:00",
                            "2018-09-19T03:30:00",
                            "2018-09-19T01:30:00",
                            "2018-09-19T05:30:00"
                        ],
                    },
                    tooltip: {
                        x: {
                        format: 'dd/MM/yy HH:mm'
                        },

                    }
                    }
                }

            }
        },
        components: {
            'v-select': vSelect,
            flatPickr,
            ECharts,
            VueApexCharts,
            graficoAreas
        },
        mounted () {
            this.getInstituciones()
            this.getReporteInstituciones()
        },
        created(){
            this.anio_reporte = '2021'
        },
        methods: {
            randomize() {
                return [0, 0, 0].map(v => {
                    return Math.round(300 + Math.random() * 700) / 10
                })
            },
            getInstituciones(){
                let me = this
                me.$vs.loading()
                this.$http.get(this.$server_url+'instituciones_salle_select?tipo_institucion='+localStorage.Salletipo_institucion_id)
                .then(res => {
                    me.instituciones = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()
                })
            },
            getReporteInstituciones(){
                let me = this
                me.$vs.loading()
                this.$http.get(this.$server_url+'reporte_evaluaciones_institucion/1/'+localStorage.Salletipo_institucion_id)
                .then(res => {
                    me.promedio_instituciones = res.data.items
                    let promedios = []
                    let instituciones = []
                    $.each(me.promedio_instituciones,function(key, value){
                        promedios.push(value.puntaje)
                        instituciones.push(value.nombreInstitucion)

                        me.pie.series[0].data.push({
                            value: value.puntaje,
                            name: value.nombreInstitucion
                        })
                    });

                    me.columnInstituciones = {
                        series: [{
                            name: 'Promedio',
                            data: promedios
                        }],
                        chartOptions: {
                            colors: ['#28C76F'],
                            plotOptions: { bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%', }, },
                            dataLabels: { enabled: false },
                            stroke: { show: true, width: 2, colors: ['transparent'] },
                            xaxis: { categories: instituciones },
                            yaxis: { title: { text: '(Promedio)' } },
                            fill: { opacity: 1 },
                        tooltip: { y: { formatter: function(val) { return val + "%" } } }
                        }
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            },
            getPromedioAreas(){
                let me = this
                me.$vs.loading()
                this.$http.get(this.$server_url+'salle_promedio_areas/'+me.anio_reporte+'/'+me.institucion_selected.idInstitucion)
                .then(res => {
                    me.data_docentes_areas = res.data.items

                    me.data_docentes_areas.sort((a, b) => {
                        return b.puntaje_evaluacion - a.puntaje_evaluacion;
                    });

                    me.graficoTopDocAreas()

                    let areas = []
                    $.each(res.data.items,function(key, value){
                        $.each(value.areas,function(keyA, valueA){
                            areas.push({ nombre_area: valueA.nombre_area, puntaje: valueA.puntaje, id_area: valueA.id_area })
                        });
                    });

                    let areas_agrupadas = []
                    areas_agrupadas = me.groupArrayOfObjects(areas, "nombre_area")
                    me.key_areas = []
                    let key_areas_1 = []
                    $.each(areas_agrupadas,function(key, value){
                        key_areas_1.push(key)
                        me.key_areas.push(value[0])
                    });

                    let puntajes_areas = []
                    let nombre_areas = []

                    for( let i=0; i<key_areas_1.length; i++){
                        let acum_puntaje = 0

                        $.each(areas_agrupadas[key_areas_1[i]],function(key, value){
                            acum_puntaje += value.puntaje
                        });

                        let porcentaje_area = ((acum_puntaje * 100) / ((areas_agrupadas[key_areas_1[i]].length) * 100) ).toFixed(2)

                        puntajes_areas.push(porcentaje_area)
                        nombre_areas.push(key_areas_1[i])
                    }

                    me.columnChart = {
                        series: [{
                            name: 'Promedio',
                            data: puntajes_areas
                        }],
                        chartOptions: {
                            colors: ['#FF9F43','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0','#28C76F','#EA5455','#87ceeb','#7367F0'],
                            plotOptions: { bar: { horizontal: false, endingShape: 'rounded', columnWidth: '55%', }, },
                            dataLabels: { enabled: false },
                            stroke: { show: true, width: 2, colors: ['transparent'] },
                            xaxis: { categories: nombre_areas },
                            yaxis: { title: { text: '(Promedio)' } },
                            fill: { opacity: 1 },
                        tooltip: { y: { formatter: function(val) { return val + "%" } } }
                        }
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()
                })
            },
            groupArrayOfObjects(list, key) {
                return list.reduce(function(rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            getPromedioAsignaturas(area){
                let me = this
                me.area_selected = area.nombre_area
                me.$vs.loading()
                this.$http.get(this.$server_url+'salle_promedio_asignatura/'+me.anio_reporte+'/'+me.institucion_selected.idInstitucion+'/'+area.id_area)
                .then(res => {
                    me.data_docentes_asignaturas = res.data.items
                    me.data_docentes_asignaturas.sort((a, b) => {
                        return b.puntaje_evaluacion - a.puntaje_evaluacion;
                    });

                    let asignaturas = []
                    $.each(res.data.items,function(key, value){
                        $.each(value.asignaturas,function(keyA, valueA){
                            asignaturas.push({nombre_asignatura: valueA.nombre_asignatura, puntaje: valueA.puntaje })
                        });
                    });

                    let asignaturas_agrupadas = []
                    asignaturas_agrupadas = me.groupArrayOfObjects(asignaturas, "nombre_asignatura")
                    me.key_asignaturas = []
                    let key_asignaturas_1 = []


                    $.each(asignaturas_agrupadas,function(key, value){
                        key_asignaturas_1.push(key)
                        me.key_asignaturas.push(value[0])
                    });

                    var puntajes_asignaturas = []
                    var nombre_asignaturas = []
                    for( let i=0; i<key_asignaturas_1.length; i++){
                        let acum_puntaje = 0

                        $.each(asignaturas_agrupadas[key_asignaturas_1[i]],function(key, value){
                            acum_puntaje += value.puntaje
                        });

                        let porcentaje_asignatura = ((acum_puntaje) / ((asignaturas_agrupadas[key_asignaturas_1[i]].length)) ).toFixed(2)

                        puntajes_asignaturas.push(porcentaje_asignatura)
                        nombre_asignaturas.push(key_asignaturas_1[i])
                    }
                    me.barChart = {}
                    me.barChart = {
                        series: [{
                            data: puntajes_asignaturas
                        }],
                        chartOptions: {
                            colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
                            plotOptions: { bar: { horizontal: true, } },
                            dataLabels: { enabled: true },
                            xaxis: { categories: nombre_asignaturas, }
                        }
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })

            },
            getPromedioPreguntas(asignatura){
                let me = this
                me.asignatura_selected = asignatura.nombre_asignatura
            },
            graficoTopDocAreas(){
                let me = this

                let puntaje_evaluaciones = []
                let nombre_docentes = []

                $.each(me.data_docentes_areas,function(key, value){
                    puntaje_evaluaciones.push(value.puntaje_evaluacion)
                    nombre_docentes.push(value.nombre_docente)
                });

                me.barChartTopDoc = {}
                me.barChartTopDoc = {
                    series: [{
                        data: puntaje_evaluaciones
                    }],
                    chartOptions: {
                        colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
                        plotOptions: { bar: { horizontal: true, } },
                        dataLabels: { enabled: true },
                        xaxis: { categories: nombre_docentes, }
                    }
                }


            },
            exportToExcel() {
                let me = this

                let excel_areas = []
                $.each(me.data_docentes_areas,function(key, value){
                    $.each(value.areas,function(keyA, valueA){
                        excel_areas.push({ nombre_docente: value.nombre_docente, nombre_area: valueA.nombre_area, puntaje: valueA.puntaje})
                    });
                });


                let headerTitle = ['Docente', 'Area', 'Puntaje'];
                let headerVal = ['nombre_docente', 'nombre_area', 'puntaje'];

                import('@/vendor/Export2Excel').then(excel => {
                    const list = excel_areas
                    const data = this.formatJson(headerVal, list)
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: this.fileName,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                })
            },
            graficoTiposPreguntas(){
                let me = this;

                // me.$vs.loading()
                // this.$http.get(this.$server_url+'salle_promedios_tipos_pregunta/.....')
                // .then(res => {
                //     // me.radar = res.data
                //     me.$vs.loading.close()
                // })
                // .catch(function (error) {
                //     console.log(error);
                //     me.$vs.loading.close()
                // })

                me.radar = {
                    tooltip: {},
                    radar: {
                        indicator: [
                            {name: 'Seleccion simple', max: 20},
                            {name: 'Seleccion multiple', max: 20},
                            {name: 'Verdadero o falso', max: 20},
                            {name: 'Cerrada', max: 20},
                        ]
                    },
                    series: [{
                    name: 'Promedio por tipos de pregunta',
                    type: 'radar',
                    data: [{value: [19,5,14,10]}]
                    }]
                }
            },
            exportToExcelAsignaturas() {
                let me = this

                let excel_asignaturas = []
                $.each(me.data_docentes_asignaturas, function(key, value){
                    $.each(value.asignaturas,function(keyA, valueA){
                        excel_asignaturas.push({ nombre_docente: value.nombre_docente, nombre_asignatura: valueA.nombre_asignatura, puntaje: valueA.puntaje})
                    });
                });


                let headerTitle = ['Docente', 'Asignatura', 'Puntaje'];
                let headerVal = ['nombre_docente', 'nombre_asignatura', 'puntaje'];

                import('@/vendor/Export2Excel').then(excel => {
                    const list = excel_asignaturas
                    const data = this.formatJson(headerVal, list)
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: this.fileName,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    return v[j]
                }))
            },
        },
    }
</script>

<style>
.chips_selects:hover{
    background-color: black !important;
}
#div_top_1::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#div_top_1::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_top_1::-webkit-scrollbar-thumb {
  background: #ff2aa6;
  border-radius: 10px;
}

/* Handle on hover */
#div_top_1::-webkit-scrollbar-thumb:hover {
  background: #ff2da8;
}
#div_top_area::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#div_top_area::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_top_area::-webkit-scrollbar-thumb {
  background: #2ee982;
  border-radius: 10px;
}

/* Handle on hover */
#div_top_area::-webkit-scrollbar-thumb:hover {
  background: #2ee982;
}

#div_top_asignatura::-webkit-scrollbar {
  width: 10px;
}
/* Track */
#div_top_asignatura::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(211, 207, 241);
  border-radius: 10px;
}

/* Handle */
#div_top_asignatura::-webkit-scrollbar-thumb {
  background: #773BF7;
  border-radius: 10px;
}

/* Handle on hover */
#div_top_asignatura::-webkit-scrollbar-thumb:hover {
  background: #773BF7;
}
</style>
