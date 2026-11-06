<template>
  <div>
    <vx-card>
      <!-- Filtros destacados para Serie y Área -->
      <div class="filtros-destacados mb-4">
        <p class="text-center">Filtros para asignaturas</p>
        <div class="vx-row w-full">
          <div class="vx-col sm:w-1/2 w-full">
            <div class="filtro-item">
              <label class="filtro-label">🎯 Filtrar por serie</label>
              <v-select :options="arraySeries" :reduce="arraySeries => arraySeries.id_serie" label="nombre_serie"
                placeholder="--Seleccione una serie--" class="mb-2" v-model="seriesSelected"
                @input="filtrarPorSerie()" />
            </div>
          </div>
          <div class="vx-col sm:w-1/2 w-full">
            <div class="filtro-item">
              <label class="filtro-label">📚 Filtrar por área</label>
              <v-select :options="arrayAreas" :reduce="arrayAreas => arrayAreas.idarea" label="nombrearea"
                placeholder="--Seleccione un área--" class="mb-2" v-model="areasSelected"
                @input="filtrarPorArea()" />
            </div>
          </div>
        </div>
        <!-- Radio buttons para filtrar asignaturas -->
        <div class="vx-row w-full mt-3">
          <div class="vx-col w-full" align="center">
            <div class="filtro-radio mb-3">
              <vs-radio v-model="filtroAsignaturas" vs-value="both" vs-name="filtroAsignaturas" class="mr-4">
                Filtrar ambas asignaturas
              </vs-radio>
              <vs-radio v-model="filtroAsignaturas" vs-value="from" vs-name="filtroAsignaturas" class="mr-4">
                Filtrar solo asignatura desde
              </vs-radio>
              <vs-radio v-model="filtroAsignaturas" vs-value="to" vs-name="filtroAsignaturas">
                Filtrar solo asignatura hasta
              </vs-radio>
            </div>
            <vs-button color="warning" type="flat" icon-pack="feather" @click="limpiarFiltros()">
              🧹 Limpiar filtros
            </vs-button>
          </div>
        </div>
      </div>

      <div class="vx-row mb-5 mt-4">
        <div class="vx-col sm:w-1/2 w-full">
          <small v-if="asignaturaSelectedFrom">
            #{{ asignaturaSelectedFrom }}
          </small>
          Asignatura desde <b>  ({{ arrayPreguntasFrom.length }} preguntas encontradas)</b>
          <!-- Asignatura Desde -->
          <v-select :options="opcionesAsignaturaFrom" :reduce="arrayAsignaturas => arrayAsignaturas.idasignatura" label="label"
            placeholder="--Seleccione--" class="mb-2" v-model="asignaturaSelectedFrom"
           />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <small v-if="asignaturaSelectedTo">
            #{{ asignaturaSelectedTo }}
          </small>
          Asignatura Hasta <b>  ({{ arrayPreguntasTo.length }} preguntas encontradas)</b>
          <!-- Asignatura Hasta -->
          <v-select :options="opcionesAsignaturaTo" :reduce="arrayAsignaturas => arrayAsignaturas.idasignatura" label="label"
            placeholder="--Seleccione--" class="mb-2" v-model="asignaturaSelectedTo"
           />
        </div>
      </div>

      <!-- Botón de buscar -->
      <div v-if="asignaturaSelectedFrom && asignaturaSelectedTo" class="flex justify-center mt-4">
        <vs-button color="primary" @click="f_buscarPreguntas">
          <i class="fas fa-search mr-2"></i>
          Buscar preguntas y temas
        </vs-button>
      </div>

      <!-- Validación de temas -->
      <div v-if="asignaturaSelectedFrom && asignaturaSelectedTo && (arrayTemasFrom.length > 0 || arrayTemasTo.length > 0)" class="mt-5">
        <vs-alert v-if="validacionTemas.esValido" color="success" class="mb-4" style="height: 80px;">
          <template #title>
            Validación exitosa
          </template>
          Las asignaturas tienen la misma cantidad de temas ({{ arrayTemasFrom.length }}) y todos coinciden.
        </vs-alert>

        <vs-alert v-else color="warning" class="mb-4" style="height: 80px;">
          <template #title>
            Validación de temas
          </template>
          <div v-if="arrayTemasFrom.length === 0 || arrayTemasTo.length === 0">
            <p v-if="arrayTemasFrom.length === 0 && arrayTemasTo.length === 0">
              Ambas asignaturas no tienen temas registrados.
            </p>
            <p v-else-if="arrayTemasFrom.length === 0">
              La asignatura desde no tiene temas registrados. La asignatura hasta tiene <strong>{{ arrayTemasTo.length }}</strong> temas.
            </p>
            <p v-else-if="arrayTemasTo.length === 0">
              La asignatura hasta no tiene temas registrados. La asignatura desde tiene <strong>{{ arrayTemasFrom.length }}</strong> temas.
            </p>
          </div>
          <div v-else>
            <div v-if="validacionTemas.cantidadDiferente">
              <p>La asignatura desde tiene <strong>{{ arrayTemasFrom.length }}</strong> temas y la asignatura hasta tiene <strong>{{ arrayTemasTo.length }}</strong> temas.</p>
            </div>
            <div v-if="validacionTemas.temasDiferentes.length > 0">
              <p>Hay {{ validacionTemas.temasDiferentes.length }} temas que no coinciden.</p>
            </div>
          </div>
        </vs-alert>

        <!-- Tabla de temas diferentes -->
        <div v-if="validacionTemas.temasDiferentes.length > 0" class="mt-4">
          <TableReutilizableVue
            :title="'Temas que no coinciden'"
            :headers="['Unidad','Nombre Tema Desde','Nombre Tema Hasta','Asignatura']"
            :fieldKeys="['unidad','nombre_tema_desde','nombre_tema_hasta','asignatura']"
            :ifexportar="Number(1)"
            :tableData="validacionTemas.temasDiferentes"
          />
        </div>
      </div>

      <!--boton-->
      <div class="flex justify-center mt-5">
        <vs-button color="success" @click="f_moverPreguntas();" :disabled="!validacionTemas.esValido"><i class="fa-solid fa-floppy-disk"></i> Copiar preguntas</vs-button>
      </div>
      <br><br><br><br><br><br><br><br><br><br>
    </vx-card>
    <!-- Modal para preguntas existentes -->
    <div class="demo-alignment">
      <vs-popup
        classContent="popup-example"
        title="Preguntas que ya existían"
        :active.sync="modalPreguntasExistentes"
      >
        <vs-alert color="warning" class="mb-4">
          <template #title>
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Información importante
          </template>
          <p>Se encontraron {{ arrayPreguntasExistentes.length }} pregunta{{ arrayPreguntasExistentes.length === 1 ? '' : 's' }} que ya existía{{ arrayPreguntasExistentes.length === 1 ? '' : 'n' }} en la asignatura destino. Estas preguntas no fueron duplicadas.</p>
        </vs-alert>

        <TableReutilizableVue
          :title="'Preguntas existentes'"
          :headers="['Descripción de la pregunta']"
          :fieldKeys="['descripcion']"
          :tableData="arrayPreguntasExistentes"
          :ifexportar="Number(1)"
        />

        <vs-button
          @click="modalPreguntasExistentes = false"
          color="primary"
          class="w-full mt-4"
          type="gradient"
        >
          Cerrar
        </vs-button>
      </vs-popup>
    </div>
  </div>
</template>
<script>
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
import vSelect from 'vue-select'
export default {
  components: {
    TableReutilizableVue,
    vSelect
  },
  data() {
    return{
      usuario:[],
      arrayAsignaturas:[],
      arrayAsignaturasOriginal:[], // Para guardar el array original sin filtros
      asignaturaSelectedFrom:'',
      asignaturaSelectedTo:'',
      arrayPreguntasFrom:[],
      arrayPreguntasTo:[],
      arrayTemasFrom:[],
      arrayTemasTo:[],
      validacionTemas: {
        esValido: false,
        cantidadDiferente: false,
        temasDiferentes: []
      },
      modalPreguntasExistentes: false,
      arrayPreguntasExistentes: [],
      // Filtros
      arraySeries: [],
      arrayAreas: [],
      seriesSelected: '',
      areasSelected: '',
      filtroAsignaturas: 'both' // 'both', 'from', 'to'
    }
  },
  computed: {
    // Array filtrado para el selector "desde"
    arrayAsignaturasFiltradoFrom() {
      let me = this;
      let asignaturasFiltradas = [...me.arrayAsignaturasOriginal];

      // Solo aplicar filtros si el radio permite filtrar "desde"
      if (me.filtroAsignaturas === 'both' || me.filtroAsignaturas === 'from') {
        // Aplicar filtro por serie si está seleccionada
        if (me.seriesSelected && me.seriesSelected !== '') {
          asignaturasFiltradas = asignaturasFiltradas.filter(asignatura =>
            asignatura.id_serie == me.seriesSelected
          );
        }

        // Aplicar filtro por área si está seleccionada
        if (me.areasSelected && me.areasSelected !== '') {
          asignaturasFiltradas = asignaturasFiltradas.filter(asignatura =>
            asignatura.area_idarea == me.areasSelected
          );
        }
      }

      return asignaturasFiltradas;
    },
    // Array filtrado para el selector "hasta"
    arrayAsignaturasFiltradoTo() {
      let me = this;
      let asignaturasFiltradas = [...me.arrayAsignaturasOriginal];

      // Solo aplicar filtros si el radio permite filtrar "hasta"
      if (me.filtroAsignaturas === 'both' || me.filtroAsignaturas === 'to') {
        // Aplicar filtro por serie si está seleccionada
        if (me.seriesSelected && me.seriesSelected !== '') {
          asignaturasFiltradas = asignaturasFiltradas.filter(asignatura =>
            asignatura.id_serie == me.seriesSelected
          );
        }

        // Aplicar filtro por área si está seleccionada
        if (me.areasSelected && me.areasSelected !== '') {
          asignaturasFiltradas = asignaturasFiltradas.filter(asignatura =>
            asignatura.area_idarea == me.areasSelected
          );
        }
      }

      return asignaturasFiltradas;
    },
    opcionesAsignaturaFrom() {
      // Si el filtro es 'to', mostrar todas las asignaturas sin filtrar
      if (this.filtroAsignaturas === 'to') {
        return this.arrayAsignaturasOriginal;
      }
      // Si no, usar el array filtrado
      return this.arrayAsignaturasFiltradoFrom;
    },
    opcionesAsignaturaTo() {
      // Si el filtro es 'from', mostrar todas las asignaturas sin filtrar
      if (this.filtroAsignaturas === 'from') {
        return this.arrayAsignaturasOriginal;
      }
      // Si no, usar el array filtrado
      return this.arrayAsignaturasFiltradoTo;
    }
  },
  mounted(){
    let me = this;
    me.f_asignaturas()
    me.f_series()
    me.f_areas()
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  watch: {
    asignaturaSelectedFrom(newVal) {
      // Validar que no sea la misma asignatura
      if (newVal && this.asignaturaSelectedTo && newVal === this.asignaturaSelectedTo) {
        this.asignaturaSelectedTo = '';
        this.arrayPreguntasTo = [];
        this.arrayTemasTo = [];
        this.$vs.notify({
          color: 'warning',
          title: 'Advertencia',
          text: 'No se puede seleccionar la misma asignatura en ambos campos'
        });
        return;
      }

      // Si ambas asignaturas están seleccionadas, ejecutar búsqueda automática
      if (newVal && this.asignaturaSelectedTo) {
        this.f_buscarPreguntas();
      }
    },
    asignaturaSelectedTo(newVal) {
      // Validar que no sea la misma asignatura
      if (newVal && this.asignaturaSelectedFrom && newVal === this.asignaturaSelectedFrom) {
        this.asignaturaSelectedTo = '';
        this.arrayPreguntasTo = [];
        this.arrayTemasTo = [];
        this.$vs.notify({
          color: 'warning',
          title: 'Advertencia',
          text: 'No se puede seleccionar la misma asignatura en ambos campos'
        });
        return;
      }

      // Si ambas asignaturas están seleccionadas, ejecutar búsqueda automática
      if (newVal && this.asignaturaSelectedFrom) {
        this.f_buscarPreguntas();
      }
    },
    arrayTemasFrom: {
      handler() {
        this.f_validarTemas();
      },
      deep: true
    },
    arrayTemasTo: {
      handler() {
        this.f_validarTemas();
      },
      deep: true
    },
    filtroAsignaturas(newVal) {
      // Cuando cambie el filtro de radio, limpiar selectivamente según el filtro
      let me = this;

      if (newVal === 'from') {
        // Solo limpiar la asignatura "desde"
        me.asignaturaSelectedFrom = '';
        me.arrayPreguntasFrom = [];
        me.arrayTemasFrom = [];
      } else if (newVal === 'to') {
        // Solo limpiar la asignatura "hasta"
        me.asignaturaSelectedTo = '';
        me.arrayPreguntasTo = [];
        me.arrayTemasTo = [];
      } else if (newVal === 'both') {
        // Limpiar ambas asignaturas
        me.asignaturaSelectedFrom = '';
        me.asignaturaSelectedTo = '';
        me.arrayPreguntasFrom = [];
        me.arrayPreguntasTo = [];
        me.arrayTemasFrom = [];
        me.arrayTemasTo = [];
      }

      // Resetear validación
      me.validacionTemas = {
        esValido: false,
        cantidadDiferente: false,
        temasDiferentes: []
      };

      // Aplicar los filtros
      me.aplicarFiltrosCombinados();
    }
  },
  methods:{
    f_asignaturas(){
      let me = this;
      me.$vs.loading()
       this.$http.get(this.$server_url + 'asignaturasDoc/0').then(res => {
        me.arrayAsignaturas = res.data;
        me.arrayAsignaturasOriginal = [...res.data]; // Guardar copia original
        me.$vs.loading.close()
      })
    },
    f_series(){
      let me = this;
      this.$http.get(this.$server_url + 'series').then(res => {
        /// validar que la serie no sea 19 y ser_estado sea 1
        me.arraySeries = res.data.filter(p => p.id_serie != '19' && p.ser_estado == '1'); // Excluir serie 19
      }).catch(error => {
        console.error('Error cargando series:', error);
      });
    },
    f_areas(){
      let me = this;
      this.$http.get(this.$server_url + 'areas').then(res => {
        // filtrar estado = 1 y si tiene la palabra combo no mostrar
        me.arrayAreas = res.data.area.filter(a => a.estado == '1' && !a.nombrearea.includes('Combo'));
      }).catch(error => {
        console.error('Error cargando áreas:', error);
      });
    },
    filtrarPorSerie(){
      let me = this;

      // Limpiar asignaturas según el filtro activo
      if (me.filtroAsignaturas === 'both') {
        // Limpiar ambas asignaturas
        me.asignaturaSelectedFrom = '';
        me.asignaturaSelectedTo = '';
        me.arrayPreguntasFrom = [];
        me.arrayPreguntasTo = [];
        me.arrayTemasFrom = [];
        me.arrayTemasTo = [];
      } else if (me.filtroAsignaturas === 'from') {
        // Solo limpiar la asignatura "desde"
        me.asignaturaSelectedFrom = '';
        me.arrayPreguntasFrom = [];
        me.arrayTemasFrom = [];
      } else if (me.filtroAsignaturas === 'to') {
        // Solo limpiar la asignatura "hasta"
        me.asignaturaSelectedTo = '';
        me.arrayPreguntasTo = [];
        me.arrayTemasTo = [];
      }

      me.aplicarFiltrosCombinados();
    },
    filtrarPorArea(){
      let me = this;

      // Limpiar asignaturas según el filtro activo
      if (me.filtroAsignaturas === 'both') {
        // Limpiar ambas asignaturas
        me.asignaturaSelectedFrom = '';
        me.asignaturaSelectedTo = '';
        me.arrayPreguntasFrom = [];
        me.arrayPreguntasTo = [];
        me.arrayTemasFrom = [];
        me.arrayTemasTo = [];
      } else if (me.filtroAsignaturas === 'from') {
        // Solo limpiar la asignatura "desde"
        me.asignaturaSelectedFrom = '';
        me.arrayPreguntasFrom = [];
        me.arrayTemasFrom = [];
      } else if (me.filtroAsignaturas === 'to') {
        // Solo limpiar la asignatura "hasta"
        me.asignaturaSelectedTo = '';
        me.arrayPreguntasTo = [];
        me.arrayTemasTo = [];
      }

      me.aplicarFiltrosCombinados();
    },
    aplicarFiltrosCombinados(){
      let me = this;
      // Ya no necesitamos modificar arrayAsignaturas aquí
      // Los filtros se aplican a través de las computed properties
      // Solo ejecutar validación si es necesario
      me.validarSeleccionesAsignaturas();
    },
    validarSeleccionesAsignaturas(){
      let me = this;

      // NO limpiar las selecciones - solo mantener las que ya están hechas
      // Los filtros de radio solo afectan qué opciones se muestran, no las selecciones existentes

      // Solo resetear validación si es necesario
      if (!me.asignaturaSelectedFrom || !me.asignaturaSelectedTo) {
        me.validacionTemas = {
          esValido: false,
          cantidadDiferente: false,
          temasDiferentes: []
        };
      }
    },
    limpiarFiltros(){
      let me = this;
      // Limpiar las selecciones de filtros
      me.seriesSelected = '';
      me.areasSelected = '';
      me.filtroAsignaturas = 'both';

      // No necesitamos restaurar arrayAsignaturas ya que usamos computed properties
      // que se actualizan automáticamente
    },
    f_buscarPreguntas(){
      // Ejecutar ambas búsquedas cuando se presione el botón buscar
      this.f_llamarPreguntasFrom();
      this.f_llamarPreguntasTo();
    },
    f_llamarPreguntasFrom(){
      let me = this;
      me.$vs.loading()
      const params = {
        action: 'Get_Preguntas_x_Asignatura',
        id_asignatura: this.asignaturaSelectedFrom
      };
      this.$http.get(this.$server_url + 'metodosGetPreguntas', { params })
      .then(res => {
        me.arrayPreguntasFrom = res.data.preguntas || [];
        me.arrayTemasFrom = res.data.temas || [];
        me.$vs.loading.close()
      })
    },
    f_llamarPreguntasTo(){
      let me = this;
      me.$vs.loading()
      const params = {
        action: 'Get_Preguntas_x_Asignatura',
        id_asignatura: this.asignaturaSelectedTo
      };
      this.$http.get(this.$server_url + 'metodosGetPreguntas', { params })
      .then(res => {
        me.arrayPreguntasTo = res.data.preguntas || [];
        me.arrayTemasTo = res.data.temas || [];
        me.$vs.loading.close()
      })
    },
    f_validarTemas() {
      const me = this;

      // Resetear validación
      me.validacionTemas = {
        esValido: false,
        cantidadDiferente: false,
        temasDiferentes: []
      };

      // Si no hay temas en ambos arrays, no validar
      if (me.arrayTemasFrom.length === 0 || me.arrayTemasTo.length === 0) {
        return;
      }

      // Obtener los nombres de las asignaturas del array original
      const asignaturaFromObj = me.arrayAsignaturasOriginal.find(asig => asig.idasignatura === me.asignaturaSelectedFrom);
      const asignaturaToObj = me.arrayAsignaturasOriginal.find(asig => asig.idasignatura === me.asignaturaSelectedTo);

      const nombreAsignaturaFrom = asignaturaFromObj ? asignaturaFromObj.label : 'Desde';
      const nombreAsignaturaTo = asignaturaToObj ? asignaturaToObj.label : 'Hasta';

      // Validar cantidad
      if (me.arrayTemasFrom.length !== me.arrayTemasTo.length) {
        me.validacionTemas.cantidadDiferente = true;
      }

      // Crear maps para comparación rápida
      const temasFromMap = new Map();
      me.arrayTemasFrom.forEach(tema => {
        const key = tema.unidad;
        if (!temasFromMap.has(key)) {
          temasFromMap.set(key, []);
        }
        temasFromMap.get(key).push(tema);
      });

      const temasToMap = new Map();
      me.arrayTemasTo.forEach(tema => {
        const key = tema.unidad;
        if (!temasToMap.has(key)) {
          temasToMap.set(key, []);
        }
        temasToMap.get(key).push(tema);
      });

      // Obtener todas las unidades únicas
      const todasLasUnidades = new Set([...temasFromMap.keys(), ...temasToMap.keys()]);

      // Encontrar temas diferentes por unidad
      const temasDiferentes = [];

      todasLasUnidades.forEach(unidad => {
        const temasFrom = temasFromMap.get(unidad) || [];
        const temasTo = temasToMap.get(unidad) || [];

        // Crear maps por nombre de tema para esta unidad
        const nombresFrom = new Map();
        temasFrom.forEach(tema => {
          nombresFrom.set(tema.nombre_tema, tema);
        });

        const nombresTo = new Map();
        temasTo.forEach(tema => {
          nombresTo.set(tema.nombre_tema, tema);
        });

        // Obtener todos los nombres de temas únicos para esta unidad
        const todosLosNombres = new Set([...nombresFrom.keys(), ...nombresTo.keys()]);

        todosLosNombres.forEach(nombreTema => {
          const temaFrom = nombresFrom.get(nombreTema);
          const temaTo = nombresTo.get(nombreTema);

          // Si no están ambos presentes, agregar a diferencias
          if (!temaFrom || !temaTo) {
            let asignatura = '';
            if (!temaFrom && temaTo) {
              asignatura = nombreAsignaturaTo;
            } else if (temaFrom && !temaTo) {
              asignatura = nombreAsignaturaFrom;
            }

            temasDiferentes.push({
              unidad: unidad,
              nombre_tema_desde: temaFrom ? temaFrom.nombre_tema : '---',
              nombre_tema_hasta: temaTo ? temaTo.nombre_tema : '---',
              asignatura: asignatura
            });
          }
        });
      });

      me.validacionTemas.temasDiferentes = temasDiferentes;

      // Es válido si no hay diferencia de cantidad y no hay temas diferentes
      me.validacionTemas.esValido = !me.validacionTemas.cantidadDiferente && temasDiferentes.length === 0;
    },
    f_moverPreguntas(){
      let me = this;

      // Validaciones antes de guardar
      if (!me.asignaturaSelectedFrom || !me.asignaturaSelectedTo) {
        me.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'Debe seleccionar ambas asignaturas'
        });
        return;
      }

      if (!me.validacionTemas.esValido) {
        me.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'No se puede copiar las preguntas porque los temas no coinciden'
        });
        return;
      }

      if (me.arrayPreguntasFrom.length === 0) {
        me.$vs.notify({
          color: 'warning',
          title: 'Advertencia',
          text: 'No hay preguntas para copiar en la asignatura origen'
        });
        return;
      }

      // Confirmar la acción
      const asignaturaFromObj = me.arrayAsignaturasOriginal.find(asig => asig.idasignatura === me.asignaturaSelectedFrom);
      const asignaturaToObj = me.arrayAsignaturasOriginal.find(asig => asig.idasignatura === me.asignaturaSelectedTo);

      const nombreAsignaturaFrom = asignaturaFromObj ? asignaturaFromObj.label : 'Asignatura origen';
      const nombreAsignaturaTo = asignaturaToObj ? asignaturaToObj.label : 'Asignatura destino';

      me.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Confirmar movimiento',
        text: `¿Está seguro de copiar ${me.arrayPreguntasFrom.length} pregunta${me.arrayPreguntasFrom.length === 1 ? '' : 's'} de "${nombreAsignaturaFrom}" hacia "${nombreAsignaturaTo}"? Esta acción no se puede deshacer.`,
        accept: () => {
          me.f_ejecutarMovimiento();
        },
        acceptText: 'Si, deseo copiar',
        cancelText: 'Cancelar',
      });
    },
    f_ejecutarMovimiento(){
      let me = this;
      me.$vs.loading();

      // Preparar las preguntas agregando la asignatura destino y datos de temas
      const preguntasConDestino = me.arrayPreguntasFrom.map(pregunta => {
        // Buscar el tema correspondiente en la asignatura destino
        const temaCorrespondiente = me.arrayTemasTo.find(tema =>
          tema.unidad == pregunta.unidad &&
          tema.nombre_tema == pregunta.nombre_tema
        );

        return {
          ...pregunta,
          id_asignatura_to: me.asignaturaSelectedTo,
          id_tema_destino: temaCorrespondiente ? temaCorrespondiente.id : null
        };
      });

      const params = {
        action: 'Post_Preguntas_x_Asignatura',
        id_asignatura_to: me.asignaturaSelectedTo,
        arrayPreguntas: JSON.stringify(preguntasConDestino),
        idusuario: me.usuario.idusuario
      };

      me.$http.post(me.$server_url + 'metodosPostPreguntas', params)
      .then(res => {
        me.$vs.loading.close();

        if (res.data.status == '1') {
          me.$vs.notify({
            color: 'success',
            title: 'Éxito',
            text: res.data.message
          });

          // Verificar si hay preguntas existentes
          if (res.data.preguntas_existentes && res.data.preguntas_existentes.length > 0) {
           console.log('Preguntas que ya existían:', res.data.preguntas_existentes);
            me.arrayPreguntasExistentes = res.data.preguntas_existentes;
            me.modalPreguntasExistentes = true;
          }

          // Limpiar los datos y volver a buscar
          me.f_limpiarDatos();
          me.f_buscarPreguntas();

        } else {
          me.$vs.notify({
            color: 'danger',
            title: 'Error',
            text: res.data.message || 'Error al copiar las preguntas'
          });
        }
      })
      .catch(error => {
        me.$vs.loading.close();
        console.error('Error al copiar preguntas:', error);
        me.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'Error de conexión al copiar las preguntas'
        });
      });
    },
    f_limpiarDatos(){
      let me = this;
      me.arrayPreguntasFrom = [];
      me.arrayPreguntasTo = [];
      me.arrayTemasFrom = [];
      me.arrayTemasTo = [];
      me.validacionTemas = {
        esValido: false,
        cantidadDiferente: false,
        temasDiferentes: []
      };
    },
  }
}
</script>

<style scoped>
/* Estilos para los filtros destacados */
.filtros-destacados {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.filtros-destacados p {
  color: #333;
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.filtro-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filtro-label {
  color: #495057;
  font-weight: 600;
  font-size: 0.95em;
  margin-bottom: 8px;
  display: block;
}

.filtro-radio {
  background: white;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Estilos para los radio buttons */
.filtro-radio .vs-radio {
  color: #495057 !important;
}

.filtro-radio .vs-radio .vs-radio--label {
  color: #495057 !important;
}

/* Ajustes para v-select dentro de filtros */
.filtro-item .v-select {
  background: #f8f9fa;
  border-radius: 6px;
}

.filtro-item .vs-component .vs-input {
  background: transparent;
  color: #333;
}
</style>
