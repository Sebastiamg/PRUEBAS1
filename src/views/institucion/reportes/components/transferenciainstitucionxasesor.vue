<template>
    <vx-card fixed-height="true">
        <vs-row>
            <!-- {{ asesorInicial }} -->
            <vs-divider>Selección de asesor</vs-divider>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <div class="flex mt-5" width="100%">
                    <div style="width: 40%;">
                        <p>
                            <ion-icon name="contract-outline"></ion-icon> Seleccione un asesor activo al que desea mover las Instituciones:
                        </p>
                    </div>
                    <div style="width: 60%;">
                        <v-select :options="asesoresFiltrados" :reduce="asesoresFiltrados => ({ idusuario: asesoresFiltrados.idusuario, cedula: asesoresFiltrados.cedula, nombres: asesoresFiltrados.nombres })" label="nombres" class="w-full h-100" placeholder="--Seleccione--" v-model="asesorSelect" ref="asesorSelect" :class="classvalidar_asesorSelect" />
                    </div>
                </div>
            </vs-col>
            <vs-row>
                <vs-divider>Selección de institución/es a transferir</vs-divider>
                <!-- {{ instituciones }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;">
                    <vs-table ref="tabla" multiple stripe v-model="codigoSelected" search :data="instituciones">
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
                </vs-col>
            </vs-row>
        </vs-row>
        <br><br>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="ConfirmarmoverInstitucionaOtroAsesor()" type="relief">Mover</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-row>
        <!-- Seccion Popups -->
        <vs-popup class="informacionformhijodehijo" :title="`¿Confirma realizar este movimiento?`" :active.sync="popupActivoConfirmarMovimiento">
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                    <table width="100%">
                        <tr>
                            <td width="50%" align="center">
                                <b>Del Asesor:</b> {{ asesorInicial.length > 0 && asesorInicial[0].nombres ? asesorInicial[0].nombres : 'No seleccionado' }}
                            </td>
                            <td><b style="font-size: 20px;">→</b></td>
                            <td width="50%" align="center">
                                <b>Al Asesor:</b> {{ asesorSelect && asesorSelect.nombres ? asesorSelect.nombres : 'No seleccionado' }}
                            </td>
                        </tr>
                    </table>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                    <table width="100%">
                        <tr>
                            <td align="center">
                                <b>Lista de instituciones a mover</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <vs-table search :data="codigoSelected">
                                    <!-- Título antes de la tabla -->
                                    <template slot="header">
                                        <vs-chip color="primary">Cantidad: <b>{{ codigoSelected.length }}</b></vs-chip>
                                    </template>
                                    <template slot="thead">
                                        <vs-th>RUC</vs-th>
                                        <vs-th>Institución</vs-th>
                                    </template>
    
                                    <template slot-scope="{data}">
                                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                            <vs-td>{{ tr.ruc }} </vs-td>
                                            <vs-td>{{ tr.nombreInstitucion }}</vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                            </td>
                        </tr>
                    </table>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button class="m-2" @click="moverInstitucionaOtroAsesor()" type="relief">Aceptar</vs-button>
                    <vs-button class="m-2" @click="getCancelarConfirmacion()" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-row>
        </vs-popup>
    </vx-card>
    </template>
    
    <script>
    import {
        mapState
    } from "vuex";
    import vSelect from "vue-select";
    export default {
        data() {
            return {
                codigoSelected: [],
                asesorSelect: '',
                asesoresFiltrados: [], // Nueva lista filtrada
                classvalidar_asesorSelect: '',
                popupActivoConfirmarMovimiento: false,
                asesorInicial: [],
            };
        },
        components: {
            "v-select": vSelect,
        },
        props: {
            instituciones: {
                type: Array,
                default: () => []
            },
            asesores: {
                type: Array,
                default: () => []
            },
            asesorSeleccionado: {
                type: String,
                default: ''
            },
        },
        mounted() {
            let me = this;
            // console.log(me.asesores, "asesorrrrrrrr");
            this.asesoresFiltrados = this.asesores.filter(asesor => asesor.cedula !== this.asesorSeleccionado);
            this.asesorInicial = this.asesores.filter(asesor => asesor.cedula == this.asesorSeleccionado);
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        },
        methods: {
            ConfirmarmoverInstitucionaOtroAsesor() {
                let me = this;
                if (me.asesorSelect == '' || me.asesorSelect == null || me.asesorSelect == 0) {
                    me.validarcampo_asesorSelect();
                    return;
                }
                if (me.codigoSelected.length == 0 || me.codigoSelected === null || me.codigoSelected === 0 || me.codigoSelected == '') {
                    me.validarcampo_tabla();
                    return;
                }
                me.popupActivoConfirmarMovimiento = true;
            },
            getCancelarConfirmacion() {
                let me = this;
                me.popupActivoConfirmarMovimiento = false;
            },
            validarcampo_asesorSelect() {
                let me = this;
                const focus_asesorSelect = me.$refs.asesorSelect.$el.querySelector('input');
                focus_asesorSelect.focus();
                me.classvalidar_asesorSelect = 'stylevalidar';
                //Notificación de vacio
                me.$vs.notify({
                    text: 'Seleccione el asesor al que desea mover la/s institución/es.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: '7000',
                });
                // Quitar la clase después de la duración de la animación
                setTimeout(() => {
                    me.classvalidar_asesorSelect = '';
                }, 1500); // Ajusta según la duración de tu animación
            },
            validarcampo_tabla() {
                let me = this;
    
                // Asegúrate de que existe la tabla
                if (me.$refs.tabla) {
                    const tablaElement = me.$refs.tabla.$el; // Elemento principal de la tabla
    
                    // Aplica la clase de resaltado
                    tablaElement.classList.add('stylevalidar-tabla');
    
                    // Desplaza la vista hacia la tabla
                    tablaElement.scrollIntoView({
                        behavior: 'smooth'
                    });
    
                    // Notificación de advertencia
                    me.$vs.notify({
                        text: 'Debe seleccionar al menos una institución.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: '7000',
                    });
    
                    // Quitar el estilo después de 1.5 segundos
                    setTimeout(() => {
                        tablaElement.classList.remove('stylevalidar-tabla');
                    }, 3500);
                } else {
                    console.error('No se encontró la tabla');
                }
            },
            moverInstitucionaOtroAsesor() {
                let me = this;
                me.popupActivoConfirmarMovimiento = false;
                me.$vs.loading()
                // console.log("entro a crear");
                let datos = {
                    "Id_Asesor_Seleccionado": me.asesorSelect.idusuario,
                    "Cedula_Asesor_Seleccionado": me.asesorSelect.cedula,
                    "InstitucionesAMover": me.codigoSelected,
                }
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'MoverInstitucionxAsesor', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        // this.getContUserAgrupacionParametro();
                        me.$vs.notify({
                            text: 'Instituciones transferidas con éxito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitmover: 1
                        });
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                        console.log(error + ' error');
                    });
            },
            getCancelar() {
                this.$emit('change', {
                    verificacionemitmover: 2
                });
            },
        },
    };
    </script>
    
    <style scoped>
    .stylevalidar {
        /* border: 2px solid #00f; */
        box-shadow: 0px 0px 2px 4px #ff0000;
        border-radius: 5px;
    }
    
    .stylevalidar-tabla {
        box-shadow: 0px 0px 2px 4px #ff0000;
        border-radius: 4px;
    }
    
    .informacionformhijodehijo {
        z-index: 51002;
        /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
        /* position: fixed; */
        /* Asegúrate de que la posición sea adecuada */
    }
    </style>
    