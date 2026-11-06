<template>
<div class="vx-row" style="padding: 20px; font-size: 19px;">
  <div class="vx-col sm:w-3/4 w-full">
    <div v-if="evaluaciones[0]===undefined">No existe evaluación</div>
    <vx-card v-else v-bind:title="evaluaciones[0].nombreasignatura" title-color="primary">
        <vs-alert color="warning" style="height: 80px;"  v-if="datosInstitucion.tipo_evaluacion == '1'">
            <p class="text-2xl text-warning text-center"><i class="fa-solid fa-circle-exclamation"></i> {{ datosInstitucion.mensaje_tipo_evaluacion }}</p>
        </vs-alert>
        <br>
        {{usuario.nombres}} {{usuario.apellidos}} - {{usuario.cedula}}<br>
        {{'Inicia: '+evaluaciones[0].fecha_inicio+' - Finaliza: '+ evaluaciones[0].fecha_fin}}
        <div>
          <div v-if="evaluaciones[0].nombre_evaluacion">
            Nombre Evaluación: {{evaluaciones[0].nombre_evaluacion}} <br>
          </div>
          <div v-if="evaluaciones[0].descripcion">
            Descripción: {{evaluaciones[0].descripcion}}
          </div>
            <!-- <div v-if="evaluaciones[0].descripcion==='' || evaluaciones[0].descripcion === null || evaluaciones[0].descripcion === 'null'"></div>
            <div v-else class="vx-col w-full" align="justify">
                {{evaluaciones[0].descripcion}}
            </div> -->
        </div>
    </vx-card>

    <!-------INICIO SECCION RESPONDER---------->
    <vx-card class="mt-5 mb-6">

    <div align="center" v-if="volverActivo===true">
        Esta evaluación ya fue completada.<br><br>
        <vs-button color="success" type="gradient" @click="volver()">Volver</vs-button>
    </div>
    <div v-if="verbtniniciar===true" align="center">
        <div v-if="preguntas.items===undefined">No existen preguntas para esta evaluación.</div>
        <vs-button v-else type="gradient" size="large" style="padding: 0px; border-radius: 100%; width: 80px; height: 80px;" @click="modalConfirm(); ">Iniciar</vs-button>
    </div>

    <div class="text-center">
    <div cols="12" v-for="(item, index) in preguntas.items" :key="index" v-bind:id="'contenPreg'+(index+1)" style="display: none;" class="mb-4">
        <div class="mb-5" style="font-size: 19px;" align="center">
            <div align="left">
                <b>{{ index+1 }}) <span class="pregAbierta" v-html="renderLatex(item.descripcion)"></span></b>
            </div>

            <img style="border-radius: 5px;" v-if="item.img_pregunta" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_pregunta" class="img-responsive mt-2 altura" min-width="350px" width="450px">

            <div align="left" style="font-size: 17px; color: gray;">{{item.indicaciones}}</div>
        </div>

        <div v-bind:id="'contenOpciones'+(index+1)" align="left" style="font-size: 19px;" class="mb-5"></div>
    </div>

    <!-- <vs-pagination color="success" v-if="iniciarActivo===true" :total="preguntas.items.length" v-model="currentx" @input="verPreguntaSelec(currentx-1)"></vs-pagination> -->
    </div>
    </vx-card>
    </div>


    <!--<div class="vx-col sm:w-1/4 w-full" style="position: fixed; top: 20px; right: 10px; z-index: 1;">-->
    <div class="vx-col sm:w-1/4 w-full">
    <vx-card>
        <div align="center">
            <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" style="max-width: 225px;" class="mb-10">

        Tiempo para resolver esta evaluación:
        <div v-if="iniciarActivo===false && evaluaciones[0]" class="reloj mt-3" style="font-size: 35px; color: #2974FE;">{{evaluaciones[0].duracion}} minutos</div>
        <div class="reloj mb-6 mt-4" style="font-size: 40px; color: #2974FE;"></div>
        <div v-if="iniciarActivo===true" class="mb-2">
            <vs-button color="dark" type="gradient" class="mb-6" @click="openConfirm">Finalizar evaluación</vs-button><br>

            <vs-button v-if="usuario.id_group === 4" color="success" type="border" class="mt-6" @click="$router.push('/estudiante/evaluaciones')"><b>← Volver</b></vs-button>

            <vs-button v-else color="success" type="border" class="mt-6 m-1" @click="$router.push('/evaluaciones')"><b>← Volver</b></vs-button>

            <vs-divider class="mt-4"> Preguntas </vs-divider>

            <div class="btn-group">
            <button v-for="(item, index) in preguntas.items" :key="index" @click="currentx=(index+1); verPreguntaSelec(index)" class="botonPaginacion" v-bind:id="'botonRespuesta'+index" style="background-color: white; border-radius: 5px; border: 1px solid #046AE7; margin: 2px; color: #046AE7; font-size: 19px; cursor: pointer;">
                {{ index+1 }}
            </button>
            </div>
        </div>
        </div>
    </vx-card>
    <!--modales-->
    <!---modal para colocar el codigo-->
    <vs-popup classContent="popup-example" title="Ingrese el código de evaluación" :active.sync="popupCodigoEvaluacion">
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>código</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" icon-pack="feather" @keydown.space="(event) => event.preventDefault()" icon="icon-code" icon-no-border v-model="codigoEvaluacion" />
        </div>
      </div>
      <div class="flex justify-center">
        <vs-button class="mr-3 mb-2" icon-pack="feather" icon="icon-check" @click="validateCodigo()">Validar código</vs-button>
        <vs-button color="warning" type="border" class="mb-2" @click="popupCodigoEvaluacion = false;">Cancelar</vs-button>
      </div>
    </vs-popup>
  </div>
</div>
</template>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
import VueRouter from 'vue-router'
import { renderLatex } from '@/utils/renderLatex'
import 'mathlive/mathlive-static.css'
import 'mathlive/mathlive-fonts.css'
import 'katex/dist/katex.min.css'
    var respondidas = [];
    var x = null;
    export default {
        data(){
            return {
              preguntas: [],
              pregunta: {descripcion: '', id_tema: '', respuesta: '', opcion1: '', opcion2: '', opcion3: '', img_pregunta: '', img_respuesta: '', img_opcion1: '', img_opcion2: '', img_opcion3: ''},
              evaluaciones: [],
              evaluacion: {nombre: '', asignatura: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: '', duracion: '', nombre_evaluacion: ''},
              usuario: [],
              estudiante: null,
              nombre_estudiante: null,
              apellido_estudiante: null,
              opcionesSelec: [],
              urlOrigen: '',
              iniciarActivo: false,
              currentx: 1,
              volverActivo: false,
              verbtniniciar: true,
              calificacion: 0,
              id_evalRevisar: '',
              grupo_estudiante: '',
              preguntas_escritas: [],
              tipo_preguntas_escritas: [],
              respuestasAcum: [],
              contadorIntentosgrupo: 0,
              vectorLink: [],
              popupInformacion: false,
              datosInstitucion:'',
              popupCodigoEvaluacion:false,
              codigoEvaluacion:'',
              ipDireccion:'',
              intervalId: null,  // Guarda el ID del setInterval

              //tiempo evaluacion
              tiempoRestante: 0, // Tiempo restante de la evaluación
              tiempoTranscurrido: 0, // Tiempo transcurrido desde la última vez
              intervaloTiempo: null,  // Guarda el ID del setInterval

              evaluacionFinalizada: false,
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr
        },
        created(){
            this.$vs.loading()
            localStorage.removeItem('estado');
            this.vectorLink = (this.$route.params.id).split('-')
            this.id_evalRevisar = this.vectorLink[0]//localStorage.getItem("id_evalRevisar");
            this.grupo_estudiante = localStorage.getItem("grupo_estudiante");
            var url = location.pathname.split('/');
            var urlBack = window.location.href
            var urlV = urlBack.split('/')
            this.urlOrigen = urlV[0]+'/'+urlV[1]+'/'+urlV[2]+'/estudiante/evaluaciones'
            this.usuario = JSON.parse(localStorage.getItem('usuario'));

            if( this.usuario ){
                this.verificarCurso()
                this.estudiante = this.usuario.idusuario
                this.nombre_estudiante = this.usuario.nombres
                this.apellido_estudiante = this.usuario.apellidos
                localStorage.evaluacionxLink = ''
            }else{
                localStorage.evaluacionxLink = this.$route.params.id
                //alert('Antes de rendir esta evaluación debes iniciar sesion. Si aún no te has registrado puedes hacerlo en este momento.')
                window.location.href = urlV[0]+'/'+urlV[1]+'/'+urlV[2];
            }

            this.$http.get(this.$server_url+'evaluacionEstudiante/'+this.id_evalRevisar).then(res => {
                if(res.data.length > 0){
                    this.evaluaciones = res.data
                    this.validarTiempo()
                    this.preguntasEvaluacionGrupo()
                }else{
                    alert('No existen preguntas para esta evaluación');
                    window.location.href = this.urlOrigen;
                }
            })
        },
        mounted(){
          let me = this
          me.getIp()
          me.getDatosInstitucion()// Obtener el tiempo transcurrido cuando el componente se monta

          // Agregar el listener para el cambio de visibilidad de la página
          document.addEventListener("visibilitychange", this.handleVisibilityChange);

          window.addEventListener('beforeunload', this.handleBeforeUnload);

        },
        beforeDestroy() {
            // Limpia el intervalo antes de destruir el componente o cambiar de ruta
            if (this.intervalId) {
            clearInterval(this.intervalId);
            }

            if (this.iniciarActivo ) {
                this.guardarTiempoTranscurrido(); // Guardar el tiempo antes de destruir el componente (cuando se navega a otra página)

                // Limpieza
                // window.removeEventListener('beforeunload', this.handleBeforeUnload);

                // Eliminar el listener para el cambio de visibilidad
                document.removeEventListener("visibilitychange", this.handleVisibilityChange);
                window.removeEventListener('beforeunload', this.handleBeforeUnload);
            }
        },
        destroyed() {
            localStorage.setItem('antes de destruir', 'si se pudo guardar el tiempo');

            if (this.iniciarActivo && !this.evaluacionFinalizada) {
                this.guardarTiempoTranscurrido(); // Guardar el tiempo antes de destruir el componente (cuando se navega a otra página)


                // Limpiamos el evento cuando el componente se destruye
                window.removeEventListener('beforeunload', this.handleVisibilityChange);
                window.removeEventListener('beforeunload', this.handleBeforeUnload);
            }

        },
        beforeRouteLeave(to, from, next) {
            if (this.iniciarActivo && !this.evaluacionFinalizada) {
                const answer = window.confirm('¿Estás seguro de salir de la evaluación?');
            if (answer) {
                next(); // permitir navegación
            } else {
                next(false); // cancelar navegación
            }
            } else {
            next(); // continuar si no hay sesión activa
            }
        },
        methods: {
            renderLatex,
            handleBeforeUnload(event) {
                if (this.iniciarActivo && !this.evaluacionFinalizada) {
                    console.log("💾 Guardando tiempo antes de salir...");

                    // Intenta guardar el tiempo (¡tené en cuenta que async no siempre se respeta aquí!)
                    this.guardarTiempoTranscurrido();

                    // Mostrar alerta para evitar que el usuario cierre la pestaña
                    event.preventDefault();       // Necesario para algunos navegadores
                    event.returnValue = '¿Estás seguro de salir?';       // Esto dispara el mensaje de confirmación del navegador
                    return '';                    // Por compatibilidad
                }
            },
            handleVisibilityChange() {
                let me = this;

                // Solo guarda si 'iniciarActivo' es verdadero
                if (this.iniciarActivo && !this.evaluacionFinalizada) {



                    // Si la página está oculta
                    if (document.visibilityState === "hidden") {
                        console.log("🔒 Guardando el tiempo transcurrido antes de cerrar o cambiar de pestaña...");

                        // Llamamos a tu método para guardar el tiempo
                        this.guardarTiempoTranscurrido()
                            .then(() => {
                            console.log("✅ Tiempo guardado antes de que la página se oculte");
                            })
                            .catch((error) => {
                            console.error("❌ Error al guardar el tiempo:", error);
                            });
                    } else {
                        // Si la página vuelve a ser visible
                        console.log("📈 Página visible nuevamente");

                        // Llamamos a tu método para guardar el tiempo también si es necesario
                        this.guardarTiempoTranscurrido()
                            .then(() => {
                            console.log("✅ Tiempo guardado al volver a la página");
                            })
                            .catch((error) => {
                            console.error("❌ Error al guardar el tiempo al regresar", error);
                            });
                    }
                }
            },
            obtenerTiempoTranscurrido() {
                this.$http.get(this.$server_url + 'obtenerTiempoTranscurrido', {
                params: {
                    id_estudiante: this.usuario.idusuario,
                    id_evaluacion: this.id_evalRevisar
                }
                }).then(response => {
                if (response.data.status === 1) {
                    // ✅ Asegúrate de convertir el valor en número
                    this.tiempoTranscurrido = parseInt(response.data.tiempo_transcurrido || 0);

                    this.f_tiempo(this.evaluaciones[0].duracion);

                    this.calcularTiempoRestante();

                    // ✅ Aquí inicia el contador real
                    this.intervaloTiempo = setInterval(() => {
                        this.tiempoTranscurrido += 1000; // Aumenta 1 segundo (en milisegundos)
                        this.calcularTiempoRestante();
                    }, 1000);
                }
                }).catch(error => {
                console.error('Error al obtener el tiempo:', error);
                });
            },

            calcularTiempoRestante() {
                const totalMs = this.evaluaciones[0].duracion * 60 * 1000;
                this.tiempoRestante = Math.max(totalMs - this.tiempoTranscurrido, 0);
            },
            guardarTiempoTranscurrido() {
                return new Promise((resolve, reject) => {
                    // Verifica que los datos sean correctos antes de proceder
                    if (!this.usuario || !this.id_evalRevisar || !this.tiempoTranscurrido) {
                    reject("Faltan datos necesarios para guardar el tiempo.");
                    return;
                    }

                    console.log("🔄 Guardando tiempo transcurrido...");

                    // Usar axios para enviar la solicitud POST
                    axios.post(this.$server_url +"guardarTiempoTranscurrido", {
                    id_estudiante: this.usuario.idusuario,
                    id_evaluacion: this.id_evalRevisar,
                    tiempoTranscurrido: this.tiempoTranscurrido,
                    })
                    .then((response) => {
                        if (response.data.status === 1) {
                            // Guardar el estado en localStorage
                            const estado = { mensaje: 'Estado guardado' };
                            localStorage.setItem('estado', JSON.stringify(estado));
                            resolve();  // Si la solicitud es exitosa

                        } else {
                            // Guardar el estado en localStorage
                            const estado = { mensaje: 'Estado no guardado' };
                            localStorage.setItem('estado', JSON.stringify(estado));
                            reject("Error al guardar el tiempo: " + response.data.message);
                        }
                    })
                    .catch((error) => {
                        reject("❌ Error al realizar la solicitud: " + error);
                    });
                });
            },
          async getIp() {
            try {
              const response = await axios.get('https://api.ipify.org?format=json');
              this.ipDireccion = response.data.ip;
              console.log("i", this.ipDireccion);
            } catch (error) {
              console.error('Error al obtener la IP:', error);
            }
          },
          getDatosInstitucion(){
            let me = this
            //datos institucion
            this.$http.get(this.$server_url+'institucion/'+me.usuario.institucion_idInstitucion)
            .then(res=>{
                me.datosInstitucion = res.data
            })
            .catch(function (error){
                console.log(error)
            })
          },
            getEvaluacion(item){
                let formData = new FormData();
                    formData.append('estudiante', this.estudiante);
                    formData.append('evaluacion',  item);

                this.$http.post(this.$server_url+`verifRespEvaluacion`, formData).then(res => {
                    this.$vs.loading.close()
                    if( res.data.length > 0 ){
                        this.volverActivo = true;
                        this.verbtniniciar = false;
                    }else{
                        this.verbtniniciar = true;
                    }
                })
            },
            validarTiempo(){
                if( this.evaluaciones[0].fecha_actual < this.evaluaciones[0].fecha_inicio ){
                    this.volver()
                }
                if( this.evaluaciones[0].fecha_actual > this.evaluaciones[0].fecha_fin ){
                    this.volver()
                }

                let dia_actual = (this.evaluaciones[0].fecha_actual).split('-')
                let dia_actual1 = dia_actual[2].split(' ')
                let dia_actual_1 = dia_actual1[0]

                let dia_fin = (this.evaluaciones[0].fecha_fin).split('-')
                let dia_fin1 = dia_fin[2].split(' ')
                let dia_fin_1 = dia_fin1[0]

                if( dia_actual_1 === dia_fin_1 ){
                    let tiempo_fin1 = this.evaluaciones[0].fecha_fin.split(' ');
                    let tiempo_fin2 = (tiempo_fin1[1]).split(':');

                    let tiempo_actual1 = this.evaluaciones[0].fecha_actual.split(' ');
                    let tiempo_actual2 = (tiempo_actual1[1]).split(':');

                    let tiempo = ((parseInt(tiempo_fin2[0]+''+tiempo_fin2[1]+''+tiempo_fin2[2]) - parseInt(tiempo_actual2[0]+''+tiempo_actual2[1]+''+tiempo_actual2[2]))*600)-10000;//600 compensar tiempo

                    if( tiempo < 0 ){
                        alert('Esta evaluación ha finalizado.');
                        this.volver()
                    }else{
                        setInterval(() => {
                            console.log("hola mundo 2")
                            alert('Esta evaluación ha finalizado.');
                            this.calificarValidado()
                        }, tiempo)
                    }
                }

            },
            modalConfirm(){
              let me = this
              if(me.datosInstitucion.ifcodigoEvaluacion == 0){
                me.empezarEvaluacion()
              }else{
                me.popupCodigoEvaluacion = true
              }
            },
            validateCodigo(){
              let me = this
              //no puede quedar vacio
              if(!me.codigoEvaluacion){
                me.$vs.notify({
                  text: 'Ingrese el código de la evaluación',
                  color: 'danger',
                  iconPack: 'feather'
                })
                return
              }
              //no puede ser mayor a 10 digitos
              if(me.codigoEvaluacion.length > 10){
                me.$vs.notify({
                  text: 'El código no puede ser mayor a 10 dígitos',
                  color: 'danger',
                  iconPack: 'feather'
                })
                return
              }
              //api post validateCodigo
              let formData = new FormData();
              formData.append('codigo',        me.codigoEvaluacion)
              formData.append('id_evaluacion', me.id_evalRevisar)
              me.$vs.loading()
              me.$http.post(me.$server_url+'validateCodigo', formData)
              .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                  me.$vs.notify({
                    text: res.data.message,
                    color: 'danger',
                    iconPack: 'feather'
                  })
                  return
                }
                if(res.data == 1){
                  me.$vs.notify({
                    text: 'Código validado correctamente',
                    color: 'success',
                    iconPack: 'feather'
                  })
                  me.popupCodigoEvaluacion = false
                  me.empezarEvaluacion()
                }else{
                  me.$vs.notify({
                    text: 'Código incorrecto',
                    color: 'danger',
                    iconPack: 'feather'
                  })
                }
              })
              .catch(e =>{
                me.$vs.loading.close()
                me.$vs.notify({
                  text: 'Error al validar el código',
                  color: 'danger',
                  iconPack: 'feather'
                })
              })
            },
             //function para guardar la fecha que inicio la evaluacion
             empezarEvaluacion(){
              let me = this
              let formData = new FormData();
              formData.append('id_estudiante',  me.usuario.idusuario);
              formData.append('id_evaluacion',  me.id_evalRevisar)
              formData.append('grupo',          me.grupo_estudiante);
              formData.append('codigoUnico',    localStorage.codigoUnico)
              formData.append('ifcodigoEvaluacion', me.datosInstitucion.ifcodigoEvaluacion)
              //ipDireccion
              formData.append('ipDireccion', me.ipDireccion)
              me.$http.post(me.$server_url+'empezarEvaluacion',formData)
              .then(function (res) {
                if(res.data.status == 0){
                  me.$vs.notify({
                      text: res.data.message,
                      color: 'danger',
                      iconPack: 'feather'
                  })
                  //recargar la pagina
                  window.location.href = me.urlOrigen;
                  return
                }
                if(res.data.status == 3){
                  me.$vs.notify({
                    text: res.data.message,
                    color: 'danger',
                    iconPack: 'feather',
                    time:8000
                  })
                  return
                }
                if(res.data.status == 2){
                  if(res.data.codigoUnico){
                    localStorage.codigoUnico = res.data.codigoUnico
                  }
                }
                //Iniciar la evaluación
                me.iniciar()
              })
              .catch(function (error) {
                  me.$vs.notify({
                      text: 'Error al iniciar la evaluación',
                      color: 'danger',
                      iconPack: 'feather'
                  })
              })
            },
            iniciar(){
              let me = this
                //Obtener el tiempo transcurrido
                this.obtenerTiempoTranscurrido();
                // Copia local de los datos — NO uses this dentro del event
                const idEstudiante = this.usuario.idusuario;
                const idEvaluacion = this.id_evalRevisar;
                const serverUrl = this.$server_url;

                window.addEventListener('beforeunload', function (event) {
                    const tiempo = window.__TIEMPO_TRANSCURRIDO || 0;

                    if (!tiempo || isNaN(tiempo)) return;

                    const data = {
                    id_estudiante: idEstudiante,
                    id_evaluacion: idEvaluacion,
                    tiempoTranscurrido: tiempo
                    };

                    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

                    navigator.sendBeacon(serverUrl + 'guardarTiempoTranscurrido', blob);
                });
              me.iniciarActivo=true;
              me.verbtniniciar=false;
            //   this.f_tiempo(this.evaluaciones[0].duracion);
              for( var j=1; j<=this.preguntas.items.length; j++ ){
                  document.getElementById("contenPreg"+j).style.display = "none";
              }
              this.verbtniniciar = false;
              ///muestra la primera pregunta
              document.getElementById("contenPreg1").style.display = "block";

            //   function marcarBoton(index){
            //       $('#botonRespuesta'+index).addClass('marcarBotonResp');
            //   }

                ///mostrar preguntas metodo 2
                var cantOpciones;
                for( var i=0; i<this.preguntas.items.length; i++ ){
                    cantOpciones = this.preguntas.items[i].opciones.length
                    if( cantOpciones === 0 ){
                        cantOpciones = 1
                    }

                    for( var j=0; j<cantOpciones; j++ ){
                        switch (parseInt(this.preguntas.items[i].id_tipo_pregunta)) {
                        case 1:
                            try {
                            const opcionRendered1 = this.renderLatex(this.preguntas.items[i].opciones[j].opcion);
                            $("#contenOpciones"+(i+1)).append(`
                                <input type="checkbox" onclick="document.getElementById('botonRespuesta`+i+`').style.background='#046AE7'; document.getElementById('botonRespuesta`+i+`').style.color='white'" id="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" class="${this.preguntas.items[i].id} estiloInput" name="${this.preguntas.items[i].id}" value="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}"> ${opcionRendered1}</label><br>
                            `)
                            if( this.preguntas.items[i].opciones[j].img_opcion === '' || this.preguntas.items[i].opciones[j].img_opcion === 'null' || this.preguntas.items[i].opciones[j].img_opcion === null ){
                            }else{
                                $("#contenOpciones"+(i+1)).append(`
                                    <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                    <img style="border-radius: 5px; cursor: pointer;" for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" src="${this.$data_url}archivos/img/img_preguntas/${this.preguntas.items[i].opciones[j].img_opcion}" class="img-responsive mt-2 altura" min-width="350px" width="450px">
                                    </label><br>
                                `)
                            }
                            } catch (error){

                            }
                        break;
                        case 3:
                            try {
                            const opcionRendered3 = this.renderLatex(this.preguntas.items[i].opciones[j].opcion);
                            $("#contenOpciones"+(i+1)).append(`
                                <input type="radio" onclick="document.getElementById('botonRespuesta`+i+`').style.background='#046AE7'; document.getElementById('botonRespuesta`+i+`').style.color='white'" id="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" class="${this.preguntas.items[i].id} estiloInput" name="${this.preguntas.items[i].id}" value="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}"> ${opcionRendered3}</label><br>
                            `)
                            } catch (error){

                            }
                        break;
                        case 5:
                            try {
                            const opcionRendered5 = this.renderLatex(this.preguntas.items[i].opciones[j].opcion);
                            $("#contenOpciones"+(i+1)).append(`
                                <input type="radio" onclick="document.getElementById('botonRespuesta`+i+`').style.background='#046AE7'; document.getElementById('botonRespuesta`+i+`').style.color='white'" id="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" class="${this.preguntas.items[i].id} estiloInput" name="${this.preguntas.items[i].id}" value="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}"> ${opcionRendered5}</label><br>
                            `)
                            if( this.preguntas.items[i].opciones[j].img_opcion === '' || this.preguntas.items[i].opciones[j].img_opcion === 'null' || this.preguntas.items[i].opciones[j].img_opcion === null ){
                            }else{
                                $("#contenOpciones"+(i+1)).append(`
                                    <label for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}">
                                    <img style="border-radius: 5px; cursor: pointer;" for="${this.preguntas.items[i].opciones[j].id_opcion_pregunta}" src="${this.$data_url}archivos/img/img_preguntas/${this.preguntas.items[i].opciones[j].img_opcion}" class="img-responsive mt-2 altura" min-width="350px" width="450px">
                                    </label><br>
                                `)
                            }
                            } catch (error){

                            }
                        break;
                        case 2:
                            try {
                                $("#contenOpciones"+(i+1)).append(`
                                    <textarea oninput="document.getElementById('botonRespuesta`+i+`').style.background='#046AE7'; document.getElementById('botonRespuesta`+i+`').style.color='white'" id="${this.preguntas.items[i].id}" class="inputRespuesta" rows="5" placeholder="Escribe tu respuesta..."></textarea>
                                `)
                            } catch (error) {

                            }
                        break;
                        case 6:
                            try {
                                $("#contenOpciones"+(i+1)).append(`
                                    <textarea oninput="document.getElementById('botonRespuesta`+i+`').style.background='#046AE7'; document.getElementById('botonRespuesta`+i+`').style.color='white'" id="${this.preguntas.items[i].id}" class="inputRespuesta" rows="5" placeholder="Escribe tu respuesta..."></textarea>
                                `)
                            } catch (error) {

                            }
                        break;
                        default:
                        break;
                        }
                    }
                }
            },
            verPreguntaSelec(index){
                for( var j=1; j<=this.preguntas.items.length; j++ ){
                    document.getElementById("contenPreg"+j).style.display = "none";
                }
                document.getElementById("contenPreg"+(index+1)).style.display = "block";
            },
            openConfirm() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `Confirmar`,
                    text: '¿Está seguro de finalizar la evaluación?',
                    accept: this.calificarValidado
                })
            },
            calificarValidado(){
              let me = this
              this.evaluacionFinalizada = true;
                var pregsRecorrer = this.preguntas.items
                var opcionesSeleccionadas = []
                var opcionesSeleccionadasV = []
                var califPregFinal = 0;
                me.$vs.loading()
                for( var j=0; j<pregsRecorrer.length; j++ ){
                    var index = this.respuestasAcum.map(function(e) { return e.id_pregunta; }).indexOf(pregsRecorrer[j].id);

                    if( pregsRecorrer[j].id_tipo_pregunta === 1 || pregsRecorrer[j].id_tipo_pregunta === 3 || pregsRecorrer[j].id_tipo_pregunta === 5  ){

                        if( pregsRecorrer[j].id_tipo_pregunta === 3 || pregsRecorrer[j].id_tipo_pregunta === 5 ){
                            opcionesSeleccionadas = $('input:radio[name='+pregsRecorrer[j].id+']:checked').val()
                        }else{
                            $('.'+pregsRecorrer[j].id+':checked').each(function() {
                                opcionesSeleccionadas += $(this).val()+','
                            })
                        }

                        try {
                            var tamselecV = 0;
                            opcionesSeleccionadasV = opcionesSeleccionadas.split(',')
                            if(opcionesSeleccionadasV===undefined){
                                opcionesSeleccionadasV=''
                                tamselecV = 1
                            }else{
                                tamselecV = opcionesSeleccionadasV.length-1
                                if(opcionesSeleccionadasV.length-1<=0){
                                    tamselecV = 1
                                }
                            }

                            var opcionRespuesta = (this.respuestasAcum[index].id_opcion_pregunta).split(',')
                            var califPreg = 0;
                            for( var i=0; i<tamselecV; i++ ){
                                for( var k=0; k<opcionRespuesta.length; k++ ){

                                    if( opcionesSeleccionadasV[i] === opcionRespuesta[k] ){
                                        //alert(opcionesSeleccionadasV[i] +'==='+ opcionRespuesta[k]);
                                        califPreg++
                                    }
                                }
                            }

                            if( tamselecV > opcionRespuesta.length ){
                                califPreg = califPreg - (tamselecV - opcionRespuesta.length)
                            }
                            califPregFinal = ((califPreg * this.respuestasAcum[index].puntaje_pregunta)/opcionRespuesta.length).toFixed(2);

                            //alert(califPregFinal+'----califPreg: ' + califPreg+'----puntaje_pregunta: '+this.respuestasAcum[index].puntaje_pregunta+'----opcionRespuesta.length: '+opcionRespuesta.length);
                        } catch (error) {

                        }

                    }else{//calificar preguntas tipo 2 o 6
                        try {
                            opcionesSeleccionadasV = (($('#'+pregsRecorrer[j].id).val()).toLowerCase().replace(/,|\.|\(|\)|!|\?|¿|\$|/g, '')).split(' ')

                            var opcionRespuesta = (this.respuestasAcum[index].opcion).split(',')
                            var califPreg = 0;
                            for( var i=0; i<opcionesSeleccionadasV.length; i++ ){
                                for( var k=0; k<opcionRespuesta.length; k++ ){
                                    if( opcionesSeleccionadasV[i] === (opcionRespuesta[k].toLowerCase()).replace(/ /gi, '') ){
                                        //alert('**BIEN: '+( opcionesSeleccionadasV[i] +'==='+ (opcionRespuesta[k].toLowerCase()).replace(/ /g, '') ));
                                        califPreg++
                                        break
                                    }
                                }
                            }

                            let cant_coincidencias = parseInt(this.respuestasAcum[index].cant_coincidencias)
                            if( cant_coincidencias <= 0 ){
                                cant_coincidencias = 1
                            }
                            let califPregEscr = ((califPreg * this.respuestasAcum[index].puntaje_pregunta)/parseInt(cant_coincidencias)).toFixed(2);

                            if( califPregEscr > this.respuestasAcum[index].puntaje_pregunta ){
                                califPregEscr = this.respuestasAcum[index].puntaje_pregunta
                            }

                            califPregFinal = califPregEscr;

                            //alert(califPregFinal+'----califPreg ab: ' + califPregEscr+'----puntaje_pregunta: '+this.respuestasAcum[index].puntaje_pregunta);

                        }catch (error){
                        }
                    }
                    this.guardarRespuesta(this.id_evalRevisar, pregsRecorrer[j].id, this.usuario.idusuario, opcionesSeleccionadasV, califPregFinal)

                    this.calificacion += parseFloat(califPregFinal);

                    califPreg = 0
                    califPregFinal = 0
                    opcionesSeleccionadas = []
                    opcionesSeleccionadasV= []
                }
                setTimeout(() => {
                    this.enviarEvaluacion();
                },1500)
            },
            guardarRespuesta(evaluacion, pregunta, estudiante, respuestas, puntaje){
              let me = this
              console.log("entroooo")
              // me.$vs.loading()
                let formData = new FormData();
                formData.append('evaluacion', evaluacion);
                formData.append('pregunta',  pregunta);
                formData.append('estudiante', estudiante);
                formData.append('respuesta', respuestas);
                formData.append('puntaje', puntaje);
                formData.append('grupo', me.grupo_estudiante);
                formData.append('codigoUnico',    localStorage.codigoUnico)
                //ipDireccions
                formData.append('ipDireccion', me.ipDireccion)
                this.$http.post(this.$server_url+'guardarRespuesta', formData)
                .then(res => {
                  if(res.data.status == 0){
                    me.$vs.loading.close()
                    me.$vs.notify({
                      text: res.data.message,
                      color: 'danger',
                      iconPack: 'feather',
                      time:8000
                    })
                    //ir estudiante/evaluaciones
                    window.location.href = me.urlOrigen;
                    return
                  }
                  // me.$vs.loading.close()
                })
                .catch(function (error) {
                  me.$vs.loading.close()
                  me.$vs.notify({
                      text: 'Error al guardar la respuesta',
                      color: 'danger',
                      iconPack: 'feather'
                  })
                })
            },
            enviarEvaluacion(){
                let me = this
                var urlBack = window.location.href
                var urlV = urlBack.split('/')
                me.$vs.loading()
                let formData = new FormData();
                formData.append('estudiante', me.estudiante);
                formData.append('evaluacion',  me.id_evalRevisar);
                // formData.append('calificacion', me.calificacion.toFixed(2));
                // formData.append('grupo', me.grupo_estudiante);
                this.$http.post(this.$server_url+'respEvaluacion', formData)
                .then(res => {
                    //obtengo el campo ver_calificaciones  0=>no ver calificaciones  1=>ver calificaciones
                    let ver_calificaciones = res.data.ver_calificaciones
                    //si no puede ver calificaciones el estudiante se redirecciona a la pagina de evaluaciones
                    if( ver_calificaciones === 0 ){
                        window.location.href = me.urlOrigen;

                    }else{
                      // me.$vs.loading.close()
                      localStorage.setItem('previsualizar_eval', 0);
                      window.location.href = urlV[0]+'/'+urlV[1]+'/'+urlV[2]+'/revisarevaluacion';
                      // me.$vs.loading.close()
                    }

                })
                .catch(function (error) {
                  me.$vs.loading.close()
                  me.$vs.notify({
                      text: 'Error al enviar la evaluación',
                      color: 'danger',
                      iconPack: 'feather'
                  })
                    //window.location.href = me.urlOrigen;
                })
            },
            volver(){
                window.location.href = this.urlOrigen;
            },
            f_tiempo(duracionMinutos) {
                let me = this;

                // Total en segundos
                let totalSegundos = duracionMinutos * 60;

                // Convertir tiempoTranscurrido (milisegundos) a segundos
                let tiempoConsumido = Math.floor(this.tiempoTranscurrido / 1000);

                // Tiempo restante en segundos
                let n = totalSegundos - tiempoConsumido;

                // Seguridad: que no empiece en negativo
                if (n <= 0) {
                    $(".reloj").html("Fin del tiempo");
                    me.calificarValidado();
                    return;
                }

                this.intervalId = setInterval(function() {
                    n--;

                    let hours = Math.floor(n / 3600);
                    let minutes = Math.floor((n % 3600) / 60);
                    let seconds = Math.floor(n % 60);

                    // Mostrar con ceros adelante si quieres
                    let hStr = hours < 10 ? '0' + hours : hours;
                    let mStr = minutes < 10 ? '0' + minutes : minutes;
                    let sStr = seconds < 10 ? '0' + seconds : seconds;

                    $(".reloj").html(`${hStr} : ${mStr} : ${sStr}`);

                    if (n <= 60) {
                        $(".reloj").css('color', '#FB2452');
                    }

                    if (n <= 0) {
                        clearInterval(me.intervalId);
                        $(".reloj").html("Fin del tiempo");
                        me.calificarValidado();
                    }
                }, 1000);

                ///muestra la primera pregunta
                document.getElementById("contenPreg1").style.display = "block";

            },
            preguntasEvaluacionGrupo(){
                var grupoRand = Math.floor(Math.random() * ( (parseInt(this.evaluaciones[0].grupos_evaluacion)+1) - 1)) + 1;
                localStorage.setItem('grupo_estudiante', grupoRand);
                this.grupo_estudiante = grupoRand;
                this.verRespuestasGrupo();
                let formData = new FormData();
                formData.append('grupo', this.grupo_estudiante);
                formData.append('evaluacion',  this.id_evalRevisar);
                this.$http.post(this.$server_url+`pregEvaluacionGrupo`, formData).then(res => {
                    if(res.data.length===0){
                        this.contadorIntentosgrupo++
                        if( this.contadorIntentosgrupo < 2 ){
                            grupoRand = Math.floor(Math.random() * ( (parseInt(this.evaluaciones[0].grupos_evaluacion)+1) - 1)) + 1;
                            localStorage.setItem('grupo_estudiante', grupoRand);
                            this.grupo_estudiante = grupoRand;
                            this.preguntasEvaluacionGrupo()
                            this.verRespuestasGrupo();
                        }else{
                            alert('No existen preguntas para esta evaluación.');
                            window.location.href = this.urlOrigen;
                        }
                    }else{
                        this.preguntas = res.data;
                        for( var i=0; i<this.preguntas.items.length; i++ ){
                            if( this.preguntas.items[i].id_tipo_pregunta===2 || this.preguntas.items[i].id_tipo_pregunta===6 ){
                                this.preguntas_escritas.push(this.preguntas.items[i].descripcion)
                                this.tipo_preguntas_escritas.push(this.preguntas.items[i].id_tipo_pregunta)
                            }
                        }

                        this.getEvaluacion(this.id_evalRevisar);
                    }
                })
            },
            verRespuestasGrupo(){
                let formData = new FormData();
                formData.append('grupo', this.grupo_estudiante);
                formData.append('evaluacion',  this.id_evalRevisar);

                this.$http.post(this.$server_url+'getRespuestasAcum', formData).then(res => {
                    this.respuestasAcum = res.data
                })
            },
            verificarCurso(){
                let me = this
                let formData = new FormData();
                    formData.append("codigo", me.vectorLink[1]);
                    formData.append("idusuario", me.usuario.idusuario);
                this.$http.post(this.$server_url+'verificarCursoEstudiante', formData)
                .then(function (res) {
                    if( res.data != '' ){
                    }else{
                        me.addClase()
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })

            },
            addClase(){
                let me = this
                let formData = new FormData();
                    formData.append("codigo", me.vectorLink[1]);
                    formData.append("idusuario", me.usuario.idusuario);

                this.$http.post(this.$server_url+'addClase', formData)
                .then(function (res) {
                })
                .catch(function (error) {
                    console.log(error);
                })
            }

        }
    }
</script>

<style>
.inputRespuesta{
    height: 80px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #d5d5d5;
    font-size: 18px;
    padding: 5px 10px 5px 10px;
    resize: vertical;
}

.marcarBotonResp{
    background-color: #046AE7 !important;
    color: white !important;
}

.botonPaginacion:hover{
    background-color: #C8DFFA !important;
    color: #046AE7 !important;
}

.estiloInput{
    margin-bottom: 15px;
    -ms-transform: scale(1.5); /* IE 9 */
    -webkit-transform: scale(1.5); /* Chrome, Safari, Opera */
    transform: scale(1.5);
    margin-right: 10px;
}

.altura{
    max-height: 350px;
}
</style>
