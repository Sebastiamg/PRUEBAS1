<template>
  <div>
    <div>
      <!-- Contenedor para el código de barras -->
      <svg :id="barcodeId"></svg>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props:{
    //obligatrio y unico
    barcodeId: {
      type: String,
      required: true
    },
    barcodeValue: {
      type: String,
      default: ""
    },
    format: {
      type: String,
      default: "CODE128"
    },
    width: {
      type: Number,
      default: 0.8
    },
    height: {
      type: Number,
      default: 15
    },
    displayValue: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // Observa cambios en el valor del código de barras y lo actualiza
    barcodeValue(newValue) {
      this.generateBarcode(newValue);
    },
  },
  mounted() {
    this.generateBarcode(this.barcodeValue); // Generar el código de barras al montar el componente
  },
  methods: {
    generateBarcode(value) {
      if (typeof JsBarcode !== "undefined") {
        JsBarcode(`#${this.barcodeId}`, value, {
          format: this.format, // Formato del código de barras
          width: this.width,          // Ancho de las barras
          height: this.height,        // Altura del código de barras
          displayValue: this.displayValue // Mostrar el texto debajo del código de barras
        });
      } else {
        console.error("JsBarcode no está cargado. Asegúrate de incluirlo en index.html.");
      }
    },
  },
};
</script>
