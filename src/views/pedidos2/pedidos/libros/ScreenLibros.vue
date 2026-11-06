<template>
<div>
    <div v-if="sendPedido.id_pedido > 0 && sendPedido.id_periodo <= mixinIdInicioFormatoNewData">
        <form_librosVue @rechargePedido="$emit('rechargePedido',true)" :tmpPedidos="sendPedido" :selectifanticipo="Boolean(sendPedido.ifanticipo)" :anticipoAprobado="sendPedido.anticipo_aprobado == null || sendPedido.anticipo_aprobado == undefined ? 0 : (sendPedido.anticipo_aprobado == sendPedido.deuda ? sendPedido.anticipo_aprobado : sendPedido.anticipo_aprobado - sendPedido.deuda)" />
        <br><br><br>
    </div>
    <div v-else-if="sendPedido.id_pedido > 0 && sendPedido.id_periodo > mixinIdInicioFormatoNewData">
        <form_libros_NEWVue @rechargePedido="$emit('rechargePedido',true)" :tmpPedidos="sendPedido" :selectifanticipo="Boolean(sendPedido.ifanticipo)" :anticipoAprobado="sendPedido.anticipo_aprobado == null || sendPedido.anticipo_aprobado == undefined ? 0 : (sendPedido.anticipo_aprobado == sendPedido.deuda ? sendPedido.anticipo_aprobado : sendPedido.anticipo_aprobado - sendPedido.deuda)" />
        <br><br><br>
    </div>
    <!--GENERAR CONTRATO-->
    <div class="flex justify-center">
        <vs-button type="relief" v-if="groupFacturador && (sendPedido.contrato_generado == 'null' || sendPedido.contrato_generado == null)" @click="seleccion_GeneracionContrato()">Generar Contrato</vs-button>
    </div>
    <br><br><br><br><br><br><br><br><br><br>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
const form_librosVue = () => import('../../../pedidos/form_libros.vue')
const form_libros_NEWVue = () => import('../../../pedidos/form_libros_new.vue')
export default {
    components: {
        form_librosVue,
        form_libros_NEWVue,
    },
    data() {
        return {
            sendPedido: '',
            usuario: [],
            mixinIdInicioFormatoNewData: null,
        }
    },
    watch: {
        ObjectPedido(results) {
            this.sendPedido = results
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'ObjectPedido', 'groupFacturador']),
    },
    mounted() {
        let me = this;
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');            
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
        me.sendPedido = me.ObjectPedido
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    methods: {
      seleccion_GeneracionContrato() {
            let me = this;
            console.log(me.sendPedido.id_periodo, "heyy");
            if (me.sendPedido.id_periodo <= me.mixinIdInicioFormatoNewData) {
                me.generarContrato();
            } else if (me.sendPedido.id_periodo > me.mixinIdInicioFormatoNewData) {
                me.generarContrato_new();
            }
        },
        generarContrato() {
            let me = this;
            const usuariorespo = me.sendPedido.iniciales
            if (!usuariorespo) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Error`,
                    cancelText: 'Cancelar',
                    text: 'Asesor sin iniciales, no puede generar Contrato. Comuniquese con el equipo de soporte.',
                })
                return
            } else {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: `Confirmar`,
                    acceptText: 'Si, deseo generar el contrato',
                    cancelText: 'Cancelar',
                    text: '¿Está seguro de guardar el contrato para este pedido?',
                    accept: this.confirmGenerarContrato
                })
            }
        },
        async confirmGenerarContrato() {
            let me = this
            const {
                contrato_generado
            } = me.sendPedido
            if (contrato_generado == null || contrato_generado == "" || contrato_generado == "null") {} else {
                me.$vs.notify({
                    time: 8000,
                    text: 'Este pedido ya tiene un contrato generado: ' + me.sendPedido.contrato_generado,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            await me.$http.get(me.$server_url + 'generar_contrato_pedido/' + me.sendPedido.id_pedido + '/' + me.usuario.idusuario)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            time: 8000,
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    if (res.data.error) {
                        me.$vs.notify({
                            time: 8000,
                            text: res.data.error,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.$vs.notify({
                        time: 8000,
                        text: 'Se creo correctamente el contrato: ' + res.data,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })

                    me.$emit('rechargePedido', true)
                })
                .catch(err => {
                    me.$vs.notify({
                        time: 4000,
                        text: 'Error al generar el contrato.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        generarContrato_new() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: `Confirmar`,
                acceptText: 'Si, deseo generar el contrato',
                cancelText: 'Cancelar',
                text: '¿Está seguro de guardar el contrato para este pedido?',
                accept: this.confirmGenerarContrato_new
            })
        },
        async confirmGenerarContrato_new() {
            let me = this
            const {
                contrato_generado
            } = me.sendPedido
            if (contrato_generado == null || contrato_generado == "" || contrato_generado == "null") {} else {
                me.$vs.notify({
                    time: 8000,
                    text: 'Este pedido ya tiene un contrato generado: ' + me.sendPedido.contrato_generado,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            await me.$http.get(me.$server_url + 'generar_contrato_pedido_new/' + me.sendPedido.id_pedido + '/' + me.usuario.idusuario)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            time: 8000,
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    if (res.data.error) {
                        me.$vs.notify({
                            time: 8000,
                            text: res.data.error,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.$vs.notify({
                        time: 8000,
                        text: 'Se creo correctamente el contrato: ' + res.data,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })

                    me.$emit('rechargePedido', true)
                })
                .catch(err => {
                    me.$vs.notify({
                        time: 4000,
                        text: 'Error al generar el contrato.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
    }
}
</script>
