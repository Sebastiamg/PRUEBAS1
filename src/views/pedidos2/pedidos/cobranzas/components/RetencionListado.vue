<template>
    <vx-card fixed-height="true">
        <vs-row>
            <!-- {{ListaRetencionesxcliente}} -->
            <vs-divider>Lista de retenciones registradas</vs-divider>
            <vs-row vs-type="flex" vs-justify="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-table search :data="ListaRetencionesxcliente" :max-items="ListaRetencionesxcliente.length" no-data-text="No hay registros de retenciones">
                    <template slot="thead">
                        <vs-th width="200">
                            Información Factura
                        </vs-th>
                        <vs-th width="400">
                            Información Cliente
                        </vs-th>
                        <vs-th width="400">
                            Información Retención
                        </vs-th>
                        <vs-th width="100">
                            Evidencia Retención
                        </vs-th>
                        <vs-th width="50">
                            Acción
                        </vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr :key="index" v-for="(item, index) in data">
                            <vs-td>
                                <small> {{item.referencia_retencion_factura}} </small><br>
                                <small><b>{{item.descripcion_corta}}</b></small><br>
                                <small><b>Items:</b> {{item.item}} </small><br>
                                <small><b>Libros:</b> {{item.libros}} </small><br>
                            </vs-td>
                            <vs-td>
                                <small><b>Institución:</b> {{item.nombreInstitucion}} </small><br>
                                <small><b>Dirección:</b> {{item.direccionInstitucion}}</small><br>
                                <small><b>Cédula cliente:</b> {{item.abono_ruc_cliente}}</small><br>
                                <small><b>Nombre cliente:</b> {{item.nombres}} {{item.apellidos}}</small>
                            </vs-td>
                            <vs-td>
                                <small><b>Fecha Retención:</b> {{item.abono_fecha}}</small><br>
                                <small><b>Valor Retención:</b> ${{item.abono_valor_retencion}}</small><br>
                                <small><b>Documento:</b> {{item.abono_documento}}</small><br>
                                <small><b>Concepto:</b> {{item.abono_concepto}}</small><br>
                            </vs-td>
                            <vs-td>
                                <div v-if="item.egf_url == null">
                                    <!-- <b style="color: red;">No hay evidencia cargada para esta retención.</b> -->
                                </div>
                                <vs-button v-else style="display: inline" @click="mostrarArchivo(item)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vs-td>
                            <vs-td align="center" v-if="item.abono_estado == 0">
                                <div>
                                    <div>
                                        <vs-button size="medium" color="success" type="relief" icon="edit" title="Editar" @click="verificareditornew = 'edit';EditarRetencion(item);">Editar</vs-button>
                                        <vs-button class="mt-2" size="medium" color="danger" type="relief" title="Anular" @click="anularRetencion(item);">Anular</vs-button>
                                    </div>
                                </div>
                            </vs-td>
                            <vs-td align="center" v-else-if="item.abono_estado == 1">
                                <div>
                                    <b style="color: red;">Retención Anulada</b>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-row>
        </vs-row>
        <vs-row>
            <vs-col>
                <vs-popup fullscreen class="informacionformhijodehijo" :title="`Edición de retención | Factura #${DataEnviarAEditar.referencia_retencion_factura}`" :active.sync="popupEditarRetencion">
                    <EdicionRetenciones v-if="popupEditarRetencion" :datosxitem="DataEnviarAEditar" :empresa="empresa" :datos="datos" :verificareditornew="verificareditornew" @change="changeHandleRetencionComponent" />
                </vs-popup>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col>
                <vs-popup fullscreen class="informacionformhijodehijo" :title="`Anular retención `" :active.sync="popupAnularRetencion" v-if="popupAnularRetencion">
                    <div class="contenido">
                        <p>¿Está seguro que desea anular la retención?</p>
                        <div class="detalles">
                            <p><strong>Documento de Retención: </strong> <b>{{ DataEnviarAEditar.abono_documento }}</b></p>
                            <p><strong>Valor de la Retención: </strong> <b>{{ DataEnviarAEditar.abono_valor_retencion | filtrarDecimal }}</b></p>
                            <p><strong>Referencia de Facturación: </strong> <b>{{ DataEnviarAEditar.referencia_retencion_factura }}</b></p>
                        </div>
                        <div align="center">
                            <b style="color: red">Al anular la retención, se eliminará la evidencia asociada.</b>
                        </div>
                        <p class="textRojo">Esta acción no se puede deshacer.</p>
    
                        <div class="botones">
                            <vs-button color="danger" type="relief" @click="AnularCompletoPromesa(DataEnviarAEditar);">
                                Anular Retención
                            </vs-button>
                            <vs-button color="success" type="relief" @click="popupAnularRetencion = false;">
                                Cancelar
                            </vs-button>
                        </div>
                    </div>
                </vs-popup>
            </vs-col>
        </vs-row>
    </vx-card>
    </template>
    
    <script>
    import {
        mapState
    } from "vuex";
    import axios from 'axios'
    import vSelect from "vue-select";
    const EdicionRetenciones = () => import("@/views/pedidos2/pedidos/cobranzas/components/Retencioncomponent.vue");
    export default {
        data() {
            return {
                ListaRetencionesxcliente: [],
                DataEnviarAEditar: [],
                popupEditarRetencion: false,
                popupAnularRetencion: false,
                usuario: [],
                isrunLoading_metodo_AnularCompletoPromesa: false,
            };
        },
        components: {
            "v-select": vSelect,
            EdicionRetenciones
        },
        props: {
            datos: {
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
        },
        mounted() {
            let me = this;
            me.getListaRetencionesxcliente();
            console.log(me.datos, "heyy");
            console.log(me.empresa, "heyy");
        },
        created() {
            let me = this
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
        },
        methods: {
            mostrarArchivo(tr) {
                console.log(tr, "datos");
                if (tr.egf_url.substr(-3) == "pdf" || tr.egf_url.substr(-3) == "png" || tr.egf_url.substr(-3) == "jpg" || tr.egf_url.substr(-4) == "jpeg" || tr.egf_url.substr(-3) == "PNG" || tr.egf_url.substr(-3) == "gif") {
                    window.open(this.$data_url + 'archivos/evidenciaglobal/' + tr.egft_nombre + '/' + tr.egf_url, '_blank');
                } else if (tr.egf_url.substr(-3) == "doc" || tr.egf_url.substr(-3) == "docx" || tr.egf_url.substr(-3) == "ocx" || tr.egf_url.substr(-3) == "xls" || tr.egf_url.substr(-3) == "lsx") {
                    window.open('https://view.officeapps.live.com/op/embed.aspx?src=' + this.$data_url + 'archivos/evidenciaglobal/' + tr.egft_nombre + '/' + tr.egf_url, '_blank');
                }
            },
            getListaRetencionesxcliente() {
                let me = this;
                me.$vs.loading()
                return new Promise((resolve, reject) => {
                    this.$http.get(this.$server_url + 'GetListadoRetenciones', {
                            params: {
                                identificacion: me.datos.identificacion,
                                id_empresa: me.empresa.id,
                            }
                        })
                        //axios.get(this.$apifacturacion_url + 'f_Producto')
                        .then(res => {
                            this.ListaRetencionesxcliente = res.data;
                            me.$vs.loading.close()
                            resolve();
                        })
                        .catch(err => {
                            console.log(err);
                            me.$vs.loading.close()
                            reject(err); // Rechaza la promesa si hay error
                        })
                });
            },
            EditarRetencion(item) {
                let me = this;
                console.log(item, "valor de item");
                me.DataEnviarAEditar = item;
                me.popupEditarRetencion = true;
            },
            changeHandleRetencionComponent(e) {
                let me = this;
                console.log("realizarcchangeinicio")
                // console.log(e.verificacionemiteliminar); // Debería imprimir 1
                if (e.verificarretencion == 1) {
                    console.log("Emit recibido por editado.");
                    me.popupEditarRetencion = false;
                    me.getListaRetencionesxcliente();
                } else if (e.verificarretencion == 2) {
                    console.log("Emit recibido por cancelar.");
                    me.popupEditarRetencion = false;
                    me.getListaRetencionesxcliente();
                } else {
                    console.log("Emit no recibido");
                }
            },
            anularRetencion(item) {
                let me = this;
                me.DataEnviarAEditar = [];
                me.DataEnviarAEditar = item;
                me.popupAnularRetencion = true;
            },
            async AnularCompletoPromesa(retencion) {
                let me = this;
                try {
                    me.isrunLoading_metodo_AnularCompletoPromesa = true;
                    me.$vs.loading();
                    // Siempre se ejecuta este método
                    await me.Anular(retencion);
                    await me.AnularEvidencia(retencion);
                    await me.GuardarArchivo(retencion);
                    await me.getListaRetencionesxcliente();
    
                    me.isrunLoading_metodo_AnularCompletoPromesa = false;
                    me.popupAnularRetencion = false;
                    me.$vs.notify({
                        text: "Retención anulada con éxito.",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 7000,
                    });
                    me.$vs.loading.close();
                } catch (error) {
                    console.error('Error en metodo_GuardarCompletoPromesa:', error);
                    me.$vs.loading.close();
                    this.$vs.notify({
                        text: 'Se rechazó la promesa al anular la retencion.',
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                }
            },
            async Anular(retencion) {
                let me = this;
                return new Promise((resolve, reject) => {
                    this.$http.post(this.$server_url + 'anularAbono?', {
                            abono_id: retencion.abono_id,
                            usuario: this.usuario.idusuario,
                            anularretencion: 'yes',
                        })
                        .then(res => {
                            // this.$vs.notify({
                            //     text: res.message,
                            //     color: "success",
                            //     iconPack: "feather",
                            //     icon: "icon-check-circle",
                            // });
                            resolve(); // Resuelve si no hay archivo.
                        })
                        .catch(error => {
                            console.error('Error al anular retencion:', error);
                            this.$vs.notify({
                                text: 'Error al anular el retencion',
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-alert-circle",
                            });
                            reject(error); // Rechaza la promesa si hay error
                        });
                });
            },
            async AnularEvidencia(retencion) {
                let me = this;
                return new Promise((resolve, reject) => {
                    const datosParaGuardar = {
                        abono_id: retencion.abono_id,
                    };
                    console.log(datosParaGuardar, "enviar");
                    me.$http.post(me.$server_url + 'anularretencion_quitarevidencia', datosParaGuardar)
                        .then(res => {
                            if (res.data.status == 1) {
                                // me.$vs.notify({
                                //     text: res.data.message,
                                //     color: 'success',
                                //     iconPack: 'feather',
                                //     icon: 'icon-check',
                                //     time: 7000,
                                // })
                                resolve();
                            } else if (res.data.status == 0) {
                                // Caso de error con mensaje específico
                                me.$vs.notify({
                                    text: res.data.message || "Error al procesar la solicitud.",
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    time: 10000,
                                });
                                reject(error); // Rechaza la promesa si hay error
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
                            reject(error); // Rechaza la promesa si hay error
                        });
                });
            },
            async GuardarArchivo(retencion) {
                let me = this;
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    // console.log(datosFileGuardar.archivos[0], "antes de enviar2");
                    formData.append('Tipo', "Evidencia_de_retenciones");
                    formData.append('nombrearchivo', null);
                    formData.append('saveArchivos_new', undefined);
                    formData.append('imgOld', retencion.egf_url); // Añadir imgOld solo si es 'edit'            
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
                            // me.$vs.notify({
                            //     text: "Evidencia guardada con éxito.",
                            //     color: 'success',
                            //     iconPack: 'feather',
                            //     icon: 'icon-check',
                            //     time: 7000,
                            // });
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
                });
            },
        },
    };
    </script>

    <style scoped>
    </style>
    
    <style scoped>
    .informacionformhijodehijo {
        z-index: 51002;
        /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
        /* position: fixed; */
        /* Asegúrate de que la posición sea adecuada */
    }
    
    .contenido {
        padding: 20px;
        font-family: Arial, sans-serif;
    }
    
    .contenido p {
        font-size: 16px;
        margin: 10px 0;
    }
    
    .detalles p {
        font-size: 16px;
        margin: 10px 0;
    }
    
    .detalles b {
        font-weight: bold;
    }
    
    .textRojo {
        margin-top: 20px;
        color: red;
        font-style: italic;
        text-align: center;
        font-size: 16px;
    }
    
    .botones {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    </style>
    