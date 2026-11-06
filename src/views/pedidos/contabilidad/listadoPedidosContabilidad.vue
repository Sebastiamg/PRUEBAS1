<template>
    <vx-card>
        <vs-table max-items="10" stripe search pagination :data="arregloPedidos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad:  {{ arregloPedidos.length }} </vs-chip>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Asesor</vs-th>
                <vs-th>Beneficiarios</vs-th>
                <vs-th>Valor</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{ tr.id_pedido }}
                    </vs-td>
                    <vs-td>
                        <b>Asesor:</b>
                        <p> {{data[indextr].responsable}}</p>
                        <b>Institución:</b>
                        <p> {{data[indextr].nombreInstitucion}}<br> </p>
                        <b>Ciudad:</b>
                        <p>{{ tr.nombre_ciudad }}</p>
                        <b>Fecha generación contrato</b>
                        <p> {{data[indextr].fecha_generar_contrato}}<br> </p>
                        <b>Fecha aprobado por gerencia</b>
                        <p> {{data[indextr].fecha_aprobacion_anticipo_gerencia}}<br> </p>
                    </vs-td>
                    <vs-td>
                        <p class="text-dark cursor-pointer" @click="pedido=tr;verEvidencia(tr);"><span><i class="fa-solid fa-camera"></i><b> {{ testEvidencia(tr,3) }}</b></span></p>
                        <p class="text-success cursor-pointer" @click="pedido=tr;popupMostrarCedula = true;"><span><i class="fa-solid fa-camera"></i><b> Ver Cédula</b></span></p>
                        <p class="text-primary cursor-pointer" @click="pedido=tr;popupMostrarRUC = true;"><span><i class="fa-solid fa-camera"></i><b> Ver RUC</b></span></p>
                        <p class="text-warning cursor-pointer" v-if="estado > 4" @click="tDocumento='cheque_sin_firmar';imgVer = tr.evidencia_cheque_sin_firmar;popupDocumento = true;"><span><i class="fa-solid fa-camera"></i><b> Ver cheque sin firmar</b></span></p>
                        <p class="text-warning cursor-pointer" v-if="estado > 5" @click="tDocumento='cheque';imgVer=tr.evidencia_cheque;popupDocumento = true;"><span><i class="fa-solid fa-camera"></i><b> Ver cheque</b></span></p>
                        <p class="text-warning cursor-pointer" v-if="estado > 10" @click="pedido=tr;popupRecibirPagare = true;mostrar=true;"><span><i class="fa-solid fa-camera"></i><b> Ver Pagare</b></span></p>
                        <!-- evidencia_pagare -->
                        <div v-for="(item,key2) in tr.beneficiarios" class="flex" style="width: 33%;">
                            <div >
                                <p><span>{{ key2 +1 }}.</span> {{ item.beneficiario }}</p>
                                <small>{{ item.cedula }}</small>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td>
                      <p style="background-color: #22D82D;text-align: center;padding: 5px;border-radius: 5px;color: white;">$ {{ tr.anticipo_aprobado }}</p>
                    </vs-td>
                    <vs-td>
                      <div style="display: flex;">
                        <!--COLOCAR RECIBIDAS-->
                        <vx-tooltip style="display: inline-block;" text="Marcar como recibido" position="top" color="primary">
                            <vs-button v-if="estado == 2" class="modal-default-button" size="small" color="primary" @click="id_pedido= tr.id_pedido;responsable = tr.responsable;popupUpload = true;" type="filled" icon-pack="feather" icon="icon-credit-card"> Recibir </vs-button>
                        </vx-tooltip> &nbsp;
                        <!--SUBIR CHEQUE SIN FIRMAR-->
                        <vx-tooltip style="display: inline-block;" text="subir cheque sin firmar" position="top" color="primary">
                            <vs-button v-if="estado == 4" class="modal-default-button" size="small" color="primary" @click="id_pedido= tr.id_pedido;responsable = tr.responsable;popupUpload = true;" type="filled" icon-pack="feather" icon="icon-credit-card"> Subir cheque sin firmar </vs-button>
                        </vx-tooltip> &nbsp;
                        <!--SUBIR CHEQUE FIRMADO-->
                        <vx-tooltip style="display: inline-block;" text="subir cheque firmado" position="top" color="primary">
                            <vs-button v-if="estado == 5" class="modal-default-button ml-3" size="small" color="primary" @click="id_pedido= tr.id_pedido;responsable = tr.responsable;popupUpload = true;" type="filled" icon-pack="feather" icon="icon-credit-card"> Subir cheque firmado </vs-button>
                        </vx-tooltip> &nbsp;
                        <!--CORREGIR CHEQUE FIRMADO-->
                        <vx-tooltip style="display: inline-block;" text="Corregir cheque" position="top" color="primary">
                          <vs-button v-if="estado == 5 || estado == 6" class="modal-default-button" size="small" color="primary" @click="pedido=tr;openConfirmCorregirCheque(tr);" type="border" icon-pack="feather" icon="icon-credit-card"> Corregir cheque</vs-button>
                      </vx-tooltip> &nbsp;
                        <!--MARCAR COMO PAGARE ENTREGADO-->
                        <vx-tooltip style="display: inline-block;" text="Marcar como pagare recibido por el facturador" position="top" color="primary">
                          <vs-button v-if="estado == 10" class="modal-default-button" size="small" color="primary" @click="pedido=tr;popupRecibirPagare = true;" type="filled" icon-pack="feather" icon="icon-file"> Marcar recibi pagaré</vs-button>
                        </vx-tooltip> &nbsp;
                      </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" :title="'Subir información '+responsable" :active.sync="popupUpload">
                <uploadFileVue v-if="estado == 2" :id_pedido = "id_pedido" tipoDocumento="recibido" campo_fecha="fecha_contabilidad_recibe" campo_file="ninguno" estadoHistorico="4" @changeUpdate = "getPedidos"/>
                <uploadFileVue v-if="estado == 4" :id_pedido = "id_pedido" tipoDocumento="cheque_sin_firmar" campo_fecha="fecha_contabilidad_sube_cheque_sin_firmar" campo_file="evidencia_cheque_sin_firmar" estadoHistorico="5" @changeUpdate = "getPedidos"/>
                <uploadFileVue v-if="estado == 5" :id_pedido = "id_pedido" tipoDocumento="cheque" campo_fecha="fecha_subir_cheque" campo_file="evidencia_cheque" estadoHistorico="6" @changeUpdate = "getPedidos"/>
            </vs-popup>
        </div>
        <!--MODAL PARA VER LA IMAGEN DE LA CEDULA DEL BENEFICIARIO-->
        <vs-popup class="holamundo" fullscreen title="Foto de la copia de la cédula subida por el asesor" :active.sync="popupMostrarCedula">
            <!-- <div class="flex" style="justify-content: center;width:500px;"> -->
                <image-zoom
                :regular="$data_url+'archivos/pedidos/img/img_cedula/'+pedido.imagen"
                :zoom-amount="3"
                :click-zoom="true"
                click-message="De click para aumentar"
                img-class="img-fluid"

                >
                </image-zoom>
                <!-- <img width="500" :src="$data_url+'archivos/pedidos/img/img_cedula/'+pedido.imagen"/> -->
            <!-- </div> -->
        </vs-popup>
        <!--MODAL PARA VER RUC-->
        <vs-popup class="holamundo" fullscreen title="Mostrar RUC" :active.sync="popupMostrarRUC">
            <image-zoom
                :regular="$data_url+'archivos/pedidos/img/img_cedula/'+pedido.doc_ruc"
                :zoom-amount="3"
                :click-zoom="true"
                click-message="De click para aumentar"
                img-class="img-fluid"
                >
            </image-zoom>
            <!-- <div class="flex" style="justify-content: center;">
            <img width="500" :src="$data_url+'archivos/pedidos/img/img_cedula/'+pedido.doc_ruc"/>
            </div> -->
        </vs-popup>
        <!--MODAL PARA EVIDENCIA DE GERENCIA-->
        <vs-popup class="holamundo" fullscreen title="Mostrar evidencia de aprobación de gerencia" :active.sync="popupMostrarEvidenciaGerencia">
            <image-zoom
                :regular="$data_url+'archivos/pedidos/img/aprobados/'+imgVer"
                :zoom-amount="3"
                :click-zoom="true"
                click-message="De click para aumentar"
                img-class="img-fluid"
                >
            </image-zoom>
            <!-- <div class="flex" style="justify-content: center;">
            <img width="500" :src="$data_url+'archivos/pedidos/img/aprobados/'+imgVer"/>
            </div> -->
        </vs-popup>
        <!--MODAL PARA MOSTRAR CHEQUE-->
        <vs-popup class="holamundo" fullscreen :title="'Mostrar '+(tDocumento == cheque ? 'Cheque':'Cheque sin firmar')" :active.sync="popupDocumento">
            <image-zoom
                :regular="$data_url+'archivos/pedidos/'+tDocumento+'/'+imgVer"
                :zoom-amount="3"
                :click-zoom="true"
                click-message="De click para aumentar"
                img-class="img-fluid"
                >
            </image-zoom>
        </vs-popup>
        <!--MODAL PARA MARCAR COMO RECIBIDO PAGARE-->
        <vs-popup class="holamundo" title="Pagaré entregado por el facturador" :active.sync="popupRecibirPagare">
            <div v-if="mostrar == false">
                <p>Fecha que recibio el pagaré firmado</p>
                <flat-pickr :config="configdateTimePicker" v-model="fromDate"  placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
            </div>
            <div class="flex mt-3" style="justify-content: center;">
                <img width="500" :src="$data_url+'archivos/pedidos/pagare/'+pedido.evidencia_pagare"/>
            </div>
            <div class="flex" style="justify-content: center;" v-if="mostrar == false">
                <vs-button color="success" @click="changeEstadoHistorico(11)" class="mt-5" type="gradient">Recibi el pagaré fisico por parte del facturador</vs-button>
            </div>
        </vs-popup>
    </vx-card>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import uploadFileVue from './uploadFileContabilidad.vue'
import Vue from 'vue';
import imageZoom from 'vue-image-zoomer';
export default{
    data(){
      return{
          id_pedido:'',
          responsable:'',
          arregloPedidos:[],
          pedido:{},
          popupUpload:false,
          popupMostrarCedula:false,
          popupMostrarRUC:false,
          popupMostrarEvidenciaGerencia:false,
          popupRecibirPagare:false,
          imgVer:'',
          fromDate:null,
          configdateTimePicker: {
              enableTime: true,
              dateFormat: 'Y-m-d H:i:s'
          },
          mostrar:false,
          popupDocumento:false,
          tDocumento:'',
      }
    },
    props:{
      estado:{
          type:Number,
          default:0,
      }
    },
    components:{
        uploadFileVue,
        flatPickr,
        imageZoom,
    },
    mounted(){
        let me = this;
        me.getPedidos()
        me.fromDate = new Date();
    },
    methods:{
        testEvidencia(tr){
            let me = this
            if(tr.files.length > 0){
                let validate2 = tr.files.filter(p => p.tipo == 3)
                if(validate2.length > 0){
                    return "Ver aprobación de gerencia"
                }else{
                    return "Pendiente aprobación de gerencia"
                }
            }else{
                return "Pendiente aprobación de gerencia"
            }
        },
        verEvidencia(tr){
            let me = this
            let validate = tr.files.filter(p => p.tipo == 3)
            if(validate.length == 0){
                me.$vs.notify({
                text:'Aun no ha sido subido un archivo de aprobacion de gerencia',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.imgVer = validate[0].url
            me.popupMostrarEvidenciaGerencia = true
        },
        getPedidos(){
            let me = this
            me.popupUpload = false;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getPedidosContabilidad?estado='+me.estado)
            .then(res => {
                me.$vs.loading.close();
                me.arregloPedidos = res.data
            })
        },
        changeEstadoHistorico(estado){
        let me = this
        if(me.fromDate == null || me.fromDate == undefined || me.fromDate == ""){
            me.$vs.notify({
                text: "Seleccione una fecha por favor",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            })
            return
        }
        let formData = new FormData();
        formData.append('id_pedido',  me.pedido.id_pedido);
        formData.append('estado',     estado);
        formData.append('fromDate',   me.fromDate)
        if(estado == 11 ) formData.append('campo','fecha_que_recibe_orden_firmada_contabilidad')
        me.$vs.loading();
        this.$http.post(this.$server_url+'cambiarEstadoHistorico', formData)
        .then(function (res) {
          me.$vs.loading.close();
          me.getPedidos()
          me.pedido = {}
          me.popupRecibirPagare = false
          me.$vs.notify({
            text: 'Se registro correctamente',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
        .catch(function (error) {  me.$vs.loading.close(); })
      },
      openConfirmCorregirCheque(tr){
        let me = this;
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          title: `Confirmar`,
          acceptText:'Si, deseo corregir',
          cancelText:'Cancelar',
          text: 'Estas seguro de corregir el cheque',
          accept:this.corregirCheque
        })
      },
      corregirCheque(){
        let me = this;
        let formData    = new FormData();
        var fechaChange = ""
        var sendEstado  = 0
        var sendFile    = ""
        //estado => 6 = CHEQUE SUBIDO     =>  CORREGIR => REGRESAR A CHEQUE SIN FIRMAR => COLOCAR ESTADO 5
        if(me.estado == 6) {
          fechaChange = 'fecha_subir_cheque'
          sendFile    = 'evidencia_cheque'
          sendEstado  = 5
        }
        //estado => 5 = CHEQUE SIN FIRMAR =>  CORREGIR => REGRESAR A CONTABILIDAD RECIBE => COLOCAR ESTADO 4
        if(me.estado == 5){
          fechaChange = 'fecha_contabilidad_sube_cheque_sin_firmar'
          sendFile    = 'evidencia_cheque_sin_firmar'
          sendEstado  = 4
        }
        formData.append('fecha',      fechaChange)
        formData.append('sendFile',   sendFile)
        formData.append('id_pedido',  me.pedido.id_pedido);
        formData.append('estado',     sendEstado);
        me.$vs.loading();
        this.$http.post(this.$server_url+'corregirChequeContabilidad', formData)
        .then(function (res) {
          me.$vs.loading.close();
          me.getPedidos()
          me.pedido = {}
          me.$vs.notify({
            text: 'Se corrigio correctamente',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
        .catch(function (error) {  me.$vs.loading.close(); })
      },
    }
}
</script>
