<template>
<div>
    <div style="display: none;">
        <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" @ChangecantidadMensajes="changeCantidadMensajes" />
    </div>
    <div class="padre">
        <!-- Devoluciones Pendientes -->
        <vx-card class="green-card" @click="f_irDevoluciones();" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div>
                <h2>Devoluciones</h2>
            </div>
            <div class="flex" style="justify-content: space-between;">
                <div class="flex">
                    <h3>Pendientes</h3>
                    <b class="obsequiosLibros ml-1 mt-1">{{ totalDevolucionesPendientes }}</b>
                </div>
                <div>
                    <img width="80" style="margin-top: 5px; margin: 4px;" src="https://cdn-icons-png.flaticon.com/512/3176/3176101.png" alt="">
                </div>
            </div>
        </vx-card>

        <!-- Notificaciones -->
        <vx-card class="cyan-card" @click="popupNotificaciones = true;" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div>
                <h2>Notificaciones</h2>
            </div>
            <div class="flex" style="justify-content: space-between;">
                <div class="flex">
                    <h3>Mensajes</h3>
                    <b class="message_p ml-1 mt-1">{{ cantidadMensajes }}</b>
                </div>
                <div>
                    <img width="80" style="margin-top: -10px;" src="https://cdn-icons-png.flaticon.com/512/5602/5602848.png" alt="">
                </div>
            </div>
        </vx-card>

        <!-- Contratos -->
        <vx-card class="red-card" @click="$router.push('/p_pedidos')" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div>
                <h2>Contratos</h2>
            </div>
            <div class="flex" style="justify-content: space-between;">
                <div class="flex" style="flex-direction: column;">
                    <span v-for="(tr, index) of datos" :key="index">
                        {{ tr.periodo }}: <b>{{ tr.contratos }}</b><br>
                    </span>
                </div>
                <div>
                    <img width="80" src="https://cdn-icons-png.flaticon.com/512/3967/3967160.png" alt="">
                </div>
            </div>
        </vx-card>

        <!-- Alcances Pendientes -->
        <vx-card class="red-card" @click="$router.push('/pedidos/alcanceListado')" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div><h2>Alcances Pendientes</h2>
            </div>
            <div class="flex" style="justify-content: space-between;">
                <div class="flex" style="flex-direction: column;">
                    <span v-for="(tr, index) of arrayAlcances" :key="index">
                        {{ tr.periodoescolar }}: <b>{{ tr.contadorAlcanceAbierto }}</b><br>
                    </span>
                </div>
                <div>
                    <img width="80" src="https://cdn-icons-png.flaticon.com/512/9794/9794711.png" alt="">
                </div>
            </div>
        </vx-card>

        <!-- Guias Pendientes -->
        <vx-card class="orange-card" @click="navegarYActivarMenu" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div>
                <h2>Guias</h2>
            </div>
            <div class="flex" style="justify-content: space-between;">
                <h3>Pendientes</h3>
                <b class="guias ml-1 mt-1">{{ cantidadGuias }}</b>
                <img width="80" style="margin-top: 5px;" src="https://cdn-icons-png.flaticon.com/512/6347/6347299.png" alt="">
            </div>
        </vx-card>

        <!-- Obsequios -->
        <vx-card class="purple-card" @click="ActivarMenu" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div>
                <h2>Obsequios</h2>
            </div>
            <div class="flex">
                <h3>Pendientes</h3>
                <b class="obsequios ml-1 mt-1">{{ cantidadObsequios }}</b>
                <img width="80" style="margin-top: 5px;" src="https://cdn-icons-png.flaticon.com/512/5313/5313961.png" alt="">
            </div>
        </vx-card>

        <!-- Libros Obsequios -->
        <vx-card class="green-card" @click="ActivarMenuLibrosObsequios" :style="{ cursor: 'pointer' }" :padding="true" :border="true" :shadow="true">
            <div>
                <h2>Libros hijos docentes</h2>
            </div>
            <div class="flex">
                <h3>Pendientes</h3>
                <b class="obsequiosLibros ml-1 mt-1">{{ cantidadObsequiosLibros }}</b>
                <img width="80" style="margin-top: 5px; margin: 4px; float: right;" src="https://cdn-icons-png.flaticon.com/512/1245/1245261.png" alt="">
            </div>
        </vx-card>
    </div>

    <vs-popup classContent="popup-example" fullscreen title="Mensajes asesor - facturador" :active.sync="popupNotificaciones" @close="RecargarNotificaciones()">
        <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" />
    </vs-popup>
</div>
</template>

<script>
import screenNotificacionVue from '../../pedidos/notificaciones/screenNotificacion.vue';
// import io from "socket.io-client";
import router from '@/router';
export default {
    components: {
        screenNotificacionVue,
    },
    data() {
        return {
            datos: [],
            cantidadMensajes: 0,
            popupNotificaciones: false,
            cambiarNotificacion: false,
            // socket: io(process.env.socket),
            arregloGuias: [],
            arregloObsequiosPorAprobar: [],
            cantidadGuias: 0,
            cantidadObsequios: 0,
            cantidadObsequiosLibros: 0,
            arregloObsequiosLibros: [],
            arrayAlcances: [],
            totalDevolucionesPendientes: 0,
        }
    },
    mounted() {
        localStorage.setItem('menuIndex', 0);
        let me = this;
        me.getDevolucionesPendentes()
        me.getDatos()
        me.getGuias()
        me.getLibrosObsequios()
        me.getObsequios()
        me.getAlcancesPendientes()
    },
    methods: {
        navegarYActivarMenu() {
            localStorage.setItem('menuIndex', 1);
            this.$router.push('/p_pedidos');
        },
        ActivarMenu() {
            localStorage.setItem('menuIndex', 2);
            this.$router.push('/p_pedidos');
        },
        ActivarMenuLibrosObsequios() {
            localStorage.setItem('menuIndex', 0);
            this.$router.push('/p_pedidos');
        },
        RecargarNotificaciones() {
            let me = this;
            me.cambiarNotificacion = !me.cambiarNotificacion
        },
        changeCantidadMensajes(e) {
            let me = this
            me.cantidadMensajes = e
        },
        getDatos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'pedidos?homeAdmin=yes')
                .then(function (res) {
                    me.datos = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getAlcancesPendientes() {
            let me = this;
            this.$http.get(this.$server_url + 'getAlcancesPendientes')
                .then(function (res) {
                    me.arrayAlcances = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');

                })
        },
        getGuias() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'get_pedidos_guias')
                .then(function (res) {
                    me.arregloGuias = res.data.filter(p => (p.estado_entrega == 0) && (p.estado == 1) && (p.pedido_facturacion === 1) && (p.facturacion_vee == '1'));
                    me.cantidadGuias = me.arregloGuias.length
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getLibrosObsequios() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getLibrosObsequiosGerencia')
                .then(function (res) {
                    me.arregloObsequiosPorAprobar = res.data.filter(l => (l.estado_libros_obsequios == 3 || l.estado_libros_obsequios == 4) && l.estado_libros_obsequios != 1);
                    me.cantidadObsequiosLibros = me.arregloObsequiosPorAprobar.length
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getDevolucionesPendentes() {
            let me = this;
            me.totalDevolucionesPendientes = 0
            this.$http.get(this.$server_url + 'devoluciones?filtroDocumentosDevueltos=1&revisados=1')
                .then(function (res) {
                    me.totalDevolucionesPendientes = res.data.length
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getObsequios() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'obsequio?listadoObsequiofacturador=yes')
                .then(function (res) {
                    let datos = res.data
                    if (datos.length > 0) {
                        me.arregloObsequiosLibros = datos.filter(p => p.pedido_facturacion == 1 && p.estado == 1)
                        me.cantidadObsequios = me.arregloObsequiosLibros.length
                    } else {
                        me.arregloObsequios = []
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        f_irDevoluciones() {
            let me = this
            localStorage.menuIndex = 5
            me.$router.push('/p_pedidos')
        },
    }

}
</script>
<style scoped>
.padre {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
     /* Ajusta el grid */
     gap: 15px;
     padding: 20px;
 }

 .green-card {
     /* background-color: #e8f5e9; */
     border-top: 3px solid hsl(98, 51%, 48%);
 }

 .cyan-card {
     /* background-color: #e0f7fa; */
     border-top: 3px solid hsl(180, 62%, 55%);
 }

 .red-card {
     /* background-color: #ffebee; */
     border-top: 3px solid hsl(0, 78%, 62%);
 }

 .orange-card {
     /* background-color: #fff3e0; */
     border-top: 3px solid hsl(34, 97%, 64%);
 }

 .purple-card {
     /* background-color: #f3e5f5; */
     border-top: 3px solid hsl(273, 93%, 60%);
 }

 .message_p {
     background: #06d755;
     color: #fff;
     min-width: 20px;
     height: 23px;
     border-radius: 50%;
     display: flex;
     justify-content: center;
     align-items: center;
     font-size: 18px;
     width: 23px;
 }

 .guias {
     background: #d77c06;
     color: #fff;
     min-width: 20px;
     height: 25px;
     border-radius: 50%;
     display: flex;
     justify-content: center;
     align-items: center;
     font-size: 18px;
     width: 25px;
 }

 .obsequios {
     background: #8c42ec;
     color: #fff;
     min-width: 20px;
     height: 25px;
     border-radius: 50%;
     display: flex;
     justify-content: center;
     align-items: center;
     font-size: 18px;
     width: 25px;
 }

 .obsequiosLibros {
     background: #4ec530;
     color: #fff;
     min-width: 20px;
     height: 25px;
     border-radius: 50%;
     display: flex;
     justify-content: center;
     align-items: center;
     font-size: 18px;
     width: 25px;
 }
</style>
