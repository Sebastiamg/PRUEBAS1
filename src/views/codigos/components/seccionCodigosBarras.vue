<template>
    <div>
        <vs-card>
            Filtrar por ciudad:
            <div style="width:65%;min-width: 400px; ">
                <v-select   @input="filtrarInstituciones()" :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="ciudadSelect" />
            </div>
              <br/>
            Filtrar por Institucion:
            <v-select style="width: 65%; min-width: 400px; text-transform: uppercase" @input="FiltroClearPeriodos()" :options="arregloTraeInstitucion" v-model ="liquidacion.institucion"  :dir="$vs.rtl ? 'rtl' : 'ltr'" />
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
            <div class="vx-col w-full mt-5">
                Periodo:
                <v-select :options="arregloPeriodos" @input="buscarReportesLibrosAsesor(liquidacion.institucion)" :reduce="arregloPeriodos => arregloPeriodos" label="periodo" class="w-full" v-model ="liquidacion.periodo" />
            </div>
            <vs-table multiple v-model="codigoSelected"  stripe pagination max-items="25" search :data="codigosInstitucion">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt=true;">
                            Exportar
                        </vs-button>
                        <vs-chip color="success" style="font-size:12px;">
                          Total códigos: {{sumaTotal}}
                        </vs-chip>
                        <!-- <vs-chip color="primary" style="font-size:12px;">
                          Cantidad de códigos en la tabla: &nbsp; <b>{{codigosInstitucion.length}}</b>
                        </vs-chip>    -->
                        <div class="ml-4">
                            <ul style="display:flex;">
                                <li>
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0">Todos</vs-radio>
                                </li>
                                <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="1"><span style="font-weight:bold;">{{sumarCodigosActivos}}</span> Códigos activos </vs-radio>
                                </li>
                                <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="2"><span style="font-weight:bold;">{{sumaCodigosBloqueados}}</span> Códigos bloqueados</vs-radio>
                                </li>
                                <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{sumaCodigosRegalados}}</span> Códigos Regalados </vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="docente">Códigos</vs-th>
                    <vs-th sort-key="nombres">Datos Estudiante</vs-th>
                    <vs-th sort-key="contrato">Datos código de barras</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].codigo">
                            <p style="font-weight:bold;">Código:</p>
                            {{ data[indextr].codigo }}
                            <p style="font-weight:bold;">Libro:</p>
                            <span>{{ data[indextr].libro }}</span><br/>
                            <p style="font-weight:bold;">Contrato:</p>
                            <span>{{ data[indextr].contrato }}</span><br/>
                            <p style="font-weight:bold;">Estado:</p>
                            <div v-if="tr.estado == '2'">
                                <vs-chip color="danger">Bloqueado</vs-chip>
                            </div>
                            <div v-else>
                               <vs-chip color="success">Activo</vs-chip>
                            </div>
                        </vs-td>
                        <vs-td>
                            <p style="font-weight:bold;">Nombres:</p>
                            <p style="font-size:12px;letter-spacing:1px;">{{ data[indextr].nombres }} {{ data[indextr].apellidos}}</p>
                            <p style="font-weight:bold;">Email:</p>
                            <span>
                                {{ data[indextr].email }}<br/>
                            </span>
                            <p style="font-weight:bold;">Registrado:</p>
                            <span>{{ data[indextr].registrado }}</span><br/>
                            <p style="font-weight:bold;">Cedula:</p>
                            <span>{{ data[indextr].cedula }}</span><br/>
                            <p style="font-weight:bold;">Institución:</p>
                            <span>{{ data[indextr].nombreInstitucion }}</span><br/>
                            <p style="font-weight:bold;">Periodo:</p>
                            <span>{{ data[indextr].periodo }}</span><br/>

                        </vs-td>
                        <vs-td>
                            <p style="font-weight:bold;">contador:</p>
                            <span v-if="tr.contador > 1">{{ data[indextr].contador }}</span>
                            <p style="font-weight:bold;">bc_estado:</p>
                            <span>{{tr.barrasEstado}}</span>
                            <p style="font-weight:bold;">bc_institucion:</p>
                            <span>{{tr.institucionBarra}}</span>
                            <p style="font-weight:bold;">bc_periodo:</p>
                            <span>{{tr.periodo_barras}}</span>
                            <p style="font-weight:bold;">venta_estado:</p>
                            <span>{{ data[indextr].ventaEstado }}</span>
                            <p>
                                <vs-chip color="success" v-if="tr.estado_liquidacion == '1'">
                                    Por liquidarse
                                </vs-chip>
                                <vs-chip color="warning" v-else-if="tr.estado_liquidacion == '2'">
                                    Regalado
                                </vs-chip>
                                <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '0'">
                                    Liquidado
                                </vs-chip>
                                <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '3'">
                                    DEVUELTO
                                </vs-chip>
                            </p>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-card>
        <!--Modales-->
        <!----modal exportar--------->
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
         <!----fin modal exportar--------->
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
export default {
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
            //variables para exportar a excel
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            reporteAsesorActivo: false,
            guardarActivo:'',
            generarActivo:'',
            textAlertCant:'',
            cantidad:'',
            arregloCodigos:[],
            codigoTipo:'0'
        }
    },
    components:{
          'v-select': vSelect,
    },
    created(){
        let me = this;
        me.listaCiudades();
    },
    computed:{
        sumaTotal(){
            let me = this;
            let total = me.arregloCodigos.length
            return total
        },
        sumaCodigosRegalados(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos = primerFiltro.filter(p => p.estado_liquidacion =='2')
            let resultado = datos.length
            return resultado
        },
        sumaCodigosBloqueados(){
            let me = this;
            let datos = me.arregloCodigos.filter(p => p.estado == '2');
            let resultado = datos.length
            return resultado
        },
        sumarCodigosActivos(){
            let me = this;
            let primerFiltro = me.arregloCodigos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos = primerFiltro.filter(p => p.estado_liquidacion =='0' ||  p.estado_liquidacion =='1')
            let resultado = datos.length
            return resultado
        }
    },
    methods:{
        //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
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
            me.liquidacion.institucion = "";
            me.codigosInstitucion = []
            me.arregloTraeInstitucion = []
            me.liquidacion.periodo = "";
            me.liquidacion.condicion = "";
            if( me.ciudadSelect.idciudad === undefined ){
                me.$vs.notify({
                    text:'Seleccione una ciudad antes de filtrar por Instituciones',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            me.$vs.loading()
            const formData = new FormData();
            this.$http.get(this.$server_url+'institucionesResportes?filtroInstitucion=yes&ciudad_id='+me.ciudadSelect.idciudad)
            .then(res => {
                me.arregloTraeInstitucion = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        FiltroClearPeriodos(){
            let me = this;
             me.liquidacion.periodo = "";
             me.liquidacion.condicion = "";
             me.codigosInstitucion = [];
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
                me.codigosInstitucion = datos.filter(p => p.estado == '2');
                return
            }
            //para ver los codigos regalados
            if(me.codigoTipo == 4){
                    let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
                    me.codigosInstitucion = primerFiltro.filter(p => p.estado_liquidacion =='2')
                    return
            }
            //para ver todos los codigos
            else{
                me.codigosInstitucion = datos
            }

        },
        buscarReportesLibrosAsesor(item) {
            let me  = this;
            if(me.liquidacion.periodo == null || me.liquidacion.periodo == undefined || me.liquidacion.periodo == ""){
                 this.$vs.notify({
                        text: 'No ha seleccionado un periodo',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return false
            }
            this.codigoSelected = [];
            this.openLoadingColor();
            this.$http.get(this.$server_url+'reporteCodigosBarras/' + item.id+'/'+me.liquidacion.periodo.idperiodoescolar)
            .then(res => {
                this.$vs.loading.close()
                if (res.data[0] === undefined) {
                    this.$vs.notify({
                        text: 'No existen códigos asignados a esta institución',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return false
                }
                this.arregloCodigos = res.data
                let datos = res.data
                this.codigosInstitucion  = datos;
                localStorage.setItem('codigos',JSON.stringify( this.codigosInstitucion))

            })
            .catch(function(e){
                this.$vs.loading.close()

            })
        },
         exportToExcel() {
            let headerTitle = ['codigo','institucion estudiante','periodo estudiante','libro', 'registrado', 'cedula', 'nombres', 'apellidos', 'email','estado','contrato','liquidacion','código de barras','venta estado','institucion barras','periodo barras'];
            let headerVal = ['codigo', 'nombreInstitucion','periodo','libro', 'registrado', 'cedula', 'nombres', 'apellidos', 'email','codigoEstado','contrato','liquidacion','barrasEstado','ventaEstado','institucionBarra','periodo_barras'];
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
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        openLoadingColor(libro) {
            this.$vs.loading({
                color: '#1A76F2'
            })

        },
    }
}
</script>
