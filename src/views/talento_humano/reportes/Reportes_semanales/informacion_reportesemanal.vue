<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table>
            <tr>
                <td>
                    <div align="center" style="white-space: pre-wrap;">{{InformacionModulo}}</div>
                </td>
                <td>
                    <vs-tooltip text="Editar">
                        <template>‎</template>
                        <vs-button flat style="float: right;" color="primary" type="border" icon="edit" title="Editar" v-if="userRoot" @click="getModuloInformacion()"></vs-button>
                    </vs-tooltip>
                </td>
            </tr>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <br>
        <vs-button @click="getAceptarInformacion()" type="relief">Cerrar</vs-button>
    </vs-col>
    <vs-popup class="informacionformhijodehijo" @close="getModulo_Informacion();" title="Actualizar Información" :active.sync="popupGuardarEditarInformacionModulo">
        <ActualizarInformacion v-if="popupGuardarEditarInformacionModulo" :InformacionModulo="InformacionModulo" @change="changeHandleActualizarInfoModulo" />
    </vs-popup>
</vs-row>
</template>

<script>
const ActualizarInformacion = () => import("@/views/talento_humano/reportes/Reportes_semanales/informacionedicion_reportesemanal.vue");

export default {
    data() {
        return {
            InformacionModulo: '',
            popupGuardarEditarInformacionModulo: false,
        };
    },
    components: {
        ActualizarInformacion,
    },
    props: {
        userRoot: {
            type: Boolean,
            default: false
        },
    },
    mounted() {
        this.getModulo_Informacion();
    },
    methods: {
        getModulo_Informacion() {
            let me = this;
            me.$vs.loading()
            const datos = {
                action: "GetTablaComentarioReportesSemanales",
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_ReportesSemanales', {
                    params: datos
                })
                .then(res => {
                    this.InformacionModulo = res.data;
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getModuloInformacion() {
            this.popupGuardarEditarInformacionModulo = true;
        },
        getAceptarInformacion() {
            this.$emit('change', {
                verificacionemitinformacion: 2
            });
        },
        changeHandleActualizarInfoModulo(e) {
            let me = this;
            if (e.verificarinfoactualizar == 1) {
                me.popupGuardarEditarInformacionModulo = false;
                me.getModulo_Informacion();
            } else if (e.verificarinfoactualizar == 2) {
                me.popupGuardarEditarInformacionModulo = false;
                me.getModulo_Informacion();
            }
        },
    },
};
</script>

<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
}
</style>
