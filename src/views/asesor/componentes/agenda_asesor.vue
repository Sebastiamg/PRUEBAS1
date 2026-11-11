<template>
<div>
    <vx-card>
        <div class="vx-col w-full mb-6">
            <vs-alert active="true">
                <p style="text-align: center;">Planificación Semanal</p>
            </vs-alert>
            <br />
        </div>
        <div style="display:flex;">
         <vs-button color="warning" style="border-radius:20px;" @click="getAllPlanificaciones();filtro.fecha=null;popupFiltroInstitucion = true;filtroFecha=false;" class="ml-5 mt-2"  icon="search" type="line">Ver planificaciones</vs-button>
         </div>
    </vx-card>

    <div id="simple-calendar-app" class="mt-4">
        <div class="vx-card no-scroll-content">
          <calendar-view ref="calendar" :displayPeriodUom="calendarView" :show-date="showDate" :events="simpleCalendarEvents" :eventTop="windowWidth <= 400 ? '2rem' : '3rem'" eventBorderHeight="0px" eventContentHeight="1.65rem" class="theme-default" @click-date="openAddNewEvent" @click-event="openEditEvent">
            <div slot="header" class="mb-4">
              <div class="vx-row no-gutter">

                  <!-- Current Month - Responsive (Primero en móvil) -->
                  <div class="vx-col w-full sm:w-1/3 mb-3 sm:mb-0 flex justify-start sm:justify-center items-center order-first sm:order-2">
                      <div class="flex items-center">
                          <feather-icon :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'" @click="updateMonth(-1)" svgClasses="w-4 h-4 sm:w-5 sm:h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full p-1" />

                          <span class="mx-2 sm:mx-3 text-sm sm:text-base md:text-xl font-medium whitespace-no-wrap">{{ showDate.toString().substring(0,16) }}</span>

                          <feather-icon :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'" @click="updateMonth(1)" svgClasses="w-4 h-4 sm:w-5 sm:h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full p-1" />
                      </div>
                  </div>

                  <!-- Add new event button - Mobile First -->
                  <div class="vx-col w-full sm:w-1/3 mb-3 sm:mb-0 flex justify-start sm:justify-start items-center order-2 sm:order-1">
                      <vs-button icon-pack="feather" class="mr-2 text-xs sm:text-sm" color="dark" style="padding: 5px 8px; font-size: 12px;" icon="icon-plus" @click="promptAddNewEvent(new Date())">
                          <span class="hidden sm:inline">Crear evento</span>
                          <span class="sm:hidden">Crear</span>
                      </vs-button>
                      <vs-button color="dark" type="border" class="text-xs sm:text-sm" style="padding: 5px 8px; font-size: 12px;" @click="$router.go()">Hoy</vs-button>
                  </div>

                  <!-- Calendar View Selector - Responsive -->
                  <div class="vx-col w-full sm:w-1/3 flex justify-start sm:justify-center order-3">
                      <template v-for="(view, index) in calendarViewTypes">
                          <vs-button
                              v-if="calendarView === view.val"
                              :key="String(view.val) + 'filled'"
                              type="filled"
                              style="padding: 5px 8px !important; font-size: 11px;"
                              class="p-1 sm:p-2 md:px-8 md:py-3"
                              :class="{'border-l-0': index, 'rounded-r-none': calendarViewTypes.length !== index+1}"
                              @click="calendarView = view.val"
                          >
                              {{ view.label }}
                          </vs-button>
                          <vs-button
                              v-else
                              :key="String(view.val) + 'border'"
                              type="line"
                              style="padding: 5px 8px !important; font-size: 11px;"
                              class="p-1 sm:p-2 md:px-8 md:py-3"
                              :class="{'border-l-0': index, 'rounded-r-none': calendarViewTypes.length !== index+1}"
                              @click="calendarView = view.val"
                          >
                              {{ view.label }}
                          </vs-button>
                      </template>

                  </div>
              </div>
              <div class="vx-row sm:flex hidden mt-4">
                  <div class="vx-col w-full flex">
                      <!-- Labels -->
                      <!-- {{calendarLabels}} -->
                      <div class="flex flex-wrap sm:justify-start justify-center">
                          <div v-for="(label, index) in calendarLabels" :key="index" class="flex items-center mr-4 mb-2">
                              <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                              <span>{{ label.text }}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </calendar-view>
        </div>
        <!-- ADD EVENT -->
        <vs-popup background-color="rgba(255,255,255,.6)" :title="tituloModal" :active.sync="activePromptAddEvent">
            <div class="calendar__label-container flex mb-6" v-if="seleccionadoInsitucion == false">
                <vs-chip style="width: 100px;height: 25px;margin-top: 1px;" class="text-white" :class="'bg-' + labelLocal.color">{{ labelLocal.text }}</vs-chip>
                     <span v-if="estado == 1"  style="margin-top:2px;">
                        <vs-chip color="success">Realizada</vs-chip>
                    </span>
                    <vs-alert v-if="error ==  true" style="font-size:14px;width:75%;font-weight:500;" active="true" color="danger">
                        {{messageError}}
                    </vs-alert>
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
            <div v-if="usuario.id_group == 11">
                <vs-row v-if="seleccionadoInsitucion ==  false" class="mt-2">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null ">
                            Sin Institución
                        </p>
                        <div v-else>
                          <div class="flex justify-center">
                            <vs-chip color="success">
                              Institución: {{ nombreInstitucion}}
                            </vs-chip>
                          </div>
                          <div class="flex justify-center">
                            <vs-chip color="dark" class="ml-2">
                              <p class="text-center mt-2">Asesor: {{ asesorSelect }}</p>
                            </vs-chip>
                          </div>
                        </div>
                    </vs-col>
                </vs-row>
                <vs-row v-if="seleccionadoInsitucion ==  true" class="mt-2">
                    <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
                        <vs-button size="small" color="success" radius="" @click="regresar()" icon="reply" type="gradient"></vs-button>
                        <vs-button size="small" class="ml-3" @click="popupAddNuevaInstitucion = true;activePromptAddEvent = false;" type="relief">Añadir nueva institución</vs-button>
                    </vs-col>
                </vs-row>
                <div class="flex justify-center">
                  <vs-button color="warning" class="mt-2" v-if="seleccionadoInsitucion == false" size="small"  @click="seleccionadoInsitucion = true;tipo = 1;" type="relief">Asignar Institución de prolipa
                  </vs-button>
                  <vs-button color="primary" class="mt-2 ml-3" icon="info" v-if="seleccionadoInsitucion == false" size="small"  @click="seleccionadoInsitucion = true;getInstitucionCreadasByAsesor();tipo = 2;getPeriodos();" type="relief">Instituciones creadas por mi</vs-button>
                </div>
                <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion ==  true && tipo == 1" class="mt-5">
                    <div style="width:80%;">
                        <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
                    </div>
                    <div style="width:20%;margin-left:15px;">
                        <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                    </div>
                </div>
                <div v-if="instituciones.length >0">
                    <vs-table stripe max-items="5" search pagination :data="instituciones">
                        <template slot="header">
                            <div class="vx-row">
                                <div class="vx-col w-full m-3">
                                    Cantidad: {{instituciones.length}}
                                </div>
                            </div>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                            <vs-th sort-key="nombre">Localidad</vs-th>
                            <vs-th sort-key="nombre">Periodo</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="data[indextr].nombreInstitucion">
                                    {{data[indextr].nombreInstitucion}}<br>
                                    <div v-if="tr.institucion_temporal_id">
                                      <b>Asesor:</b>
                                      <p>{{ usuario.nombres + " " + usuario.apellidos }}</p>
                                    </div>
                                    <div v-else>
                                      <b>Asesor:</b>
                                      <p>{{ tr.nombre_asesor + " " + tr.apellido_asesor }}</p>
                                    </div>
                                </vs-td>
                                <vs-td :data="data[indextr].nombreregion">
                                    {{data[indextr].nombreregion}} <br>
                                    <small>{{data[indextr].ciudad}}</small>
                                </vs-td>
                                <vs-td>
                                    {{ tr.periodo }}
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr);error=false">
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
                <br>
                <vs-input class="w-full mb-3 " label-placeholder="Título del evento *" v-model="title"></vs-input>
                <div class="vx-row mb-3">
                    <div class="vx-col sm:w-1/2 w-full">
                        <small class="date-label">Fecha inicio *</small>
                        <datepicker class="w-full" name="start-date" v-model="startDate" @input="formatoFechas()" :disabled="disabledFrom"></datepicker>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full" v-if="fvisita == true && usuario.id_group != 11">
                        <small class="date-label">Fecha que visita</small>
                        <datepicker class="w-full" :disabledDates="disabledDatesTo" @input="formatoFechas()" name="end-date" v-model="endDate"></datepicker>
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
            </div>

            <!--PARA LOS ASESORES AGENDA-->
            <div v-if="usuario.id_group == 11">

                <vs-divider color="success" v-if="seleccionadoInsitucion == false">Opciones</vs-divider>
                <vs-alert v-if="error2 ==  true" style="font-size:14px;width:75%;font-weight:500;" active="true" color="danger">
                        {{messageError}}
                </vs-alert>
                <vs-row v-if="seleccionadoInsitucion == false" class="mt-2">
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.presentacion">Presentación</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.entrega_muestras">Entregas de muestras</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.reunion">Reunión</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.seguimiento">Seguimiento</vs-checkbox>
                    </vs-col>

                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.cierre">Cierre</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.cobranza">Cobranza</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.post_venta">Post Venta</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.retiro_cartas">Retiro de cartas</vs-checkbox>
                    </vs-col>

                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.retiro_muestras">Retiro de muestras</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.capacitacion">Capacitación</vs-checkbox>
                    </vs-col>
                    <vs-col class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-checkbox color="success" v-model="opciones.otraEditorial">Otra Editorial</vs-checkbox>
                    </vs-col>
                    <vs-col v-if="opciones.otraEditorial == true" class="mb-2" vs-type="flex" vs-justify="left" vs-align="left" vs-w="3" vs-lg="3" vs-sm="6" vs-xs="12">
                        <vs-input class="inputx w-full" placeholder="Escriba el nombre de la editorial" v-model="opciones.editorial" />
                    </vs-col>
                </vs-row>
            </div>

            <vs-textarea counter="250" label="Mensaje" :counter-danger.sync="counterDanger" v-if="seleccionadoInsitucion == false" name="event-url" class="w-full mb-3 mt-4" v-model="url" />

            <!-- Botón para capturar ubicación -->
            <div v-if="seleccionadoInsitucion == false" class="w-full mb-3">
                <vs-button
                    v-if="fecha_captura_longitud == null"
                    color="primary"
                    type="relief"
                    icon="room"
                    @click="capturarUbicacion()"
                    class="w-full"
                >
                    {{ ubicacionCapturada ? 'Actualizar Ubicación' : 'Registrar Mi Ubicación' }}
                </vs-button>

                <!-- Mostrar coordenadas capturadas -->
                <div v-if="ubicacionCapturada" class="mt-2">
                    <vs-alert color="success" active="true">
                        <div class="flex items-center">
                            <feather-icon icon="MapPinIcon" svgClasses="h-4 w-4 mr-2"></feather-icon>
                            <div>
                                <strong>Ubicación registrada:</strong><br>
                                <small>Latitud: {{ latitud }}</small><br>
                                <small>Longitud: {{ longitud }}</small>
                                <p><b>Fecha captura ubicación:</b> {{ fecha_captura_longitud }}</p>
                            </div>
                        </div>
                    </vs-alert>

                    <!-- Mapa interactivo -->
                    <div class="mt-3" style="height: 300px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0;">
                        <iframe
                            :src="`https://maps.google.com/maps?q=${latitud},${longitud}&z=16&output=embed`"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            style="border:0;"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <!-- Botón para ver en Google Maps -->
                    <div class="mt-2 flex justify-center">
                        <vs-button
                            size="small"
                            color="success"
                            type="border"
                            icon="open_in_new"
                            class="mr-2"
                            @click="verEnGoogleMaps"
                        >
                            Ver en Google Maps
                        </vs-button>
                        <vs-button
                            size="small"
                            color="danger"
                            type="border"
                            icon="close"
                            @click="quitarMapa"
                        >
                            Quitar mapa
                        </vs-button>
                    </div>
                </div>
                <br>
            </div>

            <vs-row class="mt-3" v-if="seleccionadoInsitucion == false">
                <vs-col vs-type="flex" vs-justify="center" vs-align="right" vs-w="12">
                    <vs-button @click="addEvent()" type="relief" :disabled="guardando">
                        {{ guardando ? 'Guardando...' : 'Guardar' }}
                    </vs-button>
                    <vs-button color="warning" class="ml-2" @click="removeEvent()" type="relief" :disabled="guardando">{{label_cancel}}</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
         <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->
         <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución" :active.sync="popupAddNuevaInstitucion">
            <vs-button size="small" color="success" radius="" @click="popupAddNuevaInstitucion=false;activePromptAddEvent=true;" icon="reply" type="gradient"></vs-button>
            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <ul class="leftx" style="display:flex;flex-direction: row;">
                        <li class="ml-2">
                            <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos()" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                        </li>
                        <li class="ml-2">
                            <vs-radio v-model="temporalInstitucion.region" @input="getPeriodos()" vs-name="radios1" vs-value="2">Costa</vs-radio>
                        </li>
                    </ul>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="vx-col w-full mt-5">
                        Seleccione una ciudad:
                        <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                    </div>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="vx-col w-full mt-5">
                        Seleccione un período:
                        <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="temporalInstitucion.periodo" />
                    </div>
                </vs-col>
            </vs-row>
            <vs-row class="mt-2">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-input label="Escriba un nombre para la institución" class="w-full" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
                </vs-col>
            </vs-row>
            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button @click="agregarInstitucionTemporal()" type="gradient">Agregar Institución</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>


    </div>
    <vs-popup fullscreen title="Listado de Planificaciones" :active.sync="popupFiltroInstitucion" class="popupPadre">
      <vs-table max-items="10"  stripe search pagination :data="filtroInstituciones">
        <template slot="header">
            <div style="display:flex;">
                <p>Cantidad planificaciones listadas: <span style="font-weight:bold;">{{filtroInstituciones.length}}</span></p>
            </div>
            <div class="ml-5">
                  <flat-pickr  :config="configdateTimePicker2" @input="getAllPlanificaciones();filtroFecha=true" v-model="filtro.fecha"  placeholder="Fecha a filtrar" class="m-1" style="display: inline-block;width: 100%;" />

            </div>
            <div class="ml-5">
                  <vs-button radius color="danger" @click="filtroFecha = false; filtro.fecha = '';getAllPlanificaciones()" type="gradient" icon="close"></vs-button>
            </div>
        </template>
        <template slot="thead">
            <vs-th>Titulo</vs-th>
            <vs-th>Fecha</vs-th>
            <vs-th>Hora</vs-th>
            <vs-th>Opciones</vs-th>
            <vs-th>Institución</vs-th>
            <vs-th>Observación</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    {{data[indextr].title}}<br>
                </vs-td>
                <vs-td>
                    Fecha inicio:
                    <span> {{data[indextr].startDate}}</span><br>
                    Fecha fin:
                    <span> {{data[indextr].endDate}}</span><br>
                </vs-td>
                <vs-td>

                    {{data[indextr].hora_inicio}}<br>
                    {{ tr.hora_fin }}
                </vs-td>
                <vs-td height="30%" width="50%">
                  <div class="overflow-y-auto h-24">
                      <vs-chip color="primary" v-if="tr.opciones.presentacion">
                          Presentación
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.entrega_muestras">
                          Entrega muestras
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.reunion">
                          Reunión
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.seguimiento">
                          Seguimiento
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.cierre">
                          Cierre
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.cobranza">
                          Cobranza
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.post_venta">
                          Post venta
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.retiro_cartas">
                          Retiro cartas
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.retiro_muestras">
                          Retiro muestras
                      </vs-chip>
                      <vs-chip color="primary" v-if="tr.opciones.capacitacion">
                        Capacitación
                      </vs-chip>
                  </div>
              </vs-td>
                <vs-td>
                    <div v-if="tr.estado_institucion_temporal == '1'">
                        {{ tr.nombre_institucion_temporal }}<br/>
                          {{ tr.periodoescolar }}
                    </div>
                    <div v-else>
                        {{ tr.nombreInstitucion }}<br/>
                        {{ tr.periodoescolar }}
                    </div>
                </vs-td>
                <vs-td>
                    {{ tr.url }}
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <!-- MODAL CONFIRM DELETE -->
      <vs-popup class="popup-confim-delete" title="Confirmar Eliminación" :active.sync="popupConfirmDelete">
        <div class="p-4 text-center">
          <p class="mb-4 font-semibold text-lg">¿Está seguro de que desea eliminar esta planificación?</p>
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
    </vs-popup>
</div>
</template>

<script>
import $ from 'jquery'
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

import 'vue-simple-calendar/static/css/default.css' // ultimo import: con require se cargaba despues de los demas
export default {
    components: {
        CalendarView,
        CalendarViewHeader,
        Datepicker,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            tituloModal:'Mantenimiento de Planificación',
            popupFiltroInstitucion:false,
            popupConfirmDelete: false,
            error: false,
            error2:false,
            messageError: "",
            ciudadSelect: '',
            popupAddNuevaInstitucion: false,
            seleccionadoInsitucion: false,
            nombreInstitucion: '',
            busquedaInstitucion: "",
            instituciones: [],
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
                editorial: '',
                otraEditorial: false,
            },

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
            startDate_send: '',
            endDate_sed: '',
            langHe: he,
            langEn: en,

            url: '',
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
            configdateTimePicker2: {
                enableTime: true,
                dateFormat: 'Y-m-d'
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
                periodo:'',
            },
            institucion_id_temporal: '',
            estado_institucion_temporal: 0,
            periodo_id_temporal: 0,
            nombreInstitucionTemporal: '',
            filtroInstituciones:[],
            estado: '0',
            filtroFecha:false,
            filtro:{
                fecha:null
            },
            getDatos:[],
            tipo:'1',
            fvisita:false,
            InstitucionesFaltan:[],
            arregloPeriodos:[],
            asesorSelect:'',
            latitud: null,
            longitud: null,
            fecha_captura_longitud: null,
            ubicacionCapturada: false,
            mapaCenter: { lat: -0.180653, lng: -78.467838 }, // Quito, Ecuador por defecto
            mapaZoom: 15,
            guardando: false, // Prevenir doble guardado
        }
    },
    computed: {
        simpleCalendarEvents() {
          this.activePromptAddEvent = false;
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
        }
    },
    methods: {
        getPeriodos(){
            let me = this
            me.arregloPeriodos = []
            this.$http.get(this.$server_url+'get_periodos_pedidos')
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
            me.temporalInstitucion ={
                ciudad: '',
                nombreInstitucion: '',
                region: '2',
                periodo:''
            }
            me.instituciones = [];
             this.$http.get(this.$server_url + 'listaInsitucionAsesor?temporales=yes'+'&asesor_id=' + me.usuario.idusuario)
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
            if(me.temporalInstitucion.periodo == null || me.temporalInstitucion.periodo == "" || me.temporalInstitucion.periodo == undefined ){
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
                if(res.data.status == 0){
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
                    text: "Se guardo correctamente",
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
            me.error = false
            me.error2 = false
        },

        asginarInstitucion(tr) {
             let me = this;
            if(me.tipo == 1){
                me.institucion_id               = tr.idInstitucion
                me.nombreInstitucion            = tr.nombreInstitucion
                me.asesorSelect                 = tr.nombre_asesor + " "+ tr.apellido_asesor
                me.estado_institucion_temporal  = 0;
                me.seleccionadoInsitucion       = false;
                me.instituciones                = []
            }else{
                me.nombreInstitucion            = tr.nombreInstitucion
                me.asesorSelect                 = me.usuario.nombres + " "+ me.usuario.apellidos
                me.institucion_id_temporal      = tr.institucion_temporal_id
                me.instituciones                = []
                me.periodo_id_temporal          = tr.periodo_id
                me.estado_institucion_temporal  = 1;
                me.seleccionadoInsitucion       = false;
            }

        },

        //filtro  de la agenda de planificaciones del asesor
        getAllPlanificaciones(){
            let me = this;
            me.filtroInstituciones = []

            this.$http.get(this.$server_url + 'getPlanificacionesAsesor?asesor_id=' + me.usuario.idusuario)
                .then(function (res) {

                    let datosProlipa = res.data
                    let datos = []


                    for (let i = 0; i < datosProlipa.length; i++) {

                        datos.push({
                            "nombreInstitucion": datosProlipa[i].nombreInstitucion,
                            "periodoescolar": datosProlipa[i].periodoescolar,
                            "fecha":datosProlipa[i].fecha,
                            "id": datosProlipa[i].id,
                            "id_usuario": datosProlipa[i].id_usuario,
                            "title": datosProlipa[i].title,
                            "label": datosProlipa[i].label,
                            "classes": datosProlipa[i].classes,
                            "startDate": datosProlipa[i].startDate,
                            "endDate": datosProlipa[i].fecha_que_visita,
                            "hora_inicio": datosProlipa[i].hora_inicio,
                            "hora_fin": datosProlipa[i].hora_fin,
                            "url": datosProlipa[i].url,
                            "institucion_id": datosProlipa[i].institucion_id,
                            "institucion_id_temporal": datosProlipa[i].institucion_id_temporal,
                            "nombre_institucion_temporal": datosProlipa[i].nombre_institucion_temporal,
                            "estado_institucion_temporal": datosProlipa[i].estado_institucion_temporal,
                            "opciones": JSON.parse(datosProlipa[i].opciones),
                            "periodo_id": datosProlipa[i].periodo_id,
                            "estado": datosProlipa[i].estado,
                            "vendedor": datosProlipa[i].vendedor,

                        })
                    }

                   if(me.filtroFecha == true){
                      if(me.filtro.fecha == null || me.filtro.fecha == undefined || me.filtro.fecha == ""){
                            me.$vs.notify({
                                text: 'Debe seleccionar una fecha para filtrar',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            me.filtroFecha = false
                            return false;
                        }

                      me.filtroInstituciones = datos.filter(p => p.fecha == me.filtro.fecha)
                   }else{
                      me.filtroInstituciones = datos;
                   }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
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
            var url = ""
            url = 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&todasInstituciones=yes'
           this.$http.get(this.$server_url + url)
            // this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula)
            .then(function (res) {
                // me.tmpInstituciones = res.data;
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
        addEvent() {
          let me = this

          // Prevenir doble guardado
          if (me.guardando) {
              return false
          }

          if(me.startDate_send == 'Invalid date'){
            this.startDate_send = this.startDate
          }
          if(me.endDate_send == 'Invalid date'){
            this.endDate_send = this.endDate
          }
          if(this.estado == 1){
            me.error = true
            me.messageError = "La planificación ya fue registrada ya no puede ser modificada"
            me.activePromptAddEvent = true
            return false
          }
          if (this.institucion_id == "" && this.institucion_id_temporal == "") {
              me.error = true;
              me.messageError = "Seleccione una institución por favor";
              me.$vs.notify({
                  title: '¡Atención!',
                  text: 'Debe seleccionar una institución antes de guardar',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle',
                  time: 6000
              })
              me.activePromptAddEvent = true
              return false;
          }
          if (this.title == '') {
              me.error = true;
              me.messageError = "Falta colocar el título del evento";
              me.$vs.notify({
                  title: 'Título requerido',
                  text: 'Debe escribir un título para el evento',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-edit-3',
                  time: 5000
              })
              me.activePromptAddEvent = true
              return false;
          }
          if (this.startDate_send == '' || this.endDate_send == '' || this.hora_inicio == '' || this.hora_fin == '') {
              me.error = true;
              me.messageError = "Complete todos los campos antes de guardar";
              me.$vs.notify({
                  title: 'Campos incompletos',
                  text: 'Complete todos los campos obligatorios antes de guardar',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  time: 5000
              })
              me.activePromptAddEvent = true
              return false;
          }
          //validar que selecciona los checkbox
          if(me.opciones.presentacion == false && me.opciones.entrega_muestras == false && me.opciones.reunion == false && me.opciones.seguimiento == false && me.opciones.cierre == false && me.opciones.cobranza == false && me.opciones.post_venta == false && me.opciones.retiro_cartas == false && me.opciones.retiro_muestras == false && me.opciones.capacitacion == false)
          {
              me.error2 = true;
              me.messageError = "Debe marcar al menos un recuadro";
              me.$vs.notify({
                  title: 'Opciones requeridas',
                  text: 'Debe seleccionar al menos una opción (Presentación, Entrega de muestras, Reunión, etc.)',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-check-square',
                  time: 6000
              })
              me.activePromptAddEvent = true
              return false;
          }
          //si el asesor agrega otra editorial debe validarse que ingrese una institucion
          if (this.opciones.otraEditorial == true) {
              // si es tipo de institucion  de prolipa
              me.activePromptAddEvent = true

              if (this.opciones.editorial == "") {
                  me.error = true;
                  me.messageError = "Ha seleccionado otra editorial tiene que agregar una editorial por favor";
                  me.$vs.notify({
                      title: 'Editorial requerida',
                      text: 'Debe escribir el nombre de la editorial',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-edit',
                      time: 5000
                  })
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
          const obj = {
              idusuario: this.usuario.idusuario,
              id: this.id,
              title: this.title,
              startDate: this.startDate_send,
              endDate: this.endDate_send,
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
              nombre_editorial: this.opciones.editorial,
              latitud: this.latitud,
              longitud: this.longitud

          }

          // Activar flag de guardando y mostrar loading
          me.guardando = true
          me.$vs.loading({
              text: 'Guardando planificación...'
          })

          // Dispatch al store
          if (this.id != 0) {
              this.$store.dispatch('calendar/editEvent', obj).then(() => {
                  me.$vs.loading.close()
                  me.guardando = false
                  me.$vs.notify({
                      text: "Se actualizó correctamente",
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check',
                      time: 5000
                  })
                  me.activePromptAddEvent = false
                  me.clearFields()
              }).catch((error) => {
                  me.$vs.loading.close()
                  me.guardando = false

                  // Verificar si el error viene del backend con status: "0"
                  if (error && error.status === "0" && error.message) {
                      me.$vs.notify({
                          text: error.message,
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-circle',
                          time: 6000
                      })
                  } else {
                      me.$vs.notify({
                          text: "Error al actualizar la planificación",
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-circle',
                          time: 5000
                      })
                  }
                  console.error('Error al editar evento:', error)
              })
          } else {
              this.$store.dispatch('calendar/addEvent', obj).then(() => {
                  me.$vs.loading.close()
                  me.guardando = false
                  me.$vs.notify({
                      text: "Se guardó correctamente",
                      color: 'success',
                      iconPack: 'feather',
                      icon: 'icon-check',
                      time: 5000
                  })
                  me.activePromptAddEvent = false
                  me.clearFields()
              }).catch((error) => {
                  me.$vs.loading.close()
                  me.guardando = false

                  // Verificar si el error viene del backend con status: "0"
                  if (error && error.status === "0" && error.message) {
                      me.$vs.notify({
                          text: error.message,
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-circle',
                          time: 6000
                      })
                  } else {
                      me.$vs.notify({
                          text: "Error al guardar la planificación",
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-circle',
                          time: 5000
                      })
                  }
                  console.error('Error al agregar evento:', error)
              })
          }
        },
        updateMonth(val) {
            this.showDate = this.$refs.calendar.getIncrementedPeriod(val)
        },
        capturarUbicacion() {
            let me = this;

            // Verificar si el navegador soporta geolocalización
            if (!navigator.geolocation) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Tu navegador no soporta geolocalización',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // Mostrar loading
            me.$vs.loading({
                text: 'Obteniendo ubicación...'
            });

            // Obtener posición actual
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Éxito al obtener la ubicación
                    me.latitud = position.coords.latitude.toFixed(6);
                    me.longitud = position.coords.longitude.toFixed(6);
                    me.ubicacionCapturada = true;

                    // Centrar el mapa en la ubicación capturada
                    me.mapaCenter = {
                        lat: parseFloat(me.latitud),
                        lng: parseFloat(me.longitud)
                    };
                    me.mapaZoom = 16;

                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Ubicación capturada',
                        text: 'Ubicación capturada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-map-pin',
                        time: 4000
                    });
                },
                (error) => {
                    // Error al obtener la ubicación
                    me.$vs.loading.close();
                    let mensaje = 'No se pudo obtener tu ubicación';

                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            mensaje = 'Has denegado el permiso de ubicación. Por favor, actívalo en tu navegador.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            mensaje = 'La información de ubicación no está disponible.';
                            break;
                        case error.TIMEOUT:
                            mensaje = 'El tiempo de espera para obtener la ubicación ha expirado.';
                            break;
                    }

                    me.$vs.notify({
                        title: 'Error',
                        text: mensaje,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time: 6000
                    });
                },
                {
                    enableHighAccuracy: true, // Solicitar mayor precisión
                    timeout: 10000, // Timeout de 10 segundos
                    maximumAge: 0 // No usar caché
                }
            );
        },
        verEnGoogleMaps() {
            if (this.latitud && this.longitud) {
                const url = `https://www.google.com/maps?q=${this.latitud},${this.longitud}`;
                window.open(url, '_blank');
            }
        },
        quitarMapa() {
            this.latitud = null;
            this.longitud = null;
            this.ubicacionCapturada = false;
            this.fecha_captura_longitud = null;
            this.mapaCenter = { lat: -0.180653, lng: -78.467838 } // Reset a Quito, Ecuador
            this.mapaZoom = 15

            this.$vs.notify({
                text: 'Se quitó el mapa. Se guardará sin ubicación.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-trash'
            })
        },
        clearFields() {
            this.error2 = false
            this.title = this.endDate = this.url = ''
            this.id = 0
            this.labelLocal = {
                text: 'Baja',
                color: 'success'
            }
            this.label_cancel = 'Cancelar'
            this.opciones.presentacion = false
            this.opciones.entrega_muestras = false
            this.opciones.reunion = false
            this.opciones.seguimiento = false
            this.opciones.cierre = false
            this.opciones.cobranza = false
            this.opciones.post_venta = false
            this.opciones.retiro_cartas = false
            this.opciones.retiro_muestras = false
            this.opciones.capacitacion = false
            // this.opciones.sinSello = true
            this.opciones.editorial = ""
            this.opciones.otraEditorial = false
            this.institucion_id = ""
            this.institucion_id_temporal = ""
            this.nombreInstitucion=""
            this.startDate = ""
            this.endDate = ""
            this.hora_inicio = ""
            this.hora_fin = ""
            this.url = ""
            this.latitud = null
            this.longitud = null
            this.fecha_captura_longitud = null
            this.ubicacionCapturada = false
            this.mapaCenter = { lat: -0.180653, lng: -78.467838 } // Reset a Quito, Ecuador
            this.mapaZoom = 15
            this.guardando = false // Resetear flag de guardando



        },
        promptAddNewEvent(date) {
             this.fvisita = false
            this.disabledFrom = false
            this.addNewEventDialog(date)
        },
        addNewEventDialog(date) {
             this.fvisita = false
            this.clearFields()
            this.startDate = date
            this.endDate = date
            this.formatoFechas()
            this.activePromptAddEvent = true
        },
        openAddNewEvent(date) {
            this.fvisita = false
            this.error = false
            this.error2 = false
            this.disabledFrom = true
            this.addNewEventDialog(date)
        },
        openEditEvent(event) {
          let me = this;
          const e                           = this.$store.getters['calendar/getEvent'](event.id)
          me.getInstitucionInfo(e)
          this.fvisita                      = true
          this.error                        = false
          this.error2                       = false
          this.institucion_id               = ""
          this.institucion_id_temporal      = ""
          this.nombreInstitucion            = ""
          let datos                         = JSON.parse(e.opciones)
          this.id                           = e.id
          this.title                        = e.title.split('(')[0]
          this.startDate                    = e.startDate
          this.endDate                      = e.fecha_que_visita
          this.url                          = e.url
          this.labelLocal                   = {
              text: e.label,
              color: e.classes.split('-')[1]
          }
          this.startDate_send               = this.startDate
          this.endDate_send                 = this.endDate
          this.hora_inicio                  = e.hora_inicio
          this.hora_fin                     = e.hora_fin
          this.label_cancel                 = 'Eliminar planificación'
          this.activePromptAddEvent         = true
          this.estado                       = e.estado
          this.opciones.presentacion        = datos.presentacion
          this.opciones.entrega_muestras    = datos.entrega_muestras
          this.opciones.reunion             = datos.reunion
          this.opciones.seguimiento         = datos.seguimiento
          this.opciones.cierre              = datos.cierre
          this.opciones.cobranza            = datos.cobranza
          this.opciones.post_venta          = datos.post_venta
          this.opciones.retiro_cartas       = datos.retiro_cartas
          this.opciones.retiro_muestras     = datos.retiro_muestras
          this.opciones.capacitacion        = datos.capacitacion
          // this.opciones.sinSello = datos.sinSello
          this.opciones.otraEditorial = datos.otraEditorial
          if (this.opciones.otraEditorial == false) {
              this.opciones.editorial = ""
          } else {
              this.opciones.editorial = datos.editorial
          }
          // Cargar coordenadas si existen
          if (e.latitud && e.longitud) {
              this.latitud = e.latitud
              this.longitud = e.longitud
              this.fecha_captura_longitud = e.fecha_captura_longitud
              this.ubicacionCapturada = true
              // Centrar el mapa en la ubicación guardada
              this.mapaCenter = {
                  lat: parseFloat(e.latitud),
                  lng: parseFloat(e.longitud)
              }
              this.mapaZoom = 16
          } else {
              this.latitud = null
              this.longitud = null
              this.ubicacionCapturada = false
              this.fecha_captura_longitud = null
              this.mapaCenter = { lat: -0.180653, lng: -78.467838 }
              this.mapaZoom = 15
          }

          if (e.estado_institucion_temporal == "1") {
              this.nombreInstitucion            = e.nombre_institucion_temporal
              this.institucion_id_temporal      = e.institucion_id_temporal
              this.periodo_id_temporal          = e.periodo_id
              this.estado_institucion_temporal  = 1
          } else {
              this.nombreInstitucion            = e.nombreInstitucion
              this.institucion_id               = e.institucion_id
              this.estado_institucion_temporal  = 0
          }
        },
        getInstitucionInfo(tr){
          let me = this;
          console.log("tr",tr)
          if (tr.estado_institucion_temporal == "1") {
            me.asesorSelect                   = me.usuario.nombres + " "+ me.usuario.apellidos
          }else{
            this.$http.get(this.$server_url+`institucionActiva?idInstitucion=${tr.institucion_id}`)
              .then(function (res) {
                 if(res.data.length > 0){
                  let nombreAsesor = res.data[0].nombres + " " + res.data[0].apellidos
                  me.setNombre(nombreAsesor)
                 }
              })
              .catch(function (error) {
                  console.log(error + ' error');
              })
          }
        },
        setNombre(nombre){
          this.asesorSelect = nombre
        },
        removeEvent() {
            let me = this;

            if(this.estado == 1){
                me.error = true
                me.messageError = "La Planificación ya fue registrada ya no puede ser modificada"
                me.activePromptAddEvent = true
                return false
            }

            if (this.label_cancel == "Cancelar") {
                me.activePromptAddEvent = false
                me.clearFields() // Limpiar campos al cancelar
                return
            }

            if (this.id == 0) {
                return
            }

            // Abrir popup de confirmación personalizado
            me.popupConfirmDelete = true
        },
        deleteEvent() {
            let me = this;
            // Mostrar loading
            me.$vs.loading({
                text: 'Eliminando planificación...'
            })

            // Eliminar evento
            this.$store.dispatch('calendar/removeEvent', this.id)
                .then(() => {
                    me.$vs.loading.close()
                    me.popupConfirmDelete = false // Cerrar modal de confirmación
                    me.$vs.notify({
                        text: "Planificación eliminada correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 4000
                    })
                    me.activePromptAddEvent = false
                    me.clearFields() // Limpiar campos después de eliminar
                    // Recargar eventos para actualizar el calendario
                    me.$store.dispatch('calendar/fetchEvents')
                })
                .catch((error) => {
                    me.$vs.loading.close()
                    me.popupConfirmDelete = false // Cerrar modal incluso si hay error
                    me.$vs.notify({
                        text: "Error al eliminar la planificación",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time: 5000
                    })
                    console.error('Error al eliminar evento:', error)
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
            this.startDate_send = moment(this.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            this.endDate_send = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            // alert(' frmat:  '+this.endDate_send)
        },
        completeInstituciones(){
          let me = this;
          this.$http.get(this.$server_url+'completeInstituciones?asesor_id='+me.usuario.idusuario)
          .then(function (res) {
            if(res.data.length > 0){
              me.InstitucionesFaltan = res.data[0]
              me.tituloModal = "Planificación sin institución agrege la institución por favor"
              me.openEditFaltantes(me.InstitucionesFaltan)
            }
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
        },

         openEditFaltantes(tr) {
            let me = this;
             this.activePromptAddEvent = true
            me.clearFields()
            let datos = JSON.parse(tr.opciones)
            this.id = tr.id
            if(tr.title == null){
                tr.title = ""
            }else{
                this.title = tr.title.split('(')[0]
            }
            this.startDate = tr.startDate
            this.endDate = tr.fecha_que_visita
            this.url = tr.url
            if(tr.classes == null){
            }else{
                this.labelLocal = {
                    text: tr.label,
                    color: tr.classes.split('-')[1]
                }
            }

            this.startDate_send               = this.startDate
            this.endDate_send                 = this.endDate
            this.hora_inicio                  = tr.hora_inicio
            this.hora_fin                     = tr.hora_fin
            this.label_cancel                 = 'Cancelar'
            this.activePromptAddEvent         = true
            this.estado                       = tr.estado
            this.opciones.presentacion        = datos.presentacion
            this.opciones.entrega_muestras    = datos.entrega_muestras
            this.opciones.reunion             = datos.reunion
            this.opciones.seguimiento         = datos.seguimiento
            this.opciones.cierre              = datos.cierre
            this.opciones.cobranza            = datos.cobranza
            this.opciones.post_venta          = datos.post_venta
            this.opciones.retiro_cartas       = datos.retiro_cartas
            this.opciones.retiro_muestras     = datos.retiro_muestras
            this.opciones.capacitacion        = datos.capacitacion
            // this.opciones.sinSello = datos.sinSello
            this.opciones.otraEditorial = datos.otraEditorial
            if (this.opciones.otraEditorial == false) {
                this.opciones.editorial = ""
            } else {
                this.opciones.editorial = datos.editorial
            }

            // Cargar coordenadas si existen
            if (tr.latitud && tr.longitud) {
                this.latitud = tr.latitud
                this.longitud = tr.longitud
                this.ubicacionCapturada = true
                // Centrar el mapa en la ubicación guardada
                this.mapaCenter = {
                    lat: parseFloat(tr.latitud),
                    lng: parseFloat(tr.longitud)
                }
                this.mapaZoom = 16
            } else {
                this.latitud = null
                this.longitud = null
                this.ubicacionCapturada = false
                this.mapaCenter = { lat: -0.180653, lng: -78.467838 }
                this.mapaZoom = 15
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

        },
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));

        // Solo registrar el módulo si no existe
        if (!this.$store.state.calendar) {
            this.$store.registerModule('calendar', moduleCalendar)
        }

        this.$store.dispatch('calendar/fetchEvents')
        this.$store.dispatch('calendar/fetchEventLabels')
        this.listaCiudades()
        this.institucion_id = ""
        this.institucion_id_temporal = ""
        this.completeInstituciones();

    },

    beforeDestroy() {
        // No desregistrar el módulo para evitar problemas si hay múltiples instancias
        // this.$store.unregisterModule('calendar')
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/apps/simple-calendar.scss";

.popup-confim-delete {
    z-index: 99999 !important;
}

/* Asegurarse que el popupPadre tenga un z-index menor */
.popupPadre {
    z-index: 50000;
}
.popupPadre {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
}
</style>
