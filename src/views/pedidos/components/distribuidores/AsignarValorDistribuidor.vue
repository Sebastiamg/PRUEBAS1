<template>
    <div>
        <div> 
            <!---ASIGNAR COMO DISTRIBUIDOR-->
            <div class="vx-row mb-6" >
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Distribuidor:</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :options="arregloDistribuidores" :reduce="arregloDistribuidores => arregloDistribuidores.idusuario" label="distribuidorUser" class="w-full" v-model="asignar.asesor" />
                </div>
            </div>
            
            <div class="vx-row mb-6" v-if="asignar.asesor">
                <div class="vx-col sm:w-1/3 w-full">
                <span>Cédula</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <div v-for="(item,key) in arregloDistribuidores">
                        <span v-if="item.idusuario == asignar.asesor">{{ item.cedula }}</span>
                    </div>
                </div>
            </div>
               <div class="vx-row mb-6" >
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Período:</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :disabled="editar == 1 ? true:false" :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="asignar.periodo" />
                </div>
            </div>
            
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                <span>Saldo inicial</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-pack="feather" icon="icon-dollar-sign" icon-no-border  v-model="asignar.saldo_inicial" />
                </div>
            </div>
            <div class="flex justify-center">
                <vs-button color="success" class="mr-3" type="gradient" @click="save_distribuidor()">{{ editar == 1 ? 'Editar' : 'Asignar'}} Valores de Distribuidor</vs-button>
            </div> 
        </div>
        <br><br><br><br>
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
            arregloPeriodos:[],
            asignar:{
                id:0,
                asesor:'',
                saldo_inicial:0,
                periodo:'',
            },
        }
    },
    props:{
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
        arregloDistribuidores:{
            type:Array,
            default:function(){
                return []
            }
        },
        distribuidorSelect:{
            type:Object,
            default:function(){
                return {}
            }
        },
        editar:{
            type:Number,
            default:0
        },
    },
    created(){
        let me = this
        me.getPeriodos()
    },
    mounted(){
        let me = this;
        if(me.editar == 0) me.limpiar()
        else               me.setEdit()
    },
    methods:{
        getPeriodos(){
            let me = this
            me.arregloPeriodos = []
            this.$http.get(this.$server_url+'get_periodos_pedidos')
            .then(res => {
                let datos = res.data
                me.arregloPeriodos = datos.filter(p => p.estado == 1)
            })
            .catch(function (error) {
            })
        },
        save_distribuidor(){
            let me  = this;
            if(me.asignar.asesor == "" || me.asignar.asesor == null || me.asignar.asesor == undefined){
                me.$vs.notify({ color: 'danger', title:'Error' , text: "Debe completar seleccionar un asesor", time:4000})
                return
            }
            if(me.asignar.periodo == "" || me.asignar.periodo == null || me.asignar.periodo == undefined){
                me.$vs.notify({ color: 'danger', title:'Error' , text: "Debe Seleccionar un período", time:4000})
                return
            }
            let formData = new FormData();
            formData.append('save_distribuidorTemporada',   'yes')
            formData.append('id',                           me.asignar.id);
            formData.append('user_created',                 me.usuario.idusuario);
            formData.append('idusuario',                    me.asignar.asesor );
            formData.append('saldo_inicial',                me.asignar.saldo_inicial);
            formData.append('periodo_id',                   me.asignar.periodo)
            me.$vs.loading()
            this.$http.post(this.$server_url+'distribuidor', formData)
            .then(res => {
            me.$vs.loading.close()
            if(res.data.status == 0){
                me.$vs.notify({ color: 'danger', title:'Exito' , text: res.data.message, time:4000})
                return
            }
            me.$vs.notify({ color: 'success', title:'Exito' , text: res.data.message, time:4000})
            me.$emit('recharge',2)
            })
            .catch(function (error) {
              me.$vs.loading.close()
            })
        },
        limpiar(){
            let me = this
            me.asignar={
                id:0,
                asesor:'',
                saldo_inicial:0,
                periodo:''
            }
        },
        setEdit(){
            let me = this;
            me.asignar.id               = me.distribuidorSelect.id
            me.asignar.asesor           = me.distribuidorSelect.idusuario
            me.asignar.saldo_inicial    = me.distribuidorSelect.saldo_inicial
            me.asignar.periodo          = me.distribuidorSelect.periodo_id
        }
    }
}
</script>