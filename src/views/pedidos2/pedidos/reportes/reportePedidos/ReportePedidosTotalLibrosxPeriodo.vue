<template>
    <vx-card>
        <vs-alert style="height: 80px;">
            <p>
                Cantidad de <b>libros solicitados en los pedidos</b>, incluido los alcances.
            </p>
        </vs-alert>
        <br>
        <!-- <div>
            <PeriodoReutilizableVue @changePeriodo="changePeriodo" :tipoRegion="Number(2)"/>
        </div> -->
        <!--ifContratos-->
        <div v-if="periodoSelected">
            <ul class="flex">
                <li>
                    <vs-radio v-model="ifContratos" @input="f_getReporte();" class="mr-3" vs-name="radios1ifContratos" vs-value="0">Pedidos sin contratos</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="ifContratos" @input="f_getReporte();" class="mr-3" vs-name="radios1ifContratos" vs-value="1">Pedidos con contratos</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="ifContratos" @input="f_getReporte();" class="mr-3" vs-name="radios1ifContratos" vs-value="2">Todos</vs-radio>
                </li>
                <li>
                    <!--boton filtrar-->
                    <vs-button @click="f_getReporte()" class="btn btn-sm" style="margin-top: -5px;" icon-pack="feather" icon="icon-refresh-cw" type="border" color="primary">filtrar</vs-button>
                </li>
            </ul>
        </div>
        <vs-divider></vs-divider>
        <div class="flex">
          <vs-button @click="exportData()" class="btn btn-sm" icon-pack="feather" icon="icon-printer" v-if="arrayReporte.length > 0" >
            Exportar
          </vs-button>
        </div>
        <div class="mt-5">
            <p>Libros: <b>{{ arrayReporte.length || 0 }} </b></p>
            <p>Cantidad de libros:<b> {{ totalLibros || 0 }} </b></p>
        </div>
        <div class="mt-5">
            <div v-if="arrayReporte.length > 0">
                <TableReutilizableVue
                :title="'Pedidos libros'"
                :headers="['codigo','Libro','Descripcion','Total libros','Precio']"
                :fieldKeys="['codigo_liquidacion','nombrelibro','pro_descripcion','valor','precio']"
                :ifexportar="Number(1)"
                :nombrearchivo="'ReportePedidos'"
                :tableData="arrayReporte"
                />
            </div>
        </div>
    </vx-card>
</template>
<script>
import Generalmix from '@/mixins/Generalmix'
const PeriodoReutilizableVue   = () => import('../../../../codigos/reportes/PeriodoReutilizable.vue')
const TableReutilizableVue            = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default{
    mixins: [Generalmix],
    components:{
        PeriodoReutilizableVue,
        TableReutilizableVue
    },
    data(){
        return{
            arrayReporte    : [],
            periodoSelected : null,
            arrayPeriodos   : [],
            tipoRegion      : null,
            ifContratos     : 0,
            totalLibros:0,
            mixinIdInicioFormatoNewData: null,
        }
    },
    props:{
        periodoConsulta:{
            type:Number,
            default:0
        }
    },
    mounted(){
        let me = this
        me.periodoSelected = me.periodoConsulta
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
    },
    watch: {
        periodoConsulta: {
            handler(newVal) {
                if (newVal) {
                    this.periodoSelected = newVal;
                    this.f_getReporte();
                }
            },
            immediate: false
        }
    },
    methods:{
        changePeriodo(periodo, periodos, tipoRegion){
            let me = this;
            this.arrayReporte    = [];
            this.periodoSelected = periodo
            this.arrayPeriodos   = periodos
            this.tipoRegion      = tipoRegion
            me.f_getReporte()
        },
        f_getReporte(){
            let me = this;
            me.arrayReporte = []
            me.totalLibros = 0
            if(me.periodoSelected == '' || me.periodoSelected == null || me.periodoSelected == undefined){
                me.m_message('Debe seleccionar un periodo','danger')
                return false;
            }
            me.$vs.loading();
            let resultado1 = '';
            if(me.periodoSelected <= me.mixinIdInicioFormatoNewData){
                resultado1 = `pedidos2/pedidos?getReportePedidos=1&periodo_id=${this.periodoSelected}&ifContratos=${this.ifContratos}`;
            }else if(me.periodoSelected > me.mixinIdInicioFormatoNewData){
                resultado1 = `pedidos2/pedidos?getReportePedidos_new=1&periodo_id=${this.periodoSelected}&ifContratos=${this.ifContratos}`;
            }

            this.$http.get(this.$server_url+resultado1)
            .then(function (res) {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.m_message(res.data.mensaje,'danger')
                    return false;
                }
                if(res.data.length == 0){
                    me.m_message('No hay datos para el periodo seleccionado','danger')
                    return false;
                }
                me.arrayReporte = res.data
                me.totalLibros = me.arrayReporte.reduce((a, b) => a + (b.valor || 0), 0);
            })
            .catch(function (error) {
                me.$vs.loading.close()
                me.m_message("Error al obtener los reportes", "error");
                console.log(error + ' error');
            })
        },
    }
}
</script>
<style>
.fixed-column {
    position: sticky;
    left: 0;
    background-color: white;
}

.fixed-column2 {
    position: sticky;
    top: 0;
    background-color: white;
}
.radio-large {
  width: 20px;
  height: 20px;
  transform: scale(1); /* Adjust this value as needed */
  position: relative;
  top:2px;
  margin:5px;
}
</style>
