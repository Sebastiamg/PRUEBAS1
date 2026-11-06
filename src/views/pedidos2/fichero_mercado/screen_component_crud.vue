<template>
<div>
    <vx-card>
        <vs-tabs v-model="activeTab">
            <vs-tab label="Editoriales" v-if="userRoot">
                <editoriales />
            </vs-tab>
            <vs-tab label="Cargos Autoridades" v-if="userRoot">
                <autoridades_institucion />
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>


<script>
// import { act } from "react";
import {
    mapState
} from "vuex";
const editoriales = () => import("@/views/pedidos2/fichero_mercado/component_crud/editoriales/lista_editoriales.vue");
const autoridades_institucion = () => import("@/views/pedidos2/fichero_mercado/component_crud/autoridades_institucion/lista_autoridades_institucion.vue");

export default {
    data() {
        return {
            activeTab: 0
        };
    },
    mounted() {},
    methods: {
    },
    //PARA DAR PERMISOS MODIFICAMOS EL Main.vue, state.js, actions.js, mutations-js
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    components: {
        editoriales,
        autoridades_institucion,
    },
};
</script>
