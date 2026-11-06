<template>
  <div>
    <vx-card>
      <!--BUSQUEDA DE INSTITUCIONES Y TIPO DE VENTA-->
      <vs-row class="mt-3">
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
          <div style="width:100%;display:flex;flex-wrap: wrap;">
            <div style="width:50%;">
            <p class="ml-5">Búsqueda de la institución</p>
              <vs-input icon="search" class="mt-2 ml-5" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()"  v-model="busquedaInstitucion"/>
            </div>
            <div style="width:10%;margin-left:10px;margin-top:15px;">
              <vs-button radius color="warning" class="mt-3 ml-5" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            </div>
          </div>
        </vs-col>
      </vs-row>
      <!--TABLA INSTITUCIONES-->
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
          <vs-table stripe max-items="50" v-if="instituciones.length > 0" style="width: 100%;" search pagination :data="instituciones">
              <template slot="header">
                <div class="vx-row">
                  <div class="vx-col w-full m-3">
                      Cantidad: {{instituciones.length}}
                  </div>
                </div>
              </template>
              <template slot="thead">
                <vs-th sort-key="idInstitucion">#</vs-th>
                <vs-th sort-key="nombreInstitucion">Institución (asesor)</vs-th>
                <vs-th sort-key="nombre">Localidad</vs-th>
                <vs-th sort-key="nombre">Periodo</vs-th>
                <vs-th sort-key="nombre">Accion</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].idInstitucion ">
                    {{data[indextr].idInstitucion }}
                  </vs-td>
                  <vs-td :data="data[indextr].nombreInstitucion">
                    {{data[indextr].nombreInstitucion}}<br>
                    <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                        <small> <i style="color:red;">No existe asesor </i></small><br>
                    </div>
                    <div v-else>
                        <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
                    </div>
                    <small>{{data[indextr].fecha_registro}} </small>
                  </vs-td>
                  <vs-td :data="data[indextr].nombreregion">
                      {{data[indextr].nombreregion}} <br>
                      <small>{{data[indextr].ciudad}}</small>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.EstadoConfiguracion == 1">
                        {{ tr.periodoNombreConfigurado }}
                    </div>
                    <div v-else>
                      <small class="" >{{ tr.periodo }}</small><br>
                      <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                      <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                    </div>
                  </vs-td>
                  <vs-td>
                      <div class="flex">
                        <vs-button icon="code" size="small" color="dark" @click="pedido=tr;getTipoVenta(tr);" class="ml-4">Ver revisión venta</vs-button>
                      </div>
                  </vs-td>
                </vs-tr>
              </template>
          </vs-table>
        </vs-col>
      </vs-row>
      <!--MODALES-->
      <!--MODAL PARA VER TIPO DE VENTA-->
      <vs-popup class="holamundo" fullscreen :title="titulo" :active.sync="popupTipoVenta">
        <RevisionVentaVue v-if="popupTipoVenta" :pedido="pedido"/>
      </vs-popup>
    </vx-card>
  </div>
</template>
<script>
import RevisionVentaVue from '@/views/codigos/components/utils/RevisionVenta'
export default{
  data(){
    return{
      usuario:[],
      instituciones:[],
      titulo:'',
      busquedaInstitucion:'',
      popupTipoVenta:false,
      pedido:{},
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  components:{
    RevisionVentaVue,
  },

  methods:{
    getInstitucion() {
      let me = this;
      me.instituciones = [];
      if(me.busquedaInstitucion.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?busqueda='+me.busquedaInstitucion)
        .then(function (res) {
          me.instituciones = res.data;
          me.$vs.loading.close()
          if(res.data.message){
            me.$vs.notify({
            text: res.data.message,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-user'
            })
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    getTipoVenta(tr) {
      let me = this;
      me.titulo               = 'Detalle de venta de ' + me.pedido.nombreInstitucion
      me.popupTipoVenta       = true;
    },
  },
}
</script>
