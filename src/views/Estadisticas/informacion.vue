<template>
<div>
    <div class="w-full p-2">
        <div class="w-full p-2">
            <vs-card class="p-2">
                <vs-button to="./estadisticas" type="line">
                    <h1>{{institucion.nombreInstitucion}}</h1>
                </vs-button>
                <p>Teléf. {{institucion.telefonoInstitucion}}</p>
                <span>Dirección: {{institucion.direccionInstitucion}}</span>
                <div class="text-center">
                    <vs-button to="./informacion" type="line">
                        <h3>{{docente[0]}}</h3>
                    </vs-button>
                    <p>C.I. {{docente[3]}}</p>
                </div>
            </vs-card>
        </div>
    </div>
    <div class="flex mb-4">
        <div class="w-2/5 h-12 p-4">
            <vx-card class="mb-base" title="Cantidad de recursos digitales">
                <table class="table">
                    <th>Contenidos</th>
                    <th>Cantidad</th>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" to="/infocursos" type="flat">
                                Cursos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{getCursos()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Libros
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{getLibros()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Cuadernos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{getCuadernos()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Guias
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{getGuias()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Plan lector
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{getPlanlector()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Planificaciones
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{getPlanificaciones()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Material de Apoyo
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{Material()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Juegos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{Juegos()}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <vs-button class="texto" color="primary" type="flat">
                                Videos
                            </vs-button>
                        </td>
                        <td class="text-center">
                            {{Videos()}}
                        </td>
                    </tr>
                </table>
            </vx-card>
        </div>
        <div class="w-3/5 h-12 p-4">
            <vx-card class="mb-base">
                <div class="mt-5">
                    <!-- <chartjs-component-horizontal-bar-chart :height="250" :data="data" :options="options"></chartjs-component-horizontal-bar-chart> -->
                    <chartjs-component-pie-chart :height="250" :data="data" :options="options"></chartjs-component-pie-chart>
                </div>
            </vx-card>
        </div>
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
    data() {
        return {
            institucion: [],
            docente: [],
            cursos: [],
            data: {
                labels: ['Cursos', 'Libros', 'Cuadernos', 'Guias', 'Plan Lector', 'Planificaciones', 'Material de Apoyo', 'Juegos', 'Videos'],
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
        this.institucion = JSON.parse(localStorage.getItem("institucion"));
        localStorage.removeItem('labels');
        localStorage.removeItem('dtaccesos');
        this.docente = JSON.parse(localStorage.getItem("docente"));
        var cursos = JSON.parse(localStorage.getItem("cursos"));
        var libros = JSON.parse(localStorage.getItem("libros"));
        var cuadernos = JSON.parse(localStorage.getItem("cuadernos"));
        var guias = JSON.parse(localStorage.getItem("guia"));
        var planlector = JSON.parse(localStorage.getItem("planlector"));
        var planificacion = JSON.parse(localStorage.getItem("planificacion"));
        var material = JSON.parse(localStorage.getItem("material"));
        var juegos = JSON.parse(localStorage.getItem("juegos"));
        var videos = JSON.parse(localStorage.getItem("videos"));
        var auxc = 0;
        var auxl = 0;
        var auxcu = 0;
        var auxg = 0;
        var auxp = 0;
        var auxpl = 0;
        var auxm = 0;
        var auxj = 0;
        var auxv = 0;
        console.log(guias.length);
        if (cursos.length > 0) {
            auxc = cursos.length;
        } else {
            auxc = 0;
        }
        if (libros.length > 0) {
            auxl = libros.length;
        } else {
            auxl = 0;
        }
        if (cuadernos.length > 0) {
            auxcu = cuadernos.length;
        } else {
            auxcu = 0;
        }
        if (guias.length > 0) {
            auxg = guias.length;
        } else {
            auxg = 0;
        }
        if (planlector.length > 0) {
            auxp = planlector.length;
        } else {
            auxp = 0;
        }
        if (planificacion.length > 0) {
            auxpl = planificacion.length;
        } else {
            auxpl = 0;
        }
        if (material.length > 0) {
            auxm = material.length;
        } else {
            auxm = 0;
        }
        if (juegos.length > 0) {
            auxj = juegos.length;
        } else {
            auxj = 0;
        }
        if (videos.length > 0) {
            auxv = videos.length;
        } else {
            auxv = 0;
        }
        this.data.datasets[0].data = [auxc, auxl, auxcu, auxg, auxp, auxpl, auxm, auxj, auxv]
        console.log(this.data.datasets[0].data)
    },
    components: {
        ChartjsComponentHorizontalBarChart,
        ChartjsComponentPieChart
    },
    methods: {
        getCursos() {
            let me = this;
            var cursos = JSON.parse(localStorage.getItem("cursos"));
            var auxc = 0;
            if (cursos.length > 0) {
                auxc = cursos.length;
                cursos.forEach(element => {
                    var curs = Object();
                    curs.idcurso = element.idcurso
                    curs.nombre = element.nombre
                    this.$http.get(this.$server_url+"calificacion?codigo=" + element.codigo)
                        .then(res => {
                            console.log(res.data.items)
                            try {
                                if (res.data.items.length > 0) {
                                    curs.estudiantes = res.data.items.length
                                } else {
                                    curs.estudiantes = 0
                                }
                                me.cursos.push(curs);
                                localStorage.setItem('infocurso', JSON.stringify(me.cursos));
                            } catch (error) {
                                curs.estudiantes = 0
                                me.cursos.push(curs);
                                localStorage.setItem('infocurso', JSON.stringify(me.cursos));
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        })

                    setTimeout(function () {
                        // me.$vs.loading.close()
                    }, 5000);
                });
            } else {
                localStorage.removeItem('infocurso')
                auxc = 0;
            }
            return auxc;
        },
        getLibros() {
            var libros = JSON.parse(localStorage.getItem("libros"));
            var auxc = 0;
            if (libros.length > 0) {
                auxc = libros.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        getCuadernos() {
            var cuadernos = JSON.parse(localStorage.getItem("cuadernos"));
            var auxc = 0;
            if (cuadernos.length > 0) {
                auxc = cuadernos.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        getGuias() {
            var guia = JSON.parse(localStorage.getItem("guia"));
            var auxc = 0;
            if (guia.length > 0) {
                auxc = guia.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        getPlanificaciones() {
            var planificacion = JSON.parse(localStorage.getItem("planificacion"));
            var auxc = 0;
            if (planificacion.length > 0) {
                auxc = planificacion.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        getPlanlector() {
            var planlector = JSON.parse(localStorage.getItem("planlector"));
            var auxc = 0;
            if (planlector.length > 0) {
                auxc = planlector.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        Material() {
            var material = JSON.parse(localStorage.getItem("material"));
            var auxc = 0;
            if (material.length > 0) {
                auxc = material.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        Juegos() {
            var juegos = JSON.parse(localStorage.getItem("juegos"));
            var auxc = 0;
            if (juegos.length > 0) {
                auxc = juegos.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
        Videos() {
            var videos = JSON.parse(localStorage.getItem("videos"));
            var auxc = 0;
            if (videos.length > 0) {
                auxc = videos.length;
            } else {
                auxc = 0;
            }
            return auxc;
        },
    },
}
</script>

<style>
.texto {
    align-content: flex-start;
    text-align: left;
}
</style>
