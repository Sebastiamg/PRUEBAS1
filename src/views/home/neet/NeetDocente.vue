<template>
  <div class="mt-3">
    <div v-if="arregloAsignados.length > 0">
      <!--FILTRO SUBNIVEL-->
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
      <!--FILTRO SOLUCIONARIO-->
      <ul class="flex mt-2">
        <li class="mr-3">Filtro por solucionario:</li>
        <li>
          <vs-radio v-model="fSolucionario" @input="filtroDocumentos()" class="mr-2" vs-name="radios1fSolucionario" vs-value="100"><b>{{ sumaTotalSolucionario }}</b> Todos</vs-radio>
        </li>
        <li>
          <vs-radio v-model="fSolucionario" @input="filtroDocumentos()" class="mr-2" vs-name="radios1fSolucionario" vs-value="0"><b>{{ SumaSinSolucionario }}</b> Sin solucionario</vs-radio>
        </li>
        <li>
          <vs-radio v-model="fSolucionario" @input="filtroDocumentos()"              vs-name="radios1fSolucionario" vs-value="1"><b>{{ SumaConSolucionario }}</b> Con solucionario</vs-radio>
        </li>
      </ul>
      <listadoDocumentosVue
      :arregloTemas="arregloTemas"
      :listaDatos="tmparregloAsignados"
      :desdeLibro="desdeLibro"
      :desdeCurso="desdeCurso"
      :setidasignatura="setidasignatura"
      :setnombreasignatura="setnombreasignatura"
      :codigoCurso="codigoCurso"
      />
    </div>
  </div>
</template>
<script>
import listadoDocumentosVue from '@/views/nee_documentos/components/listadoDocumentos'
export default{
  components:{
    listadoDocumentosVue,
  },
  data(){
    return{
      colorx:"#56979B",
      tmparregloAsignados:[],
      arregloTempSolucionario:[],
      subnivel:0,
      fSolucionario:100,
      activeListado:0,
    }
  },
  props:{
    arregloTemas:{
      type:Array,
      default:[]
    },
    arregloAsignados:{
      type:Array,
      default:[]
    },
    desdeLibro:{
      type:Number,
      default:0,
    },
    desdeCurso:{
      type:Number,
      default:0,
    },
    codigoCurso:{
      type:String,
      default:""
    },
    setidasignatura:{
      type:String,
      default:""
    },
    setnombreasignatura:{
      type:String,
      default:""
    },
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
  mounted() {
    let me = this;
    me.filtroDocumentos()
  },
  methods: {
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
  },
}
</script>
