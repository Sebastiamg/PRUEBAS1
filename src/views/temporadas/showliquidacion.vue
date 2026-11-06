<template>
<div>
    <div v-if="contratoLiquidacion.length=='0'">
    <h1>No hay data para este contrato o ocurrio con un error con el periodo</h1>
    </div>
    <div v-if="contratoLiquidacion.length > 0">
        <ul v-for="item in temporadaObjeto" v-bind:key="item">
            <vs-list>
                <vs-list-item icon="check" title="Contrato" :subtitle="item.contrato">     
                </vs-list-item>
                <vs-list-item icon="check" title="Profesor" :subtitle="item.temporal_nombre_docente">        
                </vs-list-item>
                <vs-list-item icon="check" title="Temporada" :subtitle="item.temporada">  
                </vs-list-item>
                <vs-list-item icon="check" title="Asesor" :subtitle="asesor">    
                </vs-list-item>
            </vs-list>
            </ul>
        <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="codigosInstitucion">
            <template slot="header">
                <vs-chip color="primary" style="font-size:12px;">
                Total Libros: {{sumaTotal}}
                </vs-chip>
                <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
            </template>
            <template slot="thead">
                <vs-th sort-key="serie">Serie</vs-th>
                <vs-th sort-key="libro">Asignatura</vs-th>
            
                <vs-th sort-key="cantidad">Cant Códigos</vs-th>
                <vs-th sort-key="libro">Cod. Liquidacion</vs-th>
                <vs-th sort-key="asesor">Asesor</vs-th>
                <vs-th sort-key="institucion">Institución</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                    <vs-td :data="data[indextr].serie">
                        {{ data[indextr].serie }}
                    </vs-td>

                    <vs-td :data="data[indextr].nombrelibro">
                        {{ data[indextr].nombrelibro }}
                    </vs-td>

                    <!-- <vs-td :data="data[indextr].codigo_liquidacion">
                        {{ data[indextr].codigo_liquidacion }}
                    </vs-td> -->

                    <vs-td :data="data[indextr].cantidad">
                        {{ data[indextr].cantidad }}
                    </vs-td>
                    <vs-td :data="data[indextr].codigo">
                        {{ data[indextr].codigo }}
                    </vs-td>

                    <vs-td :data="data[indextr].asesor">
                        {{ data[indextr].asesor }}
                    </vs-td>

                    <vs-td :data="data[indextr].nombreInstitucion">
                        {{ data[indextr].nombreInstitucion }}
                    </vs-td>

                </vs-tr>
            </template>
        </vs-table>
        <!--modal exportar-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
            </div>
        </vs-prompt>
    </div>
    <!--fin modal exportar-->
</div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default{
 data:()=>({
        status:"0",
        codigosInstitucion:[],
        temporadaObjeto:[],
        //para la tabla seleccionada
        codigoSelected: [],
        //para exportar
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        fileName:null,
        selectedFormat: 'xls',
        cellAutoWidth: true,
        activePrompt: false,
        asesor:"",
        }
 	),
    props:{
        contratoLiquidacion:{
            type:String,
            default:"",
        }
    },
    computed:{
        sumaTotal(){
            let me = this;
            if(me.codigosInstitucion.length >0){
                let datos = me.codigosInstitucion.filter(p => p.cantidad)
                let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
                return total
            }     
        },
    },
  methods:{
    //traer la liquidacion
    getLiquidacion(){
        let me = this;
        me.$vs.loading()
        this.$http.get(this.$server_url + 'temporadas/liquidacion/' + me.contratoLiquidacion)
        .then(res => {
            me.$vs.loading.close()
            //llenar el arreglo  de libros 
            this.codigosInstitucion = res.data.codigos_libros;
            //lenar el array de temporada
            this.temporadaObjeto = res.data.temporada;
            this.asesor = this.temporadaObjeto[0].nombre_asesor;
        })
        .catch(function(e){
            me.$vs.loading.close()
        })
    },
  	exportToExcel() {
        let headerTitle = [ 'serie','Libro', 'Cantidad', 'Cod. Liquidacion', 'asesor', 'Institucion'];
        let headerVal = [ 'serie','nombrelibro', 'cantidad','codigo', 'asesor' ,'nombreInstitucion'];
        import('@/vendor/Export2Excel').then(excel => {
            const data = this.formatJson(headerVal, this.codigoSelected)
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
  		//limpiar campos para exportar de nuevo
  	clearFields() {
        this.fileName = ''
        this.cellAutoWidth = true
        this.selectedFormat = 'xls'
    },
  },
    components: {
        'v-select': vSelect,
        flatPickr,
    },
   created() {
       let me =this;
       me.getLiquidacion()
    }   	
}
</script>
