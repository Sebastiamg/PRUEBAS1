<template>
    <div class="mt-10">
        <vs-button  class="ml-1" @click="editar=0;popupAsignar=true;">$ Asignar valores a Distribuidor</vs-button>
        <vs-table max-items="10" search pagination :data="arregloValores">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloValores.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Distribuidor</vs-th>
                <vs-th>Período</vs-th>
                <vs-th>Valores</vs-th>
                <vs-th  style="width:100px;">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].distribuidorUser}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].periodoescolar}}<br>
                    </vs-td>
                    <vs-td>
                        <b>Saldo inicial:</b>
                        <p>{{ tr.saldo_inicial }}</p>
                        <b>Saldo actual:</b>
                        <p>{{ tr.saldo_actual }}</p>
                        <b>Saldo pendiente Aprobar:</b>
                        <p>{{ tr.pendienteAprobar }}</p>
                        <b>Saldo Disponible:</b>
                        <p>{{ tr.saldo_actual  - tr.pendienteAprobar}}</p>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;">
                            <div>
                                <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="success" @click="editar=1;distribuidorSelect=tr;popupAsignar=true;" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                        </div>
                    </vs-td> 
                </vs-tr>
            </template>
        </vs-table>   
        <!--MODALES-->
        <vs-popup classContent="popup-example" title="Mantenimiento Valores Distribuidor" :active.sync="popupAsignar">
            <AsignarValorDistribuidorVue 
            v-if="popupAsignar"
            :editar="editar" 
            :usuario="usuario"
            :arregloDistribuidores="arregloDistribuidores"
            :distribuidorSelect="distribuidorSelect"
            @recharge=recharge
            />
        </vs-popup>
    </div>
</template>
<script>
import CrearDistribuidorVue from './CrearDistribuidor.vue';
import AsignarValorDistribuidorVue from './AsignarValorDistribuidor.vue';
export default{
    components:{ AsignarValorDistribuidorVue },
    data(){
        return{
            arregloValores:[],
            distribuidorSelect:'',
            popupAsignar:false,
            editar:0,
        }
    },
    props:{
        arregloDistribuidores:{
            type:Array,
            default:function(){
                return []
            }
        },
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
    },
    mounted(){
        let me = this;
        me.getValoresTemporada()
    },
    methods:{
        getValoresTemporada(){
            let me = this;
            me.$vs.loading()
            var url = ""
            url = this.$server_url + 'distribuidor?getDistribuidorTemporadas=yes'
            this.$http.get(url)
                .then(res => {
                    me.$vs.loading.close()
                    me.arregloValores = res.data
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        recharge(e){
            let me = this;
            me.popupAsignar = false
            me.getValoresTemporada()
        }
    }
}
</script>