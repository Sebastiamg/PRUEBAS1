<template>
<div class="container mx-auto px-4">
    <vx-card title="Reportes seleccione el período para desplegar" class="mb-4">
        <small class="block mb-2">Buscar periodo:</small>
        <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos" @input="f_selectPeriodo();" label="periodoescolar" class="w-full" v-model="periodoSelect" />
    </vx-card>

    <div v-if="mostrar">
        <vx-card class="shadow-lg">
            <ReportePedidoBodegaVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" />
        </vx-card>
    </div>
</div>
</template>
<script>
import PeriodoRepository from '@/repositories/PeriodoRepository'
const ReportePedidoBodegaVue    = () => import('../../../../pedidos2/pedidos/reportes/ReportePedidoBodega.vue');
import vSelect from 'vue-select'
import Generalmix from '../../../../../mixins/Generalmix';
export default {
  mixins:[Generalmix],
  components:{
        vSelect,
        ReportePedidoBodegaVue
    },
    data() {
    return{
      arrayPeriodos:[],
      ifpuntoVenta:0,
      periodo_id:0,
      nombrePeriodo:'',
      periodoSelect:'',
      mostrar:false,
        }
    },
  mounted(){
        let me = this
        me.obtenerPeriodos()
    },
  methods:{
    obtenerPeriodos(){
            let me = this;
      PeriodoRepository.getPeriodos().then( p => { me.arrayPeriodos = p.data.filter(p => p.reporte_gerencia == 1 ) });
        },
    f_selectPeriodo(){
            let me = this
      me.mostrar        = false
            me.$vs.loading()
      setTimeout(()=>{
        if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
          me.m_message("Seleccione un periodo por favor","warning")
                    me.$vs.loading.close()
                    return
                }
        me.periodo_id     = me.periodoSelect.idperiodoescolar
        me.nombrePeriodo  = me.periodoSelect.periodoescolar
        me.mostrar        = true
                me.$vs.loading.close()
      },1000)
        },
    }
}
</script>
