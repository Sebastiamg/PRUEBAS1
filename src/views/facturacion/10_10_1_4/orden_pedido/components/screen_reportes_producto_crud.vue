<template>
<div>
    <vx-card>
        <vs-tabs v-model="activeTab">
            <vs-tab v-if="userRoot || groupBodega" label="Reporte Stock's Productos">
                <reporte_de_stocks />
            </vs-tab>
            <vs-tab v-if="userRoot" label="Listado de Combos por Temporada">
                <listado_combos_x_temporada />
            </vs-tab>
            <vs-tab v-if="userRoot" label="Productos con inconsistencia en Stock General">
                <productos_con_inconsistencias />
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
const reporte_de_stocks = () => import("@/views/facturacion/10_10_1_4/orden_pedido/Reporte_Producto.vue");
const listado_combos_x_temporada = () => import("@/views/facturacion/10_10_1_4/orden_pedido/components/ListadoCombosxTemporada.vue");
const productos_con_inconsistencias = () => import("@/views/facturacion/10_10_1_4/orden_pedido/components/ListadoProductosXProformas.vue");
import {
    mapState
} from "vuex";
// import institucionfacturacion from './institucion.vue';

export default {
    data() {
        return {
            activeTab: 0
        };
    },
    computed: {
        ...mapState(["auth", "userRoot", "susuario", "AdminBodega", "AsisGerencia", "userContabilidad", 'userFacturador', 'userAdminFacturador', 'groupBodega']),
    },
    mounted() {},
    methods: {},
    components: {
        reporte_de_stocks,
        productos_con_inconsistencias,
        listado_combos_x_temporada
    }
}
</script>
