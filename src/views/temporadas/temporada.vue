<template>
<div>
    <div v-if="verLiquidacion == false">
        <vs-card>
            <div class="card-title">Filtro de Busquedas</div>
            <div class="flex mb-4 mt-4" style="flex-wrap:wrap;">
                <div class="w-1/5 p-2 bg-gray-400 text-center">
                    <ul class="leftx ml-3" style="display:flex;flex-direction: row;">       
                        <li class="ml-2">
                        <vs-radio v-model="region2"  vs-name="rdxRegion" @input="getPeriodos2()" vs-value="1">Sierra</vs-radio>
                        </li>
                        <li class="ml-2">
                        <vs-radio v-model="region2" vs-name="rdxRegion" @input="getPeriodos2()" vs-value="2">Costa</vs-radio>
                        </li>               
                    </ul>
                </div>
                <div class="w-4/5 p-2 bg-gray-500 text-center periodo" style="display:flex;flex-wrap:wrap;">
                    <div style="width:30%">
                        Seleccione el periodo
                    </div>
                    <v-select @input="tipo=1;list();" style="width:70%;margin-left: 0px;" :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodo"  v-model="periodo" />
                </div>
            </div>
            <vs-divider></vs-divider>
            <div class="flex mb-4">
                <div class="w-1/4 p-2 bg-gray-400 text-center">Filtro por contrato</div>
                <div class="w-3/4 p-2 bg-gray-500 text-center flex">
                    <vs-input class="inputx w-full" @keyup.enter="tipo=2;filtroContrato();" placeholder="Ingrese el contrato" v-model="contrato"/>
                    <vs-button icon="search" class="ml-2" @click="tipo=2;filtroContrato();" type="relief"></vs-button>
                </div>
            </div>
        </vs-card>
        <vx-card>
            <!--Modal para agregar  Temporada-->
            <div class="centerx">
                <vs-button @click="update = false;openModal();getPeriodos();limpiar();" color="primary" type="filled">+ Temporada</vs-button>
                <vs-popup classContent="popup-example" title="Agregar Temporadas" :active.sync="popupActivo4">
                    <div class="vx-col w-full mt-5">
                        Ciudad:
                        <v-select @input="filtrarInstituciones()" :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="ciudadSelect" />
                    </div>
                    <div class="vx-col w-full mt-5">
                        Institucion:
                        <v-select @input="filtrarProfesores()" :options="arregloTraeInstitucion" :reduce="arregloTraeInstitucion => arregloTraeInstitucion" label="nombreInstitucion" class="w-full" v-model="temporada.institucion" />
                    </div>
                    <vs-row class="mt-3">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                            <ul class="leftx" style="display:flex;flex-direction: row;">    
                                <li class="ml-2">
                                <vs-radio v-model="region" vs-name="regionAdd" @input="getPeriodos()" vs-value="1">Sierra</vs-radio>
                                </li>
                                <li class="ml-2">
                                <vs-radio v-model="region" vs-name="regionAdd" @input="getPeriodos()" vs-value="2">Costa</vs-radio>
                                </li>               
                            </ul>
                        </vs-col>
                    </vs-row>
                    <div class="vx-col w-full mt-5">
                        Seleccione el periodo:
                        <v-select @input="verificarContratoPeriodo()" :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodo" class="w-full" v-model="temporada.periodo" />
                    </div>
                    <div v-if="bloquear == false">
                        <div class="vx-col w-full mt-5">
                            Profesor:(Busque por su cedula)
                            <v-select :options="arregloTraeProfesor" :reduce="arregloTraeProfesor => arregloTraeProfesor" label="cedula" class="w-full" v-model="temporada.profesor" />
                            <br>
                            <div style="display:flex;">
                                <div>
                                    <p>Si el docente no existe </p>
                                </div>
                                <vs-button @click="popupActivo4=false;popupActivo3=true;" style="margin-left: 5px;" size="small" color="success" type="filled">+ Docente</vs-button>
                            </div>
                        </div>
                        <!-- {{ temporada.asesor  }} -->
                        <div class="vx-col w-full mt-5">
                            Asesor:
                            <v-select :options="arregloAsesores" :reduce="arregloAsesores => arregloAsesores" label="asesornombres" class="w-full" v-model="temporada.asesor" />
                        </div>
                        <div class="vx-col w-full mt-5">
                            <label>Contrato</label>
                            <vs-input class="inputx w-full" name="contrato" placeholder="Contrato" v-model="temporada.contrato" />
                        </div>
                        <div class="vx-col w-full mt-5">
                            <label>Año</label>
                            <vs-input class="inputx w-full" name="year" placeholder="Año" v-model="temporada.year" />
                        </div>
                        <div class="vx-col w-full mt-5">
                            <label>temporada</label>
                            <vs-input class="inputx w-full" name="temporada" placeholder="temporada" v-model="temporada.temporada" />
                        </div>
                        <br>
                        <vs-button @click="agregarTemporada();" color="primary" type="filled">Guardar Cambios</vs-button>
                    </div>
                </vs-popup>
            </div>
            <!--- MODAL PARA Actualizar -->
            <div class="centerx">
                <!--Contenido del boton editar para actualizar la  temporada-->
                <div>
                    <vs-popup classContent="popup-example" :title="titleModal" fullscreen :active.sync="popupActivo2">
                        <div class="vx-col w-full mt-5">
                            <p style="color:red"> (Ciudad temporal {{ temporada.ciudad }} )</p>
                            Ciudad:
                            <v-select @input="filtrarInstituciones()" :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="ciudadSelect" />
                        </div>
                        <div class="vx-col w-full mt-5">
                            <p style="color:red"> (Institucion temporal {{ temporada.instituciontemporal }} )</p>
                            Institucion:
                            <v-select @input="filtrarProfesores()" :options="arregloTraeInstitucion" :reduce="arregloTraeInstitucion => arregloTraeInstitucion" label="nombreInstitucion" class="w-full" v-model="temporada.institucion" />
                        </div>
                        <vs-row class="mt-3">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                <ul class="leftx" style="display:flex;flex-direction: row;">       
                                    <li class="ml-2">
                                    <vs-radio v-model="region" vs-name="radiosRegionEdit" @input="getPeriodos()" vs-value="1">Sierra</vs-radio>
                                    </li>
                                    <li class="ml-2">
                                    <vs-radio v-model="region" vs-name="radiosRegionEdit" @input="getPeriodos()" vs-value="2">Costa</vs-radio>
                                    </li>               
                                </ul>
                            </vs-col>
                        </vs-row>
                        <div class="vx-col w-full mt-5">
                             Seleccione el periodo:
                            <v-select @input="verificarContratoPeriodo()" :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodo" class="w-full" v-model="temporada.periodo" />
                        </div>
                        <div v-if="bloquear == false"> 
                            <!-- {{ temporada.asesor  }} -->
                            <div class="vx-col w-full mt-5">
                                <p style="color:red"> (Nombre temporal {{ temporada.nombresasesortemporal }} )</p>
                                Asesor:
                                <v-select :options="arregloAsesores" :reduce="arregloAsesores => arregloAsesores" label="asesornombres" class="w-full" v-model="temporada.asesor" />
                            </div>
                            <br>
                            <div class="vx-col w-full mt-5">
                                <p style="color:red"> (Docente temporal {{ temporada.temporal_nombre_docente }} )</p>
                                <br>
                                <p style="color:red"> (Cedula temporal {{ temporada.cedulaprofesortemporal }} )</p>
                                Profesor:(Busque por su cedula)
                                <v-select :options="arregloTraeProfesor" :reduce="arregloTraeProfesor => arregloTraeProfesor" label="cedula" class="w-full" v-model="temporada.profesor" />
                                <br>
                                <div style="display:flex;">
                                    <div>
                                        <p>Si el docente no existe </p>
                                    </div>
                                    <vs-button @click="popupActivo2=false;popupActivo3=true;" style="margin-left: 5px;" size="small" color="success" type="filled">+ Docente</vs-button>
                                </div>
                            </div>
                            <br>
                            <br>
                            <vs-row>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                                    <vs-button @click="agregar();" color="primary" type="filled">Guardar Cambios</vs-button>
                                </vs-col>
                            </vs-row>
                        </div>
                        <div v-if="codigos.length > 0">
                            <vs-table max-items="10" search pagination :data="codigos">
                                <template slot="header">
                                    <p>Cantidad {{ codigos.length }}  </p>
                                    <p> Codigos que tiene contrato</p>   
                                </template>
                                <template slot="thead">     
                                    <vs-th>codigo</vs-th>
                                    <vs-th>idusuario</vs-th>
                                    <vs-th>libro</vs-th>
                                    <vs-th>Periodo</vs-th>
                                    <vs-th>Contrato</vs-th>
                                </template>
                                <template slot-scope="{data}">
                                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                        <vs-td>
                                            {{data[indextr].codigo}}<br>
                                        </vs-td>
                                        <vs-td>
                                            {{data[indextr].idusuario}}<br>
                                        </vs-td>
                                        <vs-td>
                                            {{ tr.libro }}
                                        </vs-td>
                                        <vs-td>
                                            {{ tr.id_periodo }}
                                        </vs-td>
                                        <vs-td>
                                            {{ tr.contrato }}
                                        </vs-td>   
                                    </vs-tr>
                                </template>
                            </vs-table>  
                        </div>    
                    </vs-popup>
                </div>
                <!--Modal para editar el asesor-->   
                <div>
                    <vs-popup classContent="popup-example" title="Editar asesor" :active.sync="popupEditarAsesor">
                        <div class="vx-col w-full mt-5">   
                            Asesor:
                            <v-select :options="arregloAsesores" :reduce="arregloAsesores => arregloAsesores" label="asesornombres" class="w-full" v-model="temporada.asesor" />
                        </div>
                        <br>
                        <div style="width:100%;display:flex;justify-content:center;">
                            <div>
                                <vs-button @click="actualizarAsesor();" color="primary" type="filled">Actualizar Asesor</vs-button>
                            </div>      
                        </div>
                    </vs-popup>
                </div>
            </div>
            <!--Contenido del boton agregar un docente-->
            <div class="centerx">
                <vs-popup classContent="popup-example" title="Agregar Nuevo Docente" :active.sync="popupActivo3">
                    <div class="vx-col w-full mt-5">
                        <label>Cedula</label>
                        <vs-input class="inputx w-full" name="cedula" placeholder="cedula" v-model="docente.cedula" />
                    </div>
                    <div class="vx-col w-full mt-5">
                        <label>Nombres</label>
                        <vs-input class="inputx w-full" name="nombres" placeholder="Nombres" v-model="docente.nombres" />
                    </div>
                    <div class="vx-col w-full mt-5">
                        <label>Apellidos</label>
                        <vs-input class="inputx w-full" name="apellidos" placeholder="Apellidos" v-model="docente.apellidos" />
                    </div>
                    <div class="vx-col w-full mt-5">
                        <label>Email</label>
                        <vs-input class="inputx w-full" name="email" placeholder="Email" v-model="docente.email" />
                    </div>
                    <div class="vx-col w-full mt-5">
                        <label>Usuario</label>
                        <vs-input class="inputx w-full" name="name_usuario" placeholder="Usuario" v-model="docente.name_usuario" />
                    </div>
                    <div class="vx-col w-full mt-5">
                        Institucion:
                        <v-select :options="arregloInstitucion" :reduce="arregloInstitucion => arregloInstitucion" label="nombreInstitucion" class="w-full" v-model="docente.institucion_idInstitucion" />
                    </div>
                    <br>
                    <vs-button @click="agregarDocente();" color="primary" type="filled">Guardar Cambios</vs-button>
                </vs-popup>
            </div>
            <!--FIN DEL CONTENIDO POPUP PARA AGREGAR UN DOCENTE -->
            <!-- LISTADO DE LA TABLA TEMPORADAS-->
            <div>
                <vs-table max-items="10" search pagination :data="arregloTemporada">
                    <template slot="header">
                        <p>
                        Cantidad:  <span style="font-weight:bold;">{{ arregloTemporada.length }}</span>
                        </p>
                    </template>
                    <template slot="thead">
                        <vs-th>
                            Contrato
                        </vs-th>
                        <vs-th>
                            Datos Temporales
                        </vs-th>
                        <vs-th>
                            Datos asignados
                        </vs-th>
                        <vs-th>
                            Acciones
                        </vs-th>
                        <vs-th>
                            Liquidación
                        </vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td style="width:20%">
                                {{data[indextr].contrato}}<br>
                                <p>{{data[indextr].ciudad}} - {{data[indextr].year}}</p>   
                            </vs-td>
                            <vs-td style="width:25%">
                                <p style="font-weight:bold;">Institucion:</p>
                                <span>{{ data[indextr].temporal_institucion }}</span><br/>
                                <p style="font-weight:bold;">Docente:</p>
                                <span>{{ data[indextr].temporal_nombre_docente }}</span><br/>
                                <p style="font-weight:bold;">Cedula docente:</p>
                                <span>{{ data[indextr].temporal_cedula_docente }}</span><br/>
                                <p style="font-weight:bold;">Asesor:</p>
                                <span>{{ data[indextr].nombre_asesor }}</span><br/>
                            </vs-td>
                            <vs-td  style="width:25%">
                                <p style="font-weight:bold;">Institucion:</p>
                                <span>{{ data[indextr].nombreInstitucion }}</span><br/>
                                <p style="font-weight:bold;">Ciudad:</p>
                                <span>{{ data[indextr].ciudad_prolipa }}</span><br/>
                                <p style="font-weight:bold;">Periodo:</p>
                                <span>{{ data[indextr].periodo }}</span><br/>
                                <p style="font-weight:bold;">Asesor:</p>
                                <span>{{ data[indextr].asesorProlipa }}</span><br/>
                                <p style="font-weight:bold;">F. ultima:</p>
                                <span>{{ data[indextr].updated_at }}</span><br/>
                                <template v-if="data[indextr].estado == '1'">
                                <vs-chip color="primary">
                                        Activo
                                    </vs-chip>
                                </template>
                                <template v-else>
                                    <vs-chip color="primary">
                                        Desactivado
                                    </vs-chip>
                                </template>
                            </vs-td>
                            <vs-td>
                                <div class="flex">
                                    <template v-if="tr.id_periodo == null || tr.id_periodo == 0">
                                    <vx-tooltip style="display: inline-block;" text="editar" position="top" color="warning">
                                        <vs-button class="m-1" icon-pack="feather" icon="icon-edit" color="warning" size="small" type="filled" @click="update = true; openModal(data[indextr],1);">
                                        </vs-button>
                                    </vx-tooltip>
                                    </template>
                                    <template v-if="tr.id_periodo !== null || tr.id_periodo !== 0">
                                    <vx-tooltip style="display: inline-block;" text="Editar Asesor" position="top" color="primary">
                                        <vs-button class="m-1" icon-pack="feather" icon="icon-user" color="dark" size="small" type="filled" @click="update = true; openModal(data[indextr],2);getPeriodos()">
                                        </vs-button>
                                        </vx-tooltip>
                                    </template>
                                    <template v-if="data[indextr].estado == '1'">
                                        <vx-tooltip style="display: inline-block;" text="desactivar contrato" position="top" color="primary">
                                            <vs-button class="m-1" icon-pack="feather" icon="icon-bell-off" color="primary" size="small" type="filled" @click="desactivarTemporada(data[indextr].id_temporada)">
                                            </vs-button>
                                        </vx-tooltip>
                                    </template>
                                    <template v-else>
                                        <vx-tooltip style="display: inline-block;" text="Activar contrato" position="top" color="success">
                                            <vs-button class="m-1" icon-pack="feather" icon="icon-check" color="success" size="small" type="filled" @click="activarTemporada(data[indextr].id_temporada)">
                                            </vs-button>
                                        </vx-tooltip>
                                    </template>
                                    <vx-tooltip v-if="permisoRoot == true" style="display: inline-block;" text="eliminar" position="top" color="danger">
                                        <vs-button class="m-1" icon-pack="feather" icon="icon-trash" color="danger" size="small" type="filled" @click="openConfirm(tr)"></vs-button>
                                    </vx-tooltip>
                                </div>
                            
                            </vs-td>
                            <vs-td>
                                <template v-if="data[indextr].id_profesor ==0  && data[indextr].id_asesor ==0 && data[indextr].idInstitucion ==0">
                                    <p style="color:red">Agregue los ids</p>
                                </template>
                                <template v-else>
                                    <vx-tooltip style="display: inline-block;" text="Generar liquidación" position="top" color="rgb(134, 4, 98)">
                                        <vs-button class="m-1" icon-pack="feather" icon="icon-layers" color="rgb(134, 4, 98)" @click="irAshowLiquidacion(data[indextr].contrato)" size="small" type="filled"></vs-button>
                                    </vx-tooltip>
                                </template>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vx-card>
    </div>
    <vs-card v-else>
        <vs-button icon="reply" color="success" @click="verLiquidacion = false;" type="relief">Regresar</vs-button>
        <showliquidacion :contratoLiquidacion="contratoLiquidacion"/>
    </vs-card>
</div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'
import showliquidacion from "./showliquidacion.vue";
export default {
    data: () => ({
        usuario:[],
        update: true,
        id: 0,
        titleModal: '',
        // para el select de libros
        arregloAsesores: [],
        // arreglorProfesores: [],
        arregloInstitucion: [],
        //para traer las ciudades
        arregloCiudad: [],
        //arreglo para filtrar las instituciones por ciudades
        arregloTraeInstitucion: [],
        //arreglo para filtar los profesores por institucion
        arregloTraeProfesor: [],
        //para el select de la ciudades
        ciudadSelect: '',
        /*Modal identificadores a cada modal*/
        popupActivo2: false,
        popupActivo3: false,
        popupActivo4: false,
        popupEditarAsesor:false,
        //arreglo para la tabla temporada
        arregloTemporada: [],
        //objeto para guardar el valor de los inputs,select etc 
        temporada: {
            contrato: '',
            year: '',
            ciudad: '',
            temporada: '',
            profesor: '',
            cedulaprofesor: '',
            asesor: '',
            institucion: '',
            //para el modal de editar que se muestre la cedula del profesor para que el administrador pueda copiar y buscar en el select
            temporal_nombre_docente: '',
            cedulaprofesortemporal: '',
            nombresasesortemporal: '',
            instituciontemporal: '',
            periodo:'',
        },
        //objeto para guardar el valor de los inputs,select etc de la tabla docentes
        docente: {
            cedula: '',
            nombres: '',
            apellidos: '',
            email: '',
            name_usuario: '',
            institucion_idInstitucion: '',
        },
        //Para el showliquidacion
        fecha: '',
        liquidacionArreglo: [],
        arregloPeriodos:[],
        bloquear:true,
        codigos:[],
        contratoLiquidacion:'',
        verLiquidacion:false,
        //variables para filtro
        periodo:'',
        region2:'2',
        region:'2',
        contrato:'',
        tipo:'1',
        //fin variables para filtro,
        permisoRoot:false,
        temporada_id:0,
    }),
    components: {
        'v-select': vSelect,
        showliquidacion,
    },
    watch:{
        contrato(){
            let me = this;
            me.periodo = ""
            me.arregloTemporada = []
        }
    },
    methods: {
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
                .then(function (res) {
                    if(res.data.status == '1'){
                        me.permisoRoot = true
                    }else{
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        verificarContratoPeriodo(){
            let me = this;
             this.$http.get(this.$server_url+'validarContrato?institucion_id='+me.temporada.institucion.idInstitucion+'&periodo_id='+me.temporada.periodo.idperiodoescolar)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time:8000,
                        })
                        me.bloquear = true
                        me.codigos = res.data.codigos
                        return false
                    }
                    if(res.data.status == 1){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                        })
                        me.bloquear = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        fechaActual() {
            var fecha = moment().format('YYYY/MM/DD');
            this.fecha = fecha;
        },
        openConfirm(tr){
            let me = this;
            me.temporada_id = tr.id_temporada
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Al aceptar BORRARA todas las verificaciones si tuviera',
                accept:this.eliminarTemporada
            })
        },
        //eliminar temporada
        eliminarTemporada() {
            let me = this;
            let formData = new FormData();
            formData.append('id_temporada', me.temporada_id);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'temporadas/eliminar', formData)
                .then(res => {
                    me.listarTemporadas();
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Temporada  eliminada y contrato',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        // lista de asesores para usar en el select
        listaAsesores() {
            let me = this
            this.$http.get(this.$server_url + 'temporadas?asesores=yes').then(res => {
                    me.arregloAsesores = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        //lista de profesores para usar en el select
        // listaProfesores() {
        //     let me = this
        //     me.$vs.loading()
        //     this.$http.get(this.$server_url + `temporadas`).then(res => {
        //             me.arreglorProfesores = res.data.profesores;
        //             me.$vs.loading.close()
        //         })
        //         .catch(function (error) {
        //             console.log(error)
        //         })
        // },
        //lista de instituciones para usar en el select
        // listaInstituciones() {
        //     let me = this
        //     this.$http.get(this.$server_url + `temporadas`).then(res => {
        //             me.arregloInstitucion = res.data.listainstitucion;
        //             me.arregloCiudad = res.data.ciudad;
        //         })
        //         .catch(function (error) {
        //             console.log(error)
        //         })
        // },
        //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + `temporadas`).then(res => {
                    me.arregloCiudad = res.data.ciudad;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        //lista de ciudades para usar en el select
        getPeriodos() {
            let me = this
            this.$http.get(this.$server_url + 'periodo?porAllEstados=yes&region='+me.region).then(res => {
                    me.arregloPeriodos = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getPeriodos2() {
            let me = this
            me.contrato = ""
            me.arregloTemporada = []
            this.$http.get(this.$server_url + 'periodo?porAllEstados=yes&region='+me.region2).then(res => {
                    me.arregloPeriodos = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        //listar Temporadas
        list(){
            let me = this;
            me.arregloTemporada = []
            me.contrato = ""
            if(me.periodo == null || me.periodo == undefined || me.periodo == ""){
                me.$vs.notify({
                    text: 'Seleccione un periodo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })    
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'getTemporadas?periodo_id='+me.periodo.idperiodoescolar+'&temporada=yes').then(res => {
                    this.arregloTemporada = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        listarTemporadas(){
            let me = this;
            if(me.tipo == 1){
                me.list()
            }else{
                me.filtroContrato()
            }
        },
          //listar Temporadas
        filtroContrato(){
            let me = this;
            me.arregloTemporada = []
            if(me.contrato.length < 2){
                me.$vs.notify({
                    text: 'Ingrese mas de 3 caracteres',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })    
                return    
            }
            if(me.contrato.trim() == ""){
                me.$vs.notify({
                    text: 'Debe escribir un contrato',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })    
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'getTemporadas?contrato='+me.contrato+'&filtroContrato=yes').then(res => {
                    this.arregloTemporada = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        // desactivar el estado de la tabla 
        desactivarTemporada(id_temporada) {
            let me = this;
            let formData = new FormData();
            formData.append('id_temporada', id_temporada);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'temporadas/desactivar', formData)
                .then(res => {
                    me.listarTemporadas();
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Temporada  actualizada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        activarTemporada(id_temporada) {
            let me = this;
            let formData = new FormData();
            formData.append('id_temporada', id_temporada);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'temporadas/activar', formData)
                .then(res => {
                    me.listarTemporadas();
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Temporada  actualizada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        //para actualizar temporada
        agregar() {
            //datos para guardar
            let me = this;
            let formData = new FormData();
            if (me.update) {
                formData.append('id', me.id);
            }
            /*Fin de enviar el backend el id */
            formData.append('contrato', me.temporada.contrato);
            formData.append('year', me.temporada.year);
            formData.append('ciudad', me.temporada.ciudad);
            formData.append('temporada', me.temporada.temporada);
            formData.append('id_asesor', me.temporada.asesor.idusuario);
            formData.append('cedula_asesor', me.temporada.asesor.cedula);
            formData.append('id_profesor', me.temporada.profesor.idusuario);
            formData.append('idInstitucion', me.temporada.institucion.idInstitucion);
            formData.append('periodo',me.temporada.periodo.idperiodoescolar);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'temporadas', formData)
                .then(res => {
                    me.listarTemporadas();
                    me.popupActivo4 = false;
                    me.popupActivo2 = false;
                    me.limpiar()
                    me.$vs.loading.close()
                     me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    this.bloquear = true
                })
        },
        actualizarAsesor(){
              //actualizar al asesor r
            let me = this;
            let formData = new FormData();
            if (me.update) {
                formData.append('id', me.id);
            }
            formData.append('contrato', me.temporada.contrato);
            formData.append('id_asesor', me.temporada.asesor.idusuario);
            formData.append('cedula_asesor', me.temporada.asesor.cedula);
            me.$vs.loading()
            this.$http.get(this.$server_url + 'temporadas?editarAsesor=yes&contrato='+me.temporada.contrato+'&id_asesor='+me.temporada.asesor.idusuario+'&cedula_asesor='+me.temporada.asesor.cedula)
                .then(res => {
                    me.listarTemporadas();
                    me.popupEditarAsesor = false
                    me.$vs.loading.close()
                     me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    this.temporada.asesor = '';
                    this.temporada.profesor = '';
                    this.temporada.institucion = '';
                    this.bloquear = true

                })
                .catch(error =>{
                     me.$vs.loading.close()
                })
        },
        //para agregar temporada
        agregarTemporada() {
            //datos para guardar
            let me = this;
            let formData = new FormData();
            /* idusuario enviar al backend para la auditoria */
            // formData.append('id_asesor', me.temporada.asesor.idusuario);
            formData.append('contrato', me.temporada.contrato);
            formData.append('year', me.temporada.year);
            formData.append('ciudad', me.ciudadSelect.nombre);
            formData.append('temporada', me.temporada.temporada);
            formData.append('id_profesor', me.temporada.profesor.idusuario);
            formData.append('temporal_cedula_docente', me.temporada.profesor.cedula);
            formData.append('temporal_nombre_docente', me.temporada.profesor.profesornombres);
            formData.append('idInstitucion', me.temporada.institucion.idInstitucion);
            formData.append('temporal_institucion', me.temporada.institucion.nombreInstitucion);
            formData.append('id_asesor', me.temporada.asesor.idusuario);
            formData.append('cedula_asesor', me.temporada.asesor.cedula);
            formData.append('nombre_asesor', me.temporada.asesor.asesornombres);
            formData.append('periodo',me.temporada.periodo.idperiodoescolar)
            me.$vs.loading()
            this.$http.post(this.$server_url + 'temporadas', formData)
                .then(res => {
                    me.contrato = me.temporada.contrato
                    me.tipo = 2
                    me.listarTemporadas();
                    me.popupActivo4 = false;
                    me.popupActivo2 = false;
                    me.limpiar()
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Temporada guardada  exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                })
        },
        agregarDocente() {
            let me = this;
            let formData = new FormData();
            // formData.append('id_asesor', me.temporada.asesor.idusuario);
            formData.append('cedula', me.docente.cedula);
            formData.append('nombres', me.docente.nombres);
            formData.append('apellidos', me.docente.apellidos);
            formData.append('email', me.docente.email);
            formData.append('name_usuario', me.docente.name_usuario);
            formData.append('institucion_idInstitucion', me.docente.institucion_idInstitucion.idInstitucion);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'temporadas/docente', formData)
                .then(res => {
                    // me.listaProfesores();
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Docente guardado  exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });

                })
        },
        //cuando abre el modal  se le agre lo siguiente
        openModal(data,condicion) {
          let me = this;
            if (this.update) {
                if(condicion == 1){  
                    this.popupActivo2 = true;
                }
                //para editar solo el asesor
                else{
                    this.popupEditarAsesor = true;
                    me.temporada.asesor = {idusuario:data.id_asesor, nombres:data.asesorProlipa};
                }
                this.id = data.id_temporada;
                this.titleModal = 'Editar contrato '+data.contrato 
                // this.titleModal = "Modificar Temporada";
                //llenar los datos base de datos en los inputs para editar
                this.temporada.contrato = data.contrato;
                this.temporada.year = data.year;
                this.temporada.ciudad = data.ciudad;
                this.temporada.temporada = data.temporada;
                this.temporada.temporal_nombre_docente = data.temporal_nombre_docente;
                this.temporada.cedulaprofesortemporal = data.temporal_cedula_docente;
                this.temporada.nombresasesortemporal = data.nombre_asesor;
                this.temporada.instituciontemporal = data.temporal_institucion;
                // this.temporada.profesor = {idusuario:data.idusuarios, nombres:data.profesor, apellidos:data.papellido};
                // this.temporada.institucion = {idInstitucion:data.idInstitucion, nombreInstitucion:data.nombreInstitucion};
            } else {
                this.popupActivo4 = true;
                this.id = 0;
                this.titleModal = "Crear Temporada";
            }
        },
        limpiar(){
            let me = this;
            me.temporada.asesor                     = ""
            me.temporada.profesor                   = ""
            me.temporada.institucion                = ""
            me.temporada.periodo                    = ""
            me.ciudadSelect                         = ""
            this.temporada.contrato                 = ""
            this.temporada.year                     = ""
            this.temporada.ciudad                   = ""
            this.temporada.temporada                = ""
            this.temporada.temporal_nombre_docente  = ""
            this.temporada.cedulaprofesortemporal   = ""
            this.temporada.nombresasesortemporal    = ""
            this.temporada.instituciontemporal      = ""
        },
        //LIQUIDACIONES
        irAshowLiquidacion(contrato) {
            let me = this;
            me.contratoLiquidacion = contrato
            me.verLiquidacion = true
            // me.$vs.loading()
            // this.$http.get(this.$server_url + 'temporadas/liquidacion/' + contratoLiquidacion)
            //     .then(res => {
            //         console.log(res)
            //         this.liquidacionArreglo = res.data;
            //         localStorage.setItem("liquidacionArreglo", JSON.stringify(this.liquidacionArreglo));
            //         me.$router.push('/showliquidacion/');
            //         me.$vs.loading.close()
            //     })
        },
        //para filtrar instituciones por ciudades
        filtrarInstituciones() {
            let me = this;
            if (me.ciudadSelect.idciudad === undefined) {
                me.$vs.notify({
                    text: 'Seleccione una ciudad antes de filtrar por Instituciones',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.arregloTraeInstitucion = []
            me.$vs.loading()
            const formData = new FormData();
            formData.append('ciudad_id', me.ciudadSelect.idciudad);
            this.$http.post(this.$server_url + 'traerinstituciones', formData)
            .then(res => {
                me.arregloTraeInstitucion = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        //para filtrar instituciones por ciudades
        filtrarProfesores() {
            let me = this;
            if (me.temporada.institucion.idInstitucion === undefined) {
                me.$vs.notify({
                    text: 'Seleccione una institucion antes de filtrar por profesores',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.arregloTraeProfesor = []
            me.$vs.loading()
            const formData = new FormData();
            formData.append('idInstitucion', me.temporada.institucion.idInstitucion);
            this.$http.post(this.$server_url + 'traerprofesor', formData).then(res => {
                me.arregloTraeProfesor = res.data;
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        //para se carguen al cargar la pagina
        this.fechaActual();
        // this.list();
        this.listaCiudades();
        this.listaAsesores();
        this.getPeriodos2();
        this.getUserRoot();
    }
}
</script>
<style scoped>
   @media(max-width: 576px) {
        .periodo {
           width: 576px!important;
        }
    }
</style>
