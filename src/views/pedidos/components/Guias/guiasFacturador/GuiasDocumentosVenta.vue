<template>
  <div>

    <!-- ═══ PANEL FLOTANTE — fuera de vs-table para no afectar sus columnas ═══ -->
    <transition name="menu-slide">
      <div
        v-if="selectedRow"
        class="menu-flotante"
        :style="menuStyle"
        @click.stop
      >
        <div class="menu-header">
          <span class="menu-titulo">Acciones</span>
          <button class="menu-cerrar" @click="cerrarMenu">✕</button>
        </div>

        <div class="menu-codigo">{{ selectedRow.ven_codigo }}</div>

        <div class="menu-items">

          <!-- PDF -->
          <button
            class="menu-item menu-item--pdf"
            @click="factu = selectedRow; getDocumentos(selectedRow.ven_codigo, selectedRow.id_empresa); cerrarMenu()"
          >
            <span class="menu-item-icono"><i class="feather icon-file-text"></i></span>
            <span class="menu-item-texto">
              <strong>Generar PDF</strong>
              <small>Descargar documento de venta</small>
            </span>
          </button>

          <!--Regresar a no enviado a Perseo-->
          <button
            v-if="selectedRow.estadoPerseo == 1 && selectedRow.est_ven_codigo != 3 &&selectedRow.est_ven_codigo != 1"
            class="menu-item menu-item--warning"
            @click="confirmarRegresarPerseo(selectedRow); cerrarMenu()"
          >
            <span class="menu-item-icono"><i class="feather icon-rotate-ccw"></i></span>
            <span class="menu-item-texto">
              <strong>Regresar a no enviado a PERSEO</strong>
              <small>Regresar este documento a no enviado a PERSEO</small>
            </span>
          </button>

          <!-- Anular -->
          <button
            v-if="selectedRow.estadoPerseo != 1 &&selectedRow.est_ven_codigo != 3 &&selectedRow.est_ven_codigo != 1"
            class="menu-item menu-item--anular"
            @click="popup_anu(selectedRow); cerrarMenu()"
          >
            <span class="menu-item-icono"><i class="feather icon-x-circle"></i></span>
            <span class="menu-item-texto">
              <strong>Anular</strong>
              <small>Anular este documento</small>
            </span>
          </button>

          <!--Enviar a perseo-->

          <button
            v-if="selectedRow.est_ven_codigo != 3 && selectedRow.estadoPerseo != 1 && selectedRow.est_ven_codigo != 1"
            class="menu-item menu-item--perseo"
            @click="abrirConfirmPerseo(selectedRow); cerrarMenu()"
          >
            <span class="menu-item-icono"><i class="fa-solid fa-arrow-right-from-bracket"></i></span>
            <span class="menu-item-texto">
              <strong>Enviar a PERSEO</strong>
              <small>Enviar este documento a PERSEO</small>
            </span>
          </button>

          <!-- Despachar -->
          <button
            v-if="selectedRow.est_ven_codigo == 2 && usuario.id_group == 27"
            class="menu-item menu-item--despachar"
            @click="ObjectSelected = selectedRow; popup_des(selectedRow); cerrarMenu()"
          >
            <span class="menu-item-icono"><i class="feather icon-truck"></i></span>
            <span class="menu-item-texto">
              <strong>Despachar</strong>
              <small>Marcar como despachado</small>
            </span>
          </button>

        </div>
      </div>
    </transition>

    <!-- ═══ POPUP PDF ═══ -->
    <vs-popup
      fullscreen
      :active.sync="popupDocumento"
      v-if="popupDocumento"
      :title="'Documento: ' + factu.ven_codigo"
    >
      <GuiasPrintDocumentoVenta
        v-if="popupDocumento"
        :modulo_despachos="0"
        :objectedDocumentoVenta="factu"
        @estadoCambiado="f_getDocumentos"
      />
    </vs-popup>

    <!-- ═══ POPUP ANULAR DOCUMENTO ═══ -->
    <vs-popup
      class="popup-anular"
      :title="'¿Confirma que desea anular documento de venta Nº: ' + (documentoSeleccionado ? documentoSeleccionado.ven_codigo : '') + '?'"
      :active.sync="popupAnular"
    >
      <div v-if="documentoSeleccionado" class="anular-confirm-body">
        <div class="anular-confirm-icon">
          <i class="feather icon-alert-triangle" style="font-size: 48px; color: #e74c3c;"></i>
        </div>
        <p class="anular-confirm-aviso">
          Esta acción <strong>anulará permanentemente</strong> el documento de venta.<br>
          Por favor, indique el motivo de la anulación.
        </p>
        <p><b>Si no hay documentos activos el pedido se marcará como pendiente</b></p>
        <p style="color: #e74c3c; font-weight: bold; margin-top: 10px;">
          <i class="feather icon-rotate-ccw"></i> El stock será devuelto automáticamente a la plataforma
        </p>
        <div class="anular-form">
          <label class="anular-label"><strong>Comentario (Obligatorio):</strong></label>
          <vs-textarea
            v-model="observacionAnulacion"
            placeholder="Escriba el motivo de la anulación..."
            class="w-full mt-2"
            rows="3"
          />
        </div>
        <div class="anular-confirm-btns">
          <vs-button color="danger" type="filled" @click="f_anular">
            <i class="feather icon-x-circle mr-1"></i> Confirmar Anulación
          </vs-button>
          <vs-button color="#aaa" type="border" @click="popupAnular = false; observacionAnulacion = ''">
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- ═══ POPUP REGRESAR A NO ENVIADO PERSEO ═══ -->
    <vs-popup
      class="popup-regresar-perseo"
      :title="'¿Confirma regresar a no enviado PERSEO el documento Nº: ' + (documentoRegresarPerseo ? documentoRegresarPerseo.ven_codigo : '') + '?'"
      :active.sync="popupRegresarPerseo"
    >
      <div v-if="documentoRegresarPerseo" class="anular-confirm-body">
        <div class="anular-confirm-icon">
          <i class="feather icon-rotate-ccw" style="font-size: 48px; color: #ff9800;"></i>
        </div>
        <p class="anular-confirm-aviso">
          Esta acción <strong>regresará el documento a estado "No enviado a PERSEO"</strong>.<br>
          Por favor, indique el motivo de esta acción.
        </p>
        <div class="anular-form">
          <label class="anular-label"><strong>Observación (Obligatorio):</strong></label>
          <vs-textarea
            v-model="observacionRegresarPerseo"
            placeholder="Escriba el motivo por el cual regresa este documento..."
            class="w-full mt-2"
            rows="3"
          />
        </div>
        <div class="anular-confirm-btns">
          <vs-button color="warning" type="filled" @click="regresarNoEnviadoPerseo">
            <i class="feather icon-rotate-ccw mr-1"></i> Confirmar Regreso
          </vs-button>
          <vs-button color="#aaa" type="border" @click="popupRegresarPerseo = false; observacionRegresarPerseo = ''">
            Cancelar
          </vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- ═══ POPUP CONFIRMAR ENVIAR A PERSEO (Simple - sin validación) ═══ -->
    <vs-popup
      v-if="ifvalidarStockPerseo === 0"
      :title="'¿Enviar a PERSEO: ' + (ventaPerseoSeleccionada ? ventaPerseoSeleccionada.ven_codigo : '') + '?'"
      :active.sync="popupPerseo"
    >
      <div v-if="ventaPerseoSeleccionada" class="perseo-confirm-body">
        <div class="perseo-confirm-icon">
          <i class="fa-solid fa-circle-arrow-right"></i>
        </div>
        <p class="perseo-confirm-aviso">
          Estás a punto de enviar este documento de venta a <strong>PERSEO</strong>.<br>
          Esta acción <strong>no se puede deshacer</strong>.
        </p>
        <div class="perseo-confirm-datos">
          <div class="perseo-dato">
            <span class="perseo-dato-label">Documento:</span>
            <span class="perseo-dato-valor">{{ ventaPerseoSeleccionada.ven_codigo }}</span>
          </div>
          <div class="perseo-dato">
            <span class="perseo-dato-label">Empresa:</span>
            <span class="perseo-dato-valor">{{ ventaPerseoSeleccionada.empresa_descripcion }}</span>
          </div>
          <div class="perseo-dato">
            <span class="perseo-dato-label">Cliente:</span>
            <span class="perseo-dato-valor">{{ ventaPerseoSeleccionada.cliente_nombre }}</span>
          </div>
          <div class="perseo-dato">
            <span class="perseo-dato-label">Valor:</span>
            <span class="perseo-dato-valor">${{ ventaPerseoSeleccionada.ven_valor }}</span>
          </div>
        </div>
        <div class="perseo-confirm-btns">
          <vs-button color="#3b82f6" type="filled" @click="confirmarEnviarPerseo">
            <i class="fa-solid fa-paper-plane mr-1"></i> Confirmar envío
          </vs-button>
          <vs-button color="#aaa" type="border" @click="popupPerseo = false">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>

    <!-- ═══ POPUP ENVIAR A PERSEO (Con validación de stock) ═══ -->
    <vs-popup
      v-if="ifvalidarStockPerseo === 1"
      class="popup-enviar-perseo"
      fullscreen
      title="Enviar Documento a PERSEO"
      :active.sync="popupPerseo"
    >
      <GuiasDocumentosVentaEnviarPerseo
        v-if="popupPerseo && ventaPerseoSeleccionada"
        :ventaSeleccionada="ventaPerseoSeleccionada"
        @confirmar="confirmarEnviarPerseo"
        @cerrar="popupPerseo = false; ventaPerseoSeleccionada = null;"
      />
    </vs-popup>
    <div>
      <vs-chip color="primary">Cantidad: <b>{{ documentosFiltrados.length }} </b></vs-chip>
      <vs-button type="border" style="border-radius: 40%;" color="primary" class="ml-5 mr-4" @click="f_getDocumentos();" icon="refresh" />

      <div class="filtro-perseo-radio ml-4">
        <span class="filtro-label">Filtrar:</span>
        <vs-radio v-model="filtroPerseo" vs-value="todos" class="ml-2">Todos ({{ contadorTodos }})</vs-radio>
        <vs-radio v-model="filtroPerseo" vs-value="no_enviados" class="ml-3">No enviados a PERSEO ({{ contadorNoEnviados }})</vs-radio>
        <vs-radio v-model="filtroPerseo" vs-value="enviados" class="ml-3">Enviados a PERSEO ({{ contadorEnviados }})</vs-radio>
      </div>
    </div>
    <!-- ═══ TABLA ═══ -->
    <vs-table max-items="10" stripe pagination search :data="documentosFiltrados">
      <template slot="header">
          <vs-col vs-type="flex" vs-w="12" class="mt-2 m-3">

          </vs-col>
      </template>
      <template slot="thead">
          <vs-th> Id </vs-th>
          <vs-th> Datos </vs-th>
          <vs-th> Referencia</vs-th>
          <vs-th>Libro</vs-th>
          <vs-th> Estado</vs-th>
          <vs-th> Acciones </vs-th>
      </template>
      <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{ tr.ven_codigo }}<br>
              </vs-td>
              <vs-td>
                  <b>Empresa:</b>
                  <p>{{ tr.empresa_descripcion }}</p>
                  <b>Cliente:</b>
                  <p>{{ tr.cliente_nombre }}</p>
                  <b>Cliente RUC:</b>
                  <p>{{ tr.ruc_cliente }}</p>
              </vs-td>
              <vs-td>
                  <b>Responsable:</b>
                  <p>{{ tr.facturador_nombre }}</p><br>
                  <span><b>Asesor:</b> {{tr.asesor}}</span><br>
                  <b>Fecha creación:</b>
                  <p>{{ tr.ven_fecha }}</p>
              </vs-td>
              <vs-td>
                  <b>Cantidad de ítems:</b>
                  <p>{{ tr.total_items  }}</p>
                  <b>Cantidad de libros:</b>
                  <p>{{ tr.total_libros  }}</p>
                  <b>Valor:</b>
                  <p>${{ tr.ven_valor  }}</p>
                  <b>Porcentaje:</b> {{ tr.ven_desc_por}}%
              </vs-td>
              <vs-td>
                <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #ff0000" v-if="tr.est_ven_codigo === 3">Anulado</div>
                <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #23BF23" v-if="tr.est_ven_codigo === 1">Despachado</div>
                <div v-if="tr.est_ven_codigo === 2">
                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: DarkOrange">Pendiente de despacho</div>
                </div>
                <br>
                <b>Enviado a perseo:</b>
                <p v-if="tr.estadoPerseo == 0">No</p>
                <p v-if="tr.estadoPerseo == 1">Sí</p>
                <div v-if="tr.estadoPerseo == 1">
                    <b>Fecha envío a PERSEO:</b>
                    <p>{{ tr.fecha_envio_perseo }}</p>
                    <b>Pedido perseo:</b>
                    <p>{{ tr.pedido_codigo }}</p>
                </div>
                <div v-if="tr.est_ven_codigo == 3">
                  <div v-if="tr.usuario_anulado">
                    <b>Anulado por:</b>
                    <p>{{ tr.anulador_nombre }}</p>
                  </div>
                  <div v-if="tr.fecha_anulacion">
                      <b>Fecha de anulado:</b>
                      <p>{{ tr.fecha_anulacion }}</p>
                  </div>
                  <div v-if="tr.observacionAnulacion">
                      <b>Observación anulado:</b>
                      <p>{{ tr.observacionAnulacion }}</p>
                  </div>
                </div>
                <div v-if="tr.est_ven_codigo == 1">
                  <div v-if="tr.despachador_nombre">
                    <b>Despachado por:</b>
                    <p>{{ tr.despachador_nombre }}</p>
                  </div>
                  <div v-if="tr.fecha_proceso_despacho">
                      <b>Fecha de despacho:</b>
                      <p>{{ tr.fecha_proceso_despacho }}</p>
                  </div>
                </div>
                <div v-if="tr.user_anula_envio_perseo != null" style="margin-top: 6px; padding: 6px; background: #fff3cd; border-radius: 4px; text-align: left;">
                  <p style="color: #856404; font-weight: bold; font-size: 11px;">⚠ Pedido removido anterior perseo</p>
                  <p style="font-size: 11px;"><b>Por:</b> {{ tr.usuario_anula_perseo }}</p>
                  <p style="font-size: 11px;"><b>Fecha:</b> {{ tr.fecha_anula_envio_perseo }}</p>
                  <p style="font-size: 11px;"><b>Obs:</b> {{ tr.observacion_anula_envio_perseo }}</p>
                </div>
              </vs-td>

              <!-- Acciones: solo el botón disparador, sin ningún panel aquí -->
              <vs-td>
                <button
                  class="menu-trigger-btn"
                  :class="{ active: selectedRow && selectedRow.ven_codigo === tr.ven_codigo }"
                  @click.stop="toggleMenu(tr, $event)"
                  title="Acciones"
                >⋮</button>
              </vs-td>

          </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { mapState } from "vuex";

const GuiasPrintDocumentoVenta = () => import('./GuiasPrintDocumentoVenta.vue');
const GuiasDocumentosVentaEnviarPerseo = () => import('./GuiasDocumentosVentaEnviarPerseo.vue');

export default {
  components: {
    GuiasPrintDocumentoVenta,
    GuiasDocumentosVentaEnviarPerseo,
  },
  data() {
    return {
      arrayDocumentos: [],
      usuario: JSON.parse(localStorage.getItem('usuario')) || {},
      factu: [],
      // menú flotante
      selectedRow: null,
      menuPos:     { top: 0, left: 0 },
      // popup PDF
      popupDocumento:        false,
      DocumentoVenta:        [],
      DocumentoDetalleVenta: [],
      // popup ANULAR
      popupAnular:             false,
      documentoSeleccionado:   null,
      observacionAnulacion:    '',
      // popup REGRESAR PERSEO
      popupRegresarPerseo:        false,
      documentoRegresarPerseo:    null,
      observacionRegresarPerseo:  '',
      // popup PERSEO
      popupPerseo:              false,
      ventaPerseoSeleccionada:  null,
      // Validar stock PERSEO (0 = popup simple, 1 = validar stock)
      ifvalidarStockPerseo:     1,
      // filtro PERSEO
      filtroPerseo: 'todos',
      contadorTodos: 0,
      contadorEnviados: 0,
      contadorNoEnviados: 0,
    };
  },
  computed: {
    ...mapState(['userRoot', 'userAsesor']),
    menuStyle() {
      return {
        position: 'fixed',
        top:      this.menuPos.top  + 'px',
        left:     this.menuPos.left + 'px',
        zIndex:   99999,
      };
    },
    documentosFiltrados() {
      if (this.filtroPerseo === 'enviados') {
        return this.arrayDocumentos.filter(d => d.estadoPerseo == 1);
      } else if (this.filtroPerseo === 'no_enviados') {
        return this.arrayDocumentos.filter(d => d.estadoPerseo != 1);
      }
      return this.arrayDocumentos;
    },
  },
  props: {
    ObjectSelected: {
      type: Object,
      default: () => ({})
    },
    mixinIdInicioFormatoNewData: {
      type: [Number, String],
      default: null
    }
  },
  mounted() {
    this.f_getDocumentos();
    window.addEventListener('keydown', this.onKeydown);
    window.addEventListener('click',   this.onClickFuera);
    window.addEventListener('scroll',  this.onScroll, true);
    window.addEventListener('resize',  this.cerrarMenu);
  },
  watch: {
    arrayDocumentos: {
      handler(newVal) {
        this.actualizarContadores(newVal);
      },
      immediate: true
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('click',   this.onClickFuera);
    window.removeEventListener('scroll',  this.onScroll, true);
    window.removeEventListener('resize',  this.cerrarMenu);
  },
  methods: {

    // ── Menú flotante ──────────────────────────────────────────────
    toggleMenu(row, event) {
      if (this.selectedRow && this.selectedRow.ven_codigo === row.ven_codigo) {
        this.cerrarMenu();
        return;
      }
      const btn  = event.currentTarget;
      const rect = btn.getBoundingClientRect();
      const menuW = 244;
      const menuH = 400; // altura máxima aproximada del menú
      const pad   = 8;
      const vw    = window.innerWidth;
      const vh    = window.innerHeight;
      
      // Calcular posición horizontal
      let left = rect.right - menuW;
      if (left < pad)              left = pad;
      if (left + menuW > vw - pad) left = vw - menuW - pad;
      
      // Calcular posición vertical (arriba o abajo del botón)
      let top;
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow >= menuH || spaceBelow >= spaceAbove) {
        // Hay espacio abajo o más espacio abajo que arriba
        top = rect.bottom + pad;
      } else {
        // Más espacio arriba, posicionar hacia arriba
        top = rect.top - menuH - pad;
        if (top < pad) top = pad; // No salir del viewport
      }
      
      this.menuPos     = { top, left };
      this.selectedRow = row;
    },

    cerrarMenu() {
      this.selectedRow = null;
    },

    onKeydown(e) {
      if (e.key === 'Escape') this.cerrarMenu();
    },

    onClickFuera(e) {
      if (!e.target.closest('.menu-trigger-btn') && !e.target.closest('.menu-flotante')) {
        this.cerrarMenu();
      }
    },

    onScroll(e) {
      // Solo cerrar si el scroll NO es dentro del menú flotante
      if (!e.target.closest('.menu-flotante')) {
        this.cerrarMenu();
      }
    },

    // ── Generar PDF (mismo patrón que DocumentosVenta.vue) ─────────
    getDocumentos(documentos, empresa) {
      let me = this;
      me.$vs.loading();
      me.$http.get(me.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos + '&empresa=' + empresa)
        .then((res) => {
          me.DocumentoVenta = res.data;
          if (me.DocumentoVenta.length > 0) {
            let codigo  = me.DocumentoVenta[0].ven_codigo;
            let empresa = me.DocumentoVenta[0].empresa_id;
            me.getDocumentosDetalles(codigo, empresa);
          } else {
            me.$vs.notify({
              title: 'Error',
              text: 'Documento no encontrado.',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
            });
          }
          me.$vs.loading.close();
        })
        .catch((err) => {
          console.error(err);
          me.$vs.notify({
            title: 'Error',
            text: 'Hubo un problema al cargar el documento.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
          });
          me.$vs.loading.close();
        });
    },

    getDocumentosDetalles(codigo, empresa) {
      let me = this;
      me.$vs.loading();
      me.$http.get(me.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
        .then((res) => {
          me.DocumentoDetalleVenta = res.data;
          if (me.DocumentoDetalleVenta.length > 0) {
            me.popupDocumento = true;
          } else {
            me.$vs.notify({
              title: 'Error',
              text: 'Detalle del documento no encontrado.',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
            });
          }
          me.$vs.loading.close();
        })
        .catch((err) => {
          console.error(err);
          me.$vs.notify({
            title: 'Error',
            text: 'Hubo un problema al cargar el detalle.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
          });
          me.$vs.loading.close();
        });
    },

    // ── Cargar lista de documentos ─────────────────────────────────
    f_getDocumentos() {
      let me = this;
      me.$vs.loading();
      let url = `guias?listadoDocumentoVentaGuias=1&id_pedido=${me.ObjectSelected.id_pedido}`;
      me.$http.get(me.$server_url + url)
        .then(function (res) {
          me.$vs.loading.close();
          me.arrayDocumentos = res.data;
        })
        .catch(function (err) {
          me.$vs.loading.close();
          console.error(err);
          me.$vs.notify({
            text: 'Error al cargar los documentos de venta',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 3000
          });
        });
    },

    actualizarContadores(documentos) {
      if (!documentos || !Array.isArray(documentos)) {
        this.contadorTodos = 0;
        this.contadorEnviados = 0;
        this.contadorNoEnviados = 0;
        return;
      }
      this.contadorTodos = documentos.length;
      this.contadorEnviados = documentos.filter(d => d.estadoPerseo == 1).length;
      this.contadorNoEnviados = documentos.filter(d => d.estadoPerseo != 1).length;
    },

    // ── Anular ─────────────────────────────────────────────────────
    popup_anu(tr) {
      this.documentoSeleccionado = tr;
      this.observacionAnulacion = '';
      this.popupAnular = true;
    },

    f_anular() {
      let me = this;

      // Validar que la observación no esté vacía
      me.observacionAnulacion = me.observacionAnulacion.trim();
      if (me.observacionAnulacion === '') {
        me.$vs.notify({
          title: 'Validación',
          text: 'Debe ingresar un comentario para anular el documento',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 3000
        });
        return;
      }

      let tr = me.documentoSeleccionado;
      if (!tr) return;

      me.$vs.loading();
      me.popupAnular = false;

      me.$http.post(me.$server_url + 'guias', {
        anularDocumentoVenta: 1,
        ven_codigo: tr.ven_codigo,
        id_empresa: tr.id_empresa,
        observacionAnulacion: me.observacionAnulacion,
        id_usuario: me.usuario.idusuario
      })
      .then((res) => {
        me.$vs.loading.close();

        if (res.data && res.data.status === 0) {
          me.$vs.notify({
            title: 'Error',
            text: res.data.message || 'No se pudo anular el documento',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 5000
          });
        } else {
          me.$vs.notify({
            title: '¡Anulado!',
            text: 'Documento anulado correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 4000
          });
          me.f_getDocumentos(); // recargar tabla
        }

        // Limpiar
        me.documentoSeleccionado = null;
        me.observacionAnulacion = '';
      })
      .catch((err) => {
        me.$vs.loading.close();
        console.error(err);
        let msg = (err.response && err.response.data && err.response.data.message)
          ? err.response.data.message
          : 'Error al anular el documento';
        me.$vs.notify({
          title: 'Error',
          text: msg,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 5000
        });

        // Limpiar
        me.documentoSeleccionado = null;
        me.observacionAnulacion = '';
      });
    },

    // ── Regresar a no enviado PERSEO ───────────────────────────────
    confirmarRegresarPerseo(tr) {
      this.documentoRegresarPerseo = tr;
      this.observacionRegresarPerseo = '';
      this.popupRegresarPerseo = true;
    },

    regresarNoEnviadoPerseo() {
      let me = this;

      // Validar que la observación no esté vacía
      me.observacionRegresarPerseo = me.observacionRegresarPerseo.trim();
      if (me.observacionRegresarPerseo === '') {
        me.$vs.notify({
          title: 'Validación',
          text: 'Debe ingresar una observación para regresar el documento',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 3000
        });
        return;
      }

      let tr = me.documentoRegresarPerseo;
      if (!tr) return;

      me.$vs.loading();
      me.popupRegresarPerseo = false;

      me.$http.post(me.$server_url + 'guias', {
        regresar_no_enviado_perseo: 1,
        ven_codigo: tr.ven_codigo,
        id_empresa: tr.id_empresa,
        observacion: me.observacionRegresarPerseo,
        id_usuario: me.usuario.idusuario
      })
      .then((res) => {
        me.$vs.loading.close();

        if (res.data && res.data.status === 1) {
          me.$vs.notify({
            title: '¡Éxito!',
            text: res.data.message || 'Documento regresado a no enviado a PERSEO correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 4000
          });
          me.f_getDocumentos(); // recargar tabla
        } else {
          me.$vs.notify({
            title: 'Error',
            text: res.data.message || 'No se pudo regresar el documento',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 5000
          });
        }

        // Limpiar
        me.documentoRegresarPerseo = null;
        me.observacionRegresarPerseo = '';
      })
      .catch((err) => {
        me.$vs.loading.close();
        console.error(err);
        let msg = (err.response && err.response.data && err.response.data.message)
          ? err.response.data.message
          : 'Error al regresar el documento';
        me.$vs.notify({
          title: 'Error',
          text: msg,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 5000
        });

        // Limpiar
        me.documentoRegresarPerseo = null;
        me.observacionRegresarPerseo = '';
      });
    },

    // ── Despachar ──────────────────────────────────────────────────
    popup_des(tr) {
      this.$emit('despachar', tr);
    },

    // ── Enviar a PERSEO ────────────────────────────────────────────
    abrirConfirmPerseo(tr) {
      this.ventaPerseoSeleccionada = tr;
      this.popupPerseo = true;
    },

    confirmarEnviarPerseo() {
      let me = this;
      let tr = me.ventaPerseoSeleccionada;
      if (!tr) return;

      me.$vs.loading();
      me.$http.post(me.$server_url + 'guias', {
        ven_codigo: tr.ven_codigo,
        id_empresa: tr.id_empresa,
        byGuia:1,
        enviarAPerseo: 1
      })
      .then((res) => {
        me.$vs.loading.close();
        me.popupPerseo = false;
        me.ventaPerseoSeleccionada = null;

        let data = res.data;
        if (data.status === 0 || res.status < 200 || res.status >= 300) {
          me.$vs.notify({
            title: 'Error',
            text: data.message || 'No se pudo enviar a PERSEO',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 5000
          });
        } else {
          me.$vs.notify({
            title: '¡Enviado!',
            text: 'Documento enviado a PERSEO correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 4000
          });
          me.f_getDocumentos(); // recargar tabla
        }
      })
      .catch((err) => {
        me.$vs.loading.close();
        me.popupPerseo = false;
        console.error(err);
        let msg = (err.response && err.response.data && err.response.data.message)
          ? err.response.data.message
          : 'Error al enviar a PERSEO';
        me.$vs.notify({
          title: 'Error',
          text: msg,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 5000
        });
      });
    },

  }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   BOTÓN DISPARADOR  ⋮
═══════════════════════════════════════════════════ */
.menu-trigger-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #dde1e7;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  line-height: 1;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  user-select: none;
  flex-shrink: 0;
}
.menu-trigger-btn:hover,
.menu-trigger-btn.active {
  border-color: #6c63ff;
  background: #f3f1ff;
  box-shadow: 0 2px 10px rgba(108, 99, 255, 0.2);
  color: #6c63ff;
}

/* ═══════════════════════════════════════════════════
   PANEL FLOTANTE  (position:fixed via :style)
═══════════════════════════════════════════════════ */
.menu-flotante {
  width: 244px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10);
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.07);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f0f0f0;
}
.menu-titulo {
  font-weight: 700;
  font-size: 12px;
  color: #1a1a2e;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}
.menu-cerrar {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #999;
  padding: 2px 6px;
  border-radius: 50%;
  transition: background 0.15s, color 0.15s;
}
.menu-cerrar:hover { background: #f0f0f0; color: #333; }

.menu-codigo {
  font-size: 10px;
  color: #888;
  padding: 4px 16px 10px;
  font-family: monospace;
  letter-spacing: 0.5px;
}

.menu-items {
  padding: 4px 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scroll sutil y elegante */
.menu-items::-webkit-scrollbar {
  width: 6px;
}

.menu-items::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0;
}

.menu-items::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
  transition: background 0.2s;
}

.menu-items::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Para Firefox */
.menu-items {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  text-align: left;
  transition: background 0.15s, transform 0.1s;
}
.menu-item:hover  { transform: translateX(2px); }
.menu-item:active { transform: scale(0.98); }

.menu-item-icono {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}
.menu-item-texto {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.menu-item-texto strong { font-size: 13px; font-weight: 600; line-height: 1.2; }
.menu-item-texto small  { font-size: 10.5px; opacity: 0.7; }

/* ═══════════════════════════════════════════════════
   POPUP PERSEO
═══════════════════════════════════════════════════ */
.perseo-confirm-btns {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* PDF — verde */
.menu-item--pdf:hover                   { background: #e8f8f0; }
.menu-item--pdf .menu-item-icono        { background: #e0f5ea; color: #1a8a50; }
.menu-item--pdf .menu-item-texto strong { color: #1a7a45; }
.menu-item--pdf .menu-item-texto small  { color: #2ecc71; }

/* Anular — rojo */
.menu-item--anular:hover                   { background: #fdecea; }
.menu-item--anular .menu-item-icono        { background: #fde8e6; color: #c0392b; }
.menu-item--anular .menu-item-texto strong { color: #b03025; }
.menu-item--anular .menu-item-texto small  { color: #e74c3c; }

/* Despachar — naranja */
.menu-item--despachar:hover                   { background: #fff3e0; }
.menu-item--despachar .menu-item-icono        { background: #ffecd0; color: #d35400; }
.menu-item--despachar .menu-item-texto strong { color: #c0490a; }
.menu-item--despachar .menu-item-texto small  { color: #e67e22; }

/* PERSEO — azul */
.menu-item--perseo:hover                   { background: #eff6ff; }
.menu-item--perseo .menu-item-icono        { background: #dbeafe; color: #0055cc; }
.menu-item--perseo .menu-item-texto strong { color: #0055cc; }
.menu-item--perseo .menu-item-texto small  { color: #3b82f6; }

/* ═══════════════════════════════════════════════════
   TRANSITION: menu-slide  (Vue 2)
═══════════════════════════════════════════════════ */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.menu-slide-enter,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.filtro-perseo-radio {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.filtro-perseo-radio .filtro-label {
  font-weight: 600;
  font-size: 13px;
  color: #555;
}

/* ═══════════════════════════════════════════════════
   POPUP ANULAR - Z-INDEX ALTO
═══════════════════════════════════════════════════ */
.popup-anular >>> .vs-popup {
  z-index: 99999 !important;
}

/* ═══════════════════════════════════════════════════
   POPUP ENVIAR PERSEO CON VALIDACIÓN - Z-INDEX
═══════════════════════════════════════════════════ */
.popup-enviar-perseo >>> .vs-popup {
  z-index: 99998 !important;
}

.popup-enviar-perseo >>> .vs-popup--content {
  max-width: 95%;
}

.anular-confirm-body {
  padding: 20px;
  text-align: center;
}

.anular-confirm-icon {
  margin-bottom: 16px;
}

.anular-confirm-aviso {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 24px;
}

.anular-form {
  text-align: left;
  margin-bottom: 20px;
}

.anular-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.anular-confirm-btns {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}
</style>
