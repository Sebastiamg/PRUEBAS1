<template>
<div>
    <vx-card>
        <vs-tabs v-model="activeTab">
            <vs-tab label="Cuentas Bancarias" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                <cuentasBanco />
            </vs-tab>
            <vs-tab label="Porcentaje de Retención" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                <porcentajeretencion />
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

    
<script>
import {
    mapState
} from "vuex";
const cuentasBanco = () => import("@/views/facturacion/10_10_1_4/Facturacion/cuentas_banco_empresa/cuentasBancoEmpresa.vue");
const porcentajeretencion = () => import("@/views/facturacion/10_10_1_4/documentoliq/Cobranzas/Porcentaje/lista_porcentaje.vue");

export default {
    data() {
        const subsubmenusicom = JSON.parse(localStorage.getItem('sicom'));
        return {
            activeTab: subsubmenusicom ? subsubmenusicom.subsubmenu : 0, // Utiliza el valor de subsubmenu si existe
            menulocalstorage: JSON.parse(localStorage.getItem('sicom')),
        };
    },
    mounted() {},
    methods: {
        MenuSelectedLocalStorage() {
            this.menulocalstorage.subsubmenu = this.activeTab;
            localStorage.setItem('sicom', JSON.stringify(this.menulocalstorage));
        },
    },
    components: {
        cuentasBanco,
        porcentajeretencion,
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
};
</script>
