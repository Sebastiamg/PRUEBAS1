<template>
  <div class="estudiante-home">
    <!--evaluaciones-->
    <div class="vx-row" v-if="arrayMaterias.length > 0">
      <div class="vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6">
        <vx-card title="Evaluaciones Pendientes">
          <EstudianteEvaluacionesPendientesVue :arrayMaterias="arrayMaterias"/>
        </vx-card>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-2/3 xl:w-2/3 mb-6">
        <vx-card class="tickets-card">
          <div class="panel-header">
            <div class="panel-header-titulo">
              <vs-icon icon="confirmation_number" size="22px" color="#046AE7"></vs-icon>
              <h3>Tickets</h3>
            </div>
            <span v-if="cantidadMensajesVistos < cantidadMensajesNovistos" class="badge-alerta">
              {{ cantidadMensajesNovistos }} sin ver
            </span>
          </div>
          <div class="tickets-body">
            <ticketEstudianteVue />
          </div>
        </vx-card>
      </div>

      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
        <div class="tareas-columna">
          <div class="stat-card stat-card--pendientes" @click="irACursos" title="Ver tareas pendientes en tus cursos">
            <div class="stat-card-header">
              <h3>Tareas Pendientes</h3>
              <vs-icon icon="chevron_right" size="16px" color="#94a3b8"></vs-icon>
            </div>
            <div class="stat-card-body">
              <vs-icon icon="assignment_late" size="42px" color="#d97706"></vs-icon>
              <p class="stat-numero">{{ tareasPendientes }}</p>
            </div>
          </div>

          <div class="stat-card stat-card--enviadas" @click="irACursos" title="Ver tareas enviadas en tus cursos">
            <div class="stat-card-header">
              <h3>Tareas Enviadas</h3>
              <vs-icon icon="chevron_right" size="16px" color="#94a3b8"></vs-icon>
            </div>
            <div class="stat-card-body">
              <vs-icon icon="check_circle" size="42px" color="#059669"></vs-icon>
              <p class="stat-numero">{{ tareasRealizadas }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
const ticketEstudianteVue                 = () => import('@/views/estudiantes/ticketEstudiante.vue')
const EstudianteEvaluacionesPendientesVue = () => import('./estudiante/Evaluaciones/EstudianteEvaluacionesPendientes.vue')
export default {
  components: {
    ticketEstudianteVue,
    EstudianteEvaluacionesPendientesVue,
  },
  computed: {
    ...mapState(['cursos']),
  },
  data() {
    return {
      cantidadMensajesNovistos: 0,
      cantidadMensajesVistos: 0,
      usuario:[],
      arrayMaterias:[],
      tareasPendientes: 0,
      tareasRealizadas: 0,
    }
  },
  created(){
    let me = this;
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    let me = this;
    this.getMaterias()
    this.getTicketsAbiertos()
    this.getCantidadTareas()
  },
  methods:{
    getMaterias(){
      let me = this
      this.$http.get(this.$server_url + `estudianteMetodosGet?getMateriasAsignadas=1&idusuario=${me.usuario.idusuario}`)
      .then(function (res) {
        var datos = []
        datos     = res.data
        if(datos.length == 0){
          me.arrayMaterias = datos
        }else{
          //en la propiedad accion que tiene 0 cambiar por false
          datos.forEach(element => {
            element.accion = false
          });
          me.arrayMaterias = datos
        }
      })
      .catch(function (err) {
        me.$vs.notify({
          title: 'Error',
          text: 'Error al cargar las materias',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
        console.log(err)
      })
    },
    getCantidadTareas(){
      //api:get
      let me = this;
      this.$http.get(this.$server_url + `estudianteMetodosGet?getTareasEstudiante=1&idusuario=${me.usuario.idusuario}`)
        .then(function (res) {
          console.log(res.data)
          me.tareasPendientes         = res.data.pendientes
          me.tareasRealizadas         = res.data.realizadas
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    getTicketsAbiertos() {
      let me = this;
      this.$http.get(this.$server_url + 'ticket?cantidadTicketNotificacion=yes&id=' + me.usuario.idusuario)
        .then(function (res) {
          console.log(res.data)
          if (res.data.length > 0) {
            me.cantidadMensajesNovistos = res.data[0].cantidad
            me.cantidadMensajesVistos   = res.data[0].cantidad_tickets_usuario
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    irACursos() {
      this.$router.push('/estudiante/cursos')
    },
  }
}
</script>
<style scoped>
/* ===== tickets ===== */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #eef0f4;
}

.panel-header-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-header-titulo h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
}

.badge-alerta {
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

.tickets-body {
  height: 440px;
  overflow-y: auto;
}

/* ===== tareas ===== */
.tareas-columna {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.stat-card {
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  border: 2px solid transparent;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
}

.stat-card--pendientes {
  border-color: #fde68a;
}

.stat-card--pendientes:hover {
  border-color: #f59e0b;
}

.stat-card--enviadas {
  border-color: #a7f3d0;
}

.stat-card--enviadas:hover {
  border-color: #10b981;
}

.stat-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 2px solid inherit;
}

.stat-card--pendientes .stat-card-header {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-bottom-color: #fde68a;
}

.stat-card--enviadas .stat-card-header {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-bottom-color: #a7f3d0;
}

.stat-card-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.stat-card-body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.stat-numero {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

@media (max-width: 640px) {
  .tickets-body {
    height: 360px;
  }
}
</style>
