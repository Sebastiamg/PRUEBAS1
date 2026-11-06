<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-popup title="Seleccione un curso" :active.sync="modalCursosEnvioLink">
        <vs-list>
            <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">
                <template slot="avatar">
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                </template>
                <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="success" @click="asignarCurso(item)">Asignar material</vs-button>

                <vs-button v-if="verTipoModal===false" type="filled" target="_blank" color="warning" style="font-size: 12px;" size="small" @click="modalCursosEnvioLink=false; verCalificaciones(item)">Ver calificaciones</vs-button>
            </vs-list-item>
        </vs-list>
    </vs-popup>
    <vs-popup title="Seleccione un curso" :active.sync="modalCursosArchivos">
        <vs-list>
            <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">
                <template slot="avatar">
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                </template>
                <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="success" @click="asignarCursoArchivo(item)">Asignar archivo</vs-button>
            </vs-list-item>
        </vs-list>
    </vs-popup>
    <vs-popup size="large" title="Asignar material y temas" :active.sync="modalTemas">
        <div class="vx-row m-5" v-if="usuario">
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px; ">Material de apoyo: </div>
                <v-select class="mb-4 w-full" v-model="materialSelect" :options="materiales" label="nombrematerial" :reduce="materiales => materiales" />
            </div>
            <div class="vx-col md:w-2/3 w-full" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <v-select class="mb-4 w-full" @input="unidadesSelect='';temaSelect='';temas=[];" v-if="tipoUsuario != 6 || tipoUsuario!=16" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas.idasignatura" />
                <v-select class="mb-4 w-full" v-else v-model="asignaturaSelect" disabled :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas.idasignatura" />
            </div>
            <div class="vx-col md:w-1/3 w-full" align="left">
                <div style="font-size: 12px; ">Unidad: </div>
                <v-select class="mb-4 w-full" v-model="unidadesSelect" :options="unidades" label="nombre_unidad" :reduce="unidades => unidades.id" @input="getTemas();" />
            </div>
            <div class="vx-col w-full mb-base" align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <v-select multiple :closeOnSelect="false" :options="temas" :reduce="temas => temas" label="nombre_tema" class="w-full" v-model="temaSelect" />
            </div>
            <div class="vx-col md:w-2/3 w-full" align="right">
                <vs-button v-if="op_editar==0" style="display:inline-block" @click="asignarMaterialAsignatura();" color="success" type="relief">Asignar TEMAS </vs-button> &nbsp;
                <vs-button v-if="op_editar==1" style="display:inline-block" @click="editarTemasMaterialAsignatura();" color="warning" type="relief">Editar TEMAS</vs-button>
            </div>
        </div>
    </vs-popup>
    <vs-popup size="large" title="Unidades" :active.sync="modalMaterialTemas">
        <div v-for="(item,$index) in temasMostrar" :key="$index">
            Unidad {{item.unidad}} -
            {{ item.nombre_tema }}
        </div>
    </vs-popup>
    <vx-card>
      <!--DOCENTES-->
      <div v-if="tipoUsuario === 6 || tipoUsuario === 10 || tipoUsuario == 16">
            <div class="">
              <vs-tabs>
              <vs-tab label="Material Digital">
                  <div class="con-tab-ejemplo">
                        <vs-table stripe pagination max-items="30" search :data="material">
                          <template slot="header" v-if="tipoUsuario != 6 && tipoUsuario != 10 && tipoUsuario != 16">
                              <vs-button @click="vaciarModal()" size="small" color="dark" type="filled" style="font-size: 13px;">Asignar material y temas </vs-button>
                          </template>
                          <template slot="thead">
                              <vs-th style="max-width: 20px;">#</vs-th>
                              <vs-th>Material</vs-th>
                              <vs-th>Temas</vs-th>
                              <vs-th>Acciones</vs-th>
                          </template>
                          <template slot-scope="{data}">
                              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                  <vs-td>
                                      {{indextr+1}}
                                  </vs-td>
                                  <vs-td width="30%">
                                      <b>Material:</b> {{ data[indextr].nombrematerial }}<br>
                                      <b>Libro:</b> {{ data[indextr].nombreasignatura }}
                                  </vs-td>
                                  <vs-td>
                                      <template v-if="usuario.id_group == 16">
                                          <div v-if="materialDigital.ver = '1'">
                                              <div v-if="data[indextr].temas[0].unidad">
                                                  <vs-button @click="UnidadesTemasMaterialShow(data[indextr].temas)" color="warning" size="small">Ver temas</vs-button>
                                              </div>
                                          </div>
                                      </template>
                                      <template v-else>
                                          <div v-if="data[indextr].temas[0].unidad">
                                              <vs-button @click="UnidadesTemasMaterialShow(data[indextr].temas)" color="warning" size="small">Ver temas</vs-button>
                                          </div>
                                      </template>
                                  </vs-td>
                                  <vs-td width="250px">
                                      <div v-if="usuario.id_group == 16">
                                          <vx-tooltip v-if="materialDigital.previsualizar == '1'" style="display: inline-block;" text="Previsualizar material" position="top" color="primary">
                                              <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="verMaterial(data[indextr])" color="primary" type="line"></vs-button>
                                          </vx-tooltip>

                                          <vx-tooltip v-if="materialDigital.asignar == '1'" style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                              <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_material = data[indextr]; getCursosDocente();nombrematerial=tr.nombrematerial" color="warning" type="line"></vs-button>
                                          </vx-tooltip>
                                      </div>
                                      <div v-else>
                                          <vx-tooltip style="display: inline-block;" text="Previsualizar material" position="top" color="primary">
                                          <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="verMaterial(data[indextr])" color="primary" type="line"></vs-button>
                                          </vx-tooltip>
                                          <vx-tooltip style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                              <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_material = data[indextr]; getCursosDocente();nombrematerial=tr.nombrematerial" color="warning" type="line"></vs-button>
                                          </vx-tooltip>
                                      </div>

                                  </vs-td>
                              </vs-tr>
                          </template>
                      </vs-table>
                  </div>
              </vs-tab>
                  <vs-tab label="Material - archivos">
                      <listadoMaterarial tipoAsignatura="1" :asignatura="asignaturaSelect.id" asignaturaName="asignaturaSelect.nombreasignatura"/>
                  </vs-tab>
              </vs-tabs>
          </div>
      </div>
      <!--ADMINISTRADOR-->
      <vs-tabs v-else alignment="fixed" color="success mt-4">
        <vs-tab label="Material - asignaturas - temas">
            <div class="vx-col w-full" align="left" v-if="tipoUsuario == 1">
                <div v-if="material">
                    <vs-table stripe pagination max-items="30" search :data="material">
                        <template slot="header" v-if="tipoUsuario != 6 || tipoUsuario != 16">
                            <vs-button @click="vaciarModal()" size="small" color="dark" type="filled" style="font-size: 13px;">Asignar material y temas </vs-button>
                        </template>
                        <template slot="thead">
                            <vs-th style="max-width: 20px;">#</vs-th>
                            <vs-th>Material</vs-th>
                            <vs-th>Temas</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{indextr+1}}
                                </vs-td>
                                <vs-td width="30%">
                                    <b>Material:</b> {{ data[indextr].nombrematerial }}<br>
                                    <b>Libro:</b> {{ data[indextr].nombreasignatura }}
                                </vs-td>
                                <vs-td>
                                    <div v-if="data[indextr].temas[0].unidad">
                                        <vs-button @click="UnidadesTemasMaterialShow(data[indextr].temas)" color="warning" size="small">Ver temas</vs-button>
                                    </div>
                                </vs-td>
                                <vs-td width="250px" v-if="usuario">
                                    <vx-tooltip v-if="tipoUsuario != 6 || tipoUsuario==16" style="display: inline-block;" text="Editar" position="top" color="success">
                                        <vs-button radius style="display: inline-block;" class="m-2 mb-2" icon-pack="feather" icon="icon-edit" color="success" type="line" size="large" @click="data_material=data[indextr]; op_editar = 1; dataFormularioEditar(data[indextr])"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="tipoUsuario != 6 || tipoUsuario==16" style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                        <vs-button radius style="display: inline-block;" size="large" class="m-2 mb-2" icon-pack="feather" color="danger" icon="icon-trash" type="line" @click="data_material=data[indextr]; openConfirmEliminarMaterial(); op_eliminar=2"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip v-if="tipoUsuario === 6 || tipoUsuario==16" style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_material = data[indextr]; getCursosDocente();nombrematerial=tr.nombrematerial" color="warning" type="line"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-else>
                    <vs-button @click="vaciarModal()" size="small" color="dark" type="filled" style="font-size: 13px;">Asignar material y temas </vs-button>
                </div>
            </div>
        </vs-tab>
        <vs-tab label="Material de apoyo interactivo">
            <vs-popup title="Asignar material y temas" :active.sync="modalMaterial">
                <div class="vx-row mt-4">
                    <div class="vx-col w-full" align="left">
                        <div style="font-size: 12px; ">Nombre: </div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.nombrematerial" maxlength="100" placeholder="Nombre del material" />
                    </div>
                    <div class="vx-col w-full" align="left">
                        <div style="font-size: 12px; ">Descripcion: </div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.descripcionmaterial" maxlength="200" placeholder="Descripción" />
                    </div>
                    <div class="vx-col w-full" align="left">
                        <div style="font-size: 12px; ">Nombre de la carpeta del archivo digital: </div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.webmaterial" maxlength="200" placeholder="Archivo digital" />
                    </div>
                    <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                        <div style="font-size: 12px; ">Nombre del archivo zip: </div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.zipmaterial" maxlength="200" placeholder="Archivo zip" />
                    </div>
                    <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                        <div style="font-size: 12px; ">Nombre de la portada: </div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="materialAp.imagenmaterial" maxlength="200" placeholder="portada.jpg / portada.png" />
                    </div>
                    <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                        <div style="font-size: 12px; ">Estado: </div>
                        <v-select class="mb-4 w-full" v-model="materialAp.Estado_idEstado" :options="estados" label="nombreestado" :reduce="estados => estados.idEstado" />
                    </div>
                    <div class="vx-col w-full mb-base" align="left">
                        <vs-button v-if="edita==0" style="display:inline-block" @click="registrarMaterial();" color="success" type="relief">Registrar material </vs-button> &nbsp;
                        <vs-button v-if="edita==1" style="display:inline-block" @click="registrarMaterial(materialAp);" color="warning" type="relief">Editar material </vs-button> &nbsp;
                        <vs-button style="display:inline-block" @click="edita=0; vaciar();" color="danger" type="relief">Cancelar </vs-button> &nbsp;
                    </div>
                </div>
            </vs-popup>
            <div class="vx-row m-2" v-if="tipoUsuario == 1">
                <div v-if="materiales" class=" w-full">
                    <vs-divider>
                        <b>{{materiales.length}} materiales registrados actualmente</b>
                    </vs-divider>
                    <vs-table stripe pagination max-items="20" width="100%" search :data="materiales">
                        <template slot="header">
                            <vs-button @click="modalAgregarMaterial()" v-if="usuario.id_group == 1 || userRoot == true" size="small" color="dark" type="filled" style="font-size: 13px;">Agregar nuevo material</vs-button>
                        </template>
                        <template slot="thead">
                            <vs-th>#</vs-th>
                            <vs-th>Nombre</vs-th>
                            <vs-th>Fechas</vs-th>
                            <vs-th>Estado</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{indextr+1}}
                                </vs-td>
                                <vs-td>
                                    <vs-chip color="primary">
                                        <p @click="abrirMaterial(data[indextr])">{{ data[indextr].nombrematerial }}</p>
                                    </vs-chip>
                                </vs-td>
                                <vs-td>
                                    <small>Actualizado: {{ data[indextr].updated_at }}<br>
                                        Registrado: {{ data[indextr].created_at }}</small>
                                </vs-td>
                                <vs-td>
                                    <label v-if="data[indextr].Estado_idEstado == '1'" class="text-success">Activo</label>
                                    <label v-if="data[indextr].Estado_idEstado == '2'" class="text-danger">Inactivo</label>
                                </vs-td>
                                <vs-td v-if="usuario.id_group == 1 || userRoot == true">
                                    <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="warning">
                                        <vs-button radius style="display: inline-block;" size="large" class="m-2 mb-2" icon-pack="feather" color="warning" icon="icon-edit" type="line" @click="selectMaterial(data[indextr]); edita=1; modalMaterial=true;"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                        <vs-button radius style="display: inline-block;" size="large" class="m-2 mb-2" icon-pack="feather" color="danger" icon="icon-trash" type="line" @click="openConfirmEliminar(data[indextr]);op_eliminar=1; edita = 0"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                                <vs-td v-else>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-else>
                    <vs-button @click="modalAgregarMaterial()" size="small" color="dark" type="filled" style="font-size: 13px;">Agregar nuevo material</vs-button>
                </div>
            </div>
        </vs-tab>
        <vs-tab label="Cargar documentos material">
          <listadoMaterarial/>
        </vs-tab>
      </vs-tabs>
    </vx-card>
    <!-- PARA VER LOS TEMAS DE LOS ARCHIVOS -->
    <vs-popup class="holamundo"  title="Listado de Unidades-Temas" :active.sync="popupActivo">
        <vs-list v-for="item in infotemas" :key="item">
            <vs-list-item :title="'Unidad: '+item.unidad" :subtitle="'Tema: '+item.nombre_tema"></vs-list-item>
        </vs-list>
    </vs-popup>
</div>
</template>
<script>
import listadoMaterarial from './material_subir/listadoMaterial.vue'
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import cargarmaterial from './cargarmaterial';
export default {
     mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
        cargarmaterial,
        listadoMaterarial
    },
    data() {
        return {
            infotemas:[],
            popupActivo:false,
            archivos:false,
            infoarchivos:[],
            modalMaterial: false,
            modalTemas: false,
            material: [],
            materialSelect: '',
            materiales: [],
            temas: [],
            temaSelect: [],
            asignaturas: [],
            asignaturaSelect: {},
            unidades: [{
                "id": 1,
                nombre_unidad: 'Unidad 1'
            }, {
                "id": 2,
                nombre_unidad: 'Unidad 2'
            }, {
                "id": 3,
                nombre_unidad: 'Unidad 3'
            }, {
                "id": 4,
                nombre_unidad: 'Unidad 4'
            }, {
                "id": 5,
                nombre_unidad: 'Unidad 5'
            }, {
                "id": 6,
                nombre_unidad: 'Unidad 6'
            }, {
                "id": 7,
                nombre_unidad: 'Unidad 7'
            }, {
                "id": 8,
                nombre_unidad: 'Unidad 8'
            }],
            unidadesSelect: {},
            n_material: '',
            materialAp: {
                'idmaterial': '',
                'nombrematerial': '',
                'descripcionmaterial': '',
                'zipmaterial': '',
                'webmaterial': '',
                'imagenmaterial': '',
                'exematerial': '',
                'Estado_idEstado': 1,
            },
            estados: [],
            op_eliminar: '',
            op_editar: 0,
            edita: 0,
            item_eliminar: '',
            data_material: [],
            id_material_editar: '',
            estado_material: false,
            modalCursosEnvioLink: false,
            modalCursosArchivos:false,
            cursosDocente: [],
            verTipoModal: false,
            usuario: [],
            miusuario:[],
            tipoUsuario: 1,
            grupo_usuario: '',
            idusuario: '',
            datoU: '',
            modalMaterialTemas: false,
            temasMostrar: '',
            nombrematerial:'',
             //====VARIABLES PARA RECURSOS EXTERNOS
            libro:{
                libroweb:'1',
                libro_con_guia:'1',
                guia_didactica:'1',
                unidades:'1',
            },
            curso:{
                ver:'1',
                agregar:'1',
                editar:'1',
                eliminar:'1',
            },
            cuaderno:{
                guia:'1',
                didactica:'1',
                web:'1',
            },
            planificacion:{
                descargar:'1',
                visualizar:'1',
            },
            //variables para recursos adicionales
            mijuego:{
                agregar:'1',
                editar:'1',
                eliminar:'1',
                ver:'1',
                asignar:'1',
            },
            juegoProlipa:{
                asignar:'1',
                ver:'1',
                previsualizar:'1',
            },
            materialDigital:{
                ver:'1',
                previsualizar:'1',
                asignar:'1',
            },
            materialpdf:{
                subir:'1',
                ver:'1',
                descargar:'1',
                asignar:'1',
            },
            propuesta:{
                ver:'1',
            },
            adaptacion:{
                ver:'1',
            },
            articulo:{
                lengua:'1',
                matematica:'1',
                naturales:'1',
                sociales:'1',
                ensenanza:'1',
            },
            documentom:{
                ver:'1',
            },
            permisosExternos:'',
          //fin de variables para recursos adicionales
          //FIN DE VARIABLES PARA RECURSOS EXTERNOS
          userRoot:false,
        }
    },
    mounted() {
        let me = this;
        //asignatura que se obtiene en el docente
        me.asignaturaSelect = {
            id: localStorage.idasignatura,
            nombreasignatura: localStorage.nombreasignatura
        }
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario
        me.tipoUsuario = me.usuario.id_group
        me.miusuario = me.usuario
        me.grupo_usuario = me.miusuario.id_group;
        if (me.grupo_usuario == 10) { //director
            me.datoU = JSON.parse(localStorage.getItem('datoUser'))
            me.miusuario = me.datoU
        }
        me.getMaterialAsignaturas();
        me.traerArchivos();
        me.getTodoMaterial();
        me.getTodoAsignaturas();
        me.getEstados();
        me.getUserRoot(me.usuario)
          //PERMISOS EXTERNOS
        if(localStorage.status_permisos == "yes"){
            me.permisosExternos = JSON.parse(localStorage.permisosExternos)
            me.libro                    = me.permisosExternos.permisos_libros
            me.curso                    = me.permisosExternos.permisos_cursos
            me.cuaderno                 = me.permisosExternos.permisos_cuadernos
            me.planificacion            = me.permisosExternos.permisos_planificaciones
            //data de los recursos adicionales
            me.mijuego                  = me.permisosExternos.zona_diversion_mi_juego
            me.juegoProlipa             = me.permisosExternos.zona_diversion_juego_prolipa
            me.materialDigital          = me.permisosExternos.material_apoyo_digital
            me.materialpdf              = me.permisosExternos.material_apoyo_pdf
            me.propuesta                = me.permisosExternos.propuestas_metodologicas
            me.adaptacion               = me.permisosExternos.adaptaciones
            me.articulo                 = me.permisosExternos.articulos
            me.documentom               = me.permisosExternos.documentos_ministeriales
        }
        //FIN DE PERMISOS EXTERNOS
    },
    methods: {
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
            .then((result) => {
                if (result.data.length > 0) {
                me.userRoot = true;
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
         abrirMaterial(data={}) {
            let me = this
            if (data.webmaterial === null || data.webmaterial === 'null') {
                me.$vs.notify({
                    text: 'El material  aun no está disponible',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            localStorage.materialApoyo = data.webmaterial;
            let route = this.$router.resolve({path: '/material/apoyo/ver'});
            window.open(route.href, '_blank');
        },
        //para subir archivos
         //crear material
        crearMaterial(){
            localStorage.docente="yes";
            this.$router.push('/subirmaterial/docente/');
        },
        //para traer los temas de los archivos
        verTemasArchivo(id_material){
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'materialtemas/'+id_material).then(res => {
                this.infotemas = res.data;
                me.popupActivo = true;
                me.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        //para traer los archivos pdfs
          traerArchivos() {
            let me = this;
             let id_asignatura = localStorage.idasignatura
            me.$vs.loading()
            this.$http.get(this.$server_url + 'traer_archivos_asignaturas/' + id_asignatura).then(res => {
                this.infoarchivos = res.data;
                me.$vs.loading.close();
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        getMaterialAsignaturas() {
            let me = this;
            me.$vs.loading()
            let id_asignatura = localStorage.idasignatura
            if (me.tipoUsuario === 1) {
                id_asignatura = 'null'
            }
            this.$http.get(this.$server_url+'temas_por_material/' + id_asignatura)
                .then(res => {
                    me.material = res.data.items
                    me.$vs.loading.close()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        getTemas() {
            let me = this;
            me.temas = []
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
            let asignatura = me.asignaturaSelect
            if (me.asignaturaSelect.id) {
                asignatura = me.asignaturaSelect.id
            }
            let formData = new FormData();
            formData.append('unidad', me.unidadesSelect);
            formData.append('asignatura', asignatura);
            this.$http.post(this.$server_url+'temas_asignatura_material', formData)
                .then(res => {
                    me.temas = res.data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getTodoMaterial() {
            let me = this;
            // me.$vs.loading()
            me.op_eliminar = '';
            let id_asignatura = localStorage.idasignatura
            if (me.tipoUsuario === 1) {
                id_asignatura = 'null'
            }
            this.$http.get(this.$server_url+'todo_material_apoyo/' + id_asignatura)
                .then(res => {
                    me.materiales = res.data;
                    me.$vs.loading.close()
                    // console.log(me.material)
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        getTodoAsignaturas() {
            let me = this;
            // me.$vs.loading()
            this.$http.get(this.$server_url+'todo_asignaturas')
                .then(res => {
                    me.asignaturas = res.data;
                    me.$vs.loading.close()
                    // console.log(me.material)
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        asignarMaterialAsignatura() {
            let me = this;
            if (me.materialSelect.idmaterial == undefined) {
                me.$vs.notify({
                    text: 'Seleccione el material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.asignaturaSelect == '') {
                me.$vs.notify({
                    text: 'Seleccione una asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            me.$vs.loading()
            let temas_vector = []
            for (var i = 0; i < me.temaSelect.length; i++) {
                temas_vector.push(me.temaSelect[i].id)
            }
            let formData1 = new FormData();
            formData1.append('id_material', me.materialSelect.idmaterial);
            formData1.append('id_tema', temas_vector);
            this.$http.post(this.$server_url+'temas_material', formData1)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Temas registrados en el material',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.getMaterialAsignaturas();
                    me.modalTemas = false
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'fallooooo. ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.vaciar();
                    me.getMaterialAsignaturas();
                    me.modalTemas = false
                })

        },
        dataFormularioEditar(item) {
            let me = this
            me.materialSelect = {
                nombrematerial: item.nombrematerial,
                idmaterial: item.idmaterial
            }
            me.unidadesSelect = {
                id: item.temas[0].unidad,
                nombre_unidad: 'Unidad ' + item.temas[0].unidad
            }
            me.asignaturaSelect = item.asignatura_idasignatura
            // me.estado_material = item.estado
            me.temaSelect = []
            if (item.temas) {
                for (var i = 0; i < item.temas.length; i++) {
                    me.temaSelect.push({
                        id: item.temas[i].id_tema,
                        nombre_tema: item.temas[i].nombre_tema
                    })
                }
            }

            me.modalTemas = true
        },
        editarTemasMaterialAsignatura() {
            let me = this
            me.$vs.loading()
            let formData = new FormData();
            formData.append('idmaterial', me.data_material.idmaterial);
            formData.append('idasignatura', me.data_material.asignatura_idasignatura);
            this.$http.post(this.$server_url+'borrar_temas_material', formData)
                .then(res => {
                    let temas_vector = []
                    for (var i = 0; i < me.temaSelect.length; i++) {
                        temas_vector.push(me.temaSelect[i].id)
                    }
                    let formData1 = new FormData();
                    formData1.append('id_material', me.data_material.idmaterial);
                    formData1.append('id_tema', temas_vector);
                    this.$http.post(this.$server_url+'temas_material', formData1)
                        .then(res => {
                            // console.log(res.data)
                            me.$vs.notify({
                                text: 'Temas editados en el material',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                            me.$vs.loading.close()
                            me.vaciar();
                            me.getMaterialAsignaturas();
                            me.modalTemas = false
                        })
                        .catch(error => {
                            me.$vs.notify({
                                text: 'falló. ',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                            me.$vs.loading.close()
                        })
                })
                .catch(error => {

                })
        },
        openConfirmEliminar(item) {
            let me = this;
            me.item_eliminar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar esta asignación?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarMaterial
            })
        },
        openConfirmEliminarMaterial() {
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este material?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.confirmEliminarMaterial
            })
        },
        confirmEliminarMaterial() {
            let me = this
            let formData = new FormData();
            formData.append('idmaterial', me.data_material.idmaterial);
            formData.append('idasignatura', me.data_material.asignatura_idasignatura);
            this.$http.post(this.$server_url+'borrar_temas_material', formData)
                .then(res => {
                    this.$http.post(this.$server_url+'borrar_material_asig', formData)
                        .then(res => {
                            me.getMaterialAsignaturas()
                            me.$vs.notify({
                                text: 'Material eliminado correctamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            })
                        })
                })
                .catch(error => {

                })
        },
        eliminarMaterial() {
            let me = this;
            // console.log(me.item_eliminar.temas)
            me.$vs.loading()
            if (me.op_eliminar == 2) {
                // console.log(me.item_eliminar)
                let formData = new FormData();
                formData.append('material_idmaterial', me.item_eliminar.idmaterial);
                formData.append('asignatura_idasignatura', me.item_eliminar.asignatura_idasignatura);
                formData.append('temas', me.item_eliminar.temas);
                this.$http.post(this.$server_url+'quitar_material_asignatura', formData)
                    .then(res => {
                        // console.log(res.data)
                        me.$vs.notify({
                            text: me.item_eliminar.nombrematerial + ' eliminado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close()
                        me.vaciar();
                        me.getMaterialAsignaturas();
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
            if (me.op_eliminar == 1) {
                let formData = new FormData();
                formData.append('idmaterial', me.item_eliminar.idmaterial);
                this.$http.post(this.$server_url+'eliminarMaterial', formData)
                    .then(res => {
                        // console.log(res.data)
                        me.$vs.notify({
                            text: me.item_eliminar.nombrematerial + ' eliminado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close()
                        me.getTodoMaterial();
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.loading.close()
                    })
            }
        },
        getEstados() {
            let me = this;
            // me.$vs.loading()
            this.$http.get(this.$server_url+'material_estados')
                .then(res => {
                    me.estados = res.data;
                    me.$vs.loading.close()
                    // console.log(me.material)
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        registrarMaterial(item) {
            let me = this;
            // console.log(item)
            if (me.materialAp.nombrematerial == "" || me.materialAp.nombrematerial == undefined) {
                me.$vs.notify({
                    text: 'Ingrese el nombre del material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.materialAp.webmaterial == '' || me.materialAp.webmaterial == undefined) {
                me.$vs.notify({
                    text: 'Ingrese el nombre del archivo digital del material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.materialAp.imagenmaterial == '' || me.materialAp.imagenmaterial == undefined) {
                me.$vs.notify({
                    text: 'Escriba el nombre de la portada del material de apoyo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.loading()
            let formData = new FormData();
            if (me.materialAp.idmaterial > 0) {
                formData.append('idmaterial', me.materialAp.idmaterial);
            }
            formData.append('nombrematerial', me.materialAp.nombrematerial);
            formData.append('descripcionmaterial', me.materialAp.descripcionmaterial);
            formData.append('webmaterial', me.materialAp.webmaterial);
            formData.append('exematerial', me.materialAp.exematerial);
            formData.append('imagenmaterial', me.materialAp.imagenmaterial);
            formData.append('Estado_idEstado', me.materialAp.Estado_idEstado);
            formData.append('zipmaterial', me.materialAp.zipmaterial);
            formData.append('creador', me.miusuario.idusuario);
            this.$http.post(this.$server_url+'registrar_material', formData)
                .then(res => {

                    if (me.materialAp.idmaterial > 0) {
                        me.edita = 0;
                        me.$vs.notify({
                            text: me.materialAp.nombrematerial + 'editado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {

                        me.$vs.notify({
                            text: 'Material registrado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.modalMaterial = false;
                    me.$vs.loading.close()
                    me.vaciar();
                    me.getTodoMaterial();
                })
                .catch(error => {
                    me.$vs.loading.close();
                    me.getTodoMaterial();
                })
        },
        selectMaterial(item) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'showMaterial/' + item.idmaterial)
                .then(res => {
                    me.materialAp = (res.data[0]);
                    me.$vs.loading.close()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        vaciar() {
            let me = this;
            me.materialAp = {
                'idmaterial': '',
                'nombrematerial': '',
                'descripcionmaterial': '',
                'zipmaterial': '',
                'webmaterial': '',
                'imagenmaterial': '',
                'exematerial': '',
                'Estado_idEstado': 1,
            };
            me.materialSelect = '';
            me.temaSelec = 0;
            me.unidadesSelect = {};
            me.modalMaterial = false;

        },
        vaciarModal() {
            let me              = this;
            me.materialSelect   = '';
            me.unidadesSelect   = '';
            me.temaSelect       = "";
            me.op_editar        = 0;
            me.asignaturaSelect = ""
            // me.asignaturas      = []
            me.modalTemas       = true;
        },
        pasarDatos(item) {
            let me = this;
            me.op_editar = 1;
            me.materialSelect = item.nombrematerial;
            me.asignaturaSelect = item.nombreasignatura;
            me.unidadesSelect = item.temas.length > 0 ? item.temas[0].id_unidad : '';
            me.temaSelect = item.temas;
            me.modalTemas = true;

        },
        modalAgregarMaterial() {
            let me = this;
            me.modalMaterial = true;
        },
        getCursosDocente() {
            let me = this
            let formData = new FormData();
            formData.append('id_usuario', me.miusuario.idusuario);
            formData.append('id_asignatura', localStorage.idasignatura);
            formData.append('periodo_id',localStorage.periodo_id)
            this.$http.post(this.$server_url+'curso_libro_docente', formData)
                .then(function (res) {
                    me.cursosDocente = res.data
                    if(me.archivos){
                        me.modalCursosArchivos = true
                    }else{
                         me.modalCursosEnvioLink = true
                    }
                })
                .catch(function (error) {})
        },
        verCalificaciones(item) {
            let me = this
            localStorage.codigo_calif = item.codigo
            localStorage.nombre_curso_calif = item.nombre
            localStorage.id_material_calif = me.data_material.idmaterial
            localStorage.nombre_material_calif = me.data_material.nombrematerial
            // me.$router.push('/calificaciones_materialapoyo')
            window.open('/calificaciones_materialapoyo', '_blank');
        },
        asignarCurso(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('id_material', me.data_material.idmaterial);
            this.$http.post(this.$server_url+'asignar_cursos_material', formData)
                .then(function (res) {
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    if(res.data.status == 1){
                        let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                        let h_idusuario = me.miusuario.idusuario;
                        let h_idgrupo = me.miusuario.id_group;
                        let h_idasignatura = localStorage.idasignatura
                        let h_nombreasignatura = localStorage.nombreasignatura
                        let h_recursotipo = 9; //9 = material
                        let datoHistorico = {
                            'user_nombre': me.miusuario.nombres,
                            'user_apellido': me.miusuario.apellidos,
                            'user_email': me.miusuario.email,
                            'user_cedula': me.miusuario.cedula,
                            'recurso_accion': 'asignar',
                            'recurso_tipo': 'material',
                            'recurso_nombre': me.nombrematerial,
                            'recurso_detalle': 'material asignado  al curso '+item.codigo,
                        }
                        me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                    }
                    me.getCursosDocente()
                })
                .catch(function (error) {})
        },
        //para asignar el curso con el archivo
        asignarCursoArchivo(item){
             let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('id_archivo', me.data_material.id_archivo);
            this.$http.post(this.$server_url+'asignar_cursos_archivos', formData)
                .then(function (res) {
                    me.getCursosDocente()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    if(res.data.status == 1){
                        let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                        let h_idusuario = me.miusuario.idusuario;
                        let h_idgrupo = me.miusuario.id_group;
                        let h_idasignatura = localStorage.idasignatura
                        let h_nombreasignatura = localStorage.nombreasignatura
                        let h_recursotipo = 9; //9 = material
                        let datoHistorico = {
                            'user_nombre': me.miusuario.nombres,
                            'user_apellido': me.miusuario.apellidos,
                            'user_email': me.miusuario.email,
                            'user_cedula': me.miusuario.cedula,
                            'recurso_accion': 'asignar',
                            'recurso_tipo': 'material',
                            'recurso_nombre': 'archivo: '+me.nombrematerial,
                            'recurso_detalle': 'asignar archivo al curso '+item.codigo,
                        }
                        me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                    }
                })
                .catch(function (error) {})
        },
        verMaterial(item) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 9; //9 = material
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'material',
                'recurso_nombre': item.nombrematerial,
                'recurso_detalle': 'material visto en el curso '+localStorage.codigo,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            if(me.usuario.id_group == 6 ){
                me.saveMaterialApoyo(item)
            }
            localStorage.url_material = item.webmaterial;
            window.open('/docente/material/digital','_blank')
            // this.$router.push('/docente/material/digital');
        },
        UnidadesTemasMaterialShow(item) {
            let me = this;
            me.temasMostrar = item;
            me.modalMaterialTemas = true;
        },
        saveMaterialApoyo(item){
            let me = this;
            let asignatura_id = localStorage.idasignatura
            let idusuario     = me.usuario.idusuario
            let url           = localStorage.url_material
            let actividad     = item.nombrematerial
            let periodo_id    = localStorage.periodo_id
            this.$http.get(this.$server_url+'conteoActividad?asignatura_id='+asignatura_id+'&idusuario='+idusuario+'&url='+url+'&actividad='+actividad+'&periodo_id='+periodo_id+'&pagina=0&tipo=2')
                .then(function (res) {
                    me.tipos = res.data.tipoArea
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
    }
}
</script>
