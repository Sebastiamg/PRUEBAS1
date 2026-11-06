<template>
    <div>
        <p>Detalles del pagos del contrato <b>{{ ObjectSelected.contrato }}</b></p>
        <b class="font-medium">(Total Pagos = Total comision - pagos cerrados): </b> {{ ObjectSelected.valorTotalComision }} - {{ ObjectSelected.totalPagos }}
        <p class="mt-1"><b>Total Pagos:</b> {{ ObjectSelected.valor_ResultadoPagos }}</p>
        <vs-divider></vs-divider>
        <vs-table max-items="5" stripe search pagination :data="arrayDocumentos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arrayDocumentos.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Pago</vs-th>
                <vs-th>observación</vs-th>
                <vs-th>Estado</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Valor:</b>
                        <p>{{ tr.doc_valor }}</p>
                        <b>Tipo: Pago</b>
                        <p>{{ tr.tipo_pagos ? tr.tipo_pagos.nombre : '' }}</p>
                        <b>Forma de pago:</b>
                        <p>{{ tr.forma_pagos ? tr.forma_pagos.tip_pag_nombre : '' }}</p>
                        <!-- Mostrar solo si doc_nombre o doc_apellidos no son nulos o vacíos -->
                        <template v-if="tr.doc_nombre || tr.doc_apellidos">
                            <b>Doc. Nombres y apellidos</b>
                            <p>{{ (tr.doc_nombre || '') + ' ' + (tr.doc_apellidos || '') }}</p>
                        </template>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].doc_observacion}}<br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="success">Cerrado</vs-chip>
                        <vs-chip v-else color="danger">Abierto</vs-chip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
import Generalmix from '../../../../../mixins/Generalmix';
export default{
    mixins:[Generalmix],
    data(){
        return{
            arrayDocumentos:[],
        }
    },
    props:{
        id_pedido:{
            type:Number,
            default:0
        },
        ObjectSelected:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    mounted(){
        this.getDocumentos()
    },
    methods:{
        getDocumentos(){
            let me = this;
            let url = 'GetDocumentoliqXPedido?pedido='+this.id_pedido
            this.$http.get(this.$server_url+url)
            .then(function (res) {
                me.arrayDocumentos = res.data
                //filtrar diferente de tipo_pago_id  = 3 
                me.arrayDocumentos = me.arrayDocumentos.filter(p => p.tipo_pago_id != 3)
                if(me.arrayDocumentos.length == 0){
                    me.m_message('No hay documentos para mostrar','warning')
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.m_message('Error al obtener documentos','danger')
            })
        },
    }
}
</script>