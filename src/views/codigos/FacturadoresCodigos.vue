<template>
    <div>
        <vs-card class="flex">
            <vs-button color="primary" @click="vSeccionCodigo = false" type="border">Códigos Individuales</vs-button>
            <vs-button color="success" @click="vSeccionCodigo = true" class="ml-2" type="border">Códigos Agrupados</vs-button>
       </vs-card>
        <vs-card>
            <div>
                <div class="vx-col w-full mt-5">
                  <ul class="flex">
                    <li class="modelx mt-1 mr-2">
                      Región
                    </li>
                    <li class="mr-2">
                      <vs-radio v-model="region" @input="filtrarInstituciones()" vs-name="radios1region" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li>
                      <vs-radio v-model="region" @input="filtrarInstituciones()" vs-name="radios1region" vs-value="2">Costa</vs-radio>
                    </li>
                  </ul>
                </div>
                <div class="vx-col w-full mt-5">
                  Institución:
                    <v-select :options="arregloTraeInstitucion" :reduce="arregloTraeInstitucion => arregloTraeInstitucion" label="nombreInstitucion" class="w-full" v-model ="liquidacion.institucion" />
                </div>
                <br>
                <ul class="leftx">
                    <li class="modelx">
                    Seleccione que tipo de periodos desea filtrar
                    </li>
                    <br>
                    <li>
                    <vs-radio v-model="liquidacion.condicion"  @input="filtrarPeriodos()"  vs-name="radios1" vs-value="1">Activos</vs-radio>
                    </li>
                    <li>
                    <vs-radio v-model="liquidacion.condicion" @input="filtrarPeriodos()"  vs-name="radios1" vs-value="0">Inactivos</vs-radio>
                    </li>
                </ul>
            </div>
            <div class="vx-col w-full mt-5">
                Periodo:
                <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodo" class="w-full" v-model ="liquidacion.periodo" />
            </div>
            <br>
            <vs-button color="primary" size="small" type="filled" @click="filtrarCodigos();">
                Filtrar
            </vs-button>
        </vs-card>
        <div v-if="vSeccionCodigo == false">
         <p>Se listan los códigos <span style="font-weight: bold;">Individuales,</span> asociados al estudiante</p>
            <seccionCodigos :arregloCodigosIndividuales = "arregloCodigosIndividuales" :lperiodo="liquidacion.periodo.idperiodoescolar" :linstitucion="liquidacion.institucion.idInstitucion" @recharge="buscarReportesLibrosAsesor"/>
         </div>
        <div v-if="vSeccionCodigo == true">
            <p>Se listan los códigos <span style="font-weight: bold;">Agrupados,</span> asociados al estudiante</p>
            <gestionliquidacion  :arregloLiquidacion = "arregloLiquidacion" />
        </div>
    </div>
</template>
<script>
import seccionCodigos from './components/seccionCodigos.vue'
import gestionliquidacion from '../librosserie/gestionliquidacion.vue'
import vSelect from 'vue-select'
export default{
    components:{
        vSelect,
        seccionCodigos,
        gestionliquidacion,
    },
    data(){
        return{
            vSeccionCodigo:false,
            liquidacion:{
              institucion:'',
              periodo:'',
              condicion:'1',
            },
            arregloCiudad:[],
            arregloTraeInstitucion:[],
            arregloPeriodos:[],
            ciudadSelect:'',
            arregloLiquidacion:[],
            arregloCodigosIndividuales:[],
            region:1,
        }
    },
    mounted(){
      let me = this;
      me.filtrarInstituciones()
    },
    methods:{
      filtrarInstituciones(){
        let me = this
        me.arregloTraeInstitucion = []
        me.liquidacion.institucion = ""
        me.$vs.loading()
        this.$http.get(this.$server_url+`institucion?listaInstitucionesActivaXRegion=yes&region=${ me.region }`)
        .then(function (res) {
          me.$vs.loading.close()
          me.arregloTraeInstitucion = res.data;
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
      },
      //para filtrar periodos por institucioin
      filtrarPeriodos(){
        let me = this;
        me.arregloCodigosIndividuales = []
        me.arregloLiquidacion         = []
        if( me.liquidacion.institucion.region_idregion === undefined ){
          me.$vs.notify({
            text:'Seleccione una institucion antes de filtrar por Periodos',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
          return;
        }
        me.arregloPeriodos = []
        me.$vs.loading()
        const formData = new FormData();
        formData.append('condicion', me.liquidacion.condicion);
        formData.append('region_idregion', me.liquidacion.institucion.region_idregion);
        this.$http.post(this.$server_url+'traerperiodos', formData).then(res => {
          me.arregloPeriodos = res.data;
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error);
        })
      },
      filtrarCodigos(){
        let me = this;
        if(me.vSeccionCodigo == false){
          me.buscarReportesLibrosAsesor()
        }else{
          me.filtrarLiquidacion()
        }
      },
      //para filtrar la liquidacion
      filtrarLiquidacion(){
        let me = this;
        me.arregloLiquidacion = []
        if(me.liquidacion.periodo == null || me.liquidacion.periodo == undefined || me.liquidacion.periodo == ""){
            this.$vs.notify({
                text: 'No ha seleccionado un periodo',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            })
            return false
        }
        me.$vs.loading()
        this.$http.get(this.$server_url+'liquidacionperiodo?id_periodo='+me.liquidacion.periodo.idperiodoescolar+'&idinstitucion='+me.liquidacion.institucion.idInstitucion)
        .then(res => {
            me.arregloLiquidacion = res.data;
            me.$vs.loading.close()
        })
        .catch(function (error) {
            me.$vs.loading.close()
            console.log(error);
        })
      },
      buscarReportesLibrosAsesor() {
        let me  = this;
        if(me.liquidacion.periodo == null || me.liquidacion.periodo == undefined || me.liquidacion.periodo == ""){
            this.$vs.notify({
                text: 'No ha seleccionado un periodo',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            })
            return false
        }
        this.arregloCodigosIndividuales = [];
        this.openLoadingColor();
        this.$http.get(this.$server_url+'reportesCodigoAsesor/' + me.liquidacion.institucion.idInstitucion+'/'+me.liquidacion.periodo.idperiodoescolar)
        .then(res => {
            this.$vs.loading.close()
            if (res.data[0] === undefined) {
                this.$vs.notify({
                    text: 'No existen códigos asignados a esta institución',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return false
            }
            this.arregloCodigosIndividuales = res.data

        })
        .catch(function(e){
            this.$vs.loading.close()
        })
      },
      openLoadingColor(libro) {
        this.$vs.loading({
            color: '#1A76F2'
        })
        /*setTimeout(() => {
            this.$vs.loading.close()
        }, 2000);*/
      },
    }
}
</script>
