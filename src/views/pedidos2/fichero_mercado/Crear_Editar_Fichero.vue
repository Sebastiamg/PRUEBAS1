<template>
<div class="contenedor-fichero">
    <div class="seccion">
        <!-- Periodo escolar -->
        <div class="periodo-centro" :class="{ 'night-periodo-centro': themeMode }">
            <span class="valor-periodo" :class="{ 'night-valor-periodo': themeMode }">
                📅 PERÍODO:
            </span>
            <span class="label-periodo" :class="{ 'night-label-periodo': themeMode }">
                {{ ficheroData.periodoEscolar }}
            </span>
        </div>
        <!-- {{institucionSeleccionada}} -->
        <div class="titulo-seccion-boton">
            <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">
                📌 Datos del Establecimiento
            </h3>
            <vs-button line-origin="left" :color="themeMode ? 'success' : 'success'" type="line" icon-pack="feather" icon="icon-edit" @click="get_editarDatosInstitucion()" class="night-vs-button">
                Editar
            </vs-button>
        </div>

        <div class="grid-datos" :class="{ 'night-bg': themeMode }">
            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Nombre</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.nombre }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Período</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.periodoEscolar }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Provincia</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.nombreprovincia }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Ciudad o Cantón</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.nombre_ciudad }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Parroquia</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.parr_nombre }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Dirección</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.direccion }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Teléfono</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.telefono }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Correo</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.correo }}</span>
            </div>
            <!-- {{ ficheroData }} -->
            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Tipo de Institución(Sostenimiento)</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.tipo_Institucion }}</span>
            </div>

            <!-- <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Forma de Comercialización</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">
                    <span v-if="ficheroData.forma_Comercializacion == 1">Punto de Venta o Librería</span>
                    <span v-else-if="ficheroData.forma_Comercializacion == 0">Plantel</span>
                </span>
            </div> -->

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Asesor Comercial</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.asesor_nombres }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Fecha de Fundación</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.fecha_fundacion ? ficheroData.fecha_fundacion.split(' ')[0] : 'No registrada' }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Fecha Muestreo</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">{{ ficheroData.fechaMuestreo }}</span>
            </div>

            <div class="card-dato" :class="{ 'night-card': themeMode }">
                <span class="label" :class="{ 'night-text-label': themeMode }">Fecha Definición</span>
                <span class="valor" :class="{ 'night-text-valor': themeMode }">
                    {{
                        (() => {
                            try {
                                return JSON.parse(ficheroData.info_aprobacion).fecha_aprobacion || 'Aún no aprobada';
                            } catch (e) {
                                return 'Aún no aprobada';
                            }
                        })()
                    }}
                    <!-- {{ ficheroData.fechaDefinicion ? ficheroData.fechaDefinicion : 'Aún no aprobada' }} -->
                </span>
            </div>
        </div>

    </div>
    <!-- Trabaja con prolipa -->
    <div class="seccion">
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">
            🏢 Datos comerciales de la institución o punto de venta
        </h3>
        <div class="flex flex-col gap-4 p-4 rounded-lg" :class="themeMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'">
            <!-- BLOQUE SUPERIOR: CONFIGURACIÓN Y RELACIÓN (Grid 2 columnas) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Columna Izquierda: Configuración Básica -->
                <div class="flex flex-col gap-4">
                    <div class="p-4 rounded-xl border transition-all duration-300 h-full" :class="themeMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-300 bg-white hover:shadow-md'">
                        <div class="flex items-center gap-2 mb-4 pb-2 border-b" :class="themeMode ? 'border-gray-700' : 'border-gray-100'">
                            <ion-icon name="settings-outline" class="text-xl text-primary"></ion-icon>
                            <span class="font-bold text-lg">Configuración General</span>
                        </div>
                        <!-- Es Distribuidor -->
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center gap-2">
                                <ion-icon name="ribbon-outline" class="text-success text-xl"></ion-icon>
                                <span class="font-medium">¿Es Distribuidor?</span>
                            </div>
                            <vs-switch v-model="ficheroData.fm_es_distribuidor" color="success">
                                <span slot="on">Sí</span>
                                <span slot="off">No</span>
                            </vs-switch>
                        </div>
                        <!-- Tipo de Venta -->
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <ion-icon name="cart-outline" class="text-primary text-xl"></ion-icon>
                                <span class="font-medium">Tipo de venta</span>
                            </div>
                            <v-select :options="tipos_venta" :reduce="tipo => tipo.id_tipo" label="tipo_venta" v-model="ficheroData.fm_tipo_venta" class="w-full" placeholder="Seleccione el tipo de venta" ref="fm_tipo_venta" :class="classvalidar_fm_tipo_venta" />
                        </div>
                    </div>
                </div>
                <!-- Columna Derecha: Relación con Prolipa -->
                <div class="flex flex-col gap-4">
                    <div class="p-4 rounded-xl border transition-all duration-300 h-full" :class="themeMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-300 bg-white hover:shadow-md'">
                        <div class="flex items-center justify-between mb-4 pb-2 border-b" :class="themeMode ? 'border-gray-700' : 'border-gray-100'">
                            <div class="flex items-center gap-2">
                                <ion-icon name="briefcase-outline" class="text-xl text-success"></ion-icon>
                                <span class="font-bold text-lg">Trabaja con Prolipa</span>
                            </div>
                            <vs-switch v-model="ficheroData.trabaja_con_prolipa" color="success" @input="Switch_Trabaja_con_prolipa()">
                                <span slot="on">Sí</span>
                                <span slot="off">No</span>
                            </vs-switch>
                        </div>
                        <transition name="fade">
                            <div v-if="ficheroData.trabaja_con_prolipa" class="flex flex-col gap-4">
                                <!-- Convenio -->
                                <div class="flex items-center justify-between p-2 rounded-lg" :class="themeMode ? 'bg-gray-800/50' : 'bg-gray-50'">
                                    <span class="font-medium">Tiene convenio</span>
                                    <vs-switch v-model="ficheroData.fm_convenio" color="primary">
                                        <span slot="on">Sí</span>
                                        <span slot="off">No</span>
                                    </vs-switch>
                                </div>
                                <!-- Años -->
                                <div class="flex items-center justify-between p-2 rounded-lg" :class="themeMode ? 'bg-gray-800/50' : 'bg-gray-50'">
                                    <span class="font-medium">Años trabajando</span>
                                    <vs-input-number v-model="ficheroData.fm_cantidad_anios_trabaja_con_prolipa" min="0" class="w-20" />
                                </div>
                            </div>
                            <div v-else class="flex flex-col items-center justify-center h-24 text-gray-400 italic">
                                <ion-icon name="close-circle-outline" class="text-3xl mb-1 opacity-20"></ion-icon>
                                <span>No trabaja con Prolipa actualmente</span>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <!-- BLOQUE INFERIOR: ESTABLECIMIENTOS PARA DESPACHO -->
            <div class="mt-2 p-4 rounded-xl border" :class="themeMode ? 'border-gray-700 bg-gray-900/20' : 'border-gray-300 bg-white/50'">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-center sm:text-left items-center mb-4">
                    <div class="flex items-center gap-2">
                        <ion-icon name="bus-outline" class="text-xl text-warning"></ion-icon>
                        <span class="font-bold text-lg">Establecimiento/s para despacho</span>
                        <span v-if="ficheroData.fm_establecimientos_para_despacho && ficheroData.fm_establecimientos_para_despacho.length > 0" class="ml-2 inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                            ({{ ficheroData.fm_establecimientos_para_despacho.length }})
                        </span>
                    </div>
                    <vs-button line-origin="left" color="success" type="line" icon-pack="feather" icon="icon-plus" @click="get_EstablecimientoParaDespacho()">
                        Agregar Establecimiento
                    </vs-button>
                </div>
                <!-- Lista de establecimientos -->
                <div v-if="ficheroData.fm_establecimientos_para_despacho && ficheroData.fm_establecimientos_para_despacho.length > 0">
                    <div class="despacho-instituciones-grid">
                        <div v-for="(inst, idx) in ficheroData.fm_establecimientos_para_despacho" :key="inst.idInstitucion || idx" class="despacho-card-item" :class="themeMode ? 'despacho-card-dark' : 'despacho-card-light'">
                            <div class="despacho-card-body">
                                <div class="despacho-card-badge" :class="inst.punto_venta == 1 ? 'badge-pv' : 'badge-inst'">
                                    {{ inst.punto_venta == 1 ? 'Punto de Venta' : 'Institución' }}
                                </div>
                                <div class="despacho-card-nombre" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                    {{ inst.nombreInstitucion }}
                                </div>
                                <div v-if="inst.nombre" class="despacho-card-ciudad" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                                    <i class="feather icon-map-pin"></i> {{ inst.nombre }}
                                </div>
                            </div>
                            <vx-tooltip text="Eliminar establecimiento" position="top" color="danger">
                                <vs-button size="small" color="danger" type="flat" icon-pack="feather" icon="icon-trash-2" @click="eliminarInstitucionDespacho(idx)" />
                            </vx-tooltip>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-6 border-2 border-dashed rounded-xl" :class="themeMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'">
                    <ion-icon name="trail-sign-outline" class="text-4xl mb-2 opacity-20"></ion-icon>
                    <p>Ningún establecimiento de despacho seleccionado</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Logo -->
    <div class="seccion">
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">🖼️ Logo para el Fichero</h3>
        <!-- Botón agregar -->
        <div class="flex flex-col gap-4 p-4 rounded-lg" :class="themeMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-center sm:text-left items-center">
                <v-select :options="ArrayEmpresas" :reduce="ArrayEmpresas => ArrayEmpresas.id" label="descripcion_corta" class="w-full h-100" placeholder="--Seleccione una empresa--" v-model="ficheroData.id_logo_empresa" />
            </div>
        </div>
    </div>
    <!-- {{ institucionSeleccionada }} -->
    <!-- {{ periodoSeleccionado }} -->
    <!-- Correo y Comercialización -->
    <div class="seccion">
        <!-- Título y botón de agregar -->
        <div class="flex justify-between items-center mb-4">
            <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">📊 Factores que inciden en la compra</h3>
        </div>
        <!-- Popup para agregar factor -->
        <vs-popup :active.sync="popupAgregar" title="Agregar nuevo factor" color="primary">
            <div class="flex space-x-2 items-center">
                <vs-input v-model="NuevoFactorIncideCompra" label="Descripción" placeholder="Ingrese el factor" class="w-full" icon="mode_edit" />
                <vs-button type="filled" color="success" @click="confirmarAgregarFactor">
                    Agregar
                </vs-button>
            </div>
        </vs-popup>
        <!-- Factores por defecto -->
        <div class="mb-3">
            <span class="font-medium text-lg"><b>Factores por defecto:</b></span>
            <div class="flex flex-wrap gap-4">
                <label class="flex items-center space-x-1">
                    <vs-checkbox v-model="ficheroData.factores_inciden_compra.precio" />
                    <span>Precio</span>
                </label>
                <label class="flex items-center space-x-1">
                    <vs-checkbox v-model="ficheroData.factores_inciden_compra.contenido" />
                    <span>Contenido</span>
                </label>
                <label class="flex items-center space-x-1">
                    <vs-checkbox v-model="ficheroData.factores_inciden_compra.pedagogia" />
                    <span>Pedagogía</span>
                </label>
                <label class="flex items-center space-x-1">
                    <vs-checkbox v-model="ficheroData.factores_inciden_compra.servicios" />
                    <span>Servicios</span>
                </label>
                <vs-button line-origin="left" color="success" type="line" @click="popupAgregar = true">
                    Agregar factor
                </vs-button>
            </div>
        </div>
        <!-- Factores agregados por usuario -->
        <div v-if="ficheroData.factores_inciden_compra_extra.length">
            <span class="font-medium text-lg"><b>Factores agregados por el usuario:</b></span>
            <div class="flex flex-wrap gap-4">
                <label v-for="(item, index) in ficheroData.factores_inciden_compra_extra" :key="index" class="flex items-center space-x-1">
                    <vs-checkbox v-model="item.checked" />
                    <span>{{ item.nombre }}</span>
                </label>
            </div>
        </div>
    </div>
    <!-- Fecha Entrega Muestras -->
    <div class="seccion">
        <!-- Título visible siempre -->
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">📅 Planificación Institucional</h3>
        <!-- Collapse solo para los detalles -->
        <details class="collapse-box" :class="{ 'night-collapse-box': themeMode }">
            <summary class="collapse-header" :class="{ 'night-collapse-header': themeMode }">
                <div class="flex items-center justify-between w-full">
                    <div>
                        <small class="subtitulo" :class="{ 'night-subtitulo': themeMode }">
                            (Datos obtenidos de tus planificaciones semanales)
                        </small>
                    </div>
                    <!-- Flecha SVG personalizada -->
                    <svg class="flecha" :class="{ 'night-flecha': themeMode }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </summary>
            <div class="collapse-content" :class="{ 'night-collapse-content': themeMode }">
                <div class="filtro-opciones" style="margin-bottom: 10px;" v-if="array_Entrega_Muestras.length > 0">
                    <label><b>Filtrar por acción planificada:</b></label>
                    <v-select :options="array_Opcioones_Planificacion" label="opcion" class="w-full h-100" placeholder="-- Todas --" v-model="filtro_opcion" @input="filtrarEntregas" :clearable="true" />
                </div>
                <vs-divider v-if="array_Entrega_Muestras.length > 0">Planificaciones: {{array_Entrega_Muestras_filtrado.length}}</vs-divider>
                <table class="personal-plantel-table" :class="{ 'night-personal-plantel-table': themeMode }">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Acciones planificadas</th>
                            <th>Fechas y Usuarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(entrega, index) in array_Entrega_Muestras_filtrado" :key="entrega.id">
                            <td>{{ entrega.title }}</td>
                            <td>
                                <span v-if="entrega.opciones_seleccionadas && entrega.opciones_seleccionadas.length">
                                    {{ entrega.opciones_seleccionadas }}
                                </span>
                                <span v-else>
                                    ---
                                </span>
                            </td>
                            <td>
                                <span>
                                    <b>Fecha y usuario de creación:</b>
                                    {{ entrega.created_at ? entrega.created_at.split(' ')[0] : '---' }}
                                    <span v-if="entrega.us_create_planificacion">
                                        ({{ entrega.us_create_planificacion }})
                                    </span>
                                </span>
                                <br />
                                <span>
                                    <b>Fecha seleccionada de la planificación:</b>
                                    {{ entrega.startDate ? entrega.startDate.split(' ')[0] : '---' }}
                                    <span v-if="entrega.hora_inicio && entrega.hora_fin">
                                        ({{ entrega.hora_inicio }} - {{ entrega.hora_fin }})
                                    </span>
                                </span>
                                <br />
                                <span>
                                    <b>Fecha que visitó:</b>
                                    {{ entrega.fecha_que_visita ? entrega.fecha_que_visita.split(' ')[0] : '---' }}
                                </span>
                                <br />
                                <span>
                                    <b>Fecha y usuario de finalización:</b>
                                    {{ entrega.fecha_captura_longitud_fin ? entrega.fecha_captura_longitud_fin.split(' ')[0] : '---' }}
                                    <span v-if="entrega.us_finalizo_planificacion">
                                        ({{ entrega.us_finalizo_planificacion }})
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr v-if="array_Entrega_Muestras.length === 0">
                            <td colspan="8" class="no-usuarios-text" :class="{ 'night-no-usuarios-text': themeMode }">
                                Aún no existen planificaciones. Regístrelas en el módulo de planificaciones para que se muestren aquí.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </details>
    </div>
    <!-- Personal del Plantel -->
    <div class="seccion">
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">👥 Personal del Plantel</h3>
        <div align="center" class="mb-4">
            <vs-button line-origin="left" color="success" type="line" @click="get_DecidelaCompra()">
                Agregar Personal del Plantel
            </vs-button>
        </div>
        <div class="tabla-scroll">
            <table class="personal-plantel-table" :class="{ 'night-personal-plantel-table': themeMode }">
                <thead>
                    <tr>
                        <th width="300">Cargo</th>
                        <th>Información del Usuario</th>
                        <th>Decide la compra</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <!-- {{ficheroData.personalPlantel}} -->
                <tbody>
                    <!-- Si hay usuarios -->
                    <tr v-for="(usuario, index) in ficheroData.personalPlantel" :key="index">
                        <td>
                            <!-- <vs-input v-model="usuario.fma_cargo" placeholder="Ingrese el cargo" class="cargo-input" :ref="`parametrofma_cargo_${index}`" :class="usuario.classValidarCargo" /> -->
                            <v-select :options="Array_Cargos_Autoridades" :reduce="Array_Cargos_Autoridades => Array_Cargos_Autoridades.ina_id" label="ina_nombre" class="w-full h-100" placeholder="--Seleccione un cargo--" v-model="usuario.fma_cargo" :ref="`parametrofma_cargo_${index}`" :class="usuario.classValidarCargo" @input="onInputCargo_Autoridades()" />
                        </td>
                        <td>
                            <div>
                                <font style="font-weight: bold;">Nombres y Apellidos:</font> {{ usuario.nombre }}
                            </div>
                            <!-- <div><b>Cédula:</b> {{ usuario.cedula }}</div> -->
                            <div>
                                <font style="font-weight: bold;">Cédula/RUC: </font>
                                <span v-if="usuario.cedula">{{ usuario.cedula }}</span>
                                <span v-else class="text-gray-500 italic text-danger">(Sin registro)</span>
                            </div>
                            <div>
                                <font style="font-weight: bold;">Teléfono:</font> {{ usuario.telefono || '---' }}
                            </div>
                            <div>
                                <font style="font-weight: bold;">Correo:</font> {{ usuario.email || '---' }}
                            </div>
                            <div>
                                <font style="font-weight: bold;">Fecha de nacimiento:</font> {{ usuario.fecha_nacimiento || '---' }}
                            </div>
                        </td>
                        <td>
                            <vs-switch v-model="usuario.decideCompra" color="primary" @input="onInput_DecideCompra()">
                                <span slot="on">Sí</span>
                                <span slot="off">No</span>
                            </vs-switch>
                        </td>
                        <td>
                            <div class="flex space-x-2">
                                <vs-button size="small" color="warning" type="border" icon-pack="feather" icon="icon-edit" @click="editarUsuarioPlantel(usuario)">
                                    Editar
                                </vs-button>
                                <vs-button size="small" color="danger" type="border" @click="onClick_Elimina_Usuario(index)">
                                    Eliminar
                                </vs-button>
                            </div>
                        </td>
                    </tr>
                    <!-- Si no hay usuarios -->
                    <tr v-if="ficheroData.personalPlantel.length === 0">
                        <td colspan="7" class="no-usuarios-text">
                            No hay usuarios asignados al plantel aún. Haz clic en "Agregar Personal del Plantel" para añadir uno.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- Número de Aulas y Estudiantes -->
    <div class="seccion">
        <div class="flex flex-wrap items-center justify-between mb-3">
            <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">🏫 Número de Aulas y Estudiantes</h3>
            <!-- Selección de Vistas -->
            <div class="flex items-center space-x-4 bg-gray-100 p-2 rounded-lg" :class="{ 'bg-gray-800 text-white': themeMode }">
                <span class="font-bold text-sm">Vista:</span>
                <div class="flex items-center space-x-3">
                    <vs-radio v-model="modoVista" vs-value="vertical">Vertical</vs-radio>
                    <vs-radio v-model="modoVista" vs-value="horizontal">Horizontal</vs-radio>
                </div>
            </div>
        </div>

        <!-- VISTA VERTICAL -->
        <div v-if="modoVista === 'vertical'">
            <div class="tabla-scroll-horizontal">
                <table class="personal-plantel-table" :class="{ 'night-personal-plantel-table': themeMode }">
                    <thead>
                        <tr>
                            <th class="text-center sticky-header" style="width: 140px;">NIVELES EDUCATIVOS</th>
                            <th class="text-center sticky-header">GRADOS</th>
                            <th class="text-center sticky-header">VALOR DE LA PENSIÓN</th>
                            <th class="text-center sticky-header"># DE AULAS Y ESTUDIANTES POR AULA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- ===================== INICIALES (grado_1 y grado_2) ===================== -->
                        <tr v-for="n in [1, 2]" :key="'iniciales-' + n">
                            <!-- NIVEL (solo en grado_1) -->
                            <td v-if="n === 1" :rowspan="2" class="border-r align-middle pr-2">
                                <vx-tooltip :text="ficheroData.Niveles_Educativos.iniciales ? 'Nivel educativo activo: Si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: No trabaja ni está disponible en la institución'" position="top">
                                    <label class="flex items-center space-x-2">
                                        <vs-checkbox v-model="ficheroData.Niveles_Educativos.iniciales" @change="onChangeNivelEducativo('iniciales')" />
                                        <span class="font-bold">INICIALES<br><small>(1–2)</small></span>
                                    </label>
                                </vx-tooltip>
                            </td>
                            <!-- GRADO -->
                            <td class="bg-gray-50 pl-4 font-medium text-center border-r align-middle pr-2">
                                {{ array_Lista_Niveles && array_Lista_Niveles[n-1] ? array_Lista_Niveles[n-1].nombrenivel : '' }}
                            </td>
                            <!-- VALOR PENSIÓN (solo en grado_1) -->
                            <td v-if="n === 1" :rowspan="2" class="border-r align-middle pr-2">
                                <vs-input placeholder="Valor Pensión Iniciales" class="w-full" ref="pension_iniciales" :class="ficheroData.valorPension.iniciales_class" v-model="ficheroData.valorPension.iniciales" @keypress="validarkey_FicheroData_Valor_Pension($event, 'iniciales')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.iniciales" @blur="onBlurValorPension('iniciales')" />
                            </td>
                            <!-- # AULAS + ESTUDIANTES -->
                            <td class="p-3 align-top bg-gray-50">
                                <div class="mb-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider"># de Aulas</div>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="w-20 fade-transition text-center font-medium" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                                    </div>
                                </div>
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="mt-3 space-y-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                                        Estudiantes por aula
                                    </div>
                                    <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="'est-' + n + '-' + i" class="flex items-center space-x-2">
                                        <!-- LABEL "Aula X:" + INPUT en misma línea -->
                                        <span class="text-xs text-gray-600 min-w-[60px] text-right font-medium">Aula {{ i }}:</span>
                                        <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-20 text-center" />
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-gray-200">
                                        <span class="text-xs font-bold text-blue-700">Total Estudiantes x aula = {{ getTotalEstudiantesPorGrado(n) }}</span>
                                    </div>
                                </div>
                                <div v-else class="text-xs text-gray-500 italic">Escribe # aulas</div>
                            </td>
                        </tr>
                        <!-- ===================== PREPARATORIA (grado_3) ===================== -->
                        <tr v-for="n in [3]" :key="'preparatoria-' + n">
                            <td class="border-r align-middle pr-2">
                                <vx-tooltip :text="ficheroData.Niveles_Educativos.preparatoria ? 'Nivel educativo activo: Si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: No trabaja ni está disponible en la institución'" position="top">
                                    <label class="flex items-center space-x-2">
                                        <vs-checkbox v-model="ficheroData.Niveles_Educativos.preparatoria" @change="onChangeNivelEducativo('preparatoria')" />
                                        <span class="font-bold">PREPARATORIA<br><small>(1)</small></span>
                                    </label>
                                </vx-tooltip>
                            </td>
                            <td class="bg-gray-50 pl-4 font-medium text-center border-r align-middle pr-2">
                                {{ array_Lista_Niveles && array_Lista_Niveles[2] ? array_Lista_Niveles[2].nombrenivel : '' }}
                            </td>
                            <td class="border-r align-middle pr-2">
                                <vs-input placeholder="Valor Pensión Preparatoria" class="w-full" ref="pension_preparatoria" :class="ficheroData.valorPension.preparatoria_class" v-model="ficheroData.valorPension.preparatoria" @keypress="validarkey_FicheroData_Valor_Pension($event, 'preparatoria')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.preparatoria" @blur="onBlurValorPension('preparatoria')" />
                            </td>
                            <td class="p-3 align-top bg-gray-50">
                                <div class="mb-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider"># de Aulas</div>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="w-20 fade-transition text-center font-medium" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                                    </div>
                                </div>
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="mt-3 space-y-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                                        Estudiantes por aula
                                    </div>
                                    <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="'est-' + n + '-' + i" class="flex items-center space-x-2">
                                        <!-- LABEL "Aula X:" + INPUT en misma línea -->
                                        <span class="text-xs text-gray-600 min-w-[60px] text-right font-medium">Aula {{ i }}:</span>
                                        <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-20 text-center" />
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-gray-200">
                                        <span class="text-xs font-bold text-blue-700">Total Estudiantes x aula = {{ getTotalEstudiantesPorGrado(n) }}</span>
                                    </div>
                                </div>
                                <div v-else class="text-xs text-gray-500 italic">Escribe # aulas</div>
                            </td>
                        </tr>
                        <!-- ===================== ELEMENTAL (grado_4,5,6) ===================== -->
                        <tr v-for="n in [4,5,6]" :key="'elemental-' + n">
                            <td v-if="n === 4" :rowspan="3" class="border-r align-middle pr-2">
                                <vx-tooltip :text="ficheroData.Niveles_Educativos.elemental ? 'Nivel educativo activo: Si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: No trabaja ni está disponible en la institución'" position="top">
                                    <label class="flex items-center space-x-2">
                                        <vs-checkbox v-model="ficheroData.Niveles_Educativos.elemental" @change="onChangeNivelEducativo('elemental')" />
                                        <span class="font-bold">ELEMENTAL<br><small>(2–4)</small></span>
                                    </label>
                                </vx-tooltip>
                            </td>
                            <td class="bg-gray-50 pl-4 font-medium text-center border-r align-middle pr-2">
                                {{ array_Lista_Niveles && array_Lista_Niveles[n-1] ? array_Lista_Niveles[n-1].nombrenivel : '' }}
                            </td>
                            <td v-if="n === 4" :rowspan="3" class="border-r align-middle pr-2">
                                <vs-input placeholder="Valor Pensión Elemental" class="w-full" ref="pension_elemental" :class="ficheroData.valorPension.elemental_class" v-model="ficheroData.valorPension.elemental" @keypress="validarkey_FicheroData_Valor_Pension($event, 'elemental')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.elemental" @blur="onBlurValorPension('elemental')" />
                            </td>
                            <td class="p-3 align-top bg-gray-50">
                                <div class="mb-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider"># de Aulas</div>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="w-20 fade-transition text-center font-medium" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                                    </div>
                                </div>
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="mt-3 space-y-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                                        Estudiantes por aula
                                    </div>
                                    <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="'est-' + n + '-' + i" class="flex items-center space-x-2">
                                        <!-- LABEL "Aula X:" + INPUT en misma línea -->
                                        <span class="text-xs text-gray-600 min-w-[60px] text-right font-medium">Aula {{ i }}:</span>
                                        <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-20 text-center" />
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-gray-200">
                                        <span class="text-xs font-bold text-blue-700">Total Estudiantes x aula = {{ getTotalEstudiantesPorGrado(n) }}</span>
                                    </div>
                                </div>
                                <div v-else class="text-xs text-gray-500 italic">Escribe # aulas</div>
                            </td>
                        </tr>
                        <!-- ===================== MEDIO (grado_7,8,9) ===================== -->
                        <tr v-for="n in [7,8,9]" :key="'medio-' + n">
                            <td v-if="n === 7" :rowspan="3" class="border-r align-middle pr-2">
                                <vx-tooltip :text="ficheroData.Niveles_Educativos.medio ? 'Nivel educativo activo: Si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: No trabaja ni está disponible en la institución'" position="top">
                                    <label class="flex items-center space-x-2">
                                        <vs-checkbox v-model="ficheroData.Niveles_Educativos.medio" @change="onChangeNivelEducativo('medio')" />
                                        <span class="font-bold">MEDIO<br><small>(5–7)</small></span>
                                    </label>
                                </vx-tooltip>
                            </td>
                            <td class="bg-gray-50 pl-4 font-medium text-center border-r align-middle pr-2">
                                {{ array_Lista_Niveles && array_Lista_Niveles[n-1] ? array_Lista_Niveles[n-1].nombrenivel : '' }}
                            </td>
                            <td v-if="n === 7" :rowspan="3" class="border-r align-middle pr-2">
                                <vs-input placeholder="Valor Pensión Medio" class="w-full" ref="pension_medio" :class="ficheroData.valorPension.medio_class" v-model="ficheroData.valorPension.medio" @keypress="validarkey_FicheroData_Valor_Pension($event, 'medio')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.medio" @blur="onBlurValorPension('medio')" />
                            </td>
                            <td class="p-3 align-top bg-gray-50">
                                <div class="mb-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider"># de Aulas</div>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="w-20 fade-transition text-center font-medium" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                                    </div>
                                </div>
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="mt-3 space-y-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                                        Estudiantes por aula
                                    </div>
                                    <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="'est-' + n + '-' + i" class="flex items-center space-x-2">
                                        <!-- LABEL "Aula X:" + INPUT en misma línea -->
                                        <span class="text-xs text-gray-600 min-w-[60px] text-right font-medium">Aula {{ i }}:</span>
                                        <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-20 text-center" />
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-gray-200">
                                        <span class="text-xs font-bold text-blue-700">Total Estudiantes x aula = {{ getTotalEstudiantesPorGrado(n) }}</span>
                                    </div>
                                </div>
                                <div v-else class="text-xs text-gray-500 italic">Escribe # aulas</div>
                            </td>
                        </tr>
                        <!-- ===================== SUPERIOR (grado_10,11,12) ===================== -->
                        <tr v-for="n in [10,11,12]" :key="'superior-' + n">
                            <td v-if="n === 10" :rowspan="3" class="border-r align-middle pr-2">
                                <vx-tooltip :text="ficheroData.Niveles_Educativos.superior ? 'Nivel educativo activo: Si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: No trabaja ni está disponible en la institución'" position="top">
                                    <label class="flex items-center space-x-2">
                                        <vs-checkbox v-model="ficheroData.Niveles_Educativos.superior" @change="onChangeNivelEducativo('superior')" />
                                        <span class="font-bold">SUPERIOR<br><small>(8–10)</small></span>
                                    </label>
                                </vx-tooltip>
                            </td>
                            <td class="bg-gray-50 pl-4 font-medium text-center border-r align-middle pr-2">
                                {{ array_Lista_Niveles && array_Lista_Niveles[n-1] ? array_Lista_Niveles[n-1].nombrenivel : '' }}
                            </td>
                            <td v-if="n === 10" :rowspan="3" class="border-r align-middle pr-2">
                                <vs-input placeholder="Valor Pensión Superior" class="w-full" ref="pension_superior" :class="ficheroData.valorPension.superior_class" v-model="ficheroData.valorPension.superior" @keypress="validarkey_FicheroData_Valor_Pension($event, 'superior')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.superior" @blur="onBlurValorPension('superior')" />
                            </td>
                            <td class="p-3 align-top bg-gray-50">
                                <div class="mb-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider"># de Aulas</div>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="w-20 fade-transition text-center font-medium" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                                    </div>
                                </div>
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="mt-3 space-y-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                                        Estudiantes por aula
                                    </div>
                                    <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="'est-' + n + '-' + i" class="flex items-center space-x-2">
                                        <!-- LABEL "Aula X:" + INPUT en misma línea -->
                                        <span class="text-xs text-gray-600 min-w-[60px] text-right font-medium">Aula {{ i }}:</span>
                                        <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-20 text-center" />
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-gray-200">
                                        <span class="text-xs font-bold text-blue-700">Total Estudiantes x aula = {{ getTotalEstudiantesPorGrado(n) }}</span>
                                    </div>
                                </div>
                                <div v-else class="text-xs text-gray-500 italic">Escribe # aulas</div>
                            </td>
                        </tr>
                        <!-- ===================== BACHILLERATO (grado_13,14,15) ===================== -->
                        <tr v-for="n in [13,14,15]" :key="'bachillerato-' + n">
                            <td v-if="n === 13" :rowspan="3" class="border-r align-middle pr-2">
                                <vx-tooltip :text="ficheroData.Niveles_Educativos.bachillerato ? 'Nivel educativo activo: Si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: No trabaja ni está disponible en la institución'" position="top">
                                    <label class="flex items-center space-x-2">
                                        <vs-checkbox v-model="ficheroData.Niveles_Educativos.bachillerato" @change="onChangeNivelEducativo('bachillerato')" />
                                        <span class="font-bold">BACHILLERATO<br><small>(1BG–3BG)</small></span>
                                    </label>
                                </vx-tooltip>
                            </td>
                            <td class="bg-gray-50 pl-4 font-medium text-center border-r align-middle pr-2">
                                {{ array_Lista_Niveles && array_Lista_Niveles[n-1] ? array_Lista_Niveles[n-1].nombrenivel : '' }}
                            </td>
                            <td v-if="n === 13" :rowspan="3" class="border-r align-middle pr-2">
                                <vs-input placeholder="Valor Pensión Bachillerato" class="w-full" ref="pension_bachillerato" :class="ficheroData.valorPension.bachillerato_class" v-model="ficheroData.valorPension.bachillerato" @keypress="validarkey_FicheroData_Valor_Pension($event, 'bachillerato')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.bachillerato" @blur="onBlurValorPension('bachillerato')" />
                            </td>
                            <td class="p-3 align-top bg-gray-50">
                                <div class="mb-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider"># de Aulas</div>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="w-20 fade-transition text-center font-medium" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                                    </div>
                                </div>
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="mt-3 space-y-2">
                                    <div class="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                                        Estudiantes por aula
                                    </div>
                                    <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="'est-' + n + '-' + i" class="flex items-center space-x-2">
                                        <!-- LABEL "Aula X:" + INPUT en misma línea -->
                                        <span class="text-xs text-gray-600 min-w-[60px] text-right font-medium">Aula {{ i }}:</span>
                                        <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-20 text-center" />
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-gray-200">
                                        <span class="text-xs font-bold text-blue-700">Total Estudiantes x aula = {{ getTotalEstudiantesPorGrado(n) }}</span>
                                    </div>
                                </div>
                                <div v-else class="text-xs text-gray-500 italic">Escribe # aulas</div>
                            </td>
                        </tr>
                        <!-- ===================== TOTAL ===================== -->
                        <tr class="font-bold bg-blue-50">
                            <td colspan="3" class="text-right pr-4">
                                TOTAL ESTUDIANTES POR AULA:
                            </td>
                            <td class="text-center text-blue-700">
                                {{ ficheroData.SumaTotal_EstudiantesxAula }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- VISTA HORIZONTAL -->
        <div class="tabla-scroll" v-if="modoVista === 'horizontal'">
            <table class="personal-plantel-table" :class="{ 'night-personal-plantel-table': themeMode }">
                <thead>
                    <!-- 🔹 FILA DE AGRUPACIÓN (SECCIONES CON CHECKBOXES) -->
                    <tr>
                        <th colspan="1" class="sticky-accion">NIVELES EDUCATIVOS</th>
                        <!-- 🔹 INICIALES -->
                        <th colspan="2" class="text-center">
                            <vx-tooltip :text="ficheroData.Niveles_Educativos.iniciales? 'Nivel educativo activo: si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: no trabaja ni está disponible en la institución'" position="top">
                                <label class="flex items-center justify-center space-x-1 cursor-pointer">
                                    <vs-checkbox v-model="ficheroData.Niveles_Educativos.iniciales" @change="onChangeNivelEducativo('iniciales')" />
                                    <span class="font-bold">INICIALES<br /><small>(1–2)</small></span>
                                </label>
                            </vx-tooltip>
                        </th>
                        <!-- 🔹 PREPARATORIA -->
                        <th colspan="1" class="text-center">
                            <vx-tooltip :text="ficheroData.Niveles_Educativos.preparatoria? 'Nivel educativo activo: si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: no trabaja ni está disponible en la institución'" position="top">
                                <label class="flex items-center justify-center space-x-1 cursor-pointer">
                                    <vs-checkbox v-model="ficheroData.Niveles_Educativos.preparatoria" @change="onChangeNivelEducativo('preparatoria')" />
                                    <span class="font-bold">PREPARATORIA<br /><small>(1)</small></span>
                                </label>
                            </vx-tooltip>
                        </th>
                        <!-- 🔹 ELEMENTAL -->
                        <th colspan="3" class="text-center">
                            <vx-tooltip :text="ficheroData.Niveles_Educativos.elemental? 'Nivel educativo activo: si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: no trabaja ni está disponible en la institución'" position="top">
                                <label class="flex items-center justify-center space-x-1 cursor-pointer">
                                    <vs-checkbox v-model="ficheroData.Niveles_Educativos.elemental" @change="onChangeNivelEducativo('elemental')" />
                                    <span class="font-bold">ELEMENTAL<br /><small>(2–4)</small></span>
                                </label>
                            </vx-tooltip>
                        </th>
                        <!-- 🔹 MEDIO -->
                        <th colspan="3" class="text-center">
                            <vx-tooltip :text="ficheroData.Niveles_Educativos.medio? 'Nivel educativo activo: si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: no trabaja ni está disponible en la institución'" position="top">
                                <label class="flex items-center justify-center space-x-1 cursor-pointer">
                                    <vs-checkbox v-model="ficheroData.Niveles_Educativos.medio" @change="onChangeNivelEducativo('medio')" />
                                    <span class="font-bold">MEDIO<br /><small>(5–7)</small></span>
                                </label>
                            </vx-tooltip>
                        </th>
                        <!-- 🔹 SUPERIOR -->
                        <th colspan="3" class="text-center">
                            <vx-tooltip :text="ficheroData.Niveles_Educativos.superior? 'Nivel educativo activo: si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: no trabaja ni está disponible en la institución'" position="top">
                                <label class="flex items-center justify-center space-x-1 cursor-pointer">
                                    <vs-checkbox v-model="ficheroData.Niveles_Educativos.superior" @change="onChangeNivelEducativo('superior')" />
                                    <span class="font-bold">SUPERIOR<br /><small>(8–10)</small></span>
                                </label>
                            </vx-tooltip>
                        </th>
                        <!-- 🔹 BACHILLERATO -->
                        <th colspan="3" class="text-center">
                            <vx-tooltip :text="ficheroData.Niveles_Educativos.bachillerato? 'Nivel educativo activo: si trabaja y está disponible en la institución' : 'Nivel educativo inactivo: no trabaja ni está disponible en la institución'" position="top">
                                <label class="flex items-center justify-center space-x-1 cursor-pointer">
                                    <vs-checkbox v-model="ficheroData.Niveles_Educativos.bachillerato" @change="onChangeNivelEducativo('bachillerato')" />
                                    <span class="font-bold">BACHILLERATO<br /><small>(1BG–3BG)</small></span>
                                </label>
                            </vx-tooltip>
                        </th>
                    </tr>
                    <!-- 🔹 FILA DE NIVELES INDIVIDUALES (GRADOS) - STICKY -->
                    <tr>
                        <th colspan="1" class="sticky-accion sticky-header text-center">GRADOS</th>
                        <th v-for="nivel in array_Lista_Niveles" :key="nivel.idnivel" class="text-center sticky-header bg-gray-50">
                            {{ nivel.nombrenivel }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="sticky-accion sticky-header font-bold" :class="{ 'night-sticky-accion': themeMode }">
                            VALOR DE LA PENSIÓN
                        </td>
                        <!-- INICIALES -->
                        <td colspan="2" class="p-2 border-r">
                            <vs-input placeholder="Valor" class="w-full text-center" ref="pension_iniciales" :class="ficheroData.valorPension.iniciales_class" v-model="ficheroData.valorPension.iniciales" @keypress="validarkey_FicheroData_Valor_Pension($event, 'iniciales')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.iniciales" @blur="onBlurValorPension('iniciales')" />
                        </td>
                        <!-- PREPARATORIA -->
                        <td colspan="1" class="p-2 border-r">
                            <vs-input placeholder="Valor" class="w-full text-center" ref="pension_preparatoria" :class="ficheroData.valorPension.preparatoria_class" v-model="ficheroData.valorPension.preparatoria" @keypress="validarkey_FicheroData_Valor_Pension($event, 'preparatoria')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.preparatoria" @blur="onBlurValorPension('preparatoria')" />
                        </td>
                        <!-- ELEMENTAL -->
                        <td colspan="3" class="p-2 border-r">
                            <vs-input placeholder="Valor" class="w-full text-center" ref="pension_elemental" :class="ficheroData.valorPension.elemental_class" v-model="ficheroData.valorPension.elemental" @keypress="validarkey_FicheroData_Valor_Pension($event, 'elemental')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.elemental" @blur="onBlurValorPension('elemental')" />
                        </td>
                        <!-- MEDIO -->
                        <td colspan="3" class="p-2 border-r">
                            <vs-input placeholder="Valor" class="w-full text-center" ref="pension_medio" :class="ficheroData.valorPension.medio_class" v-model="ficheroData.valorPension.medio" @keypress="validarkey_FicheroData_Valor_Pension($event, 'medio')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.medio" @blur="onBlurValorPension('medio')" />
                        </td>
                        <!-- SUPERIOR -->
                        <td colspan="3" class="p-2 border-r">
                            <vs-input placeholder="Valor" class="w-full text-center" ref="pension_superior" :class="ficheroData.valorPension.superior_class" v-model="ficheroData.valorPension.superior" @keypress="validarkey_FicheroData_Valor_Pension($event, 'superior')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.superior" @blur="onBlurValorPension('superior')" />
                        </td>
                        <!-- BACHILLERATO -->
                        <td colspan="3" class="p-2 border-r">
                            <vs-input placeholder="Valor" class="w-full text-center" ref="pension_bachillerato" :class="ficheroData.valorPension.bachillerato_class" v-model="ficheroData.valorPension.bachillerato" @keypress="validarkey_FicheroData_Valor_Pension($event, 'bachillerato')" @paste="validatePaste" :disabled="!ficheroData.Niveles_Educativos.bachillerato" @blur="onBlurValorPension('bachillerato')" />
                        </td>
                    </tr>
                    <!-- FILA DE AULAS -->
                    <tr>
                        <td class="sticky-accion font-bold" :class="{ 'night-sticky-accion': themeMode }"># DE AULAS</td>
                        <td v-for="n in 15" :key="`aulas-${n}`" class="p-2">
                            <vs-input v-model.number="ficheroData.numeroAulas['grado_' + n]" @blur="onBlurNumeroAulas(n)" :ref="'aula_grado_' + n" :class="ficheroData.numeroAulas['grado_' + n + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" placeholder="0" @input="ajustarEstudiantes(n)" class="fade-transition w-full text-center input-aulas" maxlength="2" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" />
                        </td>
                    </tr>
                    <!-- FILA DE ESTUDIANTES POR AULA -->
                    <tr>
                        <td class="sticky-accion align-top" :class="{ 'night-sticky-accion': themeMode }">
                            <span class="font-bold">ESTUDIANTES POR AULA</span>
                            <div class="mt-2 font-bold text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded p-1 text-center text-xs">
                                Total: {{ ficheroData.SumaTotal_EstudiantesxAula }}
                            </div>
                        </td>
                        <!-- El style height: 1px en el td es un truco CSS para que el hijo con h-full tome la altura de la fila entera -->
                        <td v-for="n in 15" :key="`estudiantes-${n}`" class="align-top p-0 bg-gray-50 dark:bg-gray-800" style="height: 1px;">
                            <div class="h-full flex flex-col justify-between">
                                <div class="p-2 space-y-1 w-full">
                                    <div v-if="ficheroData.numeroAulas['grado_' + n] > 0">
                                        <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="`grado-${n}-aula-${i}`" class="flex items-center justify-center mb-1">
                                            <vs-input v-model="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]" @blur="onBlurAulas_Estudiantes(n, i)" :ref="'estudiante_grado_' + n + '_aula_' + i" :class="ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i + '_class']" type="text" @keypress="validarkey_SoloEnteros($event)" :placeholder="`Aula ${i}`" maxlength="3" :disabled="!columnaHabilitada_NumeroAulas_Estudiantes(n)" class="w-full text-center input-small" />
                                        </div>
                                    </div>
                                    <div v-else class="text-gray-400 italic text-xs text-center p-2">
                                        -
                                    </div>
                                </div>
                                <!-- Footer siempre al final de la celda -->
                                <div v-if="ficheroData.numeroAulas['grado_' + n] > 0" class="w-full bg-blue-50 dark:bg-gray-700 p-2 border-t border-gray-300 dark:border-gray-600" style="border-top: 1px solid #ccc;">
                                    <div class="text-center font-bold text-blue-700 text-xs">
                                        Total Est.: {{ getTotalEstudiantesPorGrado(n) }}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 p-3 rounded-lg" :class="themeMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'">
            <span class="font-medium text-center"><b>Cantidad Real Estudiantes</b></span>
            <vs-input v-model.number="ficheroData.cantidad_real_estudiantes" type="text" class="w-full sm:w-40 text-center" placeholder="Cantidad" @keypress="validarkey_SoloEnteros($event)" maxlength="5" @blur="metodoPost_Guardado_AulasEstudiantes()" />
        </div>
    </div>
    <!-- Áreas y Editoriales -->
    <div class="seccion">
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">📚 Editoriales con las que trabajan</h3>
        <div align="center" class="mb-4">
            <vs-button line-origin="left" color="success" type="line" @click="agregarArea()">
                + Agregar Registro de Editorial y Libro
            </vs-button>
        </div>
        <!-- {{ ficheroData.editoriales }} -->
        <div class="tabla-scroll" style="overflow-x: auto; overflow-y: visible; position: relative;">
            <div style="display: flex; min-width: max-content;">
                <table class="personal-plantel-table" :class="{ 'night-personal-plantel-table': themeMode }">
                    <thead v-if="ficheroData.editoriales.length > 0">
                        <!-- 1. FILA ACCIÓN (botón Eliminar) -->
                        <tr>
                            <th style="padding:10px; border-bottom:2px solid #e2e8f0; width:103px; min-width:103px;" class="sticky-accion" :class="{ 'night-sticky-accion': themeMode }">
                                Acción
                            </th>
                            <th v-for="(area, index) in ficheroData.editoriales" :key="'accion-head-'+index" style="padding:10px; border-bottom:2px solid #e2e8f0; text-align:center;">
                                <vs-button color="danger" type="border" size="small" @click="eliminarArea(index)">
                                    Eliminar
                                </vs-button>
                            </th>
                        </tr>
                        <!-- 2. FILA EDITORIAL -->
                        <tr>
                            <th style="padding:8px; border-bottom:1px solid #e2e8f0; font-weight:600;" class="sticky-accion" :class="{ 'night-sticky-accion': themeMode }">
                                Editorial
                            </th>
                            <td v-for="(area, areaIndex) in ficheroData.editoriales" :key="'editorial-'+areaIndex" style="padding:8px; border-bottom:1px solid #e2e8f0;">
                                <v-select placeholder="--Editorial--" v-model="area.editorialComun" label="edi_nombre" :options="array_Lista_Editoriales" :reduce="opt => opt.edi_id" @input="onChangeEditorialComun(area, areaIndex)" style="width:100%;" :ref="`editorialSelect_${areaIndex}`" :class="area.classValidarEditorial" :dropdown-width="350" append-to-body :calculate-position="positionDropdown" />
                            </td>
                        </tr>
                        <!-- 3. FILA LIBRO / ÁREA (nombre serie o input manual) -->
                        <tr>
                            <th style="padding:8px; border-bottom:1px solid #e2e8f0; font-weight:600;" class="sticky-accion" :class="{ 'night-sticky-accion': themeMode }">
                                Libro
                            </th>
                            <td v-for="(area, index) in ficheroData.editoriales" :key="'nombre-area-'+index" style="padding:8px; border-bottom:1px solid #e2e8f0;">
                                <div v-if="tieneEditorialID1(area)">
                                    <v-select :options="array_Series_Fichero" label="nombre_serie" placeholder="--Serie--" v-model="area.id_serie" :ref="`parametroAreaNombre_${index}`" :class="area.classValidarNombre" @input="onChangeSerie(area); actualizarNombreArea(area)" :dropdown-width="170" append-to-body :calculate-position="positionDropdown" />
                                    <v-select v-if="area.areas && area.areas.length > 0" :options="area.areas" label="nombrearea" placeholder="--Área--" v-model="area.idarea" @input="actualizarNombreArea(area)" :dropdown-width="170" append-to-body :calculate-position="positionDropdown" />
                                </div>
                                <div v-else style="display:flex; justify-content:center; width:100%;">
                                    <vs-input v-model="area.id_serie" placeholder="Nombre de libro" :ref="`parametroAreaNombre_${index}`" :class="area.classValidarNombre" @input="onChangeSerie(area); actualizarNombreArea(area)" />
                                </div>
                            </td>
                        </tr>
                        <!-- FILA NIVELES (la que ya tenías con los checkboxes) sigue en el <tbody> -->
                    </thead>
                    <tbody v-if="ficheroData.editoriales.length > 0">
                        <!-- FILAS DE NIVELES (con checkbox true/false) -->
                        <tr v-for="(nivel, nivelIndex) in array_Lista_Niveles" :key="'fila-nivel-'+nivelIndex">
                            <td style="padding:10px; border-bottom:1px solid #edf2f7;" class="sticky-accion" :class="{ 'night-sticky-accion': themeMode }">
                                {{ nivel.nombrenivel }}
                            </td>
                            <td v-for="(area, areaIndex) in ficheroData.editoriales" :key="'col-area-'+areaIndex+'-'+nivelIndex" style="padding:10px; border-bottom:1px solid #edf2f7; text-align:center;" :ref="nivelIndex === 0 ? 'checkboxColumna_' + areaIndex : null" :class="area.classValidarNiveles">
                                <!-- Checkbox: visual true/false, pero NO v-model -->
                                <!-- Checkbox: solo marcado si tiene el edi_id de editorialComun -->
                                <vs-checkbox :checked="isChecked(area, nivelIndex + 1)" @change="onCheckboxToggle(area, nivelIndex + 1, $event.target.checked)" :disabled="!area.editorialComun" class="m-0" />
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="20" style="border:none;">
                                No hay libros o áreas de otras editoriales registrados.
                                Haz clic en <font style="font-weight:bold;">"+ Agregar Registro de Editorial y Libro"</font> para añadir uno.
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style="width: 170px; flex-shrink: 0;"></div>
            </div>
            <!-- <div v-if="espacioDropdown" style="height:350px; pointer-events:none;"></div> -->
        </div>
    </div>
    <!-- Beneficiarios -->
    <div class="seccion" v-if="ficheroData.idperiodoescolar && ficheroData.idInstitucion">
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">👥 Beneficiarios</h3>
        <RegistroBeneficiarios :pro_idperiodoescolar="Number(ficheroData.idperiodoescolar)" :pro_institucion="Number(ficheroData.idInstitucion)" />
    </div>
    <!-- Observaciones -->
    <div class="seccion">
        <h3 class="titulo-seccion" :class="{ 'night-titulo-seccion': themeMode }">📝 Observaciones</h3>
        <!-- <vs-textarea v-model="ficheroData.observaciones" rows="4" placeholder="Ingrese observaciones..." /> -->
        <vs-textarea v-model="ficheroData.observaciones" rows="4" placeholder="Ingrese observaciones..." :counter="limitObservacion" label="Observaciones" :class="classValidarObservaciones" ref="observaciones" />
    </div>
    <!-- Botones -->
    <div class="acciones">
        <vs-button @click="metodoPost_GuardadoGeneral_DesdeBoton()" type="relief">Guardar</vs-button>
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </div>
    <!-- SECCION AGREGAR USUARIO -->
    <vs-popup class="informacionformhijodehijo" @close="actualizartabla_personalPlantel()" title="Agregar personal docente" :active.sync="popup_Decidelacompra" fullscreen style="padding: 5px;">
        <Agregar_Usuario v-if="popup_Decidelacompra" :institucionSeleccionada="institucionSeleccionada" :Enviar_UsuariosPlantelSelect="ficheroData.personalPlantel" @change="changeHandle_Decidelacompra" />
    </vs-popup>
    <!-- SECCION AGREGAR ESTABLECIMIENTO PARA DESPACHO -->
    <vs-popup class="informacionformhijodehijo" title="Agregar Establecimiento para Despacho" :active.sync="popup_EstablecimientoParaDespacho" fullscreen style="padding: 5px;">
        <Component_EstablecimientoParaDespacho v-if="popup_EstablecimientoParaDespacho" :Enviar_InstitucionesSelect="ficheroData.fm_establecimientos_para_despacho" @change="changeHandle_EstablecimientoParaDespacho" />
    </vs-popup>
    <!-- SECCION EDITAR USUARIO -->
    <vs-popup class="informacionformhijodehijo" :title="'Actualizar usuario - Correo: ' + itemUsuarioPlantelEnviar.email" :active.sync="popup_EditarUsuario">
        <Component_EditarUsuario v-if="popup_EditarUsuario" :institucionSeleccionada="institucionSeleccionada" :itemUsuarioPlantelEnviar="itemUsuarioPlantelEnviar" :verificarcrear_actualizarUsuario="verificarcrear_actualizarUsuario" @change="changeHandle_CrearEditarUsuario" />
    </vs-popup>
    <!-- SECCION EDITAR DATOS INSTITUCION -->
    <vs-popup fullscreen class="informacionformhijodehijo" title="Actualizar datos de la institución" :active.sync="popup_ActualizarInstitucion" style="padding: 5px;">
        <Component_ActualizarInstitucion v-if="popup_ActualizarInstitucion" :id="ficheroData.idInstitucion" :xfichero="'si'" @change="changeHandle_ActualizarInstitucion" />
    </vs-popup>

    <!-- ===== POPUP: Validación bloqueo eliminar establecimiento de despacho ===== -->
    <vs-popup :active.sync="popup_ValidarEliminarDespacho" title="⚠️ No se puede eliminar el establecimiento">
        <Component_ValidarEliminarDespacho v-if="popup_ValidarEliminarDespacho" :nombreEstablecimiento="validarDespacho_nombreEstablecimiento" :ventasEncontradas="validarDespacho_ventasEncontradas" @close="popup_ValidarEliminarDespacho = false" />
    </vs-popup>
    <!-- ===== FIN POPUP validar despacho ===== -->
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    Spanish
} from 'flatpickr/dist/l10n/es.js'
import {
    type
} from 'jquery';
import vSelect from "vue-select";
flatpickr.localize(Spanish)
const Agregar_Usuario = () => import("@/views/pedidos2/fichero_mercado/Asignacion_Usuarios.vue");
const Component_EditarUsuario = () => import("@/views/pedidos2/fichero_mercado/Agregar_Editar_Usuario.vue");
const Component_ActualizarInstitucion = () => import("@/views/institucion/addInstitucion.vue");
const RegistroBeneficiarios = () => import("@/views/pedidos/registrar_beneficiarios.vue");
const Component_EstablecimientoParaDespacho = () => import("@/views/pedidos2/fichero_mercado/component_crud/establecimientos_para_despacho/EstablecimientoParaDespacho.vue");
const Component_ValidarEliminarDespacho = () => import("@/views/pedidos2/fichero_mercado/component_crud/establecimientos_para_despacho/ValidarEliminarDespacho.vue");
export default {
    data() {
        return {
            institucionSeleccionada: null, // Asegurar que está inicializada como null
            // Configuración del date picker
            configdateTimePicker: {
                // enableTime: true,
                altInput: true,
                altFormat: 'Y-F-d', // Esto es lo que se ve: 2025-Mayo-02
                dateFormat: 'Y-m-d', // Esto es lo que se envía: 2025-05-02
            },
            popup_Decidelacompra: false,
            popup_ActualizarInstitucion: false,
            popup_EditarUsuario: false,
            verificarcrear_actualizarUsuario: 'update',
            itemUsuarioPlantelEnviar: {},
            array_Lista_Editoriales: [],
            array_Lista_Niveles: [],
            array_Entrega_Muestras: [],
            array_Entrega_Muestras_filtrado: [],
            array_Opcioones_Planificacion: [],
            Array_Cargos_Autoridades: [],
            array_Series_Fichero: [],
            array_Areas_Fichero: [],
            espacioDropdown: false,
            isrunLoading_metodoEjecucionGlobal: false,
            isrunLoading_metodoPost_GuardadoGeneral: false,
            fm_id: null,
            Array_Fichero_Mercado_Cabecera: [],
            Array_Fichero_Mercado_Autoridades: [],
            Array_Fichero_Mercado_Detalle: [],
            ArrayEmpresas: [],
            NuevoFactorIncideCompra: '',
            popupAgregar: false,
            popup_EstablecimientoParaDespacho: false,
            id_logo_empresa: null,
            filtro_opcion: "",
            classValidarObservaciones: false,
            classvalidar_fm_tipo_venta: '',
            seccionColumnas: {
                iniciales: [1, 2],
                preparatoria: [3],
                elemental: [4, 5, 6],
                medio: [7, 8, 9],
                superior: [10, 11, 12],
                bachillerato: [13, 14, 15],
            },
            limitObservacion: 200,
            tipos_venta: [{
                    id_tipo: '1',
                    tipo_venta: 'Directa'
                },
                {
                    id_tipo: '2',
                    tipo_venta: 'Comisión o lista'
                },
            ],
            // Datos del fichero
            ficheroData: {
                // Datos del establecimiento
                idInstitucion: '',
                nombre: '',
                idperiodoescolar: '',
                periodoEscolar: '',
                telefono: '',
                correo: '',
                nombreprovincia: '',
                nombre_ciudad: '',
                parr_nombre: '',
                direccion: '',
                tipo_Institucion: '',
                forma_Comercializacion: '',
                asesor_id: '',
                asesor_nombres: '',
                trabaja_con_prolipa: true,
                fm_es_distribuidor: false,
                fm_convenio: false,
                fm_cantidad_anios_trabaja_con_prolipa: 0,
                fm_tipo_venta: null,
                fm_establecimientos_para_despacho: [],
                // Correo y comercialización
                Niveles_Educativos: {
                    iniciales: false,
                    preparatoria: false,
                    elemental: false,
                    medio: false,
                    superior: false,
                    bachillerato: false,
                },
                valorPension: {
                    iniciales: '',
                    preparatoria: '',
                    elemental: '',
                    medio: '',
                    superior: '',
                    bachillerato: '',
                },
                factores_inciden_compra: {
                    precio: false,
                    contenido: false,
                    pedagogia: false,
                    servicios: false
                },
                factores_inciden_compra_extra: [],
                personalPlantel: [],
                // Número de aulas y estudiantes
                numeroAulas: {},
                SumaTotal_EstudiantesxAula: 0,
                cantidad_real_estudiantes: 0,
                estudiantesPorAula: {},
                // Áreas y editoriales
                editoriales: [],
                // Observaciones y fechas
                observaciones: '',
                fechaMuestreo: '',
                fechaDefinicion: '',
                info_aprobacion: '',
                asesorComercial: '',
                isHistoryBack: false, // Control para saber si el cierre fue por botón atrás
            },
            modoVista: 'vertical', // 'vertical' o 'horizontal'
            // ——— Validación eliminar establecimiento de despacho ———
            popup_ValidarEliminarDespacho: false,
            validarDespacho_ventasEncontradas: [],
            validarDespacho_nombreEstablecimiento: '',
            validarDespacho_cargando: false,
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    components: {
        "v-select": vSelect,
        flatPickr,
        Agregar_Usuario,
        Component_EditarUsuario,
        Component_ActualizarInstitucion,
        RegistroBeneficiarios,
        Component_EstablecimientoParaDespacho,
        Component_ValidarEliminarDespacho
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: ''
        },
        institucion_Enviar: {
            type: Object,
            default: () => ({})
        },
        periodoSeleccionado: {
            type: Object,
            default: () => ({})
        },
        Fichero_Array: {
            type: Array,
            default: () => []
        }
    },

    mounted() {
        this.metodoEjecucionGlobal();
        // Escuchar el evento popstate para cerrar los sub-popups
        window.addEventListener('popstate', this.handlePopState);
    },
    beforeDestroy() {
        clearInterval(this.timerInterval);
        window.removeEventListener('popstate', this.handlePopState);
    },
    watch: {
        // Observar cambios en los popups para agregar estados al historial
        popup_Decidelacompra(val) {
            if (val) {
                // Evitar duplicar estados si ya estamos en ese estado
                if (history.state && history.state.popup_Decidelacompra) {
                    console.log('State ya tiene popup_Decidelacompra: true, no hacemos push.');
                    this.isHistoryBack = false;
                    return;
                }
                // Preservamos el estado anterior (del padre) y agregamos el nuestro
                let newState = {
                    ...history.state,
                    popup_Decidelacompra: true
                };
                window.history.pushState(newState, '');
                console.log('Sub-popup abierto: popup_Decidelacompra');
                this.isHistoryBack = false;
            } else {
                // Si se cierra y NO fue por botón atrás (fue por código/emit), retrocedemos historial
                if (!this.isHistoryBack) {
                    window.history.back();
                    console.log('Sub-popup cerrado por código -> history.back() manual');
                }
                this.isHistoryBack = false; // Resetear flag
            }
        },
        popup_EditarUsuario(val) {
            if (val) {
                if (history.state && history.state.popup_EditarUsuario) {
                    this.isHistoryBack = false;
                    return;
                }
                let newState = {
                    ...history.state,
                    popup_EditarUsuario: true
                };
                window.history.pushState(newState, '');
                console.log('Sub-popup abierto: popup_EditarUsuario');
                this.isHistoryBack = false;
            } else {
                if (!this.isHistoryBack) {
                    window.history.back();
                    console.log('Sub-popup cerrado por código -> history.back() manual');
                }
                this.isHistoryBack = false;
            }
        },
        popup_ActualizarInstitucion(val) {
            if (val) {
                if (history.state && history.state.popup_ActualizarInstitucion) {
                    this.isHistoryBack = false;
                    return;
                }
                let newState = {
                    ...history.state,
                    popup_ActualizarInstitucion: true
                };
                window.history.pushState(newState, '');
                console.log('Sub-popup abierto: popup_ActualizarInstitucion');
                this.isHistoryBack = false;
            } else {
                if (!this.isHistoryBack) {
                    window.history.back();
                    console.log('Sub-popup cerrado por código -> history.back() manual');
                }
                this.isHistoryBack = false;
            }
        },
        popupAgregar(val) {
            if (val) {
                // Evitar duplicar
                if (history.state && history.state.popupAgregar) {
                    this.isHistoryBack = false;
                    return;
                }
                let newState = {
                    ...history.state,
                    popupAgregar: true
                };
                window.history.pushState(newState, '');
                console.log('Sub-popup abierto: popupAgregar');
                this.isHistoryBack = false;
            } else {
                if (!this.isHistoryBack) {
                    window.history.back();
                    console.log('Sub-popup cerrado por código -> history.back() manual');
                }
                this.isHistoryBack = false;
            }
        },
        popup_EstablecimientoParaDespacho(val) {
            if (val) {
                if (history.state && history.state.popup_EstablecimientoParaDespacho) {
                    this.isHistoryBack = false;
                    return;
                }
                let newState = {
                    ...history.state,
                    popup_EstablecimientoParaDespacho: true
                };
                window.history.pushState(newState, '');
                this.isHistoryBack = false;
            } else {
                if (!this.isHistoryBack) {
                    window.history.back();
                }
                this.isHistoryBack = false;
            }
        },
    },
    methods: {
        // Manejar el botón atrás del navegador para los sub-popups
        handlePopState(event) {
            // Marcamos que este evento viene del historial
            this.isHistoryBack = true;

            console.log("📍 Padre (Crear_Editar_Fichero) - popstate detectado.");
            console.log("   - State del evento:", event.state);
            console.log("   - popups abiertos:", {
                Decidelacompra: this.popup_Decidelacompra,
                EditarUsuario: this.popup_EditarUsuario,
                ActualizarInstitucion: this.popup_ActualizarInstitucion
            });

            // Verificar cuál popup está abierto y cerrarlo
            if (this.popup_Decidelacompra) {
                // Si el evento tiene estado y coincide con este popup, significa que volvimos a este nivel
                // desde un hijo, por lo tanto NO debemos cerrar este popup.
                if (event.state && event.state.popup_Decidelacompra) {
                    console.log('🔙 RETORNO INTERCEPTADO: El state indica que popup_Decidelacompra debe seguir abierto.');
                    return;
                }
                this.popup_Decidelacompra = false;
                console.log('Sub-popup cerrar: Decidelacompra');
            } else if (this.popup_EditarUsuario) {
                if (event.state && event.state.popup_EditarUsuario) {
                    console.log('🔙 RETORNO INTERCEPTADO: El state indica que popup_EditarUsuario debe seguir abierto.');
                    return;
                }
                this.popup_EditarUsuario = false;
                console.log('Sub-popup cerrar: EditarUsuario');
            } else if (this.popup_ActualizarInstitucion) {
                if (event.state && event.state.popup_ActualizarInstitucion) {
                    console.log('🔙 RETORNO INTERCEPTADO: El state indica que popup_ActualizarInstitucion debe seguir abierto.');
                    return;
                }
                this.popup_ActualizarInstitucion = false;
                console.log('Sub-popup cerrar: ActualizarInstitucion');
            } else if (this.popupAgregar) {
                if (event.state && event.state.popupAgregar) {
                    console.log('🔙 RETORNO INTERCEPTADO: El state indica que popupAgregar debe seguir abierto.');
                    return;
                }
                this.popupAgregar = false;
                console.log('Sub-popup cerrar: popupAgregar');
            } else if (this.popup_EstablecimientoParaDespacho) {
                if (event.state && event.state.popup_EstablecimientoParaDespacho) {
                    return;
                }
                this.popup_EstablecimientoParaDespacho = false;
            } else {
                // Si no había ninguno abierto, reseteamos por si acaso
                this.isHistoryBack = false;
                console.log('   - Ningun sub-popup abierto. Ignorando.');
            }
        },
        positionDropdown(dropdownEl, component, {
            width
        }) {
            const rect = component.$el.getBoundingClientRect();
            dropdownEl.style.position = 'absolute';
            dropdownEl.style.left = `${rect.left}px`;
            dropdownEl.style.top = `${rect.bottom + window.scrollY}px`;
            dropdownEl.style.width = width || '350px'; // Usa el ancho definido o un default
            dropdownEl.style.minWidth = '300px'; // Mínimo para que no se encoja mucho
            dropdownEl.style.maxWidth = '450px'; // Máximo para que no ocupe toda la pantalla
            dropdownEl.style.zIndex = 999999; // asegurar que quede encima
        },
        tieneEditorialID1(area) {
            return Number(area.editorialComun) === 1;
        },
        actualizarNombreArea(area) {
            if (this.tieneEditorialID1(area)) {
                // Caso select
                const nombreSerie = area.id_serie && area.id_serie.nombre_serie ? area.id_serie.nombre_serie : '';
                const nombreAreaSelect = area.idarea && area.idarea.nombrearea ? area.idarea.nombrearea : '';
                area.nombre_Libros = nombreSerie + (nombreAreaSelect ? ' | ' + nombreAreaSelect : '');
            } else {
                // Caso input
                area.nombre_Libros = area.id_serie || '';
            }
        },
        validarEditorialesPorFila() {
            const filasConError = [];

            this.ficheroData.editoriales.forEach((area, index) => {
                // Limpiar clase previa
                this.$set(area, 'classValidarEditoriales', '');

                // Obtener todos los valores no vacíos
                const valores = Object.values(area.grados || {})
                    .flat()
                    .filter(v => v != null);

                const unicos = [...new Set(valores)];

                if (unicos.length > 1) {
                    filasConError.push(index + 1);
                    this.$set(area, 'classValidarEditoriales', 'stylevalidarinput');
                }
            });

            if (filasConError.length > 0) {
                this.$vs.notify({
                    title: 'Editoriales con las que trabajan',
                    text: `La/s columna/s ${filasConError.join(', ')} contiene/n varias editoriales distintas.`,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000
                });

                // Quitar resaltado después de 3 segundos
                setTimeout(() => {
                    this.ficheroData.editoriales.forEach(area => {
                        this.$set(area, 'classValidarEditoriales', '');
                    });
                }, 3000);
            }
        },
        columnaHabilitada_NumeroAulas_Estudiantes(index) {
            for (const [seccion, columnas] of Object.entries(this.seccionColumnas)) {
                if (columnas.includes(index)) {
                    return this.ficheroData.Niveles_Educativos[seccion];
                }
            }
            return false;
        },
        handleCheckboxChange(seccion) {
            const me = this;
            const columnas = me.seccionColumnas[seccion];
            // Solo si el checkbox se desactiva
            if (!me.ficheroData.Niveles_Educativos[seccion]) {
                columnas.forEach(n => {
                    const key = `grado_${n}`;
                    // 🔸 1️⃣ Resetear número de aulas
                    if (me.ficheroData.numeroAulas[key] !== undefined) {
                        me.ficheroData.numeroAulas[key] = 0;
                    }

                    // 🔸 2️⃣ Limpiar estudiantes por aula (usando tu método actual)
                    me.ajustarEstudiantes(n);
                });
                // 🔸 3️⃣ Limpiar el valor de la pensión correspondiente
                switch (seccion) {
                    case 'iniciales':
                        me.ficheroData.valorPension.iniciales = 0;
                        break;
                    case 'preparatoria':
                        me.ficheroData.valorPension.preparatoria = 0;
                        break;
                    case 'elemental':
                        me.ficheroData.valorPension.elemental = 0;
                        break;
                    case 'medio':
                        me.ficheroData.valorPension.medio = 0;
                        break;
                    case 'superior':
                        me.ficheroData.valorPension.superior = 0;
                        break;
                    case 'bachillerato':
                        me.ficheroData.valorPension.bachillerato = 0;
                        break;
                }
            }
        },
        formatearValorPension(campo) {
            let valor = parseFloat(this.ficheroData.valorPension[campo]);
            if (!isNaN(valor)) {
                this.ficheroData.valorPension[campo] = valor.toFixed(2);
            } else {
                this.ficheroData.valorPension[campo] = '';
            }
        },
        getTotalEstudiantesPorGrado(n) {
            let total = 0;
            const numAulas = this.ficheroData.numeroAulas['grado_' + n] || 0;
            if (numAulas > 0) {
                for (let i = 1; i <= numAulas; i++) {
                    const val = parseInt(this.ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i]) || 0;
                    total += val;
                }
            }
            return total;
        },
        async calcularTotalEstudiantes() {
            return new Promise((resolve, reject) => {
                try {
                    let total = 0;
                    for (const key in this.ficheroData.estudiantesPorAula) {
                        const val = parseInt(this.ficheroData.estudiantesPorAula[key]) || 0;
                        total += val;
                    }
                    this.ficheroData.SumaTotal_EstudiantesxAula = total;

                    resolve();
                } catch (error) {
                    console.error("Error calculando total de estudiantes:", error);
                    this.ficheroData.SumaTotal_EstudiantesxAula = 0;
                    reject("calcularTotalEstudiantes catch", error);
                }
            });
        },
        async onBlurAulas_Estudiantes(n, i) {
            // 1️⃣ Ejecutar primero los métodos existentes
            this.verificarCampoEstudianteVacio(n, i);
            this.calcularTotalEstudiantes();
            // 2️⃣ Espera que se actualicen los valores del modelo
            await this.$nextTick();
            // 2️⃣ Luego ejecutar el guardado (esperando si es async)
            await this.metodoPost_Guardado_AulasEstudiantes();
        },
        async onBlurNumeroAulas(n) {
            // 1️⃣ Ejecuta tus métodos actuales
            this.verificarCampoVacioAulas(n);
            this.calcularTotalEstudiantes();
            // 2️⃣ Espera que se actualicen los valores del modelo
            await this.$nextTick();
            // 3️⃣ Ejecuta el guardado general
            await this.metodoPost_Guardado_AulasEstudiantes();
        },
        async onChangeNivelEducativo(tipo) {
            // 1️⃣ Ejecutar el método que ya tienes
            this.handleCheckboxChange(tipo);
            // 2️⃣ Espera que se actualicen los valores del modelo
            await this.$nextTick();
            // 2️⃣ Luego ejecutar el guardado
            await this.metodoPost_Guardado_AulasEstudiantes();
        },
        async onBlurValorPension(tipo) {
            // 1️⃣ Ejecuta el método actual
            this.formatearValorPension(tipo);
            // 2️⃣ Espera que se actualicen los valores del modelo
            await this.$nextTick();
            // 3️⃣ Ejecuta el guardado general
            await this.metodoPost_Guardado_AulasEstudiantes();
        },
        async onInputCargo_Autoridades() {
            // Espera que Vue reactive el cambio del v-model
            await this.$nextTick();
            // Luego ejecuta el guardado
            await this.metodoPost_Guardado_Personal_Plantel();
        },
        async onInput_DecideCompra() {
            // Espera que Vue reactive el cambio del v-model
            await this.$nextTick();
            // Luego ejecuta el guardado
            await this.metodoPost_Guardado_Personal_Plantel();
        },
        async onClick_Elimina_Usuario(index) {
            // Ejecuta el método actual
            this.eliminarUsuario(index)
            // Espera que Vue reactive el cambio del v-model
            await this.$nextTick();
            // Luego ejecuta el guardado
            await this.metodoPost_Guardado_Personal_Plantel();
        },
        async metodoEjecucionGlobal() {
            let me = this;
            try {
                me.isrunLoading_metodoEjecucionGlobal = true;
                me.$vs.loading();
                // console.log("verificarcrear_actualizar", me.Fichero_Array[0]);
                await me.cargarInformacionCompletaEstablecimiento();
                await me.GetLlenado_crear();
                await me.getEditorialesActivasTodo();
                await me.getNivelesTodo();
                await me.TodasEmpresas();
                await me.getBusqueda_Lista_Series_Fichero();
                await me.Todos_CargosAutoridades_Institucion();
                await me.getEntregaMuestrasTodo();
                await me.actualizarFechaMuestreo();
                this.timerInterval = setInterval(this.actualizarFechaMuestreo, 1000);
                if (me.verificarcrear_actualizar == 'crear') {
                    // Acciones específicas para "crear"
                    console.log("Modo crear activo");
                    await me.metodoPost_GuardadoGeneral_DesdeCreacion();
                    me.Fichero_Array_Local = [{
                        fm_id: me.fm_id
                    }];
                    // console.log("Fichero_Array_Local actualizado con fm_id:", me.Fichero_Array_Local);
                }
                if (me.verificarcrear_actualizar == 'crear' || me.verificarcrear_actualizar == 'editar') {
                    console.log("Modo editar activo (pst creacion o edicion)");
                    await me.getTraer_Datos_Fichero_x_fmd_id();
                    await me.getTraer_Datos_Fichero_Autoridades_x_fmd_id();
                    await me.getTraer_Datos_Fichero_Detalle_x_fmd_id();
                    await me.conversionJSON_factores_inciden_compra();
                    await me.conversionJSON_niveles_educativos();
                    await me.consersionJSON_valorPension();
                    await me.consersionJSON_numeroAulas();
                    await me.consersionJSON_estudiantesPorAula();
                    await me.GetLlenado_editar();
                    await me.conversionJSON_personalPlantel();
                    await me.consersionJSON_editoriales();
                    await me.calcularTotalEstudiantes();
                    await me.getInstitucionesParaDespacho();
                }
                me.isrunLoading_metodoEjecucionGlobal = false
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoEjecucionGlobal:', error);
                me.$vs.loading.close();
            }
        },
        async metodoPost_GuardadoGeneral_DesdeBoton() {
            let me = this;
            try {
                me.isrunLoading_metodoPost_GuardadoGeneral = true;
                me.$vs.loading();
                await me.validaciongeneral_antes_de_guardar()
                await me.guardarFicheroCabecera();
                await me.guardarFicheroAutoridades();
                await me.guardarFicheroDetalleEditoriales();
                // Notificación única de éxito
                me.$vs.notify({
                    title: 'Éxito',
                    text: 'Fichero de mercado guardado correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                this.$emit('change', {
                    verificacionemitsaveandedit: 1
                });
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoPost_GuardadoGeneral:', error);
                // Notificación de error global (si quieres que se vea solo una vez)
                if (!error.tipo || error.tipo !== 'validacion') {
                    me.$vs.notify({
                        title: 'Error',
                        text: error || 'Error al guardar el fichero de mercado.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
                me.$vs.loading.close();
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
            }
        },
        async metodoPost_GuardadoGeneral_DesdeCreacion() {
            let me = this;
            try {
                me.isrunLoading_metodoPost_GuardadoGeneral = true;
                me.$vs.loading();
                await me.validaciongeneral_antes_de_guardar()
                await me.guardarFicheroCabecera();
                await me.guardarFicheroAutoridades();
                await me.guardarFicheroDetalleEditoriales();
                // Notificación única de éxito
                me.$vs.notify({
                    title: 'Éxito',
                    text: 'Fichero de mercado creado correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoPost_GuardadoGeneral:', error);
                // Notificación de error global (si quieres que se vea solo una vez)
                if (!error.tipo || error.tipo !== 'validacion') {
                    me.$vs.notify({
                        title: 'Error',
                        text: error || 'Error al guardar el fichero de mercado.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
                me.$vs.loading.close();
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
            }
        },
        async metodoPost_Guardado_AulasEstudiantes() {
            let me = this;
            try {
                me.isrunLoading_metodoPost_GuardadoGeneral = true;
                me.$vs.loading();
                await me.validaciongeneral_antes_de_guardar()
                await me.guardarFicheroCabecera();
                await me.getTraer_Datos_Fichero_x_fmd_id();
                await me.conversionJSON_niveles_educativos();
                await me.consersionJSON_valorPension();
                await me.consersionJSON_numeroAulas();
                await me.consersionJSON_estudiantesPorAula();
                await me.GetLlenado_editar();
                // Notificación única de éxito
                me.$vs.notify({
                    title: 'Éxito',
                    text: 'Sección de aulas y estudiantes actualizada correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoPost_GuardadoGeneral:', error);
                // Notificación de error global (si quieres que se vea solo una vez)
                if (!error.tipo || error.tipo !== 'validacion') {
                    me.$vs.notify({
                        title: 'Error',
                        text: error || 'Error al guardar el fichero de mercado.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
                me.$vs.loading.close();
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
            }
        },

        async metodoPost_Guardado_Personal_Plantel() {
            let me = this;
            try {
                me.isrunLoading_metodoPost_GuardadoGeneral = true;
                me.$vs.loading();
                await me.validaciongeneral_antes_de_guardar()
                await me.guardarFicheroCabecera();
                await me.guardarFicheroAutoridades();
                await me.getTraer_Datos_Fichero_x_fmd_id();
                await me.getTraer_Datos_Fichero_Autoridades_x_fmd_id();
                await me.GetLlenado_editar();
                await me.conversionJSON_personalPlantel();
                // Notificación única de éxito
                me.$vs.notify({
                    title: 'Éxito',
                    text: 'Sección de personal del plantel actualizada correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoPost_GuardadoGeneral:', error);
                // Notificación de error global (si quieres que se vea solo una vez)
                if (!error.tipo || error.tipo !== 'validacion') {
                    me.$vs.notify({
                        title: 'Error',
                        text: error || 'Error al guardar el fichero de mercado.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
                me.$vs.loading.close();
                me.isrunLoading_metodoPost_GuardadoGeneral = false;
            }
        },
        async getTraer_Datos_Fichero_x_fmd_id() {
            return new Promise((resolve, reject) => {
                let fm_id_usar = null;
                if (this.verificarcrear_actualizar == 'crear') {
                    fm_id_usar = this.Fichero_Array_Local.length > 0 ? this.Fichero_Array_Local[0].fm_id : null;
                } else if (this.verificarcrear_actualizar == 'editar') {
                    fm_id_usar = this.Fichero_Array.length > 0 ? this.Fichero_Array[0].fm_id : null;
                }
                let enviardata = {
                    action: 'Busqueda_getTraer_Datos_Fichero_x_fmd_id',
                    fm_id: fm_id_usar
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false && this.isrunLoading_metodoPost_GuardadoGeneral == false) {
                            this.$vs.loading.close();
                        }
                        this.Array_Fichero_Mercado_Cabecera = response.data;
                        // console.log("hollaaaaaallenado");
                        resolve();
                    })
                    .catch(error => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false && this.isrunLoading_metodoPost_GuardadoGeneral == false) {
                            this.$vs.loading.close();
                        }
                        console.error('Error al buscar el fichero de mercado:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getTraer_Datos_Fichero_x_fmd_id", error);
                    });
            });
        },
        async getTraer_Datos_Fichero_Autoridades_x_fmd_id() {
            return new Promise((resolve, reject) => {
                let fm_id_usar = null;
                if (this.verificarcrear_actualizar == 'crear') {
                    fm_id_usar = this.Fichero_Array_Local.length > 0 ? this.Fichero_Array_Local[0].fm_id : null;
                } else if (this.verificarcrear_actualizar == 'editar') {
                    fm_id_usar = this.Fichero_Array.length > 0 ? this.Fichero_Array[0].fm_id : null;
                }
                let enviardata = {
                    action: 'Busqueda_getTraer_Datos_Fichero_Autoridades_x_fmd_id',
                    fm_id: fm_id_usar
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false && this.isrunLoading_metodoPost_GuardadoGeneral == false) {
                            this.$vs.loading.close();
                        }
                        this.Array_Fichero_Mercado_Autoridades = response.data;
                        resolve();
                    })
                    .catch(error => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false && this.isrunLoading_metodoPost_GuardadoGeneral == false) {
                            this.$vs.loading.close();
                        }
                        console.error('Error al buscar el fichero de mercado:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getTraer_Datos_Fichero_Autoridades_x_fmd_id", error);
                    });
            });
        },
        async getTraer_Datos_Fichero_Detalle_x_fmd_id() {
            return new Promise((resolve, reject) => {
                let fm_id_usar = null;
                if (this.verificarcrear_actualizar == 'crear') {
                    fm_id_usar = this.Fichero_Array_Local.length > 0 ? this.Fichero_Array_Local[0].fm_id : null;
                } else if (this.verificarcrear_actualizar == 'editar') {
                    fm_id_usar = this.Fichero_Array.length > 0 ? this.Fichero_Array[0].fm_id : null;
                }
                let enviardata = {
                    action: 'Busqueda_getTraer_Datos_Fichero_Detalle_x_fmd_id',
                    fm_id: fm_id_usar
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        this.Array_Fichero_Mercado_Detalle = response.data;

                        resolve();
                    })
                    .catch(error => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        console.error('Error al buscar el fichero de mercado:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getTraer_Datos_Fichero_Detalle_x_fmd_id", error);
                    });
            });
        },
        async cargarInformacionCompletaEstablecimiento() {
            let me = this;
            return new Promise((resolve, reject) => {
                if (me.isrunLoading_metodoEjecucionGlobal == false) {
                    me.$vs.loading();
                }
                let idInstitucion = this.institucion_Enviar.idInstitucion;
                // console.log('Cargando información completa de la institución:', idInstitucion);
                // Para método GET, usar parámetros en la URL
                let url = `traerInstitucionFichero?institucion_idInstitucion=${idInstitucion}`;
                this.$http.get(this.$server_url + url)
                    .then(response => {
                        // console.log('Información completa de la institución:', response.data);
                        me.institucionSeleccionada = response.data[0];
                        // console.log('✅ Institución actualizada con información completa:', me.institucionSeleccionada);
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error al cargar información completa:', error);
                        if (me.isrunLoading_metodoEjecucionGlobal == false) {
                            me.$vs.loading.close();
                        }
                        reject("cargarInformacionCompletaEstablecimiento", error);
                        // No mostrar error al usuario, continuar con la información básica
                    });
            });
        },
        actualizarFechaMuestreo() {
            return new Promise((resolve, reject) => {
                try {
                    const ahora = new Date();
                    const yyyy = ahora.getFullYear();
                    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
                    const dd = String(ahora.getDate()).padStart(2, '0');
                    const hh = String(ahora.getHours()).padStart(2, '0');
                    const min = String(ahora.getMinutes()).padStart(2, '0');
                    const ss = String(ahora.getSeconds()).padStart(2, '0');
                    this.ficheroData.fechaMuestreo = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
                    resolve();
                } catch (error) {
                    console.error('Error al actualizar la fecha de muestreo:', error);
                    reject("actualizarFechaMuestreo", error);
                }
            });
        },
        getEditorialesActivasTodo() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Editoriales_Activas_Fichero'
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        if (response.data && response.data.length > 0) {
                            this.array_Lista_Editoriales = response.data;
                            resolve();
                        } else {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se encontraron datos de editoriales',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            resolve();
                        }
                    })
                    .catch(error => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getEditorialesActivasTodo", error);
                    });
            });
        },
        getNivelesTodo() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Niveles_Fichero'
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        if (response.data && response.data.length > 0) {
                            this.array_Lista_Niveles = response.data;
                            resolve();
                        } else {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se encontraron datos de niveles',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            resolve();
                        }
                    })
                    .catch(error => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getNivelesTodo", error);
                    });
            });
        },
        async TodasEmpresas() {
            return new Promise((resolve, reject) => {
                let me = this
                me.$http.get(me.$server_url + 'empresa2')
                    .then(res => {
                        me.ArrayEmpresas = res.data
                        resolve()
                    })
                    .catch((e) => {
                        console.log(e)
                        reject("TodasEmpresas", e)
                    })
            })
        },
        getBusqueda_Lista_Series_Fichero() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Lista_Series_Fichero'
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            this.array_Series_Fichero = response.data;
                            resolve();
                        } else {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se encontraron datos de niveles',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getBusqueda_Lista_Series_Fichero", error);
                    });
            });
        },
        getBusqueda_Lista_Areas_X_nombre_serie_Fichero(nombreSerie) {
            return new Promise((resolve, reject) => {
                if (!nombreSerie) {
                    resolve([]); // si no hay nombreSerie, devolver array vacío
                    return;
                }

                let enviardata = {
                    action: 'Lista_Areas_X_nombre_serie_Fichero',
                    nombre_Serie: nombreSerie
                };

                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            resolve(response.data); // <-- aquí devolvemos los datos correctamente
                        } else {
                            resolve([]); // no hay datos, devolvemos array vacío
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar áreas por nombre de serie:', error);
                        reject(error);
                    });
            });
        },
        getBusqueda_Lista_Areas_Fichero(id_serie) {
            this.$vs.loading();
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Lista_Areas_Fichero',
                    id_serie: id_serie
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            this.$vs.loading.close();
                            resolve(response.data); // devolvemos solo los datos
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        reject(error);
                    });
            });
        },
        onChangeSerie(area) {
            // Limpiar el select de área solo de esta fila
            area.idarea = null;
            // Opcional: recargar las áreas desde la API según la nueva serie
            if (area.id_serie && area.id_serie.id_serie) {
                this.getBusqueda_Lista_Areas_Fichero(area.id_serie.id_serie).then(result => {
                    area.areas = result; // llenar el select de áreas solo para esta fila
                });
            } else {
                area.areas = []; // si no hay serie seleccionada, limpiar opciones
            }
        },
        async Todos_CargosAutoridades_Institucion() {
            // console.log(this.institucionSeleccionada.idInstitucion, "sssss");
            // return
            return new Promise((resolve, reject) => {
                let params = {
                    action: "CargosAutoridadesInstitucion_Activas_Fichero",
                };
                this.$http
                    .get(this.$server_url + "Procesar_MetodosGet_Fichero_MercadoController", {
                        params
                    })
                    .then(res => {
                        this.Array_Cargos_Autoridades = res.data
                        resolve()
                    })
                    .catch(e => {
                        console.log(e)
                        reject("Todos_CargosAutoridades_Institucion", e)
                    })
            });
        },
        getEntregaMuestrasTodo() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Fechas_Entrega_muestras_x_institucion',
                    institucion_id: this.ficheroData.idInstitucion,
                    periodo_id: this.ficheroData.idperiodoescolar
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        if (response.data && response.data.items) {
                            this.array_Entrega_Muestras = response.data.items;
                            this.array_Opcioones_Planificacion = response.data.opciones_individuales_seleccionadas;
                            // inicializar el filtrado (mostrar todo)
                            this.array_Entrega_Muestras_filtrado = [...this.array_Entrega_Muestras];
                            resolve();
                        } else {
                            // this.$vs.notify({
                            //     title: 'Error',
                            //     text: 'No se encontraron datos de entrega de muestras',
                            //     color: 'danger',
                            //     iconPack: 'feather',
                            //     icon: 'icon-alert-circle'
                            // });
                            resolve();
                        }
                    })
                    .catch(error => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        console.error('Error al buscar instituciones:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getNivelesTodo", error);
                    });
            });
        },
        filtrarEntregas() {
            if (!this.filtro_opcion) {
                // sin filtro → mostrar todo
                this.array_Entrega_Muestras_filtrado = [...this.array_Entrega_Muestras];
                return;
            }
            this.array_Entrega_Muestras_filtrado = this.array_Entrega_Muestras.filter(item =>
                item.opciones_seleccionadas.includes(this.filtro_opcion)
            );
        },
        editarUsuarioPlantel(index) {
            // console.log(index, "ffff");
            this.popup_EditarUsuario = true;
            this.itemUsuarioPlantelEnviar = index;
        },
        // Cargar información completa de la institución
        async GetLlenado_crear() {
            let me = this;
            return new Promise((resolve, reject) => {
                try {
                    this.ficheroData.idInstitucion = me.institucionSeleccionada.idInstitucion || '';
                    this.ficheroData.nombre = me.institucionSeleccionada.nombreInstitucion || '';
                    this.ficheroData.direccion = me.institucionSeleccionada.direccionInstitucion || '';
                    this.ficheroData.telefono = me.institucionSeleccionada.telefonoInstitucion;
                    this.ficheroData.correo = me.institucionSeleccionada.email || '';
                    this.ficheroData.nombreprovincia = me.institucionSeleccionada.nombreprovincia || '';
                    this.ficheroData.nombre_ciudad = me.institucionSeleccionada.nombre_ciudad || '';
                    this.ficheroData.parr_nombre = me.institucionSeleccionada.parr_nombre || '';
                    this.ficheroData.tipo_Institucion = me.institucionSeleccionada.tipo_descripcion || '';
                    this.ficheroData.forma_Comercializacion = me.institucionSeleccionada.punto_venta || '';
                    this.ficheroData.asesor_nombres = me.institucionSeleccionada.asesor_nombres || '';
                    this.ficheroData.fecha_fundacion = me.institucionSeleccionada.fecha_fundacion || '';
                    this.ficheroData.asesor_id = me.institucionSeleccionada.asesor_id || '';
                    this.ficheroData.idperiodoescolar = me.periodoSeleccionado.idperiodoescolar || '';
                    this.ficheroData.periodoEscolar = me.periodoSeleccionado.descripcion_periodoescolar || '';
                    resolve();
                } catch (error) {
                    console.log("error", error);
                    reject("GetLlenado_crear", error);
                }
            });
        },
        async GetLlenado_editar() {
            let me = this;
            return new Promise((resolve, reject) => {
                try {
                    this.ficheroData.idInstitucion = me.institucionSeleccionada.idInstitucion || '';
                    this.ficheroData.nombre = me.institucionSeleccionada.nombreInstitucion || '';
                    this.ficheroData.direccion = me.institucionSeleccionada.direccionInstitucion || '';
                    this.ficheroData.telefono = me.institucionSeleccionada.telefonoInstitucion;
                    this.ficheroData.correo = me.institucionSeleccionada.email || '';
                    this.ficheroData.nombreprovincia = me.institucionSeleccionada.nombreprovincia || '';
                    this.ficheroData.nombre_ciudad = me.institucionSeleccionada.nombre_ciudad || '';
                    this.ficheroData.parr_nombre = me.institucionSeleccionada.parr_nombre || '';
                    this.ficheroData.tipo_Institucion = me.institucionSeleccionada.tipo_descripcion || '';
                    this.ficheroData.forma_Comercializacion = me.institucionSeleccionada.punto_venta || '';
                    this.ficheroData.asesor_nombres = me.institucionSeleccionada.asesor_nombres || '';
                    this.ficheroData.fecha_fundacion = me.institucionSeleccionada.fecha_fundacion || '';
                    this.ficheroData.asesor_id = me.institucionSeleccionada.asesor_id || '';
                    this.ficheroData.idperiodoescolar = me.periodoSeleccionado.idperiodoescolar || '';
                    this.ficheroData.periodoEscolar = me.periodoSeleccionado.descripcion_periodoescolar || '';
                    this.ficheroData.SumaTotal_EstudiantesxAula = me.Array_Fichero_Mercado_Cabecera[0].fm_SumaTotal_EstudiantesxAula || '';
                    this.ficheroData.cantidad_real_estudiantes = me.Array_Fichero_Mercado_Cabecera[0].fm_cantidad_real_estudiantes || '';
                    this.ficheroData.observaciones = me.Array_Fichero_Mercado_Cabecera[0].fm_observacion || '';
                    this.ficheroData.id_logo_empresa = me.Array_Fichero_Mercado_Cabecera[0].id_logo_empresa || '';
                    this.ficheroData.info_aprobacion = me.Array_Fichero_Mercado_Cabecera[0].info_aprobacion || '';
                    this.ficheroData.trabaja_con_prolipa = me.Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa;
                    this.ficheroData.fm_es_distribuidor = me.Array_Fichero_Mercado_Cabecera[0].fm_es_distribuidor == '1' ? true : false;
                    this.ficheroData.fm_convenio = me.Array_Fichero_Mercado_Cabecera[0].fm_convenio;
                    this.ficheroData.fm_cantidad_anios_trabaja_con_prolipa = me.Array_Fichero_Mercado_Cabecera[0].fm_cantidad_anios_trabaja_con_prolipa || 0;
                    this.ficheroData.fm_tipo_venta = me.Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta || null;
                    this.fm_id = me.Array_Fichero_Mercado_Cabecera[0].fm_id || '';
                    resolve();
                } catch (error) {
                    console.log("error", error);
                    reject("GetLlenado_editar", error);
                }
            });
        },
        async conversionJSON_factores_inciden_compra() {
            let me = this;
            return new Promise((resolve, reject) => {
                try {
                    // Parsear JSON guardado
                    const data = JSON.parse(me.Array_Fichero_Mercado_Cabecera[0].fm_factores_inciden_en_compra);
                    // Iniciales (si existen en el JSON, de lo contrario false)
                    me.ficheroData.factores_inciden_compra = {
                        precio: !!data.precio,
                        contenido: !!data.contenido,
                        pedagogia: !!data.pedagogia,
                        servicios: !!data.servicios
                    };
                    // Extra: todo lo que no esté en las iniciales
                    me.ficheroData.factores_inciden_compra_extra = Object.keys(data)
                        .filter(k => !['precio', 'contenido', 'pedagogia', 'servicios'].includes(k))
                        .map(k => ({
                            nombre: k,
                            checked: data[k]
                        }));
                    resolve();
                } catch (error) {
                    console.log("error", error);
                    reject("conversionJSON_factores_inciden_compra", error);
                }
            });
        },
        async conversionJSON_niveles_educativos() {
            let me = this;
            return new Promise((resolve, reject) => {
                try {
                    const rawData = me.Array_Fichero_Mercado_Cabecera[0].fm_niveles_educativos;
                    // Si viene null o vacío, usamos valores por defecto
                    const niveles_educativos = rawData ?
                        JSON.parse(rawData) : {
                            iniciales: false,
                            preparatoria: false,
                            elemental: false,
                            medio: false,
                            superior: false,
                            bachillerato: false
                        };
                    // Asignamos al objeto ficheroData, asegurando que siempre tenga un booleano
                    me.ficheroData.Niveles_Educativos = {
                        iniciales: !!niveles_educativos.iniciales,
                        preparatoria: !!niveles_educativos.preparatoria,
                        elemental: !!niveles_educativos.elemental,
                        medio: !!niveles_educativos.medio,
                        superior: !!niveles_educativos.superior,
                        bachillerato: !!niveles_educativos.bachillerato
                    };

                    resolve();
                } catch (error) {
                    console.log("error", error);
                    reject("conversionJSON_niveles_educativos", error);
                }
            });
        },
        async consersionJSON_valorPension() {
            let me = this;
            return new Promise((resolve, reject) => {
                try {
                    //LOGICA PARA JSON pensiones
                    const pensiones = JSON.parse(me.Array_Fichero_Mercado_Cabecera[0].fm_pensiones);
                    me.ficheroData.valorPension = {
                        iniciales: pensiones.iniciales || '',
                        preparatoria: pensiones.preparatoria || '',
                        elemental: pensiones.elemental || '',
                        medio: pensiones.medio || '',
                        superior: pensiones.superior || '',
                        bachillerato: pensiones.bachillerato || ''
                    };
                    resolve();
                } catch (error) {
                    console.log("error", error);
                    reject("consersionJSON_valorPension", error);
                }
            });
        },
        async consersionJSON_numeroAulas() {
            let me = this;
            // Número de aulas por nivel
            return new Promise((resolve, reject) => {
                try {
                    const numeroAulas = JSON.parse(me.Array_Fichero_Mercado_Cabecera[0].fm_numero_aulas_completo);
                    // Inicializamos el objeto donde se almacenarán las aulas
                    this.ficheroData.numeroAulas = {};
                    // Recorremos los niveles visibles en la tabla
                    this.array_Lista_Niveles.forEach((nivel, index) => {
                        // Buscamos si ese idnivel existe en la respuesta del backend
                        const registro = numeroAulas.find(item => item.idnivel === nivel.idnivel);
                        // Asignamos el número de aulas o 0 si no existe
                        this.ficheroData.numeroAulas[`grado_${index + 1}`] = registro ? registro.numeroAulas : 0;
                    });
                    resolve();

                } catch (e) {
                    console.error("Error al parsear fm_numero_aulas_completo:", e);
                    this.ficheroData.numeroAulas = {};
                    // Si quieres, puedes dejar todos los valores en 0:
                    this.array_Lista_Niveles.forEach((_, index) => {
                        this.ficheroData.numeroAulas[`grado_${index + 1}`] = 0;
                    });
                    reject("consersionJSON_numeroAulas", e);
                }
            });
        },
        async consersionJSON_estudiantesPorAula() {
            let me = this;
            return new Promise((resolve, reject) => {
                // Estudiantes por aula
                try {
                    const estudiantesPorNivel = JSON.parse(me.Array_Fichero_Mercado_Cabecera[0].fm_cantidad_estudiantes_x_aula_completo);
                    // Inicializamos el objeto donde guardaremos los valores
                    this.ficheroData.estudiantesPorAula = {};
                    // Recorremos los niveles que se muestran en la tabla
                    this.array_Lista_Niveles.forEach((nivel, index) => {
                        // Buscamos si ese idnivel está en la respuesta
                        const registro = estudiantesPorNivel.find(item => item.idnivel === nivel.idnivel);
                        if (registro && Array.isArray(registro.estudiantesXAula)) {
                            // Recorremos cada aula del nivel y asignamos su valor al objeto
                            registro.estudiantesXAula.forEach((valor, i) => {
                                // i comienza en 0, por eso usamos (i + 1)
                                this.ficheroData.estudiantesPorAula[`grado_${index + 1}_aula_${i + 1}`] = valor;
                            });
                        } else {
                            // Si no hay registro o está vacío, ponemos en 0 las aulas existentes
                            const cantidadAulas = this.ficheroData.numeroAulas[`grado_${index + 1}`] || 0;
                            for (let i = 1; i <= cantidadAulas; i++) {
                                this.ficheroData.estudiantesPorAula[`grado_${index + 1}_aula_${i}`] = '';
                            }
                        }
                    });
                    resolve();
                } catch (e) {
                    console.error("Error al parsear fm_cantidad_estudiantes_x_aula_completo:", e);
                    this.ficheroData.estudiantesPorAula = {};
                    reject("consersionJSON_estudiantesPorAula", e);
                }
            });
        },
        async conversionJSON_personalPlantel() {
            let me = this;
            return new Promise((resolve, reject) => {
                // Estudiantes por aula
                try {
                    // Verificar si la cabecera tiene el campo fm_decide_compra
                    let decideCompraArray = [];
                    decideCompraArray = JSON.parse(this.Array_Fichero_Mercado_Cabecera[0].fm_decide_compra);
                    // Mapear la información de autoridades a la estructura del formulario
                    this.ficheroData.personalPlantel = this.Array_Fichero_Mercado_Autoridades.map(item => {
                        // Buscar si este usuario está en el array fm_decide_compra
                        const decideData = decideCompraArray.find(dc => dc.idusuario === item.idusuario);
                        const decideValue = decideData ? !!decideData.decideCompra : false;
                        return {
                            idusuario: item.idusuario,
                            fma_cargo: item.fma_cargo || '',
                            nombre: item.nombre || '',
                            nombres: item.nombres,
                            apellidos: item.apellidos,
                            cedula: item.cedula != null ? item.cedula : null,
                            telefono: item.telefono || '',
                            email: item.email || '',
                            fecha_nacimiento: item.fecha_nacimiento || '',
                            decideCompra: decideValue // ✅ Se marca el switch según fm_decide_compra
                        };
                    });
                    resolve();
                } catch (e) {
                    console.error("Error al parsear fm_cantidad_estudiantes_x_aula_completo:", e);
                    reject("conversionJSON_personalPlantel", e);
                }
            });
        },
        async consersionJSON_editoriales() {
            let me = this;
            return new Promise(async (resolve, reject) => {
                try {
                    this.ficheroData.editoriales = [];

                    for (let item of this.Array_Fichero_Mercado_Detalle) {

                        const nivelesAPI = JSON.parse(item.fmd_niveles_editoriales || '[]');
                        const grados = {};
                        const editorialesUsadas = new Set();

                        // Construcción de grados
                        me.array_Lista_Niveles.forEach((nivelTabla, index) => {
                            const nivelEncontrado = nivelesAPI.find(n => n.idnivel === nivelTabla.idnivel);
                            const valor = nivelEncontrado ? nivelEncontrado.editorialesSeleccionadas : [];

                            grados[`grado_${index + 1}`] = Array.isArray(valor) ?
                                valor :
                                (valor ? [valor] : []);

                            // Recolectar editoriales no nulas
                            grados[`grado_${index + 1}`].forEach(id => {
                                if (id != null) editorialesUsadas.add(id);
                            });
                        });

                        // Editorial común
                        let editorialComun = null;
                        if (editorialesUsadas.size === 1) {
                            editorialComun = [...editorialesUsadas][0];
                        }

                        // Separar nombre serie | área
                        let nombreSerie = item.fmd_nombre_libro;
                        let nombreArea = null;

                        if (nombreSerie.includes('|')) {
                            const parts = nombreSerie.split('|').map(p => p.trim());
                            nombreSerie = parts[0];
                            nombreArea = parts[1] || null;
                        }

                        const hayGrado1 = Object.values(grados).some(v => v.includes(1));

                        // OBJETO PRINCIPAL DEL ÁREA
                        let areaObj = {
                            fmd_id: item.fmd_id,
                            grados,
                            nombre_Libros: item.fmd_nombre_libro,
                            areas: [],
                            editorialComun,

                            // Para validación visual
                            classValidarNombre: "",

                            // Guardar modo anterior para detectar cambios 1 ↔ otro
                            _editorialAnterior: editorialComun,

                            id_serie: null,
                            idarea: null
                        };

                        // ---- MODO SELECT (cuando hay grado con editorial 1)
                        if (hayGrado1) {
                            areaObj.id_serie = {
                                nombre_serie: nombreSerie
                            };

                            if (nombreArea) {
                                areaObj.idarea = {
                                    nombrearea: nombreArea
                                };
                            }

                            try {
                                const areasResult = await me.getBusqueda_Lista_Areas_X_nombre_serie_Fichero(nombreSerie);
                                areaObj.areas = areasResult || [];

                                if (nombreArea && areaObj.areas.length > 0) {
                                    const match = areaObj.areas.find(a => a.nombrearea === nombreArea);
                                    areaObj.idarea = match || null;
                                }
                            } catch (e) {
                                areaObj.areas = [];
                                areaObj.idarea = null;
                            }

                            // ---- MODO INPUT (no hay grado con editorial 1)
                        } else {

                            areaObj.id_serie = nombreSerie; // string limpio
                            areaObj.idarea = null;
                            areaObj.areas = [];
                        }

                        this.ficheroData.editoriales.push(areaObj);
                    }

                    resolve();

                } catch (e) {
                    console.error("Error al parsear editoriales:", e);
                    me.ficheroData.editoriales = [];
                    reject("consersionJSON_editoriales", e);
                }
            });
        },
        // ¿El checkbox debe estar marcado?
        isChecked(area, gradoIndex) {
            const key = `grado_${gradoIndex}`;
            const valores = area.grados[key] || [];
            const ediComun = area.editorialComun;

            // Solo true si:
            // 1. Hay editorial común
            // 2. El grado tiene exactamente ese edi_id
            return ediComun != null &&
                Array.isArray(valores) &&
                valores.length === 1 &&
                valores[0] === ediComun;
        },

        // Al hacer clic en el checkbox
        onCheckboxToggle(area, gradoIndex, checked) {
            const key = `grado_${gradoIndex}`;
            const edi_id = area.editorialComun;

            if (!edi_id) {
                this.$set(area.grados, key, []);
                return;
            }

            // Forzar inicialización
            if (!area.grados[key]) {
                this.$set(area.grados, key, []);
            }

            if (checked) {
                // Marcar: asignar el edi_id actual
                this.$set(area.grados, key, [edi_id]);
            } else {
                // Desmarcar: SIEMPRE vaciar
                this.$set(area.grados, key, []);
            }

            // Forzar reactividad
            this.$forceUpdate();
        },
        // Al cambiar editorial común
        onChangeEditorialComun(area) {
            const nuevoId = Number(area.editorialComun);
            const anteriorId = Number(area._editorialAnterior);

            // Actualizar referencia para la siguiente vez
            area._editorialAnterior = nuevoId;

            // Actualizar grados si ya tenían valores
            this.array_Lista_Niveles.forEach((_, idx) => {
                const key = `grado_${idx + 1}`;
                const actual = area.grados[key] || [];

                if (actual.length > 0) {
                    this.$set(area.grados, key, nuevoId ? [nuevoId] : []);
                }
            });

            // ¿Hubo cambio de modo entre "1" ↔ "no 1"?
            const cambioModo =
                (anteriorId === 1 && nuevoId !== 1) ||
                (anteriorId !== 1 && nuevoId === 1);

            if (cambioModo) {
                this.$nextTick(() => {
                    if (nuevoId === 1) {
                        // ⮕ MODO SELECT
                        area.id_serie = null;
                        area.idarea = null;
                        area.areas = [];
                        area.nombre_Libros = "";
                    } else {
                        // ⮕ MODO INPUT
                        area.id_serie = "";
                        area.idarea = null;
                        area.areas = [];
                        area.nombre_Libros = "";
                    }

                    area.classValidarNombre = "";
                });
            }

            this.validarEditorialesPorFila();
        },
        // Al agregar área nueva
        agregarArea() {
            const nuevo = {
                nombre_Libros: "",
                grados: {}, // ← vacío
                editorialComun: null,
                areas: [],
                id_serie: null,
                _editorialAnterior: null,
                idarea: null
            };

            // Inicializar grados vacíos (importante para $set)
            this.array_Lista_Niveles.forEach((_, i) => {
                const key = `grado_${i + 1}`;
                this.$set(nuevo.grados, key, []);
            });

            this.ficheroData.editoriales.push(nuevo);

            this.$vs.notify({
                title: 'Editoriales con las que trabajan',
                text: 'Se agregó una nueva columna.',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-check'
            });
        },
        eliminarArea(index) {
            // Guardar el número de columna ANTES de eliminarla
            const filaEliminada = index + 1;
            // Eliminar columna
            this.ficheroData.editoriales.splice(index, 1);
            // Notificación
            this.$vs.notify({
                title: 'Editoriales con las que trabajan',
                text: `Se eliminó la columna ${filaEliminada}.`,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-trash'
            });
        },
        // Guardar fichero Cabecera
        async guardarFicheroCabecera() {
            let me = this;
            return new Promise((resolve, reject) => {
                let usuariorespo = localStorage.getItem("usuario");
                let usuariolocal = JSON.parse(usuariorespo);
                // Filtra y transforma los datos del personal del plantel
                let decideCompraFiltrado = me.ficheroData.personalPlantel
                    .filter(u => u.decideCompra == true) // solo los que tienen decideCompra = true
                    .map(u => ({
                        idusuario: u.idusuario,
                        decideCompra: u.decideCompra
                    }));
                // Generar JSON de aulas completo
                let numeroAulasCompleto = me.array_Lista_Niveles.map((nivel, index) => {
                    return {
                        idnivel: nivel.idnivel,
                        numeroAulas: me.ficheroData.numeroAulas[`grado_${index + 1}`] || 0
                    };
                });
                // JSON de estudiantes por aula
                let estudiantesPorAulaCompleto = me.array_Lista_Niveles.map((nivel, index) => {
                    let idNivel = nivel.idnivel;
                    let totalAulas = me.ficheroData.numeroAulas[`grado_${index + 1}`] || 0;
                    // Crear array de estudiantes por cada aula
                    let estudiantesXAula = [];
                    for (let i = 1; i <= totalAulas; i++) {
                        let valor = me.ficheroData.estudiantesPorAula[`grado_${index + 1}_aula_${i}`] || 0;
                        estudiantesXAula.push(valor);
                    }
                    return {
                        idnivel: idNivel,
                        estudiantesXAula: estudiantesXAula
                    };
                });
                // AGRUPAR FACTORES QUE INCIDEN EN LA COMPRA
                // Solo tomar los factores extra que estén con check
                const factoresExtra = me.ficheroData.factores_inciden_compra_extra
                    .filter(item => item.checked) // <-- solo los marcados
                    .reduce((acc, item) => {
                        acc[item.nombre] = item.checked;
                        return acc;
                    }, {});
                // Unir iniciales y extras
                const factoresCompletos = {
                    ...me.ficheroData.factores_inciden_compra,
                    ...factoresExtra
                };
                let data_Guardado = {
                    action: 'GuardarDatos_guardarFicheroCabecera',
                    fm_id: me.fm_id || null, // si tiene fm_id es edición
                    idInstitucion: me.ficheroData.idInstitucion,
                    asesor_id: me.ficheroData.asesor_id,
                    idperiodoescolar: me.ficheroData.idperiodoescolar,
                    id_logo_empresa: me.ficheroData.id_logo_empresa,
                    fm_decide_compra: decideCompraFiltrado,
                    fm_factores_inciden_en_compra: factoresCompletos,
                    fm_niveles_educativos: me.ficheroData.Niveles_Educativos,
                    fm_pensiones: me.ficheroData.valorPension,
                    fm_numero_aulas_completo: numeroAulasCompleto,
                    fm_cantidad_estudiantes_x_aula_completo: estudiantesPorAulaCompleto,
                    fm_SumaTotal_EstudiantesxAula: me.ficheroData.SumaTotal_EstudiantesxAula,
                    fm_cantidad_real_estudiantes: me.ficheroData.cantidad_real_estudiantes,
                    fm_observacion: me.ficheroData.observaciones,
                    user_created: usuariolocal.idusuario,
                    user_edit: usuariolocal.idusuario,
                    usuarioRoot: this.userRoot,
                    fm_trabaja_con_prolipa: me.ficheroData.trabaja_con_prolipa,
                    fm_es_distribuidor: me.ficheroData.fm_es_distribuidor ? '1' : '2',
                    fm_convenio: me.ficheroData.fm_convenio,
                    fm_cantidad_anios_trabaja_con_prolipa: me.ficheroData.fm_cantidad_anios_trabaja_con_prolipa,
                    fm_tipo_venta: me.ficheroData.fm_tipo_venta,
                    fm_establecimientos_para_despacho: me.ficheroData.fm_establecimientos_para_despacho.map(
                        i => i.idInstitucion
                    )
                };
                // console.log(data_Guardado, "testtttt");
                // // resolve();
                // reject("estamos en pruebaS");
                // return;
                me.$http.post(me.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', data_Guardado)
                    .then(response => {
                        if (response.data.status == 1) {
                            me.fm_id = response.data.fm_id;
                            resolve();
                        } else if (response.data.status == 0) {
                            me.$vs.notify({
                                title: 'Advertencia',
                                text: response.data.message,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-triangle',
                                time: 8000
                            });
                            reject({
                                tipo: 'validacion',
                                mensaje: "guardarFicheroCabecera else if 0" + response.data.message
                            });
                        } else if (response.data.status == 2) {
                            me.validarcampo_buscar_fm_tipo_venta(response.data.message);
                            reject({
                                tipo: 'validacion',
                                mensaje: "guardarFicheroCabecera else if 2" + response.data.message
                            });

                        } else {
                            reject({
                                tipo: 'validacion',
                                mensaje: "guardarFicheroCabecera else" + response.data.message
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error al guardar fichero:', error);
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar el fichero de mercado.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("guardarFicheroCabecera catch", error);
                    });
            });
        },
        async guardarFicheroAutoridades() {
            let me = this;
            return new Promise((resolve, reject) => {
                let data_Guardado = {
                    action: 'GuardarDatos_guardarFicheroAutoridades',
                    fm_id: me.fm_id,
                    personal_plantel_array: me.ficheroData.personalPlantel,
                };
                // console.log(data_Guardado, "testtttt_autoridades");
                // resolve();
                // return;
                me.$http.post(me.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', data_Guardado)
                    .then(response => {
                        if (response.data.status == 1) {
                            resolve();
                        } else {
                            reject("guardarFicheroAutoridades else", response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error al guardar fichero:', error);
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar el fichero de mercado.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("guardarFicheroAutoridades catch", error);
                    });
            });
        },
        async guardarFicheroDetalleEditoriales() {
            let me = this;
            return new Promise((resolve, reject) => {
                // Recorrer las áreas
                let editorialesPorArea = me.ficheroData.editoriales.map(area => {
                    // Recorrer los 15 niveles
                    let grados = [];
                    for (let n = 1; n <= 15; n++) {
                        // grados.push({
                        //     idnivel: me.array_Lista_Niveles[n - 1].idnivel,
                        //     editorialesSeleccionadas: area.grados[`grado_${n}`] || [] // array de id de editoriales
                        // });
                        grados.push({
                            idnivel: me.array_Lista_Niveles[n - 1].idnivel,
                            editorialesSeleccionadas: Array.isArray(area.grados[`grado_${n}`]) ?
                                (
                                    area.grados[`grado_${n}`].length > 0 ?
                                    area.grados[`grado_${n}`][0] // cuando hay selección → 1
                                    :
                                    [] // cuando está vacío
                                ) : (area.grados[`grado_${n}`] !== undefined && area.grados[`grado_${n}`] !== null ?
                                    area.grados[`grado_${n}`] : [])
                        });
                    }
                    return {
                        nombre_Libros: area.nombre_Libros,
                        grados: grados
                    };
                });
                let data_Guardado = {
                    action: 'GuardarDatos_guardarFicheroDetalleEditoriales',
                    fm_id: me.fm_id,
                    fmd_niveles_editoriales: editorialesPorArea,
                };
                // console.log(data_Guardado, "testtttt_editoriales");
                // resolve();
                // return;
                me.$http.post(me.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', data_Guardado)
                    .then(response => {
                        if (response.data.status == 1) {
                            resolve();
                        } else {
                            reject("guardarFicheroDetalleEditoriales else", response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error al guardar fichero:', error);
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar el fichero de mercado.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("guardarFicheroDetalleEditoriales catch", error);
                    });
            });
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
        get_DecidelaCompra() {
            this.popup_Decidelacompra = true;
        },
        get_EstablecimientoParaDespacho() {
            this.popup_EstablecimientoParaDespacho = true;
        },
        actualizartabla_EstablecimientoParaDespacho() {
            this.popup_EstablecimientoParaDespacho = false;
        },
        eliminarInstitucionDespacho(index) {
            const inst = this.ficheroData.fm_establecimientos_para_despacho[index];
            if (!inst) return;

            const idInstitucion_despacho = inst.idInstitucion;
            const nombreEst = inst.nombreInstitucion || `ID: ${idInstitucion_despacho}`;

            // Si no hay fm_id (fichero no guardado aún) se elimina directo
            if (!this.fm_id) {
                this.ficheroData.fm_establecimientos_para_despacho.splice(index, 1);
                this.$vs.notify({
                    title: 'Eliminado',
                    text: 'Establecimiento eliminado de la lista.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-trash-2'
                });
                return;
            }

            // Consultar al backend si tiene ventas activas
            this.validarDespacho_cargando = true;
            this.$vs.loading();

            this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                params: {
                    action: 'Validar_EliminarEstablecimientoDespacho',
                    fm_id: this.fm_id,
                    idperiodoescolar: this.ficheroData.idperiodoescolar,
                    idInstitucion_despacho: idInstitucion_despacho
                }
            }).then(res => {
                this.$vs.loading.close();
                this.validarDespacho_cargando = false;

                const data = res.data || {};
                if (data.puede_eliminar) {
                    // Sin restricciones → eliminar directamente
                    this.ficheroData.fm_establecimientos_para_despacho.splice(index, 1);
                    this.$vs.notify({
                        title: 'Eliminado',
                        text: `El establecimiento "${nombreEst}" fue eliminado de la lista.`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-trash-2'
                    });
                } else {
                    // Tiene ventas activas → mostrar popup con detalle
                    this.validarDespacho_ventasEncontradas = data.ventas || [];
                    this.validarDespacho_nombreEstablecimiento = nombreEst;
                    this.popup_ValidarEliminarDespacho = true;
                }
            }).catch(err => {
                this.$vs.loading.close();
                this.validarDespacho_cargando = false;
                console.error('Error al validar eliminación de despacho:', err);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudo validar la eliminación. Intente nuevamente.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },
        changeHandle_EstablecimientoParaDespacho(e) {
            if (e.verificar_EstablecimientoParaDespacho === 1) {
                const ya = this.ficheroData.fm_establecimientos_para_despacho
                    .find(i => i.idInstitucion === e.institucion.idInstitucion);
                if (!ya) {
                    this.ficheroData.fm_establecimientos_para_despacho.push(e.institucion);
                }
            }
        },
        async getInstitucionesParaDespacho() {
            return new Promise((resolve) => {
                try {
                    const raw = this.Array_Fichero_Mercado_Cabecera[0].fm_establecimientos_para_despacho;
                    if (!raw) {
                        resolve();
                        return;
                    }
                    let ids = [];
                    try {
                        ids = JSON.parse(raw);
                    } catch (e) {
                        resolve();
                        return;
                    }
                    if (!Array.isArray(ids) || ids.length === 0) {
                        resolve();
                        return;
                    }

                    this.$http.post(this.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', {
                        action: 'ConsultaInstitucionesxFichero_Para_Despacho',
                        ids_instituciones: ids
                    }).then(res => {
                        this.ficheroData.fm_establecimientos_para_despacho = res.data || [];
                        resolve();
                    }).catch(() => {
                        resolve();
                    });
                } catch (e) {
                    resolve();
                }
            });
        },
        get_editarDatosInstitucion() {
            this.popup_ActualizarInstitucion = true;
        },
        changeHandle_Decidelacompra(e) {
            let me = this;
            // console.log(e.usuarios, "fff");
            if (e.verificaragregarusuarioplantel == 1) {
                console.log("Emit recibido por aceptar.");
                // Aseguramos que sea array
                if (!Array.isArray(me.ficheroData.personalPlantel)) {
                    me.ficheroData.personalPlantel = [];
                }
                // Primer paso: push de los nuevos usuarios
                e.usuarios.forEach(usuario => {
                    me.ficheroData.personalPlantel.push({
                        idusuario: usuario.idusuario,
                        cedula: usuario.cedula,
                        fma_cargo: null,
                        nombre: usuario.nombres + " " + usuario.apellidos,
                        nombres: usuario.nombres,
                        apellidos: usuario.apellidos,
                        telefono: usuario.telefono || "",
                        email: usuario.email || "",
                        fecha_nacimiento: usuario.fecha_nacimiento || "",
                        decideCompra: false
                    });
                });
                if (me.ficheroData.personalPlantel.length > 0) {
                    this.actualizartabla_personalPlantel()
                }
                // Cerramos popup
                // me.popup_Decidelacompra = false;

            } else if (e.verificaragregarusuarioplantel == 2) {
                console.log("Emit recibido por cerrar.");
                me.popup_Decidelacompra = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandle_CrearEditarUsuario(e) {
            let me = this;
            // me.$vs.loading();
            if (e.verificar_CrearEditarUsuario == 1) {
                console.log("Emit recibido por aceptar.");
                me.popup_EditarUsuario = false;
                me.actualizartabla_personalPlantel();
            } else if (e.verificar_CrearEditarUsuario == 2) {
                console.log("Emit recibido por cerrar.");
                me.popup_EditarUsuario = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        async changeHandle_ActualizarInstitucion(e) {
            let me = this;
            // me.$vs.loading();
            if (e.verificar_ActualizarInstitucion == 1) {
                console.log("Emit recibido por aceptar.");
                me.popup_ActualizarInstitucion = false;
                // this.metodoEjecucionGlobal();
                await me.cargarInformacionCompletaEstablecimiento();
                await me.GetLlenado_crear();
            } else if (e.verificar_ActualizarInstitucion == 2) {
                console.log("Emit recibido por cerrar.");
                me.popup_ActualizarInstitucion = false;
            } else {
                console.log("Emit no recibido");
            }
        },

        async actualizartabla_personalPlantel() {
            let me = this;
            if (me.ficheroData.personalPlantel.length === 0) {
                console.log("No hay personal del plantel");
                return;
            }
            me.$vs.loading();
            try {
                let decideCompraArray = [];

                // 🔹 Solo si está en modo edición cargamos los decideCompra guardados
                if ((me.verificarcrear_actualizar == 'editar' || me.verificarcrear_actualizar == 'crear') && me.Array_Fichero_Mercado_Cabecera.length > 0) {
                    try {
                        decideCompraArray = JSON.parse(me.Array_Fichero_Mercado_Cabecera[0].fm_decide_compra || "[]");
                    } catch (error) {
                        console.warn("Error al parsear fm_decide_compra:", error);
                        decideCompraArray = [];
                    }
                }
                // 🔹 Recorremos el personal del plantel
                for (let index = 0; index < me.ficheroData.personalPlantel.length; index++) {
                    const usuario = me.ficheroData.personalPlantel[index];
                    let parametrosxfiltro = {
                        action: "Get_Busqueda_UsuarioxIDUsuarioFICHERO",
                        idusuario_enviar: usuario.idusuario
                    };
                    try {
                        const res = await me.$http.get(me.$server_url + "VerifcarMetodosGet_UsuarioController", {
                            params: parametrosxfiltro
                        });
                        if (res.data && res.data.length > 0) {
                            let decideValue = false;
                            // 🔹 Si estamos en edición, buscamos si este usuario tenía decideCompra
                            if ((me.verificarcrear_actualizar == 'editar' || me.verificarcrear_actualizar == 'crear') && decideCompraArray.length > 0) {
                                const decideData = decideCompraArray.find(dc => dc.idusuario === res.data[0].idusuario);
                                decideValue = decideData ? !!decideData.decideCompra : false;
                            }
                            // 🔹 Actualizamos los datos del usuario
                            me.$set(me.ficheroData.personalPlantel, index, {
                                idusuario: res.data[0].idusuario,
                                cedula: res.data[0].cedula,
                                fma_cargo: usuario.fma_cargo,
                                nombre: res.data[0].nombres + " " + res.data[0].apellidos,
                                telefono: res.data[0].telefono || "",
                                email: res.data[0].email || "",
                                nombres: res.data[0].nombres,
                                apellidos: res.data[0].apellidos,
                                fecha_nacimiento: res.data[0].fecha_nacimiento,
                                decideCompra: decideValue
                            });
                        }
                    } catch (err) {
                        console.error(`Error al refrescar usuario con cédula ${usuario.cedula}:`, err);
                    }
                }
            } catch (err) {
                console.error("Error inesperado al actualizar personal del plantel:", err);
            } finally {
                me.$vs.loading.close(); // Cerrar loading aunque haya error
            }
        },

        eliminarUsuario(index) {
            this.ficheroData.personalPlantel.splice(index, 1);
            this.$vs.notify({
                text: 'Usuario eliminado correctamente',
                color: 'danger'
            });
        },
        // Validaciones del fichero de mercado
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');
            // Filtrar solo los números y el punto
            const numbersOnly = pastedText.replace(/[^\d.]/g, '');
            document.execCommand("insertText", false, numbersOnly);
            event.preventDefault();
        },

        validarkey_FicheroData_Valor_Pension(event, campo) {
            let valor = this.ficheroData.valorPension[campo] || '';
            // Permitir solo números, punto o coma
            if (!/\d|\.|,/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Reemplazar coma por punto
            if (valor.includes(',')) {
                valor = valor.replace(',', '.');
                this.ficheroData.valorPension[campo] = valor;
            }
            // Limitar hasta 10 enteros y 2 decimales
            if (!/^\d{0,10}(\.\d{0,2})?$/.test(valor)) {
                this.ficheroData.valorPension[campo] = '';
            }
        },
        validarkey_SoloEnteros(event) {
            if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
            }
        },
        // Método general antes de guardar
        async validaciongeneral_antes_de_guardar() {
            return new Promise((resolve, reject) => {
                try {
                    // Validación plantel
                    const indicesCargoVacios = this.ficheroData.personalPlantel
                        .map((usuario, index) => {
                            // Si fma_cargo es null, undefined, vacío o 0 (sin seleccionar)
                            if (usuario.fma_cargo === null || usuario.fma_cargo === undefined || usuario.fma_cargo === '' || usuario.fma_cargo === 0) {
                                return index;
                            }
                            return -1;
                        })
                        .filter(i => i !== -1);
                    if (indicesCargoVacios.length > 0) {
                        this.validarTodosCargosPersonalPlantel(indicesCargoVacios);
                        reject({
                            tipo: 'validacion',
                            mensaje: 'Existen campos de "Cargo" vacíos'
                        });
                        return;
                    }

                    // --- NUEVA Validación EDITORIALES (solo si NO hay editorial Y NO hay checks) ---
                    const indicesSinEditorial = this.ficheroData.editoriales
                        .map((area, index) => (area.editorialComun == null ? index : -1))
                        .filter(i => i !== -1);

                    if (indicesSinEditorial.length > 0) {
                        this.validarEditorialesVacias(indicesSinEditorial);
                        reject({
                            tipo: 'validacion',
                            mensaje: 'Cada libro/área debe tener una editorial seleccionada.'
                        });
                        return;
                    }

                    // Validación libros/áreas
                    const indicesNombreVacios = this.ficheroData.editoriales
                        .map((area, index) => (!area.nombre_Libros || area.nombre_Libros.trim() === '' ? index : -1))
                        .filter(i => i !== -1);
                    if (indicesNombreVacios.length > 0) {
                        this.validarTodosCamposNombreAreas(indicesNombreVacios);
                        reject({
                            tipo: 'validacion',
                            mensaje: 'Existen campos de "Nombre de libro/área" vacíos'
                        });
                        return;
                    }

                    // --- Validación: Cada área/libro debe tener al menos un nivel (checkbox) marcado ---
                    const indicesSinNivelesMarcados = this.ficheroData.editoriales
                        .map((area, index) => {
                            const tieneAlgunCheck = Object.values(area.grados || {}).some(val =>
                                Array.isArray(val) && val.length > 0
                            );
                            return !tieneAlgunCheck ? index : -1;
                        })
                        .filter(i => i !== -1);

                    if (indicesSinNivelesMarcados.length > 0) {
                        this.validarNivelesNoMarcados(indicesSinNivelesMarcados);
                        reject({
                            tipo: 'validacion',
                            mensaje: 'Cada libro/área debe tener al menos un nivel (checkbox) marcado.'
                        });
                        return;
                    }

                    // 🔹 Validación pensiones (solo si el checkbox está activo)
                    const niveles = ['iniciales', 'preparatoria', 'elemental', 'medio', 'superior', 'bachillerato'];
                    const indicesPensionVacios = niveles.filter(nivel => {
                        if (!this.ficheroData.Niveles_Educativos[nivel]) return false;
                        const valor = this.ficheroData.valorPension[nivel];
                        // vacío si null, undefined, '', 0 o NaN
                        return valor === null || valor === undefined || valor === '' || Number(valor) === 0 || isNaN(valor);
                    });

                    if (indicesPensionVacios.length > 0) {
                        this.validarTodosCamposPension(indicesPensionVacios);
                        reject({
                            tipo: 'validacion',
                            mensaje: 'Existen campos de "Valor de Pensión" vacíos'
                        });
                        return;
                    }
                    // 🔹 Validación # de aulas por bloque usando seccionColumnas
                    for (const bloque in this.seccionColumnas) {
                        if (!this.ficheroData.Niveles_Educativos[bloque]) continue; // checkbox no activo
                        const grados = this.seccionColumnas[bloque];
                        const todosVacios = grados.every(n => {
                            const valor = this.ficheroData.numeroAulas[`grado_${n}`];
                            return valor === null || valor === undefined || valor === '' || valor === 0;
                        });
                        if (todosVacios) {
                            this.validarTodosCamposAulas(grados); // aplica focus + estilo en el primero vacío
                            reject({
                                tipo: 'validacion',
                                mensaje: `Faltan valores en # de aulas del bloque "${bloque.toUpperCase()}"`
                            });
                            return;
                        }
                    }
                    // 🔹 Validación Estudiantes por aula por bloque usando seccionColumnas
                    for (const bloque in this.seccionColumnas) {
                        if (!this.ficheroData.Niveles_Educativos[bloque]) continue; // checkbox no activo
                        const grados = this.seccionColumnas[bloque];
                        for (const n of grados) {
                            const numeroAulas = this.ficheroData.numeroAulas[`grado_${n}`];
                            if (numeroAulas > 0) {
                                for (let i = 1; i <= numeroAulas; i++) {
                                    const valor = this.ficheroData.estudiantesPorAula[`grado_${n}_aula_${i}`];
                                    if (valor === null || valor === undefined || valor === '' || valor === 0) {
                                        this.validarTodosCamposEstudiantesPorAula(n, numeroAulas); // focus + estilo
                                        reject({
                                            tipo: 'validacion',
                                            mensaje: `Faltan valores en estudiantes por aula del bloque "${bloque.toUpperCase()}"`
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    // 🔹 Validación límite de observaciones
                    if (this.ficheroData.observaciones && this.ficheroData.observaciones.length > this.limitObservacion) {
                        this.validarObservaciones(); // método para estilo + foco + notificación
                        reject({
                            tipo: 'validacion',
                            mensaje: `Las observaciones no deben exceder ${this.limitObservacion} caracteres`
                        });
                        return;
                    }
                    resolve();
                } catch (error) {
                    console.error('Error en validaciongeneral_antes_de_guardar:', error);
                    reject({
                        tipo: 'validacion',
                        mensaje: 'ERROR validaciongeneral_antes_de_guardar'
                    });
                }
            });
        },
        validarEditorialesVacias(indicesVacios) {
            let primerFocusAplicado = false;
            let primerElementoParaScroll = null;

            indicesVacios.forEach(index => {
                const area = this.ficheroData.editoriales[index];

                // Aplicar clase directamente al v-select (igual que en cargos)
                this.$set(area, 'classValidarEditorial', 'stylevalidarinput');

                // Referencia directa al v-select
                const refName = `editorialSelect_${index}`;
                const vSelectArray = this.$refs[refName];

                if (vSelectArray && vSelectArray[0]) {
                    const vSelect = vSelectArray[0];
                    const inputEl = vSelect.$el.querySelector('input');

                    if (inputEl && !primerFocusAplicado) {
                        inputEl.focus();
                        primerFocusAplicado = true;
                        primerElementoParaScroll = vSelect.$el; // Para scroll
                    }
                }
            });

            // Notificación
            this.$vs.notify({
                text: 'Cada libro/área debe tener una editorial seleccionada.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 6000,
            });

            // Scroll suave al primer select con error
            if (primerElementoParaScroll) {
                this.$nextTick(() => {
                    primerElementoParaScroll.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                });
            }

            // Quitar la clase después de 1.5 segundos
            setTimeout(() => {
                indicesVacios.forEach(index => {
                    this.$set(this.ficheroData.editoriales[index], 'classValidarEditorial', '');
                });
            }, 1500);
        },
        validarNivelesNoMarcados(indicesVacios) {
            let primerScrollAplicado = false;

            // 1. Aplicar la clase INMEDIATAMENTE → así se ve el rojo desde el primer momento
            indicesVacios.forEach(index => {
                this.$set(this.ficheroData.editoriales[index], 'classValidarNiveles', 'stylevalidarinput');
            });

            // 2. Esperar a que Vue actualice el DOM y luego hacer scroll
            this.$nextTick(() => {
                indicesVacios.forEach((index, pos) => {
                    if (!primerScrollAplicado) {
                        const refName = `checkboxColumna_${index}`;
                        const tdArray = this.$refs[refName];

                        if (tdArray && tdArray.length > 0) {
                            const tdElement = tdArray[0].$el || tdArray[0];

                            tdElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                                inline: 'center' // Centra la columna horizontalmente
                            });

                            primerScrollAplicado = true;
                        }
                    }
                });

                // Notificación (se ve después del scroll, ideal)
                this.$vs.notify({
                    text: 'Cada libro/área debe tener al menos un nivel (checkbox) marcado.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
            });

            // 3. Quitar la clase después de 1.5 segundos
            setTimeout(() => {
                indicesVacios.forEach(index => {
                    this.$set(this.ficheroData.editoriales[index], 'classValidarNiveles', '');
                });
            }, 1500);
        },
        validarTodosCamposPension(indicesVacios) {
            let primerFocusAplicado = false;

            indicesVacios.forEach(nivel => {
                // Aplicar clase de error
                this.$set(this.ficheroData.valorPension, nivel + '_class', 'stylevalidarinput');

                // Intentar focus al primer input vacío
                if (!primerFocusAplicado) {
                    const refName = `pension_${nivel}`;
                    const inputComponent = this.$refs[refName];

                    // En Vue 2, ref puede ser objeto o array
                    const component = Array.isArray(inputComponent) ? inputComponent[0] : inputComponent;

                    // ACCESO SEGURO SIN ?.
                    const inputEl = component && component.$el && component.$el.querySelector('input');

                    if (inputEl) {
                        this.$nextTick(() => {
                            inputEl.focus();
                        });
                        primerFocusAplicado = true;
                    }
                }
            });

            // Notificación
            this.$vs.notify({
                title: 'Número de Aulas y Estudiantes',
                text: 'Hay campos de "Valor de Pensión" vacíos. Complete todos los valores antes de guardar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 6000,
            });

            // QUITAR CLASE DESPUÉS DE 1.5 SEGUNDOS
            setTimeout(() => {
                indicesVacios.forEach(nivel => {
                    this.$set(this.ficheroData.valorPension, nivel + '_class', '');
                });
            }, 1500);
        },
        validarTodosCamposAulas(grados) {
            let primerFocusAplicado = false;
            grados.forEach(n => {
                const valor = this.ficheroData.numeroAulas[`grado_${n}`];
                // Aplicar clase si está vacío
                if (valor === null || valor === undefined || valor === '' || valor === 0) {
                    this.$set(this.ficheroData.numeroAulas, `grado_${n}_class`, 'stylevalidarinput');
                    // Focus al primer input vacío
                    const refName = `aula_grado_${n}`; // Debes asignar ref en tu template
                    const inputElArray = this.$refs[refName];
                    const inputEl = inputElArray && inputElArray[0] ? inputElArray[0].$el.querySelector('input') : null;
                    if (inputEl && !primerFocusAplicado) {
                        // //Hace focus
                        // inputEl.focus();
                        //Posiciona el input en el centro de la pantalla
                        inputEl.scrollIntoView({
                            behavior: 'smooth', // desplazamiento suave
                            block: 'center', // centra el input en la pantalla
                        });
                        primerFocusAplicado = true;
                    }
                }
            });
            this.$vs.notify({
                title: 'Número de Aulas y Estudiantes',
                text: 'Hay campos de "# de aulas" vacíos. Complete todos antes de guardar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 6000,
            });
            setTimeout(() => {
                grados.forEach(n => {
                    this.$set(this.ficheroData.numeroAulas, `grado_${n}_class`, '');
                });
            }, 1500);
        },
        validarTodosCamposEstudiantesPorAula(grado, numeroAulas) {
            let primerFocusAplicado = false;
            for (let i = 1; i <= numeroAulas; i++) {
                const key = `grado_${grado}_aula_${i}`;
                const valor = this.ficheroData.estudiantesPorAula[key];
                if (valor === null || valor === undefined || valor === '' || valor === 0) {
                    // Clase visual de error
                    this.$set(this.ficheroData.estudiantesPorAula, `${key}_class`, 'stylevalidarinput');

                    // Focus en el primer input vacío
                    if (!primerFocusAplicado) {
                        const refName = `estudiante_grado_${grado}_aula_${i}`;
                        const inputElArray = this.$refs[refName];
                        const inputEl = inputElArray && inputElArray[0] ? inputElArray[0].$el.querySelector('input') : null;
                        if (inputEl) {
                            // //Hace focus
                            // inputEl.focus();
                            //Posiciona el input en el centro de la pantalla
                            inputEl.scrollIntoView({
                                behavior: 'smooth', // desplazamiento suave
                                block: 'center', // centra el input en la pantalla
                            });
                            primerFocusAplicado = true;
                        }
                    }
                }
            }
            // Quitar clase visual después de 1.5s
            setTimeout(() => {
                for (let i = 1; i <= numeroAulas; i++) {
                    const key = `grado_${grado}_aula_${i}`;
                    this.$set(this.ficheroData.estudiantesPorAula, `${key}_class`, '');
                }
            }, 1500);
            // Notificación general
            this.$vs.notify({
                title: 'Número de Aulas y Estudiantes',
                text: 'Hay campos de "Estudiantes por aula" vacíos. Complete todos antes de guardar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 6000,
            });
        },
        validarObservaciones() {
            const focusObservaciones = this.$refs.observaciones.$el.querySelector('textarea');
            focusObservaciones.focus();
            this.classValidarObservaciones = 'stylevalidarinput';

            this.$vs.notify({
                text: `Las observaciones no deben exceder ${this.limitObservacion} caracteres`,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });

            setTimeout(() => {
                this.classValidarObservaciones = '';
            }, 1500);
        },
        // Método de notificación y focus
        validarTodosCargosPersonalPlantel(indicesVacios) {
            let primerFocusAplicado = false;
            indicesVacios.forEach(index => {
                const usuario = this.ficheroData.personalPlantel[index];
                // Clase visual de error
                this.$set(usuario, 'classValidarCargo', 'stylevalidarinput');
                // Focus al primer input vacío
                const refName = `parametrofma_cargo_${index}`;
                const inputElArray = this.$refs[refName];
                const inputEl = inputElArray && inputElArray[0] ? inputElArray[0].$el.querySelector('input') : null;
                if (inputEl && !primerFocusAplicado) {
                    inputEl.focus();
                    primerFocusAplicado = true;
                }
            });
            // Notificación general (una sola vez)
            this.$vs.notify({
                title: 'Personal del Plantel',
                text: 'Hay campos de "Cargo" vacíos. Complete todos los cargos antes de guardar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 6000,
            });
            // Quitar clase visual después de un tiempo
            setTimeout(() => {
                indicesVacios.forEach(index => {
                    this.$set(this.ficheroData.personalPlantel[index], 'classValidarCargo', '');
                });
            }, 1500);
        },
        validarTodosCamposNombreAreas(indicesVacios) {
            let primerFocusAplicado = false;
            indicesVacios.forEach(index => {
                const area = this.ficheroData.editoriales[index];
                // Clase visual de error
                this.$set(area, 'classValidarNombre', 'stylevalidarinput');
                // Focus al primer input vacío
                const refName = `parametroAreaNombre_${index}`;
                const inputElArray = this.$refs[refName];
                const inputEl = inputElArray && inputElArray[0] ? inputElArray[0].$el.querySelector('input') : null;

                if (inputEl && !primerFocusAplicado) {
                    inputEl.focus();
                    primerFocusAplicado = true;
                }
            });
            // Notificación general
            this.$vs.notify({
                title: 'Editoriales con las que trabajan',
                text: 'Hay campos de "Nombre de libro" vacíos. Complete todos antes de guardar.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 6000,
            });
            // Quitar clase visual después de un tiempo
            setTimeout(() => {
                indicesVacios.forEach(index => {
                    this.$set(this.ficheroData.editoriales[index], 'classValidarNombre', '');
                });
            }, 1500);
        },
        ajustarEstudiantes(n) {
            const key = `grado_${n}`;
            const cantidad = this.ficheroData.numeroAulas[key] || 0;
            // Buscar todos los estudiantes de ese grado
            const existentes = Object.keys(this.ficheroData.estudiantesPorAula)
                .filter(k => k.startsWith(key + '_aula_'));
            // Eliminar los que estén fuera del rango
            existentes.forEach(k => {
                const numAula = parseInt(k.split('_aula_')[1]);
                if (numAula > cantidad) {
                    this.$delete(this.ficheroData.estudiantesPorAula, k);
                }
            });
            this.calcularTotalEstudiantes();
        },
        //SECCION BLURS
        verificarCampoEstudianteVacio(n, i) {
            let me = this;
            let key = `grado_${n}_aula_${i}`;
            let valor = me.ficheroData.estudiantesPorAula[key];

            // Si está vacío, nulo o undefined, ponerlo en 0
            if (valor == '' || valor == null || valor == undefined) {
                me.ficheroData.estudiantesPorAula[key] = 0;
            }
        },
        verificarCampoVacioAulas(n) {
            let me = this;
            const key = `grado_${n}`;
            const valor = me.ficheroData.numeroAulas[key];

            if (valor === '' || valor === null || valor === undefined) {
                me.ficheroData.numeroAulas[key] = 0;
            }
        },
        confirmarAgregarFactor() {
            if (!this.NuevoFactorIncideCompra.trim()) return;
            // Agregar factor nuevo
            this.ficheroData.factores_inciden_compra_extra.push({
                nombre: this.NuevoFactorIncideCompra,
                checked: true
            });
            this.NuevoFactorIncideCompra = '';
            this.popupAgregar = false; // cerrar popup
        },
        //AGREGAR DINAMICAMENTE
        agregarFactor() {
            if (!this.NuevoFactorIncideCompra.trim()) return; // evitar vacíos
            // Agregar al array de opciones extra
            this.ficheroData.factores_inciden_compra_extra.push({
                nombre: this.NuevoFactorIncideCompra.trim(),
                checked: true, // marcar por defecto al crear
            });
            this.NuevoFactorIncideCompra = ''; // limpiar input
        },
        Switch_Trabaja_con_prolipa() {
            if (this.ficheroData.trabaja_con_prolipa == false) {
                this.ficheroData.fm_convenio = false;
                this.ficheroData.fm_cantidad_anios_trabaja_con_prolipa = 0;
            }
            // console.log(this.ficheroData.trabaja_con_prolipa, "trabaja_con_prolipa");
            // console.log(this.ficheroData.fm_convenio, "fm_convenio");
            // console.log(this.ficheroData.fm_cantidad_anios_trabaja_con_prolipa, "fm_cantidad_anios_trabaja_con_prolipa");
        },
        validarcampo_buscar_fm_tipo_venta(mensaje) {
            let me = this;
            return new Promise((resolve, reject) => {
                me.classvalidar_fm_tipo_venta = 'stylevalidarinput';
                me.$nextTick(() => {
                    const input = me.$refs.fm_tipo_venta &&
                        me.$refs.fm_tipo_venta.$el &&
                        me.$refs.fm_tipo_venta.$el.querySelector('input');
                    if (input) input.focus();
                });
                me.$vs.notify({
                    text: mensaje,
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                });
                setTimeout(() => {
                    me.classvalidar_fm_tipo_venta = '';
                }, 1500);
                resolve();
            });
        },
    }
};
</script>

<style scoped>
/* Contenedor principal */
.contenedor-fichero {
    padding: 1rem;
    max-width: 100%;
}

/* Secciones */
.seccion {
    margin-bottom: 1.5rem;
}

.titulo-seccion {
    font-size: 1.1rem;
    font-weight: 600;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    color: #374151;
}

/* Grids */
.grid-datos {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .grid-datos {
        grid-template-columns: 1fr 1fr;
    }
}

/* Cards */
.card-dato {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.75rem;
}

.label {
    font-size: 0.85rem;
    color: #6b7280;
}

.valor {
    display: block;
    font-weight: 600;
    color: #111827;
}

/* Tablas */
.tabla-scroll {
    /* overflow-x: auto; */
    /* Para que el sticky funcione con el scroll de la página, el overflow debe ser visible */
    overflow: visible;
    display: block;
}

table {
    border-collapse: collapse;
    width: 100%;
    min-width: 600px;
}

th,
td {
    border: 1px solid #d1d5db;
    padding: 0.5rem;
    font-size: 0.85rem;
}

th {
    background: #f3f4f6;
    text-align: center;
    font-weight: 600;
}

td {
    text-align: center;
}

.border-card {
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.75rem;
}

/* Botones */
.acciones {
    text-align: center;
    margin-top: 1.5rem;
}

.acciones button {
    margin: 0 0.5rem;
}

.informacionformhijodehijo {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.personal-plantel-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.personal-plantel-table th,
.personal-plantel-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

.personal-plantel-table th {
    background-color: #f5f5f5;
    font-weight: 600;
}

.cargo-input {
    width: 100%;
}

.titulo-seccion-boton {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    /* espacio entre título y botón */
    margin-bottom: 1rem;
}

.titulo-seccion-boton h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.titulo-seccion-boton .vs-button {
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.titulo-seccion-boton .vs-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.periodo-centro {
    text-align: center;
    margin: 0;
}

.label-periodo {
    font-weight: 600;
    font-size: 1.3rem;
    margin-right: 5px;
    color: #34495e;
    /* tono sobrio */
}

.valor-periodo {
    font-weight: bold;
    font-size: 1.2rem;
    color: #2c3e50;
}

.personal-plantel-table b {
    color: #2c3e50;
    font-weight: 600;
}

.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

td.sticky-accion,
th.sticky-accion {
    position: sticky;
    left: 0;
    background-color: #f7fafc;
    /* mismo color que encabezado o fila */
    z-index: 3;
}

/* --- COLLAPSE --- */
.collapse-box {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background-color: #f8fafc;
    overflow: hidden;
    transition: all 0.3s ease;
}

/* Quitamos la flecha nativa */
.collapse-box summary::-webkit-details-marker {
    display: none;
}

.collapse-header {
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.collapse-header:hover {
    background-color: #f1f5f9;
}

.collapse-content {
    padding: 1rem 1.25rem;
    background-color: #fff;
    border-top: 1px solid #e2e8f0;
    animation: slideDown 0.3s ease;
}

/* --- FLECHA SVG --- */
.flecha {
    width: 20px;
    height: 20px;
    color: #334155;
    transition: transform 0.3s ease;
}

/* Gira la flecha al abrir */
.collapse-box[open] .flecha {
    transform: rotate(180deg);
}

/* --- TABLA --- */
/* Para modo VERTICAL: overflow visible para que sticky funcione con scroll de página */
.tabla-scroll-horizontal {
    overflow: visible;
    display: block;
}

/* Para modo HORIZONTAL: solo overflow horizontal */
.tabla-scroll {
    overflow-x: auto;
    overflow-y: visible;
    display: block;
}

.personal-plantel-table {
    width: 100%;
    border-collapse: collapse;
}

.personal-plantel-table th {
    background-color: #f1f5f9;
    text-align: left;
    padding: 10px;
    font-weight: 600;
    color: #1e293b;
}

.personal-plantel-table td {
    padding: 10px;
    border-top: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
}

.no-usuarios-text {
    text-align: center;
    color: #94a3b8;
    font-style: italic;
    padding: 1rem;
}

/* --- ANIMACIÓN --- */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/*MODO NIGHT CLASES*/
/* Contenedor general de sección */
.night-bg {
    background-color: #10163A;
    padding: 1rem;
    border-radius: 0.5rem;
}

/* Cada tarjeta o bloque de dato */
.night-card {
    background-color: #1A1F4D;
    margin-bottom: 0.8rem;
    padding: 0.5rem;
    border-radius: 0.4rem;
}

/* Etiquetas (labels) */
.night-text-label {
    color: #ffffff;
    font-weight: 600;
}

/* Valores */
.night-text-valor {
    color: #e0e0e0;
    margin-left: 0.5rem;
}

/* Contenedor del período escolar */
.night-periodo-centro {
    color: #ffffff;
    /* display: flex; */
    /* align-items: center; */
    gap: 0.5rem;
    text-align: center;
}

/* Etiqueta "PERÍODO:" */
.night-valor-periodo {
    color: #ffffff;
    font-weight: 600;
}

/* Valor del período */
.night-label-periodo {
    color: #ffffff;
}

/* Título sección */
.night-titulo-seccion {
    color: #ffffff;
}

/* Botón VS para night */
.night-vs-button.vs-success {
    background-color: #FFC107;
    /* Ajusta según contraste que quieras */
    color: #10163A;
}

/* Contenedor collapse general */
.night-collapse-box {
    background-color: #10163A;
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: #ffffff;
}

/* Header del collapse */
.night-collapse-header {
    color: #ffffff;
    cursor: pointer;
}

/* Subtítulo dentro del header */
.night-subtitulo {
    color: #c0c0c0;
    font-size: 0.85rem;
}

/* Flecha SVG */
.night-flecha {
    stroke: #ffffff;
}

/* --- COLLAPSE NIGHT --- */
.night-collapse-box {
    border: 1px solid #2a2f5a;
    border-radius: 12px;
    background-color: #10163A;
    overflow: hidden;
    transition: all 0.3s ease;
}

/* Quitamos la flecha nativa */
.night-collapse-box summary::-webkit-details-marker {
    display: none;
}

.night-collapse-header {
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
}

/* Evitar hover gris de light */
.night-collapse-header:hover {
    background-color: #1A1F4D;
}

.night-collapse-content {
    padding: 1rem 1.25rem;
    background-color: #10163A;
    border-top: 1px solid #2a2f5a;
    animation: slideDown 0.3s ease;
}

/* --- FLECHA SVG NIGHT --- */
.night-flecha {
    width: 20px;
    height: 20px;
    color: #ffffff;
    transition: transform 0.3s ease;
}

/* Gira la flecha al abrir */
.night-collapse-box[open] .night-flecha {
    transform: rotate(180deg);
}

/* --- TABLA NIGHT --- */
.night-personal-plantel-table {
    width: 100%;
    border-collapse: collapse;
}

.night-personal-plantel-table th {
    background-color: #1A1F4D;
    text-align: left;
    padding: 10px;
    font-weight: 600;
    color: #ffffff;
}

.night-personal-plantel-table td {
    padding: 10px;
    border-top: 1px solid #2a2f5a;
    color: #e0e0e0;
    vertical-align: top;
}

/* Labels dentro de la tabla collapse para night */
.night-personal-plantel-table span b {
    color: #ffffff;
    /* o #f0f0f0 para un contraste suave */
    font-weight: 600;
}

/* Valores dinámicos se mantienen #e0e0e0 */
.night-personal-plantel-table td span {
    color: #e0e0e0;
}

.night-no-usuarios-text {
    text-align: center;
    color: #c0c0c0;
    font-style: italic;
    padding: 1rem;
}

/* --- ANIMACIÓN --- */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Sticky para primera columna (izquierda) */
.sticky-accion {
    position: sticky;
    left: 0;
    background-color: #f7fafc;
    z-index: 2;
}

/* Cuando es header sticky (top + left) */
.sticky-accion.sticky-header {
    z-index: 101;
    /* Mayor que sticky-header solo (100) para que quede encima */
}

/* Sticky para modo night */
td.night-sticky-accion,
th.night-sticky-accion {
    position: sticky;
    left: 0;
    background-color: #262C49;
    /* fondo oscuro consistente con la tabla night */
    color: #ffffff;
    /* texto visible en dark */
    z-index: 3;
}

/* Modo claro */
.sticky-head {
    position: sticky;
    top: 0;
    z-index: 20;
    background-color: #f7fafc;
}

/* Modo oscuro */
.night-personal-plantel-table .sticky-head {
    background-color: #262C49;
    color: #fff;
}

/* Sticky Header para tabla de aulas */
.sticky-header {
    position: sticky;
    top: 0;
    z-index: 100;
    /* Aumentado para que quede sobre otros elementos de la página */
    background-color: #f7fafc;
    /* Color de fondo para modo claro */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    /* Sombra suave opcional */
}

/* Soporte para modo oscuro */
.night-personal-plantel-table .sticky-header {
    background-color: #1A1F4D;
    /* Color de fondo del th en modo night */
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.input-aulas {
    min-width: 50px;
}

.input-small {
    min-width: 50px;
}

/* ===== ESTABLECIMIENTOS PARA DESPACHO - CARDS ===== */
.despacho-instituciones-header {
    margin-bottom: 10px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.despacho-instituciones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
    margin-top: 8px;
}

.despacho-card-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    padding: 12px 14px;
    gap: 10px;
    transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.despacho-card-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.despacho-card-light {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.despacho-card-dark {
    background: #1e2748;
    border: 1px solid #2d3561;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}

.despacho-card-body {
    flex: 1;
    min-width: 0;
}

.despacho-card-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-bottom: 4px;
}

.despacho-card-badge.badge-pv {
    background: #ebf4ff;
    color: #2b6cb0;
    border: 1px solid #bee3f8;
}

.despacho-card-badge.badge-inst {
    background: #faf5ff;
    color: #6b46c1;
    border: 1px solid #e9d8fd;
}

.despacho-card-nombre {
    font-size: 0.87rem;
    font-weight: 600;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
}

.despacho-card-ciudad {
    font-size: 0.78rem;
    margin-top: 3px;
    display: flex;
    align-items: center;
    gap: 3px;
}

/* ===== PANEL ESTABLECIMIENTOS PARA DESPACHO ===== */
.despacho-panel {
    border-radius: 12px;
    overflow: hidden;
    margin-top: 12px;
}

.despacho-panel-light {
    border: 1.5px solid #38a169;
    background: #fff;
}

.despacho-panel-dark {
    border: 1.5px solid #276749;
    background: #1a2035;
}

.despacho-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: linear-gradient(135deg, #38a169 0%, #276749 100%);
    gap: 10px;
}

.despacho-panel-titulo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.despacho-panel-icon {
    font-size: 1.3rem;
    line-height: 1;
}

.despacho-panel-label {
    font-size: 0.92rem;
    font-weight: 700;
    color: #fff !important;
    letter-spacing: 0.01em;
}

.despacho-panel-count-badge {
    display: inline-block;
    background: #fff;
    color: #276749;
    border-radius: 999px;
    padding: 1px 9px;
    font-size: 0.75rem;
    font-weight: 800;
    margin-left: 8px;
    vertical-align: middle;
    line-height: 1.6;
}

.despacho-panel-body {
    padding: 12px 14px;
}

/* Estado vacío */
.despacho-panel-vacio {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 4px;
    font-size: 0.83rem;
}

.despacho-panel-vacio-icon {
    font-size: 1.3rem;
    color: #68d391;
    flex-shrink: 0;
}
</style>
