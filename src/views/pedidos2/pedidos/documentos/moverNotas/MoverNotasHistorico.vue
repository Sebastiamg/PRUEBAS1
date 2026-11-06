<template>
    <div>
      <vx-card>
        <vs-table max-items="10" search pagination :data="arrayHistoricoNotas">
          <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayHistoricoNotas.length }}</b></vs-chip>
          </template>
          <template slot="thead">
            <vs-th>Movimiento</vs-th>
            <vs-th>Pre factura</vs-th>
            <vs-th>Empresa</vs-th>
            <vs-th>Editor</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{data[indextr].descripcion}}<br>
                <b>Tipo Movimiento</b>
                <div v-if="tr.tipo == 0">
                   <vs-chip color="primary">Movimiento de notas a pre factura</vs-chip>
                </div>
                <div v-else>
                  <b>Cantidad:</b>
                  <p>{{tr.cantidad}}</p>
                   <vs-chip color="primary">Movimiento de libro pre facturas</vs-chip>
                </div>
              </vs-td>
              <vs-td>
                {{data[indextr].nueva_prefactura}}<br>
              </vs-td>
              <vs-td>
                {{data[indextr].descripcion_corta}}<br>
                <b>Período:</b>
                <p>{{data[indextr].periodoescolar}}</p>
              </vs-td>
              <vs-td>
                {{data[indextr].editor}}<br>
                <b>Observaciones:</b>
                <p>{{data[indextr].observacion}}</p>
                <b>Fecha Movimiento:</b>
                <p>{{data[indextr].created_at}}</p>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vx-card>
    </div>
  </template>

  <script>
  import { mapState } from 'vuex';
  export default {
    data(){
      return{
        arrayHistoricoNotas:[],
      }
    },
    computed: {
      ...mapState(['userRoot','AdminBodega']),
    },
    props:{
      periodo_id:{
        type:Number,
        default:0
      },
      nombrePeriodo:{
        type:String,
        default:""
      }
    },
    mounted(){
      this.getHistoricoNotas()
    },
    methods:{
      getHistoricoNotas(){
        let me = this
        me.arrayNotas = []
        var url = "";
        url = `metodosGetVentas?getMovimientosNotas=1&periodo_id=${this.periodo_id}`
        this.$http.get(this.$server_url+url)
          .then(response => {
            this.arrayHistoricoNotas = response.data
          })
          .catch(function (error) {
            console.log(error + ' error');
          });
      }
    },
  }
  </script>

