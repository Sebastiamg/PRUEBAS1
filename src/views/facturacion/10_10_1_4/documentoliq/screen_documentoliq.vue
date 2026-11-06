<template>
    <div>
        <vx-card>
            <vs-tabs v-model="activeTab">
                <vs-tab label="Comparación de pagos" @click="MenuSelectedLocalStorage()">
                    <Comparacion />
                </vs-tab>
                <vs-tab label="Tipo Documento" @click="MenuSelectedLocalStorage()">
                    <TipoDocumento />
                </vs-tab>
                    <vs-tab label="Configuración Stock" @click="MenuSelectedLocalStorage()">
                        <configuracionstock />
                    </vs-tab>
                <!-- <vs-tab label="Bancos" @click="MenuSelectedLocalStorage()">
                    <Bancos />
                </vs-tab> -->
                <vs-tab label="Cuentas Bancarias" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <cobranzas />
                </vs-tab>
            </vs-tabs>
        </vx-card>
    </div>
    </template>
    
    <script>
    import {
        mapState
    } from "vuex";
    import Comparacion from "./comparacionliq.vue";
    import TipoDocumento from "./tipo_documento_crud.vue";
    import Bancos from "./bancos.vue";
    const configuracionstock = () => import("../inventario/ScreenInventario.vue");
    const cobranzas = () => import("@/views/facturacion/10_10_1_4/documentoliq/Cobranzas/screen_cobranzas.vue");
    
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
                this.menulocalstorage.subsubmenu = 0;
                localStorage.setItem('sicom', JSON.stringify(this.menulocalstorage));
            },
        },
        components: {
            Comparacion,
            TipoDocumento,
            Bancos,
            configuracionstock,
            cobranzas
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        },
    };
    </script>
    