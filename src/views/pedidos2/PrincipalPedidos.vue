<template>
<!--/p_pedidos-->
<vx-card>
    <!-- MENU -->
    <div>
        <!-- <MenuReutilizableVue v-if="groupFacturador || userAsesor" :menus="getMenus" activeBtnBackground="#000" @filtro-cambiado="cambiarFiltro" /> -->
        <MenuReutilizableVue
          v-if="groupFacturador || userAsesor || userContabilidad"
          :menus="getMenus"
          :permiso-fichero="permisoFichero"
          activeBtnBackground="#000"
          @filtro-cambiado="cambiarFiltro"
        />

        <br>
    </div>

    <!-- COMPONENTES -->
    <div v-if="menu == 0">
        <FicheroMercadoCompletoVue />
    </div>

    <div v-if="menu == 1">
        <ScreenPedidosVue :arregloPeriodos="arregloPeriodos" />
    </div>

    <div v-if="menu == 2">
        <ScreenGuiasVue :arregloPeriodos="arregloPeriodos" />
    </div>

    <div v-if="menu == 3">
        <h5 class="font-semibold">Obsequios</h5>
        <span v-if="(usuario.id_group == 22 || usuario.id_group == 23)">
            <ObsequiosFacturadorVue :arregloPeriodos="arregloPeriodos" />
        </span>
        <span v-else>
            <ScreenObsequiosFacturadorVue :arregloPeriodos="arregloPeriodos" @recargarPeriodos="getPeriodos" />
        </span>
    </div>

    <div v-if="menu == 4 && (userRoot || usuario.id_group == 23)">
        <ScreenFacturadorVue />
    </div>

    <div v-if="menu == 5">
        <DevolucionDocumentosBusquedaVue />
    </div>

    <div v-if="menu == 6">
        <devolucionBodegaHistorialVue />
    </div>

    <div v-if="menu == 7 && (userRoot || usuario.id_group == 23)">
        <ScreenSolicitudVerificacionesVue />
    </div>

    <div v-if="menu == 8 && userRoot">
        <AsesorVerificacionesNotificacionesVue />
    </div>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import MenuReutilizableVue from '../configuracion/Reutilizable/MenuReutilizable.vue';

const ScreenPedidosVue = () => import('./pedidos/ScreenPedidos.vue');
const ScreenGuiasVue = () => import('./guias/ScreenGuias');
const ScreenObsequiosFacturadorVue = () => import('../pedidos/obsequios/ScreenObsequiosFacturador.vue');
const ObsequiosFacturadorVue = () => import('../pedidos/obsequios/ObsequiosFacturador.vue');
const ScreenFacturadorVue = () => import('./facturadores/ScreenFacturador.vue');
const DevolucionDocumentosBusquedaVue = () => import('../codigos/components/devolucion/DevolucionDocumentosBusqueda.vue');
const AsesorVerificacionesNotificacionesVue = () => import('@/views/temporadas/verificaciones/asesor/AsesorVerificacionesNotificaciones.vue');
const ScreenSolicitudVerificacionesVue = () => import('./verificaciones/ScreenSolicitudVerificaciones.vue');
const devolucionBodegaHistorialVue = () => import('../bodega/devolucionBodegaHistorial.vue');
const FicheroMercadoCompletoVue = () => import('./fichero_mercado/FicheroMercado_General.vue');

export default {
    components: {
        MenuReutilizableVue,
        ScreenPedidosVue,
        ScreenGuiasVue,
        ScreenObsequiosFacturadorVue,
        ScreenFacturadorVue,
        ObsequiosFacturadorVue,
        DevolucionDocumentosBusquedaVue,
        AsesorVerificacionesNotificacionesVue,
        ScreenSolicitudVerificacionesVue,
        devolucionBodegaHistorialVue,
        FicheroMercadoCompletoVue
    },
    data() {
        return {
            menu: 0, // Fichero de Mercado por defecto
            usuario: [],
            arregloPeriodos: [],
        };
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario','userContabilidad', 'ObjectPedido', 'userAsesor', 'groupFacturador','permisoFichero']),
        // getMenus() {
        //     if (this.groupFacturador) {
        //         // Fichero de Mercado va primero
        //         return [
        //             'Fichero de Mercado', // 0
        //             'Pedidos', // 1
        //             'Guías', // 2
        //             'Obsequios', // 3
        //             'Facturadores', // 4
        //             'Devoluciones', // 5
        //             'Devoluciones combos sueltos', // 6
        //             'Solicitud Verificaciones', // 7
        //             'Evidencias Contratos' // 8
        //         ];
        //     } else if (this.userAsesor) {
        //         return [
        //             'Fichero de Mercado', // 0
        //             'Pedidos', // 1
        //             'Guías', // 2
        //             'Obsequios' // 3
        //         ];
        //     }
        //     return [];
        // },
       getMenus() {
        if (this.groupFacturador) {
          return [
            { label: 'Fichero de Mercado', visible: this.permisoFichero != 0 },
            { label: 'Pedidos', visible: true },
            { label: 'Guías', visible: true },
            { label: 'Obsequios', visible: true },
            { label: 'Facturadores', visible: true },
            { label: 'Devoluciones', visible: true },
            { label: 'Devoluciones combos sueltos', visible: true },
            { label: 'Solicitud Verificaciones', visible: true },
            { label: 'Evidencias Contratos', visible: true },
          ];
        } else if (this.userAsesor) {
          return [
            { label: 'Fichero de Mercado', visible: this.permisoFichero != 0 },
            { label: 'Pedidos', visible: true },
            { label: 'Guías', visible: true },
            { label: 'Obsequios', visible: true },
          ];
        } else if (this.userContabilidad) {
          return [
            { label: 'Fichero de Mercado', visible: this.permisoFichero != 0 },
            { label: 'Pedidos', visible: true },
          ];
        }
        return [];
      },

    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    async mounted() {
        let me = this;

        // Cargar períodos primero antes de inicializar el menú
        await me.getPeriodos();

        // Valor inicial del menú según tipo de usuario
        if (me.groupFacturador) {
            me.menu = 0; // Fichero de Mercado
        } else if (me.userAsesor) {
            me.menu = 0; // También Fichero de Mercado
        } else if (me.userContabilidad) {
            me.menu = 1; // También Fichero de Mercado
        }  else if (me.usuario.id_group == 1 && !me.userRoot) {
            me.menu = 3; // Obsequios (ajustado al nuevo orden)
        }

        // Restaurar último menú si existe en localStorage
        let menuIndex = localStorage.getItem('menuIndex');
        if (menuIndex) {
            this.menu = parseInt(menuIndex);
            this.cambiarFiltro(this.menu);
        }
        if(me.permisoFichero == 0){
            me.menu = 1; // Pedidos
            this.cambiarFiltro(this.menu);
        }
    },
    methods: {
        cambiarFiltro(filtro) {
            this.menu = filtro;
            localStorage.setItem('menuIndex', filtro);
        },
        async getPeriodos() {
            let me = this;
            try {
                const res = await this.$http.get(this.$server_url + 'get_periodos_pedidos');
                let datos = res.data;

                if (datos.length == 0) {
                    localStorage.removeItem('pid');
                    localStorage.removeItem('pnombre');
                    me.arregloPeriodos = [];
                    return;
                }

                if (me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1) {
                    me.arregloPeriodos = datos.filter(p => p.pedido_facturacion == 1);
                }
                if (me.usuario.id_group == 17 || me.usuario.id_group == 27) {
                    me.arregloPeriodos = datos.filter(p => p.pedido_bodega == 1);
                }
                if (me.usuario.id_group == 11) {
                    me.arregloPeriodos = datos.filter(p => p.pedido_asesor == 1);
                }
                if (me.usuario.id_group == 26) {
                    me.arregloPeriodos = datos.filter(p => p.pedido_facturacion == 1);
                }

                if (me.arregloPeriodos.length == 0) {
                    localStorage.removeItem('pid');
                    localStorage.removeItem('pnombre');
                }
            } catch(error) {
                console.error('Error al cargar períodos:', error);
                me.arregloPeriodos = [];
                me.$vs.loading.close();
            }
        },
    }
};
</script>
