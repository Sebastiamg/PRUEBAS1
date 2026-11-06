<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información del Módulo</vs-divider>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-textarea style="width:100%; height: 100%;" label="Actualizar información" v-model="Actualizar_comentario" />
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarComentario()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
</vx-card>
</template>

<script>
export default {
    data() {
        return {
            Actualizar_comentario: '',
        };
    },
    props: {
        InformacionModulo: {
            type: String,
            default: '',
        },
    },
    mounted() {
        let me = this;
        me.Actualizar_comentario = me.InformacionModulo;
    },
    methods: {
        guardarComentario() {
            let me = this;
            me.$vs.loading()
            let datos = {
                action: "ActualizarComentarioReportesSemanales",
                "Actualizar_comentario": me.Actualizar_comentario,
            }
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_ReportesSemanales', datos)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == '1') {
                        me.$vs.notify({
                            text: 'Información actualizada con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificarinfoactualizar: 1
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                });
        },
        getCancelar() {
            this.$emit('change', {
                verificarinfoactualizar: 2
            });
        },
    },
};
</script>

