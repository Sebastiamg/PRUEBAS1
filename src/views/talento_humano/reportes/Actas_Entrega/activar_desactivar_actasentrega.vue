<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <div class="flex items-start justify-center gap-3 mb-4 px-4 max-w-full">
            <ion-icon :name="tab_ActaEntrega && tab_ActaEntrega.tae_estado == '0' ? 'checkmark-circle-outline' : 'alert-circle-outline'" :class="[
              'text-4xl md:text-5xl transition-all duration-300', tab_ActaEntrega && tab_ActaEntrega.tae_estado == '0' ? 'text-green-500' : 'text-red-500']"></ion-icon>
            <p class="text-gray-700 text-sm md:text-base leading-relaxed max-w-md text-left">
                <strong>{{ tab_ActaEntrega.tae_numero_acta }}</strong><br>
                {{ tab_ActaEntrega && tab_ActaEntrega.tae_estado == '0'
                    ? 'Al reactivarla, el acta volverá a estar disponible para edición e impresión.'
                    : 'Al anularla, el acta seguirá en la lista y se podrá imprimir, pero no se podrá editar.'
                }}
            </p>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="postActivarDesactivar()" type="relief">
                {{ tab_ActaEntrega && tab_ActaEntrega.tae_estado == '0' ? 'Reactivar' : 'Anular' }}
            </vs-button>
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </div>
    </div>
</vx-card>
</template>

<script>
export default {
    props: { tab_ActaEntrega: { type: Object, default: () => ({}) } },
    methods: {
        postActivarDesactivar() {
            let me = this;
            const nuevoEstado = (this.tab_ActaEntrega.tae_estado == '1' || this.tab_ActaEntrega.tae_estado == '2') ? '0' : '1';
            me.$vs.loading();
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_ActaEntrega', {
                action: 'Desactivar_ActaEntrega',
                tae_id: this.tab_ActaEntrega.tae_id,
                tae_estado: nuevoEstado,
            }).then(res => {
                me.$vs.loading.close();
                if (res.data.status === 1) {
                    me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' });
                    me.$emit('change', { verificacionemitdesactivar: 1 });
                } else {
                    me.$vs.notify({ text: res.data.message || 'No se pudo modificar.', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                }
            }).catch(() => {
                me.$vs.loading.close();
                me.$vs.notify({ text: 'Error en el servidor.', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
            });
        },
        getCancelar() { this.$emit('change', { verificacionemitdesactivar: 2 }); },
    },
};
</script>
