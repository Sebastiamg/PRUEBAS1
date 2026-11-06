<!--
=========================================================================================
  Componente: PerseoTablaAvanzada
  Descripción: Tabla avanzada reutilizable con búsqueda, filtros, ordenamiento y paginación
=========================================================================================

PROPS:
  - datos: Array de objetos con los datos a mostrar
  - columnas: Array de objetos con configuración de columnas
      Ej: { label: 'Nombre', field: 'nombre', width: '200px', sortable: true, filtrable: true }
  - seleccionable: Boolean - Muestra checkboxes para selección múltiple
  - mostrar-acciones: Boolean - Muestra columna de acciones (requiere slot #acciones)
  - fila-clickeable: Boolean - Las filas son clickeables
  - items-por-pagina-inicial: Number - Items por página por defecto

EVENTOS:
  - seleccion-cambiada: Emite array de filas seleccionadas

SLOTS:
  - #acciones="{ row, index }" - Slot para botones de acción en cada fila
  - #column-{field}="{ row, value }" - Slot personalizado para cualquier columna

=========================================================================================
EJEMPLO DE USO:
=========================================================================================

<perseo-tabla-avanzada
  :datos="arrayDatos"
  :columnas="[
    { label: 'ID', field: 'id', width: '80px', sortable: true, filtrable: true },
    { label: 'Nombre', field: 'nombre', sortable: true, filtrable: true }
  ]"
  :seleccionable="true"
  :mostrar-acciones="true"
  @seleccion-cambiada="handleSeleccion"
>
  <template #acciones="{ row }">
    <button @click="editar(row)">Editar</button>
    <button @click="eliminar(row)">Eliminar</button>
  </template>
</perseo-tabla-avanzada>

=========================================================================================
-->

<template>
  <div class="perseo-tabla-container">
    <!-- Header con búsqueda y controles -->
    <div class="tabla-header">
      <div class="header-left">
        <div class="chip-info">
          <i class="fa-solid fa-database"></i>
          <span>Total de registros: <strong>{{ datosFiltrados.length }}</strong> / {{ datos.length }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input
            v-model="busquedaGlobal"
            type="text"
            placeholder="Buscar en todos los campos..."
            class="search-input"
          />
          <i
            v-if="busquedaGlobal"
            class="fa-solid fa-times clear-icon"
            @click="busquedaGlobal = ''"
          ></i>
        </div>
        <div class="items-per-page">
          <label>Mostrar:</label>
          <select v-model.number="itemsPorPagina">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="datos.length">Todos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="tabla-wrapper">
      <table class="perseo-tabla">
        <thead>
          <tr>
            <!-- Checkbox para seleccionar todos -->
            <th v-if="seleccionable" class="col-checkbox">
              <input
                type="checkbox"
                :checked="todoSeleccionado"
                @change="toggleSeleccionarTodos"
              />
            </th>

            <!-- Columnas dinámicas -->
            <th
              v-for="(columna, index) in columnas"
              :key="index"
              :style="{ width: columna.width || 'auto' }"
              :class="{ 'sortable': columna.sortable !== false }"
              @click="columna.sortable !== false && ordenarPor(columna.field)"
            >
              <div class="th-content">
                <span class="th-label">{{ columna.label }}</span>
                <div class="th-icons">
                  <i
                    v-if="columna.sortable !== false"
                    class="fa-solid sort-icon"
                    :class="{
                      'fa-sort': ordenColumna !== columna.field,
                      'fa-sort-up': ordenColumna === columna.field && ordenDireccion === 'asc',
                      'fa-sort-down': ordenColumna === columna.field && ordenDireccion === 'desc'
                    }"
                  ></i>
                  <i
                    v-if="columna.filtrable !== false"
                    class="fa-solid fa-filter filter-icon"
                    :class="{ 'active': filtrosPorColumna[columna.field] }"
                    @click.stop="toggleFiltroColumna(columna.field)"
                  ></i>
                </div>
              </div>
            </th>

            <!-- Columna de acciones -->
            <th v-if="mostrarAcciones && $scopedSlots.acciones" class="col-acciones">
              Acciones
            </th>
          </tr>

          <!-- Fila de filtros -->
          <tr class="filter-row">
            <!-- Celda vacía para checkbox -->
            <th v-if="seleccionable" class="filter-cell"></th>

            <!-- Filtros por columna -->
            <th
              v-for="(columna, index) in columnas"
              :key="`filter-${index}`"
              class="filter-cell"
            >
              <div v-if="filtrosVisibles[columna.field] && columna.filtrable !== false" class="filter-wrapper">
                <input
                  v-model="filtrosPorColumna[columna.field]"
                  type="text"
                  :placeholder="`Filtrar ${columna.label}...`"
                  class="filter-input"
                  @keyup.enter="filtrosVisibles[columna.field] = false"
                  @click.stop
                />
                <i
                  class="fa-solid fa-times close-filter-icon"
                  @click="cerrarFiltroColumna(columna.field)"
                ></i>
              </div>
            </th>

            <!-- Celda vacía para acciones -->
            <th v-if="mostrarAcciones && $scopedSlots.acciones" class="filter-cell"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, index) in datosPaginados"
            :key="index"
            :class="{ 'selected': filasSeleccionadas.includes(fila) }"
            @click="filaClickeable && seleccionarFila(fila)"
          >
            <!-- Checkbox de selección -->
            <td v-if="seleccionable" class="col-checkbox">
              <input
                type="checkbox"
                :checked="filasSeleccionadas.includes(fila)"
                @change="toggleSeleccionFila(fila)"
                @click.stop
              />
            </td>

            <!-- Celdas dinámicas -->
            <td
              v-for="(columna, colIndex) in columnas"
              :key="colIndex"
              :class="columna.tdClass"
            >
              <slot
                :name="`column-${columna.field}`"
                :row="fila"
                :value="obtenerValorCelda(fila, columna.field)"
              >
                {{ formatearValor(fila, columna) }}
              </slot>
            </td>

            <!-- Celda de acciones -->
            <td v-if="mostrarAcciones && $scopedSlots.acciones" class="col-acciones">
              <slot name="acciones" :row="fila" :index="index"></slot>
            </td>
          </tr>

          <!-- Mensaje cuando no hay datos -->
          <tr v-if="datosFiltrados.length === 0">
            <td :colspan="totalColumnas" class="no-data">
              <i class="fa-solid fa-inbox"></i>
              <p>No se encontraron registros</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="tabla-footer" v-if="datosFiltrados.length > 0">
      <div class="footer-info">
        Mostrando {{ rangoInicio }} - {{ rangoFin }} de {{ datosFiltrados.length }} registros
        <span v-if="filasSeleccionadas.length > 0" class="selected-info">
          ({{ filasSeleccionadas.length }} seleccionados)
        </span>
      </div>
      <div class="pagination">
        <button
          class="page-btn"
          :disabled="paginaActual === 1"
          @click="irAPagina(1)"
        >
          <i class="fa-solid fa-angles-left"></i>
        </button>
        <button
          class="page-btn"
          :disabled="paginaActual === 1"
          @click="irAPagina(paginaActual - 1)"
        >
          <i class="fa-solid fa-angle-left"></i>
        </button>

        <button
          v-for="pagina in paginasVisibles"
          :key="pagina"
          class="page-btn"
          :class="{ 'active': pagina === paginaActual }"
          @click="irAPagina(pagina)"
        >
          {{ pagina }}
        </button>

        <button
          class="page-btn"
          :disabled="paginaActual === totalPaginas"
          @click="irAPagina(paginaActual + 1)"
        >
          <i class="fa-solid fa-angle-right"></i>
        </button>
        <button
          class="page-btn"
          :disabled="paginaActual === totalPaginas"
          @click="irAPagina(totalPaginas)"
        >
          <i class="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerseoTablaAvanzada',
  props: {
    datos: {
      type: Array,
      required: true,
      default: () => []
    },
    columnas: {
      type: Array,
      required: true,
      default: () => []
    },
    seleccionable: {
      type: Boolean,
      default: false
    },
    mostrarAcciones: {
      type: Boolean,
      default: false
    },
    filaClickeable: {
      type: Boolean,
      default: false
    },
    itemsPorPaginaInicial: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      busquedaGlobal: '',
      filtrosPorColumna: {},
      filtrosVisibles: {},
      ordenColumna: null,
      ordenDireccion: 'asc',
      paginaActual: 1,
      itemsPorPagina: this.itemsPorPaginaInicial,
      filasSeleccionadas: []
    };
  },
  computed: {
    datosFiltrados() {
      let resultado = [...this.datos];

      // Búsqueda global
      if (this.busquedaGlobal) {
        const busqueda = this.busquedaGlobal.toLowerCase();
        resultado = resultado.filter(fila => {
          return this.columnas.some(columna => {
            const valor = this.obtenerValorCelda(fila, columna.field);
            return String(valor).toLowerCase().includes(busqueda);
          });
        });
      }

      // Filtros por columna
      Object.keys(this.filtrosPorColumna).forEach(field => {
        const filtro = this.filtrosPorColumna[field];
        if (filtro) {
          const filtroLower = filtro.toLowerCase();
          resultado = resultado.filter(fila => {
            const valor = this.obtenerValorCelda(fila, field);
            return String(valor).toLowerCase().includes(filtroLower);
          });
        }
      });

      // Ordenamiento
      if (this.ordenColumna) {
        resultado.sort((a, b) => {
          const valorA = this.obtenerValorCelda(a, this.ordenColumna);
          const valorB = this.obtenerValorCelda(b, this.ordenColumna);

          let comparacion = 0;
          if (valorA > valorB) comparacion = 1;
          if (valorA < valorB) comparacion = -1;

          return this.ordenDireccion === 'asc' ? comparacion : -comparacion;
        });
      }

      return resultado;
    },
    totalPaginas() {
      return Math.ceil(this.datosFiltrados.length / this.itemsPorPagina);
    },
    datosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.datosFiltrados.slice(inicio, fin);
    },
    rangoInicio() {
      return ((this.paginaActual - 1) * this.itemsPorPagina) + 1;
    },
    rangoFin() {
      const fin = this.paginaActual * this.itemsPorPagina;
      return fin > this.datosFiltrados.length ? this.datosFiltrados.length : fin;
    },
    paginasVisibles() {
      const paginas = [];
      const maxVisible = 5;
      let inicio = Math.max(1, this.paginaActual - Math.floor(maxVisible / 2));
      let fin = Math.min(this.totalPaginas, inicio + maxVisible - 1);

      if (fin - inicio < maxVisible - 1) {
        inicio = Math.max(1, fin - maxVisible + 1);
      }

      for (let i = inicio; i <= fin; i++) {
        paginas.push(i);
      }
      return paginas;
    },
    todoSeleccionado() {
      return this.datosPaginados.length > 0 &&
             this.datosPaginados.every(fila => this.filasSeleccionadas.includes(fila));
    },
    totalColumnas() {
      let total = this.columnas.length;
      if (this.seleccionable) total++;
      if (this.mostrarAcciones && this.$scopedSlots.acciones) total++;
      return total;
    }
  },
  watch: {
    datosFiltrados() {
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = 1;
      }
    }
  },
  methods: {
    obtenerValorCelda(fila, field) {
      return field.split('.').reduce((obj, key) => (obj && obj[key]) ? obj[key] : undefined, fila);
    },
    formatearValor(fila, columna) {
      const valor = this.obtenerValorCelda(fila, columna.field);
      if (columna.format && typeof columna.format === 'function') {
        return columna.format(valor, fila);
      }
      return valor;
    },
    ordenarPor(field) {
      if (this.ordenColumna === field) {
        this.ordenDireccion = this.ordenDireccion === 'asc' ? 'desc' : 'asc';
      } else {
        this.ordenColumna = field;
        this.ordenDireccion = 'asc';
      }
    },
    toggleFiltroColumna(field) {
      this.$set(this.filtrosVisibles, field, !this.filtrosVisibles[field]);
    },
    cerrarFiltroColumna(field) {
      this.$set(this.filtrosPorColumna, field, '');
      this.$set(this.filtrosVisibles, field, false);
    },
    irAPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina;
      }
    },
    seleccionarFila(fila) {
      if (!this.seleccionable) return;
      this.toggleSeleccionFila(fila);
    },
    toggleSeleccionFila(fila) {
      const index = this.filasSeleccionadas.indexOf(fila);
      if (index > -1) {
        this.filasSeleccionadas.splice(index, 1);
      } else {
        this.filasSeleccionadas.push(fila);
      }
      this.$emit('seleccion-cambiada', this.filasSeleccionadas);
    },
    toggleSeleccionarTodos() {
      if (this.todoSeleccionado) {
        this.datosPaginados.forEach(fila => {
          const index = this.filasSeleccionadas.indexOf(fila);
          if (index > -1) this.filasSeleccionadas.splice(index, 1);
        });
      } else {
        this.datosPaginados.forEach(fila => {
          if (!this.filasSeleccionadas.includes(fila)) {
            this.filasSeleccionadas.push(fila);
          }
        });
      }
      this.$emit('seleccion-cambiada', this.filasSeleccionadas);
    },
    limpiarSeleccion() {
      this.filasSeleccionadas = [];
      this.$emit('seleccion-cambiada', this.filasSeleccionadas);
    }
  }
}
</script>

<style lang="scss" scoped>
.perseo-tabla-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chip-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1e3c72;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;

  i {
    font-size: 0.9rem;
  }

  strong {
    font-weight: 700;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;

  i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    font-size: 0.9rem;

    &.fa-search {
      left: 12px;
    }

    &.clear-icon {
      right: 12px;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: #dc3545;
      }
    }
  }
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.5rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #1e3c72;
    box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
  }
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-size: 0.85rem;
    color: #495057;
    font-weight: 500;
  }

  select {
    padding: 0.5rem 0.75rem;
    border: 2px solid #dee2e6;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #1e3c72;
    }
  }
}

.tabla-wrapper {
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
}

.perseo-tabla {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #f1f3f5;

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.85rem;
      color: #2c3e50;
      border-bottom: 2px solid #dee2e6;
      border-right: 1px solid #dee2e6;
      background: #f1f3f5;
      user-select: none;
      position: relative;

      &:last-child {
        border-right: none;
      }

      &.sortable {
        cursor: pointer;

        &:hover {
          background: #e9ecef;
        }
      }

      &.col-checkbox {
        width: 50px;
        text-align: center;
      }

      &.col-acciones {
        width: 120px;
        text-align: center;
      }
    }
  }

  tbody {
    tr {
      transition: all 0.2s;
      border-bottom: 2px solid #e9ecef;

      &:hover {
        background: #f8f9fa;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      &.selected {
        background: #e3f2fd;
        border-left: 4px solid #1e3c72;
      }

      td {
        padding: 0.9rem 1rem;
        font-size: 0.9rem;
        color: #495057;
        border-right: 1px solid #f1f3f5;
        border-bottom: 1px solid #e9ecef;

        &:last-child {
          border-right: none;
        }

        &.col-checkbox {
          text-align: center;
        }

        &.col-acciones {
          text-align: center;
        }

        &.no-data {
          text-align: center;
          padding: 3rem;
          color: #6c757d;

          i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.3;
          }

          p {
            margin: 0;
            font-size: 1rem;
          }
        }
      }
    }
  }
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.th-label {
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.th-icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  font-size: 0.75rem;
  color: #adb5bd;
  transition: color 0.2s;

  &.fa-sort-up,
  &.fa-sort-down {
    color: #1e3c72;
  }
}

.filter-icon {
  font-size: 0.75rem;
  color: #adb5bd;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: rgba(30, 60, 114, 0.1);
    color: #1e3c72;
  }

  &.active {
    color: #1e3c72;
    background: rgba(30, 60, 114, 0.15);
  }
}

.filter-row {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;

  .filter-cell {
    padding: 0.5rem 1rem;
    border-bottom: none;
  }
}

.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #1e3c72;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
}

.filter-input {
  flex: 1;
//   padding: 0.4rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
}

.close-filter-icon {
  cursor: pointer;
  color: #6c757d;
  font-size: 0.75rem;
  transition: color 0.2s;
  padding: 0.25rem;

  &:hover {
    color: #dc3545;
  }
}

.tabla-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 2px solid #e9ecef;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-info {
  font-size: 0.85rem;
  color: #495057;

  .selected-info {
    color: #1e3c72;
    font-weight: 600;
  }
}

.pagination {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  min-width: 36px;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #1e3c72;
    color: #1e3c72;
  }

  &.active {
    background: #1e3c72;
    color: white;
    border-color: #1e3c72;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  i {
    font-size: 0.75rem;
  }
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1e3c72;
}

@media (max-width: 768px) {
  .tabla-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-right {
    flex-direction: column;
    max-width: 100%;
  }

  .search-box {
    max-width: 100%;
  }

  .tabla-footer {
    flex-direction: column;
    text-align: center;
  }

  .pagination {
    justify-content: center;
  }
}
</style>
