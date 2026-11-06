<template>
  <vs-card>
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
      <div class="w-full"
        style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full">
            <b>Código</b>
          </div>
          <div class="vx-col sm:w-1/2 w-full">
            <b>Institución</b>
          </div>
        </div>
        <vs-divider></vs-divider>
        <div :key="index" v-for="(item, index) in errores">
          <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
              <span v-if="item.codigo"> {{ item.codigo }} </span>
            </div>
          </div>
        </div>
      </div>
    </vs-popup>
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div class="w-full mb-base" align="center">
        <h4>Está seguro de aplicar estos {{ tableData.length }} códigos </h4>
        <b>Tipo importación</b>
        <p class="text-danger font-bold">{{ tipoImportacion == 0 ? 'Selección libro' : 'Utilizar columna '
          + codigo_libro +' del excel' }}</p>
        <b v-if="tipoImportacion == 0">Libro:</b>
        <p v-if="tipoImportacion == 0">{{ libroSelect.nombrelibro }}</p>
        <b>Observación:</b>
        <p>{{ observacion }}</p>
      </div>
      <div class="w-full" align="center">
        <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
      </div>
    </vs-popup>
    <div class="mb-6" align="center">
      <div class="vx-col w-full">
        <p style="font-weight: 100;opacity: 0.5;" class="text-2xl">Import Ingreso de códigos</p>
        <vs-divider></vs-divider>
        <p style="color:#1F340E;">
          <i class="fa fa-file" aria-hidden="true"></i> Ingreso de códigos <span style="font-weight: bold;">(no ingrese
            más de 1500 registros en una sola carga.)</span>
        </p>
      </div>
      <!--Seleccionar tipo de  importacion-->
      <div class="flex items-center gap-4 mt-5" v-if="tipoIngreso == 1">
        <span class="font-medium">Tipo importación:</span>

        <label class="radio-container">
          <input type="radio" v-model="tipoImportacion" :value="0" @change="libroSelect = ''" name="tipoImportacion">
          <span class="radio-checkmark"></span>
          <span class="radio-text">Seleccionar libro</span>
        </label>

        <label class="radio-container">
          <input type="radio" v-model="tipoImportacion" :value="1" @change="libroSelect = ''; validateColumna()"
            name="tipoImportacion">
          <span class="radio-checkmark"></span>
          <span class="radio-text">Columna <b>{{ codigo_libro }}</b> del excel</span>
        </label>
      </div>
      <!--Mostrar si el tipo de importacion es por libro-->
      <div v-if="tipoImportacion == 0">
        <!-- Si el libro esta seleccionado mostrar boton para cambiar libro -->
        <div v-if="libroSelect" class="flex justify-center mt-3">
          <!-- HTML !-->
          <button class="button-33 mt-2" role="button">Libro Seleccionado: {{ libroSelect.nombrelibro }}</button>
          <vx-tooltip style="display: inline-block;" text="Seleccionar otro libro" position="top" color="primary">
            <vs-button radius color="warning" size="small" class="ml-2 mt-4" type="border" icon-pack="feather"
              @click="libroSelect = '';" icon="icon-x"></vs-button>
          </vx-tooltip>
        </div>
        <!-- Si el libro no esta seleccionado mostrar boton para seleccionar libro -->
        <div v-else>
          <ScreenLibrosImportVue @changeLibroSelect="changeLibroSelect" />
        </div>
      </div>

      <vs-alert class="mt-4">Si el código empieza con P, será código de diagnóstico; si no, código normal.</vs-alert>
      <!--Comentario-->
      <vs-input icon="icon-message-square" class="w-full mt-5" icon-pack="feather" placeholder="Comentario"
        v-model="observacion" />
      <!-- /Textarea -->
      <br />
      <!--radio para elegir individual o masivo-->
      <vs-radio v-model="tipoIngreso" @input="codigosPerdidos = false; tableData = []; tipoImportacion = 0;" vs-value="0"
        vs-name="tipoIngreso">Individual</vs-radio>
      <vs-radio v-model="tipoIngreso" @input="codigosPerdidos = false; tableData = [];" vs-value="1" class="ml-4"
        vs-name="tipoIngreso">Masivo</vs-radio>
      <div v-if="tipoIngreso == 0" class="mt-4">
        <div class="flex flex-col items-center justify-center">
          <div>
            <span class="text-2xl">Código </span>
            <vs-input v-model="codigoIndividual" @keydown.space="(event) => event.preventDefault()" class="mt-1"
              placeholder="Ingrese el código del paquete" />
          </div>
          <vs-button class="mb-2 mt-5" color="primary" type="relief" icon="code" @click="openConfirm(0)">Subir código
          </vs-button>
        </div>
      </div>
      <div v-if="tipoIngreso == 1">
        <import-excel :onSuccess="loadDataInTable" class="mb-4" />
      </div>
      <div v-if="tipoIngreso == 1">
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12">
            <vs-card>
              <div class="header">
                <p style="font-weight: bold;">Formato del archivo excel</p>
                <table class="tabla">
                  <tr>
                    <th class="th1">codigo</th>
                    <th class="th1">{{codigo_libro}}</th>
                  </tr>
                  <tr>
                    <td class="td1">xxx</td>
                    <td class="td1">xxx</td>
                  </tr>
                </table>
              </div>
            </vs-card>
          </vs-col>
        </vs-row>
      </div>
      <!-- {{tableData}} -->
      <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
        <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos</span><br>
      </vs-alert>
      <vs-row v-if="tableData.length > 0 && tableData.length <= 1500">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-button class="mb-2" color="primary" type="relief" icon="code" @click="openConfirm(1)">Subir códigos
          </vs-button>
        </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-alert active="true">
            Se guardo {{ porcentaje }} códigos
          </vs-alert>
        </vs-col>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true">
        <vs-card v-if="CodigosNoIngresados.length > 0">
          <TableReutilizableVue :title="'Codigos que no se pudieron ingresar'" :headers="['Código', 'Mensaje']"
            :fieldKeys="['codigo', 'message']" :ifexport="Number(1)" :tableData="CodigosNoIngresados" />
        </vs-card>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true && CodigosExisten.length > 0">
        <vx-card title="Estos códigos ya existen" title-color="danger">
          <gestionCodigosLista :arregloCodigos="CodigosExisten" />
        </vx-card>
      </vs-row>
    </div>
    <vx-card v-if="tableData.length && header.length">
      <vs-table stripe pagination :max-items="20" search :data="tableData">
        <template slot="header">
          <h4>Códigos a subir {{ tableData.length }}</h4>
        </template>
        <template slot="thead">
          <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
              {{ col }}
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </vs-card>
</template>
<script>
import Generalmix from '../../../mixins/Generalmix';
import gestionCodigosLista from './utils/gestionCodigosLista.vue'
import ImportExcel from './importExcel.vue'
import vSelect from 'vue-select'
import ScreenLibrosImportVue from '../../libros/ScreenLibrosImport.vue'
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
  mixins: [Generalmix],
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    ScreenLibrosImportVue,
    TableReutilizableVue,
  },
  data() {
    return {
      codigosPerdidos: false,
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      modalConfirm: false,
      modalErrores: false,
      errores: [],
      cedulas_no_encontradas: [],
      CodigosNoIngresados: [],
      CodigosExisten: [],
      libroSelect: '',
      // pruebaDiagnostica:0,
      codigosEnviar: [],
      observacion: '',
      tipoIngreso: 1,
      codigoIndividual: '',
      tipoImportacion: 0,
      codigo_libro: 'codigo_libro',
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos = false
  },
  methods: {

    loadDataInTable({ results, header, meta }) {
      let me = this
      this.codigosPerdidos = false;
      this.header = header;

      const preValores = results.map(element => {
        const validateCodigo = element.codigo.toLowerCase();

        return {
          ...element, // copia todas las propiedades originales
          codigo: element.codigo.toUpperCase(), // sobreescribe solo código en mayúsculas
          diagnostica: validateCodigo.startsWith("p") ? 1 : 0 // agrega o modifica diagnostica
        };
      });

      this.codigosEnviar = preValores;
      this.tableData = results;
      this.sheetName = meta.sheetName;
      // si es importacion por excel validar columna
      if (this.tipoImportacion == 1) {
        me.validateColumna()
      }
    },

    procesarPagos() {
      let me = this


      let sendEnviar = []
      if (me.tipoIngreso == 0) {
        //individual
        const validateCodigo = me.codigoIndividual.toLowerCase();
        //si el codigo inicia con p coloca diagnostica en 1 si no diagnostica en 0
        if (validateCodigo.startsWith("p")) {
          sendEnviar.push({ codigo: me.codigoIndividual, diagnostica: 1 })
        } else {
          sendEnviar.push({ codigo: me.codigoIndividual, diagnostica: 0 })
        }
      } else {
        //masivo
        sendEnviar = me.codigosEnviar
      }
      let json_codigos = JSON.stringify(sendEnviar)
      let formData = new FormData();
      formData.append('data_codigos', json_codigos);
      formData.append('id_usuario', me.usuario.idusuario);
      formData.append('idlibro', me.libroSelect.idlibro || '')
      formData.append('anio', me.libroSelect.year || '')
      formData.append('libro', me.libroSelect.nombre || '')
      formData.append('serie', me.libroSelect.nombre_serie || '')
      formData.append('periodo_id', localStorage.periodo_id)
      formData.append('comentario', "Se ingreso el codigo " + me.observacion)
      formData.append('tipoImportacion', me.tipoImportacion)
      me.$vs.loading()
      this.$http.post(this.$server_url + 'codigos/ingreso', formData)
        .then(res => {
          me.$vs.loading.close()
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-check'
            })
            return false
          }

          me.tableData = []
          me.codigosPerdidos = true
          me.CodigosNoIngresados = res.data.CodigosNoIngresados
          me.CodigosExisten = res.data.CodigosExisten
          me.porcentaje = res.data.cambiados
          if (me.CodigosNoIngresados.length > 0) {
            me.$vs.notify({
              text: 'Algunos códigos no fueron ingresados',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })

          } else {
            me.$vs.notify({
              text: 'Códigos procesados exitosamente',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            })
          }

          me.modalConfirm = false
          if (me.porcentaje > 0) {
            me.codigoIndividual = ''
          }
          me.tipoImportacion = 0
        })
        .catch(function (error) {
          me.$vs.notify({
            text: 'Verifique que la información se haya guardado correctamente.',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.$vs.loading.close()
        })
    },
    openConfirm(tipo) {
      // tipo 0 => importacion por codigo; 1 importacion masivo
      let me = this
      if (tipo == 0) {
        // validacion individual
        //validar codigo individual no tenga espacios
        if (me.codigoIndividual.includes(' ')) {
          me.$vs.notify({ text: 'El código no puede tener espacios', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
        //validar que no este vacio
        if (me.codigoIndividual == '') {
          me.$vs.notify({ text: 'El código no puede estar vacio', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          return
        }
      }
      // fin validacion individual

      // validacin masiva
      if (tipo == 1) {
        const codigoVacio = me.tableData.some(row => !row.codigo)
        if (codigoVacio) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Corrija el formato del excel y vuelva a intentar. Hay celdas vacías en la columna "codigo".',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
      }

      // validacion general
      me.observacion = me.observacion.trim()  // Eliminar espacios al inicio y final

      if (me.observacion === '') {
        me.$vs.loading.close()
        me.$vs.notify({
          text: 'Ingrese un comentario.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.modalConfirm = false
        return
      }

      if (me.observacion.length < 5) {
        me.$vs.loading.close()
        me.$vs.notify({
          text: 'El comentario debe tener al menos 5 caracteres.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.modalConfirm = false
        return
      }
      // fin validacion general
      // validacion que debe seleccionar un libro siempre y cuando sea tipoImportacion = 0
      if (me.tipoImportacion == 0) {
        if (me.libroSelect.idlibro == null || me.libroSelect.idlibro == "" || me.libroSelect.idlibro == undefined) {
          me.$vs.notify({
            text: 'Seleccione un libro.',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.modalConfirm = false
          return
        }
      }


      me.modalConfirm = true
    },

    changeLibroSelect(e) {
      let me = this;
      me.libroSelect = ''
      me.libroSelect = e
    },
    validateColumna() {
      let me = this;
      let erroresValidacion = [];

      // Validar que existe la columna codigo_libro en tableData
      if (me.tableData.length > 0) {
        me.tableData.forEach((row, index) => {
          // Verificar si la columna codigo_libro existe y validar su contenido
          if (row.hasOwnProperty(me.codigo_libro)) {
            const codigoLibroValue = row[me.codigo_libro];

            // Validar que no esté vacío
            if (!codigoLibroValue || codigoLibroValue.toString().trim() === '') {
              erroresValidacion.push({
                fila: index + 1,
                error: `La columna ${me.codigo_libro} no puede estar vacía`
              });
            }
            // Validar que no tenga espacios
            else if (codigoLibroValue.toString().includes(' ')) {
              erroresValidacion.push({
                fila: index + 1,
                error: `La columna ${me.codigo_libro} no puede contener espacios`
              });
            }
          } else {
            erroresValidacion.push({
              fila: index + 1,
              error: `No se encontró la columna ${me.codigo_libro} en el archivo`
            });
          }
        });

        // Mostrar errores si los hay
        if (erroresValidacion.length > 0) {
          let mensajeError = 'Errores encontrados en la validación:\n';
          erroresValidacion.forEach(error => {
            mensajeError += `Fila ${error.fila}: ${error.error}\n`;
          });

          me.$vs.notify({
            text: mensajeError,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
            time: 6000
          });
          me.f_limpiar()
          return false;
        } else {
          me.$vs.notify({
            text: `Validación exitosa para la columna ${me.codigo_libro}`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });

          return true;
        }
      }

      return true;
    },
    f_limpiar() {
      this.tableData = []
      this.header = []
      this.sheetName = ''

    },
  }
}
</script>

<style scoped>
.tabla {
  width: 100%;
  margin-top: 10px;
}

.tabla {

  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}

.th1 {
  background-color: #1F340E;
  border-radius: 5px;
  color: white;
}

.td1,
.th1 {
  padding: 10px;
  text-align: center;
  border: none;
}

.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular, -apple-system, system-ui, Roboto, sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44, 187, 99, .35) 0 -25px 18px -14px inset, rgba(44, 187, 99, .25) 0 1px 2px, rgba(44, 187, 99, .25) 0 2px 4px, rgba(44, 187, 99, .25) 0 4px 8px, rgba(44, 187, 99, .25) 0 8px 16px, rgba(44, 187, 99, .25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}

/* Estilos para radio buttons personalizados */
.radio-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 30px;
  margin-bottom: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.radio-container:hover {
  color: #1F340E;
}

.radio-container input[type="radio"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.radio-checkmark {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.radio-container:hover input~.radio-checkmark {
  border-color: #1F340E;
  box-shadow: 0 0 0 2px rgba(31, 52, 14, 0.1);
}

.radio-container input:checked~.radio-checkmark {
  background-color: #1F340E;
  border-color: #1F340E;
  box-shadow: 0 0 0 2px rgba(31, 52, 14, 0.2);
}

.radio-checkmark:after {
  content: "";
  position: absolute;
  display: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radio-container input:checked~.radio-checkmark:after {
  display: block;
}

.radio-text {
  margin-left: 8px;
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

.radio-container input:checked~.radio-text {
  color: #1F340E;
  font-weight: 600;
}
</style>
