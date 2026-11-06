<template>
  <div>
    <vx-card>
      <div>
        <PeriodoReutilizableVue @changePeriodo="changePeriodo"/>
      </div>
      <!--boton para exportar-->
      <div v-if="arrayReporte.length>0">
        <vs-button color="success" @click="f_exportar();">Exportar</vs-button>
      </div>
      <div>
        <vs-table max-items="10" stripe search pagination :data="arrayReporte">
          <template slot="header">
            <vs-chip color="primary">Cantidad: <b>{{ arrayReporte.length }}</b></vs-chip>
          </template>
          <template slot="thead">
            <vs-th>Institución</vs-th>
            <vs-th>Detalles</vs-th>
          </template>
          <template slot-scope="{ data }">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{ tr.nombreInstitucion }}<br>
              </vs-td>
              <vs-td>
                <vs-table max-items="10" stripe search pagination :data="tr.hijos">
                  <template slot="thead">
                    <vs-th>Contrato</vs-th>
                    <vs-th>Libro</vs-th>
                    <vs-th>Código</vs-th>
                    <vs-th>Cantidad</vs-th>
                  </template>
                  <template slot-scope="{ data: hijos }">
                    <vs-tr :key="indextr2" v-for="(item, indextr2) in hijos">
                      <vs-td>{{ item.contrato }}</vs-td>
                      <vs-td>{{ item.nombrelibro }}</vs-td>
                      <vs-td>{{ item.codigo_liquidacion }}</vs-td>
                      <vs-td>{{ item.cantidad }}</vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </vx-card>
  </div>
</template>
<script>
const PeriodoReutilizableVue   = () => import('./PeriodoReutilizable.vue')
import Generalmix from '../../../mixins/Generalmix';
import * as XLSX from "xlsx"; // Librería para exportar a Excel
export default {
  mixins: [Generalmix],
  components: {
    PeriodoReutilizableVue,
  },
  data() {
    return{
      arrayPeriodos:[],
      periodoSelected: '',
      tipoRegion: '1',
      arrayReporte:[],
    }
  },
  methods:{
    changePeriodo(periodo, periodos, tipoRegion){
      let me = this;
      this.arrayReporte    = [];
      this.periodoSelected = periodo
      this.arrayPeriodos   = periodos
      this.tipoRegion      = tipoRegion
      me.f_getReporte()
    },
    f_getReporte(){
      let me = this;
      me.arrayReporte = []
      if(me.periodoSelected == '' || me.periodoSelected == null || me.periodoSelected == undefined){
        me.m_message('Debe seleccionar un periodo','danger')
        return false;
      }
      me.$vs.loading();
      this.$http.get(this.$server_url+`metodosGetVerificaciones?getReporteLiquidadosPorLibros=1&id_periodo=${this.periodoSelected}`)
      .then(function (res) {
        me.$vs.loading.close()
        let datos = res.data
        // Agrupar por nombreInstitucion
        const groupedData = Object.values(
          datos.reduce((acc, item) => {
            const key = item.nombreInstitucion;
            if (!acc[key]) {
              acc[key] = {
                nombreInstitucion: key,
                hijos: []
              };
            }
            acc[key].hijos.push(item);
            return acc;
          }, {})
        );
        me.arrayReporte = groupedData
        console.log("groupedData",groupedData)
      })
      .catch(function (error) {
          me.$vs.loading.close()
          me.m_message("Error al obtener los reportes", "error");
          console.log(error + ' error');
      })
    },
    f_exportar(){
      let me = this;
      // Crear un nuevo libro de Excel
      const wb = XLSX.utils.book_new();

      // // Crear una primera hoja con solo los nombres de los clientes
      // const clientsData = this.arrayReporte.map((cliente) => {
      //     return {
      //         Institucion: cliente.nombreInstitucion,
      //         Contrato: cliente.hijos[0].contrato
      //     };
      // });

      // // Crear una hoja con los nombres de los clientes
      // const wsClients = XLSX.utils.json_to_sheet(clientsData);

      // // Agregar la primera hoja al libro (Hoja1)
      // XLSX.utils.book_append_sheet(wb, wsClients, "Clientes");

      // Recorrer cada cliente en la lista de ventas y agregar una hoja con detalles
      this.arrayReporte.forEach((cliente) => {
          // Crear los datos para la tabla de detalle_venta de cada cliente
          const dataForExcel = cliente.hijos.map((producto) => {
              return {
                  Contrato: producto.contrato,
                  "Institución": cliente.nombreInstitucion,
                  "Libro": producto.nombrelibro,
                  "Código": producto.codigo_liquidacion,
                  "Cantidad": producto.cantidad,
              };
          });

          // Asignar el nombre de la institución como nombre de la hoja
          let sheetName = cliente.hijos[0].contrato

          // Crear una hoja para cada cliente con su detalle de ventas
          const ws = XLSX.utils.json_to_sheet(dataForExcel);

          // Agregar la hoja de detalle de ventas al libro
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      // Exportar como archivo Excel
      let nombreArchivo = "ReporteLibrosContratos_" +  ".xlsx";

      // Ahora pasamos la variable al método writeFile
      XLSX.writeFile(wb, nombreArchivo);
    }
  }
}
</script>
