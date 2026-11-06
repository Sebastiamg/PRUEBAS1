<template>
  <div>
    <!-- Modal Configuraciones-->
    <vs-popup title="Configurar institución" :active.sync="modalConfigInstitucion">
        <div v-if="institucion.institucion" class="vx-row">
          <div class="vx-col w-full" align="left">
            <b>{{institucion.institucion.nombreInstitucion.toUpperCase()}}</b><br>
            <b>Dirección:</b> {{institucion.institucion.nombre_ciudad.toUpperCase()}} - <span v-if="institucion.institucion.direccionInstitucion">{{institucion.institucion.direccionInstitucion.toUpperCase()}}</span><br>
          </div>
          <div class="vx-col sm:w-1/2 w-full" align="left">
            <b>Teléfono:</b> <span v-if="institucion.institucion.telefonoInstitucion">{{institucion.institucion.telefonoInstitucion.toUpperCase()}}</span> <br>
          </div>
        </div>
        <vs-divider> Configuración evaluaciones </vs-divider>
        <div class="vx-row mb-base">
          <div class="vx-col sm:w-1/2 w-full" align="left">
              <div style="font-size: 12px; color: gray;">Fecha inicio * </div>
              <flat-pickr class="mb-4 w-full" :config="configdateTimePicker" v-model="fecha_inicio" />
          </div>
          <div class="vx-col sm:w-1/2 w-full" align="left">
              <div style="font-size: 12px; color: gray;">Fecha fin * </div>
              <flat-pickr class="mb-4 w-full" :config="configdateTimePicker" v-model="fecha_fin" />
          </div>
          <div class="vx-col sm:w-1/2 w-full" align="left">
              <div style="font-size: 12px; color: gray;">Cantidad intentos (min 1, max 10) * </div>
              <vs-input class="mb-3 w-full" type="number" v-model="cant_intentos" @keypress="validarTeclaIntentos" @input="validarRangoIntentos" min="1" max="10"/>
          </div>
          <div class="vx-col sm:w-1/2 w-full" align="left">
              <div style="font-size: 12px; color: gray;">Intentos cambios de ventana (min 0, max 10) * </div>
              <vs-input class="mb-3 w-full" type="number" v-model="intentos_ventana" @keypress="validarTeclaIntentos" @input="validarRangoIntentosVentana" min="0" max="10"/>
          </div>
          <div class="vx-col w-full" align="left">
              <div style="font-size: 12px; color: gray;" align="center">
                  Ver respuestas
                  <vs-switch color="success" class="mt-3" style="width: 150px;" v-model="ver_respuestas">
                      <span slot="on">Activado</span>
                      <span slot="off">Desactivado</span>
                  </vs-switch>
              </div>
          </div>
          <div class="vx-col w-full" align="left">
            <vs-input class="mb-3 w-full" label="Observaciones" v-model="observaciones"/>
          </div>
        </div>
        <div class="bg-danger text-white p-2" style="border-radius: 10px;">
          <p>Estas seguro de configurar en el periodo de evaluación <b>{{ EvaluacionSelectSalleNombre }}</b></p>
        </div>
        <br>
        <vs-button color="success" class="w-full mb-3" type="gradient" @click="guardarConfiguracion()">Guardar</vs-button>
    </vs-popup>
    <!----fin modal configuraciones-->
    <vx-card>
        <!-----listado instituciones--------->
        <div v-if="instituciones">
        <vs-table stripe pagination max-items="25" search :data="instituciones">
          <template slot="header">
            <h5>Instituciones</h5>
            <p class="mt-1 ml-3"><vs-chip color="primary">Cantidad: {{ instituciones.length }}</vs-chip></p>
          </template>
          <template slot="thead">
              <vs-th>Institución</vs-th>
              <vs-th>Ciudad</vs-th>
              <vs-th>Periodo</vs-th>
              <vs-th>Configuración</vs-th>
              <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                #{{ tr.institucion.idInstitucion }} <br>
                {{data[indextr].institucion.nombreInstitucion}}<br>
              </vs-td>
              <vs-td>
                {{data[indextr].institucion.nombre_ciudad}}
              </vs-td>
              <vs-td>
                <p v-if="tr.institucion.id_configuracion > 0">
                  <vs-chip>Evaluación: <b class="ml-1">{{ EvaluacionSelectSalleNombre }}</b></vs-chip>
                </p>
                <p v-else>

                </p>
              </vs-td>
              <vs-td>
                Inicio: {{data[indextr].institucion.fecha_inicio}} <br>
                Fin: {{data[indextr].institucion.fecha_fin}}<br>
                Intentos de evaluaciones: {{data[indextr].institucion.cant_evaluaciones}}<br>
                Intentos cambios de ventana: {{data[indextr].institucion.intentos_ventana || 0}}<br>
                Ver respuestas: <span v-if="data[indextr].institucion.ver_respuestas === 1">SI</span>
                <span v-if="data[indextr].institucion.ver_respuestas === 0">NO</span>
              </vs-td>

              <vs-td class="text-center">
                  <vx-tooltip style="display: inline-block;" text="Configurar institución" position="top" color="primary">
                      <vs-button size="large" radius icon-pack="feather" icon="icon-settings" @click="verInstitucion(data[indextr])" color="primary" type="line"></vs-button>
                  </vx-tooltip>
              </vs-td>
          </vs-tr>
          </template>
        </vs-table>
        </div>
        <!------fin listado instituciones--------->
    </vx-card>
  </div>
</template>
<script>
    import axios from 'axios'
    import vSelect from 'vue-select'
    import flatPickr from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    export default {
        data(){
          return {
            usuario: [],
            instituciones: [],
            institucion: {},
            modalConfigInstitucion: false,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            ver_respuestas: false,
            cant_intentos: 1,
            fecha_inicio: '',
            fecha_fin: '',
            observaciones: '',
            intentos_ventana: 4,
            EvaluacionSelectSalleNombre: localStorage.EvaluacionSelectSalleNombre,
          }
        },
        components: {
          'v-select': vSelect,
          flatPickr
        },
        created(){
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          this.getInstituciones()
        },
        methods: {
          getInstituciones(){
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'instituciones_salle/'+localStorage.EvaluacionSelectSalle+'/'+localStorage.Salletipo_institucion_id)
            .then(res => {
              me.$vs.loading.close()
              me.instituciones = res.data.items
            })
            .catch(function (error) {
              console.log(error);
              me.$vs.loading.close()
            })
          },
          verInstitucion(item){
            let me = this
            me.institucion = item
            me.ver_respuestas = item.institucion.ver_respuestas
            me.fecha_inicio = item.institucion.fecha_inicio
            me.cant_intentos = item.institucion.cant_evaluaciones
            me.fecha_fin = item.institucion.fecha_fin
            me.observaciones = item.institucion.observaciones
            me.intentos_ventana = item.institucion.intentos_ventana || 3
            me.modalConfigInstitucion = true
          },
          guardarConfiguracion(){
            let me = this
            if( me.fecha_inicio === '' ||  me.fecha_fin === '' ){
              me.$vs.notify({
              text:'Debe completar los campos obligatorios antes de guardar',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-alert-triangle'})
              return
            }
            if( me.cant_intentos > 10 ){
              me.$vs.notify({
              text:'La cantidad de intentos no puede ser mayor a 10',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-alert-triangle'})
              return
            }
            if( me.cant_intentos < 1 ){
              me.$vs.notify({
              text:'La cantidad de intentos no puede ser menor a 1',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-alert-triangle'})
              return
            }
            let id_configuracion = me.institucion.institucion.id_configuracion
            let ver_respuestas = 0
            if( me.ver_respuestas === true ){
              ver_respuestas = 1
            }
            let formData = new FormData();
            formData.append('id_configuracion',   id_configuracion);
            formData.append('id_institucion',     me.institucion.institucion.idInstitucion);
            formData.append('fecha_inicio',       me.fecha_inicio);
            formData.append('fecha_fin',          me.fecha_fin);
            formData.append('cant_evaluaciones',  me.cant_intentos);
            formData.append('ver_respuestas',     ver_respuestas);
            formData.append('observaciones',      me.observaciones);
            formData.append('n_evaluacion',       localStorage.EvaluacionSelectSalle)
            formData.append('intentos_ventana',   me.intentos_ventana)
            me.$vs.loading()
            this.$http.post(this.$server_url+'save_instituciones_salle', formData)
            .then(res => {
              me.getInstituciones()
              me.modalConfigInstitucion = false
              me.$vs.loading.close()
              me.$vs.notify({
              text:'Configuración guardada correctamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
            })
            .catch(function (error) {
              console.log(error);
              me.$vs.loading.close()
            })
          },
          validarTeclaIntentos(event) {
            // Permitir solo números y teclas de control
            const charCode = event.which ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
              event.preventDefault();
              return false;
            }
            return true;
          },
          validarRangoIntentos() {
            let me = this;
            // Convertir a número y validar rango
            let valor = parseInt(me.cant_intentos);
            if (valor < 1) {
              me.cant_intentos = 1;
            } else if (valor > 10) {
              me.cant_intentos = 10;
            }
          },
          validarRangoIntentosVentana() {
            let me = this;
            // Convertir a número y validar rango
            let valor = parseInt(me.intentos_ventana);
            if (valor < 0 || isNaN(valor)) {
              me.intentos_ventana = 0;
            } else if (valor > 10) {
              me.intentos_ventana = 10;
            }
          }
        },
    }
</script>
