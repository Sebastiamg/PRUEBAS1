<template>
<div class="vx-col md:w-full w-full mb-base">
    <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
    <vx-card>
        <!-- <vs-button @click="crearProyecto()" color="success">Agregar proyecto</vs-button> -->
        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab :label="'Mis proyectos ( '+proyectos_admin_prolipa.length+' )'">
                    <vs-table max-items="20" search pagination :data="proyectos_admin_prolipa" style="margin-top:-20px">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                           <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <!-- mostrar solo los proyectos creados por el docente -->
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td width="40%">
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
                                <vs-td width="20%">
                                    <small>
                                        Creado: {{data[indextr].createdAt | fecha}}<br>
                                        Actualizado: {{data[indextr].updatedAt | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="10%">
                                    <!-- <vx-tooltip style="display: inline-block;" text="editar webquest" position="top" color="success" v-if="data[indextr].idusuario == usuario.idusuario"> -->
                                    <vx-tooltip style="display: inline-block;" text="editar webquest" position="top" color="success">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="visualizar webquest" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy=true)" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="eliminar webquest" position="top" color="danger" v-if="data[indextr].idusuario == usuario.idusuario">
                                        <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>

                <vs-tab :label="'Proyectos Prolipa ( '+proyectos_prolipa.length+' )'">
                    <vs-table max-items="20" search pagination :data="proyectos_prolipa" style="margin-top:-20px">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                           <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <vs-td width="25%">
                                    <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].proyectos_asignaturas" :key="indexpr">
                                        {{pr.datos.nombreasignatura}}
                                    </vs-chip>
                                </vs-td>
                                <vs-td width="25%">
                                    <small>
                                        <span v-if="grupo_usuario == '1'"> Responsable: {{data[indextr].asignatura.user_nombre}} {{data[indextr].asignatura.user_apellido}}<br> </span>
                                        <!-- <label v-if="data[indextr].proyectos_asignaturas[0] != null">
                                        </label> -->

                                        Creado: {{data[indextr].createdAt | fecha}}<br>
                                        Actualizado: {{data[indextr].updatedAt | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <vx-tooltip style="display: inline-block;" text="visualizar webquest" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy=true)" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>

                                    <label v-if="grupo_usuario == 1">
                                        <!-- <vx-tooltip style="display: inline-block;" text="editar webquest" position="top" color="success">
                                            <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                        </vx-tooltip> -->

                                        <vx-tooltip style="display: inline-block;" text="eliminar webquest" position="top" color="danger" v-if="data[indextr].idusuario == usuario.idusuario">
                                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                        </vx-tooltip>
                                    </label>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab :label="'Proyectos de docentes ( '+proyectos_todo_docentes.length+' )'">
                    <vs-table max-items="20" search pagination :data="proyectos_todo_docentes" style="margin-top:-20px">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                           <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <vs-td width="25%">
                                    <!-- {{data[indextr].asignatura.nombreasignatura}} -->
                                    <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].proyectos_asignaturas" :key="indexpr">
                                        {{pr.datos.nombreasignatura}}
                                    </vs-chip>
                                </vs-td>
                                <vs-td width="25%">
                                    <small>
                                        Docente: {{data[indextr].asignatura.user_nombre}} {{data[indextr].asignatura.user_apellido}}<br>
                                        Creado: {{data[indextr].createdAt | fecha}}<br>
                                        Actualizado: {{data[indextr].updatedAt | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <vx-tooltip style="display: inline-block;" text="visualizar webquest" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy=false)" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>

                                    <!-- <label v-if="grupo_usuario == 1">

                                    <vx-tooltip style="display: inline-block;" text="editar webquest" position="top" color="success" v-if="data[indextr].idusuario == usuario.idusuario">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="eliminar webquest" position="top" color="danger" v-if="data[indextr].idusuario == usuario.idusuario">
                                        <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                    </vx-tooltip>
                                </label> -->
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
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
// import gql from 'graphql-tag'

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
    // apollo: {
    //     proyectos: gql `query {
    //         proyectos { id nombre descripcion asignatura idusuario grupo_usuario archivo{id} archivodocente{id} createdAt updatedAt proyectos_asignaturas{ id datos idasignatura } } }`,
    // },
    data() {
        return {
            lista_proyectos: '',
            eliminaWQ: '',
            usuario: '',
            grupo_usuario: '',
            proyectos_prolipa: [],
            proyectos_todo_docentes: [],
            proyectos_admin_prolipa: [],
            asignaturaDocente: '',
            tipoProy: '',
            proyectos: '',
            miusuario: '',
            filesEliminar: ['archivo', 'archivodocente', 'fileIntroduccion', 'fileTarea', 'fileProceso', 'fileRecurso', 'fileEvaluacion', 'fileConclusion']
        }
    },
    mounted() {
        localStorage.removeItem('webq')
        localStorage.removeItem('edita')
        localStorage.removeItem('tipoProyectoControl')
        this.asignaturaDocente = localStorage.getItem('idasignatura')
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.grupo_usuario = this.miusuario.id_group
        this.getProyectos();
        // console.log('usuario dato ' + this.usuario, this.grupo_usuario)
    },
    methods: {
        getProyectos() {
            let me = this;
            axios.post('https://foro.prolipadigital.com.ec/graphql', {
                    query: 'query { proyectos { id nombre descripcion asignatura idusuario grupo_usuario archivo{id} archivodocente{id} fileIntroduccion{id} fileTarea{id} fileProceso{id} fileRecurso{id} fileEvaluacion{id} fileConclusion{id} createdAt updatedAt proyectos_asignaturas{ id datos idasignatura } } }'
                })
                .then(res => {
                    me.proyectos_admin_prolipa = [];
                    me.proyectos_prolipa = [];
                    me.proyectos_todo_docentes = [];
                    me.proyectos = (res.data.data.proyectos)
                    for (let index = 0; index < me.proyectos.length; index++) {
                        // filtrar los proyectos del docente, de la asignatura  que se encuentre seleccionado
                        if (me.proyectos[index].grupo_usuario == 1 &&
                            me.proyectos[index].idusuario == me.miusuario.idusuario
                        ) {
                            me.proyectos_admin_prolipa.push(me.proyectos[index]);
                        }

                        // filtrar los proyectos de PROLIPA
                        if (me.proyectos[index].grupo_usuario == 1) {
                            me.proyectos_prolipa.push(me.proyectos[index]);
                        }
                        // filtrar proyectos de los docentes
                        if (me.proyectos[index].grupo_usuario == 6) {
                            me.proyectos_todo_docentes.push(me.proyectos[index]);
                        }
                    }
                })
        },
        crearProyecto() {
            this.$router.push('/agregarProyectoAdmin');
        },
        editaWebQ(item) {
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            this.$router.push('/agregarProyectoAdmin');
        },
        openConfirmEliminar(item) {
            let me = this;
            me.eliminaWQ = item
            // console.log(item, me.eliminaWQ)
            // return
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este proyecto?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_eliminarWebQ
            })
        },
        f_eliminarWebQ() {
            let me = this;
            let cantidad = me.eliminaWQ.proyectos_asignaturas.length;
            let conteo = 0;
            //eliminar archivo

            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.eliminaWQ.proyectos_asignaturas[0].idasignatura
            let h_nombreasignatura = me.eliminaWQ.proyectos_asignaturas[0].datos.nombreasignatura
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'eliminar',
                'recurso_tipo':'proyecto',
                'recurso_nombre': me.eliminaWQ.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)

            if (me.eliminaWQ.archivo != null) {
                if (me.eliminaWQ.archivo[0] != undefined) { //eliminar archivo del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.archivo[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de ESTUDIANTE eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de ESTUDIANTE ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
            }
            if (me.eliminaWQ.archivodocente != null) {
                if (me.eliminaWQ.archivodocente[0] != undefined) { //eliminar archivodocente del estudiante
                    axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.eliminaWQ.archivodocente[0].id)
                        .then(function (res) {
                            me.$vs.notify({
                                text: 'Archivo de DOCENTE eliminado',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                        .catch(function (error) {
                            me.$vs.notify({
                                text: 'No se eliminó el archivo de ESTUDIANTE ',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                }
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
            //eliminar proyecto
        },
        verWebQ(item) {
            let me = this;
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = item.proyectos_asignaturas[0].idasignatura
            let h_nombreasignatura = item.proyectos_asignaturas[0].datos.nombreasignatura
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
            this.$router.push('/verProyectosAdmin');
        },
        volver() {
            let me = this;
            this.$router.push('/proyectosAdmin');
        }
    }
}
</script>

<style lang="css">
.descripcion {
    color: rgb(123, 159, 160);
}
</style>
