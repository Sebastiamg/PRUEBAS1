<template>
  <vx-card :title="title" title-color="primary" subtitle="Gestión de Combos">
      <div class="flex" style="flex-wrap: wrap;">
          <vs-button class="m-2 btna" :color="menu === 0 ? '#00B2A9' : '#00897B'" @click="title='Buscar Combos'; menu = 0">
              <ion-icon name="search-outline"></ion-icon> Buscar
          </vs-button>
          <vs-button class="m-2 btna" :color="menu === 1 ? '#00B2A9' : '#00897B'" @click="title='Importar Combos'; menu = 1">
              <ion-icon name="code-slash-outline"></ion-icon> Importar
          </vs-button>
            <vs-button class="m-2 btna" :color="menu === 2 ? '#00B2A9' : '#00897B'" @click="title='Combos Plus'; menu = 2">
              <ion-icon name="code-slash-outline"></ion-icon> Combos Plus
          </vs-button>
          <vs-button class="m-2 btna" :color="menu === 3 ? '#00B2A9' : '#00897B'" @click="title='Generar Combos'; menu = 3">
              <ion-icon name="code-slash-outline"></ion-icon> Generar
          </vs-button>
          <vs-button class="m-2 btna" :color="menu === 4 ? '#00B2A9' : '#00897B'" @click="title='Importar Eliminar Combos'; menu = 4" v-if="userRoot || AdminBodega">
              <ion-icon name="code-download-outline"></ion-icon> Eliminar
          </vs-button>
          <vs-button class="m-2 btna" :color="menu === 5 ? '#00B2A9' : '#00897B'" @click="title='Importar Limpiar Combos'; menu = 5">
              <ion-icon name="eyedrop-outline"></ion-icon> Limpiar
          </vs-button>
          <vs-button class="m-2 btna" :color="menu === 6 ? '#00B2A9' : '#00897B'" @click="title='Importar Bloquear Combos'; menu = 6">
              <ion-icon name="construct-outline"></ion-icon> Bloquear
          </vs-button>
      </div>
      <vs-divider></vs-divider>
      <!--MENU-->
      <div>
         <div v-if="menu == 0">
              <MenuBusquedaCombosVue />
          </div>
          <div v-if="menu == 1">
              <ComboImportAsignacionFiltroVue :tipoImport="Number(0)"/>
          </div>
          <div v-if="menu == 2">
            <CombosPlusGeneradosImportAsignacionVue/>
          </div>
            <div v-if="menu == 3">
              <GenerarCodigosCombosVue />
          </div>
          <div v-if="menu == 4">
            <CombosEliminarVue />
          </div>
          <div v-if="menu == 5">
              <LimpiarCombosVue />
          </div>
           <div v-if="menu == 6">
              <CombosImportBloquearVue />
          </div>
      </div>
  </vx-card>
  </template>

  <script>
  import {
      mapState,
      mapActions
  } from 'vuex'
  import GenerarCodigosCombosVue from '@/views/codigos/combos/components/GenerarCodigosCombos'
  import MenuBusquedaCombosVue from './components/MenuBusquedaCombos.vue'
  const CombosEliminarVue                       = () => import('./components/EliminarCombos/CombosEliminar.vue')
  const LimpiarCombosVue                        = () => import('./components/LimpiarCombos/LimpiarCombos.vue')
  const CombosImportBloquearVue                 = () => import('./components/BloquearCombos/CombosImportBloquear.vue')
  const ComboImportAsignacionFiltroVue          = () => import('./components/asignacion/ComboImportAsignacionFiltro.vue');
  const CombosPlusGeneradosImportAsignacionVue  = () => import('./components/asignacion/CombosPlusGeneradosImportAsignacion.vue')
  export default {
      data() {
          return {
              menu: 2,
              title: 'Buscar Combos'
          }
      },
      components: {
          GenerarCodigosCombosVue,
          CombosEliminarVue,
          MenuBusquedaCombosVue,
          LimpiarCombosVue,
          CombosImportBloquearVue,
          ComboImportAsignacionFiltroVue,
          CombosPlusGeneradosImportAsignacionVue
      },
      computed: {
          ...mapState(['userRoot', 'AdminBodega']),
      },
  }
  </script>

  <style lang="scss" scoped>
  @import '@/assets/scss/general/general.scss';

  .btna {
      font-size: 14px !important;
      transition: all 0.3s ease;
      color: #fff;
      border: 2px solid transparent;
      border-radius: 8px;
      padding: 10px 20px;
  }

  /* Botón activo */
  .btna.active {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      /* Sombra */
      transform: scale(1.1);
      /* Efecto de zoom */
      transition: all 0.3s ease;
  }

  /* Botón con hover */
  .btna:hover {
      opacity: 0.8;
  }
  </style>
