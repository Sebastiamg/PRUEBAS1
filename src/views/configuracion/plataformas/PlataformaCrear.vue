<template>
  <div class="mt-5">
      <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input class="w-full" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Nombre" v-model="sendValor.nombre" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Enlace" v-model="sendValor.link" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                <span>Estado:</span>
                <ul class="flex">
                  <li>
                    <vs-radio v-model="sendValor.estado" class="mr-2" vs-name="radios1tipo_aplicar" vs-value="1">Activo</vs-radio>
                  </li>
                  <li>
                    <vs-radio v-model="sendValor.estado" class="mr-2" vs-name="radios1tipo_aplicar" vs-value="0">Desactivado</vs-radio>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--FIN TIPOS PAGOS FACTURACION-->
          <!--FILE-->
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              <p>Logo:</p>
              <p class="mt-1"></p>
              <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == false">
                  <div class=" box upload-container">
                      <input type="file" name="filePlataforma" id="filePlataforma" v-on:change="uploadFiles()" />
                  </div>
                  <br>
              </div>
              <!--BASE-->
              <div class="box-input" v-if="attachmentArray.length == 0 && ifSaveImagen == true">
                  <div class="flex" style="justify-content: center;">
                      <div class="flex" style="flex-direction: column;">
                          <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/configuracion/plataforma/'+imgOld" style="border-radius: 5px;margin: 0 auto;">
                          <small class="mt-1 ml-2">{{ imgOld }}</small>
                      </div>
                      <vs-button radius type="line" @click="ifSaveImagen = false;"  class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </div>
              </div>
              <!--LOCAL-->
              <div class="flex" style="margin-top: -10px;" v-if="attachmentArray.length > 0">
                  <div class="flex" v-for="(tr,key) in attachmentArray" :key="key" style="margin: 0 auto;">
                      <div class="flex" style="flex-direction: column;">
                          <img id="img1" v-if="tr.tipo == 'img'" width="200" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;margin: 0 auto;">
                          <img v-else style="width: 200px;"  src="@/assets/images/file-icons/doc.png"/>
                          <small class="mt-1 ml-2">{{ tr.name }}</small>
                      </div>
                      <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                  </div>
              </div>
          </div>
      </div>
      <div class="flex" style="justify-content: center;">
        <vs-button class="mr-3 mb-2" style="color:white;!important" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar</vs-button>
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
      //FIN VARIABLES IMAGEN
      sendValor:{
        nombre:'',
        link:'',
        estado:0,
      },
    }
  },
  props:{
    id:{
      type:Number,
      default:0
    },
    ObjectSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  created(){
    let me = this;
  },
  mounted(){
    let me = this;
    me.attachmentArray = []
    if(me.id > 0){
      me.sendValor =    {
        nombre:         me.ObjectSelect.nombre,
        link:           me.ObjectSelect.link,
        estado:         me.ObjectSelect.estado,
      }
      me.imgOld         = me.ObjectSelect.url
      if(me.imgOld){
        me.ifSaveImagen = true
      }
    }
  },
  methods:{
    removeItemFromArr (arr, item) {
        let me = this;
        const i = arr.indexOf(item)
        arr.splice(i, 1)
        document.getElementById("filePlataforma").value = ''
    },
    uploadFiles(){
        let me = this;
        me.attachmentArray = []
        var archivo = document.getElementById("filePlataforma").files[0];
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
    subirDocumento(){
      let me = this;
      let formData = new FormData();
      formData.append('saveValorPlataforma',      "yes")
      formData.append('id',                       me.id)
      formData.append('nombre',                   me.sendValor.nombre)
      formData.append('link',                     me.sendValor.link)
      formData.append('estado',                   me.sendValor.estado)
      formData.append('user_created',             me.usuario.idusuario)
      //informacion
      me.$vs.loading()
      this.$http.post(this.$server_url+'plataformas/plataformas', formData)
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
          let getId = res.data.id
          me.$vs.notify({
          text:"Se guardo correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.saveEvidencia(getId)
      })
      .catch(function (error) {
          me.$vs.loading.close()
      })
    },
    saveEvidencia(getId){
      let me = this
      //files
      let imgsEnviar = []
      let formData = new FormData();
      if(me.ifSaveImagen || me.attachmentArray.length == 0){
        formData.append('noSendFiles','yes')
        me.$emit('showCreate',0)
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
      formData.append('archivoPlataforma',    'yes')
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      axios.post(this.$data_url + 'api/guardarDatosPedido', formData, config)
      .then(function (res) {
        me.$emit('showCreate',0)
      })
      .catch(function (error) {
      })
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
