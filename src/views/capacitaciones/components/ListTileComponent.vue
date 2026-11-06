<script>
import ClassroomIcon from './ClassroomIcon.vue';
import VideoClassroomIcon from './VideoClassroomIcon.vue';
import CapacitadoresComponents from './CapacitadoresComponents.vue';

export default {
  components: {
    ClassroomIcon,
    VideoClassroomIcon,
    CapacitadoresComponents,
  },
  props: {
    capacitacion: {
      type: Object,
      default: () => ({}),
    },
    isSporting: {
      type: Boolean,
      default: false,
    },
    handleEdit: {
      type: Function,
      default: () => { },
    },
  },
  data: () => ({
    tipoVal: '',
    startDate: '',
    isEditing: false,
  }),
  created() {
    this.tipoVal = this.capacitacion.tipo == 0 ? 'Presencial' : 'Virtual';
    this.startDate = this.capacitacion.fecha_inicio.split(' ')[0];
  },
  methods: {
    goToEdit() {
      this.$router.push({
        name: 'capacitaciones.edit',
        params: {
          id: this.capacitacion.id,
        },
      });
    },
  },
  emits: ['update-capacitadores'],
}
</script>

<template>
  <div class="bg-white rounded shadow-md p-2">
    <div class="w-full flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <div class="w-full sm:w-2/3 flex flex-col space-y-2">
        <h5 class="text-bold">
          {{ capacitacion.nombre }}
        </h5>
        <div class="w-full flex space-x-2 items-center">
          <div class="w-1/2 flex">
            <div class="p-1 flex space-x-2 items-center bg-success flex-row rounded text-white justify-start max-w-min">
              <div style="width: 20px; height: 20px;">
                <ClassroomIcon v-if="capacitacion.tipo == 0" fill="#fff" />
                <VideoClassroomIcon v-else fill="#fff" />
              </div>
              <span>
                {{ tipoVal }}
              </span>
            </div>
          </div>
          <span class="w-1/2" v-if="capacitacion.personas > 0">
            <span class="font-bold">Asistentes:</span> {{ capacitacion.cant_asistentes }}
          </span>
          <span v-else>
            Sin definir asistentes
          </span>
        </div>
        <div class="w-full flex">
          <span class="w-1/2 font-bold">
            {{ capacitacion.institucion ? capacitacion.institucion.ciudad.nombre : 'Sin definir' }}
          </span>
          <span v-if="capacitacion.institucion" class=" w-1/2 font-bold">
            {{ capacitacion.institucion.nombreInstitucion }}
          </span>
          <span v-else class=" w-1/2 font-bold">
            {{ capacitacion.nombre_institucion_temporal }}
          </span>
        </div>
        <div class="w-full flex ">
          <span class="w-1/3 font-bold">{{ capacitacion.periodo.periodoescolar }}</span>
          <span class=" w-1/3">
            <span class="font-bold">Fecha:</span> {{ startDate }}
          </span>
          <span class="w-1/3">
            <span class="font-bold">Horario:</span> {{ capacitacion.hora_inicio }} - {{ capacitacion.hora_fin }}
          </span>
        </div>
      </div>
      <div class="w-full sm:w-1/3 flex flex-col space-y-2">
        <h6>Capacitador(es):</h6>
        <span v-if="capacitacion.capacitadores.length > 0">
          {{ capacitacion.capacitadores.map(capacitador => capacitador.nombres + ' ' + capacitador.apellidos).join(', ')
          }}
        </span>
        <span v-else class="text-danger">
          Sin definir
        </span>
        <span>
          <span class="font-bold">Asesor:</span> {{ capacitacion.asesor.nombres }} {{ capacitacion.asesor.apellidos }}
        </span>
        <!-- <vs-button :class="[
        isSporting ? 'hidden' : 'flex'
      ]" size="small" color="dark" type="border" icon-pack="feather" icon="icon-edit" icon-before :onclick="goToEdit">
        Editar
      </vs-button> -->
      </div>
    </div>
    <div class="w-full flex flex-col">
      <div class="flex" :class="[
        isEditing ? 'justify-between' : 'justify-end'
      ]">
        <span v-if="isEditing" class="text-lg font-bold underline mt-4" :class="[isEditing ? 'mb-4' : '']">
          Asesores disponibles
        </span>
        <button class="bg-white border-none cursor-pointer" @click="isEditing = !isEditing">
          <div v-if="!isEditing" class="flex items-center space-x-2">
            <img src="../../../assets/icons/dropdown.svg" class="h-8 w-8 m-0" alt="dropdown" />
            <span class="font-bold">Editar capacitadores</span>
          </div>
          <img v-if="isEditing" src="../../../assets/icons/close.svg" class="h-8 w-8 m-0" alt="dropdown" />
        </button>
      </div>
      <CapacitadoresComponents v-if="isEditing" :class="[
        isEditing ? 'flex' : 'hidden'
      ]" :capacitacion-id="capacitacion.id_seminario" :date="startDate" :hora-inicio="capacitacion.hora_inicio"
        :hora-fin="capacitacion.hora_fin" @update-capacitadores="$emit('update-capacitadores')" :handle-edit="handleEdit"
        :current-capacitadores="capacitacion.capacitadores" />
    </div>
  </div>
</template>
