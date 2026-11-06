<template>
  <div class="home-nomina p-4">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-base">
        <vx-card class="card-gema shadow-sm border border-slate-100">
          <div class="flex items-center gap-3 mb-4">
            <div class="icon-circle bg-primary text-white p-3 rounded-full flex items-center justify-center">
              <i class="feather icon-activity text-xl"></i>
            </div>
            <h5 class="font-bold text-slate-800 m-0">Gestión Estratégica</h5>
          </div>

          <p class="text-sm text-slate-500 mb-4">
            Gestión Estratégica Prolipa: registre sus actividades
            diarias y consulte los indicadores de su unidad.
          </p>

          <div class="mt-4">
            <!-- GEMA tiene sesión propia: el módulo pedirá cédula y contraseña. -->
            <vs-button color="primary" class="w-full" type="filled" to="/gema">
              Entrar a Gestión Estratégica
            </vs-button>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeNomina',
  props: {
    usuario: {
      type: Object,
      default: () => ({})
    }
  },
  // El resumen de actividades ya no se consulta aqui: GEMA tiene sesion propia
  // por token y sus contadores viven en el dashboard del modulo.
}
</script>

<style scoped>
.icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
</style>
