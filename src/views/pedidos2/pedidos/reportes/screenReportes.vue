<template>
    <div>
        <vx-card>
            <vs-tabs v-model="activeTab">
               <vs-tab label="Reportes General" v-if="userRoot || AdminFacturador">
                  <ScreenReporteVentasVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
               </vs-tab>
                <vs-tab label="Reportes Ventas" v-if="userRoot || AdminFacturador">
                    <Ventas :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
                  </vs-tab>
                <vs-tab label="Reportes Bodega" v-if="userRoot || groupFacturado">
                    <Bodega :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Reportes Facturación" v-if="userRoot || groupFacturador">
                    <Facturacion :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
                </vs-tab>
                <vs-tab label="Reportes Cobranza" v-if="userRoot || groupFacturador">
                    <Cobranza :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Despachos" v-if="userRoot || groupFacturador">
                    <Despachados :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="PEDIDOS" v-if="userRoot || groupFacturador">
                    <screenInformacionGeneralVue :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Superintendencia" v-if="userRoot">
                    <ScreenSuperIntendencia />
                </vs-tab>

            </vs-tabs>
        </vx-card>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    import Facturacion from "./components/reporteFacturacion.vue";
    import Bodega from "./components/reporteBodega.vue";
    import Ventas from "./components/reporteVentas.vue";
    import Cobranza from "./components/reporteCobranza.vue";
    import Despachados from "./components/reporteDespachados.vue";
    const screenInformacionGeneralVue = () => import('@/views/pedidos2/pedidos/informacionGeneral/screenInformacionGeneral.vue')
    const ScreenReporteVentasVue = () => import('./components/ScreenReporteVentas.vue');
    const ScreenSuperIntendencia = () => import('./components/superintendencia/ScreenSuperIntendencia.vue');
    export default {
        data() {
            return {
                activeTab:0,
            };
        },
        props:{
            periodo_id:{
                type:Number,
                default:0
            },
            nombrePeriodo:{
                type:String,
                default:''
            },
            periodoSelect:{
                type:Object,
                default:{}
            },
        },
        mounted() {},
        methods: {
        },
        //PARA DAR PERMISOS MODIFICAMOS EL Main.vue, state.js, actions.js, mutations-js
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),
        },
        components: {
            Facturacion,
            Bodega,
            Ventas,
            Cobranza,
            Despachados,
            screenInformacionGeneralVue,
            ScreenReporteVentasVue,
            ScreenSuperIntendencia,
        },
    };
    </script>
