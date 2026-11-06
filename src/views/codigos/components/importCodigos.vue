<template>
  <div>
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
         <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
                <b>Código</b>
            </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in errores">
          <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.codigo"> {{item.codigo}} </span>
              </div>
          </div>
        </div>
       </div>
    </vs-popup>
    <vs-popup title="Códigos no encontrados" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()"  style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(235,147,25); background: linear-gradient(90deg, rgba(235,147,25,1) 28%, rgba(255,166,0,1) 100%); color: white; border-radius: 5px; padding: 10px;">
        <div class="vx-row">
          <div class="vx-col w-full" align="center">
           <b>Codigos a las que no se aplicaron correctamente</b>
          </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in cedulas_no_encontradas">
          <div class="vx-row">
              <div class="vx-col w-full" align="center"> <span> {{item}} </span> </div>
          </div>
        </div>
       </div>
    </vs-popup>
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estos {{ tableData.length }} códigos?</h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div>
      <vs-row class="mt-3" v-if="desdePedido == 0">
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
            <div style="width:100%;display:flex;">
              <div style="width:40%;">
              <p class="ml-5">Busqueda de la institución</p>
                <vs-input icon="search" class="mt-2 ml-5" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()"  v-model="busquedaInstitucion"/>
              </div>
              <div style="width:10%;margin-left:10px;margin-top:15px;">
                  <vs-button radius color="warning" class="mt-3 ml-5" @click="getInstitucion()" type="filled" icon="search"></vs-button>
              </div>
              <div style="width:40%;margin-left:10px;margin-top:15px;" v-if="!userAsesor">
                 <v-select :options="arregloVentaEstado " :reduce="arregloVentaEstado  => arregloVentaEstado.id" label="name" class="w-full" v-model="venta_estado" />
              </div>
            </div>
        </vs-col>
      </vs-row>
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
                    <vs-th sort-key="nombre">Estado Periodo</vs-th>
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
                          <small class="" >{{ tr.periodo }}</small><br>
                          <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                          <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vs-button type="relief" @click="asignarInstitucion(tr)">Asignar Institucion</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
      </vs-row>
      <div class="mb-6 mt-5" align="center">
        <div class="vx-col w-full">
          <p style="color:#369DDA;">
            <i class="fa fa-file" aria-hidden="true"></i>   Estos códigos  pasarán a estado leído para liquidación  <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
          </p>
          <div v-if="nombreInstitucion.length > 1">
            <p style="color:red;font-weight:bold;">Institucion asignada: <span>{{nombreInstitucion}}</span></p>
          </div>
        </div>
        <br/>
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
        <div>
            <vs-row>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
                <vs-card>
                  <div class="header">
                    <p style="font-weight: bold;">Formato del archivo excel</p>
                    <table class="tabla">
                        <tr>
                          <th class="th1">codigo</th>
                        </tr>
                        <tr>
                          <td class="td1">xxx</td>
                        </tr>
                    </table>
                  </div>
                </vs-card>
              </vs-col>
            </vs-row>
        </div>
        <!-- {{tableData}} -->
        <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
            <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
        </vs-alert>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 ">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)"> Importar {{ tableData.length }} códigos </vs-button>
            </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-alert active="true">
                    Se cambio  {{ porcentaje }} códigos a estado leido
                </vs-alert>
            </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
             <vs-card>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                      <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                    </vs-list-item>
                </vs-list>
              </vs-col>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                    <p>Cantidad <span>{{ codigoNoExiste.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
                      <vs-list-item :key="s" v-for="(tr, s) in codigoNoExiste" icon="check" :title="tr.codigo" >
                      </vs-list-item>
                  </vs-list>
              </vs-col>
            </vs-card>
          </vs-row>
      </div>
    </div>
    <vs-row v-if="codigosPerdidos == true && codigosLeidos.length > 0">
        <vs-card>
          <div class="header">
              <span style="font-weight:bold;">Codigos que ya ha sido liquidados / o leidos / o venta libre - directa / o esta en otro periodo</span>
          </div>
          <TableRadiosCodigosListaVue :arregloCodigos="codigosLeidos" openModal="1"/>
          <!-- <gestionCodigosListaVue :arregloCodigos="codigosLeidos" openModal="1"/> -->
        </vs-card>
    </vs-row>
    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="10" search :data="tableData">
        <template slot="header">
          <h4>Códigos a subir {{tableData.length}}</h4>
        </template>
        <template slot="thead">
          <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
              {{ col }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
    <!--MODALES-->
    <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
    <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosListaVue v-if="popupProblemasCodigosUnion" :arregloCodigos="codigosSinCodigoUnion" openModal="0"/>
    </vs-popup>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
const gestionCodigosListaVue = () => import('./utils/gestionCodigosLista.vue')
// import gestionCodigosListaVue from './utils/gestionCodigosLista.vue'
import TableRadiosCodigosListaVue from './utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue'
import vSelect from 'vue-select'
import ImportExcel from './importExcel.vue'
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosListaVue,
    TableRadiosCodigosListaVue,
  },
  props: {
    pedido: {
      type: Object,
      default: () => ({})
    },
    desdePedido: {
      type: Number,
      default: () => 0
    },
  },
  data () {
    return {
      codigosPerdidos:false,
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      modalConfirm: false,
      modalErrores: false,
      errores: [],
      tipo_selected: '',
      venta_estado:0,
      cedulas_no_encontradas: [],
      modalCedulas: false,
      codigosLeidos:[],
      codigosNoCambiados:[],
      codigoNoExiste:[],
      porcentaje:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      nombrePeriodo:'',
      institucion_id:'',
      radioRegalado:'0',
      arregloVentaEstado: [
        {
          id:0,
          name:"Seleccione el estado"
        },
        {
          id:1,
          name:"Venta directa"
        },
        {
          id:2,
          name:"Venta libre"
        },
      ],
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','userAsesor']),
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos = false
  },
  mounted(){
    let me = this;
    if(me.desdePedido == 1){
      me.institucion_id     = me.pedido.id_institucion
      me.nombreInstitucion  = me.pedido.nombreInstitucion
      me.nombrePeriodo      = me.pedido.periodo
      localStorage.setItem('periodoSeleccionado', me.pedido.id_periodo)
    }
  },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos  = false
      this.header           = header
      this.tableData        = results
      this.sheetName        = meta.sheetName
    },
    procesarPagos(){
        let me = this
        if(me.institucion_id  <  1){
            me.$vs.notify({
            text:'Seleccione una institucion antes de importar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
        }
        if(me.userAsesor) {
        }else{
          if(me.desdePedido == 0){
            if(me.venta_estado == 0 || me.venta_estado == null || me.venta_estado == "" || me.venta_estado == undefined){
                me.$vs.notify({
                text:'Seleccione el venta estado por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
          }

        }
        me.$vs.loading()
        let json_pagos = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_codigos',     json_pagos);
        formData.append('id_usuario',       me.usuario.idusuario);
        formData.append('periodo_id',       localStorage.periodoSeleccionado);
        formData.append('institucion_id',   me.institucion_id)
        formData.append('nombreInstitucion',me.nombreInstitucion)
        formData.append('nombrePeriodo',    me.nombrePeriodo)
        formData.append('venta_estado',     me.venta_estado)
        formData.append('id_group',         me.usuario.id_group)
        formData.append('desdePedido',      me.desdePedido)
        this.$http.post(this.$server_url+'codigos/importar', formData)
        .then(res => {
            me.$vs.loading.close()
            if(res.data.status == 0){
              me.$vs.notify({
              text:res.data.message,
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
              return false
            }
            me.$vs.notify({
            text:'Códigos procesados exitosamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            me.modalConfirm = false
            me.tableData = []
            me.codigosPerdidos = true
            me.codigosLeidos = res.data.codigosLeidos
            me.codigosNoCambiados = res.data.codigosNoCambiados
            me.codigoNoExiste = res.data.codigoNoExiste
            me.codigosSinCodigoUnion  = res.data.codigosSinCodigoUnion
            if(me.codigosSinCodigoUnion.length > 0 && !me.userAsesor){
              me.popupProblemasCodigosUnion = true
            }
            me.porcentaje = res.data.cambiados
        })
        .catch(function (error) {
            me.$vs.notify({
            text:'Verifique que la información se haya guardado correctamente.',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
            me.$vs.loading.close()
            // setTimeout(function() {location.reload()}, 1000);
        })
    },
    openConfirm(tipo) {
      let me = this
      me.tipo_selected = tipo
      if(!me.tableData[0].codigo){
            me.$vs.loading.close()
            me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
            return
        }
      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.codigo){
          me.errores.push(value)
        }
      })
      if( me.errores.length > 0 ){
        me.modalErrores = true
      }else{
        me.modalConfirm = true
      }
    },
    recargar(){
      location.reload()
    },
    //PARA ASIGNAR UNA INSTITUCION
    getInstitucion() {
      let me = this;
      me.instituciones = [];
      me.nombreInstitucion = "";
      me.institucion_id = "";
      if(me.busquedaInstitucion.length < 5){
          me.$vs.notify({
          text:'Minimo 5 caracteres de busqueda',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})

          return false;
      }
      let url = ""
      if(me.userAsesor){
        url = this.$server_url + 'listaInsitucion?asesor=yes&busqueda='+me.busquedaInstitucion+'&cedula='+me.usuario.cedula
      }else{
        url = this.$server_url + 'listaInsitucion?busqueda='+me.busquedaInstitucion
      }
      me.$vs.loading()
      this.$http.get(url)
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
     asignarInstitucion(tr){
       let me = this;
       me.nombreInstitucion = tr.nombreInstitucion
       me.nombrePeriodo     = tr.periodo
       me.institucion_id  = tr.idInstitucion
       me.instituciones = []
       me.getPeriodo(tr.idInstitucion)
     },
    getPeriodo(institucion_id) {
      let me = this;
      this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id='+institucion_id)
        .then(function (res) {
          localStorage.setItem('periodoSeleccionado',res.data[0].periodo)
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
  }
}
</script>
<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {

  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #2D9ADA;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
