<template>
    <vx-card
    :title="'Alcance del Pedido # '+pedido.id_pedido"
    class="mt-3">
        <div v-if="menu == 0">
            <div class="flex">
                <vs-button color="dark" v-if="userAsesor || groupFacturador " @click="guardarAlcance()" size="small"  icon="save" type="filled">Crear alcance</vs-button>
            </div>
            <vs-table max-items="10" stripe search pagination :data="arregloAlcance">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: {{ arregloAlcance.length }}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Alcance ID#</vs-th>
                    <vs-th>Venta bruta</vs-th>
                    <vs-th>Comentario</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td width="15%">
                            #{{data[indextr].id}}<br>
                            <small>{{ tr.contrato_generado }}</small>
                            <br>
                            <b>Institución:</b>
                            <p>{{ tr.nombreInstitucion }}</p>
                            <b>Fecha creacion:</b>
                            <p>{{ tr.created_at }}</p>
                            <b v-if="tr.fecha_aprobacion">Fecha aprobacion:</b>
                            <p v-if="tr.fecha_aprobacion">{{ tr.fecha_aprobacion }}</p>
                        </vs-td>
                        <vs-td  width="20%">
                          <b>Venta bruta:</b>
                          <p>{{data[indextr].venta_bruta}}</p>
                          <br>
                          <b>Total unidades:</b>
                          <p>{{data[indextr].total_unidades}}</p>
                        </vs-td>
                        <vs-td height="40%" width="40%">
                            <div class="overflow-y-auto h-24" v-if="tr.observacion_asesor && tr.observacion_asesor != 'null'">
                                {{ tr.observacion_asesor }}
                            </div>
                        </vs-td>
                        <vs-td width="10%">
                            <div v-if="tr.estado_alcance == 0">
                                <vs-chip color="primary" transparent>Abierto</vs-chip>
                            </div>
                            <div v-if="tr.estado_alcance == 1">
                                <vs-chip color="success" transparent>Cerrado/aceptado</vs-chip>
                            </div>
                            <div v-if="tr.estado_alcance == 2">
                                <vs-chip color="danger" transparent>Rechazado</vs-chip>
                            </div>
                        </vs-td>
                        <vs-td width="30%">
                          <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                              <div>
                                <vs-dropdown-item v-if="tr.estado_alcance == 0 && groupFacturador">
                                  <!--ACEPTAR ALCANCE-->
                                  <vs-button class="w-full" color="success" @click="alcance=tr;openConfirmAlcance(tr)"  icon-pack="feather" icon="icon-check" type="line" > Aceptar alcance </vs-button>
                                </vs-dropdown-item>
                                  <vs-dropdown-item v-if="tr.estado_alcance == 0 && groupFacturador">
                                      <!--RECHAZAR ALCANCE-->
                                      <vs-button  color="warning" type="line"  icon-pack="feather" icon="icon-x" @click="confirmRechazarAlcance(tr)" class="w-full text-normal p-2">Rechazar alcance</vs-button>
                                  </vs-dropdown-item>
                                <vs-dropdown-item v-if="tr.estado_alcance == 0 && (userAsesor || userRoot)">
                                  <!--MOSTRAR /REGISTRAR LIBROS-->
                                  <vs-button color="success" type="line" icon-pack="feather" icon="icon-book" class="w-full" @click="alcance=tr;menu = 3">{{ userAsesor || userRoot ? 'Registrar':'Mostrar'}} libros</vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item>
                                  <!--RESUMEN LIBROS-->
                                  <vs-button color="primary" type="line"  icon-pack="feather" icon="icon-bookmark" class="w-full" @click="alcance=tr;mostrarResumen(tr)">Resumen libros</vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item>
                                  <!--REPORTE PDF-->
                                  <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" class="w-full" @click="ObjectedAlcance=tr;realizarReporte(1)">Reporte Pdf</vs-button>
                                </vs-dropdown-item>
                                <vs-dropdown-item v-if="tr.estado_alcance == 0 || userRoot">
                                  <!--ELIMINAR-->
                                  <vs-button color="danger" icon-pack="feather" icon="icon-trash" type="line" class="w-full" @click="alcance=tr;menu = 1" v-if="tr.estado_alcance == 0 || tr.estado_alcance == 2 || userRoot">Eliminar</vs-button>
                                </vs-dropdown-item>
                                <!--reabrir-->
                                <vs-dropdown-item v-if="(tr.estado_alcance == 1 || tr.estado_alcance == 2) && groupFacturador">
                                    <vs-button color="#EB7D67" icon-pack="feather" icon="icon-rotate-cw" type="line" class="w-full" @click="confirmReabrirAlcance(tr)">Reabrir alcance</vs-button>
                                </vs-dropdown-item>
                              </div>
                            </vs-dropdown-menu>
                          </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-if="menu == 1">
            <p class="text-danger font-bold text-center">Estas seguro de  querer eliminar el alcance?</p>
            <div class="flex justify-center">
                <p class="mt-1"></p>
                <vs-button color="danger" @click="eliminarAlcance()" type="border" icon="delete">Si deseo, eliminar</vs-button>
                <vs-button color="primary" @click="menu = 0;" class="ml-3" type="filled" icon="close">Cancelar</vs-button>
            </div>
        </div>
        <!--RESUMEN LIBROS-->
        <div v-if="menu == 2">
            <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
            <resumenLibrosVue :alcance="alcance"/>
        </div>
        <!--REGISTRAR LIBROS-->
        <div v-if="menu == 3">
            <vs-button color="primary" type="border" @click="menu = 0;getAlcance(0)">← Regresar</vs-button>
            <ScreenAlcanceVue :alcance="alcance" class="mt-2" :sendPedido="sendPedido" :userRoot="Boolean(userRoot)"/>
        </div>
        <!--REPORTE-->
        <div v-if="popupReporteAlcance">
          <exportAlcanceVue  style="display:none;" :tipoFile="tipoFile" :alcance="ObjectedAlcance" @change="changeHandle" />
        </div>
        <!--MODALES-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
          <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
          <img  class="mt-2"  style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png"/>
        </vs-popup>
    </vx-card>
</template>
<script>
import {
    mapState
} from "vuex";
const resumenLibrosVue = () => import('./resumenLibros.vue')
const ScreenAlcanceVue = () => import('./ScreenAlcance.vue')
const exportAlcanceVue = () => import('@/views/temporadas/components/exportAlcance')
import PedidosRepository from "../../../repositories/PedidosRepository";
export default{
    components:{
        resumenLibrosVue,
        ScreenAlcanceVue,
        exportAlcanceVue,
    },
    data(){
        return{
          usuario:[],
          arregloAlcance:[],
          alcance:{},
          ObjectedAlcance:'',
          pedido:{},
          menu:0,
          popupCarga:false,
          popupReporteAlcance:false,
          tipoFile:0,
          sendPedido:'',
        }
    },
    computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.sendPedido               = me.ObjectPedido
        me.pedido.id_pedido         = me.sendPedido.id_pedido
        me.getAlcance(0)
    },
    methods:{
        confirmRechazarAlcance(tr) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Confirmar',
                acceptText: 'Sí, rechazar alcance',
                cancelText: 'Cancelar',
                text: '¿Estás seguro de rechazar el alcance? Esta acción no se puede deshacer.',
                accept: () => this.CambiarEstadoAlcance(tr, 2)
            });
        },
        confirmReabrirAlcance(tr) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'primary',
                title: 'Confirmar',
                acceptText: 'Sí, reabrir alcance',
                cancelText: 'Cancelar',
                text: '¿Estás seguro de reabrir el alcance?',
                accept: () => this.CambiarEstadoAlcance(tr, 0)
            });
        },
        getAlcance(tipo){
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getAlcancePedido?id_pedido='+me.pedido.id_pedido)
            .then(function (res) {
                me.$vs.loading.close()
                me.arregloAlcance = res.data
                if(tipo == 1){
                    let datos  = res.data.filter(p => p.estado_alcance == 0)
                    me.alcance = datos[0]
                    me.menu = 3
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
        },
        mostrarResumen(tr){
            let me = this;
            me.menu = 2
        },
        eliminarAlcance(){
            let me = this;
            let formData = new FormData();
            let nuevarutaxperiodo = '';
            if(me.sendPedido.id_periodo <= 26){
            nuevarutaxperiodo = 'eliminarAlcance';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance/'+me.alcance.id_pedido+'/'+me.alcance.id);
            }else if(me.sendPedido.id_periodo > 26){
            nuevarutaxperiodo = 'eliminarAlcance_new';
            // this.$http.get(this.$server_url+'get_val_pedidoInfo_alcance_new/'+me.alcance.id_pedido+'/'+me.alcance.id);
            }
            formData.append('id',           me.alcance.id);
            formData.append('id_pedido',    me.pedido.id_pedido);
            me.$vs.loading();
            this.$http.post(this.$server_url+'eliminarAlcance', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se elimino correctamente el alcance',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getAlcance()
                    me.menu = 0
                })
                .catch(function (error) {  me.$vs.loading.close() })
        },
        async guardarAlcance(){
            let me = this
            let formData = new FormData();
            formData.append('id',                 0)
            formData.append('id_periodo',         me.sendPedido.id_periodo);
            formData.append('id_pedido',          me.pedido.id_pedido);
            formData.append('venta_bruta',        0);
            formData.append('total_unidades',     0);
            formData.append('pendiente_liquidar', 0);
            this.$http.post(this.$server_url+'guardarValorAlcance', formData)
            .then(function (res) {
                if(res.data.status == 0){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time:7000,
                    })
                    return
                }
                me.$vs.notify({
                text: 'Se guardo correctamente',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
                me.getAlcance(1)
            })
            .catch(function (error) {})
        },
        CambiarEstadoAlcance(tr,estado){
            let me = this;
            let formData = new FormData();
            formData.append('id',      tr.id);
            formData.append('estado_alcance', estado);
            formData.append('usuario_editor_estado', me.usuario.idusuario)
            me.$vs.loading();
            this.$http.post(this.$server_url+'changeEstadoAlcance', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                me.$vs.notify({
                    text: res.data.message,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
                }
                me.$vs.notify({
                text: res.data.message,
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
                me.getAlcance(0)
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        openConfirmAlcance(){
        this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo aceptar el alcance',
            cancelText:'Cancelar',
            text: 'Estas seguro de aceptar el alcance al hacerlo se guardara en facturación',
            accept:this.aceptarAlcance
        })
        },
        aceptarAlcance(){
            let me = this;
            let formData = new FormData();
            formData.append('id_alcance',   me.alcance.id);
            formData.append('contrato',     me.alcance.contrato_generado);
            formData.append('id_pedido',    me.alcance.id_pedido);
            formData.append('ventaBruta',   me.alcance.venta_bruta);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('id_periodo',   me.sendPedido.id_periodo);
            me.$vs.loading();
            this.$http.post(this.$server_url+'AceptarAlcance', formData)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                me.$vs.notify({
                    text: res.data.message,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
                }
                me.$vs.notify({
                text: 'Se guardo correctamente',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
                })
                me.getAlcance(0)
                me.rechargePedido()
            })
            .catch(function (error) { me.$vs.loading.close() })
        },
        rechargePedido(){
          let me = this
          PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => { this.$store.dispatch('setPedido',r.data[0]); })
        },
      realizarReporte(tipo){
        let me = this;
        me.tipoFile            = tipo
        // me.popupCarga          = true
        me.popupReporteAlcance = true
      },
      changeHandle(e){
        let me = this;
        me.popupCarga             = false
        me.popupReporteAlcance    = false
      },
    }

}
</script>
