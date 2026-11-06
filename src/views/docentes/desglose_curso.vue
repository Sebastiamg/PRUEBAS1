<template>
<div id="knowledge-base-category-page">
    <vx-card>
        <div v-if="grupo_usuario == 10">
            <p><b>Nombre:</b> {{datoU.nombres}} {{datoU.apellidos}} </p>
            <p><b>Email:</b> {{datoU.email}} </p>
            <p><b>Cédula:</b> {{datoU.cedula}} </p>
        </div>
        <div class="vx-col w-full mb-6 text-center">
            <!-- <vs-button color="primary" type="border" class="m-1 mr-4" style="display: flex; margin-left: auto; padding: 10px 15px 10px 15px;" @click="$router.go(-1)"><b>← Volver</b></vs-button> -->
            <h2><b>{{nombre_curso}}</b></h2>
        </div>
        <div v-if="grupo_usuario == 10">
            <div class="vx-row mt-4 match-height">
                <div class="vx-col w-full sm:w-1/2 md:w-1/4 mb-base" v-for="item in data_curso_director" :key="item.vista">
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
        </div>
        <div v-else>
            <div class="vx-row mt-4 match-height">
                <div class="vx-col w-full sm:w-1/2 md:w-1/4 mb-base" v-for="item in data_curso" :key="item.vista">
                    <vx-card class="text-center" @click="irSeleccion(item.vista)" style="cursor: pointer; min-height: 220px;">
                        <div v-if="item.titulo == 'Necesidad Educativas'">
                            <img class="responsive card-img-top" src="@/assets/images/home/docenteHome/neet.png" style="min-height: 200px;">
                        </div>
                        <div v-else>
                          <img class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/'+item.imagen" style="min-height: 200px;">
                        </div>
                        <p class="font-bold">
                            {{item.titulo}}
                        </p>
                    </vx-card>
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
import NeetRepository from '@/repositories/NeetRepository'
Vue.use(axios)

export default {
    data() {
        return {
            nombre_curso: '',
            data_curso: [{
                    titulo: 'Tareas',
                    vista: '/docente/curso/virtual/nombre_curso',
                    imagen: 'tareas.png'
                },
                {
                    titulo: 'Foros',
                    vista: '/docente/foros_curso',
                    imagen: 'foro.png'
                },
                {
                    titulo: 'Actividades',
                    vista: '/docente/actividades_curso',
                    imagen: 'actividad.png'
                },
                {
                    titulo: 'Proyectos integradores',
                    vista: '/docente/proyectos2',
                    imagen: 'proyecto.png'
                },
                {
                    titulo: 'Evaluaciones',
                    vista: '/evaluaciones',
                    imagen: 'evaluacion.png'
                },
            ],
            data_curso_recurso_externo: [{
                    titulo: 'Tareas',
                    vista: '/colegios/docente/curso/virtual/nombre_curso',
                    imagen: 'tareas.png'
                },
                {
                    titulo: 'Foros',
                    vista: '/colegios/docente/foros_curso',
                    imagen: 'foro.png'
                },
                {
                    titulo: 'Actividades',
                    vista: '/colegios/docente/actividades_curso',
                    imagen: 'actividad.png'
                },
                {
                    titulo: 'Evaluaciones',
                    vista: '/colegios/evaluaciones',
                    imagen: 'evaluacion.png'
                },
            ],
            data_curso_director: [{
                    titulo: 'Tareas',
                    vista: '/director/institucion/docentes/contenidos/libro/curso/tarea',
                    imagen: 'tareas.png'
                },
                {
                    titulo: 'Foros',
                    vista: '/director/institucion/docentes/contenidos/libro/curso/foro',
                    imagen: 'foro.png'
                },
                {
                    titulo: 'Actividades',
                    vista: '/director/institucion/docentes/contenidos/libro/curso/actividades',
                    imagen: 'actividad.png'
                },
                {
                    titulo: 'Proyectos integradores',
                    vista: '/director/institucion/docentes/contenidos/libro/curso/proyectos',
                    imagen: 'proyecto.png'
                },
                {
                    titulo: 'Evaluaciones',
                    vista: '/director/institucion/docentes/contenidos/libro/curso/evaluaciones',
                    imagen: 'evaluacion.png'
                },
            ],
            grupo_usuario: '',
            idusuario: '',
            datoU: '',
            //variables para necesidades educativas
            arregloAsignados:[],
            //fin variables para necesidades educativas
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.nombre_curso = localStorage.nombre_curso
        // console.log(localStorage.nombreasignatura)
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        console.log(this.grupo_usuario,"iddddddddd");
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }
    },
    mounted() {
      let me = this;
      me.getNecesidadesEducativas()
    },
    computed: {

    },
    methods: {
        irSeleccion(vista) {
          this.$router.push(vista);
        },
        getNecesidadesEducativas(){
          let me = this
          const { idusuario,institucion_idInstitucion } = me.usuario
          NeetRepository.getNecesidadesEducativasxUsuario(idusuario,institucion_idInstitucion).then( r => {
            me.arregloAsignados = r.data
            if(me.arregloAsignados.length > 0){
              me.setNecesidad()
            }
          })
        },
        setNecesidad(){
          let me = this
          const ObjectNecesidad = {
            titulo: 'Necesidad Educativas',
            vista: '/docente/curso/necesidad/educativas',
            imagen: '@/assets/images/home/docenteHome/neet.png'
          }
          me.data_curso = [ObjectNecesidad,...me.data_curso]
        }
    },
    components: {
        'v-select': vSelect
    },
}
</script>
