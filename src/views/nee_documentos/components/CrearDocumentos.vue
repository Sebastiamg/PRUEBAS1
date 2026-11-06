<template>
  <div class="mt-2">
    <vs-tabs :color="'#F5B041'">
      <vs-tab label="Registro" icon-pack="feather" icon="icon-file-plus" @click="menu = '0';">
      </vs-tab>
      <vs-tab label="Actividades" icon-pack="feather" icon="icon-award"  @click="menu = '1';">
      </vs-tab>
    </vs-tabs>
    <div v-if="menu == 0">
      <div class="vx-row mt-2">
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
          <div style="font-size: 12px; ">Tema: </div>
          <v-select class="mb-4 w-full" v-model="temaSelect" :options="arregloTemas" label="nombre" :reduce="arregloTemas => arregloTemas.id" />
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
          <vs-input type="text" class="inputx w-full mb-6" v-model="datos.nombre" maxlength="200" label="Nombre " />
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
          <vs-input type="text" class="inputx w-full mb-6" v-model="datos.descripcion" maxlength="200" label="Descripción " />
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
          <small>Solucionario</small> <br />
          <form class="mt-2">
            <vs-radio vs-name="radios1solucionario" v-model="datos.solucionario" class="mr-2"  vs-value="1">Si</vs-radio>
            <vs-radio vs-name="radios1solucionario" v-model="datos.solucionario" vs-value="0">No</vs-radio>
          </form>
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
          <small>Documento General</small> <br />
          <form class="mt-2">
            <vs-radio vs-name="radios1tipo" v-model="datos.tipo" class="mr-2"  vs-value="1">Si</vs-radio>
            <vs-radio vs-name="radios1tipo" v-model="datos.tipo" vs-value="0">No</vs-radio>
          </form>
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left" v-if="datos.tipo == '0'">
          <small>Subnivel</small> <br />
          <v-select :options="arregloNiveles" :reduce="arregloNiveles => arregloNiveles.id" label="nombre" class="w-full" v-model="datos.subnivel" />
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
          <small>Estado</small> <br />
          <form>
              <vs-radio vs-name="radios1estado"  class="mt-2 mr-2" v-model="datos.estado" vs-value="1">Activo</vs-radio>
              <vs-radio vs-name="radios1estado"  class="mt-2" v-model="datos.estado" vs-value="0">Inactivo</vs-radio>
          </form>
        </div>
        <vs-divider>Archivos</vs-divider>
        <div style="margin-top: -5px;" class="ml-4">
          <p class="font-bold letra">Seleccione los archivos (Máximo 20 MB):</p>
          <br>
          <p>
            <input type="file" name="file1" id="file1" multiple class="inputfile" style="display: none;" v-on:change="mostrarImg">
            <label for="file1" class="farchivo">
                <ion-icon name="download-outline" style="position: relative;top:3px;font-size: 15px;"></ion-icon> <span class="ml-1" style="font-size: 12px;">Buscar Archivo</span>
            </label>
          </p>
        </div>
        <br>
      </div>
      <br>
      <div class="row mt-1">
        <div class="flex">
          <div class="flex" v-for="(tr,key) in attachmentArray" :key="key">
              <div class="flex ml-2" style="flex-direction: column;">
                  <!--BASE-->
                  <div v-if="tr.local == 1">
                      <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/neetFiles/'+tr.url" style="border-radius: 5px;max-height: 60px;">
                      <img v-if="tr.tipo == 'other'" style="max-height: 60px;width: 50px;"  src="@/assets/images/file-icons/doc.png"/>
                      <br><small class="mt-1">{{ tr.name }}</small>
                  </div>
                  <!--LOCAL-->
                  <div v-else>
                      <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;max-height: 60px;">
                      <img v-else style="max-height: 60px;width: 50px;"  src="@/assets/images/file-icons/doc.png"/>
                      <small class="mt-1">{{ tr.name }}</small>
                  </div>
              </div>
              <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
          </div>
        </div>
      </div>
      <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
        <vs-button :icon="btn_icon" class="ml-2" :color="btn_color" @click="f_guardar()">{{ btn_txt }}</vs-button>
      </div>
    </div>
    <div v-if="menu == 1">
      <div v-if="ficha.id != undefined">
        <TabActividadesNeetVue :objectDocumento="ficha"/>
      </div>
      <div v-else>
        <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
          Registre el documento para ingresar actividades por favor
        </vs-alert>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import vSelect from 'vue-select';
import TabActividadesNeetVue from './TabActividadesNeet.vue';
export default {
  components: {
    'v-select': vSelect,
    TabActividadesNeetVue
  },
  data() {
      return {
        usuario:[],
        btn_icon: '',
        btn_color: '',
        btn_txt: '',
        mensaje: '',
        temaSelect: {},
        modalAdd: false,
        listaDatos: [],
        datos: {
        },
        titulo: '',
        //variables de files
        attachmentArray:[],
        //fin variables de files
        //variables para subniveles
        arregloNiveles:[],
        //fin variables para subniveles
        menu:0,
      }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted() {
    let me = this;
    me.f_agregar(me.ficha)
    me.getNiveles()
  },
  props:{
    ficha:{
      type:Object,
      default:{}
    },
    arregloTemas:{
      type:Array,
      default:[]
    },
    setTema:{
      type:Number,
      default:0,
    }
  },
  methods: {
    getNiveles(){
      let me = this
      this.$http.get(this.$server_url+`neetTema?listadoSubniveles=yes`)
      .then(res => {
        me.arregloNiveles = res.data.filter(p => p.id != '5');
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getFiles(){
      let me = this;
      this.$http.get(this.$server_url + 'neetTema/'+me.ficha.id)
        .then(res => {
          let datos         = res.data.files
          if(me.datos.length == 0){
            me.attachmentArray = []
            return
          }
          datos.forEach(element => {
            var cal = new Object();
            cal.id          = element.id
            cal.ficha_id    = element.ficha_id
            cal.name        = element.archivo
            cal.url         = element.url
            let tipo = ""
            if(element.ext == "PNG" || element.ext == "png" || element.ext == "JPEG" || element.ext == "jpeg" || element.ext == "JPG" || element.ext == "jpg"){
                tipo = "img"
            }
            else{
                tipo = "other"
            }
            cal.tipo        = tipo
            cal.local       = 1
            me.attachmentArray.push(cal)
          });
        })
        .catch(error => {
            console.log(error)
        })
    },
    f_agregar() {
      let me = this;
      let item = me.ficha
      me.datos = {
        'id': 0,
        'nombre': '',
        'descripcion': '',
        'estado': 1,
        'tipo' :0,
        'subnivel':'',
        'solucionario':'0'
      }
      me.btn_icon = 'save';
      me.btn_color = 'success';
      me.btn_txt = 'Agregar';
      me.titulo = 'Agregar';
      me.mensaje = 'Se registrado correctamente';
      me.temaSelect = me.setTema
      if (item.id != undefined) {
        me.getFiles()
        me.btn_icon = 'edit';
        me.btn_color = 'warning';
        me.btn_txt = 'Editar';
        me.titulo = 'Editar';
        me.datos = {
          'id':           item.id,
          'nombre':       item.nombre,
          'descripcion':  item.descripcion,
          'estado':       item.estado,
          'subnivel':     item.nee_subnivel,
          'tipo':         item.tipo,
          'solucionario': item.solucionario
        }
        me.temaSelect     = item.tema_id
        me.mensaje = 'Se edito correctamente';
      }
    },
    f_guardar() {
      let me = this;
      if(me.attachmentArray.length == 0){
        me.$vs.notify({
          text: "Suba un archivo al menos",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      if(me.datos.tipo == '0'){
        //datos que se obtienen de los inputs
        if(me.datos.subnivel == '' || me.datos.subnivel == undefined || me.datos.subnivel == null){
          msj = 'Debe seleccionar un sub nivel por favor';
          me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
          return;
        }
      }
      let msj;
      if (me.datos.nombre == '') {
        msj = 'Ingrese el nombre';
        me.f_notificaciones(msj, 'danger', 'icon-alert-triangle')
        return
      }
      if(me.temaSelect == null || me.temaSelect == "" || me.temaSelect == undefined){
        me.f_notificaciones('Seleccione un tema por favor', 'danger', 'icon-alert-triangle')
        return
      }
      let formData = new FormData();
      //files
      //enviar solo los files locales
      //local 0 = local; 1 => de la base
      let arrayOnlyLocal = me.attachmentArray.filter(p => p.local == 0)
      if(arrayOnlyLocal.length == 0){
          formData.append('noSendFiles',   'yes');
      }else{
        let imgsEnviar = []
        //setear only files
        arrayOnlyLocal.forEach(element => {
          imgsEnviar.push(element.file)
        });
        for(let i=0; i<arrayOnlyLocal.length;i++){
          formData.append('archivos[]',   imgsEnviar[i]);
        }
      }
      formData.append('id',               me.datos.id)
      formData.append('nombre',           me.datos.nombre)
      formData.append('descripcion',      me.datos.descripcion)
      formData.append('estado',           me.datos.estado)
      formData.append('tema_id',          me.temaSelect)
      formData.append('periodo_id',       localStorage.periodo_id)
      formData.append('user_created',     me.usuario.idusuario)
      formData.append('nee_subnivel',     me.datos.subnivel);
      formData.append('tipo',             me.datos.tipo)
      formData.append('solucionario',     me.datos.solucionario)
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      me.$vs.loading();
      axios.post(this.$data_url + 'api/saveNeetDocumentos', formData, config)
      // this.$http.post(this.$server_url + 'fichas', me.datos)
          .then((result) => {
              me.$vs.loading.close();
              // console.log('ficha save', result.data);
              me.f_notificaciones(me.mensaje, 'success', 'icon-alert-triangle');
              me.$emit('recharge',true)
          })
          .catch((err) => {
              me.$vs.loading.close();
              console.log(err)
              let msj = 'Error al registrar';
              me.f_notificaciones(msj, 'danger', 'icon-alert-triangle')
          })
    },
    f_notificaciones(msj, color, icono) {
      let me = this;
      me.$vs.notify({
        text: msj,
        color: color,
        iconPack: 'feather',
        icon: icono
      })
      return;
    },
    //METODOS FILES
    mostrarImg(e){
      let me = this;
      // var archivo = document.getElementById("file1").files[0];
      let selectedFiles = e.target.files;
      for(let i=0;i<selectedFiles.length;i++){
        // this.attachmentArray.push(selectedFiles[i]);
        let archivo = selectedFiles[i]
        me.setFile(archivo)
      }
    },
    setFile(archivo){
      let me = this;
      let tipo =""
      if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg"){
          tipo = "img"
      }
      else{
          tipo = "other"
      }
      var reader = new FileReader();
      if (me) {
        reader.readAsDataURL(archivo );
        reader.onloadend = function () {
          var cal      = new Object();
          cal.file     = archivo
          cal.img      = reader.result
          cal.tipo     = tipo
          cal.name     = archivo.name
          //local 0 ; 1 de la base
          cal.local    = 0
          me.attachmentArray.push(cal)
        }
      }
      return me.attachmentArray
    },
    removeItemFromArr (arr, item) {
      let me = this;
      const i = arr.indexOf(item)
      arr.splice(i, 1)
      if(item.local == 1){
          me.deleteOnlyFile(item.id)
      }
    },
    deleteOnlyFile(id){
      let me = this;
      axios.get(this.$data_url + 'api/deleteFileNEET/'+id)
      .then(res => {
      })
      .catch(error => {
          console.log(error)
      })
    }
    //FIN METODOS FILES
  },
}
</script>
<style scoped>
.farchivo{
  margin-top: 50px!important;
  cursor: pointer;
  /* color: gray; */
   width: 200px;
  font-size: 11px;
  line-height: 80%;
  transition: 0.5s ease all;
  padding: 10px 10px;
  background-color: DodgerBlue;
  border: none;
  color: white;
  border-radius: 5px;
  margin-left: 10px;
}
.farchivo:hover{
  background-color: #7C7B89;
  color:white;
  border-radius: 5px;
}
</style>
