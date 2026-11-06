<template>
  <div class="mt-5">
      <div class="row">
        <input type="radio" @input="arrayReporte=[];tmpArrayReporte=[];totalCantidad=0;totalValor=0;" id="Directa" value="1" v-model="tipov" class="cursor-pointer radio-large"/>
        <label for="Directa"  class="cursor-pointer">Directa</label>

        <input type="radio" @input="arrayReporte=[];tmpArrayReporte=[];totalCantidad=0;totalValor=0;" id="Lista" value="2" v-model="tipov" class="cursor-pointer radio-large"/>
        <label for="Lista"  class="cursor-pointer">Por lista</label>

        <input type="radio" @input="arrayReporte=[];tmpArrayReporte=[];totalCantidad=0;totalValor=0;" id="Todo" value="3" v-model="tipov" class="cursor-pointer radio-large"/>
        <label for="Todo"  class="cursor-pointer">Todo</label>
      </div>
      <vx-card class="mt-2">
        <!--filtro-->
        <div class="vx-row">
          <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <small>Asesores:</small>
            <div class="flex">
              <v-select :options="arrayAsesores" :reduce="arrayAsesores => arrayAsesores" @input="getLibros();" label="asesor" class="w-full" v-model="asesorSelected" />
              <vs-button class="ml-2" @click="getLibros();" icon="search">Buscar</vs-button>
            </div>
          </div>
        </div>
        <div>
          <p>Valor total: {{ totalValor | filtrarDecimal }}</p>
          <p>Cantidad libros: {{ totalCantidad }}</p>
        </div>
        <br>
        <!--fin filtro-->
        <div class="flex">
          <vs-button @click="ExportToExcel('xlsx')" class="btn btn-sm" icon-pack="feather" icon="icon-printer" v-if="tmpArrayReporte.length > 0" >
            Exportar
          </vs-button>
        </div>
        <vs-table max-items="50" search stripe :data="tmpArrayReporte" id="miTabla" v-if="tmpArrayReporte.length > 0">
            <template slot="header">
                <vs-chip>Cantidad {{tmpArrayReporte.length}}</vs-chip>
            </template>
            <template slot="thead">
                <vs-th class="fixed-column" sort-key="fecha_inicio">Institución</vs-th>
                <!-- <vs-th class="" sort-key="fecha_inicio">Ciudad</vs-th>-->
                <vs-th class="" sort-key="fecha_inicio">Contratos</vs-th>
                <vs-th class="" v-for="(value, key) in tmpArrayReporte[0]" :key="key" v-if="key !== 'id_pedido' && key !== 'contrato_generado' && key !== 'nombreInstitucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'id_asesor' ">
                    {{ key.toUpperCase().replace('_', ' ') }}
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td class="fixed-column">
                        <div>
                          #{{ tr.id_pedido }}
                            <div style="width: 200px;" class="flex flex-col gap-2">
                                <span class="flex font-bold">{{ tr.nombreInstitucion }}</span>
                            </div>
                            <div>
                                <span class="text-xs">{{ tr.ciudad }}</span>
                                <br>
                                <span class="text-xs">{{ tr.asesor }}</span>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td>
                        <div style="width: 200px;" class="flex flex-col gap-2">
                            <span class="flex font-bold">{{ tr.contrato_generado }}</span>
                        </div>
                    </vs-td>

                    <vs-td v-for="(value, key) in tr" :key="key" v-if="key !== 'id_pedido' && key !== 'contrato_generado' &&  key !== 'nombreInstitucion' && key !== 'ciudad' && key !== 'asesor' && key !== 'id_asesor'">
                        <span v-if="value > 0" style="background-color: #3FACB1;color:white;border-radius: 50%;padding: 10px;">
                            {{ value }}
                        </span>
                        <span v-else>
                        </span>
                    </vs-td>
                </vs-tr>
                <!-- Aquí agregamos la fila para el total -->
                <vs-tr>
                    <td class="fixed-column"><b>TOTAL LIBROS</b></td>
                    <td></td>
                    <td v-for="(value, key) in arrayTotales" :key="key">{{ value.cantidad }}</td>
                </vs-tr>
                <vs-tr>
                    <td class="fixed-column"><b>PRECIO</b></td>
                    <td></td>
                    <td v-for="(value, key) in arrayTotales" :key="key">{{ value.precio }}</td>
                </vs-tr>
                <vs-tr>
                    <td class="fixed-column"><b>VALOR TOTAL </b></td>
                    <td></td>
                    <td v-for="(value, key) in arrayTotales" :key="key">{{ value.total | filtrarDecimal  }}</td>
                </vs-tr>
            </template>
        </vs-table>
        <br><br><br><br><br><br><br><br><br><br><br><br><br>
      </vx-card>
  </div>
  </template>

  <script>
  import vSelect from 'vue-select';
  import * as XLSX from 'xlsx';
  import { mapState } from 'vuex';
  import PedidosRepository from '@/repositories/PedidosRepository'
  export default {
      components: {
          vSelect
      },
      data() {
        return {
          tipov:1,
          setPuntos: [],
          arrayReporte: [],
          tmpArrayReporte:[],
          arrayLibros: [],
          arrayTotales: [],
          arrayAsesores:[],
          arrayCiudades:[],
          asesorSelected:'',
          despachoSelect: '',
          ciudadSelected:'',
          //VARIABLES PARA EXPORTAR A EXCEL
          formats: ['xls', 'xlsx', 'csv', 'txt'],
          fileName:null,
          selectedFormat: 'xls',
          cellAutoWidth: true,
          mixinIdInicioFormatoNewData: null,
          totalValor:0,
          totalCantidad:0,
        }
      },
      computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPuntos', 'userAsesor']),
      },
      mounted() {
        let me = this
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getAsesores()
      },
      props:{
        periodoSelect:{
          type:Number,
          default:0
        }
      },
      methods: {
        filtroData(){
          let me = this
          let fciudad = 0
          let fasesor = 0
          //ciudad
          if(me.ciudadSelected == null || me.ciudadSelected == undefined || me.ciudadSelected == ''){
            fciudad = 0
          }else{
            fciudad = 1
          }
          //asesor
          if(me.asesorSelected == null || me.asesorSelected == undefined || me.asesorSelected == ''){
            fasesor = 0
          }else{
            fasesor = 1
          }
          //si fciudad y fasesor son 0 TODO
          if(fciudad == 0 && fasesor == 0){
            me.tmpArrayReporte = me.arrayReporte
            return
          }
          //si fciudad es 0 y fasesor es 1
          if(fciudad == 0 && fasesor == 1){
            me.tmpArrayReporte = me.arrayReporte.filter(p => p.id_asesor == me.asesorSelected)
            return
          }
          //si fciudad es 1 y fasesor es 0
          if(fciudad == 1 && fasesor == 0){
            me.tmpArrayReporte = me.arrayReporte.filter(p => p.ciudad == me.ciudadSelected)
            return
          }
          //si fciudad es 1 y fasesor es 1
          if(fciudad == 1 && fasesor == 1){
            me.tmpArrayReporte = me.arrayReporte.filter(p => p.ciudad == me.ciudadSelected && p.id_asesor == me.asesorSelected)
            return
          }
        },
        getAsesores(){
          let me = this
          PedidosRepository.rep_getAsesores().then(r => { me.arrayAsesores = r.data } )
        },
        getLibros() {
          const me = this;
          let url = '';
          me.arrayLibros      = []
          me.arrayReporte     = []
          me.tmpArrayReporte  = []
          me.totalValor       = 0
          me.totalCantidad    = 0
          //limpiar array
          //si no hay periodo seleccionado
          if (me.periodoSelect == null || me.periodoSelect == undefined) { return; }
          if(me.asesorSelected == "" || me.asesorSelected == null || me.asesorSelected == undefined){
            me.showError("Seleccione un asesor")
            return
          }
          if (me.periodoSelect <= me.mixinIdInicioFormatoNewData) {
            url = `pedidos2/pedidos?getLibrosXInstitucionesAsesor=yes&id_periodo=${me.periodoSelect}&tipo_venta=${me.tipov}&id_asesor=${me.asesorSelected.id_asesor}`
          }else if(me.periodoSelect > me.mixinIdInicioFormatoNewData){
            url = `pedidos2/pedidos?getLibrosXInstitucionesAsesor_new=yes&id_periodo=${me.periodoSelect}&tipo_venta=${me.tipov}&id_asesor=${me.asesorSelected.id_asesor}`
          }
          me.arrayLibros = [];
          me.$vs.loading()
          this.$http.get(this.$server_url + url)
            .then((res) => {
              me.$vs.loading.close()
              let datos = res.data;
              if (datos.length == 0) {
                me.$vs.notify({
                  text: 'No se encontro libros para este asesor',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle'
                });
                return
              }
              me.totalValor    = datos.reduce((acumulador, item) => acumulador + item.subtotal, 0);
              me.totalCantidad = datos.reduce((acumulador, item) => acumulador + item.valor, 0);
              let librosNormales = []
              let libroPlanLector = []
              let getNormalesOrdenado = []
              let getPlanLectorOrdenado = []
              librosNormales = datos.filter(p => p.id_serie != 6)
              libroPlanLector = datos.filter(p => p.id_serie == 6)
              getNormalesOrdenado = me.ordenarLibros(librosNormales)
              getPlanLectorOrdenado = me.ordenarLibros(libroPlanLector)
              //unir array con spread operator
              me.arrayLibros = [...getNormalesOrdenado, ...getPlanLectorOrdenado]
              me.getReporte()
            })
            .catch((err) => {
              console.log(err)
              me.$vs.loading.close()
                this.showError("Error al obtener los libros", err);
            });
        },
        getReporte() {
          let me = this;
          me.arrayReporte     = []
          me.tmpArrayReporte  = []
          me.arrayTotales     = []
          // if (this.setPuntos == null || this.setPuntos == undefined) { return; } { me.showError("Seleccione un lugar de despacho"); return; }
          me.$vs.loading();
          //api post
          let formData = new FormData();
          // Condición para asignar el valor correcto a 'getValoresLibrosContratosDespacho'
          if (me.periodoSelect <= me.mixinIdInicioFormatoNewData) {
              formData.append('getValoresLibrosContratosInstitucionesAsesor', '1');
          } else if (me.periodoSelect > me.mixinIdInicioFormatoNewData) {
              formData.append('getValoresLibrosContratosInstitucionesAsesor_new', '1');
          }
          formData.append('id_periodo', me.periodoSelect);
          formData.append('arrayLibros', JSON.stringify(me.arrayLibros));
          formData.append('tipo_venta', me.tipov);
          formData.append('id_asesor',  me.asesorSelected.id_asesor)
          this.$http.post(this.$server_url + `pedidos2/pedidos`, formData)
          .then((res) => {
            me.$vs.loading.close();
            let datos = res.data
            if(datos.length == 0){
              this.showError("No se encontraron datos", err);
              return
            }
            //guardar las propiedades de ciudades en arrayCiudades
            // Extrae las ciudades y elimina duplicados usando Set
            const uniqueCities = [...new Set(datos.map(p => p.ciudad))];
            uniqueCities.sort();
            // Convierte el conjunto de ciudades únicas de vuelta a un array de objetos
            me.arrayCiudades = uniqueCities ;
            datos.forEach(element => {
                var cal = new Object();
                cal.id_pedido = element.id_pedido
                cal.contrato_generado = element.contrato_generado
                cal.nombreInstitucion = element.nombreInstitucion
                cal.asesor            = element.asesor
                cal.id_asesor         = element.id_asesor
                cal.ciudad = element.ciudad
                for (let index = 0; index < element.librosFormato.length; index++) {
                    // cal[element.librosFormato[index].nombrelibro] = element.librosFormato[index].valor
                    cal[element.librosFormato[index].codigo] = element.librosFormato[index].valor
                }
                //save libros
                me.arrayReporte.push(cal)
                me.tmpArrayReporte.push(cal)
            });
            me.getTotales();
          }).catch((err) => {
            console.log(err)
            me.$vs.loading.close();
              this.showError("Error al obtener el reporte");
          });
        },
        getTotales() {
            let me = this
            me.arrayLibros.forEach(element => {
                let suma        = 0
                let pretotal    = 0
                let propName    = element.codigo;
                suma            = me.arrayReporte.reduce((total, obj) => total + (obj[propName] || 0), 0);
                pretotal        = suma * element.precio
                //llenar
                var cal = new Object();
                cal.codigo    = element.codigo
                cal.precio    = element.precio
                cal.cantidad  = suma
                cal.total     = pretotal
                me.arrayTotales.push(cal)
            })
        },
        ordenarLibros(datos) {
          let me = this
          let predatos = []
          let valores = []
          predatos = datos
          valores = predatos.sort(function (a, b) {
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
        // ExportToExcel(type, fn, dl) {
        //     var elt = document.getElementById('miTabla');
        //     var wb = XLSX.utils.table_to_book(elt, {
        //         sheet: "sheet1"
        //     });
        //     return dl ?
        //         XLSX.write(wb, {
        //             bookType: type,
        //             bookSST: true,
        //             type: 'base64'
        //         }) :
        //         XLSX.writeFile(wb, fn || ('Reporte_'+this.asesorSelected.asesor + '.' + (type || 'xlsx')));
        // },
        ExportToExcel(type, fn, dl) {
          let me = this;
          try {
            // Prepare the data for export
            let arrayData = me.tmpArrayReporte;

            // Define the headers you want in the Excel file
            let headerTitle = [
              'id_pedido',
              'nombreInstitucion',
              'ciudad',
              'asesor',
              'contrato_generado',
              ...Object.keys(arrayData[0]).filter(
                key => !['id_pedido', 'nombreInstitucion', 'ciudad', 'asesor', 'id_asesor', 'contrato_generado'].includes(key)
              )
            ];

            // Map the headers to display-friendly names (optional, for better readability in Excel)
            let headerDisplay = [
              '# Pedido',
              'Institución',
              'Ciudad',
              'Asesor',
              'Contrato Generado',
              ...Object.keys(arrayData[0])
                .filter(key => !['id_pedido', 'nombreInstitucion', 'ciudad', 'asesor', 'id_asesor', 'contrato_generado'].includes(key))
                .map(key => key.toUpperCase().replace('_', ' '))
            ];

            // Prepare the data, ensuring all fields are included
            let data = arrayData.map(item => {
              let row = {};
              headerTitle.forEach(key => {
                row[key] = item[key] || ''; // Use empty string if value is undefined
              });
              return row;
            });

            // Add total rows (Cantidad, Precio, Valor Total) to the data
            let totalCantidadRow = { id_pedido: 'TOTAL LIBROS' };
            let totalPrecioRow = { id_pedido: 'PRECIO' };
            let totalValorRow = { id_pedido: 'VALOR TOTAL' };

            me.arrayTotales.forEach(total => {
              totalCantidadRow[total.codigo] = total.cantidad;
              totalPrecioRow[total.codigo] = total.precio;
              totalValorRow[total.codigo] = me.$options.filters.filtrarDecimal(total.total);
            });

            // Append total rows to the data
            data.push(totalCantidadRow, totalPrecioRow, totalValorRow);

            // Use exportTodoCodigos logic to export
            import('@/vendor/Export2Excel').then(excel => {
              const formattedData = me.formatJson(headerTitle, data);
              excel.export_json_to_excel({
                header: headerDisplay,
                data: formattedData,
                filename: fn || `Reporte_${me.asesorSelected.asesor}`,
                autoWidth: me.cellAutoWidth,
                bookType: type || 'xlsx'
              });
              me.clearFields();
            });
          } catch (error) {
            console.error('Error exporting to Excel:', error);
            me.showError('Error al exportar a Excel');
          }
        },
        exportData() {
          let me = this
          try {
            let arrayData = this.tmpArrayReporte;
            let exluir = arrayData.map(p => {
              let { id_pedido, id_asesor, ...rest } = p;
              return rest;
            });
            let data = exluir[0]
            let valores_headerTitle = Object.keys(data)
            let valores_headerVal   = Object.keys(data)
            me.exportTodoCodigos(valores_headerTitle,valores_headerVal,exluir,this.asesorSelected.asesor)
            // let exluir = arrayData.map(p => {
            //   let { id_pedido, id_asesor, ...rest } = p;
            //   return rest;
            // });

            // const ws = XLSX.utils.json_to_sheet(exluir);
            // const wb = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(wb, ws, this.asesorSelected.asesor);
            // XLSX.writeFile(wb, `${this.asesorSelected.asesor}.xlsx`);
          } catch (error) {
            console.error('Error exporting to Excel:', error);
          }
        },
        exportTodoCodigos(valores_headerTitle,valores_headerVal,arrayDatos,nombreArchivo){
          let headerTitle = [...valores_headerTitle];
          let headerVal   = [...valores_headerVal ];
          import('@/vendor/Export2Excel').then(excel => {
            let datos = []
            datos = arrayDatos
            const data = this.formatJson(headerVal, datos)
            excel.export_json_to_excel({
              header: headerTitle,
              data,
              filename: nombreArchivo,
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
        showError(msg) {
            this.$vs.notify({
                title: 'Error',
                text: msg,
                color: 'danger',
            });
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
