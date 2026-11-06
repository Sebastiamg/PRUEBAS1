<template>
  <div>
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
       <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
         <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
                <b>Código</b>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <b>Institución</b>
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
        <h4>Está seguro de aplicar estas códigos?</h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div class="mb-6" align="center">
      <div class="vx-col w-full">
        <p style="color:#60E029;">
          <i class="fa fa-file" aria-hidden="true"></i>  Revisión de codigos  <span style="font-weight: bold;">(no ingrese más de 2000 registros en una sola carga.)</span>
        </p>
        <div v-if="userRoot">
          <ul class="flex justify-center mt-2">
            <li>
              <b>Seleccione:</b>
            </li>
            <li>
              <vs-radio v-model="conDevolucion" class="ml-2" vs-name="radios1conDevolucion" vs-value="1">Con devolución</vs-radio>
            </li>
            <li>
              <vs-radio v-model="conDevolucion" class="ml-2" vs-name="radios1conDevolucion" vs-value="0">Sin devolución</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div class="flex">
        <div v-if="(tipoBodega == '1' || tipoBodega == '2')&& arregloProblemasDiagnostico.length > 0" class="ml-5" style="width:50%;">
          <vs-alert title="Archivo con inconvenientes" color="danger" active="true">
            <p>Existe codigos de <b>diágnostico</b> con problemas <b class="cursor-pointer" style="background:black;color:white;padding:5px;border-radius:5px;" @click="popupProblemasDiagnostico = true;"><ion-icon name="code-outline"></ion-icon> Mostrar códigos</b>
            </p>
          </vs-alert>
        </div>
      </div> -->
      <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
      <!--RESUMEN PAQUETES-->
      <div v-if="codigosPerdidos == true && (tipoBodega == '3' || tipoBodega == '4')">
        <vs-card v-if="arregloErroresPaquetes.length > 0">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <p>Cantidad <span>{{ arregloErroresPaquetes.length }}</span></p>
                <vs-list-header icon="supervisor_account" title="Hubo problemas con algunos paquetes"></vs-list-header>
                <vs-list-item :key="indextr" v-for="(tr, indextr) in arregloErroresPaquetes" icon="check" :title="tr.paquete" >
                  <p> {{ tr.problema }}</p>
                </vs-list-item>
            </vs-list>
          </vs-col>
        </vs-card>
        <TableResumenPaqueteVue class='mt-2' :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend" :desdeRevision="1"/>
      </div>
      <br/>
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
      <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" style="height:100px;" icon-pack="feather" icon="icon-alert-triangle">
        <p class="text-2xl font-bold text-center">{{ titleImportacion }}</p>
          <vs-divider style="margin-top:-2px;"></vs-divider>
          <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
      </vs-alert>
      <vs-row v-if="tableData.length > 0 && tableData.length <= 2500 ">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)"> Revisar códigos </vs-button>
              <!--boton mostrar errores-->
              <vs-button v-if="arregloProblemasDiagnostico.length > 0 || arregloProblemasPaquete.length > 0" class="mb-2 ml-5" color="danger"  type="border" @click="popupProblemasDiagnostico = true;"><i class="fa-solid fa-triangle-exclamation"></i> Mostrar errores </vs-button>
          </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-card v-if="codigosNoExisten.length > 0">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                <vs-list>
                    <vs-list-header icon="supervisor_account" :title="'Códigos que no existen | Cantidad: '+codigosNoExisten.length"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoExisten"  :title="tr.codigo" >
                    </vs-list-item>
                </vs-list>
            </vs-col>
        </vs-card>
        <vs-card v-if="arrayPaqueteComboSinHijos.length > 0">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
              <vs-list>
                  <vs-list-header color="danger" icon="supervisor_account" :title="tipoBodega == '3'? 'Paquetes que no tiene codigos | Cantidad: '+arrayPaqueteComboSinHijos.length:'Combos que no tiene codigos | Cantidad: '+arrayPaqueteComboSinHijos.length"></vs-list-header>
                  <vs-list-item :key="indextr" v-for="(tr, indextr) in arrayPaqueteComboSinHijos"  :title="tr.codigo" >
                  </vs-list-item>
              </vs-list>
          </vs-col>
          </vs-card>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-card>
          <div v-if="duplicados == 1">
            <p class="text-3xl text-danger font-bold">EXISTE CODIGOS DUPLICADOS VERIFIQUE SU ARCHIVO</p>
            <p style="text-align: left;font-size: 18px;font-weight: bold;">Total Códigos: {{ contadorCodigos }}</p>
            <p style="text-align: left;font-size: 18px;font-weight: bold;">Códigos válidos: {{ informacion.length }}</p>
            <vs-button color="danger" type="gradient" icon-pack="feather" icon="icon-x-circle" @click="popupMostrarDuplicados = true;" style="font-size: 18px;">Mostrar codigos duplicados</vs-button>
          </div>
          <!--FILTROS-->
          <vs-card>
            <div class="title">
              Filtro de codigos
            </div>
            <div class="mt-5">
              <ul style="display:flex;flex-wrap: wrap;">
                <li>
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{sumaTotal}}</span> Todos</vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="2"><span style="font-weight:bold;">{{sumaCodigosBloqueados}}</span> Códigos bloqueados</vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{sumaCodigosRegalados}}</span> Regalados sin liquidar</vs-radio>
                </li>
                <li class="ml-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="3"><span style="font-weight:bold;">{{sumarCodigosNoleidos}}</span> Códigos sin leer </vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="5"><span style="font-weight:bold;">{{sumarCodigosLiquidados}}</span><span :style="sumarCodigosLiquidados > 0 ? 'color:red':''"> Códigos Liquidados </span> </vs-radio>
                </li>
                <li class="ml-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="6"><span style="font-weight:bold;">{{sumaCodigosRegaladosLiquidados}}</span><span :style="sumaCodigosRegaladosLiquidados > 0 ? 'color:red':''"> Regalados Liquidados </span> </vs-radio>
                </li>
                <li class="ml-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="8"><span style="font-weight:bold;">{{SumaCodigosDevolucion}}</span> Códigos devueltos</vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="7"><span style="font-weight:bold;">{{sumarCodigosporLiquidarse}}</span><span :style="sumarCodigosporLiquidarse > 0 ? 'color:red':''"> Códigos a liquidarse (leidos) </span> </vs-radio>
                </li>
                <li class="ml-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="9"><span style="font-weight:bold;">{{sumarCodigosVentaDirecta}}</span> Venta directa</vs-radio>
                </li>
                <li class="ml-2">
                  <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="10"><span style="font-weight:bold;">{{sumarCodigosVentaLista}}</span> Venta lista</vs-radio>
                </li>
              </ul>
            </div>
          </vs-card>
          <gestionCodigosLista :arregloCodigos="tmparregloCodigos" :openModal="Number(1)"/>
        </vs-card>
      </vs-row>
    </div>
    <!-- Sección para mostrar códigos formateados (solo para sguacan) -->
    <div v-if="preCodigos.length > 0 && usuario.name_usuario =='sguacan'" class="vx-row mt-3">
      <!-- Primera columna - Códigos sin OR -->
      <div>
        <span class="cursor-pointer mb-2 text-primary font-bold" @click="copiarCodigos(preCodigos)">Copiar</span>
        <div v-for="(item, key) in preCodigos" :key="key">
          <p>{{ item }}</p>
        </div>
      </div>
      <!-- Segunda columna - Códigos con OR -->
      <div class="ml-4">
        <span class="cursor-pointer mb-2 text-primary font-bold" @click="copiarCodigosOr(preCodigos)">Copiar</span>
        <div v-for="(item, key3) in preCodigos" :key="key3">
          <p>OR codigo='{{ item }}'</p>
        </div>
      </div>
    </div>
    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="20" search :data="tableData">
        <template slot="header">
          <ion-icon name="eye-off-outline" v-if="preCodigos.length > 0" @click="preCodigos = []"></ion-icon>
          <p @click="formatCode()" v-if="usuario.name_usuario =='sguacan'">
            <vs-chip>Cantidad {{ tableData.length }}</vs-chip>
          </p>
          <vs-chip v-else>Cantidad {{ tableData.length }}</vs-chip>
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
    <vs-popup classContent="popup-example" title="Mostrar codigos duplicados" :active.sync="popupMostrarDuplicados">
      <vs-table max-items="10" search pagination :data="mostrarDuplicados">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ mostrarDuplicados.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Codigo</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
                {{data[indextr]}}<br>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado">
      <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
      <p class="text-danger mt-2 text-center">!Los paquetes máximo 200 paquetes</p>
      <vs-divider></vs-divider>
      <div class="flex justify-center mt-2" style="flex-wrap: wrap;">
        <vs-button class="mr-3" color="primary"   @click="tipoBodega= 0;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Normal (Activación)';">Activación</vs-button>
        <vs-button class="mr-3" color="success"   @click="tipoBodega= 0;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Normal (Diágnostica)';">Diágnostica</vs-button>
      </div>
      <div class="flex justify-center mt-5">
        <vs-button class="mr-3" color="warning"   @click="tipoBodega= 1;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Activación - Diágnostico';ejecutarValidacion();" type="border"> Activación -Diágnostica</vs-button>
        <vs-button class="mr-3" color="dark"      @click="tipoBodega= 2;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Diágnostico - Activación)';ejecutarValidacion();" type="border"> Diágnostica -Activación</vs-button>
      </div>
      <div class="flex justify-center">
        <vs-button class="m-3" color="#29BCC6"    @click="tipoBodega= 3;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Paquetes';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
        <vs-button class="m-3" color="#f7d03f"    @click="tipoBodega= 4;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Combos';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Combos</vs-button>
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO O PAQUETES-->
    <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
      <div v-if="tipoBodega == 1 || tipoBodega == 2">
        <TableProblemasDiagnosticoVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasDiagnostico="arregloProblemasDiagnostico"/>
      </div>
      <div v-if="tipoBodega == 3 || tipoBodega == 4">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete" :tipoImortacion="tipoBodega == 3 ? 'paquete' : 'combo'"/>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import gestionCodigosLista from './utils/gestionCodigosLista.vue'
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
import TableProblemasDiagnosticoVue from './utils/TableProblemasDiagnostico.vue'
const TablaErroresPaqueteVue = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
import Paquetemix from '../../../mixins/Paquetemix'
export default {
  mixins:[Paquetemix],
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    TableProblemasDiagnosticoVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
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
      cedulas_no_encontradas: [],
      modalCedulas: false,
      informacion:[],
      tmparregloCodigos:[],
      codigosNoExisten:[],
      cantidadNoExisten:0,
      duplicados:0,
      contadorCodigos:0,
      mostrarDuplicados:[],
      popupMostrarDuplicados:false,
      conDevolucion:'0',
      userRoot:false,
      //variables para filtros
      codigoTipo:'0',
      //fin variables para filtros
      //VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      tipoBodega:0,
      popupProblemasDiagnostico:false,
      popupConfirmTipoImportado:false,
      arregloProblemasDiagnostico:[],
      titleImportacion:'',
      //variables para paquetes
      arregloFormatoSend:[],
      arregloProblemasPaquete:[],
      arregloResumen:[],
      arregloErroresPaquetes:[],
      //fin variables para paquetes
      arrayPaqueteComboSinHijos:[],
      //variables para copiar códigos (similar a GenerarCodigosGrafitex)
      preCodigos:[],
      preActivacion:[],
    }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos = false
  },
  mounted(){
    let me = this;
    me.getUserRoot(me.usuario);
  },
  computed:{
    sumaTotal(){
      let me = this;
      let total = me.informacion.length
      return total
    },
    SumaCodigosDevolucion(){
      let me = this;
      let datos       = me.informacion.filter(p => p.estado_liquidacion == '3');
      let resultado   = datos.length
      return resultado
    },
    sumaCodigosRegalados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosRegaladosLiquidados(){
      let me = this;
      let datos        = me.informacion.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
      let resultado    = datos.length
      return resultado
    },
    sumaCodigosBloqueados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado_liquidacion != '3');
      let datos         = primerFiltro.filter(p => p.estado == '2')
      let resultado     = datos.length
      return resultado
    },
    sumarCodigosActivos(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosLiquidados(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosporLiquidarse(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado =='2'));
      let datos        = primerFiltro
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosLeidos(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos        = primerFiltro.filter(p => p.bc_estado =='2')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosNoleidos(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
      let datos        = primerFiltro.filter(p => p.bc_estado =='1')
      let resultado    = datos.length
      return resultado
    },
    sumarCodigosVentaDirecta(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 1));
      let resultado    = primerFiltro.length
      return resultado
    },
    sumarCodigosVentaLista(){
      let me = this;
      let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 2));
      let resultado    = primerFiltro.length
      return resultado
    }
  },
  methods: {
    ejecutarValidacion(){
      let me = this;
      if(me.tipoBodega == 1 || me.tipoBodega == 2) { me.validateCodigos() }
      if(me.tipoBodega == 3) { me.validateCodigosPaquete() }
      if(me.tipoBodega == 4) { me.validateCodigosCombo() }
    },
    validateCodigos(){
      let me                            = this;
      try{
        let datos                       = []
        me.arregloProblemasDiagnostico  = []

        datos = me.tableData.filter(p => !p.codigo.startsWith("PAQ-") && !p.codigo.startsWith("paq-") && !p.codigo.startsWith("CMB-") && !p.codigo.startsWith("cmb-"))
        var preValores                  = []
        //quitar types NumRow
        datos.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo
          preValores.push(obj)
        });
        var getLongitud = datos.length
        var longitud    = getLongitud/2
        for(var i = 0; i<longitud;i++){
          // Creamos un nuevo array para almacenar los objetos quitados
          const nuevoArray        = [];
          let   codigoActivacion  = "";
          let   codigoDiagnostico = "";
          // Quitamos los dos primeros objetos del array original y los agregamos al nuevo array
          nuevoArray.push(preValores.splice(0, 2));
          var setear = nuevoArray.flat()
          console.log("tipo",me.tipoBodega)
          //====VALIDACION SI SOLO HAY UN CODIGO====
          if(setear.length == 1){
            var cal = new Object
            //ACTIVACION - DIAGNOSTICO)
            if(me.tipoBodega == 1){
              cal.codigoActivacion =  setear[0].codigo
              cal.codigoDiagnostico  =  ""
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.tipoBodega == 2){
              cal.codigoDiagnostico =  setear[0].codigo
              cal.codigoActivacion  =  ""
            }
            cal.problema          =  'formato'
            me.arregloProblemasDiagnostico.push(cal)
          }
          //==SI TODO ESTA NORMAL===
          else{
            //ACTIVACION - DIAGNOSTICO)
            if(me.tipoBodega == 1){
              codigoActivacion      = setear[0].codigo;
              codigoDiagnostico     = setear[1].codigo
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.tipoBodega == 2){
              codigoDiagnostico     = setear[0].codigo
              codigoActivacion      = setear[1].codigo;
            }
            //============ACTIVACION==================================
            //VALIDACION SI NO SON STRING
            if (typeof codigoActivacion !== 'string' || typeof codigoDiagnostico !== 'string' ) {
              var cal = new Object
              cal.codigoActivacion  =  codigoActivacion
              cal.codigoDiagnostico =  codigoDiagnostico
              cal.problema          =  'formato'
              me.arregloProblemasDiagnostico.push(cal)
            }
            else{
              const activacionMinuscula = codigoActivacion.toLowerCase();
              //validar que el codigo de activacion no tenga una P
              if(activacionMinuscula.startsWith("p")){
                //validar meñique que el codigo de activacion se permita empezar por p DONDE SEA PLM no hago nada
                if(activacionMinuscula.startsWith("plm")){
                }else{
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'activacion'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
              //=============DIAGNOSTICO===================================
              //validar que el codigo de activacion tenga una P
              const diagnosticoMinuscula = codigoDiagnostico.toLowerCase();
              //validar si es meñique debe tener 2 pp
              if(activacionMinuscula.startsWith("plm")){
                //si no inicia por 2 pp
                if(!diagnosticoMinuscula.startsWith("pp")){
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'diagnostico'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
              //diferente a meñique
              else{
                if(!diagnosticoMinuscula.startsWith("p")){
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'diagnostico'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
            }
          }
        }//Fin FOR
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasDiagnostico.length > 0){
          me.popupProblemasDiagnostico = true
        }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    //==================================METODOS PAQUETES===================
    validateCodigosPaquete() {
      let me = this;
      try {
        // Llamamos al método de validación y almacenamos los resultados en arregloFormatoSend
        const resultado = me.m_validatePaquete(me.tableData,'paquete','paq');  // Asumiendo que `validatePaquete` es tu método de validación
        me.arregloFormatoSend      = resultado.arregloFormatoSend;  // Asignamos los paquetes válidos
        me.arregloProblemasPaquete = resultado.arregloProblemasPaquete;  // Asignamos los problemas

        // Si hay errores en el archivo, mostramos el modal
        if (me.arregloProblemasPaquete.length > 0) {
          me.popupProblemasDiagnostico = true;
        }
      } catch (err) {
        console.log("err", err);
        alert("Hubo problemas con tu archivo excel");
      }
    },
    validateCodigosCombo() {
      let me = this;
      me.errorCombos = false
      try {
        // Llamamos al método de validación y almacenamos los resultados en arregloFormatoSend
        const resultado = me.m_validatePaquete(me.tableData,'combo','cmb');  // Asumiendo que `validatePaquete` es tu método de validación
        me.arregloFormatoSend = resultado.arregloFormatoSend;  // Asignamos los paquetes válidos
        me.arregloProblemasPaquete = resultado.arregloProblemasPaquete;  // Asignamos los problemas

        // Si hay errores en el archivo, mostramos el modal
        if (me.arregloProblemasPaquete.length > 0) {
          me.popupProblemasDiagnostico = true;
        }
      } catch (err) {
        console.log("err", err);
        alert("Hubo problemas con tu archivo excel");
      }
    },
    //===================================FIN METODOS PAQUETES===============
    filtroTipo(){
      let me = this;
      me.tmparregloCodigos = []
      let datos = me.informacion
      //para ver los codigos activos
      // if(me.codigoTipo == 1){
      //     let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
      //     me.tmparregloCodigos = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
      //     return
      // }
      //para ver los codigos bloqueados
      if(me.codigoTipo == 2){
          let primerFiltro = datos.filter(p => p.estado_liquidacion != '3');
          me.tmparregloCodigos = primerFiltro.filter(p => p.estado =='2')
          return
      }
      //para ver lso codigos sin ler
      if(me.codigoTipo == 3){
          let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
          me.tmparregloCodigos = primerFiltro.filter(p => p.bc_estado =='1')
          return
      }
      //para ver los codigos regalados
      if(me.codigoTipo == 4){
          let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
          me.tmparregloCodigos = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
          return
      }
      //para ver los codigos liquidados
      if(me.codigoTipo == 5){
          let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
          me.tmparregloCodigos = primerFiltro.filter(p => p.estado_liquidacion =='0')
          return
      }
      //para ver los codigos regalados liquidados
      if(me.codigoTipo == 6){
          me.tmparregloCodigos = datos.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
          return
      }
      //para ver los codigos por liquidarse
      if(me.codigoTipo == 7){
          let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado ==2));
          me.tmparregloCodigos = primerFiltro
          return
      }
      //para ver los codigos devueltos
      if(me.codigoTipo == 8){
        let primerFiltro = datos.filter(p => p.estado_liquidacion == '3');
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver los codigos venta directa
      if(me.codigoTipo == 9){
        let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 1));
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver los codigos venta lista
      if(me.codigoTipo == 10){
        let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.venta_estado == 2));
        me.tmparregloCodigos = primerFiltro
        return
      }
      //para ver todos los codigos
      else{
        me.tmparregloCodigos = datos
      }
    },
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos            = false
      this.header                     = header
    //   const arrayOfObj = [{
    //     key1: 'value1',
    //     key2: 'value2'
    //   }, {
    //     key1: 'value1',
    //     key2: 'value2'
    //   }];
    //   const newArrayOfObj = arrayOfObj.map(({ key1: stroke, ...remainingProps }) => ({
    //   stroke,
    //   ...remainingProps
    // }));
     const newArrayOfObj = results.map(obj => {
        // Obtenemos todas las claves del objeto
        const keys = Object.keys(obj);
        // Seleccionamos la primera clave dinámicamente
        const firstKey = keys[0];
        // Eliminamos la primera propiedad del objeto y obtener los valores restantes
        const { [firstKey]: deletedKey, ...rest } = obj;
        // Retornamos un nuevo objeto con la primera propiedad reemplazada por "codigo" y las restantes
        return {
          codigo: deletedKey,
          ...rest
        };
      });
      this.tableData                  = newArrayOfObj
      this.sheetName                  = meta.sheetName
      this.popupConfirmTipoImportado  = true;
      this.arregloFormatoSend         = []
      this.arregloProblemasPaquete    = []
      this.arregloResumen             = []
      this.arregloErroresPaquetes     = []
    },
    getUserRoot(dato) {
      let me = this;
      this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
        .then((res) => {
          if (res.data.length > 0) {
            me.userRoot = true;
          }
        })
        .catch((err) => {
            console.log(err)
        })
      },
    procesarPagos(){
      let me = this
      me.duplicados = 0
      me.contadorCodigos = 0
      me.mostrarDuplicados = []
      me.arrayPaqueteComboSinHijos = []
      if(me.conDevolucion == null || me.conDevolucion == "" || me.conDevolucion == undefined){
        me.$vs.notify({
        text:'Seleccione si la revisión es con devolución o no',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      //si escogio tipo de importacion Diagnostico
      if(me.tipoBodega == 1 || me.tipoBodega == 2){
        if(me.arregloProblemasDiagnostico.length > 0){
          me.$vs.notify({
          text:'Existe codigos de activación con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      //si escogio tipo de paquete o combo
      if(me.tipoBodega == 3 || me.tipoBodega == 4){
        if(me.arregloFormatoSend.length > 200){
          me.$vs.notify({
          text:'No puedes subir mas de 200 '+me.tipoBodega == 3 ? 'paquetes' : 'combos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(me.arregloFormatoSend.length == 0){
          me.$vs.notify({
          text:'Hubo problemas para subir los '+me.tipoBodega == 3 ? 'paquetes' : 'combos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      var json_pagos = ""
      if (me.tipoBodega == 3 || me.tipoBodega == 4) {
      json_pagos = JSON.stringify(me.arregloFormatoSend);
      } else {
        json_pagos = JSON.stringify(
          me.tableData.filter(p =>
              !p.codigo.startsWith("PAQ-") &&
              !p.codigo.startsWith("paq-") &&
              !p.codigo.startsWith("CMB-") &&
              !p.codigo.startsWith("cmb-")
          )
        );
      }
      let formData = new FormData();
      formData.append('data_codigos',   json_pagos);
      formData.append('conDevolucion',  me.conDevolucion);
      formData.append('tipoBodega',     me.tipoBodega)
      //tipo paquete
      var url = ""
      if(me.tipoBodega == '3' || me.tipoBodega == '4'){
        url = this.$server_url+'paquetes/revision'
      }else{
        url = this.$server_url+'codigos/revision'
      }
      me.$vs.loading()
      this.$http.post(url, formData)
      .then(res => {
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.modalConfirm     = false
          me.tableData        = []
          me.codigosPerdidos  = true
          me.informacion      = res.data.informacion
          me.tmparregloCodigos = res.data.informacion
          //paquetes
          if( this.tipoBodega == 3 || this.tipoBodega == 4){
            me.arregloResumen                         = res.data.arregloResumen
            me.arregloErroresPaquetes                 = res.data.arregloErroresPaquetes
            me.arrayPaqueteComboSinHijos              = res.data.arrayPaqueteComboSinHijos
          }else{
            let original = res.data.informacion
            //quitar arrays duplicados
            me.contadorCodigos = res.data.informacion.length
            let datos = res.data.informacion
            let hash = {};
            datos = datos.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
            //verificar duplicados
            let conteoTotal    =  me.informacion.length
            if(me.contadorCodigos != conteoTotal){
              me.duplicados = 1
              //mostrar duplicados
              const valores = original.map(persona => persona.codigo);
              me.mostrarDuplicados = valores.filter((edad, index) => valores.indexOf(edad) !== index);
              me.popupMostrarDuplicados = true;
            }
            //fin mostrar duplicados
            me.codigosNoExisten = res.data.codigosNoExisten
          }
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
      //volver a revisar que este bien el formato del excel
      me.ejecutarValidacion()
      me.tipo_selected = tipo
      if( !me.tableData[0].codigo){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.arregloProblemasDiagnostico.length > 0){
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.arregloProblemasPaquete.length > 0){
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.codigo ){
          me.errores.push(value)
        }
      })
      if( me.errores.length > 0 ){
        me.modalErrores = true
      }else{
        me.modalConfirm = true
      }
    },
    // Métodos para formatear y copiar códigos (similar a GenerarCodigosGrafitex)
    formatCode(){
      let me = this
      me.preCodigos = []
      let nuevaData = me.tableData
      console.log("nuevaData",nuevaData)
      nuevaData.forEach((dato) => {
        if(dato.codigo) {
          me.preCodigos.push(dato.codigo);
        }
      });
    },
    copiarCodigos(codigos) {
      // Unir los códigos en una sola cadena de texto
      const textoACopiar = codigos.join('\n');

      // Copiar al portapapeles
      navigator.clipboard.writeText(textoACopiar)
        .then(() => {
          this.$vs.notify({
            text: 'Códigos copiados al portapapeles',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        })
        .catch(err => {
          console.error('Error al copiar al portapapeles: ', err);
        });
    },
    copiarCodigosOr(codigos) {
      // Formatea cada código con OR delante
      const codigosFormateados = codigos.map(item => `OR codigo='${item}'`);
      // Une los códigos en una sola cadena de texto
      const textoACopiar = codigosFormateados.join('\n');
      // Copia al portapapeles desde el primer 'codigo='
      const index = textoACopiar.indexOf("codigo='");
      const textoFinal = index !== -1 ? textoACopiar.substring(index) : textoACopiar;
      navigator.clipboard.writeText(textoFinal)
        .then(() => {
          this.$vs.notify({
            text: 'Códigos copiados al portapapeles',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        })
        .catch(err => {
          console.error('Error al copiar al portapapeles: ', err);
        });
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
  background-color: #60E029;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
