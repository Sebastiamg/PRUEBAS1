<template>
  <div>
    <div v-if="menu != 0">
      <!--boton regresar-->
      <vs-button @click="menu = 0" class="mb-2 p-2" color="primary">◄ Regresar</vs-button>
    </div>
    <!--informacion-->
    <div v-if="menu == 0">
      <div v-if="ObjectoDatosDespacho.length > 0">
        <b class="text-warning">Despachar en libreria:</b>
        <p>{{ObjectoDatosDespacho[0].nombreInstitucion}}</p>
        <b>Dirección:</b>
        <p>{{ObjectoDatosDespacho[0].direccionInstitucion}}</p>
        <b>Teléfono</b>
        <p>{{ObjectoDatosDespacho[0].telefonoInstitucion}}</p>
        <p>Email</p>
        <p>{{ObjectoDatosDespacho[0].email}}</p>
        <b class="text-warning">Cliente:</b>
        <p>{{ObjectoDatosDespacho[0].cliente}}</p>
        <b>Cédula:</b>
        <p>{{ObjectoDatosDespacho[0].cedula}}</p>
      </div>
      <div v-else>
        No hay datos de despacho ni el cliente
      </div>

        <!-- <div class="flex">
          <vs-button class="p-2 mt-3" @click="menu = 1;" icon="edit" style="font-size:10px;">Institución</vs-button>
        </div> -->
    </div>
    <!--informacion de la institucion-->
    <div v-if="menu == 1">
      <FacturacionInformacionInstitucionVue :institucion_id="institucion_id" @changeSaveInformacion="changeSaveInformacion"/>
    </div>
  </div>
</template>
<script>
import UserRepository from '../../../../../repositories/UserRepository'
import PedidosRepository from '../../../../../repositories/PedidosRepository'
import vSelect from 'vue-select'
import FacturacionInformacionInstitucionVue from './FacturacionInformacionInstitucion.vue'
export default {
  components:{
    vSelect,
    FacturacionInformacionInstitucionVue
  },
  data() {
    return{
      ObjectoDatosDespacho:[],
      setMenu:0,
      menu:0,
      institucion_id:0,
    }
  },
  props:{
    idProforma:{
      type: String,
      default: ""
    },
  },
  created(){
    let me = this
    //setMenu  0 => //ingreso por pedidos, 1 => ingreso por punto de venta
    me.setMenu = localStorage.setMenu
    me.getDatosDespacho()

  },
  watch:{
    idProforma(results){
      let me = this
      me.getDatosDespacho()
    }
  },

  methods:{
    getDatosDespacho(){
      let me = this
      if(me.idProforma == "" || me.idProforma == null || me.idProforma == undefined) return
      //api get
      this.$http.get(this.$server_url+`pedidos2/pedidos?getDatosDespachoProforma=1&idProforma=${me.idProforma}`)
        .then(function (res) {
            me.ObjectoDatosDespacho = res.data
            if(res.data.length > 0){
              me.institucion_id = res.data[0].id_ins_depacho
            }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    changeSaveInformacion(e){
      let me = this
      me.menu = 0
      me.getDatosDespacho()
    },
  }
}
</script>
