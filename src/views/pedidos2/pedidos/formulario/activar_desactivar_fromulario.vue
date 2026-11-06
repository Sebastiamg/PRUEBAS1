<template>
<vx-card fixed-height="true">
    <vs-row>
        <!-- {{ tabFormularioProforma }} -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="postActivarDesactivarFormularioProforma()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
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
            //showAgregarNuevo: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        tabFormularioProforma: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
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
        postActivarDesactivarFormularioProforma() {
            let me = this;
            let valornuevo = this.tabFormularioProforma.ffp_estado;
            // console.log(valornuevo+'valornuevoeatdoprocutp'+this.ffp_id);
            if (valornuevo == 1) {
                valornuevo = 0;
                let datos = {
                    "ffp_id": this.tabFormularioProforma.ffp_id,
                    "ffp_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url + 'Desactivar_formularioProfroma', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Formulario desactivada con exito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitdesactivar: 1
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo desactivar el formulario.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            } else if (valornuevo == 0) {
                valornuevo = 1;
                let datos = {
                    "ffp_id": this.tabFormularioProforma.ffp_id,
                    "ffp_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url + 'Desactivar_formularioProfroma', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Formulario activada con exito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitdesactivar: 1
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo activar el formulario.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            }
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitdesactivar: 2
            });
        },
    },
};
</script>
