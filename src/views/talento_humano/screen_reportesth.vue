<template>
<div>
    <div v-if="tienePermiso">
        <div class="menu-container mb-6 mt-4">
            <div class="flex" style="flex-wrap: wrap; gap: 15px;">
                <div
                    class="sleek-menu-item"
                    :class="{'active': tipo === 0}"
                    @click="tipo = 0; MenuSelectedLocalStorage(0)">
                    <feather-icon icon="FileTextIcon" svgClasses="h-4 w-4 mr-2" />
                    <span>Reportes</span>
                </div>

                <div v-if="userRoot"
                    class="sleek-menu-item"
                    :class="{'active': tipo === 1}"
                    @click="tipo = 1; MenuSelectedLocalStorage(1)">
                    <feather-icon icon="SettingsIcon" svgClasses="h-4 w-4 mr-2" />
                    <span>Configuración</span>
                </div>
            </div>
        </div>

        <!-- Contenido -->
        <transition name="fade" mode="out-in">
            <div v-if="tipo === 0" class="mt-5" key="reportes">
                <screen_reportes_hikconnect />
            </div>
            <div v-if="tipo === 1" class="mt-5" key="configuracion">
                <screen_tipo_reportes />
            </div>
        </transition>
    </div>
    <div v-else class="flex items-center justify-center h-full mt-10">
        <vx-card class="text-center p-8 w-full md:w-1/2">
            <feather-icon icon="LockIcon" svgClasses="h-16 w-16 text-danger mb-4" />
            <h2 class="mb-2">Acceso Denegado</h2>
            <p>No tienes los permisos necesarios para acceder a este módulo.</p>
        </vx-card>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
const screen_reportes_hikconnect = () => import("@/views/talento_humano/reportes/screen_reportes.vue");
const screen_tipo_reportes = () => import("@/views/talento_humano/configuracion/screen_tipo_reportes.vue");

export default {
    props: {
        usuarioExterno: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            tipo: 0,
            usuario: null,
            tienePermiso: false,
        };
    },
    created() {
        if (this.usuarioExterno) {
            this.usuario = this.usuarioExterno;
            this.tienePermiso = true;
        } else {
            try {
                let userPlatform = JSON.parse(localStorage.getItem("usuario"));
                let userProlipa = JSON.parse(localStorage.getItem("userProlipa"));

                let currentPath = this.$route.path;
                if (currentPath.includes('/reportes_talento_humano')) {
                    if (userPlatform && (userPlatform.id_group == 1 || userPlatform.jefe_departamento == '1')) {
                        this.usuario = userPlatform;
                        this.tienePermiso = true;
                    }
                } else if (currentPath.includes('/talento-humano/reportes')) {
                    if (userProlipa && userProlipa.es_usuario_prolipa == '1') {
                        this.usuario = userProlipa;
                        this.tienePermiso = true;
                    }
                } else {
                    if (userPlatform && (userPlatform.id_group == 1 || userPlatform.jefe_departamento == '1')) {
                        this.usuario = userPlatform;
                        this.tienePermiso = true;
                    } else if (userProlipa && userProlipa.es_usuario_prolipa == '1') {
                        this.usuario = userProlipa;
                        this.tienePermiso = true;
                    }
                }
            } catch (error) {
                console.error("Error leyendo usuario de localStorage", error);
            }
        }
    },
    mounted() {
        if(this.tienePermiso) {
            this.SeleccionUltimoMenu();
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        MenuSelectedLocalStorage(index) {
            const data = {
                menu: index,
                submenu: 0,
                subsubmenu: 0
            };
            localStorage.setItem('talento_humano_menus', JSON.stringify(data));
            this.tipo = index;
        },
        SeleccionUltimoMenu() {
            const storedData = localStorage.getItem('talento_humano_menus');
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    this.tipo = parsedData.menu || 0;
                } catch(e) {
                    this.resetLocalStorage();
                }
            } else {
                this.resetLocalStorage();
            }
        },
        resetLocalStorage() {
            const data = {
                menu: 0,
                submenu: 0,
                subsubmenu: 0
            };
            localStorage.setItem('talento_humano_menus', JSON.stringify(data));
            this.tipo = 0;
        }
    },
    components: {
        screen_reportes_hikconnect,
        screen_tipo_reportes,
    },
};
</script>

<style scoped>
.menu-container {
    background: transparent;
}
.sleek-menu-item {
    display: inline-flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    color: #626262;
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: all 0.25s ease;
    user-select: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}
.sleek-menu-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    background-color: #ffffff;
    color: #333;
}
.sleek-menu-item.active {
    background: linear-gradient(118deg, #046AE7, rgba(4,106,231,0.7));
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 4px 10px rgba(4,106,231,0.3);
}
.logout-item:hover {
    background-color: #fee2e2 !important;
    color: #ef4444 !important;
    border-color: #fecaca !important;
}


.sleek-menu-item feather-icon {
    transition: all 0.25s ease;
}
.sleek-menu-item.active feather-icon {
    color: #ffffff !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
