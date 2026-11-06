<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Columna Izquierda: Búsqueda -->
    <div>
      <div class="vx-card p-6 mb-6">
        <h4 class="mb-4 text-xl font-semibold">Búsqueda por Cédula</h4>
        <div class="flex items-end gap-3">
          <div class="w-full">
            <vs-input
              label="Cédula"
              placeholder="Ingrese el número de cédula"
              class="w-full"
              v-model="filtroCedula"
              @keypress="validateInput"
              @input="filterNumbers"
              @paste="validatePaste"
              @keyup.enter="f_buscarPorCedula"
              maxlength="10"
              :danger="cedulaError"
              :danger-text="cedulaErrorMsg"
            />
            <small v-if="!cedulaError" class="text-gray-600 text-xs ml-1">Debe escribir 10 números</small>
          </div>
          <vs-button
            class="px-6"
            style="margin-bottom: 20px!important;"
            @click="f_buscarPorCedula"
            :disabled="!filtroCedula.trim()"
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
        <div v-if="personaEncontrada" class="vx-card p-4">
          <div class="flex items-center mb-4">
            <div class="h-10 w-10 flex items-center justify-center mr-3">
              <img src="@/assets/images/pedidos/civil.png" alt="Registro Civil" class="h-10 w-10 object-contain">
            </div>
            <div>
              <h5 class="text-base font-semibold text-success">Persona Encontrada</h5>
              <p class="text-xs text-gray-600">Información del Registro Civil</p>
            </div>
          </div>

          <!-- Cédula y Nombres en fila -->
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Cédula</label>
              <p class="text-sm font-medium">{{ personaEncontrada.identification }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Nombres</label>
              <p class="text-sm font-medium">{{ personaEncontrada.names }}</p>
            </div>
          </div>

          <!-- Mensaje cuando no existe en el sistema -->
          <div v-if="!usuarioExisteEnSistema" class="mb-3 bg-danger-light p-3 rounded-lg border-l-4 border-danger">
            <div class="flex items-center">
              <i class="bx bx-error-circle text-danger text-xl"></i>
              <p class="text-sm font-semibold text-danger">No encontrado en Plataforma</p>
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
      filtroCedula: '',
      personaEncontrada: null,
      errorMessage: '',
      usuarioExisteEnSistema: false,
      cedulaError: false,
      cedulaErrorMsg: ''
    }
  },
  components:{
  },
  methods:{
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    filterNumbers() {
      // Eliminar cualquier carácter que no sea número
      this.filtroCedula = this.filtroCedula.replace(/\D/g, '');
      // Limpiar el error cuando el usuario escribe
      this.cedulaError = false;
      this.cedulaErrorMsg = '';
    },
    validatePaste(event) {
      event.preventDefault();
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text/plain');

      // Filtrar solo números y limitar a 10 caracteres
      const numbersOnly = pastedText.replace(/\D/g, '').slice(0, 10);

      // Obtener el input donde se está pegando
      const input = event.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      // Insertar el texto en la posición actual del cursor
      this.filtroCedula =
        this.filtroCedula.slice(0, start) +
        numbersOnly +
        this.filtroCedula.slice(end);

      // Mover el cursor al final del texto insertado
      this.$nextTick(() => {
        input.selectionStart = input.selectionEnd = start + numbersOnly.length;
      });
    },
    f_buscarPorCedula(){
      // Limpiar resultados anteriores antes de validar
      this.personaEncontrada = null;
      this.errorMessage = '';
      this.usuarioExisteEnSistema = false;

      if (!this.filtroCedula.trim()) {
        this.cedulaError = true;
        this.cedulaErrorMsg = 'Por favor ingrese un número de cédula';
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: 'Por favor ingrese un número de cédula',
          color: 'warning',
          position: 'top-right'
        })
        return;
      }

      if (this.filtroCedula.length !== 10) {
        this.cedulaError = true;
        this.cedulaErrorMsg = 'La cédula debe tener exactamente 10 dígitos';
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: 'La cédula debe tener exactamente 10 dígitos',
          color: 'warning',
          position: 'top-right'
        })
        return;
      }      // Limpiar errores antes de buscar
      this.cedulaError = false;
      this.cedulaErrorMsg = '';

      let me = this;
      let formData = new FormData();
      formData.append('getCedulaRegistroCivil', 1);
      formData.append('cedula', this.filtroCedula);

      this.$vs.loading()
      this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
          .then(res => {
              me.$vs.loading.close()

              // Verificar primero el status del backend
              if (res.data.status === '0') {
                // El backend indica que no encontró en ningún lugar
                me.errorMessage = res.data.message || 'Cédula no encontrada';
                
                let dataEnviar = {
                  documento: me.filtroCedula,
                  apellidos: '',
                  nombres: '',
                  permitirEscrituraManual: true
                }
                me.$emit('f_setearNuevoUser', dataEnviar);
                me.$vs.notify({
                  title: 'Advertencia',
                  text: 'Cédula no encontrada. Complete los nombres y apellidos manualmente',
                  color: 'warning',
                  position: 'top-right'
                })
                me.$emit('f_changeUsuario', res.data)
                return;
              }

              // Status es '1', verificar dónde encontró los datos
              // Primera validación: Existe en el Registro Civil
              if (res.data && res.data.data && res.data.data.data) {
                me.personaEncontrada = res.data.data.data;

                // Segunda validación: Verificar si existe en el sistema
                if (res.data.user && res.data.user !== null) {
                  // Usuario existe tanto en Registro Civil como en el sistema
                  me.usuarioExisteEnSistema = true;
                  me.$vs.notify({
                    title: 'Éxito',
                    text: 'Persona encontrada en Registro Civil y en plataforma',
                    color: 'success',
                    position: 'top-right',
                    time:6000,
                  })
                } else {
                  // Usuario existe en Registro Civil pero NO en la plataforma
                  me.usuarioExisteEnSistema = false;

                  // Separar nombres y apellidos
                  let nombreCompleto = me.personaEncontrada.names || '';
                  let partesNombre = nombreCompleto.trim().split(/\s+/);

                  let apellidos = '';
                  let nombres = '';

                  if (partesNombre.length >= 2) {
                    // Los primeros 2 son apellidos
                    apellidos = partesNombre.slice(0, 2).join(' ');
                    // El resto son nombres
                    nombres = partesNombre.slice(2).join(' ');
                  } else if (partesNombre.length === 1) {
                    // Si solo hay una palabra, considerarla como apellido
                    apellidos = partesNombre[0];
                    nombres = '';
                  }

                  let dataEnviar = {
                    documento: me.filtroCedula,
                    apellidos: apellidos,
                    nombres: nombres
                  }
                  me.$emit('f_setearNuevoUser', dataEnviar);
                  me.$vs.notify({
                    title: 'Advertencia',
                    text: 'Persona encontrada en Registro Civil pero no está registrada en Plataforma',
                    color: 'warning',
                    position: 'top-right'
                  })
                }
              } else {
                // No se encontró en el Registro Civil pero status es '1'
                // Verificar si existe en la base de datos
                if (res.data.user && res.data.user !== null) {
                  // Usuario existe en la base de datos aunque no esté en Registro Civil
                  me.usuarioExisteEnSistema = true;
                  // NO setear errorMessage porque el usuario SÍ existe
                  me.errorMessage = ''; // Limpiar cualquier error anterior
                  me.$vs.notify({
                    title: 'Éxito',
                    text: 'Cédula no encontrada en Registro Civil, pero usuario existe en plataforma',
                    color: 'success',
                    position: 'top-right',
                    time:6000,
                  })
                }
              }
              me.$emit('f_changeUsuario',res.data)
          })
          .catch(err => {
              me.$vs.loading.close()
              
              // Error de red o problema técnico
              me.errorMessage = 'Error al realizar la búsqueda. Intente nuevamente.';
              me.$vs.notify({
                title: 'Error',
                text: 'Error de conexión al realizar la búsqueda',
                color: 'danger',
                position: 'top-right'
              })
          })
    },
    limpiarBusqueda(){
      this.personaEncontrada = null;
      this.errorMessage = '';
      this.filtroCedula = '';
      this.usuarioExisteEnSistema = false;
      this.cedulaError = false;
      this.cedulaErrorMsg = '';
      this.$emit('f_limpiarUsuario',true);
    },
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
