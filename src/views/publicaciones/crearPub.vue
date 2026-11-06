<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <div class="vx-row p-1">
            <!-- <div class="vx-col w-full mb-base">
                <h4>Nuevo artículo</h4>
            </div> -->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="nombre" maxlength="100"></vs-input>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="descripcion" maxlength="200"></vs-input>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div style="font-size: 12px; ">Área: </div>
                <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombre" :reduce="asignaturas => asignaturas" />
                <!-- {{asignaturaSelect}} -->
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div v-if="archivo" class="m-1">
                    <p><b>Archivo actual:</b></p>
                    <p>{{archivo.name}}</p>
                    <p>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(archivo)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip text="Eliminar" position="bottom" style="display: inline-block" color="danger">
                            <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border" @click="openConfirmEliminar(archivo); tipo='archivo'"></vs-button>
                        </vx-tooltip>
                    </p>
                </div>
                <div v-else>
                    <div style="font-size: 12px;">Archivo: </div>
                    <input v-if="porcentaje == 0" type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                    <div class="v-row text-left" v-if="porcentaje>0">
                        <vs-progress style="height:25px" :percent="porcentaje" color="success"> {{porcentaje}}% </vs-progress>
                    </div><br>
                    <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full  mb-base" align="left">
                <div v-if="portada" class="m-1">
                    <p><b>Portada actual:</b></p>
                    <p> mi portada {{portada.name}}</p>
                    <p>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(portada)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip text="Eliminar" position="bottom" style="display: inline-block" color="danger">
                            <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border" @click="openConfirmEliminar(portada); tipo='portada'"></vs-button>
                        </vx-tooltip>
                    </p>
                </div>
                <div v-else>
                    <div style="font-size: 12px;">Portada: </div>
                    <input v-if="porcentajep == 0" type="file" id="filep" ref="filep" accept="image/x-png,image/gif,image/jpeg" v-on:change="portadaUpload()" />
                    <div class="v-row text-left" v-if="porcentajep>0">
                        <vs-progress style="height:25px" :percent="porcentajep" color="success"> {{porcentajep}}% </vs-progress>
                    </div><br>
                    <small>Tamaño máximo: {{limitePortada}} mb.</small>

                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div style="font-size: 12px; ">Estado: </div>
                <vs-switch class="" vs-icon-on="check" color="success" v-model="estado" style="width: 100px;">
                    <span slot="on">Publicada</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div>
            <div class="vx-col w-full m-1">
                <vs-button v-if="!edita" style="display: inline" class="m-1" @click="subirArchivo()" size="medium" icon-pack="feather" icon="icon-save" color="success" type="gradient">Guardar</vs-button>
                <vs-button v-else style="display: inline" class="m-1" @click="subirArchivo()" size="medium" icon-pack="feather" icon="icon-save" color="success" type="gradient">Editar</vs-button>
                <vs-button style="display: inline" color="danger" type="border" icon-pack="feather" @click="volver()" icon="icon-arrow-left">Volver</vs-button>
            </div>
        </div>

    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            asignaturas: [{
                    'id': 1,
                    'nombre': 'Lengua'
                },
                {
                    'id': 2,
                    'nombre': 'Matemática'
                },
                {
                    'id': 3,
                    'nombre': 'Ciencias Naturales'
                },
                {
                    'id': 4,
                    'nombre': 'Ciencias Sociales'
                },
                {
                    'id': 5,
                    'nombre': 'Enseñanza educación'
                }
            ],
            asignaturaSelect: {
                'id': '',
                'nombre': ''
            },
            archivo: '',
            portada: '',
            porcentaje: 0,
            id_pub: '',
            nombre: '',
            descripcion: '',
            estado: true,
            edita: '',
            datosEditar: '',
            porcentajep: 0,
            limiteMegas: 10, //permitir maximo de megas
            limitePortada: 0.7, //permitir maximo de megas en la portada
            bytes: 1048576, //para calculo de megas
            pesoArchivo: 0,
            muyPesado: false,
            pesoArchivop: 0,
            muyPesadop: false,
            idusuario: '',
            filep: '',
            id_eliminar: '',
            tipo: '',

        }
    },
    mounted() {
        this.edita = localStorage.getItem('edita'); //edicion del webquest
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.idusuario = this.usuario.idusuario
        if (this.edita) {
            this.datosEditar = JSON.parse(localStorage.getItem('publicacion'));
            // console.log(this.datosEditar)
            this.pasarDatos();
        }
        // this.getAsignaturas();
    },
    methods: {
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url+'asignaturasActi')
                .then(res => {
                    me.asignaturas = res.data
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleFileUpload() {
            this.porcentaje = 0;
            this.pesoArchivo = 0;
            this.muyPesado = false;
            this.file = this.$refs.file.files[0];
            // verificar tamaño de archivo
            // console.log(this.file)
            this.pesoArchivo = (this.file.size / this.bytes).toFixed(2);
            if (this.pesoArchivo > this.limiteMegas) {
                this.muyPesado = true;
            }
        },
        portadaUpload() {
            this.porcentajep = 0;
            this.pesoArchivop = 0;
            this.muyPesadop = false;
            this.filep = this.$refs.filep.files[0];
            // verificar tamaño de archivo
            // console.log(this.filep)
            this.pesoArchivop = (this.filep.size / this.bytes).toFixed(2);
            if (this.pesoArchivop > this.limitePortada) {
                this.muyPesadop = true;
            }
        },
        subirArchivo() {
            let me = this;
            me.okArchivo = false;
            me.okPortada = false;
            if (me.nombre == "") {
                me.valor = 0;
                me.$vs.notify({
                    text: 'Ingrese un nombre para la publicación ',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.$vs.loading.close()
                return
            }

            if (me.asignaturaSelect.nombre == "") {
                me.valor = 0;
                me.$vs.notify({
                    text: 'Seleccione el área para esta publicación',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.$vs.loading.close()
                return
            }
            if (me.muyPesado) {
                me.$vs.notify({
                    text: 'El archivo que intenta cargar excede el peso permitido, favor verifique para continuar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.muyPesadop) {
                me.$vs.notify({
                    text: 'La portada es muy grande para mostrar, favor verifique para continuar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            let formData = new FormData();
            formData.append('files', me.file);
            axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                    onUploadProgress: uploadEvent => {
                        if (me.pesoArchivo > 0) {
                            me.porcentaje = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                        }
                    }
                })
                .then(function (response) {
                    me.archivo = response.data[0]
                    // console.log(me.archivo)
                    me.$vs.notify({
                        text: 'Archivo cargado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.subirPortada();
                    me.$vs.loading.close()
                })
                .catch(error => {
                    if (!me.archivo) {
                        me.archivo = '';
                    }
                    me.subirPortada();
                    me.$vs.loading.close()
                })
        },
        subirPortada() {
            let me = this;
            let formData1 = new FormData();
            formData1.append('files', me.filep);
            axios.post("https://foro.prolipadigital.com.ec/upload", formData1, {
                    onUploadProgress: uploadEvent => {
                        if (me.pesoArchivop > 0) {
                            me.porcentajep = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                        }
                    }
                })
                .then(function (res) {
                    me.portada = res.data[0]
                    me.$vs.notify({
                        text: 'Portada cargado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.guardaEdita();
                    me.$vs.loading.close()
                })
                .catch(error => {
                    if (!me.portada) {
                        me.portada = '';
                    }
                    me.guardaEdita();
                    me.$vs.loading.close()
                })
        },
        guardaEdita() {
            let me = this;
            // console.log(me.portada)
            if (me.edita) {
                me.editarPublicacion();
            }
            if (!me.edita) {
                me.registrarPublicacion();
            }
        },
        registrarPublicacion() {
            let me = this;
            axios.post('https://foro.prolipadigital.com.ec/publicaciones', {
                    nombre: me.nombre,
                    descripcion: me.descripcion,
                    archivo: me.archivo.id,
                    portada: me.portada.id,
                    idusuario: me.idusuario,
                    asignatura: me.asignaturaSelect,
                    estado: me.estado,
                })
                .then(res => {
                    me.$vs.notify({
                        text: 'Publicación guardado correctamente ',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.volver();

                })
                .catch(error => {
                    me.$vs.notify({
                        text: 'Error al guardar la publicación, intente mas tarde por favor. ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
        },
        editarPublicacion() {
            let me = this;
            axios.put('https://foro.prolipadigital.com.ec/publicaciones/' + me.id_pub, {
                    nombre: me.nombre,
                    descripcion: me.descripcion,
                    archivo: me.archivo.id,
                    portada: me.portada.id,
                    idusuario: me.idusuario,
                    asignatura: me.asignaturaSelect,
                    estado: me.estado,
                })
                .then(res => {
                    me.$vs.notify({
                        text: 'Publicación editada correctamente ',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.volver();
                })
                .catch(error => {
                    me.$vs.notify({
                        text: 'Error al editar la publicación, intente más tarde por favor ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
        },
        pasarDatos() {
            let me = this;
            me.id_pub = me.datosEditar.id
            me.nombre = me.datosEditar.nombre
            me.descripcion = me.datosEditar.descripcion
            me.asignaturaSelect = me.datosEditar.asignatura
            me.archivo = me.datosEditar.archivo[0]
            me.portada = me.datosEditar.portada
            me.estado = me.datosEditar.estado
        },
        volver() {
            let me = this;
            if (me.edita) {
                localStorage.removeItem('publicacion')
                localStorage.removeItem('edita')
            }
            me.id_pub = ''
            me.nombre = ''
            me.descripcion = ''
            me.asignaturaSelect = ''
            me.archivo = ''
            me.portada = ''
            me.estado = ''
            this.$router.go(-1);
        },
        descargaArchivo(item) {
            console.log(item)
            return
            axios({
                    url: 'https://foro.prolipadigital.com.ec' + item.url,
                    method: 'GET',
                    responseType: 'blob',
                })
                .then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', item.name + item.ext);
                    document.body.appendChild(fileLink);

                    fileLink.click();
                    this.$vs.notify({
                        text: 'El archivo se esta descargando',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(error => {
                    this.$vs.notify({
                        text: 'Error en la descarga del archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        openConfirmEliminar(item) {
            let me = this;
            // me.archivo = item
            me.id_eliminar = item.id
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este archivo?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarArchivo
            })
        },
        eliminarArchivo() {
            let me = this;
            // console.log(me.tipo)
            me.$vs.loading()
            axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.id_eliminar)
                .then(function (res) {
                    me.$vs.notify({
                        text: 'Archivo eliminado correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.porcentaje = 0;
                    me.tipo == 'portada' ? me.portada = '' : me.archivo = '';
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'No se eliminó el archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
        },
    }
}
</script>
