<template>
  <div class="enviar-perseo-container">
    <!-- Mensaje informativo -->
    <vs-alert color="primary" class="mb-4">
      <template #icon>
        <i class="fa-solid fa-circle-info"></i>
      </template>
      <strong>Validación de stock en PERSEO</strong><br>
      Verificando disponibilidad de stock en PERSEO antes de enviar el documento.
    </vs-alert>

    <!-- Información del documento -->
    <div class="documento-info mb-4">
      <h3 class="titulo-seccion">
        <i class="fa-solid fa-file-invoice"></i>
        Documento: {{ ventaSeleccionada.ven_codigo }}
      </h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Empresa:</span>
          <span class="valor">{{ ventaSeleccionada.empresa_descripcion }}</span>
        </div>
        <div class="info-item">
          <span class="label">Cliente:</span>
          <span class="valor">{{ ventaSeleccionada.cliente_nombre }}</span>
        </div>
        <div class="info-item">
          <span class="label">Valor:</span>
          <span class="valor">${{ ventaSeleccionada.ven_valor }}</span>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loadingStock" class="loading-estado">
      <i class="fa-solid fa-spinner fa-spin"></i>
      Consultando stock en PERSEO... ({{ progresoStock.actual }}/{{ progresoStock.total }})
    </div>

    <!-- Alerta de productos sin stock -->
    <vs-alert v-if="!loadingStock && productosSinStock.length > 0" color="danger" class="mb-4">
      <template #icon>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </template>
      <strong>¡Atención!</strong> {{ productosSinStock.length }} producto(s) no tienen stock suficiente en PERSEO.
      No se puede enviar el documento hasta resolver este problema.
    </vs-alert>

    <!-- Alerta de éxito -->
    <vs-alert v-if="!loadingStock && productosSinStock.length === 0 && detalles.length > 0" color="success" class="mb-4">
      <template #icon>
        <i class="fa-solid fa-check-circle"></i>
      </template>
      <strong>¡Stock validado!</strong> Todos los productos tienen stock suficiente en PERSEO.
      Puede proceder con el envío.
    </vs-alert>

    <!-- Tabla de productos -->
    <div class="tabla-container">
      <div class="header-tabla">
        <h3 class="titulo-seccion">
          <i class="fa-solid fa-boxes-stacked"></i>
          Detalle de Productos ({{ detallesFiltrados.length }}/{{ detalles.length }})
        </h3>
        <div v-if="!loadingStock && productosSinStock.length > 0" class="filtro-check">
          <vs-checkbox v-model="mostrarSoloSinStock" color="danger">
            <span class="check-label">
              <i class="fa-solid fa-filter"></i>
              Mostrar solo productos sin stock ({{ productosSinStock.length }})
            </span>
          </vs-checkbox>
        </div>
      </div>

      <vs-table stripe :data="detallesFiltrados">
        <template slot="thead">
          <vs-th>Producto</vs-th>
          <vs-th>Cantidad</vs-th>
          <vs-th>Stock PERSEO</vs-th>
          <vs-th>Estado</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr
            :key="indextr"
            v-for="(tr, indextr) in data"
            :class="{ 'fila-sin-stock': tr.sinStock }"
          >
            <vs-td>
              <div class="producto-info">
                <strong>{{ tr.pro_nombre || 'Sin nombre' }}</strong>
                <small>Código: {{ tr.pro_codigo }}</small>
              </div>
            </vs-td>
            <vs-td>
              <span class="cantidad-badge">{{ tr.cantidad }}</span>
            </vs-td>
            <vs-td>
              <div class="stock-cell">
                <span
                  :class="{
                    'stock-ok':       !tr.sinStock && tr.stockPerseo !== null,
                    'stock-warn':      tr.sinStock && tr.stockPerseo > 0,
                    'stock-empty':     tr.stockPerseo === 0,
                    'stock-loading':   tr.stockPerseo === null
                  }"
                >
                  <i v-if="tr.stockPerseo === null" class="fa-solid fa-spinner fa-spin"></i>
                  <i v-else-if="tr.stockPerseo === 0" class="fa-solid fa-ban"></i>
                  <i v-else-if="tr.sinStock" class="fa-solid fa-triangle-exclamation"></i>
                  <i v-else class="fa-solid fa-check"></i>
                  {{ tr.stockPerseo !== null ? tr.stockPerseo : 'Consultando...' }}
                </span>
              </div>
            </vs-td>
            <vs-td>
              <vs-chip v-if="tr.sinStock && tr.stockPerseo > 0" color="warning" size="small">
                Insuficiente
              </vs-chip>
              <vs-chip v-else-if="tr.stockPerseo === 0" color="danger" size="small">
                Sin stock
              </vs-chip>
              <vs-chip v-else-if="!loadingStock && tr.stockPerseo >= tr.cantidad" color="success" size="small">
                Disponible
              </vs-chip>
              <vs-chip v-else color="#999" size="small">
                Verificando...
              </vs-chip>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>

    <!-- Botones de acción -->
    <div class="acciones-footer">
      <vs-button
        @click="confirmarEnvio"
        color="#3b82f6"
        type="filled"
        size="large"
        :disabled="!puedeEnviar"
        class="btn-enviar"
      >
        <i class="fa-solid fa-paper-plane mr-2"></i>
        {{ puedeEnviar ? 'Confirmar Envío a PERSEO' : 'Envío Bloqueado - Stock Insuficiente' }}
      </vs-button>
      <vs-button
        @click="cerrar"
        color="#aaa"
        type="border"
        size="large"
      >
        Cancelar
      </vs-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ventaSeleccionada: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      detalles: [],
      loadingStock: false,
      progresoStock: {
        actual: 0,
        total: 0
      },
      mostrarSoloSinStock: false
    }
  },
  computed: {
    productosSinStock() {
      return this.detalles.filter(item => item.sinStock === true);
    },
    detallesFiltrados() {
      if (this.mostrarSoloSinStock) {
        return this.detalles.filter(item => item.sinStock === true);
      }
      return this.detalles;
    },
    puedeEnviar() {
      // Solo puede enviar si:
      // 1. No está cargando
      // 2. Hay detalles
      // 3. NO hay productos sin stock
      return !this.loadingStock &&
             this.detalles.length > 0 &&
             this.productosSinStock.length === 0;
    }
  },
  mounted() {
    this.cargarDetalles();
  },
  methods: {
    async cargarDetalles() {
      const me = this;
      me.loadingStock = true;

      try {
        // Cargar detalles del documento
        const response = await me.$http.get(
          `${me.$server_url}guias?getDetalleDocumentoVenta=1&ven_codigo=${me.ventaSeleccionada.ven_codigo}&id_empresa=${me.ventaSeleccionada.id_empresa}`
        );

        if (response.data && Array.isArray(response.data)) {
          me.detalles = response.data.map(item => ({
            ...item,
            stockPerseo: null,
            sinStock: false
          }));

          // Consultar stock en PERSEO
          await me.f_getStockPerseo();
        } else {
          throw new Error('No se pudieron cargar los detalles');
        }
      } catch (error) {
        console.error('Error cargando detalles:', error);
        me.$vs.notify({
          text: 'Error al cargar los detalles del documento',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 3000
        });
        me.loadingStock = false;
      }
    },

    async f_getStockPerseo() {
      const me = this;

      if (me.detalles.length === 0) {
        me.loadingStock = false;
        return;
      }

      // Dividir en lotes de 10
      const BATCH_SIZE = 10;
      const batches = [];
      for (let i = 0; i < me.detalles.length; i += BATCH_SIZE) {
        batches.push(me.detalles.slice(i, i + BATCH_SIZE));
      }

      me.progresoStock.total = batches.length;
      me.progresoStock.actual = 0;

      console.log(`📡 Consultando stock PERSEO: ${me.detalles.length} items en ${batches.length} lotes`);

      try {
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          me.progresoStock.actual = batchIndex + 1;

          // Extraer los códigos de facturación del lote
          const codigosArray = batch.map(item => item.pro_codigo);

          console.log(`📦 Lote ${batchIndex + 1}/${batches.length}:`, codigosArray);

          try {
            // ⚠️ IMPORTANTE: Este endpoint es específico para GUÍAS
            // No usar productos_consulta_x_id para evitar afectar otros módulos
            // Este endpoint sincroniza automáticamente los IDs de PERSEO en BD
            const response = await me.$http.post(
              `${me.$server_url}api/perseo/productos/productos_consulta_x_id_guias`,
              {
                codigos: codigosArray,
                id_empresa: me.ventaSeleccionada.id_empresa
              }
            );

            const productos = response.data.productos || [];

            // Mapear los resultados
            productos.forEach(producto => {
              const itemEncontrado = me.detalles.find(
                item => item.pro_codigo === producto.productocodigo
              );

              if (itemEncontrado) {
                const stock = producto.existenciastotales || 0;
                me.$set(itemEncontrado, 'stockPerseo', stock);
                // sinStock = true si el stock es menor a la cantidad del detalle
                const sinStock = stock < itemEncontrado.cantidad;
                me.$set(itemEncontrado, 'sinStock', sinStock);
                console.log(`✅ ${producto.productocodigo}: stock=${stock}, necesita=${itemEncontrado.cantidad}, sinStock=${sinStock}`);
              }
            });

            // Marcar con 0 los productos no encontrados
            batch.forEach(item => {
              const itemEncontrado = me.detalles.find(i => i.pro_codigo === item.pro_codigo);
              if (itemEncontrado && (itemEncontrado.stockPerseo === null || itemEncontrado.stockPerseo === undefined)) {
                me.$set(itemEncontrado, 'stockPerseo', 0);
                me.$set(itemEncontrado, 'sinStock', true);
                console.log(`⚠️ ${item.pro_codigo}: No encontrado en PERSEO - stock=0`);
              }
            });

          } catch (error) {
            console.error(`❌ Error en lote ${batchIndex + 1}:`, error);
            // Marcar con error
            batch.forEach(item => {
              const itemEncontrado = me.detalles.find(i => i.pro_codigo === item.pro_codigo);
              if (itemEncontrado && (itemEncontrado.stockPerseo === null || itemEncontrado.stockPerseo === undefined)) {
                me.$set(itemEncontrado, 'stockPerseo', 'Error: No se pudo establecer conexión con PERSEO. Vuelva a intentarlo');
                me.$set(itemEncontrado, 'sinStock', true);
              }
            });
          }

          // Pequeña pausa entre lotes
          if (batchIndex < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        me.$vs.notify({
          text: `Stock de PERSEO verificado para ${me.detalles.length} producto(s)`,
          color: 'success',
          position: 'top-right',
          time: 3000
        });

      } catch (error) {
        console.error('❌ Error general consultando stock PERSEO:', error);
        me.$vs.notify({
          text: 'Error al consultar stock en PERSEO',
          color: 'danger',
          position: 'top-right',
          time: 3000
        });
      } finally {
        me.loadingStock = false;
      }
    },

    confirmarEnvio() {
      this.$emit('confirmar');
    },

    cerrar() {
      this.$emit('cerrar');
    }
  }
}
</script>

<style scoped>
.enviar-perseo-container {
  padding: 20px;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 15px;
}

.titulo-seccion i {
  color: #3b82f6;
}

/* Información del documento */
.documento-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .valor {
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
}

/* Estado de carga */
.loading-estado {
  text-align: center;
  padding: 40px 20px;
  background: #f0f9ff;
  border-radius: 12px;
  color: #0369a1;
  font-size: 16px;
  font-weight: 500;
}

.loading-estado i {
  margin-right: 10px;
  font-size: 20px;
}

/* Tabla */
.tabla-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.header-tabla {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.header-tabla .titulo-seccion {
  margin-bottom: 0;
}

.filtro-check {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #991b1b;
}

.check-label i {
  font-size: 13px;
}

.fila-sin-stock {
  background-color: rgba(239, 68, 68, 0.05) !important;
}

.fila-sin-stock:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

.producto-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.producto-info strong {
  font-size: 14px;
  color: #1f2937;
}

.producto-info small {
  font-size: 12px;
  color: #6b7280;
}

.cantidad-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}

/* Stock cell */
.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stock-ok {
  color: #10b981;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-warn {
  color: #f59e0b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-empty {
  color: #ef4444;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stock-loading {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Botones */
.acciones-footer {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 20px 0;
  border-top: 2px solid #e5e7eb;
  margin-top: 20px;
}

.btn-enviar {
  min-width: 280px;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.btn-enviar:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(59, 130, 246, 0.4);
}

.btn-enviar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .header-tabla {
    flex-direction: column;
    align-items: flex-start;
  }

  .filtro-check {
    width: 100%;
  }

  .acciones-footer {
    flex-direction: column;
  }

  .btn-enviar {
    width: 100%;
  }
}
</style>
