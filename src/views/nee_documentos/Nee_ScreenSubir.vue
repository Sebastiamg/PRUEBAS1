<template>
  <div>
    <vx-card>
      <div>
        <div>
          <vs-button type="gradient" color="primary" icon="add" @click="ficha={};popupAdd = true;">Agregar</vs-button>
        </div>
        <ul class="flex mt-5">
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="0"><b>{{ sumaTotal }}</b> Todo</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="1"><b>{{ SumaElemental }}</b> Elemental</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="2"><b>{{ SumaMedia }}</b> Media</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="3"><b>{{ SumaSuperior }}</b> Superior</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="4"><b>{{ SumaBachillerato }}</b> Bachillerato</vs-radio>
          </li>
          <li>
            <vs-radio v-model="subnivel" @input="filtroDocumentos()" class="mr-2" vs-name="radios1subnivel" vs-value="5"><b>{{ SumaDocumentoGeneral }}</b> Documento General</vs-radio>
          </li>
        </ul>
        <listadoDocumentosVue :arregloTemas="arregloTemas"  :listaDatos="tmpArregloDocumentos" @recharge="recharge" @changeEdit="changeEdit"/>
      </div>
      <vs-popup class="holamundo" fullscreen  title="Subir documentos" :active.sync="popupAdd" @close="f_getFichas">
        <CrearDocumentosVue :arregloTemas="arregloTemas" :setTema="setTema" v-if="popupAdd" :ficha="ficha" @recharge="recharge" />
      </vs-popup>
    </vx-card>
  </div>
  </template>

  <script>
  import vSelect from 'vue-select';
  import listadoDocumentosVue from '@/views/nee_documentos/components/listadoDocumentos'
  import CrearDocumentosVue from '@/views/nee_documentos/components/CrearDocumentos'
  export default {
    components: {
      "v-select": vSelect,
      listadoDocumentosVue,
      CrearDocumentosVue,
    },
    data() {
      return {
        listaDatos:[],
        ficha:{},
        popupAdd:false,
        setTema:"",
        subnivel:0,
      }
    },
    props:{
      arregloTemas:{
        type:Array,
        default:[]
      },
    },
    computed:{
      sumaTotal(){
        let me = this;
        let total = me.listaDatos.length
        return total
      },
      SumaElemental(){
        let me = this;
        let datos       = me.listaDatos.filter(p => (p.nee_subnivel == '1'));
        let resultado   = datos.length
        return resultado
      },
      SumaMedia(){
        let me = this;
        let datos       = me.listaDatos.filter(p => (p.nee_subnivel == '2'));
        let resultado   = datos.length
        return resultado
      },
      SumaSuperior(){
        let me = this;
        let datos       = me.listaDatos.filter(p => (p.nee_subnivel == '3'));
        let resultado   = datos.length
        return resultado
      },
      SumaBachillerato(){
        let me = this;
        let datos       = me.listaDatos.filter(p => (p.nee_subnivel == '4'));
        let resultado   = datos.length
        return resultado
      },
      SumaDocumentoGeneral(){
        let me = this;
        let datos       = me.listaDatos.filter(p => (p.nee_subnivel == '5'));
        let resultado   = datos.length
        return resultado
      },
    },
    mounted() {
      let me = this;
      me.f_getFichas()
    },
    methods: {
      recharge(e){
        let me = this;
        me.setTema = ""
        if(e.temaSelect){
          me.setTema = e.temaSelect
          return
        }
        me.f_getFichas()
        me.popupAdd = false
      },
      changeEdit(e){
        let me = this;
        me.ficha = {}
        me.ficha = e
        me.popupAdd = true
      },
      f_getFichas() {
        let me = this;
        this.$http.get(this.$server_url + 'neetTema?listadoDocumentos=yes')
          .then(res => {
            me.$vs.loading.close();
            me.listaDatos = res.data
            me.filtroDocumentos()
          })
          .catch(error => {
            console.log(error)
            me.$vs.loading.close();
          })
      },
      filtroDocumentos(){
        let me = this
        me.tmpArregloDocumentos = []
        if(me.subnivel == '0') me.tmpArregloDocumentos = me.listaDatos
        else                   me.tmpArregloDocumentos = me.listaDatos.filter(p => p.nee_subnivel == me.subnivel)
      },
    },
  }
  </script>
