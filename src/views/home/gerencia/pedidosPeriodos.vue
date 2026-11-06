<template>
<div>
    <vx-card>
        <div class="m-2 mb-4">
            <small>Seleccione un periodo: </small>
            <v-select :options="listaPeriodos" :reduce="listaPeriodos => listaPeriodos.idperiodoescolar" label="descripcion" class="w-full" v-model="periodoSelect" @input="getAprobadosGerencia()" />
        </div>
        <br><br><br><br><br>
    </vx-card>
    <vx-card class="mt-4 mb-4" v-for="(item,index) in arregloAprobados" :key="index">
        <div class="vx-row mr-1">
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
            <div>
            <!--TIPOS-->
            <div v-if="item.convenio_anios > 0">
                <vs-chip color="success">Convenio: {{ item.convenio_anios }} años</vs-chip>
            </div>
            <vs-chip v-if="item.tipo_pago == 0 || item.tipo_pago == null" color="warning">
                Anticipo
            </vs-chip>
            <vs-chip v-if="item.tipo_pago == 1" color="primary">
                Liquidación
            </vs-chip>
            <br><br>
            <p v-if="usuario.cedula == 'sgerencia'">#{{ item.pedido_id }}</p>
            <!--SOLICITADO POR EL FACTURADOR EL ANTICIPO PARA QUE APRUEBE-->
            <div>
                <span>Valor aprobado por gerencia</span>
                <h2 class="mt-1"><small> $</small> {{ item.anticipo_aprobado_gerencia }} </h2>
            </div>
            <!--===ACCIONES==-->
            <br>
            <!--APROBAR ANTICIPO SUGERIDO-->
            <div v-if="item.ifagregado_anticipo_aprobado == 0" class="flex">
                <vs-button color="success" icon="check" class="mr-2 p-2" type="filled" @click="confirma_aprueba(item,op=0);">Aprobar</vs-button>
                <vs-button color="danger" type="border" class="p-2"  @click="confirma_aprueba(item,op=1)">Rechazar</vs-button>
            </div>
            <!--SOLICITADO POR EL FACTURADOR EL ANTICIPO PARA QUE APRUEBE-->
            <div v-if="item.ifagregado_anticipo_aprobado == 2" class="flex">
                <vs-button color="success" class="mr-2 p-2" icon="check" type="filled" @click="cantidadAprobar= item.anticipo_solicitud_for_gerencia;pedido = item;popupSolicitud = true;">Aprobar</vs-button>
                <vs-button color="danger" type="border" class="p-2" @click="confirma_aprueba(item,op=1)">Rechazar</vs-button>
            </div>
            </div>
        </div>
        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
            <!--INFORMACION-->
            <b>Asesor:</b>
            <p> {{ item.nombres }} {{ item.apellidos }} </p>
            <b class="mt-1">Institución</b>
            <p>{{ item.nombreInstitucion }}</p>
            <b>Ciudad</b>
            <p>{{ item.nombre_ciudad }}</p>
            <b>Período</b>
            <p>{{ item.periodo }}</p>
            <b>Fecha solicitud</b>
            <p> {{ item.fechaCreacionPedido }}</p>
            <b>Fecha aprobación gerencia</b>
            <p> {{ item.fecha_aprobacion_anticipo_gerencia }}</p>
        </div>
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/3 mb-6">
            <!--DETALLE PEDIDO-->
            <vs-divider>Detalle pedido</vs-divider>
            <!-- <vs-button color="success" @click="pedido = item;popupMostraValoresAnteriores = true;" style="margin-left: -5px;" type="flat">Ver venta anteriores</vs-button> -->
            <ul class="features">
            <li>
                <span class="icon">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                </svg>
                </span>
                <span><strong>Comisión:</strong> {{ item.descuento }}%</span>
            </li>
            <li>
                <span class="icon">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                </svg>
                </span>
                <span><strong>Venta series básicas:</strong> ${{ filtrarDecimal(item.total_series_basicas) }}</span>
            </li>
            <li>
                <span class="icon">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                </svg>
                </span>
                <span><strong>Venta bruta:</strong> ${{ filtrarDecimal(item.total_venta) }}</span>
            </li>
            </ul>
            <!--OBSERVACION ASESOR-->
            <div v-if="item.observacion">
                <vs-divider>Observación asesor</vs-divider>
                <div class="">
                    {{ item.observacion }}
                </div>
            </div>
        </div>
        </div>
    </vx-card>
    <!-- <div v-if="periodoSelect == '' || periodoSelect == null ">
        <br /><br /><br /><br /><br /><br /><br /><br />
    </div>
    <section v-else>
        <div class="header">
            <h2 class="text-success">
                Total aprobado: {{ f_suma_aprobados(listaPedidosPeriodos) }}
            </h2>
        </div>
                <vx-card class="mt-2" v-for="(item,index) in listaPedidosPeriodos" :key="index">
                    <vs-row>
                        <vs-col v-if="item.estado == 3" vs-w="6" vs-type="flex" vs-justify="left">
                            <vs-chip color="danger">
                                RECHAZADO
                            </vs-chip>
                        </vs-col>
                        <vs-col :vs-w="item.estado == 3 ? '6':'12' " vs-type="flex" vs-justify="right">
                            <vs-chip v-if="item.tipo_pago == 0" color="warning">
                                Anticipo
                            </vs-chip>
                            <vs-chip v-else color="primary">
                                Liquidación
                            </vs-chip>
                            <vs-chip> id {{ item.id }} </vs-chip>
                        </vs-col>
                    </vs-row>
                    <p>
                    </p>
                    <vs-row :class="item.estado == 3 ? 'text-danger':''">
                        <vs-col vs-w="3" vs-sm="6" vs-xs="6" class="mt-3">
                            <small>Valor</small>
                            <h2 :class="item.estado == 3 ? 'text-danger':''"> $ {{ item.anticipo_aprobado }} </h2>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="6" class="mt-3">
                            <small>Asesor</small>
                            <p>{{ item.nombres }} {{ item.apellidos }} </p>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="12" class="mt-3">
                            <small>Contrato creado</small>
                            <p>{{ item.fecha_generar_contrato }} </p>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="12" class="mt-3">
                            <div v-if="item.estado == 3">
                                <small>Rechazado gerencia</small>
                                <p> {{ item.fecha_rechazo_gerencia }} </p>
                                <small class="color-tiempo text-danger"><span> {{ f_calculo_fecha_humanize(item.fecha_generar_contrato, item.fecha_rechazo_gerencia) }} </span> </small>
                            </div>
                            <div v-else>
                                <small>Aprobado gerencia</small>
                                <p>{{ item.fecha_aprobacion_anticipo_gerencia }} </p>
                            </div>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="12" class="mt-3" v-if="item.fecha_subir_cheque != null">
                            <small>Cheque generado</small>
                            <p>{{ item.fecha_subir_cheque }} </p>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="12" class="mt-3" v-if="item.fecha_envio_cheque_for_asesor != null">
                            <small>Recibe cheque el asesor</small>
                            <p>{{ item.fecha_envio_cheque_for_asesor }} </p>
                            <small class="color-tiempo text-primary"><span> {{ f_calculo_fecha_humanize(item.fecha_subir_cheque, item.fecha_envio_cheque_for_asesor) }} </span> </small>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="12" class="mt-3" v-if="item.fecha_orden_firmada != null">
                            <small>Pagare firmado</small>
                            <p>{{ item.fecha_orden_firmada }} </p>
                            <small class="color-tiempo text-primary"><span> {{ f_calculo_fecha_humanize(item.fecha_envio_cheque_for_asesor, item.fecha_orden_firmada) }} </span> </small>
                        </vs-col>
                        <vs-col vs-w="3" vs-sm="6" vs-xs="12" class="mt-3" v-if="item.fecha_que_recibe_orden_firmada != null">
                            <small>Pagare rcibido en facturacion </small>
                            <p>{{ item.fecha_que_recibe_orden_firmada }} </p>
                            <small class="color-tiempo text-primary"><span> {{ f_calculo_fecha_humanize(item.fecha_orden_firmada, item.fecha_que_recibe_orden_firmada) }} </span> </small>
                        </vs-col>
                    </vs-row>
                </vx-card>
    </section> -->
</div>
</template>

<script>
import moment from "moment";
moment.locale('es');
import vSelect from 'vue-select';
export default {
    computed: {

    },
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuario:[],
            arregloAprobados:[],
            listaPeriodos: [],
            periodoSelect: '',
            listaPedidosPeriodos: [],
            val_total_periodo_seleccionado: 0,
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.getPeriodos();
    },
    methods: {
        filtrarDecimal(numero){
            let me = this
            if(numero == 0 || numero == null){
                return numero
            }else{
                const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }
        },
        getPeriodos() {
            let me = this;
            this.$http.get(this.$server_url + 'periodoActivo')
                .then((res) => {
                    let datos = res.data
                    me.listaPeriodos = datos.filter(p => p.pedido_gerencia == 1)
                }).catch((err) => {
                    console.log(err)
                });
        },
        getAprobadosGerencia(){
            let me = this;
            if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
                me.$vs.notify({
                text:'Seleccione un periodo por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                me.arregloAprobados = []
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'getPedidosAprobadosGerencia?periodo_id='+me.periodoSelect)
                .then((res) => {
                    me.$vs.loading.close()
                    let datos = res.data
                    me.arregloAprobados = datos
                }).catch((err) => {
                    me.$vs.loading.close()
                    console.log(err)
                });
        },
        f_pedidos_trazabilidad(idperiodo) {
            let me = this;
            if (idperiodo == null) {
                return
            }
            console.log(idperiodo)
            me.$vs.loading();
            this.$http.get(this.$server_url + 'listaPedidosPeriodos/' + idperiodo)
                .then((result) => {
                    console.log(result.data)
                    me.listaPedidosPeriodos = result.data
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_calculo_fecha_humanize(fechaini, fechafin) {
            // console.log(fechaini, fechafin)
            const startDate = moment(fechaini, 'YYYY-MM-DD HH:mm:ss').startOf('day');
            const current = moment(fechafin, 'YYYY-MM-DD HH:mm:ss').startOf('day');
            return moment.duration(current.diff(startDate)).humanize(true);
        },
        f_suma_aprobados(item) {
            let respuesta = 0;
            const resultado = item.reduce((acc, valor) => {
                console.log(valor.estado)
                if (valor.estado != 3) {
                    respuesta = acc + valor.anticipo_aprobado
                }
                return respuesta
            }, 0)
            return resultado;
        }
    },
}
</script>
<style scoped>
.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}

</style>
