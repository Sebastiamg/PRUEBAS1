<template>
  <div class="evaluaciones-container">
    <!-- Section: List of Evaluations -->
    <div class="evaluaciones-left-col">
      <vx-card class="h-full clean-card" :title="null">
        <div class="card-header-custom">
          <div>
            <h3 class="header-title">Evaluaciones Resueltas</h3>
            <p class="header-subtitle">Historial de evaluaciones finalizadas</p>
          </div>
          <div class="header-icon-box">
            <i class="feather icon-list icon-lg"></i>
          </div>
        </div>
        <div class="card-content">
          <vs-table v-if="listaEvaluaciones.length > 0" max-items="20" search pagination :data="listaEvaluaciones" noDataText="No hay evaluaciones disponibles">
            <template slot="header">
              <!-- Empty header slot effectively removes the default search bar container styling issues if any, search prop handles the input -->
            </template>
            <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="styled-row">
                <vs-td>
                  <div class="row-content">
                    <div class="feather icon-check-circle mr-2">
                      <i class="feather icon-file-text"></i>
                    </div>
                    <div class="row-text">
                      <p v-for="(item,key) in arregloPeriodos" :key="key" class="periodo-info">
                        <span v-if="item.id == periodoSelect" class="periodo-label">
                          Periodo Evaluación <span class="separator">|</span> <b class="periodo-name">{{ item.nombre }}</b>
                        </span>
                      </p>
                      <span class="estado-text">Evaluación completada</span>
                    </div>
                  </div>
                </vs-td>
                <vs-td class="text-right whitespace-no-wrap">
                  <vs-button
                    :disabled="ver_respuestas_activo"
                    color="primary"
                    type="border"
                    size="small"
                    icon-pack="feather"
                    icon="icon-eye"
                    class="action-btn"
                    @click="revisarEvaluacion(data[indextr].id_evaluacion)"
                  >
                    Revisar
                  </vs-button>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>

          <div v-if="listaEvaluaciones.length === 0" class="empty-state-table">
            <div class="empty-icon-wrapper">
              <i class="feather icon-inbox icon-2xl"></i>
            </div>
            <p class="empty-message">No hay evaluaciones disponibles</p>
          </div>

          <div v-if="ver_respuestas_activo===true" class="alert-warning" role="alert">
             <span class="alert-text">La revisión de preguntas no está activada para su institución</span>
          </div>
        </div>
      </vx-card>
    </div>

    <!-- Section: Actions & Status -->
    <div class="evaluaciones-right-col">
      <vx-card class="h-full clean-card text-center relative overflow-hidden" :title="null">
        <div class="card-header-simple">
          <h3 class="header-title">Panel de Control</h3>
        </div>

        <div id="div-with-loading" class="loading-container">
            <!-- Progress Verificando Finalización -->
            <div v-if="verificandoFinalizacion" class="verification-progress">
              <div class="progress-icon-wrapper">
                <i class="feather icon-clock rotating"></i>
              </div>
              <h4 class="progress-title">Verificando Evaluación</h4>
              <p class="progress-subtitle">Procesando finalización automática...</p>
              <div class="progress-bar-container">
                <div class="progress-bar-fill"></div>
              </div>
            </div>

            <!-- Skeleton Loader -->
            <div v-else-if="cargando" class="skeleton-loader">
              <div class="skeleton-header"></div>
              <div class="skeleton-lines">
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
              </div>
              <div class="skeleton-button"></div>
            </div>

            <!-- Evaluación en Curso -->
            <div v-else-if="evaluacionEnCurso && tiempoRestante" class="status-content fade-in">
                <div class="eval-status-card in-progress compact">
                  <div class="status-icon-wrapper compact">
                    <i class="feather icon-clock"></i>
                  </div>
                  <h4 class="status-main-title compact">Evaluación en Curso</h4>

                  <div class="time-remaining-box compact">
                    <div class="time-display compact">
                      <div class="time-unit compact">
                        <span class="time-number">{{ String(tiempoRestante.horas).padStart(2, '0') }}</span>
                        <span class="time-text">h</span>
                      </div>
                      <span class="time-separator">:</span>
                      <div class="time-unit compact">
                        <span class="time-number">{{ String(tiempoRestante.minutos).padStart(2, '0') }}</span>
                        <span class="time-text">m</span>
                      </div>
                      <span class="time-separator">:</span>
                      <div class="time-unit compact">
                        <span class="time-number">{{ String(tiempoRestante.segundos).padStart(2, '0') }}</span>
                        <span class="time-text">s</span>
                      </div>
                    </div>
                  </div>

                  <div class="eval-details-compact">
                    <div class="detail-row">
                      <i class="feather icon-play-circle"></i>
                      <span>Empezo la evaluación: <strong>{{ formatDateTime(evaluacionEnCurso.fecha_inicio_evaluacion) }}</strong></span>
                    </div>
                    <div class="detail-row">
                      <i class="feather icon-calendar"></i>
                      <span>Hasta: <strong>{{ formatDateTime(configuracion[0].fecha_fin) }}</strong></span>
                    </div>
                    <!-- <div class="detail-row">
                      <i class="feather icon-flag"></i>
                      <span>{{ formatDateTime(evaluacionEnCurso.fecha_limite_evaluacion) }}</span>
                    </div> -->
                  </div>

                  <vs-button class="btn-continue compact" color="#3b82f6" icon-pack="feather" icon="icon-arrow-right" @click="resolverEvaluacion()" :disabled="verificandoFinalizacion">
                      Continuar
                  </vs-button>
                </div>
            </div>

            <!-- Evaluación Disponible (sin iniciar) -->
            <div v-else-if="evaluacionOk===true && !evaluacionEnCurso" class="status-content fade-in">
                <div class="eval-status-card available compact">
                  <div class="status-icon-wrapper success compact">
                    <i class="feather icon-check-circle"></i>
                  </div>
                  <h4 class="status-main-title compact">Evaluación Disponible</h4>

                  <div class="eval-info-box compact">
                    <div class="info-row compact">
                      <i class="feather icon-calendar"></i>
                      <span>Hasta <strong>{{ formatDateTime(configuracion[0].fecha_fin) }}</strong></span>
                    </div>
                    <!-- <div class="info-row compact">
                      <i class="feather icon-file-text"></i>
                      <span><strong>{{ listaEvaluaciones.length }} / {{ configuracion[0].cant_evaluaciones }}</strong></span>
                    </div> -->
                  </div>

                  <vs-button class="btn-start compact" color="#10b981" icon-pack="feather" icon="icon-play-circle" @click="resolverEvaluacion()" :disabled="verificandoFinalizacion">
                      Iniciar
                  </vs-button>
                </div>
            </div>

            <!-- No disponible -->
            <div v-else class="status-content fade-in">
                <div class="eval-status-card not-available">
                  <div v-if="arrayEvaluaciones.length > 0" class="status-icon-wrapper complete">
                    <i class="feather icon-check"></i>
                  </div>
                  <div v-else class="status-icon-wrapper disabled">
                    <i class="feather icon-alert-circle"></i>
                  </div>

                  <div v-if="arrayEvaluaciones.length == 0">
                     <h4 class="status-main-title">No Disponible</h4>
                     <p class="status-message">{{mensajeEvaluacion}}</p>
                  </div>
                  <div v-else>
                     <h4 class="status-main-title">Evaluaciones Completadas</h4>
                     <p class="status-message">Has completado todas las evaluaciones permitidas para este período</p>
                  </div>
                </div>
            </div>
        </div>

        <div class="divider-line" v-if="tipo_institucion == 2"></div>

        <div class="asignaturas-section" v-if="tipo_institucion == 2">
            <vs-button class="w-full action-btn-secondary" color="warning" type="flat" icon-pack="feather" icon="icon-grid" @click="asignaturasUsuario()">
                Mis Asignaturas
            </vs-button>
        </div>
      </vx-card>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
export default {
    data() {
      return {
        usuario: [],
        listaEvaluaciones: [],
        asignaturasDocente: 0,
        configuracion: [],
        fechaLocal: '',
        evaluacionOk: false,
        mensajeEvaluacion: '',
        eval_color: '#2196f3',
        ver_respuestas_activo: false,
        arregloPeriodos:[],
        arrayEvaluaciones:[],
        tipo_institucion:0, // 0 nada; 2 = salle;
        evaluacionEnCurso: null, // Datos de evaluación en curso
        tiempoRestante: null,
        fechaServidor: null,
        cargando: true,
        verificandoFinalizacion: false,
        evaluacionSelectSalle: null,
        contadorInterval: null,
        sincronizacionInterval: null
      }
    },
    components: {
      'v-select': vSelect,
    },
    async created() {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.f_getInformacionInstitucion();

      // Cargar período de evaluación al iniciar
      await this.inicializarPeriodoEvaluacion();
    },
    mounted() {
      let me = this;
      // Ya no es necesario verificar aquí porque se hace en created
    },
    beforeDestroy() {
      // Limpiar intervalos cuando se destruye el componente
      if(this.contadorInterval) clearInterval(this.contadorInterval);
      if(this.sincronizacionInterval) clearInterval(this.sincronizacionInterval);
    },
   watch: {
      evaluacionSelectSalle(val) {
        if (val) {
          this.cargarTodo();
        }
      }
    },
    methods: {
      async inicializarPeriodoEvaluacion() {
        let me = this;

        // Verificar si ya existe el periodo en localStorage
        let evaluacionExistente = localStorage.getItem('EvaluacionSelectSalle');

        if (evaluacionExistente) {
          me.evaluacionSelectSalle = evaluacionExistente;
          me.cargarTodo();
          return;
        }

        // Si no existe, cargar los periodos y establecer el activo
        try {
          const response = await this.$http.get(this.$server_url + 'salle/periodos?byInstitucion=' + me.usuario.institucion_idInstitucion);
          const periodos = response.data;

          if (periodos && periodos.length > 0) {
            // Buscar periodo activo (estado = 1)
            let periodoActivo = periodos.find(p => p.estado == 1);

            if (periodoActivo) {
              // Establecer el periodo activo
              localStorage.setItem('EvaluacionSelectSalle', periodoActivo.id);
              me.evaluacionSelectSalle = periodoActivo.id.toString();
            } else {
              // Si no hay periodo activo, usar el primero
              localStorage.setItem('EvaluacionSelectSalle', periodos[0].id);
              me.evaluacionSelectSalle = periodos[0].id.toString();
            }

            // Cargar los datos
            me.cargarTodo();
          }
        } catch (error) {
          console.error('Error al inicializar periodo:', error);
        }
      },
      async cargarTodo() {
        let me = this;
        await this.f_getEvaluacionesDocente();
        this.verificarAsginaturasDocente();
        let getEvaluacionSelect = localStorage.EvaluacionSelectSalle
        if(getEvaluacionSelect){
          me.periodoSelect = parseInt(getEvaluacionSelect)
          return
        }
      },
      f_getInformacionInstitucion(){
        let me = this;
        this.$http.get(this.$server_url+'institucion/' + me.usuario.institucion_idInstitucion)
          .then(res => {
            me.tipo_institucion = res.data.tipo_institucion
          })
          .catch(err => {
          })
      },
      verificarAsginaturasDocente() {
        let me = this;
        me.cargando = true;
        this.$http.get(this.$server_url+'asignaturas_docente_salle/' + me.usuario.idusuario+'/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
            me.asignaturasDocente = res.data.asignaturas.length
          })
          .catch(err => {
          })
        this.$http.get(this.$server_url+'institucionConfiguracionSalle/' + me.usuario.institucion_idInstitucion+'/'+localStorage.EvaluacionSelectSalle)
          .then(res => {
            me.configuracion = res.data;
            if( me.configuracion[0].ver_respuestas == 0 ){
              me.ver_respuestas_activo = true
            }
            me.getEvaluacionesResueltas()
          })
          .catch(err => {
            console.log(err)
            me.cargando = false;
          })
      },
      async f_getEvaluacionesDocente(){
        let me = this;
        me.arrayEvaluaciones = []
        var url = "metodosGetPreguntasSalle?getEvaluacionesDocente=1&id_usuario="+me.usuario.idusuario+"&periodo="+localStorage.EvaluacionSelectSalle;
        await me.$http.get(this.$server_url+url)
        .then(res => {
            me.arrayEvaluaciones = res.data
            // Buscar si hay evaluación en curso
            me.verificarEvaluacionEnCurso()
        })
      },
      verificarEvaluacionEnCurso(){
        let me = this;
        if(me.arrayEvaluaciones && me.arrayEvaluaciones.length > 0){
          // Buscar evaluación con estado = 1 (activa)
          let evalActiva = me.arrayEvaluaciones.find(ev => ev.estado == 1);
          if(evalActiva && evalActiva.intentos > 0){
            me.evaluacionEnCurso = evalActiva;
            me.calcularTiempoRestante();

            // Limpiar intervalos existentes antes de crear nuevos
            if(me.contadorInterval) clearInterval(me.contadorInterval);
            if(me.sincronizacionInterval) clearInterval(me.sincronizacionInterval);

            // Actualizar cada segundo para el countdown visual
            me.contadorLocal();

            // Sincronizar con servidor cada minuto
            me.sincronizacionInterval = setInterval(() => {
              me.calcularTiempoRestante();
            }, 60000);
          }
        }
      },
      contadorLocal(){
        let me = this;
        // Contador local que se actualiza cada segundo
        me.contadorInterval = setInterval(() => {
          if(me.tiempoRestante && me.tiempoRestante.total > 0){
            me.tiempoRestante.total--;
            me.tiempoRestante.horas = Math.floor(me.tiempoRestante.total / 3600);
            me.tiempoRestante.minutos = Math.floor((me.tiempoRestante.total % 3600) / 60);
            me.tiempoRestante.segundos = me.tiempoRestante.total % 60;

            // Si llega a 0, verificar con servidor
            if(me.tiempoRestante.total <= 0){
              me.calcularTiempoRestante();
            }
          }
        }, 1000);
      },
      async calcularTiempoRestante(){
        let me = this;
        console.log('Calculando tiempo restante para evaluación en curso...');
        if(!me.evaluacionEnCurso || !me.evaluacionEnCurso.fecha_limite_evaluacion) return;

        // Obtener tiempo del servidor
        let formData = new FormData();
        formData.append('obtener_fecha_servidor', 1);

        await me.$http.post(me.$server_url + 'obtenerCalificacionSalle', formData)
        .then(res => {
          if(res.data.fecha_servidor){
            me.fechaServidor = res.data.fecha_servidor;
            let fechaServidor = new Date(res.data.fecha_servidor);
            let fechaLimite = new Date(me.evaluacionEnCurso.fecha_limite_evaluacion);
            let diferencia = Math.floor((fechaLimite - fechaServidor) / 1000);

            if(diferencia > 0){
              me.tiempoRestante = {
                total: diferencia,
                horas: Math.floor(diferencia / 3600),
                minutos: Math.floor((diferencia % 3600) / 60),
                segundos: diferencia % 60
              };
            } else {
              // Tiempo expirado estando fuera - Finalizar automáticamente con tipo 4
              me.finalizarEvaluacionAutomatica(me.evaluacionEnCurso.id_evaluacion, me.usuario.idusuario);

              // Limpiar intervalos
              if(me.contadorInterval) clearInterval(me.contadorInterval);
              if(me.sincronizacionInterval) clearInterval(me.sincronizacionInterval);

              me.tiempoRestante = null;
              me.evaluacionEnCurso = null;
            }
          }
        })
        .catch(err => {
          console.error('Error al obtener tiempo servidor:', err);
        });
      },
      async finalizarEvaluacionAutomatica(id_evaluacion, id_usuario){
        let me = this;

        // Mostrar progress durante la finalización
        me.verificandoFinalizacion = true;

        // Tipo 4: Tiempo expirado estando fuera de la evaluación
        let data_finalizar = {
          id_evaluacion: id_evaluacion,
          id_usuario: id_usuario,
          tipo_finalizacion: 4
        };

        await me.$http.post(me.$server_url + 'salle_finalizarEvaluacion', data_finalizar)
        .then(res => {
          if(res.data.status == 1){
            console.log('✅ Evaluación finalizada automáticamente: Estado cambiado a 2, Tipo Finalización: 4');

            // Notificar al usuario
            me.$vs.notify({
              title: 'Tiempo Expirado',
              text: 'El tiempo de tu evaluación ha finalizado automáticamente.',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-clock',
              position: 'top-center'
            });

            // Limpiar inmediatamente el estado para detener el cronómetro
            me.evaluacionEnCurso = null;
            me.tiempoRestante = null;

            // Recargar evaluaciones para actualizar el estado en la UI
            setTimeout(() => {
              me.verificandoFinalizacion = false;
              me.f_getEvaluacionesDocente();
              me.getEvaluacionesResueltas();
            }, 1000);
          } else {
            console.error('❌ Error al finalizar evaluación:', res.data.message);
            me.verificandoFinalizacion = false;
          }
        })
        .catch(err => {
          console.error('❌ Error al finalizar evaluación automáticamente:', err);
          me.verificandoFinalizacion = false;
        });
      },
      asignaturasUsuario() {
        let me = this;
        me.$router.push('/docente/usuarioasignaturas');
      },
      verPromedios(item) {
        let me = this;
        if (me.configuracion[0].ver_respuestas == 0) {
          me.$vs.notify({
            text: 'Los resultados aún no estan disponibles, un administrador de La Salle, lo habilitará más adelante.',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
      },
      resolverEvaluacion() {
        let me = this;
        localStorage.setItem('tipo_revisar', 0);
        me.$router.push('/salle/docente/evaluacion');
      },
      revisarEvaluacion(id_evaluacion) {
        let me = this;
        localStorage.setItem('tipo_revisar', 1);
        localStorage.setItem('id_evaluacion_salle', id_evaluacion);
        me.$router.push('/salle/docente/evaluacion');
      },
      async getEvaluacionesResueltas(){
        let me = this
        await me.$http.get(this.$server_url+'evaluaciones_resueltas_salle/' + me.usuario.idusuario+'/'+localStorage.EvaluacionSelectSalle)
        .then(res => {
          me.cargando = false;
          me.listaEvaluaciones = res.data
          let date_actua = new Date()
          me.fechaLocal = moment(date_actua, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          if (me.configuracion !== undefined && me.configuracion.length > 0) {
            if (me.fechaLocal > me.configuracion[0].fecha_inicio && me.fechaLocal < me.configuracion[0].fecha_fin ) {
              // se valida que no permita dar mas evaluaciones de las permitidas en la configuracion, teniendo el cuenta el periodo.
              var evaluaciones_periodo_actual = 0
              var d = new Date();
              var anio_actual = d.getFullYear();
              $.each(me.listaEvaluaciones, function(key, value){
                  console.log((((value.updated_at).split(' '))[0]).split('-')[0] +' == '+ anio_actual)
                  if( (((value.updated_at).split(' '))[0]).split('-')[0] == anio_actual ){
                      evaluaciones_periodo_actual++
                  }
              });
              if( evaluaciones_periodo_actual < me.configuracion[0].cant_evaluaciones ){
                  me.evaluacionOk = true;
                  me.mensajeEvaluacion = 'La evaluación estará disponible hasta el día ' + me.fechaLarga(me.configuracion[0].fecha_fin);
                  me.eval_color = '#4caf50';
              }else{
                  me.evaluacionOk = false
              }
            } else {
              me.evaluacionOk = false
              console.log(me.fechaLocal +' < '+ me.configuracion[0].fecha_inicio)
              if (me.fechaLocal < me.configuracion[0].fecha_inicio) {
                  me.mensajeEvaluacion = 'La próxima evaluación estará activa el día: ' + me.fechaLarga(me.configuracion[0].fecha_inicio);
                  me.eval_color = '#2196f3';
              }
              else if(me.fechaLocal > me.configuracion[0].fecha_fin) {
                  me.mensajeEvaluacion = 'El período para rendir la evaluación ha finalizado.';
                  me.eval_color = '#f44336';

                  // Si hay una evaluación en curso, finalizarla automáticamente
                  // if(me.arrayEvaluaciones && me.arrayEvaluaciones.length > 0) {
                  //   let evalActiva = me.arrayEvaluaciones.find(ev => ev.estado == 1 && ev.intentos > 0);
                  //   if(evalActiva && evalActiva.id_evaluacion) {
                  //     console.log('⚠️ Período finalizado detectado. Finalizando evaluación en curso...');
                  //     me.finalizarEvaluacionAutomatica(evalActiva.id_evaluacion, me.usuario.idusuario);
                  //   }
                  // }
              }
              else {
                  me.mensajeEvaluacion = 'Horario no permitido para rendir la evaluación.';
                  me.eval_color = '#737893';
              }
            }
          } else {
            me.evaluacionOk = false
            me.mensajeEvaluacion = 'Su institucion no está configurada, comuníquese con el administrador.';
            me.eval_color = '#998159';
          }
        })
        .catch(err => {
            me.cargando = false;
        })
      },
      formatDateTime(fecha) {
        if (!fecha) return '-';
        let d = new Date(fecha);
        return d.toLocaleString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      formatDate(fecha) {
        if (!fecha) return '-';
        let d = new Date(fecha);
        return d.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      },
    },
}
</script>

<style scoped>
/* Container Layout */
.evaluaciones-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
  gap: 1.5rem;
}

.evaluaciones-left-col {
  flex: 1 1 65%;
  min-width: 320px;
  margin-bottom: 1.5rem;
  position: relative;
}

.evaluaciones-right-col {
  flex: 1 1 30%;
  min-width: 280px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .evaluaciones-left-col,
  .evaluaciones-right-col {
    flex: 1 1 100%;
  }
}

/* Card Styles - Theme Aware */
.clean-card {
  border-radius: 16px;
  box-shadow: 0 4px 25px 0 rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.clean-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

/* Card Headers - Theme Aware */
.card-header-custom {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.theme-dark .card-header-custom {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.card-header-simple {
  margin-bottom: 1.5rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.header-subtitle {
  opacity: 0.7;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.header-icon-box {
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-dark .header-icon-box {
  background-color: rgba(255, 255, 255, 0.05);
}

.icon-lg {
  font-size: 1.25rem;
}

.card-content {
  margin-top: 1rem;
}

.status-content {
  width: 100%;
}

/* Skeleton Loader */
.skeleton-loader {
  padding: 1rem;
  animation: fadeIn 0.3s ease-in;
}

.skeleton-header {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.theme-dark .skeleton-header {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
  margin: 0 auto;
}

.theme-dark .skeleton-line {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
}

.skeleton-button {
  height: 2.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-top: 1rem;
}

.theme-dark .skeleton-button {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Verification Progress */
.verification-progress {
  padding: 2rem 1rem;
  text-align: center;
  animation: fadeIn 0.3s ease-in;
}

.progress-icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.progress-icon-wrapper i {
  font-size: 2rem;
}

.rotating {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.theme-dark .progress-title {
  color: #f1f5f9;
}

.progress-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.theme-dark .progress-subtitle {
  color: #94a3b8;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.theme-dark .progress-bar-container {
  background: rgba(59, 130, 246, 0.2);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb, #3b82f6);
  background-size: 200% 100%;
  animation: progressFlow 1.5s ease-in-out infinite;
  border-radius: 10px;
}

@keyframes progressFlow {
  0% {
    width: 0%;
    background-position: 0% 50%;
  }
  50% {
    width: 100%;
    background-position: 100% 50%;
  }
  100% {
    width: 100%;
    background-position: 200% 50%;
  }
}

/* Evaluation Status Card */
.eval-status-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.theme-dark .eval-status-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.eval-status-card.in-progress {
  border-color: #3b82f6;
  background: linear-gradient(to bottom, #eff6ff 0%, white 100%);
}

.theme-dark .eval-status-card.in-progress {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.eval-status-card.available {
  border-color: #10b981;
  background: linear-gradient(to bottom, #f0fdf4 0%, white 100%);
}

.theme-dark .eval-status-card.available {
  background: linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.eval-status-card.not-available {
  border-color: #94a3b8;
}

/* Compact Card Styles */
.eval-status-card.compact {
  padding: 1rem;
}

.status-icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #3b82f6;
}

.status-icon-wrapper.compact {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.5rem;
}

.status-icon-wrapper.compact i {
  font-size: 1.5rem;
}

.status-icon-wrapper.success {
  background: #f0fdf4;
  color: #10b981;
}

.status-icon-wrapper.complete {
  background: #f0fdf4;
  color: #10b981;
}

.status-icon-wrapper.disabled {
  background: #f8fafc;
  color: #94a3b8;
}

.theme-dark .status-icon-wrapper {
  background: rgba(59, 130, 246, 0.2);
}

.theme-dark .status-icon-wrapper.success {
  background: rgba(16, 185, 129, 0.2);
}

.theme-dark .status-icon-wrapper.complete {
  background: rgba(16, 185, 129, 0.2);
}

.theme-dark .status-icon-wrapper.disabled {
  background: rgba(148, 163, 184, 0.2);
}

.status-icon-wrapper i {
  font-size: 2rem;
}

.status-main-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.status-main-title.compact {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.theme-dark .status-main-title {
  color: #f1f5f9;
}

.status-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.theme-dark .status-subtitle {
  color: #94a3b8;
}

.status-message {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-top: 0.5rem;
}

.theme-dark .status-message {
  color: #94a3b8;
}

/* Evaluation Details Grid */
.eval-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: left;
}

.theme-dark .detail-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.detail-item i {
  font-size: 1rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.detail-label {
  font-size: 0.6875rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.theme-dark .detail-label {
  color: #94a3b8;
}

.detail-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
}

.theme-dark .detail-value {
  color: #f1f5f9;
}

/* Time Remaining Box */
.time-remaining-box {
  background: #1e293b;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.time-remaining-box.compact {
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.theme-dark .time-remaining-box {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.time-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.time-display.compact {
  gap: 0.25rem;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-unit.compact {
  flex-direction: row;
  gap: 0.25rem;
}

.time-number {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  font-family: 'Courier New', monospace;
  line-height: 1;
}

.time-unit.compact .time-number {
  font-size: 1.5rem;
}

.time-text {
  font-size: 0.625rem;
  color: #94a3b8;
  text-transform: uppercase;
  margin-top: 0.25rem;
  font-weight: 600;
}

.time-unit.compact .time-text {
  font-size: 0.5rem;
  margin-top: 0;
}

.time-separator {
  font-size: 1.5rem;
  color: white;
  font-weight: 700;
  padding: 0 0.25rem;
}

/* Compact Details Layout */
.eval-details-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #64748b;
}

.theme-dark .detail-row {
  color: #94a3b8;
}

.detail-row i {
  font-size: 0.875rem;
  color: #3b82f6;
}

.detail-row span {
  font-weight: 500;
}

/* Info Box for Available Status */
.eval-info-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.eval-info-box.compact {
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.theme-dark .eval-info-box {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  text-align: left;
}

.info-row.compact {
  font-size: 0.8125rem;
  justify-content: center;
}

.theme-dark .info-row {
  color: #cbd5e1;
}

.info-row:not(:last-child) {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.theme-dark .info-row:not(:last-child) {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.info-row i {
  font-size: 1rem;
  color: #3b82f6;
  flex-shrink: 0;
}

.info-row strong {
  font-weight: 700;
  color: #1e293b;
}

.theme-dark .info-row strong {
  color: #f1f5f9;
}

/* Buttons */
.btn-continue,
.btn-start {
  width: 100%;
  font-weight: 700;
  border-radius: 10px;
  padding: 14px 24px;
  font-size: 0.9375rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-continue.compact,
.btn-start.compact {
  padding: 10px 20px;
  font-size: 0.875rem;
  border-radius: 8px;
}

.btn-continue:hover,
.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Divider Line - Theme Aware */
.divider-line {
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin: 1.5rem 0;
}

.theme-dark .divider-line {
  border-top-color: rgba(255, 255, 255, 0.08);
}

/* Asignaturas Section */

.periodo-name {
  font-weight: 700;
}

.estado-text {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Alert Warning - Theme Aware */
.alert-warning {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  background-color: #fef3c7;
}

.theme-dark .alert-warning {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.3);
  background-color: rgba(251, 191, 36, 0.1);
}

.icon-alert {
  margin-right: 0.5rem;
  font-size: 1.125rem;
}

.alert-text {
  font-weight: 500;
}

/* Empty State Table */
.empty-state-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 200px;
}

.empty-message {
  font-size: 0.9375rem;
  color: #64748b;
  margin-top: 0.75rem;
  font-weight: 500;
}

.theme-dark .empty-message {
  color: #94a3b8;
}

/* Loading Container */
.loading-container {
  padding: 1rem 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.status-content {
  width: 100%;
}

/* Icon Sizes - Theme Aware */
.icon-large {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.icon-green {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.theme-dark .icon-green {
  background-color: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.icon-4xl {
  font-size: 2.5rem;
}

.icon-medium {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.theme-dark .icon-medium {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.icon-3xl {
  font-size: 2rem;
}

.icon-2xl {
  font-size: 1.5rem;
}

/* Status Title */
.status-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Button Resolver */
.btn-resolver {
  width: 100%;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.btn-resolver:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

/* Info Box - Theme Aware */
.info-box {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 1rem;
}

.theme-dark .info-box {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

.info-title {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.info-message {
  font-size: 0.875rem;
  opacity: 0.8;
  line-height: 1.4;
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.empty-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.theme-dark .empty-icon-wrapper {
  background-color: rgba(255, 255, 255, 0.1);
}

.empty-icon {
  opacity: 0.5;
}

/* Divider Line - Theme Aware */
.divider-line {
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin: 1.5rem 0;
}

.theme-dark .divider-line {
  border-top-color: rgba(255, 255, 255, 0.08);
}

/* Asignaturas Section */
.asignaturas-section {
  width: 100%;
}

/* Row Hover Effect - Theme Aware */
.styled-row {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.theme-dark .styled-row {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.styled-row:hover {
  background-color: rgba(0, 0, 0, 0.02) !important;
}

.theme-dark .styled-row:hover {
  background-color: rgba(255, 255, 255, 0.03) !important;
}

.styled-row:last-child {
  border-bottom: none;
}

/* Button Upgrades */
.action-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: rgba(25, 118, 210, 0.1) !important;
  color: #1976d2 !important;
}

.theme-dark .action-btn:hover {
  background-color: rgba(25, 118, 210, 0.2) !important;
  color: #64b5f6 !important;
}

/* Secondary Action Button */
.action-btn-secondary {
  border-radius: 12px;
  font-weight: 600;
  background-color: rgba(255, 152, 0, 0.1) !important;
  color: #ff9800 !important;
  padding: 12px 0;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-btn-secondary:hover {
  background-color: rgba(255, 152, 0, 0.2) !important;
  color: #e65100 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Table Customizations - Theme Aware */
::v-deep .vs-table--header {
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 10px;
}

.theme-dark ::v-deep .vs-table--header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

::v-deep .vs-table--search {
  padding: 0;
  margin-bottom: 1rem;
  max-width: 100%;
}

::v-deep .vs-table--search-input {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.3s;
  width: 100%;
}

.theme-dark ::v-deep .vs-table--search-input {
  border-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.03);
}

::v-deep .vs-table--search-input:focus {
  background-color: rgba(144, 205, 244, 0.05);
  border-color: #90cdf4;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  outline: none;
}

/* Utility Classes */
.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.whitespace-no-wrap {
  white-space: nowrap;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.relative {
  position: relative;
}

.overflow-hidden {
  overflow: hidden;
}
</style>

