<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-tabs>
        <vs-tab label="Actividades" icon-pack="feather" icon="icon-activity">
            <vs-popup fullscreen title="Actividad" :active.sync="popupActividad">
                <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/libro/'+name_carpeta+'/'+tipoCarpeta+'/'+linkP+'.html'"></iframe>
                <vs-button color="danger" @click="popupActividad=false" style="float: right;" class="mb-3 center" type="relief">Cerrar</vs-button>
            </vs-popup>
            <vx-card>
                <div align="center">
                    <vs-button color="success" type="line" icon="sync" size="small" class="sm:ml-3 w-full sm:w-auto" style="font-size: 14px;" @click="TransferirActividades()">
                        Transferir Actividades
                    </vs-button>
                </div>
                <div class="vx-row mt-4">
                    <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                        <div style="font-size: 12px; ">Asignatura: </div>
                        <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas.idasignatura" @input="cargaUnidades()" />
                    </div>
                    <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                        <div style="font-size: 12px; ">Unidad: </div>
                        <v-select class="mb-4 w-full" v-model="unidadesSelect" :options="unidades" label="nombre_unidad" :reduce="unidades => unidades.id" @input="getTemas(); temaSelect=0" />
                    </div>
                    <div class="vx-col sm:w-1/1 lg:w-1/1 w-full" align="left">
                        <!-- {{temaSelect}} -->
                        <div style="font-size: 12px; ">Tema: </div>
                        <v-select class="mb-4 w-full" v-model="temaSelect" :options="temas" label="nombre_tema" :reduce="temas => temas.id" />
                    </div>
                    <div class="vx-col sm:w-1/3 lg:w-1/3 w-full" align="left">
                        <div style="font-size: 12px; ">Tipo de contenido: </div>
                        <v-select class="mb-4 w-full" v-model="tipoActividadSelect" :options="tipoActividad" label="nombre" :reduce="tipoActividad => tipoActividad.id" />
                    </div>
                    <div class="vx-col sm:w-1/3 lg:w-1/3 w-full" align="left">
                        <div style="font-size: 12px; ">Link html: </div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="link" maxlength="50" placeholder="Nombre del archivo html" />
                    </div>
                    <div class="vx-col sm:w-1/3 lg:w-1/3 w-full" align="left">
                        <div style="font-size: 12px; ">Página: </div>
                        <vs-input type="number" class="inputx w-full mb-6" v-model="page" placeholder="Número de página del libro" />
                    </div>
                    <!-- {{id.id_item}} -->

                    <div class="vx-col sm:w-1/1 w-full mt-4">
                        <vs-button v-if="guarda_edita" class="m-2 mb-2" color="success" type="gradient" style="width: 150px" @click="guardarActividadAnimacion()">Guardar</vs-button>
                        <vs-button v-else class="m-2 mb-2" color="primary" type="gradient" style="width: 150px" @click="guardarActividadAnimacion()">Editar</vs-button>
                        <vs-button class="m-2 mb-2" color="warning" type="gradient" style="width: 150px" @click="buscarActividadAnimacion()">Buscar</vs-button>
                        <vs-button class="m-2 mb-2" color="dark" type="border" style="width: 150px" @click="vaciar()">Limpiar</vs-button>
                        <vs-input type="date" style="display: inline-block; width: 180px" v-model="fechaSelect" @input="getFecha()" />
                    </div>
                </div>
            </vx-card>
            <vx-card class="mb-base mt-4" v-if="listado">
                <p>Cantidad: {{todoActividades.length}} </p>
                <vs-table stripe pagination max-items="30" search :data="todoActividades">
                    <template slot="thead">
                        <vs-th v-if="listadoFechas">Asignatura</vs-th>
                        <vs-th>Unidad</vs-th>
                        <vs-th>Tema</vs-th>
                        <!-- <vs-th>Link html</vs-th> -->
                        <vs-th>Pagina - html</vs-th>
                        <vs-th>Acciones</vs-th>
                        <vs-th v-if="listadoFechas">Responsable</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td v-if="listadoFechas">
                                {{ data[indextr].nombreasignatura }}
                            </vs-td>
                            <vs-td width="30%">
                                {{ data[indextr].unidad }} -
                                {{ data[indextr].nombre_unidad }}
                            </vs-td>
                            <vs-td width="30%">
                                {{ data[indextr].nombre_tema }}
                            </vs-td>
                            <vs-td width="20%">
                                Pág.: {{ data[indextr].page }}<br>
                                html: {{ data[indextr].link }}<br>
                                <span class="text-success" v-if="data[indextr].tipo == 0">Actividad</span>
                                <span v-else class="text-warning">Animacion</span>
                            </vs-td>

                            <vs-td v-if="!listadoFechas || soloLibro">
                                <vx-tooltip style="display: inline-block;" text="Ver actividad" position="top" color="success" v-if="data[indextr].tipo == 0">
                                    <vs-button style="display: inline-block;" class="m-2 mb-2" radius icon-pack="feather" icon="icon-link" color="success" type="line" @click="verActividad(data[indextr].tipo, data[indextr].link,data[indextr].weblibro ) "></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;" text="Ver animación" position="top" color="warning" v-else>
                                    <vs-button style="display: inline-block;" class="m-2 mb-2" radius icon-pack="feather" icon="icon-link" color="warning" type="line" @click="verActividad(data[indextr].tipo, data[indextr].link,data[indextr].weblibro) "></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;" text="Seleccionar registro para edición" position="top" color="primary">
                                    <vs-button style="display: inline-block;" class="m-2 mb-2" radius icon-pack="feather" icon="icon-check-circle" @click="editaActividad(data[indextr])"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                    <vs-button style="display: inline-block;" size="large" radius icon-pack="feather" icon="icon-trash" @click="openConfirmEliminar(data[indextr].id_item);" color="danger" type="line"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;" :text="'Actualizado: '+ data[indextr].updated_at+ ' ' +data[indextr].nombres +' '+ data[indextr].apellidos  " position="top" color="dark">
                                    <vs-button size="large" radius icon-pack="feather" icon="icon-eye" color="dark" type="line"></vs-button>
                                </vx-tooltip>
                            </vs-td>
                            <vs-td v-if="listadoFechas" class="text-uppercase">
                                {{ data[indextr].nombres }} {{ data[indextr].apellidos }}
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vx-card>
            <vs-prompt @cancel="activePromptEliminar=false;" @accept="eliminarActividad()" @close="activePromptEliminar=false;" title="Eliminar" accept-text="Aceptar" cancel-text="Cancelar" :active.sync="activePromptEliminar" color="danger">
                <div class="con-exemple-prompt">
                    <h5 class="mb-4 mt-4">¿Está seguro de eliminar esta<span v-if="tipoActividadSelect==0"> actividad</span> <span v-else> animación</span>?</h5>
                </div>
            </vs-prompt>
        </vs-tab>
        <!-- <vs-tab label="Historico Actividades" icon-pack="feather" icon="icon-shield">
            <historicoActividadesVue/>
        </vs-tab> -->
    </vs-tabs>
    <vs-popup fullscreen class="informacionformhijo" title="Transferencia de Actividades" :active.sync="popupActivoTransferenciaActividades">
        <TransferenciaVideos v-if="popupActivoTransferenciaActividades" :AsignaturasEnviar="asignaturas" @change="changeHandleTransferenciaActividades" />
    </vs-popup>
</div>
</template>

<script>
import historicoActividadesVue from './historicoActividades.vue'
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
const TransferenciaVideos = () => import("@/views/actividades/transferenciaActividades.vue");
export default {
    components: {
        'v-select': vSelect,
        historicoActividadesVue,
        TransferenciaVideos
    },
    data() {
        return {
            asignaturas: [],
            asignaturaSelect: '',
            unidades: [],
            unidadesSelect: {},
            temas: [],
            temaSelect: 0,
            tipoActividad: [{
                "id": 0,
                "nombre": "Actividad"
            }, {
                "id": 1,
                "nombre": "Animación"
            }],
            tipoActividadSelect: '',
            link: '',
            linkP: '',
            page: '',
            usuario: '',
            todoActividades: [],
            guarda_edita: true,
            listado: false,
            id: '', //id de la actividad a editar
            activePromptEliminar: false,
            fechaSelect: '',
            listadoFechas: false,
            name_carpeta: '',
            url: '',
            tipoCarpeta: '',
            popupActividad: false,
            popupActivoTransferenciaActividades: false

        }
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        this.getAsignaturas();
    },
    methods: {
        TransferirActividades() {
            let me = this;
            me.popupActivoTransferenciaActividades = true;
        },
        changeHandleTransferenciaActividades(e) {
            let me = this;
            if (e.verificacionemittransferencia == 1) {
                me.popupActivoTransferenciaActividades = false;
            } else if (e.verificacionemittransferencia == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoTransferenciaActividades = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url + 'asignaturasActi')
                .then(res => {
                    me.asignaturas = res.data;
                    // console.log(me.asignaturas)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        cargaUnidades() {
            let me = this;
            me.temaSelect = 0;
            // console.log("longitud unid ",me.unidadesSelect.length >0)
            if (me.unidadesSelect > 0) {
                me.getTemas();
            }
            me.unidades = [];
            me.unidades.push({
                "id": 1,
                "nombre_unidad": 'Unidad 1'
            }, {
                "id": 2,
                "nombre_unidad": 'Unidad 2'
            }, {
                "id": 3,
                "nombre_unidad": 'Unidad 3'
            }, {
                "id": 4,
                "nombre_unidad": 'Unidad 4'
            }, {
                "id": 5,
                "nombre_unidad": 'Unidad 5'
            }, {
                "id": 6,
                "nombre_unidad": 'Unidad 6'
            }, {
                "id": 7,
                "nombre_unidad": 'Unidad 7'
            }, {
                "id": 8,
                "nombre_unidad": 'Unidad 8'
            })
        },
        getTemas() {
            let me = this;
            if (me.unidadesSelect === "" || me.unidadesSelect === undefined || me.unidadesSelect === null) {
                me.$vs.notify({
                    text: 'Seleccione la unidad',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.asignaturaSelect === "" || me.asignaturaSelect === undefined || me.asignaturaSelect === null) {
                me.$vs.notify({
                    text: 'Seleccione la asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            // me.temas = [];
            // me.temaSelect = "";
            let formData = new FormData();
            formData.append('unidad', me.unidadesSelect);
            formData.append('asignatura', me.asignaturaSelect);
            this.$http.post(this.$server_url + 'temasUnidad', formData)
                .then(res => {
                    me.temas = res.data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        guardarActividadAnimacion() {
            let me = this;
            me.listadoFechas = false;
            if (me.unidadesSelect === "" || me.unidadesSelect === undefined || me.unidadesSelect === null) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Seleccione la unidad',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.asignaturaSelect === "" || me.asignaturaSelect === undefined || me.asignaturaSelect === null) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Seleccione la asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.temaSelect === "" || me.temaSelect === undefined || me.temaSelect === null) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Seleccione el tema',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.tipoActividadSelect === "" || me.tipoActividadSelect === undefined || me.tipoActividadSelect === null) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Seleccione el tipo de contenido',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.link === "") {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Ingrese el nombre del archivo html',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.page === "") {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Ingrese el numero de página del libro',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.$vs.loading()

            let formData = new FormData();
            // console.log(me.id.id_item)
            if (me.id.id_item > 0) {
                formData.append('id_item', me.id.id_item);
            }
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('id_tema', me.temaSelect);
            formData.append('tipo', me.tipoActividadSelect);
            formData.append('link', me.link);
            formData.append('page', me.page);
            this.$http.post(this.$server_url + 'registro_actividades', formData)
                .then(res => {
                    if (me.guarda_edita) {
                        me.$vs.notify({
                            text: 'Actividad registrada, <br>link  ' + me.link + '<br> pagina ' + me.page,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Registro editado, <br>link  ' + me.link + '<br> pagina ' + me.page,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.id.id_item = ''
                    }
                    this.buscarActividadAnimacion();
                    me.link = ''
                    me.page = ''
                    me.guarda_edita = true;
                    me.$vs.loading.close()
                })
                .catch(error => {
                    me.$vs.notify({
                        text: 'Error al enviar el registro',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    console.log(error)
                })
        },
        // buscarFecha() {
        //     let me = this;
        //     me.$vs.loading()
        //     me.todoActividades = [];
        //     me.vaciar();
        //     this.$http.get(this.$server_url+'actividadesBuscarFechas/' + me.fecha)
        //         .then(res => {
        //             me.todoActividades = res.data;
        //             // console.log(me.todoActividades)
        //             me.listado = true
        //             me.$vs.loading.close()
        //         })
        //         .catch(error => {
        //             console.log(error)
        //             me.$vs.loading.close()
        //         })
        // },
        buscarActividadAnimacion() {
            let me = this;
            me.listadoFechas = false;
            me.soloLibro = false;
            me.guarda_edita = true;

            if (me.asignaturaSelect === '' || me.asignaturaSelect === undefined || me.asignaturaSelect === null) {
                // console.log("Asign ", me.asignaturaSelect)
                me.$vs.notify({
                    text: 'Seleccione una asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.$vs.loading()
            if (me.temaSelect > 0) {
                me.link = 0;
                me.page = 0;
                me.tipoActividadSelect = '';
                // console.log("Tema ", me.temaSelect != 0)
                this.$http.get(this.$server_url + 'actividades_x_Tema/' + me.temaSelect)
                    .then(res => {
                        me.todoActividades = res.data;
                        console.log(me.todoActividades)
                        me.listado = true
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            } else if (me.asignaturaSelect != "" || me.asignaturaSelect != undefined || me.asignaturaSelect != null) {
                me.soloLibro = true;
                this.$http.get(this.$server_url + 'actividades_x_Libro/' + me.asignaturaSelect)
                    .then(res => {
                        me.todoActividades = res.data;
                        // console.log("Por Libro ", me.todoActividades)
                        me.listado = true
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
        },
        verActividad(tipo, html, carpeta) {
            let me = this;
            me.popupActividad = true;
            tipo == 0 ? me.tipoCarpeta = 'actividades' : me.tipoCarpeta = 'animaciones'
            me.name_carpeta = carpeta
            me.linkP = html;
            console.log($data_url + 'archivos/upload/libro/' + me.name_carpeta + '/' + me.tipoCarpeta + '/' + me.linkP + '.html')
        },
        vaciar() {
            let me = this;
            me.page = "";
            me.link = "";
            me.tipoActividadSelect = "";
            me.temaSelect = "";
            me.temas = [];
            me.unidadesSelect = "";
            me.unidades = [];
            me.asignaturaSelect = "";
            me.id = '';
            me.todoActividades = '';
            me.guarda_edita = true;
            me.listado = false;
            me.listadoFechas = false;
            me.soloLibro = false;
            me.fechaSelect = '';
        },
        editaActividad(item) {
            let me = this;
            me.id = item;
            me.link = item.link
            me.page = item.page
            me.temaSelect = item.id_tema;
            // console.log(item.id_tema)
            me.tipoActividadSelect = item.tipo
            me.unidadesSelect = item.unidad
            me.guarda_edita = false;
            me.listadoFechas = false;
            me.soloLibro = true;
            me.getTemas();
            // console.log(item)
        },
        openConfirmEliminar(item) {
            let me = this;
            me.id = item;
            me.activePromptEliminar = true;
        },
        eliminarActividad() {
            let me = this;
            // console.log(me.id.id_item)
            me.$vs.loading()
            me.listadoFechas = false;
            me.soloLibro = false;
            this.$http.get(this.$server_url + `eliminaActividad/${me.id}`).then(res => {
                    me.$vs.notify({
                        text: 'Registro eliminado.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    this.buscarActividadAnimacion();
                    me.page = "";
                    me.link = "";
                    me.id = '';
                    me.guarda_edita = true;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'No se puede eliminar este registro! ' + error,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                })
        },
        getFecha() {
            let me = this;
            // console.log(me.fechaSelect);
            me.page = "";
            me.link = "";
            me.tipoActividadSelect = "";
            me.temaSelect = "";
            me.temas = [];
            me.unidadesSelect = "";
            me.unidades = [];
            me.asignaturaSelect = "";
            me.id = '';
            me.todoActividades = '';
            me.guarda_edita = true;
            me.listado = true;
            me.listadoFechas = true;
            me.soloLibro = true;
            me.$vs.loading()
            this.$http.get(this.$server_url + `actividadesBuscarFechas/${me.fechaSelect}`).then(res => {
                    me.todoActividades = res.data;
                    console.log(me.todoActividades)
                    me.$vs.loading.close()
                })
                .catch(function (error) {

                    me.$vs.loading.close()
                })
        }
    }
}
</script>
