<template>
<div>
     <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="regresar">Regresar</vs-button> 
    <informacion :usuario="usuario"></informacion>
</div>
</template>

<script>
import informacion from "./informacion.vue";
import asignaturas from "./asignaturas.vue";
export default {
    props: {
        usuario: Object
    },
    components: {
        informacion,
        asignaturas,
    },
    data() {
        return {
        };
    },
    mounted() {
        
    },
    methods: {
        regresar() {
            this.$emit("estado", {
                plista: true,
                pnuevo: false,
                peditar: false,
            });
        },
    },
};
</script>
