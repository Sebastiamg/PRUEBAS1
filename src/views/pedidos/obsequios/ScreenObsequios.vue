<template>

    <vx-card>

        <div v-if="tipo != 0">

            <vs-button color="primary" type="border" @click="tipo = 0;getObsequios()">← Regresar</vs-button>

        </div>

        <div v-if="tipo == 1"><crearPedidoVue :userAdmin="userAdmin" :userAsesor="userAsesor" :userFacturador="userFacturador" :arregloPeriodo="arregloPeriodo" :periodo_id="periodo_id" @changeRecharge="changeRecharge" :id="id" :pedido="pedido"/></div>

        <div v-if="tipo == 0">

            <div class="flex items-center justify-between mb-3" style="flex-wrap: wrap; gap: 8px;">

                <vs-button class="btn_lg p-2 ml-1" @click="tipo = 1;id = 0; pedido={};" color="warning" type="line" icon-pack="feather" icon="icon-plus" icon-after>Solicitar obsequios</vs-button>

            </div>



            <div class="panel-tabs">

                <div class="tabs-header">

                    <button

                        :class="['tab-btn', tabActivo === 'listado' ? 'tab-btn-active' : '']"

                        @click="tabActivo = 'listado'"

                    >

                        <i class="fa-solid fa-list"></i> Listado de pedidos

                    </button>
<!-- 
                    <button

                        :class="['tab-btn', tabActivo === 'trazabilidad' ? 'tab-btn-active' : '']"

                        @click="tabActivo = 'trazabilidad'"

                    >

                        <i class="fa-solid fa-list-check"></i> Registro de Trazabilidad

                    </button> -->

                </div>



                <div class="tabs-content">

                    <div v-show="tabActivo === 'listado'" class="tab-panel">

                        <listadoObsequioVue :periodo_id="periodo_id" :arregloObsequios="arregloObsequios" @changeRecharge="changeRecharge" @changeEdit="changeEdit"/>

                    </div>

                    <div v-show="tabActivo === 'trazabilidad'" class="tab-panel">

                        <ObsequiosTrazabilidadVue :periodo_id="periodo_id" :userAdmin="userAdmin" :usuario="usuario"/>

                    </div>

                </div>

            </div>

        </div>

    </vx-card>

</template>

<script>

import crearPedidoVue from './asesor/mantenimiento/crearPedido.vue';

import listadoObsequioVue from './asesor/mantenimiento/listadoObsequio';

import ObsequiosTrazabilidadVue from './ObsequiosTrazabilidad.vue';



export default{

    data(){

        return{

            id:0,

            tipo:0,

            tabActivo: 'listado',

            periodo_id:0,

            usuario:[],

            arregloObsequios:[],

            arregloPeriodo:[],

            pedido:{},

            userAsesor:false,

            userAdmin:false,

            userFacturador:false,

        }

    },

    components:{

        crearPedidoVue,

        listadoObsequioVue,

        ObsequiosTrazabilidadVue,

    },

    created(){

        let me = this;

        me.usuario = JSON.parse(localStorage.getItem("usuario"))

    },

    mounted(){

        let me = this;

        me.periodo_id = me.$route.params.id

        me.getObsequios();

        me.getInfoPeriodo();

        if(me.usuario.id_group == 1) { me.userAdmin = true }

        if(me.usuario.id_group == 11) { me.userAsesor = true }

        if(me.usuario.id_group == 22 || me.usuario.id_group == 23){ me.userFacturador = true }

    },

    methods:{

        changeEdit(e){

            let me      = this;

            me.pedido   = {}

            me.id       = e.id

            me.pedido   = e

            me.tipo     = 1

        },

        changeRecharge(e){

            let me  = this;

            me.tipo = 0

            me.getObsequios()

        },

        getObsequios() {

            let me = this;

            me.$vs.loading();

            this.$http.get(this.$server_url+'obsequio?listadoObsequioAsesor=yes&periodo_id='+me.periodo_id)

                .then(function (res) {

                    let datos = res.data

                    if(datos.length > 0){

                      if(me.userAdmin){

                        me.arregloObsequios = datos

                      }else{

                        me.arregloObsequios = datos.filter(p => p.asesor_id == me.usuario.idusuario)

                      }

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

        getInfoPeriodo(){

            let me = this;

            this.$http.get(this.$server_url+'periodo/'+me.periodo_id)

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

