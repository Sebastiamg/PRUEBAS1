<template>
  <div>
    <div class="info-item">
      <span class="info-label">Pedido#:</span>
      <span class="info-value">{{ ObjectSelected.id_pedido }}</span>
    </div>
    <!-- Menú horizontal -->
    <div class="tabs">
      <div
        v-for="item in menu"
        :key="item"
        class="tab"
        :class="{ active: selected === item }"
        @click="selected = item"
      >
        {{ item }}
      </div>
    </div>

    <!-- Contenido dinámico según tab seleccionado -->
    <GuiasResumenFacturador
      v-if="selected === 'Resumen'"
      :ObjectSelected="ObjectSelected"
      :mixinIdInicioFormatoNewData="mixinIdInicioFormatoNewData"
    />

    <GuiasDocumentosVenta
      v-else-if="selected === 'Documentos de venta'"
      :ObjectSelected="ObjectSelected"
      :mixinIdInicioFormatoNewData="mixinIdInicioFormatoNewData"
    />

    <div v-else class="contenido">
      Estás en: <strong>{{ selected }}</strong>
    </div>

  </div>
</template>

<script>
import GuiasResumenFacturador from './GuiasResumenFacturador.vue'
import GuiasDocumentosVenta from './GuiasDocumentosVenta.vue'

export default {
  components: {
    GuiasResumenFacturador,
    GuiasDocumentosVenta
  },
  data() {
    return {
      selected: "Resumen",
      menu: [
        "Resumen",
        "Documentos de venta",
      ]
    }
  },
  props: {
    id_empresa: {
      type: [Number, String],
      default: null
    },
    ObjectSelected: {
      type: Object,
      default: () => ({})
    },
    mixinIdInicioFormatoNewData: {
      type: [Number, String],
      default: null
    },
    initialTab: {
      type: String,
      default: 'Resumen'
    }
  },
  mounted() {
    if (this.initialTab) {
      this.selected = this.initialTab;
    }
  },
}
</script>

<style scoped>

.periodo {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  color: #27ae60;
}

.periodo span {
  font-weight: bold;
}

/* Contenedor tabs */
.tabs {
  display: flex;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;
}

/* Tab individual */
.tab {
  padding: 12px 18px;
  cursor: pointer;
  font-size: 14px;
  color: #777;
  border-top: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  background: #ececec;
}

/* Activo */
.tab.active {
  border-top: 3px solid #ff5c00; /* línea arriba */
  background: #dcdcff;           /* fondo suave */
  color: #333;
  font-weight: 500;
}

.contenido {
  padding: 20px;
}

</style>
