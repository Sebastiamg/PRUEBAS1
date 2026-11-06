<template>
  <div>
      <vx-card>
        <div v-if="tipo == 2">
          <br>
          <vs-button color="primary" class="ml-4" type="border" @click="tipo = 1;">← Regresar</vs-button>
          <div>
            <historicoCodigosNuevoVue class="mt-2" :contratoPedido="pedido.contrato" :id_pedido="Number(pedido.id_pedido)" :desdePedido="1" />
          </div>
        </div>
        <div v-if="tipo == 1">
          <vs-table max-items="10" search pagination :data="arregloHistorico">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloHistorico.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Datos</vs-th>
                <vs-th>Fecha solicitud verificación</vs-th>
                <vs-th>Fecha realiza verificación</vs-th>
                <vs-th>Fecha sube evidencia</vs-th>
                <vs-th>Estado</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Contrato</b>
                        <p>{{ tr.contrato }}</p>
                        <b>Institución</b>
                        <p>{{ tr.nombreInstitucion }}</p>
                        <b>Ciudad</b>
                        <p>{{ tr.ciudad }}</p>
                        <b>Asesor</b>
                        <p>{{ tr.asesor }}</p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].fecha_solicita_verificacion}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].fecha_realiza_verificacion}}
                    </vs-td>
                    <vs-td>
                        {{data[indextr].fecha_subir_evidencia}}
                    </vs-td>
                    <vs-td>
                      <vx-tooltip style="display: inline-block;" text="Ver verificaciones" position="top" color="primary">
                        <vs-button icon-pack="feather" class="p-2" icon="icon-activity" @click="pedido = tr; VerVerificaciones(tr)" color="#7AD40E" type="border">Verificaciones</vs-button>
                      </vx-tooltip>
                      <p class="mt-2"></p>
                      <vs-chip v-if="tr.estado == 1" color="warning">Asesor solicita</vs-chip>
                      <vs-chip v-if="tr.estado == 2" color="success">Verificación Realizada </vs-chip>
                      <vs-chip v-if="tr.estado == 3" color="primary">Facturador subío evidencia </vs-chip>
                    </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </div>
      </vx-card>
  </div>
</template>
<script>
import historicoCodigosNuevoVue from './historicoCodigosNuevo.vue'
export default{
  data(){
    return{
      arregloHistorico:[],
      tipo:1,
      pedido:{},
    }
  },
  components:{
    historicoCodigosNuevoVue,
  },
  mounted(){
    let me = this;
    me.getHistorico()
  },
  methods:{
    getHistorico(){
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url+'getHistoricoVerificaciones')
        .then(function (res) {
          me.arregloHistorico = res.data
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
      //====METODOS PARA VERIFICACIONES========
      VerVerificaciones(tr){
      let me = this
      me.tipo = 2
    },
  }
}
</script>
