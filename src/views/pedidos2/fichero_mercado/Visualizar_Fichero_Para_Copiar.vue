<template>
<div class="fichero-visualizer" :class="{'dark-mode': $store.state.theme === 'dark'}">

    <!-- HEADER CON INSTRUCCIONES -->
    <div class="selection-instructions">
        <div class="instruction-content">
            <div class="instruction-icon">
                <ion-icon name="information-circle"></ion-icon>
            </div>
            <div class="instruction-text">
                <h3>Selecciona las secciones que deseas copiar</h3>
                <p>Haz clic en cada sección para marcarla. Puedes ver toda la información antes de decidir.</p>
            </div>
        </div>
        <div v-if="!wizardMode" class="action-buttons-top">
            <vs-button color="danger" type="border" @click="cancelarCopiado()" icon="close">
                Cancelar
            </vs-button>
            <vs-button color="success" @click="finalizarCopiado()" icon="check_circle">
                Finalizar y Copiar
            </vs-button>
        </div>
    </div>

    <!-- CONTADOR DE SELECCIÓN -->
    <div class="selection-counter">
        <ion-icon name="checkmark-done-circle"></ion-icon>
        <span>Has seleccionado <strong>{{ Object.values(seleccionCopia).filter(v => v).length }}</strong> de <strong>7</strong> secciones para copiar</span>
    </div>

    <vx-card id="seccionImprimir2" class="fichero-card">

        <!-- TÍTULO DEL FICHERO -->
        <div class="fichero-title">
            <h2> <span>FICHERO DE MERCADO {{ periodoSeleccionado.descripcion_periodoescolar }}</span></h2>
        </div>
        <!-- DATOS DEL ESTABLECIMIENTO (NO SELECCIONABLE) -->
        <div class="info-section non-selectable">
            <div class="section-header-static">
                <div class="section-icon-static">
                    <ion-icon name="business"></ion-icon>
                </div>
                <h3>DATOS DEL ESTABLECIMIENTO</h3>
            </div>
            <div class="establishment-grid">
                <div class="establishment-info">
                    <table class="info-table">
                        <tr>
                            <td class="label">NOMBRE:</td>
                            <td>{{ institucionSeleccionada.nombreInstitucion }}</td>
                        </tr>
                        <tr>
                            <td class="label">PROVINCIA:</td>
                            <td>{{ institucionSeleccionada.nombreprovincia }}</td>
                        </tr>
                        <tr>
                            <td class="label">CIUDAD:</td>
                            <td>{{ institucionSeleccionada.nombre_ciudad }}</td>
                        </tr>
                        <tr>
                            <td class="label">PARROQUIA:</td>
                            <td>{{ institucionSeleccionada.parr_nombre }}</td>
                        </tr>
                        <tr>
                            <td class="label">DIRECCIÓN:</td>
                            <td>{{ institucionSeleccionada.direccionInstitucion }}</td>
                        </tr>
                        <tr>
                            <td class="label">TELÉFONO:</td>
                            <td>{{ institucionSeleccionada.telefonoInstitucion }}</td>
                        </tr>
                        <tr>
                            <td class="label">CORREO:</td>
                            <td>{{ institucionSeleccionada.email }}</td>
                        </tr>
                    </table>
                </div>
                <div class="establishment-info">
                    <table class="info-table">
                        <tr>
                            <td class="label">FECHA DE FUNDACIÓN:</td>
                            <td>{{ institucionSeleccionada.fecha_fundacion ? institucionSeleccionada.fecha_fundacion.split(' ')[0] : 'No registrada' }}</td>
                        </tr>
                        <tr>
                            <td class="label">TIPO INSTITUCIÓN:</td>
                            <td>{{ institucionSeleccionada.tipo_descripcion }}</td>
                        </tr>
                        <tr>
                            <td class="label">TRABAJA CON PROLIPA:</td>
                            <td>
                                <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                    {{ Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1 ? 'Sí' : 'No' }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1">
                            <td class="label">TIENE CONVENIO:</td>
                            <td>{{ Array_Fichero_Mercado_Cabecera[0].fm_convenio == 1 ? 'Sí' : 'No' }}</td>
                        </tr>
                        <tr v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1">
                            <td class="label">AÑOS CON PROLIPA:</td>
                            <td>{{ Array_Fichero_Mercado_Cabecera[0].fm_cantidad_anios_trabaja_con_prolipa || 0 }}</td>
                        </tr>
                        <tr>
                            <td class="label">TIPO DE VENTA:</td>
                            <td>
                                <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                    {{ Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta == '1' ? 'Venta Directa' : Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta == '2' ? 'Venta por lista' : 'No disponible' }}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="establishment-logo">
                    <img v-if="imagenEmpresa" :src="imagenEmpresa" alt="Logo Empresa" />
                    <span v-else class="no-logo">Sin logo</span>
                </div>
            </div>
        </div>

        <!-- SECCIÓN NUEVA: DATOS COMERCIALES -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.datos_comerciales}" @click="toggleSection('datos_comerciales')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.datos_comerciales}">
                        <ion-icon name="briefcase"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Datos comerciales de la institución o punto de venta</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.datos_comerciales ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <div class="establishment-info">
                    <table class="info-table">
                        <tr>
                            <td class="label">¿ES DISTRIBUIDOR?:</td>
                            <td>
                                <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                    {{ Array_Fichero_Mercado_Cabecera[0].fm_es_distribuidor == '1' ? 'Sí' : 'No' }}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="label">TRABAJA CON PROLIPA:</td>
                            <td>
                                <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                    {{ Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1 ? 'Sí' : 'No' }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1">
                            <td class="label">TIENE CONVENIO:</td>
                            <td>{{ Array_Fichero_Mercado_Cabecera[0].fm_convenio == 1 ? 'Sí' : 'No' }}</td>
                        </tr>
                        <tr v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1">
                            <td class="label">AÑOS CON PROLIPA:</td>
                            <td>{{ Array_Fichero_Mercado_Cabecera[0].fm_cantidad_anios_trabaja_con_prolipa || 0 }}</td>
                        </tr>
                        <tr>
                            <td class="label">TIPO DE VENTA:</td>
                            <td>
                                <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                    {{ Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta == '1' ? 'Venta Directa' : Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta == '2' ? 'Venta por lista' : 'No disponible' }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="ficheroData.fm_establecimientos_para_despacho && ficheroData.fm_establecimientos_para_despacho.length > 0">
                            <td class="label">ESTABLECIMIENTO(S) PARA DESPACHO:</td>
                            <td>
                                <div class="mt-2 grid gap-2">
                                    <div v-for="(inst, idx) in ficheroData.fm_establecimientos_para_despacho" :key="idx" class="p-2 border rounded border-gray-200">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="text-xs font-bold px-2 py-1 rounded-full" :class="inst.punto_venta == 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                                                {{ inst.punto_venta == 1 ? 'Punto de Venta' : 'Institución' }}
                                            </span>
                                            <span class="font-medium text-sm">{{ inst.nombreInstitucion }}</span>
                                        </div>
                                        <div v-if="inst.nombre" class="text-xs text-gray-500 flex items-center gap-1">
                                            <ion-icon name="location"></ion-icon> {{ inst.nombre }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else>
                            <td class="label">ESTABLECIMIENTO(S) PARA DESPACHO:</td>
                            <td><span class="text-gray-500 italic">No se han asignado establecimientos para despacho.</span></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- SECCIÓN 1: FACTORES QUE INCIDEN EN LA COMPRA -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.factores}" @click="toggleSection('factores')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.factores}">
                        <ion-icon name="analytics"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Factores que inciden en la compra</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.factores ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <div class="factores-grid">
                    <div v-for="(valor, clave) in ficheroData.factores_inciden_compra" :key="'pre-' + clave" class="factor-item">
                        <span v-if="valor" class="badge badge-success" style="padding: 4px 8px;">✅</span>
                        <span v-else class="badge badge-muted" style="padding: 4px 8px;">⬜️</span>
                        <span>{{ clave }}</span>
                    </div>
                    <div v-for="(item, index) in ficheroData.factores_inciden_compra_extra" :key="'extra-' + index" class="factor-item">
                        <span v-if="item.checked" class="badge badge-success" style="padding: 4px 8px;">✅</span>
                        <span v-else class="badge badge-muted" style="padding: 4px 8px;">⬜️</span>
                        <span>{{ item.nombre }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- PLANIFICACIÓN INSTITUCIONAL (NO SELECCIONABLE)
        <div class="info-section non-selectable">
            <div class="section-header-static">
                <div class="section-icon-static">
                    <ion-icon name="calendar"></ion-icon>
                </div>
                <h3>Planificación Institucional <small>(Datos obtenidos de tus planificaciones semanales)</small></h3>
            </div>

            <div class="section-content">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Acciones planificadas</th>
                            <th>Fechas y Usuarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(entrega, index) in array_Entrega_Muestras" :key="entrega.id">
                            <td>{{ entrega.title }}</td>
                            <td>{{ entrega.opciones_seleccionadas || '---' }}</td>
                            <td>
                                <div class="date-info">
                                    <div><strong>Creación:</strong> {{ entrega.created_at ? entrega.created_at.split(' ')[0] : '---' }} <span v-if="entrega.us_create_planificacion">({{ entrega.us_create_planificacion }})</span></div>
                                    <div><strong>Planificación:</strong> {{ entrega.startDate ? entrega.startDate.split(' ')[0] : '---' }}</div>
                                    <div><strong>Visita:</strong> {{ entrega.fecha_que_visita ? entrega.fecha_que_visita.split(' ')[0] : '---' }}</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="array_Entrega_Muestras.length === 0">
                            <td colspan="3" class="empty-state">
                                <ion-icon name="calendar-outline"></ion-icon>
                                <p>Aún no existen planificaciones</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> -->

        <!-- SECCIÓN 2: PERSONAL DEL PLANTEL -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.personal}" @click="toggleSection('personal')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.personal}">
                        <ion-icon name="people"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Personal del Plantel</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.personal ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Cargo</th>
                            <th>Información del Usuario</th>
                            <th>Decide la compra</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(usuario, index) in ficheroData.personalPlantel" :key="index">
                            <td><strong>{{ usuario.ina_nombre }}</strong></td>
                            <td>
                                <div class="user-info">
                                    <div><strong>Nombre:</strong> {{ usuario.nombre }}</div>
                                    <div><strong>Cédula:</strong> {{ usuario.cedula || 'Sin registro' }}</div>
                                    <div><strong>Teléfono:</strong> {{ usuario.telefono || '---' }}</div>
                                    <div><strong>Correo:</strong> {{ usuario.email || '---' }}</div>
                                    <div><strong>Fecha de nacimiento:</strong> {{ usuario.fecha_nacimiento || '---' }}</div>
                                </div>
                            </td>
                            <td class="text-center">
                                <span v-if="usuario.decideCompra" class="badge badge-success">
                                    <ion-icon name="checkmark-circle"></ion-icon> Sí
                                </span>
                                <span v-else class="badge badge-muted">
                                    <ion-icon name="close-circle"></ion-icon> No
                                </span>
                            </td>
                        </tr>
                        <tr v-if="ficheroData.personalPlantel.length === 0">
                            <td colspan="3" class="empty-state">
                                <div align="center">
                                    <ion-icon name="people-outline"></ion-icon>
                                    <p>No hay usuarios asignados</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- SECCIÓN 3: NÚMERO DE AULAS Y ESTUDIANTES -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.aulas}" @click="toggleSection('aulas')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.aulas}">
                        <ion-icon name="school"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Número de aulas y estudiantes</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.aulas ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <div class="table-scroll">
                    <table class="data-table niveles-table">
                        <thead>
                            <tr>
                                <th rowspan="1">Niveles Educativos</th>
                                <th colspan="2">INICIALES<br><small>(1–2)</small></th>
                                <th colspan="1">PREPARATORIA<br><small>(1)</small></th>
                                <th colspan="3">ELEMENTAL<br><small>(2–4)</small></th>
                                <th colspan="3">MEDIO<br><small>(5–7)</small></th>
                                <th colspan="3">SUPERIOR<br><small>(8–10)</small></th>
                                <th colspan="3">BACHILLERATO<br><small>(1BG–3BG)</small></th>
                            </tr>
                            <tr>
                                <th>Disponible y operativo en la institución</th>
                                <th colspan="2">
                                    <span v-if="ficheroData.Niveles_Educativos.iniciales" class="badge badge-success">✅ Sí</span>
                                    <span v-else class="badge badge-muted">⬜️ No</span>
                                </th>
                                <th colspan="1">
                                    <span v-if="ficheroData.Niveles_Educativos.preparatoria" class="badge badge-success">✅ Sí</span>
                                    <span v-else class="badge badge-muted">⬜️ No</span>
                                </th>
                                <th colspan="3">
                                    <span v-if="ficheroData.Niveles_Educativos.elemental" class="badge badge-success">✅ Sí</span>
                                    <span v-else class="badge badge-muted">⬜️ No</span>
                                </th>
                                <th colspan="3">
                                    <span v-if="ficheroData.Niveles_Educativos.medio" class="badge badge-success">✅ Sí</span>
                                    <span v-else class="badge badge-muted">⬜️ No</span>
                                </th>
                                <th colspan="3">
                                    <span v-if="ficheroData.Niveles_Educativos.superior" class="badge badge-success">✅ Sí</span>
                                    <span v-else class="badge badge-muted">⬜️ No</span>
                                </th>
                                <th colspan="3">
                                    <span v-if="ficheroData.Niveles_Educativos.bachillerato" class="badge badge-success">✅ Sí</span>
                                    <span v-else class="badge badge-muted">⬜️ No</span>
                                </th>
                            </tr>
                            <tr>
                                <th rowspan="1">GRADO</th>
                                <th v-for="nivel in array_Lista_Niveles" :key="nivel.idnivel">{{ nivel.nombrenivel }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>VALOR DE LA PENSIÓN</strong></td>
                                <td colspan="2">{{ ficheroData.valorPension && ficheroData.valorPension.iniciales ? "$" + ficheroData.valorPension.iniciales : '' }}</td>
                                <td colspan="1">{{ ficheroData.valorPension && ficheroData.valorPension.preparatoria ? "$" + ficheroData.valorPension.preparatoria : '' }}</td>
                                <td colspan="3">{{ ficheroData.valorPension && ficheroData.valorPension.elemental ? "$" + ficheroData.valorPension.elemental : '' }}</td>
                                <td colspan="3">{{ ficheroData.valorPension && ficheroData.valorPension.medio ? "$" + ficheroData.valorPension.medio : '' }}</td>
                                <td colspan="3">{{ ficheroData.valorPension && ficheroData.valorPension.superior ? "$" + ficheroData.valorPension.superior : '' }}</td>
                                <td colspan="3">{{ ficheroData.valorPension && ficheroData.valorPension.bachillerato ? "$" + ficheroData.valorPension.bachillerato : '' }}</td>
                            </tr>
                            <tr>
                                <td><strong># DE AULAS</strong></td>
                                <td v-for="n in 15" :key="`aulas-${n}`">{{ ficheroData.numeroAulas && ficheroData.numeroAulas['grado_' + n] ? ficheroData.numeroAulas['grado_' + n] : '' }}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>ESTUDIANTES POR AULA</strong>
                                    <div class="total-badge">Total: {{ Array_Fichero_Mercado_Cabecera.length > 0 ? Array_Fichero_Mercado_Cabecera[0].fm_SumaTotal_EstudiantesxAula : 0 }}</div>
                                </td>
                                <!-- El style height: 1px en el td es un truco CSS para que el hijo con h-full tome la altura de la fila entera -->
                                <td v-for="n in 15" :key="`estudiantes-${n}`" style="height: 1px;">
                                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                                        <div style="width: 100%;">
                                            <div v-if="ficheroData.numeroAulas && ficheroData.numeroAulas['grado_' + n] > 0" class="aulas-detail">
                                                <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="`grado-${n}-aula-${i}`">
                                                    <strong>Aula {{ i }}:</strong> {{ ficheroData.estudiantesPorAula && ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i] ? ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i] : 0 }}
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Footer siempre al final de la celda -->
                                        <div v-if="ficheroData.numeroAulas && ficheroData.numeroAulas['grado_' + n] > 0" style="width: 100%; padding-top: 5px; margin-top: 5px; border-top: 1px solid #eee; font-weight: bold; color: #1976d2; font-size: 12px; text-align: center;">
                                            Total: {{ getTotalEstudiantesPorGrado(n) }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="info-banner">
                    <ion-icon name="information-circle"></ion-icon>
                    <span>Cantidad real de estudiantes: <strong>{{ Array_Fichero_Mercado_Cabecera.length > 0 ? Array_Fichero_Mercado_Cabecera[0].fm_cantidad_real_estudiantes : 0 }}</strong></span>
                </div>
            </div>
        </div>

        <!-- SECCIÓN 4: EDITORIALES -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.editoriales}" @click="toggleSection('editoriales')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.editoriales}">
                        <ion-icon name="book"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Nombre de la/s editorial/es con la/s que trabaja/n</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.editoriales ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <div class="table-scroll">
                    <table class="data-table editoriales-table">
                        <thead>
                            <tr>
                                <th>Nombre del Libro / Área</th>
                                <th v-for="nivel in array_Lista_Niveles" :key="nivel.idnivel">{{ nivel.nombrenivel }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(area, index) in ficheroData.editoriales" :key="index">
                                <td><strong>{{ area.nombre }}</strong></td>
                                <td v-for="n in 15" :key="`${index}-${n}`">
                                    <span v-if="area.grados[`grado_${n}`]">
                                        {{ (() => {
                                            const editorialId = area.grados[`grado_${n}`];
                                            const editorial = array_Lista_Editoriales.find(e => e.edi_id === editorialId);
                                            return editorial ? editorial.edi_nombre : '';
                                        })() }}
                                    </span>
                                    <span v-else class="empty-cell">--</span>
                                </td>
                            </tr>
                            <tr v-if="ficheroData.editoriales.length === 0">
                                <td colspan="16" class="empty-state">
                                    <div align="center">
                                        <ion-icon name="book-outline"></ion-icon>
                                        <p>No hay libros o áreas registrados</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- SECCIÓN 5: BENEFICIARIOS -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.beneficiarios}" @click="toggleSection('beneficiarios')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.beneficiarios}">
                        <ion-icon name="cash"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Beneficiarios</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.beneficiarios ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Beneficiario</th>
                            <th>Comisión</th>
                            <th>Datos Bancarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(beneficiario, index) in Array_Fichero_Mercado_Beneficiarios" :key="index">
                            <td>
                                <div class="user-info">
                                    <div><strong>Nombre:</strong> {{ beneficiario.beneficiario_nombres }}</div>
                                    <div><strong>Cédula:</strong> {{ beneficiario.cedula || 'Sin registro' }}</div>
                                    <div><strong>Correo:</strong> {{ beneficiario.email || '---' }}</div>
                                </div>
                            </td>
                            <td class="text-center">
                                <strong>{{ beneficiario.comision }}%</strong>
                            </td>
                            <td>
                                <div class="user-info">
                                    <div><strong>Banco:</strong> {{ beneficiario.banco || '---' }}</div>
                                    <div><strong>N° Cuenta:</strong> {{ beneficiario.num_cuenta || '---' }}</div>
                                    <div><strong>Tipo:</strong> {{ beneficiario.tipo_cuenta || '---' }}</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="Array_Fichero_Mercado_Beneficiarios.length === 0">
                            <td colspan="3" class="empty-state">
                                <div align="center">
                                    <ion-icon name="cash-outline"></ion-icon>
                                    <p>No hay beneficiarios registrados</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- SECCIÓN 6: OBSERVACIÓN -->
        <div class="selectable-section" :class="{'selected': seleccionCopia.observacion}" @click="toggleSection('observacion')">
            <div class="section-header-selectable">
                <div class="section-left">
                    <div class="section-icon" :class="{'active': seleccionCopia.observacion}">
                        <ion-icon name="document-text"></ion-icon>
                    </div>
                    <div class="section-title">
                        <h3>Observación</h3>
                    </div>
                </div>
                <div class="section-indicator">
                    <ion-icon :name="seleccionCopia.observacion ? 'checkmark-circle' : 'radio-button-off'"></ion-icon>
                </div>
            </div>
            <div class="section-content">
                <div class="observation-content" v-if="Array_Fichero_Mercado_Cabecera.length && Array_Fichero_Mercado_Cabecera[0].fm_observacion">
                    <div class="observation-text">
                        {{ Array_Fichero_Mercado_Cabecera[0].fm_observacion }}
                    </div>
                </div>
                <div v-else class="empty-observation">
                    <ion-icon name="document-text-outline"></ion-icon>
                    <p>No se registró ninguna observación para este fichero</p>
                </div>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import {
    Spanish
} from "flatpickr/dist/l10n/es.js"; // Asegúrate de importar el locale
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from "vue-select";
import imprimirMixin from "@/mixins/Pedidosmix.js";
import * as XLSX from 'xlsx';
const Aprobacion_FicheroMercado = () => import("@/views/pedidos2/fichero_mercado/Aprobar_Fichero_Mercado.vue");
const Rechazar_FicheroMercado = () => import("@/views/pedidos2/fichero_mercado/Rechazar_Fichero_Mercado.vue");
const Enviar_para_aprobacion = () => import('@/views/pedidos2/fichero_mercado/Enviar_para_aprobacion.vue');
import {
    mapState
} from "vuex";
export default {
    mixins: [imprimirMixin],
    components: {
        "v-select": vSelect,
        flatPickr,
        Aprobacion_FicheroMercado,
        Rechazar_FicheroMercado,
        Enviar_para_aprobacion
    },
    data() {
        return {
            isrunLoading_metodoEjecucionGlobal: false,
            nombrearchivo_descarga: 'Fichero_Mercado',
            institucionSeleccionada: [],
            array_Lista_Editoriales: [],
            array_Lista_Niveles: [],
            array_Entrega_Muestras: [],
            Array_Fichero_Mercado_Cabecera: [],
            Array_Fichero_Mercado_Autoridades: [],
            Array_Fichero_Mercado_Detalle: [],
            Array_Fichero_Mercado_Beneficiarios: [],
            imagenEmpresa: null,
            ArrayEmpresas: [],
            empresaSeleccionada: null,
            tabFicheroMercado: {},
            ficheroData: {
                factores_inciden_compra: {
                    precio: false,
                    contenido: false,
                    pedagogia: false,
                    servicios: false
                },
                factores_inciden_compra_extra: [],
                personalPlantel: [],
                valorPension: {
                    iniciales: '',
                    preparatoria: '',
                    elemental: '',
                    medio: '',
                    superior: '',
                    bachillerato: '',
                },
                Niveles_Educativos: {
                    iniciales: false,
                    preparatoria: false,
                    elemental: false,
                    medio: false,
                    superior: false,
                    bachillerato: false,
                },
                numeroAulas: {},
                estudiantesPorAula: {},
                editoriales: [],
                fm_establecimientos_para_despacho: [],
            },
            seleccionCopia: {
                factores: false,
                personal: false,
                aulas: false,
                editoriales: false,
                beneficiarios: false,
                observacion: false,
                datos_comerciales: false
            }
        };
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted() {
        let me = this;
        me.metodoEjecucionGlobal();
    },
    props: {
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
        },
        wizardMode: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        seleccionCopia: {
            handler(val) {
                if (this.wizardMode) {
                    this.$emit('update:seleccion', val);
                }
            },
            deep: true
        }
    },
    methods: {
        finalizarCopiado() {
            this.$emit('change', {
                tipo: 'copiar',
                seleccion: this.seleccionCopia
            });
        },
        cancelarCopiado() {
            this.$emit('change', {
                tipo: 'cancelar'
            });
        },
        toggleSection(section) {
            this.seleccionCopia[section] = !this.seleccionCopia[section];
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
        async metodoEjecucionGlobal() {
            let me = this;
            try {
                me.isrunLoading_metodoEjecucionGlobal = true;
                me.$vs.loading();
                await me.cargarInformacionCompletaEstablecimiento();
                await me.getEditorialesActivasTodo();
                await me.getNivelesTodo();
                await me.getEntregaMuestrasTodo();
                await me.Todos_CargosAutoridades_Institucion();
                await me.getTraer_Datos_Fichero_x_fmd_id();
                await me.getTraer_Datos_Fichero_Autoridades_x_fmd_id();
                await me.getTraer_Datos_Fichero_Detalle_x_fmd_id();
                await me.TodasEmpresas();
                await me.getListar_Beneficiarios_por_insitucion_y_periodo();
                await me.conversionJSON_factores_inciden_compra();
                await me.conversionJSON_niveles_educativos();
                await me.consersionJSON_personalPlantel();
                await me.consersionJSON_valorPension();
                await me.consersionJSON_numeroAulas();
                await me.consersionJSON_estudiantesPorAula();
                await me.consersionJSON_editoriales();
                await me.getInstitucionesParaDespacho();
                me.isrunLoading_metodoEjecucionGlobal = false
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoEjecucionGlobal:', error);
                me.$vs.loading.close();
            }
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
        async getEditorialesActivasTodo() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Editoriales_Todo_Fichero'
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
        async getNivelesTodo() {
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
                        console.error('Error al buscar niveles:', error);
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
        async getInstitucionesParaDespacho() {
            return new Promise((resolve) => {
                try {
                    if (this.Array_Fichero_Mercado_Cabecera.length == 0) { resolve(); return; }
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
        async getEntregaMuestrasTodo() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Fechas_Entrega_muestras_x_institucion',
                    institucion_id: this.institucion_Enviar.idInstitucion,
                    periodo_id: this.periodoSeleccionado.idperiodoescolar
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
                        reject("getEntregaMuestrasTodo", error);
                    });
            });
        },
        async Todos_CargosAutoridades_Institucion() {
            // console.log(this.institucionSeleccionada.idInstitucion, "sssss");
            // return
            return new Promise((resolve, reject) => {
                let params = {
                    action: "CargosAutoridadesInstitucion_Todo_Fichero",
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
        async getTraer_Datos_Fichero_x_fmd_id() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Busqueda_getTraer_Datos_Fichero_x_fmd_id',
                    fm_id: this.Fichero_Array[0].fm_id
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        this.Array_Fichero_Mercado_Cabecera = response.data;
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
                        reject("getTraer_Datos_Fichero_x_fmd_id", error);
                    });
            });
        },
        async getTraer_Datos_Fichero_Autoridades_x_fmd_id() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Busqueda_getTraer_Datos_Fichero_Autoridades_x_fmd_id',
                    fm_id: this.Fichero_Array[0].fm_id
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        this.Array_Fichero_Mercado_Autoridades = response.data;
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
                        reject("getTraer_Datos_Fichero_Autoridades_x_fmd_id", error);
                    });
            });
        },
        async getTraer_Datos_Fichero_Detalle_x_fmd_id() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Busqueda_getTraer_Datos_Fichero_Detalle_x_fmd_id',
                    fm_id: this.Fichero_Array[0].fm_id
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
        async consersionJSON_personalPlantel() {
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
                            cedula: item.cedula || '',
                            telefono: item.telefono || '',
                            email: item.email || '',
                            ina_nombre: item.ina_nombre || '',
                            fecha_nacimiento: item.fecha_nacimiento || '',
                            decideCompra: decideValue // ✅ Se marca el switch según fm_decide_compra
                        };
                    });
                    resolve();
                } catch (e) {
                    console.error("Error al parsear fm_cantidad_estudiantes_x_aula_completo:", e);
                    reject("consersionJSON_personalPlantel", e);
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
        async consersionJSON_editoriales() {
            let me = this;
            return new Promise((resolve, reject) => {
                try {
                    // Inicializamos el array de editoriales en ficheroData
                    this.ficheroData.editoriales = [];

                    // Recorremos cada item recibido de la API
                    this.Array_Fichero_Mercado_Detalle.forEach(item => {
                        const nivelesAPI = JSON.parse(item.fmd_niveles_editoriales || '[]');

                        // Inicializamos objeto para los select por nivel
                        const grados = {};

                        // Recorremos los niveles de la tabla
                        this.array_Lista_Niveles.forEach((nivelTabla, index) => {
                            // Buscamos coincidencia de idnivel
                            const nivelEncontrado = nivelesAPI.find(n => n.idnivel === nivelTabla.idnivel);
                            // Asignamos editorialesSeleccionadas o null
                            grados[`grado_${index + 1}`] = nivelEncontrado ? nivelEncontrado.editorialesSeleccionadas : null;
                        });

                        // Agregamos al array de editoriales
                        this.ficheroData.editoriales.push({
                            fmd_id: item.fmd_id,
                            nombre: item.fmd_nombre_libro,
                            grados
                        });
                    });

                    resolve();
                } catch (e) {
                    console.error("Error al parsear editoriales:", e);
                    this.ficheroData.editoriales = [];
                    reject("consersionJSON_editoriales", e);
                }
            });
        },
        async TodasEmpresas() {
            return new Promise((resolve, reject) => {
                let me = this;
                me.$http.get(me.$server_url + 'empresa')
                    .then(res => {
                        // Guardamos todas las empresas
                        me.ArrayEmpresas = res.data;

                        // Filtramos la empresa que coincide con el id_logo_empresa del fichero
                        const idLogo = me.Array_Fichero_Mercado_Cabecera[0].id_logo_empresa;
                        me.empresaSeleccionada = me.ArrayEmpresas.find(emp => emp.id == idLogo) || null;

                        if (!me.empresaSeleccionada) {
                            // me.$vs.notify({
                            //     text: "No se ha configurado la empresa",
                            //     color: 'danger',
                            //     iconPack: 'feather',
                            //     icon: 'icon-alert-circle',
                            //     time: 2000
                            // });
                            console.log("No se ha configurado la empresa");
                        } else {
                            // Guardamos la imagen base64 para el render
                            me.imagenEmpresa = me.empresaSeleccionada.img_base64;
                        }

                        resolve();
                    })
                    .catch((e) => {
                        console.log(e);
                        reject("TodasEmpresas", e);
                    });
            });
        },
        async getListar_Beneficiarios_por_insitucion_y_periodo() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Listar_Beneficiarios_por_insitucion_y_periodo',
                    institucion_id: this.institucion_Enviar.idInstitucion,
                    periodo_id: this.periodoSeleccionado.idperiodoescolar
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (this.isrunLoading_metodoEjecucionGlobal == false) {
                            this.$vs.loading.close();
                        }
                        if (response.data) {
                            this.Array_Fichero_Mercado_Beneficiarios = response.data;
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
                        console.error('Error al buscar beneficiarios:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getListar_Beneficiarios_por_insitucion_y_periodo", error);
                    });
            });
        },
    },
};
</script>

<style scoped>
/* CONTAINER PRINCIPAL */
.fichero-visualizer {
    background: #f8f9fa;
    min-height: 100vh;
    padding: 20px;
}

.fichero-visualizer.dark-mode {
    background: #1a1a2e;
}

/* INSTRUCCIONES */
.selection-instructions {
    background: white;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: slideDown 0.4s ease-out;
}

.dark-mode .selection-instructions {
    background: #16213e;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.instruction-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.instruction-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
}

.instruction-text h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 700;
    color: #2d3748;
}

.dark-mode .instruction-text h3 {
    color: #f7fafc;
}

.instruction-text p {
    margin: 0;
    font-size: 14px;
    color: #718096;
}

.dark-mode .instruction-text p {
    color: #a0aec0;
}

.action-buttons-top {
    display: flex;
    gap: 12px;
}

/* CONTADOR */
.selection-counter {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border-radius: 0 0 12px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    animation: slideDown 0.5s ease-out 0.1s backwards;

    /* Sticky properties */
    position: sticky;
    top: 0;
    z-index: 100;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    backdrop-filter: blur(5px);
    opacity: 0.95;
}

.selection-counter:hover {
    opacity: 1;
}

.selection-counter ion-icon {
    font-size: 24px;
}

/* CARD PRINCIPAL */
.fichero-card {
    animation: fadeIn 0.6s ease-out 0.2s backwards;
}

.fichero-title {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    color: white;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    margin: -24px -24px 24px -24px;
}

.fichero-title h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
}

.fichero-title span {
    color: #fbbf24;
}

/* SECCIONES NO SELECCIONABLES */
.info-section.non-selectable {
    margin-bottom: 24px;
    background: #f7fafc;
    border-radius: 12px;
    padding: 20px;
    border: 2px solid #e2e8f0;
}

.dark-mode .info-section.non-selectable {
    background: #1e1e2e;
    border-color: #2d3748;
}

.section-header-static {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e2e8f0;
}

.dark-mode .section-header-static {
    border-bottom-color: #2d3748;
}

.section-icon-static {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
}

.section-header-static h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #2d3748;
    flex: 1;
}

.dark-mode .section-header-static h3 {
    color: #f7fafc;
}

.section-header-static small {
    font-size: 12px;
    font-weight: 400;
    color: #718096;
}

/* ESTABLISHMENT GRID */
.establishment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 24px;
}

@media (max-width: 1024px) {
    .establishment-grid {
        grid-template-columns: 1fr;
    }
}

.establishment-info .info-table {
    width: 100%;
    font-size: 14px;
}

.establishment-info .info-table tr {
    border-bottom: 1px solid #e2e8f0;
}

.dark-mode .establishment-info .info-table tr {
    border-bottom-color: #2d3748;
}

.establishment-info .info-table td {
    padding: 8px 4px;
}

.establishment-info .info-table td.label {
    font-weight: 700;
    color: #4a5568;
    width: 40%;
}

.dark-mode .establishment-info .info-table td.label {
    color: #a0aec0;
}

.establishment-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: white;
    border-radius: 12px;
    border: 2px dashed #cbd5e0;
}

.dark-mode .establishment-logo {
    background: #2d3748;
    border-color: #4a5568;
}

.establishment-logo img {
    max-width: 150px;
    max-height: 150px;
    object-fit: contain;
}

.establishment-logo .no-logo {
    color: #a0aec0;
    font-style: italic;
}

/* SECCIONES SELECCIONABLES */
.selectable-section {
    margin-bottom: 24px;
    background: white;
    border-radius: 12px;
    border: 3px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.5s ease-out backwards;
    cursor: pointer;
}

.selectable-section * {
    cursor: pointer;
}

.selectable-section:nth-child(3) {
    animation-delay: 0.1s;
}

.selectable-section:nth-child(5) {
    animation-delay: 0.2s;
}

.selectable-section:nth-child(6) {
    animation-delay: 0.3s;
}

.selectable-section:nth-child(7) {
    animation-delay: 0.4s;
}

.selectable-section:nth-child(8) {
    animation-delay: 0.5s;
}

.dark-mode .selectable-section {
    background: #1e1e2e;
    border-color: #2d3748;
}

.selectable-section:hover {
    border-color: #cbd5e0;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.dark-mode .selectable-section:hover {
    border-color: #4a5568;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.selectable-section.selected {
    border-color: #667eea;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
}

.dark-mode .selectable-section.selected {
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* HEADER SELECCIONABLE */
.section-header-selectable {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #f7fafc;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.section-header-selectable * {
    cursor: pointer;
}

.dark-mode .section-header-selectable {
    background: #2d3748;
}

.selectable-section:hover .section-header-selectable {
    background: #edf2f7;
}

.dark-mode .selectable-section:hover .section-header-selectable {
    background: #374151;
}

.selectable-section.selected .section-header-selectable {
    background: linear-gradient(135deg, #f0f4ff 0%, #e6efff 100%);
}

.dark-mode .selectable-section.selected .section-header-selectable {
    background: linear-gradient(135deg, #2d3748 0%, #1e293b 100%);
}

.section-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.section-checkbox {
    flex-shrink: 0;
}

.section-icon {
    width: 56px;
    height: 56px;
    background: #e2e8f0;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #718096;
    transition: all 0.3s ease;
}

.dark-mode .section-icon {
    background: #1a202c;
    color: #a0aec0;
}

.section-icon.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.section-title h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 700;
    color: #2d3748;
}

.dark-mode .section-title h3 {
    color: #f7fafc;
}

.section-count {
    font-size: 13px;
    color: #718096;
    font-weight: 500;
}

.dark-mode .section-count {
    color: #a0aec0;
}

.section-indicator {
    font-size: 32px;
    color: #cbd5e0;
    transition: all 0.3s ease;
}

.selectable-section.selected .section-indicator {
    color: #667eea;
    transform: scale(1.1);
}

/* CONTENIDO DE SECCIÓN */
.section-content {
    padding: 24px;
}

/* FACTORES GRID */
.factores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.factor-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #f7fafc;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
}

.dark-mode .factor-item {
    background: #2d3748;
    color: #e2e8f0;
}

.factor-item ion-icon {
    font-size: 20px;
}

.factor-item ion-icon.active {
    color: #48bb78;
}

.factor-item ion-icon.inactive {
    color: #cbd5e0;
}

/* TABLAS DE DATOS */
.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.data-table thead {
    background: #edf2f7;
}

.dark-mode .data-table thead {
    background: #2d3748;
}

.data-table th {
    padding: 12px;
    text-align: left;
    font-weight: 700;
    color: #2d3748;
    border: 1px solid #e2e8f0;
}

.dark-mode .data-table th {
    color: #f7fafc;
    border-color: #4a5568;
}

.data-table td {
    padding: 12px;
    border: 1px solid #e2e8f0;
    color: #4a5568;
}

.dark-mode .data-table td {
    border-color: #4a5568;
    color: #cbd5e0;
}

.data-table tbody tr:hover {
    background: #f7fafc;
}

.dark-mode .data-table tbody tr:hover {
    background: #374151;
}

.data-table .text-center {
    text-align: center;
}

/* USER INFO */
.user-info div {
    margin-bottom: 4px;
    font-size: 13px;
}

.user-info strong {
    color: #2d3748;
    margin-right: 4px;
}

.dark-mode .user-info strong {
    color: #a0aec0;
}

/* DATE INFO */
.date-info div {
    margin-bottom: 4px;
    font-size: 13px;
}

.date-info strong {
    color: #2d3748;
}

.dark-mode .date-info strong {
    color: #a0aec0;
}

/* BADGES */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
}

.badge ion-icon {
    font-size: 16px;
}

.badge-success {
    background: #c6f6d5;
    color: #22543d;
}

.dark-mode .badge-success {
    background: #22543d;
    color: #c6f6d5;
}

.badge-muted {
    background: #e2e8f0;
    color: #718096;
}

.dark-mode .badge-muted {
    background: #4a5568;
    color: #cbd5e0;
}

/* TABLE SCROLL */
.table-scroll {
    overflow-x: auto;
    margin-bottom: 16px;
}

.niveles-table,
.editoriales-table {
    min-width: 1200px;
}

.niveles-table th,
.niveles-table td {
    text-align: center;
    min-width: 80px;
}

.niveles-table th:first-child,
.niveles-table td:first-child {
    text-align: left;
    min-width: 180px;
    position: sticky;
    left: 0;
    background: #edf2f7;
    z-index: 1;
}

.dark-mode .niveles-table th:first-child,
.dark-mode .niveles-table td:first-child {
    background: #2d3748;
}

.total-badge {
    margin-top: 8px;
    padding: 4px 8px;
    background: #667eea;
    color: white;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
}

.aulas-detail {
    font-size: 12px;
}

.aulas-detail div {
    margin-bottom: 4px;
}

.editoriales-table th:first-child,
.editoriales-table td:first-child {
    text-align: left;
    min-width: 220px;
    position: sticky;
    left: 0;
    background: #edf2f7;
    z-index: 1;
}

.dark-mode .editoriales-table th:first-child,
.dark-mode .editoriales-table td:first-child {
    background: #2d3748;
}

.empty-cell {
    color: #cbd5e0;
}

/* INFO BANNER */
.info-banner {
    background: linear-gradient(135deg, #ebf4ff 0%, #dbeafe 100%);
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #1e40af;
    font-weight: 600;
}

.dark-mode .info-banner {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: #dbeafe;
}

.info-banner ion-icon {
    font-size: 20px;
}

/* OBSERVATION CONTENT */
.observation-content {
    padding: 16px;
    background: #f7fafc;
    border-radius: 8px;
    min-height: 100px;
}

.dark-mode .observation-content {
    background: #2d3748;
}

.observation-text {
    font-size: 14px;
    line-height: 1.6;
    color: #4a5568;
    white-space: pre-wrap;
}

.dark-mode .observation-text {
    color: #cbd5e0;
}

.empty-observation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 32px;
    color: #4a5568;
}

.empty-observation ion-icon {
    font-size: 48px;
}

.empty-observation p {
    margin: 0;
    font-style: italic;
}

/* EMPTY STATE */
.empty-state {
    text-align: center;
    padding: 32px !important;
    color: #a0aec0;
}

.empty-state ion-icon {
    font-size: 48px;
    margin-bottom: 12px;
    display: block;
}

.empty-state p {
    margin: 0;
    font-style: italic;
}

/* ANIMATIONS */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* LEGACY STYLES */
.stylevalidarinput {
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.estilo-borde {
    border: 2px solid #007bff;
    border-radius: 8px;
    padding: 16px;
    margin-top: 2px;
}

.texto-claro {
    color: #333;
    font-size: 14px;
}

.botones-reporte {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.botones-reporte .vs-button {
    flex: 0 0 30%;
}

.informacionformhijodehijo {
    z-index: 51002;
}
</style>
