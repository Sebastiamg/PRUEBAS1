<template>
<div class="vx-col md:w-full w-full mb-base">

    <vs-popup title="Editar curso" :active.sync="popupEditarCurso">

        Periodo
        <!-- {{periodo_curso.idperiodoescolar}} -->
        <v-select icon-pack="feather" class="mb-6" icon="icon-home" :options="periodos" :reduce="periodos => periodos" label="descripcion" v-model="periodo_curso" placeholder="Seleccione un periodo"></v-select>

        <vs-button class="w-full mt-4 mb-1" @click="editarCurso()" color="success" type="filled">Guardar</vs-button>

    </vs-popup>

    <vx-card>
        <div class="vx-row m-4">
            <!-- <div class="vx-col sm:w-1/2">
                De que perfil desea consultar:
                <v-select class="mb-4 w-full" v-model="perfilSelect" :options="perfiles" label="text" :reduce="perfiles => perfiles.value" />
            </div> -->
        </div>
        <div class="vx-row m-4" v-if="perfilSelect==1">
            <div class="vx-col sm:w-1/3">
                <div class="mt-2" style="font-size: 13px;">Buscar un curso por su código:</div>
                <vs-input style="display:inline-block" v-model="codigoSelect" placeholder="Código del curso" class="mr-2" @keyup.enter="getCursoDocente()" />
                <vs-button style="display:inline-block" class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="getCursoDocente()"></vs-button>
            </div>
            <div class="vx-col sm:w-1/3">

                <div class="mt-2" style="font-size: 13px;">Buscar cursos de un docente:</div>
                <vs-input style="display:inline-block" v-model="nameUsuario" placeholder="Nombre de usuario" class="mr-2" />
                <vs-button style="display:inline-block" class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="getCursosUsuario()"></vs-button>
            </div>
            <div class="vx-col sm:w-1/3 mt-6">
                <vs-button color="warning" type="border" icon-pack="feather" icon="icon-x" @click="limpiar()">Vaciar</vs-button>
            </div>
        </div>
        <div class="vx-row m-4" v-if="perfilSelect==2">
            <div class="vx-col sm:w-1/3">
                <div class="mt-2" style="font-size: 13px;">Buscar cursos de un estudiante:</div>
                <vs-input style="display:inline-block" v-model="emailSelect" placeholder="Email del estudiante" class="mr-2" />
                <vs-button style="display:inline-block" class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="getCursosEstudiante()"></vs-button>
            </div>
        </div>
        <div v-if="tipo==1">
            <div class="vx-row m-3" v-for="(item, indextr) in listaCursos" :key="indextr">
                <vs-divider>Asignar</vs-divider>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <vs-button style="display:inline-block" class="mt-2" color="success" type="gradient" @click="estado = 0; asignarCursoEstudiante(item.idcurso)">Asignar a estudiante</vs-button>
                </div>

                <vs-divider>Asignatura</vs-divider>
                <!-- <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Asignatura</b></div>
                    <div>{{item.nombreasignatura}}</div>
                </div> -->
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Tipo asignatura</b></div>
                    <div>
                        <span v-if="item.tipo_asignatura == 1">Creado por Prolipa</span>
                        <span v-else>Creado por el docente</span>
                    </div>
                </div>

                <vs-divider>Datos del curso</vs-divider>

                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Nombre</b></div>
                    <div>{{item.nombre}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Area</b></div>
                    <div>{{item.seccion}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Materia</b></div>
                    <div>{{item.materia}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Paralelo</b></div>
                    <div>{{item.aula}}</div>
                </div>
                <!-- <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Fecha creación</b></div>
                    <div>{{item.created_at}}</div>
                </div> -->
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Estado</b></div>
                    <div>
                        <span class="text-success" v-if="item.estado == 1">Activo</span>
                        <span class="text-danger" v-else>
                            <b>ELIMINADO</b>
                            <!-- <br>
                            <vs-button class="mt-2" color="success" type="gradient" @click="estado=1; recuperarCurso(item.idcurso)"> Recuperar curso </vs-button> -->
                        </span>
                    </div>
                </div>

                <div class="vx-col sm:w-1/2 w-full mb-3">

                    <vs-button v-if="item.estado==1" style="display:inline-block" class="mt-2" color="danger" type="gradient" @click="estado = 0; recuperarCurso(item.idcurso)">Eliminar curso</vs-button>

                    <vs-button v-else style="display:inline-block" class="mt-2" color="success" type="gradient" @click="estado = 1; recuperarCurso(item.idcurso)">Restaurar curso</vs-button>
                </div>
                <vs-divider>{{item.level}}</vs-divider>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Nombre docente</b></div>
                    <div>{{item.nombreDocente}} {{item.apellidoDocente}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Email</b></div>
                    <div>{{item.email}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Cedula</b></div>
                    <div>{{item.cedulaDocente}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Nombre de usuario</b></div>
                    <div>{{item.name_usuario}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Fecha de creación del usuario</b></div>
                    <div>{{item.creacionUsuario}}</div>
                </div>
                <vs-divider>Institución</vs-divider>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Institución</b></div>
                    <div>{{item.nombreInstitucion}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Estado institución</b></div>
                    <div class="text-capitalize">{{item.estadoInstitucion}}</div>
                </div>

            </div>
        </div>
        <div v-if="tipo==2">
            <vs-divider>Datos docente</vs-divider>

            <div class="m-3 vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Cantidad de cursos: </b></div>
                    <div>{{cursosUsuario.length}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3" v-if="cursosUsuario[0].nombres != undefined && cursosUsuario[0].apellidos != undefined">
                    <div style="font-size: 13px;"><b>Docente: </b></div>
                    <div>{{cursosUsuario[0].nombres}} {{cursosUsuario[0].apellidos}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Cedula: </b></div>
                    <div>{{cursosUsuario[0].cedula}} </div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Email: </b></div>
                    <div>{{cursosUsuario[0].email}} </div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Usuario: </b></div>
                    <div>{{cursosUsuario[0].name_usuario}} </div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Institución: </b></div>
                    <div>{{cursosUsuario[0].nombreInstitucion}} </div>
                </div>
            </div>
            <vs-table stripe pagination max-items="30" search :data="cursosUsuario">
                <template slot="thead">
                    <vs-th sort-key="codigo">Código curso</vs-th>
                    <vs-th>Datos</vs-th>
                    <vs-th sort-key="updated_at">Fecha</vs-th>
                    <vs-th sort-key="estado">Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].codigo">
                            {{ data[indextr].codigo }}
                        </vs-td>
                        <vs-td :data="data[indextr].nombre">
                            <b>Nombre:</b> {{ data[indextr].nombre }}<br>
                            <b>Aula:</b> {{ data[indextr].aula }}<br>
                            <b>Seccion:</b> {{ data[indextr].seccion }}
                            <span v-if="data[indextr].id_asignatura == 0" class="text-danger"> <br> Sin asignatura</span>
                        </vs-td>
                        <vs-td :data="data[indextr].updated_at">
                            <small> Actualizado: {{ data[indextr].updated_at }}<br>
                                Creado: {{ data[indextr].created_at }}</small>
                        </vs-td>
                        <vs-td :data="data[indextr].estado">
                            <span v-if="data[indextr].estado ==0" class="text-danger">Eliminado</span>
                            <span v-else class="text-success">Activo</span>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip v-if="data[indextr].estado==1" style="display: inline-block;" text="Eliminar curso" position="top" color="danger">
                                <vs-button style="display:inline-block" class="m-2" radius color="danger" type="gradient" icon-pack="feather" icon="icon-x" @click="estado = 0; recuperarCurso(data[indextr].idcurso)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip v-else style="display: inline-block;" text="Restaurar curso" position="top" color="success">
                                <vs-button style="display:inline-block" class="m-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-repeat" @click="estado = 1; recuperarCurso(data[indextr].idcurso)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Cambiar periodo" position="top" color="dark">
                                <vs-button class="m-2" radius color="dark" type="gradient" icon-pack="feather" icon="icon-edit" @click="getPeriodos(data[indextr])"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <!-- <div v-if="tipo==3">

            <vs-divider>Datos estudiante</vs-divider>
            <div class="m-3 vx-row">
                <div class="vx-col sm:w-1/2 w-full mb-3">
                    <div style="font-size: 13px;"><b>Cantidad de cursos: </b></div>
                    <div>{{cursosEstudiante.length}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3" v-if="cursosEstudiante[0].nombres != undefined && cursosEstudiante[0].apellidos != undefined">
                    <div style="font-size: 13px;"><b>Nombre: </b></div>
                    <div>{{cursosEstudiante[0].nombres}} {{cursosEstudiante[0].apellidos}}</div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3" v-if="cursosEstudiante[0].cedula != undefined">
                    <div style="font-size: 13px;"><b>Cedula: </b></div>
                    <div>{{cursosEstudiante[0].cedula}} </div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3" v-if="cursosEstudiante[0].email != undefined">
                    <div style="font-size: 13px;"><b>Email: </b></div>
                    <div>{{cursosEstudiante[0].email}} </div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3" v-if="cursosEstudiante[0].usuario != undefined">
                    <div style="font-size: 13px;"><b>Usuario: </b></div>
                    <div>{{cursosEstudiante[0].name_usuario}} </div>
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3" v-if="cursosEstudiante[0].nombreInstitucion != undefined">
                    <div style="font-size: 13px;"><b>Institución: </b></div>
                    <div>{{cursosEstudiante[0].nombreInstitucion}} </div>
                </div>
            </div>
            <vs-table stripe pagination max-items="30" search :data="cursosEstudiante">
                <template slot="thead">
                    <vs-th sort-key="codigo">Código curso</vs-th>
                    <vs-th>Datos</vs-th>
                    <vs-th sort-key="aula">Fecha actualizado</vs-th>
                    <vs-th sort-key="estado">Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].codigo">
                            {{ data[indextr].codigo }}
                        </vs-td>
                        <vs-td :data="data[indextr].nombre">
                            <b>Nombre:</b> {{ data[indextr].nombre }}<br>
                            <b>Aula:</b> {{ data[indextr].aula }}<br>
                            <b>Seccion:</b> {{ data[indextr].seccion }}
                        </vs-td>
                        <vs-td :data="data[indextr].updated_at">
                            {{ data[indextr].updated_at }}
                        </vs-td>
                        <vs-td :data="data[indextr].estado">
                            <span v-if="data[indextr].estado ==0" class="text-danger">Eliminado</span>
                            <span v-else class="text-success">Activo</span>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip v-if="data[indextr].estado==1" style="display: inline-block;" text="Eliminar curso" position="top" color="danger">
                                <vs-button style="display:inline-block" class="mt-2" radius color="danger" type="gradient" icon-pack="feather" icon="icon-x" @click="estado = 0; recuperarCurso(data[indextr].idcurso)"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip v-else style="display: inline-block;" text="Restaurar curso" position="top" color="success">
                                <vs-button style="display:inline-block" class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-repeat" @click="estado = 1; recuperarCurso(data[indextr].idcurso)"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div> -->
        <div>
            <vs-popup classContent="popup-example" :title='titulo' :active.sync="popupAsociar" >
                <AsociarCursoEstudiante :codigoSelect="codigoSelect"/>
            </vs-popup>
        </div>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import AsociarCursoEstudiante from './asociar-curso-estudiante.vue';
export default {
    components: {
        'v-select': vSelect,
        AsociarCursoEstudiante,
    },
    data() {
        return {
            codigoSelect: '',
            // codigoSelect: '79YA47XM',
            nameUsuario: '',
            listaCursos: [],
            cursosUsuario: [],
            cursosEstudiante: [],
            tipo: 0,
            estado: 0,
            t_usuario: '',
            perfiles: [{
                    value: 1,
                    text: 'Docente'
                },
                {
                    value: 2,
                    text: 'Estudiante'
                }
            ],
            perfilSelect: 1,
            emailSelect: '',
            popupEditarCurso: false,
            periodos: [],
            periodo_curso: [],
            curso_select: '',
            popupAsociar: false,
            titulo:'',
        }
    },
    mounted() {},
    methods: {
        getCursoDocente() {
            let me = this;
            me.tipo = 1;
            if (me.codigoSelect.length < 3) {
                me.$vs.notify({
                    text: 'Ingrese un código de curso válido',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + `buscarCursoCodigo/${me.codigoSelect}`).then(res => {
                    me.listaCursos = res.data;
                    console.log(me.listaCursos)
                    if (me.listaCursos.length < 1) {
                        me.$vs.notify({
                            text: 'El código ingresado no existe',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getCursosUsuario() {
            let me = this;
            if (me.nameUsuario.length < 3) {
                me.$vs.notify({
                    text: 'Ingrese un número de cedula',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            me.tipo = 2;
            me.$vs.loading()
            this.$http.get(this.$server_url + `cursos_x_usuario/${me.nameUsuario}`).then(res => {
                    if (res.data.length > 0) {
                        me.cursosUsuario = res.data;
                        console.log(me.cursosUsuario)
                    } else {
                        me.$vs.notify({
                            text: 'No se encontraron registros',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    if (me.cursosUsuario.length < 3) {
                        me.$vs.notify({
                            text: 'La cédula no existe',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getCursosEstudiante() {
            let me = this;
            me.cursosEstudiante = [];
            if (me.emailSelect.length < 5) {
                me.$vs.notify({
                    text: 'Ingrese un email válido',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.tipo = 3;
            me.$vs.loading()
            this.$http.get(this.$server_url + `cursos_x_estudiante/${me.emailSelect}`).then(res => {
                    if (res.data.length > 0) {
                        me.cursosEstudiante = res.data;
                    } else {
                        me.$vs.notify({
                            text: 'No existen registros con este correo',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    console.log(me.cursosEstudiante)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        recuperarCurso(id) {
            let me = this;
            let formData = new FormData();
            formData.append('id', id);
            formData.append('estado', me.estado);
            me.$vs.loading()
            this.$http.post(this.$server_url + `restaurarCurso/+${id}`, formData).then(res => {
                    if (me.tipo == 1) {
                        this.getCursoDocente();
                    }
                    if (me.tipo == 2) {
                        this.getCursoDocente();
                    }
                    if (me.tipo == 3) {
                        this.getCursosEstudiante();
                    }
                    if (me.estado == 0) {
                        me.$vs.notify({
                            text: 'Curso eliminado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Curso restaurado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        limpiar() {
            let me = this;
            me.tipo = 0;
            me.codigoSelect = '';
            me.nameUsuario = '';
            me.listaCursos = [];
            me.perfilSelect = 1;
            me.cursosUsuario = '';
            me.cursosEstudiante = '';
            me.emailSelect = '';
        },
        getPeriodos(item) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'periodosXInstitucion/' + item.idInstitucion).then(res => {
                    me.curso_select = item.idcurso
                    me.periodos = res.data;
                    me.popupEditarCurso = true
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        editarCurso() {
            let me = this
            me.popupEditarCurso = false

            if (!me.periodo_curso.idperiodoescolar) {
                me.$vs.notify({
                    text: 'Seleccione un periodo antes de guardar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            let data = new FormData();
            data.append('id_curso', me.curso_select);
            data.append('id_periodo', me.periodo_curso.idperiodoescolar);
            this.$http.post(this.$server_url + 'cambiar_periodo_curso', data).then(res => {
                    me.getCursoDocente()
                    me.$vs.notify({
                        text: 'Periodo modificado exitosamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.popupEditarCurso = false
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        asignarCursoEstudiante(){
          let me  =this;
          me.popupAsociar = true;
          console.log(me.codigoSelect);
        }
    }
}
</script>
