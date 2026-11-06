<template>
  <vx-card class="shadow-md">
    <!-- Selección de Tipo de Usuario -->
    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px; background: #f8f8f8; padding: 15px; border-radius: 8px;">
      <span style="font-weight: bold; color: #1e1e1e; font-size: 14px;">Filtrar por:</span>
      <div style="display: flex; gap: 20px;">
        <vs-radio v-model="tipoUsuario" vs-value="docente" @change="getUsuarios">
          Docentes
        </vs-radio>
        <vs-radio v-model="tipoUsuario" vs-value="estudiante" @change="getUsuarios">
          Estudiantes
        </vs-radio>
      </div>
      <div style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
        <vs-button v-if="usuarios.length > 0" color="success" size="small" @click="exportar" type="filled">
          <i class="fa-solid fa-file-excel mr-1"></i> Exportar
        </vs-button>
        <vs-chip color="primary" style="font-weight: 600;">
          Total: {{ usuarios.length }}
        </vs-chip>
      </div>
    </div>

    <!-- Tabla de Usuarios -->
    <div v-if="usuarios.length > 0">
      <vs-table max-items="25" stripe search pagination :data="usuarios">
        <template slot="thead">
          <vs-th sort-key="idusuario">Usuario</vs-th>
          <vs-th sort-key="nombres">Nombre</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="tr.idusuario">
              <div style="line-height: 1.6;">
                <div>id: {{ tr.idusuario }}</div>
                <div v-if="tipoUsuario === 'docente' && tr.name_usuario">
                  <b>usuario:</b> {{ tr.name_usuario }}
                </div>
                <div><b>cedula:</b> {{ tr.cedula || 'N/A' }}</div>
                <div><b>email:</b> {{ tr.email || 'N/A' }}</div>
                <div><b>actualizado:</b> {{ tr.updated_at || 'N/A' }}</div>
              </div>
            </vs-td>
            <vs-td :data="tr.nombres">
              <span style="font-weight: 500; font-size: 14px;">
                {{ tr.nombres }} {{ tr.apellidos }}
              </span>
            </vs-td>
            <vs-td>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <vs-button 
                  v-if="tipoUsuario === 'docente' || tr.id_group == 6 || tr.id_group == '6'" 
                  size="small" 
                  color="success" 
                  type="border" 
                  icon-pack="feather" 
                  icon="icon-gift" 
                  @click="f_prepararAsignacion(tr)">
                  Asignar libros
                </vs-button>
                <vs-button 
                  size="small" 
                  color="primary" 
                  type="border" 
                  icon-pack="feather" 
                  icon="icon-edit" 
                  @click="f_prepararEdicion(tr)">
                  Editar
                </vs-button>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    
    <div v-else-if="!loading" style="text-align: center; padding: 40px 20px;">
      <vs-icon icon="info" size="large" color="warning" style="margin-bottom: 15px;"></vs-icon>
      <p style="color: #626262; font-size: 14px;">
        No hay {{ tipoUsuario === 'docente' ? 'docentes' : 'estudiantes' }} registrados en esta institución.
      </p>
    </div>

    <!-- Popup para asignar asignaturas/libros -->
    <vs-popup class="popupHijo" title="Asignar libros a docentes" @close="f_close_modal()" fullscreen :active.sync="popupAsignacion" v-if="asignarTipo === true">
      <vx-card>
        <Asignar_asignaturas_a_docentes_Vue :usuarioSelect="usuarioSelect" v-if="popupAsignacion" />
      </vx-card>
    </vs-popup>

    <!-- SECCION EDITAR USUARIO -->
    <vs-popup class="popupHijo" title="Edición Usuario" fullscreen :active.sync="popupEditarUsuario">
      <div v-if="popupEditarUsuario">
        <editarUsuarioVue
          :usuarios="{
            idusuario: userSelected.idusuario,
            cedula: userSelected.cedula
          }"
          @saveChange="getUsuarios"
        />
      </div>
    </vs-popup>
  </vx-card>
</template>

<script>
import Codigosmix from '@/mixins/Codigosmix'

const Asignar_asignaturas_a_docentes_Vue = () => import('@/views/docentes/asignaturas_docente/asignar_asignaturas_a_docentes.vue')
const editarUsuarioVue = () => import('../usuarios/tipos/components/editarUsuario.vue')

export default {
  name: 'institucionesUsuarios',
  mixins: [Codigosmix],
  components: {
    Asignar_asignaturas_a_docentes_Vue,
    editarUsuarioVue
  },
  props: {
    institucionSelected: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tipoUsuario: 'docente',
      usuarios: [],
      loading: false,
      popupAsignacion: false,
      asignarTipo: false,
      usuarioSelect: {},
      popupEditarUsuario: false,
      userSelected: {}
    }
  },
  mounted() {
    this.getUsuarios();
  },
  methods: {
    getUsuarios() {
      let me = this;
      me.usuarios = [];
      me.loading = true;
      me.$vs.loading();
      
      let url = '';
      if (me.tipoUsuario === 'docente') {
        url = me.$server_url + 'docentes?idInstitucion=' + me.institucionSelected.idInstitucion;
      } else {
        url = me.$server_url + 'estudiantesXInstitucion/' + me.institucionSelected.idInstitucion;
      }
      
      this.$http.get(url)
        .then(function (response) {
          me.usuarios = response.data;
          me.loading = false;
          me.$vs.loading.close();
          me.popupEditarUsuario = false;
        })
        .catch(function (error) {
          console.error(error);
          me.loading = false;
          me.$vs.loading.close();
          me.$vs.notify({
            text: 'Error al cargar los usuarios',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
        });
    },
    f_prepararAsignacion(tr) {
      let me = this;
      me.$vs.loading();
      
      this.$http.get(this.$server_url + 'buscaUsuario?cedula=' + tr.cedula)
        .then(function (response) {
          me.$vs.loading.close();
          if (response.data && response.data.length > 0) {
            let user = response.data[0];
            user.nombreInstitucion = me.institucionSelected.nombreInstitucion;
            me.usuarioSelect = user;
            me.asignarTipo = true;
            me.popupAsignacion = true;
          } else {
            me.$vs.notify({
              text: 'No se encontró el usuario en la base de datos',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            });
          }
        })
        .catch(function (error) {
          console.error(error);
          me.$vs.loading.close();
          me.$vs.notify({
            text: 'Error al buscar los datos del usuario',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
        });
    },
    f_prepararEdicion(tr) {
      this.userSelected = tr;
      this.popupEditarUsuario = true;
    },
    f_close_modal() {
      this.popupAsignacion = false;
      this.asignarTipo = false;
      this.usuarioSelect = {};
    },
    exportar() {
      let me = this;
      let codeExport = [];
      me.usuarios.forEach((user) => {
        codeExport.push({
          idusuario: user.idusuario || "",
          cedula: user.cedula || "",
          name_usuario: user.name_usuario || "",
          nombres: user.nombres || "",
          apellidos: user.apellidos || "",
          email: user.email || "",
          updated_at: user.updated_at || "",
        });
      });
      let nameFile = "usuarios_institucion_" + (me.tipoUsuario === 'docente' ? 'docentes' : 'estudiantes') + "_" + (me.institucionSelected.nombreInstitucion || "");
      let headers = [
        "ID Usuario",
        "Cédula",
        "Usuario",
        "Nombres",
        "Apellidos",
        "Email",
        "Actualizado",
      ];
      let fieldKeys = [
        "idusuario",
        "cedula",
        "name_usuario",
        "nombres",
        "apellidos",
        "email",
        "updated_at",
      ];
      if (typeof me.m_exportTodo === "function") {
        me.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else if (me.$parent && typeof me.$parent.m_exportTodo === "function") {
        me.$parent.m_exportTodo(headers, fieldKeys, codeExport, nameFile);
      } else {
        me.$vs.notify({
          text: "Función de exportación no disponible",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
      }
    }
  }
}
</script>

<style>
.popupHijo {
  z-index: 51006 !important;
}
</style>