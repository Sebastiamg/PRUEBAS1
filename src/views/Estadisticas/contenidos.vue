<template>
<div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full md:w-2/5 p-2">
            <vx-card class="mb-base" title="Cantidad de recursos digitales">
                <table class="table table-sm">
                    <th>Contenidos</th>
                    <th>Cantidad</th>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Cursos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.cursos}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Teletareas
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.teletareas}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Libros
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.libros}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Cuadernos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.cuadernos}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Guias
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.guias}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Plan lector
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.planLector}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Planificaciones
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.planificaciones}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Material de Apoyo
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.material}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Juegos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.juegos}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Videos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{contenidos.videos}}
                        </td>
                    </tr>
                </table>
            </vx-card>
        </div>
        <div class="vx-col w-full md:w-3/5 p-2">
            <vx-card class="mb-base">
                <div class="mt-5">
                    <chartjs-component-pie-chart :height="302" :data="data" :options="options"></chartjs-component-pie-chart>
                </div>
            </vx-card>
        </div>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Libros por areas</h1>
            <vs-table max-items="10" search pagination :data="librosAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Cuadernos por areas</h1>
            <vs-table max-items="10" search pagination :data="cuadernosAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Guías por areas</h1>
            <vs-table max-items="10" search pagination :data="guiasAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Plan lector por areas</h1>
            <vs-table max-items="10" search pagination :data="planlectorAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Planificación por areas</h1>
            <vs-table max-items="10" search pagination :data="planificacionAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Material por areas</h1>
            <vs-table max-items="10" search pagination :data="materialAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Juegos por areas</h1>
            <vs-table max-items="10" search pagination :data="juegosAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
    <div class="vx-row w-full p-2">
        <vx-card>
            <h1>Videos por areas</h1>
            <vs-table max-items="10" search pagination :data="videosAreas">
                <template slot="thead">
                    <vs-th sort-key="nombrearea">Areas</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrearea">
                            {{data[indextr].nombrearea}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
</div>
</template>

<script>
import ChartjsComponentHorizontalBarChart from './charts-components/ChartjsComponentHorizontalBarChart.vue'
import ChartjsComponentPieChart from './charts-components/ChartjsComponentPieChart.vue'
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    components: {
        ChartjsComponentHorizontalBarChart,
        ChartjsComponentPieChart
    },
    data() {
        return {
            isNavOpen: false,
            contenidos: [],
            librosAreas: [],
            cuadernosAreas: [],
            planlectorAreas: [],
            planificacionAreas: [],
            materialAreas: [],
            juegosAreas: [],
            videosAreas: [],
            guiasAreas: [],
            libros: 0,
            cuadernos: 0,
            guias: 0,
            planlector: 0,
            planificacion: 0,
            material: 0,
            juegos: 0,
            videos: 0,
            cursos: 0,
            data: {
                labels: ['Cursos', 'Teleareas', 'Libros', 'Cuadernos', 'Guias', 'Plan Lector', 'Planificaciones', 'Material de Apoyo', 'Juegos', 'Videos'],
                datasets: [{
                    label: 'Cantidad',
                    backgroundColor: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E', '#046AE7', '#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E', '#046AE7'],
                    data: []
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Material digital del docente'
                }
            }
        }
    },
    created() {
        this.contenidos = JSON.parse(localStorage.getItem("contenidos"));
        this.data.datasets[0].data = [this.contenidos.cursos, this.contenidos.teletareas, this.contenidos.libros, this.contenidos.cuadernos, this.contenidos.guias, this.contenidos.planLector, this.contenidos.planificaciones, this.contenidos.material, this.contenidos.juegos, this.contenidos.videos]
    },
    mounted() {
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
        this.getLibros();
        this.getCuadernos();
        this.getGuias();
        this.getPlanlector();
        this.getPlanificacion();
        this.getMaterial();
        this.getJuegos();
        this.getVideos();
    },
    methods: {
        getLibros() {
            let me = this;
            this.$http.get(this.$server_url+"api/Alibros?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.librosAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getCuadernos() {
            let me = this;
            this.$http.get(this.$server_url+"api/Acuadernos?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.cuadernosAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getGuias() {
            let me = this;
            this.$http.get(this.$server_url+"api/Aguias?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.guiasAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getPlanlector() {
            let me = this;
            this.$http.get(this.$server_url+"api/Aplanlector?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.planlectorAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getPlanificacion() {
            let me = this;
            this.$http.get(this.$server_url+"api/Aplanificacion?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.planificacionAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getMaterial() {
            let me = this;
            this.$http.get(this.$server_url+"api/Amaterial?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.materialAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getJuegos() {
            let me = this;
            this.$http.get(this.$server_url+"api/Ajuegos?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.juegosAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
        getVideos() {
            let me = this;
            this.$http.get(this.$server_url+"api/Avideos?idinstitucion=" + JSON.parse(localStorage.institucion).idInstitucion)
                .then(res => {
                    me.videosAreas = res.data
                })
                .catch(err => {
                    console.error(err);
                })
        },
    },
}
</script>
