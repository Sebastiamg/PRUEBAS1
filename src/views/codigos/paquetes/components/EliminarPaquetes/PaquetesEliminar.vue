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
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estos códigos </h4>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div class="mb-6" align="center">
      <div class="vx-col w-full">
        <p style="font-weight: 100;opacity: 0.5;" class="text-2xl">Eliminar paquetes</p>      
        <!--Input para observacion-->
        <vs-input v-model="observacion" class="w-full mt-4" label="Comentario" />
        <br>
        <!--radio para elegir individual o masivo-->
        <vs-radio v-model="tipoIngreso" @input="codigosPerdidos = false;tableData = [];" vs-value="0" vs-name="tipoIngreso">Individual</vs-radio>
        <vs-radio v-model="tipoIngreso" @input="codigosPerdidos = false;tableData = [];" vs-value="1" class="ml-4" vs-name="tipoIngreso">Masivo</vs-radio>
        <vs-divider></vs-divider>
        <p v-if="validationError" class="text-center text-danger text-2xl">Algun paquete no tiene las iniciales "paq-" revise por favor</p>
        <p style="color:#D94715;">
          <i class="fa fa-file" aria-hidden="true"></i>  Eliminar paquetes <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
        </p>
      </div>

      <br/>
      <div v-if="tipoIngreso == 0">
        <div class="flex flex-col items-center justify-center">
          <div>
            <span class="text-2xl">Código del paquete</span>
            <vs-input v-model="codigoIndividual" @keydown.space="(event) => event.preventDefault()" class="mt-1" placeholder="Ingrese el código del paquete" />
          </div>
          <vs-button class="mb-2 mt-5" color="danger"  type="relief" icon="code" @click="openConfirmIndividual(0)">Eliminar paquete </vs-button>
        </div>
      </div>
      <div v-if="tipoIngreso == 1">
        <import-excel :onSuccess="loadDataInTable"  class="mb-4" />
      </div>
      <div v-if="tipoIngreso == 1">
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
      <vs-alert v-if="tableData.length > 0 && validationError == false" class="mb-3" color="danger" icon-pack="feather" icon="icon-alert-triangle">
          <span>Excel cargado exitosamente. ¿Está seguro de procesar estos paquetes</span><br>
      </vs-alert>
      <vs-row v-if="tableData.length > 0 && tableData.length <= 1500 && validationError == false">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-button class="mb-2" color="danger"  type="relief" icon="code" @click="openConfirm(0)">Eliminar paquetes </vs-button>
          </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true" class="mt-4">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true">
                Se elimino  {{ porcentaje }} paquetes
            </vs-alert>
        </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-card v-if="codigosNoExisten.length > 0">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <p>Cantidad <span>{{ codigosNoExisten.length }}</span></p>
              <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron ingresar"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoExisten" icon="check" :title="tr.codigo" >
              </vs-list-item>
            </vs-list>
          </vs-col>
        </vs-card>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vx-card
        v-if="NoEliminados.length > 0"
        title="Estos  paquetes no se pudieron eliminar"
        title-color="danger"
        >
          <TablePaquetesVue :arrayPaquetes="NoEliminados"/>
        </vx-card>
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
  </vs-card>
</template>
<script>
import vSelect from 'vue-select'
import ImportExcel from '../../../components/importExcel.vue'
const TablePaquetesVue = () => import('./TablePaquetes.vue')
export default {
  components: {
    ImportExcel,
    vSelect,
    TablePaquetesVue,
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
      NoEliminados:[],
      codigosNoExisten:[],
      libroSelect:'',
      // pruebaDiagnostica:0,
      codigosEnviar:[],
      validationError:false,
      observacion:'',
      tipoIngreso:0,
      codigoIndividual:'',
    }
  },
  created(){
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.codigosPerdidos = false
    },
  methods: {
    loadDataInTable ({ results, header, meta }) {
      let me                = this
      this.codigosPerdidos  = false
      this.header           = header
      let datos             = results
      let preValores        = []
      this.codigosEnviar    = []
      this.codigosPerdidos  = false
      this.validationError  = false
      this.NoEliminados     = []
      this.codigosNoExisten = []
      this.porcentaje       = 0
      //quitar types NumRow
      datos.forEach(element => {
        var obj = new Object();
        const validateCodigo = element.codigo.toLowerCase();
        if(validateCodigo.startsWith("paq-")){ }else{ me.validationError = true; }
        obj.codigo = element.codigo.toUpperCase().trim()
        preValores.push(obj)
      });
      if(me.validationError){
        me.$vs.notify({ text:'Algun paquete no tiene las iniciales paq revise por favor', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:5000 })
      }
      this.codigosEnviar = preValores
      this.tableData = results
      this.sheetName = meta.sheetName
    },
    procesarPagos(){
      let me = this
      if(me.observacion == ''){
        me.$vs.notify({ text:'Debe ingresar un comentario', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      let sendEnviar = []
      if(me.tipoIngreso == 0){
        //individual
        sendEnviar.push({codigo: me.codigoIndividual})
      }else{
        //masivo
        sendEnviar = me.codigosEnviar
      }
      let json_codigos = JSON.stringify(sendEnviar)
      let formData = new FormData();
      formData.append('data_codigos',      json_codigos);
      formData.append('id_usuario',        me.usuario.idusuario);
      formData.append('observacion',       "Se_elimino_el_paquete_"+me.observacion);
      formData.append('periodo_id',        localStorage.periodo_id)
      me.$vs.loading()
      this.$http.post(this.$server_url+'paquetes/eliminar', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
          text:'Verifique que la información se haya guardado correctamente.',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-triangle'})
          return
        }
        me.$vs.notify({
        text:'Códigos procesados exitosamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.modalConfirm         = false
        me.tableData = []
        me.codigosPerdidos      = true
        me.NoEliminados         = res.data.NoEliminados
        me.codigosNoExisten     = res.data.codigosNoExisten
        me.porcentaje           = res.data.porcentaje
        //si el porcentaje es mayor a 0 limpiar el input
        if(me.porcentaje > 0){
          me.codigoIndividual     = ''
        }
      })
      .catch(function (error) {
        me.$vs.notify({
        text:'Verifique que la información se haya guardado correctamente.',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-alert-triangle'})
        me.$vs.loading.close()
      })
    },
    openConfirm(tipo) {
      let me = this
      if(me.validationError){
        me.$vs.notify({ text:'Algun paquete no tiene las iniciales paq revise por favor', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
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
    openConfirmIndividual(){
      let me = this
      //validar codigo individual no tenga espacios
      if(me.codigoIndividual.includes(' ')){
        me.$vs.notify({ text:'El código del paquete no puede tener espacios', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      //validar que no este vacio
      if(me.codigoIndividual == ''){
        me.$vs.notify({ text:'El código del paquete no puede estar vacio', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      
      //validar que debe iniciar con paq- o PAQ-
      if(!me.codigoIndividual.startsWith('paq-') && !me.codigoIndividual.startsWith('PAQ-') ){
        me.$vs.notify({ text:'El código del paquete debe iniciar con paq- o PAQ-', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      me.modalConfirm = true
    },
    changeLibroSelect(e){
      let me = this;
      me.libroSelect = ''
      me.libroSelect = e
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
  background-color: #dd3b12;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
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
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}
</style>
