<template>
  <div>
    <div>
      <!--materia-->
      <div class="mt-6" v-for="(tr,key) in arrayMaterias" :key="key">
        <div class="bg1" v-if="tr.evaluaciones.length > 0">
          <p @click="changeMenu(tr,key)" class="cursor-pointer">
            <span v-if="!tr.accion" ><i class="fa-solid fa-chevron-down "></i></span>
            <span v-if="tr.accion"  @click="changeMenu(tr,key)"><i class="fa-solid fa-chevron-right "></i></span>
            <span class="ml-2"> Evaluaciones: {{ tr.nombrelibro }}</span>
          </p>
        </div>
        <div class="hideTipo evaluacion" :id="'smenu'+key" style="width: 100%;">
          <div class="" v-if="tr.accion" style="width: 100%!important;">
            <div class="vx-col w-full" v-for="(item,key2) in tr.evaluaciones" :key="key2">
              <div class="bg2">
                <p><span><i class="fa-solid fa-rocket"></i></span> Disponible hasta: {{ item.fecha_fin}} | Docente: {{ item.docente }} | <span>Curso:{{ item.codigo_curso}} </span></p>
                <div class="" style="border-left: 2px solid #D1D7E4;padding:5px;">
                  <p class="enlace" @click="verEvaluaciones(item)">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <span class="ml-2">Ver Evaluación</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data() {
    return{
      btnTipo:false,
      usuario:[],
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    let me  = this
  },
  props:{
    arrayMaterias:{
      type: Array,
      default: () => []
    }
  },
  methods:{
    changeMenu(boleano,id){
      let me = this
      me.arrayMaterias.forEach(element => {
        if(element.idasignatura == boleano.idasignatura){
          element.accion = !element.accion
        }
      });
      const tipo = document.querySelector("#smenu"+id);
      if(boleano){
        tipo.classList.remove("hideTipo");
        tipo.classList.toggle("showTipo");
      }else{
        tipo.classList.remove("showTipo");
        tipo.classList.toggle("hideTipo");
      }
    },
    verEvaluaciones(section) {
      let me = this
      localStorage.setItem('idasignatura',    section.id_asignatura)
      localStorage.setItem('codigo_curso',    section.codigo_curso)
      localStorage.setItem('nombreasignatura',section.nombreasignatura)
      localStorage.codigo                     = section.codigo_curso;
      localStorage.idcurso                    = section.idcurso;
      this.$router.push(`/estudiante/evaluaciones`);
    },
  },
}
</script>
<style scoped>
.bg1{
  background:#f6f6f6;
  padding: 20px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: 600;
  font-size: 15px;
  color:#2d3e5f;
  border: 2px solid #e9e6e6;
}
.bg2{
  width: 100%;
  padding: 20px;
  font-family: monospace;
  font-weight: 200;
  font-size: 15px;
  color:#22252b;
  border: 1px solid #f2f2f2;
  cursor: pointer;
  color:rgb(115, 118, 121);
  display: flex;
  justify-content: space-between;
}
.enlace{
  transition: 1s ease all;
  font-size: 12px;
}
.enlace:hover{
  color: #457a92;
  text-decoration: underline;
  transform: translateY(-1px);
}

/*ESTILOS MENU*/
/*SHOW / SHOW*/
.showTipo{
    display: flex;
    flex-wrap: wrap;
    transition: 1s ease all;
    opacity: 1;
    transform: translateY(0%);
}
.hideTipo{
    opacity: 0;
    position: relative;
    transition: 1s ease all;
    transform: translateY(-30%);
}
/*fin hide/show*/
.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
    padding: 10px;
    border: 1px solid #f2f2f2;
    max-height: 90%;
    margin-top: -1px!important;
}
@keyframes fadeInOpacity {
    0% {
        transform: translateX(30%);
        opacity: 0;
    }
    50% {
        transform: translateX(10%);
        opacity: 0.5;
    }
    100% {
        opacity: 1;
        transform: translateX(0%);
    }
}
/*media query*/
@media (max-width: 412px) {


}
</style>
