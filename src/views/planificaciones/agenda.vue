<template>
  <div id="simple-calendar-app">
    <div class="vx-card no-scroll-content pt-2">
      <div class="w-full justify-center items-center flex lg:hidden md:hidden">
        <vs-button icon-pack="feather" class="mr-2" color="dark" style="padding: 7px 10px 7px 10px; font-size: 14px;"
          icon="icon-plus" @click="promptAddNewEvent(new Date())">Crear planificación</vs-button>
        <vs-button color="dark" type="border" style="padding: 7px 10px 7px 10px; font-size: 14px;"
          @click="$router.go()">Hoy</vs-button>

        <vs-dropdown class="ml-2">
          <vs-button color="#9ecc38" gradient-color-secondary="#3EC9D6" class="p-2" type="gradient"
            icon="expand_more">Filtros</vs-button>
          <vs-dropdown-menu>
            <vs-dropdown-item @click="get_events_progress()"> Planificaciones en curso </vs-dropdown-item>
            <vs-dropdown-item @click="get_finished_events()"> Planificaciones cumplidas </vs-dropdown-item>
            <vs-dropdown-item @click="get_incomplete_events()"> Planificaciones no cumplidas </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <calendar-view ref="calendar" :displayPeriodUom="calendarView" :show-date="showDate" :events="simpleCalendarEvents"
        :eventTop="windowWidth <= 400 ? '2rem' : '3rem'" eventBorderHeight="0px" eventContentHeight="1.65rem"
        class="theme-default" @click-date="openAddNewEvent" @click-event="openEditEvent">

        <div slot="header" class="mb-4">

          <div class="vx-row no-gutter">

            <div class="vx-col w-1/3 items-center lg:flex lg:block hidden">
              <vs-button icon-pack="feather" class="mr-2" color="dark"
                style="padding: 7px 10px 7px 10px; font-size: 14px;" icon="icon-plus"
                @click="promptAddNewEvent(new Date())">Crear planificación</vs-button>
              <vs-button color="dark" type="border" style="padding: 7px 10px 7px 10px; font-size: 14px;"
                @click="$router.go()">Hoy</vs-button>

              <vs-dropdown class="ml-2">
                <vs-button color="#9ecc38" gradient-color-secondary="#3EC9D6" class="p-2" type="gradient"
                  icon="expand_more">Filtros</vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="get_events_progress()"> Planificaciones en curso </vs-dropdown-item>
                  <vs-dropdown-item @click="get_finished_events()"> Planificaciones cumplidas </vs-dropdown-item>
                  <vs-dropdown-item @click="get_incomplete_events()"> Planificaciones no cumplidas </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>

            <div class="vx-col sm:w-1/3 w-full sm:my-0 my-3 flex sm:justify-end justify-center order-last">
              <div class="flex items-center">
                <feather-icon :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'" @click="updateMonth(-1)"
                  svgClasses="w-5 h-5 m-1" class="cursor-pointer bg-primary text-white rounded-full" />

                <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate.toString().substring(0, 16) }}</span>

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
    <vs-prompt class="calendar-event-dialog" title="Evento" accept-text="Guardar" :cancel-text="label_cancel"
      @accept="addEvent" @cancel="removeEvent" :active.sync="activePromptAddEvent">

      <div class="calendar__label-container flex mb-6">
        <vs-chip class="text-white" :class="'bg-' + labelLocal.color">{{ labelLocal.text }}</vs-chip>

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

      <vs-input class="w-full mb-3" label-placeholder="Título del evento *" v-model="title"></vs-input>

      <div class="vx-row mb-3">
        <div class="vx-col sm:w-1/2 w-full">
          <small class="date-label">Fecha inicio *</small>
          <datepicker class="w-full" name="start-date" v-model="startDate" @input="formatoFechas()"
            :disabled="disabledFrom"></datepicker>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <small class="date-label">Fecha fin *</small>
          <datepicker class="w-full" :disabledDates="disabledDatesTo" @input="formatoFechas()" name="end-date"
            v-model="endDate"></datepicker>
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
          <small class="date-label">Clasificación</small>
          <v-select :options="['Trabajo', 'Personal']" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="clasificacion" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <small class="date-label">Progreso</small>
          <v-select :options="['inicio', '25%', '50%', '75%', 'finalizado']" :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="progreso" />
        </div>
      </div>

      <vs-textarea name="event-url" class="w-full mb-3" label="Descripción del evento *" v-model="url" />

    </vs-prompt>

  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import moduleCalendar from '@/store/agenda_planificacion/moduleCalendar.js'
require('vue-simple-calendar/static/css/default.css')
import vSelect from 'vue-select'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { en, he } from 'vuejs-datepicker/src/locale'

export default {
  components: {
    CalendarView,
    CalendarViewHeader,
    Datepicker,
    flatPickr,
    'v-select': vSelect
  },
  data() {
    return {
      usuario: [],
      showDate: new Date(),
      disabledFrom: false,
      titulo: '',
      id: 0,
      title: '',
      startDate: '',
      endDate: '',
      labelLocal: { text: 'Baja', color: 'success' },
      startDate_send: '',
      endDate_sed: '',
      langHe: he,
      langEn: en,

      url: '',
      calendarView: 'month',

      activePromptAddEvent: false,
      label_cancel: 'Cancelar',
      calendarViewTypes: [
        {
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
      clasificacion: '',
      progreso: '',
    }
  },
  computed: {
    simpleCalendarEvents() {
      // console.log('asdasd')
      return this.$store.state.calendar.events
    },
    disabledDatesTo() {
      return { to: new Date(this.startDate) }
    },
    disabledDatesFrom() {
      return { from: new Date(this.endDate) }
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
    addEvent() {
      if (this.title == '' || this.startDate_send == '' || this.endDate_send == '' || this.url == '' || this.hora_inicio == '' || this.hora_fin == '' || this.clasificacion == '' || this.progreso == '') {
        this.$vs.notify({
          text: 'Complete todos los campos antes de guardar.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      const obj = { idusuario: this.usuario.idusuario, id: this.id, title: this.title, startDate: this.startDate_send, endDate: this.endDate_send, classes: 'event-' + this.labelLocal.color, label: this.labelLocal.text, url: this.url, hora_inicio: this.hora_inicio.substring(0, 5), hora_fin: this.hora_fin.substring(0, 5), clasificacion: this.clasificacion, progreso: this.progreso }

      if (this.id != 0) {
        this.$store.dispatch('calendar/editEvent', obj)
      } else {
        this.$store.dispatch('calendar/addEvent', obj)
      }
    },
    updateMonth(val) {
      this.showDate = this.$refs.calendar.getIncrementedPeriod(val)
    },
    clearFields() {
      this.title = this.endDate = this.url = ''
      this.clasificacion = ''
      this.progreso = ''
      this.id = 0
      this.labelLocal = { text: 'Baja', color: 'success' }
      this.label_cancel = 'Cancelar'
    },
    promptAddNewEvent(date) {
      this.disabledFrom = false
      this.addNewEventDialog(date)
    },
    addNewEventDialog(date) {
      this.clearFields()
      this.startDate = date
      this.endDate = date
      this.formatoFechas()
      this.activePromptAddEvent = true
    },
    openAddNewEvent(date) {
      this.disabledFrom = true
      this.addNewEventDialog(date)
    },
    openEditEvent(event) {
      const e = this.$store.getters['calendar/getEvent'](event.id)
      this.id = e.id
      this.title = e.title.split('(')[0]
      this.startDate = e.startDate
      this.endDate = e.endDate
      this.url = e.url
      this.labelLocal = { text: e.label, color: e.classes.split('-')[1] }
      this.startDate_send = this.startDate
      this.endDate_send = this.endDate
      this.hora_inicio = e.hora_inicio
      this.hora_fin = e.hora_fin
      this.clasificacion = e.clasificacion
      this.progreso = e.progreso
      this.label_cancel = 'Remover'
      this.activePromptAddEvent = true
    },
    removeEvent() {
      if (this.id == 0) { return }
      this.$store.dispatch('calendar/removeEvent', this.id)
    },
    eventDragged(event, date) {
      const e = this.$store.getters['calendar/getEvent'](event.id)
      this.$store.dispatch('calendar/eventDragged', { event, date })
    },
    formatoFechas() {
      this.startDate_send = moment(this.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      this.endDate_send = moment(this.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    },
    get_events_progress() {
      this.$store.dispatch('calendar/fetchEvents')
    },
    get_finished_events() {
      this.$store.dispatch('calendar/get_finished_events')
    },
    get_incomplete_events() {
      this.$store.dispatch('calendar/get_incomplete_events')
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    this.$store.registerModule('calendar', moduleCalendar)
    this.$store.dispatch('calendar/fetchEvents')
    this.$store.dispatch('calendar/fetchEventLabels')
  },
  beforeDestroy() {
    this.$store.unregisterModule('calendar')
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/apps/simple-calendar.scss";
</style>
