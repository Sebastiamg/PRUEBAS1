<template>
  <div id="knowledge-base-category-page">
    <vx-card
    title="Listado de Necesidades Educativas"
    :subtitle="'Asignatura: '+setnombreasignatura+' | Codigo |: '+codigoCurso"
    >
      <!--NECESIDADES EDUCATIVAS-->
      <!--SUBMENU-->
      <nav class="breadcrumbs mt-3">
          <a href="#recursos" class="breadcrumbs__item btnMenu menu0 activeBtn"   @click="filtro = 0;estadoMenu();getNecesidadesEducativas();submenu = 0;">Listado Necesidades Educativas </a>
          <a href="#TareasEnviadas" class="breadcrumbs__item btnMenu menu1"       @click="filtro = 1;estadoMenu();getRecurso();submenu = 1;">Tareas o recursos enviados</a>
      </nav>
      <!--SUBMENU COMPONENTS-->
      <div>
          <!--CARDS DE RECURSOS-->
          <div v-if="submenu == 0">
            <NeetDocenteVue
             v-if="arregloAsignados.length > 0"
              :arregloAsignados="arregloAsignados"
              :arregloTemas="arregloTemas"
              :desdeLibro="1"
              :setidasignatura="setidasignatura"
              :setnombreasignatura="setnombreasignatura"
              :desdeCurso="1"
              :codigoCurso="codigoCurso"
            />
          </div>
          <!--TAREAS ENVIADAS-->
          <div v-if="submenu == 1">
            <ListadoNeetEstudianteVue
              :codigoCurso="codigoCurso"
              :arregloTareas="arregloTareas"
              @changeRecharge="changeRecharge"
             />
          </div>
      </div>
    </vx-card>
  </div>
  </template>

  <script>
  import Vue from 'vue'
  import axios from 'axios'
  import vSelect from 'vue-select'
  Vue.use(axios)
  import NeetDocenteVue from '@/views/home/neet/NeetDocente'
  import ListadoNeetEstudianteVue from '../../estudiantes/neet/ListadoNeetEstudiante.vue'
  import NeetRepository from '@/repositories/NeetRepository'
  export default {
    components: {
      'v-select': vSelect,
      NeetDocenteVue,
      ListadoNeetEstudianteVue,
    },
    data() {
      return {
        id: 0,
        usuario: [],
        codigoCurso:'',
        submenu:0,
        filtro:0,
        arregloTareas:[],
        arregloAsignados:[],
        arregloTemas:[],
        setidasignatura:'',
        setnombreasignatura:'',
      }
    },
    created() {
      let me = this;
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      me.codigoCurso          = localStorage.codigo
    },
    mounted(){
      let me = this;
      me.getNecesidadesEducativas()
      me.setidasignatura      = localStorage.idasignatura
      me.setnombreasignatura  = localStorage.nombreasignatura
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
      changeRecharge(){
        let me = this;
        me.getRecurso()
      },
      getRecurso() {
        let me = this;
        me.$vs.loading()
        var url = ""
        url = this.$server_url + 'neetTema?tareaNeetEstudiante=yes&codigoCurso='+me.codigoCurso+'&id_group='+me.usuario.id_group
        this.$http.get(url)
          .then(res => {
            me.$vs.loading.close()
            let datos = res.data
            me.arregloTareas = datos
          })
          .catch(error => {
            console.log(error)
            me.$vs.loading.close()
          })
      },
      getNecesidadesEducativas(){
        let me = this
        const { idusuario,institucion_idInstitucion } = me.usuario
        NeetRepository.getNecesidadesEducativasxUsuario(idusuario,institucion_idInstitucion).then( r => { me.arregloAsignados = r.data })
      },
    },
  }
  </script>

  <style scoped>
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white;
  }
  /**ESTILOS CURSOS CARD */
  * {
      margin: 0;
      padding: 0;
      font-family: 'Inter', 'sans-serif';
      box-sizing: border-box;
      text-decoration: none;
      color:black;
  }

  .containerCurso {
      display: flex !important;
      flex-direction: row !important;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100% !important;
  }

  .profile-card {
      width: 400px;
      text-align: center;
      border-radius: 8px;
      overflow: hidden;
      margin: 10px;
      border-radius: 10px;
  }

  .card-header {
      background: #2c3a47;
      padding: 60px 40px;
  }

  .pic {
      display: inline-block;
      padding: 8px;
      background: linear-gradient(130deg, #74b9ff, #e66767);
      margin: auto;
      border-radius: 50%;
      background-size: 150% 150%;
      animation: animated-gradient 2s linear infinite;
  }

  @keyframes animated-gradient {
      25% {
          background-position: left bottom;
      }

      50% {
          background-position: right bottom;
      }

      75% {
          background-position: right top;
      }

      100% {
          background-position: left top;
      }
  }

  .pic img {
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 50%;
  }

  .name {
      color: #f2f2f2;
      font-size: 28px;
      font-weight: 600;
      margin: 10px 0;
  }

  .desc {
      font-size: 18px;
      color: #e66767;
  }

  .sm {
      display: flex;
      justify-content: center;
      margin: 20px 0;
  }

  .sm a {
      color: #f2f2f2;
      width: 56px;
      font-size: 22px;
      transition: .3s linear;
  }

  .sm a:hover {
      color: #e66767;
  }

  .contact-btn {
      display: inline-block;
      padding: 12px 50px;
      color: #E5834B !important;
      border: 2px solid #e66767;
      border-radius: 6px;
      margin-top: 16px;
      transition: .3s linear;
  }

  .contact-btn:hover {
      background: #e66767;
      color: #f2f2f2 !important;
  }

  .card-footer {
      background: #f4f4f4;
      padding: 20px 10px;
  }

  .numbers {
      display: flex;
      align-items: center;
  }

  .item {
      flex: 1;
      text-transform: uppercase;
      font-size: 11px;
      color: #e66767;
  }

  .item span {
      display: block;
      color: #2c3a47;
      font-size: 13px;
      font-weight: 600;
  }

  .border {
      width: 1px;
      height: 30px;
      background: #bbb;
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
