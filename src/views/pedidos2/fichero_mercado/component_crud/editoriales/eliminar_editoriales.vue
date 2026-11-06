<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <!-- Ícono + Texto informativo en la misma línea -->
        <div class="flex items-center justify-center gap-3 flex-wrap mb-4 px-4">
            <ion-icon name="trash-outline" class="text-red-500 text-4xl transition-all duration-300"></ion-icon>

            <p class="text-gray-600 text-base leading-relaxed max-w-lg text-left">
                ⚠️ Al eliminar esta editorial, esta dejará de aparecer en las editoriales del fichero.
                Además, se eliminarán todas las asociaciones existentes con registros que la hayan
                seleccionado previamente. Esta acción es irreversible.
            </p>
        </div>

        <!-- Contenedor de botones -->
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="getEliminar_Editoriales()" type="relief">
                Aceptar
            </vs-button>
            <vs-button @click="getCancelar()" color="danger" type="relief">
                Cancelar
            </vs-button>
        </div>
    </div>
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
        tab_Editoriales: {
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
        getEliminar_Editoriales() {
            let me = this;
            let datos = {
                action: "Post_Eliminar_Editoriales",
                "edi_id": this.tab_Editoriales.edi_id,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "VerifcarMetodosPost_Editoriales", datos)
                .then(data => {
                    me.$vs.loading.close()
                    // this.getContUserAgrupacionParametro();
                    me.$vs.notify({
                        text: 'Editorial eliminada con éxito.',
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
                        text: 'Editorial no se pudo eliminar.',
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
