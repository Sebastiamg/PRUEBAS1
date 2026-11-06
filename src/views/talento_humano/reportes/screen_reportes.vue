<template>
<div>
    <vx-card v-if="tienePermiso">
        <vs-tabs v-model="activeTab">
            <vs-tab label="Reporte Semanal" @click="MenuSelectedLocalStorage()">
                <lista_reportes />
            </vs-tab>
            <vs-tab label="Solicitud de Permiso o Vacaciones" @click="MenuSelectedLocalStorage()">
                <lista_permisos />
            </vs-tab>
            <!-- <vs-tab label="Acta de Entrega - Recepción" @click="MenuSelectedLocalStorage()">
                <lista_actaentrega />
            </vs-tab> -->
            <vs-tab label="Memorando" @click="MenuSelectedLocalStorage()" v-if="userRoot || esJefe">
                <lista_memorando />
            </vs-tab>
        </vs-tabs>
    </vx-card>
    <vx-card v-else>
        <p class="text-center text-gray-500 mt-4">No tienes permisos para acceder a este módulo.</p>
    </vx-card>
</div>
</template>

<script>
import { mapState } from "vuex";
const lista_reportes = () => import("@/views/talento_humano/reportes/Reportes_semanales/lista_reportesemanal.vue");
const lista_permisos = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/lista_permisovacacion.vue");
const lista_actaentrega = () => import("@/views/talento_humano/reportes/Actas_Entrega/lista_actasentrega.vue");
const lista_memorando = () => import("@/views/talento_humano/reportes/Memorando/lista_memorando.vue");

export default {
    data() {
        let talento_humano_menus = null;
        try {
            talento_humano_menus = JSON.parse(localStorage.getItem('talento_humano_menus'));
        } catch (error) {
            console.error('Error parsing localStorage item "talento_humano_menus":', error);
        }

        if (!talento_humano_menus) {
            talento_humano_menus = { menu: 0, submenu: 0 };
            localStorage.setItem('talento_humano_menus', JSON.stringify(talento_humano_menus));
        }

        let tienePermiso = false;
        let usuario = null;
        try {
            let userPlatform = JSON.parse(localStorage.getItem("usuario"));
            let userProlipa = JSON.parse(localStorage.getItem("userProlipa"));

            let currentPath = this.$route.path;
            if (currentPath.includes('/reportes_talento_humano')) {
                if (userPlatform && (userPlatform.id_group == 1 || userPlatform.jefe_departamento == '1')) {
                    usuario = userPlatform;
                    tienePermiso = true;
                }
            } else if (currentPath.includes('/talento-humano/reportes')) {
                if (userProlipa && userProlipa.es_usuario_prolipa == '1') {
                    usuario = userProlipa;
                    tienePermiso = true;
                }
            } else {
                if (userPlatform && (userPlatform.id_group == 1 || userPlatform.jefe_departamento == '1')) {
                    usuario = userPlatform;
                    tienePermiso = true;
                } else if (userProlipa && userProlipa.es_usuario_prolipa == '1') {
                    usuario = userProlipa;
                    tienePermiso = true;
                }
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
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        esJefe() {
            return this.usuario && this.usuario.jefe_departamento == '1';
        }
    },
    components: {
        lista_reportes,
        lista_permisos,
        lista_actaentrega,
        lista_memorando
    }
}
</script>

