<template>
<div>
    <br>
    <div v-if="op_agregar == 0">
        <vs-card v-if="user.id_group == 1 || user.id_group == 11 || user.id_group == 23 || user.id_group == 22">
            <vs-row vs-justify="flex-start">
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <div class="flex">
                        <vs-button type="border" icon-pack="feather" icon="icon-user-plus" @click="agrega_nuevo_user()">
                            Agregar usuario
                        </vs-button>
                    </div>
                    <br />
                    <p>Filtro de busquedas</p>
                    <br>
                        <div class="vx-row" v-if="userRoot">
                            <div class="vx-col w-full mb-3">
                                <!-- <label style="display:block;margin-bottom:6px;">Modo de filtro Root</label> -->
                                <div class="flex" style="gap:16px;">
                                    <vs-radio vs-name="modoFiltroRoot" vs-value="multi" v-model="modoFiltroRoot">Multifiltro</vs-radio>
                                    <vs-radio vs-name="modoFiltroRoot" vs-value="clasico" v-model="modoFiltroRoot">Filtro anterior</vs-radio>
                                    <vs-radio vs-name="modoFiltroRoot" vs-value="prolipa" v-model="modoFiltroRoot">Solo usuarios Prolipa</vs-radio>
                                </div>
                            </div>
                        </div>
                    <vs-card v-if="modoFiltroRoot != 'prolipa'">
                        <div class="vx-row">
                            <div class="vx-col w-full mb-3" :class="(userRoot && modoFiltroRoot == 'multi') ? 'md:w-2/3' : 'md:w-full'">
                                <label style="display:block;margin-bottom:6px;">Ingrese nombre, apellido, cedula, email o usuario</label>
                                <vs-input class="w-full" @keyup.enter="busquedaFiltroEstudiante()" icon-after="true" v-model="usuario.razonBusqueda" />
                            </div>
                            <div class="vx-col w-full md:w-1/3 mb-3" v-if="userRoot && modoFiltroRoot == 'multi'">
                                <label style="display:block;margin-bottom:6px;">Grupo (opcional)</label>
                                <v-select
                                    :options="gruposFiltroRoot"
                                    :reduce="item => item.id"
                                    label="level"
                                    v-model="grupoFiltroRoot"
                                    placeholder="Todos los grupos"
                                    :multiple="true"
                                    :closeOnSelect="false"
                                />
                            </div>
                            <div class="vx-col w-full mb-2" v-if="userRoot && modoFiltroRoot == 'multi'">
                                <div class="flex" style="gap:10px;">
                                    <vs-button color="warning" type="filled" @click="busquedaFiltroEstudiante();" icon="search">Buscar</vs-button>
                                    <vs-button color="dark" type="border" @click="limpiarFiltroRoot();" icon-pack="feather" icon="icon-refresh-cw">Limpiar rápido</vs-button>
                                </div>
                            </div>
                        </div>
                        <div style="" v-if="!userRoot || (userRoot && modoFiltroRoot == 'clasico')">
                            <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                                <li class="modelx">
                                </li>
                                <li style="margin:10px 20px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda = 'email'">Email</vs-radio>
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="1" v-model="valorBusqueda" @input="busqueda = 'cedula'">Cedula</vs-radio>
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="2" v-model="valorBusqueda" @input="busqueda = 'usuario'">Usuario</vs-radio>
                                </li>
                                <li>
                                    <vs-button color="warning" type="filled" style="margin-left:10px;" @click="busquedaFiltroEstudiante();" icon="search"></vs-button>
                                </li>
                            </ul>
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>

            <vs-row>
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <vs-table max-items="10" pagination search :data="estudiantesCursos">
                        <template slot="header">
                            <vs-chip color="primary">Cantidad: <b> {{ estudiantesCursos.length }}</b></vs-chip>
                        </template>
                        <template slot="thead">
                            <vs-th style="width:40%;">Datos</vs-th>
                            <vs-th style="width:10%;">Perfil</vs-th>
                            <vs-th style="width:20%;">Accion</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{ tr.idusuario }}
                                    <br />
                                    Nombres:
                                    <br>
                                    <span style="font-weight:600;">
                                        {{ tr.nombres }} {{ tr.apellidos }}<br>
                                    </span>
                                    usuario:
                                    <br>
                                    <span style="font-weight:600;">
                                        {{ tr.name_usuario }}<br>
                                    </span>
                                    Clave:
                                    <br>
                                    <span style="font-weight:600;">
                                        {{ tr.cedula }}<br>
                                    </span>
                                    <b>Email:</b>
                                    <p>{{ tr.email }}</p>
                                    <b>Institucion:</b>
                                    <p>{{ tr.nombreInstitucion }}</p>
                                    <!-- <b>Cargo:</b>
                                    <p>{{ tr.cargo }}</p> -->

                                    <template>
                                        <div v-if="tr.estado_idEstado == 1" style="margin-top:10px">
                                            <vs-chip color="primary">
                                                <p>Activo</p>
                                            </vs-chip>
                                        </div>
                                        <div v-else>
                                            <vs-chip color="danger">
                                                <p>Desactivado</p>
                                            </vs-chip>
                                        </div>
                                    </template>
                                </vs-td>
                                <vs-td>
                                    <div v-if="tr.cargo_id">
                                        Autoridad
                                    </div>
                                    <div v-else>
                                        {{ tr.perfil }}
                                    </div>
                                    <vs-chip v-if="tr.change_password == 0" color="primary">
                                        Contraseña actualizada
                                    </vs-chip>
                                    <vs-chip v-else color="primary">
                                        Contraseña por defecto
                                    </vs-chip>
                                    <div class="mt-1">
                                        <vs-chip v-if="tr.capacitador == 1" color="success">Capacitador</vs-chip>
                                    </div>
                                    <!-- Indicador Prolipa/Jefe Unificado (Diseño limpio) -->
                                    <div class="mt-2 w-full" v-if="tr.es_usuario_prolipa == '1' || tr.es_usuario_prolipa == 1">
                                        <div class="flex items-center px-2 py-1 rounded" style="background-color: #f3f6f9; border: 1px solid #d1d5db; display: inline-flex; width: fit-content;">
                                            <span style="color: #0284c7; font-size: 11px; font-weight: bold;" class="flex items-center">
                                                USUARIO PROLIPA
                                            </span>

                                            <span v-if="tr.jefe_departamento == '1' || tr.jefe_departamento == 1"
                                                  style="color: #d97706; font-size: 11px; font-weight: bold; border-left: 1px solid #9ca3af;"
                                                  class="ml-2 pl-2 flex items-center">
                                                <i class="feather icon-star mr-1"></i> JEFE DE ÁREA
                                            </span>
                                        </div>
                                    </div>
                                </vs-td>
                                <vs-td align="center">
                                    <vs-dropdown vs-custom-content vs-trigger-click>
                                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                        <vs-dropdown-menu style="width: 290px;" class="cursor">
                                            <div v-if="userRoot || user.id_group == 11 || user.id_group == 1">
                                                <!-- VER CURSOS ESTUDIANTE
                                                    <vs-dropdown-item v-if="tr.id_group == 4">
                                                        <vs-button color="success" type="line" class="w-full"
                                                            @click="verCursos(tr.idusuario)">Ver cursos
                                                            estudiante</vs-button>
                                                    </vs-dropdown-item> -->
                                                <!--VER LIBROS ESTUDIANTE-->
                                                <vs-dropdown-item v-if="tr.id_group == 4">
                                                    <vs-button color="primary" type="line" class="w-full" @click="verCursosLibrosEstudiante(tr.idusuario, tr.institucion_idInstitucion)">Ver
                                                        Cursos - Libros
                                                        estudiante</vs-button>
                                                </vs-dropdown-item>
                                                <!--VER HISTORICO INSTITUCIONES-->
                                                <vs-dropdown-item v-if="tr.id_group == 4">
                                                    <vs-button color="dark" type="line" class="w-full" @click="getHistoricoChangeInstitucion(tr)">Ver
                                                        historico instituciones</vs-button>
                                                </vs-dropdown-item>
                                                <!--ASIGNAR LIBROS-->
                                                <vs-dropdown-item v-if="tr.id_group == '6' || tr.id_group == '10' || tr.id_group == '9' || tr.id_group == '11'">
                                                    <vs-button color="#5E4BE5" type="line" class="w-full" @click="asignarTipo = false; irAsignacion(tr)">Asignar
                                                        libros</vs-button>
                                                </vs-dropdown-item>
                                                <!--LISTAR EVALUACIONES DEL DOCENTE-->
                                                <vs-dropdown-item v-if="tr.id_group == '6' || tr.id_group == '1'">
                                                    <vs-button color="success" type="line" class="w-full" @click="asignarTipo = false; verEvaluacionesDocente(tr)">Evaluaciones
                                                        del docente</vs-button>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <vs-button id="button-with-loading" color="dark" type="line" class="w-full" @click="userSelect = tr; openConfirmResetear(tr.email)">Resetear contraseña</vs-button>
                                                </vs-dropdown-item>
                                                <!--DOCUMENTOS NEET-->
                                                <vs-dropdown-item>
                                                    <vs-button color="#569B58" type="line" class="w-full" @click="userSelect = tr; getTemas(); irAsignacionNEE(tr)">Asignar Documentos NEE</vs-button>
                                                </vs-dropdown-item>
                                            </div>
                                            <!--EDITAR-->
                                            <vs-dropdown-item>
                                                <vs-button color="warning" type="line" class="w-full" @click="getEdit(tr)">Editar</vs-button>
                                            </vs-dropdown-item>
                                            <!--VISITAS DEL USUARIO-->
                                            <vs-dropdown-item>
                                                <vs-button color="primary" type="line" class="w-full" @click="getVisitas(tr)">Visitas del
                                                    usuario</vs-button>
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-col>
            </vs-row>
        </vs-card>
        <vx-card>
            <vs-collapse v-if="arregloHistorico.length > 0">
                <vs-collapse-item>
                    <div slot="header">
                        <p style="color:#2A9FF6;"><span><i class="fa-solid fa-flag"></i> Histórico del estudiante:
                                <b>{{
                                        datosHistorico.nombre }}</b> </span> </p>
                    </div>
                    <div>
                        <vs-table max-items="5" search pagination :data="arregloHistorico">
                            <template slot="header">
                                <vs-chip tranparent color="primary">Cantidad {{ arregloHistorico.length }}</vs-chip>
                            </template>
                            <template slot="thead">
                                <vs-th>Editor</vs-th>
                                <vs-th>Institución Anterior</vs-th>
                                <vs-th>Institución Nueva</vs-th>
                                <vs-th>Período</vs-th>
                                <vs-th>Fecha</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{ data[indextr].editor }}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].institucionAnterior }}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].institucionNueva }}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].periodo }}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].created_at }}<br>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-collapse-item>
            </vs-collapse>
        </vx-card>
    </div>
    <div v-if="op_agregar == 1">
        <registro @escuchar="variableHijo"></registro>
    </div>
    <vs-card v-if="op_agregar == 3">
        <!-- <visitasUsuario @escuchar="variableHijo" :datoU="datoU" /> -->
        <div class="flex items-center mb-3">
            <vs-button color="primary" size="small" @click="variableHijo(0)" icon="reply" type="border"></vs-button>
        </div>
        <visitasUsers
            v-if="datoU"
            :institucionSelected="visitasInstitucionSelected"
            :usuarioSelected="datoU"
        />
    </vs-card>
    <!--Modal de Editar-->
    <vs-popup @close="busquedaFiltroEstudiante();" fullscreen title="Editar Usuario" :active.sync="popupActivo" class="popupPadre">
        <editarUsuarioVue v-if="popupActivo" @saveChange="changeHandle" :usuarios="usuarios" :instituciones="instituciones" />
    </vs-popup>
    <!-- MODAL PARA LOS CURSOS DE ESTUDIANTES -->
    <vs-popup class="holamundo" :title="`Cursos - libros del estudiante ${usuarioEstudiante}`" v-if="popupCursosEstudiantes" :active.sync="popupCursosEstudiantes">
        <vs-tabs alignment="fixed">
            <vs-tab label="Cursos">
                <CursosEstudiantesVue :datoEstudiante="datoEstudiante" />
            </vs-tab>
            <vs-tab label="Libros">
                <Libros_estudianteVue :datoEstudiante="datoEstudiante" />
            </vs-tab>
        </vs-tabs>
    </vs-popup>
    <!-- Modal para Asignacion de libros al docente-->
    <vs-popup title="Asignar libros a docentes" @close="f_close_modal()" fullscreen :active.sync="popupAsignacion" v-if="asignarTipo === true">
        <vx-card>
            <Asignar_asignaturas_a_docentes_Vue :usuarioSelect="usuarioSelect" />
        </vx-card>
    </vs-popup>
    <vs-popup title="Asignacion Documentos NEET" fullscreen :active.sync="popupAsignacionNEE">
        <vs-list>
            <vs-list-item v-if="show_inst == 'si'" title="Institución" :subtitle="user_institucion"></vs-list-item>
            <vs-list-item v-if="periodo.periodo_id > 0" title="Período" :subtitle="periodo.descripcion">
                <vs-chip v-if="periodo.estado == 1" color="success">Activo</vs-chip>
                <vs-chip v-else color="danger">Desactivado</vs-chip>
            </vs-list-item>
            <vs-list-item title="Nombre" :subtitle="userSelect.nombres + ' ' + userSelect.apellidos"></vs-list-item>
            <vs-list-item title="Cédula" :subtitle="userSelect.cedula"></vs-list-item>
            <vs-list-item title="Email" :subtitle="userSelect.email"></vs-list-item>
        </vs-list>
        <br><br>
        <AsignarDocumentosVue v-if="popupAsignacionNEE" :arregloTemas="arregloTemas" :userExterno="userSelect" externo="1" />
    </vs-popup>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import registro from '../agrega_usuario.vue'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import moment from 'moment'
import 'flatpickr/dist/flatpickr.css';
import asignarLibrosVue from '../../institucion/components/asignarLibros.vue';
// import visitasUsuario from './components/visitasUsuario.vue'
import visitasUsers from '@/views/director/visitasUsers.vue'
import editarUsuarioVue from './components/editarUsuario.vue';
import AsignarDocumentosVue from '@/views/nee_documentos/components/AsignarDocumentos'
import Asignar_asignaturas_a_docentes_Vue from '@/views/docentes/asignaturas_docente/asignar_asignaturas_a_docentes.vue';
import Libros_estudiante from '../../home/estudiante/libros_estudiante.vue';
// import ListaEvaluacionesDocente from '../../evaluaciones/listaEvaluacionesDocente.vue';
const CursosEstudiantesVue = () => import('@/views/home/estudiante/cursos_estudiante.vue')
const Libros_estudianteVue = () => import('@/views/home/estudiante/libros_estudiante.vue')
import Generalmix from '../../../mixins/Generalmix';
export default {
    mixins: [Generalmix],
    components: {
        'v-select': vSelect,
        registro,
        flatPickr,
        asignarLibrosVue,
        // visitasUsuario,
        visitasUsers,
        editarUsuarioVue,
        AsignarDocumentosVue,
        Asignar_asignaturas_a_docentes_Vue,
        CursosEstudiantesVue,
        Libros_estudianteVue,
        // ListaEvaluacionesDocente,
    },
    data() {
        return {
            modalListarEvalDocente: false,
            popupAsignacion: false,
            op_agregar: 0,
            popupVistaUsuarios: false,
            popupCursosEstudiantes: false,
            popupLibrosEstudiantes: false,
            valorBusqueda: "2",
            codigosLibros: [],
            estudiantesCursos: [],
            estudiantesCodigos: [],
            busqueda: "usuario",
            estudiantes: [],
            usuario: {
                razonBusqueda: "",
            },
            popupActivo: false,
            instituciones: [],
            usuarios: {
                idusuario: "",
                cedula: "",
                nombres: "",
                apellidos: "",
                email: "",
                name_usuario: "",
                telefono: "",
                estado_idEstado: "",
                institucion_idInstitucion: "",
                id_group: "",
                fecha_nacimiento: '',
                cargo_id: '',
                iniciales: '',
                foto_user: '',
                capacitador: ''
            },
            docente: '',
            listaVisitas: [],
            datoU: '',
            cantidad_cursos: "",
            cursosCodigos: [],
            user: [],
            seleccionadas: '',
            area: [],
            user_institucion: '',
            user_email: '',
            show_inst: '',
            user_nombre: '',
            fromDate: null,
            toDate: null,
            //variables para el historico
            datosHistorico: {
                nombre: ''
            },
            arregloHistorico: [],
            //fin variables para el historico
            periodo: {
                periodo_id: 0,
                estado: 0,
                descripcion: '',
            },
            userRoot: false,
            //VARIABLES NEE
            popupAsignacionNEE: false,
            userSelect: {},
            arregloTemas: [],
            //FIN VARIABLES NEE
            userFacturadores: false,
            modoFiltroRoot: 'multi',
            grupoFiltroRoot: [],
            gruposFiltroRoot: [],
            usuarioEstudiante: '',
            codigoCurso: '',
            usuarioSelect: {},
            asignarTipo: false,
            datoEstudiante: '',
            datoDocenteEvaluacion: {},
        };
    },
    mounted() {
        let me = this;
        localStorage.removeItem("datoDocenteEvaluacion"); //remover item usado en la vista listaEvaluacionesDocente
        me.user = JSON.parse(localStorage.getItem('usuario'))
        me.$http.get(me.$server_url + 'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
        me.getUserRoot(me.user);
        me.cargarGruposFiltroRoot();
        if (me.user.id_group == 22 || me.user.id_group == 23) {
            me.userFacturadores = true
        }
    },
    computed: {
        visitasInstitucionSelected() {
            if (!this.datoU) return null;
            return {
                idInstitucion: this.datoU.institucion_idInstitucion,
                nombreInstitucion: this.datoU.nombreInstitucion
            };
        }
    },
    watch: {
        modoFiltroRoot(newValue) {
            this.estudiantesCursos = [];
            if (newValue === 'prolipa') {
                this.busquedaFiltroEstudiante();
            }
        }
    },
    methods: {
        changeHandle(e) {
            let me = this
            me.busquedaFiltroEstudiante();
            me.popupActivo = false;
        },
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        cargarGruposFiltroRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'obtenerPerfiles?id_group=' + me.user.id_group)
                .then(function (res) {
                    let grupos = Array.isArray(res.data) ? res.data : [];
                    grupos = grupos.map(function (item) {
                        return {
                            id: item.id,
                            level: item.level ? item.level : item.deskripsi
                        }
                    })
                    me.gruposFiltroRoot = grupos;
                })
                .catch(function (error) {
                    me.gruposFiltroRoot = [];
                })
        },
        limpiarFiltroRoot() {
            let me = this;
            me.usuario.razonBusqueda = '';
            me.grupoFiltroRoot = [];
            me.estudiantesCursos = [];
            me.arregloHistorico = [];
            me.valorBusqueda = '2';
            me.busqueda = 'usuario';
        },

        //agregar usuario
        agrega_nuevo_user() {
            let me = this;
            me.op_agregar = 1;
        },
        listaUsuarios() {
            let me = this;
            me.op_agregar = 2;
        },
        variableHijo(valor) {
            let me = this;
            me.op_agregar = valor;
        },
        //====METODOS NEET
        irAsignacionNEE(item) {
            let me = this;
            me.getPeriodo(item);
            me.popupAsignacionNEE = true;
        },
        getTemas() {
            let me = this
            this.$http.get(this.$server_url + `neetTema?listadoTemas=yes`).then(res => {
                    me.arregloTemas = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        //asignacion del usuario docente
        //FIN METODOS NEETT
        irAsignacion(item) {
            let me = this;
            me.asignarTipo = false;
            me.usuarioSelect = {};
            if (item) {
                me.asignarTipo = true;
                me.usuarioSelect = item;
                me.popupAsignacion = true;
            }
            // localStorage.setItem('user_select', (JSON.stringify(item)));
            // localStorage.setItem('show_inst', 'si'); //desde vista docentes, mostrar institucion
            // me.show_inst = (localStorage.getItem('show_inst'));
            // me.usuarioAsignacion = JSON.parse(localStorage.getItem('user_select'));
            // me.user_seleccionado = me.usuarioAsignacion.idusuario
            // me.user_nombre = me.usuarioAsignacion.nombres + ' ' + me.usuarioAsignacion.apellidos
            // me.user_email = me.usuarioAsignacion.email
            // me.user_institucion = item.nombreInstitucion
            // me.getAreaSelect();
            // me.getSeleccionadas();
            // me.getPeriodo(item);
        },
        //=======METODOS PARA MODAL DE ASIGNACION DE LIBROS
        //=======FIN DE METODOS PARA MODAL DE ASIGNACION DE LIBROS
        busquedaFiltroEstudiante() {
            let me = this;
            me.estudiantesCursos = [];
            me.arregloHistorico = [];

            if (me.userRoot && me.modoFiltroRoot == 'prolipa') {
                me.$vs.loading();
                let urlRoot = this.$server_url + 'busquedaFiltroEstudiante?rootMultiFiltro=yes&razonBusqueda=solousuariosProlipa';
                this.$http.get(urlRoot)
                    .then(function (res) {
                        me.$vs.loading.close()
                        if (res.data.status == '0') {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return false;
                        }

                        var datosRoot = res.data
                        if (me.userFacturadores) {
                            datosRoot = res.data.filter(p => p.id_group != 1)
                        }
                        me.estudiantesCursos = datosRoot;

                        if (me.estudiantesCursos.length == 0) {
                            me.$vs.notify({
                                text: 'No se encontro resultados',
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                        }
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
                return;
            }

            if (me.userRoot && me.modoFiltroRoot == 'multi') {
                let razonBusquedaRoot = me.usuario.razonBusqueda != null ? me.usuario.razonBusqueda.trim() : '';
                if (razonBusquedaRoot.length == 0 && (!Array.isArray(me.grupoFiltroRoot) || me.grupoFiltroRoot.length == 0)) {
                    me.$vs.notify({
                        text: 'Ingrese un dato de búsqueda o seleccione un grupo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }

                me.$vs.loading();
                let urlRoot = this.$server_url + 'busquedaFiltroEstudiante?rootMultiFiltro=yes&razonBusqueda=' + encodeURIComponent(razonBusquedaRoot);
                if (Array.isArray(me.grupoFiltroRoot) && me.grupoFiltroRoot.length > 0) {
                    urlRoot = urlRoot + '&grupos=' + me.grupoFiltroRoot.join(',');
                }

                this.$http.get(urlRoot)
                    .then(function (res) {
                        me.$vs.loading.close()
                        if (res.data.status == '0') {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return false;
                        }

                        var datosRoot = res.data
                        if (me.userFacturadores) {
                            datosRoot = res.data.filter(p => p.id_group != 1)
                        }
                        me.estudiantesCursos = datosRoot;

                        if (me.estudiantesCursos.length == 0) {
                            me.$vs.notify({
                                text: 'No se encontro resultados',
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                        }
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
                return;
            }

            if (me.usuario.razonBusqueda.trim().length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading();
            if (me.user.id_group == 11) {
                //PARA LOS ASESORES
                this.$http.get(this.$server_url + 'busquedaFiltroEstudiante?busqueda=' + me.busqueda + '&razonBusqueda=' + me.usuario.razonBusqueda + '&asesor=yes')
                    .then(function (res) {
                        me.$vs.loading.close()
                        if (res.data.status == '0') {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return false;
                        } else {
                            me.estudiantesCursos = res.data;
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()

                    })
            } else {
                //para los administradores
                this.$http.get(this.$server_url + 'busquedaFiltroEstudiante?busqueda=' + me.busqueda + '&razonBusqueda=' + me.usuario.razonBusqueda)
                    .then(function (res) {
                        me.$vs.loading.close()
                        if (res.data.status == '0') {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return false;
                        } else {
                            var datos = res.data
                            if (me.userFacturadores) {
                                datos = res.data.filter(p => p.id_group != 1)
                            }
                            me.estudiantesCursos = datos;
                        }
                        if (me.estudiantesCursos.length == 0) {
                            me.$vs.notify({
                                text: 'No se encontro resultados',
                                color: 'primary',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            }
        },
        //historico de cambios instituciones
        getHistoricoChangeInstitucion(tr) {
            let me = this;
            me.arregloHistorico = []
            me.datosHistorico.nombre = tr.nombres + " " + tr.apellidos
            me.$vs.loading();
            this.$http.get(this.$server_url + 'gestionEstudiante?getHistorico=yes&idusuario=' + tr.idusuario)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.length == 0) {
                        me.$vs.notify({
                            text: 'No hay historico del estudiante',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        return false;
                    }
                    me.arregloHistorico = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //editar
        getEdit(data = {}) {
            let me = this;
            console.log(data)
            me.usuarios = data
            setTimeout(() => {
                this.popupActivo = true;
            }, 200);
        },
        //para ver los libros de los estudiantes
        verCursosLibrosEstudiante(idusuario, institucion_idInstitucion) {
            let me = this;
            me.datoEstudiante = {
                idusuario: idusuario,
                institucion_idInstitucion: institucion_idInstitucion
            }
            me.popupCursosEstudiantes = true;
        },
        openConfirmResetear(email) {
            let me = this;
            me.userSelect.email = email;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText: 'Si, deseo resetear',
                cancelText: 'Cancelar',
                text: 'Estas seguro de resetear la contraseña?',
                accept: me.generarPassword,
            });

        },
        generarPassword() {
            let me = this;
            let formData = new FormData();
            me.$vs.loading();
            formData.append('idusuario', me.userSelect.idusuario);
            this.$http.post(this.$server_url + 'restaurarPasswordXIdUser', formData)
                .then(function (response) {
                    me.m_message('Use el número de cédula para acceder al perfil del usuario.', 'success', 'icon-check');
                })
                .catch(function (error) {
                    console.log("error", error);
                    me.m_message('Error en el proceso', 'danger', 'icon-alert-triangle')
                })
                .finally(() => {
                    me.$vs.loading.close();
                })
        },
        f_close_modal() {
            let me = this;
            me.asignarTipo = false;
        },
        getVisitas(tr) {
            let me = this;
            me.datoU = tr;
            me.op_agregar = 3;
        },
        verEvaluacionesDocente(item) {
            let me = this;
            me.datoDocenteEvaluacion = item;
            localStorage.setItem("datoDocenteEvaluacion", JSON.stringify(item));
            me.$router.push("/evaluaciones/desdeadmin");
            // me.modalListarEvalDocente = true;
        }
    }
}
</script>

<style scoped>
.popupPadre {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
}
</style>
