<template>
    <div>
        <vx-card id="seccionImprimir2" v-if="arregloContrato.length > 0" style="padding-left: 20px!important;padding-right: 15px!important;margin-right: 10px!important;">
            <h6 class="text-center font-bold" style="margin-bottom: 20px;">PAGARÉ A LA ORDEN</h6>

            <p class="letra" style="margin-top: 12px;">
                <b>No.: {{ numeroPagare }}</b>
            </p>

            <p class="letra" style="margin-top: 12px;">
                <b>POR: USD {{ valorMostar | filtrarDecimal2 }}</b>
            </p>

            <p class="letra" style="margin-top: 15px; text-align: justify;">
                Debo y pagaré incondicionalmente a la orden de <b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b>,
                con RUC No. {{ empresaSelected.ruc }}, a los {{ numeroALetras(getDay(arregloContrato[0])) }}
                <b>({{ getDay(arregloContrato[0]) }})</b> días contados desde la fecha de suscripción del presente pagaré,
                en la ciudad de Quito, Distrito Metropolitano,
                la cantidad de <b>USD {{ valorMostar | filtrarDecimal2 }} ({{ numeroALetras(valorMostar).toUpperCase() }} DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA).</b>
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                A esta cantidad se sumarán los intereses calculados sobre el capital indicado a la tasa máxima
                convencional permitida por el Banco Central del Ecuador vigente a la fecha de mora, los cuales
                se calcularán desde la fecha de suscripción del presente documento hasta la cancelación total
                de la obligación.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                En caso de incumplimiento del pago en el plazo acordado, el acreedor podrá declarar vencida
                la totalidad de la obligación y demandar el pago del capital, más los intereses legales y de
                mora permitidos conforme las regulaciones del Banco Central del Ecuador, así como todos los
                gastos judiciales, extrajudiciales y honorarios profesionales que ocasione su cobro.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                Para el cumplimiento de esta obligación me obligo con todos mis bienes presentes y futuros.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                Renuncio a mi domicilio y me someto a los jueces de lo civil con jurisdicción en la ciudad
                de Quito, Distrito Metropolitano, y al trámite
                ejecutivo conforme la ley.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                Expresamente acepto que el acreedor pueda transferir o endosar en cualquier momento los derechos
                que emanan del presente documento, sin que sea necesaria notificación alguna de mi parte.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                Excuso la presentación para el pago, así como los avisos por falta de pago. Sin protesto.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                Declaro además que he recibido a mi entera satisfacción la cantidad indicada en el presente
                pagaré, por lo que reconozco expresamente la obligación aquí contenida.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                Asimismo, reconozco que la firma estampada en este documento es auténtica y corresponde a mi
                puño y letra, obligándome al cumplimiento íntegro de lo estipulado en el presente pagaré.
            </p>

            <p class="letra" style="margin-top: 10px; text-align: justify;">
                El deudor reconoce además que el presente documento constituye título ejecutivo, por contener
                una obligación clara, pura, determinada y exigible, conforme la ley.
            </p>

            <p class="letra" style="margin-top: 20px;">
                Quito, Distrito Metropolitano, {{ getFechaContrato(arregloContrato[0]) }}.
            </p>

            <p class="letra" style="margin-top: 60px;">
                FIRMA DEL DEUDOR: ___________________________
            </p>

            <p class="letra" style="margin-top: 60px;">
                HUELLA DIGITAL DEL DEUDOR: __________________
            </p>

            <p class="letra mt-3">
                <b>NOMBRES Y APELLIDOS:</b> {{ arregloContrato[0].beneficiario.toUpperCase() }}
            </p>
            <p class="letra mt-2">
                <b>C.I.:</b> {{ arregloContrato[0].cedula_beneficiario }}
            </p>
            <p class="letra mt-2">
                <b>Dirección:</b> {{ arregloContrato[0].direccionBenefiario.toUpperCase() }}
            </p>
            <p class="letra mt-2">
                <b>Ciudad:</b> {{ arregloContrato[0].nombre_ciudad.toUpperCase() }}
            </p>
            <p class="letra mt-3">
                <b>DEUDOR</b>
            </p>
        </vx-card>
        <div class="w-full p-2 bg-gray-400 text-center">
            <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
        </div>
    </div>

</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
            arregloContrato:[],
            // contrato:'',
            day:'',
            mes:'',
            anio:'',
            fecha:'',
            telefono:'',
            nombrearchivo:'',
            year:'',
            //fecha generar contrato
            yearGenerar:'',
            mesGenerar:'',
            dayGenerar:'',
            valorMostar:0,
        }
    },
    props:{
      id_beneficiario_pedido:{
        type:Number,
        default:0
      },
      id_pedido:{
        type:Number,
        default:0
      },
      contrato:{
        type:String,
        default:''
      },
      aniosAnteriorSelect:{
        type:String,
        default:''
      },
      empresaSelected:{
        type:Object,
        default:function(){
          return {}
        }
      },
      //0 => convenio global; 1 => pago de convenio ; 2 => anticipo
      ifTipoPago:{
        type:Number,
        default:0
      },
      pagoConvenio:{
        type:Object,
        default:function(){
          return {}
        }
      },
      anticipoPedido:{
        type:Object,
        default:function(){
          return {}
        }
      },
      convenioGlobal:{
        type:Object,
        default:function(){
          return {}
        }
      },
      numeroPagare:{
        type:String,
        default:''
      },
    },
    created(){
      let me = this;
      moment.lang("es")
      me.day = moment().format('DD');
      me.mes = moment().format('MMMM');
      me.year = moment().format('YYYY')
      me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
      me.nombrearchivo = 'Pagare -'+ me.contrato+".pdf"
      //me.contrato = me.$route.params.id
    },
    mounted(){
      let me = this
      me.getPedidos()
    },
    methods:{
      getPedidos(){
        let me = this
        me.valorMostar = 0
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_pedidos_periodo_Only_pedido/'+me.id_pedido+'/'+me.id_beneficiario_pedido)
        .then(res => {
            me.$vs.loading.close();
            me.arregloContrato = res.data
            if(me.arregloContrato.length > 0){
              if(me.ifTipoPago == 0){
                me.valorMostar = me.convenioGlobal.valor
              }else if(me.ifTipoPago == 1){
                me.valorMostar = me.pagoConvenio.valor
              }else if(me.ifTipoPago == 2){
                me.valorMostar = me.anticipoPedido.valor
              }
            }
            me.$vs.notify({
            text: "Espere mientras se va generando el archivo...",
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-file',
            time:3000
            })
            setTimeout(function() {me.imprimirEval()}, 1000);
        })
      },
      imprimirEval(){
        let me = this
        var element = document.getElementById('seccionImprimir2');
        var opt = {
            margin:       0.5,
            // margin:         [1, 0.5, 0.5, 1],
            filename:     me.nombrearchivo,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:    {scale: 3, letterRendering: true},
            //pagebreak:      {mode: 'avoid-all',before: "#page2"},
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            //jsPDF: {unit: 'pt', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().from(element).set(opt).save();
        me.arregloContrato = []
        me.$vs.notify({
            text: "Archivo descargado correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-file',
            time:2000
        })
        me.$emit('change',true)
      },
      getDay(item){
          let me = this
          const fechaGenerarC =  item.fecha_generar_contrato.substring(0,10)
          var preFechaLimite = ""
          var preyear        = me.aniosAnteriorSelect
            //costa -> hasta 30 de septiembre
            if(item.tregion == 2){
            return me.calculoFechaLimite(preyear,2,fechaGenerarC)
            //preFechaLimite = preyear + "-"+ '09'+"-"+"30"
          }
          //sierra -> hasta 31 de diciembre
          else{
            return me.calculoFechaLimite(preyear,1,fechaGenerarC)
              //preFechaLimite = preyear + "-"+ '12'+"-"+"31"
          }
        },
        calculoFechaLimite(fechaFin,region,fechaGenerarC){
          let me = this;
          //SIERRA
          if(region == 1){
            return me.obtenerDiasXAnio(region,fechaGenerarC,fechaFin)
          }
          //COSTA
          const arrayDeAnios = me.generarArrayDeAnios(me.year, fechaFin);
          var anioUltimo = 0
          if(arrayDeAnios.length > 1){
            anioUltimo = arrayDeAnios.length -1
          }
          let  resultadoDays = 0
          for(let i = 0; i< arrayDeAnios.length; i++){
            let FInicio = ""
            let FFin    = ""
            var anioEnCurso = arrayDeAnios[i]
            var result      = 0
            if(arrayDeAnios.length == 1){
              if(i == 0){
                //fecha inicio del contrato
                FInicio = fechaGenerarC
                FFin    = arrayDeAnios[i] + "-"+ '09'+"-"+"30"
                // result = me.obtenerDiasXAnio(region,FInicio,arrayDeAnios[i])+1
                result = me.obtenerDiasXAnio(region,FInicio,FFin)+1
              }
            }else{
              if(i == 0){
                //fecha inicio del contrato
                FInicio = fechaGenerarC
                FFin    = arrayDeAnios[i] + "-"+ '12'+"-"+"31"
                // result = me.obtenerDiasXAnio(region,FInicio,arrayDeAnios[i])+1
                result = me.obtenerDiasXAnio(region,FInicio,FFin)+1
              }
              if(i == anioUltimo){
                //fecha inicio del año
                FInicio = anioEnCurso+'/01/01'
                FFin    = arrayDeAnios[i] + "-"+ '09'+"-"+"30"
                result = me.obtenerDiasXAnio(region,FInicio,FFin) +1
              }
              if(i != anioUltimo && i != 0){
                //fecha inicio del año
                FInicio = anioEnCurso+'/01/01'
                FFin    = arrayDeAnios[i] + "-"+ '12'+"-"+"31"
                result = me.obtenerDiasXAnio(region,FInicio,FFin) +1
              }
            }
            console.log("ii",result)
            resultadoDays += result
          }
          if(arrayDeAnios.length == 1){
            resultadoDays = resultadoDays
            return resultadoDays
          }else{
            console.log("uno",resultadoDays)
            resultadoDays = resultadoDays
            console.log("dos",resultadoDays)
            return resultadoDays
          }
        },
        obtenerDiasXAnio(region,FInicio,FFin){
          let me = this;
          var preFechaLimite = ""
            //costa -> hasta 30 de septiembre
            if(region == 2){
              // preFechaLimite = FFin + "-"+ '09'+"-"+"30"
              preFechaLimite = FFin

            }
            //sierra -> hasta 31 de diciembre
            else{
              preFechaLimite = FFin + "-"+ '12'+"-"+"31"
            }
            var fechaInicio = new Date(FInicio);
            var fechaFin = new Date(preFechaLimite);
            //proceso de calcular los dias
            // Calcular la cantidad de tiempo en milisegundos entre las dos fechas
            var tiempoMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
            // Convertir la cantidad de tiempo de milisegundos a días
            var diasEntreFechas = tiempoMilisegundos / (1000 * 3600 * 24);
            // Redondear el resultado a un número entero
            diasEntreFechas = Math.round(diasEntreFechas);
            return diasEntreFechas
        },
        generarArrayDeAnios(inicio, fin) {
            const arrayAnios = [];
            for (let i = inicio; i <= fin; i++) {
              arrayAnios.push(i);
            }
          return arrayAnios;
        },
      getFechaContrato(item){
        let me = this;
        const fechaGenerarC =  item.fecha_generar_contrato.substring(0,10)
        me.dayGenerar       = moment(fechaGenerarC).format('DD');
        me.mesGenerar       = moment(fechaGenerarC).format('MMMM');
        me.yearGenerar      = moment(fechaGenerarC).format('YYYY')
        var resultado       = me.dayGenerar +" de "+me.mesGenerar + " "+me.yearGenerar
        return resultado
      },
      numeroALetras(numero) {
        // Manejo de decimales para montos
        let parteEntera = Math.floor(numero);
        let parteDecimal = Math.round((numero - parteEntera) * 100);

        let unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        let especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
        let decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        let centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

        const convertirNumero = (num) => {
          if (num === 0) {
              return 'cero';
          }

          if (num < 0) {
              return 'menos ' + convertirNumero(Math.abs(num));
          }

          let palabras = [];
          let indiceBloque = 0;

          while (num > 0) {
              let bloque = num % 1000;
              if (bloque !== 0) {
                let palabrasBloque = [];
                let centenasBloque = Math.floor(bloque / 100);
                let decenasBloque = bloque % 100;
                let unidadesBloque = bloque % 10;
                let decenasNum = Math.floor(decenasBloque / 10);

                if (centenasBloque === 1 && decenasBloque === 0 && unidadesBloque === 0) {
                    palabrasBloque.push('cien');
                } else if (centenasBloque !== 0) {
                    palabrasBloque.push(centenas[centenasBloque]);
                }

                if (decenasBloque >= 11 && decenasBloque <= 19) {
                    palabrasBloque.push(especiales[decenasBloque - 10]);
                } else if (decenasBloque === 10) {
                    palabrasBloque.push('diez');
                } else if (decenasBloque >= 20 && decenasBloque <= 29) {
                    // Casos especiales para veinti-
                    if (unidadesBloque === 0) {
                        palabrasBloque.push('veinte');
                    } else {
                        palabrasBloque.push('veinti' + unidades[unidadesBloque]);
                    }
                } else {
                    // Para 30 en adelante con unidades
                    if (decenasNum > 0) {
                        palabrasBloque.push(decenas[decenasNum]);
                    }
                    if (unidadesBloque !== 0 && decenasNum > 0) {
                        palabrasBloque.push('y');
                        palabrasBloque.push(unidades[unidadesBloque]);
                    } else if (unidadesBloque !== 0 && decenasNum === 0) {
                        palabrasBloque.push(unidades[unidadesBloque]);
                    }
                }

                // Agregar el nombre del bloque (mil, millón, etc.)
                if (indiceBloque === 1) {
                    // Para miles: solo agregar "mil" si el bloque es 1, sino agregar número + mil
                    if (bloque === 1) {
                        palabrasBloque = ['mil'];
                    } else {
                        palabrasBloque.push('mil');
                    }
                } else if (indiceBloque === 2) {
                    // Para millones
                    if (bloque === 1) {
                        palabrasBloque.push('millón');
                    } else {
                        palabrasBloque.push('millones');
                    }
                }

                palabras.push(palabrasBloque.join(' '));
              }
              indiceBloque++;
              num = Math.floor(num / 1000);
          }
          return palabras.reverse().join(' ').trim();
        };

        let resultado = convertirNumero(parteEntera);

        // Si hay decimales, agregarlos en formato /100
        if (parteDecimal > 0) {
            resultado += ' con ' + parteDecimal + '/100';
        }

        return resultado;
      },
    },

}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
    font-family: Arial;
}
.letra{
    padding:0px 10px 0px 0px;
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
