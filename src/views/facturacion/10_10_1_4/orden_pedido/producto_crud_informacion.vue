<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información</vs-divider>
        <!-- {{ arrayConfiguration }} -->
        <vs-col vs-justify="flex-start" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <div align="center">
                <table border="1">
                    <tr align="center">
                        <td style="background-color: #FEDF9F;" colspan="4" width="1000"><b>Stock mínimo para bodegas</b></td>
                    </tr>
                    <tr align="center">
                        <td style="background-color: #FEDF9F;"><b>Nombre</b></td>
                        <td style="background-color: #FEDF9F;"><b>Mínimo</b></td>
                    </tr>
                    <tr v-for="producto in productosFiltrados" :key="producto.id">
                        <td>{{ producto.nombre }}</td>
                        <td align="center">{{ producto.minimo }}</td>
                    </tr>
                </table>
                <br>
                <table align>
                    <tr>
                        <td>
                            <table align="center" border="1">
                                <tr align="center">
                                    <td style="background-color: #FEDF9F;" colspan="4" width="1000"><b>Glosario de colores</b></td>
                                </tr>
                                <tr align="center">
                                    <td style="background-color: #FEDF9F;" width="500"><b>Textos</b></td>
                                    <td style="background-color: #FEDF9F;" width="500"><b>Significado</b></td>
                                </tr>
                                <tr align="center">
                                    <td align="left"><b style="color: green;">Color Verde:</b></td>
                                    <td align="left">Stock mayor o igual al mínimo.</td>
                                </tr>
                                <tr align="center">
                                    <td align="left"><b style="color: orange;">Color Anaranjado:</b></td>
                                    <td align="left">Stock menor al mínimo.</td>
                                </tr>
                                <tr align="center">
                                    <td align="left"><b style="color: red;">Color Rojo:</b></td>
                                    <td align="left">Stock menor o igual a 0.</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </vs-col>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <!-- <vs-button @click="guardarnuevoeditarMovCompra()" type="relief">Guardar</vs-button>&emsp; -->
        <vs-button @click="getCancelar()" color="danger" type="relief">Cerrar</vs-button>
    </vs-col>
    <br>
    <br>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            productosFiltrados: [],
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        arrayConfiguration: {
            type: Array,
            default: []
        },
    },
    mounted() {
        let me = this;
        me.filtrarProductos();
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        filtrarProductos() {
            // Filtra los productos con ID entre 1 y 5 y ajusta nombres específicos
            this.productosFiltrados = this.arrayConfiguration
                // .filter(item => item.id >= 1 && item.id <= 5)
                .filter(item => item.id == 1 || item.id == 3)
                .map(item => {
                    // Cambiar nombre basado en ID
                    if (item.id === 1) {
                        item.nombre = "Stock General";
                    }
                    // else if (item.id === 2) {
                    //     item.nombre = "Stock Facturas Prolipa";
                    // } 
                    else if (item.id === 3) {
                        item.nombre = "Stock Facturas Calmed";
                    }
                    // else if (item.id === 4) {
                    //     item.nombre = "Stock Notas Prolipa";
                    // }
                    // else if (item.id === 5) {
                    //     item.nombre = "Stock Notas Calmed";
                    // }
                    return item;
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
