<template>
<div>
    <b>Documento Bodega: {{ ObjectSelected.codigo_devolucion }}</b>
    <div id="seccionImprimir2" class="mt-5">
        <div>
            <div v-if="ven_codigoSinEmpresa == ''">
            </div>
            <div v-else>
                <h4 style="text-align: center;" v-if="empresaSelected == 0">DEVOLUCIÓN {{ ven_codigoSinEmpresa  }}</h4>
            </div>
            <table style="width: 100%; border-collapse: collapse; border: none;">
                <tr style="border: none;">
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            <b>Fecha:</b>
                        </p>
                    </td>
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            {{ ObjectSelected.created_at }}
                        </p>
                    </td>
                </tr>
                <tr style="border: none;">
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            <b>Cliente:</b>
                        </p>
                    </td>
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            {{ ObjectSelected.institucion ? ObjectSelected.institucion.nombreInstitucion : 'Sin cliente' }}
                        </p>
                    </td>
                </tr>
                <tr style="border: none;">
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            <b>Periodo:</b>
                        </p>
                    </td>
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            {{ ObjectSelected.periodo }}
                        </p>
                    </td>
                </tr>
                <!--usuario creador-->
                <tr style="border: none;">
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            <b>Usuario Creador:</b>
                        </p>
                    </td>
                    <td style="border: none; text-align: left; padding-left: 0px;">
                        <p class="letra" style="font-size: 11px; margin: 0;">
                            {{ ObjectSelected.usuario ? ObjectSelected.usuario.nombres + ' ' + ObjectSelected.usuario.apellidos : '' }}
                        </p>
                    </td>
                </tr>

            </table>
            <br>
            <p v-if="empresaSelected == 0"><b>Total Codigos Sin Empresa: {{ cantidadSinEmpresa }}</b></p>
        </div>
        <vs-divider>Asignacion de Empresa y Documentos</vs-divider>
        <div class="my-3">
            <div>
                <div class="flex w-full justify-center items-center">
                    <div class="w-1/2 flex justify-center items-center">
                        Empresa:
                        <v-select class="ml-2 w-full" :options="listaEmpresas" :reduce="(listaEmpresas) => listaEmpresas" label="nombre" value="id" placeholder="--Seleccione--" v-model="SelectEmpresa" @input="changeSelect" />
                    </div>
                    <div class="ml-2 w-1/4">
                        <vs-button class="vs-con-loading__container " color="success" tipe="relief" ref="loadableButton" id="button-with-loading" @click="searchDocument();" :disabled="isLoading">
                            <span v-if="isLoading">Cargando...</span>
                            <span v-else>Buscar Documentos</span>
                        </vs-button>
                    </div>
                </div>
            </div>
            <div class="vx-row">
                <!--SIN EMPRESA-->
                <div class="vx-col w-full" v-if="empresaSelected == 0">
                    <div class="flex justify-center items-center my-3">
                        <vs-button color="danger" @click="toggleFilter" v-if="shouldShowFilterButton">
                            {{ isFilterActive ? 'Quitar Filtro Sin Coincidencias' : 'Filtrar Datos Sin Coincidencias' }}
                        </vs-button>
                    </div>
                    <div v-if="arraySinEmpresa.length > 0">
                        <vs-table :data="filteredData" pagination search no-data-text="No hay datos disponibles" :max-items="filteredData.length">
                            <template slot="header">
                                <vs-chip color="primary">Cantidad: <b> {{ filteredData.length }}</b></vs-chip>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="codigo"> Código </vs-th>
                                <vs-th> Libro </vs-th>
                                <vs-th sort-key="cantidad"> Cantidad </vs-th>
                                <vs-th> Codigos </vs-th>
                                <vs-th> Documento Sugerido </vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td> {{ tr.codigo }} </vs-td>
                                    <vs-td> {{ tr.nombrelibro }} </vs-td>
                                    <vs-td> {{ tr.cantidad }} </vs-td>
                                    <vs-td>
                                        <div class="overflow-y-auto h-24">
                                            <ul>
                                                <li v-for="(item, index) in arrayCodigos" :key="index">{{ (item.pro_codigo === tr.codigo) && !item.id_empresa ? `${item.codigo}-${item.codigo_union} (Factura: ${item.factura})` : '' }}</li>
                                            </ul>
                                        </div>
                                    </vs-td>
                                    <vs-td>
                                        <ul v-if="datosSugeridos.length > 0">
                                            <li v-for="(itemtr, indextrS) in datosSugeridos" :key="indextrS">
                                                <ul v-if="itemtr.detallesDevolucion.length > 0">
                                                    <li v-if="itemtr.codigo === tr.codigo" v-for="(itemdet, indexdet) in itemtr.detallesDevolucion" :key="indexdet">
                                                        <b>Documento:</b> {{ itemdet.ven_codigo}} <br>
                                                        <b>Cantidad A Devolver: </b>{{ itemdet.cantidadDevolucion }}
                                                    </li>
                                                </ul>
                                            </li>
                                            <div v-if="datosSugeridos.every(item => item.detallesDevolucion.length === 0)">
                                                <b class="text-danger">No hay documentos para devolver</b>
                                            </div>
                                        </ul>
                                    </vs-td>
                                    <vs-td>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </div>
        </div>
        <vs-divider></vs-divider>
        <div class="ml-2 w-1/4" v-if="!datosSugeridos.every(item => item.detallesDevolucion.length <= 0)">
            <vs-button class="vs-con-loading__container " color="success" tipe="relief" ref="loadableButton" id="button-with-loading" @click="saveFilteredData" :disabled="isLoading">
                <span v-if="isLoading">Cargando...</span>
                <span v-else>Asignar devoluciones</span>
            </vs-button>
        </div>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select';
import imprimirMixin from "@/mixins/Pedidosmix";
export default {
    mixins: [imprimirMixin],
    components: {
        vSelect,
    },
    data() {
        return {
            empresaSelected: null,
            arraySinEmpresa: [],
            //subtotales
            subtotalSinEmpresa: 0,
            //totales
            totalSinEmpresa: 0,
            //total codigos
            cantidadSinEmpresa: 0,
            //ven codigos
            ven_codigoSinEmpresa: '',

            listaEmpresas: [],
            SelectEmpresa: null,

            isLoading: false,
            institucion: '',

            datosSugeridos: [],
            datosDocSugeridos: [],

            isFilterActive: false,

            usuario: [],
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        ObjectSelected: {
            type: Object,
            default: function () {
                return {}
            }
        },
        arrayCodigosDevueltosSinEmpresa: {
            type: Array,
            default: function () {
                return []
            }
        },
        arrayCodigosRegaladosSinEmpresa: {
            type: Array,
            default: function () {
                return []
            }
        },
        arrayCodigosRegaladosSinEmpresaLiquidados: {
            type: Array,
            default: function () {
                return []
            }
        },
        arrayCodigosRegaladosSinEmpresaActas: {
            type: Array,
            default: function () {
                return []
            }
        },
        arrayCodigosRegaladosSinEmpresaActasLiquidados: {
            type: Array,
            default: function () {
                return []
            }
        },
        arrayEmpresas: {
            type: Array,
            default: function () {
                return []
            }
        },
        arrayCodigos: {
            type: Array,
            default: function () {
                return []
            }
        },
    },
    mounted() {
        let me = this
        me.start()
        me.getEmpresas()
        me.institucion = me.ObjectSelected.institucion.idInstitucion
    },
    computed: {
        filteredData() {
            if (!this.isFilterActive) {
                return this.arraySinEmpresa;
            }
            return this.arraySinEmpresa.filter(tr => {
                let total = 0;
                return !this.datosSugeridos.some(itemtr =>
                    itemtr.codigo === tr.codigo &&
                    itemtr.detallesDevolucion.some(itemdet =>
                        total += itemdet.cantidadDevolucion
                    ),
                    tr.cantidad !== total
                );
            });
        },
        shouldShowFilterButton() {
            return this.arraySinEmpresa.some(tr => {
                let total = 0;

                const matchingItem = this.datosSugeridos.find(itemtr => itemtr.codigo === tr.codigo);

                if (matchingItem) {
                    matchingItem.detallesDevolucion.forEach(itemdet => {
                        total += itemdet.cantidadDevolucion;
                    });

                    return tr.cantidad !== total;
                }

                return false;
            });
        }
    },
    methods: {
        toggleFilter() {
            this.isFilterActive = !this.isFilterActive;
        },
        changeSelect() {
            let me = this;
            me.datosSugeridos = [];
        },
        searchDocument() {
            let me = this;

            if (this.SelectEmpresa) {
                let itemsParaBuscar = me.arraySinEmpresa.map(item => ({
                    codigo: item.codigo,
                    cantidad: item.cantidad
                }));
                itemsParaBuscar = JSON.stringify(itemsParaBuscar);
                if (this.isLoading) return;

                this.isLoading = true;
                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading",
                    scale: 0.45
                });

                this.$http.get(this.$server_url + 'devoluciones?documentoParaSinEmpresa=yes' + '&institucion=' + me.institucion + '&itemsBusqueda=' + itemsParaBuscar + '&empresa=' + me.SelectEmpresa.id + '&periodo=' + me.ObjectSelected.periodo_id)
                    .then(res => {
                        if (res.data.message === 'Documentos encontrados') {
                            me.datosSugeridos = res.data.data;
                            let venCodigosUnicos = new Set();

                            me.datosSugeridos.forEach(item => {
                                if (item.detallesDevolucion && Array.isArray(item.detallesDevolucion)) {
                                    item.detallesDevolucion.forEach(detalle => {
                                        venCodigosUnicos.add(detalle.ven_codigo);
                                    });
                                }
                            });

                            me.datosDocSugeridos = Array.from(venCodigosUnicos);
                            console.log(me.datosDocSugeridos);
                        } else {

                            this.$vs.notify({
                                title: 'Error',
                                text: res.data.message,
                                type: 'error',
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Hubo un problema al verificar el documento.',
                            type: 'error',
                        });
                    })
                    .finally(() => {
                        this.isLoading = false;
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading");
                    });
            } else {
                this.$vs.notify({
                    title: 'Error',
                    text: 'Por favor, seleccione una empresa.',
                    type: 'error',
                });
            }
        },
        getEmpresas() {
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    this.listaEmpresas = res.data.filter(empresa => empresa.id !== 2);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        start() {
            let me = this
            me.arraySinEmpresa = []

            me.subtotalSinEmpresa = 0

            me.totalSinEmpresa = 0

            me.ven_codigoSinEmpresa = ''

            me.empresaSelected = me.arrayEmpresas[0].id_empresa

            me.arraySinEmpresa = [...me.arrayCodigosDevueltosSinEmpresa, ...me.arrayCodigosRegaladosSinEmpresa, ...me.arrayCodigosRegaladosSinEmpresaActas, ...me.arrayCodigosRegaladosSinEmpresaLiquidados, ...me.arrayCodigosRegaladosSinEmpresaActasLiquidados]

            me.arraySinEmpresa.sort((a, b) => a.codigo.localeCompare(b.codigo));

            me.subtotalSinEmpresa = me.arraySinEmpresa.reduce((total, item) => total + parseFloat(item.subtotal), 0);

            me.totalSinEmpresa = me.arraySinEmpresa.reduce((total, item) => total + parseFloat(item.total), 0);

            me.cantidadSinEmpresa = me.arraySinEmpresa.reduce((total, item) => total + parseFloat(item.cantidad), 0);

            me.getDocumentosEmpresa()
        },
        getDocumentosEmpresa() {
            let me = this
            var url = `devoluciones?getDocumentosFinalizados=1&idDocumentoPadre=${ me.ObjectSelected.id }`
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    let datos = res.data
                    me.arrayEmpresas.forEach(element => {
                        if (element.id_empresa == 0) {
                            let ifExistDocument = datos.filter(p => p.id_empresa == 0)
                            if (ifExistDocument.length > 0) {
                                me.ven_codigoSinEmpresa = ifExistDocument[0].ven_codigo
                            } else {
                                me.ven_codigoSinEmpresa = ''
                            }
                            element.arrayCodigos = me.arraySinEmpresa;
                        }

                    });
                    if (datos.length == 0) {
                        me.$emit('changeFinished', me.arrayEmpresas)
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        saveFilteredData() {
            let me = this;
            if (this.isLoading) return;

            this.isLoading = true;
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });

            const filteredDataToSave = this.filteredData;

            if (filteredDataToSave.length > 0 && me.SelectEmpresa.id) {
                const dataToSave = {
                    iDdocumentoDev: me.ObjectSelected.id,
                    documentoDev: me.ObjectSelected.codigo_devolucion,
                    empresaId: me.SelectEmpresa.id,
                    periodo_id: me.ObjectSelected.periodo_id,
                    usuarioModificador: me.usuario.idusuario,
                    datosFiltrados: filteredDataToSave
                        .map(tr => {
                            const itemtr = this.datosSugeridos.find(item => item.codigo === tr.codigo);

                            // Solo continuar si se encuentra el itemtr y tiene detallesDevolucion
                            if (itemtr && itemtr.detallesDevolucion && itemtr.detallesDevolucion.length > 0) {
                                const detallesDevolucion = itemtr ? itemtr.detallesDevolucion : [];

                                const codigos = this.arrayCodigos
                                    .filter(item => item.pro_codigo === tr.codigo && !item.id_empresa)
                                    .map(item => ({
                                        codigo: item.codigo,
                                        codigo_union: item.codigo_union
                                    }));

                                return {
                                    ...tr,
                                    detallesDevolucion: detallesDevolucion.map(itemdet => ({
                                        ven_codigo: itemdet.ven_codigo,
                                        cantidadDevolucion: itemdet.cantidadDevolucion,
                                        codigoAfectado: tr.codigo
                                    })),
                                    codigos: codigos
                                };
                            }

                            // Si no tiene datos sugeridos, no retornarlo (filtrar)
                            return null;
                        })
                        .filter(tr => tr !== null) // Elimina los valores null (los que no tienen datos sugeridos)
                };
                const url = `devoluciones?actualizarDatosDevolucion=1`;
                this.$http.post(this.$server_url + url, dataToSave)
                    .then(response => {
                        console.log(response);
                        if (response.data.status == 0) {
                            me.$emit('changeFinishedDevolucion', true)
                            this.$vs.notify({
                                title: 'Exito',
                                text: 'Datos guardados correctamente.',
                                type: 'success',
                            });
                        } else {
                            me.$emit('changeFinishedDevolucion', false)
                            me.$vs.notify({
                                title: 'Error',
                                text: 'Hubo un problema al guardar los datos.',
                                type: 'error',
                            });
                        }

                    })
                    .catch(error => {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Hubo un problema al guardar los datos.',
                            type: 'error',
                        });
                        console.error(error);
                    })
                    .finally(() => {
                        this.isLoading = false;
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading");
                    });
            } else {
                this.$vs.notify({
                    title: 'Error',
                    text: 'No hay datos filtrados para guardar o no se ha seleccionado una empresa.',
                    type: 'error',
                });
            }
        }
    }

}
</script>
