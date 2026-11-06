<template>
    <div>
        <!-- Sección de carga de archivos -->
        <div class="box-input">
            <div class="box upload-container">
                <input type="file" name="file7" id="file7" multiple @change="uploadFiles" />
            </div>
            <br>
        </div>
    
        <!-- Sección de archivos adjuntos -->
        <div class="flex" style="margin-top: -10px; flex-wrap: wrap;">
            <div class="flex" v-for="(file, index) in attachmentArray" :key="index" style="margin: 0 auto;">
                <div class="flex" style="flex-direction: column; align-items: center;">
                    <img v-if="file.tipo === 'img'" width="200" class="img-responsive mb-2 ml-1" :src="file.img" style="border-radius: 5px;" />
                    <img v-else style="width: 200px;" src="@/assets/images/file-icons/doc.png" />
                    <small class="mt-1 ml-2">{{ file.name }}</small>
                    <small class="mt-1 ml-2">{{ file.size }}</small>
                </div>
                <!-- <vs-button v-if="file.id !== null" radius type="line" @click="removeItemFromArr(index)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button> -->
                <vs-button radius type="line" @click="removeItemFromArr(index)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
            </div>
        </div>
    
        <div class="flex" style="justify-content: center;">
            <vs-button color="success" @click="subirDocumento" class="mt-2" type="gradient">{{ titlebtn }}</vs-button>
        </div>
    </div>
    </template>
    
    <script>
    import axios from 'axios';
    
    export default {
        data() {
            return {
                usuario: [],
                attachmentArray: [],
                ifSaveImagen: false,
            };
        },
        props: {
            pedido: Object,
            titlebtn: String,
            campo_fecha: {
                type: String,
                default: 'fecha_subir_cheque',
            },
            tipoDocumento: String,
            campo_file: {
                type: String,
                default: 'fecha_subir_evidencia',
            },
            imgOld: {
                type: Array,
                default: () => [],
            },
        },
        created() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem("usuario"));
        },
        mounted() {
            this.attachmentArray = [];
            this.cargarArchivos(this.imgOld);
    
        },
        methods: {
            cargarArchivos(files) {
                this.attachmentArray = [];
                console.log('Archivos recibidos:', files);
    
                if (Array.isArray(files) && files.length > 0) {
                    this.ifSaveImagen = true;
                    this.attachmentArray = files.map(file => ({
                        file: null,
                        img: this.$data_url + file.egf_url + '/' + file.egf_archivo,
                        tipo: (typeof file.egf_archivo === 'string' && file.egf_archivo.endsWith('.pdf')) ? 'other' : 'img',
                        name: file.egf_archivo || 'Archivo sin nombre',
                        size: file.egf_tamano ? `${file.egf_tamano} MB` : 'Desconocido',
                        id: file.egf_id, // Agregamos el ID para hacer la comparación
                    }));
                    console.log('attachmentArray actualizado:', this.attachmentArray);
                }
            },
            removeItemFromArr(index) {
                this.attachmentArray.splice(index, 1);
            },
            // uploadFiles(e) {
            //     const files = e.target.files;
            //     if (!files.length) return;
    
            //     Array.from(files).forEach(file => {
            //         const existe = this.attachmentArray.some(item => item.name === file.name);
            //         if (existe) {
            //             this.$vs.notify({
            //                 text: `El archivo "${file.name}" ya ha sido agregado.`,
            //                 color: 'warning',
            //                 iconPack: 'feather',
            //                 icon: 'icon-alert-triangle',
            //             });
            //             return;
            //         }
    
            //         const tipo = file.type.startsWith('image/') ? 'img' : 'other';
            //         const reader = new FileReader();
    
            //         reader.onloadend = () => {
            //             this.attachmentArray.push({
            //                 file: file,
            //                 img: reader.result,
            //                 tipo: tipo,
            //                 name: file.name,
            //             });
            //         };
            //         reader.readAsDataURL(file);
            //     });
            // },
            uploadFiles(e) {
                const files = e.target.files;
                if (!files.length) return;
    
                // Agregar los archivos seleccionados al arreglo
                Array.from(files).forEach(archivo => {
                    // Verificar si el archivo ya existe en la lista
                    const existe = this.attachmentArray.some(item => item.name === archivo.name);
                    if (existe) {
                        this.$vs.notify({
                            text: `El archivo "${archivo.name}" ya ha sido agregado.`,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                        return; // No agregar duplicados
                    }
    
                    let fileSize = archivo.size / (1024 * 1024); // Tamaño en MB
    
                    const tipo = archivo.type.startsWith('image/') ? 'img' : 'other';
                    const reader = new FileReader();
    
                    reader.onloadend = () => {
                        const fileData = {
                            file: archivo,
                            img: reader.result,
                            tipo: tipo,
                            name: archivo.name,
                            size: fileSize.toFixed(2) + ' MB',
                        };
                        this.attachmentArray.push(fileData);
                    };
    
                    reader.readAsDataURL(archivo);
                });
            },
            subirDocumento() {
                // Validar si no hay archivos para subir y si la verificación ya fue revisada
                if (!this.ifSaveImagen && this.attachmentArray.length === 0) {
                    this.$vs.notify({
                        text: `Suba una evidencia de ${this.tipoDocumento} por favor`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    return;
                }
               
    
                const formData = new FormData();
    
                // Verificar los archivos que se han eliminado (presentes en imgOld pero no en attachmentArray)
                const filesToRemove = this.imgOld.filter(oldFile =>
                    !this.attachmentArray.some(newFile => newFile.id === oldFile.egf_id)
                );
    
                // Agregar los archivos eliminados al formData para eliminarlos en el backend
                filesToRemove.forEach(file => {
                    formData.append('remove_files[]', file.egf_id);
                });
    
                // Filtrar los archivos que **no tienen egf_id en null**
                const archivosValidos = this.attachmentArray.filter(item => item.id !== null);
               
                // Agregar solo los archivos válidos
                archivosValidos.forEach(item => {
                    formData.append('archivos[]', item.file);
                });
    
                // **Filtrar imgOld para que no incluya archivos con egf_id: null**
                const imgOldFiltrado = this.imgOld.filter(file => file.egf_id !== null);
    
                // Agregar información extra necesaria
                formData.append('campo_fecha', this.campo_fecha);
                formData.append('campo_file', this.campo_file);
                formData.append('verificacion_id', this.pedido.id);
                formData.append('contrato', this.pedido.contrato);
                formData.append('tipoDocumento', this.tipoDocumento);
                formData.append('imgOld', JSON.stringify(imgOldFiltrado)); // Mandamos los archivos viejos
                formData.append('user_created', this.usuario.idusuario);
    
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
    
                this.$vs.loading();
                axios.post(`${this.$data_url}api/saveFileVerificacion`, formData, config)
                    .then((response) => {
                        // Verificar el estado de la respuesta del backend
                        if (response.data.status === "1") {
                            this.$vs.notify({
                                text: 'Se guardó correctamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check',
                            });
                            this.$emit('recharge', true);
                            document.getElementById('fileAutoriza').value = '';
                            this.attachmentArray = [];
                        } else if(response.data.status === "0") {
                            // Si el estado es 0, mostrar el mensaje de error
                            this.$vs.notify({
                                text: response.data.message || 'Ocurrió un error al guardar los archivos.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle',
                            });
                        }
                        this.$vs.loading.close();
                    })
                    .catch((error) => {
                        // Si ocurre un error con la petición, mostrar una notificación de error genérico
                        // this.$vs.notify({
                        //     text: 'Hubo un error al intentar guardar los archivos. Intente nuevamente.',
                        //     color: 'danger',
                        //     iconPack: 'feather',
                        //     icon: 'icon-alert-triangle',
                        // });
                        this.$vs.loading.close();
                    });
            }
    
    
        },
    };
    </script>
    
    <style scoped>
    .upload-container input {
        border: 1px solid #92b0b3;
        background: #217bc5;
        outline: 2px dashed #92b0b3;
        outline-offset: -10px;
        padding: 50px;
        width: 100%;
        color: white;
    }
    
    .upload-container input:hover {
        background: #2c78cf;
    }
    
    .upload-container {
        position: relative;
    }
    
    .upload-container input {
        border: 1px solid #92b0b3;
        background: #217bc5;
        outline: 2px dashed #92b0b3;
        outline-offset: -10px;
        padding: 100px 0 100px 130px;
        width: 100%;
        color: white;
    }
    
    .upload-container input:hover {
        background: #2c78cf;
    }
    
    .upload-container:before {
        position: absolute;
        bottom: 50px;
        left: 23%;
        content: "Seleccione uno o más archivos o arrastre aquí";
        color: #f1f9fa;
        font-weight: 900;
    }
    
    .upload-btn {
        margin-left: 300px;
        padding: 7px 20px;
    }
    </style>
    