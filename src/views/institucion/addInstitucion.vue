<template>
<vx-card :title="titulo" title-color="primary">
    <div class="p-6">
        <!-- Sección del Logo de la Institución -->
        <div class="vx-row mb-8">
            <div class="vx-col w-full">
                <div class="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                    <div class="mb-4">
                        <h4 class="text-lg font-semibold text-gray-700 mb-2">
                            <i class="feather icon-image mr-2"></i>Logo de la Institución
                        </h4>
                    </div>

                    <!-- Vista previa del logo -->
                    <div class="mb-6">
                        <!-- Preview del archivo seleccionado (tiene prioridad) -->
                        <div v-if="previewImage && !muyPesado" class="mb-4">
                            <div class="relative inline-block">
                                <img :src="previewImage" class="mx-auto block shadow-lg rounded-full w-32 h-32 object-cover border-4 border-green-400" alt="Preview del nuevo logo" />
                                <div class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                    <i class="feather icon-check text-sm"></i>
                                </div>
                            </div>
                            <p class="text-sm text-green-600 mt-2 font-medium">
                                <i class="feather icon-upload mr-1"></i>Nuevo logo seleccionado
                            </p>
                            <p class="text-xs text-gray-500">{{ selectedFileName }} ({{ pesoArchivo }} MB)</p>
                            <vs-button @click="cancelarSeleccion" size="small" type="border" color="danger" class="mt-2">
                                <i class="feather icon-x mr-1"></i>Cancelar
                            </vs-button>
                        </div>

                        <!-- Logo actual (se muestra cuando no hay preview) -->
                        <div v-else-if="institucion.imgenInstitucion != ''">
                            <vs-avatar class="mx-auto block shadow-lg" size="120px" :src="$data_url + 'archivos/instituciones_logos/' + institucion.imgenInstitucion" />
                            <p class="text-sm text-gray-500 mt-2">Logo actual</p>
                        </div>

                        <!-- Sin logo -->
                        <div v-else>
                            <div class="mx-auto flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full border-4 border-gray-300">
                                <i class="feather icon-image text-4xl text-gray-400"></i>
                            </div>
                            <p class="text-sm text-gray-500 mt-2">Sin logo asignado</p>
                        </div>
                    </div>

                    <!-- Input de archivo mejorado -->
                    <div class="mb-4">
                        <label for="file" class="cursor-pointer">
                            <div class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-md">
                                <i class="feather icon-upload mr-2"></i>
                                <span>Seleccionar Nuevo Logo</span>
                            </div>
                        </label>
                        <input type="file" id="file" class="hidden" @change="obtenerImagen" accept="image/png, image/gif, image/jpeg, image/jpg" />
                    </div>

                    <!-- Información y validaciones -->
                    <div class="text-sm text-gray-600 space-y-1">
                        <p><i class="feather icon-info mr-1"></i>Tamaño máximo: {{ limiteMegas }} MB</p>
                        <p><i class="feather icon-check-circle mr-1"></i>Formatos: PNG, JPG, JPEG, GIF</p>
                        <p><i class="feather icon-square mr-1"></i>Recomendado: 300x300px o superior</p>
                    </div>

                    <!-- Mensaje de error -->
                    <div v-if="msj" class="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p class="text-red-700 text-sm">
                            <i class="feather icon-alert-triangle mr-1"></i>{{ msj }}
                        </p>
                    </div>

                    <!-- Barra de progreso -->
                    <div v-if="porcentaje > 0" class="mt-4">
                        <div class="mb-2">
                            <span class="text-sm font-medium text-gray-700">Subiendo archivo...</span>
                        </div>
                        <vs-progress :percent="porcentaje" color="success" class="w-full">
                            {{ porcentaje }}%
                        </vs-progress>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row mb-6">
            <input type="text" v-model="institucion.idInstitucion" hidden>
        </div>
        <!-- ── Sección Código AMIE ──────────────────────────────────── -->
        <div v-if="permisoRoot == true" :class="['amie-section-wrapper', { 'amie-section-wrapper--dark': themeMode }]" class="mb-6">
            <!-- Badge de sección -->
            <div class="amie-section-badge">
                <i class="feather icon-hash amie-section-badge-icon"></i>
                <span>Código AMIE</span>
            </div>

            <div class="vx-row">
                <div class="vx-col sm:w-1/3 w-full flex items-center">
                    <span class="amie-section-label">Código AMIE</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <div style="position: relative;">
                        <vs-input class="w-full" icon-no-border v-model="institucion.codigo_amie" placeholder="Ingrese el código AMIE" @blur="onBlurCodigoAmie" />
                        <!-- Spinner de verificación -->
                        <div v-if="verificandoAmie" class="amie-spinner">
                            <div class="amie-spinner-circle"></div>
                        </div>
                    </div>
                    <span class="text-danger text-sm" v-show="errors.codigo_amie">{{ errors.codigo_amie }}</span>

                    <!-- Panel de duplicados AMIE -->
                    <transition name="fade-slide">
                        <div v-if="codigoAmie_instituciones.length > 0" :class="['amie-dup-card', { 'amie-dup-card--dark': themeMode }]">
                            <!-- Header -->
                            <div class="amie-dup-header">
                                <i class="feather icon-git-merge amie-dup-header-icon"></i>
                                <div>
                                    <p class="amie-dup-header-title">Código AMIE compartido</p>
                                    <p class="amie-dup-header-sub">
                                        {{ codigoAmie_instituciones.length }}
                                        {{ codigoAmie_instituciones.length === 1 ? 'institución usa' : 'instituciones usan' }}
                                        también este código
                                    </p>
                                </div>
                            </div>
                            <!-- Lista -->
                            <ul class="amie-dup-list">
                                <li v-for="inst in codigoAmie_instituciones" :key="inst.idInstitucion" class="amie-dup-item">
                                    <div class="amie-dup-item-dot"></div>
                                    <div class="amie-dup-item-body">
                                        <span class="amie-dup-item-name">{{ inst.nombreInstitucion }}</span>
                                        <span class="amie-dup-item-loc">
                                            <template v-if="inst.nombreprovincia">{{ inst.nombreprovincia }}</template>
                                            <template v-if="inst.ciudad"> · {{ inst.ciudad }}</template>
                                            <template v-if="inst.parr_nombre"> · {{ inst.parr_nombre }}</template>
                                        </span>
                                        <span v-if="inst.asesor_nombre && inst.asesor_nombre.trim()" class="amie-dup-item-asesor">
                                            <i class="feather icon-user"></i>
                                            {{ inst.asesor_nombre.trim() }}
                                            <template v-if="inst.asesor_cedula"> · {{ inst.asesor_cedula }}</template>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                            <!-- Footer -->
                            <div class="amie-dup-footer">
                                <i class="feather icon-check-circle amie-dup-footer-icon"></i>
                                <span>Los valores de amie duplicados están permitidos. Puede guardar con normalidad.</span>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <!-- ── Sección Coordenadas GPS ───────────────────────────────── -->
        <div v-if="permisoRoot == true" class="amie-section-wrapper mb-6" :class="{ 'amie-section-wrapper--dark': themeMode }">
            <div class="amie-section-badge">
                <i class="feather icon-map-pin amie-section-badge-icon"></i>
                <span>Coordenadas GPS</span>
            </div>

            <div class="vx-row">
                <div class="vx-col sm:w-1/3 w-full flex items-center">
                    <span class="amie-section-label">Coordenadas</span>
                </div>

                <div class="vx-col sm:w-2/3 w-full">
                    <div class="vx-row">
                       <!-- Latitud -->
                        <div class="vx-col sm:w-1/2 w-full mb-4">
                            <label class="text-sm font-semibold mb-1 block">Latitud</label>
                            <div class="flex gap-2">
                                <vs-input
                                    type="text"
                                    class="flex-1"
                                    icon-no-border
                                    v-model="institucion.latitud"
                                    placeholder="-0.180653"
                                    @blur="limpiarCoordenadas"
                                />
                                <vs-button
                                    size="small"
                                    type="border"
                                    color="warning"
                                    icon-pack="feather"
                                    icon="icon-refresh-cw"
                                    @click="limpiarCoordenadas">
                                    6 dec
                                </vs-button>
                            </div>
                            <span class="text-danger text-sm" v-show="errors.latitud">{{ errors.latitud }}</span>
                        </div>

                        <!-- Longitud -->
                        <div class="vx-col sm:w-1/2 w-full mb-4">
                            <label class="text-sm font-semibold mb-1 block">Longitud</label>
                            <div class="flex gap-2">
                                <vs-input
                                    type="text"
                                    class="flex-1"
                                    icon-no-border
                                    v-model="institucion.longitud"
                                    placeholder="-78.467838"
                                    @blur="limpiarCoordenadas"
                                />
                                <vs-button
                                    size="small"
                                    type="border"
                                    color="warning"
                                    icon-pack="feather"
                                    icon="icon-refresh-cw"
                                    @click="limpiarCoordenadas">
                                    6 dec
                                </vs-button>
                            </div>
                            <span class="text-danger text-sm" v-show="errors.longitud">{{ errors.longitud }}</span>
                        </div>
                    </div>

                    <!-- Botón para obtener ubicación actual -->
                    <!-- <vs-button
                        size="small"
                        type="border"
                        color="primary"
                        @click="obtenerUbicacionActual"
                        class="mt-2"
                    >
                        <i class="feather icon-navigation mr-1"></i>
                        Obtener mi ubicación actual
                    </vs-button> -->

                    <div class="mt-3 text-xs text-gray-500">
                        <i class="feather icon-info"></i>
                        Formato decimal (ej: -0.180653, -78.467838).
                        <a href="https://www.google.com/maps" target="_blank" class="text-primary">Abrir Google Maps</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Nombre</span>

            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <div class="relative">
                    <vs-input :disabled="xfichero == 'si' || permisoRoot != true" class="w-full" icon-no-border v-model="institucion.nombreInstitucion" ref="nombreInstitucionInput" placeholder="Ingrese el nombre de la institución" />
                    <vs-button :disabled="xfichero == 'si' || permisoRoot != true" @click="convertirSeleccionAMayusculas" size="small" type="filled" color="primary" class="mt-2" icon-pack="feather" icon="icon-type">
                        <span class="ml-1">MAYÚSCULAS</span>
                    </vs-button>
                </div>
                <small class="text-gray-600 mt-1 block">
                    💡 Selecciona texto y haz clic en el botón para convertir solo esa parte, o deja sin seleccionar para
                    convertir todo
                </small>
                <span class="text-danger text-sm" v-show="errors.nombreInstitucion">{{ errors.nombreInstitucion
          }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Dirección</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-no-border v-model="institucion.direccionInstitucion" />
                <span class="text-danger text-sm" v-show="errors.direccionInstitucion">{{
            errors.direccionInstitucion }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Teléfono</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-no-border v-model="institucion.telefonoInstitucion" />
                <span class="text-danger text-sm" v-show="errors.telefonoInstitucion">{{ errors.telefonoInstitucion
          }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Email</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input type="email" class="w-full" icon-no-border v-model="institucion.email" @blur="validarCorreo" />
                <!-- <vs-input type="email" class="w-full" icon-no-border v-model="institucion.email" /> -->
                <p v-if="showError" style="color: red;">Por favor ingresa un correo válido</p>
                <span class="text-danger text-sm" v-show="errors.email">{{ errors.email }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Fecha de Fundación</span>
            </div>

            <div class="vx-col sm:w-2/3 w-full flex items-center">
                <!-- Solo el input -->
                <flat-pickr :config="configdateTimePicker" v-model="institucion.fecha_fundacion" placeholder="Selecciona una fecha" class="w-full" />

                <!-- Botón para limpiar -->
                <vs-button v-if="institucion.fecha_fundacion" size="small" color="danger" type="flat" icon-pack="feather" icon="icon-x-circle" @click="limpiarFechaFundacion">
                    Limpiar
                </vs-button>
            </div>

            <div class="vx-col w-full">
                <span class="text-danger text-sm" v-show="errors.fecha_fundacion">
                    {{ errors.fecha_fundacion }}
                </span>
            </div>
        </div>

        <!-- <div class="vx-row mb-6" v-if="usuario.id_group == 1">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Id institución FACTURACIÓN</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-no-border v-model="institucion.codigo_institucion_milton" />
                <span class="text-danger text-sm" v-show="errors.codigo_institucion_milton">{{
            errors.codigo_institucion_milton }}</span>
            </div>
        </div> -->
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span class="mt-1">Región</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio :disabled="permisoRoot != true" v-model="institucion.region_idregion" vs-value="2">Costa</vs-radio>
                    </li>
                    <li>
                        <vs-radio :disabled="permisoRoot != true" v-model="institucion.region_idregion" vs-value="1">Sierra</vs-radio>
                    </li>
                </ul>
                <span class="text-danger text-sm" v-show="errors.region_idregion">{{ errors.region_idregion
          }}</span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Tipo de Institución</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :disabled="permisoRoot != true" :options="tiposInstitucion" :reduce="tipo => tipo.id" label="descripcion" v-model="institucion.tipo_institucion" placeholder="Seleccione un tipo de institución"></v-select>
                <span class="text-danger text-sm" v-show="errors.tipo_institucion">{{ errors.tipo_institucion
          }}</span>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Aplica matricula</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio v-model="institucion.matricula" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="institucion.matricula" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Estado</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio :disabled="permisoRoot != true" v-model="institucion.estado" vs-name="radiosEstado" vs-value="1">Activo</vs-radio>
                    </li>
                    <li>
                        <vs-radio :disabled="permisoRoot != true" v-model="institucion.estado" vs-name="radiosEstado" vs-value="2">Desactivado</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Punto de venta</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio v-model="institucion.punto_venta" vs-name="radiosEstadopunto_venta" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="institucion.punto_venta" vs-name="radiosEstadopunto_venta" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Evaluaciones Personalizadas</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full" style="margin-top: -15px;">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio v-model="institucion.evaluacion_personalizada" vs-name="radiosevaluacion_personalizada" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="institucion.evaluacion_personalizada" vs-name="radiosevaluacion_personalizada" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Evaluaciones cambio de ventana ( 0 = quiere decir que no se controla ) </span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" type="number" min="0" max="5" icon-no-border v-model="institucion.cantidad_cambio_ventana_evaluacion" />
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Solicitar código para la evaluación</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio v-model="institucion.ifcodigoEvaluacion" vs-name="radiosevaluacion_tipo_evaluacion" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="institucion.ifcodigoEvaluacion" vs-name="radiosevaluacion_tipo_evaluacion" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Tipo de evaluación</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <ul class="demo-alignment">
                    <li>
                        <vs-radio v-model="institucion.tipo_evaluacion" vs-name="radiosevaluacion_ifcodigoEvaluacion" vs-value="0">Evaluacion Final</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="institucion.tipo_evaluacion" vs-name="radiosevaluacion_ifcodigoEvaluacion" vs-value="1">Simulacro</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot && institucion.tipo_evaluacion == 1">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Texto simulacro</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <!--input mensaje_tipo_evaluacion-->
                <vs-input class="w-full" icon="mode_edit" v-model="institucion.mensaje_tipo_evaluacion" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Sostenimiento</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :disabled="!permisoRoot && institucion.tipo_descripcion && (typeof institucion.tipo_descripcion === 'string' ? institucion.tipo_descripcion !== '' && institucion.tipo_descripcion !== 'null' : institucion.tipo_descripcion.text)" :options="Array_TipoInstitucion" label="text" placeholder="-- Seleccionar el sostenimiento --" v-model="institucion.tipo_descripcion" />
                <span class="text-danger text-sm" v-show="errors.tipo_descripcion">
                    {{ errors.tipo_descripcion }}
                </span>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Provincia</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :disabled="permisoRoot != true" :options="Array_TodoProvincia" :reduce="provincia => provincia.idprovincia" label="nombreprovincia" placeholder="-- Seleccionar una provincia --" v-model="institucion.idprovincia" @input="get_TodoCiudadoCanton()" />
                <span class="text-danger text-sm" v-show="errors.idprovincia">
                    {{ errors.idprovincia }}
                </span>
            </div>
        </div>

        <!-- Ciudad -->

        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Ciudad</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select  :options="Array_TodoCiudad" :reduce="Array_TodoCiudad => Array_TodoCiudad.idciudad" label="nombre" placeholder="-- Seleccionar una ciudad --" v-model="institucion.idciudad" :disabled="permisoRoot != true || !institucion.idprovincia" @input="get_TodoParroquia()" />
                <!-- Mostrar ciudad anterior -->
                <div v-if="Lista_Institucion_Ciudad_Anterior && Lista_Institucion_Ciudad_Anterior.length > 0" class="mt-2">
                    <small class="text-gray-600">
                        Ciudad registrada actualmente:
                        <strong>{{ Lista_Institucion_Ciudad_Anterior[0].nombre_ciudad }}</strong>
                    </small>
                </div>

                <span class="text-danger text-sm" v-show="errors.idciudad">
                    {{ errors.idciudad }}
                </span>
            </div>
        </div>

        <div class="vx-row mb-6">
            <!-- Parroquia -->
            <div class="vx-col sm:w-1/3 w-full">
                <span>Parroquia</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select  :options="Array_TodoParroquia" :reduce="Array_TodoParroquia => Array_TodoParroquia.parr_id" label="parr_nombre" placeholder="-- Seleccionar una parroquia --" v-model="institucion.parr_id" :disabled="permisoRoot != true || !institucion.idciudad" />
                <span class="text-danger text-sm" v-show="errors.parr_id">{{ errors.parr_id }}</span>
            </div>
        </div>
        <!-- <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Zona</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="zona" :reduce="zona => zona.idzona" label="zn_nombre" v-model="institucion.zona_id"></v-select>
                <span class="text-danger text-sm" v-show="errors.zona_id">{{ errors.zona_id }}</span>
            </div>
        </div> -->
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Vendedor</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :disabled="permisoRoot != true" :options="vendedor" :reduce="vendedor => vendedor.cedula" label="nombres" v-model="institucion.vendedorInstitucion"></v-select>
                <span class="text-danger text-sm" v-show="errors.vendedorInstitucion">{{ errors.vendedorInstitucion
          }}</span>
            </div>
        </div>
        <div class="vx-row mb-6" v-if="permisoRoot == true">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Porcentaje máximo obsequios</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-no-border v-model="institucion.maximo_porcentaje_autorizado" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>RUC</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-no-border v-model="institucion.ruc" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Representante Legal</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <span v-if="institucion.representante_legal == null || institucion.representante_legal == ''">Sin
                    representante legal.</span>
                <span v-else>{{ nombrecompleto_representantelegal }}</span>
                <vs-button @click="HabilitarBuscarRepresentante()" type="line">{{
            seccion_Busqueda_representante_legal ? 'Cancelar Asignación' : 'Cambiar Representante'
          }}</vs-button>
                <vs-button v-if="institucion.representante_legal != null" @click="QuitarRepresentante()" color="danger" type="line">Quitar Representante</vs-button>
            </div>
        </div>
        <vs-row align="center" v-if="seccion_Busqueda_representante_legal == true" :class="{ 'enmarcar-seccion': enmarcarSeccion }" ref="SeccionBusquedaRepresentante">
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Búsqueda del Representante Legal</vs-divider>
                <vs-row>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-justify="center" vs-w="12">
                            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                                <div align="center">
                                    <table>
                                        <tr>
                                            <td width="500">
                                                <vs-input label="Búsque un representante por cédula o nombre" placeholder="Búsque un representante por cédula o nombre" icon="search" class="w-full mt-5" @keyup.enter="getRepresentanteAsignar()" v-model="filtrorepresentante" />
                                                <small class="mt-2" v-if="encontroresultados == 1"><span class="text-warning">El usuario no
                                                        existe.</span></small>
                                            </td>
                                            <td width="200">
                                                <vs-button @click="getRepresentanteAsignar()" style="margin-top: 36px;" color="success" type="relief">Buscar</vs-button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </vs-col>
                        </vs-row>
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                                <vs-divider>Selección del Representante</vs-divider>
                                <vs-table max-items="5" search pagination :data="Busqueda_representante_legal" no-data-text="No hay datos disponibles">
                                    <template slot="thead">
                                        <vs-th>Nombres y Apellidos</vs-th>
                                        <vs-th>Cédula/RUC</vs-th>
                                        <vs-th>Grupo</vs-th>
                                        <vs-th>Acciones</vs-th>
                                    </template>
                                    <template slot-scope="{data}">
                                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                            <vs-td>
                                                {{ tr.nombres }} {{ tr.apellidos }}
                                            </vs-td>
                                            <vs-td>
                                                {{ tr.cedula }}<br>
                                            </vs-td>
                                            <vs-td>
                                                {{ tr.level }}<br>
                                            </vs-td>
                                            <vs-td>
                                                <div style="display: flex;">
                                                    <div>
                                                        <vx-tooltip style="display: inline-block;" text="Asignar beneficiario" position="top" color="primary">
                                                            <vs-button class="modal-default-button" size="small" color="success" type="filled" @click="seleccionRepresentante(tr)" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                                                        </vx-tooltip> &nbsp;
                                                    </div>
                                                </div>
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <!-- <div class="vx-row mb-6" v-if="id > 0">
              <div class="vx-col w-full">
                <representePerseoVue :id="id"/>
              </div>
            </div> -->
        <!--perseo-->
        <div class="text-center" slot="footer" v-if="validar_BotonesFinalesActivo == false">
            <div class="mt-12" align="center">
                <vs-button color="danger" type="border" class="mb-2 m-2" @click="volver()">Cancelar</vs-button>
                <vs-button color="success" type="border" class="mb-2 m-2" @click="guardar(institucion)"> {{ titulo
          }}
                </vs-button>
            </div>
        </div>
    </div>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    Spanish
} from 'flatpickr/dist/l10n/es.js'
flatpickr.localize(Spanish)
export default {
    components: {
        'v-select': vSelect,
        flatPickr
    },
    props: {
        id: {
            type: Number,
            defaut: 0,
        },
        xciudad: {
            type: String,
            default: "no"
        },
        xfichero: {
            type: String,
            default: "no"
        },
    },
    data() {
        return {
            institucion: {
                'idInstitucion': '',
                'codigo_amie': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'email': '',
                'fecha_fundacion': null,
                'representante_legal': null,
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': null,
                'idprovincia': '',
                'idciudad': '',
                'parr_id': '',
                'region_idregion': '',
                'estado': '1',
                'matricula': '0',
                'punto_venta': 0,
                'evaluacion_personalizada': 0,
                'cantidad_cambio_ventana_evaluacion': 0,
                'ifcodigoEvaluacion': 0,
                'tipo_evaluacion': 0,
                'mensaje_tipo_evaluacion': '',
                // 'zona_id': '',
                'maximo_porcentaje_autorizado': 45,
                'ruc': '',
                'tipo_descripcion': '',
                'latitud': null,
                'longitud': null,

            },
            errors: {
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'email': '',
                'fecha_fundacion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'idprovincia': '',
                'idciudad': '',
                'region_idregion': '',
                // 'zona_id': '',
                'maximo_porcentaje_autorizado': 45,
                'ruc': '',
                'parr_id': '',
                'latitud': null,
                'longitud': null,
            },
            configdateTimePicker: {
                // enableTime: true,
                altInput: true,
                altFormat: 'Y-F-d', // Esto es lo que se ve: 2025-Mayo-02
                dateFormat: 'Y-m-d', // Esto es lo que se envía: 2025-05-02
                allowInput: true, // permite escribir o borrar manualmente
                // maxDate: new Date() // Esto bloquea fechas futuras
            },
            titulo: '',
            // zona: [],
            ciudad: [],
            region: [],
            periodo: [],
            vendedor: [],
            tiposInstitucion: [],
            usuario: '',
            limiteMegas: 1,
            porcentaje: '',
            pesoArchivo: '',
            muyPesado: '',
            msj: '',
            previewImage: null,
            selectedFileName: '',
            permisoRoot: false,
            showError: false,
            email: '',
            Busqueda_representante_legal: [],
            seccion_Busqueda_representante_legal: false,
            encontroresultados: '',
            filtrorepresentante: '',
            validar_BotonesFinalesActivo: false,
            nombrecompleto_representantelegal: null,
            enmarcarSeccion: false, // Nueva variable de estado
            Array_TodoProvincia: [],
            Array_TodoCiudad: [],
            Array_TodoParroquia: [],
            Array_CiudadesFiltradas: [],
            parroquiasFiltradas: [],
            Lista_Institucion_Ciudad_Anterior: [],
            Array_TipoInstitucion: [{
                    id: 1,
                    text: 'Esc. Fiscal'
                },
                {
                    id: 2,
                    text: 'Esc. Particular'
                },
                {
                    id: 3,
                    text: 'Esc. Fiscomisional'
                },
                {
                    id: 4,
                    text: 'Esc. Laico'
                },
                {
                    id: 5,
                    text: 'Esc. Religioso'
                },
            ],
            codigoAmie_instituciones: [], // Instituciones con el mismo código AMIE
            verificandoAmie: false,        // Spinner de verificación
        }
    },
    computed: {
        ...mapState(['userAsesor','userRoot']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.getCiudadSelect();
        // me.getZonaSelect();
        me.getRegionSelect();
        me.getVendedor();
        me.getTiposInstitucion();
        me.get_TodoProvincia();
        me.get_Traerciudadseleccionada_Institucion();
        //   me.validarCorreoPrueba();
        if (me.id == 0) {
            me.titulo = "Agregar institución";
        } else {
            me.titulo = "Guardar Cambios";
            me.getInstitucion(me.id)
        }
        me.getUserRoot()
    },
    methods: {
        limpiarFechaFundacion() {
            this.institucion.fecha_fundacion = null;
        },
        //para obtener el listado de los usuarios root
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                .then(function (res) {
                    if (res.data.status == '1') {
                        me.permisoRoot = true
                    } else {
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        obtenerImagen(e) {
            let me = this;
            me.file = e.target.files[0];

            if (!me.file) {
                me.previewImage = null;
                me.selectedFileName = '';
                return;
            }

            // Guardar el nombre del archivo
            me.selectedFileName = me.file.name;

            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onload = function (event) {
                me.previewImage = event.target.result;
            };
            reader.readAsDataURL(me.file);

            // Validar tamaño
            me.muyPesado = false;
            me.msj = '';
            me.pesoArchivo = (me.file.size / (1024 * 1024)).toFixed(2); // Convertir a MB

            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
                me.msj = `El archivo pesa ${me.pesoArchivo} MB y excede el límite de ${me.limiteMegas} MB permitido`;
                me.previewImage = null; // No mostrar preview si es muy pesado
            }
        },
        cancelarSeleccion() {
            let me = this;
            me.file = null;
            me.previewImage = null;
            me.selectedFileName = '';
            me.msj = '';
            me.muyPesado = false;
            me.pesoArchivo = '';
            // Limpiar el input file
            document.getElementById('file').value = '';
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url + "ciudad").then(function (response) {
                me.ciudad = response.data;
                // console.log(me.ciudad);
            });
        },
        // async getZonaSelect() {
        //     let me = this;
        //     this.$http.get(this.$server_url + "zonas")
        //         .then(function (response) {
        //             me.zona = response.data;
        //         });
        // },
        async getRegionSelect() {
            let me = this;
            this.$http.get(this.$server_url + "region").then(function (response) {
                me.region = response.data;
            });
        },
        async getPeriodoSelect() {
            let me = this;
            this.$http.get(this.$server_url + "periodo").then(function (response) {
                me.periodo = response.data;
            });
        },
        async get_TodoProvincia() {
            let me = this;
            this.$http.get(this.$server_url + "TodoProvincia")
                .then(function (response) {
                    me.Array_TodoProvincia = response.data;
                    // console.log(me.zona);
                });
        },
        async get_Traerciudadseleccionada_Institucion() {
            let me = this;
            this.$http.get(this.$server_url + "Institucion_X_ID", {
                    params: {
                        institucion_idInstitucion: me.id
                    }
                })
                .then(function (response) {
                    me.Lista_Institucion_Ciudad_Anterior = response.data;
                    console.log(me.Lista_Institucion_Ciudad_Anterior, "tet");
                });
        },
        async get_TodoCiudadoCanton(reset = true) {
            let me = this;
            if (reset) {
                me.institucion.idciudad = '';
                me.institucion.parr_id = '';
            }

            try {
                const response = await this.$http.get(this.$server_url + "TodoCiudadoCanton", {
                    params: {
                        provincia_idprovincia: me.institucion.idprovincia
                    }
                });
                me.Array_TodoCiudad = response.data;
                console.log("Ciudades filtradas:", me.Array_TodoCiudad);
            } catch (error) {
                console.error("Error al obtener ciudades:", error);
            }
        },
        async get_TodoParroquia(reset = true) {
            let me = this;
            if (reset) {
                me.institucion.parr_id = '';
            }
            try {
                const response = await this.$http.get(this.$server_url + "TodoParroquia", {
                    params: {
                        idciudad: me.institucion.idciudad
                    }
                });
                me.Array_TodoParroquia = response.data;
                console.log("Parroquias filtradas:", me.Array_TodoParroquia);
            } catch (error) {
                console.error("Error al obtener parroquias:", error);
            }
        },
        async getInstitucion(idinstitucion) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "institucion/" + idinstitucion)
                .then(async function (response) {
                    me.institucion = response.data;
                    // El tipo_institucion ya viene como ID desde la base de datos
                    // No necesita conversión adicional
                    me.institucion.estado = response.data.estado_idEstado
                    me.institucion.matricula = response.data.aplica_matricula == 1 ?
                        me.institucion.matricula = 1 :
                        me.institucion.matricula = 0;
                    me.institucion.idprovincia = response.data.idprovincia;
                    me.GetRepresentante_Institucion();
                    // Llamamos a la carga de ciudades y esperamos
                    await me.get_TodoCiudadoCanton(false);
                    me.institucion.idciudad = response.data.ciudad_id;
                    await me.get_TodoParroquia(false);
                    // Ahora que ya existen las ciudades, asignamos la ciudad de la institución
                    me.institucion.parr_id = response.data.parr_id;
                    console.log(me.institucion.parr_id, "parroqui")
                    // Si tiene código AMIE, verificar automáticamente si hay duplicados
                    if (me.institucion.codigo_amie && me.institucion.codigo_amie.trim() !== '') {
                        await me.verificarCodigoAmieEnServidor();
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        validarCorreo() {
            // Expresión regular para validar direcciones de correo electrónico
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            //return emailRegex.test(email);
            if (!emailRegex.test(this.institucion.email)) {
                // Si el correo electrónico no es válido, mostramos un mensaje de error
                this.showError = true;
            } else {
                // Si el correo electrónico es válido, ocultamos el mensaje de error
                this.showError = false;
            }
        },
        trimCodigoAmie() {
            // Eliminar espacios en blanco al inicio y al final del código AMIE
            if (this.institucion.codigo_amie) {
                this.institucion.codigo_amie = this.institucion.codigo_amie.trim();
            }
        },
        async onBlurCodigoAmie() {
            this.trimCodigoAmie();
            await this.verificarCodigoAmieEnServidor();
        },
        async verificarCodigoAmieEnServidor() {
            this.codigoAmie_instituciones = [];
            if (!this.institucion.codigo_amie || this.institucion.codigo_amie.trim() === '') {
                return;
            }
            this.verificandoAmie = true;
            try {
                const response = await this.$http.get(this.$server_url + 'verificarCodigoAmie', {
                    params: {
                        codigo_amie: this.institucion.codigo_amie,
                        idInstitucion: this.institucion.idInstitucion || 0
                    }
                });
                // Solo mostrar si hay OTRAS instituciones con el mismo código (duplicados reales)
                if (response.data.existe && response.data.instituciones.length > 0) {
                    this.codigoAmie_instituciones = response.data.instituciones;
                }
            } catch (error) {
                console.error('Error al verificar código AMIE:', error);
            } finally {
                this.verificandoAmie = false;
            }
        },
        limpiarCoordenadas() {
            // Limpiar latitud
            if (this.institucion.latitud) {
                let lat = parseFloat(this.institucion.latitud);
                if (!isNaN(lat)) {
                    this.institucion.latitud = lat.toFixed(6); // Redondea a 6 decimales
                }
            }

            // Limpiar longitud
            if (this.institucion.longitud) {
                let lon = parseFloat(this.institucion.longitud);
                if (!isNaN(lon)) {
                    this.institucion.longitud = lon.toFixed(6);
                }
            }
        },
        guardar(data) {
            let me = this;
            this.errors = {
                'idInstitucion': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'email': '',
                'fecha_fundacion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'tipo_institucion': '',
                'idprovincia': '',
                'idciudad': '',
                'region_idregion': '',
                // 'zona_id': '',
                'maximo_porcentaje_autorizado': 45,
                'ruc': '',
            }
            this.codigoAmie_instituciones = [];
            var asesor_id = 0
            if (me.institucion.vendedorInstitucion == "" || me.institucion.vendedorInstitucion == null || me.institucion.vendedorInstitucion == undefined) {} else {
                //obtener el id del asesor
                let datos = me.vendedor
                let obtenerId = datos.filter(p => p.cedula == me.institucion.vendedorInstitucion)
                asesor_id = obtenerId[0].idusuario
            }
            // Validación obligatoria del tipo de institución
            if (!me.institucion.tipo_institucion || me.institucion.tipo_institucion === null || me.institucion.tipo_institucion === '') {
                me.$vs.notify({
                    text: 'El tipo de institución es obligatorio',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            // if (!me.institucion.idprovincia || me.institucion.idprovincia === null || me.institucion.idprovincia === '') {
            //     me.$vs.notify({
            //         text: 'La provincia de la institución es obligatorio',
            //         color: 'warning',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     })
            //     return
            // }

            // if (!me.institucion.idciudad || me.institucion.idciudad === null || me.institucion.idciudad === '') {
            //     me.$vs.notify({
            //         text: 'La ciudad de la institución es obligatorio',
            //         color: 'warning',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     })
            //     return
            // }

            if (me.institucion.maximo_porcentaje_autorizado < 30) {
                me.$vs.notify({
                    text: 'El porcentaje máximo de descuento no puede ser menor a 30',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            if (me.institucion.email && me.institucion.email !== "" && me.institucion.email !== "null" && me.institucion.email !== undefined) {
                if (this.showError == true) {
                    console.log("entro al true el correo es invalido");
                    me.$vs.notify({
                        text: 'El email no es válido, ingrese un email válido o no lo registre.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 10000 // 109 segundos
                    });
                    return;
                } else {
                    console.log("entro al false, el correo es valido");
                }
            }
            console.log(me.institucion.tipo_descripcion, "rep");
            // Asegurar que tipo_descripcion sea solo texto
            if (typeof me.institucion.tipo_descripcion === 'object' && me.institucion.tipo_descripcion !== null) {
                me.institucion.tipo_descripcion = me.institucion.tipo_descripcion.text;
            }

            if (me.institucion.latitud && (isNaN(me.institucion.latitud) || me.institucion.latitud < -90 || me.institucion.latitud > 90)) {
                me.$vs.notify({ text: 'Latitud inválida (debe estar entre -90 y 90)', color: 'warning' })
                return
            }

            if (me.institucion.longitud && (isNaN(me.institucion.longitud) || me.institucion.longitud < -180 || me.institucion.longitud > 180)) {
                me.$vs.notify({ text: 'Longitud inválida (debe estar entre -180 y 180)', color: 'warning' })
                return
            }
            // Validación de coordenadas
            if (this.institucion.latitud) {
                const lat = parseFloat(this.institucion.latitud);
                if (isNaN(lat) || lat < -90 || lat > 90) {
                    this.$vs.notify({
                        text: 'La latitud debe estar entre -90 y 90',
                        color: 'warning'
                    });
                    return;
                }
            }

            if (this.institucion.longitud) {
                const lon = parseFloat(this.institucion.longitud);
                if (isNaN(lon) || lon < -180 || lon > 180) {
                    this.$vs.notify({
                        text: 'La longitud debe estar entre -180 y 180',
                        color: 'warning'
                    });
                    return;
                }
            }
            this.limpiarCoordenadas();
            me.$vs.loading();
            let formData = new FormData();
            formData.append('imagenInstitucion', me.file);
            formData.append('idInstitucion', me.institucion.idInstitucion);
            formData.append('codigo_amie', me.institucion.codigo_amie);
            formData.append('nombreInstitucion', me.institucion.nombreInstitucion);
            formData.append('telefonoInstitucion', me.institucion.telefonoInstitucion);
            formData.append('email', me.institucion.email);
            formData.append('fecha_fundacion', me.institucion.fecha_fundacion);
            formData.append('representante_legal', me.institucion.representante_legal);
            formData.append('direccionInstitucion', me.institucion.direccionInstitucion);
            formData.append('solicitudInstitucion', 0);
            // formData.append('codigo_institucion_milton', me.institucion.codigo_institucion_milton ? me.institucion.codigo_institucion_milton : 0);
            formData.append('vendedorInstitucion', me.institucion.vendedorInstitucion);
            formData.append('tipo_institucion', me.institucion.tipo_institucion);
            formData.append('idcreadorinstitucion', me.usuario.idusuario);
            formData.append('idprovincia', me.institucion.idprovincia);
            formData.append('idciudad', me.institucion.idciudad);
            formData.append('parr_id', me.institucion.parr_id);
            formData.append('tipo_descripcion', me.institucion.tipo_descripcion);
            formData.append('estado', me.institucion.estado)
            formData.append('region_idregion', me.institucion.region_idregion);
            formData.append('aplica_matricula', me.institucion.matricula)
            formData.append('punto_venta', me.institucion.punto_venta)
            formData.append('evaluacion_personalizada', me.institucion.evaluacion_personalizada)
            formData.append('cantidad_cambio_ventana_evaluacion', me.institucion.cantidad_cambio_ventana_evaluacion)
            formData.append('ifcodigoEvaluacion', me.institucion.ifcodigoEvaluacion)
            formData.append('tipo_evaluacion', me.institucion.tipo_evaluacion)
            formData.append('mensaje_tipo_evaluacion', me.institucion.mensaje_tipo_evaluacion)
            // formData.append('zona_id', me.institucion.zona_id) //se debe habilitar cuando la zona sea requerida
            formData.append('asesor_id', asesor_id)
            formData.append('maximo_porcentaje_autorizado', me.institucion.maximo_porcentaje_autorizado);
            formData.append('ruc', me.institucion.ruc);
            formData.append('latitud', me.institucion.latitud || '');
            formData.append('longitud', me.institucion.longitud || '');
            if (me.file == undefined) {
                console.log("aaaaaaa");
                this.$http.post(this.$server_url + "institucion", formData)
                    .then(function (response) {
                        me.file = '';
                        window.$("#file").val('');
                        me.$vs.notify({
                            color: 'success',
                            text: 'Institucion agregada correctamente',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        //0 => RECARGAR ; 1 CERRAR MODAL
                        if (me.xfichero == "si") {
                            me.$vs.loading.close();
                            me.$emit('change', {
                                verificar_ActualizarInstitucion: 1
                            });
                        } else {
                            me.$emit('rechargeInstitucion', "0");
                            me.$vs.loading.close();
                        }
                    })
                    .catch(function (error) {
                        if (error.response.status == '422') {
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.nombreInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.telefonoInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.direccionInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.solicitudInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.vendedorInstitucion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.idprovincia[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {}
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.idciudad[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {}
                            try {
                                me.$vs.notify({
                                    text: error.response.data.errors.region_idregion[0],
                                    color: 'warning',
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    time: 3000
                                })
                            } catch (error) {

                            }
                        }
                        me.$vs.loading.close();
                    })
            } else {
                console.log("eeeeeee");
                formData.append('enviarArchivo', "yes");
                axios.post(this.$data_url + "api/institucion", formData)
                    .then(function (response) {
                        me.file = '';
                        window.$("#file").val('');
                        me.$vs.notify({
                            color: 'success',
                            text: 'Institucion agregada correctamente',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        if (me.xfichero == "si") {
                            me.$vs.loading.close();
                            me.$emit('change', {
                                verificar_ActualizarInstitucion: 1
                            });
                        } else {
                            me.$vs.loading.close();
                            me.volver();
                        }
                    })
                    .catch(function (error) {
                        if (error.response.status == '422') {
                            console.log(error.response.data);
                            me.errors.nombreInstitucion = error.response.data.errors.nombreInstitucion[0];
                            me.errors.telefonoInstitucion = error.response.data.errors.telefonoInstitucion[0];
                            me.errors.direccionInstitucion = error.response.data.errors.direccionInstitucion[0];
                            me.errors.solicitudInstitucion = error.response.data.errors.solicitudInstitucion[0];
                            me.errors.vendedorInstitucion = error.response.data.errors.vendedorInstitucion[0];
                            me.errors.idprovincia = error.response.data.errors.idprovincia[0];
                            me.errors.idciudad = error.response.data.errors.idciudad[0];
                            me.errors.region_idregion = error.response.data.errors.region_idregion[0];
                        }
                        me.$vs.loading.close();
                    })
            }

        },
        async getVendedor() {
            let me = this;
            this.$http.get(this.$server_url + 'listaAsesores')
                .then(function (response) {
                    me.vendedor = response.data.filter(asesor => asesor.estado == 1); // Filtrar solo los asesores activos
                    // console.log(me.vendedor);
                })
                .catch(function (error) {})
        },
        async getTiposInstitucion() {
            let me = this;
            this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
                .then(function (response) {
                    if (response.data.status == 1) {
                        me.tiposInstitucion = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.log('Error al cargar tipos de institución:', error);
                });
        },
        volver() {
            let me = this;
            //0 => RECARGAR ; 1 CERRAR MODAL
            if (me.xfichero == "si") {
                me.$vs.loading.close();
                me.$emit('change', {
                    verificar_ActualizarInstitucion: 2
                });
            } else {
                me.$emit('rechargeInstitucion', "1");
            }

        },
        QuitarRepresentante() {
            this.institucion.representante_legal = null;
        },
        getRepresentanteAsignar() {
            let me = this;
            if (me.filtrorepresentante.trim().length <= 1) {
                me.$vs.notify({
                    text: 'La busqueda debe ser mayor a 4 caracteres.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            this.$vs.loading();
            let parametrosxfiltro = {
                action: 'busquedaUsuarioxCedula_Nombre_Apellido', // Especifica la acción
                filtrousuario_buscar: me.filtrorepresentante, // Especifica la acción
            };
            this.$http.get(this.$server_url + "VerifcarMetodosGet_UsuarioController", {
                    params: parametrosxfiltro
                })
                .then(res => {
                    this.Busqueda_representante_legal = res.data;
                    if (this.Busqueda_representante_legal.length <= 0) {
                        this.encontroresultados = 1
                    } else {
                        this.encontroresultados = 0;
                    }
                    this.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener libros:', error);
                    this.$vs.loading.close();
                });
        },
        seleccionRepresentante(tr) {
            this.institucion.representante_legal = tr.idusuario;
            this.nombrecompleto_representantelegal = tr.nombres + ' ' + tr.apellidos + ' | ' + tr.cedula;
            this.filtrorepresentante = '';
            this.Busqueda_representante_legal = [];
            this.seccion_Busqueda_representante_legal = false;
            this.validar_BotonesFinalesActivo = false;
        },
        GetRepresentante_Institucion() {
            let me = this;
            me.$vs.loading();
            let parametrosxfiltro = {
                action: 'Get_Busqueda_Representante_InstitucionxID', // Especifica la acción
                idusuario: me.institucion.representante_legal,
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_UsuarioController', {
                    params: parametrosxfiltro
                })
                .then((res) => {
                    let datarepresentante = res.data;
                    if (datarepresentante.length > 0) {
                        me.nombrecompleto_representantelegal = `${datarepresentante[0].nombres} ${datarepresentante[0].apellidos} | ${datarepresentante[0].cedula}`;
                    } else {
                        me.nombrecompleto_representantelegal = null; // ✅ Si no hay datos, asigna null
                    }
                    me.$vs.loading.close();
                })
                .catch((error) => {
                    console.log(error + ' error');
                    me.nombrecompleto_representantelegal = null; // ✅ Si hay error, también asigna null
                    me.$vs.loading.close();
                });
        },
        HabilitarBuscarRepresentante() {
            this.seccion_Busqueda_representante_legal = !this.seccion_Busqueda_representante_legal;
            this.validar_BotonesFinalesActivo = !this.validar_BotonesFinalesActivo;
            this.Busqueda_representante_legal = [];
            this.filtrorepresentante = '';
            if (this.seccion_Busqueda_representante_legal == true) {
                this.enmarcarSeccion = true; // Activar el estilo de enmarcado
                // Desplazar hacia la sección
                // Esperar que Vue actualice el DOM antes de intentar hacer scroll
                this.$nextTick(() => {
                    const section = this.$refs.SeccionBusquedaRepresentante && this.$refs.SeccionBusquedaRepresentante.$el ?
                        this.$refs.SeccionBusquedaRepresentante.$el :
                        this.$refs.SeccionBusquedaRepresentante;
                    if (section && section.scrollIntoView) {
                        section.scrollIntoView({
                            behavior: 'smooth', // Desplazamiento suave
                            block: 'start', // Desplazar al inicio de la sección
                        });
                    } else {
                        console.error("El ref no tiene el método scrollIntoView.");
                    }
                });
                // Desactivar el estilo después de 1.5 segundos
                setTimeout(() => {
                    this.enmarcarSeccion = false;
                }, 1500);
            } else {
                this.enmarcarSeccion = false;
            }
        },
        convertirSeleccionAMayusculas() {
            const input = this.$refs.nombreInstitucionInput.$el.querySelector('input');
            if (!input) return;

            const start = input.selectionStart;
            const end = input.selectionEnd;
            const textoActual = input.value;

            // Si no hay selección, convertir todo el texto
            if (start === end) {
                this.institucion.nombreInstitucion = textoActual.toUpperCase();
                return;
            }

            // Convertir solo la selección
            const textoAntes = textoActual.substring(0, start);
            const textoSeleccionado = textoActual.substring(start, end);
            const textoDespues = textoActual.substring(end);

            this.institucion.nombreInstitucion = textoAntes +
                textoSeleccionado.toUpperCase() +
                textoDespues;

            // Restaurar la selección
            this.$nextTick(() => {
                input.setSelectionRange(start, end);
            });
        }
    }
}
</script>

<style scoped>
.enmarcar-seccion {
    border: 4px solid #034AA2;
    border-radius: 20px;
    padding: 10px;
}

/* ─── Wrapper contenedor de la sección AMIE (Light) ────────── */
.amie-section-wrapper {
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 18px 20px 16px;
    background: #f8fafc;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: background 0.3s, border-color 0.3s;
    position: relative;
}

/* Badge de título de sección */
.amie-section-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    position: absolute;
    top: -11px;
    left: 18px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    padding: 2px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #4a5568;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}
.amie-section-badge-icon {
    font-size: 0.78rem;
    color: #718096;
}
.amie-section-label {
    font-size: 0.9rem;
    color: #4a5568;
}

/* Dark */
.amie-section-wrapper--dark {
    background: #1a2035;
    border-color: #2d3a55;
    box-shadow: 0 1px 8px rgba(0,0,0,0.18);
}
.amie-section-wrapper--dark .amie-section-badge {
    background: #1e293b;
    border-color: #2d3a55;
    color: #94a3b8;
}
.amie-section-wrapper--dark .amie-section-badge-icon {
    color: #64748b;
}
.amie-section-wrapper--dark .amie-section-label {
    color: #94a3b8;
}

/* ─── Spinner de verificación AMIE ─────────────────────────── */
.amie-spinner {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
}
.amie-spinner-circle {
    width: 16px;
    height: 16px;
    border: 2px solid #e2e8f0;
    border-top-color: #ed8936;
    border-radius: 50%;
    animation: amie-spin 0.7s linear infinite;
}
@keyframes amie-spin {
    to { transform: rotate(360deg); }
}

/* ─── Panel de duplicados AMIE (Light) ──────────────────────── */
.amie-dup-card {
    margin-top: 12px;
    border-radius: 12px;
    border: 1px solid #fed7aa;          /* orange-200 */
    background: #fff7ed;                /* orange-50 */
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(237, 137, 54, 0.10);
    transition: background 0.3s, border-color 0.3s;
}

/* Header */
.amie-dup-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #ffedd5;                /* orange-100 */
    border-bottom: 1px solid #fed7aa;
}
.amie-dup-header-icon {
    font-size: 1.1rem;
    color: #c05621;                     /* orange-700 */
    flex-shrink: 0;
}
.amie-dup-header-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: #c05621;
    margin: 0;
    line-height: 1.3;
}
.amie-dup-header-sub {
    font-size: 0.75rem;
    color: #9c4221;                     /* orange-800 */
    margin: 0;
    line-height: 1.3;
}

/* Lista */
.amie-dup-list {
    list-style: none;
    margin: 0;
    padding: 0;
}
.amie-dup-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 16px;
    border-bottom: 1px solid #fed7aa;
}
.amie-dup-item:last-child {
    border-bottom: none;
}
.amie-dup-item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ed8936;                /* orange-500 */
    flex-shrink: 0;
    margin-top: 4px;
}
.amie-dup-item-body {
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.amie-dup-item-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #744210;                     /* orange-900 */
    line-height: 1.4;
}
.amie-dup-item-loc {
    font-size: 0.73rem;
    color: #9c6336;
    line-height: 1.3;
}
.amie-dup-item-asesor {
    font-size: 0.72rem;
    color: #718096;
    line-height: 1.3;
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 1px;
}
.amie-dup-item-asesor .feather {
    font-size: 0.7rem;
    flex-shrink: 0;
}

/* Footer */
.amie-dup-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    background: #fff7ed;
    font-size: 0.73rem;
    color: #c05621;
}
.amie-dup-footer-icon {
    font-size: 0.85rem;
    flex-shrink: 0;
}

/* ─── Panel de duplicados AMIE (Dark) ───────────────────────── */
.amie-dup-card--dark {
    background: #1e1a11;
    border-color: #78350f;
    box-shadow: 0 2px 12px rgba(237, 137, 54, 0.08);
}
.amie-dup-card--dark .amie-dup-header {
    background: #291f0d;
    border-bottom-color: #78350f;
}
.amie-dup-card--dark .amie-dup-header-icon {
    color: #fbbf24;
}
.amie-dup-card--dark .amie-dup-header-title {
    color: #fbbf24;
}
.amie-dup-card--dark .amie-dup-header-sub {
    color: #f59e0b;
}
.amie-dup-card--dark .amie-dup-item {
    border-bottom-color: #3d2600;
}
.amie-dup-card--dark .amie-dup-item-dot {
    background: #f59e0b;
}
.amie-dup-card--dark .amie-dup-item-name {
    color: #fde68a;
}
.amie-dup-card--dark .amie-dup-item-loc {
    color: #d97706;
}
.amie-dup-card--dark .amie-dup-item-asesor {
    color: #64748b;
}
.amie-dup-card--dark .amie-dup-footer {
    background: #1e1a11;
    color: #f59e0b;
}

/* ─── Transición ────────────────────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.28s ease, transform 0.28s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
