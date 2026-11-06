<template>
  <div>
    <vs-alert color="primary" icon="primary" class="mt-5">
      Este reporte es de reporte de visitas por periodos de ingresos al sistema
    </vs-alert>
      <div class="mt-5">
        <PeriodoReutilizableMultipleVue @changePeriodo="changePeriodo" :tipoRegion="institucionSelected.region"/>
      </div>
      <vx-card title="Reporte visitas Docentes" class="mt-5" v-if="reporteProfesores.length > 0">
        <TableReutilizableVue
          :title="'Visitas Profesores'"
          :headers="['Periodo', 'Visitas']"
          :fieldKeys="['key', 'value']"
          :tableData="reporteProfesores"
          :ifexportar="Number(1)"
          :nombrearchivo="'Reporte visitas Docentes '+institucionSelected.nombreInstitucion"
        />
      </vx-card>

      <vx-card title="Reporte visitas Estudiantes" class="mt-5" v-if="reporteEstudiantes.length > 0">
        <TableReutilizableVue
          :title="'Visitas Estudiantes'"
          :headers="['Periodo', 'Visitas']"
          :fieldKeys="['key', 'value']"
          :tableData="reporteEstudiantes"
          :ifexportar="Number(1)"
          :nombrearchivo="'Reporte visitas Docentes '+institucionSelected.nombreInstitucion"
        />
      </vx-card>
      <br><br><br><br><br><br><br><br>
  </div>
</template>
<script>
import Generalmix from '../../../../mixins/Generalmix';
const PeriodoReutilizableMultipleVue = () => import('../../../codigos/reportes/PeriodoReutilizableMultiple.vue');
const TableReutilizableVue           = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default{
  mixins: [Generalmix],
  components:{
    PeriodoReutilizableMultipleVue,
    TableReutilizableVue,
  },
  data(){
    return{
      arrayReporte    : [],
      arregloFormato  : [],
      periodoSelectedArray : [],
      arrayPeriodos   : [],
      tipoRegion      : null,
      arraySendPeriodos:[],
      //accion ; 0 = no ejecutar; 1 = ejecutar
      accion:0
    }
  },
  props:{
    institucionSelected:{
      type:Object,
      default:function(){

      }
    },
  },
  computed: {
    // reporteProfesores() {
    //   if (!this.arrayReporte || !this.arrayReporte.profesores) return [];
    //   return Object.entries(this.arrayReporte.profesores).map(([key, value]) => ({
    //     key,
    //     value
    //   }));
    // },
    // reporteEstudiantes() {
    //   if (!this.arrayReporte || !this.arrayReporte.estudiantes) return [];
    //   return Object.entries(this.arrayReporte.estudiantes).map(([key, value]) => ({
    //     key,
    //     value
    //   }));
    // }
    reporteProfesores() {
      if (!this.arrayReporte || !this.arrayReporte.profesores) return [];
      return Object.entries(this.arrayReporte.profesores).map(([key, value]) => ({
        key: key.replace('visitas_', '').replace('_', ' '), // Formateo del key
        value // valor original
      }));
    },
    reporteEstudiantes() {
      if (!this.arrayReporte || !this.arrayReporte.estudiantes) return [];
      return Object.entries(this.arrayReporte.estudiantes).map(([key, value]) => ({
        key: key.replace('visitas_', '').replace('_', ' '),
        value
      }));
    }
  },
  methods:{
    changePeriodo(periodoSelectedArray, periodos, tipoRegion,vaccion){
      let me = this;
      this.arrayReporte         = [];
      this.arregloFormato       = [];
      this.arraySendPeriodos    = [];
      this.accion               = vaccion
      this.periodoSelectedArray = periodoSelectedArray
      this.arrayPeriodos        = periodos
      this.tipoRegion           = tipoRegion
      //recorrer el periodoSelectedArray agregar propiedad id y la propiedad descripcion traer del arrayPeriodo el campo periodoescolar
      periodoSelectedArray.forEach(p => {
        let periodo = periodos.filter(pp => pp.idperiodoescolar == p)
        this.arraySendPeriodos.push(periodo[0])
      })
      if(me.accion == 1){
        this.$nextTick(() => {
          this.f_getReporte();
        });
      }
    },
    f_getReporte(){
      let me = this;
      let formData = new FormData();
      formData.append('action','Post_TrarAgrupadoVisitas');
      formData.append('institucion_id', me.institucionSelected.idInstitucion);
      formData.append('arraySendPeriodos',JSON.stringify(this.arraySendPeriodos))
      me.$vs.loading()
      this.$http.post(this.$server_url + 'metodosPostInstitucion', formData)
      .then(res => {
          me.$vs.loading.close()
          me.arrayReporte = res.data
      })
      .catch(error => {
          me.$vs.loading.close()
          console.error(error);
          if (error.response.data.error) {
              me.m_message(error.response.data.message, 'danger');
          } else {
              me.m_message("Error al obtener los reportes", "danger");
          }
      })
    }
  }
}
</script>
