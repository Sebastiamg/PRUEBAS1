<template>
    <div>
      <div class="w-full p-2 bg-gray-400 text-center">
          <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir PDF</vs-button>
          <vs-button color="dark" class="ml-5" @click="ExportToDoc()" type="border">Imprimir Word</vs-button>
      </div>
      <vx-card id="seccionImprimir2" style="padding-left: 35px!important;margin-right: 10px!important;">
          <p style="display: flex;justify-content: end;">
              <small  style="text-align: right;">{{ getFechaContrato(arregloContrato[0]) }} </small>
          </p>
          <h2 style="text-align: center;">ACUERDO DE COMPRA - VENTA <span style="margin-left: 45px;">{{ contrato }}</span></h2>
          <p class="letra" style="margin-top: 25px;">
              En la ciudad de Quito a los {{ day }} días del mes de {{ mes }} del {{ year }} convienen en celebrar el presente
              ACUERDO DE COMPRA Y VENTA, por una parte {{ (arregloContrato[0].asesor).toUpperCase() }} a quien en adelante se denominará PROVEEDOR VENDEDOR
              y {{ (arregloContrato[0].nombreInstitucion).toUpperCase() }} representada en este oportunidad por {{ arregloContrato[0].beneficiario.toUpperCase() }} con
              C.I {{ arregloContrato[0].beneficiario_cedula }} al que en adelante  se denominará como COMPRADOR, contenido en las siguientes
              clausulas:
          </p>
          <p class="mt-3 letra">
              PRIMERO.- {{ (arregloContrato[0].nombreInstitucion).toUpperCase() }}, ubicada en {{ arregloContrato[0].nombre_ciudad.toUpperCase() }}, {{ telefono }}
              solicita para impartir sus clases didácticas al proveedor vendedor, los siguientes textos:
          </p>
          <table class="letra" style="margin: 0 auto;margin-top: 31px;">
              <thead>
                  <tr>
                      <th>CODIGO</th>
                      <th>DESCRIPCION</th>
                      <th>CANTIDAD</th>
                      <th>VALOR</th>
                      <th>TOTAL</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(tr,key) in arregloLibros" :key="key">
                      <td>{{ tr.codigo_liquidacion }}</td>
                      <td>{{ tr.nombrelibro.toUpperCase() }}</td>
                      <td>{{ tr.valor }}</td>
                      <td>{{ tr.precio}} </td>
                      <td>{{ tr.subtotal.toFixed(2) }}</td>
                  </tr>
                  <tr>
                      <td colspan="3"></td>
                      <td><b>TOTAL</b></td>
                      <td><b>{{ sumaTotal }}</b></td>
                  </tr>
              </tbody>
          </table>
          <p class="letra" style="margin-top: 60px;">
              SEGUNDO.- COMPROMISO DE COMPRA EL COMPRADOR, {{ (arregloContrato[0].nombreInstitucion).toUpperCase() }} a través de su
              representante {{ arregloContrato[0].beneficiario.toUpperCase() }} se compromete a la adquisición
              del total de los libros detallados en la claúsula primera o en cantidad mayor al
              vendedor a través de listas de útiles en cualquier libreria de la localidad.
          </p>
          <p class="mt-3 letra" v-if="arregloContrato[0].ifanticipo == 1">
              TERCERA.- INCENTIVO Y FORMA DE PAGO: El vendedor otorga al comprador como incentivo el {{ beneficiario.comision }}%
              de descuento valor del cual se cancela por anticipado ${{ arregloContrato[0].anticipo_aprobado }} mediante
              Cheque Nº: O de la cuenta Nº del No Aplica y la diferencia a la liquidación final una vez verificado el número que hayan adquirido los textos
          </p>
          <p class="mt-3 letra" v-if="arregloContrato[0].ifanticipo == 0 || arregloContrato[0].ifanticipo == null">
              TERCERA.- INCENTIVO Y FORMA DE PAGO: El vendedor otorga al comprador como incentivo el {{ beneficiario.comision }}%
              de descuento asi mismo se cancelará a la liquidación final una vez verificado el número
              de alumnos que hayan adquirido los textos.
          </p>
          <p class="mt-3 letra">
              CUARTO.- PLAZO DE ENTREGA EL PROVEEDOR-VENDEDOR, se compromete a entregar
              oportunamente los libros requeridos por el COMPRADOR en la cantidad suficiente
              para cubrir la demanda solicitada.
          </p>
          <p class="letra">
              En caso de divergencias en el contenido del presente COMPROMISO DE COMPRA-VENTA,
              las partes acuerdan, en primera instancia a resolver las controversias en forma
              pacifica y de no ser asi sujetarse a los jueces competentes de QUITO en
              trámite verbal sumario.
          </p>
          <p class="mt-3 letra">
              Para constancia de lo anteriormente escrito, las partes suscriben el presente
              compromiso en duplicado y de igual contenido.
          </p>
          <div  style="margin-top: 95px;display: flex;">
              <table>
                  <tr>
                      <td colspan="3"></td>
                      <td colspan="1"><p class="letra">{{ arregloContrato[0].beneficiario_nombres.toUpperCase() }}</p>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3">PROVEEDOR-VENDEDOR</td>
                      <td colspan="1"><p class="letra">{{ arregloContrato[0].beneficiario_apellidos.toUpperCase() }}</p>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3"></td>
                      <td colspan="1"><p class="letra">RUC: {{ arregloContrato[0].beneficiario_cedula }}</p>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3"></td>
                      <td colspan="1"><p class="letra">{{ (arregloContrato[0].nombreInstitucion).toUpperCase() }}</p>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3"></td>
                      <td colspan="1"><p class="letra">COMPRADOR</p>
                      </td>
                  </tr>

              </table>
          </div>
          <p class="letra" style="margin-top: 65px;">
              Elaborado por: {{ (arregloContrato[0].facturador).toUpperCase() }}
          </p>
      </vx-card>
    </div>
</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
import Pedidosmix from "../../../mixins/Pedidosmix";
export default{
  mixins:[Pedidosmix],
    data(){
        return{
            arregloContrato:[],
            arregloLibros:[],
            contrato:'',
            day:'',
            mes:'',
            year:'',
            anio:'',
            fecha:'',
            telefono:'',
            nombrearchivo:'',
            //fechas generar contrato
            dayGenerar:'',
            mesGenerar:'',
            yearGenerar:'',
            mixinIdInicioFormatoNewData: null,
        }
    },
    props:{
        id_beneficiario_pedido:{
            type:Number,
            default:0
        },
        contrato:{
            type:String,
            default:''
        },
        tipoFile:{
            type:Number,
            default:0
        },
        beneficiario:{
            type:String,
            default:''
        },
        id_periodo:{
            type:String,
            default:''
        }
    },
    computed:{
        sumaTotal(){
            let me = this;
            if(me.arregloLibros.length >0){
                let datos = me.arregloLibros.filter(p => p.subtotal)
                let total = datos.reduce((a, b) => a + (b["subtotal"] || 0), 0);
                return total.toFixed(2)
            }
        },
    },
    created(){
        let me = this;
        moment.lang("es")
        me.day = moment().format('DD');
        me.mes = moment().format('MMMM');
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
        me.nombrearchivo = me.contrato+".pdf"
        //me.contrato = me.$route.params.id
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
        me.getPedidos()
    },
    methods:{
        getFechaContrato(item){
            let me = this;
            const fechaGenerarC =  item.fecha_generacion_contrato.substring(0,10)
            me.dayGenerar       = moment(fechaGenerarC).format('DD');
            me.mesGenerar       = moment(fechaGenerarC).format('MMMM');
            me.yearGenerar      = moment(fechaGenerarC).format('YYYY')
            var resultado       = me.dayGenerar +" de "+me.mesGenerar + " "+me.yearGenerar
            return resultado
        },
        getPedidos(){
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url+'get_pedidos_periodo_Only_contrato/'+me.contrato+'/'+me.id_beneficiario_pedido)
            .then(res => {
                me.$vs.loading.close();
                me.arregloContrato = res.data
                if(me.arregloContrato[0].fecha_generacion_contrato == null || me.arregloContrato[0].fecha_generacion_contrato == ""  || me.arregloContrato[0].fecha_generacion_contrato == undefined){
                  me.$vs.notify({
                  text: "El contrato NO tiene fecha de creación. No se puede generar el contrato....",
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-file',
                  time:4000
                  })
                  me.$emit('change',true)
                  return
                }
                me.$vs.notify({
                text: "Espere mientras se va generando el archivo...",
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-file',
                time:3000
                })
                setTimeout(() => {
                    me.getLibros(me.arregloContrato[0].id_pedido)
                    if(me.arregloContrato[0].telefonoInstitucion == "" || me.arregloContrato[0].telefonoInstitucion == null || me.arregloContrato[0].telefonoInstitucion == 0){
                        me.telefono = ""
                    }else{
                        me.telefono = "telef. "+me.arregloContrato[0].telefonoInstitucion+","
                    }
                }, 3000);
            })
        },
        getLibros(id_pedido){
            let me = this
            me.arregloLibros = []
            let nuevaruta = '';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo/'+id_pedido)
            if (me.arregloContrato[0].id_periodo <= me.mixinIdInicioFormatoNewData) {
              nuevaruta = 'get_val_pedidoInfoTodo/';
            }else if(me.arregloContrato[0].id_periodo > me.mixinIdInicioFormatoNewData){
              nuevaruta = 'get_val_pedidoInfoTodo_new/';
            }else{
              return "No hay periodo";
            }
            // this.$http.get(this.$server_url+'get_val_pedidoInfo/'+id_pedido)
            this.$http.get(this.$server_url+nuevaruta+id_pedido)
            .then(res => {
              let datos = res.data
              if(datos.length > 0){
                let datos2 = datos.filter(p => p.valor > 0)
                //setear ARRAY
                let preSetear = []
                datos2.forEach(element => {
                  let cal                 = new Object();
                  cal.idlibro             = element.idlibro
                  cal.codigo_liquidacion  = element.codigo_liquidacion
                  cal.nombrelibro         = element.nombrelibro
                  cal.valor               = element.valor
                  cal.precio              = element.precio
                  preSetear.push(cal)
                });
                //Generate unique array
                var preTemplate = []
                datos2.forEach(element => {
                  let cal = new Object();
                  cal.idlibro             = element.idlibro
                  cal.codigo_liquidacion  = element.codigo_liquidacion
                  cal.nombrelibro         = element.nombrelibro
                  cal.precio              = element.precio
                  preTemplate.push(cal)
                });
                //CLEAR REPEAT
                //quitar duplicados
                let hash = {};
                var preArrayUnico = []
                let resultado = preTemplate.filter(o => hash[o.nombrelibro] ? false : hash[o.nombrelibro] = true);
                preArrayUnico  = resultado
                //////
                //SUMAR VALORES PEDIDO + ALCANCES
                const sumarValores = preSetear.reduce((acc,valor) =>{
                  if(acc[valor.idlibro]){
                    acc[valor.idlibro] += valor.valor
                  }else{
                    acc[valor.idlibro] = valor.valor
                  }
                  return acc
                },{})
                //PASAR AL AREGLO UNICO LOS VALORES SUMADOS POR  LIBRO
                const result = preArrayUnico.map((obj) => {
                    obj["valor"] = sumarValores[obj.idlibro];
                    return obj;
                });
                //OBTENER VALORES DE VALOR * CANTIDAD
                var arrayListo = []
                result.forEach(element => {
                  let cal3 = new Object();
                  cal3.idlibro            = element.idlibro
                  cal3.nombrelibro        = element.nombrelibro
                  cal3.codigo_liquidacion = element.codigo_liquidacion
                  cal3.precio             = element.precio
                  cal3.valor              = element.valor
                  cal3.subtotal           = element.valor * element.precio
                  arrayListo.push(cal3)
                });
                // console.log("rock",arrayListo)
                // me.arregloLibros = result

                ///===ORDENAR ARRAY ==
                me.arregloLibros = arrayListo.sort(function(a, b) {
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
                /*if(me.tipoFile == 0){
                    setTimeout(function() {me.ExportToDoc()}, 1000);
                }else{
                    setTimeout(function() {me.imprimirEval()}, 1000);
                }*/
              }//end if
            })
        },
        imprimirEval(){
            let me = this
            // var element = document.getElementById('seccionImprimir2');
            // var opt = {
            //     margin:       0.5,
            //     // margin:         [1.5, 0.5, 1, 1],
            //     filename:     me.nombrearchivo,
            //     image:        { type: 'jpeg', quality: 0.98 },
            //     html2canvas:    {scale: 2},
            //     pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' }  ,
            //     // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            //     jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
            //     //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            // };
            // html2pdf().from(element).set(opt).save();
            // me.arregloContrato = []
            // me.arregloLibros   = []
            // me.telefono        = ''
            me.m_imprimirTodos('11px',me.nombrearchivo ,'0px','')
            me.$vs.notify({
                text: "Archivo descargado correctamente",
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-file',
                time:2000
            })
            me.$emit('change',true)
        },
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
            me.arregloContrato = []
            me.arregloLibros   = []
            me.telefono        = ''
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
.letra{
    padding:0px 60px 0px 0px;
    font-size: 11px;
}
table {
  table-layout: fixed;
  width: 90%;
  border-collapse: collapse;
  border: none;
}
th{
    text-decoration: underline;
}
thead th:nth-child(1) {
  width: 10%;
}

thead th:nth-child(2) {
  width: 30%;
}

thead th:nth-child(3) {
  width: 15%;
}

thead th:nth-child(4) {
  width: 15%;
}
thead th:nth-child(5) {
  width: 20%;
}
@media print {
    td {page-break-before: always;}
    p  {page-break-before: always;}
}
/* th, td {
  padding: 20px;
} */
</style>
