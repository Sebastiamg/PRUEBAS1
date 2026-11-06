export default {
  methods: {
    m_validatePaquete(tableData,tipoCode='paquete',code='paq') {
      let me = this;
      let resultado = {
        arregloFormatoSend: [],
        arregloProblemasPaquete: [],
      };

      try {
        const problema = "Problema con el "+tipoCode;
        let preValores = JSON.parse(JSON.stringify(tableData));
        let datos = [];

        preValores.forEach(element => {
          var obj = new Object();

          // Convertir 'codigo' a mayúsculas
          obj.codigo = element.codigo.trim().toUpperCase();

          // Copiar las propiedades de 'element' y convertirlas a mayúsculas si son cadenas
          Object.entries(element).forEach(([key, value]) => {
            // Si el valor es una cadena, convertirlo a mayúsculas
            if (typeof value === 'string') {
              obj[key] = value.toUpperCase();
            } else {
              obj[key] = value; // Si no es cadena, conservar el valor original
            }
          });

          // Agregar el objeto 'obj' a la lista 'datos'
          datos.push(obj);
        });


        // Validar si son más de 200
        if (datos.length > 200) {
          me.$vs.notify({
            text: 'No puedes subir más de 200 '+tipoCode+'s',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-check'
          });
          return false;
        }

        datos.forEach(element => {
          let ifErrsPaquete = false;
          let codigoPaquete = element.codigo;

          // Validar que el código sea string
          if (typeof codigoPaquete !== 'string') {
            ifErrsPaquete = true;
          } else {
            const paqueteMinuscula = codigoPaquete.toLowerCase();
            if (!paqueteMinuscula.startsWith(`${code}-`)) {
              ifErrsPaquete = true;
            }
          }

          // Si hay errores
          if (ifErrsPaquete) {
            var cal = new Object();
            cal.codigoPaquete = codigoPaquete;
            cal.problema = problema;
            cal.codigosHijos = [];
            resultado.arregloProblemasPaquete.push(cal);
          } else {
            resultado.arregloFormatoSend.push({ codigoPaquete: codigoPaquete, ...element });
          }
        });
        // Retornar el objeto con los resultados
        return resultado;

      } catch (err) {
        console.log("err", err);
        alert("Hubo problemas con tu archivo excel");
      }
    }
  }
};
