<script>
export default {
  components: {
  },
  props: {
    capacitacionId: {
      type: Number,
      default: 0,
    },
    currentCapacitadores: {
      type: Array,
      default: () => ([]),
    },
    date: {
      type: String,
      default: '',
    },
    horaInicio: {
      type: String,
      default: '',
    },
    horaFin: {
      type: String,
      default: '',
    },
    handleEdit: {
      type: Function,
      default: () => { },
    },
  },
  data: () => ({
    isLoading: true,
    capacitadores: [],
    selectedCapacitadores: [],
  }),
  created() {
    this.getCapacitadores();
  },
  methods: {
    getCapacitadores() {
      const me = this;
      me.$http.get(`${me.$server_url}capacitadores/disponibles?fecha=${me.date}&hora_inicio=${me.horaInicio}&hora_fin=${me.horaFin}`).then((res) => {
        me.capacitadores.push(...res.data);
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
        });
      }).finally(() => {
        this.isLoading = false;
      });
    },
    updateSelection(item, isChecked) {
      if (this.selectedCapacitadores.includes(item)) {
        const index = this.selectedCapacitadores.indexOf(item);
        this.selectedCapacitadores.splice(index, 1);
      } else {
        this.selectedCapacitadores.push(item);
      }
    },
    updateCapacitacion() {
      const me = this;
      // check if already has capacitadores
      if (me.selectedCapacitadores.length == 0) {
        me.$vs.notify({
          title: 'Warning',
          text: 'Debe seleccionar al menos un capacitador',
          color: 'warning',
        });
        return;
      }

      console.log(me.currentCapacitadores)

      if (me.currentCapacitadores.length > 0) {
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: `Confirmar`,
          text: `Ésta capacitacion ya tiene capacitadores asignados, ¿desea reemplazarlos?.
          Si desea editar/ agregar capacitadores, presione "Cancelar" y luego "Abrir formulario"`,
          accept: this.updateCapacitacionRequest
        })
      } else {
        me.updateCapacitacionRequest();
      }


    },
    updateCapacitacionRequest() {
      const me = this;
      me.$http.post(`${me.$server_url}capacitaciones/${me.capacitacionId}/capacitadores`, {
        capacitadores: me.selectedCapacitadores,
      }).then((res) => {
        me.$vs.notify({
          title: 'Éxito',
          text: 'Capacitadores actualizados',
          color: 'success',
        });
        // Emit event to update capacitadores in parent component
        me.$emit('update-capacitadores');
      }).catch((err) => {
        me.$vs.notify({
          title: 'Error',
          text: err.message,
          color: 'danger',
        });
      });
    }
  },
  emits: ['update-capacitadores', 'edit-capacitacion'],
}
</script>

<template>
  <div class="flex flex-col items-end">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-if="isLoading" class="">Cargando...</div>
      <div v-if="capacitadores.length > 0" class="w-full flex items-center" v-for="(item, index) in capacitadores"
        :key="index">
        <vs-checkbox :label="item.idusuario" :val="item.idusuario" @change="updateSelection(item.idusuario, $event)" />
        <span class="text-bold">
          {{ item.nombres }} {{ item.apellidos }}
        </span>
      </div>
    </div>
    <div class="w-full flex justify-end space-x-2">
      <vs-button color="dark" type="border" @click="handleEdit(capacitacionId)">
        Abrir formulario
      </vs-button>
      <vs-button v-if="!isLoading" @click="updateCapacitacion">
        Guardar
      </vs-button>
    </div>
  </div>
</template>
