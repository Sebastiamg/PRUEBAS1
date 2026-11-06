<template>
    <div>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle Proforma</b></vs-col>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            <vs-table class="table users table-hover" :data="inputs">
                <template slot="thead">
                    <vs-th width="50"> # </vs-th>
                    <vs-th width="400"> Detalle del producto </vs-th>
                    <vs-th width="200" v-if="proforma.prof_estado!=2"> Cantidad total del pedido </vs-th>
                    <vs-th width="200"> Cantidad recibida</vs-th>
                    <vs-th width="200" v-if="proforma.prof_estado!=2"> Cantidad actual solicitada</vs-th>
                    <vs-th width="200"> Valor Unitario</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr v-for="(inputvs, k) in inputs" :key="k" style="text-size-adjust: 9px;" >
                        <vs-td><br /><b>{{ k + 1 }}</b></vs-td>
                        <vs-td>{{ inputvs.pro_codigo }} {{ inputvs.nombre }}</vs-td>
                        <vs-td v-if="proforma.prof_estado!=2">{{ inputvs.valor?inputvs.valor:0}}</vs-td>
                        <vs-td>{{ inputvs.despacho?inputvs.despacho:0 }}</vs-td>
                        <vs-td v-if="proforma.prof_estado!=2">{{inputvs.det_prof_cantidad?inputvs.det_prof_cantidad:0}} </vs-td>
                        <vs-td>{{ inputvs.det_prof_valor_u }}</vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
    </div>
    </template>
    <script>
    import vSelect from 'vue-select';
    export default {
        components: {
            vSelect,
        },
        data() {
            return {
                inputs: [],
               
            };
        },
        mounted() {
            this.setMenu = localStorage.getItem('setMenu');
            this.cargar();
            
    
        },
        props: {
            edit: {
                type: Array,
                default: () => []
            }, 
            proforma: {
                type: Object,
                default: () => []
            },
        },
        watch: {
            edit(results) {
                this.edit = results
            },
        },
        methods: {
            cargar() {
                this.inputs=this.edit;  
            },
        }
    };
    </script>
    