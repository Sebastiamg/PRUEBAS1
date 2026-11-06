<template>
<vx-card class="shadow-lg rounded-lg p-6">
    <div class="flex flex-wrap my-5 gap-4">
        <vs-button color="primary" @click="menu = 0;setMenu(0)" type="line" :type="menu === 0 ? 'gradient filled' : 'line'" aria-label="Ver reporte bodega">
            Reporte Bodega
        </vs-button>
        <vs-button color="primary" @click="menu = 1;setMenu(1)" type="line" :type="menu === 1 ? 'gradient filled' : 'line'" aria-label="Ver reporte vendedores">
            Reporte Vendedores
        </vs-button>
        <vs-button color="primary" @click="menu = 2;setMenu(2)" type="line" :type="menu === 2 ? 'gradient filled' : 'line'" aria-label="Ver reporte instituciones ventas">
            Reporte Instituciones Ventas
        </vs-button>
        <vs-button color="primary" @click="menu = 3;setMenu(3)" type="line" :type="menu === 3 ? 'gradient filled' : 'line'" aria-label="Ver reporte trazabilidad">
            Reporte Trazabilidad
        </vs-button>
        <vs-button color="primary" @click="menu = 4;setMenu(4)" type="line" :type="menu === 4 ? 'gradient filled' : 'line'" aria-label="Ver reporte venta lista - directa">
            Reporte Venta Lista - Directa
        </vs-button>
        <vs-button color="primary" @click="menu = 5;setMenu(5)" type="line" :type="menu === 5 ? 'gradient filled' : 'line'" aria-label="Ver reporte facturado por año">
            Reporte Facturado por Año
        </vs-button>
        <vs-button color="primary" @click="menu = 6;setMenu(6)" type="line" :type="menu === 6 ? 'gradient filled' : 'line'" aria-label="Ver reporte despacho bodega por año">
            Reporte Despachado bodega por Año
        </vs-button>
        <vs-button color="primary" @click="menu = 7;setMenu(7)" type="line" :type="menu === 7 ? 'gradient filled' : 'line'" aria-label="Ver reporte liquidaciones">
            Reportes Liquidaciones
        </vs-button>
        <vs-button color="primary" @click="menu = 8;setMenu(8)" type="line" :type="menu === 8 ? 'gradient filled' : 'line'" aria-label="REPORTE DE DESPACHOS POR SERIE">
            REPORTE DE DESPACHOS POR SERIE
        </vs-button>
        <vs-button color="primary" @click="menu = 9;setMenu(9)" type="line" :type="menu === 9 ? 'gradient filled' : 'line'" aria-label="REPORTE GENERAL">
            REPORTE GENERAL PEDIDOS
        </vs-button>
        <vs-button color="primary" @click="menu = 10;setMenu(10)" type="line" :type="menu === 10 ? 'gradient filled' : 'line'" aria-label="APROBACIONES VERIFICACIONES">
            APROBACIONES VERIFICACIONES
        </vs-button>
    </div>

    <div class="mt-5">
        <div v-if="menu === 0">
            <GerenciaScreenReporteBodegaVue />
        </div>
        <div v-if="menu === 1">
            <ReporteVentaVendedorVue />
        </div>
        <div v-if="menu === 2">
            <ReporteInstitucionVentaVue />
        </div>
        <div v-if="menu === 3">
            <ReporteTrasabilidadVue />
        </div>
        <div v-if="menu === 4">
            <ReporteVentaDirectaListaVue :sendPeriodo="0" />
        </div>
        <div v-if="menu === 5">
            <vs-tabs v-model="activeSubTab1">
                <vs-tab label="Prolipa">
                    <ReporteFacturadoFecha />
                </vs-tab>
                <vs-tab label="Iluminar">
                    <ReporteFacturadoFechaI />
                </vs-tab>
            </vs-tabs>
        </div>
        <div v-if="menu === 6">
            <vs-tabs v-model="activeSubTab2">
                <vs-tab label="Prolipa">
                    <ReporteVendidoFecha />
                </vs-tab>
                <vs-tab label="Iluminar">
                    <ReporteVendidoFechaI />
                </vs-tab>
            </vs-tabs>
        </div>
        <div v-if="menu === 7">
            <ReporteLiquidacionesVue :periodo="periodoDatos" :ifExterno="Number(0)" />
        </div>
        <div v-if="menu === 8">
            <ScreenBodegaReportesVue />
        </div>
        <div v-if="menu === 9">
            <vx-card title="Reportes seleccione el período para desplegar" class="mb-4">
                <small class="block mb-2">Buscar periodo:</small>
                <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos" @input="f_selectPeriodo();" label="periodoescolar" class="w-full" v-model="periodoSelect" />
            </vx-card>
            <vx-card v-if="mostrar">
                    <ScreenReporteVentasVue :periodo_id="periodoSelect.idperiodoescolar" :nombrePeriodo="periodoSelect.periodoescolar"  v-if="periodoSelect" />

            </vx-card>
            <!-- <vx-card v-if="mostrar">
                <div v-if="mostrar">
                    <vs-tabs>
                        <vs-tab label="Prolipa" @click="handleTabChange(0)">
                            <div v-if="cargarProlipa">
                                <ReporteGeneralVue :predioSeleccionado="periodo_id" :iluminar="false" :periodoCodigoContrato="contratoPeriodo" />
                            </div>
                        </vs-tab>
                        <vs-tab label="Iluminar" @click="handleTabChange(1)">
                            <div v-if="cargarIluminar">
                                <ReporteGeneralVue :predioSeleccionado="periodo_id" :iluminar="true" :periodoCodigoContrato="contratoPeriodo" />
                            </div>
                        </vs-tab>
                    </vs-tabs>
                </div>
            </vx-card> -->
        </div>
        <div v-if="menu == 10">
            <ReporteGerenciaVerificacionesLiquidacionesVue/>
        </div>
    </div>
</vx-card>
</template>

<script>
const ReporteVentaVendedorVue = () => import('./ReporteVentaVendedor2.vue');
const ReporteInstitucionVentaVue = () => import('./ReporteInstitucionVenta.vue');
const ReporteTrasabilidadVue = () => import('./ReporteTrasabilidad');
const ReporteVentaDirectaListaVue = () => import('./ReporteVentaDirectaLista.vue');
const GerenciaScreenReporteBodegaVue = () => import('./components/GerenciaScreenReporteBodega.vue');
const ReporteFacturadoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXFecha.vue');
const ReporteFacturadoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXFechaI.vue');
const ReporteVendidoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteVendidoXFecha.vue');
const ReporteVendidoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteVendidoXFechaI.vue');
const ReporteLiquidacionesVue = () => import('./ReporteLiquidaciones.vue');
const ScreenBodegaReportesVue = () => import('../../../codigos/reportes/ScreenBodegaReportes.vue')
const ReporteGeneralVue = () => import('@/views/pedidos2/pedidos/cobranzas/reportGeneral.vue');

const ScreenReporteVentasVue = () => import('@/views/pedidos2/pedidos/reportes/components/ScreenReporteVentas.vue')
import PeriodoRepository from '@/repositories/PeriodoRepository'
import vSelect from 'vue-select'
import Generalmix from '@/mixins/Generalmix';
const ReporteGerenciaVerificacionesLiquidacionesVue = () => import('@/views/pedidos/gerencia/reportes/verificaciones/ReporteGerenciaVerificacionesLiquidaciones.vue')
export default {
    mixins: [Generalmix],
    data() {
        return {
            menu: 0,
            activeSubTab1: 0,
            activeSubTab2: 0,
            periodoDatos: [],
            arrayPeriodos: [],
            periodo_id: 0,
            nombrePeriodo: '',
            periodoSelect: '',
            mostrar: false,
            cargarIluminar: false,
            cargarProlipa: false,
            contratoPeriodo: null,
        };
    },
    created() {
        const storedMenu = localStorage.getItem('activeMenuReportGerencia');
        if (storedMenu) {
            this.menu = parseInt(storedMenu, 10);
        }
    },
    components: {
        vSelect,
        ReporteVentaVendedorVue,
        ReporteInstitucionVentaVue,
        ReporteTrasabilidadVue,
        ReporteVentaDirectaListaVue,
        GerenciaScreenReporteBodegaVue,
        ReporteFacturadoFecha,
        ReporteVendidoFecha,
        ReporteFacturadoFechaI,
        ReporteVendidoFechaI,
        ReporteLiquidacionesVue,
        ScreenBodegaReportesVue,
        ReporteGeneralVue,
        ReporteGerenciaVerificacionesLiquidacionesVue,
        ScreenReporteVentasVue
    },
    mounted() {
        let me = this
        me.obtenerPeriodos()
    },
    methods: {
        setMenu(index) {
            this.menu = index;
            localStorage.setItem('activeMenuReportGerencia', index);
        },
        obtenerPeriodos() {
            let me = this;
            PeriodoRepository.getPeriodos().then(p => {
                me.arrayPeriodos = p.data.filter(p => p.reporte_gerencia == 1)
            });
        },
        f_selectPeriodo() {
            let me = this
            me.mostrar = false
            me.$vs.loading()
            setTimeout(() => {
                if (me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined) {
                    me.m_message("Seleccione un periodo por favor", "warning")
                    me.$vs.loading.close()
                    return
                }
                me.periodo_id = me.periodoSelect.idperiodoescolar
                me.nombrePeriodo = me.periodoSelect.periodoescolar
                me.contratoPeriodo = me.periodoSelect.codigo_contrato
                me.mostrar = true
                me.$vs.loading.close()
            }, 1000)
        },
        handleTabChange(index) {
            // `index` es la posición del tab seleccionado (0 = Prolipa, 1 = Iluminar)
            if (index === 0) {
                setTimeout(() => {
                    this.cargarProlipa = true;
                }, 500);
            } else if (index === 1) {
                setTimeout(() => {
                    this.cargarIluminar = true;
                }, 500);
            }
        },
    }

};
</script>

<style>
.active-button {
    background-color: #007BFF;
    /* Color del botón activo */
    color: white;
    /* Color del texto del botón activo */
}
</style>
