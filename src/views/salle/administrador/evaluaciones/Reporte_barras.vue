<template>
<div>

    <e-charts autoresize :options="bar_asig" ref="bar" theme="ovilia-green" auto-resize />

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
    import theme from './theme.json'


    ECharts.registerTheme('ovilia-green', theme)

    export default {
        data(){
            return {
                bar_asig: {
                    legend: {},
                    tooltip: {},
                    dataset: {
                    // Provide data.
                    source: [
                        ['Matemática', '65'],
                        ['Lenguaje', '70'],
                        ['CCNN', '45'],
                        ['Sociales', '93'],
                        ['Química', '85'],
                        ['Computación', '85'],
                        ['Civica', '85'],
                    ]
                    },
                    // Declare X axis, which is a category axis, mapping
                    // to the first column by default.
                    xAxis: { type: 'category' },
                    // Declare Y axis, which is a value axis.
                    yAxis: {},
                    // Declare several series, each of them mapped to a
                    // column of the dataset by default.
                    series: [{ type: 'bar' }]

                },
                
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr,
            ECharts
        },
        mounted () {
            
        },
        created(){
            
        },
        methods: {
            randomize() {
                return [0, 0, 0].map(v => {
                    return Math.round(300 + Math.random() * 700) / 10
                })
            },
            
        },
    }
</script>