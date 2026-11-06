<template>
  <div>
    <!-- Filtros de estado mejorados -->
    <div
      class="mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200">
      <div class="mb-4 text-xl font-bold text-center text-gray-800">
        <i class="fa-solid fa-filter mr-2 text-blue-600"></i>
        Filtrar por estado de devolución
      </div>

      <div class="flex justify-center items-center flex-wrap gap-4">
        <!-- Creados -->
        <label class="cursor-pointer group" v-if="groupBodega">
          <input type="radio" name="estadoFiltro" :value="0" v-model="estadoFiltro" @input="estadoFiltro=0;f_getHistorialDevoluciones();"
            class="sr-only">
          <span
            :class="['px-5 py-3 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105',
              estadoFiltro == 0 ? 'text-yellow-800 bg-yellow-200 border-yellow-600 shadow-lg scale-105' : 'text-yellow-700 bg-yellow-100 border-yellow-300 group-hover:bg-yellow-300 group-hover:text-yellow-800 group-hover:shadow-md group-hover:border-yellow-500']">
            <i class="fa-solid fa-plus-circle mr-2"></i>Creados
          </span>
        </label>

        <!-- Devueltos -->
        <label class="cursor-pointer group">
          <input type="radio" name="estadoFiltro" :value="1" v-model="estadoFiltro" @input="estadoFiltro=1;f_getHistorialDevoluciones();"
            class="sr-only">
          <span
            :class="['px-5 py-3 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105',
              estadoFiltro == 1 ? 'text-blue-800 bg-blue-200 border-blue-600 shadow-lg scale-105' : 'text-blue-700 bg-blue-100 border-blue-300 group-hover:bg-blue-300 group-hover:text-blue-800 group-hover:shadow-md group-hover:border-blue-500']">
            <i class="fa-solid fa-rotate-left mr-2"></i>Revisados / Devueltos
          </span>
        </label>

        <!-- Finalizados -->
        <label class="cursor-pointer group">
          <input type="radio" name="estadoFiltro" :value="2" v-model="estadoFiltro" @input="estadoFiltro=2;f_getHistorialDevoluciones();"
            class="sr-only">
          <span
            :class="['px-5 py-3 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105',
              estadoFiltro == 2 ? 'text-green-800 bg-green-200 border-green-600 shadow-lg scale-105' : 'text-green-700 bg-green-100 border-green-300 group-hover:bg-green-300 group-hover:text-green-800 group-hover:shadow-md group-hover:border-green-500']">
            <i class="fa-solid fa-check-circle mr-2"></i>Finalizados
          </span>
        </label>

        <!-- Anulados -->
        <label class="cursor-pointer group" v-if="groupBodega">
          <input type="radio" name="estadoFiltro" :value="3" v-model="estadoFiltro" @input="estadoFiltro=3;f_getHistorialDevoluciones();"
            class="sr-only">
          <span
            :class="['px-5 py-3 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105',
              estadoFiltro == 3 ? 'text-red-800 bg-red-200 border-red-600 shadow-lg scale-105' : 'text-red-700 bg-red-100 border-red-300 group-hover:bg-red-300 group-hover:text-red-800 group-hover:shadow-md group-hover:border-red-500']">
            <i class="fa-solid fa-ban mr-2"></i>Anulados
          </span>
        </label>
        <!--Filtrar-->
        <label class="cursor-pointer group">
          <input type="radio" name="estadoFiltro" :value="4" v-model="estadoFiltro" @input="arrayHistorial = []; estadoFiltro=4;"
            class="sr-only">
          <span
            :class="['px-5 py-3 rounded-lg font-bold transition-all duration-300 border-2 transform hover:scale-105',
              estadoFiltro == 4 ? 'text-red-800 bg-red-200 border-red-600 shadow-lg scale-105' : 'text-red-700 bg-red-100 border-red-300 group-hover:bg-red-300 group-hover:text-red-800 group-hover:shadow-md group-hover:border-red-500']">
            <i class="fa-solid fa-filter mr-2"></i>Filtrar
          </span>
        </label>
      </div>

      <!-- Botón de búsqueda -->
      <div class="flex justify-center mt-6" v-if="estadoFiltro != 4">
        <vs-button @click="f_getHistorialDevoluciones">
          <i class="fa-solid fa-magnifying-glass mr-2"></i>Buscar
        </vs-button>
      </div>
       <!--filtro por cliente-->
      <div v-if="estadoFiltro == 4">
        <div class="">
            <div style="width: 100%;">
                <p>Busqueda de cliente:</p>
                <div class="flex">
                    <vs-input type="text" @keyup.enter="openInstitucion();" class="w-full mt-1" placeholder="Cliente" v-model="busquedaCliente"></vs-input>
                    <vs-button color="dark" class="ml-1 mb-2 mt-1" @click="openInstitucion();">Buscar</vs-button>
                </div>
            </div>
        </div>
      </div>
    </div>
  <div>
    <vs-table
      max-items="10"
      search
      pagination
      :data="arrayHistorial"
    >
      <!-- Header con contador -->
      <template slot="header">
        <vs-chip color="primary">
          Cantidad: <b>{{ arrayHistorial.length }}</b>
        </vs-chip>
      </template>

      <!-- Encabezados -->
      <template slot="thead">
        <vs-th sort>ID</vs-th>
        <vs-th>Documento</vs-th>
        <vs-th>Estado</vs-th>
        <vs-th>Datos</vs-th>
        <vs-th>Acciones</vs-th>
      </template>

      <!-- Filas -->
      <template slot-scope="{ data }">
        <vs-tr v-for="(tr, indextr) in data" :key="indextr" :data="tr">

          <!-- ID -->
          <vs-td>{{ tr.id }}</vs-td>

          <!-- Documento -->
          <vs-td class="text-sm">
            <div class="font-medium">{{ tr.codigo_devolucion }}</div>
            <div class="text-xs text-gray-600 space-y-1 mt-1">
              <p><b>Institución:</b> {{ tr.nombreInstitucion }}</p>
              <p><b>Período:</b> {{ tr.periodoescolar }}</p>
              <p><b>Usuario creador:</b> {{ tr.usuarioCreador }}</p>
              <p><b>Fecha creación:</b> {{ tr.created_at }}</p>
              <p v-if="tr.observacion"><b>Obs:</b> {{ tr.observacion }}</p>
            </div>
          </vs-td>

          <!-- Estado (con chip coloreado) -->
          <vs-td>
            <vs-chip
              :color="getEstadoColor(tr.estado)"
              class="font-medium text-white px-3 py-1"
            >
              {{ getEstadoTexto(tr.estado) }}
            </vs-chip>
          </vs-td>

          <!-- Datos adicionales -->
          <vs-td class="text-sm">
            <div class="space-y-1">
              <p><b>Códigos:</b> {{ tr.cantidadCodigos }}</p>
              <p v-if="tr.usuarioDevuelve"><b>Devuelve:</b> {{ tr.usuarioDevuelve }}</p>
              <p v-if="tr.fecha_devuelve"><b>Fecha Devolución:</b> {{ tr.fecha_devuelve }}</p>
              <p v-if="tr.usuarioFinaliza"><b>Finaliza:</b> {{ tr.usuarioFinaliza }}</p>
              <p v-if="tr.fecha_finaliza"><b>Fecha finalizado:</b> {{ tr.fecha_finaliza }}</p>
              <p v-if="tr.usuarioAnula"><b>Anula:</b> {{ tr.usuarioAnula }}</p>
              <p v-if="tr.fecha_anula"><b>Fecha anulado:</b> {{ tr.fecha_anula }}</p>
            </div>
          </vs-td>

          <!-- Acciones -->
          <vs-td>
            <vs-dropdown vs-trigger-click vs-custom-content>
              <vs-button icon="more_vert" type="border" class="a-icons"></vs-button>

              <vs-dropdown-menu class="w-48">
                <!-- Revisar códigos -->
                <vs-dropdown-item v-if="groupBodega">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="primary"
                    @click="f_mostrarCodigos(tr); ObjectedSelected = tr; id_devolucion = tr.id"
                  >
                    <i class="fa-solid fa-folder mr-2"></i> Revisar
                  </vs-button>
                </vs-dropdown-item>

                <!-- Generar PDF -->
                <vs-dropdown-item v-if="groupBodega">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="dark"
                    @click="ObjectedSelected = tr; id_devolucion = tr.id; popupImprimirPdf = true"
                  >
                    <i class="fa-solid fa-file-pdf mr-2"></i> Generar PDF
                  </vs-button>
                </vs-dropdown-item>

                <!-- Editar Valores (solo si está Devuelto) -->
                <vs-dropdown-item v-if="(userRoot || userAdminFacturador || userFacturador) && tr.estado === 1">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="warning"
                    @click="editarValores(tr)"
                  >
                    <i class="fa-solid fa-edit mr-2"></i> Editar Valores
                  </vs-button>
                </vs-dropdown-item>

                <!-- Finalizar (solo si está Devuelto) -->
                <vs-dropdown-item v-if="(userRoot || userAdminFacturador || userFacturador) && tr.estado === 1">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="success"
                    @click="finalizarDevolucion(tr)"
                  >
                    <i class="fa-solid fa-check-circle mr-2"></i> Finalizar
                  </vs-button>
                </vs-dropdown-item>

                <!-- Regresar a Devuelto (si está finalizado) -->
                <vs-dropdown-item v-if="(userRoot || userAdminFacturador || userFacturador) && tr.estado === 2">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="warning"
                    @click="regresarEstadoDevuelto(tr)"
                  >
                    <i class="fa-solid fa-undo mr-2"></i> Regresar a Devuelto
                  </vs-button>
                </vs-dropdown-item>

                <!-- Ver PDF (si ya está finalizado) -->
                <vs-dropdown-item v-if="(userAdminFacturador || userFacturador) && tr.estado === 2">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="success"
                    @click="ObjectedSelected = tr; id_devolucion = tr.id; popupImprimirPdf = true"
                  >
                    <i class="fa-solid fa-file-pdf mr-2"></i> Ver PDF
                  </vs-button>
                </vs-dropdown-item>

                <!-- Eliminar (solo Creado + permisos) -->
                <vs-dropdown-item v-if="(tr.estado === 0) && (userRoot || AdminBodega)">
                  <vs-button
                    type="line"
                    class="w-full justify-start"
                    color="danger"
                    @click="confirmEliminarDocumento(tr)"
                  >
                    <i class="fa-solid fa-trash mr-2"></i> Eliminar
                  </vs-button>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
  <!--modales-->
  <!--Modal para imprimir PDF-->
  <vs-popup title="Confirmación"  class="informacionformPadre" :active.sync="popupImprimirPdf" fullscreen>
    <div v-if="popupImprimirPdf">
      <DevolucionBodegaImprimirVue :id_devolucion="id_devolucion" @changeFinalizar="changeFinalizar"/>
    </div>
  </vs-popup>
  <!--Modal para mostrar códigos-->
  <vs-popup title="Revisar Códigos" class="informacionformPadre" :active.sync="popupMostrarCodigos" fullscreen>
    <div v-if="popupMostrarCodigos">
      <DevolucionBodegaRevisarVue :id_devolucion="id_devolucion" @changeRevisados="changeRevisados" />
    </div>
  </vs-popup>
  <!--Modal para editar valores-->
  <vs-popup title="Editar Valores" class="informacionformPadre" :active.sync="popupEditarValores" fullscreen>
    <div v-if="popupEditarValores">
      <DevolucionBodegaEditarValoresVue :id_devolucion="id_devolucion" @changeEditarValores="changeEditarValores" />
    </div>
  </vs-popup>
  <!--Mostrar errores-->
  <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupMostrarErrores">
    <div v-if="popupMostrarErrores">
        <TableReutilizableVue :title="'Se encontraros los siguientes errores'" :headers="['codigo','mensaje']" :fieldKeys="['codigo','mensaje']" :ifexportar="Number(1)" :tableData="codigosNoCambiados" />
    </div>
  </vs-popup>
  <!--Modal para mostrar la institución-->
  <vs-popup classContent="popup-example" title="Mostrar institución" :active.sync="popupMostrarInstitucion">
    <div v-if="popupMostrarInstitucion">
      <TableSelectInstitucion @changeHandle="changeHandle" :busquedaExterna="busquedaCliente" :ifBusquedaExterna="Number(1)" />
    </div>
  </vs-popup>
</div>
</template>
<script>
import {
  mapState
} from "vuex";
import DevolucionBodegaImprimirVue from './componentes/DevolucionBodegaImprimir.vue';
const DevolucionBodegaRevisarVue = () => import('./componentes/DevolucionBodegaRevisar.vue');
const DevolucionBodegaEditarValoresVue = () => import('./componentes/DevolucionBodegaEditarValores.vue');
const TableSelectInstitucion = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableSelectInstitucion.vue');
import Generalmix from '../../mixins/Generalmix';
export default {
  mixins: [Generalmix],
  components: {
    DevolucionBodegaImprimirVue,
    DevolucionBodegaRevisarVue,
    DevolucionBodegaEditarValoresVue,
    TableSelectInstitucion,
  },
  data() {
    let usuarioLocal = localStorage.getItem('usuario');
    return {
      arrayHistorial: [],
      ObjectedSelected: null,
      usuario: usuarioLocal ? JSON.parse(usuarioLocal) : null,
      popupImprimirPdf: false,
      id_devolucion: null,
      popupMostrarCodigos: false,
      popupEditarValores: false,
      estadoFiltro: 0, // 0: Creado, 1: Devueltos, 2: Finalizados, 3: Anulados
      codigosNoCambiados: [],
      popupMostrarErrores: false,
      // variables para busqueda por cliente
      busquedaCliente: '',
      popupMostrarInstitucion: false,
      id_cliente: null,
      nombreCliente: '',
      // fin variables para busqueda por cliente
    }
  },
  computed: {
    ...mapState(['userRoot', 'groupFacturador', 'AdminBodega', 'groupBodega','userFacturador','userAdminFacturador']),
  },
  async mounted() {
    let me = this
    if(me.userFacturador || me.userAdminFacturador){
      me.estadoFiltro = 1
    }
    await this.f_getHistorialDevoluciones();
  },
  methods: {
    getEstadoTexto(estado) {
      const estados = { 0: 'Creado', 1: 'Devuelto', 2: 'Finalizado' };
      return estados[estado] || 'Anulado';
    },

    getEstadoColor(estado) {
      const colores = {
        0: '#CCD145', // Amarillo
        1: '#6279DE', // Azul
        2: '#68D14D', // Verde
      };
      return colores[estado] || '#ED705A'; // Rojo por defecto (Anulado)
    },

    finalizarDevolucion(tr) {
      this.ObjectedSelected = tr;
      this.id_devolucion = tr.id;
      this.popupImprimirPdf = true; // o llama a tu función de finalizar
    },
    changeFinalizar(){
      let me = this
      this.popupImprimirPdf = false;
      me.f_getHistorialDevoluciones();
    },
    changeRevisados(datos) {
      let me = this;
      me.popupMostrarCodigos = false;
      me.codigosNoCambiados = datos.codigosNoCambiados;
      me.popupMostrarErrores = datos.codigosNoCambiados.length > 0;
      me.f_getHistorialDevoluciones();
    },
    async f_getHistorialDevoluciones() {
      let me = this;
      me.$vs.loading();
      try {
        let sendEstadoFiltrar = null
        if(me.estadoFiltro == 4){
          console.log("filtro por cliente")
          // facturador solo devueltos y finalizados
          if(me.userAdminFacturador || me.userFacturador){
            sendEstadoFiltrar = '1,2'
          }else{
            sendEstadoFiltrar = '0,1,2,3'
          }
        }else{
          me.id_cliente     = null
          me.nombreCliente  = '';
          sendEstadoFiltrar = me.estadoFiltro
        }
        const response = await me.$http.get(me.$server_url + 'devoluciones', {
          params: {
            getDevolucionesCombosDesarmados: 1,
            estadoFiltro: sendEstadoFiltrar,
            filtrarByInstitucion: me.id_cliente ? me.id_cliente : null,
          }
        });

        let data = response.data;
        if(data.length == 0){
          this.arrayHistorial = [];
          me.m_message('No se encontraron datos de devoluciones', "warning");
          return
        }
        // Si es filtro de FINALIZADOS (estado 2) → ordenar por fecha_finaliza DESC
        if (me.estadoFiltro === 2) {
          data = data.sort((a, b) => {
            const fechaA = a.fecha_finaliza ? new Date(a.fecha_finaliza) : new Date(0);
            const fechaB = b.fecha_finaliza ? new Date(b.fecha_finaliza) : new Date(0);
            return fechaB - fechaA; // Más reciente primero
          });
        }

        this.arrayHistorial = data;

        if (this.arrayHistorial.length === 0) {
          me.m_message('No se encontraron datos de devoluciones', "warning");
        }
      } catch (error) {
        console.error("Error al cargar historial:", error);
        me.m_message('Error al cargar el historial', 'danger');
      } finally {
        me.$vs.loading.close();
      }
    },
    f_mostrarCodigos(){
      this.popupMostrarCodigos = true;
    },
    editarValores(tr) {
      this.ObjectedSelected = tr;
      this.id_devolucion = tr.id;
      this.popupEditarValores = true;
    },
    changeEditarValores() {
      let me = this;
      this.popupEditarValores = false;
      me.f_getHistorialDevoluciones();
    },
    regresarEstadoDevuelto(tr) {
      let me = this;
      me.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Confirmación',
        text: '¿Está seguro que desea regresar este documento a estado devuelto? Esto permitirá editarlo nuevamente.',
        accept: () => me.confirmarRegresarEstado(tr),
        acceptText: 'Aceptar',
        cancelText: 'Cancelar'
      });
    },
    async confirmarRegresarEstado(tr) {
      let me = this;
      me.$vs.loading();
      try {
        const formData = new FormData();
        formData.append('regresarEstadoDevuelto', 1);
        formData.append('id_devolucion', tr.id);
        formData.append('id_usuario', me.usuario.idusuario);
        
        const response = await me.$http.post(me.$server_url + 'devoluciones', formData);
        me.$vs.loading.close();
        
        if (response.data.status == 0) {
          me.m_message(response.data.message, "danger");
          return;
        }
        
        me.m_message('Documento regresado a estado devuelto correctamente', 'success');
        me.f_getHistorialDevoluciones();
      } catch (error) {
        me.$vs.loading.close();
        me.m_message('Error al regresar el documento', 'danger');
      }
    },
    confirmEliminarDocumento(tr) {
      let me = this;
      me.ObjectedSelected = tr;
      me.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirmación',
        text: '¿Está seguro que desea eliminar este documento de devolución?',
        accept: () => me.eliminarDocumento(tr),
        acceptText:'Aceptar',
        cancelText:'Cancelar'
      });
    },
    async eliminarDocumento(tr) {
      let me = this;
      me.$vs.loading();
      try {
        const formData = new FormData();
        formData.append('id_devolucion', tr.id);
        formData.append('eliminarDevolucionSueltos','1')
        const response = await me.$http.post(me.$server_url + 'devoluciones', formData);
        me.$vs.loading.close();
        if(response.data.status == 0){
          me.m_message(response.data.message,"danger")
          return
        }
        me.m_message('Documento eliminado correctamente','success');
        me.f_getHistorialDevoluciones();
      } catch (error) {
        me.$vs.loading.close();
        me.m_message('Error al eliminar el documento','danger');
      }
    },
    // metodos para busqueda por cliente
    openInstitucion() {
      let me = this
      //no puede estar vacio
      if (me.busquedaCliente == '') {
        me.$vs.notify({
          text: 'Debe ingresar una institución',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return false;
      }
      //quitar espacios con trim
      me.busquedaCliente          = me.busquedaCliente.trim()
      me.popupMostrarInstitucion  = true
    },
    changeHandle(e) {
      let me = this;
      me.id_cliente = e.idInstitucion;
      me.nombreCliente = e.nombreInstitucion;
      me.popupMostrarInstitucion = false;
      me.arrayHistorial = []
      me.f_getHistorialDevoluciones();
    },
  }
}
</script>
<style scoped>
.informacionformPadre {
    z-index: 51001;
}
</style>
