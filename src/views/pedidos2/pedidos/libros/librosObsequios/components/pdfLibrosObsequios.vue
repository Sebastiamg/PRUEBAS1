<template>
  <div>
    <vx-card id="seccionImprimir2">
      <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
      <h5 class="text-center font-bold">PROMOCIÓN DE VENTAS</h5>
      <h5 class="text-center font-bold" style="margin-top:10px;">ACTA DE ENTREGA</h5>
      <h3 v-if="!datosReporteActa.codigoActa.startsWith('A-')" style="float:right; margin-top: -15px; margin-right: 150px;" class="font-bold">V</h3>
      <h5 v-if="!datosReporteActa.codigoActa.startsWith('A-')" style="float:right; margin-right: -100px;" class="font-bold mt-2">{{ datosReporteActa.codigoActa }}</h5>
      <h5 v-else style="float:right;" class="font-bold mt-2">{{ datosReporteActa.codigoActa }}</h5>
      <p class="letra"><b>Fecha:</b> {{ day }} {{ mes }} {{ year }}</p>
      <br>
      <table style="border: none; text-align: start;">
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>INSTITUCIÓN BENEFICIADA:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ librosObsequios.nombreInstitucion }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
          <td style="border: none; text-align: start;"></td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>RESPONSABLE:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ librosObsequios.asesor }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
          <td style="border: none; text-align: start;"></td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>CI:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ datosReporteActa.cedulaAsesor }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
          <td style="border: none; text-align: start;">
            <p class="letra"><b>TELF:</b> {{ datosReporteActa.telefono }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>DIRECCIÓN:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ datosReporteActa.direccion }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
          <td style="border: none; text-align: start;"></td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>OBSERCACIÓN ASESOR:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ datosReporteActa.observacionAsesor }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
          <td style="border: none; text-align: start;"></td>
        </tr>
      </table>
      <br>
      <p>
        Con esta fecha, se procede a la suscripción de la presente Acta de Entrega - Recepción de los productos que se otorgan en calidad de <b>OBSEQUIOS SIN COSTO</b>, como parte de la PROMOCIÓN DE VENTAS.
      </p>
      <br>
      <table class="tabla2">
        <thead>
          <tr>
            <td colspan="1"><b>LIBROS</b></td>
            <!-- <td colspan="1"><b>PRECIO</b></td> -->
            <td colspan="1"><b>CANTIDAD</b></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tr,key) in arregloLibros" :key="key">
            <td>{{ tr.pro_nombre }} </td>
            <td>{{ tr.p_libros_cantidad}} </td>
          </tr>
        </tbody>
      </table>
      <!-- <p class="letra" style="margin-top: 65px;">
            Elaborado por: {{ librosObsequios.facturador}}
        </p> -->
      <br><br>
      <div>
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align: center;"><b>ENTREGUÉ CONFORME</b></div>
          <div style="text-align: center;"><b>RECIBÍ CONFORME</b></div>
        </div>
      </div>
      <br><br><br>
      <div>
        <div style="display: flex; justify-content: space-between;">
          <div style="text-align: center;">{{datosReporteActa.empresa}} <br> <b>VENDEDOR</b></div>
          <div style="text-align: center;">{{ librosObsequios.nombreInstitucion }} <br> <b>COMPRADOR</b></div>
        </div>
      </div>
    </vx-card>
    <div class="w-full p-2 bg-gray-400 text-center">
      <vs-button color="primary" @click="generarPDF()" type="border">Generar PDF</vs-button>
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
        arregloLibros: [],
        datosReporteActa:[],
        anio: '',
        fecha: '',
        telefono: '',
        nombrearchivo: '',
        day: '',
        mes: '',
        year: '',
        empresa: '',
        nombreEmpresaActual:'',
      }
    },
    props: {
      librosObsequios: {
        type: Object,
        default: {},
      },
      tipoFile: {
        type: Number,
        default: 0
      }
    },
    created() {
      let me = this;
      this.obtenerFecha();
    },
    mounted() {
      let me = this;
      me.empresaActual()
      me.obtenerDetalleLibros();
      me.reporteLibrosObsequiosActa();
      me.nombrearchivo = me.librosObsequios.contrato_generado + "_LibrosObsequios#" + me.librosObsequios.id
    },
    methods: {
      async empresaActual(){
        await this.$http.get(this.$server_url + 'empresaActual')
          .then(res => {
              this.nombreEmpresaActual = res.data[0].descripcion_corta;
          })
          .catch(err => {
              console.log(err);
          });
      },
      obtenerFecha() {
        this.day = moment().format('DD');
        this.mes = moment().format('MMMM');
        this.year = moment().format('YYYY');
      },
      //funcion para obtener el dia de 365
      getDay() {
        const hoy = new Date(); // Crear una instancia del objeto Date
        const año = hoy.getFullYear(); // Obtener el año actual
        const diaDelAño = Math.ceil((hoy - new Date(año, 0, 1)) / 86400000); // Obtener el número del día del año actual (86400000 = número de milisegundos en un día)
        return diaDelAño;
        //console.log("Hoy es el día número " + diaDelAño + " del año " + año); // Mostrar el número del día del año actual en la consola
      },
      reporteLibrosObsequiosActa(){
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url + 'reporteLibrosObsequiosActa?id_pedido_obsequio='+ me.librosObsequios.id)
        .then(res => {
            me.datosReporteActa = res.data[0];
            me.$vs.loading.close();
        })
        .catch(err => {
            console.error(err);
            me.$vs.loading.close();
        });
      },
      obtenerDetalleLibros() {
        let me = this;
        this.$http.get(this.$server_url + 'obtenerDatosDetalleLibros/' + me.librosObsequios.id)
        .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
              text: "Espere mientras se va generando el archivo...",
              color: 'primary',
              iconPack: 'feather',
              icon: 'icon-file',
              time: 3000
            })
            me.reporteLibrosObsequiosActa()
            let datos = res.data
            var predatos = []
            me.arregloLibros = datos
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
        me.arregloLibros = []
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
        me.arregloLibros = []
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
    font-size: 11px;
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
    font-size: 11px;
    margin-top: 15px;
    margin-left: 35px;
  }
</style>
