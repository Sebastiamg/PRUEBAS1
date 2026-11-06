<template>
<vx-card>
    <vs-tabs v-model="ifFacturacion">
        <vs-tab label="Facturado por asesor">
            <ReporteFacturadoXAsesores :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
        </vs-tab>
        <vs-tab label="Facturado por Año">
            <vs-tabs v-model="activeSubTab1">
                <vs-tab label="Prolipa">
                    <ReporteFacturadoFecha />
                </vs-tab>
                <vs-tab label="Iluminar">
                    <ReporteFacturadoFechaI />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Despachado x Bodega por Año">
            <vs-tabs v-model="activeSubTab2">
                <vs-tab label="Prolipa">
                    <ReporteVendidoFecha />
                </vs-tab>
                <vs-tab label="Iluminar">
                    <ReporteVendidoFechaI />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Cobrado por Año">
            <vs-tabs v-model="activeSubTab3">
                <vs-tab label="Prolipa">
                    <ReporteCobradoFecha />
                </vs-tab>
                <vs-tab label="Iluminar">
                    <ReporteCobradoFechaI />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
        <vs-tab label="Cuentas X Cobrar">
            <vs-tabs v-model="activeSubTab4">
                <vs-tab label="Prolipa">
                    <ReporteCuentasXCobrar />
                </vs-tab>
            </vs-tabs>
        </vs-tab>
    </vs-tabs>
</vx-card>
</template>

<script>
const ReporteFacturadoXAsesores = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXAsesores.vue');
const ReporteFacturadoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXFecha.vue');
const ReporteVendidoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteVendidoXFecha.vue');
const ReporteFacturadoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXFechaI.vue');
const ReporteVendidoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteVendidoXFechaI.vue');
const ReporteCobradoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteCobradoXFecha.vue');
const ReporteCobradoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteCobradoXFechaI.vue');
const ReporteCuentasXCobrar = () => import('@/views/pedidos2/pedidos/reportes/ReporteCuentasXCobrar.vue');
// const ReporteCuentasXCobrari = () => import('@/views/pedidos2/pedidos/reportes/ReporteCuentasXCobrari.vue');

import vSelect from 'vue-select'
export default {
    components: {
        ReporteFacturadoXAsesores,
        ReporteFacturadoFecha,
        ReporteVendidoFecha,
        ReporteFacturadoFechaI,
        ReporteVendidoFechaI,
        ReporteCobradoFecha,
        ReporteCobradoFechaI,
        vSelect,
        ReporteCuentasXCobrar,
        // ReporteCuentasXCobrari
    },
    data() {
        return {
            ifFacturacion: 0,
            activeSubTab1: 0,
            activeSubTab2: 0,
            activeSubTab3: 0,
            activeSubTab4: 0,
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
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted() {
        let me = this
    },
    methods: {

    }
}
</script>
