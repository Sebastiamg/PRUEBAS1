<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <!-- Ícono + Mensaje en la misma línea -->
        <div class="flex items-start justify-center gap-3 mb-4 px-4 max-w-full">
            <ion-icon :name="tab_Institucion_Autoridades && tab_Institucion_Autoridades.ina_estado == '0' ? 'checkmark-circle-outline' : 'alert-circle-outline'" :class="[
              'text-4xl md:text-5xl transition-all duration-300', tab_Institucion_Autoridades && tab_Institucion_Autoridades.ina_estado == '0' ? 'text-green-500' : 'text-red-500']"></ion-icon>
            <p class="text-gray-700 text-sm md:text-base leading-relaxed max-w-md text-left">
                {{ tab_Institucion_Autoridades && tab_Institucion_Autoridades.ina_estado == '0'
                    ? 'Al activarlo, se listará en los cargos de autoridades del módulo del fichero.'
                    : 'Al inactivar, no se listará en los cargos de autoridades del módulo del fichero.'
                }}
            </p>
        </div>
        <!-- Contenedor de botones -->
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="postActivarDesactivar_Institucion_Autoridades()" type="relief">
                {{tab_Institucion_Autoridades && tab_Institucion_Autoridades.ina_estado == '0' ? 'Activar' : 'Inactivar'}}
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
        postActivarDesactivar_Institucion_Autoridades() {
            const me = this;
            const estadoActual = this.tab_Institucion_Autoridades.ina_estado;
            const nuevoEstado = estadoActual === '1' ? '0' : '1';
            const datos = {
                action: "Desactivar_Institucion_Autoridades",
                ina_id: this.tab_Institucion_Autoridades.ina_id,
                ina_estado: nuevoEstado,
            };
            me.$vs.loading();
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_Institucion_Autoridades', datos)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                        });
                        me.$emit('change', {
                            verificacionemitdesactivar: 1
                        });
                        me.tab_Institucion_Autoridades.ina_estado = nuevoEstado;
                    } else if (res.data.status === 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                        });
                    } else {
                        // Otros posibles estados
                        me.$vs.notify({
                            text: message || 'Respuesta desconocida del servidor.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.error(error);
                    me.$vs.notify({
                        text: 'Ocurrió un error inesperado.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                });
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitdesactivar: 2
            });
        },
    },
};
</script>
