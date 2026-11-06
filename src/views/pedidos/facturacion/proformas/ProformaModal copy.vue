<template>
    <vs-popup 
        class="popup-proforma" 
        fullscreen 
        :title="modoEdicion ? `Editar Proforma - Pedido #${pedidoSeleccionado ? pedidoSeleccionado.id_pedido : ''}` : `Nueva Proforma - Pedido #${pedidoSeleccionado ? pedidoSeleccionado.id_pedido : ''}`" 
        :active.sync="popupProforma"
        @close="cerrarProforma"
    >
        <!-- Componente de Configuración -->
        <ConfigProforma
            v-model="mostrarConfigSidebar"
            :config="configProforma"
            :stock-minimo="stockMinimo"
            :mostrar-boton="!!proformaData.empresa"
            @update-config="handleConfigUpdate"
        />
        
        <!-- Barra de totales anclada (sticky) - Versión ultra compacta -->
        <div v-if="calcularTotalesUnificados().cantidadLibros > 0" class="barra-totales-sticky-compacta" >
            <div class="contenido-barra-compacta" :class="esVentaPorLista() && proformaData.lugarDespacho.nombreInstitucion && !tieneCupoSuficiente() ? 'barra-error' : 'barra-normal'">
                <!-- Para venta por lista con cupo -->
                <div v-if="esVentaPorLista() && proformaData.lugarDespacho.nombreInstitucion" class="flex items-center justify-between">
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

        <div v-if="popupProforma && pedidoSeleccionado">
            <!-- Información del pedido en el popup -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Información del Pedido</h4>
                </template>
                <div class="container-fluid small py-1 border-bottom mb-2">
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
            </vx-card>

            <!-- Selección de Empresa -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Configuración de Proforma</h4>
                </template>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            v-model="proformaData.empresa"
                            class="w-full"
                        >
                            <template #option="option">
                                <div class="py-1">
                                    <div class="font-bold">{{ option.descripcion_corta }} - {{ 'ID: ' + (option.id || 'Sin código') }}</div>
                                </div>
                            </template>
                        </v-select>
                        <span v-if="validationErrors.empresa" class="text-red-500 text-sm">{{ validationErrors.empresa }}</span>
                    </div>
                    
                    <div>
                        <label class="font-bold mb-2 block">
                            Descuento (%)
                        </label>
                        <vs-input
                            ref="inputDescuento"
                            type="number"
                            placeholder="0"
                            v-model="proformaData.descuento"
                            @input="calcularTotalesProforma"
                            min="0"
                            max="100"
                            class="w-full"
                            :disabled="esVentaPorLista() && !proformaData.lugarDespacho.nombreInstitucion"
                        />
                        <small v-if="esVentaPorLista() && !proformaData.lugarDespacho.nombreInstitucion" class="text-orange-500">
                            Seleccione un lugar de despacho para habilitar el descuento
                        </small>
                        <small v-else-if="esVentaPorLista()" class="text-green-600">
                            Descuento del lugar de despacho aplicado automáticamente
                        </small>
                        <small v-else class="text-gray-500">
                            Descuento inicial del pedido aplicado automáticamente
                        </small>
                    </div>
                </div>
                
                <!-- Campo de observación -->
                <div class="mt-4">
                    <label class="font-bold mb-2 block" >
                        Observación
                    </label>
                    <vs-textarea
                        ref="inputObservacion"
                        placeholder="Escriba alguna observación para la proforma (máximo 200 caracteres)..."
                        v-model="proformaData.observacion"
                        :counter="200"
                        counter-danger
                        class="w-full"
                    />
                    <div class="text-right text-sm mt-1">
                        <span :class="{'text-red-500': proformaData.observacion && proformaData.observacion.length > 200, 'text-gray-500': !proformaData.observacion || proformaData.observacion.length <= 200}">
                            {{ (proformaData.observacion || '').length }}/200 caracteres
                        </span>
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
                            <div v-if="proformaData.lugarDespacho.nombreInstitucion" class="lugar-seleccionado">
                                <div class="lugar-info">
                                    <div class="lugar-nombre" style="display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; align-items: center;">
                                            <i class="fas fa-check-circle text-success mr-2"></i>
                                            {{ proformaData.lugarDespacho.nombreInstitucion }}
                                        </div>
                                        <div style="display: flex; gap: 8px;">
                                            <vs-button 
                                                @click="abrirEditarInstitucion()" 
                                                color="warning" 
                                                type="flat" 
                                                size="small"
                                                icon="create"
                                                icon-pack="material-icons"
                                                class="lugar-btn-editar-inst"
                                            >
                                                Editar
                                            </vs-button>
                                            
                                            <vs-button 
                                                @click="quitarLugarDespacho()" 
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
                                    <div class="lugar-ciudad">{{ proformaData.lugarDespacho.ciudad }}</div>
                                    
                                    <!-- Información financiera si existe -->
                                    <div v-if="proformaData.lugarDespacho.datosInstitucion && proformaData.lugarDespacho.datosInstitucion.length > 0" class="lugar-financiero" style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Crédito:</strong> {{ proformaData.lugarDespacho.datosInstitucion[0].ffp_credito }} | 
                                            <strong>Cupo:</strong> {{ proformaData.lugarDespacho.datosInstitucion[0].ffp_cupo }} | 
                                            <strong>Desc:</strong> {{ proformaData.lugarDespacho.datosInstitucion[0].ffp_descuento }}%
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
                                    
                                    <!-- Botón para CONFIGURAR cupo si NO existe -->
                                    <div v-else class="lugar-sin-cupo">
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
                            
                            <span v-if="validationErrors.lugarDespacho" class="text-red-500 text-sm mt-1 block">
                                {{ validationErrors.lugarDespacho }}
                            </span>
                            
                            <!-- Formulario inline para editar cupo -->
                            <div v-if="showFormularioCupo && proformaData.lugarDespacho.nombreInstitucion" class="formulario-cupo-inline mt-4">
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
                                            <span>{{ formularioCupoData.nombreInstitucion || proformaData.lugarDespacho.nombreInstitucion }}</span>
                                            <small>{{ formularioCupoData.ciudad || proformaData.lugarDespacho.ciudad }}</small>
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
                                            placeholder="0"
                                            class="w-full"
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
                            <div v-if="proformaData.clientePerseo.nombre" class="cliente-seleccionado">
                                <div class="cliente-info">
                                    <div class="cliente-nombre">
                                        <i class="fas fa-check-circle text-success mr-2"></i>
                                        {{ proformaData.clientePerseo.nombre }}
                                    </div>
                                    <div class="cliente-cedula">{{ proformaData.clientePerseo.cedula }}</div>
                                    <div v-if="proformaData.clientePerseo.email" class="cliente-email">{{ proformaData.clientePerseo.email }}</div>
                                </div>
                                
                                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                    <vs-button 
                                        @click="abrirBusquedaCliente()" 
                                        color="warning" 
                                        type="flat" 
                                        size="small"
                                        class="cliente-btn-editar"
                                        :disabled="!proformaData.empresa"
                                        icon="create"
                                        icon-pack="material-icons"
                                    >
                                        Editar
                                    </vs-button>
                                    
                                    <vs-button 
                                        @click="quitarClientePerseo()" 
                                        color="danger" 
                                        type="flat" 
                                        size="small"
                                        class="cliente-btn-cambiar"
                                        :disabled="!proformaData.empresa"
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
                                :class="{'cliente-buscar-disabled': !proformaData.empresa}"
                            >
                                <div class="cliente-buscar-texto">
                                    Buscar Cliente en Perseo
                                </div>
                            </div>
                            
                            <span v-if="validationErrors.clientePerseo" class="text-red-500 text-sm mt-1 block">
                                {{ validationErrors.clientePerseo }}
                            </span>
                            
                            <!-- Mensaje informativo si no hay empresa -->
                            <small v-if="!proformaData.empresa" class="text-red-500 block mt-1">
                                Primero seleccione una empresa
                            </small>
                        </div>
                    </div>
                </div>
            </vx-card>

            <!-- Sección para Agregar Libros Extras (solo visible cuando está activado) - VERSIÓN COMPACTA -->
            <vx-card v-if="configProforma.permitirTodosLibros" class=" mb-3">
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
                        <div v-else-if="librosConStock.length > 0">
                            <div class="mb-4 flex justify-between items-center">
                                <div class="flex items-center gap-4">
                                    <vs-chip color="success">{{ librosConStock.length }} libros en el pedido</vs-chip>
                                    <vs-chip color="primary">{{ contarLibrosConCantidad() }} libros con cantidad para proforma</vs-chip>
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
                                    <vs-th>Cant. Pedida</vs-th>
                                    <vs-th>Ya Proformado</vs-th>
                                    <vs-th>Disponible</vs-th>
                                    <vs-th>Stock Disponible</vs-th>
                                    <vs-th>Cantidad Proforma</vs-th>
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
                                                {{ libro.pro_codigo }}
                                            </div>
                                        </vs-td>
                                        
                                        <vs-td>
                                            <div style="max-width: 250px;">
                                                <p class="font-semibold text-sm">{{ libro.nombre_libro }}</p>
                                            </div>
                                        </vs-td>
                                        
                                        <vs-td>
                                            <vs-chip color="primary" class="text-center">
                                                ${{ parseFloat(libro.precio || 0).toFixed(2) }}
                                            </vs-chip>
                                        </vs-td>
                                        
                                        <vs-td>
                                            <vs-chip 
                                                v-if="!libro.esLibroExtra"
                                                color="dark" 
                                                class="text-center"
                                            >
                                                {{ libro.cantidad }}
                                            </vs-chip>
                                            <vs-chip 
                                                v-else
                                                color="warning" 
                                                class="text-center"
                                                title="Libro extra - no aplica cantidad pedida"
                                            >
                                                ➕ Extra
                                            </vs-chip>
                                        </vs-td>
                                        
                                        <vs-td>
                                            <vs-chip 
                                                v-if="!libro.esLibroExtra"
                                                :color="libro.cantidadProformada > 0 ? 'success' : 'dark'" 
                                                class="text-center"
                                            >
                                                {{ libro.cantidadProformada || 0 }}
                                            </vs-chip>
                                            <vs-chip 
                                                v-else
                                                color="dark" 
                                                class="text-center"
                                            >
                                                0
                                            </vs-chip>
                                        </vs-td>
                                        
                                        <vs-td>
                                            <vs-chip 
                                                v-if="!libro.esLibroExtra"
                                                :color="calcularDisponible(libro) > 0 ? 'primary' : 'danger'" 
                                                class="text-center font-bold"
                                            >
                                                {{ calcularDisponible(libro) }}
                                            </vs-chip>
                                            <vs-chip 
                                                v-else
                                                color="warning" 
                                                class="text-center"
                                            >
                                                ➕ Extra
                                            </vs-chip>
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
                                        
                                        <vs-td>
                                            <vs-input 
                                                v-model="libro.cantidadProforma"
                                                @input="validarCantidadListadoDebounce(libro)"
                                                @blur="validarCantidadListado(libro)"
                                                type="number"
                                                min="1"
                                                :max="libro.stock || 999"
                                                style="width: 80px;"
                                                :class="libro.errorStockMinimo ? 'input-error-stock' : ''"
                                                :danger="!!libro.errorStockMinimo"
                                            />
                                            <small v-if="libro.errorStockMinimo" class="text-red-500 text-xs block mt-1">
                                                {{ libro.errorStockMinimo }}
                                            </small>
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
                                            <div v-else >
                                                
                                            </div>
                                        </vs-td>
                                    </vs-tr>
                                </template>
                            </vs-table>
                        </div>
                    </vs-tab>
                    
                    <!-- Tab 2: Captura Súper Rápida -->
                    <vs-tab label="Llenado Rápido" icon="flash_on">
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
                                        <vs-th style="width: 80px;">
                                            <feather-icon icon="ClipboardIcon" size="14" class="mr-1"></feather-icon>
                                            Cant. Pedida
                                        </vs-th>
                                        <vs-th style="width: 80px;">
                                            <feather-icon icon="CheckCircleIcon" size="14" class="mr-1"></feather-icon>
                                            Ya Proformado
                                        </vs-th>
                                        <vs-th style="width: 80px;">
                                            <feather-icon icon="ShoppingCartIcon" size="14" class="mr-1"></feather-icon>
                                            Disponible
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
                                                    ${{ parseFloat(fila.libroSeleccionado.precio || 0).toFixed(2) }}
                                                </vs-chip>
                                                <span v-else style="color: #ccc;">-</span>
                                            </vs-td>
                                            
                                            <!-- Cantidad Pedida -->
                                            <vs-td>
                                                <vs-chip 
                                                    v-if="fila.libroSeleccionado && !fila.libroSeleccionado.esLibroExtra"
                                                    color="dark" 
                                                    size="small"
                                                >
                                                    {{ fila.libroSeleccionado.cantidad || 0 }}
                                                </vs-chip>
                                                <vs-chip 
                                                    v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.esLibroExtra"
                                                    color="warning" 
                                                    size="small"
                                                    title="Libro extra - no aplica cantidad pedida"
                                                >
                                                    ➕ Extra
                                                </vs-chip>
                                                <span v-else style="color: #ccc;">-</span>
                                            </vs-td>
                                            
                                            <!-- Ya Proformado -->
                                            <vs-td>
                                                <vs-chip 
                                                    v-if="fila.libroSeleccionado && !fila.libroSeleccionado.esLibroExtra"
                                                    :color="(fila.libroSeleccionado.cantidadProformada || 0) > 0 ? 'success' : 'dark'" 
                                                    size="small"
                                                >
                                                    {{ fila.libroSeleccionado.cantidadProformada || 0 }}
                                                </vs-chip>
                                                <vs-chip 
                                                    v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.esLibroExtra"
                                                    color="dark" 
                                                    size="small"
                                                >
                                                    0
                                                </vs-chip>
                                                <span v-else style="color: #ccc;">-</span>
                                            </vs-td>
                                            
                                            <!-- Disponible -->
                                            <vs-td>
                                                <vs-chip 
                                                    v-if="fila.libroSeleccionado && !fila.libroSeleccionado.esLibroExtra"
                                                    :color="calcularDisponible(fila.libroSeleccionado) > 0 ? 'primary' : 'danger'" 
                                                    size="small"
                                                    class="font-bold"
                                                >
                                                    {{ calcularDisponible(fila.libroSeleccionado) }}
                                                </vs-chip>
                                                <vs-chip 
                                                    v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.esLibroExtra"
                                                    color="warning" 
                                                    size="small"
                                                >
                                                    ➕ Extra
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
                                                <small v-if="fila.errorCantidad" class="text-red-500 text-xs block mt-1">
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
                                            
                                            <!-- Estado -->
                                            <!-- <vs-td>
                                                <span v-if="fila.confirmado" style="color: #48bb78; font-weight: bold;">✅</span>
                                                <span v-else-if="fila.libroSeleccionado && fila.cantidad" style="color: #f6ad55;">⏳</span>
                                                <span v-else style="color: #ccc;">⭕</span>
                                            </vs-td> -->
                                            
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
                <div v-if="!loadingStock && librosConStock.length === 0" class="bg-orange-50 p-4 rounded text-center">
                    <i class="fas fa-book text-2xl text-orange-400 mb-2"></i>
                    <p class="text-orange-600">No se encontraron libros para consultar stock</p>
                </div>
                
                <!-- Resumen de Totales de la Proforma (siempre visible) -->
                <div class="mt-6 p-4 bg-white rounded-lg border border-gray-300">
                    <div v-if="calcularTotalesUnificados().cantidadLibros > 0" class="flex flex-col items-end space-y-1 text-sm font-bold text-gray-800" >
                        <div class="flex justify-end w-full md:w-1/3">
                            <label class="mr-2">Subtotal $:</label>
                            <span>{{ calcularTotalesUnificados().subtotal.toFixed(2) }}</span>
                        </div>

                        <div class="flex justify-end w-full md:w-1/3">
                            <label class="mr-2">Descuento {{proformaData.descuento}}%:</label>
                            <span>{{ calcularTotalesUnificados().descuentoMonto.toFixed(2) }}</span>
                        </div>

                        <div class="flex justify-end w-full md:w-1/3">
                            <label class="mr-2">Subtotal - Descuento $:</label>
                            <span>{{ calcularTotalesUnificados().subtotalConDescuento.toFixed(2) }}</span>
                        </div>

                        <div class="flex justify-end w-full md:w-1/3">
                            <label class="mr-2">IVA $:</label>
                            <span>{{ calcularTotalesUnificados().iva.toFixed(2) }}</span>
                        </div>

                        <div class="flex justify-end w-full md:w-1/3">
                            <label class="mr-2">Transporte $:</label>
                            <span>{{ calcularTotalesUnificados().transporte.toFixed(2) }}</span>
                        </div>

                        <div class="flex justify-end w-full md:w-1/3 border-t border-gray-300 pt-1 mt-1">
                            <label class="mr-2">TOTAL $:</label>
                            <span>{{ calcularTotalesUnificados().total.toFixed(2) }}</span>
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
                    @click="generarProforma" 
                    :disabled="!validarFormularioCompleto()"
                    icon="check"
                    icon-pack="material-icons"
                >
                    Generar Proforma
                </vs-button>
                <vs-button 
                    color="danger" 
                    type="border" 
                    @click="cerrarProforma"
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
            :id-periodo="pedidoSeleccionado ? pedidoSeleccionado.id_periodo : 0"
            @lugar-seleccionado="asignarLugarDespacho"
            @cerrar="cerrarBusquedaLugar"
        />
        
        <BusquedaClientePerseo
            :visible.sync="mostrarBusquedaCliente"
            :empresa="proformaData.empresa"
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
                v-if="mostrarEditarInstitucion && proformaData.lugarDespacho.id_institucion"
                :institucion_id="parseInt(proformaData.lugarDespacho.id_institucion)"
                @changeSaveInformacion="actualizarDespuesDeEditar"
            />
        </vs-popup>
    </vs-popup>
</template>

<script>
import vSelect from 'vue-select';
const BusquedaLugarDespacho = () => import('../Busquedas/BusquedaLugarDespacho.vue');
const BusquedaClientePerseo = () => import('../Busquedas/BusquedaClientePerseo.vue');
const ConfigProforma = () => import('./ConfigProforma.vue');
const FacturacionInformacionInstitucion = () => import('@/views/pedidos2/pedidos/proforma/components/FacturacionInformacionInstitucion.vue');

export default {
    name: 'ProformaModal',
    components: {
        vSelect,
        BusquedaLugarDespacho,
        BusquedaClientePerseo,
        ConfigProforma,
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
        librosProformados: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        },
        modoEdicion: {
            type: Boolean,
            default: false
        },
        proformaEditarId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            popupProforma: this.visible,
            listaEmpresas: [],
            mostrarBusquedaLugar: false,
            mostrarBusquedaCliente: false,
            mostrarEditarInstitucion: false, // Modal para editar institución
            loadingStock: false,
            librosConStock: [],
            filtrarSoloConCantidad: false, // Nuevo estado para el filtro del listado
            
            // Panel de configuración
            mostrarConfigSidebar: false,
            configProforma: {
                permitirTodosLibros: false,
                permitirUsarStockMinimo: false
            },
            stockMinimo: 0, // Stock mínimo de seguridad
            ultimaNotificacionStockMinimo: 0, // Timestamp para evitar notificaciones duplicadas
            validacionTimers: {}, // Timers para debounce de validaciones
            
            // Para agregar libros extras
            libroExtra: {
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                resultadosBusqueda: [],
                indiceSeleccionado: 0
            },
            todosLosLibrosDisponibles: [], // Almacenará TODOS los libros disponibles cuando se activate la opción
            
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
            proformaData: {
                empresa: null,
                descuento: 0,
                observacion: '',
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
            proformaTotales: {
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
                ffp_descuento: '',
                if_distribuidor: false,
                nombreInstitucion: '',
                ciudad: ''
            }
        }
    },
    computed: {
        librosConStockFiltrados() {
            if (this.filtrarSoloConCantidad) {
                return this.librosConStock.filter(libro => 
                    libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
                );
            }
            return this.librosConStock;
        }
    },
    watch: {
        visible(newVal) {
            console.log('👀 Watcher visible ejecutado:', newVal);
            console.log('   - modoEdicion:', this.modoEdicion);
            console.log('   - proformaEditarId:', this.proformaEditarId);
            
            this.popupProforma = newVal;
            if (newVal) {
                this.cargarEmpresas();
                
                // Si es modo edición, cargar datos de la proforma
                if (this.modoEdicion && this.proformaEditarId) {
                    console.log('✅ Detectado modo EDICIÓN - Cargando datos de proforma...');
                    this.cargarDatosProforma();
                } else {
                    console.log('ℹ️  Modo CREACIÓN - Reseteando proforma...');
                    // Modo creación normal
                    this.resetearProforma();
                    // Calcular totales iniciales después de resetear
                    this.$nextTick(() => {
                        this.calcularTotalesProforma();
                        // Consultar stock cuando se abre el modal
                        if (this.librosPedido && this.librosPedido.length > 0) {
                            this.consultarStockLibros();
                        }
                    });
                }
            }
        },
        popupProforma(newVal) {
            this.$emit('update:visible', newVal);
        },
        librosProformados: {
            handler(newVal) {
                if (newVal && newVal.length > 0) {
                    this.actualizarCantidadesProformadas();
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        // Consultar stock mínimo
        this.consultarStockMinimo();
        
        // Consultar stock cuando el componente se monta y hay libros
        if (this.librosPedido && this.librosPedido.length > 0) {
            this.consultarStockLibros();
        }
    },
    methods: {
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
                this.stockMinimo = 300; // Valor por defecto si falla la consulta
            }
        },
        
        // ====================================
        // MÉTODO HELPER PARA NOTIFICACIONES
        // ====================================
        mostrarNotificacionStockMinimo(titulo, texto, color) {
            const ahora = Date.now();
            // Solo mostrar si han pasado al menos 500ms desde la última notificación
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
        revalidarTodasLasCantidades() {
            // Revalidar libros en la tabla principal que tengan cantidad ingresada
            this.librosConStock.forEach(libro => {
                if (libro.cantidadProforma && libro.cantidadProforma !== '') {
                    this.validarCantidadListado(libro);
                }
            });
            
            // Revalidar filas en el llenado rápido
            // IMPORTANTE: Al revalidar, forzar la sincronización independientemente del error
            this.filasCaptura.forEach((fila, index) => {
                if (fila.libroSeleccionado && fila.cantidad && fila.cantidad !== '') {
                    // Limpiar error anterior
                    fila.errorCantidad = '';
                    
                    const cantidad = parseInt(fila.cantidad);
                    const cantidadPedida = parseInt(fila.libroSeleccionado.cantidad) || 0;
                    const stockDisponible = fila.libroSeleccionado.stock || 0;
                    const stockRestante = stockDisponible - cantidad;
                    
                    // Validar cantidad pedida
                    if (cantidad > cantidadPedida) {
                        fila.errorCantidad = `No puede exceder lo pedido (${cantidadPedida})`;
                    }
                    // Validar stock disponible
                    else if (cantidad > stockDisponible) {
                        fila.errorCantidad = `Stock insuficiente (máx: ${stockDisponible})`;
                    }
                    // Validar stock mínimo SOLO si el permiso está DESACTIVADO
                    else if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                        fila.errorCantidad = `🔒 Bloqueo de stock mínimo (${this.stockMinimo})`;
                    }
                    
                    // SIEMPRE sincronizar al revalidar (para que la tabla se actualice)
                    this.sincronizarCantidadEnTabla(fila);
                }
            });
            
            // Mostrar notificación informativa
            if (this.configProforma.permitirUsarStockMinimo) {
                this.$vs.notify({
                    title: '✅ Stock Mínimo Habilitado',
                    text: 'Ahora puede usar cantidades que afecten el stock mínimo reservado',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check-circle',
                    time: 3000
                });
            } else {
                this.$vs.notify({
                    title: '🔒 Stock Mínimo Protegido',
                    text: 'Las cantidades que afecten el stock mínimo serán marcadas como error',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-shield',
                    time: 3000
                });
            }
        },
        
        // ====================================
        // MÉTODOS PARA PANEL DE CONFIGURACIÓN
        // ====================================
        handleConfigUpdate({ campo, valor }) {
            // Actualizar la configuración
            this.configProforma[campo] = valor;
            
            // Ejecutar acciones específicas según el campo
            if (campo === 'permitirTodosLibros') {
                this.onCambiarPermitirTodosLibros(valor);
            } else if (campo === 'permitirUsarStockMinimo') {
                this.revalidarTodasLasCantidades();
            }
        },
        
        toggleConfigSidebar() {
            this.mostrarConfigSidebar = !this.mostrarConfigSidebar;
        },
        
        async onCambiarPermitirTodosLibros(valor) {
            if (valor) {
                // Cuando se activa, cargar TODOS los libros disponibles
                await this.cargarTodosLosLibros();
                this.$vs.notify({
                    text: 'Ahora puede agregar libros extras que no están en el pedido',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            } else {
                // Cuando se desactiva, limpiar
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
            if (!this.proformaData.empresa) {
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
                
                // Obtener el ID del período desde el pedido seleccionado
                const idPeriodo = this.pedidoSeleccionado ? this.pedidoSeleccionado.id_periodo : null;
                
                if (!idPeriodo) {
                    throw new Error('No se pudo obtener el período del pedido');
                }
                
                // Consultar todos los libros disponibles para el período
                const response = await this.$http.get(
                    `${this.$server_url}get_val_pedidoLibrosObsequiosInfoTodoSinPedido_new?periodo=${idPeriodo}`
                );
                
                if (response.data && Array.isArray(response.data)) {
                    const librosConDatos = response.data.map(libro => ({
                        ...libro,
                        nombre_libro: libro.nombrelibro || libro.nombre_libro,
                        pro_codigo: libro.codigo_liquidacion || libro.pro_codigo,
                        precio: parseFloat(libro.precio || libro.pvp || 0),
                        stock: undefined // Se consultará después
                    }));
                    
                    // Consultar el stock de todos los libros
                    const codigosLibros = librosConDatos.map(l => l.pro_codigo);
                    
                    try {
                        const stockResponse = await this.$http.get(`${this.$server_url}consultar-stock-libros`, {
                            params: { codigos: codigosLibros }
                        });
                        
                        const stockData = stockResponse.data.status === 'success' && stockResponse.data.data 
                            ? stockResponse.data.data 
                            : stockResponse.data;
                        
                        // Asignar stock a cada libro
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
                        // Si falla la consulta de stock, usar los libros sin stock
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
            // Si hay resultados de búsqueda, manejar navegación
            if (this.libroExtra.resultadosBusqueda.length > 0) {
                // Flecha abajo (keyCode 40)
                if (event.keyCode === 40 || event.key === 'ArrowDown') {
                    event.preventDefault();
                    this.libroExtra.indiceSeleccionado = 
                        (this.libroExtra.indiceSeleccionado + 1) % this.libroExtra.resultadosBusqueda.length;
                }
                // Flecha arriba (keyCode 38)
                else if (event.keyCode === 38 || event.key === 'ArrowUp') {
                    event.preventDefault();
                    this.libroExtra.indiceSeleccionado = 
                        this.libroExtra.indiceSeleccionado === 0 
                            ? this.libroExtra.resultadosBusqueda.length - 1 
                            : this.libroExtra.indiceSeleccionado - 1;
                }
                // Enter (keyCode 13)
                else if (event.keyCode === 13 || event.key === 'Enter') {
                    event.preventDefault();
                    const libroSeleccionado = this.libroExtra.resultadosBusqueda[this.libroExtra.indiceSeleccionado];
                    this.seleccionarLibroExtra(libroSeleccionado);
                }
                // Escape (keyCode 27)
                else if (event.keyCode === 27 || event.key === 'Escape') {
                    event.preventDefault();
                    this.limpiarBusquedaLibroExtra();
                }
            }
            // Si ya hay un libro seleccionado y presiona Enter
            else if (event.keyCode === 13 || event.key === 'Enter') {
                if (this.libroExtra.libroSeleccionado && this.libroExtra.cantidad) {
                    event.preventDefault();
                    this.agregarLibroExtra();
                }
            }
            // Si presiona Escape, limpiar
            else if (event.keyCode === 27 || event.key === 'Escape') {
                event.preventDefault();
                this.limpiarBusquedaLibroExtra();
            }
        },
        
        buscarLibroExtra() {
            const texto = this.libroExtra.textoBusqueda.toLowerCase().trim();
            
            // Si el texto está vacío o es muy corto, limpiar resultados
            if (texto.length < 2) {
                this.libroExtra.resultadosBusqueda = [];
                return;
            }
            
            // Si hay un libro seleccionado y el texto coincide exactamente, no buscar
            if (this.libroExtra.libroSeleccionado && 
                this.libroExtra.libroSeleccionado.nombre_libro.toLowerCase() === texto) {
                this.libroExtra.resultadosBusqueda = [];
                return;
            }
            
            // Si se está editando un libro ya seleccionado, limpiar la selección
            if (this.libroExtra.libroSeleccionado && 
                this.libroExtra.libroSeleccionado.nombre_libro.toLowerCase() !== texto) {
                this.libroExtra.libroSeleccionado = null;
                this.libroExtra.cantidad = '';
            }
            
            // Obtener códigos de libros ya en el pedido/listado
            const codigosEnPedido = this.librosConStock.map(l => l.pro_codigo);
            
            // Separar palabras para búsqueda inteligente
            const palabrasBusqueda = texto.split(/\s+/).filter(p => p.length > 0);
            
            // PRIMERO: Verificar si hay coincidencias exactas en libros que YA ESTÁN en el listado
            const librosYaEnListado = this.todosLosLibrosDisponibles.filter(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                const estaEnPedido = codigosEnPedido.includes(libro.pro_codigo);
                
                if (!estaEnPedido) return false; // Solo queremos los que ya están
                
                // Verificar si coincide por código
                const coincideCodigo = codigo.includes(texto);
                
                // Verificar si todas las palabras están en el nombre
                const todasLasPalabrasEnNombre = palabrasBusqueda.every(palabra => 
                    nombreCompleto.includes(palabra)
                );
                
                return todasLasPalabrasEnNombre || coincideCodigo;
            });
            
            // Si hay libros que ya están en el listado, notificar al usuario
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
            
            // SEGUNDO: Buscar en todos los libros disponibles, excluyendo los que ya están en el pedido
            this.libroExtra.resultadosBusqueda = this.todosLosLibrosDisponibles.filter(libro => {
                const nombreCompleto = libro.nombre_libro.toLowerCase();
                const codigo = libro.pro_codigo.toLowerCase();
                const noEstaEnPedido = !codigosEnPedido.includes(libro.pro_codigo);
                
                // Verificar si coincide por código
                const coincideCodigo = codigo.includes(texto);
                
                // Verificar si todas las palabras están en el nombre
                const todasLasPalabrasEnNombre = palabrasBusqueda.every(palabra => 
                    nombreCompleto.includes(palabra)
                );
                
                return (todasLasPalabrasEnNombre || coincideCodigo) && noEstaEnPedido;
            })
            .map(libro => {
                // Calcular puntuación de relevancia
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
            .slice(0, 5); // Máximo 5 resultados
            
            // Resetear el índice seleccionado cuando hay nuevos resultados
            this.libroExtra.indiceSeleccionado = 0;
        },
        
        navegarResultadosLibroExtra(direccion) {
            if (this.libroExtra.resultadosBusqueda.length === 0) return;
            
            if (direccion === 'down') {
                this.libroExtra.indiceSeleccionado = 
                    (this.libroExtra.indiceSeleccionado + 1) % this.libroExtra.resultadosBusqueda.length;
            } else if (direccion === 'up') {
                this.libroExtra.indiceSeleccionado = 
                    this.libroExtra.indiceSeleccionado === 0 
                        ? this.libroExtra.resultadosBusqueda.length - 1 
                        : this.libroExtra.indiceSeleccionado - 1;
            }
        },
        
        seleccionarLibroExtraPorTeclado() {
            // Si hay resultados de búsqueda, seleccionar el libro del índice actual
            if (this.libroExtra.resultadosBusqueda.length > 0) {
                const libroSeleccionado = this.libroExtra.resultadosBusqueda[this.libroExtra.indiceSeleccionado];
                this.seleccionarLibroExtra(libroSeleccionado);
            } 
            // Si ya hay un libro seleccionado y cantidad, agregar el libro
            else if (this.libroExtra.libroSeleccionado && this.libroExtra.cantidad) {
                this.agregarLibroExtra();
            }
        },
        
        seleccionarLibroExtra(libro) {
            this.libroExtra.libroSeleccionado = libro;
            this.libroExtra.textoBusqueda = libro.nombre_libro;
            this.libroExtra.resultadosBusqueda = [];
            this.libroExtra.indiceSeleccionado = 0;
            
            // Enfocar el input de cantidad
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
            // Validaciones
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
            
            // Verificar que no exista ya en la lista
            const yaExiste = this.librosConStock.find(l => 
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
                // Consultar el stock del libro
                this.$vs.loading();
                const stockResponse = await me.$http.get(`${me.$server_url}consultar-stock-libros`, {
                    params: { codigos: this.libroExtra.libroSeleccionado.codigo_liquidacion }
                })
                console.log('Respuesta de stock:', stockResponse.data);
                
                // Verificar estructura de respuesta correctamente
                const stockData = stockResponse.data.status === 'success' && stockResponse.data.data ? stockResponse.data.data : stockResponse.data;
                const stockInfo = Array.isArray(stockData) ? stockData[0] : stockData;
                const stockDisponible = stockInfo && stockInfo.pro_reservar !== undefined ? stockInfo.pro_reservar : 0;
                
                console.log(`Stock disponible para ${this.libroExtra.libroSeleccionado.pro_codigo}:`, stockDisponible);

                // VALIDACIÓN DE STOCK MÍNIMO
                const cantidadSolicitada = parseInt(this.libroExtra.cantidad);
                const stockRestante = stockDisponible - cantidadSolicitada;
                
                // Si no hay suficiente stock
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
                
                // Si el stock restante es menor al mínimo y no se permite usar stock mínimo
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
                
                // Si el stock restante es menor al mínimo PERO se permite usar stock mínimo
                if (stockRestante < this.stockMinimo && this.configProforma.permitirUsarStockMinimo) {
                    // Mostrar advertencia pero permitir continuar
                    this.$vs.notify({
                        title: 'Advertencia: Stock Mínimo',
                        text: `Stock restante (${stockRestante}) será menor al mínimo (${this.stockMinimo})`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 4000
                    });
                }
                
                // Crear el objeto del libro extra con el formato correcto
                const libroNuevo = {
                    ...this.libroExtra.libroSeleccionado,
                    cantidad: 0, // Cantidad pedida (no aplica para extras)
                    cantidadProforma: this.libroExtra.cantidad.toString(),
                    stock: stockDisponible,
                    esLibroExtra: true // Marcador para identificar libros extras
                };
                
                // Agregar al INICIO de la lista
                this.librosConStock.unshift(libroNuevo);
                
                // SINCRONIZAR CON LLENADO RÁPIDO
                // Buscar si hay una fila vacía en filasCaptura
                const filaVacia = this.filasCaptura.find(fila => !fila.libroSeleccionado);
                
                if (filaVacia) {
                    // Si existe una fila vacía, usarla
                    filaVacia.libroSeleccionado = libroNuevo;
                    filaVacia.textoBusqueda = libroNuevo.nombre_libro;
                    filaVacia.cantidad = this.libroExtra.cantidad.toString();
                    filaVacia.confirmado = true;
                } else {
                    // Si no hay fila vacía, crear una nueva al inicio
                    this.filasCaptura.unshift({
                        textoBusqueda: libroNuevo.nombre_libro,
                        libroSeleccionado: libroNuevo,
                        cantidad: this.libroExtra.cantidad.toString(),
                        confirmado: true,
                        resultadosBusqueda: [],
                        sugerenciaActual: null
                    });
                }
                
                // Recalcular totales
                this.calcularTotalesProforma();
                
                this.$vs.loading.close();
                this.$vs.notify({
                    text: `Libro "${this.libroExtra.libroSeleccionado.pro_codigo}" agregado exitosamente`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                
                // Limpiar el formulario
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
            // Verifica si hay al menos un libro con la propiedad esLibroExtra
            return this.librosConStock.some(libro => libro.esLibroExtra === true);
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
                    // Eliminar de librosConStock
                    const indiceReal = this.librosConStock.findIndex(l => l.pro_codigo === libro.pro_codigo);
                    if (indiceReal !== -1) {
                        this.librosConStock.splice(indiceReal, 1);
                    }
                    
                    // SINCRONIZAR: Eliminar de filasCaptura en llenado rápido
                    const filaIndex = this.filasCaptura.findIndex(fila => 
                        fila.libroSeleccionado && fila.libroSeleccionado.pro_codigo === libro.pro_codigo
                    );
                    
                    if (filaIndex !== -1) {
                        // Si es la última fila, limpiarla en lugar de eliminarla
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
                            // Si hay más filas, eliminar esta
                            this.filasCaptura.splice(filaIndex, 1);
                        }
                    }
                    
                    // Recalcular totales
                    this.calcularTotalesProforma();
                    
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
        
        cerrarProforma() {
            this.popupProforma = false;
            this.resetearProforma();
            this.$emit('cerrar');
        },
        
        resetearProforma() {
            this.proformaData = {
                empresa: null,
                descuento: this.obtenerDescuentoInicialPedido(),
                observacion: '',
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
            this.proformaTotales = {
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
            
            // Resetear configuración de proforma
            this.mostrarConfigSidebar = false;
            this.configProforma = {
                permitirTodosLibros: false
            };
            
            // Limpiar datos de libro extra
            this.libroExtra = {
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                resultadosBusqueda: []
            };
            this.todosLosLibrosDisponibles = [];
            
            // Resetear arrays de gestión de libros
            this.filtrarSoloConCantidad = false; // Resetear el filtro
            this.filasCaptura = [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [],
                    sugerenciaActual: null
                }
            ];
            // Limpiar cantidades de proforma en la tabla principal
            if (this.librosConStock.length > 0) {
                this.librosConStock.forEach(libro => {
                    libro.cantidadProforma = '';
                });
            }
        },
        
        cargarEmpresas() {
            let me = this;
            me.listaEmpresas = [];
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data;
                    me.listaEmpresas = me.listaEmpresas.filter(empresa => empresa.id !== 2);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        
        async cargarDatosProforma() {
            let me = this;
            
            console.log('🔄 Cargando datos de proforma para editar:', me.proformaEditarId);
            
            me.$vs.loading({
                container: '#div-with-loading',
                scale: 0.6
            });
            
            try {
                const response = await me.$http.get(`${me.$server_url}get_proforma_para_editar`, {
                    params: { proforma_id: me.proformaEditarId }
                });
                
                if (response.data.status === 200) {
                    const datos = response.data.data;
                    const proforma = datos.proforma;
                    const detalles = datos.detalles;
                    
                    console.log('✅ Datos de proforma cargados:', proforma);
                    console.log('✅ Detalles de proforma:', detalles);
                    
                    // Cargar empresa (es el ID)
                    me.proformaData.empresa = proforma.emp_id;
                    console.log('Empresa cargada:', me.proformaData.empresa);
                    
                    // Cargar lugar de despacho
                    if (proforma.id_ins_depacho) {
                        me.proformaData.lugarDespacho = {
                            id_institucion: proforma.id_ins_depacho,
                            nombreInstitucion: proforma.despacho_nombre,
                            ruc: proforma.despacho_ruc,
                            ciudad: '',
                            datosInstitucion: []
                        };
                        console.log('Lugar de despacho cargado:', me.proformaData.lugarDespacho);
                    }
                    
                    // Cargar cliente Perseo
                    if (proforma.ven_cliente) {
                        me.proformaData.clientePerseo = {
                            idusuario: proforma.ven_cliente,
                            nombre: proforma.cliente_nombre,
                            cedula: proforma.cliente_cedula,
                            email: proforma.cliente_email,
                            clientesidPerseo: proforma.clientesidPerseo || 0
                        };
                        console.log('Cliente Perseo cargado:', me.proformaData.clientePerseo);
                    }
                    
                    // Cargar observaciones
                    me.proformaData.observacion = proforma.prof_observacion || '';
                    
                    // Cargar descuentos
                    me.proformaData.descuento = parseFloat(proforma.pro_des_por) || 0;
                    console.log('Descuento cargado:', me.proformaData.descuento);
                    
                    // Cargar libros con cantidades
                    me.librosConStock = detalles.map(detalle => {
                        // Buscar el libro original del pedido para obtener todos sus datos
                        const libroOriginal = me.librosPedido.find(l => l.pro_codigo === detalle.pro_codigo);
                        
                        // Si no existe en librosPedido (podría ser un libro extra), crear objeto básico
                        if (!libroOriginal) {
                            return {
                                pro_codigo: detalle.pro_codigo,
                                pro_nombre: detalle.pro_nombre,
                                nombre_libro: detalle.pro_nombre,
                                cantidad: parseInt(detalle.det_prof_cantidad),
                                cantidadProformada: 0,
                                precio: parseFloat(detalle.det_prof_valor_u),
                                stock: parseInt(detalle.stock_disponible) || 0,
                                pro_estado: null,
                                esLibroExtra: true
                            };
                        }
                        
                        // Si existe, combinar datos
                        return {
                            ...libroOriginal,
                            cantidad: parseInt(detalle.det_prof_cantidad),
                            cantidadProformada: 0,
                            precio: parseFloat(detalle.det_prof_valor_u),
                            stock: parseInt(detalle.stock_disponible) || 0,
                            pro_estado: null
                        };
                    });
                    
                    console.log('📚 Libros cargados:', me.librosConStock.length, 'libros');
                    
                    // Calcular totales
                    me.$nextTick(() => {
                        me.calcularTotalesProforma();
                        console.log('💰 Totales calculados:', me.proformaTotales);
                    });
                    
                } else {
                    throw new Error(response.data.message || 'Error al cargar proforma');
                }
                
            } catch (error) {
                console.error('❌ Error al cargar datos de proforma:', error);
                me.$vs.notify({
                    text: 'Error al cargar los datos de la proforma',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            } finally {
                me.$vs.loading.close();
            }
        },
        
        obtenerDescuentoInicialPedido() {
            // Buscar si hay un descuento promedio en los libros del pedido
            if (!this.librosPedido || this.librosPedido.length === 0) {
                return 0;
            }
            
            const totalDescuentos = this.librosPedido.reduce((sum, libro) => {
                return sum + (parseFloat(libro.descuento) || 0);
            }, 0);
            
            const promedioDescuento = totalDescuentos / this.librosPedido.length;
            
            // Retornar el promedio redondeado a 2 decimales
            return Math.round(promedioDescuento * 100) / 100;
        },
        
        seleccionarEmpresa(empresa) {
            // Limpiar cliente de Perseo si es necesario
            this.quitarClientePerseo();
            this.proformaData.empresa = empresa;
            this.validationErrors.empresa = '';
            this.calcularTotalesProforma();
        },
        
        // ========================================
        // MÉTODOS PARA VALIDACIONES DE VENTA POR LISTA
        // ========================================
        
        esVentaPorLista() {
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 2;
        },
        
        esVentaDirecta() {
            return this.pedidoSeleccionado && this.pedidoSeleccionado.tipo_venta == 1;
        },
        
        tieneCupoSuficiente() {
            if (!this.esVentaPorLista()) return true; // No aplica para venta directa
            
            const lugarDespacho = this.proformaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return false; // No tiene datos financieros
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            
            return cupoInicial > 0 && totalProforma <= cupoInicial;
        },
        
        obtenerCupoMaximo() {
            if (!this.esVentaPorLista()) return '0.00';
            
            const lugarDespacho = this.proformaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            return cupoInicial.toFixed(2);
        },
        
        calcularDiferenciaCupo() {
            if (!this.esVentaPorLista()) return '0.00';
            
            const lugarDespacho = this.proformaData.lugarDespacho;
            if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0) {
                return '0.00';
            }
            
            const cupoInicial = parseFloat(lugarDespacho.datosInstitucion[0].ffp_cupo) || 0;
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            
            // Retornar la diferencia absoluta
            const diferencia = Math.abs(cupoInicial - totalProforma);
            return diferencia.toFixed(2);
        },
        
        validarCupoParaVentaPorLista() {
            if (!this.esVentaPorLista()) return true; // No aplica para venta directa
            
            const lugarDespacho = this.proformaData.lugarDespacho;
            
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
            const totalProforma = this.calcularTotalesUnificados().total || 0;
            if (totalProforma > cupoInicial) {
                this.validationErrors.lugarDespacho = `⚠️ El total ($${totalProforma.toFixed(2)}) supera el cupo disponible ($${cupoInicial.toFixed(2)})`;
                return false;
            }
            
            this.validationErrors.lugarDespacho = '';
            return true;
        },
        
        calcularTotalesProforma() {
            // Usar el nuevo método de cálculo unificado
            const totalesProforma = this.calcularTotalesUnificados();
            
            this.proformaTotales = {
                subtotal: totalesProforma.subtotal.toFixed(2),
                descuento: totalesProforma.descuentoMonto.toFixed(2),
                subtotalConDescuento: totalesProforma.subtotalConDescuento.toFixed(2),
                iva: '0.00', // Siempre 0 según requerimiento
                transporte: '0.00', // Siempre 0 según requerimiento
                total: totalesProforma.subtotalConDescuento.toFixed(2) // Total = Subtotal - Descuento (sin IVA ni transporte)
            };
            
            // Validar cupo para venta por lista cuando cambien los totales
            if (this.esVentaPorLista() && this.proformaData.lugarDespacho.nombreInstitucion) {
                this.validarCupoParaVentaPorLista();
            }
        },
        
        calcularTotalesUnificados() {
            // Obtener solo libros con cantidad para la proforma (evita duplicados)
            const librosParaProforma = this.librosConStock.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            // Calcular subtotal de todos los libros con cantidad
            const subtotal = librosParaProforma.reduce((total, libro) => {
                const precio = parseFloat(libro.precio) || 0;
                const cantidad = parseInt(libro.cantidadProforma) || 0;
                return total + (precio * cantidad);
            }, 0);
            
            // Aplicar descuento
            const descuentoPorcentaje = parseFloat(this.proformaData.descuento) || 0;
            const descuentoMonto = subtotal * (descuentoPorcentaje / 100);
            const subtotalConDescuento = subtotal - descuentoMonto;
            
            // IVA y transporte siempre son 0 según requerimiento
            const iva = 0;
            const transporte = 0;
            const total = subtotalConDescuento + iva + transporte; // = subtotalConDescuento
            
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
            const precio = parseFloat(libro.precio) || 0;
            const cantidad = parseInt(libro.cantidadProforma) || 0;
            return (precio * cantidad).toFixed(2);
        },
        
        calcularSubtotalFila(fila) {
            if (!fila.libroSeleccionado || !fila.cantidad || parseInt(fila.cantidad) === 0) {
                return '0.00';
            }
            const precio = parseFloat(fila.libroSeleccionado.precio) || 0;
            const cantidad = parseInt(fila.cantidad) || 0;
            return (precio * cantidad).toFixed(2);
        },
        
        // Métodos para búsquedas
        abrirBusquedaLugar() {
            this.mostrarBusquedaLugar = true;
        },
        
        cerrarBusquedaLugar() {
            this.mostrarBusquedaLugar = false;
        },
        
        abrirEditarInstitucion() {
            if (!this.proformaData.lugarDespacho.id_institucion) {
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
            this.proformaData.lugarDespacho = lugar;
            this.validationErrors.lugarDespacho = '';
            
            // NUEVA LÓGICA: Consultar si existe cupo para este lugar de despacho
            this.consultarCupoLugarDespacho();
            
            // Recalcular totales después de asignar lugar
            this.calcularTotalesProforma();
        },
        
        // Nuevo método para consultar el cupo del lugar de despacho
        async consultarCupoLugarDespacho() {
            const idInstitucion = this.proformaData.lugarDespacho.id_institucion;
            
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
                
                if (res.data.success && res.data.data) {
                    // ✅ Cupo encontrado - actualizar datosInstitucion
                    this.proformaData.lugarDespacho.datosInstitucion = [res.data.data];
                    
                    console.log('✅ Cupo encontrado para el lugar de despacho:', res.data.data);
                    
                    // Si es venta por lista, aplicar automáticamente el descuento
                    if (this.esVentaPorLista()) {
                        const descuentoLugar = parseFloat(res.data.data.ffp_descuento) || 0;
                        this.proformaData.descuento = descuentoLugar;
                        
                        this.$vs.notify({
                            text: `Descuento del lugar de despacho aplicado: ${descuentoLugar}%`,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        });
                    }
                } else {
                    // ⚠️ No existe cupo - limpiar datosInstitucion
                    this.proformaData.lugarDespacho.datosInstitucion = [];
                    console.log('⚠️ No se encontró cupo configurado para este lugar');
                    
                    // Si es venta por lista, aplicar descuento inicial del pedido
                    if (this.esVentaPorLista()) {
                        this.proformaData.descuento = this.obtenerDescuentoInicialPedido();
                    }
                }
                
                // Recalcular totales después de obtener el cupo
                this.calcularTotalesProforma();
            } catch (error) {
                console.error('Error al consultar cupo:', error);
                this.proformaData.lugarDespacho.datosInstitucion = [];
            }
        },
        
        quitarLugarDespacho() {
            this.proformaData.lugarDespacho = {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
                datosInstitucion: []
            };
            
            // Si es venta por lista, resetear el descuento al valor inicial del pedido
            if (this.esVentaPorLista()) {
                this.proformaData.descuento = this.obtenerDescuentoInicialPedido();
                
                this.$vs.notify({
                    text: 'Lugar de despacho eliminado. Descuento restablecido.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
            
            // Recalcular totales
            this.calcularTotalesProforma();
        },
        
        abrirBusquedaCliente() {
            if (!this.proformaData.empresa) {
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
            if (!this.proformaData.lugarDespacho.nombreInstitucion) {
                this.$vs.notify({
                    text: 'Debe seleccionar un lugar de despacho primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            
            const idInstitucion = this.proformaData.lugarDespacho.id_institucion;
            
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
                    
                    if (res.data.success && res.data.data) {
                        // Editar: Formulario existe, cargar datos
                        this.formularioCupoData = {
                            ffp_id: res.data.data.ffp_id,
                            idInstitucion: res.data.data.idInstitucion,
                            idperiodoescolar: res.data.data.idperiodoescolar,
                            ffp_credito: res.data.data.ffp_credito,
                            ffp_cupo: res.data.data.ffp_cupo,
                            ffp_descuento: res.data.data.ffp_descuento,
                            if_distribuidor: res.data.data.if_distribuidor === 1,
                            nombreInstitucion: res.data.data.nombreInstitucion || this.proformaData.lugarDespacho.nombreInstitucion,
                            ciudad: res.data.data.ciudad || this.proformaData.lugarDespacho.ciudad
                        };
                        this.showFormularioCupo = true;
                        
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
                            nombreInstitucion: this.proformaData.lugarDespacho.nombreInstitucion,
                            ciudad: this.proformaData.lugarDespacho.ciudad
                        };
                        this.showFormularioCupo = true;
                        
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
                        nombreInstitucion: this.proformaData.lugarDespacho.nombreInstitucion,
                        ciudad: this.proformaData.lugarDespacho.ciudad
                    };
                    this.showFormularioCupo = true;
                });
        },
        
        guardarFormularioCupo() {
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
                    
                    console.log('Respuesta del servidor al guardar cupo:', res.data);
                    
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
            this.proformaData.clientePerseo = cliente;
            this.validationErrors.clientePerseo = '';
        },
        
        quitarClientePerseo() {
            this.proformaData.clientePerseo = {
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
            if (!this.proformaData.empresa) {
                this.validationErrors.empresa = 'Debe seleccionar una empresa';
                errores.push('Debe seleccionar una empresa');
                if (!primerCampoConError) primerCampoConError = 'inputEmpresa';
                isValid = false;
            }
            
            // 2. Validar descuento (debe ser numérico, no vacío, 0 o mayor)
            const descuento = this.proformaData.descuento;
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
            
            // 3. Validar observación (debe tener contenido)
            if (!this.proformaData.observacion || this.proformaData.observacion.trim() === '') {
                errores.push('Debe ingresar una observación');
                if (!primerCampoConError) primerCampoConError = 'inputObservacion';
                isValid = false;
            }
            
            // 4. Validar lugar de despacho
            if (!this.proformaData.lugarDespacho.nombreInstitucion) {
                this.validationErrors.lugarDespacho = 'Debe seleccionar un lugar de despacho';
                errores.push('Debe seleccionar un lugar de despacho');
                if (!primerCampoConError) primerCampoConError = 'btnLugarDespacho';
                isValid = false;
            }
            
            // 5. Validar cliente Perseo
            if (!this.proformaData.clientePerseo.nombre) {
                this.validationErrors.clientePerseo = 'Debe seleccionar un cliente de Perseo';
                errores.push('Debe seleccionar un cliente de Perseo');
                if (!primerCampoConError) primerCampoConError = 'btnClientePerseo';
                isValid = false;
            }
            
            // 6. Validar que tenga al menos una cantidad seleccionada
            const tieneCantidades = this.librosConStock.some(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            );
            
            if (!tieneCantidades) {
                errores.push('Debe ingresar al menos una cantidad de libro');
                isValid = false;
            }
            
            // 7. Validar que no haya errores de validación en las cantidades ingresadas
            const tieneErroresEnCantidades = this.librosConStock.some(libro => 
                libro.errorStockMinimo && libro.errorStockMinimo !== ''
            );
            
            if (tieneErroresEnCantidades) {
                errores.push('Hay errores en las cantidades ingresadas. Por favor corríjalos antes de guardar');
                isValid = false;
            }
            
            // También validar errores en la tabla de llenado rápido
            const tieneErroresEnRapida = this.filasCaptura.some(fila => 
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
            const camposBasicosCompletos = this.proformaData.empresa && 
                   this.proformaData.lugarDespacho.nombreInstitucion && 
                   this.proformaData.clientePerseo.nombre;
            
            // Para venta por lista, validar también el cupo
            if (this.esVentaPorLista()) {
                return camposBasicosCompletos && this.tieneCupoSuficiente();
            }
            
            return camposBasicosCompletos;
        },
        
        generarProforma() {
            // Consolidar todas las validaciones en un array de errores
            let errores = [];
            
            // 1. Validar campos básicos
            if (!this.proformaData.empresa) {
                errores.push('Debe seleccionar una empresa');
            }
            
            if (!this.proformaData.lugarDespacho.nombreInstitucion) {
                errores.push('Debe seleccionar un lugar de despacho');
            }
            
            if (!this.proformaData.clientePerseo.nombre) {
                errores.push('Debe seleccionar un cliente de Perseo');
            }
            
            // 2. Validar observación
            if (this.proformaData.observacion && this.proformaData.observacion.length > 200) {
                errores.push('La observación no puede exceder los 200 caracteres');
            }
            
            // 3. Validar que tenga libros con cantidad
            const librosParaProforma = this.obtenerLibrosParaProforma();
            if (librosParaProforma.length === 0) {
                errores.push('Debe especificar al menos un libro con cantidad para la proforma');
            }
            
            // 4. Validar errores de stock en cantidades
            const tieneErroresStock = this.librosConStock.some(libro => 
                libro.errorStockMinimo && libro.errorStockMinimo !== ''
            );
            
            if (tieneErroresStock) {
                errores.push('Hay errores en las cantidades ingresadas. Por favor corríjalos antes de guardar');
            }
            
            // 5. Validaciones específicas para venta por lista
            if (this.esVentaPorLista()) {
                const lugarDespacho = this.proformaData.lugarDespacho;
                
                // Verificar que tenga cupo configurado
                if (!lugarDespacho.datosInstitucion || lugarDespacho.datosInstitucion.length === 0 || !lugarDespacho.datosInstitucion[0].ffp_cupo) {
                    errores.push('El lugar de despacho no tiene cupo configurado');
                }
                
                // Verificar que no supere el cupo
                if (!this.tieneCupoSuficiente()) {
                    const cupoInicial = parseFloat(
                        lugarDespacho.datosInstitucion && lugarDespacho.datosInstitucion[0] 
                            ? lugarDespacho.datosInstitucion[0].ffp_cupo 
                            : 0
                    ) || 0;
                    const totalProforma = this.calcularTotalesUnificados().total || 0;
                    errores.push(`El total ($${totalProforma.toFixed(2)}) supera el cupo disponible ($${cupoInicial.toFixed(2)})`);
                }
            }
            
            // 6. Validar stock insuficiente
            const tieneStockInsuficiente = librosParaProforma.some(libro => {
                const stock = parseInt(libro.stock) || 0;
                const cantidad = parseInt(libro.cantidadProforma) || 0;
                return cantidad > stock;
            });
            
            if (tieneStockInsuficiente) {
                const librosConProblema = librosParaProforma.filter(libro => {
                    const stock = parseInt(libro.stock) || 0;
                    const cantidad = parseInt(libro.cantidadProforma) || 0;
                    return cantidad > stock;
                });
                
                const cantidadProblemas = librosConProblema.length;
                errores.push(`Hay ${cantidadProblemas} libro${cantidadProblemas > 1 ? 's' : ''} con stock insuficiente`);
            }
            
            // Si hay errores, mostrar UNA SOLA alerta con todos consolidados
            if (errores.length > 0) {
                const tituloAlerta = errores.length === 1 ? 'Validación de Proforma' : 'Hay errores en las cantidades ingresadas';
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
            
            // Si todo está correcto, continuar con la generación
            // Preparar los datos para enviar al backend
            const me = this;
            const formData = new FormData();
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            
            // Preparar el array de libros en el formato esperado por el backend
            const librosParaEnviar = librosParaProforma.map(libro => ({
                det_prof_id: '',
                pro_codigo: libro.pro_codigo,
                nombre_libro: libro.nombre_libro,
                det_prof_cantidad: libro.cantidadProforma,
                det_prof_valor_u: libro.precio, // Cambiar a det_prof_valor_u
                subtotal: (libro.cantidadProforma * libro.precio).toFixed(2),
                stock: libro.stock,
                cantidad: libro.cantidad || 0,
                esLibroExtra: libro.esLibroExtra || false
            }));
            
            // CONSOLE LOG COMPLETO PARA REVISIÓN
            console.log('═══════════════════════════════════════════════════════');
            console.log('📋 DATOS DE LA PROFORMA PARA GUARDAR');
            console.log('═══════════════════════════════════════════════════════');
            console.log('');
            console.log('🏢 EMPRESA:');
            console.log('   - ID:', me.proformaData.empresa.idEmpresa);
            console.log('   - Nombre:', me.proformaData.empresa);
            console.log('');
            console.log('📝 DATOS GENERALES:');
            console.log('   - ID Pedido:', me.pedidoSeleccionado.id_pedido);
            console.log('   - Contrato:', me.pedidoSeleccionado.contrato_generado);
            console.log('   - ID Período:', me.pedidoSeleccionado.id_periodo);
            console.log('   - Tipo Venta:', me.pedidoSeleccionado.tipo_venta === 1 ? 'Directa' : 'Por Lista');
            console.log('   - Descuento:', me.proformaData.descuento + '%');
            console.log('   - Observación:', me.proformaData.observacion);
            console.log('');
            console.log('📍 LUGAR DE DESPACHO:');
            console.log('   - ID Institución:', me.proformaData.lugarDespacho.id_institucion);
            console.log('   - Nombre:', me.proformaData.lugarDespacho.nombreInstitucion);
            console.log('   - Ciudad:', me.proformaData.lugarDespacho.ciudad);
            console.log('');
            console.log('👤 CLIENTE PERSEO:');
            console.log('   - ID Cliente:', me.proformaData.clientePerseo.clientesidPerseo);
            console.log('   - Nombre:', me.proformaData.clientePerseo.nombre);
            console.log('   - Cédula:', me.proformaData.clientePerseo.cedula);
            console.log('   - Email:', me.proformaData.clientePerseo.email);
            console.log('');
            console.log('📚 LIBROS (' + librosParaEnviar.length + ' items):');
            librosParaEnviar.forEach((libro, index) => {
                console.log('   ' + (index + 1) + '. ' + libro.pro_codigo + ' - ' + libro.nombre_libro);
                console.log('      Cantidad: ' + libro.det_prof_cantidad + ' | Precio: $' + libro.det_prof_valor_u + ' | Subtotal: $' + libro.subtotal);
                if (libro.esLibroExtra) {
                    console.log('      ⚠️ LIBRO EXTRA');
                }
            });
            console.log('');
            console.log('💰 TOTALES:');
            console.log('   - Subtotal:', '$' + me.proformaTotales.subtotal);
            console.log('   - Descuento:', '$' + me.proformaTotales.descuento);
            console.log('   - Subtotal con Desc.:', '$' + me.proformaTotales.subtotalConDescuento);
            console.log('   - IVA:', '$' + me.proformaTotales.iva);
            console.log('   - Transporte:', '$' + me.proformaTotales.transporte);
            console.log('   - TOTAL:', '$' + me.proformaTotales.total);
            console.log('═══════════════════════════════════════════════════════');
            
            // Construir FormData con los datos de ProformaModal
            formData.append("data_detalle", JSON.stringify(librosParaEnviar));
            formData.append("usu_codigo", parseInt(usuarioObjeto.idusuario));
            
            // Datos del pedido
            formData.append("pedido_id", parseInt(me.pedidoSeleccionado.id_pedido));
            formData.append("idPuntoventa", '');
            
            // CONTRATO - Campo importante que se guarda en f_proforma y f_detalle_proforma
            formData.append("contrato", me.pedidoSeleccionado.contrato_generado);
            
            // Si es modo edición, agregar el ID de la proforma a editar
            if (me.modoEdicion && me.proformaEditarId) {
                formData.append("proforma_id", parseInt(me.proformaEditarId));
            }
            
            // Datos de la proforma
            formData.append("prof_id", ''); // Vacío porque es nueva proforma (o se mantiene si es edición)
            formData.append("prof_observacion", me.proformaData.observacion);
            formData.append("prof_observacion_libreria", '');
            formData.append("emp_id", parseInt(me.proformaData.empresa)); // ID de la empresa seleccionada
            formData.append("pro_des_por", me.proformaData.descuento);
            formData.append("prof_iva", parseFloat(me.proformaTotales.iva));
            formData.append("prof_iva_por", 0);
            formData.append("prof_descuento", parseFloat(me.proformaTotales.descuento));
            formData.append("prof_total", parseFloat(me.proformaTotales.total));
            formData.append("prof_com", 0); // Comisión (0 por defecto)
            
            // Cliente Perseo
            formData.append("clientesidPerseo", me.proformaData.clientePerseo.clientesidPerseo);
            
            // Cliente (idusuario del cliente de Perseo)
            formData.append("ven_cliente", me.proformaData.clientePerseo.idusuario);
            
            // Despacho
            formData.append("id_ins_depacho", me.proformaData.lugarDespacho.id_institucion);
            
            // Estado y tipo
            formData.append("prof_estado", 1); // Estado por defecto
            formData.append("prof_tipo_proforma", 1); // Tipo por defecto
            
            // Fecha y usuario
            formData.append("created_at", this.obtenerFechaActual());
            formData.append('iniciales', usuarioObjeto.iniciales);
            formData.append('id_group', usuarioObjeto.id_group);
            
            console.log('📤 ENVIANDO AL BACKEND...');
            console.log('═══════════════════════════════════════════════════════');
            
            // Enviar al backend usando el nuevo endpoint específico para ProformaModal
            me.$vs.loading();
            this.$http.post(this.$server_url + "Proforma_Guardar_Desde_Modal", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.status === 200) {
                        const mensajeExito = me.modoEdicion 
                            ? 'Proforma actualizada exitosamente' 
                            : 'Proforma generada exitosamente';
                        
                        me.$vs.notify({
                            text: res.data.message || mensajeExito,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        
                        // Emitir evento para cerrar modal y actualizar lista
                        me.$emit('generar-proforma', res.data);
                        me.$emit('cerrar');
                    } else if (res.status === 500) {
                        me.$vs.notify({
                            text: res.data.message || 'Error al generar proforma',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.error('Error al guardar proforma:', error);
                    me.$vs.notify({
                        text: "No se pudo guardar la proforma. Por favor intente nuevamente",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
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
        consultarStockLibros() {
            let me = this;
            
            if (!me.librosPedido || me.librosPedido.length === 0) {
                me.librosConStock = [];
                return;
            }
            
            // Preparar array con libros y inicializar stock
            me.librosConStock = me.librosPedido.map(libro => ({
                ...libro,
                stock: undefined, // Inicializar como undefined para mostrar "Consultando..."
                cantidadProforma: '', // Campo para cantidad en proforma
                cantidadProformada: 0 // Cantidad ya proformada (se cargará después)
            }));
            
            // Obtener códigos únicos
            const codigosUnicos = [...new Set(me.librosPedido.map(libro => libro.pro_codigo))];
            
            console.log('Códigos únicos para consultar stock:', codigosUnicos);
            
            // Consultar el stock desde el backend
            me.loadingStock = true;
            
            me.$http.get(`${me.$server_url}consultar-stock-libros`, {
                params: { codigos: codigosUnicos }
            })
            .then(res => {
                me.loadingStock = false;
                
                if (res.data.status === 'success') {
                    const stockData = res.data.data;
                    
                    me.librosConStock = me.librosConStock.map(libro => {
                        const stockInfo = stockData.find(item => item.pro_codigo === libro.pro_codigo);
                        return {
                            ...libro,
                            stock: stockInfo ? stockInfo.pro_reservar : 0,
                            pro_nombre: stockInfo ? stockInfo.pro_nombre : libro.pro_nombre,
                            pro_estado: stockInfo ? stockInfo.pro_estado : null
                        };
                    });
                    
                    // Actualizar cantidades proformadas después de tener el stock
                    me.$nextTick(() => {
                        me.actualizarCantidadesProformadas();
                    });
                } else {
                    me.$vs.notify({
                        text: res.data.message || 'Error al consultar el stock',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
            })
            .catch(err => {
                me.loadingStock = false;
                console.error('Error al consultar stock:', err);
                me.$vs.notify({
                    text: 'Error al consultar el stock',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },
        
        obtenerColorStock(libro) {
            if (libro.stock === undefined) return 'dark';
            if (libro.stock === 0) return 'danger';
            
            // Obtener la cantidad solicitada (puede ser cantidadProforma o cantidad)
            const cantidadSolicitada = parseInt(libro.cantidadProforma || libro.cantidad || 0);
            const stockRestante = libro.stock - cantidadSolicitada;
            
            // Si no hay suficiente stock para la solicitud
            if (libro.stock < cantidadSolicitada) return 'danger';
            
            // Si el stock restante es menor al mínimo
            if (stockRestante < this.stockMinimo) {
                // Si NO se permite usar stock mínimo, mostrar en rojo
                if (!this.configProforma.permitirUsarStockMinimo) {
                    return 'danger';
                }
                // Si SÍ se permite, mostrar en amarillo (advertencia)
                return 'warning';
            }
            
            // Si el stock restante está cerca del mínimo (dentro de 20%)
            if (stockRestante < this.stockMinimo * 1.2) {
                return 'warning';
            }
            
            // Stock suficiente
            return 'success';
        },
        
        // obtenerEstadoStock(libro) {
        //     if (libro.stock === undefined) return 'Consultando';
        //     if (libro.stock === 0) return 'Sin Stock';
        //     if (libro.stock < libro.cantidad) return 'Stock Insuficiente';
        //     return 'Stock OK';
        // },
        
        obtenerColorEstado(libro) {
            // Usar la misma lógica que obtenerColorStock para consistencia
            return this.obtenerColorStock(libro);
        },
        
        obtenerTooltipStock(libro) {
            if (libro.stock === undefined) {
                return 'Consultando stock...';
            }
            
            const cantidadSolicitada = parseInt(libro.cantidadProforma || libro.cantidad || 0);
            const stockRestante = libro.stock - cantidadSolicitada;
            
            let texto = `Stock: ${libro.stock}`;
            
            if (cantidadSolicitada > 0) {
                texto += ` | Solicitado: ${cantidadSolicitada} | Restante: ${stockRestante}`;
            }
            
            texto += ` | Mínimo: ${this.stockMinimo}`;
            
            // Mensaje de estado
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
        
        // ========================================
        // MÉTODOS PARA GESTIÓN SIMPLIFICADA DE LIBROS
        // ========================================
        
        contarLibrosConCantidad() {
            return this.librosConStock.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            ).length;
        },
        
        obtenerLibrosParaProforma() {
            return this.librosConStock.filter(libro => 
                libro.cantidadProforma && parseInt(libro.cantidadProforma) > 0
            ).map(libro => ({
                ...libro,
                cantidadProforma: parseInt(libro.cantidadProforma)
            }));
        },
        
        // ========================================
        // MÉTODOS PARA CAPTURA SÚPER RÁPIDA
        // ========================================
        
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
        
        // Nuevo método para validar cantidad y sincronizar
        validarYSincronizarCantidad(fila, index) {
            // Limpiar error previo
            fila.errorCantidad = '';
            
            // Si la cantidad está vacía, permitir temporalmente
            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                this.sincronizarCantidadEnTabla(fila);
                return;
            }
            
            // Convertir a número y validar
            const cantidad = parseInt(fila.cantidad);
            
            // Validar que no sea 0 o negativo
            if (cantidad <= 0) {
                fila.errorCantidad = 'La cantidad debe ser mayor a 0';
                return;
            }
            
            // Si hay libro seleccionado, validar contra stock
            if (fila.libroSeleccionado) {
                const cantidadPedida = parseInt(fila.libroSeleccionado.cantidad) || 0;
                const esLibroExtra = fila.libroSeleccionado.esLibroExtra === true;
                
                // Validar cantidad pedida SOLO si NO es libro extra
                if (!esLibroExtra && cantidad > cantidadPedida) {
                    fila.errorCantidad = `No puede exceder lo pedido (${cantidadPedida})`;
                    return;
                }
                
                // Validar stock disponible (aplica para todos)
                if (cantidad > fila.libroSeleccionado.stock) {
                    fila.errorCantidad = `Stock insuficiente (máx: ${fila.libroSeleccionado.stock})`;
                    return;
                }
                
                // Validar stock mínimo SOLO si el permiso está DESACTIVADO (aplica para todos)
                const stockRestante = fila.libroSeleccionado.stock - cantidad;
                if (stockRestante < this.stockMinimo && !this.configProforma.permitirUsarStockMinimo) {
                    fila.errorCantidad = `🔒 Protege stock mínimo (${this.stockMinimo})`;
                    // NO sincronizar si no tiene permiso
                    return;
                }
            }
            
            // Si todo está bien O si tiene permiso para usar stock mínimo, sincronizar
            this.sincronizarCantidadEnTabla(fila);
        },
        
        // Nuevo método para validación final al perder el foco
        validarCantidadFinal(fila, index) {
            if (fila.cantidad && parseInt(fila.cantidad) <= 0) {
                fila.cantidad = '';
                fila.errorCantidad = '';
                this.sincronizarCantidadEnTabla(fila);
            }
            
            // Solo verificar eliminación si realmente está vacía
            if (!fila.libroSeleccionado && (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') && (!fila.cantidad || fila.cantidad.toString().trim() === '')) {
                this.verificarYEliminarFilasVacias();
            }
        },
        
        // Nuevo método para eliminar filas vacías (excepto la primera)
        verificarYEliminarFilasVacias() {
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
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                return;
            }
            
            // Si hay un libro seleccionado y el texto coincide exactamente, no buscar
            if (fila.libroSeleccionado && 
                fila.libroSeleccionado.nombre_libro.toLowerCase() === texto) {
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                return;
            }
            
            // Si se está editando un libro ya seleccionado, limpiar la selección
            if (fila.libroSeleccionado && 
                fila.libroSeleccionado.nombre_libro.toLowerCase() !== texto) {
                fila.libroSeleccionado = null;
                fila.cantidad = '';
                fila.confirmado = false;
            }
            
            // Obtener códigos de libros ya seleccionados en otras filas
            const codigosSeleccionados = this.filasCaptura
                .filter((f, i) => i !== index && f.libroSeleccionado)
                .map(f => f.libroSeleccionado.pro_codigo);
            
            // Separar palabras para búsqueda inteligente
            const palabrasBusqueda = texto.split(/\s+/).filter(p => p.length > 0);
            
            // Buscar en la lista de libros con stock, excluyendo duplicados
            fila.resultadosBusqueda = this.librosConStock.filter(libro => {
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
                fila.sugerenciaActual = fila.resultadosBusqueda[0];
            } else {
                fila.sugerenciaActual = null;
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
            fila.confirmado = true; // Automáticamente confirmado al seleccionar
            
            // Sincronizar con la tabla principal - buscar el libro y actualizar su cantidad
            const libroEnTabla = this.librosConStock.find(l => l.pro_codigo === libro.pro_codigo);
            if (libroEnTabla) {
                libroEnTabla.cantidadProforma = '';
            }
            
            // Enfocar el input de cantidad después de un pequeño delay
            this.$nextTick(() => {
                setTimeout(() => {
                    this.enfocarSiguienteInput(index, 'cantidad');
                }, 100);
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
        
        
        limpiarFilaCaptura(fila, index) {
            // Limpiar cantidad en tabla principal si existe libro seleccionado
            if (fila.libroSeleccionado) {
                const libroEnTabla = this.librosConStock.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                if (libroEnTabla) {
                    libroEnTabla.cantidadProforma = '';
                }
            }
            
            // Si es la primera fila (index 0), solo limpiar contenido
            if (index === 0) {
                fila.textoBusqueda = '';
                fila.libroSeleccionado = null;
                fila.cantidad = '';
                fila.confirmado = false;
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                fila.errorCantidad = '';
                
                // Enfocar el input de búsqueda después de limpiar
                this.$nextTick(() => {
                    setTimeout(() => {
                        const inputs = this.$el.querySelectorAll('.captura-rapida-container input[type="text"]');
                        if (inputs[0]) {
                            inputs[0].focus();
                        }
                    }, 100);
                });
            } else {
                // Si no es la primera fila, eliminar completamente la fila
                this.filasCaptura.splice(index, 1);
            }
            
            // Limpiar filas vacías adicionales después de cualquier eliminación
            this.$nextTick(() => {
                this.verificarYEliminarFilasVacias();
            });
            
            // Recalcular totales después de limpiar/eliminar
            this.calcularTotalesProforma();
        },
        
        // ========================================
        // MÉTODOS DE SINCRONIZACIÓN ENTRE TABLAS
        // ========================================
        
        sincronizarCantidadEnRapida(libro) {
            // Cuando cambia la cantidad en la tabla principal, actualizar en captura rápida
            const cantidad = libro.cantidadProforma;
            
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
                let filaVacia = this.filasCaptura.find(fila => !fila.libroSeleccionado);
                
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
            this.calcularTotalesProforma();
        },
        
        sincronizarCantidadEnTabla(fila) {
            // Cuando cambia la cantidad en captura rápida, actualizar en la tabla principal
            if (fila.libroSeleccionado) {
                const libroEnTabla = this.librosConStock.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                if (libroEnTabla) {
                    // Si la cantidad está vacía, es 0 o negativa, limpiar en la tabla también
                    if (!fila.cantidad || fila.cantidad.toString().trim() === '' || parseInt(fila.cantidad) <= 0) {
                        libroEnTabla.cantidadProforma = '';
                    } else {
                        // Solo sincronizar si la cantidad es válida
                        const cantidad = parseInt(fila.cantidad);
                        if (cantidad > 0) {
                            libroEnTabla.cantidadProforma = cantidad.toString();
                        }
                    }
                }
            }
            
            // Recalcular totales
            this.calcularTotalesProforma();
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
            const esLibroExtra = filaActual.libroSeleccionado.esLibroExtra === true;
            
            // VALIDACIÓN: Solo validar cantidad pedida si NO es libro extra
            if (!esLibroExtra && cantidadSolicitada > cantidadPedida) {
                filaActual.errorCantidad = `No puede exceder lo pedido (${cantidadPedida})`;
                this.$vs.notify({
                    title: '⚠️ Cantidad Excedida',
                    text: `La cantidad máxima para "${filaActual.libroSeleccionado.nombre_libro}" es ${cantidadPedida}`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    time: 4000
                });
                return;
            }
            
            // VALIDACIÓN DE STOCK DISPONIBLE (aplica para todos)
            const stockDisponible = filaActual.libroSeleccionado.stock || 0;
            const stockRestante = stockDisponible - cantidadSolicitada;
            
            // Si no hay suficiente stock
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
            
            // VALIDACIÓN DE STOCK MÍNIMO (aplica para todos)
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
            
            // Limpiar error si existe
            filaActual.errorCantidad = '';
            
            // Sincronizar la cantidad con la tabla
            this.sincronizarCantidadEnTabla(filaActual);
            
            // Si todo está correcto, avanzar al siguiente libro
            let siguienteFila = this.filasCaptura.findIndex((fila, i) => 
                i > index && !fila.libroSeleccionado
            );
            
            // Si no hay fila vacía, agregar una nueva
            if (siguienteFila === -1) {
                this.agregarFilaCaptura();
                siguienteFila = this.filasCaptura.length - 1;
            }
            
            // Enfocar el input de búsqueda de la siguiente fila
            this.$nextTick(() => {
                setTimeout(() => {
                    const inputs = this.$el.querySelectorAll('.captura-rapida-container input[type="text"]');
                    if (inputs[siguienteFila]) {
                        inputs[siguienteFila].focus();
                    }
                }, 100);
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
        
        validarCantidadListadoDebounce(libro) {
            // Identificador único para cada libro
            const libroId = libro.pro_codigo || libro.id;
            
            // Limpiar timer anterior si existe
            if (this.validacionTimers[libroId]) {
                clearTimeout(this.validacionTimers[libroId]);
            }
            
            // Crear nuevo timer (espera 800ms después de que el usuario deje de escribir)
            this.validacionTimers[libroId] = setTimeout(() => {
                this.validarCantidadListado(libro);
            }, 800);
        },
        
        // Método para calcular cantidad disponible para proformar
        calcularDisponible(libro) {
            if (!libro) return 0;
            if (libro.esLibroExtra) return 0;
            const cantidadPedida = parseInt(libro.cantidad || 0);
            const cantidadProformada = parseInt(libro.cantidadProformada || 0);
            const disponible = cantidadPedida - cantidadProformada;
            return disponible > 0 ? disponible : 0;
        },
        
        // Método para actualizar cantidades ya proformadas
        actualizarCantidadesProformadas() {
            let me = this;
            if (!me.librosConStock || me.librosConStock.length === 0) return;
            if (!me.librosProformados || me.librosProformados.length === 0) return;
            
            console.log('Actualizando cantidades proformadas:', me.librosProformados);
            
            // Actualizar las cantidades proformadas en librosConStock
            me.librosConStock = me.librosConStock.map(libro => {
                const libroProformado = me.librosProformados.find(lp => lp.pro_codigo === libro.pro_codigo);
                const cantidadProformada = libroProformado ? parseInt(libroProformado.cantidad_proformada || 0) : 0;
                
                console.log(`Libro ${libro.pro_codigo}: cantidad_proformada = ${cantidadProformada}`);
                
                return {
                    ...libro,
                    cantidadProformada: cantidadProformada
                };
            });
        },
        
        validarCantidadListado(libro) {
            const cantidad = parseInt(libro.cantidadProforma);
            
            // Si el campo está vacío, limpiar error y permitir
            if (libro.cantidadProforma === '' || libro.cantidadProforma === null) {
                this.$set(libro, 'errorStockMinimo', '');
                this.sincronizarCantidadEnRapida(libro);
                this.calcularTotalesProforma();
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
            const esLibroExtra = libro.esLibroExtra === true;
            
            // VALIDACIÓN: Solo validar cantidad pedida si NO es libro extra
            if (!esLibroExtra && cantidad > cantidadPedida) {
                this.$set(libro, 'errorStockMinimo', `No puede exceder lo pedido (${cantidadPedida})`);
                this.$vs.notify({
                    title: '⚠️ Cantidad Excedida',
                    text: `La cantidad máxima para este libro es ${cantidadPedida} (cantidad pedida)`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    time: 4000
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
            this.calcularTotalesProforma();
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
/* ESTILOS PARA PANEL DE CONFIGURACIÓN */
/* ===================================== */

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

/* Responsive para panel de configuración */
@media (max-width: 768px) {
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