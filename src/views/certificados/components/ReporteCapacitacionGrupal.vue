<template>
    <div>
        <vs-divider>Filtro de Reporte</vs-divider>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-500" >
                <div>
                    Seleccione el período a filtrar
                    <v-select :options="periodos" @input="getReporte()" :reduce="periodos => periodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="valorSelect" />
                </div>    
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-500" >   
                <vs-button  @click="getReporte()" class="mt-5" color="primary" type="border" icon="search">Buscar</vs-button>
            </div>
        </div>
        <div v-if="tipo == 1">
            <apexchart
            type="bar"
            height="350"
            :options="options"
            :series="[series[0]]"
            ></apexchart>
        </div>
       <br><br><br><br><br><br><br><br><br><br>
    </div>
</template>
<script>
import vSelect from 'vue-select';
import chart from "vue-apexcharts";
export default{
    components: { apexchart: chart,vSelect },
    data(){
        return{
            valorSelect:'',
            tipo:0,
            series: [{
                name: 'Reporte Capacitaciones',
                data: [1,5,6,8,10,6,1]
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
                        return val + ' Capacit.';
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ['#304758'],
                    },
                },
                xaxis: {
                    categories: [
                       
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
    props:{
        lista_asesores:{
            type:Array,
            default:[],
        },
        periodos:{
            type:Array,
            default:[],
        },
        arregloCapacitadores:{
            type:Array,
            default:[],
        },
    },
    mounted(){
        let me = this;
    },
    methods:{
        getReporte(){
            let me = this;
            me.tipo = 0;
            console.log("rap")
            this.series[0].data = []
            if( me.valorSelect == "" || me.valorSelect == null || me.valorSelect == undefined ){
                me.$vs.notify({
                text:'Seleccione algun valor de filtro',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporteCapacitacionesGrupal/'+me.valorSelect)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.pasarInfo(res.data) 
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        pasarInfo(item){
            let me = this
            const names                     = item.map(p => p.capacitador.substring(0,17)+'..');
            const valores                   = item.map(p => p.contador);
            this.options.xaxis.categories   = names
            this.series[0].data             = valores;
            me.tipo = 1         
            setTimeout(function() {me.$vs.loading.close()}, 2000);
        },
    }
    
}
</script>