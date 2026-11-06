<template>
  <div>
    <div class="vx-row">
        <!--FIN TIPOS PAGOS FACTURACION-->
        <!--FILE-->
        <div class="vx-col w-full mb-6">
            <p class="ml-2">Logo:</p>
            <p class="mt-1"></p>
            <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                <div class=" box upload-container">
                    <input type="file" name="fileEmpresa" id="fileEmpresa" v-on:change="uploadFiles()" />
                </div>
                <br>
            </div>
            <!--BASE-->
            <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                <div class="flex" style="justify-content: center;">
                    <div class="flex" style="flex-direction: column; width: 100%;">
                        <img id="img1" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/facturacion/empresa/'+imgOld" style="border-radius: 5px; width: 100%; max-width: 100%;">
                        <small class="mt-1 ml-2">{{ imgOld }}</small>
                    </div>
                    <vs-button radius type="line" @click="ifSaveImagen = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div>
            <!--LOCAL-->
            <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto; width: 100%;">
                    <div class="flex" style="flex-direction: column; width: 100%;">
                        <img id="img1" v-if="tr.tipo == 'img'" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px; width: 100%; max-width: 100%;">
                        <img v-else style="width: 100%; max-width: 100%;"  src="@/assets/images/file-icons/doc.png"/>
                        <small class="mt-1 ml-2">{{ tr.name }}</small>
                    </div>
                    <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div>
        </div>
    </div>
    <div class="flex" style="justify-content: center;">
      <vs-button class="mr-3 mb-2" style="color:white!important;" color="success" icon-pack="feather" icon="icon-save" @click="subirDocumento()">Guardar</vs-button>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import axios from 'axios'
export default{
  components:{
    vSelect,
  },
  data(){
    return{
      //VARIABLES IMAGEN
      attachmentArray:[],
      tipoFile:'',
      ifSaveImagen:false,
      imgOld:'',
      ifImagenBd:false,
      base64Image: '',
      //FIN VARIABLES IMAGEN
    }
  },
  props:{
    id:{
      type:Number,
      default:0
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    ObjectPadre:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  created(){
    let me = this;
  },
  mounted(){
    let me = this;
    me.attachmentArray = []
    if(me.id > 0){
      me.imgOld         = me.ObjectPadre.url
      if(me.imgOld){
        me.ifSaveImagen = true
        me.ifImagenBd   = true
      }
    }else{
      me.ifSaveImagen = false
    }
  },
  watch:{
    ObjectPadre(results){
      this.ObjectPadre = results
    },
  },
  methods:{
    removeItemFromArr (arr, item) {
        let me = this;
        const i = arr.indexOf(item)
        arr.splice(i, 1)
        document.getElementById("fileEmpresa").value = ''
    },
    uploadFiles(){
        let me = this;
        me.attachmentArray = []
        var archivo = document.getElementById("fileEmpresa").files[0];
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
                me.base64Image = reader.result;
                me.attachmentArray.push(cal)
            }
        }
    },

    subirDocumento() {
      let me = this;
      let formData = new FormData();

      // Trim de campos obligatorios
      me.ObjectPadre.nombre = me.ObjectPadre.nombre ? me.ObjectPadre.nombre.trim() : '';
      me.ObjectPadre.descripcion_corta = me.ObjectPadre.descripcion_corta ? me.ObjectPadre.descripcion_corta.trim() : '';
      me.ObjectPadre.direccion = me.ObjectPadre.direccion ? me.ObjectPadre.direccion.trim() : '';
      me.ObjectPadre.representante = me.ObjectPadre.representante ? me.ObjectPadre.representante.trim() : '';
      me.ObjectPadre.ruc = me.ObjectPadre.ruc ? me.ObjectPadre.ruc.trim() : '';
      me.ObjectPadre.telefono = me.ObjectPadre.telefono ? me.ObjectPadre.telefono.trim() : '';
      me.ObjectPadre.email = me.ObjectPadre.email ? me.ObjectPadre.email.trim() : '';

      // Validación: RUC obligatorio y solo números
      if (!me.ObjectPadre.ruc) {
        me.$vs.notify({
          text: "El campo RUC es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }
      if (!/^\d+$/.test(me.ObjectPadre.ruc)) {
        me.$vs.notify({
          text: "El campo RUC debe contener solo números",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Validación: Nombre obligatorio
      if (me.ObjectPadre.nombre === '') {
        me.$vs.notify({
          text: "El campo Nombre es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Validación: Descripción corta obligatoria
      if (me.ObjectPadre.descripcion_corta === '') {
        me.$vs.notify({
          text: "El campo Descripción Corta es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Validación: Dirección obligatoria
      if (me.ObjectPadre.direccion === '') {
        me.$vs.notify({
          text: "El campo Dirección es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Validación: Representante obligatorio
      if (me.ObjectPadre.representante === '') {
        me.$vs.notify({
          text: "El campo Representante es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Validación: Teléfono obligatorio y solo números
      if (me.ObjectPadre.telefono === '') {
        me.$vs.notify({
          text: "El campo Teléfono es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }
      if (!/^\d+$/.test(me.ObjectPadre.telefono)) {
        me.$vs.notify({
          text: "El campo Teléfono debe contener solo números",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Validación: Email obligatorio y con formato válido
      if (me.ObjectPadre.email === '') {
        me.$vs.notify({
          text: "El campo Email es obligatorio",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(me.ObjectPadre.email)) {
        me.$vs.notify({
          text: "El campo Email no tiene un formato válido",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      // Manejo de imagen
      if (me.ifSaveImagen == false && me.attachmentArray.length == 0 && me.ifImagenBd) {
        formData.append('archivo', 'no');
        formData.append('url', 'no');
        formData.append('img_base64', 'sinimagen');
      } else {
        formData.append('img_base64', me.base64Image);
      }

      // Agregando datos al formData
      formData.append('id', me.id);
      formData.append('tipo', me.ObjectPadre.tipo);
      formData.append('nombre', me.ObjectPadre.nombre);
      formData.append('descripcion_corta', me.ObjectPadre.descripcion_corta);
      formData.append('representante', me.ObjectPadre.representante);
      formData.append('direccion', me.ObjectPadre.direccion);
      formData.append('ruc', me.ObjectPadre.ruc);
      formData.append('email', me.ObjectPadre.email);
      formData.append('telefono', me.ObjectPadre.telefono);
      formData.append('secuencial', me.ObjectPadre.secuencial | 1);
      formData.append('estado', me.ObjectPadre.estado);
      formData.append('facturas', me.ObjectPadre.facturas);
      formData.append('notas', me.ObjectPadre.notas);
      formData.append('token_local', me.ObjectPadre.token_local || '');
      formData.append('token_prod', me.ObjectPadre.token_prod || '');
      formData.append('contifico_api_key', me.ObjectPadre.contifico_api_key || '');
      formData.append('contifico_pos_token', me.ObjectPadre.contifico_pos_token || '');
      formData.append('perseo_enviroment', me.ObjectPadre.perseo_enviroment || 0);
      formData.append('porcentaje_acta_guias', me.ObjectPadre.porcentaje_acta_guias || 0);
      // Envío del formulario
      this.$http.post(this.$server_url + 'empresa', formData)
        .then(res => {
          let getId = res.data.id;
          me.$vs.notify({
            text: "Se guardó correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
          me.saveEvidencia(getId);
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveEvidencia(getId){
      let me = this
      //files
      let imgsEnviar = []
      let formData = new FormData();
      if(me.ifSaveImagen || me.attachmentArray.length == 0){
        formData.append('noSendFiles','yes')
        this.$emit('f_creado', 1);
        return
      }else{
        me.attachmentArray.forEach(element => {
        imgsEnviar.push(element.file)
        });
        for(let i=0; i<this.attachmentArray.length;i++){
            formData.append('archivos[]',              imgsEnviar[i]);
        }
      }
      formData.append('id',                   getId)
      formData.append('saveArchivos',         'yes')
      formData.append('imgOld',               me.imgOld)
      formData.append('archivoEmpresa',       'yes')
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      axios.post(this.$data_url + 'api/guardarDatosPedido', formData, config)
      .then(function (res) {
        me.regresar()
      })
      .catch(function (error) {
        console.log(error);
        me.$vs.loading.close()
        me.$vs.notify({
          title: 'Error',
          text: 'Hubo un error al subir los archivos',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      })
    },
    regresar(){
      this.$emit('f_creado', 1);
    }
  }
}


</script>
<style scoped>
 .box-input{
 }
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
      left:23%;
      content:" Seleccione un archivo o arrastre aqui ";
      color:#f1f9fa;
      font-weight:900
  }
    .upload-btn{
      margin-left:300px;
      padding:7px 20px}
</style>
