<template>
  <div v-if="datosListos">
    <vx-card id="seccionImprimir2">
      <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
      <h5 class="text-center font-bold">PROMOCIÓN DE VENTAS</h5>
      <h5 class="text-center font-bold" style="margin-top:10px;">ACTA DE ENTREGA</h5>

      <h3 v-if="codigoActa && codigoActa.ven_codigo && !codigoActa.ven_codigo.startsWith('A-')" style="float:right; margin-top: -15px; margin-right: 150px;" class="font-bold">V</h3>

      <h5 class="text-center font-bold" v-if="codigoActa && !codigoActa.ven_codigo.startsWith('A-')" style="float:right; margin-right: -100px;">{{ codigoActa.ven_codigo }}</h5>

      <h5 v-else-if="codigoActa" class="text-center font-bold mt-2" style="float:right;">{{ codigoActa.ven_codigo }}</h5>

      <p class="letra"><b>Fecha:</b> {{ librosObsequios.ven_fecha}}</p>
      <br>
      <table style="border: none; text-align: start;">
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>INSTITUCIÓN BENEFICIADA:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ datosReporteActa.institucionNombre }}</p>
          </td>
          <td style="border: none; text-align: start;"></td>
          <td style="border: none; text-align: start;"></td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; text-align: start;">
            <p class="letra"><b>RESPONSABLE:</b></p>
          </td>
          <td style="border: none; text-align: start;">
            <p class="letra">{{ datosReporteActa.asesor }}</p>
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
          <!-- <tr v-for="(tr,key) in arregloLibros" :key="key">
            <td>{{ tr.pro_nombre }} </td>
            <td>{{ tr.p_libros_cantidad}} </td>
          </tr> -->
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
          <div style="text-align: center;">{{ datosReporteActa.institucionNombre }} <br> <b>COMPRADOR</b></div>
        </div>
      </div>
    </vx-card>
  </div>
</template>
<script>
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
        codigoActa: [],
        datosListos: false,
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
    mounted() {
      let me = this;
      me.codigoActa = me.librosObsequios.ven_codigo;
      me.reporteLibrosObsequiosActa();
      me.empresaActual()
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
      reporteLibrosObsequiosActa(){
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url + 'reporteLibrosObsequiosActa?ven_codigo='+ me.codigoActa)
        .then(res => {
            me.datosReporteActa = res.data[0];
            me.obtenerDetalleDocumentosLibrosObsequios();
            me.$vs.loading.close();
        })
        .catch(err => {
            console.error(err);
            me.$vs.loading.close();
        });
      },
      obtenerDetalleDocumentosLibrosObsequios(){
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url + 'obtenerDetalleDocumentosLibrosObsequios?ven_codigo='+ me.codigoActa)
        .then(res => {
            me.arregloLibros = res.data[0];
            me.$vs.loading.close();
            this.datosListos = true;
        })
        .catch(err => {
            console.error(err);
            me.$vs.loading.close();
        });
      },
    }
  }
</script>
<style scoped>

  * {
    font-family: Arial;
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
