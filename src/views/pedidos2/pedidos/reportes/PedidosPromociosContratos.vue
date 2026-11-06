
<template>
  <vx-card class="w-full flex flex-col space-y-2"
  title="Reporte de pedidos de libros por asesor"
  >
    <div class="vx-row">
      <div class="sm:w-full md:w-full lg:w-1/3 xl:w-1/3 ml-3">
        <small>Período</small>
        <v-select :options="periodos" :disabled="periodoEspecifico == '1' ? true : false" :reduce="periodos => periodos" @input="arrayReporte = [];getLibros();" label="periodoescolar" class="w-full" v-model="periodo" />
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/1 xl:w-1/2 mb-6">
        <small>Asesores</small>
        <div class="flex">
          <v-select :options="arrayAsesores" @input="arrayReporte=[];getLibros();" :reduce="arrayAsesores => arrayAsesores.id_asesor" label="asesor" class="w-full" v-model="asesorSelect" />
            <vs-button icon="search" class="ml-1" @click="getReporte();">Buscar</vs-button>
        </div>
      </div>
    </div>
    <br>
    <!-- <vs-button @click="exportData" color="primary" class="btn btn-sm mt-5" icon-pack="feather" icon="icon-printer" v-if="arrayReporte.length > 0">
      Exportar
    </vs-button> -->
    <vs-button @click="ExportToExcel('xlsx')" color="primary" class="btn btn-sm mt-5" icon-pack="feather" icon="icon-printer" v-if="arrayReporte.length > 0">
      Exportar
    </vs-button>
  <vs-table max-items="50" search stripe :data="arrayReporte" id="miTabla" v-if="arrayReporte.length > 0">
    <template slot="header">
      <vs-chip>Cantidad {{arrayReporte.length}}</vs-chip>
    </template>
    <template slot="thead">
      <vs-th class="" sort-key="fecha_inicio">Institución</vs-th>
      <vs-th class="" sort-key="fecha_inicio">Ciudad</vs-th>
      <vs-th class="" sort-key="fecha_inicio">Contratos</vs-th>
      <vs-th class="" v-for="(value, key) in arrayReporte[0]" :key="key"
        v-if="key !== 'id_pedido' && key !== 'contrato_generado' && key !== 'nombreInstitucion' && key !== 'ciudad'">
        {{ key.toUpperCase().replace('_', ' ') }}
      </vs-th>
    </template>
    <template slot-scope="{data}">
      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
        <vs-td>
          <div>
            <div style="width: 200px;" class="flex flex-col gap-2">
              <span class="flex font-bold">{{ tr.nombreInstitucion }}</span>
            </div>
          </div>
        </vs-td>
        <vs-td>
          <span class="text-xs">{{ tr.ciudad }}</span>
        </vs-td>
        <vs-td class="fixed-column">
          <div>
            <div style="width: 200px;" class="flex flex-col gap-2">
              <span class="flex font-bold">{{ tr.contrato_generado }}</span>
            </div>
          </div>
          <br>
        </vs-td>
        <vs-td v-for="(value, key) in tr" :key="key"
          v-if="key !== 'id_pedido' && key !== 'contrato_generado' &&  key !== 'nombreInstitucion' && key !== 'ciudad'">
          <span v-if="value > 0" style="background-color: #3FACB1;color:white;border-radius: 50%;padding: 10px;cursor-pointer;border: 5px solid #71B5B9;">
            {{ value }}
          </span>
          <span v-else>
          </span>
        </vs-td>
      </vs-tr>
      <!-- Aquí agregamos la fila para el total -->
      <vs-tr>
        <td colspan="3"><b>TOTAL LIBROS</b></td>
        <td v-for="(value, key) in arrayTotales" :key="key">{{ value.cantidad }}</td>
      </vs-tr>
      <vs-tr>
        <td colspan="3"><b>VALOR TOTAL </b></td>
        <td v-for="(value, key) in arrayTotales" :key="key">{{ value.total | filtrarDecimal  }}</td>
      </vs-tr>
    </template>
  </vs-table>
  <br><br><br><br><br><br><br><br><br><br><br><br><br>
  </vx-card>
</template>
<script>
import vSelect from 'vue-select';
import moment from 'moment';
import * as XLSX from 'xlsx';

export default ({
  components: {
    vSelect,
  },
  data: () => ({
    title: 'Reporte de capacitaciones',
    periodo: null,
    periodos: [
    ],

    //////////////////////////
    arrayAsesores:[],
    asesorSelect:'',
    arrayLibros:[],
    arrayReporte:[],
    arrayTotales:[],
  }),
  created() {
    let me = this
    this.getPeriodos();
    this.getAsesores();
    this.periodo = this.periodos[0];
    this.currentUser  = JSON.parse(localStorage.getItem('usuario'));
  },
  mounted(){
    let me = this;
  },
  props: {
    periodoSelect: {
      type: Object,
      default: () => {},
    },
    periodoEspecifico:{
      type: String,
      default: "0",
    }
  },
  methods: {
    getPeriodos() {
      const me = this;
      me.$http.get(`${me.$server_url}get_periodos_seminarios`)
        .then((res) => {
          me.periodos = res.data.filter(p => p.idperiodoescolar != 20 && p.idperiodoescolar != 17 && p.idperiodoescolar != 15 && p.idperiodoescolar != 14 && p.idperiodoescolar > 11 )
          me.periodo = me.periodos.filter(p => p.idperiodoescolar == me.periodoSelect.idperiodoescolar)[0];
          if(me.periodo.idperiodoescolar) {
            me.getLibros();
          }
        })
        .catch((err) => this.showError("Error al obtener los periodos"));
    },
    getLibros() {
      const me = this;
      me.arrayLibros = [];
      if(me.periodo == null || me.periodo == "" || me.periodo == undefined ) { return }
      if(me.asesorSelect == '' || me.asesorSelect == null || me.asesorSelect == undefined)  { return; }
      this.$http.get(this.$server_url+`pedidos2/pedidos?geAllLibrosxAsesor=yes&asesor_id=${me.asesorSelect}&periodo_id=${me.periodo.idperiodoescolar}`)
      //this.$http.get(this.$server_url+`pedidos2/pedidos?getLibrosFormato=yes&periodo_id=${me.periodo.idperiodoescolar}`)
        .then((res) => {
          let datos                 = res.data;
          let librosNormales        = []
          let libroPlanLector       = []
          let getNormalesOrdenado   = []
          let getPlanLectorOrdenado = []
          if(datos.length == 0)     { me.showError("No hay libros para este asesor"); return; }
          librosNormales            = datos.filter(p => p.id_serie != 6)
          libroPlanLector           = datos.filter(p => p.id_serie == 6)
          getNormalesOrdenado       = me.ordenarLibros(librosNormales)
          getPlanLectorOrdenado     = me.ordenarLibros(libroPlanLector)
          //unir array con spread operator
          me.arrayLibros            = [...getNormalesOrdenado,...getPlanLectorOrdenado]
        })
        .catch((err) => {
          this.showError("Error al obtener los libros", err);
        });
    },
    ordenarLibros(datos){
      let me = this
      let predatos  = []
      let valores   = []
      predatos = datos
      valores = predatos.sort(function(a, b) {
      var nombreA = a.codigo.toLowerCase();
      var nombreB = b.codigo.toLowerCase();
      var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
      var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
      nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
      nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
      if (nombreA < nombreB) {
          return -1;
      }
      if (nombreA > nombreB) {
          return 1;
      }
      if (numA && !numB) { // si a tiene número y b no, b va primero
          return 1;
      }
      if (!numA && numB) { // si b tiene número y a no, a va primero
          return -1;
      }
      if (numA && numB) { // si ambos tienen número, compararlos
          if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
          return -1;
          }
          if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
          return 1;
          }
          return numA - numB; // comparar los números directamente
      }
      return 0; // si son iguales en todo, no hay diferencia
      });
      return valores
    },
    getReporte(){
      let me = this;
      me.arrayReporte     = []
      me.arrayTotales     = []
      if(me.asesorSelect == '' || me.asesorSelect == null || me.asesorSelect == undefined)  { me.showError("Seleccione un asesor"); return; }
      if(me.periodo == '' || me.periodo == null || me.periodo == undefined)                 { me.showError("Seleccione un período");  return;  }
      me.$vs.loading();
      //api post
      let formData = new FormData();
      formData.append('getValoresLibrosContratos', 'yes');
      formData.append('asesor_id', me.asesorSelect);
      formData.append('periodo_id', me.periodo.idperiodoescolar);
      formData.append('arrayLibros', JSON.stringify(me.arrayLibros));
      this.$http.post(this.$server_url+`pedidos2/pedidos`, formData)
      // this.$http.get(this.$server_url+`pedidos2/pedidos?getValoresLibrosContratos=yes&asesor_id=${me.asesorSelect}&periodo_id=${me.periodo.idperiodoescolar}`)
        .then((res) => {
          me.$vs.loading.close();
          let datos = res.data
          datos.forEach(element => {
            var cal               = new Object();
            cal.id_pedido         = element.id_pedido
            cal.contrato_generado = element.contrato_generado
            cal.nombreInstitucion = element.nombreInstitucion
            cal.ciudad            = element.ciudad
            for (let index = 0; index < element.librosFormato.length; index++) {
              // cal[element.librosFormato[index].nombrelibro] = element.librosFormato[index].valor
              cal[element.librosFormato[index].codigo] = element.librosFormato[index].valor
            }
            //save libros
            me.arrayReporte.push(cal)
          });
          me.getTotales()
        })
        .catch((err) => {
          this.showError("Error al obtener el reporte");
          me.$vs.loading.close();
        });
    },
    getTotales(){
      let me          = this
      me.arrayLibros.forEach(element => {
        let suma      = 0
        let pretotal  = 0
        let propName  = element.codigo;
        suma          = me.arrayReporte.reduce((total, obj) => total + (obj[propName] || 0), 0);
        pretotal      = suma * element.precio
        //llenar
        var cal       = new Object();
        cal.codigo    = element.codigo
        cal.precio    = element.precio
        cal.precio    = element.precio
        cal.cantidad  = suma
        cal.total     = pretotal
        me.arrayTotales.push(cal)
      })
    },
    getAsesores() {
      let me = this;
      me.arrayAsesores = []
      this.$http.get(this.$server_url+'pedidos2/pedidos?getAsesoresPedidos=1')
      .then(function (res) {
        me.arrayAsesores = res.data
      })
      .catch(function (error) {
        console.log(error + ' error');
      })
    },
    exportData() {
      const ws = XLSX.utils.json_to_sheet(this.arrayReporte);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ReporteContratos');
      XLSX.writeFile(wb, 'ReporteContratos.xlsx');
    },
    ExportToExcel(type, fn, dl) {
      var elt = document.getElementById('miTabla');
      var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
      return dl ?
          XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
          XLSX.writeFile(wb, fn || ('ReporteContratos.' + (type || 'xlsx')));
    },
    showError(msg) {
      this.$vs.notify({
        title: 'Error',
        text: msg,
        color: 'danger',
      });
    },
  },
})
</script>

<style>
.fixed-column {
  position: sticky;
  left: 0;
  background-color: white;
}
.fixed-column2 {
  position: sticky;
  top: 0;
  background-color: white;
}
</style>
