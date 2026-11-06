<template>
<div class="mt-5">
    <vx-card>
    <!-- <vs-button color="primary" type="border" class="mr-6" style="display: inline-block;" @click="$router.go(-1)"><b>← Volver</b></vs-button> -->
    <h2 style="display: inline-block;">Curso: {{nombreCurso}}</h2><br>
    <small>{{ nombreasignatura }}</small>
    <vs-tabs alignment="fixed">
        <vs-tab label="Mis Archivos">
            <v-contenido></v-contenido>
        </vs-tab>
        <vs-tab label="Tareas">
            <v-tareas></v-tareas>
        </vs-tab>
        <vs-tab label="Calificaciones">
            <v-calificaciones></v-calificaciones>
        </vs-tab>
        <!-- <vs-tab label="Alumnos">
            <v-estudiantes></v-estudiantes>
        </vs-tab> -->
    </vs-tabs>
    </vx-card>
</div>
</template>

<script>
import contenido from './contenido'
import tareas from './tareas/screen.vue'
import estudiantes from './estudiantes'
import calificaciones from './calificaciones'
export default {
    components: {
        'v-contenido': contenido,
        'v-tareas': tareas,
        'v-estudiantes': estudiantes,
        'v-calificaciones': calificaciones,
    },
    data() {
        return {
            isNavOpen: false,
            nombreCurso: '',
            nombreasignatura:'',
        }
    },
    mounted() {
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
        this.nombreCurso = localStorage.nombrelibroSelec
        this.nombreasignatura = localStorage.nombreasignatura
    },
}
</script>
