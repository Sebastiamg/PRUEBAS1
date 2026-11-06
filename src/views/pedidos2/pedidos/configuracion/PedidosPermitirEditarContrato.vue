<template>
    <div>

        <p class="text-center"> <b>Contrato:</b> {{ pedido.contrato_generado }}</p>
        <br>
        <div class="flex justify-center" style="flex-direction: column;align-items: center;">
            <p>Permitir editar contrato:</p>
            <ul class="flex mt-2">
                <li class="mr-5">
                    <vs-radio v-model="ifpermitir_editar_despues_contrato" vs-name="radios1ifpermitir_editar_despues_contrato" vs-value="1">Si</vs-radio>
                </li>
                <li class="mr-5">
                    <vs-radio v-model="ifpermitir_editar_despues_contrato" vs-name="radios1ifpermitir_editar_despues_contrato" vs-value="0">No</vs-radio>
                </li>
            </ul>
        </div>
        <div class="flex justify-center mt-6">
            <vs-button color="success" @click="f_guardar()" class="mr-2" type="gradient">Guardar</vs-button>
        </div>
    </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix'
export default{
    mixins:[Generalmix],
    data(){
        return{
            ifpermitir_editar_despues_contrato:0,
            usuario:JSON.parse(localStorage.getItem('usuario'))
        }
    },
    props:{
        pedido:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    mounted(){
        let me = this
        me.ifpermitir_editar_despues_contrato = me.pedido.permitir_editar_despues_contrato
    },
    methods:{
        f_guardar(){
            let me = this
            let formData = new FormData();
            formData.append('unCampo','1')
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('campo','permitir_editar_despues_contrato');
            formData.append('valor',me.ifpermitir_editar_despues_contrato);
            formData.append('user_created',me.usuario.idusuario);
            me.$vs.loading({color:'primary'})
            this.$http.post(this.$server_url+'updateThePedido', formData)
            .then(function (res) {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    me.m_message(res.data.message,"danger","fa-times",4000)
                    return
                }
                me.m_message("Cambio guardado correctamente","success","fa-check",4000)
                me.$emit('ChangeRecarge',true)
            })
            .catch(function (error) {
                me.$vs.loading.close();
                me.m_message("Error al guardar el cambio","danger","fa-times",4000)
            })
        }
    }
}
</script>
