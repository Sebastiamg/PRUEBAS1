<template>
  <div>
    <div>
      <b>Institucion:</b>
      <p>{{ nombreInstitucion }}</p>
      <b>Período:</b>
      <p>{{ periodoNombre }}</p>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2" v-if="usuario.id_group == 1">
        <small>Período:</small>
        <v-select @input="getEvaluaciones()" :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos.idperiodoescolar" label="periodoescolar" placeholder="--Seleccione--" class="w-full" v-model="periodoSelected" />
      </div>
      <!--radios-->
      <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mt-6">
        <ul class="flex">
          <li>
            <vs-radio v-model="tipoFiltro" @input="nivel_id = null; id_asignatura = null;arrayEstudiantes=[];getEvaluaciones();" class="mr-3" vs-name="radios1tipoFiltro" vs-value="0">Todos</vs-radio>
          </li>
          <li>
            <vs-radio v-model="tipoFiltro" @input="nivel_id=null;arrayEstudiantes=[];" class="mr-3" vs-name="radios1tipoFiltro" vs-value="2">Filtrar por asignatura</vs-radio>
          </li>
          <li>
            <!--boton filtrar-->
            <vs-button color="primary" @click="getEvaluaciones();" class="mb-5 ml-5" style="margin-top: -5px;"><i class="fa-solid fa-magnifying-glass-plus"></i> Filtrar</vs-button>
          </li>
        </ul>
      </div>
    </div>

    <!--nivel-->
     <div v-if="tipoFiltro == 1">
        <small>Filtrar por nivel:</small>
        <v-select @input="getEvaluaciones();" :options="arrayNiveles" :reduce="arrayNiveles => arrayNiveles.idnivel" label="nombrenivel" placeholder="--Seleccione--" class="w-full" v-model="nivel_id" />
        <br>
    </div>
    <!--asignatura-->
    <div v-if="tipoFiltro == 2">
        <small>Filtrar por asignatura:</small>
        <v-select @input="getEvaluaciones();" :options="arrayAsignaturas" :reduce="arrayAsignaturas => arrayAsignaturas.id_asignatura" label="nombreasignatura" placeholder="--Seleccione--" class="w-full" v-model="id_asignatura" />
        <br>
    </div>

    <!--Filtro por nivel con radios-->
    <div v-if="arrayEstudiantes.length > 0" class="mt-4">
      <div class="vx-row">
        <div class="vx-col w-full">
          <h5 class="mb-3">Filtrar por nivel:</h5>
          <ul class="flex flex-wrap">
            <li class="mr-4 mb-2">
              <vs-radio v-model="nivelFiltroTabla" @input="filtrarTablaPorNivel" vs-name="radiosNivelTabla" :vs-value="null">
                Todos <b>{{ arrayEstudiantes.length }}</b>
              </vs-radio>
            </li>
            <li v-for="nivel in nivelesDisponibles" :key="nivel.nombre" class="mr-4 mb-2">
              <vs-radio v-model="nivelFiltroTabla" @input="filtrarTablaPorNivel" vs-name="radiosNivelTabla" :vs-value="nivel.nombre">
                {{ nivel.nombre }} <b>{{ nivel.cantidad }}</b>
              </vs-radio>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--Exportar-->
    <div v-if="arrayEstudiantes.length > 0" class="mt-2">
      <vs-button color="success" @click="ExportToExcel();" style="font-size: 14px;" class="p-3"><i class="fa-solid fa-download"></i> Exportar</vs-button>
    </div>

    <vs-table max-items="10" search pagination :data="estudiantesFiltrados" id="miTabla" stripe>
      <template slot="header">
        <vs-chip color="primary">Cantidad: <b>{{ estudiantesFiltrados.length }}</b></vs-chip>
      </template>

      <template slot="thead">
        <vs-th width="250">Estudiante</vs-th>
        <vs-th>Cédula</vs-th>
        <vs-th>Email</vs-th>
        <vs-th v-for="nombre in nombresEvaluacionesFiltradas" :key="nombre">{{ nombre }}</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr v-for="(est, index) in data" :key="index">
          <vs-td>{{ est.estudiante }}</vs-td>
          <vs-td>{{ est.cedulaEstudiante }}</vs-td>
          <vs-td>{{ est.emailEstudiante }}</vs-td>
          <vs-td v-for="nombre in nombresEvaluacionesFiltradas" :key="nombre">
            {{ obtenerNota(est, nombre) }}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Generalmix from '../../../mixins/Generalmix';
import PeriodoRepository from '@/repositories/PeriodoRepository';
import * as XLSX from 'xlsx';
export default {
  mixins: [Generalmix],
  components: {
    vSelect
  },
  data() {
    return {
      arrayEstudiantes: [],
      nombresEvaluaciones: [], // columnas dinámicas
      arrayNiveles:[],
      arrayAsignaturas:[],
      arrayPeriodos:[],
      id_asignatura: null,
      nivel_id: null,
      periodoSelected:null,
      periodoNombre:null,
      nombreInstitucion:null,
      tipoFiltro:0,
      usuario:[],
      nivelFiltroTabla: null, // Filtro de nivel para la tabla
      estudiantesFiltrados: [], // Estudiantes filtrados por nivel
      letraBachillerato:'BG' // Letra para identificar bachillerato en el nombre del nivel
    };
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  async mounted() {
    await this.obtenerPeriodos();
    await this.getPeriodoInstitucion();
    await this.getNiveles();
    await this.getEvaluaciones();
  },
  computed: {
    nivelesDisponibles() {
      // Obtener niveles únicos con su cantidad de estudiantes
      const nivelesMap = {};

      this.arrayEstudiantes.forEach(est => {
        est.evaluaciones.forEach(ev => {
          const nivel = ev.nombrenivel;
          if (!nivelesMap[nivel]) {
            nivelesMap[nivel] = new Set();
          }
          nivelesMap[nivel].add(est.id_estudiante);
        });
      });

      // Convertir a array y ordenar (Bachillerato al final)
      const niveles = Object.keys(nivelesMap).map(nombre => ({
        nombre: nombre,
        cantidad: nivelesMap[nombre].size
      })).sort((a, b) => {
        const esBGU_a = a.nombre.includes(this.letraBachillerato);
        const esBGU_b = b.nombre.includes(this.letraBachillerato);

        // Si ambos son Bachillerato o ambos no son Bachillerato, ordenar alfabéticamente
        if (esBGU_a === esBGU_b) {
          // Ordenamiento natural para manejar números correctamente
          return a.nombre.localeCompare(b.nombre, undefined, { numeric: true, sensitivity: 'base' });
        }

        // Los que NO son Bachillerato van primero
        return esBGU_a ? 1 : -1;
      });

      return niveles;
    },
    nombresEvaluacionesFiltradas() {
      if (!this.nivelFiltroTabla) {
        return this.nombresEvaluaciones;
      }

      // Obtener solo las evaluaciones del nivel seleccionado
      const nombres = new Set();
      this.estudiantesFiltrados.forEach(est => {
        est.evaluaciones.forEach(ev => {
          if (ev.nombrenivel === this.nivelFiltroTabla) {
            nombres.add(ev.curso_nombre_evaluacion);
          }
        });
      });

      return Array.from(nombres);
    }
  },
  props:{
    docente:{
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  methods: {
    async getPeriodoInstitucion() {
      this.periodoSelected = null;
      this.periodoNombre = null;
      this.nombreInstitucion = null;

      try {
        const res = await this.$http.get(
          this.$server_url + 'getPeriodoInstitucion/' + this.docente.institucion_idInstitucion
        );
        if (res.data.length == 0) {
          this.m_message("No existe periodo para la institución seleccionada", "warning");
        } else {
          this.periodoSelected = res.data[0].periodo;
          this.periodoNombre = res.data[0].descripcion;
          this.nombreInstitucion = res.data[0].nombreInstitucion;
        }
      } catch (error) {
        console.log(error + ' error');
      }
    },
    async obtenerPeriodos() {
      try {
        const p = await PeriodoRepository.getPeriodos();
        this.arrayPeriodos = p.data;
      } catch (error) {
        this.m_message("Error al cargar los períodos", "error");
        console.error(error);
      }
    },
    async getNiveles() {
      try {
        const res = await this.$http.get(this.$server_url + 'getNiveles');
        this.arrayNiveles = res.data;
      } catch (error) {
        console.log(error + ' error');
      }
    },
    async getEvaluaciones() {
      this.arrayEstudiantes = [];

      if (!this.periodoSelected) {
        this.m_message("Debe seleccionar un período", "warning");
        return;
      }

      if (this.tipoFiltro == 1 && !this.nivel_id) {
        this.m_message("Debe seleccionar un nivel", "warning");
        return;
      }

      if (this.tipoFiltro == 2 && !this.id_asignatura) {
        this.m_message("Debe seleccionar una asignatura", "warning");
        return;
      }

      this.$vs.loading();

      try {
        const res = await this.$http.get(this.$server_url + "metodoGetEvaluacion", {
          params: {
            action: 'Get_Reporte_General',
            id_docente: this.docente.idusuario,
            institucion_idInstitucion: this.docente.institucion_idInstitucion,
            id_asignatura: this.id_asignatura,
            id_nivel: this.nivel_id,
            periodoSelected: this.periodoSelected,
          }
        });

        this.$vs.loading.close();

        this.arrayEstudiantes = res.data.arrayReporte;
        this.arrayAsignaturas = res.data.arrayAsignaturasDocentes;

        if (this.arrayEstudiantes.length === 0) {
          this.m_message("No hay estudiantes con estos criterios", "warning");
          return;
        }

        const nombres = new Set();
        this.arrayEstudiantes.forEach(est => {
          est.evaluaciones.forEach(ev => {
            nombres.add(ev.curso_nombre_evaluacion);
          });
        });

        this.nombresEvaluaciones = Array.from(nombres);
        this.nivelFiltroTabla = null;
        this.estudiantesFiltrados = this.arrayEstudiantes;
      } catch (error) {
        this.$vs.loading.close();
        if (error.response && error.response.data && error.response.data.error) {
          this.m_message(error.response.data.error, "warning");
        } else {
          this.m_message("Error al cargar los datos", "danger");
          console.error("Error no controlado:", error);
        }
      }
    },
    obtenerNota(est, nombreEval) {
      const evalEncontrada = est.evaluaciones.find(ev => ev.curso_nombre_evaluacion === nombreEval);
      return evalEncontrada ? evalEncontrada.calificacion : 0;
    },
    filtrarTablaPorNivel() {
      if (!this.nivelFiltroTabla) {
        // Mostrar todos
        this.estudiantesFiltrados = this.arrayEstudiantes;
      } else {
        // Filtrar estudiantes que tengan evaluaciones del nivel seleccionado
        this.estudiantesFiltrados = this.arrayEstudiantes.filter(est => {
          return est.evaluaciones.some(ev => ev.nombrenivel === this.nivelFiltroTabla);
        });
      }
    },
    ExportToExcel() {
      let nombreDocente = this.docente.nombres + ' ' + this.docente.apellidos;
      let nombreArchivo = '';

      if (this.tipoFiltro == 0) {
        nombreArchivo = 'Reporte_General_' + nombreDocente;
      } else if (this.tipoFiltro == 1) {
        const nivelSeleccionado = this.arrayNiveles.find(niv => niv.idnivel == this.nivel_id);
        const nombreNivel = nivelSeleccionado ? nivelSeleccionado.nombrenivel.replace(/\s+/g, '_') : 'Nivel_Desconocido';
        nombreArchivo = 'Reporte_Nivel_' + nombreDocente + '_' + nombreNivel;
      } else if (this.tipoFiltro == 2) {
        const asignaturaSeleccionada = this.arrayAsignaturas.find(asig => asig.id_asignatura == this.id_asignatura);
        const nombreAsignatura = asignaturaSeleccionada ? asignaturaSeleccionada.nombreasignatura.replace(/\s+/g, '_') : 'Asignatura_Desconocida';
        nombreArchivo = 'Reporte_Asignatura_' + nombreDocente + '_' + nombreAsignatura;
      }

      // Crear libro de Excel
      const wb = XLSX.utils.book_new();

      // Agrupar estudiantes por nivel
      const estudiantesPorNivel = {};

      this.arrayEstudiantes.forEach(est => {
        est.evaluaciones.forEach(ev => {
          const nivel = ev.nombrenivel;
          if (!estudiantesPorNivel[nivel]) {
            estudiantesPorNivel[nivel] = [];
          }
          // Verificar si el estudiante ya está agregado en este nivel
          let estudianteExistente = estudiantesPorNivel[nivel].find(e => e.id_estudiante === est.id_estudiante);
          if (!estudianteExistente) {
            estudiantesPorNivel[nivel].push({
              id_estudiante: est.id_estudiante,
              estudiante: est.estudiante,
              cedulaEstudiante: est.cedulaEstudiante,
              emailEstudiante: est.emailEstudiante,
              evaluaciones: []
            });
            estudianteExistente = estudiantesPorNivel[nivel][estudiantesPorNivel[nivel].length - 1];
          }
          // Agregar evaluaciones del mismo nivel
          estudianteExistente.evaluaciones.push(ev);
        });
      });

      // Ordenar niveles: Bachillerato al final
      const nivelesOrdenados = Object.keys(estudiantesPorNivel).sort((a, b) => {
        const esBGU_a = a.includes(this.letraBachillerato);
        const esBGU_b = b.includes(this.letraBachillerato);

        // Si ambos son Bachillerato o ambos no son Bachillerato, ordenar alfabéticamente
        if (esBGU_a === esBGU_b) {
          return a.localeCompare(b);
        }

        // Los que NO son Bachillerato van primero
        return esBGU_a ? 1 : -1;
      });

      // Crear una pestaña por cada nivel
      nivelesOrdenados.forEach(nombreNivel => {
        const estudiantesDelNivel = estudiantesPorNivel[nombreNivel];

        // Obtener nombres de evaluaciones únicas para este nivel
        const nombresEvaluacionesNivel = new Set();
        estudiantesDelNivel.forEach(est => {
          est.evaluaciones.forEach(ev => {
            nombresEvaluacionesNivel.add(ev.curso_nombre_evaluacion);
          });
        });

        const evaluacionesOrdenadas = Array.from(nombresEvaluacionesNivel);

        // Armar datos para este nivel
        const datosParaExcel = estudiantesDelNivel.map(est => {
          let fila = {
            'Estudiante': est.estudiante,
            'Cédula': est.cedulaEstudiante,
            'Email': est.emailEstudiante
          };

          evaluacionesOrdenadas.forEach(nombreEval => {
            const evalu = est.evaluaciones.find(ev => ev.curso_nombre_evaluacion === nombreEval);
            fila[nombreEval] = evalu ? evalu.calificacion : 0;
          });

          return fila;
        });

        // Crear hoja para este nivel
        const ws = XLSX.utils.json_to_sheet(datosParaExcel);

        // Sanitizar nombre de la pestaña (Excel tiene límite de 31 caracteres y no permite ciertos caracteres)
        let nombrePestana = nombreNivel.replace(/[:\\\/\?\*\[\]]/g, '').substring(0, 31);

        XLSX.utils.book_append_sheet(wb, ws, nombrePestana);
      });

      // Guardar archivo
      XLSX.writeFile(wb, nombreArchivo + '.xlsx');
    },
  }
};
</script>
