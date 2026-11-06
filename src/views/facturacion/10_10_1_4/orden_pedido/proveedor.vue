<template>
  <vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
      <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar nuevo proveedor</vs-button>
    </vs-row>
    <vs-table max-items="10" pagination search :data="Proveedor">
      <template slot="header">
        <vs-chip color="primary">Cantidad: <b>{{ Proveedor.length }} </b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th width="100"> Id </vs-th>
        <vs-th width="200"> RUC</vs-th>
        <vs-th width="500"> Razón social </vs-th>
        <vs-th width="150">Ciudad</vs-th>
        <vs-th width="400">Dirección</vs-th>
        <vs-th width="200"> Acciones </vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].prov_codigo">
            {{ data[indextr].prov_codigo }}
          </vs-td>
          <vs-td> {{ tr.prov_ruc }} <br /> </vs-td>
          <vs-td> {{ tr.prov_nombre }} <br /> </vs-td>
          <vs-td> {{ tr.nombre }} <br /> </vs-td>
          <vs-td> {{ tr.prov_direccion }} </vs-td>
          <vs-td :data="data[indextr].prov_codigo">
            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
              <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
              <vs-dropdown-menu style="width: 250px" class="cursor">
                <vs-dropdown-item>
                  <vs-button color="#28C76F" type="line" class="w-full" @click="
                        popupActivo = true;
                        getEditar(tr);
                      ">Editar</vs-button>

                  <vs-button color="#EA5455" type="line" class="w-full" @click="
                        popupActivo = true;
                        getPreguntaEliminar(tr);
                      ">Eliminar</vs-button>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="crear" title="Registrar nuevo proveedor" :active.sync="popupActivoGuardar">
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="RUC: *" placeholder="0000000000001" class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.ruc" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="Razón Social: *" placeholder="Escribe....." class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.nombre" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="Teléfono: *" placeholder="00000000" class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.telefono" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="Descripción: " placeholder="Escribe....." class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.descripcion" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex" vs-justify="center" vs-w="12">
        <vs-col vs-justify="center" vs-align="center" vs-w="6" class="m-2">
          <font style="font-size: 11.5px">Provincia:</font><br />
          <v-select :options="options" :reduce="(options) => options" density="comfortable" label="nombreprovincia"
            class="w-full" value="idprovincia" placeholder="--Seleccione--" @input="getCiudad()" v-model="search" />
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-w="5" class="m-2">
          <font style="font-size: 11.5px">Ciudad:</font><br />
          <v-select :options="options1" :reduce="(options1) => options1" density="comfortable" label="nombre"
            class="w-full" value="idciudad" placeholder="--Seleccione--" v-model="tabProveedor.ciudad" />
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex" vs-justify="center" vs-w="12">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
          <vs-textarea label="Dirección: *" placeholder="Escribe....." class="w-full inputx" icon="mode_edit"
            v-model="tabProveedor.direccion" />
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup class="editar" :title="`Editar Proveedor: ${prov_id}`" :active.sync="popupActivoEditar">
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="RUC: *" placeholder="0000000000001" class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.ruc" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="Razón Social: *" placeholder="Escribe....." class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.nombre" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="Teléfono: *" placeholder="00000000" class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.telefono" />
            </vs-col>
          </vs-row>
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
              <vs-input label="Descripción: " placeholder="Escribe....." class="w-full inputx" icon="mode_edit"
                v-model="tabProveedor.descripcion" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex" vs-justify="center" vs-w="12">
        <vs-col vs-justify="center" vs-align="center" vs-w="6" class="m-2">
          <font style="font-size: 11.5px">Provincia:</font><br />
          <v-select :options="options" :reduce="(options) => options" label="nombreprovincia" class="w-full"
            value="idprovincia" @input="getCiudad()" v-model="search" />
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-w="5" class="m-2">
          <font style="font-size: 11.5px">Ciudad:</font><br />
          <v-select :options="options1" :reduce="(options1) => options1" density="comfortable" label="nombre"
            class="w-full" value="idciudad" placeholder="--Seleccione--" v-model="tabProveedor.ciudad" />
        </vs-col>
      </vs-row>
      <vs-row vs-type="flex" vs-justify="center" vs-w="12">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
          <vs-textarea label="Dirección: *" placeholder="Escribe....." class="w-full inputx" icon="mode_edit"
            v-model="tabProveedor.direccion" />
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>
    <vs-popup class="eliminar"
      :title="`¿Confirma que desea eliminar el registro: ${prov_id} Ruc: ${tabProveedor.ruc} Nombre: ${tabProveedor.nombre}?`"
      :active.sync="popupActivoEliminar">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>
    <vs-popup class="desactivar"
      :title="`¿Confirma que desea cambiar el estado de la motivo: ${tabProveedor.mot_nombre}?`"
      :active.sync="popupActivoDesactivar">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="desactivar_activar_motivo()" type="relief">Aceptar</vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
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
        Proveedor: [],
        popupActivoGuardar: false,
        popupActivoEditar: false,
        popupActivoDesactivar: false,
        popupActivoEliminar: false,
        tabProveedor: {
          ruc: "",
          nombre: "",
          ciudad: "",
          direccion: "",
          telefono: "",
          descripcion: "",
        },
        options1: [],
        options: [],
        prov_id: 0,
        search: "",
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
      this.getProvedor();
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
      getProvedor() {
        let me = this;
        me.$vs.loading();
        this.$http
          .get(this.$server_url + "Get_proveo")
          .then((res) => {
            this.Proveedor = res.data;
            me.$vs.loading.close();
          })
          .catch((err) => {
            console.log(err);
            me.$vs.loading.close();
          });
      },
      getProvincias() {
        let me = this;
        this.options = [];
        me.$vs.loading();
        this.$http
          .get(this.$server_url + "Getprovincias")
          .then((res) => {
            this.options = res.data;
            me.$vs.loading.close();
          })
          .catch((err) => {
            console.log(err);
            me.$vs.loading.close();
          });
      },
      getCiudad() {
        this.options1 = [];
        let me = this;
        me.tabProveedor.ciudad = "";
        if (me.search == null || me.search == 0) {
          me.$vs.notify({
            text: "Seleccione..",
            color: "warning",
            iconPack: "feather",
            icon: "icon-check",
          });
          return false;
        }
        this.$http
          .get(this.$server_url + "GetCiudades?nombre=" + me.search.idprovincia)
          .then((res) => {
            this.options1 = res.data;
          })
          .catch((err) => {
            this.options1 = [];
          });
      },
      getNuevo() {
        this.popupActivoGuardar = true;
        this.tabProveedor.ruc = "";
        this.options = [];
        this.options1 = [];
        this.tabProveedor.nombre = "";
        this.tabProveedor.ciudad = "";
        this.tabProveedor.direccion = "";
        this.tabProveedor.telefono = "";
        this.tabProveedor.descripcion = "";
        this.search = "";
        this.getProvincias();
      },
      guardarnuevo() {
        let me = this;
        var fecha = me.mostrarFechayhora();
        //VALIDACION DE CAMPOS NULOS Y VACIOS
        if (!this.tabProveedor.ruc || !this.tabProveedor.ciudad || !this.tabProveedor.nombre || !this.tabProveedor.telefono || !this.tabProveedor.direccion) {
          me.$vs.notify({
            text: "Llene los campos antes de guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        let datos = {
          ciu_codigo: this.tabProveedor.ciudad.idciudad,
          prov_nombre: this.tabProveedor.nombre,
          prov_descripcion: this.tabProveedor.descripcion,
          prov_direccion: this.tabProveedor.direccion,
          prov_ruc: this.tabProveedor.ruc,
          prov_telefono: this.tabProveedor.telefono,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostProver_Registrar_modificar", datos)
          .then((res) => {
            this.getProvedor();
            me.$vs.notify({
              text: "Proveedor guardó con éxito",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
            me.$vs.loading.close();
            this.popupActivoEditar = false;
            this.popupActivoDesactivar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
          })
          .catch(function () {
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Proveedor no se pudo guardar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
      getEditar(tr) {
        this.popupActivoEditar = true;
        this.options = [];
        this.options1 = [];
        this.getProvincias();
        this.getCiudad();
        this.prov_id = tr.prov_codigo;
        this.tabProveedor.ciudad = { idciudad: tr.idciudad, nombre: tr.nombre };
        this.search = { idprovincia: tr.provincia_idprovincia, nombreprovincia: tr.nombreprovincia };
        this.tabProveedor.nombre = tr.prov_nombre;
        this.tabProveedor.descripcion = tr.prov_descripcion;
        this.tabProveedor.direccion = tr.prov_direccion;
        this.tabProveedor.ruc = tr.prov_ruc;
        this.tabProveedor.telefono = tr.prov_telefono;
      },
      editar() {
        let me = this;
        if (!this.tabProveedor.ruc || !this.tabProveedor.ciudad || !this.tabProveedor.nombre || !this.tabProveedor.telefono || !this.tabProveedor.direccion) {
          me.$vs.notify({
            text: "Llene los campos antes de guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        let datos = {
          prov_codigo: this.prov_id,
          ciu_codigo: this.tabProveedor.ciudad.idciudad,
          prov_nombre: this.tabProveedor.nombre,
          prov_descripcion: this.tabProveedor.descripcion,
          prov_direccion: this.tabProveedor.direccion,
          prov_ruc: this.tabProveedor.ruc,
          prov_telefono: this.tabProveedor.telefono,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostProver_Registrar_modificar", datos)
          .then((res) => {
            me.$vs.loading.close();
            this.getProvedor();
            me.$vs.notify({
              text: "Proveedor editado con exito",
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
              text: "Proveedor no se pudo editar",
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
      getPreguntaEliminar(tr) {
        this.popupActivoEliminar = true;
        this.prov_id = tr.prov_codigo;
        this.tabProveedor.ruc = tr.prov_ruc;
        this.tabProveedor.nombre = tr.prov_nombre;
      },
      getEliminar() {
        let me = this;
        let datos = {
          prov_codigo: this.prov_id,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Eliminar_Proveo", datos)
          .then((res) => {
            me.$vs.loading.close();
            this.getProvedor();

            me.$vs.notify({
              text: "Proveedor eliminado con exito",
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
              text: "Proveedor no se pudo eliminar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
    },
  };
</script>