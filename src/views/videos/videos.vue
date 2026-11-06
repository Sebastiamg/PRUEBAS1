<template>
<div>
    <vs-card>
        <div>
            <div class="flex mb-4">
                <div class="w-2/3 p-2 bg-gray-400 text-center flex">
                    <p>Filtro por Asignaturas</p>
                    <v-select @input="filtrarListado(1)" :options="Asignaturas" :reduce="Asignaturas => Asignaturas.idasignatura" label="nombreasignatura" class="w-full" v-model="video.filtro" />
                    <vx-tooltip style="display: inline-block;" text="Mostrar todo" position="top" color="success">
                        <vs-button class="ml-2" @click="filtrarListado(2)" radius color="warning" type="gradient" icon="close"></vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <div class="flex flex-wrap sm:flex-row flex-col">
                <vs-button color="warning" type="line" icon="description" size="small" class="sm:mr-5 sm:ml-3 w-full sm:w-auto" style="font-size: 14px;" @click="activePrompt = true;">
                    Exportar
                </vs-button>

                <vs-button type="line" icon="save" class="w-full sm:w-auto" @click="popupAgregar = true; limpiar(); title = 'Generar Video'">
                    Añadir videos
                </vs-button>

                <vs-button color="success" type="line" icon="sync" size="small" class="sm:ml-3 w-full sm:w-auto" style="font-size: 14px;" @click="TransferirVideos()">
                    Transferir videos
                </vs-button>
            </div>

            <vs-table multiple stripe v-model="codigoSelected" pagination max-items="25" search :data="tmparregloVideos">
                <template slot="header">
                    <div style="display:flex;">
                        <vs-chip color="success" style="font-size:12px;">
                            Total videos: {{tmparregloVideos.length}}
                        </vs-chip>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="nombreasignatura">Asignatura</vs-th>
                    <vs-th sort-key="nombreasignatura">Video</vs-th>
                    <vs-th sort-key="nombreasignatura">Estado</vs-th>
                    <vs-th sort-key="nombreasignatura">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombreasignatura">
                            {{ tr.idvideo }}
                            <p style="font-weight:bold;">Asignatura:</p>
                            <span>{{ data[indextr].nombreasignatura }}</span><br />
                            <p style="font-weight:bold;">Unidad:</p>
                            <span>Unidad {{ data[indextr].unidad }} - {{ tr.nombre_unidad }}</span>
                            <p style="font-weight:bold;">Tema:</p>
                            <span v-if="tr.id_tema == 0">
                                <vs-chip color="warning">No tiene tema</vs-chip>
                            </span>
                            <span v-else>{{ data[indextr].nombre_tema }}</span>
                        </vs-td>
                        <vs-td :data="data[indextr].nombreasignatura">
                            <p style="font-weight:bold;">Nombre:</p>
                            <span>{{ data[indextr].nombrevideo }}</span>
                            <p style="font-weight:bold;">Descripcion:</p>
                            <span>{{ data[indextr].descripcionvideo }}</span>
                            <p style="font-weight:bold;">Enlace:</p>
                            <span style="cursor:pointer;" class="text-primary" @click="openVideo(tr)">{{ data[indextr].webvideo }}</span>
                        </vs-td>
                        <vs-td :data="data[indextr].Estado_idEstado">
                            <vs-chip v-if="tr.Estado_idEstado == 1" color="success">
                                Activado
                            </vs-chip>
                            <vs-chip v-else color="danger">
                                Desactivado
                            </vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].nombrevideo">
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
        <!--MODAL PARA AGREGAR-->
        <vs-popup classContent="popup-example" fullscreen :title="title" :active.sync="popupAgregar">
            <div class="w-full p-2 bg-gray-400 text-center">
                <p class="font-mono  text-lg text-gray-800 text-center">
                    Asignatura
                </p>
                <v-select @input="filtrarUnidades(1)" :options="Asignaturas" :reduce="Asignaturas => Asignaturas.idasignatura" label="nombreasignatura" class="w-full" v-model="video.asignatura" />
            </div>
            <div class="flex mb-4">
                <div class="w-1/2 p-2 bg-gray-400 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        {{ video.unidad }}
                        Unidades
                    </p>
                    <v-select @input="filtroTemas()" :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="video.unidad" />
                </div>
                <div class="w-1/2 p-2 bg-gray-500 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Temas
                    </p>
                    <v-select :options="arregloTemas" :reduce="arregloTemas => arregloTemas" label="tema" class="w-full" v-model="video.tema" />
                </div>
            </div>
            <div class="flex mb-4">
                <div class="w-1/2 p-2 bg-gray-400 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Nombre del video
                    </p>
                    <vs-input class="inputx w-full" placeholder="Ingrese nombre del video" v-model="video.nombre" />
                </div>
                <div class="w-1/2 p-2 bg-gray-500 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Descripcion
                    </p>
                    <vs-input class="inputx w-full" placeholder="Ingrese una descripcion" v-model="video.descripcion" />
                </div>
            </div>
            <div class="flex mb-4">
                <div class="w-1/2 p-2 bg-gray-400 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Link
                    </p>
                    <vs-input class="inputx w-full" placeholder="Ingrese el link" v-model="video.link" />
                </div>
                <div class="w-1/2 p-2 bg-gray-500 text-center">
                    <p class="font-mono  text-lg text-gray-800 text-center">
                        Estado
                    </p>
                    <ul class="flex justify-center">
                        <li class="mt-2">
                            <vs-radio v-model="video.estado" vs-name="radios1" vs-value="1">Activo</vs-radio>
                        </li>
                        <li class="ml-5 mt-2">
                            <vs-radio v-model="video.estado" vs-name="radios1" vs-value="0">Inactivo</vs-radio>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex mt-3">
                <vs-button v-if="generar == false" @click="generateLink()" class="ml-2" color="success" type="filled">{{ title }}</vs-button>
            </div>
        </vs-popup>
        <!--FIN MODAL AGREGAR-->
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
        <!--MODAL PARA VER VIDEO-->
        <vs-popup fullscreen title="Ver video" :active.sync="popupOpenVideo">
    <div class="video-container">
        <youtube class="youtube-video" :video-id="youtube"></youtube>
    </div>
</vs-popup>
    </vs-card>
    <vs-popup fullscreen class="informacionformhijo" title="Transferencia de Videos" :active.sync="popupActivoTransferenciaVideos">
        <TransferenciaVideos v-if="popupActivoTransferenciaVideos" :Asignaturas="Asignaturas" @change="changeHandleTransferenciaVideos" />
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
const TransferenciaVideos = () => import("@/views/videos/transferenciaVideos.vue");
// import pdfMake from "pdfmake/build/pdfmake";
// var pdfMake = require ('pdfmake/build/pdfmake.js');
// var pdfFonts = require ('pdfmake/build/vfs_fonts.js');
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {
    getIdFromUrl
} from 'vue-youtube'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)
export default {
    data() {
        return {
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
            usuario: [],
            arregloVideos: [],
            tmparregloVideos: [],
            Asignaturas: [],
            arregloTemas: [],
            arregloTraeUnidades2: [],
            popupAgregar: false,
            id: 0,
            video: {
                asignatura: '',
                nombre: '',
                descripcion: '',
                link: '',
                unidad: '',
                tema: '',
                estado: 1,
                video: '',
                filtro: '',
            },
            popupOpenVideo: false,
            generar: false,
            title: '',
            youtube: '',
            popupActivoTransferenciaVideos: false
        }
    },
    computed: {},
    methods: {
        TransferirVideos() {
            let me = this;
            me.popupActivoTransferenciaVideos = true;
        },
        changeHandleTransferenciaVideos(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemittransferencia == 1) {
                me.popupActivoTransferenciaVideos = false;
            } else if (e.verificacionemittransferencia == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoTransferenciaVideos = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        //para obtener el listado de asignaturas
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url + 'getAsignaturas')
                .then(function (res) {
                    me.Asignaturas = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getLinks() {
            let me = this
            this.$http.get(this.$server_url + `videos?getVideos=yes`).then(res => {
                    me.arregloVideos = res.data;
                    me.tmparregloVideos = res.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        filtrarListado(tipo) {
            let me = this;
            me.tmparregloVideos = []
            //todo
            if (tipo == 2) {
                me.tmparregloVideos = me.arregloVideos;
                me.video.filtro = ""
            }
            //filtro
            else {
                if (me.video.filtro == "" || me.video.filtro == null || me.video.filtro == undefined) {
                    me.$vs.notify({
                        text: "Tiene que seleccionar una asignatura",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.tmparregloVideos = me.arregloVideos;
                    return
                }
                let datos = me.arregloVideos;
                me.tmparregloVideos = datos.filter(p => p.asignatura_idasignatura == me.video.filtro)
            }
        },
        //lista de temas para usar en el select
        filtroTemas() {
            let me = this
            me.arregloTemas = []
            me.video.tema = ''
            if (me.video.unidad == "" || me.video.unidad == undefined || me.video.unidad == null) {
                me.$vs.notify({
                    text: 'Tiene que seleccionar una unidad',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            me.video.tema = ''
            me.$vs.loading();
            this.$http.get(this.$server_url + 'temasxUnidades/' + me.video.unidad).then(res => {
                    me.$vs.loading.close();
                    me.arregloTemas = res.data;
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error)
                })
        },
        openVideo(tr) {
            let me = this;
            me.video.video = tr.webvideo
            me.popupOpenVideo = true;
            const youtubeId = getIdFromUrl(tr.webvideo)
            console.log("youtubeId", youtubeId)
            me.youtube = youtubeId;
        },
        generateLink() {
            let me = this;
            if (me.video.asignatura == undefined || me.video.asignatura == "" || me.video.asignatura == null) {
                me.$vs.notify({
                    text: "Tiene que seleccionar una asignatura",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.video.tema == undefined || me.video.tema == "" || me.video.tema == null) {
                me.$vs.notify({
                    text: "Tiene que seleccionar un tema",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.video.link.trim() == "" || me.video.nombre.trim() == "") {
                me.$vs.notify({
                    text: "Tiene que escribir un link / y nombre para el video",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let formData = new FormData()
            formData.append('id', me.id)
            formData.append('nombrevideo', me.video.nombre)
            formData.append('descripcionvideo', me.video.descripcion)
            formData.append('webvideo', me.video.link)
            formData.append('asignatura_idasignatura', me.video.asignatura)
            formData.append('unidad_id', me.video.unidad)
            formData.append('id_tema', me.video.tema.id)
            formData.append('user_created', me.usuario.idusuario)
            formData.append('Estado_idEstado', me.video.estado)
            me.$vs.loading();
            this.$http.post(this.$server_url + 'videos', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getLinks()
                    me.popupAgregar = false
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        copiarLink(tr) {
            let me = this;
            let ruta = tr.webvideo
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
        },
        openEditar(tr) {
            let me = this;
            me.id = tr.idvideo
            me.video.tema = {
                id: tr.id_tema,
                tema: tr.tema
            }
            me.video.asignatura = tr.asignatura_idasignatura
            me.video.link = tr.webvideo
            me.video.nombre = tr.nombrevideo
            me.video.descripcion = tr.descripcionvideo
            me.video.estado = tr.Estado_idEstado
            me.video.unidad = tr.unidad_id
            me.title = "Actualizar video"
            if (tr.unidad_id == 0) {
                me.video.unidad = ''
                me.filtrarUnidades(2)
            } else {
                me.filtrarUnidades(2)
            }
            me.popupAgregar = true
        },
        openConfirm(tr) {
            let me = this;
            me.id = tr.idvideo
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar?',
                accept: this.eliminarLink
            })
        },
        eliminarLink() {
            let me = this
            me.$vs.loading()
            this.$http.delete(this.$server_url + 'videos/' + me.id)
                .then(res => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se elimino correctamente el video',
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
        //filtro para filtrar unidad por libro
        filtrarUnidades(tipo) {
            let me = this;
            if (tipo == 1) {
                me.video.unidad = ''
                me.video.tema = ''
            }
            const formData = new FormData();
            if (me.video.asignatura == undefined || me.video.asignatura == null || me.video.asignatura == "") {
                me.$vs.notify({
                    text: 'Seleccione una asignatura antes de filtrar por unidades',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.arregloTraeUnidades2 = [];
            me.$vs.loading()
            this.$http.get(this.$server_url + 'traerunidades?asignatura_id=' + me.video.asignatura + '&byasignaturas=yes')
                .then(res => {
                    me.arregloTraeUnidades2 = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        limpiar() {
            let me = this;
            me.generar = false
            me.id = 0
            me.video.nombre = ''
            me.video.descripcion = ''
            me.video.tema = ''
            me.video.asignatura = ''
            me.video.link = ''
        },
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['Asignatura', 'Unidad', 'Tema', 'Nombre video', 'Descripcion', 'link'];
            let headerVal = ['nombreasignatura', 'unidad', 'tema', 'nombrevideo', 'descripcionvideo', 'webvideo'];
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
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getLinks()
        me.getAsignaturas()
    },
    components: {
        'v-select': vSelect,
        TransferenciaVideos,
    },
}
</script>

<style>
#botonreporte {
    display: none;
}

#botonexcel {
    display: none;
    margin: 0 10px;
}

.video-container {
    position: relative;
    width: 100%;
    height: 100vh; /* Ocupa toda la altura de la ventana */
    overflow: hidden;
}

.youtube-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

/* Relación de aspecto 16:9 responsiva */
.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}
</style>
