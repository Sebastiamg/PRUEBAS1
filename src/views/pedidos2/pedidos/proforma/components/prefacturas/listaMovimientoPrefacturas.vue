<template>
<div>
    <vs-alert color="danger" icon="warning">
        <p>Esta sección muestra los <b>documentos transferidos de los saldos de pre facturas a una nota</b> de este periodo <b>{{ periodoSelect.periodoescolar }}</b>. </p>
    </vs-alert>
    <vs-table max-items="10" stripe search pagination :data="arrayPrefacturasMovidas">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ arrayPrefacturasMovidas.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th width="500">Movimientos Detalles</vs-th>
            <vs-th width="260">Documentos Transferidos</vs-th>
            <vs-th width="50">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    <b>Documento Intercambio:</b> <br>
                    <!-- <b class="text-danger">{{ tr.ven_codigo_intercambio }}</b> <br> -->
                    <vs-button color="danger" type="flat" @click="getDocumentos(tr.ven_codigo_intercambio,tr.empresa_id)">
                        <b> {{ tr.ven_codigo_intercambio }} </b><i class="fa-regular fa-eye"></i>
                    </vs-button> <br>
                    <b>Empresa:</b>
                    <p>{{ tr.empresa_id == 1 ? 'Prolipa' : 'Calmed' }}</p>
                    <b>Institución:</b>
                    <p>{{ tr.nombreInstitucion }}</p>
                    <b>Cliente:</b>
                    <p>{{ tr.cliente }}</p>
                    <b>Cédula cliente:</b>
                    <p>{{ tr.cedula }}</p>
                </vs-td>
                <vs-td>
                    <!-- <div class="overflow-y-auto" style="max-height: 200px;">
                        <div v-for="(codigo, index) in tr.ven_codigos_originales" :key="index">
                            {{ codigo }}
                        </div>
                    </div> -->
                    <div class="overflow-y-auto" style="max-height: 200px;">
                        <vs-table search :data="tr.ven_codigos_originales">
                            <template slot-scope="{ data }">
                                <vs-tr v-for="(codigo, index) in tr.ven_codigos_originales" :key="index">
                                    <vs-td>
                                        <vs-button size="small" color="primary" type="flat" @click="getDocumentos(codigo, tr.empresa_id)">
                                            <b>{{ codigo }}</b> <i class="fa-regular fa-eye"></i>
                                        </vs-button>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-td>
                <vs-td>
                    <!--boton para mostrar detalles-->
                    <vx-tooltip text="Haz clic para ver más detalles" position="top" color="danger">
                        <vs-button color="#5aa0f5" type="filled" @click="ObjectSeleted=tr; get_MostrarDetalles();">
                            <i class="fa-solid fa-window-restore"></i> Ver Detalles
                        </vs-button>
                    </vx-tooltip>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!--modales-->
    <vs-popup classContent="popup-example" fullscreen title="Editar Area" :active.sync="popupMostrarDetalles">
        <div v-if="popupMostrarDetalles">
            <b>Institucion:</b> {{ObjectSeleted.nombreInstitucion}}<br>
            <!-- <b>Nota:</b> {{ObjectSeleted.ven_codigo_original}}<br>
            <b>a Pre factura:</b> {{ObjectSeleted.nueva_prefactura}}<br> -->
            <b>Empresa:</b> {{ObjectSeleted.empresa_id == 1 ? 'Prolipa' : 'Calmed'}}<br><br>
            <TableReutilizableVue :title="'Detalles'" 
            :headers="['Producto','Documento','Cantidad Despachada', 'Documento Intercambio','Cantidad Intercambio','Fecha']" 
            :fieldKeys="['pro_codigo', 'ven_codigo_original', 'cantidad_original', 'ven_codigo_intercambio', 'cantidad_intercambio', 'fecha_intercambio']"
            :ifexportar="Number(1)" :tableData="arrayDetalles" />
        </div>
    </vs-popup>
    <!-- DOCUMENTO IMPRESION -->
    <vs-popup fullscreen v-if="popupDocumento" :title="'Detalle:'" :active.sync="popupDocumento" class="popopPadre">
        <div v-if="popupDocumento">
            <documentoVenta :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta" />
        </div>
    </vs-popup>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import Generalmix from '../../../../../../mixins/Generalmix'
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
export default {
    components: {
        TableReutilizableVue,
        documentoVenta,
    },
    mixins: [Generalmix],
    data() {
        return {
            arrayPrefacturasMovidas: [],
            arrayTodos: [],
            arrayDetalles: [],
            ObjectSeleted: '',
            popupMostrarDetalles: false,

            //ver documentos
            DocumentoVenta: [],
            DocumentoDetalleVenta: [],
            popupDocumento: false,
        }
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted() {
        this.getPrefacturasMovidas()
    },

    methods: {
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
                            text: 'Documento no encontrado.',
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
        getPrefacturasMovidas() {
            let me = this
            me.arrayPrefacturasMovidas = []
            me.arrayTodos = []
            me.$vs.loading()
            let url = `prefactura_documentos?getPrefacturasMovidas=1&periodo_id=${ me.periodoSelect.idperiodoescolar }`
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.todas.length == 0) {
                        me.m_message("No existen conversiones de saldos en prefacturas para este periodo", 'danger')
                        return
                    }
                    me.arrayPrefacturasMovidas = res.data.prefacturas
                    me.arrayTodos = res.data.todas
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        get_MostrarDetalles() {
            let me = this;
            me.arrayDetalles = [];

            // Filtra todos los registros con el mismo ven_codigo_intercambio
            me.arrayDetalles = me.arrayTodos.filter(p =>
                p.ven_codigo_intercambio === me.ObjectSeleted.ven_codigo_intercambio
            );

            me.popupMostrarDetalles = true;
        }
    }
}
</script>
