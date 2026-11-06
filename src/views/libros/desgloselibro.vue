<template>
<div>
    <vx-card>
        <center>
            <h2 v-if="libros[0]"><b>{{libros[0].nombrelibro}}</b></h2>
        </center>
        <vs-collapse :type="type">
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-book">
                <div slot="header">
                    Libro
                </div>
                <div>
                    <div v-if="libros.length > 0">
                        <DesgloseLibroDetalleVue :libros="libros" :unidadesLibro="unidadesLibro" />
                    </div>
                </div>
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-folder">
                <div slot="header">
                    Cursos
                </div>
                <cursosLibroDocente :libros="libros" />
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-book" v-if="id_folleto > 0">
                <div slot="header">
                    Folletos
                </div>
                <div v-if="arrayFolleto.length > 0">
                    <DesgloseLibroDetalleVue :libros="arrayFolleto" :unidadesLibro="arrayUnidadesFolleto" />
                </div>
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-file">
                <div slot="header">
                    Planificaciones
                </div>
                <div class="vx-col w-full mb-6 mt-6">
                    <vx-card>
                        <vs-list>
                            <!-- <vs-list-header title="Planificaciones" color="primary"></vs-list-header> -->
                            <vs-list-item v-for="(item,$index) in planificaciones" :key="$index" v-bind:title="item.nombreplanificacion" v-bind:subtitle="item.descripcionplanificacion">
                                <template slot="avatar">
                                    <vs-avatar color="primary" icon-pack="feather" icon="icon-download" />
                                </template>
                                <div v-if="usuario.id_group == 16">
                                    <vs-button @click="verPlanificacion(item)" v-if="planificacion.visualizar == '1'" class="btn_ver mr-1" target="_blank" color="success">Visualizar</vs-button>
                                    <vs-button v-if="grupo_usuario != 9 && planificacion.descargar == '1'" @click="descargarPlanificacion(item)" class="btn_ver" color="primary">Descargar</vs-button>
                                </div>
                                <div v-else>
                                    <vs-button @click="verPlanificacion(item)" class="btn_ver mr-1" target="_blank" color="success">Visualizar</vs-button>
                                    <vs-button v-if="grupo_usuario != 9" @click="descargarPlanificacion(item)" class="btn_ver" color="primary">Descargar</vs-button>
                                </div>

                            </vs-list-item>
                        </vs-list>
                    </vx-card>
                </div>
            </vs-collapse-item>
            <vs-collapse-item icon-pack="feather" icon-arrow="icon-folder">
                <div slot="header">
                    Recursos adicionales
                </div>
                <div class="vx-row">
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/director/institucion/docentes/contenidos/libro/zonadiversion')">
                            <div>
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
                        <vx-card v-if="grupo_usuario != 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/docente/tipos_juegos_docente')">
                            <div>
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

                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10 " class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/director/institucion/docentes/contenidos/libro/materialapoyo')">
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
                        <vx-card v-if="grupo_usuario != 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);irMaterial()">
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
                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/director/institucion/docentes/contenidos/libro/propuestas2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/propuesta.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Propuestas metodológicas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                        <vx-card v-if="grupo_usuario != 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/propuestas2')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" v-bind:src="$data_url+'archivos/upload/iconos/docente-curso/propuesta.png'">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Propuestas metodológicas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>

                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/director/institucion/docentes/contenidos/libro/adaptaciones2')">
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
                        <vx-card v-if="grupo_usuario != 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/adaptaciones2')">
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
                    </div>
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/director/institucion/docentes/contenidos/libro/ver_aticulos')">
                            <div>
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
                        <vx-card v-if="grupo_usuario != 10" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/docente/ver_articulos')">
                            <div>
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
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="simulador > 0 && grupo_usuario == 6">
                        <vx-card class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/simulador/docente')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/glosario/simulacion.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Simuladores
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="documentos.length > 0">
                        <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/ministerio/docente')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/ministerio.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Documentos Ministeriales
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <!--FICHAS-->
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;">
                        <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/lista/fichas')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/libro/ficha.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Fichas
                                    </p>
                                </div>
                            </div>
                        </vx-card>
                    </div>
                    <!--NECESIDADES EDUCATIVAS-->
                    <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-4" style="min-height: 250px;" v-if="ifHaveNecesidad">
                        <vx-card v-if="grupo_usuario == 6" class="text-center" style="min-height: 250px; cursor: pointer;" @click="datosStorage(libros[0]);$router.push('/lista/necesidades-educativas')">
                            <div>
                                <img class="responsive card-img-top imagencard" style="max-height: 180px;" src="@/assets/images/home/docenteHome/neet.png">
                            </div>
                            <div class="mt-2">
                                <div class="w-3/3 mt-2 ml-auto">
                                    <p class="font-bold">
                                        Necesidades Educativas
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
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import cursosLibroDocente from '../docentes/cursos.vue'
const DesgloseLibroDetalleVue = () => import('./components/DesgloseLibroDetalle.vue')
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        cursosLibroDocente,
        DesgloseLibroDetalleVue
    },
    mixins: [historicoMixin],
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idlibro: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
            usuario: [],
            unidadesLibro: [],
            planificaciones: [],
            type: 'margin',

            val_cuaderno: '',
            idcuaderno: '',
            valMultipe_cuaderno: {
                value1: '',
                value2: ''
            },
            select_cuaderno: [],
            cuadernos: [],
            usuario_cuaderno: [],
            datoU: '',
            idusuario: '',
            grupo_usuario: '',
            miusuario: '',
            simulador: 0,
            documentos: [],
            curso: {
                ver: '1',
                agregar: '1',
                editar: '1',
                eliminar: '1',
            },
            cuaderno: {
                guia: '1',
                didactica: '1',
                web: '1',
            },
            planificacion: {
                descargar: '1',
                visualizar: '1',
            },
            //variables para recursos adicionales
            mijuego: {
                agregar: '1',
                editar: '1',
                eliminar: '1',
                ver: '1',
                asignar: '1',
            },
            juegoProlipa: {
                asignar: '1',
                ver: '1',
                previsualizar: '1',
            },
            materialDigital: {
                ver: '1',
                previsualizar: '1',
                asignar: '1',
            },
            materialpdf: {
                subir: '1',
                ver: '1',
                descargar: '1',
                asignar: '1',
            },
            propuesta: {
                ver: '1',
            },
            adaptacion: {
                ver: '1',
            },
            articulo: {
                lengua: '1',
                matematica: '1',
                naturales: '1',
                sociales: '1',
                ensenanza: '1',
            },
            documentom: {
                ver: '1',
            },
            permisosExternos: '',
            link: '',
            //fin de variables para recursos adicionales
            //FIN DE VARIABLES PARA RECURSOS EXTERNOS
            //variables necesidades educativas
            ifHaveNecesidad: false,
            //fin variables necesidades educativas
            //variables para folleto
            id_folleto: 0,
            arrayFolleto: [],
            arrayUnidadesFolleto: [],
            //fin variables para folleto
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        let me = this
        this.$vs.loading()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.miusuario = this.usuario;
        this.grupo_usuario = this.miusuario.id_group;
        this.idusuario = this.miusuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }
        this.idlibro = localStorage.getItem('idlibro')
        localStorage.vistalibro = 'todo'
    },
    mounted() {
        let me = this
        localStorage.removeItem('url');
        localStorage.removeItem('url_guiaweb');
        localStorage.removeItem('indexUnidad');
        localStorage.removeItem('valUnidad');
        localStorage.removeItem('idUnidad');
        localStorage.removeItem('pag_inicio');
        localStorage.removeItem('pag_fin');
        localStorage.removeItem('pag_inicio_guia');
        localStorage.removeItem('pag_fin_guia');
        this.getLibros()
        this.getCuadernos()
        this.getSimuladores();
        this.getDocumentos();
        this.getIfNecesidadEducativa()
    },
    methods: {
        datosStorage(url) {
            let me = this
            localStorage.nombrelibroSelec = url.nombrelibro
            localStorage.carpetaLibroSelec = url.weblibro
        },
        irMaterial() {
            let me = this
            if (me.usuario.id_group == 16) {
                me.$router.push('/colegios/lista/materialapoyo')
            } else {
                me.$router.push('/lista/materialapoyo')
            }
        },
        getDocumentos() {
            let me = this;
            this.$http.get(this.$server_url + 'getDocumentosDocente?idasignatura=' + localStorage.getItem("idasignatura"))
                .then(res => {
                    me.documentos = res.data
                    console.log(res.data)
                })
                .catch(error => {
                    console.log('no se conecto a los documentos ministeriales ' + error)
                })
        },
        //para obtener el listado de los simuladores para el docente
        getSimuladores() {
            let me = this;
            this.$http.get(this.$server_url + 'simulador?asignatura=yes&idasignatura=' + localStorage.getItem("idasignatura"))
                .then(function (res) {
                    me.simulador = res.data.length;
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        async getLibros() {
            let me = this;
            me.id_folleto = 0
            let idlibro = localStorage.getItem('idlibro')
            let periodo_id = localStorage.getItem('periodo_id')
            let region = localStorage.region;
            // Obtener idusuario desde localStorage
            let usuario = JSON.parse(localStorage.getItem('usuario'));
            let idusuario = usuario ? usuario.idusuario : null;
            this.$http.get(this.$server_url + 'desgloselibrousuario/' + idlibro + '/' + region)
                .then(function (response) {
                    me.libros = response.data
                    if (me.libros.length > 0) {
                        localStorage.nombrelibroSelec = me.libros[0].nombrelibro
                        localStorage.carpetaLibroSelec = response.data[0].weblibro
                        me.id_folleto = me.libros[0].id_folleto
                        if (me.id_folleto && me.id_folleto > 0) {
                            me.getFolleto()
                        }
                    }
                })
                .catch(function (error) {}),
                this.$http.get(this.$server_url + 'menu_unidades_libros_new/' + idlibro + '/' + region + '/' + idusuario + '/' + periodo_id)
                .then(function (response) {
                    me.unidadesLibro = response.data

                    // Calcular rangos de páginas para libro con guía
                    let minPagInicioGuia = null
                    let maxPagFinGuia = null
                    let hasGuiaPages = false

                    for (let i = 0; i < me.unidadesLibro.length; i++) {
                        const unidad = me.unidadesLibro[i]

                        // Verificar si tiene valores válidos para guía
                        if (unidad.pag_inicio_guia !== null && unidad.pag_inicio_guia !== 'null' &&
                            unidad.pag_fin_guia !== null && unidad.pag_fin_guia !== 'null') {
                            hasGuiaPages = true

                            // Calcular mínimo pag_inicio_guia
                            if (minPagInicioGuia === null || unidad.pag_inicio_guia < minPagInicioGuia) {
                                minPagInicioGuia = unidad.pag_inicio_guia
                            }

                            // Calcular máximo pag_fin_guia
                            if (maxPagFinGuia === null || unidad.pag_fin_guia > maxPagFinGuia) {
                                maxPagFinGuia = unidad.pag_fin_guia
                            }
                        }
                    }

                    // Si no hay páginas de guía válidas, usar las páginas normales
                    if (!hasGuiaPages && me.unidadesLibro.length > 0) {
                        minPagInicioGuia = me.unidadesLibro[0].pag_inicio
                        for (let i = 0; i < me.unidadesLibro.length; i++) {
                            maxPagFinGuia = me.unidadesLibro[i].pag_fin
                            // Asignar valores por defecto a cada unidad para que aparezcan en desgloseunidad
                            me.unidadesLibro[i].pag_inicio_guia = me.unidadesLibro[i].pag_inicio
                            me.unidadesLibro[i].pag_fin_guia = me.unidadesLibro[i].pag_fin
                        }
                    }

                    // Guardar en localStorage para uso posterior
                    localStorage.pag_inicio_guia = minPagInicioGuia
                    localStorage.pag_fin_guia = maxPagFinGuia
                })
                .catch(function (error) {}),

                this.$http.get(this.$server_url + 'planificacion_asignatura/' + idlibro)
                .then(function (response) {
                    me.planificaciones = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {})
        },
        async getFolleto() {
            let me = this;
            me.arrayFolleto = []
            me.arrayUnidadesFolleto = []
            let region = localStorage.region
            this.$http.get(this.$server_url + 'desgloselibrousuario/' + me.id_folleto + '/' + region)
                .then(function (response) {
                    me.arrayFolleto = response.data

                })
                .catch(function (error) {}),
                this.$http.get(this.$server_url + 'menu_unidades_libros/' + me.id_folleto + '/' + region)
                .then(function (response) {
                    me.arrayUnidadesFolleto = response.data
                })
                .catch(function (error) {})
        },
        getCuadernos() {
            let me = this;
            let formData = new FormData();
            if (me.usuario.id_group == 16) {
                formData.append('institucion_id', me.usuario.institucion_idInstitucion);
                formData.append('asignatura_id', localStorage.idasignatura);
                this.$http.post(this.$server_url + 'colegios_cuadernos_usuario_libro', formData)
                    .then(function (response) {
                        me.cuadernos = response.data
                    })
                    .catch(function (error) {})
            } else {
                formData.append('id_usuario', me.idusuario);
                formData.append('id_asignatura', localStorage.idasignatura);
                this.$http.post(this.$server_url + 'cuadernos_usuario_libro', formData)
                    .then(function (response) {
                        me.cuadernos = response.data
                    })
                    .catch(function (error) {})
            }
        },

        abrirLibroLink() {
            let me = this
            window.open(me.link, '_blank');
        },
        datopdfsinguia(url) {
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = url;
            window.open('/docente/libro/pdfsinguia', '_blank');
        },

        datocuaderno_cuaderno(url) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.descripcioncuaderno
            let h_recursotipo = 3; //3 = cuaderno
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'cuaderno',
                'recurso_nombre': url.nombrecuaderno,
                'recurso_detalle': 'cuaderno completo',
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)

            localStorage.url = url.webcuaderno;
            window.open('/docente/cuaderno/digital', '_blank');
            // this.$router.push('/docente/cuaderno/digital');
        },
        datopdfsinguia_cuaderno(url) {
            localStorage.url = url;
            window.open('/docente/cuaderno/pdfsinguia', '_blank');
        },
        datopdfconguia_cuaderno(url) {
            // console.log( url )
            // return
            let me = this
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.url = url.pdfconguia;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombrecuaderno
            let h_recursotipo = 12; //12 = pdf con guia
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'pdf con guia',
                'recurso_nombre': url.pdfconguia,
                'recurso_detalle': 'cuaderno pdf con guia',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            window.open('/docente/cuaderno/pdfconguia', '_blank');
        },
        datopdfguiadidactica_cuaderno(url) {
            let me = this
            if (this.grupo_usuario == 9) {
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
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.nombrecuaderno
            let h_recursotipo = 14; //14 = guia didactica
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'guia didactica',
                'recurso_nombre': url.guiadidactica,
                'recurso_detalle': 'cuaderno guia didactica',
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)

            localStorage.url = url.guiadidactica;
            window.open('/docente/cuaderno/pdfguiadidactica', '_blank');
        },

        irCursosLibro() {
            if (this.grupo_usuario == 16) {
                this.$router.push('/colegios/docente/cursos');
            } else {
                this.$router.push('/docente/cursos')
            }
        },
        setAltImg(event) {
            event.target.src = this.$data_url + '/archivos/upload/icono_unidades.png';
        },
        volver() {
            let me = this;
            me.$router.push('/docente/libros2');

        },
        verPlanificacion(item) {
            let me = this
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 16; //16 = planificacion
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'planificacion',
                'recurso_nombre': item.nombreplanificacion,
                'recurso_detalle': item.descripcionplanificacion,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            // :href="$data_url+'archivos/upload/planificacion/'+item.webplanificacion"
            window.open('https://view.officeapps.live.com/op/embed.aspx?src=' + this.$data_url + 'archivos/upload/planificacion/' + item.webplanificacion)
        },
        descargarPlanificacion(item) {
            let me = this
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 16; //16 = planificacion
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descargar',
                'recurso_tipo': 'planificacion',
                'recurso_nombre': item.nombreplanificacion,
                'recurso_detalle': item.descripcionplanificacion,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            // let ruta = me.$data_url+'archivos/upload/planificacion/'+item.webplanificacion
            // window.open(ruta,'_blank')
            const ruta = this.$server_url + 'descargar-planificacion/' + item.idplanificacion
            window.open(ruta, '_blank')
            //:href="$data_url+'archivos/upload/planificacion/'+item.webplanificacion
        },
        //*********NECESIDADES EDUCATIVAS****
        getIfNecesidadEducativa() {
            let me = this
            this.$http.get(this.$server_url + 'ifAsignadoUsuario/' + me.usuario.idusuario + '/' + localStorage.periodo_id)
                .then(function (res) {
                    if (res.data.length > 0) {
                        me.ifHaveNecesidad = true
                    } else {
                        me.ifHaveNecesidad = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
    },
}
</script>


<style>
.letrascard {
    padding: 10px 0px 10px 0px;
    color: white;
    font-size: 17px;
    position: relative;
    -webkit-box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.52);
    -moz-box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.52);
    box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.52);
}

.letrac {
    font-size: 14px;
}

.btn_ver {
    font-size: 14px;
    padding: 5px 15px 5px 15px !important;
}

.imagencard {
    border-radius: 6px;
}

.padre {
    position: relative;
    box-sizing: border-box;
    background-color: #fafafa;
    margin: 20px;
}

.imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Para ajustar la imagen al tamaño del contenedor */
    display: block;
    /* Para eliminar espacios en línea si es un contenedor en línea */
    border-radius: 6px;
}

.hijo {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(173, 216, 230, 0.7);
    /* Color de fondo semitransparente */
    padding: 10px;
    box-sizing: border-box;
    color: white;
    /* Color del texto */
    text-align: center;
    font-size: 15px;
    -webkit-box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.60);
    -moz-box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.60);
    box-shadow: inset 0px 0px 29px 200px rgba(0, 0, 0, 0.60);
}
</style>
