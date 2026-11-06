<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <!-- Ícono + Mensaje en la misma línea -->
        <div class="flex items-start justify-center gap-3 mb-4 px-4 max-w-full">
            <ion-icon :name="tab_Reporte && tab_Reporte.tre_estado == '0' ? 'checkmark-circle-outline' : 'alert-circle-outline'" :class="[
              'text-4xl md:text-5xl transition-all duration-300', tab_Reporte && tab_Reporte.tre_estado == '0' ? 'text-green-500' : 'text-red-500']"></ion-icon>
            <p class="text-gray-700 text-sm md:text-base leading-relaxed max-w-md text-left">
                {{ tab_Reporte && tab_Reporte.tre_estado == '0'
                    ? 'Al reactivarlo, el reporte volverá a estar disponible para edición.'
                    : 'Al anularlo, el reporte seguirá en la lista y se podrá imprimir, pero no se podrá editar.'
                }}
            </p>
        </div>
        <!-- Contenedor de botones -->
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="postActivarDesactivar_Reporte()" type="relief">
                {{tab_Reporte && tab_Reporte.tre_estado == '0' ? 'Reactivar' : 'Anular'}}
            </vs-button>
            <vs-button @click="getCancelar()" color="danger" type="relief">
                Cancelar
            </vs-button>
        </div>
    </div>
</vx-card>
</template>

<script>
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
    methods: {
        postActivarDesactivar_Reporte() {
            let me = this;
            const nuevoEstado = (this.tab_Reporte.tre_estado == '1' || this.tab_Reporte.tre_estado == '2') ? '0' : '1';
            let datos = {
                action: "Desactivar_ReportesSemanales",
                tre_id: this.tab_Reporte.tre_id,
                tre_estado: nuevoEstado
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "VerifcarMetodosPost_ReportesSemanales", datos)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status === 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitdesactivar: 1
                        });
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Reporte no se pudo modificar.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    }
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error en el servidor.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitdesactivar: 2
            });
        },
    },
};
</script>
