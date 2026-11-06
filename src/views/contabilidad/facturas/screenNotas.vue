<template>
    <div>
        <!-- <div>
            <vs-row vs-justify="flex-start">
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <vs-card class="pt-5 pl-5" >
                        <vs-row>
                            <vs-input class="w" @keyup.enter="getFacturaParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar" v-model="busquedaxnombre" />
                            <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getFacturaParametro();" icon="search"></vs-button>
                        </vs-row>
                        <vs-row>
                            <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                                <li class="modelx">
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='documento'">Documento</vs-radio>
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='cliente'">Cliente</vs-radio>
                                </li>
                            </ul>
                        </vs-row>
                    </vs-card>
                </vs-col>
            </vs-row>
        </div> -->
        <div>
            <vs-table max-items="10" pagination search :data="arreglonotas">
                <template slot="thead">
                    <vs-th>Documento</vs-th>
                    <vs-th>Fecha</vs-th>
                    <vs-th>Valor</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>{{ tr.ven_codigo }}</vs-td>
                        <vs-td>{{ tr.ven_fecha }}</vs-td>
                        <vs-td>{{ tr.ven_valor }}</vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
    </template>
    
    <script>
    export default {
        data() {
            return {
                arregloLibros: [],
            };
        },
        props: {
            arreglonotas: {
                type: [Object, Array],
                default: {},
            }
        },
        components: {},
        mounted() {
            let me = this;
        },
        computed: {
    
        },
        methods: {
            getFacturaParametro() {
    
            }
        }
    };
    </script>
    