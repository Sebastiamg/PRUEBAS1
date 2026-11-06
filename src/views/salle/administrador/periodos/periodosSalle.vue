<template>
  <div>
    OOO {{ filtroTipoSeleccionado }}
    <div>
      <vs-alert active="true" class="mt-2" color="danger" v-if="filtroActivos.length > 1">
        <p class="text-center"><ion-icon name="warning-outline"></ion-icon> Existe más de 2 <b>períodos</b> de evaluación Asignados</p>
      </vs-alert>
    </div>
    <br>

    <!-- Filtros por tipo de institución -->
    <vx-card title="Filtrar por Tipo de Institución" class="mb-4" v-if="userRoot">
      <div class="filtros-container">
        <div class="radio-group">
          <vs-radio v-if="contadores.todos > 0" v-model="filtroTipoSeleccionado" vs-value="todos" class="filter-radio">
            Todos
            <span class="badge-count" :class="{ 'badge-zero': contadores.todos === 0 }">{{ contadores.todos }}</span>
          </vs-radio>

          <vs-radio
            v-for="tipo in tiposInstitucionesConDatos"
            :key="tipo.id"
            v-model="filtroTipoSeleccionado"
            :vs-value="tipo.id"
            class="filter-radio"
          >
            {{ tipo.descripcion }}
            <span class="badge-count" :class="{ 'badge-zero': (contadores[tipo.id] || 0) === 0 }">{{ contadores[tipo.id] || 0 }}</span>
          </vs-radio>
        </div>
      </div>
    </vx-card>

    <!--FIN DEL CONTENIDO POPUP PARA AGREGAR UN Agregar / Editar-->
    <vx-card title="Periodo Evaluación" v-if="userAdminSalle || userRoot">
      <vs-alert
        color="primary"
        title="Mensaje" active="true">
        <p>Solo puede estar una <b>Evaluación</b> activa, las preguntas de dicha evaluación se mostrara a los docentes</p>
      </vs-alert>
      <!--Tabla para el listado de la tabla periodos-->
      <vs-table stripe max-items="50" search pagination :data="periodosFiltrados">
        <template slot="header">
          <vs-button @click="limpiarcampos();addPeriodo();" style="margin-left: 5px;" color="success" type="filled">
              + Agregar Evaluación
          </vs-button>
        </template>
        <template slot="thead">
          <vs-th>Id</vs-th>
          <vs-th>Tipo Evaluacion</vs-th>
          <vs-th>Nombre</vs-th>
          <vs-th>Estado</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].nombre">
              {{data[indextr].id}}
            </vs-td>
            <vs-td>
              {{ tr.tipo_institucion }}
            </vs-td>
            <vs-td :data="data[indextr].nombre">
              {{data[indextr].nombre}}
            </vs-td>
            <vs-td :data="data[indextr].estado">
              <label v-if="data[indextr].estado == '1'" class="text-success">Activo</label>
              <label v-if="data[indextr].estado == '0'" class="text-danger">Inactivo</label>
            </vs-td>
            <vs-td :data="tr">
                <div class="flex">
                  <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                    <vs-button type="line" radius size="large" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="update = true; openModal(data[indextr]);"></vs-button>
                  </vx-tooltip>
                  <vx-tooltip style="display: inline-block;" text="Desactivar" position="top" color="primary">
                    <vs-button type="line" radius v-if="data[indextr].estado == '1'" size="large" icon-pack="feather" icon="icon-x" class="mr-2" color="danger" @click="cambiarEstado(tr,0)"></vs-button>
                  </vx-tooltip>
                  <vx-tooltip style="display: inline-block;" text="Activar" position="top" color="primary">
                    <vs-button color="primary" radius v-if="data[indextr].estado == '0'" size="large" type="line" icon-pack="feather" icon="icon-check" @click="cambiarEstado(tr,1)"></vs-button>
                  </vx-tooltip>
                </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
    <!--MODALES-->
    <!--Contenido del boton agregar un periodo-->
    <div class="centerx">
      <vs-popup classContent="popup-example" :title="titleModal" :active.sync="popupActivo2">
        <div class="vx-row">
          <!-- Campo Nombre -->
          <div class="vx-col w-full sm:w-full md:w-full lg:w-full mb-4">
            <label class="vs-input--label block mb-2">Nombre</label>
            <vs-input
              class="inputx w-full"
              placeholder="Ingrese el nombre del período"
              v-model="periodo.nombre"
            />
          </div>
          <!-- Campo Tipo de Institución -->
          <div class="vx-col w-full sm:w-full md:w-full lg:w-full mb-4">
            <label class="vs-input--label block mb-2">Tipo de Evaluación</label>
            <v-select
              :options="arrayTipoInstituciones"
              :reduce="arrayTipoInstituciones => arrayTipoInstituciones.id"
              label="descripcion"
              placeholder="--Seleccione--"
              class="w-full"
              v-model="periodo.tipo_institucion_id"
              :disabled="userAdminSalle"
            />
          </div>

          <!-- Botón Guardar -->
          <div class="vx-col w-full sm:w-full md:w-full lg:w-full">
            <div class="flex justify-center mt-2">
              <vs-button
                @click="agregarPeriodo();"
                class="w-full sm:w-auto px-8"
                color="primary"
                type="filled"
              >
                Guardar Cambios
              </vs-button>
            </div>
          </div>
          <br><br><br><br>
        </div>
      </vs-popup>
    </div>
  </div>
  </template>
  <script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import Vue from 'vue'
  import axios from 'axios'
  import vSelect from 'vue-select'
  import moment from 'moment'
  import $ from 'jquery'
  import {
    mapState
} from "vuex";
  export default {
      data: () => ({
          //para el modal
          popupActivo2: false,
          id: 0,
          titleModal: '',
          arregloPeriodos: [],
          usuario: '',
          usuario_id: '',
          periodo: {
            nombre: '',
            tipo_institucion_id: '',
          },
          configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d'
          },
          filtroActivos:0,
          userAdminSalle:false,
          arrayTipoInstituciones: [],
          filtroTipoSeleccionado: 'todos',
      }),
      components:{
         flatPickr,
         vSelect,
      },
      computed: {
          ...mapState(['userRoot']),

          // Filtrar períodos según el tipo de institución seleccionado
          periodosFiltrados() {
            if (this.filtroTipoSeleccionado === 'todos') {
              return this.arregloPeriodos;
            }
            return this.arregloPeriodos.filter(
              periodo => periodo.tipo_institucion_id === this.filtroTipoSeleccionado
            );
          },

          // Contadores por tipo de institución
          contadores() {
            const counts = {
              todos: this.arregloPeriodos.length
            };

            // Contar por cada tipo de institución
            this.arrayTipoInstituciones.forEach(tipo => {
              counts[tipo.id] = this.arregloPeriodos.filter(
                periodo => periodo.tipo_institucion_id === tipo.id
              ).length;
            });

            return counts;
          },

          // Filtrar tipos de institución que tienen al menos un período
          tiposInstitucionesConDatos() {
            return this.arrayTipoInstituciones.filter(tipo => {
              return (this.contadores[tipo.id] || 0) > 0;
            });
          }
      },
      mounted() {
        let me = this;
        me.usuario    = JSON.parse(localStorage.getItem('usuario'));
        me.usuario_id = me.usuario.idusuario
        if(me.usuario.id_group == 12) me.userAdminSalle = true;
        me.getAdmin();
        me.getTiposInstitucion();
      },
      methods: {
        async getTiposInstitucion() {
          let me = this;
          this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
            .then(function (response) {
                if (response.data.status == 1) {
                    me.arrayTipoInstituciones = response.data.data;
                }
            })
            .catch(function (error) {
                console.log('Error al cargar tipos de institución:', error);
            });
        },
        getAdmin() {
          let me = this;
          me.$vs.loading()
          this.$http.get(this.$server_url+'salle/periodos')
            .then(function (response) {
              me.$vs.loading.close()
              if(me.usuario.id_group == 1){
                me.arregloPeriodos = response.data;
              }else{
                me.arregloPeriodos = response.data.filter(p => p.tipo_institucion_id == localStorage.Salletipo_institucion_id);
              }

              let datos = me.arregloPeriodos
              if(datos.length > 0){
                //solo puede activo 2 periodos para cambiar
                let preData = datos.filter(p => p.estado == '1' && p.tipo_institucion_id == me.filtroTipoSeleccionado);
                me.filtroActivos = preData
              }
            })
            .catch(function (error) {
              me.$vs.loading.close()
            })
        },
        addPeriodo() {
          let me = this;
          me.id = 0
          me.popupActivo2 = true;
        },
        //para agregar periodo
        agregarPeriodo() {
          let me = this;
          let formData = new FormData();
          //validacion
          if(me.periodo.nombre == ""){
            me.$vs.notify({
              text: 'Debe seleccionar un nombre por favor',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            return
          }
          if(me.periodo.tipo_institucion_id == "" || me.periodo.tipo_institucion_id == null || me.periodo.tipo_institucion_id == undefined){
            me.$vs.notify({
              text: 'Debe seleccionar un tipo de institución por favor',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            return
          }
          formData.append('id',                   me.id);
          formData.append('nombre',               me.periodo.nombre);
          formData.append('tipo_institucion_id',  me.periodo.tipo_institucion_id);
          me.$vs.loading()
          this.$http.post(this.$server_url+'salle/periodos', formData)
            .then(res => {
              me.$vs.loading.close()
              me.getAdmin();
              me.popupActivo2 = false
              me.$vs.notify({
                text: 'Periodo guardado exitosamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
            })
        },
        openModal(data = {}) {
          let me = this;
          this.id                             = data.id;
          this.titleModal                     = "Modificar Período Evaluación";
          this.periodo.nombre                 = data.nombre;
          this.periodo.tipo_institucion_id    = data.tipo_institucion_id;
          me.popupActivo2                     = true
        },
        limpiarcampos() {
          this.id                             = 0;
          this.titleModal                     = "Crear Período Evaluación";
          // Si es admin salle, establecer el tipo de institución del localStorage
          this.periodo.tipo_institucion_id    = this.userAdminSalle ? parseInt(localStorage.Salletipo_institucion_id) : "";
          this.periodo.nombre                 = "";
        },
        // desactivar el estado de la tabla
        cambiarEstado(tr,estado) {
          let me = this;
          let formData = new FormData();
          formData.append('cambiarEstadoPeriodo','yes')
          formData.append('id',     tr.id);
          formData.append('estado', estado);
          me.$vs.loading()
          this.$http.post(this.$server_url+'salle/periodos', formData)
            .then(res => {
              me.$vs.loading.close()
              me.getAdmin();
              if(res.data.status == 0){
                me.$vs.notify({
                  text: res.data.message,
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-check',
                  time:4000
                })
                return
              }
              me.$vs.notify({
                text: 'Estado actualizado correctamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
            })
            .catch((e) =>{
              me.$vs.loading.close()
            })
        },
      },
  }
  </script>
  <style scoped>
  .features {
    display: flex;
    flex-direction: column;
  }
  .features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .features li + * {
    margin-top: 0.75rem;
  }
  .features .icon {
    background-color: #1FCAC5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  .features .icon svg {
    width: 14px;
    height: 14px;
  }
  .features + * {
    margin-top: 1.25rem;
  }

  /* Estilos para filtros */
  .filtros-container {
    padding: 10px 0;
  }

  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .filter-radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 2px solid #e8e8e8;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .filter-radio:hover {
    background: #f0f0f0;
    border-color: #d0d0d0;
  }

  .badge-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 2px 8px;
    background: #1f6feb;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 6px;
  }

  .badge-count.badge-zero {
    background: #d1d5db;
    color: #6b7280;
  }

  .vs-radio-content input:checked ~ .vs-radio .badge-count {
    background: #28a745;
  }

  .vs-radio-content input:checked ~ .vs-radio .badge-count.badge-zero {
    background: #9ca3af;
    color: #4b5563;
  }

  </style>


