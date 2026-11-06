<template>
<div class="vx-col md:w-full w-full mb-base h-screen">
    <vx-card class="h-full">
        <div class="vx-row mt-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="documento.nombre" @input="agregarDocumento()" maxlength="100" placeholder="Nombre del documento" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="documento.descripcion" @input="agregarDocumento()" maxlength="100" placeholder="Descripción del documento" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Asignaturas: </div>
                <v-select multiple class="w-full" v-model="asignatura" :options="asignaturas" @input="agregarDocumento()"/>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Estado: </div>
                <vs-switch v-model="documento.status" @input="agregarDocumento()"></vs-switch>
            </div>
        </div>
        <vs-divider>Archivos cargados</vs-divider>
        <vs-button @click="estado = !estado">Agregar archivo</vs-button>
        <div v-if="estado == true" class="vx-col w-full h-64 borde-unidad">
            <FilePond class="h-64" label-idle="Suelta los archivos aquí..." max-files="4" v-bind:allow-multiple="true" :chunkUploads="false" :chunkForce="false" :onprocessfilestart="onprocessfilestart" chunkRetryDelays="[100,100,100]" chunkSize="100" @onUpdateFiles="onUpdateFiles" @progressfiles="resp" :server="$data_url+'api/uploadDocuemntos?id='+documento.id" @init="handleFilePondInit" :storeAsFile="true" :onprocessfile="onprocessfile" />
        </div>
        <div class="vx-col  w-full">
            <vs-table max-items="10" search pagination :data="documentos" style="margin-top:-20px" class="stripe">
                <template slot="thead">
                    <vs-th>Nombre</vs-th>
                    <vs-th>url</vs-th>
                    <vs-th>Fecha de creación</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombre}} <br>
                        </vs-td>
                        <vs-td class="text-center">
                            <vx-tooltip text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" :href="'https://data.prolipadigital.com.ec/documentos/'+data[indextr].url" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(data[indextr].url)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                            <!-- <a :href="'https://data.prolipadigital.com.ec/documentos/'+data[indextr].url" download>Descargar</a> -->
                        </vs-td>
                        <vs-td>
                            {{data[indextr].updated_at}} <br>
                        </vs-td>
                        <vs-td>
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2" color="danger" @click="openConfirm(data[indextr].id,data[indextr].nombre)"></vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vx-card>
</div>
</template>

<script>
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
    data() {
        return {
            estado: false,
            documento: {},
            asignatura: {},
            documentos: [],
            asignaturas: [],
            usuario: [],
            id: ''
        }
    },
    created() {
        this.documento = JSON.parse(localStorage.getItem('doc'))
        this.asignatura = this.documento.asignaturas
    },
    mounted() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log(this.documento.nombre)
        this.getAsignaturas()
        this.getDocumento()
    },
    methods: {
        onprocessfile(error, file) {
            this.getDocumento()
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
        getAsignaturas() {
            let me = this
            this.$http.get(this.$server_url + 'asignaturasDoc/' + me.usuario.idusuario).then(res => {
                    me.asignaturas = res.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getDocumento() {
            let me = this;
            this.$vs.loading()
            this.$http.get(this.$server_url + 'document?id=' + this.documento.id)
                .then(res => {
                    me.documentos = res.data
                    console.log(res.data)
                    me.$vs.loading.close()

                })
                .catch(error => {
                    console.log('no se conecto a los documentos ministeriales ' + error)
                    me.$vs.loading.close()
                })
        },
        descargaArchivo(item) {
            axios({
                url: 'https://data.prolipadigital.com.ec/documentos/' + item, //your url
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', item); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
        },
        mostrarArchivo(item) {
            window.open('https://view.officeapps.live.com/op/embed.aspx?src=https://data.prolipadigital.com.ec/documentos/' + item)
        },
        agregarDocumento() {
            let me = this;
            this.documento.asignaturas = this.asignatura
            this.$http.post(this.$server_url + 'document?id=' + this.documento.id, this.documento)
                .then(function (response) {})
                .catch(function (error) {})
        },
        openConfirm(id, nombre) {
            let me = this;
            me.id = id

            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: 'Está seguro en eliminar este archivo',
                accept: this.getEliminar
            })
        },
        getEliminar(id) {
            let me = this;
            console.log(id)
            this.$http.post(this.$server_url + "archivoDelete?id=" + me.id)

                .then(function (response) {
                    me.$vs.notify({
                        color: 'warning',
                        text: 'Registro eliminado'
                    })
                    me.getDocumento()
                })
                .catch(function (error) {})
        }
    },
}
</script>
