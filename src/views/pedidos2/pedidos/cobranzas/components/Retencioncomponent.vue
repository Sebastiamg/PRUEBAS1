<template>
<div>
    <vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <div align="center">
                    <b>Empresa: {{ empresa.descripcion_corta }}</b>
                </div>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Fecha Retención: (Obligatorio)</font><br>
                        <div :class="classvalidar_input_fechaRetencion">
                            <flat-pickr :config="configdateTimePicker" v-model="tabRetencion.fechaRetencion" placeholder="Fecha Retención" style="display: inline-block;width: 100%" ref="input_fechaRetencion" />
                        </div>
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Porcentaje de Retención: (Obligatorio)</font><br>
                        <!-- <v-select :options="porcentajeRetencion" :reduce="(porcentajeRetencion) => porcentajeRetencion.value" label="text" value="value" class="w-full h-100" placeholder="--Seleccione--" v-model="tabRetencion.porcentajeRetencion" ref="input_porcentajeRetencion" :class="classvalidar_input_porcentajeRetencion" @input="calcularValorRetencion()" /> -->
                        <v-select :options="porcentajeRetencion" :reduce="porcentajeRetencion => porcentajeRetencion.arp_valor" label="arp_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabRetencion.porcentajeRetencion" ref="input_porcentajeRetencion" :class="classvalidar_input_porcentajeRetencion" @input="calcularValorRetencion()" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <table>
                            <tr>
                                <td width="400">
                                    <div @click="validarCampoDocumentoFocus">
                                        <vs-input label="Número de documento (Obligatorio)" placeholder="Número de documento" class="w-full" icon="mode_edit" v-model="tabRetencion.abono_documento" @paste="validarnopegar($event)" readonly ref="input_abono_documento" :class="classvalidar_input_abono_documento" />
                                    </div>
                                    <div @click="validarCampoDocumentoFocus">
                                        <vs-input :label="`Valor Documento: ${tabRetencion.valorReal} * % Retencion: ${tabRetencion.porcentajeRetencion}% (Obligatorio)`" placeholder="Valor Documento * % Retencion" class="w-full" icon="mode_edit" v-model="tabRetencion.valor" readonly ref="input_valor" :class="classvalidar_input_valor" />
                                    </div>
                                </td>
                                <td width="10"></td>
                                <td>
                                    <vs-tooltip text="Ver lista de documentos" position="right">
                                        <template>‎</template>
                                        <vs-button flat @click="getInformacioListDocumentos()" color="black" type="relief" icon="visibility" :class="classvalidar_documento"></vs-button>
                                    </vs-tooltip>
                                </td>
                            </tr>
                        </table>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input label="# Documento SRI (Obligatorio)" placeholder="# Documento SRI" class="w-full" icon="mode_edit" v-model="tabRetencion.num_doc_legal" maxlength="100" @paste="validarnopegar($event)" ref="input_num_doc_legal" :class="classvalidar_num_doc_legal" />
                        <div v-if="sms_abono_documento_duplicado == 1"><b style="color: red">{{ val_sms_abono_documento_duplicado }}</b></div>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="w-full">
                <!-- Componente centralizado con ancho completo -->
                <div align="center" class="vx-col w-full">
                    <table>
                        <tr>
                            <td>
                                <br>
                                <span align="left">Evidencia:</span>
                                <RetencionUploadVue :configuracionarchivossubir="configuracionarchivossubir" :egf_id="datosxitem.egf_id" @change="changeHandleEvidenciaObtenida" class="w-full" />
                            </td>
                        </tr>
                    </table>
                </div>
            </vs-col>
        </vs-row>
    </vs-row>
    <br><br>
    <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="w-full">
            <div align="center" class="vx-col w-full">
                <vs-button @click="GuardarCompletoPromesa()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelarRetencion()" color="danger" type="relief">Cancelar</vs-button>
            </div>
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col>
            <vs-popup class="informacionformhijodehijodehijo" title="Listado de documentos" :active.sync="popupMostrarListaDocumentos">
                <RetencionListdocumentos v-if="popupMostrarListaDocumentos" :datos="datos" :empresa="empresa" @change="changeHandleListadoDocumentos" />
            </vs-popup>
        </vs-col>
    </vs-row>
    <div>
        <!-- Mostrar el progreso -->
        <div v-if="isUploading" class="upload-overlay">
            <div class="upload-content">
                <div>No cerrar esta pestaña</div><br>
                <div>Subiendo archivo... {{ uploadPorcentaje }}%</div>
                <progress :value="uploadPorcentaje" max="100"></progress>
            </div>
        </div>

        <!-- Otros contenidos de tu aplicación -->
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from "vue-select";
const RetencionListdocumentos = () => import("@/views/pedidos2/pedidos/cobranzas/components/Retencioncomponent_listadodocumentos.vue");
const RetencionUploadVue = () => import("@/views/pedidos2/pedidos/cobranzas/components/RetencionUpload.vue");
export default {
    data() {

        return {
            //showAgregarNuevo: false,
            tabRetencion: {
                fechaRetencion: '',
                porcentajeRetencion: '',
                abono_documento: '',
                valor: '',
                valorReal: '',
                id_factura_selected: '',
                num_doc_legal: '',
                referencia_retencion_factura_anterior: '',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            classvalidar_documento: '',
            classvalidar_input_abono_documento: '',
            classvalidar_input_fechaRetencion: '',
            classvalidar_input_valor: '',
            classvalidar_input_porcentajeRetencion: '',
            classvalidar_num_doc_legal: '',
            popupMostrarListaDocumentos: false,
            isrunLoading_metodo_GuardarCompletoPromesa: false,
            evidenciassubir: [],
            evidenciassubir_img: '',
            configuracioncabecerarecibida: '',
            datosFileGuardarrecibida: '',
            datosobtenidosimagenrecibida: [],
            configuracionarchivossubir: {
                imagenes: 1,
                documentos_word: 0,
                documentos_pdf: 1,
                otros: 0,
                tamano_max_mb: 2
            },
            nombre_archivo: '',
            arraynuevoedit: [],
            uploadPorcentaje: 0,
            isUploading: false,
            abono_id: '',
            edicion_archivo: false,
            sms_abono_documento_duplicado: 0,
            val_sms_abono_documento_duplicado: '',
            porcentajeRetencion: [],
        };
    },
    components: {
        "v-select": vSelect,
        flatPickr,
        RetencionListdocumentos,
        RetencionUploadVue,
    },
    props: {
        datos: {
            type: Object,
            default: function () {
                return {}
            }
        },
        datosxitem: {
            type: Object,
            default: function () {
                return {}
            }
        },
        empresa: {
            type: Object,
            default: function () {
                return {}
            }
        },
        verificareditornew: {
            type: String,
            default: '',
        },
    },
    mounted() {
        let me = this;
        me.GetPorcentajeRetencion();
        // console.log(me.datos, "datooos");
        // console.log(me.datosxitem, "heyy");
        if (me.verificareditornew == 'edit') {
            me.arraynuevoedit = me.datosxitem;
            me.tabRetencion.fechaRetencion = me.arraynuevoedit.abono_fecha;
            me.tabRetencion.porcentajeRetencion = me.arraynuevoedit.abono_porcentaje;
            me.tabRetencion.abono_documento = me.arraynuevoedit.referencia_retencion_factura;
            me.tabRetencion.valor = me.arraynuevoedit.abono_valor_retencion;
            me.tabRetencion.valorReal = me.arraynuevoedit.ven_valor;
            me.tabRetencion.num_doc_legal = me.arraynuevoedit.abono_documento;
            me.abono_id = me.arraynuevoedit.abono_id;
            me.tabRetencion.referencia_retencion_factura_anterior = me.arraynuevoedit.referencia_retencion_factura;
            // console.log(me.abono_id, "lololol")
            console.log("con edit")
        } else if (me.verificareditornew == 'new') {
            console.log("con new")
        }
    },
    methods: {
        GetPorcentajeRetencion() {
            let me = this;
            me.$vs.loading();
            let parametrosxfiltro = {
                action: 'GetPorcentajeRetencion', // Especifica la acción
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_AbonoRetencionPorcentaje', {
                    params: parametrosxfiltro
                })
                .then(function (res) {
                    me.porcentajeRetencion = res.data;
                    me.$vs.loading.close();

                    if (me.verificareditornew == 'edit') {
                        // Si estamos en "edit", comprobar si el valor está vacío o incorrecto
                        const porcentajeSeleccionado = me.porcentajeRetencion.find(porcentaje => porcentaje.arp_valor == me.tabRetencion.porcentajeRetencion);
                        if (porcentajeSeleccionado) {
                            me.tabRetencion.porcentajeRetencion = porcentajeSeleccionado.arp_valor; // Asigna el valor arp_valor
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        validarCampoDocumentoFocus() {
            let me = this;

            // Si el campo está vacío
            if (!me.tabRetencion.abono_documento) {
                me.classvalidar_documento = "stylevalidarbutton"; // Aplica la clase de estilo

                // Muestra la notificación
                me.$vs.notify({
                    text: "Para llenar este campo seleccione un documento.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 7000,
                });

                // Quitar la clase después de 1.5 segundos
                setTimeout(() => {
                    me.classvalidar_documento = "";
                }, 7000);
            }
        },
        validarCampoDocumento() {
            let me = this;

            // Si el campo está vacío
            if (!me.tabRetencion.documento) {
                me.classvalidar_documento = "stylevalidarbutton"; // Aplica la clase de estilo

                // Muestra la notificación
                me.$vs.notify({
                    text: "El campo Número de documento está vacío.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 8000,
                });

                // Quitar la clase después de 1.5 segundos
                setTimeout(() => {
                    me.classvalidar_documento = "";
                }, 1500);
            }
        },
        validarcampo_input_porcentajeRetencion() {
            let me = this;
            const focus_input_porcentajeRetencion = me.$refs.input_porcentajeRetencion.$el.querySelector('input');
            focus_input_porcentajeRetencion.focus();
            me.classvalidar_input_porcentajeRetencion = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Seleccione una opción para el campo "Porcentaje de retención".',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_input_porcentajeRetencion = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarcampo_input_documento() {
            let me = this;
            const focus_input_abono_documento = me.$refs.input_abono_documento.$el.querySelector('input');
            focus_input_abono_documento.focus();
            me.classvalidar_input_abono_documento = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'El campo "Número de documento" esta vacio.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_input_abono_documento = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarcampo_input_valor() {
            let me = this;
            const focus_input_valor = me.$refs.input_valor.$el.querySelector('input');
            focus_input_valor.focus();
            me.classvalidar_input_valor = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'El campo "Número de valor" esta vacio.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_input_valor = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarcampo_input_num_doc_legal() {
            let me = this;
            const focus_input_num_doc_legal = me.$refs.input_num_doc_legal.$el.querySelector('input');
            focus_input_num_doc_legal.focus();
            me.classvalidar_num_doc_legal = 'stylevalidarinput';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Complete el campo "# Documento SRI" para guardar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_num_doc_legal = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarcampo_input_num_doc_legal_then() {
            let me = this;
            const focus_input_num_doc_legal = me.$refs.input_num_doc_legal.$el.querySelector('input');
            focus_input_num_doc_legal.focus();
            me.classvalidar_num_doc_legal = 'stylevalidarinput';
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_num_doc_legal = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        validarcampo_input_fechaRetencion() {
            let me = this;

            // Verificar si la referencia está disponible y acceder a la instancia de flatpickr
            const flatpickrInstance = me.$refs.input_fechaRetencion ? me.$refs.input_fechaRetencion.fp : null;

            if (flatpickrInstance) {
                // Usamos flatpickr.open() para abrir el calendario y hacer foco en el input
                flatpickrInstance.open(); // Abre el calendario y hace foco en el input
                me.classvalidar_input_fechaRetencion = 'stylevalidarinput';

                // Notificación de vacio
                me.$vs.notify({
                    text: 'Complete el campo "Fecha Retención" para guardar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                });

                // Quitar la clase después de la duración de la animación
                setTimeout(() => {
                    me.classvalidar_input_fechaRetencion = '';
                }, 1500); // Ajusta según la duración de tu animación
            } else {
                console.error('No se pudo acceder a la instancia de flat-pickr.');
            }
        },
        validateInput(event) {
            const charCode = event.which ? event.which : event.keyCode;
            if ((charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46) {
                event.preventDefault();
            }
        },
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');
            const numbersOnly = pastedText.replace(/[^\d]/g, '');
            document.execCommand("insertText", false, numbersOnly);
            event.preventDefault();
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        calcularValorRetencion() {
            let me = this;

            // Obtener valores
            const porcentaje = me.tabRetencion.porcentajeRetencion || 0; // Si no hay porcentaje, se usa 0
            const valorDocumento = parseFloat(me.tabRetencion.valorReal) || 0; // Si no hay valor, se usa 0
            console.log("porcentaje", porcentaje, "valorDocumento", valorDocumento);

            // Verificar si ambos tienen valores válidos para multiplicar
            if (porcentaje > 0 && valorDocumento > 0) {
                me.tabRetencion.valor = (valorDocumento * (porcentaje / 100)).toFixed(2);
                // me.tabRetencion.valor = parseFloat(valorxporcentaje) + parseFloat(valorDocumento);
            } else if (porcentaje <= 0 && valorDocumento > 0) {
                me.tabRetencion.porcentajeRetencion = '';
                me.tabRetencion.valor = valorDocumento;
            } else if (porcentaje > 0 && valorDocumento <= 0) {
                me.tabRetencion.valor = valorDocumento;
            }
        },
        getInformacioListDocumentos() {
            let me = this;
            me.popupMostrarListaDocumentos = true;
        },
        getCancelarRetencion() {
            let me = this;
            me.$emit('change', {
                verificarretencion: 2
            });
        },
        changeHandleListadoDocumentos(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarretenciondocumentos != '') {
                me.tabRetencion.abono_documento = e.verificarretenciondocumentos.id_factura;
                me.tabRetencion.valor = e.verificarretenciondocumentos.ven_valor;
                me.tabRetencion.valorReal = e.verificarretenciondocumentos.ven_valor;
                me.calcularValorRetencion();
                console.log("Emit recibido por seleccionado.");
                me.popupMostrarListaDocumentos = false;
            } else if (e.verificarretenciondocumentos == 2) {
                console.log("Emit recibido por cerrar.");
                me.popupMostrarListaDocumentos = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEvidenciaObtenida(e) {
            let me = this;
            setTimeout(() => {
                me.$vs.loading.close();
                this.configuracioncabecerarecibida = e.configuracioncabecera;
                this.datosFileGuardarrecibida = e.datosFileGuardar;
                this.datosobtenidosimagenrecibida = e.datosobtenidosimagen;
                console.log(this.configuracioncabecerarecibida, "1");
                console.log(this.datosFileGuardarrecibida, "2");
                console.log(this.datosobtenidosimagenrecibida, "3");
                // Validar si hay datos en el array
                if (e.datosobtenidosimagen && e.datosobtenidosimagen.length > 0) {
                    if (e.datosobtenidosimagen[0].name) {
                        me.evidenciassubir_img = e.datosobtenidosimagen[0].name;
                        console.log("Name encontrado:", me.evidenciassubir_img);
                        me.edicion_archivo = true;
                    } else {
                        console.log("El primer elemento no tiene 'name'.");
                    }
                } else {
                    console.log("El array está vacío o no existe.");
                    me.edicion_archivo = true;
                }
            }, 500);
        },
        async GuardarCompletoPromesa() {
            let me = this;
            try {
                me.isrunLoading_metodo_GuardarCompletoPromesa = true;
                me.$vs.loading();

                // Siempre se ejecuta este método
                await me.GuardarNuevaRetencion();

                // Condicional para ejecutar GuardarArchivo según las condiciones
                if (me.verificareditornew == 'new') {
                    await me.GuardarArchivo();
                } else if (me.verificareditornew == 'edit' && me.edicion_archivo == true) {
                    await me.GuardarArchivo();
                }

                me.isrunLoading_metodo_GuardarCompletoPromesa = false;
                me.$vs.loading.close();

                // Emitir el evento
                this.$emit('change', {
                    verificarretencion: 1
                });
            } catch (error) {
                console.error('Error en metodo_GuardarCompletoPromesa:', error);
                me.$vs.loading.close();
            }
        },
        async GuardarNuevaRetencion() {
            let me = this;
            let referencia_retencion_factura_anterior_var = '';
            me.sms_abono_documento_duplicado = 0;
            return new Promise((resolve, reject) => {
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                const periodoretencion = localStorage.getItem('pid');
                if ((me.tabRetencion.fechaRetencion == 'undefined') || (me.tabRetencion.fechaRetencion == '') || (me.tabRetencion.fechaRetencion == null)) {
                    me.validarcampo_input_fechaRetencion();
                    reject("Fecha de retencion vacia.");
                    return
                }
                if ((me.tabRetencion.porcentajeRetencion == 'undefined') || (me.tabRetencion.porcentajeRetencion == '') || (me.tabRetencion.porcentajeRetencion == null)) {
                    me.validarcampo_input_porcentajeRetencion();
                    reject("Porcentaje de retencion vacio.");
                    return
                }
                if ((me.tabRetencion.abono_documento == 'undefined') || (me.tabRetencion.abono_documento == '') || (me.tabRetencion.abono_documento == null)) {
                    me.validarcampo_input_documento();
                    reject("Abono documento vacio.");
                    return
                }
                if ((me.tabRetencion.valor == 'undefined') || (me.tabRetencion.valor == '') || (me.tabRetencion.valor == null)) {
                    me.validarcampo_input_valor();
                    reject("Abono valor vacio.");
                    return
                }
                if ((me.tabRetencion.num_doc_legal == 'undefined') || (me.tabRetencion.num_doc_legal.trim() == '') || (me.tabRetencion.num_doc_legal == null)) {
                    me.validarcampo_input_num_doc_legal();
                    reject("Abono num_doc_legal vacio.");
                    return
                }
                if (me.tabRetencion.referencia_retencion_factura_anterior == 'undefined' || me.tabRetencion.referencia_retencion_factura_anterior == '' || me.tabRetencion.referencia_retencion_factura_anterior == null) {
                    referencia_retencion_factura_anterior_var = 'vacio';
                }else if (me.tabRetencion.referencia_retencion_factura_anterior != 'undefined' || me.tabRetencion.referencia_retencion_factura_anterior != '' || me.tabRetencion.referencia_retencion_factura_anterior != null) {
                    referencia_retencion_factura_anterior_var = me.tabRetencion.referencia_retencion_factura_anterior;
                }
                let nombreimagenrecibida = '';
                let imagen_tamano = '';
                console.log(me.datosobtenidosimagenrecibida.length, "datooosososososososos");
                if ((me.datosobtenidosimagenrecibida.length == 0)) {
                    nombreimagenrecibida = null;
                    imagen_tamano = null;
                } else {
                    nombreimagenrecibida = me.datosobtenidosimagenrecibida[0].name;
                    imagen_tamano = me.datosobtenidosimagenrecibida[0].size
                }
                // console.log(me.tabRetencion, "tabretencion");
                const datosParaGuardar = {
                    abono_fecha: me.tabRetencion.fechaRetencion,
                    abono_porcentaje: me.tabRetencion.porcentajeRetencion,
                    abono_valor_retencion: me.tabRetencion.valor,
                    abono_periodo: periodoretencion,
                    abono_tipo: 3,
                    user_created: usuarioObjeto.idusuario,
                    referencia_retencion_factura: me.tabRetencion.abono_documento,
                    idClientePerseo: me.datos.clientesid,
                    clienteCodigoPerseo: me.datos.clientescodigo,
                    abono_ruc_cliente: me.datos.identificacion,
                    abono_documento: me.tabRetencion.num_doc_legal,
                    abono_concepto: `CLIENTE: ${me.datos.razonsocial} DOCUMENTO: ${me.tabRetencion.num_doc_legal}`,
                    egft_id: 1,
                    abono_empresa: me.empresa.id,
                    referencia_retencion_factura_anterior: referencia_retencion_factura_anterior_var,
                };
                // Agregar varaibles si es edit o new
                if (me.verificareditornew == 'edit') {
                    datosParaGuardar.abono_id = me.abono_id;
                    if (me.edicion_archivo == true) {
                        datosParaGuardar.egf_archivo = nombreimagenrecibida;
                        datosParaGuardar.egf_tamano = imagen_tamano;
                    } else if (me.edicion_archivo == false) {
                        console.log('No se envia evidencias a guardar');
                    }
                } else if (me.verificareditornew == 'new') {
                    datosParaGuardar.egf_archivo = nombreimagenrecibida;
                    datosParaGuardar.egf_tamano = imagen_tamano;
                }
                // console.log(datosParaGuardar, 'datossssssssssssssssf');
                // return
                console.log(datosParaGuardar, "datosssssssss");
                // console.log(datosarchivoGuardar, "archivossss");
                // return
                me.$http.post(me.$server_url + 'retencion_registro_update_new', datosParaGuardar)
                    .then(res => {
                        me.$vs.loading.close();
                        if (res.data.status == 1) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 7000,
                            })
                            me.nombre_archivo = res.data.egf_url;
                            // console.log(me.nombre_archivo, "name primer metodo");
                            resolve();
                            this.$emit('change', {
                                verificacionemitsaveandedit: 1
                            });
                        } else if (res.data.status == 0) {
                            // Caso de error con mensaje específico
                            me.validarcampo_input_num_doc_legal_then();
                            me.sms_abono_documento_duplicado = 1;
                            me.val_sms_abono_documento_duplicado = res.data.message;
                            me.$vs.notify({
                                text: res.data.message || "Error al procesar la solicitud.",
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                time: 10000,
                            });
                            reject(new Error(res.data.message || "Error al procesar la solicitud.")); // Rechazar la promesa
                        }
                    })
                    .catch(error => {
                        console.error('Error al guardar los datos:', error);
                        // me.$vs.loading.close();
                        me.$vs.notify({
                            text: 'Error interno, no se puede guardar la retencion.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 7000,
                        })
                        reject(error);
                        return
                    });
            });
        },
        async GuardarArchivo() {
            let me = this;
            return new Promise((resolve, reject) => {
                if ((me.verificareditornew == 'new' && !me.nombre_archivo || me.nombre_archivo == 'undefined')) {
                    console.log("No hay archivo para guardar.");
                    resolve(); // Resuelve si no hay archivo.
                } else {
                    const datosFileGuardar = me.datosFileGuardarrecibida;
                    const formData = new FormData();
                    console.log(datosFileGuardar, "antes de enviar");
                    // console.log(datosFileGuardar.archivos[0], "antes de enviar2");
                    formData.append('Tipo', "Evidencia_de_retenciones");
                    formData.append('nombrearchivo', me.nombre_archivo);
                    formData.append('saveArchivos_new', datosFileGuardar.saveArchivos_new);

                    if (me.verificareditornew == 'edit') {
                        formData.append('imgOld', me.arraynuevoedit.egf_url); // Añadir imgOld solo si es 'edit'
                    }

                    if (datosFileGuardar.archivos && datosFileGuardar.archivos.length > 0 && datosFileGuardar.archivos[0] instanceof File) {
                        formData.append('archivos[]', datosFileGuardar.archivos[0]);
                    } else {
                        console.error("No se envia ningun archivo al files.");
                    }

                    // Inicia la carga
                    me.isUploading = true;

                    // Enviar la solicitud POST con seguimiento de progreso
                    axios.post(me.$data_url + 'api/guardarDatosPedido', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                    console.log(`Subiendo... ${percentCompleted}%`);

                                    // Actualizamos el porcentaje
                                    me.uploadPorcentaje = percentCompleted;

                                    // Verificamos si la carga está completa
                                    if (percentCompleted === 100) {
                                        console.log("La carga se completó al 100%");
                                    }
                                }
                            }
                        })
                        .then((res) => {
                            console.log('Respuesta del servidor:', res.data);
                            me.isUploading = false; // Finaliza el estado de carga
                            me.$vs.notify({
                                text: "Evidencia guardada con éxito.",
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 7000,
                            });
                            resolve();
                        })
                        .catch((error) => {
                            console.error('Error al guardar los datos:', error);
                            me.isUploading = false; // Finaliza el estado de carga
                            me.$vs.notify({
                                text: 'La evidencia no pudo ser guardada.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000,
                            });
                            reject(error); // Rechaza la promesa si hay error
                        });
                }
            });
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
    },
};
</script>

<style scoped>
.informacionformhijodehijodehijo {
    z-index: 51004;
    /* Valor mayor que el del popup del padre */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.stylevalidarbutton {
    outline: 2px solid #ff0000 !important;
    /* Contorno rojo */
    outline-offset: 4px;
    /* Separación entre el contorno y el botón */
    border-radius: 5px !important;
    /* Bordes redondeados */
    transition: outline 0.3s ease-in-out, outline-offset 0.3s ease-in-out;
    /* Transiciones suaves */
}

.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.upload-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    /* Fondo semitransparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    /* Asegura que esté encima de todo */
}

.upload-content {
    text-align: center;
    color: #fff;
    /* Texto en blanco */
    font-size: 18px;
    background: rgba(0, 0, 0, 0.8);
    /* Fondo para el contenido */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

progress {
    width: 100%;
    margin-top: 10px;
}
</style>
