<template>
<vx-card>
  <vs-tabs alignment="fixed" v-if="usuario.id_group == 11">
      <vs-tab label="Pedidos">
        <vs-table search :data="periodos">
          <template slot="header">
            <h5>Formatos por periodo</h5>
          </template>

          <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="periodoescolar">Periodo</vs-th>
            <vs-th style="width: 200px;">Acciones</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td> {{ indextr+1 }} </vs-td>
              <vs-td :data="tr.periodoescolar"> {{ tr.periodoescolar }} </vs-td>
              <vs-td>
                <div v-if="usuario">
                  <vs-button color="primary" type="gradient" size="small" class="m-1" @click="ver_pedidos_periodo(tr)">Ver pedidos</vs-button>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
      <vs-tab label="Obsequios">
        <vs-table search :data="periodosObsequios">
          <template slot="header">
            <h5>Formatos por periodo</h5>
          </template>
          <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="periodoescolar">Periodo</vs-th>
            <vs-th style="width: 200px;">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td> {{ indextr+1 }} </vs-td>
              <vs-td :data="tr.periodoescolar"> {{ tr.periodoescolar }} </vs-td>
              <vs-td>
                <div v-if="usuario">
                  <vs-button color="primary" type="gradient" size="small" class="m-1" @click="ver_obsequios_periodo(tr)">Ver pedidos</vs-button>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
      <vs-tab label="Búsqueda por contrato">
        <div>
            <pedidosBusquedaVue/>
        </div>
      </vs-tab>
      <vs-tab label="Reporte instituciones">
        <div>
            <ReporteInstitucionVentaVue/>
        </div>
      </vs-tab>
    </vs-tabs>
</vx-card>
</template>

<script>
import pedidosBusquedaVue from '../temporadas/pedidosBusqueda.vue';
import ReporteInstitucionVentaVue from './gerencia/reportes/ReporteInstitucionVenta'
export default {
    components:{
      pedidosBusquedaVue,
      ReporteInstitucionVentaVue,
    },
    data: () => ({
        usuario: [],
        periodos: [],
        periodosObsequios:[],
    }),
    mounted() {
      localStorage.removeItem('id_periodo_selected')
      localStorage.removeItem('descripcion_periodo')
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.usuario_id = this.usuario.idusuario
      this.getPeriodos()
    },
    methods: {
      getPeriodos(){
        let me = this
        this.$http.get(this.$server_url+'get_periodos_pedidos')
        .then(res => {
          let datos = res.data
          if(datos.length == 0){
            me.periodos = []
            me.periodosObsequios = []
            return
          }
        
          if( me.usuario.id_group == 11 ){
            //====PEDIDOS
            me.periodos = datos.filter(p => p.pedido_asesor == 1)
            //====OBSEQUIOS
            me.periodosObsequios = datos.filter(p => p.obsequio_asesor == 1)
            return
          }
        })
      },
      ver_pedidos_periodo(item){
        let me = this
        localStorage.id_periodo_selected  = item.idperiodoescolar
        localStorage.descripcion_periodo  = item.periodoescolar
        me.$router.push('/listado_pedidos_asesor/'+item.idperiodoescolar+'/'+item.periodoescolar)
      },
      ver_obsequios_periodo(item){
        let me = this
        localStorage.id_periodo_selected  = item.idperiodoescolar
        localStorage.descripcion_periodo  = item.periodoescolar
        me.$router.push('/listado_obsequios_asesor/'+item.idperiodoescolar+'/'+item.periodoescolar)
      }
    },
}
</script>

<style>
.label_inputs{
  font-size: 12px;
  color: rgb(143, 143, 143);
  margin-top: 4px;
  padding-left: 4px;
}

.input_pvp{
  border-radius: 4px;
  height: 32px;
  border: 2px solid rgb(132, 158, 241);
  padding: 7px;
  color: rgb(111, 111, 111);
  font-size: 16px;
  width: 80px;
  text-align: center;
}

.alerta_formato{
  font-size: 15px;
  background-color: rgb(255, 222, 195);
  color: rgba(255, 132, 0, 0.867);
  padding: 8px;
  border-radius: 7px;
  width: 90%;
  min-width: 350px;
}

.card_pvp{
  border-radius: 10px;
  padding: 10px 5px 10px 5px;
  background-color: rgba(235, 242, 255, 0.59);
}
</style>
