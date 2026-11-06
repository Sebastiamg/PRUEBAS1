<template>
  <div class="vx-row w-full p-3">
    <div class="vx-col sm:w-3/4 w-full">
    <!-- ENCABEZADO -->
    <vx-card v-bind:title="evaluacion.nombreasignatura" title-color="primary">
      <div class="vx-row w-full">
        <div class="vx-col sm:w-1/4 w-full">
            <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" style="max-width: 200px; border-radius: 5px;">
        </div>
        <div class="vx-col sm:w-3/4 w-full pt-3 text-right">
            <div><b>Estudiantes:</b> {{user.nombres}} {{user.apellidos}} - {{user.cedula}}<br></div>

            <b class="mt-1">Inicia:</b> {{configuracion.fecha_inicio}} - <b class="ml-1">Finaliza:</b> {{ configuracion.fecha_fin}} <br>
            <b>Observaciones: </b> <span v-if="configuracion.observaciones !== null && configuracion.observaciones != 'null'">{{configuracion.observaciones}}</span>
            <div class="mt-1">
              <p>
                <span><b>Evaluación Seleccionada:</b> <span class="ml-1">{{ EvaluacionSelectSalleNombre }}</span></span>
              </p>
              <br>
            </div>
            <p class="flex justify-end">
              <vs-chip color="warning" v-if="user.id_evaluacion == null || user.id_evaluacion == 'null'">Evaluación aun no realizada</vs-chip>
              <vs-chip color="success" v-else>Evaluación realizada</vs-chip>
            </p>
          </div>
      </div>
    </vx-card>
    <!-- FIN ENCABEZADO -->
    <!-- SECCION RESPONDER PREGUNTAS -->
    <vx-card class="mt-5 mb-6 text-center" v-if="evaluacion_activa==1">
      <div>
        <vs-button type="line" v-for="(itemR, indexR) in evaluacion" :key="indexR" @click="ver_area(indexR)" class="m-1"> {{itemR.nombre_area}} </vs-button>
      </div>
      <div v-for="(item, index) in evaluacion" :key="index">
        <div v-bind:id="'area_activa'+index"  class="mt-6 text-left" v-if="mostrar">
            <h5 class="ml-5">Asignaturas área: {{item.nombre_area}}</h5>
            <vs-collapse type="margin">
            <vs-collapse-item v-for="(itemA, indexA) in item.asignaturas" :key="indexA">
                <div slot="header"> Preguntas - {{itemA.nombre_asignatura}} </div>
                <div  style="overflow-y: scroll; height:600px;" id="div_pregunta">
                <!-- <div  style="overflow-y: scroll; height:450px;" id="div_pregunta"> -->
                <div v-for="(itemP, indexP) in itemA.preguntas" :key="indexP" class="w-full mb-2">
                <div :id="itemA.id_asignatura+''+(indexP+1)" class="w-full p-3" style="min-height: 380px; vertical-align: top; background: rgb(64,105,213); background: radial-gradient(circle, rgba(64,105,213,0.073564459963673) 20%, rgba(0,101,228,0.16600143475358897) 87%);">
                  <div class="mt-2" style="font-size: 17px; min-height: 50px;" align="justify"> <b><span v-html="itemP.descripcion"></span></b> </div>
                    <div class="mb-base text-right">
                        Pregunta de {{itemP.nombre_tipo}} sobre {{itemP.puntaje_pregunta}} pts.
                    </div>
                    <img v-if="itemP.img_pregunta !== null && itemP.img_pregunta !== 'null' && itemP.img_pregunta !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemP.img_pregunta" style="max-width: 400px; border-radius: 5px; mix-blend-mode: multiply;" class="mb-base">

                    <div v-if="itemP.id_tipo_pregunta === 1" class="m-3" style="font-size: 15px;">
                        <div>
                            <!-- se carga array de preguntas de seleccion multiple -->
                            <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display: none;">
                                {{opciones_check[itemRes.respuesta] = itemRes.respuesta}}
                            </div>
                        </div>
                        <div class="text-left mb-5" v-for="(itemO, indexO) in itemP.opciones" :key="indexO">
                            <div style="width: 10%; display: inline-block;" align="center">
                                <span v-if="itemO.tipo == 1" style="color: #3DE090; font-size: 18px;">✔</span>
                                <span v-if="itemO.tipo == 0" style="color: #E73A5A; font-size: 18px;"><b>X</b></span>
                            </div>

                            <div style="width: 85%; display: inline-block; text-align: left;" align="left">
                                <vs-checkbox  disabled="true" v-model="opciones_check[itemO.id_opcion_pregunta]" :vs-value="itemO.id_opcion_pregunta" @input="guardarSeleccion(1, itemO, itemP.opciones, itemP.puntaje_pregunta)">
                                    {{itemO.opcion}}
                                    <img v-if="itemO.img_opcion !== null && itemO.itemO !== 'null' && itemO.itemO !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemO.img_opcion" alt="">
                                </vs-checkbox>
                            </div>
                        </div>
                    </div>

                    <div v-if="itemP.id_tipo_pregunta === 3 || itemP.id_tipo_pregunta === 5"  class="m-3" style="font-size: 15px;">
                        <div>
                          <!-- se carga array de preguntas de opcion simple -->
                          <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display: none;">
                              {{opciones[itemRes.id_pregunta] = itemRes.respuesta}}
                          </div>
                        </div>
                        <ul class="justify" v-for="(itemO, indexO) in itemP.opciones" :key="indexO">
                            <li class="mb-5">
                            <div style="width: 10%; display: inline-block;" align="center">
                            <span v-if="itemO.tipo == 1" style="color: #3DE090; font-size: 18px;">✔</span>
                            <span v-else style="color: #E73A5A; font-size: 18px;"><b>X</b></span>
                            </div>
                            <div style="width: 85%; display: inline-block;">
                            <vs-radio disabled="true" v-model="opciones[itemO.id_pregunta]" :vs-value="itemO.id_opcion_pregunta" @input="guardarSeleccion(3, itemO, itemP.opciones, itemP.puntaje_pregunta)">
                                {{itemO.opcion}}
                                <img v-if="itemO.img_opcion !== null && itemO.itemO !== 'null' && itemO.itemO !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemO.img_opcion" alt="">
                            </vs-radio>
                            </div>
                            </li>
                        </ul>
                    </div>

                </div>
                </div>
                <vs-pagination :total="itemA.preguntas.length" v-model="current_preg[indexA]" @input="paginacion(indexA, itemA.preguntas.length, itemA.id_asignatura)"></vs-pagination>
                </div>
            </vs-collapse-item>
            </vs-collapse>
        </div>
      </div>
    </vx-card>
    <vx-card class="mt-5 mb-6 text-center p-5" v-else>
      <br>
      <h5> {{alerta_evaluacion}} </h5>
      <br><br>
      <vs-button color="success" type="border" class="m-2" @click="$emit('changeReturn',true)"><b>← Volver</b></vs-button>
      <!-- <br><br>
      <h5 v-if="tipo_revisar_activo!=1">Si no visualiza su evaluación, recargue la página.</h5> -->
    </vx-card>
    <!-- FIN SECCION RESPONDER PREGUNTAS -->
    </div>
    <!-- SECCION TIEMPO, NAVEGACION -->
    <div class="vx-col sm:w-1/4 w-full">
      <vx-card v-if="evaluacion_activa==1">
        <div align="center">
        <div class="reloj mb-6 mt-4" style="font-size: 40px; color: #2974FE;"></div>
        <div class="mb-3">
            <vs-button color="success" type="border" class="m-1" @click="$emit('changeReturn',true)"><b>← Volver</b></vs-button>
        </div>
        </div>
      </vx-card>
    </div>
    <!--MODAL PARA MOSTRAR LA IMAGEN DE LA PREGUNTA-->
    <vs-popup class="holamundo" title="Mostrar imagen" :active.sync="popupMostrarImagen">
      <div class="flex" style="justify-content: center;" v-if="popupMostrarImagen">
        <image-zoom
            :regular="$data_url+'archivos/img/salle/img_preguntas/'+dataPregunta.img_pregunta"
            :zoom-amount="3"
            :click-zoom="true"
            click-message="De click para aumentar"
            img-class="img-fluid"
            >
        </image-zoom>
      </div>
    </vs-popup>
  </div>
</template>
<style>
/* width */
#div_pregunta::-webkit-scrollbar {
width: 10px;
}

/* Track */
#div_pregunta::-webkit-scrollbar-track {
box-shadow: inset 0 0 5px rgb(211, 207, 241);
border-radius: 10px;
}

/* Handle */
#div_pregunta::-webkit-scrollbar-thumb {
background: #2e85e9;
border-radius: 10px;
}

/* Handle on hover */
#div_pregunta::-webkit-scrollbar-thumb:hover {
background: #2e85e9;
}
/* CSS */
.button-7 {
background-color: #0095ff;
border: 1px solid transparent;
border-radius: 3px;
box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;
box-sizing: border-box;
color: #fff;
cursor: pointer;
display: inline-block;
font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;
font-size: 13px;
font-weight: 400;
line-height: 1.15385;
margin: 0;
outline: none;
padding: 8px .8em;
position: relative;
text-align: center;
text-decoration: none;
user-select: none;
-webkit-user-select: none;
touch-action: manipulation;
vertical-align: baseline;
white-space: nowrap;
}

.button-7:hover,
.button-7:focus {
background-color: #07c;
}

.button-7:focus {
box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);
}

.button-7:active {
background-color: #0064bd;
box-shadow: none;
}
</style>
<script>
  import imageZoom from 'vue-image-zoomer';
  import vSelect from 'vue-select'
  import $ from 'jquery'
  var x = null;
  export default {
      data(){
        return {
          usuario: [],
          evaluacion: [],
          area_activa: 0,
          opciones: [],
          opciones_check: {},
          id_evaluacion: '',
          evaluacion_activa: 0,
          alerta_evaluacion: '',
          revision_activa: false,
          configuracion: [],
          color_overlay: '',
          text_overlay: '',
          tiempo_evaluacion: 0,
          calificacion: 0,
          dataaaa: [],
          current_preg: [],
          revisa_admin_salle: 0,
          datos_docente_revisando: '',
          EvaluacionSelectSalleNombre:'',
          user:{},
          //variables para mostrar la imagen
          dataPregunta:'',
          popupMostrarImagen:false,
          mostrar:false,
        }
      },
      components: {
        'v-select': vSelect,
        imageZoom,
      },
      props:{
        user:{
          type:Object,
          default:{}
        },
      },
      created(){
        let me = this
        me.EvaluacionSelectSalleNombre = localStorage.EvaluacionSelectSalleNombre
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.tipo_revisar_activo = 0
        // me.tipo_revisar_activo = localStorage.tipo_revisar
        me.revisa_admin_salle = localStorage.revisa_admin_salle
        me.datos_docente_revisando = localStorage.datos_docente_revisando
        me.generarEvaluacion()
        me.getConfiguracion()
        me.mostrar = false
      },
      methods: {
        async generarEvaluacion(){
          let me = this
          me.color_overlay = '#22c16b'
          me.text_overlay = 'Estamos preparando su evaluación, no tomará mucho tiempo'
          me.$vs.loading({ background: me.color_overlay, color: 'rgb(255, 255, 255)',  type: 'sound', text: me.text_overlay })
          await this.$http.get(this.$server_url+'generar_evaluacion_salle/' + me.user.idusuario+'/'+me.user.institucion_idInstitucion+'/'+localStorage.EvaluacionSelectSalle+'/1')
          .then(res => {
            if(res.data.length == 0){
              me.alerta_evaluacion = 'No hay preguntas cargadas en las asignaturas'
              return
            }
            if( res.data === 0 ){
              me.evaluacion_activa = 0
              me.revision_activa = true
              me.alerta_evaluacion = 'Lo sentimos el tiempo para resolver esta evaluación ha terminado.'
              me.$vs.loading.close()
              return
            }
            if( res.data === 1 ){
              me.evaluacion_activa = 0
              me.revision_activa = true
              me.alerta_evaluacion = 'La institución a la que pertenece necesita ser configurada, por favor comuníquese con el administrador del sistema.'
              me.$vs.loading.close()
              return
            }
            // if( res.data === 2 ){
            //   me.evaluacion_activa = 0
            //   me.revision_activa = true
            //   me.alerta_evaluacion = 'Su evaluación ha finalizado.'
            //   me.$vs.loading.close()
            //   return
            // }
            me.evaluacion         = res.data
            me.evaluacion_activa  = 1
            me.mostrar = true
            setTimeout(() => {
              me.ver_area(0)
            },1500)
            me.$vs.loading.close()
          })
          .catch(function (error) {
            console.log(error);
            me.$vs.loading.close()
          })
        },
        getConfiguracion(){
          let me = this
          var InstitucionUser = ""
          console.log("user",me.user)
          InstitucionUser = me.user.institucion_idInstitucion
          me.$http.get(this.$server_url+'salle_getConfiguracion/' + InstitucionUser+'/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
            me.configuracion = res.data.configuracion[0]
            // alert(me.configuracion.ver_respuestas +'  &&  '+ me.tipo_revisar_activo)
            if( me.configuracion.ver_respuestas == 0 && me.tipo_revisar_activo == 1 ){
              console.log('no puede ver las preguntas')
              me.alerta_evaluacion = 'La revisión de sus evaluaciones está desactivada.'
              if( me.revisa_admin_salle != 1 ){ // cuando revisa el admin no se bloquea
                me.evaluacion_activa = 0
              }
            }
          })
          .catch(function (error) {
              console.log(error);
          })
        },
        ver_area(index){
          let me = this
          for( var i=0; i<me.evaluacion.length; i++ ){
            document.getElementById("area_activa"+i).style.display = "none";
          }
          document.getElementById("area_activa"+index).style.display = "block";
        },
        async guardarSeleccion(tipo_pregunta, item, opciones, puntaje){
          let me = this
          if( me.tipo_revisar_activo === 1 ){ return } // no se guardan las respuestas en modo revision
          // se obtiene la cantidad de opciones correctas de la pregunta respondida
          let cant_correctas = 0
          $.each(opciones, function(key, value){
            if(value.tipo === 1){
                cant_correctas++
            }
          })
          let opciones_seleccionadas = []
          $.each(me.opciones_check, function(key, value){
            for( var i=0; i<opciones.length; i++ ){
              if( key == opciones[i].id_opcion_pregunta ){
                if(value !== false ){
                    opciones_seleccionadas.push(key)
                }
              }
            }
          })
          let puntaje_seleccion = 0
          // alert(opciones_seleccionadas.length +' <= '+ cant_correctas)
          if( opciones_seleccionadas.length <= cant_correctas ){
            if( item.tipo === 1 ){
              //si la opcion seleccionada es de tipo correcta y no ha excedido la cantidad de opciones correctas
              puntaje_seleccion = (parseFloat(puntaje)/cant_correctas).toFixed(2)
              // alert('puntaje_seleccion bien: ' + puntaje_seleccion)
            }
          }else{
            // se le resta el puntaje cuando selecciona mas opciones de las correctas
            puntaje_seleccion = parseFloat(puntaje)*(-1)
            // alert('puntaje_seleccion else: ' + puntaje_seleccion)
          }
          let dataSeleccion = {
            id_evaluacion: me.id_evaluacion,
            id_usuario: me.usuario.idusuario,
            id_pregunta: item.id_pregunta,
            id_opcion_pregunta: item.id_opcion_pregunta,
            tipo_pregunta: tipo_pregunta,
            puntaje_seleccion: puntaje_seleccion
          }
          await me.$http.post(this.$server_url+'salle_guardarSeleccion', dataSeleccion)
          .then(res => {
            console.log(res)
          })
          .catch(function (error) {
            console.log(error);
          })
        },
        openConfirm() {
          let me = this;
          me.popupConfirmStart = true
        },
        acceptAlert() {
          let me = this
           if(me.intentosEvaluacion > 1){
            me.popupConfirmStart = false
            this.saveIntento()
            me.generarEvaluacion()
            return
          }
          me.popupConfirmStart = false
          this.saveIntento()
          document.getElementById("area_activa0").style.display = "block";
          this.f_tiempo()
        },
        saveIntento(){
          let me = this;
          //si es docentes cuantos los intentos
          if(me.usuario.id_group == 13){
            let formData = new FormData();
            formData.append('id_evaluacion',me.id_evaluacion);
            formData.append('id_usuario',   me.usuario.idusuario)
            formData.append('intentosEval', me.intentosEvaluacion)
            this.$http.post(this.$server_url+'save_finalizar_evalIntentos', formData)
            .then(res => {
              me.intentosEvaluacion = res.data.intentos
            })
          }
        },
        paginacion(index, tam, asign_content){
          let me = this;
          for( let i=1; i<=tam; i++ ){
              $('#'+asign_content+''+i).css('display', 'none')
          }
          $('#'+asign_content+''+me.current_preg[index]).css('display', 'block')
        }
      },
  }
</script>
