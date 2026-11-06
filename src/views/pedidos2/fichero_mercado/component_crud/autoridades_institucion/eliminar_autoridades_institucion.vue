<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <!-- Ícono + Texto informativo en la misma línea -->
        <div class="flex items-center justify-center gap-3 flex-wrap mb-4 px-4">
            <ion-icon name="trash-outline" class="text-red-500 text-4xl transition-all duration-300"></ion-icon>
            <p class="text-gray-600 text-base leading-relaxed max-w-lg text-left">
                ⚠️ Al eliminar este cargo, esta dejará de aparecer en los cargos de autoridades del fichero.
                Además, se eliminarán todas las asociaciones existentes con registros que la hayan
                seleccionado previamente. Esta acción es irreversible.
            </p>
        </div>
        <!-- Contenedor de botones -->
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="getEliminar_Institucion_Autoridades()" type="relief">
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
        tab_Institucion_Autoridades: {
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
        getEliminar_Institucion_Autoridades() {
            let me = this;
            let datos = {
                action: "Post_Eliminar_Institucion_Autoridades",
                "ina_id": this.tab_Institucion_Autoridades.ina_id,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "VerifcarMetodosPost_Institucion_Autoridades", datos)
                .then(response => {
                    me.$vs.loading.close()
                    if (response.data.status === 1) {
                        // Éxito
                        me.$vs.notify({
                            text: response.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', {
                            verificacionemiteliminar: 1
                        });
                    } else if (response.data.status === 0 && mensaje.includes('Integrity constraint') && mensaje.includes('fichero_mercado_autoridades')) {
                        // Mensaje amigable para foreign key
                        me.$vs.notify({
                            text: 'No se puede eliminar el cargo porque ya está siendo utilizado en el Fichero de Mercado.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            time: 6000
                        })
                    }
                })
                .catch(error => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Ocurrió un error en la petición.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    console.error(error)
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
