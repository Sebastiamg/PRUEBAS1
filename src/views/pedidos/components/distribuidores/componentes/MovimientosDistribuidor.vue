<template>
    <div>
        <vs-table max-items="10" search pagination :data="arregloHistorico">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloHistorico.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Datos</vs-th>
                <vs-th>Movimiento</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Distribuidor:</b>
                       <p>{{ tr.distribuidor }}</p>
                       <b>Período:</b>
                       <p>{{ tr.periodo }}</p>
                       <b>Editor:</b>
                       <p>{{ tr.editor }}</p>
                    </vs-td>
                    <vs-td>
                       <b>Contrato pago:</b>
                       <p>{{ tr.contrato }}</p>
                       <b>Saldo anterior:</b>
                       <p>{{ tr.saldo_anterior }}</p>
                       <b>Valor pagado:</b>
                       <p>{{ tr.saldo_anterior - tr.saldo_actual }}</p>
                       <b>Nuevo saldo:</b>
                       <p>{{ tr.saldo_actual }}</p>
                       <b>Fecha pago:</b>
                       <p>{{ tr.created_at | fecha }}</p>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>  
    </div>
</template>
<script>
export default{
    data(){
        return{
            arregloHistorico:[],
        }
    },
    mounted(){
        let me = this;
        me.getHistorico()
    },
    methods:{
        getHistorico(){
            let me = this;
            me.$vs.loading()
            var url = ""
            url = this.$server_url + 'distribuidor?movimientosDistribuidor=yes'
            this.$http.get(url)
                .then(res => {
                    me.$vs.loading.close()
                    me.arregloHistorico = res.data
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        }
    }
}
</script>