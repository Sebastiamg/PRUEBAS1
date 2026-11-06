<template>
  <div class="resumen-pendientes mt-4">

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- BARRA DE FILTROS GLOBALES                               -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <vx-card class="mb-4 filtros-card">
      <div class="filtros-header mb-3">
        <h3 class="titulo-seccion">
          <i class="fas fa-chart-bar"></i> Resumen de Pendientes por Contrato
        </h3>
        <div class="chips-resumen">
          <vs-chip color="primary" class="chip-stat">
            <b>{{ contratosFiltrados.length }}</b>&nbsp;contratos
          </vs-chip>
          <vs-chip :color="totalPendienteGeneral.cantidad > 0 ? 'warning' : 'success'" class="chip-stat">
            Pendiente: <b>&nbsp;{{ totalPendienteGeneral.cantidad }}</b>&nbsp;uds
          </vs-chip>
          <vs-chip :color="totalPendienteGeneral.valor > 0 ? 'danger' : 'success'" class="chip-stat">
            Valor: <b>&nbsp;${{ totalPendienteGeneral.valor }}</b>
          </vs-chip>
          <vs-button
            color="primary"
            type="flat"
            icon="refresh"
            :disabled="loading"
            @click="cargarResumen"
            title="Recargar"
          />
        </div>
      </div>

      <div class="filtros-row">
        <!-- Búsqueda -->
        <div class="filtro-item filtro-busqueda">
          <vs-input
            v-model="busqueda"
            placeholder="Buscar institución, contrato o código libro..."
            class="w-full search-input"
            icon="icon-search"
            icon-pack="feather"
          />
        </div>

        <!-- Filtro de estado para VENDIDOS con select nativo para evitar bug de Vuesax -->
        <div class="filtro-item">
          <select v-model="filtroPendiente" class="native-select">
            <option value="todos">🟢 Todos</option>
            <option value="con">⭐ Con ventas registradas</option>
            <option value="sin">⭕ Sin ventas registradas</option>
          </select>
        </div>

        <!-- Ordenar con select nativo -->
        <div class="filtro-item">
          <select v-model="ordenarPor" class="native-select">
            <option value="vendido_desc">Mayor vendido primero</option>
            <option value="vendido_asc">Menor vendido primero</option>
            <option value="institucion_asc">Institución A→Z</option>
            <option value="contrato_asc">Contrato A→Z</option>
          </select>
        </div>

        <!-- Expandir/Colapsar todo -->
        <!-- <div class="filtro-item">
          <vs-button size="small" color="primary" type="border" @click="expandirTodo">
            <i class="fas fa-expand-alt mr-1"></i> Expandir todo
          </vs-button>
          <vs-button size="small" color="dark" type="border" class="ml-2" @click="colapsarTodo">
            <i class="fas fa-compress-alt mr-1"></i> Colapsar todo
          </vs-button>
        </div> -->
      </div>
    </vx-card>

    <!-- LOADING GLOBAL (clásico) -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p class="text-gray-500 mt-3 text-center">Cargando contratos del período...</p>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- SIN DATOS                                              -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <vx-card v-else-if="!loading && contratos.length === 0" class="text-center py-10">
      <i class="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
      <h3 class="text-gray-500">No hay contratos pendientes en este período</h3>
      <p class="text-gray-400 mt-2">Todos los contratos tienen su estado de pago registrado.</p>
    </vx-card>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- SIN RESULTADOS DEL FILTRO                              -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <vx-card v-else-if="!loading && contratos.length > 0 && contratosFiltrados.length === 0" class="text-center py-8">
      <i class="fas fa-filter text-4xl text-gray-300 mb-3"></i>
      <h3 class="text-gray-500">Sin resultados</h3>
      <p class="text-gray-400 mt-1">Intenta ajustar los filtros de búsqueda.</p>
    </vx-card>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- CARDS DE CONTRATOS                                      -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-else>
      <div
        v-for="(contrato, idx) in contratosFiltrados"
        :key="contrato.contrato_generado"
        :ref="'card_' + contrato.contrato_generado"
        class="contrato-card mb-4"
        :class="{ 'contrato-con-pendiente': contrato.totales.pendiente_cantidad > 0, 'contrato-completo': contrato.totales.pendiente_cantidad <= 0 }"
      >
        <!-- HEADER DEL CONTRATO -->
        <div class="contrato-header" @click="toggleExpandir(contrato.contrato_generado)">
          <!-- Indicador de estado -->
          <div class="estado-indicator" :class="contrato.totales.pendiente_cantidad > 0 ? 'indicador-pendiente' : 'indicador-completo'"></div>

          <div class="header-info">
            <!-- Nombre institución o Totalizado -->
            <div class="institucion-nombre" :class="{ 'totalizado-nombre-principal': contrato.es_totalizado }">
              <span v-if="contrato.es_totalizado" class="totalizado-icon"><i class="fas fa-layer-group"></i></span>
              {{ contrato.es_totalizado && contrato.nombre_totalizado 
                ? contrato.nombre_totalizado 
                : (contrato.nombreInstitucion || 'Institución #' + contrato.id_institucion) }}
            </div>

            <div class="header-badges">
              <!-- Código contrato -->
              <span class="badge-contrato">
                <i class="fas fa-file-contract mr-1"></i>{{ contrato.contrato_generado }}
              </span>
              <span v-if="contrato.es_totalizado" class="badge-totalizado" :title="(contrato.contratos_origen && Array.isArray(contrato.contratos_origen)) ? contrato.contratos_origen.join(', ') : ''">
                <i class="fas fa-layer-group mr-1"></i>Totalizado ({{ (contrato.contratos_origen && Array.isArray(contrato.contratos_origen)) ? contrato.contratos_origen.length : 0 }})
              </span>
              <span v-if="contrato.es_totalizado && contrato.nombre_totalizado" class="badge-totalizado-nombre" :title="contrato.nombre_totalizado">
                <i class="fas fa-tag mr-1"></i>{{ contrato.nombre_totalizado }}
              </span>
              <!-- Tipo venta -->
              <span :class="contrato.tipo_venta == 1 ? 'badge-directa' : 'badge-lista'">
                {{ contrato.tipo_venta == 1 ? 'Venta Directa' : 'Por Lista' }}
              </span>
              <!-- N° libros -->
              <span class="badge-info">
                <i class="fas fa-book mr-1"></i>{{ contrato.libros.length }} libro(s)
              </span>
              <!-- Botón Ver en Gestión -->
              <button class="badge-gestion" @click.stop="irAGestion(contrato.contrato_generado, contrato)" title="Consultar en Gestión">
                <i class="fas fa-external-link-alt mr-1"></i> Ver en Gestión
              </button>
            </div>
          </div>

          <!-- RESUMEN NUMÉRICO -->
          <div class="header-totales">
            <div class="total-item">
              <span class="total-label">CONTRATO</span>
              <span class="total-cantidad-principal text-primary">{{ contrato.totales.contrato_cantidad }} uds</span>
              <span class="total-monto-secundario text-primary">${{ contrato.totales.contrato_total }}</span>
            </div>
            <div class="total-divider"></div>
            <div class="total-item">
              <span class="total-label" style="color:#d97706">VENDIDO</span>
              <span class="total-cantidad-principal" style="color:#d97706">{{ contrato.totales.venta_cantidad }} uds</span>
              <span class="total-monto-secundario" style="color:#d97706">${{ contrato.totales.venta_total }}</span>
            </div>
            <div class="total-divider"></div>
            <div class="total-item">
              <span class="total-label" :style="contrato.totales.pendiente_cantidad > 0 ? 'color:#dc2626' : 'color:#059669'">PENDIENTE</span>
              <span class="total-cantidad-principal font-bold" :style="contrato.totales.pendiente_cantidad > 0 ? 'color:#dc2626' : 'color:#059669'">
                {{ contrato.totales.pendiente_cantidad }} uds
              </span>
              <span class="total-monto-secundario font-bold" :style="contrato.totales.pendiente_cantidad > 0 ? 'color:#dc2626' : 'color:#059669'">
                ${{ contrato.totales.pendiente_valor }}
              </span>
            </div>
          </div>

          <!-- Botón expand -->
          <div class="expand-btn">
            <i :class="expandidos.includes(contrato.contrato_generado) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </div>
        </div>

        <!-- CUERPO EXPANDIBLE: TABLA DE LIBROS (solo renderiza si está visible en viewport) -->
        <transition name="expand">
          <div v-if="expandidos.includes(contrato.contrato_generado) && visibles[contrato.contrato_generado]" class="contrato-body">

            <!-- SECCIÓN DE INSTITUCIONES (si es totalizado) -->
            <div v-if="contrato.es_totalizado && contrato.contratos_origen && Array.isArray(contrato.contratos_origen) && contrato.contratos_origen.length > 0" class="instituciones-listado mb-4">
              <div class="instituciones-header">
                <i class="fas fa-building mr-2"></i>
                <strong>Instituciones incluidas ({{ contrato.contratos_origen.length }})</strong>
              </div>
              <div class="instituciones-content">
                <div v-for="(contrato_origen, idx) in contrato.contratos_origen" :key="idx" class="institucion-item">
                  <span class="institucion-badge">{{ idx + 1 }}</span>
                  <span class="institucion-text">{{ contrato_origen }}</span>
                </div>
              </div>
            </div>

            <!-- Barra de totales compacta inline -->
            <div v-if="contrato.libros.length > 0" class="totales-barra mb-3">
              <div class="totales-barra-inner">
                <div class="tb-seccion">
                  <span class="tb-tag tb-tag-contrato">CONTRATO</span>
                  <span class="tb-dato tb-dato-principal">Cant: <b>{{ contrato.totales.contrato_cantidad }}</b></span>
                  <span class="tb-dato">Subt: <b>${{ contrato.totales.contrato_subtotal }}</b></span>
                  <span class="tb-dato tb-dato-total">Total: <b>${{ contrato.totales.contrato_total }}</b></span>
                </div>
                <div class="tb-divisor"></div>
                <div class="tb-seccion">
                  <span class="tb-tag tb-tag-venta">VENTA</span>
                  <span class="tb-dato tb-dato-principal">Cant: <b>{{ contrato.totales.venta_cantidad }}</b></span>
                  <span class="tb-dato">Subt: <b>${{ contrato.totales.venta_subtotal }}</b></span>
                  <span class="tb-dato tb-dato-total">Total: <b>${{ contrato.totales.venta_total }}</b></span>
                </div>
                <div class="tb-divisor"></div>
                <div class="tb-seccion">
                  <span class="tb-tag tb-tag-pendiente">PENDIENTE</span>
                  <span class="tb-dato tb-dato-principal">Cant: <b>{{ contrato.totales.pendiente_cantidad }}</b></span>
                  <span class="tb-dato tb-dato-total">Valor: <b>${{ contrato.totales.pendiente_valor }}</b></span>
                </div>
              </div>
            </div>

            <!-- Tabla de libros (idéntica a listado_ventas_new.vue) -->
            <vs-table
              v-if="getLibrosFiltrados(contrato).length > 0"
              stripe
              pagination
              :max-items="10"
              search
              :data="getLibrosFiltrados(contrato)"
              class="tabla-libros"
            >
              <template slot="header">
                <div class="flex items-center gap-2">
                  <vs-chip color="success">{{ getLibrosFiltrados(contrato).length }} libro(s)</vs-chip>
                  <small class="text-gray-400" v-if="getLibrosFiltrados(contrato).length > 10">(Mostrando 10 por página para mayor fluidez)</small>
                </div>
              </template>


              <template slot="thead">
                <vs-th sort-key="pro_codigo">Código</vs-th>
                <vs-th sort-key="nombre_libro">Libro</vs-th>
                <!-- CONTRATO -->
                <vs-th sort-key="cantidad">
                  <div class="header-contrato"><div class="contrato-label">CONTRATO</div><div>Cantidad</div></div>
                </vs-th>
                <vs-th sort-key="precio">
                  <div class="header-contrato"><div class="contrato-label">CONTRATO</div><div>Precio Unit.</div></div>
                </vs-th>
                <vs-th sort-key="subtotal">
                  <div class="header-contrato"><div class="contrato-label">CONTRATO</div><div>Subtotal</div></div>
                </vs-th>
                <vs-th sort-key="descuento">
                  <div class="header-contrato"><div class="contrato-label">CONTRATO</div><div>Descuento</div></div>
                </vs-th>
                <vs-th sort-key="total">
                  <div class="header-contrato"><div class="contrato-label">CONTRATO</div><div>Total</div></div>
                </vs-th>
                <!-- VENTA -->
                <vs-th sort-key="cantidad_vendida">
                  <div class="header-venta"><div class="venta-label">VENTA</div><div>Cantidad</div></div>
                </vs-th>
                <vs-th sort-key="descuento_venta">
                  <div class="header-venta"><div class="venta-label">VENTA</div><div>Descuento</div></div>
                </vs-th>
                <vs-th sort-key="subtotal_vendido">
                  <div class="header-venta"><div class="venta-label">VENTA</div><div>Subtotal</div></div>
                </vs-th>
                <vs-th sort-key="total_vendido">
                  <div class="header-venta"><div class="venta-label">VENTA</div><div>Total</div></div>
                </vs-th>
                <!-- PENDIENTE -->
                <vs-th sort-key="pendiente_cantidad">
                  <div class="header-pendiente"><div class="pendiente-label">PENDIENTE</div><div>Cantidad</div></div>
                </vs-th>
                <vs-th sort-key="pendiente_valor">
                  <div class="header-pendiente"><div class="pendiente-label">PENDIENTE</div><div>Valor</div></div>
                </vs-th>
              </template>

              <template slot-scope="{ data }">
                <vs-tr :data="libro" :key="i" v-for="(libro, i) in data">
                  <!-- Código -->
                  <vs-td>
                    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                      <span v-if="libro.esLibroExtra" class="libro-extra-badge"><i class="fas fa-plus"></i> EXTRA</span>
                      <div class="font-mono text-sm font-bold text-primary">{{ libro.pro_codigo }}</div>
                    </div>
                  </vs-td>
                  <!-- Nombre libro -->
                  <vs-td>
                    <div style="max-width:260px;">
                      <p class="font-semibold">{{ libro.nombre_libro }}</p>
                    </div>
                  </vs-td>
                  <!-- CONTRATO: Cantidad -->
                  <vs-td>
                    <vs-chip color="dark" class="text-center">{{ libro.cantidad }}</vs-chip>
                  </vs-td>
                  <!-- CONTRATO: Precio -->
                  <vs-td>
                    <span class="font-semibold text-green-600">${{ parseFloat(libro.precio).toFixed(2) }}</span>
                  </vs-td>
                  <!-- CONTRATO: Subtotal -->
                  <vs-td>
                    <span class="font-semibold text-blue-600">${{ calcularSubtotalLibro(libro) }}</span>
                  </vs-td>
                  <!-- CONTRATO: Descuento -->
                  <vs-td>
                    <vs-chip :color="libro.descuento > 0 ? 'warning' : 'dark'" size="small">{{ libro.descuento }}%</vs-chip>
                  </vs-td>
                  <!-- CONTRATO: Total -->
                  <vs-td>
                    <span class="font-bold text-primary text-lg">${{ calcularTotalLibro(libro) }}</span>
                  </vs-td>
                  <!-- VENTA: Cantidad -->
                  <vs-td>
                    <div v-if="getDetallesVenta(libro).length > 0">
                      <div v-for="(det, di) in getDetallesVenta(libro)" :key="di" class="detalle-row">
                        <span class="cantidad-badge-venta">{{ det.cantidad }}</span>
                        <span v-if="getDetallesVenta(libro).length > 1 && det.descuento > 0" class="descuento-badge-small">{{ det.descuento }}%</span>
                      </div>
                      <div v-if="getDetallesVenta(libro).length > 1" class="total-row">
                        <strong class="cantidad-total-venta">{{ getTotalesVenta(libro).cantidadTotal }}</strong>
                      </div>
                    </div>
                    <span v-else class="cantidad-cero">0</span>
                  </vs-td>
                  <!-- VENTA: Descuento -->
                  <vs-td>
                    <div v-if="getDetallesVenta(libro).length > 0">
                      <div v-for="(det, di) in getDetallesVenta(libro)" :key="di" class="detalle-row">
                        <span :class="det.descuento > 0 ? 'descuento-badge' : 'descuento-cero'">{{ det.descuento }}%</span>
                      </div>
                      <div v-if="getDetallesVenta(libro).length > 1" class="total-row">
                        <small class="variados-label">Variados</small>
                      </div>
                    </div>
                    <span v-else class="descuento-cero">0%</span>
                  </vs-td>
                  <!-- VENTA: Subtotal -->
                  <vs-td>
                    <div v-if="getDetallesVenta(libro).length > 0">
                      <div v-for="(det, di) in getDetallesVenta(libro)" :key="di" class="detalle-row">
                        <span class="monto-detalle monto-venta">${{ det.subtotal }}</span>
                      </div>
                      <div v-if="getDetallesVenta(libro).length > 1" class="total-row">
                        <span class="monto-total monto-total-venta">${{ getTotalesVenta(libro).subtotalTotal }}</span>
                      </div>
                    </div>
                    <span v-else class="font-semibold text-orange-600">$0.00</span>
                  </vs-td>
                  <!-- VENTA: Total -->
                  <vs-td>
                    <div v-if="getDetallesVenta(libro).length > 0">
                      <div v-for="(det, di) in getDetallesVenta(libro)" :key="di" class="detalle-row">
                        <span class="monto-detalle monto-success-venta">${{ det.total }}</span>
                      </div>
                      <div v-if="getDetallesVenta(libro).length > 1" class="total-row">
                        <span class="monto-total monto-total-success-venta">${{ getTotalesVenta(libro).totalTotal }}</span>
                      </div>
                    </div>
                    <span v-else class="font-bold text-danger text-lg">$0.00</span>
                  </vs-td>
                  <!-- PENDIENTE: Cantidad -->
                  <vs-td>
                    <vs-chip
                      :color="libro.pendiente_cantidad > 0 ? 'warning' : 'success'"
                      class="text-center font-bold"
                    >{{ libro.pendiente_cantidad }}</vs-chip>
                  </vs-td>
                  <!-- PENDIENTE: Valor -->
                  <vs-td>
                    <span :class="libro.pendiente_valor > 0 ? 'font-bold text-orange-600 text-lg' : 'font-bold text-green-600 text-lg'">
                      ${{ parseFloat(libro.pendiente_valor).toFixed(2) }}
                    </span>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>

            <div v-else class="text-center py-4 text-gray-400">
              <i class="fas fa-book mr-2"></i> Sin libros para mostrar con los filtros actuales.
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumenPendientes',
  props: {
    periodoSelect: { type: Object, default: () => ({}) },
    pedidos:       { type: Array,  default: () => [] },
    userRoot:      { type: Boolean, default: false },
    userAsesor:    { type: Boolean, default: false },
    groupFacturador: { type: Boolean, default: false },
  },

  data() {
    return {
      loading: false,
      contratos: [],
      expandidos: [],
      visibles: {},
      busqueda: '',
      busquedaDebounced: '',  // Valor retrasado para no recalcular en cada tecla
      _debounceTimer: null,
      filtroPendiente: 'con', // 'todos' | 'con' | 'sin' - Inicia en solo con vendidos
      ordenarPor: 'vendido_desc', // Inicia en mayor vendido primero
      _observer: null,
    };
  },

  mounted() {
    this.cargarResumen();
    this.$nextTick(() => this.initObserver());
  },

  beforeDestroy() {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
  },

  watch: {
    periodoSelect: {
      handler(newVal, oldVal) {
        if (newVal && newVal.idperiodoescolar !== (oldVal && oldVal.idperiodoescolar)) {
          this.contratos = [];
          this.expandidos = [];
          this.cargarResumen();
        }
      },
      deep: true,
    },
    // Debounce: solo actualiza busquedaDebounced 400ms después del último cambio
    busqueda(val) {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        this.busquedaDebounced = val;
        this.$nextTick(() => this.initObserver());
      }, 400);
    },
    filtroPendiente() {
      this.$nextTick(() => this.initObserver());
    },
    ordenarPor() {
      this.$nextTick(() => this.initObserver());
    },
  },

  computed: {
    /** Contratos después de filtros de búsqueda, pendientes y ordenamiento */
    contratosFiltrados() {
      let lista = [...this.contratos];

      // Filtro de 3 estados basado en VENDIDOS
      if (this.filtroPendiente === 'con') {
        lista = lista.filter(c => c.totales.venta_cantidad > 0);
      } else if (this.filtroPendiente === 'sin') {
        lista = lista.filter(c => c.totales.venta_cantidad <= 0);
      }

      // Filtro: búsqueda (usa el valor debounced para no recalcular en cada tecla)
      if (this.busquedaDebounced.trim()) {
        const q = this.busquedaDebounced.toLowerCase().trim();
        lista = lista.filter(c => {
          const matchInst = (c.nombreInstitucion || '').toLowerCase().includes(q);
          const matchContr = (c.contrato_generado || '').toLowerCase().includes(q);
          const matchNombreTotalizado = (c.nombre_totalizado || '').toLowerCase().includes(q);
          const matchContratosOrigen = (c.contratos_origen && Array.isArray(c.contratos_origen))
            ? c.contratos_origen.some(co => (co != null ? String(co) : '').toLowerCase().includes(q))
            : false;
          const matchLibro = (c.libros || []).some(l =>
            l.pro_codigo.toLowerCase().includes(q) ||
            (l.nombre_libro || '').toLowerCase().includes(q)
          );
          return matchInst || matchContr || matchNombreTotalizado || matchContratosOrigen || matchLibro;
        });
      }

      // Ordenar
      lista.sort((a, b) => {
        switch (this.ordenarPor) {
          case 'vendido_desc':
            return (b.totales.venta_cantidad || 0) - (a.totales.venta_cantidad || 0);
          case 'vendido_asc':
            return (a.totales.venta_cantidad || 0) - (b.totales.venta_cantidad || 0);
          case 'institucion_asc':
            return (a.nombreInstitucion || '').localeCompare(b.nombreInstitucion || '');
          case 'contrato_asc':
            return (a.contrato_generado || '').localeCompare(b.contrato_generado || '');
          default:
            return 0;
        }
      });

      return lista;
    },

    /** Totales generales de todos los contratos filtrados */
    totalPendienteGeneral() {
      const lista = this.contratosFiltrados;
      const cantidad = lista.reduce((s, c) => s + (c.totales.pendiente_cantidad || 0), 0);
      const valor    = lista.reduce((s, c) => s + (parseFloat(c.totales.pendiente_valor) || 0), 0);
      return { cantidad, valor: valor.toFixed(2) };
    },
  },

  methods: {
    /** Carga todos los contratos del período con sus libros y ventas */
    async cargarResumen() {
      if (!this.periodoSelect || !this.periodoSelect.idperiodoescolar) return;

      this.loading = true;
      this.contratos = [];
      this.expandidos = [];

      try {
        const response = await this.$http.get(
          this.$server_url + 'Procesar_MetodosGet_ProformaController',
          {
            params: {
              action: 'get_resumen_pendientes_todos_contratos',
              periodoescolar: this.periodoSelect.idperiodoescolar,
            },
          }
        );

        this.contratos = response.data || [];

        // Auto-expandir contratos con pendiente si son pocos
        const conPendiente = this.contratos.filter(c => c.totales.pendiente_cantidad > 0);
        if (conPendiente.length > 0 && conPendiente.length <= 5) {
          this.expandidos = conPendiente.map(c => c.contrato_generado);
        }

        // Iniciar el observer sobre los nuevos cards
        this.$nextTick(() => this.initObserver());
      } catch (error) {
        console.error('Error al cargar resumen de pendientes:', error);
        this.$vs.notify({
          title: 'Error',
          text: 'No se pudo cargar el resumen de pendientes.',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle',
        });
      } finally {
        this.loading = false;
      }
    },

    /** Toggle expandir/colapsar un contrato */
    toggleExpandir(contrato_generado) {
      const idx = this.expandidos.indexOf(contrato_generado);
      if (idx >= 0) {
        this.expandidos.splice(idx, 1);
      } else {
        this.expandidos.push(contrato_generado);
      }
    },

    /** Expandir todo de forma progresiva — el observer controla quién renderiza */
    expandirTodo() {
      // Primero asignamos la lista completa — solo los visibles renderizarán su tabla
      this.expandidos = this.contratosFiltrados.map(c => c.contrato_generado);
      // Luego hacemos scroll suave al top para que el observer empiece desde arriba
      this.$nextTick(() => {
        const el = this.$el;
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.initObserver();
      });
    },

    colapsarTodo() {
      this.expandidos = [];
    },

    /** Registra el IntersectionObserver en todos los cards del DOM */
    initObserver() {
      if (this._observer) this._observer.disconnect();
      // rootMargin amplio para pre-renderizar los cards cercanos al viewport
      this._observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const key = entry.target.dataset.contratoKey;
            if (!key) return;
            if (entry.isIntersecting) {
              // Marcar como visible — Vue renderizará la tabla
              this.$set(this.visibles, key, true);
            }
            // Nota: NO desmontamos al salir del viewport para evitar flicker al hacer scroll
          });
        },
        { rootMargin: '300px 0px', threshold: 0 }
      );
      this.$nextTick(() => {
        this.contratosFiltrados.forEach(c => {
          const refKey = 'card_' + c.contrato_generado;
          const el = this.$refs[refKey];
          // $refs puede retornar array cuando está en v-for
          const elem = Array.isArray(el) ? el[0] : el;
          if (elem) {
            elem.dataset.contratoKey = c.contrato_generado;
            this._observer.observe(elem);
          }
        });
      });
    },

    /**
     * Retorna libros del contrato filtrados para mostrar en la tabla interna.
     * REGLA: Si la búsqueda coincide con institución o contrato → mostrar TODOS los libros.
     * Solo se filtran libros si la búsqueda coincide específicamente con código/nombre de libro.
     */
    getLibrosFiltrados(contrato) {
      const libros = contrato.libros || [];
      const q = this.busquedaDebounced.toLowerCase().trim();
      if (!q) return libros;

      const matchInst  = (contrato.nombreInstitucion  || '').toLowerCase().includes(q);
      const matchContr = (contrato.contrato_generado || '').toLowerCase().includes(q);
      if (matchInst || matchContr) return libros;

      return libros.filter(l =>
        l.pro_codigo.toLowerCase().includes(q) ||
        (l.nombre_libro || '').toLowerCase().includes(q)
      );
    },

    /** Emite evento para que el padre (contenedor) cambie al tab Gestión con el contrato */
    irAGestion(contrato_generado, contrato) {
      // Si no tiene contrato como parámetro directo, buscarlo en la lista
      if (!contrato) {
        contrato = this.contratosFiltrados.find(c => c.contrato_generado === contrato_generado);
      }
      // Enviar objeto con información completa
      const datos = {
        contrato_generado,
        es_totalizado: contrato ? contrato.es_totalizado : false,
        codigo_totalizado: contrato ? contrato.codigo_totalizado : null,
        nombre_totalizado: contrato ? contrato.nombre_totalizado : null
      };
      this.$emit('ir-a-gestion', datos);
    },

    // ═══════════════════════════════════════════════
    // MÉTODOS DE CÁLCULO (idénticos a listado_ventas_new.vue)
    // ═══════════════════════════════════════════════
    calcularSubtotalLibro(libro) {
      const precio   = parseFloat(libro.precio) || 0;
      const cantidad = parseInt(libro.cantidad) || 0;
      return (precio * cantidad).toFixed(2);
    },

    calcularTotalLibro(libro) {
      const subtotal  = parseFloat(this.calcularSubtotalLibro(libro));
      const descuento = parseFloat(libro.descuento) || 0;
      return (subtotal - subtotal * (descuento / 100)).toFixed(2);
    },

    /** Devuelve los detalles de venta (ventas agrupadas por descuento) de un libro */
    getDetallesVenta(libro) {
      const ventas = libro.ventas || [];
      return ventas.map(v => ({
        cantidad: parseInt(v.cantidad_vendida) || 0,
        descuento: parseFloat(v.descuento_venta) || 0,
        subtotal: parseFloat(v.subtotal_vendido || 0).toFixed(2),
        total:    parseFloat(v.total_vendido    || 0).toFixed(2),
      }));
    },

    /** Devuelve los totales sumados de todas las ventas de un libro */
    getTotalesVenta(libro) {
      const ventas = libro.ventas || [];
      if (!ventas.length) {
        return { cantidadTotal: 0, subtotalTotal: '0.00', totalTotal: '0.00' };
      }
      const cantidadTotal = ventas.reduce((s, v) => s + (parseInt(v.cantidad_vendida) || 0), 0);
      const subtotalTotal = ventas.reduce((s, v) => s + (parseFloat(v.subtotal_vendido) || 0), 0);
      const totalTotal    = ventas.reduce((s, v) => s + (parseFloat(v.total_vendido)    || 0), 0);
      return {
        cantidadTotal,
        subtotalTotal: subtotalTotal.toFixed(2),
        totalTotal:    totalTotal.toFixed(2),
      };
    },
  },
};
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   FILTROS
═══════════════════════════════════════════════════ */
.filtros-card {
  background: linear-gradient(135deg, #f8faff 0%, #fff 100%);
  border: 1px solid #e0e7ff;
}

.filtros-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.titulo-seccion {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chips-resumen {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chip-stat {
  font-size: 13px;
}

.filtros-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filtro-item {
  display: flex;
  align-items: center;
}

.filtro-busqueda {
  flex: 1;
  min-width: 260px;
}

.native-select {
  width: 100%;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  font-size: 13px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.native-select:focus {
  border-color: #7367f0;
}

/* LOADING CLASICO */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 5px solid #e2e8f0;
  border-top: 5px solid #6366f1;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Botón Ver en Gestión */
.badge-gestion {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  background: linear-gradient(135deg, #7367f0, #9f93f5);
  color: #fff !important; border: none; border-radius: 20px;
  font-size: 11.5px; font-weight: 600; cursor: pointer;
  transition: all .2s ease; outline: none;
}
.badge-gestion:hover {
  background: linear-gradient(135deg, #5a50d0, #7367f0);
  box-shadow: 0 4px 12px rgba(115,103,240,.4);
  transform: translateY(-1px);
}

/* ═══════════════════════════════════════════════════
   CARDS DE CONTRATO
═══════════════════════════════════════════════════ */

.contrato-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  background: #fff;
}

.contrato-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}

.contrato-con-pendiente {
  border-left: 5px solid #f59e0b;
}

.contrato-completo {
  border-left: 5px solid #10b981;
}

/* HEADER CLICKABLE */
.contrato-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  transition: background 0.15s ease;
}

.contrato-header:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%);
}

/* Indicador de estado */
.estado-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicador-pendiente {
  background-color: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
  animation: pulse-dot 2s ease-in-out infinite;
}

.indicador-completo {
  background-color: #10b981;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.7; }
}

/* Info central */
.header-info {
  flex: 1;
  min-width: 0;
}

.institucion-nombre {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.badge-contrato {
  background: #ede9fe;
  color: #5b21b6;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #c4b5fd;
  white-space: nowrap;
}

.badge-directa {
  background: #d1fae5;
  color: #065f46;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #6ee7b7;
}

.badge-lista {
  background: #dbeafe;
  color: #1e40af;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #93c5fd;
}

.badge-info {
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.badge-totalizado {
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #c7d2fe;
}

.badge-totalizado-nombre {
  background: #ecfeff;
  color: #0f766e;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #99f6e4;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Totales del header */
.header-totales {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.total-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.total-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.total-valor {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
}

.total-monto {
  font-size: 15px;
  font-weight: 800;
}

.total-cantidad-principal {
  font-size: 17px;
  font-weight: 800;
  line-height: 1.1;
}

.total-monto-secundario {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.total-divider {
  width: 1px;
  height: 36px;
  background: #e2e8f0;
}

/* Botón expand */
.expand-btn {
  color: #94a3b8;
  font-size: 14px;
  transition: color 0.2s;
  margin-left: auto;
  flex-shrink: 0;
}

.contrato-header:hover .expand-btn {
  color: #6366f1;
}

/* CUERPO EXPANDIBLE */
.contrato-body {
  padding: 16px 20px 20px;
  background: #ffffff;
}

/* ═══════════════════════════════════════════════════
   NOMBRE PRINCIPAL CUANDO ES TOTALIZADO
═══════════════════════════════════════════════════ */
.institucion-nombre.totalizado-nombre-principal {
  font-size: 18px;
  font-weight: 700;
  color: #0f766e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.totalizado-icon {
  display: inline-flex;
  align-items: center;
  color: #14b8a6;
  font-size: 16px;
}

/* ═══════════════════════════════════════════════════
   LISTADO DE INSTITUCIONES
═══════════════════════════════════════════════════ */
.instituciones-listado {
  background: #f0fdfa;
  border-left: 4px solid #14b8a6;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.instituciones-header {
  font-size: 13px;
  font-weight: 700;
  color: #0f766e;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.instituciones-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 8px;
}

.institucion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccf0ee;
  font-size: 12px;
}

.institucion-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: #14b8a6;
  color: #ffffff;
  font-weight: 700;
  font-size: 11px;
  border-radius: 50%;
  flex-shrink: 0;
}

.institucion-text {
  color: #0f766e;
  font-weight: 600;
  flex: 1;
}

/* Transición expand */
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.25s ease, max-height 0.3s ease;
  overflow: hidden;
  max-height: 2000px;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ═══════════════════════════════════════════════════
   TABLA DE LIBROS (idéntica a listado_ventas_new)
═══════════════════════════════════════════════════ */
.header-contrato, .header-venta, .header-pendiente {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contrato-label {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: bold;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  margin-bottom: 5%;
  border: 1px solid #dee2e6;
  width: 100%;
  text-align: center;
}

.venta-label {
  background-color: #fff4e6;
  color: #d97706;
  font-weight: bold;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  margin-bottom: 5%;
  border: 1px solid #fbbf24;
  width: 100%;
  text-align: center;
}

.pendiente-label {
  background-color: #fef3c7;
  color: #92400e;
  font-weight: bold;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
  margin-bottom: 5%;
  border: 1px solid #f59e0b;
  width: 100%;
  text-align: center;
}

.detalle-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 0;
}

.detalle-row:not(:last-child) {
  border-bottom: 1px dashed #e2e8f0;
}

.total-row {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 2px solid #4a5568;
  text-align: center;
  background-color: #f7fafc;
}

.descuento-badge {
  background-color: #fef3c7;
  color: #92400e;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
}

.descuento-badge-small {
  background-color: #fed7aa;
  color: #9a3412;
  font-size: 9px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 3px;
  display: inline-block;
  margin-left: 4px;
}

.cantidad-badge-venta {
  background-color: #ffedd5;
  color: #9a3412;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 4px;
  display: inline-block;
}

.cantidad-total-venta {
  background-color: #fed7aa;
  color: #9a3412;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
}

.cantidad-cero, .descuento-cero {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
}

.variados-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  font-style: italic;
}

.monto-detalle         { font-size: 13px; font-weight: 600; color: #7c3aed; }
.monto-detalle.monto-venta         { color: #d97706; }
.monto-detalle.monto-success-venta { color: #dc2626; }

.monto-total                        { font-size: 15px; font-weight: 700; color: #5b21b6; }
.monto-total.monto-total-venta      { color: #ea580c; }
.monto-total.monto-total-success-venta { color: #dc2626; font-size: 16px; }

.libro-extra-badge {
  background-color: #fff4e6;
  color: #ea580c;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid #fb923c;
  animation: pulse-extra 2s ease-in-out infinite;
  white-space: nowrap;
}

@keyframes pulse-extra {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(0.98); }
}

/* Barra de totales compacta */
.totales-barra {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 12px;
}

.totales-barra-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tb-seccion {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tb-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.tb-tag-contrato  { background: #f1f3f5; color: #495057;  border: 1px solid #ced4da; }
.tb-tag-venta     { background: #fff4e6; color: #d97706;  border: 1px solid #fbbf24; }
.tb-tag-pendiente { background: #fef3c7; color: #92400e;  border: 1px solid #f59e0b; }

.tb-divisor { width: 1px; height: 24px; background: #e2e8f0; }

.tb-dato { font-size: 11px; color: #64748b; white-space: nowrap; }
.tb-dato b { color: #334155; font-weight: 700; }
.tb-dato-total b { color: #1e293b; font-size: 12px; }
.tb-dato-principal b { font-size: 14px; }
</style>
