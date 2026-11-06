<template>
<div>
    <vx-card>
        <vs-tabs v-model="activeTab">
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Orden de trabajo" @click="MenuSelectedLocalStorage()">
                <orden />
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>


<script>
const orden = () => import("@/views/hik_connect/Reportes_general/lista_editoriales.vue");
import {
    mapState
} from "vuex";

export default {
    data() {
        let submenuhik_connect = null;
        try {
            submenuhik_connect = JSON.parse(localStorage.getItem('hik_connect'));
        } catch (error) {
            console.error('Error parsing localStorage item "hik_connect":', error);
        }

        if (!submenuhik_connect) {
            submenuhik_connect = {
                menu: 0,
                submenu: 0
            };
            localStorage.setItem('hik_connect', JSON.stringify(submenuhik_connect));
        }

        return {
            activeTab: submenuhik_connect ? submenuhik_connect.submenu : 0, // Utiliza el valor de submenu si existe
            menulocalstorage: submenuhik_connect,
            usuario: [],
            noMostrar: false,
        };
    },
    computed: {
        ...mapState(["auth", "userRoot", "susuario", "AdminBodega", "AsisGerencia", "userContabilidad", 'userFacturador', 'userAdminFacturador']),
    },
    mounted() {
        let me = this
        const usuariorespo = localStorage.getItem("usuario");
        this.usuario = JSON.parse(usuariorespo);
        if (this.usuario.id_group == 32) {
            this.noMostrar = false
        } else {
            this.noMostrar = true
        }
    },
    methods: {
        MenuSelectedLocalStorage() {
            this.menulocalstorage.submenu = this.activeTab;
            localStorage.setItem('hik_connect', JSON.stringify(this.menulocalstorage));
        },
    },
    components: {
        orden,
        // institucionfacturacion,
    }
}
</script>