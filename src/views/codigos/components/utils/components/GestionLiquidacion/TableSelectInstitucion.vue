<template>
  <div>
    <!--si ifBusquedaExterna es 1 sera contenedor2 si no sera contenedor-->
    <div :class="{'contenedor2 mt-4': ifBusquedaExterna == 1, 'contenedor mt-4': ifBusquedaExterna != 1}">
      <div class="flex">
          <vs-input
          :success="true"
          success-text="BUSQUEDA DE INSTITUCIÓN"
          placeholder=""
          class="w-full"
          @keyup.enter="getInstitucion()"
          v-model="busqueda"/>
          <vs-button @click="getInstitucion();" transparent icon="search" radius  class="ml-1" color="success"></vs-button>
      </div>
      <div class="" v-if="ifBusquedaExterna == 0">
        <div v-if="objectSelectInstitucion.idInstitucion">
          <vs-alert color="success" @click="cleanInstitucion();" class="w-full cursor-pointer" icon-pack="feather" icon="icon-x"><p class="text-center">Seleccionado: <b>{{  objectSelectInstitucion.nombreInstitucion }}</b></p></vs-alert>
        </div>
        <div v-else>
          <vs-alert color="danger" class="w-full"><p class="text-center">!Institucion no asignada</p></vs-alert>
        </div>
      </div>
    </div>
    <!--!TABLA DE INSTITUCIONES-->
    <TableInstitucionesVue v-if="arrayInstituciones.length > 0" :arrayInstituciones="arrayInstituciones" @changeHandle="changeHandle"/>
  </div>
</template>

<script>
const TableInstitucionesVue = () => import('./TableInstituciones.vue')
export default {
  name: 'TableInstitucion',
  components:{
    TableInstitucionesVue
  },
  data() {
    return {
        busqueda:'',
        arrayInstituciones:[],
        nombreInstitucion:'',
        institucion_id:0,
        periodo_id:0,
        periodoDescripcion:'',
        ciudadDescripcion:'',
        objectSelectInstitucion:'',
      // Your data properties here
    };
  },
  props:{
    busquedaExterna:{
      type:String,
      default:''
    },
    ifBusquedaExterna:{
      type:Number,
      default:0
    }
  },
  mounted() {
    // Code to run when the component is mounted
    if(this.busquedaExterna != ''){
      this.busqueda = this.busquedaExterna
      this.getInstitucion()
    }
  },
  methods: {
    changeHandle(data){
      this.arrayInstituciones       = []
      this.objectSelectInstitucion  = data
      this.$emit('changeHandle',data)
    },
    cleanInstitucion(){
      this.objectSelectInstitucion = ''
      this.$emit('changeHandle',{})
    },
    getInstitucion() {
      let me = this;
      me.arraryInstituciones                  = [];
      me.institucion_id                       = 0;
      // Limpiar institución seleccionada al iniciar nueva búsqueda
      me.objectSelectInstitucion              = '';
      me.$emit('changeHandle', {});
      if(me.busqueda == ''){
        me.$vs.notify({
        text:'Ingrese un valor de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.busqueda.length < 4){
        me.$vs.notify({
        text:'Minimo 4 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?busqueda='+me.busqueda)
        .then(function (res) {
          let datos = res.data
          me.arrayInstituciones = datos
          me.$vs.loading.close()
          if(res.data.length == 0){
            me.$vs.notify({
            text: 'No se encontraron instituciones',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-user'
            })
          }else{
            if(res.data.message){
              me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user'
              })
            }
          }

        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
  },
};
</script>

<style scoped>
/* Your component styles here */
.contenedor{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%, 600px),1fr));
  grid-gap:10px;
}
.contenedor2 {
 /*grid 100% */
 grid-template-columns:repeat(auto-fill,minmax(100%,1fr));
}

/* Asegurar que los alerts no se desborden */
.contenedor >>> .vs-alert,
.contenedor2 >>> .vs-alert {
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.contenedor >>> .vs-alert p,
.contenedor2 >>> .vs-alert p {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  font-size: 14px;
  margin: 0;
  padding: 0;
}

.contenedor >>> .vs-alert b,
.contenedor2 >>> .vs-alert b {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

@media (max-width: 768px) {
  .contenedor {
    grid-template-columns: 1fr;
  }
  
  .contenedor >>> .vs-alert p,
  .contenedor2 >>> .vs-alert p {
    font-size: 12px;
    line-height: 1.4;
  }
  
  .contenedor >>> .vs-alert,
  .contenedor2 >>> .vs-alert {
    padding: 8px 12px;
  }
}
</style>
