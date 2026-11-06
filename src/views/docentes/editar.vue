<template>
<div>
    <vs-tabs alignment="fixed">
        <vs-tab label="Información">
            <informacion :id="idusuario"></informacion>
        </vs-tab>
        <vs-tab label="Asignaturas">
            <asignaturas :id="idusuario"></asignaturas>
        </vs-tab>
    </vs-tabs>
</div>
</template>

<script>
import informacion from './informacion.vue'
import asignaturas from './asignaturas.vue'
export default {
    components: {
        informacion,
        asignaturas
    },
    data() {
        return {
            idusuario: ''
        }
    },
    mounted() {
        this.idusuario = this.$route.params.id;
    },
}
</script>
