<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-1/2 sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
        <span>Seleccione la región</span>
        <ul class="flex mt-2" style="flex-wrap: wrap;">
          <li class="mr-3">
            <vs-radio v-model="region" @input="arrayPeriodos=[];periodoSelectedArray=[];obtenerPeriodos();filtrarReporte(0);" vs-name="radios1tipoFiltro" vs-value="1">Sierra</vs-radio>
          </li>
          <li class="mr-3">
            <vs-radio v-model="region" @input="arrayPeriodos=[];periodoSelectedArray=[];obtenerPeriodos();filtrarReporte(0);" vs-name="radios1tipoFiltro" vs-value="2">Costa</vs-radio>
          </li>
        </ul>
      </div>
      <div class="vx-col w-1/2 sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
        <span>Seleccione el período</span>
        <div class="flex">
          <v-select
            :options="arrayPeriodos"
            :reduce="periodo => periodo.idperiodoescolar"
            label="periodoescolar"
            class="w-full mt-2"
            v-model="periodoSelectedArray"
            multiple
            @input="filtrarReporte(0);"
          />
          <!--boton para filtrar-->
          <vs-button color="primary" @click="filtrarReporte(1)" class="ml-2 mb-2 mt-2" type="filled">
            Filtrar
          </vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import PeriodoRepository from '@/repositories/PeriodoRepository';
export default {
  components: {
    'v-select': vSelect,
  },
  data() {
    return{
      arrayPeriodos:[],
      periodoSelectedArray: [],
      region:0,
    }
  },
  mounted() {
    this.region = this.tipoRegion;
    this.obtenerPeriodos();
  },
  props:{
    tipoRegion:{
      type:Number,
      default:1
    }
  },
  watch:{
    tipoRegion(newValue){
      this.region = newValue;
      this.arrayPeriodos=[];
      this.periodoSelectedArray=[];
      this.obtenerPeriodos();
    }
  },
  methods:{
    obtenerPeriodos() {
      this.arrayPeriodos = [];
      this.$vs.loading();
      PeriodoRepository.getPeriodos()
      .then(p => {
          this.arrayPeriodos = p.data
          this.filtrarPeriodos(p.data);
          this.$vs.loading.close();
      })
      .catch(error => {
          this.m_message("Error al cargar los períodos", "error");
          console.error(error);
          this.$vs.loading.close();
      });
    },
    filtrarPeriodos(datos) {
      this.arrayPeriodos = datos.filter(p => p.region_idregion == this.region);
    },
    filtrarReporte(accion){
      let me = this;
      me.$emit('changePeriodo', me.periodoSelectedArray, me.arrayPeriodos, me.region,accion)
    },
  }
}
</script>
