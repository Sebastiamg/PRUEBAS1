<template>
  <div>
    <vx-card>
      <vs-tabs :color="colorx">
        <vs-tab label="Realizar Devolución" icon-pack="feather" icon="icon-codepen" @click="getValor">
        </vs-tab>
        <vs-tab label="Mis devoluciones"    icon-pack="feather" icon="icon-bookmark" @click="getValor">
        </vs-tab>
      </vs-tabs>
    </vx-card>
    <vx-card class="mt-5">
      hoal muindo
    </vx-card>
  </div>
</template>
<script>
export default{
  data(){
    return{
      colorx:"#F5B041",
    }
  },
  methods:{
    getValor(e){
      console.log("wew",e)
    }
  }
}
</script>
