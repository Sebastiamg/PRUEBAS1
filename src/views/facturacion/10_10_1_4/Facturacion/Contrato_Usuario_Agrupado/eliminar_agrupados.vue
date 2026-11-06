<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminarContUserAgrupados()" type="relief">Aceptar</vs-button>
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
        tabContUserAgrupacion: {
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
        getEliminarContUserAgrupados() {
            let me = this;
            let datos = {
                "fcu_id": this.tabContUserAgrupacion.fcu_id,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Post_Eliminar_contrato_usuario", datos)
                .then(data => {
                    me.$vs.loading.close()
                    // this.getContUserAgrupacionParametro();
                    me.$vs.notify({
                        text: 'Agrupado eliminado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$emit('change', {
                        verificacionemiteliminar: 1
                    });
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Agrupado no se pudo eliminar',
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
