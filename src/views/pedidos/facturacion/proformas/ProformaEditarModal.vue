<template>
    <vs-popup-history
        fullscreen
        :title="`Editar Proforma - ${proformaData.prof_id || 'Cargando...'}`"
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
                                <!-- <div class="text-sm text-gray-600">
                                    ID: {{ empresaActual.id || 'N/A' }}
                                </div> -->
                            </div>
                            
                            <!-- Selector para CAMBIAR empresa -->
                            <!-- <div class="mb-2">
                                <label class="text-xs text-gray-600 mb-1 block">Cambiar a:</label>
                                <v-select
                                    :options="listaEmpresas"
                                    :reduce="(empresa) => empresa.id"
                                    label="descripcion_corta"
                                    placeholder="Seleccione nueva empresa..."
                                    v-model="proformaData.emp_id"
                                    class="w-full"
                                >
                                    <template #option="option">
                                        <div class="py-1">
                                            <div class="font-bold">{{ option.descripcion_corta }} - {{ 'ID: ' + (option.id || 'Sin código') }}</div>
                                        </div>
                                    </template>
                                </v-select>
                            </div> -->
                            
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
                                            <!-- <div v-if="clientePerseo.email" class="text-sm text-blue-600">
                                                {{ clientePerseo.email }}
                                            </div> -->
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
                                            <!-- <div v-if="nuevoClientePerseo.email" class="text-sm text-blue-600">
                                                {{ nuevoClientePerseo.email }}
                                            </div> -->
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

                <!-- Componente de Configuración -->
                <ConfigProforma
                    v-model="mostrarConfigSidebar"
                    :config="configProforma"
                    :stock-minimo="stockMinimo"
                    :mostrar-boton="!!proformaData.emp_id"
                    @update-config="handleConfigUpdate"
                />

                <!-- Sección para Agregar Libros Extras (solo visible cuando está activado) - VERSIÓN COMPACTA -->
                <vx-card v-if="configProforma.permitirTodosLibros" class="mb-3">
                    <div class="header-extras-compacto">
                        <feather-icon icon="PlusCircleIcon" size="14" class="mr-1"></feather-icon>
                        <span class="font-semibold text-sm">Agregar Libro Extra</span>
                    </div>
                    
                    <div class="body-extras-compacto">
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                            <!-- Búsqueda de libro -->
                            <div class="md:col-span-6 input-wrapper-compacto">
                                <vs-input
                                    v-model="libroExtra.textoBusqueda"
                                    @input="buscarLibroExtra"
                                    @keydown.native="manejarTecladoLibroExtra"
                                    placeholder="Buscar por código o nombre..."
                                    class="w-full input-compacto"
                                    :readonly="libroExtra.libroSeleccionado"
                                    ref="inputBusquedaLibroExtra"
                                >
                                    <template #icon>
                                        <feather-icon icon="SearchIcon" size="14"></feather-icon>
                                    </template>
                                    <template v-if="libroExtra.textoBusqueda" #icon-after>
                                        <feather-icon 
                                            icon="XIcon" 
                                            size="12" 
                                            class="cursor-pointer"
                                            @click="limpiarBusquedaLibroExtra"
                                        ></feather-icon>
                                    </template>
                                </vs-input>
                                
                                <!-- Resultados de búsqueda -->
                                <div v-if="libroExtra.resultadosBusqueda.length > 0" class="resultados-busqueda-extra-compacto">
                                    <div 
                                        v-for="(resultado, idx) in libroExtra.resultadosBusqueda" 
                                        :key="idx"
                                        @click="seleccionarLibroExtra(resultado)"
                                        @mouseenter="libroExtra.indiceSeleccionado = idx"
                                        class="resultado-item-extra-compacto"
                                        :class="{'resultado-item-activo': idx === libroExtra.indiceSeleccionado}"
                                    >
                                        <span class="resultado-codigo-compacto">{{ resultado.pro_codigo }}</span>
                                        <span class="resultado-nombre-compacto">{{ resultado.nombre_libro }}</span>
                                        <span class="resultado-stock-compacto" :class="{'text-danger': !resultado.stock || resultado.stock === 0, 'text-success': resultado.stock > 0}">
                                            Stock: {{ resultado.stock !== undefined ? resultado.stock : '...' }}
                                        </span>
                                        <span class="resultado-precio-compacto">${{ parseFloat(resultado.precio || 0).toFixed(2) }}</span>
                                    </div>
                                </div>
                                
                                <!-- Libro seleccionado con stock -->
                                <div v-if="libroExtra.libroSeleccionado" class="libro-extra-seleccionado-compacto">
                                    <feather-icon icon="CheckIcon" size="10" class="text-success"></feather-icon>
                                    <span class="libro-codigo-compacto">{{ libroExtra.libroSeleccionado.pro_codigo }}</span>
                                    <span class="libro-stock-badge" :class="{'badge-danger': !libroExtra.libroSeleccionado.stock || libroExtra.libroSeleccionado.stock === 0, 'badge-success': libroExtra.libroSeleccionado.stock > 0}">
                                        Stock: {{ libroExtra.libroSeleccionado.stock !== undefined ? libroExtra.libroSeleccionado.stock : 'Consultando...' }}
                                    </span>
                                    <feather-icon 
                                        icon="XIcon" 
                                        size="10" 
                                        class="cursor-pointer text-danger ml-auto"
                                        @click="limpiarBusquedaLibroExtra"
                                    ></feather-icon>
                                </div>
                            </div>
                            
                            <!-- Cantidad -->
                            <div class="md:col-span-3">
                                <vs-input
                                    v-model="libroExtra.cantidad"
                                    @keyup.enter="agregarLibroExtra"
                                    type="number"
                                    min="1"
                                    placeholder="Cant."
                                    class="w-full input-compacto"
                                    :disabled="!libroExtra.libroSeleccionado"
                                />
                            </div>
                            
                            <!-- Botón Agregar -->
                            <div class="md:col-span-3">
                                <vs-button 
                                    @click="agregarLibroExtra" 
                                    color="success" 
                                    type="filled"
                                    class="w-full btn-agregar-compacto"
                                    :disabled="!libroExtra.libroSeleccionado || !libroExtra.cantidad || parseInt(libroExtra.cantidad) <= 0"
                                    icon="add"
                                    icon-pack="material-icons"
                                >
                                    Agregar
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </vx-card>

                <!-- Gestión de Libros con Tabs -->
                <vx-card class="mb-4">
                    <template slot="header">
                        <h4>
                            <feather-icon icon="BookOpenIcon" size="12" class="inline mr-2"></feather-icon>
                            Gestión de Libros para Proforma
                        </h4>
                    </template>
                    
                    <!-- Tabs para diferentes modos de gestión -->
                    <vs-tabs>
                        <!-- Tab 1: Vista normal de libros -->
                        <vs-tab label="Libros del Pedido" icon="list">
                            <!-- Loading de stock -->
                            <div v-if="loadingStock" class="text-center py-8">
                                <div class="loading-spinner">
                                    <div class="spinner"></div>
                                </div>
                                <p class="mt-2 text-gray-600">Consultando stock disponible...</p>
                            </div>
                            
                            <!-- Tabla de libros con stock -->
                            <div v-else-if="librosPedido.length > 0">
                                <div class="mb-4 flex justify-between items-center">
                                    <div class="flex items-center gap-4">
                                        <vs-chip color="success">{{ librosPedido.length }} libros en el pedido</vs-chip>
                                        <vs-chip color="primary">{{ contarLibrosConCantidad() }} libros con cantidad</vs-chip>
                                    </div>
                                    
                                    <!-- Checkbox para filtrar -->
                                    <div class="flex items-center">
                                        <vs-checkbox v-model="filtrarSoloConCantidad" color="primary">
                                            Filtrar con cantidades mayor a 0
                                        </vs-checkbox>
                                    </div>
                                </div>
                                
                                <vs-table :data="librosConStockFiltrados" :max-items="librosConStockFiltrados.length" search :no-data-text="'No se encontraron libros con las cantidades especificadas'">
                                    <template slot="thead">
                                        <vs-th>Código</vs-th>
                                        <vs-th>Libro</vs-th>
                                        <vs-th>Precio Unit.</vs-th>
                                        <vs-th>Cantidad Pedida</vs-th>
                                        <vs-th>Ya Proformado</vs-th>
                                        <vs-th>Disponible</vs-th>
                                        <vs-th>Cantidad Proforma</vs-th>
                                        <vs-th>Stock</vs-th>
                                        <vs-th>Dif. Stock</vs-th>
                                        <vs-th>Subtotal</vs-th>
                                        <vs-th v-if="tieneLibrosExtras()">Acción</vs-th>
                                    </template>
                                    
                                    <template slot-scope="{data}">
                                        <vs-tr :data="libro" :key="index" v-for="(libro, index) in data">
                                            <vs-td>
                                                <div class="font-mono text-sm font-bold text-primary" style="display: flex; align-items: center; gap: 5px;">
                                                    <vx-tooltip 
                                                        v-if="libro.esLibroExtra" 
                                                        class="libro-extra-badge"
                                                        text="Libro Extra Agregado"
                                                    >
                                                        +
                                                    </vx-tooltip>
                                                    {{ libro.codigo_liquidacion || libro.pro_codigo }}
                                                </div>
                                            </vs-td>
                                            
                                            <vs-td>
                                                <div style="max-width: 250px;">
                                                    <p class="font-semibold text-sm">{{ libro.nombrelibro || libro.nombre_libro }}</p>
                                                </div>
                                            </vs-td>
                                            
                                            <vs-td>
                                                <vs-chip color="primary" class="text-center">
                                                    ${{ parseFloat(libro.precio || libro.pvp || 0).toFixed(2) }}
                                                </vs-chip>
                                            </vs-td>
                                            
                                            <!-- Cantidad Pedida -->
                                            <vs-td>
                                                <vs-chip 
                                                    v-if="!libro.esLibroExtra"
                                                    color="dark" 
                                                    size="small"
                                                >
                                                    {{ libro.cantidad || 0 }}
                                                </vs-chip>
                                                <vs-chip 
                                                    v-else
                                                    color="warning" 
                                                    size="small"
                                                    title="Libro extra - no aplica cantidad pedida"
                                                >
                                                    ➕ Extra
                                                </vs-chip>
                                            </vs-td>
                                            
                                            <!-- Ya Proformado -->
                                            <vs-td>
                                                <vx-tooltip 
                                                    v-if="!libro.esLibroExtra"
                                                    text="Cantidad ya incluida en OTRAS proformas (no incluye esta proforma)"
                                                >
                                                    <vs-chip 
                                                        :color="(libro.cantidadProformada || 0) > 0 ? 'success' : 'dark'" 
                                                        size="small"
                                                    >
                                                        {{ libro.cantidadProformada || 0 }}
                                                    </vs-chip>
                                                </vx-tooltip>
                                                <vs-chip 
                                                    v-else
                                                    color="dark" 
                                                    size="small"
                                                >
                                                    0
                                                </vs-chip>
                                            </vs-td>
                                            
                                            <!-- Disponible -->
                                            <vs-td>
                                                <template v-if="!libro.esLibroExtra">
                                                    <vx-tooltip :text="`Pedido: ${libro.cantidad || 0} - Ya Proformado: ${libro.cantidadProformada || 0} = Disponible: ${parseInt(libro.cantidad || 0) - parseInt(libro.cantidadProformada || 0)}`">
                                                        <vs-chip 
                                                            :color="((parseInt(libro.cantidad || 0) - parseInt(libro.cantidadProformada || 0)) > 0) ? 'primary' : 'danger'" 
                                                            size="small"
                                                            class="font-bold"
                                                        >
                                                            {{ parseInt(libro.cantidad || 0) - parseInt(libro.cantidadProformada || 0) }}
                                                        </vs-chip>
                                                    </vx-tooltip>
                                                </template>
                                                <template v-else>
                                                    <vs-chip 
                                                        color="warning" 
                                                        size="small"
                                                    >
                                                        ➕ Extra
                                                    </vs-chip>
                                                </template>
                                            </vs-td>
                                            
                                            <vs-td>
                                                <vs-input 
                                                    v-model="libro.cantidadProforma"
                                                    @input="validarCantidadListado(libro)"
                                                    type="number"
                                                    min="1"
                                                    :max="libro.esLibroExtra ? (libro.stock || 999) : Math.min(libro.stock || 999, (parseInt(libro.cantidad || 0) - parseInt(libro.cantidadProformada || 0)))"
                                                    style="width: 80px;"
                                                    :class="libro.errorStockMinimo ? 'input-error-stock' : ''"
                                                    :danger="!!libro.errorStockMinimo"
                                                />
                                                <small v-if="libro.errorStockMinimo" class="text-danger text-xs block mt-1">
                                                    {{ libro.errorStockMinimo }}
                                                </small>
                                            </vs-td>
                                            
                                            <vs-td>
                                                <vx-tooltip :text="obtenerTooltipStock(libro)">
                                                    <vs-chip 
                                                        :color="obtenerColorStock(libro)" 
                                                        class="text-center"
                                                    >
                                                        {{ libro.stock !== undefined ? libro.stock : 'Consultando...' }}
                                                    </vs-chip>
                                                </vx-tooltip>
                                            </vs-td>
                                            
                                            <!-- Diferencia de Stock -->
                                            <vs-td>
                                                <vx-tooltip :text="obtenerTooltipDiferenciaStock(libro)">
                                                    <vs-chip 
                                                        :color="obtenerColorDiferenciaStock(libro)" 
                                                        class="text-center font-bold"
                                                        size="small"
                                                    >
                                                        {{ obtenerDiferenciaStock(libro) }}
                                                    </vs-chip>
                                                </vx-tooltip>
                                            </vs-td>
                                            
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
                                            
                                            <!-- Columna de acción para libros extras -->
                                            <vs-td v-if="tieneLibrosExtras()">
                                                <vs-button 
                                                    v-if="libro.esLibroExtra"
                                                    @click="eliminarLibroExtra(libro, index)"
                                                    color="danger" 
                                                    size="small"
                                                    type="flat"
                                                    title="Eliminar libro extra"
                                                    icon="icon-trash-2"
                                                    icon-pack="feather"
                                                >
                                                </vs-button>
                                                <div v-else></div>
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                            </div>
                        </vs-tab>
                        
                        <!-- Tab 2: Captura Súper Rápida -->
                        <vs-tab label="Llenado Rápido" icon="flash_on" disabled>
                            <div class="captura-rapida-container">                          
                                
                                <!-- Tabla de captura rápida -->
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
                                                <feather-icon icon="SearchIcon" size="14" class="mr-1"></feather-icon>
                                                Buscar Libro
                                            </vs-th>
                                            <vs-th style="width: 90px;">
                                                <feather-icon icon="DollarSignIcon" size="14" class="mr-1"></feather-icon>
                                                Precio
                                            </vs-th>
                                            <vs-th style="width: 100px;">
                                                <feather-icon icon="PackageIcon" size="14" class="mr-1"></feather-icon>
                                                Cantidad
                                            </vs-th>
                                            <vs-th style="width: 80px;">
                                                <feather-icon icon="TrendingUpIcon" size="14" class="mr-1"></feather-icon>
                                                Stock
                                            </vs-th>
                                            <vs-th style="width: 100px;">
                                                <feather-icon icon="DollarSignIcon" size="14" class="mr-1"></feather-icon>
                                                Subtotal
                                            </vs-th>
                                            <vs-th style="width: 80px;">
                                                <feather-icon icon="TrashIcon" size="14" class="mr-1"></feather-icon>
                                                Acción
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
                                                            v-model="fila.textoBusqueda"
                                                            @input="buscarEnFila(fila, index)"
                                                            @keyup.enter="aceptarSugerencia(fila, index)"
                                                            @keyup.escape="limpiarBusqueda(fila)"
                                                            @focus="activarBusqueda(fila, index)"
                                                            style="width: 100%;"
                                                            :class="fila.libroSeleccionado ? 'libro-encontrado' : ''"
                                                            :placeholder="obtenerPlaceholder(fila)"
                                                            :readonly="fila.libroSeleccionado"
                                                        />
                                                        
                                                        <!-- Sugerencia inline -->
                                                        <div v-if="fila.sugerenciaActual && !fila.libroSeleccionado" 
                                                             class="sugerencia-inline">
                                                            <span v-if="fila.sugerenciaActual.pro_codigo.toLowerCase().includes(fila.textoBusqueda.toLowerCase())">
                                                                <feather-icon icon="HashIcon" size="12"></feather-icon>
                                                                Código: <strong>{{ fila.sugerenciaActual.pro_codigo }}</strong> | 
                                                                {{ fila.sugerenciaActual.nombre_libro }}
                                                            </span>
                                                            <span v-else>
                                                                <feather-icon icon="BookIcon" size="12"></feather-icon>
                                                                <strong>{{ fila.sugerenciaActual.nombre_libro }}</strong> 
                                                                ({{ fila.sugerenciaActual.pro_codigo }})
                                                            </span>
                                                            <br><small style="color: #5b3cc4;">
                                                                <feather-icon icon="CornerDownLeftIcon" size="10"></feather-icon>
                                                                Presiona Enter para seleccionar
                                                            </small>
                                                        </div>
                                                        
                                                        <!-- Libro seleccionado con código -->
                                                        <div v-if="fila.libroSeleccionado" style="margin-top: 5px; font-size: 11px; color: #48bb78;">
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
                                                        ${{ parseFloat(fila.libroSeleccionado.det_prof_valor_u || 0).toFixed(2) }}
                                                    </vs-chip>
                                                    <span v-else style="color: #ccc;">-</span>
                                                </vs-td>
                                                
                                                <!-- Input de cantidad -->
                                                <vs-td>
                                                    <vs-input 
                                                        v-model="fila.cantidad"
                                                        @input="validarYSincronizarCantidad(fila, index)"
                                                        @keyup.enter="avanzarAlSiguienteLibro(index)"
                                                        @blur="validarCantidadFinal(fila, index)"
                                                        type="number"
                                                        min="1"
                                                        :max="fila.libroSeleccionado ? fila.libroSeleccionado.stock : 999"
                                                        style="width: 80px;"
                                                        :disabled="!fila.libroSeleccionado"
                                                        :ref="`cantidad-${index}`"
                                                        :class="fila.errorCantidad ? 'cantidad-error' : ''"
                                                    />
                                                    <small v-if="fila.errorCantidad" class="text-danger text-xs block mt-1">
                                                        {{ fila.errorCantidad }}
                                                    </small>
                                                </vs-td>
                                                
                                                <!-- Stock disponible -->
                                                <vs-td>
                                                    <vx-tooltip v-if="fila.libroSeleccionado" :text="obtenerTooltipStock(fila.libroSeleccionado)">
                                                        <vs-chip 
                                                            :color="obtenerColorStock(fila.libroSeleccionado)" 
                                                            size="small"
                                                        >
                                                            {{ fila.libroSeleccionado.stock || 0 }}
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
                        </vs-tab>
                    </vs-tabs>
                    
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
                            <p class="text-gray-400 text-sm">Use cualquiera de las dos pestañas para especificar cantidades</p>
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
            title="⚠️ Productos Sin Stock Disponible"
            :active.sync="popupStockInsuficiente"
            class="popup-stock-insuficiente"
        >
            <div class="stock-insuficiente-container">
                <div class="alert-message">
                    <p class="text-danger font-semibold mb-3">
                        <i class="feather icon-alert-triangle mr-2"></i>
                        No se puede completar la operación porque algunos productos no tienen stock suficiente.
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
                                <th>Stock Actual</th>
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
                        Entendido - Actualizar Stock
                    </vs-button>
                </div>
            </div>
        </vs-popup-history>
    </vs-popup-history>
</template>

<style scoped>
/* Estilos para el popup de stock insuficiente */
.popup-stock-insuficiente .stock-insuficiente-container {
    padding: 20px;
}

.popup-stock-insuficiente .alert-message {
    background-color: #fff3cd;
    border-left: 4px solid #ff9f43;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
}

.popup-stock-insuficiente .productos-tabla-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.popup-stock-insuficiente .tabla-productos-invalidos {
    width: 100%;
    border-collapse: collapse;
}

.popup-stock-insuficiente .tabla-productos-invalidos thead {
    background-color: #f5f5f5;
    position: sticky;
    top: 0;
    z-index: 10;
}

.popup-stock-insuficiente .tabla-productos-invalidos th {
    padding: 12px 8px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #ddd;
    font-size: 13px;
}

.popup-stock-insuficiente .tabla-productos-invalidos td {
    padding: 10px 8px;
    border-bottom: 1px solid #eee;
    font-size: 13px;
}

.popup-stock-insuficiente .tabla-productos-invalidos tbody tr:hover {
    background-color: #f9f9f9;
}

.popup-stock-insuficiente .nombre-producto {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.popup-stock-insuficiente .acciones-popup {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
}
</style>

<script>
import vSelect from 'vue-select';

const BusquedaLugarDespacho = () => import('../Busquedas/BusquedaLugarDespacho.vue');
const BusquedaClientePerseo = () => import('../Busquedas/BusquedaClientePerseo.vue');
const ConfigProforma = () => import('./ConfigProforma.vue');

export default {
    name: 'ProformaEditarModal',
    components: {
        vSelect,
        BusquedaLugarDespacho,
        BusquedaClientePerseo,
        ConfigProforma
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
            filtrarSoloConCantidad: true, // Filtro para la tabla de libros
            
            // Control de stock insuficiente
            popupStockInsuficiente: false,
            productosStockInsuficiente: [],
            
            // Datos de la proforma
            proformaData: {
                id: null,
                prof_id: '', // Secuencial
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
            
            // Listas
            listaEmpresas: [],
            
            // Información de despacho y cliente
            lugarDespacho: {
                idInstitucion: null,
                nombreInstitucion: '',
                ruc: '',
                ciudad: '',
                datosInstitucion: []
            },
            
            // Nuevo lugar de despacho (si se cambia)
            nuevoLugarDespacho: null,
            mostrarBusquedaDespacho: false,
            
            clientePerseo: {
                id: null,
                nombre: '',
                cedula: '',
                email: ''
            },
            
            // Nuevo cliente (si se cambia)
            nuevoClientePerseo: null,
            mostrarBusquedaCliente: false,
            
            // Detalles de la proforma (libros)
            detallesProforma: [],
            
            // Para detectar cambios
            datosOriginales: null,
            
            // Control de cupo - indica si es la primera proforma del pedido
            esPrimeraProforma: false,
            
            // Panel de configuración
            mostrarConfigSidebar: false,
            configProforma: {
                permitirTodosLibros: false,
                permitirUsarStockMinimo: false
            },
            stockMinimo: 0, // Stock mínimo de seguridad
            ultimaNotificacionStockMinimo: 0, // Timestamp para evitar notificaciones duplicadas
            
            // Para agregar libros extras
            libroExtra: {
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                resultadosBusqueda: [],
                indiceSeleccionado: 0
            },
            todosLosLibrosDisponibles: [], // Almacenará TODOS los libros disponibles cuando se active la opción
            
            // Datos para captura rápida
            filasCaptura: [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: ''
                }
            ],
            
            // Formulario de edición de cupo
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
                console.log('✅ Modal de EDICIÓN abierto');
                console.log('   → Proforma ID:', this.proformaId);
                console.log('   → Pedido:', this.pedidoSeleccionado);
                console.log('   → Libros:', this.librosPedido.length);
                
                // Inicializar edición
                this.inicializarEdicion();
            } else if (!newVal) {
                // Limpiar al cerrar
                this.limpiarModal();
            }
        },
        popupEditar(newVal) {
            if (!newVal) {
                this.$emit('cerrar');
            }
            this.$emit('update:visible', newVal);
        },
        configProforma: {
            handler(newVal, oldVal) {
                console.log('🔍 Watcher configProforma ejecutado (EDITAR)');
                console.log('   OLD:', oldVal);
                console.log('   NEW:', newVal);
                
                // Detectar cambios específicos en las propiedades de stock mínimo
                if (oldVal && newVal.permitirUsarStockMinimo !== oldVal.permitirUsarStockMinimo) {
                    console.log('🔄 CAMBIÓ permitirUsarStockMinimo (EDITAR)');
                    console.log('   → De:', oldVal.permitirUsarStockMinimo, '→ A:', newVal.permitirUsarStockMinimo);
                    
                    // Pequeño delay para asegurar que el cambio se procesó
                    this.$nextTick(() => {
                        console.log('⚡ Ejecutando revalidarCantidadesConConfiguracion...');
                        this.revalidarCantidadesConConfiguracion();
                    });
                }
            },
            deep: true
        }
    },
    computed: {
        // Libros filtrados según el checkbox
        librosConStockFiltrados() {
            if (this.filtrarSoloConCantidad) {
                return this.librosPedido.filter(libro => 
                    libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
                );
            }
            return this.librosPedido;
        },
        
        // Detectar si cambió la empresa
        empresaCambiada() {
            if (!this.datosOriginales) return false;
            return this.proformaData.emp_id !== this.datosOriginales.proformaData.emp_id;
        },
        
        // Detectar si cambió el descuento
        descuentoCambiado() {
            if (!this.datosOriginales) return false;
            return parseFloat(this.proformaData.pro_des_por || 0) !== parseFloat(this.datosOriginales.proformaData.pro_des_por || 0);
        },
        
        // Detectar si cambió la observación
        observacionCambiada() {
            if (!this.datosOriginales) return false;
            const obsActual = (this.proformaData.prof_observacion || '').trim();
            const obsOriginal = (this.datosOriginales.proformaData.prof_observacion || '').trim();
            return obsActual !== obsOriginal;
        },
        
        // Obtener nombre de la empresa actual
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
        },
        
        // Detectar si hay modificaciones para habilitar/deshabilitar botón Guardar
        tieneModificaciones() {
            if (!this.datosOriginales) return false;
            
            // 1. Cambios en datos básicos
            const cambiosBasicos = 
                this.proformaData.emp_id !== this.datosOriginales.proformaData.emp_id ||
                this.proformaData.pro_des_por !== this.datosOriginales.proformaData.pro_des_por ||
                this.proformaData.prof_observacion !== this.datosOriginales.proformaData.prof_observacion;
            
            // 2. Cambios en despacho o cliente
            const cambioDespacho = this.nuevoLugarDespacho !== null;
            const cambioCliente = this.nuevoClientePerseo !== null;
            
            if (cambiosBasicos || cambioDespacho || cambioCliente) {
                return true;
            }
            
            // 3. Cambios en libros
            if (!this.datosOriginales.detallesProforma) return false;
            
            const librosActuales = this.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            // Diferente cantidad de libros
            if (librosActuales.length !== this.datosOriginales.detallesProforma.length) {
                return true;
            }
            
            // Verificar cambios en cantidades o libros nuevos
            for (let libroActual of librosActuales) {
                const codigo = libroActual.codigo_liquidacion || libroActual.pro_codigo;
                const cantidadActual = parseInt(libroActual.cantidadProforma);
                
                const detalleOriginal = this.datosOriginales.detallesProforma.find(d => 
                    d.pro_codigo === codigo
                );
                
                if (!detalleOriginal) {
                    return true; // Libro nuevo
                }
                
                const cantidadOriginal = parseInt(detalleOriginal.det_prof_cantidad);
                if (cantidadActual !== cantidadOriginal) {
                    return true; // Cantidad cambió
                }
            }
            
            // Verificar libros eliminados
            for (let detalleOriginal of this.datosOriginales.detallesProforma) {
                const libroActual = librosActuales.find(l => 
                    (l.codigo_liquidacion || l.pro_codigo) === detalleOriginal.pro_codigo
                );
                
                if (!libroActual) {
                    return true; // Libro eliminado
                }
            }
            
            return false;
        }
    },
    mounted() {
        // Consultar stock mínimo
        this.consultarStockMinimo();
    },
    methods: {
        // ====================================
        // MOSTRAR POPUP DE STOCK INSUFICIENTE
        // ====================================
        mostrarPopupStockInsuficiente(productosInvalidos) {
            this.productosStockInsuficiente = productosInvalidos;
            this.popupStockInsuficiente = true;
        },
        
        // ====================================
        // CERRAR POPUP Y RECONSULTAR STOCK
        // ====================================
        async cerrarPopupStockInsuficiente() {
            this.popupStockInsuficiente = false;
            this.productosStockInsuficiente = [];
            
            // Reconsultar stock actualizado
            this.$vs.loading({
                text: 'Actualizando stock...'
            });
            
            await this.consultarStockLibros();
            
            this.$vs.loading.close();
            
            this.$vs.notify({
                title: 'Stock Actualizado',
                text: 'El stock ha sido reconsultado. Por favor verifique las cantidades.',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-refresh-cw',
                position: 'top-center'
            });
        },
        
        // Helper para calcular cantidad disponible
        calcularDisponible(libro) {
            const cantidadPedida = parseInt(libro.cantidad || 0);
            const cantidadProformada = parseInt(libro.cantidadProformada || 0);
            return cantidadPedida - cantidadProformada;
        },
        
        // Revalidar cantidades cuando cambia la configuración de stock mínimo
        revalidarCantidadesConConfiguracion() {
            let cantidadesLimpiadas = 0;
            
            // 1. Revalidar libros en la tabla principal
            this.librosPedido.forEach(libro => {
                const cantidad = parseInt(libro.cantidadProforma) || 0;
                
                if (cantidad > 0) {
                    const stock = parseInt(libro.stock) || 0;
                    const stockRestante = stock - cantidad;
                    const esLibroExtra = libro.esLibroExtra === true;
                    const disponible = this.calcularDisponible(libro);
                    
                    let debeEliminar = false;
                    let motivo = '';
                    
                    // Validar cantidad disponible SOLO si NO es libro extra
                    if (!esLibroExtra && cantidad > disponible) {
                        debeEliminar = true;
                        motivo = `Supera disponible (${disponible})`;
                    }
                    // Validar stock disponible
                    else if (cantidad > stock) {
                        debeEliminar = true;
                        motivo = `Stock insuficiente (${stock})`;
                    }
                    // Validar stock mínimo SOLO si el permiso está DESACTIVADO
                    else if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                        debeEliminar = true;
                        motivo = `Protege stock mínimo (${this.stockMinimo})`;
                    }
                    
                    if (debeEliminar) {
                        console.log(`❌ ${libro.pro_codigo}: ${motivo} - Limpiando cantidad`);
                        libro.cantidadProforma = '';
                        cantidadesLimpiadas++;
                    }
                }
            });
            
            // 2. Revalidar y eliminar filas en el llenado rápido
            const filasAEliminar = [];
            
            this.filasCaptura.forEach((fila, index) => {
                if (fila.libroSeleccionado && fila.cantidad && fila.cantidad !== '') {
                    const cantidad = parseInt(fila.cantidad);
                    const cantidadPedida = parseInt(fila.libroSeleccionado.cantidad) || 0;
                    const esLibroExtra = fila.libroSeleccionado.esLibroExtra === true;
                    const stockDisponible = fila.libroSeleccionado.stock || 0;
                    const stockRestante = stockDisponible - cantidad;
                    
                    let debeEliminarFila = false;
                    
                    // Validar cantidad pedida SOLO si NO es libro extra
                    if (!esLibroExtra && cantidad > cantidadPedida) {
                        debeEliminarFila = true;
                    }
                    // Validar stock disponible
                    else if (cantidad > stockDisponible) {
                        debeEliminarFila = true;
                    }
                    // Validar stock mínimo SOLO si el permiso está DESACTIVADO
                    else if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                        debeEliminarFila = true;
                    }
                    
                    if (debeEliminarFila) {
                        console.log(`❌ Eliminando fila ${index} - ${fila.libroSeleccionado.pro_codigo}`);
                        filasAEliminar.push(index);
                        cantidadesLimpiadas++;
                    }
                }
            });
            
            // Eliminar filas marcadas (de atrás hacia adelante)
            for (let i = filasAEliminar.length - 1; i >= 0; i--) {
                const indexToRemove = filasAEliminar[i];
                if (indexToRemove === 0) {
                    // Si es la primera fila, solo limpiarla
                    this.filasCaptura[0] = {
                        textoBusqueda: '',
                        libroSeleccionado: null,
                        cantidad: '',
                        confirmado: false,
                        resultadosBusqueda: [],
                        sugerenciaActual: null,
                        errorCantidad: ''
                    };
                } else {
                    // Eliminar la fila
                    this.filasCaptura.splice(indexToRemove, 1);
                }
            }
            
            // Asegurar que siempre haya al menos una fila vacía
            if (this.filasCaptura.length === 0) {
                this.filasCaptura.push({
                    textoBusqueda: '',
                    libroSeleccionado: null,
                    cantidad: '',
                    confirmado: false,
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: ''
                });
            }
            
            // Recalcular totales
            this.calcularTotalesProforma();
            
            if (cantidadesLimpiadas > 0) {
                this.$vs.notify({
                    title: '🔒 Stock Mínimo Protegido',
                    text: `Se eliminaron ${cantidadesLimpiadas} item(s) que no cumplen con el stock mínimo`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-shield',
                    time: 4000
                });
            }
            
            console.log('✅ Revalidación completada -', cantidadesLimpiadas, 'items eliminados');
        },
        
        // Helper para obtener clase CSS según comparación cantidad pedido vs proforma
        getClaseCantidadComparacion(libro) {
            const cantDisponible = this.calcularDisponible(libro);
            const cantProforma = parseInt(libro.cantidadProforma || 0);
            
            if (cantProforma === 0) return '';
            if (cantProforma > cantDisponible) return 'cantidad-mayor'; // Más que lo disponible
            if (cantProforma < cantDisponible) return 'cantidad-menor'; // Menos que lo disponible
            return 'cantidad-igual'; // Igual a lo disponible
        },
        
        // Helper para obtener tooltip de comparación
        getTooltipComparacion(libro) {
            const cantDisponible = this.calcularDisponible(libro);
            const cantProforma = parseInt(libro.cantidadProforma || 0);
            
            if (cantProforma === 0) return 'Sin cantidad en proforma';
            if (cantProforma > cantDisponible) return `⚠️ Proforma tiene ${cantProforma - cantDisponible} más que lo disponible`;
            if (cantProforma < cantDisponible) return `⚠️ Proforma tiene ${cantDisponible - cantProforma} menos que lo disponible`;
            return '✓ Igual a lo disponible';
        },
        
        // Inicializar proceso de edición
        inicializarEdicion() {
            let me = this;
            // console.log('🔄 Inicializando edición de proforma...');
            
            // Cargar empresas primero
            me.getEmpresas();
            
            // Luego cargar datos de la proforma
            me.cargarDatosProforma();
        },
        
        // Cargar lista de empresas
        getEmpresas() {
            let me = this;
            me.listaEmpresas = [];
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data.filter(empresa => empresa.id !== 2);
                    console.log('✅ Empresas cargadas:', me.listaEmpresas.length);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error('❌ Error al cargar empresas:', err);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo cargar la lista de empresas',
                        color: 'warning'
                    });
                });
        },
        
        // Cargar datos de la proforma desde el backend
        cargarDatosProforma() {
            let me = this;
            
            // Validar que tenemos un ID válido
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
            
            console.log('📡 Solicitando datos de proforma ID:', me.proformaId);
            
            me.$http.get(`${me.$server_url}get_proforma_para_editar/${me.proformaId}`)
                .then(response => {
                    console.log('📦 Respuesta completa del servidor:', response);
                    console.log('📦 Status:', response.status);
                    console.log('📦 Data:', response.data);
                    
                    if (response.status === 200 && response.data) {
                        // El backend devuelve: { status: 200, data: { proforma: {...}, detalles: [...] } }
                        // Entonces accedemos a response.data.data
                        const backendData = response.data.data || response.data;
                        
                        // Verificar si la estructura es correcta
                        if (!backendData.proforma) {
                            console.error('❌ Estructura inválida - no existe proforma');
                            console.log('Estructura recibida:', Object.keys(backendData));
                            throw new Error('La respuesta no contiene el campo "proforma"');
                        }
                        
                        console.log('✅ Datos de proforma recibidos:', backendData);
                        
                        // Mapear datos de la proforma
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
                        
                        // 🔥 DETERMINAR si es la primera proforma del contrato
                        // Se basa en la cantidad de proformas que tiene el contrato
                        // Si solo hay 1 proforma, entonces ES la primera
                        let esPrimera = false;
                        
                        // Opción 1: Si el backend envía directamente si es primera
                        if (backendData.proforma.es_primera_proforma !== undefined) {
                            esPrimera = backendData.proforma.es_primera_proforma == 1 || backendData.proforma.es_primera_proforma === true;
                        }
                        // Opción 2: Si el backend envía el número de proforma en el contrato
                        else if (backendData.proforma.numero_proforma_contrato !== undefined) {
                            esPrimera = backendData.proforma.numero_proforma_contrato == 1;
                        }
                        // Opción 3: Basarse en la cantidad de proformas del contrato (desde el padre)
                        else if (me.cantidadProformasContrato !== undefined) {
                            esPrimera = me.cantidadProformasContrato === 1;
                        }
                        // Opción 4: Fallback - si termina en -1
                        else if (backendData.proforma.prof_id && backendData.proforma.prof_id.endsWith('-1')) {
                            esPrimera = true;
                        }
                        
                        me.esPrimeraProforma = esPrimera;
                        console.log('🏷️ Es primera proforma:', me.esPrimeraProforma);
                        console.log('   → Cantidad proformas contrato:', me.cantidadProformasContrato);
                        console.log('   → prof_id:', backendData.proforma.prof_id);
                        
                        // Mapear detalles de la proforma
                        me.detallesProforma = backendData.detalles || [];
                        console.log('📚 Detalles de proforma:', me.detallesProforma.length, 'libros');
                        
                        // 🔥 MAPEAR LAS CANTIDADES DE ESTA PROFORMA A librosPedido Y DETECTAR EXTRAS
                        me.detallesProforma.forEach(detalle => {
                            // Buscar el libro correspondiente en librosPedido por código
                            const libroEnPedido = me.librosPedido.find(libro => 
                                (libro.codigo_liquidacion || libro.pro_codigo) === detalle.pro_codigo
                            );
                            
                            if (libroEnPedido) {
                                // 🔥 IMPORTANTE: Buscar la cantidad total proformada del prop librosProformados
                                const libroProformado = me.librosProformados.find(lp => 
                                    lp.pro_codigo === detalle.pro_codigo
                                );
                                
                                const cantidadTotalProformada = libroProformado 
                                    ? parseInt(libroProformado.cantidad_proformada || 0) 
                                    : 0;
                                const cantidadEstaProforma = parseInt(detalle.det_prof_cantidad || 0);
                                const cantidadOtrasProformas = cantidadTotalProformada - cantidadEstaProforma;
                                
                                // Actualizar cantidadProformada para que refleje solo OTRAS proformas
                                me.$set(libroEnPedido, 'cantidadProformada', cantidadOtrasProformas);
                                
                                // Asignar la cantidad de ESTA proforma a cantidadProforma (input editable)
                                me.$set(libroEnPedido, 'cantidadProforma', cantidadEstaProforma.toString());
                                
                                // Marcar como NO extra (está en el pedido original)
                                me.$set(libroEnPedido, 'esLibroExtra', false);
                                
                                console.log(`✅ Libro ${detalle.pro_codigo}:`);
                                console.log(`   → Total proformado (de librosProformados): ${cantidadTotalProformada}`);
                                console.log(`   → Esta proforma: ${cantidadEstaProforma}`);
                                console.log(`   → Otras proformas: ${cantidadOtrasProformas}`);
                            } else {
                                // ⚠️ LIBRO EXTRA: No está en librosPedido, agregarlo manualmente
                                console.warn(`⚠️ Libro EXTRA detectado: ${detalle.pro_codigo} - ${detalle.pro_nombre}`);
                                
                                const libroExtra = {
                                    codigo_liquidacion: detalle.pro_codigo,
                                    pro_codigo: detalle.pro_codigo,
                                    nombrelibro: detalle.pro_nombre,
                                    nombre_libro: detalle.pro_nombre,
                                    precio: parseFloat(detalle.det_prof_valor_u || 0),
                                    pvp: parseFloat(detalle.det_prof_valor_u || 0),
                                    cantidadProforma: detalle.det_prof_cantidad.toString(),
                                    cantidadProformada: 0, // Los extras no tienen otras proformas
                                    cantidad: detalle.det_prof_cantidad,
                                    pro_reservar: detalle.stock_disponible || 0,
                                    esLibroExtra: true // ✅ MARCAR COMO EXTRA
                                };
                                
                                // Agregar a librosPedido para que aparezca en la tabla
                                me.librosPedido.push(libroExtra);
                                
                                console.log(`   ✅ Libro extra agregado a librosPedido:`, libroExtra);
                            }
                        });
                        
                        // 🔥 CONSULTAR STOCK DE TODOS LOS LIBROS DEL PEDIDO
                        me.consultarStockLibros();
                        
                        // Cargar información de empresa (ya viene en el backend)
                        console.log('🏢 Empresa:', backendData.proforma.empresa_nombre);
                        
                        // Cargar lugar de despacho (ya viene en el backend)
                        me.lugarDespacho = {
                            idInstitucion: backendData.proforma.despacho_id,
                            nombreInstitucion: backendData.proforma.despacho_nombre || 'No especificado',
                            ruc: backendData.proforma.despacho_ruc || 'N/A',
                            ciudad: backendData.proforma.despacho_ciudad || 'N/A',
                            datosInstitucion: []
                        };
                        console.log('✅ Lugar de despacho:', me.lugarDespacho.nombreInstitucion);
                        
                        // 🔥 ASIGNAR DATOS DE CUPO si existen
                        if (backendData.proforma.ffp_id) {
                            me.lugarDespacho.datosInstitucion = [{
                                ffp_id: backendData.proforma.ffp_id,
                                ffp_cupo: backendData.proforma.ffp_cupo,
                                ffp_credito: backendData.proforma.ffp_credito,
                                ffp_descuento: backendData.proforma.ffp_descuento,
                                if_distribuidor: backendData.proforma.if_distribuidor
                            }];
                            console.log('💰 Datos de cupo cargados:', {
                                cupo: backendData.proforma.ffp_cupo,
                                credito: backendData.proforma.ffp_credito,
                                descuento: backendData.proforma.ffp_descuento
                            });
                        } else {
                            console.log('⚠️ No hay datos de cupo configurados para este lugar de despacho');
                        }
                        
                        // Cargar cliente perseo (ya viene en el backend)
                        me.clientePerseo = {
                            id: backendData.proforma.cliente_idusuario,
                            nombre: backendData.proforma.cliente_nombre || 'No especificado',
                            cedula: backendData.proforma.cliente_cedula || '',
                            email: backendData.proforma.cliente_email || ''
                        };
                        console.log('✅ Cliente:', me.clientePerseo.nombre);
                        
                        // 🔥 CONSULTAR EL CUPO ACTUAL ACTUALIZADO (no usar datos viejos de la proforma)
                        // Esto asegura que siempre tengamos los datos más recientes del cupo
                        if (me.debeMostrarCupo() && me.lugarDespacho.idInstitucion) {
                            me.consultarCupoLugarDespacho().then(() => {
                                console.log('🔄 Cupo actualizado consultado desde BD');
                            });
                        }
                        
                        // Guardar datos originales para detectar cambios
                        me.datosOriginales = JSON.parse(JSON.stringify({
                            proformaData: me.proformaData,
                            lugarDespacho: me.lugarDespacho,
                            clientePerseo: me.clientePerseo,
                            detallesProforma: me.detallesProforma
                        }));
                        console.log('💾 Datos originales guardados para comparación');
                        
                        me.loadingDatos = false;
                    } else {
                        throw new Error('Respuesta inválida del servidor');
                    }
                })
                .catch(error => {
                    console.error('❌ Error al cargar datos de proforma:', error);
                    let errorMsg = 'Error desconocido';
                    
                    if (error.response) {
                        if (error.response.data && error.response.data.message) {
                            errorMsg = error.response.data.message;
                        } else {
                            errorMsg = 'Error del servidor: ' + error.response.status;
                        }
                    } else if (error.message) {
                        errorMsg = error.message;
                    }
                    
                    me.$vs.notify({
                        title: 'Error al cargar datos',
                        text: 'No se pudieron cargar los datos de la proforma. ' + errorMsg,
                        color: 'danger',
                        icon: 'error'
                    });
                    me.loadingDatos = false;
                });
        },
        
        // Normalizar descuento principal al perder el foco (05 -> 5)
        normalizarDescuentoPrincipal() {
            if (this.proformaData.pro_des_por !== '' && this.proformaData.pro_des_por !== null) {
                const valor = parseFloat(this.proformaData.pro_des_por);
                if (!isNaN(valor)) {
                    this.proformaData.pro_des_por = valor;
                }
            }
        },
        
        // Normalizar descuento de cupo al perder el foco (05 -> 5)
        normalizarDescuentoCupo() {
            if (this.formularioCupoData.ffp_descuento !== '' && this.formularioCupoData.ffp_descuento !== null) {
                const valor = parseFloat(this.formularioCupoData.ffp_descuento);
                if (!isNaN(valor)) {
                    this.formularioCupoData.ffp_descuento = valor.toString();
                }
            }
        },

         // Validar y corregir descuento principal (0-100)
        validarYCorregirDescuentoPrincipal(tipo) {
            if( tipo === 1){
                this.normalizarDescuentoPrincipal();
                if (this.proformaData.pro_des_por !== '' && this.proformaData.pro_des_por !== null) {
                    let valor = parseFloat(this.proformaData.pro_des_por);
                    
                    if (!isNaN(valor)) {
                        // Corregir si está fuera del rango
                        if (valor > 100) {
                            this.proformaData.pro_des_por = 100;
                        } else if (valor < 0) {
                            this.proformaData.pro_des_por = 0;
                        }
                    }
                }
                console.log('this.proformaData.pro_des_por',this.proformaData.pro_des_por)
            }else{
                this.normalizarDescuentoCupo();
                if (this.formularioCupoData.ffp_descuento !== '' && this.formularioCupoData.ffp_descuento !== null) {
                    const valor = parseFloat(this.formularioCupoData.ffp_descuento);
                    if (!isNaN(valor)) {
                        // Corregir si está fuera del rango
                        if (valor > 100) {
                            this.formularioCupoData.ffp_descuento = 100;
                        } else if (valor < 0) {
                            this.formularioCupoData.ffp_descuento = 0;
                        }
                    }
                }
                console.log('this.formularioCupoData.ffp_descuento',this.formularioCupoData.ffp_descuento)
            }
        },
        
        // Validar descuento principal - retorna true si es válido
        validarDescuentoPrincipal() {
            let descuento = parseFloat(this.proformaData.pro_des_por);
            
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                return false;
            }
            
            return true;
        },
        
        // Validar descuento de cupo - retorna true si es válido
        validarDescuentoCupo() {
            let descuento = parseFloat(this.formularioCupoData.ffp_descuento);
            
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                return false;
            }
            
            return true;
        },
        
        // Calcular totales cuando cambia el descuento
        calcularTotales() {
            let me = this;
            
            // Por ahora solo mostramos el cálculo básico
            // En el siguiente paso calcularemos con los libros
            const descuentoPorcentaje = parseFloat(me.proformaData.pro_des_por || 0);
            console.log('🧮 Descuento actualizado:', descuentoPorcentaje, '%');
        },
        
        // Cambiar lugar de despacho
        abrirBusquedaDespacho() {
            this.mostrarBusquedaDespacho = true;
            console.log('🔍 Abriendo búsqueda de lugar de despacho');
        },
        
        seleccionarNuevoDespacho(lugar) {
            let me = this;
            console.log('📍 Lugar recibido del componente:', lugar);
            
            // ✅ ALMACENAR TODO en nuevoLugarDespacho (incluyendo datos del cupo)
            // NO modificar lugarDespacho que es el ACTUAL
            me.nuevoLugarDespacho = {
                idInstitucion: lugar.id_institucion || lugar.idInstitucion,
                nombreInstitucion: lugar.nombreInstitucion,
                ruc: lugar.ruc || '',
                ciudad: lugar.ciudad || '',
                datosInstitucion: lugar.datosInstitucion || [] // ✅ Incluir datos del cupo
            };
            
            me.mostrarBusquedaDespacho = false;
            
            console.log('✅ Nuevo lugar de despacho seleccionado:', me.nuevoLugarDespacho);
            console.log('   → Nombre:', me.nuevoLugarDespacho.nombreInstitucion);
            console.log('   → RUC:', me.nuevoLugarDespacho.ruc);
            console.log('   → Ciudad:', me.nuevoLugarDespacho.ciudad);
            console.log('   → Datos Cupo:', me.nuevoLugarDespacho.datosInstitucion);
            
            // 🔥 VERIFICAR si necesita configurar cupo (solo primera proforma + venta por lista)
            if (me.debeMostrarCupo()) {
                if (!me.nuevoLugarDespacho.datosInstitucion || me.nuevoLugarDespacho.datosInstitucion.length === 0) {
                    // NO tiene cupo configurado - MOSTRAR formulario obligatorio
                    console.log('⚠️ Este lugar NO tiene cupo configurado - mostrando formulario');
                    me.$vs.notify({
                        title: '⚠️ Configuración Requerida',
                        text: 'Este lugar de despacho no tiene cupo configurado. Por favor configure el cupo para continuar.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 5000
                    });
                    // Abrir automáticamente el formulario
                    setTimeout(() => {
                        me.toggleFormularioCupo();
                    }, 300);
                } else {
                    // SÍ tiene cupo configurado
                    console.log('✅ Cupo configurado:', me.nuevoLugarDespacho.datosInstitucion[0]);
                }
            }
        },
        
        cerrarBusquedaDespacho() {
            // Solo cierra el modal sin resetear la selección
            this.mostrarBusquedaDespacho = false;
            console.log('🔒 Modal de búsqueda de despacho cerrado');
        },
        
        cancelarCambioDespacho() {
            // Este método se llama desde el botón X para cancelar el cambio
            this.nuevoLugarDespacho = null;
            console.log('❌ Cambio de lugar de despacho cancelado');
        },
        
        // Cambiar cliente Perseo
        abrirBusquedaCliente() {
            if (!this.proformaData.emp_id) {
                this.$vs.notify({
                    text: 'Debe seleccionar una empresa primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            this.mostrarBusquedaCliente = true;
            console.log('🔍 Abriendo búsqueda de cliente');
        },
        
        seleccionarNuevoCliente(cliente) {
            let me = this;
            // El componente BusquedaClientePerseo devuelve un objeto con esta estructura:
            // - idusuario: ID en tabla ven_cliente
            // - clientesidPerseo: ID en sistema Perseo
            me.nuevoClientePerseo = {
                idusuario: cliente.idusuario,                      // ID en ven_cliente
                clientesidPerseo: cliente.clientesidPerseo,        // ID en Perseo
                nombre: cliente.nombre,
                cedula: cliente.cedula,
                telefono: cliente.telefono || '',
                email: cliente.email || ''
            };
            me.mostrarBusquedaCliente = false;
            console.log('✅ Nuevo cliente | Nombre:', me.nuevoClientePerseo.nombre, '| ven_cliente:', me.nuevoClientePerseo.idusuario, '| clientesidPerseo:', me.nuevoClientePerseo.clientesidPerseo);
        },
        
        cerrarBusquedaCliente() {
            // Solo cierra el modal sin resetear la selección
            this.mostrarBusquedaCliente = false;
            console.log('🔒 Modal de búsqueda de cliente cerrado');
        },
        
        cancelarCambioCliente() {
            // Este método se llama desde el botón X para cancelar el cambio
            this.nuevoClientePerseo = null;
            console.log('❌ Cambio de cliente cancelado');
        },
        
        // Detectar si hay cambios
        hayModificaciones() {
            let me = this;
            
            if (!me.datosOriginales) return false;
            
            // Comparar datos básicos de proforma
            const cambiosProforma = 
                me.proformaData.emp_id !== me.datosOriginales.proformaData.emp_id ||
                me.proformaData.pro_des_por !== me.datosOriginales.proformaData.pro_des_por ||
                me.proformaData.prof_observacion !== me.datosOriginales.proformaData.prof_observacion;
            
            // Verificar si hay nuevo lugar de despacho
            const cambioDespacho = me.nuevoLugarDespacho !== null;
            
            // Verificar si hay nuevo cliente
            const cambioCliente = me.nuevoClientePerseo !== null;
            
            return cambiosProforma || cambioDespacho || cambioCliente;
        },
        
        // Detectar si hay modificaciones en los libros/cantidades
        hayModificacionesEnLibros() {
            let me = this;
            
            if (!me.datosOriginales || !me.datosOriginales.detallesProforma) return false;
            
            // Obtener libros actuales con cantidad
            const librosActuales = me.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            // Comparar cantidad de libros
            if (librosActuales.length !== me.datosOriginales.detallesProforma.length) {
                console.log('📝 Cambio detectado: diferente cantidad de libros');
                return true;
            }
            
            // Comparar cada libro
            for (let libroActual of librosActuales) {
                const codigo = libroActual.codigo_liquidacion || libroActual.pro_codigo;
                const cantidadActual = parseInt(libroActual.cantidadProforma);
                
                // Buscar en detalles originales
                const detalleOriginal = me.datosOriginales.detallesProforma.find(d => 
                    d.pro_codigo === codigo
                );
                
                if (!detalleOriginal) {
                    // Es un libro nuevo
                    console.log('📝 Cambio detectado: libro nuevo -', codigo);
                    return true;
                }
                
                const cantidadOriginal = parseInt(detalleOriginal.det_prof_cantidad);
                
                if (cantidadActual !== cantidadOriginal) {
                    console.log('📝 Cambio detectado en cantidad:', codigo, 'Original:', cantidadOriginal, '→ Actual:', cantidadActual);
                    return true;
                }
            }
            
            // Verificar si se eliminaron libros
            for (let detalleOriginal of me.datosOriginales.detallesProforma) {
                const libroActual = librosActuales.find(l => 
                    (l.codigo_liquidacion || l.pro_codigo) === detalleOriginal.pro_codigo
                );
                
                if (!libroActual) {
                    console.log('📝 Cambio detectado: libro eliminado -', detalleOriginal.pro_codigo);
                    return true;
                }
            }
            
            return false;
        },
        
        // Obtener solo los campos modificados
        obtenerCambios() {
            let me = this;
            let cambios = {
                proforma_id: me.proformaData.id,
                prof_id: me.proformaData.prof_id // Para validación
            };
            
            // Solo incluir campos que cambiaron
            if (me.proformaData.emp_id !== me.datosOriginales.proformaData.emp_id) {
                cambios.emp_id = me.proformaData.emp_id;
            }
            
            if (me.proformaData.pro_des_por !== me.datosOriginales.proformaData.pro_des_por) {
                cambios.pro_des_por = me.proformaData.pro_des_por;
            }
            
            if (me.proformaData.prof_observacion !== me.datosOriginales.proformaData.prof_observacion) {
                cambios.prof_observacion = me.proformaData.prof_observacion;
            }
            
            // Si hay nuevo lugar de despacho
            if (me.nuevoLugarDespacho) {
                cambios.id_ins_depacho = me.nuevoLugarDespacho.idInstitucion;
            }
            
            // Si hay nuevo cliente
            if (me.nuevoClientePerseo) {
                cambios.ven_cliente = me.nuevoClientePerseo.id;
                cambios.ruc_cliente = me.nuevoClientePerseo.cedula;
                cambios.clientesidPerseo = me.nuevoClientePerseo.id; // Puede ser diferente si usas Perseo
            }
            
            // TODO: Agregar cambios de libros cuando se implementen
            
            return cambios;
        },
        
        // Obtener color del estado
        getEstadoColor(estado) {
            const colores = {
                1: 'warning',  // Pendiente
                2: 'success',  // Aprobado
                3: 'danger'    // Rechazado
            };
            return colores[estado] || 'primary';
        },
        
        // Obtener texto del estado
        getEstadoTexto(estado) {
            const textos = {
                1: 'Pendiente',
                2: 'Aprobado',
                3: 'Rechazado'
            };
            return textos[estado] || 'Desconocido';
        },
        
        // Método que intenta guardar y muestra mensajes de error si falta algo
        intentarGuardarCambios() {
            let me = this;
            let erroresFaltantes = [];
            
            // 1. Validar si hay cambios
            const hayCambiosBasicos = me.hayModificaciones();
            const hayCambiosEnLibros = me.hayModificacionesEnLibros();
            
            if (!hayCambiosBasicos && !hayCambiosEnLibros) {
                erroresFaltantes.push('• <b>No se han realizado modificaciones</b> en la proforma');
            }
            
            // 2. Validar que tenga al menos un libro con cantidad
            const librosConCantidad = me.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            if (librosConCantidad.length === 0) {
                erroresFaltantes.push('• Debe tener al menos <b>un libro con cantidad mayor a 0</b>');
            }
            
            // 2.5. Validar descuento
            const descuento = parseFloat(me.proformaData.pro_des_por);
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                erroresFaltantes.push('• El <b>Descuento</b> debe ser un valor mayor a 0 y no mayor a 100');
            }
            
            // 3. Validar errores de stock
            const librosConError = me.librosPedido.filter(libro => 
                libro.errorStockMinimo && libro.errorStockMinimo !== ''
            );
            
            if (librosConError.length > 0) {
                erroresFaltantes.push(`• Hay <b>${librosConError.length} libro(s) con errores</b> de validación de stock`);
            }
            
            // 4. Para venta por lista, validar cupo
            if (me.esVentaPorLista() && hayCambiosEnLibros) {
                if (!me.validarCupoParaVentaPorLista()) {
                    const lugarDespacho = me.lugarDespacho;
                    const cupoInicial = (lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0) ? parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0 : 0;
                    const totalProforma = me.calcularTotalesUnificados().total || 0;
                    erroresFaltantes.push(`• El <b>total ($${totalProforma.toFixed(2)}) supera el cupo disponible</b> ($${cupoInicial.toFixed(2)})`);
                }
            }
            
            // Si hay errores, mostrarlos
            if (erroresFaltantes.length > 0) {
                me.$vs.notify({
                    title: '⚠️ No se puede guardar',
                    text: '<div style="text-align: left; padding: 10px;"><p style="margin-bottom: 10px; font-weight: 600;">Corrija lo siguiente:</p>' + erroresFaltantes.join('<br>') + '</div>',
                    color: 'warning',
                    position: 'top-center',
                    time: 8000,
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            // Si todo está OK, proceder a guardar
            me.guardarCambios();
        },
        
        guardarCambios() {
            let me = this;
            
            // console.log('🔍 Validando cambios antes de guardar...');
            
            // ====================================
            // 1. VALIDAR SI HAY CAMBIOS
            // ====================================
            const hayCambiosBasicos = me.hayModificaciones();
            const hayCambiosEnLibros = me.hayModificacionesEnLibros();
            
            if (!hayCambiosBasicos && !hayCambiosEnLibros) {
                me.$vs.notify({
                    title: 'Sin cambios',
                    text: 'No se han realizado modificaciones en la proforma',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-info'
                });
                // console.log('⚠️ No hay cambios para guardar');
                return;
            }
            
            // console.log('✅ Se detectaron cambios:');
            // console.log('   → Datos básicos:', hayCambiosBasicos);
            // console.log('   → Libros/cantidades:', hayCambiosEnLibros);
            
            // ====================================
            // 2. VALIDAR ERRORES DE STOCK
            // ====================================
            const librosConError = me.librosPedido.filter(libro => 
                libro.errorStockMinimo && libro.errorStockMinimo !== ''
            );
            
            if (librosConError.length > 0) {
                me.$vs.notify({
                    title: '❌ Hay errores en las cantidades',
                    text: `${librosConError.length} libro(s) tienen errores de validación. Por favor corríjalos antes de guardar.`,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 5000
                });
                // console.log('❌ Libros con error:', librosConError.map(l => l.pro_codigo));
                return;
            }
            
            // ====================================
            // 3. VALIDAR QUE HAY AL MENOS UN LIBRO CON CANTIDAD
            // ====================================
            const librosConCantidad = me.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            if (librosConCantidad.length === 0) {
                me.$vs.notify({
                    title: 'Sin libros seleccionados',
                    text: 'Debe seleccionar al menos un libro con cantidad mayor a 0',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            // console.log('💾 Guardando cambios de proforma...');
            // console.log('📚 Libros con cantidad:', librosConCantidad.length);
            
            // ====================================
            // 4. VALIDAR CUPO PARA VENTA POR LISTA
            // ====================================
            if (me.esVentaPorLista()) {
                // console.log('💰 Validando cupo para venta por lista...');
                
                if (!me.validarCupoParaVentaPorLista()) {
                    const lugarDespacho = me.lugarDespacho;
                    const cupoInicial = (lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0) ? parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0 : 0;
                    const totalProforma = me.calcularTotalesUnificados().total || 0;
                    
                    me.$vs.notify({
                        title: '❌ Cupo Insuficiente',
                        text: `El total de la proforma ($${totalProforma.toFixed(2)}) supera el cupo disponible ($${cupoInicial.toFixed(2)}). No se puede guardar.`,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time: 6000,
                        position: 'top-center'
                    });
                    // console.log('❌ Validación de cupo fallida');
                    return;
                }
                
                // console.log('✅ Validación de cupo exitosa');
            }
            
            // ====================================
            // 5. PREPARAR DATOS PARA ENVIAR
            // ====================================
            const formData = new FormData();
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            
            // Datos de la proforma (ID requerido)
            formData.append('proforma_id', me.proformaData.id);
            formData.append('prof_id', me.proformaData.prof_id); // Secuencial (para referencia)
            
            // Datos del pedido
            formData.append('pedido_id', me.proformaData.pedido_id);
            formData.append('contrato', me.proformaData.contrato);
            formData.append('usu_codigo', me.proformaData.usu_codigo);
            
            // Datos editables de la proforma
            formData.append('prof_observacion', me.proformaData.prof_observacion || '');
            formData.append('prof_observacion_libreria', '');
            formData.append('emp_id', me.proformaData.emp_id);
            formData.append('pro_des_por', parseFloat(me.proformaData.pro_des_por || 0));
            
            // Cliente y despacho (usar nuevos si existen, sino los originales)
            const idDespacho = me.nuevoLugarDespacho 
                ? me.nuevoLugarDespacho.idInstitucion 
                : me.proformaData.id_ins_depacho;
            
            // ✅ CORREGIDO: Usar campos correctos del cliente
            const idCliente = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.idusuario           // ID en ven_cliente
                : me.proformaData.ven_cliente;
            const clientePerseoId = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.clientesidPerseo    // ID en Perseo
                : me.proformaData.clientesidPerseo;
            const rucCliente = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.cedula 
                : me.proformaData.ruc_cliente;
            
            formData.append('id_ins_depacho', idDespacho);
            formData.append('ven_cliente', idCliente);
            formData.append('clientesidPerseo', clientePerseoId);
            formData.append('ruc_cliente', rucCliente);
            
            // Calcular totales actualizados
            const totales = me.calcularTotalesUnificados();
            formData.append('prof_com', 0);
            formData.append('prof_descuento', parseFloat(totales.descuentoMonto));
            formData.append('prof_iva', parseFloat(totales.iva));
            formData.append('prof_iva_por', 0);
            formData.append('prof_total', parseFloat(totales.total));
            formData.append('prof_estado', me.proformaData.prof_estado);
            
            // ====================================
            // 5. PREPARAR DETALLES DE LIBROS
            // ====================================
            const librosParaEnviar = librosConCantidad.map(libro => ({
                pro_codigo: libro.codigo_liquidacion || libro.pro_codigo,
                det_prof_cantidad: parseInt(libro.cantidadProforma),
                det_prof_valor_u: parseFloat(libro.precio || libro.pvp || libro.det_prof_valor_u || 0),
                nombre_libro: libro.nombre_libro,
                esLibroExtra: libro.esLibroExtra || false
            }));
            
            formData.append('data_detalle', JSON.stringify(librosParaEnviar));
            
            // ====================================
            // 6. LOG COMPLETO EN ARRAY PARA DEBUGGING
            // ====================================
            
            // 🔥 ARRAY DE DATOS DE LA PROFORMA MODIFICADOS
            const datosProformaModificados = {
                proforma_id: me.proformaData.id,
                prof_id: me.proformaData.prof_id,
                pedido_id: me.proformaData.pedido_id,
                contrato: me.proformaData.contrato,
                usu_codigo: me.proformaData.usu_codigo,
                prof_observacion: me.proformaData.prof_observacion || '',
                prof_observacion_libreria: '',
                emp_id: me.proformaData.emp_id,
                pro_des_por: parseFloat(me.proformaData.pro_des_por || 0),
                id_ins_depacho: idDespacho,
                ven_cliente: idCliente,
                clientesidPerseo: clientePerseoId,
                ruc_cliente: rucCliente,
                prof_com: 0,
                prof_descuento: parseFloat(totales.descuentoMonto),
                prof_iva: parseFloat(totales.iva),
                prof_iva_por: 0,
                prof_total: parseFloat(totales.total),
                prof_estado: me.proformaData.prof_estado
            };
            
            // console.log('═══════════════════════════════════════════════════════');
            // console.log('📋 ARRAY DE DATOS DE PROFORMA A ENVIAR AL BACKEND');
            // console.log('═══════════════════════════════════════════════════════');
            // console.log(datosProformaModificados);
            // console.log('');
            // console.log('📚 ARRAY DE DETALLES DE LIBROS A ENVIAR AL BACKEND');
            // console.log('═══════════════════════════════════════════════════════');
            // console.log(librosParaEnviar);
            // console.log('');
            // console.log('💰 RESUMEN TOTALES:');
            // console.log({
            //     subtotal: totales.subtotal,
            //     descuentoPorcentaje: parseFloat(me.proformaData.pro_des_por || 0),
            //     descuentoMonto: totales.descuentoMonto,
            //     subtotalConDescuento: totales.subtotalConDescuento,
            //     iva: totales.iva,
            //     total: totales.total,
            //     cantidadLibros: totales.cantidadLibros
            // });
            // console.log('');
            console.log('🔄 CAMBIOS DETECTADOS:');
            console.log({
                nuevoLugarDespacho: me.nuevoLugarDespacho ? {
                    idInstitucion: me.nuevoLugarDespacho.idInstitucion,
                    nombreInstitucion: me.nuevoLugarDespacho.nombreInstitucion,
                    ciudad: me.nuevoLugarDespacho.ciudad
                } : null,
                nuevoClientePerseo: me.nuevoClientePerseo ? {
                    idusuario: me.nuevoClientePerseo.idusuario,              // ID ven_cliente
                    clientesidPerseo: me.nuevoClientePerseo.clientesidPerseo, // ID Perseo
                    nombre: me.nuevoClientePerseo.nombre,
                    cedula: me.nuevoClientePerseo.cedula
                } : null,
                // VALORES FINALES A ENVIAR:
                ven_cliente: idCliente,
                clientesidPerseo: clientePerseoId,
                ruc_cliente: rucCliente
            });
            // console.log('═══════════════════════════════════════════════════════');
            
            // ====================================
            // 7. ENVIAR AL BACKEND
            // ====================================
            me.$vs.loading();
            
            me.$http.post(`${me.$server_url}Proforma_Actualizar_Desde_Modal`, formData)
                .then(response => {
                    me.$vs.loading.close();
                    
                    if (response.status === 200) {
                        console.log('✅ Proforma actualizada correctamente');
                        console.log('📋 Respuesta del servidor:', response.data);
                        
                        me.$vs.notify({
                            title: 'Éxito',
                            text: response.data.message || 'Proforma actualizada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            time: 4000
                        });
                        
                        // Emitir evento al padre para que refresque la lista
                        me.$emit('actualizar-proforma', response.data);
                        
                        // Cerrar modal (los datos frescos se cargarán la próxima vez que se abra)
                        me.cerrarModal();
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.error('❌ Error al actualizar proforma:', error);
                    
                    // Verificar si es error de stock insuficiente
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
                            text: 'No se pudo actualizar la proforma. ' + errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x-circle',
                            time: 5000
                        });
                    }
                });
        },
        
        // ====================================
        // MÉTODO PARA LIMPIAR EL MODAL
        // ====================================
        limpiarModal() {
            let me = this;
            console.log('🧹 Limpiando modal de edición...');
            
            // Restablecer datos de proforma
            me.proformaData = {
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
            
            // Limpiar lugar de despacho
            me.lugarDespacho = {
                idInstitucion: null,
                nombreInstitucion: '',
                ruc: '',
                ciudad: '',
                datosInstitucion: []
            };
            
            // Limpiar cliente Perseo
            me.clientePerseo = {
                id: null,
                nombre: '',
                cedula: '',
                email: ''
            };
            
            // Limpiar cambios pendientes
            me.nuevoLugarDespacho = null;
            me.nuevoClientePerseo = null;
            
            // Limpiar detalles de proforma
            me.detallesProforma = [];
            
            // Limpiar datos originales
            me.datosOriginales = null;
            
            // Limpiar cantidades en librosPedido prop (resetear a estado inicial)
            if (me.librosPedido && me.librosPedido.length > 0) {
                me.librosPedido.forEach(libro => {
                    me.$set(libro, 'cantidadProforma', '');
                    me.$set(libro, 'stock', undefined);
                    // 🔥 Limpiar errores de validación de stock mínimo
                    if (libro.errorStockMinimo !== undefined) {
                        me.$set(libro, 'errorStockMinimo', '');
                    }
                    // No tocamos cantidadProformada porque viene del prop original
                });
            }
            
            // 🔥 Forzar actualización del DOM para remover clases de error
            me.$nextTick(() => {
                console.log('✅ DOM actualizado - errores removidos');
            });
            
            // Limpiar búsqueda de libro extra
            me.limpiarBusquedaLibroExtra();
            
            // Limpiar filas de captura rápida Y sus errores
            me.filasCaptura = [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: ''
                }
            ];
            
            // Limpiar libros extras cargados
            me.todosLosLibrosDisponibles = [];
            
            // Resetear configuración
            me.configProforma = {
                permitirTodosLibros: false,
                permitirUsarStockMinimo: false
            };
            
            // 🔥 Resetear timestamp de notificaciones para permitir nuevas notificaciones
            me.ultimaNotificacionStockMinimo = 0;
            
            // Resetear estados de carga
            me.loadingDatos = false;
            me.loadingStock = false;
            me.filtrarSoloConCantidad = true;
            
            // Cerrar modales de búsqueda si están abiertos
            me.mostrarBusquedaDespacho = false;
            me.mostrarBusquedaCliente = false;
            me.mostrarConfigSidebar = false;
            
            console.log('✅ Modal limpiado correctamente (incluyendo errores y validaciones)');
        },
        
        // ====================================
        // MÉTODO PARA CERRAR EL MODAL
        // ====================================
        cerrarModal() {
            this.popupEditar = false;
            // La limpieza se ejecutará automáticamente en el watcher de visible
        },
        
        // ====================================
        // CONSULTAR STOCK MÍNIMO
        // ====================================
        async consultarStockMinimo() {
            try {
                const response = await this.$http.get(`${this.$server_url}Get_MinStock?nombre=1`);
                this.stockMinimo = parseInt(response.data) || 0;
                console.log('Stock mínimo configurado:', this.stockMinimo);
            } catch (error) {
                console.error('Error al consultar stock mínimo:', error);
                this.stockMinimo = 300;
            }
        },
        
        // ====================================
        // MÉTODO HELPER PARA NOTIFICACIONES
        // ====================================
        mostrarNotificacionStockMinimo(titulo, texto, color) {
            const ahora = Date.now();
            if (ahora - this.ultimaNotificacionStockMinimo > 500) {
                this.ultimaNotificacionStockMinimo = ahora;
                this.$vs.notify({
                    title: titulo,
                    text: texto,
                    color: color,
                    iconPack: 'feather',
                    icon: color === 'danger' ? 'icon-shield-off' : 'icon-alert-triangle',
                    time: color === 'danger' ? 6000 : 4000,
                    position: 'top-center'
                });
            }
        },
        
        // ====================================
        // REVALIDAR TODAS LAS CANTIDADES
        // ====================================
        // ====================================
        // MÉTODOS PARA PANEL DE CONFIGURACIÓN
        // ====================================
        handleConfigUpdate({ campo, valor }) {
            this.configProforma[campo] = valor;
            
            if (campo === 'permitirTodosLibros') {
                this.onCambiarPermitirTodosLibros(valor);
            } else if (campo === 'permitirUsarStockMinimo') {
                console.log('🔄 Stock mínimo cambiado a:', valor);
                
                // Notificar al usuario
                this.$vs.notify({
                    title: valor ? '✅ Stock Mínimo Activado' : '❌ Stock Mínimo Desactivado',
                    text: valor 
                        ? `Se validará que el stock no baje de ${this.stockMinimo} unidades`
                        : 'Ya no se validará el stock mínimo',
                    color: valor ? 'success' : 'primary',
                    iconPack: 'feather',
                    icon: valor ? 'icon-shield' : 'icon-shield-off',
                    position: 'top-center',
                    time: 4000
                });
                
                // 🔥 REVALIDAR TODOS LOS LIBROS CON LA NUEVA CONFIGURACIÓN
                this.$nextTick(() => {
                    this.validarTodosLosLibros();
                });
            }
        },
        
        async onCambiarPermitirTodosLibros(valor) {
            if (valor) {
                await this.cargarTodosLosLibros();
                this.$vs.notify({
                    text: 'Ahora puede agregar libros extras que no están en el pedido',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            } else {
                this.todosLosLibrosDisponibles = [];
                this.limpiarBusquedaLibroExtra();
                this.$vs.notify({
                    text: 'Solo puede seleccionar libros del pedido',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-info'
                });
            }
        },
        
        async cargarTodosLosLibros() {
            if (!this.proformaData.emp_id) {
                this.$vs.notify({
                    text: 'Debe seleccionar una empresa primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                this.configProforma.permitirTodosLibros = false;
                return;
            }
            
            try {
                this.$vs.loading();
                
                const idPeriodo = this.pedidoSeleccionado ? this.pedidoSeleccionado.id_periodo : null;
                
                if (!idPeriodo) {
                    throw new Error('No se pudo obtener el período del pedido');
                }
                
                const response = await this.$http.get(
                    `${this.$server_url}get_val_pedidoLibrosObsequiosInfoTodoSinPedido_new?periodo=${idPeriodo}`
                );
                
                if (response.data && Array.isArray(response.data)) {
                    const librosConDatos = response.data.map(libro => ({
                        ...libro,
                        nombre_libro: libro.nombrelibro || libro.nombre_libro,
                        pro_codigo: libro.codigo_liquidacion || libro.pro_codigo,
                        det_prof_valor_u: parseFloat(libro.precio || libro.pvp || 0),
                        stock: undefined
                    }));
                    
                    const codigosLibros = librosConDatos.map(l => l.pro_codigo);
                    
                    try {
                        const stockResponse = await this.$http.get(`${this.$server_url}consultar-stock-libros`, {
                            params: { codigos: codigosLibros }
                        });
                        
                        const stockData = stockResponse.data.status === 'success' && stockResponse.data.data 
                            ? stockResponse.data.data 
                            : stockResponse.data;
                        
                        this.todosLosLibrosDisponibles = librosConDatos.map(libro => {
                            const stockInfo = Array.isArray(stockData) 
                                ? stockData.find(item => item.pro_codigo === libro.pro_codigo)
                                : null;
                            
                            return {
                                ...libro,
                                stock: stockInfo && stockInfo.pro_reservar !== undefined ? stockInfo.pro_reservar : 0
                            };
                        });
                        
                        console.log('Libros cargados con stock:', this.todosLosLibrosDisponibles.length);
                    } catch (stockError) {
                        console.error('Error al consultar stock:', stockError);
                        this.todosLosLibrosDisponibles = librosConDatos.map(l => ({ ...l, stock: 0 }));
                    }
                } else {
                    throw new Error('No se recibieron datos válidos');
                }
                
                this.$vs.loading.close();
            } catch (error) {
                console.error('Error al cargar todos los libros:', error);
                this.$vs.loading.close();
                this.$vs.notify({
                    text: 'Error al cargar los libros disponibles: ' + error.message,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
                this.configProforma.permitirTodosLibros = false;
            }
        },
        
        // ====================================
        // MÉTODOS PARA AGREGAR LIBROS EXTRAS
        // ====================================
        manejarTecladoLibroExtra(event) {
            if (this.libroExtra.resultadosBusqueda.length > 0) {
                if (event.keyCode === 40 || event.key === 'ArrowDown') {
                    event.preventDefault();
                    this.libroExtra.indiceSeleccionado = 
                        (this.libroExtra.indiceSeleccionado + 1) % this.libroExtra.resultadosBusqueda.length;
                }
                else if (event.keyCode === 38 || event.key === 'ArrowUp') {
                    event.preventDefault();
                    this.libroExtra.indiceSeleccionado = 
                        this.libroExtra.indiceSeleccionado === 0 
                            ? this.libroExtra.resultadosBusqueda.length - 1 
                            : this.libroExtra.indiceSeleccionado - 1;
                }
                else if (event.keyCode === 13 || event.key === 'Enter') {
                    event.preventDefault();
                    const libroSeleccionado = this.libroExtra.resultadosBusqueda[this.libroExtra.indiceSeleccionado];
                    this.seleccionarLibroExtra(libroSeleccionado);
                }
                else if (event.keyCode === 27 || event.key === 'Escape') {
                    event.preventDefault();
                    this.limpiarBusquedaLibroExtra();
                }
            }
            else if (event.keyCode === 13 || event.key === 'Enter') {
                if (this.libroExtra.libroSeleccionado && this.libroExtra.cantidad) {
                    event.preventDefault();
                    this.agregarLibroExtra();
                }
            }
            else if (event.keyCode === 27 || event.key === 'Escape') {
                event.preventDefault();
                this.limpiarBusquedaLibroExtra();
            }
        },
        
        buscarLibroExtra() {
            const texto = this.libroExtra.textoBusqueda.toLowerCase().trim();
            
            if (texto.length < 2) {
                this.libroExtra.resultadosBusqueda = [];
                return;
            }
            
            if (this.libroExtra.libroSeleccionado && 
                this.libroExtra.libroSeleccionado.nombre_libro.toLowerCase() === texto) {
                this.libroExtra.resultadosBusqueda = [];
                return;
            }
            
            if (this.libroExtra.libroSeleccionado && 
                this.libroExtra.libroSeleccionado.nombre_libro.toLowerCase() !== texto) {
                this.libroExtra.libroSeleccionado = null;
                this.libroExtra.cantidad = '';
            }
            
            const codigosEnPedido = this.detallesProforma.map(l => l.pro_codigo);
            
            const palabrasBusqueda = texto.split(/\s+/).filter(p => p.length > 0);
            
            const librosYaEnListado = this.todosLosLibrosDisponibles.filter(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                const estaEnPedido = codigosEnPedido.includes(libro.pro_codigo);
                
                if (!estaEnPedido) return false;
                
                const coincideCodigo = codigo.includes(texto);
                
                const todasLasPalabrasEnNombre = palabrasBusqueda.every(palabra => 
                    nombreCompleto.includes(palabra)
                );
                
                return todasLasPalabrasEnNombre || coincideCodigo;
            });
            
            if (librosYaEnListado.length > 0) {
                const nombresLibros = librosYaEnListado.map(l => `"${l.pro_codigo}"`).join(', ');
                this.$vs.notify({
                    title: '⚠️ Libro(s) ya en el listado',
                    text: `${nombresLibros} ya consta(n) en el pedido. No puede agregarlo(s) como extra.`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-info',
                    time: 4000,
                    position: 'top-center'
                });
                this.libroExtra.resultadosBusqueda = [];
                return;
            }
            
            this.libroExtra.resultadosBusqueda = this.todosLosLibrosDisponibles.filter(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                const noEstaEnPedido = !codigosEnPedido.includes(libro.pro_codigo);
                
                const coincideCodigo = codigo.includes(texto);
                
                const todasLasPalabrasEnNombre = palabrasBusqueda.every(palabra => 
                    nombreCompleto.includes(palabra)
                );
                
                return (todasLasPalabrasEnNombre || coincideCodigo) && noEstaEnPedido;
            })
            .map(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                let puntuacion = 0;
                
                if (codigo === texto) puntuacion += 1000;
                else if (codigo.startsWith(texto)) puntuacion += 500;
                else if (codigo.includes(texto)) puntuacion += 100;
                
                if (nombreCompleto.startsWith(texto)) puntuacion += 300;
                else if (nombreCompleto.includes(texto)) puntuacion += 150;
                
                return { ...libro, puntuacion };
            })
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, 5);
            
            this.libroExtra.indiceSeleccionado = 0;
        },
        
        seleccionarLibroExtra(libro) {
            this.libroExtra.libroSeleccionado = libro;
            this.libroExtra.textoBusqueda = libro.nombre_libro;
            this.libroExtra.resultadosBusqueda = [];
            this.libroExtra.indiceSeleccionado = 0;
            
            this.$nextTick(() => {
                const cantidadInput = this.$el.querySelector('.body-extras-compacto input[type="number"]');
                if (cantidadInput) {
                    cantidadInput.focus();
                    cantidadInput.select();
                }
            });
        },
        
        limpiarBusquedaLibroExtra() {
            this.libroExtra = {
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                resultadosBusqueda: [],
                indiceSeleccionado: 0
            };
        },
        
        async agregarLibroExtra() {
            let me = this;
            if (!this.libroExtra.libroSeleccionado) {
                this.$vs.notify({
                    text: 'Debe seleccionar un libro',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            if (!this.libroExtra.cantidad || parseInt(this.libroExtra.cantidad) <= 0) {
                this.$vs.notify({
                    text: 'La cantidad debe ser mayor a 0',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const yaExiste = this.detallesProforma.find(l => 
                l.pro_codigo === this.libroExtra.libroSeleccionado.pro_codigo
            );
            
            if (yaExiste) {
                this.$vs.notify({
                    text: 'Este libro ya está en la lista',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            try {
                this.$vs.loading();
                const stockResponse = await me.$http.get(`${me.$server_url}consultar-stock-libros`, {
                    params: { codigos: this.libroExtra.libroSeleccionado.pro_codigo }
                });
                
                const stockData = stockResponse.data.status === 'success' && stockResponse.data.data ? stockResponse.data.data : stockResponse.data;
                const stockInfo = Array.isArray(stockData) ? stockData[0] : stockData;
                const stockDisponible = stockInfo && stockInfo.pro_reservar !== undefined ? stockInfo.pro_reservar : 0;

                const cantidadSolicitada = parseInt(this.libroExtra.cantidad);
                const stockRestante = stockDisponible - cantidadSolicitada;
                
                if (cantidadSolicitada > stockDisponible) {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: '❌ Stock Insuficiente',
                        text: `Solo hay ${stockDisponible} unidades disponibles de "${this.libroExtra.libroSeleccionado.pro_codigo}"`,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 5000,
                        position: 'top-center'
                    });
                    return;
                }
                
                if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                    this.$vs.loading.close();
                    
                    this.$vs.notify({
                        title: '🔒 Stock Mínimo Protegido',
                        text: `No puede agregar "${this.libroExtra.libroSeleccionado.pro_codigo}". Stock restante (${stockRestante}) sería menor al mínimo (${this.stockMinimo}). Active el permiso en configuración.`,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-shield-off',
                        time: 6000,
                        position: 'top-center'
                    });
                    return;
                }
                
                if (stockRestante < this.stockMinimo && this.configProforma.permitirUsarStockMinimo) {
                    this.$vs.notify({
                        title: 'Advertencia: Stock Mínimo',
                        text: `Stock restante (${stockRestante}) será menor al mínimo (${this.stockMinimo})`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 4000
                    });
                }
                
                const libroNuevo = {
                    ...this.libroExtra.libroSeleccionado,
                    codigo_liquidacion: this.libroExtra.libroSeleccionado.pro_codigo,
                    nombrelibro: this.libroExtra.libroSeleccionado.nombre_libro,
                    nombre_libro: this.libroExtra.libroSeleccionado.nombre_libro,
                    precio: this.libroExtra.libroSeleccionado.pvp || this.libroExtra.libroSeleccionado.precio || 0,
                    pvp: this.libroExtra.libroSeleccionado.pvp || this.libroExtra.libroSeleccionado.precio || 0,
                    cantidad: 0, // Cantidad pedida (no aplica para extras)
                    cantidadProforma: this.libroExtra.cantidad.toString(),
                    cantidadProformada: 0, // Los extras no tienen otras proformas
                    pro_reservar: stockDisponible,
                    stock: stockDisponible,
                    esLibroExtra: true
                };
                
                // ✅ AGREGAR A librosPedido (la lista que se muestra en la tabla)
                this.librosPedido.unshift(libroNuevo);
                
                const filaVacia = this.filasCaptura.find(fila => !fila.libroSeleccionado);
                
                if (filaVacia) {
                    filaVacia.libroSeleccionado = libroNuevo;
                    filaVacia.textoBusqueda = libroNuevo.nombre_libro;
                    filaVacia.cantidad = this.libroExtra.cantidad.toString();
                    filaVacia.confirmado = true;
                } else {
                    this.filasCaptura.unshift({
                        textoBusqueda: libroNuevo.nombre_libro,
                        libroSeleccionado: libroNuevo,
                        cantidad: this.libroExtra.cantidad.toString(),
                        confirmado: true,
                        resultadosBusqueda: [],
                        sugerenciaActual: null
                    });
                }
                
                this.calcularTotales();
                
                this.$vs.loading.close();
                this.$vs.notify({
                    text: `Libro "${this.libroExtra.libroSeleccionado.pro_codigo}" agregado exitosamente`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                
                this.limpiarBusquedaLibroExtra();
                
            } catch (error) {
                console.error('Error al agregar libro extra:', error);
                this.$vs.loading.close();
                this.$vs.notify({
                    text: 'Error al consultar el stock del libro',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            }
        },
        
        tieneLibrosExtras() {
            return this.detallesProforma.some(libro => libro.esLibroExtra === true);
        },
        
        eliminarLibroExtra(libro, index) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar eliminación',
                text: `¿Está seguro de eliminar el libro "${libro.pro_codigo} - ${libro.nombre_libro}"?`,
                acceptText: 'Sí, eliminar',
                cancelText: 'Cancelar',
                accept: () => {
                    const indiceReal = this.detallesProforma.findIndex(l => l.pro_codigo === libro.pro_codigo);
                    if (indiceReal !== -1) {
                        this.detallesProforma.splice(indiceReal, 1);
                    }
                    
                    const filaIndex = this.filasCaptura.findIndex(fila => 
                        fila.libroSeleccionado && fila.libroSeleccionado.pro_codigo === libro.pro_codigo
                    );
                    
                    if (filaIndex !== -1) {
                        if (this.filasCaptura.length === 1) {
                            this.filasCaptura[filaIndex] = {
                                textoBusqueda: '',
                                libroSeleccionado: null,
                                cantidad: '',
                                confirmado: false,
                                resultadosBusqueda: [],
                                sugerenciaActual: null
                            };
                        } else {
                            this.filasCaptura.splice(filaIndex, 1);
                        }
                    }
                    
                    this.calcularTotales();
                    
                    this.$vs.notify({
                        text: 'Libro extra eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                }
            });
        },
        
        // ====================================
        // MÉTODOS PARA VALIDACIONES
        // ====================================
        esVentaPorLista() {
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 2;
        },
        
        esVentaDirecta() {
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 1;
        },
        
        
        // ====================================
        // MÉTODOS PARA CONTROL DE CUPO
        // ====================================
        // esVentaPorLista() {
        //     return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 2;
        // },
        
        debeMostrarCupo() {
            // El cupo solo aplica si:
            // 1. Es venta por lista (tipo_venta == 2)
            // 2. Es la primera proforma del contrato
            return this.esVentaPorLista() && this.esPrimeraProforma;
        },
        
        tieneCupoSuficiente() {
            if (!this.debeMostrarCupo()) return true; // Solo validar si debe mostrar cupo
            
            // ✅ Usar el NUEVO lugar si existe, sino el actual
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return false;
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            
            return cupoInicial > 0 && totalProforma <= cupoInicial;
        },
        
        obtenerCupoMaximo() {
            if (!this.debeMostrarCupo()) return '0.00'; // Solo si debe mostrar cupo
            
            // ✅ Usar el NUEVO lugar si existe, sino el actual
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            return cupoInicial.toFixed(2);
        },
        
        validarCupoParaVentaPorLista() {
            if (!this.debeMostrarCupo()) return true; // Solo validar si debe mostrar cupo
            
            // ✅ Usar el NUEVO lugar si existe, sino el actual
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            
            // Si no tiene datos financieros o cupo, permitir continuar pero mostrar advertencia
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return true; // PERMITIR continuar
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            if (cupoInicial <= 0) {
                return true; // PERMITIR continuar
            }
            
            // SOLO validar que el total no supere el cupo SI ya existe cupo configurado
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            if (totalProforma > cupoInicial) {
                return false; // NO permitir guardar
            }
            
            return true;
        },
        
        async consultarCupoLugarDespacho() {
            // ✅ Si existe nuevoLugarDespacho, consultar para ese, sino para el actual
            const idInstitucion = this.nuevoLugarDespacho 
                ? this.nuevoLugarDespacho.idInstitucion 
                : this.lugarDespacho.idInstitucion;
            
            if (!idInstitucion) {
                console.warn('No hay ID de institución para consultar cupo');
                return;
            }
            
            const parametros = {
                idInstitucion: idInstitucion,
                idperiodoescolar: this.pedidoSeleccionado.idPeriodoEscolar || this.pedidoSeleccionado.id_periodo
            };
            
            try {
                const res = await this.$http.get(this.$server_url + 'obtenerPorInstitucionPeriodo', { params: parametros });
                
                console.log('📥 Respuesta completa del servidor para cupo:', res.data);
                
                // Manejar diferentes formatos de respuesta del servidor
                let datosInstitucion = [];
                
                if (res.data) {
                    if (res.data.success && res.data.data) {
                        // Formato: { success: true, data: {...} }
                        datosInstitucion = [res.data.data];
                        console.log('✅ Formato success/data detectado');
                    } else if (Array.isArray(res.data) && res.data.length > 0) {
                        // Formato: [{...}]
                        datosInstitucion = res.data;
                        console.log('✅ Formato array detectado');
                    } else if (typeof res.data === 'object' && res.data.ffp_id) {
                        // Formato: {...}
                        datosInstitucion = [res.data];
                        console.log('✅ Formato objeto directo detectado');
                    }
                }
                
                if (datosInstitucion.length > 0) {
                    console.log('✅ Cupo encontrado, actualizando UI con:', datosInstitucion[0]);
                    
                    // ✅ Actualizar el lugar correspondiente usando Vue.set para reactividad
                    if (this.nuevoLugarDespacho) {
                        // Crear una copia nueva del objeto para forzar reactividad
                        const nuevoLugar = {
                            ...this.nuevoLugarDespacho,
                            datosInstitucion: datosInstitucion
                        };
                        this.nuevoLugarDespacho = nuevoLugar;
                        console.log('✅ nuevoLugarDespacho actualizado:', this.nuevoLugarDespacho);
                    } else {
                        this.lugarDespacho = {
                            ...this.lugarDespacho,
                            datosInstitucion: datosInstitucion
                        };
                        console.log('✅ lugarDespacho actualizado:', this.lugarDespacho);
                    }
                    
                    // ✅ Si es venta por lista, aplicar automáticamente el descuento del lugar
                    if (this.esVentaPorLista()) {
                        const descuentoLugar = parseFloat(datosInstitucion[0].ffp_descuento) || 0;
                        this.proformaData.pro_des_por = descuentoLugar;
                        
                        this.$vs.notify({
                            text: `Descuento del lugar de despacho aplicado: ${descuentoLugar}%`,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        });
                        
                        console.log(`✅ Descuento aplicado automáticamente: ${descuentoLugar}%`);
                    }
                    
                    // Forzar actualización de la UI
                    this.$nextTick(() => {
                        this.$forceUpdate();
                        console.log('🔄 UI actualizada forzosamente');
                    });
                } else {
                    console.log('⚠️ No se encontró cupo configurado para este lugar');
                    if (this.nuevoLugarDespacho) {
                        const nuevoLugar = {
                            ...this.nuevoLugarDespacho,
                            datosInstitucion: []
                        };
                        this.nuevoLugarDespacho = nuevoLugar;
                    } else {
                        this.lugarDespacho = {
                            ...this.lugarDespacho,
                            datosInstitucion: []
                        };
                    }
                    
                    // 🔥 MOSTRAR AUTOMÁTICAMENTE EL FORMULARIO si no hay cupo
                    if (this.debeMostrarCupo() && this.nuevoLugarDespacho) {
                        this.$vs.notify({
                            title: '⚠️ Configuración Requerida',
                            text: 'Este lugar de despacho no tiene cupo configurado. Por favor configure el cupo para continuar.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 5000
                        });
                        // No abrir automáticamente el formulario después de guardar
                    }
                }
            } catch (error) {
                console.error('❌ Error al consultar cupo:', error);
                if (this.nuevoLugarDespacho) {
                    const nuevoLugar = {
                        ...this.nuevoLugarDespacho,
                        datosInstitucion: []
                    };
                    this.nuevoLugarDespacho = nuevoLugar;
                } else {
                    this.lugarDespacho = {
                        ...this.lugarDespacho,
                        datosInstitucion: []
                    };
                }
            }
        },
        
        // ====================================
        // MÉTODOS PARA FORMULARIO DE CUPO
        // ====================================
        toggleFormularioCupo() {
            if (this.showFormularioCupo) {
                this.showFormularioCupo = false;
            } else {
                this.cargarDatosFormularioCupo(false);
            }
        },
        
        editarCupoLugarActual() {
            this.cargarDatosFormularioCupo(true);
        },
        
        cargarDatosFormularioCupo(esLugarActual = false) {
            // Determinar de qué lugar cargar los datos
            const lugar = esLugarActual ? this.lugarDespacho : this.nuevoLugarDespacho;
            
            if (!lugar || !lugar.nombreInstitucion) {
                this.$vs.notify({
                    text: 'Debe seleccionar un lugar de despacho primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const idInstitucion = lugar.idInstitucion || lugar.id_institucion;
            
            if (!idInstitucion) {
                this.$vs.notify({
                    text: 'No se puede identificar la institución seleccionada',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const parametros = {
                idInstitucion: idInstitucion,
                idperiodoescolar: this.pedidoSeleccionado.idPeriodoEscolar || this.pedidoSeleccionado.id_periodo
            };

            this.$vs.loading();
            
            this.$http.get(this.$server_url + 'obtenerPorInstitucionPeriodo', { params: parametros })
                .then(res => {
                    this.$vs.loading.close();
                    
                    console.log('📥 Respuesta al cargar datos del formulario:', res.data);
                    
                    // Manejar diferentes formatos de respuesta
                    let datos = null;
                    if (res.data && res.data.success && res.data.data) {
                        datos = res.data.data;
                    } else if (Array.isArray(res.data) && res.data.length > 0) {
                        datos = res.data[0];
                    } else if (res.data && res.data.ffp_id) {
                        datos = res.data;
                    }
                    
                    if (datos) {
                        // Editar: Formulario existe, cargar datos
                        this.formularioCupoData = {
                            ffp_id: datos.ffp_id,
                            idInstitucion: datos.idInstitucion,
                            idperiodoescolar: datos.idperiodoescolar,
                            ffp_credito: datos.ffp_credito,
                            ffp_cupo: datos.ffp_cupo,
                            ffp_descuento: datos.ffp_descuento,
                            if_distribuidor: datos.if_distribuidor === 1,
                            nombreInstitucion: datos.nombreInstitucion || lugar.nombreInstitucion,
                            ciudad: datos.ciudad || lugar.ciudad
                        };
                        
                        console.log('✅ Datos cargados en formulario:', this.formularioCupoData);
                        
                        if (esLugarActual) {
                            this.showFormularioCupoActual = true;
                        } else {
                            this.showFormularioCupo = true;
                        }
                        
                        console.log('✅ Cupo encontrado para editar:', this.formularioCupoData);
                    } else {
                        // Crear: No existe formulario, preparar datos para creación
                        this.formularioCupoData = {
                            ffp_id: null,
                            idInstitucion: idInstitucion,
                            idperiodoescolar: parametros.idperiodoescolar,
                            ffp_credito: '',
                            ffp_cupo: '',
                            ffp_descuento: '',
                            if_distribuidor: false,
                            nombreInstitucion: lugar.nombreInstitucion,
                            ciudad: lugar.ciudad
                        };
                        
                        if (esLugarActual) {
                            this.showFormularioCupoActual = true;
                        } else {
                            this.showFormularioCupo = true;
                        }
                        
                        console.log('📝 Preparando para crear nuevo cupo');
                        
                        this.$vs.notify({
                            text: 'Configurando nuevo formulario para la institución',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-info'
                        });
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    console.error('Error al obtener datos del formulario:', error);
                    
                    // En caso de error, también permitir crear
                    this.formularioCupoData = {
                        ffp_id: null,
                        idInstitucion: idInstitucion,
                        idperiodoescolar: parametros.idperiodoescolar,
                        ffp_credito: '',
                        ffp_cupo: '',
                        ffp_descuento: '',
                        if_distribuidor: false,
                        nombreInstitucion: lugar.nombreInstitucion,
                        ciudad: lugar.ciudad
                    };
                    
                    if (esLugarActual) {
                        this.showFormularioCupoActual = true;
                    } else {
                        this.showFormularioCupo = true;
                    }
                });
        },
        
        async guardarFormularioCupo() {
            // Validación básica
            if (!this.formularioCupoData.ffp_credito || !this.formularioCupoData.ffp_cupo || !this.formularioCupoData.ffp_descuento) {
                this.$vs.notify({
                    text: 'Por favor complete todos los campos requeridos (Crédito, Cupo y Descuento)',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);

            const datosGuardar = {
                idInstitucion: this.formularioCupoData.idInstitucion,
                idperiodoescolar: this.formularioCupoData.idperiodoescolar,
                ffp_credito: this.formularioCupoData.ffp_credito,
                ffp_cupo: this.formularioCupoData.ffp_cupo,
                ffp_descuento: this.formularioCupoData.ffp_descuento,
                if_distribuidor: this.formularioCupoData.if_distribuidor ? 1 : 0
            };

            // Si existe ffp_id, es una actualización
            if (this.formularioCupoData.ffp_id) {
                datosGuardar.ffp_id = this.formularioCupoData.ffp_id;
                datosGuardar.user_update = usuarioObjeto.idusuario;
            } else {
                datosGuardar.user_created = usuarioObjeto.idusuario;
            }

            this.$vs.loading();

            try {
                const res = await this.$http.post(this.$server_url + 'Post_Registrar_modificar_formularioProforma', datosGuardar);
                
                this.$vs.loading.close();
                
                console.log('Respuesta del servidor al guardar cupo:', res.data);
                
                // El backend devuelve un string: "Se guardó correctamente" o "No se pudo guardar/actualizar"
                if (res.data === "Se guardó correctamente" || (typeof res.data === 'string' && res.data.includes('guardó correctamente'))) {
                    this.$vs.notify({
                        title: '✅ Éxito',
                        text: this.formularioCupoData.ffp_id ? 'Cupo actualizado correctamente' : 'Cupo creado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    });
                    
                    // 🔥 RECONSULTAR el cupo para actualizar la UI correctamente
                    await this.consultarCupoLugarDespacho();
                    
                    // Cerrar ambos formularios
                    this.showFormularioCupo = false;
                    this.showFormularioCupoActual = false;
                } else {
                    this.$vs.notify({
                        text: res.data || 'Error al guardar el formulario',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                }
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al guardar formulario:', error);
                this.$vs.notify({
                    text: 'Error al comunicarse con el servidor',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
        },
        
        calcularDiferenciaCupo() {
            if (!this.debeMostrarCupo()) return '0.00'; // Solo calcular si debe mostrar cupo
            
            // ✅ Usar el NUEVO lugar si existe, sino el actual
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            const diferencia = cupoInicial - totalProforma;
            
            return diferencia.toFixed(2);
        },
        
        // ====================================
        // MÉTODOS PARA CÁLCULOS
        // ====================================
        calcularTotalesUnificados() {
            const librosParaProforma = this.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            const subtotal = librosParaProforma.reduce((total, libro) => {
                const precio = parseFloat(libro.precio || libro.pvp || libro.det_prof_valor_u || 0);
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
            const precio = parseFloat(libro.precio || libro.pvp || libro.det_prof_valor_u || 0);
            const cantidad = parseInt(libro.cantidadProforma) || 0;
            return (precio * cantidad).toFixed(2);
        },
        
        calcularSubtotalFila(fila) {
            if (!fila.libroSeleccionado || !fila.cantidad || parseInt(fila.cantidad) === 0) {
                return '0.00';
            }
            const precio = parseFloat(fila.libroSeleccionado.det_prof_valor_u) || 0;
            const cantidad = parseInt(fila.cantidad) || 0;
            return (precio * cantidad).toFixed(2);
        },
        
        // ====================================
        // MÉTODOS PARA STOCK
        // ====================================
        async consultarStockLibros() {
            let me = this;
            
            // 🔥 Consultar stock de TODOS los libros del pedido
            if (!me.librosPedido || me.librosPedido.length === 0) {
                console.log('⚠️ No hay libros del pedido para consultar stock');
                return;
            }
            
            // Obtener códigos únicos de TODOS los libros del pedido
            const codigosUnicos = [...new Set(me.librosPedido.map(libro => 
                libro.codigo_liquidacion || libro.pro_codigo
            ))];
            
            console.log('📦 Consultando stock para', codigosUnicos.length, 'libros del pedido');
            
            me.loadingStock = true;
            
            try {
                const res = await me.$http.get(`${me.$server_url}consultar-stock-libros`, {
                    params: { codigos: codigosUnicos }
                });
                
                me.loadingStock = false;
                
                if (res.data.status === 'success') {
                    const stockData = res.data.data;
                    
                    // Actualizar stock en librosPedido
                    me.librosPedido.forEach(libro => {
                        const codigo = libro.codigo_liquidacion || libro.pro_codigo;
                        const stockInfo = stockData.find(item => item.pro_codigo === codigo);
                        
                        if (stockInfo) {
                            me.$set(libro, 'stock', stockInfo.pro_reservar);
                            console.log(`✅ Stock actualizado: ${codigo} = ${stockInfo.pro_reservar}`);
                        } else {
                            me.$set(libro, 'stock', 0);
                            console.warn(`⚠️ Sin stock para: ${codigo}`);
                        }
                    });
                    
                    console.log('✅ Stock actualizado para todos los libros del pedido');
                    
                    // 🔥 VALIDAR AUTOMÁTICAMENTE TODOS LOS LIBROS DESPUÉS DE CARGAR STOCK
                    me.$nextTick(() => {
                        me.validarTodosLosLibros();
                    });
                } else {
                    me.$vs.notify({
                        text: res.data.message || 'Error al consultar el stock',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
            } catch (err) {
                me.loadingStock = false;
                console.error('❌ Error al consultar stock:', err);
                me.$vs.notify({
                    text: 'Error al consultar el stock',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        
        obtenerColorStock(libro) {
            if (libro.stock === undefined) return 'dark';
            if (libro.stock === 0) return 'danger';
            
            const cantidadSolicitada = parseInt(libro.cantidadProforma || 0);
            const stockRestante = libro.stock - cantidadSolicitada;
            
            if (libro.stock < cantidadSolicitada) return 'danger';
            
            if (stockRestante < this.stockMinimo) {
                if (!this.configProforma.permitirUsarStockMinimo) {
                    return 'danger';
                }
                return 'warning';
            }
            
            if (stockRestante < this.stockMinimo * 1.2) {
                return 'warning';
            }
            
            return 'success';
        },
        
        obtenerTooltipStock(libro) {
            if (libro.stock === undefined) {
                return 'Consultando stock...';
            }
            
            const cantidadSolicitada = parseInt(libro.cantidadProforma || 0);
            const stockRestante = libro.stock - cantidadSolicitada;
            
            let texto = `Stock: ${libro.stock}`;
            
            if (cantidadSolicitada > 0) {
                texto += ` | Solicitado: ${cantidadSolicitada} | Restante: ${stockRestante}`;
            }
            
            texto += ` | Mínimo: ${this.stockMinimo}`;
            
            if (libro.stock === 0) {
                texto += ' | ⚠️ Sin stock';
            } else if (libro.stock < cantidadSolicitada) {
                texto += ' | ⚠️ Stock insuficiente';
            } else if (stockRestante < this.stockMinimo) {
                if (!this.configProforma.permitirUsarStockMinimo) {
                    texto += ' | 🔒 Stock protegido';
                } else {
                    texto += ' | ⚠️ Usando stock mínimo';
                }
            } else if (stockRestante < this.stockMinimo * 1.2) {
                texto += ' | ⚡ Cerca del mínimo';
            } else {
                texto += ' | ✓ Stock OK';
            }
            
            return texto;
        },
        
        // ====================================
        // MÉTODOS PARA DIFERENCIA DE STOCK
        // ====================================
        obtenerDiferenciaStock(libro) {
            if (!this.datosOriginales || !this.datosOriginales.detallesProforma) {
                return '0';
            }
            
            // Buscar cantidad original de este libro en los detalles de LA PROFORMA
            const detalleOriginal = this.datosOriginales.detallesProforma.find(d => 
                d.pro_codigo === (libro.codigo_liquidacion || libro.pro_codigo)
            );
            
            // Si el libro NO estaba en la proforma original
            if (!detalleOriginal) {
                const cantidadActual = parseInt(libro.cantidadProforma || 0);
                if (cantidadActual === 0) {
                    return '0'; // No estaba y sigue sin estar
                } else {
                    return `-${cantidadActual}`; // Es nuevo, se restará del stock
                }
            }
            
            // Si el libro SÍ estaba en la proforma original
            const cantidadOriginal = parseInt(detalleOriginal.det_prof_cantidad || 0);
            // Convertir cantidadProforma: si es vacío, null, undefined o '', será 0
            const cantidadActual = parseInt(libro.cantidadProforma) || 0;
            
            console.log(`📊 [${libro.pro_nombre}] Original: ${cantidadOriginal}, Actual: ${cantidadActual}`);
            
            // Calcular diferencia
            const diferencia = cantidadActual - cantidadOriginal;
            
            if (diferencia === 0) {
                return '0';
            } else if (diferencia > 0) {
                // Aumentó la cantidad → SE RESTA del stock
                return `-${diferencia}`;
            } else {
                // Disminuyó la cantidad (incluyendo cuando se borra a 0) → SE SUMA al stock
                return `+${Math.abs(diferencia)}`;
            }
        },
        
        obtenerColorDiferenciaStock(libro) {
            if (!this.datosOriginales || !this.datosOriginales.detallesProforma) {
                return 'dark';
            }
            
            const detalleOriginal = this.datosOriginales.detallesProforma.find(d => 
                d.pro_codigo === (libro.codigo_liquidacion || libro.pro_codigo)
            );
            
            // Si no estaba en la proforma original
            if (!detalleOriginal) {
                const cantidadActual = parseInt(libro.cantidadProforma) || 0;
                return cantidadActual > 0 ? 'danger' : 'dark';
            }
            
            const cantidadOriginal = parseInt(detalleOriginal.det_prof_cantidad || 0);
            const cantidadActual = parseInt(libro.cantidadProforma) || 0;
            const diferencia = cantidadActual - cantidadOriginal;
            
            if (diferencia === 0) {
                return 'dark'; // Sin cambios
            } else if (diferencia > 0) {
                return 'danger'; // Resta del stock (rojo)
            } else {
                return 'success'; // Suma al stock (verde)
            }
        },
        
        obtenerTooltipDiferenciaStock(libro) {
            if (!this.datosOriginales || !this.datosOriginales.detallesProforma) {
                return 'Sin datos originales';
            }
            
            const detalleOriginal = this.datosOriginales.detallesProforma.find(d => 
                d.pro_codigo === (libro.codigo_liquidacion || libro.pro_codigo)
            );
            
            const stockActual = libro.stock || 0;
            
            // Si no estaba en la proforma original
            if (!detalleOriginal) {
                const cantidadActual = parseInt(libro.cantidadProforma) || 0;
                if (cantidadActual === 0) {
                    return 'Libro no incluido en la proforma';
                } else {
                    const nuevoStock = stockActual - cantidadActual;
                    return `🆕 LIBRO NUEVO\n` +
                           `Cantidad: 0 → ${cantidadActual}\n` +
                           `Stock: ${stockActual} → ${nuevoStock} (RESTA ${cantidadActual})`;
                }
            }
            
            const cantidadOriginal = parseInt(detalleOriginal.det_prof_cantidad || 0);
            const cantidadActual = parseInt(libro.cantidadProforma) || 0;
            const diferencia = cantidadActual - cantidadOriginal;
            
            if (diferencia === 0) {
                return 'Sin cambios - Stock se mantiene igual';
            } else if (diferencia > 0) {
                // Aumentó
                const nuevoStock = stockActual - diferencia;
                return `⚠️ AUMENTÓ ${diferencia} unidad(es)\n` +
                       `Cantidad Original: ${cantidadOriginal} → Actual: ${cantidadActual}\n` +
                       `Stock: ${stockActual} → ${nuevoStock} (RESTA ${diferencia})`;
            } else {
                // Disminuyó
                const aumento = Math.abs(diferencia);
                const nuevoStock = stockActual + aumento;
                return `✅ DISMINUYÓ ${aumento} unidad(es)\n` +
                       `Cantidad Original: ${cantidadOriginal} → Actual: ${cantidadActual}\n` +
                       `Stock: ${stockActual} → ${nuevoStock} (SUMA ${aumento})`;
            }
        },
        
        // ====================================
        // MÉTODOS PARA CAPTURA RÁPIDA
        // ====================================
        agregarFilaCaptura() {
            this.filasCaptura.push({
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                confirmado: false,
                resultadosBusqueda: [],
                sugerenciaActual: null,
                errorCantidad: ''
            });
        },
        
        validarYSincronizarCantidad(fila, index) {
            fila.errorCantidad = '';
            
            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                this.sincronizarCantidadEnTabla(fila);
                return;
            }
            
            const cantidad = parseInt(fila.cantidad);
            
            if (cantidad <= 0) {
                fila.errorCantidad = 'La cantidad debe ser mayor a 0';
                return;
            }
            
            if (fila.libroSeleccionado) {
                if (cantidad > fila.libroSeleccionado.stock) {
                    fila.errorCantidad = `Stock insuficiente (máx: ${fila.libroSeleccionado.stock})`;
                    return;
                }
                
                const stockRestante = fila.libroSeleccionado.stock - cantidad;
                if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                    fila.errorCantidad = `🔒 Protege stock mínimo (${this.stockMinimo})`;
                    return;
                }
            }
            
            this.sincronizarCantidadEnTabla(fila);
        },
        
        validarCantidadFinal(fila, index) {
            if (fila.cantidad && parseInt(fila.cantidad) <= 0) {
                fila.cantidad = '';
                fila.errorCantidad = '';
                this.sincronizarCantidadEnTabla(fila);
            }
            
            if (!fila.libroSeleccionado && (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') && (!fila.cantidad || fila.cantidad.toString().trim() === '')) {
                this.verificarYEliminarFilasVacias();
            }
        },
        
        verificarYEliminarFilasVacias() {
            if (this.filasCaptura.length <= 1) return;
            
            this.filasCaptura = this.filasCaptura.filter((fila, index) => {
                if (index === 0) return true;
                
                const tieneBusqueda = fila.textoBusqueda && fila.textoBusqueda.trim() !== '';
                const tieneCantidad = fila.cantidad && fila.cantidad.toString().trim() !== '' && parseInt(fila.cantidad) > 0;
                const tieneLibroSeleccionado = fila.libroSeleccionado !== null;
                
                return tieneBusqueda || tieneCantidad || tieneLibroSeleccionado;
            });
            
            if (this.filasCaptura.length === 0) {
                this.filasCaptura.push({
                    textoBusqueda: '',
                    libroSeleccionado: null,
                    cantidad: '',
                    confirmado: false,
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: ''
                });
            }
        },
        
        buscarEnFila(fila, index) {
            const texto = fila.textoBusqueda.toLowerCase().trim();
            
            if (texto.length < 2) {
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                return;
            }
            
            if (fila.libroSeleccionado && 
                fila.libroSeleccionado.nombre_libro.toLowerCase() === texto) {
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                return;
            }
            
            if (fila.libroSeleccionado && 
                fila.libroSeleccionado.nombre_libro.toLowerCase() !== texto) {
                fila.libroSeleccionado = null;
                fila.cantidad = '';
                fila.confirmado = false;
            }
            
            const codigosSeleccionados = this.filasCaptura
                .filter((f, i) => i !== index && f.libroSeleccionado)
                .map(f => f.libroSeleccionado.pro_codigo);
            
            const palabrasBusqueda = texto.split(/\s+/).filter(p => p.length > 0);
            
            fila.resultadosBusqueda = this.detallesProforma.filter(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                const noEsDuplicado = !codigosSeleccionados.includes(libro.pro_codigo);
                
                const coincideCodigo = codigo.includes(texto);
                
                const todasLasPalabrasEnNombre = palabrasBusqueda.every(palabra => 
                    nombreCompleto.includes(palabra)
                );
                
                return (todasLasPalabrasEnNombre || coincideCodigo) && noEsDuplicado;
            })
            .map(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                let puntuacion = 0;
                
                if (codigo === texto) puntuacion += 1000;
                else if (codigo.startsWith(texto)) puntuacion += 500;
                else if (codigo.includes(texto)) puntuacion += 100;
                
                if (palabrasBusqueda.length > 1) {
                    let palabrasCoincidentes = 0;
                    let puntuacionPalabras = 0;
                    
                    palabrasBusqueda.forEach(palabra => {
                        if (nombreCompleto.includes(palabra)) {
                            palabrasCoincidentes++;
                            if (nombreCompleto.indexOf(palabra) < nombreCompleto.length / 3) {
                                puntuacionPalabras += 50;
                            } else {
                                puntuacionPalabras += 20;
                            }
                        }
                    });
                    
                    if (palabrasCoincidentes === palabrasBusqueda.length) {
                        puntuacionPalabras += 200;
                    }
                    
                    puntuacion += puntuacionPalabras;
                } else {
                    if (nombreCompleto.startsWith(texto)) puntuacion += 300;
                    else if (nombreCompleto.includes(texto)) puntuacion += 150;
                }
                
                return { ...libro, puntuacion };
            })
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, 5);
            
            const coincidenciaExacta = fila.resultadosBusqueda.find(libro => 
                libro.pro_codigo.toLowerCase() === texto
            );
            
            if (coincidenciaExacta) {
                this.seleccionarLibroEnFila(fila, coincidenciaExacta, index);
                return;
            }
            
            if (fila.resultadosBusqueda.length > 0) {
                fila.sugerenciaActual = fila.resultadosBusqueda[0];
            } else {
                fila.sugerenciaActual = null;
            }
        },
        
        limpiarBusqueda(fila) {
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
        },
        
        obtenerPlaceholder(fila) {
            if (fila.libroSeleccionado) {
                return fila.libroSeleccionado.nombre_libro;
            }
            return 'Ej: "sinapsis lengua 2" o código "SSLL2"';
        },
        
        aceptarSugerencia(fila, index) {
            if (fila.sugerenciaActual && !fila.libroSeleccionado) {
                this.seleccionarLibroEnFila(fila, fila.sugerenciaActual, index);
            }
        },
        
        activarBusqueda(fila, index) {
            if (fila.textoBusqueda.trim().length >= 2 && !fila.libroSeleccionado) {
                this.buscarEnFila(fila, index);
            }
        },
        
        seleccionarLibroEnFila(fila, libro, index) {
            fila.libroSeleccionado = libro;
            fila.textoBusqueda = libro.nombre_libro;
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
            fila.cantidad = '';
            fila.confirmado = true;
            
            const libroEnTabla = this.detallesProforma.find(l => l.pro_codigo === libro.pro_codigo);
            if (libroEnTabla) {
                libroEnTabla.cantidadProforma = '';
            }
            
            this.$nextTick(() => {
                setTimeout(() => {
                    const cantidadInput = this.$refs[`cantidad-${index}`];
                    if (cantidadInput && cantidadInput[0]) {
                        cantidadInput[0].$el.querySelector('input').focus();
                    }
                }, 100);
            });
        },
        
        limpiarFilaCaptura(fila, index) {
            if (fila.libroSeleccionado) {
                const libroEnTabla = this.detallesProforma.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                if (libroEnTabla) {
                    libroEnTabla.cantidadProforma = '';
                }
            }
            
            if (index === 0) {
                fila.textoBusqueda = '';
                fila.libroSeleccionado = null;
                fila.cantidad = '';
                fila.confirmado = false;
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                fila.errorCantidad = '';
                
                this.$nextTick(() => {
                    setTimeout(() => {
                        const inputs = this.$el.querySelectorAll('.captura-rapida-container input[type="text"]');
                        if (inputs[0]) {
                            inputs[0].focus();
                        }
                    }, 100);
                });
            } else {
                this.filasCaptura.splice(index, 1);
            }
            
            this.$nextTick(() => {
                this.verificarYEliminarFilasVacias();
            });
            
            this.calcularTotales();
        },
        
        // ====================================
        // MÉTODOS DE SINCRONIZACIÓN
        // ====================================
        sincronizarCantidadEnTabla(fila) {
            if (fila.libroSeleccionado) {
                const libroEnTabla = this.detallesProforma.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                if (libroEnTabla) {
                    if (!fila.cantidad || fila.cantidad.toString().trim() === '' || parseInt(fila.cantidad) <= 0) {
                        libroEnTabla.cantidadProforma = '';
                    } else {
                        const cantidad = parseInt(fila.cantidad);
                        if (cantidad > 0) {
                            libroEnTabla.cantidadProforma = cantidad.toString();
                        }
                    }
                }
            }
            
            this.calcularTotales();
        },
        
        sincronizarCantidadEnRapida(libro) {
            const cantidad = libro.cantidadProforma;
            
            const filaExistente = this.filasCaptura.find(fila => 
                fila.libroSeleccionado && fila.libroSeleccionado.pro_codigo === libro.pro_codigo
            );
            
            if (filaExistente) {
                if (!cantidad || cantidad.toString().trim() === '' || parseInt(cantidad) <= 0) {
                    filaExistente.textoBusqueda = '';
                    filaExistente.libroSeleccionado = null;
                    filaExistente.cantidad = '';
                    filaExistente.confirmado = false;
                    filaExistente.resultadosBusqueda = [];
                    filaExistente.sugerenciaActual = null;
                    filaExistente.errorCantidad = '';
                } else {
                    filaExistente.cantidad = cantidad;
                    filaExistente.confirmado = parseInt(cantidad) > 0;
                }
            } else if (cantidad && parseInt(cantidad) > 0) {
                let filaVacia = this.filasCaptura.find(fila => !fila.libroSeleccionado);
                
                if (!filaVacia) {
                    this.agregarFilaCaptura();
                    filaVacia = this.filasCaptura[this.filasCaptura.length - 1];
                }
                
                filaVacia.libroSeleccionado = libro;
                filaVacia.textoBusqueda = libro.nombre_libro;
                filaVacia.cantidad = cantidad;
                filaVacia.confirmado = true;
                filaVacia.resultadosBusqueda = [];
            }
            
            this.calcularTotales();
        },
        
        avanzarAlSiguienteLibro(index) {
            const filaActual = this.filasCaptura[index];
            
            if (!filaActual.libroSeleccionado) {
                this.$vs.notify({
                    text: 'Debe seleccionar un libro primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            if (!filaActual.cantidad || filaActual.cantidad.toString().trim() === '' || parseInt(filaActual.cantidad) <= 0) {
                filaActual.errorCantidad = 'La cantidad debe ser mayor a 0';
                this.$vs.notify({
                    text: 'Debe ingresar una cantidad válida',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const cantidadSolicitada = parseInt(filaActual.cantidad);
            const stockDisponible = filaActual.libroSeleccionado.stock || 0;
            const stockRestante = stockDisponible - cantidadSolicitada;
            
            if (cantidadSolicitada > stockDisponible) {
                filaActual.errorCantidad = `Stock insuficiente (máx: ${stockDisponible})`;
                this.$vs.notify({
                    title: '❌ Stock Insuficiente',
                    text: `Solo hay ${stockDisponible} unidades disponibles`,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle'
                });
                return;
            }
            
            if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                filaActual.errorCantidad = `🔒 Bloqueo stock mínimo (${this.stockMinimo})`;
                
                this.$vs.notify({
                    title: '🔒 Stock Mínimo Protegido',
                    text: `Stock restante (${stockRestante}) sería menor al mínimo (${this.stockMinimo}). Active el permiso en configuración.`,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-shield-off',
                    time: 4000,
                    position: 'top-center'
                });
                return;
            }
            
            filaActual.errorCantidad = '';
            
            this.sincronizarCantidadEnTabla(filaActual);
            
            let siguienteFila = this.filasCaptura.findIndex((fila, i) => 
                i > index && !fila.libroSeleccionado
            );
            
            if (siguienteFila === -1) {
                this.agregarFilaCaptura();
                siguienteFila = this.filasCaptura.length - 1;
            }
            
            this.$nextTick(() => {
                setTimeout(() => {
                    const inputs = this.$el.querySelectorAll('.captura-rapida-container input[type="text"]');
                    if (inputs[siguienteFila]) {
                        inputs[siguienteFila].focus();
                    }
                }, 100);
            });
        },
        
        // ====================================
        // MÉTODOS DE VALIDACIÓN
        // ====================================
        
        // 🔥 VALIDAR TODOS LOS LIBROS (llamado después de cargar stock o cambiar configuración)
        validarTodosLosLibros() {
            let me = this;
            console.log('🔍 Validando todos los libros con cantidad...');
            
            let librosValidados = 0;
            let librosConError = 0;
            
            // Validar todos los libros que tengan cantidad ingresada
            me.librosPedido.forEach(libro => {
                if (libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0) {
                    librosValidados++;
                    
                    // Ejecutar validación SIN mostrar notificaciones individuales
                    me.validarCantidadListado(libro, false);
                    
                    // Contar si tiene error después de validar
                    if (libro.errorStockMinimo) {
                        librosConError++;
                    }
                }
            });
            
            console.log(`✅ Validación completa: ${librosValidados} libros validados, ${librosConError} con errores`);
            
            // 🔥 MOSTRAR UNA SOLA NOTIFICACIÓN AL FINAL
            if (librosConError > 0) {
                me.$vs.notify({
                    title: '⚠️ Errores de Stock Detectados',
                    text: `${librosConError} producto(s) tienen problemas de stock. Revise las cantidades marcadas en rojo.`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    position: 'top-center',
                    time: 6000
                });
            }
        },
        
        validarCantidadListado(libro, mostrarNotificaciones = true) {
            const cantidad = parseInt(libro.cantidadProforma);
            
            if (libro.cantidadProforma === '' || libro.cantidadProforma === null) {
                this.$set(libro, 'errorStockMinimo', '');
                this.sincronizarCantidadEnRapida(libro);
                this.calcularTotales();
                return;
            }
            
            if (cantidad <= 0) {
                this.$set(libro, 'errorStockMinimo', 'Cantidad debe ser mayor a 0');
                if (mostrarNotificaciones) {
                    this.$vs.notify({
                        text: 'La cantidad debe ser mayor a 0',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                }
                return;
            }
            
            // 🔥 VALIDACIÓN CONTRA CANTIDAD DISPONIBLE (solo para libros del pedido, no extras)
            if (!libro.esLibroExtra) {
                const cantidadPedida = parseInt(libro.cantidad || 0);
                const cantidadProformada = parseInt(libro.cantidadProformada || 0);
                const cantidadDisponible = cantidadPedida - cantidadProformada;
                
                if (cantidad > cantidadDisponible) {
                    this.$set(libro, 'errorStockMinimo', `⚠️ Supera lo disponible (máx: ${cantidadDisponible})`);
                    if (mostrarNotificaciones) {
                        this.$vs.notify({
                            title: '⚠️ Cantidad No Disponible',
                            text: `Solo hay ${cantidadDisponible} unidades disponibles de este libro en el pedido (Pedido: ${cantidadPedida} - Ya Proformado: ${cantidadProformada})`,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 5000
                        });
                    }
                    return;
                }
            }
            
            const stockDisponible = libro.stock || 0;
            
            if (cantidad > stockDisponible) {
                this.$set(libro, 'errorStockMinimo', `Stock insuficiente (máx: ${stockDisponible})`);
                if (mostrarNotificaciones) {
                    this.$vs.notify({
                        title: '❌ Stock Insuficiente',
                        text: `Solo hay ${stockDisponible} unidades disponibles`,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 4000
                    });
                }
                return;
            }
            
            const stockRestante = stockDisponible - cantidad;
            
            if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                this.$set(libro, 'errorStockMinimo', `🔒 Bloqueo de stock mínimo (${this.stockMinimo}). Restante: ${stockRestante}`);
                
                if (mostrarNotificaciones) {
                    this.mostrarNotificacionStockMinimo(
                        '🔒 Stock Mínimo Protegido',
                        `Stock restante (${stockRestante}) sería menor al mínimo (${this.stockMinimo}). Active el permiso en configuración.`,
                        'danger'
                    );
                }
                return;
            }
            
            this.$set(libro, 'errorStockMinimo', '');
            this.sincronizarCantidadEnRapida(libro);
            this.calcularTotales();
        },
        
        contarLibrosConCantidad() {
            return this.librosPedido.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            ).length;
        },
        
        cerrarModal() {
            this.$emit('cerrar');
            this.$emit('update:visible', false);
        }
    }
}
</script>

<style scoped>
/* Estilos para el popup de proforma */
.popup-proforma {
    z-index: 51001;
}

/* Estilos para el spinner de carga */
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

/* ========================================
   ESTILOS PARA CAPTURA RÁPIDA
   ======================================== */

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

.dropdown-item-first {
    background-color: #edf2f7;
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

.resumen-confirmados {
    background-color: #fafafa;
    padding: 16px;
    border-radius: 4px;
    margin-top: 20px;
    border: 1px solid #e8e8e8;
}

.libro-confirmado-chip {
    background-color: #48bb78;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.libro-confirmado-chip:hover {
    background-color: #f56565;
}

/* Estilos para las tabs */
.vs-tabs {
    margin-bottom: 0;
}

.vs-tabs .vs-tabs--ul {
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 20px;
}

/* Estilos para validaciones de cupo en venta por lista */
.cupo-insuficiente {
    background-color: #fafafa;
    border: 1px solid #f56565;
    color: #f56565;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
}

.cupo-suficiente {
    background-color: #fafafa;
    border: 1px solid #48bb78;
    color: #48bb78;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
}

.sin-cupo-advertencia {
    background-color: #fafafa;
    border: 1px solid #f6ad55;
    color: #f6ad55;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
}

.cupo-insuficiente i,
.cupo-suficiente i,
.sin-cupo-advertencia i {
    margin-right: 5px;
}

.vs-tabs .vs-tabs--li {
    font-weight: 500;
}

.vs-tabs .vs-tabs--li.activeChild {
    border-bottom: 2px solid #5b3cc4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .tabla-captura-container {
        padding: 10px;
    }
    
    .dropdown-item {
        padding: 6px 8px;
        font-size: 11px;
    }
}

/* Barra de totales sticky */
.barra-totales-sticky {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #5b3cc4;
    border-bottom: 2px solid #5b3cc4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: -20px -20px 20px -20px;
}

.contenido-barra-totales {
    padding: 16px 20px;
    background: white;
    border-radius: 0 0 4px 4px;
    margin: 0 16px;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Ajuste para el contenido del popup cuando hay barra sticky */
.popup-proforma .vs-popup--content {
    padding-top: 0 !important;
}

/* Barra de totales sticky compacta */
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

/* Badges simplificados */
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

/* Error de cupo prominente */
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

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
}

/* Responsive design para la barra sticky */
@media (max-width: 768px) {
    .barra-totales-sticky .grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
    }
    
    .contenido-barra-totales {
        padding: 12px 16px;
        margin: 0 8px;
    }
    
    .barra-totales-sticky {
        margin: -20px -10px 15px -10px;
    }
    
    /* Responsive para barra compacta */
    .contenido-barra-compacta {
        padding: 6px 12px;
        margin: 0 8px;
    }
    
    .contenido-barra-compacta .flex {
        flex-direction: column;
        gap: 4px !important;
        align-items: center !important;
    }
    
    .badge-items, .badge-cupo, .badge-total {
        font-size: 10px;
        padding: 3px 6px;
    }
    
    .error-cupo {
        font-size: 9px;
        padding: 2px 4px;
    }
    
    .barra-totales-sticky-compacta {
        margin: -20px -10px 10px -10px;
    }
}

/* Estilos para validación de errores */
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

/* ===================================== */
/* ESTILOS PARA AGREGAR LIBROS EXTRAS - VERSIÓN COMPACTA */
/* ===================================== */

.card-libros-extras-compacta {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    background: #fafafa;
    overflow: hidden;
}

.header-extras-compacto {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
}

.headers-xd {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
}

.body-extras-compacto {
    padding: 12px;
    background: white;
}

.input-wrapper-compacto {
    position: relative;
}

.input-compacto .vs-input--input {
    font-size: 13px !important;
    padding: 6px 12px !important;
    height: 34px !important;
}

.btn-agregar-compacto {
    height: 34px !important;
    font-size: 12px !important;
}

.resultados-busqueda-extra-compacto {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #cbd5e0;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 180px;
    overflow-y: auto;
    z-index: 1000;
    margin-top: -1px;
}

.resultado-item-extra-compacto {
    padding: 8px 10px;
    cursor: pointer;
    border-bottom: 1px solid #e8e8e8;
    transition: background 0.15s ease;
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 8px;
    align-items: center;
    font-size: 12px;
}

.resultado-item-extra-compacto:last-child {
    border-bottom: none;
}

.resultado-item-extra-compacto:hover {
    background: #f7fafc;
}

.resultado-item-activo {
    background: #edf2f7 !important;
    border-left: 2px solid #5b3cc4;
}

.texto-ayuda-teclado-compacto {
    padding: 4px 8px;
    background: #edf2f7;
    border-radius: 4px;
    margin-top: 4px;
}

.texto-ayuda-teclado-compacto small {
    color: #5b3cc4;
    font-size: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.resultado-codigo-compacto {
    font-family: monospace;
    font-weight: bold;
    color: #5b3cc4;
    font-size: 11px;
}

.resultado-nombre-compacto {
    font-size: 11px;
    color: #606c76;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.resultado-precio-compacto {
    font-weight: bold;
    color: #5b3cc4;
    font-size: 11px;
}

.libro-extra-seleccionado-compacto {
    background: #fafafa;
    border: 1px solid #5b3cc4;
    border-radius: 4px;
    padding: 4px 8px;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
}

.libro-codigo-compacto {
    font-family: monospace;
    font-weight: bold;
    color: #5b3cc4;
    font-size: 11px;
}

.libro-stock-badge {
    background: #e8f5e9;
    color: #2e7d32;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    border: 1px solid #4caf50;
}

.libro-stock-badge.badge-danger {
    background: #ffebee;
    color: #c62828;
    border-color: #ef5350;
}

.libro-stock-badge.badge-success {
    background: #e8f5e9;
    color: #2e7d32;
    border-color: #4caf50;
}

.resultado-stock-compacto {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 4px;
    border-radius: 3px;
}

.resultado-stock-compacto.text-danger {
    background: #ffebee;
    color: #c62828;
}

.resultado-stock-compacto.text-success {
    background: #e8f5e9;
    color: #2e7d32;
}

/* Responsive para versión compacta */
@media (max-width: 768px) {
    .body-extras-compacto {
        padding: 8px;
    }
    
    .resultados-busqueda-extra-compacto {
        max-height: 150px;
    }
    
    .resultado-item-extra-compacto {
        grid-template-columns: 70px 1fr auto;
        gap: 6px;
        padding: 5px 8px;
        font-size: 10px;
    }
    
    .resultado-codigo-compacto,
    .resultado-nombre-compacto,
    .resultado-precio-compacto {
        font-size: 10px;
    }
}

/* Mantener estilos antiguos por compatibilidad pero ocultos */
.card-libros-extras {
    display: none;
}

.agregar-libro-container {
    display: none;
}

@media (min-width: 768px) {
    .md\:col-span-3 {
        grid-column: span 3 / span 3;
    }
    
    .md\:col-span-6 {
        grid-column: span 6 / span 6;
    }
    
    .md\:col-span-12 {
        grid-column: span 12 / span 12;
    }
}

.grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr));
}

.items-end {
    align-items: flex-end;
}

.gap-3 {
    gap: 0.75rem;
}

.bg-blue-50 {
    background-color: #eff6ff;
}

.text-success {
    color: #48bb78;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.mt-0\.5 {
    margin-top: 0.125rem;
}

/* Estilos para libros extras */
.libro-extra-badge {
    font-size: 10px;
    padding: 2px 6px;
    font-weight: bold;
}

.libro-extra-badge:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

/* Estilos para inputs con error de stock */
.input-error-stock >>> input {
    border: 2px solid #ff4757 !important;
    background-color: #fff5f5 !important;
    animation: shake 0.5s;
}

/* Animación de shake para campos con error */
.shake-error {
    animation: shake 0.6s;
    border: 2px solid #ff4757 !important;
    box-shadow: 0 0 10px rgba(255, 71, 87, 0.5) !important;
}

/* ===================================== */
/* ESTILOS PARA COMPARACIÓN DE CANTIDADES */
/* ===================================== */

/* Cantidad igual a lo disponible - Verde */
.cantidad-igual >>> input {
    border: 2px solid #48bb78 !important;
    background-color: #f0fff4 !important;
}

/* Cantidad menor a lo disponible - Naranja/Amarillo */
.cantidad-menor >>> input {
    border: 2px solid #f6ad55 !important;
    background-color: #fffaf0 !important;
}

/* Cantidad mayor a lo disponible - Azul */
.cantidad-mayor >>> input {
    border: 2px solid #4299e1 !important;
    background-color: #ebf8ff !important;
}

/* ===================================== */
/* ESTILOS PARA FORMULARIO EDITAR CUPO */
/* ===================================== */

.formulario-cupo-inline {
    background: white;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.formulario-cupo-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #5b3cc4;
}

.formulario-cupo-header h4 {
    color: #2c3e50;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 0;
}

.formulario-cupo-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;
}

.form-group-cupo {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label-cupo {
    font-size: 13px;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
}

.institucion-display-cupo {
    background: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 10px;
}

.institucion-display-cupo span {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
}

.institucion-display-cupo small {
    display: block;
    font-size: 12px;
    color: #606c76;
}

.formulario-cupo-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid #e8e8e8;
}

/* Estilos para el modal de editar institución */
.popup-editar-institucion .vs-popup {
    max-width: 600px;
}

.popup-editar-institucion .vx-card {
    box-shadow: none;
    border: none;
}

.lugar-btn-editar,
.lugar-btn-editar-inst,
.cliente-btn-editar {
    min-width: 110px;
}

.lugar-btn-editar-inst {
    min-width: 90px;
}

.cliente-btn-editar {
    min-width: 90px;
}

/* Estilos para sección de lugar de despacho */
.lugar-display {
    background: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 14px;
}

.lugar-titulo {
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
}

.lugar-cedula {
    font-size: 12px;
    color: #606c76;
    margin-bottom: 2px;
}

.lugar-email {
    font-size: 11px;
    color: #606c76;
    font-style: italic;
}

.lugar-btn-cambiar {
    margin-left: 10px;
}

.lugar-buscar {
    background: #fafafa;
    border: 1px dashed #cbd5e0;
    border-radius: 6px;
    padding: 14px;
    text-align: center;
    cursor: pointer;
}

.lugar-buscar:hover {
    border-color: #5b3cc4;
    background: #f7fafc;
}

.lugar-buscar-disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}

.lugar-buscar-texto {
    font-weight: 500;
    color: #606c76;
    font-size: 13px;
}

/* Estilos para sección de cliente */
.cliente-display {
    background: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 14px;
}

.cliente-titulo {
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
}

.cliente-cedula {
    font-size: 12px;
    color: #606c76;
    margin-bottom: 2px;
}

.cliente-email {
    font-size: 11px;
    color: #606c76;
    font-style: italic;
}

.cliente-btn-cambiar {
    margin-left: 10px;
}

.cliente-buscar {
    background: #fafafa;
    border: 1px dashed #cbd5e0;
    border-radius: 6px;
    padding: 14px;
    text-align: center;
    cursor: pointer;
}

.cliente-buscar:hover {
    border-color: #5b3cc4;
    background: #f7fafc;
}

.cliente-buscar-disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
    pointer-events: none;
}

.cliente-buscar-texto {
    font-weight: 500;
    color: #606c76;
    font-size: 13px;
}

/* Estilos generales */
.vx-card {
    margin-bottom: 1rem;
}

.text-orange-600 {
    color: #d97706;
}

.border {
    border: 1px solid #e2e8f0;
}

.border-orange-300 {
    border-color: #fdba74;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.bg-orange-50 {
    background-color: #fff7ed;
}

.border-blue-300 {
    border-color: #93c5fd;
}

.text-blue-600 {
    color: #2563eb;
}

.text-blue-700 {
    color: #1d4ed8;
}

.grid {
    display: grid;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-4 {
    gap: 1rem;
}

@media (min-width: 768px) {
    .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .formulario-cupo-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .formulario-cupo-actions {
        flex-direction: column;
    }
    
    .formulario-cupo-actions .vs-button {
        width: 100%;
    }
    
    .lugar-btn-editar,
    .lugar-btn-editar-inst,
    .lugar-btn-cambiar,
    .cliente-btn-editar,
    .cliente-btn-cambiar {
        min-width: auto;
        flex: 1;
    }
}
</style>
