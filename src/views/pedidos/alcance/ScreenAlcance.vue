<template>
  <div>
    <div class="mt-3">
      <p class="text-warning">Alcance Id# {{ alcance.id }} de la institución <b>{{ alcance.nombreInstitucion }}</b>({{ alcance.ciudad }})</p>
      <vs-divider></vs-divider>
      <formlibros ref="formlibros" v-if="sendPedido.id_periodo <= mixinIdInicioFormatoNewData" :sendPedido="sendPedido" :Arrayalcance = "alcance" :selectifanticipo="pedido.ifanticipo" :anticipoAprobado="(pedido.anticipo_aprobado == pedido.deuda) ? pedido.anticipo_aprobado : pedido.anticipo_aprobado - pedido.deuda"/>
      <formlibros_new v-else-if="sendPedido.id_periodo > mixinIdInicioFormatoNewData" ref="formlibros" :sendPedido="sendPedido" :Arrayalcance="alcance" :selectifanticipo="pedido.ifanticipo" :anticipoAprobado="(pedido.anticipo_aprobado == pedido.deuda) ? pedido.anticipo_aprobado : pedido.anticipo_aprobado - pedido.deuda" />
      <div>
        <vs-textarea label="Observación" v-model="observacion_asesor" />
        <div class="flex justify-center">
          <vs-button @click="guardarAlcance();" color="success"><i class="fa-solid fa-comment"></i> Guadar comentario</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import vSelect from 'vue-select';
import formlibros from './form_libros.vue'
import formlibros_new from './form_libros_new.vue'
import axios from 'axios'
import anticiposAnteriosVue from '../components/milton/anticiposAnterios'
export default {
    components:{
      FormWizard,
      TabContent,
      'v-select': vSelect,
      formlibros,
      formlibros_new,
      anticiposAnteriosVue,
    },
    data: () => ({
      usuario: [],
      id_pedido: '',
      txt_finalizar: 'Finalizar',
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
      //variables para images
      src_imagen_opcion:'',
      img_opcion_old:'',
      verImg:false,
      popupImagen:false,
      errorImage:'no',
      tamanioError:'no',
      //fin variables para images
      //variables para ruc
      src_imagen_opcion_ruc:'',
      img_opcion_old_ruc:'',
      verImg_ruc:false,
      popupRuc:false,
      errorImage_ruc:'no',
      tamanioError_ruc:'no',
      selectifanticipo:false,
      //comentarios
      comentarios: [],
      input_comentario: '',
      popupComentarios: false,
      cant_sms: 0,
      //fin variables comentarios
      //variables de coincidencias
      arregloIdsCoincidencias:[],
      verAnticipos:false,
      //fin variables de coincidencias
      //variables para solicitud de mayor anticipo
      popupSolicitudAnticipo:false,
      solicitud:{
        id:0,
        valor:0,
        observacion:'',
        estado:0,
      },
      //fin variables para mayor anticipo
      //variable subir imagen
      attachmentArray:[],
      attachmentArray_ruc:[],
      //variables del alcance
      observacion_asesor:'',
      mixinIdInicioFormatoNewData: null,
      //fin variables del alcance
    }),
    props:{
      alcance: {
        type: [Array, Object], // Acepta tanto un Array como un Object
        default: () => [], // Valor predeterminado será un Array vacío
        required: true
      },
      sendPedido:{
        type:Object,
        default:'',
        required:true
      },
      userRoot:{
        type:Boolean,
        default:false,
      }
    },
    mounted() {
      let me = this;
      // Verifica si los datos existen en localStorage
      const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');            
      if (mixinData) {
      // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
      const parsedData = JSON.parse(mixinData);
      me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
      console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
      } else {
          console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
      }
      // FIN Verificación si los datos existen en localStorage
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.observacion_asesor = me.alcance.observacion_asesor
    },
    methods: {
    //METODOS DE ALCANCE
    async guardarAlcance(){
      let me = this
      if(me.observacion_asesor == "" || me.observacion_asesor == null || me.observacion_asesor == undefined){
      }else{
        if(me.observacion_asesor.length > 500){
          me.$vs.notify({ text: 'Máximo 500 caracteres.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle',time:4000 })
          return
        }
      }
      let formData = new FormData();
      formData.append('id',                 me.alcance.id)
      formData.append('only_observacion',   'yes');
      formData.append('observacion_asesor', me.observacion_asesor);
      this.$http.post(this.$server_url+'guardarValorAlcance', formData)
      .then(function (res) {
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
      })
      .catch(function (error) {})
    },
    //FIN METODOS DE ALCANCE
  },
  //FIN METODOS PARA SOLICITAR ANTICIPO

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
