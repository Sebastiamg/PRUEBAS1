<template>
    <vx-card>
        <div v-if="tipo != 0">
            <vs-button color="primary" type="border" @click="tipo = 0;getObsequios()">← Regresar</vs-button>
        </div>
        <div v-if="tipo == 1"><crearPedidoVue :arregloPeriodo="arregloPeriodo"  @changeRecharge="changeRecharge" :id="id" :periodo_id="pedido.periodo_id"  :pedido="pedido"/></div>
        <div v-if="tipo == 0">
            <listadoObsequioVue :arregloObsequios="arregloObsequios" @changeRecharge="changeRecharge" @changeAutorizar="changeAutorizar" @changeEdit="changeEdit"/>
        </div>
    </vx-card>
</template>
<script>
import crearPedidoVue from '../asesor/mantenimiento/crearPedido'
import listadoObsequioVue from '../asesor/mantenimiento/listadoObsequio'
export default{
    data(){
        return{
            tipo:0,
            id:0,
            arregloObsequios:[],
            arregloPeriodo:{},
            pedido:{},
        }
    },
    components:{
        listadoObsequioVue,
        crearPedidoVue,
    },
    mounted(){
        let me = this;
        me.getObsequios()
    },
    methods:{
        changeEdit(e){
            let me      = this;
            me.pedido   = {}
            me.pedido   = e
            me.id       = e.id
            me.tipo     = 1
        },
        changeAutorizar(e){
            let me = this;
            me.pedido   = {}
            me.id       = e.id
            me.pedido   = e
            me.TypechangeEstado()
        },
        changeRecharge(e){
            let me  = this;
            me.tipo = 0
            me.getObsequios()
        },
        getObsequios() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'obsequio?listadoObsequioGerencia=yes')
                .then(function (res) {
                    let datos = res.data
                    if(datos.length > 0){
                        me.arregloObsequios = datos.filter( p => p.obsequios_gerencia == 1 )  
                    }else{
                        me.arregloObsequios = []
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //AUTORIZAR GERENCIA
        TypechangeEstado(){
            let me = this
            let formData = new FormData();
            formData.append('id',                       me.pedido.id);
            formData.append('estado',                   5);
            me.$vs.loading()
            this.$http.post(this.$server_url+'changeEstadoObsequio', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})     
                    return
                }
                me.getObsequios()
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                })
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        //FIN AUTORIZAR GERENCIA
        getInfoPeriodo(){
            let me = this;
            console.log("rock2222")
            me.arregloPeriodo = ''
            this.$http.get(this.$server_url+'periodo/'+me.pedido.periodo_id)
                .then(function (res) {
                    me.arregloPeriodo = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        }
    }
}
</script>