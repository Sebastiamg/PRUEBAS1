<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <!-- Ícono + Texto informativo en la misma línea -->
        <div class="flex items-center justify-center gap-3 flex-wrap mb-4 px-4">
            <ion-icon name="trash-outline" class="text-red-500 text-4xl transition-all duration-300"></ion-icon>

            <p class="text-gray-600 text-base leading-relaxed max-w-lg text-left">
                ⚠️ Al eliminar este reporte semanal, dejará de aparecer en la lista y se borrarán de forma irreversible todos los detalles de horas cargados.
                Esta acción no se puede deshacer.
            </p>
        </div>

        <!-- Contenedor de botones -->
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="getEliminar_Reporte()" type="relief">
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
import { mapState } from "vuex";

export default {
    data() {
        return {};
    },
    props: {
        tab_Reporte: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        getEliminar_Reporte() {
            let me = this;
            let datos = {
                action: "Post_Eliminar_ReportesSemanales",
                tre_id: this.tab_Reporte.tre_id,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "VerifcarMetodosPost_ReportesSemanales", datos)
                .then(data => {
                    me.$vs.loading.close()
                    if (data.data.status === 1) {
                        me.$vs.notify({
                            text: 'Reporte eliminado con éxito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemiteliminar: 1
                        });
                    } else {
                        me.$vs.notify({
                            text: data.data.message || 'Reporte no se pudo eliminar.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Ocurrió un error en el servidor.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
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
