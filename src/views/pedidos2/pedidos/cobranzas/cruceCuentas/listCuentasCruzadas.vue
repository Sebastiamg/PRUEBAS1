<template>
<div>
    <b class="mt-5" style="position: relative;top:8px;">CRUCES DE CUENTAS ({{ tipoListadoCruces == 'facturas' ? 'PRE-FACTURAS' : 'NOTAS' }})</b>
    <vs-table :data="arrayCruces"  pagination :max-items="10" search no-data-text="No hay datos disponibles">
        <template slot="header">
            <vs-chip color="primary" class="mr-2">Cantidad {{ arrayCruces.length }}</vs-chip>
        </template>
        <template slot="thead">
            <vs-th :sort-key="'abono_id'">N°</vs-th>
            <vs-th :sort-key="'abono_documento'">Documento</vs-th>
            <vs-th :sort-key="'abono_fecha'">Fecha</vs-th>
            <vs-th :sort-key="'abono_facturas'">Valor</vs-th>
            <vs-th :sort-key="'abono_ruc_cliente'">RUC / CI</vs-th>
            <vs-th width="160">Acciones</vs-th>
        </template>

        <template slot-scope="{ data }">
            <vs-tr v-for="(row, rowIndex) in data" :key="rowIndex" :state="row.abono_estado==1?'danger':''">
                <vs-td>{{ row.abono_id }}</vs-td>
                <vs-td>{{ row.abono_documento }}</vs-td>
                <vs-td>{{ row.abono_fecha }}</vs-td>
                <vs-td>{{ tipoListadoCruces == 'facturas' ? row.abono_facturas : row.abono_notas }}</vs-td>
                <vs-td>{{ row.abono_ruc_cliente }}</vs-td>
                <vs-td class="text-center">
                    <vs-button v-if="row.abono_estado == 0" class="vs-con-loading__container mb-2" color="warning" @click="getEditarCruce(row)" :disabled="isLoading"><i class="fa-solid fa-edit"></i>
                        Editar
                    </vs-button>
                    <vs-button v-if="row.abono_estado == 0" color="danger" class="mb-2" @click="getAnularCruce(row)"><i class="fa-solid fa-circle-xmark"></i>Anular</vs-button>
                    <vs-button color="success" class="mb-2" @click="getDocumentos(row.abono_documento, row.abono_empresa)"><i class="fa-solid fa-eye"></i>PDF</vs-button>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>

    <vs-popup fullscreen :active.sync="popupDocumento" v-if="popupDocumento" title="Detalle:">
        <documentoVenta :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta" />
    </vs-popup>

    <vs-popup fullscreen :active.sync="popupEditar" v-if="popupEditar" title="Editar:">
        <editarCruce :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta" :arrayCrucesEdit="arrayCrucesEdit" @CerrarEditCruce="CerrarEditCruce" @editadoCruce="editadoCruce" />
    </vs-popup>

    <vs-popup :title="`Anular cruce `" :active.sync="popupAnular" v-if="popupAnular">
        <div class="contenido">
            <p>¿Está seguro que desea anular el cruce?</p>
            <div class="detalles">
                <p><strong>Numero de Cruce: </strong> <b>{{ arrayCrucesAnular.abono_id  }}</b></p>
                <p><strong>Documento de cruce: </strong> <b>{{ arrayCrucesAnular.abono_documento }}</b></p>
                <p><strong>Valor del Cruce: </strong> <b>{{ arrayCrucesAnular.abono_facturas>0?arrayCrucesAnular.abono_facturas:arrayCrucesAnular.abono_notas>0?arrayCrucesAnular.abono_notas:0 }}</b></p>
            </div>
            <div align="center">
                <b style="color: red">Al anular el cruce, se eliminará la evidencia asociada.</b>
            </div>
            <p class="textRojo">Esta acción no se puede deshacer.</p>

            <div class="botones">
                <vs-button color="danger" type="relief" @click="AnularCompletoPromesa(arrayCrucesAnular);" :disabled="isLoadingAnular">
                    Anular Cruce
                </vs-button>
                <vs-button color="success" type="relief" @click="popupAnular = false;">
                    Cancelar
                </vs-button>
            </div>
        </div>
    </vs-popup>

</div>
</template>

<script>
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
const editarCruce = () => import('@/views/pedidos2/pedidos/cobranzas/cruceCuentas/editCuentasCruzadas.vue');
export default {
    components: {
        documentoVenta,
        editarCruce,
    },
    data() {
        return {
            arrayCruces: [],
            usuario: [],
            datosCliente: {},
            empresaCobranza: '',
            DocumentoDetalleVenta: [],
            DocumentoVenta: [],
            popupDocumento: false,
            popupEditar: false,
            arrayCrucesEdit: [],
            isLoading: false,
            arrayCrucesAnular: [],
            popupAnular: false,
            isLoadingAnular: false,
        };
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
        this.datosCliente = this.datos;
        this.empresaCobranza = this.empresa;
    },
    mounted() {
        let me = this;
        me.traerCruces();
    },
    props: {
        datos: {
            type: Object,
            default: function () {
                return {};
            }
        },
        empresa: {
            type: Object,
            default: function () {
                return {};
            }
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {};
            }
        },
        tipoListadoCruces: {
            type: String,
            default: '',
        },
    },
    methods: {
        getAnularCruce(datos) {
            let me = this;
            me.arrayCrucesAnular = [];

            me.arrayCrucesAnular = datos;
            me.popupAnular = true;
        },
        editadoCruce() {
            let me = this;
            this.$emit('editadoCruce')
        },
        CerrarEditCruce(e) {
            let me = this;
            if (e) {
                if (e == 'errorCodigo') {

                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al obtener el código del documento.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    me.popupEditar = false;

                } else if (e == 'guardado') {

                    me.traerCruces();
                    me.popupEditar = false;

                } else if (e == 'cancelar-guardado') {

                    this.$vs.notify({
                        title: 'Mensaje',
                        text: 'Se canceló la edicion del cruce.',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    me.popupEditar = false;

                } else if (e == 'error-guardado') {

                    me.popupEditar = false;

                }
            }

        },
        traerCruces() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'buscarCrucesCuentas?ruc=' + this.datosCliente.identificacion + '&empresa=' + this.empresaCobranza.id + '&periodo=' + this.periodoSelect.idperiodoescolar + '&tipo=' + this.tipoListadoCruces)
                .then(res => {
                    me.arrayCruces = res.data;
                    if (!(me.arrayCruces.length > 0)) {
                        this.$emit('editadoCruce', 'sin-datos')
                    }
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        getEditarCruce(documentos) {
            let me = this;
            me.arrayCrucesEdit = [];
            me.isLoading = true;
            me.arrayCrucesEdit = documentos;
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos.abono_documento +'&empresa=' + documentos.abono_empresa)
                .then((res) => {
                    me.DocumentoVenta = res.data;
                    if (me.DocumentoVenta.length > 0) {
                        let codigo = me.DocumentoVenta[0].ven_codigo;
                        let empresa = me.DocumentoVenta[0].empresa_id;
                        this.getCruceDetalles(codigo, empresa);
                        me.isLoading = false;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Documento no encontrado. Verificar documento.',
                            type: 'error',
                        });
                        me.isLoading = false;
                    }

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los documentos.',
                        type: 'error',
                    });
                    me.isLoading = false;
                    me.$vs.loading.close();
                });

        },
        getCruceDetalles(codigo, empresa) {
            let me = this;
            // console.log(codigo, empresa,'dsdsadsaddsa');
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
                .then((res) => {
                    this.DocumentoDetalleVenta = res.data;
                    if (this.DocumentoDetalleVenta.length > 0) {
                        this.popupEditar = true;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Detalle Documento no encontrado.',
                            type: 'error',
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los detalles de los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        getDocumentos(documentos, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos + '&empresa=' + empresa)
                .then((res) => {
                    me.DocumentoVenta = res.data;
                    if (me.DocumentoVenta.length > 0) {
                        let codigo = me.DocumentoVenta[0].ven_codigo;
                        let empresa = me.DocumentoVenta[0].empresa_id;
                        this.getDocumentosDetalles(codigo, empresa);
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Documento no encontrado. Verificar documento.',
                            type: 'error',
                        });
                    }

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        getDocumentosDetalles(codigo, empresa) {
            let me = this;
            // console.log(codigo, empresa,'dsdsadsaddsa');
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
                .then((res) => {
                    this.DocumentoDetalleVenta = res.data;
                    if (this.DocumentoDetalleVenta.length > 0) {
                        this.popupDocumento = true;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Detalle Documento no encontrado.',
                            type: 'error',
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los detalles de los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        async AnularCompletoPromesa(cruce) {
            let me = this;
            try {
                me.isLoadingAnular = true;
                me.$vs.loading();
                // Siempre se ejecuta este método
                await me.Anular(cruce);

                me.$vs.notify({
                    text: "Cruce anulada con éxito",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 7000,
                });
                me.traerCruces();
                me.$vs.loading.close();
                me.isLoadingAnular = false;
                this.popupAnular = false;
            } catch (error) {
                console.error('Error en metodo_GuardarCompletoPromesa:', error);
                me.$vs.loading.close();
                this.$vs.notify({
                    text: 'Se rechazó la promesa al anular el cruce.',
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-circle",
                });
                this.popupAnular = false;
            }
        },
        async Anular(cruce) {
            let me = this;
            return new Promise((resolve, reject) => {
                this.$http.post(this.$server_url + 'anularAbono?', {
                        abono_id: cruce.abono_id,
                        usuario: this.usuario.idusuario,
                        AnularCruce: 'yes',
                        abono_documento: cruce.abono_documento,
                        abono_periodo: cruce.abono_periodo,
                        abono_empresa: cruce.abono_empresa,
                    })
                    .then(res => {
                        resolve(); // Resuelve si no hay archivo.
                    })
                    .catch(error => {
                        console.error('Error al anular el cruce:', error);
                        this.$vs.notify({
                            text: 'Error al anular el cruce',
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-circle",
                        });
                        reject(error); // Rechaza la promesa si hay error
                    });
            });
        },        
    }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
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
