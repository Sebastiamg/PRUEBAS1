<template>
    <div>
        <!--CONTRACTS-->
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Seleccione Contrato:</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="arrayContracts" :reduce="arrayContracts => arrayContracts" label="contrato" class="w-full" v-model="contractSelect" />
          </div>
        </div>
        <!--VALUE-->
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Valor:</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="inputx w-full" placeholder="Valor" v-model="valueSelect"/>
          </div>
        </div>
        <div class="flex justify-center mt-5">
          <vs-button class="mr-3 mb-2" icon="check" @click="addContract()">Guardar Contrato</vs-button>
          <vs-button color="warning" type="border" icon-pack="feather" icon="icon-x" class="mb-2" @click="$emit('changeRecharge',0)">Cancelar</vs-button>
        </div>
    </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
    components:{
        vSelect
    },
    data(){
        return{
            contractSelect:'',
            valueSelect:'',
        }
    },
    props:{
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
        idConvenio:{
            type:Number,
            default:0,
        },
        arrayContracts:{
            type:Array,
            default:function(){
                return []
            }
        },
        arrayInformation:{
            type:Array,
            default:function(){
                return []
            }
        },
        idConvenioHijo:{
            type:Number,
            default:0,
        },
        agreementSonObject:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    mounted(){
        let me = this
        me.setValores()
    },
    methods:{
        setValores(){
            let me = this
            ///edit
            if(me.idConvenioHijo > 0) {
                const { doc_valor, ven_codigo } = me.agreementSonObject
                me.contractSelect = me.arrayContracts.filter(p => p.contrato ==  ven_codigo)[0]
                me.valueSelect    = doc_valor
            }
            //save
            else{
                me.contractSelect = ''
                me.valueSelect    = ''
            }
        },
        addContract(){
            let me = this;
            let formData = new FormData();
            const { id_pedido, contrato , idInstitucion, id_periodo } = me.contractSelect
            formData.append('saveContratoConvenio',  'yes')
            formData.append('id',                     me.idConvenioHijo)
            formData.append('idConvenio',             me.arrayInformation[0].id);
            formData.append('id_pedido',              ( id_pedido == null || id_pedido == "null") ? 1 :  id_pedido );
            formData.append('contrato',               contrato);
            formData.append('valor',                  me.valueSelect);
            formData.append('institucion_id',         idInstitucion);
            formData.append('periodo_id',             id_periodo)
            formData.append('user_created',           me.usuario.idusuario);
            formData.append('idConvenio',             me.idConvenio)
            this.$http.post(this.$server_url+'convenio', formData)
            .then(res => {
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                me.$emit('changeRecharge',1)
                me.$vs.notify({
                text:'Se guardo con éxito',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch((e)=>{
                // me.$vs.loading.close()
            })
        },
    }
}
</script>
