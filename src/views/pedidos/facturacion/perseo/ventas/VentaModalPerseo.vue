<template>
    <vs-popup-history
        class="popup-proforma" 
        fullscreen 
        title="Nueva Transacción" 
        :active.sync="popupVenta"
        @close="cerrarVenta"
        :confirm-close="true"
        confirm-message="¿Estás seguro de cerrar la creación de la transacción? Los cambios no guardados se perderán."
    >
        <!-- Barra de totales anclada (sticky) - Versión ultra compacta -->
        <div v-if="calcularTotalesUnificados().cantidadLibros > 0" class="barra-totales-sticky-compacta" >
            <div class="contenido-barra-compacta" :class="esVentaPorLista() && ventaData.lugarDespacho.nombreInstitucion && !tieneCupoSuficiente() ? 'barra-error' : 'barra-normal'">
                <!-- Para venta por lista con cupo -->
                <div v-if="esVentaPorLista() && ventaData.lugarDespacho.nombreInstitucion" class="flex items-center justify-between">
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
                            ¡LIMITE SUPERADO!
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

        <div v-if="popupVenta && (pedidoSeleccionado || totalizado)">
            <!-- Información del pedido en el popup -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Información del {{ pedidoSeleccionado ? 'Pedido' : 'Totalizado' }}</h4>
                </template>
                <div v-if="pedidoSeleccionado" class="container-fluid small py-1 border-bottom mb-2">
                    <div class="row g-1 align-items-center">
                        <div class="col-auto">
                        <strong>Institución:</strong> {{ pedidoSeleccionado.nombreInstitucion }}
                        <span class="text-muted">({{ pedidoSeleccionado.nombre_ciudad }})</span>
                        <span class="text-muted">(RUC/CI :{{ pedidoSeleccionado.ruc }})</span>
                        </div>
                        <div class="col-auto">
                        <strong>Asesor:</strong> {{ pedidoSeleccionado.asesor }}
                        </div>
                        <div class="col-auto">
                        <strong>Contrato:</strong> {{ pedidoSeleccionado.contrato_generado || 'Sin contrato' }}
                        </div>
                        <div class="col-auto">
                        <strong>Tipo:</strong> {{ pedidoSeleccionado.tipo_venta == 1 ? 'Directa' : 'Por Lista' }}
                        </div>
                        <!-- <div class="col-auto">
                        <strong>Total:</strong>
                        <span class="text-success fw-bold">${{ calcularTotalPedido() }}</span>
                        </div>
                        <div class="col-auto">
                        <strong>Libros:</strong> {{ librosPedido.length }}
                        </div> -->
                    </div>
                </div>
                <div v-if="totalizado" class="container-fluid small py-1 border-bottom mb-2">
                    <div class="row g-1 align-items-center">
                        <div class="col-auto">
                        <strong>Totalizado:</strong> {{ totalizado.ca_descripcion }}
                        </div>
                        <div class="col-auto">
                        <strong>Código:</strong> {{ totalizado.ca_codigo_agrupado }}
                        </div>
                        <div class="col-auto">
                        <strong>Contratos:</strong> {{ totalizado.total_contratos }}
                        </div>
                    </div>
                </div>
            </vx-card>

            <!-- Selección de Empresa -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Configuración de Proforma</h4>
                </template>
                <!-- Tipo de Documento -->
                <div class="w-1/2 mb-3">
                    <label class="font-bold mb-2 block text-sm">
                        <!-- <feather-icon icon="FileTextIcon" svgClasses="h-3 w-3" class="inline mr-1"></feather-icon> -->
                        Tipo de Documento <span class="text-red-500">*</span>
                    </label>
                    <v-select 
                        :options="tiposDocumento" 
                        :reduce="(tipo) => tipo.tdo_id" 
                        label="tdo_nombre" 
                        v-model="ventaData.tipoDocumento"
                        placeholder="Seleccione tipo de documento..."
                        class="w-full"
                        :disabled="empresaEstaBloqueada()"
                    ></v-select>
                </div>
                    
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="ventaData.tipoDocumento">
                    <div>
                        <label class="font-bold mb-2 block">
                            <feather-icon icon="BuildingIcon" size="12" class="inline mr-1"></feather-icon>
                            Empresa <span class="text-red-500">*</span>
                        </label>
                        <v-select
                            ref="inputEmpresa"
                            :options="listaEmpresas"
                            @input="seleccionarEmpresa"
                            :reduce="(empresa) => empresa.id"
                            label="descripcion_corta"
                            placeholder="Seleccione una empresa..."
                            v-model="ventaData.empresa"
                            :disabled="empresaEstaBloqueada()"
                            class="w-full"
                        >
                            <template #option="option">
                                <div class="py-1">
                                    <div class="font-bold">{{ option.descripcion_corta }} - {{ 'ID: ' + (option.id || 'Sin código') }}</div>
                                </div>
                            </template>
                        </v-select>
                        <span v-if="validationErrors.empresa" class="text-danger text-sm">{{ validationErrors.empresa }}</span>
                        <small
                            v-if="tieneLibrosConCantidad() && empresaEstaBloqueada()"
                            class="text-warning block mt-1"
                            style="cursor: pointer;"
                            @click="intentarDesbloquearEmpresa"
                        >
                            <feather-icon icon="LockIcon" size="10" class="inline"></feather-icon>
                            Empresa bloqueada. Clic {{ clicksDesbloqueoEmpresa }}/3 para desbloquear cambio.
                        </small>
                        <small v-else-if="tieneLibrosConCantidad()" class="text-warning block mt-1">
                            <feather-icon icon="RefreshCwIcon" size="10" class="inline"></feather-icon>
                            Al cambiar la empresa, la tabla se limpia y se vuelve a cargar automáticamente.
                        </small>
                    </div>
                    
                </div>
                
                <!-- Lugar de Despacho y Cliente -->
                <div class="mt-4">
                    <h5 class="font-bold mb-3 headers-xd">
                        <feather-icon icon="TruckIcon" size="12" class="inline mr-2"></feather-icon>
                        Información de Despacho
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Lugar de Despacho -->
                        <div>
                            <label class="font-bold mb-2 bloc headers-xd">
                                <feather-icon icon="MapPinIcon" size="12" class="inline mr-1"></feather-icon>
                                Lugar de Despacho  <span class="text-red-500">*</span>
                            </label>
                            
                            <!-- Mostrar lugar seleccionado -->
                            <div v-if="ventaData.lugarDespacho.nombreInstitucion" class="lugar-seleccionado">
                                <div class="lugar-info">
                                    <div class="lugar-nombre" style="display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; align-items: center;">
                                            <div>
                                                <i class="fas fa-check-circle text-success mr-2"></i>
                                                {{ ventaData.lugarDespacho.nombreInstitucion }}
                                            </div>
                                            <div>
                                                <vs-button 
                                                    @click="abrirEditarInstitucion(); showFormularioCupo = false" 
                                                    color="warning" 
                                                    type="flat" 
                                                    size="small"
                                                    icon="refresh"
                                                    icon-pack="material-icons"
                                                    class="lugar-btn-editar-inst"
                                                >
                                                    Actualizar datos p.venta/inst.
                                                </vs-button>
                                            </div>
                                        </div>
                                        <div style="display: flex; gap: 8px;">
                                            <vs-button 
                                                @click="quitarLugarDespacho(); showFormularioCupo = false" 
                                                color="danger" 
                                                type="flat" 
                                                size="small"
                                                class="lugar-btn-cambiar"
                                                icon="delete"
                                                icon-pack="material-icons"
                                            >
                                                Limpiar
                                            </vs-button>
                                        </div>
                                    </div>
                                    <div class="lugar-ciudad">{{ ventaData.lugarDespacho.ciudad }}</div>
                                    
                                   <!-- Información financiera si existe - SOLO VENTA POR LISTA -->
                                    <div v-if="esVentaPorLista() && ventaData.lugarDespacho.datosInstitucion && ventaData.lugarDespacho.datosInstitucion.length > 0" class="lugar-financiero" style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Crédito:</strong> {{ ventaData.lugarDespacho.datosInstitucion[0].ffp_credito }} | 
                                            <strong>Cupo:</strong> {{ ventaData.lugarDespacho.datosInstitucion[0].ffp_cupo }} | 
                                            <strong>% Fact.:</strong> {{ ventaData.lugarDespacho.datosInstitucion[0].ffp_porcentaje_facturacion }}% | 
                                            <strong>Pref:</strong> {{ parseFloat(ventaData.lugarDespacho.datosInstitucion[0].ffp_saldo_prefacturas || 0).toFixed(2) }} | 
                                            <strong>Notas:</strong> {{ parseFloat(ventaData.lugarDespacho.datosInstitucion[0].ffp_saldo_notas || 0).toFixed(2) }} | 
                                            <strong>Desc:</strong> {{ ventaData.lugarDespacho.datosInstitucion[0].ffp_descuento }}%
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
                                    
                                     <!-- Botón para CONFIGURAR cupo si NO existe - SOLO VENTA POR LISTA -->
                                    <div v-else-if="esVentaPorLista() && (!ventaData.lugarDespacho.datosInstitucion || ventaData.lugarDespacho.datosInstitucion.length === 0)" class="lugar-sin-cupo">
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
                            </div>
                            
                            <!-- Botón para buscar si no hay selección -->
                            <div 
                                v-else
                                ref="btnLugarDespacho"
                                @click="abrirBusquedaLugar()" 
                                class="lugar-buscar"
                            >
                                <div class="lugar-buscar-texto">
                                    Seleccionar Lugar de Despacho
                                </div>
                            </div>
                            
                            <span v-if="validationErrors.lugarDespacho" class="text-danger text-sm mt-1 block">
                                {{ validationErrors.lugarDespacho }}
                            </span>
                            
                            <!-- Formulario inline para editar cupo -->
                            <div v-if="showFormularioCupo && ventaData.lugarDespacho.nombreInstitucion" class="formulario-cupo-inline mt-4">
                                <div class="formulario-cupo-header">
                                    <h4>
                                        <feather-icon icon="EditIcon" size="16" class="mr-2"></feather-icon>
                                        Editar Información del Formulario
                                    </h4>
                                </div>
                                
                                <div class="formulario-cupo-grid">
                                    <div class="form-group-cupo">
                                        <label class="form-label-cupo">
                                            <feather-icon icon="BuildingIcon" size="14" class="mr-1"></feather-icon>
                                            Institución
                                        </label>
                                        <div class="institucion-display-cupo">
                                            <span>{{ formularioCupoData.nombreInstitucion || ventaData.lugarDespacho.nombreInstitucion }}</span>
                                            <small>{{ formularioCupoData.ciudad || ventaData.lugarDespacho.ciudad }}</small>
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
                                            % Facturación
                                        </label>
                                        <vs-input 
                                            v-model="formularioCupoData.ffp_porcentaje_facturacion" 
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="50"
                                            class="w-full"
                                            :disabled="!puedeEditarPorcentajeFacturacionCupo"
                                            @keypress="soloNumeros($event)"
                                        />
                                        <small v-if="!puedeEditarPorcentajeFacturacionCupo" class="input-help text-warning">Solo usuario root puede cambiar este porcentaje después de guardar.</small>
                                    </div>

                                    <div class="form-group-cupo">
                                        <label class="form-label-cupo">
                                            <feather-icon icon="PieChartIcon" size="14" class="mr-1"></feather-icon>
                                            Saldo Prefacturas
                                        </label>
                                        <div class="institucion-display-cupo">
                                            <span>${{ obtenerSaldoPrefacturasFormulario().toFixed(2) }}</span>
                                            <small>Consumido: ${{ parseFloat(formularioCupoData.ffp_consumido_prefacturas || 0).toFixed(2) }} | Disponible: ${{ obtenerDisponiblePrefacturasFormulario().toFixed(2) }}</small>
                                        </div>
                                    </div>

                                    <div class="form-group-cupo">
                                        <label class="form-label-cupo">
                                            <feather-icon icon="FileTextIcon" size="14" class="mr-1"></feather-icon>
                                            Saldo Notas
                                        </label>
                                        <div class="institucion-display-cupo">
                                            <span>${{ obtenerSaldoNotasFormulario().toFixed(2) }}</span>
                                            <small>Consumido: ${{ parseFloat(formularioCupoData.ffp_consumido_notas || 0).toFixed(2) }} | Disponible: ${{ obtenerDisponibleNotasFormulario().toFixed(2) }}</small>
                                        </div>
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
                                            @keypress="soloNumeros($event)"
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
                            <label class="font-bold mb-2 bloc headers-xd">
                                <feather-icon icon="UserIcon" size="12" class="inline mr-1"></feather-icon>
                                Cliente Perseo <span class="text-red-500">*</span>
                            </label>
                            
                            <!-- Mostrar cliente seleccionado -->
                            <div v-if="ventaData.clientePerseo.nombre" class="cliente-seleccionado">
                                <div class="cliente-info">
                                    <div class="cliente-nombre">
                                        <i class="fas fa-check-circle text-success mr-2"></i>
                                        {{ ventaData.clientePerseo.nombre }}
                                    </div>
                                    <div class="cliente-cedula">{{ ventaData.clientePerseo.cedula }}</div>
                                    <div v-if="ventaData.clientePerseo.email" class="cliente-email">{{ ventaData.clientePerseo.email }}</div>
                                </div>
                                
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <!-- <vs-button 
                                        @click="abrirBusquedaCliente()" 
                                        color="warning" 
                                        type="flat" 
                                        size="small"
                                        class="cliente-btn-editar"
                                        :disabled="!ventaData.empresa"
                                        icon="sync"
                                        icon-pack="material-icons"
                                    >
                                        cambiar
                                    </vs-button> -->
                                    
                                    <vs-button 
                                        @click="quitarClientePerseo()" 
                                        color="danger" 
                                        type="flat" 
                                        size="small"
                                        class="cliente-btn-cambiar"
                                        :disabled="!ventaData.empresa"
                                        icon="delete"
                                        icon-pack="material-icons"
                                    >
                                        Limpiar
                                    </vs-button>
                                </div>
                            </div>
                            
                            <!-- Botón para buscar si no hay selección -->
                            <div 
                                v-else
                                ref="btnClientePerseo"
                                @click="abrirBusquedaCliente()" 
                                class="cliente-buscar"
                                :class="{'cliente-buscar-disabled': !ventaData.empresa}"
                            >
                                <div class="cliente-buscar-texto">
                                    Buscar Cliente en Perseo
                                </div>
                            </div>
                            
                            <span v-if="validationErrors.clientePerseo" class="text-danger text-sm mt-1 block">
                                {{ validationErrors.clientePerseo }}
                            </span>
                            
                            <!-- Mensaje informativo si no hay empresa -->
                            <small v-if="!ventaData.empresa" class="text-danger block mt-1">
                                Primero seleccione una empresa
                            </small>
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
                
                <!-- Tab activo: Llenado Rápido -->
                <div class="captura-rapida-container" v-if="ventaData.empresa">                          
                    <div class="descuentos-linea-row mb-2">
                        <div class="descuento-linea-item">
                            <label class="headers-form mb-1 block">Descuento Prolipa (%)</label>
                            <vs-input
                                ref="inputDescuentoProlipa"
                                type="text"
                                inputmode="decimal"
                                v-model="descuentoLineaProlipa"
                                @input="limitarDecimalesDescuentoLinea('prolipa')"
                                @keypress="soloNumerosConDecimales($event, descuentoLineaProlipa)"
                                @blur="normalizarDescuentoPorLinea('prolipa')"
                                min="0"
                                max="100"
                                step="0.01"
                                class="input-compact descuento-linea-input"
                            />
                        </div>
                        <div class="descuento-linea-item">
                            <label class="headers-form mb-1 block">Descuento Iluminar (%)</label>
                            <vs-input
                                ref="inputDescuentoIluminar"
                                type="text"
                                inputmode="decimal"
                                v-model="descuentoLineaIluminar"
                                @input="limitarDecimalesDescuentoLinea('iluminar')"
                                @keypress="soloNumerosConDecimales($event, descuentoLineaIluminar)"
                                @blur="normalizarDescuentoPorLinea('iluminar')"
                                min="0"
                                max="100"
                                step="0.01"
                                class="input-compact descuento-linea-input"
                            />
                        </div>
                    </div>

                    <!-- Tabla de captura rápida -->
                    <div class="tabla-captura-container">
                        <div class="tabla-header" >
                            <!-- <vs-chip color="primary">Tabla de Captura Rápida</vs-chip> -->
                        </div>
                                <vs-table :data="filasCapturaSeguras" search>
                                    <template slot="header">
                                        <vs-button  v-if="hayLibrosDisponiblesParaAgregar"
                                            @click="agregarFilaCaptura" 
                                            color="success" 
                                            size="small"
                                            type="flat"
                                            icon="icon-plus"
                                            icon-pack="feather"
                                        >
                                            Agregar Fila
                                        </vs-button>
                                    </template>
                                    <template slot="thead">
                                        <vs-th style="width: 35px;">#</vs-th>
                                        <vs-th style="width: 30%;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="SearchIcon" size="12" class="mr-1"></feather-icon>
                                                Libro
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 60px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                            <feather-icon icon="DollarSignIcon" size="12" class="mr-1"></feather-icon>
                                            Precio
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 55px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="ClipboardIcon" size="12" class="mr-1"></feather-icon>
                                                Pedido
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 55px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="CheckCircleIcon" size="12" class="mr-1"></feather-icon>
                                                Vendido
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 50px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="ShoppingCartIcon" size="12" class="mr-1"></feather-icon>
                                                Stock
                                            </span>
                                        </vs-th>
                                        <vs-th v-if="esDocumentoPrefactura()" style="width: 55px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="ServerIcon" size="12" class="mr-1"></feather-icon>
                                                St.Perseo
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 55px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="PercentIcon" size="12" class="mr-1"></feather-icon>
                                                Desc
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 65px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="PackageIcon" size="12" class="mr-1"></feather-icon>
                                                Cantidad
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 70px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="DollarSignIcon" size="12" class="mr-1"></feather-icon>
                                                Subtotal
                                            </span>
                                        </vs-th>
                                        <vs-th style="width: 50px;">
                                            <span class="headers-form" style="font-size: 11px;">
                                                <feather-icon icon="TrashIcon" size="12" class="mr-1"></feather-icon>
                                                Acción
                                            </span>
                                        </vs-th>
                                    </template>
                                    
                                    <template slot-scope="{data}">
                                        <vs-tr 
                                            :data="fila" 
                                            :key="index" 
                                            v-for="(fila, index) in data"
                                            v-if="fila.libroSeleccionado || librosDisponiblesParaFila(index).length > 0"
                                        >
                                            <!-- Número de fila -->
                                            <vs-td>
                                                <span style="font-weight: bold; color: #666; font-size: 11px;">{{ index + 1 }}</span>
                                            </vs-td>
                                            
                                            <!-- Buscador de libro -->
                                            <vs-td>                                               <div class="input-with-dropdown">
                                                    <!-- Indicador de carga individual -->
                                                    <div v-if="fila.consultandoStock" class="loading-individual">
                                                        <i class="feather icon-loader rotating"></i>
                                                        <span>Consultando stock...</span>
                                                    </div>
                                                    
                                                    <!-- v-select para seleccionar libros del pedido -->
                                                    <v-select
                                                        v-if="!fila.libroSeleccionado && !fila.consultandoStock"
                                                        :ref="`select-libro-${index}`"
                                                        :options="librosDisponiblesParaFila(index)"
                                                        label="nombre_libro"
                                                        :filterable="true"
                                                        :filter="filtrarLibros"
                                                        :placeholder="ventaData.empresa ? 'Buscar libro por código o nombre...' : 'Seleccione una empresa primero'"
                                                        @input="seleccionarLibroDesdeSelect(fila, $event, index)"
                                                        @keydown.delete.native="manejarBackspaceSelect(fila, index, $event)"
                                                        @keydown.backspace.native="manejarBackspaceSelect(fila, index, $event)"
                                                        :reduce="libro => libro"
                                                        :disabled="!ventaData.empresa"
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
                                                            <span v-if="!ventaData.empresa" style="color: #f6ad55;">⚠️ Seleccione una empresa primero</span>
                                                            <span v-else style="color: #999;">No hay libros disponibles</span>
                                                        </template>
                                                    </v-select>
                                                    
                                                    <!-- Input readonly cuando ya tiene libro seleccionado -->
                                                    <vs-input 
                                                        v-else
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
                                            <vs-td style="padding: 6px 4px;">
                                                <span v-if="fila.libroSeleccionado" style="font-size: 11px; font-weight: 700;">
                                                    <span v-if="obtenerPrecioLibroParaCalculo(fila.libroSeleccionado) !== null">
                                                        ${{ obtenerPrecioLibroParaCalculo(fila.libroSeleccionado).toFixed(2) }}
                                                    </span>
                                                    <span v-else class="text-danger" style="font-size: 10px; font-weight: 600;">Sin precio</span>
                                                </span>
                                                <span v-else style="color: #ccc; font-size: 11px;">-</span>
                                            </vs-td>
                                            
                                            <!-- Cantidad Pedida -->
                                            <vs-td style="padding: 6px 4px;">
                                                <span v-if="fila.libroSeleccionado" style="font-size: 11px; font-weight: 700;">
                                                    {{ fila.libroSeleccionado.cantidad || 0 }}
                                                </span>
                                                <span v-else style="color: #ccc; font-size: 11px;">-</span>
                                            </vs-td>
                                            
                                            <!-- Ya Vendido -->
                                            <vs-td style="padding: 6px 4px;">
                                                <span v-if="fila.libroSeleccionado" :style="{ fontSize: '11px', fontWeight: '700', color: (fila.libroSeleccionado.cantidadVendida || 0) > 0 ? '#28C76F' : '#000' }">
                                                    {{ fila.libroSeleccionado.cantidadVendida || 0 }}
                                                </span>
                                                <span v-else style="color: #ccc; font-size: 11px;">-</span>
                                            </vs-td>
                                            
                                            <!-- Stock disponible -->
                                            <vs-td style="padding: 6px 4px;">
                                                <!-- Consultando stock simple -->
                                                <div v-if="fila.consultandoStock" style="display: flex; align-items: center; gap: 5px;">
                                                    <div class="loading-spinner-small"></div>
                                                    <small style="color: #666; font-size: 10px;">...</small>
                                                </div>
                                                <!-- Combo: consultando con cantidad -->
                                                <div v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.consultandoStockCombo" style="display: flex; align-items: center; gap: 5px;">
                                                    <div class="loading-spinner-small"></div>
                                                    <small style="color: #5b3cc4; font-size: 10px;">verificando...</small>
                                                </div>
                                                <!-- Combo: sin cantidad ingresada aún -->
                                                <span v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock === null" style="color: #aaa; font-size: 13px;" title="Ingresa la cantidad para verificar disponibilidad">—</span>
                                                <!-- Para combos Y productos simples: evaluar SOLO stock plataforma -->
                                                <vx-tooltip 
                                                    v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock !== undefined && fila.libroSeleccionado.stock !== null"
                                                    :text="obtenerTooltipStockPlataforma(fila)"
                                                    position="top"
                                                >
                                                    <span style="font-size: 18px; cursor: default;">
                                                        {{ tieneStockPlataformaSuficiente(fila) ? '✅' : '❌' }}
                                                    </span>
                                                </vx-tooltip>
                                                <span v-else style="color: #ccc; font-size: 11px;">-</span>
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
                                            
                                            <!-- Columna Stock Perseo (solo PRE-FACTURA tdo_id=1) -->
                                            <vs-td v-if="esDocumentoPrefactura()" style="padding: 6px 4px;">
                                                <div v-if="fila.consultandoStock" style="display: flex; align-items: center; gap: 5px;">
                                                    <div class="loading-spinner-small"></div>
                                                    <small style="color: #666; font-size: 10px;">...</small>
                                                </div>
                                                <!-- Combo: sin cantidad ingresada aún -->
                                                <span v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock === null" style="color: #aaa; font-size: 13px;">—</span>
                                                <!-- Producto simple o combo: mostrar ✅ o ❌ según stock Perseo -->
                                                <vx-tooltip
                                                    v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock_perseo !== null && fila.libroSeleccionado.stock_perseo !== undefined"
                                                    :text="obtenerTooltipStockPerseo(fila)"
                                                    position="top"
                                                >
                                                    <span style="font-size: 18px; cursor: default;">
                                                        {{ tieneStockPerseoSuficiente(fila) ? '✅' : '❌' }}
                                                    </span>
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
                                            
                                            <!-- Input de descuento -->
                                            <vs-td style="padding: 4px 2px;">
                                                <vs-input 
                                                    v-model="fila.descuento"
                                                    @input="validarDescuentoConLimite(fila)"
                                                    @blur="normalizarDescuentoFila(fila)"
                                                    @keyup.enter="avanzarAlSiguienteLibro(index)"
                                                    @keypress="soloNumerosConDecimales($event, fila.descuento)"
                                                    type="text"
                                                    inputmode="decimal"
                                                    style="width: 50px; height: 28px;"
                                                    :disabled="!fila.libroSeleccionado || fila.consultandoStock"
                                                    :ref="`descuento-${index}`"
                                                    class="input-compact"
                                                    placeholder="0"
                                                />
                                                <small v-if="fila.errorDescuento" class="text-danger text-xs block mt-1" style="font-size: 9px;">
                                                    {{ fila.errorDescuento }}
                                                </small>
                                            </vs-td>
                                            
                                            <!-- Input de cantidad -->
                                            <vs-td style="padding: 4px 2px;">
                                                <vs-input 
                                                    v-model="fila.cantidad"
                                                    @input="validarYSincronizarCantidad(fila, index)"
                                                    @keyup.enter="avanzarAlSiguienteLibro(index)"
                                                    @keydown.delete="manejarBorradoCantidad(fila, index, $event)"
                                                    @keydown.backspace="manejarBorradoCantidad(fila, index, $event)"
                                                    @keypress="soloNumeros($event)"
                                                    @blur="validarCantidadFinal(fila, index)"
                                                    type="text"
                                                    inputmode="numeric"
                                                    style="width: 60px; height: 28px;"
                                                    :disabled="!fila.libroSeleccionado || fila.consultandoStock"
                                                    :ref="`cantidad-${index}`"
                                                    :class="fila.errorCantidad ? 'cantidad-error' : ''"
                                                    class="input-compact"
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
                                            
                                            <!-- Subtotal -->
                                            <vs-td style="padding: 6px 4px;">
                                                <span v-if="fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0" style="font-size: 11px; font-weight: 600;">
                                                    ${{ calcularSubtotalFila(fila) }}
                                                </span>
                                                <span v-else style="color: #ccc; font-size: 11px;">$0.00</span>
                                            </vs-td>
                                            
                                            <!-- Estado -->
                                            <!-- <vs-td>
                                                <span v-if="fila.confirmado" style="color: #48bb78; font-weight: bold;">✅</span>
                                                <span v-else-if="fila.libroSeleccionado && fila.cantidad" style="color: #f6ad55;">⏳</span>
                                                <span v-else style="color: #ccc;">⭕</span>
                                            </vs-td> -->
                                            
                                            <!-- Acción -->
                                            <vs-td style="padding: 4px 2px;">
                                                <div v-if="fila.libroSeleccionado" style="display: flex; align-items: center; gap: 2px; justify-content: center;">
                                                    <vx-tooltip text="Volver a consultar stock" position="top" color="warning">
                                                        <vs-button
                                                            @click="reintentarConsultaStock(fila, index)"
                                                            color="warning"
                                                            type="flat"
                                                            size="small"
                                                            icon-pack="feather"
                                                            icon="icon-refresh-cw"
                                                            style="min-width: 24px; height: 24px; padding: 2px;"
                                                        ></vs-button>
                                                    </vx-tooltip>

                                                    <vs-button 
                                                        @click="limpiarFilaCaptura(fila, index)"
                                                        color="danger" 
                                                        type="flat"
                                                        size="small"
                                                        title="Limpiar selección"
                                                        icon="icon-trash-2"
                                                        icon-pack="feather"
                                                    >
                                                    </vs-button>
                                                </div>
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                            </div>
                        </div>
            </vx-card>
                
            <!-- Resumen de Totales de la Proforma (siempre visible) -->
            <vx-card class="mt-4">
                <div class="p-4 bg-white rounded-lg border border-gray-300">
                    <div v-if="calcularTotalesUnificados().cantidadLibros > 0">
                        <!-- Grid de 3 columnas -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- Columna 1: Observación -->
                            <div>
                                <label class="font-bold mb-2 block text-sm">
                                    <feather-icon icon="FileTextIcon" size="14" class="inline mr-1"></feather-icon>
                                    Observación <span class="text-red-500">*</span>
                                </label>
                                <vs-textarea
                                    ref="inputObservacion"
                                    placeholder="Escriba alguna observación para la venta (máximo 200 caracteres)..."
                                    v-model="ventaData.observacion"
                                    :counter="200"
                                    counter-danger
                                    class="w-full"
                                />
                                <div class="text-right text-xs mt-1">
                                    <span :class="{'text-danger': ventaData.observacion && ventaData.observacion.length > 200, 'text-gray-500': !ventaData.observacion || ventaData.observacion.length <= 200}">
                                        {{ (ventaData.observacion || '').length }}/200 caracteres
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Columna 2: Concepto Perseo -->
                            <div>
                                <label class="font-bold mb-2 block text-sm">
                                    <feather-icon icon="TagIcon" size="14" class="inline mr-1"></feather-icon>
                                    Concepto Perseo <span class="text-red-500">*</span>
                                </label>
                                <vs-textarea
                                    ref="inputConceptoPerseo"
                                    placeholder="Escriba el concepto para Perseo (máximo 200 caracteres)..."
                                    v-model="ventaData.conceptoPerseo"
                                    :counter="150"
                                    counter-danger
                                    class="w-full"
                                />
                                <div class="text-right text-xs mt-1">
                                    <span :class="{'text-danger': ventaData.conceptoPerseo && ventaData.conceptoPerseo.length > 150, 'text-gray-500': !ventaData.conceptoPerseo || ventaData.conceptoPerseo.length <= 150}">
                                        {{ (ventaData.conceptoPerseo || '').length }}/150 caracteres
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Columna 3: Totales -->
                            <div class="flex flex-col items-end space-y-1 text-sm font-bold text-gray-800">
                                <div class="flex justify-end w-full">
                                    <label class="mr-2">Subtotal $:</label>
                                    <span>{{ calcularTotalesUnificados().subtotal.toFixed(2) }}</span>
                                </div>

                                <div class="flex justify-end w-full">
                                    <label class="mr-2">Descuento aplicado:</label>
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
                    @click="intentargenerarVentaPerseo" 
                    icon="check"
                    icon-pack="material-icons"
                >
                    Generar Transacción
                </vs-button>
                <vs-button 
                    color="danger" 
                    type="border" 
                    @click="cerrarVenta"
                    icon="close"
                    icon-pack="material-icons"
                >
                    Cancelar
                </vs-button>
            </div>
        </div>
        
        <!-- Modales de búsqueda -->
        <BusquedaLugarDespacho
            :visible.sync="mostrarBusquedaLugar"
            :id-periodo="idPeriodo"
            @lugar-seleccionado="asignarLugarDespacho"
            @cerrar="cerrarBusquedaLugar"
        />
        
        <BusquedaClientePerseo
            :visible.sync="mostrarBusquedaCliente"
            :empresa="ventaData.empresa"
            @cliente-seleccionado="asignarClientePerseo"
            @cerrar="cerrarBusquedaCliente"
        />
        
        <!-- Modal para editar información de la institución -->
        <vs-popup
            class="popup-editar-institucion"
            title="Editar Información de la Institución"
            :active.sync="mostrarEditarInstitucion"
        >
            <FacturacionInformacionInstitucion
                v-if="mostrarEditarInstitucion && ventaData.lugarDespacho.id_institucion"
                :institucion_id="parseInt(ventaData.lugarDespacho.id_institucion)"
                @changeSaveInformacion="actualizarDespuesDeEditar"
            />
        </vs-popup>
        
        <!-- ====================================== -->
        <!-- POPUP: PRODUCTOS SIN STOCK SUFICIENTE -->
        <!-- ====================================== -->
        <vs-popup
            title="⚠️ Stock Insuficiente"
            :active.sync="popupStockInsuficiente"
            class="popup-stock-insuficiente"
        >
            <div class="stock-insuficiente-container">
                <div class="alert-message">
                    <p class="text-danger font-semibold mb-3">
                        <i class="feather icon-alert-triangle mr-2"></i>
                        Algunos productos no tienen stock suficiente para completar la venta.
                    </p>
                    <p class="text-sm text-gray-600 mb-2">
                        Las cantidades faltantes quedarán <strong style="color: #856404;">PENDIENTES</strong>.
                    </p>
                    <p class="text-sm font-semibold" style="color: #5b3cc4;">
                        ¿Desea continuar con la venta de todas formas?
                    </p>
                </div>
                
                <div class="productos-tabla-container">
                    <table class="tabla-productos-invalidos w-full">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Stock Plataforma</th>
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
                
                <div class="acciones-popup mt-6" style="display: flex; gap: 12px;">
                    <!-- <vs-button 
                        @click="cancelarVentaPorStockInsuficiente" 
                        color="danger" 
                        type="border"
                        style="flex: 1;"
                        size="large"
                    >
                        <i class="feather icon-x mr-2"></i>
                        Cancelar y Revisar
                    </vs-button>
                    <vs-button 
                        @click="continuarVentaConStockInsuficiente" 
                        color="warning" 
                        type="filled"
                        style="flex: 1;"
                        size="large"
                    >
                        <i class="feather icon-alert-triangle mr-2"></i>
                        Sí, Continuar
                    </vs-button> -->
                </div>
            </div>
        </vs-popup>
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
const BusquedaLugarDespacho = () => import('../../Busquedas/BusquedaLugarDespacho.vue');
const BusquedaClientePerseo = () => import('../../Busquedas/BusquedaClientePerseo.vue');
const FacturacionInformacionInstitucion = () => import('@/views/pedidos2/pedidos/proforma/components/FacturacionInformacionInstitucion.vue');

export default {
    name: 'VentaModalPerseo',
    components: {
        vSelect,
        BusquedaLugarDespacho,
        BusquedaClientePerseo,
        FacturacionInformacionInstitucion
    },
    props: {
        // Props recibidos desde el componente padre
        pedidoSeleccionado: {
            type: Object,
            default: null
        },
        librosPedido: {
            type: Array,
            default: () => []
        },
        librosVendidos: {
            type: Array,
            default: () => []
        },
        periodoSelect: {
            type: Object,
            required: false,
            default: () => ({})
        },
        visible: {
            type: Boolean,
            default: false
        },
        lineaSeleccionada: {
            type: [Number, String],
            required: false,
            default: null
        },
        totalizado: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            popupVenta: this.visible,
            listaEmpresas: [],
            mostrarBusquedaLugar: false,
            mostrarBusquedaCliente: false,
            mostrarEditarInstitucion: false,
            filtrarSoloConCantidad: false, // Nuevo estado para el filtro del listado
            lineasProductoOpciones: [],
            descuentoLineaProlipa: 0,
            descuentoLineaIluminar: 0,
            
            // Control de stock insuficiente
            popupStockInsuficiente: false,
            productosStockInsuficiente: [],
            librosParaVentaTemporal: [], // Guardar libros temporalmente para continuar después de confirmar
            
            // Control de carga de productos
            cargaEnProgreso: false, // Indica si hay una carga automática en progreso
            cancelarCarga: false, // Bandera para cancelar la carga en progreso
            idCargaActual: null,
            cantidadDebounceTimers: {},
            comboFaltantesExpandidos: {},
            bloqueoBorradoHasta: 0,
            clicksDesbloqueoEmpresa: 0,
            permitirCambioEmpresa: false,
            empresaSeleccionadaActual: null,
            
            // Datos para captura rápida
            filasCaptura: [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null
                }
            ],
            ventaData: {
                empresa: null,
                tipoDocumento: null,
                descuento: 0,
                observacion: '',
                conceptoPerseo: '',
                lugarDespacho: {
                    nombreInstitucion: '',
                    ciudad: '',
                    id_institucion: '',
                    datosInstitucion: []
                },
                clientePerseo: {
                    idusuario: '',
                    nombre: '',
                    cedula: '',
                    email: '',
                    clientesidPerseo: 0
                }
            },
            ventaTotales: {
                subtotal: '0.00',
                descuento: '0.00',
                subtotalConDescuento: '0.00',
                iva: '0.00',
                transporte: '0.00',
                total: '0.00'
            },
            validationErrors: {
                empresa: '',
                lugarDespacho: '',
                clientePerseo: ''
            },
            
            // Formulario para editar cupo
            showFormularioCupo: false,
            formularioCupoData: {
                ffp_id: null,
                idInstitucion: null,
                idperiodoescolar: null,
                ffp_credito: '',
                ffp_cupo: '',
                ffp_porcentaje_facturacion: '',
                ffp_porcentaje_facturacion_original: '',
                ffp_saldo_prefacturas: '',
                ffp_saldo_notas: '',
                ffp_consumido_prefacturas: 0,
                ffp_consumido_notas: 0,
                ffp_descuento: '',
                if_distribuidor: false,
                nombreInstitucion: '',
                ciudad: ''
            },

            //tipo documento
            tiposDocumento: []
        }
    },
    computed: {
        // Asegurar que filasCaptura siempre sea un array válido para el template
        filasCapturaSeguras() {
            return this.filasCaptura && Array.isArray(this.filasCaptura) ? this.filasCaptura : [];
        },
        // Obtener ID del periodo de forma segura
        idPeriodo() {
            // Prioridad: periodoSelect > totalizado > pedidoSeleccionado > localStorage
            if (this.periodoSelect && this.periodoSelect.idperiodoescolar) {
                return this.periodoSelect.idperiodoescolar;
            }
            if (this.periodoSelect && this.periodoSelect.id_periodo) {
                return this.periodoSelect.id_periodo;
            }
            if (this.totalizado && this.totalizado.idperiodoescolar) {
                return this.totalizado.idperiodoescolar;
            }
            if (this.totalizado && this.totalizado.id_periodo) {
                return this.totalizado.id_periodo;
            }
            if (this.totalizado && this.totalizado.idPeriodoEscolar) {
                return this.totalizado.idPeriodoEscolar;
            }
            if (this.pedidoSeleccionado && (this.pedidoSeleccionado.idPeriodoEscolar || this.pedidoSeleccionado.id_periodo)) {
                return this.pedidoSeleccionado.idPeriodoEscolar || this.pedidoSeleccionado.id_periodo;
            }
            var periodoStorage = localStorage.getItem('id_periodo_selected');
            if (periodoStorage && !isNaN(parseInt(periodoStorage, 10))) {
                return parseInt(periodoStorage, 10);
            }
            var periodoIdSelectStorage = localStorage.getItem('periodoIdSelect');
            if (periodoIdSelectStorage && !isNaN(parseInt(periodoIdSelectStorage, 10))) {
                return parseInt(periodoIdSelectStorage, 10);
            }
            var pidStorage = localStorage.getItem('pid');
            if (pidStorage && !isNaN(parseInt(pidStorage, 10))) {
                return parseInt(pidStorage, 10);
            }
            return 0;
        },
        // Verificar si hay libros disponibles para agregar
        hayLibrosDisponiblesParaAgregar() {
            return this.librosDisponiblesParaFila(-1).length > 0;
        },
        puedeEditarPorcentajeFacturacionCupo() {
            var esEdicion = this.formularioCupoData && this.formularioCupoData.ffp_id ? true : false;
            if (!esEdicion) {
                return true;
            }

            var usuariorespo = localStorage.getItem('usuario');
            if (!usuariorespo) {
                return false;
            }

            var usuarioObjeto = JSON.parse(usuariorespo);
            var idGroup = parseInt(usuarioObjeto.id_group, 10);

            return idGroup === 1 || idGroup === 26;
        }
    },
    watch: {
        visible(newVal) {
            this.popupVenta = newVal;
            if (newVal) {
                this.cargarEmpresas();
                this.cargarLineasProducto();
                this.getTiposDocumento();
                // Resetear y cargar datos para nueva proforma
                this.resetearVenta();
                this.$nextTick(() => {
                    this.calcularTotalesVentas();
                    
                    // Si ya hay empresa seleccionada, llenar tabla automáticamente
                    // if (this.ventaData.empresa) {
                    //     setTimeout(() => {
                    //         this.llenarTablaAutomaticamente();
                    //     }, 500);
                    // }
                });
            }
        },
        popupVenta(newVal) {
            if (!newVal) {
                this.idCargaActual = null;
                if (this.cargaEnProgreso) {
                    this.cancelarCarga = true;
                }
                setTimeout(() => {
                    this.resetearVenta();
                }, 100);
            }
            this.$emit('update:visible', newVal);
        },
        librosVendidos: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.actualizarCantidadesVendidas();
                }
            },
            deep: true,
            immediate: true
        },

        descuentoLineaProlipa() {
            this.aplicarDescuentoPorLineaAFilas();
        },

        descuentoLineaIluminar() {
            this.aplicarDescuentoPorLineaAFilas();
        },

    },
    mounted() {
        this.cargarEmpresas();
        this.getTiposDocumento();
    },
    methods: {
        tieneLibrosSeleccionadosEnFilas() {
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return false;
            }
            return this.filasCaptura.some(fila => fila && fila.libroSeleccionado);
        },

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

        obtenerDescuentoPorLinea(libro) {
            const lineaId = this.obtenerLineaProductoId(libro);
            if (lineaId === 1) {
                const prolipa = parseFloat(this.descuentoLineaProlipa);
                return isNaN(prolipa) ? 0 : Math.round(prolipa * 100) / 100;
            }
            if (lineaId === 2) {
                const iluminar = parseFloat(this.descuentoLineaIluminar);
                return isNaN(iluminar) ? 0 : Math.round(iluminar * 100) / 100;
            }
            return 0;
        },

        aplicarDescuentoPorLineaAFilas() {
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return;
            }
            this.filasCaptura.forEach(fila => {
                // Solo aplicar el descuento de línea si el usuario no lo modificó manualmente
                if (fila && fila.libroSeleccionado && !fila.descuentoModificado) {
                    fila.descuento = this.obtenerDescuentoPorLinea(fila.libroSeleccionado).toString();
                }
            });
            this.calcularTotalesVentas();
        },

        limitarDecimalesDescuentoLinea(tipo) {
            let valor = tipo === 'prolipa' ? this.descuentoLineaProlipa : this.descuentoLineaIluminar;
            
            if (!valor || valor.toString().trim() === '') {
                return;
            }

            // Permitir solo números y punto decimal
            let valorStr = valor.toString().replace(/[^0-9.]/g, '');
            
            // Permitir solo un punto decimal
            const partes = valorStr.split('.');
            if (partes.length > 2) {
                valorStr = partes[0] + '.' + partes.slice(1).join('');
            }
            
            // Limitar a máximo 2 decimales
            if (partes.length === 2 && partes[1].length > 2) {
                valorStr = partes[0] + '.' + partes[1].substring(0, 2);
            }
            
            // Actualizar el valor si fue modificado
            if (tipo === 'prolipa') {
                if (this.descuentoLineaProlipa !== valorStr) {
                    this.descuentoLineaProlipa = valorStr;
                }
            } else {
                if (this.descuentoLineaIluminar !== valorStr) {
                    this.descuentoLineaIluminar = valorStr;
                }
            }
        },

        normalizarDescuentoPorLinea(tipo) {
            if (tipo === 'prolipa') {
                let valorP = this.descuentoLineaProlipa;
                if (valorP === '' || valorP === null || valorP === undefined) {
                    valorP = 0;
                } else {
                    valorP = parseFloat(valorP);
                    if (isNaN(valorP) || valorP < 0) {
                        valorP = 0;
                    }
                    if (valorP > 100) {
                        valorP = 100;
                    }
                    // Redondear a 2 decimales
                    valorP = Math.round(valorP * 100) / 100;
                }
                this.descuentoLineaProlipa = valorP;
            } else {
                let valorI = this.descuentoLineaIluminar;
                if (valorI === '' || valorI === null || valorI === undefined) {
                    valorI = 0;
                } else {
                    valorI = parseFloat(valorI);
                    if (isNaN(valorI) || valorI < 0) {
                        valorI = 0;
                    }
                    if (valorI > 100) {
                        valorI = 100;
                    }
                    // Redondear a 2 decimales
                    valorI = Math.round(valorI * 100) / 100;
                }
                this.descuentoLineaIluminar = valorI;
            }
            this.aplicarDescuentoPorLineaAFilas();
        },

        cargarLineasProducto() {
            let me = this;
            me.$http.get(me.$server_url + 'api/perseo/ventas-lista/lineas-producto')
            .then(function(res) {
                if (res.data && res.data.status === 'success' && Array.isArray(res.data.data)) {
                    me.lineasProductoOpciones = res.data.data.map(function(item) {
                        return {
                            id: parseInt(item.id, 10),
                            nombre: item.nombre
                        };
                    });
                } else {
                    me.lineasProductoOpciones = [];
                }
            })
            .catch(function() {
                me.lineasProductoOpciones = [];
            });
        },

        libroCoincideConLineaSeleccionada(libro) {
            return !!libro;
        },

        getTiposDocumento() {
            let me = this;
            me.$http.get(me.$server_url + 'Get_tdocu')
                .then(res => {
                    if (res.data && Array.isArray(res.data)) {
                        // Filtrar tipos de documento según el tipo de venta
                        let documentosFiltrados = res.data.filter(doc => {
                            // Siempre mostrar PRE-FACTURA (tdo_id: 1)
                            if (doc.tdo_id === 1) return true;
                            
                            // Si es venta directa, mostrar NOTA DE VENTA (AI) (tdo_id: 4)
                            if (me.esVentaDirecta() && doc.tdo_id === 4) {
                                return true;
                            }
                            
                            // Si es venta por lista (incluyendo totalizado), mostrar NOTA DE VENTA (BC) (tdo_id: 3)
                            if (me.esVentaPorLista() && doc.tdo_id === 3) {
                                return true;
                            }
                            
                            return false;
                        });
                        
                        me.tiposDocumento = documentosFiltrados;
                    }
                })
                .catch(err => {
                    console.error('Error al cargar tipos de documento:', err);
                });
        },
        // ====================================
        // FILTRO PERSONALIZADO PARA V-SELECT
        // ====================================
        filtrarLibros(options, search) {
            if (!search || search.trim() === '') return options;
            
            const searchLower = search.toLowerCase().trim();
            
            return options.filter(libro => {
                const codigo = (libro.pro_codigo || '').toLowerCase();
                const nombre = (libro.nombre_libro || '').toLowerCase();
                
                return codigo.includes(searchLower) || nombre.includes(searchLower);
            });
        },
        
        // ====================================
        // OBTENER LIBROS DISPONIBLES PARA UNA FILA
        // ====================================
        librosDisponiblesParaFila(filaIndex) {
            if (!this.librosPedido || !Array.isArray(this.librosPedido)) return [];
            
            const codigosSeleccionados = this.filasCaptura
                .map((fila, idx) => {
                    if (idx === filaIndex) return null;
                    return fila.libroSeleccionado ? fila.libroSeleccionado.pro_codigo : null;
                })
                .filter(codigo => codigo !== null);
            
            return this.librosPedido.filter(libro => {
                if (codigosSeleccionados.includes(libro.pro_codigo)) return false;
                // Excluir libros completamente vendidos
                const cantidadPedida = parseInt(libro.cantidad) || 0;
                const cantidadVendida = parseInt(libro.cantidadVendida) || 0;
                return (cantidadPedida - cantidadVendida) > 0;
            });
        },
        
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
            this.librosParaVentaTemporal = [];
        },
        
        cancelarVentaPorStockInsuficiente() {
            this.cerrarPopupStockInsuficiente();
            this.$f_notificacion(
                'Operación cancelada. Por favor revise las cantidades.', 
                'warning', 
                'AlertTriangleIcon', 
                3000
            );
        },
        
        continuarVentaConStockInsuficiente() {
            const librosParaVenta = this.librosParaVentaTemporal;
            this.cerrarPopupStockInsuficiente();
            
            // Continuar con la generación de la venta
            this.procesarVentaPerseo(librosParaVenta);
        },
        
        // ====================================
        // MÉTODOS EXISTENTES
        // ====================================
        // Método para calcular total del pedido (heredado de padre)
        calcularTotalPedido() {
            return this.librosPedido.reduce((total, libro) => {
                const precio = parseFloat(libro.precio) || 0;
                const cantidad = parseInt(libro.cantidad) || 0;
                const descuento = parseFloat(libro.descuento) || 0;
                
                const subtotal = precio * cantidad;
                const montoDescuento = subtotal * (descuento / 100);
                const totalLibro = subtotal - montoDescuento;
                
                return total + totalLibro;
            }, 0).toFixed(2);
        },
        
        cerrarVenta() {
            // Cancelar cualquier carga en progreso
            if (this.cargaEnProgreso) {
                this.cancelarCarga = true;
                
                // Dar un momento para que se cancele antes de cerrar
                setTimeout(() => {
                    this.popupVenta = false;
                    this.showFormularioCupo = false;
                    this.resetearVenta();
                    this.$emit('cerrar');
                }, 100);
            } else {
                this.popupVenta = false;
                this.showFormularioCupo = false;
                this.resetearVenta();
                this.$emit('cerrar');
            }
        },
        
        resetearVenta() {
            var nombreInstitucionInicial = (this.pedidoSeleccionado && this.pedidoSeleccionado.nombreInstitucion) || '';
            var nombrePeriodoInicial = (this.periodoSelect && this.periodoSelect.periodoescolar) || localStorage.getItem('nombre_periodo_selected') || '';
            var conceptoInicial = '';
            if (nombreInstitucionInicial && nombrePeriodoInicial) {
                conceptoInicial = nombreInstitucionInicial + ' / ' + nombrePeriodoInicial;
            } else if (nombreInstitucionInicial) {
                conceptoInicial = nombreInstitucionInicial;
            }

            this.ventaData = {
                empresa: null,
                tipoDocumento: null,
                descuento: this.obtenerDescuentoInicialPedido(),
                observacion: '',
                conceptoPerseo: conceptoInicial,
                lugarDespacho: {
                    nombreInstitucion: '',
                    ciudad: '',
                    id_institucion: '',
                    datosInstitucion: []
                },
                clientePerseo: {
                    idusuario: '',
                    nombre: '',
                    cedula: '',
                    email: '',
                    clientesidPerseo: 0
                }
            };
            
            // Aplicar lógica de descuentos según tipo de venta
            if (this.esVentaDirecta()) {
                // DIRECTA: ambas líneas usan contrato
                const descuentoDirecta = this.obtenerDescuentoContratoVentaDirecta();
                this.descuentoLineaProlipa = descuentoDirecta;
                this.descuentoLineaIluminar = descuentoDirecta;
            } else {
                // LISTA/TOTALIZADO: Prolipa = 0 (sin despacho), Iluminar = 60
                this.descuentoLineaProlipa = 0;
                this.descuentoLineaIluminar = 60;
            }
            
            this.ventaTotales = {
                subtotal: '0.00',
                descuento: '0.00',
                subtotalConDescuento: '0.00',
                iva: '0.00',
                transporte: '0.00',
                total: '0.00'
            };
            this.validationErrors = {
                empresa: '',
                lugarDespacho: '',
                clientePerseo: ''
            };
            
            // Resetear banderas de control de carga
            this.cargaEnProgreso = false;
            this.cancelarCarga = false;
            this.idCargaActual = null;
            this.clicksDesbloqueoEmpresa = 0;
            this.permitirCambioEmpresa = false;
            this.empresaSeleccionadaActual = null;
            
            // Resetear arrays de gestión de libros
            this.filtrarSoloConCantidad = false; // Resetear el filtro
            this.filasCaptura = [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: '',
                    descuentoModificado: false,
                    consultandoStock: false,
                    stockError: false
                }
            ];
            
            // Enfocar el primer v-select una vez el modal esté visible
            this.$nextTick(() => {
                setTimeout(() => {
                    // Solo enfocar si hay una empresa seleccionada
                    if (this.ventaData.empresa) {
                        this.enfocarSelect(0);
                    }
                }, 300);
            });
        },
        
        cargarEmpresas() {
            let me = this;
            me.listaEmpresas = [];
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data;
                    me.listaEmpresas = me.listaEmpresas.filter(
                        empresa => ![ 2, 3].includes(empresa.id)
                    );
                    
                    // Seleccionar empresa 1 por defecto (opcional)
                })
        },
        
        obtenerDescuentoInicialPedido() {
            // Si es venta directa, tomar el descuento directamente del pedido
            if (this.esVentaDirecta() && this.pedidoSeleccionado) {
                // Intentar obtener el descuento del pedido (puede estar en diferentes campos)
                let descuentoPedido = null;
                if (this.pedidoSeleccionado.descuento != null) {
                    descuentoPedido = this.pedidoSeleccionado.descuento;
                } else if (this.pedidoSeleccionado.descuento_pedido != null) {
                    descuentoPedido = this.pedidoSeleccionado.descuento_pedido;
                } else if (this.pedidoSeleccionado.descuento_general != null) {
                    descuentoPedido = this.pedidoSeleccionado.descuento_general;
                }
                
                if (descuentoPedido !== undefined && descuentoPedido !== null) {
                    const descuento = parseFloat(descuentoPedido);
                    return isNaN(descuento) ? 0 : Math.round(descuento * 100) / 100;
                }
            }

            // En totalizado no se debe tomar descuento desde contratos.
            // Debe esperar el descuento del lugar de despacho.
            if (this.totalizado) {
                return 0;
            }
            
            // Para venta por lista o si no hay descuento en el pedido, calcular el promedio de los libros
            if (!this.librosPedido || this.librosPedido.length === 0) {
                return 0;
            }
            
            const totalDescuentos = this.librosPedido.reduce((sum, libro) => {
                return sum + (parseFloat(libro.descuento) || 0);
            }, 0);
            
            const promedioDescuento = totalDescuentos / this.librosPedido.length;
            
            // Retornar el promedio con 2 decimales
            return Math.round(promedioDescuento * 100) / 100;
        },

        obtenerDescuentoContratoVentaDirecta() {
            if (!this.esVentaDirecta()) {
                return 0;
            }

            const descuentoContrato = parseFloat(this.obtenerDescuentoInicialPedido());
            if (isNaN(descuentoContrato)) {
                return 0;
            }
            const descuentoRedondeado = Math.round(descuentoContrato * 100) / 100;
            return Math.max(0, Math.min(100, descuentoRedondeado));
        },
        
        seleccionarEmpresa(empresa) {
            if (this.empresaSeleccionadaActual == empresa) {
                return;
            }

            // Limpiar cliente de Perseo si es necesario
            this.quitarClientePerseo();
            this.ventaData.empresa = empresa;
            this.empresaSeleccionadaActual = empresa;
            this.validationErrors.empresa = '';
            this.validationErrors.clientePerseo = '';
            this.clicksDesbloqueoEmpresa = 0;
            this.permitirCambioEmpresa = false;

            // Reiniciar detalle para recargar desde cero con la nueva empresa
            this.filtrarSoloConCantidad = false;
            this.popupStockInsuficiente = false;
            this.productosStockInsuficiente = [];
            this.librosParaVentaTemporal = [];
            this.cargaEnProgreso = false;
            this.cancelarCarga = false;
            this.filasCaptura = [
                {
                    textoBusqueda: '',
                    libroSeleccionado: null,
                    cantidad: '',
                    descuento: this.obtenerDescuentoInicialFila(),
                    descuentoModificado: false,
                    confirmado: false,
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: '',
                    errorDescuento: '',
                    consultandoStock: false,
                    stockError: false
                }
            ];

            this.calcularTotalesVentas();

            // Llenar automáticamente la tabla con todos los libros del pedido
            // this.$nextTick(() => {
            //     this.llenarTablaAutomaticamente();
            // });
        },

        empresaEstaBloqueada() {
            return this.tieneLibrosConCantidad() && !this.permitirCambioEmpresa;
        },

        intentarDesbloquearEmpresa() {
            if (!this.tieneLibrosConCantidad()) {
                this.permitirCambioEmpresa = true;
                return;
            }

            this.clicksDesbloqueoEmpresa = this.clicksDesbloqueoEmpresa + 1;

            if (this.clicksDesbloqueoEmpresa >= 3) {
                this.permitirCambioEmpresa = true;
                this.$f_notificacion(
                    'Cambio de empresa desbloqueado. Al seleccionar una nueva empresa se recargará la tabla.',
                    'warning',
                    'AlertTriangleIcon',
                    2500
                );
            }
        },
        
        // ========================================
        // MÉTODOS PARA VALIDACIONES DE VENTA POR LISTA
        // ========================================
        
        esVentaPorLista() {
            // Si hay totalizado, siempre es venta por lista
            if (this.totalizado) {
                return true;
            }
            // Si hay pedido, verificar tipo_venta
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 2;
        },
        
        esVentaDirecta() {
            // Si hay totalizado, nunca es venta directa
            if (this.totalizado) {
                return false;
            }
            // Si hay pedido, verificar tipo_venta
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 1;
        },

        obtenerDatosControlCupoActual() {
            const lugarDespacho = this.ventaData.lugarDespacho;
            if (!lugarDespacho || !lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return null;
            }
            return lugarDespacho.datosInstitucion[0];
        },

        obtenerVentasActivasInstitucion() {
            const datos = this.obtenerDatosControlCupoActual();
            if (!datos) {
                return 0;
            }

            const count = parseInt(datos.ventas_activas_count, 10);
            if (!isNaN(count)) {
                return count;
            }

            if (datos.es_primera_venta === true || datos.es_primera_venta === 1 || datos.es_primera_venta === '1') {
                return 0;
            }

            return 1;
        },

        esPrimeraVentaInstitucion() {
            if (!this.esVentaPorLista()) {
                return false;
            }

            return this.obtenerVentasActivasInstitucion() === 0;
        },
        
        tieneCupoSuficiente() {
            return this.tieneCupoGeneralSuficiente() && this.tieneSaldoTipoDocumentoSuficiente();
        },

        tieneCupoGeneralSuficiente() {
            if (!this.esVentaPorLista()) return true; // No aplica para venta directa

            if (!this.esPrimeraVentaInstitucion()) {
                return true;
            }
            
            const lugarDespacho = this.ventaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return false; // No tiene datos financieros
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalVenta = this.calcularTotalesUnificados().total || 0;
            
            return cupoInicial > 0 && totalVenta <= cupoInicial;
        },

        esDocumentoPrefactura() {
            return parseInt(this.ventaData.tipoDocumento, 10) === 1;
        },

        esDocumentoNotaCredito() {
            const tipoDocumento = parseInt(this.ventaData.tipoDocumento, 10);
            return tipoDocumento === 3 || tipoDocumento === 4;
        },

        usaControlSaldoPorDocumento() {
            return this.esDocumentoPrefactura() || this.esDocumentoNotaCredito();
        },

        obtenerEtiquetaSaldoDocumentoActual() {
            if (this.esDocumentoPrefactura()) {
                return 'prefacturas';
            }
            if (this.esDocumentoNotaCredito()) {
                return 'notas';
            }
            return 'documento';
        },

        obtenerSaldoMaximoDocumentoActual() {
            const lugarDespacho = this.ventaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return 0;
            }

            const datosInstitucion = lugarDespacho.datosInstitucion[0];

            if (this.esDocumentoPrefactura()) {
                return parseFloat(datosInstitucion.ffp_saldo_prefacturas || 0) || 0;
            }

            if (this.esDocumentoNotaCredito()) {
                return parseFloat(datosInstitucion.ffp_saldo_notas || 0) || 0;
            }

            return parseFloat(datosInstitucion.ffp_cupo || 0) || 0;
        },

        obtenerSaldoConsumidoDocumentoActual() {
            const lugarDespacho = this.ventaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return 0;
            }

            const datosInstitucion = lugarDespacho.datosInstitucion[0];

            if (this.esDocumentoPrefactura()) {
                return parseFloat(datosInstitucion.ffp_consumido_prefacturas || 0) || 0;
            }

            if (this.esDocumentoNotaCredito()) {
                return parseFloat(datosInstitucion.ffp_consumido_notas || 0) || 0;
            }

            return 0;
        },

        obtenerSaldoDisponibleDocumentoActual() {
            const disponible = this.obtenerSaldoMaximoDocumentoActual() - this.obtenerSaldoConsumidoDocumentoActual();
            return disponible > 0 ? disponible : 0;
        },

        tieneSaldoTipoDocumentoSuficiente() {
            if (!this.esVentaPorLista()) {
                return true;
            }

            if (!this.usaControlSaldoPorDocumento()) {
                return true;
            }

            const totalVenta = this.calcularTotalesUnificados().total || 0;
            const saldoDisponible = this.obtenerSaldoDisponibleDocumentoActual();

            return totalVenta <= saldoDisponible;
        },

        obtenerSaldoPrefacturasFormulario() {
            const cupo = parseFloat(this.formularioCupoData.ffp_cupo || 0) || 0;
            const porcentaje = parseFloat(this.formularioCupoData.ffp_porcentaje_facturacion || 0) || 0;
            const saldoGuardado = parseFloat(this.formularioCupoData.ffp_saldo_prefacturas || 0) || 0;

            if (this.formularioCupoData.ffp_saldo_prefacturas !== '' && this.formularioCupoData.ffp_saldo_prefacturas !== null && this.formularioCupoData.ffp_saldo_prefacturas !== undefined) {
                return saldoGuardado;
            }

            return (cupo * porcentaje) / 100;
        },

        obtenerSaldoNotasFormulario() {
            const cupo = parseFloat(this.formularioCupoData.ffp_cupo || 0) || 0;
            const porcentaje = parseFloat(this.formularioCupoData.ffp_porcentaje_facturacion || 0) || 0;
            const saldoGuardado = parseFloat(this.formularioCupoData.ffp_saldo_notas || 0) || 0;

            if (this.formularioCupoData.ffp_saldo_notas !== '' && this.formularioCupoData.ffp_saldo_notas !== null && this.formularioCupoData.ffp_saldo_notas !== undefined) {
                return saldoGuardado;
            }

            return cupo - ((cupo * porcentaje) / 100);
        },

        obtenerDisponiblePrefacturasFormulario() {
            const disponible = this.obtenerSaldoPrefacturasFormulario() - (parseFloat(this.formularioCupoData.ffp_consumido_prefacturas || 0) || 0);
            return disponible > 0 ? disponible : 0;
        },

        obtenerDisponibleNotasFormulario() {
            const disponible = this.obtenerSaldoNotasFormulario() - (parseFloat(this.formularioCupoData.ffp_consumido_notas || 0) || 0);
            return disponible > 0 ? disponible : 0;
        },
        
        obtenerCupoMaximo() {
            if (!this.esVentaPorLista()) return '0.00';
            
            const lugarDespacho = this.ventaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            return cupoInicial.toFixed(2);
        },
        
        calcularDiferenciaCupo() {
            if (!this.esVentaPorLista()) return '0.00';
            
            const lugarDespacho = this.ventaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalVenta = this.calcularTotalesUnificados().total || 0;
            
            // Retornar la diferencia absoluta
            const diferencia = Math.abs(cupoInicial - totalVenta);
            return diferencia.toFixed(2);
        },
        
        validarCupoParaVentaPorLista() {
            if (!this.esVentaPorLista()) return true; // No aplica para venta directa
            
            const lugarDespacho = this.ventaData.lugarDespacho;
            
            // Validar que tenga lugar de despacho seleccionado
            if (!lugarDespacho.nombreInstitucion) {
                this.validationErrors.lugarDespacho = 'Debe seleccionar un lugar de despacho para ventas por lista';
                return false;
            }
            
            // Si no tiene datos financieros o cupo, NO ES ERROR - solo mostrar mensaje informativo
            // El botón "Configurar Cupo" ya está visible en la UI
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                this.validationErrors.lugarDespacho = '';
                return true; // PERMITIR continuar
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            if (cupoInicial <= 0) {
                this.validationErrors.lugarDespacho = '';
                return true; // PERMITIR continuar
            }
            
            // SOLO validar que el total no supere el cupo SI ya existe cupo configurado
            const totalVenta = this.calcularTotalesUnificados().total || 0;
            if (this.esPrimeraVentaInstitucion() && totalVenta > cupoInicial) {
                this.validationErrors.lugarDespacho = `⚠️ El total ($${totalVenta.toFixed(2)}) supera el cupo disponible ($${cupoInicial.toFixed(2)})`;
                return false;
            }

            if (!this.tieneSaldoTipoDocumentoSuficiente()) {
                this.validationErrors.lugarDespacho = `⚠️ El total ($${totalVenta.toFixed(2)}) supera el saldo disponible para ${this.obtenerEtiquetaSaldoDocumentoActual()} ($${this.obtenerSaldoDisponibleDocumentoActual().toFixed(2)})`;
                return false;
            }
            
            this.validationErrors.lugarDespacho = '';
            return true;
        },
        
        // Normalizar descuento principal al perder el foco (05 -> 5)
        normalizarDescuentoPrincipal() {
            if (this.ventaData.descuento !== '' && this.ventaData.descuento !== null) {
                let valor = parseInt(this.ventaData.descuento, 10);
                if (isNaN(valor)) {
                    valor = 0;
                }
                this.ventaData.descuento = valor;
            }
        },
        
        // Validar y corregir descuento principal (0-100)
        validarYCorregirDescuentoPrincipal(tipo) {
            if( tipo === 1){
                this.normalizarDescuentoPrincipal();
                if (this.ventaData.descuento !== '' && this.ventaData.descuento !== null) {
                    let valor = parseInt(this.ventaData.descuento, 10);
                    
                    if (!isNaN(valor)) {
                        // Corregir si está fuera del rango
                        if (valor > 100) {
                            this.ventaData.descuento = 100;
                        } else if (valor < 0) {
                            this.ventaData.descuento = 0;
                        }
                    }
                }
            }else{
                this.normalizarDescuentoCupo();
                if (this.formularioCupoData.ffp_descuento !== '' && this.formularioCupoData.ffp_descuento !== null) {
                    const valor = parseInt(this.formularioCupoData.ffp_descuento, 10);
                    if (!isNaN(valor)) {
                        // Corregir si está fuera del rango
                        if (valor > 100) {
                            this.formularioCupoData.ffp_descuento = 100;
                        } else if (valor < 0) {
                            this.formularioCupoData.ffp_descuento = 0;
                        }
                    }
                }
            }
        },
        // Normalizar descuento de cupo al perder el foco (05 -> 5)
        normalizarDescuentoCupo() {
            if (this.formularioCupoData.ffp_descuento !== '' && this.formularioCupoData.ffp_descuento !== null) {
                const valor = parseInt(this.formularioCupoData.ffp_descuento, 10);
                if (!isNaN(valor)) {
                    this.formularioCupoData.ffp_descuento = valor.toString();
                }
            }
        },
        
        // Validar descuento principal - retorna true si es válido
        validarDescuentoPrincipal() {
            let descuento = parseInt(this.ventaData.descuento, 10);
            
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                return false;
            }
            
            return true;
        },
        
        // Validar descuento de cupo - retorna true si es válido
        validarDescuentoCupo() {
            let descuento = parseInt(this.formularioCupoData.ffp_descuento, 10);
            
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                return false;
            }
            
            return true;
        },
        
        calcularTotalesVentas() {
            // Usar el nuevo método de cálculo unificado
            const totalesVenta = this.calcularTotalesUnificados();
            
            this.ventaTotales = {
                subtotal: totalesVenta.subtotal.toFixed(2),
                descuento: totalesVenta.descuentoMonto.toFixed(2),
                subtotalConDescuento: totalesVenta.subtotalConDescuento.toFixed(2),
                iva: '0.00', // Siempre 0 según requerimiento
                transporte: '0.00', // Siempre 0 según requerimiento
                total: totalesVenta.subtotalConDescuento.toFixed(2) // Total = Subtotal - Descuento (sin IVA ni transporte)
            };
            
            // Validar cupo para venta por lista cuando cambien los totales
            if (this.esVentaPorLista() && this.ventaData.lugarDespacho.nombreInstitucion) {
                this.validarCupoParaVentaPorLista();
            }
        },
        
        calcularTotalesUnificados() {
            // Validación defensiva: si filasCaptura no existe o no es array, retornar valores por defecto
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return {
                    subtotal: 0,
                    descuentoMonto: 0,
                    subtotalConDescuento: 0,
                    iva: 0,
                    transporte: 0,
                    total: 0,
                    cantidadLibros: 0
                };
            }
            
            // Obtener solo libros capturados con cantidad desde la tabla de captura
            const librosCapturados = this.filasCaptura.filter(fila => 
                fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0
            );
            
            // Calcular subtotal bruto (sin descuento)
            let subtotal = 0;
            let descuentoMonto = 0;
            
            librosCapturados.forEach(fila => {
                const precio = this.obtenerPrecioLibroParaCalculo(fila.libroSeleccionado);
                if (precio === null) {
                    return;
                }
                const cantidad = parseInt(fila.cantidad) || 0;
                const descuentoPorcentaje = parseFloat(fila.descuento || 0);
                
                const subtotalFila = precio * cantidad;
                const descuentoFila = (subtotalFila * descuentoPorcentaje) / 100;
                
                subtotal += subtotalFila;
                descuentoMonto += descuentoFila;
            });
            
            // Redondear a 2 decimales para evitar errores de precisión
            subtotal = Math.round(subtotal * 100) / 100;
            descuentoMonto = Math.round(descuentoMonto * 100) / 100;
            const subtotalConDescuento = Math.round((subtotal - descuentoMonto) * 100) / 100;
            
            // IVA y transporte siempre son 0 según requerimiento
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
                cantidadLibros: librosCapturados.length
            };
        },
        
        calcularSubtotalLibro(libro) {
            if (!libro.cantidadVenta || parseInt(libro.cantidadVenta) === 0) {
                return '0.00';
            }
            const precio = this.obtenerPrecioLibroParaCalculo(libro);
            if (precio === null) {
                return '0.00';
            }
            const cantidad = parseInt(libro.cantidadVenta) || 0;
            const subtotal = precio * cantidad;
            
            // Redondear a 2 decimales
            return (Math.round(subtotal * 100) / 100).toFixed(2);
        },
        
        calcularSubtotalFila(fila) {
            if (!fila.libroSeleccionado || !fila.cantidad || parseInt(fila.cantidad) === 0) {
                return '0.00';
            }
            const precio = this.obtenerPrecioLibroParaCalculo(fila.libroSeleccionado);
            if (precio === null) {
                return '0.00';
            }
            const cantidad = parseInt(fila.cantidad) || 0;
            const descuento = parseFloat(fila.descuento || 0);
            
            const subtotal = precio * cantidad;
            const descuentoMonto = (subtotal * descuento) / 100;
            const total = subtotal - descuentoMonto;
            
            // Redondear a 2 decimales
            return (Math.round(total * 100) / 100).toFixed(2);
        },
        
        // Métodos para búsquedas
        abrirBusquedaLugar() {
            this.mostrarBusquedaLugar = true;
        },
        
        cerrarBusquedaLugar() {
            this.mostrarBusquedaLugar = false;
        },
        
        abrirEditarInstitucion() {
            if (!this.ventaData.lugarDespacho.id_institucion) {
                this.$vs.notify({
                    title: 'Error',
                    text: 'Primero debe seleccionar un lugar de despacho',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }
            this.mostrarEditarInstitucion = true;
        },
        
        actualizarDespuesDeEditar(guardado) {
            if (guardado) {
                // Cerrar el modal
                this.mostrarEditarInstitucion = false;
                
                // Opcional: Recargar los datos del lugar de despacho para reflejar cambios
                this.$vs.notify({
                    title: 'Éxito',
                    text: 'Información de la institución actualizada correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle'
                });
            }
        },
        
        asignarLugarDespacho(lugar) {
            this.ventaData.lugarDespacho = lugar;
            this.validationErrors.lugarDespacho = '';

            if (!this.ventaData.conceptoPerseo || this.ventaData.conceptoPerseo.trim() === '') {
                var nombreInstitucion = (this.pedidoSeleccionado && this.pedidoSeleccionado.nombreInstitucion) || '';
                var nombrePeriodo = (this.periodoSelect && this.periodoSelect.periodoescolar) || localStorage.getItem('nombre_periodo_selected') || '';
                if (nombreInstitucion && nombrePeriodo) {
                    this.ventaData.conceptoPerseo = nombrePeriodo  + ' / ' + nombreInstitucion;
                } else if (nombreInstitucion) {
                    this.ventaData.conceptoPerseo = nombreInstitucion;
                } else if(nombrePeriodo){
                    this.ventaData.conceptoPerseo = nombrePeriodo;
                } else {
                    this.ventaData.conceptoPerseo = 'Venta Perseo';
                }
            }
            
            // NUEVA LÓGICA: Consultar si existe cupo para este lugar de despacho
            this.consultarCupoLugarDespacho();
            
            // Recalcular totales después de asignar lugar
            this.calcularTotalesVentas();
        },

        aplicarDescuentosLineaDesdeLugar(datosInstitucion) {
            // DIRECTA: Prolipa e Iluminar usan descuento del contrato
            if (this.esVentaDirecta()) {
                const descuentoDirecta = this.obtenerDescuentoContratoVentaDirecta();
                this.descuentoLineaProlipa = descuentoDirecta;
                this.descuentoLineaIluminar = descuentoDirecta;
            } else {
                // LISTA/TOTALIZADO: Prolipa del lugar despacho, Iluminar siempre 60%
                let descuentoProlipa = 0;
                if (datosInstitucion && datosInstitucion.ffp_descuento != null) {
                    descuentoProlipa = parseFloat(datosInstitucion.ffp_descuento);
                }
                descuentoProlipa = isNaN(descuentoProlipa)
                    ? 0
                    : Math.round(Math.max(0, Math.min(100, descuentoProlipa)) * 100) / 100;
                
                this.descuentoLineaProlipa = descuentoProlipa;
                this.descuentoLineaIluminar = 60;
            }
        },
        
        // Nuevo método para consultar el cupo del lugar de despacho
        async consultarCupoLugarDespacho() {
            const idInstitucion = this.ventaData.lugarDespacho.id_institucion;
            
            if (!idInstitucion) {
                return;
            }
            
            const parametros = {
                idInstitucion: idInstitucion,
                idperiodoescolar: this.idPeriodo,
                ven_totalizado: this.totalizado && this.totalizado.ca_codigo_agrupado ? this.totalizado.ca_codigo_agrupado : null
            };
            
            try {
                const res = await this.$http.get(this.$server_url + 'obtenerPorInstitucionPeriodo', { params: parametros });
                
                if (res.data.success && res.data.data) {
                    // ✅ Cupo encontrado - actualizar datosInstitucion
                    this.ventaData.lugarDespacho.datosInstitucion = [res.data.data];
                    this.aplicarDescuentosLineaDesdeLugar(res.data.data);
                    
                    // Si es venta por lista, aplicar automáticamente el descuento
                    if (this.esVentaPorLista()) {
                        const descuentoLugar = parseInt(res.data.data.ffp_descuento, 10) || 0;
                        this.ventaData.descuento = descuentoLugar;
                        
                        this.$vs.notify({
                            text: `Descuento del lugar de despacho aplicado: ${descuentoLugar}%`,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        });
                    }
                } else {
                    // ⚠️ No existe cupo - limpiar datosInstitucion
                    this.ventaData.lugarDespacho.datosInstitucion = [];
                    this.aplicarDescuentosLineaDesdeLugar(null);
                    
                    // Si es venta por lista, aplicar descuento inicial del pedido
                    if (this.esVentaPorLista()) {
                        this.ventaData.descuento = this.obtenerDescuentoInicialPedido();
                    }
                }
                
                // Recalcular totales después de obtener el cupo
                this.calcularTotalesVentas();
            } catch (error) {
                console.error('Error al consultar cupo:', error);
                this.ventaData.lugarDespacho.datosInstitucion = [];
                this.aplicarDescuentosLineaDesdeLugar(null);
            }
        },
        
        quitarLugarDespacho() {
            this.ventaData.lugarDespacho = {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
                datosInstitucion: []
            };
            
            // Aplicar lógica de descuentos al tipo de venta
            if (this.esVentaDirecta()) {
                // DIRECTA: ambas líneas usan descuento del contrato
                const descuentoDirecta = this.obtenerDescuentoContratoVentaDirecta();
                this.descuentoLineaProlipa = descuentoDirecta;
                this.descuentoLineaIluminar = descuentoDirecta;
            } else {
                // LISTA/TOTALIZADO: Prolipa sin despacho = 0, Iluminar = 60
                this.descuentoLineaProlipa = 0;
                this.descuentoLineaIluminar = 60;
            }
            
            // Si es venta por lista, resetear el descuento al valor inicial del pedido
            if (this.esVentaPorLista()) {
                this.ventaData.descuento = this.obtenerDescuentoInicialPedido();
                
                this.$vs.notify({
                    text: 'Lugar de despacho eliminado. Descuento restablecido.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
            
            // Recalcular totales
            this.calcularTotalesVentas();
        },
        
        abrirBusquedaCliente() {
            if (!this.ventaData.empresa) {
                this.$vs.notify({
                    text: 'Debe seleccionar una empresa primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            this.mostrarBusquedaCliente = true;
        },
        
        cerrarBusquedaCliente() {
            this.mostrarBusquedaCliente = false;
        },
        
        // Métodos para editar cupo
        toggleFormularioCupo() {
            if (this.showFormularioCupo) {
                this.showFormularioCupo = false;
            } else {
                this.cargarDatosFormularioCupo();
            }
        },
        
        cargarDatosFormularioCupo() {
            if (!this.ventaData.lugarDespacho.nombreInstitucion) {
                this.$vs.notify({
                    text: 'Debe seleccionar un lugar de despacho primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const idInstitucion = this.ventaData.lugarDespacho.id_institucion;
            
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
                idperiodoescolar: this.idPeriodo,
                ven_totalizado: this.totalizado && this.totalizado.ca_codigo_agrupado ? this.totalizado.ca_codigo_agrupado : null
            };

            this.$vs.loading();
            
            this.$http.get(this.$server_url + 'obtenerPorInstitucionPeriodo', { params: parametros })
                .then(res => {
                    this.$vs.loading.close();
                    
                    if (res.data.success && res.data.data) {
                        // Editar: Formulario existe, cargar datos
                        this.formularioCupoData = {
                            ffp_id: res.data.data.ffp_id,
                            idInstitucion: res.data.data.idInstitucion,
                            idperiodoescolar: res.data.data.idperiodoescolar,
                            ffp_credito: res.data.data.ffp_credito,
                            ffp_cupo: res.data.data.ffp_cupo,
                            ffp_porcentaje_facturacion: res.data.data.ffp_porcentaje_facturacion,
                            ffp_porcentaje_facturacion_original: res.data.data.ffp_porcentaje_facturacion,
                            ffp_saldo_prefacturas: res.data.data.ffp_saldo_prefacturas,
                            ffp_saldo_notas: res.data.data.ffp_saldo_notas,
                            ffp_consumido_prefacturas: res.data.data.ffp_consumido_prefacturas || 0,
                            ffp_consumido_notas: res.data.data.ffp_consumido_notas || 0,
                            ffp_descuento: res.data.data.ffp_descuento,
                            if_distribuidor: res.data.data.if_distribuidor === 1,
                            nombreInstitucion: res.data.data.nombreInstitucion || this.ventaData.lugarDespacho.nombreInstitucion,
                            ciudad: res.data.data.ciudad || this.ventaData.lugarDespacho.ciudad
                        };
                        this.showFormularioCupo = true;
                    } else {
                        // Crear: No existe formulario, preparar datos para creación
                        this.formularioCupoData = {
                            ffp_id: null,
                            idInstitucion: idInstitucion,
                            idperiodoescolar: parametros.idperiodoescolar,
                            ffp_credito: '',
                            ffp_cupo: '',
                            ffp_porcentaje_facturacion: '',
                            ffp_porcentaje_facturacion_original: '',
                            ffp_saldo_prefacturas: '',
                            ffp_saldo_notas: '',
                            ffp_consumido_prefacturas: 0,
                            ffp_consumido_notas: 0,
                            ffp_descuento: '',
                            if_distribuidor: false,
                            nombreInstitucion: this.ventaData.lugarDespacho.nombreInstitucion,
                            ciudad: this.ventaData.lugarDespacho.ciudad
                        };
                        this.showFormularioCupo = true;
                        
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
                        ffp_porcentaje_facturacion: '',
                        ffp_porcentaje_facturacion_original: '',
                        ffp_saldo_prefacturas: '',
                        ffp_saldo_notas: '',
                        ffp_consumido_prefacturas: 0,
                        ffp_consumido_notas: 0,
                        ffp_descuento: '',
                        if_distribuidor: false,
                        nombreInstitucion: this.ventaData.lugarDespacho.nombreInstitucion,
                        ciudad: this.ventaData.lugarDespacho.ciudad
                    };
                    this.showFormularioCupo = true;
                });
        },
        
        guardarFormularioCupo() {
            // Validación básica
            if (
                this.formularioCupoData.ffp_credito === '' || this.formularioCupoData.ffp_credito === null || this.formularioCupoData.ffp_credito === undefined ||
                this.formularioCupoData.ffp_cupo === '' || this.formularioCupoData.ffp_cupo === null || this.formularioCupoData.ffp_cupo === undefined ||
                this.formularioCupoData.ffp_porcentaje_facturacion === '' || this.formularioCupoData.ffp_porcentaje_facturacion === null || this.formularioCupoData.ffp_porcentaje_facturacion === undefined ||
                this.formularioCupoData.ffp_descuento === '' || this.formularioCupoData.ffp_descuento === null || this.formularioCupoData.ffp_descuento === undefined
            ) {
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

            if (this.formularioCupoData.ffp_id && !this.puedeEditarPorcentajeFacturacionCupo) {
                var porcentajeActual = parseInt(this.formularioCupoData.ffp_porcentaje_facturacion, 10);
                var porcentajeOriginal = parseInt(this.formularioCupoData.ffp_porcentaje_facturacion_original, 10);

                if (isNaN(porcentajeActual)) {
                    porcentajeActual = 0;
                }

                if (isNaN(porcentajeOriginal)) {
                    porcentajeOriginal = 0;
                }

                if (porcentajeActual !== porcentajeOriginal) {
                    this.$vs.notify({
                        text: 'Solo usuario root puede cambiar el porcentaje de facturación.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }
            }

            const datosGuardar = {
                idInstitucion: this.formularioCupoData.idInstitucion,
                idperiodoescolar: this.formularioCupoData.idperiodoescolar,
                ffp_credito: this.formularioCupoData.ffp_credito,
                ffp_cupo: this.formularioCupoData.ffp_cupo,
                ffp_porcentaje_facturacion: this.formularioCupoData.ffp_porcentaje_facturacion,
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
                    console.error('Error al guardar formulario:', error);
                    
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
        },
        
        asignarClientePerseo(cliente) {
            this.ventaData.clientePerseo = cliente;
            this.validationErrors.clientePerseo = '';
        },
        
        quitarClientePerseo() {
            this.ventaData.clientePerseo = {
                idusuario: '',
                nombre: '',
                cedula: '',
                email: '',
                clientesidPerseo: 0
            };
        },
        
        validarProforma() {
            let isValid = true;
            let errores = [];
            let primerCampoConError = null;
            
            // 1. Validar que tenga empresa seleccionada
            if (!this.ventaData.empresa) {
                this.validationErrors.empresa = 'Debe seleccionar una empresa';
                errores.push('Debe seleccionar una empresa');
                if (!primerCampoConError) primerCampoConError = 'inputEmpresa';
                isValid = false;
            }
            
            // 2. Validar que tenga tipo de documento seleccionado
            if (!this.ventaData.tipoDocumento) {
                errores.push('Debe seleccionar un tipo de documento');
                isValid = false;
            }
            
            // 3. Validar descuento (debe ser numérico, no vacío, 0 o mayor)
            const descuento = this.ventaData.descuento;
            if (descuento === null || descuento === undefined || descuento === '') {
                errores.push('El descuento no puede estar vacío (debe ser 0 o mayor)');
                if (!primerCampoConError) primerCampoConError = 'inputDescuento';
                isValid = false;
            } else {
                const descuentoNum = parseFloat(descuento);
                if (isNaN(descuentoNum)) {
                    errores.push('El descuento debe ser un valor numérico');
                    if (!primerCampoConError) primerCampoConError = 'inputDescuento';
                    isValid = false;
                } else if (descuentoNum < 0) {
                    errores.push('El descuento no puede ser negativo');
                    if (!primerCampoConError) primerCampoConError = 'inputDescuento';
                    isValid = false;
                }
            }
            
            // 4. Validar observación (debe tener contenido)
            if (!this.ventaData.observacion || this.ventaData.observacion.trim() === '') {
                errores.push('Debe ingresar una observación');
                if (!primerCampoConError) primerCampoConError = 'inputObservacion';
                isValid = false;
            }
            
            // 5. Validar concepto Perseo (debe tener contenido)
            if (!this.ventaData.conceptoPerseo || this.ventaData.conceptoPerseo.trim() === '') {
                errores.push('Debe ingresar un concepto para Perseo');
                if (!primerCampoConError) primerCampoConError = 'inputConceptoPerseo';
                isValid = false;
            }
            
            // 6. Validar lugar de despacho
            if (!this.ventaData.lugarDespacho.nombreInstitucion) {
                this.validationErrors.lugarDespacho = 'Debe seleccionar un lugar de despacho';
                errores.push('Debe seleccionar un lugar de despacho');
                if (!primerCampoConError) primerCampoConError = 'btnLugarDespacho';
                isValid = false;
            }
            
            // 7. Validar cliente Perseo
            if (!this.ventaData.clientePerseo.nombre) {
                this.validationErrors.clientePerseo = 'Debe seleccionar un cliente de Perseo';
                errores.push('Debe seleccionar un cliente de Perseo');
                if (!primerCampoConError) primerCampoConError = 'btnClientePerseo';
                isValid = false;
            }
            
            // 6. Validar que tenga al menos una cantidad seleccionada
            const tieneCantidades = this.filasCaptura && Array.isArray(this.filasCaptura) && this.filasCaptura.some(fila => 
                fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0
            );
            
            if (!tieneCantidades) {
                errores.push('Debe ingresar al menos una cantidad de libro');
                isValid = false;
            }
            
            // 7. Validar que no haya errores de validación en las cantidades ingresadas
            const tieneErroresEnCantidades = this.filasCaptura && Array.isArray(this.filasCaptura) && this.filasCaptura.some(fila => 
                fila.errorCantidad && fila.errorCantidad !== ''
            );
            
            if (tieneErroresEnCantidades) {
                errores.push('Hay errores en las cantidades ingresadas. Por favor corríjalos antes de guardar');
                isValid = false;
            }
            
            // También validar errores en la tabla de llenado rápido
            const tieneErroresEnRapida = this.filasCaptura && Array.isArray(this.filasCaptura) && this.filasCaptura.some(fila => 
                fila.errorCantidad && fila.errorCantidad !== ''
            );
            
            if (tieneErroresEnRapida) {
                errores.push('Hay errores en el llenado rápido. Por favor corríjalos antes de guardar');
                isValid = false;
            }
            
            // 8. Validaciones específicas para venta por lista
            if (this.esVentaPorLista()) {
                if (!this.validarCupoParaVentaPorLista()) {
                    isValid = false;
                }
            }
            
            // Mostrar todos los errores encontrados
            if (!isValid && errores.length > 0) {
                const mensajeErrores = errores.length === 1 
                    ? errores[0] 
                    : '<ul style="text-align: left; margin: 0; padding-left: 20px;">' + 
                      errores.map(e => '<li>' + e + '</li>').join('') + 
                      '</ul>';
                
                this.$vs.notify({
                    title: 'Validación de Proforma',
                    text: mensajeErrores,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    time: 8000,
                    position: 'top-center'
                });
                
                // Hacer focus en el primer campo con error
                if (primerCampoConError) {
                    this.$nextTick(() => {
                        const campo = this.$refs[primerCampoConError];
                        if (campo) {
                            // Para v-select necesitamos acceder al input interno
                            if (primerCampoConError === 'inputEmpresa') {
                                const searchInput = campo.$el.querySelector('input[type="search"]');
                                if (searchInput) {
                                    searchInput.focus();
                                    // Scroll suave hacia el elemento
                                    campo.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }
                            // Para vs-input y vs-textarea
                            else if (campo.$el) {
                                const input = campo.$el.querySelector('input, textarea');
                                if (input) {
                                    input.focus();
                                    // Scroll suave hacia el elemento
                                    campo.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }
                            // Para divs (botones de búsqueda)
                            else if (campo.scrollIntoView) {
                                campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                // Agregar un efecto visual temporal
                                campo.classList.add('shake-error');
                                setTimeout(() => {
                                    campo.classList.remove('shake-error');
                                }, 600);
                            }
                        }
                    });
                }
            }
            
            return isValid;
        },
        
        validarFormularioCompleto() {
            const camposBasicosCompletos = this.ventaData.empresa && 
                   this.ventaData.lugarDespacho.nombreInstitucion && 
                   this.ventaData.clientePerseo.nombre &&
                   this.ventaData.observacion &&
                   this.ventaData.observacion.trim() !== '';
            
            // Para venta por lista, validar también el cupo
            if (this.esVentaPorLista()) {
                return camposBasicosCompletos && this.tieneCupoSuficiente();
            }
            
            return camposBasicosCompletos;
        },
        
        // Método que intenta generar la venta y muestra mensajes de error si falta algo
        intentargenerarVentaPerseo() {
            // Validar qué datos faltan
            let erroresFaltantes = [];
            
            if (!this.ventaData.empresa) {
                erroresFaltantes.push('• Debe seleccionar una <b>Empresa</b>');
            }

            if (!this.ventaData.lugarDespacho.nombreInstitucion) {
                erroresFaltantes.push('• Debe seleccionar un <b>Lugar de Despacho</b>');
            }
            
            if (!this.ventaData.clientePerseo.nombre) {
                erroresFaltantes.push('• Debe seleccionar un <b>Cliente Perseo</b>');
            }
            
            if (!this.ventaData.observacion || this.ventaData.observacion.trim() === '') {
                erroresFaltantes.push('• Debe ingresar una <b>Observación</b>');
            }
            
            this.normalizarDescuentoPorLinea('prolipa');
            this.normalizarDescuentoPorLinea('iluminar');
            
            // Validar que tenga al menos una cantidad
            const tieneCantidades = this.filasCaptura && Array.isArray(this.filasCaptura) && this.filasCaptura.some(fila => 
                fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0
            );
            
            if (!tieneCantidades) {
                erroresFaltantes.push('• Debe ingresar al menos <b>una cantidad</b> para la venta');
            }

            // Validar que no existan filas con libro seleccionado pero cantidad vacia o en 0
            const filasInvalidasCantidad = [];
            if (this.filasCaptura && Array.isArray(this.filasCaptura)) {
                this.filasCaptura.forEach((fila, index) => {
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
                erroresFaltantes.push('• Las filas ' + filasInvalidasCantidad.join(', ') + ' tienen <b>cantidad vacia o en 0</b>. Debe corregirlas antes de guardar');
            }

            // Validar combos: no permitir generar si algún combo tiene stock insuficiente o no verificado
            if (this.filasCaptura && Array.isArray(this.filasCaptura)) {
                this.filasCaptura.forEach((fila, index) => {
                    if (!fila || !fila.libroSeleccionado) return;
                    if (!this.esLibroComboParaStock(fila.libroSeleccionado)) return;
                    const cantidadTexto = fila.cantidad != null ? String(fila.cantidad).trim() : '';
                    if (cantidadTexto === '' || parseInt(cantidadTexto, 10) <= 0) return;
                    if (fila.libroSeleccionado.puede_vender === null || fila.libroSeleccionado.consultandoStockCombo) {
                        erroresFaltantes.push(`• Fila ${index + 1} (<b>${fila.libroSeleccionado.pro_codigo}</b>): esperando verificación de stock del combo`);
                    } else if (fila.libroSeleccionado.puede_vender === false) {
                        erroresFaltantes.push(`• Fila ${index + 1} (<b>${fila.libroSeleccionado.pro_codigo}</b>): stock insuficiente en componentes del combo`);
                    }
                });
            }
            
            // Para venta por lista, validar cupo
            if (this.esVentaPorLista() && this.ventaData.lugarDespacho.nombreInstitucion) {
                if (!this.tieneCupoGeneralSuficiente()) {
                    erroresFaltantes.push('• El <b>total supera el cupo disponible</b>. Cupo: $' + this.obtenerCupoMaximo() + ', Total: $' + this.calcularTotalesUnificados().total.toFixed(2));
                }

                if (!this.tieneSaldoTipoDocumentoSuficiente()) {
                    erroresFaltantes.push('• El <b>total supera el saldo disponible para ' + this.obtenerEtiquetaSaldoDocumentoActual() + '</b>. Disponible: $' + this.obtenerSaldoDisponibleDocumentoActual().toFixed(2) + ', Total: $' + this.calcularTotalesUnificados().total.toFixed(2));
                }
            }
            
            // Si hay errores, mostrarlos
            if (erroresFaltantes.length > 0) {
                this.$vs.notify({
                    title: '⚠️ Datos Incompletos',
                    text: '<div style="text-align: left; padding: 10px;"><p style="margin-bottom: 10px; font-weight: 600;">Para generar la venta, complete lo siguiente:</p>' + erroresFaltantes.join('<br>') + '</div>',
                    color: 'warning',
                    position: 'top-center',
                    time: 8000,
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            // Si todo está OK, proceder a generar
            this.generarVentaPerseo();
        },
        
        generarVentaPerseo() {
            // Consolidar todas las validaciones
            let errores = [];
            
            // 1. Validar campos básicos
            if (!this.ventaData.empresa) {
                errores.push('Debe seleccionar una empresa');
            }
            
            if (!this.ventaData.lugarDespacho.nombreInstitucion) {
                errores.push('Debe seleccionar un lugar de despacho');
            }
            
            if (!this.ventaData.clientePerseo.nombre) {
                errores.push('Debe seleccionar un cliente de Perseo');
            }
            
            // 2. Validar observación
            if (!this.ventaData.observacion || this.ventaData.observacion.trim() === '') {
                errores.push('Debe ingresar una observación');
            } else if (this.ventaData.observacion.length > 200) {
                errores.push('La observación no puede exceder los 200 caracteres');
            }
            
            // 3. Validar concepto Perseo
            if (!this.ventaData.conceptoPerseo || this.ventaData.conceptoPerseo.trim() === '') {
                errores.push('Debe ingresar un concepto para Perseo');
            } else if (this.ventaData.conceptoPerseo.length > 150) {
                errores.push('El concepto Perseo no puede exceder los 150 caracteres');
            }
            
            // 4. Validar que tenga libros con cantidad
            const librosParaVenta = this.obtenerLibrosParaVenta();
            if (librosParaVenta.length === 0) {
                errores.push('Debe especificar al menos un libro con cantidad para la venta');
            }

            // 4.0 Validar que no existan filas con libro seleccionado pero cantidad vacia o en 0
            if (this.filasCaptura && Array.isArray(this.filasCaptura)) {
                const filasInvalidasCantidad = [];
                this.filasCaptura.forEach((fila, index) => {
                    if (!fila || !fila.libroSeleccionado) {
                        return;
                    }

                    const cantidadTexto = fila.cantidad != null ? String(fila.cantidad).trim() : '';
                    const cantidadNumero = cantidadTexto !== '' ? parseInt(cantidadTexto, 10) : 0;

                    if (cantidadTexto === '' || isNaN(cantidadNumero) || cantidadNumero <= 0) {
                        filasInvalidasCantidad.push(index + 1);
                    }
                });

                if (filasInvalidasCantidad.length > 0) {
                    errores.push('Las filas ' + filasInvalidasCantidad.join(', ') + ' tienen cantidad vacia o en 0');
                }
            }

            // Validar combos con stock insuficiente
            if (this.filasCaptura && Array.isArray(this.filasCaptura)) {
                this.filasCaptura.forEach((fila, index) => {
                    if (!fila || !fila.libroSeleccionado) return;
                    if (!this.esLibroComboParaStock(fila.libroSeleccionado)) return;
                    const cantidadTexto = fila.cantidad != null ? String(fila.cantidad).trim() : '';
                    if (cantidadTexto === '' || parseInt(cantidadTexto, 10) <= 0) return;
                    if (fila.libroSeleccionado.puede_vender === null || fila.libroSeleccionado.consultandoStockCombo) {
                        errores.push(`Fila ${index + 1} (${fila.libroSeleccionado.pro_codigo}): esperando verificación de stock del combo`);
                    } else if (fila.libroSeleccionado.puede_vender === false) {
                        errores.push(`Fila ${index + 1} (${fila.libroSeleccionado.pro_codigo}): stock insuficiente en componentes del combo`);
                    }
                });
            }

            // 4.1 Validar que todos los libros tengan precio válido
            librosParaVenta.forEach(libro => {
                try {
                    this.obtenerPrecioLibro(libro);
                } catch (error) {
                    const codigo = libro.pro_codigo ? libro.pro_codigo : 'SIN_CODIGO';
                    errores.push('El libro ' + codigo + ' no tiene precio válido. Verifique precio del pedido/perseo antes de guardar');
                }
            });
            
            // 4.2. Validar errores en cantidad o descuento en las filas
            let primerFilaConError = null;
            this.filasCaptura.forEach((fila, index) => {
                if (fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0) {
                    // Validar que el descuento no esté vacío (es obligatorio)
                    if (!fila.descuento && fila.descuento !== 0 && fila.descuento !== '0') {
                        errores.push(`Fila ${index + 1}: El descuento es obligatorio`);
                        if (!primerFilaConError) {
                            primerFilaConError = { index: index, tipo: 'descuento' };
                        }
                    }
                    
                    if (fila.errorCantidad) {
                        errores.push(`Fila ${index + 1}: ${fila.errorCantidad}`);
                        if (!primerFilaConError) {
                            primerFilaConError = { index: index, tipo: 'cantidad' };
                        }
                    }
                    if (fila.errorDescuento) {
                        errores.push(`Fila ${index + 1}: ${fila.errorDescuento}`);
                        if (!primerFilaConError) {
                            primerFilaConError = { index: index, tipo: 'descuento' };
                        }
                    }
                }
            });
            
            // Si hay errores en filas, hacer focus en el primer campo con error
            if (primerFilaConError) {
                this.$nextTick(() => {
                    const refName = primerFilaConError.tipo === 'cantidad' 
                        ? `cantidad-${primerFilaConError.index}` 
                        : `descuento-${primerFilaConError.index}`;
                    
                    const inputRef = this.$refs[refName];
                    if (inputRef && inputRef.length > 0 && inputRef[0].$el) {
                        const input = inputRef[0].$el.querySelector('input');
                        if (input) {
                            input.focus();
                            input.select();
                        }
                    }
                });
            }
            
            // Si hay errores, mostrarlos y detener
            if (errores.length > 0) {
                const tituloAlerta = errores.length === 1 ? 'Validación de Venta' : 'Hay errores en los datos';
                const mensajeErrores = errores.length === 1 
                    ? errores[0] 
                    : '<div style="text-align: left;"><strong>Por favor corrija los siguientes errores:</strong><ul style="margin: 8px 0; padding-left: 20px;">' + 
                      errores.map(e => '<li>' + e + '</li>').join('') + 
                      '</ul></div>';
                
                this.$vs.notify({
                    title: tituloAlerta,
                    text: mensajeErrores,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    position: 'top-center',
                    fixed: true,
                    time: 6000
                });
                
                return;
            }
            
            // 4.1. Detectar productos con stock insuficiente
            const productosConStockInsuficiente = [];
            librosParaVenta.forEach(libro => {
                const cantidadSolicitada = parseInt(libro.cantidadVenta) || 0;
                const stockDisponible = parseInt(libro.stock) || 0;
                
                if (cantidadSolicitada > stockDisponible) {
                    const cantidadPendiente = cantidadSolicitada - stockDisponible;
                    productosConStockInsuficiente.push({
                        codigo: libro.pro_codigo,
                        nombre: libro.nombre_libro,
                        cantidadSolicitada: cantidadSolicitada,
                        stockDisponible: stockDisponible,
                        cantidadPendiente: cantidadPendiente
                    });
                }
            });
            
            // Si hay productos con stock insuficiente, mostrar advertencia
            if (productosConStockInsuficiente.length > 0) {
                // Preparar datos para el popup
                this.productosStockInsuficiente = productosConStockInsuficiente.map(p => ({
                    pro_codigo: p.codigo,
                    pro_nombre: p.nombre,
                    stock_actual: p.stockDisponible,
                    cantidad_requerida: p.cantidadSolicitada,
                    faltante: p.cantidadPendiente
                }));
                
                // Guardar librosParaVenta temporalmente para continuar después si el usuario acepta
                this.librosParaVentaTemporal = librosParaVenta;
                
                // Mostrar el popup de stock insuficiente
                this.popupStockInsuficiente = true;
                return;
            }
            
            // 5. Validaciones específicas para venta por lista
            if (this.esVentaPorLista()) {
                const lugarDespacho = this.ventaData.lugarDespacho;
                
                if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0 || !lugarDespacho.datosInstitucion[0].ffp_cupo) {
                    errores.push('El lugar de despacho no tiene cupo configurado');
                }
                
                if (!this.tieneCupoGeneralSuficiente()) {
                    const cupoInicial = parseFloat(
                        lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion[0] 
                            ? lugarDespacho.datosInstitucion[0].ffp_cupo 
                            : 0
                    ) || 0;
                    const totalVenta = this.calcularTotalesUnificados().total || 0;
                    errores.push(`El total ($${totalVenta.toFixed(2)}) supera el cupo disponible ($${cupoInicial.toFixed(2)})`);
                }

                if (!this.tieneSaldoTipoDocumentoSuficiente()) {
                    const totalVenta = this.calcularTotalesUnificados().total || 0;
                    const saldoDisponible = this.obtenerSaldoDisponibleDocumentoActual();
                    const etiquetaDocumento = this.obtenerEtiquetaSaldoDocumentoActual();
                    errores.push(`El total ($${totalVenta.toFixed(2)}) supera el saldo disponible para ${etiquetaDocumento} ($${saldoDisponible.toFixed(2)})`);
                }
            }
            
            // Si hay errores, mostrarlos
            if (errores.length > 0) {
                const tituloAlerta = errores.length === 1 ? 'Validación de Venta' : 'Hay errores en los datos';
                const mensajeErrores = errores.length === 1 
                    ? errores[0] 
                    : '<div style="text-align: left;"><strong>Por favor corrija los siguientes errores:</strong><ul style="margin: 8px 0; padding-left: 20px;">' + 
                      errores.map(e => '<li>' + e + '</li>').join('') + 
                      '</ul></div>';
                
                this.$vs.notify({
                    title: tituloAlerta,
                    text: mensajeErrores,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    position: 'top-center',
                    time: 6000
                });
                return;
            }
            
            // Si no hay problemas de stock, procesar directamente
            this.procesarVentaPerseo(librosParaVenta);
        },
        
        procesarVentaPerseo(librosParaVenta) {
            const me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            
            // Preparar detalles de la venta
            const detalles = librosParaVenta.map(libro => ({
                pro_codigo: libro.pro_codigo,
                cantidad: parseInt(libro.cantidadVenta),
                precio: this.obtenerPrecioLibro(libro),
                descuento: parseFloat(libro.descuentoIndividual),
                ven_det_descuento: parseFloat(libro.descuentoIndividual),
                linea_producto_id: libro.linea_producto_id != null ? parseInt(libro.linea_producto_id, 10) : null,
                // Datos de combo para que el backend descuente los componentes correctos
                grupo_codigo_para_v3: libro.grupo_codigo_para_v3 != null ? libro.grupo_codigo_para_v3 : null,
                codigos_combos: libro.codigos_combos != null ? libro.codigos_combos : null,
                codigos_combos_regalado: libro.codigos_combos_regalado != null ? libro.codigos_combos_regalado : null
            }));
            
            // Obtener ID de empresa
            const empresaId = typeof me.ventaData.empresa === 'object' 
                ? me.ventaData.empresa.id 
                : parseInt(me.ventaData.empresa);

            // Preparar payload
            const payload = {
                empresa: empresaId,
                tipo_documento: parseInt(me.ventaData.tipoDocumento),
                descuento: null,
                observacion: me.ventaData.observacion.trim(),
                concepto_perseo: me.ventaData.conceptoPerseo.trim(),
                lugar_despacho_id: parseInt(me.ventaData.lugarDespacho.id_institucion),
                cliente_perseo_id: parseInt(me.ventaData.clientePerseo.idusuario),
                clientesidPerseo: parseInt(me.ventaData.clientePerseo.clientesidPerseo),
                ruc_cliente: me.ventaData.clientePerseo.cedula,
                contrato: me.pedidoSeleccionado ? me.pedidoSeleccionado.contrato_generado : null,
                ven_totalizado: me.totalizado && me.totalizado.ca_codigo_agrupado ? me.totalizado.ca_codigo_agrupado : null,
                tipo_venta: me.esVentaPorLista() ? 'L' : 'V', // L = Lista, V = Directa
                periodo_id: parseInt(me.idPeriodo),
                idusuario: parseInt(usuarioObjeto.idusuario),
                detalles: detalles
            };
            
            // Enviar al backend
            me.$vs.loading({
                text: 'Generando transacción...'
            });
            
            this.$http.post(this.$server_url + "api/perseo/ventas/crear", payload)
                .then((res) => {
                    me.$vs.loading.close();
                    
                    if (res.status === 200 && res.data.status === 200) {
                        me.$vs.notify({
                            title: '✅ Venta Creada',
                            text: res.data.message || 'Venta generada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 4000
                        });
                        
                        //Emitir evento para cerrar modal y actualizar lista
                        me.$emit('generar-venta', res.data);
                        me.$emit('cerrar');
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Error al generar la venta',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    
                    let mensajeError = "No se pudo guardar la venta. Por favor intente nuevamente";
                    
                    if (error.response) {
                        if (error.response.data && error.response.data.message) {
                            mensajeError = error.response.data.message;
                        }
                        
                        // Mostrar errores de validación si existen
                        if (error.response.data && error.response.data.errors) {
                            const erroresValidacion = Object.values(error.response.data.errors).flat();
                            mensajeError = '<div style="text-align: left;"><strong>Errores de validación:</strong><ul style="margin: 8px 0; padding-left: 20px;">' + 
                                erroresValidacion.map(e => '<li>' + e + '</li>').join('') + 
                                '</ul></div>';
                        }
                    }
                    
                    me.$vs.notify({
                        title: '❌ Error al Crear Venta',
                        text: mensajeError,
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                        time: 6000
                    });
                });
        },
        
        // Método auxiliar para obtener fecha actual en formato MySQL
        obtenerFechaActual() {
            const date = new Date();
            const formatear =
                date.getFullYear() +
                "-" +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + date.getDate()).slice(-2) +
                " " +
                ("0" + date.getHours()).slice(-2) +
                ":" +
                ("0" + date.getMinutes()).slice(-2) +
                ":" +
                ("0" + date.getSeconds()).slice(-2);
            return formatear;
        },
        
        // Métodos para consulta de stock
        
        // Método centralizado para consultar stock
        async consultarStockPerseo(codigos, idEmpresa) {
            try {
                // codigos puede ser un string, un array de strings o un array de objetos con metadata de combo
                const codigosArray = Array.isArray(codigos) ? codigos : [codigos];
                const empresaId = typeof idEmpresa === 'object' && idEmpresa !== null
                    ? parseInt(idEmpresa.id != null ? idEmpresa.id : idEmpresa.id_empresa, 10)
                    : parseInt(idEmpresa, 10);

                // Determinar endpoint según tipo de documento:
                // PRE-FACTURA (tdo_id=1) → valida stock en plataforma Y en Perseo, usa el mínimo
                // Resto → solo plataforma (comportamiento anterior)
                const esPrefactura = parseInt(this.ventaData.tipoDocumento, 10) === 1;
                const endpointStock = esPrefactura
                    ? `${this.$server_url}api/perseo/ventas-lista/stock-producto-con-perseo`
                    : `${this.$server_url}api/perseo/ventas-lista/stock-producto`;

                const productosIndexados = {};

                for (let i = 0; i < codigosArray.length; i++) {
                    const itemConsulta = codigosArray[i];
                    const esObjeto = typeof itemConsulta === 'object' && itemConsulta !== null;
                    const codigoActual = esObjeto ? itemConsulta.pro_codigo : itemConsulta;
                    const cantidadSolicitada = esObjeto && itemConsulta.cantidad != null
                        ? parseInt(itemConsulta.cantidad, 10) || 0
                        : 0;
                    const parametros = {
                        pro_codigo: codigoActual,
                        empresa_id: empresaId,
                        cantidad: cantidadSolicitada
                    };

                    if (esObjeto) {
                        if (itemConsulta.codigos_combos != null) {
                            parametros.codigos_combos = itemConsulta.codigos_combos;
                        }
                        if (itemConsulta.grupo_codigo_para_v3 != null) {
                            parametros.grupo_codigo_para_v3 = itemConsulta.grupo_codigo_para_v3;
                        }
                        if (itemConsulta.es_combo != null) {
                            parametros.es_combo = itemConsulta.es_combo;
                        }
                        if (itemConsulta.tipo_producto != null) {
                            parametros.tipo_producto = itemConsulta.tipo_producto;
                        }
                    }

                    const response = await this.$http.get(endpointStock, { params: parametros });

                    if (!response.data || response.data.status !== 'success' || !response.data.data) {
                        throw new Error('La respuesta del servidor no contiene datos de stock válidos');
                    }

                    const producto = response.data.data;
                    const codigo = producto.pro_codigo;
                    if (codigo) {
                        // existenciastotales = mínimo(plataforma, Perseo) cuando es prefactura,
                        // o stock plataforma cuando no lo es
                        const stockUnico = parseInt(
                            producto.existenciastotales != null
                                ? producto.existenciastotales
                                : (producto.stock_unico != null ? producto.stock_unico : producto.pro_stockCalmed || 0),
                            10
                        );
                        productosIndexados[codigo] = {
                            ...producto,
                            existenciastotales: stockUnico,
                            stock_unico: stockUnico,
                            // Guardar desglose solo cuando es prefactura
                            stock_plataforma: producto.stock_plataforma != null ? parseInt(producto.stock_plataforma, 10) : stockUnico,
                            stock_perseo: producto.stock_perseo != null ? parseInt(producto.stock_perseo, 10) : null,
                            descripcion: producto.pro_nombre,
                            mensaje_stock_combo: producto.mensaje_stock_combo || null,
                            detalle_faltantes_combo: Array.isArray(producto.detalle_faltantes_combo) ? producto.detalle_faltantes_combo : [],
                            stock_combo_componentes: Array.isArray(producto.stock_combo_componentes) ? producto.stock_combo_componentes : [],
                            es_combo: !!producto.es_combo,
                            fuente_stock: producto.fuente_stock || 'pro_stockCalmed'
                        };
                    }
                }

                return productosIndexados;
            } catch (error) {
                console.error('Error al consultar stock:', error);
                throw error;
            }
        },        

        esLibroComboParaStock(libro) {
            if (!libro) {
                return false;
            }
            const grupo = libro.grupo_codigo_para_v3 != null ? parseInt(libro.grupo_codigo_para_v3, 10) : 0;
            return grupo === 8;
        },

        construirConsultaStockPerseo(libro, cantidad) {
            if (!libro || !libro.pro_codigo) {
                return libro;
            }

            const consulta = {
                pro_codigo: libro.pro_codigo,
                cantidad: cantidad != null
                    ? cantidad
                    : (libro.cantidad != null ? libro.cantidad : (libro.cantidadVenta != null ? libro.cantidadVenta : 0))
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
            if (!libroDestino || !stockInfo) {
                return;
            }

            const stockDisponible = parseInt(
                stockInfo.existenciastotales != null
                    ? stockInfo.existenciastotales
                    : (stockInfo.stock_unico != null ? stockInfo.stock_unico : stockInfo.pro_stockCalmed || 0),
                10
            );

            this.$set(libroDestino, 'stock', stockDisponible);
            this.$set(libroDestino, 'stock_perseo_actual', stockDisponible);
            // Guardar desglose plataforma / Perseo para mostrarlo en la columna
            if (stockInfo.stock_plataforma != null) {
                this.$set(libroDestino, 'stock_plataforma', parseInt(stockInfo.stock_plataforma, 10));
            }
            if (stockInfo.stock_perseo != null) {
                this.$set(libroDestino, 'stock_perseo', parseInt(stockInfo.stock_perseo, 10));
            }
            const nombreProducto = stockInfo.descripcion
                ? stockInfo.descripcion
                : (stockInfo.pro_nombre
                    ? stockInfo.pro_nombre
                    : (libroDestino.pro_nombre
                        ? libroDestino.pro_nombre
                        : (libroDestino.nombre_libro ? libroDestino.nombre_libro : '')));
            this.$set(libroDestino, 'pro_nombre', nombreProducto);
            this.$set(libroDestino, 'es_combo', !!stockInfo.es_combo);
            this.$set(libroDestino, 'mensaje_stock_combo', stockInfo.mensaje_stock_combo || null);
            this.$set(libroDestino, 'detalle_faltantes_combo', Array.isArray(stockInfo.detalle_faltantes_combo) ? stockInfo.detalle_faltantes_combo : []);
            this.$set(libroDestino, 'stock_combo_componentes', Array.isArray(stockInfo.stock_combo_componentes) ? stockInfo.stock_combo_componentes : []);
            this.$set(libroDestino, 'fuente_stock', stockInfo.fuente_stock || 'pro_stockCalmed');
        },

        reconsultarStockComboFila(fila) {
            if (!fila || !fila.libroSeleccionado || !this.esLibroComboParaStock(fila.libroSeleccionado)) {
                return;
            }

            if (!fila.cantidad || parseInt(fila.cantidad, 10) <= 0) {
                return;
            }

            const empresaId = this.obtenerIdEmpresaPerseo();
            if (!empresaId) {
                return;
            }

            const consultaStock = this.construirConsultaStockPerseo(fila.libroSeleccionado, fila.cantidad || 0);
            const codigo = consultaStock.pro_codigo;

            this.consultarStockPerseo([consultaStock], empresaId)
                .then(stockData => {
                    if (stockData && stockData[codigo]) {
                        this.aplicarStockRespuestaPerseo(fila.libroSeleccionado, stockData[codigo]);
                    }
                })
                .catch(error => {
                    console.error('Error al reconsultar stock combo:', error);
                });
        },

        obtenerIdEmpresaPerseo() {
            const empresa = this.ventaData && this.ventaData.empresa != null
                ? this.ventaData.empresa
                : this.ventaData.id_empresa;

            if (empresa && typeof empresa === 'object') {
                return parseInt(empresa.id != null ? empresa.id : empresa.id_empresa, 10);
            }

            return parseInt(empresa, 10);
        },
        
        obtenerColorStock(libro) {
            if (libro.stock === undefined) return 'dark';
            if (libro.stock === 0) return 'danger';
            
            // Obtener la cantidad solicitada (puede ser cantidadVenta o cantidad)
            const cantidadSolicitada = parseInt(libro.cantidadVenta || libro.cantidad || 0);
            // const stockRestante = libro.stock - cantidadSolicitada;
            
            // Si no hay suficiente stock para la solicitud
            if (libro.stock < cantidadSolicitada) return 'danger';
            
           
            return 'success';
        },
        
        obtenerColorEstado(libro) {
            // Usar la misma lógica que obtenerColorStock para consistencia
            return this.obtenerColorStock(libro);
        },

        obtenerPrecioLibro(libro) {
            if (!libro) {
                throw new Error('No existe información del libro para obtener precio');
            }

            if (libro.precio !== undefined && libro.precio !== null && libro.precio !== '') {
                const precioDirecto = parseFloat(libro.precio);
                if (!isNaN(precioDirecto) && precioDirecto > 0) {
                    return precioDirecto;
                }
            }

            const codigo = libro.pro_codigo ? libro.pro_codigo : 'SIN_CODIGO';
            throw new Error('El libro ' + codigo + ' no tiene precio válido del pedido');
        },

        obtenerPrecioLibroParaCalculo(libro) {
            try {
                return this.obtenerPrecioLibro(libro);
            } catch (error) {
                return null;
            }
        },
        
        
        // ========================================
        // MÉTODOS PARA GESTIÓN SIMPLIFICADA DE LIBROS
        // ========================================
        
        contarLibrosConCantidad() {
            // Contar libros desde las filas de captura
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return 0;
            }
            return this.filasCaptura.filter(fila => 
                fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0
            ).length;
        },
        
        tieneLibrosConCantidad() {
            return this.contarLibrosConCantidad() > 0;
        },
        
        obtenerLibrosParaVenta() {
            // Validación defensiva
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return [];
            }
            
            // Obtener libros desde las filas de captura rápida
            return this.filasCaptura
                .filter(fila => fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0)
                .map(fila => ({
                    ...fila.libroSeleccionado,
                    cantidadVenta: parseInt(fila.cantidad),
                    descuentoIndividual: parseFloat(fila.descuento || 0)
                }));
        },

        obtenerDescuentoInicialFila(libro) {
            if (!libro) {
                return '0';
            }
            return this.obtenerDescuentoPorLinea(libro).toString();
        },
        
        // ========================================
        // MÉTODOS PARA CAPTURA SÚPER RÁPIDA
        // ========================================
        
        agregarFilaCaptura() {
            // Verificar si ya todos los libros están seleccionados
            const librosDisponibles = this.librosDisponiblesParaFila(-1);
            if (librosDisponibles.length === 0) {
                this.$f_notificacion(
                    'Todos los libros disponibles ya están agregados', 
                    'warning', 
                    'AlertTriangleIcon', 
                    2000
                );
                return;
            }
            
            // Verificar si ya existe una fila vacía al final
            const ultimaFila = this.filasCaptura[this.filasCaptura.length - 1];
            const yaExisteFilaVacia = ultimaFila && 
                                    !ultimaFila.libroSeleccionado && 
                                    (!ultimaFila.cantidad || ultimaFila.cantidad === '') &&
                                    (!ultimaFila.textoBusqueda || ultimaFila.textoBusqueda === '');
            
            // Solo agregar si no existe una fila vacía al final
            if (yaExisteFilaVacia) {
                return;
            }
            
            this.filasCaptura.push({
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                descuento: '0',
                descuentoModificado: false,
                confirmado: false,
                resultadosBusqueda: [],
                sugerenciaActual: null,
                errorCantidad: '',
                errorDescuento: '',
                consultandoStock: false,
                stockError: false
            });
        },
        
        // Validación con debounce para no bloquear la escritura
        validarYSincronizarCantidad(fila, index) {
            fila.errorCantidad = '';

            const cantidadLimpia = fila.cantidad !== null && fila.cantidad !== undefined
                ? fila.cantidad.toString().replace(/\D/g, '')
                : '';

            if (fila.cantidad !== cantidadLimpia) {
                fila.cantidad = cantidadLimpia;
            }

            const timerKey = 'fila_' + index;
            if (this.cantidadDebounceTimers[timerKey]) {
                clearTimeout(this.cantidadDebounceTimers[timerKey]);
                delete this.cantidadDebounceTimers[timerKey];
            }

            this.sincronizarCantidadEnTabla(fila);

            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                // Si borraron la cantidad en un combo, resetear el estado de stock
                if (fila.libroSeleccionado && this.esLibroComboParaStock(fila.libroSeleccionado)) {
                    this.$set(fila.libroSeleccionado, 'stock', null);
                    this.$set(fila.libroSeleccionado, 'puede_vender', null);
                    this.$set(fila.libroSeleccionado, 'detalle_faltantes_combo', []);
                }
                return;
            }

            this.cantidadDebounceTimers[timerKey] = setTimeout(() => {
                // Para combos: consultar stock con la cantidad ingresada
                if (fila.libroSeleccionado && this.esLibroComboParaStock(fila.libroSeleccionado)) {
                    this.consultarStockComboConCantidad(fila, index);
                } else {
                    this.validarCantidadConReglas(fila, index);
                    this.reconsultarStockComboFila(fila);
                }
            }, 450);

            // Para combos: marcar inmediatamente como "pendiente de verificación"
            // para que el ❌ anterior no confunda mientras llega la nueva respuesta
            if (fila.libroSeleccionado && this.esLibroComboParaStock(fila.libroSeleccionado)) {
                this.$set(fila.libroSeleccionado, 'puede_vender', null);
                fila.errorCantidad = '';
            }
        },

        // Consulta stock de combo con la cantidad ingresada y actualiza el estado de la fila
        consultarStockComboConCantidad(fila, index) {
            const me = this;
            const cantidad = parseInt(fila.cantidad, 10);
            if (!fila.libroSeleccionado || isNaN(cantidad) || cantidad <= 0) return;

            // Validar primero contra pedido-vendido antes de ir al servidor
            const cantidadPedida = parseInt(fila.libroSeleccionado.cantidad, 10) || 0;
            const cantidadVendida = parseInt(fila.libroSeleccionado.cantidadVendida, 10) || 0;
            const cantidadDisponible = Math.max(0, cantidadPedida - cantidadVendida);

            if (cantidadPedida > 0 && cantidadDisponible <= 0) {
                fila.errorCantidad = `⚠️ Producto completamente vendido (Pedido: ${cantidadPedida}, Vendido: ${cantidadVendida})`;
                fila.cantidad = '0';
                this.sincronizarCantidadEnTabla(fila);
                return;
            }
            if (cantidadPedida > 0 && cantidad > cantidadDisponible) {
                fila.errorCantidad = `⚠️ Máximo permitido: ${cantidadDisponible} (Pedido: ${cantidadPedida}, Vendido: ${cantidadVendida})`;
                fila.cantidad = cantidadDisponible.toString();
                this.sincronizarCantidadEnTabla(fila);
                return;
            }

            // Marcar que está consultando (sin bloquear el input)
            this.$set(fila.libroSeleccionado, 'consultandoStockCombo', true);
            this.$set(fila.libroSeleccionado, 'puede_vender', null);

            const consultaStock = me.construirConsultaStockPerseo(fila.libroSeleccionado, cantidad);

            me.consultarStockPerseo([consultaStock], me.ventaData.empresa)
            .then(stockData => {
                if (!fila.libroSeleccionado) return;
                this.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);

                const codigo = fila.libroSeleccionado.pro_codigo;
                if (stockData && stockData[codigo]) {
                    const stockInfo = stockData[codigo];
                    me.aplicarStockRespuestaPerseo(fila.libroSeleccionado, stockInfo);
                    // puede_vender viene del backend
                    const puedeVender = stockInfo.puede_vender !== undefined ? stockInfo.puede_vender : (stockInfo.existenciastotales >= cantidad);
                    this.$set(fila.libroSeleccionado, 'puede_vender', puedeVender);

                    if (!puedeVender) {
                        // Priorizar mensaje_stock_combo del backend que ya tiene el detalle completo
                        // Fallback a detalle_faltantes_combo si mensaje no está disponible
                        const msgError = stockInfo.mensaje_stock_combo
                            ? stockInfo.mensaje_stock_combo
                            : ((stockInfo.detalle_faltantes_combo || []).length > 0
                                ? 'Faltan: ' + stockInfo.detalle_faltantes_combo.join(', ')
                                : 'Stock insuficiente en componentes del combo');
                        fila.errorCantidad = `⚠️ ${msgError}`;
                    } else {
                        fila.errorCantidad = '';
                    }
                } else {
                    this.$set(fila.libroSeleccionado, 'puede_vender', false);
                    fila.errorCantidad = '⚠️ No se pudo verificar el stock del combo';
                }
                me.sincronizarCantidadEnTabla(fila);
            })
            .catch(() => {
                if (!fila.libroSeleccionado) return;
                this.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);
                this.$set(fila.libroSeleccionado, 'puede_vender', false);
                fila.errorCantidad = '⚠️ Error al verificar stock del combo. Reintenta.';
                me.sincronizarCantidadEnTabla(fila);
            });
        },

        // Regla final: no superar pedido-vendido. Stock solo advertencia.
        validarCantidadConReglas(fila, index) {
            const indiceActual = this.filasCaptura.findIndex(item => item === fila);
            if (indiceActual === -1) {
                return;
            }

            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                fila.errorCantidad = '';
                this.sincronizarCantidadEnTabla(fila);
                return;
            }

            const cantidad = parseInt(fila.cantidad, 10);
            if (isNaN(cantidad) || cantidad <= 0) {
                fila.errorCantidad = 'La cantidad debe ser mayor a 0';
                this.sincronizarCantidadEnTabla(fila);
                return;
            }

            if (!fila.libroSeleccionado) {
                fila.errorCantidad = '';
                this.sincronizarCantidadEnTabla(fila);
                return;
            }

            const cantidadPedida = parseInt(fila.libroSeleccionado.cantidad, 10) || 0;
            const cantidadVendida = parseInt(fila.libroSeleccionado.cantidadVendida, 10) || 0;
            const cantidadDisponible = Math.max(0, cantidadPedida - cantidadVendida);

            if (cantidadDisponible <= 0) {
                fila.errorCantidad = `⚠️ Producto completamente vendido (Pedido: ${cantidadPedida}, Vendido: ${cantidadVendida})`;
                fila.cantidad = '0';
                this.sincronizarCantidadEnTabla(fila);
                return;
            }

            if (cantidad > cantidadDisponible) {
                fila.errorCantidad = `⚠️ Máximo permitido: ${cantidadDisponible} (Pedido: ${cantidadPedida}, Vendido: ${cantidadVendida})`;
                fila.cantidad = cantidadDisponible.toString();
                this.sincronizarCantidadEnTabla(fila);
                return;
            }

            const stockDisponible = parseInt(fila.libroSeleccionado.stock, 10) || 0;
            if (stockDisponible > 0 && cantidad > stockDisponible) {
                const mensajeCombo = fila.libroSeleccionado.mensaje_stock_combo != null ? fila.libroSeleccionado.mensaje_stock_combo : '';
                if (mensajeCombo !== '') {
                    fila.errorCantidad = mensajeCombo;
                } else if (this.esDocumentoPrefactura()) {
                    // Cuando es prefactura, mostrar desglose plataforma vs Perseo
                    const stockPlat = fila.libroSeleccionado.stock_plataforma != null
                        ? parseInt(fila.libroSeleccionado.stock_plataforma, 10)
                        : stockDisponible;
                    const stockPerseo = fila.libroSeleccionado.stock_perseo != null
                        ? parseInt(fila.libroSeleccionado.stock_perseo, 10)
                        : null;
                    if (stockPerseo !== null && stockPerseo < cantidad) {
                        fila.errorCantidad = `⚠️ Stock Perseo insuficiente: ${stockPerseo} disponibles (plataforma: ${stockPlat}). Máximo: ${stockDisponible}.`;
                    } else {
                        fila.errorCantidad = `⚠️ Stock plataforma insuficiente: ${stockPlat} disponibles. Máximo: ${stockDisponible}.`;
                    }
                } else {
                    fila.errorCantidad = `⚠️ Stock actual: ${stockDisponible}. Puedes continuar con advertencia.`;
                }
            } else {
                fila.errorCantidad = '';
            }

            this.sincronizarCantidadEnTabla(fila);
        },
        
        // Nuevo método para validación final al perder el foco
        validarCantidadFinal(fila, index) {
            const timerKey = 'fila_' + index;
            if (this.cantidadDebounceTimers[timerKey]) {
                clearTimeout(this.cantidadDebounceTimers[timerKey]);
                delete this.cantidadDebounceTimers[timerKey];
            }

            this.validarCantidadConReglas(fila, index);

            if (fila.cantidad && parseInt(fila.cantidad) <= 0) {
                fila.cantidad = '';
                fila.errorCantidad = '';
                this.sincronizarCantidadEnTabla(fila);
            }

            this.$nextTick(() => {
                this.eliminarFilaPorCantidadVacia(fila, index, 'blur');
            });
        },
        
        // Validar descuento individual con decimales
        validarDescuentoConLimite(fila) {
            fila.errorDescuento = '';
            fila.descuentoModificado = true;

            if (!fila.descuento || fila.descuento.toString().trim() === '') {
                this.calcularTotalesVentas();
                return;
            }

            // Permitir solo números y punto decimal
            let descuentoStr = fila.descuento.toString().replace(/[^0-9.]/g, '');
            
            // Permitir solo un punto decimal
            const partes = descuentoStr.split('.');
            if (partes.length > 2) {
                descuentoStr = partes[0] + '.' + partes.slice(1).join('');
            }
            
            // Limitar a máximo 2 decimales - CORTAR INMEDIATAMENTE
            if (partes.length === 2 && partes[1].length > 2) {
                descuentoStr = partes[0] + '.' + partes[1].substring(0, 2);
            }
            
            // Actualizar el valor si fue modificado
            if (fila.descuento !== descuentoStr) {
                fila.descuento = descuentoStr;
                return; // Salir para evitar procesar más
            }
            
            // Validar el valor numérico
            const descuento = parseFloat(descuentoStr);
            
            if (isNaN(descuento)) {
                fila.errorDescuento = 'Descuento inválido';
                return;
            }
            
            if (descuento < 0) {
                fila.errorDescuento = 'Descuento no puede ser negativo';
                fila.descuento = '';
                return;
            }
            
            if (descuento > 100) {
                fila.errorDescuento = 'Descuento máximo 100%';
                fila.descuento = '100';
                return;
            }
            
            this.calcularTotalesVentas();
        },

        validarDescuento(fila) {
            // Mantener por compatibilidad, ahora llama a validarDescuentoConLimite
            this.validarDescuentoConLimite(fila);
        },

        normalizarDescuentoFila(fila) {
            fila.errorDescuento = '';

            if (!fila.descuento || fila.descuento.toString().trim() === '') {
                fila.descuento = '';
                this.calcularTotalesVentas();
                return;
            }

            let descuento = parseFloat(fila.descuento);
            if (isNaN(descuento) || descuento < 0) {
                descuento = 0;
            }
            if (descuento > 100) {
                descuento = 100;
                fila.errorDescuento = 'Descuento máximo 100%';
            }

            // Redondear a 2 decimales
            descuento = Math.round(descuento * 100) / 100;
            fila.descuento = descuento.toString();
            this.calcularTotalesVentas();
        },

        eliminarFilaPorCantidadVacia(fila, index, origen) {
            // Evitar eliminar una fila incorrecta cuando llega un evento tardío (blur/keydown)
            // usando un índice obsoleto. Solo continuar si la referencia de fila sigue viva.
            const indiceReal = this.filasCaptura.findIndex(item => item === fila);
            if (indiceReal === -1) {
                return;
            }

            const cantidadVacia = !fila.cantidad || fila.cantidad.toString().trim() === '';
            if (!cantidadVacia) {
                return;
            }

            const tieneLibro = fila.libroSeleccionado !== null;
            const tieneBusqueda = fila.textoBusqueda && fila.textoBusqueda.trim() !== '';
            if (!tieneLibro && !tieneBusqueda) {
                return;
            }

            if (this.filasCaptura.length <= 1) {
                fila.libroSeleccionado = null;
                fila.textoBusqueda = '';
                fila.cantidad = '';
                fila.confirmado = false;
                fila.errorCantidad = '';
                fila.consultandoStock = false;
                fila.stockError = false;
                this.enfocarSelect(0);
                this.calcularTotalesVentas();
                return;
            }

            this.filasCaptura.splice(indiceReal, 1);

            if (origen === 'keydown') {
                this.bloqueoBorradoHasta = Date.now() + 250;
            }

            this.$nextTick(() => {
                setTimeout(() => {
                    const filaActual = this.filasCaptura[indiceReal];
                    const indiceObjetivo = filaActual ? indiceReal : this.filasCaptura.length - 1;
                    const filaObjetivo = this.filasCaptura[indiceObjetivo];

                    if (filaObjetivo) {
                        if (origen === 'keydown') {
                            this.enfocarSelect(indiceObjetivo);
                        } else if (filaObjetivo.libroSeleccionado) {
                            this.enfocarSiguienteInput(indiceObjetivo, 'cantidad');
                        } else {
                            this.enfocarSelect(indiceObjetivo);
                        }
                    }
                }, 80);
            });

            this.calcularTotalesVentas();
        },
        
        // Nuevo método para eliminar filas vacías (excepto la primera)
        verificarYEliminarFilasVacias() {
            // Validación defensiva
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return;
            }
            
            // Solo verificar si hay más de una fila
            if (this.filasCaptura.length <= 1) return;
            
            // Filtrar filas que deben mantenerse:
            // - La primera fila siempre se mantiene
            // - Filas que tienen búsqueda, cantidad o libro seleccionado
            this.filasCaptura = this.filasCaptura.filter((fila, index) => {
                // Siempre mantener la primera fila
                if (index === 0) return true;
                
                // Mantener filas que tienen contenido
                const tieneBusqueda = fila.textoBusqueda && fila.textoBusqueda.trim() !== '';
                const tieneCantidad = fila.cantidad && fila.cantidad.toString().trim() !== '' && parseInt(fila.cantidad) > 0;
                const tieneLibroSeleccionado = fila.libroSeleccionado !== null;
                
                // Mantener la fila si tiene al menos uno de estos elementos
                return tieneBusqueda || tieneCantidad || tieneLibroSeleccionado;
            });
            
            // Asegurar que siempre haya al menos una fila
            if (this.filasCaptura.length === 0) {
                this.filasCaptura.push(this.crearFilaVacia());
            }
        },
        
        buscarEnFila(fila, index) {
            const texto = fila.textoBusqueda.toLowerCase().trim();
            
            // Si el texto está vacío o es muy corto, limpiar resultados
            if (texto.length < 2) {
                this.$set(fila, 'resultadosBusqueda', []);
                this.$set(fila, 'sugerenciaActual', null);
                return;
            }
            
            // Si hay un libro seleccionado y el texto coincide exactamente, no buscar
            if (fila.libroSeleccionado && 
                fila.libroSeleccionado.nombre_libro.toLowerCase() === texto) {
                this.$set(fila, 'resultadosBusqueda', []);
                this.$set(fila, 'sugerenciaActual', null);
                return;
            }
            
            // Si se está editando un libro ya seleccionado, limpiar la selección
            if (fila.libroSeleccionado && 
                fila.libroSeleccionado.nombre_libro.toLowerCase() !== texto) {
                this.$set(fila, 'libroSeleccionado', null);
                this.$set(fila, 'cantidad', '');
                this.$set(fila, 'confirmado', false);
            }
            
            // Obtener códigos de libros ya seleccionados en otras filas
            const codigosSeleccionados = this.filasCaptura
                .filter((f, i) => i !== index && f.libroSeleccionado)
                .map(f => f.libroSeleccionado.pro_codigo);
            
            // Separar palabras para búsqueda inteligente
            const palabrasBusqueda = texto.split(/\s+/).filter(p => p.length > 0);
            
            // Buscar en la lista de libros del pedido, excluyendo duplicados
            fila.resultadosBusqueda = (this.librosDisponiblesParaFila(index) || []).filter(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                const noEsDuplicado = !codigosSeleccionados.includes(libro.pro_codigo);
                
                // Verificar si coincide por código
                const coincideCodigo = codigo.includes(texto);
                
                // Verificar si todas las palabras están en el nombre
                const todasLasPalabrasEnNombre = palabrasBusqueda.every(palabra => 
                    nombreCompleto.includes(palabra)
                );
                
                return (todasLasPalabrasEnNombre || coincideCodigo) && noEsDuplicado;
            })
            .map(libro => {
                // Calcular puntuación de relevancia para el ordenamiento
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                let puntuacion = 0;
                
                // Puntuación por código exacto
                if (codigo === texto) puntuacion += 1000;
                else if (codigo.startsWith(texto)) puntuacion += 500;
                else if (codigo.includes(texto)) puntuacion += 100;
                
                // Puntuación por coincidencia de múltiples palabras
                if (palabrasBusqueda.length > 1) {
                    let palabrasCoincidentes = 0;
                    let puntuacionPalabras = 0;
                    
                    palabrasBusqueda.forEach(palabra => {
                        if (nombreCompleto.includes(palabra)) {
                            palabrasCoincidentes++;
                            // Más puntos si la palabra está al inicio
                            if (nombreCompleto.indexOf(palabra) < nombreCompleto.length / 3) {
                                puntuacionPalabras += 50;
                            } else {
                                puntuacionPalabras += 20;
                            }
                        }
                    });
                    
                    // Bonificación por tener todas las palabras
                    if (palabrasCoincidentes === palabrasBusqueda.length) {
                        puntuacionPalabras += 200;
                    }
                    
                    puntuacion += puntuacionPalabras;
                } else {
                    // Búsqueda de una sola palabra
                    if (nombreCompleto.startsWith(texto)) puntuacion += 300;
                    else if (nombreCompleto.includes(texto)) puntuacion += 150;
                }
                
                return { ...libro, puntuacion };
            })
            .sort((a, b) => b.puntuacion - a.puntuacion) // Ordenar por puntuación descendente
            .slice(0, 5); // Máximo 5 resultados
            
            // Si hay coincidencia exacta de código, seleccionar automáticamente
            const coincidenciaExacta = fila.resultadosBusqueda.find(libro => 
                libro.pro_codigo.toLowerCase() === texto
            );
            
            if (coincidenciaExacta) {
                // Seleccionar automáticamente si es coincidencia exacta de código
                this.seleccionarLibroEnFila(fila, coincidenciaExacta, index);
                return;
            }
            
            // Establecer la primera sugerencia
            if (fila.resultadosBusqueda.length > 0) {
                this.$set(fila, 'sugerenciaActual', fila.resultadosBusqueda[0]);
            } else {
                this.$set(fila, 'sugerenciaActual', null);
            }
        },
        
        mostrarDropdown(fila) {
            return fila.resultadosBusqueda && 
                   fila.resultadosBusqueda.length > 0 && 
                   !fila.libroSeleccionado &&
                   fila.textoBusqueda.trim().length >= 2;
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
        
        async aceptarYConsultarStock(fila, index) {
            // Primero aceptar la sugerencia
            if (fila.sugerenciaActual && !fila.libroSeleccionado) {
                this.seleccionarLibroEnFila(fila, fila.sugerenciaActual, index);
                
                // Luego consultar stock del sistema
                await this.consultarStockIndividual(fila, index);
            }
        },
        
        async consultarStockIndividual(fila, index) {
            if (!fila.libroSeleccionado) {
                return;
            }
            
            const me = this;
            
            // Validar que haya empresa seleccionada
            if (!me.ventaData.empresa) {
                me.$vs.notify({
                    title: '⚠️ Empresa requerida',
                    text: 'Debe seleccionar una empresa antes de consultar el stock',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            // Marcar como consultando
            me.$set(fila, 'consultandoStock', true);
            me.$set(fila, 'stockError', false);
            me.$set(fila, 'errorCantidad', '');
            
            try {
                const codigoProducto = fila.libroSeleccionado.pro_codigo;
                const stockData = await me.consultarStockPerseo(
                    [me.construirConsultaStockPerseo(fila.libroSeleccionado, fila.cantidad || 0)],
                    me.ventaData.empresa
                );
                
                if (stockData && stockData[codigoProducto]) {
                    const stockInfo = stockData[codigoProducto];
                    
                    // Validar que exista existenciastotales
                    if (stockInfo.existenciastotales === undefined || stockInfo.existenciastotales === null) {
                        throw new Error('La respuesta no contiene el campo existenciastotales');
                    }
                    
                    const stockDisponible = parseInt(stockInfo.existenciastotales);
                    
                    // Actualizar stock en la fila
                    me.aplicarStockRespuestaPerseo(fila.libroSeleccionado, stockInfo);
                    me.$set(fila, 'stockError', false);
                    me.$set(fila, 'errorCantidad', '');

                    if (fila.cantidad && fila.cantidad.toString().trim() !== '') {
                        me.validarYSincronizarCantidad(fila, index);
                    }
                    me.$vs.notify({
                        text: `Stock disponible: ${stockDisponible} unidades`,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    // ✅ AUTO-ENFOCAR el input de cantidad después de consultar stock exitosamente
                    me.$nextTick(() => {
                        setTimeout(() => {
                            const inputCantidad = me.$refs[`cantidad-${index}`];
                            
                            // En v-for, $refs devuelve un array
                            const inputComponent = Array.isArray(inputCantidad) ? inputCantidad[0] : inputCantidad;
                            
                            if (inputComponent && inputComponent.$el) {
                                const input = inputComponent.$el.querySelector('input');
                                if (input) {
                                    input.focus();
                                    input.select();
                                }
                            }
                        }, 100);
                    });
                } else {
                    throw new Error('No se encontró stock para este libro');
                }
            } catch (error) {
                console.error('Error al consultar stock individual:', error);
                me.$set(fila, 'stockError', true);
                
                me.$vs.notify({
                    title: '❌ Error al consultar stock',
                    text: error.message || 'La respuesta del servidor no contiene la estructura esperada. Haz clic en el botón de reintentar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle'
                });
            } finally {
                me.$set(fila, 'consultandoStock', false);
            }
        },
        
        async reintentarConsultaStock(fila, index) {
            await this.consultarStockIndividual(fila, index);
        },
        
        soloNumeros(event) {
            const char = String.fromCharCode(event.keyCode || event.which);
            if (!/^[0-9]$/.test(char)) {
                event.preventDefault();
            }
        },

        soloNumerosConDecimales(event, valorActual) {
            const char = String.fromCharCode(event.keyCode || event.which);
            const valorActualStr = valorActual ? valorActual.toString() : '';
            
            // Permitir números
            if (/^[0-9]$/.test(char)) {
                // Si ya hay punto decimal, verificar que no exceda 2 decimales
                if (valorActualStr.includes('.')) {
                    const partes = valorActualStr.split('.');
                    const decimales = partes[1] || '';
                    
                    // Si ya tiene 2 decimales, no permitir más
                    if (decimales.length >= 2) {
                        // Verificar si el cursor está después del punto
                        const input = event.target;
                        const cursorPos = input.selectionStart;
                        const puntoPos = valorActualStr.indexOf('.');
                        
                        // Si el cursor está en los decimales y ya hay 2, bloquear
                        if (cursorPos > puntoPos) {
                            event.preventDefault();
                            return;
                        }
                    }
                }
                return;
            }
            
            // Permitir punto decimal solo si no existe ya uno
            if (char === '.' && !valorActualStr.includes('.')) {
                return;
            }
            
            // Bloquear cualquier otro carácter
            event.preventDefault();
        },

        toggleComboFaltantes(index) {
            const actual = this.comboFaltantesExpandidos[index];
            this.$set(this.comboFaltantesExpandidos, index, !actual);
        },
        
        manejarBorradoCantidad(fila, index, event) {
            if (this.bloqueoBorradoHasta && Date.now() < this.bloqueoBorradoHasta) {
                if (event) {
                    event.preventDefault();
                }
                return;
            }

            // Verificar después de un pequeño delay si el campo quedó vacío
            this.$nextTick(() => {
                // Si la cantidad está vacía o en 0, eliminar la fila para que las siguientes suban de posición
                if (!fila.cantidad || fila.cantidad.toString().trim() === '' || parseInt(fila.cantidad) <= 0) {
                    fila.cantidad = '';
                    this.eliminarFilaPorCantidadVacia(fila, index, 'keydown');
                }
            });
        },
        
        manejarBorradoBusqueda(fila, index, event) {
            // Solo actuar si el campo de búsqueda está vacío
            if (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') {
                // Si es la primera fila (index 0), NO eliminar - solo mantener vacía
                if (index === 0) {
                    return;
                }
                
                // Prevenir el comportamiento por defecto del backspace
                event.preventDefault();
                
                // Eliminar la fila
                this.filasCaptura.splice(index, 1);
                
                // Enfocar la fila anterior (la cantidad si tiene libro, o búsqueda si no)
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
                
                // Recalcular totales
                this.calcularTotalesVentas();
            }
        },
        
        activarBusqueda(fila, index) {
            // Si hay texto pero no hay libro seleccionado, reactivar búsqueda
            if (fila.textoBusqueda.trim().length >= 2 && !fila.libroSeleccionado) {
                this.buscarEnFila(fila, index);
            }
        },
        
        seleccionarPrimerResultado(fila, index) {
            if (fila.sugerenciaActual) {
                this.seleccionarLibroEnFila(fila, fila.sugerenciaActual, index);
            }
        },
        
        seleccionarLibroEnFila(fila, libro, index) {
            fila.libroSeleccionado = libro;
            fila.textoBusqueda = libro.nombre_libro;
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
            fila.cantidad = ''; // Cantidad por defecto
            fila.descuento = this.obtenerDescuentoPorLinea(libro).toString();
            fila.descuentoModificado = false; // Libro nuevo: resetear flag
            fila.confirmado = true; // Automáticamente confirmado al seleccionar
            
            // Enfocar el input de cantidad después de un pequeño delay
            this.$nextTick(() => {
                setTimeout(() => {
                    this.enfocarSiguienteInput(index, 'cantidad');
                }, 100);
            });
        },
        
        // Método para seleccionar libro desde v-select y consultar su stock
        seleccionarLibroDesdeSelect(fila, libro, index) {
            if (!libro) return;
            
            // VALIDACIÓN: Verificar si el libro ya está en otra fila
            const libroYaExiste = this.filasCaptura.some((f, i) => {
                return i !== index && 
                       f.libroSeleccionado && 
                       f.libroSeleccionado.pro_codigo === libro.pro_codigo;
            });
            
            if (libroYaExiste) {
                this.$f_notificacion(
                    `El libro "${libro.pro_codigo} - ${libro.nombre_libro}" ya está agregado en otra fila`, 
                    'warning', 
                    'AlertTriangleIcon', 
                    4000
                );
                return;
            }
            
            const esCombo = this.esLibroComboParaStock(libro);
            
            fila.textoBusqueda = `${libro.pro_codigo} - ${libro.nombre_libro}`;
            fila.cantidad = '';
            fila.descuento = this.obtenerDescuentoPorLinea(libro).toString();
            fila.descuentoModificado = false; // Libro nuevo: resetear flag para que descuentos de línea apliquen

            if (esCombo) {
                // Combo: NO consultar stock ahora, esperar a que ingresen cantidad
                const precioPedido = this.obtenerPrecioLibroParaCalculo(libro);
                fila.consultandoStock = false;
                fila.libroSeleccionado = {
                    ...libro,
                    precio: precioPedido !== null ? precioPedido : 0,
                    stock: null,        // null = pendiente de consulta con cantidad
                    puede_vender: null, // null = aún no evaluado
                    detalle_faltantes_combo: [],
                    stock_combo_componentes: []
                };
                // Enfocar cantidad directamente
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.enfocarSiguienteInput(index, 'cantidad');
                    }, 100);
                });
                return;
            }
            
            // Producto simple: consultar stock al seleccionar (flujo original)
            fila.consultandoStock = true;
            
            this.consultarStockPerseo([
                this.construirConsultaStockPerseo(libro, 0)
            ], this.ventaData.empresa)
            .then(stockData => {
                fila.consultandoStock = false;
                
                if (stockData && stockData[libro.pro_codigo]) {
                    const stockInfo = stockData[libro.pro_codigo];
                    
                    if (stockInfo.existenciastotales === undefined || stockInfo.existenciastotales === null) {
                        throw new Error('La respuesta no contiene el campo existenciastotales');
                    }

                    const precioPedido = this.obtenerPrecioLibro(libro);

                    fila.libroSeleccionado = {
                        ...libro,
                        precio: precioPedido,
                        pro_nombre: stockInfo.descripcion || libro.nombre_libro
                    };
                    this.aplicarStockRespuestaPerseo(fila.libroSeleccionado, stockInfo);
                    
                    fila.cantidad = this.obtenerCantidadMaximaPermitida(fila).toString();
                    
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.enfocarSiguienteInput(index, 'cantidad');
                        }, 100);
                    });
                } else {
                    const precioPedido = this.obtenerPrecioLibro(libro);
                    fila.libroSeleccionado = {
                        ...libro,
                        precio: precioPedido,
                        stock: 0
                    };
                    this.$f_notificacion('No se encontró stock para este libro', 'warning', 'AlertTriangleIcon', 3000);
                }
            })
            .catch(error => {
                console.error('Error al consultar stock desde v-select:', error);
                fila.consultandoStock = false;
                fila.stockError = true;
                const precioPedido = this.obtenerPrecioLibroParaCalculo(libro);
                fila.libroSeleccionado = {
                    ...libro,
                    precio: precioPedido !== null ? precioPedido : '',
                    stock: 0,
                    errorStock: true
                };
                this.$f_notificacion(
                    error.message || 'La respuesta del servidor no contiene la estructura esperada. Inténtalo de nuevo.', 
                    'danger', 
                    'XCircleIcon', 
                    4000
                );
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
                    // Agregar nueva fila si es necesario
                    if (index >= this.filasCaptura.length) {
                        this.agregarFilaCaptura();
                    }
                    
                    // Pequeño delay para asegurar que el DOM se actualice
                    setTimeout(() => {
                        const inputs = this.$el.querySelectorAll('.captura-rapida-container input[type="text"]');
                        if (inputs[index]) {
                            inputs[index].focus();
                        }
                    }, 100);
                }
            });
        },
        
        // Enfocar el v-select de una fila específica
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
        
        // Manejar Enter en campo de cantidad - crear nueva fila y enfocar su select
        manejarEnterCantidad(fila, index, event) {
            event.preventDefault();
            
            // Solo proceder si hay un libro seleccionado y cantidad válida
            if (!fila.libroSeleccionado || !fila.cantidad || parseInt(fila.cantidad) <= 0) {
                return;
            }
            
            // Validar que la cantidad no exceda el stock
            const cantidadNum = parseInt(fila.cantidad);
            const stockDisponible = parseInt(fila.libroSeleccionado.stock || 0);
            
            if (cantidadNum > stockDisponible) {
                this.$f_notificacion(
                    `Stock insuficiente. Disponible: ${stockDisponible}`,
                    'warning',
                    'AlertTriangleIcon',
                    3000
                );
                return;
            }
            
            // Verificar si quedan libros disponibles
            const librosDisponibles = this.librosDisponiblesParaFila(-1);
            if (librosDisponibles.length === 0) {
                return;
            }
            
            // Verificar si existe una siguiente fila vacía
            const siguienteFila = this.filasCaptura[index + 1];
            const existeSiguienteVacia = siguienteFila && !siguienteFila.libroSeleccionado && !siguienteFila.cantidad;
            
            // Solo agregar nueva fila si no existe una siguiente vacía
            if (!existeSiguienteVacia) {
                this.agregarFilaCaptura();
            }
            
            // Enfocar el select de la siguiente fila
            this.$nextTick(() => {
                setTimeout(() => {
                    this.enfocarSelect(index + 1);
                }, 200);
            });
        },
        
        // Manejar Backspace en v-select vacío - eliminar fila y enfocar cantidad anterior
        manejarBackspaceSelect(fila, index, event) {
            // Solo eliminar si está completamente vacío (sin libro, sin búsqueda, sin cantidad) y no es la primera fila
            const estaVacio = !fila.libroSeleccionado && 
                            (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') && 
                            (!fila.cantidad || fila.cantidad.toString().trim() === '');
            
            if (estaVacio && index > 0) {
                // Verificar que el input del v-select esté realmente vacío
                const selectRef = this.$refs[`select-libro-${index}`];
                const selectComponent = Array.isArray(selectRef) ? selectRef[0] : selectRef;
                
                if (selectComponent && selectComponent.$el) {
                    const inputElement = selectComponent.$el.querySelector('input');
                    if (inputElement && inputElement.value.trim() === '') {
                        event.preventDefault();
                        
                        // Eliminar la fila actual
                        this.filasCaptura.splice(index, 1);
                        
                        // Enfocar la cantidad de la fila anterior
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.enfocarSiguienteInput(index - 1, 'cantidad');
                            }, 100);
                        });
                    }
                }
            }
        },
        
        // COMENTADO: Método de posicionamiento manual - ahora v-select lo maneja automáticamente con append-to-body
        // posicionarDropdown(dropdownList, component, {width}) {
        //     // Posicionar el dropdown encima del select si está muy abajo en la pantalla
        //     dropdownList.style.width = width;
        //     dropdownList.style.zIndex = '99999';
        //     
        //     const rect = component.$refs.toggle.getBoundingClientRect();
        //     const spaceBelow = window.innerHeight - rect.bottom;
        //     const spaceAbove = rect.top;
        //     
        //     // Si hay más espacio arriba que abajo, mostrar arriba
        //     if (spaceAbove > spaceBelow && spaceBelow < 300) {
        //         dropdownList.style.top = 'auto';
        //         dropdownList.style.bottom = `${window.innerHeight - rect.top}px`;
        //     } else {
        //         dropdownList.style.top = `${rect.bottom}px`;
        //         dropdownList.style.bottom = 'auto';
        //     }
        //     
        //     dropdownList.style.left = `${rect.left}px`;
        // },
        
        
        limpiarFilaCaptura(fila, index) {
            // Si solo hay una fila, en lugar de eliminar, solo limpiar su contenido
            if (this.filasCaptura.length === 1) {
                const filaUnica = this.filasCaptura[0];
                filaUnica.textoBusqueda = '';
                filaUnica.libroSeleccionado = null;
                filaUnica.cantidad = '';
                filaUnica.confirmado = false;
                filaUnica.resultadosBusqueda = [];
                filaUnica.sugerenciaActual = null;
                filaUnica.errorCantidad = '';
                filaUnica.consultandoStock = false;
                filaUnica.stockError = false;
                filaUnica.descuentoModificado = false;
                
                // Forzar update para que Vue recalcule librosDisponiblesParaFila()
                // y permita volver a agregar el libro eliminado
                this.$nextTick(() => {
                    this.$forceUpdate();
                    this.enfocarSelect(0);
                });
            } else {
                // Eliminar completamente la fila seleccionada
                this.filasCaptura.splice(index, 1);
                
                // Determinar el nuevo índice a enfocar (anterior o la nueva primera fila)
                const nuevoIndexFocus = index > 0 ? index - 1 : 0;
                
                this.$nextTick(() => {
                    this.$forceUpdate();
                    setTimeout(() => {
                        const targetFila = this.filasCaptura[nuevoIndexFocus];
                        if (targetFila && targetFila.libroSeleccionado) {
                            this.enfocarSiguienteInput(nuevoIndexFocus, 'cantidad');
                        } else {
                            // Si no tiene libro, enfocar su v-select
                            this.enfocarSelect(nuevoIndexFocus);
                        }
                    }, 100);
                });
            }
            
            // Limpiar filas vacías adicionales después de cualquier eliminación
            this.$nextTick(() => {
                this.verificarYEliminarFilasVacias();
            });
            
            // Recalcular totales después de limpiar/eliminar
            this.calcularTotalesVentas();
        },
        
        // ========================================
        // MÉTODOS DE SINCRONIZACIÓN ENTRE TABLAS
        // ========================================
        
        sincronizarCantidadEnRapida(libro) {
            // Cuando cambia la cantidad en la tabla principal, actualizar en captura rápida
            const cantidad = libro.cantidadVenta;
            
            // Validación defensiva
            if (!this.filasCaptura || !Array.isArray(this.filasCaptura)) {
                return;
            }
            
            // Buscar si existe una fila con este libro en captura rápida
            const filaExistente = this.filasCaptura.find(fila => 
                fila.libroSeleccionado && fila.libroSeleccionado.pro_codigo === libro.pro_codigo
            );
            
            if (filaExistente) {
                // Si la cantidad queda vacía o es 0, limpiar completamente la fila
                if (!cantidad || cantidad.toString().trim() === '' || parseInt(cantidad) <= 0) {
                    filaExistente.textoBusqueda = '';
                    filaExistente.libroSeleccionado = null;
                    filaExistente.cantidad = '';
                    filaExistente.confirmado = false;
                    filaExistente.resultadosBusqueda = [];
                    filaExistente.sugerenciaActual = null;
                    filaExistente.errorCantidad = ''; // Limpiar el error también
                } else {
                    // Actualizar la cantidad si es válida
                    filaExistente.cantidad = cantidad;
                    filaExistente.confirmado = parseInt(cantidad) > 0;
                }
            } else if (cantidad && parseInt(cantidad) > 0) {
                // Si no existe fila pero se está agregando cantidad, buscar una fila vacía o crear nueva
                let filaVacia = this.filasCaptura && Array.isArray(this.filasCaptura)
                    ? this.filasCaptura.find(fila => !fila.libroSeleccionado)
                    : null;
                
                if (!filaVacia) {
                    // Crear nueva fila
                    this.agregarFilaCaptura();
                    filaVacia = this.filasCaptura[this.filasCaptura.length - 1];
                }
                
                // Llenar la fila vacía
                filaVacia.libroSeleccionado = libro;
                filaVacia.textoBusqueda = libro.nombre_libro;
                filaVacia.cantidad = cantidad;
                filaVacia.confirmado = true;
                filaVacia.resultadosBusqueda = [];
            }
            
            // Recalcular totales
            this.calcularTotalesVentas();
        },
        
        sincronizarCantidadEnTabla(fila) {
            // Recalcular totales
            this.calcularTotalesVentas();
        },
        
        
        avanzarAlSiguienteLibro(index) {
            const filaActual = this.filasCaptura[index];
            
            // Validar que tenga un libro seleccionado
            if (!filaActual.libroSeleccionado) {
                this.$vs.notify({
                    text: 'Debe seleccionar un libro primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            // Validar que la cantidad sea válida
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
            const cantidadPedida = parseInt(filaActual.libroSeleccionado.cantidad) || 0;
            const cantidadVendida = parseInt(filaActual.libroSeleccionado.cantidadVendida) || 0;
            const cantidadDisponible = Math.max(0, cantidadPedida - cantidadVendida);

            if (cantidadSolicitada > cantidadDisponible) {
                filaActual.errorCantidad = `No puede exceder lo disponible (${cantidadDisponible})`;
                this.$vs.notify({
                    title: '⚠️ Cantidad Excedida',
                    text: `La cantidad máxima para "${filaActual.libroSeleccionado.nombre_libro}" es ${cantidadDisponible}`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    time: 4000
                });
                return;
            }
            
            // Stock solo advertencia, no bloqueo
            const stockDisponible = parseInt(filaActual.libroSeleccionado.stock || 0, 10);
            if (stockDisponible > 0 && cantidadSolicitada > stockDisponible) {
                filaActual.errorCantidad = `⚠️ Stock actual: ${stockDisponible}. Puedes continuar con advertencia.`;
            }
            
            // Limpiar error si existe
            filaActual.errorCantidad = '';
            
            // Sincronizar la cantidad con la tabla
            this.sincronizarCantidadEnTabla(filaActual);
            
            // NUEVO FLUJO: Siempre agregar una nueva fila abajo y enfocar su v-select
            this.agregarFilaCaptura();
            const nuevaFilaIndex = this.filasCaptura.length - 1;
            
            // Enfocar el v-select de la nueva fila
            this.$nextTick(() => {
                setTimeout(() => {
                    this.enfocarSelect(nuevaFilaIndex);
                }, 200);
            });
        },
        
        validarCantidadLlenadoRapido(cantidad) {
            const cantidadNum = parseInt(cantidad);
            
            // Verificar si está vacío
            if (!cantidad || cantidad.toString().trim() === '') {
                this.$vs.notify({
                    text: 'El campo cantidad está vacío. Debe ingresar una cantidad válida.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return false;
            }
            
            // Verificar si es 0 o negativo
            if (cantidadNum <= 0) {
                this.$vs.notify({
                    text: 'La cantidad debe ser mayor a 0',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle'
                });
                return false;
            }
            
            return true;
        },
        
        // Método para calcular cantidad disponible para la venta
        calcularDisponible(libro) {
            if (!libro) return 0;
            const cantidadPedida = parseInt(libro.cantidad || 0);
            const cantidadVendida = parseInt(libro.cantidadVendida || 0);
            const disponible = cantidadPedida - cantidadVendida;
            return disponible > 0 ? disponible : 0;
        },
        
        // Método para obtener la cantidad máxima sugerida usando stock real
        obtenerCantidadMaximaPermitida(fila) {
            if (!fila.libroSeleccionado) return 999;

            // Pedido pendiente = pedido - vendido
            const cantidadPedida = parseInt(fila.libroSeleccionado.cantidad) || 0;
            const cantidadVendida = parseInt(fila.libroSeleccionado.cantidadVendida) || 0;
            const cantidadDisponiblePedido = cantidadPedida - cantidadVendida;
            const stockDisponible = parseInt(fila.libroSeleccionado.stock, 10);
            
            if (cantidadDisponiblePedido <= 0) return 0;

            // Si no hay stock válido, sugerir lo pendiente del pedido.
            if (isNaN(stockDisponible)) {
                return cantidadDisponiblePedido;
            }

            // Mostrar lo disponible real: mínimo entre pendiente del pedido y stock.
            return Math.max(0, Math.min(cantidadDisponiblePedido, stockDisponible));
        },
        
        // Método para llenar automáticamente la tabla de captura con los libros del pedido
        async llenarTablaAutomaticamente() {
            const me = this;
            
            // Validar que haya empresa seleccionada
            if (!me.ventaData.empresa) {
                return;
            }
            
            // Generar ID único para esta carga y cancelar la anterior si existe
            const currentCargaId = Date.now();
            me.idCargaActual = currentCargaId;

            // Validar que haya libros en el pedido
            if (!me.librosPedido || me.librosPedido.length === 0) {
                return;
            }
            
            // Marcar que hay una carga en progreso
            me.cargaEnProgreso = true;
            me.cancelarCarga = false;
            
            try {
                // Limpiar la tabla actual
                me.filasCaptura = [];
                
                // Obtener el ID de la empresa
                const empresaId = typeof me.ventaData.empresa === 'object' ? me.ventaData.empresa.id : me.ventaData.empresa;
                
                // Obtener todos los códigos de productos del pedido con cantidad disponible
                // IMPORTANTE: Excluir productos donde cantidad vendida >= cantidad pedida
                const librosPendientes = [];
                me.librosPedido.forEach(libro => {
                    const cantidadPedida = parseInt(libro.cantidad) || 0;
                    const cantidadVendida = parseInt(libro.cantidadVendida) || 0;
                    const cantidadDisponible = cantidadPedida - cantidadVendida;
                    
                    // Solo incluir si hay cantidad disponible (no vendido completamente)
                    if (cantidadDisponible > 0) {
                        librosPendientes.push({
                            libro: libro,
                            cantidadDisponible: cantidadDisponible
                        });
                    }
                });
                
                if (librosPendientes.length === 0) {
                    me.$vs.notify({
                        title: 'Sin Productos Pendientes',
                        text: 'Todos los productos del pedido ya han sido vendidos completamente',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        position: 'top-center',
                        time: 3000
                    });
                    // Agregar una fila vacía para poder agregar libros extras
                    me.filasCaptura.push({
                        textoBusqueda: '',
                        libroSeleccionado: null,
                        cantidad: '',
                        descuento: me.obtenerDescuentoInicialFila(),
                        confirmado: false,
                        resultadosBusqueda: [],
                        sugerenciaActual: null,
                        errorCantidad: '',
                        errorDescuento: '',
                        consultandoStock: false,
                        stockError: false
                    });
                    return;
                }
                
                // Procesar cada libro uno por uno
                for (const item of librosPendientes) {
                    // Verificar si se debe cancelar la carga
                    if (me.cancelarCarga || me.idCargaActual !== currentCargaId) {
                        me.cargaEnProgreso = false;
                        me.cancelarCarga = false;
                        return;
                    }
                    
                    const libro = item.libro;
                    const cantidadDisponible = item.cantidadDisponible;
                    
                    // Crear una fila nueva con estado de carga
                    const nuevaFila = {
                        textoBusqueda: libro.nombre_libro,
                        libroSeleccionado: { ...libro },
                        cantidad: cantidadDisponible.toString(),
                        descuento: me.obtenerDescuentoInicialFila(),
                        confirmado: true,
                        resultadosBusqueda: [],
                        sugerenciaActual: null,
                        errorCantidad: '',
                        errorDescuento: '',
                        consultandoStock: true,
                        stockError: false
                    };
                    
                    me.filasCaptura.push(nuevaFila);
                    const filaIndex = me.filasCaptura.length - 1;
                    const fila = me.filasCaptura[filaIndex];
                    
                    // Forzar actualización de la vista
                    await me.$nextTick();
                    
                    try {
                        // Consultar stock del libro individualmente
                        const stockResponse = await me.consultarStockPerseo([
                            me.construirConsultaStockPerseo(libro, cantidadDisponible)
                        ], empresaId);
                        
                        // Si se debe cancelar al haber esperado a la red, detener ejecución
                        if (me.cancelarCarga || me.idCargaActual !== currentCargaId) {
                            fila.consultandoStock = false;
                            me.cargaEnProgreso = false;
                            me.cancelarCarga = false;
                            return;
                        }
                        
                        if (stockResponse && stockResponse[libro.pro_codigo]) {
                            const infoStock = stockResponse[libro.pro_codigo];
                            
                            // Validar que exista existenciastotales
                            if (infoStock.existenciastotales === undefined || infoStock.existenciastotales === null) {
                                throw new Error(`La respuesta no contiene el campo existenciastotales para ${libro.pro_codigo}`);
                            }
                            
                            // Asignar información de stock al libro seleccionado
                            me.aplicarStockRespuestaPerseo(fila.libroSeleccionado, infoStock);
                            fila.libroSeleccionado.precio = me.obtenerPrecioLibro(libro);
                            fila.libroSeleccionado.estadoStock = infoStock.estado || 'disponible';
                            
                            // Validar si el stock de Perseo es suficiente para la cantidad disponible
                            if (fila.libroSeleccionado.stock < cantidadDisponible) {
                                fila.errorCantidad = infoStock.mensaje_stock_combo || `⚠️ Stock insuficiente. Disponible: ${fila.libroSeleccionado.stock}, Requerido: ${cantidadDisponible}`;
                                // Ajustar automáticamente la cantidad al stock disponible
                                fila.cantidad = fila.libroSeleccionado.stock.toString();
                            } else {
                                fila.errorCantidad = '';
                            }
                        } else {
                            fila.stockError = true;
                            fila.errorCantidad = 'No se pudo consultar el stock';
                            fila.libroSeleccionado.stock = 0;
                        }
                    } catch (error) {
                        console.error(`Error al consultar stock de ${libro.pro_codigo}:`, error);
                        fila.stockError = true;
                        fila.errorCantidad = error.message || 'Error: Respuesta inválida del servidor. Reintentar.';
                        fila.libroSeleccionado.stock = 0;
                    }
                    
                    // Desactivar indicador de carga
                    fila.consultandoStock = false;
                    
                    // Pequeña pausa para mejor experiencia visual (opcional)
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                
                // Agregar una fila vacía al final para nuevos libros
                me.filasCaptura.push({
                    textoBusqueda: '',
                    libroSeleccionado: null,
                    cantidad: '',
                    descuento: me.obtenerDescuentoInicialFila(),
                    confirmado: false,
                    resultadosBusqueda: [],
                    sugerenciaActual: null,
                    errorCantidad: '',
                    errorDescuento: '',
                    consultandoStock: false,
                    stockError: false
                });
                
                // Calcular totales
                me.calcularTotalesVentas();
                
                // Marcar que la carga finalizó exitosamente
                me.cargaEnProgreso = false;
                me.cancelarCarga = false;
                
                me.$vs.notify({
                    title: 'Productos Cargados',
                    text: `Se cargaron ${librosPendientes.length} productos del pedido`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    position: 'top-center',
                    time: 3000
                });
                
            } catch (error) {
                console.error('Error al llenar tabla automáticamente:', error);
                
                // Limpiar banderas de carga
                me.cargaEnProgreso = false;
                me.cancelarCarga = false;
                
                // Solo mostrar error si no fue cancelado
                if (!me.cancelarCarga) {
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo cargar los productos del pedido',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        position: 'top-center'
                    });
                }
            }
        },
        
        // Método para actualizar cantidades ya vendidas
        actualizarCantidadesVendidas() {
            let me = this;
            if (!me.librosPedido || me.librosPedido.length === 0) return;
            if (!me.librosVendidos || me.librosVendidos.length === 0) {
                me.librosPedido.forEach(libro => {
                    this.$set(libro, 'cantidadVendida', 0);
                });
                return;
            }
            
            me.librosPedido.forEach(libro => {
                const vendidosDelLibro = me.librosVendidos.filter(lp => lp.pro_codigo === libro.pro_codigo);
                const cantidadVentada = vendidosDelLibro.reduce((sum, item) => {
                    const cantidadItem = item && item.cantidad_vendida != null
                        ? parseInt(item.cantidad_vendida, 10)
                        : parseInt(item && item.cantidad_proformada != null ? item.cantidad_proformada : 0, 10);
                    return sum + (isNaN(cantidadItem) ? 0 : cantidadItem);
                }, 0);

                this.$set(libro, 'cantidadVendida', cantidadVentada);
            });
        },
        
        validarCantidadListado(libro) {
            const cantidad = parseInt(libro.cantidadVenta);
            
            // Si el campo está vacío, limpiar error y permitir
            if (libro.cantidadVenta === '' || libro.cantidadVenta === null) {
                this.$set(libro, 'errorStockMinimo', '');
                this.sincronizarCantidadEnRapida(libro);
                this.calcularTotalesVentas();
                return;
            }
            
            // Si intentan poner 0 o negativo, marcar error
            if (cantidad <= 0) {
                this.$set(libro, 'errorStockMinimo', 'Cantidad debe ser mayor a 0');
                this.$vs.notify({
                    text: 'La cantidad debe ser mayor a 0',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const cantidadPedida = parseInt(libro.cantidad) || 0;
            const cantidadVentada = parseInt(libro.cantidadVentada) || 0;
            const cantidadDisponible = cantidadPedida - cantidadVentada;

            if (cantidad > cantidadDisponible) {
                this.$set(libro, 'errorStockMinimo', `⚠️ Supera lo disponible (máx: ${cantidadDisponible})`);
                this.$vs.notify({
                    title: '⚠️ Cantidad No Disponible',
                    text: `Solo hay ${cantidadDisponible} unidades disponibles para proformar (Pedido: ${cantidadPedida} - Ya Proformado: ${cantidadVentada})`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 5000
                });
                return;
            }
            
            // VALIDACIÓN DE STOCK DISPONIBLE (aplica para todos)
            const stockDisponible = libro.stock || 0;
            
            if (cantidad > stockDisponible) {
                this.$set(libro, 'errorStockMinimo', `Stock insuficiente (máx: ${stockDisponible})`);
                this.$vs.notify({
                    title: '❌ Stock Insuficiente',
                    text: `Solo hay ${stockDisponible} unidades disponibles`,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle',
                    time: 4000
                });
                return;
            }
            
            // VALIDACIÓN DE STOCK MÍNIMO (aplica para todos)
            const stockRestante = stockDisponible - cantidad;
            
            if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                this.$set(libro, 'errorStockMinimo', `🔒 Bloqueo de stock mínimo (${this.stockMinimo}). Restante: ${stockRestante}`);
                
                // Solo mostrar notificación si no se ha mostrado recientemente
                this.mostrarNotificacionStockMinimo(
                    '🔒 Stock Mínimo Protegido',
                    `Stock restante (${stockRestante}) sería menor al mínimo (${this.stockMinimo}). Active el permiso en configuración.`,
                    'danger'
                );
                return;
            }
            
            // ✅ Si llegamos aquí, TODO ESTÁ BIEN - limpiar error
            this.$set(libro, 'errorStockMinimo', '');
            this.sincronizarCantidadEnRapida(libro);
            this.calcularTotalesVentas();
        },

        // Método para verificar si tiene stock plataforma suficiente
        tieneStockPlataformaSuficiente(fila) {
            if (!fila.libroSeleccionado) return false;
            
            const cantidadSolicitada = parseInt(fila.cantidad, 10) || 0;
            if (cantidadSolicitada <= 0) return true;
            
            // SIEMPRE evaluar solo stock_plataforma (independiente de Perseo)
            const stockPlataforma = fila.libroSeleccionado.stock_plataforma != null
                ? parseInt(fila.libroSeleccionado.stock_plataforma, 10)
                : (fila.libroSeleccionado.stock != null ? parseInt(fila.libroSeleccionado.stock, 10) : 0);
            
            return stockPlataforma >= cantidadSolicitada;
        },

        // Método para verificar si tiene stock Perseo suficiente
        tieneStockPerseoSuficiente(fila) {
            if (!fila.libroSeleccionado) return false;
            
            const cantidadSolicitada = parseInt(fila.cantidad, 10) || 0;
            if (cantidadSolicitada <= 0) return true;
            
            // SIEMPRE evaluar solo stock_perseo (independiente de plataforma)
            if (fila.libroSeleccionado.stock_perseo == null) return false;
            
            const stockPerseo = parseInt(fila.libroSeleccionado.stock_perseo, 10);
            return stockPerseo >= cantidadSolicitada;
        },

        // Tooltip para stock plataforma
        obtenerTooltipStockPlataforma(fila) {
            if (!fila.libroSeleccionado) return '';
            
            const cantidadSolicitada = parseInt(fila.cantidad, 10) || 0;
            const stockPlataforma = fila.libroSeleccionado.stock_plataforma != null
                ? parseInt(fila.libroSeleccionado.stock_plataforma, 10)
                : (fila.libroSeleccionado.stock != null ? parseInt(fila.libroSeleccionado.stock, 10) : 0);
            
            if (cantidadSolicitada === 0) {
                return `Stock disponible: ${stockPlataforma} unidades`;
            }
            
            const suficiente = stockPlataforma >= cantidadSolicitada;
            const faltante = cantidadSolicitada - stockPlataforma;
            
            if (suficiente) {
                return `Stock disponible: ${stockPlataforma} unidades`;
            } else {
                return `Stock insuficiente: necesita ${cantidadSolicitada}, disponible ${stockPlataforma}`;
            }
        },

        // Tooltip para stock Perseo
        obtenerTooltipStockPerseo(fila) {
            if (!fila.libroSeleccionado) return '';
            
            const cantidadSolicitada = parseInt(fila.cantidad, 10) || 0;
            const stockPerseo = fila.libroSeleccionado.stock_perseo != null 
                ? parseInt(fila.libroSeleccionado.stock_perseo, 10) 
                : 0;
            
            if (cantidadSolicitada === 0) {
                return `Stock Perseo: ${stockPerseo} unidades`;
            }
            
            const suficiente = stockPerseo >= cantidadSolicitada;
            const faltante = cantidadSolicitada - stockPerseo;
            
            if (suficiente) {
                return `Stock Perseo: ${stockPerseo} unidades disponibles`;
            } else {
                return `Stock Perseo insuficiente: necesita ${cantidadSolicitada}, disponible ${stockPerseo}`;
            }
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

        // Verificar si puede colapsar la tabla de faltantes (solo root)
        puedeColapsarFaltantes() {
            const usuariorespo = localStorage.getItem('usuario');
            if (!usuariorespo) return false;
            
            const usuarioObjeto = JSON.parse(usuariorespo);
            const idGroup = parseInt(usuarioObjeto.id_group, 10);
            
            // Solo root (id_group === 1) puede colapsar
            return idGroup === 1;
        },
    }
}
</script>

<style scoped>
/* Estilos para el popup de proforma */
.popup-proforma {
    z-index: 51001;
}

.popup-proforma .vs-popup {
    padding: 20px;
    overflow: visible !important;
}

.popup-proforma .vs-popup .vs-popup--content {
    overflow: visible !important;
    max-height: none !important;
}

/* Evitar scroll en tablas */
.popup-proforma .vs-table {
    overflow: visible !important;
}

.popup-proforma .vs-table .vs-table--content {
    overflow: visible !important;
    max-height: none !important;
}

.popup-proforma .vs-table .vs-table--tbody {
    overflow: visible !important;
    max-height: none !important;
}

/* Asegurar que filas y celdas no corten el dropdown */
.popup-proforma .vs-table .vs-table--tbody tr,
.popup-proforma .vs-table .vs-table--tbody td {
    overflow: visible !important;
}

.grid {
    display: grid;
    gap: 1rem;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
    .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .md\:grid-cols-4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

.bg-blue-50 {
    background-color: #eff6ff;
}

.bg-green-50 {
    background-color: #f0fdf4;
}

.bg-yellow-50 {
    background-color: #fefce8;
}

.bg-purple-50 {
    background-color: #faf5ff;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.text-blue-700 {
    color: #1d4ed8;
}

.text-green-700 {
    color: #15803d;
}

.text-yellow-700 {
    color: #a16207;
}

.text-purple-700 {
    color: #7c3aed;
}

.text-purple-600 {
    color: #9333ea;
}

.text-orange-600 {
    color: #ea580c;
}

.text-green-600 {
    color: #16a34a;
}

.text-green-700 {
    color: #15803d;
}

.text-blue-700 {
    color: #1d4ed8;
}

.rounded {
    border-radius: 0.375rem;
}

.p-3 {
    padding: 0.75rem;
}

.p-4 {
    padding: 1rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mt-4 {
    margin-top: 1rem;
}

.mt-6 {
    margin-top: 1.5rem;
}

.mt-1 {
    margin-top: 0.25rem;
}

.gap-4 {
    gap: 1rem;
}

.text-sm {
    font-size: 0.875rem;
}

.text-lg {
    font-size: 1.125rem;
}

.font-bold {
    font-weight: 700;
}

.font-semibold {
    font-weight: 600;
}

.text-gray-600 {
    color: #4b5563;
}

.text-red-500 {
    color: #ef4444;
}

.flex {
    display: flex;
}

.justify-center {
    justify-content: center;
}

.block {
    display: block;
}

.w-full {
    width: 100%;
}

.gap-2 {
    gap: 0.5rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.text-xs {
    font-size: 0.75rem;
}

.text-gray-500 {
    color: #6b7280;
}

/* Estilos personalizados para Lugar de Despacho */
.lugar-seleccionado {
    background: #fafafa;
    border: 1px solid #48bb78;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.lugar-info {
    flex: 1;
}

.lugar-nombre {
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
}

.lugar-ciudad {
    font-size: 12px;
    color: #606c76;
    margin-bottom: 6px;
}

.lugar-financiero {
    background: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 11px;
    color: #606c76;
    border: 1px solid #e8e8e8;
}

.lugar-sin-cupo {
    background: #fff3cd;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ffc107;
    animation: pulse-warning 2s ease-in-out infinite;
    flex-wrap: wrap;
    gap: 8px;
}

.lugar-sin-cupo > div:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 200px;
}

.lugar-sin-cupo > div:first-child span {
    font-size: 12px;
    color: #856404;
}

@media (max-width: 768px) {
    .lugar-sin-cupo {
        flex-direction: column;
        align-items: stretch;
        padding: 10px;
        gap: 10px;
    }
    
    .lugar-sin-cupo > div:first-child {
        min-width: 100%;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }
    
    .lugar-sin-cupo > div:first-child span {
        font-size: 11px;
        line-height: 1.4;
    }
    
    .lugar-sin-cupo button,
    .btn-configurar-cupo {
        width: 100%;
    }
    
    /* Responsive para lugar seleccionado */
    .lugar-nombre {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 8px;
    }
    
    .lugar-nombre > div {
        width: 100%;
        flex-direction: column;
        gap: 6px;
    }
    
    .lugar-nombre button {
        width: 100%;
    }
    
    /* Responsive para información financiera */
    .lugar-financiero {
        flex-direction: column !important;
        gap: 8px;
        text-align: center;
    }
    
    .lugar-financiero > div {
        font-size: 10px;
        line-height: 1.6;
    }
    
    .lugar-financiero button {
        width: 100%;
        margin-top: 6px;
    }
    
    .lugar-btn-editar {
        width: 100%;
    }
}

@keyframes pulse-warning {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
    }
    50% {
        box-shadow: 0 0 0 6px rgba(255, 193, 7, 0);
    }
}

.lugar-sin-cupo strong {
    color: #856404;
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
}

.lugar-buscar:hover {
    border-color: #5b3cc4;
    background: #f7fafc;
}

.lugar-buscar-texto {
    font-weight: 500;
    color: #606c76;
    font-size: 13px;
}

/* Estilos personalizados para Cliente Perseo */
.cliente-seleccionado {
    background: #fafafa;
    border: 1px solid #48bb78;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.cliente-info {
    flex: 1;
}

.cliente-nombre {
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

.text-success {
    color: #48bb78 !important;
}

/* Estilos para loading de stock */
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

/* Spinner pequeño para inline */
.loading-spinner-small {
    width: 12px;
    height: 12px;
    border: 2px solid #e8e8e8;
    border-top: 2px solid #5b3cc4;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* ========================================
   ESTILOS PARA CAPTURA RÁPIDA
   ======================================== */

.captura-rapida-container {
    padding: 0;
    position: relative;
    z-index: 1;
    overflow: visible !important;
}

.tabla-captura-container {
    background: white;
    border-radius: 6px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    margin-bottom: 20px;
    position: relative;
    overflow: visible !important;
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
    overflow: visible !important;
}

.input-with-dropdown .vs__dropdown-menu {
    z-index: 99999 !important;
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

/* Estilos para indicador de carga individual en cada fila */
.loading-individual {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #3b82f6;
    border-radius: 6px;
    color: #1e40af;
    font-size: 13px;
    font-weight: 500;
}

.loading-individual i {
    color: #3b82f6;
    font-size: 16px;
}

/* Animación de rotación para el ícono de carga */
@keyframes rotating {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.rotating {
    animation: rotating 1s linear infinite;
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
/* ESTILOS PARA PANEL DE CONFIGURACIÓN */
/* ===================================== */

.headers-xd {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
}

.headers-form {
    display: flex;
    align-items: center;
    font-size: 11px;
    font-weight: 600;
}

.descuentos-linea-row {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
}

.descuento-linea-item {
    min-width: 170px;
}

.descuento-linea-input {
    width: 150px;
}

/* Responsive para panel de configuración */
@media (max-width: 768px) {
    .descuentos-linea-row {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .descuento-linea-item,
    .descuento-linea-input {
        width: 100%;
        min-width: 0;
    }

    .config-sidebar {
        width: 100%;
        max-width: 100%;
    }
    
    .config-toggle-btn {
        width: 48px;
        height: 48px;
        right: 15px;
        top: 100px;
    }
    
    .config-tooltip {
        display: none;
    }
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

/* ===================================== */
/* ESTILOS PARA V-SELECT */
/* ===================================== */

/* Dropdown del v-select con append-to-body */
.v-select .vs__dropdown-menu {
    z-index: 999999 !important;
    position: absolute !important;
}

/* Cuando el dropdown está en el body */
body > .v-select .vs__dropdown-menu,
.vs__dropdown-menu {
    z-index: 999999 !important;
}

.v-select >>> .vs__dropdown-toggle {
    z-index: 1;
}

/* Asegurar que el contenedor de la tabla no oculte el dropdown */
.tabla-captura-container {
    overflow: visible !important;
}

.vs-table-content {
    overflow: visible !important;
}

.captura-rapida-container {
    overflow: visible !important;
}

/* Asegurar que el vx-card no oculte elementos */
.popup-proforma .vx-card {
    overflow: visible !important;
}

.popup-proforma .vx-card__body {
    overflow: visible !important;
}

/* ===================================== */
/* FIN ESTILOS V-SELECT */
/* ===================================== */

/* Estilos para inputs con error de stock */
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

.cantidad-error {
    border: 2px solid #ff4757 !important;
    background-color: #fff5f5 !important;
}

/* Animación de shake para campos con error */
.shake-error {
    animation: shake 0.6s;
    border: 2px solid #ff4757 !important;
    box-shadow: 0 0 10px rgba(255, 71, 87, 0.5) !important;
}

/* ===================================== */
/* ESTILOS PARA V-SELECT (DROPDOWN) */
/* ===================================== */

/* Mejorar visibilidad del dropdown del v-select */
.select-libro-venta >>> .vs__dropdown-toggle {
    min-height: 38px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    background: white;
    transition: all 0.2s ease;
}

.select-libro-venta >>> .vs__dropdown-toggle:hover {
    border-color: #5c3cc491;
}

.select-libro-venta >>> .vs__dropdown-menu {
    z-index: 99999 !important;
    max-height: 300px !important;
    overflow-y: auto !important;
    border: 2px solid #5b3cc4 !important;
    box-shadow: 0 10px 30px rgba(91, 60, 196, 0.3) !important;
    border-radius: 6px !important;
    background: white !important;
    margin-top: 4px !important;
}

.select-libro-venta >>> .vs__dropdown-option {
    padding: 10px 12px !important;
    transition: all 0.15s ease;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
}

.select-libro-venta >>> .vs__dropdown-option:hover,
.select-libro-venta >>> .vs__dropdown-option--highlight {
    background: #f3f4f6 !important;
    color: #ffffff !important;
}

.select-libro-venta >>> .vs__dropdown-option:hover span,
.select-libro-venta >>> .vs__dropdown-option--highlight span {
    background: #f3f4f6 !important;
    color: #ffffff !important;
}

.select-libro-venta >>> .vs__dropdown-option--selected {
    background: #ede9fe !important;
    color: #5b3cc4 !important;
    font-weight: 600;
}

.select-libro-venta >>> .vs__search {
    padding: 6px 0 !important;
    font-size: 14px;
}

.select-libro-venta >>> .vs__search:focus {
    outline: none;
}

.select-libro-venta >>> .vs__selected {
    padding: 4px 6px;
    color: #2c3e50;
    font-size: 14px;
}

.select-libro-venta >>> .vs__actions {
    padding: 4px 6px;
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

<style>
/* Estilos globales para v-select dropdown cuando usa append-to-body */
.v-select.select-libro-venta .vs__dropdown-menu {
    z-index: 999999 !important;
}

/* Estilos para el dropdown cuando está en el body */
body > .vs__dropdown-menu {
    z-index: 999999 !important;
}

/* Input compacto para tabla */
.input-compact .vs-inputx,
.input-compact .vs-input--input {
    height: 24px !important;
    padding: 2px 4px !important;
    font-size: 11px !important;
}

.input-compact .vs-input {
    min-height: 24px !important;
    margin: 0 !important;
}

/* V-select más compacto */
.tabla-captura-container .v-select .vs__dropdown-toggle {
    min-height: 32px !important;
    padding: 2px 4px !important;
}

.tabla-captura-container .v-select input.vs__search {
    font-size: 11px !important;
    padding: 4px 0 !important;
}

.tabla-captura-container .v-select .vs__selected {
    font-size: 11px !important;
    padding: 2px 4px !important;
}

/* Reducir altura de filas de la tabla */
.tabla-captura-container .vs-table {
    border-collapse: collapse !important;
}

.tabla-captura-container .vs-table tr {
    height: auto !important;
    padding: 0 !important;
}

.tabla-captura-container .vs-table th {
    padding: 4px 6px !important;
    height: auto !important;
    min-height: auto !important;
}

.tabla-captura-container .vs-table td {
    padding: 2px 6px !important;
    vertical-align: middle !important;
    height: 30px !important;
}

/* Hacer botones más pequeños */
.tabla-captura-container .vs-button--size-small {
    padding: 2px 4px !important;
    font-size: 11px !important;
    min-height: auto !important;
}

/* Mini tabla de faltantes para combos */
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
}
.combo-faltantes-header-clickable {
    cursor: pointer;
}
.combo-faltantes-header-clickable:hover {
    background: #fecaca;
}
.combo-faltantes-grid {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
}
.combo-faltantes-grid thead tr {
    background: #fef2f2;
}
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
.combo-faltantes-grid tbody tr:last-child td {
    border-bottom: none;
}
.combo-faltantes-codigo {
    font-family: monospace;
    font-weight: 700;
    color: #1e293b;
}
.combo-faltantes-stock {
    color: #64748b;
    text-align: center;
}
.combo-faltantes-faltante {
    color: #dc2626;
    font-weight: 700;
    text-align: center;
}
</style>
