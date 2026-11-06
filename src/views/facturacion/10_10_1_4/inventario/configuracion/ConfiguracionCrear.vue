<template>
  <div class="mt-5">
      <div class="vx-row mb-5">
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-input class="w-full" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Nombre Configuración" v-model="sendValor.nombre" />
                </vs-col>
            </vs-row>
        </vs-col>        
      </div>
      <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input class="w-full" icon-pack="feather" icon="icon-credit-card" icon-no-border label="Valor Mínimo" v-model="sendValor.minimo" />
              </div>
            </div>
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                  <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-code" icon-no-border label="Valor Máximo" v-model="sendValor.maximo" />
              </div>
            </div>
          </div>
      </div>
      <div class="vx-row mt-5">
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-textarea label="Descripción de configuración:"
                        placeholder="Escribe la descripción de configuración." class="w-full"
                        v-model="sendValor.descripcion" @input="limitarCaracteres"/>
                </vs-col>
            </vs-row>
        </vs-col>        
      </div>
      <div class="flex" style="justify-content: center;">
        <vs-button class="mr-3 mb-2" style="color:white !important;" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar</vs-button>
      </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import axios from 'axios'
export default{
  components:{
    vSelect,
  },
  data(){
    return{
      ifSaveImagen:false,
      //FIN VARIABLES IMAGEN
      sendValor:{
        minimo:'',
        maximo:'',
        nombre:'',
        descripcion:'',
        // estado:0,
      },
      maxLength: 500
    }
  },
  props:{
    id:{
      type:Number,
      default:0
    },
    ObjectSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
  },
  created(){
    let me = this;
  },
  mounted(){
    let me = this;
    if(me.id > 0){
      me.sendValor =    {
        minimo:         me.ObjectSelect.minimo,
        maximo:         me.ObjectSelect.maximo,
        nombre:         me.ObjectSelect.nombre,
        descripcion:    me.ObjectSelect.descripcion,
        // estado:         me.ObjectSelect.estado,
      }
    }
  },
  methods:{
    subirDocumento(){
      let me = this;
      if(!me.sendValor.nombre){
        me.$vs.notify({
            text:'Falta el campo Nombre',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
      }else if(!me.sendValor.minimo){
        me.$vs.notify({
            text:'Falta valor minimo',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
      }else if(!me.sendValor.maximo){
        me.$vs.notify({
            text:'Falta valor maximo',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
      }else if(!me.sendValor.descripcion){
        me.$vs.notify({
            text:'Falta descripción',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
      } 
      let formData = new FormData();
      formData.append('saveConfiguracion',        "yes")
      formData.append('id',                       me.id)
      formData.append('minimo',                   me.sendValor.minimo)
      formData.append('maximo',                   me.sendValor.maximo)
      formData.append('nombre',                   me.sendValor.nombre)
      formData.append('descripcion',              me.sendValor.descripcion)
      formData.append('user_created',             me.usuario.idusuario)
      //informacion
      me.$vs.loading()
      this.$http.post(this.$server_url+'inventario/configuracion', formData)
      .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          me.$vs.notify({
          text:"Se guardo correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('showCreate',0)
      })
      .catch(function (error) {
          me.$vs.loading.close()
      })
    },
    limitarCaracteres() {
      if (this.sendValor.observacion.length > this.maxLength) {
        this.sendValor.observacion = this.sendValor.observacion.substr(0, this.maxLength);
      }
    }
  },
  computed: {
    caracteresRestantes() {
      return this.maxLength - this.sendValor.observacion.length;
    }
  },
}


</script>
<style scoped>
 .box-input{
 }
  .upload-container{
    position:relative}
    .upload-container input{
      border:1px solid #92b0b3;
      background:#217bc5;
      outline:2px dashed #92b0b3;
      outline-offset:-10px;
      padding:100px 0px 100px 130px;
      width:100%;
      color:white;
  }
    .upload-container input:hover{
      background:#2c78cf}
    .upload-container:before{
      position:absolute;
      bottom:50px;
      left:23%;
      content:" Seleccione un archivo o arrastre aqui ";
      color:#f1f9fa;
      font-weight:900
  }
    .upload-btn{
      margin-left:300px;
      padding:7px 20px}
</style>
