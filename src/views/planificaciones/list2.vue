<template>
  <div>
    <vx-card>
      <div>
        <b>Seleccione un libro para mostrar las planificaciones:</b>

        <!-- Filtros opcionales -->
        <div class="filtros-container">
          <div class="filtro-group tipo-filtro">
            <label class="filtro-titulo">Seleccione tipo de filtro:</label>
            <div class="radio-group-inline">
              <div class="radio-item">
                <input type="radio" id="sin-filtro" value="" v-model="tipoFiltro" @change="cambiarTipoFiltro" />
                <label for="sin-filtro">Sin filtro</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="tipo-serie" value="serie" v-model="tipoFiltro" @change="cambiarTipoFiltro" />
                <label for="tipo-serie">Filtrar por Serie</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="tipo-area" value="area" v-model="tipoFiltro" @change="cambiarTipoFiltro" />
                <label for="tipo-area">Filtrar por Área</label>
              </div>
            </div>
          </div>

          <div class="filtro-group" v-if="tipoFiltro === 'serie'">
            <label for="filtro-serie">Seleccione la Serie:</label>
            <v-select
              id="filtro-serie"
              :options="seriesDisponibles"
              v-model="filtroSerie"
              placeholder="TODAS LAS SERIES"
              label="nombre"
              :reduce="serie => serie.valor"
              class="w-full mt-2"
              clearable
            />
          </div>

          <div class="filtro-group" v-if="tipoFiltro === 'area'">
            <label for="filtro-area">Seleccione el Área:</label>
            <v-select
              id="filtro-area"
              :options="areasDisponibles"
              v-model="filtroArea"
              placeholder="TODAS LAS ÁREAS"
              label="nombre"
              :reduce="area => area.valor"
              class="w-full mt-2"
              clearable
            />
          </div>
        </div>

        <v-select
          :options="librosFiltrados"
          :reduce="libro => libro.asignatura_idasignatura"
          placeholder="Seleccione un libro"
          label="nombrelibro"
          class="w-full mt-2"
          @input="getPlanificacion()"
          v-model="bookSelect"
        />

        <!-- Contador de libros disponibles -->
        <div class="contador-libros mt-2" v-if="librosFiltrados.length > 0">
          <small>Mostrando {{ librosFiltrados.length }} de {{ arrayBooks.length }} libros</small>
        </div>
      </div>

      <br>
      <div class="row" v-if="(bookSelect !== '') && (userRoot || userAdministrador)" align="center">
        <vs-button color="primary" icon-pack="feather" style="margin: 1px;" icon="icon-send"
          @click="getTransferenciaPlanificacion()">
          Transferir planificaciones
        </vs-button>
      </div>

      <vs-table max-items="20" search pagination :data="lista">
        <template slot="header">
          <!-- Cantidad arriba -->
          <div class="row">
            Cantidad: {{ lista.length }}
          </div>
        </template>
        <template slot="thead">
          <vs-th>#</vs-th>
          <vs-th sort-key="nombreasignatura" width="40%">Asignatura</vs-th>
          <vs-th sort-key="nombreplanificacion">Planificacion</vs-th>
          <vs-th sort-key="Estado_idEstado">Estado</vs-th>
          <vs-th sort-key="nombre" width="10%">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{ indextr + 1 }}
            </vs-td>
            <vs-td :data="tr.nombreasignatura">
              {{ tr.nombreasignatura }}
            </vs-td>
            <vs-td :data="tr.nombreplanificacion">
              {{ tr.nombreplanificacion }}<br>
              <small>{{ tr.descripcionplanificacion }}</small> <br>
              <i class="text-primary cursor-pointer" @click="verPlanificacion(tr.webplanificacion)"><u>{{
                tr.webplanificacion }}</u></i><br>
              <p style="font-weight:bold;">Fecha create</p>
              <small>{{ tr.created_at }}</small>
              <p style="font-weight:bold;">Usuario creador</p>
              <span>{{ tr.usuario }}</span>
            </vs-td>

            <vs-td>
              <div v-if="tr.Estado_idEstado == '1'">
                <vs-chip color="primary">
                  <p>Activo</p>
                </vs-chip>
              </div>
              <div v-else>
                <vs-chip color="danger">
                  <p>Inactivo</p>
                </vs-chip>
              </div>
            </vs-td>
            <vs-td>
              <vx-tooltip style="display: inline-block;" text="Descargar" position="top" color="primary">
                <vs-button type="border" size="small" color="success" style="display: inline-block;" class="p-2"
                  icon-pack="feather" icon="icon-download-cloud" @click="descargarPlanificacion(tr)"></vs-button>
              </vx-tooltip>
              <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                <vs-button type="border" size="small" style="display: inline-block;" class="p-2 ml-1"
                  icon-pack="feather" icon="icon-edit" @click="editaContenido(tr)"></vs-button>
              </vx-tooltip>
              <vx-tooltip v-if="permisoRoot == true" style="display: inline-block;" text="Eliminar" position="top"
                color="danger">
                <vs-button type="border" size="small" style="display: inline-block;" class="p-2 ml-1"
                  icon-pack="feather" icon="icon-trash" color="danger"
                  @click="confirmaEliminar(tr.idplanificacion)"></vs-button>
              </vx-tooltip>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <!-- SECCION TRANFERIR UNIDADES -->
    </vx-card>
    <vs-popup class="informacionformhijo"
      :title="lista.length > 0 ? `Transferir Planificaciones del libro: ${nombrelibroSeleccionado ? nombrelibroSeleccionado.nombrelibro : ''}` : 'Transferir Planificaciones'"
      :active.sync="popupActivoTransferenciaPlanificacion">
      <TransferenciaPlanificacion v-if="popupActivoTransferenciaPlanificacion" :bookSelect="bookSelect"
        :arrayBooks="arrayBooks" :filtroSerie="filtroSerie"
    :filtroArea="filtroArea"        @change="changeHandleTransferenciaPlanificacion" />
    </vs-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LibroRepository from '../../repositories/LibroRepository';
import vSelect from 'vue-select'
import axios from 'axios'

const TransferenciaPlanificacion = () => import("@/views/planificaciones/transferenciaPlanificacion.vue");

export default {
  components: {
    vSelect,
    TransferenciaPlanificacion,
  },
  data() {
    return {
      lista: [],
      eliminarId: '',
      permisoRoot: false,
      usuario: [],
      arrayBooks: [],
      bookSelect: '',
      popupActivoTransferenciaPlanificacion: false,
      nombrelibroSeleccionado: '',
      tipoFiltro: '',
      filtroSerie: '',
      filtroArea: ''
    }
  },
  props: {
    libroSelecionado: {
      type: Number,
      default: 0
    },
  },
  created() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  computed: {
    ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'userAdminFacturador', 'userAdministrador']),

    // Obtener series únicas para el filtro
    seriesDisponibles() {
      if (!this.arrayBooks || this.arrayBooks.length === 0) {
        return []
      }

      const seriesMap = new Map()
      this.arrayBooks.forEach(libro => {
        if (libro.nombre_serie && libro.nombre_serie !== 'null') {
          seriesMap.set(libro.nombre_serie, {
            nombre: libro.nombre_serie,
            valor: libro.nombre_serie
          })
        }
      })

      return Array.from(seriesMap.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
    },

    // Obtener áreas únicas para el filtro
    areasDisponibles() {
      if (!this.arrayBooks || this.arrayBooks.length === 0) {
        return []
      }

      const areasMap = new Map()
      this.arrayBooks.forEach(libro => {
        if (libro.nombrearea && libro.nombrearea !== 'null') {
          areasMap.set(libro.nombrearea, {
            nombre: libro.nombrearea,
            valor: libro.nombrearea
          })
        }
      })

      return Array.from(areasMap.values()).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
    },

    // Libros filtrados según selección
    librosFiltrados() {
      if (!this.arrayBooks || this.arrayBooks.length === 0) {
        return []
      }

      let filtrados = [...this.arrayBooks]

      // Aplicar filtro según el tipo seleccionado
      if (this.tipoFiltro === 'serie' && this.filtroSerie) {
        filtrados = filtrados.filter(libro =>
          libro.nombre_serie === this.filtroSerie
        )
      } else if (this.tipoFiltro === 'area' && this.filtroArea) {
        filtrados = filtrados.filter(libro =>
          libro.nombrearea === this.filtroArea
        )
      }

      return filtrados
    }
  },
  watch: {
    // Observar cambios en filtroSerie
    filtroSerie(newVal) {
      this.verificarLibroSeleccionado()
    },
    // Observar cambios en filtroArea
    filtroArea(newVal) {
      this.verificarLibroSeleccionado()
    },
    // Observar cambios en tipoFiltro
    tipoFiltro(newVal) {
      this.verificarLibroSeleccionado()
    }
  },
  mounted() {
    let me = this
    me.getBooks()
    if (me.libroSelecionado > 0) {
      me.bookSelect = me.libroSelecionado
      this.getPlanificacion()
    }
    this.getUserRoot()
  },
  methods: {
    // Verificar si el libro seleccionado aún está disponible
    verificarLibroSeleccionado() {
      if (this.bookSelect) {
        const libroDisponible = this.librosFiltrados.some(
          libro => libro.asignatura_idasignatura === this.bookSelect
        )
        if (!libroDisponible) {
          this.bookSelect = ''
          this.lista = []
        }
      }
    },
    descargarPlanificacion(item) {
      const ruta = this.$server_url + 'descargar-planificacion/' + item.idplanificacion
      window.open(ruta, '_blank')
    },

    //para obtener el listado de los usuarios root
    getUserRoot() {
      let me = this;
      this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
        .then(function (res) {
          if (res.data.status == '1') {
            me.permisoRoot = true
          } else {
            me.permisoRoot = false
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },

    // Cambiar tipo de filtro
    cambiarTipoFiltro() {
      // Limpiar los filtros cuando se cambia el tipo
      this.filtroSerie = ''
      this.filtroArea = ''
      this.bookSelect = ''
      this.lista = []
    },

    getTransferenciaPlanificacion() {
      let me = this;
      if (me.bookSelect == '') {
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: "Alerta",
          acceptText: 'Aceptar',
          cancelText: 'Cancelar',
          text: 'Seleccione un libro para realizar la transferencia de unidades.',
        })
        return
      } else {
        this.popupActivoTransferenciaPlanificacion = true;
      }
    },

    changeHandleTransferenciaPlanificacion(e) {
      let me = this;
      if (e.verificacionemittransferencia == 1) {
        me.popupActivoTransferenciaPlanificacion = false;
      } else if (e.verificacionemittransferencia == 2) {
        console.log("Emit recibido por cancelado.");
        me.popupActivoTransferenciaPlanificacion = false;
      } else {
        console.log("Emit no recibido");
      }
    },

    getPlanificacion() {
      let me = this;
      me.lista = []
      if (me.bookSelect == null || me.bookSelect == "" || me.bookSelect == undefined) {
        me.$vs.notify({
          text: 'Seleccione un libro por favor',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        me.bookSelect = '';
        me.$emit('changeBookSelect', 0)
        return
      }
      me.$emit('changeBookSelect', me.bookSelect)
      me.$vs.loading();
      this.$http.get(this.$server_url + 'planificaciones?getPlanificacionesXIdAsignatura=yes&asignatura_idasignatura=' + me.bookSelect)
        .then(res => {
          let datos = res.data
          me.nombrelibroSeleccionado = this.arrayBooks.find(book => book.asignatura_idasignatura === this.bookSelect) || null;
          if (me.usuario.id_group == 11) {
            me.lista = datos.filter(p => p.Estado_idEstado == 1)
          } else {
            me.lista = datos
          }
          me.$vs.loading.close();
        })
        .catch(e => {
          console.log(e)
          me.$vs.loading.close();
        })
    },

    getBooks() {
      LibroRepository.getAllBooks().then(r => {
        this.arrayBooks = r.data
      });
    },

    verPlanificacion(web) {
      console.log(web)
      window.open('https://view.officeapps.live.com/op/embed.aspx?src=' + this.$data_url + 'archivos/upload/planificacion/' + web, '_blank');
    },

    editaContenido(planificacion) {
      var item = {}
      item.planificacion = planificacion
      item.menu = {
        plista: false,
        pnuevo: false,
        peditar: true
      }
      this.$emit('item', item)
    },

    confirmaEliminar(id) {
      let me = this;
      me.eliminarId = id;
      me.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirmar`,
        text: '¿Está seguro en eliminar esta tarea?',
        acceptText: 'Aceptar',
        cancelText: 'Cancelar',
        accept: me.eliminar
      })
    },

    eliminar() {
      let me = this;
      me.$vs.loading({
        color: '#046AE7'
      })
      let formData = new FormData();
      formData.append('idplanificacion', me.eliminarId);
      formData.append('eliminarFisico', 'yes');
      formData.append('Estado_idEstado', 4);
      this.$http
        .post(this.$data_url + "api/eliminarPlanificacion", formData)
        .then(function (response) {
          me.$vs.loading.close();
          me.getPlanificacion()
        })
        .catch(function (error) {
          me.$vs.loading.close();
          if (error.response.status == 422) {
            me.errors = error.response.data.errors;
          }
        });
    },
  },
}
</script>

<style scoped>
.filtros-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
  margin-top: 15px;
}

.filtro-group {
  flex: 1;
  min-width: 250px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.filtro-group.tipo-filtro {
  flex: 0 0 100%;
  background-color: #f0f7ff;
  border-color: #046AE7;
}

.filtro-titulo {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-bottom: 2px solid #046AE7;
  padding-bottom: 5px;
}

.radio-group-inline {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-item input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #046AE7;
}

.radio-item label {
  cursor: pointer;
  font-size: 14px;
  color: #555;
  user-select: none;
  margin: 0;
  font-weight: 500;
}

.radio-item label:hover {
  color: #046AE7;
}

.contador-libros {
  color: #666;
  font-style: italic;
  padding-left: 5px;
}

/* Ajustes para v-select */
::v-deep .vs__dropdown-toggle {
  border-radius: 4px;
  border-color: #ddd;
}

::v-deep .vs__dropdown-menu {
  z-index: 1000;
}

::v-deep .vs__selected {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .filtros-container {
    flex-direction: column;
    gap: 15px;
  }

  .filtro-group {
    width: 100%;
  }

  .filtro-boton {
    align-items: flex-start;
  }

  .btn-limpiar {
    width: 100%;
  }
}
</style>
