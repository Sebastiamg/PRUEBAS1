<template>
    <div>
        <p style="font-weight: bold; text-align: center;">{{ titulo }}</p>
        <table style="width: 100%; border-collapse: collapse; border: none;">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" :style="{ width: getColumnWidth(index) }">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tableData" :key="item.id">
                    <td v-for="(field, index) in fieldKeys" :key="index">
                        {{ item[field] }}
                    </td>
                </tr>
                <tr v-if="ifTotales == 1">
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr v-if="ifTotales == 1">
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <!-- <tr v-if="ifTotales == 1">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><b>Subtotal:</b></td>
                    <td> {{ subtotal.toFixed(2) * 1 }}</td>
                </tr> -->
                <tr v-if="ifTotales == 1">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><b>Total:</b></td>
                    <td>{{ total.toFixed(2) * 1 }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        tableData: {
            type: Array,
            required: true,
            default: () => []
        },
        titulo: {
            type: String,
            default: ''
        },
        headers: {
            type: Array,
            required: true
        },
        fieldKeys: {
            type: Array,
            required: true
        },
        columnWidths: {
            type: Array,
            default: () => [] // Anchos opcionales para las columnas
        },
        subtotal:{
            type:Number,
            default:0,
        },
        total:{
            type:Number,
            default:0,
        },
        ifTotales:{
            type:Number,
            default:0,
        }
    },
    methods: {
        getColumnWidth(index) {
            // Usa el valor de columnWidths si está definido, de lo contrario calcula automáticamente
            if (this.columnWidths.length > index) {
                return this.columnWidths[index];
            } else {
                // Distribuye equitativamente el ancho si no hay ancho definido
                return `${100 / this.headers.length}%`;
            }
        }
    }
};
</script>
