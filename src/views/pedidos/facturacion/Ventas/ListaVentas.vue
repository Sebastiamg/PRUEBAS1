<template>
    <div class="lista-ventas-container">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <h3 class="text-xl font-bold">{{ totalizado ? 'Documentos de Venta del Totalizado' : 'Documentos de Venta del Contrato' }}</h3>
                <p class="text-sm text-gray-600">{{ contratoSeleccionado }}</p>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="loading-spinner mb-4">
                <div class="spinner"></div>
            </div>
            <p class="text-gray-600 text-lg">Cargando documentos de venta...</p>
        </div>

        <!-- Tabla de ventas -->
        <vs-table v-else-if="ventas.length > 0" search :data="ventas" :max-items="10" pagination stripe>
            <template slot="header">
                <span class="chip chip-primary">{{ ventas.length }} documentos encontrados</span>
            </template>

            <template slot="thead">
                <vs-th sort-key="ven_codigo" width="250">Código</vs-th>
                <vs-th>Información</vs-th>
                <vs-th>Detalles</vs-th>
                <vs-th width="150">Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="venta" :key="index" v-for="(venta, index) in data">
                    <vs-td justify="center" align="center">
                        <div class="font-mono font-bold text-primary">
                            {{ venta.ven_codigo }}
                        </div>
                        <div v-if="venta.empresa_logo" class="mt-2">
                            <img :src="venta.empresa_logo" class="w-24 h-8 object-contain" />
                        </div><br>
                        <div v-if="venta.ven_p_libros_obsequios">
                            <span class="chip chip-warning">
                                Libros Obsequio
                            </span>
                        </div>
                        <div class="mt-2">
                            <span :class="['chip', 'chip-' + getTipoDocumentoColor(venta.idtipodoc)]">
                                {{ venta.tdo_nombre || 'Documento' }}
                            </span>
                        </div>
                    </vs-td>

                    <vs-td>
                        <div style="max-width: 350px;">
                            <!-- Empresa -->
                            <div class="flex items-center mb-2">
                                <span class="font-semibold text-sm">{{ venta.empresa_nombre }}</span>
                            </div>
                            
                            <!-- Cliente -->
                            <div class="mb-2">
                                <p class="text-xs text-gray-500 font-semibold">Cliente:</p>
                                <p class="font-semibold text-sm">{{ venta.cliente_nombre || 'Sin cliente' }}</p>
                                <p class="text-xs text-gray-500">
                                    <span v-if="venta.cliente_ruc" class="font-mono">RUC: {{ venta.cliente_ruc }}</span>
                                    <span v-else>Sin RUC</span>
                                </p>
                                <p v-if="venta.cliente_email" class="text-xs text-blue-500">{{ venta.cliente_email }}</p>
                            </div>
                            
                            <!-- Institución -->
                            <div>
                                <p class="text-xs text-gray-500 font-semibold">Institución:</p>
                                <p class="font-semibold text-sm">{{ venta.institucion_nombre || 'Sin institución' }}</p>
                                <p class="text-xs text-gray-500">
                                    <span v-if="venta.institucion_ruc" class="font-mono">RUC: {{ venta.institucion_ruc }}</span>
                                    <span v-else>Sin RUC</span>
                                </p>
                                <p v-if="venta.institucion_direccion" class="text-xs text-blue-500">{{ venta.institucion_direccion }}</p>
                            </div>

                            <!-- Proforma Origen -->
                            <div v-if="venta.prof_id" class="mt-2">
                                <p class="text-xs text-gray-500 font-semibold">Proforma:</p>
                                <p class="text-xs font-mono text-purple-600">{{ venta.prof_id }}</p>
                            </div>
                        </div>
                    </vs-td>

                    <vs-td>
                        <div style="max-width: 280px;">
                            <!-- Items y Cantidades -->
                            <div class="mb-2 flex gap-2 items-center">
                                <div class="item-badge">
                                    <i class="fas fa-box"></i>
                                    <span>{{ venta.total_items }} ítems</span>
                                </div>
                                <div class="item-badge">
                                    <i class="fas fa-books"></i>
                                    <span>{{ venta.total_cantidad }} libros</span>
                                </div>
                            </div>
                            
                            <!-- Subtotal y Total -->
                            <div class="mb-3 p-2 bg-success-light rounded" style="border: 1px solid #28C76F;">
                                <div class="mb-1">
                                    <span class="text-xs text-gray-600">Subtotal:</span>
                                    <span class="font-bold text-dark ml-2">${{ parseFloat(venta.ven_subtotal || 0).toFixed(2) }}</span>
                                </div>
                                <div class="mb-2">
                                    <span class="text-xs text-gray-600">Total:</span>
                                    <span class="font-bold text-success text-lg ml-2">${{ parseFloat(venta.ven_valor || 0).toFixed(2) }}</span>
                                </div>
                                <div v-if="venta.ven_desc_por && parseFloat(venta.ven_desc_por) > 0" class="mt-2 pt-2" style="border-top: 1px solid rgba(40,199,111,0.2);">
                                    <div class="flex items-center gap-2 mb-1">
                                        <!-- <div class="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                                class="bg-warning h-2 rounded-full transition-all"
                                                :style="{width: parseFloat(venta.ven_desc_por) + '%'}"
                                            ></div>
                                        </div> -->
                                    <p class="text-xs text-gray-500">Descuento</p>
                                        <span class="text-xs font-bold text-warning">{{ parseFloat(venta.ven_desc_por || 0).toFixed(0) }}%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Estado -->
                            <div class="mb-3">
                                <p class="text-xs text-gray-500 font-semibold mb-1">Estado:</p>
                                <span :class="['chip', 'chip-' + getEstadoColor(venta.est_ven_codigo)]">
                                    {{ getEstadoTexto(venta.est_ven_codigo) }}
                                </span>
                            </div>
                            
                            <!-- Fecha y Usuario -->
                            <div class="info-compacta">
                                <p class="text-xs text-gray-500 mb-1">
                                    <i class="far fa-calendar text-primary mr-1"></i>
                                    {{ formatFecha(venta.ven_fecha) }}
                                </p>
                                <p class="text-xs text-gray-500">
                                    <i class="far fa-user text-primary mr-1"></i>
                                    {{ venta.creado_por }}
                                </p>
                            </div>
                        </div>
                    </vs-td>

                    <vs-td>
                        <div class="acciones-container">
                            <!-- Pedido Perseo -->
                            <div v-if="venta.pedido_codigo" class="perseo-info">
                                <span class="perseo-label">Pedido:</span>
                                <span class="perseo-code">{{ venta.pedido_codigo }}</span>
                                <span 
                                    v-if="venta.estadoPerseo === 1 && venta.est_ven_codigo !== 3" 
                                    class="status-badge success"
                                >
                                    Activo
                                </span>
                                <span 
                                    v-if="venta.estadoPerseo === 1 && venta.est_ven_codigo === 3" 
                                    class="status-badge danger"
                                >
                                    No válido
                                </span>
                            </div>
                            
                            <!-- Anulado por -->
                            <div v-if="venta.est_ven_codigo === 3 && venta.anulado_por" class="anulado-box">
                                <div class="anulado-box__meta">
                                    <span class="anulado-box__usuario text-danger">
                                        <i class="fas fa-ban"></i>
                                        {{ venta.anulado_por }}
                                    </span>
                                    <span class="anulado-box__fecha text-muted">{{ formatFecha(venta.fecha_anulacion) }}</span>
                                </div>
                                <vs-button 
                                    v-if="venta.observacionAnulacion" 
                                    color="danger" 
                                    size="small" 
                                    type="border"
                                    class="btn-ver-motivo"
                                    @click="mostrarObservacionAnulacion(venta.observacionAnulacion)">
                                    <i class="fas fa-eye"></i> Ver motivo
                                </vs-button>
                            </div>
                            
                            <!-- Botones -->
                            <vs-button 
                                color="primary" 
                                size="small" 
                                type="border"
                                @click="verPDF(venta)"
                            >
                                <i class="far fa-file-pdf"></i> Ver PDF
                            </vs-button>
                            
                            <vs-button 
                                v-if="puedeMostrarBotonEditar(venta)"
                                color="warning" 
                                size="small" 
                                type="border"
                                @click="editarVenta(venta)"
                            >
                                <i class="far fa-edit"></i> Editar
                            </vs-button>
                            
                            <vs-button 
                                v-if="puedeMostrarBotonAnular(venta)"
                                color="danger" 
                                size="small" 
                                type="border"
                                @click="verDetalle(venta)"
                            >
                                <i class="fas fa-ban"></i> Anular
                            </vs-button>

                            <vs-button v-if="puedeMostrarBotonAnularObsequios(venta)" 
                                color="danger" 
                                size="small" 
                                type="border"
                                @click="AnularObsequios(venta)"
                            >
                                <i class="fas fa-gift"></i> Anular Obsequios
                            </vs-button>

                            <vs-button 
                                v-if="(venta.est_ven_codigo === 2 && venta.estadoPerseo !== 1 && (venta.idtipodoc == 1 || venta.idtipodoc == 2)) || userRoot"
                                color="warning" 
                                size="small" 
                                type="filled"
                                @click="enviarAPerseo(venta)"
                            >
                                <i class="fas fa-share"></i> Enviar a Perseo
                            </vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <!-- Sin ventas -->
        <div v-else-if="!loading" class="bg-orange-50 p-8 rounded text-center">
            <i class="fas fa-file-invoice text-4xl text-orange-400 mb-4"></i>
            <h4 class="text-orange-600 font-bold mb-2">No hay documentos de venta para este contrato</h4>
            <p class="text-orange-500">Aún no se han generado documentos de venta para este contrato</p>
        </div>

        <!-- Popup para PDF -->
        <vs-popup-history
            v-if="popupPDF" 
            fullscreen 
            class="popup-pdf-hijo" 
            :title="`Documento ${ventaSeleccionada.ven_codigo || ''}`" 
            :active.sync="popupPDF"
        >
            <ReporteVentasPDF 
                v-if="ventaSeleccionada" 
                :venta="ventaSeleccionada"
            />
        </vs-popup-history>

        <!-- Popup Anular Venta de Obsequios -->
        <vs-popup
            class="popup-anular-venta"
            title=""
            :active.sync="popupAnularObsequios"
        >
            <div class="anular-content">
                <div class="anular-header">
                    <div class="icon-container">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3 class="anular-title">Anular Venta de Obsequios</h3>
                </div>

                <div class="documento-info" v-if="ventaSeleccionada">
                    <div class="info-item">
                        <span class="label">Código:</span>
                        <span class="value">{{ ventaSeleccionada.ven_codigo }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Total:</span>
                        <span class="value total">${{ parseFloat(ventaSeleccionada.ven_valor || 0).toFixed(2) }}</span>
                    </div>
                </div>

                <div class="anular-warning">
                    <i class="fas fa-info-circle"></i>
                    <p>Esta acción anulará la venta y <strong>revertirá las cantidades</strong> en el pedido de obsequios (disminuye aprobadas, aumenta pendientes).</p>
                </div>

                <div class="comentario-section">
                    <label class="comentario-label">
                        <i class="fas fa-comment-alt"></i>
                        Motivo de Anulación (Obligatorio)
                    </label>
                    <textarea
                        v-model="observacionAnularObsequios"
                        class="comentario-textarea"
                        placeholder="Describa el motivo por el cual está anulando esta venta de obsequios..."
                        rows="4"
                    ></textarea>
                </div>

                <div class="anular-actions">
                    <vs-button
                        @click="confirmarAnularObsequios"
                        color="danger"
                        type="filled"
                        class="btn-anular"
                    >
                        <i class="fas fa-ban mr-2"></i>
                        Confirmar Anulación
                    </vs-button>
                    <vs-button
                        @click="popupAnularObsequios = false"
                        color="dark"
                        type="border"
                        class="btn-cancelar"
                    >
                        <i class="fas fa-times mr-2"></i>
                        Cancelar
                    </vs-button>
                </div>
            </div>
        </vs-popup>

        <!-- Popup Anular Venta -->
        <vs-popup 
            class="popup-anular-venta" 
            title="" 
            :active.sync="popupAnular"
        >
            <div class="anular-content">
                <!-- Header -->
                <div class="anular-header">
                    <div class="icon-container">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 class="anular-title">Anular Documento de Venta</h3>
                </div>
                
                <!-- Info del documento -->
                <div class="documento-info" v-if="ventaSeleccionada">
                    <div class="info-item">
                        <span class="label">Código:</span>
                        <span class="value">{{ ventaSeleccionada.ven_codigo }}</span>
                    </div>
                    <div class="info-item" v-if="ventaSeleccionada.pedido_codigo">
                        <span class="label">Pedido Perseo:</span>
                        <span class="value pedido-code">{{ ventaSeleccionada.pedido_codigo }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Total:</span>
                        <span class="value total">${{ parseFloat(ventaSeleccionada.ven_valor || 0).toFixed(2) }}</span>
                    </div>
                </div>
                
                <!-- Advertencia -->
                <div class="anular-warning">
                    <i class="fas fa-info-circle"></i>
                    <p>Esta acción cambiará el estado del documento a <strong>Anulado</strong>. 
                    <span v-if="ventaSeleccionada && ventaSeleccionada.estadoPerseo === 1">
                        El pedido de Perseo quedará marcado como <strong>no válido</strong>.
                    </span>
                    </p>
                </div>
                
                <!-- Campo comentario -->
                <div class="comentario-section">
                    <label class="comentario-label">
                        <i class="fas fa-comment-alt"></i>
                        Motivo de Anulación (Obligatorio)
                    </label>
                    <textarea 
                        v-model="observacionAnulacion" 
                        class="comentario-textarea"
                        placeholder="Describa el motivo por el cual está anulando este documento..."
                        rows="4"
                    ></textarea>
                </div>
                
                <!-- Botones -->
                <div class="anular-actions">
                    <vs-button 
                        @click="confirmarAnular" 
                        color="danger"
                        type="filled"
                        class="btn-anular"
                    >
                        <i class="fas fa-ban mr-2"></i>
                        Confirmar Anulación
                    </vs-button>
                    <vs-button 
                        @click="popupAnular = false" 
                        color="dark"
                        type="border"
                        class="btn-cancelar"
                    >
                        <i class="fas fa-times mr-2"></i>
                        Cancelar
                    </vs-button>
                </div>
            </div>
        </vs-popup>

        <!-- Popup Ver Motivo de Anulación -->
        <vs-popup
            class="popup-motivo-anulacion"
            title=""
            :active.sync="popupMotivoAnulacion"
        >
            <div class="motivo-content">
                <div class="motivo-header">
                    <div class="motivo-icon">
                        <i class="fas fa-comment-dots"></i>
                    </div>
                    <h3 class="motivo-title">Motivo de Anulación</h3>
                </div>

                <div class="motivo-body">
                    <p class="motivo-texto">{{ observacionAnulacionSeleccionada }}</p>
                </div>

                <div class="motivo-actions">
                    <vs-button
                        @click="popupMotivoAnulacion = false"
                        color="danger"
                        type="filled"
                    >
                        <i class="fas fa-times mr-2"></i> Cerrar
                    </vs-button>
                </div>
            </div>
        </vs-popup>

        <!-- Modal Editar Venta PERSEO -->
        <VentaEditarModalPerseo 
            :visible.sync="popupEditar"
            :ventaId="ventaEditarId"
            :pedidoSeleccionado="pedidoData"
            :librosPedido="librosPedido"
            :periodo-select="periodoSelect ? periodoSelect : {}"
            @cerrar="cerrarEdicion"
            @venta-actualizada="handleVentaActualizada"
        />

        <!-- Modal Verificación de Productos Perseo -->
        <vs-popup :active.sync="mostrandoPopupProductos" title="Verificación de Productos en Perseo">
            <div v-if="ventaEnvioPerseo" class="verificacion-contexto">
                <div class="verificacion-contexto__item">
                    <span class="verificacion-contexto__label">Documento:</span>
                    <span class="verificacion-contexto__value">{{ ventaEnvioPerseo.ven_codigo ? ventaEnvioPerseo.ven_codigo : 'N/A' }}</span>
                </div>
                <div class="verificacion-contexto__item">
                    <span class="verificacion-contexto__label">Empresa:</span>
                    <span class="verificacion-contexto__value">
                        {{ ventaEnvioPerseo.empresa_nombre ? ventaEnvioPerseo.empresa_nombre : 'N/A' }}
                        (ID: {{ ventaEnvioPerseo.id_empresa ? ventaEnvioPerseo.id_empresa : 'N/A' }})
                    </span>
                </div>
            </div>
            <div v-if="enviandoProgreso" class="verificacion-body">
                <div class="verificacion-loading">
                    <div class="verificacion-spinner"></div>
                    <h4>Verificando productos en Perseo...</h4>
                    <p class="text-sm" style="color: #6b7280;">Por favor espere mientras verificamos los {{ productosFaltantes.length }} productos faltantes</p>
                </div>
                <div class="verificacion-lista">
                    <div 
                        v-for="item in progresoActualizacion" 
                        :key="item.codigo" 
                        class="verificacion-item"
                        :class="{
                            'verificacion-item--ok': item.estado === 'Actualizado',
                            'verificacion-item--error': item.estado === 'Error',
                            'verificacion-item--loading': item.estado === 'Actualizando',
                            'verificacion-item--neutral': item.estado === 'Sin cambios',
                            'verificacion-item--pending': item.estado === 'Pendiente'
                        }"
                    >
                        <div class="verificacion-item__info">
                            <i v-if="item.estado === 'Actualizado'" class="fas fa-check-circle" style="color: #28C76F;"></i>
                            <i v-else-if="item.estado === 'Error'" class="fas fa-times-circle" style="color: #EA5455;"></i>
                            <i v-else-if="item.estado === 'Actualizando'" class="fas fa-spinner fa-spin" style="color: #046AE7;"></i>
                            <i v-else-if="item.estado === 'Sin cambios'" class="fas fa-minus-circle" style="color: #6b7280;"></i>
                            <i v-else class="fas fa-clock" style="color: #FF9F43;"></i>
                            <div>
                                <span class="font-semibold">{{ item.codigo }}</span>
                                <div v-if="item.mensaje" class="text-xs" style="color: #6b7280;">{{ item.mensaje }}</div>
                            </div>
                        </div>
                        <vs-chip :color="getEstadoColorProducto(item.estado)" size="small">{{ item.estado }}</vs-chip>
                    </div>
                </div>
            </div>

            <div v-if="!enviandoProgreso && progresoActualizacion.length > 0" class="verificacion-body">
                <h4 class="mb-4 font-bold">Verificación completada</h4>

                <div 
                    class="verificacion-alerta"
                    :class="{
                        'verificacion-alerta--ok': progresoActualizacion.every(function(p){ return p.estado === 'Actualizado' || p.estado === 'Sin cambios'; }),
                        'verificacion-alerta--warning': productosNoEncontradosEnPerseo.length > 0,
                        'verificacion-alerta--error': productosNoEncontradosEnPerseo.length === 0 && progresoActualizacion.some(function(p){ return p.estado === 'Error'; })
                    }"
                >
                    <div v-if="progresoActualizacion.every(function(p){ return p.estado === 'Actualizado' || p.estado === 'Sin cambios'; })" class="text-center">
                        <i class="fas fa-check-circle" style="font-size: 28px; color: #28C76F; margin-bottom: 8px;"></i>
                        <h4 style="color: #065f46; font-weight: 600;">Todos los productos están listos</h4>
                        <p class="text-sm" style="color: #047857;">Ahora puedes enviar el pedido a Perseo</p>
                    </div>
                    <div v-else-if="productosNoEncontradosEnPerseo.length > 0" class="text-center">
                        <i class="fas fa-exclamation-triangle" style="font-size: 28px; color: #FF9F43; margin-bottom: 8px;"></i>
                        <h4 style="color: #9a3412; font-weight: 600;">Productos NO registrados en PERSEO</h4>
                        <p class="text-sm" style="color: #c2410c; margin-bottom: 8px;">
                            {{ productosNoEncontradosEnPerseo.length }} {{ productosNoEncontradosEnPerseo.length === 1 ? 'producto no se encuentra' : 'productos no se encuentran' }} registrados en PERSEO
                        </p>
                        <p class="text-sm font-semibold" style="color: #c2410c;">Comunícate con el personal de <strong>Contabilidad</strong> para registrar {{ productosNoEncontradosEnPerseo.length === 1 ? 'este producto' : 'estos productos' }}</p>
                    </div>
                    <div v-else class="text-center">
                        <i class="fas fa-exclamation-triangle" style="font-size: 28px; color: #EA5455; margin-bottom: 8px;"></i>
                        <h4 style="color: #991b1b; font-weight: 600;">Errores técnicos encontrados</h4>
                        <p class="text-sm" style="color: #b91c1c;">Comunícate con el equipo de <strong>Soporte</strong> para resolver estos problemas</p>
                    </div>
                </div>

                <div class="verificacion-resumen">
                    <div class="verificacion-resumen__item verificacion-resumen__item--ok">
                        <span class="verificacion-resumen__valor">{{ progresoActualizacion.filter(function(p){ return p.estado === 'Actualizado' || p.estado === 'Sin cambios'; }).length }}</span>
                        <span class="verificacion-resumen__label">Exitosos</span>
                    </div>
                    <div class="verificacion-resumen__item verificacion-resumen__item--error">
                        <span class="verificacion-resumen__valor">{{ progresoActualizacion.filter(function(p){ return p.estado === 'Error'; }).length }}</span>
                        <span class="verificacion-resumen__label">Con errores</span>
                    </div>
                    <div class="verificacion-resumen__item verificacion-resumen__item--total">
                        <span class="verificacion-resumen__valor">{{ progresoActualizacion.length }}</span>
                        <span class="verificacion-resumen__label">Total</span>
                    </div>
                </div>

                <div class="verificacion-lista verificacion-lista--scroll">
                    <div 
                        v-for="item in progresoActualizacion" 
                        :key="item.codigo" 
                        class="verificacion-item"
                        :class="{
                            'verificacion-item--ok': item.estado === 'Actualizado' || item.estado === 'Sin cambios',
                            'verificacion-item--error': item.estado === 'Error'
                        }"
                    >
                        <div class="verificacion-item__info">
                            <i v-if="item.estado === 'Actualizado'" class="fas fa-check-circle" style="color: #28C76F;"></i>
                            <i v-else-if="item.estado === 'Sin cambios'" class="fas fa-check-circle" style="color: #6b7280;"></i>
                            <i v-else-if="item.estado === 'Error'" class="fas fa-times-circle" style="color: #EA5455;"></i>
                            <div>
                                <span class="font-semibold">{{ item.codigo }}</span>
                                <div v-if="item.mensaje" class="text-xs" :style="{ color: item.estado === 'Error' ? '#EA5455' : item.estado === 'Actualizado' ? '#28C76F' : '#6b7280' }">{{ item.mensaje }}</div>
                            </div>
                        </div>
                        <vs-chip :color="getEstadoColorProducto(item.estado)" size="small">{{ item.estado }}</vs-chip>
                    </div>
                </div>

                <div class="verificacion-acciones">
                    <vs-button
                        v-if="progresoActualizacion.every(function(p){ return p.estado === 'Actualizado' || p.estado === 'Sin cambios'; }) && productosNoEncontradosEnPerseo.length === 0"
                        color="success"
                        @click="reintentarEnvioPerseo"
                        size="large"
                    >
                        <i class="fas fa-paper-plane mr-2"></i> Enviar a Perseo
                    </vs-button>
                    <vs-button
                        v-if="progresoActualizacion.some(function(p){ return p.estado === 'Error'; }) && productosNoEncontradosEnPerseo.length === 0"
                        color="warning"
                        @click="reiniciarVerificacion"
                        size="large"
                    >
                        <i class="fas fa-redo mr-2"></i> Reintentar Verificación
                    </vs-button>
                    <vs-button
                        color="dark"
                        type="border"
                        @click="cerrarPopupProductos"
                        size="large"
                    >
                        <i class="fas fa-times mr-2"></i> Cerrar
                    </vs-button>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
const ReporteVentasPDF = () => import('../imprimir/ReporteVentasPDF.vue');
const VentaEditarModalPerseo = () => import('../perseo/ventas/VentaEditarModalPerseo.vue');

export default {
    components: {
        ReporteVentasPDF,
        VentaEditarModalPerseo
    },
    props: {
        contrato: {
            type: String,
            default: null
        },
        totalizado: {
            type: String,
            default: null
        },
        librosPedido: {
            type: Array,
            default: () => []
        },
        periodoSelect: {
            type: Object,
            default: () => ({})
        },
        pedidoOriginal: {
            type: Object,
            default: () => ({})
        },
        userRoot: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ventas: [],
            loading: false,
            contratoSeleccionado: '',
            popupPDF: false,
            popupAnular: false,
            popupAnularObsequios: false,
            popupMotivoAnulacion: false,
            popupEditar: false,
            ventaSeleccionada: null,
            ventaEditarId: null,
            observacionAnulacion: '',
            observacionAnularObsequios: '',
            observacionAnulacionSeleccionada: '',
            usuario: null,
            puedeAnular: false,
            pedidoData: {},
            productosFaltantes: [],
            progresoActualizacion: [],
            productosNoEncontradosEnPerseo: [],
            mostrandoPopupProductos: false,
            enviandoProgreso: false,
            ventaEnvioPerseo: null
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.contratoSeleccionado = this.contrato || this.totalizado;
        this.verificarPermisos();
        this.getVentas();
    },
    methods: {
        mostrarObservacionAnulacion(observacion) {
            this.observacionAnulacionSeleccionada = observacion;
            this.popupMotivoAnulacion = true;
        },
        verificarPermisos() {
            // Aquí puedes verificar permisos según el rol del usuario
            // Por ejemplo, solo root o administradores pueden anular
            this.puedeAnular = this.usuario.id_group == 1 || this.usuario.id_group == 11; // Ajustar según tus roles
        },

        puedeMostrarBotonAnular(venta) {
            if (!venta) {
                return false;
            }

            if (venta.ven_p_libros_obsequios) {
                return false;
            }

            if (venta.est_ven_codigo === 3) {
                return false;
            }

            if ((venta.est_ven_codigo === 4 || venta.est_ven_codigo === 1) && !this.userRoot) {
                return false;
            }

            return true;
        },

        puedeMostrarBotonEditar(venta) {
            if (!venta) {
                return false;
            }

            // No permitir editar ventas de obsequios
            if (venta.ven_p_libros_obsequios) {
                return false;
            }

            // Si la venta está enviada a Perseo (estadoPerseo === 1)
            if (venta.estadoPerseo === 1) {
                // Solo root (id_group === 1) y facturador (id_group === 11) pueden editar
                const idGroup = parseInt(this.usuario.id_group, 10);
                return idGroup === 1 || idGroup === 11;
            }

            // Si NO está enviada a Perseo, permitir editar si está en estado pendiente (2) o es root
            return venta.est_ven_codigo === 2 || this.userRoot;
        },

        puedeMostrarBotonAnularObsequios(venta) {
            if (!venta) {
                return false;
            }

            if (!venta.ven_p_libros_obsequios) {
                return false;
            }

            if (venta.est_ven_codigo === 3) {
                return false;
            }

            if ((venta.est_ven_codigo === 4 || venta.est_ven_codigo === 1) && !this.userRoot) {
                return false;
            }

            return true;
        },
        
        getVentas() {
            let me = this;
            me.loading = true;
            
            let url;
            if (me.totalizado) {
                url = `${me.$server_url}get_ventas_por_totalizado?totalizado=${me.totalizado}`;
            } else {
                url = `${me.$server_url}get_ventas_por_contrato?contrato=${me.contrato}`;
            }
            
            me.$http.get(url)
            .then(res => {
                me.loading = false;
                if (res.data.status === 200) {
                    me.ventas = res.data.data;
                } else {
                    me.ventas = [];
                }
            })
            .catch((e) => {
                me.loading = false;
                console.error('Error al cargar ventas:', e);
                me.$vs.notify({
                    text: 'Error al cargar los documentos de venta',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },
        
        getTipoDocumentoColor(idtipodoc) {
            const colores = {
                1: 'primary',    // Pre Factura
                2: 'success',    // Factura
                3: 'warning',    // Nota de Crédito
                4: 'danger'      // Nota de Débito
            };
            return colores[idtipodoc] || 'dark';
        },
        
        getEstadoColor(estado) {
            const colores = {
                0: 'warning',   // Pendiente
                1: 'success',   // Despachado
                2: 'warning',   // Pendiente de despacho
                4: 'primary',   // En proceso de despacho
                3: 'danger'     // Anulado
            };
            return colores[estado] || 'dark';
        },
        
        getEstadoTexto(estado) {
            const textos = {
                1: 'Despachado',
                2: 'Pendiente',
                4: 'En proceso de despacho',
                3: 'Anulado'
            };
            return textos[estado] || 'Desconocido';
        },
        
        formatFecha(fecha) {
            if (!fecha) return 'Sin fecha';
            
            try {
                const date = new Date(fecha);
                return date.toLocaleDateString('es-EC', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                return fecha;
            }
        },
        
        verPDF(venta) {
            console.log('📄 Ver PDF:', venta);
            this.ventaSeleccionada = venta;
            this.popupPDF = true;
            // Aquí puedes implementar la visualización del PDF
        },
        
        verDetalle(venta) {
            let me = this;
            
            // Validar primero con la API antes de abrir el modal
            me.$vs.loading({ text: 'Validando...' });
            
            const payload = {
                ven_codigo: venta.ven_codigo,
                id_empresa: venta.id_empresa
            };
            
            me.$http.post(me.$server_url + 'api/perseo/ventas/validar-anular', payload)
                .then(res => {
                    me.$vs.loading.close();
                    
                    if (res.data.status == 1 && res.data.puede_anular) {
                        // Si puede anular, abrir el modal
                        console.log('🚫 Preparando anular venta:', venta);
                        me.ventaSeleccionada = venta;
                        me.observacionAnulacion = '';
                        me.popupAnular = true;
                    } else {
                        // Si no puede anular, mostrar dialog y recargar al aceptar
                        me.$vs.dialog({
                            type: 'alert',
                            color: 'warning',
                            title: 'No se puede anular',
                            text: res.data.message || 'No cumple con las condiciones para ser anulada',
                            accept: function() {
                                me.getVentas();
                            }
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    
                    const errorData = err.response && err.response.data ? err.response.data : null;
                    const errorMessage = errorData && errorData.message 
                        ? errorData.message 
                        : 'Error al validar la anulación';
                    
                    me.$vs.dialog({
                        type: 'alert',
                        color: 'danger',
                        title: 'Error',
                        text: errorMessage,
                        accept: function() {
                            me.getVentas();
                        }
                    });
                });
        },
        
        editarVenta(venta) {
            if (!venta || (venta.est_ven_codigo !== 2 && !this.userRoot)) {
                this.$vs.notify({
                    text: 'Solo se puede editar cuando la venta está en estado Pendiente de despacho',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            console.log('✏️ Preparando editar venta:', venta);
            this.ventaSeleccionada = venta;
            this.ventaEditarId = venta.ven_codigo;

            var pedidoOriginalSeguro = this.pedidoOriginal ? this.pedidoOriginal : {};
            var periodoDesdeSelect = null;
            var periodoDesdeVenta = null;
            var periodoDesdePedido = null;
            var idPeriodoFinal = 0;

            if (this.periodoSelect && this.periodoSelect.idperiodoescolar) {
                periodoDesdeSelect = this.periodoSelect.idperiodoescolar;
            } else if (this.periodoSelect && this.periodoSelect.id_periodo) {
                periodoDesdeSelect = this.periodoSelect.id_periodo;
            }

            if (venta && venta.idperiodoescolar) {
                periodoDesdeVenta = venta.idperiodoescolar;
            } else if (venta && venta.id_periodo) {
                periodoDesdeVenta = venta.id_periodo;
            }

            if (pedidoOriginalSeguro && pedidoOriginalSeguro.id_periodo) {
                periodoDesdePedido = pedidoOriginalSeguro.id_periodo;
            }

            if (periodoDesdeSelect) {
                idPeriodoFinal = periodoDesdeSelect;
            } else if (periodoDesdeVenta) {
                idPeriodoFinal = periodoDesdeVenta;
            } else if (periodoDesdePedido) {
                idPeriodoFinal = periodoDesdePedido;
            }
            
            // Preparar datos del pedido para el modal
            this.pedidoData = {
                id_periodo: idPeriodoFinal,
                contrato_generado: this.contrato ? this.contrato : (venta && venta.contrato ? venta.contrato : null),
                id_empresa: venta.id_empresa,
                pedido_id: venta && venta.id_pedido ? venta.id_pedido : null,
                tipo_venta: pedidoOriginalSeguro && pedidoOriginalSeguro.tipo_venta ? pedidoOriginalSeguro.tipo_venta : (venta && venta.tipo_venta ? venta.tipo_venta : null)
            };
            
            console.log('📋 pedidoData con tipo_venta:', this.pedidoData);
            
            this.popupEditar = true;
        },
        
        cerrarEdicion() {
            this.popupEditar = false;
            this.ventaEditarId = null;
            this.ventaSeleccionada = null;
        },
        
        handleVentaActualizada() {
            console.log('✅ Venta actualizada, recargando lista...');
            this.cerrarEdicion();
            this.getVentas();
            
            this.$vs.notify({
                title: 'Éxito',
                text: 'Venta actualizada exitosamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
            });
        },
        
        enviarAPerseo(venta) {
            let me = this;
            me.ventaEnvioPerseo = venta;
            
            me.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Enviar a Perseo',
                text: '¿Está seguro de enviar la venta ' + venta.ven_codigo + ' a Perseo?',
                accept: function() {
                    me.ejecutarEnvioPerseo(venta);
                }
            });
        },

        ejecutarEnvioPerseo(venta) {
            let me = this;
            me.$vs.loading({ text: 'Enviando a Perseo...' });
            
            var payload = {
                ven_codigo: venta.ven_codigo,
                id_empresa: venta.id_empresa
            };
            
            me.$http.post(me.$server_url + 'api/perseo/ventas/enviar-perseo', payload)
                .then(function(res) {
                    me.$vs.loading.close();
                    
                    if (res.data.status === 200) {
                        me.$vs.notify({
                            title: 'Éxito',
                            text: res.data.message || 'Venta enviada a Perseo exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 6000
                        });
                        me.getVentas();
                    } else if (res.data.codigosFaltantes) {
                        me.productosFaltantes = res.data.codigosFaltantes.split(',').map(function(c) { return c.trim(); });
                        me.progresoActualizacion = [];
                        me.mostrandoPopupProductos = true;
                        setTimeout(function() {
                            me.actualizarProductosFaltantes();
                        }, 500);
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message || 'No se pudo enviar a Perseo',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            time: 8000
                        });
                    }
                })
                .catch(function(err) {
                    me.$vs.loading.close();

                    var respData = (err.response && err.response.data) ? err.response.data : null;

                    if (respData && respData.codigosFaltantes) {
                        me.productosFaltantes = respData.codigosFaltantes.split(',').map(function(c) { return c.trim(); });
                        me.progresoActualizacion = [];
                        me.mostrandoPopupProductos = true;
                        setTimeout(function() {
                            me.actualizarProductosFaltantes();
                        }, 500);
                        return;
                    }

                    var errorMessage = (respData && respData.message) ? respData.message : 'Error al enviar la venta a Perseo';
                    me.$vs.notify({
                        title: 'Error',
                        text: errorMessage,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time: 10000
                    });
                });
        },

        actualizarProductosFaltantes() {
            let me = this;
            
            me.progresoActualizacion = me.productosFaltantes.map(function(codigo) {
                return { codigo: codigo, estado: 'Pendiente', mensaje: '' };
            });
            me.productosNoEncontradosEnPerseo = [];
            me.enviandoProgreso = true;

            var idEmpresa = (me.ventaEnvioPerseo && me.ventaEnvioPerseo.id_empresa) ? me.ventaEnvioPerseo.id_empresa : 1;
            var venCodigo = (me.ventaEnvioPerseo && me.ventaEnvioPerseo.ven_codigo) ? me.ventaEnvioPerseo.ven_codigo : '';

            var promesas = me.progresoActualizacion.map(function(item, index) {
                me.$set(me.progresoActualizacion[index], 'estado', 'Actualizando');
                me.$set(me.progresoActualizacion[index], 'mensaje', 'Verificando en Perseo...');

                return me.$http.post(me.$server_url + 'api/perseo/ventas/verificar-producto', {
                    codigo: item.codigo,
                    id_empresa: idEmpresa,
                    ven_codigo: venCodigo
                })
                    .then(function(res) {
                        if (res.data.estado === 1) {
                            me.$set(me.progresoActualizacion[index], 'estado', 'Actualizado');
                            me.$set(me.progresoActualizacion[index], 'mensaje', res.data.mensaje || 'Producto actualizado correctamente');
                        } else if (res.data.estado === 0) {
                            me.$set(me.progresoActualizacion[index], 'estado', 'Sin cambios');
                            me.$set(me.progresoActualizacion[index], 'mensaje', res.data.mensaje || 'No hay cambios necesarios');
                        } else {
                            me.$set(me.progresoActualizacion[index], 'estado', 'Error');
                            me.$set(me.progresoActualizacion[index], 'mensaje', res.data.mensaje || 'Error desconocido');
                            if (res.data.mensaje && res.data.mensaje.indexOf('no se encuentra en Perseo') > -1) {
                                me.productosNoEncontradosEnPerseo.push(item.codigo);
                            }
                        }
                    })
                    .catch(function(error) {
                        me.$set(me.progresoActualizacion[index], 'estado', 'Error');
                        var mensajeError = 'Error de conexión';
                        if (error.response && error.response.data) {
                            if (error.response.data.mensaje) {
                                mensajeError = error.response.data.mensaje;
                                if (mensajeError.indexOf('no se encuentra en Perseo') > -1) {
                                    me.productosNoEncontradosEnPerseo.push(item.codigo);
                                }
                            } else if (error.response.data.message) {
                                mensajeError = error.response.data.message;
                            } else if (typeof error.response.data === 'string') {
                                mensajeError = error.response.data;
                            }
                        } else if (error.message) {
                            mensajeError = error.message;
                        }
                        me.$set(me.progresoActualizacion[index], 'mensaje', mensajeError);
                    });
            });

            Promise.all(promesas).then(function() {
                me.enviandoProgreso = false;
                var actualizados = me.progresoActualizacion.filter(function(p) { return p.estado === 'Actualizado'; }).length;
                var errores = me.progresoActualizacion.filter(function(p) { return p.estado === 'Error'; }).length;
                var noEncontrados = me.productosNoEncontradosEnPerseo.length;
                
                if (noEncontrados > 0) {
                    me.$vs.notify({
                        text: noEncontrados + ' productos no están registrados en PERSEO. Contacta con Contabilidad.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                } else if (errores === 0) {
                    me.$vs.notify({
                        text: 'Verificación completada. ' + actualizados + ' productos procesados correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                } else {
                    me.$vs.notify({
                        text: 'Verificación completada con ' + errores + ' errores técnicos. Contacta con Soporte.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                }
            });
        },

        getEstadoColorProducto(estado) {
            switch (estado) {
                case 'Actualizado': return 'success';
                case 'Error': return 'danger';
                case 'Actualizando': return 'primary';
                case 'Sin cambios': return 'dark';
                case 'Pendiente':
                default: return 'warning';
            }
        },

        reiniciarVerificacion() {
            this.progresoActualizacion = [];
            this.productosNoEncontradosEnPerseo = [];
            this.actualizarProductosFaltantes();
        },

        cerrarPopupProductos() {
            this.mostrandoPopupProductos = false;
            this.progresoActualizacion = [];
            this.productosFaltantes = [];
            this.productosNoEncontradosEnPerseo = [];
        },

        reintentarEnvioPerseo() {
            this.mostrandoPopupProductos = false;
            if (this.ventaEnvioPerseo) {
                this.ejecutarEnvioPerseo(this.ventaEnvioPerseo);
            }
        },
        
        AnularObsequios(venta) {
            if (venta && (venta.est_ven_codigo === 4 || venta.est_ven_codigo === 1) && !this.userRoot) {
                this.$vs.notify({
                    title: 'Error',
                    text: 'No puede anular obsequios en proceso o despachados si no es usuario root',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            this.ventaSeleccionada = venta;
            this.observacionAnularObsequios = '';
            this.popupAnularObsequios = true;
        },

        confirmarAnularObsequios() {
            let me = this;

            if (me.ventaSeleccionada && (me.ventaSeleccionada.est_ven_codigo === 4 || me.ventaSeleccionada.est_ven_codigo === 1) && !me.userRoot) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'No puede anular obsequios en proceso o despachados si no es usuario root',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            if (!me.observacionAnularObsequios || me.observacionAnularObsequios.trim() === '') {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe escribir un motivo de anulación',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            me.$vs.loading();

            const payload = {
                ven_codigo: me.ventaSeleccionada.ven_codigo,
                id_empresa: me.ventaSeleccionada.id_empresa,
                id_usuario: me.usuario.idusuario,
                observacionAnulacion: me.observacionAnularObsequios
            };

            me.$http.post(me.$server_url + 'Venta_Obsequios_Perseo_Anular', payload)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupAnularObsequios = false;
                    me.observacionAnularObsequios = '';

                    if (res.data.status == 200) {
                        me.$vs.notify({
                            title: 'Venta Anulada',
                            text: res.data.message || 'Venta de obsequios anulada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.getVentas();
                        me.$emit('venta-anulada');
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message || 'No se pudo anular la venta de obsequios',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error('Error al anular obsequios:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al anular la venta de obsequios',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        confirmarAnular() {
            let me = this;

            if (me.ventaSeleccionada && (me.ventaSeleccionada.est_ven_codigo === 4 || me.ventaSeleccionada.est_ven_codigo === 1) && !me.userRoot) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'No puede anular un documento en proceso o despachado si no es usuario root',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }
            
            if (!me.observacionAnulacion || me.observacionAnulacion.trim() === '') {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe escribir un comentario para anular el documento',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }
            
            me.$vs.loading();
            
            const payload = {
                ven_codigo: me.ventaSeleccionada.ven_codigo,
                id_empresa: me.ventaSeleccionada.id_empresa,
                id_usuario: me.usuario.idusuario,
                observacionAnulacion: me.observacionAnulacion
            };
            
            me.$http.post(me.$server_url + 'api/perseo/ventas/anular', payload)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupAnular = false;
                    me.observacionAnulacion = '';
                    
                    if (res.data.status == 200) {
                        me.$vs.notify({
                            title: 'Éxito',
                            text: res.data.message || 'Venta anulada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.getVentas();
                        me.$emit('venta-anulada');
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message || 'No se pudo anular la venta',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error('Error al anular documento:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al anular el documento',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        }
    }
}
</script>

<style scoped>
.lista-ventas-container {
    padding: 20px;
}

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

/* Z-index para popup hijo */
.popup-pdf-hijo {
    z-index: 51010 !important;
}

/* Estilos del popup de anular */
.popup-anular-venta .anular-content {
    padding: 20px;
}

.popup-anular-venta .anular-header {
    text-align: center;
    margin-bottom: 25px;
}

.popup-anular-venta .icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    border-radius: 50%;
    margin-bottom: 15px;
    box-shadow: 0 4px 15px rgba(238, 90, 111, 0.3);
}

.popup-anular-venta .icon-container i {
    font-size: 35px;
    color: white;
}

.popup-anular-venta .anular-title {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
}

.popup-anular-venta .documento-info {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.popup-anular-venta .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.popup-anular-venta .info-item:last-child {
    border-bottom: none;
}

.popup-anular-venta .info-item .label {
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.popup-anular-venta .info-item .value {
    color: white;
    font-size: 16px;
    font-weight: 700;
}

.popup-anular-venta .info-item .pedido-code {
    font-family: 'Courier New', monospace;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 15px;
}

.popup-anular-venta .info-item .total {
    font-size: 20px;
    color: #90EE90;
}

.popup-anular-venta .anular-warning {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.popup-anular-venta .anular-warning i {
    color: #ff9800;
    font-size: 20px;
    margin-top: 2px;
}

.popup-anular-venta .anular-warning p {
    color: #856404;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
}

.popup-anular-venta .comentario-section {
    margin-bottom: 25px;
}

.popup-anular-venta .comentario-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 10px;
}

.popup-anular-venta .comentario-label i {
    color: #667eea;
}

.popup-anular-venta .comentario-textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s ease;
}

.popup-anular-venta .comentario-textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.popup-anular-venta .comentario-textarea::placeholder {
    color: #999;
}

.popup-anular-venta .anular-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.popup-anular-venta .btn-anular,
.popup-anular-venta .btn-cancelar {
    min-width: 180px;
    font-weight: 600;
    padding: 12px 24px;
}

.popup-anular-venta .btn-anular i,
.popup-anular-venta .btn-cancelar i {
    font-size: 14px;
}

/* Estilos para columna de Acciones */
.acciones-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
}

.perseo-info {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    background: #f5f5f5;
    border-radius: 4px;
    flex-wrap: wrap;
}

.perseo-label {
    font-size: 11px;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
}

.perseo-code {
    font-family: monospace;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    background: #fff;
    padding: 2px 8px;
    border-radius: 3px;
    border: 1px solid #ddd;
}

.status-badge {
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 3px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.status-badge.success {
    background: #28C76F;
    color: white;
}

.status-badge.danger {
    background: #EA5455;
    color: white;
}

.anulado-box {
    padding: 6px 10px;
    background: #fff5f5;
    border-left: 3px solid #EA5455;
    border-radius: 3px;
    font-size: 12px;
}

.anulado-box__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.anulado-box__usuario {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
}

.anulado-box__fecha {
    font-size: 11px;
}

.btn-accion-sm {
    width: auto;
    justify-content: flex-start;
    text-align: left;
    font-size: 12px;
    padding: 6px 10px !important;
    min-height: 32px !important;
}

.btn-ver-motivo {
    margin-top: 6px;
    width: 100%;
    justify-content: center;
}

.popup-motivo-anulacion .motivo-content {
    padding: 20px;
}

.popup-motivo-anulacion .motivo-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
}

.popup-motivo-anulacion .motivo-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(234, 84, 85, 0.12);
    border: 1px solid rgba(234, 84, 85, 0.25);
}

.popup-motivo-anulacion .motivo-icon i {
    color: #EA5455;
    font-size: 20px;
}

.popup-motivo-anulacion .motivo-title {
    margin: 0;
    color: #1E1E1E;
    font-size: 20px;
    font-weight: 700;
}

.popup-motivo-anulacion .motivo-body {
    border: 1px solid #e4e7ed;
    border-left: 4px solid #EA5455;
    border-radius: 8px;
    padding: 14px;
    background: #fff;
}

.popup-motivo-anulacion .motivo-texto {
    margin: 0;
    color: #4b4b4b;
    line-height: 1.6;
    font-size: 14px;
    white-space: pre-wrap;
    word-break: break-word;
}

.popup-motivo-anulacion .motivo-actions {
    margin-top: 18px;
    display: flex;
    justify-content: flex-end;
}

.theme-dark .popup-motivo-anulacion .motivo-title {
    color: #c2c6dc;
}

.theme-dark .popup-motivo-anulacion .motivo-body {
    background: #10163a;
    border-color: #2c355f;
}

.theme-dark .popup-motivo-anulacion .motivo-texto {
    color: #c2c6dc;
}

.btn-accion-sm i {
    margin-right: 6px;
    font-size: 13px;
}

.info-compacta {
    padding: 8px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #046AE7;
}

/* Badge para items y cantidades */
.item-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #333;
}

.item-badge i {
    font-size: 11px;
    color: #666;
}

/* Clases chip personalizadas */
.chip {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

.chip-primary {
    background: #046AE7;
    color: white;
}

.chip-success {
    background: #28C76F;
    color: white;
}

.chip-danger {
    background: #EA5455;
    color: white;
}

.chip-warning {
    background: #FF9F43;
    color: white;
}

.chip-dark {
    background: #1E1E1E;
    color: white;
}

/* Modal Verificación de Productos */
.verificacion-body {
    padding: 20px;
}

.verificacion-contexto {
    margin: 16px 20px 0 20px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
}

.verificacion-contexto__item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    margin-bottom: 4px;
}

.verificacion-contexto__item:last-child {
    margin-bottom: 0;
}

.verificacion-contexto__label {
    font-weight: 700;
    color: #046AE7;
}

.verificacion-contexto__value {
    font-weight: 600;
    color: #1e293b;
}

.verificacion-loading {
    text-align: center;
    margin-bottom: 20px;
}

.verificacion-loading h4 {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-top: 12px;
}

.verificacion-spinner {
    display: inline-block;
    width: 36px;
    height: 36px;
    border: 3px solid #e0e0e0;
    border-top: 3px solid #046AE7;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.verificacion-lista {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.verificacion-lista--scroll {
    max-height: 256px;
    overflow-y: auto;
}

.verificacion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.verificacion-item--ok {
    border-color: #a7f3d0;
    background: #f0fdf4;
}

.verificacion-item--error {
    border-color: #fecaca;
    background: #fef2f2;
}

.verificacion-item--loading {
    border-color: #bfdbfe;
    background: #eff6ff;
}

.verificacion-item--neutral {
    border-color: #e5e7eb;
    background: #f9fafb;
}

.verificacion-item--pending {
    border-color: #fef3c7;
    background: #fffbeb;
}

.verificacion-item__info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.verificacion-item__info i {
    font-size: 16px;
}

.verificacion-alerta {
    padding: 20px;
    border-radius: 10px;
    border: 1px solid transparent;
    margin-bottom: 20px;
}

.verificacion-alerta--ok {
    background: #dcfce7;
    border-color: #86efac;
}

.verificacion-alerta--warning {
    background: #ffedd5;
    border-color: #fdba74;
}

.verificacion-alerta--error {
    background: #fee2e2;
    border-color: #fca5a5;
}

.verificacion-resumen {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.verificacion-resumen__item {
    text-align: center;
    padding: 12px;
    border-radius: 8px;
}

.verificacion-resumen__item--ok {
    background: #f0fdf4;
}

.verificacion-resumen__item--error {
    background: #fef2f2;
}

.verificacion-resumen__item--total {
    background: #eff6ff;
}

.verificacion-resumen__valor {
    display: block;
    font-size: 24px;
    font-weight: 700;
}

.verificacion-resumen__item--ok .verificacion-resumen__valor {
    color: #28C76F;
}

.verificacion-resumen__item--error .verificacion-resumen__valor {
    color: #EA5455;
}

.verificacion-resumen__item--total .verificacion-resumen__valor {
    color: #046AE7;
}

.verificacion-resumen__label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-top: 2px;
}

.verificacion-resumen__item--ok .verificacion-resumen__label {
    color: #28C76F;
}

.verificacion-resumen__item--error .verificacion-resumen__label {
    color: #EA5455;
}

.verificacion-resumen__item--total .verificacion-resumen__label {
    color: #046AE7;
}

.verificacion-acciones {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}

.fa-spin {
    animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
