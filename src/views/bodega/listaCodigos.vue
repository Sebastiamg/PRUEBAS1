<template>
<div>
    <vx-card>
        <vs-input ref="ingreso" size="large" autofocus class="m-3 mb-5 w-full" label-placeholder="código" v-model="txt_ingreso" @change="f_ingresar" @key.enter="f_ingresar" /> <br>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="4">

                <vs-input class="m-3 w-full" label-placeholder="longitud del codigo" v-model="longitud" />
            </vs-col>

            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
                <vs-input size="large" class="m-3" style="width: 60%;" id="detalle" label-placeholder="detalle del grupo de codigos" v-model="txt_observacion" />
                <vs-button color="warning" v-if="ifInsititucion == false" @click="popupInstitucion = true" icon="search" type="filled" class="ml-4">Seleccionar Institución</vs-button>
                <vs-button color="danger" v-if="ifInsititucion == true" @click="ifInsititucion = false;limpiar()" icon="search" type="filled" class="ml-4">Quitar Institución</vs-button>
            </vs-col>

        </vs-row>
        <br />

        <div style="display:flex;">
            <vs-button color="primary" icon="clock" type="border" class="ml-4 mt-3" @click="f_get_codigos()">Actualizar</vs-button>
            <vs-button color="primary" icon="filter" type="filled" @click="popupBusqueda = true" class="ml-4 mt-3">Filtrar Escuelas</vs-button>
            <vs-button color="success" type="filled" icon="code" @click="popupIndividual = true" class="ml-4 mt-3">Busqueda Individual</vs-button>
        </div>

        <!-- {{ codigosEscuelas }} -->

        <vs-list v-if="desglose == true" class="mt-5">
            <vs-list-header :title="'Desglose de codigos de ' + txt_observacion ">

            </vs-list-header>
            <div>
                <vs-button size="small" icon="cancel" color="danger" type="border" @click="desglose = false" class="ml-4 mt-3">Ocultar</vs-button>
            </div>
            <vs-row>
                <vs-col :data="tr" :key="indextr" v-for="(tr, indextr) in codigosEscuelas" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                    <vs-list-item>{{indextr}}: {{tr}}</vs-list-item>
                </vs-col>
            </vs-row>

        </vs-list>

        <center class="">
            <h3 class="text-warning">{{m_mensaje}}</h3>
        </center>

        <vs-row class="mt-5">
              <vs-divider color="primary">ultimos codigos</vs-divider>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8">
                <vs-collapse style="width: 100%;">
                    <vs-collapse-item>
                        <div slot="header">
                            Códigos Ingresados
                        </div>

                        <vs-table pagination max-items="1000" search :data="todoCodigos" style="width: 100%;">
                            <template slot="header">
                                <div class="vx-row">
                                    <div class="vx-col w-full">
                                        Cantidad: {{todoCodigos.length}}
                                    </div>
                                    <div class="vx-col w-full">
                                        <small>se listan maximo 5000</small>
                                    </div>
                                </div>
                            </template>
                            <template slot="thead">
                                <vs-th>Codigo</vs-th>
                                <vs-th>Observacion</vs-th>
                                <vs-th>eliminar</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{ data[indextr].codigo}}
                                        <vs-chip color="danger" v-if="tr.repetido > 2">
                                            Repetido
                                        </vs-chip>
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].observacion}}<br/>
                                        {{ tr.fecha_create }}
                                    </vs-td>
                                    <vs-td>
                                        <vs-button style="display: inline-block;" class="m-2 mb-2" radius icon-pack="feather" icon="icon-trash" color="danger" type="line" @click="openConfirm(tr)"></vs-button>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-collapse-item>
                </vs-collapse>
            </vs-col>

            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="3" class="ml-5">
                <vs-card>
                    <vs-row v-if="codigosDuplicados == true">
                        <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="12">

                            <vs-list>
                                <vs-list-header icon="supervisor_account" title="Ultimo codigo repetido"></vs-list-header>
                                <vs-list-item icon="check" :title="codigos">
                                    <vs-chip color="primary">Total Duplicados {{repetidas}}</vs-chip>
                                </vs-list-item>

                            </vs-list>
                        </vs-col>

                    </vs-row>
                </vs-card>
            </vs-col>

            <vs-card>
                <vs-row v-if="codigosDuplicados == true">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">

                        <vs-list>
                            <vs-list-header icon="supervisor_account" title="Códigos ya existentes"></vs-list-header>
                            <vs-list-item :key="indextr" v-for="(tr, indextr) in arrayCodigosDuplicados" icon="check" :title="tr.codigo">
                                <vs-chip color="danger">Total Duplicados {{tr.repetidas}}</vs-chip>
                            </vs-list-item>

                        </vs-list>
                    </vs-col>

                </vs-row>
            </vs-card>

        </vs-row>

    </vx-card>

    <vs-popup class="holamundo" title="Longitud maxima" :active.sync="popupActivo">
        <p>
            Codigo supera la longitud
        </p>
    </vs-popup>

    <vs-popup class="holamundo" title="Existe codigos duplicados" :active.sync="popupDuplicados">
        <p>
            Existe codigos duplicados
        </p>
    </vs-popup>

    <vs-popup class="holamundo" title="Filtro de busqueda de escuela" :active.sync="popupBusqueda">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-input label="Busqueda" class="w-full" placeholder="Busqueda" v-model="busqueda" />
            </vs-col>
        </vs-row>

        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button color="success" type="filled" @click="filtrarBusqueda()">Filtrar Escuelas</vs-button>
            </vs-col>
        </vs-row>

        <vs-row v-if="filtroBusqueda.length > 0">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-table pagination max-items="10" search :data="filtroBusqueda" style="width: 100%;">

                    <template slot="thead">
                        <vs-th>Colegio</vs-th>
                        <vs-th>Acciones</vs-th>

                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                {{ data[indextr].observacion}}

                            </vs-td>
                            <vs-td>
                                <vs-button color="primary" @click="txt_observacion = tr.observacion; popupBusqueda = false;getCodigosEscuela();" type="filled">Seleccionar</vs-button>
                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>

    </vs-popup>

    <!--MODAL PARA AGREGAR  INSTITUCION-->

    <vs-popup background-color="rgba(255,255,255,.6)" title="Seleccionar Institución" :active.sync="popupInstitucion">

        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null ">
                    Sin Institución
                </p>
                <vs-chip color="success" v-else>
                    Institución {{ nombreInstitucion}}
                </vs-chip>
            </vs-col>
        </vs-row>

        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">

                <vs-button size="small" class="ml-3" @click="popupAddNuevaInstitucion = true;popupInstitucion = false;" type="relief">Añadir nueva institución</vs-button>
            </vs-col>

        </vs-row>

        <div style="width:100%;display:flex;" class="mt-5">
            <div style="width:90%;">
                <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
            </div>

            <div style="width:10%;margin-left:15px;">
                <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            </div>
        </div>

        <div v-if="instituciones.length >0">
            <vs-table stripe max-items="5" search pagination :data="instituciones">
                <template slot="header">
                    <div class="vx-row">
                        <div class="vx-col w-full m-3">
                            Cantidad: {{instituciones.length}}
                        </div>

                    </div>
                </template>
                <template slot="thead">
                    <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                    <vs-th sort-key="nombre">Localidad</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                        <vs-td :data="data[indextr].nombreInstitucion">
                            {{data[indextr].nombreInstitucion}}<br>

                        </vs-td>
                        <vs-td :data="data[indextr].nombreregion">
                            {{data[indextr].nombreregion}} <br>
                            <small>{{data[indextr].ciudad}}</small>
                        </vs-td>
                        <vs-td>
                            <div class="flex">
                                <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr);error=false">
                                    Asignar
                                </vs-button>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vs-popup>

    <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->

    <vs-popup background-color="rgba(255,255,255,.6)" title="Agregar Nueva Institución" :active.sync="popupAddNuevaInstitucion">
        <vs-button size="small" color="success" radius="" @click="popupAddNuevaInstitucion=false;popupInstitucion = true;" icon="reply" type="gradient"></vs-button>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <div class="vx-col w-full mt-5">

                    Seleccione una ciudad:
                    <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                </div>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-input label="Escriba un nombre para la institución" class="w-full" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
            </vs-col>
        </vs-row>

        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <ul class="leftx" style="display:flex;flex-direction: row;">

                    <li class="ml-2">
                        <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li class="ml-2">
                        <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="2">Costa</vs-radio>
                    </li>

                </ul>
            </vs-col>
        </vs-row>
        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button @click="agregarInstitucionTemporal();error = false" type="gradient">Agregar Institución</vs-button>
            </vs-col>
        </vs-row>
    </vs-popup>
    <!--MODAL PARA BUSQUEDA Invidual-->
     <vs-popup class="holamundo"  title="Buscar informacion del codigo" :active.sync="popupIndividual">
      <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-input label="Ingrese el codigo a buscar" class="w-full"  placeholder="Codigo" v-model="busquedaIndividual" />
            </vs-col>
        </vs-row>
        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button color="success" type="filled" @click="busquedaCodigoIndividual()">Buscar</vs-button>
            </vs-col>
        </vs-row>
        <div v-if="arregloBusquedaIndividual.length >0">
            <vs-table stripe max-items="5" search pagination :data="arregloBusquedaIndividual">
                <template slot="header">
                    <p>Cantidad: <span style="font-weight: bold;">{{arregloBusquedaIndividual.length}}</span></p>
                </template>
                <template slot="thead">
                    <vs-th sort-key="nombreInstitucion">Escuela</vs-th>
                    <vs-th sort-key="nombre">Codigo</vs-th>
                    <vs-th>Fecha Create</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{tr.observacion}}<br>
                            <small v-if="tr.libro_idlibro > 0">
                                  <vs-chip color="warning">Codigo original</vs-chip>  
                            </small>
                        </vs-td>
                        <vs-td>
                            {{ tr.codigo }}
                        </vs-td>
                        <vs-td>
                            <vs-chip color="success">{{tr.fecha_create}}</vs-chip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vs-popup>
</div>
</template>
<script>
import $ from 'jquery'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            busquedaIndividual:'',
            ifInsititucion: false,
            error: false,
            desglose: false,
            popupActivo: false,
            popupIndividual:false,
            institucion_id: '',
            counterDanger: false,
            arregloCiudad: [],
            instituciones: [],
            popupInstitucion: false,
            nombreInstitucion: '',
            popupAddNuevaInstitucion: false,
            temporalInstitucion: {
                ciudad: '',
                nombreInstitucion: '',
                region: '2',
            },
            institucion_id_temporal: '',
            estado_institucion_temporal: 2,
            periodo_id_temporal: 0,
            nombreInstitucionTemporal: '',
            busquedaInstitucion: '',
            longitud: '0',
            txt_ingreso: '',
            txt_observacion: '',
            todoCodigos: '',
            m_mensaje: '',
            codigos: '',
            repetidas: '',
            codigosDuplicados: false,
            arrayCodigosDuplicados: [],
            id: '',
            codigo: '',
            popupDuplicados: false,
            codigosEscuelas: [],
            usuario: [],
            popupBusqueda: false,
            filtroBusqueda: [],
            arregloBusquedaIndividual:[],
            busqueda: '',
        }
    },
    mounted() {
        let me = this;
        this.focusInput();
        // me.f_get_codigos();
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.listaCiudades()
    },
    methods: {
        //busqueda individual de codigo
        busquedaCodigoIndividual() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'bodega?individual=yes&codigo='+me.busquedaIndividual)
            .then(res => {
                    me.$vs.loading.close()
                    me.arregloBusquedaIndividual = res.data;
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error)
                })
        },

        limpiar() {
            let me = this;
            me.txt_observacion = "";
            me.institucion_id = "";
            me.institucion_temporal_id = ""
            me.nombreInstitucion = "";
            me.estado_institucion_temporal = "2"
            $("#detalle").prop('disabled', false);
        },
        asginarInstitucion(tr) {
            let me = this;
            me.institucion_id = tr.idInstitucion
            me.nombreInstitucion = tr.nombreInstitucion
            me.txt_observacion = me.nombreInstitucion
            me.estado_institucion_temporal = 0;
            me.ifInsititucion = true
            me.instituciones = []
            $("#detalle").prop('disabled', true);
        },
        //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + `ciudad`).then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },

        getInstitucion() {
            let me = this;
            me.instituciones = [];
            if (me.busquedaInstitucion.length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }

            me.$vs.loading()
            this.$http.get(this.$server_url + 'listaInsitucion?busqueda=' + me.busquedaInstitucion)
                .then(function (res) {
                    // me.tmpInstituciones = res.data;
                    me.instituciones = res.data;
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user',
                            time: 8000
                        })
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        agregarInstitucionTemporal() {

            let me = this;
            if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una institución por favor'
                })
                return false;
            }

            let formData = new FormData();
            formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
            formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
            formData.append('region', me.temporalInstitucion.region);
            formData.append('asesor_id', me.usuario.idusuario);

            me.$vs.loading()
            this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.popupAddNuevaInstitucion = false;
                    me.popupInstitucion = true
                    me.nombreInstitucion = me.temporalInstitucion.nombre_institucion
                    me.txt_observacion = me.nombreInstitucion
                    me.institucion_id_temporal = res.data.institucion_temporal_id
                    me.instituciones = []
                    me.periodo_id_temporal = res.data.periodo_id
                    me.estado_institucion_temporal = 1;
                    me.ifInsititucion = true
                    $("#detalle").prop('disabled', true);
                    me.$vs.notify({
                        text: "Se guardo correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },

        //para obtener el filtro de busqueda
        filtrarBusqueda() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'bodegaFiltro?busqueda=' + me.busqueda)
                .then(function (res) {
                    me.filtroBusqueda = res.data
                    me.popupBusqueda = true
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        //para obtener el listado de las areas
        getCodigosEscuela() {
            let me = this;
            if (me.busqueda == "") {
                me.$vs.notify({
                    text: 'ingrese un detalle para esta busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                })
                return;
            }
            me.$vs.loading();
            this.$http.get(this.$server_url + 'desgloseCodigo?escuela=' + me.txt_observacion)
                .then(function (res) {
                    let codigos = res.data
                    let extraida = []
                    let resultado = codigos.reduce((acumulador, obj) => {
                        let key = obj.codigo
                        // console.log(key)
                        //  console.log(key,'rr',key.indexOf('-')) 
                        extraida.push(
                            key.substring(0, key.indexOf('-'))
                        );
                        if (!acumulador[key]) {
                            acumulador[key] = []
                        }
                        acumulador[key].push(obj)
                        return acumulador;
                    }, {});
                    var repetidos = {};
                    extraida.forEach(function (numero) {
                        repetidos[numero] = (repetidos[numero] || 0) + 1;
                    });
                    console.log(repetidos);
                    me.codigosEscuelas = repetidos
                    me.desglose = true
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        focusInput() {
            this.$refs.ingreso.$el.focus()
        },
        buscarEscuela() {
            let me = this;
        },
        f_ingresar() {
            let me = this;
            me.codigos = "";
            me.repetidas = "";
            if (me.txt_observacion == "") {
                me.$vs.notify({
                    text: 'ingrese un detalle para este grupo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                })
                return;
            }
            if (me.txt_ingreso.length > me.longitud) {
                me.popupActivo = true
                return;
            }
            let formData = new FormData();
            formData.append('codigo', me.txt_ingreso);
            formData.append('observacion', me.txt_observacion);
            formData.append('usuario', me.usuario.idusuario);
            formData.append('institucion_id', me.institucion_id);
            formData.append('institucion_id_temporal', me.institucion_id_temporal);
            formData.append('estado_institucion_temporal', me.estado_institucion_temporal);
            formData.append('periodo_id_temporal', me.periodo_id_temporal);
            formData.append('nombreInstitucion', me.nombreInstitucion);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'add_codigo', formData)
                .then(function (res) {
                    if (res.data.codigosRepetidos.length == 0) {
                    } else {
                        me.popupDuplicados = true
                        me.codigosDuplicados = true
                        me.codigos = res.data.codigosRepetidos.codigos
                        me.repetidas = res.data.codigosRepetidos.repetidas
                        me.arrayCodigosDuplicados.push({
                            "codigo": res.data.codigosRepetidos.codigos,
                            "repetidas": res.data.codigosRepetidos.repetidas
                        })
                    }
                  
                    me.$vs.loading.close()
                    me.txt_ingreso = ""
                    me.f_get_codigos();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        f_get_codigos() {
            let me = this;
            // me.$vs.loading()
            me.m_mensaje = 'cargando lista....';
            this.$http.get(this.$server_url + 'get_codigo')
                .then(function (res) {
                    // console.log(res.data)
                    me.todoCodigos = res.data;
                    me.m_mensaje = '';
                    me.txt_ingreso = ''
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },

        openConfirm(item) {
            let me = this;
            me.id = item.id
            me.codigo = item.codigo
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'ESTA SEGURO DE ELIMINAR_.',
                accept: this.f_eliminar
            })
        },
        f_eliminar(item) {
            let me = this;
            // console.log(item)
            // return
            me.$vs.loading()
            let formData = new FormData();
            formData.append('id', me.id);
            formData.append('codigo', me.codigo);
            formData.append('observacion', me.txt_observacion);
            this.$http.post(this.$server_url + 'elimina_codigo', formData)
                .then(function (res) {
                    console.log(res.data)
                    // me.todoCodigos= res.data;
                    me.f_get_codigos();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
    },
}
</script>
