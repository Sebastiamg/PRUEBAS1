<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
        <center>
            <h4> {{nombre_curso}} </h4>
        </center>
        <div v-if="grupo_usuario == 6">
            <!-- <vs-button @click="crearProyecto()" color="success">Agregar proyecto</vs-button> -->
        </div>
        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab :label="'Mis proyectos ( '+proyectos_docente.length+' )' ">
                    <vs-table max-items="20" search pagination :data="proyectos_docente" style="margin-top:-20px">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                            <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <!-- mostrar solo los proyectos creados por el docente -->
                            <!-- <vs-tr :key="indextr" v-for="(tr, indextr) in data" v-if="data[indextr].asignatura.idasignatura == asignaturaDocente && data[indextr].idusuario== miusuario.idusuario"> -->
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <vs-td width="25%">
                                    <span v-if="data[indextr].proyectos_asignaturas.length > 0">
                                        <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].proyectos_asignaturas" :key="indexpr">
                                            {{pr.datos.nombreasignatura}}
                                        </vs-chip>
                                    </span>
                                    <span v-else class="text-danger"> Sin asignaturas </span>
                                </vs-td>
                                <vs-td width="25%">
                                    <small>
                                        Creado: {{data[indextr].createdAt | fecha}}<br>
                                        Actualizado: {{data[indextr].updatedAt | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <!-- <vx-tooltip style="display: inline-block;" text="editar proyecto" position="top" color="success" v-if="data[indextr].idusuario == miusuario.idusuario"> -->

                                    <vx-tooltip style="display: inline-block;" text="editar proyecto" position="top" color="success">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="visualizar proyecto" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr],tipoProy='docente')" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="asignar proyecto" position="top" color="warning">
                                        <vs-button @click="confirmarAsignar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-link" color="warning" type="gradient"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="eliminar proyecto" position="top" color="danger" v-if="data[indextr].idusuario == miusuario.idusuario">
                                        <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>

                <vs-tab :label="'Proyectos Prolipa ( '+ proyectos_prolipa.length + ' )'" v-if="tipo_asignatura  == 'prolipa'">
                    <vs-table max-items="20" search pagination :data="proyectos_prolipa" style="margin-top:-20px">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <!-- <vs-th>Asignatura</vs-th> -->
                            <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small>{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <!-- <vs-td width="25%">
                                    <div v-for="(pr, indexpr) in data[indextr].proyectos_asignaturas" :key="indexpr">
                                        <li>
                                            <small>{{pr.datos.nombreasignatura}}</small>
                                        </li>
                                    </div>
                                </vs-td> -->
                                <vs-td width="25%">
                                    <small>
                                        <span v-if="grupo_usuario == '1' || grupo_usuario ==10"> Responsable: {{data[indextr].asignatura.user_nombre}} {{data[indextr].asignatura.user_apellido}}<br> </span>
                                        Creado: {{data[indextr].createdAt | fecha}}<br>
                                        Actualizado: {{data[indextr].updatedAt | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <vx-tooltip style="display: inline-block;" text="visualizar proyecto" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy='prolipa')" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="asignar proyecto" position="top" color="warning">
                                        <vs-button @click="confirmarAsignar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-link" color="warning" type="gradient"></vs-button>
                                    </vx-tooltip>

                                    <label v-if="grupo_usuario == 1">
                                        <vx-tooltip style="display: inline-block;" text="editar proyecto" position="top" color="success" v-if="data[indextr].idusuario == miusuario.idusuario">
                                            <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                        </vx-tooltip>

                                        <vx-tooltip style="display: inline-block;" text="eliminar proyecto" position="top" color="danger" v-if="data[indextr].idusuario == miusuario.idusuario">
                                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                        </vx-tooltip>
                                    </label>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>

                <vs-tab :label="'Asignados a este curso ( '+ proyectos_asignados.length + ' )' ">
                    <div v-if="proyectos_asignados.length >0">
                        <p class="m-3">
                            <!-- {{proyecto.id}} -->
                            <!-- El proyecto <b><i><u> {{proyecto.nombre}}</u></i></b> está sido asignado a los siguientes cursos -->
                        </p>
                        <vs-table max-items="20" search pagination :data="proyectos_asignados" style="margin-top:-20px">
                            <template slot="thead">
                                <vs-th sort-key="nombre">Nombre</vs-th>
                                <vs-th sort-key="updatedAt">Fecha</vs-th>
                                <vs-th>Estado</vs-th>
                                <vs-th>Respuestas</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{data[indextr].datos.nombre_proyecto}}<br>
                                        <small>{{data[indextr].datos.descripcion_proyecto}}</small>
                                    </vs-td>
                                    <vs-td width="30%">
                                        <b>Asignado:</b> {{ fechaLarga(data[indextr].createdAt)}}<br>
                                        <b>Actualizado:</b> {{ fechaLarga(data[indextr].updatedAt)}}
                                    </vs-td>
                                    <vs-td width="20%">
                                        <vs-switch class="" vs-icon-on="check" color="success" v-model="data[indextr].estado" @click="cambiarEstado(tr)" style="width: 100px;">
                                            <span slot="on">Activo</span>
                                            <span slot="off">Inactivo </span>
                                        </vs-switch>
                                        <small v-if="data[indextr].estado == false" class="text-danger" style="font-size:10px">Los estudiantes no podrán visualizar este proyecto</small>
                                    </vs-td>
                                    <vs-td width="10%">
                                        <vs-button class="m-1" color="primary" type="gradient" icon-pack="feather" icon="icon-eye" size="small" @click="verRespuestas(data[indextr])">Respuestas</vs-button>
                                        <vs-button class="m-1" color="danger" type="gradient" icon-pack="feather" icon="icon-trash" size="small" @click="confirmarQuitarAsignacion(tr)">Quitar</vs-button>
                                    </vs-td>

                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <p class="m-3"> No tiene proyectos asignados a este curso</p>
                    </div>

                </vs-tab>

            </vs-tabs>
        </div>
    </vx-card>

</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from "moment";
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
    data() {
        return {
            lista_proyectos: '',
            eliminaWQ: '',
            usuario: '',
            grupo_usuario: '',
            proyectos_prolipa: [],
            proyectos_todo_docentes: [],
            proyectos_docente: [],
            asignaturaDocente: '',
            tipoProy: '',
            codigocurso: '',
            idcurso: '',
            itemAsignarProyecto: '',
            tmp_asignar: {},
            datos: {},
            proyectos_asignados: [],
            datos: {},
            nombre_curso: '',
            tipo_asignatura: '',
            miusuario: '',
            conRespuestas: false,
            respuestasEliminar: [],
            datoU: '',
            idusuario: '',
            grupo_usuario: '',

        }
    },
    mounted() {
        localStorage.removeItem('webq')
        localStorage.removeItem('edita')
        localStorage.removeItem('proyecto')
        this.tipo_asignatura = localStorage.getItem('tipo_asignatura');
        this.codigocurso = localStorage.getItem('codigo');
        this.idcurso = localStorage.getItem('idcurso');
        this.nombre_curso = localStorage.nombre_curso
        this.tmp_asignar.curso = this.codigocurso;
        // console.log('curso actual-> ' + this.tmp_asignar.curso)
        this.nombreasignaturaDocente = localStorage.getItem('nombreasignatura')
        this.asignaturaDocente = localStorage.getItem('idasignatura')
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            this.miusuario = this.datoU
            // console.log(this.datoU)
            // this.idusuario = this.datoU.idusuario;
        }
        this.getProyectos();
        this.proyectosAsignados();
    },
    methods: {
        getProyectos() {
            let me = this;
            me.$vs.loading()
            axios.post('https://foro.prolipadigital.com.ec/graphql', {
                    query: 'query { proyectos { id nombre descripcion asignatura idusuario grupo_usuario archivo{id} archivodocente{id} fileIntroduccion{id} fileTarea{id} fileProceso{id} fileRecurso{id} fileEvaluacion{id} fileConclusion{id} createdAt updatedAt proyectos_asignaturas{ id datos idasignatura } } }'
                })
                .then(res => {
                    me.lista_proyectos = res.data.data.proyectos;
                    // console.log(me.lista_proyectos)
                    me.proyectos_docente = [];
                    me.proyectos_prolipa = [];
                    for (let index = 0; index < me.lista_proyectos.length; index++) {
                        // // filtrar los proyectos del docente, de la asignatura  que se encuentre seleccionado
                        for (let j = 0; j < me.lista_proyectos[index].proyectos_asignaturas.length; j++) {
                            if (me.lista_proyectos[index].proyectos_asignaturas[j].datos.grupo_usuario == 6 &&
                                me.lista_proyectos[index].proyectos_asignaturas[j].datos.idusuario == me.miusuario.idusuario &&
                                me.lista_proyectos[index].proyectos_asignaturas[j].idasignatura == me.asignaturaDocente
                            ) {
                                me.proyectos_docente.push(me.lista_proyectos[index]);
                            }
                            if (me.lista_proyectos[index].proyectos_asignaturas[j].datos.grupo_usuario == 1 &&
                                me.lista_proyectos[index].proyectos_asignaturas[j].idasignatura == me.asignaturaDocente
                            ) {
                                me.proyectos_prolipa.push(me.lista_proyectos[index]);
                            }
                        }

                        // // filtrar los proyectos de PROLIPA, de la asignatura  que se encuentre seleccionado
                        // for (let prol = 0; prol < me.lista_proyectos[index].proyectos_asignaturas.length; prol++) {
                        // }
                    }
                    me.$vs.loading.close()
                    // console.log(me.proyectos_prolipa)
                    // console.log(me.proyectos_docente)
                })
                .catch(error => {
                    console.log(' no hay conexion con la base de datos ' + error)
                    me.$vs.loading.close()
                })

        },
        crearProyecto() {
            let me = this
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }

            this.$router.push('/docente/crearProyecto');
        },
        editaWebQ(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            this.$router.push('/docente/crearProyecto');
        },
        openConfirmEliminar(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.eliminaWQ = item
            axios.get('https://foro.prolipadigital.com.ec/cursos-proyectos?idproyecto=' + item.id)
                .then(function (res) {
                    // console.log(res.data.length);
                    if (res.data.length > 0) {
                        me.$vs.notify({
                            time: 5000,
                            text: 'Este proyecto se encuentra asignado a un curso, y no puede ser eliminado, primero debe eliminar la asignación',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: `Confirmar`,
                            text: '¿Está seguro en eliminar este proyecto?',
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                            accept: me.f_eliminarWebQ
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })

        },
        f_eliminarWebQ() {
            let me = this;
            let cantidad = me.eliminaWQ.proyectos_asignaturas.length;
            let conteo = 0;
            //eliminar archivo
            if (me.eliminaWQ.archivo != undefined && me.eliminaWQ.archivo != null && me.eliminaWQ.archivo.length>0) {
                // console.log(me.eliminaWQ.archivo[0].id)
                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.archivo[0].id)
                    .then(function (res) {
                        me.$vs.notify({
                            text: 'Archivo eliminado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                    .catch(function (error) {
                        me.$vs.notify({
                            text: 'No se eliminó el archivo',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
            }
            if (me.eliminaWQ.fileIntroduccion != null) {
                if (me.eliminaWQ.fileIntroduccion[0] != undefined) { //eliminar fileIntroduccion del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.fileIntroduccion[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de INTRODUCCION eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de INTRODUCCION ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }
            if (me.eliminaWQ.fileTarea != null) {
                if (me.eliminaWQ.fileTarea[0] != undefined) { //eliminar fileTarea del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.fileTarea[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de TAREA eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de TAREA ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }
            if (me.eliminaWQ.fileProceso != null) {
                if (me.eliminaWQ.fileProceso[0] != undefined) { //eliminar fileProceso del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.fileProceso[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de PROCESO eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de PROCESO ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }
            if (me.eliminaWQ.fileRecurso != null) {
                if (me.eliminaWQ.fileRecurso[0] != undefined) { //eliminar fileRecurso del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.fileRecurso[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de RECURSO eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de RECURSO ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }
            if (me.eliminaWQ.fileEvaluacion != null) {
                if (me.eliminaWQ.fileEvaluacion[0] != undefined) { //eliminar fileEvaluacion del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.fileEvaluacion[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de EVALUACION eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de EVALUACION ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }
            if (me.eliminaWQ.fileConclusion != null) {
                if (me.eliminaWQ.fileConclusion[0] != undefined) { //eliminar fileConclusion del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.fileConclusion[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de CONCLUSION eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de CONCLUSION ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }

            for (let index = 0; index < me.eliminaWQ.proyectos_asignaturas.length; index++) {
                axios.delete('https://foro.prolipadigital.com.ec/proyectos-asignaturas/' + me.eliminaWQ.proyectos_asignaturas[index].id)
                    .then(res => {
                        // console.log('asignatura asociada, eliminada ')
                        conteo++;
                        // console.log(conteo)
                        if (conteo == cantidad) {
                            // console.log('igualdad')
                            axios.delete('https://foro.prolipadigital.com.ec/proyectos/' + me.eliminaWQ.id)
                                .then(res => {
                                    me.$vs.notify({
                                        text: 'Proyecto eliminado correctamente',
                                        color: 'success',
                                        iconPack: 'feather',
                                        icon: 'icon-check'
                                    })
                                    me.getProyectos()
                                })
                                .catch(error => {
                                    console.log(error)
                                    me.$vs.notify({
                                        text: 'No se eliminó el proyecto',
                                        color: 'warning',
                                        iconPack: 'feather',
                                        icon: 'icon-alert-triangle'
                                    })
                                })
                        }
                    })
                    .catch(error => {
                        console.log('no se eliminaron las asignaturas asociadas a este proyecto ' + error)
                    })

            }

        },
        verWebQ(item) {
            let me = this;
            // console.log(item);
            me.datos.user_nombres = me.miusuario.nombres
            me.datos.user_apellidos = me.miusuario.apellidos
            me.datos.user_email = me.miusuario.email
            me.datos.user_name_usuario = me.miusuario.name_usuario
            me.datos.user_telefono = me.miusuario.telefono
            me.datos.user_institucion = me.miusuario.institucion_idInstitucion
            me.datos.nombre_proyecto = item.nombre
            me.datos.descripcion_proyecto = item.descripcion
            me.datos.asignatura = me.nombreasignaturaDocente
            me.datos.idasignatura = me.asignaturaDocente
            me.datos.idproyecto = item.idproyecto
            // axios.post('https://foro.prolipadigital.com.ec/historico-proyectos/', {
            //         'idusuario': me.miusuario.idusuario,
            //         'idgrupo': me.miusuario.id_group,
            //         'datos': me.datos
            //     })
            //     .then(function (response) {})
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo':'proyecto',
                'recurso_nombre': item.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            if (me.grupo_usuario == 10) {
                this.$router.push('/director/institucion/docentes/contenidos/libro/curso/proyectos/verproyecto');
            } else {

                this.$router.push('/ver_quest');
            }
        },
        confirmarAsignar(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            // localStorage.proyecto = JSON.stringify(item);
            // me.$router.push('/docente/asignarProyecto');
            // console.log(item)
            me.tmp_asignar.idasignatura = me.asignaturaDocente
            me.tmp_asignar.idusuario = me.miusuario.idusuario
            me.tmp_asignar.idcurso = me.idcurso
            me.tmp_asignar.idproyecto = item.id
            me.tmp_asignar.proyecto = item
            me.datos.asignatura = me.nombreasignaturaDocente
            me.datos.nombre_proyecto = item.nombre
            me.datos.descripcion_proyecto = item.descripcion
            // console.log(me.tmp_asignar, me.datos)
            for (let index = 0; index < me.proyectos_asignados.length; index++) {
                // console.log(me.proyectos_asignados[index].curso)
                if (me.tmp_asignar.idproyecto == me.proyectos_asignados[index].idproyecto) {
                    me.$vs.notify({
                        text: 'El proyecto ya se encuentra asignado a este curso.',
                        time: 7000,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
            }
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Desea agregar este proyecto al curso?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.asignarProyectoSeleccionado
            })
        },
        asignarProyectoSeleccionado() {
            let me = this;
            // console.log(me.tmp_asignar)            
            axios.post('https://foro.prolipadigital.com.ec/cursos-proyectos', {
                    curso: me.tmp_asignar.curso,
                    datos: me.datos,
                    idasignatura: me.tmp_asignar.idasignatura,
                    idusuario: me.tmp_asignar.idusuario,
                    idcurso: me.tmp_asignar.idcurso,
                    idproyecto: me.tmp_asignar.idproyecto,
                    estado: true,
                    proyectos: [],
                })
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Proyecto asignado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.proyectosAsignados()
                    // console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error + ' no se agrego el curso proyecto')
                })
        },
        proyectosAsignados() {
            let me = this;
            // console.log(me.tmp_asignar.curso)
            me.$vs.loading()
            axios.get('https://foro.prolipadigital.com.ec/cursos-proyectos?curso=' + me.tmp_asignar.curso)
                .then(function (response) {
                    me.proyectos_asignados = response.data
                    // console.log(me.proyectos_asignados);
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
        },
        confirmarQuitarAsignacion(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.id_eliminar = item
            // console.log(item, me.conRespuestas)
            me.respuestasEliminar = [];
            axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + item.idproyecto + '&curso=' + item.curso)
                .then(function (res) {
                    if (res.data.length > 0) {
                        me.conRespuestas = true;
                        me.respuestasEliminar = (res.data)
                        console.log(me.respuestasEliminar)
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: `Confirmar`,
                            text: 'Este proyecto ya tiene ' + res.data.length + ' respuestas. Si lo elimina, NO PODRÁ RECUPERAR DICHA INFORMACIÓN. ¿Esta seguro que desea eliminar? ',
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                            accept: me.eliminarAsignacion
                        })
                    } else {
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: `Confirmar`,
                            text: '¿Está seguro en eliminar esta asignación?',
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                            accept: me.eliminarAsignacion
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    // console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
            // return

        },
        eliminarAsignacion() {
            let me = this;
            let res_eliminadas = me.respuestasEliminar.length;
            let conteo = 0;
            //eliminar proyecto
            // console.log(me.conRespuestas)

            if (me.conRespuestas) {
                for (let index = 0; index < me.respuestasEliminar.length; index++) {
                    axios.delete('https://foro.prolipadigital.com.ec/respuestas-proyectos/' + me.respuestasEliminar[index].id)
                        .then(res => {
                            conteo++;
                            // console.log(conteo, res_eliminadas)
                            if (me.respuestasEliminar[index].fileintroduccion != '' && me.respuestasEliminar[index].fileintroduccion !== null && me.respuestasEliminar[index].fileintroduccion !== undefined) {
                                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].fileintroduccion[0].id)
                                    .then(res => {
                                        // console.log( 'fileintroduccion borrado' )
                                    })
                                    .catch(err => {
                                        // console.log( 'fileintroduccion NEGADOOOOOOOOOOOO' )
                                    })
                            }
                            if (me.respuestasEliminar[index].filetareas != '' && me.respuestasEliminar[index].filetareas !== null && me.respuestasEliminar[index].filetareas !== undefined) {
                                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].filetareas[0].id)
                                    .then(res => {
                                        // console.log( 'filetareas borrado' )
                                    })
                                    .catch(err => {
                                        // console.log( 'filetareas NEGADOOOOOOOOOOOO' )
                                    })
                            }
                            if (me.respuestasEliminar[index].fileproceso != '' && me.respuestasEliminar[index].fileproceso !== null && me.respuestasEliminar[index].fileproceso !== undefined) {
                                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].fileproceso[0].id)
                                    .then(res => {
                                        // console.log( 'fileproceso borrado' )
                                    })
                                    .catch(err => {
                                        // console.log( 'fileproceso NEGADOOOOOOOOOOOO' )
                                    })
                            }
                            if (me.respuestasEliminar[index].filerecursos != '' && me.respuestasEliminar[index].filerecursos !== null && me.respuestasEliminar[index].filerecursos !== undefined) {
                                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].filerecursos[0].id)
                                    .then(res => {
                                        // console.log( 'filerecursos borrado' )
                                    })
                                    .catch(err => {
                                        // console.log( 'filerecursos NEGADOOOOOOOOOOOO' )
                                    })
                            }
                            if (me.respuestasEliminar[index].filevaluacion != '' && me.respuestasEliminar[index].filevaluacion !== null && me.respuestasEliminar[index].filevaluacion !== undefined) {
                                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].filevaluacion[0].id)
                                    .then(res => {
                                        // console.log( 'filevaluacion borrado' )
                                    })
                                    .catch(err => {
                                        // console.log( 'filevaluacion NEGADOOOOOOOOOOOO' )
                                    })
                            }
                            if (me.respuestasEliminar[index].fileconclusiones != '' && me.respuestasEliminar[index].fileconclusiones !== null && me.respuestasEliminar[index].fileconclusiones !== undefined) {
                                axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].fileconclusiones[0].id)
                                    .then(res => {
                                        // console.log( 'fileconclusiones borrado' )
                                    })
                                    .catch(err => {
                                        // console.log( 'fileconclusiones NEGADOOOOOOOOOOOO' )
                                    })
                            }
                            if (conteo == res_eliminadas) {
                                me.$vs.notify({
                                    text: 'Todas las respuestas han sido eliminadas',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                })
                                // eliminar la asignacion, despues de eliminar sus respuestas
                                axios.delete('https://foro.prolipadigital.com.ec/cursos-proyectos/' + me.id_eliminar.id)
                                    .then(res => {
                                        me.$vs.notify({
                                            text: 'Asignación eliminada correctamente',
                                            color: 'success',
                                            iconPack: 'feather',
                                            icon: 'icon-check'
                                        })
                                        me.proyectosAsignados()
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        me.$vs.notify({
                                            text: 'No se eliminó la asignación',
                                            color: 'warning',
                                            iconPack: 'feather',
                                            icon: 'icon-alert-triangle'
                                        })
                                    })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            me.$vs.notify({
                                text: 'Las respuestas no se lograron eliminar.',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }

            } else {
                // eliminar la asignacion, cuando aun no tiene respuestas
                axios.delete('https://foro.prolipadigital.com.ec/cursos-proyectos/' + me.id_eliminar.id)
                    .then(res => {
                        me.$vs.notify({
                            text: 'Asignacion eliminada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.proyectosAsignados()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.notify({
                            text: 'No se eliminó la asignación',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
            }

        },
        cambiarEstado(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            // console.log(item.id, item.estado)
            me.$vs.loading()
            axios.put('https://foro.prolipadigital.com.ec/cursos-proyectos/' + item.id, {
                    estado: !item.estado
                })
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Estado actualizado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.proyectosAsignados();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se cambio de estado')
                    me.$vs.loading.close()
                })
        },
        verRespuestas(item) {
            let me = this;
            // console.log(item)
            localStorage.proyecto_curso = JSON.stringify(item)
            if (me.grupo_usuario == 10) {
                me.$router.push('/director/institucion/docentes/contenidos/libro/curso/proyectos/respuestas');

            } else {
                me.$router.push('/docente/proyectos/respuestas');
            }
        },
        volver() {
            let me = this;
            this.$router.go(-1);
        },
    }
}
</script>

<style lang="css">
.descripcion {
    color: rgb(123, 159, 160);
}
</style>
