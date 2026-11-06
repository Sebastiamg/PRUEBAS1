<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table>
            <tr>
                <td>
                    <div align="center" style="white-space: pre-wrap;">{{ InformacionModulo }}</div>
                </td>
                <td>
                    <vs-button flat style="float:right;" color="primary" type="border" icon="edit" v-if="userRoot" @click="popupEditar = true"></vs-button>
                </td>
            </tr>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <br>
        <vs-button @click="$emit('change', { verificacionemitinformacion: 2 })" type="relief">Cerrar</vs-button>
    </vs-col>
    <vs-popup class="informacionformhijodehijo" @close="getModulo_Informacion()" title="Actualizar Información" :active.sync="popupEditar">
        <EditarInfo v-if="popupEditar" :InformacionModulo="InformacionModulo" @change="changeHandleEditar" />
    </vs-popup>
</vs-row>
</template>
<script>
const EditarInfo = () => import("@/views/talento_humano/reportes/Permisos_vacaciones/informacionedicion_permisovacacion.vue");
export default {
    components: { EditarInfo },
    props: { userRoot: { type: Boolean, default: false } },
    data() { return { InformacionModulo: '', popupEditar: false }; },
    mounted() { this.getModulo_Informacion(); },
    methods: {
        getModulo_Informacion() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Permisos', { params: { action: 'GetTablaComentarioPermisos' } })
                .then(res => { this.InformacionModulo = res.data; me.$vs.loading.close(); })
                .catch(err => { console.log(err); me.$vs.loading.close(); });
        },
        changeHandleEditar(e) {
            this.popupEditar = false;
            this.getModulo_Informacion();
        },
    },
};
</script>
<style scoped>.informacionformhijodehijo { z-index: 51002; }</style>
