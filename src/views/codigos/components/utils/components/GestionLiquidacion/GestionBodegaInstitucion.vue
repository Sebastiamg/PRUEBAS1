<template>
  <div class="gestion-bodega-institucion-wrapper">
    <!-- Sección de búsqueda -->
    <vs-row class="mt-3">
      <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
        <div class="search-container">
          <!-- Radio buttons simples arriba -->
          <div class="search-type-radios mb-3">
            <label class="radio-option">
              <input type="radio" v-model="tipoBusqueda" value="documento" name="tipoBusqueda" />
              <span class="radio-label">
                <i class="fa fa-file-text-o"></i>
                Buscar por documento
              </span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="tipoBusqueda" value="institucion" name="tipoBusqueda" />
              <span class="radio-label">
                <i class="fa fa-building-o"></i>
                Buscar por institución
              </span>
            </label>
          </div>

          <div class="search-input-wrapper">
            <label class="search-label">
              <i :class="tipoBusqueda === 'institucion' ? 'fa fa-building-o' : 'fa fa-file-text-o'"></i>
              {{ tipoBusqueda === 'institucion' ? 'Búsqueda de la institución' : 'Búsqueda del documento de venta' }}
            </label>
            <div class="input-with-button">
              <vs-input
                icon="search"
                class="search-input-field"
                :placeholder="tipoBusqueda === 'institucion' ? 'Ej: Unidad Educativa...' : 'Ej: PF-GC26-C26-ASWNM-1831'"
                @keyup.enter="tipoBusqueda === 'institucion' ? buscarInstitucion() : buscarDocumento()"
                v-model="busqueda" />
              <vs-button
                class="search-button-inline"
                @click="tipoBusqueda === 'institucion' ? buscarInstitucion() : buscarDocumento()"
                type="gradient"
                color="primary">
                <i class="fa fa-search"></i>
                Buscar
              </vs-button>
            </div>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <!-- Card de institución asignada compacta -->
    <vs-row v-if="institucionAsignada || institucionData.nombreInstitucion" class="mb-4 mt-4">
      <vs-col vs-justify="left" vs-align="left" vs-w="12" vs-sm="12" vs-xs="12" vs-class="w-full">
        <div class="institucion-asignada-card-compacta">
          <!-- Header con institución y botón limpiar -->
          <div class="institucion-header-compacta">
            <div class="institucion-info-compacta">
              <i class="fa fa-check-circle institucion-icon"></i>
              <div>
                <p class="institucion-label">Institución asignada</p>
                <h3 class="institucion-nombre">{{ displayNombreInstitucion }}</h3>
                <p class="institucion-periodo">
                  <i class="fa fa-calendar"></i>
                  Período: <span class="periodo-text">{{ displayPeriodoDescripcion }}</span>
                </p>
              </div>
            </div>
            <vs-button
              color="danger"
              class="delete-button"
              @click="limpiarInstitucion()"
              type="flat"
              icon="delete">
              Limpiar
            </vs-button>
          </div>

          <!-- Información adicional compactada -->
          <div class="info-compacta-grid">
            <!-- Tipo de venta -->
            <div v-if="radioRegalado!=4" class="info-item">
              <label class="info-label">
                <i class="fa fa-tag"></i>
                Tipo de venta:
              </label>
              <div class="info-value">
                <div v-if="displayVentaEstado == 1" class="status-chip success">
                  <span class="status-dot-small"></span>
                  Venta directa
                </div>
                <div v-else-if="displayVentaEstado == 2" class="status-chip primary">
                  <span class="status-dot-small"></span>
                  Venta lista
                </div>
                <div v-else class="status-chip warning">
                  <span class="status-dot-small"></span>
                  No seleccionado
                </div>
              </div>
            </div>

            <!-- Empresa -->
            <div class="info-item">
              <label class="info-label">
                <i class="fa fa-building"></i>
                Empresa:
              </label>
              <div class="info-value">
                <span v-if="displayEmpresa && arrayEmpresas.find(p => p.id == displayEmpresa)">
                  {{ arrayEmpresas.find(p => p.id == displayEmpresa).nombre }}
                </span>
                <span v-else class="text-muted">No seleccionada</span>
              </div>
            </div>

            <!-- Documento -->
            <div class="info-item">
              <label class="info-label">
                <i class="fa fa-file-text-o"></i>
                Documento:
              </label>
              <div class="info-value">
                <span v-if="displayDocumento" class="documento-badge">
                  {{ displayDocumento }}
                </span>
                <span v-else class="text-muted">No seleccionado</span>
              </div>
            </div>

            <!-- Pedido Perseo -->
            <div class="info-item">
              <label class="info-label">
                <i class="fa fa-shopping-cart"></i>
                Pedido Perseo:
              </label>
              <div class="info-value">
                <div v-if="displayPedidoCodigo" class="status-chip info-perseo">
                  <span class="status-dot-small"></span>
                  {{ displayPedidoCodigo }}
                </div>
                <div v-else class="status-chip danger-perseo">
                  <span class="status-dot-small"></span>
                  No tiene
                </div>
              </div>
            </div>

            <!-- Usuario que escanea -->
            <div class="info-item" v-if="displayUsuarioEscaneo">
              <label class="info-label">
                <i class="fa fa-user"></i>
                Usuario escaneo:
              </label>
              <div class="info-value">
                <div class="status-chip escaneo-usuario">
                  <span class="status-dot-small"></span>
                  {{ displayUsuarioEscaneo }}
                </div>
              </div>
            </div>

            <!-- Fecha inicio escaneo -->
            <div class="info-item" v-if="displayFechaInicioEscaneo">
              <label class="info-label">
                <i class="fa fa-clock-o"></i>
                Inicio escaneo:
              </label>
              <div class="info-value">
                <div class="status-chip escaneo-fecha">
                  <span class="status-dot-small"></span>
                  {{ displayFechaInicioEscaneo }}
                </div>
              </div>
            </div>

            <!-- Observaciones escaneo -->
            <div class="info-item" v-if="displayObservacionesEscaneo">
              <label class="info-label">
                <i class="fa fa-comment-o"></i>
                Obs. escaneo:
              </label>
              <div class="info-value">
                <span class="observacion-escaneo-text">{{ displayObservacionesEscaneo }}</span>
              </div>
            </div>
          </div>
        </div>
      </vs-col>
    </vs-row>

    <!-- Comentario debajo del card -->
    <vs-row v-if="institucionAsignada" class="mt-3">
      <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12">
        <div class="comentario-container-simple">
          <label class="comentario-label-simple">
            <i class="fa fa-comment-o"></i>
            Ingrese comentario:
          </label>
          <vs-input
            icon="icon-message-square"
            class="comentario-input-simple"
            icon-pack="feather"
            placeholder="Escriba un comentario sobre esta importación..."
            v-model="observacion"
            @input="$emit('update:observacion', observacion)"/>
        </div>
      </vs-col>
    </vs-row>

    <!-- Tabla de resultados -->
    <vs-row v-if="instituciones.length > 0">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" class="mt-5" style="flex-wrap:wrap;" v-if="userRoot && tipoBusqueda === 'institucion'">
        <small>Seleccione un período</small>
        <v-select :options="arrayPeriodos" @input="cambiarPeriodo()" :reduce="arrayPeriodos => arrayPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
        <vs-table stripe max-items="50" style="width: 100%;" search pagination :data="instituciones">
          <template slot="header">
            <div class="vx-row">
              <div class="vx-col w-full m-3">
                Cantidad: {{instituciones.length}}
              </div>
            </div>
          </template>
          <template slot="thead">
            <vs-th v-if="tipoBusqueda === 'institucion'" sort-key="idInstitucion" style="width: 20%;">#</vs-th>
            <vs-th v-if="tipoBusqueda === 'documento'" sort-key="ven_codigo" style="width: 25%;">Documento</vs-th>
            <vs-th sort-key="nombreInstitucion" style="width: 40%;">Institución</vs-th>
            <vs-th v-if="tipoBusqueda === 'documento'" sort-key="id_empresa" style="width: 15%;">Empresa</vs-th>
            <vs-th sort-key="nombre" style="width: 20%;">Localidad</vs-th>
            <vs-th sort-key="nombre" style="width: 20%;">Periodo</vs-th>
            <vs-th v-if="tipoBusqueda === 'documento'" sort-key="tip_ven_codigo" style="width: 15%;">Tipo Venta</vs-th>
            <vs-th sort-key="nombre" style="width: 20%;">Acción</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td v-if="tipoBusqueda === 'institucion'" :data="data[indextr].idInstitucion">
                {{data[indextr].idInstitucion}}
              </vs-td>
              <vs-td v-if="tipoBusqueda === 'documento'" :data="data[indextr].ven_codigo">
                <b>{{data[indextr].ven_codigo}}</b> <br>
                <b>Estado:</b>
                <p v-if="tr.est_ven_codigo == 1">Despachado</p>
                <p v-if="tr.est_ven_codigo == 2">Pendiente de despacho</p>
                <p v-if="tr.est_ven_codigo == 3">Anulado</p>
                <p v-if="tr.est_ven_codigo == 4">En proceso de escaneado</p>
                <p v-if="tr.proceso_empacar == 1" style="color:#e65100;font-weight:700;font-size:11px;"><i class="fa fa-box"></i> En proceso de empaque</p>
              </vs-td>
              <vs-td :data="data[indextr].nombreInstitucion">
                {{data[indextr].nombreInstitucion}}<br>
                <p v-if="tipoBusqueda === 'institucion'"><b>Ruc:</b> {{ tr.ruc }}</p>
                <p v-if="tipoBusqueda === 'institucion'"><b>Teléfono:</b> {{ tr.telefonoInstitucion }}</p>
                <div v-if="tipoBusqueda === 'institucion' && data[indextr].nombre_asesor == null && data[indextr].apellido_asesor == null">
                  <small><i style="color:red;">No existe asesor</i></small><br>
                </div>
                <div v-else-if="tipoBusqueda === 'institucion'">
                  <small><i>{{data[indextr].nombre_asesor}} {{data[indextr].apellido_asesor}}</i></small><br>
                </div>
                <small v-if="tipoBusqueda === 'institucion'">{{data[indextr].fecha_registro}}</small>
              </vs-td>
              <vs-td v-if="tipoBusqueda === 'documento'" :data="data[indextr].id_empresa">
                <span>{{ tr.descripcion_empresa }}</span>
              </vs-td>
              <vs-td :data="tipoBusqueda === 'institucion' ? data[indextr].nombreregion : data[indextr].ciudad">
                {{tipoBusqueda === 'institucion' ? data[indextr].nombreregion : data[indextr].ciudad}}<br>
                <small v-if="tipoBusqueda === 'institucion'">{{data[indextr].ciudad}}</small>
              </vs-td>
              <vs-td>
                <div v-if="tipoBusqueda === 'institucion' && tr.EstadoConfiguracion == 1">
                  {{ tr.periodoNombreConfigurado }}
                  <p class="font-medium" style="color:#ff5733;">
                    Se tomará un periodo activo de la lista de periodos escolares asignados a bodega.
                  </p>
                </div>
                <div v-else>
                  <small>{{ tr.periodo }}</small><br>
                  <vs-chip v-if="tr.statusPeriodo == '1'" color="success" style="margin-left:-5px;">
                    {{ tipoBusqueda === 'institucion' ? tr.estadoPeriodo : 'Activo' }}
                  </vs-chip>
                  <vs-chip v-else color="danger" style="margin-left:-5px;">
                    {{ tipoBusqueda === 'institucion' ? tr.estadoPeriodo : 'Inactivo' }}
                  </vs-chip>
                </div>
              </vs-td>
              <vs-td v-if="tipoBusqueda === 'documento'" :data="data[indextr].tip_ven_codigo">
                <vs-chip v-if="data[indextr].tip_ven_codigo == 1" color="success">Venta directa</vs-chip>
                <vs-chip v-else-if="data[indextr].tip_ven_codigo == 2" color="primary">Venta lista</vs-chip>
                <vs-chip v-else color="warning">No definido</vs-chip>
              </vs-td>
              <vs-td>
                <vs-button v-if="tipoBusqueda === 'institucion'" type="relief" size="small" @click="asignarInstitucion(tr)">
                  Asignar Institución
                </vs-button>
                <vs-button v-else type="relief" size="small" @click="asignarDocumento(tr)">
                  Asignar Documento
                </vs-button>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-col>
    </vs-row>

    <!-- Modal de selección de sesiones de escaneo -->
    <GestionbodegaEscaneo
      :active.sync="modalSesionesEscaneo"
      :sesionesEscaneo="sesionesEscaneoDisponibles"
      :arrayInformacionDocumento="documentoTemporal ? (documentoTemporal.arrayInformacionDocumento || []) : []"
      @sesion-seleccionada="handleSesionSeleccionada"
      @iniciar-empaque="handleIniciarEmpaque"
    />
  </div>
</template>

<script>
import vSelect from 'vue-select'
import { mapState } from 'vuex'
import GestionbodegaEscaneo from './GestionbodegaEscaneo.vue'

export default {
  name: 'GestionBodegaInstitucion',
  components: {
    vSelect,
    GestionbodegaEscaneo
  },
  props: {
    arrayPeriodos: {
      type: Array,
      default: () => []
    },
    arrayEmpresas: {
      type: Array,
      default: () => []
    },
    radioRegalado: {
      type: [String, Number],
      default: '0'
    },
    institucionData: {
      type: Object,
      default: () => ({
        nombreInstitucion: '',
        periodoDescripcion: '',
        venta_estado: 0,
        empresa: '',
        documento: '',
        pedido_codigo: null,
        fecha_inicio_escaneo: null,
        observaciones_escaneo: null
      })
    }
  },
  data() {
    return {
      tipoBusqueda: 'documento',
      busqueda: '',
      instituciones: [],
      institucionAsignada: null,
      periodoSelect: '',
      observacion: '',
      modalSesionesEscaneo: false,
      sesionesEscaneoDisponibles: [],
      documentoTemporal: null,
      escaneoSelected: null
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  computed: {
    ...mapState(['userRoot','AdminBodega','userBodegaNormal']),
    displayNombreInstitucion() {
      return this.institucionData.nombreInstitucion || (this.institucionAsignada ? this.institucionAsignada.nombreInstitucion : '')
    },
    displayPeriodoDescripcion() {
      return this.institucionData.periodoDescripcion || (this.institucionAsignada ? this.institucionAsignada.periodoDescripcion : '')
    },
    displayVentaEstado() {
      return this.institucionData.venta_estado || (this.institucionAsignada ? this.institucionAsignada.venta_estado : 0)
    },
    displayEmpresa() {
      return this.institucionData.empresa || (this.institucionAsignada ? this.institucionAsignada.empresa : '')
    },
    displayDocumento() {
      return this.institucionData.documento || (this.institucionAsignada ? this.institucionAsignada.documento : '')
    },
    displayPedidoCodigo() {
      return this.institucionData.pedido_codigo || (this.institucionAsignada ? this.institucionAsignada.pedido_codigo : null)
    },
    displayFechaInicioEscaneo() {
      return this.institucionData.fecha_inicio_escaneo || (this.institucionAsignada ? this.institucionAsignada.fecha_inicio_escaneo : null)
    },
    displayObservacionesEscaneo() {
      return this.institucionData.observaciones_escaneo || (this.institucionAsignada ? this.institucionAsignada.observaciones_escaneo : null)
    },
    displayUsuarioEscaneo() {
      return this.institucionData.usuario_escaneo || (this.institucionAsignada ? this.institucionAsignada.usuario_escaneo : null)
    }
  },
  watch: {
    tipoBusqueda(newValue, oldValue) {
      if (newValue !== oldValue) {
        console.log('Cambio de tipo de búsqueda:', oldValue, '->', newValue)

        // Limpiar todo en el componente hijo
        this.busqueda = ''
        this.institucionAsignada = null
        this.instituciones = []
        this.observacion = ''

        // Emitir evento al padre para que también limpie
        this.$emit('institucion-limpiada')

        // Emitir evento específico para resetear activeTypes
        this.$emit('tipo-busqueda-cambiado')

        console.log('Eventos institucion-limpiada y tipo-busqueda-cambiado emitidos')

        this.$vs.notify({
          text: 'Filtro cambiado. Toda la información ha sido limpiada.',
          color: 'primary',
          iconPack: 'feather',
          icon: 'icon-info'
        })
      }
    },
    // Watcher para sincronizar observacion desde el padre
    'institucionData.nombreInstitucion'(newValue) {
      // Si el padre limpia la institución, también limpiar observacion
      if (!newValue || newValue === '') {
        this.observacion = ''
      }
    }
  },
  methods: {
    buscarInstitucion() {
      let me = this
      me.limpiarInstitucion()

      if (me.busqueda.length < 5) {
        me.$vs.notify({
          text: 'Mínimo 5 caracteres de búsqueda',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return false
      }

      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?busqueda=' + me.busqueda)
        .then(function (res) {
          me.instituciones = res.data
          me.$vs.loading.close()
          if (res.data.message) {
            me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user'
            })
          }
        })
        .catch(function (error) {
          console.log(error + ' error')
          me.$vs.loading.close()
        })
    },
    buscarDocumento() {
      let me = this
      me.limpiarInstitucion()

      if (me.busqueda.length < 3) {
        me.$vs.notify({
          text: 'Mínimo 3 caracteres de búsqueda',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return false
      }

      me.$vs.loading()
      this.$http.get(this.$server_url + 'devoluciones?buscarDocumentoVenta=1&documento=' + me.busqueda+'&id_usuario='+me.usuario.idusuario)
        .then(function (res) {
          let datos = res.data

          if (datos.length === 0) {
            me.$vs.notify({
              text: 'No se encontraron documentos con ese criterio',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            me.$vs.loading.close()
            return
          }

          me.instituciones = datos
          me.$vs.notify({
            text: `Se encontraron ${datos.length} documento(s)`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error)
          me.$vs.loading.close()
        })
    },
    asignarInstitucion(institucion) {
      let me = this

      // Determinar qué periodo usar según EstadoConfiguracion
      let periodoId = institucion.periodo_id
      let periodoDesc = institucion.periodo

      if (institucion.EstadoConfiguracion == 1) {
        // Si está configurado, usar periodo_configurado y periodoNombreConfigurado
        periodoId = institucion.periodo_configurado
        periodoDesc = institucion.periodoNombreConfigurado
      }

      me.institucionAsignada = {
        idInstitucion: institucion.idInstitucion,
        nombreInstitucion: institucion.nombreInstitucion,
        periodo_id: periodoId,
        periodoDescripcion: periodoDesc,
        ciudadDescripcion: institucion.ciudad,
        EstadoConfiguracion: institucion.EstadoConfiguracion || 0,
        periodo_configurado: institucion.periodo_configurado || null,
        venta_estado: 0,
        empresa: '',
        documento: '',
        id_institucionPedido: null,
        pedido_codigo: null,
        idtipodoc: null,
        ven_p_libros_obsequios:null
      }

      me.instituciones = []

      me.$emit('institucion-asignada', me.institucionAsignada)

      me.$vs.notify({
        text: 'Institución asignada correctamente',
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check'
      })
    },
    asignarDocumento(documento) {
      let me = this
      if (documento.proceso_empacar == 1) {
        me.$vs.notify({
          text: 'Este documento ya inició un proceso de empaque.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      if(documento.est_ven_codigo!=4){
        // no se puede despachar un documento que no esté pendiente de despacho
        me.$vs.notify({
          text: 'Solo se pueden asignar documentos que estén pendientes de despacho.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return;
      }

      // Verificar si tiene sesión de escaneo activa
      if (!documento.sessionEscaneo || documento.sessionEscaneo.length === 0) {
        me.$vs.notify({
          text: 'No hay sessiones de escaneo activas para este documento. Debe activar una sesión primero.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }

      // Siempre mostrar modal para seleccionar sesión
      if (documento.sessionEscaneo.length >= 1) {
        me.documentoTemporal = documento
        me.sesionesEscaneoDisponibles = documento.sessionEscaneo
        me.modalSesionesEscaneo = true
        return
      }

      me.institucionAsignada = {
        idInstitucion: documento.institucion_id || documento.id_institucion,
        nombreInstitucion: documento.nombreInstitucion || documento.ven_concepto_perseo,
        periodo_id: documento.periodo_id,
        periodoDescripcion: documento.periodo,
        ciudadDescripcion: documento.ciudad,
        EstadoConfiguracion: 0,
        periodo_configurado: null,
        venta_estado: documento.tip_ven_codigo,
        empresa: documento.id_empresa,
        documento: documento.ven_codigo,
        ven_codigo: documento.ven_codigo,
        id_institucionPedido: documento.id_institucionPedido,
        pedido_codigo: documento.pedido_codigo || null,
        idtipodoc: documento.idtipodoc || null,
        ven_p_libros_obsequios:documento.ven_p_libros_obsequios|| null,
        fecha_inicio_escaneo: sesionEscaneo ? sesionEscaneo.fecha_inicio : null,
        observaciones_escaneo: sesionEscaneo ? sesionEscaneo.observaciones : null,
        usuario_escaneo: sesionEscaneo ? sesionEscaneo.nombreUsuario : null,
        escaneoSelected: me.escaneoSelected,
        arrayInformacionDocumento: documento.arrayInformacionDocumento || []
      }

      me.instituciones = []

      me.$emit('documento-asignado', me.institucionAsignada)

      me.$vs.notify({
        text: 'Documento asignado correctamente con sesión de escaneo activa.',
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check'
      })
    },
    handleIniciarEmpaque(data) {
      let me = this
      if (me.documentoTemporal) {
        const sesionEscaneo = data.sesion
        me.institucionAsignada = {
          idInstitucion: me.documentoTemporal.institucion_id || me.documentoTemporal.id_institucion,
          nombreInstitucion: me.documentoTemporal.nombreInstitucion || me.documentoTemporal.ven_concepto_perseo,
          periodo_id: me.documentoTemporal.periodo_id,
          periodoDescripcion: me.documentoTemporal.periodo,
          ciudadDescripcion: me.documentoTemporal.ciudad,
          EstadoConfiguracion: 0,
          periodo_configurado: null,
          venta_estado: me.documentoTemporal.tip_ven_codigo,
          empresa: me.documentoTemporal.id_empresa,
          documento: me.documentoTemporal.ven_codigo,
          ven_codigo: me.documentoTemporal.ven_codigo,
          id_institucionPedido: me.documentoTemporal.id_institucionPedido,
          pedido_codigo: me.documentoTemporal.pedido_codigo || null,
          idtipodoc: me.documentoTemporal.idtipodoc || null,
          ven_p_libros_obsequios:me.documentoTemporal.ven_p_libros_obsequios || null,
          fecha_inicio_escaneo: sesionEscaneo ? sesionEscaneo.fecha_inicio : null,
          observaciones_escaneo: sesionEscaneo ? sesionEscaneo.observaciones : null,
          usuario_escaneo: sesionEscaneo ? sesionEscaneo.nombreUsuario : null,
          escaneoSelected: data.id,
          arrayInformacionDocumento: me.documentoTemporal.arrayInformacionDocumento || [],
          iniciarEmpaque: true
        }
        me.instituciones = []
        me.$emit('documento-asignado', me.institucionAsignada)
        me.$vs.notify({
          text: `Iniciando proceso de empaque con sesión #${data.id}`,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-package'
        })
        me.documentoTemporal = null
      }
    },
    handleSesionSeleccionada(data) {
      let me = this
      console.log('Sesión seleccionada:', data)

      // Guardar el ID de la sesión seleccionada
      me.escaneoSelected = data.id

      // Usar el documento temporal guardado
      if (me.documentoTemporal) {
        const sesionEscaneo = data.sesion

        me.institucionAsignada = {
          idInstitucion: me.documentoTemporal.institucion_id || me.documentoTemporal.id_institucion,
          nombreInstitucion: me.documentoTemporal.nombreInstitucion || me.documentoTemporal.ven_concepto_perseo,
          periodo_id: me.documentoTemporal.periodo_id,
          periodoDescripcion: me.documentoTemporal.periodo,
          ciudadDescripcion: me.documentoTemporal.ciudad,
          EstadoConfiguracion: 0,
          periodo_configurado: null,
          venta_estado: me.documentoTemporal.tip_ven_codigo,
          empresa: me.documentoTemporal.id_empresa,
          documento: me.documentoTemporal.ven_codigo,
          ven_codigo: me.documentoTemporal.ven_codigo,
          id_institucionPedido: me.documentoTemporal.id_institucionPedido,
          pedido_codigo: me.documentoTemporal.pedido_codigo || null,
          idtipodoc: me.documentoTemporal.idtipodoc || null,
          ven_p_libros_obsequios: me.documentoTemporal.ven_p_libros_obsequios || null,
          fecha_inicio_escaneo: sesionEscaneo ? sesionEscaneo.fecha_inicio : null,
          observaciones_escaneo: sesionEscaneo ? sesionEscaneo.observaciones : null,
          usuario_escaneo: sesionEscaneo ? sesionEscaneo.nombreUsuario : null,
          escaneoSelected: me.escaneoSelected,
          arrayInformacionDocumento: me.documentoTemporal.arrayInformacionDocumento || []
        }

        me.instituciones = []

        me.$emit('documento-asignado', me.institucionAsignada)

        me.$vs.notify({
          text: `Documento asignado con sesión #${data.id}`,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        })

        // Limpiar documento temporal
        me.documentoTemporal = null
      }
    },
    limpiarInstitucion() {
      this.institucionAsignada = null
      this.instituciones = []
      this.observacion = '' // Limpiar observación en el hijo
      this.$emit('update:observacion', '') // Emitir al padre para sincronizar
      this.$emit('institucion-limpiada')
    },
    limpiarTodo(mantenerBusqueda = false) {
      if (!mantenerBusqueda) this.busqueda = ''
      this.limpiarInstitucion()
    },
    cambiarPeriodo() {
      let me = this
      if (me.instituciones.length > 0) {
        me.instituciones.map(function (item) {
          item.EstadoConfiguracion = 1
          item.periodo_configurado = me.periodoSelect.idperiodoescolar
          item.periodoNombreConfigurado = me.periodoSelect.periodoescolar
        })
      }
    }
  }
}
</script>

<style scoped>
/* Wrapper principal */
.gestion-bodega-institucion-wrapper {
  width: 100%;
  max-width: 100%;
}

/* Contenedor de búsqueda */
.search-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  width: 100%;
  max-width: 100%;
}

/* Radio buttons simples */
.search-type-radios {
  display: flex;
  gap: 24px;
  align-items: center;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4338ca;
}

.radio-label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.radio-option:hover .radio-label {
  color: #4338ca;
}

.radio-label i {
  font-size: 16px;
  color: #4338ca;
}

.search-input-wrapper {
  margin-top: 16px;
  width: 100%;
}

.search-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label i {
  color: #4338ca;
  font-size: 16px;
}

.input-with-button {
  display: flex;
  gap: 12px;
  align-items: stretch;
  width: 100%;
}

.search-input-field {
  flex: 1;
  min-width: 0;
}

.search-input-field >>> .vs-inputx {
  height: 48px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.search-input-field >>> .vs-inputx:focus {
  border-color: #4338ca;
  box-shadow: 0 2px 6px rgba(67, 56, 202, 0.12);
}

.search-button-inline {
  height: 48px;
  padding: 0 32px;
  font-weight: 600;
  font-size: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(67, 56, 202, 0.15);
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-button-inline:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(67, 56, 202, 0.2);
}

/* Card compacto de institución */
/* Card compacto de institucion */
.institucion-asignada-card-compacta {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #4338ca;
  border-radius: 8px;
  padding: 14px 16px;
  width: 100%;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.institucion-header-compacta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.institucion-info-compacta {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
}

.institucion-icon {
  font-size: 18px;
  color: #16a34a;
  margin-top: 2px;
}

.institucion-label {
  font-size: 10px;
  color: #94a3b8;
  margin: 0 0 2px 0;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
}

.institucion-nombre {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 3px 0;
  line-height: 1.3;
}

.institucion-periodo {
  font-size: 11px;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.periodo-text {
  font-weight: 600;
  color: #4338ca;
}

.delete-button {
  font-size: 12px !important;
}

.info-compacta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-value {
  font-size: 12px;
  color: #334155;
  font-weight: 600;
}

.text-muted {
  color: #94a3b8;
  font-style: italic;
  font-size: 12px;
  font-weight: 400;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.status-dot-small {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
}

.status-chip.success          { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.status-chip.success .status-dot-small { background: #16a34a; }
.status-chip.primary          { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.status-chip.primary .status-dot-small { background: #3b82f6; }
.status-chip.warning          { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.status-chip.warning .status-dot-small { background: #f59e0b; }
.status-chip.info-perseo      { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.status-chip.info-perseo .status-dot-small { background: #3b82f6; }
.status-chip.danger-perseo    { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
.status-chip.danger-perseo .status-dot-small { background: #ef4444; }
.status-chip.escaneo-usuario  { background: #f0fdfa; color: #0f766e; border: 1px solid #5eead4; }
.status-chip.escaneo-usuario .status-dot-small { background: #14b8a6; }
.status-chip.escaneo-fecha    { background: #f5f3ff; color: #6d28d9; border: 1px solid #c4b5fd; }
.status-chip.escaneo-fecha .status-dot-small { background: #8b5cf6; }

.observacion-escaneo-text {
  background: #f8fafc;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: 500;
  font-size: 11px;
  border: 1px solid #e2e8f0;
  display: inline-block;
  color: #475569;
  font-style: italic;
}

.documento-badge {
  background: #eef2ff;
  padding: 3px 8px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 11px;
  border: 1px solid #c7d2fe;
  display: inline-block;
  color: #4338ca;
}

/* Comentario */
.comentario-container-simple {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  width: 100%;
}

.comentario-container-simple:hover {
  border-color: #7c8db5;
  box-shadow: 0 3px 10px rgba(124, 141, 181, 0.12);
}

.comentario-label-simple {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.comentario-label-simple i {
  color: #7c8db5;
  font-size: 13px;
}

.comentario-input-simple {
  width: 100%;
}

.comentario-input-simple >>> .vs-inputx {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  font-size: 13px;
}

.comentario-input-simple >>> .vs-inputx:focus {
  border-color: #7c8db5;
  box-shadow: 0 0 0 3px rgba(124, 141, 181, 0.08);
}

/* Responsive */
@media (max-width: 768px) {
  .search-type-radios {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-container {
    padding: 16px;
  }

  .input-with-button {
    flex-direction: column;
    gap: 12px;
  }

  .search-input-field {
    width: 100%;
  }

  .search-input-field >>> .vs-inputx {
    width: 100%;
  }

  .search-button-inline {
    width: 100%;
    justify-content: center;
    padding: 0 24px;
  }

  .info-compacta-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .institucion-header-compacta {
    flex-direction: column;
    align-items: flex-start;
  }

  .delete-button {
    width: 100%;
  }
}

/* Asegurar que vs-col ocupe 100% */
.gestion-bodega-institucion-wrapper >>> .vs-col {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
