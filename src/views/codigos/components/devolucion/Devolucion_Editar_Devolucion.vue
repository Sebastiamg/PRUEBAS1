<template>
<vx-card fixed-height="true">
    <vs-row>
        <!-- <vs-divider>Información</vs-divider> -->
        <!-- {{ enviardataEdicion }} -->
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-lg="10" vs-sm="10" vs-xs="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Cantidad Paquetes" placeholder="Cantidad Paquetes" class="w-full" @blur="asignarCeroSiVacio('cantidadPaquetes')" icon="mode_edit" v-model="nuevoarray.cantidadPaquetes" @keypress="validarkey_pvn_cantidad($event)" @paste="validarnopegar($event)" maxlength="4" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="10" vs-xs="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Cantidad Cajas" placeholder="Cantidad Cajas" class="w-full" @blur="asignarCeroSiVacio('cantidadCajas')" icon="mode_edit" v-model="nuevoarray.cantidadCajas" @keypress="validarkey_pvn_cantidad($event)" @paste="validarnopegar($event)" maxlength="4" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <br>
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="11" vs-sm="11" vs-xs="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-textarea label="Observación" v-model="nuevoarray.observacion" />
                        <!-- <vs-textarea label="Relato Completo" v-model="nuevoarray.jhi_relato" /> -->
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditarProveedor()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
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
            nuevoarray: [],
            usuarioeditor: null,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        enviardataEdicion: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        me.nuevoarray = me.enviardataEdicion;
        me.usuarioeditor = JSON.parse(localStorage.getItem('usuario'));
        // me.getHistoriaCompleta();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        validarkey_pvn_cantidad(event) {
            // Permite solo números y evita cualquier otro tipo de entrada.
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
            }
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        guardarnuevoeditarProveedor() {
            let me = this;
            this.$vs.loading();
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            // console.log("entro a crear");
            let datos = {
                "codigo_devolucion": this.nuevoarray.codigo_devolucion,
                "cantidadCajas": this.nuevoarray.cantidadCajas,
                "cantidadPaquetes": this.nuevoarray.cantidadPaquetes,
                "observacion": this.nuevoarray.observacion,
                "user_edit_cabecera": this.usuarioeditor.idusuario,
            }
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'Post_modificar_cabecera_devolucion', datos)
                .then(res => {
                    me.$vs.loading.close()
                    // this.getContUserAgrupacionParametro();
                    me.$vs.notify({
                        text: 'Cabecera editada con éxito.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('change', {
                        verificacionemitsaveandedit: 1
                    });
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                });
        },
        asignarCeroSiVacio(campo) {
            // Si el campo está vacío, asigna 0 al valor.
            if (!this.nuevoarray[campo]) {
                this.nuevoarray[campo] = 0;
            }
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
    },
};
</script>

<style scoped>
.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
