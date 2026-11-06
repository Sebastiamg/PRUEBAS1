<template>
    <div class="mt-10">
        <vs-button  class="ml-1" icon="add" @click="editar=0;popupCrear=true;">Crear Distribuidor</vs-button>
        <vs-table max-items="10" search pagination :data="arregloDistribuidores">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloDistribuidores.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Distribuidor</vs-th>
                <vs-th>Fecha creación</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th  style="width:100px;">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].distribuidorUser}}<br>
                        
                    </vs-td>
                    <vs-td>
                        {{data[indextr].created_at}}<br>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Inactivo</vs-chip>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;">
                            <div>
                                <vx-tooltip style="display: inline-block;" text="Editar Distribuidor" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="success" @click="editar=1;distribuidorSelect=tr;popupCrear=true;" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                        </div>
                    </vs-td> 
                </vs-tr>
            </template>
        </vs-table>   
        <!--MODALES-->
        <vs-popup classContent="popup-example" title="Mantenimiento Distribuidor" :active.sync="popupCrear">
            <CrearDistribuidorVue 
            v-if="popupCrear"
            :editar="editar" 
            :usuario="usuario"
            :distribuidorSelect="distribuidorSelect"
            @recharge=recharge
            />
        </vs-popup>
    </div>
</template>
<script>
import CrearDistribuidorVue from './CrearDistribuidor.vue';
export default{
    components:{CrearDistribuidorVue},
    data(){
        return{
            distribuidorSelect:'',
            popupCrear:false,
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
    methods:{
        recharge(e){
            let me = this;
            me.popupCrear = false;
            me.$emit('recharge',e)
        },
    }
}
</script>