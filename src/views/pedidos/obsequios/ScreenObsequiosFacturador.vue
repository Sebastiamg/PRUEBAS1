<template>
    <div>
        <div class="flex mt-5">
            <div style="width: 40%;">
                <p> <ion-icon name="contract-outline"></ion-icon>  Filtro de pedidos por periodos</p>
            </div>
            <div style="width: 60%;" class="flex">
                <!-- idperiodoescolar -->
                <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                <vx-tooltip text="Recargar periodos y obsequios" position="top" color="primary">
                    <vs-button class="ml-2" color="primary" type="filled" icon="refresh" @click="recargarDatos"></vs-button>
                </vx-tooltip>
            </div>
        </div>
        <vs-divider>
            <vs-button color="warning" v-if="changePeriodo == false" type="flat" icon="star">Ningun período Seleccionado</vs-button>
            <vs-button  v-else color="success" type="flat" icon="star">Periodo seleccionado: <b>{{ periodoSelect.periodoescolar }}</b></vs-button>
        </vs-divider>
        <div v-if="changePeriodo">
            <div v-if="tipo != 0">
                <vs-button color="primary" type="border" @click="tipo = 0;getObsequios()">← Regresar</vs-button>
            </div>
            <div v-if="tipo == 1"><crearPedidoVue :userRoot="userRoot" :userAdmin="userAdmin" :userAsesor="userAsesor" :userFacturador="userFacturador" :arregloPeriodo="arregloPeriodo" :periodo_id="periodoSelect.idperiodoescolar" @changeRecharge="changeRecharge" :id="id" :pedido="pedido"/></div>
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
                        <button
                            v-if="!userAsesor"
                            :class="['tab-btn', tabActivo === 'trazabilidad' ? 'tab-btn-active' : '']"
                            @click="tabActivo = 'trazabilidad'"
                        >
                            <i class="fa-solid fa-list-check"></i> Registro de Trazabilidad
                        </button>
                    </div>

                    <div class="tabs-content">
                        <div v-show="tabActivo === 'listado'" class="tab-panel">
                            <listadoObsequioVue :userRoot="userRoot" :userAdmin="userAdmin" :periodo_id="periodoSelect.idperiodoescolar" :arregloObsequios="arregloObsequios" @changeRecharge="changeRecharge" @changeEdit="changeEdit"/>
                        </div>
                        <div v-show="tabActivo === 'trazabilidad'" class="tab-panel">
                            <ObsequiosTrazabilidadVue
                                :periodo_id="periodoSelect.idperiodoescolar"
                                :userAdmin="userAdmin || userFacturador || userRoot"
                                :userAsesor="userAsesor"
                                :usuario="usuario"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br><br><br>
    </div>
</template>
<script>
import { mapState } from "vuex";
import vSelect from 'vue-select';
import crearPedidoVue from './asesor/mantenimiento/crearPedido.vue';
import listadoObsequioVue from './asesor/mantenimiento/listadoObsequio';
import ObsequiosTrazabilidadVue from './ObsequiosTrazabilidad.vue';
export default{
    components:{
        crearPedidoVue,
        listadoObsequioVue,
        ObsequiosTrazabilidadVue,
        vSelect,
    },
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
            periodoSelect:'',
            changePeriodo:false,
            userAdmin:false,
            userFacturador:false,
        }
    },
    watch:{
        periodoSelect(results){
            let me = this;
            if(results == null || results == null || results == undefined){
                me.changePeriodo = false
                localStorage.removeItem('oid')
                localStorage.removeItem('onombre')
            }else{
                me.changePeriodo = true
                localStorage.setItem('oid',    results.idperiodoescolar)
                localStorage.setItem('onombre',results.periodoescolar)
                me.getObsequios()
                me.getInfoPeriodo()
            }
        }
    },
    props:{
        arregloPeriodos:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    computed: {
      ...mapState(["auth", "userRoot", "susuario", "groupFacturador", "groupBodega","userAsesor","ObjectGuia"]),
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.getObsequios();
        //mantener el periodo seleccionado aunque recarge la pagina
        let searchPeriodoActive = localStorage.oid
        let searchPeriodoName   = localStorage.onombre
        if(searchPeriodoActive){
        me.periodoSelect = { idperiodoescolar:searchPeriodoActive, periodoescolar:searchPeriodoName }
        }
        if(me.usuario.id_group == 1) { me.userAdmin = true }
        //user facturador
        if(me.usuario.id_group == 22 || me.usuario.id_group == 23){ me.userFacturador = true }
    },
    methods:{
      recargarDatos(){
          let me = this;
          me.$emit('recargarPeriodos'); // Recarga los periodos del padre
          if(me.periodoSelect && me.periodoSelect.idperiodoescolar){
              me.getObsequios(); // Recarga los obsequios
          }
      },
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
          this.$http.get(this.$server_url+'obsequio?listadoObsequioAsesor=yes&periodo_id='+me.periodoSelect.idperiodoescolar)
              .then(function (res) {
                 let datos = res.data
                  if(me.userAsesor) {
                    me.arregloObsequios = datos.filter(p => p.asesor_id == me.usuario.idusuario)
                  }else{
                    me.arregloObsequios = datos
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
        me.arregloPeriodo = ''
        this.$http.get(this.$server_url+'periodo/'+me.periodoSelect.idperiodoescolar)
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
