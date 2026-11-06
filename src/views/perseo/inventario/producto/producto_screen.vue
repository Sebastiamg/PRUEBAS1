<template>
<vx-card>
    <!-- Botonera de Productos (encima del submenu) -->
    <div class="botonera-container">
        <botonera_productos 
            :handlers="currentHandlers" 
            :isEditMode="isEditMode" 
            @buscar="handleBuscar" 
            @nuevo="handleNuevo" 
            @modificar="handleModificar" 
            @eliminar="handleEliminar" 
            @guardar="handleGuardar" 
            @cancelar="handleCancelar" 
            @actualizar="handleActualizar" 
        />
    </div>

    <!-- Submenu de Productos -->
    <div class="producto-submenu">
        <div class="submenu-scroll-wrapper">
            <div class="submenu-container">
                <div 
                    v-for="(item, index) in menuItems" 
                    :key="index" 
                    class="submenu-item" 
                    :class="{ 
                        active: activeSubmenu === item.key, 
                        'disabled': isEditMode && item.key === 'listado_productos',
                        'cursor-not-allowed opacity-50': isEditMode && item.key === 'listado_productos'
                    }" 
                    @click="handleSubmenuClick(item.key)"
                >
                    <div class="submenu-item-content">
                        <div class="submenu-icon">
                            <feather-icon :icon="item.icon" svgClasses="w-5 h-5" />
                        </div>
                        <span class="submenu-label">{{ item.label }}</span>
                    </div>
                    <div v-if="activeSubmenu === item.key" class="submenu-indicator"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Contenido dinámico según el submenu activo -->
    <div class="mt-4">
        <div v-if="activeSubmenu === 'datos_basicos'" class="section-content">
            <h4 class="section-title">Datos Básicos</h4>
            <p class="text-muted">Información básica del producto</p>
            <perseo_producto_datos_basicosVue ref="listado_perseo_producto_datos_basicosVueRef" :isEditMode="isEditMode" :idProducto="selectedProductoId" />
            <!-- Aquí irá el componente de datos básicos -->
            <!-- Aquí irá el componente de datos básicos -->
            <!-- Ejemplo: <producto_datos_basicos ref="datosBasicosRef" :isEditMode="isEditMode" /> -->
        </div>

        <div v-else-if="activeSubmenu === 'almacenes'" class="section-content">
            <h4 class="section-title">Almacenes</h4>
            <p class="text-muted">Gestión de almacenes del producto</p>
            <!-- Aquí irá el componente de almacenes -->
        </div>

        <div v-else-if="activeSubmenu === 'imagenes'" class="section-content">
            <h4 class="section-title">Imágenes</h4>
            <p class="text-muted">Galería de imágenes del producto</p>
            <!-- Aquí irá el componente de imágenes -->
        </div>

        <div v-else-if="activeSubmenu === 'ecommerce'" class="section-content">
            <h4 class="section-title">Ecommerce</h4>
            <p class="text-muted">Configuración para tienda online</p>
            <!-- Aquí irá el componente de ecommerce -->
        </div>

        <div v-else-if="activeSubmenu === 'ficha_tecnica'" class="section-content">
            <h4 class="section-title">Ficha Técnica</h4>
            <p class="text-muted">Especificaciones técnicas del producto</p>
            <!-- Aquí irá el componente de ficha técnica -->
        </div>

        <div v-else-if="activeSubmenu === 'parametros'" class="section-content">
            <h4 class="section-title">Parámetros</h4>
            <p class="text-muted">Parámetros adicionales del producto</p>
            <!-- Aquí irá el componente de parámetros -->
        </div>

        <div v-else-if="activeSubmenu === 'contabilidad'" class="section-content">
            <h4 class="section-title">Contabilidad</h4>
            <p class="text-muted">Información contable del producto</p>
            <!-- Aquí irá el componente de contabilidad -->
        </div>

        <div v-else-if="activeSubmenu === 'cod_alternos'" class="section-content">
            <h4 class="section-title">Códigos Alternos</h4>
            <p class="text-muted">Códigos alternativos del producto</p>
            <!-- Aquí irá el componente de códigos alternos -->
        </div>

        <div v-else-if="activeSubmenu === 'listado_productos'" class="section-content">
            <perseo_producto_listadoVue ref="listadoProductosRef" :isEditMode="isEditMode" @editar-producto="handleEditarProducto" />
        </div>
    </div>
</vx-card>
</template>

<script>
const perseo_producto_listadoVue = () => import('@/views/perseo/inventario/producto/producto_listado.vue');
const perseo_producto_datos_basicosVue = () => import('@/views/perseo/inventario/producto/producto_datos_basicos.vue');
const botonera_productos = () => import('@/views/perseo/inventario/producto/botonera_productos.vue');

import Generalmix from '../../../../mixins/Generalmix';

export default {
    mixins: [Generalmix],
    components: {
        perseo_producto_listadoVue,
        perseo_producto_datos_basicosVue,
        botonera_productos
    },
    data() {
        return {
            activeSubmenu: localStorage.getItem('producto_submenu_active') || 'listado_productos',
            isEditMode: false, // Estado global de edición
            selectedProductoId: null, // ID del producto seleccionado para edición
            menuItems: [{
                    key: 'datos_basicos',
                    label: 'Datos Básicos',
                    icon: 'FileTextIcon'
                },
                {
                    key: 'almacenes',
                    label: 'Almacenes',
                    icon: 'PackageIcon'
                },
                {
                    key: 'imagenes',
                    label: 'Imágenes',
                    icon: 'ImageIcon'
                },
                {
                    key: 'ecommerce',
                    label: 'Ecommerce',
                    icon: 'ShoppingCartIcon'
                },
                {
                    key: 'ficha_tecnica',
                    label: 'Ficha Técnica',
                    icon: 'ClipboardIcon'
                },
                {
                    key: 'parametros',
                    label: 'Parámetros',
                    icon: 'SlidersIcon'
                },
                {
                    key: 'contabilidad',
                    label: 'Contabilidad',
                    icon: 'DollarSignIcon'
                },
                {
                    key: 'cod_alternos',
                    label: 'Cod. Alternos',
                    icon: 'HashIcon'
                },
                {
                    key: 'listado_productos',
                    label: 'Listado Productos',
                    icon: 'ListIcon'
                }
            ],
            // Configuración de handlers disponibles por sección
            sectionHandlers: {
                datos_basicos: {
                    buscar: false,
                    nuevo: true,
                    modificar: true,
                    eliminar: true,
                    guardar: true,
                    cancelar: true,
                    actualizar: false
                },
                almacenes: {
                    buscar: false,
                    nuevo: true,
                    modificar: true,
                    eliminar: false,
                    guardar: true,
                    cancelar: true,
                    actualizar: true
                },
                imagenes: {
                    buscar: true,
                    nuevo: true,
                    modificar: true,
                    eliminar: true,
                    guardar: true,
                    cancelar: true,
                    actualizar: false
                },
                ecommerce: {
                    buscar: false,
                    nuevo: false,
                    modificar: true,
                    eliminar: false,
                    guardar: true,
                    cancelar: true,
                    actualizar: false
                },
                ficha_tecnica: {
                    buscar: false,
                    nuevo: false,
                    modificar: true,
                    eliminar: false,
                    guardar: true,
                    cancelar: true,
                    actualizar: false
                },
                parametros: {
                    buscar: false,
                    nuevo: true,
                    modificar: true,
                    eliminar: true,
                    guardar: true,
                    cancelar: true,
                    actualizar: true
                },
                contabilidad: {
                    buscar: false,
                    nuevo: false,
                    modificar: true,
                    eliminar: false,
                    guardar: true,
                    cancelar: true,
                    actualizar: false
                },
                cod_alternos: {
                    buscar: false,
                    nuevo: true,
                    modificar: true,
                    eliminar: true,
                    guardar: true,
                    cancelar: true,
                    actualizar: true
                },
                listado_productos: {
                    buscar: true,
                    nuevo: true,
                    modificar: true,
                    eliminar: true,
                    guardar: true,
                    cancelar: true,
                    actualizar: true
                }
            }
        }
    },
    computed: {
        // Obtiene los handlers disponibles para la sección actual
        currentHandlers() {
            return this.sectionHandlers[this.activeSubmenu] || {
                buscar: true,
                nuevo: true,
                modificar: true,
                eliminar: true,
                guardar: true,
                cancelar: true,
                actualizar: true
            };
        }
    },
    methods: {
        setActiveSubmenu(key) {
            this.activeSubmenu = key;
            localStorage.setItem('producto_submenu_active', key);
        },

        // Métodos para manejar eventos de la botonera
        handleBuscar() {
            console.log('Buscar en:', this.activeSubmenu);
            // Implementar lógica de búsqueda según la sección activa
        },

        handleNuevo() {
            console.log('Nuevo producto');
            // Siempre ir a Datos Básicos al crear nuevo
            this.setActiveSubmenu('datos_basicos');
            this.isEditMode = true;
            // Implementar lógica para nuevo producto
        },

        handleModificar() {
            console.log('Modificar en:', this.activeSubmenu);
            this.isEditMode = true;
            // Implementar lógica para modificar según la sección
        },

        handleEliminar() {
            console.log('Eliminar en:', this.activeSubmenu);
            // Implementar lógica para eliminar según la sección
        },

        handleGuardar() {
            console.log('Guardar cambios en:', this.activeSubmenu);
            this.isEditMode = false;
            // Implementar lógica para guardar según la sección
        },

        handleCancelar() {
            console.log('Cancelar operación en:', this.activeSubmenu);
            this.isEditMode = false;
            // Implementar lógica para cancelar según la sección
        },

        handleActualizar() {
            console.log('Actualizar en:', this.activeSubmenu);

            // Llamar al método del componente hijo según la sección activa
            switch (this.activeSubmenu) {
                case 'listado_productos':
                    if (this.$refs.listadoProductosRef && this.$refs.listadoProductosRef.perseo_productos_consulta) {
                        this.$refs.listadoProductosRef.perseo_productos_consulta();
                    }
                    break;
                case 'datos_basicos':
                    // Cuando implementes el componente, llamar su método
                    // if (this.$refs.datosBasicosRef && this.$refs.datosBasicosRef.actualizarDatos) {
                    //     this.$refs.datosBasicosRef.actualizarDatos();
                    // }
                    break;
                case 'almacenes':
                    // if (this.$refs.almacenesRef && this.$refs.almacenesRef.actualizarAlmacenes) {
                    //     this.$refs.almacenesRef.actualizarAlmacenes();
                    // }
                    break;
                case 'parametros':
                    // if (this.$refs.parametrosRef && this.$refs.parametrosRef.actualizarParametros) {
                    //     this.$refs.parametrosRef.actualizarParametros();
                    // }
                    break;
                case 'cod_alternos':
                    // if (this.$refs.codAlternosRef && this.$refs.codAlternosRef.actualizarCodigos) {
                    //     this.$refs.codAlternosRef.actualizarCodigos();
                    // }
                    break;
                default:
                    console.log('No hay método de actualización para esta sección');
            }
        },
        async handleEditarProducto(productosid) {
            this.selectedProductoId = productosid;
            this.setActiveSubmenu('datos_basicos');
            this.isEditMode = false; // Empezar en modo lectura
        },
        handleModificar() {
            this.isEditMode = true;
        },
        handleCancelar() {
            this.isEditMode = false;
        },
        async handleGuardar() {
            try {
                console.log('handleGuardar: Iniciando guardado, isEditMode:', this.isEditMode);
                this.$vs.loading();
                let success = false;

                switch (this.activeSubmenu) {
                    case 'datos_basicos':
                        if (this.$refs.listado_perseo_producto_datos_basicosVueRef) {
                            // Validar si es array o componente único
                            const component = Array.isArray(this.$refs.listado_perseo_producto_datos_basicosVueRef)
                                ? this.$refs.listado_perseo_producto_datos_basicosVueRef[0]
                                : this.$refs.listado_perseo_producto_datos_basicosVueRef;
                            
                            if (component && typeof component.guardarProducto === 'function') {
                                console.log('handleGuardar: Llamando a guardarProducto del componente hijo');
                                await component.guardarProducto();
                                console.log('handleGuardar: guardarProducto completado exitosamente');
                                success = true;
                            }
                        }
                        break;
                    case 'imagenes':
                        // Futura implementación
                        // await this.$refs.imagenesRef.guardarImagenes();
                        success = true; // Simulado por ahora
                        break;
                    default:
                        console.log('No hay método de guardado para esta sección');
                        success = true; // Para no bloquear otras secciones sin implementación
                }

                if (success) {
                    console.log('handleGuardar: Guardado exitoso, estableciendo isEditMode a false');
                    this.isEditMode = false;
                    console.log('handleGuardar: isEditMode ahora es:', this.isEditMode);
                }
            } catch (error) {
                console.error('handleGuardar: Error al guardar:', error);
                // No salimos del modo edición si hubo error
            } finally {
                this.$vs.loading.close();
            }
        },
        handleSubmenuClick(key) {
            if (this.isEditMode && key === 'listado_productos') {
                return; // No permitir ir al listado en modo edición
            }
            this.setActiveSubmenu(key);
        }
    }
}
</script>

<style lang="scss" scoped>
.botonera-container {
    margin: -1.5rem -1.5rem 1rem -1.5rem;
    padding: 1rem 1.5rem;
    background: #ffffff;
    border-bottom: 1px solid #e9ecef;
}

.producto-submenu {
    background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #dee2e6;
    margin: -1rem -1.5rem 1.5rem -1.5rem;
    padding: 0;
}

.submenu-scroll-wrapper {
    overflow-x: auto;
    overflow-y: hidden;

    /* Scrollbar personalizado */
    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
            background: #a1a1a1;
        }
    }
}

.submenu-container {
    display: flex;
    background: linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%);
    border: 1px solid #d0d0d0;
    border-radius: 0 0 4px 4px;
    padding: 6px 10px;
    gap: 6px;
    min-width: min-content;
}

.submenu-item {
    position: relative;
    cursor: pointer;
    transition: all 0.15s ease;
    border-radius: 4px;
    padding: 8px 14px;
    min-width: fit-content;
    background: #ffffff;
    border: 1px solid transparent;

    &:hover {
        background: linear-gradient(to bottom, #e8f4fc 0%, #d4ebf9 100%);
        border-color: #7fc4e8;
    }

    &.active {
        background: linear-gradient(to bottom, #cce5ff 0%, #b3d9ff 100%);
        border-color: #4da6ff;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

        .submenu-icon {
            color: #e67e22;
        }

        .submenu-label {
            color: #0056b3;
            font-weight: 600;
        }
    }
}

.submenu-item-content {
    display: flex;
    align-items: center;
    gap: 6px;
}

.submenu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    color: #e67e22;
}

.submenu-label {
    font-size: 11px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    transition: all 0.15s ease;
}

.submenu-indicator {
    display: none; // Ocultamos el indicador para mantener el estilo simple
}

.section-content {
    padding: 1rem 0;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.text-muted {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .submenu-container {
        padding: 4px 8px;
        gap: 4px;
    }

    .submenu-item {
        padding: 6px 10px;
    }

    .submenu-label {
        font-size: 10px;
    }

    .submenu-icon {
        .feather-icon {
            width: 0.875rem !important;
            height: 0.875rem !important;
        }
    }
}

/* Mejoras de accesibilidad */
.submenu-item:focus {
    outline: 2px solid #7fc4e8;
    outline-offset: 2px;
}

.submenu-item:active {
    transform: scale(0.98);
}
</style>
