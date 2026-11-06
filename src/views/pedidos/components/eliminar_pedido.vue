<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-w="12" class="mb-4">
            <div align="center">
                <b style="font-size: 20px;">¿Está seguro de eliminar el pedido?</b><br><br>
                <div align="center">
                    <table align="center" style="font-weight: bold;" border="1">
                        <tr>
                            <td width="300">
                                -Beneficiario/s del pedido:
                            </td>
                            <td width="100">
                                {{ porcentajeRetencion.mensajebeneficiarios }}
                            </td>
                        </tr>
                        <tr>
                            <td width="300">
                                -Libros del pedido:
                            </td>
                            <td width="100">
                                {{ porcentajeRetencion.mensajeLibrosDelPedido }}
                            </td>
                        </tr>
                        <tr>
                            <td width="300">
                                -Libros hijos docentes/Obsequios:
                            </td>
                            <td width="100">
                                {{ porcentajeRetencion.mensajeLibrosHijosDocentes }}
                            </td>
                        </tr>
                        <tr>
                            <td width="300">
                                -Actas a partir de Libros hijos docentes/Obsequios:
                            </td>
                            <td width="100">
                                {{ porcentajeRetencion.mensajeActasHijosDocentes }}
                            </td>
                        </tr>
                        <tr>
                            <td width="300">
                                -Convenios del Pedido:
                            </td>
                            <td width="100">
                                {{ porcentajeRetencion.mensajeConvenios }}
                            </td>
                        </tr>
                        <tr>
                            <td width="300">
                                -Pagos del Pedido:
                            </td>
                            <td width="100">
                                {{ porcentajeRetencion.mensajePagos }}
                            </td>
                        </tr>
                    </table>
                </div>
                <br>
                <b style="color: red;"><i>Al eliminar este pedido todos los registros asociados se eliminarán.</i></b>
            </div>
        </vs-col>
        <vs-row vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4" class="mt-2">
                <vs-button @click="getEliminarPedidoCompleto()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-row>
    </vs-row>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            porcentajeRetencion: [],
            mixinIdInicioFormatoNewData: null,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        pedido: {
            type: Object,
            default: function () {
                return {}
            }
        },
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
        me.getVerificarPedido();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        getVerificarPedido() {
            let me = this;
            let variable_periodo = '';
            if (this.pedido.id_periodo <= me.mixinIdInicioFormatoNewData) {
                variable_periodo = 'formato_anterior';
            } else if (this.pedido.id_periodo > me.mixinIdInicioFormatoNewData) {
                variable_periodo = 'formato_new';
            }
            me.$vs.loading();
            let parametrosxfiltro = {
                id_pedido: me.pedido.id_pedido, // Especifica la acción
                id_periodo: me.pedido.id_periodo,
                validacionperiodo: variable_periodo
            };
            this.$http.get(this.$server_url + 'get_VerificacionAntesEliminarPedido', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    me.porcentajeRetencion = res.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        getEliminarPedidoCompleto() {
            let me = this;
            let variable_periodo = '';
            if (this.pedido.id_periodo <= me.mixinIdInicioFormatoNewData) {
                variable_periodo = 'formato_anterior';
            } else if (this.pedido.id_periodo > me.mixinIdInicioFormatoNewData) {
                variable_periodo = 'formato_new';
            }
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let datos = {
                id_pedido: me.pedido.id_pedido, // Especifica la acción
                id_periodo: me.pedido.id_periodo,
                id_usuario: usuarioObjeto.idusuario,
                validacionperiodo: variable_periodo
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "EliminarPedidoCompleto_SinContrato", datos)
                .then(data => {
                    me.$vs.loading.close()
                    // this.getContUserAgrupacionParametro();
                    me.$vs.notify({
                        text: 'Pedido eliminado con éxito.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: '7000'
                    })
                    me.$emit('change', {
                        verificacionemiteliminar: 1
                    });
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Pedido no se pudo eliminar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemiteliminar: 2
            });
        },
    },
};
</script>
