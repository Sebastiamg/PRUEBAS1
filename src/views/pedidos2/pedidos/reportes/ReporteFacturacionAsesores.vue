<template>
    <div style="width: 100%;">
        <h3 class="text-center mt-1">Reporte de Documentos de Facturación <b>{{ nombrePeriodo }}</b></h3>
        <!-- <div>
            <div class="container" style="position: relative;top:-8px;">
                <div class="date-grid mt-4">
                    <div class="date-field">
                        <p>Región</p>
                    </div>
                    <div class="date-field">
                        <div>
                            <ul class="flex" style="flex-wrap: wrap;">
                                <li class="mr-3">
                                    <vs-radio v-model="tipoRegion" @input="arrayPeriodos=[];arrayReporte=[];periodoSelected='';obtenerPeriodos();" vs-name="radios1tipoFiltro" vs-value="1">Sierra</vs-radio>
                                </li>
                                <li class="mr-3">
                                    <vs-radio v-model="tipoRegion" @input="arrayPeriodos=[];arrayReporte=[];periodoSelected='';obtenerPeriodos();" vs-name="radios1tipoFiltro" vs-value="2">Costa</vs-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="date-grid mt-4">
                    <div class="date-field">
                        <p>Periodo</p>
                    </div>
                    <div class="date-field">
                        <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos" label="periodoescolar" class="w-full mt-2" v-model="periodoSelected" />
                    </div>
                </div>
                <div class="flex justify-center mt-6">
                    <button class="filter-button" @click="f_reporte()">Filtrar</button>
                </div>
            </div>
        </div> -->
        <!--REPORTE-->
        <div class="flex" style="flex-wrap:wrap;" v-if="arrayReporte.length > 0">
            <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
                <span class="font-light">Valor General Prolipa: </span>
                <span class="text-primary" style="opacity:0.6;">{{ ValorTotalProlipa | filtrarDecimal }}</span>
            </div>
            <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
                <span class="font-light">Total  General Calmed: </span>
                <span class="text-warning ">{{ ValorTotalCalmed | filtrarDecimal }}</span>
            </div>
            <div style="display:flex; flex-direction: column;border: 2px dashed  #f2f2f2;padding: 8px;border-radius: 10px;" class="mr-5 mt-1">
                <span class="font-light">Total General: </span>
                <span class="text-success font-bold">{{ (ValorTotalProlipa + ValorTotalCalmed) | filtrarDecimal }}</span>
            </div>
        </div>
        <vx-card v-for="(item,key) in arrayReporte" :key="key" :title="item.asesor" class="my-2" style="width: 100%!important;">
            <div style="background-color: #e3f0e3;padding: 8px;border-radius: 10px;color:#569d56;font-weight: bold;font-size: 18px;">
                Valor Total: {{ ( item.totalPrecioProlipa + item.totalPrecioCalmed ) | filtrarDecimal }}
            </div>
            <div class="containerLibro">
                <div class="date-field">
                    <vs-divider>Prolipa</vs-divider>
                    <span><b>Cantidad libros:</b> {{ item.totalLibrosProlipa | filtrarDecimal }}</span>
                    <span><b>Total valor:</b> {{ item.totalPrecioProlipa | filtrarDecimal}}</span>
                    <TableReutilizableVue
                        v-if="item.librosProlipa.length > 0"
                        :ifexportar="Number(1)"
                        :title="''"
                        :nombrearchivo="'Despacho' +'-Prolipa-'+item.asesor + '-'+nombrePeriodo"
                        :headers="['Libro','Código','Despachado','Devoluciones','Cant. Total','Precio unitario','Precio total']"
                        :fieldKeys="['nombrelibro','codigo','cantidad','cantidad_devuelta','cantidadTotal','precio','precio_total']"
                        :tableData="item.librosProlipa"
                    />
                </div>
                <div class="date-field ml-2">
                    <vs-divider>Calmed</vs-divider>
                    <span><b>Cantidad libros:</b>   {{ item.totalLibrosCalmed | filtrarDecimal }}</span>
                    <span><b>Total valor:</b>       {{ item.totalPrecioCalmed | filtrarDecimal }}</span>
                    <TableReutilizableVue
                        v-if="item.librosCalmed.length > 0"
                        :ifexportar="Number(1)"
                        :title="''"
                        :nombrearchivo="'Despacho'+'-Calmed-'+item.asesor + '-'+nombrePeriodo"
                        :headers="['Libro','Código','Despachado','Devoluciones','Cant. Total','Precio unitario','Precio total']"
                        :fieldKeys="['nombrelibro','codigo','cantidad','cantidad_devuelta','cantidadTotal','precio','precio_total']"
                        :tableData="item.librosCalmed"
                    />
                </div>
            </div>
        </vx-card>
    </div>
</template>
<script>
import VSelect from 'vue-select';
import PeriodoRepository from '@/repositories/PeriodoRepository';
import Generalmix from '@/mixins/Generalmix';
const TableReutilizableVue        = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default{
    mixins:[Generalmix],
    components: {
        VSelect,
        TableReutilizableVue
    },
    data(){
        return{
            arrayPeriodos:[],
            arrayReporte:[],
            periodoSelected:null,
            tipoRegion:'1',
            cantidadTotalProlipa:0,
            cantidadTotalCalmed:0,
            ValorTotalProlipa:0,
            ValorTotalCalmed:0,
            mixinIdInicioFormatoNewData: null,
        }
    },
    async mounted() {
        let me = this;
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');            
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
        // Verificar si el prop periodo_id es mayor que 0
        if (me.periodo_id > 0) {
            me.periodoSelected = me.periodo_id;
            await me.f_reporte();
        }
    },
    props:{
        periodo_id:{
            type: Number,
            default: 0
        },
        nombrePeriodo:{
            type: String,
            default: ''
        },
        ifExterno:{
            type: Number,
            default: 0
        }
    },
    methods:{
        obtenerPeriodos() {
            let me = this;
            me.arrayReporte = []
            return PeriodoRepository.getPeriodos().then(p => {
                let datos = p.data
                if(me.tipoRegion == 1){
                    datos = datos.filter(p => p.region_idregion == 1)
                }else{
                    datos = datos.filter(p => p.region_idregion == 2)
                }
                me.arrayPeriodos = datos;
            });
        },
        async f_reporte(){
            let me = this
            me.cantidadTotalProlipa = 0
            me.cantidadTotalCalmed = 0
            me.ValorTotalProlipa = 0
            me.ValorTotalCalmed = 0
            me.arrayReporte = []
            if(me.periodoSelected == "" || me.periodoSelected == null || me.periodoSelected == undefined){
                me.m_message('Seleccione un periodo','danger')
                return
            }
            try{
                let url = '';
                if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
                    url = `pedidos2/pedidos?getReporteFacturacionAsesores=1&periodo_id=${ me.periodoSelected}`
                }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
                    url = `pedidos2/pedidos?getReporteFacturacionAsesores_new=1&periodo_id=${ me.periodoSelected}`
                }
                me.$vs.loading()
                const response = await this.$http.get(this.$server_url+url)
                me.arrayReporte = response.data
                if(me.arrayReporte.length == 0){
                    me.m_message('No se encontraron datos','danger')
                    return
                }
                me.arrayReporte.forEach(e => {
                    me.cantidadTotalProlipa += e.totalLibrosProlipa
                    me.cantidadTotalCalmed += e.totalLibrosCalmed
                    me.ValorTotalProlipa += e.totalPrecioProlipa
                    me.ValorTotalCalmed += e.totalPrecioCalmed
                })
            }catch(e){
                console.log(e)
                me.m_message('Error al obtener los datos','danger')
            }finally{
                me.$vs.loading.close()
            }
        },
    }
}
</script>
<style scoped>
  /* Contenedor principal */
  .container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 12px;
    background-color: #fdfdfd;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  .date-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
    gap: 15px;
  }
  /* Campo de fecha */
  .date-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .filter-button {
    padding: 12px 24px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .filter-button:hover {
    background-color: #0056b3; /* Color más oscuro al hacer hover */
    box-shadow: 0 4px 12px rgba(0, 91, 187, 0.3);
  }

  .filter-button:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 91, 187, 0.5);
  }
  /**libros */
  .containerLibro{
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(600px,1fr));
  }
</style>
