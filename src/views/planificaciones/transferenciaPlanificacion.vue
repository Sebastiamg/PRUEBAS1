<template>
  <vs-row align="center" class="popup-content p-4">
    <!-- Texto inicial (solo visible si NO hay libro destino seleccionado) -->
    <vs-col v-if="!libroSelecttranferir" vs-w="12" vs-type="flex" vs-justify="center" vs-align="center" class="mb-6">
      <div class="info-box">
        <p class="info-title">📘 Copia de Planificaciones</p>
        <p class="info-description">
          Selecciona el libro destino para copiar las planificaciones.
        </p>
      </div>
    </vs-col>

    <!-- Filtros de serie y área (heredados de la vista padre) -->
    <vs-col vs-w="12" class="filtros-container">
      <div class="filtros-titulo">
        <span class="filtros-label">Filtros activos (puedes cambiarlos):</span>
      </div>

      <div class="filtros-grid">
        <!-- Filtro Serie -->
        <div class="filtro-group">
          <label class="filtro-label">Serie:</label>
          <v-select
            :options="seriesDisponibles"
            v-model="filtroSerieLocal"
            placeholder="TODAS LAS SERIES"
            label="nombre"
            :reduce="serie => serie.valor"
            class="w-full filtro-select"
            @input="aplicarFiltros"
            clearable
          />
        </div>

        <!-- Filtro Área -->
        <div class="filtro-group">
          <label class="filtro-label">Área:</label>
          <v-select
            :options="areasDisponibles"
            v-model="filtroAreaLocal"
            placeholder="TODAS LAS ÁREAS"
            label="nombre"
            :reduce="area => area.valor"
            class="w-full filtro-select"
            @input="aplicarFiltros"
            clearable
          />
        </div>

        <!-- Botón limpiar filtros -->
        <div class="filtro-group filtro-boton" v-if="hayFiltrosActivos">
          <label class="filtro-label">&nbsp;</label>
          <vs-button
            color="warning"
            icon-pack="feather"
            icon="icon-x"
            size="small"
            @click="limpiarFiltros"
            class="btn-limpiar-filtro"
          >
            Limpiar
          </vs-button>
        </div>
      </div>

      <!-- Contador de libros disponibles -->
      <div class="contador-libros" v-if="librosFiltrados.length > 0">
        <small>{{ librosFiltrados.length }} libros disponibles</small>
      </div>
    </vs-col>

    <!-- Selector libro destino -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="selector-container">
      <label class="mb-2 font-bold">📚 Libro destino:</label>
      <v-select
        :options="librosFiltrados"
        class="mb-4 w-full max-w-md"
        placeholder="--Seleccione el libro destino--"
        v-model="libroSelecttranferir"
        label="nombrelibro"
        :reduce="libro => libro"
        ref="libroSelecttranferir"
        :class="classvalidar_libroSelecttranferir"
      />

      <!-- Mensaje cuando no hay libros disponibles -->
      <div v-if="librosFiltrados.length === 0" class="sin-libros-mensaje">
        No hay libros disponibles con los filtros seleccionados
      </div>
    </vs-col>

    <!-- Desde y Hacia visual elegante -->
    <vs-col v-if="libroOrigen && libroSelecttranferir" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="libro-info-card">
      <div class="card-transfer">
        <div class="libro-line">
          <span class="label">Desde</span>
          <span class="value">{{ libroOrigen.nombrelibro }}</span>
        </div>
        <div class="arrow">➡️</div>
        <div class="libro-line">
          <span class="label">Hacia</span>
          <span class="value">{{ libroSelecttranferir.nombrelibro }}</span>
        </div>
      </div>
    </vs-col>

    <!-- Botón -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-4 mb-4">
      <vs-button @click="libroSeleccionado" type="relief" color="primary" :disabled="!libroSelecttranferir">
        Transferir Planificaciones
      </vs-button>
    </vs-col>
  </vs-row>
</template>

<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      librosFiltrados: [],
      libroSelecttranferir: '',
      classvalidar_libroSelecttranferir: '',
      libroOrigen: null,
      filtroSerieLocal: null,
      filtroAreaLocal: null,
      filtroSeriePadre: null,
      filtroAreaPadre: null
    };
  },
  components: {
    "v-select": vSelect,
  },
  props: {
    libroSelect: {
      type: Object,
      default: function () {
        return {}
      }
    },
    arrayBooks: {
      type: Array,
      default: function () {
        return []
      }
    },
    bookSelect: {
      type: Number,
      default: 0
    },
    filtroSerie: {
      type: String,
      default: null
    },
    filtroArea: {
      type: String,
      default: null
    }
  },
  mounted() {
    let me = this;

    // Guardar los filtros del padre
    me.filtroSeriePadre = me.filtroSerie;
    me.filtroAreaPadre = me.filtroArea;

    // Inicializar los filtros locales con los valores del padre
    me.filtroSerieLocal = me.filtroSerie;
    me.filtroAreaLocal = me.filtroArea;

    // Obtener el libro origen
    me.libroOrigen = me.arrayBooks.find(book => book.asignatura_idasignatura === me.bookSelect) || null;

    // Aplicar filtros iniciales
    me.aplicarFiltros();
  },
  computed: {
    // Obtener series únicas para el filtro
    seriesDisponibles() {
      if (!this.arrayBooks || this.arrayBooks.length === 0) {
        return []
      }

      const seriesMap = new Map()
      this.arrayBooks.forEach(libro => {
        if (libro.nombre_serie && libro.nombre_serie !== 'null') {
          seriesMap.set(libro.nombre_serie, {
            nombre: libro.nombre_serie,
            valor: libro.nombre_serie
          })
        }
      })

      return Array.from(seriesMap.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
    },

    // Obtener áreas únicas para el filtro
    areasDisponibles() {
      if (!this.arrayBooks || this.arrayBooks.length === 0) {
        return []
      }

      const areasMap = new Map()
      this.arrayBooks.forEach(libro => {
        if (libro.nombrearea && libro.nombrearea !== 'null') {
          areasMap.set(libro.nombrearea, {
            nombre: libro.nombrearea,
            valor: libro.nombrearea
          })
        }
      })

      return Array.from(areasMap.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
    },

    // Verificar si hay filtros activos
    hayFiltrosActivos() {
      return this.filtroSerieLocal !== null || this.filtroAreaLocal !== null
    }
  },
  methods: {
    // Aplicar filtros a la lista de libros
    aplicarFiltros() {
      if (!this.arrayBooks || this.arrayBooks.length === 0) {
        this.librosFiltrados = []
        return
      }

      // Filtrar excluyendo el libro origen y aplicando filtros
      let filtrados = this.arrayBooks.filter(libro =>
        libro.asignatura_idasignatura !== this.bookSelect
      )

      // Aplicar filtro de serie si está seleccionado
      if (this.filtroSerieLocal) {
        filtrados = filtrados.filter(libro =>
          libro.nombre_serie === this.filtroSerieLocal
        )
      }

      // Aplicar filtro de área si está seleccionado
      if (this.filtroAreaLocal) {
        filtrados = filtrados.filter(libro =>
          libro.nombrearea === this.filtroAreaLocal
        )
      }

      this.librosFiltrados = filtrados

      // Si el libro seleccionado actual no está en los filtrados, limpiar selección
      if (this.libroSelecttranferir &&
          !filtrados.some(l => l.asignatura_idasignatura === this.libroSelecttranferir.asignatura_idasignatura)) {
        this.libroSelecttranferir = ''
      }
    },

    // Limpiar filtros
    limpiarFiltros() {
      this.filtroSerieLocal = null
      this.filtroAreaLocal = null
      this.aplicarFiltros()
    },

    // Restaurar filtros del padre
    restaurarFiltrosPadre() {
      this.filtroSerieLocal = this.filtroSeriePadre
      this.filtroAreaLocal = this.filtroAreaPadre
      this.aplicarFiltros()
    },

    validarcampo_buscar_libroSelecttranferir() {
      let me = this;
      const focus_libroSelecttranferir = me.$refs.libroSelecttranferir.$el.querySelector('input');
      focus_libroSelecttranferir.focus();
      me.classvalidar_libroSelecttranferir = 'stylevalidar';

      //Notificación de vacio
      me.$vs.notify({
        text: "Seleccione el libro que va a recibir la transferencia de planificaciones.",
        color: 'warning',
        iconPack: 'feather',
        icon: 'icon-alert-triangle',
        time: 8000,
      });

      // Quitar la clase después de la duración de la animación
      setTimeout(() => {
        me.classvalidar_libroSelecttranferir = '';
      }, 1500);
    },

    libroSeleccionado() {
      let me = this;

      if ((me.libroSelecttranferir == 'undefined') || (me.libroSelecttranferir == '') || (me.libroSelecttranferir == null)) {
        me.validarcampo_buscar_libroSelecttranferir();
        return;
      }

      let usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
      let user_created = usuarioLocal.idusuario;

      let datos = {
        "libro_a_transferir": me.bookSelect,
        "libro_recibir_transferencia": me.libroSelecttranferir.asignatura_idasignatura,
        "user_created": user_created
      }

      me.$vs.loading()

      this.$http.post(this.$server_url + 'transferenciaPlanificaciones', datos)
        .then(res => {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Planificaciones transferidas con éxito.',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          this.$emit('change', {
            verificacionemittransferencia: 1
          });
        })
        .catch(function () {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Las planificaciones no se pudieron transferir',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-x'
          })
        })
    }
  }
};
</script>

<style scoped>
.informacionformhijodehijo {
  z-index: 51002;
  position: fixed;
}

.stylevalidar {
  box-shadow: 0px 0px 2px 4px #ff0000;
  border-radius: 5px;
}

.popup-content {
  width: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

/* Estilos para los filtros */
.filtros-container {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.filtros-titulo {
  margin-bottom: 12px;
}

.filtros-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filtros-grid {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filtro-group {
  flex: 1;
  min-width: 200px;
}

.filtro-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #334155;
  font-size: 13px;
}

.filtro-boton {
  flex: 0 0 auto;
  min-width: auto;
}

.btn-limpiar-filtro {
  margin: 0;
  white-space: nowrap;
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.btn-limpiar-filtro:hover {
  background-color: #d97706;
}

.contador-libros {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed #cbd5e1;
  color: #64748b;
  font-style: italic;
  text-align: right;
}

.selector-container {
  margin-top: 8px;
}

.sin-libros-mensaje {
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  font-weight: 500;
}

.info-box {
  background-color: #ffffff;
  border-radius: 14px;
  padding: 28px 32px;
  max-width: 560px;
  margin: 0 auto 24px auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2e3a59;
  text-align: center;
  user-select: none;
}

.info-title {
  font-weight: 700;
  font-size: 1.55rem;
  margin-bottom: 18px;
  color: #1f2a47;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.info-description {
  font-size: 1.125rem;
  line-height: 1.55;
  color: #4a5678;
  margin-bottom: 0;
}

.libro-info-card {
  margin-top: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.card-transfer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8fafc;
  border-radius: 14px;
  padding: 20px 28px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  font-size: 1.125rem;
  font-weight: 500;
  max-width: 500px;
  width: 100%;
  gap: 20px;
  text-align: center;
}

.libro-line {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.label {
  font-weight: 700;
  color: #2563eb;
  font-size: 0.95rem;
}

.value {
  color: #334155;
  font-weight: 600;
}

.arrow {
  font-size: 1.5rem;
  color: #64748b;
}

.v-select {
  max-width: 480px;
  width: 100%;
  margin-bottom: 12px;
}

.vs-col label.font-bold {
  font-weight: 700;
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 8px;
  display: inline-block;
}

.vs-button {
  min-width: 180px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  padding: 10px 24px;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  transition: background-color 0.3s ease;
}

.vs-button[type='relief'][color='primary']:hover:not(:disabled) {
  background-color: #2563eb;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.5);
  cursor: pointer;
}

.vs-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .info-box {
    padding: 20px 18px;
    max-width: 100%;
  }

  .card-transfer {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
  }

  .arrow {
    transform: rotate(90deg);
  }

  .vs-button {
    width: 100%;
    min-width: auto;
  }

  .filtros-grid {
    flex-direction: column;
    gap: 10px;
  }

  .filtro-group {
    width: 100%;
  }

  .btn-limpiar-filtro {
    width: 100%;
  }
}
</style>
