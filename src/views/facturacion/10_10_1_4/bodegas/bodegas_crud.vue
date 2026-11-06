<template>
  <vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
      <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nueva Bodega</vs-button>
    </vs-row>
    <vs-row>
      <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
        <p>Búsqueda por filtros</p>
        <br />
        <vs-card class="seccionmostrartodo">
          <div>
            <vs-input v-if="valorBusqueda !== '1'" class="w-full" @keyup.enter="getBodegaParametro()" icon-after="true"
              label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar"
              v-model="busquedaxcodigo" />
          </div>
          <div>
            <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
              <li class="modelx"></li>
              <li style="margin: 10px 20px 0px 0px">
                <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda"
                  @input="busqueda = 'nombre'">Nombre</vs-radio>
              </li>
              <li style="margin: 10px 10px 0px 0px">
                <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda"
                  @input="getmetodocofnrimacioninactivos()">Mostrar inactivos</vs-radio>
              </li>
              <li>
                <vs-button v-if="valorBusqueda !== '1'" color="warning" type="filled" style="margin-left: 10px"
                  @click="getBodegaParametro()" icon="search"></vs-button>
              </li>
            </ul>
          </div>
        </vs-card>
      </vs-col></vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Bodegas">
      <template slot="header">
        <vs-chip color="primary">Cantidad: <b> {{ Bodegas.length }}</b></vs-chip>
      </template>
      <!-- {{cliCi}} -->
      <template slot="thead">
        <vs-th width="200"> Id </vs-th>
        <vs-th width="400"> Responsable </vs-th>
        <vs-th colspan="1" width="400"> Nombre </vs-th>
        <vs-th width="400">Ubicación</vs-th>
        <vs-th width="150">Estado</vs-th>
        <vs-th width="400">Fecha</vs-th>
        <vs-th width="200"> Acciones </vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].bod_id">
            {{ data[indextr].bod_id }}
          </vs-td>
          <vs-td>
            <!-- {{ tr }} -->
            {{ tr.nombreResponsable }}<br />
          </vs-td>
          <vs-td>
            <!-- {{ tr }} -->
            {{ tr.bod_nombre }} <br />
          </vs-td>
          <vs-td>
            <!-- {{ tr }} -->
            {{ tr.bod_ubicacion }} <br />
          </vs-td>
          <vs-td>
            <vs-chip v-if="tr.bod_estado == 1" color="success">Activo</vs-chip>
            <vs-chip v-else color="danger">Inactivo</vs-chip>
          </vs-td>
          <vs-td>
            <!-- {{ tr }} -->
            {{ tr.created_at }} <br />
          </vs-td>
          <vs-td :data="data[indextr].bod_id">
            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
              <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
              <vs-dropdown-menu style="width: 250px" class="cursor">
                <vs-dropdown-item>
                  <vs-button v-if="tr.bod_estado == 1" color="#28C76F" type="line" class="w-full" @click="
                      popupActivo = true;
                      getEditar(tr);
                    ">Editar</vs-button>
                  <vs-button v-if="tr.bod_estado == 1" color="#EA5455" type="line" class="w-full" @click="
                      popupActivo = true;
                      popup_desactivar_activar_bodega(tr);
                    ">Desactivar bodega</vs-button>
                  <vs-button v-if="tr.bod_estado == 0" color="#28C76F" type="line" class="w-full" @click="
                      popupActivo = true;
                      popup_desactivar_activar_bodega(tr);
                    ">Activar bodega</vs-button>
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
    <vs-popup class="crear" title="Registrar nueva bodega" :active.sync="popupActivoGuardar">
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11" class="m-2">
              <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
              <vs-input label="Nombre de bodega " placeholder="Nombre de bodega" class="w-full inputx" icon="mode_edit"
                v-model="tabBodega.bod_nombre" />
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="11">
                  <font style="font-size: 11.5px">Responsable:</font><br>
                  <v-select :options="userBodegas" :reduce="userBodegas => userBodegas.idusuario"
                    label="nombreResponsable" class="w-full h-100" placeholder="--Seleccione--"
                    v-model="tabBodega.bod_responsable" />
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11" class="m-2">
              <vs-input label="Ubicación de bodega " placeholder="Ubicación de bodega" class="w-full inputx"
                icon="mode_edit" v-model="tabBodega.bod_ubicacion" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup class="editar" :title="`Editar bodega: ${tabBodega.bod_id}`" :active.sync="popupActivoEditar">
      <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
          <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11" class="m-2">
              <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
              <vs-input label="Nombre de bodega " placeholder="Nombre de bodega" class="w-full" icon="mode_edit"
                v-model="tabBodega.bod_nombre" />
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="11">
                  <font style="font-size: 11.5px">Responsable:</font><br>
                  <v-select :options="userBodegas" :reduce="userBodegas => userBodegas.idusuario"
                    label="nombreResponsable" class="w-full h-100" placeholder="--Seleccione--"
                    v-model="tabBodega.bod_responsable" />
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11" class="m-2">
              <vs-input label="Ubicación de bodega " placeholder="Ubicación de bodega" class="w-full" icon="mode_edit"
                v-model="tabBodega.bod_ubicacion" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <br /><br />
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>

    <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${tabBodega.bod_nombre}?`"
      :active.sync="popupActivoEliminar">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
      </vs-col>
    </vs-popup>

    <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado de la bodega: ${tabBodega.bod_nombre}?`"
      :active.sync="popupActivoDesactivar">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="desactivar_activar_bodega()" type="relief">Aceptar</vs-button>
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
        Bodegas: [],
        userBodegas: [],
        popupActivoGuardar: false,
        popupActivoEditar: false,
        popupActivoDesactivar: false,
        popupActivoEliminar: false,
        tabBodega: {
          bod_id: "",
          bod_responsable: "",
          bod_nombre: "",
          bod_ubicacion: "",
          bod_estado: "",
          created_at: "",
        },
        bod_id: 0,
        busquedaxcodigo: "",
        valorBusqueda: "0",

        Bodega_inactivos: [],
        busquedaxcodigo: "",
        checkBox_mostrarinactivos: false,
        contadorinactivos: 0,
      };
    },
    components: {
      "v-select": vSelect,
    },
    mounted() {
      this.getBodega();
    },
    methods: {
      getBodega() {
        let me = this;
        me.$vs.loading();

        this.$http
          .get(this.$server_url + "GetBodega")
          .then((res) => {
            this.Bodegas = res.data;
            me.getUserBodega()
            me.$vs.loading.close();
          })
          .catch((err) => {
            console.log(err);
            me.$vs.loading.close();
          });
      },
      getUserBodega() {
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url + "GetUserBodega")
          .then((res) => {
            this.userBodegas = res.data;
            me.$vs.loading.close();
          })
          .catch((err) => {
            console.log(err);
            me.$vs.loading.close();
          });
      },
      getmetodocofnrimacioninactivos() {
        // console.log(this.contadorinactivos, "cuantos");
        if (this.contadorinactivos === 0) {
          this.getBodegas_inactivas();
        }
        // Configurar un temporizador para restablecer contadorinactivos después de 2 segundos
        setTimeout(() => {
          this.contadorinactivos = 0;
        }, 1000);
      },
      getBodegas_inactivas() {
        let me = this;
        this.contadorinactivos = 1;
        this.busquedaxcodigo = '';
        me.$vs.loading()
        this.$http.get(this.$server_url + 'GetBodega_inactiva')
          .then(res => {
            this.Bodegas = res.data;
            me.$vs.loading.close()
            if (me.Bodegas.length == 0) {
              me.$vs.notify({
                text: 'No hay bodegas inactivas',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-x'
              })
            }
          })
          .catch(err => {
            console.log(err)
            me.$vs.loading.close()
          })
      },
      getBodegaParametro() {
        let me = this;
        if (me.busquedaxcodigo.length < 2) {
          me.$vs.notify({
            text: "Minimo 2 caracteres de busqueda",
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
            "GetBodega_xfiltro?busqueda=" +
            me.busqueda +
            "&razonbusqueda=" +
            me.busquedaxcodigo
          )
          .then(function (res) {
            me.Bodegas = res.data;
            if (me.Bodegas.length === 0) {
              me.$vs.notify({
                text: "No hay Bodegas para esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.Bodegas = [];
              me.getUserBodega();
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
                text: "No hay bodegas para esta búsqueda",
                color: "danger",
                iconPack: "feather",
                icon: "icon-x",
              });
              me.Bodegas = [];
              me.$vs.loading.close();
            } else {
              console.log(error + " error");
              me.$vs.loading.close();
            }
          });
      },
      getNuevo() {
        this.popupActivoGuardar = true;
        this.tabBodega.bod_nombre = "";
        this.tabBodega.bod_ubicacion = "";
        this.tabBodega.bod_responsable = "";
      },
      guardarnuevo() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        const idusuarioresp = usuarioObjeto.idusuario;
        //VALIDACION DE CAMPOS NULOS Y VACIOS
        if (
          (this.tabBodega.bod_nombre === "" || this.tabBodega.bod_nombre === null) &&
          (this.tabBodega.bod_ubicacion === "" || this.tabBodega.bod_ubicacion === null) &&
          (this.tabBodega.bod_responsable === "" || this.tabBodega.bod_responsable === null)
        ) {
          me.$vs.notify({
            text: "Escriba los datos de la bodega antes de guardar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        let datos = {
          bod_nombre: this.tabBodega.bod_nombre,
          bod_responsable: this.tabBodega.bod_responsable,
          bod_ubicacion: this.tabBodega.bod_ubicacion,
          idusuario: idusuarioresp,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostBodega_Registrar_modificar", datos)
          .then((res) => {
            me.$vs.loading.close();
            this.getBodega();
            me.$vs.notify({
              text: "La bodega se guardó con éxito",
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
              text: "La bodega no se pudo guardar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },

      getEditar(tr) {
        this.popupActivoEditar = true;
        this.tabBodega.bod_id = tr.bod_id;
        this.tabBodega.bod_nombre = tr.bod_nombre;
        this.tabBodega.bod_ubicacion = tr.bod_ubicacion;
        this.tabBodega.bod_responsable = tr.bod_responsable;
      },
      editar() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        const idusuarioresp = usuarioObjeto.idusuario;
        if (
          (this.tabBodega.bod_nombre === "" || this.tabBodega.bod_nombre === null) &&
          (this.tabBodega.bod_ubicacion === "" || this.tabBodega.bod_ubicacion === null) &&
          (this.tabBodega.bod_responsable === "" || this.tabBodega.bod_responsable === null)
        ) {
          me.$vs.notify({
            text: "Escriba los datos de la bodega antes de editar",
            color: "danger",
            iconPack: "feather",
            icon: "icon-alert-triangle",
          });
          return;
        }
        let datos = {
          bod_id: this.tabBodega.bod_id,
          bod_nombre: this.tabBodega.bod_nombre,
          bod_ubicacion: this.tabBodega.bod_ubicacion,
          bod_responsable: this.tabBodega.bod_responsable,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "PostBodega_Registrar_modificar", datos)
          .then((res) => {
            me.$vs.loading.close();
            this.getBodega();
            me.$vs.notify({
              text: "Bodega editada con exito",
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
              text: "Bodega no se pudo editar",
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
      popup_desactivar_activar_bodega(tr) {
        this.popupActivoDesactivar = true;
        this.bod_id = tr.bod_id;
        this.tabBodega.bod_nombre = tr.bod_nombre;
        this.tabBodega.bod_estado = tr.bod_estado;
      },
      desactivar_activar_bodega() {
        let me = this;
        let valornuevo = this.tabBodega.bod_estado;
        console.log(valornuevo + "valornuevoeatdobodutp" + this.bod_id);
        if (valornuevo == 1) {
          valornuevo = 0;
          let datos = {
            bod_id: this.bod_id,
            bod_estado: valornuevo,
          };
          me.$vs.loading();
          this.$http
            .post(this.$server_url + "Desactivar_Bodega", datos)
            .then((res) => {
              me.$vs.loading.close();
              this.getBodega();
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
            bod_id: this.bod_id,
            bod_estado: valornuevo,
          };
          me.$vs.loading();
          this.$http
            .post(this.$server_url + "Desactivar_Bodega", datos)
            .then((res) => {
              me.$vs.loading.close();
              this.getBodegas_inactivas();
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
        this.bod_id = tr.bod_id;
        this.tabBodega.bod_nombre = tr.bod_nombre;
      },
      getEliminar() {
        let me = this;
        let datos = {
          bod_id: this.bod_id,
        };
        me.$vs.loading();
        this.$http
          .post(this.$server_url + "Eliminar_Bodega", datos)
          .then((res) => {
            me.getBodega();
            me.$vs.loading.close();
            me.$vs.notify({
              text: "Bodega eliminada con exito",
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
              text: "Bodega no se pudo eliminar",
              color: "danger",
              iconPack: "feather",
              icon: "icon-x",
            });
          });
      },
    },
  };
</script>