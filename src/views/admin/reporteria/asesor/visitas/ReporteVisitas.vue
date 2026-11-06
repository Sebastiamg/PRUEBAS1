<template>
  <div>
    <div>
      <!--filtro-->
      <div class="vx-row">
        <div class="sm:w-full md:w-full lg:w-1/3 xl:w-1/3 ml-3">
          <small>Fecha inicio</small>
          <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/1 xl:w-1/2 mb-6">
          <small>Fecha fin</small>
          <div class="flex">
            <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1"  style="display: inline-block;width: 100%" />
            <vs-button icon="search" class="ml-1" @click="getReporte();">Buscar</vs-button>
          </div>
        </div>
      </div>
      <vs-table max-items="50" search pagination :data="arrayReport" >
        <template slot="header">
            Cantidad: {{arrayReport.length}}
            <vs-button color="warning" size="small" class="ml-3" style="font-size: 14px;" @click="tipo= 1;activePrompt=true;">Exportar</vs-button>
        </template>
        <template slot="thead">
          <vs-th>Asesor</vs-th>
            <vs-th>Institucion</vs-th>
            <!-- <vs-th>Ciudad</vs-th> -->
            <vs-th>Cantidad de visitas</vs-th>
            <vs-th>Tipo</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{ tr.asesor }}</vs-td>
              <vs-td>
                  {{data[indextr].nombreInstitucion}}<br>
                  <small>{{tr.region}}</small>
              </vs-td>
              <!-- <vs-td>
                  {{data[indextr].ciudad}}<br>
              </vs-td> -->
              <vs-td>
                  {{data[indextr].cantidad}}<br>
              </vs-td>
              <vs-td>{{ tr.tipo }}</vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
    </vs-prompt>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
export default {
  data() {
    return{
      arrayReport: [],
      arrayTodo: [],
      codigoSelected: [],
      //variables para el export a excel
      activePrompt:false,
      reportesActivo: 0,
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
      //fin variables para el export a excel
      fromDate: null,
      toDate: null,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d',
        maxDate: new Date().fp_incr(1)
      },
    }
  },
  components: {
    vSelect,
    flatPickr
  },
  mounted(){
    //from que tome el primer dia del mes por defecto
    this.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    //to que tome el dia actual por defecto
    this.toDate   = moment().format('YYYY-MM-DD');
    this.getReporte();
  },
  methods:{
    getReporte(){
      let me = this;
      me.arrayReport = []
      if(me.fromDate == null || me.toDate == null){
        me.$vs.notify({
            title: 'Error',
            text: 'Debe seleccionar las fechas',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
        })
        return;
      }
      if(me.fromDate > me.toDate){
        me.$vs.notify({
            title: 'Error',
            text: 'La fecha de inicio no puede ser mayor a la fecha fin',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
        })
        return;
      }
      if(me.fromDate == me.toDate){
        me.$vs.notify({
            title: 'Error',
            text: 'Las fechas no pueden ser iguales',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
        })
        return;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url+`getReporteAsesores?fromDate=${me.fromDate}&toDate=${me.toDate}`)
        .then(function (res) {
            me.$vs.loading.close()
           me.arrayReport = res.data;
           if(me.arrayReport.length > 0){
            me.getReporteTodo();
           }
        })
        .catch(function (error) {
            me.$vs.loading.close()
            me.$vs.notify({
                title: 'Error',
                text: 'Ocurrio un error al cargar los datos',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            })
            console.log(error + ' error');
        })
    },
    getReporteTodo(){
      let me = this;
      me.arrayTodo = [];
      this.$http.get(this.$server_url+`getReporteAsesores?todo=1&fromDate=${me.fromDate}&toDate=${me.toDate}`)
        .then(function (res) {
          let datos = res.data;
          datos = res.data;
          if(datos.length > 0){
            //voy a recorrer con un bucle y modificar con  datos.JSON.parse(tr.opciones)
            me.arrayTodo = datos.map(p => {
              p.opciones = JSON.parse(p.opciones);
              //buscar en array de arrayReport la propiedad cantidad donde sea el institucion_id igual a p.institucion_id
              let cantidad              = me.arrayReport.find(x => x.institucion_id == p.institucion_id);
              p.cantidad                = cantidad ? cantidad.cantidad : null;
              //opciones = {\"presentacion\":true,\"entrega_muestras\":false,\"reunion\":false,\"seguimiento\":false,\"cierre\":false,\"cobranza\":false,\"post_venta\":false,\"retiro_cartas\":false,\"retiro_muestras\":false,\"sinSello\":true,\"editorial\":\"\",\"otraEditorial\":false}",
              p.presentacion            = p.opciones.presentacion == true ? 'Presentacion' : '';
              p.entrega_muestras        = p.opciones.entrega_muestras == true ? 'Entrega de muestras' : '';
              p.reunion                 = p.opciones.reunion == true ? 'Reunion' : '';
              p.seguimiento             = p.opciones.seguimiento == true ? 'Seguimiento' : '';
              p.cierre                  = p.opciones.cierre == true ? 'Cierre' : '';
              p.cobranza                = p.opciones.cobranza == true ? 'Cobranza' : '';
              p.post_venta              = p.opciones.post_venta == true ? 'Post venta' : '';
              p.retiro_cartas           = p.opciones.retiro_cartas == true ? 'Retiro de cartas' : '';
              p.retiro_muestras         = p.opciones.retiro_muestras == true ? 'Retiro de muestras' : '';
              p.sinSello                = p.opciones.sinSello == true ? 'Sin sello' : 'Con sello';
              p.editorial               = p.opciones.editorial;
              p.otraEditorial           = p.opciones.otraEditorial == true ? 'Otra editorial' : '';
              p.otraEditorialText       = p.opciones.otraEditorialText;
              return p;
            })
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    //METODOS PARA EXCEL
    //para limipiar los campos del excel
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xlsx'
    },
      //metodo par descargar el excel
      exportToExcel() {
        let headerTitle = ['Asesor','Institucion','Región','Sello','Estado','Observaciones','Fecha Creación','Fecha finalización','Visitas','Tipo'];
        let headerVal = ['asesor','nombreInstitucion','region','sinSello','estadoAgenda','observaciones2','startDate','fecha_que_visita','cantidad','tipo'];
        let codigoSelectedMayus = this.arrayTodo;
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
            var nombrefile = ""
            nombrefile = this.fileName
            // if(this.openModal == 1){
            //     nombrefile = this.fileName
            // }else{
            //     nombrefile = "Reporte de asesores"
            // }
            excel.export_json_to_excel({
                header: headerTitle,
                data,
                filename: nombrefile,
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
