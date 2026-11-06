<template>
<div class="reporte-container">
    <div>
        <ul class="centerx mb-4 flex align-items-center">
            <li class="mx-2">
            MOSTRAR :
            </li>
            <li class="mx-2">
            <vs-radio v-model="tipo" vs-value="0" @input="cambiarTipoRadio(0)"><i class="fas fa-list"></i> TODO</vs-radio>
            </li>
            <li class="mx-2">
            <vs-radio color="success" v-model="tipo" vs-value="2" @input="cambiarTipoRadio(2)"><i class="fas fa-paper-plane"></i> ENVIADO A PERSEO</vs-radio>
            </li>
            <li class="mx-2">
            <vs-radio color="danger" v-model="tipo" vs-value="1" @input="cambiarTipoRadio(1)"><i class="fas fa-times"></i> NO ENVIADO A PERSEO</vs-radio>
            </li>
        </ul>
    </div>
    <h3 class="text-center mt-3">Reporte de Facturación Real <b>{{ nombrePeriodo }}</b></h3>

    <!-- Resumen -->
    <div class="row flex justify-center w-full">
        <div class="w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
            <div class="card card-statistics">
                <div class="card-body flex flex-col justify-center items-center">
                    <b class="card-title">Valor Facturado en Prolipa</b>
                    <b class="text-primary font-weight-bold">{{ ValorTotalProlipa | filtrarDecimal }}</b>
                </div>
            </div>
        </div>
        <div class="w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
            <div class="card card-statistics">
                <div class="card-body flex flex-col justify-center items-center">
                    <b class="card-title">Valor Facturado en Calmed</b>
                    <b class="text-warning font-weight-bold">{{ ValorTotalCalmed | filtrarDecimal }}</b>
                </div>
            </div>
        </div>
        <div class="w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4">
            <div class="card card-statistics">
                <div class="card-body flex flex-col justify-center items-center">
                    <b class="card-title">Total General Facturado</b>
                    <b class="text-success font-weight-bold">{{ (ValorTotalProlipa + ValorTotalCalmed) | filtrarDecimal }}</b>
                </div>
            </div>
        </div>
    </div>

    <!-- Detalle por asesor -->
    <vx-card v-for="(item, key) in arrayReporte" :key="key" :title="item.asesor" class="my-2 vx-card-custom" style="width: 100%!important;">
        <div class="asesor-total" style="background-color: #e3f0e3; padding: 8px; border-radius: 10px; color: #569d56; font-weight: bold; font-size: 18px;">
            Valor Total: {{ (item.totalPrecioProlipa + item.totalPrecioCalmed) | filtrarDecimal }}
        </div>

        <!-- Libros por asesor -->
        <div v-if="item.librosProlipa.length > 0 || item.librosCalmed.length > 0">
            <div class="w-full flex">
                <div class="libros-prolipa" v-if="item.librosProlipa.length > 0" :class="{ 'w-full': item.librosCalmed.length === 0, 'w-1/2': item.librosCalmed.length > 0 }">
                    <vs-divider>Prolipa</vs-divider>
                    <span class="mr-3"><b>Cantidad libros:</b> {{ item.totalLibrosProlipa}}</span>
                    <span><b>Total valor:</b> {{ item.totalPrecioProlipa | filtrarDecimal }}</span>
                    <TableReutilizableVue :ifexportar="Number(1)" :nombrearchivo="'Facturado' +'-Prolipa-'+item.asesor + '-'+nombrePeriodo" :title="''" :headers="['Libro', 'Código', 'Cantidad', 'Precio unitario', 'Precio total']" :fieldKeys="['nombrelibro', 'codigo', 'cantidad', 'precio', 'precio_total']" :tableData="item.librosProlipa" />
                </div>

                <div class="libros-calmed" v-if="item.librosCalmed.length > 0" :class="{ 'w-full': item.librosProlipa.length === 0, 'w-1/2': item.librosProlipa.length > 0 }">
                    <vs-divider>Calmed</vs-divider>
                    <span class="mr-3"><b>Cantidad libros:</b> {{ item.totalLibrosCalmed}}</span>
                    <span><b>Total valor:</b> {{ item.totalPrecioCalmed | filtrarDecimal }}</span>
                    <TableReutilizableVue :ifexportar="Number(1)" :nombrearchivo="'Facturado' +'-Calmed-'+item.asesor + '-'+nombrePeriodo" :title="''" :headers="['Libro', 'Código', 'Cantidad', 'Precio unitario', 'Precio total']" :fieldKeys="['nombrelibro', 'codigo', 'cantidad', 'precio', 'precio_total']" :tableData="item.librosCalmed" />
                </div>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import VSelect from 'vue-select';
import PeriodoRepository from '@/repositories/PeriodoRepository';
import Generalmix from '@/mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
    mixins: [Generalmix],
    components: {
        VSelect,
        TableReutilizableVue
    },
    data() {
        return {
            arrayPeriodos: [],
            arrayReporte: [],
            periodoSelected: null,
            tipoRegion: '1',
            cantidadTotalProlipa: 0,
            cantidadTotalCalmed: 0,
            ValorTotalProlipa: 0,
            ValorTotalCalmed: 0,
            tipo: 0,
            tipoRadioAnterior: null,
        }
    },
    async mounted() {
        let me = this;
        // Verificar si el prop periodo_id es mayor que 0
        if (me.periodo_id > 0) {
            me.periodoSelected = me.periodo_id;
            me.tipo = 0;
            await me.f_reporte(me.tipo);
        }
    },
    watch:{
      async periodo_id(results){
        let me = this
        me.arrayReporte = []
        console.log("eee",results)
        if(results > 0){
          console.log("entoro")
          await me.f_reporte(me.tipo);
        }
      }
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0
        },
        nombrePeriodo: {
            type: String,
            default: ''
        },
        ifExterno: {
            type: Number,
            default: 0
        }
    },
    methods: {
        cambiarTipoRadio(nuevoTipo) {
            if (this.tipoRadioAnterior === nuevoTipo) return;
            this.tipoRadioAnterior = nuevoTipo;
            this.vaciar();
            this.cambiarTipo(nuevoTipo);
        },
        cambiarTipo(tipo) {
            this.tipo = tipo;
            this.f_reporte(this.tipo);
        },
        obtenerPeriodos() {
            let me = this;
            me.arrayReporte = []
            return PeriodoRepository.getPeriodos().then(p => {
                let datos = p.data
                if (me.tipoRegion == 1) {
                    datos = datos.filter(p => p.region_idregion == 1)
                } else {
                    datos = datos.filter(p => p.region_idregion == 2)
                }
                me.arrayPeriodos = datos;
            });
        },
        async f_reporte(tipo) {
            let me = this
            me.cantidadTotalProlipa = 0
            me.cantidadTotalCalmed = 0
            me.ValorTotalProlipa = 0
            me.ValorTotalCalmed = 0
            me.arrayReporte = []
            if (me.periodoSelected == "" || me.periodoSelected == null || me.periodoSelected == undefined) {
                me.m_message('Seleccione un periodo', 'danger')
                return
            }
            try {
                const url = `pedidos2/pedidos?getReporteFacturadoXAsesores=1&periodo_id=${me.periodoSelected}&tipo=${tipo}`
                me.$vs.loading()
                const response = await this.$http.get(this.$server_url + url)
                me.arrayReporte = response.data
                if (me.arrayReporte.length == 0) {
                    me.m_message('No se encontraron datos', 'danger')
                    return
                }
                me.arrayReporte.forEach(e => {
                    me.cantidadTotalProlipa += e.totalLibrosProlipa
                    me.cantidadTotalCalmed += e.totalLibrosCalmed
                    me.ValorTotalProlipa += e.totalPrecioProlipa
                    me.ValorTotalCalmed += e.totalPrecioCalmed
                })
            } catch (e) {
                console.log(e)
                me.m_message('Error al obtener los datos', 'danger')
            } finally {
                me.$vs.loading.close()
            }
        },
        vaciar(){
            let me = this
            me.cantidadTotalProlipa = 0
            me.cantidadTotalCalmed = 0
            me.ValorTotalProlipa = 0
            me.ValorTotalCalmed = 0
            me.arrayReporte = []
        }
    }
}
</script>

<style scoped>
.reporte-container {
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
}

/* .resumen {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
} */

.resumen-item {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    margin: 10px;
    border-radius: 10px;
}

.vx-card-custom {
    display: flex;
    flex-direction: column;
}

.libros-container {
    display: flex;
    flex-wrap: wrap;
}

.libros-content {
    display: flex;
    flex-direction: row;
    flex: 1;
}

.libros-content.flex-col {
    flex-direction: column;
}

.libros-prolipa,
.libros-calmed {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin: 10px;
}

.card-statistics {
    border: 2px dashed #f2f2f2;
    border-radius: 10px;
    margin-right: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-statistics .card-body {
    padding-bottom: 10px;
    padding-top: 10px;
}

.card-statistics .card-title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
}

.card-statistics .text-primary {
    color: #3498db;
}

.card-statistics .text-warning {
    color: #f1c40f;
}

.card-statistics .text-success {
    color: #2ecc71;
}

.card-statistics .font-weight-bold {
    font-size: 20px;
}

</style>
