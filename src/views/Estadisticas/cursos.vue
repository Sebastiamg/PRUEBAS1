<template>
<div>
    <div class="w-full p-2">
        <vs-card class="p-2">
            <vs-button  to="./estadisticas" type="line"><h1>{{institucion.nombreInstitucion}}</h1></vs-button>
            <p>Teléf. {{institucion.telefonoInstitucion}}</p>
            <span>Dirección: {{institucion.direccionInstitucion}}</span>
            <div class="text-center">
                <vs-button  to="./informacion" type="line"><h3>{{docente[0]}}</h3></vs-button>
                <p>C.I. {{docente[3]}}</p>
            </div>
        </vs-card>
    </div>
    <div class="flex mb-4">
        <div class="w-full h-12 p-4">
            <vs-card>
                <vs-table max-items="10" size="small" pagination search :data="cursos">
                    <template slot="header">
                        <h3>Listado de cursos</h3>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="nombre">Curso</vs-th>
                        <vs-th sort-key="paralelo">Estudiantes</vs-th>
                        <!-- <vs-th sort-key="paralelo">Información</vs-th> -->
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="tr.nombre">
                                {{ tr.nombre }}
                            </vs-td>
                            <vs-td :data="tr.estudiantes">
                                {{ tr.estudiantes }}
                            </vs-td>
                            <!-- <vs-td :data="tr.idusuario">
                                <vs-button size="small" icon-pack="feather" icon="icon-info" class="mr-2" color="success" @click="getInformacion(tr.codigo)"></vs-button>
                            </vs-td> -->
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-card>
        </div>
        <!-- <div class="w-3/5 h-12 p-4">
            <vx-card class="mb-base">
                <div class="mt-5">
                    <chartjs-component-pie-chart :height="250" :data="data" :options="options"></chartjs-component-pie-chart>
                </div>
                <template slot="codeContainer">
                </template>
            </vx-card>
        </div> -->
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
import ChartjsComponentHorizontalBarChart from './charts-components/ChartjsComponentHorizontalBarChart.vue'
export default {
    data() {
        return {
            isNavOpen: false,
            docente: [],
            institucion: [],
            cursos: [],
            labels: [],
            accesos: [],
            data: {
                labels: [],
                datasets: [{
                    label: 'Accesos Plataforma',
                    backgroundColor: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E', '#046AE7'],
                    data: [10, 10, 10, 10, 10, 10]
                }]
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Estudiantes'
                }
            }
        }
    },
    mounted() {
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
    },
    created() {
        this.institucion = JSON.parse(localStorage.getItem("institucion"));
        this.docente = JSON.parse(localStorage.getItem("docente"));
        this.cursos = JSON.parse(localStorage.getItem("infocurso"));
        this.data.labels = JSON.parse(localStorage.getItem("labels"));
        this.data.datasets[0].data = JSON.parse(localStorage.getItem("dtaccesos"));
    },
    components: {
        ChartjsComponentPieChart
    },
    methods: {
        async getInformacion(id) {
            
        }
    },
}
</script>
