<template>
    <div>
        <vx-card
        title="Busqueda por contratos (Pedidos)"
        title-color="primary"
        >
            <div style="display:flex;margin-left:20px;">
                <div>
                    <vs-input icon="search" @keyup.enter="getInformacionLiquidacion()" placeholder="Buscar Contrato" v-model ="contrato"/>
                </div>
                <div>
                    <vs-button radius color="primary" @click="getInformacionLiquidacion()" type="border" style="margin-left:10px;" icon="search"></vs-button>
                </div>  
            </div>
            <vs-divider></vs-divider>
            <vs-table max-items="10" search stripe pagination :data="arrayContratos">
                <template slot="header">
                    <small>Cantidad :{{ arrayContratos.length }}</small>
                </template>
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th sort-key="asesor">Tipo de venta</vs-th>
                    <vs-th sort-key="asesor">Asesor</vs-th>
                    <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                    <vs-th>Venta bruta</vs-th>
                    <vs-th>Contrato generado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td> {{ indextr+1 }} </vs-td>
                        <vs-td>{{tr.tipo_venta_descr}}</vs-td>
                        <vs-td> {{ tr.asesor }} </vs-td>
                        <vs-td> {{ tr.nombreInstitucion }} <br>
                            Ciudad:
                            <span>{{tr.nombre_ciudad}}</span>
                        </vs-td>
                        <vs-td> {{ tr.total_venta }} </vs-td>
                        <vs-td> 
                            <p class="font-bold">Contrato:</p>
                            <span>{{ tr.contrato_generado }} </span>
                            <label v-if="tr.contrato_generado == null">
                            </label>
                            <label v-else> 
                                <p>
                                    <vs-chip v-if="tr.estado_entrega == 1" color="primary">
                                    Entregado
                                    </vs-chip>
                                    <vs-chip v-else color="warning">
                                    Generado
                                    </vs-chip>
                                </p>
                            </label>
                            <p>
                                <vs-chip v-if="tr.estado == 1">
                                Activo
                                </vs-chip>
                                <vs-chip v-else color="danger">
                                Anulado
                                </vs-chip>
                            </p>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip style="display: inline-block;" text="Detalles del contrato" position="top" color="dark">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="id_pedido = tr.id_pedido;id_periodo=tr.id_periodo;periodo=tr.periodo;contrato=tr.contrato_generado;datos=tr;popupDetalles=true;" color="dark" type="line"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
        <!--MODALES-->
        <!--MODAL PARA VER DETALLES-->
        <vs-popup class="holamundo" fullscreen :title="('Detalles del contrato: '+contrato)" :active.sync="popupDetalles" @close="recargar()" @cancel="recargar()">
            <pedidosDetalleVue
            :id_pedido="id_pedido"
            :id_periodo="id_periodo"
            :nombre_periodo="periodo"
            :datos="datos"
            v-if="popupDetalles"
            />
        </vs-popup>
    </div>
</template>
<script>
import pedidosDetalleVue from './components/pedidosDetalle.vue';
export default{
    data(){
        return{
            arrayContratos:[],
            datos:{},
            popupDetalles:false,
            id_pedido:0,
            periodo:'',
            contrato:'',
        }
    },
    methods:{
        recargar(){
            let me = this;
            me.getInformacionLiquidacion();
        },
        getInformacionLiquidacion() {
            let me = this;
            me.arrayContratos = [];
            if(me.contrato == ""){
                me.$vs.notify({
                        text: "Ingrese un contrato por favor",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                return false;
            }
            if(me.contrato.length < 4){
                me.$vs.notify({
                        text: "Minimo 4 caracteres",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                return false;
            }
            me.$vs.loading();
            this.$http.get(this.$server_url+'get_pedidos_periodoxContrato/'+me.contrato)
                .then(function (res) {       
                    me.arrayContratos = res.data
                    me.$vs.loading.close()
                    if(res.data.length == 0){
                        me.$vs.notify({
                        text: 'No hay contratos con ese nombre de contrato',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-user'
                        })
                    }
                })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
         },
    },
    components:{
        pedidosDetalleVue,
    }
}
</script>