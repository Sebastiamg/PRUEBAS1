<template>
  <div>
    <div>
      <pre> {{arrayCodes}}</pre>
      <ul class="centerx">
        <li>
          <vs-checkbox v-model="checkMostarAgrupado" @change="f_formatoCodigos">Mostrar agrupado</vs-checkbox>
        </li>
      </ul>
    </div>
    <div v-if="checkMostarAgrupado">
      <TableReutilizableVue
        :title="'Agrupados'"
        :headers="['Combo','Nombre','Cantidad','Libros']"
        :fieldKeys="['combo','nombre','cantidadCombos','codigos_combos']"
        :tableData="arrayCodigos"
      />
    </div>
    <div v-else>
      <TableReutilizableVue
        :title="'Individuales'"
        :headers="['Código','Combo']"
        :fieldKeys="['codigo','combo']"
        :tableData="arrayCodigos"
      />
    </div>
  </div>
</template>

<script>
const TableReutilizableVue              = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
  components: {
    TableReutilizableVue,
  },
  data() {
    return {
      checkMostarAgrupado: true,
      arrayCodigos: [],
    };
  },
  props: {
    arrayCodes: {
      type: Array,
      default: () => [],
    },
    arrayCombos:{
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    // this.f_formatoCodigos(); // Llama la función al montar el componente
  },
  methods: {
    f_formatoCodigos() {
      const me = this;
      if (me.checkMostarAgrupado) {
        const grouped = me.arrayCodes.reduce((acc, obj) => {
          acc[obj.combo] = acc[obj.combo] || { cantidad: 0 };
          acc[obj.combo].cantidad += 1;
          return acc;
        }, {});

        me.arrayCodigos = Object.entries(grouped).map(([combo, { cantidad }]) => ({
          combo,
          cantidad,
        }));
        //del arrayCombos sacar la propiedad nombre donde el combo sea igual codigo_liquidacion de arrayCombos
        me.arrayCodigos.forEach(p => {
          let buscarNombre = me.arrayCombos.filter(p2 => p2.codigo_liquidacion == p.combo)
          if(buscarNombre.length > 0){
            p.nombre = buscarNombre[0].nombre
            p.codigos_combos = buscarNombre[0].codigos_combos
            p.combosLibrosSelected = buscarNombre[0].codigos_combos.split(',');
          }else{
            p.nombre = ""
            p.codigos_combos = ""
          }
        })
        //traer cantidad de combos que estan agrupados
        me.arrayCodigos.forEach(p => {
          let combosLibrosSelected = p.combosLibrosSelected
          let arrayCodesCombo      = me.arrayCodes.filter(p2 => p2.combo == p.combo)
          p.cantidadCombos         = me.f_buscarCodigos(combosLibrosSelected,arrayCodesCombo)
        })

        console.log("resultado",me.arrayCodigos)
      } else {
        me.arrayCodigos = me.arrayCodes;
      }
    },
    f_buscarCodigos(combosLibrosSelected, arrayCodesCombos) {
      console.log("eee",arrayCodesCombos)
      const codigosRequeridos = new Set(combosLibrosSelected);
      let contadorGrupos = 0;

      // Agrupar coincidencias
      const grupos = arrayCodesCombos.reduce((acc, item) => {
        if (codigosRequeridos.has(item.codigo_liquidacion)) {
          acc[item.codigo_liquidacion] = (acc[item.codigo_liquidacion] || 0) + 1;
        }
        return acc;
      }, {});

      // Comprobar si se tienen todos los códigos necesarios
      while (true) {
        if ([...codigosRequeridos].every(codigo => grupos[codigo] > 0)) {
          for (const codigo of codigosRequeridos) {
            grupos[codigo]--; // Disminuir la cantidad de cada código
          }
          contadorGrupos++;
        } else {
          break; // Salir si no hay más grupos completos
        }
      }

      return contadorGrupos;
    },


  },
};
</script>
