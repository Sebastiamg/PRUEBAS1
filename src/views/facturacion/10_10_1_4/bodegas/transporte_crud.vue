<template>
  <vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
      <vs-button type="border" color="success" class="mr-2" @click="getNuevo()"
        >Agregar Transporte</vs-button
      >
    </vs-row>
    <vs-row>
      <vs-col
        type="flex"
        vs-justify="flex-start"
        vs-align="flex-start"
        class="m-2"
        vs-w="12"
      >
        <p>Búsqueda por filtros</p>
        <br />
        <vs-card class="seccionmostrartodo">
          <div>
            <vs-input
              class="w-full"
              @keyup.enter="getTransporteParametro()"
              icon-after="true"
              label-placeholder="icon-after"
              style="margin: 0px 0px 20px 0px"
              icon="search"
              placeholder="Buscar"
              v-model="busquedaxcodigo"
            />
          </div>
          <div>
            <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
              <li class="modelx"></li>
              <li style="margin: 10px 20px 0px 0px">
                <vs-radio
                  vs-name="radios1"
                  vs-value="0"
                  v-model="valorBusqueda"
                  @input="busqueda = 'codigo'"
                  >RUC</vs-radio
                >
              </li>
              <li style="margin: 10px 10px 0px 0px">
                <vs-radio
                  vs-name="radios2"
                  vs-value="1"
                  v-model="valorBusqueda"
                  @input="busqueda = 'nombre'"
                  >Nombre</vs-radio
                >
              </li>
              <li>
                <vs-button
                  color="warning"
                  type="filled"
                  style="margin-left: 10px"
                  @click="getTransporteParametro()"
                  icon="search"
                ></vs-button>
              </li>
            </ul>
          </div>
        </vs-card> </vs-col
    ></vs-row>
    <vs-table max-items="10" pagination search :data="Transportes">
      <template slot="header">
        <vs-chip color="primary"
          >Cantidad: <b> {{ Transportes.length }}</b></vs-chip
        >
      </template>
      <template slot="thead">
        <vs-th width="200"> Id </vs-th>
        <vs-th width="200"> RUC</vs-th>
        <vs-th width="500"> Razón Social o Nombre </vs-th>
        <vs-th width="150">Dirección</vs-th>
        <!-- <vs-th width="400">Guía</vs-th> -->
        <vs-th width="200"> Acciones </vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].trans_codigo">
            {{ data[indextr].trans_codigo }}
          </vs-td>
          <vs-td> {{ tr.trans_ruc }} <br /> </vs-td>
          <vs-td> {{ tr.trans_nombre }} <br /> </vs-td>
          <vs-td> {{ tr.trans_direccion }} <br /> </vs-td>
          <!-- <vs-td> {{ tr.trans_guia_remision }} <br /> </vs-td> -->
          <vs-td :data="data[indextr].trans_codigo">
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
      title="Registrar nuevo Transporte"
      :active.sync="popupActivoGuardar"
    >
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
              <vs-input
                label="RUC: *"
                placeholder="0993229784001"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabTransporte.trans_ruc"
              />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
              <vs-input
                label="Razón Social: *"
                placeholder="Transportes-ecuador S.A."
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabTransporte.trans_nombre"
              />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12"> </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
              <vs-input
                label="Dirección: *"
                placeholder="Boletería Terminal Quitumbe - Av. Cóndor Ñan y Mariscal Sucre"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabTransporte.trans_direccion"
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
      :title="`Editar Transporte: ${this.trans_codigo}`"
      :active.sync="popupActivoEditar"
    >
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
              <vs-input
                label="RUC: *"
                placeholder="0993229784001"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabTransporte.trans_ruc"
              />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
              <vs-input
                label="Razón Social: *"
                placeholder="Transportes-ecuador S.A."
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabTransporte.trans_nombre"
              />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12"> </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
              <vs-input
                label="Dirección: *"
                placeholder="Boletería Terminal Quitumbe - Av. Cóndor Ñan y Mariscal Sucre"
                class="w-full inputx"
                icon="mode_edit"
                v-model="tabTransporte.trans_direccion"
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
      :title="`¿Confirma que desea eliminar el registro: ${tabTransporte.trans_nombre} con RUC: ${tabTransporte.trans_ruc}?`"
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
  </vx-card>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
export default {
  data() {
    return {
      Transportes: [],
      popupActivoGuardar: false,
      popupActivoEditar: false,
      popupActivoEliminar: false,
      tabTransporte: {
        trans_nombre: "",
        trans_ruc: "",
        trans_direccion: "",
        trans_guia_remision: "",
      },
      trans_codigo: "",
      Transporte_inactivos: [],
      busquedaxcodigo: "",

      valorBusqueda: "0",
      checkBox_mostrarinactivos: false,
    };
  },
  components: {
    "v-select": vSelect,
  },
  mounted() {
    
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
      // Mostramos la fecha y hora en la consola

      return formatear;
    },
    getTransporte() {
      let me = this;
      me.$vs.loading();

      this.$http
        .get(this.$server_url + "Get_Transporte")
        .then((res) => {
          this.Transportes = res.data;
          me.$vs.loading.close();
        })
        .catch((err) => {
          console.log(err);
          me.$vs.loading.close();
        });
    },
    getTransporteParametro() {
      let me = this;
      if (me.busquedaxcodigo.length < 3) {
        me.$vs.notify({
          text: "Minimo 3 caracteres de busqueda",
          color: "warning",
          iconPack: "feather",
          icon: "icon-check",
        });
        return false;
      }
      me.$vs.loading();
      this.$http
        .get(
          this.$server_url +
            "GetTransporte_xfiltro?busqueda=" +
            me.busqueda +
            "&razonbusqueda=" +
            me.busquedaxcodigo
        )
        .then(function (res) {
          me.Transportes = res.data;
          if (me.Transportes.length === 0) {
            me.$vs.notify({
              text: "No hay transportes para esta búsqueda",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            me.Transportes = [];
            me.$vs.loading.close();
          } else {
            // me.filtroRegion();
            me.$vs.loading.close();
            if (res.data.message) {
              me.$vs.notify({
                text: res.data.message,
                color: "success",
                iconPack: "feather",
                icon: "icon-user",
              });
            }
          }
        })
        .catch(function (error) {
          if (error.response && error.response.status === 404) {
            me.$vs.notify({
              text: "No hay transportes  para esta búsqueda",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
            me.Transportes = [];
            me.$vs.loading.close();
          } else {
            console.log(error + " error");
            me.$vs.loading.close();
          }
        });
    },
    getNuevo() {
      this.popupActivoGuardar = true;
      this.tabTransporte.trans_nombre = "";
      this.tabTransporte.trans_ruc = "";
      this.tabTransporte.trans_direccion = "";
      // this.tabTransporte.trans_guia_remision = "";
    },
    guardarnuevo() {
      let me = this;
      const usuariorespo = localStorage.getItem("usuario");
      const usuarioObjeto = JSON.parse(usuariorespo);
      //VALIDACION DE CAMPOS NULOS Y VACIOS!this.tabTransporte.trans_nombre && !this.tabTransporte.trans_ruc && !this.tabTransporte.trans_direccion
      if (

        (this.tabTransporte.trans_nombre==null || this.tabTransporte.trans_nombre==0)  ||
        (this.tabTransporte.trans_ruc==null || this.tabTransporte.trans_ruc==0)||
        (this.tabTransporte.trans_direccion==null || this.tabTransporte.trans_direccion==0)
      ) {
        me.$vs.notify({
          text: "Escriba los datos obligatorios (*) antes de guardar",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return;
      }
      let datos = {
        trans_nombre: this.tabTransporte.trans_nombre,
        trans_ruc: this.tabTransporte.trans_ruc,
        trans_direccion: this.tabTransporte.trans_direccion,
        user_created: usuarioObjeto.idusuario,
        // trans_guia_remision: this.tabTransporte.trans_guia_remision,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "PostTransporte_Registrar_modificar", datos)
        .then((res) => {
          me.$vs.loading.close();
          me.$vs.notify({
            text: "Transporte guardó con éxito",
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
            text: "Transporte no se pudo guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },

    getEditar(tr) {
      this.popupActivoEditar = true;
      this.trans_codigo = tr.trans_codigo;
      this.tabTransporte.trans_nombre = tr.trans_nombre;
      this.tabTransporte.trans_ruc = tr.trans_ruc;
      this.tabTransporte.trans_direccion = tr.trans_direccion;
      // this.tabTransporte.trans_guia_remision = tr.trans_guia_remision;
    },

    editar() {
      let me = this;

      if ((this.tabTransporte.trans_nombre==null || this.tabTransporte.trans_nombre==0)  ||
        (this.tabTransporte.trans_ruc==null || this.tabTransporte.trans_ruc==0)||
        (this.tabTransporte.trans_direccion==null || this.tabTransporte.trans_direccion==null)
      ) {
        me.$vs.notify({
          text: "Escriba los datos motivo de remisión antes de editar",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-triangle",
        });
        return;
      }
      let datos = {
        trans_codigo: this.trans_codigo,
        trans_nombre: this.tabTransporte.trans_nombre,
        trans_ruc: this.tabTransporte.trans_ruc,
        trans_direccion: this.tabTransporte.trans_direccion,
        // trans_guia_remision: this.tabTransporte.trans_guia_remision,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "PostTransporte_Registrar_modificar", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getTransporteParametro()
          me.$vs.notify({
            text: "Transporte editado con exito",
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
            text: "Transporte no se pudo editar",
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
    },

    getPreguntaEliminar(tr) {
      this.popupActivoEliminar = true;
      this.trans_codigo = tr.trans_codigo;
      this.tabTransporte.trans_nombre = tr.trans_nombre;
      this.tabTransporte.trans_ruc = tr.trans_ruc;
    },

    getEliminar() {
      let me = this;
      let datos = {
        trans_codigo: this.trans_codigo,
      };
      me.$vs.loading();
      this.$http
        .post(this.$server_url + "Eliminar_Transporte", datos)
        .then((res) => {
          me.$vs.loading.close();
          this.getTransporte();

          me.$vs.notify({
            text: "Transporte eliminado con exito",
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
            text: "Transporte no se pudo eliminar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-x",
          });
        });
    },
  },
};
</script>
