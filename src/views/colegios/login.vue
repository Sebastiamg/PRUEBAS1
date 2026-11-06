<template>
  <div
    class="
      w-full
      sm:w-full
      h-screen
      md:w-full
      lg:w-1/3
      d-theme-dark-bg
      rounded-3xl
      sm:rounded-none
      shadow-2xl
    "
  >
    <div class="h-screen flex item-center">
      <div class="px-8 py-24 mx-auto grid grid-cols-1 content-around">
        <div class="text-center flex justify-center">
          <img
            src="@/assets/images/prolipa.png"
            alt="login"
            class="md:w-2/5 lg:w-3/4 sm:w-2/5 w-3/4 text-center"
          />
        </div>
        <div>
          <div class="vx-card__title">
            <h1 class="title font-bold text-5xl text-center">Bienvenidos</h1>
            <h3 class="title font-bold text-1xl text-success text-center mt-1">Recursos externos</h3>
          </div>
          <FormulateForm
            name="loginform"
            class="mt-6"
            @submit="ingresarSistema"
            :values="user"
          >
            <div class="container-input">
              <FormulateInput
                type="text"
                v-on:keyup.enter="ingresarSistema()"
                v-model="user.email"
                name="name"
                autocomplete="no"
                label="Ingrese su email"
                validation="required|email"
                error-behavior="blur"
                :validation-messages="{
                  required: `Ingrese un email`,
                  email: `${user.email} no es una dirección de correo electrónico válida`,
                }"
              />
            <span style="color:red;">{{errores}}</span>
            </div>
          </FormulateForm>
        </div>
        <div>
          <div class="flex flex-wrap justify-between">
            <vs-button
              class="w-full rounded-2xl mx-auto font-bold uppercase"
              size="large"
              type="relief"
              color="primary"
              @click="ingresarSistema()"
              >Iniciar sesión</vs-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueFormulate from "@braid/vue-formulate";
Vue.use(VueFormulate);
export default {
  data() {
    return {
      user: {
        email: "",
        errores:"",
      },
    };
  },
  mounted() {
    // Listen for successful login in other tabs
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeDestroy() {
    // Clean up listener
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    // Listen for storage changes (login in another tab)
    handleStorageChange(event) {
      // If another tab sets 'usuario' (successful login), redirect this tab too
      if (event.key === 'usuario' && event.newValue) {
        try {
          const newUser = JSON.parse(event.newValue);
          if (newUser && newUser.idusuario) {
            // Another tab logged in successfully, redirect
            window.location.href = '/colegios/libros';
          }
        } catch (e) {
          console.warn('Error parsing usuario from storage:', e);
        }
      }
    },
  
    async ingresarSistema() {
      let me = this;
      if (me.user.email == "") {
        me.$vs.notify({
          text: "Por favor llene los campos",
          color: "primary",
          iconPack: "feather",
          icon: "icon-check",
        });
        return;
      }
        this.$http.get(this.$server_url+'colegio-ingreso?email='+me.user.email)
        .then(function (response) {
            localStorage.token = response.data.token;
            localStorage.setItem('usuario', JSON.stringify(response.data));
            // Clear session_locked flag on successful login
            try { localStorage.removeItem('session_locked'); } catch(_) {}
            me.popupIngreso=false;
            me.$router.push('/colegios/libros');
        })
        .catch(function (error) {
        if (error.response.status == 401) {
            me.$vs.notify({
            text: error.response.data.message,
            color: "warning",
            iconPack: "feather",
            icon: "icon-check",
          });        
        }
        });
    },
  },
};
</script>

<style lang="css">
input {
  width: 100%;
  height: 40px;
  border: 2px solid #243890;
  border-radius: 15px;
  padding: 8px;
  background: white;
}

.formulate-input-error {
  padding: 8px;
  color: red !important;
}

.formulate-input-label {
  color: #243890;
  padding: 8px !important;
}
</style>
