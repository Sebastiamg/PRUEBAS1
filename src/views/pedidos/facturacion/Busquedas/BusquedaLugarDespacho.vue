<template>
    <vs-popup 
        class="popup-busqueda" 
        title="Buscar Lugar de Despacho" 
        :active.sync="popupBusqueda"
        @close="cerrarBusqueda"
    >
        <div v-if="popupBusqueda">
            <!-- Campo de búsqueda -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Buscar Punto de Despacho</h4>
                </template>
                
                <div class="flex gap-2">
                    <vs-input 
                        ref="inputBusqueda"
                        v-model="busqueda.puntoVenta" 
                        @keypress.enter="buscarPuntoDespacho" 
                        class="flex-1" 
                        placeholder="Ingrese el nombre del punto de despacho (mínimo 4 caracteres)" 
                    />
                    <vs-button 
                        color="primary" 
                        @click="buscarPuntoDespacho"
                        :disabled="busqueda.puntoVenta.length < 4"
                    >
                        Buscar
                    </vs-button>
                </div>
                <small class="text-gray-500 block mt-1">Presionar enter o clic en buscar</small>
            </vx-card>

            <!-- Resultados de búsqueda -->
            <vx-card v-if="arrayPuntoVenta.length > 0" class="mb-4">
                <template slot="header">
                    <div class="flex justify-between items-center">
                        <h4>Resultados de Búsqueda</h4>
                        <vs-chip color="primary">{{ resultadosFiltrados.length }} de {{ arrayPuntoVenta.length }}</vs-chip>
                    </div>
                </template>
                
                <!-- Buscador interno -->
                <div class="mb-3">
                    <vs-input 
                        v-model="filtroInterno" 
                        placeholder="Filtrar resultados por institución o ciudad..."
                        class="w-full"
                        icon-pack="feather"
                        icon="icon-search"
                    />
                </div>
                
                <!-- Lista de resultados -->
                <div class="lista-resultados">
                    <div 
                        v-for="(punto, index) in resultadosFiltrados" 
                        :key="index"
                        class="item-resultado"
                        @click="seleccionarDirecto(punto)"
                    >
                        <div class="item-contenido">
                            <div class="item-principal">
                                <feather-icon icon="MapPinIcon" size="18" class="icono-institucion"></feather-icon>
                                <div class="item-info">
                                    <div class="institucion-nombre">{{ punto.nombreInstitucion }}</div>
                                    <div class="institucion-ciudad">
                                        <feather-icon icon="MapIcon" size="12" class="mr-1"></feather-icon>
                                        {{ punto.ciudad }}
                                    </div>
                                    <div class="institucion-ruc" v-if="punto.ruc">
                                        <feather-icon icon="FileTextIcon" size="12" class="mr-1"></feather-icon>
                                        {{ 'RUC: ' + punto.ruc }}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="item-facturacion">
                                <div v-if="punto.datosInstitucion && punto.datosInstitucion.length > 0">
                                    <div class="facturacion-info">
                                        <feather-icon icon="CreditCardIcon" size="12" class="mr-1"></feather-icon>
                                        P.Ventas: {{ punto.datosInstitucion[0].ffp_credito }}
                                    </div>
                                    <div class="facturacion-info">
                                        <feather-icon icon="TrendingUpIcon" size="12" class="mr-1"></feather-icon>
                                        Cupo: {{ punto.datosInstitucion[0].ffp_cupo }}
                                    </div>
                                    <div class="facturacion-info">
                                        <feather-icon icon="PercentIcon" size="12" class="mr-1"></feather-icon>
                                        Desc: {{ punto.datosInstitucion[0].ffp_descuento }}%
                                    </div>
                                </div>
                                <div v-else class="sin-facturacion">
                                    <feather-icon icon="AlertTriangleIcon" size="12" class="mr-1"></feather-icon>
                                    Sin configuración
                                </div>
                            </div>
                            
                            <div class="item-accion">
                                <feather-icon icon="CheckCircleIcon" size="18" class="icono-seleccionar"></feather-icon>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mensaje cuando no hay resultados filtrados -->
                    <div v-if="resultadosFiltrados.length === 0" class="sin-resultados">
                        <feather-icon icon="SearchIcon" size="24" class="mb-2"></feather-icon>
                        <p>No se encontraron resultados con el filtro aplicado</p>
                    </div>
                </div>
            </vx-card>

            <!-- Lugar seleccionado -->
            <vx-card v-if="lugarSeleccionado.nombreInstitucion" class="mb-4">
                <template slot="header">
                    <h4>✓ Lugar Seleccionado</h4>
                </template>
                
                <div class="bg-green-50 p-3 rounded">
                    <div class="font-semibold text-green-700">{{ lugarSeleccionado.nombreInstitucion }}</div>
                    <div class="text-sm text-gray-600">{{ lugarSeleccionado.ciudad }}</div>
                    <div class="text-sm text-gray-600" v-if="lugarSeleccionado.ruc">
                        {{ 'RUC: ' + lugarSeleccionado.ruc }}
                    </div>
                    
                    <div v-if="lugarSeleccionado.datosInstitucion && lugarSeleccionado.datosInstitucion.length > 0" class="mt-2">
                        <div class="resumen-financiero-busqueda text-xs text-gray-500">
                            <div>
                                <strong>P. Ventas:</strong> {{ lugarSeleccionado.datosInstitucion[0].ffp_credito }}
                            </div>
                            <div>
                                <strong>Cupo:</strong> {{ lugarSeleccionado.datosInstitucion[0].ffp_cupo }}
                            </div>
                            <div>
                                <strong>Descuento:</strong> {{ lugarSeleccionado.datosInstitucion[0].ffp_descuento }}%
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-center gap-2 mt-3">
                        <vs-button 
                            color="success" 
                            @click="confirmarSeleccion"
                        >
                            Confirmar
                        </vs-button>
                        <vs-button 
                            color="warning" 
                            type="border" 
                            @click="cambiarSeleccion"
                        >
                            Cambiar
                        </vs-button>
                    </div>
                </div>
            </vx-card>

            <!-- Botones de acción -->
            <div class="flex justify-center gap-4 mt-6">
                <vs-button color="danger" type="border" @click="cerrarBusqueda">
                    Cancelar
                </vs-button>
            </div>
        </div>
    </vs-popup>
</template>

<script>
export default {
    name: 'BusquedaLugarDespacho',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        idPeriodo: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            popupBusqueda: this.visible,
            busqueda: {
                puntoVenta: ''
            },
            filtroInterno: '', // Filtro para buscar dentro de los resultados
            arrayPuntoVenta: [],
            lugarSeleccionado: {
                nombreInstitucion: '',
                ciudad: '',
                ruc: '',
                id_institucion: '',
                datosInstitucion: []
            }
        }
    },
    computed: {
        resultadosFiltrados() {
            if (!this.filtroInterno || this.filtroInterno.trim() === '') {
                return this.arrayPuntoVenta;
            }
            
            const filtro = this.filtroInterno.toLowerCase().trim();
            return this.arrayPuntoVenta.filter(punto => {
                const nombreInstitucion = (punto.nombreInstitucion || '').toLowerCase();
                const ciudad = (punto.ciudad || '').toLowerCase();
                
                return nombreInstitucion.includes(filtro) || ciudad.includes(filtro);
            });
        }
    },
    watch: {
        visible(newVal) {
            this.popupBusqueda = newVal;
            if (newVal) {
                this.resetearBusqueda();
                // Autofocus al input cuando se abre el popup
                this.$nextTick(() => {
                    if (this.$refs.inputBusqueda && this.$refs.inputBusqueda.$el) {
                        const inputElement = this.$refs.inputBusqueda.$el.querySelector('input');
                        if (inputElement) {
                            inputElement.focus();
                        }
                    }
                });
            }
        },
        popupBusqueda(newVal) {
            this.$emit('update:visible', newVal);
        }
    },
    methods: {
        resetearBusqueda() {
            this.busqueda.puntoVenta = '';
            this.filtroInterno = '';
            this.arrayPuntoVenta = [];
            this.lugarSeleccionado = {
                nombreInstitucion: '',
                ciudad: '',
                ruc: '',
                id_institucion: '',
                datosInstitucion: []
            };
        },
        
        buscarPuntoDespacho() {
            if (this.busqueda.puntoVenta.length < 4) {
                this.$vs.notify({
                    title: 'Error',
                    text: 'Debe ingresar al menos 4 caracteres',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }
            
            const url = `pedidos2/pedidos?getDatosPuntosVenta=1&busqueda=${this.busqueda.puntoVenta}&id_periodo=${this.idPeriodo}`;
            
            this.$vs.loading();
            this.$http.get(this.$server_url + url)
                .then(res => {
                    this.$vs.loading.close();
                    this.arrayPuntoVenta = res.data;
                    
                    if (this.arrayPuntoVenta.length === 0) {
                        this.$vs.notify({
                            title: 'Sin resultados',
                            text: 'No se encontraron puntos de despacho con ese criterio',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al buscar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        seleccionarDirecto(punto) {
            // Selección directa - envía los datos y cierra el popup inmediatamente
            const lugarSeleccionado = {
                nombreInstitucion: punto.nombreInstitucion,
                ciudad: punto.ciudad,
                ruc: punto.ruc,
                id_institucion: punto.idInstitucion,
                datosInstitucion: punto.datosInstitucion || []
            };
            
            // Enviar datos y cerrar popup directamente
            this.$emit('lugar-seleccionado', lugarSeleccionado);
            this.cerrarBusqueda();
        },
        
        seleccionarYConfirmar(punto) {
            this.lugarSeleccionado = {
                nombreInstitucion: punto.nombreInstitucion,
                ciudad: punto.ciudad,
                ruc: punto.ruc,
                id_institucion: punto.idInstitucion,
                datosInstitucion: punto.datosInstitucion || []
            };
            
            // Limpiar tabla de resultados para mostrar solo la selección
            this.arrayPuntoVenta = [];
        },
        
        cambiarSeleccion() {
            // Volver a mostrar los resultados anteriores si existen
            if (this.busqueda.puntoVenta.length >= 4) {
                this.buscarPuntoDespacho();
            }
            this.lugarSeleccionado = {
                nombreInstitucion: '',
                ciudad: '',
                ruc: '',
                id_institucion: '',
                datosInstitucion: []
            };
        },
        
        seleccionarPuntoDespacho(punto) {
            this.lugarSeleccionado = {
                nombreInstitucion: punto.nombreInstitucion,
                ciudad: punto.ciudad,
                ruc: punto.ruc,
                id_institucion: punto.idInstitucion,
                datosInstitucion: punto.datosInstitucion || []
            };
            
            // Limpiar tabla de resultados
            this.arrayPuntoVenta = [];
        },
        
        confirmarSeleccion() {
            this.$emit('lugar-seleccionado', this.lugarSeleccionado);
            this.cerrarBusqueda();
        },
        
        cerrarBusqueda() {
            this.popupBusqueda = false;
            this.resetearBusqueda();
            this.$emit('cerrar');
        }
    }
}
</script>

<style scoped>
.popup-busqueda {
    z-index: 51005;
}

.popup-busqueda .vs-popup {
    padding: 20px;
    max-width: 900px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.flex {
    display: flex;
}

.flex-1 {
    flex: 1 1 0%;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.justify-center {
    justify-content: center;
}

.gap-2 {
    gap: 0.5rem;
}

.gap-4 {
    gap: 1rem;
}

.mt-1 {
    margin-top: 0.25rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.mt-6 {
    margin-top: 1.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.p-3 {
    padding: 0.75rem;
}

.text-xs {
    font-size: 0.75rem;
}

.text-sm {
    font-size: 0.875rem;
}

.font-semibold {
    font-weight: 600;
}

.text-green-700 {
    color: #15803d;
}

.text-gray-500 {
    color: #6b7280;
}

.text-gray-600 {
    color: #4b5563;
}

.text-red-500 {
    color: #ef4444;
}

.bg-green-50 {
    background-color: #f0fdf4;
}

.rounded {
    border-radius: 0.375rem;
}

.block {
    display: block;
}

/* Estilos para lista de resultados */
.lista-resultados {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.item-resultado {
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s ease;
    cursor: pointer;
}

.item-resultado:last-child {
    border-bottom: none;
}

.item-resultado:hover {
    background-color: #f8f9fa;
}

.item-contenido {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    gap: 16px;
}

.item-principal {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
}

.icono-institucion {
    color: #4CAF50;
    flex-shrink: 0;
}

.item-info {
    flex: 1;
    min-width: 0;
}

.institucion-nombre {
    font-weight: 600;
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.institucion-ciudad {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #6b7280;
}

.institucion-ruc {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #4b5563;
    margin-top: 3px;
}

.resumen-financiero-busqueda {
    display: grid;
    grid-template-columns: repeat(3, minmax(120px, 1fr));
    gap: 8px;
    background: #ffffff;
    border: 1px solid #dbeafe;
    border-radius: 6px;
    padding: 8px;
}

.item-facturacion {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
}

.facturacion-info {
    display: flex;
    align-items: center;
    font-size: 11px;
    color: #4b5563;
    white-space: nowrap;
}

.sin-facturacion {
    display: flex;
    align-items: center;
    font-size: 11px;
    color: #ef4444;
}

.item-accion {
    flex-shrink: 0;
}

.icono-seleccionar {
    color: #4CAF50;
    transition: transform 0.2s ease;
}

.item-resultado:hover .icono-seleccionar {
    transform: scale(1.2);
}

.sin-resultados {
    text-align: center;
    padding: 40px 20px;
    color: #9ca3af;
}

.sin-resultados p {
    margin: 0;
    font-size: 14px;
}

.w-full {
    width: 100%;
}

.mr-1 {
    margin-right: 0.25rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mb-3 {
    margin-bottom: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
    .item-contenido {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
    
    .item-principal {
        width: 100%;
    }
    
    .item-facturacion {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
    }

    .resumen-financiero-busqueda {
        grid-template-columns: 1fr;
    }
    
    .item-accion {
        width: 100%;
        text-align: center;
    }
}
</style>