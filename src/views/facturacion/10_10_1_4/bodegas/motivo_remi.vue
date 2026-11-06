<template>
  <vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
      <vs-button type="border" color="success" class="mr-2" @click="getNuevo()"
        >Agregar Nuevo Motivo de Remisión</vs-button
      >
    </vs-row>

    <vs-table max-items="10" pagination search :data="Motivos">
      <template slot="header">
        <vs-chip color="primary"
          >Cantidad: <b> {{ Motivos.length }}</b></vs-chip
        >
      </template>

      <template slot="thead">
        <vs-th width="200"> Id </vs-th>
        <vs-th width="200"> Nombre</vs-th>
        <vs-th width="500"> Observación </vs-th>
        <vs-th width="150">Estado</vs-th>
        <vs-th width="400">Fecha</vs-th>
        <vs-th width="200"> Acciones </vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].mot_id">
            {{ data[indextr].mot_id }}
          </vs-td>
          <vs-td> {{ tr.mot_nombre }} <br /> </vs-td>
          <vs-td> {{ tr.mot_observacion }} <br /> </vs-td>
          <vs-td>
            <vs-chip v-if="tr.mot_estado == 1" color="success">Activo</vs-chip>
            <vs-chip v-else color="danger">Inactivo</vs-chip>
          </vs-td>
          <vs-td> {{ tr.created_at }} <br /> </vs-td>
          <vs-td :data="data[indextr].mot_id">
            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
              <vs-button
                class="a-icons"
                href.prevent
                icon="more_vert"
                type="border"
              ></vs-button>
              <vs-dropdown-menu style="width: 250px" class="cursor">
                <vs-dropdown-item>
                  <vs-button
                    v-if="tr.mot_estado == 1"
                    color="#28C76F"
                    type="line"
                    class="w-full"
                    @click="
                      popupActivo = true;
                      getEditar(tr);
                    "
                    >Editar</vs-button
                  >
                  <vs-button
                    v-if="tr.mot_estado == 1"
                    color="#EA5455"
                    type="line"
                    class="w-full"
                    @click="
                      popupActivo = true;
                      popup_desactivar_activar_motivo(tr);
                    "
                    >Desactivar motivo</vs-button
                  >
                  <vs-button
                    v-if="tr.mot_estado == 0"
                    color="#28C76F"
                    type="line"
                    class="w-full"
                    @click="
                      popupActivo = true;
                      popup_desactivar_activar_motivo(tr);
                    "
                    >Activar motivo</vs-button
                  >
                  <vs-button
                    color="#EA5455"
                    type="line"
                    class="w-full"
                    @click="
                      popupActivo = true;
                      getPreguntaEliminar(tr);
                    "
                    >Eliminar</vs-button
                  >
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup
      class="crear"
      title="Registrar nuevo motivo de remisión"
      :active.sync="popupActivoGuardar"
    >
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input
                label="Nombre: *"
                placeholder="Nombre"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabMotivo.mot_nombre"
              />
            </vs-col>
          </vs-row>
          <br />
          <vs-row vs-type="flex" vs-justify="center" vs-w="12"> </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input
                label="Observación: *"
                placeholder="Detalle"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabMotivo.mot_observacion"
              />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief"
          >Cancelar</vs-button
        >
      </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup
      class="editar"
      :title="`Editar motivo: ${tabMotivo.mot_id}`"
      :active.sync="popupActivoEditar"
    >
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input
                label="Nombre: *"
                placeholder="Nombre"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabMotivo.mot_nombre"
              />
            </vs-col>
          </vs-row>
          <br />
          <vs-row vs-type="flex" vs-justify="center" vs-w="12"> </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input
                label="Observación: *"
                placeholder="Detalle"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabMotivo.mot_observacion"
              />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief"
          >Cancelar</vs-button
        >
      </vs-col>
    </vs-popup>

    <vs-popup
      class="eliminar"
      :title="`¿Confirma que desea eliminar el registro: ${tabMotivo.mot_nombre}?`"
      :active.sync="popupActivoEliminar"
    >
      <vs-col
        vs-type="flex"
        vs-justify="center"
        vs-align="center"
        vs-w="3"
        class="mt-2"
      ></vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief"
          >Cancelar</vs-button
        >
      </vs-col>
    </vs-popup>

    <vs-popup
      class="desactivar"
      :title="`¿Confirma que desea cambiar de estado el motivo de remisión: ${tabMotivo.mot_nombre}?`"
      :active.sync="popupActivoDesactivar"
    >
      <vs-col
        vs-type="flex"
        vs-justify="center"
        vs-align="center"
        vs-w="3"
        class="mt-2"
      ></vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="desactivar_activar_motivo()" type="relief">Aceptar</vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief"
          >Cancelar</vs-button
        >
      </vs-col>
    </vs-popup>
  </vx-card>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
export default {
  data() {
    return {
      usuario: [],
      Motivos: [],
      popupActivoGuardar: false,
      popupActivoEditar: false,
      popupActivoDesactivar: false,
      popupActivoEliminar: false,
      tabMotivo: {
        mot_id: "",
        mot_nombre: "",
        mot_observacion: "",
        mot_estado: "",
        created_at: "",
        updated_at:"",
        user_created:"",
      },
      mot_id: 0,

      Motivo_inactivos: [],
      busquedaxcodigo: "",
      valorBusqueda: "0",
      checkBox_mostrarinactivos: false,
    };
  },
  components: {
    "v-select": vSelect,
  },
  mounted() {
    this.getMotivo();
  },
  methods: {
    mostrarFechayhora: function () {
      const date = new Date();
      const formatear =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2);

      return formatear;
    },
    getMotivo() {
      let me = this;
      me.$vs.loading();

      this.$http
        .get(this.$server_url + "GetMotivo")
        .then((res) => {
          this.Motivos = res.data;
          me.$vs.loading.close();
        })
        .catch((err) => {
          console.log(err);
          me.$vs.loading.close();
        });
    },
    getNuevo() {
      this.popupActivoGuardar = true;
      this.tabMotivo.mot_nombre = "";
      this.tabMotivo.mot_observacion = "";
    },
    guardarnuevo() {
      let me = this;
      var fecha = me.mostrarFechayhora();
      const usuariorespo = localStorage.getItem("usuario");
      const usuarioObjeto = JSON.parse(usuariorespo);
      //VALIDACION DE CAMPOS NULOS Y VACIOS
      if (this.tabMotivo.mot_nombre == null ||
        this.tabMotivo.mot_nombre == 0 ||
        this.tabMotivo.mot_observacion == null ||
        this.tabMotivo.mot_observacion == 0) {
        me.$vs.notify({
          text: "Escriba los datos (*) del motivo de remisión antes de guardar",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return;
      }
      let datos = {
        mot_nombre: this.tabMotivo.mot_nombre,
        mot_observacion: this.tabMotivo.mot_observacion,
        created_at: fecha,
        user_created: usuarioObjeto.idusuario,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "PostMotivo_Registrar_modificar", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getMotivo();
          me.$vs.notify({
            text: "Motivo de remisión guardó con éxito",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.popupActivoEditar = false;
          this.popupActivoDesactivar = false;
          this.popupActivoGuardar = false;
          this.popupActivoEliminar = false;
        })
        .catch(function () {
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Motivo de remisión no se pudo guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },

    getEditar(tr) {
      this.popupActivoEditar = true;
      this.tabMotivo.mot_id = tr.mot_id;
      this.tabMotivo.mot_nombre = tr.mot_nombre;
      this.tabMotivo.mot_observacion = tr.mot_observacion;
    },

    editar() {
      let me = this;
      var fecha = me.mostrarFechayhora();
      if (this.tabMotivo.mot_nombre == null ||
        this.tabMotivo.mot_nombre == 0 ||
        this.tabMotivo.mot_observacion == null ||
        this.tabMotivo.mot_observacion == 0) {
        me.$vs.notify({
          text: "Llene los datos (*) del motivo de remisión antes de editar",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return;
      }
      let datos = {
        mot_id: this.tabMotivo.mot_id,
        mot_nombre: this.tabMotivo.mot_nombre,
        mot_observacion: this.tabMotivo.mot_observacion,
        updated_at: fecha,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "PostMotivo_Registrar_modificar", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getMotivo();
          me.$vs.notify({
            text: "Motivo de remisión editado con exito",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });
          this.popupActivoEditar = false;
          this.popupActivoDesactivar = false;
          this.popupActivoGuardar = false;
          this.popupActivoEliminar = false;
        })
        .catch((error) => {
          console.log(error);
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Motivo de remisión no se pudo editar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },

    getCancelar() {
      this.popupActivoEditar = false;
      this.popupActivoGuardar = false;
      this.popupActivoEliminar = false;
      this.popupActivoDesactivar = false;
    },

    popup_desactivar_activar_motivo(tr) {
      this.popupActivoDesactivar = true;
      this.mot_id = tr.mot_id;
      this.tabMotivo.mot_nombre = tr.mot_nombre;
	  this.tabMotivo.mot_estado = tr.mot_estado;
    },
    desactivar_activar_motivo() {
      let me = this;
      let valornuevo = this.tabMotivo.mot_estado;
      console.log(valornuevo + "valornuevoeatdobodutp" + this.mot_id);
      if (valornuevo == 1) {
        valornuevo = 0;
        let datos = {
          mot_id: this.mot_id,
          mot_estado: valornuevo,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Desactivar_Motivo", datos)
          .then((res) => {
            me.$vs.loading.close();
            this.getMotivo();
            me.$vs.notify({
              text: "Cambio de estado exitoso",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            this.popupActivoEditar = false;
            this.popupActivoDesactivar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
          })
          .catch((error) => {
            console.log(error);
            me.$vs.loading.close();
            me.$vs.notify({
              text: "No se pudo realizar el cambio de estado",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      } else if (valornuevo == 0) {
        valornuevo = 1;
        let datos = {
          mot_id: this.mot_id,
          mot_estado: valornuevo,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Desactivar_Motivo", datos)
          .then((res) => {
            me.$vs.loading.close();
            this.getMotivo();
            me.$vs.notify({
              text: "Cambio de estado exitoso",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            this.popupActivoEditar = false;
            this.popupActivoDesactivar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
          })
          .catch((error) => {
            console.log(error);
            me.$vs.loading.close();
            me.$vs.notify({
              text: "No se pudo realizar el cambio de estado",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      }
    },
    getPreguntaEliminar(tr) {
      this.popupActivoEliminar = true;
      this.mot_id = tr.mot_id;
      this.tabMotivo.mot_nombre = tr.mot_nombre;
    },

    getEliminar() {
      let me = this;
      let datos = {
        mot_id: this.mot_id,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "Eliminar_Motivo", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getMotivo();

          me.$vs.notify({
            text: "Motivo de remisión eliminado con exito",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
          });

          this.popupActivoEditar = false;
          this.popupActivoDesactivar = false;
          this.popupActivoGuardar = false;
          this.popupActivoEliminar = false;
        })
        .catch(function (error) {
          console.log(error);
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Motivo de remisión no se pudo eliminar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },
  },
};
</script>
