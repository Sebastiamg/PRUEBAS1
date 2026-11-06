<template>
    <div>
        <div>
            <b>Filtro:</b>
            <ul class="flex mt-2">
                <li class="modelx">
                    <vs-radio v-model="tipo" @input="getValoresVenta()" vs-name="radios1tipo" vs-value="0">Con contratos</vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="tipo" @input="getValoresVenta()" vs-name="radios1tipo" vs-value="1">Sin contrato</vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="tipo" @input="getValoresVenta()" vs-name="radios1tipo" vs-value="2">Todos</vs-radio>
                </li>
                <li style="list-style: none;">
                    <vs-checkbox v-model="checkList" style="margin-left: 10px;" @input="getValoresVenta()">Mostrar todo los asesores</vs-checkbox>
                </li>
            </ul>
            <vs-divider>Region</vs-divider>
            <ul class="flex mt-2">
                <li class="modelx">
                    <vs-radio v-model="region" @input="getValoresVenta()" vs-name="radios1region" vs-value="1">Sierra</vs-radio>
                </li>
                <li class="ml-2">
                <vs-radio v-model="region" @input="getValoresVenta()" vs-name="radios1region" vs-value="2">Costa</vs-radio>
                </li>
            </ul>
        </div>
        <div class="mt-2 flex">
            <vs-button color="success" @click="ExportToExcel('xlsx')" type="border"><i class="fa-solid fa-file-excel"></i>  Exportar</vs-button>
        </div>
        <p class="mt-2">Cantidad :{{ arregloVenta.length }}</p>
        <table width="100%" border="1" cellspacing="0" cellpadding="0" id="miTabla" class="mt-4">
            <vs-tr>
                <vs-th colspan="1" rowspan="2" style="width: 150px;" class="rotar"><b>VENDEDOR</b></vs-th>
                <!-- <vs-th colspan="1" rowspan="2" class="rotar"><b>PRESUPUESTO {{ year }}</b></vs-th> -->
                <vs-th colspan="2" class="rotar"><b>VENTAS REALES {{ region == 1?'Sierra':'Costa' }} {{ year -1 }}</b></vs-th>
                <vs-th colspan="2" class="rotar"><b>VENTA SEGUN PROMOCION  {{ region == 1?'Sierra':'Costa' }} {{ year }}</b></vs-th>
                <vs-th rowspan="2">VARIACION VENTAS BRUTAS POR TEMPORADA</vs-th>
                <!-- <vs-th rowspan="2">VARIACION EN RELACION AL PRESUPUESTO</vs-th> -->
                <vs-th rowspan="2">% DE VARIACION EN  RELACION AL PRESUPUESTO</vs-th>
            </vs-tr>
            <vs-tr>
                <vs-th>VENTA BRUTA</vs-th>
                <vs-th>VENTA NETA</vs-th>
                <vs-th>VENTA BRUTA</vs-th>
                <vs-th>VENTA NETA</vs-th>
            </vs-tr>
            <tr v-for="(tr,key) in arregloVenta" :key="key">
                <td>
                    <vs-button color="success" @click="removeItemFromArr(arregloVenta,tr)"  type="flat" icon-pack="feather" icon="icon-x"></vs-button>
                    <p>{{ tr.asesor.toUpperCase() }}</p>
                    <p>{{ tr.iniciales}}</p>
                </td>
                <!-- <td> 
                    <p v-if="tr.Presupuesto == 0">$0</p>
                    <p v-else>${{ filtrarDecimal(tr.Presupuesto) }}</p>
                </td> -->
                <td>
                    {{ filtrarDecimal(tr.anteriorUno) }} 
                </td>
                <td>
                    {{ filtrarDecimal(tr.ventaNetaAnterior) }}
                </td>
                <td>
                    <p v-if="tr.ventaBrutaActual == 0">$0</p>
                    <p v-else>${{ filtrarDecimal(tr.ventaBrutaActual) }}</p>
                </td>
                <td>
                    <p v-if="tr.ven_neta_actual == 0">$0</p>
                    <p v-else>${{ filtrarDecimal(tr.ven_neta_actual) }}</p>
                </td>
                <td>${{ filtrarDecimal(tr.VariacionVentaBruta) }}</td>
                <!-- <td>${{ filtrarDecimal(tr.VariacionPresupuesto) }}</td> -->
                <td>{{ tr.PorcentajeVariacionPresupuesto }} <b style="display: none;">.</b>%</td>
            </tr>
            <tr>
                <td><b>TOTAL</b></td>
                <!-- <vs-td><b>${{ sumaPresupuestoActual }}</b></vs-td> -->
                <td><b>${{ sumaVentaBrutaAnterior }}</b></td>
                <td><b>${{ sumaNetaAnterior }}</b></td>
                <td><b>${{ sumaVentaBrutaActual }}</b></td>
                <td><b>${{ sumaVentaNetaActual }}</b></td>
                <td><b>${{ sumaVariacionVentaBruta }}</b></td>
                <!-- <td><b>${{ sumaVariacionPresupuesto }}</b></td> -->
            </tr> 
        </table>
    </div>
</template>
<script>
import moment from "moment";
export default{
    data(){
        return{
            arregloVenta:[],
            checkList:false,
            year:'',
            tipo:0,
            region:2,
        }
    },
    mounted(){
        let me = this;
        me.year = moment().format('YYYY')
        me.getValoresVenta()
    },
    computed:{
        // sumaPresupuestoActual(){
        //     let me = this;
        //     if(me.arregloVenta.length > 0){
        //         let datos = me.arregloVenta.filter(p => p.Presupuesto)
        //         let total = datos.reduce((a, b) => a + (b["Presupuesto"] || 0), 0);
        //         const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        //         return transformar
        //     }     
        // },
        sumaVentaBrutaAnterior(){
            let me = this;
            if(me.arregloVenta.length > 0){
                let datos = me.arregloVenta.filter(p => p.anteriorUno)
                let total = datos.reduce((a, b) => a + (b["anteriorUno"] || 0), 0);
                const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }   
        },
        sumaNetaAnterior(){
            let me = this;
            if(me.arregloVenta.length > 0){
                let datos = me.arregloVenta.filter(p => p.ventaNetaAnterior)
                let total = datos.reduce((a, b) => a + (b["ventaNetaAnterior"] || 0), 0);
                const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }   
        },
        sumaVentaBrutaActual(){
            let me = this;
            if(me.arregloVenta.length > 0){
                let datos = me.arregloVenta.filter(p => p.ventaBrutaActual)
                let total = datos.reduce((a, b) => a + (b["ventaBrutaActual"] || 0), 0);
                const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }   
        },
        sumaVentaNetaActual(){
            let me = this;
            if(me.arregloVenta.length > 0){
                let datos = me.arregloVenta.filter(p => p.ven_neta_actual)
                let total = datos.reduce((a, b) => a + (b["ven_neta_actual"] || 0), 0);
                const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }   
        },
        sumaVariacionVentaBruta(){
            let me = this;
            if(me.arregloVenta.length > 0){
                let datos = me.arregloVenta.filter(p => p.VariacionVentaBruta)
                let total = datos.reduce((a, b) => a + (b["VariacionVentaBruta"] || 0), 0);
                const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }   
        },
        // sumaVariacionPresupuesto(){
        //     let me = this;
        //     if(me.arregloVenta.length > 0){
        //         let datos = me.arregloVenta.filter(p => p.VariacionPresupuesto)
        //         let total = datos.reduce((a, b) => a + (b["VariacionPresupuesto"] || 0), 0);
        //         const transformar = (total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        //         return transformar
        //     }   
        // },
    },
    methods:{
        filtrarDecimal(numero){
            let me = this
            const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            return transformar
        },
        getValoresVenta() {
            let me = this;
            me.arregloVenta = []
            var sendRegion = 2;
            var WordRegion = ''
            if(me.region == 2){
                sendRegion = 22
                WordRegion = 'C'
            }else{
                sendRegion = 23
                WordRegion = 'S'
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporteVentaVendedor?tipo='+me.tipo+'&periodo_id='+sendRegion+'&region='+WordRegion)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arregloVenta = []
                    var arregloPredatos = []
                    var datos = []
                    datos = res.data
                   datos.forEach(element => {
                        var cal = new Object();
                        cal.id_asesor       = element.id_asesor
                        cal.asesor          = element.asesor
                        cal.iniciales       = element.iniciales
                        cal.cedula          = element.cedula
                        // cal.Presupuesto     = element.Presupuesto
                        cal.ventaBrutaActual = element.ventaBrutaActual
                        cal.ven_neta_actual  = element.ven_neta_actual
                        cal.ven_descuento   = element.ven_descuento
                        let array           = element.MenosUno
                        cal.anteriorUno     = array.reduce((a, b) => parseFloat(a) + parseFloat((b["VEN_VALOR"] || 0)), 0);
                        cal.ventaNetaAnterior  = array.reduce((a, b) => parseFloat(a) + parseFloat((b["ven_neta"] || 0)), 0);
                        arregloPredatos.push(cal)
                    });
                    var arregloPreFinal = []
                    //segundos calculos
                    arregloPredatos.forEach(element => {
                        var cal = new Object();
                        cal.id_asesor               = element.id_asesor
                        cal.asesor                  = element.asesor
                        cal.iniciales               = element.iniciales
                        cal.cedula                  = element.cedula
                        // cal.Presupuesto             = parseFloat(element.Presupuesto)
                        cal.ventaBrutaActual        = parseFloat(element.ventaBrutaActual)
                        cal.ven_neta_actual         = parseFloat(element.ven_neta_actual)
                        cal.ven_descuento           = element.ven_descuento
                        cal.anteriorUno             = element.anteriorUno
                        cal.ventaNetaAnterior       = element.ventaNetaAnterior
                        cal.VariacionVentaBruta     = element.ventaBrutaActual - element.anteriorUno 
                       // cal.VariacionPresupuesto    = element.ventaBrutaActual - element.Presupuesto
                        let preVariacionPresupuesto = element.ventaBrutaActual - element.anteriorUno
                        //validar division para cero
                        var prePorcentajeVariaciacionPresupuesto = 0;
                        if((preVariacionPresupuesto  == 0 && element.anteriorUno == 0) || (element.anteriorUno == 0)){
                            prePorcentajeVariaciacionPresupuesto = 0 
                        }else{
                            prePorcentajeVariaciacionPresupuesto = preVariacionPresupuesto / element.anteriorUno
                        }
                        cal.PorcentajeVariacionPresupuesto = ((prePorcentajeVariaciacionPresupuesto) * 100).toFixed(0)
                        arregloPreFinal.push(cal)
                    });
                    //FILTRO 
                    if(me.checkList){
                        me.arregloVenta = arregloPreFinal
                    }else{
                        me.arregloVenta = arregloPreFinal.filter(p => p.anteriorUno > 0)
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        //metodo par descargar el excel
        ExportToExcel(type, fn, dl) {
        var elt = document.getElementById('miTabla');
        var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
        return dl ?
            XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
            XLSX.writeFile(wb, fn || ('ReporteTareas.' + (type || 'xlsx')));
        
        },
        removeItemFromArr (arr, item) {
            const i = arr.indexOf(item)
            arr.splice(i, 1)
        },
    }
}
</script>
<style scoped>
.tabla1 {
  table-layout: fixed;
  width: 95%;
  border-collapse: collapse;
  border: none;
  margin-left: 15px;
}
.encabezado ,td,th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
}
</style>