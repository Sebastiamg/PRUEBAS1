<template>
  <div>
    <!--CARDS-->
    <div class="courses-container mr-5">
      <div class="course vx-row">
        <!--INFORMACION-->
        <div class="course-preview vx-col w-full sm:w-full md:w-1/3 lg:w-1/3" :style="item.solucionario == '1' ? 'background-color:#A2F1EB':'background-color:#D2F3CE'">
          <p> <vs-chip>{{ item.subnivel }}</vs-chip></p>
          <p v-if="item.solucionario == '1'"> <vs-chip color="#3D20CE" class="ml-3" transparent>Solucionario</vs-chip></p>
          <p> <vs-chip color="#1BA441" class="ml-3" transparent>{{ item.docentesAsignados }} Asignados</vs-chip></p>
          <br><br>
          <h6 :style="item.solucionario == '1' ? 'color:#2A847D':'color:#247C1A'">{{ item.documento }}</h6>
          <div class="flex">
            <a href="#">Tema: {{ item.tema }} <i class="fas fa-chevron-right"></i></a>
            <vx-tooltip style="display: inline-block;" text="Asignar recurso a docente" position="top" color="primary">
              <p class="cursor-pointer mt-6" @click="objectNecesidad = item;popupAsignar = true;"><vs-chip class="ml-3 mt-1"  color="dark"><ion-icon style="font-size:18px;" name="add-circle-outline"></ion-icon> <span class="ml-2">Asignar</span></vs-chip></p>
            </vx-tooltip>
          </div>
        </div>
        <!--ARCHIVOS-->
        <div class="course-info overflow-y-auto h-48 w-full sm:w-full md:w-1/3 lg:w-1/3">
          <p class="text-success font-bold text-center">Archivos</p>
          <vs-list>
            <vs-list-item v-for="(tr,$index) in item.files" :key="$index" :subtitle="' '+tr.archivo">
                <template slot="avatar">
                  <vx-tooltip style="display: inline-block;" text="Click para descargar" position="top" color="primary">
                    <vs-avatar @click="descargar(tr)" color="primary" class="cursor-pointer" icon-pack="feather" icon="icon-download" />
                  </vx-tooltip>
                </template>
            </vs-list-item>
          </vs-list>
        </div>
        <!--ACTIVIDADES-->
        <div class="course-info overflow-y-auto h-48 w-full sm:w-full md:w-1/3 lg:w-1/3" style="border-left: 1px solid #f2f2f2;">
          <p class="text-success font-bold text-center">Actividades</p>
          <div v-if="item.actividad1 || item.actividad2 || item.actividad3 || item.actividad4 || item.actividad5">
            <div v-if="item.actividad1">
              <b>Actividad 1:</b>
              <p class="enlace" @click="verActividad(item.actividad1)">{{ item.actividad1 }}</p>
              <br>
            </div>
            <div v-if="item.actividad2">
              <b>Actividad 2:</b>
              <p class="enlace" @click="verActividad(item.actividad2)">{{ item.actividad2 }}</p>
              <br>
            </div>
            <div v-if="item.actividad3">
              <b>Actividad 3:</b>
              <p class="enlace" @click="verActividad(item.actividad3)">{{ item.actividad3 }}</p>
              <br>
            </div>
            <div v-if="item.actividad4">
              <b>Actividad 4:</b>
              <p class="enlace" @click="verActividad(item.actividad4)">{{ item.actividad4 }}</p>
              <br>
            </div>
            <div v-if="item.actividad5">
              <b>Actividad 5:</b>
              <p class="enlace" @click="verActividad(item.actividad5)">{{ item.actividad5 }}</p>
            </div>
          </div>
          <div v-else>
            <p class="text-center mt-2">No hay activades registradas</p>
          </div>
        </div>
      </div>
    </div>
    <!--MODAL PARA AGREGAR-->
    <vs-popup class="holamundo" :title="'Asignar Necesidad Educativa'" :active.sync="popupAsignar">
      <DeceAsignaVue v-if="popupAsignar" :objectNecesidad="objectNecesidad" @changeRecharge="changeRecharge"/>
    </vs-popup>
  </div>
</template>
<script>
import DeceAsignaVue from './components/DeceAsigna.vue';
export default{
  components:{
    DeceAsignaVue,
  },
  data(){
    return{
      objectNecesidad:{},
      popupAsignar:false,
    }
  },
  props:{
    item:{
      type:Object,
      default:{}
    },
  },
  methods:{
    descargar(p){
      let me = this;
      window.open(this.$data_url+'archivos/neetFiles/' + p.url, '_blank');
      return
    },
    verActividad(url){
      let me = this;
      localStorage.Exteriorurl = url
      let route = this.$router.resolve({path: '/admin_neet_actividad'});
      window.open(route.href, '_blank');
    },
    changeRecharge(e){
      let me = this
      if(e == 1) {
        me.popupAsignar = false
        if(me.popupAsignar == false) {
          setTimeout(function() { me.$emit('changeRecharge',true) }, 1000);
        }
      }
    }
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
.courses-container{
  transition: 1s ease-in;
}
.courses-container:hover{
  transform: translateY(-15px);
}
.course {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
	display: flex;
	max-width: 100%;
	margin: 20px;
	overflow: hidden;
	width: 100%;
}
.course h6 {
	opacity: 0.6;
	margin: 0;
	letter-spacing: 1px;
	text-transform: uppercase;
}

.course h2 {
	letter-spacing: 1px;
	margin: 10px 0;
}

.course-preview {
	padding: 30px;
	width: 50%;
}
.course-preview > h2{
  color:#247C1A;
  opacity: 0.8;
  font-weight: bold;
  margin-top: 10px;
}
.course-preview >h6{
  opacity: 0.8;
  font-weight: bold;
  margin-top: 10px;
}
.course-preview a {
	color: #000;
	display: inline-block;
	font-size: 12px;
	opacity: 0.8;
	margin-top: 30px;
	text-decoration: none;
}

.course-info {
	padding: 30px;
	position: relative;
	width: 50%;
}
/*etiqueta*/
.boton-con-triangulo {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff; /* Color de fondo del botón */
  color: #fff; /* Color del texto */
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.boton-con-triangulo a {
  color: #fff;
  text-decoration: none;
}

.boton-con-triangulo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 20px 0 20px 20px; /* Controla el tamaño del triángulo izquierdo */
  border-color: transparent transparent transparent #007bff; /* Color del triángulo */
}
/*ACTIVIDADES*/
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,700");


.enlace {
  font-family: Montserrat, sans-serif;
}

.hover-container {
  text-align: center;
  margin-bottom: 2em;
}

/* --- this is the code you probably want ---- */

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
/*boton asignar*/
/* CSS */
.button-59 {
  align-items: center;
  background-color: transparent;
  border: 2px solid #fff;
  box-sizing: border-box;
  color: #000;
  cursor: pointer;
  display: inline-flex;
  font-family: Inter,sans-serif;
  font-size: 14px;
  font-weight: 600;
  height: 48px;
  justify-content: center;
  letter-spacing: -.8px;
  line-height: 24px;
  width: 50px;
  outline: 0;
  padding: 0 5px;
  text-align: center;
  text-decoration: none;
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-59:focus {
  color: #171e29;
}

.button-59:hover {
  border-color: #06f;
  color: #06f;
  fill: #06f;
}

.button-59:active {
  border-color: #06f;
  color: #06f;
  fill: #06f;
}

@media (min-width: 768px) {
  .button-59 {
    min-width: 170px;
  }
}
</style>
