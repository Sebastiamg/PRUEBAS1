<template>
    <div>
        <div>
            <div v-if="tipo != 0">
                <vs-button color="primary" type="border" @click="tipo = 0;getObsequios()">← Regresar</vs-button>
            </div>
            <div v-if="tipo == 1"><crearPedidoVue :arregloPeriodo="arregloPeriodo"  @changeRecharge="changeRecharge" :id="id" :periodo_id="pedido.periodo_id"  :pedido="pedido"/></div>
            <div v-if="tipo == 0">
                <vs-button class="btn_lg p-2 ml-1" @click="tipo = 1;id = 0; pedido={};" color="warning" type="line" icon-pack="feather" icon="icon-plus" icon-after>Solicitar obsequios</vs-button>

                <div class="panel-tabs mt-3">
                    <div class="tabs-header">
                        <button
                            :class="['tab-btn', tabActivo === 'listado' ? 'tab-btn-active' : '']"
                            @click="tabActivo = 'listado'"
                        >
                            <i class="fa-solid fa-list"></i> Listado de obsequios
                        </button>
                        <!-- <button
                            :class="['tab-btn', tabActivo === 'trazabilidad' ? 'tab-btn-active' : '']"
                            @click="tabActivo = 'trazabilidad'"
                        >
                            <i class="fa-solid fa-list-check"></i> Registro de Trazabilidad
                        </button> -->
                    </div>

                    <div class="tabs-content">
                        <div v-show="tabActivo === 'listado'" class="tab-panel">
                            <listadoObsequioVue :arregloObsequios="arregloObsequios" @changeRecharge="changeRecharge" @changeAutorizar="changeAutorizar" @changeEdit="changeEdit"/>
                        </div>
                        <div v-show="tabActivo === 'trazabilidad'" class="tab-panel">
                            <ObsequiosTrazabilidadVue :obsequiosData="arregloObsequios" :userAdmin="true"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import crearPedidoVue from './asesor/mantenimiento/crearPedido.vue';
import listadoObsequioVue from './asesor/mantenimiento/listadoObsequio';
import ObsequiosTrazabilidadVue from './ObsequiosTrazabilidad.vue';
export default{
    data(){
        return{
            tipo:0,
            tabActivo: 'listado',
            id:0,
            arregloObsequios:[],
            arregloPeriodo:{},
            pedido:{},
        }
    },
    components:{
        listadoObsequioVue,
        crearPedidoVue,
        ObsequiosTrazabilidadVue,
    },
    mounted(){
        let me = this;
        me.getObsequios()
    },
    methods:{
        changeEdit(e){
            let me      = this;
            me.pedido   = {}
            me.pedido   = e
            me.id       = e.id
            me.tipo     = 1
        },
        changeAutorizar(e){
            let me = this;
            me.pedido   = {}
            me.id       = e.id
            me.pedido   = e
            me.TypechangeEstado()
        },
        changeRecharge(e){
            let me  = this;
            me.tipo = 0
            me.getObsequios()
        },
        getObsequios() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'obsequio?listadoObsequiofacturador=yes')
                .then(function (res) {
                    let datos = res.data
                    if(datos.length > 0){
                        me.arregloObsequios = datos.filter( p => p.pedido_facturacion == 1 )
                    }else{
                        me.arregloObsequios = []
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        //AUTORIZAR GERENCIA
        TypechangeEstado(){
            let me = this
            let formData = new FormData();
            formData.append('id',                       me.pedido.id);
            formData.append('estado',                   5);
            me.$vs.loading()
            this.$http.post(this.$server_url+'changeEstadoObsequio', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                me.getObsequios()
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                })
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        //FIN AUTORIZAR GERENCIA
        getInfoPeriodo(){
            let me = this;
            console.log("rock2222")
            me.arregloPeriodo = ''
            this.$http.get(this.$server_url+'periodo/'+me.pedido.periodo_id)
                .then(function (res) {
                    me.arregloPeriodo = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        }
    }
}
</script>

<style scoped>
.panel-tabs {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    overflow: hidden;
}

.tabs-header {
    display: flex;
    border-bottom: 2px solid #e2e8f0;
    background: #f8fafc;
}

.tab-btn {
    flex: 1;
    padding: 14px 20px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tab-btn:hover {
    color: #334155;
    background: #f1f5f9;
}

.tab-btn-active {
    color: #046AE7;
    background: #ffffff;
    border-bottom-color: #046AE7;
}

.tab-btn i {
    font-size: 14px;
}

.tabs-content {
    padding: 20px;
}

.tab-panel {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
