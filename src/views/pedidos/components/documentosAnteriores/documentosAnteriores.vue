<template>
  <div>
      <vx-card>
        <p class="text-2xl font-bold text-warning"><ion-icon name="folder-outline"></ion-icon> Existe documentos cargados anteriormente. Desea utilizarlos en este pedido?</p>
        <div class="flex mt-3">
          <vs-button color="warning" @click="$emit('rechargeDocumentos','0')" type="border">No, cargare otros archivos</vs-button>
        </div>
      </vx-card>
      <vx-card>
        <vs-table max-items="10" stripe search pagination :data="arregloDocumentosAnteriores">
          <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arregloDocumentosAnteriores.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Información</vs-th>
              <vs-th>Documento cédula</vs-th>
              <vs-th>Documento Ruc</vs-th>
              <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <b>Docente:</b>
                    <p>{{ tr.docente }}</p><br>
                    <b>Cédula:</b>
                    <p>{{ tr.cedulaDocente }}</p><br>
                    <b>Período:</b>
                    <p>{{ tr.periodoescolar }}</p>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.doc_cedula == null || tr.doc_cedula == 'null' || tr.doc_cedula == ''">
                      <vs-chip transparent color="warning">No hay archivos cargados</vs-chip>
                    </div>
                    <div v-else>
                      <img v-if="tr.doc_cedula.substr(-3) == 'pdf'" @click="descargar(tr.doc_cedula)" class="img-fluid cursor-pointer" width="150" src="https://cdn-icons-png.flaticon.com/512/4649/4649604.png"/>
                      <img v-else class="img-fluid cursor-pointer"  @click="descargar(tr.doc_cedula)" width="150" :src="$data_url+'archivos/pedidos/img/img_cedula/'+tr.doc_cedula"/>
                    </div>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.doc_ruc == null || tr.doc_ruc == 'null' || tr.doc_ruc == ''">
                      <vs-chip transparent color="warning">No hay archivos cargados</vs-chip>
                    </div>
                    <div v-else>
                      <img v-if="tr.doc_ruc.substr(-3) == 'pdf'"   @click="descargar(tr.doc_ruc)" class="img-fluid cursor-pointer" width="150" src="https://cdn-icons-png.flaticon.com/512/4649/4649604.png"/>
                      <img v-else class="img-fluid cursor-pointer" @click="descargar(tr.doc_ruc)"  width="150" :src="$data_url+'archivos/pedidos/img/img_cedula/'+tr.doc_ruc"/>
                    </div>
                  </vs-td>
                  <vs-td>
                    <vs-button color="success" @click="guardarDocumentosAnteriores(tr)" class="mr-2" type="filled"><ion-icon name="checkmark-outline"></ion-icon> Utilizar documentos</vs-button>
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </vx-card>
  </div>
</template>
<script>
export default{
  data(){
    return{
      hover: 'zoom',
    }
  },
  props:{
    tmpPedidos:{
      type:Object,
      default:{}
    },
    arregloDocumentosAnteriores:{
      type:Array,
      default:[],
    }
  },
  methods:{
    decargarArchivo(url){
      let me = this;
      let ruta = me.$data_url+'archivos/pedidos/img/img_cedula/'+url
      window.open(ruta,'_blank')
    },
    guardarDocumentosAnteriores(item){
      let me = this;
      let formData = new FormData();
      formData.append('id_pedido',  me.tmpPedidos.id_pedido);
      formData.append('doc_cedula', item.doc_cedula);
      formData.append('doc_ruc',    item.doc_ruc);
      me.$vs.loading()
      this.$http.post(this.$server_url+'agregarDocumentosAnteriorPedido', formData)
          .then(function (res) {
            me.$vs.loading.close()
            if(res.data.status == 0){
              me.$vs.notify({
                text: res.data.message,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
            me.$vs.notify({
              text: 'Se guardo correctamente',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            me.$emit('rechargeDocumentos','1')
          })
          .catch(function (error) {me.$vs.loading.close()})
    },
    descargar(url){
      let me = this;
      let ruta = this.$data_url+'archivos/pedidos/img/img_cedula/'+url
      window.open(ruta,'_blank')
    },
  }
}
</script>
<style scoped>

</style>
