<template>
  <div>
    <div class="flex">
      <div class="mr-2">
        <vs-input class="w-full" @keyup.enter="searchDocuments()" icon="search" label-placeholder="Buscar Documento" v-model="factura"/>
      </div>
      <div>
        <vs-button class="mt-5" @click="searchDocuments()" radius color="primary" type="border" icon="search"></vs-button>
      </div>
    </div>
    <div v-if="arregloCodigos.length > 0">
      <vs-divider>Documento: <b>{{ facturaSelect.factura }}</b></vs-divider>
      <TableRadiosCodigosListaVue :arregloCodigos="arregloCodigos" openModal="1"/>
    </div>
    <!--MODALES-->
    <!--MODAL PARA SELECCIONAR CODIGO-->
    <vs-popup classContent="popup-example" title="Selecciona el Documento" :active.sync="popupSelectFactura">
      <vs-table v-if="popupSelectFactura" max-items="10" search pagination :data="arregloDocumentos">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arregloDocumentos.length }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Factura</vs-th>
          <vs-th>Seleccionar</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  {{data[indextr].factura}}<br>
                </vs-td>
                <vs-td>
                  <vs-button radius color="success" @click="facturaSelect=tr;searchCodes()" type="line" icon="check"></vs-button>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    </vs-popup>
  </div>
</template>
<script>
import gestionCodigosListaVue from '../../gestionCodigosLista.vue';
import TableRadiosCodigosListaVue from '@/views/codigos/components/utils/components/GestionLiquidacion/TableRadiosCodigosLista'
export default{
  components:{
    gestionCodigosListaVue,
    TableRadiosCodigosListaVue,
  },
  data(){
    return{
      arregloDocumentos:[],
      arregloCodigos:[],
      factura:'',
      popupSelectFactura:false,
      facturaSelect:'',
    }
  },
  methods:{
    searchDocuments(){
      let me = this;
      me.facturaSelect  = ''
      me.arregloCodigos = []
      if(me.factura == ""){
        me.$vs.notify({
        text:'El campo de búsqueda no puede quedar vacío',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.factura.length < 4){
        me.$vs.notify({
        text:'Minimo 4 caracteres de búsqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.$vs.loading()
      this.$http.get(this.$server_url+'procesosbodega?obtenerFacturasLike=yes&factura='+me.factura)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.length == 0) {
          me.$vs.notify({
          text:'No se encontro resultados',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.arregloDocumentos  = res.data
        me.popupSelectFactura = true
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
    searchCodes(){
      let me = this;
      me.$vs.loading()
      this.$http.get(this.$server_url+'procesosbodega?getCodigosXDocumento=yes&factura='+me.facturaSelect.factura)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.length == 0) {
          me.$vs.notify({
          text:'No se encontro resultados',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.arregloCodigos     = res.data
        me.popupSelectFactura = false
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
  }
}
</script>
