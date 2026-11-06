<template>
  <div>
    <perseo_menu_mantenimientoVue
      :config="{
        actualizar: {
          visible: true,
          habilitado: true,
          tieneApi: true
        },
        guardar: {
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        nuevo:{
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        modificar:{
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        eliminar:{
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        cancelar:{
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        }  
      }"
    />
    <div class="mt-4">
      <categoria_listadoVue />
    </div>
  </div>
</template>
<script>
  const perseo_menu_mantenimientoVue = () => import('@/views/perseo/components/perseo_menu_mantenimiento.vue');
  const categoria_listadoVue         = () => import('@/views/perseo/inventario/categoria/categoria_listado.vue');
export default{
  components:{
    perseo_menu_mantenimientoVue,
    categoria_listadoVue
  },
  data(){
    return{
    }
  }
}
</script>
