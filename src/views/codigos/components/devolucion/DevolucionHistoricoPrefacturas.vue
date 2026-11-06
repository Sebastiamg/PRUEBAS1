<template>
  <div>
    <div>
      <div>
        <vx-tooltip  style="display: inline-block;" text="Ver historico de facturas devueltas" position="top" color="primary">
          <!---boton de recargar-->
          <vs-button color="primary" @click="getClientes()" type="border"><i class="fa-solid fa-rotate"></i></vs-button>
        </vx-tooltip >
      </div>
      <vs-table max-items="10" search stripe pagination :data="arrayClientes">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayClientes.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Institucion</vs-th>
            <vs-th  style="width:100px;">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  #{{ tr.id_cliente }}
                  {{data[indextr].nombreInstitucion}}<br>
                </vs-td>
                <vs-td>
                  <!--boton para ver codigos devueltos-->
                  <vx-tooltip  style="display: inline-block;" text="Ver historico de facturas devueltas" position="top" color="primary">
                    <vs-button color="primary" @click="ObjectSelected=tr;getHistoricoPreFacturas()" type="border"><i class="fa-solid fa-circle-info"></i></vs-button>
                  </vx-tooltip >
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <!--modales-->
      <!--modal para ver historico de facturas devueltas-->
      <vs-popup classContent="popup-example" fullscreen title="Detalle devoluciones" :active.sync="popupMostrarHistoricoPreFacturas">
        <div v-if="popupMostrarHistoricoPreFacturas">
          <b>Cliente:</b>
          <p>{{ObjectSelected.nombreInstitucion}}</p>
          <TableReutilizableVue
            :title="'Historico de facturas devueltas'"
            :ifexportar="Number(1)"
            :nombrearchivo="ObjectSelected.nombreInstitucion"
            :headers="['codigo','Pre Factura','Empresa','Cliente','Periodo','Documento devolucion','Combo','Paquete','fecha devuelto','Observación']"
            :fieldKeys="['codigo','documento','descripcion_corta','nombreInstitucion','periodoescolar','codigo_devolucion','combo','codigo_paquete','fecha_revisado','observacion']"
            :tableData="arrayHistoricoPreFacturas"
          />
        </div>
      </vs-popup>
    </div>
 </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue');
export default {
  mixins:[Generalmix],
  components:{
    TableReutilizableVue
  },
  data(){
    return{
      arrayClientes:[],
      arrayHistoricoPreFacturas:[],
      ObjectSelected:'',
      popupMostrarHistoricoPreFacturas:false,
    }
  },
  mounted(){
      this.getClientes()
  },
  methods:{
    getClientes(){
      let me = this
      me.arrayClientes = []
      var url = `devoluciones?historicoDevolucionPreFacturasClientes=yes`
      me.$vs.loading()
      this.$http.get(this.$server_url + url)
      .then(response => {
          me.$vs.loading.close()
          me.arrayClientes = response.data

      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error)
      })
    },
    getHistoricoPreFacturas(){
      let me = this
      me.arrayHistoricoPreFacturas = []
      var url = `devoluciones?historicoDevolucionPreFacturas=yes&id_cliente=${this.ObjectSelected.id_cliente}`
      me.$vs.loading()
      this.$http.get(this.$server_url + url)
      .then(response => {
        me.$vs.loading.close()
        me.arrayHistoricoPreFacturas        = response.data
        me.popupMostrarHistoricoPreFacturas = true
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error)
      })
    },
  }
}
</script>
