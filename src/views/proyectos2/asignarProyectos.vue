<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp;

    <vx-card class="mb-base">

        <div class="">
            <vs-tabs alignment="fixed">
                <vs-tab :label="'Proyectos asignados ( '+ proyectos_asignados.length + ' )' ">
                    <div v-if="proyectos_asignados.length >0">
                        <p class="m-3">
                            <!-- {{proyecto.id}} -->
                            El proyecto <b><i><u> {{proyecto.nombre}}</u></i></b> está sido asignado a los siguientes cursos
                        </p>
                        <vs-table max-items="10" search pagination :data="proyectos_asignados" style="margin-top:-20px">
                            <template slot="thead">
                                <vs-th>Curso</vs-th>
                                <vs-th>Asignatura</vs-th>
                                <vs-th>Paralelo</vs-th>
                                <vs-th>Código</vs-th>
                                <vs-th>Fecha</vs-th>
                                <vs-th>Resueltos</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{data[indextr].datos.nombre_curso}}
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].datos.seccion}}
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].datos.aula}}
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].curso}}
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].updatedAt | fecha }}
                                    </vs-td>
                                    <vs-td>
                                        {{}}
                                    </vs-td>
                                    <vs-td>
                                        <vx-tooltip style="display: inline-block;" text="Ver respuestas" position="top" color="success">
                                            <vs-button class="m-1" color="success" type="gradient" icon-pack="feather" icon="icon-eye" @click="verRespuestas(tr)"></vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip style="display: inline-block;" text="Eliminar asignación" position="top" color="danger">
                                            <vs-button class="m-1" color="danger" type="gradient" icon-pack="feather" icon="icon-trash" @click="openConfirmEliminar(tr)"></vs-button>
                                        </vx-tooltip>
                                    </vs-td>

                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <p class="m-3"> El proyecto <b><i><u> {{proyecto.nombre}}</u></i></b> aún no ha sido asignado a ningún curso</p>
                    </div>

                </vs-tab>
                <vs-tab label="Asignar proyecto a mis cursos">
                    <div class="mb-base">
                        <small>Nombre del proyecto:</small>
                        <p class="w:full m-3">
                            <b><i><u> {{proyecto.nombre}}</u></i></b>
                        </p>
                        <p class="w:full">
                            <small>Descripción: <b>{{proyecto.descripcion}}</b> </small>
                        </p>
                    </div>
                    <div v-if="cursos_docente.length > 0">
                        <!-- <p class="mb-base">  </p> -->
                        <vs-divider>¿A qué curso desea asignar este proyecto?</vs-divider>
                        <div class="card-row">
                            <div class="card hover-shadow  m-2 p-3" v-for="(item, index) in cursos_docente" :key="index">
                                <div color="primary" @click="confirmaAsignar(item)">
                                    <p>Curso <b>{{item.nombre}}</b> </p>
                                    <p>Asignatura <b>{{item.seccion}}</b> </p>
                                    <p>Paralelo: <b>{{item.aula}}</b> </p>
                                    <p>Codigo: <b>{{item.codigo}}</b> </p>
                                </div>
                            </div>
                        </div>
                        <p class="mt-6">
                        </p>
                    </div>
                    <div v-else>
                        <p class="mb-base"> No tiene cursos creados. <br>
                            <vs-button class="m-1" color="dark" type="relief" to="/docente/curso/nuevo" @click="nuevo()">Agregar Curso</vs-button>
                        </p>
                    </div>
                </vs-tab>

            </vs-tabs>
        </div>
    </vx-card>
</div>
</template>

<script>
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
    data() {
        return {
            usuario: '',
            grupo_usuario: '',
            idasignatura: '',
            proyecto: '',
            cursos_docente: [],
            proyectos_asignados: [],
            respuestas_pry: [],
            id_eliminar: '',
            tmp_asignar: '',
            datos: {},
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.proyecto = JSON.parse(localStorage.getItem('proyecto'))
        console.log(me.proyecto)
        me.grupo_usuario = me.usuario.id_group
        me.idasignatura = localStorage.getItem('idasignatura');
        me.getCursosDocenteAsignatura();
        me.proyectosAsignados();
    },
    methods: {
        getCursosDocenteAsignatura() {
            let me = this;
            me.$vs.loading()
            let formData = new FormData();
            formData.append('idasignatura', me.idasignatura);
            formData.append('idusuario', me.usuario.idusuario);
            this.$http.post(this.$server_url+'cursos_asignatura_docente/', formData)
                .then(function (response) {
                    me.cursos_docente = response.data
                    me.$vs.loading.close()
                    // console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error + ' buscar cursos del docente')
                    me.$vs.loading.close()
                })
        },
        proyectosAsignados() {
            let me = this;
            // console.log(me.idasignatura, me.usuario.idusuario)
            me.$vs.loading()
            axios.get('https://foro.prolipadigital.com.ec/cursos-proyectos?idproyecto=' + me.proyecto.id)
                .then(function (response) {
                    me.proyectos_asignados = response.data
                    me.$vs.loading.close()
                    // console.log(me.proyectos_asignados);
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
        },
        respuestasProyectos() {
            let me = this;
        },
        verRespuestas(item) {
            let me = this;
            me.$vs.loading()
            // console.log(item.curso, item.idproyecto)
            axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + me.proyecto.id + '&curso=' + item.curso)
                .then(function (response) {
                    me.respuestas_pry = response.data
                    console.log(me.respuestas_pry);
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
        },
        nuevo() {
            localStorage.idcurso = '';
        },
        confirmaAsignar(item) {
            let me = this;
            me.tmp_asignar = item
            // comprobar si ya esta asignado a un curso
            for (let index = 0; index < me.proyectos_asignados.length; index++) {
                // console.log(me.proyectos_asignados[index].curso)
                if (me.tmp_asignar.codigo == me.proyectos_asignados[index].curso) {
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
                color: 'primary',
                title: `Asignar este proyecto al curso`,
                text: me.tmp_asignar.nombre + ' ->  ' + me.tmp_asignar.seccion + ' ->  ' + me.tmp_asignar.aula,
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.asignarProyectoSeleccionado
            })
        },
        asignarProyectoSeleccionado() {
            let me = this;
            // console.log(me.tmp_asignar)
            me.datos.aula = me.tmp_asignar.aula
            me.datos.asignatura = me.tmp_asignar.nombreasignatura
            me.datos.seccion = me.tmp_asignar.seccion
            me.datos.nombre_curso = me.tmp_asignar.nombre
            axios.post('https://foro.prolipadigital.com.ec/cursos-proyectos', {
                    curso: me.tmp_asignar.codigo,
                    datos: me.datos,
                    idasignatura: me.tmp_asignar.idasignatura,
                    idusuario: me.tmp_asignar.idusuario,
                    idcurso: me.tmp_asignar.idcurso,
                    proyectos: [me.proyecto],
                    idproyecto: me.proyecto.id,
                    estado: true,
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
        openConfirmEliminar(item) {
            let me = this;
            me.id_eliminar = item
            // console.log(item)
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar esta asignación?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarAsignacion
            })
        },
        eliminarAsignacion() {
            let me = this;
            //eliminar proyecto
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

        },
        volver() {
            let me = this;
            me.$router.go(-1)
        },
    }
}
</script>

<style lang="css">
.card-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    grid-gap: 20px;
}

.card {
    display: grid;
    background-color: rgba(226, 226, 223, 0.5);
    grid-template-rows: max-content 200px 1fr;
    display: inline;
    padding: 20px;
    border: 1px solid #c9c9c9;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.card:hover {
    box-shadow: 0 4px 8px 0 rgba(253, 250, 203, 0.5), 0 6px 20px 0;
    cursor: pointer;
}
</style>
