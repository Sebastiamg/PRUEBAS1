<template>
<div>
    <div class="m-4 w-full">
        <template v-if="!arch.nombre">
            <vue-dropzone class="vx-card" ref="dropzone" id="drop1" @vdropzone-complete="guardar" :options="dropzoneOptions"></vue-dropzone>
        </template>
        <img v-if="arch.nombre" :src="get_ext_img(arch.file_ext)" :alt="arch.nombre" style="witch:70px" class="mt-4">
        <p>
            {{arch.nombre}}
        </p>
        <vs-button v-if="arch.nombre" @click="quitarArchivo()" size="small">Cambiar archivo</vs-button>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    components: {
        vueDropzone: vue2Dropzone,
    },
    props:{
        id:Number,
        name:String,
    },
    data() {
        return {
            file: [],
            dropzoneOptions: {
                url: this.$data_url + 'api/setContenido',
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> Click o arrastra un archivo aquí.",
                chunking: true,
                thumbnailWidth: 150,
                maxFilesize: 200.5,
                addRemoveLinks: true,
                headers: {
                    "My-Awesome-Header": "header value"
                },
                init: function() {
                    this.on("success", function(file, responseText) {
                        localStorage.setItem('imagenContenido',responseText.url)
                    });
                },
            },
            errors: [],
            arch: {},
            idplanificacion:'',
            usuario:[],
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        if(this.name){
            console.log(this.name)
            this.arch.nombre = this.name
            this.arch.file_ext = '.doc'
        }
        if(this.id){
            console.log(this.id)
            this.idplanificacion = this.id
        }
    },
    computed: {
        get_ext_img() {
            return (ext) => {
                if (ext === 'doc') return require('@/assets/images/file-icons/doc.png')
                else if (ext === 'jpg') return require('@/assets/images/file-icons/jpg.png')
                else if (ext === 'xls') return require('@/assets/images/file-icons/xls.png')
                else if (ext === 'pdf') return require('@/assets/images/file-icons/pdf.png')
                else return require('@/assets/images/file-icons/doc.png')
            }
        },
    },
    methods: {
        successUpload() {
            this.$vs.notify({
                color: 'success',
                title: 'Upload Success',
                text: 'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        onUploadProgress: uploadEvent => {
            var pocentaje = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
            console.log(pocentaje)
        },
        async quitarArchivo() {
            let me = this;
            this.arch = {}
            me.eliminarArchivo()
        },

        async eliminarArchivo() {
            let me = this
            let formData = new FormData();
            formData.append('imagenContenido', localStorage.imagenContenido);
            formData.append('imagenPlanificacion', localStorage.imagenPlanificacion);
            formData.append('idplanificacion',localStorage.idplanificacion)
            axios.post(this.$data_url + 'api/eliminarPlanificacion', formData, this.onUploadProgress)
                .then(function (response) {
                   me.idplanificacion = ""
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },

        async guardar(file) {
            let me = this
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('usuario',me.usuario.idusuario)
            if(me.idplanificacion){
                formData.append('idplanificacion', me.idplanificacion);
            }
            axios.post(this.$data_url + 'api/setPlanificacion', formData, this.onUploadProgress)
                .then(function (response) {
                    me.arch = response.data;
                    localStorage.setItem('idplanificacion',response.data.idplanificacion)
                    localStorage.setItem('imagenPlanificacion',response.data.url)
                    localStorage.setItem('nombrePlanificacion',response.data.nombre)
                    me.idplanificacion = response.data.idplanificacion;
                    me.$refs.dropzone.removeAllFiles();
                    me.$vs.loading.close();
                    me.setButton = false;
                    me.$emit('file',response.data)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
    },
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
        z-index: 52010;
    }

    ::v-deep .vs-sidebar {
        z-index: 52010;
        width: 60%;
        max-width: 60%;

        .img-upload {
            margin-top: 2rem;

            .con-img-upload {
                padding: 0;
            }

            .con-input-upload {
                width: 100%;
                margin: 0;
            }
        }
    }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
        overflow-y: auto;
    }
}
</style>
