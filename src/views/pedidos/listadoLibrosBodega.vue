<template>
<div>
    <div class="m-2 mb-4">
        <small>Seleccione un periodo: </small>
        <v-select :options="listaPeriodos" :reduce="listaPeriodos => listaPeriodos" label="descripcion" class="w-full" v-model="periodoSelect" @input="f_pedidos(periodoSelect.idperiodoescolar)" />
    </div>
    <div v-if="periodoSelect.idperiodoescolar != null">
        <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="1"><b>{{ sumaAprobados  }}</b> Pedidos Guias aprobados</vs-radio>
        <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="2"><b>{{ SumaEntregados }}</b> Entregados</vs-radio>
    </div>
    <div class="m-2 mb-4">
        <vs-table search :data="listaContratos">
            <template slot="header">
                <vs-chip color="primary" class="ml-1">Cantidad: {{listaContratos.length}}</vs-chip>
            </template>
            <template slot="thead">
                <vs-th width="25%" sort-key="apellidos">Asesor / Responsable</vs-th>
                <vs-th width="30%" sort-key="total_venta">detalles</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> 
                        <small>id: </small> {{tr.id_pedido}} <br />
                        <small><b>Acta:</b></small> {{ tr.ven_codigo }}<br />
                        <small><b>Asesor:</b></small> {{tr.nombres}} {{tr.apellidos}}<br />
                        <!-- <small><b>escuela:</b></small> {{tr.nombreInstitucion}} <br />
                        <small><b>ciudad:</b></small> {{ tr.ciudad }}<br /> -->
                    </vs-td>

                    <vs-td>
                        <small><b>pedido solicitado: </b></small> {{ tr.ph_fecha_creacion_pedido }}<br />
                        <span :class="tr.fecha_aprobado_facturacion == null ? 'text-danger': ''">
                            <small><b>aprobado facturación: </b></small>
                            <span> {{tr.fecha_aprobado_facturacion != null ?  tr.fecha_aprobado_facturacion : 'PENDIENTE APROBAR'}}</span>
                        </span><br />
                        <small><b>despacho bodega: </b></small> <span> {{tr.fecha_entrega_bodega != null ?  tr.fecha_entrega_bodega: ''}}</span><br />
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <!--RESUMEN-->
                            <vs-button icon="visibility"  type="border" @click="pedido = tr;verStock()">Resumen</vs-button>
                            <!-- <vs-button class="m-1" icon="visibility" type="border" @click="f_detalle_libros(tr)">ver libros</vs-button> -->
                            <vs-button v-if="tr.estado_entrega > 0" class="m-1" icon-pack="feather" icon="icon-printer" type="border" color="dark" @click="pedido = tr;ImprimirActa(tr)">Imprimir acta</vs-button>
                            <vs-button v-if="tr.estado_entrega == 1" class="m-1" icon="check" type="border" color="warning" @click="pedido = tr;openConfirm(tr)">entregar</vs-button>
                        </div>
                    </vs-td>
                </vs-tr>

            </template>
        </vs-table>
    </div>
    <!--MODAL CARGAR-->
    <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
        <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
        <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
    </vs-popup>
    <!--MODAL DETALLE DE LIBROS-->
    <vs-popup title="Detalle de libros" :active.sync="modalLibros">
        <vs-table max-items="100" search pagination :data="arregloLibros">
            <template slot="header">
                <div class="row">
                    <div class="col-12">Total Libros: <b>{{totalLibros}}</b></div>
                    <div class="col-12">Items: <b>{{arregloLibros.length}}</b></div>
                </div>
            </template>
            <template slot="thead">
                <vs-th>Libro</vs-th>
                <vs-th>Cant. unidades</vs-th>
                <vs-th>Precio unitario</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].valor}}<br>
                    </vs-td>
                    <vs-td>
                        {{tr.precio}}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vs-popup>
    <!--EXPORTAR ACTA BODEGA - ASESOR-->
    <div v-if="mostrarImprimirActa">
        <exportActaGuiasBodegaVue style="display: none;" :pedido = "pedido" @change="changeHandle"/>
    </div>
    <!--MODAL CONFIRMAR APROBAR-->
    <vs-popup class="holamundo" fullscreen title="Stock de guias" :active.sync="popupConfirmAprobar">
        <GuiasStockVue v-if="popupConfirmAprobar" :arregloStock="arregloStock"/>
    </vs-popup>
</div>
</template>
<script>
import exportActaGuiasBodegaVue from '../temporadas/components/exportActaGuiasBodega.vue';
import GuiasStockVue from './components/Guias/GuiasStock.vue';
import vSelect from 'vue-select';
export default {
    name: 'lista-de-contratos-gerencia',
    components: {
        'v-select': vSelect,
        exportActaGuiasBodegaVue,
        GuiasStockVue,
    },
    data() {
        return {
            listaPeriodos: [],
            periodoSelect: {},
            listaContratos: [],
            listaContratosTmp: [],
            arregloStock:[],
            pedido:{},
            noroot: '',
            tipo_pedido: 0,
            filtro: 1,
            arregloLibros: [],
            modalLibros: false,
            totalLibros: 0,
            //variables para exportar
            mostrarImprimirActa:false,
            popupCarga:false,
            popupConfirmAprobar:false,
            //fin variables para exporta el acta
        }
    },
    computed: {
        sumaAprobados() {
            let me = this;
            let datos = me.listaContratosTmp.filter(p => (p.estado_entrega == 1) && (p.estado == 1));
            let resultado = datos.length
            return resultado
        },
        SumaEntregados() {
            let me = this;
            let datos = me.listaContratosTmp.filter(p => (p.estado_entrega == 2) && (p.estado == 1));
            let resultado = datos.length
            return resultado
        },
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getPeriodos();
    },
    methods: {
        verStock(){
            let me = this;
            me.arregloStock = []
            me.$vs.loading()
            this.$http.get(this.$server_url+'guias?verStock=yes&id_pedido='+me.pedido.id_pedido)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time:3000
                        })
                        return
                    }
                    //ingresar libros en array
                    let datos = res.data
                    var predatos = []
                    predatos = datos
                    me.arregloStock = predatos.sort(function(a, b) {
                        var nombreA = a.nombrelibro.toLowerCase();
                        var nombreB = b.nombrelibro.toLowerCase();
                        var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                        var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                        nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                        nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
                        
                        if (nombreA < nombreB) {
                            return -1;
                        }
                        if (nombreA > nombreB) {
                            return 1;
                        }
                        if (numA && !numB) { // si a tiene número y b no, b va primero
                            return 1;
                        }
                        if (!numA && numB) { // si b tiene número y a no, a va primero
                            return -1;
                        }
                        if (numA && numB) { // si ambos tienen número, compararlos
                            if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                            return -1;
                            }
                            if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                            return 1;
                            }
                            return numA - numB; // comparar los números directamente
                        }
                        return 0; // si son iguales en todo, no hay diferencia
                    });
                    //open confirm
                    me.popupConfirmAprobar = true
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: "Hubo problemas con el servidor de facturacion",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:3000
                    })
                })
            
        },
        changeHandle(e) {
            let me                  = this;
            me.popupCarga           = false
            me.mostrarImprimirActa  = false
        },
        ImprimirActa(){
            let me                  = this;
            me.popupCarga           = true
            me.mostrarImprimirActa  = true
        },
        getPeriodos() {
            let me = this;
            this.$http.get(this.$server_url + 'periodoActivo')
                .then((result) => {
                    // console.log(result.data)
                    me.listaPeriodos = result.data
                }).catch((err) => {
                    console.log(err)
                });
        },
        f_pedidos(idperiodo) {
            let me = this;
            console.log(idperiodo)
            if (idperiodo == null) {
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'reportePedidosGuiasBodega/' + idperiodo)
                .then((result) => {
                    let datos = result.data
                    me.listaContratosTmp = datos.filter(p => p.estado_entrega != 0)
                    me.filtroTipo();
                    me.$vs.loading.close()
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close()
                });
        },
        filtroTipo() {
            let me = this;
            me.listaContratos = []
            if (me.filtro == 1) {
                let datos = me.listaContratosTmp.filter(p => (p.estado_entrega == 1));
                me.listaContratos = datos
                return
            }
            if (me.filtro == 2) {
                let datos = me.listaContratosTmp.filter(p => (p.estado_entrega == 2));
                me.listaContratos = datos
                return
            }
        },
        f_detalle_libros(item) {
            let me = this
            me.modalLibros = true;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'get_val_pedidoInfo/' + item.id_pedido)
                .then(res => {
                    console.log(res.data)
                    let datos = res.data
                    me.arregloLibros = datos.filter(p => p.valor > 0)
                    me.totalLibros = datos.reduce((acc, valor) => {
                        const respuesta = acc + valor.valor
                        return respuesta
                    }, 0)
                    me.$vs.loading.close()
                })
        },
        openConfirm(){
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText:'aceptar',
                cancelText:'cancelar',
                text: 'Esta seguro de entregar esta solicitud de guias?',
                accept:this.entregarPedido
            })
        },
        entregarPedido() {
            let me = this
            me.$vs.loading();
            let data = {
                'id_pedido': this.pedido.id_pedido,
                'estado': '2',
                'grupo': 'bodega',
                'acta':this.pedido.ven_codigo,
                'asesor_id':this.pedido.id_asesor
            }
            this.$http.post(this.$server_url + 'entregarPedido', data)
                .then(res => {
                    me.f_notificaciones('Pedido entregado', 'success', 'check')
                    me.f_pedidos(me.periodoSelect.idperiodoescolar);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        }
    },
}
</script>
