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
      <subcategoria1_listadoVue />
    </div>
  </div>
</template>
<script>
  const perseo_menu_mantenimientoVue = () => import('@/views/perseo/components/perseo_menu_mantenimiento.vue');
  const subcategoria1_listadoVue     = () => import('@/views/perseo/inventario/subcategoria1/subcategoria1_listado.vue');
export default{
  components:{
    perseo_menu_mantenimientoVue,
    subcategoria1_listadoVue
  },
  data(){
    return{
    }
  }
}
</script>
