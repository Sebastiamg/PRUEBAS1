<template>
<div class="vx-col md:w-full w-full mb-base h-screen">
    <vx-card class="h-full">
        <div class="vx-row mt-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="documento.nombre" maxlength="100" placeholder="Nombre del documento" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="documento.descripcion" maxlength="100" placeholder="Descripción del documento" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Asignaturas: </div>
                <v-select multiple class="w-full" v-model="asignatura" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Estado: </div>
                <vs-switch v-model="documento.status"></vs-switch>
            </div>
        </div>
        <div class="vx-col w-full h-64 borde-unidad">
            <FilePond class="h-64" label-idle="Suelta los archivos aquí..." max-files="4" v-bind:allow-multiple="true" :chunkUploads="false" :chunkForce="false" :onprocessfilestart="onprocessfilestart" chunkRetryDelays="[100,100,100]" chunkSize="100" @onUpdateFiles="onUpdateFiles" @progressfiles="resp" :server="$data_url+'api/uploadDocuemntos'" @init="handleFilePondInit" :storeAsFile="true" :onprocessfile="onprocessfile" />
        </div>
        <vs-button class="mt-12" color="success" @click="agregarDocumento()">Guardar</vs-button>
    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);
export default {
    components: {
        FilePond,
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
    data() {
        return {
            myFiles: [],
            formData: {
                company: null
            },
            asignatura:[],
            long_name_file: 25, //longitud del nombre de archivo a mostrar
            limiteMegas: 5, //maximo de megas permitido a subir en cada archivo
            bytes: 1048576,
            msjError: 'El peso del archivo excede el limite permitido, verifique antes de continuar',
            tipo_archivo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword',
            porcentaje: '',
            pesoArchivo: '',
            muyPesado: '',
            file: '',
            msj: '',
            documento: {
                'nombre': '',
                'descripcion': '',
                'asignaturas': [],
                'status': false,
            },
            archivos: [],
            usuario: [],
            asignaturas: [],
            grupo_usuario: '',
            miusuario: '',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario
        me.grupo_usuario = me.miusuario.id_group;
        this.getAsignaturas()
    },
    methods: {
        onprocessfile(error, file) {
            this.myFiles.push(JSON.parse(file.serverId))
            console.log(this.myFiles)
        },
        onprocessfilestart(file) {
            console.log("upload");
            this.disable = true
            this.isActive = true
        },
        onUpdateFiles(file) {
            this.formData.image = file;
        },
        handleFilePondInit: function () {
            console.log("FilePond has initialized");
        },
        resp(r) {
            console.log(r)
            console.log("hi")
        },
        getAsignaturas(){
            let me = this
            this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                me.asignaturas = res.data;
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        cargaArchivo() {
            let me = this;
            me.msj = '';
            me.porcentaje = 0;
            me.pesoArchivo = 0;
            me.muyPesado = false;
            me.file = me.$refs.file.files[0];
            me.pesoArchivo = (me.file.size / me.bytes).toFixed(2);
            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
                me.msj = me.msjError;
            }
        },
        agregarDocumento() {
            let me = this;
            me.$vs.loading();
            this.documento.files = this.myFiles
            this.documento.asignaturas = this.asignatura
            this.$http.post(this.$server_url + 'document', this.documento)
                .then(function (response) {
                    console.log(response.data)
                    me.$vs.loading.close()
                    let id_created = response.data.id 
                    let tipo = "Documento Ministerial"
                    let descripcion = me.documento.nombre +' creado'
                    me.saveNotifications(me.usuario.idusuario,id_created,tipo,descripcion)
                    me.$router.push('/admin/documentosAdmin');
                })
                .catch(function (error) {
                    me.$vs.loading.close()

                })

        },
        openConfirmEliminar(item) {
            let me = this;
            console.log(item)
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este archivo?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarAdaptacion
            })
        },
        voler() {
            let me = this;
            me.$router.go(-1);
        }
    }
}
</script>

<style>
/* input[type="file"] {
    display: none;
} */

.text-danger {
    font-size: 11px;
}

.borde-unidad {
    border: 1px dashed rgb(32, 32, 32);
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
</style>
