<template>
  <div>
    <div class="mt-3" v-if="groupBodega">
      <!-- <div class="text-center mb-3">
        <span class="badge-title">Import Gestión Paquetes</span>
      </div> -->
      <!--TIPOS BODEGA-->
      <div class="flex justify-center mt-2">
        <div class="mt-2">
          <ul class="flex">
            <li class="modelx mr-2">
              Seleccione:
            </li>
            <li>
              <vs-radio v-model="TipoImportacion" class="mr-3" vs-name="radios1TipoImportacion" vs-value="5">Regalado</vs-radio>
            </li>
             <li>
              <vs-radio v-model="TipoImportacion" class="mr-3" vs-name="radios1TipoImportacion" vs-value="6">Regalado y bloqueado</vs-radio>
            </li>
            <!--
            <li>
              <vs-radio v-model="TipoImportacion" class="mr-3" vs-name="radios1TipoImportacion" vs-value="7">Bloqueado</vs-radio>
            </li>-->
            <li> 
              <vs-radio v-model="TipoImportacion" vs-name="radios1TipoImportacion" @input="tipoVenta=0;nombreInstitucion='';" vs-value="8">Guia</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <!---->
      <!--ALERT PARA REGALADO-->
      <div v-if="TipoImportacion == 5" class="mt-3 alert-responsive">
        <vs-alert color="primary" icon-pack="feather" icon="icon-info">
          <span class="alert-text">Esta sección es para regalar códigos sin elegir documentos de venta</span>
        </vs-alert>
      </div>
       <!--ALERT PARA REGALADO Y BLOQUEADO-->
      <div v-if="TipoImportacion == 6" class="mt-3 alert-responsive">
        <vs-alert color="primary" icon-pack="feather" icon="icon-info">
          <span class="alert-text">Esta sección es para regalar códigos y bloquear sin elegir documentos de venta</span>
        </vs-alert>
      </div>
      <!---->
      <!--Institucion y Tipo de Venta-->
      <div v-if="TipoImportacion!=8" class="mt-5">
        <vx-card class="institucion-venta-card">
          <div class="institucion-venta-grid">
            <!-- Institución -->
            <div class="institucion-section">
              <TableSelectInstitucion @changeHandle="changeHandle" />
            </div>
            
            <!-- Tipo de Venta -->
            <div class="tipo-venta-section">
              <div class="tipo-venta-container">
                <p class="tipo-venta-label">Tipo de venta:</p>
                <div class="tipo-venta-radio-wrapper">
                  <vs-radio v-model="tipoVenta" vs-name="radiosTipoVenta" :vs-value="1" class="mr-3">
                    <span class="radio-label">
                      <i class="fa fa-check-circle"></i>
                      Venta directa
                    </span>
                  </vs-radio>
                  <vs-radio v-model="tipoVenta" vs-name="radiosTipoVenta" :vs-value="2">
                    <span class="radio-label">
                      <i class="fa fa-list"></i>
                      Venta lista
                    </span>
                  </vs-radio>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
      <!--SI ES GUIA GUARDAR PERIODO Y ASESOR-->
      <div v-if="TipoImportacion == 8" class="vx-row mt-5">
        <div class="vx-col w-1/2">
          <p>Seleccione el período <span class="text-danger">(Obligatorio)</span></p>
          <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos" label="periodoescolar" class="w-full mt-2" v-model="periodoSelect" />
        </div>
        <div class="vx-col w-1/2">
          <p>Seleccione el asesor que va recibir las guias <span class="text-danger">(Obligatorio)</span></p>
          <v-select :options="arrayAsesores" :reduce="arrayAsesores => arrayAsesores.idusuario" label="usuario" class="w-full mt-2" v-model="asesorSelect" />
        </div>
      </div>
      <br><br><br>
      <div class="vx-row" style="margin-top:-40px;">
        <div class="vx-col w-full">
          <vs-input icon="icon-message-square" class="w-full" icon-pack="feather" placeholder="Comentario" v-model="observacion"/>
        </div>
      </div>
      <!--PREFACTURAS-->
      <!-- <vx-card title="Pre facturas" v-if="institucion_id > 0 && TipoImportacion != 8" class="mt-2">
        <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
            <small>Empresa:</small>
            <v-select :options="arrayEmpresas" @input="f_listadoProformasAgrupadas();" :reduce="arrayEmpresas => arrayEmpresas.id" label="nombre" class="w-full" v-model="proforma.empresa" />
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
            <small>Pre facturas :</small>
            <v-select :options="arrayProformas" :reduce="arrayProformas => arrayProformas.ven_codigo" label="ven_codigo" class="w-full" v-model="proforma.proforma" @input="f_setTipoVentaFromDocumento()" />
          </div>
        </div>
      </vx-card> -->
      <vs-divider></vs-divider>
      <div class="mb-6 mt-4" align="center">
        <div class="vx-col w-full">
          <p style="color:#2D9ADA;" v-if="tableData.length == 0">
            <i class="fa fa-file" aria-hidden="true"></i>Importacion de códigos <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
          </p>
        </div>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 && TipoImportacion != 5 && TipoImportacion != 6 && TipoImportacion != 8" class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="danger"  type="relief" @click="openConfirm(0)">Importar códigos </vs-button>
          </vs-col>
        </vs-row>
        <!---CONTADOR DE CODIGOS INGRESADOS-->
        <vs-row v-if="codigosPerdidos == true" class="mt-5">
          <!-- Resumen simplificado -->
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <div class="stat-card-resumen">
              <div class="stat-icon-resumen" style="background: #28c76f;">
                <i class="fa-solid fa-check-circle"></i>
              </div>
              <div class="stat-content-resumen">
                <p class="stat-label-resumen">Códigos de activacion procesados exitosamente</p>
                <h3 class="stat-value-resumen">{{ porcentaje }}</h3>
              </div>
            </div>
          </vs-col>
        </vs-row>

        <!-- Tabla de códigos con problemas -->
        <vs-row v-if="codigosPerdidos == true && codigosNoCambiados.length > 0" class="mt-5">
          <vs-col vs-w="12">
            <TableReutilizableVue 
              :title="'Códigos que no se pudieron cambiar'" 
              :headers="['Código','Mensaje','Código Paquete']" 
              :fieldKeys="['codigo','mensaje','codigo_paquete']" 
              :ifexportar="Number(1)"
              :nombrearchivo="'Codigos_Con_Problemas'"
              :tableData="codigosNoCambiados" 
            />
          </vs-col>
        </vs-row>
         <!---FIN CONTADOR DE CODIGOS INGRESADOS-->
        <br/>
        <!--MENU 0: SUBIR ARCHIVO-->
        <div v-if="menu == 0">
          <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
        </div>
        <!--MENU 1: PREVIEW CODIGOS REGALADOS-->
        <div v-if="menu == 1 && (TipoImportacion == 5 || TipoImportacion == 6)" class="mt-5">
          <p v-if="titleImportacion"><b>Tipo de Importacion: {{ titleImportacion }}</b></p>
          <!--Título tipo de importación-->
          <!-- <div class="text-start mb-3">
            <span class="badge-importacion">{{ titleImportacion }}</span>
          </div> -->
          <!--boton subir otro archivo-->
          <div class="flex justify-start">
            <vs-button @click="menu = 0;tableData=[];codigosPerdidos=false;arrayCodigosEncontrados=[];CodigosNoEncontrados=[];checkMostrarCodigosNoEncontrados=false;" color="warning" type="border" class="mb-4">
              <i class="fa-solid fa-right-left"></i> Subir otro archivo
            </vs-button>
          </div>
          <!--TABLA DE PREVIEW-->
          <CodigosPrefacturasPreviewVue :arrayCodigosEncontrados="arrayCodigosEncontrados" @openConfirm="openConfirmRegalado"/>
        </div>
        <!--MENU 1: PREVIEW CODIGOS GUIAS-->
        <div v-if="menu == 1 && TipoImportacion == 8" class="mt-5">
          <!--Título tipo de importación-->
          <!-- <div class="text-center mb-3">
            <span class="badge-importacion">{{ titleImportacion }}</span>
          </div> -->
          <p v-if="titleImportacion"><b>Tipo de Importacion: {{ titleImportacion }}</b></p>
          <!--boton subir otro archivo-->
          <div class="flex justify-start">
            <vs-button @click="menu = 0;tableData=[];codigosPerdidos=false;arrayCodigosEncontrados=[];CodigosNoEncontrados=[];checkMostrarCodigosNoEncontrados=false;" color="warning" type="border" class="mb-4">
              <i class="fa-solid fa-right-left"></i> Subir otro archivo
            </vs-button>
          </div>
          <!--TABLA DE PREVIEW-->
          <CodigosPrefacturasPreviewVue :arrayCodigosEncontrados="arrayCodigosEncontrados" @openConfirm="openConfirmRegalado"/>
        </div>
        <!--FORMATO-->
        <!--FORMATO-->
      </div>
      <vx-card v-if="tableData.length && header.length && menu == 0">
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
    </div>
    <!--MODALES-->
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
    <!--MODAL PARA CONFIRMAR-->
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div v-if="modalConfirm" class="modal-confirm-content">
        <!-- Título -->
        <div class="modal-header-section">
          <p class="text-2xl font-bold text-center mb-2">{{ titleImportacion }}</p>
          <vs-divider></vs-divider>
        </div>

        <!-- Acción -->
        <div class="modal-info-card accion-card">
          <div class="info-label">Acción:</div>
          <div class="info-value">
            <span v-if="TipoImportacion == '5'">Regalado</span>
            <span v-if="TipoImportacion == '6'">Regalados y bloqueados</span>
            <span v-if="TipoImportacion == '7'">Bloqueados</span>
            <span v-if="TipoImportacion == '8'">GUIA</span>
          </div>
        </div>

        <!-- Información General -->
        <div class="modal-info-card">
          <div class="info-row">
            <span class="info-label">Total de códigos:</span>
            <span class="info-value text-success font-bold">{{ arraySendCodigos.length }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Periodo:</span>
            <span class="info-value text-danger font-bold" v-if="TipoImportacion == 8">{{ periodoSelect.periodoescolar }}</span>
            <span class="info-value text-danger font-bold" v-else>{{ periodoDescripcion }}</span>
          </div>
          
          <!-- Tipo de venta para REGALADOS -->
          <div class="info-row" v-if="TipoImportacion == 5 || TipoImportacion == 6">
            <span class="info-label">Tipo de venta:</span>
            <span class="info-value font-bold">
              <span class="badge-venta success" v-if="tipoVenta == 1">
                <i class="fa fa-check-circle"></i> Venta directa
              </span>
              <span class="badge-venta primary" v-else-if="tipoVenta == 2">
                <i class="fa fa-list"></i> Venta lista
              </span>
            </span>
          </div>

          <!-- Institución para REGALADOS -->
          <div class="info-row" v-if="(TipoImportacion == 5 || TipoImportacion == 6) && nombreInstitucion">
            <span class="info-label">Institución:</span>
            <span class="info-value text-primary font-bold">{{ nombreInstitucion }}</span>
          </div>

          <!-- Asesor para GUIAS -->
          <div class="info-row" v-if="TipoImportacion == 8 && asesorSelect">
            <span class="info-label">Asesor:</span>
            <span class="info-value text-primary font-bold">{{ getAsesorNombre() }}</span>
          </div>

          <!-- Comentario -->
          <div class="info-row">
            <span class="info-label">Comentario:</span>
            <span class="info-value text-gray-700">{{ observacion }}</span>
          </div>
        </div>

        <!--si sube un documento proforma-->
        <div v-if="proforma.proforma" class="modal-info-card documento-card">
          <div class="card-title">
            <i class="fa fa-file-text-o mr-2"></i>Información del Documento
          </div>
          <div class="info-row">
            <span class="info-label">Documento:</span>
            <span class="info-value text-danger font-bold">{{ proforma.proforma }}</span>
          </div>
          <div class="info-row" v-if="arrayEmpresas.find(p => p.id == proforma.empresa)">
            <span class="info-label">Empresa:</span>
            <span class="info-value text-danger font-bold">{{ arrayEmpresas.find(p => p.id == proforma.empresa).descripcion_corta }}</span>
          </div>
        </div>

        <!-- Botón confirmar -->
        <div class="w-full mt-4" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" size="large" @click="procesarPagos()">
            <i class="fa fa-check mr-2"></i> Confirmar
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO O PAQUETES-->
    <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
      <div v-if="tipoBodega == 1 || tipoBodega == 2">
        <TableProblemasDiagnosticoVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasDiagnostico="arregloProblemasDiagnostico"/>
      </div>
      <div v-if="tipoBodega == 3">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete"/>
      </div>
    </vs-popup>
    <vs-popup small title="Codigos diágnostico no existen" :active.sync="popupCodigosDiagnosticoNoexisten">
      <TableProblemasDiagnosticoVue v-if="popupCodigosDiagnosticoNoexisten" :items="5" :arregloProblemasDiagnostico="arregloCodigosDiagnosticoNoexisten"/>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado">
      <TipoImportacionVue v-if="popupConfirmTipoImportado" @changeTipo="changeTipo" :noCombos="Number(1)"/>
    </vs-popup>
      <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
      <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosLista :arregloCodigos="codigosSinCodigoUnion" :openModal="Number(0)"/>
    </vs-popup>
  </div>
</template>
<script>
  import {
    mapState
} from "vuex";
import ImportExcel from '@/views/codigos/components/importExcel'
import vSelect from 'vue-select'
import PeriodoRepository from "../../../../repositories/PeriodoRepository";
import PedidosRepository from "../../../../repositories/PedidosRepository";
import UserRepository from "../../../../repositories/UserRepository";
const TableRadiosCodigosListaVue    = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableRadiosCodigosLista')
const gestionCodigosLista           = () => import('@/views/codigos/components/utils/gestionCodigosLista')
const TableProblemasDiagnosticoVue  = () => import('@/views/codigos/components/utils/TableProblemasDiagnostico')
const TipoImportacionVue            = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TipoImportacion')
const TablaErroresPaqueteVue        = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue        = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
const TableSelectInstitucion        = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableSelectInstitucion.vue');
const CodigosPrefacturasPreviewVue  = () => import('@/views/codigos/prefacturas/CodigosPrefacturasPreview.vue');
const TableReutilizableVue          = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue');
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    TableProblemasDiagnosticoVue,
    TipoImportacionVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
    TableSelectInstitucion,
    TableRadiosCodigosListaVue,
    CodigosPrefacturasPreviewVue,
    TableReutilizableVue,
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
      cedulas_no_encontradas: [],
      codigosNoExisten:[],
      codigosNoCambiados:[],
      arregloCodigosDiagnosticoNoexisten:[],
      popupCodigosDiagnosticoNoexisten:false,
      porcentaje:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      institucion_id:0,
      periodo_id:0,
      codigosNoExisten:[],
      cantidadNoExisten:0,
      error:false,
      periodoDescripcion:'',
      ciudadDescripcion:'',
      factura:'',
      checkFactura:true,
      //0 => regalado ; 1 => regalado y bloqueado ; 2 => bloqueado ; 3 => Bloqueado ; 4 => guia => 5 => regalado sin institucion; 6 => regalado y bloqueado sin institucion
      TipoImportacion:5,
      //VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      tipoBodega:0,
      arregloProblemasDiagnostico:[],
      popupProblemasDiagnostico:false,
      popupConfirmTipoImportado:false,
      contadorA:0,
      contadorD:0,
      titleImportacion:'Importacion Sticker (Activación)',
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      totalCodigos:0,
      //variables paquete
      cantidadPaquete:20,
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //VARIABLES PARA ERRORES CODIGOS PAQUETES
      arregloProblemasPaquete:[],
      arregloFormatoSend:[],
      arrayPaquetes:[],
      totalCodigos:0,
      arregloErroresPaquetes:[],
      codigoConProblemas:[],
      //FIN VARIABLES PARA ERRORES CODIGOS PAQUETES
      //fin variables paquetes
      observacion:'',
      //variables para opcionales de importacion
      switch2:false,
      //fin variables para opcionales de importacion
      //variables para guias
      arrayPeriodos:[],
      arrayAsesores:[],
      periodoSelect:'',
      asesorSelect:'',
      tipoVenta:1,
      id_institucionPedido: null,
      //fin variables para guias
      //variables para preview
      menu:0,
      arrayCodigosEncontrados:[],
      arraySendCodigos:[],
      //fin variables para preview
   //variables para pre facturas
   arrayEmpresas:[],
      proforma:{
        empresa:'',
        proforma:''
      },
      arrayProformas:[],
      //fin variables para pre facturas
      }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos = false
  },
  mounted(){
    let me = this
    me.obtenerPeriodos()
    me.getAsesores()
    me.getEmpresas()
  },
  watch:{
    TipoImportacion(newVal, oldVal){
      let me = this;
      // Solo limpiar si realmente cambió y ya había procesado códigos
      if(newVal !== oldVal && me.codigosPerdidos){
        me.codigosPerdidos = false;
        me.porcentaje = 0;
        me.codigosNoCambiados = [];
        me.codigoConProblemas = [];
        me.contadorA = 0;
        me.contadorD = 0;
        me.arrayCodigosEncontrados = [];
        me.arraySendCodigos = [];
        me.CodigosNoEncontrados = [];
        me.$vs.notify({
          text: 'Resultados anteriores limpiados',
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-info'
        });
      }
    },
    factura(results){
      if(results !=""){
        this.factura = results.replace(/\s/g, "");
      }
    },
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','groupBodega']),
    sumaNoIngresados(){
      let me = this;
      if(me.codigosPerdidos){
        let total      = me.totalCodigos - (me.contadorA + me.contadorD)
        return total
      }
    },
  },
  methods: {
    getAsesorNombre(){
      let me = this;
      if(!me.asesorSelect || !me.arrayAsesores || me.arrayAsesores.length == 0){
        return 'N/A';
      }
      let asesor = me.arrayAsesores.find(p => p.idusuario == me.asesorSelect);
      return asesor ? asesor.usuario : 'N/A';
    },
    obtenerPeriodos() {
      let me = this;
      return PeriodoRepository.getPeriodos().then(p => {
        me.arrayPeriodos = p.data;
      });
    },
    getAsesores(){
      let me = this
      return UserRepository.getUsuariosXRolx(11).then(r => { me.arrayAsesores = r.data.filter(p => p.estado_idEstado == 1).sort((a, b) => a.usuario.localeCompare(b.usuario)) })
    },
    getEmpresas(){
      let me = this;
      let url = this.$server_url + 'empresa2';
      this.$http.get(url).then(function (response) {
        me.arrayEmpresas = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    changeHandle(tr){
      let me = this;
      //si hay institucion seleccionada asignar valores
      if(tr.idInstitucion){
        me.nombreInstitucion     = tr.nombreInstitucion
        me.institucion_id        = tr.idInstitucion
        if(tr.EstadoConfiguracion == 1){
        me.periodo_id            = tr.periodo_configurado
        me.periodoDescripcion    = tr.periodoNombreConfigurado
        }else{
        me.periodo_id            = tr.periodo_id
        me.periodoDescripcion    = tr.periodo
        }
        me.ciudadDescripcion     = tr.ciudad
        //limpiar la proforma
        me.proforma.empresa = ""
        me.proforma.proforma = ""
        //limpiar tipo de venta y id_institucionPedido
        me.tipoVenta = 1
        me.id_institucionPedido = null
        me.codigosPerdidos = false
      }
      //limpiar
      else{
        me.nombreInstitucion     = ''
        me.institucion_id        = 0
        me.periodo_id            = 0
        me.periodoDescripcion    = ''
        me.ciudadDescripcion     = ''
        me.tipoVenta             = 1
        me.id_institucionPedido  = null
        me.codigosPerdidos       = false
      }
    },

    changeTipo(e){
      let me = this
      me.tipoBodega                 = e.sendtipoBodega
      me.titleImportacion           = e.sendtitleImportacion
      me.cantidadPaquete            = e.sendcantidadPaquete
      me.popupConfirmTipoImportado  = false;
      
      // Para Regalado (TipoImportacion == 5) y Guías (TipoImportacion == 8), hacer previsualización
      if(me.TipoImportacion == 5 || me.TipoImportacion == 6 || me.TipoImportacion == 8){
        me.buscarCodigosParaRegalado()
      }
      // Para otros tipos, ejecutar validación directa
      else {
        me.ejecutarValidacion()
      }
    },
    ejecutarValidacion(){
      let me = this;
      if(me.tipoBodega == 1 || me.tipoBodega == 2) { me.validateCodigos() }
      if(me.tipoBodega == 3) { me.validateCodigosPaquete() }
    },
    buscarCodigosParaRegalado(){
      let me = this;
      try{
        // Validar formato del excel
        if(!me.tableData[0] || !me.tableData[0].codigo){
          me.$vs.notify({ 
            text:'Corrija el formato del excel y vuelva a intentar.', 
            color:'warning', 
            iconPack: 'feather', 
            icon:'icon-alert-triangle'
          })
          return
        }

        // Convertir códigos a mayúsculas
        me.tableData.forEach(codigo => {
          codigo.codigo = codigo.codigo.trim().toUpperCase()
        });

        // Validar según tipo de bodega
        if(me.tipoBodega == 1 || me.tipoBodega == 2){
          me.validateCodigos()
          if(me.arregloProblemasDiagnostico.length > 0){
            return
          }
        }
        if(me.tipoBodega == 3){
          me.validateCodigosPaquete()
          if(me.arregloProblemasPaquete.length > 0){
            return
          }
        }

        // Preparar datos para enviar
        let json_pagos = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_codigos', json_pagos);
        formData.append('mostrarSoloCodigos', 1)
        
        // Según el tipo de bodega
        if(me.tipoBodega == 3){
          formData.append('getPrevisualizarPaquetes', '1')
        } else {
          formData.append('getPrevisualizarCodigos', '1')
        }

        me.$vs.loading()
        me.$http.post(me.$server_url+'metodosPostCodigos', formData)
        .then(res => {
          me.$vs.loading.close()
          
          if(res.data.status == 0){
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }

          // Códigos no encontrados
          if(res.data.no_encontrados && res.data.no_encontrados.length > 0){
            me.checkMostrarCodigosNoEncontrados = true
            me.CodigosNoEncontrados = res.data.no_encontrados.map(codigo => ({ codigo: codigo }))
          }

          // Códigos encontrados
          if(res.data.encontrados && res.data.encontrados.length > 0){
            me.arrayCodigosEncontrados = res.data.encontrados
            me.menu = 1 // Cambiar a vista de preview
          } else {
            me.$vs.notify({ 
              text:'No se encontraron códigos', 
              color:'warning', 
              iconPack: 'feather', 
              icon:'icon-alert-triangle'
            })
          }
        })
        .catch(error => {
          console.log(error)
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Ocurrió un error al buscar los códigos',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
      }
      catch (err) {
        console.log("err", err)
        me.$vs.notify({
          text: 'Hubo problemas con tu archivo excel',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
      }
    },
    validateCodigos(){
      let me                            = this;
      try{
        let datos                       = []
        me.arregloProblemasDiagnostico  = []
        datos                           = me.tableData
        var preValores                  = []
        //quitar types NumRow
        datos.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo.trim().toUpperCase()
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
    validateCodigosPaquete(){
      let me                                = this;
      try{
        me.arregloFormatoSend               = []
        const problema                      = "Problema con el paquete"
        me.arregloProblemasPaquete          = []
        let preValores                      = []
        preValores                          = JSON.parse(JSON.stringify(me.tableData));
        let datos                           = []
        preValores.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo.trim().toUpperCase()
          datos.push(obj)
        });
        //validar si son mas de 200 paquetes
        if(datos.length > 200){
          me.$vs.notify({
          text:'No puedes subir mas de 200 paquetes',
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
    //===================================FIN METODOS PAQUETES===============
    loadDataInTable ({ results, header, meta }) {
      let me = this;
      this.totalCodigos                       = 0
      this.arregloProblemasDiagnostico        = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.codigosNoExisten                   = []
      this.arregloErroresPaquetes             = []
      this.header                             = header
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
      this.tableData                          = newArrayOfObj
      me.totalCodigos                         = newArrayOfObj.length
      me.codigosPerdidos                      = false
      this.codigosNoCambiados                 = []
      this.sheetName = meta.sheetName
      this.popupConfirmTipoImportado          = true;
      this.arregloProblemasPaquete            = []
      this.arregloResumen                     = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.arregloFormatoSend                 = []
      this.arrayCodigosEncontrados            = []
      this.CodigosNoEncontrados               = []
    },
    procesarPagos(){
      let me = this
      
      // Validaciones para REGALADO (TipoImportacion == 5)
      if(me.TipoImportacion == 5 || me.TipoImportacion == 6 ){
        // Validar que haya códigos seleccionados del preview
        if(!me.arraySendCodigos || me.arraySendCodigos.length == 0){
          me.$vs.notify({
            text:'No hay códigos seleccionados para importar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
        
        // Validar institución
        if(me.institucion_id == 0){
          me.$vs.notify({
            text:'Debe seleccionar una institución por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
        
        // Validar tipo de venta y documento
        // if(me.tipoVenta == 1 && (me.id_institucionPedido == null || me.id_institucionPedido == undefined)){
        //   me.$vs.notify({
        //     text:'El documento seleccionado no es válido para venta directa, no contiene un pedido asociado. Por favor seleccione otro documento',
        //     color:'warning',
        //     iconPack: 'feather',
        //     icon:'icon-check'
        //   })
        //   return false;
        // }
        
        // Validar comentario
        if(me.observacion == ""){
          me.$vs.notify({
            text:'Debe ingresar un comentario por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
      }
      
      // Validaciones para GUIAS (TipoImportacion == 8)
      if(me.TipoImportacion == 8){
        // Validar que haya códigos seleccionados del preview
        if(!me.arraySendCodigos || me.arraySendCodigos.length == 0){
          me.$vs.notify({
            text:'No hay códigos seleccionados para importar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
        
        // Validar periodo
        if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
          me.$vs.notify({
            text:'Debe seleccionar un periodo por favor',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
        
        // Validar asesor
        if(me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined){
          me.$vs.notify({
            text:'Debe seleccionar un asesor por favor',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
        
        // Validar comentario
        if(me.observacion == ""){
          me.$vs.notify({
            text:'Debe ingresar un comentario por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'
          })
          return false;
        }
      }
      
      // Preparar datos para enviar
      let formData = new FormData();
      let mensaje = ""
      let mensajeInstitucion = ""
      let mensajeVenta = ""
      let mensajeDocumento = ""
      
      // Datos comunes
      formData.append('id_usuario', me.usuario.idusuario);
      
      // Datos específicos para REGALADO
      if(me.TipoImportacion == 5 || me.TipoImportacion == 6){
        formData.append('venta_estado', me.tipoVenta);
        formData.append('institucion_id', me.institucion_id);
        formData.append('periodo_id', me.periodo_id);
        
        // Mensajes
        if(me.tipoVenta == 1) { mensajeVenta = "Venta_Directa_" }
        if(me.tipoVenta == 2) { mensajeVenta = "Venta_Lista_" }
        mensajeInstitucion = me.nombreInstitucion + "_" + me.periodoDescripcion + "_";
        mensaje = "Regalado_";
        
        // Extraer solo los códigos del arraySendCodigos
        let codigosParaEnviar = me.arraySendCodigos.map(item => ({ codigo: item.codigo }));
        formData.append('data_codigos', JSON.stringify(codigosParaEnviar));
      }
      
      // Datos específicos para GUIAS
      if(me.TipoImportacion == 8){
        formData.append('periodo_id', me.periodoSelect.idperiodoescolar);
        formData.append('asesor_id', me.asesorSelect);
        mensaje = "Guia_" + me.periodoSelect.periodoescolar + "_";
        
        // Extraer solo los códigos del arraySendCodigos
        let codigosParaEnviar = me.arraySendCodigos.map(item => ({ codigo: item.codigo }));
        formData.append('data_codigos', JSON.stringify(codigosParaEnviar));
      }
      
      // Comentario
      formData.append('comentario', me.observacion + '_' + mensajeVenta + mensajeInstitucion + mensaje + mensajeDocumento);
      formData.append('TipoImportacion',me.TipoImportacion)
      // Seleccionar endpoint según tipo de importación
      let url = '';
      if(me.TipoImportacion == 5 || me.TipoImportacion == 6){
        url = this.$server_url + 'codigos/import/regalados';
      } else if(me.TipoImportacion == 8){
        url = this.$server_url + 'codigos/import/guias';
      }
      
      me.$vs.loading()
      this.$http.post(url, formData)
      .then(res => {
        me.$vs.loading.close()
        
        if(res.data.error){
          me.$vs.notify({
            text: res.data.message || 'Ocurrió un error al procesar los códigos',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'
          })
          return false
        }
        
        // Mostrar resultados
        let cambiados = res.data.cambiados || 0;
        let noCambiados = res.data.codigosNoCambiados || [];
        
        me.$vs.notify({
          text:`Se procesaron ${cambiados} códigos exitosamente`,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'
        })
        
        me.modalConfirm = false
        me.codigosPerdidos = true
        me.porcentaje = cambiados
        me.codigosNoCambiados = noCambiados
        
        // Mostrar códigos con problemas
        if(noCambiados.length > 0){
          me.codigoConProblemas = noCambiados.map(item => ({
            codigo: item.codigo,
            mensaje: item.mensaje,
            codigo_paquete: item.codigo_paquete
          }))
        }
        
        // Limpiar datos
        me.observacion = ""
        me.menu = 0
        me.tableData = []
        me.arrayCodigosEncontrados = []
        me.arraySendCodigos = []
      })
      .catch(function (error) {
        console.log(error)
        me.$vs.notify({
          text:'Verifique que la información se haya guardado correctamente.',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'
        })
        me.$vs.loading.close()
      })
    },
    openConfirm(tipo) {
      let me = this
      if(me.TipoImportacion == 8){
        //validar que el periodoSelect no esta vacia ni nula
        if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
          me.$vs.notify({
          text:'Debe seleccionar un periodo por favor',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //validar que el asesorSelect no vacia ni nula
        if(me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined){
          me.$vs.notify({
          text:'Debe seleccionar un asesor por favor',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
      }

      // Validar documento y empresa (obligatorio excepto para GUIA)
      if(me.TipoImportacion != 8){
        // if(me.proforma.proforma == null || me.proforma.proforma == "" || me.proforma.proforma == undefined){
        //   me.$vs.notify({
        //     text:'Debe seleccionar un documento de venta (obligatorio)',
        //     color:'danger',
        //     iconPack: 'feather',
        //     icon:'icon-alert-triangle'})
        //   return
        // }
        // if(me.proforma.empresa == null || me.proforma.empresa == "" || me.proforma.empresa == undefined){
        //   me.$vs.notify({
        //     text:'Debe seleccionar la empresa (obligatorio)',
        //     color:'danger',
        //     iconPack: 'feather',
        //     icon:'icon-alert-triangle'})
        //   return
        // }
      }

      //volver a revisar que este bien el formato del excel
      me.ejecutarValidacion()
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
    openConfirmRegalado(e) {
      let me = this
      console.log('Datos recibidos del preview:', e)
      me.arraySendCodigos = e.data
      console.log('arraySendCodigos asignado:', me.arraySendCodigos)
      
      if(!me.arraySendCodigos || me.arraySendCodigos.length == 0){
        me.$vs.notify({ 
          text:'No hay códigos para importar', 
          color:'warning', 
          iconPack: 'feather', 
          icon:'icon-alert-triangle'
        })
        return
      }

      // Validar comentario antes de abrir el modal
      if(me.observacion == "" || me.observacion == null || me.observacion == undefined){
        me.$vs.notify({
          text:'Debe ingresar un comentario antes de continuar',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'
        })
        return
      }

      // Validaciones específicas para REGALADO
      if(me.TipoImportacion == 5 || me.TipoImportacion == 6){
        // Validar institución
        if(me.institucion_id == 0){
          me.$vs.notify({
            text:'Debe seleccionar una institución',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'
          })
          return
        }

        // Validar tipo de venta
        if(!me.tipoVenta || (me.tipoVenta != 1 && me.tipoVenta != 2)){
          me.$vs.notify({
            text:'Debe seleccionar un tipo de venta (Directa o Lista)',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'
          })
          return
        }
      }

      // Validaciones específicas para GUIAS
      if(me.TipoImportacion == 8){
        // Validar periodo
        if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
          me.$vs.notify({
            text:'Debe seleccionar un periodo',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'
          })
          return
        }
        
        // Validar asesor
        if(me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined){
          me.$vs.notify({
            text:'Debe seleccionar un asesor',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'
          })
          return
        }
      }
      
      me.modalConfirm = true
    },
     //METODOS PARA PRE FACTURAS
     f_listadoProformasAgrupadas(){
      let me = this;
      me.arrayProformas = []
      me.proforma.proforma = ""
      me.tipoVenta = 1 // Resetear tipo de venta al cambiar empresa
      me.id_institucionPedido = null // Resetear id_institucionPedido al cambiar empresa
      if(me.proforma.empresa == "" || me.proforma.empresa == null || me.proforma.empresa == undefined){
        me.$vs.notify({
        text:'Debe seleccionar una empresa por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      this.$http.get(this.$server_url+`devoluciones?listadoProformasAgrupadas=1&institucion=${me.institucion_id}&periodo_id=${me.periodo_id}`)
      .then(function (res) {
        let datos = res.data
        if(datos.length == 0){
          let empresaEncontrada = me.arrayEmpresas.find(function(p) { return p.id == me.proforma.empresa; });
          let empresaNombre = empresaEncontrada ? empresaEncontrada.descripcion_corta : '';
          me.$vs.notify({
          text:'No hay pre facturas de la institución'+me.nombreInstitucion+ 'de la empresa '+empresaNombre,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //filtrar emp_id con me.proforma.empresa
        me.arrayProformas = datos.filter(p => p.id_empresa == me.proforma.empresa)
        if(me.arrayProformas.length == 0){
          let empresaEncontrada = me.arrayEmpresas.find(function(p) { return p.id == me.proforma.empresa; });
          let empresaNombre = empresaEncontrada ? empresaEncontrada.descripcion_corta : '';
          me.$vs.notify({
          text:'No hay pre facturas de la institución'+me.nombreInstitucion+ 'de la empresa '+empresaNombre,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }else{
          //se encontrato tal resultados
          let empresaEncontrada = me.arrayEmpresas.find(function(p) { return p.id == me.proforma.empresa; });
          let empresaNombre = empresaEncontrada ? empresaEncontrada.descripcion_corta : '';
          me.$vs.notify({
          text:'Se encontraron '+me.arrayProformas.length+' pre facturas de la institución '+me.nombreInstitucion+ ' de la empresa '+empresaNombre,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_setTipoVentaFromDocumento(){
      let me = this;
      // Si se quita el documento, resetear el tipo de venta y id_institucionPedido
      if(!me.proforma.proforma || me.proforma.proforma == "" || me.proforma.proforma == null){
        me.tipoVenta = 1;
        me.id_institucionPedido = null;
        return;
      }
      // Buscar el documento seleccionado en arrayProformas
      const documentoSeleccionado = me.arrayProformas.find(p => p.ven_codigo == me.proforma.proforma);
      if(documentoSeleccionado && documentoSeleccionado.tip_ven_codigo){
        // Asignar el tipo de venta desde el documento
        me.tipoVenta = documentoSeleccionado.tip_ven_codigo;
        // Asignar el id_institucionPedido desde el documento
        me.id_institucionPedido = documentoSeleccionado.id_institucionPedido || null;
        // Mostrar notificación informativa
        const tipoVentaTexto = documentoSeleccionado.tip_ven_codigo == 1 ? 'Venta directa' : 'Venta lista';
        me.$vs.notify({
          text: `Tipo de venta asignado automáticamente: ${tipoVentaTexto}`,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        });
      } else {
        me.tipoVenta = 1;
        me.id_institucionPedido = null;
      }
    },
    //FIN METODOS PARA PRE FACTURAS
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
  background-color: #D9AF15;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
/*CSS IMPORTADOR TIPO BODEGA*/

.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}

/* Estilos para el badge de tipo de venta */
.tipo-venta-badge {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tipo-venta-badge i {
  font-size: 16px;
}

.tipo-venta-badge.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
}

.tipo-venta-badge.primary {
  background-color: #e3f2fd;
  color: #1565c0;
  border-left: 4px solid #2196f3;
}

.tipo-venta-badge.warning {
  background-color: #fff3e0;
  color: #e65100;
  border-left: 4px solid #ff9800;
}

.tipo-venta-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Estilos para el contenedor de institución y tipo de venta */
.institucion-venta-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  overflow: hidden;
}

.institucion-venta-card >>> * {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Grid layout para PC: 50% cada uno */
.institucion-venta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.institucion-section {
  width: 100%;
}

.tipo-venta-section {
  width: 100%;
}

/* Estilos responsive para el alert */
.alert-responsive {
  max-width: 100%;
  overflow: hidden;
}

.alert-responsive >>> .vs-alert {
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.alert-text {
  font-size: 13px;
  line-height: 1.5;
  display: block;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

@media (max-width: 768px) {
  /* En móvil: 100% cada uno, uno debajo del otro */
  .institucion-venta-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .alert-text {
    font-size: 12px;
    line-height: 1.4;
  }
  
  .alert-responsive >>> .vs-alert {
    padding: 10px 12px;
  }
  
  .institucion-venta-card {
    padding: 16px;
  }
}

.tipo-venta-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e3e8ef;
  transition: all 0.3s ease;
}

.tipo-venta-container:hover {
  border-color: #7367f0;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.1);
}

.tipo-venta-label {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #7367f0;
  padding-bottom: 8px;
}

.tipo-venta-radio-wrapper {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  transition: color 0.2s ease;
}

.radio-label:hover {
  color: #7367f0;
}

.radio-label i {
  font-size: 16px;
  color: #7367f0;
}

@media (max-width: 768px) {
  .institucion-venta-card {
    padding: 16px;
  }
  
  .tipo-venta-container {
    padding: 16px;
  }
  
  .tipo-venta-label {
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .radio-label {
    font-size: 13px;
  }
}

/* Estilos para el modal de confirmación */
.modal-confirm-content {
  padding: 10px;
}

.modal-header-section {
  margin-bottom: 20px;
}

.modal-info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.modal-info-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-info-card.accion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.modal-info-card.accion-card .info-label,
.modal-info-card.accion-card .info-value {
  color: white;
}

.modal-info-card.documento-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-left: 4px solid #2196f3;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 140px;
}

.modal-info-card.accion-card .info-label {
  font-size: 16px;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
}

.modal-info-card.accion-card .info-value {
  font-size: 16px;
  font-weight: 600;
}

/* Badge pequeño para tipo de venta en modal */
.badge-venta {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
}

.badge-venta i {
  font-size: 14px;
}

.badge-venta.success {
  background-color: #4caf50;
  color: white;
}

.badge-venta.primary {
  background-color: #2196f3;
  color: white;
}

.badge-venta.warning {
  background-color: #ff9800;
  color: white;
}

/* Badge título compacto */
.badge-title {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Badge tipo de importación */
.badge-importacion {
  display: inline-block;
  background: transparent;
  color: #2c3e50;
  padding: 0;
  border-radius: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 3px solid #11998e;
  padding-bottom: 4px;
  text-transform: uppercase;
}

/* Estilos para el card de resumen simplificado */
.stat-card-resumen {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card-resumen:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon-resumen {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 28px;
}

.stat-content-resumen {
  flex: 1;
}

.stat-label-resumen {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 6px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value-resumen {
  font-size: 32px;
  font-weight: bold;
  color: #28c76f;
  margin: 0;
}
</style>
