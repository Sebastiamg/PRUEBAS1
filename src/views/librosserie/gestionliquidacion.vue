<template>
    <div>
  
        <!-- <vs-row vs-justify="center">
            <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-card>
                    <div slot="header">
                        <h3>
                        Reporte por liquidacion y periodo !
                        </h3>
                    </div>
                    <div>
                        <div>
                            <div class="vx-col w-full mt-5">
                            Ciudad:
                            <v-select @input="filtrarInstituciones()" :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="ciudadSelect" />
                            </div>
                            <div class="vx-col w-full mt-5">
                                Institucion:
                                <v-select :options="arregloTraeInstitucion" :reduce="arregloTraeInstitucion => arregloTraeInstitucion" label="nombreInstitucion" class="w-full" v-model ="liquidacion.institucion" />
                            </div> 
                            <br>  
                            <ul class="leftx">
                                <li class="modelx">
                                Seleccione que tipo de periodos desea filtrar
                                </li>
                                <br>
                                <li>
                                <vs-radio v-model="liquidacion.condicion"  @input="filtrarPeriodos()"  vs-name="radios1" vs-value="1">Activos</vs-radio>
                                </li>
                                <li>
                                <vs-radio v-model="liquidacion.condicion" @input="filtrarPeriodos()"  vs-name="radios1" vs-value="0">Inactivos</vs-radio>
                                </li>  
                            </ul>
                        </div>
                        <div class="vx-col w-full mt-5"> 
                            Periodo:
                            <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodo" class="w-full" v-model ="liquidacion.periodo" />
                        </div>  
                        <br>
                        <vs-button color="primary" size="small" type="filled" @click="filtrarLiquidacion();">
                            Filtrar 
                        </vs-button>
                    </div>
                </vs-card>
            </vs-col>
        </vs-row> -->
        <div>
            <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="arregloLiquidacion">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-button color="success" style="margin-left:20px;" size="small" @click="reporte()"  type="border" icon="folder"></vs-button>
                        <vs-button color="warning"  size="small" class="mr-5 ml-2" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
                        <vs-chip color="primary" style="font-size:12px;">
                          Total Libros: {{sumaTotal}}
                        </vs-chip>
                    </div>    
                </template>
                <template slot="thead">
                     <vs-th sort-key="serie">Serie</vs-th>
                    <vs-th sort-key="cantidad">Cantidad</vs-th>
                    <vs-th sort-key="libro">Asignatura</vs-th>
                    <vs-th sort-key="libro">Codigo liquidacion</vs-th>
                    <!-- <vs-th sort-key="contrato">Asesor</vs-th>
                    <vs-th sort-key="institucion">Institución</vs-th> -->
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].serie">
                            {{data[indextr].serie}}
                        </vs-td>
                        <vs-td :data="data[indextr].cantidad">
                            {{data[indextr].cantidad}}
                        </vs-td>
                        <vs-td :data="data[indextr].nombrelibro">
                            {{data[indextr].nombrelibro}}
                        </vs-td>
                        <vs-td :data="data[indextr].nombrelibro">
                            {{data[indextr].codigo}}
                        </vs-td>
                        <!-- <vs-td :data="data[indextr].asesor">
                            {{data[indextr].asesor}}
                        </vs-td>
                        <vs-td :data="data[indextr].nombreInstitucion">
                            {{data[indextr].nombreInstitucion}}
                        </vs-td> -->
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <!--MODAL PARA EXPORTAR A EXCEL-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
            <!--<span class="mr-4">Cell Auto Width:</span>
            <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
        </div>
    </vs-prompt>
   
     </div>  
 
</template>


<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/js/all.min.js" integrity="sha512-M+hXwltZ3+0nFQJiVke7pqXY7VdtWW2jVG31zrml+eteTP7im25FdwtLhIBTWkaHRQyPrhO2uy8glLMHZzhFog==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
<script src="https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/blob-polyfill/4.0.20200601/Blob.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xls/0.7.6/xls.core.min.js"></script>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
import jsPDF from 'jspdf' 
import html2canvas from "html2canvas"
import pdfMake from "pdfmake/build/pdfmake";
// var pdfMake = require ('pdfmake/build/pdfmake.js');
var pdfFonts = require ('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
    data(){
        return{
            //para el reporte excel
            fileName: null,
            activePrompt: false,
             codigoSelected: [],
             reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //listado de ciudades para el select
            arregloCiudad:[],
            //array de instituciones para el select filtrado  por ciudades
            arregloTraeInstitucion:[],
            //array de periodos para el select filtrado  por institucion
            arregloPeriodos:[],
            //para el select de la ciudades
            arregloLiquidacion:[],
            ciudadSelect:'',
            liquidacion:{
                institucion:'',
                periodo:'',
                condicion:'1',
            },
        }
    },
    props:{
        arregloLiquidacion:{
            type:Array,
            default: []
        },
    },
    watch:{
        datos(results){
            this.reRenderCodigos(results)
        }
    },
    computed:{
        sumaTotal(){
            let me = this;
            if(me.arregloLiquidacion.length >0){
                let datos = me.arregloLiquidacion.filter(p => p.cantidad)
                let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
                return total
            }     
        },
    },
    methods:{
        reRenderCodigos(results){
            const me = this 
            me.arregloLiquidacion = results 
        },
        //para generar el reporte
        reporte() {
            var body = [];

            body.push([{text: 'serie'},{text: 'libro'},{text: 'cantidad'}, {text: 'asesor'},{text: 'Institucion'},]);
            for (var key in this.arregloLiquidacion) 
            {
                if (this.arregloLiquidacion.hasOwnProperty(key))
                {
                    var item = this.arregloLiquidacion[key];
                    var fila = new Array();
                     fila.push( item.serie.toString() );
                    fila.push( item.nombrelibro.toString()  );
                    fila.push( item.cantidad.toString() );
                    // fila.push( item.codigo_liquidacion.toString()  );
                     fila.push( item.asesor.toString()  );
                    fila.push( item.nombreInstitucion.toString() );
                    body.push(fila);
                }

            }
            var dd = {
                content: [
                    {
                        table: 
                        {
                            headerRows: 1,
                            body: body
                        }
                    }
                ]
            };
         pdfMake.createPdf(dd).download("liquidacion.pdf");
       },

      //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
           exportToExcel() {
            let headerTitle = ['serie' ,'libro', 'cantidad'];
            let headerVal = [ 'serie','nombrelibro','cantidad'];
            let codigoSelectedMayus = this.codigoSelected
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }

            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },

       //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
            me.arregloTraeInstitucion = []
            me.arregloPeriodos = []
            this.$http.get(this.$server_url+`ciudad`).then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        }, 

         //para filtrar instituciones por ciudades
         filtrarInstituciones(){
                let me = this;
                me.arregloPeriodos = []
                if( me.ciudadSelect.idciudad === undefined ){
                    me.$vs.notify({
                        text:'Seleccione una ciudad antes de filtrar por Instituciones',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    return;
                }

                me.arregloTraeInstitucion = []
                
                me.$vs.loading()
                const formData = new FormData();
                    formData.append('ciudad_id', me.ciudadSelect.idciudad);
                   

                this.$http.post(this.$server_url+'traerinstituciones', formData).then(res => {
                    me.arregloTraeInstitucion = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })

        },

          //para filtrar periodos por institucioin
         filtrarPeriodos(){
            let me = this;
            if( me.liquidacion.institucion.region_idregion === undefined ){
                me.$vs.notify({
                    text:'Seleccione una institucion antes de filtrar por Periodos',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            me.arregloPeriodos = []
            me.$vs.loading()
            const formData = new FormData();
            formData.append('condicion', me.liquidacion.condicion);
            formData.append('region_idregion', me.liquidacion.institucion.region_idregion);
            this.$http.post(this.$server_url+'traerperiodos', formData).then(res => {
                me.arregloPeriodos = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })

        },

         //para filtrar la liquidacion
        filtrarLiquidacion(){
            let me = this;
            me.arregloLiquidacion = []
            me.$vs.loading()
            const formData = new FormData();
            formData.append('id_periodo',me.liquidacion.periodo.idperiodoescolar );
            formData.append('idinstitucion',me.liquidacion.institucion.idInstitucion );
            this.$http.post(this.$server_url+'liquidacionperiodo', formData).then(res => {
                console.log(res.data);
                $("#botonreporte").css('display','block');
                $("#botonexcel").css('display','block');
                me.arregloLiquidacion = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })

        },
    },
    created(){
        this.listaCiudades();
       
        
    },
    components: {
        'v-select': vSelect,
        
    },
}




</script>

<style>
#botonreporte{
    display:none;
}
#botonexcel{
    display:none;
    margin:0 10px;
}
</style>