export default {
  methods: {
    m_validateComboHijos(arrayAgrupadosCombos,arregloFormatoSend, contrato =null) {
      let me = this;
      if(arrayAgrupadosCombos.length === 0) {
        me.$vs.notify({
          text: 'No existe codigos en los codigos en los combos',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }
      arrayAgrupadosCombos = arrayAgrupadosCombos.map(item => {
        console.log("item.combo", item.combo)
        // Buscar el combo en arregloFormatoSend por codigo_liquidacion
        const comboEncontrado = arregloFormatoSend.find(combo => combo.codigo == item.combo)
        console.log("comboEncontrado", comboEncontrado)
        return {
          ...item,
          combo: comboEncontrado ? comboEncontrado.combo : '',
          codigosDelCombo: comboEncontrado.codigos_combos ? comboEncontrado.codigos_combos.split(',') : [],
          codigos_combos: comboEncontrado ? comboEncontrado.codigos_combos : '',
        }
      });
      // Array para almacenar errores de validación
      let arrayErroresValidacionCombos = [];

      // Validar cada combo
      arrayAgrupadosCombos.forEach(combo => {
        let errores = [];
        // Extraer códigos de liquidación de codigosHijos
          // Solo tomar los hijos cuyo contrato coincide
          const codigosLiquidacionHijos = combo.codigosHijos
            .filter(hijo => hijo.contrato == contrato)
            .map(hijo => hijo.codigo_liquidacion);
        // Validación 1: Misma cantidad de códigos
        if (codigosLiquidacionHijos.length !== combo.codigosDelCombo.length) {
          if (codigosLiquidacionHijos.length > combo.codigosDelCombo.length) {
            errores.push("El combo tiene más códigos de los esperados");
          } else {
            errores.push("El combo tiene menos códigos de los esperados");
          }
        }

        // Validación 2: No se pueden repetir los mismos codigo_liquidacion
        const codigosUnicos = [...new Set(codigosLiquidacionHijos)];
        if (codigosUnicos.length !== codigosLiquidacionHijos.length) {
          errores.push("Hay códigos de liquidación duplicados");
        }

        // Validación 3: Los códigos deben existir en codigosDelCombo
        const codigosFaltantes = codigosLiquidacionHijos.filter(codigo => !combo.codigosDelCombo.includes(codigo));
        const codigosSobrantes = combo.codigosDelCombo.filter(codigo => !codigosLiquidacionHijos.includes(codigo));

        if (codigosFaltantes.length > 0) {
          errores.push(`Códigos no válidos para este combo: ${codigosFaltantes.join(', ')}`);
        }

        if (codigosSobrantes.length > 0) {
          errores.push(`Faltan códigos del combo: ${codigosSobrantes.join(', ')}`);
        }

        // Si hay errores, agregar al array de errores
        if (errores.length > 0) {
          arrayErroresValidacionCombos.push({
            codigoCombo: combo.codigoCombo,
            codigos_combos: combo.codigos_combos,
            error: errores.join(' | '),
            combo: combo.combo,
          });
        }
      });
      console.log("arrayErroresValidacionCombos", arrayErroresValidacionCombos);
      console.log("arrayAgrupadosCombos", arrayAgrupadosCombos);
      return {
        arrayErroresValidacionCombos:arrayErroresValidacionCombos,
        arrayAgrupadosCombos:arrayAgrupadosCombos
      }
    }
  }
};
