<template>
    <div>
        <vs-card>
            <div class="title">
                Filtro de codigos
            </div>
            <div class="mt-5">
                <ul style="display:flex;flex-wrap: wrap;">
                    <li>
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{sumaTotal}}</span> Todos</vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="1"><span style="font-weight:bold;">{{sumarCodigosActivos}}</span> Códigos activos </vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="2"><span style="font-weight:bold;">{{sumaCodigosBloqueados}}</span> Códigos bloqueados</vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{sumaCodigosRegalados}}</span>  Regalados Sin liquidar</vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="5"><span style="font-weight:bold;">{{sumarCodigosLiquidados}}</span> Códigos Liquidados </vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="6"><span style="font-weight:bold;">{{sumaCodigosRegaladosLiquidados}}</span> Regalados Liquidados </vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="7"><span style="font-weight:bold;">{{sumarCodigosporLiquidarse}}</span> Códigos a liquidarse</vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="8"><span style="font-weight:bold;">{{SumaCodigosDevolucion}}</span> Códigos devueltos</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-divider>Otros</vs-divider>
            <div class="mt-5">
                <ul style="display:flex;flex-wrap: wrap;">
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="9"><span style="font-weight:bold;">{{sumarCodigosLeidos}}</span> Códigos leidos (No liquidados) </vs-radio>
                    </li>
                    <li class="ml-2">
                    <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="10"><span style="font-weight:bold;">{{sumarCodigosNoleidos}}</span> Códigos sin leer </vs-radio>
                    </li>
                </ul>
            </div>
        </vs-card>
        <vs-card class="mt-1" v-if="codigosInstitucion.length > 0">
          <gestionCodigosListaVue  :arregloCodigos="codigosInstitucion" />
        </vs-card>
        <!--Modales-->
        <!----modal exportar--------->
        <div v-if="exportarRealizar == 2">
            <ExportReutilizable @cerrar="activePrompt =$event" :activePrompt = "activePrompt"  :headerTitle ="headerTitle" :headerVal="headerVal" :codigoSelected="codigoSelected"/>
        </div>
         <!----fin modal exportar--------->
        <vs-popup class="holamundo" fullscreen title="Aplicar descuento a códigos" :active.sync="popupDescuento">
            <div>
                <!-- USERNAME -->
                <vx-input-group class="mb-base">
                    <template slot="prepend">
                    <div class="prepend-text bg-primary">
                        <span>Ingrese el valor de descuento %</span>
                    </div>
                    </template>

                    <vs-input v-model="valorDescuento" />
                </vx-input-group>
                <!-- /USERNAME -->
            </div>
            <vs-divider>
                <span>Estas seguro de aplicar este descuento a estos códigos?</span>
                <vs-button class="ml-2" color="warning" @click="aplicarDescuento()" type="border"><ion-icon name="checkmark-outline"></ion-icon> Aplicar Descuento</vs-button>
            </vs-divider>
            <CodigosDescuentoVue :codigoSelected="codigoSelected"/>
        </vs-popup>
    </div>
</template>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/js/all.min.js" integrity="sha512-M+hXwltZ3+0nFQJiVke7pqXY7VdtWW2jVG31zrml+eteTP7im25FdwtLhIBTWkaHRQyPrhO2uy8glLMHZzhFog==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
<script src="https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/blob-polyfill/4.0.20200601/Blob.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xls/0.7.6/xls.core.min.js"></script>
<script>
import ExportReutilizable from '../../admin/components/ExportReutilizable.vue'
import CodigosDescuentoVue from './utils/CodigosDescuento'
import gestionCodigosListaVue from './utils/gestionCodigosLista.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default {
  components:{
    'v-select': vSelect,
    ExportReutilizable,
    CodigosDescuentoVue,
    gestionCodigosListaVue,
  },
    data() {
        return{
             //listado de ciudades para el select
            arregloCiudad:[],
             liquidacion:{
                institucion:'',
                periodo:'',
                condicion:'1',
            },
            arregloPeriodos:[],
            ciudadSelect:'',
            arregloTraeInstitucion:[],
            codigosInstitucion: [],
            codigoSelected: [],
            activePrompt:false,

            guardarActivo:'',
            generarActivo:'',
            textAlertCant:'',
            cantidad:'',
            arregloCodigos:[],
            codigoTipo:'0',
            headerTitle:[],
            headerVal:[],
            exportarRealizar:1,
            //VARIABLES PARA DESCUENTO
            popupDescuento:false,
            valorDescuento:'',
            //FIN variables para descuento
        }
    },
    props:{
        arregloCodigosIndividuales:{
            type:Array,
            default: []
        },
        lperiodo:{
            type:Number,
            default: 0
        },
        linstitucion:{
            type:Number,
            default: 0
        }
    },
    watch:{
        arregloCodigosIndividuales(results){
            this.reRenderCodigos(results)
            this.codigoSelected  = []
        }
    },
    created(){
        let me = this;
        // me.listaCiudades();
    },
    computed:{
        sumaTotal(){
            let me    = this;
            let total = me.arregloCodigos.length
            return total
        },
        SumaCodigosDevolucion(){
            let me = this;
            let datos       = me.arregloCodigos.filter(p => p.estado_liquidacion == '3');
            let resultado   = datos.length
            return resultado
        },
        sumaCodigosRegalados(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2'  && p.liquidado_regalado == '0')
            let resultado    = datos.length
            return resultado
        },
        sumaCodigosRegaladosLiquidados(){
            let me = this;
            let datos        = me.arregloCodigos.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1')
            let resultado    = datos.length
            return resultado
        },
        sumaCodigosBloqueados(){
            let me = this;
             let primerFiltro = me.arregloCodigos.filter(p => p.estado_liquidacion != '3');
            let datos         = primerFiltro.filter(p => p.estado == '2')
            let resultado     = datos.length
            return resultado
        },
        sumarCodigosActivos(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
            let resultado    = datos.length
            return resultado
        },
        sumarCodigosLiquidados(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
            let resultado    = datos.length
            return resultado
        },
        sumarCodigosporLiquidarse(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado =='2'));
            let datos        = primerFiltro.filter(p => (p.bc_institucion == this.linstitucion) && (p.bc_periodo == this.lperiodo))
            let resultado    = datos.length
            return resultado
        },
        // sumarCodigosporLiquidarse(){
        //     let me = this;
        //     let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
        //     let datos        = primerFiltro.filter(p => p.estado_liquidacion =='1')
        //     let resultado    = datos.length
        //     return resultado
        // },
         sumarCodigosLeidos(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
            let datos        = primerFiltro.filter(p => p.bc_estado =='2')
            let resultado    = datos.length
            return resultado
        },
         sumarCodigosNoleidos(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
            let datos        = primerFiltro.filter(p => p.bc_estado =='1')
            let resultado    = datos.length
            return resultado
        }
    },
    methods:{
        reRenderCodigos(results){
            const me = this
            me.codigosInstitucion = results
            me.arregloCodigos = results
            localStorage.setItem('codigos',JSON.stringify(results))
        },
        filtroTipo(){
            let me = this;
            let datos =JSON.parse(localStorage.getItem("codigos"))
            //para ver los codigos activos
            if(me.codigoTipo == 1){
                let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
                me.codigosInstitucion = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
                return
            }
            //para ver los codigos bloqueados
            if(me.codigoTipo == 2){
                let primerFiltro = datos.filter(p => p.estado_liquidacion != '3');
                me.codigosInstitucion = primerFiltro.filter(p => p.estado =='2')
                //me.codigosInstitucion = datos.filter(p => p.estado == '2');
                return
            }
            //para ver los codigos regalados
            if(me.codigoTipo == 4){
                let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
                me.codigosInstitucion = primerFiltro.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '0')
                return
            }
            //para ver los codigos liquidados
            if(me.codigoTipo == 5){
                let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
                me.codigosInstitucion = primerFiltro.filter(p => p.estado_liquidacion =='0')
                return
            }
            //para ver los codigos liquidados regalados
            if(me.codigoTipo == 6){
                me.codigosInstitucion = datos.filter(p => p.estado_liquidacion =='2' && p.liquidado_regalado == '1' )
                return
            }
            //para ver los codigos por liquidarse
            if(me.codigoTipo == 7){
                let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1) && (p.bc_estado ==2));
                me.codigosInstitucion = primerFiltro.filter(p => (p.bc_institucion == this.linstitucion) && (p.bc_periodo == this.lperiodo))
                return
            }
            //para ver los codigos devueltos
            if(me.codigoTipo == 8){
                let primerFiltro = datos.filter(p => p.estado_liquidacion == '3');
                me.codigosInstitucion = primerFiltro
                return
            }
            //para ver los codigos leidos
            if(me.codigoTipo == 9){
                let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
                me.codigosInstitucion = primerFiltro.filter(p => p.bc_estado =='2')
                return

            }
             //para ver los codigos no leidos
            if(me.codigoTipo == 10){
                let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
                me.codigosInstitucion = primerFiltro.filter(p => p.bc_estado =='1')
                return
            }
            //para ver todos los codigos
            else{
                me.codigosInstitucion = datos
            }

        },
        exportar(){
            let me = this
            me.activePrompt=true
            me.exportarRealizar = 2
            me.headerTitle = ['codigo','institucion estudiante','periodo estudiante','libro', 'registrado', 'cedula', 'nombres', 'apellidos', 'email','estado','contrato','liquidacion','código de barras','bc_estado','venta estado','institucion barras','periodo barras'];
            me.headerVal = ['codigo', 'nombreInstitucion','periodo','libro', 'registrado', 'cedula', 'nombres', 'apellidos', 'email','codigoEstado','contrato','liquidacion','status','barrasEstado','ventaEstado','institucionBarra','periodo_barras'];
        },
        openLoadingColor(libro) {
            this.$vs.loading({
                color: '#1A76F2'
            })
        },
        //==METODOS DESCUENTO====
        confirmDescuento(){
            let me          = this;
            let datos       = me.codigoSelected
            let devueltos   = datos.filter(p => p.estado_liquidacion == 3)
            let bloqueados  = datos.filter(p => p.estado == 2 && p.estado_liquidacion != 3)
            let liquidados  = datos.filter(p => (p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null ) && p.estado_liquidacion =='0')
            if(devueltos.length > 0 ){
                me.$vs.notify({
                text:'No puede seleccionar códigos devueltos',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(bloqueados.length > 0 ){
                me.$vs.notify({
                text:'No puede seleccionar códigos bloqueados',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(liquidados.length > 0 ){
                me.$vs.notify({
                text:'No puede seleccionar códigos liquidados',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.popupDescuento = true;
        },
        aplicarDescuento(){
            let me = this;
            if(me.valorDescuento == ""){
                me.$vs.notify({
                text:'El valor descuento no puede ser vacio',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.valorDescuento <= 0){
                me.$vs.notify({
                text:'El valor descuento no puede ser menor a cero',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            var codigosEnviar = []
            me.codigoSelected.forEach(element => {
                var cal = new Object();
                cal.codigo  = element.codigo
                codigosEnviar.push(cal)
            });
            let formData = new FormData()
            formData.append('codigos',  JSON.stringify(codigosEnviar));
            formData.append('valor',    me.valorDescuento);
            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarDescuentoCodigos', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            me.popupDescuento = false
            me.$emit('recharge',true)
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        //===FIN METODOS DE DESCUENTO CODIGOS=====
    }
}
</script>
