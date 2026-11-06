<template>
    <vs-popup-history
        class="popup-proforma"
        fullscreen
        title="Nueva Transacción de Obsequios - Perseo"
        :active.sync="popupVenta"
        @close="cerrarVenta"
        :confirm-close="true"
        confirm-message="¿Estás seguro de cerrar la creación de la transacción de obsequios? Los cambios no guardados se perderán."
    >
        <!-- Barra de totales anclada (sticky) - Versión ultra compacta -->
        <div v-if="calcularTotalesUnificados().cantidadLibros > 0" class="barra-totales-sticky-compacta" >
            <div class="contenido-barra-compacta barra-normal">
                <!-- Para obsequios - Sin cupo -->
                <div class="flex items-center justify-between">
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

        <div v-if="popupVenta">
            <!-- Información del pedido en el popup -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Información del Pedido</h4>
                </template>
                <div class="container-fluid small py-1 border-bottom mb-2">
                    <div class="row g-1 align-items-center">
                        <div class="col-auto">
                        <strong>Institución:</strong> {{ infoPedidoActual.nombreInstitucion || 'Sin institución' }}
                        <span class="text-muted">({{ infoPedidoActual.ciudad || 'Sin ciudad' }})</span>
                        <span class="text-muted">(RUC/CI :{{ infoPedidoActual.ruc || 'N/A' }})</span>
                        </div>
                        <div class="col-auto">
                        <strong>Asesor:</strong> {{ infoPedidoActual.asesor || 'Sin asesor' }}
                        </div>
                        <div class="col-auto">
                        <strong>Contrato:</strong> {{ infoPedidoActual.contrato_generado || 'Sin contrato' }}
                        </div>
                        <div class="col-auto">
                        <strong>Tipo:</strong> Directa
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
                            :disabled="tieneLibrosConCantidad()"
                            class="w-full"
                        >
                            <template #option="option">
                                <div class="py-1">
                                    <div class="font-bold">{{ option.descripcion_corta }} - {{ 'ID: ' + (option.id || 'Sin código') }}</div>
                                </div>
                            </template>
                        </v-select>
                        <span v-if="validationErrors.empresa" class="text-danger text-sm">{{ validationErrors.empresa }}</span>
                        <small v-if="tieneLibrosConCantidad()" class="text-warning block mt-1">
                            <feather-icon icon="LockIcon" size="10" class="inline"></feather-icon>
                            No puede cambiar la empresa con libros agregados. El stock está vinculado a esta empresa.
                        </small>
                    </div>

                    <div>
                        <label class="font-bold mb-2 block">
                            Descuento (%)
                        </label>
                        <vs-input
                            ref="inputDescuento"
                            type="number"
                            placeholder="0"
                            v-model="ventaData.descuento"
                            min="0"
                            max="100"
                            class="w-full"
                            :disabled="true"
                            readonly
                        />
                        <small class="text-info">
                            <feather-icon icon="InfoIcon" size="12" class="inline"></feather-icon>
                            Descuento del pedido de obsequio (no editable)
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
                                                    @click="abrirEditarInstitucion()"
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
                                    <div class="lugar-ciudad">{{ ventaData.lugarDespacho.ciudad }}</div>
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
                                        <vs-th style="width: 100px;">
                                            <span class="headers-form">
                                                <feather-icon icon="PackageIcon" size="14" class="mr-1"></feather-icon>
                                                Cantidad
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
                                        :options="librosPedido"
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
                                            </div>
                                        </template>
                                        <template v-slot:selected-option="option">
                                            <strong>{{ option.pro_codigo }}</strong> - {{ option.nombre_libro }}
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

                                            <!-- Ya Vendido -->
                                            <vs-td>
                                                <vs-chip
                                                    v-if="fila.libroSeleccionado && !fila.libroSeleccionado.esLibroExtra"
                                                    :color="(fila.libroSeleccionado.cantidadVendida || 0) > 0 ? 'success' : 'dark'"
                                                    size="small"
                                                >
                                                    {{ fila.libroSeleccionado.cantidadVendida || 0 }}
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

                                            <!-- Stock Perseo -->
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
                                                <!-- Producto simple: número -->
                                                <vs-chip
                                                    v-else-if="fila.libroSeleccionado && fila.libroSeleccionado.stock !== undefined && fila.libroSeleccionado.stock !== null"
                                                    :color="fila.libroSeleccionado.stock > 0 ? 'success' : 'danger'"
                                                    size="small"
                                                    class="font-bold"
                                                >
                                                    {{ fila.libroSeleccionado.stock }}
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
                                                <div v-if="fila.libroSeleccionado && fila.libroSeleccionado.stock_combo_componentes && fila.libroSeleccionado.stock_combo_componentes.length > 0 && fila.libroSeleccionado.puede_vender === false" class="combo-faltantes-tabla mt-1">
                                                    <div class="combo-faltantes-header" @click="toggleComboFaltantes(index)" style="cursor:pointer;">
                                                        <i class="fas fa-exclamation-triangle" style="color:#EA5455; font-size:10px;"></i>
                                                        <span>Stock insuficiente</span>
                                                        <i :class="comboFaltantesExpandidos[index] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="margin-left:auto; font-size:9px; color:#b91c1c;"></i>
                                                    </div>
                                                    <table v-if="comboFaltantesExpandidos[index]" class="combo-faltantes-grid">
                                                        <thead>
                                                            <tr>
                                                                <th>Código</th>
                                                                <th>Stock</th>
                                                                <th>Faltan</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="comp in fila.libroSeleccionado.stock_combo_componentes.filter(c => c.faltante > 0)" :key="comp.pro_codigo">
                                                                <td class="combo-faltantes-codigo">{{ comp.pro_codigo }}</td>
                                                                <td class="combo-faltantes-stock">{{ comp.stock }}</td>
                                                                <td class="combo-faltantes-faltante">-{{ comp.faltante }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
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
                                    <label class="mr-2">Descuento {{ventaData.descuento}}%:</label>
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
    name: 'ObsequiosModalPerseo',
    components: {
        vSelect,
        BusquedaLugarDespacho,
        BusquedaClientePerseo,
        FacturacionInformacionInstitucion
    },
    props: {
        // Props específicos para obsequios
        pedidoObsequio: {
            type: Object,
            default: null
        },
        pedidoOriginal: {
            type: Object,
            default: null
        },
        totalizado: {
            type: Object,
            required: false,
            default: () => ({})
        },
        periodoSelect: {
            type: Object,
            required: false,
            default: () => ({})
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        var nombreInstitucionInicial = (this.pedidoOriginal && this.pedidoOriginal.nombreInstitucion) || (this.pedidoObsequio && this.pedidoObsequio.nombreInstitucion) || '';
        var nombrePeriodoInicial = (this.periodoSelect && this.periodoSelect.periodoescolar) || localStorage.getItem('nombre_periodo_selected') || '';
        var conceptoInicial = '';
        if (nombreInstitucionInicial && nombrePeriodoInicial) {
            conceptoInicial = nombreInstitucionInicial + ' / ' + nombrePeriodoInicial;
        } else if (nombreInstitucionInicial) {
            conceptoInicial = nombreInstitucionInicial;
        }
        return {
            popupVenta: this.visible,
            listaEmpresas: [],
            mostrarBusquedaLugar: false,
            mostrarBusquedaCliente: false,
            mostrarEditarInstitucion: false,
            // librosConStock: [], // YA NO SE USA - se usa directamente librosPedido
            // Mantener como array vacío para compatibilidad con métodos legacy
            librosConStock: [],
            librosPedido: [], // Lista de libros de obsequio para el v-select
            filtrarSoloConCantidad: false, // Nuevo estado para el filtro del listado

            // Control de stock insuficiente
            popupStockInsuficiente: false,
            productosStockInsuficiente: [],

            // Para agregar libros extras
            libroExtra: {
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                resultadosBusqueda: [],
                indiceSeleccionado: 0
            },
            todosLosLibrosDisponibles: [], // Almacenará TODOS los libros disponibles cuando se activate la opción
            debounceTimerLibroExtra: null, // Timer para debounce de búsqueda de libro extra

            // Porcentaje de descuento del pedido de obsequio
            porcentajeDescuentoPedido: null,
            comboFaltantesExpandidos: {},

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
                descuento: 0,
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
            }
        }
    },
    computed: {
        infoPedidoActual() {
            var pedidoBase = this.pedidoOriginal ? this.pedidoOriginal : {};
            var pedidoObsequio = this.pedidoObsequio ? this.pedidoObsequio : {};

            return {
                nombreInstitucion: pedidoBase.nombreInstitucion ? pedidoBase.nombreInstitucion : pedidoObsequio.nombreInstitucion,
                ciudad: pedidoBase.nombre_ciudad ? pedidoBase.nombre_ciudad : (pedidoBase.ciudad ? pedidoBase.ciudad : (pedidoObsequio.nombre_ciudad ? pedidoObsequio.nombre_ciudad : pedidoObsequio.ciudad)),
                ruc: pedidoBase.ruc ? pedidoBase.ruc : pedidoObsequio.ruc,
                asesor: pedidoBase.asesor ? pedidoBase.asesor : pedidoObsequio.asesor,
                contrato_generado: pedidoBase.contrato_generado ? pedidoBase.contrato_generado : pedidoObsequio.contrato_generado
            };
        },
        // Asegurar que filasCaptura siempre sea un array válido para el template
        filasCapturaSeguras() {
            return this.filasCaptura && Array.isArray(this.filasCaptura) ? this.filasCaptura : [];
        },
        // Obtener ID del periodo de forma segura
        idPeriodo() {
            // Prioridad: periodoSelect.idperiodoescolar > pedidoOriginal.id_periodo > 0
            if (this.periodoSelect && this.periodoSelect.idperiodoescolar) {
                return this.periodoSelect.idperiodoescolar;
            }
            if (this.pedidoOriginal && this.pedidoOriginal.id_periodo) {
                return this.pedidoOriginal.id_periodo;
            }
            console.warn('⚠️ No se pudo obtener ID de periodo válido');
            return 0;
        }
    },
    watch: {
        visible(newVal) {
            this.popupVenta = newVal;
            if (newVal) {
                this.cargarEmpresas();
                // Resetear y cargar datos para nueva proforma
                this.resetearVenta();

                // Los libros se cargan automáticamente por el watcher de pedidoObsequio
                // No duplicar la llamada aquí

                this.$nextTick(() => {
                    this.calcularTotalesVentas();
                });
            }
        },
        popupVenta(newVal) {
            this.$emit('update:visible', newVal);
        },
        pedidoObsequio: {
            handler(newVal) {
                // Cargar libros cuando cambie el pedido de obsequio
                if (newVal && newVal.id && this.popupVenta) {
                    // VALIDACIÓN ESTRICTA: El descuento debe venir del pedido (prop)
                    if (newVal.porcentaje_descuento === undefined || newVal.porcentaje_descuento === null) {
                        this.$vs.notify({
                            title: '❌ Error: Descuento no configurado',
                            text: 'El pedido de obsequio no tiene un porcentaje de descuento configurado. No se puede continuar.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x-circle',
                            position: 'top-center',
                            time: 6000
                        });

                        // Cerrar el modal
                        this.cerrarVenta();
                        return;
                    }

                    // Capturar el porcentaje de descuento del pedido
                    this.porcentajeDescuentoPedido = parseFloat(newVal.porcentaje_descuento);
                    this.ventaData.descuento = this.porcentajeDescuentoPedido;
                    console.log('📊 Porcentaje de descuento del pedido (desde prop):', this.porcentajeDescuentoPedido);

                    // Ahora sí, cargar los libros
                    this.obtenerLibrosObsequio(newVal.id);
                }
            },
            deep: true,
            immediate: false
        },

    },
    mounted() {
        // Debug: verificar qué llega en periodoSelect
        console.log('🔍 ObsequiosModalPerseo mounted - periodoSelect:', this.periodoSelect);
        console.log('🔍 ObsequiosModalPerseo mounted - pedidoOriginal:', this.pedidoOriginal);

        // Validar que el período esté presente cuando se intente usar
        if (!this.periodoSelect || !this.periodoSelect.idperiodoescolar) {
            console.warn('⚠️ ADVERTENCIA: periodoSelect no está definido o no tiene idperiodoescolar');
            console.warn('⚠️ periodoSelect recibido:', this.periodoSelect);
        }

        this.cargarEmpresas();
    },
    methods: {
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
        // OBTENER LIBROS DE OBSEQUIO
        // ====================================
        obtenerLibrosObsequio(pedidoObsequioId) {
            const me = this;

            if (!pedidoObsequioId) {
                console.error('obtenerLibrosObsequio: No se proporcionó ID de pedido de obsequio');
                return;
            }

            me.$vs.loading({
                text: 'Cargando libros de obsequio...'
            });

            this.$http.get(this.$server_url + `api/perseo/ventas/obtenerDatosDetalleLibros/${pedidoObsequioId}`)
                .then((res) => {
                    me.$vs.loading.close();

                    if (res.status === 200 && res.data.status === 200 && res.data.data) {
                        const librosObsequio = res.data.data;

                        console.log('✅ Libros de obsequio cargados:', librosObsequio);

                        // El descuento ya fue validado y capturado en el watcher de pedidoObsequio
                        // No es necesario validarlo aquí nuevamente

                        // Llenar librosPedido para el v-select
                        me.librosPedido = librosObsequio.map(libro => ({
                            pro_codigo: libro.pro_codigo,
                            nombre_libro: libro.nombre_libro,
                            precio: parseFloat(libro.p_libros_valor_u) || 0,
                            // Campos con nombres originales del backend
                            p_libros_cantidad: parseInt(libro.p_libros_cantidad) || 0,
                            p_libros_cantidad_aprobada: parseInt(libro.p_libros_cantidad_aprobada) || 0,
                            p_libros_cantidad_pendiente: parseInt(libro.p_libros_cantidad_pendiente) || 0,
                            p_detalle_libros_obsequios_id: libro.id,
                            // Campos con nombres que espera la plantilla
                            cantidad: parseInt(libro.p_libros_cantidad) || 0,
                            cantidadVendida: parseInt(libro.p_libros_cantidad_aprobada) || 0,
                            stock: 0, // Se consultará cuando se seleccione
                            // Campos combo
                            grupo_codigo_para_v3: libro.grupo_codigo_para_v3 != null ? libro.grupo_codigo_para_v3 : null,
                            codigos_combos: libro.codigos_combos != null ? libro.codigos_combos : null,
                            codigos_combos_regalado: libro.codigos_combos_regalado != null ? libro.codigos_combos_regalado : null
                        }));

                        // Resetear las filas de captura para evitar mezclar con datos anteriores
                        me.filasCaptura = [];

                        // Agregar una fila vacía para iniciar la captura
                        me.filasCaptura.push({
                            textoBusqueda: '',
                            libroSeleccionado: null,
                            cantidad: '',
                            confirmado: false,
                            resultadosBusqueda: [],
                            sugerenciaActual: null,
                            errorCantidad: '',
                            consultandoStock: false,
                            stockError: false
                        });

                        me.$vs.notify({
                            title: 'Libros Cargados',
                            text: `Se cargaron ${librosObsequio.length} libros de obsequio`,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            position: 'top-center'
                        });

                        // Recalcular totales
                        me.$nextTick(() => {
                            me.calcularTotalesVentas();
                        });
                    } else {
                        me.$vs.notify({
                            title: 'Sin Libros',
                            text: res.data.message || 'No se encontraron libros de obsequio',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            position: 'top-center'
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.error('Error al obtener libros de obsequio:', error);

                    let mensajeError = "No se pudieron cargar los libros de obsequio";

                    if (error.response && error.response.data && error.response.data.message) {
                        mensajeError = error.response.data.message;
                    }

                    me.$vs.notify({
                        title: 'Error',
                        text: mensajeError,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        position: 'top-center'
                    });
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

            // COMENTADO: Ya no se reconsulta todo el stock
            // El stock se consulta individualmente al seleccionar cada libro
            // this.$vs.loading({
            //     text: 'Actualizando stock...'
            // });
            // await this.consultarStockLibros();
            // this.$vs.loading.close();

            this.$vs.notify({
                title: 'Stock Actualizado',
                text: 'El stock ha sido reconsultado. Por favor verifique las cantidades.',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-refresh-cw',
                position: 'top-center'
            });
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
            // Limpiar el timer anterior si existe
            if (this.debounceTimerLibroExtra) {
                clearTimeout(this.debounceTimerLibroExtra);
            }

            const texto = this.libroExtra.textoBusqueda.toLowerCase().trim();

            // Si el texto está vacío o es muy corto, limpiar resultados inmediatamente
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

            // Aplicar debounce de 400ms antes de ejecutar la búsqueda y validaciones
            this.debounceTimerLibroExtra = setTimeout(() => {
                this.ejecutarBusquedaLibroExtra(texto);
            }, 400);
        },

        ejecutarBusquedaLibroExtra(texto) {
            // Para obsequios, no hay lista pre-cargada de libros
            // Los libros se obtienen de la captura rápida (filasCaptura)
            const codigosEnCaptura = (this.filasCaptura || [])
                .filter(f => f.libroSeleccionado)
                .map(f => f.libroSeleccionado.pro_codigo);

            // Separar palabras para búsqueda inteligente
            const palabrasBusqueda = texto.split(/\s+/).filter(p => p.length > 0);

            // Para obsequios, no tenemos listado  pre-cargado
            // El usuario debe buscar manualmente en Perseo
            this.libroExtra.resultadosBusqueda = [];

            this.$vs.notify({
                title: 'Búsqueda de Obsequios',
                text: 'Use la tabla de captura rápida para buscar libros con stock de Perseo',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-info',
                time: 3000,
                position: 'top-center'
            });
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

            // Consultar stock de Perseo inmediatamente
            this.consultarStockLibroExtra();

            // Enfocar el input de cantidad
            this.$nextTick(() => {
                const cantidadInput = this.$el.querySelector('.body-extras-compacto input[type="number"]');
                if (cantidadInput) {
                    cantidadInput.focus();
                    cantidadInput.select();
                }
            });
        },

        async consultarStockLibroExtra() {
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

            if (!me.libroExtra.libroSeleccionado) return;

            try {
                // Marcar como consultando
                me.$set(me.libroExtra.libroSeleccionado, 'consultandoStock', true);

                const codigoConsulta = me.libroExtra.libroSeleccionado.pro_codigo;
                console.log('📦 Consultando stock del sistema para libro extra:', codigoConsulta);

                const stockData = await me.consultarStockPerseo(codigoConsulta, me.ventaData.empresa);

                console.log('✅ Respuesta stock sistema (libro extra):', stockData);

                if (stockData && stockData[codigoConsulta]) {
                    const stockInfo = stockData[codigoConsulta];

                    if (stockInfo.existenciastotales === undefined || stockInfo.existenciastotales === null) {
                        throw new Error('La respuesta no contiene el campo existenciastotales');
                    }

                    const stockDisponible = parseInt(stockInfo.existenciastotales);

                    // Actualizar stock en el libro seleccionado
                    me.$set(me.libroExtra.libroSeleccionado, 'stock', stockDisponible);
                    me.$set(me.libroExtra.libroSeleccionado, 'consultandoStock', false);

                    console.log(`✅ Stock actualizado: ${stockDisponible} unidades`);
                } else {
                    throw new Error('No se encontró stock para este libro');
                }
            } catch (error) {
                console.error('❌ Error al consultar stock (libro extra):', error);
                me.$set(me.libroExtra.libroSeleccionado, 'stock', 0);
                me.$set(me.libroExtra.libroSeleccionado, 'consultandoStock', false);

                me.$vs.notify({
                    title: '❌ Error al consultar stock',
                    text: 'No se pudo consultar el stock para este libro',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x-circle'
                });
            }
        },

        limpiarBusquedaLibroExtra() {
            // Limpiar el timer de debounce si existe
            if (this.debounceTimerLibroExtra) {
                clearTimeout(this.debounceTimerLibroExtra);
                this.debounceTimerLibroExtra = null;
            }

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

            // Verificar que no exista ya en filasCaptura
            const yaExiste = (this.filasCaptura || []).find(f =>
                f.libroSeleccionado && f.libroSeleccionado.pro_codigo === this.libroExtra.libroSeleccionado.pro_codigo
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
                // El stock ya fue consultado cuando se seleccionó el libro
                const stockDisponible = parseInt(this.libroExtra.libroSeleccionado.stock || 0);
                const cantidadSolicitada = parseInt(this.libroExtra.cantidad);

                console.log(`Stock disponible en Perseo para ${this.libroExtra.libroSeleccionado.pro_codigo}:`, stockDisponible);

                // VALIDACIÓN DE STOCK
                if (cantidadSolicitada > stockDisponible) {
                    this.$vs.notify({
                        title: '❌ Stock Insuficiente en Perseo',
                        text: `Solo hay ${stockDisponible} unidades disponibles de "${this.libroExtra.libroSeleccionado.pro_codigo}" en Perseo`,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 5000,
                        position: 'top-center'
                    });
                    return;
                }

                // Crear el objeto del libro extra con el formato correcto
                const libroNuevo = {
                    ...this.libroExtra.libroSeleccionado,
                    cantidad: 0, // Cantidad pedida (no aplica para extras)
                    cantidadVenta: this.libroExtra.cantidad.toString(),
                    stock: stockDisponible,
                    precio_perseo: this.libroExtra.libroSeleccionado.precio_perseo || null,
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
                this.calcularTotalesVentas();

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
                    this.calcularTotalesVentas();

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
            // Para obsequios no aplica este cálculo
            return 0;
        },

        cerrarVenta() {
            this.popupVenta = false;
            this.resetearVenta();
            this.$emit('cerrar');
        },

        resetearVenta() {
            var nombreInstitucionInicial = (this.pedidoOriginal && this.pedidoOriginal.nombreInstitucion) || (this.pedidoObsequio && this.pedidoObsequio.nombreInstitucion) || '';
            var nombrePeriodoInicial = (this.periodoSelect && this.periodoSelect.periodoescolar) || localStorage.getItem('nombre_periodo_selected') || '';
            var conceptoInicial = '';
            if (nombreInstitucionInicial && nombrePeriodoInicial) {
                conceptoInicial = nombreInstitucionInicial + ' / ' + nombrePeriodoInicial;
            } else if (nombreInstitucionInicial) {
                conceptoInicial = nombreInstitucionInicial;
            }
            this.ventaData = {
                empresa: null,
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

            // Limpiar datos de libro extra
            this.libroExtra = {
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                resultadosBusqueda: []
            };
            this.todosLosLibrosDisponibles = [];
            this.librosPedido = []; // Limpiar libros de obsequio
            this.porcentajeDescuentoPedido = null; // Limpiar porcentaje de descuento del pedido

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
                        empresa => ![2, 3].includes(empresa.id)
                    );

                    // Seleccionar empresa 1 por defecto (opcional)
                })
        },

        obtenerDescuentoInicialPedido() {
            // Para obsequios, obtener el descuento del pedido seleccionado
            // No hay fallback - si no existe, la validación en obtenerLibrosObsequio ya cerró el modal
            return this.porcentajeDescuentoPedido || 0;
        },

        seleccionarEmpresa(empresa) {
            // Limpiar cliente de Perseo si es necesario
            this.quitarClientePerseo();
            this.ventaData.empresa = empresa;
            this.validationErrors.empresa = '';
            this.calcularTotalesVentas();

            // YA NO se consulta todo el stock aquí
            // El stock se consulta individualmente al seleccionar cada libro en el v-select

            // // Enfocar automáticamente el primer v-select después de seleccionar empresa
            // this.$nextTick(() => {
            //     setTimeout(() => {
            //         this.enfocarSelect(0);
            //     }, 300);
            // });
        },

        // ========================================
        // MÉTODOS PARA VALIDACIONES DE VENTA POR LISTA
        // ========================================

        esVentaPorLista() {
            return false;
        },

        esVentaDirecta() {
            return true;
        },



        // Normalizar descuento principal al perder el foco (05 -> 5)
        normalizarDescuentoPrincipal() {
            if (this.ventaData.descuento !== '' && this.ventaData.descuento !== null) {
                const valor = parseFloat(this.ventaData.descuento);
                if (!isNaN(valor)) {
                    this.ventaData.descuento = valor;
                }
            }
        },

        // Validar y corregir descuento principal (0-100)
        validarYCorregirDescuentoPrincipal() {
            this.normalizarDescuentoPrincipal();
            if (this.ventaData.descuento !== '' && this.ventaData.descuento !== null) {
                let valor = parseFloat(this.ventaData.descuento);

                if (!isNaN(valor)) {
                    // Corregir si está fuera del rango
                    if (valor > 100) {
                        this.ventaData.descuento = 100;
                    } else if (valor < 0) {
                        this.ventaData.descuento = 0;
                    }
                }
            }
            console.log('this.ventaData.descuento',this.ventaData.descuento)
        },

        // Validar descuento principal - retorna true si es válido
        validarDescuentoPrincipal() {
            let descuento = parseFloat(this.ventaData.descuento);

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

            // Calcular subtotal de todos los libros con cantidad
            const subtotal = librosCapturados.reduce((total, fila) => {
                const precio = parseFloat(fila.libroSeleccionado.precio) || 0;
                const cantidad = parseInt(fila.cantidad) || 0;
                return total + (precio * cantidad);
            }, 0);

            // Aplicar descuento
            const descuentoPorcentaje = parseFloat(this.ventaData.descuento) || 0;
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
                cantidadLibros: librosCapturados.length
            };
        },

        calcularSubtotalLibro(libro) {
            if (!libro.cantidadVenta || parseInt(libro.cantidadVenta) === 0) {
                return '0.00';
            }
            const precio = parseFloat(libro.precio) || 0;
            const cantidad = parseInt(libro.cantidadVenta) || 0;
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

            // Recalcular totales después de asignar lugar
            this.calcularTotalesVentas();
        },


        quitarLugarDespacho() {
            this.ventaData.lugarDespacho = {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
                datosInstitucion: []
            };

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

            // 2. Validar descuento (debe ser numérico, no vacío, 0 o mayor)
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

            // 3. Validar observación (debe tener contenido)
            if (!this.ventaData.observacion || this.ventaData.observacion.trim() === '') {
                errores.push('Debe ingresar una observación');
                if (!primerCampoConError) primerCampoConError = 'inputObservacion';
                isValid = false;
            }

            // 4. Validar concepto Perseo (debe tener contenido)
            if (!this.ventaData.conceptoPerseo || this.ventaData.conceptoPerseo.trim() === '') {
                errores.push('Debe ingresar un concepto para Perseo');
                if (!primerCampoConError) primerCampoConError = 'inputConceptoPerseo';
                isValid = false;
            }

            // 5. Validar lugar de despacho
            if (!this.ventaData.lugarDespacho.nombreInstitucion) {
                this.validationErrors.lugarDespacho = 'Debe seleccionar un lugar de despacho';
                errores.push('Debe seleccionar un lugar de despacho');
                if (!primerCampoConError) primerCampoConError = 'btnLugarDespacho';
                isValid = false;
            }

            // 5. Validar cliente Perseo
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

            // Validar descuento
            const descuento = parseFloat(this.ventaData.descuento);
            if (isNaN(descuento) || descuento <= 0 || descuento > 100) {
                erroresFaltantes.push('• El <b>Descuento</b> debe ser un valor mayor a 0 y no mayor a 100');
            }

            // Validar que tenga al menos una cantidad
            const tieneCantidades = this.filasCaptura && Array.isArray(this.filasCaptura) && this.filasCaptura.some(fila =>
                fila.libroSeleccionado && fila.cantidad && parseInt(fila.cantidad) > 0
            );

            if (!tieneCantidades) {
                erroresFaltantes.push('• Debe ingresar al menos <b>una cantidad</b> para la venta');
            }

            // Validar combos con stock insuficiente o no verificado
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

            // ==================================
            // PREPARAR DATOS PARA ENVIAR
            // ==================================
            const me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);

            // Obtener ID de empresa
            const empresaId = typeof me.ventaData.empresa === 'object'
                ? me.ventaData.empresa.id
                : parseInt(me.ventaData.empresa);

            // Calcular totales
            const totales = me.calcularTotalesUnificados();
            const descuentoPorcentaje = parseFloat(me.ventaData.descuento);

            // Preparar productos para venta (formato que espera el backend)
            const productosVenta = librosParaVenta.map(libro => ({
                pro_codigo: libro.pro_codigo,
                cantidad: parseInt(libro.cantidadVenta),
                precio: parseFloat(libro.precio),
                // Datos de combo para que el backend descuente los componentes correctos
                grupo_codigo_para_v3: libro.grupo_codigo_para_v3 != null ? libro.grupo_codigo_para_v3 : null,
                codigos_combos: libro.codigos_combos != null ? libro.codigos_combos : null,
                codigos_combos_regalado: libro.codigos_combos_regalado != null ? libro.codigos_combos_regalado : null
            }));

            // Preparar información de venta (formato que espera el backend)
            const infoVenta = {
                id_empresa: empresaId,
                clienteId: parseInt(me.ventaData.clientePerseo.idusuario),
                clientesidPerseo: parseInt(me.ventaData.clientePerseo.clientesidPerseo),
                ruc_cliente: me.ventaData.clientePerseo.cedula || '',
                ven_idUsuario: parseInt(usuarioObjeto.idusuario),
                institucion_id: parseInt(me.ventaData.lugarDespacho.id_institucion),
                tip_ven_codigo: 1, // En obsequios siempre es venta directa
                contrato: me.infoPedidoActual && me.infoPedidoActual.contrato_generado ? me.infoPedidoActual.contrato_generado : null,
                ven_totalizado: me.totalizado && me.totalizado.ca_codigo_agrupado ? me.totalizado.ca_codigo_agrupado : null,
                ven_subtotal: parseFloat(totales.subtotal.toFixed(2)),
                ven_desc_por: descuentoPorcentaje,
                ven_desc_valor: parseFloat(totales.descuentoMonto.toFixed(2)),
                ven_valor: parseFloat(totales.total.toFixed(2)),
                ven_observacion: me.ventaData.observacion.trim(),
                ven_concepto_perseo: me.ventaData.conceptoPerseo.trim()
            };

            // Preparar payload para Obsequios (formato que espera el backend)
            const payload = {
                p_libros_obsequios_id: parseInt(me.pedidoObsequio.id),
                productosVenta: productosVenta,
                infoVenta: infoVenta
            };

            console.log('═══════════════════════════════════════════════════════');
            console.log('📋 DATOS DE LA VENTA DE OBSEQUIOS PARA GUARDAR EN PERSEO');
            console.log('═══════════════════════════════════════════════════════');
            console.log('🎁 P_Libros_Obsequios_ID:', payload.p_libros_obsequios_id);
            console.log('📦 Productos Venta (' + productosVenta.length + ' productos):');
            productosVenta.forEach((producto, idx) => {
                console.log(`   ${idx + 1}. ${producto.pro_codigo} | Cant: ${producto.cantidad} | Precio: $${producto.precio}`);
            });
            console.log('📋 Info Venta:');
            console.log('   🏢 Empresa ID:', infoVenta.id_empresa);
            console.log('   👤 Cliente ID (idusuario):', infoVenta.clienteId);
            console.log('   🆔 ClientesidPerseo:', infoVenta.clientesidPerseo);
            console.log('   📄 RUC/Cédula:', infoVenta.ruc_cliente);
            console.log('   👷 Usuario ID:', infoVenta.ven_idUsuario);
            console.log('   📍 Institución ID:', infoVenta.institucion_id);
            console.log('   � Tipo Venta:', infoVenta.tip_ven_codigo, '(1=Directa, 2=Lista)');
            console.log('   �💰 Subtotal:', infoVenta.ven_subtotal);
            console.log('   📝 Descuento %:', infoVenta.ven_desc_por);
            console.log('   💵 Descuento $:', infoVenta.ven_desc_valor);
            console.log('   💲 Total:', infoVenta.ven_valor);
            console.log('   💬 Observación:', infoVenta.ven_observacion);
            console.log('   🏷️ Concepto Perseo:', infoVenta.ven_concepto_perseo);
            console.log('═══════════════════════════════════════════════════════');

            // Enviar al backend usando el endpoint específico para obsequios
            me.$vs.loading({
                text: 'Generando transacción de obsequios...'
            });

            this.$http.post(this.$server_url + "Venta_Obsequios_Perseo_Generar", payload)
                .then((res) => {
                    me.$vs.loading.close();

                    if (res.status === 200 && res.data.status === 200) {
                        me.$vs.notify({
                            title: '✅ Transacción de Obsequios Creada',
                            text: res.data.message || 'Transacción de obsequios generada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-gift',
                            time: 4000
                        });

                        // Emitir evento específico para transacciones de obsequios
                        me.$emit('venta-obsequio-generada', res.data);
                        me.popupVenta = false; // Cerrar modal
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

        // ========================================
        // HELPERS PARA COMBOS (grupo_codigo_para_v3 = 8)
        // ========================================
        esLibroComboParaStock(libro) {
            if (!libro) return false;
            const grupo = libro.grupo_codigo_para_v3 != null ? parseInt(libro.grupo_codigo_para_v3, 10) : 0;
            return grupo === 8;
        },

        construirConsultaStockPerseo(libro, cantidad) {
            if (!libro || !libro.pro_codigo) return libro;
            const consulta = {
                pro_codigo: libro.pro_codigo,
                cantidad: cantidad != null ? cantidad : (libro.cantidad != null ? libro.cantidad : 0)
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
            const nombre = stockInfo.descripcion || stockInfo.pro_nombre || libroDestino.nombre_libro || '';
            this.$set(libroDestino, 'pro_nombre', nombre);
            this.$set(libroDestino, 'es_combo', !!stockInfo.es_combo);
            this.$set(libroDestino, 'mensaje_stock_combo', stockInfo.mensaje_stock_combo || null);
            this.$set(libroDestino, 'detalle_faltantes_combo', Array.isArray(stockInfo.detalle_faltantes_combo) ? stockInfo.detalle_faltantes_combo : []);
            this.$set(libroDestino, 'stock_combo_componentes', Array.isArray(stockInfo.stock_combo_componentes) ? stockInfo.stock_combo_componentes : []);
        },

        consultarStockComboConCantidad(fila, index) {
            const me = this;
            const cantidad = parseInt(fila.cantidad, 10);
            if (!fila.libroSeleccionado || isNaN(cantidad) || cantidad <= 0) return;

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
                    const puedeVender = stockInfo.puede_vender !== undefined ? stockInfo.puede_vender : (stockInfo.existenciastotales >= cantidad);
                    this.$set(fila.libroSeleccionado, 'puede_vender', puedeVender);
                    if (!puedeVender) {
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
                me.calcularTotalesVentas();
            })
            .catch(() => {
                if (!fila.libroSeleccionado) return;
                this.$set(fila.libroSeleccionado, 'consultandoStockCombo', false);
                this.$set(fila.libroSeleccionado, 'puede_vender', false);
                fila.errorCantidad = '⚠️ Error al verificar stock del combo. Reintenta.';
                me.calcularTotalesVentas();
            });
        },

        // Método centralizado para consultar stock desde sistema local (plataforma)
        async consultarStockPerseo(codigos, idEmpresa) {
            try {
                const codigosArray = Array.isArray(codigos) ? codigos : [codigos];
                const empresaId = typeof idEmpresa === 'object' ? parseInt(idEmpresa.id, 10) : parseInt(idEmpresa, 10);

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

                    const response = await this.$http.get(
                        `${this.$server_url}api/perseo/ventas-lista/stock-producto`,
                        { params: parametros }
                    );

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
                    cantidadVenta: parseInt(fila.cantidad)
                }));
        },

        // ========================================
        // MÉTODOS PARA CAPTURA SÚPER RÁPIDA
        // ========================================

        agregarFilaCaptura() {
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
                confirmado: false,
                resultadosBusqueda: [],
                sugerenciaActual: null,
                errorCantidad: '',
                consultandoStock: false,
                stockError: false
            });
        },

        // Nuevo método para validar cantidad y sincronizar
        validarYSincronizarCantidad(fila, index) {
            fila.errorCantidad = '';

            // Si la cantidad está vacía, permitir temporalmente
            if (!fila.cantidad || fila.cantidad.toString().trim() === '') {
                // Resetear estado combo si borraron la cantidad
                if (fila.libroSeleccionado && this.esLibroComboParaStock(fila.libroSeleccionado)) {
                    this.$set(fila.libroSeleccionado, 'stock', null);
                    this.$set(fila.libroSeleccionado, 'puede_vender', null);
                    this.$set(fila.libroSeleccionado, 'detalle_faltantes_combo', []);
                }
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

            // Si hay libro seleccionado
            if (fila.libroSeleccionado) {
                // Para combos: consultar stock con la cantidad ingresada (debounce)
                if (this.esLibroComboParaStock(fila.libroSeleccionado)) {
                    if (fila.consultaStockComboTimer) { clearTimeout(fila.consultaStockComboTimer); }
                    // Marcar inmediatamente como pendiente para que el ❌ anterior no confunda
                    this.$set(fila.libroSeleccionado, 'puede_vender', null);
                    fila.errorCantidad = '';
                    fila.consultaStockComboTimer = setTimeout(() => {
                        this.consultarStockComboConCantidad(fila, index);
                    }, 450);
                    this.sincronizarCantidadEnTabla(fila);
                    return;
                }

                // LÓGICA DE OBSEQUIOS para productos simples:
                const cantidadTotal = parseInt(fila.libroSeleccionado.p_libros_cantidad) || 0;
                const cantidadAprobada = parseInt(fila.libroSeleccionado.p_libros_cantidad_aprobada) || 0;
                const disponible = cantidadTotal - cantidadAprobada;
                const stockSistema = parseInt(fila.libroSeleccionado.stock) || 0;
                const limiteMaximo = Math.min(disponible, stockSistema);

                if (cantidad > limiteMaximo) {
                    if (disponible <= 0) {
                        fila.errorCantidad = `No hay cantidades disponibles (Todo ya vendido)`;
                    } else if (stockSistema < disponible) {
                        fila.errorCantidad = `Stock insuficiente (máx: ${stockSistema}). Disponible pedido: ${disponible}`;
                    } else {
                        fila.errorCantidad = `No puede exceder lo disponible (máx: ${disponible}). Aprobado: ${cantidadAprobada}, Total: ${cantidadTotal}`;
                    }
                    return;
                }
            }

            // Si todo está bien, sincronizar
            this.sincronizarCantidadEnTabla(fila);
        },

        // Nuevo método para validación final al perder el foco
        validarCantidadFinal(fila, index) {
            if (fila.cantidad && parseInt(fila.cantidad) <= 0) {
                fila.cantidad = '';
                fila.errorCantidad = '';
                this.sincronizarCantidadEnTabla(fila);
            }

            // DESHABILITADO: No eliminar filas automáticamente al borrar
            // Solo verificar eliminación si realmente está vacía
            // if (!fila.libroSeleccionado && (!fila.textoBusqueda || fila.textoBusqueda.trim() === '') && (!fila.cantidad || fila.cantidad.toString().trim() === '')) {
            //     this.verificarYEliminarFilasVacias();
            // }
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

            // Para obsequios, no hay lista pre-cargada
            // Los libros se buscan manualmente en Perseo
            fila.resultadosBusqueda = [];
            fila.sugerenciaActual = null;
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
            console.log('🔍 aceptarYConsultarStock llamado:', { fila, index });
            console.log('   → sugerenciaActual:', fila.sugerenciaActual);
            console.log('   → libroSeleccionado:', fila.libroSeleccionado);

            // Primero aceptar la sugerencia
            if (fila.sugerenciaActual && !fila.libroSeleccionado) {
                console.log('✅ Seleccionando libro en fila...');
                this.seleccionarLibroEnFila(fila, fila.sugerenciaActual, index);

                // Luego consultar stock de Perseo
                console.log('🔄 Consultando stock de Perseo...');
                await this.consultarStockIndividual(fila, index);
            } else {
                console.log('❌ No se cumple condición para aceptar sugerencia');
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
                    codigoProducto,
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
                    me.$set(fila.libroSeleccionado, 'stock', stockDisponible);
                    me.$set(fila, 'stockError', false);
                    me.$set(fila, 'errorCantidad', '');

                    // También actualizar en librosConStock si existe
                    if (me.librosConStock && Array.isArray(me.librosConStock)) {
                        const libroEnTabla = me.librosConStock.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                        if (libroEnTabla) {
                            libroEnTabla.stock = stockDisponible;
                        }
                    }

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

        toggleComboFaltantes(index) {
            const actual = this.comboFaltantesExpandidos[index];
            this.$set(this.comboFaltantesExpandidos, index, !actual);
        },

        manejarBorradoCantidad(fila, index) {
            // Verificar después de un pequeño delay si el campo quedó vacío
            this.$nextTick(() => {
                // Si la cantidad está vacía o es 0, limpiar el libro y enfocar el v-select
                if (!fila.cantidad || fila.cantidad.toString().trim() === '' || fila.cantidad === '0') {

                    // Limpiar cantidad en tabla principal si existe (solo para libros extras)
                    if (fila.libroSeleccionado && this.librosConStock && Array.isArray(this.librosConStock)) {
                        const libroEnTabla = this.librosConStock.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                        if (libroEnTabla) {
                            libroEnTabla.cantidadVenta = '';
                        }
                    }

                    // Limpiar el libro seleccionado
                    fila.libroSeleccionado = null;
                    fila.textoBusqueda = '';
                    fila.cantidad = '';
                    fila.confirmado = false;
                    fila.errorCantidad = '';
                    fila.consultandoStock = false;

                    // Enfocar el v-select de esta fila
                    this.enfocarSelect(index);
                    fila.stockError = false;

                    // Recalcular totales
                    this.calcularTotalesVentas();
                }
            });
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
            fila.confirmado = true; // Automáticamente confirmado al seleccionar

            // Sincronizar con la tabla principal - buscar el libro y actualizar su cantidad
            // (Solo aplica para libros extras)
            if (this.librosConStock && Array.isArray(this.librosConStock)) {
                const libroEnTabla = this.librosConStock.find(l => l.pro_codigo === libro.pro_codigo);
                if (libroEnTabla) {
                    libroEnTabla.cantidadVenta = '';
                }
            }

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

            fila.textoBusqueda = `${libro.pro_codigo} - ${libro.nombre_libro}`;
            fila.cantidad = '';

            const esCombo = this.esLibroComboParaStock(libro);

            if (esCombo) {
                // Combo: NO consultar stock ahora, esperar cantidad
                fila.consultandoStock = false;
                fila.libroSeleccionado = {
                    ...libro,
                    stock: null,
                    puede_vender: null,
                    detalle_faltantes_combo: [],
                    stock_combo_componentes: []
                };
                this.$nextTick(() => {
                    setTimeout(() => { this.enfocarSiguienteInput(index, 'cantidad'); }, 100);
                });
                return;
            }

            // Producto simple: consultar stock al seleccionar
            fila.consultandoStock = true;

            this.consultarStockPerseo([libro.pro_codigo], this.ventaData.empresa)
            .then(stockData => {
                fila.consultandoStock = false;

                if (stockData && stockData[libro.pro_codigo]) {
                    const stockInfo = stockData[libro.pro_codigo];
                    fila.libroSeleccionado = {
                        ...libro,
                        stock: parseInt(stockInfo.existenciastotales || 0),
                        pro_nombre: stockInfo.descripcion || libro.nombre_libro
                    };

                    this.$nextTick(() => {
                        setTimeout(() => { this.enfocarSiguienteInput(index, 'cantidad'); }, 100);
                    });
                } else {
                    fila.libroSeleccionado = { ...libro, stock: 0 };
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
            // Ya no necesitamos limpiar cantidad en tabla principal (librosConStock ya no se usa)

            // Si es la primera fila (index 0), solo limpiar contenido
            if (index === 0) {
                fila.textoBusqueda = '';
                fila.libroSeleccionado = null;
                fila.cantidad = '';
                fila.confirmado = false;
                fila.resultadosBusqueda = [];
                fila.sugerenciaActual = null;
                fila.errorCantidad = '';
                fila.consultandoStock = false;
                fila.stockError = false;

                // Enfocar el v-select después de limpiar
                this.$nextTick(() => {
                    this.enfocarSelect(0);
                });
            } else {
                // Si no es la primera fila, eliminar completamente la fila
                this.filasCaptura.splice(index, 1);

                // Enfocar la cantidad de la fila anterior
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (index > 0) {
                            // Si la fila anterior tiene libro seleccionado, enfocar su cantidad
                            const filaAnterior = this.filasCaptura[index - 1];
                            if (filaAnterior && filaAnterior.libroSeleccionado) {
                                this.enfocarSiguienteInput(index - 1, 'cantidad');
                            } else {
                                // Si no tiene libro, enfocar su v-select
                                this.enfocarSelect(index - 1);
                            }
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
            // Cuando cambia la cantidad en captura rápida, actualizar en la tabla principal
            // (Solo aplica para libros extras)
            if (fila.libroSeleccionado && this.librosConStock && Array.isArray(this.librosConStock)) {
                const libroEnTabla = this.librosConStock.find(l => l.pro_codigo === fila.libroSeleccionado.pro_codigo);
                if (libroEnTabla) {
                    // Si la cantidad está vacía, es 0 o negativa, limpiar en la tabla también
                    if (!fila.cantidad || fila.cantidad.toString().trim() === '' || parseInt(fila.cantidad) <= 0) {
                        libroEnTabla.cantidadVenta = '';
                    } else {
                        // Solo sincronizar si la cantidad es válida
                        const cantidad = parseInt(fila.cantidad);
                        if (cantidad > 0) {
                            libroEnTabla.cantidadVenta = cantidad.toString();
                        }
                    }
                }
            }

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
            if (libro.esLibroExtra) return 0;
            const cantidadPedida = parseInt(libro.cantidad || 0);
            const cantidadVentada = parseInt(libro.cantidadVentada || 0);
            const disponible = cantidadPedida - cantidadVentada;
            return disponible > 0 ? disponible : 0;
        },

        // Método para actualizar cantidades ya vendidas
        actualizarCantidadesVendidas() {
            let me = this;
            if (!me.librosConStock || me.librosConStock.length === 0) return;
            if (!me.librosProformados || me.librosProformados.length === 0) return;

            console.log('Actualizando cantidades proformadas:', me.librosProformados);

            // Actualizar las cantidades proformadas en librosConStock
            me.librosConStock = me.librosConStock.map(libro => {
                const libroProformado = me.librosProformados.find(lp => lp.pro_codigo === libro.pro_codigo);
                const cantidadVentada = libroProformado ? parseInt(libroProformado.cantidad_proformada || 0) : 0;

                console.log(`Libro ${libro.pro_codigo}: cantidad_proformada = ${cantidadVentada}`);

                return {
                    ...libro,
                    cantidadVentada: cantidadVentada
                };
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
            const esLibroExtra = libro.esLibroExtra === true;

            // VALIDACIÓN: Solo validar cantidad DISPONIBLE si NO es libro extra
            if (!esLibroExtra && cantidad > cantidadDisponible) {
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

.headers-form {
    display: flex;
    align-items: center;
    font-size: 11px;
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

/* Mini tabla colapsable de faltantes para combos */
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
