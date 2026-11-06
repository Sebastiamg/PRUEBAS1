<template>
  <div>
      <vx-card>
          <vs-tabs v-model="activeTab">
              <vs-tab label="Configuracion" v-if="userRoot" @click="MenuSelectedLocalStorage()">
                  <ScreenConfiguracionVue />
              </vs-tab>
          </vs-tabs>
      </vx-card>
  </div>
  </template>
  
  <script>
  import {
      mapState
  } from "vuex";
  const ScreenConfiguracionVue = () => import('./configuracion/ScreenConfiguracion.vue')
  export default {
      components: {
          ScreenConfiguracionVue,
      },
      data() {
          const submenusicom = JSON.parse(localStorage.getItem('sicom'));
          return {
              activeTab: submenusicom ? submenusicom.submenu : 0, // Utiliza el valor de submenu si existe
              menulocalstorage: JSON.parse(localStorage.getItem('sicom')),
          }
      },
      computed: {
          ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
      },
      methods: {
          MenuSelectedLocalStorage() {
              this.menulocalstorage.submenu = this.activeTab;
              localStorage.setItem('sicom', JSON.stringify(this.menulocalstorage));
          },
      },
  }
  </script>
  