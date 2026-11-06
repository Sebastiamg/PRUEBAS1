<template>
    <vs-popup 
        class="popup-busqueda" 
        title="Buscar Cliente en Perseo" 
        :active.sync="popupBusqueda"
        @close="cerrarBusqueda"
    >
        <div v-if="popupBusqueda">
            <!-- Campo de búsqueda -->
            <vx-card class="mb-4">
                <template slot="header">
                    <h4>Buscar Cliente en Perseo</h4>
                </template>
                
                <!-- Selector de tipo de búsqueda -->
                <div class="mb-3">
                    <label class="font-semibold mb-2 block">Tipo de Búsqueda:</label>
                    <div class="flex gap-4">
                        <vs-radio v-model="busqueda.tipoBusqueda" vs-value="identificacion" color="primary">
                            <feather-icon icon="CreditCardIcon" size="14" class="mr-1"></feather-icon>
                            CI / RUC
                        </vs-radio>
                        <vs-radio v-model="busqueda.tipoBusqueda" vs-value="contenido" color="primary">
                            <feather-icon icon="UserIcon" size="14" class="mr-1"></feather-icon>
                            Nombre / Razón Social
                        </vs-radio>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <vs-input 
                        ref="inputBusqueda"
                        v-model="busqueda.texto" 
                        @keypress.enter="buscarClientePerseo" 
                        @input="busqueda.tipoBusqueda === 'identificacion' ? validarNumero() : null"
                        class="flex-1" 
                        :placeholder="busqueda.tipoBusqueda === 'identificacion' 
                            ? 'Ingrese la cédula (10 dígitos) o RUC (13 dígitos) completo' 
                            : 'Ingrese el nombre o razón social del cliente (mínimo 3 caracteres)'"
                    />
                    <vs-button 
                        color="primary" 
                        @click="buscarClientePerseo"
                        :disabled="!validarLongitud()"
                    >
                        Buscar
                    </vs-button>
                </div>
                <small class="block mt-1" :class="validarLongitud() ? 'text-gray-500' : 'text-red-500'">
                    {{ obtenerMensajeValidacion() }}
                </small>
            </vx-card>

            <!-- Resultados de búsqueda -->
            <vx-card v-if="arrayClientes.length > 0" class="mb-4">
                <template slot="header">
                    <div class="flex justify-between items-center">
                        <h4>Resultados de Búsqueda</h4>
                        <vs-chip color="primary">{{ resultadosFiltrados.length }} de {{ arrayClientes.length }}</vs-chip>
                    </div>
                </template>
                
                <!-- Buscador interno -->
                <div class="mb-3">
                    <vs-input 
                        v-model="filtroInterno" 
                        placeholder="Filtrar resultados por nombre, identificación o email..."
                        class="w-full"
                        icon-pack="feather"
                        icon="icon-search"
                    />
                </div>
                
                <!-- Lista de resultados -->
                <div class="lista-resultados">
                    <div 
                        v-for="(cliente, index) in resultadosFiltrados" 
                        :key="index"
                        class="item-resultado"
                        @click="seleccionarDirecto(cliente)"
                    >
                        <div class="item-contenido">
                            <div class="item-principal">
                                <feather-icon icon="UserIcon" size="18" class="icono-cliente"></feather-icon>
                                <div class="item-info">
                                    <div class="cliente-nombre">{{ cliente.razonsocial }}</div>
                                    <div class="cliente-detalles">
                                        <span class="detalle-item">
                                            <feather-icon icon="CreditCardIcon" size="12" class="mr-1"></feather-icon>
                                            {{ cliente.identificacion }}
                                        </span>
                                        <span v-if="cliente.email" class="detalle-item">
                                            <feather-icon icon="MailIcon" size="12" class="mr-1"></feather-icon>
                                            {{ cliente.email }}
                                        </span>
                                        <span v-else class="detalle-item sin-email">
                                            <feather-icon icon="MailIcon" size="12" class="mr-1"></feather-icon>
                                            Sin email
                                        </span>
                                    </div>
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

            <!-- Cliente seleccionado -->
            <vx-card v-if="clienteSeleccionado.nombre" class="mb-4">
                <template slot="header">
                    <h4>✓ Cliente Seleccionado</h4>
                </template>
                
                <div class="bg-blue-50 p-3 rounded">
                    <div class="font-semibold text-blue-700">{{ clienteSeleccionado.nombre }}</div>
                    <div class="text-sm text-gray-600">{{ clienteSeleccionado.cedula }}</div>
                    <div v-if="clienteSeleccionado.email" class="text-sm text-gray-600">{{ clienteSeleccionado.email }}</div>
                </div>
            </vx-card>

            <!-- Botones de acción -->
            <div class="flex justify-center gap-4 mt-6">
                <vs-button 
                    v-if="clienteSeleccionado.nombre"
                    color="success" 
                    @click="confirmarSeleccion"
                >
                    Confirmar Selección
                </vs-button>
                <vs-button color="danger" type="border" @click="cerrarBusqueda">
                    Cancelar
                </vs-button>
            </div>
        </div>
    </vs-popup>
</template>

<script>
export default {
    name: 'BusquedaClientePerseo',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        empresa: {
            type: [Object, Number],
            default: null
        }
    },
    data() {
        return {
            popupBusqueda: this.visible,
            usuario: localStorage.usuario ? JSON.parse(localStorage.usuario) : {},
            busqueda: {
                tipoBusqueda: 'identificacion', // 'identificacion' o 'contenido'
                texto: ''
            },
            filtroInterno: '', // Filtro para buscar dentro de los resultados
            arrayClientes: [],
            clienteSeleccionado: {
                idusuario: '',
                nombre: '',
                cedula: '',
                email: '',
                clientesidPerseo: 0
            },
            objetoClienteSeleccionado: {
                identificacion: '',
                razonsocial: '',
                email: '',
                clientesid: 0
            }
        }
    },
    computed: {
        resultadosFiltrados() {
            if (!this.filtroInterno || this.filtroInterno.trim() === '') {
                return this.arrayClientes;
            }
            
            const filtro = this.filtroInterno.toLowerCase().trim();
            return this.arrayClientes.filter(cliente => {
                const nombre = (cliente.razonsocial || '').toLowerCase();
                const identificacion = (cliente.identificacion || '').toLowerCase();
                const email = (cliente.email || '').toLowerCase();
                
                return nombre.includes(filtro) || 
                       identificacion.includes(filtro) || 
                       email.includes(filtro);
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
        },
        // Limpiar resultados cuando cambia el tipo de búsqueda
        'busqueda.tipoBusqueda'(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.busqueda.texto = '';
                this.arrayClientes = [];
            }
        },
        // Limpiar resultados cuando se modifica o limpia el texto de búsqueda
        'busqueda.texto'(newVal) {
            if (!newVal || newVal.trim() === '') {
                this.arrayClientes = [];
            }
        }
    },
    methods: {
        resetearBusqueda() {
            this.busqueda.tipoBusqueda = 'identificacion';
            this.busqueda.texto = '';
            this.filtroInterno = '';
            this.arrayClientes = [];
            this.clienteSeleccionado = {
                idusuario: '',
                nombre: '',
                cedula: '',
                email: '',
                clientesidPerseo: 0
            };
            this.objetoClienteSeleccionado = {
                identificacion: '',
                razonsocial: '',
                email: '',
                clientesid: 0
            };
        },
        
        validarNumero() {
            // Solo validar números si la búsqueda es por identificación
            if (this.busqueda.tipoBusqueda === 'identificacion') {
                // Reemplaza cualquier carácter que no sea un número
                this.busqueda.texto = this.busqueda.texto.replace(/\D/g, '');
                // Limita el valor a 13 caracteres (para RUC)
                if (this.busqueda.texto.length > 13) {
                    this.busqueda.texto = this.busqueda.texto.slice(0, 13);
                }
            }
        },
        
        validarLongitud() {
            if (this.busqueda.tipoBusqueda === 'identificacion') {
                // Para CI/RUC: debe tener entre 10 y 13 caracteres
                const longitud = this.busqueda.texto.length;
                return longitud >= 10 && longitud <= 13;
            } else {
                // Para nombre: mínimo 3 caracteres
                return this.busqueda.texto.length >= 3;
            }
        },
        
        obtenerMensajeValidacion() {
            if (this.busqueda.tipoBusqueda === 'identificacion') {
                const longitud = this.busqueda.texto.length;
                if (longitud === 0) {
                    return 'Ingrese la cédula (10 dígitos) o RUC (13 dígitos) completo';
                } else if (longitud < 10) {
                    return `Faltan ${10 - longitud} dígito(s). Cédula: 10 dígitos, RUC: 13 dígitos`;
                } else if (longitud === 10) {
                    return '✓ Cédula completa (10 dígitos) - Puede buscar';
                } else if (longitud > 10 && longitud < 13) {
                    return `Faltan ${13 - longitud} dígito(s) para RUC completo`;
                } else if (longitud === 13) {
                    return '✓ RUC completo (13 dígitos) - Puede buscar';
                }
            } else {
                const longitud = this.busqueda.texto.length;
                if (longitud === 0) {
                    return 'Ingrese el nombre o razón social del cliente';
                } else if (longitud < 3) {
                    return `Faltan ${3 - longitud} caracter(es). Mínimo 3 caracteres requeridos`;
                } else {
                    return `✓ ${longitud} caracteres - Puede buscar por nombre o razón social`;
                }
            }
            return '';
        },
        
        buscarClientePerseo() {
            // Validar según el tipo de búsqueda
            if (!this.validarLongitud()) {
                let mensaje = '';
                if (this.busqueda.tipoBusqueda === 'identificacion') {
                    mensaje = 'Debe ingresar la cédula completa (10 dígitos) o RUC completo (13 dígitos)';
                } else {
                    mensaje = 'Debe ingresar al menos 3 caracteres para buscar por nombre';
                }
                
                this.$vs.notify({
                    title: 'Error de Validación',
                    text: mensaje,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }
            
            const formData = new FormData();
            
            // Enviar el parámetro correcto según el tipo de búsqueda seleccionado
            if (this.busqueda.tipoBusqueda === 'identificacion') {
                formData.append("identificacion", this.busqueda.texto);
            } else {
                formData.append("contenido", this.busqueda.texto);
            }
            
            formData.append("empresa", this.empresa && this.empresa.id ? this.empresa.id : this.empresa);
            
            this.$vs.loading();
            this.$http.post(this.$server_url + "api/perseo/clientes/clientes_consulta", formData)
                .then(res => {
                    this.$vs.loading.close();
                    
                    if (!res.data) {
                        this.$vs.notify({
                            text: this.busqueda.tipoBusqueda === 'identificacion' 
                                ? 'No se encontró esta cédula o RUC en Perseo.'
                                : 'No se encontró este nombre en Perseo.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        return;
                    }
                    
                    if (res.data.fault) {
                        this.$vs.notify({
                            text: res.data.fault.faultstring,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        return;
                    }
                    
                    this.arrayClientes = res.data.clientes || [];
                    
                    if (this.arrayClientes.length === 0) {
                        this.$vs.notify({
                            title: 'Sin resultados',
                            text: `No se encontraron clientes con ${this.busqueda.tipoBusqueda === 'identificacion' ? 'esa identificación' : 'ese nombre'} en Perseo`,
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
                        text: "Error al buscar los datos en Perseo",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        
        seleccionarDirecto(cliente) {
            // Selección directa - procesa y cierra automáticamente
            this.objetoClienteSeleccionado = {
                identificacion: cliente.identificacion,
                razonsocial: cliente.razonsocial,
                email: cliente.email || '',
                clientesid: cliente.clientesid || 0
            };
            
            // Verificar si el cliente ya existe en el sistema local
            const url = `pedidos2/pedidos?getDatosClient=1&busqueda=${cliente.identificacion}`;
            
            this.$vs.loading();
            this.$http.get(this.$server_url + url)
                .then(res => {
                    this.$vs.loading.close();
                    
                    if (res.data === 0 || !res.data || res.data.length === 0) {
                        // Cliente no existe, crear uno nuevo
                        this.crearUsuarioDirecto();
                    } else {
                        // Cliente existe, enviar datos y cerrar
                        this.enviarYCerrar(res.data[0]);
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al verificar el cliente',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        seleccionarCliente(cliente) {
            this.objetoClienteSeleccionado = {
                identificacion: cliente.identificacion,
                razonsocial: cliente.razonsocial,
                email: cliente.email || '',
                clientesid: cliente.clientesid || 0
            };
            
            // Verificar si el cliente ya existe en el sistema local
            const url = `pedidos2/pedidos?getDatosClient=1&busqueda=${cliente.identificacion}`;
            
            this.$vs.loading();
            this.$http.get(this.$server_url + url)
                .then(res => {
                    this.$vs.loading.close();
                    
                    if (res.data === 0 || !res.data || res.data.length === 0) {
                        // Cliente no existe, crear uno nuevo
                        this.crearUsuario();
                    } else {
                        // Cliente existe, usar datos existentes
                        this.asignarCliente(res.data[0]);
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al verificar los datos del cliente',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
            
            // Limpiar tabla de resultados
            this.arrayClientes = [];
        },
        
        crearUsuario() {
            const completo = this.objetoClienteSeleccionado.razonsocial.trim();
            const palabras = completo.split(/\s+/);
            
            let nombres = '';
            let apellidos = '';
            
            if (palabras.length >= 3) {
                apellidos = palabras.slice(0, 2).join(' ');
                nombres = palabras.slice(2).join(' ');
            } else if (palabras.length === 2) {
                apellidos = palabras[0];
                nombres = palabras[1];
            } else if (palabras.length === 1) {
                apellidos = palabras[0];
                nombres = palabras[0];
            } else {
                apellidos = completo;
                nombres = completo;
            }
            
            const formData = new FormData();
            formData.append('crearUsuario', 1);
            formData.append('cedula', this.objetoClienteSeleccionado.identificacion);
            formData.append('nombres', nombres);
            formData.append('apellidos', apellidos);
            formData.append('email', this.objetoClienteSeleccionado.email);
            formData.append('id_grupo', 33);
            formData.append('institucion', 66);
            formData.append('user_created', this.usuario.idusuario);
            formData.append('telefono', 0);
            
            this.$vs.loading();
            this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
                .then(res => {
                    this.$vs.loading.close();
                    this.asignarCliente(res.data[0]);
                })
                .catch(error => {
                    console.error(error);
                    this.$vs.loading.close();
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al crear el usuario',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        asignarCliente(datosCliente) {
            this.clienteSeleccionado = {
                idusuario: datosCliente.idusuario,
                nombre: datosCliente.usuario,
                cedula: datosCliente.cedula,
                email: datosCliente.email,
                clientesidPerseo: this.objetoClienteSeleccionado.clientesid
            };
        },
        
        // Métodos para selección directa
        crearUsuarioDirecto() {
            // const datos = {
            //     cedula: this.objetoClienteSeleccionado.identificacion,
            //     usuario: this.objetoClienteSeleccionado.razonsocial,
            //     email: this.objetoClienteSeleccionado.email,
            //     nombres: this.objetoClienteSeleccionado.razonsocial,
            //     apellidos: '',
            //     idusuario_creador_usuarios: this.usuario.idusuario,
            //     empresa: this.empresa,
            //     clientesidPerseo: this.objetoClienteSeleccionado.clientesid
            // };
            
            let me = this
            let completo = me.objetoClienteSeleccionado.razonsocial.trim();
            let palabras = completo.split(/\s+/);

            let nombres = '';
            let apellidos = '';

            if (palabras.length >= 3) {
                // Caso de más de 2 apellidos y nombres
                apellidos = palabras.slice(0, 2).join(' ');
                nombres = palabras.slice(2).join(' ');
            } else if (palabras.length === 2) {
                // Caso de 1 apellido y 1 nombre
                apellidos = palabras[0];
                nombres = palabras[1];
            } else if (palabras.length === 1) {
                // Caso de solo nombre o empresa
                apellidos = palabras[0];
                nombres = palabras[0];
            } else {
                apellidos = completo;
                nombres = completo;
            }

            me.objetoClienteSeleccionado.apellidos = apellidos;
            me.objetoClienteSeleccionado.nombres = nombres;

            // 🔹 Limpiar emails pero conservar todos
            let emailRaw = me.objetoClienteSeleccionado.email || '';
            let emailList = emailRaw
                .split(/[\r\n,;]+/)   // separar por salto de línea, coma o punto y coma
                .map(e => e.trim())
                .filter(e => e !== '');

            // 🔹 Volver a unirlos con coma o punto y coma (como prefieras)
            let emailsFinal = emailList.join('; ');

            let formData = new FormData();
            formData.append('crearUsuario', 1);
            formData.append('cedula', me.objetoClienteSeleccionado.identificacion);
            formData.append('nombres', me.objetoClienteSeleccionado.nombres);
            formData.append('apellidos', me.objetoClienteSeleccionado.apellidos);
            formData.append('email', emailsFinal); // ✅ todos los emails
            formData.append('id_grupo', 33);
            formData.append('institucion', 66);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('telefono', 0);

            me.$vs.loading();
            this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
                .then(res => {
                    me.$vs.loading.close();
                    
                    // Verificar que res.data tenga datos
                    if (!res.data || !res.data[0]) {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se pudo crear el usuario correctamente',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        return;
                    }
                    
                    // Llamar a enviarYCerrar con los datos del usuario creado
                    me.enviarYCerrar(res.data[0]);
                })
                .catch(error => {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al guardar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        enviarYCerrar(datosCliente) {
            const clienteSeleccionado = {
                idusuario: datosCliente.idusuario,
                nombre: datosCliente.usuario,
                cedula: datosCliente.cedula,
                email: datosCliente.email,
                clientesidPerseo: this.objetoClienteSeleccionado.clientesid
            };
            
            // Enviar datos y cerrar popup directamente
            this.$emit('cliente-seleccionado', clienteSeleccionado);
            this.cerrarBusqueda();
        },
        
        confirmarSeleccion() {
            this.$emit('cliente-seleccionado', this.clienteSeleccionado);
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
/* Estilos para el popup de búsqueda */
.popup-busqueda {
    z-index: 51005;
}

.popup-busqueda .vs-popup {
    padding: 20px;
    max-width: 800px;
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

.mt-6 {
    margin-top: 1.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.p-3 {
    padding: 0.75rem;
}

.text-sm {
    font-size: 0.875rem;
}

.font-semibold {
    font-weight: 600;
}

.text-blue-700 {
    color: #1d4ed8;
}

.text-gray-500 {
    color: #6b7280;
}

.text-red-500 {
    color: #ef4444;
}

.text-gray-600 {
    color: #4b5563;
}

.bg-blue-50 {
    background-color: #eff6ff;
}

.rounded {
    border-radius: 0.375rem;
}

.block {
    display: block;
}

.font-semibold {
    font-weight: 600;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mb-3 {
    margin-bottom: 0.75rem;
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

.icono-cliente {
    color: #2196F3;
    flex-shrink: 0;
}

.item-info {
    flex: 1;
    min-width: 0;
}

.cliente-nombre {
    font-weight: 600;
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cliente-detalles {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detalle-item {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #6b7280;
}

.sin-email {
    color: #9ca3af;
    font-style: italic;
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
    
    .item-accion {
        width: 100%;
        text-align: center;
    }
}
</style>