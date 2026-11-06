<template>
  <div>
      <vx-card id="seccionImprimir2">
        <div align="center">
          <h2 class="text-center font-bold">Reporte de Alcance</h2>
          <h2 class="text-center font-bold mt-2">{{ alcance.contrato_generado  }}</h2>
        </div>
          <p class="letra"><b>Fecha:</b> {{ day }} {{ mes }} {{ year }}</p>
          <br>
          <p class="letra"><b>Institución:</b> {{ alcance.nombreInstitucion }}</p>
          <p class="letra"><b>Asesor:</b> {{ alcance.asesor }}</p>
          <br>
          <table class="table-custom">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>LIBRO</th>
                <th>PRECIO</th>
                <th>CANTIDAD</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tr, key) in arregloLibros" :key="key">
                <td>{{ tr.codigo_liquidacion }}</td>
                <td>{{ tr.nombrelibro }}</td>
                <td>{{ tr.precio }}</td>
                <td>{{ tr.valor }}</td>
              </tr>
            </tbody>
          </table>
        <p style="text-align: left;margin-top: 20px;" v-if="alcance.observacion_asesor && alcance.observacion_asesor !== 'null' && alcance.observacion_asesor.trim() !== ''">
          <b>Observacion asesor:</b> {{ alcance.observacion_asesor }}
        </p>

        <p class="letra" style="margin-top: 65px;">
            Elaborado por: {{ alcance.facturador}}
        </p>
      </vx-card>
      <!-- <div class="w-full p-2 bg-gray-400 text-center">
          <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
      </div> -->
  </div>
</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
import imprimirMixin from "@/mixins/Pedidosmix";
export default{
  mixins:[imprimirMixin],
  data(){
      return{
          arregloLibros:[],
          anio:'',
          fecha:'',
          telefono:'',
          nombrearchivo:'',
          day:'',
          mes:'',
          year:'',
          mixinIdInicioFormatoNewData: null,
      }
  },
  props:{
    alcance:{
      type:Array,
      default:{},
    },
    tipoFile:{
      type:Number,
      default:0
    }
  },
  created(){
      let me = this;
      // me.contrato = me.$route.params.id
  },
  mounted(){
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
      me.day = moment().format('DD');
      me.mes = moment().format('MMMM');
      me.year = moment().format('YYYY')
      me.getLibros()
      me.nombrearchivo = me.alcance.contrato_generado+"_Alcance#"+me.alcance.id
  },
  methods:{
      //funcion para obtener el dia de 365
      getDay(){
          const hoy = new Date(); // Crear una instancia del objeto Date
          const año = hoy.getFullYear(); // Obtener el año actual
          const diaDelAño = Math.ceil((hoy - new Date(año, 0, 1)) / 86400000); // Obtener el número del día del año actual (86400000 = número de milisegundos en un día)
          return diaDelAño;
          //console.log("Hoy es el día número " + diaDelAño + " del año " + año); // Mostrar el número del día del año actual en la consola
      },
      getLibros(){
          let me = this
          me.$vs.loading()
          let resultado1 = '';
          if(me.alcance.id_periodo <= me.mixinIdInicioFormatoNewData){
            resultado1 = 'get_val_pedidoInfo_alcance/';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance/'+me.alcance.id_pedido+'/'+me.alcance.id);
          }else if(me.alcance.id_periodo > me.mixinIdInicioFormatoNewData){
            resultado1 = 'get_val_pedidoInfo_alcance_new/';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance_new/'+me.alcance.id_pedido+'/'+me.alcance.id);
          }
          this.$http.get(this.$server_url+resultado1+me.alcance.id_pedido+'/'+me.alcance.id)
          .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text: "Espere mientras se va generando el archivo...",
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-file',
            time:3000
            })
            let datos = res.data
            var predatos = []
            predatos = datos.filter(p => p.valor > 0)
                me.arregloLibros = predatos.sort(function(a, b) {
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
            if(me.tipoFile == 0){
              setTimeout(function() {me.ExportToDoc()}, 1000);
            }else{
              setTimeout(function() {
                me.m_imprimirTodos('12px',me.nombrearchivo ,'2px','')
                me.$emit('change',true)
              }, 1000);
            }
          })
          .catch((e) => {
              me.$vs.loading.close()
          })
      },
      // imprimirEval(){
      //     let me = this
      //     var element = document.getElementById('seccionImprimir2');
      //     var opt = {
      //         margin:       0.5,
      //         // margin:         [1.5, 0.5, 1, 1],
      //         filename:     me.nombrearchivo+".pdf",
      //         image:        { type: 'jpeg', quality: 0.98 },
      //         html2canvas:    {scale: 2},
      //         pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' }  ,
      //         // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      //         jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
      //         //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      //     };
      //     html2pdf().from(element).set(opt).save();
      //     me.arregloLibros   = []
      //     me.$vs.notify({
      //         text: "Archivo descargado correctamente",
      //         color: 'success',
      //         iconPack: 'feather',
      //         icon: 'icon-file',
      //         time:2000
      //     })
      //     me.$emit('change',true)
      // },
      ExportToDoc(){
        let me = this
        var filename = me.nombrearchivo
        var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var EndHtml = "</body></html>";
        //complete html
        var html = HtmlHead +document.getElementById("seccionImprimir2").innerHTML+EndHtml;
        //specify the type
        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });
        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        // Specify file name
        filename = filename?filename+'.doc':'document.doc';
        // Create download link element
        var downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if(navigator.msSaveOrOpenBlob ){
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = url;
            // Setting the file name
            downloadLink.download = filename;
            //triggering the function
            downloadLink.click();
        }
        document.body.removeChild(downloadLink);
        me.arregloLibros   = []
        me.$vs.notify({
            text: "Archivo descargado correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-file',
            time:2000
        })
        me.$emit('change',true)
      },
  }
}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
  font-family: Arial;
}
#ultimo-elemento {
  margin-top: 300px;
}
.letra{
  padding:0px 60px 0px 0px;
  font-size: 11px;
  margin-left: 35px;
}
.letra2{
  font-size: 12px;
}
.letra3{
  display: flex;
  font-size: 11px;
  margin-left: 35px;
}
.letra4{
  margin-top: 15px;
  margin-left: 55px;
  font-size: 11px;
}
.letra5{
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
.tabla2{
  table-layout: fixed;
  width: 90%;
  border-collapse: collapse;
  border: none;
  font-size: 11px;
  margin-top: 15px;

}
.sp25{
  margin-top: 25px;
}
.sp55{
  margin-top: 55px;
}
.-mt20{
  margin-top: -20px;
}
@media print {
  td {page-break-before: always;}
  p  {page-break-before: always;}
}
.encabezado ,td,th {
  border: 1px solid rgb(227, 227, 227);
  text-align: center;
  border-spacing: 0;
}
.rotar{
  font-size: 8px;
  /* writing-mode: vertical-lr;
   transform: rotate(180deg); */
}
.font1{
  font-size: 8px;
}
.tabla2{
  table-layout: fixed;
  width: 90%;
  border-collapse: collapse;
  border: none;
  font-size: 11px;
  margin-top: 15px;
  margin-left: 35px;
}



.table-custom {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
  margin-top: 15px;
}

.table-custom th,
.table-custom td {
  border: 1px solid #444;
  padding: 8px;
  text-align: left;
}

.table-custom thead {
  background-color: #2c3e50;
  color: white;
}

.table-custom tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table-custom tbody tr:hover {
  background-color: #d0e8ff;
}

</style>
