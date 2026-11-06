<template>
  <div class="bancos-clientes-screen">
    <!-- Menú de mantenimiento -->
    <perseo-menu-mantenimiento
      :config="menuConfig"
      @actualizar="handleActualizar"
    />

    <!-- Listado de bancos clientes -->
    <bancos-clientes-listado ref="listadoBancosClientes" />
  </div>
</template>

<script>
const PerseoMenuMantenimiento = () => import('@/views/perseo/components/perseo_menu_mantenimiento.vue');
const BancosClientesListado = () => import('./bancos_clientes_listado.vue');

export default {
  name: "BancosClientesScreen",
  components: {
    PerseoMenuMantenimiento,
    BancosClientesListado
  },
  data() {
    return {
      menuConfig: {
        nuevo: {
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        modificar: {
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        eliminar: {
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        guardar: {
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        cancelar: {
          visible: true,
          habilitado: false,
          tieneApi: false,
          tooltip: 'No disponible - Sin API configurada'
        },
        actualizar: {
          visible: true,
          habilitado: true,
          tieneApi: true
        }
      }
    };
  },
  methods: {
    handleActualizar() {
      console.log('Llamando a actualizar...');
      console.log('Ref listadoBancosClientes:', this.$refs.listadoBancosClientes);
      if (this.$refs.listadoBancosClientes) {
        this.$refs.listadoBancosClientes.f_listar();
      } else {
        console.error('El ref listadoBancosClientes no está disponible');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bancos-clientes-screen {
  padding: 1rem;
}

.view-header {
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.placeholder-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  margin: 1rem 0 0.5rem;
}

.placeholder-subtext {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
}
</style>
