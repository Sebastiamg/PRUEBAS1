<template>
    <div>
        <p style="font-weight: bold;text-align: center;">{{ titulo }}</p>
        <p style="text-align: center;">Total libros: {{ total.toFixed(2) * 1 }}</p>
        <table style="width: 100%; border-collapse: collapse; border: none;">
            <thead>
                <tr>
                    <th style="width: 20%;">Código</th>
                    <th style="width: 35%;">Libro</th>
                    <th style="width: 15%;">Cant. libros</th>
                    <th style="width: 15%;" v-if="totalCombos > 0">Cant. Combos</th>
                    <th style="width: 15%;">Precio</th>
                    <th style="width: 15%;">Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tableData" :key="item.id">
                    <td>{{ item.codigo }}</td>
                    <td>
                        <span v-if="item.documento_estado_liquidacion == 4">
                            GUIA
                        </span>
                        {{ item.nombrelibro }}
                    </td>
                    <td>
                      <div v-if="item.tipo_codigo == 0">
                        {{ item.cantidad}}
                      </div>
                        <div v-if="item.tipo_codigo == 1">
                          {{ item.cantidadTotallibrosCombo }}
                        </div>
                    </td>
                    <td v-if="totalCombos > 0">
                      <div v-if="item.tipo_codigo == 1">
                        {{ item.cantidad}}
                      </div>
                    </td>
                    <td>{{ item.precio }}</td>
                    <td>{{ (item.cantidad * item.precio).toFixed(2) * 1 }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default{
    data(){
        return{
          totalNormales:0,
          totalCombos:0,
          total:0,
        }
    },
    props:{
        tableData:{
            type: Array,
            required: true,
            default: () => []
        },
        titulo:{
            type:String,
            default:''
        },
    },
    mounted(){
        this.ordenarLibros();
        this.sumarTotal();
    },
    methods:{
        sumarTotal(){
            let me = this;
            me.totalNormales = 0;
            me.totalCombos = 0;
            me.total = 0;
            //sumar normales
            this.tableData.forEach(item => {
              if(item.tipo_codigo == 0){
                me.totalNormales += item.cantidad;
              }
            });
            //Sumar combos
            this.tableData.forEach(item => {
              if(item.tipo_codigo == 1){
                me.totalCombos += item.cantidadTotallibrosCombo;
              }
            });
            //sumar normales + libros Combos
            me.total = me.totalNormales + me.totalCombos;

        },

        ordenarLibros(){
          let me = this;
            // result.sort((a, b) => a.codigo.localeCompare(b.codigo));
            me.tableData = me.tableData.sort(function(a, b) {
            var nombreA = a.nombrelibro.toLowerCase();
            var nombreB = b.nombrelibro.toLowerCase();
            var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
            var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
            nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
            nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final

            if (nombreA < nombreB) {
                return -1;
            }
            if (nombreA > nombreB) {
                return 1;
            }
            if (numA && !numB) { // si a tiene número y b no, b va primero
                return 1;
            }
            if (!numA && numB) { // si b tiene número y a no, a va primero
                return -1;
            }
            if (numA && numB) { // si ambos tienen número, compararlos
                if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                return -1;
                }
                if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                return 1;
                }
                return numA - numB; // comparar los números directamente
            }
            return 0; // si son iguales en todo, no hay diferencia
            });
        }

    }
}
</script>
