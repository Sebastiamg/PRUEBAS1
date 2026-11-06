<template>
    <div class="mt-5">
        <h3 class="font-semibold text-center text-success">Agregar Convenio</h3>
        <div class="vx-row mt-3">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2" v-if="groupFacturador">
                <small>Seleccione el período origen del convenio:</small>
                <v-select :options="arrayPeriod"  :reduce="arrayPeriod => arrayPeriod.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodSelect" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2" >
                <vs-input class="w-full" @input="validarValorGlobal(convenio.anticipo_global)" icon-pack="feather" icon="icon-dollar-sign" icon-no-border label="Cantidad de anticipo global" v-model="convenio.anticipo_global" type="number" step="any" />
            </div>
        </div>
        <div class="vx-row mt-3">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
                <vs-input class="w-full" type="number" icon-pack="feather" icon="icon-calendar" icon-no-border label="Convenio de años" v-model="convenio.anios" />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-message-square" icon-no-border label="Observación" v-model="convenio.observacion" />
            </div>
        </div>
        <div class="flex justify-center">
            <vs-button type="gradient" style="margin-top: 23px;" icon="save" class="p-2 " @click="saveGlobal()">Guardar convenio</vs-button>
        </div>
    </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
    components:{
        vSelect,
    },
    data(){
        return{
            arrayPeriod:[],
            periodSelect:'',
            convenio:{
                anticipo_global:0,
                anios:0,
                observacion:'',
            },
        }
    },
    mounted(){
        let me = this;
        me.getPeriods()
        me.periodSelect   = me.datosInstitucion.id_periodo
        me.convenio.anios = me.ObjectPedido.convenio_anios
    },
    props:{
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
        datosInstitucion:{
            type:Object,
            default:function(){
                return {}
            }
        },
        groupFacturador:{
            type:Boolean,
            default:false,
        },
        ObjectPedido:{
          type:Object,
          default:function(){
              return {}
          }
        },
    },
    methods:{
        getPeriods(){
            let me = this
            me.array = []
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                let datos = res.data
                me.arrayPeriod = datos.filter(p => p.idperiodoescolar > 6 && p.idperiodoescolar !=18  && p.idperiodoescolar !=17 && p.idperiodoescolar !=15  && p.idperiodoescolar !=14  && p.idperiodoescolar !=9 && p.idperiodoescolar !=8)
            })
            .catch(function (error) {
            })
        },
        saveGlobal(){
            let me = this;
            if(me.periodSelect == null || me.periodSelect == "" || me.periodSelect == undefined){
                me.$vs.notify({
                text:'Seleccione un período por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if( me.convenio.anios < 2 ){
                me.$vs.notify({
                text:'El convenio no puede ser menor a 2 años',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            const { id_institucion,id_periodo  }  = me.datosInstitucion
            let formData = new FormData();
            formData.append('saveGlobal',       "yes");
            formData.append('anticipo_global',  me.convenio.anticipo_global);
            formData.append('convenio_anios',   me.convenio.anios);
            formData.append('institucion_id',   id_institucion);
            formData.append('periodo_id',       me.periodSelect );
            formData.append('user_created',     me.usuario.idusuario);
            formData.append('observacion',      me.convenio.observacion);
            formData.append('id_pedido',        me.ObjectPedido.id_pedido)
            me.$vs.loading()
            this.$http.post(this.$server_url+'convenio', formData)
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
            me.$emit('changeRecharge',1)
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch((e)=>{
                me.$vs.loading.close()
            })
        },
        validarValorGlobal(valor){
            let me = this
            console.log("valor",valor)
            if(valor < 0){
              me.convenio.anticipo_global = 0
            }
        }
    }
}
</script>
