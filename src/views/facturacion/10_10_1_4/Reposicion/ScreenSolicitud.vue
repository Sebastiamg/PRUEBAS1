<template>
<vx-card :title="`Información # ${agrupadoCod}`">

    <div class="vx-row">
        <!-- <pre>{{inputs.length}} {{con}}</pre> -->
        <vs-col vs-type="flex" vs-w="12" class="mt-2 m-3">
            <vs-button type="border" color="success" v-if="btnGenerarProforma" class="mr-2" @click="accionProforma = 0, getnuevo()">Generar
                Nueva Solicitud</vs-button>
        </vs-col>
        <vs-table max-items="10" pagination :data="Proformas">
            <template slot="header">
                <vs-col vs-type="flex" vs-w="auto" class="mt-2 m-3">
                    <vs-chip class="mr-2" color="primary">Cantidad: <b>{{ Proformas.length }} </b></vs-chip>
                    <vs-button type="border" style="border-radius: 40%;" color="primary" class="mr-2" @click="getproforma();comprobar();" icon="refresh" />
                </vs-col>
            </template>
            <vs-th width="100"> Id </vs-th>
            <vs-th width="200"> Cantidad de ítems</vs-th>
            <vs-th width="500"> Cantidad de libros</vs-th>
            <vs-th width="500"> Empresa</vs-th>
            <vs-th width="200"> Estado</vs-th>
            <vs-th width="200"> Editador por:</vs-th>
            <vs-th width="200" v-if="Proformas.length!=contador"> Acciones </vs-th>

            <vs-tr v-for="(tr, indextr) in Proformas" :key="indextr">
                <vs-td>
                    {{ tr.prof_id? tr.prof_id: tr.id}}
                </vs-td>
                <vs-td> {{ tr.total_items }} <br /> </vs-td>
                <vs-td> {{ tr.total_libros }} <br /> </vs-td>
                <vs-td> {{ tr.nombre }} <br /> </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.prof_estado == 0" color="Red">Anulado</vs-chip>
                    <vs-chip v-if="tr.prof_estado == 1" color="DarkOrange">Pendiente</vs-chip>
                    <vs-chip v-if="tr.prof_estado == 3" color="SlateBlue">Aprobado</vs-chip>
                    <vs-chip v-if="tr.prof_estado == 6" color="#e34b19">Aprobado con pendiente</vs-chip>
                    <vs-chip v-if="tr.prof_estado == 4" color="#AD4497">Preaprobado</vs-chip>
                    <vs-chip v-if="tr.prof_estado == 5" color="#AD4497">Aceptado</vs-chip>
                    <vs-chip v-if="tr.prof_estado == 2" color="MediumSeaGreen">Finalizado</vs-chip>
                </vs-td>
                <vs-td>
                    <small color="black"> <b v-if="tr.prof_estado == 1&&tr.username"> Editado por: </b>{{tr.username}} {{tr.lastname}}</small>
                </vs-td>
                <vs-td>
                    <vs-dropdown vs-custom-content vs-trigger-click>
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 320px;" class="cursor">
                            <vs-dropdown-item v-if="tr.prof_estado == 4">
                                <vs-button color="#AD4497" type="line" class="w-full" @click=" popup_ap(tr)">Aceptar </vs-button>
                            </vs-dropdown-item>
                            <vs-dropdown-item v-if="tr.prof_estado != 0 && tr.prof_estado != 2&&tr.prof_estado !=3 &&tr.prof_estado != 4 &&tr.prof_estado != 5">
                                <vs-button color="DodgerBlue" type="line" class="w-full" @click="accionProforma = 1, ObjectEdit = tr; geteditar(tr)">Editar</vs-button>
                            </vs-dropdown-item>
                            <!-- <vs-dropdown-item v-if="tr.prof_estado != 0 && tr.prof_estado != 2 && tr.prof_estado != 3">
                                    <vs-button color="Coral" type="line" class="w-full" @click="datosAnular=tr;popup_p(datosAnular)">Anular</vs-button>
                                </vs-dropdown-item> -->
                            <!-- <vs-dropdown-item v-if="tr.prof_estado != 0 && tr.prof_estado != 2 && tr.prof_estado != 3 && !tr.prof_id ">
                                <vs-button color="Coral" type="line" class="w-full" @click="datosAnular=tr;popup_p(datosAnular)">Anular Solicitud</vs-button>
                            </vs-dropdown-item> -->
                            <vs-dropdown-item>
                                <vs-button color="Coral" type="line" class="w-full" @click="ObjectEdit = tr;getdetalles(tr)">Ver</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </vs-table>
    </div>
    <!--Anular Revision-->
    <vs-popup class="desactivar" :title="`Anulación`" :active.sync="popupActivoDesactivar">
        <p>
            ¿Confirma que desea anular el registro #: {{ datosAnular.id }} de la proforma?
        </p>
        <!-- {{ datosAnular }} -->
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="anular(); popupActivoDesactivar = false" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="popupActivoDesactivar = false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup fullscreen :title="`Solicitud `" :active.sync="popupproforma" class="popopPadre">
        <div v-if="popupproforma">
            <VistaVue :listaEmpresas="listaEmpresas" :setPuntos="setPuntos" :options="options" :option="option" :input="inputs" :sendPedido="sendPedido" @change="changeClose" :accionProforma="accionProforma" :id1="agrupadoCod" :tip="tip" :idperiodo="idperiodo" />
        </div>
    </vs-popup>
    <!-- preaprobacion de laa solicitudes -->
    <vs-popup class="aprobar" title="Confirmación" :active.sync="popupaprobar">
        <p>
            ¿Confirma que desea preaprobar el registro: {{ proforma.id }} para la venta?
        </p>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="preaprobar(); popupaprobar = false" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="popupaprobar = false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!--POPUP generacion de documentos excel o pdf-->
    <vs-popup fullscreen :title="`Detalles solicitud N°  ${proforma.id}`" :active.sync="popupDetalle">
        <div v-if="popupDetalle">
            <detalle :edit="edit" :proforma="proforma" />
        </div>
    </vs-popup>
    <!--Edicion de proforma-->
    <vs-popup fullscreen :title="`solicitud N°  ${proforma.id}`" :active.sync="popupproformaedit" class="popopPadre">
        <div v-if="popupproformaedit">
            <VistaVue :listaEmpresas="listaEmpresas" :setPuntos="setPuntos" :options="options" :option="option" :inputs2="edit" :sendPedido="sendPedido" :id="proforma.id" @change="changeClose" :accionProforma="accionProforma" :ObjectEdit="ObjectEdit" :editan="editan" :id1="agrupadoCod" :tip="tip" :idperiodo="idperiodo" />
        </div>
    </vs-popup>
</vx-card>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
const VistaVue = () => import("@/views/pedidos2/pedidos/proforma/VistaProformaSolicitud.vue");
const detalle = () => import("./Detalles.vue");
export default {
    components: {
        flatPickr,
        'v-select': vSelect,
        VistaVue,
        detalle,
    },
    data: () => ({
        usuario:[],
        datosAnular: [],
        agrupadoCod: '',
        idperiodo: '',
        solicitud: '',
        con: '',
        contador: '',
        tip: '',
        id: '',
        inputs: [],
        stoc: [],
        input: [],
        pro: [],
        puntos: [],
        detalle: [],
        sucursal: [],
        user: "",
        cont: 0,
        hijo: 0,
        tipod: 0,
        tipoc: 0,
        tipoi: '',
        tipoE: 'L',
        informacion: '',
        usuario: [],
        inpu: [],
        Eselect: '',
        listaEmpresas: [],
        Proforma: [],
        Proformas: [],
        ventas: [],

        proforma: {
            id: "",
            temporada: "",
            empresa: "",
            fecha: "",
            cliente: "",
            observacion: "",
            activa: '',
            tipo: '',
            tipos: "",
            estado: "",
            des: "",
            dec: "",
            iva: "",
            user: '',
            descuento: '',
            transporte: '',
            total: "",
            sub: '',
            tot: '',
            descu: '',
            subtotal: '',
        },
        sendPedido: {
            id: '',
        },
        datosa: [],
        datosaa: [],
        detas: [],
        edit: [],
        edita: [],
        editan: [],
        instit: [],
        options: [],
        idusuarioresp: "",
        option: [],
        tipo: [],
        tipos: [],
        popupproformaedit: false,
        popupDetalle: false,
        popupaprobar: false,
        popupActivoDesactivar: false,
        popupproforma: false,
        popupfactura: false,
        popupeditar: false,
        popupsucursal: false,
        popupcarga: false,
        btnGenerarProforma: false,
        accionProforma: 0,
        setMenu: '',
        ObjectEdit: "",
        setPuntos: '',
        listaEmpresas: '',
        mixinIdInicioFormatoNewData: null,
    }),
    watch: {
        Proformas(results) {
            let me = this
            if (results.length > 0) {
                let datos = results.filter(p => p.prof_estado != 2 && p.prof_estado != 0)
                if (datos.length > 0) {
                    me.btnGenerarProforma = false
                } else {
                    me.btnGenerarProforma = true
                }
            } else {
                if (results.length > 1) {
                    me.btnGenerarProforma = true
                }
            }
        }
    },
    created(){
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        this.setMenu = 3;
        // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
        if (mixinData) {
            // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
            const parsedData = JSON.parse(mixinData);
            me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
            console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
        console.log('data info', this.info);
        this.agrupadoCod = this.info.ca_codigo_agrupado;
        this.idperiodo = this.info.id_periodo;
        this.getproforma();
        this.getconsulta();
        this.comprobar();

    },
    props: {
        info: {
            type: [Array, Object],
            default: () => []
        },
    },

    methods: {

        startLoading() {
            this.popupcarga = true;
        },
        changeHandle(e) {
            let me = this;
            me.popupcarga = false;
        },
        resetd() {
            //this.informacion = '';
        },
        changeClose() {
            let me = this;
            if (me.accionProforma == 0) {
                me.popupproforma = false;
                me.getproforma();
            }
            if (me.accionProforma == 1) {
                me.popupproformaedit = false;
                me.getproforma();
            }
        },
        getEmpresas() {
            let me = this;
            me.listaEmpresas = [];
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data;
                    me.listaEmpresas = me.listaEmpresas.filter(empresa => empresa.id !== 2);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        async getinfopedidoDespacho() {
            let me = this;
            let nuevarutaxperiodo = '';
            if (me.idperiodo <= me.mixinIdInicioFormatoNewData) {
                nuevarutaxperiodo = `pedidosDespacho?id_despacho=${me.agrupadoCod}&id_periodo=${me.idperiodo}`;
            } else if (me.idperiodo > me.mixinIdInicioFormatoNewData) {
                nuevarutaxperiodo = `pedidosDespacho_new?id_despacho=${me.agrupadoCod}&id_periodo=${me.idperiodo}`;
            }
            me.$vs.loading();
            await this.$http.get(this.$server_url + nuevarutaxperiodo)
                .then(res => {
                    this.inputs = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                });
        },
        async getinfopedido() {
            await this.$http.get(this.$server_url + 'get_val_pedidoInfoTodoSuma/' + this.agrupadoCod)
                .then(res => {
                    this.inputs = res.data;
                })
                .catch(err => {
                    console.log(err)
                });
        },
        changeClosePdf(e) {
            ;
            this.hijo = 0;
        },
        mostrarFechayhora: function () {
            const date = new Date();
            const formatear =
                date.getFullYear() +
                "-" +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + date.getDate()).slice(-2) +
                " " +
                ("0" + date.getHours()).slice(-2) +
                ":" +
                ("0" + date.getMinutes()).slice(-2) +
                ":" +
                ("0" + date.getSeconds()).slice(-2);

            return formatear;
        },
        async popup_p(tr) {
            this.edit = [];
            this.popupActivoDesactivar = true;
            this.proforma.id = tr.prof_id;
            this.proforma.estado = tr.prof_estado;
            await this.datos(tr.id);
        },
        anular() {
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let idusuario = usuarioObjeto.idusuario;
            let formData = new FormData();
            let me = this;

            let valornuevo = this.proforma.estado;
            if (valornuevo !== 0 && me.edit.length > 0) {
                valornuevo = 0;
                formData.append("dat", JSON.stringify(me.edit));
                formData.append("id", this.datosAnular.id);
                formData.append("prof_estado", valornuevo);
                formData.append("id_usua", idusuario);
                formData.append("tipo", 'anular');
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "DesactivarProforma", formData)
                    .then((res) => {
                        me.$vs.loading.close();
                        this.getproforma();
                        if (res.status === 200) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (res.status === 500) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        this.popupActivoEditar = false;
                    })
                    .catch((error) => {
                        console.log(error);
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo anular",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            }

        },
        //se consulta para obtener datos si existe al menos una factura ya despachada
        async getconsulta() {
            let tipo;
            tipo = 1
            try {
                const response = await this.$http.get(this.$server_url + "Get_DatoSolicitud?prof_id=" + this.agrupadoCod + "&tipo=" + tipo);
                this.solicitud = response.data;
                this.con = this.solicitud[0].con;
                console.log(this.solicitud);
            } catch (err) {
                console.log(err);
                throw err; // Propagate the error
            }
        },
        getproforma() {
            let me = this;
            me.contador = 0;
            let b, busq;
            b = 1;
            busq = me.agrupadoCod;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + `GetProformasSolicitud?prof_id=${busq}&tipo=${b}&usuario=${this.usuario.idusuario}`)
                .then((res) => {
                    this.Proformas = res.data;

                    if (this.Proformas.length == 0) {
                        me.$vs.notify({
                            text: "No existen proformas registradas",
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.$vs.loading.close();
                    } else {
                        me.Proformas.forEach(p => {
                            if (p.prof_estado === 0 || p.prof_estado === 2) {
                                me.contador++;
                            }
                        });
                        // console.log(me.Proformas.length);
                        // console.log(me.contador);
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    me.$vs.loading.close();
                });

        },
        async venta(tipo) {
            let buscar = '';
            if (tipo == 0) {
                buscar = this.agrupadoCod;
            }
            if (tipo == 1) {
                buscar = this.agrupadoCod;
            }
            await this.$http
                .get(this.$server_url + "GetVentas?pedido_id=" + buscar + "&tipo=" + tipo)
                .then((res) => {
                    this.ventas = res.data;
                    this.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
        async comprobar() {
            this.inputs = [];
            this.ventas = [];
            this.tip = 1;
            await this.venta(1);
            await this.getinfopedidoDespacho();

            if (this.inputs.length !== 0 && this.ventas.length !== 0) {
                let inputsToRemove = []; // Almacena los índices de los elementos a eliminar de this.inputs
                let ventasToRemove = []; // Almacena los índices de los elementos a eliminar de this.ventas

                this.inputs.forEach((input, i) => {
                    input.despacho = 0;
                    let shouldRemoveInput = false; // Variable para verificar si se debe eliminar el input

                    this.ventas.forEach((venta, j) => {
                        if (input.codigo_liquidacion === venta.pro_codigo) {
                            if (input.valor > venta.cantidad) {
                                input.despacho = venta.cantidad;
                            } else {
                                shouldRemoveInput = true; // No se debe eliminar el input
                                ventasToRemove.push(j); // Agrega el índice de la venta a eliminar
                            }
                        }
                    });

                    if (shouldRemoveInput) {
                        inputsToRemove.push(i); // Agrega el índice del input a eliminar
                    }
                });

                // Elimina los elementos de los arrays this.inputs y this.ventas
                inputsToRemove.reverse().forEach(index => {
                    this.inputs.splice(index, 1);
                });

                ventasToRemove.reverse().forEach(index => {
                    this.ventas.splice(index, 1);
                });
            }
            // Si this.ventas está vacío pero this.inputs tiene elementos
            if ((this.inputs.length !== 0 || this.inputs.length !== undefined) && this.ventas.length === 0) {

                // Itera sobre los elementos de this.inputs
                this.inputs.forEach(input => {
                    // Establece despacho en 0
                    input.despacho = 0;
                });
            }
            if (this.inputs.length == 0) {

            }
        },
        async getnuevo() {
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);

            let iniusuario = usuarioObjeto.iniciales;
            if ((iniusuario == null || iniusuario == undefined || iniusuario == "") && usuarioObjeto.id_group == 1 || usuarioObjeto.id_group == 22 || usuarioObjeto.id_group == 23) {
                alert('Las iniciales del Usuario facturador son nulas y es necesario que no lo sean. Le pedimos que se ponga en contacto con nuestro equipo de soporte para recibir asistencia. ¡Gracias!');

            } else {
                this.getEmpresas();
                this.$vs.loading();
                await this.comprobar();
                if (this.inputs.length >= 0) {
                    this.inputs.forEach(p => {
                        p.cantidad = ''
                    });
                    this.stoc = this.inputs;
                    this.popupproforma = true;
                    //this.getco(); // Llamar a la función para obtener el código de proforma
                    // this.proforma.fecha = this.mostrarFechayhora();
                    this.$vs.loading.close();
                } else {
                    this.$vs.loading.close();
                    this.notificacionError();
                }
            }

        },
        getco() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let iniusuario = usuarioObjeto.iniciales
            me.idusuarioresp = usuarioObjeto.idusuario;
            me.user = usuarioObjeto.nombres + " " + usuarioObjeto.apellidos;
            let c, d;
            this.$http
                .get(this.$server_url + "Get_Cod_Pro")
                .then((response) => {
                    const ne = response.data;
                    c = ne[0];
                    d = ne[1];
                    me.proforma.id = c + "-" + iniusuario + "-" + d;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        notificacionError() {
            let me = this
            me.$vs.notify({
                text: 'No se pueden generar nuevas proformas, ya que todas las cantidades de los ítems del pedido han sido facturadas.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            })

        },
        async getinfopedido() {
            let me = this;
            await this.$http.get(this.$server_url + 'get_val_pedidoInfoTodoSuma/' + me.agrupadoCod)
                .then(res => {
                    this.inputs = res.data;
                })
                .catch(err => {
                    console.log(err)
                });
        },
        async datos(a) {
            await this.$http.get(this.$server_url + 'Get_DatosFactura?prof_id=' + a + '&empresa=' + this.ObjectEdit.emp_id)
                .then(res => {
                    this.edit = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        data(a) {
            this.$http.get(this.$server_url + 'Get_DatosFactura?prof_id=' + a + '&empresa=' + this.ObjectEdit.emp_id)
                .then(res => {
                    this.editan = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        async getdetalles(tr) {
            this.$vs.loading();
            this.inputs = [];
            this.edit = [];
            let me = this;
            me.proforma = tr;
            await this.venta(1);
            await this.getinfopedidoDespacho();
            await this.datos(tr.id);
            // await this.getmin();
            if (me.inputs.length != 0 && me.edit.length != 0) {
                for (let i = 0; i < me.edit.length; i++) {
                    // Recorrer el segundo array
                    for (let j = 0; j < me.inputs.length; j++) {
                        if (me.edit[i].pro_codigo == me.inputs[j].codigo_liquidacion) {
                            me.edit[i].valor = me.inputs[j].valor;
                            me.edit[i].stock = me.inputs[j].stock;
                        }
                    }
                }
                if (me.edit.length != 0 && me.ventas.length != 0) {
                    for (let i = 0; i < me.edit.length; i++) {
                        for (let j = 0; j < me.ventas.length; j++) {
                            if (me.edit[i].pro_codigo == me.ventas[j].pro_codigo) {
                                if (me.edit[i].valor >= me.ventas[j].cantidad) {
                                    me.edit[i].despacho = me.ventas[j].cantidad;
                                }
                            }
                        }
                    }
                }
                if (this.edit.length != 0 && this.ventas.length == 0) {
                    for (let i = 0; i < this.edit.length; i++) {
                        this.edit[i].despacho = 0;
                    }
                }
                this.edit.forEach(p => {
                    p.cantidad = p.det_prof_cantidad
                });
                this.edit = this.edit.filter(p => p.cantidad > 0);
                me.$vs.loading.close();
                me.popupDetalle = true;
            }

        },
        async geteditar(tr) {
            this.$vs.loading();
            this.inputs = [];
            this.edit = [];
            this.editan = [];
            let me = this;
            me.accionProforma = 1;
            me.proforma.id = tr.id;
            this.tip = 1;
            await this.venta(1);
            await this.getinfopedidoDespacho();
            await this.datos(tr.id);
            this.data(tr.id);
            // await this.getmin();
            if (me.inputs.length != 0 && me.edit.length != 0) {
                for (let i = 0; i < me.edit.length; i++) {
                    // Recorrer el segundo array
                    for (let j = 0; j < me.inputs.length; j++) {
                        if (me.edit[i].pro_codigo == me.inputs[j].codigo_liquidacion) {
                            me.edit[i].valor = me.inputs[j].valor;
                            me.edit[i].stock = me.inputs[j].stock;
                        }
                    }
                }
                if (me.edit.length != 0 && me.ventas.length != 0) {
                    for (let i = 0; i < me.edit.length; i++) {
                        for (let j = 0; j < me.ventas.length; j++) {
                            if (me.edit[i].pro_codigo == me.ventas[j].pro_codigo) {
                                if (me.edit[i].valor > me.ventas[j].cantidad) {
                                    me.edit[i].despacho = me.ventas[j].cantidad;
                                }
                            }
                        }
                    }
                }
                if (this.edit.length != 0 && this.ventas.length == 0) {
                    for (let i = 0; i < this.edit.length; i++) {
                        this.edit[i].despacho = 0;
                    }
                }
                this.edit.forEach(p => {
                    p.cantidad = p.det_prof_cantidad
                });
                me.$vs.loading.close();
                me.popupproformaedit = true;
            }

        },
        async popup_ap(tr) {
            this.proforma.id = tr.id;
            this.proforma.estado = tr.prof_estado;
            this.$vs.loading();
            setTimeout(() => {
                this.popupaprobar = true;
                this.$vs.loading.close();
            }, 500);
        },
        preaprobar() {
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let idusuario = usuarioObjeto.idusuario;
            let me = this;
            let formData = new FormData();
            let valornuevo = this.proforma.estado;
            if (valornuevo !== 5) {
                valornuevo = 5;
                formData.append("id", this.proforma.id);
                formData.append("prof_estado", valornuevo);
                formData.append("id_usua", idusuario);
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "AceptarSolicitudProforma", formData)
                    .then((res) => {
                        me.$vs.loading.close();
                        this.getproforma();
                        if (res.status === 200) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }
                        if (res.status === 500) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo aprobar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            }
        },

    },
}
</script>

<style>
.popopPadre {
    z-index: 51002;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}
</style>
