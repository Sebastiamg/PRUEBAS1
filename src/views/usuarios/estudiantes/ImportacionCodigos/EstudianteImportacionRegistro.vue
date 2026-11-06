<template>
  <div>
      <div class="mb-4" :style="isStep1Active ? 'border: 2px solid #ea5455; box-shadow: 0 0 10px rgba(234, 84, 85, 0.25); background-color: rgba(234, 84, 85, 0.03); border-radius: 8px; padding: 12px; transition: all 0.3s ease;' : 'border: 2px solid transparent; border-radius: 8px; padding: 12px; transition: all 0.3s ease;'">
          <p style="font-weight: bold; margin-bottom: 8px;">Seleccione un perfil:</p>
          <v-select :options="SeleccionUsuario" :reduce="SeleccionUsuario => SeleccionUsuario.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="selecciondeusuario" ref="selecciondeusuario" :class="classvalidar_selecciondeusuario" />
      </div>
      
      <!-- Radio buttons para seleccionar origen de institución - SIEMPRE VISIBLE -->
      <div class="mt-4 mb-4">
          <div class="vx-row" v-if="userRoot">
              <div class="vx-col w-full">
                  <p style="font-weight: bold; margin-bottom: 8px;">Seleccione de dónde tomar la institución:</p>
                  <div class="flex" style="gap: 24px;">
                      <vs-radio v-model="origenInstitucion" vs-name="origenInstitucion" :vs-value="1">
                          Usar institución del Excel (columna institucion_id)
                      </vs-radio>
                      <vs-radio v-model="origenInstitucion" vs-name="origenInstitucion" :vs-value="2">
                          Buscar y seleccionar institución manualmente
                      </vs-radio>
                  </div>
              </div>
          </div>
          
          <!-- Componente de búsqueda de institución -->
          <div v-if="origenInstitucion === 2" class="mt-6 mb-4" :style="isStep2Active ? 'border: 2px solid #ea5455; box-shadow: 0 0 10px rgba(234, 84, 85, 0.25); background-color: rgba(234, 84, 85, 0.03); border-radius: 8px; padding: 12px; transition: all 0.3s ease;' : 'border: 2px solid transparent; border-radius: 8px; padding: 12px; transition: all 0.3s ease;'">
              <div class="vx-row">
                  <div class="vx-col w-full">
                      <label style="font-size: 12.5px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                          <span>Buscar Institución</span>
                          <!-- <span style="color: #ff9f43; background-color: rgba(255, 159, 67, 0.12); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(255, 159, 67, 0.25);">
                              <i class="feather icon-alert-circle" style="font-size: 13px;"></i> Requiere al menos 3 caracteres
                          </span> -->
                      </label>
                      <InstitucionSearch 
                          v-model="institucionManual"
                          @input="handleInstitucionSeleccionada"
                          placeholder="🔍 Escriba al menos 3 caracteres para buscar..."
                          :todas="1"
                      />
                      <div v-if="nombreInstitucionSeleccionada" class="mt-4 p-3" style="background: #e8f5e9; border-radius: 4px; border: 1px solid #4caf50;">
                          <span style="color: #2e7d32; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                              <i class="feather icon-check-circle" style="font-size: 16px;"></i> Institución seleccionada: {{ nombreInstitucionSeleccionada }}
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
          <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
              <div class="vx-row">
                  <div class="vx-col sm:w-1/2 w-full">
                      <b>Código</b>
                  </div>
              </div>
              <vs-divider></vs-divider>
              <div :key="index" v-for="(item, index) in errores">
                  <div class="vx-row">
                      <div class="vx-col sm:w-1/2 w-full">
                          <span v-if="item.codigo"> {{item.codigo}} </span>
                      </div>
                  </div>
              </div>
          </div>
      </vs-popup>
      
      <!-- Popup de duplicados en Excel -->
      <vs-popup title="⚠️ Inconsistencias encontradas en el archivo Excel" :active.sync="modalDuplicados" style="padding: 0% !important;">
          <div class="w-full" style="padding: 20px;">
              <div class="mb-4" style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
                  <p style="color: #856404; font-weight: bold; margin-bottom: 8px;">
                      <i class="feather icon-alert-triangle"></i> Se encontraron errores o duplicados en el archivo Excel
                  </p>
                  <p style="color: #856404; font-size: 14px;">
                      Por favor, corrija estos registros en su archivo Excel y vuelva a cargarlo. Puede exportar el reporte para facilitar la corrección.
                  </p>
              </div>

              <!-- Cédulas con longitud incorrecta -->
              <div v-if="cedulasInvalidas.length > 0" class="mb-4">
                  <h4 style="color: #dc3545; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                      <i class="feather icon-alert-circle"></i> Cédulas con longitud incorrecta ({{ cedulasInvalidas.length }})
                      <span style="font-size: 12px; font-weight: normal; color: #6c757d;">(Debe tener entre 10 y 13 dígitos)</span>
                  </h4>
                  <div style="max-height: 200px; overflow-y: auto; background: #f8d7da; padding: 10px; border-radius: 4px; border: 1px solid #f5c6cb;">
                      <table style="width: 100%;">
                          <thead>
                              <tr style="border-bottom: 2px solid #721c24;">
                                  <th style="text-align: left; padding: 5px; color: #721c24;">Cédula</th>
                                  <th style="text-align: center; padding: 5px; color: #721c24;">Dígitos</th>
                                  <th style="text-align: left; padding: 5px; color: #721c24;">Nombres</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, index) in cedulasInvalidas" :key="'inv-' + index" style="border-bottom: 1px solid #f5c6cb;">
                                  <td style="padding: 5px; color: #721c24; font-weight: bold;">{{ item.cedula }}</td>
                                  <td style="padding: 5px; text-align: center; color: #721c24; font-weight: bold;">{{ item.longitud }}</td>
                                  <td style="padding: 5px; color: #721c24; font-size: 12px;">{{ item.nombres }}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              <!-- Cédulas duplicadas -->
              <div v-if="cedulasDuplicadas.length > 0" class="mb-4">
                  <h4 style="color: #dc3545; margin-bottom: 10px;">
                      <i class="feather icon-users"></i> Cédulas duplicadas ({{ cedulasDuplicadas.length }})
                  </h4>
                  <div style="max-height: 200px; overflow-y: auto; background: #f8d7da; padding: 10px; border-radius: 4px; border: 1px solid #f5c6cb;">
                      <table style="width: 100%;">
                          <thead>
                              <tr style="border-bottom: 2px solid #721c24;">
                                  <th style="text-align: left; padding: 5px; color: #721c24;">Cédula</th>
                                  <th style="text-align: center; padding: 5px; color: #721c24;">Repeticiones</th>
                                  <th style="text-align: left; padding: 5px; color: #721c24;">Nombres</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, index) in cedulasDuplicadas" :key="'ced-' + index" style="border-bottom: 1px solid #f5c6cb;">
                                  <td style="padding: 5px; color: #721c24; font-weight: bold;">{{ item.cedula }}</td>
                                  <td style="padding: 5px; text-align: center; color: #721c24;">{{ item.count }}</td>
                                  <td style="padding: 5px; color: #721c24; font-size: 12px;">{{ item.nombres }}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              <!-- Correos duplicados -->
              <div v-if="correosDuplicados.length > 0" class="mb-4">
                  <h4 style="color: #dc3545; margin-bottom: 10px;">
                      <i class="feather icon-mail"></i> Correos duplicados ({{ correosDuplicados.length }})
                  </h4>
                  <div style="max-height: 200px; overflow-y: auto; background: #f8d7da; padding: 10px; border-radius: 4px; border: 1px solid #f5c6cb;">
                      <table style="width: 100%;">
                          <thead>
                              <tr style="border-bottom: 2px solid #721c24;">
                                  <th style="text-align: left; padding: 5px; color: #721c24;">Correo</th>
                                  <th style="text-align: center; padding: 5px; color: #721c24;">Repeticiones</th>
                                  <th style="text-align: left; padding: 5px; color: #721c24;">Nombres</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, index) in correosDuplicados" :key="'corr-' + index" style="border-bottom: 1px solid #f5c6cb;">
                                  <td style="padding: 5px; color: #721c24; font-weight: bold;">{{ item.correo }}</td>
                                  <td style="padding: 5px; text-align: center; color: #721c24;">{{ item.count }}</td>
                                  <td style="padding: 5px; color: #721c24; font-size: 12px;">{{ item.nombres }}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </div>

              <div style="display: flex; justify-content: center; gap: 16px; margin-top: 24px;">
                  <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-download" @click="exportarErroresExcel">
                      Exportar errores
                  </vs-button>
                  <vs-button color="danger" type="flat" class="btn-clean-secondary" @click="cerrarModalDuplicados">
                      Cerrar y corregir archivo
                  </vs-button>
              </div>
          </div>
      </vs-popup>
      <vs-popup title="Códigos no encontrados" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()" style="padding: 0% !important;">
          <div class="w-full" style="background: rgb(235,147,25); background: linear-gradient(90deg, rgba(235,147,25,1) 28%, rgba(255,166,0,1) 100%); color: white; border-radius: 5px; padding: 10px;">
              <div class="vx-row">
                  <div class="vx-col w-full" align="center">
                      <b>Codigos a las que no se aplicaron correctamente</b>
                  </div>
              </div>
              <vs-divider></vs-divider>
              <div :key="index" v-for="(item, index) in cedulas_no_encontradas">
                  <div class="vx-row">
                      <div class="vx-col w-full" align="center"> <span> {{item}} </span> </div>
                  </div>
              </div>
          </div>
      </vs-popup>
      <vs-popup small title="Confirmación" :active.sync="modalConfirm">
          <div class="w-full mb-base" align="center">
              <h4>¿Estás seguro de {{ tablaSeleccionada === 1 ? 'actualizar' : 'registrar' }} estos {{ arraySendData.length }} usuarios?</h4>
              <p v-if="tablaSeleccionada === 1 && activarUsuariosInactivos" style="color: #ff9f43; margin-top: 10px; font-weight: bold;">
                  <i class="feather icon-alert-triangle"></i> También se activarán los usuarios inactivos
              </p>
              <p v-if="tablaSeleccionada === 1 && mantenerGrupoActual" style="color: #28c76f; margin-top: 10px; font-weight: bold;">
                  <i class="feather icon-check-circle"></i> Se mantendrá el grupo/rol actual de los usuarios
              </p>
          </div>
          <div class="w-full" align="center">
              <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
          </div>
      </vs-popup>
      <div>
          <div class="mb-6 mt-5" align="center">
              <div class="vx-col w-full" v-if="tableData.length == 0">
                  <p style="color:#12481A;">
                      <i class="fa fa-file" aria-hidden="true"></i> Estos <b>usuarios</b> pasarán a ser registrados <span style="font-weight: bold;">(no ingrese más de 1500 registros en una sola carga.)</span>
                  </p>
              </div>
              <!-- Sección de importación: solo visible cuando no hay datos cargados -->
            <div v-if="tableData.length === 0">
              <br />
              
              <!-- Zona de carga de archivos Excel (Dropzone) -->
              <div class="mb-4">
                  <!-- Estado BLOQUEADO con Guía de Pasos -->
                  <div v-if="isLockedDropzone" style="background: #fafafa; border: 2px dashed rgba(255, 159, 67, 0.4); border-radius: 8px; padding: 40px 20px; text-align: center; color: #ff9f43; transition: all 0.3s ease;">
                      <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">
                          <i class="feather icon-lock"></i>
                      </div>
                      <h4 style="color: #5e6472; font-weight: 700; margin-bottom: 8px; font-size: 14.5px;">Zona de carga de Excel (Bloqueada)</h4>
                      <p style="font-size: 13px; margin: 0; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                          <i class="feather icon-info" style="font-size: 14px;"></i> {{ lockDropzoneMessage }}
                      </p>
                  </div>
                  
                  <!-- Estado ACTIVO (Componente de importación real) -->
                  <div v-else>
                      <import-excel :onSuccess="loadDataInTable" />
                  </div>
              </div>
              
              <div>
                  <vs-row>
                      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12">
                          <vs-card>
                              <div class="header">
                                  <div style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 8px;">
                                      <vs-button color="primary" type="gradient" style="font-size: 12px; padding: 4px 12px; min-width: unset;" @click="descargarFormatoExcel">Descargar formato</vs-button>
                                      <p style="font-weight: bold; margin-left: 12px; margin-bottom: 0;">Formato del archivo excel</p>
                                  </div>
                                  <table class="tabla">
                                      <tr>
                                          <th class="th1">cedula</th>
                                          <th class="th1">nombres</th>
                                          <th class="th1">apellidos</th>
                                          <th class="th1">correo</th>
                                          <th v-if="origenInstitucion === 1" class="th1">institucion_id</th>
                                      </tr>
                                      <tr>
                                          <td class="td1">123</td>
                                          <td class="td1">xxx</td>
                                          <td class="td1">xxx</td>
                                          <td class="td1">@xxx</td>
                                          <td v-if="origenInstitucion === 1" class="td1">1</td>
                                      </tr>
                                  </table>
                              </div>
                          </vs-card>
                      </vs-col>
                  </vs-row>
              </div>
            </div>
            <!-- Botón para cargar otro archivo (fallback si no hay listas cargadas pero hay data base) -->
            <div v-else-if="(!arrayUsuarios || !arrayUsuarios.length) && (!arrayUsuariosNoEncontrados || !arrayUsuariosNoEncontrados.length)" class="mb-4" style="display: flex; justify-content: center;">
              <vs-button color="warning" type="flat" icon-pack="feather" icon="icon-refresh-cw" class="btn-clean-secondary" @click="limpiarArchivo">
                Cargar otro archivo
              </vs-button>
            </div>
              <!-- {{tableData}} -->
              <vs-row v-if="codigosPerdidos == true">
                  <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                      <vs-alert active="true">
                          Se registraron {{ porcentaje }} usuarios
                      </vs-alert>
                  </vs-col>
              </vs-row>
          </div>
      </div>
      <vs-row v-if="codigosPerdidos == true && registroProblemas.length > 0">
          <vs-card>
              <div class="header">
                  <span style="font-weight:bold;" class="text-danger">Registro de usuarios con problemas</span>
              </div>
              <vs-table max-items="10" search pagination :data="registroProblemas">
                  <template slot="header">
                      <vs-chip color="primary">Cantidad: <b> {{ registroProblemas.length }}</b></vs-chip>
                      <div style="align-content: end; text-align: right;">
                          <vs-button @click="exportToExcel" color="primary" type="gradient" class="m-4">Exportar a Excel</vs-button>
                      </div>
                  </template>

                  <template slot="thead">
                      <vs-th>Cédula</vs-th>
                      <vs-th>Nombres</vs-th>
                      <vs-th>Apellidos</vs-th>
                      <vs-th>Correo</vs-th>
                      <vs-th v-if="origenInstitucion === 1">institucion_id</vs-th>
                      <vs-th>Problema</vs-th>
                  </template>
                  <template slot-scope="{data}">
                      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                          <vs-td>
                              {{data[indextr].cedula}}<br>
                          </vs-td>
                          <vs-td>
                              {{data[indextr].nombres}}<br>
                          </vs-td>
                          <vs-td>
                              {{data[indextr].apellidos}}<br>
                          </vs-td>
                          <vs-td>
                              {{data[indextr].correo}}<br>
                          </vs-td>
                          <vs-td v-if="origenInstitucion === 1">
                              {{data[indextr].institucion_id}}<br>
                          </vs-td>
                          <vs-td>
                              {{data[indextr].problema}}<br>
                          </vs-td>
                      </vs-tr>
                  </template>
              </vs-table>
          </vs-card>
      </vs-row>
            <vx-card v-if="(Array.isArray(arrayUsuarios) && arrayUsuarios.length) || (Array.isArray(arrayUsuariosNoEncontrados) && arrayUsuariosNoEncontrados.length)">
                <div class="modern-header-row mb-5">
                    <div class="modern-tabs-container">
                        <div 
                            class="modern-tab" 
                            :class="{ 'active-tab': tablaSeleccionada === 0 }"
                            @click="tablaSeleccionada = 0"
                        >
                            <i class="feather icon-user-plus mr-2"></i>
                            Usuarios no existen
                            <span class="modern-badge danger ml-2">{{ usuariosNoExistenCount }}</span>
                        </div>
                        <div 
                            class="modern-tab" 
                            :class="{ 'active-tab': tablaSeleccionada === 1 }"
                            @click="tablaSeleccionada = 1"
                        >
                            <i class="feather icon-users mr-2"></i>
                            Usuarios existen
                            <span class="modern-badge success ml-2">{{ usuariosExistentesCount }}</span>
                        </div>
                    </div>
                    
                    <vs-button 
                        color="warning" 
                        type="flat" 
                        icon-pack="feather" 
                        icon="icon-refresh-cw" 
                        class="btn-clean-secondary"
                        @click="limpiarArchivo"
                    >
                        Cargar otro archivo
                    </vs-button>
                </div>
                <!--USUARIOS EXISTEN-->
                <div v-if="tablaSeleccionada === 1">
                    <!-- Filtros de estado -->
                    <div class="modern-pills-container mb-5">
                        <span class="pills-label">Filtrar por estado:</span>
                        <div class="pills-wrapper">
                            <button 
                                class="pill-btn" 
                                :class="{ active: filtroEstadoUsuario === 0 }" 
                                @click="filtroEstadoUsuario = 0"
                            >
                                Todos <span class="pill-badge neutral">{{ usuariosExistentesCount }}</span>
                            </button>
                            <button 
                                class="pill-btn" 
                                :class="{ active: filtroEstadoUsuario === 1 }" 
                                @click="filtroEstadoUsuario = 1"
                            >
                                Activos <span class="pill-badge success">{{ usuariosActivosCount }}</span>
                            </button>
                            <button 
                                class="pill-btn" 
                                :class="{ active: filtroEstadoUsuario === 2 }" 
                                @click="filtroEstadoUsuario = 2"
                            >
                                Inactivos <span class="pill-badge danger">{{ usuariosInactivosCount }}</span>
                            </button>
                        </div>
                    </div>
                    <vs-table multiple v-model="usuariosSeleccionados" stripe pagination :max-items="10" search :data="arrayUsuariosFiltrados">
                        <template slot="header">
                            <div style="display: flex; flex-direction: column; align-items: center; width: 100%; gap: 16px; margin-bottom: 8px;">
                                <!-- Banner de instrucciones de selección -->
                                <div class="instruction-banner">
                                    <p class="instruction-text">
                                        <i class="feather icon-info mr-2" style="font-size: 16px;"></i>
                                        <span><strong>Instrucciones:</strong> Seleccione los usuarios que desea actualizar marcando las casillas en la primera columna de la tabla. Al seleccionar al menos uno se activará el botón de actualización.</span>
                                    </p>
                                </div>
                                <div class="table-header-actions" style="justify-content: center;">
                                    <vs-chip color="primary">
                                        Seleccionados: {{ usuariosSeleccionados.length }}
                                    </vs-chip>
                                    <vs-button 
                                        v-if="usuariosSeleccionados.length > 0" 
                                        color="success" 
                                        type="filled" 
                                        icon-pack="feather" 
                                        icon="icon-refresh-cw" 
                                        class="btn-modern-success"
                                        @click="arraySendData = usuariosSeleccionados;openConfirm()"
                                    >
                                        Actualizar usuarios ({{ usuariosSeleccionados.length }})
                                    </vs-button>
                                    <vs-button 
                                        v-if="arrayUsuariosFiltrados.length > 0" 
                                        color="primary" 
                                        type="border" 
                                        icon-pack="feather" 
                                        icon="icon-download" 
                                        class="btn-modern-secondary"
                                        @click="exportarExisten()"
                                    >
                                        Exportar a Excel ({{ arrayUsuariosFiltrados.length }})
                                    </vs-button>
                                </div>
                                <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
                                    <vs-checkbox v-model="activarUsuariosInactivos" color="warning">
                                        Activar usuarios inactivos
                                    </vs-checkbox>
                                    <vs-checkbox v-model="mantenerGrupoActual" color="success">
                                        Mantener grupo/rol actual
                                    </vs-checkbox>
                                </div>
                            </div>
                        </template>
                         <template slot="thead">
                             <vs-th>Cédula</vs-th>
                             <vs-th>ID Usuario</vs-th>
                             <vs-th>Nombres</vs-th>
                             <vs-th>Apellidos</vs-th>
                             <vs-th>Email</vs-th>
                             <vs-th>Institución</vs-th>
                             <vs-th>Grupo</vs-th>
                             <vs-th>Estado</vs-th>
                         </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" :is-selected="usuariosSeleccionados.includes(data[indextr])">
                                <vs-td>{{ data[indextr].cedula }}</vs-td>
                                <vs-td>{{ data[indextr].idusuario }}</vs-td>
                                <vs-td>
                                  <div v-if="tr.nombres != tr.nombres_bd">
                                    <b>Nombres anterior:</b>
                                    <p>{{ tr.nombres_bd }}</p>
                                    <b>Nombres a modificar:</b>
                                    <p>{{ tr.nombres }}</p>
                                  </div>
                                  <div v-else>
                                    {{tr.nombres}}
                                  </div>
                                </vs-td>
                                <vs-td>
                                  <div v-if="tr.apellidos != tr.apellidos_bd">
                                    <b>Apellidos anterior:</b>
                                    <p>{{ tr.apellidos_bd }}</p>
                                    <b>Apellidos a modificar:</b>
                                    <p>{{ tr.apellidos }}</p>
                                  </div>
                                  <div v-else>
                                    {{tr.apellidos}}
                                  </div>
                                </vs-td>
                                <vs-td>
                                  <div v-if="tr.correo != tr.email_bd">
                                    <br>
                                    <b>Email anterior:</b>
                                    <p>{{ tr.email_bd }}</p>
                                    <b>Email a modificar:</b>
                                    <p>{{ tr.correo }}</p>
                                  </div>
                                  <div v-else>
                                    {{ tr.correo }}
                                  </div>
                                </vs-td>
                                <vs-td>
                                  <div v-if="tr.nombreInstitucion != tr.nombreInstitucion_db">
                                    <br>
                                    <b>Institución anterior:</b>
                                    <p>{{ tr.nombreInstitucion_db }}</p>
                                    <b>Institución a modificar:</b>
                                    <p>{{ tr.nombreInstitucion }}</p>
                                  </div>
                                  <div v-else>
                                    {{ tr.nombreInstitucion }}
                                  </div>
                                </vs-td>
                                <vs-td>{{ data[indextr].grupo }}</vs-td>
                                <vs-td>
                                    <vs-chip :color="data[indextr].estadoUsuario === 1 ? 'success' : 'danger'">
                                        {{ data[indextr].estado_usuario }}
                                    </vs-chip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <!--USUARIOS NO EXISTEN-->
                <div v-else-if="tablaSeleccionada === 0">
                    <vs-table stripe pagination :max-items="10" search :data="arrayUsuariosNoEncontrados">
                        <template slot="header">
                            <div class="table-header-actions" style="justify-content: center; margin-bottom: 8px;">
                                <vs-button 
                                    v-if="arrayUsuariosNoEncontrados.length > 0 && tableData.length <= 1500" 
                                    color="primary" 
                                    type="filled" 
                                    icon-pack="feather" 
                                    icon="icon-user-plus" 
                                    class="btn-modern-primary"
                                    @click="arraySendData = arrayUsuariosNoEncontrados;openConfirm()"
                                >
                                    Registrar usuarios
                                </vs-button>
                                <vs-button 
                                    v-if="arrayUsuariosNoEncontrados.length > 0" 
                                    color="primary" 
                                    type="border" 
                                    icon-pack="feather" 
                                    icon="icon-download" 
                                    class="btn-modern-secondary"
                                    @click="exportarNoEncontrados()"
                                >
                                    Exportar a Excel ({{ arrayUsuariosNoEncontrados.length }})
                                </vs-button>
                            </div>
                        </template>
                        <template slot="thead">

                            <vs-th>Cédula</vs-th>
                            <vs-th>Nombres</vs-th>
                            <vs-th>Apellidos</vs-th>
                            <vs-th>Email</vs-th>
                            <vs-th v-if="origenInstitucion === 1">institucion_id</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>{{ data[indextr].cedula }}</vs-td>
                                <vs-td>{{ data[indextr].nombres }}</vs-td>
                                <vs-td>{{ data[indextr].apellidos }}</vs-td>
                                <vs-td>{{ data[indextr].correo }}</vs-td>
                                <vs-td v-if="origenInstitucion === 1">{{ data[indextr].institucion_id }}</vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vx-card>
      <!--MODALES-->
  </div>
  </template>

  <script>
  import {
      mapState
  } from "vuex";
  import vSelect from 'vue-select'
  import ImportExcel from "../../../codigos/components/importExcel.vue";
  import InstitucionSearch from "../../../../components/InstitucionSearch.vue";
  import XLSX from 'xlsx';
  export default {
      components: {
          ImportExcel,
          vSelect,
          InstitucionSearch,
      },
      data() {
          return {
              codigosPerdidos: false,
              tableData: [],
              header: [],
              sheetName: '',
              usuario: [],
              modalConfirm: false,
              modalErrores: false,
              errores: [],
              modalCedulas: false,
              registroProblemas: [],
              cedulas_no_encontradas: [],
              porcentaje: 0,
              selecciondeusuario: '',
              classvalidar_selecciondeusuario: '',
              SeleccionUsuario: [
                  { text: '--Seleccione--', value: null },
                  { text: 'Docentes', value: 6 },
                  { text: 'Evaluación Docente', value: 13 },
                  { text: 'Estudiantes', value: 4 },
              ],
              arrayUsuarios: [],
              arrayUsuariosNoEncontrados: [],
              tablaSeleccionada: 0,
              arraySendData: [],
              filtroEstadoUsuario: 0, // 0=todos, 1=activos, 2=inactivos
              usuariosSeleccionados: [], // multiselect de usuarios existen
              activarUsuariosInactivos: false, // checkbox para activar usuarios inactivos
              mantenerGrupoActual: false, // checkbox para mantener grupo/rol actual
              origenInstitucion: 1, // null = no seleccionado, 1 = usar del excel, 2 = buscar manualmente
              institucionManual: null, // ID de institución seleccionada manualmente
              periodoManual: 0, // ID de período de la institución manual
              nombreInstitucionSeleccionada: '', // Nombre de la institución seleccionada
              modalDuplicados: false, // Modal para mostrar duplicados
              cedulasDuplicadas: [], // Array de cédulas duplicadas
              correosDuplicados: [], // Array de correos duplicados
              cedulasInvalidas: [], // Array de cédulas con longitud incorrecta (min 10, max 13)
          }
      },
      computed: {
          ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor']),
          isLockedDropzone() {
              if (!this.selecciondeusuario) return true;
              if (this.origenInstitucion === null) return true;
              if (this.origenInstitucion === 2 && (!this.institucionManual || this.institucionManual === 0)) return true;
              return false;
          },
          lockDropzoneMessage() {
              if (!this.selecciondeusuario) {
                  return "Paso 1: Seleccione un perfil al inicio de la página.";
              }
              if (this.origenInstitucion === 2 && (!this.institucionManual || this.institucionManual === 0)) {
                  return "Paso 2: Busque y seleccione una institución usando el buscador de arriba.";
              }
              return "";
          },
          isStep1Active() {
              return !this.selecciondeusuario;
          },
          isStep2Active() {
              return !!this.selecciondeusuario && this.origenInstitucion === 2 && (!this.institucionManual || this.institucionManual === 0);
          },
          usuariosExistentesCount() {
              if (!Array.isArray(this.arrayUsuarios)) return 0;
              return this.arrayUsuarios.length;
          },
          usuariosNoExistenCount() {
              if (!Array.isArray(this.arrayUsuariosNoEncontrados)) return 0;
              return this.arrayUsuariosNoEncontrados.length;
          },
          usuariosActivosCount() {
              if (!Array.isArray(this.arrayUsuarios)) return 0;
              return this.arrayUsuarios.filter(u => u.estadoUsuario === 1).length;
          },
          usuariosInactivosCount() {
              if (!Array.isArray(this.arrayUsuarios)) return 0;
              return this.arrayUsuarios.filter(u => u.estadoUsuario !== 1).length;
          },
          arrayUsuariosFiltrados() {
              if (!Array.isArray(this.arrayUsuarios)) return [];
              if (this.filtroEstadoUsuario === 0) {
                  return this.arrayUsuarios; // Todos
              } else if (this.filtroEstadoUsuario === 1) {
                  return this.arrayUsuarios.filter(u => u.estadoUsuario === 1); // Activos
              } else {
                  return this.arrayUsuarios.filter(u => u.estadoUsuario !== 1); // Inactivos
              }
          },
      },
      watch: {
          // Limpiar checkbox cuando se cambia a tabla de usuarios no existen
          tablaSeleccionada(newVal) {
              if (newVal === 0) {
                  this.activarUsuariosInactivos = false;
                  this.mantenerGrupoActual = false;
                  this.usuariosSeleccionados = [];
              }
          },
          // Limpiar archivo e institución manual cuando se cambia el origen
          origenInstitucion(newVal) {
              // Limpiar todos los datos cargados cuando cambia el radio
              this.limpiarArchivo();
              
              if (newVal === 1) {
                  // Si cambia a Excel, limpiar institución manual
                  this.institucionManual = null;
                  this.periodoManual = 0;
                  this.nombreInstitucionSeleccionada = '';
              }
          }
      },
      created() {
          this.usuario = JSON.parse(localStorage.getItem('usuario'));
          this.codigosPerdidos = false
          if(this.userAsesor){
            this.origenInstitucion = 2
          }
      },
      methods: {
        descargarFormatoExcel() {
            let me = this;
            // Formato base
            let formato = {
                cedula: '1234567890',
                nombres: 'Juan',
                apellidos: 'Pérez',
                correo: 'juan.perez@email.com'
            };
            
            let header = ['cedula', 'nombres', 'apellidos', 'correo'];
            
            // Solo agregar institucion_id si está seleccionada la opción de Excel
            if (me.origenInstitucion === 1) {
                formato.institucion_id = '1';
                header.push('institucion_id');
            }
            
            // Usar XLSX para crear el archivo
            const ws = XLSX.utils.json_to_sheet([formato], {header});
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Formato');
            XLSX.writeFile(wb, 'formato_registro_usuarios.xlsx');
        },
        loadDataInTable({
            results,
            header,
            meta
        }) {
            let me = this;
            
            // Validar que si está en modo manual, debe tener institución seleccionada
            if (me.origenInstitucion === 2 && (!me.institucionManual || me.institucionManual === 0)) {
                me.$vs.notify({
                    text: 'Debe seleccionar una institución antes de cargar el archivo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 8000,
                });
                return;
            }
            
            this.header = header
            this.tableData = results
            this.sheetName = meta.sheetName
            this.codigosPerdidos = false
            this.registroProblemas = []
            this.modalDuplicados = false
            this.cedulasDuplicadas = []
            this.correosDuplicados = []
            this.usuariosSeleccionados = []
            this.validateCampos()
        },
        validateCampos(){
          let me = this;
          //validar que el archivo tenga los campos necesarios con un for para ver que no haga vacios
          let camposNecesarios = ['cedula', 'nombres', 'apellidos', 'correo'];
          
          // Solo validar institucion_id si el origen es del Excel (opción 1)
          if (me.origenInstitucion === 1) {
              camposNecesarios.push('institucion_id');
          }
          
          for (let campo of camposNecesarios) {
              if (!me.header.includes(campo)) {
                  me.$vs.notify({
                      text: `El archivo cargado no contiene el campo necesario: ${campo}`,
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle',
                      time: 8000,
                  });
                  // Limpiar datos cargados
                  me.tableData = [];
                  me.header = [];
                  me.sheetName = '';
                  return; // Salir de la función si falta un campo
              }
          }

          if (me.validarDuplicadosExcel()) {
              me.modalDuplicados = true
              return
          }

          this.f_consultarUsuarios()

        },
        validarDuplicadosExcel() {
            let me = this;
            const filas = Array.isArray(me.tableData) ? me.tableData : [];
            me.cedulasInvalidas = [];

            const normalizar = (valor) => {
                if (valor === null || valor === undefined) return '';
                return String(valor).trim();
            };

            const mapCedulas = new Map();
            const mapCorreos = new Map();

            filas.forEach((fila) => {
                const cedula = normalizar(fila.cedula);
                const correo = normalizar(fila.correo).toLowerCase();
                const nombreCompleto = `${normalizar(fila.nombres)} ${normalizar(fila.apellidos)}`.trim();

                // Validar longitud de cédula (debe tener entre 10 y 13 dígitos)
                if (cedula) {
                    if (cedula.length < 10 || cedula.length > 13) {
                        me.cedulasInvalidas.push({
                            cedula,
                            longitud: cedula.length,
                            nombres: nombreCompleto || 'Sin nombre'
                        });
                    }

                    if (!mapCedulas.has(cedula)) {
                        mapCedulas.set(cedula, { count: 0, nombres: [] });
                    }
                    const itemCedula = mapCedulas.get(cedula);
                    itemCedula.count += 1;
                    if (nombreCompleto) itemCedula.nombres.push(nombreCompleto);
                }

                if (correo) {
                    if (!mapCorreos.has(correo)) {
                        mapCorreos.set(correo, { count: 0, nombres: [] });
                    }
                    const itemCorreo = mapCorreos.get(correo);
                    itemCorreo.count += 1;
                    if (nombreCompleto) itemCorreo.nombres.push(nombreCompleto);
                }
            });

            me.cedulasDuplicadas = Array.from(mapCedulas.entries())
                .filter(([, value]) => value.count > 1)
                .map(([cedula, value]) => ({
                    cedula,
                    count: value.count,
                    nombres: [...new Set(value.nombres)].join(' | '),
                }));

            me.correosDuplicados = Array.from(mapCorreos.entries())
                .filter(([, value]) => value.count > 1)
                .map(([correo, value]) => ({
                    correo,
                    count: value.count,
                    nombres: [...new Set(value.nombres)].join(' | '),
                }));

            return me.cedulasDuplicadas.length > 0 || me.correosDuplicados.length > 0 || me.cedulasInvalidas.length > 0;
        },
        cerrarModalDuplicados() {
            this.modalDuplicados = false;
        },
        validarcampo_selecciondeusuario() {
            let me = this;
            const focus_selecciondeusuario = me.$refs.selecciondeusuario.$el.querySelector('input');
            focus_selecciondeusuario.focus();
            me.classvalidar_selecciondeusuario = 'stylevalidar';
            //Notificación de vacio
            me.$vs.notify({
                text: "Seleccione un perfil para continuar.",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000,
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_selecciondeusuario = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        f_consultarUsuarios(){
          let me = this;
          me.arrayUsuarios = [];
          me.arrayUsuariosNoEncontrados = [];
          let formData = new FormData();
          let json_usuarios = JSON.stringify(me.tableData);
          formData.append('action','Post_Traer_Data_Usuarios');
          formData.append('data_usuarios', json_usuarios);
          me.$vs.loading()
          me.$http.post(this.$server_url + 'metodosPostUsuario', formData)
              .then(res => {
                  me.$vs.loading.close()
                  if (res.data.status == 0) {
                      me.$vs.notify({
                          text: res.data.message,
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-check'
                      })
                      return false
                  }
                  // Convertir a array si viene como objeto
                  const dataUsuarios = res.data.dataUsuarios;
                  const usuariosNoEncontrados = res.data.usuariosNoEncontrados;
                  me.arrayUsuarios = Array.isArray(dataUsuarios) ? dataUsuarios : Object.values(dataUsuarios || {});
                  me.arrayUsuariosNoEncontrados = Array.isArray(usuariosNoEncontrados) ? usuariosNoEncontrados : Object.values(usuariosNoEncontrados || {});
              })
              .catch(function (error) {
                  me.$vs.notify({
                      text: 'Verifique que la información se haya guardado correctamente.',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  me.$vs.loading.close()
              })
        },
        handleInstitucionSeleccionada(idInstitucion) {
            let me = this;
            me.institucionManual = idInstitucion;
            
            if (idInstitucion) {
                // Obtener el nombre y período de la institución
                me.$vs.loading();
                me.$http.get(me.$server_url + 'institucionTraerPeriodo?institucion_id=' + idInstitucion)
                    .then(function (res) {
                        me.$vs.loading.close();
                        
                        if (res.data.length > 0) {
                            me.periodoManual = res.data[0].periodo;
                            me.nombreInstitucionSeleccionada = res.data[0].nombreInstitucion || '';
                            
                            me.$vs.notify({
                                text: 'Institución seleccionada correctamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                        } else {
                            me.$vs.notify({
                                text: 'La institución no tiene periodo activo',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                            me.institucionManual = 0;
                            me.periodoManual = 0;
                            me.nombreInstitucionSeleccionada = '';
                        }
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                        console.log(error + ' error');
                        me.$vs.notify({
                            text: 'Error al obtener información de la institución',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    });
            } else {
                me.periodoManual = 0;
                me.nombreInstitucionSeleccionada = '';
            }
        },
        handleInstitucionChange(datos) {
            let me = this;
            if (datos.change === 'institucion') {
                me.institucionManual = datos.value;
            }
            if (datos.change === 'periodo_id') {
                me.periodoManual = datos.value;
            }
        },
        procesarPagos() {
            let me = this
            
            // Validar que haya seleccionado el origen de institución
            if (me.origenInstitucion === null) {
                me.$vs.notify({
                    text: 'Debe seleccionar de dónde tomar la institución (Excel o Búsqueda manual)',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            
            // Validar que si seleccionó manual, tenga institución seleccionada
            if (me.origenInstitucion === 2 && (!me.institucionManual || me.institucionManual === 0)) {
                me.$vs.notify({
                    text: 'Debe seleccionar una institución antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            
            let json_usuarios = JSON.stringify(me.arraySendData)
            let formData = new FormData();
            formData.append('data_usuarios', json_usuarios);
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('id_group', me.selecciondeusuario)
            formData.append('tipoAccion', me.tablaSeleccionada)
            formData.append('activarUsuariosInactivos', me.activarUsuariosInactivos ? 1 : 0)
            formData.append('mantenerGrupoActual', me.mantenerGrupoActual ? 1 : 0)
            formData.append('origenInstitucion', me.origenInstitucion)
            formData.append('institucionManual', me.institucionManual || 0)
            formData.append('periodoManual', me.periodoManual)
            me.$vs.loading()
            this.$http.post(this.$server_url + 'importRegistroUsuarios', formData)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        return false
                    }
                    me.$vs.notify({
                        text: 'Cédulas procesadas exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.modalConfirm = false
                    me.codigosPerdidos = true
                    me.registroProblemas = res.data.registroProblemas
                    me.porcentaje = res.data.cambiados
                    me.usuariosSeleccionados = []
                    me.f_consultarUsuarios()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Verifique que la información se haya guardado correctamente.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    // setTimeout(function() {location.reload()}, 1000);
                })
        },
        openConfirm(tipo) {
            let me = this
            me.tipo_selected = tipo
            if ((me.selecciondeusuario == 'undefined') || (me.selecciondeusuario == '') || (me.selecciondeusuario == null)) {
                me.validarcampo_selecciondeusuario();
                return
            }
            
            // Validar campos base siempre requeridos
            let camposBase = ['cedula', 'nombres', 'apellidos', 'correo'];
            let faltaCampoBase = camposBase.some(campo => !me.tableData[0][campo]);
            
            // Si está en modo Excel (opción 1), también validar institucion_id
            if (me.origenInstitucion === 1) {
                faltaCampoBase = faltaCampoBase || !me.tableData[0].institucion_id;
            }
            
            if (faltaCampoBase) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Corrija el formato del excel y vuelva a intentar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            
            me.errores = []
            $.each(me.tableData, function (key, value) {
                let tieneError = false;
                
                // Validar campos base
                if (!value.cedula || !value.nombres || !value.apellidos || !value.correo) {
                    tieneError = true;
                }
                
                // Si está en modo Excel (opción 1), validar también institucion_id
                if (me.origenInstitucion === 1 && !value.institucion_id) {
                    tieneError = true;
                }
                
                if (tieneError) {
                    me.errores.push(value);
                }
            })
            
            if (me.errores.length > 0) {
                me.modalErrores = true
            } else {
                me.modalConfirm = true
            }
        },
        recargar() {
            location.reload()
        },
        exportToExcel() {
            const wb = XLSX.utils.book_new();
            const sheet1Data = this.registroProblemas.map(item => ({
                'Cédula': item.cedula,
                'Nombres': item.nombres,
                'Apellidos': item.apellidos,
                'Correo': item.correo,
                'institucion_id': item.institucion_id,
                'Problema': item.problema,
            }));
            const ws1 = XLSX.utils.json_to_sheet(sheet1Data);

            XLSX.utils.book_append_sheet(wb, ws1, 'Registro Problemas');

            XLSX.writeFile(wb, 'Resultado_Proceso.xlsx');
        },
        exportarExisten() {
            const wb = XLSX.utils.book_new();
            const sheet1Data = this.arrayUsuariosFiltrados.map(item => ({
                'Cédula': item.cedula,
                'ID Usuario': item.idusuario,
                'Nombres Actual': item.nombres_bd,
                'Nombres Excel': item.nombres,
                'Apellidos Actual': item.apellidos_bd,
                'Apellidos Excel': item.apellidos,
                'Email': item.correo,
                'Institución Actual': item.nombreInstitucion_db,
                'Institución Excel': item.nombreInstitucion,
                'Grupo': item.grupo,
                'Estado': item.estado_usuario,
            }));
            const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
            XLSX.utils.book_append_sheet(wb, ws1, 'Usuarios Existentes');
            XLSX.writeFile(wb, 'Usuarios_Existentes.xlsx');
        },
        limpiarArchivo() {
            // Limpiar todos los datos para permitir cargar un nuevo archivo
            this.tableData = [];
            this.header = [];
            this.sheetName = '';
            this.arrayUsuarios = [];
            this.arrayUsuariosNoEncontrados = [];
            this.codigosPerdidos = false;
            this.registroProblemas = [];
            this.modalDuplicados = false;
            this.cedulasDuplicadas = [];
            this.correosDuplicados = [];
            this.cedulasInvalidas = [];
        },
        exportarErroresExcel() {
            const wb = XLSX.utils.book_new();
            
            // Cédulas con longitud incorrecta
            if (this.cedulasInvalidas.length > 0) {
                const dataInvalidas = this.cedulasInvalidas.map(item => ({
                    'Cédula': item.cedula,
                    'Longitud Actual': item.longitud,
                    'Mensaje': 'Debe tener entre 10 y 13 dígitos',
                    'Nombres': item.nombres
                }));
                const ws = XLSX.utils.json_to_sheet(dataInvalidas);
                XLSX.utils.book_append_sheet(wb, ws, 'Longitud Incorrecta');
            }

            // Cédulas duplicadas
            if (this.cedulasDuplicadas.length > 0) {
                const dataCedulas = this.cedulasDuplicadas.map(item => ({
                    'Cédula': item.cedula,
                    'Repeticiones': item.count,
                    'Nombres': item.nombres
                }));
                const ws = XLSX.utils.json_to_sheet(dataCedulas);
                XLSX.utils.book_append_sheet(wb, ws, 'Cédulas Duplicadas');
            }

            // Correos duplicados
            if (this.correosDuplicados.length > 0) {
                const dataCorreos = this.correosDuplicados.map(item => ({
                    'Correo': item.correo,
                    'Repeticiones': item.count,
                    'Nombres': item.nombres
                }));
                const ws = XLSX.utils.json_to_sheet(dataCorreos);
                XLSX.utils.book_append_sheet(wb, ws, 'Correos Duplicados');
            }

            XLSX.writeFile(wb, 'Errores_Archivo_Excel.xlsx');
        },
        exportarNoEncontrados() {
            const wb = XLSX.utils.book_new();
            const sheetData = this.arrayUsuariosNoEncontrados.map(item => ({
                'Cédula': item.cedula,
                'Nombres': item.nombres,
                'Apellidos': item.apellidos,
                'Correo': item.correo,
                'institucion_id': item.institucion_id,
            }));
            const ws = XLSX.utils.json_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(wb, ws, 'Usuarios No Encontrados');
            XLSX.writeFile(wb, 'Usuarios_No_Encontrados.xlsx');
        },
      }
  }
  </script>

  <style scoped>
  .tabla {
      width: 100%;
      margin-top: 10px;
  }

  .tabla {

      border: 1px solid #D1E5F1;
      padding: 2px;
      border-radius: 5px;
  }

  .th1 {
      background-color: #092308;
      border-radius: 5px;
      color: white;
  }

  .td1,
  .th1 {
      padding: 10px;
      text-align: center;
      border: none;
  }

  .stylevalidar {
      /* border: 2px solid #00f; */
      box-shadow: 0px 0px 2px 4px #ff0000;
      border-radius: 5px;
  }

  /* Estilos Modernos de UX/UI */

  .modern-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding-bottom: 16px;
  }

  .modern-tabs-container {
      display: flex;
      background-color: #f1f5f9;
      padding: 4px;
      border-radius: 8px;
      gap: 4px;
  }

  .modern-tab {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-size: 13.5px;
      font-weight: 600;
      color: #64748b;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      user-select: none;
  }

  .modern-tab:hover {
      color: #1e293b;
      background-color: rgba(255, 255, 255, 0.5);
  }

  .modern-tab.active-tab {
      background-color: #ffffff;
      color: #1e293b;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  }

  .modern-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 9999px;
      min-width: 20px;
  }

  .modern-badge.danger {
      background-color: #fee2e2;
      color: #ef4444;
  }

  .modern-badge.success {
      background-color: #dcfce7;
      color: #22c55e;
  }

  /* Botones con estilo limpio y espaciado */
  .btn-clean-secondary {
      display: inline-flex;
      align-items: center;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 8px 16px !important;
      transition: all 0.2s ease !important;
  }
  .btn-clean-secondary:hover {
      background: rgba(255, 159, 67, 0.08) !important;
      transform: translateY(-1px);
  }

  /* Contenedores de acciones de tablas */
  .table-header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      width: 100%;
  }

  .btn-modern-primary {
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 10px 20px !important;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2) !important;
      transition: all 0.2s ease !important;
  }

  .btn-modern-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 12px -1px rgba(59, 130, 246, 0.3) !important;
  }

  .btn-modern-success {
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 10px 20px !important;
      box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2) !important;
      transition: all 0.2s ease !important;
  }

  .btn-modern-success:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 12px -1px rgba(34, 197, 94, 0.3) !important;
  }

  .btn-modern-secondary {
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 10px 20px !important;
      transition: all 0.2s ease !important;
  }

  .btn-modern-secondary:hover {
      background-color: rgba(0, 0, 0, 0.02) !important;
      transform: translateY(-1px);
  }

  /* Selector de píldoras */
  .modern-pills-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      background-color: #f8fafc;
      padding: 10px 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
  }

  .pills-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
  }

  .pills-wrapper {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
  }

  .pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
  }

  .pill-btn:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
      color: #1e293b;
  }

  .pill-btn.active {
      background: #1e293b;
      border-color: #1e293b;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .pill-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 9999px;
  }

  .pill-badge.neutral {
      background: #f1f5f9;
      color: #475569;
  }
  .pill-btn.active .pill-badge.neutral {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
  }

  .pill-badge.success {
      background: #dcfce7;
      color: #15803d;
  }
  .pill-btn.active .pill-badge.success {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
  }

  .pill-badge.danger {
      background: #fee2e2;
      color: #b91c1c;
  }
  .pill-btn.active .pill-badge.danger {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
  }

  /* Banner de Instrucciones */
  .instruction-banner {
      width: 100%;
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 16px;
      border-radius: 6px;
      text-align: left;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .instruction-text {
      color: #1e3a8a;
      font-size: 13px;
      margin: 0;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      line-height: 1.5;
  }

  /* Responsive table header stacking and spacing */
  @media (max-width: 768px) {
      ::v-deep .vs-table--header {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 16px !important;
          padding: 12px !important;
      }
      ::v-deep .vs-table--search {
          margin: 0 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: stretch !important;
      }
      ::v-deep .vs-table--search input {
          width: 100% !important;
      }
      
      .modern-header-row {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 12px !important;
      }
      
      .modern-tabs-container {
          flex-direction: column !important;
          width: 100% !important;
      }
      
      .modern-tab {
          justify-content: center !important;
          width: 100% !important;
      }
      
      .btn-clean-secondary {
          width: 100% !important;
          justify-content: center !important;
      }
      
      .table-header-actions {
          flex-direction: column !important;
          align-items: stretch !important;
          width: 100% !important;
      }
      
      .table-header-actions > * {
          width: 100% !important;
          justify-content: center !important;
      }
  }
  </style>
