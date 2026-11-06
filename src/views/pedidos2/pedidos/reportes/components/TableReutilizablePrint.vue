<template>
  <div>
    <p style="font-weight: bold; text-align: center;margin-top: 10px;">{{ title }}</p>
    <br>
    <!-- <p style="text-align: center;">Total registros: {{ tableData.length }}</p> -->

    <table style="width: 100%; border-collapse: collapse; border: none;" border="1">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" style="padding: 5px; text-align: left;">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <td v-for="(key, colIndex) in fieldKeys" :key="colIndex" style="padding: 5px;">
            {{ row[key] }}
          </td>
        </tr>

        <!-- Fila con Subtotal y Total en la columna Descuento -->
        <tr style="font-weight: bold; border: transparent;">
          <td></td> <!-- Cantidad -->
          <td>

          </td> <!-- Descuento -->
          <td></td> <!-- Precio -->
          <td></td> <!-- Subtotal -->
          <td></td> <!-- Total -->
          <td></td> <!-- Total -->
          <td></td> <!-- Total -->
          <td>
            Subtotal: {{ tableData.reduce((acc, el) => acc + Number(el.subtotal), 0).toFixed(2) }}
          </td> <!-- Empresa -->
        </tr>
         <tr style="font-weight: bold; border: transparent;">
          <td></td> <!-- Cantidad -->
          <td>

          </td> <!-- Descuento -->
          <td></td> <!-- Precio -->
          <td></td> <!-- Subtotal -->
          <td></td> <!-- Total -->
          <td></td> <!-- Total -->
          <td></td> <!-- Total -->
          <td>
            Total: {{ tableData.reduce((acc, el) => acc + Number(el.total), 0).toFixed(2) }}
          </td> <!-- Empresa -->
        </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'TableReutilizablePrint',
  props: {
    title: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      required: true
    },
    fieldKeys: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  // ...existing code...
};
</script>
