<template>
    <div>
      <vs-tabs alignment="fixed">
        <vs-tab label="Mover Notas a Pre Facturas" @click="menu = 0;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Historico de Notas Movidas" @click="menu = 1;">
          <div>

          </div>
        </vs-tab>
      </vs-tabs>
      <vs-divider>{{nombrePeriodo}}</vs-divider>
      <!--components-->
      <div v-if="menu == 0">
        <MoverNotasVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
      </div>
      <div v-if="menu == 1">
        <MoverNotasHistoricoVue :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo"/>
      </div>
    </div>
</template>
<script>
const MoverNotasVue = () => import('./moverNotas/MoverNotas.vue')
const MoverNotasHistoricoVue = () => import('./moverNotas/MoverNotasHistorico.vue')
export default{
    components:{
        MoverNotasVue,
        MoverNotasHistoricoVue,
    },
  props:{
    periodo_id:{
      type:Number,
      default:25
    },
    nombrePeriodo:{
      type:String,
      default:"Sierra 2024"
    }
  },
    data(){
        return{
          menu:0,
        }
    }
}
</script>
