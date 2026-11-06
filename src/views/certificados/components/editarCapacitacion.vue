<template>
  <div>
    <div v-if="menu == 0">
      <div class="mt-3">
        <small class="date-label">Tema de Capacitación *</small>
        <v-select :options="arregloTemas" :reduce="arregloTemas => arregloTemas" label="tema" class="w-full mt-2"
          v-model="tema" placeholder="Seleccione el tema" :disabled="!userRoot" />
      </div>
      <vs-row class="mt-2">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null">
            Sin Institución
          </p>
          <vs-chip color="success" v-else>
            Institución {{ nombreInstitucion }}
          </vs-chip>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-button color="warning" class="mt-2" size="small" @click="tipoCapacitacion = 0; menu = 1;"
            type="relief">Asignar institución de prolipa</vs-button>
          <vs-button color="primary" class="mt-2 ml-3" icon="info" size="small"
            @click="; tipoCapacitacion = 1; menu = 1;" type="relief">Institución creada por el asesor</vs-button>
        </vs-col>
      </vs-row>
      <p class="m-3">
        Tipo de capacitación:
      </p>
      <div style="display: flex;">
        <div class="ml-1">
          <ul style="display:flex;">
            <li>
              <vs-radio color="primary" v-model="objectEdit.tipo" vs-name="radiosTipo"
                vs-value="0">Presencial</vs-radio>
            </li>
            <li class="ml-3">
              <vs-radio color="success" v-model="objectEdit.tipo" vs-name="radiosTipo" vs-value="1">Virtual</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-3">
        <small class="date-label">Nivel (Oferta Académica) *</small>
        <v-select :options="ofertas" :reduce="oferta => oferta.idofertaAcademica" label="nombreofertaAcademica"
          class="w-full mt-2" v-model="oferta_academica" placeholder="Escoja el nivel (obligatorio)" />
      </div>
      <div class="mt-3">
        <small class="date-label">Área de Capacitación *</small>
        <v-select :options="areasCapacitacion" :reduce="area => area.value" label="label" class="w-full mt-2"
          v-model="area_capacitacion" placeholder="Escoja el área (obligatorio)" />
      </div>
      <div class="mt-3">
        <div>Marcar la capacitacion actual como:</div>
        <vs-radio class="m-3" color="warning" v-model="objectEdit.estado" vs-name="radios2"
          vs-value="1">Pendiente</vs-radio>
        <vs-radio class="m-3" color="success" v-model="objectEdit.estado" vs-name="radios2"
          vs-value="2">Realizada</vs-radio>
        <vs-radio class="m-3" color="danger" v-model="objectEdit.estado" vs-name="radios2"
          vs-value="0">Cancelada</vs-radio>
        <div class="mt-3">
          <p>Fecha capacitación</p>
          <flat-pickr :config="configdateTimePicker" v-model="objectEdit.startDate" placeholder="Fecha capacitación"
            class="m-1" style="display: inline-block;width: 100%;" />
        </div>
        <div class="flex" style="justify-content: space-between;">
          <div class="mt-3">
            <p>Hora inicio *</p>
            <flat-pickr :config="configdateTimePickerTime" v-model="agenda_editar.hora_inicio" />
          </div>
          <div class="mt-3">
            <p>Hora fin *</p>
            <flat-pickr :config="configdateTimePickerTime" v-model="agenda_editar.hora_fin" />
          </div>
        </div>
        <div class="mt-3">
          <p>Fecha fin</p>
          <flat-pickr :config="configdateTimePicker" v-model="agenda_editar.endDate" placeholder="Fecha Fin" class="m-1"
            style="display: inline-block;width: 100%;" />
        </div>
        <div class="mt-3">
          <div style="display:flex;">
            <div>
              <vs-input type="number" v-model="agenda_editar.personas" label="Cantidad de asistentes"></vs-input>
            </div>
            <div>
              <vs-switch color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash"
                v-model="agenda_editar.asistencia_activa" style="width: 150px;margin-top:30px;margin-left:50px;">
                <span slot="on">asistencia activa</span>
                <span slot="off">asistencia inactiva</span>
              </vs-switch>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <p>Seleccione el Capacitador:</p>
          <v-select multiple :closeOnSelect="false" :options="arregloCapacitadores"
            :reduce="arregloCapacitadores => arregloCapacitadores" label="capacitador" class="w-full"
            v-model="capacitadorCapacitacion"
            @input="capacitadorCapacitacion.length == 0 ? notifyCapacitador = false : ''" />
          <br>
          <div class="flex justify-center items-center">
            <vs-switch vs-icon-on="check" color="success" v-model="notifyCapacitador" class="mr-2"
              :disabled="capacitadorCapacitacion.length == 0">
              <span slot="off">
                <span icon-pack="feather" icon="icon-x" class="mr-2"></span>
              </span>
            </vs-switch>
            <span>{{ notifyCapacitador ? 'Capacitación notificada' : 'Capacitación no notificada' }}</span>
          </div>
        </div>
        <div class="mt-3">
          <vs-input class="w-full" v-model="agenda_editar.link_reunion" label="Link de la reunión"></vs-input>
        </div>
        <div class="mt-3">
          <vs-textarea v-model="agenda_editar.observacion" :counter="counter_long" label="observación" height="130px"
            :counter-danger.sync="counterDanger"></vs-textarea>
        </div>
        <div>
          <vs-button class="mt-5" color="primary" @click="editar_seminario();" type="filled">Guardar</vs-button>
        </div>
      </div>
    </div>
    <!--ASIGNAR INSTITUCION PROLIPA-->
    <div v-if="menu == 1">
      <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
      <AsignarInstitucionVue :tipoCapacitacion="tipoCapacitacion" :arregloCiudad="arregloCiudad"
        @changeInstitucionCreada="changeInstitucionCreada" />
    </div>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
import AsignarInstitucionVue from './AsignarInstitucion.vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
export default {
  components: {
    'v-select': vSelect,
    flatPickr,
    AsignarInstitucionVue,
  },
  data() {
    return {
      counter_long: 200,
      counterDanger: false,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:s'
      },
      configdateTimePickerTime: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true
      },
      menu: 0,
      arregloCiudad: [],
      nombreInstitucion: '',
      institucion_id_temporal: 0,
      periodo_id_temporal: 0,
      estado_institucion_temporal: 0,
      institucion_id: 0,
      estado_institucion_temporal: 0,
      tipoCapacitacion: 0,
      capacitadorCapacitacion: [],
      objectEdit: '',
      usuario: '',
      notifyCapacitador: false,
      ofertas: [],
      oferta_academica: null,
      areasCapacitacion: [
        { label: 'PEDAGOGIA', value: 'PEDAGOGIA' },
        { label: 'PSICOLOGIA', value: 'PSICOLOGIA' }
      ],
      area_capacitacion: null,
      arregloTemas: [],
      tema: null,
    }
  },
  props: {
    periodoSelect: {
      type: Object,
      default: {}
    },
    agenda_editar: {
      type: Object,
      default: {}
    },
    capacitacion: {
      type: Object,
      default: {}
    },
    arregloCapacitadores: {
      type: Array,
      default: []
    },
  },
  computed: {
    ...mapState(['userRoot']),
  },
  mounted() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"));
    // console.log("usuario", me.usuario);
    me.objectEdit = me.agenda_editar
    if (me.agenda_editar.notificado == 1) {
      me.notifyCapacitador = true
    }
    me.listaCiudades()
    me.getOfertas()
    me.getTemas()
    if (me.capacitacion.estado_institucion_temporal == "1") {
      this.nombreInstitucion = me.capacitacion.nombre_institucion_temporal
      this.institucion_id_temporal = me.capacitacion.institucion_id_temporal
      this.periodo_id_temporal = me.capacitacion.periodo_id
      this.estado_institucion_temporal = 1
    } else {
      this.nombreInstitucion = me.capacitacion.nombreInstitucion
      this.institucion_id = me.capacitacion.id_institucion
      this.estado_institucion_temporal = 0
    }
    me.oferta_academica = me.capacitacion.oferta_academica
    me.area_capacitacion = me.capacitacion.area_capacitacion
    // Inicializar tema seleccionado
    if (me.capacitacion.tema_id) {
      me.tema = {
        id: me.capacitacion.tema_id,
        tema: me.capacitacion.tema
      }
    }
    me.getCapacitadoresSelect()
  },
  created() {
    console.log(this.capacitacion)
  },
  methods: {
    sendNotifyCapacitador() {
      let me = this;

      const payload = {
        id_seminario: me.objectEdit.id,
        capacitador_id: JSON.stringify(me.capacitadorCapacitacion.map(p => p.idusuario).join(',')),
        notificado: me.notifyCapacitador ? 1 : 0
      };

      this.$http.post(this.$server_url + 'notificar_capacitador', payload)
        .then(function (res) {
          me.$vs.notify({
            text: me.notifyCapacitador ? 'Capacitador notificado' : 'Notificación al capacitador cancelada',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 4000
          });
        })
        .catch(function (error) {
          me.$vs.notify({
            text: 'Error al actualizar la notificación',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-x',
            time: 4000
          });
        })
        .finally(() => {
          setTimeout(() => {
          }, 100);
        });
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
    getTemas() {
      let me = this;
      this.$http.get(this.$server_url + 'temasCapacitacion')
        .then(function (res) {
          me.arregloTemas = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    //lista de ciudades para usar en el select
    getCapacitadoresSelect() {
      let me = this
      me.capacitadorCapacitacion = [];
      this.$vs.loading()
      this.$http.get(this.$server_url + `getCapacitadoresXCapacitacion/` + me.objectEdit.id).then(res => {
        me.capacitadorCapacitacion = res.data;
      })
        .catch(function (error) {
          console.log(error)
        }).finally(() => {
          me.$vs.loading.close()
        });
    },
    editar_seminario() {
      let me = this
      // Validaciones
      if (me.tema == null || me.tema == '' || me.tema == undefined) {
        me.$vs.notify({
          text: 'Debe seleccionar el tema de capacitación por favor',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return false;
      }
      if (me.oferta_academica == null || me.oferta_academica == '' || me.oferta_academica == undefined) {
        me.$vs.notify({
          text: 'Debe seleccionar el nivel (Oferta Académica) por favor',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return false;
      }
      if (me.area_capacitacion == null || me.area_capacitacion == '' || me.area_capacitacion == undefined) {
        me.$vs.notify({
          text: 'Debe seleccionar el área de capacitación por favor',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return false;
      }
      me.$vs.loading()
      let seminario = ''
      var sendcapacitadores = ""
      if (me.capacitadorCapacitacion.length > 0) {
        const LlenarCapacitadores = me.capacitadorCapacitacion.map(p => p.capacitador)
        sendcapacitadores = LlenarCapacitadores.join(',')
      }
      // Convertir tipo a número
      const tipoNumber = parseInt(me.objectEdit.tipo) || 0;
      seminario = {
        'capacitacion': "yes",
        'id_seminario': me.objectEdit.id,
        'nombre': me.tema.tema,
        'tema_id': me.tema.id,
        'fecha_inicio': me.objectEdit.startDate,
        'fecha_fin': me.objectEdit.endDate,
        'link_reunion': me.objectEdit.link_reunion,
        'cant_asistentes': me.objectEdit.personas,
        'observacion': me.objectEdit.observacion,
        'estado_capacitacion': me.objectEdit.estado,
        'asistencia_activa': me.objectEdit.asistencia_activa,
        'institucion_id': me.institucion_id,
        'institucion_id_temporal': me.institucion_id_temporal,
        'estado_institucion_temporal': me.estado_institucion_temporal,
        'periodo_id_temporal': me.periodo_id_temporal,
        'nombreInstitucion': me.nombreInstitucion,
        'capacitadores': JSON.stringify(me.capacitadorCapacitacion),
        'capacitador': sendcapacitadores,
        'periodo_id': this.periodoSelect.idperiodoescolar,
        'hora_inicio': me.objectEdit.hora_inicio,
        'hora_fin': me.objectEdit.hora_fin,
        'tipo': tipoNumber,
        'editor_id': me.usuario.idusuario,
        'notificado': me.notifyCapacitador ? 1 : 0,
        'oferta_academica': me.oferta_academica,
        'area_capacitacion': me.area_capacitacion
      }
      console.log('seminario a editar', seminario)
      this.$http.post(this.$server_url + 'guardar_seminario', seminario)
        .then(function (res) {
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              time: 5000,
              icon: 'icon-check'
            })
            return
          }
          this.sendNotifyCapacitador()
          me.$vs.notify({
            text: res.data.message || 'Se actualizo correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
        .finally(() => {
          me.$vs.loading.close()
          me.$emit('rechargeSeminarios', true)
        });
    },
    changeInstitucionCreada(e) {
      let me = this
      me.institucion_id = e.institucion_id
      me.nombreInstitucion = e.nombreInstitucion
      me.institucion_id_temporal = e.institucion_id_temporal
      me.periodo_id_temporal = e.periodo_id_temporal
      me.estado_institucion_temporal = e.estado_institucion_temporal
      me.menu = 0
    }
  }
}
</script>
