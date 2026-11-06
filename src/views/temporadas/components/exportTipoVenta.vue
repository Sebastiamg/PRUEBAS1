<template>
    <div>
        <vx-card id="seccionImprimirTipoVenta">
            <p class="letra text-center"><b>REPORTE DE {{ tipoVenta == 1 ? 'VENTA DIRECTA' :'VENTA LISTA' }} </b></p>
            <p class="letra text-left"><b>INSTITUCIÓN:</b> {{ sendPedido.nombreInstitucion.toUpperCase() }}</p>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>TEMPORADA:</b> {{ sendPedido.periodo.toUpperCase() }}</span>
                </div>
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>CONVENIO:</b> {{ datosInstitucion.contrato.toUpperCase() }}</span>
                </div>
            </div>
            <p class="letra text-left"><b>ASESOR:</b> {{ sendPedido.responsable.toUpperCase() }}</p>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>FECHA REPORTE:</b> {{ dayM.charAt(0).toUpperCase() + dayM.slice(1) }}, {{ day }} de {{ mes }} de {{ year }}</span>
                </div>
                <div>
                    <span class="letra" style="position: relative;top:-1px;"><b>% COMISIÓN:</b> {{ sendPedido.descuento }}</span>
                </div>
            </div>
            <table class="tabla2">
                <thead>
                    <tr>
                        <td colspan="1"><b>PRODUCTO</b></td>
                        <td colspan="4"><b>NOMBRE</b></td>
                        <td colspan="1"><b>CANT. VERIF.</b></td>
                        <td colspan="2"><b>VAL. UNIT.</b></td>
                        <td colspan="1"><b>VALOR</b></td>
                        <!--9 COLUMNAS-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in arregloLibros" :key="key">
                        <td>{{ tr.codigo }}</td>
                        <td colspan="4"><p class="letra">{{ tr.nombre_libro.toUpperCase() }}</p>  </td>
                        <td>{{ tr.cantidad }}</td>
                        <td colspan="2">{{ tr.precio }}</td>
                        <td>{{ filtrarDecimal(tr.valor) }} </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><p class="font-bold text-right" style="font-size:10px;">TOTAL:</p></td>
                        <td style="border-top: 1px solid #000;"><span>{{ filtrarDecimal(sumaTotalTipo)}}</span></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><p class="font-bold text-right" style="font-size:10px;">COMISIÓN:</p></td>
                        <td style="border-top: 1px solid #000;"><span>{{ filtrarDecimal((sumaTotalTipo * sendPedido.descuento) / 100)}}</span></td>
                    </tr>
                </tbody>
            </table>
        </vx-card>
        <div class="w-full p-2 bg-gray-400 text-center">
          <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir pdf</vs-button>
          <vs-button color="primary" @click="imprimirExcel()" type="border">Imprimir excel</vs-button>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
          arregloLibros:[],
          arregloVerificacion:[],
          day:'',
          dayM:'',
          mes:'',
          year:'',
          anio:'',
          fecha:'',
          nombrearchivo:'',
          valorVenta:0,
          totalVenta:0,
          comision:0,
          valorComision:0,
          anticipo:0,
          deuda:0,
          liquidacion:0,
          //VARIABLES PARA EXPORTAR A EXCEL
          formats: ['xls', 'xlsx', 'csv', 'txt'],
          fileName:null,
          selectedFormat: 'xls',
          cellAutoWidth: true,
          activePrompt: false,
          sumaTotalTipo:0,
          mixinIdInicioFormatoNewData: null,
        }
    },
    props:{
      VerificacionSelect:{
        type:Object,
        default:function(){
          return {}
        }
      },
      datosInstitucion:{
        type:Object,
        default:function(){
            return{}
        }
      },
      tipoVenta:{
        type:Number,
        default:1,
      },
      sendPedido:{
        type:Object,
        default:function(){
           return{}
        }
      },
      arrayAllCodigos:{
        type:Array,
        default:function(){
          return []
        }
      }
    },
    created(){
        let me = this;
        moment.lang("es")
        me.day = moment().format('DD');
        me.dayM  = moment().format('dddd');
        me.mes = moment().format('MMMM');
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
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
      me.nombrearchivo = ""
      me.obtenerVentaRealXVerificacionXTipoVenta()
      let TypeVenta = me.tipoVenta == 1 ? '_Venta-directa' : 'Venta-Lista'
      me.nombrearchivo = "Verificacion "+me.datosInstitucion.contrato+TypeVenta+".pdf"
    },
    methods:{
      filtrarDecimal(numero){
        let me = this
        if(numero == 0){
          return numero
        }else{
          const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          return transformar
        }
      },
      obtenerVentaRealXVerificacionXTipoVenta(){
        let me = this;
        me.arregloLibros = []
        me.sumaTotalTipo = 0
        const { contrato, idInstitucion ,id_periodo } = me.datosInstitucion
        // Acceder a la key 'pid' desde localStorage
        // let pid = localStorage.getItem('pid');

        // // Definir la rutaxperiodo en base al valor de pid
        // let rutaxperiodo = '';
        // if (pid <= me.mixinIdInicioFormatoNewData) {
        //     rutaxperiodo = this.$server_url+'n_verificacion?contrato='+contrato+'&getVentaRealXVerificacionXTipoVenta=yes&IdVerificacion='+me.VerificacionSelect.id+'&verificacion_id='+me.VerificacionSelect.num_verificacion+'&institucion_id='+idInstitucion+'&periodo_id='+id_periodo+'&TipoVenta='+me.tipoVenta;
        // } else if(pid > me.mixinIdInicioFormatoNewData) {
        //     rutaxperiodo = this.$server_url+'n_verificacion?contrato='+contrato+'&getVentaRealXVerificacionXTipoVenta_new=yes&IdVerificacion='+me.VerificacionSelect.id+'&verificacion_id='+me.VerificacionSelect.num_verificacion+'&institucion_id='+idInstitucion+'&periodo_id='+id_periodo+'&TipoVenta='+me.tipoVenta;
        // }
        // me.$vs.loading()
        // this.$http.get(rutaxperiodo)
        // .then(function (res) {
          let getData = []
          let datos   = []
          getData = me.arrayAllCodigos.filter(p => p.estado_liquidacion == '0' && p.bc_institucion == idInstitucion && p.estado != '2' && p.contrato == contrato && p.venta_estado == me.tipoVenta)
          getData.forEach(item => {
            const nombre_libro    = item.nombre_libro;
            const codigo          = item.codigo;
            const precio          = item.precio;
            const libro_id        = item.libro_id;
            const IdVerificacion  = item.IdVerificacion;
            const verificacion_id = item.verificacion_id;
            const libro_idlibro   = item.libro_idlibro;
            // Busca si ya existe un objeto con el mismo libro en groupedData
            const existingGroup = datos.find(group => group.nombre_libro === nombre_libro);
            // Si no existe, crea un nuevo objeto y agrégalo a groupedData
            if (!existingGroup) {
              datos.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion, verificacion_id, libro_idlibro, cantidad: 1 });
            } else {
              // Si existe, incrementa la cantidad en el objeto existente
              existingGroup.cantidad++;
            }
          });
          datos.map((item) => {
            item.valor = item.precio * item.cantidad
          });
          if(datos.length == 0){
            me.$vs.loading.close()
            me.$vs.notify({
            text: "No existe codigos en el tipo de venta seleccionado",
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-file',
            time:3000
            })
            me.$emit('change',true)
            return
          }
          me.$vs.notify({
          text: "Espere mientras se va generando el archivo...",
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-file',
          time:4000
          })
          me.sumarTotalTipoVenta(datos)
          me.getLibros(datos)
          // me.$vs.loading.close()
        // })
        // .catch(function (error) {
        //     console.log(error + ' error');
        //     me.$vs.loading.close()
        // })
      },
      sumarTotalTipoVenta(data){
        let me = this;
          if(data.length > 0){
            let datos = data.filter(p => p.valor)
            let total = datos.reduce((a, b) => a + (b["valor"] || 0), 0);
            me.sumaTotalTipo = total
          }
      },
      getLibros(datos){
        let me = this
        me.arregloLibros = []
        ///===ORDENAR ARRAY ==
        me.arregloLibros = datos.sort(function(a, b) {
        var nombreA = a.nombre_libro.toLowerCase();
        var nombreB = b.nombre_libro.toLowerCase();
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
        })
        setTimeout(function() {me.imprimirEval()}, 1000)
      },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
              return v[j]
          }))
        },
        //limpiar campos para exportar de nuevo
        clearFields() {
          this.fileName = ''
          this.cellAutoWidth = true
          this.selectedFormat = 'xls'
        },
        imprimirEval(){
            let me = this
            var element = document.getElementById('seccionImprimirTipoVenta');
            var opt = {
                margin:       0.5,
                // margin:         [1.5, 0.5, 1, 1],
                filename:     me.nombrearchivo,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:    {scale: 2},
                pagebreak: { mode: 'avoid-all', inside: "avoid", before: '#page2el' }  ,
                // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
                //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(opt).save();
            me.arregloLibros   = []
            me.$vs.notify({
                text: "Archivo descargado correctamente",
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-file',
                time:2000
            })
            me.limpiar()
            me.$emit('change',true)
        },
        limpiar(){
          let me = this;
          me.AnticiposConvenio = 0
          me.convenio_origen   = 0
          me.valorVenta        = 0
          me.totalVenta        = 0
          me.comision          = 0
          me.valorComision     = 0
          me.anticipo          = 0
          me.deuda             = 0
          me.liquidacion       = 0
          me.aniosConvenio     = 0
        }
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
    font-size: 10px;
    margin-left: 35px;
    text-align: justify;
}
.letra2{
    margin-top: 15px;
    margin-left: 60px;
    padding-right:60px;
    font-size: 11px;
    text-align: justify;
}
.letra3{
    display: flex;
    font-size: 11px;
    margin-left: 35px;
    padding-right:35px;
    text-align: justify;
}
.letra4{
    margin-top: 15px;
    margin-left: 55px;
    padding-right:55px;
    font-size: 11px;
    text-align: justify;
}
.letra5{
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    margin-left: 35px;
    padding-right:35px;
    font-size: 11px;
    margin-top: 115px;
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
    margin-left: 35px;
}

@media print {
    td {page-break-before: always;}
    p  {page-break-before: always;}
}
.encabezado ,td,th {
    /* border: 1px solid rgb(227, 227, 227); */
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
</style>
