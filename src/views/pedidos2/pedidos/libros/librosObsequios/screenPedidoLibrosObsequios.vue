<template>
<div>
    <div class="mt-3">
        <p class="text-warning">Pedido Libros Hijos Docentes Id# {{ datosLibroObsequioTr.id }} de la institución:<br> <b>{{ datosLibroObsequioTr.nombreInstitucion }}</b>({{ librosObsequios.ciudad }})</p><br>
        <!-- <vs-divider></vs-divider> -->
        <addLibrosObsequios @guardar_informacion="capturarCantidad" ref="addLibrosObsequios" :sendPedido="sendPedido" :librosObsequios="librosObsequios" />
        <!-- <formlibros ref="formlibros" :sendPedido="sendPedido" :ArrayLibrosObsequios="librosObsequios" :selectifanticipo="pedido.ifanticipo" :anticipoAprobado="(pedido.anticipo_aprobado == pedido.deuda) ? pedido.anticipo_aprobado : pedido.anticipo_aprobado - pedido.deuda" @changePedido="getChangePedido"/> -->
    </div>
    <!-- <br><br><br>
    <p class="text-danger font-bold text-center">Para enviar la información, no olvides verificar que la información sea precisa.</p><br>
    <div class="flex justify-center">
      <vs-textarea label="Observación del Pedido Libros Obsequios:" placeholder="Escribe tu observación antes de enviar." class="w-full" v-model="pedidoLibrosObsequios.observacion_asesor" />
    </div>
    <div class="flex justify-center">
    <p class="mt-1"></p>
    <vs-button color="success" @click="CambiarEstadoLibrosObsequios(librosObsequios,3)" icon="send">Si deseo, Enviar</vs-button>
    </div> -->
</div>
</template>

  
<script>
import {
    FormWizard,
    TabContent
} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import addLibrosObsequios from './addLibrosObsequios.vue'
import axios from 'axios'
export default {
    components: {
        FormWizard,
        TabContent,
        'v-select': vSelect,
        addLibrosObsequios,
    },
    data: () => ({
        usuario: [],
        pedidoLibrosObsequios: {
            observacion_asesor: '',
        },
        id_pedido: '',
        txt_finalizar: 'Finalizar',
        pedido: {
            id_pedido: 0,
            periodo: '',
            tipo_venta: '',
            fecha_envio: '',
            fecha_entrega: '',
            institucion: '',
            asesor: '',
            descuento: '',
            anticipo: '',
            observacion: '',
            ruc: '',
            direccionInstitucion: '',
            nivel: '',
            tipo_descripcion: '',
            telefonoInstitucion: '',
            pendiente_liquidar: 0,
            convenio_anios: '',
            anticipo_aprobado: 0,
            contrato_generado: '',
            ifanticipo: false,
            ifagregado_anticipo_aprobado: 0,
            deuda: 0,
            periodo_deuda: '',
            region_idregion: 0,
            historicoEstado: 0,
            estado: 0,
        },
        tmpPedidos: [],
        porcentaje_descuento_series_basicas: 0,
        counterDanger: false,
        //variables para images
        src_imagen_opcion: '',
        img_opcion_old: '',
        verImg: false,
        popupImagen: false,
        errorImage: 'no',
        tamanioError: 'no',
        //fin variables para images
        //variables para ruc
        src_imagen_opcion_ruc: '',
        img_opcion_old_ruc: '',
        verImg_ruc: false,
        popupRuc: false,
        errorImage_ruc: 'no',
        tamanioError_ruc: 'no',
        selectifanticipo: false,
        //comentarios
        comentarios: [],
        input_comentario: '',
        popupComentarios: false,
        cant_sms: 0,
        //fin variables comentarios
        //variables de coincidencias
        arregloIdsCoincidencias: [],
        verAnticipos: false,
        //fin variables de coincidencias
        //variables para solicitud de mayor anticipo
        popupSolicitudAnticipo: false,
        solicitud: {
            id: 0,
            valor: 0,
            observacion: '',
            estado: 0,
        },
        //fin variables para mayor anticipo
        //variable subir imagen
        attachmentArray: [],
        attachmentArray_ruc: [],
        //variables del librosObsequios
        observacion_asesor: '',
        datosLibroObsequioTr: [],
        ArrayLibrosObsequios: []
        //fin variables del librosObsequios
    }),
    props: {
        librosObsequios: {
            type: Object,
            default: '',
            required: true
        },
        sendPedido: {
            type: Object,
            default: '',
            required: true
        },
        userRoot: {
            type: Boolean,
            default: false,
        }
    },
    mounted() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.observacion_asesor = me.librosObsequios.observacion_asesor
        me.datosLibroObsequioTr = me.librosObsequios
    },
    methods: {
        verificarCantidadesPedidoLibrosobsequios() {
            // Llamar al método verificarCantidadesPedidoLibrosobsequios() en el hijo
            this.$refs.addLibrosObsequios.verificarLibrosobsequios();
        },
        capturarCantidad(cantidad, estado, obsequio) {
            // Emite el evento hacia librosObsequios con la cantidad capturada
            this.$emit('enviar_cantidad', cantidad, estado, obsequio);
        },
        //METODOS DE librosObsequios
        async guardarValorPedidoLibrosObsequios() {
            let me = this
            if (me.observacion_asesor == "" || me.observacion_asesor == null || me.observacion_asesor == undefined) {} else {
                if (me.observacion_asesor.length > 500) {
                    me.$vs.notify({
                        text: 'Máximo 500 caracteres.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 4000
                    })
                    return
                }
            }
            let formData = new FormData();
            formData.append('id', me.librosObsequios.id)
            formData.append('only_observacion', 'yes');
            formData.append('observacion_asesor', me.observacion_asesor);
            this.$http.post(this.$server_url + 'guardarValorPedidoLibrosObsequios', formData)
                .then(function (res) {
                    this.activartipo()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {})
        },
        CambiarEstadoLibrosObsequios(tr, estado) {
            let me = this;
            if (!this.pedidoLibrosObsequios.observacion_asesor) {
                this.$vs.notify({
                    text: 'Escriba la observación antes de enviar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append('id', tr.id);
            formData.append('estado_libros_obsequios', estado);
            formData.append('observacion_asesor', me.pedidoLibrosObsequios.observacion_asesor);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'CambiarEstadoLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.$vs.notify({
                        text: 'Se envio correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        //FIN METODOS DE librosObsequios
    },
    //FIN METODOS PARA SOLICITAR ANTICIPO

}
</script>
  
<style scoped>
@media(max-width: 540px) {
    .text-convenio {
        display: none;
    }
}

@media(max-width: 414px) {
    .text-anticipoA {
        width: 100% !important;
    }

    .btnGuardar {
        margin: 0 auto;
        margin-top: -20px;
    }

    .text-convenio {
        display: none;
    }

    .text-observacion {
        width: 100% !important;
        margin-top: -30px !important;
    }

    .text-imagen {
        margin-top: 10px;
        width: 100% !important;
    }
}

@media(max-width: 414px) {
    .deuda {
        width: 100% !important;
    }
}

@media(max-width: 1280px) {
    .contenedor-file {
        width: 80% !important;
        margin: 0 auto;
    }
}

@media(max-width: 540px) {
    .contenedor-file {
        width: 100% !important;
    }

    .upload-container input {
        padding: 100px 0px 100px 77px !important;
        font-size: 12px !important;
    }
}

@media(max-width: 414px) {
    .contenedor-file {
        width: 100% !important;
    }

    .upload-container input {
        padding: 100px 0px 100px 17px !important;
        font-size: 8px !important;
    }
}

@media(max-width: 375px) {
    .upload-container input {
        padding: 100px 0px 100px 17px !important;
        font-size: 8px !important;
    }

    .text-convenio {
        display: none;
    }

    .text-observacion {
        width: 100% !important;
        margin-top: -30px !important;
    }

    .text-imagen {
        margin-top: 10px;
        width: 100% !important;
    }

    .text-anticipoA {
        width: 100% !important;
    }

    .btnGuardar {
        margin: 0 auto;
        margin-top: -10px;
    }
}

/*Estilos para subir foto */
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
    left: 26%;
    font-size: 13px;
    content: " Seleccione una archivo o arrastrelo ";
    color: #f1f9fa;
    font-weight: 900;
}

input[type=file]::file-selector-button {
    margin-right: 10px;
    border: none;
    background: #000;
    padding: 10px 20px;
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    transition: background .2s ease-in-out;
}

input[type=file]::file-selector-button:hover {
    background: #0d45a5;
}
</style>
