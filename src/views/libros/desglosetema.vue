<template>
<div>
    <vs-popup title="Ver video" :active.sync="popupVideoActive">
        <div class="text-center" id="video">
            <youtube class="float-center" :video-id="youtube"></youtube>
        </div>
    </vs-popup>

    <div class="vx-row">
        <div class="vx-col w-full">

            <!-- <div class="vx-col w-full mb-6 text-center">
                <vs-button color="primary" type="border" class="m-1 mr-4" style="display: flex; margin-left: auto; padding: 10px 15px 10px 15px;" @click="$router.go(-1)"><b>← Volver</b></vs-button>
            </div> -->

            <vx-card class="text-center mb-4">
                <h3><b>{{nombrelibroSelec+' - UNIDAD '+ valUnidad}}<br>TEMA: {{nombre_tema}}</b></h3>
                <div class="vx-row mb-6 mt-6">
                    <div class="vx-col sm:w-1/5 w-full" align="left" style="border-right: 1px solid #EAEAEA;">
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=1">Actividades ({{cantactividades}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=2">Animaciones ({{cantanimaciones}})</vs-button>
                        <!--<vs-button color="dark" type="line" class="m-1 w-full"  @click="tabMostrar=3">Planificaciones ({{cantplanificaciones}})</vs-button>-->
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=4">Teletareas ({{canteletareas}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=5">Juegos ({{juegos.length}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=6">Material apoyo ({{materialapoyo.length}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=7">Videos ({{videos.length}})</vs-button>
                    </div>

                    <div class="vx-col sm:w-4/5 w-full text-left">

                        <vs-list v-if="tabMostrar===1">
                            <vs-list-header title="Actividades" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in librosunidades" :key="$index" v-bind:title="item.nombre_tema +' - pág. '+ item.page">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-file" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verActividad(item.link, 'actividades')">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===2">
                            <vs-list-header title="Animaciones" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in librosunidades_anim" :key="$index" v-bind:title="item.nombre_tema +' - pág. '+ item.page">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-play" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verActividad(item.link, 'animaciones')">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <!-- <vs-list v-if="tabMostrar===3">
                <vs-list-header title="Planificaciones" color="warning"></vs-list-header>
                <vs-list-item v-for="(item,$index) in planificacionesunidades" :key="$index" v-bind:title="item.nombreplanificacion" subtitle="">
                    <template slot="avatar">
                    <vs-avatar color="warning" icon-pack="feather" icon="icon-file" />
                    </template>
                    <vs-button color="primary" class="btn_ver" @click="verPlanificacion(item.webplanificacion)">Ver</vs-button>
                </vs-list-item>
                </vs-list> -->

                        <vs-list v-if="tabMostrar===4">
                            <vs-list-header title="Teletareas" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in teletareasunidades" :key="$index" v-bind:title="item.nombre" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-file" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verTeletarea(item)">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===5">
                            <vs-list-header title="Juegos" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in juegos" :key="$index" v-bind:title="item.nombre" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-award" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verJuego(item.carpeta)">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===6">
                            <vs-list-header title="Material de apoyo" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in materialapoyo" :key="$index" v-bind:title="item.nombrematerial" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-folder" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verMaterial(item.webmaterial)">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===7">
                            <vs-list-header title="Videos" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in videos" :key="$index" v-bind:title="item.nombrevideo" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-video" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verVideo(item.webvideo)">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>
                    </div>
                </div>
            </vx-card>
        </div>

    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import {
    getIdFromUrl
} from 'vue-youtube'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idlibro: '',
            indexUnidad: '',
            valUnidad: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
            usuario: [],
            librosunidades: [],
            librosunidades_anim: [],
            planificacionesunidades: [],
            teletareasunidades: [],
            cantactividades: 0,
            cantanimaciones: 0,
            cantplanificaciones: 0,
            canteletareas: 0,
            tabMostrar: 1,
            nombrelibroSelec: '',
            idUnidad: '',
            dataLibroSelec: [],
            carpeta: '',
            juegos: [],
            materialapoyo: [],
            temas: [],
            videos: [],
            popupVideoActive: false,
            youtube: 'DUWPEW63a4c'
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.idlibro = localStorage.getItem('idlibro')
        this.indexUnidad = localStorage.getItem('indexUnidad')
        this.valUnidad = localStorage.getItem('valUnidad')
        this.nombrelibroSelec = localStorage.getItem('nombrelibroSelec')
        this.idUnidad = localStorage.getItem('idUnidad')
        this.carpeta = localStorage.getItem('carpetaLibroSelec')
        this.idtemaSelec = localStorage.getItem('idtemaSelec')
        this.nombre_tema = localStorage.getItem('nombre_tema')
    },
    mounted() {
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this
            me.$vs.loading()

            this.$http.get(this.$server_url+'actividades_libros_unidad_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.librosunidades = response.data
                    me.cantactividades = response.data.length
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'animaciones_libros_unidad_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.librosunidades_anim = response.data
                    me.cantanimaciones = response.data.length
                })
                .catch(function (error) {}),

                /*this.$http.get(this.$server_url+'planificacionesunidades_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.planificacionesunidades = response.data
                    me.cantplanificaciones = response.data.length
                })
                .catch(function (error) {})*/

                this.$http.get(this.$server_url+'teletareasunidades_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.teletareasunidades = response.data
                    me.canteletareas = response.data.length
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'juegos_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.juegos = response.data
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'materialapoyolibro_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.materialapoyo = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'videos_libro_tema/' + me.idtemaSelec)
                .then(function (response) {
                    me.videos = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {})
        },
        verActividad(link, folder) {
            localStorage.vistalibro = 'todo'
            localStorage.url_actividad = this.carpeta + '/' + folder + '/' + link + '.html';
            this.$router.push('/docente/libro/digital');
        },
        verPlanificacion(web) {
            window.open(this.$data_url+'archivos/upload/planificacion/' + web, '_blank');
        },
        verTeletarea(item) {
            // window.open(this.$data_url+'archivos/' + url, '_blank');
            if (this.usuario.id_group == 9 && item.nombre.substr(-3) == "pdf") {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (item.nombre.substr(-3) == "pdf") {
                window.open(this.$data_url+'tareas/' + item.url, '_blank');
            } else if (item.mime = "application/pdf") {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'tareas/' + item.url, '_blank');
            }

        },
        verJuego(carpeta) {
            localStorage.url_juego = carpeta;
            this.$router.push('/docente/juego/digital');
            // window.open('/docente/juego/digital', '_blank');
        },
        verMaterial(webmaterial, exematerial) {
            localStorage.url_material = webmaterial
            this.$router.push('/docente/material/digital');
            // window.open('/docente/material/digital', '_blank');
        },
        verVideo(url) {
            let me = this
            me.popupVideoActive = true
            const youtubeId = getIdFromUrl(url)
            me.youtube = youtubeId;
        }
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
