<template>
  <div class="vx-col w-full">
    <!-- Información del usuario -->
    <vs-list>
      <vs-list-item title="Institución" :subtitle="usuarioSelect.nombreInstitucion"></vs-list-item>
      <vs-list-item v-if="periodo.periodo_id > 0" title="Período" :subtitle="periodo.descripcion">
        <vs-chip v-if="periodo.estado == 1" color="success">Activo</vs-chip>
        <vs-chip v-else color="danger">Desactivado</vs-chip>
      </vs-list-item>
      <vs-list-item title="Nombre" :subtitle="usuarioSelect.nombres + ' ' + usuarioSelect.apellidos"></vs-list-item>
      <vs-list-item title="Email" :subtitle="usuarioSelect.name_usuario"></vs-list-item>
      <vs-list-item title="Cédula" :subtitle="usuarioSelect.cedula"></vs-list-item>
    </vs-list>

    <!-- Asignaturas seleccionadas -->
    <div class="section-header">
      <div class="section-title">
        <vs-divider color="success">
          <h3 class="section-title-text">Asignaturas seleccionadas <span class="badge-count">{{ seleccionadas.length }}</span></h3>
        </vs-divider>
      </div>
    </div>

    <div class="toggle-section card-elegant">
      <div class="toggle-header elegant-header" @click="toggleAsignaturas = !toggleAsignaturas">
        <div class="toggle-title">
          <span class="feather icon-book mr-2"></span>
          <strong>Lista de asignaturas asignadas</strong>
          <!-- <span class="ml-2 badge-light">{{ seleccionadas.length }}</span> -->
        </div>
        <div class="toggle-icon-wrapper">
          <span class="feather chevron-icon" :class="toggleAsignaturas ? 'icon-chevron-up' : 'icon-chevron-down'"></span>
        </div>
      </div>

      <div class="toggle-content elegant-content" v-show="toggleAsignaturas">
        <!-- Acciones globales -->
        <div class="global-actions" v-if="seleccionadas.length > 1">
          <div class="action-buttons">
            <vs-button type="flat" color="danger" icon-pack="feather" icon="icon-trash-2"
              @click="opConfirmarQuitar = true; opConfirmarMover = false">
              Quitar todas
            </vs-button>
            <vs-button type="flat" color="primary" icon-pack="feather" icon="icon-refresh-cw"
              @click="opConfirmarMover = true; opConfirmarQuitar = false" class="ml-2">
              Mover a período actual
            </vs-button>
          </div>
        </div>

        <!-- Confirmaciones -->
        <transition name="slide-fade">
          <div v-if="opConfirmarQuitar" class="confirmation-card danger-card">
            <div class="confirmation-content">
              <vs-alert color="danger" icon-pack="feather" icon="icon-alert-triangle">
                <h4 class="alert-title">¿Seguro desea QUITAR todas las asignaturas?</h4>
                <p>Esta acción eliminará todas las asignaturas asignadas a {{ usuarioSelect.nombres }} {{ usuarioSelect.apellidos }}</p>
              </vs-alert>
              <div class="confirmation-actions mt-4">
                <vs-button color="danger" icon-pack="feather" icon="icon-trash" @click="f_quitarTodo()">
                  Sí, quitar todas
                </vs-button>
                <vs-button color="dark" type="flat" @click="opConfirmarQuitar = false" class="ml-2">
                  Cancelar
                </vs-button>
              </div>
            </div>
          </div>
        </transition>

        <transition name="slide-fade">
          <div v-if="opConfirmarMover" class="confirmation-card primary-card">
            <div class="confirmation-content">
              <vs-alert color="primary" icon-pack="feather" icon="icon-refresh-cw">
                <h4 class="alert-title">¿Desea MOVER todas las asignaturas?</h4>
                <p>Moverá todas las asignaturas de {{ usuarioSelect.nombres }} {{ usuarioSelect.apellidos }} al período {{ periodo.descripcion }}</p>
              </vs-alert>
              <div class="confirmation-actions mt-4">
                <vs-button color="primary" icon-pack="feather" icon="icon-check" @click="moverPeriodoActual()">
                  Sí, mover a {{ periodo.descripcion }}
                </vs-button>
                <vs-button color="dark" type="flat" @click="opConfirmarMover = false" class="ml-2">
                  Cancelar
                </vs-button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Grid de asignaturas -->
        <div v-if="seleccionadas.length > 0" class="asignaturas-grid mt-6">
          <div v-for="(item, index) in seleccionadas" :key="index" class="asignatura-card">
            <!-- Encabezado del card -->
            <div class="card-header">
              <div class="card-number">
                <span class="numero">{{ index + 1 }}</span>
              </div>
              <div class="card-actions">
                <vs-button @click="eliminaAsignacion(item)" size="small" color="danger" type="border"
                  icon-pack="feather" icon="icon-trash" circle></vs-button>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="card-body">
              <div class="asignatura-info">
                <h4 class="asignatura-title">{{ item.nombreasignatura }}</h4>
                <div class="asignatura-meta">
                  <span class="meta-item">
                    <span class="feather icon-calendar mr-1"></span>
                    {{ item.periodoescolar }}
                  </span>
                  <span class="meta-item">
                    <span class="feather icon-clock mr-1"></span>
                    {{ formatDate(item.updated_at) }}
                  </span>
                </div>
              </div>

              <!-- Unidades asignadas -->
              <div v-if="item.tiene_unidades_asignadas && item.detalles_unidades_guardadas && item.detalles_unidades_guardadas.length > 0"
                class="unidades-asignadas-section">
                <div class="section-title-small">
                  <span class="feather icon-check-circle text-success mr-2"></span>
                  <span class="text-success font-semibold">{{ item.total_unidades_asignadas }} unidad(es) asignada(s)</span>
                </div>
                <div class="unidades-list">
                  <div v-for="(unidad, idx) in item.detalles_unidades_guardadas" :key="idx" class="unidad-item">
                    <span class="feather icon-check mr-2 text-xs"></span>
                    <span class="unidad-text">{{ unidad.label_unidad }}</span>
                  </div>
                </div>
              </div>

              <!-- Botón para gestionar unidades -->
              <div class="unidades-action">
                <vs-button :color="item.mostrandoUnidades ? 'dark' : 'primary'"
                  :icon="item.mostrandoUnidades ? 'icon-eye-off' : 'icon-activity'"
                  icon-pack="feather" type="border" class="w-full" size="small"
                  @click="toggleUnidades(item, index)">
                  {{ item.mostrandoUnidades ? 'Ocultar unidades' : 'Gestionar unidades' }}
                </vs-button>
              </div>

              <!-- Sección de gestión de unidades -->
              <div v-if="item.mostrandoUnidades" class="gestion-unidades">
                <!-- Estados de carga -->
                <div v-if="item.cargandoUnidades" class="loading-state">
                  <vs-progress indeterminate color="primary"></vs-progress>
                  <p class="loading-text">Cargando unidades...</p>
                </div>

                <div v-else-if="item.errorCargaUnidades" class="error-state">
                  <div class="error-content">
                    <span class="feather icon-alert-octagon text-danger mr-2"></span>
                    <span class="text-danger">Error al cargar las unidades</span>
                  </div>
                  <vs-button size="small" type="flat" color="dark" @click="toggleUnidades(item, index)">
                    Reintentar
                  </vs-button>
                </div>

                <!-- Selector de unidades -->
                <div v-else-if="item.unidadesDisponibles" class="selector-unidades">
                  <v-select :options="item.unidadesDisponibles" :reduce="unidad => unidad.id"
                    label="label_unidad" v-model="item.unidadesSeleccionadas"
                    class="custom-select mb-4" placeholder="Seleccionar unidades..." multiple>
                    <template #header>
                      <div class="select-header">
                        <span class="feather icon-layers mr-2"></span>
                        <span>Total unidades disponibles: {{ item.unidadesDisponibles.length }}</span>
                      </div>
                    </template>
                  </v-select>

                  <!-- Botón de guardar -->
                  <vs-button v-if="mostrarBotonGuardar(item)" @click="guardarUnidades(item)"
                    :color="getColorBoton(item)" size="small" class="mt-2 w-full"
                    :disabled="estaDeshabilitadoGuardar(item)" :icon="getIconoBoton(item)" icon-pack="feather">
                    {{ getTextoBoton(item) }}
                  </vs-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
          <div class="empty-content">
            <span class="feather icon-book-open empty-icon"></span>
            <h4 class="empty-title">No hay asignaturas asignadas</h4>
            <p class="empty-description">Selecciona asignaturas de las áreas o series disponibles</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones para ordenar -->
    <div class="filters-section">
      <vs-divider>
        <div class="filter-title">Ordenar por</div>
      </vs-divider>
      <div class="filter-buttons">
        <vs-button :type="xSeries ? 'gradient' : 'border'" :color="xSeries ? 'success' : 'dark'"
          icon-pack="feather" :icon="xSeries ? 'icon-check' : 'icon-grid'"
          @click="activar('series')" class="filter-btn">
          Series
        </vs-button>
        <vs-button :type="xAreas ? 'gradient' : 'border'" :color="xAreas ? 'success' : 'dark'"
          icon-pack="feather" :icon="xAreas ? 'icon-check' : 'icon-layers'"
          @click="activar('areas')" class="filter-btn ml-2">
          Áreas
        </vs-button>
      </div>
    </div>

    <div class="vx-col sm:w-full text-right mb-4">
      <vs-button type="border" color="primary" size="medium" @click="reloadAreas()"
      icon-pack="feather" icon="icon-refresh-cw">
      Recargar libros
    </vs-button>
  </div>
  <!-- VERSIÓN 1 - AGRUPADO POR ÁREAS -->
    <div v-if="xAreas" class="m-2">
      <vs-divider color="primary">Áreas ( {{ area.length }} )</vs-divider>

      <!-- Lista de áreas con toggles -->
      <div class="areas-list mt-3">
        <div class="area-item" v-for="(listItem, areaIndex) in area" :key="listItem.id || areaIndex">
          <!-- Cabecera del área -->
          <div class="toggle-header area-header elegant-area-header" @click="toggleArea(areaIndex)">
            <div class="toggle-title area-title">
              <span class="feather icon-folder mr-2"></span>
              {{ listItem.name }}
            </div>
            <div class="toggle-icon-wrapper area-meta">
              <span class="badge-light">{{ countChildren(listItem) }} libros</span>
              <span class="feather chevron-icon ml-3"
                :class="openAreas[areaIndex] ? 'icon-chevron-down' : 'icon-chevron-right'"></span>
            </div>
          </div>

          <!-- Contenido del área -->
          <div class="toggle-content area-body" v-show="openAreas[areaIndex]">
            <template v-if="Object.keys(groupBySerie(listItem.children)).length > 1">
              <div v-for="(itemsSerie, serieName) in groupBySerie(listItem.children)"
                :key="serieName || '__sin_serie__'" class="serie-block mb-3">
                <div class="toggle-header serie-header elegant-serie-header" @click="toggleSerieEnArea(areaIndex, serieName)">
                  <div class="toggle-title serie-title">
                    <span class="feather icon-book mr-2"></span>
                    {{ serieName || 'Sin serie' }}
                    <small class="serie-count">({{ itemsSerie.length }})</small>
                  </div>
                  <div class="toggle-icon-wrapper">
                    <span class="feather chevron-icon"
                      :class="getSerieOpenState(areaIndex, serieName) ? 'icon-chevron-down' : 'icon-chevron-right'"></span>
                  </div>
                </div>
                <transition name="slide-fade">
                  <div v-show="getSerieOpenState(areaIndex, serieName)" class="toggle-content serie-content pt-2 px-2">
                    <div class="libros-grid">
                      <vs-button v-for="(asig, i) in itemsSerie" :key="asig.id || i" type="border" color="primary"
                        class="libro-btn" @click="agregaAsignacion(asig)" icon-pack="feather" icon="icon-plus">
                        {{ asig.name }}
                      </vs-button>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else>
              <div class="libros-grid">
                <vs-button v-for="(asig, i) in listItem.children" :key="asig.id || i" type="border" color="primary"
                  class="libro-btn" @click="agregaAsignacion(asig)" icon-pack="feather" icon="icon-plus">
                  {{ asig.name }}
                </vs-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- VERSIÓN 2 - AGRUPADO POR SERIES -->
    <div v-if="xSeries" class="m-2">
      <vs-divider color="primary">Series</vs-divider>

      <div v-for="(areasPorSerie, serieName) in groupBySerieArea(area)" :key="serieName" class="mb-4">
        <!-- Cabecera de serie -->
        <div class="toggle-header elegant-serie-main-header" @click="toggleSerieGlobal(serieName)">
          <div class="toggle-title">
            <span class="feather icon-book mr-2"></span>
            <strong>{{ serieName }}</strong>
            <span class="ml-2 badge-light">{{ countItemsInSerie(areasPorSerie) }} libros</span>
          </div>
          <div class="toggle-icon-wrapper">
            <span class="feather chevron-icon"
              :class="openSeriesGlobal[serieName] ? 'icon-chevron-down' : 'icon-chevron-right'"></span>
          </div>
        </div>

        <!-- Contenido de la serie -->
        <div class="toggle-content" v-show="openSeriesGlobal[serieName]">
          <!-- Áreas dentro de la serie -->
          <div v-for="(libros, areaName) in areasPorSerie" :key="areaName" class="mb-3 pl-3">
            <!-- Cabecera de área dentro de serie -->
            <div class="toggle-header sub-toggle-header elegant-sub-header" @click="toggleAreaEnSerie(serieName, areaName)">
              <div class="toggle-title">
                <span class="feather icon-folder mr-2"></span>
                {{ areaName }}
                <span class="ml-2 badge-light">{{ libros.length }} libros</span>
              </div>
              <div class="toggle-icon-wrapper">
                <span class="feather chevron-icon"
                  :class="getAreaInSerieOpenState(serieName, areaName) ? 'icon-chevron-down' : 'icon-chevron-right'"></span>
              </div>
            </div>

            <!-- Lista de libros -->
            <div class="toggle-content" v-show="getAreaInSerieOpenState(serieName, areaName)">
              <div class="libros-grid">
                <vs-button v-for="(libro, i) in libros" :key="libro.id || i" type="border" color="primary" class="libro-btn"
                  @click="agregaAsignacion(libro)" icon-pack="feather" icon="icon-plus">
                  {{ libro.name }}
                </vs-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'

export default {
  props: {
    usuarioSelect: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      seleccionadas: [],
      user_seleccionado: '',
      periodo: {},
      area: [],
      opConfirmarQuitar: false,
      opConfirmarMover: false,
      areasTemp: [],

      // Estados para toggles
      toggleAsignaturas: true,
      openAreas: {},           // { [areaIndex]: boolean }
      openSeriesInArea: {},    // { [areaIndex]: { [serieName]: boolean } }
      openSeriesGlobal: {},    // { [serieName]: boolean }
      openAreasInSeries: {},   // { [serieName]: { [areaName]: boolean } }

      xAreas: false,
      xSeries: true,
      listUnidadesLibro: [],
      unidadSelected: {}
    }
  },
  components: {
    'v-select': vSelect
  },
  mounted() {
    let me = this
    me.user_seleccionado = me.usuarioSelect.idusuario
    me.getPeriodo()
    me.getAreaSelect()
  },
  methods: {
    // ========== MÉTODOS DE ORDENAMIENTO ==========
    activar(tipo) {
      this.xAreas = tipo === 'areas'
      this.xSeries = tipo === 'series'
    },

    // ========== MÉTODOS DE TOGGLE UNIFICADOS ==========
    toggleArea(areaIndex) {
      this.$set(this.openAreas, areaIndex, !this.openAreas[areaIndex])
    },

    toggleSerieEnArea(areaIndex, serieName) {
      if (!this.openSeriesInArea[areaIndex]) {
        this.$set(this.openSeriesInArea, areaIndex, {})
      }
      this.$set(this.openSeriesInArea[areaIndex], serieName,
        !this.openSeriesInArea[areaIndex][serieName])
    },

    getSerieOpenState(areaIndex, serieName) {
      return !!(this.openSeriesInArea[areaIndex] &&
        this.openSeriesInArea[areaIndex][serieName])
    },

    toggleSerieGlobal(serieName) {
      this.$set(this.openSeriesGlobal, serieName, !this.openSeriesGlobal[serieName])
    },

    toggleAreaEnSerie(serieName, areaName) {
      if (!this.openAreasInSeries[serieName]) {
        this.$set(this.openAreasInSeries, serieName, {})
      }
      this.$set(this.openAreasInSeries[serieName], areaName,
        !this.openAreasInSeries[serieName][areaName])
    },

    getAreaInSerieOpenState(serieName, areaName) {
      return !!(this.openAreasInSeries[serieName] &&
        this.openAreasInSeries[serieName][areaName])
    },

    // ========== MÉTODOS DE AGRUPACIÓN ==========
    groupBySerie(children = []) {
      const grupos = {}
        ; (children || []).forEach(item => {
          const serie = item.nombre_serie || 'Sin serie'
          if (!grupos[serie]) grupos[serie] = []
          grupos[serie].push(item)
        })
      return grupos
    },

    groupBySerieArea(areas = []) {
      const salida = {}
      areas.forEach(area => {
        ; (area.children || []).forEach(item => {
          const serie = item.nombre_serie || 'Sin serie'
          if (!salida[serie]) salida[serie] = {}
          if (!salida[serie][area.name]) salida[serie][area.name] = []
          salida[serie][area.name].push(item)
        })
      })
      return salida
    },

    // ========== HELPERS ==========
    countChildren(areaItem) {
      return (areaItem.children && areaItem.children.length) || 0
    },

    countItemsInSerie(areasPorSerie) {
      return Object.values(areasPorSerie).reduce((total, libros) => total + libros.length, 0)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    getIconoBoton(item) {
      if (item.unidadesSeleccionadas && item.unidadesSeleccionadas.length > 0) {
        return 'icon-save'
      } else if (item.unidadesGuardadas && item.unidadesGuardadas.length > 0) {
        return 'icon-trash-2'
      }
      return 'icon-save'
    },

    // ========== MÉTODOS DE DATOS ==========
    getPeriodo() {
      let me = this
      me.$vs && me.$vs.loading && me.$vs.loading()

      this.$http.get(this.$server_url + "institucionTraerPeriodo?institucion_id=" + me.usuarioSelect.institucion_idInstitucion)
        .then(function (res) {
          if (!res.data || res.data.length == 0) {
            me.periodo = { periodo_id: 0, estado: 0, descripcion: "" }
          } else {
            let datos = res.data[0]
            me.periodo = { periodo_id: datos.periodo, estado: datos.estado, descripcion: datos.descripcion }
          }
          me.getSeleccionadas()
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    getAreaSelect() {
      let me = this
      me.areasTemp = JSON.parse(localStorage.getItem('areasAsignaciones'))

      if (me.areasTemp && Array.isArray(me.areasTemp) && me.areasTemp.length) {
        me.area = me.areasTemp
        return
      }

      me.$vs && me.$vs.loading && me.$vs.loading()

      this.$http.get(this.$server_url + "AreaDisponibles_Asignacion")
        .then(function (response) {
          me.area = response.data.items || []
          localStorage.setItem("areasAsignaciones", JSON.stringify(me.area))
          me.openAreas = {}
          me.openSeriesInArea = {}
        })
        .catch(function (err) {
          console.error(err)
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    getSeleccionadas() {
      let me = this
      let data = new FormData()

      me.$vs && me.$vs.loading && me.$vs.loading()
      data.append('idusuario', me.user_seleccionado)

      this.$http.post(this.$server_url + "asignaturasDocent", data)
        .then(res => {
          me.seleccionadas = (res.data || []).map(item => {
            let detallesUnidades = []
            if (item.detalles_unidades_guardadas && item.detalles_unidades_guardadas.length > 0) {
              detallesUnidades = item.detalles_unidades_guardadas.map(unidad => ({
                id: unidad.id || unidad.id_unidad_libro,
                id_unidad_libro: unidad.id_unidad_libro,
                unidad: unidad.unidad,
                nombre_unidad: unidad.nombre_unidad,
                label_unidad: unidad.label_unidad || `${unidad.unidad} - ${unidad.nombre_unidad}`
              }))
            }

            return {
              ...item,
              mostrandoUnidades: false,
              cargandoUnidades: false,
              errorCargaUnidades: false,
              unidadesDisponibles: null,
              unidadesGuardadas: detallesUnidades,
              unidadesSeleccionadas: item.ids_unidades_guardadas || [],
              seleccionoTodas: false
            }
          })
        })
        .catch(function (error) {
          console.error('Error:', error)
          me.f_notificaciones('No se obtuvieron datos del usuario seleccionado', 'danger', 'alert-triangle')
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    // ========== MÉTODOS DE ASIGNACIÓN/ELIMINACIÓN ==========
    agregaAsignacion(item) {
      let me = this
      let data = new FormData()

      if (me.periodo.periodo_id == 0) {
        me.f_notificaciones('La institución no tiene período', 'danger', 'icon-alert-triangle')
        return
      }

      if (me.periodo.estado == 0) {
        me.f_notificaciones('La institución tiene período inactivo', 'danger', 'icon-alert-triangle')
        return
      }

      data.append('usuario_idusuario', me.user_seleccionado)
      data.append('asignatura_idasignatura', item.id)

      me.$vs && me.$vs.loading && me.$vs.loading()

      this.$http.post(this.$server_url + "asignar_asignatura_docentes_xarea_disponible", data)
        .then(function (res) {
          if (res.data.status == 0) {
            me.f_notificaciones(res.data.mensaje, 'danger', 'icon-x', 6000)
          } else if (res.data.status == 1) {
            me.f_notificaciones(res.data.mensaje)
            me.getSeleccionadas()
          } else if (res.data.status == 2) {
            me.f_notificaciones(res.data.mensaje, 'warning', 'icon-alert-triangle')
          }
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    eliminaAsignacion(item) {
      let me = this
      me.$vs && me.$vs.loading && me.$vs.loading()

      this.$http.get(this.$server_url + "eliminaAsignacion/" + item.idasignado)
        .then(function (res) {
          me.f_notificaciones(item.nombreasignatura + ' eliminada')
          me.getSeleccionadas()
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    f_quitarTodo() {
      let me = this
      let idSelects = me.seleccionadas.map(s => s.idasignado)

      me.$vs && me.$vs.loading && me.$vs.loading()
      let data = new FormData()
      data.append('idasiguser', idSelects)

      this.$http.post(this.$server_url + "quitaTodasAsignaturas", data)
        .then(function (res) {
          me.opConfirmarQuitar = false
          me.f_notificaciones('Asignaturas quitadas correctamente.')
          me.getSeleccionadas()
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    moverPeriodoActual() {
      let me = this
      me.$vs && me.$vs.loading && me.$vs.loading()

      this.$http.get(this.$server_url + 'moverAsignaturasPeriodo/' + me.user_seleccionado + '/' + me.periodo.periodo_id)
        .then(function (res) {
          me.f_notificaciones('Asignaturas movidas correctamente.')
          me.opConfirmarMover = false
          me.getSeleccionadas()
        })
        .catch(function (error) {
          console.log(error + ' error')
        })
        .finally(() => {
          me.$vs && me.$vs.loading && me.$vs.loading.close && me.$vs.loading.close()
        })
    },

    // ========== MÉTODOS DE UNIDADES ==========
    toggleUnidades(item, index) {
      let me = this

      // Alternar visibilidad
      item.mostrandoUnidades = !item.mostrandoUnidades

      if (!item.mostrandoUnidades) return

      // Cargar unidades si no están cargadas
      if (item.unidadesDisponibles) return

      item.cargandoUnidades = true
      item.errorCargaUnidades = false

      this.$http.get(this.$server_url + "get_unidades_x_libro_asignado/" + item.asignatura_idasignatura)
        .then(function (res) {
          me.$set(me.seleccionadas[index], 'unidadesDisponibles', res.data)
          me.$set(me.seleccionadas[index], 'cargandoUnidades', false)

          // Sincronizar selección con unidades guardadas
          if (item.unidadesSeleccionadas && item.unidadesSeleccionadas.length > 0) {
            const idsDisponibles = res.data.map(u => u.id)
            const idsValidos = item.unidadesSeleccionadas.filter(id => idsDisponibles.includes(id))
            me.$set(me.seleccionadas[index], 'unidadesSeleccionadas', idsValidos)
          }
        })
        .catch(error => {
          console.error('Error cargando unidades:', error)
          me.$set(me.seleccionadas[index], 'errorCargaUnidades', true)
          me.$set(me.seleccionadas[index], 'cargandoUnidades', false)
        })
    },

    validarSeleccion(item) {
      if (!item.unidadesSeleccionadas || !item.unidadesDisponibles) return

      const todasLasUnidades = item.unidadesDisponibles.map(u => u.id)
      const seleccionadas = item.unidadesSeleccionadas || []

      const todasOrdenadas = [...todasLasUnidades].sort()
      const seleccionadasOrdenadas = [...seleccionadas].sort()

      const seleccionoTodas = todasOrdenadas.length === seleccionadasOrdenadas.length &&
        todasOrdenadas.every((value, index) => value === seleccionadasOrdenadas[index])

      item.seleccionoTodas = seleccionoTodas

      if (seleccionoTodas) {
        setTimeout(() => {
          item.unidadesSeleccionadas = []
          this.f_notificaciones('Si deseas todas las unidades, deja el campo vacío', 'warning')
        }, 100)
      }
    },

    mostrarBotonGuardar(item) {
      if (!item.unidadesDisponibles) return false

      const tieneSeleccionadas = item.unidadesSeleccionadas && item.unidadesSeleccionadas.length > 0
      const tieneGuardadas = item.unidadesGuardadas && item.unidadesGuardadas.length > 0

      return (tieneSeleccionadas && !item.seleccionoTodas) || tieneGuardadas
    },

    getColorBoton(item) {
      if (item.unidadesSeleccionadas && item.unidadesSeleccionadas.length > 0) {
        return 'success'
      } else if (item.unidadesGuardadas && item.unidadesGuardadas.length > 0) {
        return 'warning'
      }
      return 'primary'
    },

    getTextoBoton(item) {
      if (item.unidadesSeleccionadas && item.unidadesSeleccionadas.length > 0) {
        return `Guardar ${item.unidadesSeleccionadas.length} unidad(es)`
      } else if (item.unidadesGuardadas && item.unidadesGuardadas.length > 0) {
        return 'Eliminar todas las unidades'
      }
      return 'Guardar'
    },

    estaDeshabilitadoGuardar(item) {
      return item.seleccionoTodas
    },

    guardarUnidades(item) {
      let me = this

      if (item.seleccionoTodas) {
        me.f_notificaciones('Si deseas todas las unidades, deja el campo vacío', 'warning')
        return
      }

      me.$vs.loading()

      this.$http.post(this.$server_url + 'guardar_unidades_libro', {
        idasignado: item.idasignado,
        id_unidades: item.unidadesSeleccionadas || []
      })
        .then(response => {
          if (response.data.success) {
            if (item.unidadesSeleccionadas.length === 0) {
              me.f_notificaciones('Todas las unidades han sido eliminadas. Se mostrarán todas por defecto.', 'success')
              item.tiene_unidades_asignadas = false
              item.total_unidades_asignadas = 0
              item.detalles_unidades_guardadas = []
              item.unidadesGuardadas = []
              item.ids_unidades_guardadas = []
            } else {
              me.f_notificaciones(`${item.unidadesSeleccionadas.length} unidad(es) guardada(s) correctamente`, 'success')
              item.tiene_unidades_asignadas = true
              item.total_unidades_asignadas = item.unidadesSeleccionadas.length
              item.ids_unidades_guardadas = item.unidadesSeleccionadas

              if (item.unidadesDisponibles) {
                const nuevasGuardadas = item.unidadesDisponibles.filter(
                  unidad => item.unidadesSeleccionadas.includes(unidad.id)
                ).map(unidad => ({
                  id: unidad.id,
                  id_unidad_libro: unidad.id_unidad_libro,
                  unidad: unidad.unidad,
                  nombre_unidad: unidad.nombre_unidad,
                  label_unidad: unidad.label_unidad
                }))

                item.detalles_unidades_guardadas = nuevasGuardadas
                item.unidadesGuardadas = nuevasGuardadas
              }
            }
          } else {
            me.f_notificaciones(response.data.message || 'Error al guardar', 'danger')
          }
        })
        .catch(error => {
          console.error('Error:', error)
          me.f_notificaciones('No se pudieron guardar las unidades', 'danger')
        })
        .finally(() => {
          me.$vs.loading.close()
        })
    },

    // ========== MÉTODOS AUXILIARES ==========
    reloadAreas() {
      localStorage.removeItem('areasAsignaciones')
      this.getAreaSelect()
    },

    f_notificaciones(msj = "Sin mensaje", color = "success", icono = "icon-check", time = 4000) {
      this.$vs.notify({
        text: msj,
        color: color,
        iconPack: 'feather',
        icon: icono,
        time: time
      })
    }
  }
}
</script>

<style scoped>
/* Estilos generales */
.section-header {
  margin: 2rem 0 1rem 0;
}

.section-title-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.badge-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

/* Card elegante para asignaturas */
.card-elegant {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
  background: white;
}

.elegant-header {
  background: linear-gradient(135deg, #6ea0c8 0%, #e3f2fd 100%);
  color: #0d47a1;
  padding: 1.25rem 1.5rem;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  font-weight: 600;
  border: 1px solid #bbdefb;
}

.elegant-header:hover {
  background: linear-gradient(135deg, #90caf9 0%, #bbdefb 100%);
  border-color: #90caf9;
}
.elegant-header .toggle-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.elegant-header .toggle-icon {
  color: white;
}

.badge-light {
  background: rgba(255, 255, 255, 0.2);
  color: rgb(28, 22, 22);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}

.elegant-content {
  padding: 1.5rem;
}

/* Acciones globales */
.global-actions {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Cards de confirmación */
.confirmation-card {
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease-out;
}

.danger-card {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border: 1px solid #fc8181;
}

.primary-card {
  background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
  border: 1px solid #63b3ed;
}

.confirmation-content {
  max-width: 600px;
  margin: 0 auto;
}

.alert-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Grid de asignaturas */
.asignaturas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.asignatura-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.asignatura-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%);
  border-bottom: 1px solid #e2e8f0;
}

.card-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.numero {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-body {
  padding: 1.25rem;
}

.asignatura-info {
  margin-bottom: 1.25rem;
}

.asignatura-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.asignatura-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: #718096;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Unidades asignadas */
.unidades-asignadas-section {
  background: #f0fff4;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #c6f6d5;
}

.section-title-small {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.unidades-list {
  max-height: 120px;
  overflow-y: auto;
}

.unidad-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
}

.unidad-item:last-child {
  margin-bottom: 0;
}

.unidad-text {
  color: #4a5568;
}

/* Gestión de unidades */
.unidades-action {
  margin: 1rem 0;
}

.gestion-unidades {
  animation: fadeIn 0.3s ease-out;
}

.loading-state {
  text-align: center;
  padding: 1.5rem;
}

.loading-text {
  margin-top: 0.75rem;
  color: #718096;
  font-size: 0.9rem;
}

.error-state {
  background: #fed7d7;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.error-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.selector-unidades {
  animation: slideInUp 0.3s ease-out;
}

.custom-select {
  border-radius: 8px;
}

.select-header {
  padding: 0.75rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #4a5568;
  display: flex;
  align-items: center;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-content {
  max-width: 300px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
  display: block;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #a0aec0;
  font-size: 0.95rem;
}

/* Filtros */
.filters-section {
  margin: 2rem 0;
}

.filter-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #4a5568;
  padding: 0 1rem;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.filter-btn {
  min-width: 120px;
}

/* Áreas y series elegantes */
.elegant-area-header {
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  border: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.elegant-area-header:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
}

.elegant-serie-header {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.elegant-serie-header:hover {
  background: #edf2f7;
}

.elegant-serie-main-header {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #bbdefb;
  border-radius: 8px;
  color: #1a237e;
  font-weight: 600;
}

.elegant-serie-main-header:hover {
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
  border-color: #90caf9;
  box-shadow: 0 4px 12px rgba(144, 202, 249, 0.3);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
.elegant-sub-header {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.libros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.libro-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-align: left;
  white-space: normal;
  height: auto;
  min-height: 44px;
}

.libro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .asignaturas-grid {
    grid-template-columns: 1fr;
  }

  .libros-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .action-buttons {
    flex-direction: column;
  }

  .confirmation-actions {
    flex-direction: column;
  }

  .filter-buttons {
    flex-direction: column;
    align-items: center;
  }

  .filter-btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .asignatura-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .libros-grid {
    grid-template-columns: 1fr;
  }
}

/* Contenedor para iconos chevron */
.toggle-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  margin-left: 12px;
}

/* Iconos chevron mejorados */
.chevron-icon {
  font-size: 1.1rem;
  font-weight: 600;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* Chevron en headers de áreas/series */
.elegant-area-header .chevron-icon {
  color: #4a5568;
  font-size: 1.2rem;
}

.elegant-serie-header .chevron-icon {
  color: #718096;
  font-size: 1.1rem;
}

.elegant-serie-main-header .chevron-icon {
  color: white;
  font-size: 1.2rem;
}

.elegant-sub-header .chevron-icon {
  color: #4a5568;
  font-size: 1.1rem;
}

/* Animación de rotación para chevron */
.toggle-header:hover .chevron-icon {
  transform: scale(1.1);
}

.toggle-header .chevron-icon.icon-chevron-down {
  transform: rotate(0deg);
}

.toggle-header .chevron-icon.icon-chevron-up {
  transform: rotate(180deg);
}

.toggle-header .chevron-icon.icon-chevron-right {
  transform: rotate(0deg);
}

.toggle-header:hover .chevron-icon.icon-chevron-right {
  transform: translateX(2px) scale(1.1);
}

.toggle-header:hover .chevron-icon.icon-chevron-down {
  transform: translateY(2px) scale(1.1);
}

/* Estilos generales mejorados */
.toggle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.toggle-title {
  display: flex;
  align-items: center;
  flex: 1;
}

/* Áreas específicas */
.area-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge-light {
  background: rgba(255, 255, 255, 0.15);
  color: rgb(28,22,22);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.elegant-area-header .badge-light {
  background: rgba(74, 85, 104, 0.1);
  color: #4a5568;
}

.elegant-serie-main-header .badge-light {
  background: rgba(255, 255, 255, 0.2);
  color: rgb(28,22,22);
}

.elegant-sub-header .badge-light {
  background: rgba(74, 85, 104, 0.08);
  color: #4a5568;
}

/* Mejoras en espaciado y alineación */
.area-header .toggle-title {
  align-items: center;
}

.serie-header .toggle-title {
  align-items: center;
}

.serie-count {
  margin-left: 8px;
  color: #718096;
  font-size: 0.9rem;
  font-weight: normal;
}

/* Responsive para iconos */
@media (max-width: 768px) {
  .toggle-icon-wrapper {
    margin-left: 8px;
    min-width: 20px;
  }

  .chevron-icon {
    font-size: 1rem;
    width: 18px;
    height: 18px;
  }

  .area-meta {
    gap: 8px;
  }
}

/* Estilos generales (mantener los anteriores) */
.section-header {
  margin: 2rem 0 1rem 0;
}

.section-title-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.badge-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.card-elegant {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
  background: white;
}

.elegant-header {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  color: white;
  padding: 1.25rem 1.5rem;
  border-bottom: none;
}

.elegant-header:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.elegant-header .toggle-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.elegant-content {
  padding: 1.5rem;
}

/* Resto de estilos (mantener igual que antes) */
.global-actions {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.confirmation-card {
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease-out;
}

/* ... mantener el resto de los estilos existentes ... */

/* Animaciones mejoradas */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .toggle-header {
    padding: 10px 12px;
  }

  .elegant-header {
    padding: 1rem 1.25rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .confirmation-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .toggle-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .area-meta {
    margin-top: 4px;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
