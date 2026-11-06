
<template>
  <div>
    <div v-if="ifValidando">
      <Loading1Vue :title="'Espere mientras se está validando su archivo con el sistema....'"/>
    </div>
    <div v-else>
      <div class="flex justify-center">
        <div v-if="(tipoBodega == '1' || tipoBodega == '2') && arregloProblemasPaquete.length > 0" class="ml-5" style="width:50%;">
          <vs-alert title="Archivo con inconvenientes" color="danger" active="true">
            <p class="text-center">Existe <b>códigos</b> con problemas <b class="cursor-pointer" style="background:black;color:white;padding:5px;border-radius:5px;" @click="popupProblemasDiagnostico = true;"><ion-icon name="code-outline"></ion-icon> Mostrar códigos</b>
            </p>
          </vs-alert>
        </div>
      </div>
      <vs-divider></vs-divider>
      <div class="mb-6 mt-4" align="center">
        <div class="vx-col w-full">
          <p style="color:#2D9ADA;" v-if="tableData.length == 0">
            <i class="fa fa-file" aria-hidden="true"></i> Importacion de <b>paquetes</b> de códigos <span style="font-weight: bold;">(no ingrese más de 10 paquetes en una sola carga.)</span>
          </p>
        </div>
        <vs-alert v-if="tableData.length > 0" color="warning" style="height:100px;" class="mb-3 mt-2"  icon-pack="feather" icon="icon-alert-triangle">
          <p class="text-2xl font-bold text-center" v-if="tipoBodega == 1">{{ titleImportacion }}</p>
          <p class="text-2xl font-bold text-center" v-if="tipoBodega == 2">{{ titleImportacion }}</p>
          <vs-divider style="margin-top:5px;"><p class="font-bold">Paquete de: {{ cantidadPaquete/2 }} códigos</p></vs-divider>
          <span>Excel cargado exitosamente. ¿Está seguro de importar estos paquetes?</span><br>
        </vs-alert>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 210 " class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="danger"  type="relief" @click="openConfirm(0)">Importar paquetes </vs-button>
          </vs-col>
        </vs-row>
        <br/>
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
        <!--PAQUETES QUE NO EXISTEN-->
        <vs-row v-if="codigosPerdidos == true">
          <vs-card>
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
       </vs-row>
        <!--RESUMEN DE CAMBIOS-->
        <vs-row v-if="arregloResumen.length > 0">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12" >
            <vs-card>
              <div class="header">
                <p style="font-weight: bold;" class="text-2xl">Resumen de la importación: </p>
                <!--RESUMENT TOTAL CANTIDAD-->
                <div class="flex justify-center mt-4" style="font-size:10px;">
                  <ul class="features flex justify-center">
                    <li>
                      <span class="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </span>
                      <span><strong>Total Códigos Activación Importados: {{ sumaIngresadosA }} </strong></span>
                    </li>
                    <li>
                      <span class="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </span>
                      <span><strong>Total Códigos Diágnostico Importados: {{ sumaIngresadosD }} </strong></span>
                    </li>
                    <li>
                      <span class="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </span>
                      <span><strong>Total Importados: {{ sumaIngresadosA + sumaIngresadosD }} </strong></span>
                    </li>
                    <li v-if="sumaNoIngresados > 0">
                      <span class="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </span>
                      <span><strong>Códigos No ingresados: {{ sumaNoIngresados }} </strong></span>
                    </li>
                    <!--NO EXISTEN-->
                    <li v-if="sumaNoExisteA > 0">
                      <span class="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </span>
                      <span class="text-danger"><strong>Total Códigos Activación No existen: {{ sumaNoExisteA }} </strong></span>
                    </li>
                    <li v-if="sumaNoExisteD > 0">
                      <span class="icon">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </span>
                      <span class="text-danger"><strong>Total Códigos Diágnostico No existen: {{ sumaNoExisteD }} </strong></span>
                    </li>
                  </ul>
                </div>
                <!--FIN DE TOTAL DE CODIGOS-->
                <!--RESUMEN DE LA TABLA-->
                <table class="tabla">
                    <tr>
                      <th class="th1">Paquete</th>
                      <th class="th1">Problemas</th>
                      <th class="th1">Ingresados</th>
                    </tr>
                    <tr v-for="(item,key) in arregloResumen" :key="key">
                      <td class="td1" style="border: 1px solid #f2f2f2;">
                        {{item.codigoPaquete}}
                        <div class="flex justify-center mt-1">
                          <vs-chip color="danger" v-if="item.mensaje == '1'">No existe el paquete</vs-chip>
                        </div>
                      </td>
                      <vs-td height="40%" width="50%" style="border: 1px solid #f2f2f2;">
                        <div class="overflow-y-auto h-24" v-if="item.codigosHijos.length > 0">
                          <tr>
                            <th class="th2" style="font-size:10px;">Codigo activacion</th>
                            <th class="th2">Codigo</th>
                            <th class="th2">Codigo union</th>
                          </tr>
                          <tr color="primary" :key="index" v-for="(item2,index) in item.codigosHijos">
                            <td class="td2">{{ item2.codigo }}</td>
                            <td class="td2">{{ item2.codigoUnion }}</td>
                            <td class="td2">{{ item2.problema }}</td>
                          </tr>
                        </div>
                        <div>
                          <p class="text-center">No hay problemas</p>
                        </div>
                      </vs-td>
                      <vs-td class="tdingreso">
                        <ul class="features flex justify-center">
                          <li>
                            <span class="icon">
                              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                              </svg>
                            </span>
                            <span><strong>Códigos Activación Importados: {{ item.ingresoA }} </strong></span>
                          </li>
                          <li>
                            <span class="icon">
                              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                              </svg>
                            </span>
                            <span><strong>Códigos Diágnostico Importados: {{ item.ingresoD }} </strong></span>
                          </li>
                          <li>
                            <span class="icon">
                              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                              </svg>
                            </span>
                            <span><strong>Total Importados: {{ item.ingresoA+ item.ingresoD }} </strong></span>
                          </li>
                          <!--NO EXISTEN-->
                          <li v-if="item.noExisteA > 0">
                            <span class="icon">
                              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                              </svg>
                            </span>
                            <span class="text-danger"><strong>Códigos Activación No existen: {{ item.noExisteA }} </strong></span>
                          </li>
                          <li v-if="item.noExisteD > 0">
                            <span class="icon">
                              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                              </svg>
                            </span>
                            <span class="text-danger"><strong>Códigos Diágnostico No existen: {{ item.noExisteD }} </strong></span>
                          </li>
                        </ul>
                      </vs-td>
                    </tr>
                </table>
              </div>
            </vs-card>
          </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vx-card
            title="Codigos que no se pudieron guardar"
            v-if="codigoConProblemas.length > 0"
            >
            <gestionCodigosLista :arregloCodigos="codigoConProblemas" openModal="1"/>
          </vx-card>
        </vs-row>
      </div>
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
      <p class="text-2xl font-bold text-center" v-if="tipoBodega == 1">{{ titleImportacion }}</p>
      <p class="text-2xl font-bold text-center" v-if="tipoBodega == 2">{{ titleImportacion }}</p>
      <vs-divider style="margin-top:5px;"><p class="font-bold">Paquete de: {{ cantidadPaquete/2 }} códigos</p></vs-divider>
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estas códigos? en los paquetes </h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO-->
    <vs-popup fullscreen title="Problemas con los paquete" :active.sync="popupProblemasDiagnostico">
    <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete"/>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Importación de Paquetes" :active.sync="popupConfirmTipoImportado">
      <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
      <div class="mt-4 mr-4 flex justify-center">
          <span class="mr-2">Su archivo incluye un solo código:</span>
          <ul class="flex">
            <li>
              <vs-radio v-model="ifOnlyCode" vs-name="ifOnlyCode" vs-value="0">NO</vs-radio>
            </li>
            <li>
              <vs-radio v-model="ifOnlyCode" class="ml-3" vs-name="ifOnlyCode" vs-value="1">Si</vs-radio>
            </li>
          </ul>
        </div>
      <vs-divider></vs-divider>
      <div class="flex justify-center mt-2">
        <div class="mr-4">
          <span>Paquete:</span>
          <ul class="flex mt-2">
            <li>
              <vs-radio v-model="cantidadPaquete" vs-name="cantidadPaquete" vs-value="10">5</vs-radio>
            </li>
            <li>
              <vs-radio v-model="cantidadPaquete" class="ml-3" vs-name="cantidadPaquete" vs-value="20">10</vs-radio>
            </li>
          </ul>
        </div>
        <vs-button class="mr-3 mb-2 p-2" color="primary"   @click="tipoBodega= 1;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Activación - Diágnostico';preLoadCodigosIfGrafitex();" type="border"> Activación -Diágnostica</vs-button>
        <vs-button class="mr-2 mb-2 p-2" color="dark"      @click="tipoBodega= 2;popupConfirmTipoImportado=false;titleImportacion = 'Importacion Diágnostico - Activación)';preLoadCodigosIfGrafitex();" type="border"> Diágnostica -Activación</vs-button>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import gestionCodigosLista from '@/views/codigos/components/utils/gestionCodigosLista'
import ImportExcel from '@/components/excel/ImportExcel'
import vSelect from 'vue-select'
import TableProblemasDiagnosticoVue from '@/views/codigos/components/utils/TableProblemasDiagnostico'
import TablaErroresPaqueteVue from '@/views/codigos/paquetes/components/TablaErroresPaquete'
const Loading1Vue = () => import('@/views/configuracion/Reutilizable/Loading1.vue')
// import Loading1Vue from '@/views/configuracion/Reutilizable/Loading1.vue'
export default {
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    TableProblemasDiagnosticoVue,
    TablaErroresPaqueteVue,
    Loading1Vue
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
      codigosNoCambiados:[],
      arregloResumen:[],
      arregloCodigosDiagnosticoNoexisten:[],
      porcentaje:0,
      codigoConProblemas:[],
      arrayCodes:[],
      sendValores:[],
      error:false,
      permisoRoot:false,
      //VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      tipoBodega:1,
      popupProblemasDiagnostico:false,
      popupConfirmTipoImportado:false,
      contadorA:0,
      contadorD:0,
      titleImportacion:'',
      cantidadPaquete:20,
      ifOnlyCode:0,
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //VARIABLES PARA ERRORES CODIGOS PAQUETES
      arregloProblemasPaquete:[],
      arregloFormatoSend:[],
      totalCodigos:0,
      arregloErroresPaquetes:[],
      //FIN VARIABLES PARA ERRORES CODIGOS PAQUETES
      ifValidando:false,
    }
  },
  created(){
    this.usuario          = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos  = false
  },
  computed:{
    sumaIngresadosA(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosA = me.arregloResumen.filter(p => p.ingresoA)
        let resultado = datosA.reduce((a, b) => a + (b["ingresoA"] || 0), 0);
        return resultado
      }
    },
    sumaIngresadosD(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosD    = me.arregloResumen.filter(p => p.ingresoD)
        let resultado = datosD.reduce((a, b) => a + (b["ingresoD"] || 0), 0);
        return resultado
      }
    },
    sumaNoIngresados(){
      let me = this;
      if(me.arregloResumen.length > 0){
        //activacion
        let datosA = me.arregloResumen.filter(p => p.ingresoA)
        let resultadoA = datosA.reduce((a, b) => a + (b["ingresoA"] || 0), 0);
        //diagnostico
        let datosD     = me.arregloResumen.filter(p => p.ingresoD)
        let resultadoD = datosD.reduce((a, b) => a + (b["ingresoD"] || 0), 0);
        let total      = me.totalCodigos - (resultadoA + resultadoD)
        return total
      }
    },
    sumaNoExisteA(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosD    = me.arregloResumen.filter(p => p.noExisteA)
        let resultado = datosD.reduce((a, b) => a + (b["noExisteA"] || 0), 0);
        return resultado
      }
    },
    sumaNoExisteD(){
      let me = this;
      if(me.arregloResumen.length > 0){
        let datosD    = me.arregloResumen.filter(p => p.noExisteD)
        let resultado = datosD.reduce((a, b) => a + (b["noExisteD"] || 0), 0);
        return resultado
      }
    },
  },
  methods: {
    procesoPaquetes(paquete,codigoPaquete,errorCantidad){
      let me = this;
      var getPaquete = []
      paquete.forEach(element => {
        getPaquete.push(element)
      });
      //errorCantidad => 1 no hay cantidad que se debe; 0 si hay
      var codigosErrores     = []
      var ifErrsHijos        = false
      var ifErrsPaquete      = false
      var problema           = ""
      var codigosErrores     = me.validarHijosPaquete(paquete)
      if(codigosErrores.length > 0)  ifErrsHijos = true
      //si hay errores en los codigos hijos
      if (typeof codigoPaquete !== 'string' || typeof codigoPaquete !== 'string' )  ifErrsPaquete        = true
      //si pasa la validacion
      if(ifErrsPaquete == false){
        //======validar si tiene la palabra paq-====
        const paqueteMinuscula = codigoPaquete.toLowerCase();
        if(!paqueteMinuscula.startsWith("paq"))   ifErrsPaquete        = true
      }
      //problema
      if(ifErrsPaquete  && !ifErrsHijos && errorCantidad == '0')  problema = "Problema con el paquete"
      if(ifErrsPaquete  && ifErrsHijos  && errorCantidad == '0')  problema = "Problema con el paquete y códigos"
      if(!ifErrsPaquete && ifErrsHijos  && errorCantidad == '0')  problema = "Problema con los códigos"
      //codigos insuficientes
      if(errorCantidad  == '1')  problema = "Problema con el paquete, códigos insuficentes"
      //proceso
      if(ifErrsPaquete || ifErrsHijos || errorCantidad == 1){
        var cal               = new Object
        cal.codigoPaquete     =  codigoPaquete
        cal.problema          =  problema
        cal.codigosHijos      =  codigosErrores
        me.arregloProblemasPaquete.push(cal)
      }else{
        me.totalCodigos =  me.totalCodigos + getPaquete.length
        me.generateFormato(getPaquete,codigoPaquete)
      }
    },
    validarHijosPaquete(codigosHijos){
      var preValores      = []
      var problemaCodigos = []
      preValores      = codigosHijos
      let me = this;
      var getLongitud = codigosHijos.length
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
          problemaCodigos.push(cal)
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
      }//Fin FOR
      return problemaCodigos
    },
    async preLoadCodigosIfGrafitex(){
      let me = this;
      me.arrayCodes           = []
      me.sendValores          = []
      let datos               = []
      datos                   = me.tableData
      const arrayNormal       = JSON.parse(JSON.stringify(datos));
      //SI SELECCIONAN QUE TODOS TIENEN 2 CODIGOS
      if(me.ifOnlyCode == 0){
        me.sendValores  = arrayNormal
        me.validateCodigos()
        return
      }
      //loading de espera
      me.ifValidando = true
      //DE LO CONTRARIO VAMOS A VALIDAR CON LA BASE
      const objetosFiltrados = arrayNormal.filter(objeto => objeto.codigo.toLowerCase().startsWith('paq-'));
      //PROCESO
      // Crear un nuevo array resultante
      var nextPaquete = 1
      for(let i = 0; i<objetosFiltrados.length; i++){
        let nuevoArray = []
        let preArray   = []
        let getPosicion = objetosFiltrados[nextPaquete]
        //UNDEFINED PORQUE BUSCO EL PROXIMO PAQUETE
        if(getPosicion!==undefined){
          const codigoBuscado         = objetosFiltrados[nextPaquete].codigo;
          const posicionCodigoBuscado = arrayNormal.findIndex(objeto => objeto.codigo === codigoBuscado);
          nuevoArray.push(arrayNormal.splice(0, posicionCodigoBuscado));
          preArray = nuevoArray[0]
          const resultado1 = await me.ChangeArray(preArray)
          me.setearArray(resultado1.flat(10))
        }
        //EL ULTIMO PAQUETE NO TIENE POSICION DEL ULTIMO PARQUETE PORQUE TERMINA EN CODIGO
        else{
          nuevoArray.push(arrayNormal);
          preArray = nuevoArray[0]
          // me.ChangeArray(preArray)
          const resultado2 = await me.ChangeArray(preArray)
          me.setearArray(resultado2.flat(10))
        }
        nextPaquete++
      }
      me.sendValores = me.arrayCodes.flat(10)
      //loading de espera termina
      me.ifValidando = false
      me.validateCodigos()
    },
    async ChangeArray(array){
      let me = this;
      var ArraySave        = []
      var preArray         = array.flat(10)
      var getCodigoPaquete = preArray.splice(0,1)
      //agregar paquete
      ArraySave.push({ codigo: getCodigoPaquete[0].codigo } )
      // me.setearArray(getCodigoPaquete)
      var arrayHijos       = preArray
      var preValores       = []
       //quitar types NumRow
       arrayHijos.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo
          preValores.push(obj)
        });
        var getLongitud = arrayHijos.length
        var longitud    = getLongitud/2
        for(var i = 0; i<longitud+100;i++){
          const nuevoArray        = [];
          var  sendCodigosA       = []
          var sendCodigosB        = []
          var setear              = []
          let   codigoA           = "";
          let   codigoB           = "";
          nuevoArray.push(preValores.splice(0, 2));
          var setear = nuevoArray.flat()
          //====VALIDACION SI SOLO HAY UN CODIGO====
          //UN SOLO CODIGO DE CADA PAQUETE
          if(setear.length == 0) {  return ArraySave; }
          if(setear.length == 1){
            codigoA = setear[0].codigo
            const resultadoA = await me.verCodigo(codigoA,getCodigoPaquete);
            if(resultadoA == null || resultadoA == "null" || resultadoA == "" || resultadoA == 0){
              sendCodigosA = [
                { codigo: codigoA },
                { codigo: "No existe código de diagnóstico" },
              ]
              ArraySave.push(sendCodigosA)
            }else{
              //validar que el codigo no sea nulo
              sendCodigosA = [
                { codigo: codigoA },
                { codigo: resultadoA },
              ]
              ArraySave.push(sendCodigosA)
            }
          }
          //LOS DOS CODIGOS
          else{
            codigoA = setear[0].codigo
            codigoB = setear[1].codigo
            //PROCESO
            try {
              const resultadoA = await me.verCodigo(codigoA,getCodigoPaquete);
              //SI el codigo de union es nulo o vacio envio los 2 codigos
              if(resultadoA == null || resultadoA == "null" || resultadoA == ""){
                ArraySave.push(setear)
              }
              //en el caso que el codigo A tenga codigo de union y este sea diferente al que sigue coloco el codigo y el codigo de union de bd
              else{
                if(codigoB != resultadoA){
                //=====PROCESO PASA LOS CODIGOS DE AMBOS===
                  //PASAR CODIGO A Y SU CODIGO UNION
                  sendCodigosA = [
                    { codigo: codigoA },
                    { codigo: resultadoA },
                  ]
                  ArraySave.push(sendCodigosA)
                  //regreso el CODIGO B AL ARRAY
                  let sendCodigosB = []
                  sendCodigosB =      { codigo: codigoB },
                  preValores = [sendCodigosB, ...preValores];
                }else{
                  //SI AMBOS EL CODIGO SE RELACIONA CON EL CODIGO DE UNION LOS  PASO AMBOS
                  ArraySave.push(setear)
                  // me.setearArray(setear)
                }
              }
            } catch (error) {
              console.log(error)
              // Manejar el error si es necesario
            }
          }
          //FIN ELSE
        }//fin for
        return ArraySave
    },
    setearArray(preArray){
      let me = this
      let prevalue = ''
      prevalue = [...preArray]
      me.arrayCodes.push(prevalue)
    },
    async verCodigo(codigo,codigoPaquete) {
      let me = this
      try {
        const respuesta = await this.$http.get(this.$server_url+`gestionCodigos/${codigo}`)
        if(respuesta.data == 0){
          var cal               = new Object
          cal.codigoPaquete     =  codigoPaquete
          cal.problema          =  codigo +"Código no existe"
          // cal.codigosHijos      =  codigosErrores
          me.arregloProblemasPaquete.push(cal)
          return "No existe el código: "+codigo
        }else{
          const datos = respuesta.data.codigo_union;
          return datos;
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
      }
    },
    validateCodigos(){
      let me                            = this;
      try{
        me.arregloProblemasPaquete      = []
        me.arregloFormatoSend           = []
        me.totalCodigos                 = 0

        var preValores                  = []
        var cantidadXPaquete            = 0
        cantidadXPaquete                = parseInt(me.cantidadPaquete) + 1
        me.sendValores.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo
          preValores.push(obj)
        });
        preValores.map(p => {
          var nuevoArray        = [];
          var paqueteCodigos    = [];
          //Quitamos la cantidad por paquete por ejemplo 21 codigos 1 paquetes y 20 codigos
          nuevoArray.push(preValores.splice(0, cantidadXPaquete));
          //seteamos array que no haya problemas con los arrays
          var cojuntoPaquete   = nuevoArray.flat()
          var getCodigoPaquete = cojuntoPaquete.splice(0,1)
          var paqueteCodigos   = cojuntoPaquete
          var codigoPaquete    = getCodigoPaquete[0].codigo
          //validamos si nuestro paquete no contiene los codigos exactos mandar al front
          if(cojuntoPaquete.length != me.cantidadPaquete){
            me.procesoPaquetes(paqueteCodigos,codigoPaquete,1)
          }else{
            me.procesoPaquetes(paqueteCodigos,codigoPaquete,0)
          }
        })
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasPaquete.length > 0){
          me.popupProblemasDiagnostico = true
        }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    generateFormato(paqueteCodigos,codigoPaquete){
      let me = this;
      var getcodigos        = me.formatoHijos(paqueteCodigos)
      var cal               = new Object
      cal.codigoPaquete     = codigoPaquete
      cal.codigosHijos      = getcodigos
      me.arregloFormatoSend.push(cal)
    },
    formatoHijos(codigosHijos){
      let me = this;
      var preValores      = []
      var codigosMostrar  = []
      preValores          = codigosHijos
      var getLongitud     = codigosHijos.length
      var longitud        = getLongitud/2
      for(var i = 0; i<longitud;i++){
        // Creamos un nuevo array para almacenar los objetos quitados
        const nuevoArray        = [];
        let   codigoActivacion  = "";
        let   codigoDiagnostico = "";
        // Quitamos los dos primeros objetos del array original y los agregamos al nuevo array
        nuevoArray.push(preValores.splice(0, 2));
        var setear = nuevoArray.flat()
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
        var cal = new Object
        cal.codigoActivacion  =  codigoActivacion
        cal.codigoDiagnostico =  codigoDiagnostico
        codigosMostrar.push(cal)
      }
      return codigosMostrar
    },
    loadDataInTable ({ results, header, meta }) {
      let me = this;
      this.arregloResumen                     = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.codigosNoExisten                   = []
      this.codigoConProblemas                 = []
      this.arregloProblemasPaquete            = []
      this.totalCodigos                       = 0
      this.arregloFormatoSend                 = []
      this.header                             = header
      this.tableData                          = results
      me.codigosPerdidos                      = false
      this.sheetName = meta.sheetName
      this.popupConfirmTipoImportado = true;
    },
    procesarPagos(){
      let me = this
      //si escogio tipo de importacion Diagnostico
      if(me.tipoBodega == 1 || me.tipoBodega == 2){
        if(me.arregloProblemasPaquete.length > 0){
          me.$vs.notify({
          text:'Existe codigos del paquete con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      if(me.arregloFormatoSend.length == 0){
        me.$vs.notify({
        text:'Hubo problemas para subir los paquetes',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
      }
      me.$vs.loading()
      let json_pagos                          = JSON.stringify(me.arregloFormatoSend)
      let formData                            =  new FormData();
      formData.append('data_codigos',           json_pagos);
      formData.append('id_usuario',             me.usuario.idusuario);
      formData.append('tipoBodega',             me.tipoBodega)
      formData.append('periodo_id',             localStorage.periodo_id)
      formData.append('cantidadcodigosPaquete', me.cantidadPaquete)
      formData.append('totalPaquete',           me.cantidadPaquete+1)
      var url = ""
      url = this.$server_url+'paquetes/guardarPaquete'
      this.$http.post(url, formData)
      .then(res => {
        me.$vs.loading.close()
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
        me.arregloErroresPaquetes                 = res.data.arregloErroresPaquetes
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
      //IMPORTACION DISTINTA A NORMAL
        if(me.tipoBodega == '1' || me.tipoBodega == '2' && me.tableData.length > 0){
        me.validateCodigos()
      }
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
</style>
