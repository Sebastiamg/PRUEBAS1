<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <!-- {{ erroresStock_Lista }} -->
        <table class="tabla-errores">
            <tbody v-for="(item, index) in erroresStock_Lista.detalles.stocks_insuficientes.detalles" :key="index">
                <tr>
                    <td colspan="3" align="center" class="celda-header">
                        <strong>{{ item.pro_codigo }} - ({{ item.pro_nombre }})</strong>
                    </td>
                </tr>
                <tr v-for="(error, i) in item.detalles" :key="i">
                    <td class="celda">
                        <strong>{{ error.campo }}</strong>
                    </td>
                    <td class="celda">
                        <span>Disponible: {{ error.disponible }}</span>
                    </td>
                    <td>
                        <span>Requerido: {{ error.requerido }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="getAceptarInformacion()" type="relief">Cerrar</vs-button>
    </vs-col>
</vs-row>
</template>

<script>
import vSelect from "vue-select";
export default {
    data() {
        return {
            //showAgregarNuevo: false,
            erroresStock_Lista_Modificado: '',
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
    mounted() {
        let me = this;
        console.log(me.erroresStock_Lista, "gdgdgdg");
        // Renombrar los campos
        const campoRenombrado = {
            "pro_reservar": "Stock General",
            "pro_deposito": "Stock Notas Prolipa",
            "pro_depositoCalmed": "Stock Notas Calmed",
            "pro_stock": "Stock Facturas Prolipa",
            "pro_stockCalmed": "Stock Facturas Calmed"
        };

        // Iteramos sobre los detalles y renombramos los campos
        this.erroresStock_Lista.detalles.stocks_insuficientes.detalles.forEach(item => {
            item.detalles.forEach(campo => {
                // Si el campo existe en el objeto de renombrado, lo reemplazamos
                if (campoRenombrado[campo.campo]) {
                    campo.campo = campoRenombrado[campo.campo];
                }
            });
        });

        console.log("Errores después del cambio:", this.erroresStock_Lista);
    },
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
