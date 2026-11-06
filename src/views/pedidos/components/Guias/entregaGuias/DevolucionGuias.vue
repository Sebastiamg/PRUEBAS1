<template>
    <div>
        <p class="text-warning font-bold text-2xl mt-2">Registro de guias que la escuela {{ pedido.nombreInstitucion }} devuelve</p>
        <vs-divider></vs-divider>
        <vs-table max-items="10" search pagination :data="pedido.entregas">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ pedido.entregas.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Código</vs-th>
                <vs-th>Su stock</vs-th>
                <vs-th>Cantidad que tiene la escuela</vs-th>
                <vs-th>Cantidad</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombrelibro}}<br>
                        <p><b>código:</b> {{ tr.pro_codigo }}</p>
                    </vs-td>
                    <vs-td>
                        {{ tr.pro_stock }}
                    </vs-td>
                    <vs-td>
                        {{ tr.cantidad_entregada - tr.devolucion }}
                    </vs-td> 
                    <vs-td>
                        <vs-input type="number" min="1" v-if="tr.cantidad_entregada > tr.devolucion" :max="tr.cantidad_entregada - tr.devolucion" @input="statusButton()" @blur="revisarCantidad(tr)" label-placeholder="Ingrese la cantidad" v-model="tr.formato"/>
                        <p v-else class="text-danger">No hay guias para devolver</p>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>   
        <div style="margin-top: -35px;">
            <vs-button v-if="buton" @click="openConfirm()" color="success" icon="save" type="relief">Guardar</vs-button>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return{
            usuario:[],
            buton:false,
        }
    },
    props:{
        pedido:{
           type:Object,
           default:{} 
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    methods:{
        openConfirm(){
            let me = this
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                acceptText:'aceptar',
                cancelText:'cancelar',
                title: `Confirmar`,
                text: 'Estas seguro de registrar esta devolucion de guias de la escuela '+me.pedido.nombreInstitucion,
                accept:this.guardarStock
            })
        },
        guardarStock(){
            let me = this;
            //setear valores nulos
            var setValores = []
            setValores = me.pedido.entregas.filter(p => p.formato !=null)
            let formData = new FormData();
            formData.append('institucion_id',       me.pedido.institucion_id);
            formData.append('periodo_id',           me.pedido.periodo_id);
            formData.append('asesor_id',            me.usuario.idusuario);
            formData.append('data_detalle',         JSON.stringify(setValores))
            //tipo 1 = resta; 0 = suma
            formData.append('tipo',                 0)
            me.$vs.loading()
            this.$http.post(this.$server_url+'PedidoGuiaEntregas', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                }) 
                me.$emit('recharge',true)
                me.buton = false
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        revisarCantidad(tr){
            let me = this;
            if( (tr.formato > (tr.cantidad_entregada - tr.devolucion)) || (tr.formato < 0 || tr.formato == 0  ) ){
                me.$vs.notify({
                text:'Stock insuficiente o valor inferior a 1',
                color:'danger',
                iconPack: 'feather',
                icon:'icon-check'})
                let datos = me.pedido.entregas
                me.pedido.entregas = []
                datos.forEach(element => {
                    var cal = new Object();
                    cal.nombrelibro                 = element.nombrelibro
                    cal.pro_codigo                  = element.pro_codigo
                    cal.cantidad_entregada          = element.cantidad_entregada
                    cal.pro_stock                   = element.pro_stock
                    cal.devolucion                  = element.devolucion
                    cal.pedidos_guias_entrega_id    = element.pedidos_guias_entrega_id
                    if(element.pro_codigo == tr.pro_codigo){
                        cal.formato = ""
                    }else{
                        cal.formato = element.formato
                    }
                    me.pedido.entregas.push(cal)
                });    
                return
            }
            me.buton = true
        },
        statusButton(){
            let me = this;
            me.buton = false
        },
    }
   
}
</script>