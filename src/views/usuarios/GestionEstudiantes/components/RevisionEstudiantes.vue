<template>
    <div>
      <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
         <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
           <div class="vx-row">
              <div class="vx-col sm:w-1/2 w-full">
                  <b>cédula</b>
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
          <h4>Está seguro de aplicar estas cédulas?</h4>
        </div>
        <div class="w-full" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
        </div>
      </vs-popup>
      <vs-card class="mb-6" align="center">
        <div class="vx-col w-full">
          <p style="color:#60E029;" class="mt-2">
            <i class="fa fa-file" aria-hidden="true"></i>  Revisión de estudiantes  <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
          </p>
          <vs-alert color="warning" class="mt-1" style="width: 50%;">
            <p style="font-size: 10px;">*Período asignado significa el periodo que le actualizo el asesor </p>
          </vs-alert>
        </div>
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
                      <th class="th1">cedula</th>
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
              <span>Excel cargado exitosamente. ¿Está seguro de procesar estas cédulas?</span><br>  
          </vs-alert>
          <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 ">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                 <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm()"> Revisar cédulas </vs-button>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
            <vs-card v-if="cedulasNoExisten.length>0">
              <vs-list-header icon-pack="feather" icon="icon-x-circle" color="danger" title="Cédulas no encontradas"></vs-list-header>
              <TableUsuariosNotFoundVue :arregloEstudiantes="cedulasNoExisten"/>
            </vs-card>  
            <vs-card>
               <vs-list-header icon="supervisor_account" title="Resultado de estudiantes"></vs-list-header>
              <TableUsuariosVue :arregloEstudiantes="informacion"/>
            </vs-card>   
          </vs-row>
      </vs-card>
      <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="20" search :data="tableData">
          <template slot="header">
            <h4>cédulas a revisar {{ tableData.length }}</h4>
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
  </template>
  <script>
  import TableUsuariosVue from './TableUsuarios.vue'
  import TableUsuariosNotFoundVue from './TableUsuariosNotFound.vue'
  import ImportExcel from '../../../codigos/components/importExcel.vue'
  import vSelect from 'vue-select'
  export default {
    components: {
      ImportExcel,
      vSelect,
      TableUsuariosVue,
      TableUsuariosNotFoundVue,
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
        modalCedulas: false,
        informacion:[],
        cedulasNoExisten:[],
        cantidadNoExisten:0,
      }
    },
    created(){
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          this.codigosPerdidos = false
      },
    methods: {
      loadDataInTable ({ results, header, meta }) {
        this.header = header
        this.tableData = results
        this.sheetName = meta.sheetName
      },
      procesarPagos(){
          let me = this
          me.informacion = []
          me.cedulasNoExisten = []
          let datosEnviar = []
          me.tableData.forEach(element => {
            let cal = new Object();
            ///quitar los espacios raros del principio si los tuviera 
            var valor         = element.cedula.toString()
            //obtener la primera letra y validar si es numero o el un caracter diferente a numero
            let validate      = valor.substring(0,1)
            var cedulaIngresa = ""
            if (isNaN(validate)) {
              // console.log("No es un número");
              cedulaIngresa = valor.slice(1)
            } else {
              //console.log("Es un número");
              cedulaIngresa = valor
            }
            cal.cedula = cedulaIngresa
            datosEnviar.push(cal)
          });
          me.$vs.loading();
          let json_pagos = JSON.stringify(datosEnviar)
          let formData = new FormData();
          formData.append('data_estudiantes', json_pagos);
          this.$http.post(this.$server_url+'import/revision/estudiante', formData)
          .then(res => {
              me.$vs.loading.close()
              me.$vs.notify({
              text:'Cedulas procesadas exitosamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
              me.modalConfirm = false
              me.tableData = []
              me.codigosPerdidos = true
              me.informacion = res.data.informacion
              me.cedulasNoExisten = res.data.cedulasNoExisten
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
        if( !me.tableData[0].cedula){
          me.$vs.loading.close()
          me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
          return
        }
        // if( me.tableData[0].cedula.toString().length > 10 || me.tableData[0].cedula.toString().length < 10 ){
        //   me.$vs.loading.close()
        //   me.$vs.notify({ text:'Solo se acepta cédulas con 10 números corrijalo por favor.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        //   return
        // }
        me.errores = []
        $.each(me.tableData,function(key, value){
          if( !value.cedula ){
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
  