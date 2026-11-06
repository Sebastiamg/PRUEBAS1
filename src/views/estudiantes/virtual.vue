<template>
<div class="mt-5">
    <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button>
    
    <vs-tabs alignment="fixed">
        <vs-tab label="Tareas Pendientes">
            <v-tareasp></v-tareasp>
        </vs-tab>
        <vs-tab label="Tareas Enviadas">
            <v-tarease></v-tarease>
        </vs-tab>
        <!-- <vs-tab label="Usuarios">
            <v-foro></v-foro>
        </vs-tab> -->
    </vs-tabs>
</div>
</template>

<script>
import tareasp from './tareasp'
import tarease from './tarease'
import calificaciones from './calificaciones'
import foro from './foro'
export default {
    components: {
        'v-tareasp': tareasp,
        'v-tarease': tarease,
        'v-calificaciones': calificaciones,
        'v-foro': foro,
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
