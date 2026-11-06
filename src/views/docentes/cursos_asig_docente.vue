<!-- =========================================================================================
    File Name: KnowledgeBaseCategory.vue
    Description: Knowledge Base Category Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div id="knowledge-base-category-page">
    <!-- <div class="vx-col w-full mb-6 text-center">
        <vs-button color="primary" type="border" class="m-1 mr-4" style="display: flex; margin-left: auto; padding: 10px 15px 10px 15px;" @click="$router.go(-1)"><b>← Volver</b></vs-button>
    </div> -->

    <vx-card class="">
       <center> <h2><b>{{nombre_asignatura}}</b></h2></center>
        <vs-collapse :type="type">
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-folder">
                <div slot="header">
                    Cursos
                </div>
                <vs-button class="m-1" color="dark" type="relief" to="/docente/curso/nuevo" @click="nuevo()">Agregar Curso</vs-button>

                <div class="vx-row mt-4 match-height">
                    <div class="vx-col w-full sm:w-1/2 md:w-1/3 mb-base" v-for="section in curso" :key="section.id">
                        <!-- <vx-card title-color="#fff" content-color="#fff" card-background="linear-gradient(360deg, #2573EA, #86a8e7, #fff)"> -->
                        <vx-card class="text-center" :title="section.nombre+' '+section.seccion">
                            <img src="@/assets/images/pages/graphic-3.png" alt="graphic" width="100" class="mx-auto">
                            <h5 class="form-control"><b></b></h5>
                            <h5 class="form-control"><b>{{ section.aula }}</b></h5>
                            <span class="">Paralelo</span>
                            <h5 class="form-control"><b>{{ section.codigo }}</b></h5>
                            <span class="">Código de la clase</span>

                            <div class=" mt-2" align="center">
                                <vx-tooltip color="primary" text="Ver curso" style="display: inline-block;">
                                    <vs-button radius color="primary" type="border" icon-pack="feather" icon="icon-search" @click="verClase(section)" class="m-2"></vs-button>
                                </vx-tooltip>

                                <vx-tooltip color="success" text="Editar curso" style="display: inline-block;">
                                    <vs-button radius color="success" type="border" icon-pack="feather" icon="icon-edit" @click="editar(section.idcurso)" class="m-2"></vs-button>
                                </vx-tooltip>

                                <vx-tooltip color="danger" text="Eliminar curso" style="display: inline-block;">
                                    <vs-button radius color="danger" type="border" icon-pack="feather" icon="icon-trash" @click="eliminar(); idcurso = section.idcurso" class="m-2"></vs-button>
                                </vx-tooltip>
                            </div>
                        </vx-card>
                    </div>
                </div>
            </vs-collapse-item>

            <vs-collapse-item icon-pack="feather" icon-arrow="icon-book">
                <div slot="header">
                    Recursos adicionales
                </div>
                <div class="vx-row w-full mb-6" align="center">
                    <!-- <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 270px;">
                        <vx-card class="text-center" style="min-height: 270px; cursor: pointer;" @click="$router.push('/docente/a_tipos_juegos_docente')">
                            <div slot="no-body">
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_juego.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Zona de diversión
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div> -->

                    <!-- <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 270px;">
                        <vx-card class="text-center" style="min-height: 270px; cursor: pointer;" @click="$router.push('/docente/a_materialapoyo')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_material.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Material de apoyo
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div> -->

                    <!-- <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 270px;">
            <vx-card class="text-center" style="min-height: 270px; cursor: pointer;" @click="$router.push('/listaw')">
                <div slot="no-body">
                    <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_proyecto.png'">
                </div>
                <div class="mt-2">
                    <div class="w-3/3 mt-2 ml-auto">
                        <p class="font-bold">
                            Proyectos integradores
                        </p>
                    </div>
                </div>
            </vx-card>
        </div> -->

                    <!-- <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 270px;">
                        <vx-card class="text-center" style="min-height: 270px; cursor: pointer;" @click="$router.push('/docente/a_propuestas')">
                            <div slot="no-body">
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/propuesta.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Propuestas metodólogicas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/a_adaptaciones')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/adaptacion.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Adaptaciones curriculares
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div> -->

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 270px;">
                        <vx-card class="text-center" style="min-height: 270px; cursor: pointer;" @click="$router.push('/docente/a_vpublicaciones')">
                            <div slot="no-body">
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/desglose_libros/img_articulo.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Artículos pedagógicos
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="$router.push('/diccionario')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="'https://png.pngtree.com/png-vector/20191022/ourlarge/pngtree-dictionary-of-english-language-icon-cartoon-style-png-image_1837699.jpg'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Glosario
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>                   

                </div>
            </vs-collapse-item>
        </vs-collapse>
    </vx-card>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)

export default {
    data() {
        return {
            popupActive: false,
            instituciones: [],
            ciudades: [],
            ciudad: '',
            institucion: '',
            curso: [],
            usuario: [],
            idcurso: '',
            promptCargarAsig: false,
            currentx: 1,
            otraActivo: false,
            nombre_otra_asignatura: '',
            nombre_asignatura: '',
            type: 'margin',
            grupo_usuario: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.nombre_asignatura = localStorage.nombreasignatura
        this.id_asignatura = localStorage.idasignatura
        this.grupo_usuario = this.usuario.id_group;
    },
    computed: {},
    methods: {
        getCurso() {
            let me = this;
            this.$http.get(this.$server_url+'curso_asig_docente/' + me.id_asignatura)
                .then(function (response) {
                    me.curso = response.data;
                })
                .catch(function (error) {})
        },
        verClase(section) {
            localStorage.nombrelibroSelec = section.nombre + ' ' + section.seccion;
            localStorage.nombre_curso = section.nombre + ' ' + section.seccion;
            localStorage.codigo = section.codigo;
            localStorage.idcurso = section.idcurso;

            this.$router.push(`/docente/libro/desglose_asig_docente`);
        },
        nuevo() {
            localStorage.idcurso = '';
        },
        editar(idcurso) {
            localStorage.idcurso = idcurso;
            this.$router.push(`/docente/curso/editar`);
        },
        eliminar() {
            this.$vs.dialog({
                color: 'danger',
                title: `Eliminar Curso`,
                text: 'Seguro desea eliminar?',
                accept: this.acceptAlert,
            })
        },
        acceptAlert() {
            let me = this;
            this.$http.get(this.$server_url+"eliminarCurso?idcurso=" + me.idcurso)
                .then(function (response) {
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Curso eliminado'
                    })
                    me.getCurso();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        color: 'danger',
                        title: 'Error',
                        text: error
                    })
                })
        },

    },
    components: {
        'v-select': vSelect
    },
    mounted() {
        this.getCurso();
    }
}
</script>
