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
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estos {{ arraySendCodigos.length }} códigos?</h4>
        <p class="mt-2">
          <!--TIPO ACCION AGREGAR GUIA O QUITAR GUIA-->
          <!-- <b v-if="tipoAccion == '1'">
            <span class="text-danger">Acción: Quitar guía</span>
          </b> -->
          <b v-if="tipoAccion == '0'">
            <span class="text-danger">Acción: Agregar guía</span>
          </b>
        </p>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div>
      <p class="mt-2">
        <b>Nota.</b> Esta importación tiene como objetivo asignar como guía a los códigos  <b> (No ingrese mas de 1500 códigos - SOLO SUBIR CÓDIGOS INDIVIDUALES) </b>
      </p>
      <p class="mt-2">
        <b>Nota.</b> No se asignarán guía a los códigos liquidados ni a los códigos que ya tienen guía asignada.
      </p>
      <br>
      <div  class="mt-5 flex justify-between">
        <ul class="flex">
          <li class="mr-5">
            <vs-radio v-model="tipoAccion" @input="limpiarData2();buscarCodigosForDevolucion()" vs-name="radios1tipoAccion" vs-value="0">Agregar guía</vs-radio>
          </li>
          <!-- <li class="mr-5">
            <vs-radio v-model="tipoAccion" @input="limpiarData2();buscarCodigosForDevolucion()" vs-name="radios1tipoAccion" vs-value="1">Quitar guía</vs-radio>
          </li> -->
        </ul>
      </div>
      <br>
      <div class="mb-6 mt-2" align="center">
         <!--Input para observacion-->
         <vs-input v-model="observacion" class="w-full mt-4" label="Comentario" />
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
        </ul>
        <div v-if="checkMostrarCodigosNoEncontrados && CodigosNoEncontrados.length > 0">
          <TableReutilizableVue
          :title="tipoCode + ' No encontrados'"
          :headers="[tipoCode]"
          :fieldKeys="['codigo']"
          :ifexportar="Number(1)"
          :tableData="CodigosNoEncontrados"
          />
        </div>
        <div v-if="codigosPerdidos && checkMostrarResultados">
          <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-alert active="true" style="height: 80px;" color="success">
               <p class="text-center font-bold"><i class="fa-solid fa-check"></i> Códigos asignados exitosamente. {{ porcentaje }} códigos</p>
                <p class="mt-1 text-indigo-100">Tipo importación: {{ titleImportacion }}</p>
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
      <div>
        <div v-if="codigosNoCambiados.length > 0">
          <TableReutilizableVue
          :title="'Códigos con problemas'"
          :headers="['codigo','Mensaje']"
          :fieldKeys="['codigo','mensaje']"
          :ifexportar="Number(1)"
          :tableData="codigosNoCambiados"
          />
        </div>
      </div>
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
        <vs-button class="m-3" color="primary"   @click="tipoBodega= 0;tipoCode='Códigos';titleImportacion = 'Importación Códigos';buscarCodigosForDevolucion();">Códigos</vs-button>
        <vs-button class="m-3" color="#29BCC6"   @click="tipoBodega= 1;tipoCode='Paquetes';titleImportacion = 'Importación Paquetes';buscarCodigosForDevolucion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
        <vs-button class="m-3" color="#f97998"   @click="tipoBodega= 2;tipoCode='Combos';titleImportacion = 'Importación Combos';buscarCodigosForDevolucion();" type="border" icon-pack="feather" icon="icon-package"> Combos Generados</vs-button>
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
import vSelect from 'vue-select'
import ImportExcel from "@/views/codigos/components/importExcel.vue";
const TableReutilizableVue               = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const CodigosPrefacturasPreviewVue       = () => import('@/views/codigos/prefacturas/CodigosPrefacturasPreview.vue')
export default {
  mixins:[Generalmix],
  components: {
    ImportExcel,
    vSelect,
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
      tipoAccion:'0',
      observacion:'',
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
      this.codigosNoCambiados         = []
      this.popupConfirmTipoImportado  = true;
    },
    buscarCodigosForDevolucion(){
      let me                                      = this;
      //el archivo debe tener columna codigo
      if( !me.tableData[0].codigo){
        me.$vs.loading.close()
        me.m_message("El archivo no tiene la columna codigo, por favor revise el archivo y vuelva a intentar.",'warning')
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
        // Validar si hay algún código que empieza con "paq-" o "PAQ-"
        if (me.tableData.some(item => item.codigo && item.codigo.toLowerCase().startsWith('paq-'))) {
          me.m_message("El archivo contiene paquetes, por favor suba el archivo en el modulo de paquetes.", 'warning')
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          return
        }

        if (me.tableData.some(item => item.codigo && item.codigo.toLowerCase().startsWith('cmb-'))) {
          me.m_message("El archivo contiene combos, por favor suba el archivo en el modulo de combos.", 'warning')
          me.limpiarData()
          me.popupConfirmTipoImportado = false
          return
        }
      }
      //validar codigos paquetes debe comenzar por paq- o PAQ-
      if (me.tipoBodega == 1) {
        // Validar que todos los códigos empiezan con 'paq-' o 'PAQ-'
        let valid = true;
        for (let i = 0; i < me.tableData.length; i++) {
          if (!me.tableData[i].codigo.startsWith('paq-') && !me.tableData[i].codigo.startsWith('PAQ-')) {
            valid = false;
            break; // Si encuentras uno que no cumple, puedes salir del ciclo
          }
        }

        if (!valid) {
          me.m_message("El archivo contiene códigos que no son paquetes, corrija por favor.",'warning')
          me.limpiarData();
          me.popupConfirmTipoImportado = false;
          return;
        }
      }

      //validar combos debe comenzar por cmb- o CMB-
      if (me.tipoBodega == 2) {
        // Validar que todos los códigos empiezan con 'cmb-' o 'CMB-'
        let valid = true;
        for (let i = 0; i < me.tableData.length; i++) {
          if (!me.tableData[i].codigo.startsWith('cmb-') && !me.tableData[i].codigo.startsWith('CMB-')) {
            valid = false;
            break; // Si encuentras uno que no cumple, puedes salir del ciclo
          }
        }

        if (!valid) {
          me.m_message("El archivo contiene códigos que no son combos, corrija por favor.",'warning')
          me.limpiarData();
          me.popupConfirmTipoImportado = false;
          return;
        }
      }

      //validar con codigos
      let validateCodigos = me.tableData.filter(p =>
        !('codigo' in p) || p.codigo === ""
      );
      if (validateCodigos.length > 0) {
        me.m_message("Existe codigos vacios, por favor revise el archivo y suba el archivo solo codigos individuales.",'warning')
        return
      }

      //si es tipoBodega 2 maximo 200
      if(me.tipoBodega == 1 || me.tipoBodega == 2){
        //maximo 200 paquetes
        if(me.tableData.length > 200){
          me.$vs.notify({ text:'No puedes subir mas de 200'+(me.tipoBodega == 1 ? ' paquetes' : ' combos'), color:'warning', iconPack: 'feather', icon:'icon-check'})
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
      //api post
      if(me.tipoBodega == 1){
        formData.append('getPrevisualizarPaquetes', '1')
      }
      //combos
      else if(me.tipoBodega == 2){
        formData.append('getPrevisualizarPaquetes',  '1')
        formData.append('mostrarCombos',             '1')
      }
      //codigos normales
      else{
        formData.append('getPrevisualizarCodigos',  '1')
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
        if(me.tipoBodega == 1 || me.tipoBodega == 2){
          me.arrayPaquetesEncontrados  = res.data.paquetesEncontrados
          if(res.data.paquetesEncontrados.length > 0){
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
        me.observacion = me.observacion.replace(/\s+/g, ' ').trim();

        if (!me.observacion) {
          me.$vs.notify({
            text: 'Debe ingresar una observación válida',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-check',
          });
          return;
        }

        if (me.observacion.length < 5) {
          me.$vs.notify({
            text: 'La observación debe tener al menos 5 caracteres no vacíos o consecutivos',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-check',
          });
          return;
        }
        me.checkMostrarCodigosProblemas     = false
        me.checkMostrarCodigosNoEncontrados = false
        let sendEnviar  = me.tableData
        //convertir a mayusculas las columnas codigo y combo
        sendEnviar.forEach((obj) => {
          obj.codigo     = obj.codigo.toUpperCase();
        });
        //codigos normales
        if(me.tipoBodega == 0 || me.tipoBodega == 2){
          me.arraySendCodigos.forEach(element => {
            let setdocumento = ''
            setdocumento = sendEnviar.find(p => p.codigo == element.codigo)
            if(setdocumento){
              element.codigo      = element.codigo
            }
          });
        }
        //paquetes
        if(me.tipoBodega == 1 || me.tipoBodega == 2){
            me.arraySendCodigos.forEach(element => {
            let setdocumento = ''
            setdocumento = sendEnviar.find(p => p.codigo == element.codigo_paquete)
            if(setdocumento){
              element.codigo      = element.codigo
            }
          });
        }

        let sendEnviarCodigos = me.arraySendCodigos.map(p => ({
          codigo: p.codigo,
        }));
        let formData = new FormData();
        formData.append('saveImportGuias',    1);
        formData.append('data_codigos',       JSON.stringify(sendEnviarCodigos));
        formData.append('id_usuario',         me.usuario.idusuario);
        formData.append('periodo_id',         localStorage.periodo_id);
        formData.append(
          'comentario',
          'Agregar_guia' + '_' + me.observacion
        );
        formData.append('tipo',               me.tipoAccion);
        me.$vs.loading()
        this.$http.post(this.$server_url+'metodosPostCodigos', formData)
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
  background-color: #f97998;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
