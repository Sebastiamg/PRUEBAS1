<template>
  <div v-if="userRoot || usuario.id_group == 27">
    <vx-card>
      <div class="flex p-2" style="flex-wrap:wrap;">
        <vs-button color="success"    @click="menu = 0" class="m-2" type="border">Ingresar códigos</vs-button>
        <vs-button color="danger"     @click="menu = 1" class="m-2" type="border">Eliminar códigos</vs-button>
        <vs-button color="dark"     @click="menu = 2" class="m-2" type="border">Crear códigos</vs-button>
      </div>
      <!--components-->
      <div v-if="menu == 0">
        <ImportIngresarCodigosVue/>
      </div>
      <div v-if="menu == 1">
        <EliminarCodigosVue/>
      </div>
      <div v-if="menu == 2">
        <GenerarCodigosVue/>
      </div>
    </vx-card>
  </div>
</template>
<script>
  import {
    mapState
} from "vuex";
const EliminarCodigosVue        = () => import('../../codigos/components/EliminarCodigos.vue')
const ImportIngresarCodigosVue  = () => import('../../codigos/components/ImportIngresarCodigos.vue')
const GenerarCodigosVue         = () => import('../../codigos/components/GenerarCodigos/GenerarCodigos.vue')
export default {
  components:{
    EliminarCodigosVue,
    ImportIngresarCodigosVue,
    GenerarCodigosVue,
  },
  data() {
    return{
      usuario: [],
      menu: 0,
    }
  },
  created(){
    let me        = this
    this.usuario  = JSON.parse(localStorage.getItem('usuario'))
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
  },
}
</script>
