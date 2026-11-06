<template>
  <vs-popup
    class="popup-confirm-delete"
    :title="titulo"
    :active.sync="modalVisible"
    @close="$emit('cancel')"
  >
    <div class="confirm-body">
      <div class="confirm-icon" :class="`icon-${tipo}`">
        <svg v-if="tipo === 'danger'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <svg v-else-if="tipo === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="confirm-title">{{ titulo }}</h3>
      <p class="confirm-message">{{ mensaje }}</p>
      <div class="confirm-actions">
        <vs-button :color="tipo === 'danger' ? 'danger' : 'warning'" @click="$emit('confirm')" block>
          Confirmar
        </vs-button>
        <vs-button color="dark" type="border" @click="$emit('cancel')" block>
          Cancelar
        </vs-button>
      </div>
    </div>
  </vs-popup>
</template>

<script>
export default {
    name: 'ConfirmModal',
  props: {
    visible: Boolean,
    titulo: String,
    mensaje: String,
    tipo: {
      type: String,
      default: 'danger',
      validator: value => ['danger', 'warning'].includes(value)
    }
  },
  data() {
    return {
      modalVisible: this.visible
    }
  },
  watch: {
    visible(val) {
      this.modalVisible = val
    }
  }
}
</script>

<style scoped>
.confirm-body {
  text-align: center;
  padding: 0.5rem 0;
}

.confirm-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-danger {
  background: #fee2e2;
  color: #dc2626;
}

.icon-warning {
  background: #fef3c7;
  color: #d97706;
}

.confirm-icon svg {
  width: 2rem;
  height: 2rem;
}

.confirm-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.confirm-message {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem;
}

.confirm-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
