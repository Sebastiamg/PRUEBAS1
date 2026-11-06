<template>
<vx-card>
    <vs-tabs v-model="ifVentas">
        <vs-tab label="Venta directa y lista">
            <div class="mt-5">
                <p>Reporte de {{ periodoSelect.periodoescolar }}</p>
                <ReporteVentaDirectaListaVue :periodo_id="periodoSelect.idperiodoescolar"  :nombrePeriodo="nombrePeriodo" />
            </div>
        </vs-tab>
        <!-- <vs-tab label="Comparativos puntos de venta" v-if="userRoot">
            <ReporteComparativo :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :ifExterno="Number(1)" />
        </vs-tab> -->
        <vs-tab label="Liquidaciones Venta Lista" >
            <ReporteLiquidacionesVue :periodo="periodoSelect" :ifExterno="Number(1)" />
        </vs-tab>
        <vs-tab label="Liquidaciones Venta Directa" >
            <ReporteLiquidacionesDirectasVue :periodo="periodoSelect" :ifExterno="Number(1)" />
        </vs-tab>
        <vs-tab label="Liquidaciones completa" >
            <ReporteVentaPeriodosVue :periodo="periodoSelect" />
        </vs-tab>
    </vs-tabs>
</vx-card>
</template>


<script>
const ReporteComparativo = () => import('@/views/pedidos2/pedidos/reportes/ReporteComparativo.vue')
const ReporteVentaDirectaListaVue = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaDirectaLista.vue')
const ReporteLiquidacionesVue = () => import('@/views/pedidos/gerencia/reportes/ReporteLiquidaciones.vue')
const ReporteLiquidacionesDirectasVue = () => import('@/views/pedidos/gerencia/reportes/ReporteLiquidacionesDirectas.vue')
const ReporteVentaPeriodosVue = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaPeriodos.vue')
import vSelect from 'vue-select'
import {
    mapState
} from "vuex";
export default {
    components: {
        ReporteComparativo,
        ReporteVentaDirectaListaVue,
        ReporteLiquidacionesVue,
        ReporteLiquidacionesDirectasVue,
        ReporteVentaPeriodosVue,
        vSelect,
    },
    data() {
        return {
            ifVentas: 0,
            usuario: [],
        }
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0
        },
        nombrePeriodo: {
            type: String,
            default: ""
        },
        periodoSelect: {
            type: Object,
            default: {}
        },
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted() {
        let me = this
    },
    methods: {

    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),
    },
}
</script>
