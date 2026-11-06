<template>
    <div>
        <vx-card title="Alcances Pendientes/Finalizados">
            <div>
                <vs-row style="margin: 0px 0px 20px 0px">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <font style="font-size: 11.5px">&nbsp;Temporada:</font><br />
                            <v-select :value="selected" :options="temporada" :reduce="temporada => temporada.idperiodoescolar" label="periodoescolar" class="w-full" v-model="codtemporada" @input="alcances=[];getAlcancesFinalizadosPendientes();" @keyup.enter="getAlcancesFinalizadosPendientes()" />
                        </vs-col>
                    </vs-row>
                </vs-row>
            </div>
            <div>
                <vs-table max-items="20" pagination search :data="alcances">
                    <template slot="header" v-if="alcances.length>0">
                        <vs-button color="success" type="border" class="m-3" @click="arrayExcel=[];generarExcel();"> <i class="fa-solid fa-file-arrow-down"></i> Exportar Excel</vs-button>
                    </template>
                    <template slot="thead">
                        <vs-th>Contrato</vs-th>
                        <vs-th>Institución</vs-th>
                        <vs-th sort-key="totalAlcancesPendientes">Alcances Pendientes</vs-th>
                        <vs-th>Alcances Finalizados</vs-th>
                        <vs-th>Total Alcances</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" :class="{'text-danger': tr.totalAlcancesPendientes > 0}">
                            <vs-td>{{ tr.contrato_generado }}</vs-td>
                            <vs-td>{{ tr.nombreInstitucion }}</vs-td>
                            <vs-td >{{ tr.totalAlcancesPendientes }}</vs-td>
                            <vs-td>{{ tr.totalAlcancesFinalizados }}</vs-td>
                            <vs-td>{{ parseInt(tr.totalAlcancesPendientes) + parseInt(tr.totalAlcancesFinalizados) }}</vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vx-card>
    </div>
</template>
<script>
import { data } from 'jquery';
import vSelect from 'vue-select';

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            temporada: [],
            alcances: [],
            arrayExcel : [],
            codtemporada: '',
            selected: null,
        };
    },
    mounted() {
        let me = this;
        me.getTemporada();
    },
    methods: {
        getTemporada() {
            this.$http.get(this.$server_url + 'get_periodos_pedidos')
                .then(res => {
                    let datos = res.data;
                    if (datos.length === 0) {
                        this.temporada = [];
                        return;
                    }

                    let years = [2019, 2018, 2017, 2016];
                    let regions = ['Costa', 'Sierra'];

                    years.forEach(year => {
                        regions.forEach(region => {
                            let datosAdd = {
                                periodoescolar: region + ' ' + year,
                                codigo_contrato: region[0] + year.toString().slice(-2)
                            };
                            datos.push(datosAdd);
                        });
                    });

                    this.temporada = datos.filter(item => !/prueba|test|demo/i.test(item.periodoescolar) && item.codigo_contrato !== null);
                })
                .catch(error => {
                    this.$vs.loading.close();
                });
        },
        getAlcancesFinalizadosPendientes(){
            let me = this;
            this.$http.get(this.$server_url + 'getAlcancesFinalizadosPendientes?periodo='+ me.codtemporada)
                .then(res => {
                    let datos = res.data;
                    me.alcances = datos;
                    if (datos.length === 0) {
                        this.alcances = [];
                        return;
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                });
        },
        generarExcel(){
            let me = this;
            me.alcances.forEach(item => {
                this.calcularSumas(item);
            })
            me.$vs.loading();
            setTimeout(() => {
                this.exportToExcel();
                me.$vs.loading.close()
            }, 2000);
        },
        exportToExcel() {
            let me = this;                
            let headerTitle = ""
            let headerVal = ""

            headerTitle = [
                'CONTRATO', //1
                'INSTITUCIÓN', //2
                'ALCANCES PENDIENTES', //3
                'ALCANCES FINALIZADOS', //4
                'TOTAL ALCANCES', //5
            ];

            headerVal = [
                'contrato_generado', //1
                'nombreInstitucion', //2
                'totalAlcancesPendientes', //3
                'totalAlcancesFinalizados', //4
                'total', //5
            ];

            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, me.arrayExcel);
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: `alcance_${me.codtemporada}`,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                });

                this.clearFields();
            }).catch(error => {
                console.error('Error en la exportación a Excel:', error);
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        clearFields() {
            this.fileName = 'alcance';
            this.cellAutoWidth = true;
            this.selectedFormat = 'xlsx';
        },
        calcularSumas(item) {
                let me = this;
                let totalAlcancesPendientes = parseInt(item.totalAlcancesPendientes) || 0;
                let totalAlcancesFinalizados = parseInt(item.codigos_regalado_liquidado) || 0;

                let total = totalAlcancesPendientes + totalAlcancesFinalizados;

                me.arrayExcel.push({
                    contrato_generado: item.contrato_generado,
                    nombreInstitucion: item.nombreInstitucion,
                    totalAlcancesPendientes,
                    totalAlcancesFinalizados,
                    total
                });                
            },
    }
};
</script>
    