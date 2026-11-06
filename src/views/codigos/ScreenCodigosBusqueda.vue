<template>
    <div>
        <div>
            <vs-tabs class="mt-4">
                <vs-tab label="Buscar" icon-pack="feather" icon="icon-search" @click="menu = 0">
                    <vs-divider></vs-divider>
                    
                </vs-tab>
                <vs-tab label="Filtrar códigos" v-if="userRoot" icon-pack="feather" icon="icon-code" @click="menu = 1">
                    <vs-divider></vs-divider>
                </vs-tab>
                <vs-tab label="Gestión códigos" v-if="userRoot" icon-pack="feather" icon="icon-box" @click="menu = 2">
                    <vs-divider></vs-divider>
                </vs-tab>
                <vs-tab label="Listado códigos bloqueados" v-if="userRoot" icon-pack="feather" icon="icon-box" @click="menu = 3">
                    <vs-divider></vs-divider>
                </vs-tab>
                <vs-tab label="Codigos en Histórico" v-if="userRoot" icon="code" @click="menu = 4">
                    <vs-divider></vs-divider>
                </vs-tab>
            </vs-tabs>
            <!--components-->
            <div v-if="menu == 0">
                <seccionBuscarVue />
            </div>
            <div v-if="menu == 1">
                <BusquedaCodigosLiquidadoRegalados />
                <!-- <FacturadoresCodigosVue /> -->
            </div>
            <div v-if="menu == 2">
                <gestionCodigosVue />
            </div>
            <div v-if="menu == 3">
                <bloqueoCodigosVue />
            </div>
            <div v-if="menu == 4">
                <BuscarEnHistorico />
            </div>
        </div>
    </div>
</template>
<script>
import {
    mapState
} from "vuex";
    const seccionBuscarVue                  = () => import('./components/seccionBuscar.vue')
    const BusquedaCodigosLiquidadoRegalados = () => import('./components/Busqueda/BusquedaCodigosLiquidadoRegalados.vue')
    // const FacturadoresCodigosVue            = () => import('./FacturadoresCodigos.vue')
    const gestionCodigosVue                 = () => import('./components/gestionCodigos.vue')
    const bloqueoCodigosVue                 = () => import('./components/codigosBloqueados.vue')
    const BuscarEnHistorico                 = () => import('./buscar_en_historico.vue')

export default {
    components: {
        seccionBuscarVue,
        BusquedaCodigosLiquidadoRegalados,
        // FacturadoresCodigosVue,
        gestionCodigosVue,
        bloqueoCodigosVue,
        BuscarEnHistorico,
    },
    data() {
        return {
            menu: 0,
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    methods: {
        limpiarCache() {
            this.$store.dispatch('limpiarCache');
        },
    },
}
</script>