<template>
  <div>
        <div class="flex" style="flex-wrap: wrap;">
            <vs-button color="primary" @click="tipo = 0" class="m-2" type="filled">Usuarios</vs-button>
            <vs-button color="success" @click="tipo = 1" class="m-2 py-1" v-if="!userFacturadores" type="filled">Director</vs-button>
            <vs-button color="danger"  @click="tipo = 2" class="m-2 py-1" v-if="usuarioAcceso.id_group == 1" type="filled">Asesores</vs-button>
            <vs-button color="warning" @click="tipo = 3" class="m-2 py-1" v-if="permisoRoot" type="filled">Perfiles</vs-button>
            <vs-button color="dark"    @click="tipo = 4" class="m-2 py-1" v-if="permisoRoot" type="filled">Perfiles Usuarios</vs-button>
            <!-- <vs-button color="#34C4E7" @click="tipo = 5" class="m-2 py-1" v-if="permisoRoot || usuarioAcceso.id_group == 11" type="filled">Asignacion de estudiantes</vs-button> -->
            <vs-button color="#34C4E7" @click="tipo = 6" class="m-2 py-1" v-if="permisoRoot" type="filled">Mantenimiento root</vs-button>
            <!-- <vs-button color="#56546D" @click="tipo = 7" class="m-2 py-1" v-if="permisoRoot || userFacturadores" type="filled">Distribuidores</vs-button> -->
            <vs-button color="#9C3BE3" @click="tipo = 8" class="m-2 py-1" v-if="permisoRoot || userAsesor" type="filled">Imports</vs-button>
        </div>
        <!--usuarios-->
        <div v-if="tipo == 0">
            <usuarios v-if="submenu.plista == true" v-on:estado="menu"></usuarios>
            <info-docente v-if="submenu.peditar == true" :usuario="usuario" v-on:estado="menu"></info-docente>
        </div>
        <!--director-->
        <div v-if="tipo == 1">
            <director></director>
        </div>
        <!--asesores-->
        <div v-if="tipo == 2">
            <listaUsuariosVue :periodo_idSierra="periodo_idSierra" :periodo_idCosta="periodo_idCosta" />
        </div>
        <!--perfiles-->
        <div v-if="tipo == 3">
            <perfiles></perfiles>
        </div>
        <!--usuarios root-->
        <div v-if="tipo == 4">
            <UsuariosRootVue />
        </div>
        <!--asignacion de estudiantes-->
        <div v-if="tipo == 5">
            <MenuEstudiante />
        </div>
        <!--MANTENIMIENTO ROOT-->
        <div v-if="tipo == 6">
          <configuracionVue v-if="permisoRoot" :permisoRoot="permisoRoot"/>
        </div>
         <!--DISTRIBUIDORES-->
         <vx-card v-if="tipo == 7" class="mt-5">
          <ScreenDistribuidorVue />
         </vx-card>
         <!--imports-->
         <div v-if="tipo == 8">
            <EstudianteScreenImportacionVue/>
         </div>
  </div>
  </template>

  <script>
  import {
        mapState
  } from "vuex";
  import perfiles from './perfiles.vue'
  import usuarios from './tipos/Usuarios.vue'
  import gestionVisitasVue from '../asesor/admin/gestionVisitas.vue'
  import director from './tipos/director.vue'
  import MenuEstudiante from './GestionEstudiantes/MenuEstudiante.vue'
  import listaUsuariosVue from './tipos/listaUsuarios.vue'
  import UsuariosRootVue from './tipos/usuariosPerfil.vue'
  import configuracionVue from '@/views/admin/configuracion/configuracion'
  import ScreenDistribuidorVue from '@/views/pedidos/components/distribuidores/ScreenDistribuidor'
  const EstudianteScreenImportacionVue = () => import('./estudiantes/ImportacionCodigos/EstudianteScreenImportacion.vue')
  export default {
      components: {
          usuarios,
          director,
          perfiles,
          gestionVisitasVue,
          MenuEstudiante,
          listaUsuariosVue,
          UsuariosRootVue,
          configuracionVue,
          ScreenDistribuidorVue,
          EstudianteScreenImportacionVue,
      },
      data() {
        return {
            tipo:0,
            submenu: {
                plista: true,
                pnuevo: false,
                peditar: false
            },
            usuario: {},
            usuarioAcceso: [],
            periodo_idSierra: 0,
            periodo_idCosta: 0,
            permisoRoot: false,
            userFacturadores:false,
        }
      },
      computed: {
            ...mapState(['userRoot', 'userAsesor']),
      },
      methods: {
          menu(item) {
              this.submenu = item
              this.usuario = item.usuario
          },
          //para obtener el listado de los usuarios root
          getUserRoot() {
              let me = this;
              this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuarioAcceso.idusuario)
                  .then(function (res) {
                      if (res.data.status == '1') {
                          me.permisoRoot = true
                      } else {
                          me.permisoRoot = false
                      }
                  })
                  .catch(function (error) {
                      console.log(error + ' error');
                  })
          },
          getPeriodoSierra() {
              let me = this;
              this.$http.get(this.$server_url + 'getPeriodoInvidivual?region=1')
                  .then(function (res) {
                      me.periodo_idSierra = res.data
                  })
                  .catch(function (error) {
                      console.log(error + ' error');
                  })
          },
          getPeriodoCosta() {
              let me = this;
              this.$http.get(this.$server_url + 'getPeriodoInvidivual?region=2')
                  .then(function (res) {
                      me.periodo_idCosta = res.data
                  })
                  .catch(function (error) {
                      console.log(error + ' error');
                  })
          },
      },
      created() {
          let me = this;
          me.usuarioAcceso = JSON.parse(localStorage.getItem('usuario'))
          me.getPeriodoSierra()
          me.getPeriodoCosta()
          me.getUserRoot();
      },
      mounted(){
        let me = this;
        if(me.usuarioAcceso.id_group == 22 || me.usuarioAcceso.id_group == 23){
            me.userFacturadores = true
        }
      },
  }
  </script>
