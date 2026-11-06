<template>
    <div>
        <p><b>Cantidad entregadas: </b>{{ devolucion.cantidad_entregada }}</p>
            <p v-if="devolucion.devolucion > 0"><b>Devueltas: </b>{{ devolucion.devolucion }}</p>
            <p><b>Cantidad que tiene la escuela: </b>{{ devolucion.cantidad_entregada -  devolucion.devolucion }}</p>
            <vs-divider></vs-divider>
            <ul class="flex mt-1">
                <li>
                    <vs-radio v-model="tipoHistorico" @input="filtroHistorico()" vs-name="radios1tipoHistorico" vs-value="1">Entregas</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="tipoHistorico" @input="filtroHistorico()" class="ml-2" vs-name="radios1tipoHistorico" vs-value="0">Devoluciones</vs-radio>
                </li>
            </ul>
            <vs-table max-items="10" search pagination :data="tmparregloHistorial">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ tmparregloHistorial.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Libro</vs-th>
                    <vs-th>Cantidad {{ tipoHistorico == 1 ? 'entregada' :'devuelta' }}</vs-th>
                    <vs-th>Fecha de {{ tipoHistorico == 1 ? 'entrega' :'devolución' }}</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombrelibro}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cantidad_entregada }}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].created_at }}<br>
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
            usuario:[],
            arregloHistorial:[],
            tmparregloHistorial:[],
            tipoHistorico:1,
        }
    },
    props:{
        devolucion:{
            type:Object,
            default:{},
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.verHistorico(me.devolucion)
    },
    methods:{
        verHistorico(tr){
            let me = this;
            me.arregloHistorial = []
            me.$vs.loading()
            this.$http.get(this.$server_url+'getEntregasDevoluciones?asesor_id='+me.usuario.idusuario+'&id='+tr.pedidos_guias_entrega_id+'&pro_codigo='+tr.pro_codigo)
            .then(function (res) {
                me.$vs.loading.close()
                me.arregloHistorial       = res.data
                me.filtroHistorico()
                me.popupHistorico         = true
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        filtroHistorico(){
            let me = this
            me.tmparregloHistorial = []
            me.tmparregloHistorial = me.arregloHistorial.filter(p => p.tipo == me.tipoHistorico)
        }
    }
}
</script>