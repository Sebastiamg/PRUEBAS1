<template>
    <div>
      <p class="font-bold text-2xl text-warning text-center">IMPORT DE STOCK DE GUIAS</p>
      <vs-divider></vs-divider>
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
          <h4>Está seguro de aplicar estas guias?</h4>
        </div>  
        <div class="w-full" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
        </div>
      </vs-popup>
      <vs-card>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center"  vs-align="center" vs-w="12">
              <vs-table stripe max-items="50" v-if="instituciones.length > 0" style="width: 100%;" search pagination :data="instituciones">
                  <template slot="header">
                      <div class="vx-row">
                          <div class="vx-col w-full m-3">
                              Cantidad: {{instituciones.length}}
                          </div>                   
                      </div>
                  </template>
                  <template slot="thead">
                      <vs-th sort-key="idInstitucion">#</vs-th>
                      <vs-th sort-key="nombreInstitucion">Institución (asesor)</vs-th>
                      <vs-th sort-key="nombre">Localidad</vs-th>
                      <vs-th sort-key="nombre">Estado Periodo</vs-th>
                      <vs-th sort-key="nombre">Accion</vs-th>
                  </template>
                  <template slot-scope="{data}">
                      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].idInstitucion ">
                              {{data[indextr].idInstitucion }}
                          </vs-td>
                          <vs-td :data="data[indextr].nombreInstitucion">
                            {{data[indextr].nombreInstitucion}}<br>
                            <div v-if="data[indextr].nombre_asesor == null &&  data[indextr].apellido_asesor == null">
                                <small> <i style="color:red;">No existe asesor </i></small><br>     
                            </div>
                            <div v-else>
                                <small> <i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}} </i></small><br>
                            </div>
                            <small>{{data[indextr].fecha_registro}} </small>
                          </vs-td>
                          <vs-td :data="data[indextr].nombreregion">
                              {{data[indextr].nombreregion}} <br>
                              <small>{{data[indextr].ciudad}}</small>
                          </vs-td>
                          <vs-td>
                            <small class="" >{{ tr.periodo }}</small><br>
                            <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                            <vs-chip v-else color="danger" style="margin-left:-5px;">{{ tr.estadoPeriodo }}</vs-chip>
                          </vs-td>
                          <vs-td>
                              <vs-button type="relief" @click="asignarInstitucion(tr)">Asignar Institucion</vs-button>
                          </vs-td> 
                      </vs-tr>
                  </template>
              </vs-table> 
          </vs-col>
        </vs-row> 
        <div class="mb-6 mt-5" align="center">
          <div class="vx-col w-full">
            <p style="color:#369DDA;">
              <i class="fa fa-file" aria-hidden="true"></i>   La cantidad que suba pasaran afectar el stock <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
            </p>
            <div v-if="nombreInstitucion.length > 1">
              <p style="color:red;font-weight:bold;">Institucion asignada <span>{{nombreInstitucion}}</span></p>
            </div> 
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
                            <th class="th1">pro_codigo</th>
                            <th class="th1">codigoFact</th>
                            <th class="th1">cantidad</th>
                          </tr>
                          <tr>
                            <td class="td1">xxx</td>
                            <td class="td1">xxx</td>
                            <td class="td1">0</td>
                          </tr>
                      </table>
                    </div>
                  </vs-card>
                </vs-col>
              </vs-row>  
          </div>
          <!-- {{tableData}} -->
          <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
              <span>Excel cargado exitosamente. ¿Está seguro de procesar estas guias?</span><br>
          </vs-alert>
          <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 ">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)"> Importar códigos de barras </vs-button>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">    
                  <vs-alert active="true">
                      Se cambio  {{ porcentaje }} tipos de guias
                  </vs-alert>
              </vs-col>
          </vs-row>
        </div> 
      </vs-card>
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
      <!--MODAL PARA EXPORTAR A EXCEL-->
      <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
        </div>
      </vs-prompt>
    </div>
  </template>
  <script>
  import vSelect from 'vue-select'
  import ImportExcel from '../codigos/components/importExcel.vue'
  export default {
    components: {
      ImportExcel,
      vSelect
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
        codigoNoExiste:[],
        porcentaje:0,
        instituciones:[],
        busquedaInstitucion:'',
        nombreInstitucion:'',
        nombrePeriodo:'',
        institucion_id:'',
        radioRegalado:'0',
        arregloVentaEstado: [
          {
            id:0,
            name:"Seleccione el estado"
          },
          {
            id:1,
            name:"Venta directa"
          },
          {
            id:2,
            name:"Venta libre"
          },
        ],
        //variables para el export a excel
        activePrompt:false,
        codigoSelected: [],
        reportesActivo: 0,
        fileName: null,
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        cellAutoWidth: true,
        selectedFormat: 'xls',
     
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
          me.$vs.loading()
          let json_guias = JSON.stringify(me.tableData)
          let formData = new FormData();
          //tipo 1 = devolucion ; 0 = solicitud;
          formData.append('tipo',0)
          formData.append('data_guias', json_guias);
          this.$http.post(this.$server_url+'guias/cambiar', formData)
          .then(res => {
              me.$vs.loading.close()
              if(res.data.status == 0){
                  me.$vs.notify({
                  text:res.data.message,
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  return false
              }
              me.$vs.notify({
              text:'Stock procesado exitosamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
          
               me.modalConfirm = false
               me.tableData = []
               me.codigosPerdidos = true
            //   me.codigosLeidos = res.data.codigosLeidos
            //   me.codigosNoCambiados = res.data.codigosNoCambiados
            //   me.codigoNoExiste = res.data.codigoNoExiste
                 me.porcentaje = res.data.cambiados  
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
        if(!me.tableData[0].pro_codigo || !me.tableData[0].codigoFact ||  !me.tableData[0].cantidad ){
              me.$vs.loading.close()
              me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
              return
          }
        me.errores = []
        $.each(me.tableData,function(key, value){
          if( !value.pro_codigo || !value.codigoFact || !value.cantidad  ){
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
      //PARA ASIGNAR UNA INSTITUCION
       //METODOS PARA EXCEL
         //para limipiar los campos del excel
          clearFields() {
              this.fileName = ''
              this.cellAutoWidth = true
              this.selectedFormat = 'xls'
          },
          //metodo par descargar el excel
             exportToExcel() {
              let headerTitle = ['codigo','institucion estudiante','periodo estudiante',  'estudiante','cedula', 'estado','liquidacion','código de barras','bc_estado','venta estado','institucion barras','periodo barras'];
              let headerVal = ['codigo', 'nombreInstitucion','periodo','estudiante','cedula', 'codigoEstado','liquidacion','status','barrasEstado','ventaEstado','institucionBarra','periodo_barras'];  
              let codigoSelectedMayus = this.codigoSelected
              for (var i = 0; i < codigoSelectedMayus.length; i++) {
                  for (var key in codigoSelectedMayus[i]) {
                      if (typeof codigoSelectedMayus[i][key] == "string") {
                          codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                      }
                  }
              }
              import('@/vendor/Export2Excel').then(excel => {
                  const list = codigoSelectedMayus
                  const data = this.formatJson(headerVal, list)
                  excel.export_json_to_excel({
                      header: headerTitle,
                      data,
                      filename: this.fileName,
                      autoWidth: this.cellAutoWidth,
                      bookType: this.selectedFormat
                  })
                  this.clearFields()
                  this.guardarActivo = '';
                  this.generarActivo = ' ';
                  this.textAlertCant = '';
                  this.cantidad = '';
                  this.codigoSelected = [];
              })
          },
          formatJson(filterVal, jsonData) {
              return jsonData.map(v => filterVal.map(j => {
                  return v[j]
              }))
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
    background-color: #2D9ADA;
    border-radius: 5px;
    color:white;
  }
  .td1, .th1{
   padding: 10px;
   text-align: center;
   border:none;
  }
  </style>
  