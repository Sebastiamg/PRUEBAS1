<template>
  <div>
    <div v-if="otroValor == '1'">
      <h1 class="text-warning text-center text-2xl font-bold">{{ title }}</h1>
      <div class="flex justify-center mt-5">
        <vs-button color="primary" @click="$emit('changeConfirm',1)" class="mr-2" type="filled">{{ subtitle }}</vs-button>
        <vs-button color="warning" @click="$emit('changeConfirm',0)" icon-pack="feather" icon="icon-x" type="line">Cancelar</vs-button>
      </div>
    </div>
    <div v-else>
      <h1 class="text-warning text-center text-2xl font-bold">Estas seguro de eliminar?</h1>
      <div class="flex justify-center mt-3">
        <vs-button color="primary" @click="$emit('changeConfirm',1)" class="mr-2" type="filled">Si, deseo eliminar</vs-button>
        <vs-button color="warning" @click="$emit('changeConfirm',0)" icon-pack="feather" icon="icon-x" type="line">Cancelar</vs-button>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{

    }
  },
  props:{
    otroValor:{
      type: String,
      default: ''
    },
    title:{
      type: String,
      default: ''
    },
    subtitle:{
      type: String,
      default: ''
    }
  }
}
</script>
