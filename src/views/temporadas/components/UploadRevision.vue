<template>
<div>
    <!-- Sección de carga de archivos cuando no hay archivos adjuntos y no se guarda una imagen -->
    <div class="box-input">
        <div class="box upload-container">
            <input type="file" name="file7" id="file7" class="file7" multiple @change="uploadFiles" />
        </div>
        <br />
    </div>
    <!-- Sección de archivos adjuntos -->
    <div class="flex m-3" style="margin-top: -10px; flex-wrap: wrap;">
        <div v-for="(tr, key) in attachmentArray" :key="key" class="flex justify-center" style="margin-bottom: 20px; padding-right: 10px;">
            <div class="flex justify-center items-center" style="flex-direction: column; align-items: center;">
                <img v-if="tr.tipo === 'img'" width="150" class="img-responsive mb-2 ml-1" :src="tr.img" style="border-radius: 5px; margin: 0 auto;" />
                <img v-else src="@/assets/images/file-icons/doc.png" width="150" />
                <small class="mt-1">{{ tr.name }}</small>
                <small>{{ tr.size }}</small>
            </div>

            <div>
                <vs-button radius type="line" @click="ObjectSelected=tr;f_confirmEliminar(tr)" class="ml-2 mt-4" color="danger" icon="delete" />
            </div>
        </div>
    </div>

    <!-- Botón para subir documento -->
    <div class="flex justify-center">
        <vs-button color="success" @click="subirDocumento" class="mt-2" type="gradient">{{ titlebtn }}</vs-button>
    </div>
    <!--modal para confirmar eliminar archivo bd-->
    <vs-popup classContent="popup-example" title="Confirmar Eliminación" :active.sync="popupConfirmEliminar" max-width="400" class="popupHijo">
      <div v-if="popupConfirmEliminar">
        <div class="p-4">
            <p>¿Estás seguro de que deseas eliminar este archivo {{ ObjectSelected.name }} de la Base de Datos?</p>
        </div>
        <div class="flex justify-center">
            <vs-button @click="f_eliminarBd" class="mr-5" color="primary">Si, deseo eliminar</vs-button>
            <vs-button @click="popupConfirmEliminar = false" color="danger">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
</div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            usuario: [],
            attachmentArray: [],
            tipoFile: '',
            ifSaveImagen: false,
            popupConfirmEliminar: false,
            ObjectSelected: null,
        };
    },
    props: {
        pedido: {
            type: Object,
            default: {},
        },
        titlebtn: {
            type: String,
            default: '',
        },
        campo_fecha: {
            type: String,
            default: 'fecha_subir_cheque',
        },
        tipoDocumento: {
            type: String,
            default: '',
        },
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
        f_confirmEliminar(){
          let me = this;
          if(me.ObjectSelected.id){
            this.popupConfirmEliminar = true;
          }else{
            this.removeItemFromArr(this.attachmentArray, me.ObjectSelected);
          }

        },
       f_eliminarBd() {
          let me = this;
          console.log("me.ObjectSelected", me.ObjectSelected);

          // si existe el id es un archivo ya guardado en base de datos y hay que eliminarlo de ahi tambien
          let formData = new FormData();
          formData.append('file_id', me.ObjectSelected.id);

          me.$vs.loading();

          this.$http.post(this.$data_url + 'api/removeArchivoEvidenciaGlobal', formData)
            .then(res => {
              me.$vs.loading.close();
              me.$vs.notify({
                text: 'Archivo eliminado con éxito',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              });

              me.removeItemFromArr(me.attachmentArray, me.ObjectSelected);

              // Cierra el popup primero
              me.popupConfirmEliminar = false;

              // Espera a que el DOM reaccione al cierre del popup
              me.$nextTick(() => {
                me.$emit('f_recargeVerificaciones', true);
              });
            })
            .catch(err => {
              me.$vs.loading.close();
              me.$vs.notify({
                text: 'Error al eliminar el archivo',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              });
            });
        },

        removeItemFromArr(arr, item) {
            const index = arr.indexOf(item);
            console.log("item",item)
            if (index !== -1) {
                arr.splice(index, 1);
            }

            // Verificar si el elemento existe antes de modificar su valor
            const fileInput = document.getElementById('fileAutoriza');
            if (fileInput) {
                fileInput.value = '';
            }
        },
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
            // Solo proceder si hay archivos
            if (!this.ifSaveImagen && this.attachmentArray.length === 0) {
                this.$vs.notify({
                    text: `Suba una evidencia de ${this.tipoDocumento} por favor`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                });
                return;
            }
            if (this.ifSaveImagen && this.attachmentArray.length === 0 && this.pedido.estado_revision == 1) {
                this.$vs.notify({
                    text: `Suba una evidencia de ${this.tipoDocumento} por favor esta verificacion ya fue revisada`,
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

            // Agregar los nuevos archivos
            this.attachmentArray.forEach(item => {
                formData.append('archivos[]', item.file);
            });

            formData.append('campo_fecha', this.campo_fecha);
            formData.append('campo_file', this.campo_file);
            formData.append('verificacion_id', this.pedido.id);
            formData.append('contrato', this.pedido.contrato);
            formData.append('tipoDocumento', this.tipoDocumento);
            formData.append('imgOld', JSON.stringify(this.imgOld)); // Mandamos los archivos viejos
            formData.append('user_created', this.usuario.idusuario);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            this.$vs.loading();

            axios.post(`${this.$data_url}api/guardarRevision`, formData, config)
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
        },
    },
};
</script>

<style scoped>
/* .box-input {
}
*/

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
.popupHijo{
    z-index: 51005;
    /* Valor mayor que el del popup del padre */
}
</style>
