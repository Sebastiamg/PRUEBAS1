<template>
<vs-row align="center">
    <div align="center">
        <div style="font-style: italic; color: #444; background-color: #fff8e1; padding: 10px; border-left: 5px solid #f1c40f; border-radius: 5px;">
            ⚠️ <strong>El stock de algunos productos ha cambiado.</strong><br>
            Haga clic en <span style="color: #2c3e50;"><u><strong>"Actualizar Stock"</strong></u></span> para reflejar los valores actualizados.<br>
            <span style="color: #c0392b;"><strong>Nota:</strong></span> Verifique que la opción <u><strong>“¿Activar todo el stock disponible?”</strong></u> esté activada, se encuentra debajo de este panel.
        </div>
    </div>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table class="tabla-errores">
            <tbody>
                <tr>
                    <td align="center" class="celda-header">
                        <strong>{{ erroresStock_Lista.message }}</strong>
                    </td>
                </tr>
                <tr v-for="(error, i) in erroresStock_Lista.errores" :key="i">
                    <td>
                        <ul>
                            <li>{{ error }}</li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-6">
        <vs-button @click="getAceptarInformacion()" type="relief">Actualizar Stock</vs-button>
    </vs-col>
</vs-row>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {
            //showAgregarNuevo: false,
            // erroresStock_Lista_Modificado: '',
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        erroresStock_Lista: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {},
    methods: {
        getAceptarInformacion() {
            this.$emit('change', {
                verificacionemitdeerrorlistado: 2
            });
        },
    },
};
</script>

<style scoped>
.tabla-errores {
    border-collapse: collapse;
    width: 100%;
}

.tabla-errores td {
    padding: 4px;
    /* Espacio dentro de cada celda */
    border: 1px solid #ddd;
    /* Borde ligero */
}

.celda-header {
    background-color: #f4f4f4;
    font-weight: bold;
    text-align: center;
}
</style>
