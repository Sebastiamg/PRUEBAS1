<template>
  <div>
    <div>
      <br><br>
      <!--CODIGOS INDIVIDUALES-->
      <div v-if="filtroTipo == 0">
        <p class="text-2xl text-warning font-bold text-center" style="margin-top:-30px;">Que tipo de importación va a realizar?</p>
        <div v-if="noPaquetes == 0">
          <vs-alert color="danger" class="mt-2"><p class="text-center">!Los paquetes máximo 200 paquetes</p></vs-alert>
        </div>
        <vs-divider></vs-divider>
        <div class="flex justify-center mt-2" style="flex-wrap:wrap;">
          <vs-button class="m-3 text-white" color="primary"    @click="tipoBodega= 0;titleImportacion = 'Importacion Sticker (Activación)';validateCodigos();">Activación Sticker</vs-button>
          <vs-button class="m-3" color="success"               @click="tipoBodega= 0;titleImportacion = 'Importacion Sticker (Diágnostica)';validateCodigos();" v-if="mostrarBotonDiagnosticaSticker == 1" type="border">Diágnostica Sticker</vs-button>
          <vs-button class="m-3 text-white" color="warning"    @click="tipoBodega= 1;titleImportacion = 'Importacion Activación - Diágnostico';validateCodigos();" v-if="mostrarBotonActivacionDiagnostica == 1"> Activación -Diágnostica</vs-button>
          <vs-button class="m-3" color="dark"                  @click="tipoBodega= 2;titleImportacion = 'Importacion Diágnostico - Activación)';validateCodigos();" v-if="mostrarDiagnosticaActivacion == 1" type="border"> Diágnostica -Activación</vs-button>
          <vs-button class="m-3" color="#29BCC6"               @click="tipoBodega= 3;titleImportacion = 'Importacion Paquetes';validateCodigos();" v-if="noPaquetes == 0" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
          <vs-button class="m-3" color="#e6a676"               @click="tipoBodega= 4;titleImportacion = 'Importacion Combos Etiquetas';validateCodigos();" v-if="noCombos == 0" type="border" icon-pack="feather" icon="icon-package"> Combos Etiquetas</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Generalmix from '../../../../../../mixins/Generalmix'
export default{
  mixins:[Generalmix],
  data(){
    return{
      filtroTipo:0,
      cantidadPaquete:20,
      CodigosNoEncontrados:[],
      arrayCodigosEncontrados:[],
    }
  },
  props:{
    noPaquetes:{
      type: Number,
      default: function(){
        return 0
      }
    },
    noCombos:{
      type: Number,
      default: function(){
        return 0
      }
    },
    tableData:{
      type: Array,
      default: function(){
        return []
      }
    },
    mostrarBotonDiagnosticaSticker:{
      type: Number,
      default:1
    },
    mostrarBotonActivacionDiagnostica:{
      type: Number,
      default:1
    },
    mostrarDiagnosticaActivacion:{
      type: Number,
      default:1
    },
  },
  methods:{
    validateCodigos(){
      let me = this
      me.arrayCodigosEncontrados                 = [];
      me.CodigosNoEncontrados                    = [];
      //mayuscula
      me.tableData.forEach(codigo => {
        codigo.codigo = codigo.codigo.toUpperCase()
      })
      let json_pagos                              = []
      json_pagos                                  = JSON.stringify(me.tableData)
      let formData = new FormData();
      formData.append('data_codigos',             json_pagos);
      formData.append('mostrarSoloCodigos',       1)
      formData.append('tipoCodigo',               1)
      //codigos normales , activacion y diagnostico
      if(me.tipoBodega == 0 || me.tipoBodega == 1 || me.tipoBodega == 2){
        formData.append('getPrevisualizarCodigos',  '1')
      }
      //paquetes
      else if(me.tipoBodega == 3){
        formData.append('getPrevisualizarPaquetes', '1')
      }
      //combos
      else if(me.tipoBodega == 4){
        formData.append('getPrevisualizarPaquetes', '1')
        formData.append('mostrarCombos',            '1')
        formData.append('agrupadoCombos',           '1')
      }
      me.$http.post(me.$server_url+'metodosPostCodigos', formData)
      .then(res => {
        if(res.data.status == 0){
          me.m_message(res.data.message)
          return
        }
        let arrayAgrupadosCombos = []
        if(res.data.arrayAgrupadosCombos){
          arrayAgrupadosCombos     = res.data.arrayAgrupadosCombos
        }
        me.CodigosNoEncontrados       = res.data.no_encontrados
        me.arrayCodigosEncontrados    = res.data.encontrados
        let paquetesEncontrados       = res.data.paquetesEncontrados
        let sendData={
          CodigosNoEncontrados:me.CodigosNoEncontrados,
          arrayCodigosEncontrados:me.arrayCodigosEncontrados,
          paquetesEncontrados:paquetesEncontrados,
          arrayAgrupadosCombos: arrayAgrupadosCombos
        }
        let datos  = {
          sendtipoBodega       : me.tipoBodega,
          sendtitleImportacion : me.titleImportacion,
          sendcantidadPaquete  : me.cantidadPaquete
        }
        me.$emit('changeTipo',datos,sendData)
      })
      .catch(error => {
        console.log(error)
        me.$vs.loading.close()
        me.m_message("Ocurrio un error al agrupar los codigos"+error,'danger')
      })
    },
  }
}
</script>
