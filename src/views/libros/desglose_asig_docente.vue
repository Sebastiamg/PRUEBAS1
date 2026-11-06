<template>
<div>

    <!-- <div class="vx-col w-full mb-3 text-center"><vs-button color="primary" type="border" class="m-1 mr-4" style="display: flex; margin-left: auto; padding: 10px 15px 10px 15px;" @click="$router.go(-1)"><b>← Volver</b></vs-button>
    </div> -->
    <vx-card>
        <center>
            <h2><b>{{nombre_curso.toUpperCase()}}</b></h2>
        </center>
        <div class="vx-row mb-6 mt-6">
            <div class="vx-col w-full sm:w-1/2 md:w-1/4 mb-base" v-for="item in data_curso" :key="item.vista">
                <vx-card class="text-center" @click="irSeleccion(item.vista)" style="cursor: pointer; min-height: 220px;">
                    <div>
                        <img class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/'+item.imagen" style="min-height: 200px;">
                    </div>
                    <p class="font-bold">
                        {{item.titulo}}
                    </p>
                </vx-card>
            </div>
        </div>

    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import cursosLibroDocente from '../docentes/cursos.vue'
import VxCard from '../../components/vx-card/VxCard.vue'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        cursosLibroDocente,
        VxCard
    },
    data() {
        return {
            val: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
            usuario: [],
            juegos: [],
            materialapoyo: [],
            unidadesLibro: [],
            planificaciones: [],

            indexUnidad: '',
            valUnidad: '',
            librosunidades: [],
            librosunidades_anim: [],
            planificacionesunidades: [],
            teletareasunidades: [],
            canteletareas: 0,
            tabMostrar: 0,
            nombrelibroSelec: '',
            idUnidad: '',
            dataLibroSelec: [],
            carpeta: '',
            juegos: [],
            materialapoyo: [],
            temas: [],
            videos: [],
            popupVideoActive: false,
            id_asignatura: '',
            data_curso: [{
                    titulo: 'Tareas',
                    vista: '/docente/curso/a_virtual/nombre_curso',
                    imagen: 'tareas.png'
                },
                {
                    titulo: 'Foros',
                    vista: '/docente/a_foros_curso',
                    imagen: 'foro.png'
                },
                {
                    titulo: 'Proyectos integradores',
                    vista: '/docente/a_proyectos',
                    imagen: 'proyecto.png'
                },
                {
                    titulo: 'Evaluaciones',
                    vista: '/docente/a_evaluaciones',
                    imagen: 'evaluacion.png'
                },
            ],
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.id_asignatura = localStorage.getItem('idasignatura')
        this.nombre_curso = localStorage.getItem('nombre_curso')
    },
    mounted() {},
    methods: {
        irSeleccion(vista) {
            this.$router.push(vista);
        },
    },
}
</script>

<style>
.tabVertical {
    cursor: pointer;

}

.tabVertical:hover {
    color: #1373FF;
}

.btn_ver {
    font-size: 14px;
    padding: 5px 15px 5px 15px !important;
}
</style>
