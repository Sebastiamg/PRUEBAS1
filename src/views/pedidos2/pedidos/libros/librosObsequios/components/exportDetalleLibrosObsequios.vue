<template>
  <div>
    <vx-card id="seccionImprimir2">
      <h5 class="text-center font-bold">DETALLE DE TEXTOS - HIJOS DE LOS DOCENTES</h5>
      <br><br>
      <table class="tabla2" border="1">
        <thead>
          <tr>
            <td colspan="1"><b>DESCRIPCIÓN</b></td>
            <td colspan="1"><b>CANT. UNIDADES</b></td>
            <td colspan="1"><b>PRECIO</b></td>
            <td colspan="1"><b>SUB. TOTALES</b></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tr,key) in datosDetalle" :key="key">
            <td>{{ tr.pro_nombre }} </td>
            <td>{{ tr.total_cantidad}}</td>
            <td>{{ tr.det_ven_valor_u }}</td>
            <!-- <td>{{ parseFloat(tr.total_cantidad) * parseFloat(tr.det_ven_valor_u) }}</td> -->
            <td>{{ tr.total_venta }}</td>
          </tr>
          <tr style="border: none;">
            <td class="font-bold" style="border: none;">
              TOTAL UNIDADES
            </td>
            <td style="border: none;">
              {{ totalUnidades }}
            </td>
            <td class="font-bold" style="border: none;">
              TOTAL
            </td>
            <td style="border: none;">
              {{ total }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-right" style="width: 90%;">
        <div style="width: 200px; text-align: right; display: inline-block;">
          <!-- <div>SUBTOTAL: {{ total }}</div> -->
          <!-- <div>DESC. {{porcentaje_detalle}}%: {{ valorDescuento }}</div> -->
          <!-- <div>TOTAL: {{ total_Descuento }}</div> -->
          <!-- <div>TOTAL: {{ total }}</div> -->
          <!-- <div>SUB. TOTAL: {{ total }}</div>
                <div>DESC. 100%: {{ total }}</div>
                <div>TOTAL: 0.00</div> -->
        </div>
      </div>
      <br><br>
      <div>
        <div class="text-left font-bold">
          <div>ESCUELA: {{ librosObsequios.nombreInstitucion }} </div>
          <div>N° CONTRATO: {{ librosObsequios.contrato_generado }} </div>
          <div>VENDEDOR: {{ librosObsequios.asesor}} </div>
          <div>OBSERVACION: {{observacion_detalle}}</div>
        </div>
      </div>
      <br><br><br>
      <div>
        <div class="text-left font-bold">
          <!-- <div>PORCENTAJE: {{porcentaje_detalle}}%</div> -->
        </div>
      </div>
    </vx-card>
    <div class="w-full p-2 bg-gray-400 text-center">
      <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
    </div>
  </div>
</template>
<script>
  import moment from "moment";
  import html2pdf from "html2pdf.js"
  export default {
    data() {
      return {
        listaEmpresas: [],
        datosDetalle: [],
        // arregloLibros: [],
        datosReporteActa: [],
        anio: '',
        fecha: '',
        telefono: '',
        nombrearchivo: '',
        day: '',
        mes: '',
        year: '',
        empresa: '',
        datos: {
          descuento: '',
          subtotal: '',
          total: '',
        },
        total: 0,
        totalUnidades: 0,
        valorDescuento: 0,
        total_Descuento: 0,
      }
    },
    props: {
      librosObsequios: {
        type: Object,
        default: {},
      },
      observacion_detalle: {
        type: String,
        default: '',
      },
      porcentaje_detalle: {
        type: String,
        default: '',
      },
      tipoFile: {
        type: Number,
        default: 0
      }
    },
    created() {
      let me = this;
      // me.contrato = me.$route.params.id
    },
    mounted() {
      let me = this
      me.day = moment().format('DD');
      me.mes = moment().format('MMMM');
      me.year = moment().format('YYYY')
      // me.getLibros()
      me.getDetalleLibrosObsequios()
      me.nombrearchivo = "DetalleLibrosObsequios_Aprobados_" + me.librosObsequios.contrato_generado
    },
    methods: {
      getDetalleLibrosObsequios() {
        let me = this;
        this.$http.get(this.$server_url + 'obtenerDatosDetalleLibrosTotal?id='+me.librosObsequios.id)
          .then(function (res) {
            me.$vs.loading.close()
            me.$vs.notify({
              text: "Espere mientras se va generando el archivo...",
              color: 'primary',
              iconPack: 'feather',
              icon: 'icon-file',
              time: 3000
            })
            me.datosDetalle = res.data

             me.total = me.datosDetalle.reduce((acc, detalle) => {
              return acc + parseFloat(detalle.total_cantidad) * parseFloat(detalle.det_ven_valor_u);
            }, 0);

            me.totalUnidades = me.datosDetalle.reduce((acc, detalle) => {
              return acc + parseFloat(detalle.total_cantidad);
            }, 0);

            if (me.tipoFile == 0) {
              setTimeout(function () { me.ExportToDoc() }, 1000);
            } else {
              setTimeout(function () { me.imprimirEval() }, 1000);
            }
          })
          .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
          })
      },
      //funcion para obtener el dia de 365
      getDay() {
        const hoy = new Date(); // Crear una instancia del objeto Date
        const año = hoy.getFullYear(); // Obtener el año actual
        const diaDelAño = Math.ceil((hoy - new Date(año, 0, 1)) / 86400000); // Obtener el número del día del año actual (86400000 = número de milisegundos en un día)
        return diaDelAño;
        //console.log("Hoy es el día número " + diaDelAño + " del año " + año); // Mostrar el número del día del año actual en la consola
      },
      // reporteLibrosObsequiosActa(){
      //   let me = this;
      //   me.$vs.loading();
      //   this.$http.get(this.$server_url + 'reporteLibrosObsequiosActa?id_pedido_obsequio='+ me.librosObsequios.id)
      //   .then(res => {
      //       me.datosReporteActa = res.data[0];
      //       me.$vs.loading.close();
      //   })
      //   .catch(err => {
      //       console.error(err);
      //       me.$vs.loading.close();
      //   });
      // },
      getLibros() {
        let me = this
        me.$vs.loading()
        this.$http.get(this.$server_url + 'get_val_pedidoInfo_librosObsequios/' + me.librosObsequios.id_pedido + '/' + me.librosObsequios.id)
          .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
              text: "Espere mientras se va generando el archivo...",
              color: 'primary',
              iconPack: 'feather',
              icon: 'icon-file',
              time: 3000
            })
            let datos = res.data
            var predatos = []
            predatos = datos.filter(p => p.valor > 0)
            me.arregloLibros = predatos.sort(function (a, b) {
              var nombreA = a.nombrelibro.toLowerCase();
              var nombreB = b.nombrelibro.toLowerCase();
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
            if (me.tipoFile == 0) {
              setTimeout(function () { me.ExportToDoc() }, 1000);
            } else {
              setTimeout(function () { me.imprimirEval() }, 1000);
            }
          })
          .catch((e) => {
            me.$vs.loading.close()
          })
      },
      imprimirEval() {
        let me = this
        var element = document.getElementById('seccionImprimir2');
        var opt = {
          margin: 0.5,
          // margin:         [1.5, 0.5, 1, 1],
          filename: me.nombrearchivo + ".pdf",
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' },
          // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
        me.datosDetalle = []
        me.$vs.notify({
          text: "Archivo descargado correctamente",
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-file',
          time: 2000
        })
        me.$emit('change', true)
      },
      ExportToDoc() {
        let me = this
        var filename = me.nombrearchivo
        var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var EndHtml = "</body></html>";
        //complete html
        var html = HtmlHead + document.getElementById("seccionImprimir2").innerHTML + EndHtml;
        //specify the type
        var blob = new Blob(['\ufeff', html], {
          type: 'application/msword'
        });
        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        // Specify file name
        filename = filename ? filename + '.doc' : 'document.doc';
        // Create download link element
        var downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          // Create a link to the file
          downloadLink.href = url;
          // Setting the file name
          downloadLink.download = filename;
          //triggering the function
          downloadLink.click();
        }
        document.body.removeChild(downloadLink);
        me.datosDetalle = []
        me.$vs.notify({
          text: "Archivo descargado correctamente",
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-file',
          time: 2000
        })
        me.$emit('change', true)
      },
    }
  }
</script>
<style scoped>
  .html2canvas-container {
    width: 3000px !important;
    height: 3000px !important;
  }

  * {
    font-family: Arial;
  }

  #ultimo-elemento {
    margin-top: 300px;
  }

  .letra {
    padding: 0px 60px 0px 0px;
    font-size: 11px;
    margin-left: 35px;
  }

  .letra2 {
    font-size: 12px;
  }

  .letra3 {
    display: flex;
    font-size: 11px;
    margin-left: 35px;
  }

  .letra4 {
    margin-top: 15px;
    margin-left: 55px;
    font-size: 11px;
  }

  .letra5 {
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    margin-left: 35px;
    font-size: 11px;
    margin-top: 105px;
  }

  .tabla1 {
    table-layout: fixed;
    width: 95%;
    border-collapse: collapse;
    border: none;
    margin-left: 15px;
  }

  .tabla2 {
    table-layout: fixed;
    width: 90%;
    border-collapse: collapse;
    border: none;
    font-size: 15px;
    margin-top: 15px;

  }

  .sp25 {
    margin-top: 25px;
  }

  .sp55 {
    margin-top: 55px;
  }

  .-mt20 {
    margin-top: -20px;
  }

  @media print {
    td {
      page-break-before: always;
    }

    p {
      page-break-before: always;
    }
  }

  .encabezado,
  td,
  th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
  }

  .rotar {
    font-size: 8px;
    /* writing-mode: vertical-lr;
     transform: rotate(180deg); */
  }

  .font1 {
    font-size: 8px;
  }

  .tabla2 {
    table-layout: fixed;
    width: 90%;
    border-collapse: collapse;
    border: none;
    font-size: 15px;
    margin-top: 15px;
    margin-left: 35px;
    table-layout: auto;
  }
</style>