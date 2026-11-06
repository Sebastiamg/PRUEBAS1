<template>
    <vx-card>
        <vs-card v-if="lookInstituciones">
            <vs-button @click="lookInstituciones = false;" color="danger" type="line" icon="person_add">Lista asesores</vs-button>
            <institucionesAsesorVue
              class="mt-3"
              :periodo_idSierra="periodo_idSierra"
              :periodo_idCosta="periodo_idCosta"
              :cedula="cedula"
            />
        </vs-card>
        <div
            v-else
            title="Lista de asesores"
            title-color="primary"
            subtitle-color="warning"
            subtitle="Seleccione para exportar."
            code-toggler>
            <p class="text-primary text-2xl font-medium">Lista de asesores</p>
            <!-- <div class="flex mt-2" style="flex-wrap: wrap;" v-if="permisoRoot">
                <vs-divider>Apis de milton</vs-divider>
                <vx-tooltip style="display: inline-block;" text="Generar las iniciales en los asesores" position="top" color="dark">
                    <button class="btna" @click="api='cargar_codigos_vendedores';verApi();" >Generar iniciales</button>
                </vx-tooltip>
                <vx-tooltip style="display: inline-block;" text="Generar el campo id_ciudad_milton en la tabla ciudad para ciudades nuevas" position="top" color="dark">
                    <button class="btna" @click="api='cargar_codigo_ciudad';verApi();">Generar cod. Ciudades</button>
                </vx-tooltip>
            </div> -->
            <vs-divider></vs-divider>
            <vs-table multiple stripe v-model="codigoSelected"  pagination max-items="25" search :data="arregloAsesores">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-chip color="success" style="font-size:12px;">
                          Total asesores: {{arregloAsesores.length}}
                        </vs-chip>
                        <vs-button color="warning" type="line" icon="description"  size="small" class="mr-5 ml-3" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="asesor">Asesor</vs-th>
                    <vs-th sort-key="cedula">Iniciales</vs-th>
                    <vs-th sort-key="cedula">Cantidad de instituciones</vs-th>
                    <vs-th sort-key="cedula">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].asesor">
                            <span class="font-bold">Nombres:</span>
                            <p>{{data[indextr].asesor}}</p>
                            <span class="font-bold">Usuario:</span>
                            <p>{{data[indextr].name_usuario}}</p>
                            <p>
                              <span class="font-bold">Cédula:</span>
                            </p>
                            <p>
                              {{data[indextr].cedula}}
                            </p>
                            <b>Estado:</b>
                            <p class="text-success" v-if="tr.estado_idEstado == 1">Activo</p>
                            <p class="text-danger" v-else>Inactivo</p>
                        </vs-td>
                        <vs-td>
                            {{ tr.iniciales }}
                        </vs-td>
                        <vs-td :data="data[indextr].cedula">
                            <vs-chip  color="success">
                                {{data[indextr].cantidad_instituciones}}
                            </vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].nombrevideo">
                            <div class="flex">
                                <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                                    <vs-button type="line" size="small" icon-pack="feather" icon="icon-edit" color="warning" @click="popupActivo=true;getEdit(tr)"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;" text="Ver instituciones" position="top" color="success">
                                    <vs-button size="small" @click="verInstituciones(tr)" class="modal-default-button" color="success" type="line" icon-pack="feather" icon="icon-clipboard">
                                    </vs-button>
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
          <div v-if="popupActivo">
            <editarUsuarioVue @saveChange="changeHandleEditar" :usuarios="usuarios" :instituciones="instituciones"/>
          </div>
        </vs-popup>
    </vx-card>
</template>
<script>
import institucionesAsesorVue from './InstitucionesAsesor.vue'
const editarUsuarioVue = () => import('./components/editarUsuario.vue')
export default{
    data(){
        return{
            usuario:[],
            usuarios:[],
            arregloAsesores:[],
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
            popupActivo:false,
            instituciones:[],
            api:'',
            permisoRoot:false,
        }
    },
    components:{
        institucionesAsesorVue,
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
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
    },
    mounted(){
        let me = this;
        me.getAsesoresInstituciones();
        me.getUserRoot()
    },
    methods:{
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
                .then(function (res) {
                    if(res.data.status == '1'){
                        me.permisoRoot = true
                    }else{
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        changeHandleEditar(){
            let me = this;
            me.getAsesoresInstituciones()
            me.popupActivo = false
        },
        //editar
        getEdit(data={}){
            let me = this;
            me.usuarios = data
        },
        getAsesoresInstituciones(){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getAsesoresInstituciones')
                .then(function (res) {
                    me.$vs.loading.close();
                    me.arregloAsesores = res.data
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
        verApi(){
            let me = this;
            let ruta = "https://server1.prolipadigital.com.ec/"+me.api;
            window.open(ruta,'_blank')
        },
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['Asesor' ,'Cedula', 'Cantidad visitas'];
            let headerVal = [ 'asesor','cedula','cantidad_instituciones'];
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
<style lang="scss">
@import '@/assets/scss/general/general.scss';
    .btna{
        font-size: 14px!important;
        @include button-1;
        background-color:var(--colorazul);
    }
    .btna:hover{
        opacity: 0.7;
    }
    // .btna:nth-child(1){
    //     background-color:var(--colortomate);
    // }
    // .btna:nth-child(2){
    //     background-color:var(--colorazul);
    // }
    // .btna:nth-child(3){
    //     background-color:var(--detalles);
    // }
</style>
