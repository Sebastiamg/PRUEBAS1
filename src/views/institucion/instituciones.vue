<template>
<div>
    <vx-card>
        <div v-if="verPermisosExternos == 0">
            <vs-tabs>
                <vs-tab label="Mis Instituciones" v-if="usuario.id_group == 11">
                    <escuelasAsesorVue />
                </vs-tab>
                <vs-tab label="Instituciones Prolipa">
                    <div class="con-tab-ejemplo">
                        <br>
                        <div v-if="permisoRoot" style="margin-bottom:10px;">
                            <vs-checkbox v-model="buscarPorTipoActivo" color="warning">Buscar por tipo de institución</vs-checkbox>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;align-items:center;">
                            <div style="width:65%;display:flex;" v-if="!buscarPorTipoActivo">
                                <div style="width:80%;">
                                    <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
                                </div>
                                <div style="width:20%;margin-left:10px;">
                                    <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
                                </div>
                            </div>
                            <div style="width:65%;display:flex;align-items:center;" v-else>
                                <div style="width:80%;">
                                    <v-select placeholder="Seleccione un tipo de institución" class="w-full" :options="tiposInstitucionLista" :reduce="item => item.id" label="descripcion" v-model="tipoInstitucionSeleccionado" />
                                </div>
                                <div style="width:20%;margin-left:10px;">
                                    <vs-button radius color="warning" @click="getInstitucionPorTipo()" type="filled" icon="search"></vs-button>
                                </div>
                            </div>
                            <div style="width:35%;display:flex;justify-content:flex-end;gap:10px;">
                                <vs-button v-if="user_autorizado == 1" color="primary" type="border" @click="institucion_id = 0; popupAddInstitucion = true;" icon-pack="feather" icon="icon-plus">Agregar</vs-button>
                                <vs-button v-if="user_autorizado == 1" color="success" type="border" @click="reporteInstituciones()" icon-pack="feather" icon="icon-file-text">Reporte Instituciones</vs-button>
                            </div>
                        </div>
                        <br>
                        <vs-table stripe max-items="50" search pagination :data="institucionesFiltradas">
                            <template slot="header">
                                <div class="vx-row" style="align-items:center;">
                                    <div class="vx-col m-3">
                                        Cantidad: {{ institucionesFiltradas.length }}
                                    </div>
                                    <div class="vx-col m-3" style="min-width:220px;" v-if="provinciasDisponibles.length > 0">
                                        <v-select placeholder="Filtrar por provincia" class="w-full" :options="provinciasDisponibles" v-model="filtroProvincia" />
                                    </div>
                                    <div class="vx-col m-3" style="min-width:220px;" v-if="filtroProvincia && ciudadesDisponibles.length > 0">
                                        <v-select placeholder="Filtrar por ciudad" class="w-full" :options="ciudadesDisponibles" v-model="filtroCiudad" />
                                    </div>
                                </div>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="idInstitucion">#</vs-th>
                                <vs-th sort-key="nombreInstitucion">Institución (asesores)</vs-th>
                                <vs-th sort-key="region">Localidad</vs-th>
                                <!-- <vs-th sort-key="nombre">Periodo</vs-th> -->
                                <!-- <vs-th sort-key="visitas">Cod. facturación</vs-th> -->
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].idInstitucion">
                                        {{ data[indextr].idInstitucion }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].nombreInstitucion">
                                        {{ data[indextr].nombreInstitucion }}<br>
                                        <p class="text-sm"> Lat: {{ tr.latitud || 'N/A' }} | Long: {{ tr.longitud || 'N/A' }} </p>
                                        <p v-if="data[indextr].codigo_amie == null"> <b>Código AMIE:</b> No registrado</p>
                                        <p v-else> <b>Código AMIE:</b> {{tr.codigo_amie}}</p>
                                        <p> <b>Tipo institución:</b> {{tr.tipoInstitucion}}</p>
                                        <p> <b>Sostenimiento:</b> {{tr.tipo_descripcion}}</p>
                                        <p> <b>Ruc:</b> {{ data[indextr].ruc || 'N/A' }} </p>
                                        <p><b> {{ data[indextr].maximo_porcentaje_autorizado }}%</b> </p>
                                        <p v-if="data[indextr].ifcodigoEvaluacion == 1"> <small><i class="text-primary">código para evaluaciones </i> </small> </p>
                                        <div v-if="data[indextr].nombre_asesor == null && data[indextr].apellido_asesor == null">
                                            <small> <i style="color:red;">No existe asesor </i></small><br>
                                        </div>
                                        <div v-else>
                                            <small> <i>{{ data[indextr].nombre_asesor }}
                                                    {{ data[indextr].apellido_asesor }} </i></small><br>
                                        </div>
                                        <small>{{ data[indextr].fecha_registro }} </small><br>
                                        <p v-if="tr.punto_venta == '1'" class="font-bold text-white"><i class="bg-warning pl-2 pr-2">Punto de venta </i> </p>
                                        <vs-chip v-if="tr.estadoInstitucion == 1" color="success">{{ tr.estado
                                                }}</vs-chip>
                                        <vs-chip v-else>{{ tr.estado }}</vs-chip>
                                    </vs-td>
                                    <vs-td :data="data[indextr].nombreregion">
                                        {{ data[indextr].nombreregion }} <br>
                                        <small v-if="data[indextr].nombreprovincia">
                                            <b>Provincia:</b> {{ data[indextr].nombreprovincia }}<br>
                                        </small>
                                        <small v-if="data[indextr].ciudad">
                                            <b>Ciudad:</b> {{ data[indextr].ciudad }}<br>
                                        </small>
                                        <small v-if="data[indextr].parr_nombre">
                                            <b>Parroquia:</b> {{ data[indextr].parr_nombre }}<br>
                                        </small>
                                        {{ data[indextr].periodo }} <br>
                                        <small v-if="tr.statusPeriodo == 1" class="text-success font-bold">{{
                                                tr.estadoPeriodo }}</small>
                                        <small v-else>{{ tr.estadoPeriodo }}</small>
                                    </vs-td>
                                    <!-- <vs-td :data="data[indextr].periodo">
                                  </vs-td> -->
                                    <!-- <vs-td>
                                      <p> {{ tr.codigo_institucion_milton }} </p>
                                      <small class="text-warning" v-if="tr.codigo_institucion_milton == 22507">Hay que cambiar</small>
                                  </vs-td> -->
                                    <vs-td :data="tr.idInstitucion">
                                        <vs-dropdown vs-custom-content vs-trigger-click>
                                            <vs-button type="relief" class="a-icon">
                                                Opciones
                                                <vs-icon class="" icon="expand_more"></vs-icon>
                                            </vs-button>
                                            <vs-dropdown-menu class="loginx">
                                                <vs-dropdown-item v-if="usuario.id_group == '1' || usuario.id_group == '11'" style="width:280px" @click="irFormularioDocente(tr)">
                                                    <span class="feather icon icon-link"></span> <small class="text-success ml-1" style="font-size:13px;">Solicitudes de libros</small>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="permisoRoot || usuario.id_group == '11'" style="width:280px" @click="sendInstitucion = tr; getPeriodosActivar();">
                                                    <span class="feather icon icon-link"></span> <small class="text-primary ml-1" style="font-size:13px;">Activar a
                                                        período actual</small>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="permisoRoot == true" style="width:280px" @click="periodos(tr)">
                                                    <span class="feather icon icon-crop"></span> Ver periodos
                                                </vs-dropdown-item>
                                                <vs-dropdown-item style="width:280px" @click="getTipoVenta(tr)">
                                                    <span class="feather icon icon-shopping-cart"></span> Ver
                                                    detalle de venta
                                                </vs-dropdown-item>
                                                <vs-dropdown-item style="width:280px" @click="institucion_id = tr.idInstitucion; popupAddInstitucion = true;">
                                                    <span class="feather icon icon-edit"></span> Editar
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="permisoRoot == true" style="width:280px" @click="agregarLibro(tr.idInstitucion)">
                                                    <span class="feather icon icon-gift"></span> Asignar libros
                                                    gratis
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="permisoRoot == true" style="width:280px" @click="agregarLibrerias(tr.idInstitucion)">
                                                    <span class="feather icon icon-home"></span> Asignar librerias
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="tr.punto_venta == 1" style="width:280px" @click="AbrirPopupSucursales(tr)">
                                                    <span class="feather icon icon-truck"></span> Sucursales
                                                </vs-dropdown-item>
                                                <vs-dropdown-item style="width:280px" @click="institucionSelected = tr; f_verUsuarios()">
                                                    <span class="feather icon icon-users"></span> Lista de usuarios
                                                </vs-dropdown-item>
                                                <!-- <vs-dropdown-item style="width:280px" @click="institucionSelected = tr; verDocentes(tr)">
                                                    <span class="feather icon icon-users"></span> Lista de docentes
                                                </vs-dropdown-item>
                                                <vs-dropdown-item style="width:280px" @click="verEstudiantes(tr)">
                                                    <span class="feather icon icon-user"></span> Lista de
                                                    Estudiantes
                                                </vs-dropdown-item> -->
                                                <vs-dropdown-item style="width:280px" @click="institucionSelected = tr;sendInstitucion=tr; verDocentesVisitas(tr)">
                                                    <span class="feather icon icon-filter"></span> Visitas de
                                                    docentes (Período)
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="permisoRoot == true" style="width:280px" @click="confirmEliminarInstitucion(tr)">
                                                    <span class="feather icon icon-trash"></span> Eliminar
                                                    institucion
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="(permisoRoot && tr.aplica_matricula == 1)" style="width:280px" @click="verMatricula(tr)">
                                                    <span class="feather icon icon-bookmark"></span> Estado
                                                    matricula
                                                </vs-dropdown-item>
                                                <vs-dropdown-item style="width:280px" @click="generateEnlaceEstudiante(tr)">
                                                    <span class="feather icon icon-link"></span> Enlace estudiantes
                                                </vs-dropdown-item>
                                                <!-- <vs-dropdown-item style="width:280px" @click="sendInstitucion=tr;registroDocentes(tr)">
                                                  <span class="feather icon icon-user"></span> Registro de docentes
                                              </vs-dropdown-item> -->
                                                <vs-dropdown-item style="width:280px" @click="imprimirCodigosEstudiante(tr)">
                                                    <span class="feather icon icon-user"></span>Exportar Códigos de
                                                    estudiantes
                                                </vs-dropdown-item>
                                                <vs-dropdown-item v-if="permisoRoot && tr.cantidad_cambio_ventana_evaluacion > 0" style="width:280px" @click="institucionSelected = tr; getEvaluacionesInstitucion(tr)">
                                                    <span class="feather icon icon-user"></span>Reiniciar
                                                    Evaluaciones
                                                </vs-dropdown-item>
                                                <vs-dropdown-item style="width:280px" @click="datosInstitucion = tr; popupLibrosInstitucion = true;">
                                                    <span class="feather icon icon-book"></span>Libreria Digital
                                                </vs-dropdown-item>
                                            </vs-dropdown-menu>
                                        </vs-dropdown>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-tab>
                <vs-tab label="Instituciones Facturación" v-if="permisoRoot">
                    <institucionfacturacion />
                </vs-tab>
                <vs-tab label="Periodos" v-if="permisoRoot">
                    <div class="con-tab-ejemplo">
                        <Periodos></Periodos>
                    </div>
                </vs-tab>
                <vs-tab label="Instituciones por ciudades">
                    <InstitucionesXCiudad />
                </vs-tab>
                <vs-tab label="Ciudades" v-if="permisoRoot">
                    <Ciudades_vue />
                </vs-tab>
                <vs-tab label="Zonas" v-if="permisoRoot">
                    <Zonas_vue />
                </vs-tab>
                <!-- <vs-tab label="Contratos Facturacion" v-if="permisoRoot">
                        <listadoContratoMiltonVue />
                    </vs-tab> -->
                <vs-tab label="Periodos bodega" v-if="permisoRoot">
                    <Periodo_config_institucion />
                </vs-tab>
                <vs-tab label="Instituciones períodos" v-if="user_autorizado == 1">
                    <Periodo_institucion />
                </vs-tab>
                <vs-tab label="Tipos Institución" v-if="permisoRoot">
                    <tipoInstitucionVue />
                </vs-tab>
            </vs-tabs>
        </div>
        <div v-if="verPermisosExternos == 2">
            <vs-button size="small" color="warning" @click="verPermisosExternos = 0;" type="filled" icon="reply">Volver a
                instituciones</vs-button>
            <GenerarFormulario class="mt-3" :formularioInstitucion="formulario.institucion" :formularioNombreInstitucion="formulario.nombreInstitucion" :formularioPeriodo="formulario.periodoDescripcion" :formularioPeriodo_id="formulario.periodo_id" />
        </div>
    </vx-card>
    <!-- =====MODALES=======-->
    <!--Modal para periodos-->
    <vs-popup class="holamundo" fullscreen title="Periodos de la institucion" :active.sync="popupPeriodos">
        <vx-card>
            <h4>
                {{ nombreInstitucion }}
            </h4>
            <!-- <vs-button  v-if="estadoLimiteAcceso =='1' || usuario.id_group== '1'"  type="border" color="success" class="m-2" @click="abrirModal();">Agregar periodo</vs-button> -->
            <vs-button v-if="permisoRoot == true" type="border" color="success" class="m-2" @click="abrirModal();">
                Agregar periodo
            </vs-button>
            <vs-table max-items="20" search pagination :data="listaPeriodosInstitucion" class="mt-4">
                <template slot="header">
                    <div>
                        Cantidad: {{ listaPeriodosInstitucion.length }}
                    </div>
                </template>
                <template slot="thead">
                    <vs-th width="40%">Periodo escolar</vs-th>
                    <vs-th>Región</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Actualizado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="tr.periodoescolar">
                            {{ tr.periodoescolar }} <br>
                            <small> {{ tr.descripcion }} </small>
                        </vs-td>
                        <vs-td>
                            <vs-chip> {{ tr.nombreregion }}</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.estado == 1" color="success"> Activo</vs-chip>
                            <vs-chip v-if="tr.estado == 0" color="danger"> Inactivo</vs-chip>
                        </vs-td>
                        <vs-td>
                            {{ tr.updated_at }}
                        </vs-td>
                        <vs-td>
                            <vx-tooltip text="eliminar periodo de esta institución" position="top" color="danger" v-if="usuario.id_group == '1'">
                                <vs-button type="border" color="danger" class="m-2" icon-pack="feather" icon="icon-trash" @click="confirmaEliminar(tr);"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </vs-popup>
    <vs-popup title="Periodos" fullscreen :active.sync="modalPeriodos">
        <vs-table max-items="10" search pagination :data="listaPeriodos">
            <template slot="header">
                <vs-radio class="mb-3 m-2" color="success" v-model="f_periodos" @change="filtroPeriodos" vs-value="1">Activos</vs-radio>
                <vs-radio class="mb-3 m-2" color="danger" v-model="f_periodos" @change="filtroPeriodos" vs-value="0">Inactivos</vs-radio>
            </template>
            <template slot="thead">
                <vs-th>Periodo escolar</vs-th>
                <vs-th>Fechas</vs-th>
                <vs-th>Region</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.periodoescolar">
                        {{ tr.periodoescolar }} <br>
                        <small>{{ tr.descripcion }}</small>
                    </vs-td>
                    <vs-td>
                        <small>Inicio: {{ tr.fecha_inicial }} </small><br>
                        <small>Fin: {{ tr.fecha_final }}</small>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.region_idregion == 1"> SIERRA</vs-chip>
                        <vs-chip v-if="tr.region_idregion == 2"> COSTA</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.estado == 1" color="success"> Activo</vs-chip>
                        <vs-chip v-if="tr.estado == 0" color="danger"> Inactivo</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-button type="filled" size="small" color="success" class="m-2" icon-pack="feather" icon="icon-plus" @click="verificarPeriodo(tr);">Agregar</vs-button>

                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vs-popup>
    <!--FIN DE MODALES DE PERIODOS -->
    <!--Modal para Editar Institucion-->
    <vs-popup title="Mantenimiento Institución" fullscreen :active.sync="popupAddInstitucion">
        <addInstitucionVue v-if="popupAddInstitucion" :id="institucion_id" @rechargeInstitucion="rechargeInstitucion" />
    </vs-popup>
    <!--FIN de modal para editar institucion -->
    <!--Modal para registro y edicion de sucursales instituciones-->
    <vs-popup :title="`Mantenimiento Sucursal: ${ObjInstitucion_Sucursal.nombreInstitucion}`" fullscreen :active.sync="popupGeneralSucursalesInstitucion">
        <vx-card fixed-height="true">
            <vs-row vs-justify="flex-start">
                <vs-button type="border" color="success" class="mr-2" @click="getNuevaSucursalesInstitucion()">Agregar Nueva
                    Sucursal</vs-button>
            </vs-row>
            <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
            <vs-table max-items="10" pagination search :data="SucursalesInstitucion">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ SucursalesInstitucion.length }}</b></vs-chip>
                </template>
                <!-- {{cliCi}} -->
                <template slot="thead">
                    <vs-th width="50">
                        Id
                    </vs-th>
                    <vs-th colspan="1" width="400">
                        Nombre
                    </vs-th>
                    <vs-th colspan="1" width="500">
                        Información
                    </vs-th>
                    <vs-th colspan="1" width="500">
                        Dirección
                    </vs-th>
                    <vs-th width="150">Estado</vs-th>
                    <vs-th width="300">
                        Acciones
                    </vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].isuc_id">
                            {{ data[indextr].isuc_id }}
                        </vs-td>
                        <vs-td>
                            <!-- {{ tr }} -->
                            {{ tr.isuc_nombre }} <br>
                        </vs-td>
                        <vs-td>
                            <span class="font-bold">RUC: </span>
                            <span>{{ tr.isuc_ruc }} </span>
                            <br>
                            <span class="font-bold">Teléfono: </span>
                            <span>{{ tr.isuc_telefono }} </span>
                            <br>
                            <span class="font-bold">Correo: </span>
                            <span>{{ tr.isuc_correo }} </span>
                        </vs-td>
                        <vs-td>
                            <span>{{ tr.isuc_direccion }} </span>
                        </vs-td>
                        <vs-td>
                            <vs-chip v-if="tr.isuc_estado == 1" color="success">Activo</vs-chip>
                            <vs-chip v-else color="danger">Inactivo</vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].isuc_id">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditarSucursalesInstitucion(tr)" title="Editar"></vs-button>
                            <vs-button v-if="tr.isuc_estado == 1" type="border" size="small" icon-pack="feather" icon="icon-target" class="mr-2 inline" color="warning" @click="getPreguntaDesactivarSucursalesInstitucion(tr)" title="Desactivar"></vs-button>
                            <vs-button v-if="tr.isuc_estado == 0" type="border" size="small" icon-pack="feather" icon="icon-target" class="mr-2 inline" color="warning" @click="getPreguntaDesactivarSucursalesInstitucion(tr)" title="Activar"></vs-button>
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminarSucursalesInstitucion(tr)" title="Eliminar"></vs-button>
                            <!-- <vs-button color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button> -->
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <!-- SECCION REGISTRO -->
            <vs-popup class="crearSucursalesInstitucion" :title="`Registro nueva Sucursal para: ${ObjInstitucion_Sucursal.nombreInstitucion}`" :active.sync="popupActivoGuardarSucursalesInstitucion">
                <vs-row>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información
                            Nueva Sucursal</b></vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_nombre" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="RUC" placeholder="RUC" type="number" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_ruc" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Correo " placeholder="Correo" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_correo" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Teléfono " type="number" placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_telefono" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <br>
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-textarea label="Dirección " placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_direccion" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="guardarnuevaSucursalesInstitucion()" type="relief">Guardar</vs-button>&emsp;
                    <vs-button @click="getCancelarNuevaSucursalesInstitucion()" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-popup>
            <vs-popup class="editarSucursalesInstitucion" :title="`Edición Sucursal: ${tabSucursalesInstitucion.isuc_nombre}`" :active.sync="popupActivoEditarSucursalesInstitucion">
                <!-- {{tabSucursalesInstitucion}} -->
                <vs-row>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información
                            Sucursal a Editar</b></vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_nombre" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="RUC" placeholder="RUC" type="number" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_ruc" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Correo " placeholder="Correo" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_correo" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Teléfono " type="number" placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_telefono" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <br>
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-textarea label="Dirección " placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabSucursalesInstitucion.isuc_direccion" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="editarSucursalesInstitucion()" type="relief">Editar</vs-button>&emsp;
                    <vs-button @click="getCancelarNuevaSucursalesInstitucion()" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-popup>
            <vs-popup class="eliminarSucursalesInstitucion" :title="`¿Confirma que desea eliminar el registro: ${isuc_nombre}?`" :active.sync="popupActivoEliminarSucursalesInstitucion">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                    <vs-button @click="getEliminarSucursalesInstitucion()" type="relief">Aceptar</vs-button>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                    <vs-button @click="getCancelarNuevaSucursalesInstitucion()" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-popup>
            <vs-popup class="desactivarSucursalesInstitucion" :title="`¿Confirma que desea cambiar el estado de la Sucursal: ${tabSucursalesInstitucion.isuc_nombre}?`" :active.sync="popup_desactivar_SucursalesInstitucion">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                    <vs-button @click="desactivar_activar_SucursalesInstitucion()" type="relief">Aceptar</vs-button>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                    <vs-button @click="getCancelarNuevaSucursalesInstitucion()" color="danger" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-popup>
        </vx-card>
    </vs-popup>
    <!--FIN de modal para registro y edicion de sucursales instituciones -->
    <!-- Modal para lista de docentes -->
    <!-- <vs-popup title="Lista usuarios" fullscreen :active.sync="popupDocentes" class="popupPadre">
        <vx-card v-if="popupDocentes">
            <label>Institución : </label>
            <h4> {{ institucionDocente.nombreInstitucion }} - {{ institucionSelected.periodo }} </h4>
            <vs-tabs class="mt-4" alignment="fixed">
                <vs-tab label="Docentes" @click="colorx = '#0000FF'">
                    <div v-if="usuarios.length > 0">
                        <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="usuarios">
                            <template slot="header">
                                <vs-button color="warning" size="small" class="mr-5" style="font-size: 14px;" @click="activePrompt = true; popupDocentes = false;">Exportar</vs-button>
                                <div> Cantidad de usuarios: &nbsp; <b>{{ usuarios.length }}</b> </div>
                                <vs-row v-if="visitasD == true">
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                                        <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1" style="display: inline-block;width: 100%;" />
                                    </vs-col>
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
                                        <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
                                    </vs-col>
                                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1">

                                        <vs-button radius @click="getUsuariosTipoVisitas()" color="success" type="gradient" icon="search"></vs-button>
                                    </vs-col>

                                </vs-row>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="cedula">Usuario</vs-th>
                                <vs-th sort-key="nombres">Nombre</vs-th>
                                <vs-th sort-key="nombres">Visitas</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].cedula">
                                        id: {{ data[indextr].idusuario }}
                                        <p>
                                            <span v-if="tipo == 'docente'"><b><small>usuario:</small></b>
                                                {{ data[indextr].name_usuario }}</span>
                                        </p>
                                        <p>
                                            <b>cedula:</b> {{ data[indextr].cedula }}
                                        </p>
                                        <p>
                                            <b><small>email: </small></b> {{ data[indextr].email }}
                                        </p>
                                        <b><small>actualizado: </small></b>{{ tr.updated_at || fechaLarga }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].nombres">
                                        {{ data[indextr].nombres }}
                                        {{ data[indextr].apellidos }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].visitas">
                                        {{ data[indextr].visitas }}
                                    </vs-td>
                                    <vs-td>
                                        <vx-tooltip v-if="perfil_autorizado == 1 || perfil_autorizado == 11" style="display: inline-block;" text="Asignar libros" position="top" color="success">
                                            <span v-if="tipo == 'docente'">
                                                <vs-button size="small" icon-pack="feather" icon="icon-zap" class="m-2" color="success" @click="popupDocentes = false; irAsignacion(tr);">Asignar
                                                    libros</vs-button>
                                            </span>
                                        </vx-tooltip>
                                        <vs-button size="small" class="m-2" @click="userSelected = tr; popupEditarUsuario = true;">📝Editar</vs-button>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else class="m-4 p-5">
                        No hay usuarios registrados en esta institución.
                    </div>
                </vs-tab>
                <vs-tab label="Asignaturas por docente" @click="colorx = '#FFA500'">
                    <Asignaturas_x_docente_Vue :institucionSelected="institucionSelected" />
                </vs-tab>
                <vs-tab label="Reporte agrupado por períodos" @click="colorx = '#FFA500'">
                    <InstitucionesReporteVisitasUsuariosVue :institucionSelected="institucionSelected" />
                </vs-tab>
                <vs-tab label="Autoridades" @click="colorx = '#FFA500'">
                    <institucionesAutoridadesVue :institucionSelected="institucionSelected.idInstitucion" :nombreInstitucion="sendInstitucion.nombreInstitucion" />
                </vs-tab>
            </vs-tabs>
        </vx-card>
    </vs-popup> -->
    <!-- Modal para Asignacion de libros al docente-->
    <!-- <vs-popup title="Asignación" fullscreen :active.sync="popupAsignacion">
        <vx-card>
            <vs-button icon="home" class="close btn" style="width:210px;" @click="closeBtn($event)">Regresar al
                listado</vs-button>
            <br />
            <div class="m-2">
                <vs-list>
                    <vs-list-item v-if="show_inst == 'si'" title="Institución" :subtitle="user_institucion.nombreInstitucion"></vs-list-item>
                    <vs-list-item v-if="institucionSelected.periodo_id > 0" title="Período" :subtitle="institucionSelected.periodo">
                        <vs-chip v-if="institucionSelected.statusPeriodo == '1'" color="success">Activo</vs-chip>
                        <vs-chip v-else color="danger">Desactivado</vs-chip>
                    </vs-list-item>
                    <vs-list-item title="Nombre" :subtitle="user_nombre"></vs-list-item>
                    <vs-list-item title="Email" :subtitle="user_email"></vs-list-item>
                </vs-list>
                <vs-divider color="success">Areas seleccionadas ( {{ seleccionadas.length }} ) </vs-divider>
                <vs-collapse>
                    <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
                        <div slot="header">
                            Ver ( {{ seleccionadas.length }} )
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-full text-right" v-if="seleccionadas.length > 1">
                                <vs-button type="border" color="danger" size="small" @click="confirmaQuitar()">Quitar todas
                                    <span class="feather icon icon-trash"></span></vs-button>
                                <vs-button type="filled" color="primary" size="small" @click="moverPeriodoActual()" class="ml-2">Mover a período actual<span class="feather icon icon-check"></span></vs-button>
                            </div>
                            <div class="vx-col sm:w-full mt-2">
                                <div v-for="(item, index) in seleccionadas" :key="index" class="m-1 p-1 asig-select text-dark">
                                    {{ item.nombreasignatura }} ( {{ item.periodoescolar }} )&nbsp; &nbsp;
                                    <vs-button @click="eliminaAsignacion(item)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
            <div class="m-2">
                <vs-divider color=primary> Areas ( {{ area.length }} ) </vs-divider>
                <vs-collapse>
                    <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down" v-for="(listItem, index) in area" :key="index" :title="listItem.name">
                        <div slot="header">
                            {{ listItem.name }}
                        </div>
                        <vs-button v-for="(listIAsig, indexAsig) in listItem.children" :key="indexAsig" type="border" color="primary" class="p-2 m-1" @click="agregaAsignacion(listIAsig)">
                            {{ listIAsig.name }}
                        </vs-button>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
        </vx-card>
    </vs-popup> -->

    <!--Modales-->
    <!----modal exportar--------->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-button radius color="warning" @click="popupDocentes = true" type="gradient" icon="reply"></vs-button>
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        <div class="flex">
            <!--<span class="mr-4">Cell Auto Width:</span>
                <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
        </div>
    </vs-prompt>
    <!--MODAL PARA REGISTRO DE DOCENTE LIBROS-->
    <vs-popup title="Asignacion" fullscreen :active.sync="popupAsignacionDocentes">
        <RegistroDocentesVue :sendInstitucion="sendInstitucion" v-if="popupAsignacionDocentes" />
    </vs-popup>
    <!--MODAL DETALLE DE VENTA-->
    <vs-popup :title="tituloDetalleVenta" fullscreen :active.sync="popupTipoVenta">
        <RegistroVentaVue :pedido="pedido" v-if="popupTipoVenta" showAgrupado="1" />
    </vs-popup>

    <!----Fin modal mostrar coincidencias--------->
    <!--MODAL PARA CAMBIAR DE PERIODO-->
    <vs-popup classContent="popup-example" title="Actualizar a periodo actual" :active.sync="popupActualizarPeriodo">
        <vx-card v-if="popupActualizarPeriodo">
            <p><b>Insitución:</b> {{ sendInstitucion.nombreInstitucion }} </p>
            <p class="font-bold text-2xl text-warning mt-2">Estas seguro de cambiar al periodo {{
                    periodoSelect[0].periodoescolar }}?</p>
            <div class="flex justify-center mt-2">
                <vs-button class="mr-3 mb-2" @click="changePeriodo()">Si, deseo cambiar</vs-button>
                <vs-button color="warning" type="border" class="mb-2" @click="popupActualizarPeriodo = false;">Cancelar</vs-button>
            </div>
        </vx-card>
    </vs-popup>
    <!--modal de evaluaciones institucion resetar-->
    <vs-popup classContent="popup-example" title="Resetar Evaluaciones Instituciones" :active.sync="popupEvaluaciones">
        <ResetearEvaluacionesVue v-if="popupEvaluaciones" @changeEvaluacion="changeEvaluacion" :institucionSelected="institucionSelected" :arrayEvaluacionesInstitucion="arrayEvaluacionesInstitucion" />
    </vs-popup>
    <!--modal libros de instituciones-->
    <vs-popup fullscreen :title="'Libros de Institucion' + ' ' + datosInstitucion.nombreInstitucion" :active.sync="popupLibrosInstitucion">
        <!-- {{datosInstitucion}} -->
        <LibrosInstitucion v-if="popupLibrosInstitucion" :datosInstitucion="datosInstitucion" />
    </vs-popup>
    <!-- SECCION REPORTE INSTITUCION -->
    <vs-popup class="informacionformhijo" fullscreen title="Reporte Instituciones" :active.sync="popupReporteInstituciones">
        <ReporteInstituciones v-if="popupReporteInstituciones" @change="changeHandleReporteInstituciones" />
    </vs-popup>
    <!--SECCION EDITAR USUARIO-->
    <vs-popup class="informacionformhijo" title="Edición Usuario" fullscreen :active.sync="popupEditarUsuario">
      <div v-if="popupEditarUsuario">
        <editarUsuarioVue
          :usuarios="{
            idusuario: userSelected.idusuario,
            cedula: userSelected.cedula
          }"
          @saveChange="getUsuariosTipo"
        />
      </div>
    </vs-popup>
    <!--MODAL PARA MOSTRAR USUARIOS-->
    <vs-popup title="Usuarios" fullscreen :active.sync="popupMostrarUsuarios" class="popupPadre">
        <div v-if="popupMostrarUsuarios">
            <vx-card class="mb-5" style="border-left: 6px solid rgb(115, 103, 240); box-shadow: 0 4px 20px 0 rgba(0,0,0,0.05);">
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="background: linear-gradient(135deg, rgb(115, 103, 240) 0%, rgb(158, 149, 245) 100%); border-radius: 10px; padding: 12px; display: flex; align-items: center; justify-content: center; color: white;">
                            <vs-icon icon="domain" size="medium"></vs-icon>
                        </div>
                        <div>
                            <h3 class="font-bold mb-1" style="color: #2c2c2c; font-size: 1.4rem;">
                                {{ institucionSelected.nombreInstitucion }}
                            </h3>
                            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 13px; color: #626262;">
                                <span style="display: flex; align-items: center;">
                                    <vs-icon icon="location_on" size="small" style="color: rgb(115, 103, 240); margin-right: 4px;"></vs-icon>
                                    {{ institucionSelected.ciudad || 'Sin Ciudad' }}
                                </span>
                                <span style="color: #b4b4b4;">|</span>
                                <span style="display: flex; align-items: center;">
                                    <vs-icon icon="person" size="small" style="color: #ff9f43; margin-right: 4px;"></vs-icon>
                                    Asesor: {{ institucionSelected.asesor || 'No asignado' }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="text-align: right;">
                            <span style="font-size: 11px; color: #b4b4b4; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; display: block;">Período Escolar</span>
                            <span style="font-size: 1.2rem; font-weight: bold; color: rgb(115, 103, 240); display: block; margin-top: 2px;">
                                {{ institucionSelected.periodo || 'N/A' }}
                            </span>
                        </div>
                        <vs-chip color="success" v-if="institucionSelected.statusPeriodo == '1'" style="font-weight: 600; font-size: 12px; padding: 6px 12px;">
                            {{ institucionSelected.estadoPeriodo || 'Activo' }}
                        </vs-chip>
                        <vs-chip color="danger" v-else style="font-weight: 600; font-size: 12px; padding: 6px 12px;">
                            {{ institucionSelected.estadoPeriodo || 'Inactivo' }}
                        </vs-chip>
                    </div>
                </div>
            </vx-card>
            <institucionesScreenUsuariosVue :institucionSelected="institucionSelected" />
        </div>
    </vs-popup>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import DataViewSidebar from './nuevo'
import Periodos from '../periodos/periodos.vue'
import vSelect from 'vue-select'
import escuelasAsesorVue from '../home/components/asesor/escuelasAsesor.vue'
// import listadoContratoMiltonVue from './components/listadoContratoMilton.vue'
import asignarLibrosVue from './components/asignarLibros.vue'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import asignarRecursosExternosVue from './components/asignarRecursosExternos.vue'
import GenerarFormulario from '../home/docentes/formulario/listadoSolicitudes.vue'
import 'flatpickr/dist/flatpickr.css'
import InstitucionesXCiudad from './institucionesXCiudad.vue'
import Ciudades_vue from '../ciudades/listaCiudad.vue'
import Zonas_vue from '../zonas/listaZona.vue'
import Periodo_config_institucion from '../periodos/periodo_config_institucion.vue'
import RegistroDocentesVue from './components/RegistroDocentes.vue'
import institucionfacturacion from '../pedidos/facturacion_api/institucion.vue';
import addInstitucionVue from './addInstitucion.vue'
import RegistroVentaVue from '../codigos/components/utils/RevisionVenta.vue'
import tipoInstitucionVue from './components/tipoInstitucion/tipoInstitucion.vue'
const ResetearEvaluacionesVue                 = () => import('./components/EvaluacionesInstituciones/ResetearEvaluaciones.vue')
const Periodo_institucion                     = () => import('./reportes/reporteperiodo.vue');
const LibrosInstitucion                       = () => import('./components/librosInstitucion.vue');
const Asignaturas_x_docente_Vue               = () => import('@/views/docentes/asignaturas_docente/asignaturas_x_docente.vue');
const InstitucionesReporteVisitasUsuariosVue  = () => import('./reportes/visitas/InstitucionesReporteVisitasUsuarios.vue');
const institucionesAutoridadesVue             = () => import('./reportes/autoridades/instituciones-autoridades.vue');
const ReporteInstituciones                    = () => import("@/views/institucion/reportes/reporte_instituciones_info.vue");
const editarUsuarioVue                        = () => import('../usuarios/tipos/components/editarUsuario.vue');
const institucionesScreenUsuariosVue          = () => import('./institucionesScreenUsuarios.vue')
export default {
    components: {
        DataViewSidebar,
        Periodos,
        "v-select": vSelect,
        escuelasAsesorVue,
        asignarLibrosVue,
        flatPickr,
        asignarRecursosExternosVue,
        GenerarFormulario,
        // listadoContratoMiltonVue,
        InstitucionesXCiudad,
        Ciudades_vue,
        Zonas_vue,
        Periodo_config_institucion,
        RegistroDocentesVue,
        institucionfacturacion,
        addInstitucionVue,
        RegistroVentaVue,
        ResetearEvaluacionesVue,
        Periodo_institucion,
        LibrosInstitucion,
        Asignaturas_x_docente_Vue,
        InstitucionesReporteVisitasUsuariosVue,
        institucionesAutoridadesVue,
        tipoInstitucionVue,
        ReporteInstituciones,
        editarUsuarioVue,
        institucionesScreenUsuariosVue
    },
    data() {
        return {
            institucion_id: 0,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            user_institucion_send: '',
            //variables para exportar a excel
            activePrompt: false,
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            reporteAsesorActivo: false,
            guardarActivo: '',
            generarActivo: '',
            textAlertCant: '',
            cantidad: '',
            codigoSelected: [],
            codigoTipo: '0',
            //FIN DE VARIABLES PARA EXPORTAR A EXCEL
            escuelas: [],
            popupVistasUsuario: false,
            popupAsignacion: false,
            popupDocentes: false,
            popupAddInstitucion: false,
            popupPeriodos: false,
            busquedaInstitucion: "",
            instituciones: [],
            filtroProvincia: '',
            filtroCiudad: '',
            tiposInstitucionLista: [],
            tipoInstitucionSeleccionado: '',
            buscarPorTipoActivo: false,
            tmpInstituciones: [],
            sidebarData: {},
            addNewDataSidebar: false,
            usuario: [],
            grupo_usuario: '',
            //para el total visitas de institucion
            visitasginstitucion: '',
            //para el total visitas de docentes
            visitasgdocente: '',
            //para el total visitas de estudiantes
            visitasgestudiantes: '',
            //para  llenar el historico por institucion
            historicoinstitucionArreglo: [],
            //para  llenar el historico para docentes
            historicoDocenteArreglo: [],
            //para llenar el historico de para estudiantes
            historicoEstudianteArreglo: [],
            //para guardar el nombre de la institucion en el localstorage
            visitasnombreinstitucion: '',
            user_autorizado: '',
            c_region: 'SIERRA',
            //=========VARIABLES PARA PERIODOS==============
            nombreInstitucion: '',
            idInstitucion: '',
            listaPeriodos: '',
            tmplistaPeriodos: '',
            listaPeriodosInstitucion: '',
            tmp: '',
            f_periodos: 1,
            modalPeriodos: false,
            id_eliminar: '',
            region: [],
            usuario: [],
            estadoLimiteAcceso: "0",
            fecha: null,
            //=========VARIABLES PARA EDITAR INSTITUCION=======
            institucion: {
                'idInstitucion': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'ciudad_id': '',
                'region_idregion': '',
                'estado': '1',
                'matricula': '1',
                'punto_venta': 0,
            },
            errors: {
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'ciudad_id': '',
                'region_idregion': '',
            },
            titulo: '',
            ciudad: [],
            region: [],
            periodo: [],
            vendedor: [],
            usuario: '',
            limiteMegas: 1,
            porcentaje: '',
            pesoArchivo: '',
            muyPesado: '',
            msj: '',
            //===========VARIABLE PARA MODAL DE LISTA DE DOCENTES=========
            usuarios: [],
            accesosDocentes: [],
            conteoDocentes: [{
                'idusuario': '',
                'cantidad': 0
            }],
            accesosEstudiantes: [],
            institucionDocente: '',
            tipo: '',
            conteo: 0,
            usuario: '',
            perfil_autorizado: '',
            //===========VARIABLES PARA MODAL DE ASIGNACION DE LIBROS========
            area: [],
            asignaturadocenteselect: [],
            seleccionadas: '',
            usuarioAsignacion: '',
            user_seleccionado: '',
            user_nombre: '',
            user_email: '',
            user_institucion: '',
            show_inst: '',
            //===========VARIABLES PARA EL MODAL DE VISTAS DE USUARIO=========
            docente: '',
            listaVisitas: [],
            datoU: '',
            //para el modal para agregar permisos
            update: false,
            asignatura_id: 0,
            colegio_asignatura_id: 0,
            permisoRoot: false,
            attachments: [],
            form: new FormData,
            numeroIteM: '0',
            instituciones: [],
            errorImage: '',
            tamanioError: '',
            archivoName: '',
            file: '',
            id: 0,
            fromDate: null,
            toDate: null,
            visitasD: false,
            //variables permisos externos
            verPermisosExternos: 0,
            permisosInstitucion: '',
            permisosNombreInstitucion: '',
            //fin variables permisos externos
            value1: '',
            value2: '',
            valid: {
                email: false,
                password: false,
            },
            //formulario docente
            formulario: {
                institucion: '0',
                periodo_id: 0,
                periodoDescripcion: '',
                nombreInstitucion: '',
            },
            //COINCIDENCIAS
            arregloCoincidencias: [],
            arregloIdsCoincidencias: [],
            popupCoincidencia: false,
            institucionEnviar: 0,
            institucionEnviarCedula: 0,
            institucionEnviarAIniciales: '',
            institucionNombreEnviar: '',
            institucionCiudad: '',
            busquedaMilton: '',
            //FIN COINCIDENCIAS
            //variables registro de docentes
            sendInstitucion: {},
            popupAsignacionDocentes: false,
            //fin variables registro de docentes
            arregloCodigosEstudiantes: [],
            //Variables detalle de venta
            popupTipoVenta: false,
            pedido: {},
            tituloDetalleVenta: '',
            //Fin Variables detalle de venta
            //variables para asignar el periodo actual
            popupActualizarPeriodo: false,
            periodoSelect: [],
            //fin variables para asignar el periodo actual,
            institucionSelected: 0,
            //variables para evaluaciones institucion
            arrayEvaluacionesInstitucion: [],
            popupEvaluaciones: false,
            //fin variables para evaluaciones institucion
            //inicio variables para sucursalesdirecciones
            tabSucursalesInstitucion: {
                isuc_id: '',
                isuc_idInstitucion: '',
                isuc_nombre: '',
                isuc_correo: '',
                isuc_telefono: '',
                isuc_ruc: '',
                isuc_direccion: '',
                isuc_estado: '',
            },
            isuc_id: 0,
            isuc_nombre: '',
            popupActivoGuardarSucursalesInstitucion: false,
            popupGeneralSucursalesInstitucion: false,
            popupActivoEditarSucursalesInstitucion: false,
            popupActivoEliminarSucursalesInstitucion: false,
            popup_desactivar_SucursalesInstitucion: false,
            SucursalesInstitucion: [],
            ObjInstitucion_Sucursal: '',
            //fin variables para sucursalesdirecciones
            //variables asignacion de libros institucion
            datosInstitucion: [],
            popupLibrosInstitucion: false,
            docenteTipo: false,
            //fin variables para asignacion de libros institucion
            popupReporteInstituciones: false,
            popupEditarUsuario: false,
            userSelected:'',
            //variables para mostrar usuarios
            popupMostrarUsuarios:false,
            //fin variables para mostrar usuarios
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('institucion')
        localStorage.removeItem('tipoUser')
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.user_autorizado = me.usuario.id_group;
        me.getUserRoot();
        me.getTiposInstitucion();
        const date = new Date()
        const primerDia = new Date(date.getFullYear(), date.getMonth(), 1)
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        me.fromDate = primerDia
        me.toDate = ultimoDia
    },
    computed: {
        provinciasDisponibles() {
            let provincias = this.instituciones
                .map(item => item.nombreprovincia)
                .filter(item => !!item);
            return [...new Set(provincias)].sort();
        },
        ciudadesDisponibles() {
            let me = this;
            let instituciones = me.instituciones;
            if (me.filtroProvincia) {
                instituciones = instituciones.filter(item => item.nombreprovincia == me.filtroProvincia);
            }
            let ciudades = instituciones
                .map(item => item.ciudad)
                .filter(item => !!item);
            return [...new Set(ciudades)].sort();
        },
        institucionesFiltradas() {
            let me = this;
            let instituciones = me.instituciones;
            if (me.filtroProvincia) {
                instituciones = instituciones.filter(item => item.nombreprovincia == me.filtroProvincia);
            }
            if (me.filtroCiudad) {
                instituciones = instituciones.filter(item => item.ciudad == me.filtroCiudad);
            }
            return instituciones;
        },
    },
    watch: {
        filtroProvincia() {
            this.filtroCiudad = '';
        },
        buscarPorTipoActivo(val) {
            if (!val) {
                this.tipoInstitucionSeleccionado = '';
            }
        },
    },
    methods: {
        //para ir al formulario docente
        irFormularioDocente(tr) {
            let me = this;
            localStorage.setItem('formulario', 'institucion')
            me.formulario.institucion = tr.idInstitucion;
            me.formulario.nombreInstitucion = tr.nombreInstitucion
            me.formulario.periodoDescripcion = tr.periodo
            me.formulario.periodo_id = tr.periodo_id
            me.verPermisosExternos = 2;
        },
        irGestionEncuestas(tr) {
            let me = this;
            localStorage.setItem('formulario', 'institucion')
            me.formulario.institucion = tr.idInstitucion;
            me.formulario.nombreInstitucion = tr.nombreInstitucion
            me.formulario.periodoDescripcion = tr.periodo
            me.formulario.periodo_id = tr.periodo_id
            me.verPermisosExternos = 3;
        },
        fieldChange(e) {
            let me = this;
            me.errorImage = 'no'
            me.tamanioError = "no"
            this.attachments = [];
            let selectedFiles = e.target.files;
            let validar = e.target.files[0].type;
            let tamanio = e.target.files[0].size;
            if (tamanio > 1000000) {
                me.tamanioError = "yes"
                me.$vs.notify({
                    text: 'El tamaño de la imagen excede 1MB',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            if (validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg') {
                me.file = e.target.files[0]
                for (let i = 0; i < selectedFiles.length; i++) {
                    this.attachments.push(selectedFiles[i]);
                    localStorage.setItem('nameArchivo', this.attachments[0].name)
                    me.archivoName = localStorage.getItem("nameArchivo")
                }
                me.errorImage = 'no'
            } else {
                me.errorImage = 'yes'
                me.$vs.notify({
                    text: 'Formato de imagen no aceptada solo se acepta png/jpg/jpeg',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
        },
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                .then(function (res) {
                    if (res.data.status == '1') {
                        me.permisoRoot = true
                    } else {
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        //PERMISOS EXTERNOS
        agregarPermisosExternos(data) {
            let me = this;
            me.verPermisosExternos = 1
            me.permisosInstitucion = data.idInstitucion
            me.permisosNombreInstitucion = data.nombreInstitucion
            return false
        },
        //FIN PERMISOS EXTERNOS
        closeBtn(event) {
            this.popupAsignacion = false;
            this.popupDocentes = true;
        },

        //para ir asignar recursos externos a prolipa
        irAddRecursosExternos(data = {}) {
            let me = this;
            localStorage.setItem('institucionExterna', data.idInstitucion)
            localStorage.setItem('ciudadExterna', data.ciudad)
            me.$router.push('/recursos/asignaturas');
        },
        addNewData() {
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },
        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },
        getInstitucion() {
            let me = this;
            me.instituciones = [];
            me.filtroProvincia = '';
            me.filtroCiudad = '';
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
            this.$http.get(this.$server_url + 'listaInsitucion?busqueda=' + me.busquedaInstitucion + '&todas=1')
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
                            icon: 'icon-user'
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        getTiposInstitucion() {
            let me = this;
            this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
                .then(function (res) {
                    me.tiposInstitucionLista = res.data.data || [];
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        getInstitucionPorTipo() {
            let me = this;
            if (!me.tipoInstitucionSeleccionado) {
                me.$vs.notify({
                    text: 'Seleccione un tipo de institución',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.instituciones = [];
            me.filtroProvincia = '';
            me.filtroCiudad = '';
            me.busquedaInstitucion = '';
            me.$vs.loading()
            this.$http.get(this.$server_url + 'listaInsitucion?tipo_institucion=' + me.tipoInstitucionSeleccionado + '&todas=1')
                .then(function (res) {
                    me.instituciones = res.data;
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        getPeriodoInstitucion(id) {
            let me = this;
            this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id=' + id)
                .then(function (res) {

                    localStorage.setItem('free_periodo_id', res.data[0].periodo)
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        agregarLibro(id) {
            localStorage.idinstitucion = id;
            this.getPeriodoInstitucion(id)
            this.$router.push('/institucion/addlibro');
        },

        agregarLibrerias(id) {
            localStorage.idinstitucion = id;
            this.$router.push('/institucion/librerias');
        },
        // verDocentes(item) {
        //     let me = this;
        //     me.usuarios = []
        //     me.popupDocentes = true;
        //     me.visitasD = false
        //     // console.log( item.idInstitucion )
        //     localStorage.institucion = JSON.stringify(item);
        //     localStorage.tipoUser = "docente";
        //     // me.$router.push('/institucion/docentes');

        //     localStorage.removeItem('datoUser')
        //     localStorage.removeItem('user_select')
        //     localStorage.removeItem('show_inst')
        //     me.usuario = JSON.parse(localStorage.getItem('usuario'));
        //     me.institucionDocente = JSON.parse(localStorage.getItem('institucion'))
        //     me.tipo = localStorage.getItem('tipoUser');
        //     me.perfil_autorizado = me.usuario.id_group;

        //     me.getUsuariosTipo();
        // },
        verDocentesVisitas(item) {
            let me = this;
            me.usuarios = []
            me.visitasD = true
            me.popupDocentes = true;
            // console.log( item.idInstitucion )
            localStorage.institucion = JSON.stringify(item);
            localStorage.tipoUser = "docente";
            // me.$router.push('/institucion/docentes');

            localStorage.removeItem('datoUser')
            localStorage.removeItem('user_select')
            localStorage.removeItem('show_inst')
            me.usuario = JSON.parse(localStorage.getItem('usuario'));
            me.institucionDocente = JSON.parse(localStorage.getItem('institucion'))
            me.tipo = localStorage.getItem('tipoUser');
            me.perfil_autorizado = me.usuario.id_group;

            me.getUsuariosTipoVisitas();
        },
        confirmEliminarInstitucion(tr) {
            let me = this;
            me.id = tr.idInstitucion
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar la institución',
                accept: this.eliminarInstitucion
            })
        },
        eliminarInstitucion() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.id)
            me.$vs.loading()
            this.$http.post(this.$server_url + 'institucionEliminar', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.getInstitucion();
                    me.$vs.notify({
                        text: 'Institución eliminada con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (e) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'No se pudo eliminar la institucion',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                });
        },
        verEstudiantes(item) {
            let me = this;
            me.popupDocentes = true;
            // console.log( item.idInstitucion )
            localStorage.tipoUser = "estudiante";
            localStorage.institucion = JSON.stringify(item);
            // me.$router.push('/institucion/estudiantes');
            localStorage.removeItem('datoUser')
            localStorage.removeItem('user_select')
            localStorage.removeItem('show_inst')
            me.usuario = JSON.parse(localStorage.getItem('usuario'));
            me.institucionDocente = JSON.parse(localStorage.getItem('institucion'))
            me.tipo = localStorage.getItem('tipoUser');
            me.perfil_autorizado = me.usuario.id_group;

            me.getUsuariosTipo();
        },
        getVisitas(item, nombreInstitucion) {

            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/historico-recursos?idinstitucion=' + item + '&_limit=-1')
                .then(res => {
                    // console.log(res.data.length)
                    // me.visitas = res.data.length;
                    //para guardar las intitucion en el localstorage
                    this.historicoinstitucionArreglo = res.data;
                    localStorage.setItem("historicoinstitucionArreglo", JSON.stringify(this.historicoinstitucionArreglo));

                    //para guardar el nombre de la institucion en localstorage

                    this.visitasnombreinstitucion = nombreInstitucion
                    localStorage.setItem("visitasnombreinstitucion", JSON.stringify(this.visitasnombreinstitucion));
                    //para enviar el id de la institucion
                    localStorage.setItem("visitasid", JSON.stringify(item));

                    //para guardar las visitas generales de la institucion
                    this.visitasginstitucion = res.data.length;
                    localStorage.setItem("visitasginstitucion", JSON.stringify(this.visitasginstitucion));

                    //     //para guardar en localstorage el historico de docentes
                    me.historicoDocenteArreglo = this.historicoinstitucionArreglo.filter(p => p.idgrupo == "6");
                    //    localStorage.setItem("historicoDocenteArreglo", JSON.stringify(this.historicoDocenteArreglo));

                    //para guardar las visitas generales de los docentes
                    this.visitasgdocente = me.historicoDocenteArreglo.length;
                    localStorage.setItem("visitasgdocente", JSON.stringify(this.visitasgdocente));

                    //     //para guardar en localstorage el historico de estudiantes
                    me.historicoEstudianteArreglo = this.historicoinstitucionArreglo.filter(p => p.idgrupo == "4");
                    //    localStorage.setItem("historicoEstudianteArreglo", JSON.stringify(this.historicoEstudianteArreglo));

                    //para guardar las visitas generales de los estudiantes
                    this.visitasgestudiantes = me.historicoEstudianteArreglo.length;
                    localStorage.setItem("visitasgestudiantes", JSON.stringify(this.visitasgestudiantes));

                    me.$router.push('/reporte/institucion/');

                })
                .catch(err => {
                    console.log(err)
                })
        },

        verMatricula(tr) {
            let me = this;
            localStorage.setItem('matricula_institucion', tr.idInstitucion)
            localStorage.setItem('matricula_admin', "yes")
            me.$router.push('/matricula/listado_matriculas')
        },
        periodos(item) {
            // localStorage.institucion = JSON.stringify(item);
            let me = this;
            me.popupPeriodos = true;
            let institucion = item;
            me.tmp = institucion;
            me.nombreInstitucion = me.tmp.nombreInstitucion;
            me.idInstitucion = me.tmp.idInstitucion;
            me.region = me.tmp.nombreregion;
            me.getPeriodosInstitucion();
            me.usuario = JSON.parse(localStorage.getItem('usuario'))

            me.getPeriodos();
            // this.$router.push('/institucion/periodosInstitucion');
        },

        async getSeguimiento(tr) {
            let me = this;
            this.$http.get(this.$server_url + 'escuelasAsesor?asesor_id=' + tr.asesor_id + '&desdeAdmin=yes' + '&institucion_id=' + tr.idInstitucion)
                .then(function (response) {
                    let periodo_id = response.data[0].periodo
                    let periodo_nombre = response.data[0].descripcion
                    me.$router.push('/administrador/seguimiento/institucion')
                    localStorage.setItem('institucion_seguimiento_asesor_id', tr.asesor_id)
                    localStorage.setItem('institucion_seguimiento_id', tr.idInstitucion)
                    localStorage.setItem('institucion_seguimiento_nombre', tr.nombreInstitucion)
                    localStorage.setItem('institucion_seguimiento_periodo_id', periodo_id)
                    localStorage.setItem('institucion_seguimiento_periodo', periodo_nombre)
                    localStorage.setItem('adminSeguimiento', "yes")
                })
                .catch(function (error) {})
        },

        //===========METODOS DE PERIODO===========================

        getPeriodosInstitucion() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'periodosXInstitucion/' + me.idInstitucion)
                .then(res => {
                    me.listaPeriodosInstitucion = res.data;
                    // console.log(res.data);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        getPeriodos() {
            let me = this;
            this.$http.get(this.$server_url + 'periodoRegion?region=' + me.region)
                .then(res => {
                    me.tmplistaPeriodos = res.data;
                    //capturo el periodo activo para limitar el acceso a agregar periodo
                    let filtrarPeriodoAcceso = me.tmplistaPeriodos.filter(p => p.estado == '1')
                    //capturo la fecha actual
                    var fecha = moment().add(-1, 'days').format('YYYY/MM/DD');

                    // filtro la fecha limite del periodo
                    let fechafinal = filtrarPeriodoAcceso.map(p => p.fhasta_limite)
                    //comparo si la fecha final ya se paso a la actual
                    if (Date.parse(fechafinal) < Date.parse(fecha)) {

                        me.estadoLimiteAcceso = "0";

                    } else {
                        me.estadoLimiteAcceso = "1";
                    }

                    me.filtroPeriodos();
                })
                .catch(err => {
                    console.log(err);
                })
        },

        abrirModal() {
            let me = this;
            me.popupPeriodos = false;
            me.modalPeriodos = true;
        },
        filtroPeriodos() {
            let me = this;
            // console.log(me.tmplistaPeriodos)
            me.listaPeriodos = [];
            for (let index = 0; index < me.tmplistaPeriodos.length; index++) {
                if (me.tmplistaPeriodos[index].estado == me.f_periodos) {
                    me.listaPeriodos.push(me.tmplistaPeriodos[index]);
                }
            }
        },
        verificarPeriodo(item) {
            let me = this;
            // console.log(item.idperiodoescolar, me.idInstitucion)
            me.$vs.loading();
            let data = new FormData();
            data.append('idperiodoescolar', item.idperiodoescolar);
            data.append('idinstitucion', me.idInstitucion)
            this.$http.post(this.$server_url + 'verifica_periodo', data)
                .then(res => {
                    // console.log(res.data)
                    if (res.data == 1) {
                        me.$vs.notify({
                            time: 8000,
                            text: 'Este periodo ya se encuentra asignado a la institucion ' + me.nombreInstitucion,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Periodo agregado correctamente a la institucion ' + me.nombreInstitucion,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.modalPeriodos = false;
                        me.getPeriodosInstitucion();
                    }
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        confirmaEliminar(item) {
            let me = this;
            me.id_eliminar = item.id;
            // console.log(me.id_eliminar)
            // return
            me.popupPeriodos = false;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Seguro desea eliminar este item?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarItem,
                cancel: me.close
            })
        },
        close() {
            let me = this;
            me.popupPeriodos = true;
            this.$vs.notify({
                color: 'danger',
                title: 'Cerrado',
                text: 'Has cerrado!'
            })
        },
        eliminarItem() {
            let me = this;
            this.$http.get(this.$server_url + 'eliminarPeriodosInstitucion/' + me.id_eliminar)
                .then(res => {
                    me.$vs.notify({
                        text: 'Periodo de esta institución eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getPeriodosInstitucion();
                })
                .catch(err => {
                    console.log(err);
                })
        },

        //===========FIN DE METODOS DE PERIODOS======================

        //===========METODOS PARA EDITAR INSTITUCION ===============

        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url + "ciudad").then(function (response) {
                me.ciudad = response.data;
                // console.log(me.ciudad);
            });
        },
        async getRegionSelect() {
            let me = this;
            this.$http.get(this.$server_url + "region").then(function (response) {
                me.region = response.data;
            });
        },
        async getPeriodoSelect() {
            let me = this;
            this.$http.get(this.$server_url + "periodo").then(function (response) {
                me.periodo = response.data;
            });
        },
        async getInstitucionEditar(idinstitucion) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "institucion/" + idinstitucion)
                .then(function (response) {
                    me.institucion = response.data;
                    if (me.institucion.tipo_institucion == 1) {
                        me.institucion.tipo_institucion = 'no'
                    } else {
                        me.institucion.tipo_institucion = 'si'
                    }
                    //llenar el radio matricula
                    if (me.institucion.aplica_matricula == 1) {
                        me.institucion.matricula = '1'
                    } else {
                        me.institucion.matricula = '0'
                    }
                    me.institucion.estado = response.data.estado_idEstado
                    // console.log(me.institucion)
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        rechargeInstitucion(e) {
            let me = this;
            //0 => RECARGAR ; 1 CERRAR MODAL
            if (e == 0) {
                me.popupAddInstitucion = false;
                me.getInstitucion();
            } else {
                me.popupAddInstitucion = false;
            }
        },
        async getVendedor() {
            let me = this;
            this.$http.get(this.$server_url + 'listaAsesores')
                .then(function (response) {
                    me.vendedor = response.data.filter(p => p.estado == '1');
                    // console.log(me.vendedor);
                })
                .catch(function (error) {})
        },

        //=======FIN DE METODOS PARA EDITAR INSTITUCION============
        //=======METODOS PARA VER LOS USUARIOS=====================
        f_verUsuarios(){
            let me = this
            me.popupMostrarUsuarios = true 
        },
        //=======METODOS PARA EL MODAL DE LISTA DE DOCENTES========
        // getUsuariosTipo() {
        //     let me = this;
        //     me.$vs.loading()
        //     // me.docenteTipo = false;
        //     if (me.tipo == 'docente') {
        //         me.docenteTipo = true;
        //         this.$http.get(this.$server_url + 'docentes?idInstitucion=' + me.institucionDocente.idInstitucion)
        //             // this.$http.get(this.$server_url + 'docentes_x_institucion/' + me.institucionDocente.idInstitucion+'/'+me.institucionSelected.periodo_id)
        //             .then(function (response) {
        //                 me.usuarios = response.data
        //                 me.$vs.loading.close()
        //                 // console.log('docentes', me.usuarios)
        //             })
        //             .catch(function (error) {
        //                 console.log(error)
        //                 me.$vs.loading.close()
        //             })
        //     }
        //     if (me.tipo == 'estudiante') {
        //         this.$http.get(this.$server_url + 'estudiantesXInstitucion/' + me.institucionDocente.idInstitucion)
        //             .then(function (response) {
        //                 me.usuarios = response.data
        //                 me.$vs.loading.close()
        //                 // console.log(me.usuarios)
        //             })
        //             .catch(function (error) {
        //                 console.log(error)
        //                 me.$vs.loading.close()
        //             })
        //     }
        // },
        getUsuariosTipoVisitas() {
            let me = this;
            const from = moment(me.fromDate).format('YYYY-MM-DD')
            const to = moment(me.toDate).format('YYYY-MM-DD')
            if (me.fromDate == null) {
                me.$vs.notify({
                    text: 'Debe escoger una fecha inicio',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false
            }
            if (me.toDate == null) {
                me.$vs.notify({
                    text: 'Debe escoger una fecha final',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false
            }
            if (me.fromDate > me.toDate) {
                me.$vs.notify({
                    text: 'La fecha inicio no puede mayor que la fecha final',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false
            }
            me.usuarios = []
            me.$vs.loading()
            this.$http.get(this.$server_url + 'docentesVisitas?idInstitucion=' + me.institucionDocente.idInstitucion + '&fromDate=' + from + '&toDate=' + to + '&periodo_id=' + me.institucionSelected.periodo_id)
                .then(function (response) {
                    me.usuarios = response.data
                    me.$vs.loading.close()
                    // console.log(me.usuarios)
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        irAsignacion(item) {

            let me = this;
            // console.log( item )
            me.popupAsignacion = true;

            localStorage.setItem('user_select', (JSON.stringify(item)));
            localStorage.setItem('show_inst', 'si'); //desde vista docentes, mostrar institucion

            me.show_inst = (localStorage.getItem('show_inst'));
            me.usuarioAsignacion = JSON.parse(localStorage.getItem('user_select'));
            me.user_seleccionado = me.usuarioAsignacion.idusuario
            me.user_nombre = me.usuarioAsignacion.nombres + ' ' + me.usuarioAsignacion.apellidos
            me.user_email = me.usuarioAsignacion.email
            me.user_institucion = JSON.parse(localStorage.getItem('institucion'))
            me.getAreaSelect();
            me.getSeleccionadas();

            // me.$router.push('/usuarios/asignaturasInstitucion');
        },

        //=======FIN DEL METODOS PARA EL MODAL DE LISTA DE DOCENTES
        //=======METODOS PARA MODAL DE ASIGNACION DE LIBROS
        getSeleccionadas() {
            let me = this;
            me.$vs.loading();
            let data = new FormData();
            data.append('idusuario', me.user_seleccionado)
            this.$http.post(this.$server_url + "asignaturasDocent", data)
                .then(res => {
                    // console.log(res.data);
                    me.seleccionadas = res.data;
                    // me.popupDocentes = true;
                    me.$vs.loading.close();
                });
        },
        getAreaSelect() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "areaSelect").then(function (response) {
                me.area = response.data.items;
                // console.log(me.area);
                me.$vs.loading.close();
            });
        },

        agregaAsignacion(item) {
            let me = this;
            let data = new FormData();
            data.append('usuario_idusuario', me.user_seleccionado)
            data.append('asignatura_idasignatura', item.id)
            this.$http.post(this.$server_url + "asignar_asignatura_docentes", data)
                .then(function (res) {
                    // console.log(res.data);
                    if (res.data > 0) {
                        me.$vs.notify({
                            time: 7000,
                            text: 'Esta asignatura ya se encuentra asignada al docente',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Asignatura agregada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getSeleccionadas();
                    }
                    me.$vs.loading.close();
                });
        },
        eliminaAsignacion(item) {
            let me = this;
            // console.log(item)
            me.$vs.loading();
            this.$http.get(this.$server_url + "eliminaAsignacion/" + item.idasignado)
                .then(function (res) {
                    // console.log(res.data);
                    me.$vs.notify({
                        text: item.nombreasignatura + ' eliminada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                    me.$vs.loading.close();
                });
        },
        moverPeriodoActual() {
            let me = this
            // console.log("user_seleccionado", me.user_seleccionado)
            // console.log("periodo", me.institucionSelected.periodo_id)
            this.$http.get(this.$server_url + 'moverAsignaturasPeriodo/' + me.user_seleccionado + '/' + me.institucionSelected.periodo_id)
                .then(function (res) {
                    me.$vs.notify({
                        text: 'Se cambio correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        confirmaQuitar() {
            let me = this;
            me.popupAsignacion = false
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: '¿Está seguro de eliminar este contenido?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_quitarTodo,
                cancel: me.f_regresar
            })
        },
        f_regresar() {
            let me = this
            me.popupAsignacion = true
        },
        f_quitarTodo() {
            let me = this;
            let idSelects = [];
            for (let index = 0; index < me.seleccionadas.length; index++) {
                idSelects.push(me.seleccionadas[index].idasignado)
            }
            // console.log(idSelects)
            me.$vs.loading();
            let data = new FormData();
            data.append('idasiguser', idSelects)
            this.$http.post(this.$server_url + "quitaTodasAsignaturas", data)
                .then(function (res) {
                    // console.log(res.data);
                    me.$vs.notify({
                        text: 'Asignaturas quitadas correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadas();
                    me.$vs.loading.close();
                });
        },

        //=======FIN DE METODOS PARA MODAL DE ASIGNACION DE LIBROS

        //====PARA EXPORTAR A EXCEL LOS DOCENTES CON LAS VISITAS======
        exportToExcel() {
            let headerTitle = ['nombres', 'apellidos', 'email', 'usuario', 'cedula', 'visitas', 'Fecha creacion'];
            let headerVal = ['nombres', 'apellidos', 'email', 'name_usuario', 'cedula', 'visitas', 'created_at'];
            let codigoSelectedMayus = this.codigoSelected
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    //a email dejar en minusculas
                    if (key == 'email' || key == 'usuario') {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toLowerCase();
                    } else {
                        // if (typeof codigoSelectedMayus[i][key] == "string") {
                        //     codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                        // }
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
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        openLoadingColor(libro) {
            this.$vs.loading({
                color: '#1A76F2'
            })

        },
        //generar enlace para el estudiante pueda ingresar los codigos
        generateEnlaceEstudiante(tr) {
            let me = this;
            let host = location.protocol + '//' + location.hostname + ':' + location.port + '/formulario/diagnostico/'
            //let host = location.protocol + '//' + location.hostname +':'+ location.port + '/formulario/diagnostico/'+ tr.idInstitucion +'/'
            if (tr.statusPeriodo == 0) {
                me.$vs.notify({
                    text: 'La institución tiene período inactivo no se puede generar el enlace',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 6000,
                })
                return
            }
            let formData = new FormData();
            me.$vs.loading()
            formData.append('institucion_id', tr.idInstitucion)
            formData.append('periodo_id', tr.periodo_id)
            formData.append('link', host)
            this.$http.post(this.$server_url + 'GenerarEnlaceDiagnostico', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.copiarLink(res.data[0])
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        VerCoincidencias(tr) {
            let me = this;
            var resultado = ""
            me.busquedaMilton = ""
            me.arregloCoincidencias = []
            me.arregloIdsCoincidencias = []
            me.institucionCiudad = tr.ciudad
            me.institucionEnviar = tr.idInstitucion
            me.institucionNombreEnviar = tr.nombreInstitucion
            me.institucionEnviarCedula = tr.vendedorInstitucion
            me.institucionEnviarAIniciales = tr.iniciales
            const texto = tr.nombreInstitucion;
            // Convertimos la cadena en un arreglo de palabras
            const palabras = texto.split(" ");
            if (palabras.length > 3) {
                // Obtenemos las últimas 3 palabras del arreglo
                const ultimasTres = palabras.slice(-3);
                // Unimos las últimas 3 palabras en una sola cadena
                resultado = ultimasTres.join(" ");
            } else {
                resultado = tr.nombreInstitucion
            }
            //enviar ids coincidencias al arreglo
            if (tr.codigo_mitlon_coincidencias == "null" || tr.codigo_mitlon_coincidencias == null || tr.codigo_mitlon_coincidencias == "") {} else {
                let transforWords = tr.codigo_mitlon_coincidencias
                me.arregloIdsCoincidencias = transforWords.split(",")
            }
            me.buscarCoincidencias(resultado)
        },
        buscarCoincidencias(coincidencia) {
            let me = this;
            me.arregloCoincidencias = []
            me.$vs.loading();
            this.$http.get(this.$server_url + 'buscarCoincidenciaInstitucionMilton?coincidencia=' + coincidencia)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                    me.arregloCoincidencias = res.data
                    me.popupCoincidencia = true
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        AsignarCodigoMilton(tr) {
            let me = this;
            let resolve = me.arregloIdsCoincidencias.filter(p => p == tr.ID_INSTITUCION)
            if (resolve.length == 0) {
                me.arregloIdsCoincidencias.push(tr.ID_INSTITUCION)
            }
        },
        guadarIdsMilton() {
            let me = this
            if (me.arregloIdsCoincidencias.length == 0) {
                me.$vs.notify({
                    text: 'Debe seleccionar al menos un id',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            let valorPrimario = me.arregloIdsCoincidencias[0]
            let enviarIds = me.arregloIdsCoincidencias.join(',')
            let formData = new FormData();
            formData.append('valorPrimario', valorPrimario)
            formData.append('codigosM', enviarIds)
            formData.append('institucion_id', me.institucionEnviar)
            formData.append('cedulaAsesor', me.institucionEnviarCedula)
            formData.append('cedulaAsesorIniciales', me.institucionEnviarAIniciales)
            me.$vs.loading();
            this.$http.post(this.$server_url + 'guadarIdsMilton', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se actualizo correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getInstitucion()
                    me.popupCoincidencia = false
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        eliminaAsignacionIdMilton(value) {
            let me = this;
            me.arregloIdsCoincidencias.splice(value, 1);
        },
        copiarLink(tr) {
            let me = this;
            let ruta = tr.link
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
        },
        //METODOS REGISTRO DE DOCENTES
        registroDocentes(tr) {
            let me = this
            if (tr.statusPeriodo == 0) {
                me.$vs.notify({
                    text: 'La institución tiene periodo inactivo, solicite la activación a Soporte',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 6000
                })
                return
            }
            me.popupAsignacionDocentes = true;
        },
        //FIN METODOS REGISTRO DE DOCENTES
        //IMPRIMIR CODIGOS ESTUDIANTES
        imprimirCodigosEstudiante(tr) {
            let me = this;
            var datos = tr.periodo_id + '*' + tr.idInstitucion;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'getEstudianteCodigos/' + datos)
                .then(function (response) {
                    me.$vs.loading.close()
                    if (response.data.length == 0) {
                        me.$vs.notify({
                            text: 'No hay códigos registrados en esta institución',
                            color: 'danger',
                            time: 6000,
                            position: 'center',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        return
                    }
                    me.arregloCodigosEstudiantes = response.data;
                    me.exportToExcelCodigos()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getEvaluacionesInstitucion() {
            let me = this
            me.$vs.loading()
            const {
                idInstitucion,
                periodo_id
            } = me.institucionSelected
            this.$http.get(this.$server_url + `getEvaluacionesInstitucion/${idInstitucion}/${periodo_id}/`)
                .then(function (response) {
                    me.$vs.loading.close()
                    me.arrayEvaluacionesInstitucion = response.data
                    me.popupEvaluaciones = true
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        changeEvaluacion(e) {
            let me = this
            me.popupEvaluaciones = false
        },
        //METODOS PARA DETALE DE VENTA
        getTipoVenta(tr) {
            let me = this;
            me.pedido.nombreInstitucion = tr.nombreInstitucion
            me.pedido.idInstitucion = tr.idInstitucion
            me.pedido.periodo = tr.periodo
            me.pedido.periodo_id = tr.periodo_id
            me.tituloDetalleVenta = 'Detalle de venta de ' + me.pedido.nombreInstitucion
            me.popupTipoVenta = true;
        },
        //FIN METODOS PARA DETALLE DE VENTA
        //METODOS PARA ACTIVAR AL ULTIMO PERIODO
        getPeriodosActivar() {
            let me = this
            me.$vs.loading()
            me.periodoSelect = []
            this.$http.get(this.$server_url + 'get_periodos_pedidos')
                .then(res => {
                    me.$vs.loading.close()
                    let datos = res.data
                    if (datos.length == 0) {
                        me.$vs.notify({
                            text: 'No existe períodos para activar Comuniquese con soporte',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 5000,
                        })
                        return
                    }
                    //obtener el perido activo de la region para activar a la escuela en ese periodo
                    if (datos.length > 0) {
                        me.periodoSelect = datos.filter(p => p.cambiar_periodo == 1 && p.region_idregion == me.sendInstitucion.region)
                        //si no existe el periodo activo para la region para poder cambiar
                        if (me.periodoSelect.length == 0) {
                            me.$vs.notify({
                                text: 'No existe un período configurado para activar Comuniquese con soporte',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 5000,
                            })
                            return
                        }
                        //si existe mas de un periodo activo para la region
                        if (me.periodoSelect.length > 1) {
                            me.$vs.notify({
                                text: 'Existe más de un período configurado para activar Comuniquese con soporte',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 5000,
                            })
                            return
                        }
                        me.popupActualizarPeriodo = true;
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        changePeriodo() {
            let me = this;
            me.$vs.loading();
            let data = new FormData();
            data.append('idperiodoescolar', me.periodoSelect[0].idperiodoescolar);
            data.append('idinstitucion', me.sendInstitucion.idInstitucion)
            this.$http.post(this.$server_url + 'verifica_periodo', data)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data == 1) {
                        me.$vs.notify({
                            time: 8000,
                            text: 'Este periodo ya se encuentra asignado a la institucion ' + me.sendInstitucion.nombreInstitucion,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Periodo agregado correctamente a la institucion ' + me.sendInstitucion.nombreInstitucion,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                    me.getInstitucion()
                    me.sendInstitucion = {}
                    me.popupActualizarPeriodo = false;
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                })
        },
        //FIN METODOS PARA ACTIVAR AL ULTIMO PERIODO
        //METODOS PARA EXCEL
        //para limipiar los campos del excel
        //metodo par descargar el excel
        exportToExcelCodigos() {
            let headerTitle = ['Código', 'Estudiante', 'Libro'];
            let headerVal = ['codigo', 'estudiante', 'nombrelibro'];
            let codigoSelectedMayus = this.arregloCodigosEstudiantes
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
                var nombrefile = ""
                if (this.openModal == 1) {
                    nombrefile = this.fileName
                } else {
                    nombrefile = "Reporte_de_codigo_de_estudiantes"
                }
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: nombrefile,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
            })
        },
        //INICIO METODOS PARA SUCURSALES-------------------------------------------------------------------
        getSucursalesInstitucionxParametro(codigodocumento) {
            let me = this;
            // console.log(codigodocumento.idInstitucion)
            me.$vs.loading();
            this.$http.get(this.$server_url + "GetSucursalxPuntoVentaparametro?ID_INSTITUCION=" + codigodocumento.idInstitucion)
                .then(function (res) {
                    me.SucursalesInstitucion = res.data;
                    if (me.SucursalesInstitucion.length === 0) {
                        me.$vs.notify({
                            text: "No hay Sucursales para esta institución",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.SucursalesInstitucion = [];
                        me.$vs.loading.close();
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: "No hay Sucursales para esta institución",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.SucursalesInstitucion = [];
                        me.$vs.loading.close();
                    } else {
                        console.log(error + " error");
                        me.$vs.loading.close();
                    }
                });
        },
        AbrirPopupSucursales(tr) {
            // console.log(tr)
            this.popupGeneralSucursalesInstitucion = true
            this.ObjInstitucion_Sucursal = tr
            this.getSucursalesInstitucionxParametro(this.ObjInstitucion_Sucursal);
        },
        getNuevaSucursalesInstitucion() {
            // console.log(this.ObjInstitucion_Sucursal.idInstitucion,"trnuevasurusales");
            this.popupActivoGuardarSucursalesInstitucion = true
            // this.popupGeneralSucursalesInstitucion = false
            this.tabSucursalesInstitucion.isuc_id = ''
            this.tabSucursalesInstitucion.isuc_idInstitucion = ''
            this.tabSucursalesInstitucion.isuc_ruc = ''
            this.tabSucursalesInstitucion.isuc_nombre = ''
            this.tabSucursalesInstitucion.isuc_correo = ''
            this.tabSucursalesInstitucion.isuc_telefono = ''
            this.tabSucursalesInstitucion.isuc_direccion = ''
            this.tabSucursalesInstitucion.isuc_estado = ''
        },
        guardarnuevaSucursalesInstitucion() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let id_institucionsucursal = this.ObjInstitucion_Sucursal.idInstitucion;
            // console.log(id_institucionsucursal,"idinstitucionsolitaenguardar")
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabSucursalesInstitucion.isuc_nombre === '' || this.tabSucursalesInstitucion.isuc_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el Nombre de la Sucursal antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos = {
                "isuc_idInstitucion": id_institucionsucursal,
                "isuc_ruc": this.tabSucursalesInstitucion.isuc_ruc,
                "isuc_nombre": this.tabSucursalesInstitucion.isuc_nombre,
                "isuc_correo": this.tabSucursalesInstitucion.isuc_correo,
                "isuc_telefono": this.tabSucursalesInstitucion.isuc_telefono,
                "isuc_direccion": this.tabSucursalesInstitucion.isuc_direccion,
                "user_created": usuarioObjeto.idusuario,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'PostSucursalesInstitucion_Registrar_modificar', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getSucursalesInstitucionxParametro(this.ObjInstitucion_Sucursal);
                    me.$vs.notify({
                        text: 'Sucursal guardada con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoGuardarSucursalesInstitucion = false
                    this.popupGeneralSucursalesInstitucion = true
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Sucursal no se pudo guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getEditarSucursalesInstitucion(tr) {
            this.popupActivoEditarSucursalesInstitucion = true
            this.tabSucursalesInstitucion.isuc_id = tr.isuc_id
            this.tabSucursalesInstitucion.isuc_nombre = tr.isuc_nombre
            this.tabSucursalesInstitucion.isuc_correo = tr.isuc_correo
            this.tabSucursalesInstitucion.isuc_telefono = tr.isuc_telefono
            this.tabSucursalesInstitucion.isuc_ruc = tr.isuc_ruc
            this.tabSucursalesInstitucion.isuc_direccion = tr.isuc_direccion
            this.tabSucursalesInstitucion.isuc_estado = tr.isuc_estado
            // this.$router.push('/prueba/editar/' + this.id);
            // console.log(id);
            // this.$params.id;
        },
        editarSucursalesInstitucion() {
            let me = this;
            if (this.tabSucursalesInstitucion.isuc_nombre === '' || this.tabSucursalesInstitucion.isuc_nombre === null) {
                me.$vs.notify({
                    text: 'Escriba el Nombre de la Sucursal antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            me.$vs.loading()
            let datos = {
                "isuc_id": this.tabSucursalesInstitucion.isuc_id,
                "isuc_ruc": this.tabSucursalesInstitucion.isuc_ruc,
                "isuc_nombre": this.tabSucursalesInstitucion.isuc_nombre,
                "isuc_correo": this.tabSucursalesInstitucion.isuc_correo,
                "isuc_telefono": this.tabSucursalesInstitucion.isuc_telefono,
                "isuc_direccion": this.tabSucursalesInstitucion.isuc_direccion,
            }
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url + 'PostSucursalesInstitucion_Registrar_modificar', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getSucursalesInstitucionxParametro(this.ObjInstitucion_Sucursal);
                    me.$vs.notify({
                        text: 'Sucursal editada con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEditarSucursalesInstitucion = false;
                })
                .catch(error => {
                    console.log(error);
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Sucursal no se pudo editar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getPreguntaEliminarSucursalesInstitucion(tr) {
            this.popupActivoEliminarSucursalesInstitucion = true
            this.isuc_id = tr.isuc_id
            this.isuc_nombre = tr.isuc_nombre
            this.isuc_ruc = tr.isuc_ruc
        },
        getEliminarSucursalesInstitucion() {
            let me = this;
            let datos = {
                "isuc_id": this.isuc_id,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Post_Eliminar_SucursalesInstitucion", datos)
                .then(data => {
                    me.$vs.loading.close()
                    this.getSucursalesInstitucionxParametro(this.ObjInstitucion_Sucursal);
                    me.$vs.notify({
                        text: 'Sucursal eliminada con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.popupActivoEliminarSucursalesInstitucion = false
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Sucursal no se pudo eliminar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getPreguntaDesactivarSucursalesInstitucion(tr) {
            this.popup_desactivar_SucursalesInstitucion = true
            this.isuc_id = tr.isuc_id
            this.tabSucursalesInstitucion.isuc_nombre = tr.isuc_nombre
            this.tabSucursalesInstitucion.isuc_estado = tr.isuc_estado
        },
        desactivar_activar_SucursalesInstitucion() {
            let me = this;
            let valornuevo = this.tabSucursalesInstitucion.isuc_estado;
            // console.log(valornuevo+'valornuevoeatdoprocutp'+this.isuc_id);
            if (valornuevo == 1) {
                valornuevo = 0;
                let datos = {
                    "isuc_id": this.isuc_id,
                    "isuc_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url + 'Desactivar_SucursalesInstitucion', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        this.getSucursalesInstitucionxParametro(this.ObjInstitucion_Sucursal);
                        me.$vs.notify({
                            text: 'Cambio de estado exitoso',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popup_desactivar_SucursalesInstitucion = false
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo realizar el cambio de estado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            } else if (valornuevo == 0) {
                valornuevo = 1;
                let datos = {
                    "isuc_id": this.isuc_id,
                    "isuc_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url + 'Desactivar_SucursalesInstitucion', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        this.getSucursalesInstitucionxParametro(this.ObjInstitucion_Sucursal);
                        me.$vs.notify({
                            text: 'Cambio de estado exitoso',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popup_desactivar_SucursalesInstitucion = false
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo realizar el cambio de estado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            }
        },
        getCancelarNuevaSucursalesInstitucion() {
            this.popupActivoGuardarSucursalesInstitucion = false
            this.popupActivoEditarSucursalesInstitucion = false
            this.popupActivoEliminarSucursalesInstitucion = false
            // this.popupGeneralSucursalesInstitucion = false
            this.popup_desactivar_SucursalesInstitucion = false
        },
        //FIN METODOS PARA SURURSALES-------------------------------------------------------------------
        reporteInstituciones() {
          this.popupReporteInstituciones = true;
        },
        changeHandleReporteInstituciones(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarhistoricoedicionmasivaactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupReporteInstituciones = false;
            } else if (e.verificarhistoricoedicionmasivaactualizar == 2) {
                console.log("Emit recibido por cancelar.");
                me.popupReporteInstituciones = false;
            } else {
                console.log("Emit no recibido");
            }
        },
    },
}
</script>

<style lang="css">
.asig-select {
    display: inline-block;
    border: 0.7px solid rgb(201, 201, 204);
    border-radius: 6px;
    font-size: 12px;
}

.titulo {
    background: #4CB8C4;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #3CD3AD, #4CB8C4);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #3CD3AD, #4CB8C4);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: white;
    letter-spacing: 1px;

}

/* Botón para seleccionar archivos */
button.form-file-button {
    margin-top: 10px;
    vertical-align: middle;
    color: #fff;
    background: #24A6F6;
    margin: 0;
    border: 0;
    width: 50px;
    padding: 2px 8px;
    transform: scaleX(-1);
    /* Invertir botón horizontalmente */
}

/* Lista de archivos */
span.form-file-span {
    flex: 1;
    display: inline-block;
    text-align: left;
    padding: 4px 10px;
    background: #24A6F6;
    color: #fff;
    padding: 10px;
    border-radius: 5px 15px;
    cursor: pointer;
    font-size: 20px;

}
.informacionformhijo {
    z-index: 51006;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
.popupPadre{
    z-index: 51005;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
