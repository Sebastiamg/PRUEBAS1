<template>
    <div>
        <vx-card>
            <vs-tabs v-model="activeTab">
                <!-- <vs-tab label="Contrato y Usuarios Agrupados" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <contratousuarioagrupado />
                </vs-tab> -->
                <vs-tab label="Cuentas Bancarias" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                    <cuentasBanco />
                </vs-tab>
                <!-- <vs-tab label="Remisión" v-if="userRoot">
                            <remision />
                        </vs-tab> -->
            </vs-tabs>
        </vx-card>
    </div>
    </template>
    
        
    <script>
    import {
        mapState
    } from "vuex";
    const contratousuarioagrupado = () => import("@/views/facturacion/10_10_1_4/Facturacion/Contrato_Usuario_Agrupado/lista_agrupados.vue");
    const cuentasBanco = () => import("@/views/facturacion/10_10_1_4/Facturacion/cuentas_banco_empresa/cuentasBancoEmpresa.vue");
    
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
            ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        },
        components: {
            contratousuarioagrupado,
            cuentasBanco,
        },
    };
    </script>
    