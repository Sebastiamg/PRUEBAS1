<template>
    <div>
      <div v-if="menu == 0">
        <div class="flex">
          <vs-button color="primary" @click="limpiar();generateNuevoPago()" icon="add" class="ml-2 p-3 mr-3" type="border">Crear Pago</vs-button>
          <vs-button color="primary" v-if="contrato" @click="updatePagos = true;" icon-pack="feather" icon="icon-loader" class="ml-2 p-3" type="border">Actualizar Valores</vs-button>
          <div class="flex cursor-pointer ml-3" @click="$emit('changeReturn',1);" v-if="contrato">
            <vs-avatar color="success" icon-pack="feather" icon="icon-credit-card" />
            <span class="text-success" style="transform: translateY(10px);" >Verificaciones</span>
          </div>
          <div class="flex cursor-pointer ml-3" @click="$emit('changeReturn',2);" v-if="contrato">
            <vs-avatar color="success" icon-pack="feather" icon="icon-percent" />
            <span class="text-success" style="transform: translateY(10px);" >Porcentajes Beneficiarios</span>
          </div>
        </div>
        <br>
        <vs-table stripe :data="arregloPagos">
              <template slot="header">
                  <div class="flex">
                      <vs-chip>Cantidad: {{ arregloPagos.length }}</vs-chip>
                  </div>
                  <br>
              </template>
              <template slot="thead">
                  <vs-th width="10%">#</vs-th>
                  <vs-th width="20%">Documento</vs-th>
                  <vs-th width="50%">Contrato</vs-th>
                  <vs-th width="10%">Observación</vs-th>
                  <vs-th width="10%">Acción</vs-th>
              </template>
              <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>{{ tr.doc_codigo }}</vs-td>
                  <vs-td>
                    <p class="mt-2"><vs-chip v-if="tr.estado == 0" color="warning">Pendiente</vs-chip></p>
                    <p class="mt-2"><vs-chip v-if="tr.estado == 1" color="success">Aprobado</vs-chip></p>
                    <p class="mt-2"><vs-chip v-if="tr.estado == 2" color="danger">Anulado</vs-chip></p>
                    <br><br>
                    <p style="font-weight:bold;">Doc valor:</p>
                    <span  class="text-success font-bold">{{ data[indextr].doc_valor }}</span><br/>
                    <div v-if="tr.unicoEvidencia == 0">
                      <p style="font-weight:bold;" >Doc. Número:</p>
                      <span>{{ data[indextr].doc_numero }}</span><br/>
                    </div>
                    <p style="font-weight:bold;">Doc. Nombre:</p>
                    <span>{{ data[indextr].doc_nombre }}</span><br/>
                    <p style="font-weight:bold;">Doc. Apellidos:</p>
                    <span>{{ data[indextr].doc_apellidos }}</span><br/>
                    <p style="font-weight:bold;">Doc. Ci:</p>
                    <span>{{ data[indextr].doc_ci }}</span><br/>
                    <p style="font-weight:bold;">Doc. Institución:</p>
                    <span>{{ data[indextr].doc_institucion }}</span><br/>
                    <p style="font-weight:bold;">Doc. Tipo:</p>
                    <span>{{ data[indextr].doc_tipo }}</span><br/>
                    <b class="mt-1">Forma de pago:</b>
                    <p>{{ tr.tipo_pagos.tip_pag_nombre }}</p>
                    <!-- <p v-if="tr.tipo_Pago == 4">Pago Distribuidor</p>
                    <div v-if="tr.tipo_Pago == 4">
                      <b>Distribuidor:</b>
                      <p>{{ tr.distribuidor_usuario }}</p>
                    </div> -->
                    <p style="font-weight:bold;">Doc. Fecha:</p>
                    <span>{{ data[indextr].doc_fecha }}</span><br/>
                    <div v-if="tr.unicoEvidencia == 0">
                      <p v-if="!tr.archivo">
                        <b class="text-danger"> Solicitud de evidencias: No subida </b>
                        </p>
                        <p v-else class="imagen" @click="openDocument(tr)">
                            <b> Evidencia:
                                <!--PDF-->
                                <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                <!--IMAGE-->
                                <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                            </b>
                        </p>
                    </div>
                </vs-td>
                <vs-td>
                  {{ tr.ven_codigo }}
                  <div v-if="tr.pedido_pagos_hijo.length > 0">
                    <vs-collapse accordion >
                      <vs-collapse-item  style="position:relative;left:-50px;">
                        <div slot="header">
                          <p class="font-bold"> Ver Evidencias Gift Card</p>
                        </div>
                        <vs-row>
                          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm = "12" vs-xs="12" >
                            <vs-card>
                              <div class="header">
                                <p style="font-weight: bold;">Formato del archivo excel</p>
                                <table class="tabla">
                                    <tr>
                                      <th class="th1">Valor</th>
                                      <th class="th1">Num. Documento</th>
                                      <th class="th1">Evidencia</th>
                                    </tr>
                                    <tr v-for="(item,key) in tr.pedido_pagos_hijo" :key="key">
                                      <td class="td1">{{  item.valor }}</td>
                                      <td class="td1">{{ item.codigo }}</td>
                                      <td class="td1">
                                        <p v-if="!item.archivo">
                                          <b class="text-danger"> Solicitud de evidencias: No subida </b>
                                          </p>
                                          <p v-else class="imagen" @click="openDocument(item)">
                                              <b> Evidencia:
                                                  <!--PDF-->
                                                  <ion-icon v-if="item.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                                                  <!--IMAGE-->
                                                  <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                                              </b>
                                          </p>
                                      </td>
                                    </tr>
                                </table>
                              </div>
                            </vs-card>
                          </vs-col>
                        </vs-row>
                      </vs-collapse-item>
                     </vs-collapse>
                  </div>
                </vs-td>
                  <vs-td height="30%" width="40%">
                    <div class="overflow-y-auto h-24">
                      {{ tr.doc_observacion }}
                    </div>
                  </vs-td>
                  <vs-td>
                    <vx-tooltip text="Aprobar pago" position="top" color="warning" style="display: inline-block; z-index: 3;">
                      <vs-button v-if="tr.estado == 0" size="large" @click="id=tr.doc_codigo;ObjectSelect=tr;openConfirmAprobarPago()" radius icon-pack="feather" icon="icon-check" color="success" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip text="Editar pago" position="top" color="warning" style="display: inline-block; z-index: 3;">
                      <vs-button  size="large" radius icon-pack="feather" icon="icon-edit" @click="id=tr.doc_codigo;ObjectSelect=tr;openEditar(tr)" color="warning" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip text="Eliminar pago" position="top" color="danger" style="display: inline-block; z-index: 3;">
                      <vs-button v-if="userRoot" size="large" radius icon-pack="feather" icon="icon-x" @click="ObjectSelect=tr;openConfirmEliminarPago(tr)" color="danger" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip text="Eliminar pago" position="top" color="danger" style="display: inline-block; z-index: 3;">
                      <vs-button v-if="tr.estado == 0 && ( usuario.id_group == 22 || usuario.id_group == 23)" size="large" radius icon-pack="feather" icon="icon-x" @click="ObjectSelect=tr;openConfirmEliminarPago(tr)" color="danger" type="line"></vs-button>
                    </vx-tooltip>
                  </vs-td>
              </vs-tr>
              </template>
        </vs-table>
      </div>
      <div v-if="menu == 1">
        <vs-button color="primary" type="border" @click="id=0;menu = 0;getListadoPagos();">◄ Regresar</vs-button>
          <CrearPagoVue
          :usuario="usuario"
          :contrato="contrato"
          :ObjectSelect="ObjectSelect"
          :totalPorPagar="totalPorPagar"
          :sendPedido="sendPedido"
          :id="id"
          :userRoot="userRoot"
          @changeHandle="changeHandle"
          />
      </div>
      <div v-if="updatePagos">
        <div v-for="(item,key) in arregloVerificaciones" :key="key">
          <ScreenRellenarPagosVue
          :cantidadVerificaciones="arregloVerificaciones.length"
          :VerificacionSelect="item"
          :sendPedido="sendPedido"
          :datosInstitucion="datosInstitucion"
          :contrato="contrato"
          @changeHandleUpdatePayments="changeHandleUpdatePayments"
          />
        </div>
      </div>
      <!--MODALES-->
      <!--MODAL LOADING-->
      <vs-popup :title="'Cargando....'" :active.sync="updatePagos">
        <Loading1Vue :title="'Espere mientras se actualiza los valores.......'"/>
      </vs-popup>
    </div>
</template>
<script>
import axios from 'axios'
// import CrearPagoVue from './components/CrearPago.vue';
const CrearPagoVue           = () => import('./components/CrearPago.vue')
const ScreenRellenarPagosVue = () => import('./components/Verificacion/ScreenRellenarPagos.vue')
const Loading1Vue            = () => import('../../../../configuracion/Reutilizable/Loading1.vue')
// import ScreenRellenarPagosVue from './components/Verificacion/ScreenRellenarPagos.vue';
// import Loading1Vue from '../../../../configuracion/Reutilizable/Loading1.vue';
export default{
    data(){
        return{
          id:0,
          menu:0,
          arregloPagos:[],
          ObjectSelect:'',
          updatePagos:false,
        }
    },
    components:{
        CrearPagoVue,
        ScreenRellenarPagosVue,
        Loading1Vue,
    },
    props:{
      userRoot:{
        type:Boolean,
        default:false,
        required:true,
      },
        usuario:{
        type:Object,
            default:function(){
                return {}
            }
        },
        contrato:{
            type:String,
            default:''
        },
        totalLiquidacion:{
          type:Number,
          validator(value){
            return value%1!==0
          }
        },
        totalPorPagar:{
            type:Number,
            validator(value){
            return value%1!==0
            }
        },
        sendPedido:{
          type:Object,
          default:function(){
            return {}
          },
        },
        arregloVerificaciones:{
          type:Array,
          default:function(){
            return []
          }
        },
        datosInstitucion:{
          type:Object,
          default:function(){
            return {}
          }
        }
    },
    watch:{
      totalPorPagar(results){
        let me = this;
        me.totalPorPagar = results
      },
    },
    mounted(){
      let me = this;
      me.getListadoPagos()
    },
    methods:{
      changeHandle(e){
        let me = this
        if(e == 1)      { me.getListadoPagos(); me.menu = 0; }
        if(e.tipo == 2) { me.getListadoPagos(); me.id   = e.setId ;}
      },
      changeHandleUpdatePayments(e){
        let me = this
        me.updatePagos = false
        me.$emit('rechargeValores',true)
      },
      getListadoPagos(){
        let me = this;
        me.$vs.loading()
        this.$http.get(this.$server_url + `pedigo_Pagos?ListadoListaPagos=yes&contrato=${ me.contrato }`)
          .then(function (res) {
            me.$vs.loading.close()
            me.arregloPagos = res.data
          })
          .catch(function (error) {
            me.$vs.loading.close()
            console.log(error + ' error');
          })
      },
      openEditar(tr){
        let me = this
        me.id                      = tr.doc_codigo
        me.menu                    = 1
      },
      generateNuevoPago(){
        let me = this;
        me.menu = 1
        // this.$http.get(this.$server_url + `pedigo_Pagos?validatePagoAbierto=yes&contrato=${ me.contrato }`)
        // .then(function (res) {
        //     if(res.data.status == 0){
        //         me.$vs.notify({
        //         text: res.data.message,
        //         color: 'warning',
        //         iconPack: 'feather',
        //         icon: 'icon-alert-triangle'
        //         })
        //         return
        //     }

        // })
        // .catch(function (error) {
        //     console.log(error + ' error');
        // })
      },
      openConfirmAprobarPago(){
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          acceptText:'Si, deseo aprobar el pago',
          cancelText:'Cancelar',
          text: 'Estás seguro de aprobar el pago?',
          accept:this.aprobarPago
        })
      },
      aprobarPago(){
        let me = this;
        let formData = new FormData();
        formData.append('aprobarPagoVerificacion',  'yes')
        formData.append('doc_codigo',               me.ObjectSelect.doc_codigo);
        formData.append('contrato',                 me.contrato)
        formData.append('user_created',             me.usuario.idusuario);
        formData.append('periodo_id',               localStorage.periodo_id)
        formData.append('valor',                    me.ObjectSelect.doc_valor)
        me.$vs.loading()
        this.$http.post(this.$server_url+'pedigo_Pagos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
              time:5000,
            })
            return
          }
          me.getListadoPagos()
          me.$vs.notify({
            text: res.data.message,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.$emit('rechargeValores',true)
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
      },
      openConfirmEliminarPago(){
        let me = this;
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          acceptText:'Si, deseo eliminar el registro del pago',
          cancelText:'Cancelar',
          text: 'Estás seguro de eliminar el registro del pago?',
          accept:this.eliminarValorPago
        })
      },
      eliminarValorPago(){
        let me = this;
        let formData = new FormData()
        formData.append('eliminarRegistroPago',         "yes")
        formData.append('doc_codigo',                   me.ObjectSelect.doc_codigo)
        me.$vs.loading()
        axios.post(this.$data_url + 'api/guardarDatosPedido', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          console.log("go")
          me.$emit('rechargeValores',true)
          me.getListadoPagos()
        })
        .catch(function (error) {
            me.$vs.loading.close()
        })
      },
      limpiar(){
        let me = this;
        me.id                      = 0
        me.ObjectSelect            = ''
      },
      openDocument(tr){
        let me = this;
        let ruta = me.$data_url+'archivos/pedidos/pagos/'+tr.url
        window.open(ruta,'_blank')
      },
    },
}
</script>
<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {

  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #2D9ADA;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
</style>
