<template>
<div>
    <vs-tabs alignment="fixed">
        <vs-tab label="Generar códigos" v-if="userRoot" @click="menu = 0">
            <vs-tabs class="mt-4" v-if="menu == 0">
                <vs-tab label="Elegir libro" icon-pack="feather" icon="icon-book">
                    <vs-divider></vs-divider>
                    <GenerarCodigosVue />
                </vs-tab>
                <vs-tab label="Generar códigos" icon-pack="feather" icon="icon-code">
                    <vs-divider></vs-divider>
                    <GenerateCodigosVue />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Búsqueda" @click="menu = 1">
            <div v-if="menu == 1">
                <ScreenCodigosBusqueda/>
            </div>
        </vs-tab>
        <vs-tab label="Importaciones" @click="menu = 2">
            <MenuImportacionesVue  v-if="menu == 2" class="mt-3" />
        </vs-tab>
        <vs-tab label="Paquetes" v-if="userRoot" @click="menu = 3">
            <MenuPaquetesVue  v-if="menu == 3" />
        </vs-tab>
        <vs-tab label="Combos" v-if="userRoot" @click="menu = 7">
            <MenuCombosVue  v-if="menu == 7" />
        </vs-tab>
        <vs-tab label="Asignaciones" v-if="userRoot" @click="menu = 4">
            <ScreenCombosVue  v-if="menu == 4" />
        </vs-tab>
        <vs-tab label="Grafitex" v-if="userRoot" @click="menu = 5">
            <MenuGrafitexVue  v-if="menu == 5" />
        </vs-tab>
        <vs-tab label="Temporadas-contratos" v-if="userRoot" @click="menu = 6">
            <vs-tabs class="mt-4" v-if="menu == 5">
                <vs-tab label="Temporadas" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <temporadasVue />
                </vs-tab>
                <vs-tab label="Historial liquidación códigos" icon-pack="feather" icon="icon-code">
                    <vs-divider></vs-divider>
                    <vs-tabs alignment="center">
                        <vs-tab label="Verificación Nueva" icon="account_balance">
                            <div>
                                <historicoCodigosNuevoVue />
                            </div>
                        </vs-tab>
                        <vs-tab label="Pedidos" icon="bookmark">
                            <div>
                                <pedidosBusquedaVue />
                            </div>
                        </vs-tab>
                    </vs-tabs>
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Verificaciones" v-if="userRoot" @click="menu = 6">
            <vs-tabs class="mt-4" v-if="menu == 6">
                <vs-tab label="Buscar Verificaciones" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <BusquedaVerificacionVue />
                </vs-tab>
                <vs-tab label="Historico Verificaciones" icon-pack="feather" icon="icon-search">
                    <vs-divider></vs-divider>
                    <BusquedaVerificacionHistoricoVue />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
    </vs-tabs>
    <!--components-->
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from 'vue'
const GenerarCodigosVue                 = () => import('./components/GenerarCodigos/GenerarCodigos.vue')
const GenerateCodigosVue                = () => import('./components/GenerateCodigos.vue')
const MenuImportacionesVue              = () => import('./components/MenuImportaciones.vue')
const temporadasVue                     = () => import('../temporadas/temporada')
const historicoCodigosNuevoVue          = () => import('../temporadas/historicoCodigosNuevo.vue')
const pedidosBusquedaVue                = () => import('../temporadas/pedidosBusqueda.vue')
const BusquedaVerificacionVue           = () => import('../temporadas/BuscarVerificacionyDetalle.vue')
const BusquedaVerificacionHistoricoVue  = () => import('../temporadas/BuscarVerificacionyDetalle_Historico.vue')
const MenuPaquetesVue                   = () => import('./paquetes/MenuPaquetes.vue')
const MenuCombosVue                     = () => import("@/views/codigos/combos/MenuCombos.vue");
const MenuGrafitexVue                   = () => import('./grafitex/MenuGrafitex.vue')
const ScreenCodigosBusqueda             = () => import('./ScreenCodigosBusqueda.vue')
const ScreenCombosVue                   = () => import('./combos/ScreenCombos.vue')
import Codigosmix from "@/mixins/Codigosmix";
export default {
    components: {
      GenerarCodigosVue,
        GenerateCodigosVue,
        MenuImportacionesVue,
        temporadasVue,
        historicoCodigosNuevoVue,
        pedidosBusquedaVue,
        BusquedaVerificacionVue,
        BusquedaVerificacionHistoricoVue,
        MenuPaquetesVue,
        MenuGrafitexVue,
        ScreenCodigosBusqueda,
        ScreenCombosVue,
        MenuCombosVue,
    },
    data() {
        return {
            usuario: [],
            menu: 0,
        }
    },
    mixins: [Codigosmix],
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor']),
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.limpiarCache()
    },
    mounted() {
        let me = this;
    },
    methods: {}
}
</script>
