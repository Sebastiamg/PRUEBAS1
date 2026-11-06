<template>
    <div>
        <vs-alert style="height: 80px;">
            <p>
                Este reporte trata de mostrar los <b>codigos liquidados y regalados por periodo distruibuidos por niveles</b> excepto plan lector
            </p>
        </vs-alert>
        <br>
        <div>
            <PeriodoReutilizableVue @changePeriodo="changePeriodo"/>
        </div>
        <div class="flex">
          <vs-button @click="exportData()" class="btn btn-sm" icon-pack="feather" icon="icon-printer" v-if="arregloFormato.length > 0" >
            Exportar
          </vs-button>
        </div>
        <div>
            <vs-table max-items="50" search stripe :data="arregloFormato" id="miTabla" v-if="arregloFormato.length > 0">
                <template slot="header">
                    <vs-chip>Cantidad {{arregloFormato.length}}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th class="fixed-column" sort-key="fecha_inicio">Institución</vs-th>
                    <vs-th class="" sort-key="fecha_inicio">Contrato</vs-th>
                    <vs-th class="" v-for="(value, key) in arregloFormato[0]" :key="key" v-if=" key !== 'contrato' && key !== 'nombreInstitucion' && key !== 'nombrenivel' && key !== 'cantidad' && key !== 'tipo_venta_descr'">
                        {{ key.toUpperCase().replace('_', ' ') }}
                    </vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td class="fixed-column">
                            <div>
                                <div style="width: 200px;" class="flex flex-col gap-2">
                                    <span class="flex font-bold">{{ tr.nombreInstitucion }}</span>
                                </div>
                            </div>
                        </vs-td>
                        <vs-td>
                            <div style="width: 200px;" class="flex flex-col gap-2">
                                <span class="flex font-bold">{{ tr.contrato }}</span>
                            </div>
                            <b>Tipo de Venta:</b>
                            <p>{{ tr.tipo_venta_descr }}</p>
                        </vs-td>

                        <vs-td v-for="(value, key) in tr" :key="key" v-if="key !== 'contrato' && key !== 'nombreInstitucion' && key !== 'nombrenivel' && key !== 'cantidad' && key !== 'tipo_venta_descr'">
                            <span v-if="value > 0" style="background-color: #3FACB1;color:white;border-radius: 50%;padding: 10px;">
                                {{ value }}
                            </span>
                            <span v-else>
                            </span>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <div v-else class="mt-5">
                <p class="text-center">Aun no se encontrados datos</p>
            </div>
        </div>
    </div>
</template>
<script>
import Generalmix from '../../../mixins/Generalmix';
const PeriodoReutilizableVue   = () => import('./PeriodoReutilizable.vue')
export default{
    mixins: [Generalmix],
    components:{
        PeriodoReutilizableVue
    },
    data(){
        return{
            arrayReporte    : [],
            arregloFormato  : [],
            periodoSelected : null,
            arrayPeriodos   : [],
            tipoRegion      : null, 
            //VARIABLES PARA EXPORTAR A EXCEL
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            fileName:null,
            selectedFormat: 'xls',
            cellAutoWidth: true,
        }
    },
    methods:{
        changePeriodo(periodo, periodos, tipoRegion){
            let me = this;
            this.arrayReporte    = [];
            this.arregloFormato  = [];
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
            this.$http.get(this.$server_url+`metodosGetVerificaciones?getReportePorAnio=1&id_periodo=${this.periodoSelected}`)
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
                        contrato: item.contrato,
                        tipo_venta_descr: item.tipo_venta_descr,
                        hijos: []
                    };
                    }
                    acc[key].hijos.push(item);
                    return acc;
                }, {})
                );
                me.arrayReporte = groupedData
                console.log("groupedData2",groupedData)
                me.f_generarFormato(me.arrayReporte)
            })
            .catch(function (error) {
                me.$vs.loading.close()
                me.m_message("Error al obtener los reportes", "error");
                console.log(error + ' error');
            })
        },
        f_generarFormato(data) {
            let me = this;
            me.arregloFormato = [];
            
            // Definir arrayNivelFormato
            const arrayNivelFormato = [
                { nombrenivel: 'Inicial 1' },
                { nombrenivel: 'Inicial 2' },
                { nombrenivel: '1ero Basica' },
                { nombrenivel: '2do Basica' },
                { nombrenivel: '3ero Basica' },
                { nombrenivel: '4to Basica' },
                { nombrenivel: '5to Basica' },
                { nombrenivel: '6to Basica' },
                { nombrenivel: '7mo Basica' },
                { nombrenivel: '8vo Basica' },
                { nombrenivel: '9no Basica' },
                { nombrenivel: '10mo Basica' },
                { nombrenivel: '1ero BG' },
                { nombrenivel: '2do BG' },
                { nombrenivel: '3ero BG' },
            ];

            data.forEach(element => {
                let cal = new Object();
                cal.contrato = element.contrato;
                cal.nombreInstitucion = element.nombreInstitucion;
                cal.tipo_venta_descr = element.tipo_venta_descr;

                // Inicializamos todas las cantidades a 0 para cada nivel
                arrayNivelFormato.forEach(nivel => {
                    cal[nivel.nombrenivel] = 0;
                });

                // Sumamos las cantidades de los hijos para cada nivel
                element.hijos.forEach(hijo => {
                    if (cal.hasOwnProperty(hijo.nombrenivel)) {
                        cal[hijo.nombrenivel] += hijo.cantidad;  // Sumar la cantidad
                    }
                });

                me.arregloFormato.push(cal);
            });
        },

        exportData() {
          let me = this
          try {
            let arrayData = this.arregloFormato;
            let excluir = arrayData
            // let exluir = arrayData.map(p => {
            //   let { id_pedido, id_asesor, ...rest } = p;
            //   return rest;
            // });
            let data = excluir[0]
            let valores_headerTitle = Object.keys(data)
            let valores_headerVal   = Object.keys(data)
            me.exportTodoCodigos(valores_headerTitle,valores_headerVal,excluir)
          } catch (error) {
            console.error('Error exporting to Excel:', error);
          }
        },
        exportTodoCodigos(valores_headerTitle,valores_headerVal,arrayDatos){
          let headerTitle = [...valores_headerTitle];
          let headerVal   = [...valores_headerVal ];
          import('@/vendor/Export2Excel').then(excel => {
            let datos = []
            datos = arrayDatos
            const data = this.formatJson(headerVal, datos)
            excel.export_json_to_excel({
              header: headerTitle,
              data,
              filename: 'Reporte',
              autoWidth: this.cellAutoWidth,
              bookType: this.selectedFormat
            })
            this.clearFields()
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
              return v[j]
          }))
        },
        clearFields() {
          this.cellAutoWidth = true
          this.selectedFormat = 'xls'
        },
    }
}
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
.radio-large {
  width: 20px;
  height: 20px;
  transform: scale(1); /* Adjust this value as needed */
  position: relative;
  top:2px;
  margin:5px;
}
</style>