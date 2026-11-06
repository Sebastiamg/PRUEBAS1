<template>
  <vx-card fixed-height="true">
      <vs-row vs-justify="flex-start">
          <vs-button type="border" color="success" class="mr-2" @click="getNuevoTipoEmpaque()">Agregar Nuevo Tipo Empaque</vs-button>
          <vs-col type="flex" v-if="conteoregistros>registrosmaximos" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
              <p>Búsqueda por filtros</p>
              <br>
              <vs-card>
                  <div>
                      <vs-input class="w-full" @keyup.enter="getTipoEmpaqueParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar" v-model="busquedaxcodigo" />
                  </div>
                  <div>
                      <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                          <li class="modelx">
                          </li>
                          <li style="margin:10px 20px 0px 0px;">
                              <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='codigoempa'">Código</vs-radio>
                          </li>
                          <li style="margin:10px 10px 0px 0px;">
                              <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="busqueda='nombreempa'">Nombre</vs-radio>
                          </li>
                          <li>
                              <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getTipoEmpaqueParametro();" icon="search"></vs-button>
                          </li>
                      </ul>
                  </div>
              </vs-card>
          </vs-col>
      </vs-row>
      <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevoTipoEmpaque()">Agregar Nuevo Producto</vs-button> -->
      <vs-table max-items="10" pagination search :data="TipoEmpaque">
          <template slot="header">
              <vs-chip color="primary">Cantidad: <b> {{ TipoEmpaque.length }}</b></vs-chip>
          </template>
          <!-- {{cliCi}} -->
          <template slot="thead">
              <vs-th width="200">
                  Código
              </vs-th>
              <vs-th colspan="1" width="500">
                  Nombre
              </vs-th>
              <vs-th colspan="1" width="500">
                  Peso
              </vs-th>
              <vs-th colspan="1" width="500">
                  Fechas
              </vs-th>
              <vs-th>
                  Estado
              </vs-th>
              <vs-th width="100">
                  Acciones
              </vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].tip_empa_codigo">
                      {{ data[indextr].tip_empa_codigo }}
                  </vs-td>
                  <vs-td>
                      {{tr.tip_empa_nombre}}
                  </vs-td>
                  <vs-td>
                      {{tr.tip_empa_peso}}
                  </vs-td>
                  <vs-td>
                      <small><b>Fecha Creación:</b><br> {{tr.created_at}}</small>
                      <br>
                      <small><b>Fecha Modificación:</b><br> {{tr.updated_at}}</small>
                  </vs-td>
                  <vs-td>
                      <vs-chip v-if="tr.tip_empa_estado == 1" color="success">Activo</vs-chip>
                      <vs-chip v-else color="danger">Inactivo</vs-chip>
                  </vs-td>
                  <vs-td :data="data[indextr].tip_empa_codigo">
                      <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                          <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                          <vs-dropdown-menu style="width: 250px;" class="cursor">
                              <vs-dropdown-item>
                                  <vs-button v-if="tr.tip_empa_estado == 1" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditarTipoEmpaque(tr)">Editar</vs-button>
                                  <vs-button v-if="userRoot" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button>
                                  <vs-button v-if="tr.tip_empa_estado == 1" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_tipo_empaque(tr)">Desactivar tipo empaque</vs-button>
                                  <vs-button v-if="tr.tip_empa_estado == 0" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_tipo_empaque(tr)">Activar tipo empaque</vs-button>
                              </vs-dropdown-item>
                          </vs-dropdown-menu>
                      </vs-dropdown>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>
      <!-- SECCION REGISTRO -->
      <vs-popup class="crear" title="Registro nuevo tipo empaque" :active.sync="popupActivoGuardarTipoEmpaque">
          <vs-row>
              <!-- {{ tabTipoEmpaque }} -->
              <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Tipo Empaque</b></vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                  <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                          <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                          <vs-input label="Código del empaque " placeholder="Código del empaque" class="w-full" icon="mode_edit" v-model="tabTipoEmpaque.tip_empa_codigo" @input="convertirAMayusculas" />
                      </vs-col>
                  </vs-row>
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                  <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                          <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                          <vs-input label="Nombre del empaque " placeholder="Nombre del empaque" class="w-full" icon="mode_edit" v-model="tabTipoEmpaque.tip_empa_nombre" @input="convertirAMayusculas" />
                      </vs-col>
                  </vs-row>
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                  <br>
                  <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                          <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                          <vs-input label="Peso [18(enteros),2(decimales)]" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabTipoEmpaque.tip_empa_peso" @keypress="validarPesoEmpaque" />
                      </vs-col>
                  </vs-row>
              </vs-col>
          </vs-row>
          <br><br>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
              <vs-button @click="guardarnuevoTipoEmpaque()" type="relief">Guardar</vs-button>&emsp;
              <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
          </vs-col>
      </vs-popup>
      <!-- SECCION EDITAR -->
      <vs-popup class="editar" :title="`Edición tipo empaque: ${tabTipoEmpaque.tip_empa_codigo}`" :active.sync="popupActivoEditarTipoEmpaque">
          <vs-row>
              <!-- {{ tabTipoEmpaque }} -->
              <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Tipo Empaque</b></vs-col>
              <br>
              <br>
              <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                  <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                          <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                          <vs-input label="Nombre del empaque " placeholder="Nombre del empaque" class="w-full" icon="mode_edit" v-model="tabTipoEmpaque.tip_empa_nombre" @input="convertirAMayusculas" />
                      </vs-col>
                  </vs-row>
              </vs-col>
              <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                  <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                          <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                          <vs-input label="Peso [18(enteros),2(decimales)]" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabTipoEmpaque.tip_empa_peso" @keypress="validarPesoEmpaque" />
                      </vs-col>
                  </vs-row>
              </vs-col>
          </vs-row>
          <br><br>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
              <vs-button @click="editarTipoEmpaque()" type="relief">Editar</vs-button>&emsp;
              <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
          </vs-col>
      </vs-popup>
      <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${tip_empa_codigo}?`" :active.sync="popupActivoEliminarTipoEmpaque">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
              <vs-button @click="getEliminarTipoEmpaque()" type="relief">Aceptar</vs-button>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
              <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
          </vs-col>
      </vs-popup>
      <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del producto: ${tip_empa_codigo}?`" :active.sync="popupActivoDesactivarTipoEmpaque">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
              <vs-button @click="desactivar_activar_tipo_empaque()" type="relief">Aceptar</vs-button>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
              <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
          </vs-col>
      </vs-popup>
  </vx-card>
  </template>

  <script>
  import {
      mapState
  } from "vuex";
  import Vue from 'vue'
  import axios from 'axios'
  import vSelect from 'vue-select';
  import { TrashIcon } from "vue-feather-icons";
  export default {
      data() {
          return {
              Verificacionconteo: '',
              TipoEmpaque: [],
              TipoEmpaque_sinfiltro: [],
              popupActivoGuardarTipoEmpaque: false,
              popupActivoEditarTipoEmpaque: false,
              popupActivoEliminarTipoEmpaque: false,
              popupActivoDesactivarTipoEmpaque: false,
              tabTipoEmpaque: {
                  tip_empa_codigo: '',
                  tip_empa_nombre: '',
                  tip_empa_peso: '',
              },
              tip_empa_codigo: 0,
              busquedaxcodigo: "",
              busqueda: "",
              valorBusqueda: "0",
              conteoregistros: 0,
              registrosmaximos: 100,
              //showAgregarNuevo: false,
          }
      },
      components: {
          'v-select': vSelect,
      },
      mounted() {
          this.getTipoEmpaqueConteo();
          // this.getTipoEmpaque();
      },
      computed: {
          ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
      },
      methods: {
          validarPesoEmpaque() {
              let peso = this.tabTipoEmpaque.tip_empa_peso;

              // Reemplazar comas por puntos solo si hay comas en la cadena
              if (peso.includes(',')) {
                  peso = peso.replace(',', '.');
                  this.tabTipoEmpaque.tip_empa_peso = peso;
              }
              // Validar el formato del número
              if (!/^\d{0,18}(\.\d{0,3})?$/.test(peso)) {
                  this.tabTipoEmpaque.tip_empa_peso = '';
                  console.log("reset");
              }
          },
          convertirAMayusculas() {
              // Convierte el valor a mayúsculas y actualiza el modelo
              this.tabTipoEmpaque.tip_empa_codigo = this.tabTipoEmpaque.tip_empa_codigo.toUpperCase();
          },
          //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
          getTipoEmpaqueConteo() {
              let me = this;
              me.$vs.loading()
              this.$http.get(this.$server_url + 'Get_TipoEmpaqueContador?conteo=' + me.registrosmaximos)
                  .then(function (res) {
                      me.Verificacionconteo = res.data.mensaje;
                      me.conteoregistros = res.data.conteo;
                      console.log(me.Verificacionconteo,"conteofianljeyson", me.conteoregistros)
                      if (me.Verificacionconteo == 'data_menor') {
                          me.TipoEmpaque = [];
                          me.getTipoEmpaque();
                          console.log("entro aqui");
                      } else if (me.Verificacionconteo == 'data_igual') {
                          me.TipoEmpaque = [];
                          //Se manda la funcion apra que en los nuevos registros
                          me.getTipoEmpaque_regduplicados();
                          // me.getTipoEmpaqueParametro();
                          console.log("entro ACA");
                      }
                      me.$vs.loading.close();
                  })
                  .catch(function (error) {
                      if (error.response && error.response.status === 404) {
                          me.$vs.notify({
                              text: 'No hay Tipo Empaque para esta búsqueda',
                              color: 'danger',
                              iconPack: 'feather',
                              icon: 'icon-x'
                          })
                          me.TipoEmpaque = [];
                          me.$vs.loading.close()
                      } else {
                          console.log(error + ' error');
                          me.$vs.loading.close();
                      }
                  })
          },
          getTipoEmpaque() {
              let me = this;
              me.$vs.loading()
              this.$http.get(this.$server_url + 'Get_TipoEmpaque')
                  //axios.get(this.$apifacturacion_url + 'f_Producto')
                  .then(res => {
                      //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                      //this.Productos = resultado;
                      this.TipoEmpaque = res.data;
                      this.TipoEmpaque_sinfiltro = res.data;
                      me.$vs.loading.close()
                      // console.log(this.Productos);
                      // console.log(this.Grupos);
                  })
                  .catch(err => {
                      console.log(err);
                      me.$vs.loading.close()
                  })
          },
          getTipoEmpaque_regduplicados() {
              let me = this;
              me.$vs.loading()
              this.$http.get(this.$server_url + 'Get_TipoEmpaque')
                  //axios.get(this.$apifacturacion_url + 'f_Producto')
                  .then(res => {
                      //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                      //this.Productos = resultado;
                      this.TipoEmpaque_sinfiltro = res.data;
                      me.$vs.loading.close()
                      // console.log(this.Productos);
                      // console.log(this.Grupos);
                  })
                  .catch(err => {
                      console.log(err);
                      me.$vs.loading.close()
                  })
          },
          getTipoEmpaqueParametro() {
              let me = this;
              //this.showAgregarNuevo = true;
              if (me.busquedaxcodigo.length < 2) {
                  me.$vs.notify({
                      text: 'Minimo 2 caracteres de busqueda',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  })
                  return false;
              }
              me.$vs.loading()
              //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
              this.$http.get(this.$server_url + 'GetTipoEmpaque_xfiltro?busqueda=' + me.busqueda + '&razonbusqueda=' + me.busquedaxcodigo)
                  .then(function (res) {
                      // me.tmpVenta = res.data;
                      // let resultado = res.data.filter(c => c.cliCi !== 0);
                      me.TipoEmpaque = res.data;
                      if (me.TipoEmpaque.length === 0) {
                          me.$vs.notify({
                              text: 'No hay Tipo Empaque para esta búsqueda',
                              color: 'danger',
                              iconPack: 'feather',
                              icon: 'icon-x'
                          })
                          me.TipoEmpaque = [];
                          me.$vs.loading.close()
                      } else {
                          // me.filtroRegion();
                          me.$vs.loading.close()
                          if (res.data.message) {
                              me.$vs.notify({
                                  text: res.data.message,
                                  color: 'success',
                                  iconPack: 'feather',
                                  icon: 'icon-user'
                              })
                          }
                      }
                  })
                  .catch(function (error) {
                      if (error.response && error.response.status === 404) {
                          me.$vs.notify({
                              text: 'No hay Tipo Empaque para esta búsqueda',
                              color: 'danger',
                              iconPack: 'feather',
                              icon: 'icon-x'
                          })
                          me.TipoEmpaque = [];
                          me.$vs.loading.close()
                      } else {
                          console.log(error + ' error');
                          me.$vs.loading.close();
                      }
                  })
          },
          //SECCION GUARDAR NUEVO PRODUCTO
          getNuevoTipoEmpaque() {
              this.popupActivoGuardarTipoEmpaque = true
              this.tabTipoEmpaque.tip_empa_codigo = ''
              this.tabTipoEmpaque.tip_empa_peso = ''
              this.tabTipoEmpaque.tip_empa_nombre = ''
          },
          guardarnuevoTipoEmpaque() {
              let me = this;
              const usuariorespo = localStorage.getItem("usuario");
              const usuarioObjeto = JSON.parse(usuariorespo);
              let resultado = me.TipoEmpaque_sinfiltro.filter(v => v.tip_empa_codigo == this.tabTipoEmpaque.tip_empa_codigo);
              if (resultado.length > 0) {
                  me.$vs.notify({
                      text: 'Ya existe un registro con ese código de tipo empaque',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  });
                  return;
              }
              //VALIDACION DE CAMPOS NULOS Y VACIOS
              if (this.tabTipoEmpaque.tip_empa_codigo === '' || this.tabTipoEmpaque.tip_empa_codigo === null) {
                  me.$vs.notify({
                      text: 'Escriba el código del tipo empaque antes de guardar',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  });
                  return;
              }
              let datos = {
                  "tip_empa_codigo": this.tabTipoEmpaque.tip_empa_codigo,
                  "tip_empa_nombre": this.tabTipoEmpaque.tip_empa_nombre,
                  "tip_empa_peso": this.tabTipoEmpaque.tip_empa_peso,
                  "user_created": usuarioObjeto.idusuario,
              }
              me.$vs.loading()
              //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
              this.$http.post(this.$server_url + 'Post_Registrar_modificar_tipo_empaque', datos)
                  .then(res => {
                      me.$vs.loading.close()
                      this.getTipoEmpaqueConteo();
                      // this.getTipoEmpaqueParametro();
                      me.$vs.notify({
                          text: 'Tipo empaque guardado con exito',
                          color: 'success',
                          iconPack: 'feather',
                          icon: 'icon-check'
                      })
                      this.popupActivoEditarTipoEmpaque = false;
                      this.popupActivoGuardarTipoEmpaque = false;
                      this.popupActivoEliminarTipoEmpaque = false;
                  })
                  .catch(function () {
                      me.$vs.loading.close()
                      me.$vs.notify({
                          text: 'Tipo empaque no se pudo guardar',
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-x'
                      })
                  })
          },
          // getTipoEmpaqueConteo() {
          // axios.get('https://localhost:7252/api/Vendedor')
          //     .then(res => {
          //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
          //     this.Vendedores = resultado;
          //     console.log(this.Vendedores);
          //     })
          //     .catch(err => {
          //     console.log(err);
          //     });
          // },
          getEditarTipoEmpaque(tr) {
              this.popupActivoEditarTipoEmpaque = true
              this.tabTipoEmpaque.tip_empa_codigo = tr.tip_empa_codigo
              this.tabTipoEmpaque.codigoanterior = tr.codigoanterior
              this.tabTipoEmpaque.tip_empa_nombre = tr.tip_empa_nombre
              this.tabTipoEmpaque.tip_empa_peso = tr.tip_empa_peso
              this.tabTipoEmpaque.mat_cub_gramaje = tr.mat_cub_gramaje
              // this.$router.push('/prueba/editar/' + this.id);
              // console.log(id);
              // this.$params.id;
          },
          editarTipoEmpaque() {
              let me = this;
              me.$vs.loading()
              let datos = {
                  "tip_empa_codigo": this.tabTipoEmpaque.tip_empa_codigo,
                  "tip_empa_nombre": this.tabTipoEmpaque.tip_empa_nombre,
                  "tip_empa_peso": this.tabTipoEmpaque.tip_empa_peso,
                  "codigoanterior": this.tabTipoEmpaque.codigoanterior,
              }
              //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
              this.$http.post(this.$server_url + 'Post_Registrar_modificar_tipo_empaque', datos)
                  .then(res => {
                      me.$vs.loading.close()
                      this.getTipoEmpaqueConteo();
                      me.$vs.notify({
                          text: 'Tipo Empaque editado con exito',
                          color: 'success',
                          iconPack: 'feather',
                          icon: 'icon-check'
                      })
                      this.popupActivoEditarTipoEmpaque = false;
                      this.popupActivoGuardarTipoEmpaque = false;
                      this.popupActivoEliminarTipoEmpaque = false;
                  })
                  .catch(error => {
                      console.log(error);
                      me.$vs.loading.close()
                      me.$vs.notify({
                          text: 'Tipo Empaque no se pudo editar',
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-x'
                      })
                  })
          },

          getPreguntaEliminar(tr) {
              this.popupActivoEliminarTipoEmpaque = true
              this.tip_empa_codigo = tr.tip_empa_codigo
          },

          getEliminarTipoEmpaque() {
              let me = this;
              let datos = {
                  "tip_empa_codigo": this.tip_empa_codigo,
              }
              me.$vs.loading()
              this.$http.post(this.$server_url + "Post_Eliminar_tipo_empaque", datos)
                  .then(data => {
                      me.$vs.loading.close()
                      this.getTipoEmpaqueConteo();
                      // this.getTipoEmpaqueParametro();
                      me.$vs.notify({
                          text: 'Tipo Empaque eliminado con exito',
                          color: 'success',
                          iconPack: 'feather',
                          icon: 'icon-check'
                      })

                      this.popupActivoEditarTipoEmpaque = false;
                      this.popupActivoGuardarTipoEmpaque = false;
                      this.popupActivoEliminarTipoEmpaque = false;
                  })
                  .catch(function () {
                      me.$vs.loading.close()
                      me.$vs.notify({
                          text: 'Tipo Empaque no se pudo eliminar',
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-x'
                      })
                  })
          },

          popup_desactivar_activar_tipo_empaque(tr) {
              this.popupActivoDesactivarTipoEmpaque = true
              this.tip_empa_codigo = tr.tip_empa_codigo
              //this.tabTipoEmpaque.tip_empa_peso = tr.tip_empa_peso
              this.tabTipoEmpaque.tip_empa_estado = tr.tip_empa_estado
          },
          desactivar_activar_tipo_empaque() {
              let me = this;
              let valornuevo = this.tabTipoEmpaque.tip_empa_estado;
              // console.log(valornuevo+'valornuevoeatdoprocutp'+this.tip_empa_codigo);
              if (valornuevo == 1) {
                  valornuevo = 0;
                  let datos = {
                      "tip_empa_codigo": this.tip_empa_codigo,
                      "tip_empa_estado": valornuevo,
                  }
                  me.$vs.loading()
                  //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                  this.$http.post(this.$server_url + 'Desactivar_Tipo_Empaque', datos)
                      .then(res => {
                          me.$vs.loading.close()
                          this.getTipoEmpaqueConteo();
                          me.$vs.notify({
                              text: 'Cambio de estado exitoso',
                              color: 'success',
                              iconPack: 'feather',
                              icon: 'icon-check'
                          })
                          this.popupActivoEditarTipoEmpaque = false;
                          this.popupActivoDesactivarTipoEmpaque = false;
                          this.popupActivoGuardarTipoEmpaque = false;
                          this.popupActivoEliminarTipoEmpaque = false;
                      })
                      .catch(error => {
                          console.log(error);
                          me.$vs.loading.close()
                          me.$vs.notify({
                              text: 'No se pudo realizar el cambio de estado',
                              color: 'danger',
                              iconPack: 'feather',
                              icon: 'icon-x'
                          })
                      })
              } else if (valornuevo == 0) {
                  valornuevo = 1;
                  let datos = {
                      "tip_empa_codigo": this.tip_empa_codigo,
                      "tip_empa_estado": valornuevo,
                  }
                  me.$vs.loading()
                  //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                  this.$http.post(this.$server_url + 'Desactivar_Tipo_Empaque', datos)
                      .then(res => {
                          me.$vs.loading.close()
                          this.getTipoEmpaqueConteo();
                          me.$vs.notify({
                              text: 'Cambio de estado exitoso',
                              color: 'success',
                              iconPack: 'feather',
                              icon: 'icon-check'
                          })
                          this.popupActivoEditarTipoEmpaque = false;
                          this.popupActivoDesactivarTipoEmpaque = false;
                          this.popupActivoGuardarTipoEmpaque = false;
                          this.popupActivoEliminarTipoEmpaque = false;
                      })
                      .catch(error => {
                          console.log(error);
                          me.$vs.loading.close()
                          me.$vs.notify({
                              text: 'No se pudo realizar el cambio de estado',
                              color: 'danger',
                              iconPack: 'feather',
                              icon: 'icon-x'
                          })
                      })
              }
          },
          getCancelar() {
              this.popupActivoEditarTipoEmpaque = false;
              this.popupActivoGuardarTipoEmpaque = false;
              this.popupActivoEliminarTipoEmpaque = false;
              this.popupActivoDesactivarTipoEmpaque = false;
          },
      },
      // created(){
      //     let url = "https://localhost:7252/api/Vendedor";
      //     axios.get(url).then((response) => this.Vendedores = response.data);
      //     // fetch("https://localhost:7252/api/Vendedor/")
      //     // .then(response => response.json())
      //     // .then((data) => (this.Vendedores = data));
      //     // // .then(data => (this.totalVuePackages = data.total));
      // }
  }
  </script>
