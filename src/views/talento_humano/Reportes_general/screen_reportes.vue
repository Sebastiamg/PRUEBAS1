<template>
<div>
    <vx-card v-if="tienePermiso">
        <vs-tabs v-model="activeTab">
            <vs-tab label="Orden de trabajo" @click="MenuSelectedLocalStorage()">
                <orden />
            </vs-tab>
            <vs-tab label="Reporte 2" @click="MenuSelectedLocalStorage()">
                <!-- <componente_reporte_2 /> -->
            </vs-tab>
            <vs-tab label="Reporte 3" @click="MenuSelectedLocalStorage()">
                <!-- <componente_reporte_3 /> -->
            </vs-tab>
            <vs-tab label="Reporte 4" @click="MenuSelectedLocalStorage()">
                <!-- <componente_reporte_4 /> -->
            </vs-tab>
            <vs-tab label="Reporte 5" @click="MenuSelectedLocalStorage()">
                <!-- <componente_reporte_5 /> -->
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
const orden = () => import("@/views/hik_connect/Reportes_general/lista_editoriales.vue");

export default {
    data() {
        let talento_humano_menus = null;
        try {
            talento_humano_menus = JSON.parse(localStorage.getItem('talento_humano_menus'));
        } catch (error) {
            console.error('Error parsing localStorage item "talento_humano_menus":', error);
        }

        if (!talento_humano_menus) {
            talento_humano_menus = {
                menu: 0,
                submenu: 0
            };
            localStorage.setItem('talento_humano_menus', JSON.stringify(talento_humano_menus));
        }

        let tienePermiso = false;
        let usuario = null;
        try {
            usuario = JSON.parse(localStorage.getItem("usuario"));
            if (usuario && (usuario.id_group == 1 || usuario.jefe_departamento == '1')) {
                tienePermiso = true;
            }
        } catch (error) {}

        return {
            activeTab: talento_humano_menus ? (talento_humano_menus.submenu || 0) : 0,
            menulocalstorage: talento_humano_menus,
            usuario: usuario,
            tienePermiso: tienePermiso,
        };
    },
    methods: {
        MenuSelectedLocalStorage() {
            this.menulocalstorage.submenu = this.activeTab;
            localStorage.setItem('talento_humano_menus', JSON.stringify(this.menulocalstorage));
        },
    },
    components: {
        orden,
    }
}
</script>
