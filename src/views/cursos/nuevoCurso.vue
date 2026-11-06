<template>
    <div>
        <h4 class="text-center shadow"> {{ libros[0].nombrelibro }} </h4>
        <div class="vx-row m-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Nombre del Curso:</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="curso.nombre" />
            </div>
        </div>
        <div class="vx-row m-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Paralelo</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input v-model="curso.aula" />
            </div>
        </div>
        <div class="vx-row m-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Área</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="curso.seccion" />
            </div>
        </div>
        <!-- Botón de Guardar -->
        <vs-button type="filled" class="btn-guardar w-full" @click="f_guardar_editar()">Guardar</vs-button>
    </div>
</template>

<script>
export default {
    props: {
        libros: {
            type: Array,
            required: false,
        },
        docente: {
            type: Object,
            default: false
        },
        editarCurso: {
            type: Object,
            default: false
        },
    },
    data() {
        return {
            curso: {
                idcurso: "",
                nombre: "",
                seccion: "",
                paralelo: "",
            },
            editando:false,
            txt_mensaje:'',
        };
    },
    mounted() {
        // console.log("Componente NUEVO CURSO", this.libros);
        if (Object.keys(this.editarCurso).length > 0) {
            //si viene la edicion del curso
            this.txt_mensaje = "Curso EDITADO correctamente"
            this.curso = {
                idcurso: this.editarCurso.idcurso,
                nombre: this.editarCurso.nombre,
                seccion: this.editarCurso.seccion,
                aula: this.editarCurso.aula,
            }
        } else {
            if (this.libros.length > 0 && this.libros[0].nombrelibro) {
                this.txt_mensaje = "Curso creado correctamente"
                const nombreLibro = this.libros[0].nombrelibro;

                // Procesar el nombre del libro
                this.curso.seccion = this.defaultNombreCurso(nombreLibro);
            };
        }
    },
    methods: {
        defaultNombreCurso(nombreLibro) {
            // Busca el guion en el nombre del libro
            const indiceGuion = nombreLibro.indexOf("-");

            // Si hay un guion, toma la parte después del guion
            if (indiceGuion !== -1) {
                return nombreLibro.substring(indiceGuion + 1).trim();
            }

            // Si no hay guion, devuelve el nombre completo
            return nombreLibro;
        },
        f_guardar_editar() {
            let me = this;
            // Validar los datos
            if (!me.curso.nombre || !me.curso.aula) {
                me.$f_notificacion('Todos los campos son obligatorios.', 'danger', 'icon-alert-triangle')
                return;
            }

            let formData = new FormData();
            me.$vs.loading();
            formData.append("idcurso", me.curso.idcurso);
            formData.append("idusuario", me.docente.idusuario);
            formData.append("nombre", me.curso.nombre);
            formData.append("seccion", me.curso.seccion);
            formData.append("materia", '---');
            formData.append("aula", me.curso.aula);
            formData.append('id_asignatura', this.libros[0].asignatura_idasignatura)
            // if (me.usuario.id_group == 16) {
            //     formData.append('id_asignatura', localStorage.idasignatura)
            // } else {
            //     formData.append("id_asignatura", me.asignaturaSelected.id);
            // }
            this.$http.post(this.$server_url + 'curso', formData)
                .then(function (response) {
                    if(response.data.status == 0){
                      me.$vs.notify({
                          text: response.data.message,
                          color: 'warning',
                          iconPack: 'feather',
                          icon: 'icon-check'
                      })
                      return
                    }
                    me.$emit('cursoCreadoOk', true)
                    me.$f_notificacion(me.txt_mensaje);
                })

                .catch(function (error) {
                    me.$f_notificacion('Error al crear el curso.', 'dange', 'alert-triangle');
                })
                .finally(function () {
                    me.$vs.loading.close();
                })

        }
    }
};
</script>
