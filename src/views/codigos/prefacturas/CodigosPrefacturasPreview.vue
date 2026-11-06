<template>
  <div>
    <div>
      <vs-table max-items="10" search stripe pagination :data="arrayCodigos">
        <template slot="header">
          <vs-chip  color="primary">Cantidad:  {{ arrayCodigos.length }}</vs-chip>
          <vs-button v-if="btnNotImportar == 0" class="ml-5 mt-4 mb-4 mr-5 text-white" icon="save" @click="openConfirm(arrayCodigos);">Importar códigos</vs-button>
        </template>
        <template slot="thead">
          <vs-th>Código</vs-th>
          <vs-th>Institución</vs-th>
          <vs-th>Períodos</vs-th>
          <!-- <vs-th>Crear Documento</vs-th> -->
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
                {{data[indextr].codigo}}<br>
                <!--plus-->
                <div v-if="tr.plus == '1'"  class="my-3">
                  <p><b style="background-color:#000 ;padding: 10px;color:white;border-radius: 5px;">Plus</b>
                  </p>
                </div>
                <div>
                  <b>Pre factura/Nota:</b>
                  <p style="background-color: bisque;padding: 10px;" v-if="tr.codigo_proforma">{{ tr.codigo_proforma }}</p>
                  <p v-else class="text-danger">No tiene pre factura ni nota</p>
                </div>
                <div v-if="tr.codigo_paquete" class="mt-2">
                  <p><b>Paquete:</b>
                    <span class="ml-2">{{tr.codigo_paquete}}</span>
                  </p>
                </div>
                <div v-if="tr.combo" class="mt-2 my-2">
                  <p><b>Combo:</b>
                    <span class="ml-2" style="background-color: bisque;padding: 10px;">{{tr.combo}}</span>
                  </p>
                </div>
                <p v-if="tr.venta_estado == 1 || tr.venta_estado == 2"><b>Tipo de venta:</b>
                  <span class="ml-2" v-if="tr.venta_estado == 1">Venta directa</span>
                  <span class="ml-2" v-if="tr.venta_estado == 2">Venta lista</span>
                </p>
                <span v-if="tr.estado_liquidacion == 0" class="mt-2 font-semibold">Liquidado</span>
                <span v-if="tr.estado_liquidacion == 3" class="mt-2 font-semibold text-danger">Devuelto</span>
                <span v-if="tr.estado_liquidacion == 4" class="mt-2 font-semibold">GUIA</span>
                <div v-if="tr.documento_devolucion" class="mt-2" style="background-color: bisque;padding: 10px;">
                  <b>Documento de devolucion</b>
                  <p>{{tr.documento_devolucion}}</p>
                </div>
                <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 0 && tr.estado == '0'" class="mt-2 font-semibold text-warning">Regalado sin liquidar</span>
                <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1 && tr.estado == '0'" class="mt-2 font-semibold text-warning">Regalado Liquidado</span>
                <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 0 && tr.estado == '2'" class="mt-2 font-semibold">Acta regalada sin liquidar</span>
                <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1 && tr.estado == '2'" class="mt-2 font-semibold">Acta regalada Liquidada</span>
            </vs-td>
            <vs-td>
              <div v-if="tr.institucionDirecta">
                <b>Institución Venta directa:</b>
                <p>{{data[indextr].institucionDirecta}}</p>
              </div>
              <div v-if="tr.institucionPuntoVenta">
                <b>Institución Venta Lista:</b>
                <p>{{data[indextr].institucionPuntoVenta}}</p>
              </div>
              <div v-if="tr.nombreInstitucion">
                {{ tr.nombreInstitucion }}
              </div>
              <div v-if="tr.incorrecto == 1">
                <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> 2 puntos de despachos encontrados</p>
              </div>
            </vs-td>
            <vs-td>
                {{data[indextr].periodoescolar}}<br>
            </vs-td>
            <!-- <vs-td>
              <div v-if="dLiquidado == 0">
                <span v-if="tr.estado_liquidacion == 0 || tr.estado_liquidacion == 3 || tr.documento_devolucion != null || ( tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1)">
                </span>
                <span v-else class="mt-2">
                  <vs-switch v-model="tr.devolverCheck" @input="changeDevolver(tr)">
                    <span slot="on" class="text-white">Si</span>
                    <span slot="off">No</span>
                  </vs-switch>
                </span>
              </div>
              <div v-if="dLiquidado == 1">
                <span v-if="tr.estado_liquidacion == 3 || tr.documento_devolucion != null">
                </span>
                <span v-else class="mt-2">
                  <vs-switch v-model="tr.devolverCheck" @input="changeDevolver(tr)">
                    <span slot="on" class="text-white">Si</span>
                    <span slot="off">No</span>
                  </vs-switch>
                </span>
              </div>
            </vs-td> -->
          </vs-tr>
        </template>
     </vs-table>
    </div>
  </div>
</template>

<script>
import Generalmix from '../../../mixins/Generalmix';
export default {
  mixins:[Generalmix],
  data() {
    return {
       arrayCodigos:[],
    };
  },
  props: {
    arrayCodigosEncontrados: {
      type: Array,
      default() {
        return [];
      },
    },
    btnNotImportar:{
      type:Number,
      default:0
    }
  },
  watch:{
    arrayCodigosEncontrados:{
      handler: async function(val) {
        let me = this;
        me.arrayCodigosEncontrados = val
        me.arrayCodigos = val
      },
      deep:true
    },
  },
  mounted(){
    let me = this
    me.arrayCodigos = me.arrayCodigosEncontrados
  },
  methods:{
    openConfirm() {
      let me = this
      //filtrar los devolver 1
      let datos = me.arrayCodigos
      if (datos.length == 0) {
        me.m_message('No hay códigos para importar ', 'warning')
        return
      }
      //si la empresa es 0 no se puede crear el documento
      let ObjectSend = {
        data: datos
      }
      me.$emit('openConfirm', ObjectSend)
    },
  }
};
</script>
