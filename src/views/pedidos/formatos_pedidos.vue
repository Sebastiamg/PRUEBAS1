<template>
<vx-card>
  <vs-popup title="Asesores del facturador seleccionado" :active.sync="popupFacturador">
    <div class="flex flex-wrap gap-6">
      <vs-switch  color="dark" class="text-xl p-0" style="width: 45%;" :key="index" v-for="(item, index) in asesores_facturador" v-model="item.asignado" @input="asignar_asesor(item)">
        <span slot="on">{{item.asesor.toUpperCase()}}</span>
        <span slot="off">{{item.asesor.toUpperCase()}}</span>
      </vs-switch>
    </div>
  </vs-popup>
  <!-- fin popup series -->
  <!--MENU-->
  <!-- HTML !-->
  <div v-if="userRoot">
    <button class="button-8 mr-2" @click="menu = 0;tituloMenu = 'Pedidos'" role="button">Pedidos</button>
    <button class="button-8 mr-2" @click="menu = 1;tituloMenu = 'Listado de Guias';getGuias()" role="button">Listado de Guias</button>
    <button class="button-8 mr-2" @click="menu = 2;tituloMenu = 'Obsequios'" role="button">Obsequios</button>
    <button class="button-8 mr-2" @click="menu = 3;tituloMenu = 'Facturadores';get_facturadores()" role="button">Facturadores</button>
    <button class="button-8 mr-2" @click="menu = 4;tituloMenu = 'Solicitud Verificaciones'" role="button">Solicitud Verificaciones</button>
    <button class="button-8 mr-2" @click="menu = 5;tituloMenu = 'Contratos Facturación';getPeriodos();" role="button">Contratos Facturación</button>
  </div>
  <!-- HTML !-->
  <button class="button-33 mt-5" v-if="userRoot" role="button"><ion-icon class="mt-1" name="checkmark-outline"></ion-icon> {{ tituloMenu }}</button>
  <br><br>
  <!--FIN MENU-->
  <!--===============MENU SELECT========-->
  <!--PEDIDOS-->
  <div v-if="userRoot">
    <div v-if="menu == 0">
      <div>
        <ScreenPedidosVue/>
      </div>
    </div>
    <!--LISTADO DE GUIAS-->
    <div v-if="menu == 1">
      <div>
        <listadoGuiasFacturadorVue :pedidos = "arregloGuias" @changeRecarge="changeHandleRecarga"/>
      </div>
    </div>
    <!--OBSEQUIOS-->
    <div v-if="menu == 2">
      <div>
        <ScreenObsequiosFacturadorVue @recargarPeriodos="getPeriodos" />
      </div>
    </div>
    <!--FACTURADORES-->
    <div v-if="menu == 3">
      <div>
        <vs-table search :data="facturadores">
          <template slot="header">
            <h5>Facturadores</h5>
          </template>
          <template slot="thead">
            <vs-th>#</vs-th>
            <vs-th sort-key="facturador">Facturador</vs-th>
            <vs-th >Asesores</vs-th>
            <vs-th style="width: 350px;">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td> {{ tr.idusuario }} </vs-td>
              <vs-td :data="tr.facturador"> {{ tr.facturador }} </vs-td>
              <vs-td>
                <div :key="index_as" v-for="(tr_as, index_as) in tr.asesores"> <b>-</b> {{tr_as.asesor.toUpperCase()}} </div>
              </vs-td>
              <vs-td align="center">
                <vs-button color="primary" type="gradient" size="small" class="m-1 p-2" @click="editar_facturador(tr)">Editar facturador</vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
    <!--SOLICITUD DE VERIFICACIONES-->
    <div v-if="menu == 4">
      <div>
        <HistoricoSolicitudVerificacionesVue/>
      </div>
    </div>
    <!--CONTRATOS FACTURACION-->
    <div v-if="menu == 5">
      <div>
        <div class="flex mt-5">
          <div style="width: 40%;">
            <p> <ion-icon name="contract-outline"></ion-icon>  Seleccione un período</p>
          </div>
          <div style="width: 60%;">
            <v-select :options="arregloPeriodos" @input="f_lista_Asesores()" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodoSelect" />
          </div>
        </div>
        <div class="flex mt-5" v-if="periodoSelect">
          <div style="width: 40%;">
            <p> <ion-icon name="accessibility-outline"></ion-icon> Seleccione un asesor</p>
          </div>
          <div style="width: 60%;">
            <v-select :options="arregloAsesores" :reduce="arregloAsesores => arregloAsesores.idusuario" label="nombres" class="w-full" v-model="asesorSelect" />
          </div>
        </div>
        <listadoContratosVue v-if="asesorSelect" :id_periodo="periodoSelect" :asesorSelect="asesorSelect" desdeAdmin="1"/>
        <br><br><br><br><br><br><br><br><br><br>
      </div>
    </div>
  </div>
  <!--===============FIN MENU SELECT======-->
  <vs-tabs alignment="fixed" v-if="!userRoot">
    <vs-tab label="Pedidos" v-if="usuario.id_group == 23  || usuario.id_group == 22">
        <ScreenPedidosVue/>
    </vs-tab>
    <vs-tab :label="'Listado de guias'" v-if="usuario.id_group == 23 || usuario.id_group == 22 || usuario.id_group == 17 || usuario.id_group == 27"  @click="getGuias()">
      <div>
        <listadoGuiasFacturadorVue :pedidos = "arregloGuias" @changeRecarge="changeHandleRecarga"/>
      </div>
    </vs-tab>
    <vs-tab :label="'Obsequios'">
      <br>
      <ScreenObsequiosFacturadorVue @recargarPeriodos="getPeriodos" />
    </vs-tab>
    <vs-tab v-if="usuario.id_group == 23" label="Facturadores" @click="get_facturadores()">
      <vs-table search :data="facturadores">
        <template slot="header">
          <h5>Facturadores</h5>
        </template>
        <template slot="thead">
          <vs-th>#</vs-th>
          <vs-th sort-key="facturador">Facturador</vs-th>
          <vs-th >Asesores</vs-th>
          <vs-th style="width: 350px;">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td> {{ tr.idusuario }} </vs-td>
            <vs-td :data="tr.facturador"> {{ tr.facturador }} </vs-td>
            <vs-td>
              <div :key="index_as" v-for="(tr_as, index_as) in tr.asesores"> <b>-</b> {{tr_as.asesor.toUpperCase()}} </div>
            </vs-td>
            <vs-td align="center">
              <vs-button color="primary" type="gradient" size="small" class="m-1 p-2" @click="editar_facturador(tr)">Editar facturador</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-tab>
    <!-- <vs-tab :label="'Distribuidores'" v-if="usuario.id_group == 23  || usuario.id_group == 22">
      <br>
      <ScreenDistribuidorVue/>
    </vs-tab> -->
    <vs-tab :label="'Solicitud verificaciones'" v-if="userRoot">
      <HistoricoSolicitudVerificacionesVue/>
    </vs-tab>
    <vs-tab label="Contratos Facturación" @click="getPeriodos();" v-if="userRoot">
      <div class="flex mt-5">
        <div style="width: 40%;">
          <p> <ion-icon name="contract-outline"></ion-icon>  Seleccione un período</p>
        </div>
        <div style="width: 60%;">
          <v-select :options="arregloPeriodos" @input="f_lista_Asesores()" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodoSelect" />
        </div>
      </div>
      <div class="flex mt-5" v-if="periodoSelect">
        <div style="width: 40%;">
          <p> <ion-icon name="accessibility-outline"></ion-icon> Seleccione un asesor</p>
        </div>
        <div style="width: 60%;">
          <v-select :options="arregloAsesores" :reduce="arregloAsesores => arregloAsesores.idusuario" label="nombres" class="w-full" v-model="asesorSelect" />
        </div>
      </div>
      <listadoContratosVue v-if="asesorSelect" :id_periodo="periodoSelect" :asesorSelect="asesorSelect" desdeAdmin="1"/>
      <br><br><br><br><br><br><br><br><br><br>
    </vs-tab>
  </vs-tabs>
  <br><br><br><br>
</vx-card>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import Vue from 'vue';

//Imports
const seriesBasicasVue                    = () => import("./components/seriesBasicas.vue");
const listadoGuiasFacturadorVue           = () => import("./components/Guias/guiasFacturador/listadoGuiasFacturador.vue");
const ScreenPedidosVue                    = () => import("./ScreenPedidos.vue");
const ScreenObsequiosFacturadorVue        = () => import("./obsequios/ScreenObsequiosFacturador.vue");
const HistoricoSolicitudVerificacionesVue = () => import("../temporadas/HistoricoSolicitudVerificaciones.vue");
// const listadoContratosVue                 = () => import("./asesor/contratos/listadoContratos.vue");
const ScreenDistribuidorVue               = () => import("./components/distribuidores/ScreenDistribuidor.vue");
//Components
export default {
    components:{
      flatPickr,
      'v-select': vSelect,
      seriesBasicasVue,
      listadoGuiasFacturadorVue,
      ScreenPedidosVue,
      ScreenObsequiosFacturadorVue,
      HistoricoSolicitudVerificacionesVue,
      // listadoContratosVue,
      ScreenDistribuidorVue,
    },
    data: () => ({
      menu:0,
      tituloMenu:'Pedidos',
      usuario:[],
      popupPedido: false,
      popupFacturador: false,
      facturadores: [],
      asesores_facturador: [],
      arregloGuias:[],
      alert_formato: true,
      libro_search: '',
      facturador_selected: '',
      porcentaje_pedido:0,
      userRoot:false,
      //contador pedidos
      cont_obsequios:0,
      cont_guias:0,
      cont_obsequios_aprobados:0,
      obsequios_autorizado:0,
      //fin contador pedidos
      //VARIABLES PARA VER CONTRATOS FACTURACION
      arregloPeriodos:[],
      arregloAsesores:[],
      asesorSelect:'',
      periodoSelect:'',
      //FIN VARIABLES PARA VER CONTRATOS FACTURACION
    }),
    mounted() {
      let me = this
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.usuario_id = this.usuario.idusuario
      me.getUserRoot(me.usuario);
      me.getGuias()
      me.getContadorPedidos()
      me.periodoSelect = ""
      me.asesorSelect  = ""
    },
    methods: {
      getPeriodos(){
        let me = this
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_periodos_pedidos')
        .then(res => {
          me.$vs.loading.close();
          let datos = res.data
          me.arregloPeriodos = datos
        })
        .catch(function (error) {
          me.$vs.loading.close();
        })
      },
      f_lista_Asesores() {
        let me = this;
        if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
          me.periodoSelect = ''
          me.asesorSelect  = ''
          return
        }
        this.$http.get(this.$server_url + 'listaAsesores')
          .then(function (res) {
            me.arregloAsesores = res.data
            me.$vs.loading.close()
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },
      getContadorPedidos() {
        let me = this;
        this.$http.get(this.$server_url + 'getContadorPedidos?grupo='+me.usuario.id_group+'&idusuario='+me.usuario.idusuario)
          .then((res) => {
            me.cont_obsequios           = res.data.cont_obsequios
            me.cont_obsequios_aprobados = res.data.cont_obsequios_aprobados
            me.cont_guias               = res.data.cont_guias
            if(me.usuario.id_group == 22 || me.usuario.id_group == 23){
              me.$vs.notify({
              text:`
              Guias pendientes:   ${me.cont_guias} <br>
              Obsequios Pendientes: ${me.cont_obsequios}

              `,
              color:'success',
              iconPack: 'feather',
              icon:'icon-check',
              time:10000
              })
            }
            if(res.data.root == 1){
              me.$vs.notify({
              text:`
              Guias pendientes:   ${me.cont_guias}<br>
              Obsequios Pendientes: ${me.cont_obsequios} <br>
              Obsequios Aprobados: ${me.cont_obsequios_aprobados} <br>
              Obsequios Autorizados: ${me.obsequios_autorizado} <br>
              `,
              color:'success',
              iconPack: 'feather',
              icon:'icon-check',
              time:10000
              })
            }
            //admin no root
            if(res.data.root == 0 && me.usuario.id_group == 1){
              me.$vs.notify({
              text:`
              Obsequios Aprobados: ${me.cont_obsequios_aprobados} <br>
              Obsequios Autorizados: ${me.obsequios_autorizado} <br
              `,
              color:'success',
              iconPack: 'feather',
              icon:'icon-check',
              time:10000
              })
            }

          })
          .catch((err) => {
            console.log(err)
          })
      },
      changeHandleRecarga(e){
        let me = this;
        me.getGuias()
      },
      getGuias(){
        let me = this;
        me.arregloGuias = []
        me.$vs.loading()
        this.$http.get(this.$server_url+'get_pedidos_guias')
        .then(res => {
          me.$vs.loading.close()
          let datos = res.data
          if(datos.length == 0){
            me.arregloGuias = []
            return
          }
          // if(me.usuario.idusuario == 68990){
          //   me.arregloGuias = datos
          //   return
          // }
          if( me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1 ){
            me.arregloGuias = datos.filter(p => p.pedido_facturacion == 1)
            return
          }
          if( me.usuario.id_group == 17 || me.usuario.id_group == 27 ){
            me.arregloGuias = datos.filter(p => p.pedido_bodega == 1)
            return
          }
          if( me.usuario.id_group == 11 || me.usuario.id_group == 11 ){
            me.arregloGuias = datos.filter(p => p.pedido_asesor == 1)
            return
          }
        })
        .catch((e) =>{
          me.$vs.loading.close()
        })
      },
      getUserRoot(dato) {
        let me = this;
        this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
          .then((result) => {
            if (result.data.length > 0) {
              me.userRoot = true;
            }
          })
          .catch((err) => {
              console.log(err)
          })
      },

      get_facturadores(){
        let me = this
        this.$http.get(this.$server_url+'get_facturadores_pedido')
        .then(res => {
            me.facturadores = res.data
        })
      },
      editar_facturador(item){
        let me = this
        me.facturador_selected = item.idusuario
        this.$http.get(this.$server_url+'get_asesores_factuador/'+item.idusuario)
        .then(res => {
            me.asesores_facturador = res.data
            me.popupFacturador = true
        })
      },
      asignar_asesor(item){
        let me = this
        me.$vs.loading()
        this.$http.get(this.$server_url+'asignar_asesor_fact/'+me.facturador_selected+'/'+item.idusuario+'/'+item.asignado)
        .then(res => {
            me.get_facturadores()
            me.$vs.loading.close()
        })
      },
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

input[type=number].input_pvp::-webkit-inner-spin-button,
input[type=number].input_pvp::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
input[type=number].input_pvp { -moz-appearance:textfield; }

input[type=number].input_pvp {
  font-size: 18px !important;
  text-align: center;
  color: rgb(60, 108, 192);
  border-radius: 5px;
  border: 2px solid rgb(183, 183, 183);
  width: 100%;
}
/*ESTILOS BTN*/
/* CSS */
.button-8 {
  background-color: #e1ecf4;
  border-radius: 3px;
  border: 1px solid #7aa7c7;
  box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;
  box-sizing: border-box;
  color: #39739d;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.15385;
  margin: 0;
  outline: none;
  padding: 8px .8em;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  white-space: nowrap;
}

.button-8:hover,
.button-8:focus {
  background-color: #b3d3ea;
  color: #2c5777;
}

.button-8:focus {
  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);
}

.button-8:active {
  background-color: #a0c7e4;
  box-shadow: none;
  color: #2c5777;
}
/**BOTON SELECCIONADO */
/* CSS */
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}
</style>
