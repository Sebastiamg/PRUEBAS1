<template>
  <div>
    <vx-card>
        <!-- tab 2 content -->
          <div class="vx-col lg:w-full md:w-full sm:w-full mb-base">
            <!--ANTICIPO SUGERIDO-->
            <div>
              <li style="list-style: none;">
                <vs-checkbox v-if="userAdminFacturador || userRoot" v-model="pedido.ifanticipo" @input="f_checkAnticipo()">Solicitar anticipo</vs-checkbox>

                <vs-checkbox v-else :disabled="ObjectPedido.contrato_generado == null ? false : true " v-model="pedido.ifanticipo" @input="f_checkAnticipo()">Solicitar anticipo</vs-checkbox>
              </li>
              <div class="flex"  style="flex-wrap: wrap;">
                <div class="m-2">
                  <p class="text-danger font-bold">Anticipo Sugerido </p>
                  <vs-input type="number" disabled v-model="ObjectPedido.anticipo" class="mt-1" />
                </div>
                <div class="m-2">
                  <p class="text-danger font-bold">ANTICIPO SOLICITADO POR LA ESCUELA </p>
                  <vs-input :disabled="(userAsesor || userRoot) && pedido.ifanticipo ? false : true" type="number" v-model="pedido.anticipoAsesor" class="mt-1" />
                </div>
              </div>
            </div>
            <div v-if="ObjectPedido.ifanticipo == 1">
              <div v-if="ObjectPedido.doc_ruc && ObjectPedido.imagen">
              </div>
              <div v-else>
                <p class="text-center text-warning text-2xl">Falta subir los documentos de cedula y ruc</p>
                <br>
              </div>
            </div>
            <!--BOTONES DE GUARDAR-->
            <div class="flex justify-center">
              <vs-button @click="guardarPedido()" v-if="userAsesor && !pedido.contrato_generado" color="success" type="border" icon-pack="feather" icon="icon-file-text" class="mb-2">Guardar</vs-button>
              <vs-button @click="guardarPedido()" v-if="userRoot"  color="success" type="border" icon-pack="feather" icon="icon-file-text" class="mb-2">Guardar</vs-button>
            </div>
            <!--ANTICIPO APROBADO-->
            <div v-if="groupFacturador">
              <div style="width: 100%!important;" >
                <vs-divider>Documentos Pagos</vs-divider>
                <ScreenPagosVue :sendPedido="pedido" ref="componentePagos"/>
                <br>
              </div>
            </div>
          </div>
           <!--VISTA OBSERVACION-->
           <div style="width: 100%;" class="mt-5" v-if="!userAsesor && pedido.contrato_generado">
            <vs-divider>Observación Pedido</vs-divider>
            <vs-textarea  counter="500" style="width:100%;" height="200px"  label="Observación" :counter-danger.sync="counterDanger" v-model="pedido.observacion" />
          </div>

          <!--VISTA VALORES ANTICIPOS ANTERIORES-->
          <div v-if="verAnticipos">
            <anticiposAnteriosVue :tmpPedidos="ObjectPedido" :anticipoAprobado="pedido.anticipo_aprobado" @sendDeuda="changeAnticipo"/>
          </div>
          <!--FIN VISTA VALORES ANTICIPOS ANTERIORES-->
          <!--FIN POPUP COMENTARIOS-->

    </vx-card>
  </div>
</template>
<script>
import {
    mapState
} from "vuex";
import Vue from 'vue';
import imageZoom from 'vue-image-zoomer';
import vSelect from 'vue-select';
import axios from 'axios'
const ScreenPagosVue                  = () => import('../pagos2/ScreenPagos2.vue')
const anticiposAnteriosVue            = () => import('../../../../pedidos/components/milton/anticiposAnterios.vue')
import PagosRepository from '../../../../../repositories/PagoRepository';
import PedidosRepository from "../../../../../repositories/PedidosRepository";

export default {
    components:{
      'v-select': vSelect,
      ScreenPagosVue,
      anticiposAnteriosVue,
      imageZoom,
    },
    data: () => ({
      usuario: [],
      id_pedido: '',
      pedido:{
        id_pedido: 0,
        periodo: '',
        tipo_venta: '',
        fecha_envio: '',
        fecha_entrega: '',
        institucion: '',
        asesor: '',
        descuento: '',
        anticipo: '',
        observacion:'',
        ruc:'',
        direccionInstitucion:'',
        nivel:'',
        tipo_descripcion:'',
        telefonoInstitucion:'',
        pendiente_liquidar:0,
        convenio_anios:'',
        anticipo_aprobado:0,
        contrato_generado:'',
        ifanticipo:false,
        ifagregado_anticipo_aprobado:0,
        deuda:0,
        periodo_deuda:'',
        region_idregion:0,
        historicoEstado:0,
        estado:0,

      },
      tmpPedidos:[],
      porcentaje_descuento_series_basicas:0,
      counterDanger: false,

      disableAsesor:false,
      disableFacturador:false,
      disableAsesorFacturador:false,
        //variables de coincidencias
      arregloIdsCoincidencias:[],
      verAnticipos:false,
      checkFueraPlataforma:false,
      //modificarAnticipoAprobado => 0 =NO; 1 SI;
      modificarAnticipoAprobado:0,
      campo:'',
    }),
    props:{
      ObjectPedido:{
        type:Object,
        default:function(){
            return {}
        },
        required:true
      },
      userAsesor:{
        type:Boolean,
        default:false,
      },
      groupFacturador:{
        type:Boolean,
        default:false,
      },
    },
    watch:{
      ObjectPedido(results){
        let me = this
        me.sendPedido = me.ObjectPedido
        me.pedido     = results
      },
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'userAdminFacturador','userFacturador']),
    },
    mounted() {
      let me = this;
      me.pedido = me.ObjectPedido
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      if(this.ObjectPedido.id_pedido == 0){
        localStorage.id_pedido = ''
      }else{
        localStorage.id_pedido = this.ObjectPedido.id_pedido
        me.updateDocumentos()
      }
      this.get_datos_pedido()
    },
    methods: {
      changeAnticipoA(e){
        let me = this
        if(e.tipo == 'guardarAnticipo'){
          me.pedido.ifagregado_anticipo_aprobado = 1
          me.pedido.anticipo_aprobado = e.value
          //si modifica el facturador o admin el anticipo aprobado lo guardare en un historico
          me.modificarAnticipoAprobado = e.modificarAnticipoAprobado
          me.updatePedido(2,'anticipo_aprobado',e.value,'ifagregado_anticipo_aprobado',1)
          return
        }
        if(e.tipo == 'guardarAnticipoContrato'){
          me.pedido.anticipo_aprobado = e.value
          me.saveAnticipoContrato()
        }
        if(e.tipo == 'guardar'){
          me.get_datos_pedido()
          return
        }
      },
      //metodo para actualizar la deuda en el anticipo
      changeAnticipo(e){
        let me = this
        // me.pedido.ifanticipo                   = true
        me.pedido.deuda                        = Math.abs(e.setDeuda)
        // me.pedido.anticipo_aprobado            = Math.abs(e.setDeuda)
        me.pedido.periodo_deuda                = "Deuda período "+ e.periodo
        // me.pedido.ifagregado_anticipo_aprobado = 1
        me.guardarDeuda()
      },
      guardarDeuda(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',                    me.pedido.id_pedido);
        // formData.append('ifanticipo',                   1);
        formData.append('deuda',                        me.pedido.deuda)
        // formData.append('anticipo_aprobado',            me.pedido.anticipo_aprobado)
        formData.append('periodo_deuda',                me.pedido.periodo_deuda)
        // formData.append('ifagregado_anticipo_aprobado', 1)
        this.$http.post(this.$server_url+'guardarPedidoDeuda', formData)
        .then(function (res) {

        })
        .catch(function (error) {})
      },
      //fin metodos para las deudas anteriores
      get_datos_pedido(){
        let me = this
        this.$http.get(this.$server_url+'get_datos_pedido/'+me.pedido.id_pedido)
        .then(res => {
          let datos = res.data.pedido[0]
          me.getIdsMilton(datos)
          //fin datos institucion
          //FIN SETEAR
          if(datos.ifanticipo == 1){
            me.pedido.ifanticipo = true
          }
          if(datos.ifanticipo == 0){
            me.pedido.ifanticipo = false
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      getIdsMilton(tr){
        let me = this
        var preCoincicias2 = ''
        var preArreglo = []
        if(tr.codigo_mitlon_coincidencias == "null" || tr.codigo_mitlon_coincidencias == null || tr.codigo_mitlon_coincidencias == ""){
        }else{
          let transforWords = tr.codigo_mitlon_coincidencias
          preCoincicias2 = transforWords.split(",")
        }
        //si no coincidencias en campo codigo milton coincidenias
        if(preCoincicias2 == ""){
        }else{
          preArreglo.push(preCoincicias2)
        }
        //setear array
        me.arregloIdsCoincidencias = preArreglo.flat()
        //no agregar ids duplicados
        let resolve = me.arregloIdsCoincidencias.filter( p => p == tr.codigo_institucion_milton )
        if(resolve.length == 0){
          me.arregloIdsCoincidencias.push(tr.codigo_institucion_milton)
        }
        me.verAnticipos = true
      },
      //GUADAR EL ANTICIPO DESPUES DEL CONTRATO
      saveAnticipoContrato(){
        let me = this;
        let formData = new FormData();
        formData.append('id_pedido',            me.pedido.id_pedido);
        formData.append('anticipo_aprobado',    me.pedido.anticipo_aprobado)
        formData.append('contrato',             me.pedido.contrato_generado)
        formData.append('user_created',         me.usuario.idusuario)
        formData.append('id_group',             me.usuario.id_group)
        me.$vs.loading()
        this.$http.post(this.$server_url+'guardarAnticipoAprobadoContrato', formData)
        .then(res => {
          me.$vs.loading.close()
          me.get_datos_pedido()
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch((e)=>{
          me.$vs.loading.close()
        })
      },
      updatePedido(numero,campo,valor,campo2,valor2){
        let me = this
        let formData = new FormData();
        if(numero == 1) { formData.append('unCampo', 'yes'); }
        if(numero == 2) { formData.append('actualizarDosCampo', 'yes'); }
        formData.append('id_pedido',                  me.pedido.id_pedido);
        formData.append('campo',                      campo)
        formData.append('campo2',                     campo2)
        formData.append('valor',                      valor)
        formData.append('valor2',                     valor2)
        me.$vs.loading()
        this.$http.post(this.$server_url+'updateThePedido', formData)
        .then(res => {
          me.$vs.loading.close()
          me.$emit('rechargePedido',true)
          me.get_datos_pedido()
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch((e)=>{
          me.$vs.loading.close()
        })
      },
      guardarPedido(){
        let me = this
        if(me.pedido.estado == 2){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'No se puede modificar el pedido anulado',
            time:5000,
            })
          return false
        }

        //actualizar fecha creacion pedido
        if(me.pedido.id_pedido > 0 && (me.usuario.id_group == 11 || this.userRoot)){
          me.UpdateFechaCreacionPedido(me.pedido.id_pedido)
        }
        let formData = new FormData();
        me.$vs.loading()
        formData.append('guardarTabAnticipo',   1)
        formData.append('id_pedido',            me.pedido.id_pedido);
        let ianticipo = 0
        if(me.pedido.ifanticipo) {
          ianticipo = 1
        }
        else{
          ianticipo = 0
        }
        formData.append('ifanticipo',           ianticipo);
        formData.append('anticipoAsesor',       me.pedido.anticipoAsesor)
        //fin para actualizar la institucion
        me.$vs.loading();
        this.$http.post(this.$server_url+'metodosPostPedidos',formData)
        .then(res => {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
            return
          }
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('rechargePedido',true)
          me.get_datos_pedido()
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
      },
      UpdateFechaCreacionPedido(id_pedido) {
        let me = this;
        this.$http.get(this.$server_url+'UpdateFechaCreacionPedido/'+id_pedido)
          .then(function (res) {
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      //===METODOS PARA ACTUALIZAR DOCUMENTOS ANTERIORES=====
      updateDocumentos(){
        let me = this;
        this.$http.get(this.$server_url+'updateDocumentoAnterior/'+me.ObjectPedido.id_pedido+'/'+'0')
          .then(function (res) {
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      },
      f_checkAnticipo(){
        let me = this
        let mensaje = ""
        if(me.pedido.ifanticipo){
          mensaje = "activar anticipo"
        }else{
          mensaje = "desactivar anticipo"
        }
        if(me.userAdminFacturador || me.userRoot){
          this.$vs.dialog({
            type:'confirm',
            color: 'danger',
            title: `Confirmar`,
            acceptText:'Si, deseo cambiar',
            cancelText:'Cancelar',
            text: `Estas seguro de ${mensaje} .`,
            accept:this.acceptCambiarAnticipo,
            cancel:this.cancelarCheckAnticipo
          })
          return
        }
      },
      cancelarCheckAnticipo(){
        this.pedido.ifanticipo = false
      },

      acceptCambiarAnticipo(){
        let me = this;
        me.campo = 'ifanticipo'
        let valor = 0
        if(me.pedido.ifanticipo){
          valor = 1
        }else{
          valor = 0
        }
        me.actualizarPedido(valor)
      },

      //===METODOS ROOT========
      actualizarPedido(valor){
        let me = this;
        let formData = new FormData();
        formData.append('actualizarCampo','yes')
        formData.append('campo',      me.campo)
        formData.append('id_pedido',  me.pedido.id_pedido);
        formData.append('valor',      valor);
        formData.append('user_created',me.usuario.idusuario)
        this.$http.post(this.$server_url+'actualizarPedido', formData)
        .then(function (res) {
          me.$vs.notify({
            text: res.data.message,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.get_datos_pedido()
          me.$emit('rechargePedido',true)
          me.$refs.componentePagos.recargarPagos();
        })
        .catch(function (error) {})
      },
      //===FIN METODO{S ROOT====
  },
}
</script>
<style scoped>
  @media(max-width: 540px) {
    .text-convenio{
      display: none;
    }
  }
  @media(max-width: 414px) {
    .text-anticipoA{
      width: 100%!important;
    }
    .btnGuardar{
      margin: 0 auto;
      margin-top: -20px;
    }
    .text-convenio{
      display: none;
    }
    .text-observacion{
      width: 100%!important;
      margin-top: -30px!important;
    }

    .text-imagen{
      margin-top: 10px;
      width: 100%!important;
    }
  }
  @media(max-width: 414px) {
    .deuda{
      width: 100%!important;
    }
  }
  @media(max-width: 1280px) {
    .contenedor-file{
      width: 80%!important;
      margin: 0 auto;
    }
  }
  @media(max-width: 540px) {
    .contenedor-file{
      width: 100%!important;
    }
    .upload-container input{
      padding:100px 0px 100px 77px!important;
      font-size: 12px!important;
    }
  }
  @media(max-width: 414px) {
    .contenedor-file{
      width: 100%!important;
    }
    .upload-container input{
      padding:100px 0px 100px 17px!important;
      font-size: 8px!important;
    }
  }
  @media(max-width: 375px) {
    .upload-container input{
      padding:100px 0px 100px 17px!important;
      font-size: 8px!important;
    }
    .text-convenio{
      display: none;
    }
    .text-observacion{
      width: 100%!important;
      margin-top: -30px!important;
    }
    .text-imagen{
      margin-top: 10px;
      width: 100%!important;
    }
    .text-anticipoA{
      width: 100%!important;
    }
    .btnGuardar{
      margin: 0 auto;
      margin-top: -10px;
    }
  }
  /*Estilos para subir foto */
  .upload-container{
      position:relative}
    .upload-container input{
      border:1px solid #92b0b3;
      background:#217bc5;
      outline:2px dashed #92b0b3;
      outline-offset:-10px;
      padding:100px 0px 100px 130px;
      width:100%;
      color:white;
    }
    .upload-container input:hover{
      background:#2c78cf}
    .upload-container:before{
      position:absolute;
      bottom:50px;
      left:26%;
      font-size: 13px;
      content:" Seleccione una archivo o arrastrelo ";
      color:#f1f9fa;
      font-weight:900;
    }
    input[type=file]::file-selector-button {
      margin-right: 10px;
      border: none;
      background: #000;
      padding: 10px 20px;
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      transition: background .2s ease-in-out;
    }
  input[type=file]::file-selector-button:hover {
    background: #0d45a5;
  }
</style>
