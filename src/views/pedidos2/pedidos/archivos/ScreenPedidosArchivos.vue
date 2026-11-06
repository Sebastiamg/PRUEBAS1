<template>
  <div>
    <vs-divider>
      <div class="flex">
        <p>Documentos</p>
      </div>
    </vs-divider>
      <div class="flex" style="width: 100%;justify-content: space-between;flex-wrap: wrap;">
        <!--====UPLOAD CEDULA===-->
        <div style="width: 40%;" class="contenedor-file">
          <p style="text-align: center;margin-left: -10px;"><i class="fa-solid fa-cloud"></i> Foto de la copia de la cédula imagen/pdf (Máximo 5 MB)</p>
          <div class="box-input" v-show="attachmentArray.length == 0 && verImg == false">
            <div class=" box upload-container">
                <input type="file" name="file10" id="file10" class="file10" v-on:change="uploadFiles" />
            </div>
            <br>
          </div>
          <!--IMAGEN DE LA BASE-->
          <div class="box-input" v-if="attachmentArray.length == 0 && verImg == true">
            <div class="flex" style="justify-content: center;">
              <div class="flex" style="flex-direction: column;">
                <img id="img1" v-if="img_opcion_old.substr(-3) == 'pdf'"  @click="verArchivo(0)" width="200" class="img-responsive mb-2 ml-1 cursor-pointer" src="@/assets/images/file-icons/pdf.png" style="border-radius: 5px;margin: 0 auto;">
                <img id="img1" v-else width="200" @click="verImagen(0)" class="img-responsive mb-2 ml-1 cursor-pointer"  v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old" style="border-radius: 5px;margin: 0 auto;">
                <small class="mt-1 ml-2 text-center">{{ img_opcion_old }}</small>
              </div>
              <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                <vs-button radius type="line" v-if="userAsesor || userRoot || userAdminFacturador" @click="verImg = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
              </vx-tooltip>
              </div>
          </div>
          <!--ARRAY IMAGENES-->
          <div class="flex mt-1" style="margin-top: -10px;" v-if="attachmentArray.length > 0" >
            <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                <div class="flex" style="flex-direction: column;">
                  <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                  <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                  <small class="mt-1 ml-2 text-center">{{ tr.name }}</small>
                </div>
                <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                  <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr,0)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </vx-tooltip>
              </div>
          </div>
        </div>
        <!--=====UPLOAD RUC===-->
        <div style="width: 40%;" class="contenedor-file">
          <p style="text-align: center;margin-left: -10px;"><i class="fa-solid fa-cloud"></i> Archivo del RUC imagen/pdf (Máximo 5 MB)</p>
          <br>
          <div class="box-input" v-show="attachmentArray_ruc.length == 0 && verImg_ruc == false">
            <div class=" box upload-container">
              <input type="file" name="file11" id="file11" class="file11" v-on:change="uploadFilesRUC" />
            </div>
            <br>
          </div>
          <!--IMAGEN DE LA BASE-->
          <div class="box-input" v-if="attachmentArray_ruc.length == 0 && verImg_ruc == true">
            <div class="flex" style="justify-content: center;">
              <div class="flex" style="flex-direction: column;">
                <img id="img1" v-if="img_opcion_old_ruc.substr(-3) == 'pdf'"  @click="verArchivo(1)" width="200" class="img-responsive mb-2 ml-1 cursor-pointer" src="@/assets/images/file-icons/pdf.png" style="border-radius: 5px;margin: 0 auto;">
                <img id="img1" v-else width="200" @click="verImagen(1)" class="img-responsive mb-2 ml-1 cursor-pointer"  v-bind:src="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc" style="border-radius: 5px;margin: 0 auto;">
                <small class="mt-1 ml-2 text-center">{{ img_opcion_old_ruc }}</small>
              </div>
              <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                <vs-button radius type="line"  @click="verImg_ruc = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
              </vx-tooltip>
              </div>
          </div>
          <!--ARRAY IMAGENES-->
          <div class="flex mt-1" style="margin-top: -10px;" v-if="attachmentArray_ruc.length > 0" >
            <div class="flex" v-for="(tr,key) in attachmentArray_ruc" :key="key" style="margin: 0 auto;">
                <div class="flex" style="flex-direction: column;">
                  <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                  <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                    <small class="mt-1 ml-2">{{ tr.name }}</small>
                </div>
                <vx-tooltip style="display: inline-block;" text="Cambiar foto" position="top" color="primary">
                  <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray_ruc,tr,1)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </vx-tooltip>
              </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-5 mr-5">
        <vs-button v-if="arregloDocumentosAnteriores.length > 0"  @click="cargarTodosDocumentos(2)" class="mr-3 mb-2 p-2" icon-pack="feather" icon="icon-corner-down-left">Cargar Documentos Anteriores</vs-button>
        <vs-button @click="subirDocumentosDespuesContrato()" color="success" type="border" icon-pack="feather" icon="icon-file-text" class="mb-2">Guardar Documentos</vs-button>
      </div>
    <!--FIN BOTONES PARA GUARDAR/CARGAR DOCUMENTOS-->
    <!---MODALES-->
    <!--VER CEDULA-->
    <vs-popup class="holamundo" fullscreen  title="Mostrar foto de evidencia" :active.sync="popupImagen">
      <div v-if="popupImagen">
        <image-zoom
          :regular="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old"
          :zoom-amount="3"
          :click-zoom="true"
          click-message="De click para aumentar"
          img-class="img-fluid"
          >
        </image-zoom>
      </div>
    </vs-popup>
    <!--VER RUC-->
    <vs-popup class="holamundo" fullscreen  title="Mostrar File RUC" :active.sync="popupRuc">
      <div v-if="popupRuc">
          <image-zoom
          :regular="$data_url+'archivos/pedidos/img/img_cedula/'+img_opcion_old_ruc"
          :zoom-amount="3"
          :click-zoom="true"
          click-message="De click para aumentar"
          img-class="img-fluid"
          >
        </image-zoom>
      </div>
    </vs-popup>
    <!--MODAL PARA AGREGAR DOCUMENTOS ANTERIORES-->
    <vs-popup classContent="popup-example" fullscreen title="Documentos Anteriores" :active.sync="popupMostrarDocumentosAnteriores">
      <documentosAnterioresVue :tmpPedidos="sendPedido" v-if="popupMostrarDocumentosAnteriores" :arregloDocumentosAnteriores="arregloDocumentosAnteriores" @rechargeDocumentos="rechargeDocumentos"/>
    </vs-popup>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
import Generalmix from "../../../../mixins/Generalmix";
import axios from "axios";
import imageZoom from 'vue-image-zoomer';
import PedidosRepository from "../../../../repositories/PedidosRepository";
const documentosAnterioresVue = () => import('../../../pedidos/components/documentosAnteriores/documentosAnteriores.vue')
export default {
  mixins: [Generalmix],
  components: {
    imageZoom,
    documentosAnterioresVue,
  },
  data(){
    return{
      usuario:[],
      sendPedido: [],
      arregloDocumentosAnteriores: [],
      popupMostrarDocumentosAnteriores: false,
      //variable subir imagen
      attachmentArray:[],
      attachmentArray_ruc:[],
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
      //fin variables para ruc
    }
  },
  computed: {
    ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor','userAdminFacturador']),
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  mounted(){
    let me = this
    me.sendPedido = me.ObjectPedido
    this.get_datos_pedido()
    this.cargarTodosDocumentos(1)
  },
  watch: {
    ObjectPedido(results) {
      let me = this
      me.sendPedido = me.ObjectPedido
    },
  },
  methods: {
    get_datos_pedido(){
      let me = this
      this.$http.get(this.$server_url+'get_datos_pedido/'+me.sendPedido.id_pedido)
      .then(res => {
        let datos = res.data.pedido[0]
        me.img_opcion_old                 = datos.imagen
        //RUC
        me.img_opcion_old_ruc             = datos.doc_ruc
        //SETEAR CEDULA
        if(me.img_opcion_old == null || me.img_opcion_old == "" || me.img_opcion_old == "null"){
          me.verImg = false;
        }else{
          me.verImg = true;
        }
        //SETEAR RUC
        if(me.img_opcion_old_ruc == null || me.img_opcion_old_ruc == "" || me.img_opcion_old_ruc == "null"){
          me.verImg_ruc = false;
        }else{
          me.verImg_ruc = true;
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    cargarTodosDocumentos(proceso){
      let me = this;
      me.$vs.loading()
        this.$http.get(this.$server_url+'getTraerDocumentoDocente/'+me.sendPedido.id_pedido)
        .then(function (res) {
          me.$vs.loading.close()
          let datos = res.data
          me.arregloDocumentosAnteriores       = datos.filter(p => p.id_periodo != me.sendPedido.id_periodo)
          if(proceso == 2 && me.arregloDocumentosAnteriores.length > 0) {  me.popupMostrarDocumentosAnteriores = true }
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
    },
    subirDocumentosDespuesContrato(){
      let me = this
      if(me.sendPedido.estado == 2){
        me.m_message("No se puede modificar el pedido anulado", "warning","icon-check",5000)
        return false
      }
      var fileImgPreg = ""
      var fileImgPreg_ruc = ""
      if(me.sendPedido.anticipo > 0 && me.userAsesor){
        if(me.verImg == false){
          //subir la foto de la cedula de anticipo
          if(me.attachmentArray.length == 0){
            me.$vs.notify({
              text: "Suba la foto de la cédula por favor",
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
        }
        if(me.verImg_ruc == false){
          //subir el archivo para el RUC
          if(me.attachmentArray_ruc.length == 0){
            me.$vs.notify({
              text: "Suba el archivo del ruc por favor",
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
        }
        //VALIDACION CEDULA
        if(me.tamanioError == 'yes'){
          me.$vs.notify({
          text:'El tamaño de la imagen de la cedula excede 5MB',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(me.errorImage == 'yes'){
          me.$vs.notify({
          text:'El formato de la imagen de la cedula solo se acepta jpg/png/jpeg/pdf',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //VALIDACION RUC
        if(me.tamanioError_ruc == 'yes'){
          me.$vs.notify({
          text:'El tamaño del archivo del ruc excede 5MB',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(me.errorImage_ruc == 'yes'){
          me.$vs.notify({
          text:'El formato del archivo del ruc solo se acepta jpg/png/jpeg/pdf',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
      }
      //CEDULA
      if(document.getElementById("file10") != null){
        fileImgPreg     = document.getElementById("file10").files[0];
      }
      //RUC
      if(document.getElementById("file11") != null){
        fileImgPreg_ruc = document.getElementById("file11").files[0];
      }
      let formData = new FormData();
      me.actualizarPedidoSinValor("documentos Imagenes")
      me.$vs.loading()
      formData.append('id_pedido',            me.sendPedido.id_pedido);
      //cedula
      formData.append('imagen',               fileImgPreg);
      formData.append('img_opcion_old',       me.img_opcion_old)
      //ruc
      formData.append('doc_ruc',              fileImgPreg_ruc);
      formData.append('img_opcion_old_ruc',   me.img_opcion_old_ruc)
      //fin para actualizar la institucion
      me.$vs.loading();
      axios.post(this.$data_url+'api/guardarDocumentosDespuesContrato',formData)
      .then(res => {
        me.$vs.loading.close();
        if(res.data.status == 0){
          me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-check', time:8000 })
          return
        }
        if( res.data.error ){
          alert(res.data.error)
          return
        }else{
          me.src_imagen_opcion     = '';
          me.src_imagen_opcion_ruc = "";
          if(me.sendPedido.anticipo > 0 && (me.usuario.id_group == 11 || this.userRoot)){
            document.getElementById("file10").value = '';
            document.getElementById("file11").value = '';
          }
        }
        me.$vs.notify({
        text:'Se guardo correctamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.updateDocumentos()
        me.rechargePedido()
      })
      .catch(err => {
        console.log(err)
        me.$vs.loading.close();
      })
    },
    actualizarPedidoSinValor(campo){
        let me = this;
        let formData = new FormData();
        //noCambios cuando no voy a actualizar nada solo voy a poner en el historico que hubo cambio en el convenio
        formData.append('noCambios',  "yes")
        formData.append('campo',      campo)
        formData.append('id_pedido',  me.sendPedido.id_pedido);
        formData.append('valor',      "");
        formData.append('user_created',me.usuario.idusuario)
        this.$http.post(this.$server_url+'actualizarPedido', formData)
        .then(function (res) {
        })
        .catch(function (error) {})
    },
    verArchivo(tip){
      let me = this;
      var url
      //tipo = 0 cedula ; 1 = ruc
      if(tip == 0){
        url = this.$data_url+'archivos/pedidos/img/img_cedula/'+me.img_opcion_old
      }else{
        url = this.$data_url+'archivos/pedidos/img/img_cedula/'+me.img_opcion_old_ruc
      }
      window.open(url)
    },

    verImagen(archivo){
      let me = this;
      //cedula
      if(archivo == 0) { me.popupImagen = true }
      else             { me.popupRuc = true }
    },
    uploadFiles(e){
      let me = this;
      me.attachmentArray    = []
      me.verImg             = false
      me.src_imagen_opcion  = ' ';
      me.errorImage = 'no'
      me.tamanioError="no"
      let validar = e.target.files[0].type;
      let tamanio = e.target.files[0].size;
      if(tamanio > 5000000){
        me.tamanioError="yes"
        me.$vs.notify({
        text:'El tamaño de la imagen excede 5MB',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg' || validar == 'application/pdf'){
        me.errorImage = 'no'
      }else{
        me.errorImage = 'yes'
        me.$vs.notify({
        text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg/pdf',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      //var archivo = document.getElementById("file1").files[0];
      var archivo = e.target.files[0];
      me.tipoFile  = ""
      if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile = "img"
      else me.tipoFile = "other"
      var reader = new FileReader();
      if (me) {
        reader.readAsDataURL(archivo );
        reader.onloadend = function () {
          var cal = new Object();
          cal.file = archivo
          cal.img  = reader.result
          cal.tipo = me.tipoFile
          cal.name = archivo.name
          me.attachmentArray.push(cal)
        }
      }
    },
    uploadFilesRUC(e){
      let me = this;
      me.attachmentArray_ruc    = []
      me.verImg_ruc             = false
      me.src_imagen_opcion_ruc  = ' ';
      me.errorImage_ruc         = 'no'
      me.tamanioError_ruc       = "no"
      let validar = e.target.files[0].type;
      let tamanio = e.target.files[0].size;
      if(tamanio > 5000000){
        me.tamanioError_ruc     = "yes"
        me.$vs.notify({
        text:'El tamaño de la imagen excede 5MB',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg' || validar == 'application/pdf'){
        me.errorImage_ruc = 'no'
      }else{
        me.errorImage_ruc = 'yes'
        me.$vs.notify({
        text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg/pdf',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      //var archivo = document.getElementById("file1").files[0];
      var archivo = e.target.files[0];
      me.tipoFile_ruc  = ""
      if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") me.tipoFile_ruc = "img"
      else me.tipoFile_ruc = "other"
      var reader = new FileReader();
      if (me) {
        reader.readAsDataURL(archivo );
        reader.onloadend = function () {
          var cal = new Object();
          cal.file = archivo
          cal.img  = reader.result
          cal.tipo = me.tipoFile_ruc
          cal.name = archivo.name
          me.attachmentArray_ruc.push(cal)
        }
      }
    },
    removeItemFromArr (arr, item,archivo) {
      //cedula
      if(archivo == 0){
        this.verImg = false
        document.getElementById("file10").value = '';
      }else{
        this.verImg_ruc = false
        document.getElementById("file11").value = '';
      }
      const i = arr.indexOf(item)
      arr.splice(i, 1)
    },
    //===METODOS DOCUMENTOS ANTERIORES========
    rechargeDocumentos(e){
      let me = this;
      //0 => only recharge; 1 => recharge and load pedido
      if(e == 0){
        me.popupMostrarDocumentosAnteriores = false;
      }
      if(e == 1){
        me.popupMostrarDocumentosAnteriores = false;
        me.get_datos_pedido()
        me.updateDocumentos()
        me.rechargePedido()
      }
    },
    updateDocumentos(){
      let me = this;
      this.$http.get(this.$server_url+'updateDocumentoAnterior/'+me.sendPedido.id_pedido+'/'+'0')
        .then(function (res) {
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    rechargePedido() {
      let me = this
      PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => { this.$store.dispatch('setPedido', r.data[0]); })
    },
  }
}
</script>
<style scoped>
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

