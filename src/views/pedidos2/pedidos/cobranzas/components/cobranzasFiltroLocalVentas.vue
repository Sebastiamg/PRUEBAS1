<template>
<div>
    <vx-card class="mb-4" title="Busqueda local de ventas por cobrar">
        <div class="vx-row">
            <!-- <div class="vx-col w-full md:w-1/4 mb-3">
                <span>Tipo de busqueda:</span>
                <v-select
                    :options="tipoBusquedaOptions"
                    :reduce="item => item.value"
                    label="label"
                    class="w-full"
                    placeholder="--Seleccione tipo--"
                    v-model="filtros.tipo"
                />
            </div> -->
            <!-- <div class="vx-col w-full md:w-1/4 mb-3">
                <span>Empresa (opcional):</span>
                <v-select
                    :options="listaEmpresas"
                    :reduce="item => item"
                    label="descripcion_corta"
                    class="w-full"
                    placeholder="--Todas--"
                    v-model="filtros.empresa"
                />
            </div> -->
            <div class="vx-col w-full md:w-2/4 mb-3">
                <span>Buscar por institucion, usuario o ruc <small>(enter para buscar)</small>:</span>
                <vs-input
                    v-model="filtros.busqueda"
                    @keypress.enter="buscar()"
                    class="w-full"
                    placeholder="Escriba para buscar"
                />
            </div>
        </div>
        <div class="flex" style="gap:10px;">
            <vs-button color="warning" type="filled" @click="buscar()" icon="search">Buscar</vs-button>
            <vs-button color="dark" type="border" @click="limpiar()">Limpiar</vs-button>
        </div>
    </vx-card>

    <div class="vx-col w-full" v-if="resultados.length > 0">
        <vs-table max-items="8" search pagination :data="resultados" striped>
            <template slot="header">
                <vs-chip color="primary">Instituciones con ventas: <b>{{ resultados.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Institucion</vs-th>
                <vs-th>Clientes</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <b class="text-success">{{ tr.estado_ventas }}</b><br>
                        {{ tr.nombreInstitucion }}
                    </vs-td>
                    <vs-td>
                        {{ tr.datosClienteInstitucion.length }} cliente(s)
                    </vs-td>
                    <template slot="expand">
                        <div class="w-full">
                            <b>Clientes con ventas por cobrar</b>
                            <template v-if="tr.datosClienteInstitucion.length > 0">
                                <vs-list v-for="(cliente, index) in tr.datosClienteInstitucion" :key="index">
                                    <vs-list-item
                                        :title="cliente.nombres ? cliente.nombres : 'Cliente sin nombre'"
                                        :subtitle="(cliente.cedula ? cliente.cedula : 'Sin cedula') + ' | Ventas: ' + cliente.total_ventas"
                                    >
                                        <template slot="avatar">
                                            <vs-avatar />
                                        </template>
                                        <div class="w-full mt-2">
                                            <span><b>RUC ventas:</b> {{ cliente.ruc_cliente ? cliente.ruc_cliente : 'SIN RUC' }}</span>
                                            <vs-button
                                                class="ml-3"
                                                color="danger"
                                                size="small"
                                                @click="copiarRuc(cliente.ruc_cliente)"
                                            >
                                                Copiar RUC a busqueda
                                            </vs-button>
                                        </div>
                                    </vs-list-item>
                                </vs-list>
                            </template>
                            <template v-else>
                                <vs-alert color="danger" active="true" class="mt-5" icon-pack="feather" icon="icon-alert-triangle">
                                    No hay <b>Registros</b> para esta institucion.
                                </vs-alert>
                            </template>
                        </div>
                    </template>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select';

export default {
    name: 'CobranzasFiltroLocalVentas',
    components: {
        'v-select': vSelect,
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {};
            }
        },
        listaEmpresas: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data() {
        return {
            filtros: {
                tipo: 'general',
                busqueda: '',
                empresa: null,
            },
            tipoBusquedaOptions: [{
                    label: 'General',
                    value: 'general'
                },
                {
                    label: 'Institucion',
                    value: 'institucion'
                },
                {
                    label: 'Usuario',
                    value: 'usuario'
                },
                {
                    label: 'RUC',
                    value: 'ruc'
                }
            ],
            resultados: [],
        };
    },
    methods: {
        buscar() {
            let me = this;
            if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'No se encontro el periodo seleccionado',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            if (me.filtros.busqueda && me.filtros.busqueda.length < 3) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Ingrese al menos 3 caracteres para buscar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            let empresa = me.filtros.empresa && me.filtros.empresa.id ? me.filtros.empresa.id : '';

            me.$vs.loading();
            this.$http.get(this.$server_url + 'cobranzasFiltroLocalVentas?periodo=' + me.periodoSelect.idperiodoescolar + '&busqueda=' + me.filtros.busqueda + '&tipo=' + me.filtros.tipo + '&empresa=' + empresa)
                .then(function (res) {
                    let datosFormateados = res.data;
                    
                    // Agrupar clientes repetidos por identificacion o idusuario dentro de la misma institucion
                    if(datosFormateados && datosFormateados.length > 0) {
                        datosFormateados = datosFormateados.map(institucion => {
                            if(institucion.datosClienteInstitucion && institucion.datosClienteInstitucion.length > 0) {
                                let clientesAgrupados = [];
                                let clientesMap = new Map();
                                
                                institucion.datosClienteInstitucion.forEach(cliente => {
                                    // Usamos la cedula o ruc como key para agrupar
                                    let key = cliente.cedula || cliente.ruc_cliente || cliente.idusuario;
                                    
                                    if(clientesMap.has(key)) {
                                        let clienteExistente = clientesMap.get(key);
                                        // Sumar las ventas del cliente duplicado al original
                                        clienteExistente.total_ventas = parseInt(clienteExistente.total_ventas) + parseInt(cliente.total_ventas);
                                    } else {
                                        // Clonamos el objeto para no mutar el original directamente si no queremos
                                        clientesMap.set(key, {...cliente});
                                    }
                                });
                                
                                // Convertimos el map a array de nuevo
                                clientesAgrupados = Array.from(clientesMap.values());
                                institucion.datosClienteInstitucion = clientesAgrupados;
                            }
                            return institucion;
                        });
                    }

                    me.resultados = datosFormateados;
                    me.$vs.loading.close();
                    if (me.resultados.length == 0) {
                        me.$vs.notify({
                            title: 'Sin resultados',
                            text: 'No se encontraron ventas cobrables con ese filtro',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch(function () {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Ocurrio un error al consultar ventas locales',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        limpiar() {
            this.filtros.tipo = 'general';
            this.filtros.busqueda = '';
            this.filtros.empresa = null;
            this.resultados = [];
        },
        copiarRuc(ruc) {
            if (!ruc) {
                this.$vs.notify({
                    title: 'Aviso',
                    text: 'El registro no tiene RUC para copiar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            this.$emit('copiar-ruc', ruc);
            this.limpiar();
            this.$vs.notify({
                title: 'Listo',
                text: 'RUC copiado al buscador de abonos',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
            });
        }
    }
}
</script>
