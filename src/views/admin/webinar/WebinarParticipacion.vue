<template lang="html">
  <div>
    <vs-card>
           <div class="vx-col w-full" >
            <vx-card slot="no-body" class="banner">
                <div style="display: flex;justify-content:center;">   
                    <div>
                        <p style="color:white;font-size:40px;text-align:center;letter-spacing: 3px;">CAPACITACIONES PROLIPA</p>
                    
                    </div>
                </div>
            </vx-card>
            <br/>
            <div v-if="cedulaExiste ==1" style="display:flex;justify-content:end;">
                    <vs-button type="relief" @click="cerrarSession()" icon="cancel" class="mr-5">Cerrar Sessión</vs-button>
            </div>
        </div>
    </vs-card>
    <vs-card v-if="cedulaExiste == 1">
       <GestionWebinar/>
    </vs-card>
      <vs-card v-if="cedulaExiste == 0">
            <div style="display: flex;padding: 10px 10px 20px 10px; justify-content: center;">
              <div>
                    <vs-button color="primary" @click="inicio= 'ingreso'" icon="person" type="border">Ingreso</vs-button>
              </div>
              <div>
                    <vs-button color="success" style="margin-left: 10px;" icon="perm_contact_calendar"  @click="inicio= 'registro'" type="border">Registro</vs-button>
              </div>
            </div>
            <div label="Ingreso"  icon="face" v-if="inicio=='ingreso'">
                <vs-card>
                    <vs-alert title="Mensaje" color="success" active="true">
                        ! Ingrese su cédula para ingresar al módulo webinar
                    </vs-alert>
                    <vs-row style="margin-top: 20px;">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <vs-input icon-no-border icon="account_circle" label-placeholder="Ingrese su cédula" v-model="cedula"/>
                        </vs-col>
                    </vs-row>
                    <vs-row style="margin-top: 40px;padding:30px;">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-button type="relief" @click="IngresoWebinar()">Ingresar</vs-button>
                        </vs-col>
                    </vs-row>         
                </vs-card>
            </div>
            <div v-if="inicio=='registro'" style="background-color: #F7F3F2;border-radius: 10px;">
                  <WebinarRegistroVue/>
            </div>
      </vs-card>
  </div>
</template>
<script>
import WebinarRegistroVue  from "./components/WebinarRegistro.vue"
import GestionWebinar from "./components/GestionWebinar.vue";
export default {
  data:()=>({
    inicio:'ingreso',
    colorx: '#20B0CD',
    cedula:'',
    cedulaExiste:0,
    user:[],
  }),
  components:{
      WebinarRegistroVue,
      GestionWebinar,
  },
  created(){
      let me = this;
      me.user  = JSON.parse(localStorage.getItem("userWebinar"))
      if(me.user[0].cedula.length > 5){
          me.cedulaExiste = 1
      }
  },
  methods:{
      cerrarSession(){
          let me = this;
          me.cedulaExiste = 0;
          location.reload();
          localStorage.clear();
      },
      IngresoWebinar(){
        let me = this;
        if(me.cedula.length < 2){
            me.$vs.notify({
                color: 'primary',
                title: 'Mensaje',
                text: 'El valor de la  cédula es incorrecto'
                })
            return false;
        }

            if(me.cedula.length > 15){
            me.$vs.notify({
                color: 'primary',
                title: 'Mensaje',
                text: 'El valor de la  cédula es incorrecto'
                })
            return false;
        }
        me.verificarExistenciaCedula()
      },
      verificarExistenciaCedula(){
        let me = this;
        this.$http.get(this.$server_url+'verificarCedula?cedula=' + me.cedula)
            .then(function (response) {
                me.cedulaExiste = response.data.status;
                if(me.cedulaExiste == 1){
                    localStorage.setItem('userWebinar', JSON.stringify(response.data.usuario));
                        me.$vs.notify({
                        text:'Bienvenido a Webinars',
                        color:'primary',
                        time:4000,
                        iconPack: 'feather',
                        icon:'icon-check'})
                }
                    if(me.cedulaExiste == 0){
                        me.$vs.notify({
                        text:'Usuario no encontrado, proceda con el registro',
                        color:'primary',
                        time:4000,
                        iconPack: 'feather',
                        icon:'icon-check'})
                        me.inicio="registro"
                    }
            })
            .catch(function (error) {})
    },
  }
}
</script>
<style lang="scss">
.banner{
    background: #00B4DB;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #0083B0, #00B4DB);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #0083B0, #00B4DB); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
box-shadow: 5px 6px 5px #0083B0;
}
</style>
