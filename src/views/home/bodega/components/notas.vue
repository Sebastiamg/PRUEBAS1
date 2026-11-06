<template>
   <div>
    <Despacho />
   </div>
  </template>
  <script>
  import Vue from "vue";
  import axios from "axios";
  import vSelect from "vue-select";
import Despacho from "./Empacar/ScreenEmpacar.vue";
  export default {
    data() {
      return {
      
      };
    },
    components: {
      "v-select": vSelect,
      Despacho,
    },
    mounted() {
      this.verificarseleccion();
    },
    methods:{

    }
  };
  </script>