<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table>
            <tr>
                <td>
                    <div align="center">{{InformacionProveedor}}</div>
                </td>
                <td>
                    <!-- <vs-tooltip text="Hola" position="left"> -->
                    <vs-tooltip text="Editar">
                        <template>‎</template>
                        <vs-button flat style="float: right;" color="primary" type="border" icon="edit" title="Editar" v-if="userRoot" @click="getProveedorInformacion()"></vs-button>
                    </vs-tooltip>
                </td>
            </tr>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <br>
        <vs-button @click="getAceptarInformacion()" type="relief">Cerrar</vs-button>
    </vs-col>
    <vs-popup class="informacionformhijodehijo" @close="getProveedor_Informacion();" title="Actualizar Información" :active.sync="popupGuardarEditarInformacionProveedor">
        <ActualizarInformacion v-if="popupGuardarEditarInformacionProveedor" :InformacionProveedor="InformacionProveedor" @change="changeHandleActualizarInfoProveedor" />
    </vs-popup>
</vs-row>
</template>

<script>
const ActualizarInformacion = () => import("@/views/talento_humano/configuracion/departamentos_prolipa/informacionedicion_departamentos_prolipa.vue");
import vSelect from "vue-select";
export default {
    data() {
        return {
            //showAgregarNuevo: false,
            InformacionProveedor: '',
            popupGuardarEditarInformacionProveedor: false,
        };
    },
    components: {
        "v-select": vSelect,
        ActualizarInformacion,
    },
    props: {
        userRoot: {
            type: Boolean,
            default: ''
        },
    },
    mounted() {
        // let me = this;
        this.getProveedor_Informacion();
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        getProveedor_Informacion() {
            let me = this;
            me.$vs.loading()
            const datos = {
                action: "GetTablaComentarioDepartamentosProlipa",
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_DepartamentosProlipa', {
                    params: datos
                })
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.InformacionProveedor = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getProveedorInformacion() {
            this.popupGuardarEditarInformacionProveedor = true;
            // this.$emit('change', {
            //     verificacionemitinformacion: 2
            // });
        },
        getAceptarInformacion() {
            this.$emit('change', {
                verificacionemitinformacion: 2
            });
        },
        changeHandleActualizarInfoProveedor(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificarinfoactualizar); // Debería imprimir 1
            if (e.verificarinfoactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarInformacionProveedor = false;
                me.getProveedor_Informacion();
            } else if (e.verificarinfoactualizar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarInformacionProveedor = false;
                me.getProveedor_Informacion();
            } else {
                console.log("Emit no recibido");
            }
        },
    },
};
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
    /* Valor mayor que el del popup del padre */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>


