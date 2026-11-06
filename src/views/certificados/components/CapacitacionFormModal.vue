<template>
  <div>
    <div v-if="menu == 0" class="p-2">
      <div class="flex items-center mb-4 pb-3" style="border-bottom: 1px solid #e8e8e8;">
        <div class="flex items-center" style="gap: 10px;">
          <vs-icon :icon="mode === 'edit' ? 'edit' : 'plus-circle'" color="primary" size="20px"></vs-icon>
          <h4 class="m-0" style="font-weight: 600; color: #2c3e50;">
            {{ mode === 'edit' ? 'Editar capacitación' : 'Nueva capacitación' }} <br/><span class="text-sm text-muted">({{ periodoSelect.descripcion }})</span>
          </h4>
        </div>
        <vs-chip color="primary" size="small" class="ml-auto">
          {{ mode === 'edit' ? 'ID: ' + capacitacion.id_seminario : 'Nuevo' }}
        </vs-chip>
      </div>

      <div class="mb-4 p-3" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e8e8e8;">
        <div class="flex items-center mb-2">
          <vs-icon icon="home" color="warning" size="16px" class="mr-2"></vs-icon>
          <span style="font-weight: 600; font-size: 13px; color: #475569;">Institución</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center" style="gap: 8px;">
            <vs-icon v-if="!nombreInstitucion" icon="alert-circle" color="danger" size="18px"></vs-icon>
            <vs-icon v-else icon="check-circle" color="success" size="18px"></vs-icon>
            <span v-if="!nombreInstitucion" style="color: #ef4444; font-size: 13px;">Sin institución asignada</span>
            <vs-chip color="primary" v-else>{{ nombreInstitucion }}</vs-chip>
          </div>
          <vs-button color="warning" size="small" @click="menu = 1;" type="relief" style="border-radius: 6px;">
            {{ mode === 'edit' ? 'Cambiar' : 'Asignar' }}
          </vs-button>
        </div>
      </div>

      <div class="mb-4 p-3" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e8e8e8;">
        <div class="flex items-center mb-3">
          <vs-icon icon="book-open" color="primary" size="16px" class="mr-2"></vs-icon>
          <span style="font-weight: 600; font-size: 13px; color: #475569;">Información general</span>
        </div>
        <div class="mb-3">
          <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Tema de capacitación *</label>
          <v-select :options="arregloTemas" :reduce="arregloTemas => arregloTemas" label="tema"
            v-model="tema" placeholder="Seleccione el tema" />
        </div>
        <div class="flex" style="gap: 16px;">
          <div style="flex: 1;">
            <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Tipo *</label>
            <ul class="flex mt-1" style="list-style: none; padding: 0; gap: 12px;">
              <li>
                <vs-radio color="primary" v-model="tipoCapacitacionRadio" vs-name="radiosTipo" vs-value="0">Presencial</vs-radio>
              </li>
              <li>
                <vs-radio color="success" v-model="tipoCapacitacionRadio" vs-name="radiosTipo" vs-value="1">Virtual</vs-radio>
              </li>
            </ul>
          </div>
          <div style="flex: 1;">
            <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Área *</label>
            <v-select :options="areasCapacitacion" :reduce="area => area.value" label="label"
              v-model="area_capacitacion" placeholder="Seleccione el área" />
          </div>
        </div>
        <div class="mt-3">
          <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Nivel (Oferta Académica) *</label>
          <v-select :options="ofertas" :reduce="oferta => oferta.idofertaAcademica" label="nombreofertaAcademica"
            v-model="oferta_academica" placeholder="Seleccione el nivel" />
        </div>
      </div>

      <div v-if="mode === 'edit'" class="mb-4 p-3" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e8e8e8;">
        <div class="flex items-center mb-2">
          <vs-icon icon="flag" color="warning" size="16px" class="mr-2"></vs-icon>
          <span style="font-weight: 600; font-size: 13px; color: #475569;">Estado</span>
        </div>
        <div class="flex" style="gap: 12px;">
          <vs-radio color="warning" v-model="estado_capacitacion" vs-name="radiosEstado" vs-value="1">Pendiente</vs-radio>
          <vs-radio color="success" v-model="estado_capacitacion" vs-name="radiosEstado" vs-value="2">Realizada</vs-radio>
          <vs-radio color="danger" v-model="estado_capacitacion" vs-name="radiosEstado" vs-value="0">Cancelada</vs-radio>
        </div>
      </div>

      <div class="mb-4 p-3" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e8e8e8;">
        <div class="flex items-center mb-3">
          <vs-icon icon="users" color="success" size="16px" class="mr-2"></vs-icon>
          <span style="font-weight: 600; font-size: 13px; color: #475569;">Capacitador</span>
        </div>
        <v-select multiple :closeOnSelect="false" :options="arregloCapacitadores"
          :reduce="arregloCapacitadores => arregloCapacitadores" label="capacitador"
          v-model="capacitadorSelect" placeholder="Seleccione capacitador(es)" />
        <div class="flex items-center mt-2" style="gap: 8px;">
          <vs-switch vs-icon-on="check" color="success" v-model="notifyCapacitador"
            :disabled="capacitadorSelect.length == 0">
            <span slot="off">
              <span icon-pack="feather" icon="icon-x" class="mr-2"></span>
            </span>
          </vs-switch>
          <span style="font-size: 12px; color: #64748b;">{{ notifyCapacitador ? 'Notificar al capacitador' : 'Sin notificación' }}</span>
        </div>
        <div class="mt-3">
          <vs-input type="text" inputmode="numeric" maxlength="3" v-model="horas_capacitacion"
            label="Horas de capacitación (1 - 100)" style="width:100%;"
            @keypress="bloquearHorasCapacitacion" @input="validarHorasCapacitacion" @blur="normalizarHorasCapacitacion" />
        </div>
      </div>

      <div class="mb-4 p-3" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e8e8e8;">
        <div class="flex items-center mb-3">
          <vs-icon icon="calendar" color="danger" size="16px" class="mr-2"></vs-icon>
          <span style="font-weight: 600; font-size: 13px; color: #475569;">Fecha y hora</span>
        </div>
        <div class="mb-3">
          <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Fecha capacitación *</label>
          <flat-pickr :config="configdateTimePicker" v-model="startDate" placeholder="Seleccione fecha" style="width:100%;" />
        </div>
        <div class="flex" style="gap: 16px;">
          <div style="flex: 1;">
            <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Hora inicio *</label>
            <flat-pickr :config="configdateTimePickerTime" v-model="hora_inicio" style="width:100%;" />
          </div>
          <div style="flex: 1;">
            <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Hora fin *</label>
            <flat-pickr :config="configdateTimePickerTime" v-model="hora_fin" style="width:100%;" />
          </div>
        </div>
        <div class="mt-3">
          <label style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 4px; display: block;">Fecha fin</label>
          <flat-pickr :config="configdateTimePicker" v-model="endDate" placeholder="Seleccione fecha fin" style="width:100%;" />
        </div>
      </div>

      <div class="mb-4 p-3" style="background: #f8fafc; border-radius: 8px; border: 1px solid #e8e8e8;">
        <div class="flex items-center mb-3">
          <vs-icon icon="settings" color="dark" size="16px" class="mr-2"></vs-icon>
          <span style="font-weight: 600; font-size: 13px; color: #475569;">Configuración</span>
        </div>
        <div class="flex items-center" style="gap: 16px;">
          <div style="flex: 1;">
            <vs-input type="number" v-model="personas" label="Cantidad de asistentes" style="width:100%;"></vs-input>
          </div>
          <div style="flex: 1;">
            <div class="flex items-center" style="gap: 8px;">
              <vs-switch color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash"
                v-model="asistencia_activa">
                <span slot="on">activa</span>
                <span slot="off">inactiva</span>
              </vs-switch>
              <span style="font-size: 12px; color: #64748b;">Asistencia</span>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <vs-input class="w-full" v-model="link_reunion" label="Link de la reunión"></vs-input>
        </div>
        <div class="mt-3">
          <vs-textarea v-model="observacion" :counter="counter_long" label="Observación" height="80px"
            :counter-danger.sync="counterDanger"></vs-textarea>
        </div>
      </div>

      <div class="flex justify-end pt-3" style="border-top: 1px solid #e8e8e8;">
        <vs-button color="primary" @click="guardar()" type="filled" style="border-radius: 6px; padding: 10px 32px;">
          <vs-icon icon="save" class="mr-2" size="16px"></vs-icon>
          {{ mode === 'edit' ? 'Actualizar' : 'Guardar' }}
        </vs-button>
      </div>
    </div>

    <div v-if="menu == 1">
      <div class="flex items-center mb-4 pb-3" style="border-bottom: 1px solid #e8e8e8;">
        <vs-icon icon="arrow-left" color="primary" size="18px" class="mr-2" style="cursor:pointer;" @click="menu = 0;"></vs-icon>
        <h4 class="m-0" style="font-weight: 600; color: #2c3e50; font-size: 15px;">Buscar institución</h4>
      </div>
      <div class="flex" style="gap: 10px;">
        <div style="flex: 1;">
          <vs-input icon="search" style="width:100%;" placeholder="Escriba al menos 5 caracteres..." @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
        </div>
        <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
      </div>
      <div v-if="instituciones.length >0" class="mt-3">
        <vs-table stripe max-items="5" search pagination :data="instituciones">
          <template slot="header">
            <span style="font-size: 12px; color: #64748b;">{{instituciones.length}} institución(es) encontrada(s)</span>
          </template>
          <template slot="thead">
            <vs-th sort-key="nombreInstitucion">Institución</vs-th>
            <vs-th sort-key="nombre">Localidad</vs-th>
            <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].nombreInstitucion">
                <span style="font-weight: 500;">{{data[indextr].nombreInstitucion}}</span><br>
                <small style="color: #94a3b8;">Asesor: {{ tr.asesor }}</small>
              </vs-td>
              <vs-td :data="data[indextr].nombreregion">
                {{ data[indextr].nombreregion }}<br>
                <small v-if="data[indextr].ciudad" style="color: #94a3b8;">Ciudad: {{ data[indextr].ciudad }}</small>
                <br><small style="color: #94a3b8;">{{ data[indextr].periodo }}</small>
              </vs-td>
              <vs-td>
                <vs-button size="small" type="relief" icon-pack="feather" icon="icon-bookmark" color="primary" @click="asignarInstitucion(tr)" style="border-radius: 6px;">
                  Asignar
                </vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
export default {
  components: {
    'v-select': vSelect,
    flatPickr,
  },
  props: {
    periodoSelect: { type: Object, default: () => ({}) },
    arregloCapacitadores: { type: Array, default: () => [] },
    mode: { type: String, default: 'create' },
    capacitacion: { type: Object, default: () => ({}) },
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
      _popupResizeHandler: null,
      busquedaInstitucion: '',
      instituciones: [],
      nombreInstitucion: '',
      institucion_id: 0,
      institucion_id_temporal: '',
      periodo_id_temporal: '',
      estado_institucion_temporal: 0,
      tipoCapacitacionRadio: '0',
      capacitadorSelect: [],
      tema: null,
      ofertas: [],
      oferta_academica: null,
      areasCapacitacion: [
        { label: 'PEDAGOGIA', value: 'PEDAGOGIA' },
        { label: 'PSICOLOGIA', value: 'PSICOLOGIA' }
      ],
      area_capacitacion: null,
      arregloTemas: [],
      startDate: '',
      endDate: '',
      hora_inicio: '',
      hora_fin: '',
      link_reunion: '',
      observacion: '',
      personas: 0,
      asistencia_activa: false,
      notifyCapacitador: false,
      horas_capacitacion: 6,
      estado_capacitacion: 1,
      usuario: null,
    }
  },
  mounted() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"));
    me.getTemas()
    me.getOfertas()
    if (me.mode === 'edit' && me.capacitacion && me.capacitacion.id_seminario) {
      me.cargarDatosEdicion()
    }
    me.$nextTick(function () {
      me.ajustarAnchoPopup();
    });
    me._popupResizeHandler = function () { me.ajustarAnchoPopup(); };
    window.addEventListener('resize', me._popupResizeHandler);
  },
  beforeDestroy() {
    if (this._popupResizeHandler) {
      window.removeEventListener('resize', this._popupResizeHandler);
    }
  },
  methods: {
    getTemas() {
      let me = this;
      this.$http.get(this.$server_url + 'temasCapacitacion')
        .then(function (res) { me.arregloTemas = res.data })
        .catch(function (error) { console.log(error + ' error') })
    },
    getOfertas() {
      let me = this;
      me.$vs.loading();
      this.$http.get(this.$server_url + 'nivel')
        .then(function (res) { me.ofertas = res.data.oferta; me.$vs.loading.close() })
        .catch(function (error) { console.log(error + ' error'); me.$vs.loading.close() })
    },
    getInstitucion() {
      let me = this;
      me.instituciones = [];
      if (me.busquedaInstitucion.length < 5) {
        me.$vs.notify({ text: 'Minimo 5 caracteres de busqueda', color: 'warning', iconPack: 'feather', icon: 'icon-check' })
        return false;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?&busqueda=' + me.busquedaInstitucion)
        .then(function (res) {
          me.instituciones = res.data.filter(p => p.region == me.periodoSelect.region_idregion);
          me.$vs.loading.close()
        })
        .catch(function (error) { console.log(error + ' error'); me.$vs.loading.close() })
    },
    asignarInstitucion(tr) {
      let me = this;
      me.institucion_id = tr.idInstitucion
      me.nombreInstitucion = tr.nombreInstitucion
      me.asesorNombre = tr.asesor
      me.estado_institucion_temporal = 0;
      me.instituciones = []
      me.menu = 0
    },
    bloquearHorasCapacitacion(event) {
      const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
      if (teclasPermitidas.indexOf(event.key) !== -1) {
        return
      }
      if (!/^\d$/.test(event.key)) {
        event.preventDefault()
        return
      }
      const input = event.target
      const inicio = input.selectionStart != null ? input.selectionStart : String(this.horas_capacitacion || '').length
      const fin = input.selectionEnd != null ? input.selectionEnd : inicio
      const actual = String(this.horas_capacitacion || '')
      const siguiente = actual.substring(0, inicio) + event.key + actual.substring(fin)
      const valor = parseInt(siguiente, 10)
      if (siguiente.length > 3 || valor > 100) {
        event.preventDefault()
      }
    },
    validarHorasCapacitacion() {
      let raw = String(this.horas_capacitacion || '').replace(/\D/g, '')
      if (raw === '') {
        this.horas_capacitacion = ''
        return
      }
      let valor = parseInt(raw, 10)
      if (valor > 100) {
        valor = 100
      }
      this.horas_capacitacion = valor
    },
    normalizarHorasCapacitacion() {
      let valor = parseInt(String(this.horas_capacitacion || '').replace(/\D/g, ''), 10)
      if (isNaN(valor) || valor < 1) {
        this.horas_capacitacion = 6
        return
      }
      if (valor > 100) {
        this.horas_capacitacion = 100
        return
      }
      this.horas_capacitacion = valor
    },
    guardar() {
      let me = this;
      if (me.tema == null || me.tema == '' || me.tema == undefined) {
        me.$vs.notify({ text: 'Debe seleccionar el tema de capacitación por favor', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return false;
      }
      if (me.institucion_id <= 0 && me.estado_institucion_temporal != 1) {
        me.$vs.notify({ text: 'Seleccione una institución por favor', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return false;
      }
      if (me.oferta_academica == null || me.oferta_academica == '') {
        me.$vs.notify({ text: 'Debe seleccionar el nivel (Oferta Académica) por favor', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return false;
      }
      if (me.area_capacitacion == null || me.area_capacitacion == '') {
        me.$vs.notify({ text: 'Debe seleccionar el área de capacitación por favor', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return false;
      }
      if (!me.startDate || !me.hora_inicio || !me.hora_fin) {
        me.$vs.notify({ text: 'Complete fecha y hora por favor', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return false;
      }
      me.normalizarHorasCapacitacion()
      if (me.horas_capacitacion < 1 || me.horas_capacitacion > 100) {
        me.$vs.notify({ text: 'Las horas de capacitación deben estar entre 1 y 100', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return false;
      }
      var sendcapacitadores = ""
      if (me.capacitadorSelect.length > 0) {
        sendcapacitadores = me.capacitadorSelect.map(p => p.capacitador).join(',')
      }
      const payload = {
        'capacitacion': 'yes',
        'id_seminario': me.mode === 'edit' ? me.capacitacion.id_seminario : '0',
        'nombre': me.tema.tema,
        'tema_id': me.tema.id,
        'fecha_inicio': me.startDate,
        'fecha_fin': me.endDate || me.startDate,
        'hora_inicio': me.hora_inicio.substring ? me.hora_inicio.substring(0, 5) : me.hora_inicio,
        'hora_fin': me.hora_fin.substring ? me.hora_fin.substring(0, 5) : me.hora_fin,
        'institucion_id': me.institucion_id,
        'institucion_id_temporal': me.institucion_id_temporal,
        'estado_institucion_temporal': me.estado_institucion_temporal,
        'periodo_id_temporal': me.periodo_id_temporal,
        'nombreInstitucion': me.nombreInstitucion,
        'capacitadores': JSON.stringify(me.capacitadorSelect),
        'capacitador': sendcapacitadores,
        'periodo_id': this.periodoSelect.idperiodoescolar,
        'tipo': me.tipoCapacitacionRadio,
        'estado_capacitacion': me.mode === 'edit' ? me.estado_capacitacion : 1,
        'oferta_academica': me.oferta_academica,
        'area_capacitacion': me.area_capacitacion,
        'link_reunion': me.link_reunion,
        'cant_asistentes': me.personas,
        'observacion': me.observacion,
        'asistencia_activa': me.asistencia_activa ? 1 : 0,
        'notificado': me.notifyCapacitador ? 1 : 0,
        'horas_capacitacion': me.horas_capacitacion || 6,
        'editor_id': me.usuario ? me.usuario.idusuario : null,
        'idusuario': me.usuario.idusuario,

      }
      me.$vs.loading()
      this.$http.post(this.$server_url + 'guardar_seminario', payload)
        .then(function (res) {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', time: 5000, icon: 'icon-check' })
            return
          }
          if (me.mode === 'edit') {
            me.$emit('rechargeSeminarios', true)
          } else {
            me.$emit('recharge', true)
          }
          me.$vs.notify({
            text: me.mode === 'edit' ? 'Se actualizó correctamente' : 'Se guardó correctamente',
            color: 'success', iconPack: 'feather', icon: 'icon-check'
          })
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    cargarDatosEdicion() {
      let me = this;
      const cap = me.capacitacion;
      me.tema = cap.tema_id ? { id: cap.tema_id, tema: cap.tema || cap.nombre } : null;
      me.tipoCapacitacionRadio = String(cap.tipo != null ? cap.tipo : '0');
      me.oferta_academica = cap.oferta_academica || null;
      me.area_capacitacion = cap.area_capacitacion || null;
      me.estado_capacitacion = cap.estado_capacitacion != null ? cap.estado_capacitacion : 1;
      if (cap.fecha_inicio) {
        me.startDate = cap.fecha_inicio;
      }
      if (cap.fecha_fin) {
        me.endDate = cap.fecha_fin;
      }
      me.hora_inicio = cap.hora_inicio || '';
      me.hora_fin = cap.hora_fin || '';
      me.link_reunion = cap.link_reunion || '';
      me.observacion = cap.observacion_admin || '';
      me.personas = cap.cant_asistentes || 0;
      me.asistencia_activa = !!cap.asistencia_activa;
      me.notifyCapacitador = cap.notificado == 1;
      me.horas_capacitacion = cap.horas_capacitacion != null && cap.horas_capacitacion !== '' ? cap.horas_capacitacion : 6;
      if (String(cap.estado_institucion_temporal) === '1') {
        me.nombreInstitucion = cap.nombre_institucion_temporal || cap.nombreInstitucion || '';
        me.institucion_id_temporal = cap.institucion_id_temporal || '';
        me.periodo_id_temporal = cap.periodo_id || '';
        me.estado_institucion_temporal = 1;
        me.institucion_id = 0;
      } else {
        me.nombreInstitucion = cap.nombreInstitucion || cap.nombre_institucion || '';
        me.institucion_id = cap.id_institucion || cap.institucion_id || 0;
        me.estado_institucion_temporal = 0;
      }
      me.getCapacitadoresEdit()
    },
    getCapacitadoresEdit() {
      let me = this;
      if (!me.capacitacion.id_seminario) return;
      this.$http.get(this.$server_url + 'getCapacitadoresXCapacitacion/' + me.capacitacion.id_seminario)
        .then(function (res) { me.capacitadorSelect = res.data; })
        .catch(function (error) { console.log(error) })
    },
    ajustarAnchoPopup() {
      var popup = this.$el.closest('.vs-popup');
      if (popup) {
        popup.style.width = window.innerWidth <= 768 ? '99%' : '75%';
      }
    },
  }
}
</script>