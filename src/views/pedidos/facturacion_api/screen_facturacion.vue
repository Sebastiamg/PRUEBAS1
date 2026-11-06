<template>
    <div>
      <vx-card>
        <vs-tabs>
          <vs-tab label="Cliente">
              <clientesfacturacion />
          </vs-tab>
          <vs-tab label="Cliente - Institución">
              <cli_ins_facturacion />
          </vs-tab>
          <vs-tab label="Venta">
              <ventafacturacion />
          </vs-tab>
          <vs-tab label="Producto">
              <productofacturacion />
          </vs-tab>
          <vs-tab label="Vendedor">
              <vendedorfacturacion />
          </vs-tab>
          <!-- <vs-tab label="Institución">
              <institucionfacturacion />
          </vs-tab> -->
        </vs-tabs>
      </vx-card>
    </div>
  </template>
<script>
import clientesfacturacion from './cliente.vue';
import cli_ins_facturacion from './cliente_institucion.vue';
import ventafacturacion from './venta.vue';
import productofacturacion from './producto.vue';
import vendedorfacturacion from './vendedor.vue';
// import institucionfacturacion from './institucion.vue';


export default {
    data() {
        return {};
    },
    mounted() {},
    methods: {},
    components: {
        clientesfacturacion,
        cli_ins_facturacion,
        ventafacturacion,
        productofacturacion,
        vendedorfacturacion,
        // institucionfacturacion,
    }
}
</script>
