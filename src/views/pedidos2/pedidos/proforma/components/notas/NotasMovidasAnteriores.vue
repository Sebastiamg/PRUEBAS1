<template>
    <div>
        <vs-alert style="height: 80px;">
            <p>Esta sección muestra las notas movidas anteriores a las pre facturas de este periodo. (Módulo anterior)</p>
            <p>Del módulo de devoluciones (bodega)</p>
        </vs-alert>
        <vs-table max-items="10" stripe search pagination :data="arrayNotasMovidas">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arrayNotasMovidas.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Nota movida</vs-th>
                <vs-th>a Pre factura</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Documento Intercambio:</b> <br>
                        <!-- <b class="text-danger">{{ tr.ven_codigo_intercambio }}</b> <br> -->
                        <vs-button color="danger" type="flat" @click="getDocumentos(tr.origen,tr.id_empresa)">
                            <b> {{ tr.origen }} </b><i class="fa-regular fa-eye"></i>
                        </vs-button> <br>
                        {{data[indextr].origen}}<br>
                        <b>Empresa:</b>
                        <p>{{ tr.id_empresa == 1 || tr.id_empresa == 6 ? 'Prolipa' : 'Calmed' }}</p>
                        <b>Institucion:</b>
                        <p>{{ tr.nombreInstitucion }}</p>
                        <b>Cliente:</b>
                        <p>{{ tr.cliente }}</p>
                        <b>Cedula cliente:</b>
                        <p>{{ tr.cedula }}</p>
                    </vs-td>

                    <vs-td class="text-center">
                        <vs-button color="primary" type="flat" @click="getDocumentos(tr.nueva_prefactura, tr.id_empresa)" class="mb-2">
                            <b>{{ tr.nueva_prefactura }} </b> <i class="fa-regular fa-eye"></i>
                        </vs-button><br>

                        <b class="mb-1">Empresa: {{ tr.id_empresa == 1 || tr.id_empresa == 6 ? 'Prolipa' : 'Calmed' }}</b>
                    </vs-td>

                    <vs-td>
                       <!--boton para mostrar detalles-->
                        <vs-button color="#6ebac5" @click="ObjectSeleted=tr;get_MostrarDetalles();"><i class="fa-solid fa-circle-info"></i> Mostrar Detalles</vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--modales-->
        <vs-popup classContent="popup-example" fullscreen title="Editar Area" :active.sync="popupMostrarDetalles">
            <div v-if="popupMostrarDetalles">
                <b>Institucion:</b> {{ObjectSeleted.nombreInstitucion}}<br>
                <b>Nota:</b> {{ObjectSeleted.origen}}<br>
                <b>a Pre factura:</b> {{ObjectSeleted.nueva_prefactura}}<br>
                <b>Empresa:</b> {{ObjectSeleted.id_empresa == 1 || ObjectSeleted.id_empresa == 6 ? 'Prolipa' : 'Calmed'}}<br><br>
                <TableReutilizableVue
                    :title="'Detalles'"
                    :headers="['Producto','Cantidad','Fecha','Observacion']"
                    :fieldKeys="['descripcion','cantidad','created_at','observacion']"
                    :ifexportar="Number(1)"
                    :tableData="arrayDetalles"
                />
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
const TableReutilizableVue              = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
export default{
    components:{
        TableReutilizableVue,
        documentoVenta,
    },
    mixins:[Generalmix],
    data(){
        return{
            arrayNotasMovidas:[],
            arrayTodos:[],
            popupMostrarDetalles:false,
            arrayDetalles:[],
            ObjectSeleted:'',

            //ver documentos
            DocumentoVenta: [],
            DocumentoDetalleVenta: [],
            popupDocumento: false,

        }
    },
    props:{
        periodoSelect:{
            type:Object,
            default:function(){
                return{}
            }
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted(){
        this.getNotasMovidas()
    },

    methods:{
        getNotasMovidas(){
            let me = this
            me.arrayNotasMovidas = []
            me.arrayTodos        = []
            me.$vs.loading()
            let url = `prefactura_documentos?notasMovidasAnteriores=1&periodo_id=${ me.periodoSelect.idperiodoescolar }`
            this.$http.get(this.$server_url+url)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.todas.length ==  0){
                    me.m_message("No existen notas movidas anteriores para este periodo",'danger')
                    return
                }
                me.arrayNotasMovidas = res.data.notas
                me.arrayTodos        = res.data.todas
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        get_MostrarDetalles(){
            let me = this
            me.arrayDetalles = []
            this.arrayDetalles = me.arrayTodos.filter(p => p.origen == this.ObjectSeleted.origen && p.nueva_prefactura == this.ObjectSeleted.nueva_prefactura)
            this.popupMostrarDetalles = true
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
    }
}
</script>
