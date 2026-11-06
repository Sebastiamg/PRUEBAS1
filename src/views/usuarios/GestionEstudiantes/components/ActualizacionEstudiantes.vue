<template>
    <vx-card
    title="Actualización de estudiantes mediante cedulas"
    title-color="primary"
    subtitle="En este proceso se cambiara la institución del estudiante a la que usted importe"
    >
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
            <vs-button class="mb-2" color="danger" type="gradient" @click="cambioInstitucion='no';procesarPagos();"> Confirmar </vs-button>
            </div>
        </vs-popup>
        <div class="mb-6" align="center">
            <div class="vx-col w-full">
                <p style="color:#515BD8;">
                <i class="fa fa-file" aria-hidden="true"></i> Actualización de la institución de los estudiantes  <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
                </p>
            </div>
            <vs-divider class="mt-5">Datos</vs-divider>
            
            <TableSelectInstitucion @change="changeHandle"/>
            <import-excel :onSuccess="loadDataInTable"  class="mb-4 mt-5" />
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
            <div v-if="changeInstitucion">
                <vs-alert color="success"><i class="fa-solid fa-check"></i> Se cambiaron {{ contador }} estudiantes de institución</vs-alert>
                <vs-card v-if="cedulasNoExisten.length > 0" class="mt-3">
                    <vs-list-header icon-pack="feather" icon="icon-x-circle" color="danger" title="Cédulas no encontradas"></vs-list-header>
                    <TableUsuariosNotFoundVue :arregloEstudiantes="cedulasNoExisten"/>
                </vs-card>
                <vs-card v-if="cedulasYaPertenecen.length > 0" class="mt-3">
                    <vs-list-header icon-pack="feather" icon="icon-x-circle" color="warning" title="Cédulas que ya pertencen a esa institución"></vs-list-header>
                    <TableUsuariosNotFoundVue :arregloEstudiantes="cedulasYaPertenecen"/>
                </vs-card>
                
            </div>
            <vs-popup class="holamundo" fullscreen title="Revision, Confirmación del proceso" :active.sync="codigosPerdidos">
                <vs-card v-if="cedulasNoExisten.length>0">
                    <vs-list-header icon-pack="feather" icon="icon-x-circle" color="danger" title="Cédulas no encontradas"></vs-list-header>
                    <TableUsuariosNotFoundVue :arregloEstudiantes="cedulasNoExisten"/>
                </vs-card>  
                <vs-card>
                    <vs-list-header icon="supervisor_account" title="Estos estudiantes pertenecen a otras instituciones"></vs-list-header>
                    <TableUsuariosVue :arregloEstudiantes="estudiantesOtrasInstituciones"/>
                </vs-card>  
                <vs-card>
                    <vs-button @click="cambioInstitucion='yes';procesarPagos();" type="gradient"><i class="fa-solid fa-arrow-pointer"></i> Si, deseo cambiar la institución a estos estudiantes</vs-button>
                </vs-card> 
            </vs-popup>
        </div>
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
    </vx-card>
  </template>
  <script>
  import TableUsuariosVue from './TableUsuarios.vue'
  import TableUsuariosNotFoundVue from './TableUsuariosNotFound.vue'
  import TableSelectInstitucion from './TableSelectInstitucion.vue'
  import ImportExcel from '../../../codigos/components/importExcel.vue'
  import vSelect from 'vue-select'
  export default {
    components: {
      ImportExcel,
      vSelect,
      TableUsuariosVue,
      TableUsuariosNotFoundVue,
      TableSelectInstitucion,
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
        estudiantesOtrasInstituciones:[],
        cedulasNoExisten:[],
        cedulasYaPertenecen:[],
        institucion_id:0,
        periodo_id:0,
        statusPeriodo:0,
        error:false,
        cambioInstitucion:'no',
        changeInstitucion:false,
        contador:0,
        arregloCedulas:'',
      }
    },
    created(){
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          this.codigosPerdidos = false
      },
    methods: {
      loadDataInTable ({ results, header, meta }) {
        this.changeInstitucion = false
        this.header = header
        this.tableData = results
        this.sheetName = meta.sheetName
      },
      changeHandle(e){
        let me = this
        let valor = e.change
        if(valor == 'institucion')  me.institucion_id   = e.value
        if(valor == 'noPeriodo')    me.error            = e.value
        if(valor == 'periodo')      me.statusPeriodo    = e.value
        if(valor == 'periodo_id')   me.periodo_id       = e.value
        me.changeInstitucion = false
      },
      procesarPagos(){
        let me = this
        if(me.error){
            me.$vs.notify({
            text:'La institucion no tiene periodo',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'}) 
            return false;
        }
        if(me.institucion_id <= 0){
            me.$vs.notify({
            text:'Seleccione una institución por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
        }
        if(me.statusPeriodo == 0){
            me.$vs.notify({
            text:'La institución tiene período inactivo, consulte con el administrador por favor',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
        }
        me.estudiantesOtrasInstituciones = []
        me.cedulasNoExisten = []
        me.cedulasYaPertenecen = []
        me.$vs.loading();
        let formData = new FormData();
        formData.append('user_created',         me.usuario.idusuario)
        formData.append('institucion_id',       me.institucion_id)
        formData.append('periodo_id',           me.periodo_id)   
        //este cambio de institucion es para hacer una confirmacion si hubiera estudiantes en otras institucion y se le pedira al asesor que confirme
        if(me.cambioInstitucion == 'no'){
            let json_pagos = JSON.stringify(me.tableData)
            me.arregloCedulas = json_pagos;
            formData.append('data_estudiantes', json_pagos);
        }else{
            formData.append('data_estudiantes', me.arregloCedulas);
        }
        formData.append('cambioInstitucion',    me.cambioInstitucion)
        this.$http.post(this.$server_url+'import/update/estudiante', formData)
        .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Cedulas procesadas exitosamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            me.modalConfirm = false
            me.tableData = []
            if(res.data.change == 'no'){
                me.codigosPerdidos = true     
            }else{
                me.contador = res.data.contador
                me.changeInstitucion    = true
                me.codigosPerdidos      = false
                me.cedulasYaPertenecen  = res.data.cedulasYaPertenecen
            }
            me.estudiantesOtrasInstituciones = res.data.estudiantesOtrasInstituciones
            me.cedulasNoExisten              = res.data.cedulasNoExisten
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
        //       me.$vs.loading.close()
        //       me.$vs.notify({ text:'Solo se acepta cédulas con 10 números corrijalo por favor.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        //       return
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
    background-color: #515BD8;
    border-radius: 5px;
    color:white;
  }
  .td1, .th1{
   padding: 10px;
   text-align: center;
   border:none;
  }
  </style>
  