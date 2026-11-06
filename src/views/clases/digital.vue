<template>
<div class="mt-5">
    <vs-tabs alignment="fixed">
        <vs-tab label="Tareas">
            <v-tareas></v-tareas>
        </vs-tab>
        <vs-tab label="Alumnos">
            <v-estudiantes></v-estudiantes>
        </vs-tab>
        <vs-tab label="Calificaciones">
            <div>Calificaciones</div>
        </vs-tab>
    </vs-tabs>
</div>
</template>

<script>
import libro from './libro'
import contenido from './contenido'
import tareas from './tareas'
import estudiantes from './estudiantes'
export default {
    components: {
        'v-libro': libro,
        'v-contenido': contenido,
        'v-tareas': tareas,
        'v-estudiantes': estudiantes,
    },
    data() {
        return {
            isNavOpen: false,
        }
    },
    mounted() {
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
    },
}
</script>
