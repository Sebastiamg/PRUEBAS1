<template>
    <div>
        <vx-card>
            <vs-tabs v-model="activeTab">
                <vs-tab label="Remisión" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <remision />
                </vs-tab>
                <vs-tab label="Motivos Remisión" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <Motivoremision />
                </vs-tab>
                <vs-tab label="Tipo Empaque" v-if="AdminBodega || userRoot" @click="MenuSelectedLocalStorage()">
                    <tipo_empaque />
                </vs-tab>
                <vs-tab label="Transporte" v-if="userRoot || AdminBodega" @click="MenuSelectedLocalStorage()">
                    <transporte />
                </vs-tab>
                <vs-tab label="Choferes" v-if="userRoot || AdminBodega" @click="MenuSelectedLocalStorage()">
                    <BodegaChoferesVue />
                </vs-tab>
                <vs-tab label="Reporte Diario CALMED" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <reportecalmed />
                </vs-tab>
                <vs-tab label="Documentos" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <documentos />
                </vs-tab>
                <!-- <vs-tab label="Stock" v-if="AdminBodega || userRoot" @click="MenuSelectedLocalStorage()">
                    <stockProducto />
                </vs-tab> -->
                <vs-tab label="Movimientos Stock" v-if="AdminBodega || userRoot" @click="MenuSelectedLocalStorage()">
                    <movimientosProducto />
                </vs-tab>
                <vs-tab label="CodigosLiquidadosRegalados" v-if="userRoot || AsisGerencia" @click="MenuSelectedLocalStorage()">
                    <codigosLR />
                </vs-tab>
                <vs-tab label="Alcances" v-if="userRoot || AsisGerencia" @click="MenuSelectedLocalStorage()">
                    <alcances />
                </vs-tab>
            </vs-tabs>
        </vx-card>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    const remision = () => import("./remision_crud.vue");
    const Motivoremision = () => import("./motivo_remi.vue");
    const tipo_empaque = () => import("./tipo_empaque.vue");
    const transporte = () => import("./transporte_crud.vue");
    const reportecalmed = () => import("./reporte_diario_calmed.vue");
    const documentos = () => import("./Documentos/screen_documentos.vue");
    const stockProducto = () => import("./stockProducto.vue");
    const movimientosProducto = () => import("./Movimientos_Producto/screen_movimientos_producto.vue");
    const codigosLR = () => import("./codigosLR.vue");
    const alcances = () => import("./alcances.vue");
    const BodegaChoferesVue = () => import('./choferes/BodegaChoferes.vue')

    export default {
        data() {
            const submenusicom = JSON.parse(localStorage.getItem('sicom'));
            return {
                activeTab: submenusicom ? submenusicom.submenu : 0, // Utiliza el valor de submenu si existe
                menulocalstorage: JSON.parse(localStorage.getItem('sicom')),
            };
        },
        mounted() {},
        methods: {
            MenuSelectedLocalStorage() {
                this.menulocalstorage.submenu = this.activeTab;
                localStorage.setItem('sicom', JSON.stringify(this.menulocalstorage));
            },
        },
        //PARA DAR PERMISOS MODIFICAMOS EL Main.vue, state.js, actions.js, mutations-js
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'AsisGerencia']),
        },
        components: {
            transporte,
            remision,
            Motivoremision,
            tipo_empaque,
            reportecalmed,
            documentos,
            stockProducto,
            movimientosProducto,
            codigosLR,
            alcances,
            BodegaChoferesVue
        },
    };
    </script>
