<template>
    <div>
        <vs-tabs>
            <vs-tab label="Instituciones Período">
                <div class="con-tab-ejemplo">
                    <vx-card>
                        <div class="flex mt-5">
                            <div style="width: 40%;">
                                <p>
                                    <ion-icon name="contract-outline"></ion-icon> Filtro de instituciones por período.
                                </p>
                            </div>
                            <div style="width: 60%;">
                                <v-select @input="getInstitucionesReporte();" :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodoSelect" placeholder="--Seleccione--" />
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div v-if="arregloReporte.length > 0">
                            <vs-table multiple v-model="codigoSelected" max-items="10" search pagination :data="arregloReporte">
                                <template slot="header">
                                    <vs-chip color="primary">Cantidad: <b> {{ arregloReporte.length }}</b></vs-chip>
                                    <span class="cursor-pointer" @click="activePrompt=true;">
                                        <vs-chip color="success"><b>
                                                <ion-icon name="download-outline"></ion-icon> Exportar
                                            </b></vs-chip>
                                    </span>
                                </template>
                                <template slot="thead">
                                    <vs-th>RUC</vs-th>
                                    <vs-th>Institución</vs-th>
                                    <vs-th>Informacion</vs-th>
                                    <vs-th>Asesor</vs-th>
                                </template>
                                <template slot-scope="{data}">
                                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                        <vs-td>{{ tr.ruc}} </vs-td>
                                        <vs-td>{{tr.nombreInstitucion}}</vs-td>
                                        <vs-td>
                                            <small color="primary"><b>Email: </b>{{tr.email}}</small><br />
                                            <small color="success"><b>Telefono: </b>{{tr.telefonoInstitucion}}</small><br />
                                            <small color="danger"><b>Dirección: {{tr.direccionInstitucion}}</b></small>
                                        </vs-td>
                                        <vs-td>
                                            <small color="primary"><b>{{tr.cedula}} - </b>{{tr.nombres}}</small>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                        <!--MODAL PARA EXPORTAR A EXCEL-->
                        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
                            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
                            </vs-alert>
                            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
                            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
                            <div class="flex">
                            </div>
                        </vs-prompt>
                        <br><br><br><br><br>
                    </vx-card>
                </div>
            </vs-tab>
            <vs-tab label="Instituciones Asesores">
                <div class="con-tab-ejemplo">
                    <vx-card>
                        <div class="flex mt-5">
                            <div style="width: 40%;">
                                <p>
                                    <ion-icon name="contract-outline"></ion-icon> Filtro de instituciones por Asesores
                                </p>
                            </div>
                            <div style="width: 60%;">
                                <v-select @input="getInstituciones()" placeholder="--Seleccione--" :options="asesores" :reduce="asesores => asesores.cedula" label="nombres" class="w-full" v-model="asesorSelect" />
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div v-if="instituciones.length > 0">
                            <vs-button v-if="userRoot" type="border" color="success" class="mr-2" @click="getMoverInstitucionesAOtroAsesor();">Mover institución/es a otro asesor</vs-button>
                            <vs-table v-model="codigoSelected" max-items="10" search pagination :data="instituciones">
                                <template slot="header">
                                    <vs-chip color="primary">Cantidad: <b> {{ instituciones.length }}</b></vs-chip>
                                </template>
                                <template slot="thead">
                                    <vs-th>RUC</vs-th>
                                    <vs-th>Institución</vs-th>
                                    <vs-th>Email</vs-th>
                                    <vs-th>Telefono</vs-th>
                                </template>
                                <template slot-scope="{data}">
                                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                        <vs-td>{{ tr.ruc}} </vs-td>
                                        <vs-td>{{tr.nombreInstitucion}}</vs-td>
                                        <vs-td><small color="primary">{{tr.email}}</small></vs-td>
                                        <vs-td><small color="primary">{{tr.telefonoInstitucion}}</small></vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                        <!--MODAL PARA EXPORTAR A EXCEL-->
                        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
                            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
                            </vs-alert>
                            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
                            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
                            <div class="flex">
                            </div>
                        </vs-prompt>
                        <br><br><br><br><br>
                    </vx-card>
                    <!-- SECCION REGISTRO -->
                    <vs-popup fullscreen class="informacionformhijo" @close="getInstituciones();" :title="`Mover las instituciones del asesor: ${AsesorSeleccionado.nombres}`" :active.sync="popupMoverInstitucionesAOtroAsesor">
                        <MoverInstitucionesAOtroAsesor v-if="popupMoverInstitucionesAOtroAsesor" :asesorSeleccionado="asesorSelect" :instituciones="instituciones" :asesores="asesores" @change="changeHandleMoverInstitucionesAOtroAsesor" />
                    </vs-popup>
                </div>
            </vs-tab>
        </vs-tabs>
    </div>
    </template>
    
    <script>
    import {
        mapState
    } from "vuex";
    import vSelect from 'vue-select'
    const MoverInstitucionesAOtroAsesor = () => import("@/views/institucion/reportes/components/transferenciainstitucionxasesor.vue");
    export default {
        data() {
            return {
                arregloReporte: [],
                arregloPeriodos: [],
                asesores: [],
                instituciones: [],
                periodoSelect: '',
                asesorSelect: '',
                activePrompt: false,
                codigoSelected: [],
                reportesActivo: 0,
                fileName: null,
                formats: ['xls', 'xlsx', 'csv', 'txt'],
                cellAutoWidth: true,
                selectedFormat: 'xls',
                popupMoverInstitucionesAOtroAsesor: false,
                AsesorSeleccionado: '',
            }
        },
        components: {
            vSelect,
            MoverInstitucionesAOtroAsesor,
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),
        },
        mounted() {
            let me = this;
            me.getperiodos();
            me.getAsesores();
        },
        methods: {
            getperiodos() {
                let me = this;
                me.arregloPeriodos = [];
                this.$http.get(this.$server_url + 'get_periodos_activos')
                    .then(res => {
                        me.arregloPeriodos = res.data
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                    });
            },
            getInstituciones() {
                let me = this;
                me.AsesorSeleccionado = this.asesores.find(asesor => asesor.cedula === this.asesorSelect);
                if (me.AsesorSeleccionado) {
                    console.log("Nombre seleccionado:", me.AsesorSeleccionado.nombres);
                    // Puedes usar AsesorSeleccionado.nombres según necesites.
                } else {
                    console.log("Asesor no encontrado");
                }
                me.$vs.loading()
                if (me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined) {
                    me.$vs.notify({
                        text: 'Seleccione un período por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.instituciones = [];
                this.$http.get(this.$server_url + 'get_instituciones_asesor/' + me.asesorSelect)
                    .then(res => {
                        me.instituciones = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    });
            },
            getAsesores() {
                let me = this
                this.$http.get(this.$server_url + 'get_asesor')
                    .then(res => {
                        me.asesores = res.data
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                    });
            },
            getInstitucionesReporte() {
                let me = this;
                me.arregloReporte = []
                if (me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined) {
                    me.$vs.notify({
                        text: 'Seleccione un período por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.$vs.loading()
                this.$http.get(this.$server_url + 'instituciones_periodo?id=' + me.periodoSelect)
                    .then(function (res) {
                        me.$vs.loading.close()
                        me.arregloReporte = res.data;
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                        console.log(error + ' error');
                    })
    
            },
            //METODOS PARA EXCEL
            //para limipiar los campos del excel
            clearFields() {
                this.fileName = ''
                this.cellAutoWidth = true
                this.selectedFormat = 'xls'
            },
            //metodo par descargar el excel
            exportToExcel() {
                let headerTitle = ['RUC', 'Institución', 'Email', 'Teléfono', 'Dirección', 'Vendedor'];
                let headerVal = ['ruc', 'nombreInstitucion', 'email', 'telefonoInstitucion', 'direccionInstitucion', 'nombres'];
                let codigoSelectedMayus = this.arregloReporte;
                for (var i = 0; i < codigoSelectedMayus.length; i++) {
                    for (var key in codigoSelectedMayus[i]) {
                        if (typeof codigoSelectedMayus[i][key] == "string") {
                            codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                        }
                    }
                }
                import('@/vendor/Export2Excel').then(excel => {
                    const list = codigoSelectedMayus
                    const data = this.formatJson(headerVal, list)
                    excel.export_json_to_excel({
                        header: headerTitle,
                        data,
                        filename: this.fileName,
                        autoWidth: this.cellAutoWidth,
                        bookType: this.selectedFormat
                    })
                    this.clearFields()
                    this.guardarActivo = '';
                    this.generarActivo = ' ';
                    this.textAlertCant = '';
                    this.cantidad = '';
                    this.codigoSelected = [];
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    return v[j]
                }))
            },
            //METODOS FRONT JEYSON
            getMoverInstitucionesAOtroAsesor() {
                let me = this;
                if (me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined) {
                    this.$vs.dialog({
                        type: 'confirm',
                        color: 'danger',
                        title: "Alerta",
                        acceptText: 'Aceptar',
                        cancelText: 'Cancelar',
                        text: 'Seleccione el asesor del que desea mover las instituciones.',
                        // accept: this.aceptarLibrosObsequios
                    })
                    return
                } else {
                    this.popupMoverInstitucionesAOtroAsesor = true;
                }
            },
    
            changeHandleMoverInstitucionesAOtroAsesor(e) {
                let me = this;
                // console.log("realizarcchangeinicio")
                // console.log(e.verificacionemitmover); // Debería imprimir 1
                if (e.verificacionemitmover == 1) {
                    console.log("Emit recibido por eliminado.");
                    me.popupMoverInstitucionesAOtroAsesor = false;
                    this.getInstituciones();
                } else if (e.verificacionemitmover == 2) {
                    console.log("Emit recibido por cancelado.");
                    me.popupMoverInstitucionesAOtroAsesor = false;
                    this.getInstituciones();
                } else {
                    console.log("Emit no recibido");
                }
            },
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