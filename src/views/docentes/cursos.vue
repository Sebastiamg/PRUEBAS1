<template>
    <div id="knowledge-base-category-page">

        <vs-popup title="Seleccione su institución" :active.sync="popupActive">
            <p class="mb-6">Por favor seleccione la institución a la que pertenece antes de continuar.</p>

            Ciudad:
            <v-select class="w-full mb-6" :options="ciudades" v-model="ciudad" @input="verInstCiudad()"
                :dir="$vs.rtl ? 'rtl' : 'ltr'" />

            Institución:
            <v-select class="w-full mb-6" :options="instituciones" v-model="institucion"
                :dir="$vs.rtl ? 'rtl' : 'ltr'" />

            <vs-button class="w-full mt-4 mb-1" @click="asignarInstitucion()" color="success"
                type="filled">Guardar</vs-button>

        </vs-popup>

        <!------modal cargar asignaturas------->
        <vs-popup title="Cargar asignaturas" :active.sync="promptCargarAsig">
            <div class="p-2 mb-2" style="background-color: #E5F0FC; color: #1666F1; border-radius: 5px;">
                <span>Estimado docente, con la finalidad de agregar en un futuro, más servicios que dispone la
                    editorial, le solicitamos actualizar la asignatura en los cursos creados.</span>
            </div>

            <div class="w-full mt-3 mb-8"><br>
                <div class="vx-row w-full mt-6" v-if="cursos_sin_asignatura[currentx - 1]">
                    <div class="vx-col sm:w-1/3 w-full mb-2">
                        <b>Curso: </b>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full mb-2">
                        {{ cursos_sin_asignatura[currentx - 1].nombre }}
                    </div>
                </div>

                <div class="vx-row w-full mt-6" v-if="cursos_sin_asignatura[currentx - 1]">
                    <div class="vx-col sm:w-1/3 w-full">
                        <b>Asignatura: </b>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <vx-input-group>
                            <v-select class="w-full" v-model="asignaturaSelected" :options="asignaturas"
                                :value="cursos_sin_asignatura[currentx - 1].id_asignatura" @input="guardarAsignatura()"
                                :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                            <template slot="append">
                                <div class="append-text btn-addon">
                                    <vs-button color="primary" @click="otraActivo = true">Otra</vs-button>
                                </div>
                            </template>
                        </vx-input-group>
                    </div>
                </div>

                <div class="p-2 mb-2 mt-4" v-if="otraActivo === true" align="justify"
                    style="background-color: #FFC8D4; color: #D50430; border-radius: 5px;">
                    <span>
                        Antes de crear otra asignatura, verifique nuevamente en el listado asignaturas que se encuentra
                        en la parte
                        superior.<br>
                        Las asignaturas de naturales, sociales, lengua, matemática, computación y eca que ya pertenecen
                        a prolipa, serán
                        eliminadas por un administrador.
                    </span>
                </div>
                <span v-if="otraActivo === true">Para mayor información escribanos a soporte@prolipa.com.ec</span>

                <div class="vx-row w-full mt-6 mb-8" v-if="otraActivo === true">

                    <div class="vx-col sm:w-2/3 w-full ml-auto">
                        Especifique: <br>

                        <vx-input-group>
                            <vs-input v-model="nombre_otra_asignatura" class="w-full"></vs-input>

                            <template slot="append">
                                <div class="append-text btn-addon">
                                    <vs-button color="dark" @click="crearOtraAsignatura()">Guardar</vs-button>
                                </div>
                            </template>
                        </vx-input-group>
                    </div>
                </div>
            </div>
            <br><br><br><br><br>
            <div class="text-right">Este proceso no le tomará más de 2 minutos</div>
        </vs-popup>
        <!-------fin modal cargar asignaturas---------->
        <!-- <div class="vx-col w-full mb-0 text-center"><h2><b>{{nombrelibro}}</b></h2></div> -->
        <!-- <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button> -->
         <!-- si es director no mostrar el agregar curso -->
         <div>
            <vs-button class="m-1" color="dark" type="relief" @click="datosStorage(libros[0]);nuevo_editar()">Agregar Curso</vs-button>
          </div>
        <div class="vx-row mt-4 match-height">

            <div class="vx-col w-full sm:w-1/2 md:w-1/3 mb-base" v-for="section in curso" :key="section.id">
                <vx-card :title="section.nombre">
                    <p class="text-center">
                        <img src="@/assets/images/pages/graphic-3.png" alt="graphic" width="100" class="mx-auto">
                    </p>
                    <vs-list>
                        <!-- {{section}} -->
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Área"
                            :subtitle="section.seccion"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Paralelo"
                            :subtitle="section.aula"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Código"
                            :subtitle="section.codigo"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Actualizado"
                            :subtitle="section.updated_at"></vs-list-item>
                    </vs-list>
                    <div class=" mt-2" align="center">
                        <span v-if="grupo_usuario == 10">
                            <!-- perfil del director, solo visualiza el contenido del curso del docente -->
                            <vs-button color="success" type="border" @click="verClase(section)" class="m-2"> Ver
                                contenido</vs-button>
                        </span>
                        <span v-else>
                            <div style="display:flex;width:100%;justify-content:center;">
                                <div>
                                    <vx-tooltip color="primary" text="Ver curso" style="display: inline-block;">
                                        <vs-button radius color="primary" type="border" icon-pack="feather"
                                            icon="icon-eye" @click="datosStorage(libros[0]);verClase(section)" class="m-2"></vs-button>
                                    </vx-tooltip>
                                </div>
                                <div>
                                    <div v-if="usuario.id_group == 16">
                                        <vx-tooltip v-if="cursos.editar == '1'" color="success" text="Editar curso"
                                            style="display: inline-block;">
                                            <vs-button radius color="success" type="border" icon-pack="feather"
                                                icon="icon-edit" @click="datosStorage(libros[0]);editar(section.idcurso)"
                                                class="m-2"></vs-button>
                                        </vx-tooltip>
                                    </div>
                                    <vx-tooltip v-else color="success" text="Editar curso"
                                        style="display: inline-block;">
                                        <vs-button radius color="success" type="border" icon-pack="feather"
                                            icon="icon-edit" @click="datosStorage(libros[0]);nuevo_editar(section)" class="m-2"></vs-button>
                                    </vx-tooltip>
                                </div>
                                <div>
                                    <div v-if="usuario.id_group == 16">
                                        <vx-tooltip v-if="cursos.eliminar == '1'" color="danger" text="Eliminar curso"
                                            style="display: inline-block;">
                                            <vs-button radius color="danger" type="border" icon-pack="feather"
                                                icon="icon-trash" @click="eliminar(); idcurso = section.idcurso"
                                                class="m-2"></vs-button>
                                        </vx-tooltip>
                                    </div>
                                    <vx-tooltip v-else color="danger" text="Eliminar curso"
                                        style="display: inline-block;">
                                        <vs-button radius color="danger" type="border" icon-pack="feather"
                                            icon="icon-trash" @click="datosStorage(libros[0]);eliminar(); idcurso = section.idcurso"
                                            class="m-2"></vs-button>
                                    </vx-tooltip>
                                </div>
                            </div>
                        </span>
                    </div>
                </vx-card>
            </div>
        </div>
        <!-- CREAR NUEVO CURSO -->
        <vs-popup :title="titulo_modal_curso" :active.sync="modalNuevoCurso" v-if="modalNuevoCurso">
            <NuevoCursoVue :libros="libros" :docente="usuario" @cursoCreadoOk="f_cursoCreadoOk" :editarCurso="editarCurso" />
        </vs-popup>

    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
const NuevoCursoVue = () => import("@/views/cursos/nuevoCurso.vue");

export default {
    props:{
        libros:{
            type: Array,
            required: true
        }
    },
    data() {
        return {
            editarCurso:{},
            modalNuevoCurso: false,
            docente:{},
            popupActive: false,
            instituciones: [],
            ciudades: [],
            ciudad: '',
            institucion: '',
            curso: [],
            usuario: [],
            idcurso: '',
            promptCargarAsig: false,
            cursos_sin_asignatura: [],
            asignaturas: [],
            asignaturaSelected: {},
            currentx: 1,
            otraActivo: false,
            nombre_otra_asignatura: '',
            datoU: '',
            nombrelibro: '',
            idusuario: '',
            grupo_usuario: '',
            //variables de  recursos externos
            institucion: '',
            //====VARIABLES PARA RECURSOS EXTERNOS
            libro: {
                libroweb: '1',
                libro_con_guia: '1',
                guia_didactica: '1',
                unidades: '1',
            },
            cursos: {
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
            //fin de variables para recursos adicionales
            //FIN DE VARIABLES PARA RECURSOS EXTERNOS
            titulo_modal_curso:'',
        }
    },
    created() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        this.institucion = this.usuario.institucion_idInstitucion;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }
        this.validarAsignaturas()
        this.getAsignaturas()
        this.nombrelibro = localStorage.nombrelibroSelec
    },
    computed: {},
    methods: {
        getAsignaturas() {
            let me = this
            this.$http.get(this.$server_url + 'asignaturasDoc/' + me.idusuario).then(res => {
                me.asignaturas = res.data;
            })
                .catch(function (error) {
                    console.log(error);
                })
        },
        validarAsignaturas() {
            let me = this
            this.$http.get(this.$server_url + 'verif_asignatura_por_curso/' + me.idusuario)
                .then(function (res) {
                    me.cursos_sin_asignatura = res.data;
                    if (me.cursos_sin_asignatura[me.currentx - 1]) {
                        me.promptCargarAsig = true
                    } else {
                        me.promptCargarAsig = false
                    }
                })
                .catch(function (error) { })
        },
        getCurso() {
            let me = this;
            // console.log('idasignatura: ' + localStorage.idasignatura)
            me.$vs.loading();
            let formData = new FormData();
            formData.append('id_usuario', me.idusuario);
            formData.append('id_libro', localStorage.idlibro);
            formData.append('periodo_id', localStorage.periodo_id);
            formData.append('id_asignatura', localStorage.idasignatura);
            this.$http.post(this.$server_url + 'curso_libro_docente', formData)
                .then(function (response) {
                    me.curso = response.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {me.$vs.loading.close(); })
        },
        datosStorage(url){
          let me = this
          localStorage.nombrelibroSelec = url.nombrelibro
          localStorage.carpetaLibroSelec = url.weblibro
        },
        verClase(section) {
            localStorage.nombrelibroSelec = section.nombre + ' ' + section.seccion;
            localStorage.nombre_curso = section.nombre + ' ' + section.seccion;
            localStorage.codigo = section.codigo;
            localStorage.idcurso = section.idcurso;
            if (this.grupo_usuario == 10) {
                // perfil director
                this.$router.push('/director/institucion/docentes/contenidos/libro/curso');
            }
            if (this.grupo_usuario == 16) {
                // perfil recurso externo
                this.$router.push('/colegios/docente/desglose_curso');
            }
            else {
                this.$router.push(`/docente/desglose_curso`);
            }
        },
        verEvaluaciones(section) {
            localStorage.codigo = section.codigo;
            localStorage.idcurso = section.idcurso;
            this.$router.push(`/evaluaciones`);
        },
        nuevo_editar(curso) {
            let me = this;
            localStorage.idcurso = '';
            // console.log(curso)
            me.editarCurso = {};
            me.titulo_modal_curso = "Agregar curso";
            if(curso != null){
                me.titulo_modal_curso = "Editar curso";
                me.editarCurso = curso;
            }
            me.modalNuevoCurso = true;
        },
        editar(idcurso) {
            localStorage.idcurso = idcurso;
            if (this.grupo_usuario == 16) {
                // perfil recurso externo
                this.$router.push('/colegios/docente/curso/editar');
            } else {
                this.$router.push(`/docente/curso/editar`);
            }

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
            this.$http.get(this.$server_url + "eliminarCurso?idcurso=" + me.idcurso)
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

        guardarAsignatura() {
            let me = this
            let formData = new FormData();
            formData.append('id_asignatura', me.asignaturaSelected.id);
            formData.append('id_curso', me.cursos_sin_asignatura[me.currentx - 1].idcurso);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'cargar_asignatura_curso', formData)
                .then(function (res) {
                    me.validarAsignaturas()
                    me.getCurso()
                    me.asignaturaSelected = {}
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Asignatura guardada correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        crearOtraAsignatura() {
            let me = this
            let formData = new FormData();
            formData.append('nombre', me.nombre_otra_asignatura);
            formData.append('area', 83);
            formData.append('nivel', 30);
            formData.append('tipo_asignatura', 0);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'asignatura', formData)
                .then(function (res) {
                    me.asignaturaSelected.id = res.data.idasignatura
                    me.guardarAsignatura()
                    me.asignaturaDocente(res.data.idasignatura)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        asignaturaDocente(id_asignatura) {
            let me = this
            let formData = new FormData();
            formData.append('usuario_idusuario', me.idusuario);
            formData.append('asignatura_idasignatura', id_asignatura);

            me.$vs.loading()
            this.$http.post(this.$server_url + 'guardar_asignatura_usuario', formData)
                .then(function (res) {
                    me.nombre_otra_asignatura = ''
                    me.otraActivo = false
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getInstitucion() {
            let me = this;
            this.$http.get(this.$server_url + 'verificarInstitucion/' + me.idusuario)
                .then(function (response) {
                    if (response.data[0].institucion_idInstitucion === null) {
                        me.getCiudad();
                        me.popupActive = true
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getCiudad() {
            let me = this;
            this.$http.get(this.$server_url + 'ciudades')
                .then(function (response) {
                    me.ciudades = response.data;
                })
                .catch(function (error) { })
        },
        verInstCiudad() {
            let me = this;
            this.$http.get(this.$server_url + 'verInstitucionCiudad/' + me.ciudad.id)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) { })
        },
        asignarInstitucion() {
            let me = this;

            if (me.institucion === '' || me.institucion === null) {
                me.$vs.notify({
                    text: 'Seleccione una institución antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            var formData = new FormData();
            formData.append("institucion", me.institucion.id);
            formData.append("usuario", me.idusuario);

            this.$http.post(this.$server_url + 'asignarInstitucion', formData)
                .then(function (response) {
                    me.popupActive = false;
                    me.$vs.notify({
                        text: 'Institución guardada exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        f_cursoCreadoOk(e){
            console.log(e)
            if(e){
                this.modalNuevoCurso=false;
                this.getCurso();
            }
        }

    },
    components: {
        'v-select': vSelect,
        NuevoCursoVue,
    },
    mounted() {
        let me = this
        this.getCurso();
        this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
        if (this.linkEvaluacion) {
            this.urlBack = window.location.href
            this.urlV = this.urlBack.split('/')
            this.urlOrigen = this.urlV[0] + '/' + this.urlV[1] + '/' + this.urlV[2]
            this.vectorLink = (this.linkEvaluacion).split('-')
            this.evaluacionUrl()
        }
        this.getInstitucion();
        //PERMISOS EXTERNOS
        if (localStorage.status_permisos == "yes") {
            me.permisosExternos = JSON.parse(localStorage.permisosExternos)
            me.libro = me.permisosExternos.permisos_libros
            me.cursos = me.permisosExternos.permisos_cursos
            me.cuaderno = me.permisosExternos.permisos_cuadernos
            me.planificacion = me.permisosExternos.permisos_planificaciones
            //data de los recursos adicionales
            me.mijuego = me.permisosExternos.zona_diversion_mi_juego
            me.juegoProlipa = me.permisosExternos.zona_diversion_juego_prolipa
            me.materialDigital = me.permisosExternos.material_apoyo_digital
            me.materialpdf = me.permisosExternos.material_apoyo_pdf
            me.propuesta = me.permisosExternos.propuestas_metodologicas
            me.adaptacion = me.permisosExternos.adaptaciones
            me.articulo = me.permisosExternos.articulos
            me.documentom = me.permisosExternos.documentos_ministeriales
        }
        //FIN DE PERMISOS EXTERNOS

    }
}
</script>
