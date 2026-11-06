<template>
<div>
    <!-- Imagen actual -->
    <span style="font-size: 12px;"><b>Tamaño máximo del archivo:</b> {{ configuracionarchivossubir.tamano_max_mb }}MB</span>
    <br>
    <span style="font-size: 12px;"><b>Tipos de archivos admitidos:</b> {{ ArchivosPermitidos }}</span>
    <div class="flex justify-center" v-if="localEgfId !== 0">
        <table>
            <tr v-for="(item, index) in ValoresImagenMostrar" :key="index">
                <td>
                    <table>
                        <tr>
                            <td align="center">
                                <a v-if="item.url && !item.archivoNoExiste" :href="item.url" target="_blank" download :title="'Descargar ' + item.egf_archivo">
                                    <vs-button radius type="line" class="ml-2 mt-4" color="primary">Descargar</vs-button>
                                </a>
                                <br>
                                <img v-if="item.tipo === 'img'" :src="item.img" class="img-responsive rounded" style="margin: 0 auto; width: 300px;" />
                                <img v-if="item.tipo !== 'img'" :src="item.img" class="img-responsive rounded" style="margin: 0 auto; height: 100px;" />
                            </td>
                        </tr>
                        <tr>
                            <td v-if="!item.archivoNoExiste">
                                <b>Nombre archivo:</b> {{ item.egf_archivo || 'No se encontró archivo' }}
                                <br>
                                <b>Tamaño:</b> {{ item.egf_tamano }} MB
                            </td>
                            <td v-else width="250" align="center">
                                <span><b>El archivo no se encontro o esta incompleto, elimine la evidencia actual y vuelva a subir el archivo nuevamente.</b></span>
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                    <vs-tooltip text="Eliminar evidencia" position="right">
                        <template>‎</template>
                        <vs-button style="display: inline;" radius type="line" class="ml-2 mt-4" color="danger" icon="delete" @click="removeImage">
                        </vs-button>
                    </vs-tooltip>
                </td>
            </tr>
        </table>
    </div>
    <!-- Si localEgfId es 0, muestra el input de carga de archivo -->
    <table v-else>
        <tr>
            <td>
                <div v-if="attachmentArray.length === 0">
                    <div class="box upload-container" v-if="!ifSaveImagen" style="padding: 10px;">
                        <input type="file" name="fileGlobal" id="fileGlobal" @change="uploadFiles" :accept="computedAccept" />
                    </div>
                    <!-- Imagen base -->
                    <div class="flex justify-center" v-else>
                        <div class="flex">
                            <img id="img1" class="img-responsive rounded" style="margin: 0 auto;">
                            <small class="mt-1">{{ archivoIdSubido }}</small>
                        </div>
                        <vs-button radius type="line" class="ml-2 mt-4" color="danger" icon="delete" @click="ifSaveImagen = false">
                        </vs-button>
                    </div>
                </div>

                <!-- Archivos locales -->
                <div v-if="attachmentArray.length > 0">
                    <div v-for="(tr, key) in attachmentArray" :key="key">
                        <div align="center">
                            <table align="center">
                                <tr>
                                    <td>
                                        <table>
                                            <tr>
                                                <td align="center">
                                                    <!-- Botón de descarga para imágenes, PDF y otros archivos -->
                                                    <a v-if="tr.tipo === 'img' || tr.tipo === 'pdf'" :href="tr.url" download :title="'Descargar ' + tr.name">
                                                        <vs-button radius type="line" class="ml-2 mt-4" color="primary">Descargar</vs-button>
                                                    </a>
                                                    <a v-if="tr.tipo === 'word' || tr.tipo === 'other'" :href="tr.url" download :title="'Descargar ' + tr.name">
                                                        <vs-button radius type="line" class="ml-2 mt-4" color="primary">Descargar Archivo</vs-button>
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <!-- Si es una imagen, mostrar la imagen cargada -->
                                                    <img v-if="tr.tipo === 'img'" :src="tr.img" class="img-responsive rounded" style="width: 300px;" />
                                                    <!-- Si es un PDF, mostrar el icono o una vista previa de PDF -->
                                                    <img v-if="tr.tipo === 'pdf'" :src="tr.img" class="img-responsive rounded" />
                                                    <!-- Si es un archivo Word o otro archivo, mostrar el icono y el botón de descarga -->
                                                    <img v-if="tr.tipo === 'word' || tr.tipo === 'other'" :src="tr.img" class="img-responsive rounded" style="height: 98px;" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <b>Nombre archivo: </b><small class="mt-1">{{ tr.name }}</small>
                                                    <!-- Mostrar el tamaño del archivo debajo del nombre -->
                                                    <br>
                                                    <b>Tamaño: </b><small class="mt-1" v-if="tr.size">{{ tr.size }} MB</small>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td>
                                        <vs-tooltip text="Eliminar evidencia" position="right">
                                            <template>‎</template>
                                            <vs-button style="display: inline;" radius type="line" class="ml-2 mt-4" color="danger" icon="delete" @click="removeItemFromArr(attachmentArray, tr)">
                                            </vs-button>
                                        </vs-tooltip>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>
</template>

<script>
import vSelect from 'vue-select'
import axios from 'axios'
export default {
    props: {
        usuario: {
            type: Object,
            default: function () {
                return {}
            }
        },
        configuracionarchivossubir: {
            type: Object,
            required: true,
            default: function () {
                return {}
            }
        },
        // Recibir desde el componente padre algun valor o '0' si no se recibe nada
        egf_id: {
            type: Number,
            default: 0, // Define 0 como valor predeterminado
        },
    },
    components: {
        vSelect,
    },
    data() {
        return {
            //VARIABLES IMAGEN
            attachmentArray: [],
            tipoFile: '',
            ifSaveImagen: false,
            archivoIdSubido: '',
            ifImagenBd: false,
            ValoresImagenMostrar: [],
            localEgfId: this.egf_id,
            ArchivosPermitidos: [],
            //FIN VARIABLES IMAGEN
        }
    },
    mounted() {
        let me = this;
        me.attachmentArray = []
        me.archivoIdSubido = me.egf_id;
        console.log(me.archivoIdSubido, "oliuu");
        if (me.archivoIdSubido != 0) {
            me.mostrarimagen()
        }
        me.archivosAdmitidos();
    },
    created() {
        let me = this;

    },
    computed: {
        computedAccept() {
            const acceptArray = [];
            if (this.configuracionarchivossubir.imagenes == 1) acceptArray.push("image/*");
            if (this.configuracionarchivossubir.documentos_pdf == 1) acceptArray.push("application/pdf");
            if (this.configuracionarchivossubir.documentos_word == 1) acceptArray.push(".doc,.docx");
            // Otros archivos no tienen extensión específica
            return acceptArray.join(",");
        },
    },
    methods: {
        getFileType(filename) {
            const extension = filename.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'img';
            if (['pdf'].includes(extension)) return 'pdf';
            if (['doc', 'docx'].includes(extension)) return 'word';
            return 'other';
        },
        removeItemFromArr(arr, item) {
            let me = this;
            me.$vs.loading();
            setTimeout(() => {
                try {
                    me.attachmentArray = [];
                    const i = arr.indexOf(item);
                    arr.splice(i, 1);
                    me.cierredeloading();
                } catch (error) {
                    console.log(error);
                }
            }, 1000);
        },
        removeImage() {
            let me = this;
            me.$vs.loading();
            setTimeout(() => {
                try {
                    me.attachmentArray = [];
                    this.localEgfId = 0; // Resetear localEgfId, no afectará a la prop egf_id
                    this.ValoresImagenMostrar = []; // Limpiar datos de la imagen
                    me.cierredeloading();
                } catch (error) {
                    console.log(error);
                }
            }, 1000);
        },
        cierredeloading() {
            let me = this;
            this.$nextTick(() => {
                this.$emit('change', {
                    datosobtenidosimagen: me.attachmentArray || [],
                    datosFileGuardar: '',
                    configuracioncabecera: '',
                });
            });
        },
        archivosAdmitidos() {
            const allowedExtensions = [];
            if (this.configuracionarchivossubir.imagenes == 1) allowedExtensions.push(".jpg, .jpeg, .png, .gif");
            if (this.configuracionarchivossubir.documentos_pdf == 1) allowedExtensions.push(".pdf");
            if (this.configuracionarchivossubir.documentos_word == 1) allowedExtensions.push(".doc, .docx");
            this.ArchivosPermitidos= allowedExtensions;
        },
        uploadFiles() {
            let me = this;
            me.attachmentArray = []; // Reinicia el array de archivos
            const archivo = document.getElementById("fileGlobal").files[0];
            if (!archivo) return; // Si no se ha seleccionado un archivo, no continuar

            // Validar tamaño máximo del archivo
            const maxSizeInMB = this.configuracionarchivossubir.tamano_max_mb; // Tamaño máximo en MB
            const fileSizeInMB = archivo.size / (1024 * 1024); // Convierte el tamaño de bytes a MB
            if (fileSizeInMB > maxSizeInMB) {
                this.$vs.notify({
                    title: "Tamaño de archivo excedido",
                    text: `El archivo seleccionado excede el tamaño máximo permitido de ${maxSizeInMB} MB. El tamaño del archivo es ${fileSizeInMB.toFixed(2)} MB.`,
                    color: "warning",
                    time: 7000,
                });
                document.getElementById("fileGlobal").value = ''; // Limpia el input
                me.$vs.loading.close();
                return;
            }

            // Inicialización de variables de tipo de archivo
            const isImage = archivo.type.startsWith("image/") && this.configuracionarchivossubir.imagenes == 1;
            const isPDF = archivo.type == "application/pdf" && this.configuracionarchivossubir.documentos_pdf == 1;
            const isWord =
                (archivo.type == "application/msword" || archivo.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                this.configuracionarchivossubir.documentos_word == 1;
            const isOther = !isImage && !isPDF && !isWord && this.configuracionarchivossubir.otros === 1;

            // Generar lista de extensiones permitidas dinámicamente
            const allowedExtensions = [];
            if (this.configuracionarchivossubir.imagenes == 1) allowedExtensions.push(".jpg, .jpeg, .png, .gif");
            if (this.configuracionarchivossubir.documentos_pdf == 1) allowedExtensions.push(".pdf");
            if (this.configuracionarchivossubir.documentos_word == 1) allowedExtensions.push(".doc, .docx");

            // Validar si el archivo es permitido
            if (!isImage && !isPDF && !isWord && !isOther) {
                this.$vs.notify({
                    title: "Archivo no permitido",
                    text: `Este tipo de archivo no está permitido subir. Solo puede seleccionar archivos con las extensiones: ${allowedExtensions.join(", ")}.`,
                    color: "warning",
                    time: 7000,
                });
                document.getElementById("fileGlobal").value = ''; // Limpia el input
                me.$vs.loading.close(); // Cierra el loading si el archivo no es válido
                return;
            }

            me.$vs.loading(); // Inicia el loading mientras se procesa el archivo

            const reader = new FileReader();

            // Procesar archivo cuando se haya cargado
            reader.onloadend = function () {
                const fileSizeInMB = (archivo.size / (1024 * 1024)).toFixed(2); // Tamaño en KB

                const fileData = {
                    file: archivo,
                    img: reader.result.split(',')[1], // Aquí se asignará el icono según el tipo de archivo
                    name: archivo.name.replace(/\s+/g, '_'), // Reemplazar espacios con guiones bajos
                    size: fileSizeInMB, // Tamaño del archivo en KB
                };

                // Asignar icono y URL de descarga según el tipo de archivo
                if (isImage) {
                    fileData.img = reader.result; // Si es imagen, asignamos el resultado de la lectura como imagen
                    fileData.tipo = "img";
                } else if (isPDF) {
                    fileData.img = require('@/assets/images/file-icons/pdf.png'); // Icono para PDF
                    fileData.tipo = "pdf";
                } else if (isWord) {
                    fileData.img = require('@/assets/images/file-icons/doc.png'); // Icono para Word (solo para .doc, .docx)
                    fileData.tipo = "word";
                } else if (isOther) {
                    fileData.img = require('@/assets/images/file-icons/file.png'); // Icono para archivos desconocidos
                    fileData.tipo = "other";
                }

                // Crear URL de descarga
                fileData.url = URL.createObjectURL(archivo); // Genera una URL de descarga para el archivo cargado

                // Agregar el archivo al array de archivos
                me.attachmentArray.push(fileData);
                console.log(me.attachmentArray, "attachmentArray");

                // Después de cargar el archivo y procesarlo, ejecutar saveEvidencia
                setTimeout(() => {
                    me.saveEvidencia(); // Llama al método saveEvidencia después de 2 segundos
                }, 2000);
            };

            reader.readAsDataURL(archivo); // Leer el archivo
        },
        saveEvidencia() {
            let me = this
            //files
            let imgsEnviar = [];
            let formData = new FormData();
            if (me.ifSaveImagen || me.attachmentArray.length == 0) {
                formData.append('noSendFiles', 'yes')
                this.$emit('f_creado', 1);
                return
            } else {
                me.attachmentArray.forEach(element => {
                    imgsEnviar.push(element.file)
                });
                imgsEnviar.forEach((file, index) => {
                    formData.append('archivos[]', file);
                });
            }
            const datosParaGuardar = {
                // id: getId,
                saveArchivos_new: 'yes',
                archivoIdSubido: me.archivoIdSubido,
                archivos: imgsEnviar // Asignar directamente el array
            };
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            this.$nextTick(() => {
                this.$emit('change', {
                    datosobtenidosimagen: me.attachmentArray || [],
                    datosFileGuardar: datosParaGuardar,
                    configuracioncabecera: config
                });
            });
        },
        mostrarimagen() {
            let me = this;
            me.$http.get(me.$server_url + 'GetEvidenciasGlobalxID', {
                    params: {
                        egf_id: me.archivoIdSubido,
                    }
                })
                .then(res => {
                    me.ValoresImagenMostrar = res.data;

                    if (this.localEgfId !== 0 && me.ValoresImagenMostrar.length > 0) {
                        me.ValoresImagenMostrar.forEach(item => {
                            if (!item.egf_url) {
                                console.warn('El egf_url es null para el elemento:', item);

                                me.attachmentArray = [];
                                this.localEgfId = 0;
                                me.ValoresImagenMostrar = [];
                            } else {
                                const fileType = this.getFileType(item.egf_archivo);
                                item.tipo = fileType;
                                item.archivoNoExiste = false; // Agregamos esta propiedad por defecto

                                item.url = `${this.$data_url}archivos/evidenciaglobal/${item.egft_nombre}/${item.egf_url}`;

                                me.$http.get(me.$data_url + 'api/verificarArchivo', {
                                        params: {
                                            Tipo: item.egft_nombre,
                                            nombreArchivo: item.egf_url,
                                        }
                                    })
                                    .then(response => {
                                        if (!response.data.existe) {
                                            console.warn('El archivo no existe en el servidor:', item.url);
                                            item.archivoNoExiste = true; // Indicamos que no existe
                                            this.$set(item, 'img', require('@/assets/images/file-icons/file-not-found.png'));
                                        } else {
                                            if (fileType === 'img') {
                                                this.$set(item, 'img', item.url);
                                            } else if (fileType === 'pdf') {
                                                this.$set(item, 'img', require('@/assets/images/file-icons/pdf.png'));
                                            } else if (fileType === 'word') {
                                                this.$set(item, 'img', require('@/assets/images/file-icons/doc.png'));
                                            } else {
                                                this.$set(item, 'img', require('@/assets/images/file-icons/file.png'));
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        console.error('Error al verificar el archivo:', err);
                                        item.archivoNoExiste = true; // Error en la verificación, lo tratamos como no existente
                                        this.$set(item, 'img', require('@/assets/images/file-icons/file-not-found.png'));
                                    });
                            }
                        });
                    }
                    console.log(me.ValoresImagenMostrar, 'valores obtenidos');
                })
                .catch(err => {
                    console.error('Error al obtener datos:', err);
                });
        },
    }
}
</script>

<style scoped>
.upload-container {
    width: 100%;
}

.upload-container input {
    border: 1px solid #92b0b3;
    background: #217bc5;
    outline: 2px dashed #92b0b3;
    outline-offset: -10px;
    padding: 100px 0px 100px 130px;
    width: 100%;
    color: white;
}
</style>
