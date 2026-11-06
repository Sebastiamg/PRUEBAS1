<template>
    <div>
        <div v-if="menu == 1">
            <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
            <DevolucionGuiasVue :pedido="pedido" @recharge="changeRecharge"/>
        </div>
        <vs-table v-if="menu == 0" max-items="10" stripe search pagination :data="arregloEntregas">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: {{ arregloEntregas.length }}</vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Institución</vs-th>
                <vs-th>Período</vs-th>
                <vs-th>Entregas</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombreInstitucion}}<br>
                        <small>{{ tr.ciudad }}</small>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].periodo}}<br>
                    </vs-td>
                    <vs-td>
                        <div v-for="(item,key2) in tr.entregas" :key="key2">
                            <p>{{ item.nombrelibro }}</p>
                            <p>Stock: {{ item.pro_stock }}</p>
                            <div class="flex">
                                <span><b>Cantidad guias que tiene la escuela:</b></span>
                                <p><vs-chip size="small" class="ml-1" style="margin-top: -2px;" transparent color="success">{{ item.cantidad_entregada -  item.devolucion }}</vs-chip></p>
                            </div>
                            <div class="mt-1">
                                <!--HISTORIAL-->
                                <vx-tooltip style="display: inline-block;" text="Historial de entregas y devoluciones" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="success" @click="devolucion=item;popupHistorico=true;" type="filled" icon-pack="feather" icon="icon-shield"> Historial</vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                            <vs-divider></vs-divider>
                        </div>
                    </vs-td>
                    <vs-td>
                        <div class="flex" style="flex-direction: column;">
                            <!--IMPRIMIR PDF-->
                            <vx-tooltip style="display: inline-block;" text="Imprimir reporte" position="top" color="primary">
                                <vs-button class="modal-default-button" size="small" color="dark" @click="tipo = 1;pedido = tr;ImprimirActa(tr)" type="filled" icon-pack="feather" icon="icon-printer"> Imprimir pdf</vs-button>
                            </vx-tooltip> &nbsp;
                            <!--IMPRIMIR WORD-->
                            <vx-tooltip style="display: inline-block;" text="Imprimir reporte" position="top" color="primary">
                                <vs-button class="modal-default-button" size="small" color="primary" @click="tipo = 0;pedido = tr;ImprimirActa(tr)" type="filled" icon-pack="feather" icon="icon-printer"> Imprimir word</vs-button>
                            </vx-tooltip> &nbsp;
                            <!--DEVOLVER-->
                            <vx-tooltip style="display: inline-block;" text="La escuela devuelve las guias" position="top" color="dark">
                                <vs-button class="modal-default-button" size="small" color="warning" type="filled" icon-pack="feather" @click="pedido =tr;menu = 1;" icon="icon-corner-down-left"> Devolver guias</vs-button>
                            </vx-tooltip> &nbsp;
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--MODAL CARGAR-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
            <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
            <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
        </vs-popup>
        <!--EXPORTAR ACTA ASESOR - ESCUELA-->
        <div style="display: none;"  v-if="mostrarImprimirActa">
            <exportActaGuiasEntregaEscuelaVue :pedido = "pedido" :tipo="tipo" @change="changeHandle"/>
        </div>  
        <!--DEVOLUCION-->
        <vs-popup class="holamundo" :title="'Devolución de guias del libro ' +devolucion.nombrelibro" :active.sync="popupDevolucionEscuela">
             <!-- currency -->
            <vx-input-group class="mb-base">
                <template slot="prepend">
                <div class="prepend-text bg-primary">
                    <span>Cantidad a devolver</span>
                </div>
                </template>
                <vs-input v-model="cantidad_devolucion" :max="devolucion.cantidad_entregada - devolucion.devolucion" type="number" />
                <template slot="append">
                <div class="append-text bg-primary">
                    <span>Máximo a devolver {{ parseInt(devolucion.cantidad_entregada) - parseInt(devolucion.devolucion) }}</span>
                </div>
                </template>
            </vx-input-group>
            <div class="flex justify-center">
                <vs-button color="success"  type="gradient" @click="guardarDevolucionEscuela()">Guardar</vs-button>

            </div>
            <!-- /currency -->
        </vs-popup>
        <!--HISTORICO-->
        <vs-popup class="holamundo" fullscreen :title="'Historico del libro ' +devolucion.nombrelibro" :active.sync="popupHistorico">
            <HistoricoEntregasVue v-if="popupHistorico" :devolucion="devolucion"/>
        </vs-popup>
    </div>
</template>
<script>
import exportActaGuiasEntregaEscuelaVue from '../../../../temporadas/components/exportActaGuiasEntregaEscuela.vue';
import HistoricoEntregasVue from './components/HistoricoEntregas.vue';
import DevolucionGuiasVue from './DevolucionGuias.vue';
export default{
    data(){
        return{
            usuario:[],
            arregloEntregas:[],
            pedido:{},
            devolucion:{},
            mostrarImprimirActa:false,
            popupCarga:false,
            popupHistorico:false,
            popupDevolucionEscuela:false,
            cantidad_devolucion:'',
            limiteDevolver:'',
            menu:0,
        }
    },
    components:{
        exportActaGuiasEntregaEscuelaVue,
        HistoricoEntregasVue,
        DevolucionGuiasVue,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getEntregas()
    },
    methods:{
        changeHandle(e) {
            let me                  = this;
            me.popupCarga           = false
            me.mostrarImprimirActa  = false
        },
        changeRecharge(e){
            let me = this;
            me.menu = 0
            me.getEntregas()
        },
        ImprimirActa(){
            let me                  = this;
            me.popupCarga           = true
            me.mostrarImprimirActa  = true
        },
        getEntregas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getEntregasGuias?asesor_id='+me.usuario.idusuario)
                .then(function (res) {
                    me.arregloEntregas = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        guardarDevolucionEscuela(){
            let me = this
            if(me.cantidad_devolucion > me.limiteDevolver){
                me.$vs.notify({
                text:'No tiene suficiente cantidad para devolver',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.cantidad_devolucion < 1){
                me.$vs.notify({
                text:'No se puede devolver un valor menor a cero',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            let formData = new FormData();
            formData.append('cantidad',                 me.cantidad_devolucion);
            formData.append('pro_codigo',               me.devolucion.pro_codigo);
            formData.append('asesor_id',                me.usuario.idusuario);
            formData.append('pedidos_guias_entrega_id', me.devolucion.pedidos_guias_entrega_id)
            //tipo 1 = resta; 0 = suma
            formData.append('tipo',                 0)
            me.$vs.loading()
            this.$http.post(this.$server_url+'saveDevolucionEscuela', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                }) 
                me.popupDevolucionEscuela = false;
                me.devolucion = {}
                me.cantidad_devolucion = 0
                me.getEntregas()
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
    }
}
</script>