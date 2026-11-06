<template>
    <div>
        <vx-card id="seccionImprimir2">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td colspan="2" class="text-center" style="font-weight: bold; font-size: 18px; text-align: center;">
                       ACTA DE DEVOLUCIÓN GUIAS
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="text-center" style="font-weight: bold; font-size: 18px; margin-top: 10px; text-align: center;">
                        BODEGA
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="text-right" style="font-weight: bold; font-size: 14px; margin-top: -20px; text-align: right;">
                        {{ pedido.ven_codigo }}
                    </td>
                </tr>
                <tr>
                    <td style="width: 70%; font-size: 14px; text-align: left;">
                        Quito, {{ mesd }}, {{ day }} de {{ mes }} del {{ year }}
                    </td>
                    <td class="text-left" style="font-weight: bold; font-size: 14px; text-align: left;">
                        Ref:
                    </td>
                </tr>
            </table>
            <br>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">
                        RESPONSABLE:
                    </td>
                    <td style="width: 70%; text-align: left;">
                        {{ pedido.asesor.toUpperCase() }}
                    </td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">
                        CI:
                    </td>
                    <td style="width: 70%; text-align: left;">
                        {{ pedido.cedula }}
                    </td>
                </tr>
            </table>
            <p></p>
            <p class="sp25 letra2">
                Con esta fecha, se procede a la suscripción de la presente Acta de Devolución - Recepción de guias que se
                otorgarón en calidad de <b>OBSEQUIOS SIN COSTO,</b> como parte de la PROMOCIÓN DE VENTAS.
            </p>
            <br>
            <table class="letra" style="margin: 0 auto;margin-top: 31px;">
                <thead>
                    <tr>
                        <th>CODIGO</th>
                        <th>DESCRIPCION</th>
                        <th>CANTIDAD DEVUELTA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in arregloLibros" :key="key">
                        <td>{{ tr.pro_codigo }}</td>
                        <td>{{ tr.nombrelibro.toUpperCase() }}</td>
                        <td>{{ tr.cantidad_devuelta + tr.cantidad_devuelta_codigoslibros }}</td>
                    </tr>
                </tbody>
            </table>
            <br><br>
            <table style="width: 100%; border-collapse: collapse; margin-top: 30px; text-align: center;">
                <tr>
                    <td style="width: 50%; font-weight: bold;">
                        ENTREGUÉ CONFORME
                    </td>
                    <td style="width: 50%; font-weight: bold;">
                        RECIBÍ CONFORME
                    </td>
                </tr>
            </table>
            <table style="width: 100%; border-collapse: collapse; margin-top: 110px; text-align: center;">
                <tr>
                    <td style="width: 50%; font-weight: bold;">
                     <p>{{ pedido.asesor.toUpperCase() }}</p>
                     <p class="font-bold">VENDEDOR</p>
                    </td>
                    <td style="width: 50%;">
                        <p style="font-weight: bold;">BODEGA</p>
                    </td>
                </tr>
            </table>
            <div id="ultimo-elemento" style="font-size: 10px;">
                <p v-if="pedido.facturador !=null">Por: {{ pedido.facturador.toUpperCase() }}</p>
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
import imprimirMixin from "@/mixins/Pedidosmix";
export default{
    mixins:[imprimirMixin],
    data(){
        return{
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
    },
    created(){
        let me = this;
        moment.lang("es")
        me.day = moment().format('DD');
        me.mes = moment().format('MMMM');
        me.mesd = moment().format('dddd');
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
        let mostrarNombre = me.pedido.estado == 0 ? me.pedido.asesor.toUpperCase()+".pdf" : me.pedido.ven_codigo+".pdf"
        me.nombrearchivo = mostrarNombre
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
        getLibros(id_pedido){
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'guias/'+me.pedido.id)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                text: "Espere mientras se va generando el archivo...",
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-file',
                time:3000
                })
                let datos = res.data.detalleDevolucion
                 ///===ORDENAR ARRAY ==
                me.arregloLibros = datos.sort(function(a, b) {
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
                setTimeout(function() { me.m_imprimirTodos('12px',me.nombrearchivo ,'0px',''); me.$emit('change',true) }, 1000);
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        imprimirEval(){
            let me = this
            var element = document.getElementById('seccionImprimir2');
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
