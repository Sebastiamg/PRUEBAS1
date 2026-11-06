<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">
        <div class="flex items-center justify-center gap-3 flex-wrap mb-4 px-4">
            <p class="text-gray-600 text-base leading-relaxed max-w-lg text-left">
                ⚠️ Al eliminar el acta <strong>{{ tab_ActaEntrega.tae_numero_acta }}</strong>,
                se borrarán de forma irreversible todos sus ítems de detalle.
                Esta acción no se puede deshacer.
            </p>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </div>
    </div>
</vx-card>
</template>

<script>
export default {
    props: { tab_ActaEntrega: { type: Object, default: () => ({}) } },
    methods: {
        getEliminar() {
            let me = this;
            me.$vs.loading();
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_ActaEntrega', {
                action: 'Post_Eliminar_ActaEntrega',
                tae_id: this.tab_ActaEntrega.tae_id,
            }).then(data => {
                me.$vs.loading.close();
                if (data.data.status === 1) {
                    me.$vs.notify({ text: 'Acta eliminada con éxito.', color: 'success', iconPack: 'feather', icon: 'icon-check' });
                    me.$emit('change', { verificacionemiteliminar: 1 });
                } else {
                    me.$vs.notify({ text: data.data.message || 'No se pudo eliminar.', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                }
            }).catch(() => {
                me.$vs.loading.close();
                me.$vs.notify({ text: 'Error en el servidor.', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
            });
        },
        getCancelar() { this.$emit('change', { verificacionemiteliminar: 2 }); },
    },
};
</script>
