<template>
    <div>
        <vx-card id="seccionImprimirActaEntrega">
            <h5 class="text-center font-bold">PROMOCIÓN DE VENTAS</h5>
            <h5 class="text-center font-bold mt-2">ACTA DE ENTREGA</h5>
            <div class="flex sp55" style="width: 100%;">
                <div style="width: 50%;">
                    <p class="letra2">Quito, {{ mesd }}, {{ day }} de {{ mes }} del {{ year }}</p>
                </div>
                <div style="width: 33%;" class="flex justify-end">
                    <p class="letra2 font-bold">Ref:</p>
                </div>
            </div>
            <br>
            <div clas="flex">
                <div style="width: 100%;" class="flex letra2">
                    <div style="width: 30%;">
                        <b>RESPONSABLE:</b>
                    </div>
                    <div style="width: 50%;">
                        <p>{{ pedido.responsable.toUpperCase() }}</p>
                    </div>
                </div>
            </div>
            <div clas="flex">
                <div style="width: 100%;" class="flex letra2">
                    <div style="width: 30%;">
                        <b>CI:</b>
                    </div>
                    <div style="width: 40%;">
                        <p>{{ pedido.cedula }}</p>
                    </div>
                </div>
            </div>
            <p></p>
            <p class="sp25 letra2">
                Con esta fecha, se procede a la suscripción de la presente Acta de Entrega - Recepción de los productos que se
                otorgan en calidad de <b>OBSEQUIOS SIN COSTO,</b> como parte de la PROMOCIÓN DE VENTAS.
            </p>
            <br>
            <table class="tabla2"  border="1">
                <thead>
                    <tr>
                        <td colspan="1"><b>LIBRO</b></td>
                        <td colspan="1"><b>CANTIDAD</b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in pedido.entregas" :key="key">
                        <td>{{ tr.nombrelibro.toUpperCase() }}  </td>
                        <td>{{ tr.cantidad_entregada - tr.devolucion }}</td>
                    </tr>
                </tbody>
            </table>
            <br>
            <div v-if="tipo == 1">
                <!--PDF-->
                <div class="flex letra2" style="justify-content: space-between;margin-top: 30px;width: 100%!important;">
                    <div style="width: 50%;">
                        <p class="font-bold">ENTREGUÉ CONFORME</p>
                    </div>
                    <div style="width: 50%;">
                        <p class="font-bold">RECIBÍ CONFORME</p>
                    </div>
                </div>
                <div class="flex letra2" style="justify-content: space-between;margin-top: 110px;width: 100%!important;">
                    <div style="width: 50%;">
                        <p>{{ pedido.responsable.toUpperCase() }}</p>
                        <p class="font-bold">VENDEDOR</p>
                    </div>
                    <div style="width: 50%;">
                        <p>{{ pedido.nombreInstitucion }} ({{ pedido.ciudad }})</p>
                        <p class="font-bold">COMPRADOR</p>
                    </div>
                </div>  
            </div>
            <!--WORD-->
            <div v-else style="display: flex;">
                <table>
                    <tr>
                        <td colspan="5">ENTREGE CONFORME</td>
                        <td colspan="7">RECIBÍ CONFORME</td>
                    </tr>
                    <tr>
                        <td colspan="5" rowspan="8"></td>
                        <td colspan="7" rowspan="8"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5"></td>
                        <td colspan="7"></td>
                    </tr>
                    <tr>
                        <td colspan="5">{{ pedido.responsable.toUpperCase() }}</td>
                        <td colspan="7">{{ pedido.nombreInstitucion }} ({{ pedido.ciudad }})</td>
                    </tr>
                    <tr>
                        <td colspan="5">VENDEDOR</td>
                        <td colspan="7">COMPRADOR</td>
                    </tr>
                </table>
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
export default{
    data(){
        return{
            arregloContrato:[],
            arregloLibros:[],
            day:'',
            mes:'',
            mesd:'',
            year:'',
            anio:'',
            fecha:'',
            telefono:'',
            nombrearchivo:'',
        }
    },
    props:{
        pedido:{
            type:Array,
            default:{},
        },
        tipo:{
            type:Number,
            default:0,
        }
    },
    created(){
        let me = this;
        moment.lang("es")
        me.day = moment().format('DD'); 
        me.mes = moment().format('MMMM');
        me.mesd = moment().format('dddd');  
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
        me.nombrearchivo = "Guias_Entrega_"+me.pedido.nombreInstitucion+".pdf"
        // me.contrato = me.$route.params.id
    },
    mounted(){
        let me = this
        me.getLibros()
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
            //cargar documento
            let formData = new FormData()
            this.$http.post(this.$server_url+'upload/file', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                text: "Espere mientras se va generando el archivo...",
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-file',
                time:3000
                })
                if(me.tipo == 1){
                    setTimeout(function() {me.imprimirEval()}, 1000);
                }else{
                    setTimeout(function() {me.ExportToDoc()}, 1000);
                }
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        imprimirEval(){
            let me = this
            var element = document.getElementById('seccionImprimirActaEntrega');
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
            me.arregloContrato = []
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
        ExportToDoc(){
            let me = this
            var filename = me.nombrearchivo
            var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
            var EndHtml = "</body></html>";
            //complete html
            var html = HtmlHead +document.getElementById("seccionImprimirActaEntrega").innerHTML+EndHtml;
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
</style>