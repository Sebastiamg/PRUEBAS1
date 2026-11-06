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
          <h4 class="mt-3 text-warning">Asignar: {{ totalCodigosReal }} códigos en {{ arrayPaquetes.length}} paquetes</h4>
          <small v-if="ifOnlyCode == '0'">Activación - Diagnóstica</small>
          <small v-if="ifOnlyCode == '1'">Diagnóstica - Activación</small>
          <small v-if="ifOnlyCode == '2'">Importación un solo código por libro</small>
        </div>
        <div class="w-full" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
        </div>
      </vs-popup>
      <div class="mb-6 mt-5" align="center">
        <div class="vx-col w-full">
          <p style="color:#369DDA;">
              <i class="fa fa-file" aria-hidden="true"></i> Importación de <b>paquetes</b> de códigos <span style="font-weight: bold;">(no ingrese más de 100 paquetes en una sola carga.)</span>
          </p>

          <!-- <p class="mt-2">
            <b>Nota.</b> Esta importación trata de asignar un código de paquete al código de activación y diagnóstico.
          </p> -->
          <p v-if="tableData.length > 0" class="text-danger" style="font-size: 18px;">
          {{ ifOnlyCode == 0 ? 'Asignará un código de PAQUETE al código de activación y diagnóstico.'
            :( ifOnlyCode == 1 ? 'Asignará un código de PAQUETE al código de diagnóstico y activación.':  'Importación de un solo código por libro si está asociado el código de diagnóstico también será afectado' )
          }}
        </p>
        </div>
        <br/>
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
        <!-- {{tableData}} -->
        <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
            <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
        </vs-alert>

        <vs-row v-if="tableData.length > 0 && tableData.length <= 2000 && arregloProblemasPaquete.length == 0" class="mt-3">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="primary"  type="relief" @click="validateCodigosPaquetes();openConfirm(0);"> Importar {{ totalCodigosReal }} códigos en {{ arrayPaquetes.length }} paquetes </vs-button>
            </vs-col>
        </vs-row>
        <div v-if="arregloProblemasPaquete.length > 0" class="ml-5" style="width:50%;">
          <vs-alert title="Archivo con inconvenientes" color="danger" active="true">
            <p class="text-center">Existe <b>códigos</b> con problemas <b class="cursor-pointer" style="background:black;color:white;padding:5px;border-radius:5px;" @click="popupProblemasDiagnostico = true;"><ion-icon name="code-outline"></ion-icon> Mostrar códigos</b>
            </p>
          </vs-alert>
        </div>
        <!--RESULTADOS-->
        <!--PAQUETES QUE NO EXISTEN-->
        <vs-row v-if="codigosPerdidos == true && arregloErroresPaquetes.length > 0">
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
        <div v-if="arregloResumen.length > 0">
          <TableResumenPaqueteVue :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend"/>
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
      <!--MODALES-->
      <!--MODAL PROBLEMAS DIAGNOSTICO-->
      <vs-popup fullscreen title="Problemas con los paquete" :active.sync="popupProblemasDiagnostico">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete" :onlyCodes="onlyCodes"/>
      </vs-popup>
       <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
      <vs-popup small title="Importación de Paquetes" :active.sync="popupConfirmTipoImportado" @close="validateCodigosPaquetes();">
        <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
        <div class="mt-4 mr-4 flex justify-center">
          <!-- <span class="mr-2">Seleccione:</span> -->
          <ul class="flex">
            <li>
              <vs-radio v-model="ifOnlyCode" vs-name="ifOnlyCode" class="mr-4" vs-value="0">Activación - Diagnóstica</vs-radio>
            </li>
            <li>
              <vs-radio v-model="ifOnlyCode" vs-name="ifOnlyCode" class="mr-2" vs-value="1">Diagnóstica - Activación</vs-radio>
            </li>
            <li>
              <vs-radio v-model="ifOnlyCode" class="ml-3" vs-name="ifOnlyCode" vs-value="2">Activación</vs-radio>
            </li>
          </ul>
        </div>
        <div class="flex justify-center mt-5">
          <vs-button color="primary" type="border" @click="validateCodigosPaquetes();popupConfirmTipoImportado=false;">Aceptar</vs-button>
        </div>
      </vs-popup>
    </div>
  </template>
  <script>
  import {
    mapState
  } from "vuex";
  const TableRadiosCodigosListaVue      = () => import('../../../components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue')
  const ImportExcel                     = () => import('../../../components/importExcel.vue')
  const TablaErroresPaqueteVue          = () => import('../../components/TablaErroresPaquete.vue')
  const TableResumenPaqueteVue          = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
  import vSelect from 'vue-select'
  export default {
    components: {
      ImportExcel,
      vSelect,
      TableRadiosCodigosListaVue,
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
        //variables para codigos union
        codigosSinCodigoUnion:[],
        popupProblemasCodigosUnion:false,
        //fin variables para codigos union
        arregloProblemasPaquete:[],
        arregloFormatoSend:[],
        totalCodigos:0,
        totalCodigosReal:0,
        popupProblemasDiagnostico:false,
        arrayPaquetes:0,
        arregloResumen:[],
        codigoConProblemas:[],
        arregloErroresPaquetes:[],
        popupConfirmTipoImportado:false,
        ifOnlyCode:0,
        onlyCodes:1,
      }
    },
    created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
    },
    computed:{
      ...mapState(["auth",'userRoot','susuario','userAsesor']),
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
        loadDataInTable ({ results, header, meta }) {
        let me                          = this
        this.codigosPerdidos            = false
        this.arregloResumen             = []
        this.codigoConProblemas         = []
        this.arregloErroresPaquetes     = []
        this.header                     = header
        this.tableData                  = results
        this.sheetName                  = meta.sheetName
        this.popupConfirmTipoImportado  = true;
        this.onlyCodes                  = 1
        // me.validateCodigosPaquetes()
        },
        async validateCodigosPaquetes(){
          try{
            let me = this
            me.arregloProblemasPaquete  = []
            me.arregloFormatoSend       = []
            me.arrayPaquetes            = 0
            me.totalCodigosReal         = 0
            me.totalCodigos             = 0
            let datos                   = []
            let preDatos                = []
            datos                       = me.tableData
            datos.map((item) => {
              let obj = new Object();
              obj.codigo = item.codigo.trim()
              preDatos.push(obj)
            })
            console.log("preDatos",preDatos)
            const arrayNormal           = JSON.parse(JSON.stringify(preDatos));
            //DE LO CONTRARIO VAMOS A VALIDAR CON LA BASE
            const objetosFiltrados      = arrayNormal.filter(objeto => objeto.codigo.toLowerCase().startsWith('paq-'));
            me.arrayPaquetes            = objetosFiltrados
            me.totalCodigos             = arrayNormal.length - me.arrayPaquetes.length
            //PROCESO
            // Crear un nuevo array resultante
            var nextPaquete = 1
            for(let i = 0; i<objetosFiltrados.length; i++){
              let nuevoArray = []
              let preArray   = []
              //tomo el siguiente paquete y valido si fuera el ultimo
              let getPosicion = objetosFiltrados[nextPaquete]
              //UNDEFINED PORQUE BUSCO EL PROXIMO PAQUETE PARA SABER QUE ES EL ULTIMO
              if(getPosicion!==undefined){
                //busco la posicion del ultimo paquete para agarrar los codigos hasta la ultima posicion del proximo paquete
                const codigoBuscado         = objetosFiltrados[nextPaquete].codigo;
                const posicionCodigoBuscado = arrayNormal.findIndex(objeto => objeto.codigo === codigoBuscado);
                nuevoArray.push(arrayNormal.splice(0, posicionCodigoBuscado));
                preArray = nuevoArray[0]
                const resultado1 = await me.ChangeArray(preArray)
              }
              //EL ULTIMO PAQUETE NO TIENE POSICION DEL ULTIMO PARQUETE PORQUE TERMINA EN CODIGO
              else{
                nuevoArray.push(arrayNormal);
                preArray = nuevoArray[0]
                const resultado2 = await me.ChangeArray(preArray)
              }
              nextPaquete++
            }
            console.log("totalCodigos",me.totalCodigos)
            console.log("totalCodigosReal",me.totalCodigosReal)
            //validar que los codigos paquetes tenga los codigos correctos
            if(me.totalCodigos != me.totalCodigosReal){
              // me.arregloProblemasPaquete = []
              // me.setErrorsPaquetes("En todos los paquetes","Hay problemas con los paquetes corrija por favor",[],me.arrayPaquetes)
            }
            if(me.arregloProblemasPaquete.length > 0){
              me.popupProblemasDiagnostico = true
            }
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
        var getCodigoPaquete = preArray.splice(0,1)
        var codigoPaquete    = getCodigoPaquete[0].codigo
        var arrayHijos       = preArray
        var ifError          = false
        //VALIDAR CODIGO DE PAQUETE
        const paqueteMinuscula = codigoPaquete.toLowerCase();
        if(!paqueteMinuscula.startsWith("paq-")){
          problema = "Problema con el paquete, formato incorrecto del paquete"
          ifError = true;
        }
        //VALIDAR LA CANTIDAD DE CODIGOS HIJOS UN SOLO CODIGO
        if(me.ifOnlyCode == 2){
          if(arrayHijos.length == 5 || arrayHijos.length == 10){ me.totalCodigosReal  = me.totalCodigosReal + arrayHijos.length;  me.generateFormato(codigoPaquete,arrayHijos); }
          else{
            problema = "Problema con el paquete, insuficiencia de códigos"
            ifError = true;
          }
        }
        //2 CODIGOS ACTIVACION Y DIAGNOSTICA o DIAGNOSTICA Y ACTIVACION
        else{
          if(arrayHijos.length == 10 || arrayHijos.length == 20 || arrayHijos.length == 2){ me.totalCodigosReal  = me.totalCodigosReal + arrayHijos.length;  me.generateFormato(codigoPaquete,arrayHijos); }
          else{
            console.log("arrayHijos",arrayHijos.length,'codigoPaquete',codigoPaquete)
            problema = "Problema con el paquete, insuficiencia de códigos"
            ifError = true;
          }
        }
        if(ifError){ me.setErrorsPaquetes(codigoPaquete,problema,arrayHijos) }
      },
      generateFormato(codigoPaquete,codigosHijos){
        let me = this;
        //2 codigos
        var getcodigos = []
        if(me.ifOnlyCode == 0 || me.ifOnlyCode == 1)  { getcodigos = me.formatoHijos(codigoPaquete,codigosHijos) }
        else                                          { getcodigos = codigosHijos }
        var cal                                       = new Object
        cal.codigoPaquete                             = codigoPaquete
        cal.codigosHijos                              = getcodigos
        me.arregloFormatoSend.push(cal)
      },
      formatoHijos(codigoPaquete,codigosHijos){
        let me = this;
        var arregloSetear       = []
        var arrayCodigosErrores = []
        codigosHijos.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo
          arregloSetear.push(obj)
        });
        var preValores      = []
        var codigosMostrar  = []
        preValores          = arregloSetear
        var getLongitud     = arregloSetear.length
        var longitud        = getLongitud/2
        for(var i = 0; i<longitud;i++){
          // Creamos un nuevo array para almacenar los objetos quitados
          const nuevoArray        = [];
          var problemaCodigos     = [];
          let   codigoActivacion  = "";
          let   codigoDiagnostico = "";
          // Quitamos los dos primeros objetos del array original y los agregamos al nuevo array
          nuevoArray.push(preValores.splice(0, 2));
          var setear = nuevoArray.flat()
          if(setear.length == 1){
            var cal = new Object
            //ACTIVACION - DIAGNOSTICO)
            if(me.ifOnlyCode == 0){
              cal.codigoActivacion =  setear[0].codigo
              cal.codigoDiagnostico  =  ""
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.ifOnlyCode == 1){
              cal.codigoDiagnostico =  setear[0].codigo
              cal.codigoActivacion  =  ""
            }
            cal.problema          =  'formato'
            problemaCodigos.push(cal)
            arrayCodigosErrores.push(problemaCodigos)
          }else{
           //ACTIVACION - DIAGNOSTICO)
           if(me.ifOnlyCode == 0){
              codigoActivacion      = setear[0].codigo;
              codigoDiagnostico     = setear[1].codigo
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.ifOnlyCode == 1){
              codigoDiagnostico     = setear[0].codigo
              codigoActivacion      = setear[1].codigo;
            }
            var cal = new Object
            cal.codigoActivacion  =  codigoActivacion
            cal.codigoDiagnostico =  codigoDiagnostico
            codigosMostrar.push(cal)
            //VALIDACION
            var codigosErrores     = me.validacionErrores(codigoActivacion,codigoDiagnostico)
            if(codigosErrores.length > 0){
              //si existe errores de formato de los codigos hijos cambio para que se pueda mostrar
              me.onlyCodes = 0
              arrayCodigosErrores.push(codigosErrores)
            }
          }//fin else
        }//fin for
        //enviar errores
        if(arrayCodigosErrores.length > 0){
          me.setErrorsPaquetes(codigoPaquete,"Problema en el formato de los codigos hijos",arrayCodigosErrores)
        }
        return codigosMostrar
      },
      validacionErrores(codigoActivacion,codigoDiagnostico){
        let me = this
        var problemaCodigos = []
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
        return problemaCodigos
      },
      setErrorsPaquetes(codigoPaquete,problema,codigosErrores,paquetes=[]){
        let me                = this
        var cal               = new Object
        cal.codigoPaquete     = codigoPaquete
        cal.problema          = problema
        cal.codigosHijos      = codigosErrores.flat(10)
        cal.setpaquetes       = paquetes
        me.arregloProblemasPaquete.push(cal)
      },
      procesarPagos(){
        let me = this
        me.$vs.loading()
        let json_pagos = JSON.stringify(me.arregloFormatoSend)
        let formData = new FormData();
        formData.append('data_codigos',     json_pagos);
        formData.append('id_usuario',       me.usuario.idusuario);
        formData.append('periodo_id',       localStorage.periodo_id);
        var url = ""
        //Varias codigos
        if( me.ifOnlyCode == 0 || me.ifOnlyCode == 1 ) {   url = this.$server_url+'paquetes/guardarPaquete' }
        //un solo codigo
        if(me.ifOnlyCode == 2) {   url = this.$server_url+'paquetes/guardarPaquete2' }
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
            me.arregloErroresPaquetes                 = res.data.arregloErroresPaquetes
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
      openConfirm(tipo) {
        let me = this
        if(me.totalCodigosReal == 0){
          me.$vs.notify({ text:'No hay codigos para procesar', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
        }
        me.tipo_selected = tipo
        if(!me.tableData[0].codigo){
              me.$vs.loading.close()
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
