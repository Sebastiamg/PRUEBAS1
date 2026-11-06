<template>
  <div>
    <div v-if="arregloAsignados.length > 0">
      <vx-card style="background-color:#fff;border:none;box-shadow:none;" v-if="tmparregloAsignados.length > 0">
        <vs-tabs :color="colorx">
          <vs-tab                                 :label="'Todos '+'('+sumaTotal+')'" icon-pack="feather" icon="icon-bookmark"                        @click="subnivel = 0;fSolucionario=100;filtroDocumentos()">
          </vs-tab>
          <vs-tab v-if="SumaElemental > 0"        :label="'Elemental '+'('+SumaElemental+')'" icon-pack="feather"  icon="icon-disc"                   @click="subnivel = 1;fSolucionario=100;filtroDocumentos()">
          </vs-tab>
          <vs-tab v-if="SumaMedia > 0"            :label="'Media '+'('+SumaMedia+')'" icon-pack="feather"  icon="icon-disc"                           @click="subnivel = 2;fSolucionario=100;filtroDocumentos()">
          </vs-tab>
          <vs-tab v-if="SumaSuperior > 0"         :label="'Superior '+'('+SumaSuperior+')'" icon-pack="feather"  icon="icon-disc"                     @click="subnivel = 3;fSolucionario=100;filtroDocumentos()">
          </vs-tab>
          <vs-tab v-if="SumaBachillerato > 0"     :label="'Bachillerato '+'('+SumaBachillerato+')'" icon-pack="feather"  icon="icon-disc"             @click="subnivel = 4;fSolucionario=100;filtroDocumentos()">
          </vs-tab>
          <vs-tab v-if="SumaDocumentoGeneral > 0" :label="'Documentos Generales '+'('+SumaDocumentoGeneral+')'" icon-pack="feather"  icon="icon-disc" @click="subnivel = 5;fSolucionario=100;filtroDocumentos()">
          </vs-tab>
        </vs-tabs>
      </vx-card>
    </div>
    <vx-card class="mt-5">
     <!--CARDS-->
     <div class="flex ml-8" v-if="tmparregloAsignados.length > 0">
        <div class="flex mr-3">
          <small>Con solucionario</small>
          <div class="ml-2" style="width: 40px; height: 15px;background-color: #A2F1EB;"></div>
        </div>
        <div class="flex">
          <small>Sin solucionario</small>
          <div class="ml-2" style="width: 40px; height: 15px;background-color: #D2F3CE;"></div>
        </div>
      </div>
      <div class="vx-row" v-if="arregloAsignados.length > 0">
        <!--FILTRO SOLUCIONARIO-->
        <ul class="flex ml-10 mt-3">
          <li>
            <vs-radio v-model="fSolucionario" @input="filtroDocumentos()" class="mr-2" vs-name="radios1fSolucionario" vs-value="100"><b>{{ sumaTotalSolucionario }}</b> Todos</vs-radio>
          </li>
          <li>
            <vs-radio v-model="fSolucionario" @input="filtroDocumentos()" class="mr-2" vs-name="radios1fSolucionario" vs-value="0"><b>{{ SumaSinSolucionario }}</b> Sin solucionario</vs-radio>
          </li>
          <li>
            <vs-radio v-model="fSolucionario" @input="filtroDocumentos()" vs-name="radios1fSolucionario" vs-value="1"><b>{{ SumaConSolucionario }}</b> Con solucionario</vs-radio>
          </li>
        </ul>
        <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6" v-for="(item,key) in tmparregloAsignados">
          <NeetAsignadosVue :item="item" @changeRecharge="changeRecharge"/>
        </div>
       </div>
       <div v-else>
        <br>
        <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
          No hay documentos cargados
        </vs-alert>
       </div>
    </vx-card>
  </div>
</template>
<script>
import NeetAsignadosVue from '@/views/home/neet/NeetAsignados'
export default{
  data(){
    return{
      usuario:[],
      colorx:"#56979B",
      arregloAsignados:[],
      tmparregloAsignados:[],
      arregloTempSolucionario:[],
      subnivel:0,
      fSolucionario:100,
    }
  },
  components:{
    NeetAsignadosVue,
  },
  computed:{
    sumaTotal(){
      let me = this;
      let total = me.arregloAsignados.length
      return total
    },
    SumaElemental(){
      let me = this;
      let datos       = me.arregloAsignados.filter(p => (p.nee_subnivel == '1'));
      let resultado   = datos.length
      return resultado
    },
    SumaMedia(){
      let me = this;
      if(me.arregloAsignados.length > 0){
        let datos       = me.arregloAsignados.filter(p => (p.nee_subnivel == '2'));
        let resultado   = datos.length
        return resultado
      }
    },
    SumaSuperior(){
      let me = this;
      let datos       = me.arregloAsignados.filter(p => (p.nee_subnivel == '3'));
      let resultado   = datos.length
      return resultado
    },
    SumaBachillerato(){
      let me = this;
      let datos       = me.arregloAsignados.filter(p => (p.nee_subnivel == '4'));
      let resultado   = datos.length
      return resultado
    },
    SumaDocumentoGeneral(){
      let me = this;
      let datos       = me.arregloAsignados.filter(p => (p.nee_subnivel == '5'));
      let resultado   = datos.length
      return resultado
    },
    //SOLUCIONARIO
    sumaTotalSolucionario(){
      let me = this;
      let total = me.arregloTempSolucionario.length
      return total
    },
    SumaSinSolucionario(){
      let me = this;
      let datos       = me.arregloTempSolucionario.filter(p => (p.solucionario == '0'));
      let resultado   = datos.length
      return resultado
    },
    SumaConSolucionario(){
      let me = this;
      let datos       = me.arregloTempSolucionario.filter(p => (p.solucionario == '1'));
      let resultado   = datos.length
      return resultado
    },
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.getAsignados()
  },
  methods:{
    changeRecharge(){
      let me = this;
      this.$http.get(this.$server_url + 'neetTema?getAsignadosAll=yes&idusuario='+me.usuario.idusuario+'&institucion_id='+me.usuario.institucion_idInstitucion)
        .then(res => {
          me.arregloAsignados = res.data
          me.filtroDocumentos()
        })
        .catch(error => {
          console.log(error)
        })
    },
    getAsignados() {
      let me = this;
      this.$http.get(this.$server_url + 'neetTema?getAsignadosAll=yes&idusuario='+me.usuario.idusuario+'&institucion_id='+me.usuario.institucion_idInstitucion)
        .then(res => {
          me.$vs.loading.close();
          me.arregloAsignados = res.data
          me.filtroDocumentos()
        })
        .catch(error => {
          console.log(error)
          me.$vs.loading.close();
        })
    },
    filtroDocumentos(){
      let me = this
      me.tmparregloAsignados      = []
      me.arregloTempSolucionario  = []
      if(me.subnivel == '0') {
        let datos                     = me.arregloAsignados
        me.arregloTempSolucionario    = datos
        //todos en los radios de solucionario
        //100 significa que es todos con solucionario
        if(me.fSolucionario == '100')   me.tmparregloAsignados = datos
        else                            me.tmparregloAsignados = datos.filter(p => p.solucionario == me.fSolucionario)
        return
      }
      else{
        let datos                     = me.arregloAsignados.filter(p => p.nee_subnivel == me.subnivel)
        me.arregloTempSolucionario    = datos
        //todos en los radios de solucionario
        //100 significa que es todos con solucionario
        if(me.fSolucionario == '100')   me.tmparregloAsignados = datos
        else                            me.tmparregloAsignados = datos.filter(p => p.solucionario == me.fSolucionario)
        return
      }
    },
  }
}
</script>
