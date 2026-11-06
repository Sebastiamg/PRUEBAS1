<template>
    <div>
        <vs-alert style="height: 80px;">
            <p>Esta sección muestra las notas movidas a las pre facturas de este periodo.</p>
            <p>Del módulo de devoluciones (bodega)</p>
        </vs-alert>
        <vs-table max-items="10" stripe search pagination :data="arrayNotasMovidas">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arrayNotasMovidas.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Nota movida</vs-th>
                <vs-th>a Pre factura</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b>Nota:</b> <br>
                        {{data[indextr].ven_codigo}}<br>
                        <b>Empresa:</b>
                        <p>{{ tr.descripcion_empresa }}</p>
                        <b>Institucion:</b>
                        <p>{{ tr.nombreInstitucion }}</p>
                        <b>Cliente:</b>
                        <p>{{ tr.cliente }}</p>
                        <b>Cedula cliente:</b>
                        <p>{{ tr.cliente_cedula }}</p>
                    </vs-td>
                    <vs-td>
                      <b>Documento Intercambio:</b>
                      <p>{{ tr.doc_intercambio }}</p>
                      <b>Fecha intercambio:</b>
                      <p>{{ tr.fecha_intercambio }}</p>
                      <b>Usuario Intercambio:</b>
                      <p>{{ tr.usuarioIntercambio }}</p>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>


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
            let url = `prefactura_documentos?getNotasMovidas=1&periodo_id=${ me.periodoSelect.idperiodoescolar }`
            this.$http.get(this.$server_url+url)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.length ==  0){
                    me.m_message("No existen notas movidas para este periodo",'danger')
                    return
                }
                me.arrayNotasMovidas = res.data
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
    }
}
</script>
