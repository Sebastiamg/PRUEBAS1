<template>
    <div>
        <div v-if="menu == 0">
          <!--DISTRIBUIDOR PUEDE CREAR VARIOS PAGOS-->
          <!-- <div v-if="tipo == 2"> -->
          <vs-button color="success" @click="id=0;menu = 1;" icon-pack="feather" icon="icon-dollar-sign" type="filled"> Subir Evidencia Pago</vs-button>
          <!-- </div> -->
          <!-- <div v-else>
            <vs-button color="success"  v-if="arregloPagos.length < 1" @click="id=0;menu = 1;" icon-pack="feather" icon="icon-dollar-sign" type="filled"> Subir Evidencia Pago</vs-button>
          </div> -->
            <vs-table max-items="3" search pagination :data="arregloPagos">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arregloPagos.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Valor</vs-th>
                    <vs-th v-if="tipo == 2">Codigo</vs-th>
                    <vs-th>Evidencia</vs-th>
                    <vs-th  style="width:100px;">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].valor}}<br>
                        </vs-td>
                        <vs-td v-if="tipo == 2">
                            {{data[indextr].codigo}}<br>
                        </vs-td>
                        <vs-td>
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
                            <b class="mt-1">Forma de pago:</b>
                            <p>{{ tr.tip_pag_nombre }}</p>
                            <b class="mt-1">Aplicado a pago:</b>
                            <p v-if="tr.tipo_aplicar == 0">Anticipo</p>
                            <p v-if="tr.tipo_aplicar == 1">Liquidación</p>
                            <p v-if="tr.tipo_aplicar == 2">Cancelación deudas</p>
                            <!-- <p v-if="tr.tipo_Pago == 0">Pago Factura</p>
                            <p v-if="tr.tipo_Pago == 1">Pago Deposito</p>
                            <p v-if="tr.tipo_Pago == 2">Pago Gif card</p>
                            <p v-if="tr.tipo_Pago == 3">Pago Cheque</p> -->
                            <p v-if="tr.tipo_Pago == 4">Pago Distribuidor</p>
                            <div v-if="tr.tipo_Pago == 4">
                              <b>Distribuidor:</b>
                              <p>{{ tr.distribuidor_usuario }}</p>
                            </div>
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <div>
                                  <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="success" @click="pagoSelect=tr;openModalEditar(data[indextr])" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                  </vx-tooltip> &nbsp;
                                  <vx-tooltip style="display: inline-block;" text="Eliminar valor" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="danger" @click="pagoSelect=tr;menu=2;" type="filled" icon-pack="feather" icon="icon-trash"> </vs-button>
                                  </vx-tooltip> &nbsp;
                                </div>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-if="menu == 1">
            <vs-button color="warning" @click="menu = 0;" type="border">← Volver</vs-button>
            <FormularioPagoVue
            :tipo="tipo"
            :sendPago="sendPago"
            :usuario="usuario"
            :id="id"
            :imgOld="imgOld"
            :pagoSelect="pagoSelect"
            :totalPorPagar="totalPorPagar"
            @changeHandle="changeHandle"
            :arregloDistribuidores="arregloDistribuidores"
            />
        </div>
        <div v-if="menu == 2">
          <p class="text-warning text-2xl text-center font-bold" style="margin-left: -60px;">Estás seguro de eliminar el valor del pago?</p>
          <div class="vx-row mt-3">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
              <vs-button class="mr-3 mb-2" @click="eliminarValorPago()">Si, deseo eliminar</vs-button>
              <vs-button color="warning" type="border" class="mb-2" @click="menu =0;">Cancelar</vs-button>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import FormularioPagoVue from './FormularioPago.vue'
import PedidosRepository from '../../../../../../repositories/PedidosRepository'
export default{
    components:{
        FormularioPagoVue,
    },
    data(){
        return{
          menu:0,
          arregloPagos:[],
          id:0,
          pagoSelect:'',
          imgOld:'',
          arregloDistribuidores:[],
        }
    },
    props:{
        sendPago:{
          type:Object,
          default:function(){
              return {}
          }
        },
        tipo:{
            type:Number,
            default:0
        },
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
        totalPorPagar:{
          type:Number,
          validator(value){
          return value%1!==0
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
        me.getPagos()
        me.getDistribuidores()
    },
    methods:{
      getDistribuidores() {
        let me = this;
        var url = ""
        url = this.$server_url + 'distribuidor?getDistribuidores=yes'
        this.$http.get(url)
          .then(res => {
            me.arregloDistribuidores = res.data.filter(p => p.estado == 1)
          })
          .catch(error => {
            console.log(error)
          })
      },
      changeHandle(e){
        let me = this;
        me.menu = 0;
        me.getPagos()
        me.updateValorPago()
      },
      getPagos() {
        let me = this;
        if(me.sendPago.id == null || me.sendPago.id == undefined){
          me.$vs.notify({
          text:'Guarde la información del tipo de pago por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        this.$http.get(this.$server_url+'pedigo_Pagos?listadoPagos=yes&verificacion_pago_id='+me.sendPago.id)
          .then(function (res) {
              me.arregloPagos = res.data
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
      },
      openDocument(tr){
          let me = this;
          let ruta = me.$data_url+'archivos/pedidos/pagos/'+tr.url
          window.open(ruta,'_blank')
          // if(tr.url.substr(-3) == 'pdf'){
          //     let ruta = me.$data_url+'archivos/pedidos/pagos/'+me.documento
          //     window.open(ruta,'_blank')
          //     return
          // }
          // me.popupDocumento = true;
      },
      openModalEditar(tr){
          let me      = this
          me.id       = tr.id
          me.imgOld   = tr.url
          me.menu     = 1
      },
      eliminarValorPago(){
        let me = this;
        let formData = new FormData()
        formData.append('deleteValorPago',          "yes")
        formData.append('id',                       me.pagoSelect.id)
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
          me.getPagos()
          me.updateValorPago()
          me.menu = 0
          me.pagoSelect = ''
        })
        .catch(function (error) {
            me.$vs.loading.close()
        })
      },
      updateValorPago(){
        let me = this;
        if(me.sendPago.id == null || me.sendPago.id == 0) { return }
        PedidosRepository.actualizarValorPago(me.sendPago.id).then( r => { console.log(r.data) })
      },
      limpiar(){
          let me          = this;
          me.id           = 0;
          me.imgOld       = ""
          me.pagoSelect   = ""
      },
    }
}
</script>
<style scoped>
.imagen{
    cursor:pointer;
    opacity:0.8;
    transition: 1s ease all;
}
.imagen:hover{
    text-decoration: underline;
    color:#217bc5;
    text-shadow:2px 4px 2px #ccc;
}
</style>
