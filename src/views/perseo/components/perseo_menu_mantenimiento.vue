<template>
  <div>
    <div class="flex flex-wrap gap-2">
      <!-- Botón Nuevo -->
      <vx-tooltip
        v-if="botones.nuevo.visible"
        :text="botones.nuevo.tooltip"
      >
        <div class="btn-wrapper">
          <vs-button 
            :disabled="!botones.nuevo.habilitado"
            :color="botones.nuevo.color"
            @click="ejecutarAccion('nuevo')"
            class="btn-mantenimiento"
          >
            {{ botones.nuevo.texto }}
            <i :class="botones.nuevo.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!botones.nuevo.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>

      <!-- Botón Modificar -->
      <vx-tooltip
        v-if="botones.modificar.visible"
        :text="botones.modificar.tooltip"
      >
        <div class="btn-wrapper">
          <vs-button 
            :disabled="!botones.modificar.habilitado"
            :color="botones.modificar.color"
            @click="ejecutarAccion('modificar')"
            class="btn-mantenimiento"
          >
            {{ botones.modificar.texto }}
            <i :class="botones.modificar.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!botones.modificar.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>

      <!-- Botón Eliminar -->
      <vx-tooltip
        v-if="botones.eliminar.visible"
        :text="botones.eliminar.tooltip"
      >
        <div class="btn-wrapper">
          <vs-button 
            :disabled="!botones.eliminar.habilitado"
            :color="botones.eliminar.color"
            @click="ejecutarAccion('eliminar')"
            class="btn-mantenimiento"
          >
            {{ botones.eliminar.texto }}
            <i :class="botones.eliminar.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!botones.eliminar.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>

      <!-- Botón Guardar -->
      <vx-tooltip
        v-if="botones.guardar.visible"
        :text="botones.guardar.tooltip"
      >
        <div class="btn-wrapper">
          <vs-button 
            :disabled="!botones.guardar.habilitado"
            :color="botones.guardar.color"
            @click="ejecutarAccion('guardar')"
            class="btn-mantenimiento"
          >
            {{ botones.guardar.texto }}
            <i :class="botones.guardar.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!botones.guardar.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>

      <!-- Botón Cancelar -->
      <vx-tooltip
        v-if="botones.cancelar.visible"
        :text="botones.cancelar.tooltip"
      >
        <div class="btn-wrapper">
          <vs-button 
            :disabled="!botones.cancelar.habilitado"
            :color="botones.cancelar.color"
            @click="ejecutarAccion('cancelar')"
            class="btn-mantenimiento"
          >
            {{ botones.cancelar.texto }}
            <i :class="botones.cancelar.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!botones.cancelar.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>

      <!-- Botón Actualizar -->
      <vx-tooltip
        v-if="botones.actualizar.visible"
        :text="botones.actualizar.tooltip"
      >
        <div class="btn-wrapper">
          <vs-button 
            :disabled="!botones.actualizar.habilitado"
            :color="botones.actualizar.color"
            @click="ejecutarAccion('actualizar')"
            class="btn-mantenimiento"
          >
            {{ botones.actualizar.texto }}
            <i :class="botones.actualizar.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!botones.actualizar.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>

      <!-- Botones personalizados adicionales -->
      <vx-tooltip
        v-for="(boton, index) in botonesCustom"
        :key="`custom-${index}`"
        :text="boton.tooltip"
      >
        <div class="btn-wrapper" v-if="boton.visible">
          <vs-button 
            :disabled="!boton.habilitado"
            :color="boton.color"
            @click="ejecutarAccion('custom', boton.accion)"
            class="btn-mantenimiento"
          >
            {{ boton.texto }}
            <i :class="boton.icon" class="ml-2"></i>
          </vs-button>
          <div v-if="!boton.tieneApi" class="sin-api-badge">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </vx-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerseoMenuMantenimiento',
  props: {
    // Configuración de botones
    config: {
      type: Object,
      default: () => ({})
    },
    // Botones personalizados adicionales
    botonesCustom: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // Configuración por defecto de los botones
      botonesDefault: {
        nuevo: {
          texto: 'Nuevo',
          icon: 'fa-solid fa-plus',
          color: 'primary',
          tooltip: 'Crear nuevo registro',
          visible: false,
          habilitado: false,
          tieneApi: false
        },
        modificar: {
          texto: 'Modificar',
          icon: 'fa-solid fa-pencil',
          color: 'warning',
          tooltip: 'Modificar registro seleccionado',
          visible: false,
          habilitado: false,
          tieneApi: false
        },
        eliminar: {
          texto: 'Eliminar',
          icon: 'fa-solid fa-trash',
          color: 'danger',
          tooltip: 'Eliminar registro seleccionado',
          visible: false,
          habilitado: false,
          tieneApi: false
        },
        guardar: {
          texto: 'Guardar',
          icon: 'fa-solid fa-floppy-disk',
          color: 'success',
          tooltip: 'Guardar cambios',
          visible: false,
          habilitado: false,
          tieneApi: false
        },
        cancelar: {
          texto: 'Cancelar',
          icon: 'fa-solid fa-x',
          color: 'dark',
          tooltip: 'Cancelar operación',
          visible: false,
          habilitado: false,
          tieneApi: false
        },
        actualizar: {
          texto: 'Actualizar',
          icon: 'fa-solid fa-arrows-rotate',
          color: 'primary',
          tooltip: 'Actualizar datos',
          visible: false,
          habilitado: false,
          tieneApi: false
        }
      }
    };
  },
  computed: {
    // Combinar configuración por defecto con la proporcionada
    botones() {
      return {
        nuevo: { ...this.botonesDefault.nuevo, ...this.config.nuevo },
        modificar: { ...this.botonesDefault.modificar, ...this.config.modificar },
        eliminar: { ...this.botonesDefault.eliminar, ...this.config.eliminar },
        guardar: { ...this.botonesDefault.guardar, ...this.config.guardar },
        cancelar: { ...this.botonesDefault.cancelar, ...this.config.cancelar },
        actualizar: { ...this.botonesDefault.actualizar, ...this.config.actualizar }
      };
    }
  },
  methods: {
    ejecutarAccion(accion, customAccion = null) {
      const botonConfig = customAccion ? 
        this.botonesCustom.find(b => b.accion === customAccion) :
        this.botones[accion];

      if (!botonConfig || !botonConfig.habilitado) {
        return;
      }

      // Emitir evento con la acción
      this.$emit(customAccion || accion, {
        accion: customAccion || accion,
        tieneApi: botonConfig.tieneApi,
        config: botonConfig
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-wrapper {
  position: relative;
  display: inline-block;
}

.btn-mantenimiento {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.sin-api-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: #ff4757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
  
  i {
    color: white;
    font-size: 10px;
    font-weight: bold;
  }
}
</style>
