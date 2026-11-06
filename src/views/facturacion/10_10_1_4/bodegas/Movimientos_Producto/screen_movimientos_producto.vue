<template>
  <div>
      <vx-card>
          <vs-tabs>
              <vs-tab label="Movimiento no operativo" v-if="AdminBodega || userRoot">
                  <movimientosProducto />
              </vs-tab>
          </vs-tabs>
      </vx-card>
  </div>
  </template>
  
  <script>
  import {
      mapState
  } from "vuex";

  const movimientosProducto = () => import("./movimiento_NO_producto.vue");
  
  export default {
      data() {
          return {};
      },
      mounted() {},
      methods: {},
      //PARA DAR PERMISOS MODIFICAMOS EL Main.vue, state.js, actions.js, mutations-js
      computed: {
          ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
      },
      components: {
          movimientosProducto
      },
  };
  </script>
  