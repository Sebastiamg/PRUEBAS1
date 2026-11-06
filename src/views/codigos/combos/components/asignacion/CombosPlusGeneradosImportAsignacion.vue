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
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estos códigos?</h4>
        <h4 class="mt-3 text-warning">Asignar: {{ arrayCodigosEncontrados.length }} códigos en {{ arrayCombos.length}} combos</h4>
        <small>Importacion tipo: {{ titleImportacion }}</small>
        <!--libro seleccionado-->
        <div v-if="arrayLibrosSeleccionados.length > 0" class="mt-5">
          <p>Libros seleccionados
            <b v-if="tipoRegalado == 1">: Regalado</b>
            <b v-if="tipoRegalado == 2">: Regalado y bloqueado</b>
          </p>
          <ul class="list-disc list-inside">
            <li v-for="libro in arrayLibrosSeleccionados" :key="libro.codigo_liquidacion">
              <b>{{ libro.nombrelibro }}</b>
            </li>
          </ul>
        </div>
      </div>

      <!--radios para bloqueados-->
      <div v-if="ifMostrarRadioBloqueado" style="margin-top: -15px;">
        <p class="text-danger text-center">Existe codigos bloqueados en el archivo desea agregar al combo?</p>
        <div class="flex justify-center mt-3">
          <ul class="flex">
            <li class="mr-3">
              <vs-radio v-model="IfpermitirBloqueado" vs-name="radios1IfpermitirBloqueado" vs-value="0">No</vs-radio>
            </li>
            <li class="mr-3">
              <vs-radio v-model="IfpermitirBloqueado" vs-name="radios1IfpermitirBloqueado" vs-value="1">Si</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="arrayCodigosProblemas.length > 0">
        <small class="font-bold text-warning flex justify-center">!Si el código tiene el combo igual solo se va a reemplazar el combo</small>
        <TableReutilizableVue
        :title="'Códigos con problemas'"
        :headers="['codigo','Combo Actual', 'Combo Ingresar','Mensaje']"
        :fieldKeys="['codigo','codigo_combo','codigoComboAIngresar','msgError']"
        :ifexportar="Number(1)"
        :tableData="arrayCodigosProblemas"
        />
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" v-if="contadorCodigosProblemas == 0 || (ifMostrarRadioBloqueado && IfpermitirBloqueado == 1)" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div class="mb-6 mt-5" align="center">
      <div class="vx-col w-full">
        <p style="color:#369DDA;">
            <i class="fa fa-file" aria-hidden="true"></i> Importación de <b>combos</b> de códigos <span style="font-weight: bold;">(no ingrese más de 100 combos en una sola carga.)</span>
        </p>
        <p class="mt-2">
          <b>Nota.</b> Esta importación trata de asignar un código de combo a <b>código sueltos </b> o <b>Paquetes</b>
        </p>
        <p class="font-bold">Aquí se validará si el código es liquidado no será tomado en cuenta</p>
      </div>
      <!--Boton para subir otro archivo-->
      <div v-if="tableData.length > 0">
        <!--boton para exportar otro archivo-->
        <div class="flex justify-start mt-5">
          <vs-button @click="tableData=[];codigosPerdidos=false;arregloResumen=[];arrayCodigosProblemas=[];arregloFormatoSend=[];totalCodigosReal=0;totalCodigos=0;menu=0;arrayCodigosEncontrados=[];arregloProblemasCombo=[];" color="dark" type="border" class="mb-4"><i class="fa-solid fa-right-left"></i> Subir otro archivo</vs-button>
        </div>
      </div>
      <br>
      <!--filtro de combos-->
      <div v-if="tableData.length > 0">
        <div class="vx-row">
          <div class="vx-col w-full">
            <ul class="flex">
              <li class="mr-5">
                <vs-radio v-model="tipoRegalado" vs-name="radios1tipoRegalado" @input="arrayLibrosSeleccionados=[];f_setearLibroRegalados();" vs-value="0">Combo normal </vs-radio>
              </li>
              <!-- <li class="mr-5">
                <vs-radio v-model="tipoRegalado" vs-name="radios1tipoRegalado" @input="f_setearLibroRegalados();" vs-value="1">Regalar</vs-radio>
              </li>
              <li>
                <vs-radio v-model="tipoRegalado" vs-name="radios1tipoRegalado" @input="f_setearLibroRegalados();" vs-value="2">Regalado y bloqueado</vs-radio>
              </li> -->
            </ul>
          </div>
          <div class="vx-col w-1/2 mt-5" v-if="tipoRegalado != 0">
            <p class="flex justify-start">Seleccione el libro a regalar:</p>
            <v-select :options="arrayLibros" @input="f_setearLibroRegalados();" multiple class="w-full" :reduce="arrayLibros => arrayLibros" label="nombrelibro" v-model="arrayLibrosSeleccionados" />
          </div>
        </div>
      </div>

      <div v-if="tableData.length == 0">
        <import-excel :onSuccess="loadDataInTable"  class="mb-4 mt-5" />
      </div>
      <br>
      <!-- {{tableData}} -->
      <vs-alert v-if="tableData.length > 0 && codigosPerdidos == false" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
        <p v-if="tableData.length > 0" class="text-success">
         {{ titleDescriptionImportacion }}
        </p><br>
      </vs-alert>
      <!--boton para importar-->
      <vs-row v-if="arrayCodigosEncontrados.length > 0 && arregloProblemasCombo.length == 0 && codigosPerdidos == false" class="mt-3">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0);"> Importar {{ arrayCodigosEncontrados.length }} códigos sueltos en {{ arrayCombos.length }} combos </vs-button>
          </vs-col>
      </vs-row>
      <div v-if="arregloProblemasCombo.length > 0" class="ml-5" style="width:50%;">
        <vs-alert title="Archivo con inconvenientes" color="danger" active="true">
          <p class="text-center">Existe <b>códigos</b> con problemas <b class="cursor-pointer" style="background:black;color:white;padding:5px;border-radius:5px;" @click="popupProblemasDiagnostico = true;"><ion-icon name="code-outline"></ion-icon> Mostrar códigos</b>
          </p>
        </vs-alert>
      </div>
      <!--RESULTADOS-->
      <!--COMBOS QUE NO EXISTEN-->
      <vs-row v-if="codigosPerdidos == true && arregloErroresCombos.length > 0">
        <vs-card>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
              <vs-list>
                <p>Cantidad <span>{{ arregloErroresCombos.length }}</span></p>
                  <vs-list-header icon="supervisor_account" title="Hubo problemas con algunos combos"></vs-list-header>
                  <vs-list-item :key="indextr" v-for="(tr, indextr) in arregloErroresCombos" icon="check" :title="tr.combo" >
                    <p> {{ tr.problema }}</p>
                  </vs-list-item>
              </vs-list>
          </vs-col>
        </vs-card>
      </vs-row>
      <!--RESUMEN DE CAMBIOS-->
      <div v-if="arregloResumen.length > 0" class="mt-2">
        <div v-if="arrayLibrosSeleccionados.length > 0">
          <p>Libros seleccionados
            <b v-if="tipoRegalado == 1">: Regalado</b>
            <b v-if="tipoRegalado == 2">: Regalado y bloqueado</b>
          </p>
        </div>
        <ul class="list-disc list-inside">
          <li v-for="libro in arrayLibrosSeleccionados" :key="libro.codigo_liquidacion">
            <b>{{ libro.nombrelibro }}</b>
          </li>
        </ul>
        <!--Regalo o regalo y bloqueo-->
        <TableResumenPaqueteVue class="mt-1" :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend" :tipoDescripcion="'combo'"/>
      </div>
      <vs-row v-if="codigosPerdidos == true">
        <vx-card
          title="Codigos que no se pudieron guardar"
          v-if="codigoConProblemas.length > 0"
          >
          <TableRadiosCodigosListaVue :arregloCodigos="codigoConProblemas" openModal="1"/>
        </vx-card>
      </vs-row>
    </div>
    <!--SI ES COMBOS MOSTRAR MENU PARA SELECCIONAR CODIGOS EXCEL Y CODIGOS DE LOS COMBOS-->
    <div v-if="ifOnlyCode == 3 && codigosPerdidos == false && arrayCodigosEncontrados.length > 0">
      <ul class="flex">
        <li class="mr-2">
          <vs-radio v-model="menu" vs-name="radios1menu" vs-value="0">Combos del Excel</vs-radio>
        </li>
        <li class="mr-2">
          <vs-radio v-model="menu" vs-name="radios1menu" vs-value="1">Codigos de los combos</vs-radio>
        </li>
      </ul>
    </div>
    <div v-if="menu == 0 && codigosPerdidos == false">
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
    </div>
    <div v-if="menu == 1 && codigosPerdidos == false">
      <CodigosPrefacturasPreviewVue :arrayCodigosEncontrados="arrayCodigosEncontrados" @openConfirm="openConfirm" :btnNotImportar="Number(1)"/>
    </div>

    <!--MODALES-->
    <!--MODAL PROBLEMAS DIAGNOSTICO-->
    <vs-popup fullscreen title="Problemas con los combos" :active.sync="popupProblemasDiagnostico">
      <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasCombo" :onlyCodes="onlyCodes"/>
    </vs-popup>
     <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Importación de Combos" :active.sync="popupConfirmTipoImportado" @close="popupConfirmTipoImportado=true;">
      <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
      <div class="mt-4 mr-4 flex justify-center">
        <!-- <span class="mr-2">Seleccione:</span> -->
        <ul class="flex" style="flex-wrap: wrap;">
          <li>
            <vs-radio v-model="ifOnlyCode" vs-name="ifOnlyCode" class="m-4"  vs-value="0">Activación - Diagnóstica</vs-radio>
          </li>
          <li>
            <vs-radio v-model="ifOnlyCode" vs-name="ifOnlyCode" class="m-4"  vs-value="1">Diagnóstica - Activación</vs-radio>
          </li>
          <li>
            <vs-radio v-model="ifOnlyCode" class="m-4" vs-name="ifOnlyCode"  vs-value="2">Activación</vs-radio>
          </li>
          <li>
            <vs-radio v-model="ifOnlyCode" class="m-4" vs-name="ifOnlyCode"  vs-value="3">Combos</vs-radio>
          </li>
          <li>
            <vs-radio v-model="ifOnlyCode" class="m-4" vs-name="ifOnlyCode"  vs-value="4">Paquetes y activacion - diagnostico</vs-radio>
          </li>
          <li>
            <vs-radio v-model="ifOnlyCode" class="m-4" vs-name="ifOnlyCode"  vs-value="5">Paquetes y activacion</vs-radio>
          </li>
        </ul>
      </div>
      <div class="flex justify-center mt-5">
        <vs-button color="primary" v-if="ifOnlyCode != 3 && ifOnlyCode != 4 && ifOnlyCode != 5" type="border" @click="menu=0;f_busquedaCodigos();popupConfirmTipoImportado=false;">Aceptar</vs-button>
        <vs-button color="primary" v-if="ifOnlyCode == 3" type="border" @click="menu=0;validateCombos();popupConfirmTipoImportado=false;">Aceptar</vs-button>
        <vs-button color="primary" v-if="ifOnlyCode == 4 || ifOnlyCode == 5" type="border" @click="menu=0;f_validatePaquetesSueltos();popupConfirmTipoImportado=false;">Aceptar</vs-button>
        <!--boton cancelar -->
        <vs-button color="danger" class="ml-5" type="border" @click="popupConfirmTipoImportado=false;f_limpiarCancelar();"><i class="fa-solid fa-circle-xmark"></i> Cancelar</vs-button>
      </div>
    </vs-popup>
     <!--modal para mostrar errores de nivel-->
    <vs-popup title="Errores de Nivel en combos" :active.sync="popupMostrarErroresNivel">
      <div v-if="popupMostrarErroresNivel">
        <CombosGeneradosImportAsignacionErrorNivelVue :arrayErroresNivel="arrayErroresNivel"/>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
const TableResumenPaqueteVue          = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
const TableReutilizableVue            = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const CodigosPrefacturasPreviewVue       = () => import('@/views/codigos/prefacturas/CodigosPrefacturasPreview.vue')
const CombosGeneradosImportAsignacionErrorNivelVue = () => import('./CombosGeneradosImportAsignacionErrorNivel.vue')
import vSelect from 'vue-select'
import TablaErroresPaqueteVue from '../../../paquetes/components/TablaErroresPaquete.vue';
import ImportExcel from '../../../components/importExcel.vue';
import TableRadiosCodigosListaVue from '../../../components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue';
import Generalmix from '../../../../../mixins/Generalmix';
import CodigoRepository from "../../../../../repositories/CodigoRepository";
export default {
  mixins:[Generalmix],
  components: {
    ImportExcel,
    vSelect,
    TableRadiosCodigosListaVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
    TableReutilizableVue,
    CodigosPrefacturasPreviewVue,
    CombosGeneradosImportAsignacionErrorNivelVue,
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
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      arregloProblemasCombo:[],
      arregloFormatoSend:[],
      totalCodigos:0,
      totalCodigosReal:0,
      popupProblemasDiagnostico:false,
      arrayCombos:[],
      arregloResumen:[],
      codigoConProblemas:[],
      arregloErroresCombos:[],
      popupConfirmTipoImportado:false,
      ifOnlyCode:0,
      onlyCodes:1,
      //variables para regalar libros
      arrayLibrosSeleccionados:'',
      tipoRegalado:0,
      CodigosNoEncontrados:[],
      arrayCodigosEncontrados:[],
      arrayLibros:[],
      //fin variables para regalar libros
      letraCombo:null,
      arrayCodigosProblemas:[],
      contadorCodigosProblemas:0,
      menu:0,
      ifMostrarRadioBloqueado:false,
      IfpermitirBloqueado:0,
      //variables paquetes y codigos sueltos
      letraPaquete:'paq',
      arrayCodigosEncontradosSueltos:[],
      //fin variables y codigos sueltos
      //variables para errores de nivel
      arrayErroresNivel:[],
      popupMostrarErroresNivel:false,
      //fin variables para errores de nivel
    }
  },
  created(){
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.codigosPerdidos = false
  },
  mounted(){
    let me = this
    me.getLetraCombo()
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','userAsesor']),
    titleDescriptionImportacion() {
      const acciones = {
        "0": 'Importación de codigo de activación y diagnóstica',
        "1": 'Importación de codigo de diagnóstica y activación',
        "2": 'Importacion de un solo codigo por libro',
        "3": 'Importacion por Combos',
        "4": 'Importacion de paquetes y sueltos',
        "5": 'Importacion de paquetes y sueltos (solo activación)',
      };
      // Asegúrate de que `ifOnlyCode` es una cadena que concuerde con las claves en el objeto `acciones`
      return acciones[this.ifOnlyCode] || 'Opción no válida';
    },
    titleImportacion(){
      const acciones = {
        "0": 'Activación - Diagnóstica',
        "1": 'Diagnóstica - Activación',
        "2": 'Activación',
        "3": 'Combos',
        "4": 'Paquetes y Sueltos',
        "5": 'Paquetes y Activación',
      };
      // Asegúrate de que `ifOnlyCode` es una cadena que concuerde con las claves en el objeto `acciones`
      return acciones[this.ifOnlyCode] || 'Opción no válida';
    }
  },
  props:{
    tipoImport:{
      type:Number,
      default:0
    },
  },
  methods: {
    getLetraCombo() {
      CodigoRepository.getComboConfigurado().then(p => { this.letraCombo = p.data[0].codigo_paquete.toLowerCase(); } ).catch(error => { me.m_message('Error al obtene la configuracion del combo','danger') });
    },
    loadDataInTable ({ results, header, meta }) {
      let me                          = this
      this.codigosPerdidos            = false
      this.arregloResumen             = []
      this.codigoConProblemas         = []
      this.arregloErroresCombos       = []
      this.header                     = header
      this.tableData                  = results
      this.sheetName                  = meta.sheetName
      this.popupConfirmTipoImportado  = true;
      this.onlyCodes                  = 1
      this.arrayLibrosSeleccionados   = []
      this.menu                       = 0
    },
    f_validatePaquetesSueltos(){
      let me                            = this
      let preDatos                      = []
      let datos                         = []
      me.arrayCodigosEncontradosSueltos = []
      datos                             = me.tableData
      datos.map((item) => {
        let obj = new Object();
        obj.codigo = item.codigo.trim()
        preDatos.push(obj)
      })
      const copiaExcel           = JSON.parse(JSON.stringify(preDatos));
      //DE LO CONTRARIO VAMOS A VALIDAR CON LA BASE
      const paquetesEncontrados  = copiaExcel.filter(objeto => objeto.codigo.toLowerCase().startsWith(`${me.letraPaquete}-`));

      let formData = new FormData();
      formData.append('data_codigos',             (JSON.stringify(paquetesEncontrados)))
      formData.append('mostrarSoloCodigos',       1)
      formData.append('getPrevisualizarPaquetes',  '1')

      me.$http.post(me.$server_url+'metodosPostCodigos', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.m_message(res.data.message)
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          me.tableData = []
          return
        }
        // if(res.data.no_encontrados.length > 0){
        //   //agregar la propiedad codigo a cada elemento de res.data.no_encontrados
        //   me.CodigosNoEncontrados             = res.data.no_encontrados.map(codigo => ({ codigo: codigo }))
        // }
        me.arrayCodigosEncontradosSueltos = res.data.encontrados
        me.f_busquedaCodigos()

      })
      .catch(error => {
        console.log(error)
        me.$vs.loading.close()
        me.limpiarData()
        me.m_message("Ocurrio un error al agrupar los codigos"+error,'danger')
        me.popupConfirmTipoImportado = false
      })
    },
    validateCombos(){
      let me = this
      // Validar que todos los códigos empiezan con 'cmb-' o 'CMB-'
      let valid = true;
      for (let i = 0; i < me.tableData.length; i++) {
        if (!me.tableData[i].codigo.startsWith('cmb-') && !me.tableData[i].codigo.startsWith('CMB-')) {
          valid = false;
          break; // Si encuentras uno que no cumple, puedes salir del ciclo
        }
      }

      if (!valid) {
        me.$vs.notify({
          text: 'El archivo contiene códigos que no son combos, corrija por favor.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 6000
        });
        me.limpiarData();
        me.tableData = [];
        me.totalCodigos = 0;
        me.totalCodigosReal = 0;
        me.arregloProblemasCombo = [];
        me.arregloFormatoSend = [];
        me.arrayCombos = [];
        me.arrayCodigosEncontrados = [];
        return;
      }
      me.f_busquedaCodigos();
    },
    async validateCodigosCombos(){
        try{
          let me = this
          me.arregloProblemasCombo    = []
          me.arregloFormatoSend       = []
          me.arrayCombos              = []
          me.totalCodigosReal         = 0
          me.totalCodigos             = 0
          let datos                   = []
          let preDatos                = []
          if(!me.tableData[0].codigo){
            me.$vs.loading.close()
            me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
            return
          }
          datos                       = me.tableData
          datos.map((item) => {
            let obj = new Object();
            obj.codigo = item.codigo.trim()
            preDatos.push(obj)
          })
          const arrayNormal           = JSON.parse(JSON.stringify(preDatos));
          //DE LO CONTRARIO VAMOS A VALIDAR CON LA BASE
          const objetosFiltrados      = arrayNormal.filter(objeto => objeto.codigo.toLowerCase().startsWith(`${me.letraCombo}-`));
          me.arrayCombos              = objetosFiltrados
          me.totalCodigos             = arrayNormal.length - me.arrayCombos.length
          //PROCESO
          // Crear un nuevo array resultante
          var nextCombo = 1
          for(let i = 0; i<objetosFiltrados.length; i++){
            let nuevoArray = []
            let preArray   = []
            //tomo el siguiente combo y valido si fuera el ultimo
            let getPosicion = objetosFiltrados[nextCombo]
            //UNDEFINED PORQUE BUSCO EL PROXIMO COMBO PARA SABER QUE ES EL ULTIMO
            if(getPosicion!==undefined){
              //busco la posicion del ultimo combo para agarrar los codigos hasta la ultima posicion del proximo combo
              const codigoBuscado         = objetosFiltrados[nextCombo].codigo;
              const posicionCodigoBuscado = arrayNormal.findIndex(objeto => objeto.codigo === codigoBuscado);
              nuevoArray.push(arrayNormal.splice(0, posicionCodigoBuscado));
              preArray = nuevoArray[0]
              const resultado1 = await me.ChangeArray(preArray)
            }
            //EL ULTIMO COMBO NO TIENE POSICION DEL ULTIMO PARQUETE PORQUE TERMINA EN CODIGO
            else{
              nuevoArray.push(arrayNormal);
              preArray = nuevoArray[0]
              const resultado2 = await me.ChangeArray(preArray)
            }
            nextCombo++
          }
          console.log("totalCodigos",me.totalCodigos)
          console.log("totalCodigosReal",me.totalCodigosReal)
          //validar que los codigos combos tenga los codigos correctos
          if(me.totalCodigos != me.totalCodigosReal){
          }
          if(me.arregloProblemasCombo.length > 0){
            me.popupProblemasDiagnostico = true
          }
          me.f_setearLibroRegalados()
        }
        catch (error) {
          console.log(error)
          alert("Hubo errores en el archivo")
        }
    },

    async ChangeArray(array){
      let me = this;
      var problema         = ""
      var preArray         = array.flat(10)
      var getCodigoCombo   = preArray.splice(0,1)
      var codigoCombo      = getCodigoCombo[0].codigo
      var arrayHijos       = preArray
      var ifError          = false
      //VALIDAR CODIGO DE COMBO
      const comboMinuscula = codigoCombo.toLowerCase();
      if(!comboMinuscula.startsWith(`${me.letraCombo}-`)){
        problema = "Problema con el combo, formato incorrecto del combo"
        ifError = true;
      }
      me.totalCodigosReal  = me.totalCodigosReal + arrayHijos.length;  me.generateFormato(codigoCombo,arrayHijos);
      if(ifError){ me.setErrorsCombos(codigoCombo,problema,arrayHijos) }
    },
    generateFormato(codigoCombo,codigosHijos){
      let me = this;
      console.log("codigosHijos", codigosHijos)
      //2 codigos
      var getcodigos = []
      //ifOnlyCode 0 = activación-diagnóstica , 1 = diagnóstica-activación , 2 = activación
      //4 = paquetes y activación-diagnóstico , 5 = paquetes y solo activación
      if(me.ifOnlyCode == 0 || me.ifOnlyCode == 1 || me.ifOnlyCode == 4)  { getcodigos = me.formatoHijos(codigoCombo,codigosHijos) }
      else                                          {
        //en paquetes y activación(5) primero se expanden los paquetes a sus códigos de activación
        getcodigos = (me.ifOnlyCode == 5) ? me.expandirPaquetesSoloActivacion(codigosHijos) : codigosHijos
        //buscar el codigo de activacion en arraycodigosEncontrados donde la propiedad  codigo coincide y traer la propiedad codigo_liquidacion
        me.arrayCodigosEncontrados.forEach(item => {
          const encontrado = getcodigos.find(codigo => codigo.codigo == item.codigo);
          if (encontrado) {
            encontrado.codigo_liquidacion = item.codigo_liquidacion;
          }
        });
      }
      var cal                                       = new Object
      cal.codigoCombo                               = codigoCombo
      cal.codigosHijos                              = getcodigos
      me.arregloFormatoSend.push(cal)
      me.f_setearLibroRegalados()
    },
    // formatoHijos(codigoCombo,codigosHijos){
    //   console.log("codigoCombo", codigoCombo)
    //   console.log("codigosHijos", codigosHijos)
    //   let me = this;
    //   var arregloSetear       = []
    //   var arrayCodigosErrores = []
    //   codigosHijos.forEach(element => {
    //     var obj = new Object();
    //     obj.codigo = element.codigo
    //     arregloSetear.push(obj)
    //   });
    //   var preValores      = []
    //   var codigosMostrar  = []
    //   preValores          = arregloSetear
    //   var getLongitud     = arregloSetear.length
    //   var longitud        = getLongitud/2
    //   for(var i = 0; i<longitud;i++){
    //     // Creamos un nuevo array para almacenar los objetos quitados
    //     const nuevoArray        = [];
    //     var problemaCodigos     = [];
    //     let   codigoActivacion  = "";
    //     let   codigoDiagnostico = "";
    //     // Quitamos los dos primeros objetos del array original y los agregamos al nuevo array
    //     nuevoArray.push(preValores.splice(0, 2));
    //     var setear = nuevoArray.flat()
    //     if(setear.length == 1){
    //       var cal = new Object
    //       //ACTIVACION - DIAGNOSTICO)
    //       if(me.ifOnlyCode == 0){
    //         cal.codigoActivacion =  setear[0].codigo
    //         cal.codigoDiagnostico  =  ""
    //       }
    //       //DIAGNOSTICO - ACTIVACION)
    //       if(me.ifOnlyCode == 1){
    //         cal.codigoDiagnostico =  setear[0].codigo
    //         cal.codigoActivacion  =  ""
    //       }
    //       cal.problema          =  'formato'
    //       problemaCodigos.push(cal)
    //       arrayCodigosErrores.push(problemaCodigos)
    //     }else{
    //      //ACTIVACION - DIAGNOSTICO)
    //      if(me.ifOnlyCode == 0){
    //         codigoActivacion      = setear[0].codigo;
    //         codigoDiagnostico     = setear[1].codigo
    //       }
    //       //DIAGNOSTICO - ACTIVACION)
    //       if(me.ifOnlyCode == 1){
    //         codigoDiagnostico     = setear[0].codigo
    //         codigoActivacion      = setear[1].codigo;
    //       }
    //       var cal = new Object
    //       cal.codigoActivacion  =  codigoActivacion
    //       cal.codigoDiagnostico =  codigoDiagnostico
    //       codigosMostrar.push(cal)
    //       //VALIDACION
    //       var codigosErrores     = me.validacionErrores(codigoActivacion,codigoDiagnostico)
    //       if(codigosErrores.length > 0){
    //         //si existe errores de formato de los codigos hijos cambio para que se pueda mostrar
    //         me.onlyCodes = 0
    //         arrayCodigosErrores.push(codigosErrores)
    //       }
    //     }//fin else
    //   }//fin for
    //   //enviar errores
    //   if(arrayCodigosErrores.length > 0){
    //     me.setErrorsCombos(codigoCombo,"Problema en el formato de los codigos hijos",arrayCodigosErrores)
    //   }
    //   return codigosMostrar
    // },

    //ifOnlyCode 5: el excel trae combos, paquetes y codigos de activacion sueltos.
    //Los paquetes se reemplazan por sus codigos de activacion (sin emparejar con el diagnostico),
    //el codigo de union lo resuelve el backend leyendo la base por cada codigo.
    expandirPaquetesSoloActivacion(codigosHijos) {
      let me = this;
      let codigosProcesados = [];
      codigosHijos.forEach((item) => {
        const codigo = item.codigo;
        if (codigo.toLowerCase().startsWith(`${me.letraPaquete.toLowerCase()}-`)) {
          const codigosDelPaquete = me.arrayCodigosEncontradosSueltos.filter(
            (libro) => libro.codigo_paquete == codigo
          );
          if (codigosDelPaquete.length === 0) {
            console.warn(`⚠️ No se encontraron códigos para el paquete: ${codigo}`);
          }
          codigosDelPaquete.forEach((libro) => {
            codigosProcesados.push({ codigo: libro.codigo });
          });
        } else {
          codigosProcesados.push({ codigo });
        }
      });
      return codigosProcesados;
    },

    formatoHijos(codigoCombo, codigosHijos) {

      let me = this;
      let arregloSetear = [];
      let arrayCodigosErrores = [];

      // 1. Expandir paquetes SOLO si ifOnlyCode == 4
      let codigosProcesados = [];

      if (me.ifOnlyCode == 4) {
        codigosHijos.forEach((item) => {
          const codigo = item.codigo;
          if (codigo.toLowerCase().startsWith(`${me.letraPaquete.toLowerCase()}-`)) {
            const codigosDelPaquete = me.arrayCodigosEncontradosSueltos.filter(
              (libro) => libro.codigo_paquete == codigo
            );

            // Si no se encuentra el paquete, puedes validar y lanzar error aquí si deseas
            if (codigosDelPaquete.length === 0) {
              console.warn(`⚠️ No se encontraron códigos para el paquete: ${codigo}`);
            }

            codigosDelPaquete.forEach((libro) => {
              codigosProcesados.push({ codigo: libro.codigo });
              codigosProcesados.push({ codigo: libro.codigo_union });
            });
          } else {
            codigosProcesados.push({ codigo });
          }
        });
      } else {
        // Caso normal, sin expansión
        codigosProcesados = codigosHijos.map(c => ({ codigo: c.codigo }));
      }


      // 2. Preparar arregloSetear
      codigosProcesados.forEach(element => {
        var obj = new Object();
        obj.codigo = element.codigo;
        arregloSetear.push(obj);
      });

      var preValores = arregloSetear;
      var codigosMostrar = [];
      var getLongitud = arregloSetear.length;
      var longitud = getLongitud / 2;
      for (var i = 0; i < longitud; i++) {
        const nuevoArray = [];
        var problemaCodigos = [];
        let codigoActivacion = "";
        let codigoDiagnostico = "";

        // Tomar de a 2 elementos
        nuevoArray.push(preValores.splice(0, 2));
        var setear = nuevoArray.flat();

        if (setear.length == 1) {
          var cal = new Object();
          if (me.ifOnlyCode == 0) {
            cal.codigoActivacion = setear[0].codigo;
            cal.codigoDiagnostico = "";
          }
          if (me.ifOnlyCode == 1) {
            cal.codigoDiagnostico = setear[0].codigo;
            cal.codigoActivacion = "";
          }
          cal.problema = 'formato';
          problemaCodigos.push(cal);
          arrayCodigosErrores.push(problemaCodigos);
        } else {
          if (me.ifOnlyCode == 0 || me.ifOnlyCode == 4) {
            codigoActivacion = setear[0].codigo;
            codigoDiagnostico = setear[1].codigo;
          }
          if (me.ifOnlyCode == 1) {
            codigoDiagnostico = setear[0].codigo;
            codigoActivacion = setear[1].codigo;
          }

          var cal = new Object();
          cal.codigoActivacion = codigoActivacion;
          cal.codigoDiagnostico = codigoDiagnostico;
          codigosMostrar.push(cal);
          // Validación
          var codigosErrores = me.validacionErrores(codigoActivacion, codigoDiagnostico);
          if (codigosErrores.length > 0) {
            me.onlyCodes = 0;
            arrayCodigosErrores.push(codigosErrores);
          }
        }
      }
      // Enviar errores si hay
      if (arrayCodigosErrores.length > 0) {
        me.setErrorsCombos(codigoCombo, "Problema en el formato de los códigos hijos", arrayCodigosErrores);
      }
      //buscar el codigo de activacion en arraycodigosEncontrados donde la propiedad  codigo coincide y traer la propiedad codigo_liquidacion
      me.arrayCodigosEncontrados.forEach(item => {
        const encontrado = codigosMostrar.find(codigo => codigo.codigoActivacion == item.codigo);
        if (encontrado) {
          encontrado.codigo_liquidacion = item.codigo_liquidacion;
        }
      });
      return codigosMostrar;
    },


    f_setearLibroRegalados(){
      let me = this
      me.arregloFormatoSend.forEach(element => {
        element.codigosHijos.forEach(item => {
          item.libroSeleccionado = 0
          item.tipoRegalado = 0
        })
      })
      if(me.arrayLibrosSeleccionados.length == 0){
        return
      }
      // Primero, filtrar los libros que empiezan con codigoEmpieza
      const librosFiltrados = me.arrayLibrosSeleccionados.map(libro => {
        return libro.codigo_liquidacion.toUpperCase();
      });

      // Luego, recorrer arregloFormatoSend y actualizar los codigosHijos
      me.arregloFormatoSend.forEach(element => {
        element.codigosHijos.forEach(item => {
          let preCodigo = item.codigo_liquidacion;
          // // ifOnlyCode 0 = activación-diagnóstica , 1 = diagnóstica-activación , 2 = activación
          // if (me.ifOnlyCode == 2) {
          //   preCodigo = item.codigo.toUpperCase();  // Cambié "item.codigo" por "item.codigoActivacion" si corresponde
          // } else {
          //   preCodigo = item.codigoActivacion.toUpperCase();
          // }

          // Ahora revisamos si alguno de los códigos de los libros filtrados inicia con preCodigo
          if (librosFiltrados.some(codigoEmpieza => preCodigo.startsWith(codigoEmpieza))) {
            item.libroSeleccionado = 1;
            item.tipoRegalado = me.tipoRegalado;
          } else {
            item.libroSeleccionado = 0;
            item.tipoRegalado = 0;
          }
        });
      });
    },


    validacionErrores(codigoActivacion,codigoDiagnostico){
      let me = this
      var problemaCodigos = []
      //en paquetes(ifOnlyCode 4) los codigos los trae el sistema de la base: si el codigo de
      //activacion no tiene codigo de union no es un error de formato, solo se valida la activacion
      const sinUnion = (me.ifOnlyCode == 4 && (codigoDiagnostico === null || codigoDiagnostico === undefined || codigoDiagnostico === ''))
      //============ACTIVACION==================================
      //VALIDACION SI NO SON STRING
      if (typeof codigoActivacion !== 'string' || (!sinUnion && typeof codigoDiagnostico !== 'string') ) {
        var cal = new Object
        cal.codigoActivacion  =  codigoActivacion
        cal.codigoDiagnostico =  codigoDiagnostico
        cal.problema          =  'formato'
        problemaCodigos.push(cal)
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
            problemaCodigos.push(cal)
          }
        }
        //=============DIAGNOSTICO===================================
        //si el codigo no tiene pareja no hay diagnostico que validar
        if(!sinUnion){
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
              problemaCodigos.push(cal)
            }
          }
          //diferente a meñique
          else{
            if(!diagnosticoMinuscula.startsWith("p")){
              var cal = new Object
              cal.codigoActivacion  =  codigoActivacion
              cal.codigoDiagnostico =  codigoDiagnostico
              cal.problema          =  'diagnostico'
              problemaCodigos.push(cal)
            }
          }
        }
      }
      return problemaCodigos
    },
    setErrorsCombos(codigoCombo,problema,codigosErrores,combos=[]){
      let me                = this
      var cal               = new Object
      cal.codigoCombo       = codigoCombo
      cal.problema          = problema
      cal.codigosHijos      = codigosErrores.flat(10)
      cal.setcombos         = combos
      me.arregloProblemasCombo.push(cal)
    },

    procesarPagos(){
      let me = this
      if(me.totalCodigosReal == 0){
        me.$vs.notify({
          text:'No hay codigos para procesar',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'})
        return
      }
      me.$vs.loading()
      let json_pagos = JSON.stringify(me.arregloFormatoSend)
      let formData = new FormData();
      formData.append('data_codigos',     json_pagos);
      formData.append('id_usuario',       me.usuario.idusuario);
      formData.append('periodo_id',       localStorage.periodo_id);
      var url = ""
      //Varias codigos
      if( me.ifOnlyCode == 0 || me.ifOnlyCode == 1 || me.ifOnlyCode == 3 || me.ifOnlyCode == 4) {  formData.append('varios_codigos','1') }
      //un solo codigo (2 = activacion suelta; 5 = paquetes y activacion)
      if(me.ifOnlyCode == 2 || me.ifOnlyCode == 5) {  formData.append('varios_codigos','0')  }
      //en paquetes los codigos los trae el sistema de la base: se permite asignar los que no tienen codigo de union
      if(me.ifOnlyCode == 4 || me.ifOnlyCode == 5) {  formData.append('permitir_sin_union','1')  }
      url = this.$server_url+'guardarAsignacionCodigo'
      this.$http.post(url, formData)
      .then(res => {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
          }
          me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.modalConfirm                           = false
          me.tableData                              = []
          me.codigosPerdidos                        = true
          me.arregloResumen                         = res.data.arregloResumen
          me.codigoConProblemas                     = res.data.codigoConProblemas
          me.arregloErroresCombos                   = res.data.arregloErroresCombos
      })
      .catch(function (error) {
        me.$vs.loading.close();
        me.$vs.notify({
        text:'Verifique que la información se haya guardado correctamente.',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-alert-triangle'})
      });
    },
    f_busquedaCodigos(){
      let me = this
      me.CodigosNoEncontrados                     = [];
      me.arrayCodigosEncontrados                  = [];
      me.arrayLibros                              = [];
      let json_pagos                              = ""
      //mayuscula
      me.tableData.forEach(codigo => {
        codigo.codigo = codigo.codigo.toUpperCase()
      })
      let filteredArray;  // Declaración fuera de los bloques if
      // Excluir códigos que empiezan con letraCombo
      if (me.ifOnlyCode == 0 || me.ifOnlyCode == 1 || me.ifOnlyCode == 2) {
        filteredArray = me.tableData.filter(obj => !obj.codigo.toLowerCase().startsWith(`${me.letraCombo}-`));
      }
      // En combos que solo incluya combos
      else if (me.ifOnlyCode == 3) {
        filteredArray = me.tableData.filter(obj => obj.codigo.toLowerCase().startsWith(`${me.letraCombo}-`));
      }
      // en paquetes y sueltos excluir la letraCombo y letrapaquete
      else if (me.ifOnlyCode == 4 || me.ifOnlyCode == 5) {
        filteredArray = me.tableData.filter(obj => !obj.codigo.toLowerCase().startsWith(`${me.letraCombo}-`) && !obj.codigo.toLowerCase().startsWith(`${me.letraPaquete}-`));
      }

      // CASO ifOnlyCode == 4 y 5: si el Excel SOLO tiene CMB- y PAQ- (sin códigos sueltos individuales),
      // filteredArray queda vacío. Los códigos individuales ya fueron obtenidos en
      // f_validatePaquetesSueltos() y están en arrayCodigosEncontradosSueltos → usarlos directamente.
      if ((me.ifOnlyCode == 4 || me.ifOnlyCode == 5) && filteredArray.length === 0) {
        if (me.arrayCodigosEncontradosSueltos.length === 0) {
          me.$vs.notify({ text: 'No se encontraron códigos en los paquetes.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        me.arrayCodigosEncontrados = [...me.arrayCodigosEncontradosSueltos]
        // Agrupar libros únicos
        let result = []
        let map = new Map()
        for (const item of me.arrayCodigosEncontrados) {
          if (!map.has(item.codigo_liquidacion)) {
            map.set(item.codigo_liquidacion, true)
            result.push({ codigo_liquidacion: item.codigo_liquidacion, nombrelibro: item.nombrelibro })
          }
        }
        me.arrayLibros = result
        me.validateCodigosCombos()
        return
      }

      json_pagos = JSON.stringify(filteredArray);

      let formData = new FormData();
      formData.append('data_codigos',             json_pagos);
      formData.append('mostrarSoloCodigos',       1)
      if (me.ifOnlyCode == 0 || me.ifOnlyCode == 1 || me.ifOnlyCode == 2 || me.ifOnlyCode == 4 || me.ifOnlyCode == 5) {
        formData.append('getPrevisualizarCodigos',  '1')
      }
      if(me.ifOnlyCode == 3){
        formData.append('getPrevisualizarPaquetes',  '1')
        formData.append('mostrarCombos',             '1')
        formData.append('agrupadoCombos',            '1')
      }

      me.$http.post(me.$server_url+'metodosPostCodigos', formData)
      .then(res => {
        if(res.data.status == 0){
          me.m_message(res.data.message)
          return
        }
        if(res.data.no_encontrados.length > 0){
          //agregar la propiedad codigo a cada elemento de res.data.no_encontrados
          me.CodigosNoEncontrados             = res.data.no_encontrados.map(codigo => ({ codigo: codigo }))
        }
        if(res.data.encontrados.length > 0){
          me.arrayCodigosEncontrados = res.data.encontrados
          if(me.ifOnlyCode == 3){
            me.totalCodigosReal   = me.arrayCodigosEncontrados.length
            me.arregloFormatoSend = res.data.arrayAgrupadosCombos
            me.arrayCombos        = res.data.arrayAgrupadosCombos
            me.f_setearLibroRegalados()
          }
          //si no se encontraron codigos en el array de codigosEncontrados
          if(me.arrayCodigosEncontrados.length == 0){
            me.$vs.notify({ text:'Ningun código se encuentra en la base de datos', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
            return
          }
          // si es paquetes y sueltos unir los arrayCodigosEncontradosSueltos con arrayCodigosEncontrados con spread
          // if(me.ifOnlyCode == 4){
          //   me.arrayCodigosEncontrados = [...me.arrayCodigosEncontrados, ...me.arrayCodigosEncontradosSueltos]
          // }
          if (me.ifOnlyCode == 4 || me.ifOnlyCode == 5) {
            me.arrayCodigosEncontrados = [
              ...new Set([
                ...me.arrayCodigosEncontrados,
                ...me.arrayCodigosEncontradosSueltos
              ])
            ]
          }
          //agrupar por codigo_liquidacion y nombrelibro
          let result = []
          let map = new Map()
          for (const item of me.arrayCodigosEncontrados) {
            if(!map.has(item.codigo_liquidacion)){
              map.set(item.codigo_liquidacion, true);    // set any value to Map
              result.push({
                codigo_liquidacion: item.codigo_liquidacion,
                nombrelibro: item.nombrelibro,
              });
            }
          }
          me.arrayLibros = result;
          if(me.ifOnlyCode != 3){
            me.validateCodigosCombos()
          }
        }
      })
      .catch(error => {
        console.log(error)
        me.$vs.loading.close()
        me.limpiarData()
        me.m_message("Ocurrio un error al agrupar los codigos"+error,'danger')
        me.popupConfirmTipoImportado = false
      })
    },
    openConfirm(tipo) {
      let me = this
      me.arrayErroresNivel = []
      if(me.arrayCombos.length == 0){
        me.m_message("No hay combos para subir",'danger')
        return
      }
      if(me.tableData.length > 1500){
        me.$vs.notify({ text:'No puedes subir mas de 1500 codigos', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
        me.limpiarData()
        me.popupConfirmTipoImportado = false
        return
      }
      //si el primero codigo no empieza por paq- o PAQ- mostrar mensaje el archivo contiene codigos y se esta subiendo en el modulo para paquetes revise por favor
      if(me.tableData[0].codigo.startsWith('paq-') && me.tableData[0].codigo.startsWith('PAQ-')){
        me.$vs.notify({ text:'El archivo contiene paquetes corrija por favor.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
        me.limpiarData()
        return
      }
      if(!me.tableData[0].codigo){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        me.limpiarData()
        return
      }
      //si tipoRegalado es 1 y 2  y arrayLibrosSeleccionados.length == 0  debe seleccionar un libro
      if((me.tipoRegalado == 1 || me.tipoRegalado == 2) && me.arrayLibrosSeleccionados.length == 0){
        me.$vs.notify({ text:'Debe seleccionar un libro para regalar o bloquear.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }

       // validacion si existen errores de nivel en los combos
      // me.arregloFormatoSend.forEach(element => {
      //   element.codigosHijos.forEach(item => {
      //     let dataCodigo = me.arrayCodigosEncontrados.find(
      //       codigoEncontrado => codigoEncontrado.codigo == item.codigoActivacion
      //     );

      //     if (dataCodigo) {
      //       item.year = dataCodigo.year;
      //       item.id_serie = dataCodigo.id_serie;
      //       item.nombrelibro = dataCodigo.nombrelibro;
      //     } else {
      //       item.year = null;
      //       item.id_serie = null;
      //       item.nombrelibro = null;
      //     }
      //   });

      //   // 🔎 Validación de años en los hijos
      //   let hijosValidos = element.codigosHijos.filter(hijo => hijo.id_serie != 6); // solo los que NO son serie 6
      //   let years = [...new Set(hijosValidos.map(hijo => hijo.year))]; // obtener years únicos

      //   if (years.length > 1) {
      //     element.errorNivel = 1;  // marcar error
      //   } else {
      //     element.errorNivel = 0;  // no hay error
      //   }
      // });
      // me.arrayErroresNivel = me.arregloFormatoSend.filter(item => item.errorNivel === 1);
      // if(me.arrayErroresNivel.length > 0){
      //   me.$vs.notify({ text:'Existen combos con libros de diferentes años, por favor verifique.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:8000 })
      //   me.popupMostrarErroresNivel = true
      //   return
      // }
      me.f_validateCodigos()
    },
    f_validateCodigos() {
      let me = this;

      me.arrayCodigosProblemas = [];
      me.contadorCodigosProblemas = 0;
      me.ifMostrarRadioBloqueado = false
      me.IfpermitirBloqueado = 0
      console.log("arrayCodigosEncontradosone", me.arrayCodigosEncontrados)
      // Mapear y asignar codigoComboAIngresar
      const result = me.arrayCodigosEncontrados.map(item => {
        const parent = me.arregloFormatoSend.find(parent =>
          parent.codigosHijos.some(hijo => hijo.codigoActivacion === item.codigo)
        );

        return {
          ...item,
          codigoComboAIngresar: parent ? parent.codigoCombo : 0 // Asignar el codigoCombo o 0 si no existe
        };
      });
      // Validaciones
      result.forEach(item => {
        // Validar si tiene codigo_paquete
         item.errorPaquete = 0;
        // if(me.ifOnlyCode !=4){
        //   item.errorPaquete = item.codigo_paquete ? 1 : 0;
        // }else{
        //   item.errorPaquete = 0;
        // }

        // Validar y comparar codigo_combo
        if (item.codigo_combo) {
          item.comboIgual = item.codigo_combo == item.codigoComboAIngresar ? 1 : 0;
          item.comboDiferente = 1 - item.comboIgual; // Evitar redundancia
        } else {
          item.comboIgual = 0;
          item.comboDiferente = 0;
        }
        //validacion codigo liquidado
        if(item.estado_liquidacion == '0'){
          item.errorIndividual = 1
          item.nombreError = ' El código se encuentra liquidado'
          return
        }
        //validacion codigo regalado liquidado
        if(item.estado_liquidacion == '2' && item.liquidado_regalado == '1'){
          item.errorIndividual = 1
          item.nombreError = ' El código se encuentra regalado y se encuentra liquidado'
          return
        }
        //validacion si el codigo esta bloqueado
        if(item.estado == '2' && item.estado_liquidacion != '3'){
          item.errorIndividual = 1
          item.nombreError = 'El código se encuentra bloqueado'
          me.ifMostrarRadioBloqueado = true
          return
        }
        //validacion si codigo es guia
        if(item.estado_liquidacion == '4'){
          item.errorIndividual = 1
          item.nombreError = ' El código se encuentra como guia'
          return
        }
      });

      // Actualizar arrayCodigosEncontrados
      me.arrayCodigosEncontrados = result;
      // Filtrar códigos con problemas y contarlos
      me.arrayCodigosProblemas = me.arrayCodigosEncontrados.filter(
        item => item.errorPaquete === 1 || item.comboDiferente === 1 || item.comboIgual === 1 || item.errorIndividual === 1
      );
      me.arrayCodigosProblemas = me.arrayCodigosEncontrados.filter(
        item => item.errorPaquete === 1 || item.comboDiferente === 1 || item.errorIndividual === 1
      );
      me.contadorCodigosProblemas = me.arrayCodigosProblemas.filter(
        item => item.errorPaquete === 1 || item.comboDiferente === 1 || item.errorIndividual === 1
      ).length;

      // Asignar mensajes de error
      me.arrayCodigosProblemas.forEach(element => {
      let errorMsg = ""; // Iniciar una variable para contener el mensaje de error completo.

      // if (element.errorPaquete === 1) {
      //   errorMsg += `El código tiene un paquete ${element.codigo_paquete}. `;
      // }
      if (element.comboDiferente === 1) {
        errorMsg += `El código tiene un combo diferente ${element.codigo_combo} `;
      }
      if (element.comboIgual === 1) {
        errorMsg += `El código tiene un combo igual ${element.codigo_combo} `;
      }

      // Concatenar si existe algún error
      if (element.errorIndividual === 1) {
        errorMsg += ` ${element.nombreError}.`;
      }

      // Asignar el mensaje completo a msgError solo si existe algún error.
      if (errorMsg) {
        element.msgError = errorMsg.trim(); // Eliminar espacios adicionales al final.
      }
    });

      // Validar errores en tableData
      me.errores = me.tableData.filter(value => !value.codigo);

      // Mostrar modal correspondiente
      me.modalErrores = me.errores.length > 0;
      me.modalConfirm = me.errores.length === 0;
    },
    limpiarData(){
      let me = this
      this.arregloResumen             = []
      this.codigoConProblemas         = []
      this.arregloErroresCombos       = []
      this.arrayLibrosSeleccionados   = []
      me.contadorCodigosProblemas     = 0
    },
    f_limpiarCancelar(){
      let me = this
      this.arregloResumen             = []
      this.codigoConProblemas         = []
      this.arregloErroresCombos       = []
      this.arrayLibrosSeleccionados   = []
      me.contadorCodigosProblemas     = 0
      me.tableData                    = []
      me.arregloProblemasCombo        = []
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
background-color: #E3AC6B;
border-radius: 5px;
color:white;
}
.td1, .th1{
padding: 10px;
text-align: center;
border:none;
}
.th2{
color:#93938F;
font-size: 10px;
background-color: #E7E7BF;
text-align: center;
padding: 8px;
border-radius: 5px;
}
.td2{
font-size: 10px;
padding: 5px;
}
.tdingreso{
border: 1px solid #f2f2f2;border-radius:5px;padding:10px;font-size:8px;
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
/*boton seleccionar libro*/
.button-33 {
  border-radius: 10px;
  background-color: #c2fbd7;
  color: green;
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
}
</style>
