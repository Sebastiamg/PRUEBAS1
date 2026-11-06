<template>
  <div>
    <!-- <pre>{{ DetalleVerificacion }}</pre> -->
     <div v-if="ifCondicionalDescuentoVenta == 1"> 
      <p>Venta = Valor de la columna <b>SUBTOTAL</b></p>
      <p>VALOR COMISIÓN = Valor de la columna <b>TOTAL</b></p>
     </div>
      <vx-card id="seccionImprimir2">
        <div :class="[arregloLibros.length <= 52  ? 'claseCabecera': '']">
          <p class="letra text-left"><b>REPORTE DE VERIFICACIÓN INSTITUCIÓN:</b> {{ sendPedido.nombreInstitucion.toUpperCase() }}</p>
          <div style="display: flex;justify-content: space-between;">
              <div>
                  <span class="letra" style="position: relative;top:-1px;"><b>TEMPORADA:</b> {{ sendPedido.periodo.toUpperCase() }}</span>
              </div>
              <div>
                  <span class="letra" style="position: relative;top:-1px;"><b>CONVENIO:</b> {{ sendPedido.contrato_generado.toUpperCase() }}</span>
              </div>
          </div>
          <p class="letra text-left"><b>ASESOR:</b> {{ sendPedido.asesor.toUpperCase() }}</p>
          <div style="display: flex;justify-content: space-between;">
              <div>
                  <span class="letra" style="position: relative;top:-1px;"><b>FECHA REPORTE:</b> {{ dayM.charAt(0).toUpperCase() + dayM.slice(1) }}, {{ day }} de {{ mes }} de {{ year }}</span>
              </div>
              <div>
                  <span class="letra" style="position: relative;top:-1px;"><b>% COMISIÓN:</b> {{ sendPedido.descuento }}</span>
              </div>
          </div>
        </div>

          <table class="tabla2" style="margin-top:20px;">
              <thead>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                  <!--9 COLUMNAS-->
                  <tr v-if="ifCondicionalDescuentoVenta == 0">
                      <td colspan="1"><b>PRODUCTO</b></td>
                      <td colspan="4"><b>NOMBRE</b></td>
                      <td colspan="1"><b>CANT. VERIF.</b></td>
                      <td colspan="2"><b>VAL. UNIT.</b></td>
                      <td colspan="1"><b>VALOR</b></td>
                  </tr>
                  <tr v-if="ifCondicionalDescuentoVenta == 1">
                      <td colspan="1"><b>PRODUCTO</b></td>
                      <td colspan="3"><b>NOMBRE</b></td>
                      <td colspan="1"><b>CANT. VERIF.</b></td>
                      <td colspan="1"><b>VAL. UNIT.</b></td>
                      <td colspan="1"><b>SUBTOTAL</b></td>
                      <td colspan="1"><b>DESCUENTO</b></td>
                      <td colspan="1"><b>TOTAL</b></td>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(tr,key) in arregloLibros" :key="key">
                      <td>{{ tr.codigo }}</td>
                      <td colspan="3"  v-if="ifCondicionalDescuentoVenta == 1"><p class="letra">{{ tr.nombre_original }}</p>  </td>
                      <td colspan="4"  v-if="ifCondicionalDescuentoVenta == 0"><p class="letra">{{ tr.nombre_libro }}</p>  </td>
                      <td>{{ tr.cantidad }}</td>
                      <template v-if="ifCondicionalDescuentoVenta == 1">
                          <td>{{ tr.precio }}</td>
                          <td>{{ tr.subtotal }}</td>
                          <td>{{ tr.descuento }}</td>

                      </template>
                      <template v-else>
                        <td colspan="2">{{ tr.precio }}</td>
                      </template>
                      <td>{{ tr.valor | filtrarDecimal }} </td>
                  </tr>
                  <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="font-bold text-right" style="font-size:10px;">VENTA:</p></td>
                      <td style="border-top: 1px solid #000;"><span>{{ valorVenta | filtrarDecimal }}</span></td>
                  </tr>
                  <tr v-if="sumaTotalValorRegalados > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="font-bold text-right" style="font-size:9px;">CÓDIGOS HIJOS DE LOS DOCENTES:</p></td>
                      <td><span>{{ sumaTotalValorRegalados | filtrarDecimal  }}</span></td>
                  </tr>
                  <tr v-for="(item,key) in arregloDescuentosVenta" :key="key">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <p class="font-bold text-right" style="font-size:9px;">{{ item.nombre_descuento.toUpperCase() }}</p>
                    </td>
                    <td><span>{{ filtrarDecimal(item.total_descuento) }}</span></td>
                  </tr>
                  <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="font-bold text-right" style="font-size:9px;">TOTAL VENTA:</p></td>
                      <td style="border-top: 1px solid #000;"><span>{{ filtrarDecimal(totalVenta) }}</span></td>
                  </tr>
                  <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="2"><p class="font-bold text-right" style="font-size:9px;">VALOR COMISIÓN:</p></td>
                      <td style="border-top: 2px solid #000;"><span>{{ filtrarDecimal(valorComision) }}</span></td>
                  </tr>
                  <tr v-if="otroValoresCancelar > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="2"><p class="font-bold text-right" style="font-size:9px;">{{ campo_dinamicoOtros }}(+):</p></td>
                      <td style="border-top: 2px solid #000;"><span>{{ filtrarDecimal(otroValoresCancelar) }}</span></td>
                  </tr>
                  <tr v-if="sumaTotalRegalados > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="2"><p class="font-bold text-right" style="font-size:9px;">HIJOS DOCENTES(-):</p></td>
                      <td style="border-top: 2px solid #000;"><span>{{ filtrarDecimal(sumaTotalRegalados) }}</span></td>
                  </tr>
                  <tr v-if="totalDevolucionEscuela > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td colspan="2"><p class="font-bold text-right" style="font-size:9px;">DEVOLUCIÓN ESCUELA(+):</p></td>
                      <td style="border-top: 2px solid #000;"><span>{{ filtrarDecimal(totalDevolucionEscuela) }}</span></td>
                  </tr>
                  <tr v-if="deuda > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="font-bold text-right" style="font-size:9px;">DEUDA(-):</p></td>
                      <td><span>{{ filtrarDecimal(deuda) }}</span></td>
                  </tr>
                  <tr v-if="anticipo > 0">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="font-bold text-right" style="font-size:9px;">ANTICIPO(-):</p></td>
                      <td><span>{{ filtrarDecimal(anticipo) }}</span></td>
                  </tr>
                   <tr v-if="(sendPedido.convenio_anios > 0 || sendPedido.convenio_origen > 0) && setpermiso_convenio == 1 && AnticiposConvenio > 0">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <!--CONVENIO GLOBAL-->
                      <p class="font-bold text-right" style="font-size:9px;">
                      CONVENIO GLOBAL: {{ aniosConvenio }} AÑOS ({{ ObjectConvenio.anticipo_global }})
                      </p>
                    </td>
                    <td></td>
                  </tr>
                  <tr v-if="(sendPedido.convenio_anios > 0 || sendPedido.convenio_origen > 0) && setpermiso_convenio == 1 && AnticiposConvenio > 0" >
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <!--DENTRO DE PLATAFORMA-->
                      <p class="font-bold text-right" style="font-size:9px;">
                     {{ NumeroConvenio  }} CONVENIO(-)
                      </p>
                    </td>
                    <td><span>{{ filtrarDecimal(AnticiposConvenio) }}</span></td>
                  </tr>
                  <tr v-if="(sendPedido.convenio_anios > 0 || sendPedido.convenio_origen > 0) && setpermiso_convenio == 1 && AnticiposConvenio > 0">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <!--DENTRO DE PLATAFORMA-->
                      <p class="font-bold text-right" style="font-size:9px;">
                        (SALDO CONVENIO {{ SaldoConvenio }})
                      </p>
                    </td>
                    <td></td>
                  </tr>
                  <tr v-if="setpermiso_cobro_venta_directa == 1 && totalCobroVenta > 0">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <p class="font-bold text-right" style="font-size:9px;">COBRO DE VENTA DIRECTA</p>
                    </td>
                    <td><span>{{ filtrarDecimal(totalCobroVenta) }}</span></td>
                  </tr>
                  <tr v-for="(item,key) in arregloDescuentos" :key="key">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <p class="font-bold text-right" style="font-size:9px;">{{ item.nombre_descuento.toUpperCase() }}</p>
                    </td>
                    <td><span>{{ filtrarDecimal(item.total_descuento) }}</span></td>
                  </tr>
                  <tr v-for="(item,key) in arrayvaloresLiquidadosReporte" :key="key">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <p class="font-bold text-right" style="font-size:9px;">{{ item.campo_dinamico.toUpperCase() }}</p>
                    </td>
                    <td><span>{{ filtrarDecimal(item.doc_valor) }}</span></td>
                  </tr>
                  <tr v-if="deuda_verificacion_anterior > 0">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="3">
                      <p class="font-bold text-right" style="font-size:9px;">DEUDA VERIFICACIÓN ANTERIOR</p>
                    </td>
                    <td><span>{{ filtrarDecimal(deuda_verificacion_anterior) }}</span></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><p class="font-bold text-right" style="font-size:9px;margin-left:-2px;">LIQUIDACIÓN:</p></td>
                    <td style="border: 2px solid #000;"><span>{{ filtrarDecimal(liquidacion) }}</span></td>
                  </tr>
              </tbody>
          </table>
          <div id="page3el">
            <!-- Tercer contenido -->
        </div>
      </vx-card>
      <div class="w-full p-2 bg-gray-400 text-center" v-if="desdeConfiguracion == 0">
        <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir pdf</vs-button>
        <vs-button color="primary" @click="imprimirExcel()" type="border">Imprimir excel</vs-button>
      </div>
  </div>
</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
import PedidosRepository from "../../../repositories/PedidosRepository";
import imprimirMixin from "@/mixins/Pedidosmix";
export default{
  mixins:[imprimirMixin],
  data(){
      return{
        usuario:[],
        arregloLibros:[],
        arregloVerificacion:[],
        arregloDescuentos:[],
        arregloDescuentosVenta:[],
        arrayvaloresLiquidadosReporte:[],
        day:'',
        dayM:'',
        mes:'',
        year:'',
        anio:'',
        fecha:'',
        nombrearchivo:'',
        valorVenta:0,
        totalVenta:0,
        comision:0,
        valorComision:0,
        anticipo:0,
        deuda:0,
        liquidacion:0,
        campo_dinamicoOtros:'',
        otroValoresCancelar:0,
        totalDevolucionEscuela:0,
        //VARIABLES PARA EXPORTAR A EXCEL
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        fileName:null,
        selectedFormat: 'xls',
        cellAutoWidth: true,
        activePrompt: false,
        //variables convenio
        AnticiposConvenio:0,
        convenio_origen:0,
        aniosConvenio:0,
        totalDescuento:0,
        totalDescuentoVenta:0,
        NumeroConvenio:1,
        ObjectConvenio:'',
        SaldoConvenio:0,
        totalAnticipos:0,
        //fin variables convenio
        setpermiso_anticipo_deuda:'',
        setpermiso_convenio:'',
        setpermiso_cobro_venta_directa:'',
        //fin variables de permisos
        arrayBeneficiarios:[],
        totalValorBeneficiarios:0,
        valoresLiquidadosReporte:[],
        totalTipoLiquidacionReporte:0,
        venta_real_regalados:0,
        deuda_verificacion_anterior:0,
        id_periodoModuloDescuentoVenta:29,
        ifCondicionalDescuentoVenta:0,
      }
  },
  props:{
    sumaTotalRegalados:{
      type: [Number, String],  // Aceptar tanto Number como String
      default: 0,
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    //ARREGLO LIBROS
    DetalleVerificacion:{
      type:Array,
      default:[]
    },
    //SUMA DE TODOS LOS LIBROS
    sumaTotalVALOR:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    sumaTotalValorRegalados: {
      type: [Number, String],  // Aceptar tanto Number como String
      default: 0,
    },
    totalCobroVenta: {
      type: Number,
      validator(value) {
        return !Number.isInteger(value);
      }
    },
    tipoReporte:{
      type:Number,
      default:0,
    },
    desdeConfiguracion:{
      type:Number,
      default:0,
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  watch:{
    watch(results){
        let me = this;
        me.sendPedido = results
    },
     sumaTotalVALOR(results){
      let me = this
      if(me.ifCondicionalDescuentoVenta == 1){
        let subtotalVenta               = me.DetalleVerificacion.reduce((acc, obj) => acc + parseFloat(obj.subtotal || 0), 0)
        me.valorVenta                   = subtotalVenta
      }else{
        me.valorVenta = me.sumaTotalVALOR
      }
      me.AnticiposConvenio = 0
    },
  },

  created(){
      let me = this;
      me.limpiar()
      moment.lang("es")
      me.day = moment().format('DD');
      me.dayM  = moment().format('dddd');
      me.mes = moment().format('MMMM');
      me.year = moment().format('YYYY')
      me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
      if(me.id_periodoModuloDescuentoVenta <= me.sendPedido.id_periodo){
        //me.ifCondicionalDescuentoVenta = 1
        me.ifCondicionalDescuentoVenta = 0
      }
  },
  mounted(){
    let me = this
    if(me.ifCondicionalDescuentoVenta == 1){
      let subtotalVenta               = me.DetalleVerificacion.reduce((acc, obj) => acc + parseFloat(obj.subtotal || 0), 0)
      me.valorVenta                   = subtotalVenta
    }else{
      me.valorVenta = me.sumaTotalVALOR
    }
    me.getConvenioInstitucion()
    console.log("hijos Docentes",me.sumaTotalRegalados)
  },
  methods:{
    getBeneficiarios(){
    let me = this;
      PedidosRepository.getBeneficiariosXPedido(me.sendPedido.id_pedido).then(r => {
        me.arrayBeneficiarios = r.data
      })
    },
    getConvenioInstitucion(){
      let me = this;
      me.arregloHijosConvenio = []
      me.NumeroConvenio       = 0
      me.ObjectConvenio       = {}
      me.SaldoConvenio        = 0
      me.totalAnticipos       = 0
      var url = ""
      me.$vs.loading();
      url = this.$server_url+'convenio?getInformacionConvenioXId=yes&idConvenio='+me.sendPedido.pedidos_convenios_id
      this.$http.get(url)
        .then(function (res) {
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'})
            me.$vs.loading.close()
            return
          }
          if(res.data.length == 0){
            me.getVerificacion()
            me.$vs.loading.close()
            return
          }
          if(res.data.convenio.length == 0){
            me.getVerificacion()
            me.$vs.loading.close()
            return
          }
          me.$vs.loading.close()
          me.ObjectConvenio       = res.data.convenio[0]
          me.arregloHijosConvenio = res.data.hijos_convenio
          if(me.VerificacionSelect.num_verificacion == 1){
            console.log("verif")
            me.sumarSaldoConvenio(me.arregloHijosConvenio)
          }
          me.getVerificacion()
        })
        .catch(function (error) {
          me.$vs.loading.close()
            console.log(error + ' error');
        })
    },
    sumarSaldoConvenio(tr){
      let me = this
      console.log("convenios",tr)
      let contadorConvenio = 1
      var SumTodosAnticipos = 0
      //obtener el numero de convenio
      for (let i = 0; i < tr.length; i++) {
        SumTodosAnticipos  =  SumTodosAnticipos + tr[i].totalAnticipos
        if (tr[i].contrato == me.sendPedido.contrato_generado) {
          me.NumeroConvenio = contadorConvenio;
          me.totalAnticipos = tr[i].totalAnticipos
          break; // Salimos del bucle una vez que se encuentra el contrato.
        }
        contadorConvenio++;
      }
      console.log("sumaConvenio",SumTodosAnticipos)
      me.SaldoConvenio = (me.ObjectConvenio.anticipo_global - SumTodosAnticipos).toFixed(2)
      me.AnticiposConvenio = me.totalAnticipos
    },
    getVerificacion(){
      let me = this;
      me.arregloVerificacion = []
      me.deuda_verificacion_anterior = 0
      me.$vs.loading();
      this.$http.get(this.$server_url+'getVerificacionXId/'+me.VerificacionSelect.id)
      .then(res =>{
        me.totalVenta                     = 0
        me.totalTipoLiquidacionReporte    = 0
        me.arregloVerificacion            = res.data
        me.setpermiso_anticipo_deuda      = res.data[0].permiso_anticipo_deuda
        me.setpermiso_convenio            = res.data[0].permiso_convenio
        me.setpermiso_cobro_venta_directa = res.data[0].permiso_cobro_venta_directa
        me.arregloDescuentos              = res.data[0].descuentos
        me.arregloDescuentosVenta         = res.data[0].descuentosVenta
        me.totalDescuento                 = res.data[0].totalDescuento
        me.totalDescuentoVenta            = res.data[0].totalDescuentoVenta
        let preValoresRegalados           = res.data[0].venta_real_regalados
        //calcular valor venta
        console.log("DetalleVerificacion",me.DetalleVerificacion)
        if(me.ifCondicionalDescuentoVenta == 1){
          let subtotalVenta               = me.DetalleVerificacion.reduce((acc, obj) => acc + parseFloat(obj.subtotal || 0), 0)
          me.totalVenta                   = subtotalVenta - (me.totalDescuentoVenta  + preValoresRegalados).toFixed(2)
        }else{
          me.totalVenta                   = me.sumaTotalVALOR - (me.totalDescuentoVenta  + preValoresRegalados)
        }
        me.otroValoresCancelar            = res.data[0].otroValoresCancelar
        me.campo_dinamicoOtros            = res.data[0].campo_dinamico
        me.totalDevolucionEscuela         = res.data[0].devolucionEscuela
        me.deuda_verificacion_anterior    = res.data[0].deuda_verificacion_anterior
        //valoresLiquidadosReporte pagos con mostrar reporte en 1
        me.arrayvaloresLiquidadosReporte  = res.data[0].valoresLiquidadosReporte
        //summar en totalTipoLiquidacionReporte el array de valoresLiquidadosReporte
        me.totalTipoLiquidacionReporte    = me.arrayvaloresLiquidadosReporte.reduce((acc, obj) => acc + obj.doc_valor, 0)

        me.getPedidos()
      })
      .catch((err)=>{
        console.log(err)
        me.$vs.loading.close()
        me.$vs.notify({
          text: "Error al cargar la verificacion",
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          time:3000
        })
      })
    },
    filtrarDecimal(numero){
      let me = this
      if(numero == 0){
        return numero
      }else{
        const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return transformar
      }
    },
    getPedidos(){
      let me = this
      me.liquidacion      = 0
      me.comision         = me.sendPedido.descuento
      me.convenio_origen  = me.sendPedido.convenio_origen
      if(me.ifCondicionalDescuentoVenta == 1){
        me.valorComision    = me.sumaTotalVALOR
      }else{
        me.valorComision    = (me.totalVenta*me.comision)/100
      }
      var preValor        = 0
      //SEGUNDO, TECER , CUARTA.....VERIFICACION
      if(me.VerificacionSelect.num_verificacion > 1){
        me.anticipo                     = 0
        me.deuda                        = 0
        me.AnticiposConvenio            = 0
        me.otroValoresCancelar          = 0
        me.totalDescuentoVenta          = 0
        me.totalTipoLiquidacionReporte  = 0
        me.totalDevolucionEscuela       = 0
        me.arrayvaloresLiquidadosReporte = []
      }
      //solo a primer verificacion se le  descuenta el anticipo ,deuda, convenio
      else{
        //==SUMAR Pago tipo otros valores para cancelar al valor comision
        if(me.setpermiso_convenio == 0){
          me.AnticiposConvenio  = 0
        }
        //si no esta activado el check
        if(me.setpermiso_anticipo_deuda == 0){
          me.anticipo           = 0
        }
        else{
          let preAnticipo    = (me.sendPedido.anticipo_aprobado == null || me.sendPedido.anticipo_aprobado == "null" ) ? 0 : me.sendPedido.anticipo_aprobado
          me.anticipo        = preAnticipo
          let preDeuda       = (me.sendPedido.deuda == null || me.sendPedido.deuda == "null" ) ? 0 : me.sendPedido.deuda
          me.deuda           = parseFloat(preDeuda)
          preValor           = me.anticipo + me.deuda
        }

      }
      //VENTA PERSONALIZADA
      if(me.arregloVerificacion[0].totalDescuento > 0){
        console.log("personalizada")
        //si existe convenio
        if(me.sendPedido.convenio_anios > 0 || me.convenio_origen > 0){
          me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta + me.AnticiposConvenio + me.totalDescuento +me.sumaTotalRegalados)
        }
        //si no existe el convenio
        else{
          me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta + me.totalDescuento +me.sumaTotalRegalados)
        }
      }
      //NO PERSONALIZADA
      else{
        //si existe convenio
        if(me.sendPedido.convenio_anios > 0 || me.convenio_origen > 0){
          me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta + me.AnticiposConvenio + me.totalDescuento + me.sumaTotalRegalados)
        }
        //si no existe el convenio
        else{
          me.liquidacion     = me.valorComision - (preValor + me.totalCobroVenta  + me.totalDescuento + me.sumaTotalRegalados)
        }
      }
      //sumar otros valores a cancelar y total devolucion escuela al valor comision para eso se suma al valor de la liquidacion
      me.liquidacion  = me.liquidacion + me.otroValoresCancelar + me.totalDevolucionEscuela
      //restar tipo liquidacion mostrar reporte
      me.liquidacion  = me.liquidacion - me.totalTipoLiquidacionReporte
      //restar deuda verificacion anterior
      me.liquidacion  = me.liquidacion - me.deuda_verificacion_anterior
      //ANIOS CONVENIO
      //fuera de la plataforma
      if(me.sendPedido.convenio_origen > 0){ me.aniosConvenio = me.ObjectConvenio.convenio_anios }
      else                                         { me.aniosConvenio = me.sendPedido.convenio_anios }
      me.updateValorLiquidacion()
      me.nombrearchivo    = "Verificacion "+me.sendPedido.contrato_generado+".pdf"
      if(me.desdeConfiguracion == 0){
        me.$vs.notify({
        text: "Espere mientras se va generando el archivo...",
        color: 'primary',
        iconPack: 'feather',
        icon: 'icon-file',
        time:3000
        })
      }
      me.getLibros(me.sendPedido.id_pedido)
    },
    updateValorLiquidacion(){
      let me = this;
      let formData = new FormData();
      //DEUDA => 0  = NO; 1 = SI;
      let sendEstadoPago = 0
      if(me.liquidacion < 0)  { sendEstadoPago = 1 }
      else                    { sendEstadoPago = 2 }
      formData.append('actualizarNueveCampo', 'yes')
      formData.append('verificacion_id',    me.VerificacionSelect.id);
      //fields
      formData.append('campo',              'valor_liquidacion');
      formData.append('campo2',             'estado_pago')
      formData.append('campo3',             'valor_comision')
      formData.append('campo4',             'totalAnticipos')
      formData.append('campo5',             'totalDeuda')
      formData.append('campo6',             'totalCobroVentaDirecta')
      formData.append('campo7',             'TotalConvenio')
      formData.append('campo8',             'totalVenta')
      formData.append('campo9',             'deuda_hijos_docentes')
      //values
      formData.append('valor',              me.liquidacion);
      formData.append('valor2',             sendEstadoPago)
      formData.append('valor3',             me.valorComision)
      formData.append('valor4',             me.anticipo)
      formData.append('valor5',             me.deuda)
      formData.append('valor6',             me.totalCobroVenta)
      formData.append('valor7',             me.AnticiposConvenio)
      formData.append('valor8',             me.totalVenta)
      formData.append('valor9',             me.sumaTotalRegalados)
      formData.append('user_created',       me.usuario.idusuario)
      this.$http.post(this.$server_url+'updateVerificacion', formData)
      .then(res => {
        me.$vs.loading.close()
        if(me.desdeConfiguracion == 2){
          me.limpiar()
          me.$emit('changeHandleUpdatePayments',true)
          me.$vs.notify({
          text: `Liquidacion Verificacion ${me.VerificacionSelect.num_verificacion} guardada `,
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-file',
          time:3000
          })
        }
      })
      .catch(e => {
        me.$vs.loading.close()
        me.$vs.notify({
          text: `Error al generar el reporte`,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-file',
          time:3000
          })
      })
    },
    getLibros(){
      let me = this
      me.arregloAreas = []
      me.arregloLibros = []
      ///===ORDENAR ARRAY ==
      me.arregloLibros = me.DetalleVerificacion.sort((a, b) => {
        const getNumero = (str) => {
          // Extrae el primer número encontrado (como 8, 9, 10)
          const match = str.match(/\d+/);
          if (match) return parseInt(match[0]);
          // Si no hay número, verificar si tiene "BG" o "BS" o algo similar
          if (/bg/i.test(str)) return 1000; // para que vaya después del 10
          return 0;
        };

        const nombreA = a.nombre_libro.toLowerCase();
        const nombreB = b.nombre_libro.toLowerCase();

        const baseA = nombreA.replace(/\d+/g, '').trim();
        const baseB = nombreB.replace(/\d+/g, '').trim();

        // Primero comparar por nombre base
        if (baseA < baseB) return -1;
        if (baseA > baseB) return 1;

        // Luego comparar por número
        const numA = getNumero(nombreA);
        const numB = getNumero(nombreB);
        return numA - numB;
      });

      if(me.desdeConfiguracion == 0){
        if(me.tipoReporte == 0){
          setTimeout(function() {
           me.m_imprimirTodos('12px',me.nombrearchivo ,'0px','')
           me.$emit('change',true)
          }, 1000);
        }else{
          setTimeout(function() {me.imprimirExcel()}, 1000);
        }
      }
    },
      imprimirExcel(){
        let me = this
        let headerTitle = ""
        let headerVal = ""

        // Definir headers primero según la condición
        if(me.ifCondicionalDescuentoVenta == 1){
            headerTitle = [
              'PRODUCTO',
              'NOMBRE',
              'CANT. VERIF',
              'VAL. UNIT',
              'SUBTOTAL',
              'DESCUENTO',
              'VALOR'
            ];
            headerVal = [
              'codigo',
              'nombre_libro',
              'cantidad',
              'precio',
              'subtotal',
              'descuento',
              'valor'
            ];
        } else {
            headerTitle = [
              'PRODUCTO',
              'NOMBRE',
              'CANT. VERIF',
              'VAL. UNIT',
              'VALOR'
            ];
            headerVal = [
              'codigo',
              'nombre_libro',
              'cantidad',
              'precio',
              'valor'
            ];
        }

        // Obtener número de columnas dinámicamente
        const numColumnas = headerTitle.length;

        // Función helper para crear arrays con el número correcto de columnas
        const crearFila = (datos) => {
          const fila = new Array(numColumnas).fill("");
          datos.forEach((valor, index) => {
            if(index < numColumnas) fila[index] = valor;
          });
          return fila;
        };

        //INSTITUCION
        let TitleInstitucion = crearFila([
          "REPORTE DE VERIFICACIÓN INSTITUCIÓN:",
          me.sendPedido.nombreInstitucion.toUpperCase()
        ]);

        //TEMPORADA - CONVENIO
        let TitleTemporada = crearFila([
          "TEMPORADA:",
          me.sendPedido.periodo.toUpperCase(),
          "",
          "Convenio",
          me.sendPedido.contrato_generado.toUpperCase()
        ]);

        //ASESOR
        let TitleAsesor = crearFila([
          "ASESOR:",
          me.sendPedido.asesor.toUpperCase()
        ]);

        //FECHA REPORTE
        let TitleFecha = crearFila([
          "FECHA REPORTE:",
          `${ me.dayM.charAt(0).toUpperCase() }${ me.dayM.slice(1) }, ${ me.day } de ${ me.mes } de ${ me.year }`,
          "",
          "COMISIÓN",
          me.sendPedido.descuento
        ]);

        let TitleEspacio = crearFila([]);

        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(headerVal, this.arregloLibros)
          let preData = data[0]

          // Debug: Ver número de columnas
          console.log("Número de columnas:", numColumnas);
          console.log("Headers:", headerTitle);

          // Helper para crear fila con valores en las últimas 2 columnas
          const crearFilaUltimas2 = (label, valor) => {
            const fila = new Array(numColumnas).fill("");
            const posicionLabel = numColumnas - 2;  // Penúltima columna
            const posicionValor = numColumnas - 1;  // Última columna

            console.log(`Colocando "${label}" en posición ${posicionLabel} y valor ${valor} en posición ${posicionValor}`);

            fila[posicionLabel] = label;
            fila[posicionValor] = valor;

            console.log("Fila creada:", fila);
            return fila;
          };

          //VENTA
          let DataVenta = crearFilaUltimas2("VENTA", me.valorVenta);

          //HIJOS DE LOS DOCENTES
          let DataHijos = crearFilaUltimas2("CÓDIGOS HIJOS DE LOS DOCENTES:", me.sumaTotalValorRegalados);

          //TOTAL VENTA
          let DataTotalVenta = crearFilaUltimas2("TOTAL VENTA:", me.totalVenta);

          //VALOR COMISION
          let DataComision = crearFilaUltimas2("VALOR COMISIÓN:", me.valorComision);

          //HIJOS DOCENTES
          let DataHijosDocentes = crearFilaUltimas2("HIJOS DOCENTES(-):", me.sumaTotalRegalados);

          //PAGO TIPOS OTROS VALORES
          let DataOtrosValores = crearFilaUltimas2(`${me.campo_dinamicoOtros}(+)`, me.otroValoresCancelar);

          //PAGO DE TIPO DEVOLUCION ESCUELA
          let DataDevolucionEscuela = crearFilaUltimas2("DEVOLUCIÓN ESCUELA(+):", me.totalDevolucionEscuela);

          //ANTICIPO
          let DataAnticipo = crearFilaUltimas2("ANTICIPO(-):", me.anticipo);

          //DEUDA
          let DataDeuda = crearFilaUltimas2("DEUDA(-):", me.deuda);

          //CONVENIO GLOBAL
          let DataConvenioGlobal = crearFilaUltimas2(`CONVENIO GLOBAL: ${ me.aniosConvenio } AÑOS  (${ me.ObjectConvenio.anticipo_global })`, "");

          //CONVENIO
          let DataConvenio = crearFilaUltimas2(`${ me.NumeroConvenio } CONVENIO(-):`, me.AnticiposConvenio);

          //SALDO CONVENIO
          let DataSaldoConvenio = crearFilaUltimas2(`(SALDO CONVENIO: ${ me.SaldoConvenio })`, "");

          //DATA COBRO VENTA DIRECTA
          let DataCobro = crearFilaUltimas2("COBRO DE VENTA DIRECTA:", me.totalCobroVenta);

          //LIQUIDACIÓN
          let DataLiquidacion = crearFilaUltimas2("LIQUIDACIÓN:", me.liquidacion);
          /**ENVIAR A ARRAY**/
          var sendEnviar = []
          sendEnviar.push(DataVenta)
          if(me.sumaTotalValorRegalados > 0) {
            sendEnviar.push(DataHijos)
          }
          //MOSTRAR PERSONALIZADO EN REPORTE DE RESTAR CON VENTA
          if(me.totalDescuentoVenta > 1)  {
            me.arregloDescuentosVenta.forEach(element => {
              let DataCuponVenta = crearFilaUltimas2(element.nombre_descuento, element.total_descuento);
              sendEnviar.push(DataCuponVenta)
            });
          }
          sendEnviar.push(DataTotalVenta)
          sendEnviar.push(DataComision)
          if(me.sumaTotalRegalados > 0){
            sendEnviar.push(DataHijosDocentes)
          }
          //mostrar otros valores a cancelar
          if(me.otroValoresCancelar > 0){
            sendEnviar.push(DataOtrosValores)
          }
          //mostar devolucion escuela
          if(me.totalDevolucionEscuela > 0){
            sendEnviar.push(DataDevolucionEscuela)
          }
          if(me.deuda > 0){
            sendEnviar.push(DataDeuda)
          }if(me.anticipo > 0){
            sendEnviar.push(DataAnticipo)
          }
          //si hay convenio lo mando al excel
          if(me.aniosConvenio > 0 && me.setpermiso_convenio == 1 && me.AnticiposConvenio > 0) {
            sendEnviar.push(DataConvenioGlobal)
            sendEnviar.push(DataConvenio)
            sendEnviar.push(DataSaldoConvenio)
          }
          if(me.totalCobroVenta  > 1 && me.totalCobroVenta > 0) { sendEnviar.push(DataCobro) }
          //MOSTRAR PERSONALIZADO EN REPORTE
          if(me.totalDescuento > 1)  {
            me.arregloDescuentos.forEach(element => {
              let DataCupon = crearFilaUltimas2(element.nombre_descuento, element.total_descuento);
              sendEnviar.push(DataCupon)
            });
          }

          // deuda verificacion anterior
          if(me.deuda_verificacion_anterior > 0) {
            let DataDeudaVerificacionAnterior = crearFilaUltimas2("DEUDA VERIFICACIÓN ANTERIOR:", me.deuda_verificacion_anterior);
            sendEnviar.push(DataDeudaVerificacionAnterior)
          }
          /*VALORES TIPO PAGO LIQUIDACION CON MOSTRAR REPORTE*/
          if(me.totalTipoLiquidacionReporte > 0)  {
            me.arrayvaloresLiquidadosReporte.forEach(element => {
              let DataTipoliquidacion = crearFilaUltimas2(element.campo_dinamico, element.doc_valor);
              sendEnviar.push(DataTipoliquidacion)
            });
          }
          sendEnviar.push(DataLiquidacion)

          var data2 = [...sendEnviar]
          excel.export_json_to_excel({
            multiHeader:[TitleInstitucion,TitleTemporada,TitleAsesor,TitleFecha,TitleEspacio],
            header: headerTitle,
            data,
            data2,
            filename: this.nombrearchivo,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
      },
      //limpiar campos para exportar de nuevo
      clearFields() {
        this.fileName = ''
        this.cellAutoWidth = true
        this.selectedFormat = 'xls'
      },

      imprimirEval(){
        let me = this
          var element = document.getElementById('seccionImprimir2');
              var pageBreakConfig = me.arregloLibros.length > 52
          ? {
              mode: ['avoid-all'],  // Si el array tiene más de 52 elementos
              inside: "avoid",
              before: '#page2el'
          }
          : {
              mode: ['avoid', 'css', 'legacy'],  // Si el array tiene 52 elementos o menos
              inside: "avoid",
              before: '#page2el'
          };
            // Configuración del margen según la longitud del arreglo
            var marginConfig = me.arregloLibros.length > 52 ? [0.5] : [1, 0.5];
          console.log("prueba",pageBreakConfig)
          var opt = {
              margin:       marginConfig,
              // margin:         [1.5, 0.5, 1, 1],
              filename:     me.nombrearchivo,
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:    {scale: 2},
              // pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' }  ,
              pagebreak: pageBreakConfig,
              // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
              jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
              //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          html2pdf().from(element).set(opt).save();
          me.arregloLibros   = []
          me.$vs.notify({
              text: "Archivo descargado correctamente",
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-file',
              time:2000
          })
          me.limpiar()
          me.$emit('change',true)
      },
      imprimirEvalMayor(){
          let me = this
            var element = document.getElementById('seccionImprimir2');
            var opt = {
                margin:       0.5,
                // margin:         [1.5, 0.5, 1, 1],
                filename:     me.nombrearchivo,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:    {scale: 2},
                pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' }  ,
                // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
                //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(opt).save();
            me.arregloLibros   = []
            me.$vs.notify({
                text: "Archivo descargado correctamente",
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-file',
                time:2000
            })
            me.limpiar()
            me.$emit('change',true)
        },
      limpiar(){
        let me                              = this;
        me.AnticiposConvenio                = 0
        me.convenio_origen                  = 0
        me.valorVenta                       = 0
        me.totalVenta                       = 0
        me.comision                         = 0
        me.valorComision                    = 0
        me.anticipo                         = 0
        me.deuda                            = 0
        me.liquidacion                      = 0
        me.aniosConvenio                    = 0
        me.setpermiso_anticipo_deuda        = ''
        me.setpermiso_convenio              = ''
        me.setpermiso_cobro_venta_directa   = ''
      }
  }
}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
  font-family: Arial;
}
.letra{
  padding:0px 60px 0px 0px;
  font-size: 10px;
  margin-left: 35px;
  text-align: justify;
}
.letra2{
  margin-top: 15px;
  margin-left: 60px;
  padding-right:60px;
  font-size: 11px;
  text-align: justify;
}
.letra3{
  display: flex;
  font-size: 11px;
  margin-left: 35px;
  padding-right:35px;
  text-align: justify;
}
.letra4{
  margin-top: 15px;
  margin-left: 55px;
  padding-right:55px;
  font-size: 11px;
  text-align: justify;
}
.letra5{
  display: flex;
  justify-content: space-evenly;
  width: 90%;
  margin-left: 35px;
  padding-right:35px;
  font-size: 11px;
  margin-top: 115px;
}
.tabla1 {
table-layout: fixed;
width: 95%;
border-collapse: collapse;
border: none;
margin-left: 15px;
}
.tabla2{
  table-layout: fixed;
  width: 90%;
  border-collapse: collapse;
  border: none;
  font-size: 11px;
  margin-top: 15px;
  margin-left: 35px;
}
.tabla3{
table-layout: fixed;
width: 50%;
border-collapse: collapse;
font-size: 10px;
}
.no-break {
  white-space: nowrap;
}
@media print {
  td {page-break-before: always;}
  p  {page-break-before: always;}
}
.encabezado ,td,th {
  /* border: 1px solid rgb(227, 227, 227); */
  text-align: center;
  border-spacing: 0;
}
.rotar{
  font-size: 8px;
  /* writing-mode: vertical-lr;
   transform: rotate(180deg); */
}
.font1{
  font-size: 8px;
}
</style>
