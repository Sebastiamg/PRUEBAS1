<template>
<vx-card fixed-height="true">
    <vs-row>
        <!-- {{DocumentosSoloEnviados}} -->
        <vs-divider>Lista de documentos enviados</vs-divider>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-table search :data="DocumentosSoloEnviados" :max-items="DocumentosSoloEnviados.length" stripe no-data-text="No hay documentos para aplicar retencion">
                        <template slot="thead">
                            <vs-th>Datos documento</vs-th>
                            <vs-th>Datos cliente</vs-th>
                            <vs-th>Acción</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr :key="index" v-for="(item, index) in data">
                                <vs-td>
                                    <small><b>Documento:</b> {{item.id_factura}} </small><br>
                                    <small><b>Nombres:</b> {{item.nombre}}</small><br>
                                    <small><b>Items:</b> {{item.item}}</small><br>
                                    <small><b>Libros:</b> {{item.libros}}</small><br>
                                    <small><b>Valor:</b> ${{item.ven_valor}}</small><br>
                                </vs-td>
                                <vs-td>
                                    <small><b>Institución:</b> {{item.nombreInstitucion}} </small><br>
                                    <small><b>Dirección:</b> {{item.direccionInstitucion}}</small><br>
                                    <small><b>Cédula cliente:</b> {{item.cedula}}</small><br>
                                    <small><b>Nombre cliente:</b> {{item.nombres}} {{item.apellidos}}</small>
                                </vs-td>
                                <vs-td align="center">
                                    <div>
                                        <div>
                                            <vx-tooltip style="display: inline-block;" text="Click" position="top" color="primary">
                                                <vs-button class="modal-default-button" size="small" color="success" type="filled" @click="seleccionCantidad(item)" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                                            </vx-tooltip> &nbsp;
                                        </div>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <br>
    <br>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            DocumentosSoloEnviadosTemp: [],
            DocumentosSoloEnviados: [],
            VerificacionDocumentosAplicadosRetención: [],
        };
    },
    components: {
        "v-select": vSelect,
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
        me.getDocumentosSoloEnviados();
        console.log(me.datos, "heyy");
        console.log(me.empresa, "heyy");
    },
    methods: {
        seleccionCantidad(tr) {
            this.$emit('change', {
                verificarretenciondocumentos: tr,
            });
        },
        getDocumentosSoloEnviados() {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + 'GetFacturasxAgrupa_SoloEnviados', {
                    params: {
                        identificacion: me.datos.identificacion,
                        id_empresa: me.empresa.id,
                    },
                })
                .then(res => {
                    this.DocumentosSoloEnviadosTemp = res.data;
                    // Llama al segundo método para obtener las referencias y filtrar los resultados
                    this.getVerificacionDocumentosAplicadoARetencion();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },

        getVerificacionDocumentosAplicadoARetencion() {
            let me = this;
            this.$http
                .get(this.$server_url + 'GetVerificacionAbonoDocumento', {
                    params: {
                        identificacion: me.datos.identificacion,
                        id_empresa: me.empresa.id,
                    },
                })
                .then(res => {
                    const referencias = res.data.map(item => {
                        return {
                            referencia_retencion_factura: item.referencia_retencion_factura,
                            abono_estado: item.abono_estado
                        };
                    });

                    // Filtra DocumentosSoloEnviados eliminando coincidencias y validando abono_estado
                    this.DocumentosSoloEnviados = this.DocumentosSoloEnviadosTemp.filter(documento => {
                        // Filtra todas las coincidencias de la referencia
                        const matches = referencias.filter(ref => ref.referencia_retencion_factura == documento.id_factura);

                        // Si existe alguna coincidencia con abono_estado == 0, excluimos ese documento
                        const hasEstadoCero = matches.some(ref => ref.abono_estado == 0);

                        // Solo incluir el documento si no hay coincidencias con abono_estado == 0
                        return !hasEstadoCero;
                    });

                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
    },
};
</script>
