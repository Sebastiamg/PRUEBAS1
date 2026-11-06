<template>
  <vx-card
  title="Listado de Necesidades Educativas"
  :subtitle="'Asignatura: '+setnombreasignatura+' | Codigo: '+codigoCurso"
  >
    <!--MENU-->
    <nav class="breadcrumbs mt-3">
      <a class="breadcrumbs__item btnMenu menu0 activeBtn" @click="filtro = 0;estadoMenu();getRecurso();">Pendientes</a>
      <a class="breadcrumbs__item btnMenu menu1"          @click="filtro = 1;estadoMenu();getRecurso();">Finalizadas</a>
      <a class="breadcrumbs__item btnMenu menu2"                @click="filtro = 2;estadoMenu();getRecurso();">Todas</a>
    </nav>
    <div>
      <ListadoNeetEstudianteVue :filtro="filtro" :codigoCurso="codigoCurso" :arregloTareas="arregloTareas"/>
    </div>
  </vx-card>
</template>
<script>
import ListadoNeetEstudianteVue from './ListadoNeetEstudiante.vue';
export default{
  data(){
      return{
        filtro:0,
        usuario:[],
        arregloTareas:[],
        codigoCurso:'',
        setnombreasignatura:'',
      }
  },
  components:{
    ListadoNeetEstudianteVue,
  },
  created() {
    let me                  = this
    me.usuario              = JSON.parse(localStorage.getItem("usuario"))
    me.codigoCurso          = localStorage.codigo_curso
    me.setnombreasignatura  = localStorage.nombreasignatura
  },
  mounted() {
    let me = this;
    me.getRecurso()
  },
  methods: {
    estadoMenu(){
      let me = this;
      localStorage.setItem('menuSelect',me.filtro)
      var divs = document.querySelectorAll(".btnMenu");
      for (var i = 0; i < divs.length; i++) {
          divs[i].classList.remove("activeBtn");
      }
      const container = document.querySelector(".menu"+me.filtro);
      container.classList.add("activeBtn");
    },
    getRecurso() {
      let me = this;
      me.$vs.loading()
      var url = ""
      url = this.$server_url + 'neetTema?tareaNeetEstudiante=yes&codigoCurso='+me.codigoCurso+'&idusuario='+me.usuario.idusuario
      this.$http.get(url)
        .then(res => {
          me.$vs.loading.close()
          let datos = res.data
          if(me.filtro == 0 || me.filtro == 1){
            me.arregloTareas = datos.filter(p => p.estadoTarea == me.filtro)
            return
          }else{
            me.arregloTareas = datos
          }
        })
        .catch(error => {
            console.log(error)
            me.$vs.loading.close()
        })
    },
  },
}
</script>
<style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #edf1f5;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
