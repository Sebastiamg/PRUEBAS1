<template>
<div class="">
    <br>
    <div class="row" v-if="op==0">
        <vs-table max-items="10" search pagination :data="arrayEmpaques" stripe no-data-text="No hay datos disponibles">
            <template slot="header">
                <vs-chip color="primary">Cantidad: <b> {{ arrayEmpaques.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Facturas</vs-th>
                <vs-th>Detalles</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>{{ tr.remi_codigo }}</b> <br>{{ tr.remi_fecha_inicio }}
                    </vs-td>
                    <vs-td>
                      <b>Remitente:</b>
                      <p>{{ tr.descripcion_corta}}</p>
                        <b># </b>{{ tr.remi_num_factura }}<br>
                        <b>RUC:</b> {{ tr.remi_ruc_destinatario }}<br>
                        <p><b>Cliente</b>: {{tr.cliente}}</p>
                        <b>Punto de despacho:</b>
                        <p> {{ tr.nombreInstitucion }}<br></p>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.remi_estado==0" color="danger">Anulado</vs-chip>
                        <vs-chip v-if="tr.remi_estado==1" color="warning">Pendiente</vs-chip>
                        <vs-chip v-if="tr.remi_estado==2" color="success">Finalizado</vs-chip>
                        <br>
                        <br><b>Empaques: </b>{{ tr.cantidad }}<br>
                        <b>Unidades: </b>{{ tr.libros }}<br>
                        <div v-if="tr.est_ven_codigo == 11" style="background-color: antiquewhite;">
                            <b >Documento con libros excluidos</b>
                        </div>
                    </vs-td>
                    <vs-td v-if="(tr.trans_codigo!=15 && tr.trans_codigo!=47)&&tr.remi_estado==2">
                        <vs-button v-if="tr.trans_codigo!=15 && tr.trans_codigo!=47&&tr.remi_estado==2" color="warning" class="w-full" @click="goInsertGuia(tr,1)">Editar Guía </vs-button>
                    </vs-td>
                    <vs-td v-if="tr.remi_estado==1">
                        <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 320px;" class="cursor">
                                <vs-dropdown-item>
                                    <vs-button v-if="(tr.trans_codigo==15 || tr.trans_codigo==47)&&tr.remi_estado==1" color="success" type="line" class="w-full" @click="tr.remi_codigo && tr.remi_num_factura && tr.remi_idempresa?getdespacho(tr):'error'">Despachar </vs-button>
                                    <vs-button v-else-if="(tr.trans_codigo!=15 || tr.trans_codigo!=47)&&tr.remi_estado==1" color="success" type="line" class="w-full" @click="ObjectedSelected=tr;guiaremision='';goInsertGuia(tr)">Ingresar Guía </vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item>
                                    <vs-button v-if="tr.remi_estado==1" color="Coral" type="line" class="w-full" @click="ObjectedSelected=tr;getanular(tr)">Anular</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <!-- <div class="row" v-if="op==1">
        <vs-button type="line" class="mt-2" @click="op = 0;">← Regresar</vs-button>
        <EmpacarEditVue :datos="info" :id="id" @cerrar="cerrar" />
    </div> -->
    <!--MODAL-->
    <vs-popup :title="`Despachar empaque #  ${idempaque}`" :active.sync="popupdes">
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
            <vs-button @click="popupdes=false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!--MODAL PARA EDITAR-->
    <vs-popup fullscreen v-if="popupReporteDespachoedit" :active.sync="popupReporteDespachoedit" title="Editar" class="popopPadre">
        <EmpacarEditVue :ObjectedDocument="ObjectedSelected" :id="id" @cerrar="cerrar" />
    </vs-popup>
</div>
</template>

<script>
const EmpacarEditVue = () => import('@/views/home/bodega/components/Empacar/Empacaredit.vue');
import axios from 'axios'
export default {
    components: {
        EmpacarEditVue,
    },
    data() {
        return {
            dato: [],
            opcion: '',
            datos: '',
            id: '',
            info: [],
            op: 0,
            facturas: '',
            idremision: '',
            idempresa: '',
            idempaque: '',
            popupdes: false,
            guiaremision: '',
            libros: [],
            attachmentArray: [],
            tipoFile: '',
            ifSaveImagen: false,
            imgOld: '',
            ifImagenBd: false,
            ObjectedSelected:'',
            popupReporteDespachoedit:false,
        }
    },
    props: {
        arrayEmpaques: {
            type: Array,
            default: () => []
        },
    },
    mounted() {
        let me = this
        me.op = 0;
    },
    methods: {
        cerrar(e) {
            if (e === true) {
                this.popupReporteDespachoedit = false;
                this.$emit('change', true);
            } else {
                this.popupReporteDespachoedit = true;
            }
        },
        removeItemFromArr(arr, item) {
            const i = arr.indexOf(item);
            if (i > -1) {
                arr.splice(i, 1);
            }
            document.getElementById("fileEmpresa").value = '';
        },
        uploadFiles() {
            const archivo = document.getElementById("fileEmpresa").files[0];

            if (!archivo) {
                console.error("No se ha seleccionado ningun archivo");
                return;
            }
            
            const MAX_SIZE = 5 * 1024 * 1024; // 5MB en bytes
            if (archivo.size > MAX_SIZE) {
                alert("El archivo es demasiado pesado, el límite es 5MB");
                document.getElementById("fileEmpresa").value = '';
                return;
            }

            this.tipoFile = ["image/png", "image/gif", "image/jpeg", "image/jpg"].includes(archivo.type) ? "img" : "other";

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
        getdespacho(tr) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: `Confirmación despacho`,
                text: '¿Está seguro de despachar el empaque #' + tr.remi_codigo + '?',
                accept: () => this.f_despachar(tr) // Cambié la forma en que se pasa la función
            });
        },
        f_despachar(tr) {
            let me = this;
            let cantidad, despacho;
            let estado;

            this.$http.get(`${this.$server_url}empaqueBodega?getventa=1&ven_codigo=${tr.remi_num_factura}&id=${tr.remi_idempresa}`)
                .then(obtener => {
                    if (!obtener || obtener.length === 0) {
                        return;
                    }
                    cantidad = obtener.cant;
                    despacho = obtener.desp;
                    estado = (cantidad === despacho) ? 1 : 0;

                    let formData = new FormData();
                    formData.append('estado', estado);
                    formData.append('id', tr.id);
                    formData.append('remi_idempresa', tr.remi_idempresa);
                    formData.append('despacharEmpaque', '1');
                    formData.append('remi_codigo', tr.remi_codigo);
                    formData.append('op', 1);
                    formData.append('factura', tr.remi_num_factura);
                    me.$vs.loading();

                    this.$http.post(this.$server_url + 'empaqueBodega', formData)
                        .then(res => {
                            me.$vs.loading.close();
                            if(res.data.status ==0){
                                me.$vs.notify({
                                    text: res.data.message,
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-x'
                                });
                                return
                            }
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            this.$emit('change', true);
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
        f_editar(tr) {
            this.id = tr.ven_codigo;
            this.popupReporteDespachoedit = true;
            // this.op = 1;
        },
        getanular(tr) {
            this.openConfirm(tr.remi_codigo);
        },
        openConfirm(dato) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Anular Empaque`,
                text: '¿Está seguro de anular el empaque #' + dato + '?'+' Al hacerlo se regresara a pendientes de despacho',
                accept: this.f_anular
            })
        },
        f_anular() {
            let me = this;
            let formData = new FormData();
            formData.append('id',               me.ObjectedSelected.id);
            formData.append('remi_idempresa',   me.ObjectedSelected.remi_idempresa);
            formData.append('anulaEmpaque',     '1');
            formData.append('factura',          me.ObjectedSelected.remi_num_factura);
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
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    me.$emit('change', true);
                   
                })
                .catch(e => {
                    console.log("error",e)
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'No se pudo anular el empaque',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                });
        },
        goInsertGuia(tr) {
            this.attachmentArray = [];
            this.facturas = tr.remi_num_factura;
            this.idempresa = tr.remi_idempresa;
            this.idremision = tr.id;
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

            this.popupdes = true;
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

                    formData.append('id', me.ObjectedSelected.id);
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
                            me.popupdes = false;
                            this.$emit('change1', true);
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
        eliminarArchivo(id) {
            let me = this;
            let formData = new FormData();
            formData.append('deleteRegistroArchivo', "yes");
            formData.append('archivoguia', 'yes');
            formData.append('id', id);
            me.$vs.loading();
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post(this.$data_url + 'api/eliminarValores', formData, config)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 5000
                        });
                        return;
                    }
                    me.$vs.notify({
                        text: "Se elimino correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                })
                .catch(error => {
                    me.$vs.loading.close();
                });
        },
        saveEvidencia(getId) {
            let me = this;
            let formData = new FormData();
            if (me.ifSaveImagen || me.attachmentArray.length === 0) {
                formData.append('noSendFiles', 'yes');
                this.$emit('change', true);
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
                    this.$emit('change', true);
                })
                .catch(error => {});
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
