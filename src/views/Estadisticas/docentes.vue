<template>
<div>
    <div class="flex">
        <div class="vx-col w-full md:w-3/5 p-2">
            <vx-card title="Reporte de accesos a la plataforma" class="mb-base">
                <div class="">
                    <div class="vx-row" v-for="(item,index) in datos" :key="index">
                        <div class="vx-col sm:w-2/5 w-full">
                            <vs-button class="btn" size="small" color="primary" @click="getInformacion(item[2],item)" type="flat"><span class="textdocente">{{item[0]}}</span></vs-button>
                        </div>
                        <div class="vx-col sm:w-3/5 w-full">
                            <vx-tooltip :text="'Cantidad de Accesos = '+item[1]" position="right">
                                <vs-progress :percent="item[1]*0.1" color="primary"></vs-progress>
                            </vx-tooltip>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <div class="vx-col w-full md:w-2/5 p-2">
            <vs-card>
                <chartjs-component-pie-chart :height="300" :data="data" :options="options"></chartjs-component-pie-chart>
            </vs-card>
        </div>
    </div>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
import ChartjsComponentPieChart from './charts-components/ChartjsComponentPieChart.vue'
export default {
    data() {
        const data = JSON.parse(localStorage.getItem("data"));
        var dateList = data.map(function (item) {
            return item[0];
        });
        var valueList = data.map(function (item) {
            return item[1];
        });
        return {
            datos: [],
            isNavOpen: false,
            usuario: [],
            docentes: [],
            institucion: [],
            data: {
                labels: ['Sin accesos', 'Con accesos'],
                datasets: [{
                    label: 'Cantidad: ',
                    backgroundColor: ['#EA5455', '#28C76F', '#1E1E1E'],
                    data: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Reporte de accesos'
                }
            }
        }
    },
    components: {
        ChartjsComponentPieChart
    },
    created() {
        this.datos = JSON.parse(localStorage.getItem("data")).sort();
        var colores = [];
        for (let index = 0; index < 1000; index++) {
            colores.push('#3e95cd')
        }
        console.log(this.data.labels[0].backgroundColor);
        this.data.datasets[0].data = [localStorage.sinaccesos, localStorage.conaccesos]
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
        this.docentes = JSON.parse(localStorage.getItem("docentes")).sort();
        this.institucion = JSON.parse(localStorage.getItem("institucion"));
    },
    mounted() {
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
    },
    methods: {
        getInformacion(id, item) {
            let me = this;
            localStorage.setItem('docente', JSON.stringify(item));
            this.$http.get(this.$server_url+"libros?idusuario=" + id+'&periodo_id='+localStorage.periodo_id)
                .then(res => {
                    localStorage.setItem('libros', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"cuadernos?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('cuadernos', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"guia?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('guia', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"planlector?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('planlector', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"planificacion?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('planificacion', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"curso?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('cursos', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"material?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('material', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"juegos?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('juegos', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            this.$http.get(this.$server_url+"video?idusuario=" + id)
                .then(res => {
                    localStorage.setItem('videos', JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error(err);
                })
            me.$router.push('/informacion');
        }

    },
}
</script>

<style>
.textinst {
    font-size: 10px;
}

.textdocente {
    font-size: 8px;
    text-align: left;
}

.divinst {
    height: 40px;
}

.btn {
    text-align: left;
}
</style>
