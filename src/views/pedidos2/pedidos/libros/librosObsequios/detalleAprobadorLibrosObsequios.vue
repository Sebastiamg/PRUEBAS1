<template>
    <div>
        <vs-table max-items="20" :data="datosDetalle">
            <template slot="header">
                <span>Cantidad: {{datosDetalle.length}}</span>
            </template>
            <template slot="thead">
                <vs-th>Cant. unidades</vs-th>
                <vs-th>Descripción</vs-th>
                <vs-th>Precio</vs-th>
                <vs-th>Sub.Totales</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].valor}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].precio}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].subtotal}}<br>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <div class="w-full text-right align-center">
            <div style="width: 200px; text-align: center; display: inline-block;">             
                <div>TOTAL: {{ total }}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                datosDetalle: [],
                datos: {
                    descuento:'',
                    subtotal:'',
                    total:'',
                },
                total: 0,
            }
        },
        props: {
            librosObsequios: {
                type: Object,
                default: () => [],
            }
        },
        mounted() {
            let me = this;
            me.getDetalleLibrosObsequios()
        },
        methods: {
            obtenerIdsLibros() {
                const ids = this.librosObsequios.map(libro => libro.id);
                return ids;
            },
            getDetalleLibrosObsequios() {
                let me = this;
                // const idsLibros = this.obtenerIdsLibros();
                // console.log(idsLibros)
                this.$http.get(this.$server_url + 'get_val_pedidoDetalle_librosObsequios/' + me.librosObsequios.id_pedido)
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.datosDetalle = res.data
                        me.total = me.datosDetalle.reduce((acc, detalle) => {
                            return acc + parseFloat(detalle.subtotal);
                        }, 0);
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            }
        }
    }
</script>