<template>
    <div>
        <vs-list>
            <div style="display:flex;">
                <vs-input placeholder="Codido del Curso" class="mr-2" v-model="codigoCurso" />
                <vs-button type="relief" color="success" @click="btn_asociarEstudiante()"> Asignar Curso</vs-button>
            </div>
            <br>
            <vs-chip color="primary">
                Cantidad de Cursos {{ long_cursos}}
            </vs-chip>
            <br><br>
            <!-- <vs-list-header color="success" title="Codigos de cursos"></vs-list-header> -->
            <!-- <vs-list-item :key="index" v-for="(item, index) in cantidad_cursos" :title="item.codigo"></vs-list-item> -->
        </vs-list>
        <div>
            <vs-card v-for="(docente, index) in cantidad_cursos.data_cursos" :key="index">
                <vs-list-item class="" :title="`${docente.docente_nombres} ${docente.docente_apellidos}`">
                    <template #subtitle>
                        <p>Usuario: {{ docente.docente_name_usuario }}</p>
                        <p>Cédula: {{ docente.docente_cedula }}</p>
                    </template>
                </vs-list-item>
                
                <!-- Lista de cursos -->
                <vs-list>
                    <vs-list-item title="Cursos"></vs-list-item>
                    <vs-list-item v-for="(curso, cIndex) in docente.cursos" :key="cIndex" :title="curso.codigo" :subtitle="curso.nombreasignatura">
                        <p>{{ curso.periodoescolar }}</p>
                        <p><small>asignado</small>: {{ curso.fecha_asignacion || fechaLarga }}</p>
                        <vs-button color="danger" type="border" radius icon-pack="feather" icon="icon-trash"></vs-button>
                    </vs-list-item>
                </vs-list>
            </vs-card>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default {
    data() {
        return {
            codigoCurso: '',
            cantidad_cursos: [],
            long_cursos:0,
        }
    },
    props:{
        datoEstudiante: {
            type: Object
        },
    },
    mounted() {
        let me = this;
        // console.log('datoEstudiante',me.datoEstudiante)
        me.verCursos(me.datoEstudiante.idusuario)
    },
    methods: {
        btn_asociarEstudiante() {
            let me = this;
            let formData = new FormData();
            formData.append('codigo', me.codigoCurso);
            formData.append('idusuario', me.usuarioEstudiante);
            // console.log(me.codigoSelect,e.idusuario )

            me.$vs.loading()
            this.$http.post(this.$server_url + 'addClase', formData)
                .then(function (res) {
                    // console.log(res.data.message)
                    if (res.data.status == 0) {
                        me.f_notificaciones(res.data.message, 'danger', 'alert-triangle');
                    } else {
                        me.f_notificaciones(res.data.message, 'success', 'check');
                        // me.popupCursosEstudiantes = false;
                        me.verCursos(me.usuarioEstudiante)
                    }
                })
                .catch(function (error) {
                    // console.log(error)
                    me.f_notificaciones(res.data.message, 'danger', 'alert-triangle');
                })
                .finally(() => {
                    me.$vs.loading.close()
                })
        },
        //para ver los cursos de los estudiantes
        verCursos(idusuario) {
            let me = this;
            me.$vs.loading();
            let busquedaCurso = "yes"
            me.usuarioEstudiante = '';
            this.$http.get(this.$server_url + 'busquedaFiltroEstudiante?busquedaCurso=' + busquedaCurso + '&idusuario=' + idusuario)
                .then(function (res) {
                    console.log(res.data);
                    me.cantidad_cursos = res.data;
                    me.long_cursos = me.cantidad_cursos.data_cursos.length;
                    // me.cursosCodigos = res.data.codigos;
                    me.codigoCurso = ''
                    me.usuarioEstudiante = idusuario;
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
                .finally(() => {
                    me.$vs.loading.close()
                })
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        },
    }
}
</script>
