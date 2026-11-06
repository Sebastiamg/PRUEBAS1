<template>
  <div>
    <vs-alert style="height: 70px;">
      <p class="text-center">Aqui se detalle todas las preguntas de la temporada de evaluación</p>
    </vs-alert>
    <!-- Filtro por tipo de pregunta -->
    <div class="mb-4" style="background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb;">
      <div class="flex items-center mb-3">
        <div style="background-color: #dbeafe; border-radius: 8px; padding: 8px; margin-right: 12px;">
          <i class="fa-solid fa-filter text-blue-600 text-lg"></i>
        </div>
        <h3 style="font-weight: bold; color: #1f2937; font-size: 1.125rem;">Filtrar por tipo de pregunta</h3>
      </div>
      <v-select
        :options="tiposPreguntas"
        :reduce="tipo => tipo"
        label="nombre_tipo"
        placeholder="-- Todos los tipos --"
        class="w-full"
        v-model="tipoPreguntaSeleccionado"
        :clearable="true"
      >
        <template #no-options>
          No hay tipos de preguntas disponibles
        </template>
      </v-select>
    </div>

    <div>
      <vs-table max-items="10" stripe search pagination :data="preguntasFiltradas">
        <template slot="header">
          <div class="flex items-center gap-3">
            <vs-chip color="primary">Cantidad: <b> {{ preguntasFiltradas.length }}</b></vs-chip>
            <vs-button
              class="px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
              @click="exportarExcel"
              color="success"
              size="small"
            >
              <i class="fa-solid fa-file-excel mr-2"></i>
              Exportar a Excel
            </vs-button>
          </div>
        </template>
        <template slot="thead">
            <vs-th sort-key="id_pregunta">Pregunta</vs-th>
            <vs-th sort-key="nombre_asignatura">Detalle</vs-th>
            <vs-th sort-key="total_opciones_correctas">Opciones correctas</vs-th>
            <vs-th sort-key="total_opciones_incorrectas">Opciones incorrectas</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  #{{ tr.id_pregunta }}<br>
                    <span v-html="tr.descripcion"></span><br>
                    <b>Tipo de pregunta:</b>
                    <p>{{ tr.nombre_tipo }}</p>
                    <b>Puntaje pregunta:</b>
                    <p>{{ tr.puntaje_pregunta }}</p>
                    <div>
                      <img v-if="tr.img_pregunta!='' && tr.img_pregunta!='null' && tr.img_pregunta!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+tr.img_pregunta" class="img-responsive" width="100px" style="border-radius: 5px;">
                    </div>
                </vs-td>
                <vs-td>
                  <b>Área:</b>
                  <p>{{ tr.nombre_area }}</p>
                  <b>Asignatura:</b>
                  <p>{{ tr.nombre_asignatura }}</p>
                </vs-td>
                <vs-td>
                 <p>{{ tr.total_opciones_correctas }}</p>
                </vs-td>
                <vs-td>
                  <p>{{ tr.total_opciones_incorrectas }}</p>
                </vs-td>
                <vs-td>
                  <vs-button class="p-2" @click="editarFormulario(tr)">
                   📝Editar
                  </vs-button>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
      <!--popup para editar-->
      <vs-popup class="popupHijo" fullscreen title="Editar Pregunta" :active.sync="popupEditPregunta">
        <div v-if="popupEditPregunta">
          <CrearPreguntaSalleVue
            :usuario              = "usuario"
            :editarActivo         = "Boolean(true)"
            :guardadoActivo       = "Boolean(false)"
            :pregTipo             = "pregTipo"
            :puntaje_pregunta     = "puntaje_pregunta"
            :arregloPeriodos      = "arregloPeriodos"
            :periodoSelect        = "Number(periodoSelect)"
            :titPregTipo          = "titPregTipo"
            :txtPregTipo          = "txtPregTipo"
            :areas                = "arrayAreas"
            :asignaturas          = "arrayAsignaturas"
            :active1              = "Boolean(true)"
            :area_pregunta        = "area_pregunta"
            :asignatura_pregunta  = "asignatura_pregunta"
            :preguntaSelect       = "preguntaSelect"
            @changeRecharge       = "changeRecharge"
          />
        </div>
      </vs-popup>
    </div>
  </div>
</template>
<script>
import Generalmix from '@/mixins/Generalmix';
import * as XLSX from 'xlsx';
import moment from 'moment';
import vSelect from 'vue-select';
import CrearPreguntaSalleVue  from './CrearPreguntaSalle.vue';
export default{
  mixins:[Generalmix],
  components: {
    'v-select': vSelect,
    CrearPreguntaSalleVue
  },
  data(){
      return{
        arrayPreguntas: [],
        usuario: {},
        tipoPreguntaSeleccionado: null,
        pregTipo: 1,
        area_pregunta: {},
        asignatura_pregunta: {},
        preguntaSelect: {},
        popupEditPregunta: false,
        arrayAsignaturas: [],
        titPregTipo: '',
        txtPregTipo: '',
        puntaje_pregunta:1,
      }
  },
  props:{
    periodoSelect:{
      type:Object,
      default:null
    },
    arrayAreas:{
      type:Array,
      default:[]
    },
    arregloPeriodos:{
      type:Array,
      default:[]
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
  },
  mounted(){
    let me = this;
    me.f_getCantidadRespuestasPreguntas();
  },
  computed: {
    // Obtener tipos únicos de preguntas
    tiposPreguntas() {
      const tipos = this.arrayPreguntas.map(p => ({
        id_tipo_pregunta: p.id_tipo_pregunta,
        nombre_tipo: p.nombre_tipo
      }));

      // Eliminar duplicados usando un Map
      const tiposUnicos = Array.from(
        new Map(tipos.map(item => [item.id_tipo_pregunta, item])).values()
      );

      return tiposUnicos;
    },
    // Filtrar preguntas según el tipo seleccionado
    preguntasFiltradas() {
      if (!this.tipoPreguntaSeleccionado) {
        return this.arrayPreguntas;
      }
      return this.arrayPreguntas.filter(
        pregunta => pregunta.id_tipo_pregunta === this.tipoPreguntaSeleccionado.id_tipo_pregunta
      );
    }
  },
  methods:{
    changeRecharge(e){
      let me = this;
      me.$emit('changeRecharge', e);
      me.f_getCantidadRespuestasPreguntas();
      me.$nextTick(() => {
        // me.popupEditPregunta = false;
      });
    },
    getAsignaturas(){
      let me = this
      this.$http.get(this.$server_url+'asignaturas_area_salle/' + me.area_pregunta.id_area)
      .then(res => {
          me.arrayAsignaturas = res.data;
      })
      .catch(function (error) {
          console.log(error);
      })
    },
     cargarModalTipo(){
      switch (this.pregTipo) {
        case 1:
            this.titPregTipo='Crear pregunta de opción múltiple.';
            this.txtPregTipo='Esta pregunta puede tener una o varias opciones correctas. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
            break;
        case 2:
            this.titPregTipo='Crear pregunta cerrada';
            this.txtPregTipo='Esta pregunta debe ser respondida de forma escrita. La respuesta correcta debe contener palabras clave para poder comparar con la respuesta del estudiante.';
            break;
        case 3:
            this.titPregTipo='Crear pregunta de Verdadero o Falso';
            this.txtPregTipo='Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
            break;
        case 4:
            this.titPregTipo='Crear pregunta de tipo dicotómica (Si o No)';
            this.txtPregTipo='Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
            break;
        case 5:
            this.titPregTipo='Crear pregunta de selección simple';
            this.txtPregTipo='Esta pregunta puede tener solo una opción correcta. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
            break;
      }
    },
    editarFormulario(item){
      let me                  = this;
      me.pregTipo             = item.id_tipo_pregunta;
      me.puntaje_pregunta     = item.puntaje_pregunta;
      me.area_pregunta        = {id_area: item.id_area, nombre_area: item.nombre_area}
      me.asignatura_pregunta  = {id_asignatura: item.id_asignatura, nombre_asignatura: item.nombre_asignatura};
      me.preguntaSelect       = item
      me.getAsignaturas()
      me.cargarModalTipo()
      me.$nextTick(() => {
        me.popupEditPregunta = true
      })
    },
    f_getCantidadRespuestasPreguntas(){
      let me = this;
      me.arrayPreguntas = [];
      me.$vs.loading();
      this.$http.get(this.$server_url + `metodosGetPreguntasSalle?getPreguntasXPeriodoTipo=1&periodo=${me.periodoSelect}`)
      .then(function (res) {
         me.arrayPreguntas = res.data;
         if(me.arrayPreguntas.length == 0){
          me.m_message('No hay preguntas para el periodo seleccionado', 'warning');
         }
          me.$vs.loading.close();
      })
      .catch(function (error) {
        console.log(error + ' error');
        me.$vs.loading.close();
        me.m_message('Error al cargar las preguntas', 'danger');
      })
    },
    exportarExcel() {
      try {
        const datosExcel = this.preguntasFiltradas.map(item => ({
          'ID Pregunta': item.id_pregunta,
          'Descripción': item.descripcion ? item.descripcion.replace(/<[^>]*>/g, '') : '', // Remover HTML
          'Tipo de Pregunta': item.nombre_tipo,
          'Asignatura': item.nombre_asignatura,
          'Área': item.nombre_area,
          'Opciones Correctas': item.total_opciones_correctas,
          'Opciones Incorrectas': item.total_opciones_incorrectas
        }));

        const ws = XLSX.utils.json_to_sheet(datosExcel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Preguntas');

        const fechaHora = moment().format('YYYY-MM-DD_HH-mm-ss');
        const nombreArchivo = `Preguntas_${fechaHora}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

        this.m_message('Archivo Excel generado exitosamente', 'success');
      } catch (error) {
        console.error('Error al exportar:', error);
        this.m_message('Error al generar el archivo Excel', 'error');
      }
    }
  }
};
</script>
<style scoped>
.popupHijo{
    z-index: 51005;
    /* Valor mayor que el del popup del padre */
}
</style>
