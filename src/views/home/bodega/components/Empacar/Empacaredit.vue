<template>
    <div fixed-height="true">
        <br>
        <div>
            <div class="vx-row">
                <vs-collapse class="w-full m-2" style="border-radius: 5px; border:1px solid grey">
                    <p v-if="ObjectedDocument.est_ven_codigo == 11" class="text-danger font-bold text-center text-2xl">Este documento tiene excluidos</p>
                    <vs-collapse-item icon-arrow="label">
                        <div slot="header" class="w-full">
                            <span class="flex font-bold">
                                <vs-icon icon="view_list"></vs-icon> Mostrar información para preparar
                            </span>
                        </div>
                        <div class="vx-row" v-if="arrayLibros.length>0">
                            <div class="vx-col w-full">
                                <b style="font-size: medium;">Ingrese los valores de los item a despachar</b>
                                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                                        <div class="flex" v-if="arrayLibros.length>1">
                                            <b for="checkbox">Desea excluir textos.</b>
                                            <input type="checkbox" style="width:50px;" v-model="activa" id="checkbox" />
                                        </div>
                                    </vs-col>
                                </vs-row>
                                <div class="caja1 vx-col w-full  mb-6">
                                    <vs-table class="table users table-hover" search :data="arrayLibros">
                                        <template slot="thead">
                                            <vs-th width="50"> # </vs-th>
                                            <vs-th width="500"> Detalle del producto </vs-th>
                                            <vs-th width="300"> Cantidad facturado</vs-th>
                                            <vs-th width="300"> Cantidad pendiente</vs-th>
                                            <vs-th width="300"> Cantidad a despachar</vs-th>
                                        </template>
                                        <template slot-scope="{ data }">
                                            <vs-tr v-for="(inputvs, k) in data" :key="k" :style="{ backgroundColor: inputvs.cantidad_pendiente != inputvs.despacho ? '#f7aca8' : '' }">
                                                <vs-td><br /><b>{{ k + 1 }}</b></vs-td>
                                                <vs-td><b> {{ inputvs.pro_codigo }} </b> {{ inputvs.pro_nombre }}</vs-td>
                                                <vs-td> {{ inputvs.det_ven_cantidad }}</vs-td>
                                                <vs-td> {{ inputvs.cantidad_pendiente }}</vs-td>
                                                <vs-td>
                                                    <vs-input class="w-full m-2" v-model="inputvs.despacho" @blur="bluer" @keypress="validateInput" @input="f_validateCantidadDespacharExcluidos(inputvs)" :min="0" :step="1" :max="inputvs.despacho" ty1pe="number" style="font-size: small;" :disabled="activa==false" />
                                                </vs-td>
                                            </vs-tr>
                                            <vs-tr>
                                                <vs-td colspan="2"> <b>TOTAL</b></vs-td>
                                                <vs-td> <b>{{ total=arrayLibros.reduce((prev, curr) => prev + parseInt(curr.det_ven_cantidad), 0) }}</b> </vs-td>
                                                <vs-td> <b>{{ totalPendientes=arrayLibros.reduce((prev, curr) => prev + parseInt(curr.cantidad_pendiente), 0) }}</b> </vs-td>
                                                <vs-td><b>{{ totales = arrayLibros.reduce((prev, curr) => prev + (isNaN(parseInt(curr.despacho)) ? 0 : parseInt(curr.despacho)), 0) }}</b></vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                                <br />
                                <div style="height: 30px;">
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="activa">
                                        <!-- <vs-button @click="guardar()" type="relief">Preparación</vs-button>&emsp; -->
                                        <!-- <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button> -->
                                    </vs-col>
                                </div>
                            </div>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
            <vs-divider></vs-divider>
            <div class="vx-row">
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <h6><b>Id Remision: </b> {{ObjectEmpacado.remision}}</h6>
                </div>
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <h6><b>Id Empacado: </b> {{ObjectEmpacado.ide}}</h6>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Fecha Empaque</small>
                    <flat-pickr :config="configdateTimePicker" v-model="fechaEmpaque" placeholder="Fecha Empaque" class="m-1" style="display: inline-block;width: 100%;" />
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                        <h5 style="text-align: center;"><b>Datos del Cliente.</b></h5><br />
                    </vs-col><br />
                    <div class="mt-1">
                        <h6><b>{{ObjectEmpacado.institucion}}</b></h6>
                    </div><br />
                    <div class="mt-1">
                        <h6><b>Nombre: </b>{{ObjectEmpacado.cliente}}</h6>
                    </div><br />
                    <div class="mt-1">
                        <h6><b>RUC: </b>{{ObjectEmpacado.ruc}}</h6>
                    </div><br />
                    <div class="mt-1">
                        <h6><b>Observación: </b>{{ObjectEmpacado.observa}}</h6>
                    </div>
                </div>
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6" style="position:relative;top:3px;">
                    <small>Empaques Sugeridos</small>
                    <div class="vx-row">
                        <div class="vx-col w-full sm:w-1/1 md:w-1/2 mb-3">
                            <v-select class="w-full" :options="arrayCarton" :reduce="(arrayCarton) => arrayCarton" density="comfortable" label="tip_empa_nombre" placeholder="--Seleccione--" v-model="tipoEmpaqueSelected" required />
                        </div>
                        <div class="vx-col w-full sm:w-1/1 md:w-1/4 mb-3">
                            <vs-input class="w-full" @input="validateValue" placeholder="Cantidad" :max="100" @keyup.enter="f_add()" v-model="empaquecant" />
                        </div>
                        <div class="vx-col w-full sm:w-1/1 md:w-1/4 mb-3">
                            <vs-button class="w-full" color="success" type="relief" icon="add" @click="f_add()">Añadir</vs-button>
                        </div>
                    </div>
                    <div class="caja1 vx-col w-full  mb-6">
                        <vs-table class="table users table-hover" :data="arrayEmpaquesSugeridos">
                            <template slot="thead">
                                <vs-th width="25"> # </vs-th>
                                <vs-th width="50"> código </vs-th>
                                <vs-th width="300"> Nombre </vs-th>
                                <vs-th width="100"> Cantidad </vs-th>
                                <vs-th width="100"></vs-th>
                            </template>
                            <template slot-scope="{ data }">
                                <vs-tr v-for="(input, index) in data" :key="index">
                                    <vs-td><br /><b>{{ index + 1 }}</b></vs-td>
                                    <vs-td>{{ input.id }}</vs-td>
                                    <vs-td>{{ input.nombre }}</vs-td>
                                    <vs-td>{{ input.cantidad }}</vs-td>
                                    <vs-button @click="removeItemFromArr(arrayEmpaquesSugeridos,input)" color="danger" type="relief" icon="delete"></vs-button>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div class="flex flex-wrap">
                        <div class="w-full sm:w-1/2 md:w-1/4 mb-3">
                            <div class="m-2" style="border-radius: 5px; text-align:center; background:#E6E6FA">
                                <small>Paquetes </small><br />
                                {{ObjectEmpacado.items}}
                            </div>
                        </div>
                        <div class="w-full sm:w-1/2 md:w-1/4 mb-3">
                            <div class="m-2" style="border-radius: 5px; text-align:center; background:#E6E6FA">
                                <small>Cajas Grandes</small><br />
                                {{ObjectEmpacado.cartones}}
                            </div>
                        </div>
                        <div class="w-full sm:w-1/2 md:w-1/4 mb-3">
                            <div class="m-2" style="border-radius: 5px; text-align:center; background:#E6E6FA">
                                <small>Cajas Pequeñas</small><br />
                                {{ ObjectEmpacado.rollo}}
                            </div>
                        </div>
                        <div class="w-full sm:w-1/2 md:w-1/4 mb-3">
                            <div class="m-2" style="border-radius: 5px; text-align:center; background:#E6E6FA">
                                <small>Sobres</small><br />
                                {{ObjectEmpacado.fundas}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <vs-divider>
                <p class="color2">Información de Despacho</p>
            </vs-divider>
            <div class="vx-row">
                <!--OBSERVACION-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Chofer responsable:</small>
                    <v-select :options="choferes" :reduce="(choferes) => choferes" density="comfortable" label="responsable" class="w-full" placeholder="--Seleccione--" v-model="ObjectEmpacado.chofer" required />
                </div>
                <!--RESPONSABLE-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Información:</small>
                    <div v-if="ObjectEmpacado.chofer">
                        <b>CI: </b> {{ ObjectEmpacado.chofer.cedula }}<br />
                        <b>Nombres: </b> {{ ObjectEmpacado.chofer.responsable }}
                    </div>
                </div>
            </div>
            <div class="vx-row">
                <!--DESTINO-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Destino:</small>
                    <vs-textarea v-model="ObjectEmpacado.destino" class="w-full" />
                </div>
                <!--OBSERVACION-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Observación:</small>
                    <vs-textarea v-model="ObjectEmpacado.observacion" class="w-full" />
                </div>
            </div>
            <div class="vx-row">
                <!--TRANSPORTE-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Transporte:</small>
                    <v-select :options="transporte" :reduce="(transporte) => transporte" density="comfortable" label="trans_nombre" class="w-full" placeholder="--Seleccione--" v-model="ObjectEmpacado.transporte" />
                </div>
                <!--TIPO FLETE con vs-radio-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                    <small>Tipo de Flete:</small>
                    <v-select :options="options2" :reduce="(options2) => options2" density="comfortable" label="value" class="w-full" placeholder="--Seleccione--" v-model="ObjectEmpacado.flete" required />
                </div>
            </div>
            <!--BUTONES ACCIONES-->
            <div class="flex justify-center">
                <vs-button @click="openConfirmGuardar()" class="mt-3" type="gradient"><i class="fa-solid fa-floppy-disk"></i> <span class="ml-3">Editar</span></vs-button>
            </div>
        </div>
        <br><br><br><br>
        <vs-popup v-if="activePrompt" :active.sync="activePrompt" class="popupHijo" title="Confirmacion Editado">
            <div>
                <p class="text-center">¿Está seguro de editar el empaque?</p>
                <div class="flex justify-center mt-5">
                    <vs-button @click="guardarEmpaque();activePrompt = false;" class="mr-5" color="success">Aceptar</vs-button>
                    <vs-button @click="activePrompt = false" color="danger">Cancelar</vs-button>
                </div>
            </div>
        </vs-popup>

    </div>
    </template>


    <script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import vSelect from 'vue-select'
    import moment from "moment";
    export default {
        components: {
            flatPickr,
            vSelect,
        },
        data() {
            return {
                op: '',
                usuario: [],
                arrayEmpaquesSugeridos: [],
                transporte: [],
                fechaEmpaque: null,
                configdateTimePicker: {
                    enableTime: true,
                    onChange: this.onDateChange,
                    dateFormat: 'Y-m-d H:i:S'
                },
                options1: [{
                        text: "LIBROS",
                        value: "LIBROS"
                    },
                    {
                        text: "OBSEQUIOS",
                        value: "OBSEQUIOS"
                    },
                    {
                        text: "OTROS",
                        value: "OTROS"
                    },
                ],
                options2: [{
                        id: 1,
                        value: "Al cobro"
                    },
                    {
                        id: 2,
                        value: "Pagado"
                    },
                    {
                        id: 3,
                        value: "Ninguno"
                    }
                ],
                arrayCarton: [],
                tipoEmpaqueSelected: '',
                empaquecant: '',
                arrayDocuments: [],
                arrayLibros: [],
                tmpArrayLibros: [],
                choferes: [],
                ObjectEmpacado: {
                    empresa: '',
                    remision: 0,
                    id: 0,
                    ide: '',
                    cartones: 0,
                    rollo: 0,
                    fundas: 0,
                    items: 0,
                    institucion: '',
                    cliente: '',
                    detalle: '',
                    ruc: '',
                    destino: '',
                    transporte: '',
                    flete: '',
                    observacion: '',
                    observa: '',
                    chofer: ''
                },
                total: 0,
                totales: 0,
                totalPendientes:0,
                popupAgregarDocumentos: false,
                popupActivoEditar: false,
                popupExcuir: false,
                activa: false,
                popupPdf: false,
                popupVer: false,
                activePrompt: false,
            }
        },
        props: {
            ObjectedDocument: {
                type: Object,
                default: {}
            },
            id: {
                type: String,
                default: ''
            }
        },
        created() {
            let me = this
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
            this.getTipoEmpaques()
        },
        watch: {
            arrayEmpaquesSugeridos: {
                handler(newValue, oldValue) {
                    if (newValue.length > 0) {
                        this.Calculos();
                    }
                },
                deep: true // Optional: Only necessary if arrayEmpaquesSugeridos is an object or array
            }
        },

        mounted() {
            let me = this
            me.op = this.opcion;
            console.log("objectDocumento",this.ObjectedDocument)
            let info = this.ObjectedDocument;
            me.getTransporte();
            me.getchoferes();
            setTimeout(function () {
                if (info) {
                    me.getEditar(info);
                    me.iniciar(info);
                    //si el documento esta excluido
                    if(me.ObjectedDocument.est_ven_codigo == 11){
                        me.activa =true
                    }else{
                        me.activa = false
                    }
                }
            }, 1000);

        },
        methods: {
            validateInput(event) {
                const charCode = event.which ? event.which : event.keyCode;
                if (charCode < 48 || charCode > 57) {
                    event.preventDefault();
                }
            },
            f_validateCantidadDespacharExcluidos(inputvs){
                let me = this
                if(inputvs.despacho > inputvs.cantidad_pendiente){
                    //color la misma cantidad_pendiente
                    inputvs.despacho = inputvs.cantidad_pendiente
                    me.$vs.notify({
                        text: 'No puedes despachar más que el número de documento',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
            },  
            bluer() {
                this.arrayLibros.forEach(producto => {
                    if (producto.despacho == 0 || producto.despacho == "" || producto.despacho == "undefined") {
                        producto.despacho = 0;
                    } else {
                        producto.despacho = producto.despacho;
                    }
                });
            },
            onDateChange(selectedDates, dateStr, instance) {
                instance.close();
            },
            getEmpaques(tr) {
                let me = this;
                me.$vs.loading();
                let url = "empaqueBodega?getDetalleEmpaque=1&empacado_rempacado_id=" + tr.id + '&id_empresa=' + tr.remi_idempresa;
                this.$http.get(this.$server_url + url)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.data.length == 0) {
                            me.$vs.notify({
                                text: 'No se puede editar el empacado',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            })
                        }
                        let dat = res.data;
                        this.arrayEmpaquesSugeridos = dat

                    })
                    .catch(err => {
                        console.log(err)
                        me.$vs.loading.close()
                    });

            },
            validateValue() {
                // Convierte el valor a un número y limita su rango
                const value = parseInt(this.empaquecant, 10);
                if (isNaN(value) || value > 100) {
                    this.empaquecant = '';
                } else {
                    this.empaquecant = value;
                }
            },
            iniciar(tr) {
                let me = this;
                me.$vs.loading();
                me.ObjectEmpacado.empresa           = tr.remi_idempresa;
                me.ObjectEmpacado.ide               = tr.remi_codigo;
                me.ObjectEmpacado.remision          = tr.remi_codigo;
                me.fechaEmpaque                     = tr.remi_fecha_inicio;
                me.ObjectEmpacado.observa           = tr.prof_observacion?tr.prof_observacion:tr.ven_observacion;
                me.ObjectEmpacado.id = tr.id
                me.getEmpaques(tr);
                setTimeout(function () {
                    me.ObjectEmpacado.chofer        = me.choferes.find(el => (el.cedula == tr.remi_ci_transportista));
                    me.ObjectEmpacado.transporte    = me.transporte.find(el => (el.trans_codigo == tr.trans_codigo));
                }, 2000);

                if (tr.remi_flete == 1 && tr.remi_pagado == 0) {
                    me.ObjectEmpacado.flete = me.options2.find(el => (el.id == 1))
                } else
                if (tr.remi_flete == 0 && tr.remi_pagado == 1) {
                    me.ObjectEmpacado.flete = me.options2.find(el => (el.id == 2))
                } else {
                    me.ObjectEmpacado.flete = me.options2.find(el => (el.id == 3))
                }
                me.ObjectEmpacado.institucion = tr.remi_destinatario;
                me.ObjectEmpacado.observacion = tr.remi_obs;
                me.ObjectEmpacado.cliente = tr.cliente;
                me.ObjectEmpacado.ruc = tr.ruc? tr.ruc : tr.ruc_cliente;
                me.ObjectEmpacado.destino = tr.remi_direccion;
                me.$vs.loading.close();
            },
            async getchoferes() {
                try {
                    const response = await this.$http.get(this.$server_url + "empaqueBodega?getchofer=1");
                    this.choferes = response.data;
                } catch (err) {
                    console.log(err);
                    throw err; // Propagate the error
                }
            },
            limpiarcampos() {
                const keys = Object.keys(this.ObjectEmpacado);

                // Iterar sobre cada clave y establecer su valor a una cadena vacía
                keys.forEach(key => {
                    this.ObjectEmpacado[key] = "";
                });
                this.getTransporte(); //lista los transportes
                this.getmotivo(); //lista los motivos
                this.fechaEmpaque = moment(); //fecha
                this.fechaEmpaque = this.fechaEmpaque.format('YYYY-MM-DD HH:mm:ss');
                this.arrayEmpaquesSugeridos = []; //vacia array de los empaques
                this.arrayLibros = [];
                this.tmpArrayLibros = [];
                this.activePrompt = false;

            },
            getEditar(tr) {
                let me = this;
                me.arrayLibros = [];
                me.tmpArrayLibros = [];
                var url = "";
                me.$vs.loading();
                url = "getDventas?id=" + tr.remi_num_factura+'&idemp='+tr.remi_idempresa;
                this.$http.get(this.$server_url + url)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.data.length == 0) {
                            me.$vs.notify({
                                text: 'No se puede editar el empacado',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            })
                        }
                        let d = res.data;
                        // this.arrayLibros = d.filter(el => el.det_ven_cantidad_despacho != 0)
                        this.tmpArrayLibros = res.data
                        this.arrayLibros = d.filter(el =>  el.despacho != 0)
                    })
                    .catch(err => {
                        console.log(err)
                        me.$vs.loading.close()
                    });
            },
           
            async getTransporte() {
                let me = this;
                me.transporte = [];
                await this.$http.get(this.$server_url + 'Get_Transporte')
                    .then(res => {
                        me.transporte = res.data;
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            Calculos() {
                this.ObjectEmpacado.fundas = 0;
                this.ObjectEmpacado.items = 0;
                this.ObjectEmpacado.cartones = 0;
                this.ObjectEmpacado.rollo = 0;
                this.arrayEmpaquesSugeridos.forEach(el => {
                    if (el.nombre == 'SOBRE') {
                        this.ObjectEmpacado.fundas += parseInt(el.cantidad);
                    } else if (el.nombre == 'PAQUETE') {
                        this.ObjectEmpacado.items += parseInt(el.cantidad);
                    } else if (el.nombre == 'Caja Pequeña') {
                        this.ObjectEmpacado.rollo += parseInt(el.cantidad);
                    } else {
                        this.ObjectEmpacado.cartones += parseInt(el.cantidad);
                    }
                });
            },
            f_add() {
                let me = this;
                if (me.tipoEmpaqueSelected && me.empaquecant) {
                    let Datos = '';
                    let em = '';
                    if (this.arrayEmpaquesSugeridos.length > 0) {
                        em = this.arrayEmpaquesSugeridos.find(emp => emp.nombre === me.tipoEmpaqueSelected.tip_empa_nombre);
                    }
                    if (em) {
                        this.arrayEmpaquesSugeridos.forEach(el => {
                            if (el.nombre === me.tipoEmpaqueSelected.tip_empa_nombre) {
                                el.cantidad = parseInt(me.empaquecant);
                            }
                        });
                        me.tipoEmpaqueSelected = '';
                        me.empaquecant = '';
                    } else {
                        Datos = {
                            id: me.tipoEmpaqueSelected.tip_empa_codigo,
                            nombre: me.tipoEmpaqueSelected.tip_empa_nombre,
                            cantidad: me.empaquecant,
                        };
                        this.arrayEmpaquesSugeridos.push(Datos);
                        me.tipoEmpaqueSelected = '';
                        me.empaquecant = '';
                    }
                    me.tipoEmpaqueSelected = '';
                    me.empaquecant = '';
                } else {
                    me.$vs.notify({
                        text: 'No se ha seleccionado ningún empaque o no ingreso la cantidad de empaques.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                me.tipoEmpaqueSelected = '';
                me.empaquecant = '';
            },
            getTipoEmpaques() {
                let me = this
                me.$http.get(me.$server_url + `empaqueBodega?getTipoEmpaques=1`).then(function (res) {
                    let da = res.data;
                    me.arrayCarton = da.filter(el => el.tip_empa_estado != 0);
                })
            },
            openConfirmGuardar() {
                let me = this
                if (me.arrayEmpaquesSugeridos.length == 0) {
                    me.$vs.notify({
                        text: 'Debe agregar al menos una Nota/factura/acta',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                if (me.fechaEmpaque == null || me.fechaEmpaque == "" || me.fechaEmpaque == undefined) {
                    me.$vs.notify({
                        text: 'La fecha de empaque no puede quedar vacia',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                me.activePrompt= true;
            },
            guardarEmpaque() {
                let me = this
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                let iniusuario = usuarioObjeto.iniciales;
                let idusuarioresp = usuarioObjeto.idusuario;
                // let responsable = usuarioObjeto.nombres + ' ' + usuarioObjeto.apellidos;
                let estado;
                let dat = '';
                me.tmpArrayLibros.forEach(ele => {
                    dat = dat + ele.pro_codigo + ',';
                });

                let empaques = parseInt(me.ObjectEmpacado.cartones) + parseInt(me.ObjectEmpacado.items) + parseInt(me.ObjectEmpacado.fundas) + parseInt(me.ObjectEmpacado.rollo)
                let fle, pag;
                if (this.ObjectEmpacado.flete.id == 1) {
                    fle = 1;
                    pag = 0;
                } else if (this.ObjectEmpacado.flete.id == 2) {
                    fle = 0;
                    pag = 1;
                } else {
                    fle = 0;
                    pag = 0;
                }
                //estado 10 => empacado; 11 => excluir
                if (this.totalPendientes == this.totales) {
                    estado = 10;
                } else {
                    estado = 11;
                }
                let formData = new FormData()
                formData.append('EditEmpaque', '1')
                ///VARIABLES DE DESPACHO
                formData.append('id',                       me.ObjectEmpacado.id)
                formData.append('arrayLibros',              JSON.stringify(me.arrayLibros))
                formData.append("ven_codigo",               me.ObjectedDocument.remi_num_factura);
                formData.append("id_empresa",               me.ObjectedDocument.remi_idempresa);
                //FIN VARIABLES DE DESPACHO
                formData.append('id_emp',                   me.ObjectEmpacado.ide)
                formData.append('libros',                   dat)
                formData.append('usu_codigo',               iniusuario)
                formData.append('user_created',             idusuarioresp)
                formData.append('remi_direccion',           me.ObjectEmpacado.destino)
                formData.append('remi_nombre_transportista', me.ObjectEmpacado.chofer.responsable)
                formData.append('remi_ci_transportista',    me.ObjectEmpacado.chofer.cedula)
                formData.append('trans_codigo',             me.ObjectEmpacado.transporte.trans_codigo)
                formData.append('remi_obs',                 me.ObjectEmpacado.observacion?me.ObjectEmpacado.observacion:'')
                formData.append('remi_carton',              me.ObjectEmpacado.cartones)
                formData.append('remi_paquete',             me.ObjectEmpacado.items)
                formData.append('remi_funda',               me.ObjectEmpacado.fundas)
                formData.append('remi_rollo',               me.ObjectEmpacado.rollo)
                formData.append('remi_flete',               fle)
                formData.append('remi_pagado',              pag)
                formData.append('arrayEmpaquesSugeridos',   JSON.stringify(me.arrayEmpaquesSugeridos))
                formData.append('estado', estado)
                me.$vs.loading()
                this.$http.post(this.$server_url + 'empaqueBodega', formData)
                    .then(res => {
                        if (res.data.status == 0) {
                            me.$vs.loading.close();
                            me.activePrompt = false;
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                        }
                        me.$vs.loading.close();
                        me.activePrompt = false;
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('cerrar', true)
                        me.activePrompt = false
                    })
                    .catch((e) => {
                        me.$vs.loading.close();
                        me.activePrompt = false;
                        me.$vs.notify({
                            text: 'No se pudo empacar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
            },
            //quitar objecto de array
            removeItemFromArr(arr, item) {
                const i = arr.indexOf(item)
                arr.splice(i, 1)
                this.Calculos();
            },
        }
    }
    </script>


    <style scoped>
    .color3 {
        color: #2364B4;
        transition: 2 ease-in-out;
        font-weight: 600;
        font-size: 18px;
    }

    .color2 {
        color: #2364B4;
        transition: 2 ease-in-out;
        font-weight: 400;
    }

    /*estilos tabla de documentos*/
    /*border al tr de la tabla*/
    .tabla {
        border-collapse: collapse;
        width: 100%;
        margin-top: 20px;
        font-size: 12px;
    }

    .tr {
        border-bottom: 1px solid #ddd;
        font-size: 12px;
        /*filtrar con background saltando una fila */

    }

    .caja1 {
        /*estilos heigth maximo de 500px y un scrool cuando crezca*/
        max-height: 300px;
        overflow-y: auto;
    }

    .skip-row:nth-child(even) {
        background-color: #f2f2f2;
        /* Cambiar color de fondo */
        color: #333;
        /* Cambiar color de texto */
    }

    /*fin estilos tabla de documentos*/

    .popophijo {
        z-index: 510010;
        /* Valor mayor que el del popup del padre */
        position: fixed;
        /* Asegúrate de que la posición sea adecuada */
    }
    </style>
