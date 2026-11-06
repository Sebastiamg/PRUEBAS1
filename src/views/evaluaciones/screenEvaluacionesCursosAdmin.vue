<template>
    <vx-card>
        <vs-tabs>
            <vs-tab label="Evaluaciones Admin">
                <listaEvaluacionesDocente_2 />
            </vs-tab>
            
        </vs-tabs>
    </vx-card>
</template>

<script>
const listaEvaluacionesDocente_2 = () => import('./listaEvaluacionesDocente_2.vue');

export default {
    components: {
        listaEvaluacionesDocente_2
    },
    data() {
        return {
        };
    },
    mounted() {
        // console.log("Componente montado");
    },
    methods: {
    }
};
</script>
