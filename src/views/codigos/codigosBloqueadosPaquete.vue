<template>
    <div>
        <div>
            <vx-card>
                <h4>Cambio de Codigos en Paquetes</h4>
                <import-excel :onSuccess="loadDataInTable" class="mb-4" />
            </vx-card>
           
            <vs-alert v-if="tableData.length > 0" class="mb-3" color="success" icon-pack="feather" icon="icon-alert-triangle">
                <span>Excel cargado exitosamente. ¿Está seguro de procesar estos códigos?</span><br>
            </vs-alert>
            <vs-row v-if="tableData.length > 0 && tableData.length <= 1000 ">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-button class="mb-2" color="primary" type="relief" @click="openConfirm(0)"> Importar Paquetes con remplazo </vs-button>
                </vs-col>
            </vs-row>
            <vx-card v-if="tableData.length && header.length">
                <vs-table stripe pagination max-items="20" search :data="tableData">
                    <template slot="header">
                        <h4>Paquetes con remplazo</h4>
                    </template>
                    <template slot="thead">
                        <vs-th v-for="heading in header" :key="heading">{{ heading }}</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr v-for="(tr, indextr) in data" :key="indextr">
                            <vs-td v-for="(col, indexcol) in tr" :key="indexcol">{{ col }}</vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vx-card>
    
            <vs-popup small title="Confirmación" :active.sync="modalConfirm">
                <div class="w-full mb-base" align="center">
                    <h4>Está seguro de remplazar los códigos a los paquetes?</h4>
                </div>
                <div class="w-full" align="center">
                    <vs-button class="mb-2" color="danger" type="gradient" @click="procesarRemplazo()"> Confirmar </vs-button>
                </div>
            </vs-popup>
    
            <vs-popup small title="Progreso" :active.sync="modalProgreso">
                <div class="w-full mb-base" align="center">
                    <h4 v-if="progreso === 0">Comienzo de envio de dato...</h4>
                    <h4 v-else>Procesando remplazos...</h4>
                </div>
                <div class="w-full" align="center">
                    <vs-progress :percent="progreso" :color="colorProgreso" v-if="progreso > 0"></vs-progress>
                </div>
                <div class="w-full" align="center" v-if="progreso === 100">
                    <h4>Finalizado!</h4>
                </div>
            </vs-popup>
    
            <!-- <vs-popup fullscreen title="Resultado del Proceso" :active.sync="showResults">
            <div style="align-content: end; text-align: right;">
                <vs-button @click="exportToExcel" color="primary" type="gradient" class="m-4">Exportar a Excel</vs-button>
            </div>
            <div class="w-full">
            <h4>Codigos x Paquete Quitados</h4>
            <vs-table max-items="20" search pagination :data="confirmaciones.quitar_paquete">
              <template slot="thead">
                <vs-th>Codigo</vs-th>
                <vs-th>Estado Liquidación</vs-th>
                <vs-th>Codigo Paquete</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr v-for="item in data" :key="item.codigo">
                  <vs-td>{{ item.codigo }}</vs-td>
                  <vs-td>{{ item.estado_liquidacion ==3? 'devuelto':'error' }}</vs-td>
                  <vs-td>{{ item.codigo_paquete == null ? 'Sin paquete': 'error'  }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
            <br>
            <h4>Codigos x Paquete Actualizados</h4>
            <vs-table max-items="20" search pagination :data="flattenedActualizarPaquete">
              <template slot="thead">
                <vs-th>Codigo</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Codigo Paquete</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr v-for="item in data" :key="item.codigo">
                  <vs-td>{{ item.codigo }}</vs-td>
                  <vs-td>{{ item.estado ==2? 'bloqueado':'error' }}</vs-td>
                  <vs-td>{{ item.codigo_paquete }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
    
          </div>
        </vs-popup> -->
        </div>
        <div v-if="showResults">
            <vx-card>
                <div style="align-content: end; text-align: center" class="mb-4">
                    <vs-button @click="exportToExcel" color="primary" type="gradient" class="m-4">Exportar a Excel</vs-button>
                </div>
                <vs-tabs position="left" color="danger">
                    <vs-tab label="Codigos Quitados" v-if="confirmaciones.quitar_paquete.length>0">
                        <vs-table :max-items="20" search pagination :data="confirmaciones.quitar_paquete">
                            <template slot="thead">
                                <vs-th>Codigo</vs-th>
                                <vs-th>Estado Liquidación</vs-th>
                                <vs-th>Codigo Paquete</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr v-for="item in data" :key="item.codigo">
                                    <vs-td>{{ item.codigo }}</vs-td>
                                    <vs-td>{{ item.estado_liquidacion ==3? 'Devuelto':'error' }}</vs-td>
                                    <vs-td>{{ item.codigo_paquete == null ? 'Sin paquete': 'error'  }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <vs-tab label="Codigos Actualizados" v-if="flattenedActualizarPaquete.length>0">
                        <vs-table :max-items="20" search pagination :data="flattenedActualizarPaquete">
                            <template slot="thead">
                                <vs-th>Codigo</vs-th>
                                <vs-th>Estado</vs-th>
                                <vs-th>Codigo Paquete</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr v-for="item in data" :key="item.codigo">
                                    <vs-td>{{ item.codigo }}</vs-td>
                                    <vs-td>{{ item.estado ==2? 'Bloqueado':'error' }}</vs-td>
                                    <vs-td>{{ item.codigo_paquete }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <vs-tab label="Errores" v-if="errores.error_codigo.length>0">
                        <vs-table :max-items="10" search pagination :data="errores.error_codigo">
                            <template v-slot:thead>
                            <vs-th>Código</vs-th>
                            <vs-th>Identificador</vs-th>
                            <vs-th>Error</vs-th>
                            </template>
                            <template v-slot:default="{ data }">
                            <vs-tr v-for="(item, index) in data" :key="index">
                                <vs-td>{{ item.Codigo}}</vs-td>
                                <vs-td>{{ item.Identificador }}</vs-td>
                                <vs-td>{{ item.error }}</vs-td>
                            </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab>
                    <!-- <vs-tab label="Codigos No Actualizados">
                        <vs-table max-items="20" search pagination :data="errores.codigos_no_actualizados">
                            <template v-slot:thead>
                                <vs-th>Codigo No Actualizados</vs-th>
                            </template>
                            <template v-slot:default="{ data }">
                                <vs-tr v-for="(item2, index2) in data" :key="index2">
                                    <vs-td>{{ item2 }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-tab> -->
                </vs-tabs>
            </vx-card>        
        </div>
    </div>
    </template>
    
    <script>
    import vSelect from "vue-select";
    import ImportExcel from "./components/importExcel.vue";
    import XLSX from 'xlsx';
    
    export default {
        components: {
            "v-select": vSelect,
            ImportExcel
        },
        data() {
            return {
                tableData: [],
                header: [],
                dataConvert: [],
                error: [],
                modalConfirm: false,
                progreso: 0,
                colorProgreso: 'primary',
                modalProgreso: false,
                showResults: false,
                confirmaciones: {
                    quitar_paquete: [],
                    actualizar_paquete: []
                },
                errores: {
                    error_codigo: [],
                },
    
            };
        },
        created() {
            let me = this
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
        },
        props: {},
        mounted() {
            let me = this;
        },
        computed: {
            flattenedActualizarPaquete() {
                return this.confirmaciones.actualizar_paquete.flat();
            } 
        },
        methods: {
            loadDataInTable({
                results,
                header,
                meta
            }) {
                this.confirmaciones = {
                    quitar_paquete: [],
                    actualizar_paquete: []
                };
                this.errores = {
                    error_paquete: [],
                    error_codigo: []
                };
                this.showResults = false;
                this.header = header;
                this.tableData = results;
                this.dataConvert = [];
            },
            openConfirm() {
                let me = this;
                if (!this.tableData[0].codigo) {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        text: 'Corrija el formato del excel y vuelva a intentar.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }
    
                $.each(me.tableData, function (key, value) {
                    if ((!value.codigo)) {
                        me.error.push(value)
                    }
                })
                console.log("errrs", me.error)
    
                if (this.error.length > 0) {
                    this.modalErrores = true;
                } else {
                    for (let i = 0; i < this.tableData.length; i += 2) {
                        if (i + 1 < this.tableData.length) { // Asegúrate de que haya un par completo
                            this.dataConvert.push({
                                paquete: this.tableData[i].codigo,
                                codigo_remplazo: this.tableData[i + 1].codigo
                            });
                        }
                    }
    
                    this.modalConfirm = true;
                }
            },
            // procesarRemplazo() {
            //     let me = this;
            //     me.modalConfirm = false;
            //     me.modalProgreso = true;
            //     me.progreso = 0;
            //     me.tiempoInicio = new Date().getTime();
    
            //     for (let i = 0; i < me.tableData.length; i++) {
            //         let formData = new FormData();
            //         formData.append('dataCodigosRemplazo', JSON.stringify([me.tableData[i]]));
            //         me.$http.post(me.$server_url + 'importCodigosRemplazoPaquetes', formData)
            //         .then((res) => {
            //         me.progreso = Math.floor((i + 1) / me.tableData.length * 100);
            //         if (i === me.tableData.length - 1) {
            //             me.tiempoFin = new Date().getTime();
            //             me.colorProgreso = 'success';
            //             console.log(`Tiempo de proceso: ${(me.tiempoFin - me.tiempoInicio) / 1000} segundos`);
            //         }
            //         })
            //         .catch((error) => {
            //         // ...
            //         });
            //         // setTimeout(() => {}, 1000); // Espera 1 segundo antes de enviar el siguiente dato
            //     }
            // }
            procesarRemplazo() {
                let me = this
                let json_remplazos = JSON.stringify(me.dataConvert)
                me.tiempoInicio = new Date().getTime();
                let formData = new FormData();
                formData.append('dataCodigosRemplazo', json_remplazos);
                me.$vs.loading()
                this.$http.post(this.$server_url + 'importCodigosRemplazoPaquetes', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.data.status == 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return false
                        }
                        me.$vs.notify({
                            text: 'Codigos procesados',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.modalConfirm = false
                        me.confirmaciones = res.data.confirmaciones;
                        me.errores = res.data.errores;
                        me.showResults = true;
                        // me.showErrors = me.errores.codigos_invalidos.length > 0;
                        me.tableData = [];
                        me.dataConvert = [];
    
                    })
                    .catch(function (error) {
                        me.$vs.notify({
                            text: 'Verifique que la información se haya guardado correctamente.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close()
                    })
            },
            exportToExcel() {
                // Crear un nuevo libro de trabajo
                const wb = XLSX.utils.book_new();
                
                // Procesar datos para cada hoja
                const sheet1Data = this.confirmaciones.quitar_paquete.map(item => ({
                    Codigo: item.codigo,
                    'Estado Liquidación': item.estado_liquidacion == 3 ? 'Devuelto' : 'error',
                    'Codigo Paquete': item.codigo_paquete == null ? 'Sin paquete' : 'error'
                }));
                
                const sheet2Data = this.flattenedActualizarPaquete.map(item => ({
                    Codigo: item.codigo,
                    Estado: item.estado == 2 ? 'Bloqueado' : 'error',
                    'Codigo Paquete': item.codigo_paquete
                }));
                
                const sheet3Data = this.errores.error_codigo.map(item => ({
                    'Codigo': item.Codigo,
                    'Identificador': item.Identificador,
                    'error': item.error
                }));
                
                // Crear hojas de trabajo solo si contienen datos
                if (sheet1Data.length > 0) {
                    const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
                    XLSX.utils.book_append_sheet(wb, ws1, 'CodigosXPaquetes Quitados');
                }
                
                if (sheet2Data.length > 0) {
                    const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
                    XLSX.utils.book_append_sheet(wb, ws2, 'CodigosXPaquetes Actualizados');
                }
                
                if (sheet3Data.length > 0) {
                    const ws3 = XLSX.utils.json_to_sheet(sheet3Data);
                    XLSX.utils.book_append_sheet(wb, ws3, 'Errores');
                }
                
                // Escribir el archivo solo si hay al menos una hoja
                if (wb.SheetNames.length > 0) {
                    XLSX.writeFile(wb, 'Resultado_CodigosXpaquetes.xlsx');
                } else {
                    console.log('No hay datos para exportar.');
                }
            },
        }
    };
    </script>
    