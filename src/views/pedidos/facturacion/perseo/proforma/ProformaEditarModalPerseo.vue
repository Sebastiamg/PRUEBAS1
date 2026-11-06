<template>
    <vs-popup-history
        fullscreen
        :title="`Editar Proforma - Perseo - ${proformaData.prof_id || 'Cargando...'}`"
        :active.sync="popupEditar"
        @close="cerrarModal"
        :confirm-close="true"
        confirm-message="¿Estás seguro de cerrar la edición de la proforma? Los cambios no guardados se perderán."
        class="popup-proforma"
    >
        <div v-if="popupEditar && proformaId" id="div-with-loading">
            <!-- Loading mientras carga los datos -->
            <div v-if="loadingDatos" class="text-center py-12">
                <div class="loading-spinner mb-4">
                    <div class="spinner"></div>
                </div>
                <p class="text-gray-600 text-lg">Cargando datos de la proforma...</p>
            </div>
            
            <!-- Contenido del editor cuando ya cargó -->
            <div v-else>
                
                <!-- Barra de totales anclada (sticky) - Versión ultra compacta -->
                <div v-if="calcularTotalesUnificados().cantidadLibros > 0" class="barra-totales-sticky-compacta" >
                    <div class="contenido-barra-compacta" :class="debeMostrarCupo() && (nuevoLugarDespacho || lugarDespacho.nombreInstitucion) && !tieneCupoSuficiente() ? 'barra-error' : 'barra-normal'">
                        <!-- Para venta por lista con cupo (solo primera proforma) -->
                        <div v-if="debeMostrarCupo() && (nuevoLugarDespacho || lugarDespacho.nombreInstitucion)" class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="badge-items">
                                    <feather-icon icon="BookOpenIcon" size="10" class="inline mr-1"></feather-icon>
                                    {{ calcularTotalesUnificados().cantidadLibros }} items
                                </span>
                                <span class="badge-cupo" :class="!tieneCupoSuficiente() ? 'badge-error' : 'badge-success'">
                                    <feather-icon icon="CreditCardIcon" size="10" class="inline mr-1"></feather-icon>
                                    Cupo: ${{ obtenerCupoMaximo() }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span v-if="!tieneCupoSuficiente()" class="error-cupo">
                                    <feather-icon icon="AlertTriangleIcon" size="10" class="inline mr-1"></feather-icon>
                                    ¡CUPO SUPERADO!
                                </span>
                                <span class="badge-total" :class="!tieneCupoSuficiente() ? 'badge-error' : 'badge-success'">
                                    <feather-icon icon="DollarSignIcon" size="10" class="inline mr-1"></feather-icon>
                                    ${{ calcularTotalesUnificados().total.toFixed(2) }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Para venta directa -->
                        <div v-else class="flex items-center justify-between">
                            <span class="badge-items">
                                <feather-icon icon="BookOpenIcon" size="10" class="inline mr-1"></feather-icon>
                                {{ calcularTotalesUnificados().cantidadLibros }} items seleccionados
                            </span>
                            <span class="badge-total badge-success">
                                <feather-icon icon="DollarSignIcon" size="10" class="inline mr-1"></feather-icon>
                                Total: ${{ calcularTotalesUnificados().total.toFixed(2) }}
                            </span>
                        </div>
                    </div>
                </div>


                <!-- Información del pedido/contrato (NO EDITABLE) -->
                <vx-card class="mb-4">
                    <template slot="header">
                        <h4>Información del Contrato (No editable)</h4>
                    </template>
                    <div class="container-fluid small py-1 border-bottom mb-2">
                        <div class="row g-1 align-items-center">
                            <div class="col-auto">
                                <strong>Contrato:</strong> {{ proformaData.contrato }}
                            </div>
                            <div class="col-auto">
                                <strong>Código Proforma:</strong> <span class="text-primary font-bold">{{ proformaData.prof_id }}</span>
                            </div>
                            <div class="col-auto flex">
                                <strong>Estado:</strong> 
                                <vs-chip :color="getEstadoColor(proformaData.prof_estado)" size="small">
                                    {{ getEstadoTexto(proformaData.prof_estado) }}
                                </vs-chip>
                            </div>
                            <div class="col-auto">
                                <strong>Creado:</strong> {{ proformaData.created_at }}
                            </div>
                        </div>
                    </div>
                </vx-card>

                <!-- Selección de Empresa -->
                <vx-card class="mb-4">
                    <template slot="header">
                        <h4>Configuración de Proforma</h4>
                    </template>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Empresa -->
                        <div>
                            <label class="font-bold mb-2 block">
                                <feather-icon icon="BuildingIcon" size="12" class="inline mr-1"></feather-icon>
                                Empresa <span class="text-danger">*</span>
                            </label>
                            
                            <!-- Empresa ACTUAL (solo lectura) -->
                            <div class="p-3 bg-gray-50 rounded border mb-2">
                                <div class="text-xs text-gray-500 mb-1">ACTUAL:</div>
                                <div class="font-bold text-success">
                                    <i class="fas fa-building mr-1"></i>
                                    {{ empresaActual.nombre || 'Cargando...' }} {{ 'ID: ' + (empresaActual.id || 'N/A') }}
                                </div>
                            </div>
                            
                            <!-- Mensaje si cambió la empresa -->
                            <div v-if="empresaCambiada" class="p-2 bg-blue-50 rounded border border-blue-300">
                                <div class="text-xs text-blue-600 font-bold">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Empresa modificada
                                </div>
                            </div>
                        </div>
                        
                        <!-- Descuento -->
                        <div>
                            <label class="font-bold mb-2 block">
                                Descuento (%)
                            </label>
                            
                            <!-- Descuento ACTUAL (solo lectura) -->
                            <div class="p-3 bg-gray-50 rounded border mb-2">
                                <div class="text-xs text-gray-500 mb-1">ACTUAL:</div>
                                <div class="font-bold text-success">
                                    <i class="fas fa-percentage mr-1"></i>
                                    {{ datosOriginales ? datosOriginales.proformaData.pro_des_por : 0 }}%
                                </div>
                            </div>
                            
                            <!-- Input para CAMBIAR descuento -->
                            <div class="mb-2">
                                <label class="text-xs text-gray-600 mb-1 block">Cambiar a:</label>
                                <vs-input
                                    type="number"
                                    placeholder="0"
                                    v-model="proformaData.pro_des_por"
                                    @blur="validarYCorregirDescuentoPrincipal(1)"
                                    min="0"
                                    max="100"
                                    class="w-full"
                                />
                            </div>
                            
                            <!-- Mensaje si cambió el descuento -->
                            <div v-if="descuentoCambiado" class="p-2 bg-blue-50 rounded border border-blue-300">
                                <div class="text-xs text-blue-600 font-bold">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Descuento modificado
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Lugar de Despacho y Cliente -->
                    <div class="mt-4">
                        <h5 class="font-bold mb-3">
                            <feather-icon icon="TruckIcon" size="12" class="inline mr-2"></feather-icon>
                            Información de Despacho
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Lugar de Despacho -->
                            <div>
                                <label class="font-bold mb-2 block">
                                    <feather-icon icon="MapPinIcon" size="12" class="inline mr-1"></feather-icon>
                                    Lugar de Despacho <span class="text-danger">*</span>
                                </label>
                                
                                <!-- Lugar de despacho ACTUAL -->
                                <div class="p-3 bg-gray-50 rounded border mb-2">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <div class="text-xs text-gray-500 mb-1">ACTUAL:</div>
                                            <div class="font-bold text-success">
                                                <i class="fas fa-check-circle mr-1"></i>
                                                {{ lugarDespacho.nombreInstitucion || 'Cargando...' }}
                                            </div>
                                            <div class="text-sm text-gray-600">
                                                {{ lugarDespacho.ciudad ? 'Ciudad: ' + lugarDespacho.ciudad : '' }}
                                            </div>
                                            
                                            <!-- Información de cupo del lugar actual (si existe y debe mostrarse) -->
                                            <div v-if="debeMostrarCupo() && lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0" class="lugar-financiero mt-2">
                                                <div>
                                                    <strong>Crédito:</strong> {{ lugarDespacho.datosInstitucion[0].ffp_credito }} | 
                                                    <strong>Cupo:</strong> {{ lugarDespacho.datosInstitucion[0].ffp_cupo }} | 
                                                    <strong>Desc:</strong> {{ lugarDespacho.datosInstitucion[0].ffp_descuento }}%
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <vs-button 
                                                size="small" 
                                                color="primary" 
                                                type="border"
                                                @click="abrirBusquedaDespacho"
                                            >
                                                <i class="fas fa-edit mr-1"></i>
                                                Cambiar Lugar
                                            </vs-button>
                                            
                                            <!-- Botón para editar cupo del lugar ACTUAL (solo si debe mostrar cupo y NO hay nuevo lugar) -->
                                            <vs-button 
                                                v-if="debeMostrarCupo() && !nuevoLugarDespacho"
                                                size="small" 
                                                :color="lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0 ? 'warning' : 'success'"
                                                type="flat"
                                                @click="editarCupoLugarActual()"
                                            >
                                                <i :class="lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0 ? 'fas fa-edit' : 'fas fa-plus-circle'" class="mr-1"></i>
                                                {{ lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0 ? 'Editar Cupo' : 'Configurar Cupo' }}
                                            </vs-button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Formulario para editar cupo del lugar ACTUAL (si no hay nuevo lugar seleccionado) -->
                                <div v-if="debeMostrarCupo() && showFormularioCupoActual && !nuevoLugarDespacho" class="formulario-cupo-inline mt-3">
                                    <div class="formulario-cupo-header">
                                        <h4>
                                            <feather-icon icon="EditIcon" size="16" class="mr-2"></feather-icon>
                                            {{ formularioCupoData.ffp_id ? 'Editar Cupo del Lugar Actual' : 'Configurar Cupo del Lugar Actual' }}
                                        </h4>
                                    </div>
                                    
                                    <div class="formulario-cupo-grid">
                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="BuildingIcon" size="14" class="mr-1"></feather-icon>
                                                Institución
                                            </label>
                                            <div class="institucion-display-cupo">
                                                <span>{{ formularioCupoData.nombreInstitucion || lugarDespacho.nombreInstitucion }}</span>
                                                <small>{{ formularioCupoData.ciudad || lugarDespacho.ciudad }}</small>
                                            </div>
                                        </div>

                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="DollarSignIcon" size="14" class="mr-1"></feather-icon>
                                                Crédito General
                                            </label>
                                            <vs-input 
                                                v-model="formularioCupoData.ffp_credito" 
                                                placeholder="0.00"
                                                class="w-full"
                                            />
                                        </div>

                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="CreditCardIcon" size="14" class="mr-1"></feather-icon>
                                                Cupo <span class="text-danger">*</span>
                                            </label>
                                            <vs-input 
                                                v-model="formularioCupoData.ffp_cupo" 
                                                placeholder="0.00"
                                                class="w-full"
                                            />
                                        </div>

                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="PercentIcon" size="14" class="mr-1"></feather-icon>
                                                Descuento (%) XD
                                            </label>
                                            <vs-input 
                                                v-model="formularioCupoData.ffp_descuento" 
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                class="w-full"
                                                @blur="validarYCorregirDescuentoPrincipal(2)"
                                            />
                                        </div>
                                        
                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="PackageIcon" size="14" class="mr-1"></feather-icon>
                                                Tipo de Cliente
                                            </label>
                                            <div class="flex items-center gap-2">
                                                <vs-switch v-model="formularioCupoData.if_distribuidor" />
                                                <span class="text-sm">{{ formularioCupoData.if_distribuidor ? 'Es distribuidor' : 'No es distribuidor' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="formulario-cupo-actions">
                                        <vs-button 
                                            @click="guardarFormularioCupo()" 
                                            color="success"
                                            size="small"
                                            icon="save"
                                            icon-pack="material-icons"
                                        >
                                            Guardar
                                        </vs-button>
                                        
                                        <vs-button 
                                            @click="showFormularioCupoActual = false" 
                                            color="danger"
                                            type="flat"
                                            size="small"
                                            icon="close"
                                            icon-pack="material-icons"
                                        >
                                            Cancelar
                                        </vs-button>
                                    </div>
                                </div>
                                
                                <!-- NUEVO lugar de despacho (si se seleccionó) -->
                                <div v-if="nuevoLugarDespacho" class="lugar-display mb-3">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="flex: 1;">
                                            <div class="text-xs text-blue-600 font-bold mb-2" style="display: flex; align-items: center;">
                                                <i class="fas fa-arrow-right mr-2"></i> 
                                                <span>NUEVO:</span>
                                            </div>
                                            <div class="lugar-titulo">
                                                {{ nuevoLugarDespacho.nombreInstitucion }}
                                            </div>
                                            <div class="lugar-ciudad">
                                                {{ nuevoLugarDespacho.ciudad }}
                                            </div>
                                            
                                            <!-- Información financiera si existe (solo primera proforma + venta por lista) -->
                                            <div v-if="debeMostrarCupo() && nuevoLugarDespacho.datosInstitucion && nuevoLugarDespacho.datosInstitucion.length > 0" class="lugar-financiero" style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                                                <div>
                                                    <strong>Crédito:</strong> {{ nuevoLugarDespacho.datosInstitucion[0].ffp_credito }} | 
                                                    <strong>Cupo:</strong> {{ nuevoLugarDespacho.datosInstitucion[0].ffp_cupo }} | 
                                                    <strong>Desc:</strong> {{ nuevoLugarDespacho.datosInstitucion[0].ffp_descuento }}%
                                                </div>
                                                <vs-button 
                                                    @click="toggleFormularioCupo()" 
                                                    color="primary" 
                                                    type="flat" 
                                                    size="small"
                                                    class="lugar-btn-editar"
                                                    :icon="showFormularioCupo ? 'visibility_off' : 'edit'"
                                                    icon-pack="material-icons"
                                                >
                                                    {{ showFormularioCupo ? 'Ocultar' : 'Editar Cupo' }}
                                                </vs-button>
                                            </div>
                                            
                                            <!-- Botón para CONFIGURAR cupo si NO existe (solo primera proforma + venta por lista) -->
                                            <div v-else-if="debeMostrarCupo()" class="lugar-sin-cupo" style="margin-top: 12px;">
                                                <div>
                                                    <i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i>
                                                    <span>
                                                        <strong>Cupo no configurado</strong> - Configure el cupo para este lugar de despacho
                                                    </span>
                                                </div>
                                                <vs-button 
                                                    @click="toggleFormularioCupo()" 
                                                    color="warning" 
                                                    type="filled" 
                                                    size="small"
                                                    icon="add_circle"
                                                    icon-pack="material-icons"
                                                    class="btn-configurar-cupo"
                                                >
                                                    Configurar Cupo
                                                </vs-button>
                                            </div>
                                        </div>
                                        <vs-button 
                                            size="small" 
                                            color="danger" 
                                            type="flat"
                                            @click="cancelarCambioDespacho"
                                            class="ml-2"
                                        >
                                            <i class="fas fa-times"></i>
                                        </vs-button>
                                    </div>
                                </div>
                                
                                <!-- Formulario inline para editar/crear cupo (solo primera proforma + venta por lista) -->
                                <div v-if="debeMostrarCupo() && showFormularioCupo && nuevoLugarDespacho" class="formulario-cupo-inline mt-3">
                                    <div class="formulario-cupo-header">
                                        <h4>
                                            <feather-icon icon="EditIcon" size="16" class="mr-2"></feather-icon>
                                            {{ formularioCupoData.ffp_id ? 'Editar Información del Formulario' : 'Configurar Nuevo Formulario' }}
                                        </h4>
                                    </div>
                                    
                                    <div class="formulario-cupo-grid">
                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="BuildingIcon" size="14" class="mr-1"></feather-icon>
                                                Institución
                                            </label>
                                            <div class="institucion-display-cupo">
                                                <span>{{ formularioCupoData.nombreInstitucion || nuevoLugarDespacho.nombreInstitucion }}</span>
                                                <small>{{ formularioCupoData.ciudad || nuevoLugarDespacho.ciudad }}</small>
                                            </div>
                                        </div>

                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="DollarSignIcon" size="14" class="mr-1"></feather-icon>
                                                Crédito General
                                            </label>
                                            <vs-input 
                                                v-model="formularioCupoData.ffp_credito" 
                                                placeholder="0.00"
                                                class="w-full"
                                            />
                                        </div>

                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="CreditCardIcon" size="14" class="mr-1"></feather-icon>
                                                Cupo <span class="text-danger">*</span>
                                            </label>
                                            <vs-input 
                                                v-model="formularioCupoData.ffp_cupo" 
                                                placeholder="0.00"
                                                class="w-full"
                                            />
                                        </div>

                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="PercentIcon" size="14" class="mr-1"></feather-icon>
                                                Descuento (%)
                                            </label>
                                            <vs-input 
                                                v-model="formularioCupoData.ffp_descuento" 
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                class="w-full"
                                                @blur="normalizarDescuentoCupo"
                                            />
                                        </div>
                                        
                                        <div class="form-group-cupo">
                                            <label class="form-label-cupo">
                                                <feather-icon icon="PackageIcon" size="14" class="mr-1"></feather-icon>
                                                Tipo de Cliente
                                            </label>
                                            <div class="flex items-center gap-2">
                                                <vs-switch v-model="formularioCupoData.if_distribuidor" />
                                                <span class="text-sm">{{ formularioCupoData.if_distribuidor ? 'Es distribuidor' : 'No es distribuidor' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="formulario-cupo-actions">
                                        <vs-button 
                                            @click="guardarFormularioCupo()" 
                                            color="success"
                                            size="small"
                                            icon="save"
                                            icon-pack="material-icons"
                                        >
                                            Guardar
                                        </vs-button>
                                        
                                        <vs-button 
                                            @click="showFormularioCupo = false" 
                                            color="danger"
                                            type="flat"
                                            size="small"
                                            icon="close"
                                            icon-pack="material-icons"
                                        >
                                            Cancelar
                                        </vs-button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Cliente Perseo -->
                            <div>
                                <label class="font-bold mb-2 block">
                                    <feather-icon icon="UserIcon" size="12" class="inline mr-1"></feather-icon>
                                    Cliente Perseo <span class="text-danger">*</span>
                                </label>
                                
                                <!-- Cliente ACTUAL -->
                                <div class="p-3 bg-gray-50 rounded border mb-2">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <div class="text-xs text-gray-500 mb-1">ACTUAL:</div>
                                            <div class="font-bold text-success">
                                                <i class="fas fa-check-circle mr-1"></i>
                                                {{ clientePerseo.nombre || 'Cargando...' }}
                                            </div>
                                            <div class="text-sm text-gray-600">
                                                Cédula: {{ clientePerseo.cedula }}
                                            </div>
                                        </div>
                                        <vs-button 
                                            size="small" 
                                            color="primary" 
                                            type="border"
                                            @click="abrirBusquedaCliente"
                                        >
                                            <i class="fas fa-edit mr-1"></i>
                                            Cambiar
                                        </vs-button>
                                    </div>
                                </div>
                                
                                <!-- NUEVO cliente (si se seleccionó) -->
                                <div v-if="nuevoClientePerseo" class="p-3 bg-blue-50 rounded border border-blue-300 mb-2">
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <div class="text-xs text-blue-600 font-bold mb-1">
                                                <i class="fas fa-arrow-right mr-1"></i> NUEVO:
                                            </div>
                                            <div class="font-bold text-blue-700">
                                                <i class="fas fa-user mr-1"></i>
                                                {{ nuevoClientePerseo.nombre }}
                                            </div>
                                            <div class="text-sm text-blue-600">
                                                Cédula: {{ nuevoClientePerseo.cedula }}
                                            </div>
                                        </div>
                                        <vs-button 
                                            size="small" 
                                            color="danger" 
                                            type="flat"
                                            @click="cancelarCambioCliente"
                                        >
                                            <i class="fas fa-times"></i>
                                        </vs-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </vx-card>

                <!-- Gestión de Libros -->
                <vx-card class="mb-4">
                    <template slot="header">
                        <h4>
                            <feather-icon icon="BookOpenIcon" size="12" class="inline mr-2"></feather-icon>
                            Gestión de Libros para Proforma - Perseo
                        </h4>
                    </template>
                    
                    <!-- ============================================ -->
                    <!-- TABLA DE CAPTURA RÁPIDA - MODO EDICIÓN -->
                    <!-- ============================================ -->
                    <div v-if="!loadingStock" class="mb-6">
                        <div class="tabla-captura-container">
                            <div class="tabla-header">
                                <vs-chip color="primary">Tabla de Captura Rápida</vs-chip>
                                <vs-button 
                                    @click="agregarFilaCaptura" 
                                    color="success" 
                                    size="small"
                                    type="flat"
                                    icon="icon-plus"
                                    icon-pack="feather"
                                >
                                    Agregar Fila
                                </vs-button>
                            </div>
                                    
                            <vs-table :data="filasCaptura">
                                <template slot="thead">
                                    <vs-th style="width: 50px;">#</vs-th>
                                    <vs-th style="width: 30%;">
                                        <span class="headers-form">
                                            <feather-icon icon="SearchIcon" size="14" class="mr-1"></feather-icon>
                                            Buscar Libro
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 90px;">
                                        <span class="headers-form">
                                            <feather-icon icon="DollarSignIcon" size="14" class="mr-1"></feather-icon>
                                            Precio
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="ClipboardIcon" size="14" class="mr-1"></feather-icon>
                                            Original
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="GitCommitIcon" size="14" class="mr-1"></feather-icon>
                                            Cambio
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 100px;">
                                        <span class="headers-form">
                                            <feather-icon icon="PackageIcon" size="14" class="mr-1"></feather-icon>
                                            Cantidad
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="TrendingUpIcon" size="14" class="mr-1"></feather-icon>
                                            Stock
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 100px;">
                                        <span class="headers-form">
                                            <feather-icon icon="DollarSignIcon" size="14" class="mr-1"></feather-icon>
                                            Subtotal
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="TrashIcon" size="14" class="mr-1"></feather-icon>
                                            Acción
                                        </span>
                                    </vs-th>
                                </template>
                                
                                <template slot-scope="{data}">
                                    <vs-tr :data="fila" :key="index" v-for="(fila, index) in data">
                                        <!-- Número de fila -->
                                        <vs-td>
                                            <span style="font-weight: bold; color: #666;">{{ index + 1 }}</span>
                                        </vs-td>
                                        
                                        <!-- Buscador de libro -->
                                        <vs-td>
                                            <div class="input-with-dropdown">
                                                <vs-input 
                                                    :id="`input-busqueda-${index}`"
                                                    v-model="fila.textoBusqueda"
                                                    @input="buscarEnFila(fila, index)"
                                                    @keyup.enter="aceptarYConsultarStock(fila, index)"
                                                    @keydown.backspace="manejarBorradoBusqueda(fila, index, $event)"
                                                    :class="fila.libroSeleccionado ? 'libro-encontrado' : ''"
                                                    :placeholder="obtenerPlaceholder(fila)"
                                                    :readonly="fila.libroSeleccionado || fila.consultandoStock"
                                                    autocomplete="off"
                                                    class="w-full"
                                                />
                                                
                                                <!-- Indicador de consultando stock -->
                                                <div v-if="fila.consultandoStock" style="margin-top: 5px; font-size: 11px; color: #5b3cc4;" class="headers-form">
                                                    <div class="loading-spinner-small" style="display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></div>
                                                    <strong>Consultando stock en Perseo...</strong>
                                                </div>
                                                
                                                <!-- Sugerencia inline -->
                                                <div v-else-if="fila.sugerenciaActual && !fila.libroSeleccionado" 
                                                     class="sugerencia-inline">
                                                    <span class="headers-form" v-if="fila.sugerenciaActual.pro_codigo.toLowerCase().includes(fila.textoBusqueda.toLowerCase())">
                                                        <feather-icon icon="HashIcon" size="12"></feather-icon>
                                                        Código: <strong>{{ fila.sugerenciaActual.pro_codigo }}</strong> | 
                                                        {{ fila.sugerenciaActual.nombre_libro }}
                                                    </span>
                                                    <span v-else class="headers-form">
                                                        <feather-icon icon="BookIcon" size="12"></feather-icon>
                                                        <strong>{{ fila.sugerenciaActual.nombre_libro }}</strong> 
                                                        ({{ fila.sugerenciaActual.pro_codigo }})
                                                    </span>
                                                    <br><small style="color: #5b3cc4;" class="headers-form">
                                                        <feather-icon icon="CornerDownLeftIcon" size="10" ></feather-icon>
                                                        Presiona Enter para seleccionar
                                                    </small>
                                                </div>
                                                
                                                <!-- Dropdown de resultados de búsqueda -->
                                                <div v-if="fila.resultadosBusqueda && fila.resultadosBusqueda.length > 1 && !fila.libroSeleccionado && fila.textoBusqueda.trim().length >= 2" 
                                                     class="dropdown-resultados">
                                                    <div 
                                                        v-for="(libro, idx) in fila.resultadosBusqueda" 
                                                        :key="libro.pro_codigo"
                                                        @click="seleccionarLibroEnFila(fila, libro, index)"
                                                        class="dropdown-item"
                                                        :class="{ 'dropdown-item-first': idx === 0 }"
                                                    >
                                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                                            <div style="flex: 1;">
                                                                <strong style="color: #5b3cc4;">{{ libro.pro_codigo }}</strong>
                                                                <span style="color: #606c76; margin-left: 8px;">{{ libro.nombre_libro }}</span>
                                                            </div>
                                                            <div style="margin-left: 8px;">
                                                                <vs-chip 
                                                                    :color="libro.stock > 0 ? 'success' : 'danger'" 
                                                                    size="small"
                                                                >
                                                                    Stock: {{ libro.stock || 0 }}
                                                                </vs-chip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <!-- Libro seleccionado con código -->
                                                <div v-else-if="fila.libroSeleccionado" style="margin-top: 5px; font-size: 11px; color: #48bb78;" class="headers-form">
                                                    <feather-icon icon="CheckCircleIcon" size="12"></feather-icon>
                                                    <strong>{{ fila.libroSeleccionado.nombre_libro }}</strong> 
                                                    <span style="color: #666;">| Código: {{ fila.libroSeleccionado.pro_codigo }}</span>
                                                </div>
                                            </div>
                                        </vs-td>
                                        
                                        <!-- Precio unitario -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado"
                                                color="primary" 
                                                size="small"
                                            >
                                                ${{ parseFloat(fila.libroSeleccionado.precio || 0).toFixed(2) }}
                                            </vs-chip>
                                            <span v-else style="color: #ccc;">-</span>
                                        </vs-td>
                                        
                                        <!-- Cantidad Original -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado"
                                                color="dark" 
                                                size="small"
                                            >
                                                {{ fila.libroSeleccionado.cantidadOriginal || 0 }}
                                            </vs-chip>
                                            <span v-else style="color: #ccc;">-</span>
                                        </vs-td>
                                        
                                        <!-- Cambio (diferencia entre nueva y original) -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0"
                                                :color="obtenerColorCambio(fila.libroSeleccionado, fila.cantidad)" 
                                                size="small"
                                            >
                                                {{ calcularCambioReserva(fila.libroSeleccionado, fila.cantidad) }}
                                            </vs-chip>
                                            <vs-chip 
                                                v-else-if="fila.libroSeleccionado"
                                                color="dark" 
                                                size="small"
                                            >
                                                =
                                            </vs-chip>
                                            <span v-else style="color: #ccc;">-</span>
                                        </vs-td>
                                        
                                        <!-- Input de cantidad -->
                                        <vs-td>
                                            <vs-input 
                                                v-model="fila.cantidad"
                                                @input="validarYSincronizarCantidad(fila, index)"
                                                @keyup.enter="avanzarAlSiguienteLibro(index)"
                                                @keydown.delete="manejarBorradoCantidad(fila, index)"
                                                @keydown.backspace="manejarBorradoCantidad(fila, index)"
                                                type="number"
                                                min="0"
                                                style="width: 80px;"
                                                :disabled="!fila.libroSeleccionado || fila.consultandoStock"
                                                :ref="`cantidad-${index}`"
                                                :class="fila.errorCantidad ? 'cantidad-error' : ''"
                                                class="w-full"
                                            />
                                            <small v-if="fila.errorCantidad" class="text-danger text-xs block mt-1">
                                                {{ fila.errorCantidad }}
                                            </small>
                                        </vs-td>
                                        
                                        <!-- Stock disponible -->
                                        <vs-td>
                                            <div v-if="fila.consultandoStock" style="display: flex; align-items: center; gap: 5px;">
                                                <div class="loading-spinner-small"></div>
                                                <small style="color: #666;">Consultando...</small>
                                            </div>
                                            <vx-tooltip v-else-if="fila.libroSeleccionado" :text="obtenerTooltipStock(fila.libroSeleccionado)">
                                                <vs-chip 
                                                    :color="obtenerColorStock(fila.libroSeleccionado)" 
                                                    size="small"
                                                >
                                                    {{ fila.libroSeleccionado.stock !== undefined ? fila.libroSeleccionado.stock : 0 }}
                                                </vs-chip>
                                            </vx-tooltip>
                                            <span v-else style="color: #ccc;">-</span>
                                        </vs-td>
                                        
                                        <!-- Subtotal -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0"
                                                color="success" 
                                                size="small"
                                            >
                                                ${{ calcularSubtotalFila(fila) }}
                                            </vs-chip>
                                            <span v-else style="color: #ccc;">$0.00</span>
                                        </vs-td>
                                        
                                        <!-- Acción -->
                                        <vs-td>
                                            <vs-button 
                                                v-if="fila.libroSeleccionado"
                                                @click="limpiarFilaCaptura(fila, index)"
                                                color="danger" 
                                                type="flat"
                                                title="Limpiar selección"
                                                icon="icon-trash-2"
                                                icon-pack="feather"
                                            >
                                            </vs-button>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </div>
                    <!-- FIN TABLA DE CAPTURA RÁPIDA -->
                    
                    <!-- Loading de stock con PROGRESO -->
                    <div v-if="loadingStock" class="text-center py-8">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                        </div>
                        <p class="mt-2 text-gray-600">Consultando stock disponible en Perseo...</p>
                        
                        <!-- Barra de progreso -->
                        <div v-if="progresoStock.mostrando" class="mt-4 max-w-md mx-auto">
                            <div class="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Producto {{ progresoStock.actual }} de {{ progresoStock.total }}</span>
                                <span>{{ Math.round((progresoStock.actual / progresoStock.total) * 100) }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    :style="{ width: ((progresoStock.actual / progresoStock.total) * 100) + '%' }"
                                ></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- TABLA DETALLADA OCULTA - Solo se usa la tabla de captura rápida -->
                    <div v-else-if="false && detallesProforma.length > 0" style="display: none;">
                        <div class="mb-4 flex justify-between items-center">
                            <div class="flex items-center gap-4">
                                <vs-chip color="success">{{ detallesProforma.length }} libros en la proforma actual</vs-chip>
                                <vs-chip color="primary">{{ contarLibrosConCantidad() }} libros con cantidad</vs-chip>
                            </div>
                        </div>
                        
                        <!-- Tabla SOLO de libros que YA ESTÁN en la proforma -->
                        <vs-table :data="detallesProforma" :max-items="detallesProforma.length">
                            <template slot="thead">
                                <vs-th>Código</vs-th>
                                <vs-th>Libro</vs-th>
                                <vs-th>Precio Unit.</vs-th>
                                <vs-th>Reserva Original</vs-th>
                                <vs-th>Nueva Cantidad</vs-th>
                                <vs-th>Cambio</vs-th>
                                <vs-th>Stock Perseo Actual</vs-th>
                                <vs-th>Subtotal</vs-th>
                            </template>
                            
                            <template slot-scope="{data}">
                                <vs-tr :data="libro" :key="index" v-for="(libro, index) in data">
                                    <!-- Código -->
                                    <vs-td>
                                        <div class="font-mono text-sm font-bold text-primary">
                                            {{ libro.pro_codigo }}
                                        </div>
                                    </vs-td>
                                    
                                    <!-- Libro -->
                                    <vs-td>
                                        <div style="max-width: 250px;">
                                            <p class="font-semibold text-sm">{{ libro.nombrelibro || libro.nombre_libro }}</p>
                                        </div>
                                    </vs-td>
                                    
                                    <!-- Precio Unitario -->
                                    <vs-td>
                                        <vs-chip color="primary" class="text-center">
                                            ${{ parseFloat(libro.precio || 0).toFixed(2) }}
                                        </vs-chip>
                                    </vs-td>
                                    
                                    <!-- Reserva Original -->
                                    <vs-td>
                                        <vx-tooltip text="Cantidad reservada cuando se creó esta proforma">
                                            <vs-chip color="dark" size="small">
                                                {{ libro.cantidadOriginal || 0 }}
                                            </vs-chip>
                                        </vx-tooltip>
                                    </vs-td>
                                    
                                    <!-- Nueva Cantidad (editable) -->
                                    <vs-td>
                                        <vs-input 
                                            v-model="libro.cantidadProforma"
                                            @input="validarCantidadListado(libro)"
                                            type="number"
                                            min="1"
                                            style="width: 80px;"
                                            :class="libro.errorStockMinimo ? 'input-error-stock' : ''"
                                            :danger="!!libro.errorStockMinimo"
                                        />
                                        <small v-if="libro.errorStockMinimo" class="text-danger text-xs block mt-1">
                                            {{ libro.errorStockMinimo }}
                                        </small>
                                    </vs-td>
                                    
                                    <!-- Cambio (diferencia) -->
                                    <vs-td>
                                        <vs-chip 
                                            :color="getCambioColor(libro)" 
                                            size="small"
                                        >
                                            {{ getCambioTexto(libro) }}
                                        </vs-chip>
                                    </vs-td>
                                    
                                    <!-- Stock Perseo Actual -->
                                    <vs-td>
                                        <vx-tooltip :text="obtenerTooltipStock(libro)">
                                            <vs-chip 
                                                :color="obtenerColorStock(libro)" 
                                                class="text-center"
                                            >
                                                {{ libro.stock_perseo_actual !== undefined ? libro.stock_perseo_actual : 'Consultando...' }}
                                            </vs-chip>
                                        </vx-tooltip>
                                    </vs-td>
                                    
                                    <!-- Subtotal -->
                                    <vs-td>
                                        <vs-chip 
                                            v-if="libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0"
                                            color="success" 
                                            class="text-center"
                                        >
                                            ${{ calcularSubtotalLibro(libro) }}
                                        </vs-chip>
                                        <span v-else style="color: #ccc;">$0.00</span>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    
                    <!-- Sin libros -->
                    <div v-if="!loadingStock && detallesProforma.length === 0" class="bg-orange-50 p-4 rounded text-center">
                        <i class="fas fa-book text-2xl text-orange-400 mb-2"></i>
                        <p class="text-orange-600">No se encontraron libros en la proforma</p>
                    </div>
                    
                    <!-- Resumen de Totales de la Proforma (siempre visible) -->
                    <div class="mt-6 p-4 bg-white rounded-lg border border-gray-300">
                        <div v-if="calcularTotalesUnificados().cantidadLibros > 0">
                            <!-- Grid de 2 columnas -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Columna 1: Observación -->
                                <div>
                                    <label class="font-bold mb-2 block text-sm">
                                        <feather-icon icon="FileTextIcon" size="14" class="inline mr-1"></feather-icon>
                                        Observación
                                    </label>
                                    
                                    <!-- Observación ACTUAL (solo lectura) -->
                                    <div class="p-2 bg-gray-50 rounded border mb-2">
                                        <div class="text-xs text-gray-500 mb-1">ACTUAL:</div>
                                        <div class="text-success text-sm">
                                            <i class="fas fa-comment mr-1"></i>
                                            {{ datosOriginales ? (datosOriginales.proformaData.prof_observacion || 'Sin observación') : 'Cargando...' }}
                                        </div>
                                    </div>
                                    
                                    <!-- Textarea para CAMBIAR observación -->
                                    <div class="mb-2">
                                        <label class="text-xs text-gray-600 mb-1 block">Cambiar a:</label>
                                        <vs-textarea
                                            placeholder="Escriba alguna observación para la proforma (máximo 200 caracteres)..."
                                            v-model="proformaData.prof_observacion"
                                            :counter="200"
                                            counter-danger
                                            class="w-full"
                                        />
                                        <div class="text-right text-xs mt-1">
                                            <span :class="{'text-danger': proformaData.prof_observacion && proformaData.prof_observacion.length > 200, 'text-gray-500': !proformaData.prof_observacion || proformaData.prof_observacion.length <= 200}">
                                                {{ (proformaData.prof_observacion || '').length }}/200 caracteres
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Mensaje si cambió la observación -->
                                    <div v-if="observacionCambiada" class="p-2 bg-blue-50 rounded border border-blue-300">
                                        <div class="text-xs text-blue-600 font-bold">
                                            <i class="fas fa-info-circle mr-1"></i>
                                            Observación modificada
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Columna 2: Totales -->
                                <div class="flex flex-col items-end space-y-1 text-sm font-bold text-gray-800">
                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">Subtotal $:</label>
                                        <span>{{ calcularTotalesUnificados().subtotal.toFixed(2) }}</span>
                                    </div>

                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">Descuento {{proformaData.pro_des_por}}%:</label>
                                        <span>{{ calcularTotalesUnificados().descuentoMonto.toFixed(2) }}</span>
                                    </div>

                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">Subtotal - Descuento $:</label>
                                        <span>{{ calcularTotalesUnificados().subtotalConDescuento.toFixed(2) }}</span>
                                    </div>

                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">IVA $:</label>
                                        <span>{{ calcularTotalesUnificados().iva.toFixed(2) }}</span>
                                    </div>

                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">Transporte $:</label>
                                        <span>{{ calcularTotalesUnificados().transporte.toFixed(2) }}</span>
                                    </div>

                                    <div class="flex justify-end w-full border-t border-gray-300 pt-1 mt-1">
                                        <label class="mr-2">TOTAL $:</label>
                                        <span>{{ calcularTotalesUnificados().total.toFixed(2) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8">
                            <i class="fas fa-calculator text-4xl text-gray-400 mb-3"></i>
                            <p class="text-gray-500 font-semibold">Agregue libros con cantidades para ver el resumen de totales</p>
                            <p class="text-gray-400 text-sm">Use la tabla para especificar cantidades</p>
                        </div>
                    </div>
                </vx-card>

                <!-- Botones de acción -->
                <div class="flex justify-center gap-4 mt-6">
                    <vs-button 
                        color="success" 
                        @click="intentarGuardarCambios"
                        icon="check"
                        icon-pack="material-icons"
                    >
                        Guardar Cambios
                    </vs-button>
                    <vs-button 
                        color="danger" 
                        type="border" 
                        @click="cerrarModal"
                        icon="close"
                        icon-pack="material-icons"
                    >
                        Cancelar
                    </vs-button>
                </div>
            </div>
        </div>
        
        <!-- Modales de búsqueda -->
        <BusquedaLugarDespacho
            :visible.sync="mostrarBusquedaDespacho"
            :id-periodo="pedidoSeleccionado ? pedidoSeleccionado.id_periodo : 0"
            @lugar-seleccionado="seleccionarNuevoDespacho"
            @cerrar="cerrarBusquedaDespacho"
            style="z-index: 52000 !important;"
        />
        
        <BusquedaClientePerseo
            :visible.sync="mostrarBusquedaCliente"
            :empresa="proformaData.emp_id"
            @cliente-seleccionado="seleccionarNuevoCliente"
            @cerrar="cerrarBusquedaCliente"
            style="z-index: 52000 !important;"
        />
        
        <!-- ====================================== -->
        <!-- POPUP: PRODUCTOS SIN STOCK SUFICIENTE -->
        <!-- ====================================== -->
        <vs-popup-history
            title="⚠️ Productos Sin Stock Disponible en Perseo"
            :active.sync="popupStockInsuficiente"
            class="popup-stock-insuficiente"
        >
            <div class="stock-insuficiente-container">
                <div class="alert-message">
                    <p class="text-danger font-semibold mb-3">
                        <i class="feather icon-alert-triangle mr-2"></i>
                        No se puede completar la operación porque algunos productos no tienen stock suficiente en Perseo.
                    </p>
                    <p class="text-sm text-gray-600 mb-4">
                        Esto puede ocurrir cuando otro usuario está generando proformas simultáneamente. 
                        El stock ha sido actualizado automáticamente.
                    </p>
                </div>
                
                <div class="productos-tabla-container">
                    <table class="tabla-productos-invalidos w-full">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Stock Perseo</th>
                                <th>Solicitado</th>
                                <th>Faltante</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(producto, index) in productosStockInsuficiente" :key="index">
                                <td>{{ producto.pro_codigo }}</td>
                                <td class="nombre-producto">{{ producto.pro_nombre }}</td>
                                <td class="text-center">
                                    <vs-chip color="warning">
                                        {{ producto.stock_actual }}
                                    </vs-chip>
                                </td>
                                <td class="text-center">
                                    <span v-if="producto.es_nuevo">
                                        <vs-chip color="primary">
                                            {{ producto.cantidad_requerida }} (Nuevo)
                                        </vs-chip>
                                    </span>
                                    <span v-else-if="producto.aumento_requerido">
                                        <vs-chip color="primary">
                                            {{ producto.cantidad_antigua }} → {{ producto.cantidad_nueva }}
                                            (+{{ producto.aumento_requerido }})
                                        </vs-chip>
                                    </span>
                                    <span v-else>
                                        <vs-chip color="primary">
                                            {{ producto.cantidad_requerida }}
                                        </vs-chip>
                                    </span>
                                </td>
                                <td class="text-center">
                                    <vs-chip color="danger">
                                        -{{ producto.faltante }}
                                    </vs-chip>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="acciones-popup mt-6">
                    <vs-button 
                        @click="cerrarPopupStockInsuficiente" 
                        color="primary" 
                        type="filled"
                        class="w-full"
                        size="large"
                    >
                        <i class="feather icon-refresh-cw mr-2"></i>
                        Entendido - Actualizar Stock de Perseo
                    </vs-button>
                </div>
            </div>
        </vs-popup-history>
    </vs-popup-history>
</template>



<script>
import vSelect from 'vue-select';

const BusquedaLugarDespacho = () => import('../../Busquedas/BusquedaLugarDespacho.vue');
const BusquedaClientePerseo = () => import('../../Busquedas/BusquedaClientePerseo.vue');

export default {
    name: 'ProformaEditarModalPerseo',
    components: {
        vSelect,
        BusquedaLugarDespacho,
        BusquedaClientePerseo
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        proformaId: {
            type: [Number, String],
            required: false,
            default: null
        },
        pedidoSeleccionado: {
            type: Object,
            required: false,
            default: () => ({})
        },
        librosPedido: {
            type: Array,
            default: () => []
        },
        librosProformados: {
            type: Array,
            default: () => []
        },
        cantidadProformasContrato: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            popupEditar: this.visible,
            loadingDatos: false,
            loadingStock: false,
            filtrarSoloConCantidad: true,
            
            // Progreso de consulta de stock
            progresoStock: {
                actual: 0,
                total: 0,
                mostrando: false
            },
            
            popupStockInsuficiente: false,
            productosStockInsuficiente: [],
            
            proformaData: {
                id: null,
                prof_id: '',
                emp_id: null,
                pro_des_por: 0,
                prof_descuento: 0,
                prof_observacion: '',
                prof_total: 0,
                prof_estado: 1,
                contrato: '',
                created_at: '',
                usu_codigo: null,
                pedido_id: null,
                id_ins_depacho: null,
                ven_cliente: null,
                ruc_cliente: '',
                clientesidPerseo: null
            },
            
            listaEmpresas: [],
            
            lugarDespacho: {
                idInstitucion: null,
                nombreInstitucion: '',
                ruc: '',
                ciudad: '',
                datosInstitucion: []
            },
            
            nuevoLugarDespacho: null,
            mostrarBusquedaDespacho: false,
            
            clientePerseo: {
                id: null,
                nombre: '',
                cedula: '',
                email: ''
            },
            
            nuevoClientePerseo: null,
            mostrarBusquedaCliente: false,
            
            detallesProforma: [],
            datosOriginales: null,
            esPrimeraProforma: false,
            
            // Tracking de reservas originales para calcular diferencias
            reservasOriginales: {},
            
            // Para agregar nuevas filas de captura
            filasCaptura: [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    consultandoStock: false,
                    stockError: false
                }
            ],
            librosConStock: [],
            
            showFormularioCupo: false,
            showFormularioCupoActual: false,
            formularioCupoData: {
                ffp_id: null,
                idInstitucion: null,
                idperiodoescolar: null,
                ffp_credito: '',
                ffp_cupo: '',
                ffp_descuento: '',
                if_distribuidor: false,
                nombreInstitucion: '',
                ciudad: ''
            }
        }
    },
    watch: {
        visible(newVal) {
            this.popupEditar = newVal;
            if (newVal && this.proformaId) {
                console.log('✅ Modal de EDICIÓN PERSEO abierto');
                this.inicializarEdicion();
            } else if (!newVal) {
                this.limpiarModal();
            }
        },
        popupEditar(newVal) {
            if (!newVal) {
                this.$emit('cerrar');
            }
            this.$emit('update:visible', newVal);
        }
    },
    computed: {
        librosConStockFiltrados() {
            if (this.filtrarSoloConCantidad) {
                return this.librosPedido.filter(libro => 
                    libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
                );
            }
            return this.librosPedido;
        },
        
        empresaCambiada() {
            if (!this.datosOriginales) return false;
            return this.proformaData.emp_id !== this.datosOriginales.proformaData.emp_id;
        },
        
        descuentoCambiado() {
            if (!this.datosOriginales) return false;
            return parseFloat(this.proformaData.pro_des_por || 0) !== parseFloat(this.datosOriginales.proformaData.pro_des_por || 0);
        },
        
        observacionCambiada() {
            if (!this.datosOriginales) return false;
            const obsActual = (this.proformaData.prof_observacion || '').trim();
            const obsOriginal = (this.datosOriginales.proformaData.prof_observacion || '').trim();
            return obsActual !== obsOriginal;
        },
        
        empresaActual() {
            if (!this.datosOriginales) {
                return { id: null, nombre: 'Cargando...' };
            }
            
            const empresaId = this.datosOriginales.proformaData.emp_id;
            const empresa = this.listaEmpresas.find(e => e.id === empresaId);
            
            return {
                id: empresaId,
                nombre: empresa ? empresa.descripcion_corta : 'No encontrada'
            };
        }
    },
    mounted() {
        // Inicialización si es necesaria
    },
    methods: {
        // ==========================================
        // MÉTODO CENTRALIZADO PARA CONSULTAR STOCK EN PERSEO
        // ==========================================
        async consultarStockPerseo(codigos, idEmpresa) {
            try {
                // codigos puede ser un string o un array
                const codigosArray = Array.isArray(codigos) ? codigos : [codigos];
                
                console.log('📡 consultarStockPerseo - Códigos:', codigosArray, 'Empresa:', idEmpresa);
                
                // POST envía datos en el body directamente, no en params
                const response = await this.$http.post(
                    `${this.$server_url}api/perseo/productos/productos_consulta_x_id`,
                    {
                        codigos: codigosArray,
                        id_empresa: idEmpresa
                    }
                );
                
                console.log('✅ Respuesta stock Perseo:', response.data);
                return response.data.productos || [];
            } catch (error) {
                console.error('❌ Error al consultar stock Perseo:', error);
                throw error;
            }
        },
        
        // ==========================================
        // CONSULTAR STOCK INDIVIDUAL PARA UNA FILA
        // ==========================================
        async consultarStockIndividual(fila, index) {
            let me = this;
            
            if (!fila.libroSeleccionado) return;
            
            // Validar empresa
            const empresaId = me.proformaData.emp_id;
            if (!empresaId) {
                me.$vs.notify({
                    text: 'Debe tener una empresa seleccionada',
                    color: 'warning'
                });
                return;
            }
            
            try {
                // Marcar como consultando
                me.$set(fila, 'consultandoStock', true);
                me.$set(fila, 'stockError', false);
                
                const codigoConsulta = fila.libroSeleccionado.pro_codigo;
                console.log('📦 Consultando stock Perseo para:', codigoConsulta);
                
                const stockData = await me.consultarStockPerseo(codigoConsulta, empresaId);
                
                console.log('✅ Respuesta stock Perseo:', stockData);
                
                if (stockData && stockData.length > 0) {
                    const stockInfo = stockData[0];
                    const stockDisponible = parseInt(stockInfo.existenciastotales || 0);
                    const precioProducto = stockInfo.tarifas && stockInfo.tarifas[0] ? parseFloat(stockInfo.tarifas[0].precio || 0) : fila.libroSeleccionado.precio;
                    
                    // Actualizar stock en el libro seleccionado
                    me.$set(fila.libroSeleccionado, 'stock', stockDisponible);
                    me.$set(fila.libroSeleccionado, 'stock_perseo_actual', stockDisponible);
                    me.$set(fila.libroSeleccionado, 'precio', precioProducto);
                    
                    console.log(`✅ Stock Perseo actualizado: ${stockDisponible} unidades`);
                } else {
                    throw new Error('No se encontró stock para este libro');
                }
            } catch (error) {
                console.error('❌ Error al consultar stock Perseo:', error);
                me.$set(fila, 'stockError', true);
                me.$set(fila.libroSeleccionado, 'stock', 0);
                me.$set(fila.libroSeleccionado, 'stock_perseo_actual', 0);
                
                me.$vs.notify({
                    title: '❌ Error al consultar stock',
                    text: 'No se pudo consultar el stock de Perseo para este libro',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle'
                });
            } finally {
                me.$set(fila, 'consultandoStock', false);
            }
        },
        
        // ==========================================
        // CONSULTAR STOCK SOLO DE PRODUCTOS EN LA PROFORMA (UNO POR UNO)
        // ==========================================
        async consultarStockLibros() {
            let me = this;
            
            // ✅ Inicializar librosConStock con librosPedido
            me.librosConStock = me.librosPedido.map(libro => ({
                ...libro,
                cantidadProforma: '0' // Inicializar en 0
            }));
            
            // ✅ Actualizar con las cantidades de detallesProforma
            me.detallesProforma.forEach(detalle => {
                const libroEnStock = me.librosConStock.find(l => l.pro_codigo === detalle.pro_codigo);
                if (libroEnStock) {
                    libroEnStock.cantidadProforma = detalle.cantidadProforma;
                }
            });
            
            // ✅ CAMBIO: Solo consultar productos que están en detallesProforma
            if (!me.detallesProforma || me.detallesProforma.length === 0) {
                console.log('⚠️ No hay libros en la proforma para consultar stock');
                return;
            }
            
            // Obtener empresa ID
            const empresaId = me.proformaData.emp_id;
            if (!empresaId) {
                console.error('❌ No hay empresa seleccionada');
                me.$vs.notify({
                    text: 'Debe seleccionar una empresa primero',
                    color: 'warning'
                });
                return;
            }
            
            // ✅ Solo códigos de productos en la proforma
            const codigosProforma = me.detallesProforma.map(detalle => detalle.pro_codigo);
            
            console.log(`📦 Consultando stock Perseo para ${codigosProforma.length} productos de la proforma`);
            
            me.loadingStock = true;
            me.progresoStock = {
                actual: 0,
                total: codigosProforma.length,
                mostrando: true
            };
            
            // Mostrar notificación de inicio
            me.$vs.notify({
                text: `Consultando stock de ${codigosProforma.length} producto(s) en Perseo...`,
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-refresh-cw',
                position: 'top-right',
                time: 2000
            });
            
            try {
                // ✅ Consultar UNO POR UNO con progreso
                for (let i = 0; i < codigosProforma.length; i++) {
                    const codigo = codigosProforma[i];
                    me.progresoStock.actual = i + 1;
                    
                    try {
                        const res = await me.$http.post(`${me.$server_url}api/perseo/productos/productos_consulta_x_id`, {
                            codigos: [codigo],
                            id_empresa: empresaId
                        });
                        
                        if (res.data.productos && res.data.productos.length > 0) {
                            const stockInfo = res.data.productos[0];
                            
                            // Buscar el libro en detallesProforma
                            const detalle = me.detallesProforma.find(d => d.pro_codigo === codigo);
                            if (detalle) {
                                // Guardar stock actual de Perseo
                                me.$set(detalle, 'stock_perseo_actual', stockInfo.existenciastotales || 0);
                                me.$set(detalle, 'stock', stockInfo.existenciastotales || 0);
                                
                                // Actualizar precio si viene de Perseo
                                if (stockInfo.tarifas && stockInfo.tarifas.length > 0) {
                                    me.$set(detalle, 'precio', parseFloat(stockInfo.tarifas[0].precio || 0));
                                }
                                
                                console.log(`✅ [${i+1}/${codigosProforma.length}] Stock Perseo: ${codigo} = ${stockInfo.existenciastotales}`);
                            }
                            
                            // También actualizar en librosConStock para que el buscador funcione
                            const libroEnStock = me.librosConStock.find(l => l.pro_codigo === codigo);
                            if (libroEnStock) {
                                me.$set(libroEnStock, 'stock', stockInfo.existenciastotales || 0);
                                me.$set(libroEnStock, 'stock_perseo_actual', stockInfo.existenciastotales || 0);
                                
                                if (stockInfo.tarifas && stockInfo.tarifas.length > 0) {
                                    me.$set(libroEnStock, 'precio', parseFloat(stockInfo.tarifas[0].precio || 0));
                                }
                            }
                        }
                    } catch (err) {
                        console.warn(`⚠️ Error consultando ${codigo}:`, err.message);
                    }
                    
                    // Pequeña pausa para no saturar
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                me.loadingStock = false;
                me.progresoStock.mostrando = false;
                
                console.log('✅ Stock de Perseo actualizado para todos los productos de la proforma');
                
                // Notificación de éxito
                me.$vs.notify({
                    text: `Stock de Perseo actualizado (${codigosProforma.length} producto${codigosProforma.length > 1 ? 's' : ''})`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    position: 'top-right',
                    time: 3000
                });
            } catch (err) {
                me.loadingStock = false;
                me.progresoStock.mostrando = false;
                
                // Marcar todas las filas como no consultando en caso de error
                me.filasCaptura.forEach(fila => {
                    if (fila.libroSeleccionado) {
                        me.$set(fila, 'consultandoStock', false);
                        me.$set(fila, 'stockError', true);
                    }
                });
                
                console.error('❌ Error al consultar stock en Perseo:', err);
                me.$vs.notify({
                    text: 'Error al consultar el stock en Perseo',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    position: 'top-right'
                });
            }
        },
        
        // ==========================================
        // MODIFICACIÓN: Método guardarCambios actualizado
        // ==========================================
        guardarCambios() {
            let me = this;
            
            const hayCambiosBasicos = me.hayModificaciones();
            const hayCambiosEnLibros = me.hayModificacionesEnLibros();
            
            if (!hayCambiosBasicos && !hayCambiosEnLibros) {
                me.$vs.notify({
                    title: 'Sin cambios',
                    text: 'No se han realizado modificaciones en la proforma',
                    color: 'warning'
                });
                return;
            }
            
            // ✅ CAMBIO: Trabajar con detallesProforma en lugar de librosPedido
            const librosConCantidad = me.detallesProforma.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            if (librosConCantidad.length === 0) {
                me.$vs.notify({
                    title: 'Sin libros seleccionados',
                    text: 'Debe seleccionar al menos un libro con cantidad mayor a 0',
                    color: 'warning'
                });
                return;
            }
            
            const formData = new FormData();
            
            formData.append('proforma_id', me.proformaData.id);
            formData.append('prof_id', me.proformaData.prof_id);
            formData.append('pedido_id', me.proformaData.pedido_id);
            formData.append('contrato', me.proformaData.contrato);
            formData.append('usu_codigo', me.proformaData.usu_codigo);
            formData.append('prof_observacion', me.proformaData.prof_observacion || '');
            formData.append('prof_observacion_libreria', '');
            
            // ✅ IMPORTANTE: Manejar emp_id como número
            const empresaId = typeof me.proformaData.emp_id === 'object' && me.proformaData.emp_id !== null
                ? me.proformaData.emp_id.id 
                : me.proformaData.emp_id;
            
            formData.append('emp_id', empresaId);
            formData.append('pro_des_por', parseFloat(me.proformaData.pro_des_por || 0));
            
            const idDespacho = me.nuevoLugarDespacho 
                ? me.nuevoLugarDespacho.idInstitucion 
                : me.proformaData.id_ins_depacho;
            
            const idCliente = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.idusuario
                : me.proformaData.ven_cliente;
            const clientePerseoId = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.clientesidPerseo
                : me.proformaData.clientesidPerseo;
            const rucCliente = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.cedula 
                : me.proformaData.ruc_cliente;
            
            formData.append('id_ins_depacho', idDespacho);
            formData.append('ven_cliente', idCliente);
            formData.append('clientesidPerseo', clientePerseoId);
            formData.append('ruc_cliente', rucCliente);
            
            const totales = me.calcularTotalesUnificados();
            formData.append('prof_com', 0);
            formData.append('prof_descuento', parseFloat(totales.descuentoMonto));
            formData.append('prof_iva', parseFloat(totales.iva));
            formData.append('prof_iva_por', 0);
            formData.append('prof_total', parseFloat(totales.total));
            formData.append('prof_estado', me.proformaData.prof_estado);
            
            // ✅ SISTEMA DE RESERVAS: Calcular diferencias y enviar datos completos
            const librosParaEnviar = librosConCantidad.map(libro => {
                const cantidadNueva = parseInt(libro.cantidadProforma);
                const cantidadOriginal = libro.cantidadOriginal || 0;
                const diferencia = cantidadNueva - cantidadOriginal;
                
                return {
                    pro_codigo: libro.pro_codigo,
                    det_prof_cantidad: cantidadNueva,
                    det_prof_valor_u: parseFloat(libro.precio || 0),
                    nombre_libro: libro.nombre_libro,
                    
                    // ✅ DATOS DE RESERVAS
                    stock_perseo_historico: libro.stock_perseo_historico || 0, // Stock cuando se creó
                    stock_perseo_actual: libro.stock_perseo_actual || 0, // Stock actual en Perseo
                    reserva_perseo_original: (me.reservasOriginales[libro.pro_codigo] && me.reservasOriginales[libro.pro_codigo].reserva_perseo) || 0,
                    cantidad_original: cantidadOriginal,
                    diferencia_cantidad: diferencia, // +: aumentó, -: disminuyó, 0: sin cambio
                    
                    contrato: me.proformaData.contrato
                };
            });
            
            formData.append('data_detalle', JSON.stringify(librosParaEnviar));
            
            me.$vs.loading({
                text: 'Actualizando proforma y reservas de Perseo...'
            });
            
            // ✅ CAMBIO: Usar endpoint específico para Perseo con sistema de reservas
            me.$http.post(`${me.$server_url}Proforma_Perseo_Actualizar_Con_Reservas`, formData)
                .then(response => {
                    me.$vs.loading.close();
                    
                    if (response.status === 200) {
                        console.log('✅ Proforma Perseo actualizada correctamente');
                        
                        me.$vs.notify({
                            title: 'Éxito',
                            text: response.data.message || 'Proforma Perseo actualizada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            time: 4000
                        });
                        
                        me.$emit('actualizar-proforma', response.data);
                        me.cerrarModal();
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.error('❌ Error al actualizar proforma Perseo:', error);
                    
                    if (error.response && error.response.status === 400 && error.response.data.error === 'STOCK_INSUFICIENTE') {
                        me.mostrarPopupStockInsuficiente(error.response.data.productos_invalidos);
                    } else {
                        let errorMsg = 'Error desconocido';
                        if (error.response && error.response.data) {
                            errorMsg = error.response.data.message || error.response.data.error || errorMsg;
                        } else if (error.message) {
                            errorMsg = error.message;
                        }
                        
                        me.$vs.notify({
                            title: 'Error al actualizar',
                            text: 'No se pudo actualizar la proforma Perseo. ' + errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x-circle',
                            time: 5000
                        });
                    }
                });
        },
        
        // ==========================================
        // MODIFICACIÓN: Métodos de cargar datos adaptados
        // ==========================================
        cargarDatosProforma() {
            let me = this;
            
            if (!me.proformaId) {
                console.error('❌ No hay ID de proforma para cargar');
                me.$vs.notify({
                    title: 'Error',
                    text: 'No se proporcionó un ID de proforma válido',
                    color: 'danger'
                });
                me.loadingDatos = false;
                return;
            }
            
            me.loadingDatos = true;
            
            console.log('📡 Solicitando datos de proforma Perseo ID:', me.proformaId);
            
            // ✅ CAMBIO: Usar endpoint específico para Perseo con reservas
            me.$http.get(`${me.$server_url}get_proforma_para_editar_perseo/${me.proformaId}`)
                .then(async response => {
                    if (response.status === 200 && response.data) {
                        const backendData = response.data.data || response.data;
                        
                        if (!backendData.proforma) {
                            throw new Error('La respuesta no contiene el campo "proforma"');
                        }
                        
                        console.log('✅ Datos de proforma Perseo recibidos:', backendData);
                        
                        me.proformaData = {
                            id: backendData.proforma.id,
                            prof_id: backendData.proforma.prof_id,
                            emp_id: backendData.proforma.emp_id,
                            pro_des_por: parseFloat(backendData.proforma.pro_des_por || 0),
                            prof_descuento: parseFloat(backendData.proforma.prof_descuento || 0),
                            prof_observacion: backendData.proforma.prof_observacion || '',
                            prof_total: parseFloat(backendData.proforma.prof_total || 0),
                            prof_estado: backendData.proforma.prof_estado,
                            contrato: backendData.proforma.contrato || '',
                            created_at: backendData.proforma.created_at || '',
                            usu_codigo: backendData.proforma.usu_codigo,
                            pedido_id: backendData.proforma.pedido_id,
                            id_ins_depacho: backendData.proforma.id_ins_depacho,
                            ven_cliente: backendData.proforma.ven_cliente,
                            ruc_cliente: backendData.proforma.ruc_cliente || '',
                            clientesidPerseo: backendData.proforma.clientesidPerseo
                        };
                        
                        let esPrimera = false;
                        if (backendData.proforma.es_primera_proforma !== undefined) {
                            esPrimera = backendData.proforma.es_primera_proforma == 1 || backendData.proforma.es_primera_proforma === true;
                        } else if (backendData.proforma.numero_proforma_contrato !== undefined) {
                            esPrimera = backendData.proforma.numero_proforma_contrato == 1;
                        } else if (me.cantidadProformasContrato !== undefined) {
                            esPrimera = me.cantidadProformasContrato === 1;
                        } else if (backendData.proforma.prof_id && backendData.proforma.prof_id.endsWith('-1')) {
                            esPrimera = true;
                        }
                        
                        me.esPrimeraProforma = esPrimera;
                        
                        me.detallesProforma = backendData.detalles || [];
                        
                        // ✅ CAMBIO: Mapear datos de Perseo incluyendo reservas y stock histórico
                        me.detallesProforma.forEach(detalle => {
                            // Guardar stock histórico (el que había cuando se creó la proforma)
                            me.$set(detalle, 'stock_perseo_historico', detalle.stock_perseo || 0);
                            
                            // Guardar reserva original para calcular diferencias
                            me.reservasOriginales[detalle.pro_codigo] = {
                                cantidad_original: parseInt(detalle.det_prof_cantidad || 0),
                                reserva_perseo: detalle.reserva_perseo || 0
                            };
                            
                            // Cantidad actual en esta proforma
                            me.$set(detalle, 'cantidadProforma', detalle.det_prof_cantidad.toString());
                            me.$set(detalle, 'cantidadOriginal', parseInt(detalle.det_prof_cantidad || 0));
                        });
                        
                        // ✅ Inicializar filasCaptura con libros existentes ANTES de consultar stock
                        me.filasCaptura = me.detallesProforma.map(detalle => ({
                            textoBusqueda: detalle.nombre_libro,
                            libroSeleccionado: {
                                pro_codigo: detalle.pro_codigo,
                                nombre_libro: detalle.nombre_libro,
                                precio: detalle.precio,
                                stock: 0, // Se actualizará después
                                stock_perseo_actual: 0, // Se actualizará después
                                cantidadOriginal: detalle.cantidadOriginal || 0
                            },
                            cantidad: detalle.cantidadProforma,
                            confirmado: true,
                            resultadosBusqueda: [],
                            sugerenciaActual: null,
                            errorCantidad: '',
                            consultandoStock: true, // Marcar como consultando
                            stockError: false
                        }));
                        
                        // Agregar una fila vacía al final para nuevos libros
                        me.agregarFilaCaptura();
                        
                        // ✅ Consultar stock actual de Perseo (solo de productos en la proforma)
                        await me.consultarStockLibros();
                        
                        // ✅ Actualizar las filasCaptura con el stock consultado
                        me.filasCaptura.forEach((fila, index) => {
                            if (fila.libroSeleccionado && index < me.detallesProforma.length) {
                                const detalle = me.detallesProforma[index];
                                me.$set(fila.libroSeleccionado, 'stock', detalle.stock_perseo_actual || detalle.stock || 0);
                                me.$set(fila.libroSeleccionado, 'stock_perseo_actual', detalle.stock_perseo_actual || 0);
                                me.$set(fila.libroSeleccionado, 'precio', detalle.precio);
                                me.$set(fila, 'consultandoStock', false);
                            }
                        });
                        
                        me.lugarDespacho = {
                            idInstitucion: backendData.proforma.despacho_id,
                            nombreInstitucion: backendData.proforma.despacho_nombre || 'No especificado',
                            ruc: backendData.proforma.despacho_ruc || 'N/A',
                            ciudad: backendData.proforma.despacho_ciudad || 'N/A',
                            datosInstitucion: []
                        };
                        
                        if (backendData.proforma.ffp_id) {
                            me.lugarDespacho.datosInstitucion = [{
                                ffp_id: backendData.proforma.ffp_id,
                                ffp_cupo: backendData.proforma.ffp_cupo,
                                ffp_credito: backendData.proforma.ffp_credito,
                                ffp_descuento: backendData.proforma.ffp_descuento,
                                if_distribuidor: backendData.proforma.if_distribuidor
                            }];
                        }
                        
                        me.clientePerseo = {
                            id: backendData.proforma.cliente_idusuario,
                            nombre: backendData.proforma.cliente_nombre || 'No especificado',
                            cedula: backendData.proforma.cliente_cedula || '',
                            email: backendData.proforma.cliente_email || ''
                        };
                        
                        if (me.debeMostrarCupo() && me.lugarDespacho.idInstitucion) {
                            me.consultarCupoLugarDespacho();
                        }
                        
                        me.datosOriginales = JSON.parse(JSON.stringify({
                            proformaData: me.proformaData,
                            lugarDespacho: me.lugarDespacho,
                            clientePerseo: me.clientePerseo,
                            detallesProforma: me.detallesProforma
                        }));
                        
                        me.loadingDatos = false;
                    }
                })
                .catch(error => {
                    console.error('❌ Error al cargar datos de proforma Perseo:', error);
                    me.$vs.notify({
                        title: 'Error al cargar datos',
                        text: 'No se pudieron cargar los datos de la proforma Perseo.',
                        color: 'danger'
                    });
                    me.loadingDatos = false;
                });
        },
        
        // ==========================================
        // MÉTODOS AUXILIARES ADAPTADOS
        // ==========================================
        obtenerColorStock(libro) {
            // ✅ Usar stock_perseo_actual (consultado en tiempo real)
            const stockActual = libro.stock_perseo_actual;
            if (stockActual === undefined) return 'dark';
            if (stockActual === 0) return 'danger';
            
            const cantidadSolicitada = parseInt(libro.cantidadProforma || 0);
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = cantidadSolicitada - cantidadOriginal;
            
            // Si está aumentando, verificar si hay stock disponible
            if (diferencia > 0) {
                if (stockActual < diferencia) return 'danger';
            }
            
            return 'success';
        },
        
        getCambioColor(libro) {
            const cantidadNueva = parseInt(libro.cantidadProforma || 0);
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            
            if (diferencia > 0) return 'success'; // Aumentó
            if (diferencia < 0) return 'warning'; // Disminuyó
            return 'dark'; // Sin cambio
        },
        
        getCambioTexto(libro) {
            const cantidadNueva = parseInt(libro.cantidadProforma || 0);
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            
            if (diferencia > 0) return `+${diferencia}`;
            if (diferencia < 0) return `${diferencia}`;
            return '=';
        },
        
        obtenerColorCambio(libro, cantidadNueva) {
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = parseInt(cantidadNueva || 0) - cantidadOriginal;
            
            if (diferencia > 0) return 'success'; // Aumentó (verde)
            if (diferencia < 0) return 'warning'; // Disminuyó (amarillo)
            return 'dark'; // Sin cambio (gris)
        },
        
        calcularCambioReserva(libro, cantidadNueva) {
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = parseInt(cantidadNueva || 0) - cantidadOriginal;
            
            if (diferencia > 0) return `+${diferencia}`;
            if (diferencia < 0) return `${diferencia}`;
            return '=';
        },
        
        obtenerColorStock(libro) {
            const stock = libro.stock !== undefined ? libro.stock : (libro.stock_perseo_actual || 0);
            
            if (stock === 0) return 'danger';
            if (stock < 10) return 'warning';
            return 'success';
        },
        
        obtenerTooltipStock(libro) {
            const stockActual = libro.stock_perseo_actual;
            if (stockActual === undefined) {
                return 'Consultando stock en Perseo...';
            }
            
            const cantidadNueva = parseInt(libro.cantidadProforma || 0);
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            const reservaActual = (this.reservasOriginales[libro.pro_codigo] && this.reservasOriginales[libro.pro_codigo].reserva_perseo) || 0;
            
            let texto = `Stock Perseo Actual: ${stockActual}`;
            texto += ` | Reserva Original: ${cantidadOriginal}`;
            
            if (diferencia !== 0) {
                texto += ` | Cambio: ${diferencia > 0 ? '+' : ''}${diferencia}`;
                
                if (diferencia > 0) {
                    texto += ` | Requiere: ${diferencia} unidades adicionales`;
                    if (stockActual < diferencia) {
                        texto += ' | ⚠️ Stock insuficiente para el incremento';
                    } else {
                        texto += ' | ✓ Stock suficiente';
                    }
                } else {
                    texto += ` | Se liberarán: ${Math.abs(diferencia)} unidades`;
                }
            } else {
                texto += ' | Sin cambios';
            }
            
            return texto;
        },
        
        validarCantidadListado(libro, mostrarNotificaciones = true) {
            const cantidadNueva = parseInt(libro.cantidadProforma);
            
            if (libro.cantidadProforma === '' || libro.cantidadProforma === null) {
                this.$set(libro, 'errorStockMinimo', '');
                return;
            }
            
            if (cantidadNueva <= 0) {
                this.$set(libro, 'errorStockMinimo', 'Cantidad debe ser mayor a 0');
                return;
            }
            
            // ✅ VALIDACIÓN CON SISTEMA DE RESERVAS
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            
            // Si está aumentando la cantidad, validar que haya stock disponible
            if (diferencia > 0) {
                const stockActual = libro.stock_perseo_actual || 0;
                
                if (stockActual < diferencia) {
                    this.$set(libro, 'errorStockMinimo', 
                        `⚠️ Stock insuficiente. Disponible: ${stockActual}, Requiere: ${diferencia}`);
                    if (mostrarNotificaciones) {
                        this.$vs.notify({
                            title: '❌ Stock Perseo Insuficiente',
                            text: `Solo hay ${stockActual} unidades disponibles. Necesita ${diferencia} adicionales.`,
                            color: 'danger'
                        });
                    }
                    return;
                }
            }
            
            this.$set(libro, 'errorStockMinimo', '');
        },
        
        // ==========================================
        // MÉTODOS AUXILIARES DEL ORIGINAL (sin cambios)
        // ==========================================
        inicializarEdicion() {
            this.getEmpresas();
            this.cargarDatosProforma();
        },
        
        getEmpresas() {
            let me = this;
            me.listaEmpresas = [];
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data.filter(empresa => empresa.id !== 2);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error('❌ Error al cargar empresas:', err);
                    me.$vs.loading.close();
                });
        },
        
        hayModificaciones() {
            if (!this.datosOriginales) return false;
            
            const cambiosBasicos = 
                this.proformaData.emp_id !== this.datosOriginales.proformaData.emp_id ||
                this.proformaData.pro_des_por !== this.datosOriginales.proformaData.pro_des_por ||
                this.proformaData.prof_observacion !== this.datosOriginales.proformaData.prof_observacion;
            
            const cambioDespacho = this.nuevoLugarDespacho !== null;
            const cambioCliente = this.nuevoClientePerseo !== null;
            
            return cambiosBasicos || cambioDespacho || cambioCliente;
        },
        
        hayModificacionesEnLibros() {
            if (!this.datosOriginales || !this.datosOriginales.detallesProforma) return false;
            
            // ✅ Comparar directamente con detallesProforma
            for (let detalle of this.detallesProforma) {
                const cantidadActual = parseInt(detalle.cantidadProforma || 0);
                const cantidadOriginal = parseInt(detalle.cantidadOriginal || 0);
                
                if (cantidadActual !== cantidadOriginal) {
                    console.log(`📝 Cambio detectado en ${detalle.pro_codigo}: ${cantidadOriginal} → ${cantidadActual}`);
                    return true;
                }
            }
            
            return false;
        },
        
        calcularTotalesUnificados() {
            // ✅ Calcular totales de detallesProforma
            const librosParaProforma = this.detallesProforma.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            const subtotal = librosParaProforma.reduce((total, libro) => {
                const precio = parseFloat(libro.precio || libro.pvp || 0);
                const cantidad = parseInt(libro.cantidadProforma) || 0;
                return total + (precio * cantidad);
            }, 0);
            
            const descuentoPorcentaje = parseFloat(this.proformaData.pro_des_por) || 0;
            const descuentoMonto = subtotal * (descuentoPorcentaje / 100);
            const subtotalConDescuento = subtotal - descuentoMonto;
            
            const iva = 0;
            const transporte = 0;
            const total = subtotalConDescuento + iva + transporte;
            
            return {
                subtotal,
                descuentoMonto,
                subtotalConDescuento,
                iva,
                transporte,
                total,
                cantidadLibros: librosParaProforma.length
            };
        },
        
        calcularSubtotalLibro(libro) {
            if (!libro.cantidadProforma || parseInt(libro.cantidadProforma) === 0) {
                return '0.00';
            }
            const precio = parseFloat(libro.precio || libro.pvp || 0);
            const cantidad = parseInt(libro.cantidadProforma) || 0;
            return (precio * cantidad).toFixed(2);
        },
        
        contarLibrosConCantidad() {
            return this.detallesProforma.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            ).length;
        },
        
        getEstadoColor(estado) {
            const colores = {
                1: 'warning',
                2: 'success',
                3: 'danger'
            };
            return colores[estado] || 'primary';
        },
        
        getEstadoTexto(estado) {
            const textos = {
                1: 'Pendiente',
                2: 'Aprobado',
                3: 'Rechazado'
            };
            return textos[estado] || 'Desconocido';
        },
        
        normalizarDescuentoPrincipal() {
            if (this.proformaData.pro_des_por !== '' && this.proformaData.pro_des_por !== null) {
                const valor = parseFloat(this.proformaData.pro_des_por);
                if (!isNaN(valor)) {
                    this.proformaData.pro_des_por = valor;
                }
            }
        },
        
        normalizarDescuentoCupo() {
            if (this.formularioCupoData.ffp_descuento !== '' && this.formularioCupoData.ffp_descuento !== null) {
                const valor = parseFloat(this.formularioCupoData.ffp_descuento);
                if (!isNaN(valor)) {
                    this.formularioCupoData.ffp_descuento = valor.toString();
                }
            }
        },

        validarYCorregirDescuentoPrincipal(tipo) {
            if( tipo === 1){
                this.normalizarDescuentoPrincipal();
                if (this.proformaData.pro_des_por !== '' && this.proformaData.pro_des_por !== null) {
                    let valor = parseFloat(this.proformaData.pro_des_por);
                    
                    if (!isNaN(valor)) {
                        if (valor > 100) {
                            this.proformaData.pro_des_por = 100;
                        } else if (valor < 0) {
                            this.proformaData.pro_des_por = 0;
                        }
                    }
                }
            }else{
                this.normalizarDescuentoCupo();
                if (this.formularioCupoData.ffp_descuento !== '' && this.formularioCupoData.ffp_descuento !== null) {
                    const valor = parseFloat(this.formularioCupoData.ffp_descuento);
                    if (!isNaN(valor)) {
                        if (valor > 100) {
                            this.formularioCupoData.ffp_descuento = 100;
                        } else if (valor < 0) {
                            this.formularioCupoData.ffp_descuento = 0;
                        }
                    }
                }
            }
        },
        
        esVentaPorLista() {
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 2;
        },
        
        debeMostrarCupo() {
            return this.esVentaPorLista() && this.esPrimeraProforma;
        },
        
        tieneCupoSuficiente() {
            if (!this.debeMostrarCupo()) return true;
            
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return false;
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            
            return cupoInicial > 0 && totalProforma <= cupoInicial;
        },
        
        obtenerCupoMaximo() {
            if (!this.debeMostrarCupo()) return '0.00';
            
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            return cupoInicial.toFixed(2);
        },
        
        intentarGuardarCambios() {
            let me = this;
            let erroresFaltantes = [];
            
            const hayCambiosBasicos = me.hayModificaciones();
            const hayCambiosEnLibros = me.hayModificacionesEnLibros();
            
            if (!hayCambiosBasicos && !hayCambiosEnLibros) {
                erroresFaltantes.push('• <b>No se han realizado modificaciones</b> en la proforma');
            }
            
            const librosConCantidad = me.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            if (librosConCantidad.length === 0) {
                erroresFaltantes.push('• Debe tener al menos <b>un libro con cantidad mayor a 0</b>');
            }
            
            const descuento = parseFloat(me.proformaData.pro_des_por);
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                erroresFaltantes.push('• El <b>Descuento</b> debe ser un valor mayor a 0 y no mayor a 100');
            }
            
            const librosConError = me.detallesProforma.filter(libro => 
                libro.errorStockMinimo && libro.errorStockMinimo !== ''
            );
            
            if (librosConError.length > 0) {
                erroresFaltantes.push(`• Hay <b>${librosConError.length} libro(s) con errores</b> de validación de stock`);
            }
            
            if (erroresFaltantes.length > 0) {
                me.$vs.notify({
                    title: '⚠️ No se puede guardar',
                    text: '<div style="text-align: left; padding: 10px;"><p style="margin-bottom: 10px; font-weight: 600;">Corrija lo siguiente:</p>' + erroresFaltantes.join('<br>') + '</div>',
                    color: 'warning',
                    position: 'top-center',
                    time: 8000
                });
                return;
            }
            
            me.guardarCambios();
        },
        
        mostrarPopupStockInsuficiente(productosInvalidos) {
            this.productosStockInsuficiente = productosInvalidos;
            this.popupStockInsuficiente = true;
        },
        
        async cerrarPopupStockInsuficiente() {
            this.popupStockInsuficiente = false;
            this.productosStockInsuficiente = [];
            
            this.$vs.loading({
                text: 'Actualizando stock de Perseo...'
            });
            
            await this.consultarStockLibros();
            
            this.$vs.loading.close();
            
            this.$vs.notify({
                title: 'Stock Actualizado',
                text: 'El stock de Perseo ha sido reconsultado. Por favor verifique las cantidades.',
                color: 'success'
            });
        },
        
        abrirBusquedaDespacho() {
            this.mostrarBusquedaDespacho = true;
        },
        
        seleccionarNuevoDespacho(lugar) {
            this.nuevoLugarDespacho = {
                idInstitucion: lugar.id_institucion || lugar.idInstitucion,
                nombreInstitucion: lugar.nombreInstitucion,
                ruc: lugar.ruc || '',
                ciudad: lugar.ciudad || '',
                datosInstitucion: lugar.datosInstitucion || []
            };
            
            this.mostrarBusquedaDespacho = false;
        },
        
        cerrarBusquedaDespacho() {
            this.mostrarBusquedaDespacho = false;
        },
        
        cancelarCambioDespacho() {
            this.nuevoLugarDespacho = null;
        },
        
        abrirBusquedaCliente() {
            if (!this.proformaData.emp_id) {
                this.$vs.notify({
                    text: 'Debe seleccionar una empresa primero',
                    color: 'warning'
                });
                return;
            }
            this.mostrarBusquedaCliente = true;
        },
        
        seleccionarNuevoCliente(cliente) {
            this.nuevoClientePerseo = {
                idusuario: cliente.idusuario,
                clientesidPerseo: cliente.clientesidPerseo,
                nombre: cliente.nombre,
                cedula: cliente.cedula,
                telefono: cliente.telefono || '',
                email: cliente.email || ''
            };
            this.mostrarBusquedaCliente = false;
        },
        
        cerrarBusquedaCliente() {
            this.mostrarBusquedaCliente = false;
        },
        
        cancelarCambioCliente() {
            this.nuevoClientePerseo = null;
        },
        
        // ==========================================
        // MÉTODOS PARA CAPTURA RÁPIDA EN EDICIÓN
        // ==========================================
        avanzarSiguienteFilaRapida(index) {
            const libroActual = this.detallesProforma[index];
            
            // Validar cantidad
            if (!libroActual.cantidadProforma || libroActual.cantidadProforma.toString().trim() === '') {
                this.$vs.notify({
                    text: 'Debe ingresar una cantidad válida',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const cantidadNueva = parseInt(libroActual.cantidadProforma);
            
            if (cantidadNueva < 0) {
                this.$vs.notify({
                    text: 'La cantidad no puede ser negativa',
                    color: 'warning'
                });
                return;
            }
            
            // Validar stock si está aumentando
            const cantidadOriginal = libroActual.cantidadOriginal || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            
            if (diferencia > 0) {
                const stockActual = libroActual.stock_perseo_actual || 0;
                
                if (stockActual < diferencia) {
                    this.$vs.notify({
                        title: '❌ Stock Insuficiente',
                        text: `Solo hay ${stockActual} unidades disponibles. Necesita ${diferencia} adicionales.`,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle'
                    });
                    return;
                }
            }
            
            // Si es la última fila, volver a la primera
            const siguienteIndex = index + 1;
            
            if (siguienteIndex >= this.detallesProforma.length) {
                // Volver a la primera fila
                this.enfocarInputRapido(0);
                
                this.$vs.notify({
                    text: 'Has llegado al final. Enfocando primera fila.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                });
            } else {
                // Avanzar a la siguiente fila
                this.enfocarInputRapido(siguienteIndex);
            }
        },
        
        enfocarInputRapido(index) {
            this.$nextTick(() => {
                setTimeout(() => {
                    const inputRef = this.$refs[`cantidad-${index}`];
                    if (inputRef && inputRef[0]) {
                        const inputElement = inputRef[0].$el.querySelector('input');
                        if (inputElement) {
                            inputElement.focus();
                            inputElement.select();
                        }
                    }
                }, 100);
            });
        },
        
        manejarBorrarCantidad(libro, index) {
            // Si el campo ya está vacío y presiona DELETE/BACKSPACE, poner en 0
            if (!libro.cantidadProforma || libro.cantidadProforma.toString().trim() === '' || parseInt(libro.cantidadProforma) === 0) {
                this.$set(libro, 'cantidadProforma', '0');
                this.$set(libro, 'errorStockMinimo', '');
                
                this.$vs.notify({
                    text: `Cantidad establecida en 0`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-minus-circle'
                });
            }
        },
        
        limpiarCantidadLibro(libro, index) {
            // Poner cantidad en 0 y limpiar error
            this.$set(libro, 'cantidadProforma', '0');
            this.$set(libro, 'errorStockMinimo', '');
            
            this.$vs.notify({
                text: `Cantidad de "${libro.nombre_libro}" establecida en 0`,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-minus-circle'
            });
        },
        
        // ==========================================
        // MÉTODOS PARA AGREGAR NUEVAS FILAS
        // ==========================================
        agregarFilaCaptura() {
            this.filasCaptura.push({ 
                textoBusqueda: '', 
                libroSeleccionado: null, 
                cantidad: '', 
                confirmado: false, 
                resultadosBusqueda: [],
                sugerenciaActual: null,
                consultandoStock: false,
                stockError: false
            });
        },
        
        buscarEnFila(fila, index) {
            // Limpiar el libro seleccionado si cambia el texto
            if (fila.libroSeleccionado && fila.textoBusqueda !== fila.libroSeleccionado.nombre_libro &&
                fila.textoBusqueda !== fila.libroSeleccionado.pro_codigo) {
                fila.libroSeleccionado = null;
                fila.cantidad = '';
                fila.confirmado = false;
                fila.errorCantidad = '';
            }
            
            const busqueda = fila.textoBusqueda.trim().toLowerCase();
            
            // Si no hay búsqueda, limpiar resultados
            if (busqueda.length < 2) {
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                return;
            }
            
            // Obtener códigos ya seleccionados en otras filas
            const codigosSeleccionados = this.filasCaptura
                .filter((f, idx) => idx !== index && f.libroSeleccionado)
                .map(f => f.libroSeleccionado.pro_codigo);
            
            // Filtrar libros que NO estén ya seleccionados en esta tabla
            const librosDisponibles = this.librosConStock.filter(libro => 
                !codigosSeleccionados.includes(libro.pro_codigo)
            );
            
            // Buscar en libros disponibles
            const palabrasBusqueda = busqueda.split(' ').filter(p => p.length > 0);
            
            const resultados = librosDisponibles.map(libro => {
                const codigo = (libro.pro_codigo || '').toLowerCase();
                const nombre = (libro.nombre_libro || '').toLowerCase();
                
                let puntuacion = 0;
                
                // Coincidencia exacta de código
                if (codigo === busqueda) {
                    puntuacion = 1000;
                }
                // Código empieza con búsqueda
                else if (codigo.startsWith(busqueda)) {
                    puntuacion = 500;
                }
                // Nombre empieza con búsqueda
                else if (nombre.startsWith(busqueda)) {
                    puntuacion = 300;
                }
                // Código contiene la búsqueda
                else if (codigo.includes(busqueda)) {
                    puntuacion = 200;
                }
                // Nombre contiene la búsqueda
                else if (nombre.includes(busqueda)) {
                    puntuacion = 100;
                } else {
                    // Buscar por palabras individuales
                    let palabrasEncontradas = 0;
                    palabrasBusqueda.forEach(palabra => {
                        if (codigo.includes(palabra)) {
                            palabrasEncontradas += 2; // Palabras en código valen más
                        }
                        if (nombre.includes(palabra)) {
                            palabrasEncontradas += 1;
                        }
                    });
                    puntuacion = palabrasEncontradas;
                }
                
                return {
                    ...libro,
                    puntuacion
                };
            })
            .filter(libro => libro.puntuacion > 0)
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, 5);
            
            fila.resultadosBusqueda = resultados;
            fila.sugerenciaActual = resultados.length > 0 ? resultados[0] : null;
        },
        
        async aceptarYConsultarStock(fila, index) {
            // Si ya hay un libro seleccionado, pasar a la cantidad
            if (fila.libroSeleccionado && !fila.consultandoStock) {
                this.$nextTick(() => {
                    const inputCantidad = this.$refs[`cantidad-${index}`];
                    if (inputCantidad && inputCantidad.length > 0) {
                        inputCantidad[0].$el.querySelector('input').focus();
                    }
                });
                return;
            }
            
            // Si no hay sugerencia, no hacer nada
            if (!fila.sugerenciaActual) return;
            
            // Seleccionar el libro de la sugerencia y consultar stock en Perseo
            await this.seleccionarLibroEnFila(fila, fila.sugerenciaActual, index);
        },
        
        async seleccionarLibroEnFila(fila, libro, index) {
            fila.libroSeleccionado = libro;
            fila.textoBusqueda = libro.nombre_libro;
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
            fila.confirmado = true;
            
            // Consultar stock en Perseo
            await this.consultarStockIndividual(fila, index);
            
            // Sincronizar con detallesProforma
            this.sincronizarFilaConDetalles(fila);
            
            // Mover foco a cantidad
            this.$nextTick(() => {
                const inputCantidad = this.$refs[`cantidad-${index}`];
                if (inputCantidad && inputCantidad.length > 0) {
                    inputCantidad[0].$el.querySelector('input').focus();
                }
            });
        },
        
        avanzarAlSiguienteLibro(index) {
            const fila = this.filasCaptura[index];
            
            // Validar antes de avanzar
            if (!fila.libroSeleccionado) return;
            if (!fila.cantidad || parseInt(fila.cantidad) <= 0) {
                fila.errorCantidad = 'Ingrese una cantidad válida';
                return;
            }
            
            // Limpiar error
            fila.errorCantidad = '';
            
            // Sincronizar con detallesProforma
            this.sincronizarFilaConDetalles(fila);
            
            // Si es la última fila, agregar nueva automáticamente
            if (index === this.filasCaptura.length - 1) {
                this.agregarFilaCaptura();
                this.$nextTick(() => {
                    const nuevoInput = document.getElementById(`input-busqueda-${index + 1}`);
                    if (nuevoInput) {
                        nuevoInput.focus();
                    }
                });
            } else {
                // Mover al siguiente input de búsqueda
                this.$nextTick(() => {
                    const siguienteInput = document.getElementById(`input-busqueda-${index + 1}`);
                    if (siguienteInput) {
                        siguienteInput.focus();
                    }
                });
            }
        },
        
        limpiarFilaCaptura(fila, index) {
            // Si tenía libro seleccionado, quitar de detallesProforma
            if (fila.libroSeleccionado) {
                const indiceDetalle = this.detallesProforma.findIndex(d => 
                    d.pro_codigo === fila.libroSeleccionado.pro_codigo
                );
                if (indiceDetalle !== -1) {
                    this.detallesProforma.splice(indiceDetalle, 1);
                }
            }
            
            // Limpiar fila
            fila.textoBusqueda = '';
            fila.libroSeleccionado = null;
            fila.cantidad = '';
            fila.confirmado = false;
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
            fila.errorCantidad = '';
            fila.consultandoStock = false;
            
            // Enfocar el input de búsqueda
            this.$nextTick(() => {
                const input = document.getElementById(`input-busqueda-${index}`);
                if (input) {
                    input.focus();
                }
            });
        },
        
        sincronizarFilaConDetalles(fila) {
            if (!fila.libroSeleccionado) return;
            
            // Buscar si ya existe en detallesProforma
            const detalleExistente = this.detallesProforma.find(d => 
                d.pro_codigo === fila.libroSeleccionado.pro_codigo
            );
            
            if (detalleExistente) {
                // Actualizar cantidad
                detalleExistente.cantidadProforma = fila.cantidad || '0';
            } else if (fila.cantidad && parseInt(fila.cantidad) > 0) {
                // Agregar nuevo libro a detallesProforma
                this.detallesProforma.push({
                    pro_codigo: fila.libroSeleccionado.pro_codigo,
                    nombre_libro: fila.libroSeleccionado.nombre_libro,
                    nombrelibro: fila.libroSeleccionado.nombre_libro,
                    precio: fila.libroSeleccionado.precio,
                    cantidadProforma: fila.cantidad,
                    cantidadOriginal: 0,
                    stock_perseo_actual: fila.libroSeleccionado.stock,
                    stock_perseo_historico: 0,
                    stock: fila.libroSeleccionado.stock
                });
            }
        },
        
        validarYSincronizarCantidad(fila, index) {
            // Limpiar error previo
            fila.errorCantidad = '';
            
            // Si la cantidad está vacía, permitir temporalmente
            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                this.sincronizarFilaConDetalles(fila);
                return;
            }
            
            // Convertir a número y validar
            const cantidad = parseInt(fila.cantidad);
            
            // Validar que no sea 0 o negativo
            if (cantidad <= 0) {
                fila.errorCantidad = 'La cantidad debe ser mayor a 0';
                return;
            }
            
            // Si hay libro seleccionado, validar contra stock de Perseo
            if (fila.libroSeleccionado) {
                const stockActualPerseo = fila.libroSeleccionado.stock_perseo_actual || fila.libroSeleccionado.stock || 0;
                const cantidadOriginal = fila.libroSeleccionado.cantidadOriginal || 0;
                const diferencia = cantidad - cantidadOriginal;
                
                // Si está aumentando la cantidad, validar que haya stock disponible en Perseo
                if (diferencia > 0) {
                    if (stockActualPerseo < diferencia) {
                        fila.errorCantidad = `⚠️ Stock Perseo insuficiente. Disponible: ${stockActualPerseo}, Requiere: ${diferencia}`;
                        return;
                    }
                }
                
                // Validación básica: no puede exceder el stock total si es un nuevo producto
                if (cantidadOriginal === 0 && cantidad > stockActualPerseo) {
                    fila.errorCantidad = `Stock insuficiente en Perseo (máx: ${stockActualPerseo})`;
                    return;
                }
            }
            
            // Si todo está bien, sincronizar
            this.sincronizarFilaConDetalles(fila);
        },
        
        manejarBorradoBusqueda(fila, index, event) {
            // Solo actuar si el campo de búsqueda está vacío
            if (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') {
                // Si es la primera fila (index 0), NO eliminar - solo mantener vacía
                if (index === 0) {
                    console.log('⚠️ Primera fila no se puede eliminar');
                    return;
                }
                
                // Si no es la primera fila y está vacía, eliminarla
                console.log('🗑️ Eliminando fila vacía:', index);
                
                // Prevenir el comportamiento por defecto del backspace
                event.preventDefault();
                
                // Eliminar la fila
                this.filasCaptura.splice(index, 1);
                
                // Enfocar la fila anterior
                this.$nextTick(() => {
                    setTimeout(() => {
                        const filaAnterior = this.filasCaptura[index - 1];
                        if (filaAnterior && filaAnterior.libroSeleccionado) {
                            // Si la fila anterior tiene libro, enfocar cantidad
                            const inputCantidad = this.$refs[`cantidad-${index - 1}`];
                            if (inputCantidad) {
                                const inputComponent = Array.isArray(inputCantidad) ? inputCantidad[0] : inputCantidad;
                                if (inputComponent && inputComponent.$el) {
                                    const input = inputComponent.$el.querySelector('input');
                                    if (input) {
                                        input.focus();
                                        console.log('✅ Focus movido a cantidad de fila anterior:', index - 1);
                                    }
                                }
                            }
                        } else {
                            // Si no tiene libro, enfocar búsqueda
                            const inputBusqueda = document.getElementById(`input-busqueda-${index - 1}`);
                            if (inputBusqueda) {
                                inputBusqueda.focus();
                                console.log('✅ Focus movido a búsqueda de fila anterior:', index - 1);
                            }
                        }
                    }, 50);
                });
            }
        },
        
        manejarBorradoCantidad(fila, index) {
            // Verificar después de un pequeño delay si el campo quedó vacío
            this.$nextTick(() => {
                // Si la cantidad está vacía o es 0, limpiar solo el libro seleccionado y cantidad
                if (!fila.cantidad || fila.cantidad.toString().trim() === '' || fila.cantidad === '0') {
                    console.log('🗑️ Cantidad borrada - limpiando libro seleccionado y enfocando búsqueda de ESTA fila');
                    
                    // Limpiar cantidad en detallesProforma si existe
                    if (fila.libroSeleccionado) {
                        const detalleEnTabla = this.detallesProforma.find(d => d.pro_codigo === fila.libroSeleccionado.pro_codigo);
                        if (detalleEnTabla) {
                            detalleEnTabla.cantidadProforma = '';
                        }
                    }
                    
                    // Limpiar solo el libro seleccionado y cantidad, pero mantener la búsqueda
                    fila.libroSeleccionado = null;
                    fila.cantidad = '';
                    fila.confirmado = false;
                    fila.errorCantidad = '';
                    fila.consultandoStock = false;
                    fila.stockError = false;
                    
                    // Enfocar el input de búsqueda de ESTA MISMA fila
                    this.$nextTick(() => {
                        setTimeout(() => {
                            const inputBusqueda = document.getElementById(`input-busqueda-${index}`);
                            if (inputBusqueda) {
                                inputBusqueda.focus();
                                console.log('✅ Focus movido a búsqueda de fila', index);
                            }
                        }, 50);
                    });
                }
            });
        },
        
        obtenerPlaceholder(fila) {
            if (fila.libroSeleccionado) {
                return fila.libroSeleccionado.nombre_libro;
            }
            return 'Buscar por código o nombre...';
        },
        
        calcularSubtotalFila(fila) {
            if (!fila.libroSeleccionado || !fila.cantidad) return '0.00';
            const precio = parseFloat(fila.libroSeleccionado.precio || 0);
            const cantidad = parseInt(fila.cantidad || 0);
            return (precio * cantidad).toFixed(2);
        },
        
        limpiarModal() {
            this.proformaData = {
                id: null,
                prof_id: '',
                emp_id: null,
                pro_des_por: 0,
                prof_descuento: 0,
                prof_observacion: '',
                prof_total: 0,
                prof_estado: 1,
                contrato: '',
                created_at: '',
                usu_codigo: null,
                pedido_id: null,
                id_ins_depacho: null,
                ven_cliente: null,
                ruc_cliente: '',
                clientesidPerseo: null
            };
            
            this.lugarDespacho = {
                idInstitucion: null,
                nombreInstitucion: '',
                ruc: '',
                ciudad: '',
                datosInstitucion: []
            };
            
            this.clientePerseo = {
                id: null,
                nombre: '',
                cedula: '',
                email: ''
            };
            
            this.nuevoLugarDespacho = null;
            this.nuevoClientePerseo = null;
            this.detallesProforma = [];
            this.datosOriginales = null;
            this.reservasOriginales = {};
            
            // Resetear filas de captura
            this.filasCaptura = [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    consultandoStock: false,
                    stockError: false
                }
            ];
            this.librosConStock = [];
            
            this.progresoStock = {
                actual: 0,
                total: 0,
                mostrando: false
            };
            
            this.loadingDatos = false;
            this.loadingStock = false;
            this.filtrarSoloConCantidad = true;
            this.mostrarBusquedaDespacho = false;
            this.mostrarBusquedaCliente = false;
        },
        
        cerrarModal() {
            this.popupEditar = false;
        },
        
        // Stubs para métodos de cupo (no se usan validaciones de stock mínimo en Perseo)
        async consultarCupoLugarDespacho() {
            // Implementación si es necesaria
        },
        toggleFormularioCupo() {
            this.showFormularioCupo = !this.showFormularioCupo;
        },
        editarCupoLugarActual() {
            this.showFormularioCupoActual = true;
        },
        async guardarFormularioCupo() {
            // Implementación si es necesaria
        }
    }
}
</script>
<style scoped>
/* Estilos existentes del modal original... */
/* (Todos los estilos CSS del original se mantienen igual) */
.popup-proforma {
    z-index: 51001;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.barra-totales-sticky-compacta {
    position: sticky;
    top: -20px;
    z-index: 1000;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    margin: -20px -20px 15px -20px;
    background: transparent;
}

.barra-normal {
    border-bottom: 2px solid #48bb78;
}

.barra-error {
    border-bottom: 2px solid #f56565;
}

.contenido-barra-compacta {
    padding: 10px 20px;
    background: white;
    margin: 0 16px;
    border-radius: 0 0 6px 6px;
}

.badge-items, .badge-cupo, .badge-total {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: white;
}

.badge-items {
    background: #5b3cc4;
}

.badge-success {
    background: #48bb78;
}

.badge-error {
    background: #f56565;
}

.error-cupo {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    color: #742a2a;
    background: #fed7d7;
    border: 1px solid #fc8181;
}

/* =============================================== */
/* ESTILOS PARA TABLA DE CAPTURA RÁPIDA EDICIÓN */
/* =============================================== */
.captura-rapida-container {
    padding: 0;
    position: relative;
    z-index: 1;
}

.tabla-captura-container {
    background: white;
    border-radius: 6px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    margin-bottom: 20px;
    position: relative;
    overflow: visible;
    border: 1px solid #e8e8e8;
}

.tabla-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

/* Contenedor específico para inputs con dropdown */
.input-with-dropdown {
    position: relative;
    z-index: 10;
}

.headers-form {
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
}

/* Sugerencia inline */
.sugerencia-inline {
    background-color: #edf2f7;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    padding: 8px 12px;
    margin-top: 5px;
    font-size: 12px;
    color: #5b3cc4;
    box-shadow: none;
}

.dropdown-resultados {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    z-index: 51020 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-top: 2px;
    max-height: 200px;
    overflow-y: auto;
}

.dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
    transition: background-color 0.2s;
    background-color: white;
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover {
    background-color: #f7fafc !important;
}

.libro-encontrado input {
    border-color: #48bb78 !important;
    background-color: #fafafa !important;
    cursor: default !important;
}

.libro-encontrado input[readonly] {
    background-color: #f7fafc !important;
    color: #48bb78 !important;
    font-weight: 500;
    cursor: not-allowed !important;
}

/* Spinner pequeño para inline */
.loading-spinner-small {
    width: 12px;
    height: 12px;
    border: 2px solid #e8e8e8;
    border-top: 2px solid #5b3cc4;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* Estilos para validaciones de errores */
.cantidad-error {
    border-color: #f56565 !important;
    background-color: #fff5f5 !important;
}

.error-cantidad {
    color: #f56565;
    font-size: 0.75rem;
    margin-top: 2px;
    display: block;
}

.vs-input.cantidad-error .vs-input--input {
    border-color: #f56565 !important;
}

.input-error-stock >>> input {
    border: 2px solid #ff4757 !important;
    background-color: #fff5f5 !important;
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

</style>