
<template>
  <div>
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" class="p-0">
       <div class="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white rounded-lg p-4 shadow-md">
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
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.Id_institucion"> {{item.Id_institucion}} </span>
              </div>
               <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.comentario"> {{item.comentario}} </span>
              </div>
              <div class="vx-col sm:w-1/2 w-full">
                  <span v-if="item.venta_estado"> {{item.venta_estado}} </span>
              </div>
          </div>
        </div>
       </div>
    </vs-popup>
    <vs-popup title="Códigos no encontrados" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()" class="p-0">
       <div class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg p-3 shadow-sm">
        <div class="vx-row">
          <div class="vx-col w-full text-center">
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
      <div class="w-full mb-base text-center">
        <h4 class="text-lg font-semibold text-gray-700">¿Estás seguro de aplicar estos códigos?</h4>
      </div>
      <p v-if="tipoBodega == 3" class="text-center font-bold">Importación Paquetes</p>
      <p v-if="tipoBodega == 0" class="text-center font-bold">Importación Códigos Normales</p>
      <div v-if="Removeplus == 1" class="flex justify-center mt-2">
        <b>Quitar plus:</b>
        <p class="ml-2">Si</p>
      </div>
      <div v-if="dLiquidado == 1" class="flex justify-center mt-2">
        <b>Activar códigos liquidados:</b>
        <p class="ml-2">Si</p>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2 mt-3 rounded-lg shadow-sm px-6" color="danger" type="gradient" @click="procesarPagos()">Confirmar</vs-button>
      </div>
    </vs-popup>
    <vs-card>
      <div v-if="tipoBodega == 3 || tipoBodega == 4">
        <!--REGALADOS-->
        <div class="flex items-center mb-3">
          <b class="mr-4">Activar códigos regalados</b>
          <vs-switch v-model="activarRegalado" :value="1">
            <span slot="on">Si</span>
            <span slot="off">No</span>
          </vs-switch>
        </div>
        <!--BLOQUEADOS-->
        <div class="flex items-center mb-3">
          <b class="mr-4">Activar códigos bloqueados</b>
          <vs-switch v-model="activarBloqueado" :value="1">
            <span slot="on">Si</span>
            <span slot="off">No</span>
          </vs-switch>
        </div>
        <!--REGALADOS Y BLOQUEADOS-->
        <div class="flex items-center mb-3">
          <b class="mr-4">Activar Regalados y bloqueados</b>
          <vs-switch v-model="activarRegaladoyBloqueado" :value="1">
            <span slot="on">Si</span>
            <span slot="off">No</span>
          </vs-switch>
        </div>
      </div>
      <!--Removeplus-->
      <div class="ml-6">
        <div class="flex items-center mb-3">
          <span class="mr-4">Quitar plus en los codigos</span>
          <vs-switch v-model="Removeplus" :value="1">
            <span slot="on">Si</span>
            <span slot="off">No</span>
          </vs-switch>
        </div>
      </div>
      <div class="ml-6">
        <div class="flex items-center mb-3">
          <span class="mr-4">Activar códigos liquidados</span>
          <vs-switch v-model="dLiquidado" :value="1">
            <span slot="on">Si</span>
            <span slot="off">No</span>
          </vs-switch>
        </div>
      </div>
      <div slot="header">
          <div class="flex items-center space-x-2">
            <i class="fa fa-pencil text-blue-600"></i>
            <span class="text-blue-600 font-semibold">Activar Devolución</span>
          </div>
      </div>
      <div>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-textarea counter="200" class="w-full max-w-3xl" label="Motivo de activación de la devolución" :counter-danger.sync="counterDanger" v-model="observacion" />
          </vs-col>
        </vs-row>
      </div>
      <div class="mb-6 mt-5" align="center">
          <div class="vx-col w-full">
            <p class="text-blue-600">
              <i class="fa fa-file mr-2" aria-hidden="true"></i>Estos códigos serán activados desde la devolución <span class="font-bold"> (No ingrese más de 1000 registros en una sola carga.)</span>
            </p>
            <p class="text-sm text-gray-600">En los paquetes no ingrese más de <b>200 paquetes</b></p>
          </div>
          <br/>
          <!--RESUMEN PAQUETES-->
          <div v-if="codigosPerdidos == true && (tipoBodega == '3' || tipoBodega == '4')">
            <vs-card v-if="arregloErroresPaquetes.length > 0">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                    <p>Cantidad <span>{{ arregloErroresPaquetes.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Hubo problemas con algunos paquetes"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in arregloErroresPaquetes" icon="check" :title="tr.paquete" >
                      <p class="text-danger font-bold"> {{ tr.problema }}</p>
                    </vs-list-item>
                  </vs-list>
              </vs-col>
            </vs-card>
            <TableResumenPaqueteVue v-if="arregloResumen.length > 0" :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend" :tipoDescripcion="tipoBodega == '3' ? 'paquete' : 'combo'"/>
          </div>
          <import-excel :onSuccess="loadDataInTable"  class="mb-4" v-if="tableData.length == 0"/>

          <!-- {{tableData}} -->
          <vs-alert v-if="tableData.length > 0" style="height: 80px;" class="mb-3 min-h-[90px]" color="success" icon-pack="feather" icon="icon-alert-triangle">
              <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
              <b>{{titleImportacion}}</b>
          </vs-alert>
          <div v-if="tableData.length > 0 && tableData.length <= 1000 " class="flex justify-center">
            <vs-button class="mb-2 rounded-lg shadow-sm px-4 mr-5" color="warning"  type="relief" @click="f_limpiarClosePopup"><i class="fa-solid fa-upload"></i> Subir otro archivo </vs-button>
            <vs-button class="mb-2 rounded-lg shadow-sm px-4 mr-5 ml-5" color="primary"  type="relief" @click="openConfirm(0)">Activar códigos</vs-button>
            <vs-button v-if="arregloProblemasPaquete.length > 0" class="mb-2 rounded-lg shadow-sm px-4" color="danger" type="border" @click="popupProblemasDiagnostico=true;">Mostrar errores de {{ tipoBodega == '3' ? 'paquetes' : 'combos' }}</vs-button>
          </div>
          <vs-row v-if="codigosPerdidos == true && (tipoBodega == '0' || tipoBodega == '1' || tipoBodega == '2')">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-alert active="true">
                    Se activo  {{ porcentaje }} códigos de la devolucion
                    <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
                  </vs-alert>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
             <vs-card>
              <vs-col vs-type="flex" v-if="codigosNoCambiados.length > 0" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                    <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                      <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                        <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                      </vs-list-item>
                  </vs-list>
              </vs-col>
              <vs-col vs-type="flex" v-if="codigoNoExiste.length > 0" vs-justify="center" vs-align="center" vs-w="6">
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
    </vs-card>
    <vs-row v-if="codigosPerdidos == true">
        <vs-card v-if="codigoSinDevolucion.length > 0">
          <div class="header">
              <span class="font-bold">Códigos con problemas</span>
          </div>
          <TableRadiosCodigosListaVue :arregloCodigos="codigoSinDevolucion" :openModal="Number(1)"/>
          <!-- <gestionCodigosListaVue :arregloCodigos="codigoSinDevolucion" openModal="1"/> -->
        </vs-card>
    </vs-row>
    <vx-card v-if="tableData.length && header.length && tipoBodega != 0" class="mt-4">
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
    <div v-if="tableData.length && header.length && tipoBodega == 0">
      <CodigosPrefacturasPreviewVue :arrayCodigosEncontrados="arrayCodigosEncontrados" :btnNotImportar="Number(1)"/>
    </div>
    <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
    <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosListaVue :arregloCodigos="codigosSinCodigoUnion" :openModal="Number(0)"/>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado" @close="popupConfirmTipoImportado=true;">
      <TipoImportacionVue v-if="popupConfirmTipoImportado" @changeTipo="changeTipo" :tableData="tableData"
      :mostrarBotonDiagnosticaSticker="Number(0)"
      :mostrarBotonActivacionDiagnostica="Number(0)"
      :mostrarDiagnosticaActivacion="Number(0)"
      />
      <!-- <div class="flex justify-center mt-2 flex-wrap">
        <vs-button class="m-3 rounded-full px-6 py-2 shadow-sm" color="primary"   @click="tipoBodega= 0;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Códigos activación';ejecutarValidacionIndividual();">Códigos activación</vs-button>
        <vs-button class="m-3 rounded-full px-6 py-2 shadow-sm" color="#29BCC6"   @click="tipoBodega= 3;  popupConfirmTipoImportado=false;titleImportacion = 'Importacion Paquetes';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
        <vs-button class="m-3 rounded-full px-6 py-2 shadow-sm" color="#ef8b76"   @click="tipoBodega= 4;  popupConfirmTipoImportado=false;titleImportacion = 'Importacion Combos';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Combos (CMB)</vs-button>
      </div> -->
      <vs-divider></vs-divider>
      <div class="flex justify-center mt-5">
        <!--cerrar-->
        <vs-button @click="popupConfirmTipoImportado = false;f_limpiarClosePopup()"  type="border" color="#F54927" class="rounded-full px-4">❌ Cerrar</vs-button>
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO O PAQUETES-->
    <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
      <div v-if="tipoBodega == 3">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete"/>
      </div>
      <div v-if="tipoBodega == 4">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete" :tipoImortacion="'combo'"/>
      </div>
    </vs-popup>
    <vs-popup :active.sync="popupMostrarCodigosNoEncontrados" title="Códigos no encontrados">
        <TableReutilizableVue
          :title="'Codigos no encontrados'"
          :headers="['codigo']"
          :fieldKeys="['codigo']"
          :tableData="CodigosNoEncontrados"
          :ifexportar="Number(1)"
        />
    </vs-popup>
  </div>
</template>
<script>
import {
    mapState
} from "vuex";
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
import gestionCodigosListaVue from '@/views/codigos/components/utils/gestionCodigosLista'
const TablaErroresPaqueteVue      = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue      = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
const TableRadiosCodigosListaVue  = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue')
const TipoImportacionVue          = () => import("./utils/components/GestionLiquidacion/TipoImportacion.vue")
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const CodigosPrefacturasPreviewVue = () => import("../prefacturas/CodigosPrefacturasPreview.vue");
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosListaVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
    TableRadiosCodigosListaVue,
    TipoImportacionVue,
    TableReutilizableVue,
    CodigosPrefacturasPreviewVue
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
      codigosNoCambiados:[],
      codigoSinDevolucion:[],
      codigoNoExiste:[],
      porcentaje:0,
      usuarioSeleccionado:'',
      razonBusqueda:'',
      valorBusqueda:'cedula',
      estudiantesCursos:[],
      region:'2',
      periodos:[],
      periodo:{
        getPeriodo:''
      },
      datos:{
        usuario:'',
        idusuario:'',
        periodo:'',
      },
      codigosNoExisten:[],
      cantidadNoExisten:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      institucion_id:'',
      cliente:'',
      observacion:'',
      counterDanger: false,
      arregloPeriodos:[],
      periodo:'',
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      //variables paquetes
      popupConfirmTipoImportado:false,
      arregloFormatoSend:[],
      arregloProblemasPaquete:[],
      arregloResumen:[],
      arregloErroresPaquetes:[],
      tipoBodega:0,
      titleImportacion:'',
      popupProblemasDiagnostico:false,
      //fin variables paquetes
      activarRegalado:0,
      activarBloqueado:0,
      activarRegaladoyBloqueado:0,
      Removeplus:0,
      dLiquidado:0,
      CodigosNoEncontrados:[],
      arrayCodigosEncontrados:[],
      popupMostrarCodigosNoEncontrados:false,
    }
  },
  created(){
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.codigosPerdidos = false
  },
  computed: {
      ...mapState(['userRoot']),
  },
  methods: {
    changeTipo(e,sendData){
      console.log("sendData",sendData)
      let me = this;
      me.tipoBodega               = e.sendtipoBodega
      me.titleImportacion         = e.sendtitleImportacion
      me.CodigosNoEncontrados     = sendData.CodigosNoEncontrados
      // Normalizar elementos: asegurar que cada item es un objeto con la propiedad 'codigo'
      me.CodigosNoEncontrados = Array.isArray(me.CodigosNoEncontrados) ? me.CodigosNoEncontrados.map(function(codigoObj) {
        if (codigoObj && typeof codigoObj === 'object') {
          if (!codigoObj.hasOwnProperty('codigo')) {
            return Object.assign({}, codigoObj, { codigo: '' });
          }
          return codigoObj;
        } else {
          // si es un string u otro tipo primitivo, lo convertimos a objeto { codigo: '<valor>' }
          return { codigo: String(codigoObj) };
        }
      }) : [];

      me.arrayCodigosEncontrados  = sendData.arrayCodigosEncontrados
      me.ejecutarValidacion();
      me.popupConfirmTipoImportado = false;
      if(me.CodigosNoEncontrados.length > 0){
        me.popupMostrarCodigosNoEncontrados = true;
      }
    },
    limpiarData(){
      let me = this
      me.tableData = []
      me.codigosPerdidos = false
    },
    ejecutarValidacionIndividual(){
      let me = this;

      // Iteramos a través de todos los registros de tableData
      for (let i = 0; i < me.tableData.length; i++) {
        let codigo = me.tableData[i].codigo;

        // Validación para "paq-" o "PAQ-"
        if(codigo.startsWith('paq-') || codigo.startsWith('PAQ-')){
          me.$vs.notify({
            text: 'El archivo contiene paquetes, por favor suba el archivo en el modulo de paquetes.',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 6000
          });
          me.limpiarData();
          me.popupConfirmTipoImportado = false;
          return;
        }

        // Validación para "cmb-" o "CMB-"
        if(codigo.startsWith('cmb-') || codigo.startsWith('CMB-')){
          me.$vs.notify({
            text: 'El archivo contiene combos, por favor suba el archivo en el modulo de combos.',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 6000
          });
          me.limpiarData();
          me.popupConfirmTipoImportado = false;
          return;
        }
      }

      // Si todos los registros son válidos, se puede continuar
    },
    ejecutarValidacion(){
      let me = this;
      if(me.tipoBodega == 3) { me.validateCodigosPaquete() }
      if(me.tipoBodega == 4) { me.validateCodigosCombo() }
    },
    //==================================METODOS PAQUETES===================
    validateCodigosPaquete(){
      let me                                = this;
      try{
        me.arregloFormatoSend               = []
        const problema                      = "Problema con el paquete"
        me.arregloProblemasPaquete          = []
        let datos                           = JSON.parse(JSON.stringify(me.tableData));
        //validar si son más de 200 paquetes
        if(datos.length > 200){
          me.$vs.notify({
          text:'No puedes subir más de 200 paquetes',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        datos.forEach(element => {
          let ifErrsPaquete                 = false
          let codigoPaquete                 = element.codigo
          //validar que el codigo sea string
          if (typeof codigoPaquete !== 'string' )   { ifErrsPaquete        = true }
          else{
            const paqueteMinuscula = codigoPaquete.toLowerCase();
            if(!paqueteMinuscula.startsWith("paq-")) { ifErrsPaquete        = true }
          }
          //si existe un errores
          if(ifErrsPaquete){
            var cal               = new Object
            cal.codigoPaquete     =  codigoPaquete
            cal.problema          =  problema
            cal.codigosHijos      =  []
            me.arregloProblemasPaquete.push(cal)
          }else{
            me.arregloFormatoSend.push({codigoPaquete:codigoPaquete})
          }
        });
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasPaquete.length > 0){ me.popupProblemasDiagnostico = true }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    validateCodigosCombo(){
      let me                                = this;
      try{
        me.arregloFormatoSend               = []
        const problema                      = "Problema con el combo"
        me.arregloProblemasPaquete          = []
        let datos                           = JSON.parse(JSON.stringify(me.tableData));
        //validar si son más de 200 combos
        if(datos.length > 200){
          me.$vs.notify({
          text:'No puedes subir más de 200 combos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        datos.forEach(element => {
          let ifErrsPaquete                 = false
          let codigoPaquete                 = element.codigo
          //validar que el codigo sea string
          if (typeof codigoPaquete !== 'string' )   { ifErrsPaquete        = true }
          else{
            const paqueteMinuscula = codigoPaquete.toLowerCase();
            if(!paqueteMinuscula.startsWith("cmb-")) { ifErrsPaquete        = true }
          }
          //si existe un errores
          if(ifErrsPaquete){
            var cal               = new Object
            cal.codigoPaquete     =  codigoPaquete
            cal.problema          =  problema
            cal.codigosHijos      =  []
            me.arregloProblemasPaquete.push(cal)
          }else{
            me.arregloFormatoSend.push({codigoPaquete:codigoPaquete})
          }
        });
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasPaquete.length > 0){ me.popupProblemasDiagnostico = true }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    //===================================FIN METODOS PAQUETES===============
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos            = false;
      this.header                     = header
      this.tableData                  = results
      this.sheetName                  = meta.sheetName
      this.popupConfirmTipoImportado  = true;
      this.arregloFormatoSend         = []
      this.arregloProblemasPaquete    = []
      this.arregloResumen             = []
      this.arregloErroresPaquetes     = []
      this.codigoNoExiste             = []
      this.CodigosNoEncontrados       = []
      this.arrayCodigosEncontrados    = []
    },
    procesarPagos(){
      let me = this
      if(me.observacion.trim() == ""){
          me.$vs.notify({
          text:'Debe ingresar el motivo de la activacion de los codigos que han sido devueltos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
      }
      //si escogio tipo de paquete
      if(me.tipoBodega == 3 || me.tipoBodega == 4){
        if(me.arregloProblemasPaquete.length > 0){
          me.$vs.notify({
          text:'Existe codigos del'+ me.tipoBodega == '3' ? 'paquete' : 'combo' + ' con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
        if(me.arregloFormatoSend.length > 200){
          me.$vs.notify({
          text:'No puedes subir más de 200 '+ me.tipoBodega == '3' ? 'paquetes' : 'combos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(me.arregloFormatoSend.length == 0){
          me.$vs.notify({
          text:'Hubo problemas para subir los '+ me.tipoBodega == '3' ? 'paquetes' : 'combos',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      var json_pagos = ""
      if(me.tipoBodega == 3 || me.tipoBodega == 4) { json_pagos = JSON.stringify(me.arregloFormatoSend) }
      else                    {
        //arrayCodigosEncontrados solo extraer el codigo
        json_pagos = me.arrayCodigosEncontrados.map(item => ({
          codigo: item.codigo
        }));

        json_pagos = JSON.stringify(json_pagos);
       }
      let formData = new FormData();
      formData.append('data_codigos', json_pagos);
      formData.append('id_usuario',   me.usuario.idusuario);
      formData.append('usuario_editor', me.usuario.idusuario);
      formData.append('periodo_id',   localStorage.periodo_id);
      formData.append('observacion', 'Se_activo_'+me.observacion);
      formData.append('tipoBodega', me.tipoBodega)
      formData.append('activarRegalado', me.activarRegalado ? 1 : 0)
      formData.append('activarBloqueado', me.activarBloqueado ? 1 : 0)
      formData.append('activarRegaladoyBloqueado', me.activarRegaladoyBloqueado ? 1 : 0)
      formData.append('Removeplus', me.Removeplus ? 1 : 0)
      formData.append('dLiquidado', me.dLiquidado ? 1 : 0)
      //tipo paquete
      var url = ""
      if(me.tipoBodega == '3' || me.tipoBodega == '4'){
        url = this.$server_url+'paquetes/activar_devolucion_paquete'
      }else{
        url = this.$server_url+'codigos/devolucion/activar'
      }
      me.$vs.loading()
      this.$http.post(url,formData)
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
        me.modalConfirm       = false
        me.tableData          = []
        me.codigosPerdidos    = true
        //paquetes
        if( this.tipoBodega == 3 || this.tipoBodega == 4){
          me.arregloResumen               = res.data.arregloResumen
          me.codigoSinDevolucion          = res.data.codigoConProblemas
          me.arregloErroresPaquetes       = res.data.arregloErroresPaquetes
        }else{
          me.codigoSinDevolucion          = res.data.codigoSinDevolucion
          me.codigosNoCambiados           = res.data.codigosNoCambiados
          me.codigoNoExiste               = res.data.codigoNoExiste
          me.porcentaje                   = res.data.cambiados
          me.codigosSinCodigoUnion        = res.data.codigosSinCodigoUnion
          if(me.codigosSinCodigoUnion.length > 0){
            me.popupProblemasCodigosUnion = true
          }
        }
      })
      .catch(function (error) {
        me.$vs.notify({
        text:'Verifique que la información se haya guardado correctamente.',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-alert-triangle'})
        me.$vs.loading.close()
      })
    },
    openConfirm(tipo) {
      let me = this
      me.tipo_selected = tipo
      if( !me.tableData[0].codigo){
          me.$vs.loading.close()
          me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
      }
      if(me.arregloProblemasPaquete.length > 0){
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
    f_limpiarClosePopup(){
      let me = this
      me.tableData                  = []
      me.header                     = []
      me.sheetName                  = ''
      me.arregloFormatoSend         = []
      me.arregloProblemasPaquete    = []
      me.arregloResumen             = []
      me.arregloErroresPaquetes     = []
      me.arrayCodigosEncontrados    = []
      me.CodigosNoEncontrados       = []
      me.tipoBodega                 = 0
    },
    recargar(){
      location.reload()
    },
  }
}
</script>

<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #E6EEF8;
}
.th1{
  background-color: #2468D0;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 13px;
}
.td1, .th1{
  padding: 12px 10px;
  text-align: center;
  border:none;
}
</style>
