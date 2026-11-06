<template>
  <div>
    <div class="flex flex-wrap items-center justify-between px-6 pt-4 pb-2">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Capacitaciones</h2>
        <p class="text-sm text-gray-500">Gestión de capacitaciones y eventos del asesor</p>
      </div>
      <div class="flex gap-2 mt-2 sm:mt-0">
        <vs-button color="warning" @click="getFiltroporInstitucion()" icon="search" type="gradient">
          <span class="hidden sm:inline">Por institución</span>
          <span class="sm:hidden">Institución</span>
        </vs-button>
        <vs-button color="success" @click="modalAbierto = false; ListadoSolicitudes()" icon="description" type="gradient">
          <span class="hidden sm:inline">Solicitudes</span>
          <span class="sm:hidden">Solic.</span>
        </vs-button>
      </div>
    </div>

    <div class="px-6 pb-6" style="height: calc(100vh - 140px);">
      <div class="vx-card no-scroll-content" style="height: 100%;">
        <calendar-view ref="calendar" :displayPeriodUom="calendarView" :show-date="showDate"
          :events="simpleCalendarEvents" :eventTop="windowWidth <= 400 ? '2rem' : '3rem'" eventBorderHeight="0px"
          eventContentHeight="1.65rem" class="theme-default" @click-date="openAddNewEvent" @click-event="openEditEvent">
          <div slot="header" class="mb-4">
            <div class="vx-row no-gutter">
              <div class="vx-col w-1/3 items-center sm:flex hidden">
                <vs-button icon-pack="feather" class="mr-2" color="dark"
                  style="padding: 7px 10px 7px 10px; font-size: 14px;" icon="icon-plus"
                  @click="promptAddNewEvent(new Date())">Solicitar Capacitación</vs-button>
                <vs-button color="dark" type="border" style="padding: 7px 10px 7px 10px; font-size: 14px;"
                  @click="$router.go()">Hoy</vs-button>
              </div>
              <div class="vx-col sm:w-1/3 w-full sm:my-0 my-3 flex sm:justify-end justify-center order-last">
                <div class="flex items-center">
                  <feather-icon :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'" @click="updateMonth(-1)"
                    svgClasses="w-5 h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full" />
                  <span class="mx-3 text-lg font-medium whitespace-no-wrap">{{ showDate.toString().substring(0, 16) }}</span>
                  <feather-icon :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'" @click="updateMonth(1)"
                    svgClasses="w-5 h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full" />
                </div>
              </div>
              <div class="vx-col sm:w-1/3 w-full flex justify-center">
                <template v-for="(view, index) in calendarViewTypes">
                  <vs-button v-if="calendarView === view.val" :key="String(view.val) + 'filled'" type="filled"
                    style="padding: 7px 10px 7px 10px !important; font-size: 14px;" class="p-3 md:px-8 md:py-3"
                    :class="{ 'border-l-0': index, 'rounded-r-none': calendarViewTypes.length !== index + 1 }"
                    @click="calendarView = view.val">{{ view.label }}</vs-button>
                  <vs-button v-else :key="String(view.val) + 'border'" type="line"
                    style="padding: 7px 10px 7px 10px !important; font-size: 14px;" class="p-3 md:px-8 md:py-3"
                    :class="{ 'border-l-0': index, 'rounded-r-none': calendarViewTypes.length !== index + 1 }"
                    @click="calendarView = view.val">{{ view.label }}</vs-button>
                </template>
              </div>
            </div>
          </div>
        </calendar-view>
      </div>
    </div>

    <vs-popup background-color="rgba(255,255,255,.6)" fullscreen title="Capacitaciones del asesor"
      :active.sync="activePromptAddEvent">
      <div class="max-h-[75vh] overflow-y-auto px-1">
        <div v-if="error" class="mb-4">
          <vs-alert active="true" color="danger">
            {{ messageError }}
          </vs-alert>
        </div>

        <!-- <div v-if="seleccionadoInsitucion == false" class="flex items-center mb-4 flex-wrap gap-2">
          <vs-chip style="width: 100px;height: 30px;" class="text-white" :class="'bg-' + labelLocal.color">
            {{ labelLocal.text }}
          </vs-chip>
          <span v-if="estado == 0"><vs-chip color="danger">Cancelada</vs-chip></span>
          <span v-if="estado == 1"><vs-chip color="warning">Pendiente</vs-chip></span>
          <span v-if="estado == 2"><vs-chip color="success">Realizada</vs-chip></span>
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

        <div v-if="seleccionadoInsitucion == false" class="mb-3">
          <div v-if="nombreInstitucion == '' || nombreInstitucion == null"
            class="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <feather-icon icon="AlertCircleIcon" svgClasses="h-5 w-5 text-red-500" />
            <span class="text-red-600 font-medium text-sm">Sin Institución asignada</span>
          </div>
          <div v-else class="relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 shadow-sm">
            <div class="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-xl"></div>
            <div class="flex items-center justify-between pl-5 pr-3 py-3">
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                  <feather-icon icon="Building2Icon" svgClasses="h-5 w-5 text-emerald-600" />
                </div>
                <div class="flex flex-col">
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Institución Asignada</span>
                  <span class="text-emerald-800 font-bold text-sm leading-tight">{{ nombreInstitucion }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5" v-if="usuario.id_group == 11">
                <vs-button size="small" color="warning" type="flat" icon="swap_horiz"
                  @click="quitarInstitucion()"
                  class="text-xs rounded-lg !px-3 !py-1.5 hover:bg-amber-50 transition-colors duration-200">
                </vs-button>
                <vs-button size="small" color="danger" type="flat" icon="x"
                  @click="quitarInstitucion()"
                  class="text-xs rounded-lg !px-3 !py-1.5 hover:bg-red-50 transition-colors duration-200">
                </vs-button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="usuario.id_group == 11">
          <div v-if="seleccionadoInsitucion == true" class="flex items-center mb-3 gap-2">
            <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply" type="gradient"></vs-button>
            <vs-button size="small" @click="popupAddNuevaInstitucion = true; activePromptAddEvent = false;" type="relief">
              Añadir nueva institución
            </vs-button>
          </div>

          <div v-if="seleccionadoInsitucion == false" class="flex flex-wrap gap-2 mb-3">
            <vs-button color="warning" size="small"
              @click="seleccionadoInsitucion = true; tipo = 1; error = false" type="relief" icon="search">
              Asignar Institución Prolipa
            </vs-button>
            <vs-button color="primary" icon="folder" size="small"
              @click="seleccionadoInsitucion = true; getInstitucionCreadasByAsesor(); tipo = 2; getPeriodos()" type="relief">
              Mis Instituciones Creadas
            </vs-button>
          </div>

          <div v-if="seleccionadoInsitucion == true" class="flex gap-2 mb-3 p-1 bg-gray-100 rounded-lg">
            <vs-button size="small" :color="tipo == 1 ? 'warning' : 'gray'" :type="tipo == 1 ? 'filled' : 'line'"
              @click="tipo = 1; instituciones = []" icon="search" class="flex-1">
              Institución Prolipa
            </vs-button>
            <vs-button size="small" :color="tipo == 2 ? 'primary' : 'gray'" :type="tipo == 2 ? 'filled' : 'line'"
              @click="tipo = 2; getInstitucionCreadasByAsesor(); getPeriodos()" icon="folder" class="flex-1">
              Mis Instituciones
            </vs-button>
          </div>

          <div v-if="seleccionadoInsitucion == true && tipo == 1" class="flex gap-3 mb-4">
            <div class="flex-1">
              <vs-input icon="search" style="width:100%;" placeholder="Buscar mi institución" @keyup.enter="getInstitucion()"
                v-model="busquedaInstitucion" />
            </div>
            <div>
              <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            </div>
          </div>

          <div v-if="instituciones.length > 0" class="mb-4">
            <vs-table stripe max-items="5" search pagination :data="instituciones">
              <template slot="header">
                <div class="vx-row">
                  <div class="vx-col w-full m-3">
                    Cantidad: {{ instituciones.length }}
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
                  </vs-td>
                  <vs-td :data="data[indextr].nombreregion">
                    {{ data[indextr].nombreregion }} <br>
                    <small v-if="data[indextr].nombreprovincia">
                      <b>Provincia:</b> {{ data[indextr].nombreprovincia }}<br>
                    </small>
                    <small v-if="data[indextr].ciudad">
                      <b>Ciudad:</b> {{ data[indextr].ciudad }}<br>
                    </small>
                    <small v-if="data[indextr].parr_nombre">
                      <b>Parroquia:</b> {{ data[indextr].parr_nombre }}<br>
                    </small>
                    {{ data[indextr].periodo }} <br>
                    <small v-if="tr.statusPeriodo == 1" class="text-success font-bold">{{ tr.estadoPeriodo }}</small>
                    <small v-else>{{ tr.estadoPeriodo }}</small>
                  </vs-td>
                  <vs-td>
                    <div class="flex">
                      <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather"
                        icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr)">
                        Asignar
                      </vs-button>
                    </div>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </div>

        <div v-if="seleccionadoInsitucion == false">
          <div class="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <vs-button color="dark" size="small" type="line"
              @click="modalAbierto = true; popupSolicitudes = true; activePromptAddEvent = false" icon="event_note">
              Solicitar tema
            </vs-button>
            <div class="flex gap-3">
              <vs-radio color="primary" v-model="tipoCapacitacion" vs-name="radiosTipo" vs-value="0">Presencial</vs-radio>
              <vs-radio color="success" v-model="tipoCapacitacion" vs-name="radiosTipo" vs-value="1">Virtual</vs-radio>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div class="col-span-2 sm:col-span-1">
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Nivel (Oferta Académica) *</small>
              <v-select :options="ofertas" :reduce="oferta => oferta.idofertaAcademica" label="nombreofertaAcademica" class="w-full mt-1"
                v-model="oferta_academica" placeholder="Escoja el nivel (obligatorio)" @input="error = false" />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Área de Capacitación *</small>
              <v-select :options="areasCapacitacion" :reduce="area => area.value" label="label" class="w-full mt-1"
                v-model="area_capacitacion" placeholder="Escoja el área (obligatorio)" @input="error = false" />
            </div>
            <div class="col-span-2">
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Seleccione primero el tema luego la fecha</small>
              <v-select :options="temas" :reduce="temas => temas" label="tema" @input="borrar(); error = false" class="w-full mt-1"
                v-model="tema" />
            </div>
            <div>
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Fecha Capacitacion *</small>
              <datepicker class="w-full mt-1" :disabledDates="disabledDatesTo" @input="validar(); formatoFechas(); error = false;"
                name="end-date" v-model="endDate"></datepicker>
            </div>
            <div>
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Hora inicio *</small>
              <flat-pickr class="w-full mt-1" :config="configdateTimePicker" v-model="hora_inicio" />
            </div>
            <div>
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Hora fin *</small>
              <flat-pickr class="w-full mt-1" :config="configdateTimePicker" v-model="hora_fin" />
            </div>
            <div>
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Asistentes</small>
              <vs-input class="w-full mt-1" type="number" v-model="asistentes" />
            </div>
            <div>
              <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Link de la reunión</small>
              <vs-input class="w-full mt-1" type="text" v-model="link_reunion" />
            </div>
            <div class="col-span-2">
              <vs-textarea v-model="observacion" :counter="counter_long" label="Observación" height="100px"
                :counter-danger.sync="counterDanger"></vs-textarea>
            </div>
          </div>

          <div class="mt-4" v-if="capacitadores">
            <div class="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <feather-icon icon="UsersIcon" svgClasses="h-5 w-5 text-yellow-600" />
              <div>
                <span class="text-xs font-semibold uppercase text-yellow-600">Capacitadores</span>
                <p class="text-yellow-800 font-medium">{{ capacitadores }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <vs-divider>
            <div class="flex items-center gap-2">
              <feather-icon icon="CalendarIcon" svgClasses="h-4 w-4" />
              <span>Capacitaciones planificadas para ese día</span>
            </div>
          </vs-divider>
          <div v-if="encontrarCapacitaciones.length > 0">
            <vs-table max-items="3" search pagination :data="encontrarCapacitaciones">
              <template slot="header">
                Cantidad: <span class="font-bold">{{ encontrarCapacitaciones.length }}</span>
              </template>
              <template slot="thead">
                <vs-th>Tema</vs-th>
                <vs-th>Institución</vs-th>
                <vs-th>Hora</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    {{ tr.tema }}<br>
                    Capacitador: <span>{{ data[indextr].capacitador }}</span>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.estado_institucion_temporal == '1'">
                      {{ tr.nombre_institucion_temporal }}<br>
                      {{ tr.ciudad_temporal }}<br>
                      Asesor: <span>{{ tr.vendedor }}</span>
                    </div>
                    <div v-else>
                      {{ tr.nombreInstitucion }}<br>
                      {{ tr.ciudad }}<br>
                      Asesor: <span>{{ tr.vendedor }}</span>
                    </div>
                  </vs-td>
                  <vs-td>
                    Hora inicio: <span>{{ tr.hora_inicio }}</span> <br>
                    Hora Fin: <span>{{ tr.hora_fin }}</span>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
          <div v-else>
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <feather-icon icon="CalendarOffIcon" svgClasses="h-12 w-12 mb-2 opacity-50" />
              <p class="text-center">No hay capacitaciones para ese día</p>
            </div>
          </div>
        </div>

        <div v-if="id != 0 && seleccionadoInsitucion == false" class="mt-4">
          <vs-divider>
            <div class="flex items-center gap-2">
              <feather-icon icon="ClipboardIcon" svgClasses="h-4 w-4" />
              <span>Encuestas</span>
            </div>
          </vs-divider>
          <certificados-asignar-encuesta
            v-if="capacitacionEncuesta"
            :capacitacion="capacitacionEncuesta"
            :key="'enc-' + capacitacionEncuesta.id_seminario + '-' + encuestaReloadKey"
          />
        </div>

        <div class="flex justify-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
          <vs-button @click="addEvent()" type="relief" icon="save" color="primary">
            Guardar
          </vs-button>
          <vs-button color="warning" @click="removeEvent()" type="relief" icon="close">
            {{ label_cancel }}
          </vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución"
      :active.sync="popupAddNuevaInstitucion">
      <div class="flex items-center gap-2 mb-4">
        <vs-button size="small" color="success" radius=""
          @click="popupAddNuevaInstitucion = false; activePromptAddEvent = true;" icon="reply" type="gradient"></vs-button>
        <span class="text-gray-500 text-sm">Volver al formulario</span>
      </div>
      <div class="mt-3 space-y-4">
        <div class="flex justify-center gap-4">
          <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos()" vs-name="radios1"
            vs-value="1">Sierra</vs-radio>
          <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos()" vs-name="radios1"
            vs-value="2">Costa</vs-radio>
        </div>
        <div>
          <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Seleccione una ciudad:</small>
          <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full mt-1"
            v-model="temporalInstitucion.ciudad" />
        </div>
        <div>
          <small class="text-xs font-semibold uppercase tracking-wide text-gray-400">Seleccione un período:</small>
          <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar"
            label="periodoescolar" class="w-full mt-1" v-model="temporalInstitucion.periodo" />
        </div>
        <div>
          <vs-input label="Escriba un nombre para la institución" class="w-full"
            v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
        </div>
        <div class="flex justify-center">
          <vs-button @click="agregarInstitucionTemporal()" type="gradient" icon="add" color="success">
            Agregar Institución
          </vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup class="holamundo" fullscreen title="Listado de Capacitaciones" :active.sync="popupFiltroInstitucion">
      <vs-table max-items="10" stripe search pagination :data="filtroInstituciones">
        <template slot="header">
          <vs-chip color="primary">Cantidad: {{ filtroInstituciones.length }}</vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Titulo</vs-th>
          <vs-th>Fecha inicio</vs-th>
          <vs-th>Fecha Fin</vs-th>
          <vs-th>Hora</vs-th>
          <vs-th>Institución</vs-th>
          <vs-th>Estado</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ data[indextr].nombre }}<br></vs-td>
            <vs-td>{{ data[indextr].fecha_inicio }}<br></vs-td>
            <vs-td>{{ data[indextr].fecha_fin }}<br></vs-td>
            <vs-td>{{ data[indextr].hora_inicio }}<br>{{ tr.hora_fin }}</vs-td>
            <vs-td>
              <div v-if="tr.estado_institucion_temporal == '1'">
                {{ tr.nombre_institucion_temporal }}<br>
                {{ tr.periodoescolar }}
              </div>
              <div v-else>
                {{ tr.nombreInstitucion }}<br>
                {{ tr.periodoescolar }}
              </div>
            </vs-td>
            <vs-td>
              <span v-if="data[indextr].estado_capacitacion == 0"><br><vs-chip color="danger">Cancelada</vs-chip></span>
              <span v-if="data[indextr].estado_capacitacion == 1"><br><vs-chip color="warning">Pendiente</vs-chip></span>
              <span v-if="data[indextr].estado_capacitacion == 2"><br><vs-chip color="success">Realizada</vs-chip></span>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>

    <vs-popup class="holamundo" fullscreen title="Solicitudes" :active.sync="popupSolicitudes"
      @close="openModalCapaticion">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-center text-white font-bold p-4 rounded-lg mb-4">
        <feather-icon icon="InfoIcon" svgClasses="h-5 w-5 inline-block mr-1" />
        El tema solicitado debe ser aprobado por la administración para que pueda solicitar su capacitación.
      </div>
      <vs-divider>
        <div class="flex items-center gap-2">
          <feather-icon icon="PlusCircleIcon" svgClasses="h-4 w-4" />
          <span>Crear solicitudes</span>
        </div>
      </vs-divider>
      <div class="vx-row">
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <vs-input label="Tema" placeholder="Escriba el tema que solicita" class="w-full" v-model="txtTema" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <vs-input label="Observación" placeholder="Comentario" class="w-full" v-model="txtObservacion" />
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <vs-button color="success" @click="solicitarTema()" type="relief" icon="send">
          Solicitar Tema
        </vs-button>
      </div>
      <vs-divider>
        <div class="flex items-center gap-2">
          <feather-icon icon="ListIcon" svgClasses="h-4 w-4" />
          <span>Lista de solicitudes</span>
        </div>
      </vs-divider>
      <vs-table max-items="10" stripe search pagination :data="arregloSolicitudes">
        <template slot="thead">
          <vs-th>Tema</vs-th>
          <vs-th>Observacion</vs-th>
          <vs-th>Comentario Admin</vs-th>
          <vs-th>Estado</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ data[indextr].tema }}<br></vs-td>
            <vs-td>{{ data[indextr].observacion }}<br></vs-td>
            <vs-td>{{ data[indextr].comentario_admin }}<br></vs-td>
            <vs-td>
              <span v-if="data[indextr].estado == 0"><br><vs-chip color="danger">Generado</vs-chip></span>
              <span v-if="data[indextr].estado == 1"><br><vs-chip color="warning">Tema Creado</vs-chip></span>
              <span v-if="data[indextr].estado == 2"><br><vs-chip color="success">No se pudo crear</vs-chip></span>
            </vs-td>
            <vs-td>
              <vs-button line-position="top" size="small" icon="delete" line-origin="left" @click="openConfirm(tr)"
                color="danger" type="relief">Eliminar</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>

    <vs-popup class="popup-confim-delete" title="Confirmar Eliminación" :active.sync="popupConfirmDelete">
      <div class="p-6 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <feather-icon icon="Trash2Icon" svgClasses="h-8 w-8 text-red-500" />
          </div>
        </div>
        <p class="mb-2 font-semibold text-lg text-gray-800">¿Está seguro de eliminar esta capacitación?</p>
        <p class="text-gray-500 text-sm mb-6">Esta acción no se puede deshacer</p>
        <div class="flex justify-center gap-3">
          <vs-button color="danger" @click="deleteEvent()" type="filled" icon="check">
            Sí, eliminar
          </vs-button>
          <vs-button color="primary" type="border" @click="popupConfirmDelete = false" icon="close">
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import {
  CalendarView,
  CalendarViewHeader
} from 'vue-simple-calendar'
import moduleCalendar from '@/store/calendario_capacitacion/moduleCalendar.js'
require('vue-simple-calendar/static/css/default.css')
import vSelect from 'vue-select'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
  en,
  he
} from 'vuejs-datepicker/src/locale'
import CertificadosAsignarEncuesta from '../../certificados/components/CertificadosAsignarEncuesta.vue'

export default {
  components: {
    CalendarView,
    CalendarViewHeader,
    Datepicker,
    flatPickr,
    'v-select': vSelect,
    CertificadosAsignarEncuesta,
    temaSolicitud: '',
  },
  data() {
    return {
      capacitacionEncuesta: null,
      encuestaReloadKey: 0,
      popupConfirmDelete: false,
      popupSolicitudes: false,
      counterDanger: false,
      ciudadSelect: '',
      popupAddNuevaInstitucion: false,
      seleccionadoInsitucion: false,
      nombreInstitucion: '',
      busquedaInstitucion: "",
      instituciones: [],
      popupaddInstitucion: false,
      tipoCapacitacion: '0',
      usuario: [],
      showDate: new Date(),
      disabledFrom: false,
      titulo: '',
      id: 0,
      title: '',
      startDate: '',
      observacion: '',
      capacitadores: '',
      endDate: '',
      labelLocal: {
        text: 'Baja',
        color: 'success'
      },
      startDate_send: '',
      endDate_send: '',
      langHe: he,
      langEn: en,

      tema: '',
      calendarView: 'month',

      activePromptAddEvent: false,
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
      arregloCiudad: [],
      temporalInstitucion: {
        ciudad: '',
        nombreInstitucion: '',
        region: '2',
        periodo: ''
      },
      institucion_id_temporal: '',
      estado_institucion_temporal: 0,
      periodo_id_temporal: 0,
      nombreInstitucionTemporal: '',
      estado: '5',
      temas: [],
      longitudCapacitaciones: 0,
      error: false,
      messageError: "",
      filtroInstituciones: [],
      popupFiltroInstitucion: false,
      txtTema: '',
      txtObservacion: '',
      arregloSolicitudes: [],
      encontrarCapacitaciones: [],
      arregloPeriodos: [],
      tipo: '1',
      asesores: [],
      asesor: null,
      asistentes: 0,
      counter_long: 200,
      counterDanger: false,
      link_reunion: '',
      modalAbierto: false,
      ofertas: [],
      oferta_academica: null,
      areasCapacitacion: [
        { label: 'PEDAGOGIA', value: 'PEDAGOGIA' },
        { label: 'PSICOLOGIA', value: 'PSICOLOGIA' }
      ],
      area_capacitacion: null,
    }
  },
  computed: {
    simpleCalendarEvents() {
      this.getTemas()
      return this.$store.state.calendar.events
    },
    disabledDatesTo() {
      const hoy = new Date();
      let fecha = moment(hoy).add(4, 'days');
      let fechaActual = moment(hoy).add(5, 'days');
      let obtenerFecha = new Date(fechaActual)
      let convertir = moment(obtenerFecha, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
      localStorage.setItem('fecha_actual', convertir)
      return {
        to: new Date(fecha)
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
    }
  },
  methods: {
    getPeriodos() {
      let me = this
      me.arregloPeriodos = []
      this.$http.get(this.$server_url + 'get_periodos_pedidos')
        .then(res => {
          let datos = res.data
          me.arregloPeriodos = datos.filter(p => p.estado == 1 && p.region_idregion == me.temporalInstitucion.region)
        })
        .catch(function (error) {
        })
    },
    getInstitucionCreadasByAsesor() {
      let me = this;
      me.temporalInstitucion = {
        ciudad: '',
        nombreInstitucion: '',
        region: '2',
        periodo: ''
      }
      me.instituciones = [];
      this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes' + '&asesor_id=' + me.usuario.idusuario)
        .then(function (res) {
          me.instituciones = res.data;
          me.$vs.loading.close()
          if (res.data.message) {
            me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user',
              time: 8000
            })
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    openConfirm(tr) {
      let me = this;
      if (tr.estado == 1) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'No se puede eliminar por que el tema ya esta creado'
        })
        return false
      }
      me.id = tr.id
      me.popupSolicitudes = false
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirmación`,
        text: 'Estas seguro de eliminar la solicitud.',
        accept: this.eliminarSolicitud,
        cancel: this.cancel
      })
    },
    cancel() {
      let me = this;
      me.popupSolicitudes = true
    },
    eliminarSolicitud() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'solicitarTema?id=' + me.id + '&eliminar=yes')
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'Se elimino correctamente'
          })
          me.ListadoSolicitudes()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    ListadoSolicitudes() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'solicitarTema?asesor_id=' + me.usuario.idusuario + '&listado=yes')
        .then(function (res) {
          me.$vs.loading.close()
          me.popupSolicitudes = true
          me.arregloSolicitudes = res.data;
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    solicitarTema() {
      let me = this;
      if (me.txtTema == '') {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: "El campo tema no puede quedar vacio"
        })
        return false
      }
      if (me.txtTema.length > 100) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: "El campo tema no puede ser mayor a 100 caracteres"
        })
        return false
      }
      me.$vs.loading();
      this.$http.get(this.$server_url + 'solicitarTema?asesor_id=' + me.usuario.idusuario + '&tema=' + me.txtTema + '&observacion=' + me.txtObservacion)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: res.data.message
          })
          me.txtTema = ''
          me.txtObservacion = ''
          me.ListadoSolicitudes()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    openModalCapaticion() {
      let me = this
      if (me.modalAbierto) {
        me.activePromptAddEvent = true
      }
    },
    getFiltroporInstitucion() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'filtroCapacitacionInstitucion?asesor_id=' + me.usuario.idusuario)
        .then(function (res) {
          me.filtroInstituciones = res.data
          me.popupFiltroInstitucion = true
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    borrar() {
      let me = this;
      me.endDate = ""
    },
    getTemas() {
      let me = this;
      this.$http.get(this.$server_url + 'temasCapacitacion')
        .then(function (res) {
          me.temas = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    getOfertas() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'nivel')
        .then(function (res) {
          me.ofertas = res.data.oferta
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    agregarInstitucionTemporal() {
      let me = this;
      if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'Debe escribir una institución por favor'
        })
        return false;
      }
      if (me.temporalInstitucion.periodo == null || me.temporalInstitucion.periodo == "" || me.temporalInstitucion.periodo == undefined) {
        me.$vs.notify({
          color: 'primary',
          title: 'Mensaje',
          text: 'Debe seleccionar un período por favor'
        })
        return false;
      }
      let formData = new FormData();
      formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
      formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
      formData.append('region', me.temporalInstitucion.region);
      formData.append('periodo', me.temporalInstitucion.periodo);
      formData.append('asesor_id', me.usuario.idusuario);
      me.$vs.loading()
      this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
        .then(res => {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            return
          }
          me.popupAddNuevaInstitucion = false;
          me.activePromptAddEvent = true
          me.seleccionadoInsitucion = false;
          me.nombreInstitucion = me.temporalInstitucion.nombre_institucion
          me.institucion_id_temporal = res.data.institucion_temporal_id
          me.instituciones = []
          me.periodo_id_temporal = res.data.periodo_id
          me.estado_institucion_temporal = 1;

          me.$vs.notify({
            text: "Se creo la institución correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        })
    },
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
      me.instituciones = []
    },
    quitarInstitucion() {
      let me = this;
      me.institucion_id = '';
      me.institucion_id_temporal = '';
      me.nombreInstitucion = '';
      me.estado_institucion_temporal = 0;
      me.periodo_id_temporal = 0;
      me.instituciones = [];
      me.seleccionadoInsitucion = false;
      me.$vs.notify({
        text: 'Institución removida, seleccione una nueva',
        color: 'warning',
        iconPack: 'feather',
        icon: 'icon-alert-circle'
      })
    },
    asginarInstitucion(tr) {
      let me = this;
      if (me.tipo == 1) {
        me.institucion_id = tr.idInstitucion
        me.nombreInstitucion = tr.nombreInstitucion
        me.estado_institucion_temporal = 0;
        me.seleccionadoInsitucion = false;
        me.instituciones = []
      } else {
        me.nombreInstitucion = tr.nombreInstitucion
        me.institucion_id_temporal = tr.institucion_temporal_id
        me.instituciones = []
        me.periodo_id_temporal = tr.periodo_id
        me.estado_institucion_temporal = 1;
        me.seleccionadoInsitucion = false;
      }
    },
    getInstitucion() {
      let me = this;
      me.instituciones = [];
      if (me.busquedaInstitucion.length < 5) {
        me.$vs.notify({
          text: 'Minimo 5 caracteres de busqueda',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return false;
      }
      me.$vs.loading()
      var url = this.$server_url + 'listaInsitucion?asesor=yes&busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula
      this.$http.get(url)
        .then(function (res) {
          me.instituciones = res.data;
          me.$vs.loading.close()
          if (res.data.message) {
            me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user',
              time: 8000
            })
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    validar() {
      let me = this
      me.encontrarCapacitaciones = []
      if (this.tema == '' || this.tema == null || this.tema == undefined) {
        this.$vs.notify({
          text: 'Debe seleccionar un tema por favor.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.endDate = ""
        return
      }
      let fecha = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
      this.$http.get(this.$server_url + 'temasCapacitacion?validarPorFecha=yes&fecha=' + fecha + '&tema_id=' + this.tema.id)
        .then(function (res) {
          me.longitudCapacitaciones = res.data.length
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
      me.capacitacionesToday(fecha)
    },
    capacitacionesToday(fecha) {
      let me = this;
      this.$http.get(this.$server_url + 'temasCapacitacion?encontrarCapacitaciones=yes&fecha=' + fecha)
        .then(function (res) {
          me.encontrarCapacitaciones = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    addEvent() {
      let me = this;
      if (this.endDate == "Invalid date" || this.endDate == "") {
        me.error = true
        me.endDate = ""
        me.startDate = ""
        me.startDate_send = ""
        me.endDate_send = ""
        me.tema = ""
        me.messageError = "Debe seleccionar un tema y luego seleccionar la fecha por favor"
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false
      }
      if (this.estado == 2) {
        me.error = true
        me.messageError = "La capacitación ya fue realizada ya no puede ser modificada"
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false
      }
      if (this.estado == 0) {
        me.error = true
        me.messageError = "La capacitación fue cancelada ya no puede ser modificada"
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false
      }

      if (this.institucion_id == "" && this.institucion_id_temporal == "") {
        me.error = true;
        me.messageError = "Seleccione una institución por favor";
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false;
      }
      if (this.oferta_academica == null || this.oferta_academica == '' || this.oferta_academica == undefined) {
        me.error = true;
        me.messageError = "Debe seleccionar el nivel (Oferta Académica) por favor";
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false;
      }
      if (this.area_capacitacion == null || this.area_capacitacion == '' || this.area_capacitacion == undefined) {
        me.error = true;
        me.messageError = "Debe seleccionar el área de capacitación por favor";
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false;
      }
      if (this.endDate_send == '' || this.hora_inicio == '' || this.hora_fin == '' || this.tema == '' || this.tema == null || this.tema == undefined) {
        me.error = true;
        me.messageError = "Complete los campos por favor";
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false;
      }
      let fecha = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
      let fechaActual = localStorage.getItem("fecha_actual")
      if (fecha < fechaActual) {
        me.error = true
        me.messageError = "Debe seleccionar la fecha que empieze desde " + fechaActual
        me.$vs.notify({
          text: me.messageError,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.activePromptAddEvent = true
        return false
      } else {
        let asesor = me.asesor ? me.asesor.idusuario : me.usuario.idusuario
        const obj = {
          idusuario: this.usuario.idusuario,
          id: this.id,
          title: this.tema.tema,
          observacion: this.observacion,
          startDate: this.endDate_send,
          endDate: this.endDate_send,
          classes: 'event-' + this.labelLocal.color,
          label: this.labelLocal.text,
          capacitadores: this.capacitadores,
          tema_id: this.tema.id,
          capacitador: this.tema.capacitador,
          hora_inicio: this.hora_inicio.substring(0, 5),
          hora_fin: this.hora_fin.substring(0, 5),
          institucion_id: this.institucion_id,
          institucion_id_temporal: this.institucion_id_temporal,
          estado_institucion_temporal: this.estado_institucion_temporal,
          periodo_id_temporal: this.periodo_id_temporal,
          nombreInstitucion: this.nombreInstitucion,
          tipo: this.tipoCapacitacion,
          asistentes: this.asistentes,
          link_reunion: this.link_reunion,
          oferta_academica: this.oferta_academica,
          area_capacitacion: this.area_capacitacion,
        }

        const handleSuccess = (res) => {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Guardado correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.activePromptAddEvent = false
          me.clearFields()
        }

        const handleError = (error) => {
          me.$vs.loading.close()
          me.$vs.notify({
            text: error,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        }

        me.$vs.loading()
        if (this.id != 0) {
          this.$store.dispatch('calendar/editEvent', obj)
            .then(handleSuccess)
            .catch(handleError)
        } else {
          this.$store.dispatch('calendar/addEvent', obj)
            .then(handleSuccess)
            .catch(handleError)
        }
      }
    },
    updateMonth(val) {
      this.showDate = this.$refs.calendar.getIncrementedPeriod(val)
    },
    clearFields() {
      this.error = false
      this.messageError = ""
      this.tipoCapacitacion = '0'
      this.title = this.endDate = null
      this.id = 0
      this.labelLocal = {
        text: 'Baja',
        color: 'success'
      }
      this.label_cancel = 'Cancelar'
      this.institucion_id = ""
      this.institucion_id_temporal = ""
      this.estado = 5;
      this.observacion = ""
      this.capacitadores = ""
      this.nombreInstitucion = ""
      this.startDate = ""
      this.endDate = ""
      this.hora_inicio = ""
      this.hora_fin = ""
      this.url = ""
      this.tema = ""
      this.encontrarCapacitaciones = []
      this.capacitacionEncuesta = null
      this.oferta_academica = null
      this.area_capacitacion = null
    },
    promptAddNewEvent(date) {
      let me = this;
      if (!this.isWithinAllowedTimeRange()) {
        me.$f_notificacion("Esta fuera de horario de oficina para agendar","danger","alert-triangle","6000")
        return;
      }
      me.getTemas()
      this.disabledFrom = false
      this.addNewEventDialog(date)
      this.tema = ""
      this.endDate = null
      me.encontrarCapacitaciones = []
    },
    addNewEventDialog(date) {
      this.clearFields()
      this.startDate = date
      this.formatoFechas()
      this.activePromptAddEvent = true
    },
    openAddNewEvent(date) {
      this.getTemas()
      this.disabledFrom = true
      this.addNewEventDialog(date)
    },
    openEditEvent(event) {
      this.getTemas()
      this.error = false
      this.messageError = ""
      this.nombreInstitucion = ""
      const e = this.$store.getters['calendar/getEvent'](event.id)
      this.id = e.id
      this.title = e.title.split('(')[0]
      this.startDate = e.startDate
      this.endDate = e.endDate

      this.capacitacionEncuesta = {
        id_seminario: e.id,
        nombre: e.title
      }
      this.encuestaReloadKey++
      this.labelLocal = {
        text: e.label,
        color: e.classes.split('-')[1]
      }
      this.startDate_send = this.startDate
      this.endDate_send = this.endDate
      this.hora_inicio = e.hora_inicio
      this.hora_fin = e.hora_fin
      this.label_cancel = 'Eliminar Capacitación'
      this.activePromptAddEvent = true
      this.estado = e.estado
      this.observacion = e.observacion
      this.capacitadores = e.capacitadores
      if (e.estado_institucion_temporal == "1") {
        this.nombreInstitucion = e.nombre_institucion_temporal
        this.institucion_id_temporal = e.institucion_id_temporal
        this.periodo_id_temporal = e.periodo_id
        this.estado_institucion_temporal = 1
      } else {
        this.nombreInstitucion = e.nombreInstitucion
        this.institucion_id = e.institucion_id
        this.estado_institucion_temporal = 0
      }
      this.tipoCapacitacion = e.tipo
      this.tema = {
        id: e.tema_id,
        tema: e.title,
        capacitador: e.capacitador
      }
      this.link_reunion = e.link_reunion
      this.asistentes = e.cant_asistentes || e.asistentes || 0
      this.oferta_academica = e.oferta_academica
      this.area_capacitacion = e.area_capacitacion
    },
    removeEvent() {
      let me = this;
      if (this.estado == 2) {
        me.error = true
        me.messageError = "La capacitación ya fue realizada ya no puede ser modificada"
        me.activePromptAddEvent = true
        return false
      }
      if (this.label_cancel == "Cancelar") {
        me.activePromptAddEvent = false
        return
      }
      if (this.id == 0) {
        return
      }

      me.popupConfirmDelete = true
    },
    deleteEvent() {
      let me = this;
      me.$vs.loading({
          text: 'Eliminando capacitación...'
      })

      this.$store.dispatch('calendar/removeEvent', this.id)
        .then(() => {
          me.$vs.loading.close()
          me.popupConfirmDelete = false
          me.$vs.notify({
            text: "Capacitación eliminada correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.activePromptAddEvent = false
          me.$store.dispatch('calendar/fetchEvents')
        })
        .catch((error) => {
          me.$vs.loading.close()
          me.popupConfirmDelete = false
          const msg = (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : 'No se puede eliminar esta capacitación'
          me.$vs.notify({
            text: msg,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            time: 6000
          })
        })
    },
    eventDragged(event, date) {
      const e = this.$store.getters['calendar/getEvent'](event.id)
      this.$store.dispatch('calendar/eventDragged', {
        event,
        date
      })
    },
    formatoFechas() {
      this.error = false
      this.startDate_send = moment(this.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      this.endDate_send = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    },
    getAsesores() {
      const me = this;
      me.$http.get(this.$server_url + 'listaAsesores')
        .then(function (res) {
          me.asesores = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    isWithinAllowedTimeRange() {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (dayOfWeek === 1 && (currentHour < 4 || (currentHour === 4 && currentMinutes < 0))) {
          return false;
        }
        if (dayOfWeek === 5 && (currentHour > 17 || (currentHour === 17 && currentMinutes > 30))) {
          return false;
        }
        return true;
      }

      return false;
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    if (this.$store.state.calendar) {
      this.$store.unregisterModule('calendar')
    }

    this.$store.registerModule('calendar', moduleCalendar)
    this.$store.dispatch('calendar/fetchEvents')
    this.$store.dispatch('calendar/fetchEventLabels')
    this.listaCiudades()
    this.institucion_id = ""
    this.institucion_id_temporal = ""
    this.getTemas()
    this.getAsesores()
  },
  mounted() {
    let me = this;
    me.getOfertas();
  },
  beforeDestroy() {
    this.$store.unregisterModule('calendar')
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/apps/simple-calendar.scss";

.popup-confim-delete {
  z-index: 100000 !important;
}

.popup-confim-delete .vs-popup--background {
  z-index: 100000 !important;
}

.popup-confim-delete .vs-popup {
  z-index: 100001 !important;
}

// Estilos para mejorar la apariencia del formulario
.vs-popup {
  border-radius: 12px;
}

.vs-popup--header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.vs-popup--header h3 {
  font-weight: 700;
  color: #1f2937;
}

// Estilos para los campos del formulario
.vs-input {
  border-radius: 8px;
}

// Estilos para los botones de tipo relief
.vs-button--relief {
  border-radius: 8px;
  font-weight: 600;
}

// Estilos para las tablas dentro del popup
.vs-popup .vs-table {
  border-radius: 8px;
  overflow: hidden;
}

.vs-popup .vs-table--header {
  background-color: #f9fafb;
}

.vs-popup .vs-table--td {
  border-color: #e5e7eb;
}

// Mejora de chips
.vs-chip {
  border-radius: 20px;
  font-weight: 500;
}

// Estilos para selects
.vs__dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

// Responsive improvements
@media (max-width: 640px) {
  .vs-popup {
    width: 95% !important;
    height: 90% !important;
  }
}
</style>
