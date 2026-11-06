<template>
    <div>
        <div v-if="usuario.id_group == 11 || usuario.id_group == 1">
            <div>
             <br/><br/>
                <vs-table   multiple stripe v-model="codigoSelected"  max-items="25" search pagination :data="arregloAsesores" style="margin-top:-40px">
                    <template slot="header">
                        <ul class="leftx" style="display:flex;flex-direction: row;">
                            <li class="ml-2">
                            <vs-radio v-model="region" vs-name="radios1" @input="filtroInstituciones()" vs-value="1">Sierra</vs-radio>
                            </li>
                            <li class="ml-2">
                            <vs-radio v-model="region" vs-name="radios1" @input="filtroInstituciones()" vs-value="2">Costa</vs-radio>
                            </li>
                            <li>
                                <vs-chip class="ml-3" transparent color="danger" style="margin-top:-3px;">
                                   Cantidad {{ arregloAsesores.length }}
                                </vs-chip>
                            </li>
                            <vs-button color="warning" type="line" icon="description"  size="small" class="mr-5 ml-3" style="font-size: 14px;margin-top: -10px;" @click="activePrompt=true;">Exportar</vs-button>
                        </ul>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                        <vs-th sort-key="ciudad">Ciudad</vs-th>
                        <vs-th sort-key="periodo">Período</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr"  :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{tr.nombreInstitucion}}
                            </vs-td>
                            <vs-td>
                                {{data[indextr].ciudad}}<br>
                            </vs-td>
                            <vs-td>
                               <p> {{ tr.periodo }}</p>
                                 <vs-chip :color="tr.estado == 1?'primary':'danger'">
                                   {{tr.estado == 1 ?'Activo':'No activo'}}
                                </vs-chip>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
        <!--MODAL PARA EXPORTAR A EXCEL-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
            </div>
        </vs-prompt>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tmparregloAsesores:[],
            arregloAsesores:[],
            usuario:[],
            escuelas:[],
            region:'2',
            //para el reporte excel
            fileName: null,
            activePrompt: false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables para exportar
        }
    },
    props:{
        periodo_idSierra:{
            type:Number,
            default:0,
        },
        periodo_idCosta:{
            type:Number,
            default:0,
        },
        cedula:{
            type:String,
            default:'0',
        },
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getEscuelas();
    },
    methods:{
         //cantidad de escuelas del asesor
        async getEscuelas() {
            let me = this;
            this.$http.get(this.$server_url+'getInstitucionesxAsesor?cedula='+me.cedula)
                .then(function (res) {
                    me.tmparregloAsesores = res.data
                    me.filtroInstituciones()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        filtroInstituciones(){
            let me = this;
            me.arregloAsesores = []
            let datos = me.tmparregloAsesores;
            me.arregloAsesores = datos.filter(p => p.region == me.region)
        },
         //para limipiar los campos del excel
         clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
           exportToExcel() {
            let headerTitle = ['Institucion' ,'Ciudad', 'Periodo'];
            let headerVal = [ 'nombreInstitucion','ciudad','periodo'];
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
    }
}
</script>
