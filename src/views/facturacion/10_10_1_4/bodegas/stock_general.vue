<template>
<vx-card fixed-height="true">
    <!-- <vs-row>
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <p>Búsqueda por filtros</p>
            <br />
            <vs-card class="seccionmostrartodo">
                <div>
                    <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
                        <li class="modelx"></li>
                        <li style="margin: 10px 20px 0px 0px">
                            <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda = 'nombre'">Nombre</vs-radio>
                        </li>
                        <li style="margin: 10px 10px 0px 0px">
                            <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="getmetodocofnrimacioninactivos()">Mostrar inactivos</vs-radio>
                        </li>
                        <li>
                            <vs-button v-if="valorBusqueda !== '1'" color="warning" type="filled" style="margin-left: 10px" @click="getProducto()" icon="search"></vs-button>
                        </li>
                    </ul>
                </div>
            </vs-card>
        </vs-col>
    </vs-row> -->
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Productos">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ Productos.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="200"> Código </vs-th>
            <vs-th width="400"> Descripción </vs-th>
            <vs-th width="400"> Stock</vs-th>
            <vs-th width="150"> Estado</vs-th>
        </template>
        <template slot-scope="{ data }">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].pro_codigo">
                    {{ data[indextr].pro_codigo }}
                </vs-td>
                <vs-td>
                    <!-- {{ tr }} -->
                    {{ tr.pro_nombre }}<br />
                </vs-td>
                <vs-td>
                    <!-- {{ tr }} -->
                    <small><b>Stock General:</b> {{tr.pro_reservar}}</small><br>
                    <small><b>Stock Prolipa Notas:</b> {{tr.pro_deposito}}</small><br>
                    <small><b>Stock Prolipa Facturas:</b> {{tr.pro_stock}}</small><br>
                    <small><b>Stock CALMED Notas:</b> {{tr.pro_depositoCalmed}}</small><br>
                    <small><b>Stock CALMED Facturas:</b> {{tr.pro_stockCalmed}}</small><br>
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.pro_estado == 1" color="success">Activo</vs-chip>
                    <vs-chip v-else color="danger">Inactivo</vs-chip>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</vx-card>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
export default {
    data() {
        return {
            Productos: [],
            valorBusqueda: 0,
            totalProReservar: 0,
            totalProStock_Prolipa: 0,
            totalProStock_CALMED: 0,
            totalProDeposito_Prolipa: 0,
            totalProDeposito_CALMED: 0,
        };
    },
    components: {
        "v-select": vSelect,
    },
    mounted() {
        this.getProducto();
        this.recibirlocalstorage();
    },
    methods: {
        recibirlocalstorage() {
            // Obtiene el valor de 'dashboardstock' del local storage
            const dashboardstock = localStorage.getItem('dashboardstock');

            // Verifica si el valor es igual a '1'
            if (dashboardstock === '1') {
                localStorage.removeItem('dashboardstock');
            } else {
                console.log("No se accedio desde el dashboard");
            }
        },
        getProducto() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetProducto")
                .then((res) => {
                // Filtramos los productos que tienen gru_pro_codigo = 1, 2 o 3
                const productosFiltrados = res.data.filter(producto =>
                    producto.gru_pro_codigo === 1 ||
                    producto.gru_pro_codigo === 2 ||
                    producto.gru_pro_codigo === 3 ||
                    producto.gru_pro_codigo === 6
                );

                // Sumamos los valores de pro_reservar de los productos filtrados
                const totalProReservar = productosFiltrados.reduce((total, producto) => {
                    return total + producto.pro_reservar;
                }, 0);

                const totalProStock_Prolipa = productosFiltrados.reduce((total, producto) => {
                    return total + producto.pro_stock;
                }, 0);

                const totalProStock_CALMED = productosFiltrados.reduce((total, producto) => {
                    return total + producto.pro_stockCalmed;
                }, 0);

                const totalProDeposito_Prolipa = productosFiltrados.reduce((total, producto) => {
                    return total + producto.pro_deposito;
                }, 0);

                const totalProDeposito_CALMED = productosFiltrados.reduce((total, producto) => {
                    return total + producto.pro_depositoCalmed;
                }, 0);

                // Asignamos los productos filtrados a this.Productos
                this.Productos = productosFiltrados;

                // Guardamos el total de pro_reservar
                this.totalProReservar = totalProReservar;
                this.totalProStock_Prolipa = totalProStock_Prolipa;
                this.totalProStock_CALMED = totalProStock_CALMED;
                this.totalProDeposito_Prolipa = totalProDeposito_Prolipa;
                this.totalProDeposito_CALMED = totalProDeposito_CALMED;
                me.$vs.loading.close();
            })
            .catch((err) => {
                console.log(err);
                me.$vs.loading.close();
            });
        }
    },
};
</script>
