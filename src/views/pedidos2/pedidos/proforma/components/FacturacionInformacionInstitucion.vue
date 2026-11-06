<template>
  <vx-card title="Actualizar informacion de la institución o del punto de venta">
      <div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Institución</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" disabled icon="icon-user" icon-no-border v-model="institucion.nombreInstitucion" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>RUC</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-credit-card" icon-no-border v-model="institucion.ruc" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Email</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="institucion.email" />
          </div>
        </div>
        <!--telefono-->
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Telefono</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-phone" icon-no-border v-model="institucion.telefonoInstitucion" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Direccion</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="institucion.direccionInstitucion" />
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full">
            <vs-button class="mr-3 mb-2" @click="saveInformacion();">Guardar</vs-button>
          </div>
        </div>
        <!-- <div class="vx-row mt-3">
          <div class="vx-col w-full">
            <representePerseoVue :id="institucion_id"/>
          </div>
        </div> -->
      </div>
  </vx-card>
</template>
<script>
export default {
  components:{
  },
  data() {
    return{
      institucion:{}
    }
  },
  props:{
    institucion_id:{
      type:Number,
      default:0
    },
  },
  mounted(){
    let me  = this
    me.setInformacion()
  },
  methods:{
    setInformacion(){
      let me = this
      //api get
      this.$http.get(this.$server_url+`datosFactura/datosFactura?getlibreria=1&idInstitucion=${me.institucion_id}`)
      .then(function (res) {
        let datos = res.data;
        if(datos.length > 0){
          me.institucion                 = datos[0];
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    saveInformacion(){
      let me = this
      //api post
      let formData = new FormData();
      formData.append('direccionInstitucion', me.institucion.direccionInstitucion);
      formData.append('telefonoInstitucion',  me.institucion.telefonoInstitucion);
      formData.append('email',                me.institucion.email);
      formData.append('ruc',                  me.institucion.ruc);
      formData.append('id',                   me.institucion_id);
      formData.append('actualizarInstitucion','1')
      this.$http.post(this.$server_url+`datosFactura/datosFactura`, formData)
      .then(function (res) {
        if(res.data.status == 0){
          me.$vs.notify({
            title: 'Error',
            text: 'Error al guardar la informacion',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
          return
        }
        else{
          me.$vs.notify({
            title: 'Exito',
            text: 'Informacion guardada',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        }
        me.$emit('changeSaveInformacion',true)
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
  }
}
</script>
