<template>
<div class="formularios-container">
    <vx-card class="modern-card">
        <!-- Header Section -->
        <div class="header-section">
            <div class="header-content">
                <div class="header-left">
                    <h2 class="page-title">
                        <feather-icon icon="FileTextIcon" size="24" class="title-icon" />
                        Gestión de Formularios
                    </h2>
                    <p class="page-subtitle">Administra los formularios de proforma del sistema</p>
                </div>
                <div class="header-actions">
                    <vs-button 
                        color="success" 
                        type="filled"
                        icon-pack="feather"
                        icon="icon-plus"
                        @click="getNuevoEditarFormularioProforma(); verificarcrear_actualizar = 'create'"
                        class="action-button"
                    >
                        Nuevo Formulario
                    </vs-button>
                    <vs-button 
                        color="primary" 
                        type="border"
                        icon="info"
                        @click="getInformacionFormularioProforma()"
                        class="info-button"
                    >
                        Información
                    </vs-button>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-section" v-if="ContUserAgrupados.length > 0">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon success">
                        <feather-icon icon="FileTextIcon" size="20" />
                    </div>
                    <div class="stat-content">
                        <h4>{{ ContUserAgrupados.length }}</h4>
                        <p>Total Formularios</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon primary">
                        <feather-icon icon="CheckCircleIcon" size="20" />
                    </div>
                    <div class="stat-content">
                        <h4>{{ ContUserAgrupados.filter(f => f.ffp_estado == 1).length }}</h4>
                        <p>Activos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <feather-icon icon="XCircleIcon" size="20" />
                    </div>
                    <div class="stat-content">
                        <h4>{{ ContUserAgrupados.filter(f => f.ffp_estado == 0).length }}</h4>
                        <p>Inactivos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon info">
                        <feather-icon icon="TruckIcon" size="20" />
                    </div>
                    <div class="stat-content">
                        <h4>{{ ContUserAgrupados.filter(f => f.if_distribuidor == 1).length }}</h4>
                        <p>Distribuidores</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search Section -->
        <div v-if="conteoregistros > registrosmaximos" class="search-section">
            <div class="search-card">
                <div class="search-header">
                    <feather-icon icon="SearchIcon" size="18" class="search-icon" />
                    <h4 class="search-title">Búsqueda Avanzada</h4>
                </div>
                
                <div class="search-content">
                    <div class="search-input-container">
                        <div class="input-group">
                            <vs-input 
                                v-if="tipo == 0" 
                                placeholder="Buscar por código..." 
                                icon="search"
                                v-model="parametrobusqueda"
                                @keyup.enter="getFormularioProformaParametro()"
                                class="search-input"
                            />
                            <v-select 
                                v-else-if="tipo == 1" 
                                :options="UsuariosLibrerias" 
                                :reduce="UsuariosLibrerias => UsuariosLibrerias.idusuario" 
                                label="datosbusqueda" 
                                placeholder="Seleccione usuario..."
                                v-model="parametrobusqueda" 
                                @input="getFormularioProformaParametro()"
                                class="select-input"
                            />
                            <v-select 
                                v-else-if="tipo == 2" 
                                :options="ContratoAgrupacion" 
                                :reduce="ContratoAgrupacion => ContratoAgrupacion.ca_id" 
                                label="datoscontagrupados" 
                                placeholder="Seleccione contrato..."
                                v-model="parametrobusqueda" 
                                @input="getFormularioProformaParametro()"
                                class="select-input"
                            />
                        </div>
                        <vs-button 
                            v-if="tipo == 0" 
                            color="primary" 
                            type="filled"
                            @click="getFormularioProformaParametro()"
                            icon="search"
                            class="search-btn"
                        >
                            Buscar
                        </vs-button>
                    </div>
                    
                    <div class="filter-options">
                        <div class="filter-group">
                            <span class="filter-label">Filtrar por:</span>
                            <div class="radio-group">
                                <vs-radio 
                                    v-model="tipo" 
                                    vs-value="0" 
                                    @input="busqueda = 'codigoagrupado'; limpiar()"
                                >
                                    Código
                                </vs-radio>
                                <vs-radio 
                                    v-model="tipo" 
                                    vs-value="1" 
                                    @input="busqueda = 'nombreusuario'; limpiar()"
                                >
                                    Usuario
                                </vs-radio>
                                <vs-radio 
                                    v-model="tipo" 
                                    vs-value="2" 
                                    @input="busqueda = 'infocontratoagrupado'; limpiar()"
                                >
                                    Contrato
                                </vs-radio>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="table-section">
            <div class="table-header">
                <div class="table-info">
                    <h4 class="table-title">Lista de Formularios</h4>
                    <vs-chip color="primary" class="count-chip">
                        <feather-icon icon="FileIcon" size="14" class="mr-1" />
                        {{ ContUserAgrupados.length }} registros
                    </vs-chip>
                </div>
            </div>

            <vs-table 
                max-items="10" 
                pagination 
                search 
                :data="ContUserAgrupados"
                class="modern-table desktop-view"
            >
                <template slot="thead">
                    <!-- <vs-th width="80">Código</vs-th> -->
                    <vs-th width="300">Institución</vs-th>
                    <vs-th width="200">Información Financiera</vs-th>
                    <vs-th width="100">Distribuidor</vs-th>
                    <vs-th width="150">Fechas</vs-th>
                    <vs-th width="80">Estado</vs-th>
                    <vs-th width="100">Acciones</vs-th>
                </template>
                
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="table-row">
                        <!-- <vs-td class="code-cell">
                            <div class="code-container">
                                <span class="code-number">#{{ data[indextr].ffp_id }}</span>
                            </div>
                        </vs-td> -->
                        
                        <vs-td class="institution-cell">
                            <div class="institution-info">
                                <div class="institution-main">
                                    <feather-icon icon="BuildingIcon" size="16" class="institution-icon" />
                                    <div>
                                        <h6 class="institution-name">{{ tr.nombreInstitucion }}</h6>
                                        <p class="institution-city">
                                            <feather-icon icon="MapPinIcon" size="12" class="mr-1" />
                                            {{ tr.ciudad }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </vs-td>
                        
                        <vs-td class="financial-cell">
                            <div class="financial-info">
                                <div class="financial-item">
                                    <feather-icon icon="DollarSignIcon" size="12" class="financial-icon" />
                                    <span class="financial-label">Crédito:</span>
                                    <span class="financial-value">${{ tr.ffp_credito }}</span>
                                </div>
                                <div class="financial-item">
                                    <feather-icon icon="CreditCardIcon" size="12" class="financial-icon" />
                                    <span class="financial-label">Cupo:</span>
                                    <span class="financial-value">${{ tr.ffp_cupo }}</span>
                                </div>
                                <div class="financial-item">
                                    <feather-icon icon="PercentIcon" size="12" class="financial-icon" />
                                    <span class="financial-label">Desc:</span>
                                    <span class="financial-value">{{ tr.ffp_descuento }}%</span>
                                </div>
                                <div class="financial-item">
                                    <feather-icon icon="PieChartIcon" size="12" class="financial-icon" />
                                    <span class="financial-label">% Fact:</span>
                                    <span class="financial-value">{{ tr.ffp_porcentaje_facturacion }}%</span>
                                </div>
                                <div class="financial-item">
                                    <feather-icon icon="FileTextIcon" size="12" class="financial-icon" />
                                    <span class="financial-label">Pre:</span>
                                    <span class="financial-value">${{ tr.ffp_saldo_prefacturas }}</span>
                                </div>
                                <div class="financial-item">
                                    <feather-icon icon="ClipboardIcon" size="12" class="financial-icon" />
                                    <span class="financial-label">Notas:</span>
                                    <span class="financial-value">${{ tr.ffp_saldo_notas }}</span>
                                </div>
                            </div>
                        </vs-td>

                        <vs-td class="distribuidor-cell">
                            <div class="distribuidor-badge">
                                <vs-chip 
                                    v-if="tr.if_distribuidor == 1" 
                                    color="success" 
                                >
                                    <feather-icon icon="TruckIcon" size="12" class="mr-1" />
                                    Sí
                                </vs-chip>
                                <vs-chip 
                                    v-else 
                                    color="dark" 
                                >
                                    <feather-icon icon="XIcon" size="12" class="mr-1" />
                                    No
                                </vs-chip>
                            </div>
                        </vs-td>
                        
                        <vs-td class="date-cell">
                            <div class="date-info">
                                <div class="date-item">
                                    <feather-icon icon="CalendarIcon" size="12" class="date-icon" />
                                    <div>
                                        <small class="date-label">Creación</small>
                                        <p class="date-value">{{ formatDate(tr.created_at) }}</p>
                                    </div>
                                </div>
                                <div class="date-item" v-if="tr.updated_at !== tr.created_at">
                                    <feather-icon icon="EditIcon" size="12" class="date-icon" />
                                    <div>
                                        <small class="date-label">Actualización</small>
                                        <p class="date-value">{{ formatDate(tr.updated_at) }}</p>
                                    </div>
                                </div>
                            </div>
                        </vs-td>
                        
                        <vs-td class="status-cell">
                            <vs-chip 
                                :color="tr.ffp_estado == 1 ? 'success' : 'danger'"
                            >
                                <feather-icon 
                                    :icon="tr.ffp_estado == 1 ? 'CheckCircleIcon' : 'XCircleIcon'" 
                                    size="12" 
                                    class="mr-1" 
                                />
                                {{ tr.ffp_estado == 1 ? 'Activo' : 'Inactivo' }}
                            </vs-chip>
                        </vs-td>
                        
                         <vs-td class="actions-cell">
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button 
                                    color="primary" 
                                    type="border" 
                                    icon-pack="feather" 
                                    icon="icon-more-vertical"
                                    size="small"
                                    class="actions-button"
                                />
                                <vs-dropdown-menu class="actions-menu">
                                    <vs-dropdown-item v-if="tr.ffp_estado == 1" class="action-item">
                                        <vs-button 
                                            color="success" 
                                            type="line" 
                                            icon-pack="feather"
                                            icon="icon-edit"
                                            @click="getNuevoEditarFormularioProforma(tr); verificarcrear_actualizar='update'; tabFormularioProforma=tr"
                                            class="action-btn w-full"
                                        >
                                            Editar
                                        </vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item v-if="userRoot" class="action-item">
                                        <vs-button 
                                            color="danger" 
                                            type="line" 
                                            icon-pack="feather"
                                            icon="icon-trash-2"
                                            @click="getPreguntaEliminar(tr); tabFormularioProforma=tr"
                                            class="action-btn w-full"
                                        >
                                            Eliminar
                                        </vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item class="action-item">
                                        <vs-button 
                                            :color="tr.ffp_estado == 1 ? 'warning' : 'success'" 
                                            type="line" 
                                            icon-pack="feather"
                                            :icon="tr.ffp_estado == 1 ? 'icon-eye-off' : 'icon-eye'"
                                            @click="popup_desactivar_activar_FormularioProforma(tr)"
                                            class="action-btn w-full"
                                        >
                                            {{ tr.ffp_estado == 1 ? 'Desactivar' : 'Activar' }}
                                        </vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            
            <!-- Vista móvil -->
            <div class="mobile-view">
                <div class="mobile-cards-container">
                    <div 
                        v-for="(item, index) in paginatedMobileData" 
                        :key="index"
                        class="mobile-card"
                    >
                        <div class="mobile-card-header">
                            <div class="mobile-code">
                                <span class="code-label">#{{ item.ffp_id }}</span>
                            </div>
                            <div class="mobile-status">
                                <vs-chip 
                                    :color="item.ffp_estado == 1 ? 'success' : 'danger'"
                                    size="small"
                                >
                                    {{ item.ffp_estado == 1 ? 'Activo' : 'Inactivo' }}
                                </vs-chip>
                            </div>
                        </div>
                        
                        <div class="mobile-card-content">
                            <div class="mobile-institution">
                                <div class="mobile-institution-info">
                                    <feather-icon icon="BuildingIcon" size="16" class="mobile-icon" />
                                    <div>
                                        <h6 class="mobile-title">{{ item.nombreInstitucion }}</h6>
                                        <p class="mobile-subtitle">
                                            <feather-icon icon="MapPinIcon" size="12" class="mr-1" />
                                            {{ item.ciudad }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mobile-info-grid">
                                <div class="mobile-info-item">
                                    <span class="mobile-label">Crédito:</span>
                                    <span class="mobile-value">${{ item.ffp_credito }}</span>
                                </div>
                                <div class="mobile-info-item">
                                    <span class="mobile-label">Cupo:</span>
                                    <span class="mobile-value">${{ item.ffp_cupo }}</span>
                                </div>
                                <div class="mobile-info-item">
                                    <span class="mobile-label">Descuento:</span>
                                    <span class="mobile-value">{{ item.ffp_descuento }}%</span>
                                </div>
                                <div class="mobile-info-item">
                                    <span class="mobile-label">% Facturación:</span>
                                    <span class="mobile-value">{{ item.ffp_porcentaje_facturacion }}%</span>
                                </div>
                                <div class="mobile-info-item">
                                    <span class="mobile-label">Saldo Prefacturas:</span>
                                    <span class="mobile-value">${{ item.ffp_saldo_prefacturas }}</span>
                                </div>
                                <div class="mobile-info-item">
                                    <span class="mobile-label">Saldo Notas:</span>
                                    <span class="mobile-value">${{ item.ffp_saldo_notas }}</span>
                                </div>
                                <div class="mobile-info-item">
                                    <span class="mobile-label">Distribuidor:</span>
                                    <vs-chip 
                                        :color="item.if_distribuidor == 1 ? 'success' : 'dark'" 
                                        size="small"
                                    >
                                        {{ item.if_distribuidor == 1 ? 'Sí' : 'No' }}
                                    </vs-chip>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mobile-card-actions">
                            <vs-button 
                                v-if="item.ffp_estado == 1"
                                color="success" 
                                type="line" 
                                size="small"
                                @click="getNuevoEditarFormularioProforma(item); verificarcrear_actualizar='update'; tabFormularioProforma=item"
                            >
                                Editar
                            </vs-button>
                            <vs-button 
                                v-if="userRoot"
                                color="danger" 
                                type="line" 
                                size="small"
                                @click="getPreguntaEliminar(item); tabFormularioProforma=item"
                            >
                                Eliminar
                            </vs-button>
                            <vs-button 
                                :color="item.ffp_estado == 1 ? 'warning' : 'success'" 
                                type="line" 
                                size="small"
                                @click="popup_desactivar_activar_FormularioProforma(item)"
                            >
                                {{ item.ffp_estado == 1 ? 'Desactivar' : 'Activar' }}
                            </vs-button>
                        </div>
                    </div>
                </div>
                
                <!-- Paginación móvil -->
                <div class="mobile-pagination" v-if="ContUserAgrupados.length > 5">
                    <vs-pagination 
                        v-model="mobilePage"
                        :total="Math.ceil(ContUserAgrupados.length / mobileItemsPerPage)"
                        :max="5"
                    />
                </div>
            </div>
        </div>
    </vx-card>
    
    <!-- Modals -->
    <!-- SECCION REGISTRO -->
    <vs-popup class="registroagrupacion" fullscreen @close="getFormularioProformaConteo();" :title="verificarcrear_actualizar === 'create' ? 'Crear nuevo formulario' : `Actualizar formulario: ${tabFormularioProforma.ffp_id || ''}`" :active.sync="popupGuardarEditarFormularioProforma">
        <Nuevo_Edit_FormularioProforma v-if="popupGuardarEditarFormularioProforma" :verificarcrear_actualizar="verificarcrear_actualizar" :tabFormularioProforma="tabFormularioProforma" @change="changeHandleNuevoEditarFormularioProforma" />
    </vs-popup>
    
    <!-- SECCION ELIMINAR -->
    <vs-popup class="eliminar" @close="getFormularioProformaConteo();" :title="`¿Confirma que desea eliminar el formulario: ${tabFormularioProforma.ffp_id} ?`" :active.sync="popupActivoEliminarFormularioProforma">
        <Eliminar_FormularioProforma v-if="popupActivoEliminarFormularioProforma" :tabFormularioProforma="tabFormularioProforma" @change="changeHandleEliminarFormularioProforma" />
    </vs-popup>
    
    <!-- SECCION ACTIVAR/DESACTIVAR -->
    <vs-popup class="desactivar" @close="getFormularioProformaConteo();" :title="tabFormularioProforma.ffp_estado === 1
            ? `Desactivar el formulario: ${tabFormularioProforma.ffp_id || ''}`
            : tabFormularioProforma.ffp_estado === 0
            ? `Activar el formulario: ${tabFormularioProforma.ffp_id || ''}`
            : tabFormularioProforma.ffp_estado != 1 && tabFormularioProforma.ffp_estado != 0
            ? `Estado no controlado para: ${tabFormularioProforma.ffp_id || ''}`
            : 'Fomrulario'" :active.sync="popupActivoDesactivarFormularioProforma">
        <ActivarDesactivar_FormularioProforma v-if="popupActivoDesactivarFormularioProforma" :tabFormularioProforma="tabFormularioProforma" @change="changeHandleActivar_DesactivarFormularioProforma" />
    </vs-popup>
    
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacionformhijo" title="Información" :active.sync="popupInformacionFormularioProforma">
        <Informacion_FormularioProforma v-if="popupInformacionFormularioProforma" @change="changeHandleInformacionFormularioProforma" />
    </vs-popup>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
const Nuevo_Edit_FormularioProforma = () => import("@/views/pedidos2/pedidos/formulario/registro_edicion_fromulario.vue");
const Eliminar_FormularioProforma = () => import("@/views/pedidos2/pedidos/formulario/eliminar_fromulario.vue");
const ActivarDesactivar_FormularioProforma = () => import("@/views/pedidos2/pedidos/formulario/activar_desactivar_fromulario.vue");
const Informacion_FormularioProforma = () => import("@/views/pedidos2/pedidos/formulario/informacion_fromulario.vue");
export default {
    data() {
        return {
            Verificacionconteo: '',
            ContUserAgrupados: [],
            ContUserAgrupacion_sinfiltro: [],
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            popupGuardarEditarFormularioProforma: false,
            popupActivoEliminarFormularioProforma: false,
            popupActivoDesactivarFormularioProforma: false,
            popupInformacionFormularioProforma: false,
            ffp_id: 0,
            parametrobusqueda: "",
            busqueda: "",
            valorBusqueda: "0",
            conteoregistros: 0,
            registrosmaximos: 90000,
            verificarcrear_actualizar: 0,
            tabFormularioProforma: {},
            tipo: '0',
            mobilePage: 1,
            mobileItemsPerPage: 5,
        }
    },
    components: {
        'v-select': vSelect,
        Nuevo_Edit_FormularioProforma,
        Eliminar_FormularioProforma,
        ActivarDesactivar_FormularioProforma,
        Informacion_FormularioProforma
    },
    mounted() {
        this.getFormularioProformaConteo();
        // this.getFormularioProforma();
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        paginatedMobileData() {
            const start = (this.mobilePage - 1) * this.mobileItemsPerPage;
            const end = start + this.mobileItemsPerPage;
            return this.ContUserAgrupados.slice(start, end);
        },
    },
    methods: {
        limpiar() {
            this.parametrobusqueda = '';
            this.ContUserAgrupados = [];
        },
        getUsuariosLibrerias() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'GetUsuarios_PerfilLibrerias')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.UsuariosLibrerias = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getContratoAgrupado() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_Contratosagrupados_Completo')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContratoAgrupacion = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        //VERIFICA EL MAXIMO DE REGISTROS PARA MOSTRAR
        getFormularioProformaConteo() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_formularioProformaContador?conteo=' + me.registrosmaximos)
                .then(function (res) {
                    me.Verificacionconteo = res.data.mensaje;
                    me.conteoregistros = res.data.conteo;
                    // console.log(me.Verificacionconteo, "conteofianljeyson", me.conteoregistros)
                    if (me.Verificacionconteo == 'data_menor') {
                        me.ContUserAgrupados = [];
                        me.getFormularioProforma();
                        // console.log("entro aqui");
                    } else if (me.Verificacionconteo == 'data_igual') {
                        me.ContUserAgrupados = [];
                        //Se manda la funcion apra que en los nuevos registros
                        // me.getFormularioProforma_regduplicados();
                        me.getUsuariosLibrerias();
                        me.getContratoAgrupado();
                        me.getFormularioProformaParametro();
                        // console.log("entro ACA");
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay Tipo Empaque para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.ContUserAgrupados = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        getFormularioProforma() {
            let me = this;
            const proformasxperiodo = localStorage.getItem('pid');
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_formularioProforma?periodoelegido=' + proformasxperiodo)
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContUserAgrupados = res.data;
                    this.ContUserAgrupacion_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getFormularioProforma_regduplicados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'Get_formularioProforma')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.ContUserAgrupacion_sinfiltro = res.data;
                    me.$vs.loading.close()
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
        getFormularioProformaParametro() {
            let me = this;
            if (me.tipo == 0) {
                if (me.parametrobusqueda.trim().length < 1) {
                    me.$vs.notify({
                        text: 'Minimo 2 caracteres de busqueda',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.parametrobusqueda)
            this.$http.get(this.$server_url + 'GetformularioProforma_xfiltro?busqueda=' + me.busqueda + '&razonbusqueda=' + me.parametrobusqueda)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.ContUserAgrupados = res.data;
                    if (me.ContUserAgrupados.length === 0) {
                        me.$vs.notify({
                            text: 'No hay Agrupados para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.ContUserAgrupados = [];
                        me.$vs.loading.close()
                    } else {
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
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay Agrupados para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.ContUserAgrupados = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevoEditarFormularioProforma() {
            this.popupGuardarEditarFormularioProforma = true;
        },
        getPreguntaEliminar() {
            this.popupActivoEliminarFormularioProforma = true;
        },
        popup_desactivar_activar_FormularioProforma(tr) {
            this.tabFormularioProforma = tr;
            this.popupActivoDesactivarFormularioProforma = true;
        },
        getInformacionFormularioProforma() {
            this.popupInformacionFormularioProforma = true;
        },
        changeHandleNuevoEditarFormularioProforma(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarFormularioProforma = false;
                this.getFormularioProformaConteo();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarFormularioProforma = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEliminarFormularioProforma(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemiteliminar == 1) {
                console.log("Emit recibido por eliminado.");
                me.popupActivoEliminarFormularioProforma = false;
                this.getFormularioProformaConteo();
            } else if (e.verificacionemiteliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoEliminarFormularioProforma = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleActivar_DesactivarFormularioProforma(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitdesactivar == 1) {
                console.log("Emit recibido por activado/desactivado.");
                me.popupActivoDesactivarFormularioProforma = false;
                this.getFormularioProformaConteo();
            } else if (e.verificacionemitdesactivar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupActivoDesactivarFormularioProforma = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleInformacionFormularioProforma(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemitinformacion == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupInformacionFormularioProforma = false;
                this.getFormularioProformaConteo();
            } else if (e.verificacionemitinformacion == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupInformacionFormularioProforma = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
    },
}
</script>
<style scoped>
.formularios-container {
    max-width: 100%;
    margin: 0 auto;
}

.modern-card {
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    background: white;
    padding: 2rem;
}

/* Header Section */
.header-section {
    margin-bottom: 2rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
}

.header-left {
    flex: 1;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2c3e50;
    display: flex;
    align-items: center;
    margin: 0 0 0.5rem 0;
}

.title-icon {
    color: #007bff;
    margin-right: 0.75rem;
}

.page-subtitle {
    color: #6c757d;
    font-size: 1rem;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.action-button,
.info-button {
    white-space: nowrap;
}

/* Statistics Section */
.stats-section {
    margin-bottom: 2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card:nth-child(1) { border-left-color: #28a745; }
.stat-card:nth-child(2) { border-left-color: #007bff; }
.stat-card:nth-child(3) { border-left-color: #ffc107; }
.stat-card:nth-child(4) { border-left-color: #17a2b8; }

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.stat-icon.success { background: linear-gradient(135deg, #28a745, #20c997); }
.stat-icon.primary { background: linear-gradient(135deg, #007bff, #0056b3); }
.stat-icon.warning { background: linear-gradient(135deg, #ffc107, #e0a800); }
.stat-icon.info { background: linear-gradient(135deg, #17a2b8, #138496); }

.stat-content h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 0.25rem 0;
}

.stat-content p {
    font-size: 0.875rem;
    color: #6c757d;
    margin: 0;
    font-weight: 500;
}

/* Search Section */
.search-section {
    margin-bottom: 2rem;
}

.search-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e9ecef;
}

.search-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #dee2e6;
}

.search-icon {
    color: #007bff;
    margin-right: 0.75rem;
}

.search-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.search-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.search-input-container {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

.input-group {
    flex: 1;
    min-width: 280px;
}

.search-input,
.select-input {
    width: 100%;
}

.search-btn {
    white-space: nowrap;
    height: 38px;
}

.filter-options {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.filter-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.875rem;
}

.radio-group {
    display: flex;
    gap: 1.5rem;
}

/* Table Section */
.table-section {
    margin-top: 2rem;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e9ecef;
}

.table-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.table-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.count-chip {
    display: flex;
    align-items: center;
}

/* Table Styles */
.modern-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-row {
    transition: all 0.2s ease;
}

.table-row:hover {
    background-color: #f8f9fa !important;
    transform: scale(1.01);
}

/* Cell Styles */
.code-cell {
    padding: 1rem 0.75rem;
}

.code-container {
    display: flex;
    align-items: center;
}

.code-number {
    font-weight: 700;
    color: #007bff;
    font-size: 0.875rem;
}

.institution-cell {
    padding: 1rem 0.75rem;
}

.institution-info {
    display: flex;
    flex-direction: column;
}

.institution-main {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.institution-icon {
    color: #007bff;
    margin-top: 0.2rem;
}

.institution-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.875rem;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
}

.institution-city {
    font-size: 0.75rem;
    color: #6c757d;
    margin: 0;
    display: flex;
    align-items: center;
}

.financial-cell {
    padding: 1rem 0.75rem;
}

.financial-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.financial-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
}

.financial-icon {
    color: #28a745;
}

.financial-label {
    font-weight: 600;
    color: #495057;
    min-width: 45px;
}

.financial-value {
    font-weight: 700;
    color: #2c3e50;
}

.distribuidor-cell {
    padding: 1rem 0.75rem;
    text-align: center;
}

.distribuidor-badge {
    display: flex;
    justify-content: center;
}

.distribuidor-chip {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
}

.date-cell {
    padding: 1rem 0.75rem;
}

.date-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.date-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.date-icon {
    color: #6c757d;
    margin-top: 0.1rem;
}

.date-label {
    font-size: 0.625rem;
    color: #6c757d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 0.2rem 0;
}

.date-value {
    font-size: 0.75rem;
    color: #2c3e50;
    font-weight: 500;
    margin: 0;
}

.status-cell {
    padding: 1rem 0.75rem;
    text-align: center;
}

.status-chip {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
}

.actions-cell {
    padding: 1rem 0.75rem;
    text-align: center;
}

.actions-button {
    border-radius: 8px;
}
.actions-menu {
    min-width: 200px;
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.action-item {
    padding: 0.5rem;
}

.action-btn {
    width: 100%;
    justify-content: flex-start;
    border-radius: 6px;
    margin-bottom: 0.25rem;
}

.action-btn:last-child {
    margin-bottom: 0;
}

/* Modal Styles */
.informacionformhijo {
    z-index: 51001;
}

/* Responsive Views */
.desktop-view {
    display: block;
}

.mobile-view {
    display: none;
}

/* Mobile Cards */
.mobile-cards-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.mobile-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.mobile-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.mobile-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e9ecef;
}

.mobile-code {
    display: flex;
    align-items: center;
}

.code-label {
    font-weight: 700;
    color: #007bff;
    font-size: 1rem;
}

.mobile-status {
    display: flex;
    align-items: center;
}

.mobile-card-content {
    margin-bottom: 1rem;
}

.mobile-institution {
    margin-bottom: 1rem;
}

.mobile-institution-info {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.mobile-icon {
    color: #007bff;
    margin-top: 0.2rem;
}

.mobile-title {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
}

.mobile-subtitle {
    font-size: 0.875rem;
    color: #6c757d;
    margin: 0;
    display: flex;
    align-items: center;
}

.mobile-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.mobile-info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.mobile-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.mobile-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2c3e50;
}

.mobile-card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.mobile-card-actions .vs-button {
    flex: 1;
    min-width: auto;
}

.mobile-pagination {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
    .modern-card {
        padding: 1.5rem;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .desktop-view {
        display: none;
    }
    
    .mobile-view {
        display: block;
    }
    
    .modern-card {
        padding: 1rem;
    }
    
    .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .header-actions {
        width: 100%;
        justify-content: center;
    }
    
    .action-button,
    .info-button {
        flex: 1;
        max-width: 200px;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
    
    .stat-card {
        padding: 1rem;
    }
    
    .stat-content h4 {
        font-size: 1.25rem;
    }
    
    .search-input-container {
        flex-direction: column;
    }
    
    .input-group {
        min-width: 100%;
    }
    
    .filter-options {
        justify-content: center;
    }
    
    .radio-group {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
    
    .table-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .mobile-info-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .mobile-card-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .modern-card {
        padding: 0.75rem;
        margin: 0.5rem;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .stat-card {
        padding: 0.75rem;
    }
    
    .search-card {
        padding: 1rem;
    }
    
    .page-title {
        font-size: 1.5rem;
    }
    
    .mobile-card {
        padding: 0.75rem;
    }
    
    .mobile-title {
        font-size: 0.9rem;
    }
    
    .mobile-subtitle {
        font-size: 0.8rem;
    }
    
    .header-actions {
        flex-direction: column;
    }
    
    .action-button,
    .info-button {
        width: 100%;
        max-width: none;
    }
}

/* Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.formularios-container {
    animation: fadeIn 0.5s ease-out;
}

.stat-card,
.search-card,
.modern-table {
    animation: fadeIn 0.6s ease-out;
}
</style>
