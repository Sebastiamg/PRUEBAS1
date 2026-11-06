<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Columna Izquierda: Búsqueda -->
    <div>
      <div class="vx-card p-6 mb-6">
        <h4 class="mb-4 text-xl font-semibold">Búsqueda por RUC</h4>
        <div class="flex items-end gap-3">
          <div class="w-full">
            <vs-input
              label="RUC"
              placeholder="Ingrese el número de RUC"
              class="w-full"
              v-model="filtroRuc"
              @keypress="validateInput"
              @input="filterNumbers"
              @paste="validatePaste"
              @keyup.enter="f_buscarPorRuc"
              maxlength="13"
              :danger="rucError"
              :danger-text="rucErrorMsg"
            />
            <small v-if="!rucError" class="text-gray-600 text-xs ml-1">Debe escribir 13 números</small>
          </div>
          <vs-button
            class="px-6"
            style="margin-bottom: 20px!important;"
            @click="f_buscarPorRuc"
            :disabled="!filtroRuc.trim()"
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
        <div v-if="rucEncontrado" class="vx-card p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="h-10 w-10 flex items-center justify-center mr-3">
                <img src="@/assets/images/pedidos/sri.png" alt="SRI" class="h-10 w-10 object-contain">
              </div>
              <div>
                <h5 class="text-base font-semibold text-success">RUC Encontrado</h5>
                <p class="text-xs text-gray-600">Información del Contribuyente</p>
              </div>
            </div>

          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2" style="max-height: 100px; overflow-y: auto;">
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">RUC</label>
              <p class="text-sm font-medium">{{ rucEncontrado.numeroRuc }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Nombres</label>
              <p class="text-sm font-medium">{{ rucEncontrado.razonSocial }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Estado</label>
              <p class="text-sm font-medium">{{ rucEncontrado.estadoContribuyenteRuc }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Tipo Contribuyente</label>
              <p class="text-sm font-medium">{{ rucEncontrado.tipoContribuyente }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Régimen</label>
              <p class="text-sm font-medium">{{ rucEncontrado.regimen }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Categoría</label>
              <p class="text-sm font-medium">{{ rucEncontrado.categoria }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Obligado Llevar Contabilidad</label>
              <p class="text-sm font-medium">{{ rucEncontrado.obligadoLlevarContabilidad }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Agente Retención</label>
              <p class="text-sm font-medium">{{ rucEncontrado.agenteRetencion }}</p>
            </div>
            <div class="bg-gray-100 p-2 rounded-lg md:col-span-2">
              <label class="text-xs text-gray-600 uppercase font-semibold block">Actividad Económica Principal</label>
              <p class="text-sm font-medium">{{ rucEncontrado.actividadEconomicaPrincipal }}</p>
            </div>
          </div>

          <!-- Mensaje cuando no existe en el sistema -->
          <div v-if="!usuarioExisteEnSistema" class="mt-3 bg-danger-light p-3 rounded-lg border-l-4 border-danger">
            <div class="flex items-center">
              <i class="bx bx-error-circle text-danger text-xl"></i>
              <p class="text-sm font-semibold text-danger">No encontrado en el Plataforma</p>
            </div>
            <!-- <p class="text-xs text-gray-600 ml-7">El usuario debe ser registrado</p> -->
          </div>

          <!-- Botón quitar -->
          <div class="flex justify-center mt-3">
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
  data() {
    return{
      filtroRuc: '',
      rucEncontrado: null,
      errorMessage: '',
      rucError: false,
      rucErrorMsg: '',
      usuarioExisteEnSistema: true,
      datosRuc: null
    }
  },
  methods: {
    validateInput(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    },
    filterNumbers() {
      // Eliminar cualquier carácter que no sea número
      this.filtroRuc = this.filtroRuc.replace(/\D/g, '');
      // Limpiar el error cuando el usuario escribe
      this.rucError = false;
      this.rucErrorMsg = '';
    },
    validatePaste(event) {
      event.preventDefault();
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text/plain');

      // Filtrar solo números y limitar a 13 caracteres
      const numbersOnly = pastedText.replace(/\D/g, '').slice(0, 13);

      // Obtener el input donde se está pegando
      const input = event.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      // Insertar el texto en la posición actual del cursor
      this.filtroRuc =
        this.filtroRuc.slice(0, start) +
        numbersOnly +
        this.filtroRuc.slice(end);

      // Mover el cursor al final del texto insertado
      this.$nextTick(() => {
        input.selectionStart = input.selectionEnd = start + numbersOnly.length;
      });
    },
    f_buscarPorRuc(){
      // Limpiar resultados anteriores antes de validar
      this.rucEncontrado = null;
      this.errorMessage = '';
      this.usuarioExisteEnSistema = true;

      if (!this.filtroRuc.trim()) {
        this.rucError = true;
        this.rucErrorMsg = 'Por favor ingrese un número de RUC';
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: 'Por favor ingrese un número de RUC',
          color: 'warning',
          position: 'top-right'
        })
        return;
      }

      if (this.filtroRuc.length !== 13) {
        this.rucError = true;
        this.rucErrorMsg = 'El RUC debe tener exactamente 13 dígitos';
        this.$emit('f_limpiarUsuario', true);
        this.$vs.notify({
          title: 'Advertencia',
          text: 'El RUC debe tener exactamente 13 dígitos',
          color: 'warning',
          position: 'top-right'
        })
        return;
      }

      // Limpiar errores antes de buscar
      this.rucError = false;
      this.rucErrorMsg = '';

      let me = this;
      let formData = new FormData();
      formData.append('getRucBusqueda', 1);
      formData.append('ruc', me.filtroRuc);

      me.$vs.loading()
      this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
          .then(res => {
              me.$vs.loading.close()

              // Verificar primero el status del backend
              if (res.data.status === '0') {
                // El backend indica que no encontró en ningún lugar
                me.errorMessage = res.data.message || 'RUC no encontrado';
                
                let dataEnviar = {
                  documento: me.filtroRuc,
                  apellidos: '',
                  nombres: '',
                  permitirEscrituraManual: true
                }
                me.$emit('f_setearNuevoUser', dataEnviar);
                me.$vs.notify({
                  title: 'Advertencia',
                  text: 'RUC no encontrado. Complete los nombres y apellidos manualmente',
                  color: 'warning',
                  position: 'top-right'
                })
                me.$emit('f_changeUsuario', res.data)
                return;
              }

              // Status es '1', verificar dónde encontró los datos
              if (res.data && res.data.status === "1" && res.data.data && res.data.data.length > 0) {
                me.rucEncontrado = res.data.data[0];
                if (res.data.user && res.data.user !== null) {
                  me.usuarioExisteEnSistema = true;
                  me.$vs.notify({
                    title: 'Éxito',
                    text: 'RUC encontrado en SRI y en Plataforma',
                    color: 'success',
                    position: 'top-right'
                  })
                } else {
                  me.usuarioExisteEnSistema = false;

                  // Separar nombres y apellidos de la razón social
                  let razonSocial = me.rucEncontrado.razonSocial || '';
                  let partesNombre = razonSocial.trim().split(/\s+/);

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
                    documento: me.filtroRuc,
                    apellidos: apellidos,
                    nombres: nombres
                  }
                  me.$emit('f_setearNuevoUser', dataEnviar);
                  me.$vs.notify({
                    title: 'Advertencia',
                    text: 'RUC encontrado en SRI pero no está registrado en la Plataforma',
                    color: 'warning',
                    position: 'top-right'
                  })
                }
              } else {
                // No se encontró en el SRI pero status es '1'
                // Verificar si existe en la base de datos
                if (res.data.user && res.data.user !== null) {
                  // Usuario existe en la base de datos aunque no esté en SRI
                  me.usuarioExisteEnSistema = true;
                  // NO setear errorMessage porque el usuario SÍ existe
                  me.errorMessage = ''; // Limpiar cualquier error anterior
                  me.$vs.notify({
                    title: 'Éxito',
                    text: 'RUC no encontrado en SRI, pero usuario existe en plataforma',
                    color: 'success',
                    position: 'top-right',
                    time:6000,
                  })
                }
              }
              me.$emit('f_changeUsuario', res.data)
          })
          .catch(err => {
              me.$vs.loading.close()

              // El backend ya intentó buscar en la BD, si llega aquí es porque no existe en ningún lugar
              me.errorMessage = 'RUC no encontrado en el SRI ni en la plataforma';
              
              let dataEnviar = {
                documento: me.filtroRuc,
                apellidos: '',
                nombres: '',
                permitirEscrituraManual: true
              }
              me.$emit('f_setearNuevoUser', dataEnviar);
              me.$vs.notify({
                title: 'Advertencia',
                text: 'RUC no encontrado. Complete los nombres y apellidos manualmente',
                color: 'warning',
                position: 'top-right'
              })
          })
    },
    limpiarBusqueda(){
      this.rucEncontrado = null;
      this.errorMessage = '';
      this.filtroRuc = '';
      this.rucError = false;
      this.rucErrorMsg = '';
      this.usuarioExisteEnSistema = true;
      this.$emit('f_limpiarUsuario', true);
    },
    formatearFecha(fecha){
      if (!fecha) return '';
      // Formato: 2021-06-24 00:00:00.0 -> 24/06/2021
      const date = new Date(fecha);
      const dia = String(date.getDate()).padStart(2, '0');
      const mes = String(date.getMonth() + 1).padStart(2, '0');
      const anio = date.getFullYear();
      return `${dia}/${mes}/${anio}`;
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
</style>

