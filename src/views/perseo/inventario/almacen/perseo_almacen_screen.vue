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
      @actualizar="handleActualizar"
    />
    <div class="mt-4">
      <perseo_almacen_listadoVue />
    </div>
  </div>
</template>
<script>
  const perseo_menu_mantenimientoVue = () => import('@/views/perseo/components/perseo_menu_mantenimiento.vue');
  const perseo_almacen_listadoVue    = () => import('@/views/perseo/inventario/almacen/perseo_almacen_listado.vue');
export default{
  components:{
    perseo_menu_mantenimientoVue,
    perseo_almacen_listadoVue
  },
  data(){
    return{
    }
  },
  methods: {
    handleActualizar(evento) {
      console.log('Actualizando almacén...', evento);
      // Aquí va la lógica para actualizar los datos
    }
  }
}
</script>
