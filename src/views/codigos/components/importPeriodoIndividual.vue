
<template>
  <div>
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
            <div class="vx-col sm:w-1/2 w-full">
                <span v-if="item.Id_institucion"> {{item.Id_institucion}} </span>
            </div>
              <div class="vx-col sm:w-1/2 w-full">
                <span v-if="item.comentario"> {{item.comentario}} </span>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <span v-if="item.venta_estado"> {{item.venta_estado}} </span>
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
        <h4>Está seguro de aplicar estas códigos?</h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <vs-card>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
          <div style="width:100%;display:flex;">
            <div style="width:30%;">
            <p class="ml-5">Busqueda de la usuario</p>
              <vs-input icon="search" class="mt-2 ml-5" style="width:100%;" placeholder="Search" @keyup.enter="busquedaFiltroEstudiante()"  v-model="razonBusqueda"/>
            </div>
            <div style="width:70%;margin-top:15px;">
                <ul class="flex">
                  <li>
                  <vs-radio vs-name="radios1Busqueda" class="mt-5 mt-5" style="margin-left:50px;" vs-value="email" v-model="valorBusqueda" >Email</vs-radio>
                  </li>
                  <li>
                  <vs-radio vs-name="radios1Busqueda" class="mt-5 ml-2" vs-value="cedula" v-model="valorBusqueda"  >Cedula</vs-radio>
                  </li>
                  <li>
                  <vs-radio vs-name="radios1Busqueda" class="mt-5 ml-2" vs-value="usuario" v-model="valorBusqueda"  >Usuario</vs-radio>
                  </li>
                  <li>
                     <vs-button radius color="warning" class="mt-3 ml-2" @click="busquedaFiltroEstudiante()" type="filled" icon="search"></vs-button>
                  </li>
                </ul>
            </div>
          </div>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
          <ul class="flex" style="display:flex;flex-direction: row;margin-top:30px;">
            <li class="ml-2">
            <vs-radio v-model="region" vs-name="radios1Region" @input="getPeriodos()" vs-value="1">Sierra</vs-radio>
            </li>
            <li class="ml-2">
            <vs-radio v-model="region" vs-name="radios1Region" @input="getPeriodos()" vs-value="2">Costa</vs-radio>
            </li>
            <li style="width:400px;margin-top:-10px;" class="ml-3">
              <v-select :options="periodos" :reduce="periodos => periodos" @input="periodoAsignado()" label="periodo" class="w-full" v-model="periodo.getPeriodo" />
            </li>
          </ul>
        </vs-col>
      </vs-row>
      <vs-row style="width:100%" class="mt-5">
        <vs-col vs-type="flex" style="width:100%" v-if="estudiantesCursos.length > 0" vs-justify="center"  vs-align="center" vs-w="12">
          <vs-table max-items="3"  style="width:100%"  pagination :data="estudiantesCursos">
              <template slot="thead">
                <vs-th style="width:40%;">Datos Personales</vs-th>
                <vs-th style="width:10%;">Perfil</vs-th>
                <vs-th style="width:20%;">Acciones</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    {{ tr.idusuario }}
                    <br/>
                    Nombres:
                    <br>
                    <span style="font-weight:600;  " >
                    {{ tr.nombres }} {{ tr.apellidos }}<br>
                    </span>

                    Email:
                    <br>
                    <span style=" font-weight:600; " >
                    {{ tr.email }}<br>
                    </span>

                    Cedula:
                    <br>
                    <span style="font-weight:600;  " >
                    {{ tr.cedula }}<br>
                    </span>

                    usuario:
                    <br>
                    <span style="font-weight:600;  " >
                    {{ tr.name_usuario }}<br>
                    </span>

                    Institucion:
                    <br>
                    <span  style="font-weight:600; ">
                    {{ tr.nombreInstitucion }}<br>
                    </span>
                    Cargo:
                    <br>
                    <span  style="font-weight:600; ">
                    {{ tr.cargo }}<br>
                    </span>
                    <template>
                      <div v-if="tr.estado_idEstado == 1">
                          <vs-chip color="primary">
                              <p>Activo</p>
                          </vs-chip>
                      </div>
                      <div v-else>
                        <vs-chip color="danger">
                            <p>Desactivado</p>
                        </vs-chip>
                      </div>
                    </template>
                  </vs-td>
                  <vs-td>
                    {{ tr.perfil }}
                  </vs-td>
                  <vs-td>
                      <div>
                        <vs-button line-origin="left" style="border-radius:20px;" @click="asignarUsuario(tr)" color="success" type="line">Seleccionar</vs-button>
                      </div>
                  </vs-td>
                </vs-tr>
              </template>
              </vs-table>
        </vs-col>
      </vs-row>
      <div class="mb-6 mt-5" align="center">
          <div class="vx-col w-full">
            <p style="color:#D2B61A;">
              <i class="fa fa-file" aria-hidden="true"></i>   Estos códigos se podran modificar el periodo y el id del usuario  <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
            </p>
            <div v-if="datos.usuario.length > 1">
              <p style="color:red;font-weight:bold;">Usuario asignado <span>{{datos.usuario}}</span></p>
            </div>
            <div v-if="datos.periodo.length > 1">
              <p style="color:red;font-weight:bold;">Periodo asignado <span>{{datos.periodo}}</span></p>
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
                <vs-button class="mb-2" color="primary"  type="relief" @click="openConfirm(0)">Cambiar periodo de los codigos </vs-button>
              </vs-col>
          </vs-row>
          <vs-row v-if="codigosPerdidos == true">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                  <vs-alert active="true">
                    Se actualizo  {{ porcentaje }} códigos el periodo
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
      </div>
    </vs-card>
    <vs-row v-if="codigosPerdidos == true">
        <vs-card>
          <div class="header">
            <span style="font-weight:bold;">Codigos que tienen usuario</span>
          </div>
          <vs-table multiple v-model="codigoSelected" stripe pagination max-items="25" search :data="codigosConUsuario">
            <template slot="header" class="flex">
              <p>Cantidad: {{codigosConUsuario.length }}</p>
              <vs-button color="warning" size="small" class="mt-3 ml-3" style="font-size: 16px;" @click="activePrompt=true;">Exportar</vs-button>
            </template>
            <template slot="thead">
              <vs-th sort-key="codigo">Código</vs-th>
              <vs-th sort-key="estudiante">Estudiante</vs-th>
              <vs-th sort-key="barrasEstado">Información</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].codigo">
                      <p style="font-weight:bold;">Código:</p>
                      {{ data[indextr].codigo }}
                      <p style="font-weight:bold;">Estado:</p>
                      <div v-if="tr.estado == '2'">
                          <vs-chip color="danger">Bloqueado</vs-chip>
                      </div>
                      <div v-else>
                          <vs-chip color="success">Activo</vs-chip>
                      </div>
                  </vs-td>
                  <vs-td :data="data[indextr].estudiante" >
                      <p style="font-weight:bold;">Nombres:</p>
                      <p style="font-size:12px;letter-spacing:1px;">{{ data[indextr].estudiante }}</p>
                      <p style="font-weight:bold;">Email:</p>
                      <span>
                          {{ data[indextr].email }}<br/>
                      </span>
                      <p style="font-weight:bold;">Cedula:</p>
                      <span>{{ data[indextr].cedula }}</span><br/>
                      <p style="font-weight:bold;">Institución:</p>
                      <span>{{ data[indextr].nombreInstitucion }}</span><br/>
                      <p style="font-weight:bold;">Periodo:</p>
                      <span>{{ data[indextr].periodo }}</span><br/>

                  </vs-td>
                  <vs-td :data="data[indextr].barrasEstado">
                      <p style="font-weight:bold;">Código de barras:</p>
                        <span style="font-weight: bold;" class="text-warning">{{tr.status}}</span>
                        <p style="font-weight:bold;">contador:</p>
                        <span v-if="tr.contador > 1">{{ data[indextr].contador }}</span>
                        <p style="font-weight:bold;">bc_estado:</p>
                        <span>{{tr.barrasEstado}}</span>
                        <p style="font-weight:bold;">bc_institucion:</p>
                        <span>{{tr.institucionBarra}}</span>
                        <p style="font-weight:bold;">bc_periodo:</p>
                        <span>{{tr.periodo_barras}}</span>
                        <p style="font-weight:bold;">venta_estado:</p>
                        <span>{{ data[indextr].ventaEstado }}</span>
                        <p>
                            <vs-chip color="success" v-if="tr.estado_liquidacion == '1'">
                                Por liquidarse
                            </vs-chip>
                            <vs-chip color="warning" v-else-if="tr.estado_liquidacion == '2'">
                                Regalado
                            </vs-chip>
                            <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '0'">
                                Liquidado
                            </vs-chip>
                            <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '3'">
                                DEVUELTO
                            </vs-chip>
                        </p>
                  </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </vs-card>
    </vs-row>
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
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
export default {
  components: {
    ImportExcel,
    vSelect,
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
      codigosNoCambiados:[],
      codigosConUsuario:[],
      codigoNoExiste:[],
      porcentaje:0,
      usuarioSeleccionado:'',
      razonBusqueda:'',
      valorBusqueda:'cedula',
      estudiantesCursos:[],
      region:'2',
      periodos:[],
      periodo:{
        getPeriodo:''
      },
      datos:{
        usuario:'',
        idusuario:'',
        periodo:'',
      },
      //variables para el export a excel
      activePrompt:false,
      codigoSelected: [],
      reportesActivo: 0,
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
      codigosNoExisten:[],
      cantidadNoExisten:0,
    }
  },
  created(){
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
        this.getPeriodos()
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      this.header = header
      this.tableData = results
      this.sheetName = meta.sheetName
    },
    procesarPagos(){
        let me = this
        if(me.periodo.getPeriodo == null || me.periodo.getPeriodo == undefined || me.periodo.getPeriodo == ""){
          me.$vs.notify({
          text:"Seleccione un periodo por favor",
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
        if(me.datos.idusuario == "" || me.datos.idusuario == null || me.datos.idusuario == undefined){
            me.$vs.notify({
            text:"Debe seleccionar un usuario por favor",
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false
        }
        me.$vs.loading()
        let json_pagos = JSON.stringify(me.tableData)
        let formData = new FormData();
        formData.append('data_codigos', json_pagos);
        formData.append('usuario_id', me.datos.idusuario);
        formData.append('periodo_id', me.periodo.getPeriodo.idperiodoescolar);
        formData.append('usuario_editor', me.usuario.idusuario);
        this.$http.post(this.$server_url+'codigos/import/periodo', formData)
        .then(res => {
          console.log('rr',res.data)
           me.codigosConUsuario = res.data.codigosConUsuario
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
            text:'Códigos procesados exitosamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            me.modalConfirm = false
            me.tableData = []
            me.codigosPerdidos = true
            me.codigosNoCambiados = res.data.codigosNoCambiados
            me.codigoNoExiste = res.data.codigoNoExiste

            me.porcentaje = res.data.cambiados
            me.datos.usuario = ""
            me.datos.idusuario  = ""
            me.datos.periodo = ""
            me.periodo.getPeriodo = ""
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
     busquedaFiltroEstudiante(){
      let me = this;
      me.estudiantesCursos = [];
      if(me.razonBusqueda.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading();
        //para los administradores
        this.$http.get(this.$server_url+'busquedaFiltroEstudiante?busqueda='+me.valorBusqueda+'&razonBusqueda='+me.razonBusqueda)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == '0'){
            me.$vs.notify({
            text: res.data.message,
            color:'primary',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }else{
            me.estudiantesCursos = res.data
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
    },
    getPeriodos(){
      let me = this;
      this.$http.get(this.$server_url+'periodo?porAllEstados=yes'+'&region='+me.region)
        .then(function (res) {
            me.periodos = res.data
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    asignarUsuario(tr){
       let me = this;
       me.datos.usuario = tr.name_usuario
       me.datos.idusuario  = tr.idusuario
       me.estudiantesCursos = []
    },
    periodoAsignado(){
      let me = this;
      if(me.periodo.getPeriodo == null || me.periodo.getPeriodo == undefined || me.periodo.getPeriodo == ""){
        me.$vs.notify({
        text:"Seleccione un periodo por favor",
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
      }
      me.datos.periodo = me.periodo.getPeriodo.periodoescolar
    },

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
  background-color: #E2C41A;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
