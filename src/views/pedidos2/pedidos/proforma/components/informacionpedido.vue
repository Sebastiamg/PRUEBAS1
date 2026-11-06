<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full ">
                <vs-table pagination max-items="3" search :data="tmpPedidos" v-if="tmpPedidos.length > 0">>
                    <template slot="thead">
                        <vs-th>Información</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                <span class="font-bold">{{ tr.nombreInstitucion }}</span><br>
                                <b>PEDIDO#: </b>{{tr.id_pedido}} <br>
                                <b>RUC/CI: </b>{{ tr.ruc }}<br>
                                <b>CONTRATO: </b> {{ tr.contrato_generado }}<br>
                                <b>CUIDAD: </b>{{ tr.ciudad }}<br>
                                <b>DESCUENTO: </b>{{ tr.descuento }}%<br>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>
        </div>
       
    </div>
    </template>
    
    <script>
    import vSelect from 'vue-select';
    export default {
        components: {
            vSelect
        },
        data() {
            return {
                tipo: 0,
                pedido: [],
                tmpPedidos: [],
                agrupa: 0,
                descripcion: '',
                AgrupaOtro: '',
                codigo: '',
                opcion: [],
    
            }
        },
        created() {
    
            console.log(this.idperiodo);
            console.log(this.ca_codigo_agrupado);
        },
        mounted() {
            let me = this;
            me.getPedidos();
    
        },
        props: {
            idperiodo: {
                type: Number,
                default: 0,
            },
            ca_codigo_agrupado: {
                type: String,
                default: '',
            },
    
        },
        methods: {
            getPedidos() {
                // console.log(this.idperiodo);
                // console.log(this.ca_codigo_agrupado);
                let me = this
                var ruta = ""
                me.tmpPedidos = []
                if (me.idperiodo == null || me.idperiodo == "" || me.idperiodo == undefined) {
                    return
                }
                var ruta = this.$server_url + 'InfoAgrupadoPedido/' + this.ca_codigo_agrupado+'/'+me.idperiodo
                me.$vs.loading();
                this.$http.get(ruta)
                    .then(res => {
                        me.$vs.loading.close();
                        me.tmpPedidos = res.data;
                    })
                    .catch((e) => {
                        me.$vs.loading.close();
                    })
            },
    
        }
    }
    </script>    