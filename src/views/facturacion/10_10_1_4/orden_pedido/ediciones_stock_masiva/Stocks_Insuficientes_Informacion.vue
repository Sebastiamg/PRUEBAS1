<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table class="tabla-errores">
            <tbody v-for="(item, index) in erroresStock_Lista.errores" :key="index">
                <tr>
                    <td align="center" class="celda-header"><strong>{{ item.pro_codigo }} - ({{ item.pro_nombre }})</strong></td>
                </tr>
                <tr v-for="(error, i) in item.errores" :key="i">
                    <td colspan="2">
                        <ul>
                            <li>
                                {{ error }}
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <br>
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

        // Diccionario de reemplazo con expresiones regulares
        let nombresMap = {
            "pro_reservar": "Stock General",
            "pro_deposito": "Stock Notas Prolipa",
            "pro_depositoCalmed": "Stock Notas Calmed",
            "pro_stock": "Stock Facturas Prolipa",
            "pro_stockCalmed": "Stock Facturas Calmed"
        };
        // Modificar los errores con los nombres correctos
        me.erroresStock_Lista.errores = me.erroresStock_Lista.errores.map(item => {
            return {
                ...item,
                errores: item.errores.map(error => {
                    for (let key in nombresMap) {
                        let regex = new RegExp(`\\b${key}\\b`, 'g'); // Asegura que sea la palabra completa
                        if (regex.test(error)) {
                            return error.replace(regex, nombresMap[key]);
                        }
                    }
                    return error; // Si no hay coincidencia, devolver el mismo error
                })
            };
        });
        console.log(me.erroresStock_Lista, "Errores Modificados Lista");
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
