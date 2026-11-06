<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información del Módulo</vs-divider>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-textarea style="width:100%; height:100%;"
                label="Actualizar información"
                v-model="Actualizar_comentario" />
        </vs-col>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardar()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="$emit('change', { verificarinfoactualizar: 2 })" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br><br>
</vx-card>
</template>

<script>
export default {
    props: { InformacionModulo: { type: String, default: '' } },
    data() { return { Actualizar_comentario: '' }; },
    mounted() { this.Actualizar_comentario = this.InformacionModulo; },
    methods: {
        guardar() {
            let me = this;
            me.$vs.loading();
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_Memo', {
                action: 'ActualizarComentarioMemo',
                Actualizar_comentario: me.Actualizar_comentario,
            }).then(res => {
                me.$vs.loading.close();
                if (res.data.status == '1') {
                    me.$vs.notify({ text: 'Información actualizada con éxito', color: 'success', iconPack: 'feather', icon: 'icon-check' });
                    me.$emit('change', { verificarinfoactualizar: 1 });
                }
            }).catch(err => { me.$vs.loading.close(); console.log(err); });
        },
    },
};
</script>
