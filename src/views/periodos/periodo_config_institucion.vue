<template>
<div>
    <vs-popup :title="titulo" :active.sync="modalAdd">
        <vs-row>
            <vs-col vs-w="12">
                <small>Seleccione un periodo: </small>
                <v-select :options="listaPeriodos" :reduce="listaPeriodos => listaPeriodos" label="descripcion" class="w-full" v-model="periodoSelect" @input="f_pedidos(periodoSelect)" />
            </vs-col>
            <vs-col vs-xs="12" vs-w="6" class="mt-4">
                <div class="mb-4">
                    <small>Region: </small><br />
                    <vs-radio class="m-2" v-model="region" vs-name="region" vs-value="1">SIERRA</vs-radio>
                    <vs-radio class="m-2" v-model="region" vs-name="region" vs-value="2">COSTA</vs-radio>
                </div>
            </vs-col>
            <vs-col vs-xs="12" vs-w="6" class="mt-4">
                <div class="mb-4">
                    <small>Estado: </small><br />
                    <vs-radio class="m-2" v-model="estado" vs-name="estado" vs-value="1" color="success">Activo</vs-radio>
                    <vs-radio class="m-2" v-model="estado" vs-name="estado" vs-value="0" color="danger">Inactivo</vs-radio>
                </div>
            </vs-col>
            <vs-col vs-w="12">
                <div class="m-2 mb-4">
                    <vs-button :color="btn_color" :icon="btn_icono" @click="f_guardar()"> {{ btn_text }} </vs-button>
                </div>
            </vs-col>
        </vs-row>
    </vs-popup>
    <div class="m-2 mb-4">
        <vs-button icon="add" type="border" @click="f_agregar()">Agregar</vs-button>
    </div>
    <p class="text-success m-4 p-4">
        Configurar periodos para carga de libros en bodega, en caso que un periodo se encuentre activo, y se desee asignar libros a otro periodo.
    </p>
    <div class="m-2 mb-4">
        <vs-table max-items="20" search pagination :data="listaConfig">
            <template slot="header">
                <span>Cantidad:  {{ listaConfig.length }} </span>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Periodo</vs-th>
                <vs-th>Region</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{tr.id}}<br>
                    </vs-td>
                    <vs-td>
                        <!-- {{data[indextr].descripcion}}<br> -->
                        {{tr.idperiodoescolar}}<br>
                        {{tr.periodoescolar}}<br>
                        % {{tr.porcentaje_descuento}}<br>
                        Código {{tr.codigo_contrato}}<br>
                    </vs-td>
                    <vs-td>
                        {{tr.nombreregion}}<br>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.created_at">
                          <b>Fecha de creación: </b>
                          <p>{{ tr.created_at }}</p>
                        </div>
                        <div v-if="tr.updated_at">
                          <b>Fecha de actualización: </b>
                          <p>{{ tr.updated_at }}</p>
                        </div>
                        <vs-chip v-if="tr.estado == 0" color="danger">Inactivo</vs-chip>
                        <vs-chip v-if="tr.estado == 1" color="primary">Activo</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-button class="inline m-1" icon="edit" type="border" color="warning" @click="f_agregar(tr)"></vs-button>
                        <vs-button class="inline m-1" icon="delete" type="border" color="danger" @click="openConfirmEliminar(tr)"></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
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
            listaConfig: [],
            periodoSelect: {},
            listaPeriodos: [],
            modalAdd: false,
            estado: 1,
            region: 1,
            titulo: '',
            btn_color: '',
            btn_icono: '',
            btn_text: '',
            id: '',
        }
    },
    mounted() {
        let me = this;
        me.getPeriodos();
        me.f_getPeriodosConfigInstitucion();
    },
    methods: {
        getPeriodos() {
            let me = this;
            this.$http.get(this.$server_url + 'periodoActivo')
                .then((result) => {
                    console.log(result.data)
                    me.listaPeriodos = result.data
                }).catch((err) => {
                    console.log(err)
                });
        },
        f_getPeriodosConfigInstitucion() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getInstitucionConfiguracion')
                .then((result) => {
                    console.log(result.data)
                    me.listaConfig = result.data;
                    me.$vs.loading.close();
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        f_pedidos(item) {
            let me = this;
            console.log(item)
            if (item == null) {
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'reportePedidosLibrosGuias/' + item)
                .then((result) => {
                    console.log(result.data)
                    me.listaContratosTmp = result.data
                    me.$vs.loading.close()
                }).catch((err) => {
                    console.log(err)
                    me.$vs.loading.close()
                });
        },
        f_agregar(item) {
            let me = this;
            console.log(item);
            me.modalAdd = true;
            me.periodoSelect = {};
            me.region = 1;
            me.estado = 1;
            me.titulo = 'Agregar periodo';
            me.btn_color = 'primary';
            me.btn_icono = 'save';
            me.btn_text = 'Guardar';
            me.id = '';
            if (item != null) {
                me.titulo = 'Editar periodo';
                me.btn_color = 'warning';
                me.btn_icono = 'edit';
                me.btn_text = 'Editar';
                me.id = item.id
                me.region = item.region;
                me.estado = item.estado;
                me.periodoSelect = {
                    'idperiodoescolar': item.idperiodoescolar,
                    'descripcion': item.descripcion,
                    'periodoescolar': item.periodoescolar,
                };
            }
        },
        f_guardar() {
            let me = this;
            let msj;
            if (me.periodoSelect == null || me.periodoSelect.idperiodoescolar == null) {
                msj = 'Seleccione el periodo escolar';
                me.f_notificaciones(msj, 'danger', 'alert-triangle');
                return;
            }
            let data = {
                'id': me.id,
                'region': me.region,
                'periodo_configurado': me.periodoSelect.idperiodoescolar,
                'estado': me.estado,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + 'institucion_conf_periodo', data)
                .then(res => {
                    console.log(res.data);
                    me.f_notificaciones(res.data.mensaje, 'success', 'check');
                    me.f_getPeriodosConfigInstitucion();
                    me.modalAdd = false;
                    me.$vs.loading.close()
                  })
                  .catch(err => {
                    console.log(err)
                    me.$vs.loading.close()
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
        },
        openConfirmEliminar(item) {
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Eliminar',
                text: `¿Está seguro de eliminar el periodo ${item.periodoescolar}?`,
                acceptText: 'Aceptar',
                accept: () => {
                    me.f_eliminar(item);
                }
            })
        },
        f_eliminar(item) {
            let me = this;
            let formData = new FormData();
            formData.append('id', item.id);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'eliminarInstitucionConfiguradaBodega',formData)
              .then(res => {
                console.log(res.data);
                me.f_notificaciones(res.data.mensaje, 'success', 'check');
                me.f_getPeriodosConfigInstitucion();
                me.$vs.loading.close()
              })
              .catch(err => {
                  console.log(err)
                  me.$vs.loading.close()
              })
        },
    }
}
</script>
