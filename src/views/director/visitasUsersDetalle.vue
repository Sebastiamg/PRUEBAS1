<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Detalle de Visitas</h2>
          <p class="text-gray-600">Historial de visitas por usuario</p>
        </div>
        <div v-if="arrayDetalle.length > 0">
          <vs-button color="success" @click="exportarExcel" class="p-2">
            <i class="fa-solid fa-file-excel"></i> Exportar Excel
          </vs-button>
        </div>
      </div>
    </div>

    <!-- User Info Card -->
    <div v-if="arrayDetalle.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div class="bg-blue-100 rounded-full p-3">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">{{ arrayDetalle[0].usuario }}</h3>
          <p class="text-gray-600">Cédula: {{ arrayDetalle[0].cedula }}</p>
          <p class="text-gray-600">Email: {{ arrayDetalle[0].email }}</p>
        </div>
      </div>
    </div>

    <!-- Visits List -->
    <div v-if="arrayDetalle.length > 0" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Visitas Registradas ({{ arrayDetalle[0].visitas.length }})
      </h3>

      <div class="grid gap-4">
        <div v-for="visita in arrayDetalle[0].visitas" :key="visita.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="bg-green-100 rounded-full p-1">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                    </path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-800">{{ visita.nombreasignatura }}</h4>
              </div>

              <!-- Información de acción y detalle -->
              <div v-if="getAccionDetalle(visita.datos).accion" class="mb-3">
                <div class="bg-gray-50 rounded-md p-3">
                  <div class="flex items-center space-x-2 mb-1">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span class="font-medium text-gray-800">Acción: {{ getAccionDetalle(visita.datos).accion }}</span>
                  </div>
                  <div v-if="getAccionDetalle(visita.datos).detalle" class="text-sm text-gray-600 ml-6">
                    <span class="font-medium">Detalle:</span> {{ getAccionDetalle(visita.datos).detalle }}
                  </div>
                  <div v-if="getAccionDetalle(visita.datos).curso" class="text-xs text-gray-500 ml-6 mt-1">
                    <span class="font-medium">Curso:</span> {{ getAccionDetalle(visita.datos).curso }}
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(visita.created_at) }}</span>
                </div>

                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{ formatTime(visita.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="text-right">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Recurso
              </span>
              <div class="text-xs text-gray-500 mt-1">
                {{ recursoNombreSelected }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay visitas registradas</h3>
      <p class="text-gray-500">No se encontraron visitas para los criterios seleccionados.</p>
    </div>
  </div>
</template>
<script>
import Generalmix from '@/mixins/Generalmix';
import Codigosmix from "@/mixins/Codigosmix";

export default {
  mixins: [Generalmix, Codigosmix],
  data() {
    return {
      arrayDetalle: []
    }
  },
  props: {
    idusuario: {
      type: Number,
      default: 0
    },
    institucion_id: {
      type: Number,
      default: 0
    },
    recurso: {
      type: Number,
      default: 0
    },
    fromDate: {
      type: String,
      default: ''
    },
    toDate: {
      type: String,
      default: ''
    },
    recursoNombreSelected: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.f_mostrarDetalles();
  },
  methods: {
    getAccionDetalle(datos) {
      // Validar que datos sea un string y no esté vacío
      if (!datos || typeof datos !== 'string') {
        return {
          accion: '',
          detalle: '',
          curso: ''
        };
      }

      try {
        // Intentar parsear el JSON
        const parsedData = JSON.parse(datos);

        // Validar que sea un objeto válido
        if (typeof parsedData === 'object' && parsedData !== null) {
          return {
            accion: parsedData.recurso_accion || '',
            detalle: parsedData.recurso_detalle || '',
            curso: parsedData.curso || ''
          };
        } else {
          return {
            accion: '',
            detalle: '',
            curso: ''
          };
        }
      } catch (error) {
        // Si falla el parseo, significa que datos no es un JSON válido
        console.warn('Error al parsear datos JSON:', error);
        return {
          accion: '',
          detalle: '',
          curso: ''
        };
      }
    },
    f_mostrarDetalles() {
      let me  = this
      // Lógica para mostrar detalles
      me.$vs.loading()
      var url = `usuarioVisitasXUsuarioRecurso?idusuario=${this.idusuario}&institucion_id=${this.institucion_id}&recurso=${this.recurso}&fromDate=${this.fromDate}&toDate=${this.toDate}`
      this.$http.get(this.$server_url + url)
        .then((res) => {
          me.$vs.loading.close()
          this.arrayDetalle = res.data
        })
        .catch((error) => {
          console.log(error + ' error');
        })
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      return date.toLocaleDateString('es-ES', options)
    },
    formatTime(dateString) {
      const date = new Date(dateString)
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      return date.toLocaleTimeString('es-ES', options)
    },
    exportarExcel() {
      let me = this;
      if (me.arrayDetalle.length === 0) {
        me.m_message('No hay datos para exportar', 'warning', 'icon-alert-triangle');
        return;
      }

      // Preparar los datos para exportar
      let dataExport = [];

      if (me.arrayDetalle[0] && me.arrayDetalle[0].visitas) {
        const usuario = me.arrayDetalle[0];

        me.arrayDetalle[0].visitas.forEach(visita => {
          const accionDetalle = me.getAccionDetalle(visita.datos);

          dataExport.push({
            usuario: usuario.usuario,
            cedula: usuario.cedula,
            email: usuario.email,
            recurso: me.recursoNombreSelected,
            asignatura: visita.nombreasignatura,
            accion: accionDetalle.accion,
            detalle: accionDetalle.detalle,
            curso: accionDetalle.curso,
            fecha: me.formatDate(visita.created_at),
            hora: me.formatTime(visita.created_at),
            fecha_completa: visita.created_at
          });
        });
      }

      // Definir headers y campos para el Excel
      let headers = [
        'Usuario',
        'Cédula',
        'Email',
        'Tipo de Recurso',
        'Asignatura',
        'Acción',
        'Detalle',
        'Curso',
        'Fecha',
        'Hora',
        'Fecha Completa'
      ];

      let fieldKeys = [
        'usuario',
        'cedula',
        'email',
        'recurso',
        'asignatura',
        'accion',
        'detalle',
        'curso',
        'fecha',
        'hora',
        'fecha_completa'
      ];

      // Generar nombre del archivo
      let nombreUsuario = (me.arrayDetalle[0] && me.arrayDetalle[0].usuario) ? me.arrayDetalle[0].usuario : 'Usuario';
      let tipoRecurso = me.recursoNombreSelected || 'Recurso';
      let fechaInicio = me.fromDate || '';
      let fechaFin = me.toDate || '';

      let nameFile = 'Detalle_Visitas_' + nombreUsuario.replace(/\s+/g, '_') + '_' + tipoRecurso.replace(/\s+/g, '_') + '_' + fechaInicio + '_' + fechaFin;

      // Exportar usando el mixin
      if (typeof me.m_exportTodo === 'function') {
        me.m_exportTodo(headers, fieldKeys, dataExport, nameFile);
      } else {
        me.m_message('Función de exportación no disponible', 'danger', 'icon-alert-triangle');
      }
    }
  }
}
</script>
