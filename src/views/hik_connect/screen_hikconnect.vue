<template>
<div>
    <div class="flex" style="flex-wrap: wrap">
        <vs-button :type="tipo === 0 ? 'gradient filled' : 'line'" v-if="userRoot || AdminBodega || AsisGerencia || userContabilidad || userFacturador || userAdminFacturador" @click="tipo = 0; MenuSelectedLocalStorage(0)" class="m-2 py-2 borderbotones">Orden de producción</vs-button>
        <vs-button :type="tipo === 1 ? 'gradient filled' : 'line'" v-if="userRoot || AdminBodega" @click="tipo = 1; MenuSelectedLocalStorage(1)" class="m-2 py-2 borderbotones bodegas-button">Bodegas</vs-button>
        <vs-button :type="tipo === 2 ? 'gradient filled' : 'line'" v-if="userRoot" @click="tipo = 2; MenuSelectedLocalStorage(2)" class="m-2 py-2 borderbotones">Administración</vs-button>
        <vs-button :type="tipo === 3 ? 'gradient filled' : 'line'" v-if="userRoot" @click="tipo = 3; MenuSelectedLocalStorage(3)" class="m-2 py-2 borderbotones">Empresas</vs-button>
        <!-- <vs-button :type="tipo === 4 ? 'gradient filled' : 'line'" v-if="userRoot" @click="tipo = 4; MenuSelectedLocalStorage(4)" class="m-2 py-2 borderbotones">Facturación</vs-button> -->
    </div>
    <!--Órden de producción-->
    <div v-if="tipo == 0 && (userRoot || AsisGerencia || AdminBodega || userContabilidad || userFacturador || userAdminFacturador)" class="mt-5">
        <screen_reportes_hikconnect />
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
const screen_reportes_hikconnect = () => import("@/views/hik_connect/Reportes_general/screen_reportes.vue");

export default {
    data() {
        return {
            tipo: 0,
        };
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'AsisGerencia', 'userContabilidad', 'userFacturador', 'userAdminFacturador']),
    },
    mounted() {
        let me = this;
        this.SeleccionUltimoMenu();
        this.$watch(
            () => [this.userRoot, this.AdminBodega],
            () => {
                // Verificar si userRoot y AdminBodega tienen datos
                if (this.userRoot !== false || this.AdminBodega !== false || this.AsisGerencia !== false ||  this.userContabilidad !== false || this.userFacturador !== false || this.userAdminFacturador !== false) {
                    this.$nextTick(() => {
                        this.validacion_perfiles();
                    });
                }
            });
        if (this.userRoot !== false || this.AdminBodega !== false || this.AsisGerencia !== false || this.userContabilidad !== false || this.userFacturador !== false || this.userAdminFacturador !== false) {
            this.validacion_perfiles();
        }
        setTimeout(() => {
            if (this.userRoot !== true && this.AdminBodega !== true && this.AsisGerencia !== true && this.userContabilidad !== true && this.userFacturador !== true && this.userAdminFacturador !== true) {
                me.$vs.notify({
                    text: 'No tiene permiso para acceder a esta sección',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            }
        }, 8000);
        //Se ejecuta después de que Vue haya actualizado el DOM y el botón esté disponible para ser seleccionado.
    },
    methods: {
        MenuSelectedLocalStorage(index) {
            const data = {
                menu: index,
                submenu: 0,
                subsubmenu: 0
            };
            localStorage.setItem('hik_connect', JSON.stringify(data));
            this.SeleccionUltimoMenu();
        },
        SeleccionUltimoMenu() {
            const storedData = localStorage.getItem('hik_connect');
            if (storedData) {
                const {
                    menu
                } = JSON.parse(storedData);
                this.tipo = menu; // Establece el tipo de menú almacenado en el estado del componente
            } else {
                const data = {
                    menu: 0,
                    submenu: 0,
                    subsubmenu: 0
                };
                localStorage.setItem('hik_connect', JSON.stringify(data));
                this.SeleccionUltimoMenu();
            }
        },
        validacion_perfiles() {
            let me = this;
            const dashboardstock = localStorage.getItem('dashboardstock');
            // console.log("root",me.userRoot, "adminbodega",me.AdminBodega)
            if (me.userRoot == false) {
                // if (me.AdminBodega == true) {
                //     const bodegaButton = document.querySelector('.bodegas-button');
                //     bodegaButton.click();
                // } else
                if (dashboardstock == 1) {
                    const bodegaButton2 = document.querySelector('.bodegas-button');
                    bodegaButton2.click();
                }
            } else {
                if (dashboardstock == 1) {
                    const bodegaButton2 = document.querySelector('.bodegas-button');
                    bodegaButton2.click();
                } else {
                    console.log("es root");
                }
            }
        }
    },
    components: {
        screen_reportes_hikconnect,
    },
};
</script>

<style scoped>
.borderbotones {
    box-shadow: 0px -2px 0px 1px #046AE7;
    border-radius: 10px;
}
</style>
