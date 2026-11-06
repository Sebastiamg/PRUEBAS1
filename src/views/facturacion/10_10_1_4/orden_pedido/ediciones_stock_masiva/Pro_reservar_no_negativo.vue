<template>
<vs-row align="center">
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <table class="tabla-errores">
            <thead>
                <tr>
                    <th class="celda-header">Producto</th>
                    <th class="celda-header">Detalle del error</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(error, index) in lista_pro_reservar_negativos" :key="index">
                    <!-- Columna 1: (codigo) nombre -->
                    <td class="col-producto">
                        {{ error.codigo }}
                        <br>({{ error.nombre }})
                    </td>
                    <!-- Columna 2: mensaje + cantidad negativa -->
                    <td>
                        {{ error.mensaje }}
                        <strong>Quedaría en {{ error.nuevo_reservar }}</strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="getAceptarInformacion()" type="relief">Cerrar y Actualizar Valores</vs-button>
    </vs-col>
</vs-row>
</template>

<script>
export default {
    props: {
        lista_pro_reservar_negativos: {
            type: Array,
            default: () => []
        }
    },

    methods: {
        getAceptarInformacion() {
            this.$emit("change", {
                verificacionemitdeerrorpro_reservar: 2
            });
        }
    }
};
</script>

<style scoped>
.tabla-errores {
    width: 100%;
    border-collapse: collapse;
}

.tabla-errores th,
.tabla-errores td {
    border: 1px solid #ddd;
    padding: 8px;
}

.celda-header {
    background: #efefef;
    text-align: center;
    font-weight: bold;
}

.col-producto {
    font-weight: bold;
}
</style>
