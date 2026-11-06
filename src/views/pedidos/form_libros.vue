<template>
  <div>
    <div class="w-full flex flex-wrap gap-10 items-center text-xl justify-end">
      <vs-radio color="warning" v-model="tipo_form" vs-value="textos" vs-name="tipo_textos" @input="activar_tipo()">Textos</vs-radio>
    </div>
    <vs-list v-if="tmpPedidos">
      <vs-list-header title="Datos"></vs-list-header>
      <vs-list-item title="Institución" :subtitle="tmpPedidos.nombreInstitucion + ' ('+tmpPedidos.nombre_ciudad+')'"></vs-list-item>
      <vs-list-item title="Asesor"      :subtitle="tmpPedidos.responsable"></vs-list-item>
      <vs-list-item title="Período"     :subtitle="tmpPedidos.periodo"></vs-list-item>
    </vs-list>
    <vs-collapse>
      <vs-collapse-item :key="index" v-for="(item, index) in series">
        <div slot="header" class="text-center"> <b>{{item.nombre_serie.toUpperCase()}}</b> </div>
        <div class="w-full" style="overflow-x:auto;">
          <table class="table_pedidos">
              <tr class="text-center">
                <td rowspan="3" style="width: 200px;"><b>Áreas</b></td>
                <td colspan="20"><b>Niveles</b></td>
                <td rowspan="3" style="width: 70px;" v-if="tipo_form == 'textos'"><b>PVP</b></td>
              </tr>
              <tr class="text-center">
                <td colspan="2"><b>1</b></td> <td colspan="2"><b>2</b></td> <td colspan="2"><b>3</b></td> <td colspan="2"><b>4</b></td> <td colspan="2"><b>5</b></td> <td colspan="2"><b>6</b></td> <td colspan="2"><b>7</b></td> <td colspan="2"><b>8</b></td> <td colspan="2"><b>9</b></td> <td colspan="2"><b>10</b></td>
              </tr>
              <tr class="text-center">
                <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td> <td><b>GUÍA</b></td> <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
              </tr>
              <tr class="text-center" align="center" :key="indextr" v-for="(tr, indextr) in item.areas">
                <td style="background-color: #046AE7;color:white;"> <b>{{tr.nombrearea}}</b> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n1 == '' || tr.n1 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+0" @blur="guardar_valor(tr.idarea, item.id_serie, 0,1)"  :hidden="!tr.n1"  :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n1 == '' || tr.n1 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+1" @blur="guardar_valor(tr.idarea, item.id_serie, 1,1)"         :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11 ) ? !tr.n1 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n2 == '' || tr.n2 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+2" @blur="guardar_valor(tr.idarea, item.id_serie, 2,2)"   :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n2 == '' || tr.n2 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+3" @blur="guardar_valor(tr.idarea, item.id_serie, 3,2)"         :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n2 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n3 == '' || tr.n3 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+4" @blur="guardar_valor(tr.idarea, item.id_serie, 4,3)"   :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n3 == '' || tr.n3 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+5" @blur="guardar_valor(tr.idarea, item.id_serie, 5,3)"         :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n3 : true" /></td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n4 == '' || tr.n4 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+6" @blur="guardar_valor(tr.idarea, item.id_serie, 6,4)"   :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n4 == '' || tr.n4 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+7" @blur="guardar_valor(tr.idarea, item.id_serie, 7,4)"         :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n4 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n5 == '' || tr.n5 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+8" @blur="guardar_valor(tr.idarea, item.id_serie, 8,5)"   :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n5 == '' || tr.n5 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+9" @blur="guardar_valor(tr.idarea, item.id_serie, 9,5)"         :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n5 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n6 == '' || tr.n6 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+10" @blur="guardar_valor(tr.idarea, item.id_serie, 10,6)" :disabled="true"/> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n6 == '' || tr.n6 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+11" @blur="guardar_valor(tr.idarea, item.id_serie, 11,6)"       :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n6 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n7 == '' || tr.n7 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+12" @blur="guardar_valor(tr.idarea, item.id_serie, 12,7)" :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n7 == '' || tr.n7 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+13" @blur="guardar_valor(tr.idarea, item.id_serie, 13,7)"       :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n7 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n8 == '' || tr.n8 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+14" @blur="guardar_valor(tr.idarea, item.id_serie, 14,8)" :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n8 == '' || tr.n8 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+15" @blur="guardar_valor(tr.idarea, item.id_serie, 15,8)"       :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n8 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n9 == '' || tr.n9 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+16" @blur="guardar_valor(tr.idarea, item.id_serie, 16,9)" :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n9 == '' || tr.n9 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+17" @blur="guardar_valor(tr.idarea, item.id_serie, 17,9)"       :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n9 : true" /> </td>
                <td> <input :class="['input_pvp_tabla t_guia',  (tr.n10 == '' || tr.n10 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+18" @blur="guardar_valor(tr.idarea, item.id_serie, 18,10)"  :disabled="true" /> </td>
                <td> <input :class="['input_pvp_tabla t_texto', (tr.n10 == '' || tr.n10 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+19" @blur="guardar_valor(tr.idarea, item.id_serie, 19,10)" :disabled="((contrato_generado == null || contrato_generado == '')) || (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null) || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ?  !tr.n10 : true" /> </td>
                <td><input class="input_pvp_tabla input_pvp" v-show="tipo_form == 'textos'" readonly type="number" :id="item.id_serie+'_'+tr.idarea+'_'+20" :value="tr.pvp" /> </td>
              </tr>
              <tr class="text-center">
                <td> <b style="font-size: 12px;">{{tipo_form == 'textos' ? 'TOTAL TEXTOS' :'TOTAL GUIAS'}}</b> </td>
                <td colspan="7" v-show="tipo_form == 'textos'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie_'+item.id_serie" type="number" /> </td>
                <td colspan="7" v-show="tipo_form == 'guias'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie2_'+item.id_serie" type="number" /> </td>
                <td colspan="6" style="font-size: 12px;" v-show="tipo_form == 'textos'"> <b>TOTAL USD</b> </td>
                <td colspan="8" class="input_totales" v-show="tipo_form == 'textos'"> <input readonly class="input_totales input_pvp_tabla" :id="'total_usd_serie_'+item.id_serie" type="number" /> </td>
              </tr>
          </table>
        </div>
      </vs-collapse-item>
      <vs-collapse-item>
        <div slot="header" class="text-center"> <b>PLAN LECTOR</b> </div>
        <div class="w-full" style="overflow-x:auto;">
          <table class="table_pedidos">
            <tr class="text-center">
              <td><b>LIBRO</b></td>
              <td><b>GUÍA</b></td>
              <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
              <td style="width: 100px;">&nbsp;<b>PVP</b>&nbsp;&nbsp;</td>
            </tr>
            <tr class="text-center" align="center" :key="index" v-for="(item, index) in series_plan_lector">
                <td style="background-color: #046AE7;color: white;"> <b>{{item.nombrelibro}}</b> </td>
                <td> <input class="input_pvp_tabla t_guia" type="number" :id="6+'_'+item.id_libro+'_'+0" @blur="guardar_valor(item.id_libro, 6, 0,-1)"    :disabled="true"/> </td>
                <td> <input class="input_pvp_tabla t_texto" type="number" :id="6+'_'+item.id_libro+'_'+1" @blur="guardar_valor(item.id_libro, 6, 1,-1)"   :disabled="((contrato_generado == null || contrato_generado == '')) ||  (groupFacturador && cantidadVerificaciones == 0 && sendPedido.ca_codigo_agrupado == null)  || (sendPedido.permitir_editar_despues_contrato == 1 && sendPedido.ca_codigo_agrupado == null && usuario.id_group==11) ? false:true" /> </td>
                <td> <input class="input_pvp_tabla input_pvp" readonly type="number" :value="item.pvp" :id="6+'_'+item.id_libro+'_'+20" /> </td>
            </tr>
            <tr class="text-center">
              <td> <b style="font-size: 12px;">{{tipo_form == 'textos' ? 'TOTAL TEXTOS' :'TOTAL GUIAS'}}</b> </td>
              <td colspan="2" v-show="tipo_form == 'textos'" style="font-size: 12px;"> <b>TOTAL USD</b> </td>
            </tr>
            <tr class="text-center">
              <td colspan="2" v-show="tipo_form == 'textos'"  class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie_'+6" type="number" /> </td>
              <td colspan="2" v-show="tipo_form == 'guias'"  class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie2_'+6" type="number" /> </td>
              <td colspan="2" v-show="tipo_form == 'textos'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_usd_serie_'+6" type="number" /> </td>
            </tr>
          </table>
        </div>
      </vs-collapse-item>
    </vs-collapse>
    <div class="w-full text-right">
      <b>
        CANTIDAD DE UNIDADES DE LIBROS TOTAL : <div style="width: 120px; display: inline-block;">{{total_unidades}} </div><br>
        VENTA BRUTA : <div style="width: 120px; display: inline-block;">{{total_usd.toFixed(2)}} </div><br>
        <!-- {{porcentaje_descuento}}% COMISION: <div style="width: 120px; display: inline-block;">{{((total_usd*porcentaje_descuento)/100).toFixed(2) }} </div><br> -->
        <!-- TOTAL : <div style="width: 120px; display: inline-block;">{{(total_usd - ((total_usd*porcentaje_descuento)/100)).toFixed(2)}} </div> -->
        VENTA BRUTA SERIES BÁSICAS : <div style="width: 120px; display: inline-block;">{{ suma_bruta_series_b.toFixed(2) }} </div><br>
        MULTIPLICACION PORCENTAJE CONFG {{ porcentaje_descuento_series_basicas }}% : <div style="width: 120px; display: inline-block;">{{ multiplicacionPConfigurado }} </div><br>
        CALCULO AUTORIZADO : <div style="width: 120px; display: inline-block;">{{ RestaAutorizada.toFixed(2) }} </div><br>
        {{porcentaje_descuento}}% COMISION CALCULO AUTORIZADO: <div style="width: 120px; display: inline-block;">{{ resultadoComisionAsesor }} </div><br>
        <!-- ANTICIPO <div style="width: 120px; display: inline-block;">{{ Math.abs(anticipoAprobado)  }} </div><br> -->
        ANTICIPO SUGERIDO<div style="width: 120px; display: inline-block;">{{ Math.abs(pedido.anticipo)  }} </div><br>
        PENDIENTE POR LIQUIDAR  <div style="width: 120px; display: inline-block;">{{ pendienteLiquidar.toFixed(2) }} </div><br>
      </b>
    </div>
  </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
import axios from 'axios'
import {
    mapState
} from "vuex";
export default {
    components:{
      flatPickr,
      'v-select': vSelect,
    },
    data: () => ({
      usuario: [],
      series: [],
      series_plan_lector: [],
      tipo_form: 'textos',
      id_periodo: '',
      id_pedido: '',
      total_usd: 0,
      total_unidades: 0,
      total_unidades_guias:0,
      porcentaje_descuento: 0,
      porcentaje_descuento_series_basicas:0,
      //variables para observacion y anticipo
      pedido:{
        id_pedido: 0, periodo: '', tipo_venta: '', fecha_envio: '', fecha_entrega: '', institucion: '', asesor: '', descuento: '', anticipo: '',ifanticipo:0,observacion:'', ruc:'', direccionInstitucion:'', nivel:'',tipo_descripcion:'', telefonoInstitucion:'',id_periodo:''
      },
      //fin variables para  observacion y anticipo
      suma_bruta_series_b:0,
      arregloSeriesBasicas:[],
      pendienteLiquidar:0,
      anticipo_aprobado:0,
      contrato_generado:'',
      multiplicacionPConfigurado:0,
      RestaAutorizada:0,
      resultadoComisionAsesor:0,
      //variables de series basicas
      sendPedido:'',
      cantidadVerificaciones:0,
    }),
    props:{
      tmpPedidos:{
        type:Object,
        default:{},
        required:true
      },
      selectifanticipo:{
        type:Boolean,
        default:false,
        required:true
      },
      anticipoAprobado:{
        type:Number,
        default:0,
        required:true
      },
    },
    mounted() {
      let me          = this
      this.id_periodo = me.tmpPedidos.id_periodo
      this.usuario    = JSON.parse(localStorage.getItem('usuario'))
      this.id_pedido  = me.tmpPedidos.id_pedido
      this.usuario_id = this.usuario.idusuario
      me.sendPedido = me.ObjectPedido
      this.getSeries()
      this.getAreasBasicas()
      this.getLibrosPlanLector()
      this.cantidadVerificaciones = this.tmpPedidos.verificaciones
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    methods: {
      getSeries(){
        let me = this
        me.$vs.loading()
        this.$http.get(this.$server_url+'series_formato_periodo/'+me.id_periodo)
        .then(res => {
          me.series = res.data
          me.getLibrosPlanLector()
          me.$vs.loading.close()
        })
        .catch(err => {
          me.$vs.loading.close()
        })
      },
      getAreasBasicas(){
        let me = this;
        me.$vs.loading()
        this.$http.get(this.$server_url+'getSeriesBasicas/'+me.id_periodo)
        .then(res => {
          me.arregloSeriesBasicas = res.data.filter(p => p.serie_basica == 1)
          me.$vs.loading.close()
        })
        .catch(err => {
          me.$vs.loading.close()
        })
      },
      getLibrosPlanLector(){
        let me = this
        me.$vs.loading()
        this.$http.get(this.$server_url+'get_pvp_planes_periodo/'+me.id_periodo)
        .then(res => {
            me.series_plan_lector = res.data
            me.get_val_pedido()
            me.$vs.loading.close()
          })
        .catch(err => {
          me.$vs.loading.close()
          })
      },
      get_val_pedido(){
        let me = this
        if(!me.id_pedido){
          return
        }
        me.$vs.loading()
        this.$http.get(this.$server_url+'get_val_pedido/'+me.id_pedido)
        .then(res => {
            me.porcentaje_descuento                = res.data[0].descuento
            me.porcentaje_descuento_series_basicas = res.data[0].porcentaje_descuento
            me.contrato_generado                   = res.data[0].contrato_generado
            $.each(res.data,function(key, value){
              try {
                // console.log(value.id_serie+'_'+value.id_area+'_'+value.tipo_val + ' == ' + value.valor)
                document.getElementById(value.id_serie+'_'+value.id_area+'_'+value.tipo_val).value = value.valor
              } catch (error) {
              }
            });
            me.activar_tipo()
            let array_series = []
            array_series = me.groupArrayOfObjects(res.data, "id_serie")
            me.total_usd = 0
            me.total_unidades = 0
            me.total_unidades_guias = 0
            $.each(array_series,function(key, value){
              let array_areas_serie = []
              array_areas_serie = me.groupArrayOfObjects(value, "id_area")
              let total_serie = 0;
              let total_libros = 0;
              let total_guias  = 0;
              var val_pvp_area = 0
              $.each(array_areas_serie,function(key_1, value_1){ // recorre las areas de cada serie
                let sum_celdas_area = 0;
                $.each(value_1,function(key_2, value_2){ // recorre las celdas de cada area; tipo_val = posicion celda
                  // console.log('value_2.tipo_val: '+value_2.tipo_val+' value_2.valo: '+value_2.valor)
                  if( parseInt(value_2.tipo_val) % 2 != 0 ){ //sumar solo cantidades de textos
                    total_libros += value_2.valor
                    sum_celdas_area += value_2.valor
                  }
                  if( parseInt(value_2.tipo_val) % 2 == 0 ){ //sumar solo cantidades de las guias
                    total_guias += value_2.valor
                  }
                });
                //valor de pvp de area
                val_pvp_area = document.getElementById(value[0].id_serie+'_'+value_1[0].id_area+'_'+20).value //obtiene el pvp de cada area
                // console.log('sum_celdas_area*val_pvp_area = '+sum_celdas_area+' * '+val_pvp_area)
                total_serie += (sum_celdas_area*val_pvp_area)
              });
              document.getElementById('total_textos_serie_'+value[0].id_serie).value = total_libros
              document.getElementById('total_textos_serie2_'+value[0].id_serie).value = total_guias
              document.getElementById('total_usd_serie_'+value[0].id_serie).value = total_serie.toFixed(2)
              me.total_usd = me.total_usd + parseFloat(total_serie);
              me.total_unidades = me.total_unidades + parseInt(total_libros);
              me.total_unidades_guias = me.total_unidades_guias + parseInt(total_guias)
              //me.guardarTotalPedido()
            });
            me.sumarAreasBasicas()
            me.guardarTotalPedido()
            me.$vs.loading.close()

        })
        .catch(err => {
          me.$vs.loading.close()
        })
      },
      sumarAreasBasicas(){
        let me = this;
        var resultado = 0
        me.arregloSeriesBasicas.forEach(element => {
          var valor = ''
          if(document.getElementById('total_usd_serie_'+element.id_serie)){
            valor = parseFloat(document.getElementById('total_usd_serie_'+element.id_serie).value)
            if (!isNaN(valor)) {
              resultado += valor;
            }
          }
        });
        me.suma_bruta_series_b            = resultado
        me.multiplicacionPConfigurado     =  ((me.suma_bruta_series_b*this.porcentaje_descuento_series_basicas)/100).toFixed(2)
        me.RestaAutorizada                =  (( me.suma_bruta_series_b ) - ( me.multiplicacionPConfigurado ))
        me.resultadoComisionAsesor         =  ((me.RestaAutorizada*me.porcentaje_descuento)/100).toFixed(2)
          //suma de series basica
          //se mutltiplica * el porcentaje de configuracion
          //se resta el valor sumas basica - la multiplicacion del porcentaje
          //se multiplica el resultado de ese valor x la comision del asesor
          //se multiplica el resultado de la comision del asesor * 0.50
          let anticipoSugerido50            =  ((me.resultadoComisionAsesor*50)/100).toFixed(2)
          me.pedido.anticipo                = anticipoSugerido50
          // me.pendienteLiquidar           = me.resultadoComisionAsesor - Math.abs(me.anticipoAprobado)
          me.pendienteLiquidar              = me.resultadoComisionAsesor - Math.abs(me.pedido.anticipo)
        let datos = {
          anticipo:me.pedido.anticipo,
          liquidar:me.pendienteLiquidar
        }
        me.$emit('changePedido',datos)
      },
      EsMultiploDeCinco(numero) {
          return numero % 5 == 0;
      },
      async guardar_valor(id, serie, index,libro){
        let me = this
        if( document.getElementById(serie+'_'+id+'_'+index).value == '' ){ // no guardar cuando no se digita algo
          return;
        }
        const valorGet = parseInt(document.getElementById(serie+'_'+id+'_'+index).value)
        // if(valorGet > 0){
        //    //validar si es multiplo de 5
        //   if(me.EsMultiploDeCinco(valorGet)){  }else{
        //     me.$vs.notify({ text: 'El valor debe ser multiplo de 5', color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
        //     document.getElementById(serie+'_'+id+'_'+index).value = ''
        //     me.get_val_pedido()
        //     return
        //   }
        // }
        let valor = document.getElementById(serie+'_'+id+'_'+index).value
        if(valor == 0){
          document.getElementById(serie+'_'+id+'_'+index).value = ''
        }
        me.$vs.loading();
        let formData = new FormData();
          formData.append('id_pedido', me.id_pedido);
          formData.append('valor', document.getElementById(serie+'_'+id+'_'+index).value);
          formData.append('tipo_val', index);
          formData.append('id_serie', serie);
          formData.append('id_area', id);
          if(libro == '-1') {
            formData.append('plan_lector',id)
            formData.append('libro','0')
          }else{
            formData.append('plan_lector','0')
            formData.append('libro',libro)
          }
        await this.$http.post(this.$server_url+'save_val_pedido', formData)
        .then(res => {
            me.$vs.loading.close();
            if(res.data.status == 0){
              me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
              me.getSeries()
              return
            }
            if(res.data.status == 2){
              me.getSeries()
            }
            me.$vs.notify({ text: 'Guardado correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
            me.get_val_pedido()
        })

      },
      async guardarTotalPedido(){
        let me = this
        let total_usd_format = me.total_usd.toFixed(2)
        await me.$http.get(me.$server_url+'guardar_total_pedido/' + me.id_pedido + '/' + total_usd_format + '/' + me.total_unidades+'/'+me.total_unidades_guias+'/'+me.suma_bruta_series_b+'/'+me.pedido.anticipo)
        .then(res => {
          me.$emit('rechargePedido',true)
          // console.log('total actualizado: ' + total_usd_format)
        })
      },
      groupArrayOfObjects(list, key) {
          return list.reduce(function(rv, x) {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
          }, {});
      },
      activar_tipo(){
        if( this.tipo_form == 'textos' ){
          $('.t_texto').css('display', 'block');
          $('.t_guia').css('display', 'none');
        }else{
          $('.t_guia').css('display', 'block');
          $('.t_texto').css('display', 'none');
        }

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

input[type=number].input_pvp_tabla::-webkit-inner-spin-button,
input[type=number].input_pvp_tabla::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
input[type=number].input_pvp_tabla { -moz-appearance:textfield; }

input[type=number].input_pvp_tabla {
  width: 100%;
  height: 100%;
  border: none;
  font-size: 18px !important;
  text-align: center;
  color: rgb(60, 108, 192);
  padding: 0% !important;
}

table.table_pedidos tr:hover {
  background-color: #CCF7EF;
  border: 2px solid rgb(118, 255, 177);
  color: black!important;
}

input[type=number].input_pvp_tabla:hover {
  background-color: #CCF7EF;
  color: black!important;
}

table.table_pedidos td{
  border: 1px solid rgb(227, 227, 227);
  height: 25px;
}
table.table_pedidos th {
  border: 1px solid rgb(227, 227, 227);
  height: 25px;
}

table.table_pedidos {
  width: 100%;
  border-collapse: collapse;
}

.input_totales{
  background-color:#31B10C;
  color: white !important;
  font-weight: bold;
}
.input_pvp{
  background-color: #046AE7;
  color: #fff!important;
  border-radius: 0%;
  width: 100%;
  height: 100%;
}
.test{
  color:white!important;
  background-color: #6B97F5;
}
.test:hover,.guiaEstilo:hover{
  color:black;
}
.guiaEstilo{
  /* color:white!important;
  background-color: #E2B832; */
}

.test2{
  background-color: #C4D333;
}
</style>
