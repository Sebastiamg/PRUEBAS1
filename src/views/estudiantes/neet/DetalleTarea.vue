<template>
  <div class="mt-6">
    <!--INFORMACION DE LA TAREA-->
    <div>
        <div>
            <h4 class="title-informacion"><ion-icon style="position:relative;top:2px;" name="bookmarks-outline"></ion-icon> Información de la tarea</h4>
        </div>
        <div class="container-informacion">
            <p class="font-bold">Fecha de envio:</p>
            <span>{{ tarea.fecha_inicio }}</span>
            <br> <br>
            <p class="font-bold">Fecha de entrega:</p>
            <span>{{ tarea.fecha_fin }}</span>
            <br> <br>
            <p class="font-bold">Titulo Tarea:</p>
            <span>{{ tarea.nombre_documento }}</span>
            <br><br>
            <div v-if="tarea.actividad1 || tarea.actividad2 || tarea.actividad3 || tarea.actividad4 || tarea.actividad">
              <div v-if="tarea.actividad1">
                <b>Actividad 1:</b>
                <p class="link" @click="verActividad(tarea.actividad1)">{{ tarea.actividad1 }}</p>
                <br>
              </div>
              <div v-if="tarea.actividad2">
                <b>Actividad 2:</b>
                <p class="link" @click="verActividad(tarea.actividad2)">{{ tarea.actividad2 }}</p>
                <br>
              </div>
              <div v-if="tarea.actividad3">
                <b>Actividad 3:</b>
                <p class="link" @click="verActividad(tarea.actividad3)">{{ tarea.actividad3 }}</p>
                <br>
              </div>
              <div v-if="tarea.actividad4">
                <b>Actividad 4:</b>
                <p class="link" @click="verActividad(tarea.actividad4)">{{ tarea.actividad4 }}</p>
                <br>
              </div>
              <div v-if="tarea.actividad5">
                <b>Actividad 5:</b>
                <p class="link" @click="verActividad(tarea.actividad5)">{{ tarea.actividad5 }}</p>
              </div>
            </div>
            <div v-else>
              <p>No hay actividades registradas</p>
            </div>
            <p class="font-bold">Archivos adjuntos:</p>
            <!--ARCHIVOS ADJUNTOS-->
            <div class="row" v-if="attachmentArray.length > 0">
              <div class="flex">
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key">
                  <div class="flex m-4" style="flex-direction: column;">
                    <!--BASE-->
                    <div>
                      <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" :src="$data_book+'archivos/neetFiles/tareas/'+tr.url" style="border-radius: 5px;max-height: 60px;">
                      <img v-if="tr.tipo == 'other'" style="max-height: 60px;width: 50px;" src="@/assets/images/file-icons/doc.png" />
                      <div class="flex" style="flex-direction: column;">
                          <p class="letra2 mt-4 font-semibold">{{ tr.name.substring(0,20) }}</p>
                          <p class="letra2 download" @click="descargar_archivo(tr)" style="opacity:0.6">Descargar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
                <span>Esta tarea no tiene archivos adjuntos</span>
            </div>
        </div>
    </div>
    <!--TAREAS ENVIADA-->
    <div class="mt-5" v-if="userEstudiante">
        <div>
            <h4 class="title-informacion">Tarea enviada</h4>
        </div>
        <div class="container-informacion">
            <!--MOSTRAR CALIFICACION-->
          <div v-if="tarea.tarea.length > 0">
            <p class="font-bold">Calificación:</p>
             <div v-if="(tarea.tarea.length == 0)">
                <span>Aun no hay calificación</span>
            </div>
            <div v-else>
                <div v-if="tarea.tarea[0].calificacion == null || tarea.tarea[0].calificacion == 'null'">
                    <span>Aun no hay calificación</span>
                </div>
                <vs-chip color="success" v-else>{{ tarea.tarea[0].calificacion }}</vs-chip>
            </div>
          </div>
          <DetalleTareasEnviadasVue v-if="arregloRespuestas.length  > 0" :arregloRespuestas="arregloRespuestas" @recharge="recharge"/>
          <span v-else>Esta tarea aun no ha sido enviada</span>
        </div>
    </div>
    <!--ENVIAR TAREA-->
    <div class="mt-5" v-if="sendTarea.estado == 0 && userEstudiante">
        <div>
            <h4 class="title-informacion">Envio de la tarea</h4>
        </div>
        <div class="container-informacion">
            <p class="font-bold">Mensaje:</p>
            <quill-editor class="w-full h-25 alto mt-4" v-model="sendTarea.mensaje" :options="editorOptions"></quill-editor>
            <!--SUBIR ARCHIVOS-->
            <div class="mt-5">
                <p class="font-bold letra">Subir Archivos: <small style="font-size:10px;">(max 5MB)</small></p>
                <p class="mt-2">
                    <input type="file" name="file1Recurso" color="primary" id="file1Recurso" multiple class="inputfile" style="display: none;" v-on:change="mostrarImg">
                    <label for="file1Recurso" class="farchivo">
                        <feather-icon icon="UploadCloudIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" /> <span class="ml-1" style="font-size: 12px;">Buscar Archivo</span>
                    </label>
                </p>
            </div>
            <br>
            <div class="row mt-1">
                <div class="flex">
                    <div class="flex" v-for="(tr,key) in attachmentArray2" :key="key">
                        <div class="flex ml-2" style="flex-direction: column;">
                            <!--BASE-->
                            <div v-if="tr.local == 1">
                                <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" :src="$data_book+'archivos/tareas/'+tr.url" style="border-radius: 5px;max-height: 60px;">
                                <img v-if="tr.tipo == 'other'" style="max-height: 60px;width: 50px;" src="@/assets/images/file-icons/doc.png" />
                                <div class="flex ml-5" style="flex-direction: column;">
                                    <p class="letra2 mt-4 font-semibold">{{ tr.name.substring(0,20) }}</p>
                                    <p class="letra2 download" @click="descargar_archivo(tr)" style="opacity:0.6">Descargar</p>
                                </div>
                            </div>
                            <!--LOCAL-->
                            <div v-else>
                                <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;max-height: 60px;">
                                <img v-else style="max-height: 60px;width: 50px;" src="@/assets/images/file-icons/doc.png" />
                                <small class="mt-1">{{ tr.name }}</small>
                            </div>
                        </div>
                        <vs-button radius type="line" @click="removeItemFromArr(attachmentArray2,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-5">
            <button class="boton" @click="guardarTarea()">
                <feather-icon icon="SendIcon" svgClasses="h-4 w-4" class="ml-1" style="position: relative;top: 3px;" />
                <span class="ml-1" >Enviar Tarea</span>
            </button>
        </div>
    </div>
    <!--REVISAR TAREAS-->
    <div class="mt-5" v-if="userDocente">
        <div>
            <h4 class="title-informacion">Calificaciones</h4>
        </div>
        <div class="container-informacion">
            <CalificacionesRecursosVue :codigoCurso="codigoCurso" :recurso="tarea" :userDocente="userDocente"/>
        </div>
    </div>
    <div class="mt-5 letra4" v-if="sendTarea.estado == 1">
        <p>!Esta Tarea está FINALIZADA,
            y por lo tanto no se admite respuestas.
        </p>
    </div>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import DetalleTareasEnviadasVue from './components/DetalleTareasEnviadas.vue'
import CalificacionesRecursosVue from "./components/CalificacionesRecursos.vue";
import axios from 'axios'
import {
  quillEditor
} from "vue-quill-editor";
export default{
  data(){
      return{
          usuario:[],
          attachmentArray:[],
          sendTarea:{
            id:0,
            mensaje:'',
            estado:0,
          },
          attachmentArray2:[],
          arregloRespuestas:[],
          userEstudiante:false,
          userDocente:false,
          editorOptions: {
            placeholder: 'Escriba su mensaje...',
            theme: 'snow' // o 'bubble' según tu configuración
          }
      }
  },
  components:{
      quillEditor,
      DetalleTareasEnviadasVue,
      CalificacionesRecursosVue,
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted() {
      let me = this;
      if(me.usuario.id_group == 4) me.userEstudiante = true
      if(me.usuario.id_group == 6) me.userDocente = true
      me.getRecursosFiles()
      me.getInfoTarea()
  },
  props:{
    tarea:{
      type:Object,
      default:{}
    },
    codigoCurso:{
        type:String,
        default:'',
    },
  },
  methods: {
    getInfoTarea(){
      let me = this;
      let datos = me.usuario.idusuario  + "*" +me.tarea.id
      this.$http.get(this.$server_url+'neetTema?getInfoTarea=yes&datos='+datos)
        .then(function (res) {
          if(res.data.length > 0){
            let datos           = res.data[0]
            me.sendTarea.id     = datos.id
            me.sendTarea.estado = datos.estado
            me.getRespuestasTareas()
          }else{
            me.sendTarea.id     = 0
            me.sendTarea.estado = 0
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    irEnlace(url){
      let me = this
      window.open(url,'_blank')
    },
    getRecursosFiles() {
      let me = this
      me.attachmentArray = []
      this.$http.get(this.$server_url + 'neetTema/' + me.tarea.neet_upload_id)
        .then(function (res) {
          //archivos
          if(res.data.files.length > 0){
            var files = res.data.files
            if (files.length > 0) {
              files.forEach(element => {
                var cal  = new Object();
                cal.id   = element.id
                cal.name = element.archivo
                cal.url  = element.url
                let tipo = ""
                if (element.ext == "PNG" || element.ext == "png" || element.ext == "JPEG" || element.ext == "jpeg" || element.ext == "JPG" || element.ext == "jpg") {
                    tipo = "img"
                } else {
                    tipo = "other"
                }
                cal.tipo = tipo
                //local 0 = local; 1 => de la base
                cal.local = 1
                me.attachmentArray.push(cal)
              });
            }
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    //METODOS FILES
    mostrarImg(e) {
      let me = this;
      let selectedFiles = e.target.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        let archivo = selectedFiles[i]
        me.setFile(archivo)
      }
    },
    setFile(archivo) {
      let me = this;

      // Validar tamaño máximo de 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (archivo.size > maxSize) {
        me.$vs.notify({
          text: 'El archivo "' + archivo.name + '" excede el tamaño máximo de 5MB.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      let tipo = "";
      if (
        archivo.type === "image/png" ||
        archivo.type === "image/gif" ||
        archivo.type === "image/jpeg" ||
        archivo.type === "image/jpg"
      ) {
        tipo = "img";
      } else {
        tipo = "other";
      }

      var reader = new FileReader();
      if (me) {
        reader.readAsDataURL(archivo);
        reader.onloadend = function () {
          let cal = {
            file: archivo,
            img: reader.result,
            tipo: tipo,
            name: archivo.name,
            local: 0
          };
          me.attachmentArray2.push(cal);
        };
      }

      return me.attachmentArray2;
    },
    // setFile(archivo) {
    //   let me = this;
    //   let tipo = ""
    //   if (archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg") {
    //       tipo = "img"
    //   } else {
    //       tipo = "other"
    //   }
    //   var reader = new FileReader();
    //   if (me) {
    //     reader.readAsDataURL(archivo);
    //     reader.onloadend = function () {
    //       var cal  = new Object();
    //       cal.file = archivo
    //       cal.img  = reader.result
    //       cal.tipo = tipo
    //       cal.name = archivo.name
    //       //local 0 ; 1 de la base
    //       cal.local = 0
    //       me.attachmentArray2.push(cal)
    //     }
    //   }
    //   return me.attachmentArray2
    // },
    guardarTarea() {
      let me = this;

      if (me.sendTarea.mensaje == "") {
        me.$vs.notify({
          text: 'La descripción de la tarea no puede estar vacía',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      if (me.sendTarea.mensaje.length < 5) {
        me.$vs.notify({
          text: 'La descripción de la tarea no puede ser menor a 5 caracteres',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }

      // Preparar archivos
      let imgsEnviar = [];
      me.attachmentArray2.forEach(element => {
        imgsEnviar.push(element.file);
      });

      let formData = new FormData();
      formData.append('id', me.sendTarea.id);
      formData.append('periodo_id', localStorage.periodo_id);
      formData.append('neet_cursos_has_material_id', me.tarea.id);
      formData.append('idusuario', me.usuario.idusuario);
      formData.append('mensaje', me.sendTarea.mensaje);
      formData.append('curso', me.codigoCurso);
      for (let i = 0; i < imgsEnviar.length; i++) {
        formData.append('archivos[]', imgsEnviar[i]);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      me.$vs.loading();

      axios.post(this.$data_url + 'api/guardarTareaNeet', formData, config)
        .then(function (res) {
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
              time:5000
            });
            return;
          }
          me.$vs.notify({
            text: "Se guardó correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
          document.getElementById("file1Recurso").value = '';
          me.attachmentArray2 = [];
          me.sendTarea.mensaje = "";
          me.getInfoTarea();
        })
        .catch(function (error) {
          me.$vs.loading.close();

          // Captura y muestra el mensaje del backend si está disponible
          if (error.response && error.response.data) {
            let msg = error.response.data.message || 'Error inesperado.';
            me.$vs.notify({
              text: 'Error: ' + msg,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            });
          } else {
            me.$vs.notify({
              text: 'Ocurrió un error desconocido al guardar la tarea.',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            });
          }
        });
    },
    recharge(){
      let me = this;
      me.getRespuestasTareas();
    },
    getRespuestasTareas(){
      let me = this
      this.$http.get(this.$server_url + 'neetTema?listadoRespuestas=yes&tarea_id='+me.sendTarea.id)
        .then(function (res) {
            me.arregloRespuestas = res.data
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    removeItemFromArr(arr, item) {
      let me = this;
      const i = arr.indexOf(item)
      arr.splice(i, 1)
      if (item.local == 1) {
        me.deleteOnlyFile(item.id)
      }
    },
    deleteOnlyFile(id) {
      let me = this;
      axios.get(this.$data_url + 'api/deleteFileRecurso/' + id)
        .then(res => {})
        .catch(error => {
          console.log(error)
        })
    },
    descargar_archivo(item) {
      let me = this
      window.open(this.$data_url + 'archivos/neetFiles/tareas' + item.url, '_blank');
    },
    verActividad(url){
      let me = this;
      localStorage.Exteriorurl = url
      let route = this.$router.resolve({path: '/admin_neet_actividad'});
      window.open(route.href, '_blank');
    },
  },
}
</script>
<style lang="scss">
@import '@/assets/scss/general/general.scss';
.title-informacion{
  background-color: #BEB147;
  padding: 10px;
  color:white
}
.container-informacion{
  border: 1px solid var(--border);
  padding: 20px;
}
.link{
  font-weight: 400;
  text-decoration: underline;
  cursor: pointer;
  transition: 1s ease;
}
.link:hover{
  color: cornflowerblue;
}
.letra2 {
  font-size: 11px;
}
.letra4{
  font-size: 12px;
  color: #3EA0EA;
  text-align: center;
}
.download {
  cursor: pointer;
}
.download:hover {
  text-decoration: underline;
  opacity: 1;
}
.alto {
  height: 150px;
  display: inline-block;
}
.boton{
  background-color: #1c84c6;
  color: white;
  padding: 10px;
  border-color: #fff!important;
  width: 200px;
  cursor: pointer;
  transition: 0.5s ease-in;
  border: none;
  border-radius: 5px;
}
.boton:hover{
  background-color: #095280;
}
.farchivo {
  margin-bottom: -10px;
  cursor: pointer;
  color: gray;
  width: 100%;
  font-size: 11px;
  line-height: 80%;
  transition: 1s ease all;
  padding: 10px 10px;
}

.farchivo:hover {
  background-color: #7C7B89;
  color: white;
  border-radius: 5px;
  transform: scaleY(2px);
}
/*estilos actividad*/
.enlace {
  cursor: pointer;
  border-bottom: 3px solid #ff8cbc;
  transition: all 0.25s linear;
  position: relative;
}

.enlace:before {
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  background-color: #61a3ff;
  position: absolute;
  left: 0;
  bottom: -3px; /* this is to match where the border is */
  transform-origin: left;
  transform: scale(0);
  transition: 0.25s linear;
/*   will-change: transform; */
}

.enlace:hover:before {
  transform: scale(1);
}
.enlace:hover{
  opacity: 0.8;
  transform: translateY(-1px);
}
</style>
