<template>
    <div>
        <div>
            <vs-tabs>
                <vs-tab label="X LIBRO" @click="menu = 0;"></vs-tab>
                <vs-tab label="X LIBRO TODOS" @click="menu = 1;"></vs-tab>
                <vs-tab label="X COMBOS" @click="menu = 2"></vs-tab>
                <vs-tab label="X Asesor" @click="menu = 3;"></vs-tab>
                <vs-tab label="X Institución" @click="menu = 4;"></vs-tab>
                <vs-tab label="X Cliente" @click="menu = 5;"></vs-tab>
                <vs-tab label="X Contrato" @click="menu = 6;"></vs-tab>
            </vs-tabs>
        </div>
        <div v-if="menu == 0">
            <Xlibro v-if="menu == 0" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
        <div v-if="menu == 1">
          <XlibroTodosVue v-if="menu == 1" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
        <div v-if="menu == 2">
          <xcombos v-if="menu == 2" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
        <div v-if="menu == 3">
            <Xasesor v-if="menu == 3" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
        <div v-if="menu == 4">
            <Xinstitucion v-if="menu == 4" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
        <div v-if="menu == 5">
          <xcliente v-if="menu == 5" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
        <div v-if="menu == 6">
          <xcontrato v-if="menu == 6" :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
        </div>
    </div>

</template>
<script>
import {
    mapState
} from "vuex";

import Xlibro from "./xlibro.vue";
import Xasesor from "./xasesor.vue";
import Xinstitucion from "./xinstitucion.vue";
import xcliente from "./xcliente.vue";
import xcontrato from "./xcontrato.vue";
import xcombos from "./xcombos.vue";
const XlibroTodosVue = () => import('./xlibroTodos.vue')

export default {
    data() {
        return {
            menu: 0,
        };
    },
    computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),
    },
    components: {
        Xlibro,
        Xasesor,
        Xinstitucion,
        XlibroTodosVue,
        xcliente,
        xcontrato,
        xcombos,
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0,
        },
        nombrePeriodo: {
            type: String,
            default: '',
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
};
</script>
