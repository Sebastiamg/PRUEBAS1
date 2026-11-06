<template>
    <div>
      <div v-if="menu == 0">
        <vx-card
          title="EvaluaciÃ³n Salle"
          title-color="success"
          v-if="ObjectInstitucion.tipo_institucion == 2 && verEvaluacionSalle">
          <div>
            <listaEvaluacionesVue/>
          </div>
        </vx-card>
        <vx-card>
          <div class="vx-row">
            <!--NECESIDADES EDUCATIVAS-->
            <div class="vx-col w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 mb-6" v-if="arregloAsignados.length > 0">
              <div actionable class="p-5 alto">
                <div class="padre padrea">
                  <div class="hijo1 colora">
                    <h3 style="">Necesidades educativas</h3>
                  </div>
                  <div class="hijo2">
                    <img src="@/assets/images/home/docenteHome/neet.png" @click="menu = 1;"  style="transition:2s ease;border-radius: 10px;" width="100" alt="login" class="img-responsive mx-auto">
                    <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;position: absolute;bottom:45px;">{{ arregloAsignados.length }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="vx-col w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 mb-6">
              <div actionable class="p-5 alto">
                <div class="padre padreb">
                  <div class="hijo1 hijo1b">
                    <h3 style="">Libros</h3>
                  </div>
                  <div class="hijo2">
                    <img src="@/assets/images/home/docenteHome/libros.png"  @click="irLibros()" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                    <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_libros}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="vx-col w-full sm:w-fullmd:w-full lg:w-1/3 xl:w-1/3 mb-6">
                <div actionable class="p-5 alto">
                    <div class="padre padrec">
                        <div class="hijo1 hijo1c">
                            <h3 style="">Evaluaciones</h3>
                        </div>
                        <div class="hijo2">
                            <img src="@/assets/images/home/docenteHome/exam.png" @click="irCurso()" style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                            <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_evaluaciones}}</p>
                        </div>
                    </div>
                </div>
            </div>
                        <vx-card class="vx-col w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 mb-6 profile-card-compact">
              <div class="user-card-head">
                <h3>Datos del usuario</h3>
                <div class="user-card-actions">
                  <vs-button color="success" icon="account_circle" size="small" @click="irPerfil()" type="relief">Perfil</vs-button>
                  <vs-button color="danger" icon="close" size="small" @click="logout()" type="relief">Salir</vs-button>
                </div>
              </div>
              <div class="user-card-body">
                <div class="user-field">
                  <span class="user-label">Nombres:</span>
                  <span class="user-value">{{usuario.nombres}}</span>
                </div>
                <div class="user-field">
                  <span class="user-label">Apellidos:</span>
                  <span class="user-value">{{usuario.apellidos}}</span>
                </div>
                <div class="user-field">
                  <span class="user-label">Email:</span>
                  <span class="user-value">{{usuario.email}}</span>
                </div>
                <div class="user-field">
                  <span class="user-label">Usuario:</span>
                  <span class="user-value">{{usuario.name_usuario}}</span>
                </div>
                <div class="user-field">
                  <span class="user-label">Institución:</span>
                  <span class="user-value">{{nombreInstitucion}}</span>
                </div>
              </div>
            </vx-card>
            <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
              <vs-card actionable class="p-5 vx-card alto">
              <div class="padre padrea">
                <div class="hijo1 hijo1a">
                  <h3 style="">Seminarios</h3>
                </div>
                <div class="hijo2">
                  <img src="@/assets/images/home/docenteHome/meeting.png" @click="irSeminario()"  style="transition:2s ease;" width="80" alt="login" class="img-responsive mx-auto">
                  <p style="margin:0px 0px 10px 10px;font-weight:700;font-size:25px;color:#0A90F3;">{{cant_seminarios}}</p>
                </div>
              </div>
              </vs-card>
            </div> -->
          </div>
        </vx-card>
        <br/>
        <vx-card>
          <div class="vx-col w-full mb-6">
            <Agenda/>
          </div>
        </vx-card>
      </div>
      <vx-card
      title="Listado de Necesidades Educativas"
      v-else
      >
        <vs-button type="border" color="primary"  @click="menu = 0;">â† Regresar</vs-button>
        <NeetDocenteVue :arregloAsignados="arregloAsignados" :arregloTemas="arregloTemas"/>
      </vx-card>
    </div>
</template>
<script>
import axios from 'axios'
import Agenda from '../docentes/agenda_docente.vue'
import reportePastelDocente from './components/docente/docentePastel.vue'
import VxCard from '../../components/vx-card/VxCard.vue'
import NeetDocenteVue from '@/views/home/neet/NeetDocente'
import NeetRepository from '@/repositories/NeetRepository'
import listaEvaluacionesVue from '../salle/docente/evaluaciones/listaEvaluaciones.vue'
export default {
    data() {
      return{
        usuario: [],
        nombreInstitucion:'Cargando...',
        historicoDocenteArreglo:[],
        individuald:[],
        cant_libros:0,
        cant_evaluaciones:0,
        cant_seminarios:0,
        estadisticaVisitas:'',
        //variables para necesidades educativas
        arregloAsignados:[],
        menu:0,
        arregloTemas:[],
        //fin variables para necesidades educativas
      }
    },
    components:{
      Agenda,
      reportePastelDocente,
      VxCard,
      NeetDocenteVue,
      listaEvaluacionesVue,
    },
    props:{
      ObjectInstitucion:{
        type:Object,
        default:function(){
          return {}
        }
      },
      verEvaluacionSalle:{
        type:Object,
        default:false
      }
    },
    methods: {
      getSeminarios() {
        let me = this;
        this.$http.get(this.$server_url+'get_seminarios_docente/'+me.usuario.idusuario)
        .then(function (res) {
            me.cant_seminarios = res.data.length
        })
        .catch(function (error) {
        })
      },
      //cantidad de libros del docente
      async getLibros() {
        let me = this;
        this.$http.get(this.$server_url+'libros?idusuario=' + me.usuario.idusuario+'&periodo_id='+localStorage.periodo_id)
          .then(function (response) {
            me.cant_libros = response.data.length;
          })
          .catch(function (error) {
          })
      },
      //cantidad de evaluaciones del docente
      async getEvaluaciones() {
        let me = this;
        this.$http.get(this.$server_url+'cantEvaluacionesDocente?idusuario=' + me.usuario.idusuario+'&id_institucion='+me.usuario.institucion_idInstitucion)
          .then(function (response) {
            me.cant_evaluaciones = response.data.length;
          })
          .catch(function (error) {

          })
      },
      getNecesidadesEducativas(){
        let me = this
        const { idusuario,institucion_idInstitucion } = me.usuario
        NeetRepository.getNecesidadesEducativasxUsuario(idusuario,institucion_idInstitucion).then( r => { me.arregloAsignados = r.data })
      },
      //ir a al vistas de cursos
      irCurso(){
        let me = this;
        me.$router.push('/cursosevaluaciones')
      },
      //ir a la vista de libros
      irLibros(){
          let me = this;
          me.$router.push('/docente/libros2')
      },
      //ur a ka vista de seminario
      irSeminario(){
          let me = this;
          me.$router.push('/docente/seminarios')
      },
      //para ir al perfil
      irPerfil(){
        let me = this;
        me.$router.push('/perfil');
      },
      async logout() {
        await this.$store.dispatch('logout')
        this.$router.push('/');
      },
      cargarNombreInstitucion() {
        let me = this;
        const nombre = localStorage.getItem('nombreInstitucion');
        if (nombre && nombre !== 'undefined' && nombre !== 'null') {
          me.nombreInstitucion = nombre;
        } else {
          // Si no existe, intentar obtenerlo del usuario
          if (me.usuario && me.usuario.institucion_idInstitucion) {
            // Aquí podrías hacer una petición al servidor si es necesario
            me.nombreInstitucion = 'Institución no disponible';
          }
        }
      },
    },
    created() {
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.cargarNombreInstitucion();
    },
    mounted(){
      let me = this;
      me.cargarNombreInstitucion();
      me.getEvaluaciones();
      me.getSeminarios();
      me.getNecesidadesEducativas()
      let getPeriodo = localStorage.periodo_id
      if(getPeriodo == undefined || getPeriodo == ""){
        setTimeout(function(){
          me.getLibros();
          me.cargarNombreInstitucion(); // Reintentar después del timeout
        }, 5000);
      }else{
         me.getLibros();
      }
    },
    watch: {
      // Observar cambios en el localStorage
      '$route'() {
        this.cargarNombreInstitucion();
      }
    }
}
</script>

<style scoped>
.contenedor-perfil{
  width: 100%;
  border-radius: 20px 0px;
  padding: 0px;
}
.p-5 {
    padding: 0 !important;
}
.padre{
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 180px;
    border-radius: 12px;
    padding: 0px;
    overflow: hidden;
    background: white;
    border: 2px solid #e0e7ff;
    transition: all 0.25s ease;
}
.padre:hover{
    border-color: #818cf8;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
}
.padrea{
    border-color: #fed7aa;
}
.padrea:hover{
    border-color: #fb923c;
    box-shadow: 0 8px 24px rgba(251, 146, 60, 0.15);
}
.padreb{
    border-color: #fecaca;
}
.padreb:hover{
    border-color: #f87171;
    box-shadow: 0 8px 24px rgba(248, 113, 113, 0.15);
}
.padrec{
    border-color: #a7f3d0;
}
.padrec:hover{
    border-color: #34d399;
    box-shadow: 0 8px 24px rgba(52, 211, 153, 0.15);
}
.padred{
    border-color: #ddd6fe;
}
.padred:hover{
    border-color: #a78bfa;
    box-shadow: 0 8px 24px rgba(167, 139, 250, 0.15);
}
.hijo1{
    text-align: center;
    width: 100%;
    padding: 16px 0;
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
}
.colora .hijo1{
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
    border-bottom-color: #fed7aa;
}
.hijo1b{
   background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
   border-bottom-color: #fecaca;
}
.hijo1c{
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-bottom-color: #bbf7d0;
}
.hijo1d{
    background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    border-bottom-color: #e9d5ff;
}
.hijo1 > h3{
    color: #1e293b;
    font-weight: 600;
    letter-spacing: 0.3px;
    padding: 0;
    margin: 0;
    font-size: 1rem;
}
.hijo2{
    margin-top: 0;
    cursor: pointer;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    position: relative;
    padding: 20px;
}
.hijo2 img{
    transition: transform 0.2s ease;
    margin-bottom: 12px;
}
.hijo2:hover img{
    transform: scale(1.08);
}
.hijo2 p{
    margin: 0;
    font-weight: 700;
    font-size: 1.75rem;
    color: #3b82f6;
}

.contenido-perfil{
    display: flex;
    flex-wrap: wrap;
    padding: 15px;
    overflow: hidden;
}
.titulo-perfil{
    color: #64748b;
    padding: 5px;
    font-size: 0.9rem;
    margin: 6px 0;
}
.titulo-perfil span{
    color: #1e293b !important;
    font-weight: 500;
}
.alto{
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
}
.profile-card-compact{
    min-height: 180px;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}
.profile-card-compact .user-card-head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #ffeef0 0%, #f8d7da 100%);
    border-bottom: 1px solid #f5c2c7;
}
.profile-card-compact .user-card-head h3{
    margin: 0;
    font-size: 0.84rem;
    font-weight: 700;
    color: #334155;
    white-space: nowrap;
}
.profile-card-compact .user-card-actions{
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
.profile-card-compact .user-card-body{
    flex: 1;
    padding: 12px 14px 14px;
}
.profile-card-compact .user-field{
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 6px;
    line-height: 1.2;
}
.profile-card-compact .user-label{
    min-width: 72px;
    font-size: 0.74rem;
    font-weight: 700;
    color: #64748b;
    flex-shrink: 0;
}
.profile-card-compact .user-value{
    font-size: 0.76rem;
    color: #0f172a;
    opacity: 0.85;
    font-weight: 500;
    word-break: break-word;
    min-width: 0;
}
.profile-card-compact .vs-button{
    min-width: 66px;
    padding: 0.28rem 0.65rem;
    font-size: 0.7rem;
    line-height: 1;
}
.profile-card-compact .vs-button + .vs-button{
    margin-top: 0;
}
.hijo2 .vs-icon{
    transition: all 0.2s ease;
    margin-bottom: 8px;
}
.hijo2:hover .vs-icon{
    transform: scale(1.1);
}
@media (max-width: 768px){
    .profile-card-compact .user-card-head{
        flex-direction: column;
        align-items: stretch;
    }
    .profile-card-compact .user-card-actions{
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
    }
    .profile-card-compact .user-field{
        flex-direction: column;
        gap: 2px;
        margin-bottom: 8px;
    }
    .profile-card-compact .user-label{
        min-width: 0;
    }
}
</style>

