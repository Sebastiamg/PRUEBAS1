<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table>
            <tr>
                <td>
                    <div align="center">{{InformacionFormularioProforma}}</div>
                </td>
                <td>
                    <!-- <vs-tooltip text="Hola" position="left"> -->
                    <vs-tooltip text="Editar">
                        <template>‎</template>
                        <vs-button flat style="float: right;" color="primary" type="border" icon="edit" title="Editar" v-if="userRoot" @click="getFormularioProformaInformacion()"></vs-button>
                    </vs-tooltip>
                </td>
            </tr>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <br>
        <vs-button @click="getAceptarInformacion()" type="relief">Cerrar</vs-button>
    </vs-col>
    <vs-popup v-if="userRoot" class="informacionformhijodehijo" @close="getFormularioProforma_Informacion();" title="Actualizar Información" :active.sync="popupGuardarEditarInformacionFormularioProforma">
        <ActualizarInformacion v-if="popupGuardarEditarInformacionFormularioProforma" :InformacionFormularioProforma="InformacionFormularioProforma" @change="changeHandleActualizarInfoFormularioProforma" />
    </vs-popup>
</vs-row>
</template>

<script>
const ActualizarInformacion = () => import("@/views/pedidos2/pedidos/formulario/informacionedicion_fromulario.vue");
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            //showAgregarNuevo: false,
            InformacionFormularioProforma: '',
            popupGuardarEditarInformacionFormularioProforma: false,
        };
    },
    components: {
        "v-select": vSelect,
        ActualizarInformacion,
    },
    mounted() {
        // let me = this;
        this.getFormularioProforma_Informacion();
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
        getFormularioProforma_Informacion() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetTablaComentarioformularioProforma')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.InformacionFormularioProforma = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getFormularioProformaInformacion() {
            this.popupGuardarEditarInformacionFormularioProforma = true;
            // this.$emit('change', {
            //     verificacionemitinformacion: 2
            // });
        },
        getAceptarInformacion() {
            this.$emit('change', {
                verificacionemitinformacion: 2
            });
        },
        changeHandleActualizarInfoFormularioProforma(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificarinfoactualizar); // Debería imprimir 1
            if (e.verificarinfoactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarInformacionFormularioProforma = false;
                me.getFormularioProforma_Informacion();
            } else if (e.verificarinfoactualizar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarInformacionFormularioProforma = false;
                me.getFormularioProforma_Informacion();
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
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}
</style>
