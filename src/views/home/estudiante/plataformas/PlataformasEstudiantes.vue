<template>
  <div>
    <vx-card title="Otras Plataformas" v-if="arrayPlataformas.length > 0">
      <div  class="flex" style="flex-wrap: wrap;margin-top: -10px;">
        <!--TOTAL VENTA BRUTA-->
        <div class="p-6 pb-0 mr-3" v-for="(item,key) in arrayPlataformas" :key="key">
          <div class="flex justify-center imageIcon2" @click="openLink(item)" style="height: 150px;">
              <span class="cursor-pointer imageIcon p-4 inline-flex feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.01);">
                <!-- <feather-icon icon="ShoppingCartIcon"  svgClasses="h-8 w-7" class="ml-1" /> -->
                <img width="100" height="auto" :src="$data_url+'archivos/configuracion/plataforma/'+item.url" :alt="item.archivo">
              </span>
          </div>
          <div class="flex justify-center">
              <h3 class="mb-1 font-semibold text-primary" style="opacity:0.6;">{{item.nombre}}</h3>
          </div>
          <!-- <div class="ml-4"><span class="">{{item.nombre}}</span></div> -->
        </div>
      </div>
    </vx-card>
  </div>
</template>
<script>
export default {
  data() {
    return{
      arrayPlataformas:[],
    }
  },
  mounted(){
    let me = this
    me.getPlattforms()
  },
  methods:{
    getPlattforms(){
      let me = this;
      this.$http.get(this.$server_url+'plataformas/plataformas')
      .then(function (res) {
        let datos = res.data
        me.arrayPlataformas = datos.filter(p => p.estado == 1)
      })
      .catch(function (error) {
        console.log(error + ' error');
      })
    },
    openLink(tr){
      let ruta = tr.link
      window.open(ruta,'_blank')
    },
  }
}
</script>
<style scoped>
.imageIcon{
  transition: 1s ease all;
  padding: 10px;
  animation: inicioRevote 0.5s ease forwards;
}
.imageIcon2{
  transition: 1s ease all;
}
.imageIcon2:hover{
  transform: translateY(-20px);
}
@keyframes inicioRevote {
	0% {
		/* Estilos iniciales */
		opacity: 0;
		transform: translateX(-100px); /* Posiblemente causando el problema */
	}
	100% {
		/* Estilos finales */
		opacity: 1;
		transform: translateX(0);
	}
}
</style>


