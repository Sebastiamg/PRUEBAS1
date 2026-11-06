<template>
  <div>
      <vs-tabs alignment="fixed">
        <vs-tab label="Listado Alcances" @click="menu = 0;">
          <div>

          </div>
        </vs-tab>
        <vs-tab label="Trazabilidad alcance" @click="menu = 1;">
          <div>

          </div>
        </vs-tab>
    </vs-tabs>
    <!--COMPONENTES-->
    <div v-if="menu == 0">
      <listadoAlcanceVue/>
    </div>
    <div v-if="menu == 1">
      <ScreenTransabilidaAlcanceVue />
    </div>
  </div>
</template>
<script>
const listadoAlcanceVue            = () => import('./listadoAlcance.vue')
const ScreenTransabilidaAlcanceVue = () => import('../transabilidad/screenTransabilidaAlcance.vue')
export default{
  components:{
    listadoAlcanceVue,
    ScreenTransabilidaAlcanceVue,
  },
  data(){
    return{
      menu:0,
    }
  }
}
</script>
