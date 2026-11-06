<template>
    <vx-card fixed-height="true">
        <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nueva Institución</vs-button>
        <br><br>
        Búsqueda por nombre Institución
        <div style="width:65%;display:flex;">
            <div style="width:80%;">
            <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()"  v-model="busquedanombre"/>
            </div>
            <div style="width:20%;margin-left:10px;">
                <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            </div>
        </div>
        <vs-table max-items="10" pagination search :data="Instituciones">
            <template slot="header">
                        <vs-chip  color="primary">Cantidad: <b> {{ Instituciones.length }}</b></vs-chip>
                    </template>
            <!-- {{cliCi}} -->
            <template slot="thead">
                <vs-th>
                    Id
                </vs-th>
                <vs-th colspan="2">
                    Información Institución
                </vs-th>
                <vs-th>
                    Acciones
                </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].insCodigo">
                        {{ data[indextr].insCodigo }}
                    </vs-td>
                    <vs-td width="50%">
                        <small><b>Ciudad:</b> {{tr.ciuNombre}}</small><br>
                        <small><b>Zona:</b> {{tr.ciuZonaC}}</small><br>
                        <small><b>Tipo Institución:</b> {{tr.tipInsNombre}}</small><br>
                        <small><b>Ciclo:</b> {{tr.cicNombre}}</small><br>
                        <small><b>Institución:</b> {{tr.insNombre}}</small><br>
                        <small><b>Dirección:</b> {{tr.insDireccion}}</small><br>
                        <small><b>Teléfono:</b> {{tr.insTelefono}}</small><br>
                    </vs-td>
                    <vs-td width="50%">
                        <small><b>Alias:</b> {{tr.insAlias}}</small><br>
                        <small><b>Email:</b> {{tr.insMail}}</small><br>
                        <small><b>Sitio Web:</b> {{tr.insSitioWeb}}</small><br>
                        <small><b>Nombre Jurídico:</b> {{tr.insNombreJuridico}}</small><br>
                        <small><b>Nombre Comercial:</b> {{tr.insNombreComercial}}</small><br>
                        <small><b>Representante legal:</b> {{tr.insRepresentanteLegal}}</small><br>
                        <small><b>Ruc:</b> {{tr.insRuc}}</small><br>
                        <small><b>Sector:</b> {{tr.insSector}}</small><br>
                    </vs-td>
                    <vs-td :data="data[indextr].insCodigo">
                        <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2 inline" color="success" @click="getEditar(tr)"></vs-button>
                        <!-- <vs-button type="border" size="small" icon-pack="feather" icon="icon-trash" class="mr-2 inline" color="danger" @click="getPreguntaEliminar(tr)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-popup class="crear" title="Registro nueva institución" :active.sync="popupActivoGuardar">
            <vs-row>
                <!-- {{ tabInstitucion }} -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Institución</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">        
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <!-- {{ tabInstitucion.ciuCodigo }} -->
                            <font style="font-size: 12px">&nbsp;Ciudad *</font><br>
                            <v-select :options="CiudadInstitucion2" :reduce="CiudadInstitucion2 => CiudadInstitucion2.ciuCodigo" label="ciuNombreandZona" class="w-full h-100" placeholder="--Seleccione--" v-model="tabInstitucion.ciuCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 12px">&nbsp;Tipo Institución *</font><br>
                            <v-select :options="TipoInstitucion" :reduce="TipoInstitucion => TipoInstitucion.tipInsCodigo" label="tipInsNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabInstitucion.tipInsCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">        
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 12px">&nbsp;Ciclo Institución *</font><br>
                            <v-select :options="CicloInstitucion" :reduce="CicloInstitucion => CicloInstitucion.cicCodigo" label="cicNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabInstitucion.cicCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Institución *" placeholder="Institución" class="w-full" icon="mode_edit" v-model="tabInstitucion.insNombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Dirección " placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabInstitucion.insDireccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Teléfono " placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabInstitucion.insTelefono" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Alias " placeholder="Alias" class="w-full" icon="mode_edit" v-model="tabInstitucion.insAlias" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email " placeholder="Email" class="w-full" icon="mode_edit" v-model="tabInstitucion.insMail" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Sitio Web " placeholder="Sitio Web" class="w-full" icon="mode_edit" v-model="tabInstitucion.insSitioWeb" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre Jurídico " placeholder="Nombre Jurídico" class="w-full" icon="mode_edit" v-model="tabInstitucion.insNombreJuridico" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre Comercial " placeholder="Nombre Comercial" class="w-full" icon="mode_edit" v-model="tabInstitucion.insNombreComercial" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Representante Legal " placeholder="Representante Legal" class="w-full" icon="mode_edit" v-model="tabInstitucion.insRepresentanteLegal" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Ruc " placeholder="Ruc" class="w-full" icon="mode_edit" v-model="tabInstitucion.insRuc" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Sector " placeholder="Sector" class="w-full" icon="mode_edit" v-model="tabInstitucion.insSector" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
        <vs-popup class="editar" :title="`Edición Institución: ${tabInstitucion.insNombre}`" :active.sync="popupActivoEditar">
            <vs-row>
                <!-- {{ tabInstitucion }} -->
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">        
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <!-- {{ tabInstitucion.ciuCodigo }} -->
                            <font style="font-size: 12px">&nbsp;Ciudad *</font><br>
                            <v-select :options="CiudadInstitucion2" :reduce="CiudadInstitucion2 => CiudadInstitucion2.ciuCodigo" label="ciuNombreandZona" class="w-full h-100" placeholder="--Seleccione--" v-model="tabInstitucion.ciuCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 12px">&nbsp;Tipo Institución *</font><br>
                            <v-select :options="TipoInstitucion" :reduce="TipoInstitucion => TipoInstitucion.tipInsCodigo" label="tipInsNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabInstitucion.tipInsCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">        
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{ tabVendedor.ciuNombre }} -->
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <font style="font-size: 12px">&nbsp;Ciclo Institución *</font><br>
                            <v-select :options="CicloInstitucion" :reduce="CicloInstitucion => CicloInstitucion.cicCodigo" label="cicNombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabInstitucion.cicCodigo" />
                            <!-- <vs-input label="Ciudad " placeholder="Ciudad" class="w-full" icon="mode_edit" v-model="tabVendedor.ciuCodigo" /> -->
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Institución *" placeholder="Institución" class="w-full" icon="mode_edit" v-model="tabInstitucion.insNombre" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Dirección *" placeholder="Dirección" class="w-full" icon="mode_edit" v-model="tabInstitucion.insDireccion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Teléfono " placeholder="Teléfono" class="w-full" icon="mode_edit" v-model="tabInstitucion.insTelefono" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Alias " placeholder="Alias" class="w-full" icon="mode_edit" v-model="tabInstitucion.insAlias" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Email " placeholder="Email" class="w-full" icon="mode_edit" v-model="tabInstitucion.insMail" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Sitio Web " placeholder="Sitio Web" class="w-full" icon="mode_edit" v-model="tabInstitucion.insSitioWeb" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre Jurídico " placeholder="Nombre Jurídico" class="w-full" icon="mode_edit" v-model="tabInstitucion.insNombreJuridico" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Nombre Comercial " placeholder="Nombre Comercial" class="w-full" icon="mode_edit" v-model="tabInstitucion.insNombreComercial" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Representante Legal " placeholder="Representante Legal" class="w-full" icon="mode_edit" v-model="tabInstitucion.insRepresentanteLegal" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Ruc " placeholder="Ruc" class="w-full" icon="mode_edit" v-model="tabInstitucion.insRuc" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                            <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                            <vs-input label="Sector " placeholder="Sector" class="w-full" icon="mode_edit" v-model="tabInstitucion.insSector" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </vx-card>
    </template>
<script>
import Vue from 'vue';
import axios from 'axios';
import vSelect from 'vue-select';
export default {
    data() {
        return{
            Instituciones: [],
            CiudadInstitucion: [],
            CiudadInstitucion2: [],
            TipoInstitucion: [],
            CicloInstitucion: [],
            busquedanombre: "",
            popupActivoGuardar: false,
            popupActivoEditar: false,
            tabInstitucion: {
                insCodigo: '',
                ciuCodigo: '',
                tipInsCodigo: '',
                cicCodigo: '',
                insNombre: '',
                insDireccion: '',
                insTelefono: '',
                insAlias: '',
                insMail: '',
                insSitioWeb: '',
                insNombreJuridico: '',
                insNombreComercial: '',
                insRepresentanteLegal: '',
                insRuc: '',
                insSector: '',
            },
            insCodigo: 0,
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        this.getCiuTipCicInstitucion();
    },
    methods: {
        getCiuTipCicInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'Get_Institucion')
            //axios.get(this.$apifacturacion_url + 'f_Institucion')
            .then(res => {
            me.CiudadInstitucion = res.data.ciudadinstitucion;
            me.TipoInstitucion = res.data.tipoinstitucion;
            me.CicloInstitucion = res.data.cicloinstitucion;
                me.CiudadInstitucion.forEach(element => {
                    var newins = new Object();
                    newins.ciuCodigo = element.ciuCodigo
                    newins.ciuNombreandZona = element.ciuNombre + " -  " + element.ciuZonaC
                    me.CiudadInstitucion2.push(newins)
                })
            })
            .catch(err => {
            console.log(err)
            })
        },
        getInstitucion() {
            let me = this;
            if(me.busquedanombre.length < 2){
                me.$vs.notify({
                text:'Minimo 3 caracteres de busqueda',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Institucion?nameInstitucion=' +me.busquedanombre)
            this.$http.get(this.$server_url+'Get_InstitucionxNombre?nameInstitucion=' +me.busquedanombre)
            .then(function (res) {
                // me.tmpVenta = res.data;
                me.Instituciones = res.data.instituciones;
                // me.filtroRegion();
                me.$vs.loading.close()
                if(res.data.message){
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
        // getInstitucion() {
        // axios.get('https://localhost:7252/api/Cliente')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.Instituciones = resultado;
        //     console.log(this.Instituciones);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabInstitucion.ciuCodigo = ''
            this.tabInstitucion.tipInsCodigo = ''
            this.tabInstitucion.cicCodigo = ''
            this.tabInstitucion.insNombre = ''
            this.tabInstitucion.insDireccion = ''
            this.tabInstitucion.insTelefono = ''
            this.tabInstitucion.insAlias = ''
            this.tabInstitucion.insMail = ''
            this.tabInstitucion.insSitioWeb = ''
            this.tabInstitucion.insNombreJuridico = ''
            this.tabInstitucion.insNombreComercial = ''
            this.tabInstitucion.insRepresentanteLegal = ''
            this.tabInstitucion.insRuc = ''
            this.tabInstitucion.insSector = ''
        },
        guardarnuevo() {
        let me = this;
        //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabInstitucion.ciuCodigo === '' || this.tabInstitucion.ciuCodigo === null) {
                me.$vs.notify({
                    text: 'Elija una ciudad antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabInstitucion.tipInsCodigo === '' || this.tabInstitucion.tipInsCodigo === null) {
                me.$vs.notify({
                    text: 'Elija un tipo institución antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabInstitucion.cicCodigo === '' || this.tabInstitucion.cicCodigo === null) {
                me.$vs.notify({
                    text: 'Elija un ciclo antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabInstitucion.insNombre === '' || this.tabInstitucion.insNombre === null) {
                me.$vs.notify({
                    text: 'Escriba el nombre de la institución antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        let datos  = {
                "ciuCodigo": this.tabInstitucion.ciuCodigo,
                "tipInsCodigo": this.tabInstitucion.tipInsCodigo,
                "cicCodigo": this.tabInstitucion.cicCodigo,
                "insNombre": this.tabInstitucion.insNombre,
                "insDireccion": this.tabInstitucion.insDireccion,
                "insTelefono": this.tabInstitucion.insTelefono,
                "insAlias": this.tabInstitucion.insAlias,
                "insMail": this.tabInstitucion.insMail,
                "insSitioWeb": this.tabInstitucion.insSitioWeb,
                "insNombreJuridico": this.tabInstitucion.insNombreJuridico,
                "insNombreComercial": this.tabInstitucion.insNombreComercial,
                "insRepresentanteLegal": this.tabInstitucion.insRepresentanteLegal,
                "insRuc": this.tabInstitucion.insRuc,
                "insSector": this.tabInstitucion.insSector
            }
        me.$vs.loading()
        this.$http.post(this.$server_url+'Post_InstitucionCrear', datos)
        //axios.post(this.$apifacturacion_url + 'f_Institucion', datos)
            .then(res => {
                this.getInstitucion();
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Institución guardado con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Institución no se pudo guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getEditar(tr) {
        this.popupActivoEditar = true
        this.tabInstitucion.insCodigo = tr.insCodigo
        this.tabInstitucion.ciuCodigo = tr.ciuCodigo
        this.tabInstitucion.tipInsCodigo = tr.tipInsCodigo
        this.tabInstitucion.cicCodigo = tr.cicCodigo
        this.tabInstitucion.insNombre = tr.insNombre
        this.tabInstitucion.insDireccion = tr.insDireccion
        this.tabInstitucion.insTelefono = tr.insTelefono
        this.tabInstitucion.insAlias = tr.insAlias
        this.tabInstitucion.insMail = tr.insMail
        this.tabInstitucion.insSitioWeb = tr.insSitioWeb
        this.tabInstitucion.insNombreJuridico = tr.insNombreJuridico
        this.tabInstitucion.insNombreComercial = tr.insNombreComercial
        this.tabInstitucion.insRepresentanteLegal = tr.insRepresentanteLegal
        this.tabInstitucion.insRuc = tr.insRuc
        this.tabInstitucion.insSector = tr.insSector
        // this.$router.push('/prueba/editar/' + this.id);
        // console.log(id);
        // this.$params.id;
        },
        editar() {
        let me = this;
        if (this.tabInstitucion.ciuCodigo === '' || this.tabInstitucion.ciuCodigo === null) {
            me.$vs.notify({
                text: 'Elija la ciudad antes de guardar',
                color: 'danger',
                   iconPack: 'feather',
                   icon: 'icon-alert-triangle'
            });
            return;
        }
        if (this.tabInstitucion.tipInsCodigo === '' || this.tabInstitucion.tipInsCodigo === null) {
            me.$vs.notify({
                text: 'Elija un tipo institución antes de guardar',
                color: 'danger',
                   iconPack: 'feather',
                   icon: 'icon-alert-triangle'
            });
            return;
        }
        if (this.tabInstitucion.cicCodigo === '' || this.tabInstitucion.cicCodigo === null) {
            me.$vs.notify({
                text: 'Elija un ciclo antes de guardar',
                color: 'danger',
                   iconPack: 'feather',
                   icon: 'icon-alert-triangle'
            });
            return;
        }
        if (this.tabInstitucion.insNombre === '' || this.tabInstitucion.insNombre === null) {
            me.$vs.notify({
                text: 'Escriba un nombre institución antes de guardar',
                color: 'danger',
                   iconPack: 'feather',
                   icon: 'icon-alert-triangle'
            });
            return;
        }
        let datos  = {
                "insCodigo": this.tabInstitucion.insCodigo,
                "ciuCodigo": this.tabInstitucion.ciuCodigo,
                "tipInsCodigo": this.tabInstitucion.tipInsCodigo,
                "cicCodigo": this.tabInstitucion.cicCodigo,
                "insNombre": this.tabInstitucion.insNombre,
                "insDireccion": this.tabInstitucion.insDireccion,
                "insTelefono": this.tabInstitucion.insTelefono,
                "insAlias": this.tabInstitucion.insAlias,
                "insMail": this.tabInstitucion.insMail,
                "insSitioWeb": this.tabInstitucion.insSitioWeb,
                "insNombreJuridico": this.tabInstitucion.insNombreJuridico,
                "insNombreComercial": this.tabInstitucion.insNombreComercial,
                "insRepresentanteLegal": this.tabInstitucion.insRepresentanteLegal,
                "insRuc": this.tabInstitucion.insRuc,
                "insSector": this.tabInstitucion.insSector
            }
        me.$vs.loading()
        this.$http.post(this.$server_url+'Post_InstitucionEditar', datos)
        //axios.post(this.$apifacturacion_url + 'f_Institucion', datos)
            .then(res => {
                me.$vs.loading.close()
                this.getInstitucion();
                me.$vs.notify({
                    text: 'Institución editada con exito',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })

                this.popupActivoEditar = false;
                this.popupActivoGuardar = false;
                this.popupActivoEliminar = false;
            })
            .catch(function () {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Institución no se pudo editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
        },
    },
    // created(){
    //     let url = "https://localhost:7252/api/Cliente";
    //     axios.get(url).then((response) => this.Instituciones = response.data);
    //     // fetch("https://localhost:7252/api/Cliente/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Instituciones = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>