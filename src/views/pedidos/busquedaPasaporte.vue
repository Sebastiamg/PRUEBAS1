<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Columna Izquierda: Búsqueda -->
    <div>
      <div class="vx-card p-6 mb-6">
        <h4 class="mb-4 text-xl font-semibold">Búsqueda por Pasaporte</h4>
        <div class="flex items-end gap-3">
          <div class="w-full">
            <vs-input
              label="Pasaporte"
              placeholder="Ingrese el número de pasaporte"
              class="w-full"
              v-model="filtroPasaporte"
              @input="filterInput"
              @paste="validatePaste"
              @keyup.enter="f_buscarPorPasaporte"
              :maxlength="cantidad_maxima"
              :danger="pasaporteError"
              :danger-text="pasaporteErrorMsg"
            />
            <small v-if="!pasaporteError" class="text-gray-600 text-xs ml-1">Debe escribir entre {{ cantidad_minima }} y {{ cantidad_maxima }} caracteres</small>
          </div>
          <vs-button
            class="px-6"
            style="margin-bottom: 20px!important;"
            @click="f_buscarPorPasaporte"
            :disabled="!filtroPasaporte.trim()"
          >
            Buscar
          </vs-button>
        </div>
      </div>
    </div>

    <!-- Columna Derecha: Resultado -->
    <div>
      <!-- Resultado Encontrado -->
      <transition name="slide-fade">
        <div v-if="pasaporteEncontrado" class="vx-card p-4">
          <div class="flex items-center mb-4">
            <div class="h-10 w-10 flex items-center justify-center mr-3">
              <img src="@/assets/images/pedidos/pasaporte.png" alt="Pasaporte" class="h-10 w-10 object-contain">
            </div>
            <div>
              <h5 class="text-base font-semibold text-success">Usuario Encontrado</h5>
              <p class="text-xs text-gray-600">Información del usuario en el sistema</p>
            </div>
          </div>

          <!-- Pasaporte y Nombres en fila -->
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Pasaporte</label>
              <p class="text-sm font-medium">{{ pasaporteEncontrado.cedula }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Nombres</label>
              <p class="text-sm font-medium">{{ pasaporteEncontrado.nombres }} {{ pasaporteEncontrado.apellidos }}</p>
            </div>
          </div>

          <!-- Botones centrados -->
          <div class="flex justify-center gap-3">
            <vs-button color="danger" type="border" @click="limpiarBusqueda">
              Quitar
            </vs-button>
          </div>
        </div>
      </transition>

      <!-- Error/No encontrado -->
      <transition name="slide-fade">
        <div v-if="errorMessage" class="vx-card p-6 border-l-4 border-warning">
          <div class="flex items-center">
            <div class="h-12 w-12 rounded-full bg-warning text-white flex items-center justify-center mr-4">
              <i class="text-2xl">⚠</i>
            </div>
            <div>
              <h5 class="text-lg font-semibold text-warning">Atención</h5>
              <p class="text-sm text-gray-700 mt-1">{{ errorMessage }}</p>
              <p class="text-xs text-gray-600 mt-2">Por favor complete los nombres y apellidos manualmente en el formulario</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      filtroPasaporte: '',
      pasaporteEncontrado: null,
      errorMessage: '',
      pasaporteError: false,
      pasaporteErrorMsg: '',
      cantidad_minima: 3,
      cantidad_maxima: 10
    }
  },
  methods:{
    filterInput() {
      // Limpiar el error cuando el usuario escribe
      this.pasaporteError = false;
      this.pasaporteErrorMsg = '';
    },
    validatePaste(event) {
      event.preventDefault();
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text/plain');

      // Limitar a cantidad máxima de caracteres
      const limitedText = pastedText.slice(0, this.cantidad_maxima);

      // Obtener el input donde se está pegando
      const input = event.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      // Insertar el texto en la posición actual del cursor
      this.filtroPasaporte =
        this.filtroPasaporte.slice(0, start) +
        limitedText +
        this.filtroPasaporte.slice(end);

      // Mover el cursor al final del texto insertado
      this.$nextTick(() => {
        input.selectionStart = input.selectionEnd = start + limitedText.length;
      });
    },
    f_buscarPorPasaporte(){
      // Limpiar resultados anteriores antes de validar
      this.pasaporteEncontrado = null;
      this.errorMessage = '';

      if (!this.filtroPasaporte.trim()) {
        this.pasaporteError = true;
        this.pasaporteErrorMsg = 'Por favor ingrese un número de pasaporte';
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: 'Por favor ingrese un número de pasaporte',
          color: 'warning',
          position: 'top-right'
        })
        return;
      }

      if (this.filtroPasaporte.length < this.cantidad_minima) {
        this.pasaporteError = true;
        this.pasaporteErrorMsg = `El pasaporte debe tener al menos ${this.cantidad_minima} caracteres`;
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: `El pasaporte debe tener al menos ${this.cantidad_minima} caracteres`,
          color: 'warning',
          position: 'top-right'
        })
        return;
      }

      if (this.filtroPasaporte.length > this.cantidad_maxima) {
        this.pasaporteError = true;
        this.pasaporteErrorMsg = `El pasaporte no puede tener más de ${this.cantidad_maxima} caracteres`;
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: `El pasaporte no puede tener más de ${this.cantidad_maxima} caracteres`,
          color: 'warning',
          position: 'top-right'
        })
        return;
      }

      // Limpiar errores antes de buscar
      this.pasaporteError = false;
      this.pasaporteErrorMsg = '';

      let me = this;
      let formData = new FormData();
      formData.append('getPasaporteBusqueda', 1);
      formData.append('pasaporte', this.filtroPasaporte);

      this.$vs.loading()
      this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
          .then(res => {
              me.$vs.loading.close()

              if (res.data && res.data.status === "1" && res.data.user && res.data.user !== null) {
                me.pasaporteEncontrado = res.data.user;
                me.$vs.notify({
                  title: 'Éxito',
                  text: 'Usuario encontrado en Plataforma',
                  color: 'success',
                  position: 'top-right'
                })
              } else {
                // No se encontró el pasaporte - Permitir escritura manual
                me.errorMessage = 'Pasaporte no encontrado en Plataforma';
                
                let dataEnviar = {
                  documento: me.filtroPasaporte,
                  apellidos: '',
                  nombres: '',
                  permitirEscrituraManual: true // Nueva bandera para indicar que se permite escritura manual
                }
                me.$emit('f_setearNuevoUser', dataEnviar);
                me.$vs.notify({
                  title: 'Advertencia',
                  text: 'Pasaporte no encontrado. Complete los nombres y apellidos manualmente',
                  color: 'warning',
                  position: 'top-right'
                })
              }
              me.$emit('f_changeUsuario', res.data)
          })
          .catch(err => {
              me.$vs.loading.close()

              // El backend ya intentó buscar, si llega aquí es porque no existe
              me.errorMessage = 'Pasaporte no encontrado en la plataforma';
              
              let dataEnviar = {
                documento: me.filtroPasaporte,
                apellidos: '',
                nombres: '',
                permitirEscrituraManual: true
              }
              me.$emit('f_setearNuevoUser', dataEnviar);
              me.$vs.notify({
                title: 'Advertencia',
                text: 'Pasaporte no encontrado. Complete los nombres y apellidos manualmente',
                color: 'warning',
                position: 'top-right'
              })
          })
    },
    limpiarBusqueda(){
      this.pasaporteEncontrado = null;
      this.errorMessage = '';
      this.filtroPasaporte = '';
      this.pasaporteError = false;
      this.pasaporteErrorMsg = '';
      this.$emit('f_limpiarUsuario', true);
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.hijo-popup {
  z-index: 51003;
}
</style>
