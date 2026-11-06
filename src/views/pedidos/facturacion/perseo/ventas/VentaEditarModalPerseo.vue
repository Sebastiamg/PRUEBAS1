<template>
    <vs-popup-history
        fullscreen
        :title="`Editar Venta - Perseo - ${ventaData.ven_codigo || 'Cargando...'}`"
        :active.sync="popupEditar"
        @close="cerrarModal"
        :confirm-close="true"
        confirm-message="¿Estás seguro de cerrar la edición de la venta? Los cambios no guardados se perderán."
        class="popup-venta"
    >
        <div v-if="popupEditar && ventaId" id="div-with-loading">
            <!-- Loading mientras carga los datos -->
            <div v-if="loadingDatos" class="text-center py-12">
                <div class="loading-spinner mb-4">
                    <div class="spinner"></div>
                </div>
                <p class="text-gray-600 text-lg">Cargando datos de la venta...</p>
            </div>
            
            <!-- Contenido del editor cuando ya cargó -->
            <div v-else>
                
                <!-- Barra de totales anclada (sticky) - Versión ultra compacta -->
                <div v-if="calcularTotalesUnificados().cantidadLibros > 0" class="barra-totales-sticky-compacta" >
                    <div class="contenido-barra-compacta" :class="debeMostrarCupo && (nuevoLugarDespacho || lugarDespacho.nombreInstitucion) && !tieneCupoSuficiente ? 'barra-error' : 'barra-normal'">
                        <!-- Para venta por lista con cupo (solo primera venta) -->
                        <div v-if="debeMostrarCupo && (nuevoLugarDespacho || lugarDespacho.nombreInstitucion)" class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="badge-items">
                                    <feather-icon icon="BookOpenIcon" size="10" class="inline mr-1"></feather-icon>
                                    {{ calcularTotalesUnificados().cantidadLibros }} items
                                </span>
                                <span class="badge-cupo" :class="!tieneCupoSuficiente ? 'badge-error' : 'badge-success'">
                                    <feather-icon icon="CreditCardIcon" size="10" class="inline mr-1"></feather-icon>
                                    Cupo: ${{ obtenerCupoMaximo }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span v-if="!tieneCupoSuficiente" class="error-cupo">
                                    <feather-icon icon="AlertTriangleIcon" size="10" class="inline mr-1"></feather-icon>
                                    ¡CUPO SUPERADO!
                                </span>
                                <span class="badge-total" :class="!tieneCupoSuficiente ? 'badge-error' : 'badge-success'">
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
                                <strong>Contrato:</strong> {{ ventaData.contrato }}
                            </div>
                            <div class="col-auto">
                                <strong>Código Venta:</strong> <span class="text-primary font-bold">{{ ventaData.ven_codigo }}</span>
                            </div>
                            <div class="col-auto flex">
                                <strong>Estado:</strong> 
                                <vs-chip :color="getEstadoColor(ventaData.est_ven_codigo)" size="small">
                                    {{ getEstadoTexto(ventaData.est_ven_codigo) }}
                                </vs-chip>
                            </div>
                            <div class="col-auto">
                                <strong>Creado:</strong> {{ ventaData.ven_fecha }}
                            </div>
                        </div>
                    </div>
                </vx-card>

                <!-- Selección de Empresa -->
                <vx-card class="mb-4">
                    
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
                                            <div class="text-sm text-gray-600" v-if="lugarDespacho.ruc">
                                                {{ 'RUC: ' + lugarDespacho.ruc }}
                                            </div>
                                            
                                            <!-- Resumen visual del lugar de despacho actual -->
                                            <div v-if="lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion.length > 0" class="resumen-lugar-despacho mt-2">
                                                <div>
                                                    <strong>Promoción:</strong> {{ lugarDespacho.datosInstitucion[0].ffp_credito }}
                                                </div>
                                                <div>
                                                    <strong>Cupo:</strong> {{ lugarDespacho.datosInstitucion[0].ffp_cupo }}
                                                </div>
                                                <div>
                                                    <strong>Descuento:</strong> {{ lugarDespacho.datosInstitucion[0].ffp_descuento }}%
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
                                                v-if="debeMostrarCupo && !nuevoLugarDespacho"
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
                                <div v-if="debeMostrarCupo && showFormularioCupoActual && !nuevoLugarDespacho" class="formulario-cupo-inline mt-3">
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
                                                Promoción ventas
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
                                                Cupo
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
                                            <div class="lugar-ciudad" v-if="nuevoLugarDespacho.ruc">
                                                {{ 'RUC: ' + nuevoLugarDespacho.ruc }}
                                            </div>
                                            
                                            <!-- Resumen visual del nuevo lugar de despacho -->
                                            <div v-if="nuevoLugarDespacho.datosInstitucion && nuevoLugarDespacho.datosInstitucion.length > 0" class="lugar-financiero" style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                                                <div class="resumen-lugar-despacho">
                                                    <div>
                                                        <strong>Promoción:</strong> {{ nuevoLugarDespacho.datosInstitucion[0].ffp_credito }}
                                                    </div>
                                                    <div>
                                                        <strong>Cupo:</strong> {{ nuevoLugarDespacho.datosInstitucion[0].ffp_cupo }}
                                                    </div>
                                                    <div>
                                                        <strong>Descuento:</strong> {{ nuevoLugarDespacho.datosInstitucion[0].ffp_descuento }}%
                                                    </div>
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
                                            
                                            <!-- Botón para CONFIGURAR cupo si NO existe (solo primera venta + venta por lista) -->
                                            <div v-else-if="debeMostrarCupo" class="lugar-sin-cupo" style="margin-top: 12px;">
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
                                
                                <!-- Formulario inline para editar/crear cupo (solo primera venta + venta por lista) -->
                                <div v-if="debeMostrarCupo && showFormularioCupo && nuevoLugarDespacho" class="formulario-cupo-inline mt-3">
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
                                                Promoción ventas
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
                                                Cupo
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
                            Gestión de Libros para venta - Perseo
                        </h4>
                    </template>
                    
                    <!-- ============================================ -->
                    <!-- TABLA ÚNICA DE VENTA - Funcionalidad Agregar/Editar/Eliminar -->
                    <!-- ============================================ -->
                    <div v-if="!loadingStock" class="mb-6">
                        <div class="descuentos-linea-row mb-2">
                            <div class="descuento-linea-item">
                                <label class="headers-form mb-1 block">Descuento Prolipa (%)</label>
                                <vs-input
                                    type="number"
                                    v-model="descuentoLineaProlipa"
                                    @keypress="soloNumeros($event)"
                                    @blur="normalizarDescuentoPorLinea('prolipa')"
                                    min="0"
                                    max="100"
                                    step="1"
                                    class="input-compact descuento-linea-input"
                                />
                            </div>
                            <div class="descuento-linea-item">
                                <label class="headers-form mb-1 block">Descuento Iluminar (%)</label>
                                <vs-input
                                    type="number"
                                    v-model="descuentoLineaIluminar"
                                    @keypress="soloNumeros($event)"
                                    @blur="normalizarDescuentoPorLinea('iluminar')"
                                    min="0"
                                    max="100"
                                    step="1"
                                    class="input-compact descuento-linea-input"
                                />
                            </div>
                        </div>

                        <div class="tabla-captura-container">
                            <div class="tabla-header">
                                <div class="flex items-center gap-2">
                                    <vs-chip color="success">
                                        <feather-icon icon="BookOpenIcon" size="12" class="mr-1"></feather-icon>
                                        {{ contarLibrosConCantidad() }} libros en la venta
                                    </vs-chip>
                                    <vs-chip color="primary" size="small">
                                        <feather-icon icon="PackageIcon" size="12" class="mr-1"></feather-icon>
                                        {{ librosPedido.length }} libros disponibles en pedido
                                    </vs-chip>
                                </div>
                                <vs-button 
                                    v-if="hayLibrosDisponiblesParaAgregar"
                                    @click="agregarFilaCaptura" 
                                    color="success" 
                                    size="small"
                                    type="flat"
                                    icon="icon-plus"
                                    icon-pack="feather"
                                >
                                    Agregar Libro
                                </vs-button>
                            </div>
                                    
                            <vs-table :data="filasCapturaSeguras">
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
                                            Cant. Pedida
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="CheckCircleIcon" size="14" class="mr-1"></feather-icon>
                                            Ya Vendido
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="ShoppingCartIcon" size="14" class="mr-1"></feather-icon>
                                            Stock
                                        </span>
                                    </vs-th>
                                    <vs-th v-if="esPrefacturaEditar()" style="width: 80px;">
                                        <span class="headers-form">
                                            <feather-icon icon="ServerIcon" size="14" class="mr-1"></feather-icon>
                                            St.Perseo
                                        </span>
                                    </vs-th>
                                    <vs-th style="width: 90px;">
                                        <span class="headers-form">
                                            <feather-icon icon="PercentIcon" size="14" class="mr-1"></feather-icon>
                                            Desc
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
                                            <feather-icon icon="GitCommitIcon" size="14" class="mr-1"></feather-icon>
                                            Cambio
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
                                                <!-- v-select para seleccionar libros del pedido -->
                                                <v-select
                                                    v-if="!fila.libroSeleccionado && !fila.consultandoStock"
                                                    :ref="`select-libro-${index}`"
                                                    :options="librosDisponiblesParaFila(index)"
                                                    label="nombre_libro"
                                                    :filterable="true"
                                                    :filter="filtrarLibros"
                                                    placeholder="Buscar libro por código o nombre..."
                                                    @input="seleccionarLibroDesdeSelect(fila, $event, index)"
                                                    @keydown.delete.native="manejarBackspaceSelect(fila, index, $event)"
                                                    @keydown.backspace.native="manejarBackspaceSelect(fila, index, $event)"
                                                    :reduce="libro => libro"
                                                    :append-to-body="true"
                                                    class="w-full select-libro-venta"
                                                >
                                                    <template v-slot:option="option">
                                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                                                            <div style="flex: 1;">
                                                                <strong style="color: #5b3cc4;">{{ option.pro_codigo }}</strong> -
                                                                <span style="color: #000000; margin-left: 8px;">{{ option.nombre_libro }}</span>
                                                            </div>
                                                            <span
                                                                v-if="obtenerEtiquetaLineaProducto(option)"
                                                                class="linea-producto-tag"
                                                                :class="obtenerClaseLineaProducto(option)"
                                                            >
                                                                {{ obtenerEtiquetaLineaProducto(option) }}
                                                            </span>
                                                        </div>
                                                    </template>
                                                    <template v-slot:selected-option="option">
                                                        <strong>{{ option.pro_codigo }}</strong> - {{ option.nombre_libro }}
                                                        <span
                                                            v-if="obtenerEtiquetaLineaProducto(option)"
                                                            class="linea-producto-tag"
                                                            :class="obtenerClaseLineaProducto(option)"
                                                        >
                                                            {{ obtenerEtiquetaLineaProducto(option) }}
                                                        </span>
                                                    </template>
                                                    <template v-slot:no-options>
                                                        <span v-if="librosDisponiblesParaFila(index).length === 0" style="color: #999;">No hay libros disponibles para esta fila</span>
                                                        <span v-else style="color: #999;">Escribe para buscar...</span>
                                                    </template>
                                                </v-select>
                                                
                                                <!-- Input readonly cuando ya tiene libro seleccionado -->
                                                <vs-input 
                                                    v-else-if="fila.libroSeleccionado"
                                                    :id="`input-busqueda-${index}`"
                                                    v-model="fila.textoBusqueda"
                                                    @keydown.backspace="manejarBorradoBusqueda(fila, index, $event)"
                                                    :class="fila.libroSeleccionado ? 'libro-encontrado' : ''"
                                                    :placeholder="obtenerPlaceholder(fila)"
                                                    :readonly="true"
                                                    autocomplete="off"
                                                    class="w-full"
                                                />
                                                
                                                <!-- Indicador de consultando stock -->
                                                <div v-if="fila.consultandoStock" style="margin-top: 5px; font-size: 11px; color: #5b3cc4;" class="headers-form">
                                                    <div class="loading-spinner-small" style="display: inline-block; width: 12px; height: 12px; margin-right: 5px;"></div>
                                                    <strong>Consultando stock del sistema...</strong>
                                                </div>
                                                
                                                <!-- Libro seleccionado con código -->
                                                <div v-else-if="fila.libroSeleccionado" style="margin-top: 5px; font-size: 11px; color: #48bb78;" class="headers-form">
                                                    <feather-icon icon="CheckCircleIcon" size="12"></feather-icon>
                                                    <strong>{{ fila.libroSeleccionado.pro_codigo }}</strong> 
                                                    <span style="color: #666;">| {{ fila.libroSeleccionado.nombre_libro }}</span>
                                                        <span
                                                            v-if="obtenerEtiquetaLineaProducto(fila.libroSeleccionado)"
                                                            class="linea-producto-tag"
                                                            :class="obtenerClaseLineaProducto(fila.libroSeleccionado)"
                                                        >
                                                            {{ obtenerEtiquetaLineaProducto(fila.libroSeleccionado) }}
                                                        </span>
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
                                        
                                        <!-- Cantidad Pedida -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado && fila.libroSeleccionado.cantidad !== undefined"
                                                color="dark" 
                                                size="small"
                                            >
                                                {{ fila.libroSeleccionado.cantidad || 0 }}
                                            </vs-chip>
                                            <vs-chip 
                                                v-else-if="fila.libroSeleccionado"
                                                color="warning" 
                                                size="small"
                                                title="Libro nuevo - sin cantidad pedida"
                                            >
                                                ➕ Nuevo
                                            </vs-chip>
                                            <span v-else style="color: #ccc;">-</span>
                                        </vs-td>
                                        
                                        <!-- Ya Vendido (otras ventas, excluyendo la actual) -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado && fila.libroSeleccionado.cantidadVendida !== undefined"
                                                :color="(fila.libroSeleccionado.cantidadVendida || 0) > 0 ? 'success' : 'dark'" 
                                                size="small"
                                            >
                                                {{ fila.libroSeleccionado.cantidadVendida || 0 }}
                                            </vs-chip>
                                            <vs-chip 
                                                v-else-if="fila.libroSeleccionado"
                                                color="dark" 
                                                size="small"
                                            >
                                                0
                                            </vs-chip>
                                            <span v-else style="color: #ccc;">-</span>
                                        </vs-td>
                                        
                                        <!-- Stock disponible -->
                                        <vs-td>
                                            <!-- Consultando stock simple -->
                                            <div v-if="fila.consultandoStock" style="display: flex; align-items: center; gap: 5px;">
                                                <div class="loading-spinner-small"></div>
                                                <small style="color: #666;">Consultando...</small>
                                            </div>
                                            <!-- Combo: consultando con cantidad -->
                                            <div v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.consultandoStockCombo" style="display: flex; align-items: center; gap: 5px;">
                                                <div class="loading-spinner-small"></div>
                                                <small style="color: #5b3cc4; font-size: 10px;">verificando...</small>
                                            </div>
                                            <!-- Combo: sin cantidad ingresada aún -->
                                            <span v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock === null" style="color: #aaa; font-size: 13px;" title="Ingresa la cantidad para verificar disponibilidad">—</span>
                                            <!-- Combo: resultado ✅ -->
                                            <vx-tooltip v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.puede_vender === true" text="Todos los componentes disponibles" position="top">
                                                <span style="font-size: 18px; cursor: default;">✅</span>
                                            </vx-tooltip>
                                            <!-- Combo: resultado ❌ -->
                                            <vx-tooltip v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.puede_vender === false" :text="fila.libroSeleccionado.mensaje_stock_combo || 'Stock insuficiente en componentes'" position="top">
                                                <span style="font-size: 18px; cursor: default;">❌</span>
                                            </vx-tooltip>
                                            <!-- Producto simple: prefactura → mostrar stock_plataforma (ya incluye cantidadOriginal) -->
                                            <vx-tooltip
                                                v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock !== undefined && fila.libroSeleccionado.stock !== null && esPrefacturaEditar()"
                                                :text="'Plataforma: ' + (fila.libroSeleccionado.stock_plataforma || fila.libroSeleccionado.stock) + ' | Perseo: ' + (fila.libroSeleccionado.stock_perseo != null ? fila.libroSeleccionado.stock_perseo : '-') + ' | Límite: ' + fila.libroSeleccionado.stock"
                                                position="top"
                                            >
                                                <vs-chip
                                                    :color="(fila.libroSeleccionado.stock_plataforma || fila.libroSeleccionado.stock) > 0 ? 'success' : 'danger'"
                                                    size="small"
                                                    class="font-bold"
                                                >
                                                    {{ fila.libroSeleccionado.stock_plataforma != null ? fila.libroSeleccionado.stock_plataforma : fila.libroSeleccionado.stock }}
                                                </vs-chip>
                                            </vx-tooltip>
                                            <!-- Producto simple: otros tipos → comportamiento anterior -->
                                            <vx-tooltip
                                                v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock !== undefined && fila.libroSeleccionado.stock !== null"
                                                :text="'Stock real: ' + fila.libroSeleccionado.stock + ' + esta venta: ' + (fila.cantidadOriginal || 0) + ' = ' + ((fila.libroSeleccionado.stock || 0) + (fila.cantidadOriginal || 0)) + ' disponibles'"
                                                position="top"
                                            >
                                                <vs-chip
                                                    :color="((fila.libroSeleccionado.stock || 0) + (fila.cantidadOriginal || 0)) > 0 ? 'success' : 'danger'"
                                                    size="small"
                                                    class="font-bold"
                                                >
                                                    {{ (fila.libroSeleccionado.stock || 0) + (fila.cantidadOriginal || 0) }}
                                                </vs-chip>
                                            </vx-tooltip>
                                            <span v-else style="color: #ccc;">-</span>
                                            <!-- Componentes del combo que no alcanzan en plataforma -->
                                            <div v-if="componentesFaltantesStock(fila, 'plataforma').length > 0" class="stock-faltantes-mini">
                                                <vx-tooltip
                                                    v-for="comp in componentesFaltantesStock(fila, 'plataforma')"
                                                    :key="'plat-' + comp.pro_codigo"
                                                    :text="tooltipComponenteFaltante(comp, 'plataforma')"
                                                    position="top"
                                                >
                                                    <div class="stock-faltante-item">
                                                        <span class="stock-faltante-codigo">{{ comp.pro_codigo }}</span>
                                                        <span class="stock-faltante-cantidad">-{{ comp.faltante }}</span>
                                                    </div>
                                                </vx-tooltip>
                                            </div>
                                        </vs-td>

                                        <!-- Columna St.Perseo (solo prefactura) -->
                                        <vs-td v-if="esPrefacturaEditar()">
                                            <div v-if="fila.consultandoStock" style="display: flex; align-items: center; gap: 5px;">
                                                <div class="loading-spinner-small"></div>
                                                <small style="color: #666;">...</small>
                                            </div>
                                            <span v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock === null" style="color: #aaa; font-size: 13px;">—</span>
                                            <vx-tooltip
                                                v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock_perseo != null"
                                                :text="'Stock en Perseo: ' + fila.libroSeleccionado.stock_perseo"
                                                position="top"
                                            >
                                                <vs-chip
                                                    :color="fila.libroSeleccionado.stock_perseo > 0 ? 'success' : 'danger'"
                                                    size="small"
                                                    class="font-bold"
                                                >
                                                    {{ fila.libroSeleccionado.stock_perseo }}
                                                </vs-chip>
                                            </vx-tooltip>
                                            <span v-else style="color: #ccc; font-size: 11px;">-</span>
                                            <!-- Componentes del combo que no alcanzan en Perseo -->
                                            <div v-if="componentesFaltantesStock(fila, 'perseo').length > 0" class="stock-faltantes-mini">
                                                <vx-tooltip
                                                    v-for="comp in componentesFaltantesStock(fila, 'perseo')"
                                                    :key="'perseo-' + comp.pro_codigo"
                                                    :text="tooltipComponenteFaltante(comp, 'perseo')"
                                                    position="top"
                                                >
                                                    <div class="stock-faltante-item">
                                                        <span class="stock-faltante-codigo">{{ comp.pro_codigo }}</span>
                                                        <span class="stock-faltante-cantidad">-{{ comp.faltante }}</span>
                                                    </div>
                                                </vx-tooltip>
                                            </div>
                                        </vs-td>

                                        <vs-td>
                                            <vs-input 
                                                v-model="fila.descuento"
                                                @input="validarDescuento(fila)"
                                                @blur="normalizarDescuentoFila(fila)"
                                                @keyup.enter="avanzarAlSiguienteLibro(index)"
                                                @keypress="soloNumeros($event)"
                                                type="text"
                                                inputmode="numeric"
                                                style="width: 70px;"
                                                :disabled="!fila.libroSeleccionado || fila.consultandoStock"
                                                :ref="`descuento-${index}`"
                                                class="w-full"
                                                placeholder="0"
                                            />
                                            <small v-if="fila.errorDescuento" class="text-danger text-xs block mt-1">
                                                {{ fila.errorDescuento }}
                                            </small>
                                        </vs-td>
                                        
                                        <!-- Input de cantidad -->
                                        <vs-td>
                                            <vs-input 
                                                v-model="fila.cantidad"
                                                @input="validarYSincronizarCantidad(fila, index)"
                                                @keyup.enter="avanzarAlSiguienteLibro(index)"
                                                @keydown.delete="manejarBorradoCantidad(fila, index)"
                                                @keydown.backspace="manejarBorradoCantidad(fila, index)"
                                                @keypress="soloNumeros($event)"
                                                @blur="validarCantidadFinal(fila, index)"
                                                type="number"
                                                min="1"
                                                :max="fila.libroSeleccionado ? fila.libroSeleccionado.stock : 999"
                                                style="width: 80px;"
                                                :disabled="!fila.libroSeleccionado || fila.consultandoStock"
                                                :ref="`cantidad-${index}`"
                                                :class="fila.errorCantidad ? 'cantidad-error' : ''"
                                                class="w-full"
                                            />
                                            <small v-if="fila.errorCantidad && !(fila.libroSeleccionado && fila.libroSeleccionado.stock_combo_componentes && fila.libroSeleccionado.stock_combo_componentes.length > 0 && fila.libroSeleccionado.puede_vender === false)" class="text-danger text-xs block mt-1">
                                                {{ fila.errorCantidad }}
                                            </small>
                                            <!-- Mini tabla colapsable de faltantes para combos -->
                                            <!-- Solo el aviso: el detalle por producto va debajo de cada columna de stock -->
                                            <div v-if="fila.libroSeleccionado && fila.libroSeleccionado.stock_combo_componentes && fila.libroSeleccionado.stock_combo_componentes.length > 0 && fila.libroSeleccionado.puede_vender === false" class="combo-faltantes-tabla mt-1">
                                                <div class="combo-faltantes-header">
                                                    <i class="fas fa-exclamation-triangle" style="color:#EA5455; font-size:10px;"></i>
                                                    <span>Stock insuficiente</span>
                                                </div>
                                            </div>
                                        </vs-td>
                                        
                                        <!-- Cambio (diferencia entre nueva y original) -->
                                        <vs-td>
                                            <vs-chip 
                                                v-if="fila.libroSeleccionado && fila.cantidadOriginal !== undefined"
                                                :color="obtenerColorCambio(parseInt(fila.cantidad || 0) - fila.cantidadOriginal)" 
                                                size="small"
                                                class="font-bold"
                                            >
                                                {{ calcularCambio(fila) }}
                                            </vs-chip>
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
                        <p class="mt-2 text-gray-600">Consultando stock disponible...</p>
                        
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
                    
                    <!-- Resumen de Totales de la venta (siempre visible) -->
                    <div class="mt-6 p-4 bg-white rounded-lg border border-gray-300">
                        <div v-if="calcularTotalesUnificados().cantidadLibros > 0">
                            <!-- Grid de 3 columnas -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                            {{ datosOriginales ? (datosOriginales.ventaData.ven_observacion || 'Sin observación') : 'Cargando...' }}
                                        </div>
                                    </div>
                                    
                                    <!-- Textarea para CAMBIAR observación -->
                                    <div class="mb-2">
                                        <label class="text-xs text-gray-600 mb-1 block">Cambiar a:</label>
                                        <vs-textarea
                                            placeholder="Escriba alguna observación para la venta (máximo 200 caracteres)..."
                                            v-model="ventaData.ven_observacion"
                                            :counter="200"
                                            counter-danger
                                            class="w-full"
                                        />
                                        <div class="text-right text-xs mt-1">
                                            <span :class="{'text-danger': ventaData.ven_observacion && ventaData.ven_observacion.length > 200, 'text-gray-500': !ventaData.ven_observacion || ventaData.ven_observacion.length <= 200}">
                                                {{ (ventaData.ven_observacion || '').length }}/200 caracteres
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
                                
                                <!-- Columna 2: Concepto Perseo -->
                                <div>
                                    <label class="font-bold text-sm mb-2 block text-gray-700">
                                        <feather-icon icon="FileTextIcon" svgClasses="w-4 h-4 inline mr-1"></feather-icon>
                                        Concepto Perseo
                                        <span class="text-danger">*</span>
                                    </label>
                                    
                                    <!-- Concepto ACTUAL (solo lectura) -->
                                    <div class="p-2 bg-gray-50 rounded border mb-2">
                                        <div class="text-xs text-gray-500 mb-1">ACTUAL:</div>
                                        <div class="text-success text-sm">
                                            <i class="fas fa-tag mr-1"></i>
                                            {{ datosOriginales ? (datosOriginales.ventaData.concepto_perseo || 'Sin concepto') : 'Cargando...' }}
                                        </div>
                                    </div>
                                    
                                    <!-- Textarea para CAMBIAR concepto -->
                                    <div class="mb-2">
                                        <label class="text-xs text-gray-600 mb-1 block">Cambiar a:</label>
                                        <vs-textarea
                                            placeholder="Escriba el concepto para Perseo (máximo 200 caracteres)..."
                                            v-model="ventaData.concepto_perseo"
                                            :counter="200"
                                            counter-danger
                                            class="w-full"
                                        />
                                        <div class="text-right text-xs mt-1">
                                            <span :class="{'text-danger': ventaData.concepto_perseo && ventaData.concepto_perseo.length > 200, 'text-gray-500': !ventaData.concepto_perseo || ventaData.concepto_perseo.length <= 200}">
                                                {{ (ventaData.concepto_perseo || '').length }}/200 caracteres
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Mensaje si cambió el concepto -->
                                    <div v-if="conceptoCambiado" class="p-2 bg-blue-50 rounded border border-blue-300">
                                        <div class="text-xs text-blue-600 font-bold">
                                            <i class="fas fa-info-circle mr-1"></i>
                                            Concepto modificado
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Columna 3: Totales -->
                                <div class="flex flex-col items-end space-y-1 text-sm font-bold text-gray-800">
                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">Subtotal $:</label>
                                        <span>{{ calcularTotalesUnificados().subtotal.toFixed(2) }}</span>
                                    </div>

                                    <div class="flex justify-end w-full">
                                        <label class="mr-2">Descuento por items $:</label>
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
            :id-periodo="idPeriodo"
            @lugar-seleccionado="seleccionarNuevoDespacho"
            @cerrar="cerrarBusquedaDespacho"
            style="z-index: 52000 !important;"
        />
        
        <BusquedaClientePerseo
            :visible.sync="mostrarBusquedaCliente"
            :empresa="ventaData.id_empresa"
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
                        Esto puede ocurrir cuando otro usuario está generando ventas simultáneamente. 
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
    name: 'VentaEditarModalPerseo',
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
        ventaId: {
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
        periodoSelect: {
            type: Object,
            required: false,
            default: () => ({})
        },
        cantidadVentasContrato: {
            type: Number,
            default: 1
        },
        lineaSeleccionada: {
            type: [Number, String],
            required: false,
            default: null
        }
    },
    data() {
        return {
            popupEditar: this.visible,
            loadingDatos: false,
            loadingStock: false,
            filtrarSoloConCantidad: true,
            descuentoLineaProlipa: 0,
            descuentoLineaIluminar: 0,
            comboFaltantesExpandidos: {},
            
            // Progreso de consulta de stock
            progresoStock: {
                actual: 0,
                total: 0,
                mostrando: false
            },
            
            popupStockInsuficiente: false,
            productosStockInsuficiente: [],
            
            ventaData: {
                id: null,
                ven_codigo: '',
                id_empresa: null,
                ven_descuento: 0,
                ven_observacion: '',
                concepto_perseo: '',
                ven_valor: 0,
                est_ven_codigo: 2,
                contrato: '',
                ven_fecha: '',
                usu_codigo: null,
                pedido_id: null,
                id_periodo: null,
                id_ins_depacho: null,
                ven_cliente: null,
                ruc_cliente: '',
                clientesidPerseo: null,
                idtipodoc: null
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
            
            detallesVenta: [],
            datosOriginales: null,
            esPrimeraVenta: false,
            ventasActivasInstitucion: null,
            esVentaObsequios: false,
            
            // Tracking de reservas originales para calcular diferencias
            reservasOriginales: {},
            
            // Para agregar nuevas filas de captura
            filasCaptura: [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    descuento: '0',
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    consultandoStock: false,
                    stockError: false,
                    errorDescuento: ''
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
            if (newVal && this.ventaId) {
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
        },
        // Sincronizar librosPedido con librosConStock para captura rápida
        librosPedido: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.librosConStock = [...newVal];

                    if (this.popupEditar && this.esVentaDirecta()) {
                        this.aplicarDescuentosContratoVentaDirectaEdicion();
                    }
                    
                    // Sincronizar cantidades pedidas si ya hay filas cargadas
                    this.$nextTick(() => {
                        this.sincronizarCantidadesPedidas();
                    });
                }
            },
            immediate: true,
            deep: true
        },
        pedidoSeleccionado: {
            handler() {
                if (this.popupEditar && this.esVentaDirecta()) {
                    this.aplicarDescuentosContratoVentaDirectaEdicion();
                }
            },
            deep: true
        }
    },
    computed: {
        hayLibrosDisponiblesParaAgregar() {
            return this.librosDisponiblesParaFila(-1).length > 0;
        },
        filasCapturaSeguras() {
            return this.filasCaptura && Array.isArray(this.filasCaptura) ? this.filasCaptura : [];
        },
        // Obtener ID del periodo de forma segura
        idPeriodo() {
            if (this.periodoSelect && this.periodoSelect.idperiodoescolar) {
                return this.periodoSelect.idperiodoescolar;
            }
            if (this.ventaData && this.ventaData.id_periodo) {
                return this.ventaData.id_periodo;
            }
            if (this.pedidoSeleccionado && this.pedidoSeleccionado.id_periodo) {
                return this.pedidoSeleccionado.id_periodo;
            }
            return 0;
        },
        
        librosConStockFiltrados() {
            if (this.filtrarSoloConCantidad) {
                return this.librosPedido.filter(libro => 
                    libro.cantidadVenta && parseInt(libro.cantidadVenta) > 0
                );
            }
            return this.librosPedido;
        },
        
        empresaCambiada() {
            if (!this.datosOriginales) return false;
            return this.ventaData.id_empresa !== this.datosOriginales.ventaData.id_empresa;
        },
        
        descuentoCambiado() {
            if (!this.datosOriginales) return false;
            return parseFloat(this.ventaData.ven_descuento || 0) !== parseFloat(this.datosOriginales.ventaData.ven_descuento || 0);
        },
        
        observacionCambiada() {
            if (!this.datosOriginales) return false;
            const obsActual = (this.ventaData.ven_observacion || '').trim();
            const obsOriginal = (this.datosOriginales.ventaData.ven_observacion || '').trim();
            return obsActual !== obsOriginal;
        },
        
        conceptoCambiado() {
            if (!this.datosOriginales) return false;
            const conceptoActual = (this.ventaData.concepto_perseo || '').trim();
            const conceptoOriginal = (this.datosOriginales.ventaData.concepto_perseo || '').trim();
            return conceptoActual !== conceptoOriginal;
        },
        
        empresaActual() {
            if (!this.datosOriginales) {
                return { id: null, nombre: 'Cargando...' };
            }
            
            const empresaId = this.datosOriginales.ventaData.id_empresa;
            const empresa = this.listaEmpresas.find(e => e.id === empresaId);
            
            return {
                id: empresaId,
                nombre: empresa ? empresa.descripcion_corta : 'No encontrada'
            };
        },
        
        // Determinar si debe mostrar control de cupo
        debeMostrarCupo() {
            const esVentaPorLista = this.esVentaPorLista();
            return this.esPrimeraVenta && !this.esVentaObsequios && esVentaPorLista;
        },
        
        // Validar si tiene cupo suficiente
        tieneCupoSuficiente() {
            if (!this.debeMostrarCupo) return true;
            
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return false;
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalVenta = this.calcularTotalesUnificados().total || 0;
            
            return cupoInicial > 0 && totalVenta <= cupoInicial;
        },
        
        // Obtener cupo máximo disponible
        obtenerCupoMaximo() {
            if (!this.debeMostrarCupo) return '0.00';
            
            const lugarDespacho = this.nuevoLugarDespacho || this.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            return cupoInicial.toFixed(2);
        }
    },
    mounted() {
    },
    methods: {
        obtenerLineaProductoId(libro) {
            if (!libro || libro.linea_producto_id == null) {
                return 0;
            }
            return parseInt(libro.linea_producto_id, 10);
        },

        obtenerEtiquetaLineaProducto(libro) {
            const lineaId = this.obtenerLineaProductoId(libro);
            if (lineaId === 1) {
                return 'Prolipa';
            }
            if (lineaId === 2) {
                return 'Iluminar';
            }
            return '';
        },

        obtenerClaseLineaProducto(libro) {
            const lineaId = this.obtenerLineaProductoId(libro);
            if (lineaId === 1) {
                return 'linea-prolipa';
            }
            if (lineaId === 2) {
                return 'linea-iluminar';
            }
            return 'linea-sin-definir';
        },

        obtenerDescuentoPromedioPorLineaContratoEdicion(lineaId) {
            let itemsContrato = [];

            if (this.librosPedido && this.librosPedido.length > 0) {
                itemsContrato = this.librosPedido;
            } else if (this.pedidoSeleccionado && this.pedidoSeleccionado.detalles && this.pedidoSeleccionado.detalles.length > 0) {
                itemsContrato = this.pedidoSeleccionado.detalles;
            }

            if (!itemsContrato || itemsContrato.length === 0) {
                return null;
            }

            let suma = 0;
            let contador = 0;

            for (let i = 0; i < itemsContrato.length; i++) {
                const item = itemsContrato[i];
                if (!item) {
                    continue;
                }

                let lineaItem = 0;
                if (item.linea_producto_id != null) {
                    lineaItem = parseInt(item.linea_producto_id, 10);
                }

                if (lineaItem !== lineaId) {
                    continue;
                }

                let descuentoItem = null;
                if (item.descuento != null) {
                    descuentoItem = item.descuento;
                } else if (item.ven_det_descuento != null) {
                    descuentoItem = item.ven_det_descuento;
                } else if (item.descuentoIndividual != null) {
                    descuentoItem = item.descuentoIndividual;
                }

                if (descuentoItem == null) {
                    continue;
                }

                const descuentoNumero = parseFloat(descuentoItem);
                if (isNaN(descuentoNumero)) {
                    continue;
                }

                suma += descuentoNumero;
                contador++;
            }

            if (contador === 0) {
                return null;
            }

            const promedio = suma / contador;
            const promedioEntero = parseInt(promedio, 10);
            if (isNaN(promedioEntero)) {
                return null;
            }

            return Math.max(0, Math.min(100, promedioEntero));
        },

        obtenerDescuentosContratoVentaDirectaEdicion() {
            const resultado = {
                general: 0,
                prolipa: 0,
                iluminar: 0
            };

            if (!this.esVentaDirecta()) {
                return resultado;
            }

            const descuentoProlipa = this.obtenerDescuentoPromedioPorLineaContratoEdicion(1);
            const descuentoIluminar = this.obtenerDescuentoPromedioPorLineaContratoEdicion(2);

            let descuentoGeneral = null;
            if (this.pedidoSeleccionado && this.pedidoSeleccionado.descuento != null) {
                descuentoGeneral = parseInt(this.pedidoSeleccionado.descuento, 10);
            } else if (this.pedidoSeleccionado && this.pedidoSeleccionado.descuento_pedido != null) {
                descuentoGeneral = parseInt(this.pedidoSeleccionado.descuento_pedido, 10);
            } else if (this.pedidoSeleccionado && this.pedidoSeleccionado.descuento_general != null) {
                descuentoGeneral = parseInt(this.pedidoSeleccionado.descuento_general, 10);
            }

            if (descuentoGeneral == null || isNaN(descuentoGeneral)) {
                let sumaLineas = 0;
                let contadorLineas = 0;

                if (descuentoProlipa != null) {
                    sumaLineas += descuentoProlipa;
                    contadorLineas++;
                }
                if (descuentoIluminar != null) {
                    sumaLineas += descuentoIluminar;
                    contadorLineas++;
                }

                if (contadorLineas > 0) {
                    descuentoGeneral = parseInt((sumaLineas / contadorLineas), 10);
                }
            }

            if (descuentoGeneral == null || isNaN(descuentoGeneral)) {
                descuentoGeneral = 0;
            }

            resultado.general = Math.max(0, Math.min(100, descuentoGeneral));
            resultado.prolipa = descuentoProlipa != null ? descuentoProlipa : resultado.general;
            resultado.iluminar = descuentoIluminar != null ? descuentoIluminar : resultado.general;

            return resultado;
        },

        obtenerDescuentoContratoVentaDirectaEdicion() {
            const descuentos = this.obtenerDescuentosContratoVentaDirectaEdicion();
            return descuentos.general;
        },

        aplicarDescuentosContratoVentaDirectaEdicion() {
            const descuentos = this.obtenerDescuentosContratoVentaDirectaEdicion();
            this.descuentoLineaProlipa = descuentos.prolipa;
            this.descuentoLineaIluminar = descuentos.iluminar;
        },

        obtenerDescuentoPorLinea(libro) {
            const lineaId = this.obtenerLineaProductoId(libro);
            if (lineaId === 1) {
                const prolipa = parseInt(this.descuentoLineaProlipa, 10);
                return isNaN(prolipa) ? 0 : prolipa;
            }
            if (lineaId === 2) {
                const iluminar = parseInt(this.descuentoLineaIluminar, 10);
                return isNaN(iluminar) ? 0 : iluminar;
            }
            return 0;
        },

        obtenerDescuentoInicialFila(libro) {
            if (!libro) {
                return '0';
            }
            return this.obtenerDescuentoPorLinea(libro).toString();
        },

        normalizarDescuentoPorLinea(tipo) {
            if (tipo === 'prolipa') {
                let valorP = parseInt(this.descuentoLineaProlipa, 10);
                if (isNaN(valorP) || valorP < 0) {
                    valorP = 0;
                }
                if (valorP > 100) {
                    valorP = 100;
                }
                this.descuentoLineaProlipa = valorP;
            } else {
                let valorI = parseInt(this.descuentoLineaIluminar, 10);
                if (isNaN(valorI) || valorI < 0) {
                    valorI = 0;
                }
                if (valorI > 100) {
                    valorI = 100;
                }
                this.descuentoLineaIluminar = valorI;
            }
        },

        libroCoincideConLineaSeleccionada(libro) {
            return !!libro;
        },

        // ==========================================
        // HELPERS PARA COMBOS (grupo_codigo_para_v3 = 8)
        // ==========================================
        esLibroComboParaStock(libro) {
            if (!libro) return false;
            const grupo = libro.grupo_codigo_para_v3 != null ? parseInt(libro.grupo_codigo_para_v3, 10) : 0;
            return grupo === 8;
        },

        construirConsultaStockPerseo(libro, cantidad) {
            if (!libro || !libro.pro_codigo) return libro;
            const consulta = {
                pro_codigo: libro.pro_codigo,
                cantidad: cantidad != null ? cantidad : (libro.cantidad != null ? libro.cantidad : (libro.cantidadVenta != null ? libro.cantidadVenta : 0))
            };
            if (this.esLibroComboParaStock(libro) && parseInt(consulta.cantidad, 10) > 0) {
                // Solo codigos_combos — codigos_combos_regalado ya está incluido en codigos_combos
                consulta.codigos_combos = libro.codigos_combos != null ? libro.codigos_combos : '';
                consulta.grupo_codigo_para_v3 = libro.grupo_codigo_para_v3 != null ? libro.grupo_codigo_para_v3 : '';
                consulta.es_combo = 1;
                consulta.tipo_producto = 8;
            }
            return consulta;
        },

        aplicarStockRespuestaPerseo(libroDestino, stockInfo) {
            if (!libroDestino || !stockInfo) return;
            const stockDisponible = parseInt(
                stockInfo.existenciastotales != null ? stockInfo.existenciastotales : (stockInfo.stock_unico != null ? stockInfo.stock_unico : stockInfo.pro_stockCalmed || 0),
                10
            );
            this.$set(libroDestino, 'stock', stockDisponible);
            this.$set(libroDestino, 'stock_perseo_actual', stockDisponible);
            // Guardar desglose para mostrar en columna St.Perseo
            if (stockInfo.stock_plataforma != null) {
                this.$set(libroDestino, 'stock_plataforma', parseInt(stockInfo.stock_plataforma, 10));
            }
            if (stockInfo.stock_perseo != null) {
                this.$set(libroDestino, 'stock_perseo', parseInt(stockInfo.stock_perseo, 10));
            }
            const nombre = stockInfo.descripcion || stockInfo.pro_nombre || libroDestino.pro_nombre || libroDestino.nombre_libro || '';
            this.$set(libroDestino, 'pro_nombre', nombre);
            this.$set(libroDestino, 'es_combo', !!stockInfo.es_combo);
            this.$set(libroDestino, 'mensaje_stock_combo', stockInfo.mensaje_stock_combo || null);
            this.$set(libroDestino, 'detalle_faltantes_combo', Array.isArray(stockInfo.detalle_faltantes_combo) ? stockInfo.detalle_faltantes_combo : []);
            this.$set(libroDestino, 'stock_combo_componentes', Array.isArray(stockInfo.stock_combo_componentes) ? stockInfo.stock_combo_componentes : []);
            this.$set(libroDestino, 'fuente_stock', stockInfo.fuente_stock || 'pro_stockCalmed');
        },

        // ==========================================
        // MÉTODO CENTRALIZADO PARA CONSULTAR STOCK
        // ==========================================
        async consultarStockPerseo(codigos, idEmpresa) {
            try {
                const codigosArray = Array.isArray(codigos) ? codigos : [codigos];
                const empresaId = typeof idEmpresa === 'object' && idEmpresa !== null
                    ? parseInt(idEmpresa.id != null ? idEmpresa.id : idEmpresa.id_empresa, 10)
                    : parseInt(idEmpresa, 10);

                // Prefactura (tdo_id=1) → valida plataforma Y Perseo, usa mínimo como límite
                const esPrefactura = parseInt(this.ventaData.idtipodoc, 10) === 1;
                const endpointStock = esPrefactura
                    ? `${this.$server_url}api/perseo/ventas-lista/stock-producto-con-perseo`
                    : `${this.$server_url}api/perseo/ventas-lista/stock-producto`;

                const productosIndexados = {};

                for (let i = 0; i < codigosArray.length; i++) {
                    const itemConsulta = codigosArray[i];
                    const esObjeto = typeof itemConsulta === 'object' && itemConsulta !== null;
                    const codigoActual = esObjeto ? itemConsulta.pro_codigo : itemConsulta;
                    const cantidadSolicitada = esObjeto && itemConsulta.cantidad != null ? parseInt(itemConsulta.cantidad, 10) || 0 : 0;

                    const parametros = { pro_codigo: codigoActual, empresa_id: empresaId, cantidad: cantidadSolicitada };
                    if (esObjeto) {
                        if (itemConsulta.codigos_combos != null) parametros.codigos_combos = itemConsulta.codigos_combos;
                        if (itemConsulta.grupo_codigo_para_v3 != null) parametros.grupo_codigo_para_v3 = itemConsulta.grupo_codigo_para_v3;
                        if (itemConsulta.es_combo != null) parametros.es_combo = itemConsulta.es_combo;
                        if (itemConsulta.tipo_producto != null) parametros.tipo_producto = itemConsulta.tipo_producto;
                    }

                    const response = await this.$http.get(endpointStock, { params: parametros });

                    if (!response.data || response.data.status !== 'success' || !response.data.data) {
                        throw new Error('La respuesta del servidor no contiene datos de stock válidos');
                    }

                    const producto = response.data.data;
                    const codigo = producto.pro_codigo;
                    if (codigo) {
                        const stockUnico = parseInt(
                            producto.existenciastotales != null ? producto.existenciastotales : (producto.stock_unico != null ? producto.stock_unico : producto.pro_stockCalmed || 0),
                            10
                        );
                        productosIndexados[codigo] = {
                            ...producto,
                            existenciastotales: stockUnico,
                            stock_unico: stockUnico,
                            stock_plataforma: producto.stock_plataforma != null ? parseInt(producto.stock_plataforma, 10) : stockUnico,
                            stock_perseo: producto.stock_perseo != null ? parseInt(producto.stock_perseo, 10) : null,
                            descripcion: producto.pro_nombre,
                            mensaje_stock_combo: producto.mensaje_stock_combo || null,
                            detalle_faltantes_combo: Array.isArray(producto.detalle_faltantes_combo) ? producto.detalle_faltantes_combo : [],
                            stock_combo_componentes: Array.isArray(producto.stock_combo_componentes) ? producto.stock_combo_componentes : [],
                            es_combo: !!producto.es_combo,
                            puede_vender: producto.puede_vender !== undefined ? producto.puede_vender : null
                        };
                    }
                }

                return productosIndexados;
            } catch (error) {
                throw error;
            }
        },
        
        // ==========================================
        // CONSULTAR STOCK DE LIBROS EN LA VENTA (INDIVIDUALMENTE)
        // ==========================================
        async consultarStockLibros() {
            let me = this;
            
            const filasConLibro = me.filasCaptura.filter(fila => fila.libroSeleccionado);
            if (filasConLibro.length === 0) return;
            
            const empresaId = me.ventaData.id_empresa;
            if (!empresaId) return;
            
            for (let i = 0; i < filasConLibro.length; i++) {
                const fila = filasConLibro[i];
                const esCombo = me.esLibroComboParaStock(fila.libroSeleccionado);

                if (esCombo) {
                    // Combo: no consultar stock al cargar, esperar que el usuario ingrese/confirme cantidad
                    me.$set(fila.libroSeleccionado, 'stock', null);
                    me.$set(fila.libroSeleccionado, 'puede_vender', null);
                    me.$set(fila.libroSeleccionado, 'detalle_faltantes_combo', []);
                    me.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);
                    // Si ya tiene cantidad cargada (venta existente), consultar con esa cantidad
                    const cantidadActual = parseInt(fila.cantidad, 10);
                    if (!isNaN(cantidadActual) && cantidadActual > 0) {
                        me.consultarStockComboConCantidad(fila, i);
                    }
                    continue;
                }

                me.$set(fila, 'consultandoStock', true);
                try {
                    const codigo = fila.libroSeleccionado.pro_codigo;
                    const cantidadOriginal = fila.cantidadOriginal || 0;
                    const esPrefactura = parseInt(me.ventaData.idtipodoc, 10) === 1;
                    
                    // Consultar stock sin cantidad para obtener el stock real disponible
                    const stockData = await me.consultarStockPerseo([
                        me.construirConsultaStockPerseo(fila.libroSeleccionado, 0)
                    ], empresaId);
                    
                    if (stockData && stockData[codigo]) {
                        me.aplicarStockRespuestaPerseo(fila.libroSeleccionado, stockData[codigo]);
                        
                        if (esPrefactura) {
                            // Plataforma: stockReal (que ya es stock_plataforma del response) + cantidadOriginal
                            // Perseo: viene directo del response, no se ajusta (Perseo no rebaja al crear la venta desde aquí)
                            const stockRawPlat = parseInt(stockData[codigo].stock_plataforma != null ? stockData[codigo].stock_plataforma : fila.libroSeleccionado.stock || 0, 10);
                            const stockPlataformaFinal = stockRawPlat + cantidadOriginal;
                            const stockPerseoFinal = parseInt(stockData[codigo].stock_perseo != null ? stockData[codigo].stock_perseo : fila.libroSeleccionado.stock || 0, 10);
                            // El límite real para edición es el mínimo entre ambos
                            const stockLimite = Math.min(stockPlataformaFinal, stockPerseoFinal);
                            me.$set(fila.libroSeleccionado, 'stock_plataforma', stockPlataformaFinal);
                            me.$set(fila.libroSeleccionado, 'stock_perseo', stockPerseoFinal);
                            me.$set(fila.libroSeleccionado, 'stock', stockLimite);
                            me.$set(fila.libroSeleccionado, 'stock_perseo_actual', stockLimite);
                        } else {
                            // Comportamiento anterior: plataforma + cantidadOriginal como límite
                            const stockReal = parseInt(fila.libroSeleccionado.stock || 0, 10);
                            const stockTotal = stockReal + cantidadOriginal;
                            me.$set(fila.libroSeleccionado, 'stock', stockTotal);
                            me.$set(fila.libroSeleccionado, 'stock_perseo_actual', stockTotal);
                        }
                        me.$set(fila.libroSeleccionado, 'cantidadOriginal', cantidadOriginal);
                    } else {
                        me.$set(fila.libroSeleccionado, 'stock', cantidadOriginal);
                        me.$set(fila.libroSeleccionado, 'stock_perseo_actual', cantidadOriginal);
                    }
                } catch (error) {
                    const cantidadOriginal = fila.cantidadOriginal || 0;
                    me.$set(fila.libroSeleccionado, 'stock', cantidadOriginal);
                    me.$set(fila.libroSeleccionado, 'stock_perseo_actual', cantidadOriginal);
                } finally {
                    me.$set(fila, 'consultandoStock', false);
                }
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        },
        
        // ==========================================
        // MÉTODOS PARA TABLA V-SELECT Y CAPTURA
        // ==========================================
        filtrarLibros(options, search) {
            if (!search || search.trim() === '') return options;
            
            const searchLower = search.toLowerCase().trim();
            
            return options.filter(libro => {
                const codigo = (libro.pro_codigo || '').toLowerCase();
                const nombre = (libro.nombre_libro || '').toLowerCase();
                
                return codigo.includes(searchLower) || nombre.includes(searchLower);
            });
        },

        librosDisponiblesParaFila(filaIndex) {
            if (!this.librosPedido || !Array.isArray(this.librosPedido)) {
                return [];
            }

            // Obtener los códigos de libros ya seleccionados en otras filas
            const codigosSeleccionados = this.filasCaptura
                .map((fila, idx) => {
                    if (idx === filaIndex) return null;
                    return fila.libroSeleccionado ? fila.libroSeleccionado.pro_codigo : null;
                })
                .filter(codigo => codigo !== null);

            return this.librosPedido.filter(libro => {
                // Excluir si ya está seleccionado en otra fila
                if (codigosSeleccionados.includes(libro.pro_codigo)) {
                    return false;
                }

                // Solo mostrar libros con pendientes: pedido - vendido > 0
                const cantidadPedida = libro && libro.cantidad != null ? parseInt(libro.cantidad, 10) : 0;
                const cantidadVendida = libro && libro.cantidadVendida != null ? parseInt(libro.cantidadVendida, 10) : 0;
                const disponible = cantidadPedida - cantidadVendida;

                return disponible > 0;
            });
        },
        
        seleccionarLibroDesdeSelect(fila, libro, index) {
            if (!libro) return;
            
            const libroYaExiste = this.filasCaptura.some((f, i) => {
                return i !== index && f.libroSeleccionado && f.libroSeleccionado.pro_codigo === libro.pro_codigo;
            });
            if (libroYaExiste) {
                this.$f_notificacion(`El libro "${libro.pro_codigo} - ${libro.nombre_libro}" ya está agregado en otra fila`, 'warning', 'AlertTriangleIcon', 4000);
                return;
            }
            if (!this.ventaData.id_empresa) {
                this.$f_notificacion('Debe seleccionar una empresa primero', 'warning', 'AlertTriangleIcon', 3000);
                return;
            }
            const cantidadPedidaLibro = libro && libro.cantidad != null ? parseInt(libro.cantidad, 10) : 0;
            const cantidadVendidaLibro = libro && libro.cantidadVendida != null ? parseInt(libro.cantidadVendida, 10) : 0;
            const disponibleLibro = cantidadPedidaLibro - cantidadVendidaLibro;
            if (cantidadPedidaLibro > 0 && disponibleLibro <= 0) {
                this.$f_notificacion('Este libro ya no tiene cantidad disponible para vender', 'warning', 'AlertTriangleIcon', 3000);
                return;
            }

            fila.textoBusqueda = `${libro.pro_codigo} - ${libro.nombre_libro}`;
            fila.cantidad = '';
            fila.descuento = this.obtenerDescuentoInicialFila(libro);
            fila.errorDescuento = '';
            if (fila.cantidadOriginal === undefined) { fila.cantidadOriginal = 0; }

            const esCombo = this.esLibroComboParaStock(libro);

            if (esCombo) {
                // Combo: NO consultar stock ahora, esperar cantidad
                const libroPedido = this.librosPedido.find(lp => lp.pro_codigo === libro.pro_codigo);
                const cantidadPedida = libroPedido && libroPedido.cantidad != null ? parseInt(libroPedido.cantidad, 10) : 0;
                const cantidadOtrasVentas = libroPedido && libroPedido.cantidadVendida != null
                    ? parseInt(libroPedido.cantidadVendida, 10)
                    : (libro && libro.cantidadVendida != null ? parseInt(libro.cantidadVendida, 10) : 0);
                fila.consultandoStock = false;
                fila.libroSeleccionado = {
                    ...libro,
                    cantidadPedida: cantidadPedida,
                    cantidadVendida: cantidadOtrasVentas,
                    cantidadOtrasVentas: cantidadOtrasVentas,
                    stock: null,
                    puede_vender: null,
                    detalle_faltantes_combo: [],
                    stock_combo_componentes: []
                };
                this.$nextTick(() => { setTimeout(() => { this.enfocarSiguienteInput(index, 'cantidad'); }, 100); });
                return;
            }

            // Producto simple: consultar stock al seleccionar
            fila.consultandoStock = true;
            this.consultarStockPerseo([this.construirConsultaStockPerseo(libro, 0)], this.ventaData.id_empresa)
            .then(stockData => {
                fila.consultandoStock = false;
                const libroPedido = this.librosPedido.find(lp => lp.pro_codigo === libro.pro_codigo);
                const cantidadPedida = libroPedido && libroPedido.cantidad != null ? parseInt(libroPedido.cantidad, 10) : 0;
                const cantidadOtrasVentas = libroPedido && libroPedido.cantidadVendida != null
                    ? parseInt(libroPedido.cantidadVendida, 10)
                    : (libro && libro.cantidadVendida != null ? parseInt(libro.cantidadVendida, 10) : 0);
                if (stockData && stockData[libro.pro_codigo]) {
                    const stockInfo = stockData[libro.pro_codigo];
                    const esPrefactura = parseInt(this.ventaData.idtipodoc, 10) === 1;
                    fila.libroSeleccionado = {
                        ...libro,
                        pro_nombre: stockInfo.descripcion || libro.nombre_libro,
                        cantidadPedida: cantidadPedida,
                        cantidadVendida: cantidadOtrasVentas,
                        cantidadOtrasVentas: cantidadOtrasVentas
                    };
                    this.aplicarStockRespuestaPerseo(fila.libroSeleccionado, stockInfo);
                    // Para libro nuevo en edición (cantidadOriginal=0), el stock ya viene correcto del endpoint:
                    // prefactura → existenciastotales = min(plataforma, perseo)
                    // otros tipos → existenciastotales = plataforma
                    if (esPrefactura && stockInfo.stock_plataforma != null && stockInfo.stock_perseo != null) {
                        this.$set(fila.libroSeleccionado, 'stock_plataforma', parseInt(stockInfo.stock_plataforma, 10));
                        this.$set(fila.libroSeleccionado, 'stock_perseo', parseInt(stockInfo.stock_perseo, 10));
                    }
                    this.$nextTick(() => { setTimeout(() => { this.enfocarSiguienteInput(index, 'cantidad'); }, 100); });
                } else {
                    fila.libroSeleccionado = { ...libro, stock: 0, cantidadPedida, cantidadVendida: cantidadOtrasVentas, cantidadOtrasVentas };
                    this.$f_notificacion('No se encontró stock para este libro', 'warning', 'AlertTriangleIcon', 3000);
                }
            })
            .catch(() => {
                fila.consultandoStock = false;
                fila.libroSeleccionado = null;
                this.$f_notificacion('Error al consultar stock', 'danger', 'XCircleIcon', 3000);
            });
        },
        
        enfocarSiguienteInput(index, tipo) {
            this.$nextTick(() => {
                if (tipo === 'cantidad') {
                    const cantidadInput = this.$refs[`cantidad-${index}`];
                    if (cantidadInput && cantidadInput[0]) {
                        cantidadInput[0].$el.querySelector('input').focus();
                    }
                } else if (tipo === 'busqueda') {
                    if (index >= this.filasCaptura.length) {
                        this.agregarFilaCaptura();
                    }
                    
                    setTimeout(() => {
                        const inputs = this.$el.querySelectorAll('.captura-rapida-container input[type="text"]');
                        if (inputs[index]) {
                            inputs[index].focus();
                        }
                    }, 100);
                }
            });
        },
        
        manejarBackspaceSelect(fila, index, event) {
            const estaVacio = !fila.libroSeleccionado && 
                            (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') && 
                            (!fila.cantidad || fila.cantidad.toString().trim() === '');
            
            if (estaVacio && index > 0) {
                const selectRef = this.$refs[`select-libro-${index}`];
                const selectComponent = Array.isArray(selectRef) ? selectRef[0] : selectRef;
                
                if (selectComponent && selectComponent.$el) {
                    const inputElement = selectComponent.$el.querySelector('input');
                    if (inputElement && inputElement.value.trim() === '') {
                        event.preventDefault();
                        
                        this.filasCaptura.splice(index, 1);
                        
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.enfocarSiguienteInput(index - 1, 'cantidad');
                            }, 100);
                        });
                    }
                }
            }
        },
        
        calcularCambio(fila) {
            if (!fila.libroSeleccionado || fila.cantidadOriginal === undefined) {
                return '-';
            }
            
            const cantidadNueva = parseInt(fila.cantidad || 0);
            const cantidadOriginal = parseInt(fila.cantidadOriginal || 0);
            const diferencia = cantidadNueva - cantidadOriginal;
            
            if (diferencia === 0) {
                return '=';
            } else if (diferencia > 0) {
                return `+${diferencia}`;
            } else {
                return `${diferencia}`;
            }
        },
        
        obtenerColorCambio(diferencia) {
            if (diferencia === 0) {
                return 'dark';
            } else if (diferencia > 0) {
                return 'success';
            } else {
                return 'warning';
            }
        },
        
        soloNumeros(event) {
            const char = String.fromCharCode(event.keyCode || event.which);
            if (!/^[0-9]$/.test(char)) {
                event.preventDefault();
            }
        },

        toggleComboFaltantes(index) {
            const actual = this.comboFaltantesExpandidos[index];
            this.$set(this.comboFaltantesExpandidos, index, !actual);
        },

        // Componentes de un combo que no alcanzan para la cantidad pedida.
        // origen: 'plataforma' o 'perseo'. Devuelve [] si no es combo o no hay cantidad.
        componentesFaltantesStock(fila, origen) {
            if (!fila || !fila.libroSeleccionado) return [];

            const libro = fila.libroSeleccionado;
            const componentes = Array.isArray(libro.stock_combo_componentes) ? libro.stock_combo_componentes : [];
            if (componentes.length === 0) return [];

            const cantidadSolicitada = parseInt(fila.cantidad, 10) || 0;
            if (cantidadSolicitada <= 0) return [];

            return componentes.map(comp => {
                const requerido = comp.requerido != null ? parseInt(comp.requerido, 10) : cantidadSolicitada;
                let disponible = 0;
                let faltante = 0;

                if (origen === 'perseo') {
                    disponible = comp.stock_perseo != null ? parseInt(comp.stock_perseo, 10) : 0;
                    faltante = comp.faltante_perseo != null
                        ? parseInt(comp.faltante_perseo, 10)
                        : Math.max(0, requerido - disponible);
                } else {
                    disponible = comp.stock_plataforma != null
                        ? parseInt(comp.stock_plataforma, 10)
                        : (comp.stock != null ? parseInt(comp.stock, 10) : 0);
                    faltante = comp.faltante_plataforma != null
                        ? parseInt(comp.faltante_plataforma, 10)
                        : Math.max(0, requerido - disponible);
                }

                return {
                    pro_codigo: comp.pro_codigo,
                    pro_nombre: comp.pro_nombre,
                    requerido: requerido,
                    disponible: disponible,
                    faltante: faltante
                };
            }).filter(comp => comp.faltante > 0);
        },

        // Detalle que se muestra al pasar el mouse sobre cada producto faltante
        tooltipComponenteFaltante(comp, origen) {
            const etiqueta = origen === 'perseo' ? 'Perseo' : 'plataforma';
            let texto = comp.pro_codigo;
            if (comp.pro_nombre) texto += ' - ' + comp.pro_nombre;
            texto += ' | Stock en ' + etiqueta + ': ' + comp.disponible;
            texto += ' | Necesita: ' + comp.requerido;
            texto += ' | Faltan: ' + comp.faltante;
            return texto;
        },

        validarCantidadFinal(fila, index) {
            if (fila.cantidad && parseInt(fila.cantidad) <= 0) {
                fila.cantidad = '';
                fila.errorCantidad = '';
            }
        },
        
        // ==========================================
        // MÉTODO GUARDAR CAMBIOS - ADAPTADO PARA VENTAS PERSEO
        // ==========================================
        guardarCambios() {
            let me = this;
            
            const hayCambiosBasicos = me.hayModificaciones();
            const hayCambiosEnLibros = me.hayModificacionesEnLibros();
            
            if (!hayCambiosBasicos && !hayCambiosEnLibros) {
                me.$vs.notify({
                    title: 'Sin cambios',
                    text: 'No se han realizado modificaciones en la venta',
                    color: 'warning'
                });
                return;
            }
            
            // ✅ Trabajar con detallesVenta (se reutiliza el nombre)
            const librosConCantidad = me.detallesVenta.filter(libro => 
                libro.cantidadVenta && parseInt(libro.cantidadVenta) > 0
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

            if (me.esVentaDirecta()) {
                me.aplicarDescuentosContratoVentaDirectaEdicion();
            }
            
            // ✅ CAMPOS DE VENTA (no venta)
            formData.append('ven_codigo', me.ventaData.ven_codigo);
            formData.append('contrato', me.ventaData.contrato);
            formData.append('usu_codigo', me.ventaData.usu_codigo);
            formData.append('ven_observacion', me.ventaData.ven_observacion || '');
            formData.append('concepto_perseo', me.ventaData.concepto_perseo || '');
            formData.append('pedido_id', me.ventaData.pedido_id || '');
            formData.append('idtipodoc', me.ventaData.idtipodoc || '');
            
            // ✅ IMPORTANTE: Manejar id_empresa como número
            const empresaId = typeof me.ventaData.id_empresa === 'object' && me.ventaData.id_empresa !== null
                ? me.ventaData.id_empresa.id 
                : me.ventaData.id_empresa;
            
            formData.append('id_empresa', empresaId);
            
            const idDespacho = me.nuevoLugarDespacho 
                ? me.nuevoLugarDespacho.idInstitucion 
                : me.lugarDespacho.idInstitucion;
            
            const idCliente = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.idusuario
                : me.ventaData.ven_cliente;
            const clientePerseoId = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.clientesidPerseo
                : me.ventaData.clientesidPerseo;
            const rucCliente = me.nuevoClientePerseo 
                ? me.nuevoClientePerseo.cedula 
                : me.ventaData.ruc_cliente;
            
            formData.append('id_ins_depacho', idDespacho);
            formData.append('ven_cliente', idCliente);
            formData.append('clientesidPerseo', clientePerseoId);
            formData.append('ruc_cliente', rucCliente);
            
            // ✅ Totales para venta
            const totales = me.calcularTotalesUnificados();
            formData.append('ven_descuento', 'null');
            formData.append('ven_valor', parseFloat(totales.total));
            formData.append('est_ven_codigo', me.ventaData.est_ven_codigo);
            
            // ✅ SISTEMA DE RESERVAS: Calcular diferencias y enviar datos completos
            const librosParaEnviar = librosConCantidad.map(libro => {
                const cantidadNueva = parseInt(libro.cantidadVenta);
                const cantidadOriginal = libro.cantidadOriginal || 0;
                const diferencia = cantidadNueva - cantidadOriginal;
                
                return {
                    pro_codigo: libro.pro_codigo,
                    ven_det_cantidad: cantidadNueva,
                    ven_det_valor_u: parseFloat(libro.precio || 0),
                    ven_det_descuento: parseFloat(libro.descuentoIndividual || 0),
                    descuento: parseFloat(libro.descuentoIndividual || 0),
                    nombre_libro: libro.nombre_libro,
                    linea_producto_id: libro.linea_producto_id != null ? parseInt(libro.linea_producto_id, 10) : 0,
                    // Datos de combo para que el backend descuente los componentes correctos
                    grupo_codigo_para_v3: libro.grupo_codigo_para_v3 != null ? libro.grupo_codigo_para_v3 : null,
                    codigos_combos: libro.codigos_combos != null ? libro.codigos_combos : null,
                    codigos_combos_regalado: libro.codigos_combos_regalado != null ? libro.codigos_combos_regalado : null,
                    // DATOS DE RESERVAS PERSEO
                    stock_perseo_historico: libro.stock_perseo_historico || 0,
                    stock_perseo_actual: libro.stock_perseo_actual || 0,
                    reserva_perseo_original: (me.reservasOriginales[libro.pro_codigo] && me.reservasOriginales[libro.pro_codigo].reserva_perseo) || 0,
                    cantidad_original: cantidadOriginal,
                    diferencia_cantidad: diferencia,
                    contrato: me.ventaData.contrato
                };
            });
            
            formData.append('data_detalle', JSON.stringify(librosParaEnviar));
            
            me.$vs.loading({
                text: 'Actualizando venta y reservas de Perseo...'
            });
            
            // ✅ Usar endpoint específico para VENTAS Perseo
            me.$http.post(`${me.$server_url}Venta_Perseo_Actualizar`, formData)
                .then(response => {
                    me.$vs.loading.close();
                    
                    if (response.status === 200) {
                        
                        me.$vs.notify({
                            title: 'Éxito',
                            text: response.data.message || 'Venta Perseo actualizada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                            time: 4000
                        });
                        
                        me.$emit('venta-actualizada', response.data);
                        me.cerrarModal();
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    
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
                            text: 'No se pudo actualizar la venta Perseo. ' + errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x-circle',
                            time: 5000
                        });
                    }
                });
        },
        
        // ==========================================
        // CARGAR DATOS DE VENTA PERSEO
        // ==========================================
        cargarDatosVenta() {
            let me = this;
            
            if (!me.ventaId) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'No se proporcionó un ID de venta válido',
                    color: 'danger'
                });
                me.loadingDatos = false;
                return;
            }
            
            me.loadingDatos = true;
            
            me.$http.get(`${me.$server_url}get_venta_para_editar_perseo/${me.ventaId}`)
                .then(async response => {
                    if (response.data.status === 200) {
                        const data = response.data.data;
                        
                        // Cargar datos básicos de la venta
                        me.ventaData = {
                            id: data.venta.ven_codigo,
                            ven_codigo: data.venta.ven_codigo,
                            id_empresa: parseInt(data.venta.id_empresa),
                            ven_descuento: parseFloat(data.venta.ven_descuento || 0),
                            ven_observacion: data.venta.ven_observacion || '',
                            concepto_perseo: data.venta.concepto_perseo || '',
                            ven_valor: parseFloat(data.venta.ven_valor || 0),
                            est_ven_codigo: parseInt(data.venta.est_ven_codigo),
                            contrato: data.venta.contrato,
                            ven_fecha: data.venta.ven_fecha,
                            usu_codigo: data.venta.usu_codigo,
                            pedido_id: data.venta.pedido_id,
                            id_periodo: data.venta.id_periodo || (data.pedido && data.pedido.id_periodo) || null,
                            id_ins_depacho: data.venta.id_ins_depacho,
                            ven_cliente: data.venta.ven_cliente,
                            ruc_cliente: data.venta.ruc_cliente || '',
                            clientesidPerseo: data.venta.clientesidPerseo,
                            idtipodoc: data.venta.idtipodoc,
                            tipo_venta: data.venta.tipo_venta || null
                        };
                        
                        // Cargar indicadores de control de cupo
                        me.esPrimeraVenta = data.venta.esPrimeraVenta || false;
                        me.ventasActivasInstitucion = null;
                        me.esVentaObsequios = data.venta.esVentaObsequios || false;
                        

                        
                        // Cargar lugar de despacho
                        me.lugarDespacho = {
                            idInstitucion: data.lugarDespacho.idInstitucion,
                            nombreInstitucion: data.lugarDespacho.nombreInstitucion,
                            ruc: data.lugarDespacho.ruc || '',
                            ciudad: data.lugarDespacho.ciudad || '',
                            datosInstitucion: data.lugarDespacho.datosInstitucion || []
                        };
                        
                        // Si tiene cupo cargado desde el backend y es primera venta, cargarlo en el formulario
                        if (me.debeMostrarCupo && data.lugarDespacho.datosInstitucion && data.lugarDespacho.datosInstitucion.length > 0) {
                            me.cargarDatosFormularioCupo(data.lugarDespacho.datosInstitucion[0]);
                        }
                        
                        // Cargar cliente Perseo
                        me.clientePerseo = {
                            id: data.cliente.id,
                            nombre: data.cliente.nombre,
                            cedula: data.cliente.cedula || '',
                            email: data.cliente.email || ''
                        };
                        
                        // Cargar detalles de la venta
                        me.filasCaptura = data.detalles.map((detalle, index) => {
                            // Buscar cantidad pedida en el prop librosPedido
                            const libroPedido = me.librosPedido.find(lp => lp.pro_codigo === detalle.pro_codigo);
                            const cantidadDelPedido = libroPedido ? parseInt(libroPedido.cantidad || 0) : parseInt(detalle.cantidad_pedido || 0);
                            
                            return {
                                textoBusqueda: detalle.nombre_libro,
                                libroSeleccionado: {
                                    pro_codigo: detalle.pro_codigo,
                                    nombre_libro: detalle.nombre_libro,
                                    precio: parseFloat(detalle.precio || detalle.pvp || 0),
                                    pvp: parseFloat(detalle.pvp || detalle.precio || 0),
                                    linea_producto_id: detalle.linea_producto_id != null ? parseInt(detalle.linea_producto_id, 10) : 0,
                                    descuento: parseFloat(detalle.descuento || 0),
                                    cantidad: cantidadDelPedido,
                                    cantidadVendida: parseInt(detalle.cantidad_otras_ventas || 0),
                                    stock: 0, // Se consultará después
                                    cantidadPedida: cantidadDelPedido,
                                    cantidadOtrasVentas: parseInt(detalle.cantidad_otras_ventas || 0),
                                    // Campos combo — se toman del prop librosPedido si están disponibles
                                    grupo_codigo_para_v3: libroPedido && libroPedido.grupo_codigo_para_v3 != null ? libroPedido.grupo_codigo_para_v3 : (detalle.grupo_codigo_para_v3 != null ? detalle.grupo_codigo_para_v3 : null),
                                    codigos_combos: libroPedido && libroPedido.codigos_combos != null ? libroPedido.codigos_combos : (detalle.codigos_combos != null ? detalle.codigos_combos : null),
                                    codigos_combos_regalado: libroPedido && libroPedido.codigos_combos_regalado != null ? libroPedido.codigos_combos_regalado : (detalle.codigos_combos_regalado != null ? detalle.codigos_combos_regalado : null)
                                },
                                cantidad: detalle.cantidad.toString(),
                                descuento: parseFloat(detalle.descuento || 0).toString(),
                                cantidadOriginal: parseInt(detalle.cantidad),
                                confirmado: true,
                                resultadosBusqueda: [],
                                sugerenciaActual: null,
                                consultandoStock: false,
                                stockError: false,
                                errorCantidad: '',
                                errorDescuento: ''
                            };
                        });
                        
                        // Agregar una fila vacía solo cuando aún hay libros por agregar
                        if (me.hayLibrosDisponiblesParaAgregar) {
                            me.filasCaptura.push({
                                textoBusqueda: '',
                                libroSeleccionado: null,
                                cantidad: '',
                                descuento: '0',
                                confirmado: false,
                                resultadosBusqueda: [],
                                sugerenciaActual: null,
                                consultandoStock: false,
                                stockError: false,
                                errorCantidad: '',
                                errorDescuento: ''
                            });
                        }
                        
                        // Crear detallesVenta para compatibilidad con métodos existentes
                        me.detallesVenta = data.detalles.map(detalle => {
                            const cantidadDelPedido = parseInt(detalle.cantidad_pedido || 0);
                            const cantidadOtrasVentas = parseInt(detalle.cantidad_otras_ventas || 0);
                            const cantidad = parseInt(detalle.cantidad);
                            const libroPedidoDetalle = me.librosPedido.find(lp => lp.pro_codigo === detalle.pro_codigo);
                            return {
                                pro_codigo: detalle.pro_codigo,
                                nombre_libro: detalle.nombre_libro,
                                linea_producto_id: detalle.linea_producto_id != null ? parseInt(detalle.linea_producto_id, 10) : 0,
                                cantidad: cantidad,
                                cantidadVenta: cantidad,
                                cantidadOriginal: cantidad,
                                cantidadPedida: cantidadDelPedido,
                                cantidadOtrasVentas: cantidadOtrasVentas,
                                cantidadTotalVendida: cantidad + cantidadOtrasVentas,
                                descuentoIndividual: parseFloat(detalle.descuento || 0),
                                descuentoOriginal: parseFloat(detalle.descuento || 0),
                                precio: parseFloat(detalle.precio || 0),
                                pvp: parseFloat(detalle.precio || 0),
                                subtotal: parseFloat(detalle.precio || 0) * cantidad,
                                stock: 0,
                                // Campos combo
                                grupo_codigo_para_v3: libroPedidoDetalle && libroPedidoDetalle.grupo_codigo_para_v3 != null ? libroPedidoDetalle.grupo_codigo_para_v3 : (detalle.grupo_codigo_para_v3 != null ? detalle.grupo_codigo_para_v3 : null),
                                codigos_combos: libroPedidoDetalle && libroPedidoDetalle.codigos_combos != null ? libroPedidoDetalle.codigos_combos : (detalle.codigos_combos != null ? detalle.codigos_combos : null),
                                codigos_combos_regalado: libroPedidoDetalle && libroPedidoDetalle.codigos_combos_regalado != null ? libroPedidoDetalle.codigos_combos_regalado : (detalle.codigos_combos_regalado != null ? detalle.codigos_combos_regalado : null)
                            };
                        });
                        
                        // Guardar reservas originales
                        me.detallesVenta.forEach(detalle => {
                            me.reservasOriginales[detalle.pro_codigo] = {
                                cantidad: detalle.cantidadOriginal,
                                reserva_perseo: detalle.cantidadOriginal
                            };
                        });
                        
                        // Guardar copia de los datos originales
                        me.datosOriginales = {
                            ventaData: { ...me.ventaData },
                            detallesVenta: JSON.parse(JSON.stringify(me.detallesVenta)),
                            lugarDespacho: { ...me.lugarDespacho },
                            clientePerseo: { ...me.clientePerseo }
                        };
                        
                        
                        // Cargar empresas
                        await me.getEmpresas();
                        
                        // ✅ Aplicar descuentos según tipo de venta
                        if (me.esVentaDirecta()) {
                            // VENTA DIRECTA: Usar descuento del contrato, sin consultar lugar despacho
                            me.aplicarDescuentosContratoVentaDirectaEdicion();
                        } else {
                            // VENTA POR LISTA/TOTALIZADO: Consultar cupo del lugar y aplicar descuentos
                            await me.consultarCupoLugarDespacho();
                        }

                        // Consultar stock actual en Perseo
                        await me.consultarStockLibros();
                        
                        me.loadingDatos = false;
                        
                        me.$vs.notify({
                            text: 'Datos de venta cargados correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 2000
                        });
                    } else {
                        throw new Error(response.data.message || 'Error al cargar datos de la venta');
                    }
                })
                .catch(error => {
                    me.$vs.notify({
                        title: 'Error al cargar datos',
                        text: error.message || 'Error al cargar los datos de la venta',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle'
                    });
                    me.loadingDatos = false;
                });
        },
        
        // ==========================================
        // MÉTODOS AUXILIARES ADAPTADOS
        // ==========================================
        getCambioColor(libro) {
            const cantidadNueva = parseInt(libro.cantidadVenta || 0);
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            
            if (diferencia > 0) return 'success'; // Aumentó
            if (diferencia < 0) return 'warning'; // Disminuyó
            return 'dark'; // Sin cambio
        },
        
        getCambioTexto(libro) {
            const cantidadNueva = parseInt(libro.cantidadVenta || 0);
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
        
        calcularDisponible(libro) {
            // Cantidad pedida menos lo que ya está vendido (sin contar esta venta)
            const cantidadPedida = parseInt(libro.cantidad || 0);
            const yaVendido = parseInt(libro.cantidadVendida || 0);
            const disponible = cantidadPedida - yaVendido;
            return disponible > 0 ? disponible : 0;
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
                return 'Consultando stock...';
            }
            
            const cantidadNueva = parseInt(libro.cantidadVenta || 0);
            const cantidadOriginal = libro.cantidadOriginal || 0;
            const cantidadPedida = libro.cantidadPedida || 0;
            const cantidadOtrasVentas = libro.cantidadOtrasVentas || 0;
            const diferencia = cantidadNueva - cantidadOriginal;
            const disponible = cantidadPedida - cantidadOtrasVentas;
            
            let texto = `📦 PEDIDO ORIGINAL: ${cantidadPedida} unidades`;
            texto += `\n\n🔹 Esta venta (original): ${cantidadOriginal}`;
            
            if (cantidadOtrasVentas > 0) {
                texto += `\n⚠️ Otras ventas: ${cantidadOtrasVentas} unidades`;
            }
            
            texto += `\n✅ Disponible máximo: ${disponible} unidades`;
            texto += `\n\n📊 Stock disponible: ${stockActual} unidades`;
            
            if (diferencia !== 0) {
                texto += `\n\n🔄 Cambio propuesto: ${diferencia > 0 ? '+' : ''}${diferencia}`;
                
                if (diferencia > 0) {
                    texto += `\n   Requiere: ${diferencia} unidades adicionales de Perseo`;
                    
                    // Validar contra pedido
                    if (cantidadNueva > disponible) {
                        texto += `\n   ❌ EXCEDE EL PEDIDO (máx: ${disponible})`;
                    } else if (stockActual < diferencia) {
                        texto += '\n   ❌ Stock insuficiente';
                    } else {
                        texto += '\n   ✓ Validaciones OK';
                    }
                } else {
                    texto += `\n   Se liberarán: ${Math.abs(diferencia)} unidades`;
                }
            } else {
                texto += '\n\nSin cambios propuestos';
            }
            
            return texto;
        },
        
        validarCantidadListado(libro, mostrarNotificaciones = true) {
            const cantidadNueva = parseInt(libro.cantidadVenta);
            
            // Validación simple: solo verificar que sea mayor a 0
            if (libro.cantidadVenta === '' || libro.cantidadVenta === null) {
                return true;
            }
            
            if (cantidadNueva <= 0) {
                if (mostrarNotificaciones) {
                    this.$vs.notify({
                        title: '⚠️ Cantidad Inválida',
                        text: 'La cantidad debe ser mayor a 0',
                        color: 'warning'
                    });
                }
                return false;
            }
            
            // Validar contra cantidad disponible del pedido
            const cantidadPedida = libro.cantidadPedida || 0;
            const cantidadOtrasVentas = libro.cantidadOtrasVentas || 0;
            const disponible = cantidadPedida - cantidadOtrasVentas;
            
            if (cantidadPedida > 0 && cantidadNueva > disponible) {
                if (mostrarNotificaciones) {
                    this.$vs.notify({
                        title: '⚠️ Cantidad Excede el Disponible',
                        text: `Solo puede vender ${disponible} unidades de este libro. Pedido: ${cantidadPedida}, ya en otras ventas: ${cantidadOtrasVentas}`,
                        color: 'warning'
                    });
                }
                return false;
            }
            
            return true;
        },
        
        // ==========================================
        // INICIALIZACIÓN
        // ==========================================
        inicializarEdicion() {
            this.getEmpresas();
            this.cargarDatosVenta();
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
                    me.$vs.loading.close();
                });
        },
        
        hayModificaciones() {
            if (!this.datosOriginales) return false;
            
            const cambiosBasicos = 
                this.ventaData.id_empresa !== this.datosOriginales.ventaData.id_empresa ||
                this.ventaData.ven_observacion !== this.datosOriginales.ventaData.ven_observacion ||
                (this.ventaData.concepto_perseo || '').trim() !== (this.datosOriginales.ventaData.concepto_perseo || '').trim();
            
            const cambioDespacho = this.nuevoLugarDespacho !== null;
            const cambioCliente = this.nuevoClientePerseo !== null;
            
            return cambiosBasicos || cambioDespacho || cambioCliente;
        },
        
        hayModificacionesEnLibros() {
            if (!this.datosOriginales || !this.datosOriginales.detallesVenta) return false;
            
            // ✅ Comparar directamente con detallesVenta
            for (let detalle of this.detallesVenta) {
                const cantidadActual = parseInt(detalle.cantidadVenta || 0);
                const cantidadOriginal = parseInt(detalle.cantidadOriginal || 0);
                const descuentoActual = parseFloat(detalle.descuentoIndividual || 0);
                const descuentoOriginal = parseFloat(detalle.descuentoOriginal || detalle.descuentoIndividual || 0);
                
                if (cantidadActual !== cantidadOriginal) {
                    return true;
                }
                if (descuentoActual !== descuentoOriginal) {
                    return true;
                }
            }
            
            return false;
        },
        
        calcularTotalesUnificados() {
            // ✅ Calcular totales de detallesVenta
            const librosParaVenta = this.detallesVenta.filter(libro => 
                libro.cantidadVenta && parseInt(libro.cantidadVenta) > 0
            );
            
            const subtotal = librosParaVenta.reduce((total, libro) => {
                const precio = parseFloat(libro.precio || libro.pvp || 0);
                const cantidad = parseInt(libro.cantidadVenta) || 0;
                return total + (precio * cantidad);
            }, 0);

            const descuentoMonto = librosParaVenta.reduce((total, libro) => {
                const precio = parseFloat(libro.precio || libro.pvp || 0);
                const cantidad = parseInt(libro.cantidadVenta) || 0;
                const descuentoPorcentaje = parseFloat(libro.descuentoIndividual || 0);
                const subtotalLibro = precio * cantidad;
                return total + (subtotalLibro * descuentoPorcentaje / 100);
            }, 0);

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
                cantidadLibros: librosParaVenta.length
            };
        },
        
        calcularSubtotalLibro(libro) {
            if (!libro.cantidadVenta || parseInt(libro.cantidadVenta) === 0) {
                return '0.00';
            }
            const precio = parseFloat(libro.precio || libro.pvp || 0);
            const cantidad = parseInt(libro.cantidadVenta) || 0;
            return (precio * cantidad).toFixed(2);
        },
        
        contarLibrosConCantidad() {
            return this.detallesVenta.filter(libro => 
                libro.cantidadVenta && parseInt(libro.cantidadVenta) > 0
            ).length;
        },
        
        hayProductosEnOtrasVentas() {
            return this.detallesVenta.some(libro => 
                (libro.cantidadOtrasVentas || 0) > 0
            );
        },
        
        calcularDisponibleVenta(libro) {
            // Máximo que puede vender = Pedido - Otras Ventas
            const cantidadPedida = libro.cantidadPedida || 0;
            const cantidadOtrasVentas = libro.cantidadOtrasVentas || 0;
            const disponible = cantidadPedida - cantidadOtrasVentas;
            return disponible > 0 ? disponible : 0;
        },
        
        hayProductosCercaLimitePedido() {
            return this.detallesVenta.some(libro => {
                const disponible = this.calcularDisponibleVenta(libro);
                const pedido = libro.cantidadPedida || 0;
                // Considerar "cerca del límite" si quedan menos del 20% del pedido original
                return pedido > 0 && disponible > 0 && disponible < (pedido * 0.2);
            });
        },
        
        obtenerProductosCercaLimite() {
            return this.detallesVenta.filter(libro => {
                const disponible = this.calcularDisponibleVenta(libro);
                const pedido = libro.cantidadPedida || 0;
                return pedido > 0 && disponible > 0 && disponible < (pedido * 0.2);
            });
        },
        
        obtenerColorDisponible(libro) {
            const disponible = this.calcularDisponibleVenta(libro);
            const pedido = libro.cantidadPedida || 0;
            
            if (disponible === 0) return 'danger'; // Sin disponibilidad
            if (pedido > 0 && disponible < (pedido * 0.2)) return 'warning'; // Menos del 20%
            return 'success'; // OK
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
                1: 'Despachado',
                2: 'Pendiente',
                3: 'Anulado'
            };
            return textos[estado] || 'Desconocido';
        },
        
        normalizarDescuentoPrincipal() {
            if (this.ventaData.ven_descuento !== '' && this.ventaData.ven_descuento !== null) {
                const valor = parseFloat(this.ventaData.ven_descuento);
                if (!isNaN(valor)) {
                    this.ventaData.ven_descuento = valor;
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
                if (this.ventaData.ven_descuento !== '' && this.ventaData.ven_descuento !== null) {
                    let valor = parseFloat(this.ventaData.ven_descuento);
                    
                    if (!isNaN(valor)) {
                        if (valor > 100) {
                            this.ventaData.ven_descuento = 100;
                        } else if (valor < 0) {
                            this.ventaData.ven_descuento = 0;
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
            const tipoVenta = (this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta) || (this.ventaData && this.ventaData.tipo_venta);
            return tipoVenta == 2;
        },

        esVentaDirecta() {
            const tipoVenta = (this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta) || (this.ventaData && this.ventaData.tipo_venta);
            return tipoVenta == 1;
        },

        esPrefacturaEditar() {
            return parseInt(this.ventaData.idtipodoc, 10) === 1;
        },
        
        intentarGuardarCambios() {
            let me = this;
            let erroresFaltantes = [];
            
            const hayCambiosBasicos = me.hayModificaciones();
            const hayCambiosEnLibros = me.hayModificacionesEnLibros();
            
            if (!hayCambiosBasicos && !hayCambiosEnLibros) {
                erroresFaltantes.push('• <b>No se han realizado modificaciones</b> en la venta');
            }

            // ✅ Validar en detallesVenta, NO en librosPedido
            const librosConCantidad = me.detallesVenta.filter(libro => 
                libro.cantidadVenta && parseInt(libro.cantidadVenta) > 0
            );
            
            if (librosConCantidad.length === 0) {
                erroresFaltantes.push('• Debe tener al menos <b>un libro con cantidad mayor a 0</b>');
            }

            // Validar que no existan filas con libro seleccionado pero cantidad vacia o en 0
            const filasInvalidasCantidad = [];
            if (me.filasCaptura && Array.isArray(me.filasCaptura)) {
                me.filasCaptura.forEach((fila, index) => {
                    if (!fila || !fila.libroSeleccionado) {
                        return;
                    }

                    const cantidadTexto = fila.cantidad != null ? String(fila.cantidad).trim() : '';
                    const cantidadNumero = cantidadTexto !== '' ? parseInt(cantidadTexto, 10) : 0;

                    if (cantidadTexto === '' || isNaN(cantidadNumero) || cantidadNumero <= 0) {
                        filasInvalidasCantidad.push(index + 1);
                    }
                });
            }

            if (filasInvalidasCantidad.length > 0) {
                erroresFaltantes.push('• Las filas ' + filasInvalidasCantidad.join(', ') + ' tienen <b>cantidad vacia o en 0</b>. Debe corregirlas para guardar');
            }
            
            // ✅ Validar que las cantidades no excedan el disponible del pedido
            const librosExcedidos = [];
            me.filasCaptura.forEach(fila => {
                if (fila.libroSeleccionado && fila.cantidad) {
                    const cantidad = parseInt(fila.cantidad);
                    const cantidadPedida = fila.libroSeleccionado.cantidadPedida != null
                        ? parseInt(fila.libroSeleccionado.cantidadPedida, 10)
                        : (fila.libroSeleccionado.cantidad != null ? parseInt(fila.libroSeleccionado.cantidad, 10) : 0);
                    const cantidadOtrasVentas = fila.libroSeleccionado.cantidadOtrasVentas != null
                        ? parseInt(fila.libroSeleccionado.cantidadOtrasVentas, 10)
                        : (fila.libroSeleccionado.cantidadVendida != null ? parseInt(fila.libroSeleccionado.cantidadVendida, 10) : 0);
                    const disponible = cantidadPedida - cantidadOtrasVentas;
                    
                    if (cantidadPedida > 0 && cantidad > disponible) {
                        librosExcedidos.push({
                            nombre: fila.libroSeleccionado.nombre_libro,
                            pedido: cantidadPedida,
                            otras: cantidadOtrasVentas,
                            intenta: cantidad,
                            disponible: disponible
                        });
                    }
                }
            });
            
            if (librosExcedidos.length > 0) {
                librosExcedidos.forEach(libro => {
                    erroresFaltantes.push(`• <b>${libro.nombre}</b>: Intenta vender ${libro.intenta}, pero solo hay ${libro.disponible} disponibles (Pedido: ${libro.pedido}, en otras ventas: ${libro.otras})`);
                });
            }
            
            const filasDescuentoInvalido = [];
            if (me.filasCaptura && Array.isArray(me.filasCaptura)) {
                me.filasCaptura.forEach((fila, index) => {
                    if (!fila || !fila.libroSeleccionado) {
                        return;
                    }

                    const descuentoTexto = fila.descuento != null ? String(fila.descuento).trim() : '';
                    if (descuentoTexto === '') {
                        filasDescuentoInvalido.push(index + 1);
                        return;
                    }

                    const descuentoNumero = parseInt(descuentoTexto, 10);
                    if (isNaN(descuentoNumero) || descuentoNumero < 0 || descuentoNumero > 100) {
                        filasDescuentoInvalido.push(index + 1);
                    }
                });
            }

            if (filasDescuentoInvalido.length > 0) {
                erroresFaltantes.push('• Las filas ' + filasDescuentoInvalido.join(', ') + ' tienen <b>descuento inválido</b>. Debe estar entre 0 y 100');
            }

            // Validar combos: no permitir guardar si algún combo tiene stock insuficiente o no verificado
            if (me.filasCaptura && Array.isArray(me.filasCaptura)) {
                me.filasCaptura.forEach((fila, index) => {
                    if (!fila || !fila.libroSeleccionado) return;
                    if (!me.esLibroComboParaStock(fila.libroSeleccionado)) return;
                    const cantidadTexto = fila.cantidad != null ? String(fila.cantidad).trim() : '';
                    if (cantidadTexto === '' || parseInt(cantidadTexto, 10) <= 0) return;
                    if (fila.libroSeleccionado.puede_vender === null || fila.libroSeleccionado.consultandoStockCombo) {
                        erroresFaltantes.push(`• Fila ${index + 1} (<b>${fila.libroSeleccionado.pro_codigo}</b>): esperando verificación de stock del combo`);
                    } else if (fila.libroSeleccionado.puede_vender === false) {
                        erroresFaltantes.push(`• Fila ${index + 1} (<b>${fila.libroSeleccionado.pro_codigo}</b>): stock insuficiente en componentes del combo`);
                    }
                });
            }
            
            // Validar concepto_perseo
            if (!me.ventaData.concepto_perseo || me.ventaData.concepto_perseo.trim() === '') {
                erroresFaltantes.push('• El <b>Concepto Perseo</b> es obligatorio');
            } else if (me.ventaData.concepto_perseo.length > 200) {
                erroresFaltantes.push('• El <b>Concepto Perseo</b> no puede exceder los 200 caracteres');
            }
            
            // Validar observación
            if (me.ventaData.ven_observacion && me.ventaData.ven_observacion.length > 200) {
                erroresFaltantes.push('• La <b>Observación</b> no puede exceder los 200 caracteres');
            }
            
            // ✅ VALIDACIÓN DE CUPO (solo si es primera venta y no es obsequio)
            if (me.debeMostrarCupo) {
                const lugarDespacho = me.nuevoLugarDespacho || me.lugarDespacho;
                if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                    erroresFaltantes.push('• El <b>Lugar de Despacho</b> no tiene cupo configurado. Por favor, configure el cupo antes de continuar.');
                } else {
                    const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
                    const totalVenta = me.calcularTotalesUnificados().total || 0;
                    
                    if (cupoInicial <= 0) {
                        erroresFaltantes.push('• El <b>Cupo</b> debe ser mayor a 0. Por favor, edite el cupo del lugar de despacho.');
                    } else if (totalVenta > cupoInicial) {
                        erroresFaltantes.push(`• El <b>Total de la venta ($${totalVenta.toFixed(2)})</b> excede el cupo disponible <b>($${cupoInicial.toFixed(2)})</b>`);
                    }
                }
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

            this.consultarCupoLugarDespacho();
        },
        
        cerrarBusquedaDespacho() {
            this.mostrarBusquedaDespacho = false;
        },
        
        cancelarCambioDespacho() {
            this.nuevoLugarDespacho = null;
            
            // Aplicar lógica de descuentos al tipo de venta
            if (this.esVentaDirecta()) {
                // DIRECTA: descuentos por línea desde contrato
                this.aplicarDescuentosContratoVentaDirectaEdicion();
            } else {
                // LISTA/TOTALIZADO: Prolipa sin despacho = 0, Iluminar = 60
                this.descuentoLineaProlipa = 0;
                this.descuentoLineaIluminar = 60;
            }
        },
        
        abrirBusquedaCliente() {
            if (!this.ventaData.id_empresa) {
                this.$vs.notify({
                    text: 'Debe seleccionar una empresa primero',
                    color: 'warning'
                });
                return;
            }
            this.mostrarBusquedaCliente = true;
        },
        
        seleccionarNuevoCliente(cliente) {
            // Validar que no sea el mismo cliente actual
            const clienteActualCedula = this.clientePerseo.cedula;
            const clienteActualId = this.ventaData.clientesidPerseo;
            
            if (cliente.cedula === clienteActualCedula || cliente.clientesidPerseo === clienteActualId) {
                this.$vs.notify({
                    text: 'El cliente seleccionado es el mismo que el cliente actual de la venta',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    position: 'top-right'
                });
                return;
            }
            
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
            const libroActual = this.detallesVenta[index];
            
            // Validar cantidad
            if (!libroActual.cantidadVenta || libroActual.cantidadVenta.toString().trim() === '') {
                this.$vs.notify({
                    text: 'Debe ingresar una cantidad válida',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const cantidadNueva = parseInt(libroActual.cantidadVenta);
            
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
            
            if (siguienteIndex >= this.detallesVenta.length) {
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
            if (!libro.cantidadVenta || libro.cantidadVenta.toString().trim() === '' || parseInt(libro.cantidadVenta) === 0) {
                this.$set(libro, 'cantidadVenta', '0');
                
                this.$vs.notify({
                    text: `Cantidad establecida en 0`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-minus-circle'
                });
            }
        },
        
        limpiarCantidadLibro(libro, index) {
            // Poner cantidad en 0
            this.$set(libro, 'cantidadVenta', '0');
            
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
            if (!this.hayLibrosDisponiblesParaAgregar) {
                return;
            }
            this.filasCaptura.push({ 
                textoBusqueda: '', 
                libroSeleccionado: null, 
                cantidad: '', 
                descuento: '0',
                confirmado: false, 
                resultadosBusqueda: [],
                sugerenciaActual: null,
                consultandoStock: false,
                stockError: false,
                errorDescuento: ''
            });
        },
        
        // Sincronizar cantidades pedidas desde el prop librosPedido
        sincronizarCantidadesPedidas() {
            if (!this.librosPedido || this.librosPedido.length === 0) {
                return;
            }
            if (!this.filasCaptura || this.filasCaptura.length === 0) {
                return;
            }
            
            
            let actualizados = 0;
            this.filasCaptura.forEach(fila => {
                if (fila.libroSeleccionado) {
                    const libroPedido = this.librosPedido.find(lp => lp.pro_codigo === fila.libroSeleccionado.pro_codigo);
                    
                    if (libroPedido && libroPedido.cantidad) {
                        const cantidadPedida = parseInt(libroPedido.cantidad || 0);
                        
                        // Actualizar solo si es diferente
                        if (fila.libroSeleccionado.cantidad !== cantidadPedida) {
                            fila.libroSeleccionado.cantidad = cantidadPedida;
                            fila.libroSeleccionado.cantidadPedida = cantidadPedida;
                            actualizados++;
                        }
                    }
                }
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
            
            // ✅ Obtener códigos ya en detallesVenta (no permitir duplicados)
            const codigosEnVenta = this.detallesVenta.map(d => d.pro_codigo);
            
            // Obtener códigos ya seleccionados en otras filas de captura
            const codigosSeleccionados = this.filasCaptura
                .filter((f, idx) => idx !== index && f.libroSeleccionado)
                .map(f => f.libroSeleccionado.pro_codigo);
            
            // ✅ Combinar ambas listas para excluirlos
            const codigosExcluir = [...codigosEnVenta, ...codigosSeleccionados];
            
            // Filtrar libros que NO estén ya en la venta ni en otras filas
            const librosDisponibles = this.librosConStock.filter(libro => 
                !codigosExcluir.includes(libro.pro_codigo) && this.libroCoincideConLineaSeleccionada(libro)
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
            
            // Sincronizar con detallesVenta
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
            
            // Sincronizar con detallesVenta
            this.sincronizarFilaConDetalles(fila);
            
            // Si es la última fila, agregar nueva automáticamente
            if (index === this.filasCaptura.length - 1) {
                if (this.hayLibrosDisponiblesParaAgregar) {
                    this.agregarFilaCaptura();
                    this.$nextTick(() => {
                        const nuevoInput = document.getElementById(`input-busqueda-${index + 1}`);
                        if (nuevoInput) {
                            nuevoInput.focus();
                        }
                    });
                }
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
            // ✅ VALIDACIÓN: No permitir eliminar si es el ÚLTIMO item en el editar
            if (fila.libroSeleccionado && this.detallesVenta.length === 1) {
                const itemAEliminar = this.detallesVenta.find(d => 
                    d.pro_codigo === fila.libroSeleccionado.pro_codigo
                );
                if (itemAEliminar) {
                    this.$vs.notify({
                        title: 'No permitido',
                        text: 'No puedes eliminar el último item de la venta. Debe haber al menos un item.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time: 3000
                    });
                    return; // Salir sin eliminar
                }
            }
            
            // Si tenía libro seleccionado, quitar de detallesVenta
            if (fila.libroSeleccionado) {
                const indiceDetalle = this.detallesVenta.findIndex(d => 
                    d.pro_codigo === fila.libroSeleccionado.pro_codigo
                );
                if (indiceDetalle !== -1) {
                    this.detallesVenta.splice(indiceDetalle, 1);
                }
            }
            
            // Limpiar COMPLETAMENTE la fila para que quede como nueva
            fila.textoBusqueda = '';
            fila.libroSeleccionado = null;
            fila.cantidad = '';
            fila.descuento = '0';
            fila.confirmado = false;
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
            fila.errorCantidad = '';
            fila.errorDescuento = '';
            fila.consultandoStock = false;
            fila.cantidadOriginal = undefined; // Resetear completamente
            
            // Forzar update para que Vue recalcule librosDisponiblesParaFila()
            // y permita volver a agregar el libro eliminado
            this.$nextTick(() => {
                this.$forceUpdate();
                // Enfocar el v-select de esta fila
                this.enfocarSelect(index);
            });
        },
        
        sincronizarFilaConDetalles(fila) {
            if (!fila.libroSeleccionado) return;
            
            // Buscar si ya existe en detallesVenta
            const detalleExistente = this.detallesVenta.find(d => 
                d.pro_codigo === fila.libroSeleccionado.pro_codigo
            );
            
            if (detalleExistente) {
                // Actualizar cantidad del libro existente
                detalleExistente.cantidadVenta = fila.cantidad || '0';
                detalleExistente.descuentoIndividual = parseFloat(fila.descuento || 0);
            } else if (fila.cantidad && parseInt(fila.cantidad) > 0) {
                // Buscar en librosPedido para obtener los datos completos
                const libroPedido = this.librosPedido.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                
                
                
                // Agregar nuevo libro a detallesVenta
                this.detallesVenta.push({
                    pro_codigo: fila.libroSeleccionado.pro_codigo,
                    nombre_libro: fila.libroSeleccionado.nombre_libro,
                    nombrelibro: fila.libroSeleccionado.nombre_libro,
                    linea_producto_id: fila.libroSeleccionado.linea_producto_id != null ? parseInt(fila.libroSeleccionado.linea_producto_id, 10) : 0,
                    precio: fila.libroSeleccionado.precio,
                    cantidadVenta: fila.cantidad,
                    cantidadOriginal: 0,
                    cantidadPedida: libroPedido ? (libroPedido.cantidad || 0) : 0,
                    cantidadOtrasVentas: libroPedido ? (libroPedido.cantidadVendida || 0) : 0,
                    cantidadTotalVendida: libroPedido ? (libroPedido.cantidadVendida || 0) : 0,
                    descuentoIndividual: parseFloat(fila.descuento || this.obtenerDescuentoInicialFila(fila.libroSeleccionado) || 0),
                    descuentoOriginal: 0,
                    stock_perseo_actual: fila.libroSeleccionado.stock_perseo_actual || fila.libroSeleccionado.stock || 0,
                    stock_perseo_historico: 0,
                    stock: fila.libroSeleccionado.stock || 0,
                    // Campos combo
                    grupo_codigo_para_v3: fila.libroSeleccionado.grupo_codigo_para_v3 != null ? fila.libroSeleccionado.grupo_codigo_para_v3 : null,
                    codigos_combos: fila.libroSeleccionado.codigos_combos != null ? fila.libroSeleccionado.codigos_combos : null,
                    codigos_combos_regalado: fila.libroSeleccionado.codigos_combos_regalado != null ? fila.libroSeleccionado.codigos_combos_regalado : null
                });
            }
        },
        
        validarYSincronizarCantidad(fila, index) {
            fila.errorCantidad = '';
            
            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                // Resetear estado combo si borraron la cantidad
                if (fila.libroSeleccionado && this.esLibroComboParaStock(fila.libroSeleccionado)) {
                    this.$set(fila.libroSeleccionado, 'stock', null);
                    this.$set(fila.libroSeleccionado, 'puede_vender', null);
                    this.$set(fila.libroSeleccionado, 'detalle_faltantes_combo', []);
                }
                this.sincronizarFilaConDetalles(fila);
                return;
            }
            
            const cantidad = parseInt(fila.cantidad);
            if (cantidad <= 0) {
                fila.errorCantidad = 'La cantidad debe ser mayor a 0';
                return;
            }
            
            if (fila.libroSeleccionado) {
                // Validar contra pedido disponible (aplica a todos)
                const cantidadPedida = fila.libroSeleccionado.cantidadPedida != null
                    ? parseInt(fila.libroSeleccionado.cantidadPedida, 10)
                    : (fila.libroSeleccionado.cantidad != null ? parseInt(fila.libroSeleccionado.cantidad, 10) : 0);
                if (cantidadPedida > 0) {
                    const cantidadOtrasVentas = fila.libroSeleccionado.cantidadOtrasVentas != null
                        ? parseInt(fila.libroSeleccionado.cantidadOtrasVentas, 10)
                        : (fila.libroSeleccionado.cantidadVendida != null ? parseInt(fila.libroSeleccionado.cantidadVendida, 10) : 0);
                    const disponible = cantidadPedida - cantidadOtrasVentas;
                    if (cantidad > disponible) {
                        fila.errorCantidad = `Cantidad no puede exceder ${disponible} (Pedido: ${cantidadPedida}, ya en otras ventas: ${cantidadOtrasVentas})`;
                        return;
                    }
                }

                // Para combos: consultar stock con la cantidad ingresada (debounce)
                if (this.esLibroComboParaStock(fila.libroSeleccionado)) {
                    if (fila.consultaStockComboTimer) { clearTimeout(fila.consultaStockComboTimer); }
                    // Marcar inmediatamente como pendiente para que el ❌ anterior no confunda
                    this.$set(fila.libroSeleccionado, 'puede_vender', null);
                    fila.errorCantidad = '';
                    fila.consultaStockComboTimer = setTimeout(() => {
                        this.consultarStockComboConCantidad(fila, index);
                    }, 450);
                    this.sincronizarFilaConDetalles(fila);
                    return;
                }

                // Producto simple: validar contra stock límite (min plataforma/Perseo en prefactura, o plataforma en otros)
                const stockLimite = fila.libroSeleccionado.stock || 0;
                const cantidadOriginal = fila.libroSeleccionado.cantidadOriginal || 0;
                const diferencia = cantidad - cantidadOriginal;

                const stockPerseo = fila.libroSeleccionado.stock_perseo != null ? parseInt(fila.libroSeleccionado.stock_perseo, 10) : null;
                const stockPlataforma = fila.libroSeleccionado.stock_plataforma != null ? parseInt(fila.libroSeleccionado.stock_plataforma, 10) : stockLimite;

                if (diferencia > 0 && stockLimite < diferencia) {
                    if (this.esPrefacturaEditar() && stockPerseo !== null && stockPerseo < diferencia) {
                        fila.errorCantidad = `⚠️ Stock Perseo insuficiente: ${stockPerseo} disponibles (plataforma: ${stockPlataforma}). Requiere: ${diferencia} adicionales.`;
                    } else if (this.esPrefacturaEditar()) {
                        fila.errorCantidad = `⚠️ Stock plataforma insuficiente: ${stockPlataforma} disponibles. Requiere: ${diferencia} adicionales.`;
                    } else {
                        fila.errorCantidad = `⚠️ Stock insuficiente. Disponible: ${stockLimite}, Requiere: ${diferencia}`;
                    }
                    return;
                }
                if (cantidadOriginal === 0 && cantidad > stockLimite) {
                    if (this.esPrefacturaEditar() && stockPerseo !== null && stockPerseo < cantidad) {
                        fila.errorCantidad = `⚠️ Stock Perseo insuficiente: ${stockPerseo} disponibles (plataforma: ${stockPlataforma}). Máximo: ${stockLimite}.`;
                    } else if (this.esPrefacturaEditar()) {
                        fila.errorCantidad = `⚠️ Stock plataforma insuficiente: ${stockPlataforma} disponibles. Máximo: ${stockLimite}.`;
                    } else {
                        fila.errorCantidad = `Stock insuficiente (máx: ${stockLimite})`;
                    }
                    return;
                }
            }
            
            this.sincronizarFilaConDetalles(fila);
        },

        consultarStockComboConCantidad(fila, index) {
            const me = this;
            const cantidad = parseInt(fila.cantidad, 10);
            if (!fila.libroSeleccionado || isNaN(cantidad) || cantidad <= 0) return;

            // En edición: el stock real ya fue descontado cuando se creó la venta.
            // Solo necesitamos verificar si hay stock para la DIFERENCIA adicional.
            // Si cantidad <= cantidadOriginal, no se necesita stock extra → siempre puede vender.
            const cantidadOriginal = fila.cantidadOriginal != null ? parseInt(fila.cantidadOriginal, 10) : 0;
            const diferencia = cantidad - cantidadOriginal;

            if (diferencia <= 0) {
                // Reduciendo o manteniendo: siempre OK, no necesita stock adicional
                this.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);
                this.$set(fila.libroSeleccionado, 'puede_vender', true);
                this.$set(fila.libroSeleccionado, 'stock', cantidadOriginal);
                this.$set(fila.libroSeleccionado, 'stock_combo_componentes', []);
                this.$set(fila.libroSeleccionado, 'detalle_faltantes_combo', []);
                fila.errorCantidad = '';
                me.sincronizarFilaConDetalles(fila);
                return;
            }

            // Aumentando: verificar si hay stock para la diferencia adicional
            this.$set(fila.libroSeleccionado, 'consultandoStockCombo', true);
            this.$set(fila.libroSeleccionado, 'puede_vender', null);

            me.consultarStockPerseo([me.construirConsultaStockPerseo(fila.libroSeleccionado, diferencia)], me.ventaData.id_empresa)
            .then(stockData => {
                if (!fila.libroSeleccionado) return;
                this.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);
                const codigo = fila.libroSeleccionado.pro_codigo;
                if (stockData && stockData[codigo]) {
                    const stockInfo = stockData[codigo];
                    // Stock visible = stock real + lo que ya tiene esta venta
                    const stockReal = parseInt(stockInfo.existenciastotales != null ? stockInfo.existenciastotales : 0, 10);
                    this.$set(fila.libroSeleccionado, 'stock', stockReal + cantidadOriginal);
                    this.$set(fila.libroSeleccionado, 'es_combo', !!stockInfo.es_combo);
                    this.$set(fila.libroSeleccionado, 'mensaje_stock_combo', stockInfo.mensaje_stock_combo || null);
                    this.$set(fila.libroSeleccionado, 'detalle_faltantes_combo', Array.isArray(stockInfo.detalle_faltantes_combo) ? stockInfo.detalle_faltantes_combo : []);
                    this.$set(fila.libroSeleccionado, 'stock_combo_componentes', Array.isArray(stockInfo.stock_combo_componentes) ? stockInfo.stock_combo_componentes : []);

                    const puedeVender = stockInfo.puede_vender !== undefined ? stockInfo.puede_vender : (stockReal >= diferencia);
                    this.$set(fila.libroSeleccionado, 'puede_vender', puedeVender);
                    if (!puedeVender) {
                        const msgError = stockInfo.mensaje_stock_combo
                            ? stockInfo.mensaje_stock_combo
                            : ((stockInfo.detalle_faltantes_combo || []).length > 0
                                ? 'Faltan: ' + stockInfo.detalle_faltantes_combo.join(', ')
                                : 'Stock insuficiente para el aumento solicitado');
                        fila.errorCantidad = `⚠️ ${msgError}`;
                    } else {
                        fila.errorCantidad = '';
                    }
                } else {
                    this.$set(fila.libroSeleccionado, 'puede_vender', false);
                    fila.errorCantidad = '⚠️ No se pudo verificar el stock del combo';
                }
                me.sincronizarFilaConDetalles(fila);
            })
            .catch(() => {
                if (!fila.libroSeleccionado) return;
                this.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);
                this.$set(fila.libroSeleccionado, 'puede_vender', false);
                fila.errorCantidad = '⚠️ Error al verificar stock del combo. Reintenta.';
                me.sincronizarFilaConDetalles(fila);
            });
        },
        
        manejarBorradoBusqueda(fila, index, event) {
            // Solo actuar si el campo de búsqueda está vacío
            if (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') {
                // Si es la primera fila (index 0), NO eliminar - solo mantener vacía
                if (index === 0) {
                    return;
                }
                
                // Si no es la primera fila y está vacía, eliminarla
                
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
                                    }
                                }
                            }
                        } else {
                            // Si no tiene libro, enfocar búsqueda
                            const inputBusqueda = document.getElementById(`input-busqueda-${index - 1}`);
                            if (inputBusqueda) {
                                inputBusqueda.focus();
                            }
                        }
                    }, 50);
                });
            }
        },
        
        manejarBorradoCantidad(fila, index) {
            // Verificar después de un pequeño delay si el campo quedó vacío
            this.$nextTick(() => {
                // Si la cantidad está vacía o es 0, limpiar el libro y enfocar el v-select
                if (!fila.cantidad || fila.cantidad.toString().trim() === '' || fila.cantidad === '0') {
                    
                    // ✅ VALIDACIÓN: No permitir eliminar si es el ÚLTIMO item en el editar (igual que en limpiarFilaCaptura)
                    if (fila.libroSeleccionado && this.detallesVenta.length === 1) {
                        const itemAEliminar = this.detallesVenta.find(d => 
                            d.pro_codigo === fila.libroSeleccionado.pro_codigo
                        );
                        if (itemAEliminar) {
                            this.$vs.notify({
                                title: 'No permitido',
                                text: 'No puedes eliminar el último item de la venta. Debe haber al menos un item.',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                time: 3000
                            });
                            // Restaurar la cantidad anterior para evitar confusion
                            fila.cantidad = fila.cantidadOriginal || '';
                            return;
                        }
                    }
                    
                    // Limpiar cantidad en detallesVenta si existe
                    if (fila.libroSeleccionado && this.detallesVenta && Array.isArray(this.detallesVenta)) {
                        const detalleEnTabla = this.detallesVenta.find(d => d.pro_codigo === fila.libroSeleccionado.pro_codigo);
                        if (detalleEnTabla) {
                            detalleEnTabla.cantidad = '';
                        }
                    }
                    
                    // Limpiar el libro seleccionado
                    fila.libroSeleccionado = null;
                    fila.textoBusqueda = '';
                    fila.cantidad = '';
                    fila.descuento = '0';
                    fila.confirmado = false;
                    fila.errorCantidad = '';
                    fila.errorDescuento = '';
                    fila.consultandoStock = false;
                    fila.stockError = false;
                    
                    // Enfocar el v-select de esta fila
                    this.enfocarSelect(index);
                }
            });
        },
        
        enfocarSelect(index) {
            this.$nextTick(() => {
                setTimeout(() => {
                    const selectRef = this.$refs[`select-libro-${index}`];
                    if (selectRef) {
                        // selectRef puede ser un array o un objeto directo
                        const selectComponent = Array.isArray(selectRef) ? selectRef[0] : selectRef;
                        if (selectComponent && selectComponent.$el) {
                            const inputElement = selectComponent.$el.querySelector('input[type="search"]') || 
                                                selectComponent.$el.querySelector('input');
                            if (inputElement) {
                                inputElement.focus();
                                inputElement.click(); // Abrir el dropdown también
                            }
                        }
                    }
                }, 150);
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
            const subtotal = precio * cantidad;
            const descuento = parseFloat(fila.descuento || 0);
            const total = subtotal - ((subtotal * descuento) / 100);
            return total.toFixed(2);
        },

        validarDescuento(fila) {
            fila.errorDescuento = '';

            const descuentoLimpio = fila.descuento !== null && fila.descuento !== undefined
                ? fila.descuento.toString().replace(/\D/g, '')
                : '';

            if (fila.descuento !== descuentoLimpio) {
                fila.descuento = descuentoLimpio;
            }

            if (!fila.descuento || fila.descuento.toString().trim() === '') {
                this.sincronizarFilaConDetalles(fila);
                this.calcularTotalesUnificados();
                return;
            }

            const descuento = parseInt(fila.descuento, 10);
            if (descuento < 0) {
                fila.errorDescuento = 'Descuento no puede ser negativo';
                fila.descuento = '0';
            } else if (descuento > 100) {
                fila.errorDescuento = 'Descuento máximo 100%';
                fila.descuento = '100';
            } else {
                fila.descuento = descuento.toString();
            }

            this.sincronizarFilaConDetalles(fila);
            this.calcularTotalesUnificados();
        },

        normalizarDescuentoFila(fila) {
            fila.errorDescuento = '';

            if (!fila.descuento || fila.descuento.toString().trim() === '') {
                fila.descuento = '0';
                this.sincronizarFilaConDetalles(fila);
                this.calcularTotalesUnificados();
                return;
            }

            let descuento = parseInt(fila.descuento, 10);
            if (isNaN(descuento) || descuento < 0) {
                descuento = 0;
            }
            if (descuento > 100) {
                descuento = 100;
                fila.errorDescuento = 'Descuento máximo 100%';
            }

            fila.descuento = descuento.toString();
            this.sincronizarFilaConDetalles(fila);
            this.calcularTotalesUnificados();
        },
        
        limpiarModal() {
            this.ventaData = {
                id: null,
                ven_codigo: '',
                id_empresa: null,
                ven_descuento: 0,
                ven_observacion: '',
                concepto_perseo: '',
                ven_valor: 0,
                est_ven_codigo: 2,
                contrato: '',
                ven_fecha: '',
                usu_codigo: null,
                pedido_id: null,
                id_periodo: null,
                id_ins_depacho: null,
                ven_cliente: null,
                ruc_cliente: '',
                clientesidPerseo: null,
                idtipodoc: null
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
            this.detallesVenta = [];
            this.datosOriginales = null;
            this.reservasOriginales = {};
            this.esPrimeraVenta = false;
            this.ventasActivasInstitucion = null;
            
            // Resetear popups y modales adicionales
            this.popupStockInsuficiente = false;
            this.productosStockInsuficiente = [];
            this.showFormularioCupo = false;
            this.showFormularioCupoActual = false;
            
            // Resetear formulario de cupo
            this.formularioCupoData = {
                ffp_id: null,
                idInstitucion: null,
                idperiodoescolar: null,
                ffp_credito: '',
                ffp_cupo: '',
                ffp_descuento: '',
                if_distribuidor: false,
                nombreInstitucion: '',
                ciudad: ''
            };
            
            // Resetear filas de captura
            this.filasCaptura = [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    descuento: '0',
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    consultandoStock: false,
                    stockError: false,
                    errorDescuento: ''
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
            this.descuentoLineaProlipa = 0;
            this.descuentoLineaIluminar = 0;
        },
        
        cerrarModal() {
            this.popupEditar = false;
            this.limpiarModal();
            this.$emit('cerrar');
        },
        
        // ==========================================
        // MÉTODOS PARA MANEJO DE CUPO
        // ==========================================
        aplicarDescuentosLineaDesdeLugar(datosInstitucion) {
            // DIRECTA: Prolipa e Iluminar usan descuento del contrato
            if (this.esVentaDirecta()) {
                this.aplicarDescuentosContratoVentaDirectaEdicion();
            } else {
                // LISTA/TOTALIZADO: Prolipa del lugar despacho, Iluminar siempre 60%
                let descuentoProlipa = 0;
                if (datosInstitucion && datosInstitucion.ffp_descuento != null) {
                    descuentoProlipa = parseInt(datosInstitucion.ffp_descuento, 10);
                }
                this.descuentoLineaProlipa = isNaN(descuentoProlipa)
                    ? 0
                    : Math.max(0, Math.min(100, descuentoProlipa));
                this.descuentoLineaIluminar = 60;
            }
        },

        async consultarCupoLugarDespacho() {
            
            const idInstitucion = this.nuevoLugarDespacho 
                ? this.nuevoLugarDespacho.idInstitucion 
                : this.lugarDespacho.idInstitucion;
            
            if (!idInstitucion) {
                return;
            }
            
            const parametros = {
                idInstitucion: idInstitucion,
                idperiodoescolar: this.idPeriodo,
                ven_codigo_excluir: this.ventaData && this.ventaData.ven_codigo ? this.ventaData.ven_codigo : null
            };
            
            try {
                const res = await this.$http.get(this.$server_url + 'obtenerPorInstitucionPeriodo', { params: parametros });
                
                if (res.data.success && res.data.data) {
                    if (this.esVentaPorLista()) {
                        const ventasActivasCount = parseInt(res.data.data.ventas_activas_count, 10);
                        if (!isNaN(ventasActivasCount)) {
                            this.ventasActivasInstitucion = ventasActivasCount;
                            this.esPrimeraVenta = ventasActivasCount === 0;
                        } else {
                            this.ventasActivasInstitucion = null;
                            this.esPrimeraVenta = res.data.data.es_primera_venta === true || res.data.data.es_primera_venta === 1 || res.data.data.es_primera_venta === '1';
                        }
                    } else {
                        this.ventasActivasInstitucion = null;
                        this.esPrimeraVenta = false;
                    }

                    // ✅ Cupo encontrado
                    if (this.nuevoLugarDespacho) {
                        this.nuevoLugarDespacho.datosInstitucion = [res.data.data];
                    } else {
                        this.lugarDespacho.datosInstitucion = [res.data.data];
                    }
                    
                    this.aplicarDescuentosLineaDesdeLugar(res.data.data);

                    if (this.debeMostrarCupo) {
                        this.cargarDatosFormularioCupo(res.data.data);
                    }
                } else {
                    this.ventasActivasInstitucion = null;
                    this.esPrimeraVenta = false;

                    // ⚠️ No existe cupo
                    if (this.nuevoLugarDespacho) {
                        this.nuevoLugarDespacho.datosInstitucion = [];
                    } else {
                        this.lugarDespacho.datosInstitucion = [];
                    }

                    this.aplicarDescuentosLineaDesdeLugar(null);
                }
            } catch (error) {
                this.ventasActivasInstitucion = null;
                this.esPrimeraVenta = false;
                if (this.nuevoLugarDespacho) {
                    this.nuevoLugarDespacho.datosInstitucion = [];
                } else {
                    this.lugarDespacho.datosInstitucion = [];
                }

                this.aplicarDescuentosLineaDesdeLugar(null);
            }
        },
        
        cargarDatosFormularioCupo(datosCupo) {
            // Determinar qué lugar usar (nuevo o actual)
            const lugar = this.nuevoLugarDespacho || this.lugarDespacho;
            
            this.formularioCupoData = {
                ffp_id: datosCupo.ffp_id || null,
                idInstitucion: datosCupo.idInstitucion || lugar.idInstitucion,
                idperiodoescolar: datosCupo.idperiodoescolar || this.idPeriodo,
                ffp_credito: datosCupo.ffp_credito || '',
                ffp_cupo: datosCupo.ffp_cupo || '',
                ffp_descuento: datosCupo.ffp_descuento || '',
                if_distribuidor: datosCupo.if_distribuidor == 1,
                nombreInstitucion: lugar.nombreInstitucion || '',
                ciudad: lugar.ciudad || ''
            };
        },
        
        toggleFormularioCupo() {
            // Si se está abriendo el formulario, preparar datos
            if (!this.showFormularioCupo) {
                // Determinar qué lugar usar (nuevo o actual)
                const lugar = this.nuevoLugarDespacho || this.lugarDespacho;
                
                // Si el lugar tiene cupo configurado, cargar esos datos
                if (lugar.datosInstitucion && lugar.datosInstitucion.length > 0) {
                    this.cargarDatosFormularioCupo(lugar.datosInstitucion[0]);
                } else {
                    // Si no tiene cupo, inicializar formulario vacío para nuevo lugar
                    this.formularioCupoData = {
                        ffp_id: null,
                        idInstitucion: lugar.idInstitucion,
                        idperiodoescolar: this.idPeriodo,
                        ffp_credito: '',
                        ffp_cupo: '',
                        ffp_descuento: '',
                        if_distribuidor: false,
                        nombreInstitucion: lugar.nombreInstitucion || '',
                        ciudad: lugar.ciudad || ''
                    };
                }
            }
            
            this.showFormularioCupo = !this.showFormularioCupo;
        },
        
        editarCupoLugarActual() {
            // Cargar datos del lugar actual antes de mostrar
            if (this.lugarDespacho.datosInstitucion && this.lugarDespacho.datosInstitucion.length > 0) {
                this.cargarDatosFormularioCupo(this.lugarDespacho.datosInstitucion[0]);
            } else {
                // Si no tiene cupo, inicializar formulario vacío para lugar actual
                this.formularioCupoData = {
                    ffp_id: null,
                    idInstitucion: this.lugarDespacho.idInstitucion,
                    idperiodoescolar: this.idPeriodo,
                    ffp_credito: '',
                    ffp_cupo: '',
                    ffp_descuento: '',
                    if_distribuidor: false,
                    nombreInstitucion: this.lugarDespacho.nombreInstitucion || '',
                    ciudad: this.lugarDespacho.ciudad || ''
                };
            }
            
            this.showFormularioCupoActual = true;
        },
        
        async guardarFormularioCupo() {
            // Validación básica
            if (!this.formularioCupoData.ffp_credito || !this.formularioCupoData.ffp_cupo || !this.formularioCupoData.ffp_descuento) {
                this.$vs.notify({
                    text: 'Por favor complete todos los campos requeridos',
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

            this.$http.post(this.$server_url + 'Post_Registrar_modificar_formularioProforma', datosGuardar)
                .then(res => {
                    this.$vs.loading.close();
                    
                    
                    // El backend devuelve un string: "Se guardó correctamente" o "No se pudo guardar/actualizar"
                    if (res.data === "Se guardó correctamente" || (typeof res.data === 'string' && res.data.includes('guardó correctamente'))) {
                        this.$vs.notify({
                            text: this.formularioCupoData.ffp_id ? 'Formulario actualizado correctamente' : 'Formulario creado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        });
                        
                        // RECONSULTAR el cupo para actualizar la UI correctamente
                        this.consultarCupoLugarDespacho();
                        
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
                })
                .catch(error => {
                    this.$vs.loading.close();
                    
                    // Mostrar el error completo del servidor
                    const errorMessage = error.response && error.response.data && error.response.data.message 
                        ? error.response.data.message 
                        : 'Error al guardar el formulario';
                    
                    this.$vs.notify({
                        title: 'Error al guardar',
                        text: errorMessage,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 6000
                    });
                });
        }
    }
}
</script>
<style scoped>
/* Estilos existentes del modal original... */
/* (Todos los estilos CSS del original se mantienen igual) */
.popup-venta {
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

.resumen-lugar-despacho {
    display: grid;
    grid-template-columns: repeat(3, minmax(120px, 1fr));
    gap: 8px;
    background: #ffffff;
    border: 1px solid #dbeafe;
    border-radius: 6px;
    padding: 8px;
    font-size: 12px;
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

.descuentos-linea-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
}

.descuento-linea-item {
    min-width: 170px;
}

.descuento-linea-input {
    width: 150px;
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

.linea-producto-tag {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
}

.linea-prolipa {
    background-color: #e7f1ff;
    color: #046AE7;
    border: 1px solid #bcd8ff;
}

.linea-iluminar {
    background-color: #e8f8ef;
    color: #28C76F;
    border: 1px solid #baeacb;
}

.linea-sin-definir {
    background-color: #f3f4f6;
    color: #606266;
    border: 1px solid #d9dadd;
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

@media (max-width: 768px) {
    .descuentos-linea-row {
        flex-direction: column;
        align-items: stretch;
    }

    .descuento-linea-item {
        width: 100%;
        min-width: 0;
    }

    .descuento-linea-input {
        width: 100%;
    }

    .resumen-lugar-despacho {
        grid-template-columns: 1fr;
    }

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
}

/* Mini tabla colapsable de faltantes para combos */
/* Lista de productos faltantes debajo de cada columna de stock */
.stock-faltantes-mini {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 3px;
}
.stock-faltante-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    padding: 1px 4px;
    background: #fff5f5;
    border: 1px solid #fca5a5;
    border-radius: 3px;
    font-size: 9px;
    line-height: 1.3;
    cursor: help;
    white-space: nowrap;
}
.stock-faltante-item:hover {
    background: #fee2e2;
}
.stock-faltante-codigo {
    font-weight: 700;
    color: #7f1d1d;
}
.stock-faltante-cantidad {
    font-weight: 700;
    color: #dc2626;
}

.combo-faltantes-tabla {
    background: #fff5f5;
    border: 1px solid #fca5a5;
    border-radius: 4px;
    overflow: hidden;
    min-width: 130px;
}
.combo-faltantes-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px;
    background: #fee2e2;
    font-size: 9px;
    font-weight: 700;
    color: #b91c1c;
    border-bottom: 1px solid #fca5a5;
    user-select: none;
}
.combo-faltantes-grid {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
}
.combo-faltantes-grid thead tr { background: #fef2f2; }
.combo-faltantes-grid th {
    padding: 2px 5px;
    text-align: left;
    font-weight: 700;
    color: #7f1d1d;
    border-bottom: 1px solid #fecaca;
    white-space: nowrap;
}
.combo-faltantes-grid td {
    padding: 2px 5px;
    border-bottom: 1px solid #fee2e2;
    white-space: nowrap;
}
.combo-faltantes-grid tbody tr:last-child td { border-bottom: none; }
.combo-faltantes-codigo { font-family: monospace; font-weight: 700; color: #1e293b; }
.combo-faltantes-stock { color: #64748b; text-align: center; }
.combo-faltantes-faltante { color: #dc2626; font-weight: 700; text-align: center; }

</style>