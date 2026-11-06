<!-- lista de evaluaciones del docente, del periodo escolar activo, para manejo desde la administracion -->
<template>
    <div>
        <div v-if="lista">
            <div>
                <vs-list>
                    <vs-list-item :title="`${datoDocenteEvaluacion.nombres} ${datoDocenteEvaluacion.apellidos}`" subtitle="Docente"></vs-list-item>
                    <vs-list-item :title="`${datoDocenteEvaluacion.name_usuario}`" :subtitle="`${datoDocenteEvaluacion.cedula}`"></vs-list-item>
                    <!-- <vs-list-item :title="`${datoDocenteEvaluacion.cedula}`" subtitle="Cedula"></vs-list-item> -->
                </vs-list>
            </div>
            <vs-table max-items="10" pagination search :data="evaluacionesDocente" no-data-text="No existen evaluacion registradas.">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ evaluacionesDocente.length }}</b></vs-chip>
                </template>
                <!-- {{cliCi}} -->
                <template slot="thead">
                    <vs-th width="50%"> Evaluacion </vs-th>
                    <vs-th width="30%"> Detalles </vs-th>
                    <vs-th width="20%"> </vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :key="indextr" v-for="(evaluacion, indextr) in data">
                        <vs-td>{{ evaluacion.id }}
                            <p>Curso:
                                <b>{{ evaluacion.codigo_curso }}</b>
                            </p>
                            <p>
                                <b>Asignatura:</b> {{ evaluacion.nombreasignatura }}
                            </p>
                            <p>
                                <b>Puntos:</b> {{ evaluacion.puntos }} -
                                <b>Duración:</b> {{ evaluacion.duracion }} mins.
                            </p>
                            <p>
                                <b>Descripción:</b> {{ evaluacion.descripcion }}
                            </p>
                            <p :class="evaluacion.ver_calificaciones === 0 ? 'text-danger' : 'text-success'">
                                <b>Respuestas:</b><br> {{ evaluacion.ver_calificaciones === 0 ? "Estudiantes no pueden ver las respuestas" : "Estudiantes visualiza la calificacion al finalizar la evaluación"
                                }}
                            </p>
                            <p>
                                <b>Código de evaluación:</b> <br>
                                <span v-if="evaluacion.codigo_evaluacion">
                                    {{ evaluacion.codigo_evaluacion }}
                                </span>
                                <span v-else class="text-danger">
                                    código no configurado
                                </span>
                            </p>
                            <p>
                                <b>Periodo:</b> {{ evaluacion.nombre_periodo }}
                            </p>
                        </vs-td>
                        <vs-td>

                            <b>Inicio:</b> {{ evaluacion.fecha_inicio }}<br>
                            <b>Fin:</b> {{ evaluacion.fecha_fin }}<br>
                            <vs-chip :color="evaluacion.estado === 1 ? 'success' : 'danger'">
                                {{ evaluacion.estado === 1 ? 'Activo' : 'Inactivo' }}
                            </vs-chip>
                        </vs-td>
                        <vs-td>
                            <vs-button size="large" radius icon-pack="feather" icon="icon-edit"
                                @click="f_edita_evaluacion(evaluacion);" color="success" type="line"></vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else>
            <vs-button @click="lista = true; getEvaluacionesDocente(datoDocenteEvaluacion)">Regresar ADMINISTRADOR</vs-button>
            <EvaluacionComponentVue :evaluacionAdmin="evaluacionAdmin" />
        </div>
    </div>
</template>

<script>
const EvaluacionComponentVue = () => import('@/views/evaluaciones/EvaluacionesComponent.vue')
export default {

    components: {
        EvaluacionComponentVue
    },
    data() {
        return {
            evaluacionesDocente: [],
            lista: true,
            evaluacionAdmin: {},
            datoDocenteEvaluacion:{},
        };
    },
    mounted() {
        let me = this;
        me.datoDocenteEvaluacion = JSON.parse(localStorage.getItem("datoDocenteEvaluacion")) || {}
        me.getEvaluacionesDocente(me.datoDocenteEvaluacion);
    },
    methods: {
        f_edita_evaluacion(item) {
            let me = this;
            me.lista = false;
            me.evaluacionAdmin = item;
        },
        getEvaluacionesDocente(docente) {
            let me = this;
            me.$vs.loading()
            me.$http.post(this.$server_url + 'getEvaluacionesAdminPeriodo', docente)
                .then(res => {
                    me.evaluacionesDocente = res.data;
                    // console.log('evaluaciones', me.evaluacionesDocente)
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => {
                    me.$vs.loading.close()
                });
        },
    },
};
</script>
