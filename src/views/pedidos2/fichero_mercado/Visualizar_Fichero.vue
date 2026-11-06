<template>
<div>
    <div class="botones-reporte">
        <vs-button color="dark" type="line" icon-pack="feather" icon="icon-printer" @click="m_imprimirTodos('12px', nombrearchivo_descarga, '0px', '', 'landscape')">
            Descargar Fichero Pdf
        </vs-button>
    </div>
    <vx-card id="seccionImprimir2" align="center" style="font-family: Arial, sans-serif; color: #222;">
        <table border="1" width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; border: 1px solid #000;">
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; font-weight: bold; font-size: 18px; background-color: #f5f5f5 !important; -webkit-print-color-adjust: exact;  padding: 10px;">
                    FICHERO DE MERCADO <span style="text-transform: uppercase;">{{ periodoSeleccionado.descripcion_periodoescolar }}</span>
                </td>
            </tr>
            <tr>
                <td align="center" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;">DATOS DEL ESTABLECIMIENTO</td>
                <td rowspan="2" align="center" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;">
                    <img v-if="imagenEmpresa" :src="imagenEmpresa" alt="Logo Empresa" width="150" style="max-height: 150px;" />
                    <span v-else>No hay logo</span>
                </td>
            </tr>
            <!-- {{ institucionSeleccionada }} -->
            <tr>
                <td align="center" style="border: 1px solid #000; padding: 12px;">
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <!-- Tabla izquierda -->
                        <table width="50%" style="border: none; font-size: 14px; line-height: 1.5;">
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">NOMBRE:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.nombreInstitucion }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">PROVINCIA:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.nombreprovincia }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">CIUDAD:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.nombre_ciudad }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">PARROQUIA:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.parr_nombre }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">DIRECCIÓN:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.direccionInstitucion }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">TELÉFONO:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.telefonoInstitucion }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">CORREO:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.email }}</td>
                            </tr>
                        </table>
                        <!-- Tabla derecha -->
                        <table width="50%" style="border: none; font-size: 14px; line-height: 1.5;">
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">FECHA DE FUNDACIÓN:</td>
                                <td style="text-align: left;">
                                    {{ institucionSeleccionada.fecha_fundacion ? institucionSeleccionada.fecha_fundacion.split(' ')[0] : 'No registrada' }}
                                </td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">SOSTENIMIENTO:</td>
                                <td style="text-align: left;">{{ institucionSeleccionada.tipo_descripcion }}</td>
                            </tr>
                            <!-- <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">FORMA DE COMERCIALIZACIÓN:</td>
                                <td style="text-align: left;">
                                    <span v-if="institucionSeleccionada.punto_venta == 1">Punto de Venta o Librería</span>
                                    <span v-else-if="institucionSeleccionada.punto_venta == 0">Plantel</span>
                                </td>
                            </tr> -->
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">TRABAJA CON PROLIPA:</td>
                                <td style="text-align: left;">
                                    <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                        {{ Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1 ? 'Sí' : 'No' }}
                                    </span>
                                    <span v-else>No disponible</span>
                                </td>
                            </tr>
                            <tr v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1">
                                <td align="right" style="font-weight: bold; padding-right: 5px;">TIENE CONVENIO:</td>
                                <td style="text-align: left;">
                                    <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                        {{ Array_Fichero_Mercado_Cabecera[0].fm_convenio == 1 ? 'Sí' : 'No' }}
                                    </span>
                                    <span v-else>No disponible</span>
                                </td>
                            </tr>
                            <tr v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].fm_trabaja_con_prolipa == 1">
                                <td align="right" style="font-weight: bold; padding-right: 5px;">CANTIDAD AÑOS QUE TRABAJA CON PROLIPA:</td>
                                <td style="text-align: left;">{{ Array_Fichero_Mercado_Cabecera[0].fm_cantidad_anios_trabaja_con_prolipa || 0 }}</td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">TIPO DE VENTA:</td>
                                <td style="text-align: left;">
                                    <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                        {{
                                            Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta == '1' ? 'Venta Directa'
                                            : Array_Fichero_Mercado_Cabecera[0].fm_tipo_venta == '2' ? 'Venta por lista'
                                            : 'No disponible'
                                        }}
                                    </span>
                                    <span v-else>No disponible</span>
                                </td>
                            </tr>
                            <tr>
                                <td align="right" style="font-weight: bold; padding-right: 5px;">¿ES DISTRIBUIDOR?:</td>
                                <td style="text-align: left;">
                                    <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                        {{ Array_Fichero_Mercado_Cabecera[0].fm_es_distribuidor == '1' ? 'Sí' : 'No' }}
                                    </span>
                                    <span v-else>No disponible</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            <!-- Puntos de despacho -->
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Establecimiento/s para despacho
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <table v-if="Array_Fichero_Mercado_Cabecera.length > 0 && Array_Fichero_Mercado_Cabecera[0].establecimientos_despacho && Array_Fichero_Mercado_Cabecera[0].establecimientos_despacho.length > 0" width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 14px; border: 1px solid #ccc;">
                        <thead style="background-color: #f5f5f5 !important;-webkit-print-color-adjust: exact;">
                            <tr>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: center; padding: 6px;">#</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Establecimiento</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Asesor</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Ubicación</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: center; padding: 6px;">Punto de Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(pdespacho, index) in Array_Fichero_Mercado_Cabecera[0].establecimientos_despacho" :key="pdespacho.idInstitucion">
                                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">{{ index + 1 }}</td>
                                <td style="border: 1px solid #ccc; padding: 6px;">{{ pdespacho.nombreInstitucion }}</td>
                                <td style="border: 1px solid #ccc; padding: 6px;">{{ pdespacho.asesor_nombre || '---' }}</td>
                                <td style="border: 1px solid #ccc; padding: 6px;">
                                    <div><b>Provincia:</b> {{ pdespacho.nombreprovincia || '---' }}</div>
                                    <div><b>Ciudad:</b> {{ pdespacho.nombre_ciudad || '---' }}</div>
                                    <div><b>Parroquia:</b> {{ pdespacho.parr_nombre || '---' }}</div>
                                </td>
                                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="pdespacho.punto_venta == 1">Sí</span>
                                    <span v-else>No</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else style="color: #777; font-style: italic; text-align: center; padding: 8px; width: 100%;">
                        No se han asignado establecimiento/s de despacho.
                    </div>
                </td>
            </tr>
            <!-- Factores que inciden en la compra -->
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Factores que inciden en la compra:
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; font-size: 14px;">
                            <!-- Factores predefinidos -->
                            <div v-for="(valor, clave) in ficheroData.factores_inciden_compra" :key="'pre-' + clave" style="display: flex; align-items: center; margin-right: 10px;">
                                <span v-if="valor" style="font-weight: bold; color: green; margin-right: 5px;">✅</span>
                                <span v-else style="color: #ccc; margin-right: 5px;">⬜️</span>
                                <span style="text-transform: capitalize;">{{ clave }}</span>
                            </div>

                            <!-- Factores agregados por usuario -->
                            <div v-for="(item, index) in ficheroData.factores_inciden_compra_extra" :key="'extra-' + index" style="display: flex; align-items: center; margin-right: 10px;">
                                <span v-if="item.checked" style="font-weight: bold; color: green; margin-right: 5px;">✅</span>
                                <span v-else style="color: #ccc; margin-right: 5px;">⬜️</span>
                                <span>{{ item.nombre }}</span>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <!-- Entrega de muestras -->
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Planificación Institucional <small>(Datos obtenidos de tus planificaciones semanales)</small>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 14px; border: 1px solid #ccc;">
                        <thead style="background-color: #f5f5f5 !important;-webkit-print-color-adjust: exact;">
                            <tr>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Título</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Acciones planificadas</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Fechas y Usuarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(entrega, index) in array_Entrega_Muestras" :key="entrega.id">
                                <td style="border: 1px solid #ccc; padding: 6px;">{{ entrega.title }}</td>
                                <td style="border: 1px solid #ccc; padding: 6px;">
                                    <span v-if="entrega.opciones_seleccionadas && entrega.opciones_seleccionadas.length">
                                        {{ entrega.opciones_seleccionadas }}
                                    </span>
                                    <span v-else>
                                        ---
                                    </span>
                                </td>
                                <td style="border: 1px solid #ccc; padding: 6px;">
                                    <div><b>Fecha y usuario de creación:</b> {{ entrega.created_at ? entrega.created_at.split(' ')[0] : '---' }} <span v-if="entrega.us_create_planificacion">({{ entrega.us_create_planificacion }})</span></div>
                                    <div><b>Fecha seleccionada de la planificación:</b> {{ entrega.startDate ? entrega.startDate.split(' ')[0] : '---' }} <span v-if="entrega.hora_inicio && entrega.hora_fin">({{ entrega.hora_inicio }} - {{ entrega.hora_fin }})</span></div>
                                    <div><b>Fecha que visitó:</b> {{ entrega.fecha_que_visita ? entrega.fecha_que_visita.split(' ')[0] : '---' }}</div>
                                    <div><b>Fecha y usuario de finalización:</b> {{ entrega.fecha_captura_longitud_fin ? entrega.fecha_captura_longitud_fin.split(' ')[0] : '---' }} <span v-if="entrega.us_finalizo_planificacion">({{ entrega.us_finalizo_planificacion }})</span></div>
                                </td>
                            </tr>
                            <tr v-if="array_Entrega_Muestras.length === 0">
                                <td colspan="3" align="center" style="border: 1px solid #ccc; color: #777; font-style: italic; padding: 8px;">
                                    Aún no existen planificaciones. Regístrelas en el módulo de planificaciones para que se muestren aquí.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Personal del Plantel
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 14px; border: 1px solid #ccc;">
                        <thead style="background-color: #f5f5f5 !important;-webkit-print-color-adjust: exact;">
                            <tr>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Cargo</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Información del Usuario</th>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: center; padding: 6px;">Decide la compra</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Si hay usuarios -->
                            <tr v-for="(usuario, index) in ficheroData.personalPlantel" :key="index">
                                <td style="border: 1px solid #ccc; padding: 6px;">
                                    {{ usuario.ina_nombre }}
                                </td>
                                <td style="border: 1px solid #ccc; padding: 6px;">
                                    <div><strong>Nombres y Apellidos:</strong> {{ usuario.nombre }}</div>
                                    <div>
                                        <strong>Cédula:</strong>
                                        <span v-if="usuario.cedula">{{ usuario.cedula }}</span>
                                        <span v-else style="color: red; font-style: italic;">(Sin registro)</span>
                                    </div>
                                    <div><strong>Teléfono:</strong> {{ usuario.telefono || '---' }}</div>
                                    <div><strong>Correo:</strong> {{ usuario.email || '---' }}</div>
                                    <div><strong>Fecha de nacimiento:</strong> {{ usuario.fecha_nacimiento || '---' }}</div>
                                </td>
                                <td style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="usuario.decideCompra" style="color: green; font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </td>
                            </tr>
                            <!-- Si no hay usuarios -->
                            <tr v-if="ficheroData.personalPlantel.length === 0">
                                <td colspan="3" align="center" style="border: 1px solid #ccc; color: #777; font-style: italic; padding: 8px;">
                                    No hay usuarios asignados al plantel aún.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Número de aulas y estudiantes
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; font-size: 14px; border: 1px solid #ccc;">
                        <thead style="background-color: #f5f5f5 !important;-webkit-print-color-adjust: exact;">
                            <tr>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Niveles Educativos</th>
                                <th colspan="2" style="border: 1px solid #ccc; text-align: center; font-weight: bold; padding: 6px;">
                                    INICIALES<br /><small>(1–2)</small>
                                </th>
                                <th colspan="1" style="border: 1px solid #ccc; text-align: center; font-weight: bold; padding: 6px;">
                                    PREPARATORIA<br /><small>(1)</small>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; font-weight: bold; padding: 6px;">
                                    ELEMENTAL<br /><small>(2–4)</small>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; font-weight: bold; padding: 6px;">
                                    MEDIO<br /><small>(5–7)</small>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; font-weight: bold; padding: 6px;">
                                    SUPERIOR<br /><small>(8–10)</small>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; font-weight: bold; padding: 6px;">
                                    BACHILLERATO<br /><small>(1BG–3BG)</small>
                                </th>
                            </tr>
                            <tr>
                                <th style="border: 1px solid #ccc; padding: 6px;">Disponible y operativo en la institución</th>
                                <th colspan="2" style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="ficheroData.Niveles_Educativos.iniciales" style="font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </th>
                                <th colspan="1" style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="ficheroData.Niveles_Educativos.preparatoria" style="font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="ficheroData.Niveles_Educativos.elemental" style="font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="ficheroData.Niveles_Educativos.medio" style="font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="ficheroData.Niveles_Educativos.superior" style="font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </th>
                                <th colspan="3" style="border: 1px solid #ccc; text-align: center; padding: 6px;">
                                    <span v-if="ficheroData.Niveles_Educativos.bachillerato" style="font-weight: bold;">✅ Sí</span>
                                    <span v-else style="color: #999;">⬜️ No</span>
                                </th>
                            </tr>
                            <tr>
                                <th style="border: 1px solid #ccc; font-weight: bold; text-align: left; padding: 6px;">Grado</th>
                                <th v-for="nivel in array_Lista_Niveles" :key="nivel.idnivel" style="border: 1px solid #ccc; font-weight: bold; text-align: center; padding: 6px;">
                                    {{ nivel.nombrenivel }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- VALOR DE LA PENSIÓN -->
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 6px;">VALOR DE LA PENSIÓN</td>
                                <td colspan="2" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.valorPension && ficheroData.valorPension.iniciales">${{ ficheroData.valorPension.iniciales }}</span>
                                </td>
                                <td colspan="1" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.valorPension && ficheroData.valorPension.preparatoria">${{ ficheroData.valorPension.preparatoria }}</span>
                                </td>
                                <td colspan="3" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.valorPension && ficheroData.valorPension.elemental">${{ ficheroData.valorPension.elemental }}</span>
                                </td>
                                <td colspan="3" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.valorPension && ficheroData.valorPension.medio">${{ ficheroData.valorPension.medio }}</span>
                                </td>
                                <td colspan="3" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.valorPension && ficheroData.valorPension.superior">${{ ficheroData.valorPension.superior }}</span>
                                </td>
                                <td colspan="3" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.valorPension && ficheroData.valorPension.bachillerato">${{ ficheroData.valorPension.bachillerato }}</span>
                                </td>
                            </tr>

                            <!-- # DE AULAS -->
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 6px;"># DE AULAS</td>
                                <td v-for="n in 15" :key="`aulas-${n}`" style="border: 1px solid #ccc; padding: 6px; text-align: center;">
                                    <span v-if="ficheroData.numeroAulas && ficheroData.numeroAulas['grado_' + n]">{{ ficheroData.numeroAulas['grado_' + n] }}</span>
                                </td>
                            </tr>

                            <!-- ESTUDIANTES POR AULA -->
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 6px;">
                                    ESTUDIANTES POR AULA
                                    <div class="mt-1 font-bold text-blue-700" align="center">
                                        <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                            Total: {{ Array_Fichero_Mercado_Cabecera[0].fm_SumaTotal_EstudiantesxAula }}
                                        </span>
                                        <span v-else>
                                            Total: 0
                                        </span>
                                    </div>
                                </td>
                                <!-- El style height: 1px en el td es un truco CSS para que el hijo con h-full tome la altura de la fila entera -->
                                <td v-for="n in 15" :key="`estudiantes-${n}`" style="border: 1px solid #ccc; padding: 0; text-align: center; height: 1px;">
                                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                                        <div style="padding: 6px;">
                                            <div v-if="ficheroData.numeroAulas && ficheroData.numeroAulas['grado_' + n] > 0">
                                                <div v-for="i in ficheroData.numeroAulas['grado_' + n]" :key="`grado-${n}-aula-${i}`" style="margin-bottom: 2px;">
                                                    <span v-if="ficheroData.estudiantesPorAula && ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i] !== undefined">
                                                        <b>Aula {{ i }}</b>: {{ ficheroData.estudiantesPorAula['grado_' + n + '_aula_' + i] }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div v-else style="color: #999; font-style: italic; font-size: 12px; text-align: center;">
                                                -
                                            </div>
                                        </div>
                                        <!-- Footer siempre al final de la celda -->
                                        <div v-if="ficheroData.numeroAulas && ficheroData.numeroAulas['grado_' + n] > 0" style="width: 100%; padding: 4px; border-top: 1px solid #ccc; background-color: #fafafa; font-weight: bold; font-size: 12px; text-align: center;">
                                            Total Est.: {{ getTotalEstudiantesPorGrado(n) }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <!-- FILA DE REFERENCIA DEL MINISTERIO (elegante) -->
                            <tr>
                                <td colspan="16" style="border: 1px solid #999; padding: 10px; background-color: #fafafa !important;-webkit-print-color-adjust: exact; text-align: center; font-weight: bold;">
                                    <div>
                                        Cantidad real de estudiantes:
                                        <span v-if="Array_Fichero_Mercado_Cabecera.length > 0">
                                            {{ Array_Fichero_Mercado_Cabecera[0].fm_cantidad_real_estudiantes }}
                                        </span>
                                        <span v-else>
                                            0
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Nombre de la/s editorial/es con la/s que trabaja/n
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <!-- <div style="max-height: 400px; overflow-y: auto; overflow-x: auto;"> -->
                    <table style="width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 14px;">
                        <thead style="background-color: #f5f5f5 !important;-webkit-print-color-adjust: exact; position: sticky; top: 0; z-index: 2;">
                            <tr>
                                <th width="300" style="padding: 10px; border: 1px solid #ccc; text-align: left; min-width: 220px; max-width: 220px; overflow-wrap: break-word;">
                                    Nombre del Libro / Área
                                </th>
                                <th v-for="nivel in array_Lista_Niveles" :key="nivel.idnivel" style="padding: 10px; border: 1px solid #ccc; text-align: center; min-width: 120px; max-width: 120px; overflow-wrap: break-word;">
                                    {{ nivel.nombrenivel }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(area, index) in ficheroData.editoriales" :key="index" style="border-bottom: 1px solid #edf2f7;">
                                <!-- Nombre del libro / área -->
                                <td style="min-width: 220px; max-width: 220px; padding: 6px 8px; border: 1px solid #ccc; overflow-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">
                                    {{ area.nombre }}
                                </td>
                                <!-- Editoriales por grado -->
                                <td v-for="n in 15" :key="`${index}-${n}`" style="min-width: 120px; max-width: 120px; padding: 6px 8px; border: 1px solid #ccc; text-align: center; overflow-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">
                                    <span v-if="area.grados[`grado_${n}`]">
                                        {{
                                                (() => {
                                                    const editorialId = area.grados[`grado_${n}`];
                                                    const editorial = array_Lista_Editoriales.find(e => e.edi_id === editorialId);
                                                    return editorial ? editorial.edi_nombre : '';
                                                })()
                                            }}
                                    </span>
                                    <span v-else style="color: #999;">--</span>
                                </td>
                            </tr>
                            <!-- Mensaje si no hay datos -->
                            <tr v-if="ficheroData.editoriales.length === 0">
                                <td colspan="16" style="border: 1px solid #ccc; padding: 8px; text-align: center; color: #777; font-style: italic; min-width: 100%; max-width: 100%; overflow-wrap: break-word;">
                                    No hay libros o áreas de otras editoriales registrados.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- </div> -->
                </td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid #000; font-weight: bold; background-color: #fafafa !important;-webkit-print-color-adjust: exact; padding: 6px;" align="center">
                    Observación
                </td>
            </tr>
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <div v-if="Array_Fichero_Mercado_Cabecera.length && Array_Fichero_Mercado_Cabecera[0].fm_observacion">
                        {{ Array_Fichero_Mercado_Cabecera[0].fm_observacion }}
                    </div>
                    <div v-else style="color: #777; font-style: italic; text-align: center; padding: 8px; width: 100%;">
                        📝 No se registró ninguna observación para este fichero.
                    </div>
                </td>
            </tr>
            <!-- Sección: Fechas importantes -->
            <tr>
                <td colspan="2" align="center" style="border: 1px solid #000; padding: 14px;">
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; font-size: 14px;">
                        <!-- Fecha de actualización -->
                        <div v-if="Array_Fichero_Mercado_Cabecera.length && Array_Fichero_Mercado_Cabecera[0].updated_at" style="display: flex; flex-direction: column; align-items: center;">
                            <span style="font-weight: bold; color: #555;">📅 Fecha Muestreo / Actualización</span>
                            <span>{{ Array_Fichero_Mercado_Cabecera[0].updated_at || '---' }}</span>
                        </div>
                        <!-- Fecha de aprobación -->
                        <div v-if="Array_Fichero_Mercado_Cabecera.length && Array_Fichero_Mercado_Cabecera[0].info_aprobacion && Array_Fichero_Mercado_Cabecera[0].fm_estado == '3'" style="display: flex; flex-direction: column; align-items: center;">
                            <span style="font-weight: bold; color: #555;">✅ Fecha Definición / Aprobación</span>
                            <span>
                                {{
                                    (() => {
                                        try {
                                            return JSON.parse(Array_Fichero_Mercado_Cabecera[0].info_aprobacion).fecha_aprobacion || '---';
                                        } catch (e) {
                                            return '---';
                                        }
                                    })()
                                }}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
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
        }
    },
    methods: {
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
                await me.conversionJSON_factores_inciden_compra();
                await me.conversionJSON_niveles_educativos();
                await me.consersionJSON_personalPlantel();
                await me.consersionJSON_valorPension();
                await me.consersionJSON_numeroAulas();
                await me.consersionJSON_estudiantesPorAula();
                await me.consersionJSON_editoriales();
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
        getEditorialesActivasTodo() {
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
        getEntregaMuestrasTodo() {
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
                        reject("getNivelesTodo", error);
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
                        reject("getTraer_Datos_Fichero_x_fmd_id", error);
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
                        reject("getTraer_Datos_Fichero_x_fmd_id", error);
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
    },
};
</script>

<style scoped>
.stylevalidarinput {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.estilo-borde {
    border: 2px solid #007bff;
    /* azul intenso */
    border-radius: 8px;
    padding: 16px;
    margin-top: 2px;
    /* background-color: #f0f8ff; */
    /* azul muy claro */
}

.texto-claro {
    color: #333;
    font-size: 14px;
}

.botones-reporte {
    display: flex;
    justify-content: center;
    gap: 1rem;
    /* espacio entre botones */
    flex-wrap: wrap;
    /* se adapta si el espacio es muy pequeño */
    margin-top: 1rem;
}

.botones-reporte .vs-button {
    flex: 0 0 30%;
    /* cada uno ocupa 48% del ancho con 2% de espacio en total */
}

.informacionformhijodehijo {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
