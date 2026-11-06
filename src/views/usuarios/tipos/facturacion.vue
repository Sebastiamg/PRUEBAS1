<template>
    <vx-card>
        <div>
            <p class="text-primary text-2xl font-medium">Lista de usuarios facturadores</p>
            <vs-divider></vs-divider>
            <vs-table multiple stripe v-model="codigoSelected"  pagination max-items="25" search :data="arregloFacturadores">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-chip color="success" style="font-size:12px;">
                          Total: {{arregloFacturadores.length}}
                        </vs-chip>
                        <vs-button color="warning" type="line" icon="description"  size="small" class="mr-5 ml-3" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="asesor">Facturador</vs-th>
                    <vs-th sort-key="cedula">Cédula</vs-th>
                    <vs-th sort-key="cedula">Grupo</vs-th>
                    <vs-th sort-key="cedula">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].Nombres">
                            <span class="font-bold">Nombres:</span>
                            <p>{{data[indextr].usuario}}</p>
                            <span class="font-bold">Usuario:</span>
                            <p>{{data[indextr].name_usuario}}</p>
                        </vs-td>
                        <vs-td :data="data[indextr].cedula">
                            {{data[indextr].cedula}}
                        </vs-td>
                        <vs-td :data="data[indextr].cedula">
                            <vs-chip  color="success">
                                {{data[indextr].grupo}}
                            </vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].nombrevideo">
                            <div class="flex">
                                <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                                    <vs-button type="line" size="small" icon-pack="feather" icon="icon-edit" color="warning" @click="popupActivo=true;getEdit(tr)"></vs-button>
                                </vx-tooltip>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
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
        <!--Modal de Editar-->
        <vs-popup class="editpop"  fullscreen="true" title="Editar" :active.sync="popupActivo">
            <editarUsuarioVue @saveChange="changeHandleEditar" :usuarios="usuarios" :instituciones="instituciones"/>
        </vs-popup>
    </vx-card>
</template>
<script>
import editarUsuarioVue from './components/editarUsuario.vue';
export default{
    data(){
        return{
            usuarios:[],
            arregloFacturadores:[],
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
            cedula:0,
            lookInstituciones:false,
            instituciones:[],
            popupActivo:false,
        }
    },
    components:{
        editarUsuarioVue,
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
    },
    created(){
        let me = this;
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
    },
    mounted(){
        let me = this;
        me.getUsuarios();
    },
    methods:{
        changeHandleEditar(){
            let me = this;
            me.getUsuarios()
            me.popupActivo = false
        },
        //editar
        getEdit(data={}){
            let me = this;
            me.usuarios = data
        },
        getUsuarios(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getUsuariosFacturadores')
                .then(function (res) {
                    me.$vs.loading.close();
                    me.arregloFacturadores = res.data
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                })
        },
        verInstituciones(tr){
            let me = this;
            me.cedula = tr.cedula;
            me.lookInstituciones = true;
        },
         //para limipiar los campos del excel
         clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
           exportToExcel() {
            let headerTitle = ['Facturador' ,'Cedula', 'Grupo'];
            let headerVal = [ 'usuario','cedula','grupo'];
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
