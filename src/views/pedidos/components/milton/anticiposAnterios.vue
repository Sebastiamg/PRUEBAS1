<template>
  <div>
    <div class="vx-row">
      <!--ANTICIPOS ANTERIORES AGRUPADO-->
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
        <vs-divider>Anticipos anteriores</vs-divider>
        <div slot="header">
            <b>VER ANTICIPOS ANTERIORES</b>
        </div>
        <ul class="mb-1" v-if="arregloFinal.length > 0">
          <li v-for="(item,key) in arregloFinal" :key="key" >
            <span>
                <span class="inline-block h-3 w-3 rounded-full mr-2 bg-warning"></span>
                <span class="font-semibold">
                    {{ item.periodo }}
                </span><br>
                <p>Total Venta bruta: <b>{{ item.ven_valor }}</b></p>
                <p>Total Comisión   <b>{{ item.ven_descuento }} % </b></p>
                <!-- <p>{{ item.ven_descuento }} % venta bruta: <b>{{ item.valorComision.toFixed(2) }}</b></p>  -->
                <p>Total Anticipo: <b>{{ (item.anticipo) | filtrarDecimal }}</b></p>
                <p>Total Liquidación:
                    <b v-if="(item.liquidacion ) < 0" class="text-danger">{{ (item.liquidacion) | filtrarDecimal }}</b>
                    <b v-else>{{ (item.liquidacion ) | filtrarDecimal  }}</b>
                </p>
                <!--NUEVOS TIPOS-->
                <div v-if="item.periodo_id > 21">
                  <p><b>Deuda: </b>
                    <span v-if="item.deudas == 0">{{ item.deudas }}</span>
                    <span v-else class="text-danger font-bold">{{ item.deudas }}</span>
                  </p>
                  <p>Total Convenios: <b>{{ (item.convenios) | filtrarDecimal }}</b></p>
                </div>
                <div class="mt-2" v-if="item.ContratosConvertido.length > 0">
                  <p class="text-success font-bold">Datos del contrato:</p>
                  <ul>
                    <li><b>Contrato: </b>{{ item.contrato }}</li>
                    <li><b>Venta bruta: </b>{{ item.venValorContrato }}</li>
                    <li><b>Comisión: </b>{{ item.descuentoContrato }} %</li>
                    <li><b>Anticipo: </b>{{ item.anticipoContrato }}</li>
                    <li><b>Liquidación: </b>{{ item.liquidacionContrato }}</li>
                    <div v-if="item.periodo_id > 21">
                      <li><b>Deuda: </b>
                        <span v-if="item.deudas == 0">{{ item.deudas }}</span>
                        <span v-else class="text-danger font-bold">{{ item.deudas }}</span>
                      </li>
                      <li v-if="item.convenios > 0"><b>Convenios: </b>{{ item.convenios }}</li>
                    </div>
                  </ul>
                </div>
                <div v-if="item.ContratosConvertido.length > 0" class="mt-2">
                  <p class="text-warning font-bold">Contratos Relacionados</p>
                  <ul v-for="(tr,key2) in item.ContratosConvertido" :key="key2">
                    <li><b>Contrato: </b>{{ tr.contrato }}</li>
                    <li><b>Venta bruta: </b>{{ tr.ven_valor }}</li>
                    <li><b>Comisión: </b>{{ tr.ven_descuento }} %</li>
                    <li><b>Anticipo: </b>{{ tr.anticipo }} </li>
                    <li><b>Liquidación: </b>{{ tr.liquidacion }}</li>
                  </ul>
                </div>
            </span>
            <vs-divider></vs-divider>
          </li>
        </ul>
        <div v-else>
          <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
              No existe valores anteriores
          </vs-alert>
        </div>
      </div>
      <!--DETALLE-->
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
        <vs-divider>Detalle anticipos</vs-divider>
        <vs-table max-items="5" stripe search pagination :data="arregloValores">
          <template slot="header">
              <vs-chip  color="primary">Cantidad: <b> {{ arregloValores.length }}</b></vs-chip>
          </template>
          <template slot="thead">
              <vs-th>Contrato</vs-th>
              <vs-th>Datos</vs-th>
              <vs-th>Observacion</vs-th>
              <vs-th v-if="groupFacturador">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <b>Contrato:</b>
                    <p>{{tr.ven_codigo}}</p>
                    <b>Venta bruta:</b>
                    <p>{{tr.venValor}}</p>
                    <b>Comisión:</b>
                    <p>{{tr.venDescuento}}</p>
                    <div v-if="tr.ven_convertido != null">
                      <b class="text-danger">Contrato relacionado a:</b>
                      <p>{{tr.ven_convertido}}</p>
                    </div>
                  </vs-td>
                  <vs-td>
                    <b>Valor</b>
                    <p>{{tr.doc_valor}}</p>
                    <b>Tipo pago</b>
                    <p>{{tr.tipo_pago_nombre}}</p>
                    <b>Forma de pago</b>
                    <p>{{tr.forma_pago_nombre}}</p>
                    <b>doc numero</b>
                    <p>{{tr.doc_numero}}</p>
                    <b>doc fecha</b>
                    <p>{{tr.doc_fecha}}</p>
                  </vs-td>
                  <vs-td>
                      {{ tr.doc_observacion }}
                  </vs-td>
                  <vs-td v-if="groupFacturador">
                    <vs-button color="warning" class="p-2" @click="pagoSelect =tr;editar();" type="filled" icon-pack="feather" icon="icon-edit">Editar</vs-button>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>
      </div>
    </div>
    <!--MODALES-->
    <vs-popup classContent="popup-example" title="Editar" :active.sync="popupAdd">
      <div v-if="popupAdd">
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Valor</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="pago.doc_valor" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Tipo Pago</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="arrayTiposPagos"  :reduce="arrayTiposPagos => arrayTiposPagos.id" label="nombre" class="w-full" v-model="pago.tipo_pago_id" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Forma de Pago</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="arrayFormasPagos"  :reduce="arrayFormasPagos => arrayFormasPagos.tip_pag_codigo" label="tip_pag_nombre" class="w-full" v-model="pago.forma_pago_id" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>doc_numero</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="pago.doc_numero" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Observación</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="pago.doc_observacion" />
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col sm:w-2/3 w-full ml-auto">
            <vs-button class="mr-3 mb-2" @click="actualizar();">Guardar</vs-button>
          </div>
        </div>
      </div>

    </vs-popup>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
import vSelect from 'vue-select'
export default{
components:{
  vSelect,
},
  data(){
      return{
          arregloValores:[],
          arregloFinal:[],
          arregloConvertido:[],
          arrayNormales:[],
          popupAdd:false,
          pago:{
            doc_valor:0,
            tipo_pago_id:'',
            forma_pago_id:'',
            doc_numero:'',
            doc_observacion:''
          },
          pagoSelect:'',
          arrayTiposPagos:[],
          arrayFormasPagos:[],
      }
  },
  props:{
      arregloIdsCoincidencias:{
          type:Array,
          default:[]
      },
      anticipoAprobado:{
          type:Number,
          default:0,
      },
      tmpPedidos:{
          type:Object,
          default:{}
      },
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','userAsesor','groupFacturador']),
  },
  mounted(){
      let me = this;
      me.getAnticiposAnteriores()
      me.sendPedido = me.ObjectPedido

  },
  methods:{
    editar(){
      let me = this
      me.getTiposPagos()
      me.getFormasPagos()
      me.pago = me.pagoSelect
      me.popupAdd = true;
    },
    getTiposPagos(){
      let me  = this
      var url = ""
      url = this.$server_url + 'pedigo_Pagos?getTiposPagos=yes'
      this.$http.get(url)
        .then(res => {
          me.arrayTiposPagos = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getFormasPagos(){
      let me  = this
      var url = ""
      url = this.$server_url + 'pedigo_Pagos?getFormasPago=yes'
      this.$http.get(url)
        .then(res => {
          me.arrayFormasPagos = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    actualizar(){
      let me = this
      me.$vs.loading()
      this.$http.post(this.$server_url+'editarDocumentoLiq', me.pago)
      .then(res => {
      me.getAnticiposAnteriores();
      me.$vs.loading.close()
      me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      me.popupAdd = false
    },
    async getAnticiposAnteriores(){
      let me = this;
      me.arregloConvertido = []
      me.arregloFinal      = []
      me.arrayNormales     = []
      // if(me.tmpPedidos.codigo_contrato == null || me.tmpPedidos.codigo_contrato == "" || me.tmpPedidos.codigo_contrato == undefined){
      //   return
      // }
      me.$vs.loading()
      try {
        let res = await this.$http.get(this.$server_url+'Get_Cliente_Institucionx3yearanterior?id_institucion='+me.tmpPedidos.id_institucion+'&ven_codigo='+me.tmpPedidos.codigo_contrato.substring(1));
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
        }
        me.arregloValores = res.data
        if(me.arregloValores.length > 0){
          let convertidos       = res.data.filter(p => p.ven_convertido != null)
          let datosNormales     = res.data.filter(p => p.ven_convertido == null)
          me.arrayNormales      = await me.renderValores(datosNormales,1)
          me.arregloConvertido  = await me.renderValores(convertidos,0)
          me.resolveFinal()
        }
      } catch (error) {
        console.log(error + ' error');
        me.$vs.loading.close()
      }
    },
    async renderValores(tr,tipo){
      let me = this;
      var agruparPeriodos = []
      var datosSeteados   = []
      tr.forEach(element => {
          var cal     = new Object();
          cal.periodo = element.periodo
          agruparPeriodos.push(cal)
      });
      //QUITAR ARRAYS DUPLICADOS
      let hash = {};
      let resultado = agruparPeriodos.filter(o => hash[o.periodo] ? false : hash[o.periodo] = true);
      datosSeteados  = resultado
      //ingresar valores en el periodo
      datosSeteados.map(p => {
          p["valores"]    = tr.filter(s => s.periodo == p.periodo)
          return p
      });
      let ArregloOrdenar = []
      //separar los anticipos y liquidacion
      datosSeteados.forEach(element => {
        var cal = new Object();
        cal.periodo              = element.periodo
        cal.contrato             = element.valores[0].ven_codigo
        cal.ven_valor            = element.valores[0].venValor
        cal.ven_descuento        = element.valores[0].venDescuento
        cal.ven_convertido       = element.valores[0].ven_convertido
        //doc_ci  1 son tipo anticipos y doc_ci 6 son deudas anteriores
        cal.anticipos            = element.valores.filter(p => p.doc_ci == "ANT" || p.doc_ci == "1" || p.doc_ci == "6")
        cal.liquidados           = element.valores.filter(p => p.doc_ci == "LIQ" || p.doc_ci == "2")
        cal.deudas               = element.valores.filter(p => p.doc_ci == "3")
        cal.convenios            = element.valores.filter(p => p.doc_ci == "4")
        cal.periodo_id           = element.valores[0].periodo_id
        ArregloOrdenar.push(cal)
      });
      let mostrarValores=[]
      ArregloOrdenar.forEach(element => {
          var cal = new Object();
          cal.periodo         = element.periodo
          cal.contrato        = element.contrato
          cal.ven_valor       = element.ven_valor
          cal.ven_descuento   = element.ven_descuento
          cal.ven_convertido  = element.ven_convertido
          cal.periodo_id      = element.periodo_id
          let array           = element.anticipos
          let array2          = element.liquidados
          let array3          = element.deudas
          let array4          = element.convenios
          cal.anticipo        = array.reduce((a, b) => parseFloat(a) + parseFloat((b["doc_valor"] || 0)), 0);
          cal.liquidacion     = array2.reduce((a, b) => parseFloat(a) + parseFloat((b["doc_valor"] || 0)), 0);
          cal.deudas          = array3.reduce((a, b) => parseFloat(a) + parseFloat((b["doc_valor"] || 0)), 0);
          cal.convenios       = array4.reduce((a, b) => parseFloat(a) + parseFloat((b["doc_valor"] || 0)), 0);
          mostrarValores.push(cal)
      });
      //ORDENAR LOS PERIODOS
      mostrarValores  = mostrarValores.sort((a, b) => {
      if (a.periodo < b.periodo) {
          return 1;
      }
      if (a.periodo > b.periodo) {
          return -1;
      }
      return 0;
      });
      return mostrarValores

    },
    resolveFinal(){
      let me = this
      me.arrayNormales.forEach(element => {
        var cal = new Object();
        var anticipoConvertido  = 0
        var liquidadoConvertido = 0
        var descuentoConvertido = 0
        var venValorConvertido  = 0
        var ContratosConvertido = []
        //recorrer los contratos
        if(me.arregloConvertido.length > 0){
          me.arregloConvertido.forEach(p => {
            if(p.ven_convertido == element.contrato){
              anticipoConvertido  = anticipoConvertido + p.anticipo
              liquidadoConvertido = liquidadoConvertido + p.liquidacion
              descuentoConvertido = descuentoConvertido + p.ven_descuento
              venValorConvertido  = venValorConvertido + p.ven_valor
              ContratosConvertido.push(p)
            }
          })
        }
        //PROCESO
        cal.periodo             = element.periodo
        cal.contrato            = element.contrato
        cal.ven_valor           = element.ven_valor + venValorConvertido
        cal.ven_descuento       = element.ven_descuento + descuentoConvertido
        cal.ven_convertido      = element.ven_convertido
        cal.anticipo            = element.anticipo + anticipoConvertido
        cal.liquidacion         = element.liquidacion + liquidadoConvertido
        cal.deudas              = element.deudas
        cal.convenios           = element.convenios
        cal.ContratosConvertido = ContratosConvertido
        cal.periodo_id          = element.periodo_id
        //datos del primer contrato
        cal.anticipoContrato    = element.anticipo
        cal.liquidacionContrato = element.liquidacion
        cal.descuentoContrato   = element.ven_descuento
        cal.venValorContrato    = element.ven_valor
        me.arregloFinal.push(cal)
      })
      //ORDENAR ARRAY DETALLE
      me.arregloValores = me.arregloValores.sort((a, b) => {
        if (a.periodo < b.periodo) {
            return 1;
        }
        if (a.periodo > b.periodo) {
            return -1;
        }
        return 0;
      });
      //====DEUDA====
      //si existe deuda mandar a guardar la deuda y asignar como anticipo aprobado
      var deuda = me.arregloFinal[0]
      var getDeuda = 0
      if(deuda.periodo_id > 21){
        getDeuda = parseFloat(deuda.deudas)
      }else{
        getDeuda = parseFloat(deuda.liquidacion)
      }
      if(getDeuda < 0){
          //si  ya existe un valor en el anticipo aprobado no actualizo
          if(me.sendPedido.ifagregado_anticipo_aprobado == 0){
              let datos = {
                  setDeuda :getDeuda,
                  periodo  :deuda.periodo
              }
              me.$emit('sendDeuda',datos)
          }
      }else{
      }
    },
  }

}
</script>
