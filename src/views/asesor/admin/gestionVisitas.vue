<template>
  <div v-if="usuario.id_group == 1 || usuario.id_group == 5" class="gestion-visitas-container">
    <vs-card v-if="verCantidadVisitas == false" class="main-card">
      <!-- Header mejorado -->
      <div class="header-section">
        <div class="header-title">
          <div class="icon-wrapper">
            <i class="fa fa-address-book"></i>
          </div>
          <div>
            <h2 class="title-text">Gestión de Visitas</h2>
            <p class="subtitle-text">Administración de visitas de asesores</p>
          </div>
        </div>
      </div>

      <!-- Filtros mejorados -->
      <div class="filters-section">
        <div class="filter-card">
          <label class="filter-label">
            <i class="fa fa-building mr-2"></i>
            Tipo de Instituciones
          </label>
          <div class="radio-group">
            <label class="radio-option">
              <vs-radio v-model="filtro.tipoInstitucion" @input="instituciones = []" vs-name="radios1tipoInstitucion"
                vs-value="1">Prolipa</vs-radio>
            </label>
            <label class="radio-option">
              <vs-radio v-model="filtro.tipoInstitucion"
                @input="instituciones = []; asesor = ''; filtro.asesor = ''; informacion = []; tmpInformacion = [];"
                vs-name="radios1tipoInstitucion" vs-value="2">Creadas por el asesor</vs-radio>
            </label>
          </div>
        </div>

        <div class="action-buttons">
          <vx-tooltip text="Agregar planificación" position="top" color="primary">
            <vs-button color="primary" type="filled" @click="modalAgregar(); update = false" icon-pack="feather"
              icon="icon-plus">
              Nueva Planificación
            </vs-button>
          </vx-tooltip>
          <vs-button type="filled" color="success" @click="abrirCantidadVisitas();" icon-pack="feather"
            icon="icon-bar-chart-2">
            Visitas por Institución
          </vs-button>
        </div>
      </div>

      <!-- Filtros de búsqueda -->
      <div class="search-filters">
        <div class="filter-item">
          <label class="input-label">
            <i class="fa fa-user mr-2"></i>
            Filtro de asesores
          </label>
          <div style="display: flex; gap: 10px; align-items: flex-end;">
            <v-select :options="asesores" @input="getInstitucion(); asesor = filtro.asesor.idusuario"
              :reduce="asesores => asesores" label="vendedor" class="custom-select" v-model="filtro.asesor"
              placeholder="Seleccione un asesor" style="flex: 1;" />
            <vs-button color="primary" type="filled" @click="getAsesores()" icon-pack="feather"
              :icon="loadingAsesores ? 'icon-loader' : 'icon-search'" :disabled="loadingAsesores" size="small"
              style="min-width: 40px;">
              <span v-if="!loadingAsesores">Buscar</span>
            </vs-button>
          </div>
        </div>

        <div class="filter-item">
          <label class="input-label">
            <i class="fa fa-building mr-2"></i>
            Filtro de instituciones
          </label>
          <v-select :options="instituciones" @input="getAllVisitas(); filtroInstitucion = true"
            :reduce="instituciones => instituciones" label="nombreInstitucion" class="custom-select"
            v-model="filtro.institucion" placeholder="Seleccione una institución" />
        </div>

        <div class="filter-item" v-if="tmpInformacion.length > 0">
          <label class="input-label">
            <i class="fa fa-calendar mr-2"></i>
            Rango de fechas
          </label>
          <div class="date-range">
            <flat-pickr :config="configdateTimePicker2" @input="filterVisited();" v-model="filtroVisitaInicio"
              placeholder="Fecha Desde" class="date-input" />
            <span class="date-separator">-</span>
            <flat-pickr :config="configdateTimePicker2" @input="filterVisited();" v-model="filtroVisitaFin"
              placeholder="Fecha Hasta" class="date-input" />
            <vx-tooltip text="Limpiar fechas" position="top">
              <vs-button radius color="danger"
                @click="filtroVisitaInicio = null; filtroVisitaFin = null; filterVisited();" type="border"
                icon-pack="feather" icon="icon-x" size="small"></vs-button>
            </vx-tooltip>
            <vx-tooltip text="Este mes" position="top">
              <vs-button radius color="primary" @click="fechaMes(); filterVisited();" type="border" icon-pack="feather"
                icon="icon-calendar" size="small"></vs-button>
            </vx-tooltip>
          </div>
        </div>
      </div>

      <!-- Componente de estadísticas compacto -->
      <div v-if="informacion.length > 0" class="stats-bar mb-4">
        <div class="stats-item">
          <i class="fa fa-road"></i>
          <span><strong>{{ totalKilometros || 0 }}</strong> km</span>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-item">
          <i class="fa fa-clock-o"></i>
          <span><strong>{{ totalHorasTrabajadas || 0 }}</strong> hrs</span>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-item">
          <i class="fa fa-calendar-check-o"></i>
          <span><strong>{{ informacion.length }}</strong> visitas</span>
        </div>
        <div v-if="filtroVisitaInicio && filtroVisitaFin" class="stats-item stats-date">
          <i class="fa fa-calendar"></i>
          <span>{{ formatFechaRango() }}</span>
        </div>
      </div>

      <!--TABLA-->
      <div v-if="filtro.todo == true" class="mt-5">
        <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="informacion">
          <template slot="header">
            <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;"
              @click="exportToExcel();">Exportar</vs-button>
          </template>
          <template slot="thead">
            <vs-th width="25%" sort-key="nombreInstitucion">Institucion</vs-th>
            <vs-th width="25%" sort-key="creador">Datos</vs-th>
            <vs-th width="35%" sort-key="url">Observaciones</vs-th>
            <vs-th width="15%" style="width:100px;">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].nombreInstitucion">
                <p> #id: {{ data[indextr].id }} </p>
                <p>{{ data[indextr].title }}</p>
                <div v-if="tr.estado_institucion_temporal == '1'">
                  <i class="fa-solid fa-bookmark"></i>
                  {{ data[indextr].nombre_institucion_temporal }}<br>
                  {{ tr.periodo }}
                </div>
                <div v-else>
                  {{ data[indextr].nombreInstitucion }}<br>
                  {{ tr.periodo }}
                </div>
                <p style="font-weight:bold;">Asesor:</p>
                {{ data[indextr].asesor }}
                <p>
                  <vs-chip :color="tr.estado == '0' ? 'dark' :
                    tr.estado == '1' ? 'warning' :
                      tr.estado == '2' ? 'dark' :
                        tr.estado == '3' ? 'danger' :
                          tr.estado == '4' ? 'success' : 'dark'">
                    {{ tr.estado == '0' ? 'Generada' :
                      tr.estado == '1' ? 'Realizada' :
                        tr.estado == '2' ? 'Eliminada' :
                          tr.estado == '3' ? 'No Realizada' :
                            tr.estado == '4' ? 'Finalizada' : 'Desconocido' }}
                  </vs-chip>
                </p>
              </vs-td>
              <vs-td :data="data[indextr].creador">
                <p style="font-weight:bold;">Creado por:</p>
                {{ data[indextr].creador }}
                <p>
                  {{ data[indextr].created_at }}
                </p>
                <p>
                  <b>Visitar:</b><br />
                  <span>{{ getFormattedDate(tr) }}</span><br>
                </p>
                <p v-if="tr.fecha_captura_longitud" class="text-primary"><b>Inicio visita:</b><br />
                  <span>{{ tr.fecha_captura_longitud }}</span>
                </p>
                <p v-if="tr.fecha_captura_longitud_fin" class="text-primary"><b>Fin visita:</b><br />
                  <span>{{ tr.fecha_captura_longitud_fin }}</span>
                </p>
                <div v-if="tr.latitud_fin">
                  <b class="text-warning">Ubicación obtenida </b>
                </div>
                <div v-if="tr.fecha_captura_longitud && tr.fecha_captura_longitud_fin" class="text-success">
                  <p><b>Tiempo:</b></p>
                  {{ calcularHorasTrabajadasPorFechas(tr.fecha_captura_longitud,
                    tr.fecha_captura_longitud_fin).texto }}
                </div>
                <p v-if="tr.editor">
                  <b>Editado por:</b><br />
                  {{ data[indextr].editor }}
                </p>
                <p v-if="tr.finalizador">
                  <b>Finalizado por:</b><br />
                  {{ data[indextr].finalizador }}
                </p>
              </vs-td>
              <vs-td :data="data[indextr].url">
                <p><small><i><b>Asesor:</b></i></small></p>
                <p> {{ data[indextr].url }}</p><br>
                <div v-if="data[indextr].observacionAdmin">
                  <p><small><i><b>Administrador:</b></i></small></p>
                  <p>{{ data[indextr].observacionAdmin }}</p>
                </div>
              </vs-td>
              <vs-td>
                <div style="display: flex;">
                  <div>
                    <vx-tooltip style="display: inline-block;" text="Editar planificación" position="top"
                      color="primary">
                      <vs-button class="modal-default-button" size="small"
                        @click="getInstitucionInfo(tr); openEditPlanificacion(tr); update = true" color="success" radius
                        type="line" icon-pack="feather" icon="icon-edit"> </vs-button>
                    </vx-tooltip> &nbsp;
                    <vx-tooltip style="display: inline-block;" text="Eliminar planificación" position="top"
                      color="primary">
                      <vs-button class="modal-default-button" size="small" @click="openConfirmarEliminar(tr);"
                        color="danger" radius type="line" icon-pack="feather" icon="icon-trash"> </vs-button>
                    </vx-tooltip> &nbsp;
                  </div>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
      <br><br><br><br><br><br>
    </vs-card>

    <vs-card v-else>
      <vs-button radius color="success" @click="verCantidadVisitas = false" type="gradient" icon="reply"></vs-button>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" class="ml-3">
          Filtro de asesores
          <v-select :options="asesores"
            @input="filtro.institucion = ''; getInstitucion(); asesor = filtro.asesor.idusuario"
            :reduce="asesores => asesores" label="vendedor" class="w-full" v-model="filtro.asesor" />
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
          <flat-pickr :config="configdateTimePicker2" v-model="fromDate" placeholder="Fecha Inicio" class="ml-2 mt-1"
            style="display: inline-block;width: 100%;" />
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3">
          <flat-pickr :config="configdateTimePicker2" v-model="toDate" placeholder="Fecha Fin" class="ml-2 mt-1"
            style="display: inline-block;width: 100%" />
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1">
          <vx-tooltip style="display: inline-block;" text="Filtrar visitas" position="top" color="primary">
            <vs-button radius color="warning" @click="getCantidadVisitas();" type="line" icon="search"></vs-button>
          </vx-tooltip>
        </vs-col>
      </vs-row>
      <CantidadVisitasVue :ReportVisitas="ReportVisitas" :ReportVisitasTemporales="ReportVisitasTemporales" />
    </vs-card>
    <!--MODALES-->
    <!--MODAL PARA AGREGAR PLANIFICACION-->
    <vs-popup background-color="rgba(255,255,255,.6)" fullscreen :title="titulo" :active.sync="activePromptAddEvent">
      <div class="mt-3">
        <!-- <div class="calendar__label-container flex mb-6" v-if="seleccionadoInsitucion == false">
          <vs-chip style="width: 100px;height: 25px;margin-top: 1px;" class="text-white"
            :class="'bg-' + labelLocal.color">{{ labelLocal.text }}</vs-chip>
          <span v-if="estado == 1" style="margin-top:2px;">
            <vs-chip color="success">Realizada</vs-chip>
          </span>
          <vs-dropdown vs-custom-content vs-trigger-click class="ml-auto my-2 cursor-pointer">
            <feather-icon icon="TagIcon" svgClasses="h-5 w-5" class="cursor-pointer" @click.prevent></feather-icon>
            <vs-dropdown-menu style="z-index: 200001">
              <vs-dropdown-item v-for="(label, index) in calendarLabels" :key="index" @click="labelLocal = label">
                <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                <span>{{ label.text }}</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div> -->
        <div>
          <!--INSTITUCIONES-->
          <vs-row v-if="seleccionadoInsitucion == false" class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <div v-if="nombreInstitucion == '' || nombreInstitucion == null" class="alert-empty">
                <i class="fa fa-exclamation-triangle"></i>
                <span>Sin institución seleccionada</span>
              </div>
              <div v-else class="institution-info">
                <div class="info-card">
                  <div class="info-icon">
                    <i class="fa fa-university"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Institución</span>
                    <strong class="info-value">{{ nombreInstitucion }}</strong>
                  </div>
                </div>
                <div class="info-divider"></div>
                <div class="info-card">
                  <div class="info-icon">
                    <i class="fa fa-user-circle"></i>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Asesor asignado</span>
                    <strong class="info-value">{{ asesorSelect }}</strong>
                  </div>
                </div>
              </div>
            </vs-col>
          </vs-row>

          <vs-row v-if="seleccionadoInsitucion == true" class="mt-2">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
              <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply"
                type="gradient"></vs-button>
              <vs-button size="small" class="ml-3"
                @click="popupAddNuevaInstitucion = true; activePromptAddEvent = false;" type="relief">Añadir nueva
                institución</vs-button>
            </vs-col>
          </vs-row>
          <vs-row>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
              <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false"
                @click="seleccionadoInsitucion = true; tipo = 1" type="relief">Asignar institución de
                prolipa</vs-button>
              <vs-button color="primary" class="mt-2 ml-3" icon="info" v-if="seleccionadoInsitucion == false"
                @click="seleccionadoInsitucion = true; getInstitucionCreadasByAsesor(); tipo = 2;"
                type="relief">Institución
                creada por el asesor</vs-button>
            </vs-col>
          </vs-row>
          <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion == true && tipo == 1" class="mt-5">
            <div style="width:80%;">
              <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucionAsesor()"
                v-model="busquedaInstitucion" />
            </div>
            <div style="width:20%;margin-left:15px;">
              <vs-button radius color="warning" @click="getInstitucionAsesor()" type="filled" icon="search"></vs-button>
            </div>
          </div>
          <div v-if="institucionesAsesor.length > 0">
            <vs-table stripe max-items="5" search pagination :data="institucionesAsesor">
              <template slot="header">
                <div class="vx-row">
                  <div class="vx-col w-full m-3">
                    Cantidad: {{ institucionesAsesor.length }}
                  </div>
                </div>
              </template>
              <template slot="thead">
                <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                <vs-th sort-key="nombre">Localidad</vs-th>
                <vs-th>Acciones</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].nombreInstitucion">
                    {{ data[indextr].nombreInstitucion }}<br>
                    <div v-if="tr.institucion_temporal_id">
                      <b>Asesor:</b>
                      <p>{{ filtro.asesor.vendedor }}</p>
                    </div>
                    <div v-else>
                      <b>Asesor:</b>
                      <p>{{ tr.nombre_asesor + " " + tr.apellido_asesor }}</p>
                    </div>
                  </vs-td>
                  <vs-td :data="data[indextr].nombreregion">
                    {{ data[indextr].nombreregion }} <br>
                    <small>{{ data[indextr].ciudad }}</small>
                  </vs-td>
                  <vs-td>
                    <div class="flex">
                      <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather"
                        icon="icon-bookmark" class="mr-2" color="primary"
                        @click="asginarInstitucion(tr); error = false">
                        Asignar
                      </vs-button>
                    </div>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </div>
        <vs-row v-if="error == true" class="mt-3">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true" color="danger">
              {{ messageError }}
            </vs-alert>
          </vs-col>
        </vs-row>
        <div v-if="seleccionadoInsitucion == false">
          <br>
          <vs-input class="w-full mb-3 " label-placeholder="Título del evento *" v-model="title"></vs-input>
          <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/2 w-full">
              <small class="date-label">Fecha inicio *</small>
              <datepicker class="w-full" name="start-date" v-model="startDate" :disabled="disabledFrom"></datepicker>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
              <small class="date-label">Hora inicio *</small>
              <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_inicio" />
            </div>

          </div>
          <!-- <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/2 w-full" v-if="fecha_captura_longitud_fin">
              <small class="date-label">Fecha que visitó</small>
              <datepicker class="w-full" name="end-date" v-model="fecha_captura_longitud_fin"
                :disabledDates="disabledDatesTo">
              </datepicker>
            </div>
            <div class="vx-col sm:w-1/2 w-full" v-if="fecha_captura_longitud_fin">
              <small class="date-label">Hora de visita *</small>
              <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_captura_longitud_fin" />
            </div>
          </div> -->
          <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/2 w-full" v-if="update == true && fecha_captura_longitud_fin">
              <small class="date-label">Fecha y hora de visita</small>
              <flat-pickr class="w-full" :config="configdateTimePickerCompleto" v-model="fecha_captura_longitud_fin" />
            </div>
          </div>

          <vs-divider color="success" v-if="seleccionadoInsitucion == false">Opciones</vs-divider>
          <vs-row v-if="seleccionadoInsitucion == false">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.presentacion">Presentación</vs-checkbox>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.entrega_muestras">Entregas de muestras</vs-checkbox>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.reunion">Reunión</vs-checkbox>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.seguimiento">Seguimiento</vs-checkbox>
            </vs-col>

            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.cierre">Cierre</vs-checkbox>
            </vs-col>
            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.cobranza">Cobranza</vs-checkbox>
            </vs-col>
            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.post_venta">Post Venta</vs-checkbox>
            </vs-col>
            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.retiro_cartas">Retiro de cartas</vs-checkbox>
            </vs-col>

            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.retiro_muestras">Retiro de muestras</vs-checkbox>
            </vs-col>

            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.capacitacion">Capacitación</vs-checkbox>
            </vs-col>
            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
            </vs-col>
            <vs-col v-if="opciones.otraEditorial == true" class="mt-2" vs-type="flex" vs-justify="left" vs-align="left"
              vs-w="3" vs-lg="3" vs-sm="4" vs-xs="4">
              <vs-input class="inputx w-full" placeholder="Escriba el nombre de la editorial"
                v-model="nombre_editorial" />
            </vs-col>
            <vs-col class="mt-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="4"
              vs-xs="4">
              <vs-checkbox color="success" v-model="opciones.sinSello">
                <span v-if="opciones.sinSello" class="text-green-600"> Con sello</span>
                <span v-else class="text-red-500"> Sin sello</span>
              </vs-checkbox>
            </vs-col>
          </vs-row>
        </div>
        <vs-textarea counter="250" label="Observación asesor" :counter-danger.sync="counterDanger"
          v-if="seleccionadoInsitucion == false" name="event-url" class="w-full mb-3 mt-4" v-model="url" />
        <vs-textarea v-if="isAdministrador" counter="250" label="Observación Administrador"
          :counter-danger.sync="counterDanger" name="event-url" class="w-full mb-3 mt-4" v-model="observacionAdmin" />

        <!-- Mostrar ubicación capturada (solo lectura) -->
        <div v-if="seleccionadoInsitucion == false && (latitud || latitud_fin)" class="w-full mb-3">
          <vs-divider color="primary">Ubicación Registrada</vs-divider>

          <!-- Ubicación de Inicio -->
          <div v-if="latitud && longitud" class="mt-3">
            <div
              style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <feather-icon icon="MapPinIcon" svgClasses="h-5 w-5 mr-2" style="color: #3b82f6;"></feather-icon>
                <div>
                  <strong style="color: #1e40af; font-size: 16px;">Ubicación de Inicio</strong><br>
                  <span style="color: #64748b; font-size: 13px;">Latitud: {{ latitud }}, Longitud: {{ longitud
                  }}</span>
                  <div v-if="fecha_captura_longitud">
                    <small style="color: #94a3b8;">Capturada: {{ formatearFechaHora(fecha_captura_longitud) }}</small>
                  </div>
                </div>
              </div>

              <!-- Mapa de inicio -->
              <div
                style="height: 250px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0; margin-bottom: 10px;">
                <iframe :src="`https://maps.google.com/maps?q=${latitud},${longitud}&z=16&output=embed`" width="100%"
                  height="100%" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>

              <!-- Botón para ver en Google Maps -->
              <div style="text-align: center;">
                <vs-button size="small" color="primary" type="border" icon="open_in_new"
                  @click="verEnGoogleMaps(latitud, longitud)">
                  Ver en Google Maps
                </vs-button>
              </div>
            </div>
          </div>

          <!-- Ubicación de Fin -->
          <div v-if="latitud_fin && longitud_fin" class="mt-3">
            <div
              style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <feather-icon icon="MapIcon" svgClasses="h-5 w-5 mr-2" style="color: #10b981;"></feather-icon>
                <div>
                  <strong style="color: #065f46; font-size: 16px;">Ubicación Final</strong><br>
                  <span style="color: #64748b; font-size: 13px;">Latitud: {{ latitud_fin }}, Longitud: {{ longitud_fin
                  }}</span>
                  <div v-if="fecha_captura_longitud_fin">
                    <small style="color: #94a3b8;">Capturada: {{ formatearFechaHora(fecha_captura_longitud_fin)
                    }}</small>
                  </div>
                </div>
              </div>

              <!-- Mapa de fin -->
              <div
                style="height: 250px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0; margin-bottom: 10px;">
                <iframe :src="`https://maps.google.com/maps?q=${latitud_fin},${longitud_fin}&z=16&output=embed`"
                  width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>

              <!-- Botón para ver en Google Maps -->
              <div style="text-align: center;">
                <vs-button size="small" color="success" type="border" icon="open_in_new"
                  @click="verEnGoogleMaps(latitud_fin, longitud_fin)">
                  Ver en Google Maps
                </vs-button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-3">
          <vs-button v-if="isAdministrador" color="success" @click="addEvent('finaliza')"
            type="relief">Finalizar</vs-button>
          <vs-button @click="addEvent('guarda')" class="ml-4" type="relief">Guardar</vs-button>
          <vs-button color="warning" class="ml-4" @click="activePromptAddEvent = false" type="relief">{{ label_cancel
          }}</vs-button>
        </div>
      </div>
    </vs-popup>
    <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->
    <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución"
      :active.sync="popupAddNuevaInstitucion">
      <vs-button size="small" color="success" radius=""
        @click="popupAddNuevaInstitucion = false; activePromptAddEvent = true;" icon="reply"
        type="gradient"></vs-button>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <div class="vx-col w-full mt-5">

            Seleccione una ciudad:
            <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full"
              v-model="temporalInstitucion.ciudad" />
          </div>
        </vs-col>
      </vs-row>
      <vs-row class="mt-2">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-input label="Escriba un nombre para la institución" class="w-full"
            v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
        </vs-col>
      </vs-row>

      <vs-row class="mt-2">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <ul class="leftx" style="display:flex;flex-direction: row;">

            <li class="ml-2">
              <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="1">Sierra</vs-radio>
            </li>
            <li class="ml-2">
              <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="2">Costa</vs-radio>
            </li>

          </ul>
        </vs-col>
      </vs-row>
      <vs-row class="mt-5">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-button @click="agregarInstitucionTemporal(); error = false" type="gradient">Agregar
            Institución</vs-button>
        </vs-col>
      </vs-row>
    </vs-popup>
    <!--modal exportar-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
      accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
      <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
        <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
      </vs-alert>
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      <div class="flex">
        <!--<span class="mr-4">Cell Auto Width:</span>
              <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
      </div>
    </vs-prompt>
  </div>
</template>
<script>
import CantidadVisitasVue from './components/CantidadVisitas.vue'
import {
  CalendarView,
  CalendarViewHeader
} from 'vue-simple-calendar'
import moduleCalendar from '@/store/calendar2/moduleCalendar.js'
import vSelect from 'vue-select'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
  en,
  he
} from 'vuejs-datepicker/src/locale'
export default {
  data() {
    return {
      configdateTimePickerCompleto: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        time_24hr: true
      },
      verPlanificaciones: false,
      asesores: [],
      loadingAsesores: false,
      filtro: {
        asesor: '',
        institucion: '',
        tipoInstitucion: '1',
        todo: false
      },
      instituciones: [],
      asesor: '',
      informacion: [],
      tmpInformacion: [],
      filtroInstitucion: false,
      filtroVisitaInicio: null,
      filtroVisitaFin: null,
      activePromptAddEvent: false,

      //VARIABLES DE AGREGAR PLANIFICACION

      popupFiltroInstitucion: false,
      error: false,
      messageError: "",
      ciudadSelect: '',
      popupAddNuevaInstitucion: false,
      seleccionadoInsitucion: false,
      nombreInstitucion: '',
      asesorSelect: '',
      busquedaInstitucion: "",
      popupaddInstitucion: false,
      opciones: {
        presentacion: false,
        entrega_muestras: false,
        reunion: false,
        seguimiento: false,
        cierre: false,
        cobranza: false,
        post_venta: false,
        retiro_cartas: false,
        retiro_muestras: false,
        capacitacion: false,
        sinSello: true,
        otraEditorial: false,
      },
      nombre_editorial: '',
      usuario: [],
      showDate: new Date(),
      disabledFrom: false,
      titulo: '',
      id: 0,
      title: '',
      startDate: '',
      endDate: '',
      labelLocal: {
        text: 'Baja',
        color: 'success'
      },
      langHe: he,
      langEn: en,

      url: '',
      calendarView: 'month',
      label_cancel: 'Cancelar',
      calendarViewTypes: [{
        label: 'Mes',
        val: 'month'
      },
      {
        label: 'Semana',
        val: 'week'
      },
      {
        label: 'Año',
        val: 'year'
      }
      ],
      time: null,
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      },
      hora_inicio: '',
      hora_fin: '',
      institucion_id: '',
      counterDanger: false,
      arregloCiudad: [],
      temporalInstitucion: {
        ciudad: '',
        nombreInstitucion: '',
        region: '2',
      },
      institucion_id_temporal: '',
      estado_institucion_temporal: 0,
      periodo_id_temporal: 0,
      nombreInstitucionTemporal: '',
      filtroInstituciones: [],
      estado: '0',
      institucionesAsesor: [],
      titulo: '',
      update: false,
      tipo: 1,
      verCantidadVisitas: false,
      //VARIABLES CANTIDAD DE VISITAS
      fromDate: null,
      toDate: null,
      configdateTimePicker2: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      ReportVisitas: [],
      ReportVisitasTemporales: [],
      //FIN VARIABLES PARA CANTIDAD DE VISITAS,
      //VARIABLES PARA EXPORTAR A EXCEL
      codigoSelected: [],
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      fileName: "Reporte de visitas",
      selectedFormat: 'xlsx',
      cellAutoWidth: true,
      activePrompt: false,
      //FIN VARIABLES PARA EXPORTAR A EXCEL

      // Variables para ubicación
      latitud: null,
      longitud: null,
      fecha_captura_longitud: null,
      latitud_fin: null,
      longitud_fin: null,
      fecha_captura_longitud_fin: null,
      totalKilometros: 0,
      totalHorasTrabajadas: 0,
      observacionAdmin: '',
      isAdministrador: false,
      usuario_finaliza: null,
    }
  },
  computed: {
    simpleCalendarEvents() {
      return this.$store.state.calendar.events
    },
    disabledDatesTo() {
      return {
        to: new Date(this.startDate)
      }
    },
    disabledDatesFrom() {
      return {
        from: new Date(this.endDate)
      }
    },
    calendarLabels() {
      return this.$store.state.calendar.eventLabels
    },
    labelColor() {
      return (label) => {
        if (label === 'business') return 'success'
        else if (label === 'work') return 'warning'
        else if (label === 'personal') return 'danger'
        else if (label === 'baja') return 'primary'
      }
    },
    windowWidth() {
      return this.$store.state.windowWidth
    },

    asesorNombre() {
      if (
        this.filtro &&
        this.filtro.asesor &&
        this.filtro.asesor.vendedor
      ) {
        return this.filtro.asesor.vendedor
      }
      return 'SIN_ASESOR'
    }


  },
  components: {
    Datepicker,
    flatPickr,
    'v-select': vSelect,
    CalendarView,
    CalendarViewHeader,
    CantidadVisitasVue,
  },
  created() {
    let me = this;
    me.getAsesores()
    me.isAdmin = localStorage.getItem("adminSeguimiento")

    // Solo registrar el módulo si no existe
    if (!this.$store.state.calendar) {
      this.$store.registerModule('calendar', moduleCalendar)
    }

    this.$store.dispatch('calendar/fetchEventLabels')
    this.listaCiudades()
    this.institucion_id = ""
    this.institucion_id_temporal = ""
  },
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')) || {}
    this.isAdministrador = this.usuario.id_group === 1 ? true : false; // Verificar si el usuario es administrador
    this.fechaMes();
  },
  methods: {
    getFormattedDate(tr) {
      if (tr && tr.startDate) {
        return tr.startDate.split(' ')[0]
      }
      return '---'
    },
    fechaMes() {
      let me = this
      const date = new Date()
      const primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
      const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      me.fromDate = primerDia
      me.toDate = ultimoDia
      me.filtroVisitaInicio = moment(primerDia).format('YYYY-MM-DD')
      me.filtroVisitaFin = moment(ultimoDia).format('YYYY-MM-DD')
    },
    dataPlanificacion() {
      let me = this;
      localStorage.setItem('planificacion_asesor_id', me.filtro.asesor.idusuario)
      localStorage.setItem('planificacion_cedula', me.filtro.asesor.cedula)
      localStorage.setItem('planificacion_vendedor', me.filtro.asesor.vendedor)
      me.verPlanificaciones = true
    },
    //para obtener el listado de los asesores
    async getAsesores() {
      if (this.loadingAsesores) return;

      try {
        this.loadingAsesores = true;
        this.$vs.loading();

        // Limpiar datos previos
        this.instituciones = [];
        this.informacion = [];
        this.tmpInformacion = [];
        this.filtro.institucion = "";
        this.filtroInstitucion = false;

        const res = await this.$http.get(this.$server_url + 'seguimiento');
        this.asesores = res.data;

        if (res.data.length === 0) {
          this.$f_notificacion('No se encontraron asesores', 'warning', 'icon-alert-triangle');
        }
      } catch (error) {
        console.error('Error al cargar asesores:', error);
        this.$f_notificacion('Error al cargar los asesores', 'danger', 'icon-alert-circle');
      } finally {
        this.loadingAsesores = false;
        this.$vs.loading.close();
      }
    },

    filterVisited() {
      if (this.filtroVisitaInicio && this.filtroVisitaFin) {
        this.informacion = this.tmpInformacion.filter(p =>
          p.startDate &&
          p.startDate.substring(0, 10) >= this.filtroVisitaInicio &&
          p.startDate.substring(0, 10) <= this.filtroVisitaFin
        );
      } else {
        this.informacion = [...this.tmpInformacion];
      }

      // Actualizar estadísticas después de filtrar
      this.calcularEstadisticas();
    },

    calcularEstadisticas() {
      let totalKm = 0;
      let totalMinutos = 0; // Cambiar a minutos para sumar correctamente
      let visitasRealizadas = 0;

      this.informacion.forEach(visita => {
        // Verificar si la visita fue realizada (tiene ubicación de inicio y fin)
        const tieneUbicacionInicio = visita.latitud && visita.longitud;
        const tieneUbicacionFin = visita.latitud_fin && visita.longitud_fin;

        // Calcular KM solo si la visita fue realizada y tiene ambas ubicaciones
        if (tieneUbicacionInicio && tieneUbicacionFin) {
          const km = this.calcularDistancia(
            parseFloat(visita.latitud),
            parseFloat(visita.longitud),
            parseFloat(visita.latitud_fin),
            parseFloat(visita.longitud_fin)
          );
          totalKm += km;
          visitasRealizadas++;
        }

        // Calcular horas trabajadas usando fecha_captura_longitud y fecha_captura_longitud_fin
        if (visita.fecha_captura_longitud && visita.fecha_captura_longitud_fin) {
          const resultado = this.calcularHorasTrabajadasPorFechas(
            visita.fecha_captura_longitud,
            visita.fecha_captura_longitud_fin
          );
          // Sumar minutos totales
          totalMinutos += (resultado.horas * 60) + resultado.minutos;
        }
      });

      // Convertir minutos totales a horas y minutos para mostrar
      const horasTotales = Math.floor(totalMinutos / 60);
      const minutosTotales = totalMinutos % 60;

      // Formatear texto para mostrar
      let textoHoras = '';
      if (horasTotales > 0 && minutosTotales > 0) {
        textoHoras = `${horasTotales} hora${horasTotales !== 1 ? 's' : ''} y ${minutosTotales} minuto${minutosTotales !== 1 ? 's' : ''}`;
      } else if (horasTotales > 0) {
        textoHoras = `${horasTotales} hora${horasTotales !== 1 ? 's' : ''}`;
      } else if (minutosTotales > 0) {
        textoHoras = `${minutosTotales} minuto${minutosTotales !== 1 ? 's' : ''}`;
      } else {
        textoHoras = '0 min';
      }

      
      this.totalKilometros = totalKm.toFixed(2);
      this.totalHorasTrabajadas = textoHoras; // Ahora es un string con formato legible
    },

    // Método para calcular distancia entre dos puntos (Haversine formula)
    calcularDistancia(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radio de la Tierra en km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },

    // Método para calcular horas trabajadas
    // Método para calcular horas trabajadas
    calcularHorasTrabajadas(horaInicio, horaFin) {
      if (!horaInicio || !horaFin) return 0;

      try {
        // Si los valores vienen como string con formato "HH:MM" o "HH:MM:SS"
        let inicioStr = horaInicio.toString();
        let finStr = horaFin.toString();

        // Extraer solo HH:MM si vienen con segundos
        inicioStr = inicioStr.substring(0, 5);
        finStr = finStr.substring(0, 5);

        const inicio = moment(inicioStr, 'HH:mm');
        const fin = moment(finStr, 'HH:mm');

        if (!inicio.isValid() || !fin.isValid()) {
          console.warn('Horas inválidas:', inicioStr, finStr);
          return 0;
        }

        const diffMinutes = fin.diff(inicio, 'minutes');
        const horas = diffMinutes / 60;

        // Si la diferencia es negativa (fin es menor que inicio), asumir que es del día siguiente
        if (horas < 0) {
          const finNextDay = fin.add(1, 'day');
          const diffMinutesNext = finNextDay.diff(inicio, 'minutes');
          return diffMinutesNext / 60;
        }

        return horas > 0 ? horas : 0;
      } catch (error) {
        console.error('Error al calcular horas:', error);
        return 0;
      }
    },

    // Método para calcular horas trabajadas usando fechas completas - Devuelve objeto con horas y minutos
    calcularHorasTrabajadasPorFechas(fechaInicio, fechaFin) {
      if (!fechaInicio || !fechaFin) {
        return { horas: 0, minutos: 0, texto: '0 min' };
      }

      try {
        // Las fechas vienen en formato "YYYY-MM-DD HH:MM:SS" o similar
        const inicio = moment(fechaInicio);
        const fin = moment(fechaFin);

        if (!inicio.isValid() || !fin.isValid()) {
          console.warn('Fechas inválidas:', fechaInicio, fechaFin);
          return { horas: 0, minutos: 0, texto: '0 min' };
        }

        // Calcular diferencia en minutos
        let diffMinutes = fin.diff(inicio, 'minutes');

        // Si la diferencia es negativa, asumir que es del día siguiente
        if (diffMinutes < 0) {
          const finNextDay = moment(fechaFin).add(1, 'day');
          diffMinutes = finNextDay.diff(inicio, 'minutes');
        }

        // Calcular horas y minutos
        const horas = Math.floor(diffMinutes / 60);
        const minutos = diffMinutes % 60;

        // Formatear texto
        let texto = '';
        if (horas > 0 && minutos > 0) {
          texto = `${horas} hora${horas !== 1 ? 's' : ''} y ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
        } else if (horas > 0) {
          texto = `${horas} hora${horas !== 1 ? 's' : ''}`;
        } else if (minutos > 0) {
          texto = `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
        } else {
          texto = '0 min';
        }

        return {
          horas: horas,
          minutos: minutos,
          texto: texto,
          totalHorasDecimal: (diffMinutes / 60).toFixed(2)
        };

      } catch (error) {
        console.error('Error al calcular horas:', error);
        return { horas: 0, minutos: 0, texto: '0 min' };
      }
    },
    async getInstitucion() {
      let me = this;
      if (!this.filtro.asesor || !this.filtro.asesor.idusuario) {
        me.$f_notificacion('Seleccione un asesor antes de filtrar las instituciones', 'warning', 'icon-user');
        return;
      }

      this.$vs.loading();
      this.instituciones = [];
      this.informacion = [];
      this.tmpInformacion = [];
      this.filtro.institucion = "";
      this.filtroInstitucion = false;

      try {
        const url = this.filtro.tipoInstitucion == 1
          ? `${this.$server_url}listaInsitucionAsesor?porCedula=yes&cedula=${this.filtro.asesor.cedula}`
          : `${this.$server_url}listaInsitucionAsesor?temporales=yes&asesor_id=${this.filtro.asesor.idusuario}`;

        const res = await this.$http.get(url);

        if (res.data && res.data.length > 0) {
          this.instituciones = res.data;
        } else {
          const message = this.filtro.tipoInstitucion == 1
            ? 'No hay instituciones asociadas a este asesor'
            : 'No hay instituciones temporales asociadas a este asesor';
          me.$f_notificacion(res.data.message || message, 'success', 'icon-user', 5000);
        }

        this.filtro.todo = true;
        await this.getAllVisitas();

      } catch (error) {
        // console.error('Error al cargar instituciones:', error);
        me.$f_notificacion('Error al cargar las instituciones', 'danger', 'icon-alert-circle');
      } finally {
        this.$vs.loading.close();
      }
    },

    async getAllVisitas() {
      if (!this.filtro.asesor || !this.filtro.asesor.idusuario) {
        return;
      }

      this.$vs.loading();

      try {
        const res = await this.$http.get(`${this.$server_url}listaInsitucionAsesor?todo=yes&asesor_id=${this.filtro.asesor.idusuario}`);

        let data = res.data;

        if (this.filtro.institucion) {
          if (this.filtro.tipoInstitucion == 1) {
            this.informacion = data.filter(p => p.institucion_id == this.filtro.institucion.idInstitucion);
          } else {
            this.informacion = data.filter(p => p.institucion_id_temporal == this.filtro.institucion.institucion_temporal_id);
          }
        } else {
          this.informacion = data;
        }

        this.tmpInformacion = this.informacion;
        this.filterVisited();

        if (this.informacion.length === 0) {
          this.$f_notificacion('No hay planificaciones asociadas a este asesor', 'warning', 'icon-alert-triangle', 5000);
        }

      } catch (error) {
        console.error('Error al cargar planificaciones:', error);
        this.informacion = [];
        this.tmpInformacion = [];
        this.$f_notificacion('Error al cargar las planificaciones', 'danger', 'icon-alert-circle');
      } finally {
        this.$vs.loading.close();
      }
    },
    // Métodos auxiliares para addEvent
    validateEventForm() {
      if (!this.institucion_id && !this.institucion_id_temporal) {
        this.showError("Seleccione una institución por favor");
        return false;
      }

      if (!this.title || !this.startDate || !this.hora_inicio) {
        this.showError("Campos con asterisco obligatorios");
        return false;
      }

      if (this.endDate && this.startDate && new Date(this.endDate) < new Date(this.startDate)) {
        this.showError("La fecha de finalización no puede ser anterior a la fecha de inicio");
        return false;
      }

      const allFalse = Object.values(this.opciones).every(option => option === false);
      if (allFalse) {
        this.showError("Debe marcar al menos un recuadro");
        return false;
      }

      if (this.opciones.otraEditorial && !this.nombre_editorial) {
        this.showError("Ha seleccionado otra editorial tiene que agregar una editorial por favor");
        return false;
      }

      return true;
    },

    showError(message) {
      this.error = true;
      this.messageError = message;
      this.activePromptAddEvent = true;
    },

    buildEventObject() {
      // Formatear startDate
      let startDateFormatted = null;
      if (this.startDate) {
        try {
          startDateFormatted = new Date(this.startDate).toISOString().split('T')[0];
        } catch (e) {
          startDateFormatted = null;
        }
      }

      // Extraer fecha y hora de fecha_captura_longitud_fin
      let endDateFormatted = null;
      let horaFinFormatted = null;

      if (this.fecha_captura_longitud_fin && typeof this.fecha_captura_longitud_fin === 'string') {
        const partes = this.fecha_captura_longitud_fin.split(' ');
        if (partes.length > 0) {
          endDateFormatted = partes[0]; // YYYY-MM-DD
        }
        if (partes.length > 1 && partes[1]) {
          horaFinFormatted = partes[1].substring(0, 5); // HH:MM
        }
      }

      return {
        idusuario: localStorage.planificacion_asesor_id,
        id: this.id,
        title: this.title,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        classes: 'event-' + this.labelLocal.color,
        label: this.labelLocal.text,
        url: this.url,
        hora_inicio: this.hora_inicio && typeof this.hora_inicio === 'string' ? this.hora_inicio.substring(0, 5) : null,
        hora_fin: horaFinFormatted,
        institucion_id: this.institucion_id,
        opciones: this.opciones,
        institucion_id_temporal: this.institucion_id_temporal,
        estado_institucion_temporal: this.estado_institucion_temporal,
        periodo_id_temporal: this.periodo_id_temporal,
        nombreInstitucion: this.nombreInstitucion,
        otraEditorial: this.opciones.otraEditorial,
        nombre_editorial: this.nombre_editorial,
        observacionAdmin: this.observacionAdmin,
      };
    },

    createFormData(obj) {
      let me = this;
      const formData = new FormData();
      formData.append('id', this.id || 0);
      formData.append('idusuario', obj.idusuario);
      formData.append('title', obj.title);
      formData.append('label', obj.label);
      formData.append('classes', obj.classes);
      formData.append('startDate', obj.startDate);

      if (obj.endDate) {
        const format2 = "YYYY-MM-DD";
        const fAsesor = moment(obj.startDate).format(format2);
        const fVisita = moment(obj.endDate).format(format2);
        const resultado = (new Date(fVisita) - new Date(fAsesor)) / (1000 * 60 * 60 * 24);
        formData.append('dias_desface', resultado);
        formData.append('finalizar', "yes");
        formData.append('fecha_que_visita', obj.endDate);
      }

      formData.append('hora_inicio', obj.hora_inicio);
      formData.append('hora_fin', obj.hora_fin);
      formData.append('url', obj.url);
      formData.append('institucion_id', obj.institucion_id);
      formData.append('opciones', JSON.stringify(obj.opciones));
      formData.append('institucion_id_temporal', obj.institucion_id_temporal);
      formData.append('estado_institucion_temporal', obj.estado_institucion_temporal);
      formData.append('periodo_id_temporal', obj.periodo_id_temporal);
      formData.append('nombreInstitucion', obj.nombreInstitucion);
      formData.append('otraEditorial', obj.otraEditorial);
      formData.append('nombre_editorial', obj.nombre_editorial);
      formData.append('admin', 'yes');
      formData.append('usuario_editor', me.usuario.idusuario);
      formData.append('observacionAdmin', me.observacionAdmin);

      return formData;
    },
    abrirCantidadVisitas() {
      let me = this;
      if (me.filtro.asesor == null || me.filtro.asesor == undefined || me.filtro.asesor == "") {
        me.$f_notificacion('Seleccione un asesor para buscar la cantidad de visitas', 'warning', 'icon-info');
        return false
      }
      me.getCantidadVisitas();
      me.verCantidadVisitas = true
    },
    getCantidadVisitas() {
      let me = this;
      me.ReportVisitas = []
      const from = moment(me.fromDate).format('YYYY-MM-DD')
      const to = moment(me.toDate).format('YYYY-MM-DD')
      me.$vs.loading()
      this.$http.get(`${this.$server_url}cantidadVisitas?fromDate=${from}&toDate=${to}&asesor_id=${me.filtro.asesor.idusuario}`)
        .then(function (res) {
          me.$vs.loading.close()
          me.ReportVisitas = res.data.visitasInstitucion
          me.ReportVisitasTemporales = res.data.visitasInstitucionTemporal
        })
        .catch(function (e) {
        })
        .finally(function () {
          me.$vs.loading.close()
        })
    },
    //funciones para add planificacion
    modalAgregar() {
      let me = this;
      me.limpiar()
      if (me.filtro.asesor == null || me.filtro.asesor == undefined || me.filtro.asesor == "") {
        me.$f_notificacion('Seleccione un asesor para agregar una planificación', 'warning', 'icon-info');
        return false
      }
      localStorage.setItem('planificacion_asesor_id', me.filtro.asesor.idusuario)
      localStorage.setItem('planificacion_cedula', me.filtro.asesor.cedula)
      localStorage.setItem('planificacion_vendedor', me.filtro.asesor.vendedor)
      me.titulo = "Agregar planificación del asesor " + me.filtro.asesor.vendedor
      me.activePromptAddEvent = true
    },
    agregarInstitucionTemporal() {
      let me = this;
      if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
        me.$f_notificacion('Debe escribir una institución por favor', 'warning', 'icon-info');
        return false;
      }
      let formData = new FormData();
      formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
      formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
      formData.append('region', me.temporalInstitucion.region);
      formData.append('asesor_id', localStorage.planificacion_asesor_id);
      me.$vs.loading()
      this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
        .then(res => {
          me.$vs.loading.close()
          me.popupAddNuevaInstitucion = false;
          me.activePromptAddEvent = true
          me.seleccionadoInsitucion = false;
          me.nombreInstitucion = me.temporalInstitucion.nombre_institucion
          me.institucion_id_temporal = res.data.institucion_temporal_id
          me.institucionesAsesor = []
          me.periodo_id_temporal = res.data.periodo_id
          me.estado_institucion_temporal = 1;
          me.$f_notificacion("Se guardo correctamente", "success", "icon-check");
        })
    },
    //lista de ciudades para usar en el select
    listaCiudades() {
      let me = this
      this.$http.get(this.$server_url + `ciudad`).then(res => {
        me.arregloCiudad = res.data;
      })
        .catch(function (error) {
          console.log(error)
        })
    },
    regresar() {
      let me = this;
      me.seleccionadoInsitucion = false;
      me.institucionesAsesor = []
      me.error = false
    },
    asginarInstitucion(tr) {
      let me = this;
      if (me.tipo == 1) {
        me.institucion_id = tr.idInstitucion
        me.nombreInstitucion = tr.nombreInstitucion
        me.asesorSelect = tr.nombre_asesor + " " + tr.apellido_asesor
        me.estado_institucion_temporal = 0;
        me.seleccionadoInsitucion = false;
        me.institucionesAsesor = []
      } else {
        me.nombreInstitucion = tr.nombreInstitucion
        me.asesorSelect = me.filtro.asesor.vendedor
        me.institucion_id_temporal = tr.institucion_temporal_id
        me.institucionesAsesor = []
        me.periodo_id_temporal = tr.periodo_id
        me.estado_institucion_temporal = 1;
        me.seleccionadoInsitucion = false;
      }
    },
    getInstitucionAsesor() {
      let me = this;
      me.institucionesAsesor = [];
      if (me.busquedaInstitucion.length < 5) {
        me.$f_notificacion('Minimo 5 caracteres de busqueda', 'warning', 'icon-info');
        return false;
      }
      me.$vs.loading()
      var url = ""
      url = 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&todasInstituciones=yes'
      this.$http.get(this.$server_url + url)
        .then(function (res) {
          // me.tmpInstituciones = res.data;
          me.institucionesAsesor = res.data;
          // me.filtroRegion();
          me.$vs.loading.close()
          if (res.data.message) {
            me.$f_notificacion(res.data.message, 'warning', 'icon-user', 8000);
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    //instituciones creadas por el asesor
    getInstitucionCreadasByAsesor() {
      let me = this;
      me.institucionesAsesor = [];
      this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes' + '&asesor_id=' + me.filtro.asesor.idusuario)
        .then(function (res) {
          me.institucionesAsesor = res.data;
          me.$vs.loading.close()
          if (res.data.message) {
            me.$f_notificacion(res.data.message, 'warning', 'icon-user', 8000);
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    addEvent(accion) {
      let me = this
      me.error = false
      this.buildEventObject();

      if (this.institucion_id == "" && this.institucion_id_temporal == "") {
        if (me.longitudCapacitaciones > 1) {
          me.error = true
          me.messageError = "Existe mas de 2 capacitaciones para este libro, eliga para otro dia"
          me.activePromptAddEvent = true
          return false
        }
        me.error = true;
        me.messageError = "Seleccione una institución por favor";
        me.activePromptAddEvent = true
        return false;
      }
      if (this.title == '' || this.startDate == '' || this.hora_inicio == null) {
        me.error = true;
        me.messageError = "Campos con asterisco obligatorios";
        me.activePromptAddEvent = true
        return false;
      }

      // Validar que la fecha de finalización no sea menor a la fecha de inicio
      if (this.endDate && this.startDate) {
        const fechaInicio = new Date(this.startDate);
        const fechaFin = new Date(this.endDate);

        if (fechaFin < fechaInicio) {
          me.error = true;
          me.messageError = "La fecha de finalización no puede ser anterior a la fecha de inicio";
          me.activePromptAddEvent = true;
          return false;
        }
      }

      me.error = false;
      //validar que selecciona los checkbox
      let allFalse = Object.values(me.opciones).every(option => option === false);
      if (allFalse) {
        me.error = true;
        me.messageError = "Debe marcar al menos un recuadro";
        me.activePromptAddEvent = true;
        return false;
      }
      //si el asesor agrega otra editorial debe validarse que ingrese una institucion
      if (this.opciones.otraEditorial == true) {
        // si es tipo de institucion  de prolipa
        me.activePromptAddEvent = true
        if (this.nombre_editorial == "") {
          me.error = true;
          me.messageError = "Ha seleccionado otra editorial tiene que agregar una editorial por favor";
          me.activePromptAddEvent = true
          return false;
        }
        if (this.estado_institucion_temporal == 0) {
          if (this.institucion_id == "" || this.institucion_id == null || this.institucion_id == 0 || this.institucion_id == "null") {
            me.error = true;
            me.messageError = "Ha seleccionado otra editorial tiene que agregar una institución por favor";
            me.activePromptAddEvent = true
            return false;
          }
        }
        if (this.estado_institucion_temporal == 1) {
          if (this.institucion_id_temporal == "" || this.institucion_id_temporal == null || this.institucion_id_temporal == 0 || this.institucion_id_temporal == "null") {
            me.error = true;
            me.messageError = "Ha seleccionado otra editorial tiene que agregar una institución por favor";
            me.activePromptAddEvent = true
            return false;
          }
        }
      }
      let fecha1 = null
      let fecha2 = null
      if (this.startDate == null || this.startDate == undefined || this.startDate == "" || this.startDate == "null") { fecha1 = null } else { fecha1 = moment(this.startDate).format('YYYY-MM-DD') }
      if (this.endDate == null || this.endDate == undefined || this.endDate == "" || this.endDate == "null") { fecha2 = null } else { fecha2 = moment(this.endDate).format('YYYY-MM-DD') }
      const obj = {
        idusuario: localStorage.planificacion_asesor_id,
        id: this.id,
        title: this.title,
        startDate: fecha1,
        endDate: fecha2,
        classes: 'event-' + this.labelLocal.color,
        label: this.labelLocal.text,
        url: this.url,
        hora_inicio: this.hora_inicio.substring(0, 5),
        hora_fin: this.hora_fin.substring(0, 5),
        institucion_id: this.institucion_id,
        opciones: this.opciones,
        institucion_id_temporal: this.institucion_id_temporal,
        estado_institucion_temporal: this.estado_institucion_temporal,
        periodo_id_temporal: this.periodo_id_temporal,
        nombreInstitucion: this.nombreInstitucion,
        otraEditorial: this.opciones.otraEditorial,
        nombre_editorial: this.nombre_editorial
      }
      if (accion == "finaliza") {
        me.usuario_finaliza = me.usuario.idusuario;
      }
      me.save(obj, accion)
    },

    save(obj, accion) {
      let me = this;
      let formData = new FormData();
      // Siempre enviar ID
      if (this.id && this.id > 0) {
        formData.append('id', this.id);
      }
      console.log(me.usuario_finaliza, "usuario que finaliza", accion)
      // Campos obligatorios
      formData.append('idusuario', me.filtro.asesor.idusuario);
      formData.append('title', obj.title || '');
      formData.append('startDate', obj.startDate || '');
      // formData.append('observacionAdmin', me.observacionAdmin);
      // formData.append('usuario_finaliza', me.usuario_finaliza);
      // formData.append('usuario_editor', me.usuario.idusuario);

      if (accion == "finaliza" && this.isAdministrador) {
        formData.append('estado', 4);
        formData.append('admin', 'yes');
        formData.append('usuario_finaliza', this.usuario.idusuario || this.usuario.id);
        formData.append('observacionAdmin', this.observacionAdmin || '');
      }
      if (accion == "guarda") {
        formData.append('usuario_editor', this.usuario.idusuario || this.usuario.id);
      }
      // Verificar si existe fecha_captura_longitud_fin (fecha de visita)
      const tieneFechaVisita = this.fecha_captura_longitud_fin && this.fecha_captura_longitud_fin !== "";

      if (tieneFechaVisita) {
        // Extraer solo la fecha (YYYY-MM-DD) del datetime completo
        const fechaVisitaStr = this.fecha_captura_longitud_fin.split(' ')[0];

        formData.append('fecha_que_visita', fechaVisitaStr);
        formData.append('finalizar', "yes");

        // Calcular días de desfase si existe startDate
        if (obj.startDate) {
          const fechaInicio = new Date(obj.startDate);
          const fechaVisita = new Date(fechaVisitaStr);
          const diferenciaDias = (fechaVisita - fechaInicio) / (1000 * 60 * 60 * 24);
          formData.append('dias_desface', diferenciaDias);
        }
      }

      // Solo enviar hora_inicio si tiene valor
      if (obj.hora_inicio && obj.hora_inicio !== "") {
        formData.append('hora_inicio', obj.hora_inicio);
      }

      // Solo enviar hora_fin si tiene valor
      if (obj.hora_fin && obj.hora_fin !== "") {
        formData.append('hora_fin', obj.hora_fin);
      }

      // Solo enviar url si tiene valor
      if (obj.url && obj.url !== "") {
        formData.append('url', obj.url);
      }

      // Solo enviar institucion_id si tiene valor
      if (obj.institucion_id && obj.institucion_id !== "") {
        formData.append('institucion_id', obj.institucion_id);
      }

      // Solo enviar opciones si hay cambios
      if (obj.opciones && Object.keys(obj.opciones).length > 0) {
        formData.append('opciones', JSON.stringify(obj.opciones));
      }

      // Solo enviar institucion_id_temporal si tiene valor
      if (obj.institucion_id_temporal && obj.institucion_id_temporal !== "") {
        formData.append('institucion_id_temporal', obj.institucion_id_temporal);
      }

      // Solo enviar estado_institucion_temporal si tiene valor
      if (obj.estado_institucion_temporal !== undefined && obj.estado_institucion_temporal !== "") {
        formData.append('estado_institucion_temporal', obj.estado_institucion_temporal);
      }

      // Solo enviar periodo_id_temporal si tiene valor
      if (obj.periodo_id_temporal && obj.periodo_id_temporal !== "") {
        formData.append('periodo_id_temporal', obj.periodo_id_temporal);
      }

      // Solo enviar nombreInstitucion si tiene valor
      if (obj.nombreInstitucion && obj.nombreInstitucion !== "") {
        formData.append('nombreInstitucion', obj.nombreInstitucion);
      }

      // Solo enviar otraEditorial si es true
      if (obj.otraEditorial === true) {
        formData.append('otraEditorial', 'true');
      }

      // Solo enviar nombre_editorial si tiene valor
      if (obj.nombre_editorial && obj.nombre_editorial !== "") {
        formData.append('nombre_editorial', obj.nombre_editorial);
      }

      me.$vs.loading();

      this.$http.post(this.$server_url + 'save_planificacion', formData)
        .then(res => {
          me.$vs.loading.close();
          if (res.data.status == 0) {
            me.$f_notificacion(res.data.message, 'danger', 'icon-info');
            return false;
          }
          me.activePromptAddEvent = false;
          me.limpiar();
          me.getAllVisitas();
          me.$f_notificacion('Planificación guardada con éxito', 'success', 'icon-check');
        })
        .catch(function (error) {
          console.error('Error al guardar:', error);
          me.$vs.loading.close();
          me.$f_notificacion('Error al guardar la planificación', 'danger', 'icon-alert-circle');
        });
    },

    openConfirmarEliminar(tr) {
      let me = this;
      me.id = tr.id
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirmar`,
        text: 'Esta seguro de eliminar la planificación',
        accept: this.eliminarPlanificacion
      })
    },
    eliminarPlanificacion() {
      let me = this;
      let formData = new FormData();
      formData.append('id', this.id);
      formData.append('desactivar', 'yes');
      formData.append('usuario_editor', me.usuario.idusuario)
      me.$vs.loading()
      this.$http.post(this.$server_url + 'save_planificacion', formData)
        .then(res => {
          me.$vs.loading.close()
          me.limpiar();
          me.getAllVisitas()
          me.$f_notificacion('Planificación eliminada con exito', 'success', 'icon-check')

        })
        .catch(function (error) {
          me.$vs.loading.close()
        });

    },
    getInstitucionInfo(tr) {
      let me = this;
      if (tr.estado_institucion_temporal == "1") {
        this.asesorSelect = me.filtro.asesor.vendedor
      } else {
        this.$http.get(this.$server_url + `institucionActiva?idInstitucion=${tr.institucion_id}`)
          .then(function (res) {
            if (res.data.length > 0) {
              let nombreAsesor = res.data[0].nombres + " " + res.data[0].apellidos
              me.setNombre(nombreAsesor)
            }
          })
          .catch(function (error) {
            console.log(error + ' error');
          })
      }
    },
    setNombre(nombre) {
      this.asesorSelect = nombre
    },
    openEditPlanificacion(tr) {
      let me = this;
      me.limpiar()
      let datos = JSON.parse(tr.opciones)
      this.id = tr.id
      if (tr.title == null) {
        tr.title = ""
      } else {
        this.title = tr.title.split('(')[0]
      }
      this.startDate = tr.startDate
      // this.endDate = tr.fecha_que_visita
      this.endDate = tr.fecha_captura_longitud_fin
      this.url = tr.url
      if (tr.classes == null) {
      } else {
        this.labelLocal = {
          text: tr.label,
          color: tr.classes.split('-')[1]
        }
      }
      console.log('SIN SELLO', datos.sinSello);
      this.hora_inicio = tr.hora_inicio
      this.hora_fin = tr.hora_fin
      this.label_cancel = 'Cancelar'
      this.estado = tr.estado
      this.opciones.presentacion = datos.presentacion
      this.opciones.entrega_muestras = datos.entrega_muestras
      this.opciones.reunion = datos.reunion
      this.opciones.seguimiento = datos.seguimiento
      this.opciones.cierre = datos.cierre
      this.opciones.cobranza = datos.cobranza
      this.opciones.post_venta = datos.post_venta
      this.opciones.retiro_cartas = datos.retiro_cartas
      this.opciones.retiro_muestras = datos.retiro_muestras
      this.opciones.capacitacion = datos.capacitacion
      // this.opciones.sinSello = datos.sinSello
      this.opciones.sinSello = datos.sinSello !== undefined ? datos.sinSello : true;
      this.opciones.otraEditorial = datos.otraEditorial
      this.observacionAdmin = tr.observacionAdmin

      // Cargar el nombre de la editorial desde tr.otraEditorial
      if (tr.otraEditorial) {
        this.nombre_editorial = tr.otraEditorial
        this.opciones.otraEditorial = true
      } else {
        this.nombre_editorial = ""
      }

      if (tr.estado_institucion_temporal == "1") {
        this.nombreInstitucion = tr.nombre_institucion_temporal
        this.institucion_id_temporal = tr.institucion_id_temporal
        this.periodo_id_temporal = tr.periodo_id
        this.estado_institucion_temporal = 1
      } else {
        this.nombreInstitucion = tr.nombreInstitucion
        this.institucion_id = tr.institucion_id
        this.estado_institucion_temporal = 0
      }

      // Cargar ubicaciones para visualización
      this.longitud = tr.longitud
      this.latitud = tr.latitud
      this.fecha_captura_longitud = tr.fecha_captura_longitud
      this.latitud_fin = tr.latitud_fin
      this.longitud_fin = tr.longitud_fin
      this.fecha_captura_longitud_fin = tr.fecha_captura_longitud_fin

      this.activePromptAddEvent = true
    },
    limpiar() {
      let me = this;
      this.labelLocal = {
        text: 'Baja',
        color: 'success'
      }
      me.startDate = ""
      me.endDate = ""
      me.hora_inicio = ""
      me.hora_fin = ""
      me.title = "";
      me.titulo = "";
      me.hora_fin = "";
      me.nombre_institucion = "";
      me.url = "";
      me.nombreInstitucion = ""
      me.institucion_id = ""
      me.institucion_id_temporal = ""
      me.opciones.presentacion = false
      me.opciones.entrega_muestras = false
      me.opciones.reunion = false
      me.opciones.seguimiento = false
      me.opciones.cierre = false
      me.opciones.cobranza = false
      me.opciones.post_venta = false
      me.opciones.retiro_cartas = false
      me.opciones.retiro_muestras = false
      me.opciones.capacitacion = false
      me.opciones.sinSello = true
      me.id = ""
      me.latitud = null
      me.longitud = null
      me.fecha_captura_longitud = null
      me.latitud_fin = null
      me.longitud_fin = null
      me.fecha_captura_longitud_fin = null
      me.observacionAdmin = ""
    },
    //METODOS PARA EXPORTAR A EXCEL

    exportToExcel() {
      if (!this.codigoSelected.length) {
        this.$f_notificacion(
          'Seleccione al menos un registro para exportar',
          'warning',
          'icon-alert-triangle'
        )
        return
      }

      const fecha = moment().format('YYYY-MM-DD')
      const nombreArchivo =
        'reporte_visitas_' +
        this.asesorNombre.replace(/[^a-zA-Z0-9]/g, '_') +
        '_' +
        fecha

      const headers = [
        'Titulo',
        'Institución',
        'Periodo',
        'Asesor',
        'Fecha Planificada',
        'Inicio Visita',
        'Fin Visita',
        'Dias Diferencia',
        'Tiempo',
        'Estado',
        'Creador',
        'Finalizador',
        'Sello',
        'Obs. Asesor',
        'Obs. Admin'
      ]

      const keys = [
        'title',
        'institucion',
        'periodo',
        'asesor',
        'startDate',
        'inicio',
        'fin',
        'dias_diferencia',
        'tiempo',
        'estado',
        'creador',
        'finalizador',
        'sello',
        'obsAsesor',
        'obsAdmin'
      ]

      import('@/vendor/Export2Excel').then(excel => {
        const data = this.codigoSelected.map(v => {
          return keys.map(k => {
            switch (k) {
              case 'institucion':
                // Forzar estado a número para evitar problema string vs int
                const esTemporal = Number(v.estado_institucion_temporal) === 1

                if (esTemporal) {
                  return (
                    v.nombre_institucion_temporal ||
                    v.nombreInstitucionTemporal ||
                    v.nombreInstitucion ||
                    ''
                  )
                }

                return v.nombreInstitucion || ''

              case 'asesor':
                return this.asesorNombre

              case 'estado':
                return {
                  '0': 'Generada',
                  '1': 'Realizada',
                  '2': 'Eliminada',
                  '3': 'No realizada',
                  '4': 'Finalizada'
                }[v.estado] || '---'

              case 'inicio':
                return v.fecha_captura_longitud || ''

              case 'fin':
                return v.fecha_captura_longitud_fin || ''

              case 'startDate':
                if (!v.startDate) return ''
                return v.startDate.split(' ')[0]

              case 'dias_diferencia':
                if (!v.startDate || !v.fecha_captura_longitud_fin) return ''

                // Extraer solo YYYY-MM-DD
                const f1Str = v.startDate.split(' ')[0]
                const f2Str = v.fecha_captura_longitud_fin.split(' ')[0]

                // Parse manual seguro
                const p1 = f1Str.split('-')
                const p2 = f2Str.split('-')

                if (p1.length !== 3 || p2.length !== 3) return ''

                const fechaPlanificada = new Date(
                  Number(p1[0]),
                  Number(p1[1]) - 1,
                  Number(p1[2])
                )

                const fechaVisita = new Date(
                  Number(p2[0]),
                  Number(p2[1]) - 1,
                  Number(p2[2])
                )

                const diffMs = fechaVisita.getTime() - fechaPlanificada.getTime()
                const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24))

                // Forzar texto para que Excel NO lo rompa
                return `${diffDias}`

              case 'sello':
                return v.opciones && v.opciones.sinSello === false
                  ? 'Con sello'
                  : 'Sin sello'

              case 'obsAsesor':
                return v.url || ''

              case 'obsAdmin':
                return v.observacionAdmin || ''

              case 'tiempo':
                return this.calcularTiempo(v)

              default:
                return v[k] || ''
            }
          })
        })

        excel.export_json_to_excel({
          header: headers,
          data,
          filename: nombreArchivo,
          autoWidth: true,
          bookType: this.selectedFormat
        })

        this.codigoSelected = []
      })
    },


    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },

    calcularDias(inicio, fin) {
      if (!inicio || !fin) return ''
      const a = moment(inicio)
      const b = moment(fin)
      return b.diff(a, 'days')
    },

    calcularTiempo(v) {
      if (!v.fecha_captura_longitud || !v.fecha_captura_longitud_fin) return ''
      const m1 = moment(v.fecha_captura_longitud)
      const m2 = moment(v.fecha_captura_longitud_fin)
      const minutos = m2.diff(m1, 'minutes')
      const h = Math.floor(minutos / 60)
      const m = minutos % 60
      return h + 'h ' + m + 'm'
    },

    //limpiar campos para exportar de nuevo
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    //FIN METODOS PARA EXPORTAR A EXCEL

    // Método para abrir Google Maps en nueva pestaña
    verEnGoogleMaps(lat, lng) {
      if (lat && lng) {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
      }
    },

    // Método para formatear fecha y hora
    formatearFechaHora(fechaISO) {
      if (!fechaISO) return ''
      // Reemplazar espacio con 'T' para compatibilidad con navegadores
      const fechaFormat = fechaISO.includes(' ') ? fechaISO.replace(' ', 'T') : fechaISO;
      const fecha = new Date(fechaFormat)

      if (isNaN(fecha.getTime())) return fechaISO;

      const opciones = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return fecha.toLocaleDateString('es-ES', opciones)
    },

    formatFechaRango() {
      if (!this.filtroVisitaInicio && !this.filtroVisitaFin) return '';

      const inicio = moment(this.filtroVisitaInicio).format('DD/MM/YYYY');
      const fin = moment(this.filtroVisitaFin).format('DD/MM/YYYY');

      if (inicio === fin) {
        return inicio;
      }

      return `${inicio} - ${fin}`;
    },

    calcularDiasDiferencia(fechaGenera, fechaVisita) {
      if (!fechaGenera || !fechaVisita) return '';

      try {
        // Usar solo la parte de la fecha (YYYY-MM-DD)
        const fecha1Str = this.formatearFechaSoloDia(fechaGenera);
        const fecha2Str = this.formatearFechaSoloDia(fechaVisita);

        const fecha1 = new Date(fecha1Str);
        const fecha2 = new Date(fecha2Str);
        const diferenciaTiempo = fecha2 - fecha1;
        const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
        return diferenciaDias;
      } catch (e) {
        return '';
      }
    },
    formatJsonExport(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        switch (j) {
          case 'institucionFinal':
            if (v.estado_institucion_temporal == '1') {
              return v.nombre_institucion_temporal || '';
            }
            return v.nombreInstitucion || '';

          case 'periodo':
            return v.periodo || '';

          case 'asesor':
            // Nombre del asesor seleccionado
            return v.asesor || this.asesorSeleccionado || '';

          case 'startDate':
            return v.startDate ? v.startDate.split(' ')[0] : '';
            return v.startDate || '';


          case 'fecha_visita_inicio':
            return v.fecha_captura_longitud || '';
          case 'fecha_visita_fin':
            return v.fecha_captura_longitud_fin || '';

          case 'dias_diferencia':
            return this.calcularDiasDiferencia(v.startDate, v.fecha_captura_longitud_fin);

          case 'status':
            const estados = {
              '0': 'Generada',
              '1': 'Realizada',
              '2': 'Eliminada',
              '3': 'No realizada',
              '4': 'Finalizada'
            };
            return estados[v.estado] || 'Desconocido';

          case 'creador':
            return v.creador || '';

          case 'finalizador':
            return v.finalizador || '';

          case 'sello':
            // Manejar el objeto opciones para el sello
            if (v.opciones) {
              return v.opciones.sinSello === true ? 'No tiene sello' : 'Con sello';
            }
            return 'Sin información';

          case 'observacion_asesor':
            return v.url || v.observacionAsesor || '';

          case 'observacion_admin':
            return v.observacionAdmin || '';

          case 'tiempo':
            if (v.fecha_captura_longitud && v.fecha_captura_longitud_fin) {
              const tiempo = this.calcularHorasTrabajadasPorFechas(
                v.fecha_captura_longitud,
                v.fecha_captura_longitud_fin
              );
              return tiempo.texto || '';
            }
            return '';

          default:
            return v[j] || '';
        }
      }))
    },
    formatearFechaSoloDia(fecha) {
      if (!fecha) return '';

      // Si la fecha viene como "2026-04-22 00:00:00"
      if (typeof fecha === 'string') {
        return fecha.split(' ')[0]; // Retorna "2026-04-22"
      }

      // Si es un objeto Date
      if (fecha instanceof Date) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      return fecha;
    },
  }
}
</script>
<style scoped>
/* Contenedor principal */
.gestion-visitas-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.main-card {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header mejorado */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  margin: -20px -20px 30px -20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  backdrop-filter: blur(10px);
}

.title-text {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 5px 0 0 0;
}

/* Sección de filtros */
.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.filter-card {
  flex: 1;
  min-width: 300px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.filter-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 14px;
}

.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-option {
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-buttons .vs-button {
  font-weight: 600;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border-radius: 8px !important;
}

.action-buttons .vs-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Filtros de búsqueda */
.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.filter-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.input-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 13px;
}

.custom-select {
  width: 100%;
}

.date-range {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.date-input {
  flex: 1;
  min-width: 140px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.date-separator {
  color: #a0aec0;
  font-weight: 600;
}

/* Responsive */
@media(max-width: 768px) {
  .gestion-visitas-container {
    padding: 10px;
  }

  .header-section {
    padding: 20px;
  }

  .title-text {
    font-size: 22px;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-card {
    min-width: 100%;
  }

  .search-filters {
    grid-template-columns: 1fr;
  }

  .date-range {
    flex-direction: column;
    align-items: stretch;
  }

  .date-input {
    width: 100%;
  }
}

@media(max-width: 576px) {
  .filtroInstituciones {
    margin-top: 8px;
  }
}

/* Animación para el icono de loading */
.vs-button .feather-icon.icon-loader {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Barra de estadísticas compacta */
.stats-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
}

.stats-item i {
  font-size: 16px;
  opacity: 0.9;
}

.stats-item strong {
  font-size: 18px;
  font-weight: 700;
  margin-right: 2px;
}

.stats-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
}

.stats-date {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
}

/* Responsive */
@media(max-width: 768px) {
  .stats-bar {
    padding: 10px 15px;
    gap: 12px;
  }

  .stats-item {
    font-size: 12px;
  }

  .stats-item strong {
    font-size: 16px;
  }

  .stats-divider {
    height: 25px;
  }

  .stats-date {
    margin-left: 0;
    width: 100%;
    justify-content: center;
    margin-top: 5px;
  }
}

@media(max-width: 576px) {
  .stats-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .stats-item {
    justify-content: space-between;
    padding: 5px 0;
  }

  .stats-divider {
    display: none;
  }

  .stats-date {
    width: auto;
    justify-content: space-between;
  }
}
</style>
<style scoped>
/* institucion y asesor seleccionado */
/* Estilos para información de institución */
.alert-empty {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 12px 20px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #e67e22;
  font-weight: 500;
}

.alert-empty i {
  font-size: 20px;
}

.institution-info {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.info-content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.info-label {
  font-size: 11px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #2c3e50;
  margin-top: 2px;
}

.info-divider {
  width: 1px;
  height: 40px;
  background: #dee2e6;
}

/* Responsive */
@media(max-width: 768px) {
  .institution-info {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .info-divider {
    width: 100%;
    height: 1px;
  }

  .info-card {
    width: 100%;
    justify-content: center;
  }
}
</style>
