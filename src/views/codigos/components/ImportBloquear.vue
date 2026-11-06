<template>
    <vs-card>
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
          <h4>Está seguro de bloquear estos {{ tableData.length }} códigos?</h4>
        </div>
        <div class="w-full" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
        </div>
      </vs-popup>
      <div class="mb-6" align="center">
        <div class="vx-col w-full">
          <p style="font-weight: 100;opacity: 0.5;" class="text-2xl">Import bloquear códigos</p>
          <vs-divider></vs-divider>
          <p style="color:#8F33D3;">
            <i class="fa fa-file" aria-hidden="true"></i>  Bloqueo de codigos  <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
          </p>
        </div>
        <!-- Textarea -->
        <vx-input-group class="mt-5">
          <template slot="prepend">
            <div class="prepend-text bg-dark">
              <span>COMENTARIO (obligatorio)</span>
            </div>
          </template>
          <vs-textarea v-model="comentario" placeholder="Escriba el motivo de bloqueo de códigos" />
        </vx-input-group>
        <!-- /Textarea -->
        <br/>
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
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
        <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
            <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
        </vs-alert>
        <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 ">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)">Bloquear códigos </vs-button>
            </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-alert active="true">
                  Se bloqueo  {{ porcentaje }} códigos
                  <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
              </vs-alert>
          </vs-col>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
            <vs-card>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                      <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                    </vs-list-item>
                </vs-list>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ codigoNoExiste.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
                    <vs-list-item :key="s" v-for="(tr, s) in codigoNoExiste" icon="check" :title="tr.codigo" >
                    </vs-list-item>
                </vs-list>
            </vs-col>
          </vs-card>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vs-card>
            <gestionCodigosLista :arregloCodigos="codigoLiquidados"/>
          </vs-card>
        </vs-row>
      </div>
      <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="20" search :data="tableData">
          <template slot="header">
            <h4>Códigos a subir {{ tableData.length }}</h4>
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
      <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
      <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
        <gestionCodigosLista :arregloCodigos="codigosSinCodigoUnion" openModal="0"/>
      </vs-popup>
    </vs-card>
  </template>
  <script>
  import gestionCodigosLista from './utils/gestionCodigosLista.vue'
  import ImportExcel from './importExcel.vue'
  import vSelect from 'vue-select'
  export default {
    components: {
      ImportExcel,
      vSelect,
      gestionCodigosLista,
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
        codigoLiquidados:[],
        codigoNoExiste:[],
        codigosNoCambiados:[],
        cantidadNoExisten:0,
        comentario:'',
        //variables para codigos union
        codigosSinCodigoUnion:[],
        popupProblemasCodigosUnion:false,
        //fin variables para codigos union
      }
    },
    created(){
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          this.codigosPerdidos = false
      },
    methods: {
      loadDataInTable ({ results, header, meta }) {
        let me                = this;
        this.header           = header
        this.tableData        = results
        this.sheetName        = meta.sheetName
        me.codigosPerdidos    = false
        me.codigosNoCambiados = []
        me.codigoNoExiste     = []
        me.codigoLiquidados   = []
      },
      procesarPagos(){
        let me = this
        let json_pagos = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_codigos',   json_pagos);
        if(me.comentario == ""){
          me.$vs.notify({
          text:'Ingrese un comentario por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.$vs.loading()
        formData.append('comentario',     me.comentario);
        formData.append('institucion_id', me.usuario.institucion_idInstitucion);
        formData.append('id_usuario',     me.usuario.idusuario);
        formData.append('periodo_id',     localStorage.periodo_id);
        this.$http.post(this.$server_url+'codigos/bloquear', formData)
        .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text:res.data.cambiados +' Códigos procesados exitosamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            me.modalConfirm = false
            me.tableData = []
            me.codigosPerdidos = true
            me.codigosNoCambiados = res.data.codigosNoCambiados
            me.codigoNoExiste     = res.data.codigoNoExiste
            me.codigoLiquidados   = res.data.codigoLiquidados
            me.porcentaje         = res.data.cambiados
            me.codigosSinCodigoUnion  = res.data.codigosSinCodigoUnion
            if(me.codigosSinCodigoUnion.length > 0){
              me.popupProblemasCodigosUnion = true
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
        me.tipo_selected = tipo
        if( !me.tableData[0].codigo){
              me.$vs.loading.close()
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
    background-color: #8F33D3;
    border-radius: 5px;
    color:white;
  }
  .td1, .th1{
   padding: 10px;
   text-align: center;
   border:none;
  }
  </style>
