<template>
  <div class="flex flex-wrap justify-center gap-4 p-4">
    <!-- Total PreFacturas y Notas -->
    <TotalCard
      v-if="totalFacturas !== null && totalNotas !== null"
      :icon="'https://cdn-icons-png.flaticon.com/512/9582/9582985.png'"
      title="Total PreFact. y Notas"
      :value="totalFacturas + totalNotas"
      color="purple"
    />

    <!-- Total Abonos -->
    <TotalCard
      v-if="abonoFacturas !== null && abonoNotas !== null"
      :icon="'https://cdn-icons-png.flaticon.com/512/9582/9582990.png'"
      title="Total Abonos"
      :value="abonoFacturas + abonoNotas"
      color="orange"
    />

    <!-- Total Devoluciones -->
    <TotalCard
      v-if="devoluciones_all && devoluciones_all.length > 0"
      :icon="'https://cdn-icons-png.flaticon.com/512/9582/9582998.png'"
      title="Total Devoluciones"
      :value="totalDevolucionesFacturas + totalDevolucionesNotas"
      color="blue"
    />

    <!-- Total Devoluciones sin Empresa -->
    <TotalCard
      v-if="datosDevolucionesSinEmpresa && datosDevolucionesSinEmpresa.length > 0"
      :icon="'https://cdn-icons-png.flaticon.com/512/5427/5427430.png'"
      title="Total Dev. Sin Empresa"
      :value="totalDevolucionesSinEmpresa"
      color="red"
    />
  </div>
</template>

<script>
export default {
  name: 'TotalCards',
  components: {
    TotalCard: {
      props: {
        icon: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          required: true,
          default: 0,
        },
        color: {
          type: String,
          required: true,
        },
      },
      filters: {
        filtrarDecimal(value) {
          // Aseguramos que el valor sea numérico antes de formatear
          if (!isFinite(value) || value === null || value === undefined) {
            return '0.00';
          }
          return Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
      },
      template: `
        <div class="text-center m-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/5">
          <img :src="icon" width="70" :alt="'Ícono de ' + title" class="mx-auto" />
          <span :class="'block mt-2 text-' + color">{{ title }}</span>
          <h2 :class="'font-bold mt-1 text-' + color">$ {{ value | filtrarDecimal }}</h2>
        </div>
      `,
    },
  },
  props: {
    totalFacturas: {
      type: Number,
      default: 0,
    },
    totalNotas: {
      type: Number,
      default: 0,
    },
    abonoFacturas: {
      type: Number,
      default: 0,
    },
    abonoNotas: {
      type: Number,
      default: 0,
    },
    totalDevolucionesFacturas: {
      type: Number,
      default: 0,
    },
    totalDevolucionesNotas: {
      type: Number,
      default: 0,
    },
    totalDevolucionesSinEmpresa: {
      type: Number,
      default: 0,
    },
    devoluciones_all: {
      type: Array,
      default: () => [],
    },
    datosDevolucionesSinEmpresa: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    // Validar que las props numéricas no sean undefined o null
    this.validateProps();
  },
  methods: {
    validateProps() {
      // Asegurar que las props numéricas tengan valores válidos
      ['totalFacturas', 'totalNotas', 'abonoFacturas', 'abonoNotas', 'totalDevolucionesFacturas', 'totalDevolucionesNotas', 'totalDevolucionesSinEmpresa'].forEach(prop => {
        if (this[prop] === null || this[prop] === undefined) {
          this.$set(this, prop, 0);
        }
      });
    },
  },
};
</script>

<style scoped>
/* Asegura que las tarjetas tengan un tamaño mínimo consistente */
.text-center {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease-in-out;
}

/* Hover para un efecto visual */
.text-center:hover {
  transform: scale(1.05);
}

/* Estilo para los textos de título y valor */
.text-purple {
  color: #6b21a8; /* Color púrpura */
}
.text-orange {
  color: #f97316; /* Color naranja */
}
.text-blue {
  color: #3b82f6; /* Color azul */
}
.text-red {
  color: #ef4444; /* Color rojo */
}

/* Responsive: Ajusta el padding en pantallas pequeñas */
@media (max-width: 640px) {
  .text-center {
    min-height: 120px;
  }
}
</style>