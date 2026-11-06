<template>
  <vx-card title="Registro de Varios Documentos">
    <div v-if="menu == 0">
      <vs-chip transparent color="success" v-if="TotalEvidencias > 0">TOTAL EVIDENCIAS: <b class="ml-2">{{TotalEvidencias }}</b></vs-chip>
      <GiftCardListadoVue @showCreate="showCreate" :arraySeveralEvidences="arraySeveralEvidences" :ObjectPadre="ObjectPadre"/>
    </div>
    <div v-if="menu != 0">
      <vs-button color="primary" type="filled" @click="menu = 0;">◄ Regresar</vs-button>
    </div>
    <div v-if="menu == 1">
      <GiftCardCrearVue  @showCreate="showCreate" @changeHandle="getSeveralEvidences()" :usuario="usuario" :id="id" :ObjectSelect="ObjectSelect" :ObjectPadre="ObjectPadre"/>
    </div>
  </vx-card>
</template>
<script>
import axios from 'axios'
const GiftCardListadoVue = () => import('./GiftCardListado.vue')
const GiftCardCrearVue   = () => import('./GiftCardCrear.vue')
export default {
  components:{
    GiftCardListadoVue,
    GiftCardCrearVue,
  },
  inject: ['idPago'],
  computed: {
    getId() {
      return this.idPago;
    },
  },
  data() {
    return{
      usuario:[],
      id:0,
      menu:0,
      ObjectSelect:'',
      arraySeveralEvidences:[],
      TotalEvidencias:0,
    }
  },
  props:{
    ObjectPadre:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  watch:{
    ObjectPadre(results){
      this.ObjectPadre = results
    },
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this
    me.getSeveralEvidences()
  },
  // computed:{
  //   sumaTotal(){
  //     let me = this;
  //     if(me.arraySeveralEvidences.length >0){
  //       let datos = me.arraySeveralEvidences.filter(p => p.valor)
  //       let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
  //       return total
  //     }
  //   },
  // },
  methods:{
    getSeveralEvidences(){
      let me = this;
      me.TotalEvidencias=0;
      this.$http.get(this.$server_url+'pedigo_Pagos?getVariasEvidencias=yes&idPago='+me.ObjectPadre.doc_codigo)
      .then(function (res) {
        me.arraySeveralEvidences = res.data
        if(me.arraySeveralEvidences.length >0){
          let datos = me.arraySeveralEvidences.filter(p => p.valor)
          let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
          me.TotalEvidencias =  total
        }
      })
      .catch(function (error) {
        console.log(error + ' error');
      })
    },
    showCreate(e,values=''){
      let me              = this
      me.id               = 0;
      me.menu             = e
      me.ObjectSelect     = values
      if(values.id)       { me.id = values.id }
      me.getSeveralEvidences()
    },
  }
}
</script>
