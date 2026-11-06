<template>
  <div>
    <div>
      <div v-if="documentoSelected.length > 0" class="mt-5 flex justify-center">
        <vs-button @click="changeAddDocumentos();" color="dark" icon="check" class="p-3">Agregar {{ documentoSelected.length }} documentos</vs-button>
      </div>
      <vs-table multiple v-model="documentoSelected" max-items="10" class="mt-2" stripe search pagination :data="arrayDocumentos">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayDocumentos.length }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Documento</vs-th>
          <vs-th>{{ tipo == 0 ? 'Fecha de aprobacion' : 'Fecha de entrega' }} </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{ tr.ven_codigo}}
              </vs-td>
              <vs-td>
                <div v-if="tipo == 0">
                  {{ tr.ven_fecha }}
                </div>
                <div v-else>
                  {{ tr.ven_fecha }}
                </div>
              </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      documentoSelected:[],
    }
  },
  props:{
    arrayDocumentos:{
      type:Array,
      default:() => []
    },
    tipo:{
      type:Number,
      default:0
    },
  },
  mounted(){
    let me = this
  },
  methods:{
    changeAddDocumentos(){
      let me = this
      me.$emit('changeAddDocumentos',me.documentoSelected)
    }
  }
}
</script>
