<template>
<div>
    <vx-card>
        <vs-alert v-if="!userRoot" title="Alerta" active="true" color="danger" class="m-3">
            <h4> {{ noroot }} </h4>
        </vs-alert>
        <vs-tabs position="left">
            <vs-tab label="Gerencia">
                Lista de pedidos pendientes y aprobados por gerencia
                <div v-if="userRoot">
                    <Screen_gerencia />
                </div>
            </vs-tab>
            <vs-tab label="Contabilidad">
                Lista de pedidos en Contabilidad
                <div v-if="userRoot">
                    <PedidosContabilidad />
                </div>
            </vs-tab>
            <vs-tab label="Pedidos" @click="menu = 2;">
                <div v-if="userRoot && menu == 2">
                    <PrincipalPedidosVue />
                </div>
            </vs-tab>
            <vs-tab label="Bodega">
                <div v-if="userRoot">
                    <Screen_bodega />
                </div>
            </vs-tab>
            <vs-tab label="Secuencias">
                <div v-if="userRoot">
                    <PedidoSecuencia />
                </div>
            </vs-tab>
            <vs-tab label="Facturación" v-if="userRoot">
                <formatoPedidosVue />
            </vs-tab>
            <vs-tab label="Facturación api" v-if="userRoot">
                <div>
                    <Facturacionapi />
                </div>
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
const  PrincipalPedidosVue =  () => import('../pedidos2/PrincipalPedidos.vue')
import Screen_gerencia from '../home/gerencia/screen_gerencia.vue';
import PedidoSecuencia from './pedidoSecuencia.vue';
import PedidosContabilidad from './contabilidad/ScreenContabilidad.vue';
// import FormatoPedidos from './formatos_pedidos.vue';
import Screen_bodega from '../home/bodega/screen_admin_bodega.vue';
import Facturacionapi from './facturacion_api/screen_facturacion.vue';
// import PrincipalPedidosVue from '../pedidos2/PrincipalPedidos.vue'
import formatoPedidosVue from './formatos_pedidos.vue'
export default {
    data() {
        return {
            userRoot: false,
            usuario: '',
            noroot: '',
            menu:0,
        };
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getUserRoot(me.usuario);
    },
    methods: {
        getUserRoot(dato) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    console.log('pedido admin screen', result.data)
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    } else {
                        me.noroot = 'No tiene permisos para acceder a esta sección'
                        me.f_notificaciones(me.noroot, 'danger', 'icon-alert-triangle')
                    }
                    me.$vs.loading.close()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        }
    },
    components: {
        PedidoSecuencia,
        Screen_gerencia,
        PedidosContabilidad,
        // FormatoPedidos,
        Screen_bodega,
        formatoPedidosVue,
        Facturacionapi,
        PrincipalPedidosVue
    }
}
</script>
