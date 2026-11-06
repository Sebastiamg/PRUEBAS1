<!-- =========================================================================================
  File Name: App.vue
  Description: Main vue file - APP
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="app" :class="vueAppClasses">
    <bloqueo-session :isSidebarActive="addNewDataSidebarr" />
    <router-view @setAppClasses="setAppClasses" />
    <ChatWidget /> <!-- 👈 Aquí lo agregas -->
    <EmpresaAmbienteIndicator /> <!-- Indicador de ambiente de empresa -->
  </div>
</template>

<script>
import themeConfig from "@/../themeConfig.js";
import BloqueoSession from "./layouts/main/session.vue";
import ChatWidget from "./components/ChatWidget.vue"; // Asegúrate de importar el componente
import EmpresaAmbienteIndicator from "./components/EmpresaAmbienteIndicator.vue"; // Indicador de ambiente
export default {
  components: {
    BloqueoSession,
    ChatWidget,
    EmpresaAmbienteIndicator,
  },
  data() {
    return {
      vueAppClasses: [],
      usuario: [],
      addNewDataSidebarr: false,
    };
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    },
    "$vs.rtl"(val) {
      document.documentElement.setAttribute("dir", val ? "rtl" : "ltr");
    },
  },
  methods: {
    toggleClassInBody(className) {
      if (className === "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className === "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    },
    handleWindowResize() {
      this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

      // Set --vh property
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    },
    handleScroll() {
      this.$store.commit("UPDATE_WINDOW_SCROLL_Y", window.scrollY);
    },
  },
  mounted() {
    let theme = ''
    if(localStorage.theme){
      theme = localStorage.theme
    }else{
      theme = themeConfig.theme
    }
    this.toggleClassInBody(theme);
    this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          console.log("Color "+event.matches)
        } else {
          console.log("Color "+event.matches)
          //light mode
        }
      });
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    
    // Cargar empresa de la plataforma si no está en el store
    if (!this.$store.state.empresaPlataforma) {
      this.$store.dispatch('getEmpresaPlataforma');
    }
    
    // try {
    //     let me = this;
    //     var usr = JSON.parse(localStorage.getItem('usuario'));
    //     this.socket.on(usr.email, (data) => {
    //         try {
    //             if (data.idusuario == usr.idusuario) {
    //                 this.$http.get(this.$server_url+'usr/' + data.idusuario)
    //                     .then(function (response) {
    //                         if (localStorage.tk == response.data.remember_token) {
    //                         } else {
    //                             me.addNewDataSidebarr = true
    //                             localStorage.removeItem('tk');
    //                             localStorage.removeItem('usuario');
    //                         }
    //                     })
    //                     .catch(function (error) {})
    //                 console.log(data);
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     });
    // } catch (error) {

    // }
  },
  async created() {
    const dir = this.$vs.rtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

</style>
