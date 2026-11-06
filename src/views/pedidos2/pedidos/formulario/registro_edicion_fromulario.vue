<template>
<div class="form-container">
    <vx-card class="modern-card">
        <!-- Header -->
        <div class="form-header">
            <h3 class="form-title">
                <feather-icon 
                    :icon="verificarcrear_actualizar === 'create' ? 'PlusCircleIcon' : 'EditIcon'" 
                    size="20" 
                    class="mr-2"
                />
                {{ verificarcrear_actualizar === 'create' ? 'Crear Nuevo Formulario' : 'Editar Formulario' }}
            </h3>
        </div>

        <!-- Stepper -->
        <div class="stepper-container mb-6">
            <div class="stepper">
                <div class="step" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
                    <div class="step-circle">
                        <feather-icon icon="SearchIcon" size="16" />
                    </div>
                    <span class="step-label">Buscar Institución</span>
                </div>
                <div class="step-line" :class="{ 'completed': currentStep > 1 }"></div>
                <div class="step" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
                    <div class="step-circle">
                        <feather-icon icon="InfoIcon" size="16" />
                    </div>
                    <span class="step-label">Información</span>
                </div>
            </div>
        </div>

        <!-- Step 1: Búsqueda de Institución -->
        <div v-if="currentStep === 1" class="step-content">
            <div class="section-card">
                <div class="section-header">
                    <feather-icon icon="SearchIcon" size="18" class="section-icon" />
                    <h4 class="section-title">Búsqueda de Institución o Punto de Venta</h4>
                </div>
                
                <div class="search-container">
                    <div class="search-input-group">
                        <vs-input 
                            label="Busque la Institución o punto de venta" 
                            placeholder="Filtre por código o nombre" 
                            icon="search" 
                            class="search-input" 
                            @keyup.enter="getInstitucionesAsignar()" 
                            v-model="filtrocodnombre" 
                            ref="filtroinspunto" 
                            :class="classvalidarinstitucion"
                        />
                        <vs-button 
                            @click="getInstitucionesAsignar()" 
                            color="primary" 
                            type="filled"
                            class="search-button"
                            icon="search"
                        >
                            Buscar
                        </vs-button>
                    </div>
                    <div v-if="encontroresultados == 1" class="error-message">
                        <feather-icon icon="AlertTriangleIcon" size="16" class="mr-1" />
                        <span>No se encontraron resultados para su búsqueda</span>
                    </div>
                </div>

                <!-- Resultados de búsqueda -->
                <div v-if="InstitucionesBusqueda.length > 0" class="results-container">
                    <div class="results-header">
                        <feather-icon icon="ListIcon" size="18" class="mr-2" />
                        <h5>Resultados de Búsqueda</h5>
                        <vs-chip color="primary" class="ml-auto">
                            {{ InstitucionesBusqueda.length }} encontrados
                        </vs-chip>
                    </div>
                    
                    <div class="results-grid">
                        <div 
                            v-for="(institucion, index) in InstitucionesBusqueda" 
                            :key="index"
                            class="institution-card"
                            @click="seleccionInstitucion(institucion)"
                        >
                            <div class="institution-header">
                                <feather-icon icon="BuildingIcon" size="20" class="institution-icon" />
                                <h6 class="institution-name">{{ institucion.nombreInstitucion }}</h6>
                            </div>
                            <div class="institution-info">
                                <div class="info-item">
                                    <feather-icon icon="MapPinIcon" size="14" class="info-icon" />
                                    <span>{{ institucion.ciudad }}</span>
                                </div>
                            </div>
                            <div class="institution-actions">
                                <vs-button 
                                    size="small" 
                                    color="success" 
                                    type="filled"
                                    icon="check"
                                >
                                    Seleccionar
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 2: Información del Formulario -->
        <div v-if="currentStep === 2" class="step-content">
            <div class="section-card">
                <div class="section-header">
                    <feather-icon icon="InfoIcon" size="18" class="section-icon" />
                    <h4 class="section-title">Información del Formulario</h4>
                </div>

                <!-- Institución seleccionada -->
                <div class="selected-institution">
                    <div class="institution-display">
                        <feather-icon icon="CheckCircleIcon" size="20" class="success-icon" />
                        <div class="institution-details">
                            <h6>Institución Seleccionada</h6>
                            <p>{{ nombreciudadins }}</p>
                        </div>
                        <vs-button 
                            size="small" 
                            color="primary" 
                            type="border"
                            @click="currentStep = 1"
                            icon-pack="feather"
                            icon="icon-edit-2"
                        >
                            Cambiar
                        </vs-button>
                    </div>
                </div>

                <!-- Formulario de información -->
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">
                            <feather-icon icon="DollarSignIcon" size="16" class="label-icon" />
                            Promoción ventas
                        </label>
                        <vs-input 
                            placeholder="0.00" 
                            class="form-input" 
                            v-model="nuevoarray.ffp_credito" 
                            @keypress="validarCredito($event)" 
                            @paste="validarnopegar($event)"
                            ref="creditoInput"
                            :class="validationErrors.credito ? 'error-input' : ''"
                        />
                        <small class="input-help">Máximo 18 enteros, 2 decimales</small>
                        <small v-if="validationErrors.credito" class="error-text">{{ validationErrors.credito }}</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <feather-icon icon="CreditCardIcon" size="16" class="label-icon" />
                            Cupo Inicial
                        </label>
                        <vs-input 
                            placeholder="0.00" 
                            class="form-input" 
                            v-model="nuevoarray.ffp_cupo" 
                            @keypress="validarCupo($event)" 
                            @paste="validarnopegar($event)"
                            ref="cupoInput"
                            :class="validationErrors.cupo ? 'error-input' : ''"
                        />
                        <small class="input-help">Máximo 18 enteros, 2 decimales</small>
                        <small v-if="validationErrors.cupo" class="error-text">{{ validationErrors.cupo }}</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <feather-icon icon="PercentIcon" size="16" class="label-icon" />
                            Descuento
                        </label>
                        <vs-input 
                            placeholder="0" 
                            class="form-input" 
                            v-model="nuevoarray.ffp_descuento" 
                            @keypress="validarDescuento($event)" 
                            @paste="validarnopegar($event)"
                            ref="descuentoInput"
                            :class="validationErrors.descuento ? 'error-input' : ''"
                        />
                        <small class="input-help">Porcentaje (0-100)</small>
                        <small v-if="validationErrors.descuento" class="error-text">{{ validationErrors.descuento }}</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <feather-icon icon="PieChartIcon" size="16" class="label-icon" />
                            Porcentaje Facturación
                        </label>
                        <vs-input
                            placeholder="0"
                            class="form-input"
                            v-model="nuevoarray.ffp_porcentaje_facturacion"
                            @keypress="validarPorcentajeFacturacion($event)"
                            @paste="validarnopegar($event)"
                            ref="porcentajeFacturacionInput"
                            :disabled="!puedeEditarPorcentajeFacturacion"
                            :class="validationErrors.porcentaje_facturacion ? 'error-input' : ''"
                        />
                        <small class="input-help">Porcentaje entero (0-100)</small>
                        <small v-if="!puedeEditarPorcentajeFacturacion" class="input-help text-warning">Solo usuario root puede cambiar este porcentaje después de guardar.</small>
                        <small v-if="validationErrors.porcentaje_facturacion" class="error-text">{{ validationErrors.porcentaje_facturacion }}</small>
                    </div>

                    <div class="form-group full-width">
                        <div class="saldos-preview">
                            <div class="saldo-card saldo-prefacturas">
                                <div class="saldo-title">Saldo Prefacturas</div>
                                <div class="saldo-value">${{ saldoPrefacturasCalculado }}</div>
                            </div>
                            <div class="saldo-card saldo-notas">
                                <div class="saldo-title">Saldo Notas</div>
                                <div class="saldo-value">${{ saldoNotasCalculado }}</div>
                            </div>
                        </div>
                        <small class="input-help">Los saldos se calculan automáticamente desde Promoción ventas y Porcentaje Facturación.</small>
                    </div>

                    <div class="form-group full-width">
                        <label class="form-label">
                            <feather-icon icon="TruckIcon" size="16" class="label-icon" />
                            ¿Es Distribuidor?
                        </label>
                        <div class="distribuidor-toggle">
                            <vs-switch 
                                v-model="nuevoarray.if_distribuidor"
                                color="success"
                            >
                                <span slot="on">Sí</span>
                                <span slot="off">No</span>
                            </vs-switch>
                            <span class="toggle-label">
                                {{ nuevoarray.if_distribuidor ? 'Es distribuidor' : 'No es distribuidor' }}
                            </span>
                        </div>
                        <small class="input-help">Indique si esta institución actúa como distribuidor</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="form-navigation">
            <div class="nav-left">
                <vs-button 
                    v-if="currentStep === 2" 
                    @click="currentStep = 1" 
                    color="dark" 
                    type="border"
                    icon-pack="feather"
                    icon="icon-arrow-left"
                >
                    Anterior
                </vs-button>
            </div>
            <div class="nav-right">
                <vs-button 
                    v-if="currentStep === 1 && nuevoarray.idInstitucion" 
                    @click="currentStep = 2" 
                    color="primary" 
                    type="filled"
                    icon="arrow-right"
                >
                    Siguiente
                </vs-button>
                <vs-button 
                    v-if="currentStep === 2" 
                    @click="guardarnuevoeditarFormularioProforma()" 
                    color="success" 
                    type="filled"
                    icon="save"
                    :loading="loading"
                >
                    {{ verificarcrear_actualizar === 'create' ? 'Crear Formulario' : 'Actualizar Formulario' }}
                </vs-button>
                <vs-button 
                    @click="getCancelar()" 
                    color="danger" 
                    type="border"
                    icon="x"
                    class="ml-3"
                >
                    Cancelar
                </vs-button>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            Verificacionconteo: '',
            UsuariosLibrerias: [],
            ContratoAgrupacion: [],
            ffp_id: 0,
            nuevoarray: {},
            filtrocodnombre: '',
            encontroresultados: 0,
            InstitucionesBusqueda: [],
            classvalidarinstitucion: '',
            nombreciudadins: '',
            currentStep: 1,
            loading: false,
            validationErrors: {
                credito: '',
                cupo: '',
                descuento: '',
                porcentaje_facturacion: '',
                institucion: ''
            },
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: '',
        },
        tabFormularioProforma: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        if (me.verificarcrear_actualizar === 'create') {
            const proformasxperiodo = localStorage.getItem('pid');
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            me.nuevoarray = {
                idInstitucion: 0,
                idperiodoescolar: proformasxperiodo,
                ffp_credito: '',
                ffp_cupo: '',
                ffp_descuento: '',
                ffp_porcentaje_facturacion: '',
                if_distribuidor: false,
                nombreInstitucion: '',
                ciudad: '',
                user_created: usuarioObjeto.idusuario,
            };
            me.currentStep = 1;
        } else if (me.verificarcrear_actualizar === 'update') {
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            me.nuevoarray = { ...me.tabFormularioProforma };
            me.nuevoarray.if_distribuidor = me.nuevoarray.if_distribuidor || false;
            if (me.nuevoarray.ffp_porcentaje_facturacion === null || me.nuevoarray.ffp_porcentaje_facturacion === undefined || me.nuevoarray.ffp_porcentaje_facturacion === '') {
                me.nuevoarray.ffp_porcentaje_facturacion = 0;
            }
            me.nuevoarray.user_update = usuarioObjeto.idusuario;
            me.nombreciudadins = me.nuevoarray.nombreInstitucion + ' | Ciudad: ' + me.nuevoarray.ciudad;
            me.currentStep = 2;
        } else {
            console.log("Validación no controlada");
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        puedeEditarPorcentajeFacturacion() {
            if (this.verificarcrear_actualizar === 'create') {
                return true;
            }
            return !!this.userRoot;
        },
        saldoPrefacturasCalculado() {
            var credito = parseFloat(this.nuevoarray.ffp_credito);
            var porcentaje = parseInt(this.nuevoarray.ffp_porcentaje_facturacion, 10);

            if (isNaN(credito) || credito < 0) {
                credito = 0;
            }
            if (isNaN(porcentaje) || porcentaje < 0) {
                porcentaje = 0;
            }
            if (porcentaje > 100) {
                porcentaje = 100;
            }

            return ((credito * porcentaje) / 100).toFixed(2);
        },
        saldoNotasCalculado() {
            var credito = parseFloat(this.nuevoarray.ffp_credito);
            var saldoPrefacturas = parseFloat(this.saldoPrefacturasCalculado);

            if (isNaN(credito) || credito < 0) {
                credito = 0;
            }
            if (isNaN(saldoPrefacturas) || saldoPrefacturas < 0) {
                saldoPrefacturas = 0;
            }

            return (credito - saldoPrefacturas).toFixed(2);
        }
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        validarCredito(event) {
            let credito = this.nuevoarray.ffp_credito;
            // Verificar si la tecla presionada es un número
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (credito.includes(',')) {
                credito = credito.replace(',', '.');
                this.nuevoarray.ffp_credito = credito;
            }
            // Validar el formato del número
            if (!/^\d{0,18}(\.\d{0,2})?$/.test(credito)) {
                this.nuevoarray.ffp_credito = '';
                console.log("reset");
            }
        },
        validarCupo(event) {
            let cupo = this.nuevoarray.ffp_cupo;
            // Verificar si la tecla presionada es un número
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (cupo.includes(',')) {
                cupo = cupo.replace(',', '.');
                this.nuevoarray.ffp_cupo = cupo;
            }
            // Validar el formato del número
            if (!/^\d{0,18}(\.\d{0,2})?$/.test(cupo)) {
                this.nuevoarray.ffp_cupo = '';
                console.log("reset");
            }
        },
        validarDescuento(event) {
            let cupo = this.nuevoarray.ffp_descuento;
            // Verificar si la tecla presionada es un número
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Validar el formato del número
            if (!/^\d{0,4}(\.\d{0,0})?$/.test(cupo)) {
                this.nuevoarray.ffp_descuento = '';
                console.log("reset");
            }
            // Validar que no se ingrese un número mayor a 100
            let enteredValue = parseFloat(event.target.value + event.key);
            let descuentomaximo = 100;
            if (enteredValue > descuentomaximo) {
                // console.log("uno", enteredValue)
                // console.log("dos", descuentomaximo)
                event.preventDefault();
                this.$vs.notify({
                    text: "El descuento no puede exceder el 100%",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
            }
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');

            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        validarinsvacio() {
            if (this.nuevoarray.nombreInstitucion == "") {
                this.$vs.notify({
                    text: 'Debe realizar una búsqueda para completar este campo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 5000
                })
                this.validarcampoinstitucion();
                return false;
            }
        },
        validarcampoinstitucion() {
            const focusnombreInstitucion = this.$refs.filtroinspunto.$el.querySelector('input');
            focusnombreInstitucion.focus();
            this.classvalidarinstitucion = 'stylevalidar';

            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidarinstitucion = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        getInstitucionesAsignar() {
            let me = this;
            if (me.filtrocodnombre.trim().length <= 1) {
                me.$vs.notify({
                    text: 'La busqueda debe ser mayor a 1 caracter.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            this.$vs.loading();
            this.$http.get(this.$server_url + "listaInsitucion?busqueda=" + this.filtrocodnombre)
                .then(res => {
                    this.InstitucionesBusqueda = res.data;
                    // this.arregloInstitucionAsignada = datos.map(libro => ({
                    //     pro_codigo: libro.pro_codigo,
                    //     nombrelibro: libro.pro_nombre,
                    // }));
                    // console.log(this.InstitucionesBusqueda.length, "arregloseleccion");
                    if (this.InstitucionesBusqueda.length <= 0) {
                        this.encontroresultados = 1
                    } else {
                        this.encontroresultados = 0;
                    }
                    this.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener libros:', error);
                    this.$vs.loading.close();
                });
        },
        seleccionInstitucion(tr) {
            this.nuevoarray.nombreInstitucion = tr.nombreInstitucion;
            this.nuevoarray.idInstitucion = tr.idInstitucion;
            this.nuevoarray.ciudad = tr.ciudad;
            this.nombreciudadins = this.nuevoarray.nombreInstitucion + ' | Ciudad: ' + this.nuevoarray.ciudad;
            this.filtrocodnombre = '';
            this.InstitucionesBusqueda = [];
            this.currentStep = 2;
        },
        guardarnuevoeditarFormularioProforma() {
            let me = this;
            
            // Limpiar errores previos
            this.clearValidationErrors();
            
            // Validar todos los campos
            if (!this.validateAllFields()) {
                return;
            }
            
            me.loading = true;
            if (me.verificarcrear_actualizar === 'create') {
                let datos = {
                    "idInstitucion": this.nuevoarray.idInstitucion,
                    "idperiodoescolar": this.nuevoarray.idperiodoescolar,
                    "ffp_credito": this.nuevoarray.ffp_credito,
                    "ffp_cupo": this.nuevoarray.ffp_cupo,
                    "ffp_descuento": this.nuevoarray.ffp_descuento,
                    "ffp_porcentaje_facturacion": this.nuevoarray.ffp_porcentaje_facturacion,
                    "if_distribuidor": this.nuevoarray.if_distribuidor ? 1 : 0,
                    "user_created": this.nuevoarray.user_created,
                }
                this.$http.post(this.$server_url + 'Post_Registrar_modificar_formularioProforma', datos)
                    .then(res => {
                        me.loading = false;
                        me.$vs.notify({
                            text: 'Formulario guardado con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    })
                    .catch(function (error) {
                        me.loading = false;
                        if (error.response && error.response.status === 500 && error.response.data.message.includes('Duplicate entry')) {
                            let errorMessage = 'No se puede guardar, ya existe un registro en este período con esta Institución/Punto de venta.';
                            me.$vs.notify({
                                text: errorMessage,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000
                            });
                        } else {
                            console.log(error + ' error');
                        }
                    });
            } else if (me.verificarcrear_actualizar === 'update') {
                let datos = {
                    "ffp_id": this.nuevoarray.ffp_id,
                    "idInstitucion": this.nuevoarray.idInstitucion,
                    "idperiodoescolar": this.nuevoarray.idperiodoescolar,
                    "ffp_credito": this.nuevoarray.ffp_credito,
                    "ffp_cupo": this.nuevoarray.ffp_cupo,
                    "ffp_descuento": this.nuevoarray.ffp_descuento,
                    "ffp_porcentaje_facturacion": this.nuevoarray.ffp_porcentaje_facturacion,
                    "if_distribuidor": this.nuevoarray.if_distribuidor ? 1 : 0,
                    "user_update": this.nuevoarray.user_update,
                }
                this.$http.post(this.$server_url + 'Post_Registrar_modificar_formularioProforma', datos)
                    .then(res => {
                        me.loading = false;
                        me.$vs.notify({
                            text: 'Formulario editado con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    })
                    .catch(function (error) {
                        me.loading = false;
                        if (error.response && error.response.status === 500 && error.response.data.message.includes('Duplicate entry')) {
                            let errorMessage = 'No se puede guardar, ya existe un registro en este período con esta Institución/Punto de venta.';
                            me.$vs.notify({
                                text: errorMessage,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000
                            });
                        } else {
                            console.log(error + ' error');
                        }
                    });
            } else {
                console.log("Guardado no controlado");
            }
        },
        
        // Validación completa de todos los campos
        validateAllFields() {
            let isValid = true;
            
            // Validar institución
            if (!this.nuevoarray.idInstitucion || this.nuevoarray.idInstitucion === 0) {
                this.validationErrors.institucion = 'Debe seleccionar una institución';
                this.currentStep = 1;
                this.$vs.notify({
                    text: 'Seleccione una Institución antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                this.validarcampoinstitucion();
                isValid = false;
            }
            
            // Validar crédito
            if (!this.nuevoarray.ffp_credito || this.nuevoarray.ffp_credito.toString().trim() === '') {
                this.validationErrors.credito = 'El campo crédito es obligatorio';
                this.focusField('creditoInput');
                isValid = false;
            } else if (isNaN(this.nuevoarray.ffp_credito) || parseFloat(this.nuevoarray.ffp_credito) <= 0) {
                this.validationErrors.credito = 'El crédito debe ser un número mayor a 0';
                this.focusField('creditoInput');
                isValid = false;
            }
            
            // Validar cupo
            if (!this.nuevoarray.ffp_cupo || this.nuevoarray.ffp_cupo.toString().trim() === '') {
                this.validationErrors.cupo = 'El campo cupo es obligatorio';
                this.focusField('cupoInput');
                isValid = false;
            } else if (isNaN(this.nuevoarray.ffp_cupo) || parseFloat(this.nuevoarray.ffp_cupo) <= 0) {
                this.validationErrors.cupo = 'El cupo debe ser un número mayor a 0';
                this.focusField('cupoInput');
                isValid = false;
            }
            
            // Validar descuento
            if (!this.nuevoarray.ffp_descuento || this.nuevoarray.ffp_descuento.toString().trim() === '') {
                this.validationErrors.descuento = 'El campo descuento es obligatorio';
                this.focusField('descuentoInput');
                isValid = false;
            } else if (isNaN(this.nuevoarray.ffp_descuento) || parseFloat(this.nuevoarray.ffp_descuento) < 0 || parseFloat(this.nuevoarray.ffp_descuento) > 100) {
                this.validationErrors.descuento = 'El descuento debe ser un número entre 0 y 100';
                this.focusField('descuentoInput');
                isValid = false;
            }

            // Validar porcentaje de facturación
            if (this.nuevoarray.ffp_porcentaje_facturacion === '' || this.nuevoarray.ffp_porcentaje_facturacion === null || this.nuevoarray.ffp_porcentaje_facturacion === undefined) {
                this.validationErrors.porcentaje_facturacion = 'El porcentaje de facturación es obligatorio';
                this.focusField('porcentajeFacturacionInput');
                isValid = false;
            } else if (isNaN(this.nuevoarray.ffp_porcentaje_facturacion) || parseInt(this.nuevoarray.ffp_porcentaje_facturacion, 10) < 0 || parseInt(this.nuevoarray.ffp_porcentaje_facturacion, 10) > 100) {
                this.validationErrors.porcentaje_facturacion = 'El porcentaje de facturación debe ser un entero entre 0 y 100';
                this.focusField('porcentajeFacturacionInput');
                isValid = false;
            }
            
            return isValid;
        },
        
        // Limpiar errores de validación
        clearValidationErrors() {
            this.validationErrors = {
                credito: '',
                cupo: '',
                descuento: '',
                porcentaje_facturacion: '',
                institucion: ''
            };
        },
        
        // Enfocar campo con error
        focusField(refName) {
            this.currentStep = 2; // Asegurar que estamos en el paso correcto
            this.$nextTick(() => {
                if (this.$refs[refName]) {
                    const input = this.$refs[refName].$el.querySelector('input');
                    if (input) {
                        input.focus();
                        input.select();
                        // Agregar clase de error con animación
                        this.$refs[refName].$el.classList.add('shake-animation');
                        setTimeout(() => {
                            this.$refs[refName].$el.classList.remove('shake-animation');
                        }, 1000);
                    }
                }
            });
        },
        
        // Validación en tiempo real para crédito
        validarCredito(event) {
            // Limpiar error cuando el usuario empieza a escribir
            if (this.validationErrors.credito) {
                this.validationErrors.credito = '';
            }
            
            let credito = this.nuevoarray.ffp_credito;
            // Verificar si la tecla presionada es un número
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (credito && credito.includes(',')) {
                credito = credito.replace(',', '.');
                this.nuevoarray.ffp_credito = credito;
            }
            // Validar el formato del número
            if (credito && !/^\d{0,18}(\.\d{0,2})?$/.test(credito)) {
                this.nuevoarray.ffp_credito = '';
                console.log("reset");
            }
        },
        
        // Validación en tiempo real para cupo
        validarCupo(event) {
            // Limpiar error cuando el usuario empieza a escribir
            if (this.validationErrors.cupo) {
                this.validationErrors.cupo = '';
            }
            
            let cupo = this.nuevoarray.ffp_cupo;
            // Verificar si la tecla presionada es un número
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (cupo && cupo.includes(',')) {
                cupo = cupo.replace(',', '.');
                this.nuevoarray.ffp_cupo = cupo;
            }
            // Validar el formato del número
            if (cupo && !/^\d{0,18}(\.\d{0,2})?$/.test(cupo)) {
                this.nuevoarray.ffp_cupo = '';
                console.log("reset");
            }
        },
        
        // Validación en tiempo real para descuento
        validarDescuento(event) {
            // Limpiar error cuando el usuario empieza a escribir
            if (this.validationErrors.descuento) {
                this.validationErrors.descuento = '';
            }
            
            let cupo = this.nuevoarray.ffp_descuento;
            // Verificar si la tecla presionada es un número
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Validar el formato del número
            if (cupo && !/^\d{0,4}(\.\d{0,0})?$/.test(cupo)) {
                this.nuevoarray.ffp_descuento = '';
                console.log("reset");
            }
            // Validar que no se ingrese un número mayor a 100
            let enteredValue = parseFloat((event.target.value || '') + event.key);
            let descuentomaximo = 100;
            if (enteredValue > descuentomaximo) {
                event.preventDefault();
                this.$vs.notify({
                    text: "El descuento no puede exceder el 100%",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
            }
        },
        validarPorcentajeFacturacion(event) {
            if (!this.puedeEditarPorcentajeFacturacion) {
                event.preventDefault();
                return;
            }

            if (this.validationErrors.porcentaje_facturacion) {
                this.validationErrors.porcentaje_facturacion = '';
            }

            var tecla = event.key;
            if (!/\d/.test(tecla)) {
                event.preventDefault();
                return;
            }

            var valorActual = this.nuevoarray.ffp_porcentaje_facturacion ? this.nuevoarray.ffp_porcentaje_facturacion.toString() : '';
            var valorIngresado = parseInt(valorActual + tecla, 10);

            if (!isNaN(valorIngresado) && valorIngresado > 100) {
                event.preventDefault();
                this.$vs.notify({
                    text: "El porcentaje de facturación no puede exceder el 100%",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
            }
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
    },
};
</script>

<style scoped>
.form-container {
    max-width: 1200px;
    margin: 0 auto;
}

.modern-card {
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
    padding: 2rem;
}

.form-header {
    text-align: center;
    margin-bottom: 2rem;
}

.form-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stepper-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
}

.stepper {
    display: flex;
    align-items: center;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.5;
    transition: all 0.3s ease;
}

.step.active {
    opacity: 1;
}

.step.completed {
    opacity: 1;
    color: #28a745;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.step.active .step-circle {
    background: #007bff;
    color: white;
}

.step.completed .step-circle {
    background: #28a745;
    color: white;
}

.step-line {
    width: 60px;
    height: 2px;
    background: #e9ecef;
    margin: 0 1rem;
    transition: all 0.3s ease;
}

.step-line.completed {
    background: #28a745;
}

.step-label {
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    margin-top: 0.5rem;
}

.step-content {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.section-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
}

.section-icon {
    color: #007bff;
    margin-right: 0.75rem;
}

.section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.search-container {
    margin-bottom: 1.5rem;
}

.search-input-group {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

.search-input {
    flex: 1;
}

.search-button {
    height: 38px;
    white-space: nowrap;
}

.error-message {
    display: flex;
    align-items: center;
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.results-container {
    margin-top: 1.5rem;
}

.results-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e9ecef;
}

.results-header h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.institution-card {
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.institution-card:hover {
    border-color: #007bff;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.1);
    transform: translateY(-2px);
}

.institution-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
}

.institution-icon {
    color: #007bff;
    margin-right: 0.5rem;
}

.institution-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.institution-info {
    margin-bottom: 1rem;
}

.info-item {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.info-icon {
    margin-right: 0.5rem;
}

.institution-actions {
    text-align: right;
}

.selected-institution {
    margin-bottom: 2rem;
}

.institution-display {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.success-icon {
    color: #28a745;
}

.institution-details {
    flex: 1;
}

.institution-details h6 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #155724;
    margin: 0 0 0.25rem 0;
}

.institution-details p {
    font-size: 0.875rem;
    color: #155724;
    margin: 0;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.label-icon {
    margin-right: 0.5rem;
    color: #007bff;
}

.form-input {
    width: 100%;
}

.input-help {
    color: #6c757d;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

.distribuidor-toggle {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.saldos-preview {
    display: grid;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    gap: 0.75rem;
}

.saldo-card {
    border-radius: 10px;
    padding: 0.85rem;
    border: 1px solid #dfe7f5;
    background: #f8fbff;
}

.saldo-prefacturas {
    border-left: 4px solid #28c76f;
}

.saldo-notas {
    border-left: 4px solid #ff9f43;
}

.saldo-title {
    font-size: 0.78rem;
    color: #6c757d;
    font-weight: 600;
}

.saldo-value {
    font-size: 1.1rem;
    color: #1e1e1e;
    font-weight: 700;
    margin-top: 0.2rem;
}

.toggle-label {
    font-size: 0.875rem;
    color: #2c3e50;
    font-weight: 500;
}

.form-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e9ecef;
}

.nav-left,
.nav-right {
    display: flex;
    gap: 0.75rem;
}

.stylevalidar {
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

/* Estilos para validación de errores */
.error-input {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

.error-text {
    color: #dc3545;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
}

.error-text::before {
    content: "⚠️";
    margin-right: 0.25rem;
}

/* Animación de shake para campos con error */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.shake-animation {
    animation: shake 0.6s ease-in-out;
}

/* Mejorar el aspecto de los inputs con errores */
.vs-input.error-input .vs-input-content {
    border-color: #dc3545 !important;
}

.vs-input.error-input .vs-input-content:focus-within {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

@media (max-width: 768px) {
    .modern-card {
        padding: 1rem;
    }
    
    .search-input-group {
        flex-direction: column;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }

    .saldos-preview {
        grid-template-columns: 1fr;
    }
    
    .form-navigation {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-left,
    .nav-right {
        width: 100%;
        justify-content: center;
    }
    
    .stepper {
        flex-direction: column;
        text-align: center;
    }
    
    .step-line {
        display: none;
    }
}
</style>
