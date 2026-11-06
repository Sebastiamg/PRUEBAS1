<template>
  <div class="">
    <div>
      <nav class="breadcrumbs mt-3" style="display:flex;flex-wrap:wrap">
        <span v-for="(menu, index) in arrayCodigosEncontrados"  :key="index" :class="['breadcrumbs__item',  {'activeBtn': filtro === menu.institucion_id_select, 'customBackground': filtro === menu.institucion_id_select}]" @click="cambiarFiltro(menu)">
          {{ menu.data.length }}
          {{ menu.institucion_select }}
        </span>
      </nav>
      <br>
      <!--Mostrar tabla-->
      <div v-if="arrayMostrar.data">
        <div class="mt-2" style="" v-if="ifVariosPeriodos">
          <div class="" style="background:#fadbd8;padding:10px;border-radius: 3px;">
            <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> Existe Varios Períodos</p>
            <div v-if="ifIncorrectoInstitucion">
              <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> Existe <b class="text-danger">{{ tmpArrayCodes.filter(p => p.incorrecto == 1).length }} </b>códigos con más de <b class="text-danger">1 Punto de Despacho</b></p>
            </div>
          </div>
        </div>
        <!--filtro-->
        <div class="mt-5">
          <ul style="display:flex;flex-wrap: wrap;">
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{ sumaTotal }}</span> Todos</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="1"><span class="font-bold">{{ sumarCodigosLiquidados }}</span> Liquidados</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="2"><span class="font-bold">{{ sumaCodigosRegaladosActa }}</span> Regalados / Actas sin liquidar</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span class="font-bold">{{ sumaCodigosRegaladosLiquidadosActa }}</span> Regalados / Actas liquidados</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="4"><span class="font-bold">{{ sumaCodigosRegalados }}</span> Regalados sin liquidar</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="5"><span class="font-bold">{{ sumaCodigosRegaladosLiquidados }}</span> Regalados liquidados</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="6"><span class="font-bold">{{ SumaCodigosDevolucion }}</span> Devueltos</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="7"><span class="font-bold">{{ sumarCodigosGuias }}</span> GUIAS</vs-radio>
            </li>
            <li class="m-2">
              <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="8"><span class="font-bold">{{ sumarCodigosPlus }}</span> PLUS</vs-radio>
            </li>
          </ul>
        </div>
        <vs-button  class="mt-4 mb-4 mr-5 text-white" @click="openConfirm(arrayMostrar);">
          <i class="fa-solid fa-upload text-white"></i>
          <span class="text-white" v-if="ifNuevoDocumento == 1"> CREAR DOCUMENTO DE DEVOLUCIÓN DE {{ sumarCodigosDevolver }} CÓDIGOS</span>
          <span class="text-white" v-else> AGREGAR {{ sumarCodigosDevolver }} CÓDIGOS AL DOCUMENTO
            {{ documentSelected.codigo_devolucion }}
          </span>
        </vs-button>
        <vs-table max-items="10" search stripe pagination :data="tmpArrayCodes">
          <template slot="header">
            <vs-chip  color="primary">Cantidad:  {{ tmpArrayCodes.length }}</vs-chip>
            <ul class="ml-2" >
              <li class="m-2" v-if="sumaTodoRegalados > 0">
                <vs-checkbox @input="f_excluirRegalados()" v-model="checkIncluirRegalados">Incluir Regalados</vs-checkbox>
              </li>
              <li class="m-2" v-if="sumaTodoActas > 0">
                <vs-checkbox @input="f_excluirActas()" v-model="checkIncluirActas">Incluir actas</vs-checkbox>
              </li>
            </ul>
          </template>
          <template slot="thead">
            <vs-th>Código</vs-th>
            <vs-th>Institución</vs-th>
            <vs-th>Período</vs-th>
            <vs-th>Crear Documento</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                  <!--plus-->
                  <div v-if="tr.plus == '1'" class="my-3">
                    <p><b style="background-color:#000 ;padding: 10px;color:white;border-radius: 5px;">Plus</b>
                    </p>
                  </div>
                  {{data[indextr].codigo}}<br>
                  <p v-if="tr.permitir_devolver_nota == 1"><b class="text-danger">PERMITIR DEVOLVER NOTA</b></p>
                  <div v-if="tr.codigo_proforma">
                    <b>Pre factura/Nota:</b>
                    <p>{{ tr.codigo_proforma  ? tr.codigo_proforma : 'No tiene pre factura ni nota'}}</p>
                  </div>
                  <div v-if="tr.codigo_paquete" class="mt-2">
                    <p><b>Paquete:</b>
                      <span class="ml-2">{{tr.codigo_paquete}}</span>
                    </p>
                  </div>

                  <div v-if="tr.codigo_combo" class="mt-2 my-2">
                    <p><b>Combo Generado:</b>
                      <span class="ml-2" style="background-color: bisque;padding: 5px;border-radius: 5px;">{{tr.codigo_combo}}</span>
                    </p>
                    <div v-if="tr.combo" class="mt-2 my-2">
                      <p><b>Combo:</b>
                        <span class="ml-2" style="background-color: bisque;padding: 5px;border-radius: 5px;">{{tr.combo}}</span>
                      </p>
                    </div>
                    <div v-else>
                      <p class="text-danger">Falta el combo del libro</p>
                    </div>
                  </div>
                  <p v-if="tr.venta_estado == 1 || tr.venta_estado == 2"><b>Tipo de venta:</b>
                    <span class="ml-2" v-if="tr.venta_estado == 1">Venta directa</span>
                    <span class="ml-2" v-if="tr.venta_estado == 2">Venta lista</span>
                  </p>
                  <span v-if="tr.estado_liquidacion == 0" class="mt-2 font-semibold">Liquidado</span>
                  <span v-if="tr.estado_liquidacion == 3" class="mt-2 font-semibold text-danger">Devuelto</span>
                  <span v-if="tr.estado_liquidacion == 4" class="mt-2 font-semibold">GUIA</span>
                  <div v-if="tr.documento_devolucion" class="mt-2" style="background-color: bisque;padding: 10px;">
                    <b>Documento de devolucion</b>
                    <p>{{tr.documento_devolucion}}</p>
                  </div>
                  <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 0 && tr.estado == '0'" class="mt-2 font-semibold">Regalado sin liquidar</span>
                  <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1 && tr.estado == '0'" class="mt-2 font-semibold">Regalado Liquidado</span>
                  <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 0 && tr.estado == '2'" class="mt-2 font-semibold">Acta regalada sin liquidar</span>
                  <span v-if="tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1 && tr.estado == '2'" class="mt-2 font-semibold">Acta regalada Liquidada</span>
              </vs-td>
              <vs-td>
                <div v-if="tr.institucionDirecta">
                  <b>Institución Venta directa:</b>
                  <p>{{data[indextr].institucionDirecta}}</p>
                </div>
                <div v-if="tr.institucionPuntoVenta">
                  <b>Institución Venta Lista:</b>
                  <p>{{data[indextr].institucionPuntoVenta}}</p>
                </div>
                <div v-if="tr.incorrecto == 1">
                  <p style="color:#b03a2e;"><i class="fa-solid fa-triangle-exclamation text-danger"></i> 2 puntos de despachos encontrados</p>
                </div>
              </vs-td>
              <vs-td>
                  {{data[indextr].periodoescolar}}<br>
              </vs-td>
              <vs-td>
                <div v-if="dLiquidado == 0">
                  <span v-if="tr.estado_liquidacion == 0 || tr.estado_liquidacion == 3 || tr.documento_devolucion != null || ( tr.estado_liquidacion == 2 && tr.liquidado_regalado == 1)">
                  </span>
                  <span v-else class="mt-2">
                    <!--usar switch-->
                    <vs-switch v-model="tr.devolverCheck" @input="changeDevolver(tr)">
                      <span slot="on" class="text-white">Si</span>
                      <span slot="off">No</span>
                    </vs-switch>
                  </span>
                </div>
                <div v-if="dLiquidado == 1">
                  <span v-if="tr.estado_liquidacion == 3 || tr.documento_devolucion != null">
                  </span>
                  <span v-else class="mt-2">
                    <!--usar switch-->
                    <vs-switch v-model="tr.devolverCheck" @input="changeDevolver(tr)">
                      <span slot="on" class="text-white">Si</span>
                      <span slot="off">No</span>
                    </vs-switch>
                  </span>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
  </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
export default {
  mixins: [Generalmix],
  data() {
    return{
      arrayCodigosEncontrados: [],
      arrayCodigosNoEncontrados: [],
      arrayMostrar: [],
      filtro: 0,
      ifVariosPeriodos:false,
      arrayCodes:[],
      tmpArrayCodes:[],
      codigoTipo:0,
      checkIncluirRegalados:false,
      checkIncluirActas:false,
      ifIncorrectoInstitucion:false,
      ifNotaCredito:false,
      arrayCodigosNotaCredito:[],
      arrayCodigosNotaCreditoAgrupados:[],
    }
  },
  props:{
    arregloCodigos:{
      type: [Array,Object],
      required: true,
      default: () => []
    },
    dLiquidado:{
      type: Number,
      required: true,
      default: 0
    },
    ifNuevoDocumento:{
      type: Number,
      required: true,
    },
    documentSelected:{
      type: [Object,String],
      required: true,
      default: () => {}
    },
    tipoBodega:{
      type: Number,
      required: true,
      default: 0
    }
  },
  watch:{
    arregloCodigos:{
      handler: async function(val) {
        let me = this;
        // Llama a f_ejecutarFuncionesStart y espera su completación
        await me.f_ejecutarFuncionesStart();

        // Ejecutar cambiarFiltro con el primer arreglo después de 1 segundo
        setTimeout(() => {
          if (me.arrayCodigosEncontrados.length > 0) {
            me.cambiarFiltro(me.arrayCodigosEncontrados[0]);
          }
        }, 1000);
      },
      deep:true
    },
    documentSelected:{
      handler(val){
        let me = this;
        me.documentSelected = val
      },
    },
    dLiquidado:{
      handler(val){
        let me = this;
        //ejecutar cambiarFiltro con el primer arreglo después de 2 segundos
        setTimeout(() => {
        //si existe filtroDevolucion en localStorage cambiarFiltro con el valor de filtroDevolucion
        if(localStorage.getItem('filtroDevolucion')){
          me.filtro = localStorage.getItem('filtroDevolucion')
          let menu = me.arrayCodigosEncontrados.find(p => p.institucion_id_select == me.filtro)
          me.cambiarFiltro(menu)
        }else{
          me.cambiarFiltro(me.arrayCodigosEncontrados[0])
        }
      }, 1000);
      },
    }
  },
  async mounted() {
    let me = this;
    await me.f_ejecutarFuncionesStart();
  },
  computed:{
    sumarCodigosDevolver(){
      let me = this;
      let datos = me.tmpArrayCodes.filter(p => p.devolver == 1)
      let resultado = datos.length

      return resultado
    },
    sumaTotal(){
      let me = this;
      let total = me.arrayCodes.length
      return total
    },
    sumaTodoRegalados(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0' && p.documento_devolucion == null)
      let resultado    = datos.length
      return resultado
    },
    sumaTodoActas(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '2');
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0' && p.documento_devolucion == null)
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosLiquidados(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosRegaladosActa(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '2');
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosRegaladosLiquidadosActa(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '2');
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosRegalados(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosRegaladosLiquidados(){
      let me = this;
      let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
      let resultado    = datos.length
      return resultado
    },
    SumaCodigosDevolucion(){
      let me = this;
      let datos       = me.arrayCodes.filter(p => p.estado_liquidacion == '3');
      let resultado   = datos.length
      return resultado
    },
    sumarCodigosGuias(){
      let me = this;
      //estado_liquidacion 4 es guias
      let datos = me.arrayCodes.filter(p => p.estado_liquidacion == '4')
      let resultado = datos.length
      return resultado
    },
    sumarCodigosPlus(){
      let me = this;
      let datos = me.arrayCodes.filter(p => p.plus == '1')
      let resultado = datos.length
      return resultado
    }
  },
  methods: {
    async f_ejecutarFuncionesStart() {
      let me = this;

      // Ejecutar la función start y esperar su completación
      await me.start();

      // Ejecutar la función startMenu y esperar su completación
      await me.startMenu();

      // Aquí puedes agregar más lógica si es necesario, por ejemplo, esperar un poco más
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Puedes añadir la lógica adicional que necesites después de que ambas funciones se hayan completado
    },
    async start() {
      let me = this;
      me.arrayCodigosEncontrados = [];
      me.arrayCodigosNoEncontrados = [];
      // Simulando una operación asincrónica (por ejemplo, una llamada a API)
      await new Promise((resolve) => {
        // Puedes reemplazar esto con una llamada real
        setTimeout(() => {
          me.arrayCodigosEncontrados = []
          let datos = me.arregloCodigos.encontrados

          if (datos.length > 0) {
            me.arrayCodigosEncontrados = datos
          }
          me.arrayCodigosNoEncontrados = me.arregloCodigos.no_encontrados;
          // Resolver la promesa
          resolve();
        }, 1000); // Simula un retraso de 1 segundo
      });
    },
    async startMenu() {
      let me = this
      if (localStorage.getItem('filtroDevolucion')) {
        me.filtro = localStorage.getItem('filtroDevolucion');
        let menu = me.arrayCodigosEncontrados.find(p => p.institucion_id_select == me.filtro);
        if (!menu) {
          me.cambiarFiltro(me.arrayCodigosEncontrados[0]);
        } else {
          me.cambiarFiltro(menu);
        }
      } else {
        me.cambiarFiltro(me.arrayCodigosEncontrados[0]);
      }
      
      // Activar el checkbox de incluir regalados después de cargar los datos
      setTimeout(() => {
        if (me.sumaTodoRegalados > 0) {
          me.checkIncluirRegalados = true;
          me.f_excluirRegalados();
        }
      }, 1500);
    },
    openConfirm(e) {
      let me = this
      // validar si tipoBodega es 0 y 1 validar si tiene combo no permitir dejar crear documento
      if( me.tipoBodega == 0 || me.tipoBodega == 1){
        let datosCombo = me.tmpArrayCodes.filter(p => p.devolver == 1 && p.codigo_combo != null)
        if(datosCombo.length > 0){
          me.m_message('No se puede crear el documento con combos, debe elegir tipo de importacion por combos', 'warning')
          return
        }
      }
      //si la institucion_id_select es 0 no se puede crear el documento
      if (e.institucion_id_select == 0) {
        me.m_message('No se puede crear el documento de una empresa sin institución', 'warning')
        return
      }
      //filtrar los devolver 1
      let datos = me.tmpArrayCodes.filter(p => p.devolver == 1)
      if (datos.length == 0) {
        me.m_message('No hay códigos para crear el documento', 'warning')
        return
      }
      //si la empresa es 0 no se puede crear el documento
      let ObjectSend = {
        institucion_id_select: e.institucion_id_select,
        institucion_select: e.institucion_select,
        venta_lista_institucion: e.venta_lista_institucion,
        ifNotaCredito: me.ifNotaCredito ? 1 : 0,
        arrayCodigosNotaCredito: me.arrayCodigosNotaCredito,
        data: datos
      }
      let enviar = []
      enviar.push(ObjectSend)
      me.$emit('openConfirm', enviar)
    },
    changeDevolver(tr) {
      let me = this
      me.tmpArrayCodes = []
      //cambiar  si devolver es 1 a 0 si es 0 a 1 del tmpArrayCodes
      let index = me.arrayCodes.findIndex(p => p.codigo == tr.codigo)
      if (me.arrayCodes[index].devolver == 1) {
        me.arrayCodes[index].devolver = 0
        me.arrayCodes[index].devolverCheck = false
      } else {
        me.arrayCodes[index].devolver = 1
        me.arrayCodes[index].devolverCheck = true
      }
      me.filtroTipo()
    },
    f_excluirRegalados() {
      let me = this
      me.tmpArrayCodes = []
      //si checkIncluirRegalados es true colocar devolver 1 a los liquidados sin regalar si es false 0
      if (me.checkIncluirRegalados) {
        me.arrayCodes.forEach(element => {
          if (element.estado_liquidacion == '2' && element.liquidado_regalado == '0'  && element.estado == '0' && element.documento_devolucion == null) {
            element.devolver = 1
            element.devolverCheck = true
          }
        });
      } else {
        me.arrayCodes.forEach(element => {
          if (element.estado_liquidacion == '2' && element.liquidado_regalado == '0' && element.estado == '0') {
            element.devolver = 0
            element.devolverCheck = false
          }
        });
      }
      me.filtroTipo()
    },
    f_excluirActas() {
      let me = this
      me.tmpArrayCodes = []
      //si checkIncluirActas es true colocar devolver 1 a los liquidados sin regalar si es false 0
      if (me.checkIncluirActas) {
        me.arrayCodes.forEach(element => {
          if (element.estado_liquidacion == '2' && element.liquidado_regalado == '0'  && element.estado == '2' && element.documento_devolucion == null) {
            element.devolver = 1
            element.devolverCheck = true
          }
        });
      } else {
        me.arrayCodes.forEach(element => {
          if (element.estado_liquidacion == '2' && element.liquidado_regalado == '0' && element.estado == '2') {
            element.devolver = 0
            element.devolverCheck = false
          }
        });
      }
      me.filtroTipo()
    },
    cambiarFiltro(menu) {
      let me = this;
      me.ifVariosPeriodos = false
      me.arrayMostrar = [];
      me.arrayCodes = [];
      me.tmpArrayCodes = [];
      this.filtro = menu.institucion_id_select;
      localStorage.setItem('filtroDevolucion', menu.institucion_id_select);
      let institucionSend = {
        institucion_id_select: menu.institucion_id_select,
        institucion_select: menu.institucion_select,
      }
      me.$emit('changeInstitucion', institucionSend)
      me.arrayMostrar = menu
      me.arrayCodes = me.arrayMostrar.data
      //agregar propiedad devolver:1 en arrayCodes
      me.arrayCodes.forEach(element => {
        //si dLiquidado es 1 osea que permiten los liquidados devolver solo estado_liquidacion a 3
        if (me.dLiquidado == 1) {
          if(element.estado_liquidacion == 0 || (element.liquidado_regalado == 1 && element.documento_devolucion == null)){
            element.devolver = 1
            element.devolverCheck = true
          }
          //si codigo_proforma empieza con A
          /*if (element.estado_liquidacion == '3' || element.documento_devolucion != null || element.proformaEnviadaPerseo == 1) {
            element.devolver = 0
            element.devolverCheck = false
          } else {
            element.devolver = 1
            element.devolverCheck = true
          }*/
        } else {
          //si estado_liquidacion 0 y 3 colocar devolver 0 o regalado liquidado
          if (element.estado_liquidacion == '0' || element.estado_liquidacion == '3' || element.estado_liquidacion == '2' || element.documento_devolucion != null) {
            element.devolver = 0
            element.devolverCheck = false
          } else {
            element.devolver = 1
            element.devolverCheck = true
          }
        }
      });

      me.arrayCodes.forEach(element => {
        const {bc_institucion, venta_lista_institucion, institucion_id_select} = element;

        // Inicializamos incorrecto en 0
        element.incorrecto = 0;

        // Verificamos bc_institucion
        if (bc_institucion > 0 && bc_institucion !== institucion_id_select) {
          element.incorrecto = 1;
        }

        // Verificamos venta_lista_institucion
        if (venta_lista_institucion > 0 && venta_lista_institucion !== institucion_id_select) {
          element.incorrecto = 1;
        }
      });
      //si encuentra varios bc_periodo colocar ifVariosPeriodos = true
      me.arrayCodes.forEach(element => {
        let primerPeriodo = me.arrayCodes[0].bc_periodo
        //si encuentra otro diferente al primer periodo entonces ifVariosPeriodos = true
        if (primerPeriodo != element.bc_periodo) {
          me.ifVariosPeriodos = true
        }
      });
      //filter si encuentra un incorrecto ifIncorrectoInstitucion = true
      me.tmpArrayCodes = me.arrayCodes.filter(p => p.incorrecto == 1)
      if (me.tmpArrayCodes.length > 0) {
        me.ifIncorrectoInstitucion = true
      } else {
        me.ifIncorrectoInstitucion = false
      }
      me.codigoTipo = 0
      me.filtroTipo()
    },
    filtroTipo() {
      let me = this
      me.tmpArrayCodes = []
      if (me.codigoTipo == 0) {
        me.tmpArrayCodes = me.arrayCodes
      }
      //liquidados
      else if (me.codigoTipo == 1) {
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' || p.estado == '0' || p.estado == '' || p.estado == null);
        me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion == '0')
      }
      //acta regalados
      else if (me.codigoTipo == 2) {
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '2');
        me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion == '2' && p.liquidado_regalado == '0')
      }
      //acta regalado liquidados
      else if (me.codigoTipo == 3) {
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '2');
        me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion == '2' && p.liquidado_regalado == '1')
      }
      //regalado sin liquidar
      else if (me.codigoTipo == 4) {
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
        me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion == '2' && p.liquidado_regalado == '0')
      }
      //regalado liquidado
      else if (me.codigoTipo == 5) {
        let primerFiltro = me.arrayCodes.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
        me.tmpArrayCodes = primerFiltro.filter(p => p.estado_liquidacion == '2' && p.liquidado_regalado == '1')
      }
      //devueltos
      else if (me.codigoTipo == 6) {
        me.tmpArrayCodes = me.arrayCodes.filter(p => p.estado_liquidacion == '3')
      }
      //GUIAS
      else if (me.codigoTipo == 7) {
        me.tmpArrayCodes = me.arrayCodes.filter(p => p.estado_liquidacion == '4')
      }
      //PLUS
      else if (me.codigoTipo == 8) {
        me.tmpArrayCodes = me.arrayCodes.filter(p => p.plus == '1')
      }
      //notas de credito
      me.f_codigoNotasCredito()
    },
    f_codigoNotasCredito() {
      let me = this;
      me.ifNotaCredito = false;
      me.arrayCodigosNotaCredito = [];
      me.arrayCodigosNotaCreditoAgrupados = []
      let dataResultados = me.tmpArrayCodes.filter(p => p.devolver == 1);
      console.log("dataResultados", dataResultados);
      // Foreach de dataResultados en la propiedad data
      // Recorrer y si encontramos la propiedad codigo_proforma que empiece con "N"
      // Entonces colocamos ifNotaCredito = true
      dataResultados.forEach(element => {
        if(element.codigo_proforma){
          if ((element.codigo_proforma.startsWith("N-") || element.codigo_proforma.startsWith("AI-")) && element.permitir_devolver_nota == 0) {
            me.ifNotaCredito = true;
            // Verificar si el elemento ya está en el array antes de agregarlo
            if (!me.arrayCodigosNotaCredito.some(e => e === element)) {
              me.arrayCodigosNotaCredito.push(element);
            }
          }
        }
      });
      //agrupado por codigo_liquidacion
      let agrupadoNota = new Map()
      me.arrayCodigosNotaCredito.forEach(p => {
        if(!agrupadoNota.has(p.codigo_liquidacion)){
          agrupadoNota.set(p.codigo_liquidacion, true);
          me.arrayCodigosNotaCreditoAgrupados.push({
            codigo: p.codigo_liquidacion,
            cantidad: me.arrayCodigosNotaCredito.filter(item => item.codigo_liquidacion == p.codigo_liquidacion).length
          })
        }
      })//fin forEach
      console.log("arrayCodigosNotaCreditoAgrupados", me.arrayCodigosNotaCreditoAgrupados);
    },//fin f_codigoNotasCredito,
  }
}
</script>
<style scoped>
* {
  color: black;
}

/* MENU */
.activeBtn {
  color: white !important;
}

.customBackground {
  background-color: var(--fondo, #101b22); /* Uso de variable CSS para el color de fondo */
}

/** ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
  outline: none;
  padding: 0.75em 0.75em 0.75em 1.25em;
  position: relative;
  text-decoration: none;
  transition: background 0.2s linear;
  color: black;
  cursor: pointer;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
  background: #adaaa8;
  color: #000;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
  background: #1cbeb3;
  color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
  background: white;
  bottom: 0;
  clip-path: polygon(50% 50%, -50% -50%, 0 100%);
  content: "";
  left: 100%;
  position: absolute;
  top: 0;
  transition: background 0.2s linear;
  width: 1em;
  z-index: 1;
}

.breadcrumbs__item:before {
  background: #cbd2d9;
  margin-left: 1px;
}

.breadcrumbs__item:last-child {
  border-right: none;
}

.breadcrumbs__item.is-active {
  background: #edf1f5;
}

</style>
