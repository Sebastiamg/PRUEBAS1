<template>
  <div>
    <div style="display:flex;">
      <vs-button color="warning" class="ml-5 mt-2" @click="getFiltroporInstitucion()" icon="search" type="filled">Ver
        capacitaciones por institución</vs-button>
      <vs-button color="success" class="ml-5 mt-2" @click="modalAbierto = false; ListadoSolicitudes()"
        icon="description" type="filled">Solicitudes de temas</vs-button>
    </div>
    <div id="simple-calendar-app">
      <div class="vx-card no-scroll-content" style="height: 100vh;">
        <calendar-view ref="calendar" :displayPeriodUom="calendarView" :show-date="showDate"
          :events="simpleCalendarEvents" :eventTop="windowWidth <= 400 ? '2rem' : '3rem'" eventBorderHeight="0px"
          eventContentHeight="1.65rem" class="theme-default" @click-date="openAddNewEvent" @click-event="openEditEvent">
          <div slot="header" class="mb-4">
            <div class="vx-row no-gutter">
              <!-- Month Name -->
              <div class="vx-col w-1/3 items-center sm:flex hidden">
                <!-- Add new event button -->
                <vs-button icon-pack="feather" class="mr-2" color="dark"
                  style="padding: 7px 10px 7px 10px; font-size: 14px;" icon="icon-plus"
                  @click="promptAddNewEvent(new Date())">Solicitar Capacitación</vs-button>
                <vs-button color="dark" type="border" style="padding: 7px 10px 7px 10px; font-size: 14px;"
                  @click="$router.go()">Hoy</vs-button>
              </div>
              <!-- Current Month -->
              <div class="vx-col sm:w-1/3 w-full sm:my-0 my-3 flex sm:justify-end justify-center order-last">
                <div class="flex items-center">
                  <feather-icon :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'" @click="updateMonth(-1)"
                    svgClasses="w-5 h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full" />

                  <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate.toString().substring(0, 16)
                  }}</span>

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
            <div class="vx-row sm:flex hidden mt-4">
              <div class="vx-col w-full flex">
                <!-- Labels -->
                <!-- {{calendarLabels}} -->
                <!-- <div class="flex flex-wrap sm:justify-start justify-center">
                  <div v-for="(label, index) in calendarLabels" :key="index" class="flex items-center mr-4 mb-2">
                    <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                    <span>{{ label.text }}</span>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </calendar-view>
      </div>
      <!-- ADD EVENT -->
      <vs-popup background-color="rgba(255,255,255,.6)" fullscreen title="Capacitaciones del asesor"
        :active.sync="activePromptAddEvent">
        <!-- <vs-prompt class="calendar-event-dialog" title="Capacitación" accept-text="Guardar" :cancel-text="label_cancel" @accept="addEvent" @cancel="removeEvent" :active.sync="activePromptAddEvent"> -->
        <div class="calendar__label-container flex mb-6" v-if="seleccionadoInsitucion == false">
          <vs-chip style="width: 100px;height: 30px;" class="text-white" :class="'bg-' + labelLocal.color">{{
            labelLocal.text }} </vs-chip>
          <span v-if="estado == 0" style="margin-top:2px;">
            <vs-chip color="danger">Cancelada</vs-chip>
          </span>
          <span v-if="estado == 1" style="margin-top:2px;">
            <vs-chip color="warning">Pendiente</vs-chip>
          </span>
          <span v-if="estado == 2" style="margin-top:2px;">
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
        </div>
        <vs-row v-if="error == true">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true" color="danger">
              {{ messageError }}
            </vs-alert>
          </vs-col>
        </vs-row>
        <vs-row v-if="seleccionadoInsitucion == false" class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null">
              Sin Institución
            </p>
            <vs-chip color="success" v-else>
              Institución {{ nombreInstitucion }}
            </vs-chip>
          </vs-col>
        </vs-row>
        <!--PARA LOS ASESORES AGENDA-->
        <div v-if="usuario.id_group == 11">
          <vs-row v-if="seleccionadoInsitucion == true" class="mt-3">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
              <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply"
                type="gradient"></vs-button>
              <vs-button size="small" class="ml-3"
                @click="popupAddNuevaInstitucion = true; activePromptAddEvent = false;" type="relief">Añadir nueva
                institución</vs-button>
            </vs-col>
          </vs-row>

          <vs-row>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="10">
              <vs-button color="warning" class="mt-2" size="small" v-if="seleccionadoInsitucion == false"
                @click="seleccionadoInsitucion = true; error = false" type="relief">
                Asignar Institución
              </vs-button>
              <vs-button color="primary" class="mt-2 ml-3" icon="info" v-if="seleccionadoInsitucion == false"
                size="small"
                @click="seleccionadoInsitucion = true; getInstitucionCreadasByAsesor(); tipo = 2; getPeriodos()"
                type="relief">Instituciones creadas por mi</vs-button>
            </vs-col>
          </vs-row>
          <vs-row v-if="seleccionadoInsitucion == false">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
            </vs-col>
          </vs-row>
          <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion == true && tipo == 1" class="mt-5">
            <div style="width:80%;">
              <vs-input icon="search" style="width:100%;" placeholder="Buscar mi institución" @keyup.enter="getInstitucion()"
                v-model="busquedaInstitucion" />
            </div>
            <div style="width:20%;margin-left:15px;">
              <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            </div>
          </div>
          <div v-if="instituciones.length > 0">
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
                <!-- <vs-th sort-key="nombre">Periodo</vs-th> -->
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
                    <small v-if="tr.statusPeriodo == 1" class="text-success font-bold">{{
                            tr.estadoPeriodo }}</small>
                    <small v-else>{{ tr.estadoPeriodo }}</small>
                  </vs-td>
                  <!-- <vs-td :data="data[indextr].periodo">
                    {{ data[indextr].periodo }} <br>
                    <small v-if="tr.statusPeriodo == 1" class="text-success font-bold">{{ tr.estadoPeriodo }}</small>
                    <small v-else>{{ tr.estadoPeriodo }}</small>
                  </vs-td> -->
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
        <br />
        <div v-if="seleccionadoInsitucion == false">
          <div style="display: flex;">
            <div>
              <vs-button color="dark" size="small" class="mt-2" type="line"
                @click="modalAbierto = true; popupSolicitudes = true; activePromptAddEvent = false"
                icon="event_note">Solicitar
                tema</vs-button>
            </div>
            <div class="ml-5">
              <ul style="display:flex;">
                <li>
                  <vs-radio color="primary" v-model="tipoCapacitacion" vs-name="radiosTipo"
                    vs-value="0">Presencial</vs-radio>
                </li>
                <li class="ml-3">
                  <vs-radio color="success" v-model="tipoCapacitacion" vs-name="radiosTipo"
                    vs-value="1">Virtual</vs-radio>
                </li>
              </ul>
            </div>
          </div>
          <br />
          <div class="vx-row mb-3">
            <div class="vx-col w-full">
              <small class="date-label">Nivel (Oferta Académica) *</small>
              <v-select :options="ofertas" :reduce="oferta => oferta.idofertaAcademica" label="nombreofertaAcademica" class="w-full mt-2"
                v-model="oferta_academica" placeholder="Escoja el nivel (obligatorio)" />
            </div>
          </div>
          <br />
          <div class="vx-row mb-3">
            <div class="vx-col w-full">
              <small class="date-label">Área de Capacitación *</small>
              <v-select :options="areasCapacitacion" :reduce="area => area.value" label="label" class="w-full mt-2"
                v-model="area_capacitacion" placeholder="Escoja el área (obligatorio)" />
            </div>
          </div>
          <br />
          <span class="mt-5">Seleccione primero el tema luego la fecha por favor:</span>
          <v-select :options="temas" :reduce="temas => temas" label="tema" @input="borrar()" class="w-full mt-2"
            v-model="tema" />
          <br />
          <div class="vx-row mb-3">
            <div class="vx-col sm:w-2/2 w-full">
              <small class="date-label">Fecha Capacitacion*</small>
              <datepicker class="w-full" :disabledDates="disabledDatesTo" @input="validar(); formatoFechas();"
                name="end-date" v-model="endDate"></datepicker>
            </div>
          </div>
          <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/2 w-full">
              <small class="date-label">Hora inicio *</small>
              <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_inicio" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
              <small class="date-label">Hora fin *</small>
              <flat-pickr class="w-full" :config="configdateTimePicker" v-model="hora_fin" />
            </div>
          </div>
          <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/2 w-full">
              <small class="date-label">Asistentes</small>
              <vs-input class="w-full" type="number" v-model="asistentes" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
              <small class="date-label">Link de la reunión</small>
              <vs-input class="w-full" type="text" v-model="link_reunion" />
            </div>
          </div>
          <!--observacion-->
          <div class="vx-row mb-3">
            <div class="vx-col w-full">
              <vs-textarea v-model="observacion" :counter="counter_long" label="observación" height="100px"
                :counter-danger.sync="counterDanger"></vs-textarea>
            </div>
          </div>
          <vs-row class="mt-4" v-if="capacitadores == null || capacitadores == ''">
          </vs-row>
          <vs-row class="mt-4" v-else>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <vs-alert active="true">
                Capacitadores : {{ capacitadores }}
              </vs-alert>
            </vs-col>
          </vs-row>
        </div>
        <div>
          <vs-divider>Capacitaciones planificadas para ese día</vs-divider>
          <div v-if="encontrarCapacitaciones.length > 0">
            <vs-table max-items="3" search pagination :data="encontrarCapacitaciones">
              <template slot="header">
                Cantidad: <span style="font-weight: bold;"> {{ encontrarCapacitaciones.length }}</span>
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
                    Capacitador:
                    <span>{{ data[indextr].capacitador }}</span> <br>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.estado_institucion_temporal == '1'">
                      {{ tr.nombre_institucion_temporal }}<br>
                      {{ tr.ciudad_temporal }}<br>
                      Asesor:
                      <span>{{ tr.vendedor }}</span>
                    </div>
                    <div v-else>
                      {{ tr.nombreInstitucion }}<br>
                      {{ tr.ciudad }}<br>
                      Asesor:
                      <span>{{ tr.vendedor }}</span>
                    </div>
                  </vs-td>

                  <vs-td>
                    Hora inicio:
                    <span>{{ tr.hora_inicio }}</span> <br>
                    Hora Fin:
                    <span>{{ tr.hora_fin }}</span>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
          <div v-else>
            <p>
              No hay capacitaciones para ese dia
            </p>
          </div>
        </div>
        <!--Encuestas-->
        <div v-if="id != 0 && seleccionadoInsitucion == false">
          <vs-divider>Encuestas</vs-divider>
          <certificados-asignar-encuesta
            v-if="capacitacionEncuesta"
            :capacitacion="capacitacionEncuesta"
            :key="'enc-' + capacitacionEncuesta.id_seminario + '-' + encuestaReloadKey"
          />
        </div>

        <vs-row class="mt-3">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-button @click="addEvent()" type="relief">Guardar *</vs-button>
            <vs-button color="warning" class="ml-2" @click="removeEvent()" type="relief">{{ label_cancel }}</vs-button>
          </vs-col>
        </vs-row>
      </vs-popup>
      <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->
      <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución"
        :active.sync="popupAddNuevaInstitucion">
        <vs-button size="small" color="success" radius=""
          @click="popupAddNuevaInstitucion = false; activePromptAddEvent = true;" icon="reply"
          type="gradient"></vs-button>
        <vs-row class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <ul class="leftx" style="display:flex;flex-direction: row;">
              <li class="ml-2">
                <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos()" vs-name="radios1"
                  vs-value="1">Sierra</vs-radio>
              </li>
              <li class="ml-2">
                <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos()" vs-name="radios1"
                  vs-value="2">Costa</vs-radio>
              </li>
            </ul>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-col w-full mt-5">
              Seleccione una ciudad:
              <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full"
                v-model="temporalInstitucion.ciudad" />
            </div>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-col w-full mt-5">
              Seleccione un período:
              <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar"
                label="periodoescolar" class="w-full" v-model="temporalInstitucion.periodo" />
            </div>
          </vs-col>
        </vs-row>
        <vs-row class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-input label="Escriba un nombre para la institución" class="w-full"
              v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
          </vs-col>
        </vs-row>
        <vs-row class="mt-5">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-button @click="agregarInstitucionTemporal()" type="gradient">Agregar Institución</vs-button>
          </vs-col>
        </vs-row>
      </vs-popup>
    </div>
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
            <vs-td>
              {{ data[indextr].nombre }}<br>
            </vs-td>
            <vs-td>
              {{ data[indextr].fecha_inicio }}<br>
            </vs-td>
            <vs-td>
              {{ data[indextr].fecha_fin }}<br>
            </vs-td>
            <vs-td>
              {{ data[indextr].hora_inicio }}<br>
              {{ tr.hora_fin }}
            </vs-td>
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
              <span v-if="data[indextr].estado_capacitacion == 0"><br>
                <vs-chip color="danger">Cancelada</vs-chip>
              </span>
              <span v-if="data[indextr].estado_capacitacion == 1"><br>
                <vs-chip color="warning">Pendiente</vs-chip>
              </span>
              <span v-if="data[indextr].estado_capacitacion == 2"><br>
                <vs-chip color="success">Realizada</vs-chip>
              </span>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>
    <!--POPUP DE LISTADO DE SOLICITUDES-->
    <vs-popup class="holamundo" fullscreen title="Solicitudes" :active.sync="popupSolicitudes"
      @close="openModalCapaticion">
      <!--divider -->
      <p class="bg-primary text-center text-white font-bold p-3">!El tema solicitado debe ser aprobado por la
        administración para que pueda solicitar su capacitación.</p>
      <vs-divider>Crear solicitudes</vs-divider>
      <div class="vx-row">
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <vs-input label="Tema" placeholder="Escriba el tema que solicita" class="w-full" v-model="txtTema" />
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <vs-input label="observación" placeholder="Comentario" class="w-full" v-model="txtObservacion" />
        </div>
      </div>
      <vs-row class="mt-4">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-button color="success" @click="solicitarTema()" type="relief">Solicitar Tema</vs-button>
        </vs-col>
      </vs-row>
      <vs-divider>Lista de solicitudes</vs-divider>
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
            <vs-td>
              {{ data[indextr].tema }}<br>
            </vs-td>
            <vs-td>
              {{ data[indextr].observacion }}<br>
            </vs-td>
            <vs-td>
              {{ data[indextr].comentario_admin }}<br>
            </vs-td>
            <vs-td>
              <span v-if="data[indextr].estado == 0"><br>
                <vs-chip color="danger">Generado</vs-chip>
              </span>
              <span v-if="data[indextr].estado == 1"><br>
                <vs-chip color="warning">Tema Creado</vs-chip>
              </span>
              <span v-if="data[indextr].estado == 2"><br>
                <vs-chip color="success">No se pudo crear</vs-chip>
              </span>
            </vs-td>
            <vs-td>
              <vs-button line-position="top" size="small" icon="delete" line-origin="left" @click="openConfirm(tr)"
                color="danger" type="relief">Eliminar</vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-popup>

     <!-- MODAL CONFIRM DELETE -->
     <vs-popup class="popup-confim-delete" title="Confirmar Eliminación" :active.sync="popupConfirmDelete">
        <div class="p-4 text-center">
          <p class="mb-4 font-semibold text-lg">¿Está seguro de que desea eliminar esta capacitación?</p>
          <div class="flex justify-center mt-6">
            <vs-button color="danger" @click="deleteEvent()" type="filled" class="mr-3" icon="check">
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

import 'vue-simple-calendar/static/css/default.css' // ultimo import: con require se cargaba despues de los demas
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
      counterDanger: false,
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
      console.log('fecha', convertir)
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
    //instituciones creadas por el asesor
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
          // me.activePromptAddEvent = true;
          me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: res.data.message
          })
          //LIMPIAR
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
    //para obtener el listado de las capacitacion por institucion
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
      me.instituciones = []
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
        // this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula)
        .then(function (res) {
          console.log('getInstitucion()',res.data);
          me.instituciones = res.data;
          // me.filtroRegion();
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
    //capacitaciones de una fecha
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
      console.log("addEvent",this.id);
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
      //validar la fecha que no sea menor a los 5 dias de reserva
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
        console.log(me.asesor) // observer i need to parse to object
        let asesor = me.asesor ? me.asesor.idusuario : me.usuario.idusuario
        console.log(asesor)
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

        // Función para manejar la respuesta exitosa
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

        // Función para manejar errores
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
      console.log('fecha',date)
      if (!this.isWithinAllowedTimeRange()) {
        me.$f_notificacion("Esta fuera de horario de oficina para agendar","danger","alert-triangle","6000")
        // alert("El módulo solo está disponible desde el lunes a las 4:00 AM hasta el viernes a las 5:30 PM.");
        return; // Detener la ejecución si no está dentro del rango permitido
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
      // this.endDate = date
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
      this.nombreInstitucion = ""
      const e = this.$store.getters['calendar/getEvent'](event.id)
      this.id = e.id
      this.title = e.title.split('(')[0]
      this.startDate = e.startDate
      this.endDate = e.endDate

      // Preparar datos para el componente de encuestas
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

      // Abrir popup de confirmación
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
          console.log(res.data);
          me.asesores = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    isWithinAllowedTimeRange() {
      const now = new Date(); // Obtener la fecha y hora actual
      const dayOfWeek = now.getDay(); // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
      const currentHour = now.getHours(); // Obtener la hora actual
      const currentMinutes = now.getMinutes(); // Obtener los minutos actuales
      console.log(now, dayOfWeek, currentMinutes, currentHour, currentMinutes)
      // Verificar si es un día entre semana (lunes a viernes)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Verificar si es lunes y la hora es antes de las 4:00 AM
        if (dayOfWeek === 1 && (currentHour < 4 || (currentHour === 4 && currentMinutes < 0))) {
          return false;
        }

        // Verificar si es viernes y la hora es después de las 5:30 PM
        if (dayOfWeek === 5 && (currentHour > 17 || (currentHour === 17 && currentMinutes > 30))) {
          return false;
        }

        // Si es un día entre semana y está dentro del horario permitido
        return true;
      }

      // Si es fin de semana (sábado o domingo)
      return false;
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log(this.usuario)

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

/* Asegurar que el modal de confirmación esté por encima de todo, incluso de modales fullscreen */
.popup-confim-delete {
    z-index: 100000 !important;
}

.popup-confim-delete .vs-popup--background {
    z-index: 100000 !important;
}

.popup-confim-delete .vs-popup {
    z-index: 100001 !important;
}
</style>
