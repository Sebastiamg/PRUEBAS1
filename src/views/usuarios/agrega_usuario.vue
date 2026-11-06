<template>
    <div>
        <vx-card>
            <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="regresar()">Regresar</vs-button>

            <!-- SECCIÓN DE BÚSQUEDA DE DOCUMENTO -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-search mr-2"></i>
                    Búsqueda de Documento
                </h5>
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/3 mb-4">
                        <label class="vs-input--label font-semibold">Tipo de Documento</label>
                        <v-select
                            :options="tiposDocumento"
                            :reduce="tipo => tipo.value"
                            label="label"
                            v-model="tipoDocumentoSeleccionado"
                            @input="cambiarTipoDocumento"
                            placeholder="Seleccione tipo"
                        ></v-select>
                    </div>
                    <div class="vx-col w-full md:w-2/3 mb-4">
                        <label class="vs-input--label font-semibold">{{ getLabelDocumento() }} ({{ getMaxLengthDocumento() }} dígitos)</label>
                        <div class="flex flex-wrap sm:flex-no-wrap items-start gap-2">
                            <vs-input
                                class="flex-1"
                                icon-pack="feather"
                                icon="icon-credit-card"
                                icon-no-border
                                :placeholder="'Ingrese ' + getMaxLengthDocumento() + ' dígitos y presione Enter'"
                                v-model="usuario.cedula"
                                @keypress="validateInput"
                                @keyup.enter="consultarDocumento"
                                @paste="validatePaste"
                                :disabled="documentoValidado"
                                :maxlength="getMaxLengthDocumento()"
                            />
                            <vs-button
                                v-if="!documentoValidado && (tipoDocumentoSeleccionado === 'cedula' || tipoDocumentoSeleccionado === 'ruc')"
                                color="warning"
                                icon="search"
                                @click="consultarDocumento()"
                                :disabled="!usuario.cedula || consultandoSRI"
                                class="w-full sm:w-auto"
                            >
                                {{ consultandoSRI ? 'Consultando...' : 'Consultar' }}
                            </vs-button>
                            <vs-button
                                v-if="documentoValidado"
                                color="primary"
                                icon="refresh"
                                @click="hacerOtraBusqueda()"
                                class="w-full sm:w-auto"
                            >
                                Otra búsqueda
                            </vs-button>
                        </div>
                        <span v-if="errors.cedula" class="text-danger text-sm block mt-1">{{ errors.cedula[0] }}</span>
                        <div v-if="documentoValidado" class="mt-3 p-3 bg-success text-white rounded flex items-center">
                            <i class="feather icon-check-circle mr-2 text-xl"></i>
                            <span class="font-medium">Documento validado correctamente</span>
                        </div>
                    </div>
                </div>
            </div>

            <vs-divider class="my-6" />

            <!-- SECCIÓN DE DATOS PERSONALES -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-user mr-2"></i>
                    Datos Personales
                </h5>

                <!-- Bloque nombres + apellidos con control de capitalización integrado -->
                <div :class="userRoot ? 'nombres-apellidos-block' : ''">
                    <!-- Header del bloque con switch (solo userRoot) -->
                    <div v-if="userRoot" class="nombres-apellidos-header">
                        <div class="nombres-apellidos-header-left">
                            <i class="feather icon-user-check"></i>
                            <span>Nombres y Apellidos</span>
                        </div>
                        <div class="nombres-apellidos-header-right">
                            <span class="cap-label" :class="autoCapitalizar ? 'cap-label--on' : 'cap-label--off'">
                                <i class="feather" :class="autoCapitalizar ? 'icon-type' : 'icon-slash'"></i>
                                {{ autoCapitalizar ? 'Capitalización automática activa' : 'Capitalización desactivada' }}
                            </span>
                            <vs-switch
                                color="success"
                                v-model="autoCapitalizar"
                                :true-value="true"
                                :false-value="false"
                            >
                                <span slot="on">Aa</span>
                                <span slot="off">aa</span>
                            </vs-switch>
                        </div>
                    </div>

                    <div class="vx-row" :class="userRoot ? 'nombres-apellidos-inputs' : ''">
                        <div class="vx-col w-full md:w-1/2 mb-4">
                            <vs-input
                                class="w-full"
                                icon-pack="feather"
                                icon="icon-user"
                                icon-no-border
                                label="Nombres"
                                v-model="usuario.nombres"
                                @input="onInputNombres"
                            />
                            <span v-if="errors.nombres" class="text-danger text-sm block mt-1">{{ errors.nombres[0] }}</span>
                        </div>
                        <div class="vx-col w-full md:w-1/2 mb-4">
                            <vs-input
                                class="w-full"
                                icon-pack="feather"
                                icon="icon-user"
                                icon-no-border
                                label="Apellidos"
                                v-model="usuario.apellidos"
                                @input="onInputApellidos"
                            />
                            <span v-if="errors.apellidos" class="text-danger text-sm block mt-1">{{ errors.apellidos[0] }}</span>
                        </div>
                    </div>
                </div>

                <div class="vx-row" v-if="userRoot">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-at-sign" icon-no-border label="Usuario" v-model="usuario.name_usuario" />
                        <span v-if="errors.name_usuario" class="text-danger text-sm block mt-1">{{ errors.name_usuario[0] }}</span>
                    </div>
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-tag" icon-no-border label="Iniciales" v-model="usuario.iniciales" placeholder="Máx. 10 caracteres"/>
                        <span v-if="errors.iniciales" class="text-danger text-sm block mt-1">{{ errors.iniciales[0] }}</span>
                    </div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">Fecha de Nacimiento</label>
                        <flat-pickr
                            :config="configdateTimePicker"
                            v-model="usuario.fecha_nacimiento"
                            placeholder="Seleccione fecha"
                            class="w-full"
                        />
                    </div>
                </div>
            </div>

            <vs-divider class="my-6" />

            <!-- SECCIÓN DE CONTACTO -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-mail mr-2"></i>
                    Información de Contacto
                </h5>

                <!-- Switch de validación de correo -->
                <div class="mb-4" v-if="tmp_user.id_group == 1">
                    <vs-switch color="success" v-model="chkValidarEmail">
                        <span slot="on">Con Correo</span>
                        <span slot="off">Sin correo</span>
                    </vs-switch>
                </div>

                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo Electrónico" v-model="usuario.email" placeholder="ejemplo@correo.com" />
                        <span v-if="errors.email" class="text-danger text-sm block mt-1">{{ errors.email[0] }}</span>
                    </div>
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-phone" icon-no-border label="Teléfono" v-model="usuario.telefono" placeholder="0999999999" />
                        <span v-if="errors.telefono" class="text-danger text-sm block mt-1">{{ errors.telefono[0] }}</span>
                    </div>
                </div>
            </div>

            <vs-divider class="my-6" />

            <!-- SECCIÓN DE CONFIGURACIÓN -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-settings mr-2"></i>
                    Configuración del Usuario
                </h5>
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">Perfil</label>
                        <v-select :options="grupo" :reduce="grupo => grupo.id" label="deskripsi" v-model="usuario.id_group" placeholder="Seleccione perfil"></v-select>
                        <span v-if="errors.id_group" class="text-danger text-sm block mt-1">{{ errors.id_group[0] }}</span>
                    </div>
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">Estado</label>
                        <v-select :options="estado" :reduce="estado => estado.id" label="label" v-model="usuario.estado_idEstado" placeholder="Seleccione estado"></v-select>
                        <span v-if="errors.estado_idEstado" class="text-danger text-sm block mt-1">{{ errors.estado_idEstado[0] }}</span>
                    </div>
                </div>


                <div class="vx-row" v-if="userRoot && usuario.id_group == 11">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-hash" icon-no-border label="ID Cliente Institución" v-model="usuario.cli_ins_codigo" />
                    </div>
                </div>

                <div class="vx-row" v-if="usuario.id_group == 22 || usuario.id_group == 23">
                    <div class="vx-col w-full mb-4">
                        <h6 class="text-primary font-semibold mb-4">
                            <i class="feather icon-plus-circle mr-2"></i>
                            Agregar Facturadores Perseo
                        </h6>
                    </div>
                </div>

                <div class="vx-row" v-if="usuario.id_group == 22 || usuario.id_group == 23">
                    <div class="vx-col w-full md:w-1/3 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">
                            Empresa
                            <span v-if="cargandoEmpresas" class="text-primary text-xs ml-2">
                                <i class="feather icon-loader animate-spin"></i>
                            </span>
                        </label>
                        <v-select
                            :options="empresas"
                            :reduce="empresa => empresa"
                            label="nombre"
                            v-model="empresaSeleccionada"
                            placeholder="Seleccione empresa"
                            :disabled="cargandoEmpresas"
                            :loading="cargandoEmpresas"
                        >
                            <template #no-options>
                                <span v-if="cargandoEmpresas">Cargando...</span>
                                <span v-else>No hay empresas</span>
                            </template>
                        </v-select>
                    </div>

                    <div class="vx-col w-full md:w-1/3 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">
                            Facturador
                            <span v-if="cargandoFacturadores" class="text-primary text-xs ml-2">
                                <i class="feather icon-loader animate-spin"></i>
                            </span>
                        </label>
                        <v-select
                            :options="facturadores"
                            :reduce="facturador => facturador"
                            label="nombres"
                            v-model="facturadorSeleccionado"
                            :placeholder="cargandoFacturadores ? 'Cargando...' : (empresaSeleccionada ? 'Seleccione facturador' : 'Primero empresa')"
                            :disabled="cargandoFacturadores || !empresaSeleccionada"
                            :loading="cargandoFacturadores"
                        >
                            <template #no-options>
                                <span v-if="cargandoFacturadores">Cargando...</span>
                                <span v-else-if="!empresaSeleccionada">Seleccione empresa primero</span>
                                <span v-else>No hay facturadores</span>
                            </template>
                        </v-select>
                    </div>

                    <div class="vx-col w-full md:w-1/3 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">&nbsp;</label>
                        <vs-button
                            color="success"
                            icon="add"
                            @click="agregarFacturador()"
                            :disabled="!empresaSeleccionada || !facturadorSeleccionado"
                            class="w-full"
                        >
                            Agregar
                        </vs-button>
                    </div>
                </div>

                <div class="vx-row" v-if="usuario.id_group == 22 || usuario.id_group == 23">
                    <div class="vx-col w-full mb-4">
                        <label class="vs-input--label font-semibold mb-3 block">Facturadores perseo Asignados</label>
                        <div v-if="facturadoresAsignados.length > 0" class="border border-gray-200 rounded-lg overflow-hidden">
                            <table class="w-full">
                                <thead class="bg-primary text-white">
                                    <tr>
                                        <th class="px-4 py-3 text-left">Empresa</th>
                                        <th class="px-4 py-3 text-left">Facturador</th>
                                        <th class="px-4 py-3 text-center w-20">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in facturadoresAsignados" :key="index" class="border-t border-gray-200 hover:bg-gray-50">
                                        <td class="px-4 py-3">{{ item.empresa_nombre }}</td>
                                        <td class="px-4 py-3">{{ item.facturador_nombre }}</td>
                                        <td class="px-4 py-3 text-center">
                                            <vs-button
                                                size="small"
                                                color="danger"
                                                icon-pack="feather"
                                                icon="icon-trash"
                                                @click="eliminarFacturador(index)"
                                                type="border"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <i class="feather icon-inbox text-gray-400" style="font-size: 2rem;"></i>
                            <p class="text-gray-500 mt-2">No hay facturadores asignados</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BLOQUE: Capacitador -->
            <div class="vx-row mb-4" v-if="userRoot">
                <div class="vx-col w-full md:w-1/2 mb-4">
                    <label class="vs-input--label font-semibold mb-2 flex items-center">
                        ¿Es Capacitador?
                    </label>
                    <div class="flex items-center">
                        <vs-switch
                            color="success"
                            v-model="capacitador"
                            :true-value="1"
                            :false-value="0"
                        >
                            <span slot="on">Si</span>
                            <span slot="off">No</span>
                        </vs-switch>
                        <span class="ml-3 text-sm text-gray-600">Activar si es capacitador</span>
                    </div>
                </div>
            </div>

            <!-- BLOQUE: Usuario Prolipa / Jefe Departamento -->
            <div class="vx-row mb-4">
                <div class="vx-col w-full md:w-1/2 mb-4">
                    <label class="vs-input--label font-semibold mb-2 flex items-center">
                      ¿Es Usuario Prolipa?
                      <div v-if="userRoot" class="flex items-center gap-1 ml-2">
                        <vx-tooltip
                            text="Al activar esta opción, el usuario podrá ingresar con su cédula al módulo de registro de horas extras y permisos de Talento Humano."
                            position="right"
                            color="primary">
                            <i class="feather icon-info" style="color: #0ea5e9; font-size: 14px;"></i>
                        </vx-tooltip>
                        <a
                            href="https://plataforma.prolipadigital.com.ec/talento-humano/reportes"
                            target="_blank"
                            class="text-primary text-xs hover:underline">
                            Ver módulo
                        </a>
                      </div>
                    </label>
                    <div class="flex items-center">
                        <vs-switch
                            color="success"
                            v-model="usuario.es_usuario_prolipa"
                            :true-value="1"
                            :false-value="0"
                            @input="usuario.es_usuario_prolipa == 0 ? usuario.jefe_departamento = 0 : null"
                        >
                            <span slot="on">Si</span>
                            <span slot="off">No</span>
                        </vs-switch>
                        <span class="ml-3 text-sm text-gray-600">Activar si el usuario pertenece a Prolipa</span>
                    </div>
                </div>

                <div class="vx-col w-full md:w-1/2 mb-4" v-if="usuario.es_usuario_prolipa == 1">
                    <label class="vs-input--label font-semibold mb-2 block">Jefe de Departamento</label>
                    <div class="flex items-center">
                        <vs-switch
                            color="warning"
                            v-model="usuario.jefe_departamento"
                            :true-value="1"
                            :false-value="0"
                        >
                            <span slot="on">Si</span>
                            <span slot="off">No</span>
                        </vs-switch>
                        <span class="ml-3 text-sm text-gray-600">Activar si es Jefe de Departamento</span>
                    </div>
                </div>
            </div>

            <vs-divider class="my-6" />

            <!-- SECCIÓN DE UBICACIÓN -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-map-pin mr-2"></i>
                    Ubicación e Institución
                </h5>
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">Provincia</label>
                        <v-select
                            @input="filtrarInstituciones()"
                            :options="arregloProvincias"
                            :reduce="arregloProvincias => arregloProvincias"
                            label="nombreprovincia"
                            v-model="provinciaSelect"
                            placeholder="Seleccione una provincia"
                        >
                            <template #no-options>
                                No hay provincias disponibles
                            </template>
                        </v-select>
                    </div>
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">
                            Institución
                            <span v-if="cargandoInstituciones" class="text-primary text-xs ml-2">
                                <i class="feather icon-loader animate-spin"></i> Cargando...
                            </span>
                        </label>
                        <v-select
                            :options="arregloTraeInstitucion"
                            :reduce="arregloTraeInstitucion => arregloTraeInstitucion"
                            label="nombreCompletoIns"
                            v-model="usuario.institucion_idInstitucion"
                            :placeholder="cargandoInstituciones ? 'Cargando instituciones...' : (provinciaSelect ? 'Seleccione institución' : 'Primero seleccione una provincia')"
                            :disabled="cargandoInstituciones || !provinciaSelect"
                            :loading="cargandoInstituciones"
                        >
                            <template #no-options>
                                <span v-if="cargandoInstituciones">Cargando instituciones...</span>
                                <span v-else-if="!provinciaSelect">Primero seleccione una provincia</span>
                                <span v-else>No hay instituciones en esta provincia</span>
                            </template>
                        </v-select>
                        <small v-if="!cargandoInstituciones && provinciaSelect && arregloTraeInstitucion.length === 0" class="text-warning block mt-1">
                            <i class="feather icon-alert-circle"></i> No hay instituciones disponibles en esta provincia
                        </small>
                    </div>
                </div>

                <!-- <div class="vx-row">
                    <div class="vx-col w-full md:w-1/2 mb-4">
                        <label class="vs-input--label font-semibold mb-2 block">Cargo</label>
                        <div class="flex gap-2">
                            <v-select
                                :options="cargos"
                                :reduce="cargos => cargos"
                                label="cargo"
                                class="flex-1"
                                v-model="usuario.cargo_id"
                                placeholder="Seleccione cargo"
                            />
                            <vs-button color="success" icon="add" @click="popupAddCargo = true" >Añadir</vs-button>
                        </div>
                    </div>
                </div> -->
            </div>

            <vs-divider class="my-6" />

            <!-- SECCIÓN DE FIRMA DIGITAL -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-edit mr-2"></i>
                    Firma Digital
                </h5>
                <div class="firma-section">
                    <p class="firma-subtitle">
                        <i class="feather icon-info mr-1"></i>
                        <strong>Importante:</strong> Sube una imagen en formato PNG sin fondo.
                        Si tu imagen tiene fondo, puedes quitarlo en
                        <a href="https://www.remove.bg/es" target="_blank" class="firma-link">https://www.remove.bg/es</a>
                    </p>

                    <!-- Vista previa de firma -->
                    <div class="firma-preview-section">
                        <!-- Vista previa de nueva firma -->
                        <div v-if="previewFirma && !muyPesadoFirma" class="firma-preview-container">
                            <div class="firma-preview-image">
                                <img :src="previewFirma" alt="Vista previa de firma" class="firma-img" />
                                <div class="firma-badge firma-badge-new">
                                    <i class="feather icon-check"></i> Nueva
                                </div>
                            </div>
                            <p class="firma-info">
                                <i class="feather icon-file mr-1"></i>{{ selectedFirmaName }} ({{ pesoArchivoFirma }} MB)
                            </p>
                            <vs-button @click="cancelarSeleccionFirma" size="small" type="border" color="danger" class="mt-2">
                                <i class="feather icon-x mr-1"></i>Cancelar
                            </vs-button>
                        </div>

                        <!-- Sin firma -->
                        <div v-else class="firma-no-image">
                            <i class="feather icon-edit-3 firma-no-image-icon"></i>
                            <p class="firma-no-image-text">Sin firma asignada</p>
                        </div>
                    </div>

                    <!-- Input de archivo -->
                    <div class="firma-input-section">
                        <label for="firmaFile" class="firma-btn-upload">
                            <i class="feather icon-upload mr-2"></i>
                            <span>Buscar en el ordenador</span>
                        </label>
                        <input
                            type="file"
                            id="firmaFile"
                            class="firma-input-hidden"
                            @change="obtenerImagenFirma"
                            accept="image/png, image/jpeg, image/jpg"
                        />
                    </div>

                    <!-- Información -->
                    <div class="firma-info-box">
                        <div class="firma-info-item">
                            <i class="feather icon-info"></i>
                            <span>Tamaño máximo: {{ limiteMegasFirma }} MB</span>
                        </div>
                        <div class="firma-info-item">
                            <i class="feather icon-check-circle"></i>
                            <span>Formatos: PNG (recomendado), JPG, JPEG</span>
                        </div>
                        <div class="firma-info-item">
                            <i class="feather icon-square"></i>
                            <span>Recomendado: PNG con fondo transparente</span>
                        </div>
                    </div>

                    <!-- Mensaje de error -->
                    <div v-if="msjFirma" class="firma-error">
                        <i class="feather icon-alert-triangle mr-1"></i>{{ msjFirma }}
                    </div>
                </div>
            </div>

            <vs-divider class="my-6" />

            <!-- SECCIÓN DE FIRMA ELECTRÓNICA -->
            <div class="mb-6">
                <h5 class="mb-4 text-primary font-semibold flex items-center">
                    <i class="feather icon-shield mr-2"></i>
                    Firma Electrónica
                </h5>
                <div class="firma-section certificado-section">
                    <p class="firma-subtitle certificado-subtitle">
                        <i class="feather icon-info mr-1"></i>
                        <strong>Importante:</strong> Sube tu certificado digital emitido en Ecuador
                        (Security Data, BCE, ANF, etc.) en formato <strong>.p12</strong> o <strong>.pfx</strong>
                        e ingresa la contraseña del certificado.
                    </p>

                    <div class="firma-preview-section">
                        <div v-if="fileCertificadoP12" class="firma-preview-container">
                            <div class="certificado-preview-card certificado-preview-new">
                                <i class="feather icon-file-text certificado-preview-icon"></i>
                                <div class="firma-badge firma-badge-new">
                                    <i class="feather icon-check"></i> Nuevo
                                </div>
                            </div>
                            <p class="firma-info">
                                <i class="feather icon-file mr-1"></i>{{ selectedCertificadoName }} ({{ pesoArchivoCertificado }} MB)
                            </p>
                            <vs-button @click="cancelarSeleccionCertificado" size="small" type="border" color="danger" class="mt-2">
                                <i class="feather icon-x mr-1"></i>Cancelar
                            </vs-button>
                        </div>

                        <div v-else class="firma-no-image">
                            <i class="feather icon-shield certificado-no-icon"></i>
                            <p class="firma-no-image-text">Sin firma electrónica asignada</p>
                        </div>
                    </div>

                    <div class="firma-input-section">
                        <label for="certificadoP12File" class="firma-btn-upload certificado-btn-upload">
                            <i class="feather icon-upload mr-2"></i>
                            <span>Subir firma electrónica</span>
                        </label>
                        <input
                            type="file"
                            id="certificadoP12File"
                            class="firma-input-hidden"
                            @change="obtenerCertificadoP12"
                            accept=".p12,.pfx,application/x-pkcs12"
                        />
                    </div>

                    <div class="certificado-password-section">
                        <label class="certificado-password-label">
                            Contraseña del certificado
                            <span v-if="fileCertificadoP12" class="text-danger">*</span>
                        </label>
                        <div class="certificado-password-wrap">
                            <input
                                :type="showPasswordP12 ? 'text' : 'password'"
                                class="certificado-password-input"
                                :class="{ 'certificado-password-input--required': fileCertificadoP12 && !(passwordP12 || '').trim() }"
                                placeholder="Ingrese la contraseña del archivo .p12"
                                v-model="passwordP12"
                                autocomplete="new-password"
                                @input="msjCertificado = ''"
                            />
                            <button
                                class="certificado-password-toggle"
                                type="button"
                                @click="showPasswordP12 = !showPasswordP12"
                                :title="showPasswordP12 ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                            >
                                <i :class="showPasswordP12 ? 'feather icon-eye-off' : 'feather icon-eye'"></i>
                            </button>
                        </div>
                        <p class="certificado-password-hint">
                            Obligatoria al subir un certificado .p12 o .pfx.
                        </p>
                    </div>

                    <div class="firma-info-box certificado-info-box">
                        <div class="firma-info-item">
                            <i class="feather icon-info"></i>
                            <span>Tamaño máximo: {{ limiteMegasCertificado }} MB</span>
                        </div>
                        <div class="firma-info-item">
                            <i class="feather icon-check-circle"></i>
                            <span>Formatos permitidos: .p12, .pfx</span>
                        </div>
                        <div class="firma-info-item">
                            <i class="feather icon-lock"></i>
                            <span>La contraseña se valida contra el certificado antes de guardar</span>
                        </div>
                    </div>

                    <div v-if="msjCertificado" class="firma-error">
                        <i class="feather icon-alert-triangle mr-1"></i>{{ msjCertificado }}
                    </div>
                </div>
            </div>

            <vs-divider class="my-6" />

            <!-- BOTÓN DE GUARDAR -->
            <div class="flex justify-center mt-8 mb-4">
                <vs-button
                    @click="guardar()"
                    color="success"
                    icon-pack="feather"
                    icon="icon-save"
                    class="px-8"
                    type="relief"
                    :disabled="!!fileCertificadoP12 && (!(passwordP12 || '').trim() || muyPesadoCertificado)"
                >
                    Agregar Usuario
                </vs-button>
            </div>
        </vx-card>
        <!--MODALES-->
        <!--Modal añadir cargos-->
        <vs-popup background-color="rgba(255,255,255,.6)" title="Añadir cargos" :active.sync="popupAddCargo">
            <vs-table max-items="5" search pagination :data="cargos" v-if="editCargo == false">
                <template slot="header">
                    <div>
                        <vs-button type="line" style="border-radius: 10px;" icon="add" @click="editCargo = true;limpiar();update=false;">Añadir</vs-button>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th>Cargo</vs-th>
                    <vs-th style="width:100px;">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].cargo}}<br>
                        </vs-td>
                        <vs-td>
                            <div style="display:flex;">
                                <vx-tooltip style="display: inline-block;" text="Editar cargo" position="top" color="primary">
                                    <vs-button size="small" class="modal-default-button" color="success" @click="editarCargo(tr);update=true" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                                </vx-tooltip> &nbsp;

                                <div>
                                    <vx-tooltip v-if="tr.estado == 1" style="display: inline-block;" text="Desactivar cargo" position="top" color="primary">
                                        <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirmCargo(tr,0);" icon-pack="feather" type="filled" icon="icon-trash"> </vs-button>
                                    </vx-tooltip> &nbsp;

                                    <vx-tooltip v-if="tr.estado == 0 && tmp_user.id_group == 1" style="display: inline-block;" text="Activar cargo" position="top" color="primary">
                                        <vs-button size="small" class="modal-default-button" color="warning" @click="openConfirmCargo(tr,1);" icon-pack="feather" type="filled" icon="icon-check"> </vs-button>
                                    </vx-tooltip> &nbsp;

                                </div>

                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
            <!--PARA EDITAR CARGO-->
            <div v-if="editCargo == true">
                <vs-button radius color="success" type="filled" @click="editCargo = false" icon="reply"></vs-button>
                <vs-row class="mt-4">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-input label="Cargo" class="w-full" placeholder="Cargo" v-model="cargo.cargo" />
                    </vs-col>
                </vs-row>
                <vs-row class="mt-5">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-button color="success" @click="guardarCargo()" type="relief">Guardar</vs-button>
                    </vs-col>
                </vs-row>
            </div>
        </vs-popup>
    </div>
    </template>

    <script>
    import vSelect from 'vue-select'
    import 'vue-select/dist/vue-select.css';
    import VueDocPreview from 'vue-doc-preview'
    import Vue from 'vue'
    import axios from 'axios'
    import Datepicker from 'vuejs-datepicker'
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    Vue.use(axios)
    export default {
        components: {
            'v-select': vSelect,
            Datepicker,
            flatPickr,
        },
        data() {
            return {
                capacitador: 0,
                editCargo: false,
                popupAddCargo: false,
                configdateTimePicker: {
                    enableTime: true,
                    dateFormat: 'Y-m-d'
                },
                usuario: {},
                estado: [{
                        id: 1,
                        label: "Activo"
                    },
                    {
                        id: 2,
                        label: "Bloqueado"
                    },
                    {
                        id: 4,
                        label: "Eliminado"
                    }
                ],
                usuario: {
                    'cedula': '',
                    'nombres': '',
                    'apellidos': '',
                    'correo': '',
                    'name_usuario': '',
                    'iniciales': '',
                    'telefono': '',
                    'id_group': '',
                    'cli_ins_codigo': '',
                    'estado_idEstado': '',
                    'institucion_idInstitucion': '',
                    'idcreadorusuario': '',
                    'cargo_id': '',
                    'fecha_nacimiento': '',
                    'es_usuario_prolipa': 0,
                    'jefe_departamento': 0
                },
                error: '',
                password: '',
                passwordc: '',
                btn: false,
                ciudad: [],
                institucion: '',
                instituciones: [],
                grupo: [],
                idregion: '',
                idciudad: '',
                provinciaSelect: '',
                errors: {},
                arregloInstitucion: [],
                //para traer las ciudades
                arregloCiudad: [],
                arregloProvincias: [],
                //arreglo para filtrar las instituciones por ciudades
                arregloTraeInstitucion: [],
                //para el select de la ciudades
                op_agregar: 0,
                tmp_user: '',
                cargos: [],
                cargo: {
                    id: '',
                    cargo: '',
                    estado: '',
                },
                userRoot: false,
                chkValidarEmail: true,
                UsuarioGrupo: [],
                AsesorValidacion: false,
                cargoIdTemporal: 660,
                autoCapitalizar: true,
                tiposDocumento: [
                    { value: 'cedula', label: 'Cédula' },
                    { value: 'ruc', label: 'RUC' },
                    { value: 'pasaporte', label: 'Pasaporte' }
                ],
                tipoDocumentoSeleccionado: 'cedula',
                consultandoSRI: false,
                datosSRI: null,
                errorSRI: null,
                documentoValidado: false,
                cargandoInstituciones: false,
                // Variables para firma
                fileFirma: null,
                previewFirma: null,
                selectedFirmaName: '',
                limiteMegasFirma: 3,
                pesoArchivoFirma: '',
                muyPesadoFirma: false,
                msjFirma: '',
                // Variables para firma electrónica (certificado .p12)
                fileCertificadoP12: null,
                selectedCertificadoName: '',
                limiteMegasCertificado: 5,
                pesoArchivoCertificado: '',
                muyPesadoCertificado: false,
                msjCertificado: '',
                passwordP12: '',
                showPasswordP12: false,
                // Variables para facturadores múltiples
                empresas: [],
                empresasBase: [],
                empresaSeleccionada: null,
                facturadores: [],
                facturadorSeleccionado: null,
                facturadoresAsignados: [],
                cargandoEmpresas: false,
                cargandoFacturadores: false,
            }
        },
        created() {
            let me = this
            me.UsuarioGrupo = JSON.parse(localStorage.getItem("usuario"))
            if(me.UsuarioGrupo.id_group == 11){
                me.AsesorValidacion = true;
            }
        },
        mounted() {
            let me = this;
            me.tmp_user = JSON.parse(localStorage.getItem('usuario'));
            me.usuario.idcreadorusuario = me.tmp_user.idusuario;
            me.getPerfiles();
            me.listaProvincias();
            me.getCargos();
            me.getUserRoot(me.tmp_user);
        },
        watch: {
            'usuario.iniciales': function (newVal) {
                // Asegúrate de que el valor en el input sea siempre en mayúsculas y no más de 10 caracteres
                if (newVal.length > 10) {
                    this.usuario.iniciales = newVal.slice(0, 10).toUpperCase();
                } else {
                    this.usuario.iniciales = newVal.toUpperCase();
                }
            },
            'usuario.cedula': function (newVal) {
                // Validar longitud según el tipo de documento
                let maxLength = this.getMaxLengthDocumento();
                if (newVal && newVal.length > maxLength) {
                    this.usuario.cedula = newVal.slice(0, maxLength);
                }
            },
            'usuario.id_group': function (newVal) {
                if (newVal == 22 || newVal == 23) {
                    this.traerEmpresas();
                } else {
                    this.empresas = [];
                    this.empresasBase = [];
                    this.empresaSeleccionada = null;
                    this.facturadores = [];
                    this.facturadorSeleccionado = null;
                    this.facturadoresAsignados = [];
                }
            },
            'empresaSeleccionada': function (newVal) {
                if (newVal) {
                    this.traerFacturadores(newVal);
                }
            }
        },
        methods: {
            // Capitalizar primera letra de cada palabra
            capitalizarTexto(texto) {
                if (!texto) return texto;
                return texto
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, char => char.toUpperCase());
            },
            onInputNombres(value) {
                if (!this.autoCapitalizar && this.userRoot) return;
                this.$nextTick(() => {
                    this.usuario.nombres = this.capitalizarTexto(this.usuario.nombres);
                });
            },
            onInputApellidos(value) {
                if (!this.autoCapitalizar && this.userRoot) return;
                this.$nextTick(() => {
                    this.usuario.apellidos = this.capitalizarTexto(this.usuario.apellidos);
                });
            },
            getMaxLengthDocumento() {
                // Retorna la longitud máxima según el tipo de documento
                if (this.tipoDocumentoSeleccionado === 'cedula') {
                    return 10;
                } else if (this.tipoDocumentoSeleccionado === 'ruc') {
                    return 13;
                } else if (this.tipoDocumentoSeleccionado === 'pasaporte') {
                    return 10;
                }
                return 13; // Por defecto
            },
            validateInput(event) {
                // Validar que solo se ingresen números
                if(this.AsesorValidacion){
                    const charCode = event.which ? event.which : event.keyCode;
                    if (charCode < 48 || charCode > 57) {
                        event.preventDefault();
                        return;
                    }
                }

                // Validar longitud máxima
                const maxLength = this.getMaxLengthDocumento();
                if (this.usuario.cedula && this.usuario.cedula.length >= maxLength) {
                    event.preventDefault();
                }
            },
            validatePaste(event) {
                event.preventDefault();
                const clipboardData = event.clipboardData || window.clipboardData;
                const pastedText = clipboardData.getData('text/plain');

                // Filtrar solo números
                const numbersOnly = pastedText.replace(/\D/g, '');

                // Obtener longitud máxima
                const maxLength = this.getMaxLengthDocumento();

                // Obtener el input donde se está pegando
                const input = event.target;
                const start = input.selectionStart;
                const end = input.selectionEnd;

                // Calcular cuántos caracteres se pueden agregar
                const currentLength = this.usuario.cedula ? this.usuario.cedula.length : 0;
                const selectedLength = end - start;
                const availableSpace = maxLength - (currentLength - selectedLength);

                // Limitar el texto pegado a la longitud disponible
                const textToInsert = numbersOnly.slice(0, availableSpace);

                // Insertar el texto en la posición actual del cursor
                this.usuario.cedula =
                    (this.usuario.cedula || '').slice(0, start) +
                    textToInsert +
                    (this.usuario.cedula || '').slice(end);

                // Mover el cursor al final del texto insertado
                this.$nextTick(() => {
                    input.selectionStart = input.selectionEnd = start + textToInsert.length;
                });
            },
            getLabelDocumento() {
                const tipo = this.tiposDocumento.find(t => t.value === this.tipoDocumentoSeleccionado);
                return tipo ? tipo.label : 'Documento';
            },
            cambiarTipoDocumento() {
                // Limpiar todo cuando se cambia el tipo de documento
                this.hacerOtraBusqueda();
            },
            consultarDocumento() {
                let me = this;

                if (!me.usuario.cedula) {
                    me.$vs.notify({
                        text: 'Debe ingresar un número de documento',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                // Validar longitud según el tipo de documento
                const maxLength = me.getMaxLengthDocumento();
                const minLength = (me.tipoDocumentoSeleccionado === 'cedula' || me.tipoDocumentoSeleccionado === 'pasaporte') ? 10 : 13;

                if (me.usuario.cedula.length !== minLength) {
                    me.$vs.notify({
                        text: `El ${me.getLabelDocumento()} debe tener ${minLength} dígitos`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                me.consultandoSRI = true;
                me.datosSRI = null;
                me.errorSRI = null;

                const formData = new FormData();

                // Si es cédula, usar la ruta de consulta de cédula
                if (me.tipoDocumentoSeleccionado === 'cedula') {
                    formData.append('getCedulaRegistroCivil', 1);
                    formData.append('cedula', me.usuario.cedula);

                    me.$http.post(me.$server_url + 'pedidos2/pedidos', formData)
                        .then(response => {
                            me.consultandoSRI = false;

                            if (response.data && response.data.data && response.data.data.data) {
                                me.datosSRI = response.data.data.data;

                                // Autocompletar nombres y apellidos para cédula
                                // Dividir: 2 primeros = apellidos, 2 últimos = nombres
                                if (me.datosSRI.names) {
                                    const nombreCompleto = me.datosSRI.names.trim();
                                    const partesNombre = nombreCompleto.split(' ');

                                    if (partesNombre.length >= 4) {
                                        // Si tiene 4 o más partes: 2 primeros = apellidos, resto = nombres
                                        me.usuario.apellidos = partesNombre.slice(0, 2).join(' ');
                                        me.usuario.nombres = partesNombre.slice(2).join(' ');
                                    } else if (partesNombre.length === 3) {
                                        // Si tiene 3 partes: 1 apellido, 2 nombres
                                        me.usuario.apellidos = partesNombre[0];
                                        me.usuario.nombres = partesNombre.slice(1).join(' ');
                                    } else if (partesNombre.length === 2) {
                                        // Si tiene 2 partes: 1 apellido, 1 nombre
                                        me.usuario.apellidos = partesNombre[0];
                                        me.usuario.nombres = partesNombre[1];
                                    } else {
                                        // Si solo tiene 1 parte, ponerlo en nombres
                                        me.usuario.nombres = nombreCompleto;
                                        me.usuario.apellidos = '';
                                    }
                                }

                                // Marcar como validado
                                me.documentoValidado = true;

                                me.$vs.notify({
                                    text: 'Cédula validada correctamente',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            } else {
                                me.errorSRI = 'No se encontraron datos para la cédula ingresada';
                                me.$vs.notify({
                                    text: 'Cédula no encontrada',
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-x'
                                });
                            }
                        })
                        .catch(error => {
                            me.consultandoSRI = false;
                            console.error('Error en consulta:', error);
                            me.errorSRI = 'Error al consultar. Verifique el número ingresado.';
                            me.$vs.notify({
                                text: 'Cédula no encontrada o inválida',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        });
                } else if (me.tipoDocumentoSeleccionado === 'ruc') {
                    // Si es RUC, usar la consulta del SRI
                    formData.append('getRucBusqueda', 1);
                    formData.append('ruc', me.usuario.cedula);

                    me.$http.post(me.$server_url + 'pedidos2/pedidos', formData)
                        .then(response => {
                            me.consultandoSRI = false;

                            if (response.data && response.data.status === "1" && response.data.data && response.data.data.length > 0) {
                                me.datosSRI = response.data.data[0];

                                // Autocompletar con razón social
                                if (me.datosSRI.razonSocial) {
                                    // Si es persona natural, intentar dividir el nombre
                                    if (me.datosSRI.tipoContribuyente === 'PERSONA NATURAL') {
                                        const nombreCompleto = me.datosSRI.razonSocial.trim();
                                        const partesNombre = nombreCompleto.split(' ');

                                        if (partesNombre.length >= 2) {
                                            const mitad = Math.ceil(partesNombre.length / 2);
                                            me.usuario.nombres = partesNombre.slice(0, mitad).join(' ');
                                            me.usuario.apellidos = partesNombre.slice(mitad).join(' ');
                                        } else {
                                            me.usuario.nombres = nombreCompleto;
                                            me.usuario.apellidos = '';
                                        }
                                    } else {
                                        // Para empresas, usar razón social como nombre
                                        me.usuario.nombres = me.datosSRI.razonSocial;
                                        me.usuario.apellidos = '';
                                    }
                                }

                                // Marcar como validado
                                me.documentoValidado = true;

                                me.$vs.notify({
                                    text: 'RUC validado correctamente',
                                    color: 'success',
                                    iconPack: 'feather',
                                    icon: 'icon-check'
                                });
                            } else {
                                me.errorSRI = 'No se encontraron datos para el RUC ingresado';
                                me.$vs.notify({
                                    text: 'RUC no encontrado',
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-x'
                                });
                            }
                        })
                        .catch(error => {
                            me.consultandoSRI = false;
                            console.error('Error en consulta:', error);
                            me.errorSRI = 'Error al consultar. Verifique el número ingresado.';
                            me.$vs.notify({
                                text: 'RUC no encontrado o inválido',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        });
                }
            },
            hacerOtraBusqueda() {
                let me = this;

                // Limpiar todos los datos
                me.usuario.cedula = '';
                me.usuario.nombres = '';
                me.usuario.apellidos = '';
                me.datosSRI = null;
                me.errorSRI = null;
                me.documentoValidado = false;
                me.consultandoSRI = false;

                me.$vs.notify({
                    text: 'Puede realizar una nueva búsqueda',
                    color: 'primary',
                    iconPack: 'feather',
                    icon: 'icon-info'
                });
            },
            getUserRoot(dato) {
                let me = this;
                this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                    .then((result) => {
                        if (result.data.length > 0) {
                            me.userRoot = true;
                        }
                    })
                    .catch((err) => {})
            },
            limpiar() {
                let me = this;
                me.cargo.id = "";
                me.cargo.cargo = "";
            },
            editarCargo(tr) {
                let me = this;
                me.cargo.id = tr.id
                me.cargo.cargo = tr.cargo
                me.editCargo = true
            },
            openConfirmCargo(tr, estado) {
                let me = this;
                me.popupAddCargo = false;
                me.cargo.id = tr.id
                me.cargo.estado = estado
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    text: 'Estas seguro de eliminar el cargo',
                    accept: this.eliminarCargo,
                    cancel: this.cancelar
                })
            },
            cancelar() {
                let me = this;
                me.popupAddCargo = true
            },
            eliminarCargo() {
                let me = this;
                let formData = new FormData();
                formData.append('id', me.cargo.id)
                formData.append('estado', me.cargo.estado)
                formData.append('eliminar', "yes")
                formData.append('usuario_id', me.tmp_user.idusuario)
                me.$vs.loading()
                this.$http.post(this.$server_url + 'cargo', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        if(res.data.status == 0){
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            return;
                        }
                        me.getCargos();
                        me.popupAddCargo = true
                        me.editCargo = false
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            },
            guardarCargo() {
                let me = this;
                if (me.cargo.cargo == "") {
                    me.$vs.notify({
                        text: 'Debe agregar un cargo para guardar',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false
                }
                let formData = new FormData();
                if (me.update == true) {
                    formData.append('id', me.cargo.id)
                }
                formData.append('cargo', me.cargo.cargo)
                formData.append('usuario_id', me.tmp_user.idusuario)
                me.$vs.loading()
                this.$http.post(this.$server_url + 'cargo', formData)
                    .then(res => {
                        me.getCargos();
                        me.editCargo = false
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
                    .catch(function (error) {
                        me.$vs.loading.close()
                    })
            },
            guardar() {
                let me = this;
                if (me.usuario.cedula == '') {
                    me.$vs.notify({
                        text: 'Falta la cedula',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if (me.usuario.nombres == '' || me.usuario.apellidos == '') {
                    me.$vs.notify({
                        text: 'Falta los nombres',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if (me.usuario.name_usuario == '' && me.userRoot == true) {
                    me.$vs.notify({
                        text: 'Falta usuario',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if (me.usuario.email == '') {
                    me.$vs.notify({
                        text: 'Falta email',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if (me.usuario.id_group == '') {
                    me.$vs.notify({
                        text: 'Falta perfil',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if (me.usuario.estado == '') {
                    me.$vs.notify({
                        text: 'Falta estado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if (me.usuario.institucion_idInstitucion == '') {
                    me.$vs.notify({
                        text: 'Falta institucion',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
                if(me.usuario.id_group == me.cargoIdTemporal){
                  //validar que debe ser obligatorio seleccionar cargo
                  if(me.usuario.cargo_id == '' || me.usuario.cargo_id == null || me.usuario.cargo_id == undefined){
                    me.$vs.notify({
                        text: 'Falta seleccionar un cargo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                  }
                }
                if (!me.validarCertificadoP12AntesGuardar()) {
                    return;
                }
                let data = new FormData();
                data.append('cedula', me.usuario.cedula);
                data.append('nombre', me.usuario.nombres);
                data.append('apellido', me.usuario.apellidos);
                if (me.userRoot) {
                    data.append('name_usuario', me.usuario.name_usuario);
                } else {
                    data.append('name_usuario', me.usuario.email);
                }
                data.append('telefono', me.usuario.telefono);
                data.append('grupo', me.usuario.id_group == me.cargoIdTemporal ? 6 : me.usuario.id_group);
                data.append('p_ingreso', me.usuario.p_ingreso);
                data.append('idInstitucion', me.usuario.institucion_idInstitucion.idInstitucion);
                data.append('idcreadorusuario', me.usuario.idcreadorusuario);
                data.append('modificado_por', me.usuario.idcreadorusuario);
                data.append('estado', me.usuario.estado_idEstado);
                data.append('capacitador', (me.capacitador == 1 || me.capacitador === true) ? '1' : '0');
                data.append('cli_ins_codigo', me.usuario.cli_ins_codigo)
                data.append('fecha_nacimiento', this.usuario.fecha_nacimiento || '');
                data.append('es_usuario_prolipa', (me.usuario.es_usuario_prolipa == 1 || me.usuario.es_usuario_prolipa === true) ? '1' : '0');
                data.append('jefe_departamento', (me.usuario.es_usuario_prolipa == 1 || me.usuario.es_usuario_prolipa === true) && (me.usuario.jefe_departamento == 1 || me.usuario.jefe_departamento === true) ? '1' : '0');
                var validarEmail = 0
                if (me.chkValidarEmail) {
                    validarEmail = 1
                    data.append('email', me.usuario.email);
                } else {
                    data.append('email', me.usuario.email + "s");
                }
                data.append('validarEmail', validarEmail)
                if (me.usuario.cargo_id == "" || me.usuario.cargo_id == null || me.usuario.cargo_id == undefined) {
                    data.append('cargo_id', "");
                } else {
                    data.append('cargo_id', me.usuario.cargo_id.id);
                }

                if (me.usuario.iniciales == "" || me.usuario.iniciales == null || me.usuario.iniciales == undefined) {
                    data.append('iniciales', "");
                } else {
                    data.append('iniciales', me.usuario.iniciales);
                }

                // Guardar datos de facturadores como JSON si aplica
                if ((me.usuario.id_group == 22 || me.usuario.id_group == 23) && me.facturadoresAsignados.length > 0) {
                    const datosFacturadores = me.facturadoresAsignados.map(item => ({
                        empresa_id: item.empresa_id,
                        empresa_nombre: item.empresa_nombre,
                        facturador_id: item.facturador_id,
                        facturador_nombre: item.facturador_nombre
                    }));
                    data.append('id_facturador_perseo', JSON.stringify(datosFacturadores));
                }

                me.$vs.loading();
                me.$http.post(me.$server_url + 'add_user_ad', data)
                    .then(function (response) {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: 'Usuario guardado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })

                        // Si hay firma o certificado, guardarlos en el servidor files
                        if (response.data.idusuario) {
                            if (me.fileFirma) {
                                me.guardarFirmaEnFiles(response.data.idusuario, () => {
                                    me.procesarCertificadoP12PostGuardado(response.data.idusuario);
                                });
                            } else {
                                me.procesarCertificadoP12PostGuardado(response.data.idusuario);
                            }
                        } else {
                            me.regresar();
                        }
                    })
                    .catch(function (error) {
                        if (error.response && error.response.status === 500 && error.response.data.message.includes('Duplicate entry')) {
                            // Capturamos el mensaje de error específico de duplicación
                            let errorMessage = 'Ya existe un registro con esas iniciales.';

                            // Notificamos al usuario del error
                            me.$vs.notify({
                                text: errorMessage,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                            me.$vs.loading.close();
                        } else if (error.response.status == 422) {
                            try {
                                me.errors = error.response.data.errors
                                me.$vs.loading.close()
                            } catch (error) {
                                me.$vs.loading.close()
                            }
                        }
                    })
            },
            getCargos() {
                let me = this;
                this.$http.get(this.$server_url + 'traerCargos')
                    .then(function (response) {
                        let datos = response.data
                        let obtener = datos.filter(p => p.estado > 0)
                        if (me.tmp_user.id_group == 11) {
                            me.cargos = obtener;
                        } else {
                            me.cargos = response.data;
                        }

                    })
                    .catch(function (error) {})
            },
            getPerfiles() {
              let me = this;
              this.$http.get(this.$server_url + 'obtenerPerfiles?id_group=' + me.tmp_user.id_group)
                .then(function (response) {
                    me.grupo = response.data;
                    let grupoNuevo = {
                      id:me.cargoIdTemporal,
                      level:'Autoridad',
                      deskripsi:'Autoridad',
                    }
                    me.grupo.push(grupoNuevo);
                })
                  .catch(function (error) {})
            },
            listaCiudades() {
                let me = this
                this.$http.get(this.$server_url + `ciudad`).then(res => {
                        me.arregloCiudad = res.data;
                    })
                    .catch(function (error) {})
            },
            listaProvincias() {
                let me = this
                this.$http.get(this.$server_url + `Provincias_Para_Usuarios`).then(res => {
                        me.arregloProvincias = res.data;
                    })
                    .catch(function (error) {})
            },
            getInstitucion() {
                let me = this;
                this.$http.get(this.$server_url + 'institucion')
                    .then(function (response) {
                        me.instituciones = response.data;
                    })
                    .catch(function (error) {})
            },
            filtrarInstituciones() {
                let me = this;
                if (me.provinciaSelect == null) return

                // Limpiar instituciones y selección previa
                me.arregloTraeInstitucion = []
                me.usuario.institucion_idInstitucion = ''

                // Activar loading específico
                me.cargandoInstituciones = true

                const formData = new FormData();
                formData.append('idprovincia', me.provinciaSelect.idprovincia);

                this.$http.post(this.$server_url + 'traerInstitucionXprovincia', formData)
                    .then(res => {
                        me.arregloTraeInstitucion = res.data;
                        me.cargandoInstituciones = false

                        // Mostrar mensaje si no hay instituciones
                        if (!res.data || res.data.length === 0) {
                            me.$vs.notify({
                                text: 'No hay instituciones disponibles en esta Provincia',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        me.cargandoInstituciones = false
                        me.$vs.notify({
                            text: 'Error al cargar las instituciones',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })

            },
            // Método para guardar firma en el servidor files
            guardarFirmaEnFiles(idusuario, onSuccess) {
                let me = this;
                let formDataFirma = new FormData();
                formDataFirma.append('idusuario', idusuario);
                formDataFirma.append('campo', 'firma');
                formDataFirma.append('archivo', me.fileFirma);

                me.$vs.loading({
                    color: '#046AE7'
                });

                axios.post(me.$data_url + 'api/actualizarArchivosUsuario', formDataFirma)
                    .then(function (response) {
                        me.$vs.loading.close();
                        if (response.data.status === 1) {
                            me.$vs.notify({
                                text: 'Firma guardada correctamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        } else {
                            me.$vs.notify({
                                text: response.data.message || 'Error al guardar la firma',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                        }

                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        } else {
                            me.regresar();
                        }
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                        let errorMsg = 'Error al guardar la firma';

                        if (error.response && error.response.data && error.response.data.message) {
                            errorMsg = error.response.data.message;
                        }

                        me.$vs.notify({
                            text: errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        console.error('Error al guardar firma:', error);

                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        } else {
                            me.regresar();
                        }
                    });
            },
            procesarCertificadoP12PostGuardado(idusuario) {
                let me = this;

                if (!me.fileCertificadoP12) {
                    me.regresar();
                    return;
                }

                if (!me.validarCertificadoP12AntesGuardar()) {
                    me.regresar();
                    return;
                }

                me.guardarCertificadoEnFiles(idusuario);
            },
            validarCertificadoP12AntesGuardar() {
                let me = this;

                if (!me.fileCertificadoP12) {
                    return true;
                }

                if (me.muyPesadoCertificado) {
                    me.$vs.notify({
                        text: me.msjCertificado || 'El certificado excede el tamaño permitido',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return false;
                }

                if (!(me.passwordP12 || '').trim()) {
                    me.msjCertificado = 'Debe ingresar la contraseña del certificado .p12 o .pfx';
                    me.$vs.notify({
                        text: 'Ingrese la contraseña del certificado antes de guardar',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return false;
                }

                me.msjCertificado = '';
                return true;
            },
            guardarCertificadoEnFiles(idusuario) {
                let me = this;
                let formDataCertificado = new FormData();
                formDataCertificado.append('idusuario', idusuario);
                formDataCertificado.append('campo', 'certificado_p12');
                formDataCertificado.append('password_p12', me.passwordP12);
                formDataCertificado.append('archivo', me.fileCertificadoP12);

                me.$vs.loading({
                    color: '#046AE7'
                });

                axios.post(me.$data_url + 'api/actualizarArchivosUsuario', formDataCertificado)
                    .then(function (response) {
                        me.$vs.loading.close();
                        if (response.data.status === 1) {
                            me.$vs.notify({
                                text: 'Certificado electrónico guardado correctamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        } else {
                            me.$vs.notify({
                                text: response.data.message || 'Error al guardar el certificado',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        }
                        me.regresar();
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                        let errorMsg = 'Error al guardar el certificado electrónico';

                        if (error.response && error.response.data && error.response.data.message) {
                            errorMsg = error.response.data.message;
                        }

                        me.$vs.notify({
                            text: errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        console.error('Error al guardar certificado:', error);
                        me.regresar();
                    });
            },
            obtenerCertificadoP12(e) {
                let me = this;
                me.fileCertificadoP12 = e.target.files[0];

                if (!me.fileCertificadoP12) {
                    me.selectedCertificadoName = '';
                    me.pesoArchivoCertificado = '';
                    return;
                }

                me.selectedCertificadoName = me.fileCertificadoP12.name;
                me.muyPesadoCertificado = false;
                me.msjCertificado = '';
                me.pesoArchivoCertificado = (me.fileCertificadoP12.size / (1024 * 1024)).toFixed(2);

                const extension = me.fileCertificadoP12.name.split('.').pop().toLowerCase();
                if (!['p12', 'pfx'].includes(extension)) {
                    me.msjCertificado = 'El archivo debe ser un certificado .p12 o .pfx';
                    me.fileCertificadoP12 = null;
                    me.selectedCertificadoName = '';
                    me.pesoArchivoCertificado = '';
                    document.getElementById('certificadoP12File').value = '';
                    return;
                }

                if (parseFloat(me.pesoArchivoCertificado) > me.limiteMegasCertificado) {
                    me.muyPesadoCertificado = true;
                    me.msjCertificado = `El archivo pesa ${me.pesoArchivoCertificado} MB y excede el límite de ${me.limiteMegasCertificado} MB permitido`;
                }
            },
            cancelarSeleccionCertificado() {
                let me = this;
                me.fileCertificadoP12 = null;
                me.selectedCertificadoName = '';
                me.msjCertificado = '';
                me.muyPesadoCertificado = false;
                me.pesoArchivoCertificado = '';
                document.getElementById('certificadoP12File').value = '';
            },
            // Método para obtener la imagen de la firma
            obtenerImagenFirma(e) {
                let me = this;
                me.fileFirma = e.target.files[0];

                if (!me.fileFirma) {
                    me.previewFirma = null;
                    me.selectedFirmaName = '';
                    return;
                }

                // Guardar el nombre del archivo
                me.selectedFirmaName = me.fileFirma.name;

                // Crear preview de la imagen
                const reader = new FileReader();
                reader.onload = function (event) {
                    me.previewFirma = event.target.result;
                };
                reader.readAsDataURL(me.fileFirma);

                // Validar tamaño
                me.muyPesadoFirma = false;
                me.msjFirma = '';
                me.pesoArchivoFirma = (me.fileFirma.size / (1024 * 1024)).toFixed(2); // Convertir a MB

                if (me.pesoArchivoFirma > me.limiteMegasFirma) {
                    me.muyPesadoFirma = true;
                    me.msjFirma = `El archivo pesa ${me.pesoArchivoFirma} MB y excede el límite de ${me.limiteMegasFirma} MB permitido`;
                    me.previewFirma = null; // No mostrar preview si es muy pesado
                }
            },
            // Método para cancelar la selección de firma
            cancelarSeleccionFirma() {
                let me = this;
                me.fileFirma = null;
                me.previewFirma = null;
                me.selectedFirmaName = '';
                me.msjFirma = '';
                me.muyPesadoFirma = false;
                me.pesoArchivoFirma = '';
                // Limpiar el input file
                document.getElementById('firmaFile').value = '';
            },
            traerEmpresas() {
                let me = this;
                me.cargandoEmpresas = true;
                this.$http.get(this.$server_url + 'empresa')
                    .then(response => {
                        const lista = response.data.filter(empresa => empresa.id != 2) || [];
                        me.empresasBase = lista;
                        me.actualizarEmpresasDisponibles();
                        me.cargandoEmpresas = false;
                    })
                    .catch(error => {
                        me.cargandoEmpresas = false;
                        me.$vs.notify({
                            text: 'Error al cargar empresas',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    });
            },
            actualizarEmpresasDisponibles() {
                let me = this;
                const idsAsignados = me.facturadoresAsignados.map(item => item.empresa_id);
                me.empresas = me.empresasBase.filter(empresa => !idsAsignados.includes(empresa.id));
                if (me.empresaSeleccionada && idsAsignados.includes(me.empresaSeleccionada.id)) {
                    me.empresaSeleccionada = null;
                    me.facturadores = [];
                    me.facturadorSeleccionado = null;
                }
            },
            traerFacturadores(empresa) {
                let me = this;
                me.cargandoFacturadores = true;
                me.facturadores = [];
                me.facturadorSeleccionado = null;

                const formData = new FormData();
                formData.append('empresa_id', empresa.id);

                this.$http.post(this.$server_url + 'api/perseo/consultas/facturadores_consulta', formData)
                    .then(response => {
                        const lista = (response.data && response.data.facturadores) ? response.data.facturadores : [];
                        me.facturadores = lista.filter(item => {
                            const v = item.facturador;
                            return v === true || v === 1 || v === '1' || v === 'true';
                        });
                        me.cargandoFacturadores = false;
                    })
                    .catch(error => {
                        me.cargandoFacturadores = false;
                        me.$vs.notify({
                            text: 'Error al cargar facturadores',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    });
            },
            agregarFacturador() {
                let me = this;
                if (!me.empresaSeleccionada || !me.facturadorSeleccionado) {
                    me.$vs.notify({
                        text: 'Debe seleccionar empresa y facturador',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                }

                const facturadorObj = {
                    empresa_id: me.empresaSeleccionada.id,
                    empresa_nombre: me.empresaSeleccionada.nombre,
                    facturador_id: me.facturadorSeleccionado.facturadoresid,
                    facturador_nombre: me.facturadorSeleccionado.nombres,
                    facturador_completo: me.facturadorSeleccionado
                };

                me.facturadoresAsignados.push(facturadorObj);
                me.actualizarEmpresasDisponibles();

                me.empresaSeleccionada = null;
                me.facturadorSeleccionado = null;
                me.facturadores = [];

                me.$vs.notify({
                    text: 'Facturador agregado correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            },
            eliminarFacturador(index) {
                let me = this;
                me.facturadoresAsignados.splice(index, 1);
                me.actualizarEmpresasDisponibles();
                me.$vs.notify({
                    text: 'Facturador eliminado',
                    color: 'info',
                    iconPack: 'feather',
                    icon: 'icon-trash'
                });
            },
            regresar() {
                this.$emit('escuchar', this.op_agregar);
            },
        },
    }
    </script>

    <style scoped>
    .uploading-image {
        display: flex;
    }

    /* Animación de spinner */
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
        display: inline-block;
    }

    /* Mejoras responsive */
    @media (max-width: 768px) {
        .flex-wrap {
            flex-wrap: wrap;
        }

        .gap-2 > * {
            margin-bottom: 0.5rem;
        }
    }

    /* Estilos para los títulos de sección */
    h5.text-primary {
        border-bottom: 2px solid rgba(var(--vs-primary), 0.2);
        padding-bottom: 0.5rem;
    }

    /* Mejorar apariencia de los labels */
    .vs-input--label {
        color: #626262;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }

    /* Espaciado consistente */
    .vx-row {
        margin-left: -0.5rem;
        margin-right: -0.5rem;
    }

    .vx-col {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    /* Mejorar botones en móvil */
    @media (max-width: 640px) {
        .w-full.sm\:w-auto {
            width: 100% !important;
            margin-top: 0.5rem;
        }
    }

    /* Iconos en títulos */
    h5 i {
        font-size: 1.2rem;
    }

    /* Bloque nombres/apellidos con capitalización */
    .nombres-apellidos-block {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .nombres-apellidos-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        background: #f1f5f9;
        border-bottom: 1px solid #e2e8f0;
        padding: 10px 16px;
    }

    .nombres-apellidos-header-left {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #475569;
    }

    .nombres-apellidos-header-left i {
        font-size: 15px;
    }

    .nombres-apellidos-header-right {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .cap-label {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 20px;
        transition: all 0.3s ease;
    }

    .cap-label--on {
        background: #dcfce7;
        color: #16a34a;
        border: 1px solid #bbf7d0;
    }

    .cap-label--off {
        background: #f1f5f9;
        color: #94a3b8;
        border: 1px solid #e2e8f0;
    }

    .nombres-apellidos-inputs {
        padding: 16px 8px 0;
    }

    /* Mensaje de validación */
    .bg-success {
        background: linear-gradient(118deg, rgba(var(--vs-success), 1), rgba(var(--vs-success), 0.7));
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(var(--vs-success), 0.4);
    }

    /* Mensaje de advertencia */
    .text-warning {
        color: #ff9f43;
    }

    /* Estilos para la sección de firma */
    .firma-section {
        background: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        padding: 24px;
        transition: all 0.3s ease;
    }

    .firma-section:hover {
        border-color: #3b82f6;
        background: #eff6ff;
    }

    .firma-subtitle {
        font-size: 13px;
        color: #64748b;
        line-height: 1.6;
        padding: 12px;
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        border-radius: 6px;
        margin: 0 0 20px 0;
    }

    .firma-link {
        color: #2563eb;
        text-decoration: underline;
        font-weight: 600;
    }

    .firma-link:hover {
        color: #1d4ed8;
    }

    .firma-preview-section {
        margin: 20px 0;
        display: flex;
        justify-content: center;
    }

    .firma-preview-container {
        text-align: center;
    }

    .firma-preview-image {
        position: relative;
        display: inline-block;
        background: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 12px;
        max-width: 300px;
    }

    .firma-img {
        max-width: 100%;
        max-height: 150px;
        object-fit: contain;
    }

    .firma-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .firma-badge-new {
        background: #22c55e;
        color: white;
    }

    .firma-info {
        font-size: 12px;
        color: #64748b;
        margin-top: 8px;
    }

    .firma-no-image {
        text-align: center;
        padding: 40px 20px;
    }

    .firma-no-image-icon {
        font-size: 48px;
        color: #cbd5e1;
        margin-bottom: 12px;
    }

    .firma-no-image-text {
        font-size: 14px;
        color: #94a3b8;
        margin: 0;
    }

    .firma-input-section {
        text-align: center;
        margin: 20px 0;
    }

    .firma-btn-upload {
        display: inline-flex;
        align-items: center;
        padding: 12px 24px;
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .firma-btn-upload:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .firma-input-hidden {
        display: none;
    }

    .firma-info-box {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
    }

    .firma-info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #475569;
        margin-bottom: 8px;
    }

    .firma-info-item:last-child {
        margin-bottom: 0;
    }

    .firma-info-item i {
        color: #3b82f6;
        font-size: 16px;
    }

    .firma-error {
        margin-top: 12px;
        padding: 12px;
        background: #fee2e2;
        border: 1px solid #fecaca;
        border-radius: 6px;
        color: #dc2626;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    /* Responsive firma */
    @media (max-width: 768px) {
        .firma-section {
            padding: 16px;
        }

        .firma-preview-image {
            max-width: 100%;
        }

        .firma-img {
            max-height: 120px;
        }
    }

    /* Estilos para firma electrónica */
    .certificado-section:hover {
        border-color: #059669;
        background: #ecfdf5;
    }

    .certificado-subtitle {
        background: #d1fae5;
        border-left-color: #10b981;
    }

    .certificado-preview-card {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        height: 120px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: 12px;
    }

    .certificado-preview-icon {
        font-size: 48px;
        color: #059669;
    }

    .certificado-preview-new {
        border: 2px dashed #34d399;
    }

    .certificado-no-icon {
        font-size: 48px;
        color: #94a3b8;
        margin-bottom: 12px;
    }

    .certificado-btn-upload {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    }

    .certificado-btn-upload:hover {
        background: linear-gradient(135deg, #047857 0%, #059669 100%);
    }

    .certificado-password-section {
        margin: 16px 0;
    }

    .certificado-password-label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        margin-bottom: 8px;
    }

    .certificado-password-wrap {
        position: relative;
    }

    .certificado-password-input {
        width: 100%;
        padding: 10px 44px 10px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        color: #1e293b;
        background: #fff;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .certificado-password-input:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    }

    .certificado-password-input--required {
        border-color: #ea5455;
    }

    .certificado-password-toggle {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        background: transparent;
        color: #64748b;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
    }

    .certificado-password-toggle:hover {
        color: #059669;
    }

    .certificado-password-hint {
        font-size: 12px;
        color: #64748b;
        margin-top: 8px;
        line-height: 1.5;
    }

    .certificado-info-box {
        background: #ecfdf5;
        border-color: #a7f3d0;
    }
    </style>
