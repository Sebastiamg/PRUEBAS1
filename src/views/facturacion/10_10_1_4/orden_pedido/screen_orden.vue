<template>
<div>
    <vx-card>
        <vs-tabs v-model="activeTab">
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Orden de trabajo" @click="MenuSelectedLocalStorage()">
                <orden />
            </vs-tab>
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Proveedor" @click="MenuSelectedLocalStorage()">
                <proveedor />
            </vs-tab>
            <vs-tab v-if="userRoot || AdminBodega" label="Recibir orden de trabajo" @click="MenuSelectedLocalStorage()">
                <compra />
            </vs-tab>
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Característica del producto" @click="MenuSelectedLocalStorage()">
                <producto_caracteristica />
            </vs-tab>
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega || userFacturador || userAdminFacturador" label="Producto" @click="MenuSelectedLocalStorage()">
                <producto />
            </vs-tab>
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Grupo Producto" @click="MenuSelectedLocalStorage()">
                <grupo_producto />
            </vs-tab>
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Material Cubierta Exterior" @click="MenuSelectedLocalStorage()">
                <material_cubierta_exterior />
            </vs-tab>
            <vs-tab v-if="userRoot || AsisGerencia || userContabilidad || AdminBodega" label="Material Cubierta Interior" @click="MenuSelectedLocalStorage()">
                <material_cubierta_interior />
            </vs-tab>
            <!-- <vs-tab label="Institución">
                      <institucionfacturacion />
                  </vs-tab> -->
        </vs-tabs>
    </vx-card>
</div>
</template>


<script>
import orden from "./orden_trabajo.vue";
import compra from "./compra_orden_trabajo.vue";
import proveedor from "./proveedor.vue";
import producto_caracteristica from './producto_caracteristica.vue';
import producto from './producto_crud.vue';
import grupo_producto from './grupo_producto_crud.vue';
import material_cubierta_exterior from './material_cubierta_exterior_crud.vue';
import material_cubierta_interior from './material_cubierta_interior_crud.vue';
import {
    mapState
} from "vuex";
// import institucionfacturacion from './institucion.vue';

export default {
    data() {
        let submenusicom = null;
        try {
            submenusicom = JSON.parse(localStorage.getItem('sicom'));
        } catch (error) {
            console.error('Error parsing localStorage item "sicom":', error);
        }

        if (!submenusicom) {
            submenusicom = {
                menu: 0,
                submenu: 0
            };
            localStorage.setItem('sicom', JSON.stringify(submenusicom));
        }

        return {
            activeTab: submenusicom ? submenusicom.submenu : 0, // Utiliza el valor de submenu si existe
            menulocalstorage: submenusicom,
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
            localStorage.setItem('sicom', JSON.stringify(this.menulocalstorage));
        },
    },
    components: {
        orden,
        compra,
        proveedor,
        producto_caracteristica,
        producto,
        grupo_producto,
        material_cubierta_exterior,
        material_cubierta_interior,
        // institucionfacturacion,
    }
}
</script>