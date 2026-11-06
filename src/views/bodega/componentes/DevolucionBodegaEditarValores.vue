<template>
  <div>
    <div>
      <div class="flex justify-center mb-4" v-if="ObjectedSelected">
        <vs-button color="success" @click="guardarCambios">
          <i class="fa-solid fa-save mr-2"></i>Guardar Cambios
        </vs-button>
      </div>
      
      <div id="seccionEditarValores">
        <p style="text-align: center; font-weight: bold; margin-bottom: 10px;">{{nombreEmpresaActual}}</p>
        <h1 style="font-weight: bold;text-align: center;">Editar Valores - Combos Desarmados</h1>
        <p style="text-align: center;font-weight: 400;margin-top: 10px;">{{ ObjectedSelected ? ObjectedSelected.codigo_devolucion : '' }}</p>
        <br>
        
        <table style="width: 100%; border-collapse: collapse; border: none;">
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                <b>Fecha:</b>
              </p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                {{ fecha_actual }}
              </p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                <b>Institución de devolución:</b>
              </p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                {{ nombreInstitucion }}
              </p>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                <b>Periodo devolución:</b>
              </p>
            </td>
            <td style="border: none; text-align: left; padding-left: 0px;">
              <p class="letra" style="font-size: 11px; margin: 0;">
                {{ nombrePeriodo }}
              </p>
            </td>
          </tr>
        </table>
        
        <p class="mt-5"><b>Total códigos (Normales + Regalados): </b> {{ arrayCodigosNormales.reduce((acc, el) => acc + Number(el.cantidad), 0) + arrayCodigosRegalados.reduce((acc, el) => acc + Number(el.cantidad), 0) }}</p>
        
        <!-- Códigos Normales Editables -->
        <div v-if="arrayCodigosNormales.length > 0" class="mt-6">
          <h3 class="text-lg font-bold mb-4">Códigos Normales - Editar Precios</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2">Código</th>
                  <th class="border border-gray-300 px-4 py-2">Libro</th>
                  <th class="border border-gray-300 px-4 py-2">Cantidad</th>
                  <th class="border border-gray-300 px-4 py-2">Descuento</th>
                  <th class="border border-gray-300 px-4 py-2">Precio Original</th>
                  <th class="border border-gray-300 px-4 py-2">Precio Especial</th>
                  <th class="border border-gray-300 px-4 py-2">Subtotal</th>
                  <th class="border border-gray-300 px-4 py-2">Total</th>
                  <th class="border border-gray-300 px-4 py-2">Empresa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in arrayCodigosNormales" :key="index">
                  <td class="border border-gray-300 px-4 py-2">{{ item.codigo_liquidacion }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.nombrelibro }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.cantidad }}</td>
                  <td>{{ item.descuento }}</td>
                  <td class="border border-gray-300 px-4 py-2">${{ item.precio }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <vs-input 
                      type="number" 
                      step="0.01"
                      v-model="item.precio_especial"
                      @input="calcularTotales(item)"
                      placeholder="Precio especial"
                      class="w-full"
                    />
                  </td>
                  <td class="border border-gray-300 px-4 py-2">${{ item.subtotal_actual || item.subtotal }}</td>
                  <td class="border border-gray-300 px-4 py-2">${{ item.total_actual || item.total }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.nombre_empresa }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Códigos Regalados Editables -->
        <div v-if="arrayCodigosRegalados.length > 0" class="mt-6">
          <h3 class="text-lg font-bold mb-4">Códigos Regalados - Editar Precios</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2">Código</th>
                  <th class="border border-gray-300 px-4 py-2">Libro</th>
                  <th class="border border-gray-300 px-4 py-2">Cantidad</th>
                  <th class="border border-gray-300 px-4 py-2">Precio Original</th>
                  <th class="border border-gray-300 px-4 py-2">Precio Especial</th>
                  <th class="border border-gray-300 px-4 py-2">Subtotal</th>
                  <th class="border border-gray-300 px-4 py-2">Total</th>
                  <th class="border border-gray-300 px-4 py-2">Empresa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in arrayCodigosRegalados" :key="index">
                  <td class="border border-gray-300 px-4 py-2">{{ item.codigo_liquidacion }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.nombrelibro }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.cantidad }}</td>
                  <td class="border border-gray-300 px-4 py-2">${{ item.precio }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <vs-input 
                      type="number" 
                      step="0.01"
                      v-model="item.precio_especial"
                      @input="calcularTotales(item)"
                      placeholder="Precio especial"
                      class="w-full"
                    />
                  </td>
                  <td class="border border-gray-300 px-4 py-2">${{ item.subtotal_actual || item.subtotal }}</td>
                  <td class="border border-gray-300 px-4 py-2">${{ item.total_actual || item.total }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.nombre_empresa }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <br><br>
        <p><b>Observación:</b> {{ observacion }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Generalmix from "../../../mixins/Generalmix";
import moment from 'moment';

export default {
  mixins: [Generalmix],
  data() {
    let usuarioLocal = localStorage.getItem('usuario');
    return {
      arrayCodigosEncontrados: [],
      arrayCodigosNormales: [],
      arrayCodigosRegalados: [],
      fecha_actual: moment().format('DD/MM/YYYY'),
      usuario: usuarioLocal ? JSON.parse(usuarioLocal) : null,
      nombrePeriodo: '',
      nombreInstitucion: '',
      observacion: '',
      usuarioCreador: '',
      ObjectedSelected: null,
      nombreEmpresaActual: '',
    }
  },
  props: {
    id_devolucion: {
      type: Number,
      required: true,
      default: 0
    },
  },
  async mounted() {
    await this.empresaActual();
    await this.f_getDatosCodigos();
  },
  methods: {
    async empresaActual() {
      await this.$http.get(this.$server_url + 'empresaActual')
        .then(res => {
          this.nombreEmpresaActual = res.data[0].descripcion_corta;
        })
        .catch(err => {
          console.log(err);
        });
    },

    async f_getDatosCodigos() {
      let me = this;
      me.$vs.loading();
      try {
        const response = await me.$http.get(me.$server_url + 'devoluciones', {
          params: {
            'getDevolucionesCombosDesarmadosXId': 1,
            'id_devolucion': me.id_devolucion
          }
        });
        
        if (!response.data || response.data.length === 0) {
          me.$vs.loading.close();
          me.m_message('No existen datos de devolución.', 'warning');
          me.arrayCodigosEncontrados = [];
          me.nombrePeriodo = '';
          me.nombreInstitucion = '';
          me.observacion = '';
          me.usuarioCreador = '';
          return;
        }
        
        me.ObjectedSelected = response.data;
        me.arrayCodigosEncontrados = response.data.codigos;
        me.nombrePeriodo = response.data.periodoescolar || '';
        me.nombreInstitucion = response.data.nombreInstitucion || '';
        me.observacion = response.data.observacion || '';
        me.usuarioCreador = response.data.usuarioCreador || '';
        me.f_formatoCodigos();
        me.inicializarValoresActuales();
        me.$vs.loading.close();
      } catch (error) {
        me.$vs.loading.close();
        console.error('Error al obtener los datos de códigos:', error);
      }
    },

    f_formatoCodigos() {
      // Agrupar por codigo_liquidacion, nombrelibro, descuento y nombre_empresa
      const agrupados = {};

      this.arrayCodigosEncontrados.forEach(item => {
        const key = `${item.codigo_liquidacion}|${item.nombrelibro}|${item.descuento}|${item.nombre_empresa}`;
        if (!agrupados[key]) {
          agrupados[key] = {
            codigo_liquidacion: item.codigo_liquidacion,
            nombrelibro: item.nombrelibro,
            precio: item.precio,
            precio_especial: item.precio_especial || null, // Mantener null si no existe precio especial
            descuento: item.descuento,
            nombre_empresa: item.nombre_empresa,
            normales: 0,
            regalados: 0,
            codigos_ids: [] // Para guardar los IDs de los códigos
          };
        }

        // Guardar los IDs de los códigos para poder actualizarlos después
        agrupados[key].codigos_ids.push(item.id);

        if (String(item.estado_liquidacion) == '1' || item.estado_liquidacion == '0') {
          agrupados[key].normales++;
        } else if (String(item.estado_liquidacion) === '2') {
          agrupados[key].regalados++;
        }
      });

      // Función para calcular total con descuento
      const calcularTotal = (precio, cantidad, descuento) => {
        const subtotal = Number(precio || 0) * cantidad;
        const descuentoMonto = subtotal * (Number(descuento || 0) / 100);
        return (subtotal - descuentoMonto).toFixed(2);
      };

      // Agrupar normales
      this.arrayCodigosNormales = Object.values(agrupados)
        .filter(e => e.normales > 0)
        .map(e => {
          const subtotal = (Number(e.precio) || 0) * e.normales;
          return {
            codigo_liquidacion: e.codigo_liquidacion,
            nombrelibro: e.nombrelibro,
            nombre_empresa: e.nombre_empresa,
            cantidad: e.normales,
            descuento: e.descuento,
            precio: e.precio,
            precio_especial: e.precio_especial, // Puede ser null
            subtotal: subtotal.toFixed(2),
            total: calcularTotal(e.precio, e.normales, e.descuento),
            codigos_ids: e.codigos_ids
          };
        });

      // Agrupar regalados
      this.arrayCodigosRegalados = Object.values(agrupados)
        .filter(e => e.regalados > 0)
        .map(e => {
          const subtotal = (Number(e.precio) || 0) * e.regalados;
          return {
            codigo_liquidacion: e.codigo_liquidacion,
            nombrelibro: e.nombrelibro,
            nombre_empresa: e.nombre_empresa,
            cantidad: e.regalados,
            descuento: e.descuento,
            precio: e.precio,
            precio_especial: e.precio_especial, // Puede ser null
            subtotal: subtotal.toFixed(2),
            total: calcularTotal(e.precio, e.regalados, e.descuento),
            codigos_ids: e.codigos_ids
          };
        });
    },

    calcularTotales(item) {
      const cantidad = Number(item.cantidad) || 0;
      const descuento = Number(item.descuento) || 0;
      
      // Si hay precio especial, calcular con ese precio
      if (item.precio_especial && item.precio_especial !== '') {
        const precio_especial = Number(item.precio_especial);
        const subtotal_especial = precio_especial * cantidad;
        const descuentoMonto = subtotal_especial * (descuento / 100);
        const total_especial = (subtotal_especial - descuentoMonto).toFixed(2);
        
        item.subtotal_actual = subtotal_especial.toFixed(2);
        item.total_actual = total_especial;
      } else {
        // Si no hay precio especial, usar precio original
        const precio_original = Number(item.precio) || 0;
        const subtotal_original = precio_original * cantidad;
        const descuentoMonto = subtotal_original * (descuento / 100);
        const total_original = (subtotal_original - descuentoMonto).toFixed(2);
        
        item.subtotal_actual = subtotal_original.toFixed(2);
        item.total_actual = total_original;
      }
    },

    inicializarValoresActuales() {
      // Inicializar valores actuales para códigos normales
      this.arrayCodigosNormales.forEach(item => {
        item.subtotal_actual = item.subtotal;
        item.total_actual = item.total;
      });
      
      // Inicializar valores actuales para códigos regalados
      this.arrayCodigosRegalados.forEach(item => {
        item.subtotal_actual = item.subtotal;
        item.total_actual = item.total;
      });
    },

    async guardarCambios() {
      let me = this;
      me.$vs.loading();
      
      try {
        // Preparar datos para enviar
        const datosActualizar = [];
        
        // Procesar códigos normales
        this.arrayCodigosNormales.forEach(item => {
          // Solo guardar si se ingresó un precio especial y es diferente al precio original
          if (item.precio_especial && item.precio_especial !== '' && Number(item.precio_especial) !== Number(item.precio)) {
            item.codigos_ids.forEach(id => {
              datosActualizar.push({
                id: id,
                precio_especial: item.precio_especial
              });
            });
          }
        });
        
        // Procesar códigos regalados
        this.arrayCodigosRegalados.forEach(item => {
          // Solo guardar si se ingresó un precio especial y es diferente al precio original
          if (item.precio_especial && item.precio_especial !== '' && Number(item.precio_especial) !== Number(item.precio)) {
            item.codigos_ids.forEach(id => {
              datosActualizar.push({
                id: id,
                precio_especial: item.precio_especial
              });
            });
          }
        });
        
        if (datosActualizar.length === 0) {
          me.$vs.loading.close();
          me.m_message('No hay cambios para guardar.', 'warning');
          return;
        }
        
        const formData = new FormData();
        formData.append('actualizarPreciosEspeciales', 1);
        formData.append('id_devolucion', me.id_devolucion);
        formData.append('datos_actualizar', JSON.stringify(datosActualizar));
        formData.append('id_usuario', me.usuario.idusuario);
        
        const response = await me.$http.post(me.$server_url + 'devoluciones', formData);
        
        me.$vs.loading.close();
        
        if (response.data.status == 0) {
          me.m_message(response.data.message || 'Error al actualizar los precios', 'warning');
          return;
        }
        
        me.m_message('Precios actualizados correctamente.', 'success');
        me.$emit('changeEditarValores', true);
        
      } catch (error) {
        me.$vs.loading.close();
        console.error('Error al guardar cambios:', error);
        me.m_message('Error al guardar los cambios.', 'error');
      }
    }
  }
}
</script>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}
</style>