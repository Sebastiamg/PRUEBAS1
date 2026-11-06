<template>
    <div>
        <div>
            <vs-table multiple stripe v-model="codigoSelected" pagination max-items="25" search :data="arregloLinks">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-chip color="success" style="font-size:12px;">
                          Total links: {{arregloLinks.length}}
                        </vs-chip>
                        <vs-button color="warning" type="line" icon="description"  size="small" class="mr-5 ml-3" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button>
                        <!-- <vs-button type="line" icon="save" @click="popupAgregar = true;limpiar();title='Generar Link'">Añadir link</vs-button> -->
                    </div>
                </template>
                <template slot="thead">
                     <vs-th sort-key="nombrelibro">Libro</vs-th>
                    <vs-th sort-key="unidad">Unidad</vs-th>
                    <vs-th sort-key="pagina">Pagina</vs-th>
                    <vs-th sort-key="contrato">Links</vs-th>
                    <vs-th sort-key="institucion">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombrelibro">
                            {{data[indextr].nombrelibro}}
                        </vs-td>
                        <vs-td :data="data[indextr].unidad">
                            {{data[indextr].unidad}}
                        </vs-td>
                        <vs-td :data="data[indextr].pagina">
                            {{data[indextr].pagina}}
                        </vs-td>
                        <vs-td :data="data[indextr].link_original">
                            <p style="font-weight: bold;">Editor:</p>
                            <span>{{data[indextr].editor}}</span><br>
                            <p style="font-weight: bold;">Link original:</p>
                            <span>{{data[indextr].link_original}}</span><br>
                            <p style="font-weight: bold;">Link acortado:</p>
                            <span>{{data[indextr].link_acortado}}</span>
                        </vs-td>
                        <vs-td :data="data[indextr].nombrelibro">
                            <div class="flex">
                                <vx-tooltip style="display: inline-block;" text="Copiar link" position="top" color="success">
                                    <vs-button size="small" class="modal-default-button" color="success" @click="copiarLink(data[indextr])" type="line" icon-pack="feather" icon="icon-copy">
                                    </vs-button>
                                </vx-tooltip>
                                <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top" color="success">
                                    <vs-button size="small" class="modal-default-button" color="warning" @click="openEditar(data[indextr]);generar=false" type="line" icon-pack="feather" icon="icon-edit">
                                    </vs-button>
                                </vx-tooltip>
                                <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top" color="success">
                                    <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr])" type="line" icon-pack="feather" icon="icon-trash">
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
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
                <!--<span class="mr-4">Cell Auto Width:</span>
                <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
            </div>
        </vs-prompt>
        <!--MODAL PARA AGREGAR-->
        <vs-popup classContent="popup-example" fullscreen :title="title" :active.sync="popupAgregar">
            <div class="flex mb-4">
                <div class="w-full p-2 bg-gray-400 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Area
                    </p>
                    <v-select @input="filtroLibros()" :options="areas" :reduce="areas => areas" label="nombrearea" class="w-full" v-model="acortador.area" />
                </div>
            </div>
            <div class="flex mb-4">
                <div class="w-1/2 p-2 bg-gray-400 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Libro
                    </p>
                    <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full" v-model="acortador.libro" />
                </div>
                <div class="w-1/2 p-2 bg-gray-500 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Unidad
                    </p>
                     <v-select :options="unidades" :reduce="unidades => unidades" label="id" class="w-full" v-model="acortador.unidad" />
                </div>
            </div>
            <div class="flex mb-4">
                <div class="w-1/2 p-2 bg-gray-400 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Seleccione la pagina
                    </p>
                    <vs-input type="number" class="inputx w-full" placeholder="Pagina" v-model="acortador.pagina"/>
                </div>
                <div class="w-1/2 p-2 bg-gray-500 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Enlace original
                    </p>
                    <vs-input class="inputx w-full"  placeholder="Ingrese el link" v-model="acortador.link_original"/>
                </div>
            </div>
            <vs-row v-if="id > 0">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2">
                    <p>link acortado</p>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                   <vs-input class="inputx w-full" disabled placeholder="Ingrese el link" v-model="acortador.link_acortado"/>
                </vs-col>
            </vs-row>
            <div class="flex mt-3">
                <vs-button v-if="generar == false" @click="generateLink()" class="ml-2" color="success" type="filled">{{ title }}</vs-button>
                </div>
        </vs-popup>
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
import jsPDF from 'jspdf'
import html2canvas from "html2canvas"
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
            //fin variables para exportar
            usuario:[],
            arregloLinks:[],
            arregloLibros:[],
            areas:[],
            popupAgregar:false,
            id:0,
            acortador:{
                libro:'',
                unidad:'',
                pagina:'',
                link_original:'',
                link_acortado:'',
                area:'',
            },
            unidades:[
                {id:"1"},
                {id:"2"},
                {id:"3"},
                {id:"4"},
                {id:"5"},
                {id:"6"},
            ],
            generar:false,
            title:'',
        }
    },
    computed:{
    },
    methods:{
        //para obtener el listado de las areas
        getAreas() {
        let me = this;
        this.$http.get(this.$server_url+'areas')
            .then(function (res) {
                me.areas = res.data.area
                //excluir idarea 83
                me.areas = me.areas.filter(function (area) {
                  return area.idarea != 83;
                });
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        getLinks(){
        let me = this
        this.$http.get(this.$server_url+`l_`).then(res => {
            me.arregloLinks = res.data;
            })
            .catch(function (error) {
            console.log(error)
            })
        },
        //lista de libros para usar en el select
        filtroLibros(){
        let me = this
        me.acortador.libro = ""
        if(me.acortador.area == null || me.acortador.area == "" || me.acortador.area == undefined){
          return
        }
        me.$vs.loading();
        this.$http.get(this.$server_url+'filtroLibros?area='+me.acortador.area.idarea).then(res => {
            me.$vs.loading.close();
            me.arregloLibros = res.data;
            })
            .catch(function (error) {
            me.$vs.loading.close();
            console.log(error)
            })
        },
        generateLink(){
            let me = this;
            if(me.acortador.area == undefined || me.acortador.area == "" || me.acortador.area == null){
                me.$vs.notify({
                    text: "Tiene que seleccionar un area",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if(me.acortador.libro == undefined || me.acortador.libro == "" || me.acortador.libro == null){
                me.$vs.notify({
                    text: "Tiene que seleccionar un libro",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if(me.acortador.link_original.trim() == ""){
                me.$vs.notify({
                    text: "Tiene que escribir un link",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let formData = new FormData()
            formData.append('id',           me.id)
            formData.append('area_id',      me.acortador.area.idarea)
            formData.append('libro_id',     me.acortador.libro.idlibro)
            if(me.acortador.unidad == undefined || me.acortador.unidad == null || me.acortador.unidad == ""){
                formData.append('unidad',     "")
            }else{
                formData.append('unidad',       me.acortador.unidad.id)
            }
            formData.append('pagina',       me.acortador.pagina)
            formData.append('link_original',me.acortador.link_original)
            formData.append('link_acortado',me.acortador.link_acortado)
            formData.append('idusuario',    me.usuario.idusuario)
            me.$vs.loading();
            this.$http.post(this.$server_url+'l_', formData)
            .then(res => {
            me.$vs.loading.close()
            if(me.id > 0){
                me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getLinks()
                me.popupAgregar = false
                return
            }
            if(me.id == 0){
                me.generar=true;
            }
            let ruta = res.data
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                } else {
                    me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
            me.getLinks()
            me.popupAgregar = false
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })
        },
        copiarLink(tr){
            let me = this;
            let ruta = tr.link_acortado
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                } else {
                    me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
        },
        openEditar(tr){
            let me                      = this;
            me.id                       = tr.id
            me.acortador.area           = {idarea:tr.area_id,nombrearea:tr.nombrearea}
            me.acortador.libro          = {idlibro:tr.libro_id,nombrelibro:tr.nombrelibro}
            me.acortador.unidad         = {id:tr.unidad}
            me.acortador.pagina         = tr.pagina
            me.acortador.link_original  = tr.link_original
            me.acortador.link_acortado  = tr.link_acortado
            me.title                    = "Actualizar link"
            me.popupAgregar             = true
        },
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar?',
                accept:this.eliminarLink
            })
        },
        eliminarLink(){
        let me = this
        me.$vs.loading()
        this.$http.delete(this.$server_url+'l_/'+me.id)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Se elimino correctamente el link',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getLinks()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            console.log(error)
            })
        },
        limpiar(){
            let me                      = this;
            me.generar                  = false
            me.id                       = 0
            me.acortador.area           = ''
            me.acortador.libro          = ''
            me.acortador.unidad         = ''
            me.acortador.pagina         = ''
            me.acortador.link_original  = ''
            me.acortador.link_acortado  = ''
        },
      //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
           exportToExcel() {
            let headerTitle = ['libro' ,'Editor', 'Unidad', 'Pagina','Link original','link acortado'];
            let headerVal = [ 'nombrelibro','editor','unidad',  'pagina','link_original','link_acortado'];
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
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getLinks()
        me.getAreas()
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
