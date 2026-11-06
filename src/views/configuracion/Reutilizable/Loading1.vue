<template>
  <div>
      <div>
        <h1 class="text-center text-warning text-2xl font-bold">{{ title }}</h1>
        <br>
        <img class="w-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/afb8cb36197347.5713616457ee5.gif"/>
      </div>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  props:{
    title:{
      type:String,
      default:'',
    },
  },
}
</script>
