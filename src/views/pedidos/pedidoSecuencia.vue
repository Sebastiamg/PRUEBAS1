<template>
    <div>
        <vs-popup :title="txt_titulo_modal" :active.sync="modalAddSecuencia">
            <div class="vx-row w-full mb-6">
                <div class="vx-col w-1/2 mb-3" v-if="periodoSelect != null">
                    <vs-input label="Periodo" readonly="true" v-model="periodoSelect.descripcion" class="w-full" />
                </div>
                <div class="vx-col w-full mb-3">
                    <small>Asesores: </small><br />
                    <v-select :options="listaAsesores" :reduce="listaAsesores => listaAsesores" label="nombres" class="w-full" v-model="asesorSelect" />
                    <!-- {{ asesorSelect }} -->
                </div>
                <div class="vx-col w-1/2 mb-3">
                    <vs-input label="Iniciales del asesor" v-model="datos.ven_d_codigo" class="w-full" />
                </div>
                <div class="vx-col w-1/2 mb-3">
                    <vs-input type="number" label="Secuencia" v-model="datos.sec_ven_valor" class="w-full" />
                </div>
                <div class="vx-col w-1/2 mb-3">
                    <vs-input label="Institución facturación" disabled v-model="datos.institucion_facturacion" class="w-full" />
                </div>
                <div class="vx-col w-1/2 mb-3">
                    <vs-input label="Id de la tabla cliente_institucion" v-model="datos.cli_ins_codigo" class="w-full" />
                </div>
                <div class="vx-col w-1/2 mb-3">
                    <vs-button color="success" type="gradient" class="m-1" @click="f_guardar()">{{ txt_boton }}</vs-button>
                </div>
            </div>
        </vs-popup>
        <vs-alert v-if="noroot != '' " title="Alerta" active="true" color="danger" class="m-3">
            <h4> {{ noroot }} </h4>
        </vs-alert>
        <div class="m-2 mb-4">
            <small>Seleccione un periodo: </small>
            <v-select :options="listaPeriodos" :reduce="listaPeriodos => listaPeriodos" label="descripcion" class="w-full" v-model="periodoSelect" @input="f_pedidos(periodoSelect.idperiodoescolar)" />
        </div>
        <div class="m-2">
            <vs-button v-if="periodoSelect" color="primary" type="gradient" class="m-1" @click="f_modal_datos()">Agregar</vs-button>
        </div>
        <div v-if="periodoSelect == null">
            <br /><br /><br /><br /><br /><br /><br /><br />
        </div>
        <vs-table v-else class="mt-4" max-items="10" pagination search stripe :data="listaSecuencia" v>
            <template slot="header">
                <vs-chip color="primary">Cantidad: {{ listaSecuencia.length }}</vs-chip>
            </template>
            <template slot="thead">
                <vs-th> Iniciales </vs-th>
                <vs-th> Secuencia </vs-th>
                <vs-th> Codigo asesor </vs-th>
                <vs-th> Asesor </vs-th>
                <vs-th> Acciones </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].sec_ven_nombre">
                        {{data[indextr].sec_ven_nombre}}
                    </vs-td>
                    <vs-td :data="data[indextr].sec_ven_valor">
                        {{data[indextr].sec_ven_valor}}
                    </vs-td>
                    <vs-td :data="data[indextr].ven_d_codigo">
                        {{data[indextr].ven_d_codigo}}
                    </vs-td>
                    <vs-td :data="data[indextr].nombres">
                        {{data[indextr].nombres}}
                        {{data[indextr].apellidos}}
                        <p class="mt-1"><b>Código Institución:</b> {{ tr.institucion_facturacion }} </p>
                        <p class="mt-1"><b>Id Cliente Institución:</b> {{ tr.cli_ins_codigo }} </p>
                    </vs-td>
                    <vs-td>
                        <vs-button color="warning" round icon="edit" class="m-1" @click="f_modal_datos(data[indextr])"></vs-button>
                        <vs-button color="danger" round icon="delete" class="m-1" @click="f_confirma_delete(data[indextr])"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
import vSelect from 'vue-select';
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            listaSecuencia: [],
            listaPeriodos: [],
            listaAsesores: [],
            asesorSelect: '',
            periodoSelect: '',
            modalAddSecuencia: false,
            txt_titulo_modal: '',
            txt_boton: '',
            datos: {},
            usuario: '',
            noroot: '',
            datoEliminar:'',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getUserRoot(me.usuario);
    },
    methods: {
        getUserRoot(dato) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    console.log(result.data)
                    if (result.data.length > 0) {
                        me.getPeriodos();
                        me.getAsesores();
                    } else {
                        me.noroot = 'No tiene permisos para acceder a esta seccion'
                        me.f_notificaciones(me.noroot, 'danger', 'icon-alert-triangle')
                    }
                    me.$vs.loading.close()
                })
                .catch((err) => {
                    console.log(err)
                })
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
            this.$http.get(this.$server_url + 'getPedidoSecuencia/' +idperiodo)
                .then((result) => {
                    // console.log(result.data)
                    me.listaSecuencia = result.data
                    me.$vs.loading.close()
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close()
                });
        },
        getAsesores() {
            let me = this;
            this.$http.get(this.$server_url + 'listaAsesores')
                .then((result) => {
                    // console.log(result.data)
                    me.listaAsesores = result.data
                }).catch((err) => {
                    console.log(err)
                });
        },
        f_modal_datos(item) {
            let me = this;
            console.log(item)
            me.txt_titulo_modal = 'Agregar registro de secuencia'
            me.txt_boton = 'Guardar';
            me.datos = {
                'id': '',
                'sec_ven_nombre':           me.periodoSelect.codigo_contrato,
                'id_periodo':               me.periodoSelect.idperiodoescolar,
                'ven_d_codigo':             '',
                'sec_ven_valor':            '',
                'institucion_facturacion':  '',
                'cli_ins_codigo':           '',
            }
            me.asesorSelect = {
                'idusuario': '',
                'nombres': ''
            };
            if (item != null) {
                me.txt_titulo_modal = 'Editar registro'
                me.txt_boton = 'Editar';
                me.datos = {
                    'id': item.id,
                    'sec_ven_nombre':           item.sec_ven_nombre,
                    'id_periodo':               item.id_periodo,
                    'ven_d_codigo':             item.ven_d_codigo,
                    'sec_ven_valor':            item.sec_ven_valor,
                    'institucion_facturacion':  item.institucion_facturacion,
                    'cli_ins_codigo':           item.cli_ins_codigo
                }
                me.asesorSelect = {
                    'idusuario': item.asesor_id,
                    'nombres': item.nombres + ' ' + item.apellidos
                }
            }
            me.modalAddSecuencia = true;
        },
        f_guardar() {
            let me = this;
            let msj = "";
            if (me.asesorSelect == null || me.asesorSelect.idusuario == '') {
                msj = 'Seleccione un asesor'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return;
            }
            //validar que el asesor ya no este ingresado en el periodo
            if(me.datos.id == ""){
                let datos = me.listaSecuencia
                let search = datos.filter(p => p.asesor_id == me.asesorSelect.idusuario)
                if(search.length > 0){
                    msj = 'El asesor ya se encuentra asignado en el período'
                    me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                    return
                }
            }
            if (me.datos.ven_d_codigo == '') {
                msj = 'Ingrese las iniciales del asesor'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return;
            }
            if (me.datos.sec_ven_valor == '') {
                msj = 'Ingrese la secuencia para los pedidos'
                me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                return;
            }
            me.datos.asesor_id = me.asesorSelect.idusuario
            console.log(me.datos)
            me.$vs.loading()
            this.$http.post(this.$server_url + 'storePedidoSecuencia', me.datos)
                .then((result) => {
                    console.log(result.data)
                    me.f_pedidos(me.datos.id_periodo)
                    console.log(me.datos.id_periodo)
                    me.modalAddSecuencia = false;
                    me.$vs.loading.close()
                }).catch((err) => {
                    me.$vs.loading.close()
                });
        },
        f_confirma_delete(item) {
            let me = this;
            console.log(item)
            me.datoEliminar = item
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este item?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarItem
            })
        },
        eliminarItem() {
            let me = this;
            let msj;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'deletePedidoSecuencia/' + me.datoEliminar.id)
                .then((result) => {
                    msj = 'Item eliminado correctamente.';
                    me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                    me.f_pedidos(result.data.id_periodo)
                    me.$vs.loading.close()
                }).catch((err) => {
                  msj = 'No se pudo eliminar el item solicitado.';
                    me.f_notificaciones(msj, 'warning', 'icon-alert-triangle')
                    me.$vs.loading.close()
                });
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
