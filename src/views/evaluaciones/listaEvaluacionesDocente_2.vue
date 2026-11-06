<template>
    <div>
        <vs-card v-if="modalEvaluacion == false">
          <div>
            <vs-button class="mr-2" @click="fetchLibrosDocente()">Recargar </vs-button>
            <!--boton para reportes-->
            <vs-button color="warning" @click="popupReportes=true;"><i class="fa-solid fa-file-contract"></i> Reportes</vs-button>
          </div>
            <h5 class="m-3"> {{ filteredLibros.length }} libros </h5>

            <div class="search-container mb-4">
                <vs-input v-model="searchQuery" icon="search" placeholder="Filtrar por libro..." class="w-full" />
            </div>

            <div v-for="asignatura in filteredLibros" :key="asignatura.idasignatura" class="asignatura-card">
                <h3>{{ asignatura.nombreasignatura }}</h3>
                <vs-button color="warning" @click="nuevo_editar(asignatura)"
                    @mouseover="showAddCurso = asignatura.idasignatura" @mouseleave="showAddCurso = null"
                    class="btn-with-animated-text"> <span v-if="showAddCurso !== asignatura.idasignatura"
                        class="feather icon-plus"></span>
                    <span v-else>Agregar curso</span> </vs-button>

                <div v-for="curso in asignatura.cursos" :key="curso.idcurso" class="curso-card">
                    <h5><i><u>Curso:</u></i></h5>
                    <vs-button color="warning" type="border" @click="editarCursoExistente(curso, asignatura)"
                        @mouseover="showEditCurso = curso.codigo" @mouseleave="showEditCurso = null"
                        class="btn-with-animated-text">
                        <span v-if="showEditCurso !== curso.codigo" class="feather icon-edit"></span>
                        <span v-else>Editar curso</span>
                    </vs-button>

                    <vs-button v-if="curso.evaluaciones.length == 0" color="danger" type="border"
                        @click="f_dialog_eliminar(curso)" @mouseover="showDeleteCurso = curso.codigo"
                        @mouseleave="showDeleteCurso = null" class="btn-with-animated-text"> <span
                            v-if="showDeleteCurso !== curso.codigo" class="feather icon-trash"></span>
                        <span v-else>Eliminar curso</span> </vs-button>
                    <h5><small>Código:</small> {{ curso.codigo }} </h5>
                    <h5><small>Nombre:</small> {{ curso.nombre }}</h5>
                    <h5><small>Paralelo:</small> {{ curso.aula }}</h5>

                    <h5 class="pt-4"><i><u>Evaluaciones:</u></i></h5>

                    <vs-button color="warning" type="filled" @click="f_NuevaEvaluacionAdmin(asignatura, curso)"
                        @mouseover="showAddEvaluacion = curso.idcurso" @mouseleave="showAddEvaluacion = null"
                        class="btn-with-animated-text">
                        <span v-if="showAddEvaluacion !== curso.idcurso" class="feather icon-plus"></span>
                        <span v-else>Agregar evaluación</span>
                    </vs-button>

                    <div v-if="curso.evaluaciones.length > 0">
                        <div v-for="evaluacion in curso.evaluaciones" :key="evaluacion.id" class="evaluacion-card"
                        :class="{'highlight-yellow': evaluacionActualizada === evaluacion.id}">
                            <!-- {{ evaluacion }} -->
                            <h5 class="m-2">{{ evaluacion.descripcion }}</h5>
                            <h6 v-if="mostrar_codigo_evaluacion" class="m-2 text-success">Código evaluación: {{
                                evaluacion.codigo_evaluacion }}</h6>
                            <p class="m-2"><strong>Puntos:</strong> {{ evaluacion.puntos }} | <strong>Duración:</strong>
                                {{
                                    evaluacion.duracion
                                }} minutos</p>
                            <p class="m-2">
                                <vs-icon @click="f_edit_fecha_evaluacion(evaluacion)" class="mr-2 mouse-hand"
                                    icon-pack="feather" size="small" icon="icon-calendar"></vs-icon>
                                <b>F. inicio: </b> {{ evaluacion.fecha_inicio }} | <b>F. fin: </b> {{
                                    evaluacion.fecha_fin }}
                            </p>
                            <vs-button color="warning" type="filled"
                                @click="f_EditaEvaluacionAdmin(evaluacion, asignatura)"
                                @mouseover="showEditEvaluacion = evaluacion.id" @mouseleave="showEditEvaluacion = null"
                                class="btn-with-animated-text"> <span v-if="showEditEvaluacion !== evaluacion.id"
                                    class="feather icon-edit"></span>
                                <span v-else>Editar evaluación</span> </vs-button>
                        </div>
                    </div>
                    <div v-else class="no-evaluaciones m-2">
                        No hay evaluaciones programadas
                    </div>
                </div>
            </div>
        </vs-card>
        <div v-if="filteredLibros.length === 0 && librosDocente.length > 0" class="no-results">
            No se encontraron libros que coincidan con "{{ searchQuery }}"
        </div>

        <!-- Componente de edición de evaluación -->
        <div v-if="modalEvaluacion">
            <vs-button @click="f_regresar_administrador()">Regresar administrador</vs-button>
            <EvaluacionComponentVue :nuevaEvaluacionAdmin="nuevaEvaluacionAdmin" :evaluacionAdmin="evaluacionAdmin" />
            <!-- <EvaluacionComponentVue  @closeEvaluacion="cerrarEvaluacion" /> -->
        </div>
        <!-- <vs-popup fullscreen :title="titulo_modal_curso" :active.sync="modalEvaluacion" v-if="modalEvaluacion">
            <EvaluacionComponentVue :evaluacionAdmin="evaluacionAdmin" @closeEvaluacion="cerrarEvaluacion" />
        </vs-popup> -->

        <vs-popup :title="titulo_modal_curso" :active.sync="modalNuevoCurso" v-if="modalNuevoCurso">
            <NuevoCursoVue :libros="libros" :docente="datoDocenteEvaluacion" @cursoCreadoOk="f_cursoCreadoOk"
                :editarCurso="editarCurso" />
        </vs-popup>
        <vs-popup title="Editar fecha evaluación" :active.sync="modalEditFecha" v-if="modalEditFecha">
            <h4 class="m-3">
                {{ datosEditaFechaEvaluacion.descripcion }}
            </h4>
            <vs-input type="datetime-local" label="Fecha de inicio" v-model="datosEditaFechaEvaluacion.fecha_inicio"
                class="w-full mb-4"></vs-input>

            <vs-input type="datetime-local" label="Fecha de fin" v-model="datosEditaFechaEvaluacion.fecha_fin"
                class="w-full mb-4"></vs-input>
            <vs-button @click="guardarFechasEvaluacion(datosEditaFechaEvaluacion)" class="mt-4">
                Guardar cambios
            </vs-button>
        </vs-popup>
        <vs-popup title="Reportes" fullscreen :active.sync="popupReportes">
          <div v-if="popupReportes">
              <EvaluacionesReportesVue :docente="docente" />
          </div>
        </vs-popup>
    </div>
</template>

<script>
const EvaluacionComponentVue = () => import('@/views/evaluaciones/EvaluacionesComponent.vue')
const NuevoCursoVue = () => import("@/views/cursos/nuevoCurso.vue");
const EvaluacionesReportesVue = () => import('./reportes/EvaluacionesReportes.vue');

export default {
    components: {
        EvaluacionComponentVue,
        NuevoCursoVue,
        EvaluacionesReportesVue,
    },
    data() {
        return {
            searchQuery: '',
            librosDocente: [],
            libros: [],
            docente: {},
            evaluacionAdmin: null,
            modalEvaluacion: false,
            loading: false,
            error: null,
            datoDocenteEvaluacion: {},
            modalActivo: false, // Controla la visibilidad del modal
            titulo_modal_curso: '',
            modalNuevoCurso: false,
            usuario: '',
            editarCurso: {},
            eliminaCurso: {},
            showAddCurso: null,
            showDeleteCurso: null,
            showAddEvaluacion: null,
            showEditEvaluacion: null,
            nuevaEvaluacionAdmin: null,
            mostrar_codigo_evaluacion: null,
            showEditCurso: null,
            modalEditFecha: false,
            datosEditaFechaEvaluacion: {},
            evaluacionActualizada: null,
            timeoutEvaluacion: null,
            popupReportes: false,
        };
    },
    computed: {
        filteredLibros() {
            if (!this.searchQuery) {
                return this.librosDocente
            }
            const query = this.searchQuery.toLowerCase()
            return this.librosDocente.filter(asignatura =>
                asignatura.nombreasignatura.toLowerCase().includes(query)
            )
        }
    },
    mounted() {
        this.datoDocenteEvaluacion = JSON.parse(localStorage.getItem("datoDocenteEvaluacion")) || {};
        // console.log('datoDocenteEvaluacion', this.datoDocenteEvaluacion)
        this.docente = this.datoDocenteEvaluacion;
        localStorage.usuarioDocente = JSON.stringify(this.docente)
        this.fetchLibrosDocente();
    },
    methods: {
        nuevo_editar(asignatura) {
            let me = this;
            localStorage.idcurso = '';
            // console.log(asignatura)
            me.editarCurso = {};
            me.titulo_modal_curso = "Agregar curso";
            me.libros = [];
            me.libros.push({
                asignatura_idasignatura: asignatura.idasignatura,
                nombrelibro: asignatura.nombreasignatura
            })
            me.modalNuevoCurso = true;
        },
        f_dialog_eliminar(curso) {
            let me = this;
            me.eliminaCurso = curso;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmacion`,
                text: 'Desea eliminar el curso?.',
                accept: this.restaurarCurso
            })
        },
        restaurarCurso() {
            let me = this;
            let formD = new FormData();
            formD.append('id', me.eliminaCurso.idcurso);
            formD.append('estado', 0);
            me.$vs.loading();
            this.$http.post(this.$server_url + `restaurarCurso/+${me.eliminaCurso.idcurso}`, formD)
                .then(res => {
                    me.$f_notificacion('Curso eliminado');
                    me.fetchLibrosDocente();
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => {
                    me.$vs.loading.close()
                })
        },
        async fetchLibrosDocente() {
            let me = this;
            me.loading = true;
            me.error = null;
            me.$vs.loading()
            me.$http.post(this.$server_url + 'getEvaluacionesAdminPeriodo', {
                institucion_idInstitucion: this.datoDocenteEvaluacion.institucion_idInstitucion,
                idusuario: this.datoDocenteEvaluacion.idusuario,
            })
                .then(res => {
                    // me.evaluacionesDocente = res.data;
                    me.librosDocente = res.data.data;
                    me.mostrar_codigo_evaluacion = res.data.mostrar_codigo_evaluacion;
                    // console.log('evaluaciones', me.evaluacionesDocente)
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(() => {
                    me.$vs.loading.close()
                });
        },
        f_cursoCreadoOk(e) {
            // console.log(e)
            if (e) {
                this.modalNuevoCurso = false;
                this.fetchLibrosDocente();
            }
        },
        f_EditaEvaluacionAdmin(evaluacion = null, asignatura) {
            let me = this;
            me.evaluacionAdmin = {
                id: evaluacion.id, //id de la evaluacion
                id_asignatura: asignatura.idasignatura,
                nombreasignatura: asignatura.nombreasignatura,
                codigo_curso: evaluacion.codigo_curso,
                id_docente: this.datoDocenteEvaluacion.idusuario,
                institucion_idInstitucion: this.datoDocenteEvaluacion.institucion_idInstitucion,
            };
            localStorage.idasignatura = asignatura.idasignatura
            me.modalEvaluacion = true;
        },
        f_NuevaEvaluacionAdmin(asignatura, curso) {
            // console.log(asignatura, curso);
            this.modalEvaluacion = true;
            this.nuevaEvaluacionAdmin = {
                id_docente: this.datoDocenteEvaluacion.idusuario,
                institucion_idInstitucion: this.datoDocenteEvaluacion.institucion_idInstitucion,
                codigo_curso: curso.codigo,
                id_asignatura: asignatura.idasignatura,
                nombreasignatura: asignatura.nombreasignatura,
            }
            localStorage.idasignatura = asignatura.idasignatura
        },
        f_regresar_administrador() {
            this.modalEvaluacion = false;
            this.fetchLibrosDocente();
        },
        editarCursoExistente(curso, asignatura) {
            let me = this;
            // console.log(curso,asignatura)
            me.editarCurso = curso;
            me.titulo_modal_curso = "Editar curso";
            me.libros = [];
            me.libros.push({
                asignatura_idasignatura: asignatura.idasignatura,
                nombrelibro: asignatura.nombreasignatura
            })
            localStorage.idasignatura = asignatura.idasignatura
            me.modalNuevoCurso = true;
        },
        f_edit_fecha_evaluacion(evaluacion) {
            // console.log(evaluacion)
            this.modalEditFecha = true;
            this.datosEditaFechaEvaluacion = {
                id: evaluacion.id,
                descripcion:evaluacion.descripcion,
                fecha_inicio: evaluacion.fecha_inicio.replace(" ", "T").substring(0, 16),
                fecha_fin: evaluacion.fecha_fin.replace(" ", "T").substring(0, 16),
            };
        },
        guardarFechasEvaluacion(datos) {
            let me = this;
            // console.log("Fechas guardadas:", datos);
            this.modalEditFecha = false;
            me.$vs.loading();
            const datosParaGuardar = {
                id: datos.id,
                fecha_inicio: datos.fecha_inicio.replace("T", " ") + ":00",
                fecha_fin: datos.fecha_fin.replace("T", " ") + ":00"
            };
            me.$http.post(this.$server_url + 'edit_fecha_evaluacion_admin', datosParaGuardar)
                .then(res => {
                    // console.log('evaluaciones fecha', res.data)

                    let encontrado = false;

                    // 1. Recorremos cada asignatura (aunque en tu JSON parece haber solo una)
                    me.librosDocente.forEach(asignatura => {
                        // 2. Recorremos cada curso dentro de la asignatura
                        asignatura.cursos.forEach(curso => {
                            // 3. Buscamos la evaluación específica
                            const evaluacionIndex = curso.evaluaciones.findIndex(
                                e => e.id === res.data.id
                            );

                            // 4. Si encontramos la evaluación, la actualizamos
                            if (evaluacionIndex !== -1) {
                                me.$set(
                                    curso.evaluaciones,
                                    evaluacionIndex,
                                    {
                                        ...curso.evaluaciones[evaluacionIndex],
                                        fecha_inicio: res.data.fecha_inicio,
                                        fecha_fin: res.data.fecha_fin
                                    }
                                );
                                encontrado = true;
                            }
                        });
                    });
                    me.evaluacionActualizada = res.data.id; // Establecer ID de evaluación actualizada

            // Restablecer después de 3 segundos
            me.timeoutEvaluacion = setTimeout(() => {
                me.evaluacionActualizada = null;
            }, 3000);

                    if (!encontrado) {
                        console.warn("No se encontró la evaluación para actualizar");
                    }
                    me.$f_notificacion('evaluación ' + res.data.descripcion + ' actualizada ');

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

<style scoped>
.docente-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.asignatura-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    background-color: #f9f9f9;
}

.curso-card {
    border-left: 4px solid #4CAF50;
    padding: 15px;
    margin: 15px 0;
    background-color: white;
    border-radius: 4px;
}

.evaluacion-card {
    padding: 10px;
    margin: 10px 0;
    background-color: #f0f0f0;
    border-radius: 4px;
    transition: background-color 0.3s ease;

}

.loading,
.error,
.no-data {
    padding: 20px;
    text-align: center;
    font-size: 1.1em;
}

.error {
    color: #d32f2f;
}

.no-evaluaciones {
    font-style: italic;
    color: #666;
}

.mouse-hand {
    cursor: pointer;
}

.mouse-hand:hover {
    color: chocolate
}
.highlight-yellow {
    background-color: #b7f595 !important; /* Amarillo claro */
    box-shadow: 0 0 10px rgba(63, 247, 109, 0.5);
    transition: background-color 0.3s ease-in-out;
}
</style>
