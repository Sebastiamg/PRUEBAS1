<template>
    <div>
        <!--DATOS DE LAS RESPUESTAS Y FILES-->
        <div v-for="(tr,key) in arregloRespuestas" :key="key">
            <vs-divider class="mt-4"></vs-divider>
            <div class="mt-5">
                <div class="flex">
                    <vs-avatar class="letra2" style="margin-top: -1px;" icon-pack="feather" icon="icon-user" />
                    <div class="flex ml-4" style="flex-direction: column;">
                        <p class="letra2 font-bold">{{ tr.mensajero.toUpperCase() }}</p>
                        <small class="letra2" style="opacity: 0.7;">{{   elapsedTime(tr.created_at) }}</small>
                    </div>
                </div>
            </div>
            <div>
              <vs-button type="line" v-if="usuario.id_group == 4" size="small" color="danger" class="m-2" @click="ObjectSelected=tr;f_confirmarDelete();">
                <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                <span class="ml-2">Eliminar respuesta</span>
              </vs-button>
            </div>
            <div class="mt-5">
              <b class="letra2 ml-5">Mensaje:</b>
              <p class="letra2 ml-5 mt-1" v-html="tr.mensaje">
              </p>
            </div>
            <div class="mt-5 ml-5" v-if="tr.files.length > 0">
              <p class="letra2 font-captive">Archivos adjuntos:</p>
            </div>
            <div class="mt-1 flex" style="flex-wrap: wrap;" v-if="tr.files.length > 0">
                <div class="flex m-2" style="background-color: #EBF3F8;color:#3E4448;border-radius: 5px;padding: 10px;" v-for="(item,key) in tr.files" :key="key">
                    <feather-icon icon="FileIcon" style="color:gray;" class="ml-2"/>
                    <div class="flex ml-5" style="flex-direction: column;">
                        <p class="letra2 mt-4 font-semibold">{{ item.nombre.substring(0,20) }}</p>
                        <p class="letra2 download" @click="descargar_archivo(item)" style="opacity:0.6">Descargar</p>
                    </div>
                </div>
            </div>
        </div>
        <!--CALIFICAR-->
        <div v-if="userDocente" class="mt-3 ml-3 flex justify-center">
            <button class="btnV">
                <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                <span class="ml-2">Calificación</span>
                <vs-input-number color="success" v-model="calificacion"/>
                <vs-button color="primary" @click="guardarCalificacion()" class="p-2 ml-3 mt-5" icon="check" type="filled">Calificar</vs-button>
            </button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
            id:0,
            counterDanger: false,
            attachmentArray:[],
            usuario:[],
            calificacion:'0',
            ObjectSelected:'',
        }
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    // mounted(){
    //     let me = this;
    //     let preCalificacion =  me.estudianteTarea.tarea[0].calificacion
    //     if(preCalificacion == null || preCalificacion == "null"){
    //         me.calificacion = 0
    //     }else{
    //         me.calificacion = preCalificacion
    //     }
    // },
    mounted() {
      let me = this;

      if (
          me.estudianteTarea &&
          Array.isArray(me.estudianteTarea.tarea) &&
          me.estudianteTarea.tarea.length > 0
      ) {
          let preCalificacion = me.estudianteTarea.tarea[0].calificacion;

          if (
              preCalificacion === null ||
              preCalificacion === "null" ||
              preCalificacion === undefined ||
              preCalificacion === "" ||
              (typeof preCalificacion === "object" && Object.keys(preCalificacion).length === 0)
          ) {
              me.calificacion = 0;
          } else {
              me.calificacion = preCalificacion;
          }
      } else {
          // Si no hay tarea o está vacía, también asignamos 0 por seguridad
          me.calificacion = 0;
      }
    },
    props:{
        arregloRespuestas:{
            type:Array,
            default:[]
        },
        userDocente:{
            type:Boolean,
            default:false,
        },
        estudianteTarea:{
            type:Object,
            default:function(){
              return {}
            }
        },
    },
    methods:{
        descargar_archivo(item){
            let me = this
            window.open(this.$data_url+'archivos/neetFiles/tareas/' + item.archivo, '_blank');
        },
        elapsedTime(startTime) {
            const x = new Date(startTime)
            const now = new Date()
            let timeDiff = now - x
            timeDiff /= 1000
            const seconds = Math.round(timeDiff)
            timeDiff = Math.floor(timeDiff / 60)
            const minutes = Math.round(timeDiff % 60)
            timeDiff = Math.floor(timeDiff / 60)
            const hours = Math.round(timeDiff % 24)
            timeDiff = Math.floor(timeDiff / 24)
            const days = Math.round(timeDiff % 365)
            timeDiff = Math.floor(timeDiff / 365)
            const years = timeDiff
            if (years > 0) {
                return `${years + (years > 1 ? ' Años ' : ' Año ')}`
            } else if (days > 0) {
                return `Hace ${days + (days > 1 ? ' Días ' : ' Día ')}`
            } else if (hours > 0) {
                return `Hace ${hours + (hours > 1 ? ' Horas ' : ' Hora ')}`
            } else if (minutes > 0) {
                return `Hace ${minutes + (minutes > 1 ? ' Minutos ' : ' Minuto ')}`
            } else if (seconds > 0) {
                return 'Hace '+ seconds + (seconds > 1 ? ' segundos' : 'justo ahora')
            }
            return ' Justo Ahora '
        },
        guardarCalificacion(){
            let me = this
            let formData = new FormData();
            formData.append('calificarTarea',   'yes')
            formData.append('id',               me.estudianteTarea.tarea[0].id);
            formData.append('calificacion',     me.calificacion);
            me.$vs.loading()
            this.$http.post(this.$server_url+'neetTema', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            me.$emit('recharge',true)
        },
        f_confirmarDelete(){
          let me = this;
           this.$vs.dialog({
            type: 'confirm',
            color: 'danger',
            title: `Confirmacion`,
            text: 'Estas seguro de eliminar la respuesta de la tarea?.',
            accept: this.f_eliminarRespuesta,
            acceptText: 'Si, deseo eliminar',
            cancelText: 'Cancelar',
          })
        },
        f_eliminarRespuesta(){
          let me = this;
          let formData = new FormData();
          formData.append('tarea_id', me.ObjectSelected.neet_tareas_id);
          formData.append('id', me.ObjectSelected.id);
          me.$vs.loading();

          axios.post(this.$data_url + 'api/eliminarRespuestaNeet', formData)
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
                text: "Se elimino correctamente",
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              });
              me.$emit('recharge',true)
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
                  text: 'Ocurrió un error desconocido al eliminar la respuesta de la tarea.',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle'
                });
              }
            });
        },
    }
}
</script>
<style scoped>
*{
    font-family: 'Arial';
}
div.scroll {
    margin:4px, 4px;
    padding:4px;
    width: 100%;
    height: 88%;
    overflow-x: hidden;
    overflow-y: auto;
    text-align:justify;
}
.letra{
    font-size: 12px;
}
.letra2{
    font-size: 11px;
}
.letra3{
    font-weight: 100!important;
}
.letra4{
    font-size: 12px;
    color: #3EA0EA;
    text-align: center;
}
.btnV{
    color:#3E4448;
    background-color:#EBF3F8;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 100;
    font-size: 11px;
    transition: 0.5s ease;
    cursor: pointer;
}

.btnV2{
    color:red;
    background-color:#EBF3F8;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 100;
    font-size: 11px;
    transition: 0.5s ease;
    cursor: pointer;
}

.btnV:hover{
    color: #3EA0EA;
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
.farchivo{
    margin-bottom: -10px;
    cursor: pointer; color: gray; width: 100%;
    font-size: 11px;
    line-height: 80%;
    transition: 0.5s ease all;
    padding: 10px 10px;
}
.farchivo:hover{
    background-color: #7C7B89;
    color:white;
    border-radius: 5px;
}
.adjunto{
    margin: 5px 10px;
    color:#3E4448;
    background-color:#EBF3F8;
    /* width: 30%; */
    height: 53px;
    cursor: pointer;
    transition: 0.5s ease-in-out;
    border-radius: 5px;
}
.adjunto:hover{
    opacity: 0.8;
}
.download:hover{
    text-decoration: underline;
    opacity: 1;
}
/*RESPONSIVE*/
@media (max-width: 1280px) {
    .adjunto {
        width: 30%;
    }
}
@media (max-width: 1024px) {
    .adjunto {
        width: 30%;
    }
}
@media (max-width: 912px) {
    .adjunto {
        width: 40%;
    }
}
@media (max-width: 820px) {
    .adjunto {
        width: 40%;
    }
}

@media (max-width: 412px) {
    .adjunto {
        width: 100%;
    }
}
@media (max-width: 393px) {
    .adjunto {
        width: 100%;
    }
}
@media (max-width: 375px) {
    .adjunto {
        width: 100%;
    }
}
</style>
