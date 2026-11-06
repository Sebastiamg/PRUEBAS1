<template>
    <div fixed-height="true">
        <br>
        <div>
            <p class="color3">Crear Empaque</p>
            <div>
                <p class="mt-2">
                    <b>Nota.</b> La cantidad de despachado se guardará lo real sin afectar devoluciones
                </p>
            </div>
            <vs-divider></vs-divider>
            <!--MOSTRAR INFORMACION PARA PREPARAR-->
            <div class="vx-row">
                <vs-collapse class="w-full m-2" style="border-radius: 5px; border:1px solid grey">
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
                                        <div class="flex" v-if="arrayLibros.length>1&&op==0">
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
                                            <vs-th width="300"> Cantidad despachar</vs-th>
                                        </template>
                                        <template slot-scope="{ data }">
                                            <vs-tr v-for="(inputvs, k) in data" :key="k">
                                                <vs-td><br /><b>{{ k + 1 }}</b></vs-td>
                                                <vs-td>{{ inputvs.pro_codigo }} {{ inputvs.pro_nombre }}</vs-td>
                                                <vs-td> {{ inputvs.det_ven_cantidad }}</vs-td>
                                                <vs-td>
                                                    <vs-input class="w-full m-2" v-model="inputvs.despacho" @input="f_validateCantidadDespacharExcluidos(inputvs)" @keypress="validateInput" :max="inputvs.det_ven_cantidad" :ref="'inputvs_' + k" style="font-size: small;" :disabled="activa==false" @blur="bluer" />
                                                </vs-td>
                                            </vs-tr>
                                            <vs-tr>
                                                <vs-td colspan="2"> <b>TOTAL</b></vs-td>
                                                <vs-td> <b>{{ total=arrayLibros.reduce((prev, curr) => prev + parseInt(curr.det_ven_cantidad), 0) }}</b> </vs-td>
                                                <vs-td><b>{{ totales=arrayLibros.reduce((prev, curr) => prev + parseInt(curr.despacho), 0) }}</b> </vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                                <br />
                                <!--despachado y excluido pueden guardar-->
                                <!-- <vs-col v-if="ObjectedDocument.est_ven_codigo == 1 || ObjectedDocument.est_ven_codigo == 10" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                                    <vs-button @click="guardar()" type="relief">Preparacion</vs-button>&emsp;
                                </vs-col> -->
                            </div>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
            <!--MOSTRAR INFORMACION PARA PREPARAR-->
            <vs-divider></vs-divider>

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
                <!--EMPAQUES SUGERIDOS-->
                <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6" style="position:relative;top:3px;">
                    <small>Empaques Sugeridos</small>
                    <div class="vx-row">
                        <div class="vx-col w-full sm:w-1/1 md:w-1/2 mb-3">
                            <v-select class="w-full" :options="arrayCarton" :reduce="(arrayCarton) => arrayCarton" density="comfortable" label="tip_empa_nombre" placeholder="--Seleccione--" v-model="tipoEmpaqueSelected" required />
                        </div>
                        <div class="vx-col w-full sm:w-1/1 md:w-1/4 mb-3">
                            <vs-input class="w-full" @input="validateValue" @keypress="validateInput" placeholder="Cantidad" :max="100" @keyup.enter="f_add()" v-model="empaquecant" />
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
                <!--EMPAQUES SUGERIDOS-->
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
                <vs-button @click="openConfirmGuardar()" class="mt-3" type="gradient"><i class="fa-solid fa-floppy-disk"></i> <span class="ml-3">Guardar</span></vs-button>
            </div>
        </div>
        <br><br><br><br>
    </div>
    </template>

    <script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import vSelect from 'vue-select'
    import moment from "moment";
    import {
    mapState
    } from "vuex";
    const ScreenExcluirVue = () => import('./ScreenExcluir.vue');
    
    export default {
        components: {
            flatPickr,
            vSelect,
            ScreenExcluirVue,
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
                arrayLibros: [],
                choferes: [],
                motivo: [],
                ObjectEmpacado: {
                    empresa: '',
                    id: 0,
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
                tabVentas: {
                    ven_codigo: '',
                    empresa: '',
                },
                total: 0,
                totales: 0,
                popupActivoEditar: false,
                popupExcuir: false,
                activa: false,
                popupPdf: false,
                popupVer: false,
            }
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario',  'userAsesor', 'groupFacturador']),
        },
        props: {
            //opcion 0 por defecto ; 1 = excluir
            opcion: {
                type: Number,
                default: 0
            },
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
            me.fechaEmpaque = moment();
            me.fechaEmpaque = me.fechaEmpaque.format('YYYY-MM-DD HH:mm:ss');
            let info = this.ObjectedDocument;
            if (info) {
                me.getEditar(info);
                me.iniciar(info);
            }

        },
        methods: {
            iniciar(tr) {
                let me = this;
                me.ObjectEmpacado.empresa   = tr.id_empresa;
                me.ObjectEmpacado.observa   = tr.prof_observacion?tr.prof_observacion:tr.ven_observacion;
                me.getTransporte();
                me.getchoferes();
                me.ObjectEmpacado.institucion = tr.nombreInstitucion;
                me.ObjectEmpacado.cliente    = tr.cliente;
                me.ObjectEmpacado.ruc        = tr.ruc_cliente;
                me.ObjectEmpacado.destino    = tr.direccionInstitucion;
            }, 
            f_validateCantidadDespacharExcluidos(inputvs){
                let me = this
                if(inputvs.despacho > inputvs.det_ven_cantidad){
                    //color la misma det_ven_cantidad
                    inputvs.despacho = inputvs.det_ven_cantidad
                    me.$vs.notify({
                        text: 'No puedes despachar más que el número de documento',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
            },  
            getEditar(tr) {
                this.activa == false;
                let me = this;
                me.arrayLibros = [];
                var url = "";
                me.$vs.loading();
                url = "getDventas?id=" + tr.ven_codigo+'&idemp='+tr.id_empresa;
                this.$http.get(this.$server_url + url)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.data.length == 0) {
                            me.$vs.notify({
                                text: 'No hay actas/notas/facturas pendientes por despachar',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            })
                        }
                        //0 = por defecto ; 1 = excluir
                        if (this.op == 0) {
                            this.arrayLibros = res.data;
                        } else if (this.op == 1) {
                            let d = res.data;
                            this.arrayLibros = d.filter(el => !el.det_ven_cantidad_despacho)
                        }

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
            validateInput(event) {
                const charCode = event.which ? event.which : event.keyCode;
                if (charCode < 48 || charCode > 57) {
                    event.preventDefault();
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
                this.ObjectEmpacado.id = 0;
                this.getTransporte(); //lista los transportes
                this.getmotivo(); //lista los motivos
                this.fechaEmpaque = moment(); //fecha
                this.fechaEmpaque = this.fechaEmpaque.format('YYYY-MM-DD HH:mm:ss');
                this.arrayEmpaquesSugeridos = []; //vacia array de los empaques
                this.arrayLibros = [];
            },
 
           
            getmotivo() {
                let me = this;
                me.motivo = [];
                me.$vs.loading();

                this.$http
                    .get(this.$server_url + "GetMotivo")
                    .then((res) => {
                        me.motivo = res.data;
                        me.$vs.loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
            },
           
            getTransporte() {
                let me = this;
                me.transporte = [];
                this.$http.get(this.$server_url + 'Get_Transporte')
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
                console.log("tipoEmpaqueSelected", this.tipoEmpaqueSelected);
                console.log("empaquecant", this.empaquecant);
                console.log("arrayEmpaquesSugeridos", this.arrayEmpaquesSugeridos);
                let me = this;
                if (me.tipoEmpaqueSelected && me.empaquecant) {
                    let Datos = '';
                    let em = '';
                    //llenar los empaques sugeridos
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
            async openConfirmGuardar() {
                let me = this
                if (me.arrayEmpaquesSugeridos.length == 0) {
                    me.$vs.notify({
                        text: 'Debe agregar al menos un empaque para poder guardar el empaque',
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
                //validar que tenga iniciales el usuario
                if(me.usuario.iniciales == null || me.usuario.iniciales == "" || me.usuario.iniciales == undefined){
                    me.$vs.notify({
                        text: 'Debe ingresar no tiene iniciales',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return
                }
                me.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: 'Guardar Empaque',
                    text: '¿Está seguro de guardar el empaque?',
                    acceptText: 'Aceptar',
                    accept: me.guardarEmpaque,
                    cancel: false
                })
            },
            guardarEmpaque() {
                let me = this
                let iniusuario      = me.usuario.iniciales
                let idusuarioresp   = me.usuario.idusuario;
                let responsable     = me.usuario.nombres + ' ' + me.usuario.apellidos;
                let estado;
                let dat = ''
                me.arrayLibros.forEach(ele => {
                    dat += ele.pro_codigo + ',';
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
                
                this.ObjectEmpacado.id = 1;
                //estado despacho => 10 => empacado; estado 11 => excluir ; 12 = preparado
                if (this.total == this.totales) {
                    estado = 10;
                } else {
                    estado = 11;
                }
                let formData = new FormData()
                formData.append('saveEmpaque',              '1')
                ///VARIABLES DE DESPACHO
                formData.append('arrayLibros',              JSON.stringify(me.arrayLibros))
                formData.append("ven_codigo",               me.ObjectedDocument.ven_codigo);
                formData.append("id_empresa",               me.ObjectedDocument.id_empresa);
                //FIN VARIABLES DE DESPACHO
                formData.append('id',                       me.ObjectEmpacado.id)
                formData.append('libros',                   dat)
                formData.append('usu_codigo',               iniusuario)
                formData.append('user_created',             idusuarioresp)
                formData.append('remi_motivo', 1)
                formData.append('remi_dir_partida',         'Av. La Prensa N58-154 y Cristóbal Vaca de Castro')
                formData.append('remi_destinatario',        me.ObjectEmpacado.institucion + ' ' + me.ObjectEmpacado.cliente)
                formData.append('remi_ruc_destinatario',    me.ObjectEmpacado.ruc)
                formData.append('remi_direccion',           me.ObjectEmpacado.destino)
                formData.append('remi_nombre_transportista', me.ObjectEmpacado.chofer.responsable)
                formData.append('remi_ci_transportista',    me.ObjectEmpacado.chofer.cedula)
                formData.append('remi_detalle', 'LIBROS')
                formData.append('remi_fecha_inicio',        me.fechaEmpaque)
                formData.append('trans_codigo',             me.ObjectEmpacado.transporte.trans_codigo)
                formData.append('remi_obs',                 me.ObjectEmpacado.observacion)
                formData.append('remi_responsable',         responsable)
                formData.append('remi_carton',              me.ObjectEmpacado.cartones)
                formData.append('remi_paquete',             me.ObjectEmpacado.items)
                formData.append('remi_funda',               me.ObjectEmpacado.fundas)
                formData.append('remi_rollo',               me.ObjectEmpacado.rollo)
                formData.append('remi_flete',               fle)
                formData.append('remi_pagado',              pag)
                formData.append('arrayEmpaquesSugeridos',   JSON.stringify(me.arrayEmpaquesSugeridos))
                formData.append('estado',                   estado)
                me.$vs.loading()
                this.$http.post(this.$server_url + 'empaqueBodega', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.status === 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                        }
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.limpiarcampos();
                        this.$emit('changen', true)
                    })
                    .catch((e) => {
                        me.$vs.loading.close()
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

    <style>
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
    </style>
