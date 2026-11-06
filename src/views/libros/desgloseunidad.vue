<template>
<div>
    <vs-popup title="Ver video" :active.sync="popupVideoActive" class="custom-popup">
      <div class="modal-body">
  <div class="youtube-wrapper">
    <youtube :video-id="youtube" class="youtube-video"></youtube>
      </div>
      </div>
    </vs-popup>
    <div class="vx-row">
        <div class="vx-col w-full">
            <vx-card class="text-center mb-4">
                <h3><b>{{nombrelibroSelec+' - UNIDAD '+ valUnidad}}</b></h3>
                <div class="vx-row mb-6 mt-6">
                    <div class="vx-col sm:w-1/5 w-full" align="left" style="border-right: 1px solid #EAEAEA;">
                        <vs-button color="primary" type="border" class="m-1 w-full" @click="libroWebUnidad()">Libro Web Sin Respuestas - Unidad {{valUnidad}}</vs-button>
                        <vs-button color="success" type="border" class="m-1 w-full" @click="libroWebUnidadGuia()" v-if="mostrarBotonGuia">Libro Web Con Respuestas - Unidad {{valUnidad}}</vs-button>
                        <vs-button color="success" type="border" class="m-1 w-full" @click="tabMostrar=0">Temas ({{temas.length}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=1" v-if="cantactividades > 0">Actividades ({{cantactividades}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=2" v-if="cantanimaciones > 0">Animaciones ({{cantanimaciones}})</vs-button>
                        <!--<vs-button color="dark" type="line" class="m-1 w-full"  @click="tabMostrar=3">Planificaciones ({{cantplanificaciones}})</vs-button>-->
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=4" v-if="canteletareas > 0">Teletareas ({{canteletareas}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=5" v-if="juegos.length + arregloJuegosProlipa.length > 0">Juegos ({{juegos.length + arregloJuegosProlipa.length }})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=6" v-if="materialapoyo.length > 0">Material apoyo ({{materialapoyo.length}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=7" v-if="videos.length > 0">Videos ({{videos.length}})</vs-button>
                        <vs-button color="dark" type="line" class="m-1 w-full" @click="tabMostrar=8" v-if="arraySimuladores.length > 0">Simulador ({{arraySimuladores.length}})</vs-button>
                    </div>

                    <div class="vx-col sm:w-4/5 w-full text-left">
                        <vs-list v-if="tabMostrar===0">
                            <vs-list-header title="Temas" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in temas" :key="$index" v-bind:title="item.nombre_tema">
                                <template slot="avatar" v-if="item.tipo_tema===1">
                                    <vs-avatar color="primary" icon-pack="feather" icon="icon-file" />
                                </template>
                                <template slot="avatar" v-if="item.tipo_tema===0">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-file" />
                                </template>
                                <vs-button v-if="item.tipo_tema===1" color="dark" type="border" class="btn_ver" @click="irdesgloseTema(item)" icon-pack="feather" icon="icon-eye">Visualizar</vs-button>
                                <vs-button v-if="item.tipo_tema===0" color="primary" class="btn_ver" @click="irdesgloseTema(item)" icon-pack="feather" icon="icon-eye">Visualizar</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===1">
                            <vs-list-header title="Actividades" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in librosunidades" :key="$index" v-bind:title="item.nombre_tema +' - pág. '+ item.page">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-file" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verActividad(item, 'actividades')">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>
                        <vs-list v-if="tabMostrar===2">
                            <vs-list-header title="Animaciones" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in librosunidades_anim" :key="$index" v-bind:title="item.nombre_tema +' - pág. '+ item.page">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-play" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verActividad(item, 'animaciones')">Ver</vs-button>
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
                                <vs-button color="primary" type="border" class="btn_ver ml-1" @click="descargarTeletarea(item)">Descargar</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===5">
                            <vs-list-header title="Juegos" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in juegos" :key="$index" v-bind:title="item.nombre" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-award" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verJuego(item)">Ver</vs-button>
                            </vs-list-item>
                            <!--JUEGOS PROLIPA-->
                            <JuegosProlipaVue v-if="arregloJuegosProlipa.length > 0" :arregloJuegosProlipa="arregloJuegosProlipa"/>
                            <!--FIN JUEGOS DE PROLIPA-->
                        </vs-list>

                        <vs-list v-if="tabMostrar===6">
                            <vs-list-header title="Material de apoyo" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in materialapoyo" :key="$index" v-bind:title="item.nombrematerial" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-folder" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verMaterial(item)">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===7">
                            <vs-list-header title="Videos" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in videos" :key="$index" v-bind:title="item.nombrevideo" subtitle="">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-video" />
                                </template>
                                <vs-button color="primary" class="btn_ver" @click="verVideo(item)">Ver</vs-button>
                            </vs-list-item>
                        </vs-list>

                        <vs-list v-if="tabMostrar===8">
                            <vs-list-header title="Simuladores" color="warning"></vs-list-header>
                            <vs-list-item v-for="(item,$index) in arraySimuladores" :key="$index" v-bind:title="item.nombre" :subtitle="item.descripcion">
                                <template slot="avatar">
                                    <vs-avatar color="warning" icon-pack="feather" icon="icon-monitor" />
                                </template>
                                <template v-if="item.tipo_ruta == 2">
                                    <vs-button color="primary" class="btn_ver" @click="abrirSimuladorEmbebido(item)">Ver</vs-button>
                                </template>
                                <template v-else>
                                    <vs-button color="primary" class="btn_ver" @click="abrirSimuladorExterno(item)">Ver</vs-button>
                                </template>
                                <vs-button v-if="item.link_tutorial && item.link_tutorial !== 'null' && item.link_tutorial !== ''" 
                                           color="dark" type="border" class="btn_ver ml-1" 
                                           @click="abrirTutorial(item.link_tutorial)">Tutorial</vs-button>
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
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import JuegosProlipaVue from "./components/Juegos/JuegosProlipa.vue";
import {
    getIdFromUrl
} from 'vue-youtube'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)
Vue.use(axios)
export default {
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
        JuegosProlipaVue,
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
            miusuario:[],
            librosunidades: [],
            librosunidades_anim: [],
            planificacionesunidades: [],
            teletareasunidades: [],
            cantactividades: 0,
            cantanimaciones: 0,
            cantplanificaciones: 0,
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
            arraySimuladores:[],
            popupVideoActive: false,
            youtube: '',
            //variavbles para juegos de prolipa
            arregloJuegosProlipa:[],
            cant_juegosprolipa:0,
            //fin variables par juegos de prolipa
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        },
        mostrarBotonGuia() {
            // Verificar primero si existe la URL de la guía
            let urlGuia = localStorage.url_guiaweb
            if (!urlGuia || urlGuia === 'null' || urlGuia === 'undefined' || urlGuia === '') {
                return false
            }
            // Verificar si las páginas de guía de la unidad actual son válidas
            let pagInicioGuia = localStorage.pag_inicio_guia
            let pagFinGuia = localStorage.pag_fin_guia
            return pagInicioGuia !== null && pagInicioGuia !== 'null' && pagInicioGuia !== 'undefined' &&
                   pagFinGuia !== null && pagFinGuia !== 'null' && pagFinGuia !== 'undefined'
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.idlibro = localStorage.getItem('idlibro')
        this.indexUnidad = localStorage.getItem('indexUnidad')
        this.valUnidad = localStorage.getItem('valUnidad')
        this.nombrelibroSelec = localStorage.getItem('nombrelibroSelec')
        this.idUnidad = localStorage.getItem('idUnidad')
        this.carpeta = localStorage.getItem('carpetaLibroSelec')
    },
    mounted() {
      let me = this
      me.getTodosJuegosProlipa()
      this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this
            me.$vs.loading()

            this.$http.get(this.$server_url+'temasUnidad_id/' + me.idUnidad)
                .then(function (response) {
                    me.temas = response.data
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'actividades_libros_unidad/' + me.idUnidad)
                .then(function (response) {
                    me.librosunidades = response.data
                    me.cantactividades = response.data.length
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'animaciones_libros_unidad/' + me.idUnidad)
                .then(function (response) {
                    me.librosunidades_anim = response.data
                    me.cantanimaciones = response.data.length
                })
                .catch(function (error) {})

            this.$http.get(this.$server_url+'teletareasunidades/' + me.idUnidad)
                .then(function (response) {
                    me.teletareasunidades = response.data
                    me.canteletareas = response.data.length
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'juegos_unidad/' + me.idUnidad)
                .then(function (response) {
                    me.juegos = response.data
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'materialapoyo_unidad/' + me.idUnidad)
                .then(function (response) {
                    me.materialapoyo = response.data
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'videos_libro_unidad/' + me.idUnidad)
                .then(function (response) {
                    me.videos = response.data
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url+'simuladoresPorUnidad?id_unidad=' + me.idUnidad)
                .then(function (response) {
                    me.arraySimuladores = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })

                
        },
        getTodosJuegosProlipa(){
          let me = this
          me.cant_juegosprolipa = 0
          const formData = new FormData();
          formData.append('unidad',localStorage.valUnidad)
          formData.append('id_asignatura', localStorage.idasignatura);
          this.$http.post(this.$server_url + 'j_juegos_tipo_prolipaTodos', formData)
              .then(res => {
                if(res.data.items && res.data.items.length > 0){
                  me.arregloJuegosProlipa = res.data.items;
                  me.cant_juegosprolipa = me.arregloJuegosProlipa.length
                }
              })
              .catch(function (error) {
                  console.log(error);
              })
        },
        verActividad(item,folder) {
            let me = this;
            let link = item.link
            //guardar en historico las activas
            if(folder == "actividades"){
                let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                let h_idusuario = me.miusuario.idusuario;
                let h_idgrupo = me.miusuario.id_group;
                let h_idasignatura = localStorage.idasignatura
                let h_nombreasignatura = localStorage.nombreasignatura
                let h_recursotipo = 19; //19 = actividades
                let datoHistorico = {
                    'user_nombre': me.miusuario.nombres,
                    'user_apellido': me.miusuario.apellidos,
                    'user_email': me.miusuario.email,
                    'user_cedula': me.miusuario.cedula,
                    'recurso_accion': 'ver',
                    'recurso_tipo': 'actividades',
                    'recurso_nombre': item.nombre_tema,
                    'recurso_detalle': 'clasificacion '+item.clasificacion,
                    'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
                }
                 me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                 me.saveHistoricoActividades(item.nombre_tema,folder,1,item.page)
            }
            //guardar en historico las animaciones
            else{
                let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                let h_idusuario = me.miusuario.idusuario;
                let h_idgrupo = me.miusuario.id_group;
                let h_idasignatura = localStorage.idasignatura
                let h_nombreasignatura = localStorage.nombreasignatura
                let h_recursotipo = 20; //20 = animaciones
                let datoHistorico = {
                    'user_nombre': me.miusuario.nombres,
                    'user_apellido': me.miusuario.apellidos,
                    'user_email': me.miusuario.email,
                    'user_cedula': me.miusuario.cedula,
                    'recurso_accion': 'ver',
                    'recurso_tipo': 'animaciones',
                    'recurso_nombre': item.nombre_tema,
                    'recurso_detalle': 'clasificacion '+item.clasificacion,
                    'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
                }
                me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                me.saveHistoricoActividades(item.nombre_tema,folder,3,item.page)
            }
            localStorage.vistalibro = 'todo'
            localStorage.url_actividad = this.carpeta + '/' + folder + '/' + link + '.html';
            this.$router.push('/docente/libro/digital');
        },
        saveHistoricoActividades(activity,folder,tipo,page){
            let me = this;
            let asignatura_id = localStorage.idasignatura
            let idusuario     = me.usuario.idusuario
            let url           = folder
            let actividad     = activity
            let periodo_id    = localStorage.periodo_id
            this.$http.get(this.$server_url+'conteoActividad?asignatura_id='+asignatura_id+'&idusuario='+idusuario+'&url='+url+'&actividad='+actividad+'&periodo_id='+periodo_id+'&pagina='+page+'&tipo='+tipo)
                .then(function (res) {
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        verPlanificacion(web) {
            window.open(this.$data_url+'tareas/upload/planificacion/' + web, '_blank');
        },
        verTeletarea(item) {
            let me = this
            if (this.usuario.id_group == 9 && item.nombre.substr(-3) == "pdf") {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 4; //4 = teletarea
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'teletarea',
                'recurso_nombre': item.nombre,
                'recurso_detalle': 'nombre del tema '+item.nombre_tema,
                'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            me.saveHistoricoActividades(item.nombre,item.url,4,0)
            if (item.nombre.substr(-3) == "pdf") {
                window.open(this.$data_url+'tareas/' + item.url, '_blank');
            } else if (item.mime = "application/pdf") {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'tareas/' + item.url, '_blank');
            }
        },
        descargarTeletarea(item) {
            let me = this;
            if (this.usuario.id_group == 9 && item.nombre.substr(-3) == "pdf") {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 4; //4 = teletarea
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descargar',
                'recurso_tipo': 'teletarea',
                'recurso_nombre': item.nombre,
                'recurso_detalle': 'nombre del tema '+item.nombre_tema,
                'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            me.saveHistoricoActividades(item.nombre,item.url,4,0)
            window.open(this.$data_url+'tareas/' + item.url, '_blank');
        },
        verJuego(item) {
            let me = this
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 8; //8 = juego
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'juego',
                'recurso_nombre': item.nombre,
                'recurso_detalle': '',
                'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            me.saveHistoricoActividades(item.nombre,item.carpeta,5,0)
            localStorage.url_juego = item.carpeta;
            this.$router.push('/docente/juego/digital');
            // window.open('/docente/juego/digital', '_blank');
        },
        verMaterial(item) {
            let me = this
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 9; //9 = material
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'material',
                'recurso_nombre': item.nombrematerial,
                'recurso_detalle': '',
                'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            me.saveHistoricoActividades(item.nombrematerial,item.webmaterial,2,0)
            localStorage.url_material = item.webmaterial
            this.$router.push('/docente/material/digital');
            // window.open('/docente/material/digital', '_blank');
        },
        irdesgloseTema(item) {
            localStorage.idtemaSelec = item.id
            localStorage.nombre_tema = item.nombre_tema
            this.$router.push('/docente/libro/desglosetema');
        },
        verVideo(item) {
            let me = this
            let url = item.webvideo
            //guardar historico
            let h_idinstitucion     = me.miusuario.institucion_idInstitucion;
            let h_idusuario         = me.miusuario.idusuario;
            let h_idgrupo           = me.miusuario.id_group;
            let h_idasignatura      = localStorage.idasignatura
            let h_nombreasignatura  = localStorage.nombreasignatura
            let h_recursotipo = 18; //18 = videos tema
            let datoHistorico = {
                'user_nombre':      me.miusuario.nombres,
                'user_apellido':    me.miusuario.apellidos,
                'user_email':       me.miusuario.email,
                'user_cedula':      me.miusuario.cedula,
                'recurso_accion':   'abrir',
                'recurso_tipo':     'videos tema',
                'recurso_nombre':   item.nombrevideo,
                'recurso_detalle':  '',
                'recurso_detalle2': 'abierto desde la unidad '+localStorage.valUnidad,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            me.saveHistoricoActividades(item.nombrevideo,item.webvideo,6,0)
            //proceso
            me.popupVideoActive = true
            const youtubeId = getIdFromUrl(url)
            me.youtube = youtubeId;
            console.log('url ' + url, 'id yout '+ youtubeId)
        },
        libroWebUnidad() {
            localStorage.vistalibro = 'por_unidad'
            let route = this.$router.resolve({
                path: '/docente/libro/digital'
            });
            //Esta ruta es para abrir en la misma página.
            // this.$router.resolve('/docente/libro/digital');
            window.open(route.href, '_blank');
        },
        libroWebUnidadGuia() {
            localStorage.vistalibro = 'por_unidad_guia'
            let route = this.$router.resolve({
                path: '/docente/libro/digital'
            });
            window.open(route.href, '_blank');
        },
        abrirSimuladorEmbebido(item) {
            let me = this;
            // Guardar historico
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura;
            let h_nombreasignatura = localStorage.nombreasignatura;
            let h_recursotipo = 21; // 21 = simulador
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'simulador embebido',
                'recurso_nombre': item.nombre,
                'recurso_detalle': item.descripcion,
                'recurso_detalle2': 'abierto desde la unidad ' + localStorage.valUnidad,
            };
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            
            // Guardar la URL en localStorage y abrir
            localStorage.setItem('simulador_url', item.link);
            window.open('/admin/simulador/ruta', '_blank');
        },
        abrirSimuladorExterno(item) {
            let me = this;
            // Guardar historico
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura;
            let h_nombreasignatura = localStorage.nombreasignatura;
            let h_recursotipo = 21; // 21 = simulador
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'simulador externo',
                'recurso_nombre': item.nombre,
                'recurso_detalle': item.descripcion,
                'recurso_detalle2': 'abierto desde la unidad ' + localStorage.valUnidad,
            };
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            
            // Abrir link externo
            window.open(item.link, '_blank');
        },
        abrirTutorial(link) {
            window.open(link, '_blank');
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

.vs-popup{
  width: 1500px !important;
}
#video {
  width: 100%;
}

.youtube-video {
  width: 100% !important;
  height: auto; /* Ajustar la altura automáticamente */
}

.modal-body {
  height: 70vh; /* controlas el alto del modal */
  padding: 0;   /* opcional: elimina padding para aprovechar el espacio */
}

.youtube-wrapper {
  position: relative;
  width: 100%;
  height: 100%;  /* ocupa toda la altura del modal */
  overflow: hidden;
}

.youtube-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
