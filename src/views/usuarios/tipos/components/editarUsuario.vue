<template>
<div>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="5" style="margin:10px;">
            <vs-card>
                <div class="vx-col sm:w-full md:w-1/2">
                    <vs-avatar class="text-center" size="100px" :src="$data_url+'archivos/'+'perfil/'+userSeleccionado.foto_user" />
                </div>
            </vs-card>
        </vs-col>
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="5" style="margin:10px;">
            <vs-card>
                <div class="vx-col w-full mt-5">
                    <vs-button ref="loadableButton" id="button-with-loading" class="vs-con-loading__container" @click="generarPassword()" type="relief">
                        Resetear contraseña
                    </vs-button>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <div class="vx-row mb-4">
        <!-- Bloque nombres/apellidos con control de capitalización integrado -->
        <div class="vx-col w-full">
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
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="userSeleccionado.nombres" @input="onInputNombres" />
                    </div>
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="userSeleccionado.apellidos" @input="onInputApellidos" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="userSeleccionado.cedula" @keypress="validateInput" @paste="validatePaste"/>
        </div>
        <div class="vx-col w-full sm:w-1/2" v-if="userRoot">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Usuario" v-model="userSeleccionado.name_usuario" />
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="userSeleccionado.email" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="userSeleccionado.telefono" />
        </div>
    </div>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-card>
                <div class="vx-col w-full mt-5">
                    Perfil
                    <v-select :options="grupo" :reduce="grupo => grupo.id" label="deskripsi" v-model="userSeleccionado.id_group"></v-select>
                </div>
                <div class="vx-col w-full mt-5">
                    <v-select :options="estado" :reduce="estado => estado.id" label="label" v-model="userSeleccionado.estado_idEstado"></v-select>
                </div>
                <div class="vx-col w-full mt-5">
                    <v-select :disabled="desabilitar_boton" :options="instituciones" :reduce="instituciones => instituciones.id" label="nombreinscompleto" v-model="userSeleccionado.institucion_idInstitucion"></v-select>
                </div>
                <div  v-if="userSeleccionado.id_group == 11 && userRoot" style="background-color: #DAE9FB; color: #1D79E9; font-size: 15px; padding: 7px; border-radius: 15px;">
                    <p v-if="userRoot">* El campo de <b>iniciales</b> se usa para registrar movimientos no operativos, actas, órdenes de producción, compras, proformas, facturas, notas y para realizar los pedidos.</p>
                    <p v-if="userSeleccionado.id_group == 11 && userRoot">* El campo de <b>cli_ins_codigo</b> es el id de la tabla cliente_institucion de facturación donde se relaciona con la institución llamada prolipa Plataforma y el asesor </p>
                </div>
                <br>
                <div class="vx-row mb-6" v-if="userRoot">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>Iniciales</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-check" icon-no-border v-model="userSeleccionado.iniciales" />
                    </div>
                </div>


                <div class="vx-row mb-4">
                    <div  class="vx-col sm:w-1/3 w-full">
                      <div class="flex">
                        <span class="mr-2">Cargo</span>
                        <!-- <vs-button color="success" icon="add" @click="popupAddCargo = true" class="ml-5 p-2" type="relief">Añadir cargo</vs-button> -->
                      </div>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <v-select :options="cargos" :reduce="cargos => cargos.id" label="cargo" class="w-full" v-model="userSeleccionado.cargo_id" />
                    </div>
                </div>
                <div class="vx-row mb-6" v-if="userSeleccionado.id_group == 11 && userRoot">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>Cliente ins_codigo</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-check" icon-no-border label="Cliente Facturación id" v-model="userSeleccionado.cli_ins_codigo" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                  <div class="vx-col sm:w-1/3 w-full">
                      <span>Fecha Nacimiento</span>
                  </div>
                  <div class="vx-col sm:w-2/3 w-full">
                        <flat-pickr :config="configdateTimePicker" v-model="userSeleccionado.fecha_nacimiento" placeholder="Fecha Nacimiento" class="m-1" style="display: inline-block;width: 100%" />
                  </div>
                </div>

                <!-- BLOQUE: Capacitador -->
                <div class="vx-row mb-6" v-if="userRoot">
                    <div class="vx-col sm:w-1/3 w-full flex items-center">
                        <span>¿Es Capacitador?</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full flex items-center">
                        <vs-switch
                            color="success"
                            v-model="userSeleccionado.capacitador"
                            :true-value="1"
                            :false-value="0"
                        >
                            <span slot="on">Si</span>
                            <span slot="off">No</span>
                        </vs-switch>
                        <span class="ml-3 text-sm text-gray-600">Activar si es capacitador</span>
                    </div>
                </div>

                <!-- BLOQUE: Configuración Prolipa -->
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full flex items-center">
                        <span>¿Es Usuario Prolipa?</span>
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
                    </div>
                    <div class="vx-col sm:w-2/3 w-full flex items-center">
                        <vs-switch
                            color="success"
                            v-model="userSeleccionado.es_usuario_prolipa"
                            :true-value="1"
                            :false-value="0"
                            @input="userSeleccionado.es_usuario_prolipa == 0 ? userSeleccionado.jefe_departamento = 0 : null"
                        >
                            <span slot="on">Si</span>
                            <span slot="off">No</span>
                        </vs-switch>
                        <span class="ml-3 text-sm text-gray-600">Activar si el usuario pertenece a Prolipa</span>
                    </div>
                </div>

                <div class="vx-row mb-6" v-if="userSeleccionado.es_usuario_prolipa == 1">
                    <div class="vx-col sm:w-1/3 w-full flex items-center flex items-center">
                        <span>Jefe de Departamento</span>
                        <div v-if="userRoot" class="flex items-center gap-1 ml-2">
                          <vx-tooltip
                              text="Al activar esta opción, el usuario tendrá acceso al módulo adicional de Memorando dentro de Talento Humano."
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
                    </div>
                    <div class="vx-col sm:w-2/3 w-full flex items-center">
                        <vs-switch
                            color="warning"
                            v-model="userSeleccionado.jefe_departamento"
                            :true-value="1"
                            :false-value="0"
                        >
                            <span slot="on">Si</span>
                            <span slot="off">No</span>
                        </vs-switch>
                        <span class="ml-3 text-sm text-gray-600">Activar si es Jefe de Departamento</span>
                    </div>
                </div>

                <!-- Sección de Facturadores (para grupos 22 y 23) -->
                <div class="vx-row mb-6" v-if="userSeleccionado.id_group == 22 || userSeleccionado.id_group == 23">
                    <div class="vx-col w-full">
                        <h6 class="text-primary font-semibold mb-4">
                            <i class="feather icon-plus-circle mr-2"></i>
                            Agregar/Modificar Facturadores Perseo
                        </h6>
                    </div>
                </div>

                <div class="vx-row mb-6" v-if="userSeleccionado.id_group == 22 || userSeleccionado.id_group == 23">
                    <div class="vx-col w-full sm:w-1/3 mb-4">
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

                    <div class="vx-col w-full sm:w-1/3 mb-4">
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

                    <div class="vx-col w-full sm:w-1/3 mb-4">
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

                <div class="vx-row mb-6" v-if="userSeleccionado.id_group == 22 || userSeleccionado.id_group == 23">
                    <div class="vx-col w-full mb-4">
                        <label class="vs-input--label font-semibold mb-3 block">Facturadores Asignados</label>
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

                <!-- Sección de Firma Digital -->
                <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                        <div class="firma-section">
                            <div class="firma-header">
                                <h4 class="firma-title">
                                    <i class="feather icon-edit mr-2"></i>Firma Digital
                                </h4>
                                <p class="firma-subtitle">
                                    <i class="feather icon-info mr-1"></i>
                                    <strong>Importante:</strong> Sube una imagen en formato PNG sin fondo.
                                    Si tu imagen tiene fondo, puedes quitarlo en
                                    <a href="https://www.remove.bg/es" target="_blank" class="firma-link">https://www.remove.bg/es</a>
                                </p>
                            </div>

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

                                <!-- Firma actual -->
                                <div v-else-if="userSeleccionado.firma && !firmaErrorCarga" class="firma-preview-container">
                                    <div class="firma-preview-image">
                                        <img
                                            :src="$data_url + 'archivos/usuarios/firmas/' + userSeleccionado.firma + '?t=' + firmaCacheBuster"
                                            alt="Firma actual"
                                            class="firma-img"
                                            @error="manejarErrorCargaFirma"
                                            @load="firmaErrorCarga = false"
                                        />
                                        <div class="firma-badge firma-badge-current">
                                            <i class="feather icon-check-circle"></i> Actual
                                        </div>
                                    </div>
                                    <p class="firma-info">Firma actual del usuario</p>
                                </div>

                                <!-- Error al cargar firma -->
                                <div v-else-if="userSeleccionado.firma && firmaErrorCarga" class="firma-no-image">
                                    <i class="feather icon-alert-triangle firma-no-image-icon" style="color: #f59e0b;"></i>
                                    <p class="firma-no-image-text" style="color: #f59e0b;">
                                        Error al cargar la firma: {{ userSeleccionado.firma }}
                                    </p>
                                    <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
                                        La imagen no existe o no se puede acceder. Sube una nueva firma.
                                    </p>
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
                </div>

                <!-- Sección de Firma Electrónica -->
                <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                        <div class="firma-section certificado-section">
                            <div class="firma-header">
                                <h4 class="firma-title">
                                    <i class="feather icon-shield mr-2"></i>Firma Electrónica
                                </h4>
                                <p class="firma-subtitle certificado-subtitle">
                                    <i class="feather icon-info mr-1"></i>
                                    <strong>Importante:</strong> Sube tu certificado digital emitido en Ecuador
                                    (Security Data, BCE, ANF, etc.) en formato <strong>.p12</strong> o <strong>.pfx</strong>
                                    e ingresa la contraseña del certificado.
                                </p>
                            </div>

                            <!-- Estado del certificado -->
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

                                <div v-else-if="userSeleccionado.certificado_p12" class="firma-preview-container">
                                    <div class="certificado-preview-card certificado-preview-current">
                                        <i class="feather icon-check-circle certificado-preview-icon"></i>
                                    </div>
                                    <p class="certificado-status-text">
                                        <i class="feather icon-check mr-1"></i>Firma subida
                                    </p>
                                    <p class="certificado-info-text">Certificado registrado para firma electrónica</p>
                                    <vs-button
                                        @click="confirmarEliminarCertificadoP12"
                                        size="small"
                                        type="border"
                                        color="danger"
                                        class="mt-3"
                                        :disabled="eliminandoCertificadoP12"
                                    >
                                        <i class="feather icon-trash-2 mr-1"></i>
                                        {{ eliminandoCertificadoP12 ? 'Eliminando...' : 'Quitar firma electrónica' }}
                                    </vs-button>
                                </div>

                                <div v-else class="firma-no-image">
                                    <i class="feather icon-shield certificado-no-icon"></i>
                                    <p class="firma-no-image-text">Sin firma electrónica asignada</p>
                                </div>
                            </div>

                            <!-- Input de certificado -->
                            <div class="firma-input-section">
                                <label for="certificadoP12File" class="firma-btn-upload certificado-btn-upload">
                                    <i class="feather icon-upload mr-2"></i>
                                    <span>{{ userSeleccionado.certificado_p12 ? 'Subir otra firma' : 'Subir firma electrónica' }}</span>
                                </label>
                                <input
                                    type="file"
                                    id="certificadoP12File"
                                    class="firma-input-hidden"
                                    @change="obtenerCertificadoP12"
                                    accept=".p12,.pfx,application/x-pkcs12"
                                />
                            </div>

                            <!-- Contraseña del certificado -->
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
                                    Obligatoria al subir un certificado nuevo. También puede usarse para actualizar
                                    la contraseña del certificado ya registrado.
                                </p>
                            </div>

                            <!-- Información -->
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
                </div>

            </vs-card>
        </vs-col>
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="10" style="margin:10px;" v-if="validacionVentas">
            <vs-card>
                <!-- Alerta visual dentro de la tarjeta -->
                <vs-alert color="danger" icon="warning">
                    <strong>¡Atención!</strong> Este usuario ya cuenta con ventas al RUC/CI: {{ rucOriginal }}.
                </vs-alert>
                <div class="vx-col w-full mt-5">
                    <vs-table :data="datosUsuarioVentas" style="width: 100%;" color="danger">
                        <template slot="thead">
                            <vs-th>Documento</vs-th>
                            <vs-th>Empresa</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr v-for="item in data" :key="item.ven_codigo">
                                <vs-td>{{ item.ven_codigo }}</vs-td>
                                <vs-td>{{ item.id_empresa == 1 || item.id_empresa == 6 ? 'Prolipa' : 'Calmed' }}</vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vs-card>
        </vs-col>
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-w="10" style="margin:10px;">
            <vs-card>
                <div class="vx-col w-full mt-5">
                    <vs-button
                        color="success"
                        @click="verificarUsuarioGuardado"
                        style="width:100%;"
                        type="filled"
                        :disabled="!!fileCertificadoP12 && (!(passwordP12 || '').trim() || muyPesadoCertificado)"
                    >Guardar</vs-button>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!--Modal añadir cargos-->
    <vs-popup background-color="rgba(255,255,255,.6)" title="Añadir cargos" :active.sync="popupAddCargo" class="informacionformhijo">
        <vs-table max-items="5" search pagination :data="cargos" v-if="editCargo == true">
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

                                <vx-tooltip v-if="tr.estado == 0 && usuario.id_group == 1" style="display: inline-block;" text="Activar cargo" position="top" color="primary">
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
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
import axios from 'axios'
import Generalmix from '../../../../mixins/Generalmix';
export default {
    mixins: [Generalmix],
    data() {
        return {
            usuario: [],
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
            cargos: [],
            grupo: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            desabilitar_boton: false,
            userRoot: false,
            // validacion usuario con Ventas
            validacionVentas: false,
            rucOriginal:null,
            datosUsuarioVentas: [],
            //variables para el modal de añadir cargos
            cargoIdTemporal: 660,
            popupAddCargo:false,
            editCargo: false,
            cargos: [],
            cargo: {
                id: '',
                cargo: '',
                estado: '',
            },
            userSeleccionado:'',
            instituciones: [],
            // Variables para firma
            fileFirma: null,
            previewFirma: null,
            selectedFirmaName: '',
            limiteMegasFirma: 3,
            pesoArchivoFirma: '',
            muyPesadoFirma: false,
            msjFirma: '',
            firmaErrorCarga: false,
            firmaCacheBuster: Date.now(),
            // Variables para firma electrónica (certificado .p12)
            fileCertificadoP12: null,
            selectedCertificadoName: '',
            limiteMegasCertificado: 5,
            pesoArchivoCertificado: '',
            muyPesadoCertificado: false,
            msjCertificado: '',
            passwordP12: '',
            showPasswordP12: false,
            eliminandoCertificadoP12: false,
            // Variables para facturadores múltiples
            empresas: [],
            empresasBase: [],
            empresaSeleccionada: null,
            facturadores: [],
            facturadorSeleccionado: null,
            facturadoresAsignados: [],
            cargandoEmpresas: false,
            cargandoFacturadores: false,
            autoCapitalizar: true,
        }
    },
    components: {
        flatPickr,
        vSelect,
    },
    props: {
        usuarios: {
            type: Object,
            default: {},
        },
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.f_instituciones()
        me.getCargos()
        me.getPerfiles()
    },
    mounted() {
        let me = this
        // Verifica si el prop usuarios existe antes de asignarlo
        if (this.usuarios && this.usuarios.cedula) {
            this.rucOriginal = this.usuarios.cedula;
            console.log("RUC Original:", this.rucOriginal);
        } else {
            console.warn("Prop 'usuarios' aún no está disponible en mounted.");
        }
        me.getUserRoot(me.usuario)
    },
    watch: {
        'userSeleccionado.iniciales': function (newVal) {
            // Asegúrate de que el valor en el input sea siempre en mayúsculas y no más de 10 caracteres
            if (newVal.length > 10) {
                this.userSeleccionado.iniciales = newVal.slice(0, 10).toUpperCase();
            } else {
                this.userSeleccionado.iniciales = newVal.toUpperCase();
            }
        },
        'userSeleccionado.id_group': function () {
            this.cargarFacturadoresPorGrupo();
        },
        empresaSeleccionada: function (newVal) {
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
        onInputNombres() {
            if (!this.autoCapitalizar && this.userRoot) return;
            this.$nextTick(() => {
                this.userSeleccionado.nombres = this.capitalizarTexto(this.userSeleccionado.nombres);
            });
        },
        onInputApellidos() {
            if (!this.autoCapitalizar && this.userRoot) return;
            this.$nextTick(() => {
                this.userSeleccionado.apellidos = this.capitalizarTexto(this.userSeleccionado.apellidos);
            });
        },
      f_instituciones(){
        let me = this
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
          me.instituciones = res.data;
          me.f_infoUser()
        })
      },
        validateInput(event) {
            const charCode = event.which ? event.which : event.keyCode;
            if (charCode < 48 || charCode > 57) {
                event.preventDefault();
            }
        },
        validatePaste(event) {
            event.preventDefault();
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');

            // Filtrar solo números
            const numbersOnly = pastedText.replace(/\D/g, '');

            // Obtener el input donde se está pegando
            const input = event.target;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            // Insertar el texto en la posición actual del cursor
            this.userSeleccionado.cedula =
                this.userSeleccionado.cedula.slice(0, start) +
                numbersOnly +
                this.userSeleccionado.cedula.slice(end);

            // Mover el cursor al final del texto insertado
            this.$nextTick(() => {
                input.selectionStart = input.selectionEnd = start + numbersOnly.length;
            });
        },
        verificarUsuarioGuardado(){
            let me = this;
            if(this.rucOriginal == this.userSeleccionado.cedula){
                this.guardar();
            }else{
                this.$http.get(this.$server_url + 'usuarioConVentas/' + this.rucOriginal)
                .then((result) => {
                    if (result.data.SinVentas) {
                        this.guardar();
                    }else{
                        this.$vs.notify({
                            text: 'El usuario tiene ventas registradas no se puede cambiar el ruc: '+this.rucOriginal,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        this.validacionVentas = true;
                        this.datosUsuarioVentas = result.data.ventas;
                        this.userSeleccionado.cedula = this.rucOriginal;
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        },
        f_infoUser(){
          let me =this;
          if(me.usuarios.idusuario == undefined || me.usuarios.idusuario == null){
            me.m_message('No se ha seleccionado ningún usuario', 'danger');
            return;

          }
          me.$vs.loading();
          this.$http.get(this.$server_url + 'userInformacion?idusuario=' + me.usuarios.idusuario)
            .then((result) => {
                me.$vs.loading.close();
                if (result.data.length > 0) {
                    me.userSeleccionado = result.data[0];
                    me.userSeleccionado.es_usuario_prolipa = parseInt(me.userSeleccionado.es_usuario_prolipa || 0);
                    me.userSeleccionado.jefe_departamento = parseInt(me.userSeleccionado.jefe_departamento || 0);
                    me.userSeleccionado.capacitador = parseInt(me.userSeleccionado.capacitador || 0);
                    // Resetear estado de error de firma
                    me.firmaErrorCarga = false;
                    // Actualizar cache buster para cargar imagen fresca
                    me.firmaCacheBuster = Date.now();
                    // Resetear estado de certificado electrónico
                    me.resetCertificadoP12();
                    // Cargar empresas/facturadores según el perfil
                    me.cargarFacturadoresPorGrupo();
                }
            })
            .catch((err) => {
                me.$vs.loading.close();
                me.m_message('Error al obtener información del usuario', 'danger');
                console.log(err)
            })
        },
        cargarFacturadoresPorGrupo() {
            let me = this;
            if (!me.userSeleccionado || !me.userSeleccionado.id_group) {
                return;
            }

            if (me.userSeleccionado.id_group == 22 || me.userSeleccionado.id_group == 23) {
                if (me.userSeleccionado.id_facturador_perseo) {
                    me.traerEmpresasYFacturadores();
                } else {
                    me.facturadoresAsignados = [];
                    me.traerEmpresas();
                }
            } else {
                me.empresas = [];
                me.empresasBase = [];
                me.empresaSeleccionada = null;
                me.facturadores = [];
                me.facturadorSeleccionado = null;
                me.facturadoresAsignados = [];
            }
        },
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getPerfiles() {
          let me = this;
          this.$http.get(this.$server_url + 'obtenerPerfiles?id_group=' + me.usuario.id_group)
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
        getCargos() {
            let me = this;
            this.$http.get(this.$server_url + 'traerCargos')
                .then(function (response) {
                    me.cargos = response.data;
                    if(me.userSeleccionado.cargo_id > 0){
                      me.userSeleccionado.id_group = me.cargoIdTemporal;
                    }
                })
                .catch(function (error) {})
        },
        async guardar() {
            let me = this

            if (!me.validarCertificadoP12AntesGuardar()) {
                return;
            }

            me.btn = false;
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('idusuario', this.userSeleccionado.idusuario);
            formData.append('cedula', this.userSeleccionado.cedula);
            formData.append('nombres', this.userSeleccionado.nombres);
            formData.append('apellidos', this.userSeleccionado.apellidos);
            formData.append('email', this.userSeleccionado.email);
            if (me.userRoot) {
                formData.append('name_usuario', this.userSeleccionado.name_usuario);
            } else {
                formData.append('name_usuario', this.userSeleccionado.email);
            }
            formData.append('estado_idEstado', this.userSeleccionado.estado_idEstado);
            formData.append('institucion_idInstitucion', this.userSeleccionado.institucion_idInstitucion);
            formData.append('id_group', me.userSeleccionado.id_group == me.cargoIdTemporal ? 6 : me.userSeleccionado.id_group);
            formData.append('capacitador', (this.userSeleccionado.capacitador == 1 || this.userSeleccionado.capacitador === true) ? '1' : '0');
            formData.append('cli_ins_codigo', this.userSeleccionado.cli_ins_codigo)
            formData.append('fecha_nacimiento', this.userSeleccionado.fecha_nacimiento || '');
            formData.append('cargo_id', me.userSeleccionado.cargo_id || '');
            formData.append('telefono', me.userSeleccionado.telefono || '');
            formData.append('iniciales', me.userSeleccionado.iniciales || '');
            formData.append('es_usuario_prolipa', (me.userSeleccionado.es_usuario_prolipa == 1) ? '1' : '0');
            formData.append('jefe_departamento', (me.userSeleccionado.es_usuario_prolipa == 1) && (me.userSeleccionado.jefe_departamento == 1) ? '1' : '0');

            // Guardar facturadores como JSON si es grupo 22 o 23
            if (me.userSeleccionado.id_group == 22 || me.userSeleccionado.id_group == 23) {
                const datosFacturadores = me.facturadoresAsignados.map(item => ({
                    empresa_id: item.empresa_id,
                    empresa_nombre: item.empresa_nombre,
                    facturador_id: item.facturador_id,
                    facturador_nombre: item.facturador_nombre
                }));
                formData.append('id_facturador_perseo', JSON.stringify(datosFacturadores));
            }

            this.$http.post(this.$server_url + 'usr', formData)
                .then(function (response) {
                    // console.log(response.data)
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Usuario guardado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })

                    // Si hay firma nueva o certificado, guardarlos en el servidor files
                    if (me.fileFirma) {
                        me.guardarFirmaEnFiles(() => me.procesarCertificadoP12PostGuardado());
                    } else {
                        me.procesarCertificadoP12PostGuardado();
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
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        // Método para guardar firma en el servidor files
        guardarFirmaEnFiles(onSuccess) {
            let me = this;
            let formDataFirma = new FormData();
            formDataFirma.append('idusuario', me.userSeleccionado.idusuario);
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
                        // Actualizar el campo firma con el valor devuelto por el API
                        if (response.data.archivo) {
                            me.userSeleccionado.firma = response.data.archivo;
                        }
                        // Actualizar cache buster para forzar recarga de la imagen
                        me.firmaCacheBuster = Date.now();
                        // Limpiar variables de firma
                        me.fileFirma = null;
                        me.previewFirma = null;
                        me.selectedFirmaName = '';
                        me.msjFirma = '';
                        me.muyPesadoFirma = false;
                        me.pesoArchivoFirma = '';
                        me.firmaErrorCarga = false;

                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        } else {
                            me.$emit('saveChange', true);
                        }
                    } else {
                        me.$vs.notify({
                            text: response.data.message || 'Error al guardar la firma',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
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
                });
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
        debeGuardarCertificadoP12() {
            let me = this;
            if (me.fileCertificadoP12) {
                return true;
            }
            return !!(me.userSeleccionado.certificado_p12 && me.passwordP12.length > 0);
        },
        procesarCertificadoP12PostGuardado() {
            let me = this;

            if (!me.debeGuardarCertificadoP12()) {
                me.$emit('saveChange', true);
                return;
            }

            if (me.fileCertificadoP12) {
                if (!me.validarCertificadoP12AntesGuardar()) {
                    me.$emit('saveChange', true);
                    return;
                }
            } else if (!(me.passwordP12 || '').trim()) {
                me.$vs.notify({
                    text: 'Ingrese la contraseña del certificado .p12',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.$emit('saveChange', true);
                return;
            }

            me.guardarCertificadoEnFiles();
        },
        guardarCertificadoEnFiles() {
            let me = this;
            let formDataCertificado = new FormData();
            formDataCertificado.append('idusuario', me.userSeleccionado.idusuario);
            formDataCertificado.append('campo', 'certificado_p12');
            formDataCertificado.append('password_p12', me.passwordP12);

            if (me.fileCertificadoP12) {
                formDataCertificado.append('archivo', me.fileCertificadoP12);
            }

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

                        if (response.data.archivo) {
                            me.userSeleccionado.certificado_p12 = response.data.archivo;
                        }

                        me.resetCertificadoP12(false);
                        me.$emit('saveChange', true);
                    } else {
                        me.$vs.notify({
                            text: response.data.message || 'Error al guardar el certificado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }
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
        resetCertificadoP12(limpiarInput = true) {
            let me = this;
            me.fileCertificadoP12 = null;
            me.selectedCertificadoName = '';
            me.msjCertificado = '';
            me.muyPesadoCertificado = false;
            me.pesoArchivoCertificado = '';
            me.passwordP12 = '';
            me.showPasswordP12 = false;

            if (limpiarInput) {
                const input = document.getElementById('certificadoP12File');
                if (input) {
                    input.value = '';
                }
            }
        },
        confirmarEliminarCertificadoP12() {
            let me = this;

            if (!me.userSeleccionado || !me.userSeleccionado.certificado_p12) {
                return;
            }

            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Quitar firma electrónica',
                text: '¿Está seguro de eliminar el certificado .p12 de este usuario? Esta acción no se puede deshacer.',
                accept: me.eliminarCertificadoP12,
            });
        },
        eliminarCertificadoP12() {
            let me = this;
            let formData = new FormData();
            formData.append('idusuario', me.userSeleccionado.idusuario);
            formData.append('campo', 'certificado_p12');
            formData.append('accion', 'eliminar');

            me.eliminandoCertificadoP12 = true;
            me.$vs.loading({ color: '#dc2626' });

            axios.post(me.$data_url + 'api/actualizarArchivosUsuario', formData)
                .then(function (response) {
                    me.$vs.loading.close();
                    me.eliminandoCertificadoP12 = false;

                    if (response.data.status === 1) {
                        me.userSeleccionado.certificado_p12 = null;
                        me.resetCertificadoP12();

                        me.$vs.notify({
                            text: response.data.message || 'Firma electrónica eliminada',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                        });
                    } else {
                        me.$vs.notify({
                            text: response.data.message || 'No se pudo eliminar la firma electrónica',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.eliminandoCertificadoP12 = false;

                    let errorMsg = 'Error al eliminar la firma electrónica';
                    if (error.response && error.response.data && error.response.data.message) {
                        errorMsg = error.response.data.message;
                    }

                    me.$vs.notify({
                        text: errorMsg,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                    });
                });
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
        // Método para manejar error al cargar firma existente
        manejarErrorCargaFirma() {
            let me = this;
            me.firmaErrorCarga = true;
        },
        parsearFacturadores() {
            let me = this;
            try {
                if (me.userSeleccionado.id_facturador_perseo && typeof me.userSeleccionado.id_facturador_perseo === 'string') {
                    me.facturadoresAsignados = JSON.parse(me.userSeleccionado.id_facturador_perseo);
                }
            } catch (error) {
                console.error('Error parseando facturadores:', error);
                me.facturadoresAsignados = [];
            }
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
        traerEmpresasYFacturadores() {
            let me = this;
            me.cargandoEmpresas = true;
            this.$http.get(this.$server_url + 'empresa')
                .then(response => {
                    const lista = response.data.filter(empresa => empresa.id != 2) || [];
                    me.empresasBase = lista;
                    // Ahora parsear facturadores con empresas cargadas
                    me.parsearFacturadores();
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
        generarPassword() {
            let me = this;
            let formData = new FormData();
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            })
            formData.append('idusuario', this.userSeleccionado.idusuario);
            this.$http.post(this.$server_url + 'restaurarPasswordXIdUser', formData)
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Use el número de cédula para acceder al perfil del usuario.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                    me.$vs.loading.close("#button-with-loading > .con-vs-loading")
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error en el proceso',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                    me.$vs.loading.close("#button-with-loading > .con-vs-loading")
                })
        },
        //metodos para cargo
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
              formData.append('usuario_id', me.usuario.idusuario)
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
              formData.append('usuario_id', me.usuario.idusuario)
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
    }
}
</script>
<style scoped>
.informacionformhijo {
    z-index: 51002;
}

/* Bloque nombres/apellidos con capitalización */
.nombres-apellidos-block {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 0;
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
    padding: 16px 8px 4px;
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

.firma-header {
    margin-bottom: 20px;
}

.firma-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}

.firma-subtitle {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
    padding: 12px;
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    border-radius: 6px;
    margin: 0;
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

.firma-badge-current {
    background: #3b82f6;
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

/* Responsive */
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

/* Estilos para la sección de firma electrónica */
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

.certificado-preview-current {
    border: 2px solid #10b981;
}

.certificado-no-icon {
    font-size: 48px;
    color: #94a3b8;
    margin-bottom: 12px;
}

.certificado-info-text {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
}

.certificado-status-text {
    font-size: 15px;
    font-weight: 700;
    color: #059669;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
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
