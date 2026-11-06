<template>
<div>
    <div v-if="tipo == 2">
        <br>
        <vs-button color="primary" class="mb-4" type="border" @click="tipo = 1;getRevision(datosPeriodo.id_periodo);">← Regresar</vs-button>
        <div>
            <historicoCodigosNuevoVue class="mt-2" :contratoPedido="pedido.contrato" :id_pedido="Number(pedido.id_pedido)" :desdePedido="1" />
        </div>
    </div>

    <div v-if="tipo == 1">
        <!-- Filtros -->
        <vx-card class="mb-4" title="Filtros">
            <!-- <div class="px-2 mb-4">
                <label class="block text-sm font-semibold mb-2">Selecciona cómo filtrar:</label>
                <div class="flex gap-4">
                    <vs-radio v-model="tipoFiltro" vs-value="exacto" @input="rangoDiasFiltro=null;estadoFiltro=null;resetFiltros()">Días de diferencia (Exacto)</vs-radio>
                    <vs-radio v-model="tipoFiltro" vs-value="rango" @input="diasFiltro=null;estadoFiltro=null;resetFiltros()">Rango de Días</vs-radio>
                </div>
            </div> -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Filtro por Días -->
                <!-- <div class="px-2" v-if="tipoFiltro === 'exacto'">
                    <label class="block text-sm font-semibold mb-2">Días de diferencia (Exacto):</label>
                    <v-select :options="dias" :reduce="dias => dias.value" label="text" class="w-full" placeholder="-- Días de diferencia --" v-model="diasFiltro" @input="filtrarDatos" />
                </div> -->

                <!-- Filtro por Rango de Días -->
                <!-- <div class="px-2" v-if="tipoFiltro === 'rango'">
                    <label class="block text-sm font-semibold mb-2">Rango de Días:</label>
                    <v-select :options="rangoDiasOpciones" :reduce="rango => rango.value" label="text" class="w-full" placeholder="-- Seleccionar Rango --" v-model="rangoDiasFiltro" @input="filtrarPorRango" />
                </div> -->

                <!-- Filtro por Estado -->
                <div class="px-2">
                    <label class="block text-sm font-semibold mb-2">Filtrar por estado:</label>
                    <v-select :options="estadoOpciones" :reduce="estadoOpciones => estadoOpciones.value" label="text" class="w-full" placeholder="-- Estados Revisión --" v-model="estadoFiltro" @input="filtroSelect" />
                </div>

                <div class="px-2">
                    <label class="block text-sm font-semibold mb-2">Filtrar por tipo de venta:</label>
                    <v-select :options="tipoVentaOpciones" :reduce="tipoVenta => tipoVenta.value" label="text" class="w-full" placeholder="-- Tipo de Venta --" v-model="tipoVentaFiltro" @input="filtroTipoVenta" />
                </div>
            </div>

            <!-- Botón de Quitar Filtros -->
            <div class="w-full flex justify-center mt-4">
                <vs-button @click="resetFiltros" class="ml-2" type="border">Quitar Filtros</vs-button>
            </div>
        </vx-card>

        <vx-card :title="`Historico de Revisiones, ${datosPeriodo.descripcion}`" class="mt-4">
            <vs-table max-items="10" search pagination :data="arregloHistorico">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ arregloHistorico.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th sort-key="contrato">Datos</vs-th>
                    <vs-th>Verificaciones</vs-th>
                    <vs-th width="100px">Acciones</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr v-for="(tr, index) in data" :key="index">
                        <vs-td>
                            <b>Contrato:</b>
                            <p>{{ tr.contrato }}</p>
                            <b>Institución:</b>
                            <p>{{ tr.nombreInstitucion }}</p>
                            <b>Asesor:</b>
                            <p>{{ tr.asesor }}</p>
                            <b>Tipo de Venta:</b>
                            <p>{{ tr.tipo_venta == 1 ? 'Venta Directa' : 'Venta por Distribuidor' }}</p>
                        </vs-td>
                        <vs-td>
                            <vs-table :max-items="tr.verificaciones.length" :data="tr.verificaciones">
                                <template slot="header">
                                    <vs-chip color="#68b6ef">Verificaciones: <b class="px-2">{{ tr.verificaciones.length }}</b></vs-chip>
                                </template>
                                <template slot="thead">
                                    <vs-th>#</vs-th>
                                    <vs-th>Fecha solicitud</vs-th>
                                    <vs-th>Fecha verificación</vs-th>
                                    <vs-th>Subida documentos</vs-th>
                                    <vs-th>Diferencia de días</vs-th>
                                    <vs-th>Estado Revisión</vs-th>
                                </template>
                                <template slot-scope="{ data }">
                                    <vs-tr v-for="(verif, idx) in data" :key="idx" :state="verif.solicitudes.length > 0 && verif.solicitudes[0].diferenciaDiasSolicitudRealizacion >= 3 && verif.estado_revision !== 1 ? 'danger' :verif.solicitudes.length > 0 && (verif.solicitudes[0].diferenciaDiasSolicitudRealizacion >= 2 && verif.solicitudes[0].diferenciaDiasSolicitudRealizacion <= 3) && verif.estado_revision !== 1 ? 'warning' : 'success'">
                                        <vs-td>
                                            <p>
                                                {{ verif.num_verificacion }}
                                            </p>
                                        </vs-td>
                                        <vs-td>
                                            <p v-if="verif.solicitudes.length > 0">
                                                {{ verif.solicitudes[0].fecha_solicita_verificacion }}
                                            </p>
                                        </vs-td>
                                        <vs-td>
                                            <p v-if="verif.solicitudes.length > 0">
                                                {{ verif.solicitudes[0].fecha_realiza_verificacion }}
                                            </p>
                                        </vs-td>
                                        <vs-td>
                                            <div v-if="verif.fecha_subir_factura">
                                                <p><b>Factura:</b> {{ verif.fecha_subir_factura }}</p>
                                            </div>
                                            <div v-if="verif.fecha_subir_revision" class="mt-1">
                                                <p><b>Revisión:</b> {{ verif.fecha_subir_revision }}</p>
                                            </div>
                                            <div v-else-if="verif.fecha_subir_evidencia" class="mt-1">
                                                <p><b>Evidencia:</b> {{ verif.fecha_subir_evidencia }}</p>
                                            </div>
                                        </vs-td>
                                        <vs-td>
                                            <div v-if="verif.estado_revision==0">
                                                <vs-chip v-if="verif.solicitudes.length > 0 && verif.solicitudes[0].diferenciaDiasSolicitudRealizacion >= 3" color="#ff6961">
                                                    +{{ verif.solicitudes[0].diferenciaDiasSolicitudRealizacion }} días
                                                </vs-chip>
                                                <vs-chip v-else color="#53ca98">
                                                    +{{ verif.solicitudes[0].diferenciaDiasSolicitudRealizacion }} días
                                                </vs-chip>
                                            </div>
                                        </vs-td>
                                        <vs-td>
                                            <vs-chip color="#005187" v-if="verif.estado_revision==1">
                                                <i class="fa-solid fa-check"></i>
                                            </vs-chip>
                                            <vs-chip color="#ff6961" v-else>
                                                <i class="fa-solid fa-x"></i>
                                            </vs-chip>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </vs-td>
                        <vs-td>
                            <vs-button color="primary" type="border" @click="pedido = tr;VerVerificaciones(tr)">Ver Verificaciones</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select'
import historicoCodigosNuevoVue from '@/views/temporadas/historicoCodigosNuevo.vue'
export default {
    data() {
        return {
            arregloHistorico: [],
            arregloHistoricoOriginal: [], // Para almacenar los datos originales
            tipo: 1,
            pedido: {},
            diasFiltro: null,
            estadoFiltro: null,
            tipoVentaFiltro: null,
            estadoOpciones: [{
                    text: 'Pendiente de Revisión',
                    value: '0'
                },
                {
                    text: 'Revisado',
                    value: '1'
                }
            ],
            tipoVentaOpciones: [{
                    text: 'Venta Listas',
                    value: '2'
                },
                {
                    text: 'Venta directa',
                    value: '1'
                }
            ],
            dias: [],
            rangoDiasOpciones: [{
                    text: "Menor a 3 días",
                    value: "<3"
                },
                {
                    text: "Mayor o igual 3 días y menor a 10 días",
                    value: ">3"
                },
                {
                    text: "Mayor a 10 días y menor a 50 días",
                    value: ">10"
                },
                {
                    text: "Mayor a 50 días y menor a 100 días",
                    value: ">50"
                },
                {
                    text: "Mayor a 100 días",
                    value: ">100"
                }
            ],
            tipoFiltro: "exacto",
            rangoDiasFiltro: null,

        }
    },
    components: {
        'v-select': vSelect,
        historicoCodigosNuevoVue,
    },
    props:{
        datosPeriodo:{
            type: Object,
            default : {}
        }
    },
    created() {
        // this.getRevision()
    },
    mounted(){
        this.getRevision(this.datosPeriodo.id_periodo)
    },
    methods: {
        getRevision(periodo) {
            this.$vs.loading();
            this.$http.get(this.$server_url + 'metodosGetVerificaciones?getVerificacionesRevision=1&periodo='+periodo )
                .then(res => {

                    this.arregloHistorico = res.data.map(element => {
                        element.verificaciones.forEach(verif => {
                            if (verif.solicitudes && verif.solicitudes.length > 0) {
                                verif.solicitudes.forEach(soli => {
                                    if ( soli.fecha_realiza_verificacion) {
                                       
                                        let fechaInicio = new Date(soli.fecha_realiza_verificacion);
                                        let fechaFinal = new Date();
                                        let diferenciaDias = Math.round((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24));

                                        soli.diferenciaDiasSolicitudRealizacion = diferenciaDias;
                                        // Agregar el valor si no está ya en el array
                                        if (!this.dias.includes(diferenciaDias)) {
                                            this.dias.push(diferenciaDias);
                                        }

                                    } else {
                                        soli.diferenciaDiasSolicitudRealizacion = null;
                                    }
                                });
                            }
                        });
                        return element;
                    });

                    //Filtrar, ordenar y convertir el array `dias`  
                    this.dias = Array.from(this.dias)
                        .filter(dia => dia >= 3) // Filtrar solo valores >= 3
                        .sort((a, b) => a - b) // Ordenar de menor a mayor
                        .map(dia => {
                            let texto = (dia === 1) ? "1 Día" : `${dia} Días`; // Ajustar el texto
                            return {
                                value: dia,
                                text: texto
                            };
                        });

                    this.arregloHistoricoOriginal = JSON.parse(JSON.stringify(this.arregloHistorico));

                    if (this.tipo == 1) {
                        this.$emit('tieneTipo', 0); 
                    }

                    this.$vs.loading.close();

                })
                .catch(error => {
                    console.error(error);
                    this.$vs.loading.close();
                });
        },

        // Aplicar filtros
        filtrarDatos() {
            this.arregloHistorico = this.arregloHistoricoOriginal.filter(item => {
                // Verificar si alguna solicitud dentro de una verificación tiene la diferencia de días requerida
                let cumpleDias = this.diasFiltro ?
                    item.verificaciones.some(verif =>
                        verif.solicitudes.some(soli => soli.diferenciaDiasSolicitudRealizacion == this.diasFiltro)
                    ) :
                    true;

                return cumpleDias;
            });
        },
        filtrarPorRango() {
            this.arregloHistorico = this.arregloHistoricoOriginal.filter(item => {
                return item.verificaciones.some(verif =>
                    verif.solicitudes.some(soli => {
                        if (soli.estado_revision=0) {
                            let dias = soli.diferenciaDiasSolicitudRealizacion;
                            if (this.rangoDiasFiltro === "<3") return dias < 3 ;
                            if (this.rangoDiasFiltro === ">3") return dias >= 3 && dias < 10;
                            if (this.rangoDiasFiltro === ">10") return dias >= 10 && dias < 50;
                            if (this.rangoDiasFiltro === ">50") return dias >= 50 && dias < 100;
                            if (this.rangoDiasFiltro === ">100") return dias >= 100;
                            return true;
                        }
                    })
                );
            });
        },
        filtroSelect() {
            this.applyFiltros();
        },
        filtroTipoVenta() {
            this.applyFiltros();
        },
        applyFiltros() {
            this.arregloHistorico = this.arregloHistoricoOriginal.filter(item => {
                // Verificar si alguna verificación tiene el estado de revisión que coincide con el filtro
                let cumpleEstado = this.estadoFiltro ?
                    item.verificaciones.some(verif => verif.estado_revision == this.estadoFiltro) :
                    true;

                let cumpleTipoVenta = this.tipoVentaFiltro ?
                    String(item.tipo_venta) == String(this.tipoVentaFiltro) :
                    true;

                return cumpleEstado && cumpleTipoVenta;
            });
        },

        // Restablecer filtros
        resetFiltros() {
            this.diasFiltro = null;
            this.estadoFiltro = null;
            this.tipoVentaFiltro = null;
            this.arregloHistorico = JSON.parse(JSON.stringify(this.arregloHistoricoOriginal));
        },

        // Ver verificaciones
        VerVerificaciones(tr) {
            this.tipo = 2;
            this.$emit('tieneTipo', 2);
        }
    }
}
</script>

<style scoped>
.informacionformhijo {
  z-index: 51001;
  /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
  /* position: fixed; */
  /* Asegúrate de que la posición sea adecuada */
} 
</style>