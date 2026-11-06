<template>
    <div>
        <div v-if="mostrarSection && onlyVisualizar == 0">
            <vs-row vs-justify="center">
                <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <b>Documentos empacados: </b>
                    <span> {{ facturas }} </span>
                </vs-col>
            </vs-row>
            <br />
            <vs-row vs-justify="center">
                <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12" class="m-2">
                    <vs-input type="text" class="w-full" v-model="guiaremision" placeholder="Escribe..." label="Ingrese el número de guía de remisión:" />
                </vs-col>
            </vs-row>
            <div class="vx-row">
                <div class="vx-col w-full mb-6">
                    <p class="ml-2">Respaldo:</p>
                    <br>
                    <p class="mt-1"></p>
                    <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                        <div class=" box upload-container">
                            <input type="file" ref="fileInput" name="fileEmpresa" id="fileEmpresa" v-on:change="uploadFiles()" />
                        </div>
                        <br>
                    </div>
                    <!--BASE-->
                    <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                        <div class="flex" style="justify-content: center;">
                            <div class="flex" style="flex-direction: column;">
                                <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/remision/guias/'+imgOld" style="border-radius: 5px;margin: 0 auto;">
                                <small class="mt-1 ml-2">{{ imgOld }}</small>
                            </div>
                            <vs-button radius type="line" @click="ifSaveImagen = false;" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                        </div>
                    </div>
                    <!--LOCAL-->
                    <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                        <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                            <div class="flex" style="flex-direction: column;">
                                <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                                <img v-else style="width: 200px;" src="@/assets/images/file-icons/doc.png" />
                                <small class="mt-1 ml-2">{{ tr.name }}</small>
                            </div>
                            <vs-button radius type="line" @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">

                <vs-button @click="finalizar()" type="relief" color="green">Guardar</vs-button>&emsp;
                <vs-button @click="$emit('changeGuia', false)" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </div>
        <div v-else-if="onlyVisualizar == 1">
            <div class="vx-row">
                <div class="vx-col w-full mb-6">
                    <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen">
                        <div class="flex" style="justify-content: center;">
                            <div class="flex" style="flex-direction: column;">
                                <image-zoom :regular="$data_url+'archivos/remision/guias/'+imgOld" :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid">
                                </image-zoom>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        No se encontro una imagen para este documento
                    </div>
                </div>
            </div>
        </div>
    </div>
  
</template>
<script>
import imageZoom from 'vue-image-zoomer';
import axios from 'axios'
export default{
    components:{
        imageZoom,
    },
    data(){
        return{
            attachmentArray: [],
            facturas: '',
            idempresa: '',
            idremision: '',
            idempaque: '',
            guiaremision: '',
            imgOld: '',
            ifSaveImagen: false,
            ifImagenBd: false,
            mostrarSection:false,
        }
    },
    props:{
        ObjectedSelected:{
            type:Object,
            default:{}
        },
        onlyVisualizar:{
            type:Number,
            default:0
        }
    },
    mounted(){
        let me = this
        me.goInsertGuia(me.ObjectedSelected)
    },
    methods:{
        goInsertGuia(tr) {
            this.attachmentArray = [];
            this.facturas = tr.remi_num_factura;
            this.idempresa = tr.remi_idempresa;
            this.idremision = tr.id_remision;
            this.idempaque = tr.remi_codigo;
            this.guiaremision = tr.remi_guia_remision;

            if (!tr.archivo && !tr.url) {
                this.imgOld = '';
                this.ifSaveImagen = false;
            } else {
                if (tr.remi_codigo) {
                    this.imgOld = tr.url;
                    this.ifSaveImagen = !!this.imgOld;
                    this.ifImagenBd = true;
                } else {
                    this.ifSaveImagen = false;
                }
            }
            this.mostrarSection = true;
        },
        finalizar() {
            let me = this;
            if (!this.guiaremision && !this.$refs.fileInput.value) {
                me.$vs.notify({
                    text: 'Ingrese el número de guia',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                return;
            }
            this.$http.get(`${this.$server_url}empaqueBodega?getventa=1&ven_codigo=${this.facturas}&id=${this.idempresa}`)
                .then(obtener => {
                    if (!obtener || obtener.length === 0) {
                        return;
                    }

                    let cantidad = obtener.cant;
                    let despacho = obtener.desp;
                    let estado = (cantidad === despacho) ? 1 : 0;

                    let formData = new FormData();
                    if (!me.ifSaveImagen && me.attachmentArray.length === 0 && me.ifImagenBd) {
                        formData.append('archivo', 'no');
                        formData.append('url', 'no');
                        me.eliminarArchivo(me.idremision);
                    }

                    formData.append('id', me.ObjectedSelected.id_remision);
                    formData.append('remi_idempresa', me.idempresa);
                    formData.append('despacharEmpaque', '1');
                    formData.append('remi_codigo', me.idempaque);
                    formData.append('guiaremision', me.guiaremision);
                    formData.append('op', 0);
                    formData.append('factura', me.facturas);
                    me.$vs.loading();

                    this.$http.post(this.$server_url + 'empaqueBodega', formData)
                        .then(res => {
                            me.$vs.loading.close();
                            if(res.data.status == 0){
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-x'
                                });
                                return
                            }
                            me.saveEvidencia(me.idremision);
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        })
                        .catch(e => {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                text: 'No se pudo finalizar el empacado',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        });
                });
        },
        saveEvidencia(getId) {
            let me = this;
            let formData = new FormData();
            if (me.ifSaveImagen || me.attachmentArray.length === 0) {
                formData.append('noSendFiles', 'yes');
                console.log("sin archivos")
                this.$emit('changeGuia', true);
                return;
            }

            me.attachmentArray.forEach(element => {
                formData.append('archivos[]', element.file);
            });

            formData.append('id', getId);
            formData.append('saveArchivos', 'yes');
            formData.append('imgOld', me.imgOld);
            formData.append('archivoguia', 'yes');

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post(this.$data_url + 'api/guardarDatosPedido', formData, config)
                .then(res => {
                    this.$emit('changeGuia', true);
                })
                .catch(error => {});
        },
        // uploadFiles() {
        //     const archivo = document.getElementById("fileEmpresa").files[0];

        //     if (!archivo) {
        //         console.error("No se ha seleccionado ningun archivo");
        //         return;
        //     }

        //     const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
        //     if (archivo.size > MAX_SIZE) {
        //         alert("El archivo es demasiado pesado, el límite es 5MB");
        //         document.getElementById("fileEmpresa").value = '';
        //         return;
        //     }

        //     this.tipoFile = ["image/png", "image/gif", "image/jpeg", "image/jpg"].includes(archivo.type) ? "img" : "other";

        //     const reader = new FileReader();
        //     reader.readAsDataURL(archivo);
        //     reader.onloadend = () => {
        //         const cal = {
        //             file: archivo,
        //             img: reader.result,
        //             tipo: this.tipoFile,
        //             name: archivo.name
        //         };
        //         this.attachmentArray.push(cal);
        //         console.log(cal, "File processed successfully");
        //     };
        // },
        uploadFiles() {
            const archivo = document.getElementById("fileEmpresa").files[0];

            if (!archivo) {
                console.error("No se ha seleccionado ningún archivo");
                return;
            }

            const tiposPermitidos = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
            if (!tiposPermitidos.includes(archivo.type)) {
                alert("Solo se permiten imágenes en formato PNG, GIF, JPEG o JPG.");
                document.getElementById("fileEmpresa").value = '';
                return;
            }

            const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
            if (archivo.size > MAX_SIZE) {
                alert("El archivo es demasiado pesado, el límite es 5MB");
                document.getElementById("fileEmpresa").value = '';
                return;
            }

            this.tipoFile = "img"; // Ya validamos que es imagen, así que puede ir fijo

            const reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onloadend = () => {
                const cal = {
                    file: archivo,
                    img: reader.result,
                    tipo: this.tipoFile,
                    name: archivo.name
                };
                this.attachmentArray.push(cal);
                console.log(cal, "File processed successfully");
            };
        },
        removeItemFromArr(arr, item) {
            const i = arr.indexOf(item);
            if (i > -1) {
                arr.splice(i, 1);
            }
            document.getElementById("fileEmpresa").value = '';
        },
    }
}
</script>
<style>
.color1 {
    color: #2364B4;
    transition: 2 ease-in-out;
}

.color1:hover {
    background: #979c97 !important;
}

.box-input {}

.upload-container {
    position: relative
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

.upload-container input:hover {
    background: #2c78cf
}

.upload-container:before {
    position: absolute;
    bottom: 50px;
    left: 23%;
    content: " Seleccione un archivo o arrastre aqui ";
    color: #f1f9fa;
    font-weight: 900
}

.upload-btn {
    margin-left: 300px;
    padding: 7px 20px
}
.popopPadre {
    z-index: 51008;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}
</style>
