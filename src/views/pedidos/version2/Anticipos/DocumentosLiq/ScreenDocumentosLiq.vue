<template>
  <vx-card>
    <div>
      <ListadoDocumentosVue v-if="tipo == 0" :arrayContrato="arrayContrato" @changeChangeLiq="changeChangeLiq"/>
      <div v-if="tipo == 1">
        <vs-button color="primary" class="p-3" @click="tipo = 0;" type="border">◄ Regresar</vs-button>
        <CrearDocumentoLiqVue :id="id" :ObjectDocument="ObjectDocument" />
      </div>
    </div>
  </vx-card>
</template>
<script>
import ListadoDocumentosVue from './ListadoDocumentos.vue'
import CrearDocumentoLiqVue from './CrearDocumentoLiq.vue'
export default {
  components:{
    ListadoDocumentosVue,
    CrearDocumentoLiqVue,
  },
  data() {
    return{
      tipo:0,
      id:0,
      arrayContrato:[],
      ObjectDocument:'',
    }
  },
  props:{
    contrato:{
      type:String,
      default:''
    }
  },
  mounted(){
    let me = this
    me.getDocumentos()
  },
  methods:{
    changeChangeLiq(e,data=[]){
      let me = this
      //save
      if(e == 0) { me.id = 0;               me.tipo = 1;  }
      //Update
      if(e == 1) { me.id = data.doc_codigo; me.tipo = 1; me.ObjectDocument = data }

    },
    getDocumentos(){
      let me = this
      me.$vs.loading()
      this.$http.get(this.$server_url+`pedidos2/pedidos?getDocumentosLiq=yes&contrato=${me.contrato}`)
      .then(function (res) {
        me.$vs.loading.close()
        me.arrayContrato = res.data
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
  }
}
</script>

