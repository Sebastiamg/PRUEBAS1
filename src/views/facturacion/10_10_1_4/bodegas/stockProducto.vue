<template>
    <div>
        <div>
            <vx-card fixed-height="true" title="Seleccione Stock:">
                <div style="display: flex; justify-content: center; align-content: center;">
                    <ul class="leftx" style="display:flex;margin:0px 0px 0px 15px;">
                        <li style="margin:10px 10px 0px 0px;">
                            <b>Stock Bodega General</b>
                        </li>
                        <li style="margin:10px 10px 0px 0px;">
                            <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="menu='general';controlRadio()"></vs-radio>
                        </li>
                    </ul>
                </div>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
                    <div style="flex: 1; min-width: 200px; max-width: 400px;">
                        <ul class="leftx" style="margin: 0 15px;">
                            <li style="margin: 10px 10px 0 0;">
                                <b>Stock Bodega Prolipa:</b>
                            </li>
                        </ul>
                        <ul class="leftx" style="display: flex; flex-wrap: wrap; margin: 0 15px;">                            
                            <li style="margin: 10px 10px 0 0;">
                                <vs-radio vs-name="radios2" vs-value="3" v-model="valorBusqueda" @input="menu='prolipaF';controlRadio()">Facturas</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0 0;">
                                <vs-radio vs-name="radios3" vs-value="4" v-model="valorBusqueda" @input="menu='prolipaN';controlRadio()">Notas</vs-radio>
                            </li>
                        </ul>
                    </div>
                    <div style="flex: 1; min-width: 200px; max-width: 400px;">
                        <ul class="leftx" style="margin: 0 15px;">
                            <li style="margin: 10px 10px 0 0;">
                                <b>Stock Bodega Calmed:</b>
                            </li>
                        </ul>
                        <ul class="leftx" style="display: flex; flex-wrap: wrap; margin: 0 15px;">
                            <li style="margin: 10px 10px 0 0;">
                                <vs-radio vs-name="radios4" vs-value="5" v-model="valorBusqueda" @input="menu='calmedF';controlRadio()">Facturas</vs-radio>
                            </li>
                            <li style="margin: 10px 10px 0 0;">
                                <vs-radio vs-name="radios5" vs-value="6" v-model="valorBusqueda" @input="menu='calmedN';controlRadio()">Notas</vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="mostrarProductos">
                    <div style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: -45px;">
                        <vs-button radius color="rgb(43, 94, 236)" type="border" icon="refresh" @click="getConfiguracionStock"></vs-button>
                    </div>
                    <template>
                        <vs-table max-items="20" pagination search :data="productos">
                            <template slot="thead">
                                <vs-th>Codigo</vs-th>
                                <vs-th>Nombre</vs-th>
                                <vs-th v-if="menu === 'general'">Stock General</vs-th>
                                <vs-th v-else-if="menu === 'prolipaF' || menu === 'calmedF'">Stock Facturas</vs-th>
                                <vs-th v-else-if="menu === 'prolipaN' || menu === 'calmedN'">Stock Notas</vs-th>
                            </template>
                            <template slot-scope="{ data }">
                                <vs-tr :state="getRowState(tr)" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>{{ tr.pro_codigo }}</vs-td>
                                    <vs-td>{{ tr.pro_nombre }}</vs-td>
                                    <vs-td v-if="menu === 'general'">{{ getStockValue(tr) }}</vs-td>
                                    <vs-td v-else-if="menu === 'prolipaF'">{{ getStockValue(tr) }}</vs-td>
                                    <vs-td v-else-if="menu === 'prolipaN'">{{ getStockValue(tr) }}</vs-td>
                                    <vs-td v-else-if="menu === 'calmedF'">{{ getStockValue(tr) }}</vs-td>
                                    <vs-td v-else-if="menu === 'calmedN'">{{ getStockValue(tr) }}</vs-td>

                                </vs-tr>
                            </template>
                        </vs-table>
                    </template>
                </div>
            </vx-card>
        </div>
    </div>
    </template>
    
    <script>
    import Vue from "vue";
    import axios from "axios";
    import vSelect from "vue-select";
    export default {
        components: {
            "v-select": vSelect,
    
        },
        data() {
            return {
                productos: [],
                configuracionProducto: [],
                minimo: '',
                maximo: '',
                umbral: 100,
                menu: 'general',
                mostrarProductos: false,
                valorBusqueda: 0,
            };
        },
        props: {},
        computed: {},
        mounted() {
            let me = this;
            // me.recargarVista();
            me.getProductosStockMinimo();
            me.getConfiguracionStock();
        },
        methods: {
            controlRadio(){
                let me = this;
                if(this.valorBusqueda === "0"){
                    me.getConfiguracionStock();
                }else if(this.valorBusqueda === "3"){
                    me.getConfiguracionStock();
                }else if(this.valorBusqueda === "4"){
                    me.getConfiguracionStock();
                }else if(this.valorBusqueda === "5"){
                    me.getConfiguracionStock();
                }else if(this.valorBusqueda === "6"){
                    me.getConfiguracionStock();
                }else if(this.valorBusqueda === "1"){
                    me.getConfiguracionStock();
                }else if(this.valorBusqueda === "2"){
                    me.getConfiguracionStock();
                }
            },
            getRowState(item) {
                let me = this;
    
                let valorStock = this.getStockValue(item);
                return (this.minimo - valorStock) > this.umbral ? 'danger' : (this.minimo - valorStock) > this.umbral + 100 ? 'warning': 'none';
            },
            getStockValue(item) {
                let me = this;
    
                switch (this.menu) {
                    case 'prolipaF':
                        return item.pro_stock;
                    case 'prolipaN':
                        return item.pro_deposito;
                    case 'calmedF':
                        return item.pro_stockCalmed;
                    case 'calmedN':
                        return item.pro_depositoCalmed;
                    case 'general':
                        return item.pro_reservar;
                    default:
                        return 0;
                }
            },
            getConfiguracionStock() {
                let me = this;
                this.$vs.loading();
                this.$http.get(this.$server_url + 'getConfiguracionStock?empresaStock=' + me.menu)
                    .then(res => {
                        let datos = res.data[0];
                        me.configuracionProducto = datos;
                        me.minimo = me.configuracionProducto.minimo;
                        me.maximo = me.configuracionProducto.maximo;
                        console.log(me.minimo, 'valor minimo')
                        me.filtro(me.configuracionProducto.minimo);
                        this.$vs.loading.close();
                    })
                    .catch(error => {
                        console.log(error + " error");
                        me.configuracionProducto = [];
                        me.$vs.loading.close();
                    });
            },
            getProductosStockMinimo() {
                let me = this;
                this.$vs.loading();
                this.$http.get(this.$server_url + 'getProductosStockMinimo')
                    .then(res => {
                        let datos = res.data;    
                        me.productos = datos;
                        this.$vs.loading.close();
                    })
                    .catch(error => {
                        console.log(error + " error");
                        me.productos = [];
                        me.$vs.loading.close();
                    });
            },
            filtro(minimo){
                let me = this;
                if (me.menu == 'prolipaF') {
                    me.productos.filter(producto => producto.pro_stock < minimo);
                    me.mostrarProductos = true;
                } else if (me.menu == 'prolipaN') {
                    me.productos.filter(producto => producto.pro_deposito < minimo);
                    me.mostrarProductos = true;
                } else if (me.menu == 'calmedF') {
                    me.productos.filter(producto => producto.pro_stockCalmed < minimo);
                } else if (me.menu == 'calmedN') {
                    me.productos.filter(producto => producto.pro_depositoCalmed < minimo);
                    me.mostrarProductos = true;
                } else if (me.menu == 'general') {
                    me.productos.filter(producto => producto.pro_reservar < minimo);
                    me.mostrarProductos = true;
                } else {
                    me.mostrarProductos = false;
                }
            }
        }
    };
    </script>
    