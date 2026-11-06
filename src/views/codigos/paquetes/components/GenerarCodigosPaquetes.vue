<template>
  <div>
    <vs-progress v-if="porcentaje === 100 && estadoProceso > 0" :height="8" :percent="porcentaje" color="success"></vs-progress>
    <vs-progress v-if="progressInterActivo != ''" indeterminate color="primary"></vs-progress>
    <p class="text-center text-success font-bold text-3xl" v-if="exportado == 1"><ion-icon name="star-outline"></ion-icon> Se exporto el archivo <b>{{ filename }}</b></p>
    <!--TABLA-->
    <b style="color: #0AD68C;">{{ textAlertCant }}</b>
    <!-- Selector de línea de productos -->
    <div class="mb-4">
      <label class="block mb-2 font-semibold">Línea de Producto:</label>
      <v-select
        :options="lineasProductos"
        :reduce="linea => linea"
        label="nombre"
        placeholder="--Seleccione una línea--"
        class="w-full"
        v-model="lineaSeleccionada"
      />
    </div>
    <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="arregloCodigos">
      <template slot="header">
        <div class="flex mt-5" style="flex-wrap:wrap;">
          <span class="mt-2">Cantidad:</span>
          <div>
            <vx-tooltip color="warning" text="Ingrese la cantidad de códigos que desea generar (máximo 5000)">
              <vs-input type="number" class="inputx ml-2" min="1" @keyup.enter="generarCodigos(cantidad);" style="width: 90px; text-align: center;margin-top:-3px;" v-model="cantidad" />
            </vx-tooltip>
          </div>
          <div>
            <vs-button color="primary" class="generarBoton ml-4" size="small" style="font-size: 13px;" @click="generarCodigos(cantidad);"  v-if="cantidad<=5000">Generar Códigos</vs-button>
          </div>
          <div>
            <div v-if="estadoProceso == 1 && arregloCodigos[0]" style="display:flex;">
              <vs-button color="success" size="small" class="ml-5" style="font-size: 14px;" @click="guardarCodigos(); estadoProceso = 0;">Guardar</vs-button>
              <vx-tooltip color="warning" text="Generar codigos de barras" style="margin-left:20px;border-radius:20px;">
              </vx-tooltip>
            </div>
            <vx-tooltip v-if="estadoProceso == 2" color="warning" text="Antes de exportar seleccione los codigos deseados.">
                <vs-button color="dark" size="small" class="ml-5" style="font-size: 14px;" @click="exportToExcel();">Exportar</vs-button>
            </vx-tooltip>
          </div>
          <p class="ml-4 mt-2 text-warning" style="font-size:11px;">Códigos en tabla: {{ arregloCodigos.length }}</p>
        </div>
      </template>
      <template slot="thead">
        <vs-th sort-key="codigo">Código</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].codigo">
              {{ data[indextr].codigo }}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!--MODAL-->
    <!--MODAL PROBLEMA CODIGOS-->
    <vs-popup classContent="popup-example" title="códigos que no se pudieron ingresar" :active.sync="popupProblemas">
      <vs-table multiple pagination max-items="10" search :data="codigosNoIngresados" v-if="popupProblemas">
        <template slot="header">
        </template>
        <template slot="thead">
          <vs-th sort-key="codigo">Código</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].codigo">
                {{ data[indextr].codigo }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>
  </div>
</template>
<script>
import ProfomaRespository from '@/repositories/ProformaRepository'
import vSelect from 'vue-select'
export default{
  components:{
    'v-select': vSelect,
  },
  data(){
    return{
      usuario:[],
      arregloCodigos:[],
      codigoSelected:[],
      codigosNoIngresados:[],
      cantidad:0,
      code:'',
      codigo_paquete:'',
      longitud_codigo:0,
      estadoProceso:0,
      porcentaje:0,
      progressInterActivo:0,
      textAlertCant:'',
      popupProblemas:false,
      //varaibles para exportar excel
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
      exportado:0,
      arrayEmpresa:[],
      //lineas de productos
      lineasProductos:[],
      lineaSeleccionada:null,
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.getCodigoPaquete()
    me.traerEmpresa()
    me.obtenerLineasProductos()
  },
  methods:{
    //obtener lineas de productos
    obtenerLineasProductos(){
      let me = this;
      this.$http.get(this.$server_url+'lineas-productos')
      .then(function (res) {
        me.lineasProductos = res.data;
        //seleccionar la primera línea por defecto si existe
        if(me.lineasProductos.length > 0){
          me.lineaSeleccionada = me.lineasProductos[0];
        }
      })
      .catch(function (error) {
        console.log(error + ' error');
      })
    },
    traerEmpresa(){
      let me = this
      this.$http.get(this.$server_url+'empresa')
      .then(function (res) {
        me.arrayEmpresa = res.data
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
      // ProfomaRespository.getEmpresa().then((r => { me.arrayEmpresa = r.data }))
    },
    getCodigoPaquete(){
      let me = this;
      this.$http.get(this.$server_url+'paquetes/paquetes?traerConfiguracionPaquete=yes')
      .then(function (res) {
        if(res.data.length == 0){
          me.codigo_paquete   = '0'
        }else{
          me.codigo_paquete   = res.data[0].codigo_paquete
          me.longitud_codigo  = res.data[0].longitud
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    //generar codigos
    generarCodigos(fin) {
      let me = this;
      this.textAlertCant  = '';
      this.exportado      = 0,
      this.arregloCodigos = []
      this.codigoSelected = [];
      this.estadoProceso  = 0
      if (fin > 5000) {
        me.$vs.notify({
          color: 'warning',
          title: 'Mensaje',
          text: 'Máximo 5000 códigos se puede generar para el excel'
        })
        return false;
      }
      if(fin == 0 ){
        me.$vs.notify({
          color: 'warning',
          title: 'Mensaje',
          text: 'Debe escribir al menos 1 código para generar'
        })
        return false;
      }
      if(me.codigo_paquete == 0){
        me.$vs.notify({
          color: 'warning',
          title: 'Mensaje',
          text: 'No existe la configuración para los paquetes'
        })
        return false;
      }
      if(me.longitud_codigo < 2){
        me.$vs.notify({
          color: 'warning',
          title: 'Mensaje',
          text: 'La longitud del código no puede ser menor a 2'
        })
        return false;
      }
      this.code = this.codigo_paquete + "-";
      me.arregloCodigos              = [];
      let formData = new FormData();
      formData.append('longitud', this.longitud_codigo);
      formData.append('code',     this.code);
      formData.append('cantidad', fin);
      me.$vs.loading();
      this.$http.post(this.$server_url+'paquetes/generarCodigosPaquete', formData)
      .then(function (res) {
        me.$vs.loading.close()
        me.arregloCodigos = res.data.codigos;
        me.estadoProceso = 1;
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'Codigos Cargados'
        })
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.loading.close()
      })
    },
    //Guardar codigos en la BD
    async guardarCodigos() {
      let me = this;
      //validar que se haya seleccionado una línea de producto
      if(!me.lineaSeleccionada){
        me.$vs.notify({
          color: 'warning',
          title: 'Mensaje',
          text: 'Debe seleccionar una línea de producto'
        })
        return false;
      }
      this.progressInterActivo     = 1;
      var codigosEnviar            = [];
      for (var i = 0; i < this.arregloCodigos.length; i++) {
        codigosEnviar.push(this.arregloCodigos[i].codigo);
      }
      this.openLoadingColor()
      var formData = new FormData();
      formData.append("user_created",     me.usuario.idusuario);
      formData.append("codigo",           codigosEnviar);
      formData.append("linea_producto_id", me.lineaSeleccionada.id);
      me.$vs.loading();
      //SE GENERA LOS CODIGOS PERO NO SE VERIFICA CON LA BASE
      this.$http.post(this.$server_url + 'paquetes/paquetes', formData)
      .then(res => {
        //porcentaje
        me.arregloCodigos           = []
        me.arregloCodigos           = res.data.codigosGuardados
        var porcentajeAnterior      = 0
        porcentajeAnterior          = res.data.porcentajeAnterior
        this.codigosNoIngresados    = res.data.codigosNoIngresadosAnterior;
        this.porcentaje             = porcentajeAnterior
        me.estadoProceso            = 2;
        this.$vs.loading.close()
        this.textAlertCant          = 'Se han guardado con éxito: ' + this.porcentaje + ' códigos.';
        this.progressInterActivo    = '';
        if(this.codigosNoIngresados > 0){
          me.popupProblemas = true
        }
        me.exportToExcel()
      })
      .catch(function (error) {
        this.$vs.loading.close()
        alert('Error no existen códigos disponibles ' + error);
      });
    },
    //METODOS PARA EXPORTAR EXCEL
    exportToExcel() {
      let me = this
      let headerTitle = ""
      let headerVal = ""
        headerTitle = [
          'codigo',
          '',
          '',
          '',
          '',
          '',
          'secuencia',
          'imprimir',
        ];
        headerVal = [
          'codigo',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ];
      let codigoSelectedMayus = this.arregloCodigos
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
        for (var i = 0; i < data.length; i++) {
          data[i][1] = me.lineaSeleccionada.nombre.toUpperCase(),
          data[i][6] = i+1
          data[i][7] = 1
        }
        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: 'CodigosPaquete_'+me.lineaSeleccionada.nombre.toUpperCase(),
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat
        })
        this.clearFields()
        // this.textAlertCant  = '';
        this.cantidad       = '';
        this.codigoSelected = [];
        this.exportado      = 1
        me.$vs.notify({
        text:'Se exporto corectamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
    },
    clearFields() {
        this.fileName = ''
        this.cellAutoWidth = true
        this.selectedFormat = 'xls'
    },
    openLoadingColor(libro) {
      this.$vs.loading({
          color: '#1A76F2'
      })
    },
  },
}
</script>
