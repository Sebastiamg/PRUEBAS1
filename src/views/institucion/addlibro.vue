<template>
<vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <!-- <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4> -->
        <h4>Agregar libro gratis</h4>
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :key="$vs.rtl">
        <div class="p-6">
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Libros</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :options="unidad" :reduce="unidad => unidad.id" label="nombre" v-model="contenido.unidad" @input="tems"></v-select>
                    <span class="text-danger text-sm" v-show="errors.unidad">{{ errors.unidad }}</span>
                </div>
            </div>            
        </div>
    </component>

    <div class="p-2 text-center" slot="footer">
        <div class="flex flex-wrap mt-4">
            <div class="w-1/3 ml-auto">
                <vs-button color="danger" type="relief" class="mb-2" @click.stop="isSidebarActiveLocal = false" icon-pack="feather" icon="icon-close">Cancelar</vs-button>
            </div>
            <div class="w-1/3 ml-auto">
                <vs-button :disabled='setButton' color="success" @click="guardarContenido" type="relief" icon-pack="feather" icon="icon-save">Guardar</vs-button>
            </div>
        </div>
    </div>
</vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import axios from "axios";
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        'v-select': vSelect,
        VuePerfectScrollbar,
        vueDropzone: vue2Dropzone,
    },
    data() {
        return {
            asigTemas: [],
            file: [],
            dropzoneOptions: {
                url: this.$data_url+'api/setContenido',
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> Click o arrastra un archivo aquí.",
                chunking: true,
                thumbnailWidth: 150,
                maxFilesize: 200.5,
                addRemoveLinks: true,
                headers: {
                    "My-Awesome-Header": "header value"
                }
            },
            temas: [],
            unidad: [{
                    id: 1,
                    nombre: 'Unidad 1'
                },
                {
                    id: 2,
                    nombre: 'Unidad 2'
                },
                {
                    id: 3,
                    nombre: 'Unidad 3'
                },
                {
                    id: 4,
                    nombre: 'Unidad 4'
                },
                {
                    id: 5,
                    nombre: 'Unidad 5'
                },
                {
                    id: 6,
                    nombre: 'Unidad 6'
                },
                {
                    id: 7,
                    nombre: 'Unidad 7'
                },
                {
                    id: 8,
                    nombre: 'Unidad 8'
                },
            ],
            asignaturas: [],
            errors: [],
            contenido: {},
            setButton: true,
            arch: {}
        }
    },
    mounted() {
        this.getasignaturas();
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
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar')
                }
            }
        },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        }
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
            this.arch = {}
        },
        async guardar(file) {
            let me = this
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('archivo', file);
            axios.post(this.$data_url+'api/setContenido', formData, this.onUploadProgress)
                .then(function (response) {
                    me.arch = response.data;
                    me.$refs.dropzone.removeAllFiles();
                    me.$vs.loading.close();
                    me.setButton = false;
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        async guardarContenido() {
            let me = this;
            let formData = new FormData();
            formData.append('idcontenido', me.arch.idcontenido);
            formData.append('nombre', me.arch.nombre);
            formData.append('idasignatura', me.contenido.idasignatura);
            formData.append('unidad', me.contenido.unidad);
            formData.append('temas', JSON.stringify(me.asigTemas));
            this.$http.post(this.$server_url+'contenido', formData)
                .then(function (res) {
                    me.arch = {}
                    me.contenido={}
                    me.asigTemas={}
                    me.isSidebarActiveLocal = false
                })
                .catch(function (error) {

                })
        },
        tems() {
            let me = this;
            this.$http.get(this.$server_url+"temas?unidad=" + me.contenido.unidad + "&asignatura=" + me.contenido.idasignatura)
                .then(function (response) {
                    me.temas = response.data
                    console.log(response.data)
                })
                .catch(function (error) {})
        },
        getTemas(unidad, asignatura) {
            let me = this;
            this.$http.get(this.$server_url+"temas?unidad=" + unidad + "&asignatura=" + asignatura)
                .then(function (response) {
                    me.temas = response.data
                    console.log(response.data)
                })
                .catch(function (error) {})
        },
        getContenido() {
            let me = this;
            this.$http.get(this.$server_url+"contenido")
                .then(function (response) {
                    me.contenidos = response.data.items
                })
                .catch(function (error) {})
        },
        getasignaturas() {
            let me = this;
            var url = this.$server_url+"asignaturas";
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.asignaturas = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
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
