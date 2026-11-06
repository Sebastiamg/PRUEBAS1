<template>
    <div>
        <p class="font-bold text-warning text-2xl">Detalle del contrato {{ contrato.contrato }}</p>
        <vs-table max-items="10" search pagination :data="arregloDetalles"> 
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloDetalles.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Valor unitario</vs-th>
                <vs-th>Cantidad </vs-th>
                <vs-th >Cantidad real</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].pronombre}}<br>
                        <b>Código:</b> {{ tr.proCodigo }}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].detVenValorU}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].detVenCantidad}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].detVenCantidadReal}}<br>
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
            arregloDetalles:[],    
        }
    },
    props:{
        contrato:{
            type:Object,
            default:{}
        }
    },
    mounted(){
        let me = this;
        me.getDetalles()
    },
    methods:{
        getDetalles(){
            let me = this;
            me.arregloDetalles = []
            me.$vs.loading();
            this.$http.get(this.$server_url+'detalleContratoFacturacion?ven_codigo='+me.contrato.contrato)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arregloDetalles = res.data.detalle_venta
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Hubo problemas de conexion con el servidor de facturación',
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                })
        }
    }
}
</script>