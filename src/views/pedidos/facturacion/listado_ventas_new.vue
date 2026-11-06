<template>
    <div>
        <!-- ===== FILTROS DE VENTA (FUERA DEL CARD) ===== -->
        <div class="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded">
            <h5 class="mr-4 font-bold">Filtros de Venta:</h5>
            <div class="flex items-center space-x-6">
                <div class="flex items-center">
                    <vs-checkbox
                        v-model="filtroVentaDirecta"
                        color="success"
                        :disabled="filtroVentaDirecta && !filtroVentaPorLista"
                    >
                        <span class="font-semibold text-green-700">Venta Directa</span>
                    </vs-checkbox>
                </div>
                <div class="flex items-center">
                    <vs-checkbox
                        v-model="filtroVentaPorLista"
                        color="primary"
                        :disabled="filtroVentaPorLista && !filtroVentaDirecta"
                    >
                        <span class="font-semibold text-blue-700">Venta Por Lista</span>
                    </vs-checkbox>
                </div>
                <vs-chip
                    :color="pedidosFiltrados.length !== allPedidos.length ? 'warning' : 'success'"
                    size="small"
                >
                    <span v-if="filtroVentaDirecta && !filtroVentaPorLista">{{ pedidosFiltrados.length }} directas</span>
                    <span v-else-if="filtroVentaPorLista && !filtroVentaDirecta">{{ pedidosFiltrados.length }} listas</span>
                    <span v-else>{{ pedidosFiltrados.length }}/{{ allPedidos.length }} pedidos</span>
                </vs-chip>
            </div>
        </div>

        <!-- ===== CARD PRINCIPAL: V-SELECT (CAMBIA SEGÚN EL FILTRO) ===== -->
        <vx-card class="mb-4">
            <!-- MODO: VENTA DIRECTA -->
            <div v-if="filtroVentaDirecta">
                <div class="flex items-center mb-2">
                    <vs-checkbox
                        v-model="filtroSoloDevolucionesPendientesDirecta"
                        color="danger"
                        :disabled="loadingPedidosDirecta"
                    >
                        <span class="font-semibold text-red-700">Solo con Devoluciones Pendientes</span>
                    </vs-checkbox>
                </div>
                
                <!-- Skeleton Loader para Venta Directa -->
                <div v-if="loadingPedidosDirecta" class="skeleton-loader-container">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-select"></div>
                </div>
                
                <!-- Contenido real cuando termina de cargar -->
                <div v-else class="flex items-center mb-4">
                    <h4 class="mr-4">Buscar Pedido:</h4>
                    <div style="width: 90%">
                        <v-select
                            :options="pedidosFiltrados"
                            @input="seleccionarPedido"
                            :reduce="(pedido) => pedido"
                            label="nombreCompleto"
                            placeholder="Buscar por institución, pedido, asesor o venta..."
                            :filterable="true"
                            :filter="filtrarPedidosDirecta"
                            v-model="pedidoSeleccionado"
                            class="w-full select-busqueda-ventas"
                        >
                            <template #option="option">
                                <div class="py-2">
                                    <div class="flex items-center justify-between">
                                        <div class="font-bold">{{ option.nombreInstitucion }}</div>
                                        <vs-chip v-if="option.tiene_devoluciones_pendientes" color="danger" size="small">
                                            <i class="fas fa-exclamation-triangle mr-1"></i>
                                            Devoluciones pendientes
                                        </vs-chip>
                                    </div>
                                    <div class="text-sm text-gray-600">Pedido: {{ option.id_pedido }} | Asesor: {{ option.asesor }}</div>
                                    <div class="text-xs text-blue-600">{{ option.contrato_generado || 'Sin contrato' }}</div>
                                    <div class="text-xs text-warning mt-1">
                                        <i class="fas fa-receipt mr-1"></i>
                                        <span class="font-semibold">Ventas:</span>
                                        {{ obtenerVentasTextoContrato(option.contrato_generado) }}
                                    </div>
                                </div>
                            </template>
                        </v-select>
                    </div>
                </div>
            </div>

            <!-- MODO: VENTA POR LISTA -->
            <div v-if="filtroVentaPorLista">
                <div class="flex items-center mb-2">
                    <vs-checkbox
                        v-model="filtroSoloDevolucionesPendientesLista"
                        color="danger"
                        :disabled="loadingTotalizados"
                    >
                        <span class="font-semibold text-red-700">Solo con Devoluciones Pendientes</span>
                    </vs-checkbox>
                </div>
                
                <!-- Skeleton Loader para Venta Por Lista -->
                <div v-if="loadingTotalizados" class="skeleton-loader-container">
                    <div class="flex items-center justify-between mb-3">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-button"></div>
                    </div>
                    <div class="skeleton-select"></div>
                </div>
                
                <!-- Contenido real cuando termina de cargar -->
                <div v-else>
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-bold mb-0">
                            <i class="fas fa-search mr-2"></i>
                            Buscar totalizado:
                        </h5>
                        <vs-button
                            color="success"
                            icon="add_circle"
                            @click="iniciarCreacionTotalizado"
                        >
                            Crear Nuevo Totalizado
                        </vs-button>
                    </div>
                    <v-select
                        :options="contratosAgrupadosFiltrados"
                        @input="totalizado = $event"
                        :reduce="(item) => item"
                        label="ca_descripcion"
                        placeholder="Buscar por descripción, código TVL, contrato, institución o venta..."
                        :filterable="true"
                        :filter="filtrarTotalizados"
                        v-model="totalizado"
                        class="w-full select-busqueda-totalizados"
                        :disabled="modoCrearTotalizado || modoEditarTotalizado"
                    >
                        <template #option="option">
                            <div class="py-2">
                                <div class="flex items-center justify-between">
                                    <div class="font-bold">{{ option.ca_descripcion }}</div>
                                    <vs-chip v-if="tieneDevolucionesPendientesTotalizado(option.ca_codigo_agrupado)" color="danger" size="small">
                                        <i class="fas fa-exclamation-triangle mr-1"></i>
                                        Devoluciones pendientes
                                    </vs-chip>
                                </div>
                                <div class="text-sm text-gray-600">
                                    Código: <span class="font-semibold">{{ option.ca_codigo_agrupado }}</span> |
                                    {{ option.total_contratos }} contrato(s)
                                </div>
                                <div v-if="option.contratos" class="text-xs text-success mt-1">
                                    <i class="fas fa-file-contract mr-1"></i>
                                    <span class="font-semibold">Contratos:</span> {{ option.contratos }}
                                </div>
                            <div class="text-xs text-warning mt-1">
                                <i class="fas fa-receipt mr-1"></i>
                                <span class="font-semibold">Ventas:</span>
                                {{ obtenerVentasTextoTotalizado(option.ca_codigo_agrupado) }}
                            </div>
                            <div v-if="option.instituciones" class="text-xs text-gray-500 mt-1">
                                <i class="fas fa-building mr-1"></i>
                                {{ option.instituciones }}
                            </div>
                            <div class="text-xs mt-1">
                                <span class="text-gray-500">Creado:</span> {{ fechaCorta(option.ca_fecha_creacion) }}
                            </div>
                        </div>
                    </template>
                </v-select>
                </div>
                <!-- Fin de contenido real -->

                <!-- <div class="mt-3" v-if="totalizado">
                    <div class="flex items-center justify-between mb-2">
                        <h6 class="font-bold text-primary mb-0">Ventas del totalizado</h6>
                        <vs-chip :color="ventasTotalizadoSeleccionado.length > 0 ? 'success' : 'warning'" size="small">
                            {{ ventasTotalizadoSeleccionado.length }} venta(s)
                        </vs-chip>
                    </div>

                    <div v-if="loadingVentasTotalizados" class="text-xs text-gray-600 py-2">
                        Cargando ventas del totalizado...
                    </div>

                    <div v-else-if="ventasTotalizadoSeleccionado.length === 0" class="text-xs text-gray-600 py-2">
                        Aún no hay ventas generadas para este totalizado.
                    </div>

                    <div v-else class="ventas-totalizado-lista">
                        <span
                            v-for="venta in ventasTotalizadoSeleccionado"
                            :key="'vt-' + venta.ven_codigo"
                            class="venta-totalizado-chip"
                        >
                            {{ venta.ven_codigo }}
                        </span>
                    </div>
                </div> -->
            </div>
        </vx-card>

        <!-- Popup nativo Vuesax para crear/editar totalizados -->
        <vs-popup
            classContent="popup-example"
            :title="modoEditarTotalizado ? 'Editar Totalizado' : 'Crear Nuevo Totalizado'"
            :active.sync="popupCrearAgrupacion"
            fullscreen
        >
            <div class="p-2">
                <div class="mb-4">
                    <vs-input
                        v-if="modoCrearTotalizado"
                        v-model="descripcionAgrupacion"
                        class="w-full"
                        label="Nombre del Totalizado"
                        placeholder="Ej: Sierra Norte - Mayo"
                    />
                    <vs-input
                        v-else
                        class="w-full"
                        label="Nombre del Totalizado"
                        :value="totalizado ? totalizado.ca_descripcion : ''"
                        readonly
                    />
                </div>
                

                <div class="flex items-center justify-between m-4">
                    <span class="cantidad-badge-totalizados">
                        Ud ha seleccionado {{ pedidosSeleccionados.length }} contrato(s) para el totalizado.
                    </span>
                    <!-- <vs-chip :color="pedidosSeleccionados.length > 0 ? 'success' : 'primary'" size="small">
                    </vs-chip> -->
                    <div class="flex gap-2">
                        <!-- <vs-button color="danger" type="flat" @click="cancelarCreacionEdicion">
                            Cancelar
                        </vs-button> -->
                        <vs-button
                            v-if="modoCrearTotalizado"
                            color="success"
                            :disabled="!descripcionAgrupacion.trim() || pedidosSeleccionados.length === 0 || loadingCrearAgrupacion"
                            @click="crearAgrupacion"
                        >
                            Crear Totalizado
                        </vs-button>
                        <vs-button
                            v-if="modoEditarTotalizado"
                            color="primary"
                            :disabled="!hayCambiosEnTotalizado || loadingActualizarTotalizado"
                            @click="actualizarTotalizado"
                        >
                            <i v-if="loadingActualizarTotalizado" class="fas fa-spinner fa-spin mr-1"></i>
                            Guardar Cambios
                        </vs-button>
                    </div>
                </div>

                <vx-card v-if="modoCrearTotalizado" class="mb-3">
                    <div class="filtros-totalizado mb-3">
                        <div class="filtros-totalizado__inputs">
                            <vs-input
                                v-model="busquedaPedidosTotalizado"
                                class="w-full"
                                icon="search"
                                placeholder="Buscar por contrato, institucion, ciudad o asesor"
                            />
                            <v-select
                                :options="ciudadesPedidosSinAgrupar"
                                v-model="ciudadFiltroTotalizado"
                                :reduce="(item) => item"
                                placeholder="Filtrar por ciudad"
                                :clearable="true"
                                class="w-full"
                            />
                        </div>
                        <div class="filtros-totalizado__meta">
                            <div class="filtros-totalizado__resumen">
                                <span class="resumen-pill resumen-pill--base">
                                    Mostrando {{ pedidosListaFiltrados.length }} de {{ pedidosListaSinAgrupar.length }}
                                </span>
                                <span class="resumen-pill resumen-pill--selected">
                                    Seleccionados visibles: {{ cantidadSeleccionadosVisibles }}/{{ pedidosListaFiltradosBase.length }}
                                </span>
                                <span class="resumen-pill resumen-pill--total">
                                    Total seleccionados: {{ pedidosSeleccionados.length }}
                                </span>
                            </div>
                            <div class="filtros-totalizado__acciones">
                                <vs-checkbox v-model="mostrarSoloSeleccionadosTotalizado" color="success">
                                    <span class="text-sm">Ver solo seleccionados</span>
                                </vs-checkbox>
                                <vs-button
                                    color="primary"
                                    type="border"
                                    size="small"
                                    @click="toggleSeleccionarTodos"
                                    :disabled="pedidosListaFiltradosBase.length === 0"
                                >
                                    {{ todosSeleccionados ? 'Quitar visibles' : 'Seleccionar visibles' }}
                                </vs-button>
                                <vs-button
                                    color="dark"
                                    type="border"
                                    size="small"
                                    @click="limpiarFiltrosPedidosTotalizado"
                                >
                                    Limpiar filtros
                                </vs-button>
                            </div>
                        </div>
                    </div>

                    <vs-table :data="pedidosListaFiltrados" max-items="12">
                        <template slot="header">
                            <h5 class="font-bold text-primary">
                                Pedidos sin totalizado ({{ pedidosListaSinAgrupar.length }})
                            </h5>
                        </template>
                        <template slot="thead">
                            <vs-th style="width: 50px;">
                                <vs-checkbox
                                    color="success"
                                    :checked="todosSeleccionados"
                                    @change="toggleSeleccionarTodos"
                                ></vs-checkbox>
                            </vs-th>
                            <vs-th sort-key="id_pedido"># Contrato</vs-th>
                            <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                            <vs-th sort-key="nombre_ciudad">Ciudad</vs-th>
                            <vs-th sort-key="contrato_generado">Contrato</vs-th>
                            <vs-th sort-key="asesor">Asesor</vs-th>
                            <vs-th sort-key="total_venta">Total</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr
                                :key="indextr"
                                v-for="(tr, indextr) in data"
                                :class="{ 'fila-seleccionada-totalizado': pedidosSeleccionados.includes(tr.id_pedido) }"
                            >
                                <vs-td style="width: 50px;">
                                    <vs-checkbox
                                        color="success"
                                        :checked="pedidosSeleccionados.includes(tr.id_pedido)"
                                        @change="toggleSeleccionPedido(tr.id_pedido)"
                                    ></vs-checkbox>
                                </vs-td>
                                <vs-td>{{ tr.id_pedido }}</vs-td>
                                <vs-td>{{ tr.nombreInstitucion }}</vs-td>
                                <vs-td>{{ tr.nombre_ciudad }}</vs-td>
                                <vs-td>{{ tr.contrato_generado }}</vs-td>
                                <vs-td>{{ tr.asesor }}</vs-td>
                                <vs-td>${{ parseFloat(tr.total_venta || 0).toFixed(2) }}</vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>

                    <div v-if="loadingPedidosLista" class="text-center py-4 text-gray-600">
                        Cargando contratos disponibles...
                    </div>

                    <div v-else-if="pedidosListaSinAgrupar.length === 0" class="text-center py-4 text-gray-600">
                        No hay contratos sin totalizar para este periodo.
                    </div>
                    <div v-else-if="pedidosListaFiltrados.length === 0" class="text-center py-4 text-gray-600">
                        No hay resultados con los filtros aplicados.
                    </div>
                </vx-card>

                <template v-if="modoEditarTotalizado">
                    <vx-card v-if="pedidosDelTotalizado.length > 0" class="mb-3">
                        <vs-table :data="pedidosDelTotalizado" search max-items="8">
                            <template slot="header">
                                <h5 class="font-bold text-success">
                                    Pedidos en el totalizado ({{ pedidosDelTotalizado.length }})
                                </h5>
                                <p v-if="bloquearQuitarContratosTotalizado && !userRoot" class="text-warning text-sm mt-1">
                                    Este totalizado ya tiene ventas registradas. Solo se permite agregar contratos.
                                </p>
                            </template>
                            <template slot="thead">
                                <vs-th style="width: 50px;">
                                    <vs-checkbox
                                        color="success"
                                        :checked="todosDelTotalizadoSeleccionados"
                                        :disabled="bloquearQuitarContratosTotalizado && !userRoot"
                                        @change="toggleSeleccionarTodosDelTotalizado"
                                    ></vs-checkbox>
                                </vs-th>
                                <vs-th sort-key="id_pedido">ID</vs-th>
                                <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                                <vs-th sort-key="nombre_ciudad">Ciudad</vs-th>
                                <vs-th sort-key="contrato_generado">Contrato</vs-th>
                                <vs-th sort-key="asesor">Asesor</vs-th>
                                <vs-th sort-key="total_venta">Total</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr
                                    :key="indextr"
                                    v-for="(tr, indextr) in data"
                                    :class="{ 'fila-seleccionada-totalizado': pedidosSeleccionados.includes(tr.id_pedido) }"
                                >
                                    <vs-td style="width: 50px;">
                                        <vs-checkbox
                                            color="success"
                                            :checked="pedidosSeleccionados.includes(tr.id_pedido)"
                                            :disabled="bloquearQuitarContratosTotalizado && !userRoot"
                                            @change="toggleSeleccionPedido(tr.id_pedido)"
                                        ></vs-checkbox>
                                    </vs-td>
                                    <vs-td>{{ tr.id_pedido }}</vs-td>
                                    <vs-td>{{ tr.nombreInstitucion }}</vs-td>
                                    <vs-td>{{ tr.nombre_ciudad }}</vs-td>
                                    <vs-td>{{ tr.contrato_generado }}</vs-td>
                                    <vs-td>{{ tr.asesor }}</vs-td>
                                    <vs-td>${{ parseFloat(tr.total_venta || 0).toFixed(2) }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vx-card>

                    <vx-card v-if="pedidosDisponiblesParaAgregar.length > 0" class="mb-3">
                        <div class="filtros-totalizado filtros-totalizado--secondary mb-3">
                            <div class="filtros-totalizado__inputs">
                                <vs-input
                                    v-model="busquedaDisponiblesTotalizado"
                                    class="w-full"
                                    icon="search"
                                    placeholder="Buscar disponibles por contrato, institucion, ciudad o asesor"
                                />
                                <v-select
                                    :options="ciudadesDisponiblesTotalizado"
                                    v-model="ciudadFiltroDisponiblesTotalizado"
                                    :reduce="(item) => item"
                                    placeholder="Filtrar disponibles por ciudad"
                                    :clearable="true"
                                    class="w-full"
                                />
                            </div>
                            <div class="filtros-totalizado__meta">
                                <div class="filtros-totalizado__resumen">
                                    <span class="resumen-pill resumen-pill--base">
                                        Mostrando {{ pedidosDisponiblesFiltrados.length }} de {{ pedidosDisponiblesParaAgregar.length }}
                                    </span>
                                    <span class="resumen-pill resumen-pill--selected">
                                        Seleccionados visibles: {{ cantidadSeleccionadosDisponiblesVisibles }}/{{ pedidosDisponiblesFiltradosBase.length }}
                                    </span>
                                </div>
                                <div class="filtros-totalizado__acciones">
                                    <vs-checkbox v-model="mostrarSoloSeleccionadosDisponibles" color="success">
                                        <span class="text-sm">Ver solo seleccionados</span>
                                    </vs-checkbox>
                                    <vs-button
                                        color="primary"
                                        type="border"
                                        size="small"
                                        @click="toggleSeleccionarTodosDisponibles"
                                        :disabled="pedidosDisponiblesFiltradosBase.length === 0"
                                    >
                                        {{ todosDisponiblesSeleccionados ? 'Quitar visibles' : 'Seleccionar visibles' }}
                                    </vs-button>
                                    <vs-button
                                        color="dark"
                                        type="border"
                                        size="small"
                                        @click="limpiarFiltrosDisponiblesTotalizado"
                                    >
                                        Limpiar filtros
                                    </vs-button>
                                </div>
                            </div>
                        </div>

                        <vs-table :data="pedidosDisponiblesFiltrados" max-items="10">
                            <template slot="header">
                                <h5 class="font-bold text-primary">
                                    Pedidos disponibles para agregar ({{ pedidosDisponiblesParaAgregar.length }})
                                </h5>
                            </template>
                            <template slot="thead">
                                <vs-th style="width: 50px;">
                                    <vs-checkbox
                                        color="success"
                                        :checked="todosDisponiblesSeleccionados"
                                        @change="toggleSeleccionarTodosDisponibles"
                                    ></vs-checkbox>
                                </vs-th>
                                <vs-th sort-key="id_pedido">ID</vs-th>
                                <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                                <vs-th sort-key="nombre_ciudad">Ciudad</vs-th>
                                <vs-th sort-key="contrato_generado">Contrato</vs-th>
                                <vs-th sort-key="asesor">Asesor</vs-th>
                                <vs-th sort-key="total_venta">Total</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr
                                    :key="indextr"
                                    v-for="(tr, indextr) in data"
                                    :class="{ 'fila-seleccionada-totalizado': pedidosSeleccionados.includes(tr.id_pedido) }"
                                >
                                    <vs-td style="width: 50px;">
                                        <vs-checkbox
                                            color="success"
                                            :checked="pedidosSeleccionados.includes(tr.id_pedido)"
                                            @change="toggleSeleccionPedido(tr.id_pedido)"
                                        ></vs-checkbox>
                                    </vs-td>
                                    <vs-td>{{ tr.id_pedido }}</vs-td>
                                    <vs-td>{{ tr.nombreInstitucion }}</vs-td>
                                    <vs-td>{{ tr.nombre_ciudad }}</vs-td>
                                    <vs-td>{{ tr.contrato_generado }}</vs-td>
                                    <vs-td>{{ tr.asesor }}</vs-td>
                                    <vs-td>${{ parseFloat(tr.total_venta || 0).toFixed(2) }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>

                        <div v-if="pedidosDisponiblesFiltrados.length === 0" class="text-center py-4 text-gray-600">
                            No hay pedidos disponibles con los filtros aplicados.
                        </div>
                    </vx-card>
                </template>
            </div>
        </vs-popup>

        <!-- Popup Detalle Devolución -->
        <ListaDevoluciones
            :devolucionesFiltradas="devolucionesFiltradasVista"
            :devolucionesTotales="devolucionesTotalesVista"
            :userRoot="userRoot"
            @nc-generada="handleDevolucionNCGenerada"
            @abrir-devolucion="abrirDevolucionDesdeHijo"
            ref="listaDevoluciones"
        />

        <!-- Información del pedido o totalizado seleccionado -->
        <vx-card v-if="pedidoSeleccionado || (filtroVentaPorLista && totalizado)" class="mt-4">
            <template slot="header">
                <div class="flex items-center justify-between">
                    <h3 v-if="totalizado">
                        <i class="fas fa-layer-group mr-2 text-primary"></i>
                        Totalizado - {{ totalizado.ca_codigo_agrupado }} - {{ totalizado.ca_descripcion }}
                    </h3>
                    <h3 v-else>
                        Información de Venta - Pedido #{{ pedidoSeleccionado.id_pedido }}
                    </h3>
                    <vs-button color="danger" size="small" @click="limpiarSeleccion">
                        <i class="fas fa-times"></i> Limpiar
                    </vs-button>
                </div>
            </template>

            <!-- Información del TOTALIZADO -->
            <div v-if="totalizado && !modoEditarTotalizado">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="bg-blue-50 p-4 rounded">
                        <h4 class="font-bold text-primary">Código Totalizado</h4>
                        <p class="font-semibold text-xl">{{ totalizado.ca_codigo_agrupado }}</p>
                        <p class="text-sm text-gray-600">{{ totalizado.ca_descripcion }}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded">
                        <h4 class="font-bold text-success">Total Contratos</h4>
                        <p class="font-semibold text-xl">{{ totalizado.total_contratos || 0 }}</p>
                        <p class="text-sm text-gray-600">contratos agrupados</p>
                    </div>
                </div>
                <div class="border-t pt-4 mb-6">
                    <div class="text-center flex items-center justify-center gap-2">
                        <vs-button color="primary" @click="iniciarEdicionTotalizado" class="px-8">
                            <i class="fas fa-edit mr-2"></i>
                            Editar Totalizado
                        </vs-button>
                        <vs-button
                            color="success"
                            type="border"
                            class="px-8"
                            @click="abrirPopupDetalleContratos"
                            :disabled="detalleContratosTotalizado.length === 0"
                        >
                            <i class="fas fa-list-alt mr-2"></i>
                            Ver Detalle por Contrato
                        </vs-button>
                    </div>
                </div>
            </div>

            <!-- Información básica del PEDIDO (solo en modo Venta Directa) -->
            <div v-if="filtroVentaDirecta && pedidoSeleccionado" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-50 p-4 rounded">
                    <h4 class="font-bold text-primary">Institución</h4>
                    <p class="font-semibold">{{ pedidoSeleccionado.nombreInstitucion }}</p>
                    <p class="text-sm text-gray-600">{{ pedidoSeleccionado.nombre_ciudad }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded">
                    <h4 class="font-bold text-primary">Asesor</h4>
                    <p class="font-semibold">{{ pedidoSeleccionado.asesor }}</p>
                    <p class="text-sm text-gray-600">{{ pedidoSeleccionado.cedula_asesor }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded">
                    <h4 class="font-bold text-primary">Contrato</h4>
                    <p class="font-semibold">{{ pedidoSeleccionado.contrato_generado || 'Sin contrato' }}</p>
                    <p class="text-sm text-gray-600">Tipo: {{ pedidoSeleccionado.tipo_venta == 1 ? 'Directa' : 'Por Lista' }}</p>
                </div>
            </div>

            <!-- Botón de Proformar -->
            <!-- <div class="border-t pt-4 mb-4">
                <div class="text-center">
                    <vs-button color="success" type="gradient" size="large" @click="abrirProforma" class="px-8">
                        <i class="fas fa-file-invoice-dollar mr-2"></i>
                        Proformar
                    </vs-button>
                </div>
            </div> -->

            <!-- Botón de Generar Transacción con Perseo -->
            <div v-if="(filtroVentaDirecta && pedidoSeleccionado) || (filtroVentaPorLista && totalizado && !modoEditarTotalizado)" class="border-t pt-4 mb-4" v-show="tabActiva !== 2">
                <div class="text-center">
                    <vs-button color="success" type="gradient" size="large" @click="abrirVentasPerseo" class="px-8">
                        <i class="fas fa-cash-register mr-2"></i>
                        Generar Transacción
                    </vs-button>
                </div>
            </div>

            <!-- TABS: Listado General y Ventas -->
            <vs-tabs v-if="(filtroVentaDirecta && pedidoSeleccionado) || (filtroVentaPorLista && totalizado && !modoEditarTotalizado)" v-model="tabActiva" class="mt-4">
                <!-- TAB 1: Listado General -->
                <vs-tab label="Listado General" icon="list_alt">
                    <div class="pt-4">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex items-center gap-3">
                                <h4 class="font-bold">{{ totalizado ? 'Libros del Totalizado' : 'Libros del Pedido' }}</h4>
                                <vs-button
                                    color="primary"
                                    type="flat"
                                    icon="refresh"
                                    title="Recargar"
                                    @click="recargarDatosTabla"
                                    :disabled="loadingLibros || loadingVendidos"
                                >
                                </vs-button>
                                <!-- Filtro Mostrar Pendientes -->
                                <vs-checkbox
                                    v-model="filtroPendientes"
                                    color="warning"
                                    class="ml-4"
                                >
                                    <span class="font-semibold text-orange-700">Mostrar solo Pendientes</span>
                                </vs-checkbox>
                                <div class="ml-4" style="min-width: 190px;">
                                    <v-select
                                        :options="lineasProductoOpciones"
                                        :reduce="(item) => item.id"
                                        label="nombre"
                                        v-model="lineaProductoSeleccionada"
                                        :clearable="false"
                                        :searchable="false"
                                        placeholder="Línea"
                                    />
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <vs-chip v-if="librosPedido.length > 0" color="primary">
                                    Total: ${{ calcularTotalPedido() }}
                                </vs-chip>

                            </div>
                        </div>

                        <!-- RESUMEN TOTALES GENERALES (compacto) -->
                        <div v-if="librosParaTabla.length > 0" class="totales-barra mb-3">
                            <div class="totales-barra-inner">
                                <!-- CONTRATO -->
                                <div class="tb-seccion">
                                    <span class="tb-tag tb-tag-contrato">CONTRATO</span>
                                    <span class="tb-dato">Cant. Contrato: <b>{{ totalesGenerales.contrato.cantidadContrato }}</b></span>
                                    <span class="tb-dato">Cant. Hijos Docentes/Obsequios: <b>{{ totalesGenerales.contrato.cantidadHijosDocentes }}</b></span>
                                    <span class="tb-dato tb-dato-total">Cant. Total Base: <b>{{ totalesGenerales.contrato.cantidad }}</b></span>
                                </div>
                                <div class="tb-divisor"></div>
                                <!-- VENTA -->
                                <div class="tb-seccion">
                                    <span class="tb-tag tb-tag-venta">VENTA</span>
                                    <span class="tb-dato tb-dato-total">Cant. Venta: <b>{{ totalesGenerales.venta.cantidad }}</b></span>
                                </div>
                                <div class="tb-divisor"></div>
                                <!-- PENDIENTE -->
                                <div class="tb-seccion">
                                    <span class="tb-tag tb-tag-pendiente">PENDIENTE</span>
                                    <span class="tb-dato tb-dato-total">Cant. Pendiente: <b>{{ totalesGenerales.pendiente.cantidad }}</b></span>
                                </div>
                            </div>
                        </div>

                        <!-- Loading de libros -->
                        <div v-if="loadingLibros" class="text-center py-12">
                            <div class="loading-spinner mb-4">
                                <div class="spinner"></div>
                            </div>
                            <p class="text-gray-600 text-lg">{{ textoLoadingLibros }}</p>
                            <!-- <p v-if="esCargaTotalizado" class="text-sm text-gray-500 mt-2">
                                {{ progresoCargaTotalizadoActual }}/{{ progresoCargaTotalizadoTotal }} contratos procesados
                            </p> -->
                            <div v-if="esCargaTotalizado" class="mt-4">
                                <vs-button
                                    color="danger"
                                    type="border"
                                    size="small"
                                    @click="cancelarCargaTotalizado(true)"
                                >
                                    Cancelar carga
                                </vs-button>
                            </div>
                        </div>

                        <!-- Tabla de libros -->
                        <vs-table stripe v-else-if="librosPedido.length > 0" search :data="librosParaTabla" :max-items="librosParaTabla.length">
                    <template slot="header">
                        <vs-chip color="success">{{ librosParaTabla.length }} libros{{ filtroPendientes ? ' pendientes' : ' encontrados' }}</vs-chip>
                        <vs-chip v-if="filtroPendientes" color="warning" class="ml-2">Filtro: Pendientes</vs-chip>
                        <vs-button
                            v-if="librosParaTabla.length > 0"
                            color="success"
                            type="gradient"
                            icon="get_app"
                            @click="exportarExcel"
                            title="Exportar a Excel"
                            class="ml-2"
                        >
                            Exportar Excel
                        </vs-button>
                    </template>

                    <template slot="thead">
                        <vs-th sort-key="codigo">Código</vs-th>
                        <vs-th sort-key="nombre_libro">Libro</vs-th>
                        <vs-th sort-key="linea_producto_id">Línea</vs-th>
                        <vs-th sort-key="cantidad">
                            <div class="header-contrato">
                                <div class="contrato-label">CONTRATO</div>
                                <div>Cantidad</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="precio">
                            <div class="header-contrato">
                                <div class="contrato-label">CONTRATO</div>
                                <div>Precio Unit.</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="subtotal">
                            <div class="header-contrato">
                                <div class="contrato-label">CONTRATO</div>
                                <div>Subtotal</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="descuento">
                            <div class="header-contrato">
                                <div class="contrato-label">CONTRATO</div>
                                <div>Descuento</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="total">
                            <div class="header-contrato">
                                <div class="contrato-label">CONTRATO</div>
                                <div>Total</div>
                            </div>
                        </vs-th>
                        <!-- COLUMNAS DE PROFORMA - YA NO SE USA
                        <vs-th sort-key="cantidad_proformada">
                            <div class="header-proforma">
                                <div class="proforma-label">PROFORMA</div>
                                <div>Cantidad</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="descuento_proforma">
                            <div class="header-proforma">
                                <div class="proforma-label">PROFORMA</div>
                                <div>Descuento</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="subtotal_proformado">
                            <div class="header-proforma">
                                <div class="proforma-label">PROFORMA</div>
                                <div>Subtotal</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="total_proformado">
                            <div class="header-proforma">
                                <div class="proforma-label">PROFORMA</div>
                                <div>Total</div>
                            </div>
                        </vs-th>
                        -->
                        <!-- COLUMNAS DE VENTAS -->
                        <vs-th sort-key="cantidad_vendida">
                            <div class="header-venta">
                                <div class="venta-label">VENTA</div>
                                <div>Cantidad + %</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="subtotal_vendido">
                            <div class="header-venta">
                                <div class="venta-label">VENTA</div>
                                <div>Subtotal</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="total_vendido">
                            <div class="header-venta">
                                <div class="venta-label">VENTA</div>
                                <div>Total</div>
                            </div>
                        </vs-th>
                        <!-- COLUMNA PENDIENTE A FACTURAR -->
                        <vs-th sort-key="pendiente_cantidad">
                            <div class="header-pendiente">
                                <div class="pendiente-label">PENDIENTE</div>
                                <div>Cantidad</div>
                            </div>
                        </vs-th>
                        <vs-th sort-key="pendiente_valor">
                            <div class="header-pendiente">
                                <div class="pendiente-label">PENDIENTE</div>
                                <div>Valor</div>
                            </div>
                        </vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :data="libro" :key="index" v-for="(libro, index) in data">
                            <vs-td>
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                                    <!-- Badge para libros extras - ARRIBA -->
                                    <span v-if="getCantidadHijosDocentes(libro) > 0" class="libro-extra-badge">
                                        <i class="fas fa-graduation-cap"></i> HIJO DOCENTE
                                    </span>
                                    <span v-else-if="libro.esLibroExtra" class="libro-extra-badge">
                                        <i class="fas fa-plus"></i> EXTRA
                                    </span>
                                    <!-- Código del libro - ABAJO -->
                                    <div class="font-mono text-sm font-bold text-primary">
                                        {{ libro.pro_codigo }}
                                    </div>
                                </div>
                            </vs-td>

                            <vs-td>
                                <div style="max-width: 300px;">
                                    <p class="font-semibold">{{ libro.nombre_libro }}</p>
                                </div>
                            </vs-td>

                            <vs-td>
                                <vs-chip :color="getColorLineaProducto(libro.linea_producto_id)" size="small">
                                    {{ getNombreLineaProducto(libro.linea_producto_id) }}
                                </vs-chip>
                            </vs-td>

                            <!-- COLUMNAS DE CONTRATO -->
                            <vs-td>
                                <div class="flex flex-col items-center justify-center gap-1">
                                    <!-- Cantidad principal (CONTRATO) -->
                                    <div class="w-full text-center">
                                        <span class="cantidad-badge-venta font-bold">{{ libro.cantidad}}</span>
                                        <div class="text-xs text-gray-500 font-light">pedido</div>
                                    </div>
                                    <!-- Cantidad hijos docentes (si aplica) - FILA ADICIONAL -->
                                    <div v-if="getCantidadHijosDocentes(libro) > 0" class="w-full text-center border-t pt-1">
                                        <span class="cantidad-badge-obsequios font-bold">{{ getCantidadHijosDocentes(libro) }}</span>
                                        <div class="text-xs text-blue-600 font-light">hijos doc</div>
                                    </div>
                                </div>
                            </vs-td>

                            <vs-td>
                                <span class="font-semibold text-green-600">
                                    ${{ parseFloat(libro.precio).toFixed(2) }}
                                </span>
                            </vs-td>

                            <vs-td>
                                <span class="font-semibold text-blue-600">
                                    ${{ calcularSubtotalLibro(libro) }}
                                </span>
                            </vs-td>

                            <vs-td>
                                <vs-chip :color="libro.descuento > 0 ? 'warning' : 'dark'" size="small">
                                    {{ libro.descuento }}%
                                </vs-chip>
                            </vs-td>

                            <vs-td>
                                <span class="font-bold text-primary text-lg">
                                    ${{ calcularTotalLibro(libro) }}
                                </span>
                            </vs-td>

                            <!-- COLUMNAS DE PROFORMA - YA NO SE USA
                            <vs-td>
                                <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 0">
                                    <div v-for="(detalle, idx) in getDetallesProformaPorDescuento(libro.pro_codigo)" :key="idx" class="detalle-row">
                                        <span class="cantidad-badge">{{ detalle.cantidad }}</span>
                                        <span v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 1 && detalle.descuento > 0" class="descuento-badge-small">{{ detalle.descuento }}%</span>
                                    </div>
                                    <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 1" class="total-row">
                                        <strong class="cantidad-total">{{ getDatosProforma(libro.pro_codigo).cantidadTotal }}</strong>
                                    </div>
                                </div>
                                <span v-else class="cantidad-cero">0</span>
                            </vs-td>

                            <vs-td>
                                <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 0">
                                    <div v-for="(detalle, idx) in getDetallesProformaPorDescuento(libro.pro_codigo)" :key="idx" class="detalle-row">
                                        <span :class="detalle.descuento > 0 ? 'descuento-badge' : 'descuento-cero'">{{ detalle.descuento }}%</span>
                                    </div>
                                    <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 1" class="total-row">
                                        <small class="variados-label">Variados</small>
                                    </div>
                                </div>
                                <span v-else class="descuento-cero">0%</span>
                            </vs-td>

                            <vs-td>
                                <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 0">
                                    <div v-for="(detalle, idx) in getDetallesProformaPorDescuento(libro.pro_codigo)" :key="idx" class="detalle-row">
                                        <span class="monto-detalle">${{ detalle.subtotal }}</span>
                                    </div>
                                    <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 1" class="total-row">
                                        <span class="monto-total">${{ getDatosProforma(libro.pro_codigo).subtotalTotal }}</span>
                                    </div>
                                </div>
                                <span v-else class="font-semibold text-purple-600">$0.00</span>
                            </vs-td>

                            <vs-td>
                                <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 0">
                                    <div v-for="(detalle, idx) in getDetallesProformaPorDescuento(libro.pro_codigo)" :key="idx" class="detalle-row">
                                        <span class="monto-detalle monto-success">${{ detalle.total }}</span>
                                    </div>
                                    <div v-if="getDetallesProformaPorDescuento(libro.pro_codigo).length > 1" class="total-row">
                                        <span class="monto-total monto-total-success">${{ getDatosProforma(libro.pro_codigo).totalTotal }}</span>
                                    </div>
                                </div>
                                <span v-else class="font-bold text-success text-lg">$0.00</span>
                            </vs-td>
                            -->
                            <!-- COLUMNAS DE VENTAS - CANTIDAD Y DESCUENTO COMBINADOS -->
                            <vs-td>
                                <!-- VENTAS DE PEDIDOS (Normal, sin obsequios) -->
                                <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 0" class="mb-2">
                                    <div v-for="(detalle, idx) in getDetallesVentaPorDescuento(libro.pro_codigo, 0)" :key="'vp-' + idx" class="detalle-row flex items-center justify-center gap-2">
                                        <span class="cantidad-badge-venta font-bold">{{ detalle.cantidad }}</span>
                                        <vs-chip :color="detalle.descuento > 0 ? 'warning' : 'dark'" size="small">{{ detalle.descuento }}%</vs-chip>
                                        <!-- detalle.detalle es array de documentos agrupados bajo el mismo descuento -->
                                        <vx-tooltip v-if="detalle.detalle && detalle.detalle.length > 0" :text="detalle.detalle.join('\n')" position="top">
                                            <vs-chip color="primary" size="small">{{ detalle.detalle.length }} doc{{ detalle.detalle.length > 1 ? 's' : '' }}</vs-chip>
                                        </vx-tooltip>
                                    </div>
                                </div>
                                
                                <!-- VENTAS DE HIJOS DOCENTES (Obsequios) -->
                                <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 1).length > 0" :class="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 0 ? 'mt-2 border-t pt-2' : ''">
                                    <div v-for="(detalle, idx) in getDetallesVentaPorDescuento(libro.pro_codigo, 1)" :key="'vo-' + idx" class="detalle-row flex items-center justify-center gap-2">
                                        <span class="cantidad-badge-obsequios font-bold">{{ detalle.cantidad }}</span>
                                        <vs-chip :color="detalle.descuento > 0 ? 'warning' : 'dark'" size="small">{{ detalle.descuento }}%</vs-chip>
                                    </div>
                                </div>

                                <span v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length === 0 && getDetallesVentaPorDescuento(libro.pro_codigo, 1).length === 0" class="cantidad-cero text-center">0</span>
                            </vs-td>

                            <vs-td>
                                <!-- SUBTOTALES VENTAS NORMALES -->
                                <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 0" class="mb-2">
                                    <div v-for="(detalle, idx) in getDetallesVentaPorDescuento(libro.pro_codigo, 0)" :key="'sp-' + idx" class="detalle-row">
                                        <span class="monto-detalle monto-venta">${{ detalle.subtotal }}</span>
                                    </div>
                                    <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 1" class="total-row border-t pt-1">
                                        <span class="monto-total monto-total-venta font-bold">Sub: ${{ getDatosVenta(libro.pro_codigo, 0).subtotalTotal }}</span>
                                    </div>
                                </div>

                                <!-- SUBTOTALES VENTAS OBSEQUIOS -->
                                <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 1).length > 0" :class="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 0 ? 'mt-2 border-t pt-2' : ''">
                                    <div v-for="(detalle, idx) in getDetallesVentaPorDescuento(libro.pro_codigo, 1)" :key="'so-' + idx" class="detalle-row">
                                        <span class="monto-detalle" style="color: #3b82f6;">${{ detalle.subtotal }}</span>
                                    </div>
                                    <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 1).length > 1" class="total-row border-t pt-1">
                                        <span class="monto-total" style="color: #3b82f6; font-weight: bold;">Sub: ${{ getDatosVenta(libro.pro_codigo, 1).subtotalTotal }}</span>
                                    </div>
                                </div>

                                <span v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length === 0 && getDetallesVentaPorDescuento(libro.pro_codigo, 1).length === 0" class="font-semibold text-orange-600">$0.00</span>
                            </vs-td>

                            <vs-td>
                                <!-- TOTALES VENTAS NORMALES -->
                                <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 0" class="mb-2">
                                    <div v-for="(detalle, idx) in getDetallesVentaPorDescuento(libro.pro_codigo, 0)" :key="'tp-' + idx" class="detalle-row">
                                        <span class="monto-detalle monto-success-venta">${{ detalle.total }}</span>
                                    </div>
                                    <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 1" class="total-row border-t pt-1">
                                        <span class="monto-total monto-total-success-venta font-bold">Total: ${{ getDatosVenta(libro.pro_codigo, 0).totalTotal }}</span>
                                    </div>
                                </div>

                                <!-- TOTALES VENTAS OBSEQUIOS -->
                                <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 1).length > 0" :class="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length > 0 ? 'mt-2 border-t pt-2' : ''">
                                    <div v-for="(detalle, idx) in getDetallesVentaPorDescuento(libro.pro_codigo, 1)" :key="'to-' + idx" class="detalle-row">
                                        <span class="monto-detalle" style="color: #3b82f6;">${{ detalle.total }}</span>
                                    </div>
                                    <div v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 1).length > 1" class="total-row border-t pt-1">
                                        <span class="monto-total" style="color: #3b82f6; font-weight: bold;">Total: ${{ getDatosVenta(libro.pro_codigo, 1).totalTotal }}</span>
                                    </div>
                                </div>

                                <span v-if="getDetallesVentaPorDescuento(libro.pro_codigo, 0).length === 0 && getDetallesVentaPorDescuento(libro.pro_codigo, 1).length === 0" class="font-bold text-danger text-lg">$0.00</span>
                            </vs-td>
                            <!-- COLUMNA PENDIENTE - Cantidad -->
                            <vs-td>
                                <span class="cantidad-badge-venta">{{ calcularPendienteCantidad(libro) }}</span>
                            </vs-td>
                            <!-- COLUMNA PENDIENTE - Valor -->
                            <vs-td>
                                <span
                                    :class="calcularPendienteValor(libro) > 0 ? 'font-bold text-orange-600 text-lg' : 'font-bold text-green-600 text-lg'"
                                >
                                    ${{ calcularPendienteValor(libro) }}
                                </span>
                            </vs-td>
                        </vs-tr>
                    </template>

                    <!-- FILA DE TOTALES POR COLUMNA -->
                    <template slot="footer">
                        <div class="totales-fila-container">
                            <table class="totales-tabla">
                                <tr class="totales-row">
                                    <td class="totales-cell totales-label-cell" colspan="2">
                                        <strong>TOTALES</strong>
                                    </td>
                                    <td class="totales-cell">—</td>
                                    <!-- Total Contrato Cantidad -->
                                    <td class="totales-cell">
                                        <div class="flex items-center justify-center" style="flex-direction: column; gap: 4px;">
                                            <span class="cantidad-total-venta">{{ totalesColumnas.contratoCantidad }}</span>
                                            <span class="cantidad-badge-venta">{{ totalesColumnas.hijosDocentesCantidad }}</span>
                                        </div>
                                    </td>
                                    <!-- Total Contrato Precio (vacío) -->
                                    <td class="totales-cell">—</td>
                                    <!-- Total Contrato Subtotal -->
                                    <td class="totales-cell">—</td>
                                    <!-- Total Contrato Descuento (vacío) -->
                                    <td class="totales-cell">—</td>
                                    <!-- Total Contrato Total -->
                                    <td class="totales-cell">—</td>
                                    <!-- Total Venta Cantidad -->
                                    <td class="totales-cell">
                                        <span class="cantidad-total-venta">{{ totalesColumnas.ventaCantidad }}</span>
                                    </td>
                                    <!-- Total Venta Subtotal -->
                                    <td class="totales-cell">—</td>
                                    <!-- Total Venta Total -->
                                    <td class="totales-cell">—</td>
                                    <!-- Total Pendiente Cantidad -->
                                    <td class="totales-cell">
                                        <span class="cantidad-total-venta">{{ totalesColumnas.pendienteCantidad }}</span>
                                    </td>
                                    <!-- Total Pendiente Valor -->
                                    <td class="totales-cell">—</td>
                                </tr>
                            </table>
                        </div>
                    </template>
                </vs-table>

                        <!-- Sin libros -->
                        <div v-else-if="!loadingLibros" class="bg-orange-50 p-4 rounded text-center">
                            <i class="fas fa-book text-2xl text-orange-400 mb-2"></i>
                            <p class="text-orange-600">No se encontraron libros para este pedido</p>
                        </div>
                    </div>
                </vs-tab>

                <!-- TAB 3: Ventas -->
                <vs-tab label="Ventas" icon="shopping_cart">
                    <div class="pt-4">
                        <!-- Componente de Lista de Ventas -->
                        <ListaVentas
                            ref="listaVentas"
                            :contrato="pedidoSeleccionado ? pedidoSeleccionado.contrato_generado : null"
                            :totalizado="totalizado ? totalizado.ca_codigo_agrupado : null"
                            :key="pedidoSeleccionado ? ('ventas-' + pedidoSeleccionado.contrato_generado) : ('ventas-t-' + totalizado.ca_codigo_agrupado)"
                            :librosPedido="librosPedido"
                            :periodo-select="periodoSelect"
                            :pedido-original="pedidoSeleccionado"
                            :user-root="userRoot"
                            @venta-anulada="handleVentaAnulada"
                        />
                    </div>
                </vs-tab>

                <!-- TAB Libros hijos docentes/obsequios -->
                <vs-tab label="Libros Docentes/Obsequios" icon="book">
                    <div class="pt-4">
                        <ListadoPedidosObsequios
                            v-if="pedidoSeleccionado || (filtroVentaPorLista && totalizado)"
                            ref="listadoObsequios"
                            :key="pedidoSeleccionado ? ('obsequios-c-' + pedidoSeleccionado.contrato_generado) : ('obsequios-t-' + totalizado.ca_codigo_agrupado)"
                            :contrato="pedidoSeleccionado ? pedidoSeleccionado.contrato_generado : null"
                            :totalizado="totalizado"
                            :pedido-original="pedidoSeleccionado ? pedidoSeleccionado : {}"
                            :periodo-select="periodoSelect"
                            @venta-obsequio-generada="handleVentaObsequioGenerada"
                        />
                        <div v-else class="text-center text-gray-500 py-8">
                            <feather-icon icon="PackageIcon" svgClasses="h-16 w-16 opacity-50"/>
                            <p class="mt-2">Seleccione un pedido para ver los obsequios</p>
                        </div>
                    </div>
                </vs-tab>

                <!-- TAB: Devoluciones -->
                <vs-tab :label="'Devoluciones (' + devolucionesCount + ')'" icon="receipt">
                    <TabDevoluciones
                        :devoluciones="devolucionesVistaPendientes"
                        :loading="loadingDevoluciones"
                        :loading-ver="loadingVerDevolucion"
                        :error-msg="errorDevolucionesMsg"
                        @reintentar="getDatosConsolidados"
                        @ver-devolucion="abrirDevolucionConLoading"
                    />
                </vs-tab>
                <!-- TAB 2: Proformas -->
                <!-- <vs-tab label="Proformas" icon="receipt">
                    Loading de proformas
                    <div v-if="loadingProformas" class="text-center py-12">
                        <div class="loading-spinner mb-4">
                            <div class="spinner"></div>
                        </div>
                        <p class="text-gray-600 text-lg">Cargando proformas...</p>
                    </div>

                    Componente de Lista de Proformas
                    <ListaProformas
                        v-else
                        ref="listaProformas"
                        :librosPedido="librosPedido"
                        :contrato="pedidoSeleccionado.contrato_generado"
                        :key="pedidoSeleccionado.contrato_generado"
                        @editar-proforma="cargarProformaParaEditar"
                        @venta-creada="handleVentaCreada"
                    />
                </vs-tab> -->
                <!-- TAB 4: Stock Perseo -->
                <!-- <vs-tab label="Stock Perseo">
                    <div class="pt-4">
                        <ListadoGeneralPerseo
                            :librosPedido="librosPedido"
                            :idEmpresa="pedidoSeleccionado ? pedidoSeleccionado.id_empresa : 1"
                        />
                    </div>
                </vs-tab> -->
            </vs-tabs>
        </vx-card>

        <!-- Mensaje cuando no hay pedido seleccionado -->
        <vx-card v-else class="mt-4">
            <div class="text-center py-8">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-gray-600 mb-2">No hay pedido seleccionado</h3>
                <p class="text-gray-500">Utiliza el buscador de arriba para seleccionar un pedido y ver su información de venta</p>
            </div>
        </vx-card>

        <vs-popup
            title="Detalle pedido por contrato"
            :active.sync="popupDetalleContratosTotalizado"
            fullscreen
        >
            <div class="p-4">
                <div v-if="totalizado" class="mb-4">
                    <h4 class="font-bold text-primary mb-1">{{ totalizado.ca_codigo_agrupado }}</h4>
                    <p class="text-sm text-gray-600">{{ totalizado.ca_descripcion }}</p>
                </div>

                <div v-if="detalleContratosTotalizado.length > 0">
                    <div class="mb-4">
                        <h5 class="font-bold text-primary mb-2">Seleccionar contrato</h5>
                        <v-select
                            :options="detalleContratosTotalizado"
                            v-model="detalleContratoSeleccionado"
                            :reduce="(item) => item"
                            label="contrato_generado"
                            placeholder="Buscar contrato..."
                            :filterable="true"
                        >
                            <template #option="option">
                                <div class="py-1">
                                    <div class="font-semibold">{{ option.contrato_generado }}</div>
                                    <div class="text-xs text-gray-500">{{ option.institucion }}</div>
                                </div>
                            </template>
                        </v-select>
                    </div>

                    <div v-if="detalleContratoSeleccionado" class="pt-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div class="bg-gray-50 p-3 rounded">
                                <h5 class="font-bold text-primary">Contrato</h5>
                                <p class="font-semibold">{{ detalleContratoSeleccionado.contrato_generado }}</p>
                                <p class="text-sm text-gray-600">{{ detalleContratoSeleccionado.institucion }}</p>
                            </div>
                            <div class="bg-gray-50 p-3 rounded">
                                <h5 class="font-bold text-success">Libros del contrato</h5>
                                <p class="font-semibold text-xl">{{ detalleContratoSeleccionado.libros.length }}</p>
                                <p class="text-sm text-gray-600">items consolidados</p>
                            </div>
                        </div>

                        <vs-table v-if="detalleContratoSeleccionado.libros.length > 0" stripe search :data="detalleContratoSeleccionado.libros" :max-items="detalleContratoSeleccionado.libros.length">
                            <template slot="header">
                                <vs-chip color="primary">{{ detalleContratoSeleccionado.libros.length }} libros</vs-chip>
                            </template>

                            <template slot="thead">
                                <vs-th>Código</vs-th>
                                <vs-th>Libro</vs-th>
                                <vs-th>Cantidad</vs-th>
                                <vs-th>Precio</vs-th>
                                <vs-th>Subtotal</vs-th>
                                <vs-th>Desc.</vs-th>
                                <vs-th>Total</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr v-for="(item, index) in data" :key="index">
                                    <vs-td>{{ item.pro_codigo }}</vs-td>
                                    <vs-td>{{ item.nombre_libro }}</vs-td>
                                    <vs-td>{{ item.cantidad }}</vs-td>
                                    <vs-td>${{ parseFloat(item.precio || 0).toFixed(2) }}</vs-td>
                                    <vs-td>${{ calcularSubtotalLibro(item) }}</vs-td>
                                    <vs-td>{{ parseFloat(item.descuento || 0).toFixed(2) }}%</vs-td>
                                    <vs-td>${{ calcularTotalLibro(item) }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>

                        <div v-else class="text-center py-8 text-gray-500">
                            No se encontraron libros para este contrato.
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-8 text-gray-500">
                    No hay detalle cargado por contrato.
                </div>
            </div>
        </vs-popup>

        <!-- Modal para CREAR Proforma -->
        <!-- <ProformaModal
            :visible.sync="popupProforma"
            :pedidoSeleccionado="pedidoSeleccionado"
            :librosPedido="librosPedido"
            @cerrar="cerrarProforma"
            @generar-proforma="handleGenerarProforma"
        /> -->

        <!-- Modal para CREAR Venta con Perseo -->
        <VentaModalPerseo
            :visible.sync="popupProformaPerseo"
            :pedidoSeleccionado="pedidoSeleccionado"
            :librosPedido="librosPedido"
            :librosVendidos="librosVendidosSoloNormales"
            :periodo-select="periodoSelect"
            :totalizado="totalizado"
            :linea-seleccionada="lineaProductoSeleccionada"
            @cerrar="cerrarProformaPerseo"
            @generar-venta="handleGenerarProformaPerseo"
        />

        <!-- Modal para EDITAR Proforma Normal -->
        <!-- <ProformaEditarModal
            :visible.sync="popupProformaEditar"
            :proformaId="proformaEditarId"
            :pedidoSeleccionado="pedidoSeleccionado"
            :librosPedido="librosPedido"
            :cantidadProformasContrato="cantidadProformasContrato"
            @cerrar="cerrarProformaEditar"
            @actualizar-proforma="handleActualizarProforma"
        /> -->

        <!-- Modal para EDITAR Venta PERSEO -->
        <!-- <VentaEditarModalPerseo
            :visible.sync="popupProformaEditarPerseo"
            :ventaId="proformaEditarId"
            :pedidoSeleccionado="pedidoSeleccionado"
            :librosPedido="librosPedido"
            :periodo-select="periodoSelect"
            :cantidadProformasContrato="cantidadProformasContrato"
            @cerrar="cerrarProformaEditarPerseo"
            @venta-actualizada="handleActualizarProforma"
        /> -->

    </div>
    </template>

    <script>
    import * as XLSX from 'xlsx';
    import vSelect from 'vue-select';
    import TabDevoluciones from './components/TabDevoluciones.vue';
    // const ProformaModal = () => import('./proformas/ProformaModal.vue');
    // const ProformaModalPerseo = () => import('./perseo/proforma/ProformaModalPerseo.vue');
    // const ProformaEditarModalPerseo = () => import('./perseo/proforma/ProformaEditarModalPerseo.vue');
    const VentaModalPerseo = () => import('./perseo/ventas/VentaModalPerseo.vue');
    // const VentaEditarModalPerseo = () => import('./perseo/ventas/VentaEditarModalPerseo.vue');
    const ListadoPedidosObsequios = () => import('./perseo/obsequios/ListadoPedidosObsequios.vue');
    // const ProformaEditarModal = () => import('./proformas/ProformaEditarModal.vue');
    // const ListaProformas = () => import('./proformas/ListaProformas.vue');
    const ListaVentas = () => import('./Ventas/ListaVentas.vue');
    const ListadoGeneralPerseo = () => import('./perseo/ListadoGeneralPerseo.vue');
    const ListaDevoluciones = () => import('./devoluciones/ListaDevoluciones.vue');

    export default {
        components: {
            vSelect,
            TabDevoluciones,
            // ProformaModal,
            VentaModalPerseo,
            // VentaEditarModalPerseo,
            ListadoPedidosObsequios,
            // ProformaEditarModal,
            // ListaProformas,
            ListaVentas,
            ListadoGeneralPerseo,
            ListaDevoluciones
        },
        data() {
            return {
                // Variables para el v-select general
                allPedidos: [],
                pedidoSeleccionado: null,
                // Variables para filtros de tipo de venta
                filtroVentaDirecta: true,
                filtroVentaPorLista: false,
                filtroSoloDevolucionesPendientesDirecta: false,
                filtroSoloDevolucionesPendientesLista: false,
                pedidosFiltrados: [],
                // Variables de loading para skeletons
                loadingPedidosDirecta: false,
                loadingTotalizados: false,
                // Filtro de pendientes
                filtroPendientes: false,
                // Variables para los libros del pedido
                librosPedido: [],
                loadingLibros: false,
                // Variable para el modal de proforma CREAR
                popupProforma: false,
                // Variable para el modal de proforma PERSEO
                popupProformaPerseo: false,
                // Variable para el modal de proforma EDITAR
                popupProformaEditar: false,
                popupProformaEditarPerseo: false,
                proformaEditarId: null,
                cantidadProformasContrato: 0,
                // Variables para libros proformados - YA NO SE USA
                // librosProformados: [],
                // loadingProformados: false,
                // Variables para libros vendidos
                librosVendidos: [],
                loadingVendidos: false,
                // Variable para tabs
                tabActiva: 0,
                loadingProformas: false,
                // ===== NUEVAS VARIABLES PARA VENTA LISTA (TOTALIZADOS) =====
                pedidosSinAgrupar: [],
                pedidosSeleccionados: [],
                loadingPedidosSinAgrupar: false,
                popupCrearAgrupacion: false,
                popupDetalleContratosTotalizado: false,
                descripcionAgrupacion: '',
                loadingCrearAgrupacion: false,
                loadingActualizarTotalizado: false,
                contratosAgrupados: [],
                totalizado: null,
                loadingTotalizado: false,
                loadingVentasTotalizados: false,
                loadingDatosConsolidados: false, // NUEVO: Flag para evitar llamadas duplicadas
                ventasPorTotalizados: [],
                ventasPorContrato: [],
                // Variables para DEVOLUCIONES
                devoluciones: [],
                devolucionesPorTotalizados: [],
                devolucionesPorContrato: [],
                loadingDevoluciones: false,
                errorDevolucionesMsg: '',
                loadingVerDevolucion: false,
                devolucionSeleccionada: null,
                detallesDevolucion: [],
                detallesDevolucionEdicion: [],
                showModalDevolucion: false,
                loadingGenerarNC: false,
                previewNotaCreditoNC: null,
                empresaPruebaNC: null,
                filtroPendientesNC: false,
                totalesDetalleDevolucion: {
                    total_items: 0,
                    total_cantidad: 0,
                    total_valor: 0,
                    total_valor_descuento: 0,
                    total_mismatches: 0,
                },
                devolucionesTotalesGlobales: {
                    total_documentos: 0,
                    total_items: 0,
                    total_cantidad: 0,
                    total_valor: 0,
                    total_valor_descuento: 0,
                },
                mostrarTablaPedidosSinAgrupar: false,
                modoCrearTotalizado: false,
                modoEditarTotalizado: false,
                // Nuevas variables para mostrar TODOS los pedidos de lista
                pedidosListaCompletos: [],
                loadingPedidosLista: false,
                busquedaPedidosTotalizado: '',
                ciudadFiltroTotalizado: null,
                mostrarSoloSeleccionadosTotalizado: false,
                busquedaDisponiblesTotalizado: '',
                ciudadFiltroDisponiblesTotalizado: null,
                mostrarSoloSeleccionadosDisponibles: false,
                detalleContratosTotalizado: [],
                detalleContratoSeleccionado: null,
                detalleHijosDocentesPorLibro: [],
                // Estado de carga local para totalizados
                esCargaTotalizado: false,
                textoLoadingLibros: 'Cargando libros...',
                progresoCargaTotalizadoActual: 0,
                progresoCargaTotalizadoTotal: 0,
                tokenCargaTotalizado: 0,
                bloquearQuitarContratosTotalizado: false,
                loadingVerificarVentasTotalizado: false,
                lineaProductoSeleccionada: null,
                lineasProductoOpciones: [],
            }
        },
        created() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
        },
        mounted() {
            let me = this;
            me.getPedidos();
            me.cargarLineasProducto();
        },
        watch: {
            // Watcher para reinicializar filtros cuando cambie el periodo
            periodoSelect: {
                handler(newVal, oldVal) {
                    if (newVal && newVal !== oldVal) {
                        this.getPedidos();
                    }
                },
                deep: true
            },
            // Watcher para Venta Directa (exclusividad y limpieza)
            filtroVentaDirecta(newVal) {
                let me = this;
                if (newVal) {
                    me.cancelarCargaTotalizado(false);
                    me.filtroVentaPorLista = false;
                    me.popupCrearAgrupacion = false;
                    me.totalizado = null;
                    me.pedidosListaCompletos = [];
                    me.pedidosSeleccionados = [];
                    me.librosPedido = [];
                    me.modoCrearTotalizado = false;
                    me.modoEditarTotalizado = false;
                } else {
                    if (!me.filtroVentaPorLista) {
                        me.filtroVentaDirecta = true;
                    }
                }
                me.aplicarFiltros();
            },
            // Watcher para Venta Por Lista (exclusividad y carga de datos)
            filtroVentaPorLista(newVal) {
                let me = this;
                if (newVal) {
                    me.cancelarCargaTotalizado(false);
                    me.filtroVentaDirecta = false;
                    me.pedidoSeleccionado = null;
                    me.librosPedido = [];
                    me.popupCrearAgrupacion = false;
                    me.modoCrearTotalizado = false;
                    me.modoEditarTotalizado = false;
                    me.cargarPedidosLista();
                    me.getContratosAgrupados();
                    // NO llamar getDevoluciones() ni getVentasPorTotalizados() aquí, ya se cargaron con getDatosConsolidados()
                } else {
                    me.cancelarCargaTotalizado(false);
                    if (!me.filtroVentaDirecta) {
                        me.filtroVentaPorLista = true;
                    }
                    me.popupCrearAgrupacion = false;
                    me.pedidosListaCompletos = [];
                    me.pedidosSeleccionados = [];
                    me.totalizado = null;
                    me.modoCrearTotalizado = false;
                    me.modoEditarTotalizado = false;
                }
                me.aplicarFiltros();
            },
            // Watcher para filtro de devoluciones pendientes en Venta Directa
            filtroSoloDevolucionesPendientesDirecta(newVal) {
                let me = this;
                me.aplicarFiltros();
            },
            // Watcher para filtro de devoluciones pendientes en Venta Por Lista
            filtroSoloDevolucionesPendientesLista(newVal) {
                let me = this;
                // No necesita aplicarFiltros() porque el v-select usa el método filtrarTotalizados directamente
            },
            // Watcher para cuando se selecciona un totalizado
            totalizado(newVal) {
                let me = this;
                if (newVal && newVal.ca_codigo_agrupado) {
                    me.cancelarCargaTotalizado(false);
                    me.modoCrearTotalizado = false;
                    me.modoEditarTotalizado = false;
                    me.pedidosSeleccionados = [];
                    me.tabActiva = 0; // Cambiar a la primera pestaña
                    // NO llamar getDevoluciones() aquí, ya se cargaron con getDatosConsolidados()
                    me.getLibrosTotalizado(newVal);
                } else {
                    me.cancelarCargaTotalizado(false);
                    me.pedidosSeleccionados = [];
                    me.librosPedido = [];
                    me.librosVendidos = [];
                    me.modoEditarTotalizado = false;
                }
            },
            // Watcher para cuando se selecciona un pedido (venta directa)
            pedidoSeleccionado(newVal) {
                let me = this;
                if (newVal) {
                    me.tabActiva = 0; // Cambiar a la primera pestaña
                    me.getLibrosPedido(newVal);
                }
            },
            popupCrearAgrupacion(newVal) {
                let me = this;
                if (!newVal) {
                    me.modoCrearTotalizado = false;
                    me.modoEditarTotalizado = false;
                    me.bloquearQuitarContratosTotalizado = false;
                    me.pedidosSeleccionados = [];
                    me.descripcionAgrupacion = '';
                    me.busquedaPedidosTotalizado = '';
                    me.ciudadFiltroTotalizado = null;
                    me.mostrarSoloSeleccionadosTotalizado = false;
                    me.busquedaDisponiblesTotalizado = '';
                    me.ciudadFiltroDisponiblesTotalizado = null;
                    me.mostrarSoloSeleccionadosDisponibles = false;
                }
            },
            popupProformaPerseo(newVal) {
                let me = this;
                if (!newVal) {
                    return;
                }

                if (!me.hayCantidadesPendientesParaVender()) {
                    me.popupProformaPerseo = false;
                    me.$vs.notify({
                        text: 'Este pedido ya está vendido completamente. No hay cantidades pendientes para generar transacción.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 4000
                    });
                }
            }
        },
        props: {
            periodoSelect: {
                type: Object,
                default: {},
            },
            userAsesor: {
                type: Boolean,
                default: false,
            },
            userRoot: {
                type: Boolean,
                default: false,
            },
            groupFacturador: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            // Lista de libros filtrada (pendientes o todos)
            librosParaTabla() {
                let me = this;
                let librosFiltrados = me.librosPedido;

                if (me.lineaProductoSeleccionada) {
                    librosFiltrados = librosFiltrados.filter(libro => {
                        const lineaLibro = libro && libro.linea_producto_id != null ? parseInt(libro.linea_producto_id, 10) : 0;
                        return lineaLibro === parseInt(me.lineaProductoSeleccionada, 10);
                    });
                }

                if (!me.filtroPendientes) {
                    return librosFiltrados;
                }
                // Filtrar solo los que tienen pendiente > 0
                return librosFiltrados.filter(libro => {
                    const cantidadContrato = me.getCantidadContratoMasHijos(libro);
                    const cantidadVendida = me.getCantidadVendidaTotal(libro.pro_codigo);
                    return cantidadContrato - cantidadVendida > 0;
                });
            },

            // Filtrar librosVendidos para SOLO ventas normales (sin obsequios)
            librosVendidosSoloNormales() {
                return this.librosVendidos.filter(lv => this.normalizarEsObsequio(lv.es_obsequio) === 0);
            },

            // Totales generales para las tarjetas de resumen
            totalesGenerales() {
                let me = this;
                let contratoCantidadPura = 0;
                let hijosDocentesCantidad = 0;
                let contratoCantidad = 0;
                let contratoSubtotal = 0;
                let contratoTotal = 0;
                let ventaCantidad = 0;
                let ventaSubtotal = 0;
                let ventaTotal = 0;

                me.librosParaTabla.forEach(libro => {
                    // CONTRATO
                    const cantContrato = parseInt(libro.cantidad) || 0;
                    const cantHijos = me.getCantidadHijosDocentes(libro);
                    const cant = cantContrato + cantHijos;
                    const precio = parseFloat(libro.precio) || 0;
                    const descuento = parseFloat(libro.descuento) || 0;
                    const sub = precio * cant;
                    const tot = sub - (sub * descuento / 100);

                    contratoCantidadPura += cantContrato;
                    hijosDocentesCantidad += cantHijos;
                    contratoCantidad += cant;
                    contratoSubtotal += sub;
                    contratoTotal += tot;

                    // VENTA
                    const datosV = me.getDatosVenta(libro.pro_codigo);
                    ventaCantidad += datosV.cantidadTotal;
                    ventaSubtotal += parseFloat(datosV.subtotalTotal) || 0;
                    ventaTotal += parseFloat(datosV.totalTotal) || 0;
                });

                const pendienteCantidad = contratoCantidad - ventaCantidad;
                const pendienteSubtotal = contratoSubtotal - ventaSubtotal;
                const pendienteTotal = contratoTotal - ventaTotal;

                return {
                    contrato: {
                        cantidadContrato: contratoCantidadPura,
                        cantidadHijosDocentes: hijosDocentesCantidad,
                        cantidad: contratoCantidad,
                        subtotal: contratoSubtotal.toFixed(2),
                        total: contratoTotal.toFixed(2)
                    },
                    venta: {
                        cantidad: ventaCantidad,
                        subtotal: ventaSubtotal.toFixed(2),
                        total: ventaTotal.toFixed(2)
                    },
                    pendiente: {
                        cantidad: pendienteCantidad,
                        subtotal: pendienteSubtotal.toFixed(2),
                        total: pendienteTotal.toFixed(2)
                    }
                };
            },

            // Totales para la fila de totales por columna
            totalesColumnas() {
                let me = this;
                let hijosDocentesCantidad = 0;
                let contratoCantidad = 0;
                let contratoSubtotal = 0;
                let contratoTotal = 0;
                let ventaCantidad = 0;
                let ventaSubtotal = 0;
                let ventaTotal = 0;
                let pendienteCantidad = 0;
                let pendienteValor = 0;

                me.librosParaTabla.forEach(libro => {
                    const cantContrato = parseInt(libro.cantidad) || 0;
                    const cantHijos = me.getCantidadHijosDocentes(libro);
                    const cant = cantContrato + cantHijos;
                    const precio = parseFloat(libro.precio) || 0;
                    const descuento = parseFloat(libro.descuento) || 0;
                    const sub = precio * cant;
                    const tot = sub - (sub * descuento / 100);

                    hijosDocentesCantidad += cantHijos;
                    contratoCantidad += cant;
                    contratoSubtotal += sub;
                    contratoTotal += tot;

                    const datosV = me.getDatosVenta(libro.pro_codigo);
                    ventaCantidad += datosV.cantidadTotal;
                    ventaSubtotal += parseFloat(datosV.subtotalTotal) || 0;
                    ventaTotal += parseFloat(datosV.totalTotal) || 0;

                    const pCant = cant - datosV.cantidadTotal;
                    const pVal = tot - (parseFloat(datosV.totalTotal) || 0);
                    pendienteCantidad += pCant;
                    pendienteValor += pVal;
                });

                return {
                    contratoCantidad,
                    hijosDocentesCantidad,
                    contratoSubtotal: contratoSubtotal.toFixed(2),
                    contratoTotal: contratoTotal.toFixed(2),
                    ventaCantidad,
                    ventaSubtotal: ventaSubtotal.toFixed(2),
                    ventaTotal: ventaTotal.toFixed(2),
                    pendienteCantidad,
                    pendienteValorNum: pendienteValor,
                    pendienteValor: pendienteValor.toFixed(2)
                };
            },

            // Pedidos de Lista sin agrupar (disponibles para agrupar)
            pedidosListaSinAgrupar() {
                return this.pedidosListaCompletos.filter(p => !p.ca_codigo_agrupado);
            },

            ciudadesPedidosSinAgrupar() {
                let me = this;
                const ciudades = me.pedidosListaSinAgrupar
                    .map(function(p) { return p && p.nombre_ciudad ? p.nombre_ciudad : ''; })
                    .filter(function(c) { return c !== ''; });
                return [...new Set(ciudades)].sort();
            },

            devolucionesCount() {
                return this.devolucionesVistaPendientes.length;
            },

            // Lista filtrada con opción de solo pendientes
            devolucionesVistaPendientes() {
                let me = this;
                const base = me.devolucionesFiltradasVista;
                if (me.filtroPendientesNC) {
                    return base.filter(d => d.nc_pendiente);
                }
                return base;
            },

            contratosAgrupadosFiltrados() {
                let me = this;
                if (!me.filtroSoloDevolucionesPendientesLista) {
                    return me.contratosAgrupados;
                }
                return me.contratosAgrupados.filter(option => {
                    return me.tieneDevolucionesPendientesTotalizado(option.ca_codigo_agrupado);
                });
            },

            devolucionesFiltradasVista() {
                let me = this;
                if (me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    return me.obtenerDevolucionesPorTotalizado(me.totalizado.ca_codigo_agrupado);
                }
                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    return me.obtenerDevolucionesPorContrato(me.pedidoSeleccionado.contrato_generado);
                }
                return me.devoluciones;
            },

            devolucionesTotalesVista() {
                let me = this;
                if (me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    const grupo = me.devolucionesPorTotalizados.find(function(item) {
                        return item && item.ca_codigo_agrupado === me.totalizado.ca_codigo_agrupado;
                    });
                    if (grupo) {
                        return {
                            total_documentos: grupo.total_devoluciones || 0,
                            total_items: grupo.total_items || 0,
                            total_cantidad: grupo.total_cantidad || 0,
                            total_valor: grupo.total_valor || 0,
                            total_valor_descuento: grupo.total_valor_descuento || 0,
                        };
                    }

                    // Fallback: calcular totales con el listado filtrado cuando no exista grupo por totalizado.
                    const filtradas = me.obtenerDevolucionesPorTotalizado(me.totalizado.ca_codigo_agrupado);
                    if (filtradas.length > 0) {
                        let totalCantidad = 0;
                        let totalValor = 0;
                        filtradas.forEach(function(item) {
                            totalCantidad += parseFloat(item.cantidad_devolucion || item.cantidad_total || item.cantidad || 0);
                            totalValor += parseFloat(item.valor_devolucion || item.ven_devolucion || item.ven_valor || 0);
                        });
                        return {
                            total_documentos: filtradas.length,
                            total_items: filtradas.length,
                            total_cantidad: totalCantidad,
                            total_valor: totalValor,
                            total_valor_descuento: totalValor,

                        };
                    }
                }

                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    const grupoContrato = me.devolucionesPorContrato.find(function(item) {
                        return item && item.contrato_generado === me.pedidoSeleccionado.contrato_generado;
                    });
                    if (grupoContrato) {
                        return {
                            total_documentos: grupoContrato.total_devoluciones || 0,
                            total_items: grupoContrato.total_items || 0,
                            total_cantidad: grupoContrato.total_cantidad || 0,
                            total_valor: grupoContrato.total_valor || 0,
                            total_valor_descuento: grupoContrato.total_valor_descuento || 0,
                        };
                    }
                }

                return me.devolucionesTotalesGlobales;
            },

            totalesNotaCreditoPrueba() {
                let me = this;
                let totalItems = 0;
                let totalCantidad = 0;
                let totalValor = 0;
                let totalIncluidos = 0;

                (me.detallesDevolucionEdicion || []).forEach(function(item) {
                    if (!item || !item.incluir_nc) return;

                    const cantidad = parseFloat(item.cantidad_nc || 0);
                    if (!(cantidad > 0)) return;

                    const precio = parseFloat(item.precio || item.det_ven_valor_u || item.precio_venta || 0);
                    totalItems++;
                    totalCantidad += cantidad;
                    totalValor += (cantidad * precio);
                    totalIncluidos++;
                });

                return {
                    total_items: totalItems,
                    total_cantidad: totalCantidad,
                    total_valor: totalValor,
                    total_valor_descuento: totalValor,
                    total_incluidos: totalIncluidos,
                };
            },

            pedidosListaFiltradosBase() {
                let me = this;
                let listado = me.pedidosListaSinAgrupar;

                if (me.ciudadFiltroTotalizado) {
                    listado = listado.filter(function(p) {
                        return p && p.nombre_ciudad === me.ciudadFiltroTotalizado;
                    });
                }

                const textoBusqueda = me.busquedaPedidosTotalizado ? me.busquedaPedidosTotalizado.toString().trim().toLowerCase() : '';
                if (!textoBusqueda) {
                    return listado;
                }

                return listado.filter(function(p) {
                    const institucion = p && p.nombreInstitucion ? p.nombreInstitucion.toString().toLowerCase() : '';
                    const contrato = p && p.contrato_generado ? p.contrato_generado.toString().toLowerCase() : '';
                    const ciudad = p && p.nombre_ciudad ? p.nombre_ciudad.toString().toLowerCase() : '';
                    const asesor = p && p.asesor ? p.asesor.toString().toLowerCase() : '';
                    const idPedido = p && p.id_pedido ? p.id_pedido.toString().toLowerCase() : '';

                    return institucion.includes(textoBusqueda) ||
                        contrato.includes(textoBusqueda) ||
                        ciudad.includes(textoBusqueda) ||
                        asesor.includes(textoBusqueda) ||
                        idPedido.includes(textoBusqueda);
                });
            },

            pedidosListaFiltrados() {
                let me = this;
                if (!me.mostrarSoloSeleccionadosTotalizado) {
                    return me.pedidosListaFiltradosBase;
                }
                return me.pedidosListaFiltradosBase.filter(function(p) {
                    return me.pedidosSeleccionados.includes(p.id_pedido);
                });
            },

            cantidadSeleccionadosVisibles() {
                let me = this;
                return me.pedidosListaFiltradosBase.filter(function(p) {
                    return me.pedidosSeleccionados.includes(p.id_pedido);
                }).length;
            },

            // Pedidos a mostrar en la tabla (si está en modo editar, muestra todos; si no, solo sin agrupar)
            pedidosMostrarEnTabla() {
                let me = this;
                if (me.modoEditarTotalizado && me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    return me.pedidosListaCompletos;
                }
                return me.pedidosListaSinAgrupar;
            },

            // Verificar si hay pedidos seleccionables
            hayPedidosSeleccionables() {
                return this.pedidosMostrarEnTabla.length > 0;
            },

            // Verificar si todos los pedidos seleccionables están seleccionados
            todosSeleccionados() {
                if (this.pedidosListaFiltradosBase.length === 0) return false;
                return this.pedidosListaFiltradosBase.every(p => this.pedidosSeleccionados.includes(p.id_pedido));
            },

            // Pedidos que YA están en el totalizado seleccionado
            pedidosDelTotalizado() {
                let me = this;
                if (!me.totalizado || !me.totalizado.ca_codigo_agrupado) return [];
                return me.pedidosListaCompletos.filter(p => 
                    p.ca_codigo_agrupado === me.totalizado.ca_codigo_agrupado
                );
            },

            // Pedidos disponibles para agregar al totalizado
            pedidosDisponiblesParaAgregar() {
                let me = this;
                if (!me.totalizado || !me.totalizado.ca_codigo_agrupado) return [];
                return me.pedidosListaCompletos.filter(p => 
                    !p.ca_codigo_agrupado
                );
            },

            ciudadesDisponiblesTotalizado() {
                let me = this;
                const ciudades = me.pedidosDisponiblesParaAgregar
                    .map(function(p) { return p && p.nombre_ciudad ? p.nombre_ciudad : ''; })
                    .filter(function(c) { return c !== ''; });
                return [...new Set(ciudades)].sort();
            },

            pedidosDisponiblesFiltradosBase() {
                let me = this;
                let listado = me.pedidosDisponiblesParaAgregar;

                if (me.ciudadFiltroDisponiblesTotalizado) {
                    listado = listado.filter(function(p) {
                        return p && p.nombre_ciudad === me.ciudadFiltroDisponiblesTotalizado;
                    });
                }

                const textoBusqueda = me.busquedaDisponiblesTotalizado ? me.busquedaDisponiblesTotalizado.toString().trim().toLowerCase() : '';
                if (!textoBusqueda) {
                    return listado;
                }

                return listado.filter(function(p) {
                    const institucion = p && p.nombreInstitucion ? p.nombreInstitucion.toString().toLowerCase() : '';
                    const contrato = p && p.contrato_generado ? p.contrato_generado.toString().toLowerCase() : '';
                    const ciudad = p && p.nombre_ciudad ? p.nombre_ciudad.toString().toLowerCase() : '';
                    const asesor = p && p.asesor ? p.asesor.toString().toLowerCase() : '';
                    const idPedido = p && p.id_pedido ? p.id_pedido.toString().toLowerCase() : '';

                    return institucion.includes(textoBusqueda) ||
                        contrato.includes(textoBusqueda) ||
                        ciudad.includes(textoBusqueda) ||
                        asesor.includes(textoBusqueda) ||
                        idPedido.includes(textoBusqueda);
                });
            },

            pedidosDisponiblesFiltrados() {
                let me = this;
                if (!me.mostrarSoloSeleccionadosDisponibles) {
                    return me.pedidosDisponiblesFiltradosBase;
                }
                return me.pedidosDisponiblesFiltradosBase.filter(function(p) {
                    return me.pedidosSeleccionados.includes(p.id_pedido);
                });
            },

            cantidadSeleccionadosDisponiblesVisibles() {
                let me = this;
                return me.pedidosDisponiblesFiltradosBase.filter(function(p) {
                    return me.pedidosSeleccionados.includes(p.id_pedido);
                }).length;
            },

            // Verificar si todos los pedidos del totalizado están seleccionados
            todosDelTotalizadoSeleccionados() {
                let me = this;
                if (me.pedidosDelTotalizado.length === 0) return false;
                return me.pedidosDelTotalizado.every(p => me.pedidosSeleccionados.includes(p.id_pedido));
            },

            // Verificar si todos los disponibles están seleccionados
            todosDisponiblesSeleccionados() {
                let me = this;
                if (me.pedidosDisponiblesFiltradosBase.length === 0) return false;
                return me.pedidosDisponiblesFiltradosBase.every(p => me.pedidosSeleccionados.includes(p.id_pedido));
            },

            // Verificar si hay cambios en el totalizado
            hayCambiosEnTotalizado() {
                let me = this;
                if (!me.modoEditarTotalizado || !me.totalizado) return false;
                
                const pedidosOriginales = me.pedidosDelTotalizado.map(p => p.id_pedido).sort();
                const pedidosActuales = me.pedidosSeleccionados.slice().sort();
                
                if (pedidosOriginales.length !== pedidosActuales.length) return true;
                
                return !pedidosOriginales.every((id, index) => id === pedidosActuales[index]);
            },

            // Título dinámico de la tabla
            tituloTabla() {
                let me = this;
                if (me.modoEditarTotalizado && me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    const enGrupo = me.pedidosListaCompletos.filter(p => 
                        p.ca_codigo_agrupado === me.totalizado.ca_codigo_agrupado
                    ).length;
                    return `Editar "${me.totalizado.ca_descripcion}" (${me.pedidosListaCompletos.length} disponibles, ${enGrupo} en grupo)`;
                }
                return `Pedidos sin Totalizar (${me.pedidosListaSinAgrupar.length})`;
            },

            // Texto del botón de acción
            textoBotonAccion() {
                let me = this;
                if (me.modoEditarTotalizado && me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    return `Actualizar Totalizado (${me.pedidosSeleccionados.length} seleccionados)`;
                }
                return `Crear Nuevo Totalizado (${me.pedidosSeleccionados.length} pedidos)`;
            },

            ventasTotalizadoSeleccionado() {
                let me = this;
                if (!me.totalizado || !me.totalizado.ca_codigo_agrupado) {
                    return [];
                }

                const codigo = me.totalizado.ca_codigo_agrupado;
                const grupo = me.ventasPorTotalizados.find(function(item) {
                    return item.ca_codigo_agrupado === codigo;
                });

                if (!grupo || !grupo.ventas || !Array.isArray(grupo.ventas)) {
                    return [];
                }

                return grupo.ventas;
            }
        },

        methods: {
            getPedidos() {
                let me = this;
                if (me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined) {
                    return;
                }

                const ruta = this.$server_url + 'get_pedidos_periodoAgrupado_new/' + me.periodoSelect.idperiodoescolar;
                me.loadingPedidosDirecta = true;

                this.$http.get(ruta)
                .then(res => {
                    const datos = res.data.filter(p => p.facturacion_vee == 1);

                    // Preparar todos los pedidos para el v-select con texto de búsqueda
                    me.allPedidos = datos.map(pedido => ({
                        ...pedido,
                        nombreCompleto: `${pedido.nombreInstitucion} - ${pedido.id_pedido} - ${pedido.asesor} - ${pedido.contrato_generado || 'Sin contrato'}`
                    }));

                    // OPTIMIZADO: Cargar ventas y devoluciones consolidadas en una sola llamada
                    me.getDatosConsolidados()
                        .finally(() => {
                            me.loadingPedidosDirecta = false;
                            me.aplicarFiltros();
                        });
                })
                .catch((e) => {
                    me.loadingPedidosDirecta = false;
                    console.error('Error al cargar pedidos:', e);
                });
            },

            /**
             * NUEVO: Método optimizado que carga ventas y devoluciones en una sola consulta
             */
            getDatosConsolidados() {
                let me = this;
                if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
                    return Promise.resolve();
                }

                // Evitar llamadas múltiples simultáneas
                if (me.loadingDatosConsolidados) {
                    console.log('getDatosConsolidados: Ya está cargando, evitando llamada duplicada');
                    return Promise.resolve();
                }

                me.loadingDatosConsolidados = true;
                me.loadingVentasTotalizados = true;
                me.loadingDevoluciones = true;
                me.errorDevolucionesMsg = '';

                const url = `${me.$server_url}api/perseo/ventas-lista/datos-consolidados-periodo?id_periodo=${me.periodoSelect.idperiodoescolar}`;

                return me.$http.get(url)
                    .then(function(res) {
                        if (res.data && res.data.status === 'success' && res.data.data) {
                            const data = res.data.data;

                            // Cargar ventas por totalizado
                            me.ventasPorTotalizados = Array.isArray(data.ventas_por_totalizado) ? data.ventas_por_totalizado : [];
                            me.ventasPorContrato = Array.isArray(data.ventas_por_contrato) ? data.ventas_por_contrato : [];

                            // Cargar devoluciones
                            me.devoluciones = Array.isArray(data.devoluciones) ? data.devoluciones : [];
                            me.devolucionesPorTotalizados = Array.isArray(data.devoluciones_por_totalizado) ? data.devoluciones_por_totalizado : [];
                            me.devolucionesPorContrato = Array.isArray(data.devoluciones_por_contrato) ? data.devoluciones_por_contrato : [];
                            
                            // Totales de devoluciones
                            me.devolucionesTotalesGlobales = data.totales_devoluciones ? {
                                total_documentos: data.totales_devoluciones.total_documentos || 0,
                                total_items: 0, // No necesario en la consulta optimizada
                                total_cantidad: data.totales_devoluciones.total_cantidad || 0,
                                total_valor: 0, // No necesario en la consulta optimizada
                                total_valor_descuento: 0,
                            } : {
                                total_documentos: 0,
                                total_items: 0,
                                total_cantidad: 0,
                                total_valor: 0,
                                total_valor_descuento: 0,
                            };

                            me.errorDevolucionesMsg = '';
                        } else {
                            // Si hay error en la respuesta del servidor
                            me.errorDevolucionesMsg = res.data && res.data.message ? res.data.message : 'Error al cargar datos consolidados';
                            me._limpiarDatosConsolidados();
                        }
                    })
                    .catch(function(error) {
                        console.error('Error al obtener datos consolidados:', error);
                        
                        // Capturar mensaje de error
                        if (error.response && error.response.data && error.response.data.message) {
                            me.errorDevolucionesMsg = error.response.data.message;
                        } else {
                            me.errorDevolucionesMsg = 'Error de conexión al cargar datos consolidados';
                        }
                        
                        me._limpiarDatosConsolidados();
                    })
                    .finally(function() {
                        me.loadingDatosConsolidados = false;
                        me.loadingVentasTotalizados = false;
                        me.loadingDevoluciones = false;
                    });
            },

            /**
             * Método auxiliar para limpiar datos consolidados en caso de error
             */
            _limpiarDatosConsolidados() {
                let me = this;
                me.ventasPorTotalizados = [];
                me.ventasPorContrato = [];
                me.devoluciones = [];
                me.devolucionesPorTotalizados = [];
                me.devolucionesPorContrato = [];
                me.devolucionesTotalesGlobales = {
                    total_documentos: 0,
                    total_items: 0,
                    total_cantidad: 0,
                    total_valor: 0,
                    total_valor_descuento: 0,
                };
            },

            // Cargar pedidos de Lista completos (agrupados y sin agrupar)
            // Nuevo método para aplicar filtros
            aplicarFiltros() {
                let me = this;

                // Si ningún filtro está activo, mostrar todos los pedidos
                if (!me.filtroVentaDirecta && !me.filtroVentaPorLista) {
                    me.pedidosFiltrados = [...me.allPedidos];
                    return;
                }

                // Filtrar según los checkboxes activos
                me.pedidosFiltrados = me.allPedidos.filter(pedido => {
                    const esDirecta = pedido.tipo_venta == 1;
                    const esPorLista = pedido.tipo_venta != 1;

                    return (
                        (me.filtroVentaDirecta && esDirecta) ||
                        (me.filtroVentaPorLista && esPorLista)
                    );
                }).map(pedido => {
                    // Agregar indicador de devoluciones pendientes
                    const contrato = pedido.contrato_generado;
                    const devolucionesContrato = me.obtenerDevolucionesPorContrato(contrato);
                    const tieneDevolucionesPendientes = devolucionesContrato.some(d => d.nc_pendiente !== undefined ? d.nc_pendiente : (!d.nota_credito || !d.id_nota_credito_perseo));
                    
                    return {
                        ...pedido,
                        tiene_devoluciones_pendientes: tieneDevolucionesPendientes
                    };
                });

                // Aplicar filtro de devoluciones pendientes según el modo activo
                if (me.filtroVentaDirecta && me.filtroSoloDevolucionesPendientesDirecta) {
                    me.pedidosFiltrados = me.pedidosFiltrados.filter(pedido => pedido.tiene_devoluciones_pendientes);
                }

                // Si el pedido seleccionado ya no está en los filtrados, limpiarlo
                if (me.pedidoSeleccionado && !me.pedidosFiltrados.find(p => p.id_pedido === me.pedidoSeleccionado.id_pedido)) {
                    me.limpiarSeleccion();
                }
            },

            /**
             * Preselecciona un totalizado desde el componente "Resumen de Pendientes"
             * Carga el modo Venta Lista y selecciona automáticamente el totalizado
             */
            preseleccionarTotalizado(codigo_totalizado) {
                let me = this;

                // Activar filtro de venta por lista
                me.filtroVentaPorLista = true;
                me.filtroVentaDirecta = false;
                
                // Esperar a que se carguen los contratosAgrupados y luego seleccionar
                const buscarYSeleccionar = (intentos = 0) => {
                    if (me.contratosAgrupados && me.contratosAgrupados.length > 0) {
                        const totalizado = me.contratosAgrupados.find(t => t.ca_codigo_agrupado === codigo_totalizado);
                        if (totalizado) {
                            // Asignarlo como totalizado seleccionado (esto dispara el watcher)
                            me.totalizado = totalizado;
                            // Las libros y detalles se cargarán automáticamente mediante el watcher
                        } else {
                            me.$vs.notify({
                                title: 'Totalizado no encontrado',
                                text: 'El totalizado no existe o no está disponible en este período.',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                        }
                    } else if (intentos < 30) {
                        // Reintentar hasta 15 segundos (30 * 500ms) para que carguen los totalizados
                        setTimeout(() => buscarYSeleccionar(intentos + 1), 500);
                    } else {
                        me.$vs.notify({
                            title: 'Tiempo agotado',
                            text: 'No se pudo cargar la lista de totalizados en tiempo.',
                            color: 'danger'
                        });
                    }
                };

                buscarYSeleccionar();
            },

            // Método para preseleccionar un contrato (llamado desde el componente padre "Ver en Gestión")
            preseleccionarContrato(contrato_generado) {
                let me = this;

                // Función recursiva que espera a que getPedidos() termine de cargar todos los pedidos
                const buscarYSeleccionar = (intentos = 0) => {
                    if (me.allPedidos && me.allPedidos.length > 0) {
                        // Buscar el pedido que corresponda a este contrato
                        const pedido = me.allPedidos.find(p => p.contrato_generado === contrato_generado);
                        if (pedido) {
                            // Asignarlo al v-model del v-select de búsqueda
                            me.pedidoSeleccionado = pedido;
                            // Disparar las consultas internas como si el usuario lo hubiera seleccionado
                            me.seleccionarPedido(pedido);
                        } else {
                            me.$vs.notify({
                                title: 'Contrato no encontrado',
                                text: 'El contrato no existe o no pertenece al período actual seleccionado.',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                        }
                    } else if (intentos < 30) {
                        // Reintentar hasta 15 segundos (30 * 500ms) esperando a que la API responda
                        setTimeout(() => buscarYSeleccionar(intentos + 1), 500);
                    } else {
                        me.$vs.notify({ text: 'Tiempo de espera agotado al cargar pedidos', color: 'danger' });
                    }
                };

                buscarYSeleccionar();
            },

            ver_pedido(item) {
                let me = this
                this.$store.dispatch('setPedido', item)
                localStorage.setItem("id_periodo_selected", this.id_periodo)
                localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
                localStorage.setItem("contrato_generado", item.contrato_generado)
                localStorage.setItem("pedido_desde_admin", 'activo')
                localStorage.setMenu = 0
                me.$emit('showPedido', 4)
            },
            // Métodos para el v-select general
            seleccionarPedido(pedido) {
                let me = this;
                me.pedidoSeleccionado = pedido;
                if (pedido) {
                    me.getLibrosPedido(pedido);
                }
            },
            verPedidoSeleccionado() {
                let me = this;
                if (me.pedidoSeleccionado) {
                    me.ver_pedido(me.pedidoSeleccionado);
                }
            },
            limpiarSeleccion() {
                let me = this;
                me.pedidoSeleccionado = null;
                me.totalizado = null;
                me.librosPedido = [];
                me.detalleHijosDocentesPorLibro = [];
                // me.librosProformados = []; // YA NO SE USA
            },

            getLibrosPedido(pedido) {
                let me = this;
                if (!pedido || !pedido.contrato_generado) {
                    me.librosPedido = [];
                    me.librosVendidos = [];
                    return;
                }

                me.cancelarCargaTotalizado(false);
                me.esCargaTotalizado = false;
                me.textoLoadingLibros = 'Cargando libros del pedido...';
                me.loadingLibros = true;
                me.librosPedido = [];

                const contrato = pedido.contrato_generado;
                const periodo = me.periodoSelect.idperiodoescolar;

                const url = `${me.$server_url}get_libros_pedidosAlcancesXContrato?contrato=${contrato}&periodo=${periodo}`;

                me.$http.get(url)
                .then(res => {
                    me.loadingLibros = false;

                    const datos = Array.isArray(res.data) ? res.data : [];
                    me.librosPedido = me.consolidarLibrosContrato(datos);
                    me.obtenerDetalleHijosDocentesPorContratos([contrato], periodo)
                    .then(() => {
                        me.getLibrosVendidos(contrato, periodo);
                    });

                })
                .catch((e) => {
                    me.loadingLibros = false;
                    console.error('Error al cargar libros del pedido:', e);
                    me.$vs.notify({
                        text: 'Error al cargar los libros del pedido',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
            },

            // Método para obtener los libros proformados - YA NO SE USA
            // getLibrosProformados(contrato, periodo) {
            //     let me = this;
            //     me.loadingProformados = true;
            //
            //     const url = `${me.$server_url}get_libros_proformados_por_contrato?contrato=${contrato}&periodo=${periodo}`;
            //
            //     me.$http.get(url)
            //     .then(res => {
            //         me.loadingProformados = false;
            //         if (res.data.status === 200) {
            //             me.librosProformados = res.data.data;
            //
            //             // ✅ AGREGAR LIBROS EXTRAS al listado general
            //             // Buscar libros que están en proforma pero NO en el contrato (extras)
            //             me.librosProformados.forEach(libroProformado => {
            //                 const existeEnContrato = me.librosPedido.find(lp => lp.pro_codigo === libroProformado.pro_codigo);
            //
            //                 if (!existeEnContrato) {
            //                     // Este libro es un EXTRA (no está en el contrato original)
            //                     console.log(`📦 Libro EXTRA detectado: ${libroProformado.pro_codigo} - ${libroProformado.nombre_libro}`);
            //
            //                     // Agregar al listado general con valores en 0 para las columnas de contrato
            //                     me.librosPedido.push({
            //                         pro_codigo: libroProformado.pro_codigo,
            //                         nombre_libro: libroProformado.nombre_libro,
            //                         cantidad: 0,  // No está en contrato
            //                         precio: libroProformado.precio_unitario,
            //                         descuento: 0,  // No está en contrato
            //                         esLibroExtra: true  // Marcar como extra
            //                     });
            //
            //                     console.log(`✅ Libro EXTRA agregado al listado general: ${libroProformado.pro_codigo}`);
            //                 }
            //             });
            //         } else {
            //             me.librosProformados = [];
            //         }
            //     })
            //     .catch((e) => {
            //         me.loadingProformados = false;
            //         console.error('Error al cargar libros proformados:', e);
            //         me.librosProformados = [];
            //     });
            // },

            // Método para obtener los libros vendidos
            getLibrosVendidos(contrato, periodo) {
                let me = this;
                me.loadingVendidos = true;

                const url = `${me.$server_url}get_libros_vendidos_por_contrato?contrato=${contrato}&periodo=${periodo}`;

                me.$http.get(url)
                .then(res => {
                    me.loadingVendidos = false;
                    if (res.data.status === 200) {
                        const datosVendidos = Array.isArray(res.data.data) ? res.data.data : [];
                        me.librosVendidos = datosVendidos.map(function(item) {
                            return {
                                ...item,
                                es_obsequio: parseInt(item.es_obsequio, 10) === 0 ? 0 : 1,
                                detalleVenta: `${item.ven_codigo} cant: ${item.cantidad_vendida}`
                            };
                        });

                        // ✅ ACTUALIZAR cantidadVendida en librosPedido según los libros vendidos
                        me.librosPedido.forEach(libroPedido => {
                            const codigoLibroPedido = me.normalizarCodigoLibro(libroPedido.pro_codigo);
                            const vendidosDelLibro = me.librosVendidos.filter(lv => me.normalizarCodigoLibro(lv.pro_codigo) === codigoLibroPedido);
                            const cantidadVendidaTotal = vendidosDelLibro.reduce((sum, lv) => {
                                return sum + (parseInt(lv.cantidad_vendida) || 0);
                            }, 0);

                            me.$set(libroPedido, 'cantidadVendida', cantidadVendidaTotal);
                            if ((!libroPedido.linea_producto_id || parseInt(libroPedido.linea_producto_id, 10) <= 0) && vendidosDelLibro.length > 0) {
                                const lineaVenta = vendidosDelLibro[0] && vendidosDelLibro[0].linea_producto_id != null
                                    ? parseInt(vendidosDelLibro[0].linea_producto_id, 10)
                                    : 0;
                                if (lineaVenta > 0) {
                                    me.$set(libroPedido, 'linea_producto_id', lineaVenta);
                                }
                            }
                        });

                        // ✅ AGREGAR LIBROS EXTRAS al listado general
                        // Buscar libros que están en ventas pero NO en el listado (extras)
                        me.librosVendidos.forEach(libroVendido => {
                            const codigoLibroVendido = me.normalizarCodigoLibro(libroVendido.pro_codigo);
                            const existeEnListado = me.librosPedido.find(lp => me.normalizarCodigoLibro(lp.pro_codigo) === codigoLibroVendido);

                            if (!existeEnListado) {
                                // Calcular cantidad vendida de este libro extra
                                const vendidosDelExtra = me.librosVendidos.filter(lv => me.normalizarCodigoLibro(lv.pro_codigo) === codigoLibroVendido);
                                const cantidadVendidaExtra = vendidosDelExtra.reduce((sum, lv) => {
                                    return sum + (parseInt(lv.cantidad_vendida) || 0);
                                }, 0);

                                // Agregar al listado general con valores en 0 para las columnas de contrato
                                me.librosPedido.push({
                                    pro_codigo: codigoLibroVendido,
                                    nombre_libro: libroVendido.nombre_libro,
                                    cantidad: 0,  // No está en contrato
                                    cantidad_hijos_docentes: 0,
                                    precio: libroVendido.precio_unitario || 0,
                                    descuento: 0,  // No está en contrato
                                    esLibroExtra: true,  // Marcar como extra
                                    cantidadVendida: cantidadVendidaExtra,  // Agregar cantidad vendida
                                    linea_producto_id: libroVendido.linea_producto_id != null ? parseInt(libroVendido.linea_producto_id, 10) : 0
                                });

                            }
                        });
                    } else {
                        me.librosVendidos = [];
                    }
                })
                .catch((e) => {
                    me.loadingVendidos = false;
                    console.error('Error al cargar libros vendidos:', e);
                    me.librosVendidos = [];
                });
            },

            // Método para obtener detalles de proforma agrupados por descuento - YA NO SE USA
            // getDetallesProformaPorDescuento(pro_codigo) {
            //     let me = this;
            //     const detalles = me.librosProformados.filter(lp => lp.pro_codigo === pro_codigo);
            //
            //     return detalles.map(detalle => ({
            //         cantidad: parseInt(detalle.cantidad_proformada) || 0,
            //         descuento: parseFloat(detalle.descuento_proforma) || 0,
            //         subtotal: parseFloat(detalle.subtotal_proformado || 0).toFixed(2),
            //         total: parseFloat(detalle.total_proformado || 0).toFixed(2)
            //     }));
            // },
            //
            // // Método para obtener los datos de proforma de un libro específico (TOTALES)
            // getDatosProforma(pro_codigo) {
            //     let me = this;
            //     const detalles = me.librosProformados.filter(lp => lp.pro_codigo === pro_codigo);
            //
            //     if (detalles.length > 0) {
            //         // Sumar todas las cantidades, subtotales y totales
            //         const cantidadTotal = detalles.reduce((sum, d) => sum + (parseInt(d.cantidad_proformada) || 0), 0);
            //         const subtotalTotal = detalles.reduce((sum, d) => sum + (parseFloat(d.subtotal_proformado) || 0), 0);
            //         const totalTotal = detalles.reduce((sum, d) => sum + (parseFloat(d.total_proformado) || 0), 0);
            //
            //         // Para descuento, mostrar el primero o "Variados" si hay múltiples
            //         const descuentos = [...new Set(detalles.map(d => parseFloat(d.descuento_proforma)))];
            //         const descuento = descuentos.length === 1 ? descuentos[0] : 0;
            //
            //         return {
            //             cantidadTotal: cantidadTotal,
            //             descuento: descuento,
            //             subtotalTotal: subtotalTotal.toFixed(2),
            //             totalTotal: totalTotal.toFixed(2),
            //             // Mantener compatibilidad con código anterior
            //             cantidad: cantidadTotal,
            //             subtotal: subtotalTotal.toFixed(2),
            //             total: totalTotal.toFixed(2)
            //         };
            //     }
            //
            //     return {
            //         cantidadTotal: 0,
            //         descuento: 0,
            //         subtotalTotal: '0.00',
            //         totalTotal: '0.00',
            //         cantidad: 0,
            //         subtotal: '0.00',
            //         total: '0.00'
            //     };
            // },

            // Método para obtener detalles de venta agrupados por descuento
            getDetallesVentaPorDescuento(pro_codigo, esObsequio = null) {
                let me = this;
                const codigoBuscado = me.normalizarCodigoLibro(pro_codigo);
                let detalles = me.librosVendidos.filter(lv => me.normalizarCodigoLibro(lv.pro_codigo) === codigoBuscado);
                
                // Si se especifica esObsequio (0 o 1), filtrar solo por ese tipo
                if (esObsequio !== null) {
                    detalles = detalles.filter(lv => me.normalizarEsObsequio(lv.es_obsequio) === esObsequio);
                }

                // Agrupar por descuento: mismo descuento → suma cantidad/subtotal/total
                // distinto descuento → fila separada
                // detalle pasa a ser un array de strings (uno por documento original)
                const mapaDescuento = {};
                detalles.forEach(detalle => {
                    const descuento = parseFloat(detalle.descuento_venta) || 0;
                    const key = String(descuento);
                    if (!mapaDescuento[key]) {
                        mapaDescuento[key] = {
                            cantidad: 0,
                            descuento: descuento,
                            subtotal: 0,
                            total: 0,
                            detalle: []  // array de strings descriptivos
                        };
                    }
                    mapaDescuento[key].cantidad += parseInt(detalle.cantidad_vendida) || 0;
                    mapaDescuento[key].subtotal += parseFloat(detalle.subtotal_vendido) || 0;
                    mapaDescuento[key].total    += parseFloat(detalle.total_vendido) || 0;
                    if (detalle.detalleVenta) {
                        mapaDescuento[key].detalle.push(detalle.detalleVenta);
                    }
                });

                return Object.values(mapaDescuento).map(g => ({
                    cantidad: g.cantidad,
                    descuento: g.descuento,
                    subtotal: g.subtotal.toFixed(2),
                    total: g.total.toFixed(2),
                    detalle: g.detalle   // array de strings
                }));
            },

            // Método para obtener los datos de venta de un libro específico (TOTALES)
            getDatosVenta(pro_codigo, esObsequio = null) {
                let me = this;
                const codigoBuscado = me.normalizarCodigoLibro(pro_codigo);
                let detalles = me.librosVendidos.filter(lv => me.normalizarCodigoLibro(lv.pro_codigo) === codigoBuscado);
                
                // Si se especifica esObsequio (0 o 1), filtrar solo por ese tipo
                if (esObsequio !== null) {
                    detalles = detalles.filter(lv => me.normalizarEsObsequio(lv.es_obsequio) === esObsequio);
                }

                if (detalles.length > 0) {
                    // Sumar todas las cantidades, subtotales y totales
                    const cantidadTotal = detalles.reduce((sum, d) => sum + (parseInt(d.cantidad_vendida) || 0), 0);
                    const subtotalTotal = detalles.reduce((sum, d) => sum + (parseFloat(d.subtotal_vendido) || 0), 0);
                    const totalTotal = detalles.reduce((sum, d) => sum + (parseFloat(d.total_vendido) || 0), 0);

                    // Para descuento, mostrar el primero o "Variados" si hay múltiples
                    const descuentos = [...new Set(detalles.map(d => parseFloat(d.descuento_venta)))];
                    const descuento = descuentos.length === 1 ? descuentos[0] : 0;

                    return {
                        cantidadTotal: cantidadTotal,
                        descuento: descuento,
                        subtotalTotal: subtotalTotal.toFixed(2),
                        totalTotal: totalTotal.toFixed(2),
                        // Mantener compatibilidad con código anterior
                        cantidad: cantidadTotal,
                        subtotal: subtotalTotal.toFixed(2),
                        total: totalTotal.toFixed(2)
                    };
                }

                return {
                    cantidadTotal: 0,
                    descuento: 0,
                    subtotalTotal: '0.00',
                    totalTotal: '0.00',
                    cantidad: 0,
                    subtotal: '0.00',
                    total: '0.00'
                };
            },

            normalizarEsObsequio(valor) {
                return parseInt(valor, 10) === 0 ? 0 : 1;
            },

            normalizarCodigoLibro(codigo) {
                if (codigo == null) {
                    return '';
                }
                return String(codigo).trim().toUpperCase();
            },

            // Método para calcular el subtotal de un libro (precio * cantidad)
            calcularSubtotalLibro(libro) {
                const precio = parseFloat(libro.precio) || 0;
                const cantidad = this.getCantidadContratoMasHijos(libro);

                const subtotal = precio * cantidad;
                return subtotal.toFixed(2);
            },

            // Método para calcular el total de un libro (subtotal - descuento)
            calcularTotalLibro(libro) {
                const subtotal = parseFloat(this.calcularSubtotalLibro(libro));
                const descuento = parseFloat(libro.descuento) || 0;

                const montoDescuento = subtotal * (descuento / 100);
                const total = subtotal - montoDescuento;

                return total.toFixed(2);
            },

            // Método para obtener la cantidad vendida total de un libro
            getCantidadVendidaTotal(pro_codigo) {
                let me = this;
                const codigoBuscado = me.normalizarCodigoLibro(pro_codigo);
                const detalles = me.librosVendidos.filter(lv => me.normalizarCodigoLibro(lv.pro_codigo) === codigoBuscado);
                return detalles.reduce((sum, d) => sum + (parseInt(d.cantidad_vendida) || 0), 0);
            },

            getCantidadHijosDocentes(libro) {
                return parseInt(libro.cantidad_hijos_docentes) || 0;
            },

            getNombreLineaProducto(lineaId) {
                const valorLinea = lineaId != null ? parseInt(lineaId, 10) : 0;
                const linea = this.lineasProductoOpciones.find(item => parseInt(item.id, 10) === valorLinea);
                if (linea && linea.nombre) {
                    return linea.nombre;
                }
                return 'Sin línea';
            },

            getColorLineaProducto(lineaId) {
                const valorLinea = lineaId != null ? parseInt(lineaId, 10) : 0;
                if (valorLinea === 1) {
                    return 'primary';
                }
                if (valorLinea === 2) {
                    return 'warning';
                }
                return 'dark';
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

                        if (me.lineasProductoOpciones.length > 0) {
                            const existeLineaActual = me.lineasProductoOpciones.find(function(item) {
                                return parseInt(item.id, 10) === parseInt(me.lineaProductoSeleccionada, 10);
                            });
                            if (!existeLineaActual) {
                                me.lineaProductoSeleccionada = me.lineasProductoOpciones[0].id;
                            }
                        } else {
                            me.lineaProductoSeleccionada = null;
                        }
                    } else {
                        me.lineasProductoOpciones = [];
                        me.lineaProductoSeleccionada = null;
                    }
                })
                .catch(function() {
                    me.lineasProductoOpciones = [];
                    me.lineaProductoSeleccionada = null;
                });
            },

            getCantidadContratoMasHijos(libro) {
                const cantidadContrato = parseInt(libro.cantidad) || 0;
                const cantidadHijos = this.getCantidadHijosDocentes(libro);
                return cantidadContrato + cantidadHijos;
            },

            // Método para calcular la cantidad pendiente de un libro
            calcularPendienteCantidad(libro) {
                const cantidadContrato = this.getCantidadContratoMasHijos(libro);
                const cantidadVendida = this.getCantidadVendidaTotal(libro.pro_codigo);
                return cantidadContrato - cantidadVendida;
            },

            // Método para calcular el valor pendiente de un libro
            calcularPendienteValor(libro) {
                const totalContrato = parseFloat(this.calcularTotalLibro(libro)) || 0;
                const datosVenta = this.getDatosVenta(libro.pro_codigo);
                const totalVendido = parseFloat(datosVenta.totalTotal) || 0;
                const pendiente = totalContrato - totalVendido;
                return pendiente.toFixed(2);
            },

            // Método para calcular el total general del pedido
            calcularTotalPedido() {
                let me = this;
                return me.librosPedido.reduce((total, libro) => {
                    return total + parseFloat(me.calcularTotalLibro(libro));
                }, 0).toFixed(2);
            },

            async obtenerDetalleHijosDocentesPorContratos(contratos, periodo) {
                let me = this;

                if (!Array.isArray(contratos) || contratos.length === 0) {
                    me.detalleHijosDocentesPorLibro = [];
                    me.aplicarDetalleHijosDocentesEnLibros([]);
                    return;
                }

                const contratosLimpios = contratos
                    .map(function(item) { return item ? item.trim() : ''; })
                    .filter(function(item) { return item !== ''; });

                if (contratosLimpios.length === 0) {
                    me.detalleHijosDocentesPorLibro = [];
                    me.aplicarDetalleHijosDocentesEnLibros([]);
                    return;
                }

                try {
                    const res = await me.$http.get(me.$server_url + 'obtener_detalle_hijos_docentes_por_contratos', {
                        params: {
                            contratos: contratosLimpios.join(','),
                            periodo: periodo
                        }
                    });

                    if (res.data && res.data.status === 200 && Array.isArray(res.data.data)) {
                        me.detalleHijosDocentesPorLibro = res.data.data;
                        me.aplicarDetalleHijosDocentesEnLibros(res.data.data);
                    } else {
                        me.detalleHijosDocentesPorLibro = [];
                        me.aplicarDetalleHijosDocentesEnLibros([]);
                    }
                } catch (e) {
                    me.detalleHijosDocentesPorLibro = [];
                    me.aplicarDetalleHijosDocentesEnLibros([]);
                }
            },

            aplicarDetalleHijosDocentesEnLibros(detalles) {
                let me = this;

                me.librosPedido = me.librosPedido.map(function(libro) {
                    return {
                        ...libro,
                        cantidad_hijos_docentes: 0
                    };
                });

                if (!Array.isArray(detalles) || detalles.length === 0) {
                    return;
                }

                detalles.forEach(function(detalle) {
                    const codigo = me.normalizarCodigoLibro(detalle.pro_codigo);
                    const cantidadHijos = parseInt(detalle.cantidad_hijos_docentes) || 0;
                    const precioDetalle = parseFloat(detalle.precio_referencial) || 0;
                    const nombreLibro = detalle.nombre_libro;
                    const lineaProducto = detalle && detalle.linea_producto_id != null ? parseInt(detalle.linea_producto_id, 10) : 0;

                    const existente = me.librosPedido.find(function(item) {
                        return me.normalizarCodigoLibro(item.pro_codigo) === codigo;
                    });

                    if (existente) {
                        const cantidadActual = parseInt(existente.cantidad_hijos_docentes) || 0;
                        existente.cantidad_hijos_docentes = cantidadActual + cantidadHijos;
                        if (existente.esLibroExtra && existente.cantidad_hijos_docentes > 0) {
                            existente.esLibroExtra = false;
                        }
                        if ((parseFloat(existente.precio) || 0) === 0 && precioDetalle > 0) {
                            existente.precio = precioDetalle;
                        }
                        if ((!existente.linea_producto_id || parseInt(existente.linea_producto_id, 10) <= 0) && lineaProducto > 0) {
                            existente.linea_producto_id = lineaProducto;
                        }
                    } else {
                        me.librosPedido.push({
                            pro_codigo: codigo,
                            nombre_libro: nombreLibro,
                            cantidad: 0,
                            cantidad_hijos_docentes: cantidadHijos,
                            precio: precioDetalle,
                            descuento: 0,
                            esLibroExtra: false,
                            linea_producto_id: lineaProducto
                        });
                    }
                });
            },

            // Métodos para la proforma
            abrirProforma() {
                console.log('Abriendo modal de proforma');
                let me = this;
                if (!me.pedidoSeleccionado) {
                    me.$vs.notify({
                        text: 'Primero debe seleccionar un pedido',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                if (!me.librosPedido || me.librosPedido.length === 0) {
                    me.$vs.notify({
                        text: 'No hay libros en el pedido seleccionado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                // ✅ VALIDAR QUE NO HAYA PROFORMAS PENDIENTES
                if (me.$refs.listaProformas && me.$refs.listaProformas.proformas) {
                    const proformasPendientes = me.$refs.listaProformas.proformas.filter(p => p.prof_estado === 1);

                    if (proformasPendientes.length > 0) {
                        me.$vs.notify({
                            title: '⛔ No se puede crear proforma',
                            text: `Existe ${proformasPendientes.length} proforma(s) <b>PENDIENTE</b>. Debe aprobar, anular o convertir a venta antes de crear una nueva proforma.`,
                            color: 'danger',
                            position: 'top-center',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 8000
                        });
                        return;
                    }
                }

                console.log(me.popupProforma,'proforma');
                me.popupProforma = true;
                console.log(me.popupProforma, 'proforma');

            },

            abrirVentasPerseo(){
                console.log('Abriendo modal de ventas Perseo');
                let me = this;
                
                // Si estamos en modo Venta Lista con totalizado
                if (me.filtroVentaPorLista && me.totalizado) {
                    if (!me.librosPedido || me.librosPedido.length === 0) {
                        me.$vs.notify({
                            text: 'No hay libros en el totalizado seleccionado',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }

                    if (!me.hayCantidadesPendientesParaVender()) {
                        me.$vs.notify({
                            text: 'Este pedido ya está vendido completamente. No hay cantidades pendientes para generar transacción.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 4000
                        });
                        return;
                    }

                    console.log('Abriendo modal Perseo para totalizado:', me.totalizado.ca_codigo_agrupado);
                    me.popupProformaPerseo = true;
                    return;
                }
                
                // Si estamos en modo normal (Directa o Lista sin totalizado)
                if (!me.pedidoSeleccionado) {
                    me.$vs.notify({
                        text: 'Primero debe seleccionar un pedido',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                if (!me.librosPedido || me.librosPedido.length === 0) {
                    me.$vs.notify({
                        text: 'No hay libros en el pedido seleccionado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                if (!me.hayCantidadesPendientesParaVender()) {
                    me.$vs.notify({
                        text: 'Este pedido ya está vendido completamente. No hay cantidades pendientes para generar transacción.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 4000
                    });
                    return;
                }

                // ✅ VALIDAR QUE NO HAYA PROFORMAS PENDIENTES
                if (me.$refs.listaProformas && me.$refs.listaProformas.proformas) {
                    const proformasPendientes = me.$refs.listaProformas.proformas.filter(p => p.prof_estado === 1);

                    if (proformasPendientes.length > 0) {
                        me.$vs.notify({
                            title: '⛔ No se puede crear proforma',
                            text: `Existe ${proformasPendientes.length} proforma(s) <b>PENDIENTE</b>. Debe aprobar, anular o convertir a venta antes de crear una nueva proforma.`,
                            color: 'danger',
                            position: 'top-center',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 8000
                        });
                        return;
                    }
                }

                console.log('Abriendo modal Perseo');
                me.popupProformaPerseo = true;
            },

            hayCantidadesPendientesParaVender() {
                let me = this;
                if (!me.librosPedido || me.librosPedido.length === 0) {
                    return false;
                }

                return me.librosPedido.some(function(libro) {
                    const cantidadContrato = me.getCantidadContratoMasHijos(libro);
                    const cantidadVendida = me.getCantidadVendidaTotal(libro.pro_codigo);
                    return (cantidadContrato - cantidadVendida) > 0;
                });
            },

            cargarProformaParaEditar(datos) {
                let me = this;

                // Detectar si recibimos objeto con id y tipo, o solo el ID (retrocompatibilidad)
                const proformaId = typeof datos === 'object' ? datos.id : datos;
                const esPerseo = typeof datos === 'object' ? datos.esPerseo : false;

                console.log('═══════════════════════════════════════════════════════');
                console.log('📝 ABRIENDO MODAL DE EDICIÓN DE PROFORMA');
                console.log('═══════════════════════════════════════════════════════');
                console.log('Proforma ID recibido:', proformaId);
                console.log('Es Perseo:', esPerseo);
                console.log('Tipo de ID:', typeof proformaId);
                console.log('═══════════════════════════════════════════════════════');
                console.log('Proforma ID recibido:', proformaId);
                console.log('Tipo de ID:', typeof proformaId);

                // VALIDAR que tengamos un ID válido
                if (!proformaId || proformaId === null || proformaId === undefined) {
                    me.$vs.notify({
                        text: 'Error: No se proporcionó un ID de proforma válido',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    console.error('❌ ID de proforma inválido:', proformaId);
                    return;
                }

                // VALIDAR que tengamos el pedido seleccionado
                if (!me.pedidoSeleccionado) {
                    me.$vs.notify({
                        text: 'Error: No hay pedido seleccionado para editar la proforma',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    console.error('❌ No hay pedido seleccionado');
                    return;
                }

                // VALIDAR que tengamos libros del pedido cargados
                if (!me.librosPedido || me.librosPedido.length === 0) {
                    me.$vs.notify({
                        text: 'Error: No hay libros cargados del pedido',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    console.error('❌ No hay libros del pedido');
                    return;
                }

                console.log('✅ Pedido seleccionado:', me.pedidoSeleccionado.id_pedido);
                console.log('✅ Contrato:', me.pedidoSeleccionado.contrato_generado);
                console.log('✅ Libros disponibles:', me.librosPedido.length);

                // Obtener cantidad de proformas del contrato desde el componente hijo
                if (me.$refs.listaProformas && me.$refs.listaProformas.proformas) {
                    me.cantidadProformasContrato = me.$refs.listaProformas.proformas.length;
                    console.log('✅ Cantidad de proformas en el contrato:', me.cantidadProformasContrato);
                } else {
                    me.cantidadProformasContrato = 1; // Por defecto si no se puede obtener
                }

                // Guardar ID de proforma a editar
                me.proformaEditarId = proformaId;

                // Abrir el modal correcto según el tipo de proforma
                if (esPerseo) {
                    me.popupProformaEditarPerseo = true;
                    console.log('✅ Modal de EDICIÓN PERSEO abierto');
                    console.log('   → Componente: ProformaEditarModalPerseo.vue');
                } else {
                    me.popupProformaEditar = true;
                    console.log('✅ Modal de EDICIÓN NORMAL abierto');
                    console.log('   → Componente: ProformaEditarModal.vue');
                }

                console.log('   → Proforma ID:', proformaId);
                console.log('═══════════════════════════════════════════════════════');
            },

            cerrarProformaEditar() {
                this.popupProformaEditar = false;
                this.proformaEditarId = null;
            },

            cerrarProformaEditarPerseo() {
                this.popupProformaEditarPerseo = false;
                this.proformaEditarId = null;
            },

            handleActualizarProforma(datosProforma) {
                console.log('Datos de proforma actualizada:', datosProforma);
                let me = this;

                // ✅ RECARGAR TODAS LAS 3 APIS para actualizar el listado general
                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    const contrato = me.pedidoSeleccionado.contrato_generado;
                    const periodo = me.periodoSelect.idperiodoescolar;

                    console.log('🔄 Recargando datos del listado general...');

                    // 1. Recargar libros de CONTRATO (valores base sin extras)
                    me.getLibrosPedido(me.pedidoSeleccionado);

                    // 2. Recargar libros VENDIDOS (proformados ya no se usa)
                    // me.getLibrosProformados(contrato, periodo); // YA NO SE USA
                    me.getLibrosVendidos(contrato, periodo);

                    console.log('✅ Listado general actualizado con valores reales de las APIs');
                }

                // Recargar la lista de proformas
                if (me.$refs.listaProformas) {
                    me.$refs.listaProformas.getProformas();
                    console.log('✅ Lista de proformas actualizada');
                }

                me.$vs.notify({
                    text: 'Proforma actualizada exitosamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });

                // Cerrar el modal después de actualizar
                me.cerrarProformaEditar();
            },

            cerrarProforma() {
                this.popupProforma = false;
            },

            cerrarProformaPerseo() {
                this.popupProformaPerseo = false;
            },

            handleGenerarProforma(datosProforma) {
                console.log('Datos de proforma recibidos:', datosProforma);
                let me = this;

                // ✅ RECARGAR TODAS LAS 3 APIS para actualizar el listado general
                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    const contrato = me.pedidoSeleccionado.contrato_generado;
                    const periodo = me.periodoSelect.idperiodoescolar;

                    console.log('🔄 Recargando datos del listado general...');

                    // 1. Recargar libros de CONTRATO (valores base sin extras)
                    me.getLibrosPedido(me.pedidoSeleccionado);

                    // 2. Recargar libros VENDIDOS (proformados ya no se usa)
                    // me.getLibrosProformados(contrato, periodo); // YA NO SE USA
                    me.getLibrosVendidos(contrato, periodo);

                    console.log('✅ Listado general actualizado con valores reales de las APIs');
                }

                // Recargar la lista de proformas
                if (me.$refs.listaProformas) {
                    me.$refs.listaProformas.getProformas();
                    console.log('✅ Lista de proformas actualizada después de crear');
                }

                // Nota: La notificación se muestra en el componente ProformaModal

                // Cerrar el modal después de generar
                me.cerrarProforma();
            },

            handleGenerarProformaPerseo(datosProforma) {
                console.log('Datos de proforma Perseo recibidos:', datosProforma);
                let me = this;

                // ✅ RECARGAR LISTADO GENERAL (venta directa o totalizado)
                me.refrescarListadoGeneral();

                // Recargar la lista de ventas
                if (me.$refs.listaVentas) {
                    me.$refs.listaVentas.getVentas();
                    console.log('✅ Lista de ventas actualizada después de crear (Perseo)');
                }

                // Nota: El modal se cierra automáticamente con el evento @cerrar
            },

            // Método que se ejecuta cuando se crea una venta desde una proforma
            handleVentaCreada() {
                console.log('═══════════════════════════════════════════════════════');
                console.log('✅ VENTA CREADA - Actualizando listado general');
                console.log('═══════════════════════════════════════════════════════');

                let me = this;

                // ✅ RECARGAR TODAS LAS 3 APIS para actualizar el listado general
                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    const contrato = me.pedidoSeleccionado.contrato_generado;
                    const periodo = me.periodoSelect.idperiodoescolar;

                    console.log('🔄 Recargando datos del listado general...');

                    // 1. Recargar libros de CONTRATO (valores base sin extras)
                    me.getLibrosPedido(me.pedidoSeleccionado);

                    // 2. Recargar libros VENDIDOS (proformados ya no se usa)
                    // me.getLibrosProformados(contrato, periodo); // YA NO SE USA
                    me.getLibrosVendidos(contrato, periodo);

                    console.log('✅ Listado general actualizado con valores reales de las APIs');
                }

                // Recargar la lista de ventas
                if (me.$refs.listaVentas) {
                    me.$refs.listaVentas.getVentas();
                    console.log('✅ Lista de ventas actualizada');
                }
            },

            // Método que se ejecuta cuando se anula una venta
            handleVentaAnulada() {
                console.log('═══════════════════════════════════════════════════════');
                console.log('✅ VENTA ANULADA - Actualizando listado general');
                console.log('═══════════════════════════════════════════════════════');
                let me = this;

                me.refrescarListadoGeneral();

                if (me.$refs.listaVentas) {
                    me.$refs.listaVentas.getVentas();
                    console.log('✅ Lista de ventas actualizada después de anular');
                }
            },

            // Método que se ejecuta cuando se genera una NC desde devoluciones
            handleDevolucionNCGenerada() {
                console.log('═══════════════════════════════════════════════════════');
                console.log('✅ NC GENERADA - Actualizando devoluciones');
                console.log('═══════════════════════════════════════════════════════');
                let me = this;

                // Recargar devoluciones y listado general
                me.getDatosConsolidados(); // Recargar datos consolidados
                me.refrescarListadoGeneral();
            },

            refrescarListadoGeneral() {
                let me = this;

                // Caso 1: venta por contrato (directa)
                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    const contrato = me.pedidoSeleccionado.contrato_generado;
                    const periodo = me.periodoSelect.idperiodoescolar;

                    console.log('🔄 Recargando listado general por contrato...');
                    me.getLibrosPedido(me.pedidoSeleccionado);
                    me.getLibrosVendidos(contrato, periodo);
                    console.log('✅ Listado general por contrato actualizado');
                    return;
                }

                // Caso 2: venta por lista (totalizado)
                if (me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    console.log('🔄 Recargando listado general por totalizado...');
                    me.getLibrosTotalizado(me.totalizado);
                    console.log('✅ Listado general por totalizado actualizado');
                    return;
                }

                console.log('⚠️ No hay contrato ni totalizado seleccionado para recargar listado general');
            },

            // Método que se ejecuta cuando se genera una venta de obsequios
            handleVentaObsequioGenerada(datosVenta) {
                console.log('═══════════════════════════════════════════════════════');
                console.log('✅ VENTA DE OBSEQUIO GENERADA - Actualizando listado');
                console.log('═══════════════════════════════════════════════════════');
                console.log('Datos de venta de obsequio:', datosVenta);

                let me = this;

                // Recargar libros del pedido si está seleccionado
                if (me.pedidoSeleccionado && me.pedidoSeleccionado.contrato_generado) {
                    const contrato = me.pedidoSeleccionado.contrato_generado;
                    const periodo = me.periodoSelect.idperiodoescolar;

                    console.log('🔄 Recargando datos del listado general (Obsequios)...');

                    // 1. Recargar libros de CONTRATO
                    me.getLibrosPedido(me.pedidoSeleccionado);

                    // 2. Recargar libros VENDIDOS
                    me.getLibrosVendidos(contrato, periodo);

                    console.log('✅ Listado general actualizado después de generar venta de obsequios');
                } else if (me.totalizado && me.totalizado.ca_codigo_agrupado) {
                    me.getLibrosTotalizado(me.totalizado);
                    console.log('✅ Listado general del totalizado actualizado después de generar venta de obsequios');
                }

                // Recargar la lista de ventas
                if (me.$refs.listaVentas) {
                    me.$refs.listaVentas.getVentas();
                    console.log('✅ Lista de ventas actualizada (Obsequios)');
                }

                // Recargar la lista de pedidos obsequios
                if (me.$refs.listadoObsequios) {
                    me.$refs.listadoObsequios.obtenerPedidosObsequios();
                    console.log('✅ Lista de obsequios actualizada');
                }
            },

            // Método para recargar todos los datos de la tabla manualmente
            recargarDatosTabla() {
                let me = this;

                if (!me.pedidoSeleccionado && !me.totalizado) {
                    me.$vs.notify({
                        text: 'No hay pedido ni totalizado seleccionado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                me.$vs.notify({
                    text: 'Actualizando datos...',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-refresh-cw'
                });

                if (me.totalizado) {
                    me.getLibrosTotalizado(me.totalizado);
                } else if (me.pedidoSeleccionado) {
                    me.getLibrosPedido(me.pedidoSeleccionado);
                }

                if (me.$refs.listaVentas) {
                    me.$refs.listaVentas.getVentas();
                }

                me.$vs.notify({
                    text: 'Datos actualizados correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 3000
                });
            },

            // ═══════════════════════════════════════════════════════
            // EXPORTAR A EXCEL
            // ═══════════════════════════════════════════════════════
            exportarExcel() {
                let me = this;
                if (me.librosParaTabla.length === 0) {
                    me.$vs.notify({
                        text: 'No hay datos para exportar',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                const exportandoTotalizado = me.totalizado && me.totalizado.ca_codigo_agrupado ? true : false;

                let institucion = 'Sin Institución';
                let contrato = 'Sin Contrato';
                let temporada = 'Sin Temporada';

                if (exportandoTotalizado) {
                    institucion = me.totalizado.ca_descripcion ? me.totalizado.ca_descripcion : 'Totalizado';
                    contrato = me.totalizado.ca_codigo_agrupado ? me.totalizado.ca_codigo_agrupado : 'Sin Código';
                    if (me.periodoSelect && me.periodoSelect.periodoescolar) {
                        temporada = me.periodoSelect.periodoescolar;
                    } else if (me.periodoSelect && me.periodoSelect.nombre_periodo) {
                        temporada = me.periodoSelect.nombre_periodo;
                    } else if (me.periodoSelect && me.periodoSelect.idperiodoescolar) {
                        temporada = 'Periodo ' + me.periodoSelect.idperiodoescolar;
                    }
                } else {
                    if (!me.pedidoSeleccionado) {
                        me.$vs.notify({
                            text: 'Seleccione un pedido o un totalizado para exportar',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }

                    institucion = me.pedidoSeleccionado.nombreInstitucion ? me.pedidoSeleccionado.nombreInstitucion : 'Sin Institución';
                    contrato = me.pedidoSeleccionado.contrato_generado ? me.pedidoSeleccionado.contrato_generado : 'Sin Contrato';
                    temporada = me.pedidoSeleccionado.periodo ? me.pedidoSeleccionado.periodo : 'Sin Temporada';
                }

                // ─── Función auxiliar para crear cabecera común ───
                const crearCabecera = () => {
                    return [
                        ['INSTITUCIÓN:', institucion],
                        ['CONTRATO:', contrato],
                        ['TEMPORADA:', temporada],
                        [] // fila vacía de separación
                    ];
                };

                // ════════════════════════════════════════════
                // HOJA 1: CONTRATO
                // ════════════════════════════════════════════
                const dataContrato = crearCabecera();
                dataContrato.push(['Código', 'Libro', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Descuento %', 'Total']);

                me.librosParaTabla.forEach(libro => {
                    const cantidad = parseInt(libro.cantidad) || 0;
                    const precio = parseFloat(libro.precio) || 0;
                    const subtotal = parseFloat(me.calcularSubtotalLibro(libro)) || 0;
                    const descuento = parseFloat(libro.descuento) || 0;
                    const total = parseFloat(me.calcularTotalLibro(libro)) || 0;

                    dataContrato.push([
                        libro.pro_codigo,
                        libro.nombre_libro,
                        cantidad,
                        precio,
                        subtotal,
                        descuento,
                        total
                    ]);
                });

                // Fila de totales Contrato
                dataContrato.push([]);
                dataContrato.push([
                    '', 'TOTALES',
                    me.totalesColumnas.contratoCantidad,
                    '',
                    parseFloat(me.totalesColumnas.contratoSubtotal) || 0,
                    '',
                    parseFloat(me.totalesColumnas.contratoTotal) || 0
                ]);

                // ════════════════════════════════════════════
                // HOJA 2: VENTAS
                // ════════════════════════════════════════════
                const dataVentas = crearCabecera();
                dataVentas.push(['Código', 'Libro', 'Cantidad Vendida', 'Descuento %', 'Subtotal', 'Total']);

                me.librosParaTabla.forEach(libro => {
                    // Obtener todos los detalles de venta para este libro
                    const detallesVenta = me.librosVendidos.filter(lv => lv.pro_codigo === libro.pro_codigo);
                    
                    if (detallesVenta.length > 0) {
                        // Mostrar cada detalle con su propio descuento
                        detallesVenta.forEach(detalle => {
                            dataVentas.push([
                                libro.pro_codigo,
                                libro.nombre_libro,
                                parseInt(detalle.cantidad_vendida) || 0,
                                parseFloat(detalle.descuento_venta) || 0,
                                parseFloat(detalle.subtotal_vendido) || 0,
                                parseFloat(detalle.total_vendido) || 0
                            ]);
                        });
                    }
                });

                // Fila de totales Ventas
                dataVentas.push([]);
                dataVentas.push([
                    '', 'TOTALES',
                    me.totalesColumnas.ventaCantidad,
                    '',
                    parseFloat(me.totalesColumnas.ventaSubtotal) || 0,
                    parseFloat(me.totalesColumnas.ventaTotal) || 0
                ]);

                // ════════════════════════════════════════════
                // HOJA 3: TODO (Contrato + Ventas + Pendientes)
                // ════════════════════════════════════════════
                const dataTodo = crearCabecera();
                dataTodo.push([
                    'Código', 'Libro',
                    'Cant. Contrato', 'Precio Unit.', 'Subtotal Contrato', 'Desc. Contrato %', 'Total Contrato',
                    'Cant. Vendida', 'Desc. Venta %', 'Subtotal Venta', 'Total Venta',
                    'Cant. Pendiente', 'Valor Pendiente'
                ]);

                me.librosParaTabla.forEach(libro => {
                    const cantidad = parseInt(libro.cantidad) || 0;
                    const precio = parseFloat(libro.precio) || 0;
                    const subtotalC = parseFloat(me.calcularSubtotalLibro(libro)) || 0;
                    const descuentoC = parseFloat(libro.descuento) || 0;
                    const totalC = parseFloat(me.calcularTotalLibro(libro)) || 0;
                    
                    // Obtener todos los detalles de venta para este libro
                    const detallesVenta = me.librosVendidos.filter(lv => lv.pro_codigo === libro.pro_codigo);
                    
                    if (detallesVenta.length > 0) {
                        // Mostrar cada detalle de venta por separado
                        detallesVenta.forEach(detalle => {
                            const pendCant = me.calcularPendienteCantidad(libro);
                            const pendVal = parseFloat(me.calcularPendienteValor(libro)) || 0;
                            
                            dataTodo.push([
                                libro.pro_codigo,
                                libro.nombre_libro,
                                cantidad,
                                precio,
                                subtotalC,
                                descuentoC,
                                totalC,
                                parseInt(detalle.cantidad_vendida) || 0,
                                parseFloat(detalle.descuento_venta) || 0,
                                parseFloat(detalle.subtotal_vendido) || 0,
                                parseFloat(detalle.total_vendido) || 0,
                                pendCant,
                                pendVal
                            ]);
                        });
                    } else {
                        // Si no hay ventas, mostrar la fila del contrato sin ventas
                        const pendCant = me.calcularPendienteCantidad(libro);
                        const pendVal = parseFloat(me.calcularPendienteValor(libro)) || 0;
                        
                        dataTodo.push([
                            libro.pro_codigo,
                            libro.nombre_libro,
                            cantidad,
                            precio,
                            subtotalC,
                            descuentoC,
                            totalC,
                            0,
                            0,
                            0,
                            0,
                            pendCant,
                            pendVal
                        ]);
                    }
                });

                // Fila de totales Todo
                dataTodo.push([]);
                dataTodo.push([
                    '', 'TOTALES',
                    me.totalesColumnas.contratoCantidad,
                    '',
                    parseFloat(me.totalesColumnas.contratoSubtotal) || 0,
                    '',
                    parseFloat(me.totalesColumnas.contratoTotal) || 0,
                    me.totalesColumnas.ventaCantidad,
                    '',
                    parseFloat(me.totalesColumnas.ventaSubtotal) || 0,
                    parseFloat(me.totalesColumnas.ventaTotal) || 0,
                    me.totalesColumnas.pendienteCantidad,
                    parseFloat(me.totalesColumnas.pendienteValor) || 0
                ]);

                // ─── Crear hojas de Excel ───
                const wsContrato = XLSX.utils.aoa_to_sheet(dataContrato);
                const wsVentas = XLSX.utils.aoa_to_sheet(dataVentas);
                const wsTodo = XLSX.utils.aoa_to_sheet(dataTodo);

                // ─── Ajustar anchos de columna ───
                const colWidthsContrato = [
                    { wch: 14 }, { wch: 40 }, { wch: 12 }, { wch: 14 },
                    { wch: 14 }, { wch: 14 }, { wch: 14 }
                ];
                const colWidthsVentas = [
                    { wch: 14 }, { wch: 40 }, { wch: 18 }, { wch: 14 },
                    { wch: 14 }, { wch: 14 }
                ];
                const colWidthsTodo = [
                    { wch: 14 }, { wch: 40 }, { wch: 16 }, { wch: 14 },
                    { wch: 18 }, { wch: 18 }, { wch: 16 },
                    { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
                    { wch: 16 }, { wch: 16 }
                ];
                wsContrato['!cols'] = colWidthsContrato;
                wsVentas['!cols'] = colWidthsVentas;
                wsTodo['!cols'] = colWidthsTodo;

                // ─── Crear workbook y agregar hojas ───
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, wsContrato, 'Contrato');
                XLSX.utils.book_append_sheet(wb, wsVentas, 'Ventas');
                XLSX.utils.book_append_sheet(wb, wsTodo, 'Todo');

                // ─── Generar nombre del archivo ───
                const nombreLimpio = institucion.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, '').trim().substring(0, 50);
                const nombreArchivo = `${nombreLimpio} - ${temporada}.xlsx`;

                // ─── Descargar ───
                XLSX.writeFile(wb, nombreArchivo);

                me.$vs.notify({
                    text: 'Excel exportado exitosamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            },

            // ═══════════════════════════════════════════════════════
            // MÉTODOS PARA VENTA LISTA (TOTALIZADOS)
            // ═══════════════════════════════════════════════════════

            /**
             * Cargar TODOS los pedidos por lista (agrupados y sin agrupar)
             */
            cargarPedidosLista() {
                let me = this;
                if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
                    return;
                }

                me.loadingPedidosLista = true;
                
                const ruta = `${me.$server_url}api/perseo/ventas-lista/pedidos-lista-completos?id_periodo=${me.periodoSelect.idperiodoescolar}`;
                
                me.$http.get(ruta)
                .then(res => {
                    me.loadingPedidosLista = false;
                    if (res.data.status === 'success') {
                        me.pedidosListaCompletos = res.data.data;
                    }
                })
                .catch((e) => {
                    me.loadingPedidosLista = false;
                    console.error('Error al cargar pedidos de lista completos:', e);
                });
            },

            /**
             * Obtener pedidos sin agrupar (disponibles para agrupar)
             */
            getPedidosSinAgrupar() {
                let me = this;
                if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
                    return;
                }

                me.loadingPedidosSinAgrupar = true;
                const url = `${me.$server_url}api/perseo/ventas-lista/pedidos-sin-agrupar?id_periodo=${me.periodoSelect.idperiodoescolar}`;

                me.$http.get(url)
                .then(res => {
                    me.loadingPedidosSinAgrupar = false;
                    if (res.data.status === 'success') {
                        me.pedidosSinAgrupar = res.data.data || [];
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al cargar pedidos', 'danger', 'alert-triangle');
                    }
                })
                .catch(e => {
                    me.loadingPedidosSinAgrupar = false;
                    console.error('Error al cargar pedidos sin agrupar:', e);
                    me.$f_notificacion('Error al cargar pedidos disponibles', 'danger', 'alert-circle');
                });
            },

            /**
             * Obtener todos los contratos agrupados (para V-Select)
             */
            getContratosAgrupados(idReselect) {
                let me = this;
                if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
                    return;
                }

                me.loadingTotalizados = true;
                const url = `${me.$server_url}api/perseo/ventas-lista/contratos-agrupados?id_periodo=${me.periodoSelect.idperiodoescolar}`;

                me.$http.get(url)
                .then(res => {
                    if (res.data.status === 'success') {
                        me.contratosAgrupados = res.data.data || [];
                        // NO cargar ventas y devoluciones aquí - ya se cargaron con getDatosConsolidados()
                    }
                })
                .then(() => {
                    me.loadingTotalizados = false;
                    
                    if (idReselect) {
                        const totalizadoActualizado = me.contratosAgrupados.find(function(c) { return c.id == idReselect; });
                        if (totalizadoActualizado) {
                            me.totalizado = totalizadoActualizado;
                            me.getLibrosTotalizado(totalizadoActualizado);
                        }
                    }
                })
                .catch(e => {
                    me.loadingTotalizados = false;
                    console.error('Error al cargar contratos agrupados:', e);
                });
            },

            /* ===================== DEVOLUCIONES ===================== */
            obtenerDevolucionesPorContrato(contrato) {
                let me = this;
                const contratoLimpio = contrato ? contrato.toString().trim() : '';
                if (!contratoLimpio) return [];

                const grupo = me.devolucionesPorContrato.find(function(item) {
                    return item && item.contrato_generado === contratoLimpio;
                });

                if (!grupo || !grupo.devoluciones || !Array.isArray(grupo.devoluciones)) return [];
                return grupo.devoluciones;
            },

            obtenerDevolucionesPorTotalizado(codigoTotalizado) {
                let me = this;
                const grupo = me.devolucionesPorTotalizados.find(function(item) {
                    return item && item.ca_codigo_agrupado === codigoTotalizado;
                });

                if (grupo && grupo.devoluciones && Array.isArray(grupo.devoluciones) && grupo.devoluciones.length > 0) {
                    return grupo.devoluciones;
                }

                // Fallback robusto: mapear por contratos del totalizado.
                const contratos = me.obtenerContratosDelTotalizado(codigoTotalizado);
                if (contratos.length > 0) {
                    return (me.devoluciones || []).filter(function(d) {
                        const contrato = (d.contrato || d.contrato_generado || '').toString().trim();
                        return contrato !== '' && contratos.includes(contrato);
                    });
                }

                // Si nada aplica, devolver vacío
                return [];
            },

            obtenerContratosDelTotalizado(codigoTotalizado) {
                let me = this;
                const salida = [];
                const agregarContrato = function(valor) {
                    const c = valor ? valor.toString().trim() : '';
                    if (c !== '' && !salida.includes(c)) {
                        salida.push(c);
                    }
                };

                const totalizadoObj = (me.contratosAgrupados || []).find(function(t) {
                    return t && t.ca_codigo_agrupado === codigoTotalizado;
                }) || ((me.totalizado && me.totalizado.ca_codigo_agrupado === codigoTotalizado) ? me.totalizado : null);

                if (totalizadoObj && totalizadoObj.contratos) {
                    totalizadoObj.contratos.split(',').forEach(function(c) {
                        agregarContrato(c);
                    });
                }

                // Respaldo: usar pedidos cargados para derivar contratos del totalizado.
                (me.pedidosListaCompletos || []).forEach(function(p) {
                    const codigo = p && p.ca_codigo_agrupado ? p.ca_codigo_agrupado.toString().trim() : '';
                    if (codigo === codigoTotalizado) {
                        agregarContrato(p.contrato_generado);
                    }
                });

                return salida;
            },

            abrirDevolucion(ven_codigo) {
                let me = this;
                if (!ven_codigo) return;
                me.devolucionSeleccionada = null;
                me.detallesDevolucion = [];
                me.detallesDevolucionEdicion = [];
                me.previewNotaCreditoNC = null;
                me.empresaPruebaNC = null;
                me.totalesDetalleDevolucion = {
                    total_items: 0,
                    total_cantidad: 0,
                    total_valor: 0,
                    total_mismatches: 0,
                };
                me.showModalDevolucion = true;

                const urlHeader = `${me.$server_url}api/perseo/ventas-lista/devolucion-detalle?ven_codigo=${encodeURIComponent(ven_codigo)}&periodo=${me.periodoSelect ? me.periodoSelect.idperiodoescolar : ''}`;
                me.$http.get(urlHeader)
                .then(res => {
                    if (res.data && (res.data.status === 'success' || res.data.status == 200)) {
                        const header = res.data.header ? res.data.header : {};
                        const venta = res.data.venta ? res.data.venta : {};
                        me.devolucionSeleccionada = Object.assign({}, venta, header, { ven_codigo: ven_codigo });
                        me.detallesDevolucion = Array.isArray(res.data.son) ? res.data.son : (Array.isArray(res.data.data_detalles) ? res.data.data_detalles : []);
                        me.inicializarEdicionNotaCredito();
                        me.totalesDetalleDevolucion = res.data.totales ? res.data.totales : {
                            total_items: 0,
                            total_cantidad: 0,
                            total_valor: 0,
                            total_mismatches: 0,
                        };
                    } else {
                        me.$f_notificacion(res.data && res.data.message ? res.data.message : 'Error al cargar devolución', 'danger', 'alert-circle');
                        me.devolucionSeleccionada = { ven_codigo };
                        me.detallesDevolucion = [];
                        me.totalesDetalleDevolucion = {
                            total_items: 0,
                            total_cantidad: 0,
                            total_valor: 0,
                            total_mismatches: 0,
                        };
                    }
                })
                .catch(() => {
                    me.$f_notificacion('Error al cargar detalle de devolución', 'danger', 'alert-circle');
                    me.devolucionSeleccionada = { ven_codigo };
                    me.detallesDevolucion = [];
                    me.detallesDevolucionEdicion = [];
                    me.totalesDetalleDevolucion = {
                        total_items: 0,
                        total_cantidad: 0,
                        total_valor: 0,
                        total_mismatches: 0,
                    };
                });
            },

            inicializarEdicionNotaCredito() {
                let me = this;
                const baseEmpresa = me.devolucionSeleccionada && me.devolucionSeleccionada.id_empresa
                    ? parseInt(me.devolucionSeleccionada.id_empresa)
                    : null;
                me.empresaPruebaNC = baseEmpresa;
                me.previewNotaCreditoNC = null;

                me.detallesDevolucionEdicion = (me.detallesDevolucion || []).map(function(item) {
                    const cantidadDevolucion = parseFloat(item.cantidad_devolucion || item.cantidad || 0);
                    const precio = parseFloat(item.precio || item.det_ven_valor_u || item.precio_venta || 0);
                    return Object.assign({}, item, {
                        incluir_nc: true,
                        pro_codigo_nc: item.pro_codigo,
                        cantidad_nc: cantidadDevolucion,
                        subtotal_nc: cantidadDevolucion * precio,
                    });
                });
            },

            construirDetallesOverrideNC() {
                let me = this;
                if (!me.userRoot) {
                    return [];
                }

                return (me.detallesDevolucionEdicion || [])
                    .filter(function(item) {
                        return item && item.incluir_nc && parseFloat(item.cantidad_nc || 0) > 0;
                    })
                    .map(function(item) {
                        return {
                            pro_codigo: item.pro_codigo_nc ? item.pro_codigo_nc.toString().trim() : item.pro_codigo,
                            cantidad: parseFloat(item.cantidad_nc || 0),
                        };
                    });
            },

            ejecutarNotaCreditoDevolucion(enviar) {
                let me = this;
                if (!me.devolucionSeleccionada || !me.devolucionSeleccionada.ven_codigo) {
                    me.$f_notificacion('Seleccione una devolución válida', 'warning', 'alert-triangle');
                    return;
                }

                me.$vs.dialog({
                    type: 'confirm',
                    color: 'success',
                    title: enviar ? 'Generar Nota de Crédito' : 'Vista previa de Nota de Crédito',
                    text: enviar ? `Se enviará la NC de la devolución ${me.devolucionSeleccionada.ven_codigo} a Perseo. ¿Desea continuar?` : `Se generará una vista previa de la NC de la devolución ${me.devolucionSeleccionada.ven_codigo}. ¿Desea continuar?`,
                    accept: function() {
                        me.loadingGenerarNC = true;
                        const url = `${me.$server_url}api/perseo/ventas-lista/devolucion-nota-credito`;
                        const payload = {
                            ven_codigo: me.devolucionSeleccionada.ven_codigo,
                            id_empresa: me.empresaPruebaNC || me.devolucionSeleccionada.id_empresa,
                            enviar: enviar ? 1 : 0,
                            detalles_override: me.construirDetallesOverrideNC(),
                            usuario_id: me.usuario && me.usuario.idusuario ? me.usuario.idusuario : 0,
                        };

                        me.$http.post(url, payload)
                        .then(function(res) {
                            me.loadingGenerarNC = false;
                            const status = res.data.status;
                            const resumen = res.data.resumen || {};
                            const procesadosOk = resumen.procesados_ok || 0;
                            const procesadosError = resumen.procesados_error || 0;
                            const item = res.data && Array.isArray(res.data.data) && res.data.data.length > 0 ? res.data.data[0] : null;
                            
                            if (enviar) {
                                // Caso 1: Éxito total
                                if (status === 'success' && procesadosOk > 0 && procesadosError === 0) {
                                    me.$f_notificacion(res.data.message || 'Nota de crédito enviada correctamente a Perseo', 'success', 'check');
                                }
                                // Caso 2: Éxito parcial
                                else if (status === 'partial_success' && procesadosOk > 0) {
                                    me.$f_notificacion(res.data.message || `Se procesaron ${procesadosOk} documentos, pero ${procesadosError} fallaron`, 'warning', 'alert-triangle');
                                }
                                // Caso 3: Error total
                                else {
                                    let msg = res.data.message || 'Error al generar la nota de crédito';
                                    
                                    // Intentar obtener mensaje de error más específico
                                    if (item && item.message) {
                                        msg = item.message;
                                        
                                        // Detectar error específico de Perseo
                                        if (item.respuesta_perseo && item.respuesta_perseo.message) {
                                            const perseoMsg = item.respuesta_perseo.message;
                                            if (perseoMsg.includes('Error HTTP') || perseoMsg.includes('foreign key constraint fails')) {
                                                msg = 'Error al enviar a Perseo: El sistema Perseo rechazó la nota de crédito. Verifique la configuración de forma de pago y datos de la factura base.';
                                            } else {
                                                msg = `Error en Perseo: ${perseoMsg}`;
                                            }
                                        }
                                    }
                                    
                                    me.$f_notificacion(msg, 'danger', 'alert-circle');
                                }
                            } else {
                                // Vista previa
                                if (item && parseInt(item.status) === 1) {
                                    me.previewNotaCreditoNC = item;
                                    me.$f_notificacion('Vista previa generada correctamente', 'success', 'check');
                                } else {
                                    const mensaje = item && item.message ? item.message : 'No se pudo generar la vista previa';
                                    me.$f_notificacion(mensaje, 'danger', 'alert-circle');
                                }
                            }
                        })
                        .catch(function(e) {
                            me.loadingGenerarNC = false;
                            const mensaje = e.response && e.response.data && e.response.data.message ? e.response.data.message : 'Error al generar la nota de crédito';
                            me.$f_notificacion(mensaje, 'danger', 'alert-circle');
                        });
                    }
                });
            },

            previsualizarNotaCreditoDevolucion() {
                this.ejecutarNotaCreditoDevolucion(false);
            },

            generarNotaCreditoDevolucion() {
                this.ejecutarNotaCreditoDevolucion(true);
            },

            obtenerVentasPorContrato(contrato) {
                let me = this;
                const contratoLimpio = contrato ? contrato.toString().trim() : '';
                if (!contratoLimpio) {
                    return [];
                }

                const grupo = me.ventasPorContrato.find(function(item) {
                    return item && item.contrato_generado === contratoLimpio;
                });

                if (!grupo || !grupo.ventas || !Array.isArray(grupo.ventas)) {
                    return [];
                }

                return grupo.ventas;
            },

            obtenerVentasTextoContrato(contrato) {
                let me = this;
                const ventas = me.obtenerVentasPorContrato(contrato);
                if (!ventas || ventas.length === 0) {
                    return 'Sin ventas';
                }
                return ventas.map(function(v) {
                    let texto = me.formatearCodigoVenta(v);
                    // Agregar documento de devolución si existe
                    if (v.codigo_devolucion_facturador) {
                        texto += ' [Dev: ' + v.codigo_devolucion_facturador + ']';
                    }
                    return texto;
                }).filter(function(codigo) {
                    return codigo !== '';
                }).join(', ');
            },

            formatearCodigoVenta(venta) {
                const codigo = venta && venta.ven_codigo ? venta.ven_codigo.toString().trim() : '';
                if (codigo === '') {
                    return '';
                }

                const estado = venta && venta.est_ven_codigo != null ? parseInt(venta.est_ven_codigo, 10) : 0;
                if (estado === 3) {
                    return codigo + ' (Anulada)';
                }

                return codigo;
            },

            obtenerVentasPorTotalizado(codigoTotalizado) {
                let me = this;
                const grupo = me.ventasPorTotalizados.find(function(item) {
                    return item && item.ca_codigo_agrupado === codigoTotalizado;
                });

                if (!grupo || !grupo.ventas || !Array.isArray(grupo.ventas)) {
                    return [];
                }

                return grupo.ventas;
            },

            obtenerVentasTextoTotalizado(codigoTotalizado) {
                let me = this;
                const ventas = me.obtenerVentasPorTotalizado(codigoTotalizado);
                if (!ventas || ventas.length === 0) {
                    return 'Sin ventas';
                }
                return ventas.map(function(v) {
                    let texto = me.formatearCodigoVenta(v);
                    // Agregar documento de devolución si existe
                    if (v.codigo_devolucion_facturador) {
                        texto += ' [Dev: ' + v.codigo_devolucion_facturador + ']';
                    }
                    return texto;
                }).filter(function(codigo) {
                    return codigo !== '';
                }).join(', ');
            },

            tieneDevolucionesPendientesTotalizado(codigoTotalizado) {
                let me = this;
                const devoluciones = me.obtenerDevolucionesPorTotalizado(codigoTotalizado);
                // Usa nc_pendiente del backend si existe, sino fallback a lógica anterior
                return devoluciones.some(d => d.nc_pendiente !== undefined ? d.nc_pendiente : (!d.nota_credito || !d.id_nota_credito_perseo));
            },

            // Calcula la cantidad pendiente de NC para un documento de devolución
            cantidadPendienteDoc(d) {
                const total   = parseFloat(d.cantidad_devolucion || 0);
                const enviado = parseFloat(d.cantidad_nc_enviada_total || 0);
                return Math.max(0, total - enviado);
            },

            abrirDevolucionConLoading(ven_codigo) {
                let me = this;
                me.loadingVerDevolucion = true;
                
                // Esperar un momento para que se vea el loading
                setTimeout(() => {
                    if (me.$refs.listaDevoluciones) {
                        me.$refs.listaDevoluciones.abrirDevolucion(ven_codigo);
                    }
                    me.loadingVerDevolucion = false;
                }, 300);
            },

            abrirDevolucionDesdeHijo(ven_codigo) {
                this.abrirDevolucionConLoading(ven_codigo);
            },

            filtrarPedidosDirecta(options, search) {
                if (!search) {
                    return options;
                }

                let me = this;
                const searchLower = search.toLowerCase().trim();

                return options.filter(function(option) {
                    // Validar que option existe
                    if (!option) return false;

                    const institucion = option.nombreInstitucion ? option.nombreInstitucion.toString().toLowerCase() : '';
                    const pedido = option.id_pedido ? option.id_pedido.toString().toLowerCase() : '';
                    const asesor = option.asesor ? option.asesor.toString().toLowerCase() : '';
                    const contrato = option.contrato_generado ? option.contrato_generado.toString().toLowerCase() : '';
                    
                    // Obtener ventas del contrato
                    const ventas = me.obtenerVentasPorContrato(option.contrato_generado || '')
                        .map(function(v) {
                            if (!v) return '';
                            const codigo = v.ven_codigo ? v.ven_codigo.toString().toLowerCase() : '';
                            const devolucion = v.codigo_devolucion_facturador ? v.codigo_devolucion_facturador.toString().toLowerCase() : '';
                            const estado = v.est_ven_codigo != null ? parseInt(v.est_ven_codigo, 10) : 0;
                            let texto = codigo;
                            if (devolucion) {
                                texto += ' ' + devolucion;
                            }
                            if (estado === 3) {
                                texto += ' anulada anulado';
                            }
                            return texto;
                        })
                        .join(' ');

                    // Buscar en todos los campos
                    return institucion.includes(searchLower) ||
                        pedido.includes(searchLower) ||
                        asesor.includes(searchLower) ||
                        contrato.includes(searchLower) ||
                        ventas.includes(searchLower);
                });
            },

            /**
             * Filtrar totalizados en el v-select por múltiples campos
             */
            filtrarTotalizados(options, search) {
                let me = this;
                
                // Primero filtrar por devoluciones pendientes si está activo
                let optionsFiltradas = options;
                if (me.filtroSoloDevolucionesPendientesLista) {
                    optionsFiltradas = options.filter(option => {
                        return me.tieneDevolucionesPendientesTotalizado(option.ca_codigo_agrupado);
                    });
                }
                
                if (!search) {
                    return optionsFiltradas;
                }
                
                const searchLower = search.toLowerCase().trim();
                
                return optionsFiltradas.filter(option => {
                    // Validar que option existe
                    if (!option) return false;

                    const descripcion = (option.ca_descripcion || '').toLowerCase();
                    const codigo = (option.ca_codigo_agrupado || '').toLowerCase();
                    const contratos = (option.contratos || '').toLowerCase();
                    const instituciones = (option.instituciones || '').toLowerCase();
                    const asesores = (option.asesores || '').toLowerCase();
                    
                    // Obtener ventas del totalizado
                    const grupoVentas = me.ventasPorTotalizados.find(function(item) {
                        return item && item.ca_codigo_agrupado === option.ca_codigo_agrupado;
                    });
                    
                    const ventas = grupoVentas && grupoVentas.ventas && Array.isArray(grupoVentas.ventas)
                        ? grupoVentas.ventas.map(function(v) {
                            if (!v) return '';
                            const codigo = v.ven_codigo ? v.ven_codigo.toString().toLowerCase() : '';
                            const devolucion = v.codigo_devolucion_facturador ? v.codigo_devolucion_facturador.toString().toLowerCase() : '';
                            const estado = v.est_ven_codigo != null ? parseInt(v.est_ven_codigo, 10) : 0;
                            let texto = codigo;
                            if (devolucion) {
                                texto += ' ' + devolucion;
                            }
                            if (estado === 3) {
                                texto += ' anulada anulado';
                            }
                            return texto;
                        }).join(' ')
                        : '';
                    
                    // Buscar en todos los campos
                    return descripcion.includes(searchLower) ||
                           codigo.includes(searchLower) ||
                           contratos.includes(searchLower) ||
                           instituciones.includes(searchLower) ||
                           asesores.includes(searchLower) ||
                           ventas.includes(searchLower);
                });
            },

            /**
             * Toggle checkbox de selección de pedido
             */
            toggleSeleccionPedido(idPedido) {
                let me = this;
                const esPedidoDelTotalizado = me.pedidosDelTotalizado.some(p => p.id_pedido == idPedido);
                const esPedidoDisponible = me.pedidosDisponiblesParaAgregar.some(p => p.id_pedido == idPedido);

                if (me.modoEditarTotalizado && !esPedidoDelTotalizado && !esPedidoDisponible) {
                    me.$f_notificacion('Este contrato ya pertenece a otro totalizado y no se puede seleccionar.', 'warning', 'alert-triangle');
                    return;
                }

                if (me.bloquearQuitarContratosTotalizado && !me.userRoot && esPedidoDelTotalizado) {
                    return;
                }
                const index = me.pedidosSeleccionados.indexOf(idPedido);
                if (index > -1) {
                    me.pedidosSeleccionados.splice(index, 1);
                } else {
                    me.pedidosSeleccionados.push(idPedido);
                }
            },

            /**
             * Seleccionar o deseleccionar todos los pedidos mostrados en la tabla
             */
            toggleSeleccionarTodos() {
                let me = this;

                const idsFiltrados = me.pedidosListaFiltradosBase.map(function(p) { return p.id_pedido; });
                if (idsFiltrados.length === 0) {
                    return;
                }

                if (me.todosSeleccionados) {
                    me.pedidosSeleccionados = me.pedidosSeleccionados.filter(function(id) {
                        return !idsFiltrados.includes(id);
                    });
                } else {
                    me.pedidosSeleccionados = [...new Set([...me.pedidosSeleccionados, ...idsFiltrados])];
                }
            },

            limpiarFiltrosPedidosTotalizado() {
                this.busquedaPedidosTotalizado = '';
                this.ciudadFiltroTotalizado = null;
                this.mostrarSoloSeleccionadosTotalizado = false;
            },

            limpiarFiltrosDisponiblesTotalizado() {
                this.busquedaDisponiblesTotalizado = '';
                this.ciudadFiltroDisponiblesTotalizado = null;
                this.mostrarSoloSeleccionadosDisponibles = false;
            },

            /**
             * Seleccionar o deseleccionar todos los pedidos del totalizado
             */
            toggleSeleccionarTodosDelTotalizado() {
                let me = this;
                if (me.bloquearQuitarContratosTotalizado && !me.userRoot) {
                    const idsDelTotalizadoBloqueados = me.pedidosDelTotalizado.map(p => p.id_pedido);
                    me.pedidosSeleccionados = [...new Set([...me.pedidosSeleccionados, ...idsDelTotalizadoBloqueados])];
                    return;
                }
                
                if (me.todosDelTotalizadoSeleccionados) {
                    const idsDelTotalizado = me.pedidosDelTotalizado.map(p => p.id_pedido);
                    me.pedidosSeleccionados = me.pedidosSeleccionados.filter(id => !idsDelTotalizado.includes(id));
                } else {
                    const idsDelTotalizado = me.pedidosDelTotalizado.map(p => p.id_pedido);
                    me.pedidosSeleccionados = [...new Set([...me.pedidosSeleccionados, ...idsDelTotalizado])];
                }
            },

            /**
             * Seleccionar o deseleccionar todos los pedidos disponibles
             */
            toggleSeleccionarTodosDisponibles() {
                let me = this;
                const idsDisponibles = me.pedidosDisponiblesFiltradosBase.map(function(p) { return p.id_pedido; });
                if (idsDisponibles.length === 0) {
                    return;
                }
                
                if (me.todosDisponiblesSeleccionados) {
                    me.pedidosSeleccionados = me.pedidosSeleccionados.filter(id => !idsDisponibles.includes(id));
                } else {
                    me.pedidosSeleccionados = [...new Set([...me.pedidosSeleccionados, ...idsDisponibles])];
                }
            },

            /**
             * Iniciar el modo de creación de totalizado
             */
            iniciarCreacionTotalizado() {
                let me = this;
                me.modoCrearTotalizado = true;
                me.modoEditarTotalizado = false;
                me.totalizado = null;
                me.pedidosSeleccionados = [];
                me.descripcionAgrupacion = '';
                me.busquedaPedidosTotalizado = '';
                me.ciudadFiltroTotalizado = null;
                me.mostrarSoloSeleccionadosTotalizado = false;
                me.busquedaDisponiblesTotalizado = '';
                me.ciudadFiltroDisponiblesTotalizado = null;
                me.mostrarSoloSeleccionadosDisponibles = false;
                me.cargarPedidosLista();
                me.popupCrearAgrupacion = true;
            },

            /**
             * Iniciar el modo de edición de totalizado
             */
            async iniciarEdicionTotalizado() {
                let me = this;
                if (!me.totalizado) return;

                await me.verificarVentasTotalizadoParaEdicion();
                
                me.modoEditarTotalizado = true;
                me.modoCrearTotalizado = false;
                me.pedidosSeleccionados = me.pedidosListaCompletos
                    .filter(p => p.ca_codigo_agrupado === me.totalizado.ca_codigo_agrupado)
                    .map(p => p.id_pedido);
                me.popupCrearAgrupacion = true;
            },

            async verificarVentasTotalizadoParaEdicion() {
                let me = this;
                me.bloquearQuitarContratosTotalizado = false;

                if (me.userRoot) {
                    return;
                }

                if (!me.totalizado || !me.totalizado.ca_codigo_agrupado) {
                    return;
                }

                if (me.librosVendidos && Array.isArray(me.librosVendidos) && me.librosVendidos.length > 0) {
                    me.bloquearQuitarContratosTotalizado = true;
                    return;
                }

                if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
                    return;
                }

                me.loadingVerificarVentasTotalizado = true;
                try {
                    const url = `${me.$server_url}get_libros_vendidos_por_totalizado?totalizado=${me.totalizado.ca_codigo_agrupado}&periodo=${me.periodoSelect.idperiodoescolar}`;
                    const res = await me.$http.get(url);
                    if (res.data && res.data.status == 200 && res.data.data && res.data.data.length > 0) {
                        me.bloquearQuitarContratosTotalizado = true;
                    }
                } catch (e) {
                    if (me.librosVendidos && Array.isArray(me.librosVendidos) && me.librosVendidos.length > 0) {
                        me.bloquearQuitarContratosTotalizado = true;
                    }
                } finally {
                    me.loadingVerificarVentasTotalizado = false;
                }
            },

            /**
             * Cancelar creación o edición de totalizado
             */
            cancelarCreacionEdicion() {
                let me = this;
                me.modoCrearTotalizado = false;
                me.modoEditarTotalizado = false;
                me.bloquearQuitarContratosTotalizado = false;
                me.pedidosSeleccionados = [];
                me.descripcionAgrupacion = '';
                me.popupCrearAgrupacion = false;
            },

            /**
             * Abrir popup para crear agrupación
             */
            abrirPopupCrearAgrupacion() {
                let me = this;
                me.modoCrearTotalizado = true;
                me.modoEditarTotalizado = false;
                me.descripcionAgrupacion = '';
                me.popupCrearAgrupacion = true;
            },

            /**
             * Crear agrupación de contratos
             */
            crearAgrupacion() {
                let me = this;
                if (!me.descripcionAgrupacion.trim()) {
                    me.$f_notificacion('Debe ingresar una descripción para el grupo', 'warning', 'alert-triangle');
                    return;
                }

                if (me.pedidosSeleccionados.length === 0) {
                    me.$f_notificacion('Debe seleccionar al menos un pedido', 'warning', 'alert-triangle');
                    return;
                }

                me.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: 'Confirmar creación de totalizado',
                    text: `Se va a generar el totalizado "${me.descripcionAgrupacion}" con ${me.pedidosSeleccionados.length} contrato(s). ¿Desea continuar?`,
                    accept: () => {
                        me.ejecutarCrearAgrupacion();
                    }
                });
            },

            ejecutarCrearAgrupacion() {
                let me = this;

                me.loadingCrearAgrupacion = true;
                const url = `${me.$server_url}api/perseo/ventas-lista/crear-agrupacion`;

                const payload = {
                    id_periodo: me.periodoSelect.idperiodoescolar,
                    descripcion: me.descripcionAgrupacion,
                    pedidos: me.pedidosSeleccionados,
                    id_usuario: me.usuario.idusuario
                };

                me.$http.post(url, payload)
                .then(res => {
                    me.loadingCrearAgrupacion = false;
                    if (res.data.status === 'success') {
                        me.$f_notificacion(`Agrupación creada: ${res.data.data.codigo}`, 'success', 'check');
                        me.popupCrearAgrupacion = false;
                        me.descripcionAgrupacion = '';
                        me.pedidosSeleccionados = [];
                        me.modoCrearTotalizado = false;
                        me.cargarPedidosLista();
                        me.getContratosAgrupados();
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al crear agrupación', 'danger', 'alert-triangle');
                    }
                })
                .catch(e => {
                    me.loadingCrearAgrupacion = false;
                    const errorMsg = e.response && e.response.data && e.response.data.message 
                        ? e.response.data.message 
                        : 'Error al crear agrupación';
                    me.$f_notificacion(errorMsg, 'danger', 'alert-circle');
                });
            },

            /**
             * Actualizar totalizado existente (agregar o quitar pedidos)
             */
            actualizarTotalizado() {
                let me = this;

                if (!me.totalizado || !me.totalizado.id) {
                    me.$f_notificacion('Debe seleccionar un totalizado', 'warning', 'alert-triangle');
                    return;
                }

                const pedidosActuales = me.pedidosListaCompletos
                    .filter(p => p.ca_codigo_agrupado === me.totalizado.ca_codigo_agrupado)
                    .map(p => p.id_pedido);
                
                // SI NO HAY PEDIDOS SELECCIONADOS = ANULAR TOTALIZADO
                if (me.pedidosSeleccionados.length === 0) {
                    me.$vs.dialog({
                        type: 'confirm',
                        color: 'danger',
                        title: 'Anular Totalizado',
                        text: `El totalizado "${me.totalizado.ca_descripcion}" será ANULADO porque no quedan pedidos seleccionados. Todos los ${pedidosActuales.length} pedido(s) serán liberados. ¿Desea continuar?`,
                        accept: () => {
                            me.anularTotalizado('Totalizado sin pedidos (anulación automática)');
                        }
                    });
                    return;
                }

                const pedidosAgregados = me.pedidosSeleccionados.filter(id => !pedidosActuales.includes(id));
                const pedidosQuitados = pedidosActuales.filter(id => !me.pedidosSeleccionados.includes(id));
                const pedidosEnOtrosTotalizados = me.pedidosListaCompletos.filter(p => {
                    if (!me.pedidosSeleccionados.includes(p.id_pedido)) {
                        return false;
                    }
                    if (!p.ca_codigo_agrupado) {
                        return false;
                    }
                    return p.ca_codigo_agrupado !== me.totalizado.ca_codigo_agrupado;
                });

                if (pedidosEnOtrosTotalizados.length > 0) {
                    me.$f_notificacion('Hay contratos seleccionados que ya están en otro totalizado. Solo puedes agregar contratos sin totalizar.', 'warning', 'alert-triangle');
                    return;
                }

                if (me.bloquearQuitarContratosTotalizado && !me.userRoot && pedidosQuitados.length > 0) {
                    me.pedidosSeleccionados = [...new Set([...me.pedidosSeleccionados, ...pedidosActuales])];
                    me.$f_notificacion('Este totalizado tiene ventas registradas. Solo puede agregar contratos.', 'warning', 'alert-triangle');
                    return;
                }

                let mensajeCambios = '';
                if (pedidosAgregados.length > 0 && pedidosQuitados.length > 0) {
                    mensajeCambios = `Se agregarán ${pedidosAgregados.length} pedido(s) y se quitarán ${pedidosQuitados.length} pedido(s)`;
                } else if (pedidosAgregados.length > 0) {
                    mensajeCambios = `Se agregarán ${pedidosAgregados.length} pedido(s)`;
                } else if (pedidosQuitados.length > 0) {
                    mensajeCambios = `Se quitarán ${pedidosQuitados.length} pedido(s)`;
                } else {
                    me.$f_notificacion('No hay cambios para guardar', 'warning', 'alert-triangle');
                    return;
                }

                me.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: 'Confirmar Cambios',
                    text: `${mensajeCambios} del totalizado "${me.totalizado.ca_descripcion}". ¿Desea continuar?`,
                    accept: () => {
                        me.ejecutarActualizarTotalizado();
                    }
                });
            },

            /**
             * Ejecutar actualización del totalizado
             */
            ejecutarActualizarTotalizado() {
                let me = this;
                me.loadingActualizarTotalizado = true;

                const url = `${me.$server_url}api/perseo/ventas-lista/editar-agrupacion/${me.totalizado.id}`;

                const payload = {
                    descripcion: me.totalizado.ca_descripcion,
                    pedidos: me.pedidosSeleccionados,
                    id_usuario: me.usuario.idusuario,
                };

                me.$http.put(url, payload)
                .then(res => {
                    me.loadingActualizarTotalizado = false;
                    if (res.data.status === 'success') {
                        const idTotalizadoActual = me.totalizado.id;
                        me.$f_notificacion('Totalizado actualizado correctamente', 'success', 'check');
                        me.modoEditarTotalizado = false;
                        me.popupCrearAgrupacion = false;
                        me.pedidosSeleccionados = [];
                        me.totalizado = null;
                        me.cargarPedidosLista();
                        me.getContratosAgrupados(idTotalizadoActual);
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al actualizar totalizado', 'danger', 'alert-triangle');
                    }
                })
                .catch(e => {
                    me.loadingActualizarTotalizado = false;
                    me.$f_notificacion(e.response && e.response.data && e.response.data.message ? e.response.data.message : 'Error al actualizar totalizado', 'danger', 'alert-circle');
                });
            },

            /**
             * Anular totalizado (llamado automáticamente cuando no quedan pedidos)
             */
            anularTotalizado(motivo) {
                let me = this;
                
                if (!me.totalizado || !me.totalizado.id) {
                    me.$f_notificacion('Debe seleccionar un totalizado', 'warning', 'alert-triangle');
                    return;
                }

                me.$vs.loading();

                const url = `${me.$server_url}api/perseo/ventas-lista/anular-agrupacion/${me.totalizado.id}`;

                const payload = {
                    motivo: motivo || 'Anulación por eliminación de todos los pedidos'
                };

                me.$http.post(url, payload)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 'success') {
                        me.$f_notificacion('Totalizado anulado exitosamente', 'success', 'check');
                        me.modoEditarTotalizado = false;
                        me.popupCrearAgrupacion = false;
                        me.totalizado = null;
                        me.pedidosSeleccionados = [];
                        me.cargarPedidosLista();
                        me.getContratosAgrupados();
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al anular totalizado', 'danger', 'alert-triangle');
                    }
                })
                .catch(e => {
                    me.$vs.loading.close();
                    const errorMsg = e.response && e.response.data && e.response.data.message 
                        ? e.response.data.message 
                        : 'Error al anular totalizado';
                    me.$f_notificacion(errorMsg, 'danger', 'alert-circle');
                });
            },

            /**
             * Agregar pedidos a un totalizado existente (DEPRECATED - usar actualizarTotalizado)
             */
            agregarPedidosATotalizado() {
                let me = this;

                if (!me.totalizado || !me.totalizado.id) {
                    me.$f_notificacion('Debe seleccionar un totalizado', 'warning', 'alert-triangle');
                    return;
                }

                if (me.pedidosSeleccionados.length === 0) {
                    me.$f_notificacion('Debe seleccionar al menos un pedido', 'warning', 'alert-triangle');
                    return;
                }

                me.$vs.notify({
                    title: 'Confirmar',
                    text: `¿Desea agregar ${me.pedidosSeleccionados.length} pedido(s) al totalizado "${me.totalizado.ca_descripcion}"?`,
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-help-circle',
                    position: 'top-center',
                    accept: () => {
                        me.ejecutarAgregarPedidos();
                    }
                });
            },

            /**
             * Ejecutar agregar pedidos al totalizado
             */
            ejecutarAgregarPedidos() {
                let me = this;
                me.$vs.loading();

                const url = `${me.$server_url}api/perseo/ventas-lista/editar-agrupacion/${me.totalizado.id}`;

                const pedidosAgrupados = me.pedidosListaCompletos
                    .filter(p => p.ca_codigo_agrupado === me.totalizado.ca_codigo_agrupado)
                    .map(p => p.id_pedido);

                const todosPedidos = [...new Set([...pedidosAgrupados, ...me.pedidosSeleccionados])];

                const payload = {
                    descripcion: me.totalizado.ca_descripcion,
                    pedidos: todosPedidos,
                };

                me.$http.put(url, payload)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 'success') {
                        me.$f_notificacion(`Se agregaron ${me.pedidosSeleccionados.length} pedido(s) al totalizado`, 'success', 'check');
                        me.pedidosSeleccionados = [];
                        me.cargarPedidosLista();
                        me.getContratosAgrupados();
                        me.getLibrosTotalizado(me.totalizado);
                    } else {
                        me.$f_notificacion(res.data.message || 'Error al agregar pedidos', 'danger', 'alert-triangle');
                    }
                })
                .catch(e => {
                    me.$vs.loading.close();
                    console.error('Error al agregar pedidos:', e);
                    me.$f_notificacion('Error al agregar pedidos al totalizado', 'danger', 'alert-circle');
                });
            },

            /**
             * Obtener libros consolidados de todos los contratos del totalizado
             * 🚀 OPTIMIZADO: Una sola llamada HTTP (NO N llamadas)
             */
            async getLibrosTotalizado(totalizado) {
                let me = this;
                const tokenActual = me.tokenCargaTotalizado + 1;
                me.tokenCargaTotalizado = tokenActual;

                me.esCargaTotalizado = true;
                me.textoLoadingLibros = 'Cargando libros del totalizado...';
                me.progresoCargaTotalizadoActual = 0;
                me.progresoCargaTotalizadoTotal = 0;
                me.loadingLibros = true;
                me.librosPedido = [];
                me.librosVendidos = [];
                me.detalleContratosTotalizado = [];
                me.detalleContratoSeleccionado = null;

                if (!totalizado || !totalizado.contratos) {
                    me.loadingLibros = false;
                    me.esCargaTotalizado = false;
                    me.$f_notificacion('No se encontraron contratos en el totalizado', 'warning', 'alert-circle');
                    return;
                }

                const contratos = Array.from(new Set(
                    totalizado.contratos
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c)
                ));
                const periodo = me.periodoSelect.idperiodoescolar;
                const totalContratos = contratos.length;

                if (totalContratos === 0) {
                    me.loadingLibros = false;
                    me.esCargaTotalizado = false;
                    me.$f_notificacion('No hay contratos válidos en el totalizado', 'warning', 'alert-circle');
                    return;
                }

                me.progresoCargaTotalizadoTotal = totalContratos;
                me.textoLoadingLibros = `Cargando libros del totalizado...`;

                try {
                    // 🚀 UNA SOLA LLAMADA al nuevo endpoint que trae todos los libros sin consolidar
                    const res = await me.$http.get(me.$server_url + 'get_libros_multiplesContratos', {
                        params: {
                            contratos: contratos.join(','),
                            periodo: periodo
                        }
                    });

                    if (tokenActual !== me.tokenCargaTotalizado) {
                        return;
                    }

                    if (res.data && res.data.contratos && res.data.libros_por_contrato) {
                        // Consolidar TODOS los libros de TODOS los contratos (sumando cantidades por pro_codigo)
                        const librosConsolidados = {};
                        
                        Object.keys(res.data.libros_por_contrato).forEach(contratoKey => {
                            const librosDelContrato = res.data.libros_por_contrato[contratoKey];
                            librosDelContrato.forEach(libro => {
                                const codigo = libro.pro_codigo;
                                if (librosConsolidados[codigo]) {
                                    librosConsolidados[codigo].cantidad += libro.cantidad;
                                } else {
                                    librosConsolidados[codigo] = {
                                        pro_codigo: libro.pro_codigo,
                                        nombre_libro: libro.nombre_libro,
                                        precio: libro.precio,
                                        descuento: libro.descuento,
                                        cantidad: libro.cantidad,
                                        cantidad_hijos_docentes: 0,
                                        linea_producto_id: libro.linea_producto_id,
                                        codigos_combos_regalado: libro.codigos_combos_regalado || null,
                                        codigos_combos: libro.codigos_combos || null,
                                        grupo_codigo_para_v3: libro.grupo_codigo_para_v3 || null
                                    };
                                }
                            });
                        });

                        me.librosPedido = Object.values(librosConsolidados);

                        // Crear un objeto por cada contrato con sus libros (sin consolidar)
                        me.detalleContratosTotalizado = res.data.contratos.map(contrato => ({
                            ...contrato,
                            libros: res.data.libros_por_contrato[contrato.contrato_generado] || []
                        }));
                        
                        me.detalleContratoSeleccionado = me.detalleContratosTotalizado[0] || null;

                        // Cargar hijos docentes y ventas
                        await me.obtenerDetalleHijosDocentesPorContratos(contratos, periodo);
                        await me.getLibrosVendidosTotalizado(totalizado.ca_codigo_agrupado, periodo, tokenActual);
                        // NO llamar getDevoluciones() - ya se cargaron con getDatosConsolidados()

                        if (tokenActual !== me.tokenCargaTotalizado) {
                            return;
                        }

                        me.textoLoadingLibros = `Cargados ${me.librosPedido.length} libros`;
                        me.loadingLibros = false;
                        me.esCargaTotalizado = false;

                        me.$f_notificacion(
                            `Cargados ${me.librosPedido.length} libros de ${totalContratos} contratos`,
                            'success',
                            'check',
                            3000
                        );
                    } else {
                        me.loadingLibros = false;
                        me.esCargaTotalizado = false;
                        me.librosPedido = [];
                        me.$f_notificacion('Error al cargar libros del totalizado', 'danger', 'alert-circle');
                    }

                } catch (error) {
                    if (tokenActual !== me.tokenCargaTotalizado) {
                        return;
                    }
                    me.loadingLibros = false;
                    me.esCargaTotalizado = false;
                    me.librosPedido = [];
                    console.error('Error al cargar libros del totalizado:', error);
                    me.$f_notificacion('Error al cargar libros del totalizado', 'danger', 'alert-circle');
                }
            },

            cancelarCargaTotalizado(notificar) {
                let me = this;
                me.tokenCargaTotalizado = me.tokenCargaTotalizado + 1;
                me.loadingLibros = false;
                me.loadingVendidos = false;
                me.esCargaTotalizado = false;
                me.textoLoadingLibros = 'Cargando libros...';
                me.progresoCargaTotalizadoActual = 0;
                me.progresoCargaTotalizadoTotal = 0;
                me.librosPedido = [];
                me.librosVendidos = [];
                me.detalleContratosTotalizado = [];
                me.detalleContratoSeleccionado = null;
                me.detalleHijosDocentesPorLibro = [];
                me.popupDetalleContratosTotalizado = false;

                if (notificar) {
                    me.$f_notificacion('Carga cancelada', 'warning', 'alert-triangle', 2500);
                }
            },

            abrirPopupDetalleContratos() {
                let me = this;
                if (!me.detalleContratosTotalizado || me.detalleContratosTotalizado.length === 0) {
                    me.$f_notificacion('Aún no hay detalle cargado por contrato', 'warning', 'alert-circle', 2500);
                    return;
                }
                me.detalleContratoSeleccionado = me.detalleContratosTotalizado[0];
                me.popupDetalleContratosTotalizado = true;
            },

            obtenerInstitucionContrato(contrato) {
                let me = this;
                const pedido = me.pedidosListaCompletos.find(item => item.contrato_generado === contrato);
                if (pedido && pedido.nombreInstitucion) {
                    return pedido.nombreInstitucion;
                }
                return 'Institución no encontrada';
            },

            consolidarLibrosContrato(libros) {
                const consolidados = {};

                libros.forEach(item => {
                    const codigo = item.pro_codigo;
                    const cantidad = parseInt(item.cantidad) || 0;

                    if (consolidados[codigo]) {
                        consolidados[codigo].cantidad += cantidad;
                    } else {
                        consolidados[codigo] = {
                            pro_codigo: item.pro_codigo,
                            nombre_libro: item.nombre_libro,
                            cantidad: cantidad,
                            cantidad_hijos_docentes: 0,
                            precio: parseFloat(item.precio) || 0,
                            descuento: parseFloat(item.descuento) || 0,
                            linea_producto_id: item && item.linea_producto_id != null ? parseInt(item.linea_producto_id, 10) : 0,
                            codigos_combos_regalado: item && item.codigos_combos_regalado != null ? item.codigos_combos_regalado : null,
                            codigos_combos: item && item.codigos_combos != null ? item.codigos_combos : null,
                            grupo_codigo_para_v3: item && item.grupo_codigo_para_v3 != null ? item.grupo_codigo_para_v3 : null
                        };
                    }
                });

                return Object.values(consolidados);
            },

            /**
             * Obtener libros vendidos del totalizado completo
             */
            async getLibrosVendidosTotalizado(codigoTotalizado, periodo, tokenActual) {
                let me = this;
                me.loadingVendidos = true;

                try {
                    const url = `${me.$server_url}get_libros_vendidos_por_totalizado?totalizado=${codigoTotalizado}&periodo=${periodo}`;
                    const res = await me.$http.get(url);

                    if (tokenActual !== me.tokenCargaTotalizado) {
                        return;
                    }

                    me.loadingVendidos = false;

                    if (res.data.status === 200) {
                        const datosVendidos = Array.isArray(res.data.data) ? res.data.data : [];
                        me.librosVendidos = datosVendidos.map(function(item) {
                            return {
                                ...item,
                                es_obsequio: parseInt(item.es_obsequio, 10) === 0 ? 0 : 1,
                                detalleVenta: `${item.ven_codigo} cant:${item.cantidad_vendida}`
                            };
                        });
                    } else {
                        me.librosVendidos = [];
                    }
                } catch (e) {
                    if (tokenActual !== me.tokenCargaTotalizado) {
                        return;
                    }
                    me.loadingVendidos = false;
                    console.error('Error al cargar ventas del totalizado:', e);
                    me.librosVendidos = [];
                }
            },

            // Método auxiliar para formatear fechas en formato corto (YYYY-MM-DD)
            fechaCorta(fecha) {
                if (!fecha) return '—';
                try {
                    // Si es un timestamp o fecha completa, extraer solo la fecha
                    const fechaStr = String(fecha);
                    if (fechaStr.includes(' ')) {
                        return fechaStr.split(' ')[0];
                    }
                    if (fechaStr.includes('T')) {
                        return fechaStr.split('T')[0];
                    }
                    return fechaStr;
                } catch (e) {
                    return fecha;
                }
            },

            // Método para calcular la cantidad pendiente de NC de un documento
            cantidadPendienteDoc(documento) {
                const cantidadTotal = parseFloat(documento.cantidad_devolucion || 0);
                const cantidadEnviada = parseFloat(documento.cantidad_nc_enviada_total || 0);
                return Math.max(0, cantidadTotal - cantidadEnviada);
            }
        }
    }
    </script>

    <style>
    .fixed-column {
        position: sticky;
        left: 0;
        background-color: white;
    }

    .fixed-column2 {
        position: sticky;
        top: 0;
        background-color: white;
    }

    .popup-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        /* Espacio interno alrededor de los botones */
        background-color: #f0f0f0;
        /* Color de fondo del footer */
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
        /* Sombra en la parte inferior */
    }

    /* Estilos para el header agrupado de CONTRATO */
    .header-contrato {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .contrato-label {
        background-color: #f8f9fa;
        color: #495057;
        font-weight: bold;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 3px;
        margin-bottom: 5%;
        border: 1px solid #dee2e6;
        width: 100%;
        text-align: center;
    }

    /* Estilos para el header agrupado de PROFORMA */
    .header-proforma {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .proforma-label {
        background-color: #e7f3ff;
        color: #0066cc;
        font-weight: bold;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 3px;
        margin-bottom: 5%;
        border: 1px solid #99ccff;
        width: 100%;
        text-align: center;
    }

    /* Estilos para el header agrupado de VENTAS */
    .header-venta {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .venta-label {
        background-color: #fff4e6;
        color: #d97706;
        font-weight: bold;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 3px;
        margin-bottom: 5%;
        border: 1px solid #fbbf24;
        width: 100%;
        text-align: center;
    }

    .vs-table thead .vs-table--th {
        padding: 4px 4px !important;
        text-align: center !important;
        font-size: 11px !important;
    }

    .vs-table .vs-table--td {
        padding: 2px 4px !important;
        font-size: 12px !important;
    }

    /* Estilos para detalles de proforma con múltiples descuentos */
    .detalle-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 6px 0;
    }

    /* Solo mostrar borde cuando hay múltiples filas */
    .detalle-row:not(:last-child) {
        border-bottom: 1px dashed #e2e8f0;
    }

    .total-row {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 2px solid #4a5568;
        text-align: center;
        background-color: #f7fafc;
    }

    .descuento-badge {
        background-color: #fef3c7;
        color: #92400e;
        font-size: 11px;
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 4px;
        display: inline-block;
    }

    .descuento-badge-small {
        background-color: #fed7aa;
        color: #9a3412;
        font-size: 9px;
        font-weight: 600;
        padding: 2px 5px;
        border-radius: 3px;
        display: inline-block;
        margin-left: 4px;
    }

    .cantidad-badge {
        background-color: #d1fae5;
        color: #065f46;
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 4px;
        display: inline-block;
    }

    .cantidad-total {
        background-color: #dbeafe;
        color: #1e40af;
        font-size: 13px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 4px;
        display: inline-block;
    }

    .cantidad-cero,
    .descuento-cero {
        color: #9ca3af;
        font-size: 12px;
        font-weight: 500;
    }

    .variados-label {
        color: #64748b;
        font-size: 11px;
        font-weight: 600;
        font-style: italic;
    }

    .monto-detalle {
        font-size: 13px;
        font-weight: 600;
        color: #7c3aed;
    }

    .monto-detalle.monto-success {
        color: #059669;
    }

    .monto-total {
        font-size: 15px;
        font-weight: 700;
        color: #5b21b6;
    }

    .monto-total.monto-total-success {
        color: #047857;
        font-size: 16px;
    }

    /* Estilos específicos para VENTAS */
    .cantidad-badge-venta {
        background-color: #ffedd5;
        color: #9a3412;
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 4px;
        display: inline-block;
    }

    .cantidad-badge-totalizados {
        background-color: #f2d5ff;
        color: #3215d4;
        font-size: 20px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 4px;
        display: inline-block;
    }

    .cantidad-badge-obsequios {
        background-color: #d5e7ff;
        color: #12329a;
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 4px;
        display: inline-block;
    }

    .cantidad-total-venta {
        background-color: #fed7aa;
        color: #9a3412;
        font-size: 13px;
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 4px;
        display: inline-block;
    }

    .monto-detalle.monto-venta {
        color: #d97706;
    }

    .monto-detalle.monto-success-venta {
        color: #dc2626;
    }

    .monto-total.monto-total-venta {
        color: #ea580c;
    }

    .monto-total.monto-total-success-venta {
        color: #dc2626;
        font-size: 16px;
    }

    .vs-td > div {
        min-height: 24px;
    }

    /* Spinner personalizado */
    .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner {
        width: 60px;
        height: 60px;
        border: 6px solid #f3f3f3;
        border-top: 6px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Z-index para popup de lista de proformas */
    .popup-lista-proformas {
        z-index: 51005 !important;
    }

    /* Badge para libros extras */
    .libro-extra-badge {
        background-color: #d5e7ff;
        color: #12329a;
        font-size: 9px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        display: inline-block;
        border: 1px solid #12329a;
        animation: pulse-extra 5s ease-in-out infinite;
        white-space: nowrap;
    }

    .libro-extra-badge i {
        font-size: 8px;
        margin-right: 2px;
    }

    @keyframes pulse-extra {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(0.98);
        }
    }

    /* Utilidades de flex para alinear items */
    .flex {
        display: flex;
    }

    .items-center {
        align-items: center;
    }

    .justify-center {
        justify-content: center;
    }

    .gap-2 {
        gap: 0.5rem;
    }

    /* ===== HEADER PENDIENTE ===== */
    .header-pendiente {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .pendiente-label {
        background-color: #fef3c7;
        color: #92400e;
        font-weight: bold;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 3px;
        margin-bottom: 5%;
        border: 1px solid #f59e0b;
        width: 100%;
        text-align: center;
    }

    /* ===== BARRA DE TOTALES COMPACTA ===== */
    .totales-barra {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 6px 12px;
    }

    .totales-barra-inner {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tb-seccion {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .tb-tag {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 3px;
        letter-spacing: 0.3px;
        white-space: nowrap;
    }

    .tb-tag-contrato {
        background: #f1f3f5;
        color: #495057;
        border: 1px solid #ced4da;
    }

    .tb-tag-venta {
        background: #fff4e6;
        color: #d97706;
        border: 1px solid #fbbf24;
    }

    .tb-tag-pendiente {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #f59e0b;
    }

    .tb-dato {
        font-size: 11px;
        color: #64748b;
        white-space: nowrap;
    }

    .tb-dato b {
        color: #334155;
        font-weight: 700;
    }

    .tb-dato-total b {
        color: #1e293b;
        font-size: 12px;
    }

    .tb-divisor {
        width: 1px;
        height: 20px;
        background: #cbd5e1;
        margin: 0 4px;
    }

    /* ===== FILA DE TOTALES EN LA TABLA ===== */
    .totales-fila-container {
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        padding: 12px 8px;
        border-top: 3px solid #475569;
    }

    .totales-tabla {
        width: 100%;
        border-collapse: collapse;
    }

    .totales-row .totales-cell {
        padding: 8px 6px;
        text-align: center;
        vertical-align: middle;
    }

    .con-vs-dialog {
        z-index: 60000 !important;
    }

    .fila-seleccionada-totalizado {
        background-color: #e7f7ee !important;
    }

    .filtros-totalizado {
        border: 1px solid #dbeafe;
        background: #f8fbff;
        border-radius: 8px;
        padding: 12px;
    }

    .filtros-totalizado--secondary {
        border-color: #d1fae5;
        background: #f7fffb;
    }

    .filtros-totalizado__inputs {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 10px;
        margin-bottom: 10px;
    }

    .filtros-totalizado__meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
    }

    .filtros-totalizado__acciones {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .filtros-totalizado__resumen {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .resumen-pill {
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        border: 1px solid transparent;
    }

    .resumen-pill--base {
        background: #eff6ff;
        color: #1d4ed8;
        border-color: #bfdbfe;
    }

    .resumen-pill--selected {
        background: #ecfdf5;
        color: #047857;
        border-color: #a7f3d0;
    }

    .resumen-pill--total {
        background: #fff7ed;
        color: #c2410c;
        border-color: #fed7aa;
    }

    @media (max-width: 768px) {
        .filtros-totalizado__inputs {
            grid-template-columns: 1fr;
        }

        .filtros-totalizado__acciones {
            width: 100%;
        }
    }

    .totales-label-cell {
        text-align: left !important;
        font-size: 15px;
        color: #1e293b;
        letter-spacing: 0.5px;
    }

    .select-busqueda-ventas .vs__dropdown-option:hover,
    .select-busqueda-ventas .vs__dropdown-option--highlight,
    .select-busqueda-totalizados .vs__dropdown-option:hover,
    .select-busqueda-totalizados .vs__dropdown-option--highlight {
        background: #eef2f6 !important;
        color: #334155 !important;
    }

    .select-busqueda-ventas .vs__dropdown-option:hover *,
    .select-busqueda-ventas .vs__dropdown-option--highlight *,
    .select-busqueda-totalizados .vs__dropdown-option:hover *,
    .select-busqueda-totalizados .vs__dropdown-option--highlight * {
        color: #334155 !important;
    }

    .select-busqueda-ventas .vs__dropdown-option--selected,
    .select-busqueda-ventas .vs__dropdown-option--selected.vs__dropdown-option--highlight,
    .select-busqueda-totalizados .vs__dropdown-option--selected,
    .select-busqueda-totalizados .vs__dropdown-option--selected.vs__dropdown-option--highlight {
        background: #dde5ee !important;
        color: #0f172a !important;
        box-shadow: inset 3px 0 0 #64748b;
    }

    .select-busqueda-ventas .vs__dropdown-option--selected *,
    .select-busqueda-ventas .vs__dropdown-option--selected.vs__dropdown-option--highlight *,
    .select-busqueda-totalizados .vs__dropdown-option--selected *,
    .select-busqueda-totalizados .vs__dropdown-option--selected.vs__dropdown-option--highlight * {
        color: #0f172a !important;
    }

    .ventas-totalizado-lista {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        border: 1px solid #dbeafe;
        background: #f8fbff;
        border-radius: 8px;
        padding: 8px;
        max-height: 120px;
        overflow-y: auto;
    }

    .venta-totalizado-chip {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        color: #1d4ed8;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 999px;
        padding: 3px 8px;
        white-space: nowrap;
    }

    /* ===== SKELETON LOADERS ===== */
    .skeleton-loader-container {
        padding: 16px 0;
    }

    .skeleton-container {
        padding: 16px;
    }

    .skeleton-header {
        height: 32px;
        width: 200px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    .skeleton-line {
        height: 20px;
        width: 100%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    .skeleton-line-short {
        height: 20px;
        width: 60%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    .skeleton-title {
        height: 24px;
        width: 150px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
        margin-bottom: 12px;
    }

    .skeleton-select {
        height: 42px;
        width: 100%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    .skeleton-button {
        height: 38px;
        width: 200px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
    }

    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    /* Animación para el icono de carga */
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    </style>
