<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3" v-if="proformas.length >= 1">
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 class="text-2xl font-semibold text-gray-800">Proformas</h2>
        <vs-button color="#7c2bff" type="relief" class="mt-4 sm:mt-0" @click="$emit('ver-proformas')">
          Ver Proformas
        </vs-button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p class="text-sm font-medium text-gray-500">Pendientes</p>
          <p class="text-xl font-bold text-indigo-600">{{ pendientes }}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p class="text-sm font-medium text-gray-500">Aprobadas</p>
          <p class="text-xl font-bold text-green-600">{{ aprobadas }}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p class="text-sm font-medium text-gray-500">Anuladas</p>
          <p class="text-xl font-bold text-red-600">{{ anuladas }}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p class="text-sm font-medium text-gray-500">Finalizadas</p>
          <p class="text-xl font-bold text-blue-600">{{ finalizadas }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProformasSummary',
  props: {
    proformas: {
      type: Array,
      default: function() {
        return []
      }
    },
    pendientes: {
      type: [Number, String],
      default: 0
    },
    aprobadas: {
      type: [Number, String],
      default: 0
    },
    anuladas: {
      type: [Number, String],
      default: 0
    },
    finalizadas: {
      type: [Number, String],
      default: 0
    }
  }
}
</script>
