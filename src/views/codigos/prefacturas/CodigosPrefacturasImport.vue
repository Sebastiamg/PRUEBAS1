<template>
  <vx-card>
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
        <h4>Está seguro de aplicar estos {{ arraySendCodigos.length }} códigos?</h4>
        <p>
          <!--afectacion a la tabla codigo o tabla codigos_son-->
          <b v-if="ifPermitirCodigosSon == 1">
            <span class="text-danger">Esta asignación afectará a la tabla de devoluciones</span>
          </b>
          <b v-if="ifPermitirCodigosSon == 0">
            <span class="text-danger">Esta asignación afectará a la tabla de códigos</span>
          </b>

        </p>
        <p v-if="ifPermitirReemplazar">
          <b class="text-danger">
            ¿ESTÁ SEGURO DE REEMPLAZAR EL DOCUMENTO DE DESPACHO?
          </b>
        </p>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
        <!--CANCELAR BOTON-->
        <vs-button class="mb-2 ml-5" color="primary" type="gradient" @click="modalConfirm=false"> Cancelar </vs-button>
      </div>
    </vs-popup>
    <div>
      <p class="mt-2">
        <b>Nota.</b> Esta importación trata de asignar un documento pre factura/nota a los códigos <b> (No ingrese mas de 1500 códigos - SOLO SUBIR CÓDIGOS INDIVIDUALES) </b>
      </p>
      <div  class="mt-5">
        <ul class="flex">
          <li class="mr-5">
            <vs-radio v-model="ifPermitirCodigosSon" @input="limpiarData2();buscarCodigosForDevolucion();ifPermitirReemplazar=false;" vs-name="radios1ifPermitirCodigosSon" vs-value="0">Asignación a los tabla códigos</vs-radio>
          </li>
          <li class="mr-5" v-if="userRoot">
            <vs-radio v-model="ifPermitirCodigosSon" @input="limpiarData2();buscarCodigosForDevolucion();ifPermitirReemplazar=false;" vs-name="radios1ifPermitirCodigosSon" vs-value="1">Asignación a la tabla de devoluciones <b>(Solo a los códigos de la tabla codigoslibros_son que este en estado creado)</b></vs-radio>
          </li>
        </ul>
        <div class="vx-row">
          <div class="vx-col w-full">
            <ul class="mt-2" v-if="ifPermitirCodigosSon == '0'">
              <li>
                <label for="">Permitir reemplazar documento</label>
                <vs-switch v-model="ifPermitirReemplazar"/>
              </li>
            </ul>
          </div>
          <div class="vx-col w-full" v-if="ifPermitirReemplazar">
            <vs-alert color="danger" class="mt-2">
              Esto <b>cambiará</b> el documento de despacho para los códigos seleccionados
            </vs-alert>
          </div>
        </div>
      </div>
      <div class="mb-6 mt-5" align="center">
         <!--Input para observacion-->
         <!-- <vs-input v-model="observacion" class="w-full mt-4" label="Comentario" /> -->
        <br/>

        <div v-if="menu == 0">
          <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
            <vs-row>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
                <vs-card>
                  <div class="header">
                    <p style="font-weight: bold;">Formato del archivo excel</p>
                    <table class="tabla">
                        <tr>
                          <th class="th1">codigo</th>
                          <th class="th1">documento</th>
                          <th class="th1">id_empresa</th>
                        </tr>
                        <tr>
                          <td class="td1">xxx</td>
                          <td class="td1">xxx</td>
                          <td class="td1">xxx</td>
                        </tr>
                    </table>
                  </div>
                </vs-card>
              </vs-col>
            </vs-row>
        </div>
        <!--RESULTADOS-->
         <!--check mostrar-->
         <ul>
          <li v-if="codigosPerdidos">
            <vs-checkbox  v-model="checkMostrarResultados" class="mt-4" vs-label="Mostrar resultados" color="success" vs-type="border" >
              Mostrar resultados
            </vs-checkbox>
          </li>
          <li v-if="CodigosNoEncontrados.length > 0">
            <vs-checkbox  v-model="checkMostrarCodigosNoEncontrados" class="mt-4" vs-label="Mostrar resultados" color="success" vs-type="border">
              Mostrar <b>{{ CodigosNoEncontrados.length }} {{ tipoCode }}</b> No encontrados en el archivo de excel
            </vs-checkbox>
          </li>
          <!-- <li v-if="arrayComparativoPaquetes.length > 0">
            <vs-checkbox  v-model="checkMostrarResumenPaquetes" class="mt-4" vs-label="Mostrar resumen Paquetes" color="success" vs-type="border">
              Mostrar Resumen de paquetes
            </vs-checkbox>
          </li> -->
        </ul>
        <div v-if="checkMostrarCodigosNoEncontrados && CodigosNoEncontrados.length > 0">
          <TableReutilizableVue
          :title="tipoCode + ' No encontrados'"
          :headers="[tipoCode]"
          :fieldKeys="['codigo']"
          :tableData="CodigosNoEncontrados"
          />
        </div>
        <div v-if="codigosPerdidos && checkMostrarResultados">
          <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-alert active="true" style="height: 80px;" color="success">
               <p class="text-center font-bold"><i class="fa-solid fa-check"></i> Códigos asignados exitosamente. {{ porcentaje }} códigos</p>

              </vs-alert>
            </vs-col>
          </vs-row>
          <!--codigo no existen-->
          <vs-row>
            <vs-card>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="codigosNoCambiados.length > 0">
                <vs-list>
                <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                  <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                  <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                    <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                  </vs-list-item>
                </vs-list>
              </vs-col>
            </vs-card>
          </vs-row>

        </div>
        <!--mostrar tabla de codigos no encontrados-->
        <!--mostrar resumen de paquetes-->
        <!-- <div v-if="checkMostrarResumenPaquetes && arrayComparativoPaquetes.length > 0">
          <TablaResumenPaquetesDevueltosVue :arrayComparativoPaquetes="arrayComparativoPaquetes" />
        </div> -->
        <!--fin mostrar resumen de paquetes-->
        <!-- {{tableData}} -->
      </div>
    </div>
    <!--preview codigos prefacturas-->
    <div v-if="menu == 1" class="mt-5">
      <!--boton subir otro archivo-->
      <div class="flex justify-start">
        <vs-button @click="menu = 0;tableData=[];codigosPerdidos=false;checkMostrarResultados=false;checkMostrarCodigosNoEncontrados=false;codigosSinCodigoUnion=[];codigosConLiquidacion=[];codigoNoExiste=[];CodigosNoEncontrados=[];checkMostrarResumenPaquetes=false;arrayComparativoPaquetes=[];" color="warning" type="border" class="mb-4"><i class="fa-solid fa-right-left"></i> Subir otro archivo</vs-button>
      </div>
      <CodigosPrefacturasPreviewVue :arrayCodigosEncontrados="arrayCodigosEncontrados" @openConfirm="openConfirm"/>
    </div>
    <!--MODALES-->
    <!--modal para mostrar las prefacturas-->
    <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupResultados">
      <div v-if="popupResultados">
          <p class="text-center"><b>Códigos asignados: </b>{{ porcentaje }}</p>
      </div>
      <!-- <vs-card>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="CodigosNoEncontrados.length > 0">
          <vs-list>
          <p>Cantidad <span>{{ CodigosNoEncontrados.length }}</span></p>
              <vs-list-header icon="supervisor_account" title="Códigos que no encontrados"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in CodigosNoEncontrados" icon="check" :title="tr.codigo" >
              </vs-list-item>
          </vs-list>
          </vs-col>
      </vs-card> -->
      <div class="flex justify-center mt-3">
          <vs-button @click="popupResultados = false">Aceptar</vs-button>
      </div>
    </vs-popup>
    <!--modal para mostrar el tipo de importacion-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado"  @close="handleClose" :class="{ 'hide-close': !showCloseButton }">
      <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
      <p class="text-center mt-5 text-danger font-bold"><> Los códigos normales máximo 1500</p>
      <p class="text-danger mt-2 text-center font-bold">!Los paquetes máximo 200 paquetes</p>
      <vs-divider></vs-divider>
      <div class="flex justify-center mt-2" style="flex-wrap: wrap;">
        <vs-button class="m-3" color="primary"   @click="tipoBodega= 0;tipoCode='Códigos';titleImportacion = 'Importacion Códigos';buscarCodigosForDevolucion();">Códigos</vs-button>
        <vs-button class="m-3" color="#29BCC6"   @click="tipoBodega= 1;tipoCode='Paquetes';titleImportacion = 'Importacion Paquetes';buscarCodigosForDevolucion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
      </div>
      <div class="flex justify-center">
      </div>
    </vs-popup>
  </vx-card>
</template>
<script>
import {
  mapState
} from "vuex";
import Generalmix from '@/mixins/Generalmix'
import TableRadiosCodigosListaVue from "../components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue";
import vSelect from 'vue-select'
import ImportExcel from "../components/importExcel.vue";
import { set } from "core-js/core/dict";
const TableReutilizableVue               = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const CodigosPrefacturasPreviewVue       = () => import('@/views/codigos/prefacturas/CodigosPrefacturasPreview.vue')
export default {
  mixins:[Generalmix],
  components: {
    ImportExcel,
    vSelect,
    TableRadiosCodigosListaVue,
    TableReutilizableVue,
    CodigosPrefacturasPreviewVue,
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
      porcentaje:0,
      instituciones:[],
      busquedaInstitucion:'',
      nombreInstitucion:'',
      nombrePeriodo:'',
      institucion_id:'',
      radioRegalado:'0',
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      CodigosNoEncontrados:[],
      arrayPaquetesEncontrados:[],
      arrayComparativoPaquetes:[],
      checkMostrarCodigosNoEncontrados:false,
      popupResultados:false,
      codigosConProblemas:[],
      arrayCodigosEncontrados:[],
      arraySendCodigos:[],
      checkMostrarCodigosProblemas:false,
      popupConfirmTipoImportado:false,
      tipoBodega:0,
      tipoCode:'Códigos',
      titleImportacion:'',
      checkMostrarResultados:false,
      showCloseButton: false,
      menu:0,
      ifPermitirCodigosSon:0,
      ifPermitirReemplazar:false,
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','userAsesor']),
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
    },
  methods: {
    handleClose() {
      let me = this;
      me.popupConfirmTipoImportado = true
    },
    loadDataInTable ({ results, header, meta }) {
      this.codigosPerdidos            = false
      this.header                     = header
      this.tableData                  = results
      this.sheetName                  = meta.sheetName
      this.CodigosNoEncontrados       = [ ]
      this.codigosConProblemas        = []
      this.popupConfirmTipoImportado  = true;
    },
    buscarCodigosForDevolucion(){
      let me                                      = this;
      //el archivo debe tener columna codigo
      if( !me.tableData[0].codigo || !me.tableData[0].documento || !me.tableData[0]){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        me.limpiarData()
        me.popupConfirmTipoImportado = false
        return
      }
      if(me.tipoBodega == 0){
        //maximo 1500 codigos
        if(me.tableData.length > 1500){
          me.$vs.notify({ text:'No puedes subir mas de 1500 codigos', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          return
        }
        //si el primero codigo empieza por paq- o PAQ- mostrar mensaje el archivo contiene paquetes  y se esta subiendo en el modulo para codigos revise por favor
        if(me.tableData[0].codigo.startsWith('paq-') || me.tableData[0].codigo.startsWith('PAQ-')){
          me.$vs.notify({ text:'El archivo contiene paquetes, por favor suba el archivo en el modulo de paquetes.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          return
        }
      }
      let validateDocumentosVacios = me.tableData.filter(p =>
      !('documento' in p) || p.documento === ""
      );

      if (validateDocumentosVacios.length > 0) {
        me.m_message("Existe codigos sin documento, por favor revise el archivo y suba el archivo solo codigos individuales.",'warning')
        return
      }
      //validar con codigos
      let validateCodigos = me.tableData.filter(p =>
        !('codigo' in p) || p.codigo === ""
      );
      if (validateCodigos.length > 0) {
        me.m_message("Existe codigos sin combo, por favor revise el archivo y suba el archivo solo codigos individuales.",'warning')
        return
      }
      //validar el id_empresa
      let validateIdEmpresa = me.tableData.filter(p =>
        !('id_empresa' in p) || p.id_empresa === ""
      );
      if (validateIdEmpresa.length > 0) {
        me.m_message("Existe codigos sin id_empresa, por favor revise el archivo y suba el archivo solo codigos individuales.",'warning')
        return
      }
      //si es tipoBodega 2 maximo 200
      if(me.tipoBodega == 1){
        //maximo 200 paquetes
        if(me.tableData.length > 200){
          me.$vs.notify({ text:'No puedes subir mas de 200 paquetes', color:'warning', iconPack: 'feather', icon:'icon-check'})
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          return
        }
        //si el primero codigo no empieza por paq- o PAQ- mostrar mensaje el archivo contiene codigos y se esta subiendo en el modulo para paquetes revise por favor
        if(!me.tableData[0].codigo.startsWith('paq-') && !me.tableData[0].codigo.startsWith('PAQ-')){
          me.$vs.notify({ text:'El archivo contiene códigos normales, por favor suba el archivo en el modulo para códigos.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          return
        }
      }
      let json_pagos                              = ""
      me.arrayCodigosEncontrados                  = [];
      me.popupConfirmTipoImportado                = false;
      //mayuscula
      me.tableData.forEach(codigo => {
        codigo.codigo = codigo.codigo.toUpperCase()
      })
      json_pagos                                  = JSON.stringify(me.tableData)
      let formData = new FormData();
      formData.append('data_codigos',             json_pagos);
      formData.append('mostrarSoloCodigos',       1)
      if(me.ifPermitirCodigosSon == '0'){
        //api post
        if(me.tipoBodega == 1){
          formData.append('getPrevisualizarPaquetes', '1')
        }else{
          formData.append('getPrevisualizarCodigos',  '1')
        }
      }
      if(me.ifPermitirCodigosSon == '1'){
        //api post
        if(me.tipoBodega == 1){
          formData.append('getPrevisualizarPaquetesTablaSon', '1')
        }else{
          formData.append('getPrevisualizarCodigosTablaSon',  '1')
        }
      }
      me.$http.post(me.$server_url+'metodosPostCodigos', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.m_message(res.data.message)
          return
        }
        if(res.data.no_encontrados.length > 0){
          me.checkMostrarCodigosNoEncontrados = true
          //agregar la propiedad codigo a cada elemento de res.data.no_encontrados
          me.CodigosNoEncontrados             = res.data.no_encontrados.map(codigo => ({ codigo: codigo }))
        }
        if(res.data.encontrados.length > 0){
          me.arrayCodigosEncontrados = res.data.encontrados
          //si no se encontraron codigos en el array de codigosEncontrados
          if(me.arrayCodigosEncontrados.length == 0){
            me.$vs.notify({ text:'No se encontraron códigos', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
            return
          }
        }
        //proceso de array de paquetes
        if(me.tipoBodega == 1){
          me.arrayPaquetesEncontrados  = res.data.paquetesEncontrados
          if(res.data.paquetesEncontrados.length > 0){
            // me.f_procesoPaquetes()
          }
        }
        me.menu = 1
      })
      .catch(error => {
        console.log(error)
        me.$vs.loading.close()
        me.limpiarData()
        me.m_message("Ocurrio un error al agrupar los codigos"+error,'danger')
        me.popupConfirmTipoImportado = false
      })
    },
    f_procesoPaquetes(){
      let me = this
      //recorrer el array de arrayPaquetesEncontrados y encontrar en el array arrayCodigosEncontrados y colocar en el arrayComparativoPaquetes
      me.arrayComparativoPaquetes = []
      // var  combinedData            = me.arrayCodigosEncontrados.map(item => item.resultados).flat();
      const combinedData = me.arrayCodigosEncontrados
        // .flatMap(item => item.resultados)
        // .flatMap(resultado => resultado.data);
      me.arrayPaquetesEncontrados.forEach(paquete => {
        const codigosFiltrados    = combinedData.filter(codigo => codigo.codigo_paquete === paquete);
        //cuantos tiene estado_liquidacion = 3 seria como devueltos
        const devueltos          = codigosFiltrados.filter(codigo => codigo.estado_liquidacion == 3).length;
        //cantidad de codigosFiltrados
        const cantidadCodigos      = codigosFiltrados.length
        me.arrayComparativoPaquetes.push({ paquete: paquete, codigos: codigosFiltrados, devueltos: devueltos, cantidadCodigos: cantidadCodigos });
      })
    },
    limpiarData(){
      let me = this
      me.tableData = []
      me.codigosPerdidos = false
      me.checkMostrarResultados = false
      me.checkMostrarCodigosNoEncontrados = false
      me.codigosSinCodigoUnion = []
      me.codigosConLiquidacion = []
      me.codigoNoExiste = []
      me.CodigosNoEncontrados = []
    },
    limpiarData2(){
      let me = this
      me.codigosPerdidos     = false
      me.checkMostrarResultados = false
      me.checkMostrarCodigosNoEncontrados = false
      me.codigosSinCodigoUnion = []
      me.codigosConLiquidacion = []
      me.codigoNoExiste = []
      me.CodigosNoEncontrados = []
    },
    procesarPagos(){
        let me = this
        // Remover espacios redundantes entre palabras
        // me.observacion = me.observacion.replace(/\s+/g, ' ').trim();

        // if (!me.observacion) {
        //   me.$vs.notify({
        //     text: 'Debe ingresar una observación válida',
        //     color: 'warning',
        //     iconPack: 'feather',
        //     icon: 'icon-check',
        //   });
        //   return;
        // }

        // if (me.observacion.length < 5) {
        //   me.$vs.notify({
        //     text: 'La observación debe tener al menos 5 caracteres no vacíos o consecutivos',
        //     color: 'warning',
        //     iconPack: 'feather',
        //     icon: 'icon-check',
        //   });
        //   return;
        // }
        me.checkMostrarCodigosProblemas     = false
        me.checkMostrarCodigosNoEncontrados = false
        let sendEnviar  = me.tableData
        //convertir a mayusculas las columnas codigo y combo
        sendEnviar.forEach((obj) => {
          obj.codigo     = obj.codigo.toUpperCase();
          obj.documento  = obj.documento.toUpperCase();
          obj.id_empresa = obj.id_empresa;
        });
        //codigos normales
        if(me.tipoBodega == 0){
          me.arraySendCodigos.forEach(element => {
            //buscar en senEnviar si existe el codigo colocar el documento y id_empresa
            let setdocumento = ''
            setdocumento = sendEnviar.find(p => p.codigo == element.codigo)
            if(setdocumento){
              element.codigo      = element.codigo
              element.documentoE  = setdocumento.documento
              element.id_empresaE = setdocumento.id_empresa
            }
          });
        }
        //paquetes
        if(me.tipoBodega == 1){
            me.arraySendCodigos.forEach(element => {
            //buscar en senEnviar si existe el codigo colocar el documento y id_empresa
            let setdocumento = ''
            setdocumento = sendEnviar.find(p => p.codigo == element.codigo_paquete)
            if(setdocumento){
              element.codigo      = element.codigo
              element.documentoE  = setdocumento.documento
              element.id_empresaE = setdocumento.id_empresa
            }
          });
        }

        //en sendEnviarCodigos solo enviar el codigo el documento y id_empresa
        let sendEnviarCodigos = me.arraySendCodigos.map(p => ({
          codigo: p.codigo,
          documento: p.documentoE,
          id_empresa: p.id_empresaE,
        }));
        let formData = new FormData();
        if(me.ifPermitirCodigosSon == 1)      { formData.append('importPrefacturasTablaSon',     '1'); }
        if(me.ifPermitirCodigosSon == 0)      { formData.append('importPrefacturas',             '1'); formData.append('ifPermitirReemplazar', me.ifPermitirReemplazar == false ? 0 : 1); }
        formData.append('data_codigos',       JSON.stringify(sendEnviarCodigos));
        formData.append('id_usuario',         me.usuario.idusuario);
        formData.append('periodo_id',         localStorage.periodo_id);
        me.$vs.loading()
        this.$http.post(this.$server_url+'metodosPostVentas', formData)
        .then(res => {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
          }
          me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.modalConfirm                     = false
          // me.tableData                     = []
          me.codigosPerdidos                  = true
          me.checkMostrarCodigosNoEncontrados = true
          me.checkMostrarCodigosProblemas     = true
          me.checkMostrarResultados           = true
          me.codigosNoCambiados               = res.data.codigosNoCambiados
          me.porcentaje                       = res.data.cambiados
          me.popupResultados                  = true
          me.buscarCodigosForDevolucion()
        })
        .catch(function (error) {
          console.log(error)
          me.$vs.notify({
          text:'Verifique que la información se haya guardado correctamente.',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'})
          me.$vs.loading.close()
        })
    },
    openConfirm(e) {
      let me = this
      me.arraySendCodigos = e.data
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
  background-color: #000;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
